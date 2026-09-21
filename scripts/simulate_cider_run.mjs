import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createCiderRun } from "../expeditions/cider-run.js";
import { endPlayerPhase, evaluateObjective, interactObject, moveUnit, resolveEnemyPhase } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
// Loan squad is Bushel/Pip/Nine, not Pip/Bramble/Nine (2026-09-18: the default squad had no
// Arithmetic hero to use the map's own named alternate route — see expedition-catalogue.js).
const squad = ["bushel", "pip", "nine"].map((id) => roster.find((profile) => profile.id === id));
let state = createCiderRun(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

// REFERENCE_LAYOUT_SEED's certified pair is press_4 (lane 2, the far press on its spoke) and
// press_11 (lane 3, likewise far) — the board's three lanes now radiate from the gate at 120°
// with a near and a far press each (2026-09-18 geometry rework), so this particular pair is a
// genuine cross-board "reach" trek, not a short hop, taking three of the four available rounds.
act(`Nine sets off for the ${state.objects.press_4.value}-press`, (current) => moveUnit(current, "nine", "1,-3"));
act(`Nine collects the ${state.objects.press_4.value}-press`, (current) => interactObject(current, "nine", "press_4"));
act("Bushel sets off for the far side of the board", (current) => moveUnit(current, "bushel", "-1,1"));
act("Bushel closes in", (current) => moveUnit(current, "bushel", "-3,2"));
act("End round 1: Scruffcrow's one-round delay means it only watches", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Nine carries her press towards the gate", (current) => moveUnit(current, "nine", "1,-1"));
act(`Nine places it on the gate`, (current) => interactObject(current, "nine", "press_4", "1,-1"));
act(`Bushel collects the ${state.objects.press_11.value}-press`, (current) => interactObject(current, "bushel", "press_11"));
act("Bushel starts the long carry back", (current) => moveUnit(current, "bushel", "-1,1"));
act("End round 2: Scruffcrow's flood reaches lane 1 — nobody there, so nothing this pair needs is touched", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Bushel reaches the gate", (current) => moveUnit(current, "bushel", "1,0"));
act(`Bushel places it: ${state.objects.press_4.value} + ${state.objects.press_11.value} = ${state.objective.target}`, (current) => interactObject(current, "bushel", "press_11", "1,0"));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not fill the press gate");

console.log(`The Cider Run sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Press gate filled: ${objective.progress}.`);
console.log("Scruffcrow's flood fires right on schedule against lane 1, entirely unprompted — and never comes near this pair, because isRecoverableAfterOneFloodTick (cider-run.js) only ever certifies a layout where a slower party's near-miss can't turn into a dead run.");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
