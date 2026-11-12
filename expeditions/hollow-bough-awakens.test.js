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
  moveUnit,
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
  // Bramble's own spawn hex (1,0) turns out to be exactly where Overgrowth closes to by round
  // 2 — an unguarded hero standing there is now a valid target too (strikeAdjacentHero,
  // expedition-engine.js, 2026-09-21: Sam's playtest, "Guard doesn't do anything"), which would
  // otherwise redirect this round's strike onto her instead of the memorial this test is about.
  // Move her clear so the memorial is genuinely the only exposed thing, matching this test's own
  // "left deliberately unguarded... to prove Restore is needed" premise.
  state = moveUnit(state, "bramble", "0,1");
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
  assert.equal(state.counters.actions, 3, "one extra action over the old trace: Bramble's move clear of Overgrowth's path");
});

test("high-tier squad: an all-Epic squad completes the identical trace shape", () => {
  const squad = squadOf(["warden", "ninebark", "cascade"]);
  let state = createHollowBoughAwakens(squad);
  state = resolveEnemyPhase(endPlayerPhase(state));
  // Ninebark occupies the same "1,0" spawn hex Bramble did above — same fix, same reason.
  state = moveUnit(state, "ninebark", "0,1");
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
  // Same "1,0" spawn-hex fix as the REF test above: move clear so it's the memorial's own
  // guard status being tested here, not the separately-covered strikeAdjacentHero check (an
  // exposed hero isn't protected just because the memorial next to her is guarded).
  state = moveUnit(state, "bramble", "0,1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = guardTarget(state, "bramble", "memorial");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.history.filter((h) => h.unitId === "overgrowth").at(-1).action, "blocked");
  assert.equal(state.objects.memorial.damaged, false);
});

// Rewritten 2026-09-21 (Sam's playtest of The Cider Run: Guard "doesn't do anything" —
// EXPEDITIONS_CLAUDE_HANDOVER.md). Overgrowth now shares strikeAdjacentHero with every other
// lane/erosion-style enemy: an unguarded hero within its reach is struck instead of the
// memorial that round. The old contract this test named ("never attacks a hero") was exactly
// the gap that made Hollow Bough's declared "threat" pressure lane decorative — this asserts
// the replacement contract instead of the removed one.
test("ENM: an unguarded hero adjacent to Overgrowth is struck instead of the memorial; Guard blocks it; out of reach, the memorial takes the hit as before", () => {
  const board = HOLLOW_BOUGH_AWAKENS_CONFIG.board;
  const enemy = { id: "overgrowth", name: "Overgrowth", side: "enemy", hp: 5, defence: 5, move: 1, range: 1, damage: 1, pos: "0,-1", delay: 0, behaviour: "grow-toward", targetObjectId: "memorial" };
  const memorial = { id: "memorial", kind: "memorial", pos: "0,0", damaged: false };
  const objective = { family: "protect", targetId: "memorial" };

  const exposed = { id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "0,-2" };
  const exposedState = createExpeditionState({ id: "overgrowth-strike-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [exposed], enemies: [{ ...enemy }], objects: [{ ...memorial }], objective });
  const exposedResolved = resolveEnemyPhase(endPlayerPhase(exposedState));
  assert.equal(exposedResolved.units.hero.hp, 2, "an unguarded hero standing in range is struck instead of the memorial");
  assert.equal(exposedResolved.objects.memorial.damaged, false, "the strike replaces the memorial damage this round");

  const guardedState = createExpeditionState({ id: "overgrowth-strike-guarded-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [{ ...exposed, guarded: true }], enemies: [{ ...enemy }], objects: [{ ...memorial }], objective });
  const guardedResolved = resolveEnemyPhase(endPlayerPhase(guardedState));
  assert.equal(guardedResolved.units.hero.hp, 3, "Guard blocks the strike entirely");
  assert.equal(guardedResolved.objects.memorial.damaged, false);

  const farState = createExpeditionState({ id: "overgrowth-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [{ ...exposed, pos: "1,0" }], enemies: [{ ...enemy }], objects: [{ ...memorial }], objective });
  const farResolved = resolveEnemyPhase(endPlayerPhase(farState));
  assert.equal(farResolved.units.hero.hp, 3, "out of Overgrowth's reach — nobody is struck");
  assert.equal(farResolved.objects.memorial.damaged, true, "with nobody exposed, the memorial takes the hit exactly as before");
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
