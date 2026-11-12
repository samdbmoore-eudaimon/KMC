import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createExaminationClock, deliverTasks, EXAMINATION_CLOCK_CONFIG } from "../expeditions/examination-clock.js";
import { evaluateObjective } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("intermediate");
const squad = ["gf_tambrindle", "gf_ratchet", "gf_higgins", "gf_marta"].map((id) => roster.find((profile) => profile.id === id));

// Driven by deliverTasks (examination-clock.js), the same greedy simulator the test suite
// uses, rather than a hand-transcribed hex sequence. 2026-09-21 rebuild: six tasks exist now,
// requiredCount is 4 of them, and more than one 4-of-6 combination actually clears the
// deadline (see examination-clock.js's header) — this demonstrates the cheapest, safest
// combination (the four close tasks, skipping both distant ones entirely).
const taskIds = ["task_a", "task_b", "task_c", "task_d"];
const state0 = createExaminationClock(squad);
const { success, state } = deliverTasks(state0, taskIds, EXAMINATION_CLOCK_CONFIG.turnLimit);
if (!success) throw new Error("The sample pass did not complete The Examination Clock");

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not complete The Examination Clock");

function describe(entry) {
  if (entry.action === "move") return `${entry.unitId} moves ${entry.from} -> ${entry.to} (${entry.distance} hex${entry.distance === 1 ? "" : "es"})`;
  if (entry.action === "collect") return `${entry.unitId} collects ${entry.objectId}`;
  if (entry.action === "drop") return `${entry.unitId} places ${entry.objectId} at ${entry.to}`;
  if (entry.action === "end-phase") return null;
  if (entry.phase === "enemy") return `${entry.unitId}: ${entry.action}${entry.targetId ? ` -> ${entry.targetId}` : ""}`;
  return `${entry.unitId}: ${entry.action}`;
}

const values = taskIds.map((id) => state0.objects[id].value);
console.log(`The Examination Clock sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Total processing time: ${values.join(" + ")} = ${values.reduce((a, b) => a + b, 0)}, at or under the deadline (${objective.progress}).`);
console.log("Two other combinations also clear the deadline (task_a+task_b+task_c+task_e = 11, task_a+task_b+task_d+task_e = 12) — a real choice, not the only route, see examination-clock.test.js.");
let round = 1;
console.log(`-- Round ${round} --`);
for (const entry of state.history) {
  if (entry.turn > round) { round = entry.turn; console.log(`-- Round ${round} --`); }
  const line = describe(entry);
  if (line) console.log(`   ${line}`);
}
