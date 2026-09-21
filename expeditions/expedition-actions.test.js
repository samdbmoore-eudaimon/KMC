// E2 coverage: the fifteen discipline actions, five role actions and five traits
// (EXPEDITIONS_BUILD_BRIEF.md §§7-9), plus the command dispatcher and Foresight preview
// recommended in EXPEDITIONS_CLAUDE_HANDOVER.md. Uses a small generic test board rather
// than the Unequal Crossing map so every discipline/role/trait can be exercised directly.
import test from "node:test";
import assert from "node:assert/strict";
import {
  createExpeditionState, moveUnit, interactObject, guardTarget, strikeEnemy, useDisciplineAction,
  restoreTarget, reframeTarget, shoveTarget, markTarget, useRoleAction,
  reachableHexes, resolveEnemyPhase, endPlayerPhase, evaluateObjective,
  initiativeWinner, previewCommandConsequences, applyExpeditionCommand,
} from "./expedition-engine.js";

function testBoard() {
  const hexes = [];
  for (let q = -4; q <= 4; q += 1) for (let r = -4; r <= 4; r += 1) if (Math.abs(q + r) <= 4) hexes.push({ q, r, terrain: "clear" });
  return hexes;
}

function baseConfig(overrides = {}) {
  return { id: "test", moduleKey: "primary", title: "Test", turnLimit: 4, board: testBoard(), units: [], enemies: [], objects: [], objective: { family: "eliminate" }, ...overrides };
}

function playerUnit(id, opts = {}) {
  return { id, name: id, stats: [5, 5, 5, 5, 5], hearts: 3, hp: 3, maxHp: 3, move: 2, range: 1, pos: "0,0", ...opts };
}

function enemyUnit(id, opts = {}) {
  return { id, name: id, side: "enemy", hp: 3, maxHp: 3, defence: 6, move: 1, range: 1, pos: "2,0", ...opts };
}

// ---------------- Arithmetic ----------------

test("Combine: positive, illegal-target and idempotency", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "arithmetic" })],
    objects: [{ id: "x", value: 3, pos: "1,0" }, { id: "y", value: 4, pos: "1,-1" }],
  }));
  const after = useDisciplineAction(state, "a", "combine", { firstId: "x", secondId: "y" });
  assert.equal(after.objects.x.value, 7);
  assert.equal(after.objects.y.removed, true);
  assert.throws(() => useDisciplineAction(after, "a", "combine", { firstId: "x", secondId: "y" }), /Combine requires two adjacent movable objects/, "combining an already-removed object is refused, not silently repeated");
  assert.throws(() => useDisciplineAction(state, "a", "combine", { firstId: "x", secondId: "nope" }), /Combine requires two adjacent movable objects/);
});

test("Split: positive and illegal-target", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "arithmetic", stats: [9, 5, 5, 5, 5] })],
    objects: [{ id: "x", value: 8, pos: "1,0" }],
  }));
  const after = useDisciplineAction(state, "a", "split", { objectId: "x", hexA: "1,0", hexB: "2,-1", newObjectId: "x_b" });
  assert.equal(after.objects.x.value, 4);
  assert.equal(after.objects.x.pos, "1,0");
  assert.equal(after.objects.x_b.value, 4);
  assert.equal(after.objects.x_b.pos, "2,-1");
  assert.throws(() => useDisciplineAction(state, "a", "split", { objectId: "x", hexA: "1,0", hexB: "1,0", newObjectId: "x_c" }), /different destination hexes/);
  assert.throws(() => useDisciplineAction(state, "a", "split", { objectId: "x", hexA: "1,0", hexB: "9,9", newObjectId: "x_d" }), /not an open hex/);
  const oddState = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "arithmetic" })], objects: [{ id: "z", value: 5, pos: "1,0" }] }));
  assert.throws(() => useDisciplineAction(oddState, "a", "split", { objectId: "z", hexA: "1,-1", hexB: "0,-1", newObjectId: "z_b" }), /even-valued object/);
});

