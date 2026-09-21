import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createUnequalCrossing, REFERENCE_LAYOUT_SEED } from "../expeditions/unequal-crossing.js";
import { endPlayerPhase, evaluateObjective, interactObject, moveUnit, resolveEnemyPhase } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["pip", "bramble", "nine"].map((profile) => roster.find((p) => p.id === profile));
// REFERENCE_LAYOUT_SEED pins one specific generated layout (see unequal-crossing.js) so this
// sample pass stays reproducible; a real embark generates a different one each time from
// Date.now() (expedition-catalogue.js).
let state = createUnequalCrossing(squad, REFERENCE_LAYOUT_SEED);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

console.log(`Generated layout: target ${state.objective.target}, crates ${Object.values(state.objects).map((c) => `${c.value}@${c.pos}`).join(", ")}.`);

act("Bramble collects the 7-load (she starts right beside it)", (current) => interactObject(current, "bramble", "crate_7"));
act("Bramble places the 7-load on the west scale", (current) => interactObject(current, "bramble", "crate_7", "-2,1"));
act("Nine sets off for the 13-load", (current) => moveUnit(current, "nine", "0,0"));
act("Nine collects the 13-load", (current) => interactObject(current, "nine", "crate_13"));
act("Pip sets off for the 12-load", (current) => moveUnit(current, "pip", "-1,0"));
act("Pip closes on the 12-load", (current) => moveUnit(current, "pip", "0,-1"));
act("End round 1: the Hookmoles study the loads", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Nine carries the 13-load towards the west scale", (current) => moveUnit(current, "nine", "-1,0"));
act("Nine places the 13-load on the west scale: 7 + 13 = 20", (current) => interactObject(current, "nine", "crate_13", "-2,1"));
act("Pip collects the 12-load", (current) => interactObject(current, "pip", "crate_12"));
act("Pip carries it towards the east scale", (current) => moveUnit(current, "pip", "1,-1"));
act("Bramble sets off for the 8-load", (current) => moveUnit(current, "bramble", "-1,2"));
act("Bramble collects the 8-load", (current) => interactObject(current, "bramble", "crate_8"));
act("End round 2: the Hookmoles begin their approach, too late to catch anything unguarded", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Pip places the 12-load on the east scale", (current) => interactObject(current, "pip", "crate_12", "2,-1"));
act("Bramble carries the 8-load towards the east scale", (current) => moveUnit(current, "bramble", "1,0"));
act("Bramble places the 8-load on the east scale: 12 + 8 = 20", (current) => interactObject(current, "bramble", "crate_8", "2,-1"));
act("Pip sets off for the tally arch", (current) => moveUnit(current, "pip", "3,-2"));
act("Nine closes in behind", (current) => moveUnit(current, "nine", "1,-1"));
act("End round 3: both scales balanced, one hero away from the arch", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Bramble reaches the tally arch", (current) => moveUnit(current, "bramble", "3,-1"));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not complete the crossing");

console.log(`Unequal Crossing sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Final balance: ${objective.values.left} : ${objective.values.right}; exit reached: ${objective.values.exited}.`);
console.log("Both scales are one impassable hex each, loaded from any adjacent hex — no hero ever stood on either.");
console.log("This layout (values, positions and target) is generated fresh from a seed every real embark — see unequal-crossing.js's generateUnequalCrossingLayout.");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
