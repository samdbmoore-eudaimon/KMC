import test from "node:test";
import assert from "node:assert/strict";
import { makeFixtureBlueprint, registerFixtureHooks } from "./fixture.js";
import { Driver, playFixtureToWin } from "./test-helpers.js";
import { exportRunRecord, stateHash, createRun } from "./run.js";
import { reduceCommand } from "./actions.js";
import { freshProgress, flattenProgress } from "../../wm-progress.js";
import {
  applyOrchardV2Result, awardKey, beginOrchardRun, clearActiveRun, familyStatus, loadActiveRun, orchardV2Bucket, previewOrchardV2Award, recordOrchardLoss,
  requestedSeedFor, saveActiveRun, shouldPersist, tierUnlocked, verifyOrchardV2Win,
} from "./persistence.js";

registerFixtureHooks();
const SQUAD = ["bushel", "furrow", "pip"];
const OWNED = { bushel: 1, furrow: 1, pip: 2, cornix: 1, kernel: 1, beeswax: 1 };
const generateBlueprint = ({ familyId, tier, seed }) => ({ ...makeFixtureBlueprint({ tier, enemyWake: 4 }), familyId, seed });

function profile() {
  const p = { ...flattenProgress(freshProgress(), "primary"), cards: { ...OWNED } };
  return { ...p, expeditions: { version: 2, scenarios: { po_cider_run: { completed: true, bestTurns: 3 } }, moduleSetRewarded: true } };
}

function start(p, extra = {}) {
  const begun = beginOrchardRun(p, { familyId: "four-locks", tier: 1, cardIds: SQUAD, generateBlueprint, ...extra });
  assert.equal(begun.ok, true, JSON.stringify(begun));
  return { ...begun, progress: begun.update(p) };
}

test("a verified first clear grants 3 stars once, converts packs, unlocks the next tier and preserves legacy progress", () => {
  const p0 = { ...profile(), stars: 19, packs: 4 };
  const begun = start(p0);
  const d = playFixtureToWin(new Driver(begun.state));
  assert.equal(d.state.status, "won");
  const record = exportRunRecord(d.state);
  const preview = previewOrchardV2Award(begun.progress, record);
  assert.deepEqual({ stars: preview.stars, already: preview.alreadyAwarded, next: preview.unlocksTier }, { stars: 3, already: false, next: 2 });
  const p1 = applyOrchardV2Result(begun.progress, { record });
  assert.equal(p1.stars, 2, "19 + 3 = 22, minus one pack of 20");
  assert.equal(p1.packs, 5);
  const bucket = orchardV2Bucket(p1);
  const key = awardKey("four-locks", 1);
  assert.equal(bucket.tierAwards[key].stars, 3);
  assert.equal(bucket.tierAwards[key].runId, begun.runId);
  assert.equal(bucket.activeRun, null, "active run cleared by the same atomic transaction");
  assert.equal(tierUnlocked(p1, "four-locks", 2), true);
  assert.equal(tierUnlocked(p1, "four-locks", 3), false, "skipped tiers are not unlocked");
  assert.equal(p1.expeditions.moduleSetRewarded, true, "no new module-set reward and legacy flag preserved");
  assert.deepEqual(p1.expeditions.scenarios.po_cider_run, { completed: true, bestTurns: 3 });
  assert.equal(p1.challengeTokens, p0.challengeTokens, "no new Reveal token from v2");
});

test("duplicate callbacks, replays of the same run and any later win of the same tier add no stars", () => {
  const begun = start(profile());
  const d = playFixtureToWin(new Driver(begun.state));
  const record = exportRunRecord(d.state);
  const once = applyOrchardV2Result(begun.progress, { record });
  assert.strictEqual(applyOrchardV2Result(once, { record }), once, "duplicate callback returns the identical object");
  const again = start(once, { mode: "new-map" });
  const d2 = playFixtureToWin(new Driver(again.state));
  assert.equal(d2.state.status, "won");
  const preview = previewOrchardV2Award(again.progress, exportRunRecord(d2.state));
  assert.equal(preview.alreadyAwarded, true);
  assert.equal(preview.stars, 0);
  const twice = applyOrchardV2Result(again.progress, { record: exportRunRecord(d2.state) });
  assert.equal(twice.stars, once.stars);
  assert.equal(twice.packs, once.packs);
  assert.ok(orchardV2Bucket(twice).tierBest[awardKey("four-locks", 1)].commands > 0);
});