test("Exact Count: positive (matched and unmatched) and illegal-target", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "arithmetic", trait: "precise" })],
    objects: [{ id: "x", value: 7, pos: "1,0" }],
    objective: { family: "eliminate", target: 7 },
  }));
  const matched = useDisciplineAction(state, "a", "exact", { objectId: "x" });
  assert.equal(matched.history.at(-1).matched, true);
  assert.equal(matched.units.a.preciseSupportBanked, true, "an exact match should bank Precise's support for this unit's next strike");
  const unmatchedState = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "arithmetic" })], objects: [{ id: "x", value: 3, pos: "1,0" }], objective: { family: "eliminate", target: 7 } }));
  const unmatched = useDisciplineAction(unmatchedState, "a", "exact", { objectId: "x" });
  assert.equal(unmatched.history.at(-1).matched, false);
  assert.throws(() => useDisciplineAction(state, "a", "exact", { objectId: "not-there" }), /adjacent object/);
});

// ---------------- Geometry ----------------

test("True Shift: positive, illegal-target and boundary (distance limit)", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "geometry", stats: [5, 9, 5, 5, 5] })], objects: [{ id: "x", value: 1, pos: "1,0" }] }));
  const after = useDisciplineAction(state, "a", "shift", { objectId: "x", to: "3,0" });
  assert.equal(after.objects.x.pos, "3,0");
  assert.throws(() => useDisciplineAction(state, "a", "shift", { objectId: "x", to: "9,9" }), /adjacent object and a board destination/);
  const weakState = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "geometry", stats: [5, 1, 5, 5, 5] })], objects: [{ id: "x", value: 1, pos: "1,0" }] }));
  assert.throws(() => useDisciplineAction(weakState, "a", "shift", { objectId: "x", to: "4,0" }), /too far away/);
});

test("Shape Field: positive and boundary (span limit)", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "geometry", stats: [5, 9, 5, 5, 5] })],
    objects: [{ id: "x", value: 1, pos: "1,0" }, { id: "y", value: 2, pos: "0,1" }],
  }));
  const after = useDisciplineAction(state, "a", "shape", { hexes: ["1,0", "0,1"] });
  assert.equal(after.objects.x.guarded, true);
  assert.equal(after.objects.y.guarded, true);
  const weakState = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "geometry", stats: [5, 0, 5, 5, 5] })] }));
  assert.throws(() => useDisciplineAction(weakState, "a", "shape", { hexes: ["1,0", "0,1"] }), /affects at most/);
});

test("Measure: positive (ignores one obstacle at exact distance two) and illegal-target", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "geometry" }), playerUnit("blocker", { pos: "1,0" })],
    objects: [{ id: "x", value: 3, pos: "2,0" }],
  }));
  const after = useDisciplineAction(state, "a", "measure", { objectId: "x", ignoreHex: "1,0" });
  assert.equal(after.units.a.carrying, "x");
  assert.equal(after.objects.x.pos, null);
  assert.throws(() => useDisciplineAction(state, "a", "measure", { objectId: "x", ignoreHex: "0,-1" }), /must name the intervening hex/);
  const tooFar = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "geometry" })], objects: [{ id: "x", value: 3, pos: "3,0" }] }));
  assert.throws(() => useDisciplineAction(tooFar, "a", "measure", { objectId: "x", ignoreHex: "1,0" }), /exactly two hexes away/);
});

// ---------------- Logic ----------------

test("Predict: positive and illegal-target", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "logic" })], enemies: [enemyUnit("e")] }));
  const after = useDisciplineAction(state, "a", "predict", { enemyId: "e" });
  assert.equal(after.units.e.intentRevealed, true);
  assert.throws(() => useDisciplineAction(state, "a", "predict", { enemyId: "nope" }), /requires an enemy/);
});

