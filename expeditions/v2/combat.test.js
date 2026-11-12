import test from "node:test";
import assert from "node:assert/strict";
import { createFixtureRun, makeFixtureBlueprint, registerFixtureHooks, FIXTURE_KIND } from "./fixture.js";
import { Driver } from "./test-helpers.js";
import { createRun, exportRunRecord, replayRun } from "./run.js";
import { forecastEnemyPhase, evaluateVictory } from "./enemy.js";
import { previewCommand, reduceCommand, listCommands } from "./actions.js";
import { hexDistance, offsetKey } from "./hex.js";
import { getPuzzleHooks, registerPuzzleHooks } from "./puzzle-hooks.js";
import { cloneState, damageHero, grantStrength } from "./rules.js";
import { orchardV2Profile, orchardRosterProfiles } from "./profile.js";
import { commissionProfile } from "./constants.js";

registerFixtureHooks();

function place(state, positions) {
  const s = cloneState(state);
  for (const [id, pos] of Object.entries(positions)) {
    const hero = s.heroes.find((h) => h.id === id);
    if (hero) hero.position = pos;
    const enemy = s.enemyStates.find((e) => e.id === id);
    if (enemy) enemy.position = pos;
  }
  return s;
}
const baseRun = (cardIds, bpOptions = {}, runId = "t") => createRun({ blueprint: makeFixtureBlueprint(bpOptions), cardIds, runId });
const factor = (res, k) => res.factors.find((f) => f.key === k);
const K = offsetKey;
const HUNTER = { id: "scruffcrow-1", ruleId: "hunter", artId: "scruffcrow", wakePhase: 1, position: K(9, 6) };
const edit = (col, value) => ({ puzzleId: "fixture", edit: { type: "set-cell", row: 0, col, value } });

function committedDriver(cardIds, options) {
  const d = new Driver(baseRun(cardIds, options));
  d.state = place(d.state, { [cardIds[0]]: "1,4", [cardIds[1]]: "0,4", [cardIds[2]]: "0,5" });
  for (const col of [0, 2, 3]) d.cmd("edit-draft", null, edit(col, 1));
  d.cmd("operate", cardIds[0], { draftRevision: d.state.puzzleDraft.revision, outputIds: ["bridge", "shelter"] });
  return d;
}

test("spec worked example: Geometry 7 + support 1 - armour 3 = 5; a mark makes it 7", () => {
  const d = new Driver(place(baseRun(["kernel", "cornix", "pip"], { tier: 4, enemyWake: 1 }), { kernel: "7,2", cornix: "6,3", "hookmole-1": "9,2" }));
  const prev = d.preview("strike", "kernel", { targetId: "hookmole-1" });
  assert.equal(prev.legal, true, JSON.stringify(prev));
  assert.equal(factor(prev, "governing").value, 7);
  assert.equal(factor(prev, "support").value, 1);
  assert.equal(factor(prev, "armour").value, -3);
  assert.equal(factor(prev, "damage").value, 5);
  assert.equal(d.state.enemyStates[0].hp, 16);
  d.cmd("strike", "kernel", { targetId: "hookmole-1" });
  assert.equal(d.state.enemyStates[0].hp, 11);
  d.state.marks["hookmole-1"] = 2;
  assert.equal(factor(d.preview("strike", "kernel", { targetId: "hookmole-1" }), "damage").value, 7);
});

