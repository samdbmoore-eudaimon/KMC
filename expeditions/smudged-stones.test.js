import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createSmudgedStones, SMUDGED_STONES_CONFIG } from "./smudged-stones.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  moveUnit,
  reframeTarget,
  resolveEnemyPhase,
} from "./expedition-engine.js";
import { EXPEDITION_SCENARIOS, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

// Small deterministic fixture cards for readiness checks — assessSquadReadiness only ever
// reads r/bv/s, matching the pattern in expedition-readiness.test.js.
function fixtureCard(id, rarity, bv) {
  return { id, r: rarity, bv, s: [1, 1, 1, 1, 1] };
}

function loanSquad() {
  const roster = expeditionRoster("junior");
  return ["addy", "zoomby", "hunchik"].map((id) => roster.find((profile) => profile.id === id));
}

test("The Smudged Stones creates a playable state from Addy, Zoomby and Hunchik", () => {
  const state = createSmudgedStones(loanSquad());
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 2);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.junior.hardLimitMinutes);
});

test("REF-05: the loan squad can complete The Smudged Stones within its round budget", () => {
  const squad = loanSquad();
  let state = createSmudgedStones(squad);
  state = reframeTarget(state, "addy", "op_1", { op: "+" });
  state = moveUnit(state, "hunchik", "-1,1");
  state = reframeTarget(state, "hunchik", "op_2", { op: "+" });
  state = moveUnit(state, "zoomby", "0,1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "zoomby", "1,1");
  state = reframeTarget(state, "zoomby", "op_3", { op: "+" });
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.ok(state.turn <= SMUDGED_STONES_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 6);
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: a named below-recommendation squad, with its
// visible shortfall reproduced by the readiness result — Embark stays available regardless
// (expedition-readiness.js's whole file is built around never blocking it).
test("§9: a below-battle-value squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [fixtureCard("a", "common", 10), fixtureCard("b", "common", 10), fixtureCard("c", "common", 10)];
  const scenario = EXPEDITION_SCENARIOS.junior.find((s) => s.id === "lr_smudged_stones");
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"), "the specific shortfall must be named, not just a generic failure");
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: "why one powerful card cannot satisfy every
// late-map job alone." Restoring all three operators takes 3 reframe actions plus at least
// 2 move actions between them (no two operators are mutually adjacent) — 5 actions minimum,
// which needs at least 3 rounds for any single hero regardless of stats, since AP always
// resets to 2 per hero per round. The round limit is 2 (tightened from 5 on 2026-09-16
// specifically to enforce this), so a solo hero is structurally out of rounds before she can
// finish, however she is played. Proved by playing out the fastest possible solo attempt
// (the same hero from REF-05's trace, acting every round) and confirming it still loses.
test("§9: one hero cannot restore all three operators alone — she runs out of rounds even playing optimally", () => {
  let state = createSmudgedStones(loanSquad());
  state = reframeTarget(state, "addy", "op_1", { op: "+" });
  state = moveUnit(state, "addy", "-1,1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = reframeTarget(state, "addy", "op_2", { op: "+" });
  state = moveUnit(state, "addy", "1,1");
  assert.equal(evaluateObjective(state).complete, false, "two of three operators restored, but the round budget is already spent");
  const outOfRounds = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(outOfRounds.status, "lost", "no round remains for the third operator, however well the solo attempt was played");
});

test("restoring only two of the three operators leaves the chain incomplete", () => {
  const squad = loanSquad();
  let state = createSmudgedStones(squad);
  state = reframeTarget(state, "addy", "op_1", { op: "+" });
  state = moveUnit(state, "hunchik", "-1,1");
  state = reframeTarget(state, "hunchik", "op_2", { op: "+" });
  assert.equal(evaluateObjective(state).complete, false);
  assert.equal(state.status, "playing");
});

test("ENM: Walking Smudge obscures the nearest unprotected operator, but ignores a guarded or locked one", () => {
  const board = SMUDGED_STONES_CONFIG.board;
  const baseUnits = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, move: 1, pos: "1,1", discipline: "logic" }];
  const baseObjects = () => [
    { id: "protected_op", op: "+", pos: "1,0", guarded: true },
    { id: "open_op", op: "+", pos: "0,0" },
  ];
  const enemy = { id: "smudge", side: "enemy", name: "Smudge", hp: 1, defence: 4, move: 2, pos: "0,-1", behaviour: "obscure-operator" };

  let state = createExpeditionState({ id: "smudge-test", moduleKey: "junior", title: "Smudge test", turnLimit: 5, board, units: baseUnits, enemies: [enemy], objects: baseObjects(), objective: { family: "eliminate" } });
  let resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.objects.protected_op.op, "+", "a guarded operator must not be obscured");
  assert.equal(resolved.objects.open_op.op, null, "the nearest unprotected, visible operator is obscured");
});

test("ENM: a Smudge that starts out of range moves closer without ever stepping onto the operator's hex", () => {
  const board = SMUDGED_STONES_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, move: 1, pos: "3,3" }];
  const objects = [{ id: "open_op", op: "+", pos: "0,0" }];
  const enemy = { id: "smudge", side: "enemy", name: "Smudge", hp: 1, defence: 4, move: 2, pos: "3,-3", behaviour: "obscure-operator" };
  let state = createExpeditionState({ id: "smudge-approach-test", moduleKey: "junior", title: "Smudge approach test", turnLimit: 5, board, units, enemies: [enemy], objects, objective: { family: "eliminate" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.objects.open_op.op, "+", "still too far away to obscure it this round");
  assert.notEqual(resolved.units.smudge.pos, "3,-3", "it should have moved towards the operator");
  assert.notEqual(resolved.units.smudge.pos, "0,0", "it must never occupy the operator's own hex");
});

test("ENM: a value-locked operator (Deduce) is also immune to being obscured", () => {
  const board = SMUDGED_STONES_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, move: 1, pos: "3,3" }];
  const objects = [{ id: "locked_op", op: "+", pos: "0,0", valueLocked: true }];
  const enemy = { id: "smudge", side: "enemy", name: "Smudge", hp: 1, defence: 4, move: 2, pos: "1,0", behaviour: "obscure-operator" };
  let state = createExpeditionState({ id: "smudge-lock-test", moduleKey: "junior", title: "Smudge lock test", turnLimit: 5, board, units, enemies: [enemy], objects, objective: { family: "eliminate" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.objects.locked_op.op, "+");
});