test("a forged or edited record is refused: replay is the only proof", () => {
  const begun = start(profile());
  const d = playFixtureToWin(new Driver(begun.state));
  const record = JSON.parse(JSON.stringify(exportRunRecord(d.state)));
  assert.equal(verifyOrchardV2Win(record).ok, true);
  assert.equal(applyOrchardV2Result(begun.progress, { record: { status: "won", won: true } }), begun.progress, "ad-hoc won:true is insufficient");
  const dropped = JSON.parse(JSON.stringify(record));
  dropped.commands.splice(8, 1);
  assert.equal(applyOrchardV2Result(begun.progress, { record: dropped }), begun.progress);
  const hash = JSON.parse(JSON.stringify(record));
  hash.finalStateHash = "0000000000000000";
  assert.equal(applyOrchardV2Result(begun.progress, { record: hash }), begun.progress);
  const lost = JSON.parse(JSON.stringify(record));
  lost.status = "lost";
  assert.equal(applyOrchardV2Result(begun.progress, { record: lost }), begun.progress);
  const wrongModule = JSON.parse(JSON.stringify(record));
  wrongModule.initialRun.blueprint.moduleKey = "junior";
  assert.equal(applyOrchardV2Result(begun.progress, { record: wrongModule }), begun.progress);
});

test("an unlocked-tier win cannot be claimed out of order", () => {
  const p = profile();
  const blueprint = { ...makeFixtureBlueprint({ tier: 2, enemyWake: 5 }), familyId: "turning-ravine" };
  const state = createRun({ blueprint, cardIds: ["cornix", "kernel", "beeswax"], runId: "x" });
  assert.equal(tierUnlocked(p, "turning-ravine", 2), false);
  assert.equal(beginOrchardRun(p, { familyId: "turning-ravine", tier: 2, cardIds: SQUAD, generateBlueprint }).reason, "tier-locked");
  const record = { ...exportRunRecord(state), status: "won" };
  assert.equal(applyOrchardV2Result(p, { record }), p);
});

test("interrupted game: save after each confirmed action, resume by replay incl. hand, draft, holds and Undo", () => {
  let p = profile();
  const begun = start(p);
  p = begun.progress;
  let d = new Driver(begun.state);
  d.approach("bushel", d.state.puzzleDraft && d.state.blueprint.puzzle.controlHex, 1);
  d.cmd("edit-draft", null, { puzzleId: "fixture", edit: { type: "set-cell", row: 0, col: 1, value: 1 } });
  d.cmd("dash", "furrow", { destination: "3,4", path: null });
  assert.equal(shouldPersist({ type: "edit-draft" }), true);
  assert.equal(shouldPersist({ type: "dash" }), true);
  p = saveActiveRun(p, d.state);
  const resumed = loadActiveRun(p);
  assert.equal(resumed.ok, true, resumed.reason);
  assert.equal(stateHash(resumed.state), stateHash(d.state));
  assert.equal(resumed.state.undo.length, d.state.undo.length);
  const after = new Driver(resumed.state);
  assert.equal(after.hero("furrow").handReady.dash, false);
  assert.deepEqual(after.state.puzzleDraft.content.switches, [0, 1, 0, 0]);
  after.cmd("undo", null);
  assert.equal(after.hero("furrow").handReady.dash, true, "the undo stack survived the save");
  d.endRound();
  p = saveActiveRun(p, d.state);
  const phase = loadActiveRun(p);
  assert.equal(phase.ok, true);
  assert.equal(phase.state.round, 2);
  assert.equal(phase.state.undo.length, 0, "the enemy phase is an undo boundary and resumes complete, never half a phase");
  assert.equal(stateHash(phase.state), stateHash(d.state));
});

