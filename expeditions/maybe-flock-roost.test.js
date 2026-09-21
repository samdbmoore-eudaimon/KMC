import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createMaybeFlockRoost, MAYBE_FLOCK_ROOST_CONFIG } from "./maybe-flock-roost.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  moveUnit,
  resolveEnemyPhase,
} from "./expedition-engine.js";
import { EXPEDITION_SCENARIOS, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function loanSquad() {
  const roster = expeditionRoster("primary");
  return ["pip", "bramble", "nine"].map((profile) => roster.find((item) => item.id === profile));
}

test("capture objective: complete once at least the required count of hexes hold a living player", () => {
  const board = [{ q: 0, r: 0, terrain: "clear" }, { q: 1, r: 0, terrain: "clear" }, { q: 2, r: 0, terrain: "clear" }];
  const units = [{ id: "a", stats: [1, 1, 1, 1, 1], hearts: 2, move: 1, pos: "0,0" }, { id: "b", stats: [1, 1, 1, 1, 1], hearts: 2, move: 1, pos: "5,5" }];
  const state = createExpeditionState({ id: "capture-test", moduleKey: "primary", title: "Capture test", turnLimit: 3, board, units, enemies: [], objective: { family: "capture", hexes: ["0,0", "1,0"], count: 2 } });
  assert.equal(evaluateObjective(state).complete, false, "only one of the two required hexes is held");
  assert.equal(evaluateObjective(state).progress, "1/2 held");
  const bothHeld = { ...state, units: { ...state.units, b: { ...state.units.b, pos: "1,0" } } };
  assert.equal(evaluateObjective(bothHeld).complete, true);
});

test("capture objective: count defaults to every listed hex when not given", () => {
  const board = [{ q: 0, r: 0, terrain: "clear" }, { q: 1, r: 0, terrain: "clear" }];
  const units = [{ id: "a", stats: [1, 1, 1, 1, 1], hearts: 2, move: 1, pos: "0,0" }];
  const state = createExpeditionState({ id: "capture-default-test", moduleKey: "primary", title: "Capture default test", turnLimit: 3, board, units, enemies: [], objective: { family: "capture", hexes: ["0,0", "1,0"] } });
  assert.equal(evaluateObjective(state).complete, false, "one hero cannot hold two hexes at once");
});

// The Rooststorm's directional-sum layer (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §5): an
// optional secondary AND-condition on "capture", same pattern as balance's exitHex and
// orderedRoute's centreHex — undefined sumHexes leaves ordinary capture maps (the test above)
// completely unaffected.
test("capture objective: sumHexes/sumTarget adds a directional-sum requirement on top of holding every post", () => {
  const board = [{ q: 0, r: 0, terrain: "clear" }, { q: 1, r: 0, terrain: "clear" }, { q: 2, r: 0, terrain: "clear" }, { q: 3, r: 0, terrain: "clear" }];
  const units = [{ id: "a", stats: [1, 1, 1, 1, 1], hearts: 2, move: 1, pos: "0,0" }, { id: "b", stats: [1, 1, 1, 1, 1], hearts: 2, move: 1, pos: "1,0" }];
  const objective = { family: "capture", hexes: ["0,0", "1,0"], sumHexes: ["2,0", "3,0"], sumTarget: 9 };
  const short = createExpeditionState({ id: "capture-sum-test", moduleKey: "primary", title: "test", turnLimit: 3, board, units, enemies: [], objects: [{ id: "vane_a", value: 4, pos: "2,0" }, { id: "vane_b", value: 4, pos: "3,0" }], objective });
  assert.equal(evaluateObjective(short).complete, false, "every post is held but the vanes only sum to 8");
  assert.equal(evaluateObjective(short).progress, "2/2 held · 8/9 directional sum");
  const agreed = { ...short, objects: { ...short.objects, vane_b: { ...short.objects.vane_b, value: 5 } } };
  assert.equal(evaluateObjective(agreed).complete, true);
  const oneHeld = { ...agreed, units: { ...agreed.units, b: { ...agreed.units.b, pos: "5,0" } } };
  assert.equal(evaluateObjective(oneHeld).complete, false, "the vanes agree, but only one post is held now");
});

test("The Maybe-Flock Roost creates a playable state from three Ninefold Orchard commons", () => {
  const state = createMaybeFlockRoost(loanSquad());
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 3);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

test("REF-10: the loan squad holds all three whistle posts within the round budget", () => {
  const squad = loanSquad();
  let state = createMaybeFlockRoost(squad);
  state = moveUnit(state, "pip", "-1,0");
  state = moveUnit(state, "pip", "1,0");
  state = moveUnit(state, "bramble", "-1,1");
  state = moveUnit(state, "bramble", "-1,2");
  state = moveUnit(state, "nine", "0,1");
  state = moveUnit(state, "nine", "1,1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "pip", "2,-1");
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(objective.progress, "3/3 held · 9/9 directional sum");
  assert.ok(state.turn <= MAYBE_FLOCK_ROOST_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 7);
});

test("holding only two of the three whistle posts leaves the roost unclaimed", () => {
  const squad = loanSquad();
  let state = createMaybeFlockRoost(squad);
  state = moveUnit(state, "pip", "-1,0");
  state = moveUnit(state, "pip", "1,0");
  state = moveUnit(state, "bramble", "-1,1");
  state = moveUnit(state, "bramble", "-1,2");
  assert.equal(evaluateObjective(state).complete, false);
  assert.equal(evaluateObjective(state).progress, "1/3 held · 9/9 directional sum", "the fixed vanes already agree — only the hold count is short");
});

test("ENM: the Maybe-Finches do not act during their two-round watch", () => {
  const state = createMaybeFlockRoost(loanSquad());
  const afterRoundOne = resolveEnemyPhase(endPlayerPhase(state));
  const afterRoundTwo = resolveEnemyPhase(endPlayerPhase(afterRoundOne));
  assert.equal(afterRoundOne.units.maybe_finch_a.pos, "3,-3");
  assert.equal(afterRoundTwo.units.maybe_finch_a.pos, "3,-3");
});

test("ENM: a Maybe-Finch threatens the squad once its watch delay has expired", () => {
  const board = MAYBE_FLOCK_ROOST_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "3,-2" }];
  const enemy = { id: "maybe_finch", name: "Maybe-Finch", side: "enemy", hp: 2, defence: 5, move: 2, range: 1, damage: 1, pos: "3,-1", delay: 0 };
  const state = createExpeditionState({ id: "maybe-finch-test", moduleKey: "primary", title: "Maybe-Finch test", turnLimit: 4, board, units, enemies: [enemy], objects: [], objective: { family: "eliminate" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 2, "an unguarded hero within range takes damage once the Maybe-Finch's delay has passed");
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: a named below-recommendation squad, with its
// shortfall reproduced in the readiness result. Embark itself is never blocked by this.
test("§9: a below-battle-value, no-Rare squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = EXPEDITION_SCENARIOS.primary.find((s) => s.id === "po_maybe_roost");
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "minimum_rarity_count"), "the missing two Rare-or-better cards must be named too");
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: "why one powerful card cannot satisfy every
// late-map job alone." This is the cleanest of the six maps to prove: the capture family
// requires `count` distinct hexes to hold a living player *simultaneously* — one unit can
// only ever occupy one hex, so a one-hero squad cannot reach count >= 2 no matter how the
// engine's stats or actions are stretched. Proved structurally against the objective
// itself, not by trying and failing a specific sequence.
test("§9: one hero cannot hold three whistle posts alone — proved structurally, not by trying a sequence", () => {
  const soloProfile = expeditionRoster("primary").find((profile) => profile.id === "pip");
  // Stand the lone hero directly on one of the three required posts — the most favourable
  // position possible for a solo attempt.
  const state = createExpeditionState({ ...MAYBE_FLOCK_ROOST_CONFIG, units: [{ ...soloProfile, id: "solo", pos: MAYBE_FLOCK_ROOST_CONFIG.objective.hexes[0] }] });
  const result = evaluateObjective(state);
  assert.equal(result.complete, false);
  assert.equal(result.progress, "1/3 held · 9/9 directional sum", "even best-cased, one living unit can only ever hold one of the three required hexes at a time");
  assert.equal(MAYBE_FLOCK_ROOST_CONFIG.objective.count, 3, "the objective structurally needs three simultaneous holders");
});
