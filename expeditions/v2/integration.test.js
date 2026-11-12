// Engine x Codex puzzle hooks. These tests read Codex's puzzles/ modules but never edit them.
import test from "node:test";
import assert from "node:assert/strict";
import { makeFixtureBlueprint } from "./fixture.js";
import { Driver } from "./test-helpers.js";
import { createRun, exportRunRecord, replayRun } from "./run.js";
import { validateBlueprint } from "./schema.js";
import { hexDistance } from "./hex.js";
import { cloneState } from "./rules.js";
import { registerOrchardPuzzleHooks, solvePuzzle } from "./puzzles/index.js";

registerOrchardPuzzleHooks();

const cell = (row, col) => `r${row}c${col}`;
function sudokuBlueprint(tier = 2, enemyWake = 4) {
  const bp = makeFixtureBlueprint({ tier, enemyWake });
  bp.familyId = "four-locks";
  delete bp.fixture;
  const control = bp.puzzle.controlHex;
  const members = [];
  for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) members.push(cell(r, c));
  bp.puzzle = {
    id: "four-locks", kind: "sudoku4", controlId: "control", controlHex: control, draftSchemaVersion: 1, networkGroupId: "network",
    lockGroups: [
      ...[0, 1, 2, 3].map((r) => ({ id: `row-${r}`, anchor: control, memberIds: [0, 1, 2, 3].map((c) => cell(r, c)), effectKinds: ["jam"] })),
      { id: "network", anchor: control, memberIds: members, effectKinds: ["jam"] },
    ],
    size: 4,
    givens: [{ row: 0, col: 0, value: 1 }, { row: 3, col: 3, value: 4 }],
    cages: [
      { id: "c0", cellIds: [cell(0, 1), cell(1, 1)], sum: 5 }, { id: "c1", cellIds: [cell(0, 2), cell(0, 3)], sum: 6 }, { id: "c2", cellIds: [cell(1, 0), cell(2, 0)], sum: 6 },
      { id: "c3", cellIds: [cell(1, 2), cell(2, 2)], sum: 4 }, { id: "c4", cellIds: [cell(2, 1), cell(3, 1)], sum: 5 }, { id: "c5", cellIds: [cell(2, 3), cell(3, 2)], sum: 3 },
    ],
    outputs: [{ id: "bridge", cost: 2 }, { id: "shelter", cost: 3 }, { id: "roots", cost: 4 }, { id: "storm", cost: 5 }],
    outputBudget: 7,
    solutionParameters: {},
  };
  bp.outputs = [
    { id: "bridge", label: "Bridge", trigger: "on-commit", effect: { kind: "passage" } },
    { id: "shelter", label: "Shelter", trigger: "phase-start", effect: { kind: "shelter", amount: 2, targetIds: ["number", "shape", "sustain"] } },
    { id: "roots", label: "Roots", trigger: "phase-start", effect: { kind: "roots" } },
    { id: "storm", label: "Storm", trigger: "phase-start", effect: { kind: "storm" } },
  ];
  bp.commission = { poweredCount: 2, selectableOutputIds: ["bridge", "shelter", "roots", "storm"] };
  delete bp.puzzle.defaultOutputIds;
  return bp;
}

const T2_SQUAD = ["cornix", "kernel", "beeswax"];
const JOBS = { cornix: "number", kernel: "shape", beeswax: "sustain" };

function solveInto(d, bp) {
  const grid = solvePuzzle(bp.puzzle).solutions[0].grid;
  for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) {
    if (d.state.puzzleDraft.content.grid[r][c] !== grid[r][c]) d.cmd("edit-draft", null, { puzzleId: "four-locks", edit: { type: "set-cell", row: r, col: c, value: grid[r][c] } });
  }
  d.cmd("edit-draft", null, { puzzleId: "four-locks", edit: { type: "select-outputs", outputIds: ["bridge", "shelter"] } });
}

