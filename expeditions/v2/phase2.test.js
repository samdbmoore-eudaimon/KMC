import test from "node:test";
import assert from "node:assert/strict";
import { makeFixtureBlueprint, registerFixtureHooks, FIXTURE_KIND } from "./fixture.js";
import { Driver } from "./test-helpers.js";
import { createRun } from "./run.js";
import { forecastEnemyPhase } from "./enemy.js";
import { reduceCommand } from "./actions.js";
import { offsetKey } from "./hex.js";
import { getPuzzleHooks, registerPuzzleHooks } from "./puzzle-hooks.js";
import { cloneState, recomputeOutputs } from "./rules.js";

registerFixtureHooks();
const K = offsetKey;
registerPuzzleHooks("fixture-sectors", {
  ...getPuzzleHooks(FIXTURE_KIND),
  evaluate: (puzzle, content) => { const valid = content.switches.every((v, i) => v === puzzle.solutionParameters.solution[i]); return { valid, outputTruth: { bridge: valid, shelter: valid, "beam-north": valid, "beam-south": valid } }; },
  sectorFill: (puzzle, content) => ({ north: content.switches[0] === 1, south: content.switches[3] === 1 }),
  coverage: (puzzle, content) => ({ coveredCells: content.switches[0] === 1 ? puzzle.solutionParameters.cells : [], socketsCovered: true }),
  commissionCheck: (puzzle, content, ctx) => {
    const sockets = puzzle.solutionParameters.sockets || [];
    return sockets.every((c) => !ctx.suppressedShelterCells.includes(c)) ? { ok: true } : { ok: false, reasonCode: "socket-suppressed", reasonParams: { sockets } };
  },
});

function sectorRun(extra = {}) {
  const bp = makeFixtureBlueprint({ enemyWake: 5 });
  bp.puzzle.kind = "fixture-sectors";
  bp.puzzle.lockGroups.push({ id: "nest-north", anchor: K(9, 1), memberIds: [], effectKinds: [] }, { id: "nest-south", anchor: K(8, 7), memberIds: [], effectKinds: [] });
  bp.nests = [{ sectorId: "north", groupId: "nest-north" }, { sectorId: "south", groupId: "nest-south" }];
  bp.outputs.push({ id: "beam-north", label: "North beam", trigger: "phase-start", effect: { kind: "beam", sector: "north" } }, { id: "beam-south", label: "South beam", trigger: "phase-start", effect: { kind: "beam", sector: "south" } });
  bp.hazards = [];
  bp.enemies.push({ id: "scruffcrow-n", ruleId: "hunter", artId: "scruffcrow", wakePhase: 1, position: K(10, 6), sector: "north" });
  Object.assign(bp, extra);
  const s = createRun({ blueprint: bp, cardIds: ["bushel", "furrow", "pip"], runId: "n" });
  s.puzzleActive = { content: { switches: [1, 0, 1, 1] }, selectedOutputIds: ["beam-north"] };
  recomputeOutputs(s);
  return s;
}
const end = (s) => reduceCommand(s, { type: "end-round", heroId: null, expectedRevision: s.revision, payload: { forecastRevision: s.revision } }).state;

test("a powered beam suppresses its sector's enemy and covers its nest; an uncovered non-empty sector damages the orchard", () => {
  const s = sectorRun();
  const intent = forecastEnemyPhase(s).intents.find((i) => i.enemyId === "scruffcrow-n");
  assert.equal(intent.verb, "suppressed");
  assert.equal(intent.sector, "north");
  const after = end(s);
  assert.equal(after.orchardIntegrity, 20 - 2, "north covered, south uncovered and non-empty: 1+tier");
  assert.ok(after.events.some((e) => e.type === "beam-active"));
  const bare = sectorRun();
  bare.puzzleActive.selectedOutputIds = [];
  recomputeOutputs(bare);
  assert.equal(forecastEnemyPhase(bare).intents.find((i) => i.enemyId === "scruffcrow-n").verb, "strike");
  assert.equal(end(bare).orchardIntegrity, 20 - 4, "both sectors uncovered");
});

