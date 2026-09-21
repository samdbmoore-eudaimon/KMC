import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createMurderAtMoonfall, MURDER_AT_MOONFALL_CONFIG } from "./murder-at-moonfall.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  moveUnit,
  resolveEnemyPhase,
} from "./expedition-engine.js";
import { EXPEDITION_READINESS_BY_LEVEL, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function squadOf(ids) {
  const roster = expeditionRoster("primary");
  return ids.map((id) => roster.find((profile) => profile.id === id));
}

test("Murder at Moonfall creates a playable state from three Ninefold Orchard commons", () => {
  const state = createMurderAtMoonfall(squadOf(["pip", "bramble", "nine"]));
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 1);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

test("containment objective: three hedge-walled sides plus the three heroes on the remaining open hexes closes the ring", () => {
  const state = createMurderAtMoonfall(squadOf(["pip", "bramble", "nine"]));
  assert.equal(evaluateObjective(state).progress, "3/6 sides", "the three hedge walls alone, before any hero arrives");
});

// Verified by direct simulation before being locked in. Wins in round 1, before the
// Crowbreaker's one-round delay even expires — a discovery worth stating plainly: containment
// only ever needs the board to read correctly at one instant, not to survive to round's end.
test("REF: the three heroes each claim a separate open hex, closing the ring around the Crowbreaker", () => {
  const squad = squadOf(["pip", "bramble", "nine"]);
  let state = createMurderAtMoonfall(squad);
  state = moveUnit(state, "pip", "0,0");
  state = moveUnit(state, "bramble", "0,1");
  state = moveUnit(state, "nine", "1,1");
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(objective.progress, "6/6 sides");
  assert.ok(state.turn <= MURDER_AT_MOONFALL_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 3);
});

test("high-tier squad: an all-Epic squad completes the identical reference trace", () => {
  const squad = squadOf(["warden", "ninebark", "cascade"]);
  let state = createMurderAtMoonfall(squad);
  state = moveUnit(state, "warden", "0,0");
  state = moveUnit(state, "ninebark", "0,1");
  state = moveUnit(state, "cascade", "1,1");
  assert.equal(state.status, "won");
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: "why one powerful card cannot satisfy every late-map
// job alone." Containment requires `requiredSides` distinct hexes closed *simultaneously* by
// living players (or blocked terrain); one unit can only ever occupy one hex, so a solo hero
// can at best close the three hedge-walled sides plus her own one hex — four of six, never all
// six. Proved structurally, not by trying and failing a specific sequence.
test("§9: one hero cannot close the ring alone — proved structurally, not by trying a sequence", () => {
  const soloProfile = expeditionRoster("primary").find((profile) => profile.id === "pip");
  const state = createExpeditionState({ ...MURDER_AT_MOONFALL_CONFIG, units: [{ ...soloProfile, id: "solo", pos: "0,0" }] });
  const result = evaluateObjective(state);
  assert.equal(result.complete, false);
  assert.equal(result.progress, "4/6 sides", "three hedge walls plus this one hero's own hex — never six with only one unit");
});

test("guarding a hero does not help close the ring — containment reads live player positions, not a guard flag", () => {
  let state = createMurderAtMoonfall(squadOf(["pip", "bramble", "nine"]));
  state = moveUnit(state, "pip", "0,0");
  state = moveUnit(state, "bramble", "0,1");
  state = guardTarget(state, "bramble", "pip");
  assert.equal(evaluateObjective(state).progress, "5/6 sides", "guarding an ally does not occupy the sixth hex for her");
});

test("ENM: the Crowbreaker uses the engine's default hunt-and-strike behaviour — no special mechanism was invented for it", () => {
  const board = MURDER_AT_MOONFALL_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "0,0" }];
  const enemy = { id: "crowbreaker", name: "Crowbreaker", side: "enemy", hp: 5, defence: 6, move: 1, range: 1, damage: 1, pos: "1,0", delay: 0 };
  const state = createExpeditionState({ id: "crowbreaker-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units, enemies: [enemy], objects: [], objective: { family: "eliminate" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 2, "an unguarded hero already in range takes a strike, exactly like any other default-behaviour enemy");
});

test("§9: a below-battle-value, no-Epic squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = { level: 7, readiness: EXPEDITION_READINESS_BY_LEVEL[7] };
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "minimum_rarity_count"));
  assert.ok(result.shortfalls.some((s) => s.code === "forbidden_rarity"), "level 7 recommends against any Common card");
});
