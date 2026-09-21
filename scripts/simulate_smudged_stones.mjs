import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createSmudgedStones } from "../expeditions/smudged-stones.js";
import { endPlayerPhase, evaluateObjective, moveUnit, reframeTarget, resolveEnemyPhase } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("junior");
const squad = ["addy", "zoomby", "hunchik"].map((id) => roster.find((profile) => profile.id === id));
let state = createSmudgedStones(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Addy restores the first operator to +", (current) => reframeTarget(current, "addy", "op_1", { op: "+" }));
act("Hunchik moves beside the second operator", (current) => moveUnit(current, "hunchik", "-1,1"));
act("Hunchik restores the second operator to +", (current) => reframeTarget(current, "hunchik", "op_2", { op: "+" }));
act("Zoomby moves towards the third operator", (current) => moveUnit(current, "zoomby", "0,1"));
act("End round 1: the Smudges still study the stones", (current) => resolveEnemyPhase(endPlayerPhase(current)));
act("Zoomby reaches the third operator", (current) => moveUnit(current, "zoomby", "1,1"));
act("Zoomby restores the third operator to +", (current) => reframeTarget(current, "zoomby", "op_3", { op: "+" }));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not complete The Smudged Stones");

console.log(`The Smudged Stones sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Chain result: 3 + 5 + 7 + 9 = 24 (${objective.progress}).`);
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
