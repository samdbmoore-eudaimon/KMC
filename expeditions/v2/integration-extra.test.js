// Engine x Codex hooks for rotation, balance, nonogram and packing, driven through real draft edits, paid
// Operate, forecast/resolution, corruption/protection and replay. FIXTURES ONLY: the puzzle data below is a
// small explicit engine fixture built on the production 92-tile footprint; none of it is a certified bank entry.
import test from "node:test";
import assert from "node:assert/strict";
import { makeFixtureBlueprint } from "./fixture.js";
import { Driver } from "./test-helpers.js";
import { createRun, exportRunRecord, replayRun } from "./run.js";
import { forecastEnemyPhase, evaluateVictory } from "./enemy.js";
import { offsetKey } from "./hex.js";
import { cloneState, grantStrength } from "./rules.js";
import { registerOrchardPuzzleHooks } from "./puzzles/index.js";
import { saveActiveRun, loadActiveRun } from "./persistence.js";

registerOrchardPuzzleHooks();
const K = offsetKey;
const SQUAD = ["cornix", "bushel", "pip"];

function groups(control, ids, extra = []) {
  return [{ id: "network", anchor: control, memberIds: ids, effectKinds: ["jam"] }, ...extra.map((g) => ({ anchor: control, memberIds: [], effectKinds: ["jam"], ...g }))];
}

function build({ familyId, puzzle, outputs, commission, tier = 1, enemies = [], hazards = [], nests, passageOutput = null }) {
  const bp = makeFixtureBlueprint({ tier, enemyWake: 5 });
  delete bp.fixture;
  bp.familyId = familyId;
  bp.enemies = enemies;
  bp.hazards = hazards;
  if (nests) bp.nests = nests;
  for (const tile of bp.tiles) {
    if (tile.passageOutputId) {
      if (passageOutput) tile.passageOutputId = passageOutput;
      else delete tile.passageOutputId;
    }
  }
  bp.puzzle = { id: familyId, controlId: "control", controlHex: bp.stations.find((s) => s.id === "control").hex, draftSchemaVersion: 1, networkGroupId: "network", solutionParameters: {}, ...puzzle };
  bp.outputs = outputs;
  bp.commission = commission;
  return bp;
}
const run = (bp, cards = SQUAD, id = "x") => createRun({ blueprint: bp, cardIds: cards, runId: id });
const control = (bp) => bp.puzzle.controlHex;
const hint3 = (d, puzzleId) => d.cmd("request-hint", null, { puzzleId, stage: 3 });
const select = (d, puzzleId, outputIds) => d.cmd("edit-draft", null, { puzzleId, edit: { type: "select-outputs", outputIds } });
const operate = (d, heroId, outputIds) => d.cmd("operate", heroId, { draftRevision: d.state.puzzleDraft.revision, outputIds, lockGroupId: null });
const hunter = (position, sector) => ({ id: "scruffcrow-1", ruleId: "hunter", artId: "scruffcrow", wakePhase: 1, position, sector });
const rewinder = (position) => ({ id: "crosswind-1", ruleId: "rewinder", artId: "crosswind", wakePhase: 1, position });

