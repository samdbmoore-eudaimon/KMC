import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createMurderAtMoonfall } from "../expeditions/murder-at-moonfall.js";
import { evaluateObjective, moveUnit } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
let state = createMurderAtMoonfall(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Pip closes on the western open hex", (current) => moveUnit(current, "pip", "0,0"));
act("Bramble closes on the southern open hex", (current) => moveUnit(current, "bramble", "0,1"));
act("Nine closes on the last open hex: the ring is complete", (current) => moveUnit(current, "nine", "1,1"));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not close the ring");

console.log(`Murder at Moonfall sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Ring closed: ${objective.progress} — three hedge walls plus the three heroes.`);
console.log("The Crowbreaker's one-round delay means it never even gets to act before this trace already wins.");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
