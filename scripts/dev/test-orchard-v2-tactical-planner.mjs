import test from "node:test";
import assert from "node:assert/strict";
import { registerOrchardPuzzleHooks } from "../../expeditions/v2/puzzles/index.js";
import { generateFourLocksCandidate } from "../../expeditions/v2/generation/four-locks.js";
import { replayRun } from "../../expeditions/v2/run.js";
import { planOrchardBlueprint, feasibleJobAssignments, Budget, HARD_STATE_CAP } from "./orchard-v2-tactical-planner.mjs";

registerOrchardPuzzleHooks();
const candidate = (tier, seed) => generateFourLocksCandidate({ tier, seed, layoutId: "river" }).blueprint;

test("success: a replayable win is returned, verified by the production reducer, with per-command hashes", () => {
  const blueprint = candidate(2, 2);
  const result = planOrchardBlueprint({ blueprint, teamChoices: [{ cardIds: ["cornix", "kernel", "beeswax"] }], planFamily: "direct-guard", maxStates: 20000 });
  assert.equal(result.status, "success", JSON.stringify(result.metrics));
  const [trace] = result.traces;
  assert.equal(trace.perCommandHashes.length, trace.commands.length);
  assert.ok(trace.rounds <= blueprint.deadline);
  assert.ok(trace.commands.some((c) => c.type === "operate"), "the puzzle is committed with a paid Operate");
  assert.ok(trace.commands.some((c) => c.type === "request-hint" && c.payload.stage === 3), "complete draft comes from the hook's worked solution");
  const replay = replayRun({ initialRun: JSON.parse(JSON.stringify(trace.initialRun)), commands: trace.commands, finalStateHash: trace.finalStateHash }, { recordHashes: true });
  assert.equal(replay.ok, true);
  assert.equal(replay.state.status, "won");
  assert.deepEqual(replay.hashes, trace.perCommandHashes);
});

test("unsatisfiable: a stat-infeasible squad is proved impossible by exact job enumeration, not by search failure", () => {
  const blueprint = candidate(3, 1);
  const team = { cardIds: ["pip", "bushel", "furrow"] };
  assert.deepEqual(feasibleJobAssignments(blueprint, team.cardIds, "direct-guard"), []);
  const result = planOrchardBlueprint({ blueprint, teamChoices: [team], planFamily: "direct-guard", maxStates: 50 });
  assert.equal(result.status, "unsatisfiable");
  assert.equal(result.reasonCode, "stat-infeasible");
  assert.equal(result.metrics.statesSpent, 0);
});

test("unknown: an exhausted budget is reported as unknown, never as unsatisfiable", () => {
  const result = planOrchardBlueprint({ blueprint: candidate(2, 2), teamChoices: [{ cardIds: ["cornix", "kernel", "beeswax"] }], planFamily: "direct-guard", maxStates: 15 });
  assert.equal(result.status, "unknown");
  assert.equal(result.reasonCode, "budget-exhausted");
  assert.deepEqual(result.traces, []);
});

test("two distinct target teams each get their own verified trace", () => {
  const blueprint = candidate(2, 4);
  const result = planOrchardBlueprint({ blueprint, teamChoices: [{ cardIds: ["cornix", "kernel", "beeswax"] }, { cardIds: ["cornix", "kernel", "millrace"] }], planFamily: "direct-guard", maxStates: 40000 });
  assert.equal(result.metrics.perTeam.length, 2);
  assert.equal(result.metrics.perTeam[0].status, "success");
  for (const trace of result.traces) assert.equal(replayRun({ initialRun: JSON.parse(JSON.stringify(trace.initialRun)), commands: trace.commands, finalStateHash: trace.finalStateHash }).ok, true);
});

test("alcove-intercept: the higher-band alcove proof prepares the alcove and holds it with a Speed 6 shape hero", () => {
  const blueprint = candidate(1, 1);
  assert.deepEqual(feasibleJobAssignments(blueprint, ["bushel", "furrow", "pip"], "alcove-intercept"), [], "Furrow (Speed 5) cannot use the alcove");
  const result = planOrchardBlueprint({ blueprint, teamChoices: [{ cardIds: ["bushel", "dapple", "pip"] }], planFamily: "alcove-intercept", maxStates: 30000 });
  assert.equal(result.status, "success", JSON.stringify(result.metrics));
  const types = result.traces[0].commands.map((c) => c.type);
  assert.ok(types.includes("prepare-alcove"));
  assert.ok(result.traces[0].commands.some((c) => c.type === "hold" && c.payload.targetId === "alcove"));
});

test("output choices can be avoided so a second plan uses a different circuit pair", () => {
  const blueprint = candidate(2, 2);
  const first = planOrchardBlueprint({ blueprint, teamChoices: [{ cardIds: ["cornix", "kernel", "beeswax"] }], maxStates: 40000 });
  assert.equal(first.status, "success");
  const second = planOrchardBlueprint({ blueprint, teamChoices: [{ cardIds: ["cornix", "kernel", "beeswax"] }], maxStates: 60000, avoidOutputChoices: [first.traces[0].outputChoice] });
  if (second.status === "success") assert.notDeepEqual(second.traces[0].outputChoice, first.traces[0].outputChoice);
  else assert.equal(second.status, "unknown");
});

test("R-07 budget counts admitted transitions only, is hard capped, and invalid budgets fail closed", () => {
  const b = new Budget(2);
  assert.deepEqual([b.spend(), b.spend(), b.spend(), b.spend()], [true, true, false, false]);
  assert.equal(b.used, 2);
  assert.equal(b.exhausted, true);
  assert.equal(new Budget(10 * HARD_STATE_CAP).max, HARD_STATE_CAP);
  for (const bad of [NaN, -1, 1.5, "100", undefined, Infinity]) assert.throws(() => new Budget(bad), RangeError);
  const blueprint = candidate(2, 2);
  const capped = planOrchardBlueprint({ blueprint, teamChoices: [{ cardIds: ["cornix", "kernel", "beeswax"] }], maxStates: 40 });
  assert.ok(capped.metrics.statesSpent <= 40, `spent ${capped.metrics.statesSpent}`);
  assert.equal(capped.status, "unknown");
  const invalid = planOrchardBlueprint({ blueprint, teamChoices: [{ cardIds: ["cornix", "kernel", "beeswax"] }], maxStates: NaN });
  assert.equal(invalid.status, "unknown");
  assert.equal(invalid.reasonCode, "invalid-budget");
});