test("Put in Order: positive for units and for adjacent objects, illegal-target otherwise", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "logic" }), playerUnit("b", { pos: "1,0", initiative: 9 })],
    objects: [{ id: "x", pos: "1,0", value: 1 }, { id: "y", pos: "0,1", value: 2 }],
  }));
  const swapped = useDisciplineAction(state, "a", "order", { aId: "a", bId: "b" });
  assert.equal(swapped.units.a.initiative, 9);
  const swappedObjects = useDisciplineAction(state, "a", "order", { aId: "x", bId: "y" });
  assert.equal(swappedObjects.objects.x.pos, "0,1");
  assert.equal(swappedObjects.objects.y.pos, "1,0");
  assert.throws(() => useDisciplineAction(state, "a", "order", { aId: "a", bId: "y" }), /two units or two objects/);
});

test("Deduce: positive for both modes, illegal-target and idempotency", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "logic" })], objects: [{ id: "x", value: 1, pos: "1,0" }] }));
  const locationMode = useDisciplineAction(state, "a", "deduce", { hex: "2,2" });
  assert.deepEqual(locationMode.flags.deducedFalseHexes, ["2,2"]);
  const again = useDisciplineAction(locationMode, "a", "deduce", { hex: "2,2" });
  assert.deepEqual(again.flags.deducedFalseHexes, ["2,2"], "deducing the same false hex twice must not duplicate it");
  const valueMode = useDisciplineAction(state, "a", "deduce", { objectId: "x" });
  assert.equal(valueMode.objects.x.valueLocked, true);
  assert.throws(() => useDisciplineAction(state, "a", "deduce", {}), /hex to rule out or an object to lock/);
});

// ---------------- Science ----------------

test("Stabilise: positive and illegal-target", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "science" })], objects: [{ id: "x", value: 1, pos: "1,0" }] }));
  const after = useDisciplineAction(state, "a", "stabilise", { targetId: "x" });
  assert.equal(after.objects.x.stabilisedUntil, after.turn + 1);
  assert.throws(() => useDisciplineAction(state, "a", "stabilise", { targetId: "nope" }), /adjacent target/);
});

test("Transform: positive, illegal-target and stabilised/locked boundaries", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "science" })], objects: [{ id: "x", value: 1, pos: "1,0", cycle: ["off", "on"], stateIndex: 0 }] }));
  const after = useDisciplineAction(state, "a", "transform", { objectId: "x" });
  assert.equal(after.objects.x.phase, "on");
  const again = useDisciplineAction(after, "a", "transform", { objectId: "x" });
  assert.equal(again.objects.x.phase, "off", "a repeated Transform keeps advancing through the cycle rather than breaking");
  const noCycle = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "science" })], objects: [{ id: "y", value: 1, pos: "1,0" }] }));
  assert.throws(() => useDisciplineAction(noCycle, "a", "transform", { objectId: "y" }), /no state cycle/);
  const locked = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "science" })], objects: [{ id: "z", value: 1, pos: "1,0", cycle: ["a", "b"], valueLocked: true }] }));
  assert.throws(() => useDisciplineAction(locked, "a", "transform", { objectId: "z" }), /locked/);
});

test("Chain Reaction: positive, boundary (max chain length) and illegal-target (disconnected)", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "science", stats: [5, 5, 5, 9, 5] })],
    objects: [{ id: "p", value: 1, pos: "1,0" }, { id: "q", value: 2, pos: "1,-1" }, { id: "r", value: 3, pos: "2,-1" }],
  }));
  const after = useDisciplineAction(state, "a", "chain", { objectIds: ["p", "q", "r"] });
  assert.deepEqual([after.objects.p.value, after.objects.q.value, after.objects.r.value], [2, 3, 4]);
  const weakState = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "science", stats: [5, 5, 5, 0, 5] })], objects: [{ id: "p", value: 1, pos: "1,0" }, { id: "q", value: 2, pos: "1,-1" }] }));
  assert.throws(() => useDisciplineAction(weakState, "a", "chain", { objectIds: ["p", "q"] }), /affects one to/);
  const disconnected = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "science", stats: [5, 5, 5, 9, 5] })], objects: [{ id: "p", value: 1, pos: "1,0" }, { id: "q", value: 2, pos: "3,3" }] }));
  assert.throws(() => useDisciplineAction(disconnected, "a", "chain", { objectIds: ["p", "q"] }), /connected group/);
});

