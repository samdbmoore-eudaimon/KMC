// Main-App private development access (Sam, 5 October 2026): runtime-generated, planner-verified, UNCERTIFIED maps are played through the
// real controller exactly as the UI dispatches commands; the first-clear award, unlock and save clearing follow the normal path.
import test from "node:test";
import assert from "node:assert/strict";
import { generateOrchardBlueprint } from "./generation/index.js";
import { registerOrchardPuzzleHooks } from "./puzzles/index.js";
import { createOrchardController } from "./controller.js";
import { orchardV2Bucket } from "./persistence.js";
import { orchardRosterProfiles } from "./profile.js";
import { planOrchardBlueprint } from "../../scripts/dev/orchard-v2-tactical-planner.mjs";

registerOrchardPuzzleHooks();
const ownedAll = () => Object.fromEntries(Object.keys(orchardRosterProfiles()).map((id) => [id, 1]));
const progress0 = () => ({ cards: ownedAll(), stars: 0, packs: 0, expeditions: { version: 2, scenarios: { legacy: { completed: true } }, moduleSetRewarded: true } });
const TEAMS = { 1: ["sorrel", "wicker", "tuppence"], 2: ["cornix", "kernel", "beeswax"], 3: ["barrow", "cobweb", "amberly"], 4: ["barrow", "cobweb", "harvestmoon"], 5: ["warden", "gossamer", "harvestmoon"] };

function controllerFor(blueprint) {
  let progress = progress0();
  const controller = createOrchardController({ getProgress: () => progress, setProgress: (u) => { progress = typeof u === "function" ? u(progress) : u; }, generateBlueprint: () => blueprint, ensureHooks: registerOrchardPuzzleHooks });
  return { controller, get: () => progress };
}

for (const [familyId, tier, planFamily, cards] of [["maybe-flock", 1, "direct-guard", ["sorrel", "wicker", "tuppence"]], ["hollow-bough", 2, "direct-guard", ["cornix", "kernel", "beeswax"]], ["unequal-crossing", 2, "direct-guard", ["cornix", "kernel", "beeswax"]], ["turning-ravine", 2, "direct-guard", ["cornix", "kernel", "beeswax"]]]) {
  test(`private ${familyId} T${tier}: runtime map wins through the controller, awards once, unlocks the next tier and clears the save`, () => {
    const blueprint = generateOrchardBlueprint({ familyId, tier, seed: 4242 });
    assert.equal(blueprint.privateDevelopment, true);
    const plan = planOrchardBlueprint({ blueprint, teamChoices: [{ cardIds: cards }], planFamily, maxStates: 40000 });
    assert.equal(plan.status, "success", JSON.stringify(plan.metrics));
    const trace = plan.traces[0], { controller, get } = controllerFor(blueprint);
    const begun = controller.begin({ familyId, tier, cardIds: cards, deploymentAssignment: trace.initialRun.deploymentAssignment });
    // Tier gates are real: a higher tier is locked until the previous one is cleared, so only T1 can begin from a fresh profile.
    if (tier > 1) { assert.equal(begun.ok, false); assert.equal(begun.reason, "tier-locked"); return; }
    assert.equal(begun.ok, true, JSON.stringify(begun));
    let live = begun.state, award = null;
    for (const command of trace.commands) {
      const out = controller.dispatch(live, { ...command, expectedRevision: live.revision });
      assert.equal(out.result.legal, true, `${command.type}: ${out.result.reasonCode}`);
      live = out.state;
      if (out.award) award = out.award;
    }
    assert.equal(live.status, "won");
    assert.equal(award.alreadyAwarded, false);assert.equal(award.unlocksTier, 2);
    assert.equal(orchardV2Bucket(get()).activeRun, null, "the cleared run's save is gone");
  });
}

test("every family begins its tier 1 map from a fresh eligible profile through the runtime generator", () => {
  for (const familyId of ["four-locks", "turning-ravine", "unequal-crossing", "maybe-flock", "hollow-bough"]) {
    let progress = progress0();
    const controller = createOrchardController({ getProgress: () => progress, setProgress: (u) => { progress = typeof u === "function" ? u(progress) : u; }, generateBlueprint: generateOrchardBlueprint, ensureHooks: registerOrchardPuzzleHooks });
    const begun = controller.begin({ familyId, tier: 1, cardIds: TEAMS[1] });
    assert.equal(begun.ok, true, `${familyId} ${JSON.stringify(begun)}`);
    assert.equal(begun.state.blueprint.familyId, familyId);
  }
});
