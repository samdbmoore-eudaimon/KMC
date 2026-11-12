import test from "node:test";
import assert from "node:assert/strict";
import { makeFixtureBlueprint, registerFixtureHooks } from "./fixture.js";
import { Driver, playFixtureToWin } from "./test-helpers.js";
import { createOrchardController } from "./controller.js";
import { freshProgress, flattenProgress } from "../../wm-progress.js";
import { awardKey, orchardV2Bucket } from "./persistence.js";
import { exportRunRecord, stateHash } from "./run.js";

registerFixtureHooks();
const generateBlueprint = ({ familyId, tier, seed }) => ({ ...makeFixtureBlueprint({ tier, enemyWake: 4 }), familyId, seed });

const OWNED = { bushel: 1, furrow: 1, pip: 1 };
function store(initial = { ...flattenProgress(freshProgress(), "primary"), cards: { ...OWNED } }) {
  let progress = initial;
  return {
    get: () => progress,
    set: (updater) => { progress = typeof updater === "function" ? updater(progress) : updater; },
  };
}

test("controller: begin, play every command through dispatch, win is saved, claimed once and awarded 3 stars", () => {
  const s = store();
  const controller = createOrchardController({ getProgress: s.get, setProgress: s.set, generateBlueprint });
  const begun = controller.begin({ familyId: "four-locks", tier: 1, cardIds: ["bushel", "furrow", "pip"] });
  assert.equal(begun.ok, true);
  assert.ok(orchardV2Bucket(s.get()).activeRun, "the new run is saved before the first move");
  const reference = playFixtureToWin(new Driver(begun.state));
  let state = begun.state;
  let award = null;
  for (const command of reference.history) {
    const out = controller.dispatch(state, { ...command, expectedRevision: state.revision });
    assert.equal(out.result.legal, true, `${command.type} ${out.result.reasonCode}`);
    state = out.state;
    if (out.award) award = out.award;
  }
  assert.equal(state.status, "won");
  assert.deepEqual({ stars: award.stars, already: award.alreadyAwarded }, { stars: 3, already: false });
  assert.equal(s.get().stars, 3);
  assert.equal(orchardV2Bucket(s.get()).activeRun, null);
  assert.equal(controller.status("four-locks").unlockedTier, 2);
  assert.equal(controller.claimWin(state), null, "a second claim is a no-op");
  assert.equal(s.get().stars, 3);
  assert.ok(orchardV2Bucket(s.get()).tierAwards[awardKey("four-locks", 1)]);
});

test("controller: rejected commands change nothing and do not save", () => {
  const s = store();
  const controller = createOrchardController({ getProgress: s.get, setProgress: s.set, generateBlueprint });
  const { state } = controller.begin({ familyId: "four-locks", tier: 1, cardIds: ["bushel", "furrow", "pip"] });
  const before = JSON.stringify(s.get());
  const out = controller.dispatch(state, { type: "calibrate", heroId: "bushel", expectedRevision: state.revision, payload: { targetId: "number" } });
  assert.equal(out.result.legal, false);
  assert.strictEqual(out.state, state);
  assert.equal(JSON.stringify(s.get()), before);
});

test("controller: a closed game resumes mid-round exactly where it stopped", () => {
  const s = store();
  const controller = createOrchardController({ getProgress: s.get, setProgress: s.set, generateBlueprint });
  const { state } = controller.begin({ familyId: "four-locks", tier: 1, cardIds: ["bushel", "furrow", "pip"] });
  const d = new Driver(state);
  let live = state;
  const play = (type, heroId, payload) => {
    const out = controller.dispatch(live, { type, heroId, expectedRevision: live.revision, payload });
    assert.equal(out.result.legal, true, out.result.reasonCode);
    live = out.state;
  };
  play("dash", "furrow", { destination: "3,4", path: null });
  play("wait", "bushel", {});
  const second = createOrchardController({ getProgress: s.get, setProgress: s.set, generateBlueprint });
  const resumed = second.resume();
  assert.equal(resumed.ok, true);
  assert.equal(stateHash(resumed.state), stateHash(live));
  assert.equal(d.state.revision, 0);
  second.discard();
  assert.equal(second.resume(), null);
});

test("controller: losing is recorded once and never rewards", () => {
  const s = store();
  const controller = createOrchardController({ getProgress: s.get, setProgress: s.set, generateBlueprint });
  let { state } = controller.begin({ familyId: "four-locks", tier: 1, cardIds: ["bushel", "furrow", "pip"] });
  for (let i = 0; i < 5; i += 1) state = controller.dispatch(state, { type: "end-round", heroId: null, expectedRevision: state.revision, payload: { forecastRevision: state.revision } }).state;
  assert.equal(state.status, "lost");
  assert.equal(orchardV2Bucket(s.get()).lossCounts[awardKey("four-locks", 1)], 1);
  assert.equal(s.get().stars, 0);
  const retry = controller.begin({ familyId: "four-locks", tier: 1, cardIds: ["bushel", "furrow", "pip"], mode: "retry" });
  assert.equal(retry.ok, true);
  assert.equal(JSON.stringify(retry.state.blueprint), JSON.stringify(state.blueprint));
  assert.equal(exportRunRecord(retry.state).commands.length, 0);
});
