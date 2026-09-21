import test from "node:test";
import assert from "node:assert/strict";
import { allExpeditionCommanders, expeditionRoster } from "./expedition-roster.js";
import { COMMANDER_POWERS, applyCommanderPower, isCommanderPowerSelectable } from "./expedition-commander.js";
import { createExpeditionState, reachableHexes } from "./expedition-engine.js";

function testBoard() {
  const hexes = [];
  for (let q = -4; q <= 4; q += 1) for (let r = -4; r <= 4; r += 1) if (Math.abs(q + r) <= 4) hexes.push({ q, r, terrain: "clear" });
  return hexes;
}

function baseConfig(overrides = {}) {
  return { id: "test", moduleKey: "primary", title: "Test", turnLimit: 4, board: testBoard(), units: [], enemies: [], objects: [], objective: { family: "eliminate" }, ...overrides };
}

test("ROS-09: every Commander from the roster has a registry entry, so none is silently unhandled", () => {
  const commanders = allExpeditionCommanders();
  assert.equal(commanders.length, 30);
  for (const commander of commanders) {
    assert.ok(COMMANDER_POWERS[commander.id], `${commander.id} (${commander.name}) has no registry entry`);
  }
});

test("ROS-09: an unimplemented Commander power is not selectable and refuses to apply with a specific reason", () => {
  const state = createExpeditionState(baseConfig());
  const unimplementedId = Object.keys(COMMANDER_POWERS).find((id) => !COMMANDER_POWERS[id].implemented);
  assert.ok(unimplementedId);
  assert.equal(isCommanderPowerSelectable(unimplementedId), false);
  assert.throws(() => applyCommanderPower(state, unimplementedId, {}), /is not yet implemented/);
  assert.throws(() => applyCommanderPower(state, "not_a_real_commander", {}), /Unknown Commander power/);
});

test("A Commander never appears in, or overlaps with, the deployable field roster", () => {
  const commanders = allExpeditionCommanders();
  const fieldIds = new Set(expeditionRoster("primary").map((p) => p.id).concat(expeditionRoster("junior").map((p) => p.id)).concat(expeditionRoster("intermediate").map((p) => p.id)));
  assert.ok(commanders.every((commander) => !fieldIds.has(commander.id)));
});

test("First Crow: after deployment, moves one hero one open hex", () => {
  const state = createExpeditionState(baseConfig({ units: [{ id: "hero", stats: [3, 3, 3, 3, 3], hearts: 3, move: 2, pos: "0,0" }] }));
  const after = applyCommanderPower(state, "primary_commander_1", { unitId: "hero", destination: "1,0" });
  assert.equal(after.units.hero.pos, "1,0");
  assert.throws(() => applyCommanderPower(state, "primary_commander_1", { unitId: "hero", destination: "9,9" }), /not on the board/);
});

test("Old Roughweather / The Almost: corrects an object's value by one", () => {
  const state = createExpeditionState(baseConfig({ objects: [{ id: "x", value: 5, pos: "1,0" }] }));
  assert.equal(applyCommanderPower(state, "primary_commander_2", { objectId: "x", delta: 1 }).objects.x.value, 6);
  assert.equal(applyCommanderPower(state, "junior_commander_9", { objectId: "x", delta: -1 }).objects.x.value, 4);
  assert.throws(() => applyCommanderPower(state, "primary_commander_2", { objectId: "missing" }), /not a known object/);
});

test("Scratch / Whistle's Price: stabilises an object through the first enemy phase", () => {
  const state = createExpeditionState(baseConfig({ objects: [{ id: "x", value: 5, pos: "1,0" }] }));
  const after = applyCommanderPower(state, "primary_commander_4", { targetId: "x" });
  assert.equal(after.objects.x.stabilisedUntil, state.turn + 1);
  const afterOther = applyCommanderPower(state, "intermediate_commander_7", { targetId: "x" });
  assert.equal(afterOther.objects.x.stabilisedUntil, state.turn + 1);
});

test("The Maybe-Flock: reveals every enemy's first intention", () => {
  const state = createExpeditionState(baseConfig({ enemies: [{ id: "e1", side: "enemy", hp: 2, defence: 4, pos: "1,0" }, { id: "e2", side: "enemy", hp: 2, defence: 4, pos: "2,0" }] }));
  const after = applyCommanderPower(state, "primary_commander_5", {});
  assert.equal(after.units.e1.intentRevealed, true);
  assert.equal(after.units.e2.intentRevealed, true);
});

test("Strawless: places a lasting obstacle on an open hex", () => {
  const state = createExpeditionState(baseConfig());
  const after = applyCommanderPower(state, "primary_commander_6", { hex: "1,0" });
  assert.equal(after.board["1,0"].terrain, "blocked");
  assert.throws(() => applyCommanderPower(after, "primary_commander_6", { hex: "1,0" }), /already blocked/);
});

test("Hollow Bough: reserves a hex that blocks entry only until the round ends", () => {
  const state = createExpeditionState(baseConfig({ units: [{ id: "hero", stats: [3, 3, 3, 3, 3], hearts: 3, move: 3, pos: "0,0" }] }));
  const after = applyCommanderPower(state, "primary_commander_8", { hex: "1,0" });
  const reach = reachableHexes(after, "hero");
  assert.ok(!reach.some((hex) => hex.key === "1,0"), "the reserved hex must not be reachable this round");
  const nextRound = { ...after, turn: after.turn + 1 };
  const reachNextRound = reachableHexes(nextRound, "hero");
  assert.ok(reachNextRound.some((hex) => hex.key === "1,0"), "the reservation must expire once the round has passed");
});

