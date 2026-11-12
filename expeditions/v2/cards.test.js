import test from "node:test";
import assert from "node:assert/strict";
import { makeFixtureBlueprint, registerFixtureHooks } from "./fixture.js";
import { Driver } from "./test-helpers.js";
import { createRun } from "./run.js";
import { offsetKey, hexDistance } from "./hex.js";
import { cloneState, grantStrength, hasSight, reachableHexes } from "./rules.js";
import { HAND_CARDS, ROLE_CARD } from "./constants.js";
import { orchardRosterProfiles } from "./profile.js";

registerFixtureHooks();
const K = offsetKey;
const edit = (col, value) => ({ puzzleId: "fixture", edit: { type: "set-cell", row: 0, col, value } });

function scene(cardIds, positions, bp = {}) {
  const s = cloneState(createRun({ blueprint: makeFixtureBlueprint({ enemyWake: 5, ...bp }), cardIds, runId: "c" }));
  for (const [id, pos] of Object.entries(positions)) {
    const hero = s.heroes.find((h) => h.id === id);
    if (hero) hero.position = pos;
    const enemy = s.enemyStates.find((e) => e.id === id);
    if (enemy) enemy.position = pos;
  }
  return new Driver(s);
}
const shield = (d, id) => grantStrength(d.state, "shield", id);

test("every one of the 30 roster heroes gets exactly two discipline cards, one role card and Second Wind", () => {
  for (const profile of Object.values(orchardRosterProfiles())) {
    const keys = profile.hand.map((c) => c.key);
    assert.equal(keys.length, 4, profile.cardId);
    assert.deepEqual(keys.slice(0, 2), HAND_CARDS[profile.discipline]);
    assert.equal(keys[2], ROLE_CARD[profile.role]);
    assert.equal(keys[3], "second-wind");
  }
});

test("Exact Blow adds +2 power; Marked Shot places a mark first, reaches one further and consumes it on damage", () => {
  const d = scene(["cornix", "cobweb", "pip"], { cornix: "8,2", cobweb: "5,2", "hookmole-1": "9,2" });
  const exact = d.cmd("exact-blow", "cornix", { targetId: "hookmole-1" });
  assert.equal(exact.factors.find((f) => f.key === "bonus").value, 2);
  assert.equal(exact.factors.find((f) => f.key === "damage").value, 6 + 2 - 1);
  assert.equal(d.preview("strike", "cobweb", { targetId: "hookmole-1" }).reasonCode, "out-of-range");
  const marked = d.cmd("marked-shot", "cobweb", { targetId: "hookmole-1" });
  assert.equal(marked.factors.find((f) => f.key === "mark").value, 2);
  assert.equal(d.state.marks["hookmole-1"], undefined, "consumed because it did damage");
  assert.equal(d.hero("cobweb").handReady["marked-shot"], false);
});

test("Shared Charge splits up to Arithmetic across two stations in sight and obeys capacity", () => {
  const d = scene(["cornix", "furrow", "pip"], { cornix: "7,3" });
  assert.equal(d.preview("shared-charge", "cornix", { allocations: [{ targetId: "number", amount: 5 }] }).reasonCode, "exceeds-capacity");
  assert.equal(d.preview("shared-charge", "cornix", { allocations: [{ targetId: "number", amount: 4 }, { targetId: "shape", amount: 4 }] }).reasonCode, "allocation-exceeds-stat");
  const ok = d.cmd("shared-charge", "cornix", { allocations: [{ targetId: "number", amount: 3 }, { targetId: "shape", amount: 3 }] });
  assert.equal(ok.legal, true);
  assert.equal(d.state.stationStates.number.charge, 3);
  assert.equal(d.state.stationStates.shape.charge, 3);
  const fresh = scene(["cornix", "furrow", "pip"], { cornix: "7,3" });
  assert.equal(fresh.preview("shared-charge", "cornix", { allocations: [{ targetId: "shape", amount: 1 }, { targetId: "alcove", amount: 1 }] }).reasonCode, "duplicate-target");
});

test("Calibrate moves min(Arithmetic, missing); a full store is refused", () => {
  const d = scene(["bushel", "furrow", "pip"], { bushel: K(8, 4) });
  const first = d.cmd("calibrate", "bushel", { targetId: "number" });
  assert.deepEqual(first.factors[0].charge, [0, 4]);
  assert.equal(d.preview("calibrate", "bushel", { targetId: "number" }).reasonCode, "already-charged");
});

