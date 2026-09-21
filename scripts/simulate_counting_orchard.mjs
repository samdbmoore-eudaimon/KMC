import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createCountingOrchard } from "../expeditions/counting-orchard.js";
import { endPlayerPhase, evaluateObjective, interactObject, moveUnit, resolveEnemyPhase } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
let state = createCountingOrchard(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Pip collects basket_8 (she starts right on top of it)", (current) => interactObject(current, "pip", "basket_8"));
act("Pip carries it straight to the harvest gate", (current) => moveUnit(current, "pip", "0,-1"));
act("Bramble collects basket_4 (she starts right beside it)", (current) => interactObject(current, "bramble", "basket_4"));
act("Bramble places basket_4 on the gate: 4 + 8 so far", (current) => interactObject(current, "bramble", "basket_4"));
act("End round 1: the Scruffcrow advances to lane 1 and pecks basket_3, the only unguarded basket left there", (current) => resolveEnemyPhase(endPlayerPhase(current)));
act("Pip places basket_8 on the gate: 4 + 8 = 12", (current) => interactObject(current, "pip", "basket_8"));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not fill the harvest gate");

console.log(`The Counting Orchard sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Harvest gate total: ${objective.progress}.`);
console.log("Nine never needed to act — this map's fastest route only needs two heroes.");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