test("zero-damage strike is legal with a warning, spends AP and does not consume a mark", () => {
  const weak = orchardV2Profile({ id: "weak", name: "Weak", rarity: "common", stats: [1, 1, 1, 1, 1], discipline: "arithmetic", role: "melee" });
  const roster = { ...orchardRosterProfiles(), weak };
  const base = createRun({ blueprint: makeFixtureBlueprint({ tier: 5, enemyWake: 1 }), cardIds: ["weak", "pip", "nine"], runId: "z", profiles: roster });
  const d = new Driver(place(base, { weak: "8,2", "hookmole-1": "9,2" }));
  const res = d.cmd("strike", "weak", { targetId: "hookmole-1" });
  assert.equal(factor(res, "damage").value, 0);
  assert.equal(res.warnings[0].code, "zero-damage");
  assert.equal(d.hero("weak").ap, 1);
  assert.equal(d.state.enemyStates[0].hp, 18);
  d.state.marks["hookmole-1"] = 2;
  const marked = d.preview("strike", "weak", { targetId: "hookmole-1" });
  assert.equal(factor(marked, "damage").value, 0, "1 + 2 mark - armour 3 is still zero");
  d.cmd("strike", "weak", { targetId: "hookmole-1" });
  assert.equal(d.state.marks["hookmole-1"], 2, "mark survives a zero-damage strike");
});

test("held allies give no adjacent support; Hold failure lists every shortfall", () => {
  const raw = baseRun(["kernel", "cornix", "dapple"], { enemyWake: 1 });
  const numberHex = raw.blueprint.stations.find((s) => s.id === "number").hex;
  const [q, r] = numberHex.split(",").map(Number);
  const d = new Driver(place(raw, { cornix: numberHex, kernel: `${q + 1},${r}`, dapple: `${q - 1},${r + 1}`, "hookmole-1": `${q + 3},${r}` }));
  assert.equal(factor(d.preview("strike", "kernel", { targetId: "hookmole-1" }), "support").value, 1);
  d.cmd("hold", "cornix", { targetId: "number" });
  assert.equal(d.hero("cornix").holding, "number");
  assert.equal(factor(d.preview("strike", "kernel", { targetId: "hookmole-1" }), "support").value, 0);
  const short = d.preview("hold", "dapple", { targetId: "number" });
  assert.equal(short.reasonCode, "hold-profile-short");
  assert.deepEqual(short.reasonParams.shortfalls.map((x) => x.name), ["Arithmetic", "Logic"]);
  assert.deepEqual(short.reasonParams.need, [4, 0, 2, 0, 0]);
});

test("a station already held rejects Hold and names its holder", () => {
  const raw = baseRun(["cornix", "bushel", "pip"], { enemyWake: 5 });
  const numberHex = raw.blueprint.stations.find((s) => s.id === "number").hex;
  const [q, r] = numberHex.split(",").map(Number);
  const d = new Driver(place(raw, { cornix: numberHex, bushel: `${q},${r + 1}` }));
  d.cmd("hold", "cornix", { targetId: "number" });
  const res = d.preview("hold", "bushel", { targetId: "number" });
  assert.equal(res.reasonCode, "station-held");
  assert.equal(res.reasonParams.holderId, "cornix");
  assert.equal(d.preview("hold", "cornix", { targetId: "number" }).reasonCode, "already-held");
});

test("moving cancels a hold and removes exactly that hold's protection; casts survive", () => {
  const raw = baseRun(["cornix", "bushel", "pip"], { enemyWake: 5 });
  const numberHex = raw.blueprint.stations.find((s) => s.id === "number").hex;
  const [q, r] = numberHex.split(",").map(Number);
  const d = new Driver(place(raw, { cornix: numberHex, bushel: `${q},${r + 1}` }));
  d.cmd("hold", "cornix", { targetId: "number" });
  assert.equal(grantStrength(d.state, "lock", "network"), 6);
  d.state.phaseEffects.grants.push({ id: "cast", kind: "lock", targetId: "network", amount: 3, source: "cast", sourceHoldId: null });
  const prev = d.preview("move", "cornix", { destination: `${q + 1},${r}`, path: null });
  assert.ok(prev.events.some((e) => e.type === "hold-cancelled"));
  assert.equal(prev.legal, true);
  d.cmd("move", "cornix", { destination: `${q + 1},${r}`, path: null });
  assert.equal(d.hero("cornix").holding, null);
  assert.equal(d.state.holds.number, undefined);
  assert.equal(grantStrength(d.state, "lock", "network"), 3);
});