// ---------------- Speed ----------------

test("Relay: positive and illegal-target", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "speed", carrying: "x", pos: "0,0" }), playerUnit("b", { pos: "1,0" })],
    objects: [{ id: "x", value: 1, pos: null }],
  }));
  const after = useDisciplineAction(state, "a", "relay", { objectId: "x", receiverId: "b" });
  assert.equal(after.units.a.carrying, null);
  assert.equal(after.units.b.carrying, "x");
  assert.throws(() => useDisciplineAction(state, "a", "relay", { objectId: "x", receiverId: "nope" }), /adjacent free receiver/);
});

test("Dash: requires a just-completed Interact, then grants a free move", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "speed", move: 2 })], objects: [{ id: "x", value: 1, pos: "1,0" }] }));
  assert.throws(() => useDisciplineAction(state, "a", "dash", {}), /just completed an Interact/);
  let next = interactObject(state, "a", "x");
  assert.equal(next.units.a.ap, 1);
  next = useDisciplineAction(next, "a", "dash", {});
  assert.equal(next.units.a.ap, 0, "Dash still costs its own action point");
  assert.equal(next.units.a.bonusMoveTokens, 1);
  next = moveUnit(next, "a", "1,-1");
  assert.equal(next.units.a.pos, "1,-1");
  assert.equal(next.units.a.ap, 0, "the free move after Dash spends a token, not an action point");
  assert.equal(next.units.a.bonusMoveTokens, 0);
});

test("Interrupt: arms a reactive move that fires during the enemy phase", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "speed", pos: "1,0" })],
    enemies: [enemyUnit("e", { pos: "3,0", move: 1, range: 1, damage: 1 })],
  }));
  const armed = useDisciplineAction(state, "a", "interrupt", {});
  assert.equal(armed.units.a.interruptArmed, true);
  const resolved = resolveEnemyPhase(endPlayerPhase(armed));
  assert.equal(resolved.units.a.interruptArmed, false, "the arm is consumed by the enemy phase");
  assert.notEqual(resolved.units.a.pos, "1,0", "the armed unit should have reacted by moving away");
});

// ---------------- Interact (collect/drop) ----------------

test("ACT-04: place (drop) requires the drop hex to be adjacent, not just empty", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { pos: "0,0", carrying: "x" })], objects: [{ id: "x", value: 1, pos: null }] }));
  const dropped = interactObject(state, "a", "x", "1,0");
  assert.equal(dropped.objects.x.pos, "1,0");
  assert.throws(() => interactObject(state, "a", "x", "3,3"), /not adjacent/, "a carried object must not be placeable arbitrarily far from the carrier");
});

// ---------------- Roles ----------------

test("Guardian (guard): positive and illegal-target", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a")], objects: [{ id: "x", value: 1, pos: "1,0" }] }));
  const after = useRoleAction(state, "a", "guard", { targetId: "x" });
  assert.equal(after.objects.x.guarded, true);
  assert.throws(() => useRoleAction(state, "a", "guard", { targetId: "nope" }), /not adjacent/);
});

test("Mender (restore): positive for a hurt ally, illegal-target for an object with nothing to repair", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a"), playerUnit("b", { pos: "1,0", hp: 1, maxHp: 3 })], objects: [{ id: "x", value: 1, pos: "1,0" }] }));
  const after = useRoleAction(state, "a", "restore", { targetId: "b" });
  assert.equal(after.units.b.hp, 2);
  assert.throws(() => useRoleAction(state, "a", "restore", { targetId: "x" }), /is not damaged/);
});

