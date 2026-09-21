import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createOrchardLockdown } from "../expeditions/orchard-lockdown.js";
import { evaluateObjective, useDisciplineAction } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["bushel", "pip", "nine"].map((id) => roster.find((profile) => profile.id === id));
let state = createOrchardLockdown(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Bushel's Combine folds the unofficial spare cell into gate A's short total", (current) => useDisciplineAction(current, "bushel", "combine", { firstId: "a2", secondId: "spare_a" }));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not open all three gates");

console.log(`The Orchard Lockdown sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Gates open: ${objective.progress} — gate A now reads ${state.objects.a1.value} + ${state.objects.a2.value} = 9.`);
console.log("Nearly never even gets past its one-round delay before this trace already wins — the corruption behaviour is real and independently tested (orchard-lockdown.test.js's ENM cases), just not needed here.");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
