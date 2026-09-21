import { expeditionRoster } from "../expeditions/expedition-roster.js";
import { createHedgejawMaze } from "../expeditions/hedgejaw-maze.js";
import { endPlayerPhase, evaluateObjective, moveUnit, resolveEnemyPhase, useDisciplineAction, visitStone } from "../expeditions/expedition-engine.js";

const roster = expeditionRoster("primary");
const squad = ["russet", "pip", "nine"].map((id) => roster.find((profile) => profile.id === id));
let state = createHedgejawMaze(squad);
const pass = [];

function act(label, update) {
  state = update(state);
  pass.push(label);
}

act("Nine reaches stone_3's only approach", (current) => moveUnit(current, "nine", "1,0"));
act("Nine visits stone_3 (the lowest value first)", (current) => visitStone(current, "nine", "stone_3"));
act("End round 1: the Hedgejaw's one-round delay means it only watches", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Nine reaches stone_5's only approach", (current) => moveUnit(current, "nine", "0,1"));
act("Nine visits stone_5", (current) => visitStone(current, "nine", "stone_5"));
act("End round 2: the Hedgejaw grows the hedge across stone_9's approach, now the current target", (current) => resolveEnemyPhase(endPlayerPhase(current)));

act("Russet closes on the hedge", (current) => moveUnit(current, "russet", "-2,0"));
act("Russet's True Shift moves the hedge clear", (current) => useDisciplineAction(current, "russet", "shift", { objectId: "hedge", to: "0,-1" }));
act("Pip reaches the now-open approach", (current) => moveUnit(current, "pip", "-1,-1"));
act("Pip visits stone_9: all three stones visited in order", (current) => visitStone(current, "pip", "stone_9"));

const objective = evaluateObjective(state);
if (state.status !== "won" || !objective.complete) throw new Error("The sample pass did not visit all three stones");

console.log(`The Hedgejaw Maze sample pass: ${state.status} in round ${state.turn} with ${state.counters.actions} player actions.`);
console.log(`Stones visited: ${objective.progress}.`);
console.log("The Hedgejaw always closes the current target's own gate — fully predictable, never a hidden choice (see hedgejaw-maze.test.js's ENM cases).");
pass.forEach((step, index) => console.log(`${String(index + 1).padStart(2, "0")}. ${step}`));