test("Reckoner (reframe): positive and illegal-target for a plain object", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a")], objects: [{ id: "x", value: 1, pos: "1,0", op: "+3" }, { id: "y", value: 1, pos: "0,1" }] }));
  const after = reframeTarget(state, "a", "x", { op: "-2" });
  assert.equal(after.objects.x.op, "-2");
  assert.throws(() => reframeTarget(state, "a", "y", { op: "+1" }), /no operation or orientation/);
});

test("Reckoner (reframe): refuses a jammed rotation hex, directing the player to Force Rotate instead", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a")], objects: [{ id: "wheel", pos: "1,0", orientation: 0, jammed: true, jamDifficulty: 5, tracks: [[0, 3]] }] }));
  assert.throws(() => reframeTarget(state, "a", "wheel", { orientation: 1 }), /jammed and needs a Geometry check/);
});

// Force Rotate (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §4.2's "Geometry checks can rotate a
// jammed heavy tile"): a Geometry discipline action, not a role action, since it is Geometry's
// stat that matters — deliberately mirrors attemptCheck's power calculation (statistic plus
// adjacent support against a printed difficulty) rather than inventing a second formula.
test("Force Rotate: Geometry plus support meeting the jam difficulty rotates the tile", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "geometry", stats: [5, 5, 5, 5, 5] })],
    objects: [{ id: "wheel", pos: "1,0", orientation: 0, jammed: true, jamDifficulty: 5, tracks: [[0, 3]] }],
  }));
  const after = useDisciplineAction(state, "a", "forceRotate", { objectId: "wheel", orientation: 2 });
  const entry = after.history.at(-1);
  assert.equal(entry.action, "forceRotate");
  assert.deepEqual({ statValue: entry.statValue, support: entry.support, total: entry.total, difficulty: entry.difficulty, success: entry.success }, { statValue: 5, support: 0, total: 5, difficulty: 5, success: true });
  assert.equal(after.objects.wheel.orientation, 2);
  assert.equal(after.units.a.ap, 1, "force-rotating a jammed tile spends one action, like any other check");
});

test("Force Rotate: an adjacent ally adds support, same as attemptCheck", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "geometry", stats: [5, 3, 5, 5, 5] }), playerUnit("ally", { pos: "0,1" })],
    objects: [{ id: "wheel", pos: "1,0", orientation: 0, jammed: true, jamDifficulty: 4, tracks: [[0, 3]] }],
  }));
  const after = useDisciplineAction(state, "a", "forceRotate", { objectId: "wheel", orientation: 3 });
  const entry = after.history.at(-1);
  assert.equal(entry.support, 1);
  assert.equal(entry.success, true, "3 (Geometry) + 1 support meets a difficulty of 4");
  assert.equal(after.objects.wheel.orientation, 3);
});

test("Force Rotate: falling short of the difficulty is a recorded failure that leaves orientation unchanged", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { discipline: "geometry", stats: [5, 2, 5, 5, 5] })],
    objects: [{ id: "wheel", pos: "1,0", orientation: 0, jammed: true, jamDifficulty: 5, tracks: [[0, 3]] }],
  }));
  const after = useDisciplineAction(state, "a", "forceRotate", { objectId: "wheel", orientation: 2 });
  assert.equal(after.history.at(-1).success, false);
  assert.equal(after.objects.wheel.orientation, 0, "a failed check never moves the tile, unlike a plain Reframe");
  assert.equal(after.units.a.ap, 1, "a failed check still spends its one action");
});

