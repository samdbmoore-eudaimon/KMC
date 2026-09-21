import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createFirstWhistle } from "../expeditions/first-whistle.js";
import { endPlayerPhase, evaluateObjective, moveUnit, reframeTarget, resolveEnemyPhase, strikeEnemy, useDisciplineAction } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["russet", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
let state = createFirstWhistle(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Bramble reframes the near branch true", (current) => reframeTarget(current, "bramble", "marker_near", { orientation: 0 }));
act("Russet's Force Rotate turns the jammed far branch true, opening the network", (current) => useDisciplineAction(current, "russet", "forceRotate", { objectId: "marker_far", orientation: 0 }));
act("Russet, already adjacent, lands the first strike on First Root", (current) => strikeEnemy(current, "russet", "first_root"));
act("Bramble closes on First Root", (current) => moveUnit(current, "bramble", "0,1"));
act("Nine closes on First Root", (current) => moveUnit(current, "nine", "0,-1"));
act("Nine reaches First Root's side", (current) => moveUnit(current, "nine", "2,-1"));
act("End round 1: First Root's one-round delay means it only watches", (current) => resolveEnemyPhase(endPlayerPhase(current)));
act("Russet strikes again", (current) => strikeEnemy(current, "russet", "first_root"));
act("Bramble strikes", (current) => strikeEnemy(current, "bramble", "first_root"));
act("Nine strikes: First Root falls", (current) => strikeEnemy(current, "nine", "first_root"));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not defeat First Root");

console.log(`The First Whistle sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`First Root defeated: ${objective.progress}. The network opened in round 1 — both branches turned true before it ever acted.`);
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
