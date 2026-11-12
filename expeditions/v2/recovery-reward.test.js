// Eligible-profile shared-App reward path with the RUNTIME generator: a certified bank trace is played through the
// controller exactly as the UI dispatches commands; the award, unlock, save clearing and legacy fields are checked.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { generateOrchardBlueprint } from "./generation/index.js";
import { RUNTIME_BANK } from "./generation/runtime-bank.js";
import { registerOrchardPuzzleHooks } from "./puzzles/index.js";
import { createOrchardController } from "./controller.js";
import { orchardV2Bucket, awardKey } from "./persistence.js";
import { heroFitLine, heroRoleLine, heroJobSummary, PRACTICE_TEXT } from "./ui/squad-advice.js";
import { getOrchardV2Profile } from "./profile.js";

registerOrchardPuzzleHooks();

function traces(index) {
  const entry = RUNTIME_BANK[index];
  return JSON.parse(fs.readFileSync(new URL(`../../docs/expeditions/v2/certification/four-locks/displaced-v1/${entry.source}/traces.json`, import.meta.url), "utf8"));
}

for (const index of [0, 17, 40, 63]) {
  test(`bank entry ${index}: a certified winning trace played through the controller awards 3 stars once and unlocks tier 2`, () => {
    const trace = traces(index)[0];
    const owned = Object.fromEntries(trace.initialRun.cardIds.map((id) => [id, 1]));
    const blueprint = generateOrchardBlueprint({ familyId: "four-locks", tier: 1, seed: index });
    assert.equal(blueprint.bankIndex, index);
    let p2 = { cards: owned, stars: 19, packs: 2, expeditions: { version: 2, scenarios: { legacy: { completed: true } }, moduleSetRewarded: true } };
    const c2 = createOrchardController({ getProgress: () => p2, setProgress: (u) => { p2 = typeof u === "function" ? u(p2) : u; }, generateBlueprint: () => blueprint, ensureHooks: registerOrchardPuzzleHooks });
    const b2 = c2.begin({ familyId: "four-locks", tier: 1, cardIds: trace.initialRun.cardIds, deploymentAssignment: trace.initialRun.deploymentAssignment });
    assert.equal(b2.ok, true, JSON.stringify(b2));
    let live = b2.state, award = null;
    for (const command of trace.commands) {
      const out = c2.dispatch(live, { ...command, expectedRevision: live.revision });
      assert.equal(out.result.legal, true, `${command.type}: ${out.result.reasonCode}`);
      live = out.state;
      if (out.award) award = out.award;
    }
    assert.equal(live.status, "won");
    assert.deepEqual({ stars: award.stars, already: award.alreadyAwarded, next: award.unlocksTier }, { stars: 3, already: false, next: 2 });
    assert.equal(p2.stars, 2, "19 + 3 stars, one pack converted");
    assert.equal(p2.packs, 3);
    assert.equal(orchardV2Bucket(p2).activeRun, null);
    assert.ok(orchardV2Bucket(p2).tierAwards[awardKey("four-locks", 1)]);
    assert.equal(c2.status("four-locks").unlockedTier, 2);
    assert.deepEqual(p2.expeditions.scenarios, { legacy: { completed: true } });
    assert.equal(p2.expeditions.moduleSetRewarded, true);
    assert.equal(c2.claimWin(live), null);
    assert.equal(p2.stars, 2);
  });
}

test("setup advice explains each hero's likely job from printed stats only and what practice means", () => {
  const bushel = getOrchardV2Profile("bushel"), pip = getOrchardV2Profile("pip"), wicker = getOrchardV2Profile("wicker");
  assert.match(heroFitLine(bushel, 1), /power the number station/);
  assert.match(heroFitLine(pip, 1), /keep the tree alive/);
  assert.match(heroFitLine(wicker, 1), /No station job yet|bridge/);
  assert.match(heroRoleLine(bushel), /Guardian: best at counting and charging power/);
  const jobs = heroJobSummary(getOrchardV2Profile("dapple"), 1);
  assert.equal(jobs.find((j) => j.job === "shape").viaAlcove, true, "Dapple can keep the bridge steady only through the alcove at tier 1");
  assert.match(PRACTICE_TEXT, /Nothing is lowered and nothing is chosen for you/);
});
