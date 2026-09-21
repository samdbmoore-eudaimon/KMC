import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createFogLanterns, FOG_LANTERNS_CONFIG } from "./fog-lanterns.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  moveUnit,
  resolveEnemyPhase,
  routeMarkerConnections,
  useRoleAction,
} from "./expedition-engine.js";
import { EXPEDITION_SCENARIOS, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function loanSquad() {
  const roster = expeditionRoster("junior");
  return ["addy", "zoomby", "hunchik"].map((id) => roster.find((profile) => profile.id === id));
}

test("Lanterns in the Forgetting Fog creates a playable state from three Little Reckoning commons", () => {
  const state = createFogLanterns(loanSquad());
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 2);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.junior.hardLimitMinutes);
});

test("the three route markers start rotated away from the lantern chain", () => {
  const state = createFogLanterns(loanSquad());
  const intendedPairs = [
    ["marker_1", "lantern_1", "lantern_2"],
    ["marker_2", "lantern_2", "lantern_3"],
    ["marker_3", "lantern_3", "lantern_4"],
  ];
  for (const [markerId, fromId, toId] of intendedPairs) {
    const connections = routeMarkerConnections(state.objects[markerId]);
    const intended = [state.objects[fromId].pos, state.objects[toId].pos];
    const joinsIntendedPair = connections.some(([a, b]) => (a === intended[0] && b === intended[1]) || (a === intended[1] && b === intended[0]));
    assert.equal(joinsIntendedPair, false, `${markerId} should not already join ${fromId} and ${toId}`);
  }
  assert.equal(evaluateObjective(state).complete, false);
});

test("REF-09: three heroes, one per marker, join all four lanterns in the same round", () => {
  const squad = loanSquad();
  let state = createFogLanterns(squad);
  state = useRoleAction(state, "addy", "reframe", { targetId: "marker_1", orientation: 0 });
  state = useRoleAction(state, "zoomby", "reframe", { targetId: "marker_2", orientation: 0 });
  state = useRoleAction(state, "hunchik", "reframe", { targetId: "marker_3", orientation: 0 });
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(objective.progress, "4 active nodes");
  assert.ok(state.turn <= FOG_LANTERNS_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 3);
});

test("joining only two of the three route markers leaves the network broken", () => {
  const squad = loanSquad();
  let state = createFogLanterns(squad);
  state = useRoleAction(state, "addy", "reframe", { targetId: "marker_1", orientation: 0 });
  state = useRoleAction(state, "zoomby", "reframe", { targetId: "marker_2", orientation: 0 });
  assert.equal(evaluateObjective(state).complete, false, "lantern 4 is still unreachable without marker_3 correctly joined");
});

test("a route marker left one step off orientation still fails to connect its lanterns", () => {
  const state = createFogLanterns(loanSquad());
  const almost = { ...state, objects: { ...state.objects, marker_2: { ...state.objects.marker_2, orientation: 1 } } };
  assert.equal(evaluateObjective(almost).complete, false);
});

test("ENM: the Foglings do not act during their two-round watch", () => {
  const state = createFogLanterns(loanSquad());
  const afterRoundOne = resolveEnemyPhase(endPlayerPhase(state));
  const afterRoundTwo = resolveEnemyPhase(endPlayerPhase(afterRoundOne));
  assert.equal(afterRoundOne.units.fogling_a.pos, "3,-2");
  assert.equal(afterRoundTwo.units.fogling_a.pos, "3,-2");
});

test("ENM: a Fogling threatens the squad once its watch delay has expired", () => {
  const board = FOG_LANTERNS_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "3,-1" }];
  const enemy = { id: "fogling", name: "Fogling", side: "enemy", hp: 2, defence: 5, move: 2, range: 1, damage: 1, pos: "3,0", delay: 0 };
  const state = createExpeditionState({ id: "fogling-test", moduleKey: "junior", title: "Fogling test", turnLimit: 5, board, units, enemies: [enemy], objects: [], objective: { family: "eliminate" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 2, "an unguarded hero within range takes damage once the Fogling's delay has passed");
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: a named below-recommendation squad, with its
// shortfall reproduced in the readiness result. Embark itself is never blocked by this.
test("§9: a below-battle-value, no-Uncommon squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 12, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 12, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 12, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = EXPEDITION_SCENARIOS.junior.find((s) => s.id === "lr_fog_lanterns");
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "minimum_rarity_count"));
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: "why one powerful card cannot satisfy every
// late-map job alone." Redesigned on 2026-09-16 specifically to make this true: each hero
// now starts adjacent to a different marker (so the three-hero solution needs no travel at
// all), and the round limit is 1 — a solo hero would need to reach all three widely spaced
// markers herself, which needs at least 3 rounds by the same action-count argument as The
// Smudged Stones. Proved by playing the best possible solo opening (reframe the nearest
// marker, then try to press on) and confirming the round ends in a loss.
test("§9: one hero cannot join all four lanterns alone — she has no second round to reach the other markers", () => {
  let state = createFogLanterns(loanSquad());
  state = useRoleAction(state, "hunchik", "reframe", { targetId: "marker_3", orientation: 0 });
  assert.equal(evaluateObjective(state).complete, false, "one marker joined, but the other two markers are far outside her one round");
  const outOfRounds = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(outOfRounds.status, "lost", "no second round exists for her to reach marker_1 or marker_2");
});