// ------------------------------------------------------------------ rotation
const ROTATION_HEX = { A: K(3, 3), B: K(3, 5), C: K(4, 3), O: K(4, 5) };
function rotationBlueprint(extra = {}) {
  const tokens = [
    ...[["A", [2, 3, 4, 5, 6, 7]], ["B", [3, 4, 5, 6, 7, 8]], ["C", [1, 2, 3, 4, 5, 6]]].map(([id, faces]) => ({ id, faces, kind: "number", orientation: 0, given: false, hex: ROTATION_HEX[id] })),
    { id: "O", faces: ["=", "+", "−", "×", "÷", null], kind: "operator", orientation: 0, given: false, hex: ROTATION_HEX.O },
    ...[["eq", "operator", "="], ["plus", "operator", "+"], ["minus", "operator", "−"], ["24", "number", 24], ["11", "number", 11], ["1", "number", 1]].map(([id, kind, value]) => ({ id, kind, value, given: true })),
  ];
  const tracks = [{ id: "eq1", tokenIds: ["A", "O", "B", "eq", "24"] }, { id: "eq2", tokenIds: ["B", "plus", "C", "eq", "11"] }, { id: "eq3", tokenIds: ["C", "minus", "A", "eq", "1"] }];
  const c = K(4, 4);
  return build({
    familyId: "turning-ravine",
    puzzle: { kind: "equation-wheels", id: "turning-ravine", tokens, tracks, maxActiveOutputs: 2, minimumTrueTracksForCommission: 3, defaultOutputIds: ["eq1", "eq2"], lockGroups: groups(c, ["A", "B", "C", "O"], ["A", "B", "C", "O"].map((id) => ({ id: `wheel-${id}`, memberIds: [id] }))) },
    outputs: [
      { id: "eq1", label: "Bridge", trigger: "on-commit", effect: { kind: "passage" } },
      { id: "eq2", label: "Shelter", trigger: "phase-start", effect: { kind: "shelter", amount: 2, targetIds: ["number", "shape", "sustain"] } },
      { id: "eq3", label: "Roots", trigger: "phase-start", effect: { kind: "roots" } },
    ],
    commission: { poweredCount: 2, selectableOutputIds: ["eq1", "eq2", "eq3"] },
    passageOutput: "eq1",
    ...extra,
  });
}

test("rotation: real edits reject fixed/illegal wheels; worked solution + Operate powers a bridge and shelter", () => {
  const bp = rotationBlueprint();
  const d = new Driver(run(bp));
  assert.equal(d.preview("edit-draft", null, { puzzleId: "turning-ravine", edit: { type: "rotate-wheel", wheelId: "24", delta: 1 } }).legal, false);
  assert.equal(d.preview("edit-draft", null, { puzzleId: "turning-ravine", edit: { type: "rotate-wheel", wheelId: "A", delta: 2 } }).legal, false);
  d.cmd("edit-draft", null, { puzzleId: "turning-ravine", edit: { type: "rotate-wheel", wheelId: "A", delta: 1 } });
  d.cmd("edit-draft", null, { puzzleId: "turning-ravine", edit: { type: "reset-draft" } });
  assert.equal(d.state.puzzleDraft.content.orientations.A, 0);
  d.approach("cornix", control(bp), 1);
  hint3(d, "turning-ravine");
  select(d, "turning-ravine", ["eq1", "eq2"]);
  assert.equal(d.preview("edit-draft", null, { puzzleId: "turning-ravine", edit: { type: "select-outputs", outputIds: ["eq1", "eq2", "eq3"] } }).legal, false, "max two active outputs");
  operate(d, "cornix", ["eq1", "eq2"]);
  assert.deepEqual(d.state.activeOutputs, { eq1: true, eq2: true, eq3: false });
  const bridge = Object.keys(d.state.passages)[0];
  assert.equal(d.state.passages[bridge].open, true);
  assert.equal(replayRun(exportRunRecord(d.state)).ok, true);
});

test("rotation: a Rewinder turns the highest-degree wheel; a wheel lock moves the rewind to the next ranked wheel", () => {
  const bp = rotationBlueprint({ enemies: [rewinder(K(7, 4))] });
  const make = () => {
    const d = new Driver(run(bp));
    d.approach("cornix", control(bp), 1);
    hint3(d, "turning-ravine");
    select(d, "turning-ravine", ["eq1", "eq2"]);
    operate(d, "cornix", ["eq1", "eq2"]);
    const s = cloneState(d.state);
    s.enemyStates[0].position = K(4, 6);
    return new Driver(s);
  };
  const open = make();
  const intent = forecastEnemyPhase(open.state).intents[0];
  assert.equal(intent.verb, "disrupt");
  assert.equal(intent.puzzleChange.memberId, "A");
  open.endRound();
  assert.equal(open.state.activeOutputs.eq1, false, "A turned: eq1 and eq3 are false");
  assert.equal(open.state.activeOutputs.eq2, true, "eq2 does not use A");
  const locked = make();
  locked.state.phaseEffects.grants.push({ id: "w", kind: "lock", targetId: "wheel-A", amount: 4, source: "cast", sourceHoldId: null });
  assert.equal(forecastEnemyPhase(locked.state).intents[0].puzzleChange.memberId, "B", "protected wheel skipped by ranking");
  locked.endRound();
  assert.equal(locked.state.activeOutputs.eq2, false);
  assert.equal(locked.state.activeOutputs.eq1, false);
  assert.equal(grantStrength(locked.state, "lock", "wheel-A"), 0, "grants expire at phase end");
});