test("Force Rotate: illegal-target — not adjacent, not jammed, and jammed with no jamDifficulty all throw", () => {
  const jammed = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "geometry" })], objects: [{ id: "wheel", pos: "1,0", orientation: 0, jammed: true, jamDifficulty: 5, tracks: [[0, 3]] }] }));
  const notJammed = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "geometry" })], objects: [{ id: "wheel", pos: "1,0", orientation: 0, tracks: [[0, 3]] }] }));
  const noDifficulty = createExpeditionState(baseConfig({ units: [playerUnit("a", { discipline: "geometry" })], objects: [{ id: "wheel", pos: "1,0", orientation: 0, jammed: true, tracks: [[0, 3]] }] }));
  assert.throws(() => useDisciplineAction(jammed, "a", "forceRotate", { objectId: "missing", orientation: 1 }), /adjacent/);
  assert.throws(() => useDisciplineAction(notJammed, "a", "forceRotate", { objectId: "wheel", orientation: 1 }), /is not jammed/);
  assert.throws(() => useDisciplineAction(noDifficulty, "a", "forceRotate", { objectId: "wheel", orientation: 1 }), /no jam difficulty/);
});

// networkGate (The First Whistle's "combat opens only after the network is live"): reuses
// "connect" family's own graphConnected/routeMarkerConnections rather than a second
// implementation, so a strike is a legal action even against a shielded boss — it simply
// always lands at 0 impact, the same outcome a strike below Defence already produces.
test("Strike (networkGate): a shielded enemy takes 0 impact regardless of power, until the named network is connected", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { stats: [9, 9, 9, 9, 9], pos: "0,0" })],
    enemies: [enemyUnit("boss", { pos: "1,0", hp: 5, defence: 1, networkGate: { activeNodes: ["0,0", "1,0"], edges: [], start: "0,0", end: "1,0" } })],
  }));
  const struck = strikeEnemy(state, "a", "boss");
  assert.equal(struck.history.at(-1).impact, 0, "power 9 easily beats defence 1, but the network is not connected");
  assert.equal(struck.units.boss.hp, 5, "no damage at all — a legal action, not a thrown error");
  const connected = { ...state, units: { ...state.units, boss: { ...state.units.boss, networkGate: { activeNodes: ["0,0", "1,0"], edges: [["0,0", "1,0"]], start: "0,0", end: "1,0" } } } };
  const strikeAfter = strikeEnemy(connected, "a", "boss");
  assert.equal(strikeAfter.history.at(-1).impact, 2, "once the network reads connected, the identical strike lands at full power");
});

test("Strike (networkGate): a route marker rotated into alignment connects the gate, exactly like the 'connect' family reads it", () => {
  // The marker sits at 1,-1 — a third hex adjacent to both named nodes (a route marker
  // connects two of its own neighbours, never its own hex to one of them).
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { stats: [9, 9, 9, 9, 9], pos: "0,0" })],
    enemies: [enemyUnit("boss", { pos: "1,0", hp: 5, defence: 1, networkGate: { activeNodes: ["0,0", "1,0"], routeMarkerIds: ["rm1"], start: "0,0", end: "1,0" } })],
    objects: [{ id: "rm1", pos: "1,-1", orientation: 1, paths: [[4, 5]], movable: false }],
  }));
  assert.equal(strikeEnemy(state, "a", "boss").history.at(-1).impact, 0, "the marker is not yet rotated to connect 0,0 and 1,0");
  const rotated = { ...state, objects: { ...state.objects, rm1: { ...state.objects.rm1, orientation: 0 } } };
  assert.equal(strikeEnemy(rotated, "a", "boss").history.at(-1).impact, 2, "rotated into alignment, the same strike now lands");
});

test("Mover (shove): positive after a close action, illegal-target without one", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { pos: "0,0" })], enemies: [enemyUnit("e", { pos: "1,0", hp: 1 })] }));
  const struck = strikeEnemy(state, "a", "e");
  const after = shoveTarget(struck, "a", "e", 0);
  assert.notEqual(after.units.e.pos, "1,0");
  assert.throws(() => shoveTarget(state, "a", "e", 0), /close action/);
});

