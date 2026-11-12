// Playthrough recovery, 3 October 2026: Sam's two movement cases, reproduced from his saved trace, plus the guidance helpers.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { registerOrchardPuzzleHooks } from "./puzzles/index.js";
import { replayRun } from "./run.js";
import { reachableHexes, cloneState } from "./rules.js";
import { previewCommand } from "./actions.js";
import { nextStep, raisedPassageNear, controlDistance } from "./ui/next-step.js";
import { actionHelpText } from "./ui/action-help-text.js";
import { listCommands } from "./actions.js";

registerOrchardPuzzleHooks();
const trace = JSON.parse(fs.readFileSync(new URL("../../docs/expeditions/v2/evidence/playthrough-recovery-20261003/sam-playthrough-trace.json", import.meta.url), "utf8"));

test("case 1 reproduced: Sorrel on the lower permanent bridge (3,6) has no way to the far bank because 4,6 is a hedge", () => {
  const { state, ok } = replayRun(trace);
  assert.equal(ok, true);
  const sorrel = state.heroes.find((h) => h.id === "sorrel");
  assert.equal(sorrel.position, "3,6");
  const tiles = new Map(state.blueprint.tiles.map((t) => [`${t.q},${t.r}`, t]));
  assert.equal(tiles.get("3,6").terrain, "bridge");
  assert.equal(tiles.get("3,6").passageOutputId, undefined, "permanent bridge, not puzzle controlled");
  assert.equal(tiles.get("4,6").terrain, "hedge", "the east exit is a decorative hedge");
  const reach = reachableHexes(state, "sorrel", 12).map((r) => r.key);
  assert.ok(reach.length > 20, "she can still walk back west");
  assert.equal(reach.some((k) => { const [q] = k.split(",").map(Number); const t = tiles.get(k); return t && q >= 4 && k.endsWith(",6"); }), false, "nothing east of the lower bridge is reachable from it");
});

test("case 2 reproduced: Tuppence beside the controlled bridge (4,4) cannot cross it because the puzzle has not been activated", () => {
  const { state } = replayRun(trace);
  const tuppence = state.heroes.find((h) => h.id === "tuppence");
  assert.equal(tuppence.position, "3,4");
  assert.deepEqual(state.passages["4,4"], { open: false, closingPending: false });
  assert.equal(state.activeOutputs.bridge, false);
  const reach = reachableHexes(state, "tuppence", 8).map((r) => r.key);
  assert.equal(reach.includes("5,4"), false, "the far bank is not reachable while the bridge is raised");
  assert.deepEqual(raisedPassageNear(state, "tuppence"), { hex: "4,4" });
  const raised = cloneState(state);
  raised.passages["4,4"] = { open: true, closingPending: false };
  assert.equal(reachableHexes(raised, "tuppence", 8).map((r) => r.key).includes("5,4"), true, "once powered the same hero crosses");
  assert.equal(previewCommand(state, { type: "move", heroId: "tuppence", expectedRevision: state.revision, payload: { destination: "5,4", path: null } }).legal, false);
});

test("next step names one action and a board place, and distinguishes free drafting from paid activation", () => {
  const { state } = replayRun(trace);
  const step = nextStep(state);
  assert.equal(step.id, "walk-to-control");
  assert.equal(step.focus, "control");
  assert.match(step.text, /for free/);
  assert.match(step.text, /standing on or beside it/);
  const control = state.blueprint.stations.find((s) => s.id === "control");
  const near = cloneState(state);
  near.heroes[0].position = control.hex;
  assert.equal(nextStep(near).id, "activate");
  assert.ok(controlDistance(near).adjacent.length >= 1);
  const lit = cloneState(near);
  lit.puzzleValid = true;
  lit.activeOutputs = { bridge: true, shelter: true, roots: false, storm: false };
  assert.equal(nextStep(lit).id, "charge");
  for (const id of ["number", "shape", "sustain"]) lit.stationStates[id].charge = lit.blueprint.stations.find((s) => s.id === id).capacity;
  assert.equal(nextStep(lit).id, "hold");
  lit.holds = { number: { holdId: "a", heroId: "x" }, shape: { holdId: "b", heroId: "y" }, sustain: { holdId: "c", heroId: "z" } };
  assert.equal(nextStep(lit).id, "end");
});

test("every action has purpose, cost, target and an honest reason when unavailable", () => {
  const { state } = replayRun(trace);
  for (const heroId of state.heroes.map((h) => h.id)) {
    for (const row of listCommands(state, heroId)) {
      const text = actionHelpText(state, row, heroId);
      assert.match(text, /Cost: \d action/);
      assert.match(text, /Target: /);
      assert.match(text, row.available ? /Available now/ : /Not available:/);
    }
  }
});
