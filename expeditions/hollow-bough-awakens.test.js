import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createHollowBoughAwakens, HOLLOW_BOUGH_AWAKENS_CONFIG } from "./hollow-bough-awakens.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  restoreTarget,
  resolveEnemyPhase,
  useDisciplineAction,
} from "./expedition-engine.js";
import { EXPEDITION_READINESS_BY_LEVEL, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function squadOf(ids) {
  const roster = expeditionRoster("primary");
  return ids.map((id) => roster.find((profile) => profile.id === id));
}

test("The Hollow Bough Awakens creates a playable state from three Ninefold Orchard commons", () => {
  const state = createHollowBoughAwakens(squadOf(["pip", "bramble", "nine"]));
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3, "the memorial is an object, not a fourth unit");
  assert.equal(state.objects.memorial.damaged, false);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

test("protect objective: an object target fails once damaged, not just once destroyed — the new clause this map needed", () => {
  const board = HOLLOW_BOUGH_AWAKENS_CONFIG.board;
  const state = createExpeditionState({ id: "protect-object-test", moduleKey: "primary", title: "test", turnLimit: 2, board, units: [], enemies: [], objects: [{ id: "memorial", kind: "memorial", pos: "0,0", damaged: false }], objective: { family: "protect", targetId: "memorial" } });
  const early = evaluateObjective(state);
  assert.equal(early.complete, false, "turn 1 has not yet passed the turn limit");
  const damaged = { ...state, objects: { ...state.objects, memorial: { ...state.objects.memorial, damaged: true } }, turn: 3 };
  assert.equal(evaluateObjective(damaged).complete, false, "damaged, so it fails even past the turn limit");
  const undamaged = { ...damaged, objects: { ...damaged.objects, memorial: { ...damaged.objects.memorial, damaged: false } } };
  assert.equal(evaluateObjective(undamaged).complete, true, "undamaged past the turn limit completes, unaffected by the new clause for an ordinary unit target elsewhere");
});

// Verified by direct simulation before being locked in. Overgrowth's one-round delay plus real
// travel time means it cannot even reach the memorial before round 3; left deliberately
// unguarded for the first three rounds to prove Restore is genuinely needed, not just named.
test("REF: Overgrowth damages the unguarded memorial once it arrives; Restore undoes it, then Guard holds the final round", () => {
  const squad = squadOf(["pip", "bramble", "nine"]);
  let state = createHollowBoughAwakens(squad);
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 1: delay
  assert.equal(state.history.filter((h) => h.unitId === "overgrowth").at(-1).action, "watch");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 2: closes the distance
  assert.equal(state.history.filter((h) => h.unitId === "overgrowth").at(-1).action, "move");
  assert.equal(state.objects.memorial.damaged, false);
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 3: unguarded, so it strikes
  assert.equal(state.history.filter((h) => h.unitId === "overgrowth").at(-1).action, "strike");
  assert.equal(state.objects.memorial.damaged, true);

  state = restoreTarget(state, "pip", "memorial");
  assert.equal(state.objects.memorial.damaged, false);
  state = guardTarget(state, "bramble", "memorial");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 4: guarded, so Overgrowth is blocked

  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(objective.progress, "4/4 rounds");
  assert.equal(state.objects.memorial.damaged, false);
  assert.ok(state.turn <= HOLLOW_BOUGH_AWAKENS_CONFIG.turnLimit + 1);
  assert.equal(state.counters.actions, 2);
});

test("high-tier squad: an all-Epic squad completes the identical trace shape", () => {
  const squad = squadOf(["warden", "ninebark", "cascade"]);
  let state = createHollowBoughAwakens(squad);
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects.memorial.damaged, true);
  state = restoreTarget(state, "warden", "memorial");
  state = guardTarget(state, "ninebark", "memorial");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.status, "won");
  assert.equal(state.objects.memorial.damaged, false);
});

test("Logic's Predict works on Overgrowth unchanged — no new mechanism needed for that half of the brief's stat hook", () => {
  const state = createHollowBoughAwakens(squadOf(["pip", "bramble", "nine"]));
  const logicHero = { ...state.units.pip, discipline: "logic" };
  const predicted = useDisciplineAction({ ...state, units: { ...state.units, pip: logicHero } }, "pip", "predict", { enemyId: "overgrowth" });
  assert.equal(predicted.units.overgrowth.intentRevealed, true);
});

test("ENM: a guarded memorial blocks Overgrowth's strike entirely, recorded as a distinct outcome from a successful one", () => {
  let state = createHollowBoughAwakens(squadOf(["pip", "bramble", "nine"]));
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = guardTarget(state, "bramble", "memorial");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.history.filter((h) => h.unitId === "overgrowth").at(-1).action, "blocked");
  assert.equal(state.objects.memorial.damaged, false);
});

test("ENM: Overgrowth never attacks a hero — damaging the memorial object is its entire behaviour", () => {
  const board = HOLLOW_BOUGH_AWAKENS_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "1,0" }];
  const enemy = { id: "overgrowth", name: "Overgrowth", side: "enemy", hp: 5, defence: 5, move: 1, range: 1, damage: 1, pos: "0,-1", delay: 0, behaviour: "grow-toward", targetObjectId: "memorial" };
  const state = createExpeditionState({ id: "overgrowth-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units, enemies: [enemy], objects: [{ id: "memorial", kind: "memorial", pos: "0,0", damaged: false }], objective: { family: "protect", targetId: "memorial" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 3, "adjacent or not, Overgrowth only ever damages the memorial object, never strikes a hero");
  assert.equal(resolved.objects.memorial.damaged, true);
});

test("§9: a below-battle-value, no-Epic squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = { level: 8, readiness: EXPEDITION_READINESS_BY_LEVEL[8] };
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "minimum_rarity_count"));
  assert.ok(result.shortfalls.some((s) => s.code === "forbidden_rarity"));
});
