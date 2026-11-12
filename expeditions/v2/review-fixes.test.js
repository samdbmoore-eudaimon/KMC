import test from "node:test";
import assert from "node:assert/strict";
import { makeFixtureBlueprint, registerFixtureHooks } from "./fixture.js";
import { Driver, playFixtureToWin } from "./test-helpers.js";
import { createRun, exportRunRecord } from "./run.js";
import { cloneState, grantStrength } from "./rules.js";
import { freshProgress, flattenProgress } from "../../wm-progress.js";
import { applyOrchardV2Result, awardKey, beginOrchardRun, loadActiveRun, orchardV2Bucket, saveActiveRun, shouldPersist, previewOrchardV2Award } from "./persistence.js";
import { createOrchardController } from "./controller.js";

registerFixtureHooks();
const SQUAD = ["bushel", "furrow", "pip"];
const gen = ({ familyId, tier, seed }) => ({ ...makeFixtureBlueprint({ tier, enemyWake: 4 }), familyId, seed });
const progressWith = (cards) => ({ ...flattenProgress(freshProgress(), "primary"), cards });
const begin = (p, extra = {}) => beginOrchardRun(p, { familyId: "four-locks", tier: 1, cardIds: SQUAD, generateBlueprint: gen, ...extra });
const winRecord = (begun) => exportRunRecord(playFixtureToWin(new Driver(begun.state)).state);

test("R-01 Mend works on full-health targets for its shield, orchard excepted; Repair still refuses", () => {
  const d = new Driver(createRun({ blueprint: makeFixtureBlueprint({ enemyWake: 5 }), cardIds: ["pip", "bushel", "furrow"], runId: "m" }));
  const s = cloneState(d.state);
  s.heroes.find((h) => h.id === "pip").position = "7,2";
  s.heroes.find((h) => h.id === "bushel").position = "8,2";
  const m = new Driver(s);
  assert.equal(m.preview("repair", "pip", { targetId: "pip" }).reasonCode, "nothing-to-repair");
  const preview = m.preview("mend-and-mend-again", "pip", { targetId: "bushel" });
  assert.equal(preview.legal, true);
  assert.equal(preview.factors.find((f) => f.key === "shield").value, 3);
  assert.equal(preview.factors.find((f) => f.key === "restore").value, 0);
  const res = m.cmd("mend-and-mend-again", "pip", { targetId: "bushel" });
  assert.equal(res.cost.ap, 1);
  assert.equal(m.hero("pip").handReady["mend-and-mend-again"], false);
  assert.equal(grantStrength(m.state, "shield", "bushel"), 3);
  assert.equal(m.hero("bushel").hp, 13, "no hp change at full health");
  assert.equal(m.preview("mend-and-mend-again", "pip", { targetId: "orchard" }).reasonCode, "card-exhausted");
  const self = new Driver(cloneState(d.state));
  assert.equal(self.preview("mend-and-mend-again", "pip", { targetId: "pip" }).legal, true);
  self.state.heroes.find((h) => h.id === "pip").position = "9,5";
  assert.equal(self.preview("mend-and-mend-again", "pip", { targetId: "orchard" }).reasonCode, "nothing-to-repair");
});

test("R-02 begin rejects unowned, zero, missing and invalid squads", () => {
  for (const cards of [{}, { bushel: 1, furrow: 1 }, { bushel: 1, furrow: 0, pip: 1 }, { bushel: 1, furrow: -1, pip: 1 }, { bushel: 1, furrow: "1", pip: 1 }]) {
    const res = begin(progressWith(cards));
    assert.equal(res.ok, false);
    assert.equal(res.reason, "unowned-card");
  }
  assert.equal(begin(progressWith({ bushel: 1, furrow: 1, pip: 1 }), { cardIds: ["bushel", "bushel", "pip"] }).reason, "invalid-squad");
  assert.equal(begin(progressWith({ bushel: 1, furrow: 1, pip: 1 }), { cardIds: ["bushel", "furrow"] }).reason, "invalid-squad");
  assert.equal(begin(progressWith({ bushel: 1, furrow: 1, pip: 3 })).ok, true);
});

test("R-03 rewards need the final hash and this profile's own saved run, owned cards and printed profiles", () => {
  const mine = progressWith({ bushel: 1, furrow: 1, pip: 1 });
  const begun = begin(mine);
  const saved = begun.update(mine);
  const record = winRecord(begun);
  assert.equal(applyOrchardV2Result(saved, { record }).stars, 3);
  const noHash = { ...JSON.parse(JSON.stringify(record)), finalStateHash: undefined };
  assert.strictEqual(applyOrchardV2Result(saved, { record: noHash }), saved);
  const foreign = progressWith({ bushel: 1, furrow: 1, pip: 1 });
  assert.strictEqual(applyOrchardV2Result(foreign, { record }), foreign, "no saved run: another profile's winner is refused");
  const other = begin(foreign, { mode: "new-map" });
  const otherSaved = other.update(foreign);
  assert.strictEqual(applyOrchardV2Result(otherSaved, { record }), otherSaved, "a different saved run id");
  const unowned = { ...saved, cards: { bushel: 1, furrow: 1 } };
  assert.strictEqual(applyOrchardV2Result(unowned, { record }), unowned);
  const altered = JSON.parse(JSON.stringify(record));
  altered.initialRun.profiles.pip.stats[3] = 9;
  assert.strictEqual(applyOrchardV2Result(saved, { record: altered }), saved);
  const shortLog = saveActiveRun(saved, playFixtureToWin(new Driver(begun.state)).state);
  const rewritten = JSON.parse(JSON.stringify(record));
  rewritten.commands = rewritten.commands.slice(1);
  assert.strictEqual(applyOrchardV2Result(shortLog, { record: rewritten }), shortLog, "log is not an extension of the saved one");
  assert.equal(previewOrchardV2Award(foreign, record).ok, false);
});