test("True Shift moves an enemy or ally to an adjacent empty hex and shields the ally only", () => {
  const d = scene(["kernel", "cornix", "pip"], { kernel: "7,2", cornix: "8,2", "hookmole-1": "9,2" });
  const toEnemy = d.cmd("true-shift", "kernel", { targetId: "hookmole-1", destination: "10,2" });
  assert.equal(d.state.enemyStates[0].position, "10,2");
  assert.equal(toEnemy.factors.find((f) => f.key === "shield").value, 0, "enemies receive no shield");
  const d2 = scene(["kernel", "cornix", "pip"], { kernel: "7,2", cornix: "8,2", pip: "0,5" });
  assert.equal(d2.preview("true-shift", "kernel", { targetId: "cornix", destination: "7,2" }).reasonCode, "shift-blocked");
  d2.cmd("true-shift", "kernel", { targetId: "cornix", destination: "9,1" });
  assert.equal(d2.hero("cornix").position, "9,1");
  assert.equal(shield(d2, "cornix"), 7);
  const d3 = scene(["kernel", "cornix", "pip"], { kernel: "7,2", cornix: "8,2" });
  assert.equal(d3.preview("true-shift", "kernel", { targetId: "kernel", destination: "7,1" }).reasonCode, "invalid-target");
});

test("True Shift on a holder cancels the hold and its protection", () => {
  const d = scene(["cornix", "kernel", "pip"], {});
  const numberHex = d.state.blueprint.stations.find((s) => s.id === "number").hex;
  const [q, r] = numberHex.split(",").map(Number);
  d.state.heroes.find((h) => h.id === "cornix").position = numberHex;
  d.state.heroes.find((h) => h.id === "kernel").position = `${q - 1},${r}`;
  d.cmd("hold", "cornix", { targetId: "number" });
  assert.equal(grantStrength(d.state, "lock", "network"), 6);
  d.cmd("true-shift", "kernel", { targetId: "cornix", destination: `${q},${r + 1}` });
  assert.equal(d.hero("cornix").holding, null);
  assert.equal(grantStrength(d.state, "lock", "network"), 0);
});

test("Wide Brace shields up to two targets at Geometry; Stand Together shields self and a friend", () => {
  const d = scene(["kernel", "cornix", "pip"], { kernel: "7,2", cornix: "8,2", pip: "6,3" });
  d.cmd("wide-brace", "kernel", { targetIds: ["cornix", "pip"] });
  assert.equal(shield(d, "cornix"), 7);
  assert.equal(shield(d, "pip"), 7);
  assert.equal(d.preview("wide-brace", "kernel", { targetIds: ["pip"] }).reasonCode, "card-exhausted");
  const dup = scene(["kernel", "cornix", "pip"], { kernel: "7,2", cornix: "8,2", pip: "6,3" });
  assert.equal(dup.preview("wide-brace", "kernel", { targetIds: ["cornix", "cornix"] }).reasonCode, "invalid-targets");
  const e = scene(["cornix", "kernel", "pip"], { cornix: "7,2", kernel: "8,2" });
  e.cmd("stand-together", "cornix", { targetId: "kernel" });
  assert.equal(shield(e, "cornix"), 2);
  assert.equal(shield(e, "kernel"), 2);
  const f = scene(["cornix", "kernel", "pip"], { cornix: "7,2", kernel: "8,2" });
  assert.equal(f.preview("stand-together", "cornix", { targetId: "cornix" }).reasonCode, "invalid-target");
});

test("Field Repair distributes up to 2xScience; Mend restores Science and shields half; Repair refuses full health", () => {
  const d = scene(["pip", "bushel", "furrow"], { pip: "7,2", bushel: "8,2" });
  d.state.heroes.find((h) => h.id === "bushel").hp = 5;
  d.state.orchardIntegrity = 10;
  d.state.stationStates.control.integrity = 8;
  assert.equal(d.preview("field-repair", "pip", { allocations: [{ targetId: "bushel", amount: 9 }] }).reasonCode, "exceeds-missing");
  assert.equal(d.preview("repair", "pip", { targetId: "pip" }).reasonCode, "nothing-to-repair");
  d.cmd("field-repair", "pip", { allocations: [{ targetId: "bushel", amount: 8 }] });
  assert.equal(d.hero("bushel").hp, 13);
  const m = scene(["pip", "bushel", "furrow"], { pip: "7,2", bushel: "8,2" });
  m.state.heroes.find((h) => h.id === "bushel").hp = 5;
  m.cmd("mend-and-mend-again", "pip", { targetId: "bushel" });
  assert.equal(m.hero("bushel").hp, 11);
  assert.equal(shield(m, "bushel"), 3);
});

test("Root Shelter stabilises up to two targets; Linked Lock locks up to two groups; Stabilise and Lock take the stat", () => {
  const d = scene(["pip", "barrow", "bushel"], { pip: "7,2", barrow: "2,4" });
  d.cmd("root-shelter", "pip", { targetIds: ["number", "sustain"] }, { expectLegal: false });
  const near = scene(["pip", "barrow", "bushel"], { pip: "7,3", barrow: "3,4" });
  near.cmd("root-shelter", "pip", { targetIds: ["number"] });
  assert.equal(grantStrength(near.state, "stabilise", "number"), 6);
  near.cmd("linked-lock", "barrow", { targetIds: ["row-0", "row-1"] });
  assert.equal(grantStrength(near.state, "lock", "row-0"), 8);
  assert.equal(grantStrength(near.state, "lock", "row-1"), 8);
  assert.equal(near.preview("linked-lock", "barrow", { targetIds: ["number"] }).reasonCode, "card-exhausted");
});