test("shield grants never form a second pool", () => {
  const s = baseRun(["bushel", "furrow", "pip"], { enemyWake: 5 });
  s.phaseEffects.grants.push({ id: "a", kind: "shield", targetId: "pip", amount: 4, sourceHoldId: null }, { id: "b", kind: "shield", targetId: "pip", amount: 3, sourceHoldId: null });
  const pip = s.heroes.find((h) => h.id === "pip");
  const hp = pip.hp;
  damageHero(s, pip, 3, "test");
  assert.equal(pip.hp, hp, "3 damage fully absorbed by the larger grant");
  assert.equal(grantStrength(s, "shield", "pip"), 1);
  damageHero(s, pip, 2, "test");
  assert.equal(pip.hp, hp - 1, "only 1 shield left, never the weaker grant's leftover");
});

test("forecast is a dry run of the real phase: same intents, hp changes and outcome", () => {
  const raw = baseRun(["bushel", "furrow", "pip"], { tier: 2, enemyWake: 5, extraEnemies: [HUNTER] });
  const s = place(raw, { pip: K(7, 6) });
  s.heroes.find((h) => h.id === "pip").hp = 9;
  const forecast = forecastEnemyPhase(s);
  const hunter = forecast.intents.find((i) => i.enemyId === "scruffcrow-1");
  assert.equal(hunter.verb, "strike");
  assert.ok(hunter.hpChange, "hunter reaches and hits someone");
  const { state: after, result } = reduceCommand(s, { type: "end-round", heroId: null, expectedRevision: s.revision, payload: { forecastRevision: s.revision } });
  assert.equal(result.legal, true);
  const actual = result.phase.intents.find((i) => i.enemyId === "scruffcrow-1");
  assert.deepEqual(actual.hpChange, hunter.hpChange);
  assert.deepEqual(actual.actualPath, hunter.actualPath);
  assert.equal(after.heroes.find((h) => h.id === hunter.targetId).hp, s.heroes.find((h) => h.id === hunter.targetId).hp - hunter.hpChange.damage);
  assert.equal(forecast.outcome.status, after.status);
  const stale = reduceCommand(after, { type: "end-round", heroId: null, expectedRevision: after.revision, payload: { forecastRevision: s.revision } });
  assert.equal(stale.result.reasonCode, "stale-forecast");
});

test("Hunter targets the lowest current HP; a forecast changes when HP changes", () => {
  const raw = baseRun(["bushel", "furrow", "pip"], { tier: 3, enemyWake: 5, extraEnemies: [HUNTER] });
  const s = place(raw, { bushel: K(8, 5), furrow: K(8, 6), pip: K(7, 6) });
  s.heroes.find((h) => h.id === "pip").hp = 3;
  s.heroes.find((h) => h.id === "furrow").hp = 3;
  assert.ok(["furrow", "pip"].includes(forecastEnemyPhase(s).intents.find((i) => i.enemyId === "scruffcrow-1").targetId));
  s.heroes.find((h) => h.id === "bushel").hp = 1;
  assert.equal(forecastEnemyPhase(s).intents.find((i) => i.enemyId === "scruffcrow-1").targetId, "bushel");
});

