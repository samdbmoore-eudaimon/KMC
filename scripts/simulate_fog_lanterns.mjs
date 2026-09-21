import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createFogLanterns } from "../expeditions/fog-lanterns.js";
import { evaluateObjective, useRoleAction } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("junior");
const squad = ["addy", "zoomby", "hunchik"].map((id) => roster.find((profile) => profile.id === id));
let state = createFogLanterns(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Addy reframes the first route marker (already adjacent) to join lanterns one and two", (current) => useRoleAction(current, "addy", "reframe", { targetId: "marker_1", orientation: 0 }));
act("Zoomby reframes the second route marker (already adjacent) to join lanterns two and three", (current) => useRoleAction(current, "zoomby", "reframe", { targetId: "marker_2", orientation: 0 }));
act("Hunchik reframes the third route marker (already adjacent) to join lanterns three and four", (current) => useRoleAction(current, "hunchik", "reframe", { targetId: "marker_3", orientation: 0 }));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not connect all four lanterns");

console.log(`Lanterns in the Forgetting Fog sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Network: lantern 1 -- 2 -- 3 -- 4, all three route markers correctly joined (${objective.progress}).`);
console.log("All three heroes acted in parallel, one marker each — the round limit of 1 means no single hero could visit more than one marker alone.");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
