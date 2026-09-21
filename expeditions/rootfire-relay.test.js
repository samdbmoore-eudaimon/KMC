import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createRootfireRelay, ROOTFIRE_RELAY_CONFIG } from "./rootfire-relay.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  resolveEnemyPhase,
  useDisciplineAction,
} from "./expedition-engine.js";
import { EXPEDITION_READINESS_BY_LEVEL, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function squadOf(ids) {
  const roster = expeditionRoster("primary");
  return ids.map((id) => roster.find((profile) => profile.id === id));
}

test("The Rootfire Relay creates a playable state from a squad including a Geometry specialist", () => {
  const state = createRootfireRelay(squadOf(["russet", "bramble", "nine"]));
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 1);
  assert.equal(Object.keys(state.objects).length, 5);
  assert.equal(state.units.russet.discipline, "geometry");
  assert.equal(state.units.bramble.discipline, "science");
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

// Verified by direct simulation before being locked in. Both heroes start already adjacent to
// their targets, so this wins in round 1 with two actions — a deliberately snappy "one clever
// insight" map, not every level needs to be a slog (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §1's
// "a decisive final turn").
test("REF: Geometry bridges the gap, Science's Chain Reaction relays the rise through both roots at once, reaching ten with the trunk still even", () => {
  const squad = squadOf(["russet", "bramble", "nine"]);
  let state = createRootfireRelay(squad);
  assert.equal(state.objects.root_c.pos, "0,0");
  assert.equal(state.objects.root_d.pos, "2,-1");
  state = useDisciplineAction(state, "russet", "shift", { objectId: "root_d", to: "1,0" });
  assert.equal(state.objects.root_d.pos, "1,0", "now adjacent to both root_c and root_e — the gap is closed");
  state = useDisciplineAction(state, "bramble", "chain", { objectIds: ["root_c", "root_d"] });
  assert.equal(state.objects.root_c.value, 2);
  assert.equal(state.objects.root_d.value, 3);
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.ok(state.turn <= ROOTFIRE_RELAY_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 2);
});

test("high-tier squad: an all-Epic squad (Gossamer/Cascade standing in for Russet/Bramble's Geometry and Science roles) completes the identical two-action trace", () => {
  const squad = squadOf(["gossamer", "cascade", "warden"]);
  let state = createRootfireRelay(squad);
  assert.equal(state.units.gossamer.discipline, "geometry");
  assert.equal(state.units.cascade.discipline, "science");
  state = useDisciplineAction(state, "gossamer", "shift", { objectId: "root_d", to: "1,0" });
  state = useDisciplineAction(state, "cascade", "chain", { objectIds: ["root_c", "root_d"] });
  assert.equal(state.status, "won");
});

test("Combine: an Arithmetic hero can merge two adjacent roots into a fresh value, the map's own alternate route", () => {
  const state0 = createRootfireRelay(squadOf(["bushel", "russet", "nine"]));
  assert.equal(state0.units.bushel.discipline, "arithmetic");
  const near = { ...state0, units: { ...state0.units, bushel: { ...state0.units.bushel, pos: "-1,-1" } } };
  const state = useDisciplineAction(near, "bushel", "combine", { firstId: "root_b", secondId: "root_a" });
  assert.equal(state.objects.root_b.value, 3);
  assert.equal(state.objects.root_a.removed, true);
});

test("guarding a root protects it from Strawling's wilt, which falls to the next-highest unguarded root instead", () => {
  // root_b, root_d and root_e are tied at value 2; the ENM test below confirms the engine
  // breaks that tie alphabetically (root_b first), so this guards exactly that one rather
  // than an ambiguous "the highest" computed independently in the test.
  let state = createRootfireRelay(squadOf(["russet", "bramble", "nine"]));
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 1: delay, nothing to guard against yet
  // Guard only lasts one round (cleared on every object at round end, same as a unit's), so
  // it is applied fresh here, immediately before round 2 — the first round Strawling actually acts.
  state = { ...state, units: { ...state.units, russet: { ...state.units.russet, pos: "-1,-1" } } };
  state = guardTarget(state, "russet", "root_b");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 2: Strawling acts, but root_b is guarded
  assert.equal(state.objects.root_b.value, 2, "guarded, so untouched");
  assert.equal(state.objects.root_d.value, 1, "the wilt falls to the next tied root instead, alphabetically");
});

test("ENM: Strawling wilts the single highest-value unguarded root anywhere on the relay, only once its delay has passed", () => {
  let state = createRootfireRelay(squadOf(["russet", "bramble", "nine"]));
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 1: delay
  assert.equal(state.objects.root_b.value, 2, "still within the one-round delay");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 2: wilts the highest (root_b or root_d, tied at 2 — broken alphabetically)
  const wilted = state.history.filter((h) => h.unitId === "strawling").at(-1);
  assert.equal(wilted.action, "wilt");
  assert.equal(wilted.objectId, "root_b", "tied at value 2 with root_d and root_e, broken alphabetically");
  assert.equal(state.objects.root_b.value, 1);
});

test("ENM: Strawling never attacks a hero directly — wilting a root is its entire behaviour", () => {
  const board = ROOTFIRE_RELAY_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "3,-3" }];
  const enemy = { id: "strawling", name: "Strawling", side: "enemy", hp: 2, defence: 4, move: 1, range: 1, damage: 1, pos: "3,-3", delay: 0, behaviour: "wilt-root" };
  const state = createExpeditionState({ id: "strawling-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units, enemies: [enemy], objects: [{ id: "root", kind: "root", value: 5, pos: "3,-2", movable: false }], objective: { family: "eliminate" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 3, "adjacent or not, Strawling only ever wilts a root, never strikes a hero");
  assert.equal(resolved.objects.root.value, 4);
});

test("§9: a below-battle-value squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = { level: 6, readiness: EXPEDITION_READINESS_BY_LEVEL[6] };
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "minimum_rarity_count"));
});