test("occupied bridge: a player Commit that would close it is refused; enemy corruption sets the interlock", () => {
  const d = committedDriver(["bushel", "furrow", "pip"], { enemyWake: 1 });
  const bridge = "4,4";
  assert.equal(d.state.passages[bridge].open, true);
  d.state = place(d.state, { furrow: bridge });
  d.cmd("edit-draft", null, edit(0, 0));
  const refused = d.preview("operate", "bushel", { draftRevision: d.state.puzzleDraft.revision, outputIds: ["bridge", "shelter"] });
  assert.equal(refused.legal, false);
  assert.equal(refused.reasonCode, "bridge-occupied");
  assert.deepEqual(refused.reasonParams.blockers, [{ tile: bridge, kind: "hero", id: "furrow" }]);
  d.state = place(d.state, { "hookmole-1": "3,4" });
  d.endRound();
  assert.equal(d.state.activeOutputs.bridge, false);
  assert.deepEqual(d.state.passages[bridge], { open: true, closingPending: true });
  const enter = d.preview("move", "pip", { destination: bridge, path: null });
  assert.equal(enter.legal, false);
  d.cmd("move", "furrow", { destination: "5,4", path: null });
  assert.deepEqual(d.state.passages[bridge], { open: false, closingPending: false });
  assert.ok(d.state.events.some((e) => e.type === "passage-closed"));
});

test("an adequate lock blocks a disruption; a weaker one is consumed and the change happens", () => {
  const make = () => {
    const d = committedDriver(["cornix", "bushel", "pip"], { enemyWake: 1 });
    d.state = place(d.state, { "hookmole-1": "3,4" });
    return d;
  };
  const strong = make();
  strong.cmd("lock", "cornix", { targetId: "network" });
  assert.equal(grantStrength(strong.state, "lock", "network"), 6);
  strong.endRound();
  assert.equal(strong.state.activeOutputs.bridge, true, "L6 >= power 4 blocks the jam");
  assert.equal(strong.state.stationStates.control.integrity, 8, "nothing disruptable: the Jammer strikes the control instead (12 - 4)");
  const weak = make();
  weak.state.phaseEffects.grants.push({ id: "w", kind: "lock", targetId: "network", amount: 3, source: "cast", sourceHoldId: null });
  weak.endRound();
  assert.equal(weak.state.activeOutputs.bridge, false, "L3 < power 4: change happens");
  assert.ok(weak.state.events.some((e) => e.type === "lock-broken"));
  const open = make();
  open.endRound();
  assert.equal(open.state.activeOutputs.bridge, false);
});

test("Counterturn cancels the next disruption when Logic reaches its power", () => {
  const d = committedDriver(["harvestmoon", "bushel", "pip"], { enemyWake: 1 });
  d.state = place(d.state, { "hookmole-1": "3,4" });
  assert.equal(d.preview("counterturn", "bushel", { targetId: "hookmole-1" }).reasonCode, "card-not-in-hand");
  d.cmd("counterturn", "harvestmoon", { targetId: "hookmole-1" });
  d.endRound();
  assert.equal(d.state.activeOutputs.bridge, true);
  assert.ok(d.state.events.some((e) => e.type === "disruption-cancelled"));
});

test("Undo restores AP, hand, hp, position and draft within a round, never across End Round", () => {
  const d = new Driver(baseRun(["bushel", "furrow", "pip"], { enemyWake: 5 }));
  d.cmd("edit-draft", null, edit(1, 1));
  d.cmd("wait", "bushel");
  d.cmd("dash", "furrow", { destination: "3,4", path: null });
  d.cmd("undo", null);
  assert.equal(d.hero("furrow").position, "0,4");
  assert.equal(d.hero("furrow").handReady.dash, true);
  assert.equal(d.hero("furrow").ap, 2);
  d.cmd("undo", null);
  assert.equal(d.hero("bushel").ap, 2);
  d.cmd("undo", null);
  assert.deepEqual(d.state.puzzleDraft.content.switches, [0, 0, 0, 0]);
  d.cmd("undo", null, {}, { expectLegal: false });
  d.cmd("wait", "bushel");
  d.endRound();
  assert.equal(d.preview("undo", null).reasonCode, "nothing-to-undo");
});

registerPuzzleHooks("fixture-balance", {
  ...getPuzzleHooks(FIXTURE_KIND),
  compare: (puzzle, content, left, right) => {
    const v = puzzle.solutionParameters.values;
    const sum = (ids) => ids.reduce((t, id) => t + v[id], 0);
    return sum(left) < sum(right) ? "left-lighter" : sum(left) > sum(right) ? "left-heavier" : "equal";
  },
});

