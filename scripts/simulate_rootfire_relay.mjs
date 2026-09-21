import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createRootfireRelay } from "../expeditions/rootfire-relay.js";
import { evaluateObjective, useDisciplineAction } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["russet", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
let state = createRootfireRelay(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Russet's True Shift moves root_d adjacent to root_c, closing the gap into one connected chain of five", (current) => useDisciplineAction(current, "russet", "shift", { objectId: "root_d", to: "1,0" }));
act("Bramble's Chain Reaction relays the rise through root_c and root_d at once", (current) => useDisciplineAction(current, "bramble", "chain", { objectIds: ["root_c", "root_d"] }));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not relay the fire");

console.log(`The Rootfire Relay sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Both constraints satisfied: ${objective.progress} (sum ${Object.values(state.objects).filter((o) => o.kind === "root").reduce((s, o) => s + o.value, 0)}, trunk ${state.objects.root_e.value}).`);
console.log("A deliberately snappy two-action solve — Strawling's wilt is real and tested (rootfire-relay.test.js's ENM cases), just never has a chance to fire before this trace already wins.");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
