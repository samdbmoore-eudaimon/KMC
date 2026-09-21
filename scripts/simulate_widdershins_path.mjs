import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createWiddershinsPath } from "../expeditions/widdershins-path.js";
import { endPlayerPhase, evaluateObjective, moveUnit, resolveEnemyPhase, visitStone } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
let state = createWiddershinsPath(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Pip reaches the entry hex for the 2-stone", (current) => moveUnit(current, "pip", "1,-2"));
act("Pip visits the 2-stone: first in the sequence", (current) => visitStone(current, "pip", "stone_2"));
act("Bramble reaches the entry hex for the 6-stone, well ahead of needing it", (current) => moveUnit(current, "bramble", "1,1"));
act("Nine heads for the centre, on her way to the 4-stone's entry", (current) => moveUnit(current, "nine", "0,0"));
act("Nine reaches the 4-stone's entry hex", (current) => moveUnit(current, "nine", "0,-1"));
act("End round 1: the Widdershins creature reverses the 4-stone — it's what the party needs next", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Nine falls back to the centre — the 4-stone's entry now, since it was reversed", (current) => moveUnit(current, "nine", "0,0"));
act("Nine visits the 4-stone through its reversed (centre) entry: second in the sequence", (current) => visitStone(current, "nine", "stone_4"));
act("Bramble visits the 6-stone from where she has been waiting: third in the sequence", (current) => visitStone(current, "bramble", "stone_6"));
act("End round 2: the Widdershins creature reverses the 8-stone — it's what the party needs next", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Nine visits the 8-stone through its reversed (centre) entry — she never left the centre hex, so this also completes the whole expedition in one action", (current) => visitStone(current, "nine", "stone_8"));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not reach the centre with the sequence complete");

console.log(`The Widdershins Path sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Sequence: ${objective.progress}.`);
console.log("The four stones are deliberately not placed in ascending physical order around the ring, so recognising 2-4-6-8 matters as much as the reversal itself.");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
