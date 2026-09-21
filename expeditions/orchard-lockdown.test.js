import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createOrchardLockdown, ORCHARD_LOCKDOWN_CONFIG } from "./orchard-lockdown.js";
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

test("The Orchard Lockdown creates a playable state, with gate A deliberately short and gates B/C already correct", () => {
  const state = createOrchardLockdown(squadOf(["bushel", "pip", "nine"]));
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 1);
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, false);
  assert.equal(objective.progress, "2/3 constraints", "gates B and C already read correctly; only gate A (2 + 3, needing 9) does not");
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

// Verified by direct simulation before being locked in. Bushel's Combine folds the unofficial
// spare cell into a2, correcting gate A's sum in one action — before Nearly's one-round delay
// even lets it act. A real, honestly-recorded property of this specific fix, not every map
// needs a long defensive siege to be a genuine puzzle.
test("REF: Arithmetic's Combine folds the spare cell into gate A, opening all three gates at once", () => {
  const squad = squadOf(["bushel", "pip", "nine"]);
  let state = createOrchardLockdown(squad);
  state = useDisciplineAction(state, "bushel", "combine", { firstId: "a2", secondId: "spare_a" });
  assert.equal(state.objects.a2.value, 7);
  assert.equal(state.objects.spare_a.removed, true);
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(objective.progress, "3/3 constraints");
  assert.ok(state.turn <= ORCHARD_LOCKDOWN_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 1);
});

test("high-tier squad: an all-Epic squad (Warden standing in for Bushel's Arithmetic role) completes the identical one-action trace", () => {
  const squad = squadOf(["warden", "cascade", "ninebark"]);
  let state = createOrchardLockdown(squad);
  assert.equal(state.units.warden.discipline, "arithmetic");
  state = useDisciplineAction(state, "warden", "combine", { firstId: "a2", secondId: "spare_a" });
  assert.equal(state.status, "won");
});

test("no double-counting: combining spare_a into a2 removes spare_a from play, and it was never part of the sum constraint to begin with", () => {
  const state = createOrchardLockdown(squadOf(["bushel", "pip", "nine"]));
  assert.ok(!ORCHARD_LOCKDOWN_CONFIG.objective.constraints[0].objectIds.includes("spare_a"), "the sum gate only ever lists a1 and a2 — spare_a is deliberately outside it");
});

// Left deliberately unresolved (no Combine), to prove Nearly's threat is real against a real
// squad, not just the synthetic fixture in expedition-engine.test.js's own corrupt-value tests.
// corrupt-value targets the *nearest* unguarded, unlocked ledger cell (not the highest-value
// one — that is flood-lane/wilt-root's rule, a different behaviour), so Nearly's starting
// corner naturally threatens gate C first, taking one round to close the distance.
test("ENM: Nearly corrupts the nearest unguarded, unlocked ledger cell, taking real time to close the distance", () => {
  let state = createOrchardLockdown(squadOf(["bushel", "pip", "nine"]));
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 1: delay
  assert.equal(state.history.filter((h) => h.unitId === "nearly").at(-1).action, "watch");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 2: still closing the distance
  assert.equal(state.history.filter((h) => h.unitId === "nearly").at(-1).action, "move");
  assert.equal(state.objects.c3.value, 3, "not yet in range");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 3: now adjacent, corrupts gate C's nearest cell
  const corrupted = state.history.filter((h) => h.unitId === "nearly").at(-1);
  assert.equal(corrupted.action, "corrupt");
  assert.equal(corrupted.objectId, "c3");
  assert.equal(state.objects.c3.value, null);
  assert.equal(evaluateObjective(state).progress, "1/3 constraints", "gate C (use 1-3 once) now fails too, since a null value cannot complete the set");
});

test("guarding gate C's nearest cell protects it from Nearly, who falls to the next-nearest unguarded ledger cell instead", () => {
  let state = createOrchardLockdown(squadOf(["bushel", "pip", "nine"]));
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 1: delay
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 2: closing the distance
  const near = { ...state, units: { ...state.units, nine: { ...state.units.nine, pos: "1,-1" } } };
  state = guardTarget(near, "nine", "c3");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 3: c3 guarded, so it is passed over entirely
  assert.equal(state.objects.c3.value, 3, "guarded, so untouched");
  const passedOver = state.history.filter((h) => h.unitId === "nearly").at(-1);
  assert.notEqual(passedOver.objectId, "c3", "whatever it does instead, it is never c3 again this round");
});

test("§9: a below-battle-value squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = { level: 9, readiness: EXPEDITION_READINESS_BY_LEVEL[9] };
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "all_cards_minimum_rarity"), "level 9 recommends every field card be Epic or better");
});