test("Intercept moves up to Speed then marks; Dash uses 4+Speed", () => {
  const d = scene(["furrow", "bushel", "pip"], { furrow: "7,2", "hookmole-1": "9,2" });
  const res = d.cmd("intercept", "furrow", { destination: "8,2", path: null, markTargetId: "hookmole-1" });
  assert.equal(d.state.marks["hookmole-1"], 2);
  assert.equal(res.legal, true);
  const far = scene(["furrow", "bushel", "pip"], {});
  const moveReach = reachableHexes(far.state, "furrow", 5);
  const dashReach = reachableHexes(far.state, "furrow", 9);
  assert.ok(dashReach.length > moveReach.length);
  const beyond = dashReach.find((r) => r.cost > 5);
  assert.equal(far.preview("dash", "furrow", { destination: beyond.key, path: null }).legal, true);
  assert.equal(far.preview("move", "furrow", { destination: beyond.key, path: null }).reasonCode, "destination-unreachable" === far.preview("move", "furrow", { destination: beyond.key, path: null }).reasonCode ? "destination-unreachable" : "path-too-costly");
});

test("Driving Blow pushes only after positive damage and only to a legal adjacent hex", () => {
  const d = scene(["barrow", "bushel", "pip"], { barrow: "8,2", "hookmole-1": "9,2" });
  assert.equal(d.preview("driving-blow", "barrow", { targetId: "hookmole-1", pushDestination: "10,2" }).legal, true);
  assert.equal(d.preview("driving-blow", "barrow", { targetId: "hookmole-1", pushDestination: "8,2" }).reasonCode, "push-blocked");
  assert.equal(d.preview("driving-blow", "barrow", { targetId: "hookmole-1", pushDestination: "12,12" }).reasonCode, "push-not-adjacent");
  d.cmd("driving-blow", "barrow", { targetId: "hookmole-1", pushDestination: "10,2" });
  assert.equal(d.state.enemyStates[0].position, "10,2");
});

test("Crosswire commits from two hexes with sight and locks the chosen group; Operate needs adjacency", () => {
  const d = scene(["kernel", "bushel", "pip"], { kernel: "0,4", bushel: "1,4", pip: "1,3" });
  d.cmd("edit-draft", null, edit(0, 1));
  d.cmd("edit-draft", null, edit(2, 1));
  d.cmd("edit-draft", null, edit(3, 1));
  const payload = { draftRevision: d.state.puzzleDraft.revision, outputIds: ["bridge", "shelter"] };
  assert.equal(d.preview("operate", "kernel", payload).reasonCode, "out-of-range");
  assert.equal(d.preview("crosswire", "kernel", { ...payload, lockGroupId: null }).reasonCode, "lock-group-required");
  d.cmd("crosswire", "kernel", { ...payload, lockGroupId: "network" });
  assert.equal(d.state.activeOutputs.bridge, true);
  assert.equal(grantStrength(d.state, "lock", "network"), 3);
  assert.equal(d.preview("operate", "bushel", { ...payload, draftRevision: 0 }).reasonCode, "stale-draft");
});

test("operate rejects a selection that differs from the saved draft", () => {
  const d = scene(["bushel", "furrow", "pip"], { bushel: "3,4" });
  assert.equal(d.preview("operate", "bushel", { draftRevision: 0, outputIds: ["bridge"] }).reasonCode, "output-selection-mismatch");
});

test("Hedges block sight, roots cost two, controlled bridge is impassable until powered", () => {
  const bp = makeFixtureBlueprint({ enemyWake: 5 });
  const target = bp.tiles.find((t) => t.q === 8 && t.r === 2);
  target.terrain = "hedge";
  const d = new Driver(createRun({ blueprint: bp, cardIds: ["cobweb", "bushel", "pip"], runId: "h" }));
  d.state.heroes[0].position = "7,2";
  d.state.enemyStates[0].position = "9,2";
  assert.equal(hasSight(d.state, "7,2", "9,2"), false);
  assert.equal(d.preview("strike", "cobweb", { targetId: "hookmole-1" }).reasonCode, "no-line-of-sight");
  const rt = makeFixtureBlueprint({ enemyWake: 5 });
  rt.tiles.find((t) => t.q === 1 && t.r === 4).terrain = "roots";
  const r = new Driver(createRun({ blueprint: rt, cardIds: ["bushel", "furrow", "pip"], runId: "r" }));
  const move = r.preview("move", "furrow", { destination: "2,4", path: null });
  assert.equal(move.factors.find((f) => f.key === "cost").value >= 3, true, "two hexes, one of them roots");
  assert.equal(hexDistance("0,4", "2,4"), 2);
  assert.equal(r.preview("move", "furrow", { destination: "4,4", path: null }).reasonCode, "destination-unreachable");
});