test("Stabilise on a nest group or a Sustain Hold prevents its nest damage; empty sectors never contribute", () => {
  const s = sectorRun();
  const sustainHex = s.blueprint.stations.find((x) => x.id === "sustain").hex;
  const [q, r] = sustainHex.split(",").map(Number);
  const d = new Driver(cloneState(s));
  d.state.heroes.find((h) => h.id === "pip").position = `${q},${r + 1}`;
  d.cmd("stabilise", "pip", { targetId: "nest-south" });
  d.endRound();
  assert.equal(d.state.orchardIntegrity, 20, "S6 >= power 4 on the south nest group");
  const held = new Driver(cloneState(s));
  held.state.heroes.find((h) => h.id === "pip").position = sustainHex;
  held.cmd("hold", "pip", { targetId: "sustain" });
  held.endRound();
  assert.equal(held.state.orchardIntegrity, 20);
  const empty = sectorRun();
  empty.puzzleActive.content = { switches: [1, 0, 1, 0] };
  recomputeOutputs(empty);
  assert.equal(end(empty).orchardIntegrity, 18, "only the north nest contributes; south is empty in the committed pattern");
});

test("shelter suppression invalidates commissioning for the phase, then expires; protection prevents it", () => {
  const s = sectorRun({ hazards: [{ id: "roots-fall", sites: [], mutation: { kind: "suppress-shelter", groupId: "nest-north", cells: [K(3, 4)] } }] });
  s.puzzleActive.selectedOutputIds = [];
  s.blueprint.puzzle.solutionParameters.sockets = [K(3, 4)];
  s.blueprint.puzzle.solutionParameters.cells = [K(3, 4)];
  const forecast = forecastEnemyPhase(s);
  assert.equal(forecast.hazards[0].mutation.applied, true);
  const after = end(s);
  assert.deepEqual(after.phaseEffects.suppressedShelterCells, [], "expired at the next round start");
  const guarded = cloneState(s);
  guarded.phaseEffects.grants.push({ id: "w", kind: "stabilise", targetId: "nest-north", amount: 4, sourceHoldId: null, source: "cast" });
  assert.equal(forecastEnemyPhase(guarded).hazards[0].mutation.applied, false);
});

test("Rewinder turns a ranked unprotected member from range 3 with sight, or strikes the nearest hero when all are protected", () => {
  const bp = makeFixtureBlueprint({ enemyWake: 5, extraEnemies: [{ id: "crosswind-1", ruleId: "rewinder", artId: "crosswind", wakePhase: 1, position: K(8, 4) }] });
  bp.enemies = bp.enemies.filter((e) => e.id !== "hookmole-1");
  bp.hazards = [];
  const s = createRun({ blueprint: bp, cardIds: ["cornix", "bushel", "pip"], runId: "r" });
  s.puzzleActive = { content: { switches: [1, 0, 1, 1] }, selectedOutputIds: ["bridge", "shelter"] };
  recomputeOutputs(s);
  const intent = forecastEnemyPhase(s).intents[0];
  assert.equal(intent.verb, "disrupt");
  assert.equal(intent.puzzleChange.kind, "rewind");
  const after = end(s);
  assert.equal(after.puzzleActive.content.switches[0], 0);
  const all = cloneState(s);
  all.phaseEffects.grants.push({ id: "l", kind: "lock", targetId: "network", amount: 9, sourceHoldId: null, source: "cast" });
  const strike = forecastEnemyPhase(all).intents[0];
  assert.equal(strike.verb, "strike");
  assert.ok(["cornix", "bushel", "pip"].includes(strike.targetId));
});

test("inactive enemies still occupy their tile, and an enemy never walks through or onto a figure", () => {
  const bp = makeFixtureBlueprint({ enemyWake: 1 });
  const s = createRun({ blueprint: bp, cardIds: ["bushel", "furrow", "pip"], runId: "o" });
  s.puzzleActive = { content: { switches: [0, 0, 0, 0] }, selectedOutputIds: [] };
  const control = bp.puzzle.controlHex;
  const [cq, cr] = control.split(",").map(Number);
  s.enemyStates[0].position = `${cq + 3},${cr}`;
  s.heroes.find((h) => h.id === "pip").position = `${cq + 1},${cr}`;
  const d = new Driver(s);
  const intent = forecastEnemyPhase(d.state).intents[0];
  assert.equal(intent.verb, "strike", "no disruptable member in an unsolved empty grid: strikes control");
  assert.ok(!intent.path.includes(d.hero("pip").position), "planned path avoids the occupied hex");
});