test("Scout (mark): positive, and a marked enemy grants the next striker one support", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { pos: "0,0", range: 2 })], enemies: [enemyUnit("e", { pos: "2,0", hp: 5, defence: 10 })] }));
  const marked = markTarget(state, "a", "e");
  assert.equal(marked.units.e.marked, true);
  const struck = strikeEnemy(marked, "a", "e");
  assert.equal(struck.history.at(-1).support, 1, "the mark should contribute one support to the strike");
  assert.equal(struck.units.e.marked, false, "the mark is consumed once spent");
});

// ---------------- Traits ----------------

test("Precise: the first exact-match strike each round banks a support for the next strike", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { trait: "precise", stats: [6, 5, 5, 5, 5] })],
    enemies: [enemyUnit("e1", { pos: "1,0", defence: 6, hp: 5 }), enemyUnit("e2", { pos: "1,0", defence: 20, hp: 5 })],
  }));
  const first = strikeEnemy(state, "a", "e1"); // power 6 exactly matches defence 6
  assert.equal(first.units.a.preciseUsedThisRound, true);
  assert.equal(first.units.a.preciseSupportBanked, true);
  const second = strikeEnemy(first, "a", "e2");
  assert.equal(second.history.at(-1).support, 1, "the banked support should apply to this unit's very next strike");
  assert.equal(second.units.a.preciseSupportBanked, false);
});

test("Sure-footed: ignores only the first difficult hex entered each round (HEX-06)", () => {
  const board = testBoard().map((hex) => (["1,0", "2,0"].includes(`${hex.q},${hex.r}`) ? { ...hex, terrain: "difficult" } : hex));
  const state = createExpeditionState(baseConfig({ board, units: [playerUnit("a", { trait: "surefooted", move: 4 })] }));
  const reach = reachableHexes(state, "a");
  const toFirstDifficult = reach.find((hex) => hex.key === "1,0");
  assert.equal(toFirstDifficult.cost, 1, "the first difficult hex this round should be free for a Sure-footed unit");
  let next = moveUnit(state, "a", "1,0");
  assert.equal(next.units.a.sureFootedUsedThisRound, true);
  const reachAfter = reachableHexes(next, "a");
  const toSecondDifficult = reachAfter.find((hex) => hex.key === "2,0");
  assert.equal(toSecondDifficult.cost, 2, "a second difficult hex in the same round costs the normal two");
  next = resolveEnemyPhase(endPlayerPhase(next));
  assert.equal(next.units.a.sureFootedUsedThisRound, false, "the discount refreshes at the start of the next round");
});

test("Foresight: previews one additional consequence — what the board looks like if the round ended now", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { trait: "foresight", pos: "0,0" })],
    enemies: [enemyUnit("e", { pos: "1,-1", move: 1, range: 1, damage: 1 })],
  }));
  const consequences = previewCommandConsequences(state, "a", moveUnit, "a", "1,0");
  assert.equal(consequences.length, 2);
  assert.equal(consequences[0].label, "immediate");
  assert.equal(consequences[1].label, "if the round ended now");
  const plainState = createExpeditionState(baseConfig({ units: [playerUnit("a", { pos: "0,0" })] }));
  const plainConsequences = previewCommandConsequences(plainState, "a", moveUnit, "a", "1,0");
  assert.equal(plainConsequences.length, 1, "a unit without Foresight only gets the immediate consequence");
});

test("Adaptable: once per expedition, a strike may use the second-highest statistic instead", () => {
  const state = createExpeditionState(baseConfig({
    units: [playerUnit("a", { trait: "adaptable", stats: [9, 3, 5, 5, 5] })],
    enemies: [enemyUnit("e", { pos: "1,0", defence: 4, hp: 5 })],
  }));
  const withAdaptable = strikeEnemy(state, "a", "e", { useAdaptable: true });
  assert.equal(withAdaptable.history.at(-1).statIndex, 2, "should use the second-highest stat (index 2, value 5) not the highest (index 0, value 9)");
  assert.equal(withAdaptable.units.a.adaptableUsedEver, true);
  const enemyStillUp = createExpeditionState(baseConfig({ units: [playerUnit("a", { trait: "adaptable", stats: [9, 3, 5, 5, 5], hp: 3 })], enemies: [enemyUnit("e1", { pos: "1,0", defence: 4, hp: 5 }), enemyUnit("e2", { pos: "1,0", defence: 4, hp: 5 })] }));
  let next = strikeEnemy(enemyStillUp, "a", "e1", { useAdaptable: true });
  next = { ...next, units: { ...next.units, a: { ...next.units.a, ap: 2 } } };
  next = strikeEnemy(next, "a", "e2", { useAdaptable: true });
  assert.equal(next.history.at(-1).statIndex, 0, "once already used this expedition, a further useAdaptable request is ignored");
});