test("The Countless: freezes an enemy group for a round by extending its watch", () => {
  const state = createExpeditionState(baseConfig({ enemies: [{ id: "e", side: "enemy", hp: 2, defence: 4, pos: "1,0", delay: 0 }] }));
  const after = applyCommanderPower(state, "junior_commander_7", { enemyId: "e" });
  assert.ok(after.units.e.delay >= state.turn);
});

test("Senior Examiner Vera Kross: delays a revealed intention by one initiative step", () => {
  const state = createExpeditionState(baseConfig({ enemies: [{ id: "e", side: "enemy", hp: 2, defence: 4, pos: "1,0", initiative: 5 }] }));
  const after = applyCommanderPower(state, "intermediate_commander_1", { enemyId: "e" });
  assert.equal(after.units.e.initiative, 6);
});

test("Strawless's counterpart: remembering and restoring a changed tile reverses a placed obstacle", () => {
  const state = createExpeditionState(baseConfig());
  const blocked = applyCommanderPower(state, "primary_commander_6", { hex: "1,0" });
  assert.equal(blocked.board["1,0"].terrain, "blocked");
  const restored = applyCommanderPower(blocked, "junior_commander_4", { hex: "1,0" });
  assert.equal(restored.board["1,0"].terrain, "clear");
  assert.throws(() => applyCommanderPower(restored, "junior_commander_4", { hex: "1,0" }), /no remembered terrain/);
});

test("Rotating a route marker before the first round changes which neighbours it connects", () => {
  const state = createExpeditionState(baseConfig({ objects: [{ id: "rm1", pos: "0,0", orientation: 0, paths: [[0, 3]], movable: false }] }));
  const rotated = applyCommanderPower(state, "primary_commander_3", { markerId: "rm1", steps: 1 });
  assert.equal(rotated.objects.rm1.orientation, 1);
  const rotatedBackwards = applyCommanderPower(rotated, "primary_commander_3", { markerId: "rm1", steps: -2 });
  assert.equal(rotatedBackwards.objects.rm1.orientation, 5);
  assert.throws(() => applyCommanderPower(state, "primary_commander_3", { markerId: "not_a_marker" }), /is not a route marker/);
});

test("Revealing edge costs marks the node in state.flags without altering the graph itself", () => {
  const state = createExpeditionState(baseConfig({ objective: { family: "connect", edges: [["a", "b"], ["b", "c", 5]], activeNodes: ["a", "b", "c"], start: "a", end: "c" } }));
  const after = applyCommanderPower(state, "intermediate_commander_2", { nodeId: "b" });
  assert.deepEqual(after.flags.revealedEdgeNodes, ["b"]);
  assert.deepEqual(after.objective.edges, state.objective.edges, "revealing costs must not change the edges themselves");
  assert.throws(() => applyCommanderPower(state, "intermediate_commander_2", { nodeId: "z" }), /has no edges to reveal/);
});

test("The Ninefold Tree: turns a near miss into an exact result (reuses the one-point nudge)", () => {
  const state = createExpeditionState(baseConfig({ objects: [{ id: "x", value: 6, pos: "1,0" }] }));
  assert.equal(applyCommanderPower(state, "primary_commander_9", { objectId: "x", delta: 1 }).objects.x.value, 7);
});

test("Walking Smudge's counter: ignoring the first obscured value reuses stabilise", () => {
  const state = createExpeditionState(baseConfig({ objects: [{ id: "op_1", op: "+", pos: "1,0" }] }));
  const after = applyCommanderPower(state, "junior_commander_1", { targetId: "op_1" });
  assert.equal(after.objects.op_1.stabilisedUntil, state.turn + 1);
});

test("Cancelling a revealed enemy reaction reuses extendEnemyWatch: the enemy sits out the round", () => {
  const state = createExpeditionState(baseConfig({ enemies: [{ id: "e", side: "enemy", hp: 2, defence: 4, pos: "1,0", delay: 0 }] }));
  const after = applyCommanderPower(state, "intermediate_commander_8", { enemyId: "e" });
  assert.ok(after.units.e.delay >= state.turn);
});

test("The Tenth Scarecrow: repeats a completed interaction (collect then drop) without spending an action point", () => {
  const state = createExpeditionState(baseConfig({
    units: [{ id: "hero", stats: [3, 3, 3, 3, 3], hearts: 3, move: 2, pos: "0,0" }],
    objects: [{ id: "load", value: 5, pos: "1,0" }],
  }));
  const beforeAp = state.units.hero.ap;

  const collected = applyCommanderPower(state, "primary_commander_10", { unitId: "hero", objectId: "load" });
  assert.equal(collected.units.hero.carrying, "load");
  assert.equal(collected.objects.load.pos, null);
  assert.equal(collected.units.hero.ap, beforeAp, "a Commander power must not spend the unit's action point");

  const dropped = applyCommanderPower(collected, "primary_commander_10", { unitId: "hero", objectId: "load", destination: "0,-1" });
  assert.equal(dropped.units.hero.carrying, null);
  assert.equal(dropped.objects.load.pos, "0,-1");
  assert.equal(dropped.units.hero.ap, beforeAp);

  assert.throws(() => applyCommanderPower(state, "primary_commander_10", { unitId: "hero", objectId: "missing" }), /Unavailable object/);
});
