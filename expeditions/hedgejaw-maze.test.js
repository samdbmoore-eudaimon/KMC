import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createHedgejawMaze, HEDGEJAW_MAZE_CONFIG } from "./hedgejaw-maze.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  moveUnit,
  resolveEnemyPhase,
  useDisciplineAction,
  useRoleAction,
  visitStone,
} from "./expedition-engine.js";
import { EXPEDITION_READINESS_BY_LEVEL, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function squadOf(ids) {
  const roster = expeditionRoster("primary");
  return ids.map((id) => roster.find((profile) => profile.id === id));
}

test("The Hedgejaw Maze creates a playable state from a squad including a Geometry specialist", () => {
  const state = createHedgejawMaze(squadOf(["russet", "pip", "nine"]));
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 1);
  assert.equal(state.units.russet.discipline, "geometry", "this map's own gate-clearing action needs a real Geometry hero, checked directly rather than assumed of the loan squad");
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

// Verified by direct simulation before being locked in. Nine reaches and visits both stone_3
// and stone_5 before the Hedgejaw ever acts (its one-round delay, plus both gates already lying
// on her own quickest route) — by round 2's enemy phase the *next* target is stone_9, so that
// is the gate the Hedgejaw actually closes, giving a real, felt "Geometry shifts a blocker"
// moment rather than a mechanism that exists only on paper.
test("REF: the loan squad (including Russet, a Geometry specialist) visits all three stones in order, clearing the hedge once it closes stone_9's gate", () => {
  const squad = squadOf(["russet", "pip", "nine"]);
  let state = createHedgejawMaze(squad);
  state = moveUnit(state, "nine", "1,0");
  state = visitStone(state, "nine", "stone_3");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.history.filter((h) => h.unitId === "hedgejaw").at(-1).action, "watch", "the one-round delay means the Hedgejaw does nothing in round 1");

  state = moveUnit(state, "nine", "0,1");
  state = visitStone(state, "nine", "stone_5");
  state = resolveEnemyPhase(endPlayerPhase(state));
  const closed = state.history.filter((h) => h.unitId === "hedgejaw").at(-1);
  assert.equal(closed.action, "close");
  assert.equal(closed.objectId, "hedge");
  assert.equal(state.objects.hedge.pos, "-1,-1", "stone_9's requiredFrom gate — always the current target's own gate, fully predictable");

  state = moveUnit(state, "russet", "-2,0");
  state = useDisciplineAction(state, "russet", "shift", { objectId: "hedge", to: "0,-1" });
  assert.equal(state.objects.hedge.pos, "0,-1", "shifted clear of the gate");
  state = moveUnit(state, "pip", "-1,-1");
  state = visitStone(state, "pip", "stone_9");

  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.ok(state.turn <= HEDGEJAW_MAZE_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 8);
});

test("high-tier squad: an all-Epic squad (Gossamer standing in for Russet's Geometry role) completes the identical trace shape", () => {
  const squad = squadOf(["gossamer", "cascade", "warden"]);
  let state = createHedgejawMaze(squad);
  state = moveUnit(state, "warden", "1,0");
  state = visitStone(state, "warden", "stone_3");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "warden", "0,1");
  state = visitStone(state, "warden", "stone_5");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "gossamer", "-2,0");
  state = useDisciplineAction(state, "gossamer", "shift", { objectId: "hedge", to: "0,-1" });
  state = moveUnit(state, "cascade", "-1,-1");
  state = visitStone(state, "cascade", "stone_9");
  assert.equal(state.status, "won");
});

test("ENM: the Hedgejaw always closes the current sequence target's own gate — fully deterministic, never a hidden choice", () => {
  let state = createHedgejawMaze(squadOf(["russet", "pip", "nine"]));
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 1: delay
  assert.equal(state.objects.hedge.pos, "3,-3", "still parked — the one-round delay");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 2: closes stone_3's gate, the current target
  assert.equal(state.objects.hedge.pos, "1,0");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 3: already there — nothing changes
  assert.equal(state.objects.hedge.pos, "1,0");
  assert.equal(state.history.filter((h) => h.unitId === "hedgejaw").at(-1).action, "watch", "the hedge is already on the only gate that matters — nothing left to close");
});

test("ENM: the Hedgejaw never attacks a hero directly — closing a gate is its entire behaviour", () => {
  const board = HEDGEJAW_MAZE_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "0,1" }];
  const enemy = { id: "hedgejaw", name: "Hedgejaw", side: "enemy", hp: 3, defence: 5, move: 0, range: 1, damage: 1, pos: "0,0", delay: 0, behaviour: "walk-hedge", hedgeId: "hedge" };
  const state = createExpeditionState({ id: "hedgejaw-test", moduleKey: "primary", title: "test", turnLimit: 5, board, units, enemies: [enemy], objects: [{ id: "stone_1", kind: "stone", value: 1, pos: "2,0", requiredFrom: "1,0", movable: false }, { id: "hedge", kind: "hedge", pos: "3,-3", movable: false }], objective: { family: "orderedRoute", sequence: [1] } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 3, "adjacent or not, the Hedgejaw only ever relocates the hedge, never strikes a hero");
  assert.equal(resolved.objects.hedge.pos, "1,0");
});

test("Logic's Predict and Scout's Mark both work on the Hedgejaw unchanged — no new mechanism needed for the rest of the brief's stat hook", () => {
  const state = createHedgejawMaze(squadOf(["russet", "pip", "nine"]));
  // Predict is Logic-discipline; none of the loan squad's three commons happens to be Logic
  // (Russet is Geometry, needed for Shift — see the REF trace above), so this isolated check
  // of the mechanism itself uses a spliced-in Logic hero, the same "direct construction for a
  // targeted unit test" pattern already used elsewhere in this file, not the loan squad.
  const logicHero = { ...state.units.pip, discipline: "logic" };
  const predicted = useDisciplineAction({ ...state, units: { ...state.units, pip: logicHero } }, "pip", "predict", { enemyId: "hedgejaw" });
  assert.equal(predicted.units.hedgejaw.intentRevealed, true);
  const nearNine = { ...state, units: { ...state.units, nine: { ...state.units.nine, pos: "1,0" } } };
  const marked = useRoleAction(nearNine, "nine", "mark", { targetId: "hedgejaw" });
  assert.equal(marked.units.hedgejaw.marked, true);
});

test("guarding the target stone does not stop the hedge from closing its gate — Geometry's Shift is the map's only named counter, per the brief", () => {
  let state = createHedgejawMaze(squadOf(["russet", "pip", "nine"]));
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 1: delay, nothing to guard against yet
  state = { ...state, units: { ...state.units, russet: { ...state.units.russet, pos: "2,0" } } }; // adjacent to stone_3
  state = guardTarget(state, "russet", "stone_3");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 2: the Hedgejaw closes stone_3's gate regardless
  assert.equal(state.objects.hedge.pos, "1,0", "guarding the stone itself has no bearing on the hedge — it targets the gate hex, not the stone's own protection flag");
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: a named below-recommendation squad, with its
// shortfall reproduced in the readiness result. Embark itself is never blocked by this. Level
// 4's band (unlike levels 1-2's trivial one) recommends 2 Uncommon-or-better and an average
// battle value of 16, so an all-Common squad genuinely falls short here.
test("§9: a below-battle-value, no-Uncommon squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = { level: 4, readiness: EXPEDITION_READINESS_BY_LEVEL[4] };
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "minimum_rarity_count"));
});
