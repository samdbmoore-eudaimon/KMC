import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createExaminationClock } from "../expeditions/examination-clock.js";
import { endPlayerPhase, evaluateObjective, interactObject, moveUnit, resolveEnemyPhase } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("intermediate");
const squad = ["gf_tambrindle", "gf_ratchet", "gf_higgins", "gf_marta"].map((id) => roster.find((profile) => profile.id === id));
let state = createExaminationClock(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Tambrindle moves beside the first task", (current) => moveUnit(current, "gf_tambrindle", "-2,0"));
act("Tambrindle collects the first task (duration 2)", (current) => interactObject(current, "gf_tambrindle", "task_a"));
act("Ratchet moves beside the second task", (current) => moveUnit(current, "gf_ratchet", "-2,1"));
act("Ratchet collects the second task (duration 3)", (current) => interactObject(current, "gf_ratchet", "task_b"));
act("Higgins moves beside the third task", (current) => moveUnit(current, "gf_higgins", "-2,2"));
act("Higgins collects the third task (duration 3)", (current) => interactObject(current, "gf_higgins", "task_c"));
act("Marta moves beside the fourth task", (current) => moveUnit(current, "gf_marta", "-2,3"));
act("Marta collects the fourth task (duration 4)", (current) => interactObject(current, "gf_marta", "task_d"));
act("End round 1: the Proctors still take their bearings", (current) => resolveEnemyPhase(endPlayerPhase(current)));
act("Tambrindle carries the first task to its station", (current) => moveUnit(current, "gf_tambrindle", "1,0"));
act("Tambrindle delivers the first task", (current) => interactObject(current, "gf_tambrindle", "task_a", "2,0"));
act("Ratchet carries the second task to its station", (current) => moveUnit(current, "gf_ratchet", "1,1"));
act("Ratchet delivers the second task", (current) => interactObject(current, "gf_ratchet", "task_b", "2,1"));
act("Higgins dashes to the third station using Quick's free step", (current) => moveUnit(current, "gf_higgins", "1,2"));
act("Higgins delivers the third task", (current) => interactObject(current, "gf_higgins", "task_c", "1,2"));
act("Marta carries the fourth task to its station", (current) => moveUnit(current, "gf_marta", "0,3"));
act("Marta delivers the fourth task", (current) => interactObject(current, "gf_marta", "task_d", "0,3"));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not complete The Examination Clock");

console.log(`The Examination Clock sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Total processing time: 2 + 3 + 3 + 4 = 12, at or under the deadline (${objective.progress}).`);
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
