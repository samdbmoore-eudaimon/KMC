import test from "node:test";
import assert from "node:assert/strict";
import { createFixtureRun, makeFixtureBlueprint, registerFixtureHooks, FIXTURE_KIND } from "./fixture.js";
import { Driver } from "./test-helpers.js";
import { createRun, exportRunRecord, replayRun, stateHash, hashValue } from "./run.js";
import { forecastEnemyPhase, evaluateVictory } from "./enemy.js";
import { previewCommand, reduceCommand, listCommands } from "./actions.js";
import { validateBlueprint } from "./schema.js";
import { hexDistance, hexLine, rangeKeys, offsetKey, neighbourKeys } from "./hex.js";
import { getPuzzleHooks, registerPuzzleHooks } from "./puzzle-hooks.js";
import { cloneState, getHero, getEnemy, profileOf, recomputeOutputs, strikeCalculation, emit } from "./rules.js";
import { getOrchardV2Profile, orchardRosterProfiles } from "./profile.js";
import { commissionProfile } from "./constants.js";

registerFixtureHooks();
const key = (c, r) => offsetKey(c, r);

function winningDriver(options = {}) {
  const d = new Driver(createFixtureRun(options));
  const stations = { bushel: key(8, 4), furrow: key(9, 1), pip: key(8, 7) };
  const stationId = { bushel: "number", furrow: "shape", pip: "sustain" };
  for (let round = 1; round <= 5 && d.state.status === "playing"; round += 1) {
    if (round === 1) {
      d.approach("bushel", key(4, 4), 1);
      d.cmd("edit-draft", null, { puzzleId: "fixture", edit: { type: "set-cell", row: 0, col: 0, value: 1 } });
      d.cmd("edit-draft", null, { puzzleId: "fixture", edit: { type: "set-cell", row: 0, col: 2, value: 1 } });
      d.cmd("edit-draft", null, { puzzleId: "fixture", edit: { type: "set-cell", row: 0, col: 3, value: 1 } });
      d.cmd("operate", "bushel", { draftRevision: d.state.puzzleDraft.revision, outputIds: ["bridge", "shelter"] });
    }
    for (const id of ["bushel", "furrow", "pip"]) {
      if (round === 1 && id === "bushel") continue;
      const st = d.state.blueprint.stations.find((s) => s.id === stationId[id]);
      if (hexDistance(d.hero(id).position, st.hex) > 1) d.approach(id, st.hex, 1);
      while (d.hero(id).ap > 0 && hexDistance(d.hero(id).position, st.hex) <= 1) {
        const charged = d.state.stationStates[stationId[id]].charge >= d.state.blueprint.stations.find((s) => s.id === stationId[id]).capacity;
        if (!charged) d.cmd("calibrate", id, { targetId: stationId[id] });
        else break;
      }
    }
    const allCharged = ["number", "shape", "sustain"].every((n) => d.state.stationStates[n].charge >= 4);
    if (allCharged) {
      for (const id of ["bushel", "furrow", "pip"]) if (d.hero(id).ap > 0) d.cmd("hold", id, { targetId: stationId[id] });
    }
    d.endRound();
  }
  return d;
}

test("hex helpers: distance, ring size and symmetric sight lines", () => {
  assert.equal(hexDistance("0,0", "3,-3"), 3);
  assert.equal(rangeKeys("0,0", 2).length, 19);
  assert.equal(neighbourKeys("0,0").length, 6);
  const line = hexLine("0,0", "4,-2");
  assert.equal(line.length, 5);
  assert.equal(line[0], "0,0");
  assert.equal(line[4], "4,-2");
  for (const [a, b] of [["0,0", "3,2"], ["-2,4", "5,-1"], ["1,1", "1,5"]]) {
    assert.deepEqual(new Set(hexLine(a, b)).size, hexDistance(a, b) + 1);
    for (let i = 0; i < hexLine(a, b).length - 1; i += 1) assert.equal(hexDistance(hexLine(a, b)[i], hexLine(a, b)[i + 1]), 1);
  }
});

test("printed profile formulas use only printed card stats", () => {
  const kernel = getOrchardV2Profile("kernel");
  assert.deepEqual(kernel.stats, [6, 7, 3, 3, 2]);
  assert.equal(kernel.maxHealth, 13);
  assert.equal(kernel.moveBudget, 4);
  assert.equal(kernel.armour, 1);
  assert.equal(kernel.initiative, 10);
  assert.equal(kernel.strikeStat, 7);
  assert.equal(kernel.role, "wizard");
  assert.equal(kernel.strikeRange, 2);
  assert.deepEqual(kernel.hand.map((c) => c.key), ["true-shift", "wide-brace", "crosswire", "second-wind"]);
  const scout = getOrchardV2Profile("cobweb");
  assert.equal(scout.role, "ranged");
  assert.equal(scout.strikeRange, 3);
  assert.equal(getOrchardV2Profile("bushel").dashBudget, 4 + 2);
  assert.equal(Object.keys(orchardRosterProfiles()).length, 30);
});