test("save data from a changed blueprint or rules version is reported, never silently loaded", () => {
  const begun = start(profile());
  const saved = begun.progress;
  const tampered = JSON.parse(JSON.stringify(saved));
  tampered.expeditions.v2.activeRun.record.initialRun.blueprint.tiles[0].terrain = "hedge";
  assert.equal(loadActiveRun(tampered).reason, "blueprint-changed");
  const oldRules = JSON.parse(JSON.stringify(saved));
  oldRules.expeditions.v2.activeRun.rulesVersion = 1;
  assert.equal(loadActiveRun(oldRules).reason, "save-version");
  assert.equal(loadActiveRun(profile()), null);
  assert.equal(loadActiveRun(clearActiveRun(saved)), null);
});

test("different profiles never share runs, awards or attempt counters", () => {
  const a = start(profile());
  const b = profile();
  assert.equal(loadActiveRun(b), null);
  assert.equal(orchardV2Bucket(b).attemptCounters[awardKey("four-locks", 1)], undefined);
  assert.notEqual(a.progress, b);
});

test("retry restores the same blueprint; New map advances the persisted attempt counter and seed", () => {
  const first = start(profile());
  const d = new Driver(first.state);
  for (let i = 0; i < 5; i += 1) d.endRound();
  assert.equal(d.state.status, "lost");
  let p = recordOrchardLoss(first.progress, d.state);
  p = recordOrchardLoss(p, d.state);
  assert.equal(orchardV2Bucket(p).lossCounts[awardKey("four-locks", 1)], 1, "loss counted once");
  const retry = beginOrchardRun(p, { familyId: "four-locks", tier: 1, cardIds: SQUAD, mode: "retry", generateBlueprint });
  assert.equal(retry.ok, true);
  assert.equal(JSON.stringify(retry.state.blueprint), JSON.stringify(first.state.blueprint));
  assert.notEqual(retry.runId, first.runId);
  const seed0 = requestedSeedFor(p, "four-locks", 1);
  const fresh = beginOrchardRun(p, { familyId: "four-locks", tier: 1, cardIds: SQUAD, mode: "new-map", generateBlueprint });
  const p2 = fresh.update(p);
  const seed1 = requestedSeedFor(p2, "four-locks", 1);
  assert.equal(seed1.attempt, seed0.attempt + 1);
  assert.notEqual(seed1.seed, seed0.seed);
  assert.deepEqual(orchardV2Bucket(p2).tierAwards, {}, "New map never clears awards");
});

test("recent parameter seeds are capped at eight and passed to the generator", () => {
  let p = profile();
  const seen = [];
  for (let i = 0; i < 10; i += 1) {
    const begun = beginOrchardRun(p, { familyId: "four-locks", tier: 1, cardIds: SQUAD, mode: "new-map", generateBlueprint: (req) => { seen.push(req.recentParameterSeeds.length); return { ...generateBlueprint(req), seed: i }; } });
    p = begun.update(p);
  }
  assert.equal(orchardV2Bucket(p).recentSeeds[awardKey("four-locks", 1)].length, 8);
  assert.equal(Math.max(...seen), 8);
});

test("family status lists locked, unlocked and awarded tiers", () => {
  const begun = start(profile());
  const d = playFixtureToWin(new Driver(begun.state));
  const p = applyOrchardV2Result(begun.progress, { record: exportRunRecord(d.state) });
  const status = familyStatus(p, "four-locks");
  assert.deepEqual(status.tiers.map((t) => [t.tier, t.unlocked, t.awarded]), [[1, true, true], [2, true, false], [3, false, false], [4, false, false], [5, false, false]]);
  assert.equal(status.unlockedTier, 2);
});

test("reducer is atomic and pure: input progress is never mutated", () => {
  const begun = start(profile());
  const d = playFixtureToWin(new Driver(begun.state));
  const before = JSON.stringify(begun.progress);
  applyOrchardV2Result(begun.progress, { record: exportRunRecord(d.state) });
  assert.equal(JSON.stringify(begun.progress), before);
  assert.equal(reduceCommand(d.state, { type: "wait", heroId: "bushel", expectedRevision: d.state.revision, payload: {} }).result.reasonCode, "run-over");
});