test("weighing knowledge is irreversible: Undo keeps the log, repeats and swaps are free, allowance is enforced", () => {
  const bp = makeFixtureBlueprint({ enemyWake: 5 });
  bp.puzzle.kind = "fixture-balance";
  bp.puzzle.comparisonAllowance = 2;
  bp.puzzle.solutionParameters.values = { a: 1, b: 2, c: 5, d: 5 };
  const d = new Driver(createRun({ blueprint: bp, cardIds: ["bushel", "furrow", "pip"], runId: "b" }));
  d.cmd("edit-draft", null, edit(0, 1));
  const first = d.cmd("compare-loads", null, { leftLoadIds: ["b", "a"], rightLoadIds: ["c"] });
  assert.equal(first.comparison.result, "left-lighter");
  assert.equal(d.state.comparisonsUsed, 1);
  d.cmd("undo", null);
  assert.deepEqual(d.state.puzzleDraft.content.switches, [0, 0, 0, 0]);
  assert.equal(d.state.comparisonsUsed, 1);
  assert.equal(d.state.comparisonLog.length, 1);
  const repeat = d.cmd("compare-loads", null, { leftLoadIds: ["a", "b"], rightLoadIds: ["c"] });
  assert.equal(repeat.comparison.free, true);
  const swapped = d.cmd("compare-loads", null, { leftLoadIds: ["c"], rightLoadIds: ["a", "b"] });
  assert.equal(swapped.comparison.result, "left-heavier");
  assert.equal(swapped.comparison.free, true);
  assert.equal(d.state.comparisonsUsed, 1);
  d.cmd("compare-loads", null, { leftLoadIds: ["c"], rightLoadIds: ["d"] });
  assert.equal(d.state.comparisonsUsed, 2);
  const over = d.cmd("compare-loads", null, { leftLoadIds: ["a"], rightLoadIds: ["b"] }, { expectLegal: false });
  assert.equal(over.reasonCode, "no-comparisons-left");
  assert.equal(d.preview("compare-loads", null, { leftLoadIds: ["a", "c"], rightLoadIds: ["c"] }).reasonCode, "load-on-both-sides");
  const replay = replayRun(exportRunRecord(d.state));
  assert.equal(replay.ok, true, replay.reason);
});

test("deadline: round five without a snapshot win loses; hero defeat loses immediately", () => {
  const d = new Driver(baseRun(["bushel", "furrow", "pip"], { enemyWake: 5 }));
  for (let i = 0; i < 4; i += 1) d.endRound();
  assert.equal(d.state.status, "playing");
  assert.equal(d.state.round, 5);
  d.endRound();
  assert.equal(d.state.status, "lost");
  assert.equal(d.state.lossReason.code, "deadline");
  assert.equal(d.preview("wait", "bushel").reasonCode, "run-over");
  const hit = new Driver(place(baseRun(["bushel", "furrow", "pip"], { tier: 3, enemyWake: 5, extraEnemies: [HUNTER] }), { pip: "8,6" }));
  hit.state.heroes.find((h) => h.id === "pip").hp = 1;
  hit.endRound();
  assert.equal(hit.state.status, "lost");
  assert.equal(hit.state.lossReason.code, "hero-defeated");
  assert.equal(hit.state.heroes.find((h) => h.id === "pip").defeated, true);
});

