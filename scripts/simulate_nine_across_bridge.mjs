import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createNineAcrossBridge } from "../expeditions/nine-across-bridge.js";
import { endPlayerPhase, evaluateObjective, interactObject, moveUnit, resolveEnemyPhase } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
let state = createNineAcrossBridge(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Pip collects the 2-load (she starts right on top of it)", (current) => interactObject(current, "pip", "crate_2"));
act("Pip carries it onto the near bridge section", (current) => moveUnit(current, "pip", "0,-1"));
act("Nine collects the 4-load and reaches the far bridge section in one stride", (current) => interactObject(current, "nine", "crate_4"));
act("Nine carries it onto the far bridge section", (current) => moveUnit(current, "nine", "1,0"));
act("Bramble collects the 3-load", (current) => interactObject(current, "bramble", "crate_3"));
act("Bramble carries it onto the near bridge section", (current) => moveUnit(current, "bramble", "0,0"));
act("End round 1: both wind vanes still read open — Crosswind's one-round delay means it only watches", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Pip closes on the far orchard", (current) => moveUnit(current, "pip", "2,-1"));
act("Pip reaches her drop point, out of actions for the round", (current) => moveUnit(current, "pip", "2,0"));
act("Nine, already beside the far orchard, delivers the 4-load", (current) => interactObject(current, "nine", "crate_4", "2,-1"));
act("Bramble closes on the far orchard", (current) => moveUnit(current, "bramble", "2,-2"));
act("Bramble delivers the 3-load", (current) => interactObject(current, "bramble", "crate_3", "2,-2"));
act("End round 2: Crosswind turns the far wind vane closed — tied on distance with the near vane, broken alphabetically — but nothing is left to deliver through it", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Pip, already on the far orchard, delivers the 2-load: all three loads have crossed", (current) => interactObject(current, "pip", "crate_2", "2,0"));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not deliver all three loads");

console.log(`Nine Across the Turning Bridge sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Delivered: ${objective.progress}. Wind vanes: near ${state.objects.vane_near.orientation === 0 ? "open" : "closed"}, far ${state.objects.vane_far.orientation === 0 ? "open" : "closed"}.`);
console.log("Neither bridge section's raw cap of nine can ever actually be broken by these three loads (2 + 3 + 4 = 9) — see the scenario file's header note. The wind vanes gate that cap to zero when closed; the synthetic case in nine-across-bridge.test.js proves the gate itself works.");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
