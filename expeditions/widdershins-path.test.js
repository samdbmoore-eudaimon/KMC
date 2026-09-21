import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createWiddershinsPath, WIDDERSHINS_PATH_CONFIG } from "./widdershins-path.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  moveUnit,
  resolveEnemyPhase,
  useDisciplineAction,
  visitStone,
} from "./expedition-engine.js";
import { EXPEDITION_READINESS_BY_LEVEL, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function squadOf(ids) {
  const roster = expeditionRoster("primary");
  return ids.map((id) => roster.find((profile) => profile.id === id));
}

test("The Widdershins Path creates a playable state from three Ninefold Orchard commons", () => {
  const state = createWiddershinsPath(squadOf(["pip", "bramble", "nine"]));
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 1);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

// Verified by direct simulation before being locked in. The four ring stones are placed out
// of numeric order (2, 4, 8, 6 going one way round the ring), so a naive walk of the ring in
// either direction cannot visit them 2-4-6-8 without the centre as a shortcut — and the
// Widdershins creature reverses stone_4 then stone_8 exactly when the party is about to need
// them, forcing a real (if small) detour each time rather than letting the "outer route" work
// unconditionally.
test("REF-13: the loan squad visits all four stones in order and reaches the centre within the round budget", () => {
  const squad = squadOf(["pip", "bramble", "nine"]);
  let state = createWiddershinsPath(squad);
  state = moveUnit(state, "pip", "1,-2");
  state = visitStone(state, "pip", "stone_2");
  state = moveUnit(state, "bramble", "1,1");
  state = moveUnit(state, "nine", "0,0");
  state = moveUnit(state, "nine", "0,-1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects.stone_4.reversed, true, "stone_4 is next needed, so Widdershins reverses it");

  state = moveUnit(state, "nine", "0,0");
  state = visitStone(state, "nine", "stone_4");
  state = visitStone(state, "bramble", "stone_6");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects.stone_8.reversed, true, "stone_8 is next needed, so Widdershins reverses it");

  state = visitStone(state, "nine", "stone_8");
  assert.equal(state.status, "won", "Nine is still on the centre hex from visiting stone_4, so this both completes the sequence and reaches the centre in one action");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(objective.progress, "4/4 · centre reached");
  assert.ok(state.turn <= WIDDERSHINS_PATH_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 9);
});

test("visiting a stone out of turn, or from the wrong side, throws rather than silently doing nothing", () => {
  const state = createWiddershinsPath(squadOf(["pip", "bramble", "nine"]));
  // Bramble starts at 3,0 — not adjacent to any stone and it isn't her turn in the sequence anyway.
  assert.throws(() => visitStone(state, "bramble", "stone_6"), /not adjacent/);
  const moved = moveUnit(state, "bramble", "1,1");
  // Now adjacent to stone_6, but stone_2 hasn't been visited yet — she is standing on the
  // right entry hex, but it is not yet stone_6's turn in the sequence.
  assert.throws(() => visitStone(moved, "bramble", "stone_6"), /not the next required stone/);
});

test("approaching a stone from the wrong hex fails even when it would otherwise be its turn", () => {
  let state = createWiddershinsPath(squadOf(["pip", "bramble", "nine"]));
  state = moveUnit(state, "pip", "1,-2");
  state = visitStone(state, "pip", "stone_2");
  // stone_4 is now next, but Nine approaches from the wrong side (an ordinary ring gap that
  // happens to be adjacent, rather than the stone's actual requiredFrom hex).
  state = moveUnit(state, "nine", "0,0");
  state = moveUnit(state, "nine", "-1,1");
  assert.throws(() => visitStone(state, "nine", "stone_4"), /must approach/);
});

test("Logic's Put in Order repairs a reversed stone, restoring its normal entry — the shorter route the design doc describes", () => {
  const roster = expeditionRoster("primary");
  const thistlewick = roster.find((profile) => profile.id === "thistlewick");
  assert.equal(thistlewick.discipline, "logic");
  const squad = [thistlewick, ...squadOf(["bramble", "nine"])];
  let state = createWiddershinsPath(squad);
  state = { ...state, objects: { ...state.objects, stone_4: { ...state.objects.stone_4, reversed: true } }, units: { ...state.units, thistlewick: { ...state.units.thistlewick, pos: "0,-1" } } };
  assert.equal(state.objects.stone_4.reversed, true);
  state = useDisciplineAction(state, "thistlewick", "order", { objectId: "stone_4" });
  assert.equal(state.objects.stone_4.reversed, false, "repaired — the normal entry hex works again");
});

test("guarding a stone protects it from being reversed", () => {
  let state = createWiddershinsPath(squadOf(["pip", "bramble", "nine"]));
  state = moveUnit(state, "pip", "1,-2");
  state = visitStone(state, "pip", "stone_2");
  state = { ...state, units: { ...state.units, bramble: { ...state.units.bramble, pos: "0,-1" } } };
  state = guardTarget(state, "bramble", "stone_4");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects.stone_4.reversed, false, "guarded, so the Widdershins creature leaves it alone");
});

test("ENM: the Widdershins creature never attacks a hero — reversing the next stone is its entire behaviour", () => {
  const board = WIDDERSHINS_PATH_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "0,-2" }];
  const enemy = { id: "widdershins", name: "Widdershins", side: "enemy", hp: 3, defence: 5, move: 0, range: 1, damage: 1, pos: "0,-2", delay: 0, behaviour: "reverse-next" };
  const objects = [{ id: "stone_2", kind: "stone", value: 2, pos: "1,-1", requiredFrom: "1,-2", reversedFrom: "0,0" }];
  const state = createExpeditionState({ id: "widdershins-no-strike-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units, enemies: [enemy], objects, objective: { family: "orderedRoute", sequence: [2], centreHex: "0,0" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 3, "adjacent or not, it only ever reverses a stone, never strikes");
  assert.equal(resolved.objects.stone_2.reversed, true);
});

test("no-unannounced-impossible-state: the Widdershins creature only ever reverses the single stone the party genuinely needs next, always a deterministic function of visible data", () => {
  let state = createWiddershinsPath(squadOf(["pip", "bramble", "nine"]));
  for (let round = 1; round <= 4; round += 1) {
    state = resolveEnemyPhase(endPlayerPhase(state));
    const reversedValues = Object.values(state.objects).filter((object) => object.reversed).map((object) => object.value);
    assert.ok(reversedValues.length <= 1, `at most one stone should ever be reversed at once; got ${JSON.stringify(reversedValues)}`);
    if (reversedValues.length === 1) assert.equal(reversedValues[0], WIDDERSHINS_PATH_CONFIG.objective.sequence[state.counters.routeProgress || 0]);
  }
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: a named below-recommendation squad, with its
// shortfall reproduced in the readiness result. Embark itself is never blocked by this.
test("§9: a below-battle-value squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
  ];
  // This scenario is no longer catalogued (superseded by The Hedgejaw Maze at level 4,
  // 2026-09-17 — see hedgejaw-maze.js's header), so its readiness band is read directly off
  // EXPEDITION_READINESS_BY_LEVEL[4] rather than through a now-nonexistent catalogue lookup.
  const scenario = { level: 4, readiness: EXPEDITION_READINESS_BY_LEVEL[4] };
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "minimum_rarity_count"));
});

test("high-tier squad: an all-Epic squad completes the identical reference trace", () => {
  const squad = squadOf(["warden", "ninebark", "cascade"]);
  let state = createWiddershinsPath(squad);
  state = moveUnit(state, "warden", "1,-2");
  state = visitStone(state, "warden", "stone_2");
  state = moveUnit(state, "ninebark", "1,1");
  state = moveUnit(state, "cascade", "0,0");
  state = moveUnit(state, "cascade", "0,-1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "cascade", "0,0");
  state = visitStone(state, "cascade", "stone_4");
  state = visitStone(state, "ninebark", "stone_6");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = visitStone(state, "cascade", "stone_8");
  assert.equal(state.status, "won");
});
