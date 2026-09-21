import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createMaybeFlockRoost } from "../expeditions/maybe-flock-roost.js";
import { endPlayerPhase, evaluateObjective, moveUnit, resolveEnemyPhase } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["pip", "bramble", "nine"].map((profile) => roster.find((item) => item.id === profile));
let state = createMaybeFlockRoost(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Pip sets out for the eastern post", (current) => moveUnit(current, "pip", "-1,0"));
act("Pip continues towards the eastern post", (current) => moveUnit(current, "pip", "1,0"));
act("Bramble moves towards the southern post", (current) => moveUnit(current, "bramble", "-1,1"));
act("Bramble reaches the southern post", (current) => moveUnit(current, "bramble", "-1,2"));
act("Nine flies towards the last post", (current) => moveUnit(current, "nine", "0,1"));
act("Nine reaches the last post", (current) => moveUnit(current, "nine", "1,1"));
act("End round 1: the Maybe-Finches still study the roost", (current) => resolveEnemyPhase(endPlayerPhase(current)));
act("Pip reaches the eastern post: all three whistle posts held at once", (current) => moveUnit(current, "pip", "2,-1"));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not hold all three whistle posts");

console.log(`The Maybe-Flock Roost sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Posts held: ${objective.progress}.`);
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