// ------------------------------------------------------------------ balance
const balanceLoads = [1, 2, 3, 4, 5, 7].map((value, i) => ({ id: `load-${i}`, value, visible: true, candidates: [] }));
function balanceBlueprint(puzzle = {}, extra = {}) {
  const c = K(4, 4);
  return build({
    familyId: "unequal-crossing",
    puzzle: { kind: "balance", id: "unequal-crossing", loads: balanceLoads, target: 11, panCapacity: { left: 11, right: 11 }, usedCount: 6, reserveCount: 0, maxPanCount: { left: 4, right: 4 }, incompatiblePairs: [], hiddenLoadId: null, comparisonAllowance: 0, defaultOutputIds: ["balance-crossing"], lockGroups: groups(c, balanceLoads.map((l) => l.id), [{ id: "left-pan" }, { id: "right-pan" }]), ...puzzle },
    outputs: [{ id: "balance-crossing", label: "Crossing", trigger: "on-commit", effect: { kind: "passage" } }],
    commission: { poweredIds: ["balance-crossing"] },
    passageOutput: "balance-crossing",
    ...extra,
  });
}

test("balance: allocation edits, Operate opens the crossing, a Jammer returns the heaviest assigned load, lock groups guard it", () => {
  const bp = balanceBlueprint({}, { enemies: [{ id: "hookmole-1", ruleId: "jammer", artId: "hookmole", wakePhase: 1, position: K(10, 2) }] });
  const d = new Driver(run(bp));
  assert.equal(d.preview("edit-draft", null, { puzzleId: "unequal-crossing", edit: { type: "assign-load", loadId: "nope", pan: "left" } }).legal, false);
  assert.equal(d.preview("edit-draft", null, { puzzleId: "unequal-crossing", edit: { type: "assign-load", loadId: "load-0", pan: "middle" } }).legal, false);
  assert.equal(d.preview("operate", "cornix", { draftRevision: 0, outputIds: ["balance-crossing"] }).legal, false);
  d.approach("cornix", control(bp), 1);
  hint3(d, "unequal-crossing");
  operate(d, "cornix", ["balance-crossing"]);
  assert.equal(d.state.activeOutputs["balance-crossing"], true);
  const guarded = new Driver(cloneState(d.state));
  d.state.enemyStates[0].position = K(3, 4);
  guarded.state.enemyStates[0].position = K(3, 4);
  const forecast = forecastEnemyPhase(d.state);
  assert.equal(forecast.intents[0].puzzleChange.memberId, "load-5", "highest value assigned load");
  d.endRound();
  assert.equal(d.state.activeOutputs["balance-crossing"], false);
  const side = guarded.state.puzzleActive.content.assignments["load-5"];
  guarded.state.phaseEffects.grants.push({ id: "g", kind: "lock", targetId: "network", amount: 9, source: "cast", sourceHoldId: null });
  guarded.endRound();
  assert.equal(guarded.state.puzzleActive.content.assignments["load-5"], side);
});