test("fixture blueprint validates and created run has the specified shape", () => {
  const bp = makeFixtureBlueprint();
  assert.equal(validateBlueprint(bp).ok, true);
  const bad = { ...bp, stations: bp.stations.filter((s) => s.id !== "alcove") };
  const res = validateBlueprint(bad);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => e.code === "station-missing"));
  const s = createFixtureRun();
  assert.equal(s.round, 1);
  assert.equal(s.heroes.every((h) => h.ap === 2 && Object.values(h.handReady).every(Boolean) && Object.keys(h.handReady).length === 4), true);
  assert.equal(s.orchardIntegrity, 20);
  assert.equal(s.initialRun.initialStateHash, stateHash(s));
});

test("invalid and stale commands cost nothing and never mutate", () => {
  const s = createFixtureRun();
  const before = JSON.stringify({ ...s, blueprint: null, initialRun: null, profiles: null });
  const stale = reduceCommand(s, { type: "wait", heroId: "bushel", expectedRevision: 7, payload: {} });
  assert.equal(stale.result.legal, false);
  assert.equal(stale.result.reasonCode, "stale-revision");
  assert.equal(stale.state, s);
  const far = reduceCommand(s, { type: "calibrate", heroId: "bushel", expectedRevision: 0, payload: { targetId: "number" } });
  assert.equal(far.result.reasonCode, "out-of-range");
  const unknown = reduceCommand(s, { type: "teleport", heroId: "bushel", expectedRevision: 0, payload: {} });
  assert.equal(unknown.result.reasonCode, "unknown-command");
  assert.equal(JSON.stringify({ ...s, blueprint: null, initialRun: null, profiles: null }), before);
  assert.equal(s.revision, 0);
  assert.equal(s.log.length, 0);
});

test("AP, hand exhaustion, Refocus (2 AP once, not Second Wind) and Second Wind", () => {
  const d = new Driver(createFixtureRun());
  d.cmd("wait", "bushel");
  assert.equal(d.hero("bushel").ap, 1);
  assert.equal(d.preview("refocus", "bushel", { readyCardId: "exact-blow" }).reasonCode, "not-enough-ap");
  d.cmd("wait", "bushel");
  assert.equal(d.hero("bushel").ap, 0);
  assert.equal(d.preview("wait", "bushel").reasonCode, "not-enough-ap");
  d.endRound();
  assert.equal(d.hero("bushel").ap, 2);
  assert.equal(d.state.round, 2);
  d.cmd("dash", "furrow", { destination: "3,4", path: null });
  assert.equal(d.hero("furrow").handReady.dash, false);
  assert.equal(d.preview("dash", "furrow", { destination: "2,4", path: null }).reasonCode, "card-exhausted");
  d.cmd("second-wind", "furrow", { readyCardId: "dash", stepDestination: null });
  assert.equal(d.hero("furrow").handReady.dash, true);
  assert.equal(d.hero("furrow").handReady["second-wind"], false);
  assert.equal(d.hero("furrow").ap, 0);
  d.endRound();
  assert.equal(d.preview("refocus", "furrow", { readyCardId: "second-wind" }).reasonCode, "card-not-exhausted");
  d.cmd("wait", "furrow");
  assert.equal(d.preview("refocus", "furrow", { readyCardId: "second-wind" }).reasonCode, "not-enough-ap");
  d.endRound();
  d.cmd("dash", "furrow", { destination: "2,4", path: null });
  d.endRound();
  d.cmd("refocus", "furrow", { readyCardId: "dash" });
  assert.equal(d.hero("furrow").ap, 0);
  assert.equal(d.hero("furrow").handReady.dash, true);
  assert.equal(d.hero("furrow").refocusUsed, true);
  d.endRound();
  assert.equal(d.preview("refocus", "furrow", { readyCardId: "intercept" }).legal, false);
});

test("a full legal winning trace replays to the same hash and reports Rooke-free engine status", () => {
  const d = winningDriver();
  assert.equal(d.state.status, "won", JSON.stringify(d.state.lossReason));
  const record = exportRunRecord(d.state);
  const replay = replayRun(JSON.parse(JSON.stringify(record)), { recordHashes: true });
  assert.equal(replay.ok, true, replay.reason);
  assert.equal(replay.finalHash, record.finalStateHash);
  assert.equal(replay.hashes.length, record.commands.length);
  // tampered trace is refused
  const tampered = JSON.parse(JSON.stringify(record));
  tampered.commands.splice(5, 1);
  assert.equal(replayRun(tampered).ok, false);
});

