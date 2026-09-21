import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createHollowBoughAwakens } from "../expeditions/hollow-bough-awakens.js";
import { endPlayerPhase, evaluateObjective, guardTarget, restoreTarget, resolveEnemyPhase } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
let state = createHollowBoughAwakens(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("End round 1: Overgrowth's one-round delay means it only watches", (current) => resolveEnemyPhase(endPlayerPhase(current)));
act("End round 2: Overgrowth closes the distance, still not yet in range", (current) => resolveEnemyPhase(endPlayerPhase(current)));
act("End round 3: left unguarded, Overgrowth damages the memorial", (current) => resolveEnemyPhase(endPlayerPhase(current)));
act("Pip restores the memorial from range", (current) => restoreTarget(current, "pip", "memorial"));
act("Bramble takes up the guard", (current) => guardTarget(current, "bramble", "memorial"));
act("End round 4: the fourth whistle sounds with the memorial guarded and undamaged", (current) => resolveEnemyPhase(endPlayerPhase(current)));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not keep the memorial standing");

console.log(`The Hollow Bough Awakens sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Memorial: ${state.objects.memorial.damaged ? "damaged" : "undamaged"} — Overgrowth's one successful strike was undone by Restore before the whistle.`);
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