test("the Four Locks blueprint built on the engine validates and uses Codex's real Sudoku hooks end to end", () => {
  const bp = sudokuBlueprint();
  assert.equal(validateBlueprint(bp).ok, true, JSON.stringify(validateBlueprint(bp).errors));
  const d = new Driver(createRun({ blueprint: bp, cardIds: T2_SQUAD, runId: "s" }));
  d.state.heroes.find((h) => h.id === "cornix").position = "1,4";
  d.state.heroes.find((h) => h.id === "kernel").position = "0,4";
  d.state.heroes.find((h) => h.id === "beeswax").position = "0,5";
  const wrong = d.preview("edit-draft", null, { puzzleId: "four-locks", edit: { type: "set-cell", row: 0, col: 0, value: 2 } });
  assert.equal(wrong.legal, false);
  assert.equal(wrong.reasonCode, "sudoku-given");
  solveInto(d, bp);
  const costly = d.preview("edit-draft", null, { puzzleId: "four-locks", edit: { type: "select-outputs", outputIds: ["roots", "storm"] } });
  assert.equal(costly.reasonCode, "puzzle-output-budget");
  d.cmd("operate", "cornix", { draftRevision: d.state.puzzleDraft.revision, outputIds: ["bridge", "shelter"] });
  assert.equal(d.state.activeOutputs.bridge, true);
  assert.equal(d.state.activeOutputs.shelter, true);
  assert.equal(d.state.activeOutputs.roots, false);
  assert.equal(d.state.passages["4,4"].open, true);
});

test("a full Tier 2 run wins through the real reducer with Codex's Sudoku hooks and replays identically", () => {
  const bp = sudokuBlueprint(2, 5);
  const d = new Driver(createRun({ blueprint: bp, cardIds: T2_SQUAD, runId: "s2" }));
  assert.equal(d.approach("cornix", bp.puzzle.controlHex, 1), true);
  solveInto(d, bp);
  d.cmd("operate", "cornix", { draftRevision: d.state.puzzleDraft.revision, outputIds: ["bridge", "shelter"] });
  const station = (id) => d.state.blueprint.stations.find((s) => s.id === JOBS[id]);
  for (let round = 1; round <= 5 && d.state.status === "playing"; round += 1) {
    for (const id of T2_SQUAD) {
      const st = station(id);
      if (hexDistance(d.hero(id).position, st.hex) > 1) d.approach(id, st.hex, 1);
      while (d.hero(id).ap > 0 && hexDistance(d.hero(id).position, st.hex) <= 1 && d.state.stationStates[JOBS[id]].charge < st.capacity) d.cmd("calibrate", id, { targetId: JOBS[id] });
    }
    if (T2_SQUAD.every((id) => d.state.stationStates[JOBS[id]].charge >= 6)) for (const id of T2_SQUAD) if (d.hero(id).ap > 0) d.cmd("hold", id, { targetId: JOBS[id] });
    d.endRound();
  }
  assert.equal(d.state.status, "won", JSON.stringify(d.state.lossReason));
  const record = exportRunRecord(d.state);
  const replay = replayRun(JSON.parse(JSON.stringify(record)));
  assert.equal(replay.ok, true, replay.reason);
});

test("a Hookmole jam clears the lowest non-given cell of the committed grid and the lock groups block it", () => {
  const bp = sudokuBlueprint(2, 1);
  const make = () => {
    const d = new Driver(createRun({ blueprint: bp, cardIds: T2_SQUAD, runId: "j" }));
    d.state.heroes.find((h) => h.id === "cornix").position = "1,4";
    d.state.heroes.find((h) => h.id === "kernel").position = "0,4";
    d.state.heroes.find((h) => h.id === "beeswax").position = "0,5";
    solveInto(d, bp);
    d.cmd("operate", "cornix", { draftRevision: d.state.puzzleDraft.revision, outputIds: ["bridge", "shelter"] });
    d.state.enemyStates[0].position = "3,4";
    return d;
  };
  const open = make();
  const forecast = open.preview("wait", "kernel", {});
  const jam = forecast.forecastAfter.intents[0];
  assert.equal(jam.verb, "disrupt");
  assert.equal(jam.puzzleChange.memberId, "r0c1", "lowest non-given filled cell");
  open.endRound();
  assert.equal(open.state.puzzleActive.content.grid[0][1], null);
  assert.equal(open.state.activeOutputs.bridge, false);
  const guarded = make();
  guarded.state = cloneState(guarded.state);
  guarded.state.phaseEffects.grants.push({ id: "g", kind: "lock", targetId: "network", amount: 7, source: "cast", sourceHoldId: null });
  guarded.endRound();
  assert.equal(guarded.state.activeOutputs.bridge, true, "network lock 7 >= power 5");
});