test("Quick: gains one free opening step on the round's first move, and wins tied initiative", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { trait: "quick", move: 2, pos: "0,0" })] }));
  const reach = reachableHexes(state, "a");
  assert.ok(reach.some((hex) => hex.cost === 3), "a Quick unit's first move each round should reach one hex further than its printed movement");
  let next = moveUnit(state, "a", [...reach].sort((a, b) => b.cost - a.cost)[0].key);
  assert.equal(next.units.a.freeStepAvailable, false, "the free step is consumed after the first move");
  const reachSecondMove = reachableHexes(next, "a");
  assert.ok(!reachSecondMove.some((hex) => hex.cost > next.units.a.move), "a later move this round gets no further bonus");
  assert.equal(initiativeWinner({ id: "quick", initiative: 5, trait: "quick" }, { id: "slow", initiative: 5 }).id, "quick");
});

// ---------------- Command dispatcher ----------------

test("applyExpeditionCommand dispatches every command type and returns structured events", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a")], objects: [{ id: "x", value: 1, pos: "1,0" }], enemies: [enemyUnit("e", { pos: "3,3" })] }));
  const guarded = applyExpeditionCommand(state, { type: "GUARD", unitId: "a", targetId: "x" });
  assert.ok(guarded.events.some((e) => e.type === "ACTION_RESOLVED" && e.action === "guard"));
  const moved = applyExpeditionCommand(guarded.state, { type: "MOVE", unitId: "a", destination: "0,-1" });
  assert.equal(moved.state.units.a.pos, "0,-1");
  assert.ok(moved.events.some((e) => e.type === "UNIT_MOVED"));
  const ended = applyExpeditionCommand(moved.state, { type: "END_PLAYER_PHASE" });
  assert.equal(ended.state.phase, "enemy");
  const resolved = applyExpeditionCommand(ended.state, { type: "RESOLVE_ENEMY_PHASE" });
  assert.equal(resolved.state.turn, state.turn + 1);
  assert.throws(() => applyExpeditionCommand(state, { type: "NOT_A_COMMAND" }), /Unknown expedition command type/);
});

test("applyExpeditionCommand emits OBJECTIVE_UPDATED only when the objective's state actually changes", () => {
  const state = createExpeditionState(baseConfig({ units: [playerUnit("a", { pos: "0,0" })], enemies: [enemyUnit("e", { pos: "1,0", hp: 1, defence: 4 })], objective: { family: "eliminate" } }));
  const struck = applyExpeditionCommand(state, { type: "STRIKE", unitId: "a", targetId: "e" });
  assert.ok(struck.events.some((e) => e.type === "OBJECTIVE_UPDATED"), "defeating the last enemy should update the objective");
  const otherState = createExpeditionState(baseConfig({ units: [playerUnit("a", { pos: "0,0" })], enemies: [enemyUnit("e", { pos: "1,0", hp: 5, defence: 100 })], objective: { family: "eliminate" } }));
  const missed = applyExpeditionCommand(otherState, { type: "STRIKE", unitId: "a", targetId: "e" });
  assert.ok(!missed.events.some((e) => e.type === "OBJECTIVE_UPDATED"), "a strike that changes nothing about the objective should not claim it did");
});
