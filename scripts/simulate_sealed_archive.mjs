import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createSealedArchive } from "../expeditions/sealed-archive.js";
import { endPlayerPhase, evaluateObjective, interactObject, moveUnit, resolveEnemyPhase, useDisciplineAction } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("intermediate");
const squad = ["gf_adavoss", "gf_higgins", "gf_marta", "gf_tambrindle"].map((id) => roster.find((profile) => profile.id === id));
let state = createSealedArchive(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Tam Brindle collects feeder_a (she starts right on top of it)", (current) => interactObject(current, "gf_tambrindle", "feeder_a"));
act("Tam Brindle carries it towards vault_a", (current) => moveUnit(current, "gf_tambrindle", "-1,1"));
act("Higgins sets off for feeder_b", (current) => moveUnit(current, "gf_higgins", "-1,0"));
act("Higgins closes on feeder_b", (current) => moveUnit(current, "gf_higgins", "0,-2"));
act("Marta sets off for feeder_c", (current) => moveUnit(current, "gf_marta", "-1,2"));
act("Marta closes on feeder_c", (current) => moveUnit(current, "gf_marta", "-1,3"));
act("Adavoss moves towards vault_a to be ready for the first delivery", (current) => moveUnit(current, "gf_adavoss", "-1,-1"));
act("Adavoss reaches vault_a's side", (current) => moveUnit(current, "gf_adavoss", "0,-1"));
act("End round 1: the Archive Warden and Cipher Moth still study the reading room", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Tam Brindle drops feeder_a beside vault_a", (current) => interactObject(current, "gf_tambrindle", "feeder_a"));
act("Higgins collects feeder_b", (current) => interactObject(current, "gf_higgins", "feeder_b"));
act("Higgins carries it towards vault_b", (current) => moveUnit(current, "gf_higgins", "1,-1"));
act("Marta collects feeder_c", (current) => interactObject(current, "gf_marta", "feeder_c"));
act("Marta carries it towards vault_c", (current) => moveUnit(current, "gf_marta", "-2,2"));
act("Adavoss combines vault_a with feeder_a: 3 + 5 = 8", (current) => useDisciplineAction(current, "gf_adavoss", "combine", { firstId: "vault_a", secondId: "feeder_a" }));
act("Adavoss sets off for vault_b", (current) => moveUnit(current, "gf_adavoss", "2,-2"));
act("End round 2: the Archive Warden and Cipher Moth begin their approach", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Higgins reaches vault_b's side", (current) => moveUnit(current, "gf_higgins", "0,1"));
act("Higgins drops feeder_b beside vault_b", (current) => interactObject(current, "gf_higgins", "feeder_b"));
act("Marta reaches vault_c's side", (current) => moveUnit(current, "gf_marta", "-2,1"));
act("Marta drops feeder_c beside vault_c", (current) => interactObject(current, "gf_marta", "feeder_c"));
act("Adavoss closes on vault_b", (current) => moveUnit(current, "gf_adavoss", "1,0"));
act("Adavoss reaches vault_b's side", (current) => moveUnit(current, "gf_adavoss", "1,1"));
act("End round 3: the Archive Warden and Cipher Moth close in, still out of range", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Adavoss combines vault_b with feeder_b: 4 + 8 = 12", (current) => useDisciplineAction(current, "gf_adavoss", "combine", { firstId: "vault_b", secondId: "feeder_b" }));
act("Adavoss sets off for vault_c", (current) => moveUnit(current, "gf_adavoss", "1,-1"));
act("End round 4: the Archive Warden and Cipher Moth are still out of range", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Adavoss reaches vault_c's side", (current) => moveUnit(current, "gf_adavoss", "-1,-1"));
act("Adavoss combines vault_c with feeder_c: 9 + 5 = 14", (current) => useDisciplineAction(current, "gf_adavoss", "combine", { firstId: "vault_c", secondId: "feeder_c" }));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not open The Sealed Archive");

console.log(`The Sealed Archive sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Vaults: A+B = ${state.objects.vault_a.value} + ${state.objects.vault_b.value} = 20; C = ${state.objects.vault_c.value} (even); B < C (${state.objects.vault_b.value} < ${state.objects.vault_c.value}).`);
console.log("Tam Brindle, Higgins and Marta each ferry one feeder stone home; Adavoss, the only one who can Combine, never fetches anything herself.");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