test("balance: hidden-value weighing is irreversible, repeats are free, contradictory inference is refused, long save/resume replays", () => {
  const loads = balanceLoads.map((l) => (l.id === "load-5" ? { ...l, visible: false, candidates: [3, 5, 7] } : l));
  const bp = balanceBlueprint({ loads, hiddenLoadId: "load-5", comparisonAllowance: 2 });
  const d = new Driver(run(bp));
  const weigh = (left, right) => d.cmd("compare-loads", null, { leftLoadIds: left, rightLoadIds: right });
  const first = weigh(["load-5"], ["load-2"]);
  assert.equal(first.comparison.result, "left-heavier", "hidden 7 outweighs 3");
  assert.equal(weigh(["load-2"], ["load-5"]).comparison.free, true);
  assert.equal(d.preview("compare-loads", null, { leftLoadIds: ["load-5"], rightLoadIds: ["missing"] }).reasonCode, "unknown-load");
  d.cmd("undo", null, {}, { expectLegal: false });
  assert.equal(d.state.comparisonsUsed, 1);
  assert.equal(d.preview("edit-draft", null, { puzzleId: "unequal-crossing", edit: { type: "inferred-value", loadId: "load-5", value: 3 } }).legal, false, "3 contradicts left-heavier");
  d.cmd("edit-draft", null, { puzzleId: "unequal-crossing", edit: { type: "inferred-value", loadId: "load-5", value: 7 } });
  weigh(["load-5"], ["load-3"]);
  assert.equal(d.preview("compare-loads", null, { leftLoadIds: ["load-1"], rightLoadIds: ["load-0"] }).reasonCode, "no-comparisons-left");
  for (let round = 0; round < 4; round += 1) {
    for (const id of SQUAD) { d.cmd("wait", id); d.cmd("wait", id); }
    d.endRound();
  }
  assert.ok(d.state.log.length >= 25);
  const t0 = performance.now();
  const saved = saveActiveRun({ expeditions: { version: 2, scenarios: {}, moduleSetRewarded: false } }, d.state);
  const loaded = loadActiveRun(saved);
  const ms = performance.now() - t0;
  assert.equal(loaded.ok, true);
  assert.equal(loaded.state.comparisonsUsed, 2);
  assert.ok(ms < 2000, `long-log save+replay took ${ms.toFixed(0)} ms`);
});

// ------------------------------------------------------------------ nonogram
const crossClues = [[1], [1], [5], [1], [1]];
function nonogramBlueprint(extra = {}) {
  const c = K(4, 4);
  return build({
    familyId: "maybe-flock",
    puzzle: { kind: "nonogram5", id: "maybe-flock", size: 5, rowClues: crossClues, columnClues: crossClues, givens: [], defaultOutputIds: ["beam-north", "beam-east"], lockGroups: groups(c, [], [...[0, 1, 2, 3, 4].map((r) => ({ id: `row-${r}` })), { id: "nest-south", anchor: K(8, 7) }]) },
    outputs: ["north", "east", "south"].map((sector) => ({ id: `beam-${sector}`, label: `Beam ${sector}`, trigger: "phase-start", effect: { kind: "beam", sector } })),
    commission: { poweredCount: 2, selectableOutputIds: ["beam-north", "beam-east", "beam-south"] },
    nests: [{ sectorId: "south", groupId: "nest-south" }],
    enemies: [hunter(K(10, 6), "south")],
    ...extra,
  });
}

test("nonogram: unknown is not empty; beams suppress their sector and an uncovered nest damages the orchard", () => {
  const bp = nonogramBlueprint();
  const d = new Driver(run(bp));
  assert.equal(d.preview("operate", "cornix", { draftRevision: 0, outputIds: ["beam-north", "beam-east"] }).legal, false);
  assert.equal(d.state.puzzleDraft.content.grid.flat().every((v) => v === "unknown"), true);
  d.approach("cornix", control(bp), 1);
  hint3(d, "maybe-flock");
  select(d, "maybe-flock", ["beam-north", "beam-east"]);
  operate(d, "cornix", ["beam-north", "beam-east"]);
  assert.deepEqual(d.state.activeOutputs, { "beam-north": true, "beam-east": true, "beam-south": false });
  const intent = forecastEnemyPhase(d.state).intents[0];
  assert.equal(intent.verb, "strike", "south sector uncovered: its hunter is not suppressed");
  const before = d.state.orchardIntegrity;
  d.endRound();
  assert.equal(d.state.orchardIntegrity, before - 2, "no environment hazard configured; the uncovered south nest costs 1+tier");
  select(d, "maybe-flock", ["beam-east", "beam-south"]);
  operate(d, "cornix", ["beam-east", "beam-south"]);
  assert.equal(forecastEnemyPhase(d.state).intents[0].verb, "suppressed", "the south beam silences the south hunter");
});

