import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createExaminationClock, deliverTasks, EXAMINATION_CLOCK_CONFIG } from "./examination-clock.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  interactObject,
  moveUnit,
  resolveEnemyPhase,
} from "./expedition-engine.js";
import { EXPEDITION_SCENARIOS, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function loanSquad() {
  const roster = expeditionRoster("intermediate");
  return ["gf_tambrindle", "gf_ratchet", "gf_higgins", "gf_marta"].map((id) => roster.find((profile) => profile.id === id));
}

test("The Examination Clock creates a playable state from four Gifford commons", () => {
  const state = createExaminationClock(loanSquad());
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 4);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 2);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.intermediate.hardLimitMinutes);
});

// Driven by deliverTasks (examination-clock.js) — the same greedy simulator
// scripts/simulate_examination_clock.mjs uses — rather than a hand-transcribed hex sequence,
// so this can't silently go stale the next time a task's position or value changes.
test("REF-06: the loan squad completes The Examination Clock's schedule with the four cheapest, closest tasks", () => {
  const squad = loanSquad();
  const state0 = createExaminationClock(squad);
  const taskIds = ["task_a", "task_b", "task_c", "task_d"];
  const { success, state } = deliverTasks(state0, taskIds, EXAMINATION_CLOCK_CONFIG.turnLimit);
  assert.ok(success);
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.ok(state.turn <= EXAMINATION_CLOCK_CONFIG.turnLimit);
});

// 2026-09-21 rebuild: proves this is a genuine choice, not the only route — a different
// 4-of-6 combination (swapping task_d for the costlier, farther-off task_e) also clears the
// deadline (1+2+3+5 = 11 <= 12), at the price of a real detour toward the Proctors.
test("procedural choice: a different 4-of-6 combination also clears the deadline, at the cost of a real detour", () => {
  const squad = loanSquad();
  const state0 = createExaminationClock(squad);
  const taskIds = ["task_a", "task_b", "task_c", "task_e"];
  const total = taskIds.reduce((sum, id) => sum + state0.objects[id].value, 0);
  assert.equal(total, 11);
  const { success, state } = deliverTasks(state0, taskIds, EXAMINATION_CLOCK_CONFIG.turnLimit);
  assert.ok(success, "the alternate combination is genuinely deliverable, not just arithmetically valid");
  assert.equal(state.status, "won");
  assert.equal(evaluateObjective(state).complete, true);
});

// A combination that overshoots the deadline never completes, however many of the required
// four it delivers — proves not every 4-of-6 grouping is a real option, the whole point of
// making this a choice rather than "grab any four."
test("procedural choice: a combination that overshoots the deadline never completes", () => {
  const squad = loanSquad();
  const state0 = createExaminationClock(squad);
  const taskIds = ["task_d", "task_e", "task_f", "task_c"]; // 4 + 5 + 6 + 3 = 18, well over 12
  const total = taskIds.reduce((sum, id) => sum + state0.objects[id].value, 0);
  assert.equal(total, 18);
  const { state } = deliverTasks(state0, taskIds, EXAMINATION_CLOCK_CONFIG.turnLimit);
  assert.equal(evaluateObjective(state).complete, false);
});

test("delivering only three of the four tasks leaves the schedule incomplete", () => {
  const squad = loanSquad();
  let state = createExaminationClock(squad);
  for (const [unit, task, pickup] of [["gf_tambrindle", "task_a", "-2,0"], ["gf_ratchet", "task_b", "-2,1"], ["gf_higgins", "task_c", "-2,2"]]) {
    state = moveUnit(state, unit, pickup);
    state = interactObject(state, unit, task);
  }
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "gf_tambrindle", "1,0");
  state = interactObject(state, "gf_tambrindle", "task_a", "2,0");
  state = moveUnit(state, "gf_ratchet", "1,1");
  state = interactObject(state, "gf_ratchet", "task_b", "2,1");
  state = moveUnit(state, "gf_higgins", "1,2");
  state = interactObject(state, "gf_higgins", "task_c", "1,2");
  assert.equal(evaluateObjective(state).complete, false);
});

test("delivering a task that pushes the total processing time over the deadline fails the ceiling check", () => {
  const board = EXAMINATION_CLOCK_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, move: 3, pos: "0,0" }];
  const objects = [{ id: "heavy_task", value: 13, pos: "1,0" }];
  const objective = { family: "optimise", destinationHexes: ["2,0"], requiredCount: 1, target: 12 };
  let state = createExpeditionState({ id: "clock-overrun-test", moduleKey: "intermediate", title: "Overrun test", turnLimit: 5, board, units, enemies: [], objects, objective });
  state = interactObject(state, "hero", "heavy_task");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "hero", "1,0");
  state = interactObject(state, "hero", "heavy_task", "2,0");
  assert.equal(evaluateObjective(state).complete, false, "13 exceeds the deadline of 12 even though the one required task was delivered");
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: a named below-recommendation squad, with its
// shortfall reproduced in the readiness result. Embark itself is never blocked by this.
test("§9: a below-battle-value squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
    { id: "d", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = EXPEDITION_SCENARIOS.intermediate.find((s) => s.id === "gf_examination_clock");
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: "why one powerful card cannot satisfy every
// late-map job alone." Only `requiredCount` tasks actually need delivering (4 of the 6, since
// the 2026-09-21 rebuild — see examination-clock.js's header), not every task on the board.
// Each needs a Collect (at the task hex) and a Drop (at a station hex, never the same hex —
// verified below) — interactObject spends one action for each regardless of distance, so a
// solo hero needs at least one further Move between every task's own collect and drop. That is
// requiredCount x (collect + move + drop) = 12 actions at minimum, before counting any travel
// between separate tasks at all. A solo hero's entire budget across this map's five rounds is
// turnLimit x 2 AP = 10 actions — already short of the 12-action floor.
test("§9: one hero cannot complete The Examination Clock alone — even the best case exceeds the solo budget", () => {
  for (const task of EXAMINATION_CLOCK_CONFIG.objects) {
    assert.ok(!EXAMINATION_CLOCK_CONFIG.objective.destinationHexes.includes(task.pos), `${task.id} must not already start on a station hex, or delivering it would need no move at all`);
  }
  const bestCaseSoloActions = EXAMINATION_CLOCK_CONFIG.objective.requiredCount * 3; // collect + at least one move + drop, per required task
  const soloBudget = EXAMINATION_CLOCK_CONFIG.turnLimit * 2;
  assert.ok(bestCaseSoloActions > soloBudget, `${bestCaseSoloActions} minimum actions exceeds the solo budget of ${soloBudget}, even ignoring travel between separate tasks`);
});

test("ENM: a Proctor threatens the squad once its watch delay has expired", () => {
  const board = EXAMINATION_CLOCK_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "3,-1" }];
  const enemy = { id: "proctor", name: "Proctor", side: "enemy", hp: 3, defence: 6, move: 1, range: 1, damage: 1, pos: "3,-2", delay: 0 };
  let state = createExpeditionState({ id: "proctor-test", moduleKey: "intermediate", title: "Proctor test", turnLimit: 5, board, units, enemies: [enemy], objects: [], objective: { family: "eliminate" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 2, "an unguarded hero within range takes damage once the Proctor's delay has passed");
});