test("alcove route: needs preparation, Geometry-2 and Speed 6", () => {
  const raw = baseRun(["bushel", "dapple", "pip"], { enemyWake: 5 });
  const alcoveHex = raw.blueprint.stations.find((s) => s.id === "alcove").hex;
  const d = new Driver(place(raw, { dapple: alcoveHex }));
  assert.equal(d.preview("hold", "dapple", { targetId: "alcove" }).reasonCode, "alcove-unprepared");
  assert.equal(d.preview("prepare-alcove", "bushel", {}).reasonCode, "out-of-range");
  d.state.heroes.find((h) => h.id === "bushel").position = alcoveHex;
  d.cmd("prepare-alcove", "bushel", {});
  assert.equal(d.state.preparedAlcove, true);
  d.cmd("hold", "dapple", { targetId: "alcove" });
  assert.equal(d.state.holds.alcove.heroId, "dapple");
  assert.deepEqual(commissionProfile(1, "shape", true), [0, 2, 0, 0, 6]);
  assert.equal(d.preview("hold", "dapple", { targetId: "shape" }).legal, false);
  const victory = evaluateVictory(d.state);
  assert.equal(victory.won, false);
  assert.ok(victory.unmet.some((u) => u.code === "job-not-held" && u.params.job === "number"));
});

test("preview p95 stays within the 16 ms budget on a 92 tile map", () => {
  const state = baseRun(["bushel", "furrow", "pip"], { enemyWake: 1 });
  const times = [];
  for (let i = 0; i < 100; i += 1) {
    const t0 = performance.now();
    previewCommand(state, { type: "wait", heroId: "bushel", expectedRevision: state.revision, payload: {} });
    times.push(performance.now() - t0);
  }
  times.sort((a, b) => a - b);
  assert.ok(times[94] < 16, `p95 ${times[94].toFixed(2)} ms`);
});

test("listCommands reports availability with reasons for every hand card and basic command", () => {
  const d = new Driver(baseRun(["kernel", "cornix", "pip"], { enemyWake: 5 }));
  const rows = listCommands(d.state, "kernel");
  const types = rows.map((r) => r.type);
  for (const t of ["move", "strike", "hold", "operate", "true-shift", "wide-brace", "crosswire", "second-wind", "refocus", "wait"]) assert.ok(types.includes(t), t);
  const strike = rows.find((r) => r.type === "strike");
  assert.equal(strike.available, false);
  assert.ok(strike.reasonCode);
  assert.equal(rows.find((r) => r.type === "wait").available, true);
  assert.ok(rows.find((r) => r.type === "move").targets.length > 0);
  assert.equal(hexDistance("0,0", "0,0"), 0);
});

test("compare-loads rejects unknown load ids without spending allowance; a throwing hook becomes a structured rejection", () => {
  const bp = makeFixtureBlueprint({ enemyWake: 5 });
  bp.puzzle.kind = "fixture-balance";
  bp.puzzle.comparisonAllowance = 2;
  bp.puzzle.loads = [{ id: "a" }, { id: "b" }];
  bp.puzzle.solutionParameters.values = { a: 1, b: 2 };
  const d = new Driver(createRun({ blueprint: bp, cardIds: ["bushel", "furrow", "pip"], runId: "u" }));
  const res = d.preview("compare-loads", null, { leftLoadIds: ["missing"], rightLoadIds: ["a"] });
  assert.equal(res.reasonCode, "unknown-load");
  assert.equal(d.state.comparisonsUsed, 0);
  registerPuzzleHooks("fixture-throws", { ...getPuzzleHooks(FIXTURE_KIND), compare: () => { throw new Error("boom"); } });
  const bp2 = makeFixtureBlueprint({ enemyWake: 5 });
  bp2.puzzle.kind = "fixture-throws";
  bp2.puzzle.comparisonAllowance = 2;
  const d2 = new Driver(createRun({ blueprint: bp2, cardIds: ["bushel", "furrow", "pip"], runId: "u2" }));
  const thrown = d2.preview("compare-loads", null, { leftLoadIds: ["a"], rightLoadIds: ["zzz"] });
  assert.equal(thrown.legal, false);
  assert.equal(thrown.reasonCode, "internal-error");
  assert.equal(d2.state.comparisonsUsed, 0);
  assert.equal(d2.preview("edit-draft", null, { puzzleId: "nope", edit: { type: "set-cell" } }).reasonCode, "unknown-puzzle");
});