test("nonogram: the lowest filled cell is the corruption target and a row lock shifts it", () => {
  const bp = nonogramBlueprint({ enemies: [{ id: "hookmole-1", ruleId: "jammer", artId: "hookmole", wakePhase: 1, position: K(10, 2) }] });
  const d = new Driver(run(bp));
  d.approach("cornix", control(bp), 1);
  hint3(d, "maybe-flock");
  select(d, "maybe-flock", ["beam-north", "beam-east"]);
  operate(d, "cornix", ["beam-north", "beam-east"]);
  d.state.enemyStates[0].position = K(3, 4);
  assert.equal(forecastEnemyPhase(d.state).intents[0].puzzleChange.memberId, "r0c2");
  d.state.phaseEffects.grants.push({ id: "r", kind: "lock", targetId: "row-0", amount: 9, source: "cast", sourceHoldId: null });
  assert.equal(forecastEnemyPhase(d.state).intents[0].puzzleChange.memberId, "r1c2");
  d.state.phaseEffects.grants = [];
  d.endRound();
  assert.equal(d.state.puzzleActive.content.grid[0][2], "empty");
  assert.equal(d.state.activeOutputs["beam-north"], false);
});

// ------------------------------------------------------------------ packing
const patch = [];
for (let q = -2; q <= 2; q += 1) for (let r = -2; r <= 2; r += 1) if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) <= 2) patch.push(`${q + 3},${r + 4}`);
function packingBlueprint(extra = {}, puzzle = {}) {
  const c = K(4, 4);
  const cells = patch;
  const at = (dq, dr) => `${3 + dq},${4 + dr}`;
  return build({
    familyId: "hollow-bough",
    puzzle: {
      kind: "polyhex", id: "hollow-bough", patchCells: cells, pieces: [{ id: "a", cells: [[0, 0], [1, 0]] }, { id: "b", cells: [[0, 0], [1, 0], [0, 1]] }, { id: "c", cells: [[0, 0], [1, 0], [2, 0]] }],
      sockets: [at(0, 0), at(1, 0), at(0, 1)], forbiddenCells: [at(-2, 0)], approachCells: [at(2, -2), at(-1, 2)], reflectionAllowed: false, forecastCellIds: [at(0, 0)], defaultOutputIds: ["shelter-packing"],
      lockGroups: groups(c, [], [{ id: "patch", anchor: at(0, 0) }, { id: "piece-a" }, { id: "piece-b" }, { id: "piece-c" }]), ...puzzle,
    },
    outputs: [{ id: "shelter-packing", label: "Shelter", trigger: "phase-start", effect: { kind: "shelter", amount: 2, coverage: "puzzle", targetIds: [] } }],
    commission: { poweredIds: ["shelter-packing"] },
    ...extra,
  });
}

test("packing: invalid placements are rejected with reasons, a worked packing covers sockets and shields covered stations", () => {
  const bp = packingBlueprint();
  const d = new Driver(run(bp));
  for (const edit of [{ pieceId: "a", originHex: "99,99", orientation: 0, reflected: false }, { pieceId: "a", originHex: "3,4", orientation: 0, reflected: true }, { pieceId: "zz", originHex: "3,4", orientation: 0, reflected: false }]) {
    assert.equal(d.preview("edit-draft", null, { puzzleId: "hollow-bough", edit: { type: "place-piece", ...edit } }).legal, false);
  }
  assert.equal(d.preview("operate", "cornix", { draftRevision: 0, outputIds: ["shelter-packing"] }).legal, false);
  d.approach("cornix", control(bp), 1);
  hint3(d, "hollow-bough");
  operate(d, "cornix", ["shelter-packing"]);
  assert.equal(d.state.activeOutputs["shelter-packing"], true);
  assert.equal(replayRun(exportRunRecord(d.state)).ok, true);
});