test("R-03 the legitimate save-then-claim, resumed win and duplicate paths still award exactly once", () => {
  let progress = progressWith({ bushel: 1, furrow: 1, pip: 1 });
  const controller = createOrchardController({ getProgress: () => progress, setProgress: (u) => { progress = typeof u === "function" ? u(progress) : u; }, generateBlueprint: gen });
  const begun = controller.begin({ familyId: "four-locks", tier: 1, cardIds: SQUAD });
  let state = begun.state;
  const history = playFixtureToWin(new Driver(begun.state)).history;
  history.slice(0, -1).forEach((c) => { state = controller.dispatch(state, { ...c, expectedRevision: state.revision }).state; });
  const resumed = createOrchardController({ getProgress: () => progress, setProgress: (u) => { progress = typeof u === "function" ? u(progress) : u; }, generateBlueprint: gen }).resume();
  assert.equal(resumed.ok, true);
  const last = history[history.length - 1];
  const out = controller.dispatch(resumed.state, { ...last, expectedRevision: resumed.state.revision });
  assert.equal(out.state.status, "won");
  assert.equal(progress.stars, 3);
  controller.claimWin(out.state);
  assert.equal(progress.stars, 3);
});

test("R-04 recent maps store the selected parameter seed, not the requested seed", () => {
  let p = progressWith({ bushel: 1, furrow: 1, pip: 1 });
  const requested = [];
  for (const seed of [3226998889, 11, 12]) {
    const begun = begin(p, { mode: "new-map", generateBlueprint: (req) => { requested.push(req.recentParameterSeeds.length); return { ...gen(req), seed: req.seed, parameterSeed: 999 }; } });
    p = begun.update(p);
    assert.ok(seed);
  }
  assert.deepEqual(orchardV2Bucket(p).recentSeeds[awardKey("four-locks", 1)], [999]);
  assert.deepEqual(requested, [0, 1, 1]);
});

test("R-05 every accepted command is saved; edits and hints survive close and reload", () => {
  assert.equal(shouldPersist({ type: "edit-draft" }), true);
  assert.equal(shouldPersist({ type: "request-hint" }), true);
  let progress = progressWith({ bushel: 1, furrow: 1, pip: 1 });
  const controller = createOrchardController({ getProgress: () => progress, setProgress: (u) => { progress = typeof u === "function" ? u(progress) : u; }, generateBlueprint: gen });
  let { state } = controller.begin({ familyId: "four-locks", tier: 1, cardIds: SQUAD });
  state = controller.dispatch(state, { type: "edit-draft", heroId: null, expectedRevision: state.revision, payload: { puzzleId: "fixture", edit: { type: "set-cell", row: 0, col: 2, value: 1 } } }).state;
  state = controller.dispatch(state, { type: "request-hint", heroId: null, expectedRevision: state.revision, payload: { puzzleId: "fixture", stage: 2 } }).state;
  const reopened = loadActiveRun(JSON.parse(JSON.stringify(progress)));
  assert.equal(reopened.ok, true);
  assert.deepEqual(reopened.state.puzzleDraft.content.switches, [0, 0, 1, 0]);
  assert.equal(reopened.state.hintStage, 2);
  assert.equal(reopened.state.actionCount, 2);
});

test("hint hooks receive the comparison context (engine 1.3)", async () => {
  const { registerPuzzleHooks, getPuzzleHooks } = await import("./puzzle-hooks.js");
  const { FIXTURE_KIND } = await import("./fixture.js");
  const seen = [];
  registerPuzzleHooks("fixture-hint-ctx", { ...getPuzzleHooks(FIXTURE_KIND), hint: (puzzle, draft, stage, ctx) => { seen.push(ctx); return { text: "ok" }; }, compare: () => "equal" });
  const bp = makeFixtureBlueprint({ enemyWake: 5 });
  bp.puzzle.kind = "fixture-hint-ctx";
  bp.puzzle.comparisonAllowance = 1;
  const d = new Driver(createRun({ blueprint: bp, cardIds: SQUAD, runId: "h" }));
  d.cmd("compare-loads", null, { leftLoadIds: ["a"], rightLoadIds: ["b"] });
  d.cmd("request-hint", null, { puzzleId: "fixture", stage: 1 });
  assert.equal(seen[0].comparisonsUsed, 1);
  assert.equal(seen[0].comparisonLog[0].result, "equal");
});