test("packing: shelter suppression blocks commissioning for that phase, protection prevents it, and it expires", () => {
  const cell = `${3},${4}`;
  const bp = packingBlueprint({ tier: 4, hazards: [{ id: "roots-fall", sites: [], mutation: { kind: "suppress-shelter", groupId: "patch", cells: [cell] } }] });
  const d = new Driver(run(bp));
  d.approach("cornix", control(bp), 1);
  hint3(d, "hollow-bough");
  operate(d, "cornix", ["shelter-packing"]);
  const forecast = forecastEnemyPhase(d.state);
  assert.equal(forecast.hazards[0].mutation.applied, true);
  const unmet = evaluateVictory({ ...cloneState(d.state), phaseEffects: { ...d.state.phaseEffects, suppressedShelterCells: [cell] } }).unmet;
  assert.ok(unmet.some((u) => u.code === "packing-socket-suppressed"));
  const guarded = cloneState(d.state);
  guarded.phaseEffects.grants.push({ id: "p", kind: "stabilise", targetId: "patch", amount: 9, source: "cast", sourceHoldId: null });
  assert.equal(forecastEnemyPhase(guarded).hazards[0].mutation.applied, false);
  d.endRound();
  assert.deepEqual(d.state.phaseEffects.suppressedShelterCells, []);
});

test("balance: the reserve-benefit output is derived from a valid allocation, not selected, and fires at phase start", () => {
  const outputs = [{ id: "balance-crossing", label: "Crossing", trigger: "on-commit", effect: { kind: "passage" } }, { id: "reserve-benefit", label: "Reserve choice", trigger: "phase-start", effect: { kind: "reserve-benefit", amount: 2, targetIds: ["shape", "sustain"] } }];
  const bp = balanceBlueprint({}, { outputs, enemies: [] });
  const d = new Driver(run(bp));
  d.approach("cornix", control(bp), 1);
  hint3(d, "unequal-crossing");
  assert.equal(d.state.activeOutputs["reserve-benefit"], false);
  operate(d, "cornix", ["balance-crossing"]);
  assert.equal(d.state.activeOutputs["balance-crossing"], true);
  assert.equal(d.state.activeOutputs["reserve-benefit"], true, "derived from the valid allocation without selection");
});

test("nonogram: an environment mutation earlier in the phase cannot uncover a nest that a phase-start beam covered", () => {
  const bp = nonogramBlueprint({ hazards: [{ id: "roost-drain", sites: [], mutation: { kind: "puzzle" } }], nests: [{ sectorId: "north", groupId: "nest-north" }, { sectorId: "east", groupId: "nest-east" }, { sectorId: "south", groupId: "nest-south" }], enemies: [] });
  bp.puzzle.lockGroups.push({ id: "nest-north", anchor: K(9, 1), memberIds: [], effectKinds: [] }, { id: "nest-east", anchor: K(10, 4), memberIds: [], effectKinds: [] });
  const d = new Driver(run(bp));
  d.approach("cornix", control(bp), 1);
  hint3(d, "maybe-flock");
  select(d, "maybe-flock", ["beam-north", "beam-east"]);
  operate(d, "cornix", ["beam-north", "beam-east"]);
  const before = d.state.orchardIntegrity;
  d.endRound();
  assert.equal(d.state.activeOutputs["beam-north"], false, "the mutation did break the committed pattern");
  const events = d.state.events.filter((e) => e.type === "orchard-damaged" && e.cause?.nestSector);
  assert.deepEqual(events.map((e) => e.cause.nestSector), ["south"], "only the sector no beam covered at phase start is damaged");
  assert.ok(before - d.state.orchardIntegrity >= 2);
});
