import test from "node:test";
import assert from "node:assert/strict";
import { makeFixtureBlueprint, registerFixtureHooks, FIXTURE_KIND } from "./fixture.js";
import { Driver } from "./test-helpers.js";
import { createRun } from "./run.js";
import { forecastEnemyPhase } from "./enemy.js";
import { reduceCommand } from "./actions.js";
import { offsetKey } from "./hex.js";
import { getPuzzleHooks, registerPuzzleHooks } from "./puzzle-hooks.js";
import { cloneState, recomputeOutputs, grantStrength } from "./rules.js";

registerFixtureHooks();
const K = offsetKey;
const SQUAD = ["bushel", "furrow", "pip"];
const hookFor = (reserve) => ({ ...getPuzzleHooks(FIXTURE_KIND), reserveTotal: () => reserve });
registerPuzzleHooks("fixture-reserve-8", hookFor(8));
registerPuzzleHooks("fixture-reserve-2", hookFor(2));

function powered(options, shelterEffect, { kind = FIXTURE_KIND, squad = SQUAD, mutate = null } = {}) {
  const bp = makeFixtureBlueprint(options);
  bp.puzzle.kind = kind;
  if (shelterEffect) bp.outputs[1] = { id: "shelter", label: "Effect", trigger: "phase-start", effect: shelterEffect };
  if (mutate) mutate(bp);
  const s = createRun({ blueprint: bp, cardIds: squad, runId: "p" });
  s.puzzleActive = { content: { switches: [1, 0, 1, 1] }, selectedOutputIds: ["bridge", "shelter"] };
  recomputeOutputs(s);
  return s;
}
const put = (s, positions) => {
  const c = cloneState(s);
  for (const [id, pos] of Object.entries(positions)) {
    const hero = c.heroes.find((h) => h.id === id);
    if (hero) hero.position = pos;
    const enemy = c.enemyStates.find((e) => e.id === id);
    if (enemy) enemy.position = pos;
  }
  return c;
};
const BREAKER = (position) => ({ id: "strawling-1", ruleId: "breaker", artId: "strawling", wakePhase: 1, position });
const endRound = (state) => reduceCommand(state, { type: "end-round", heroId: null, expectedRevision: state.revision, payload: { forecastRevision: state.revision } });

test("storm: -2 orchard and 4 flat damage within 2 of Number at phase start; Commit refused when it would kill", () => {
  const s = powered({ enemyWake: 1 }, { kind: "storm" });
  const numberHex = s.blueprint.stations.find((x) => x.id === "number").hex;
  const [q, r] = numberHex.split(",").map(Number);
  const near = put(s, { "hookmole-1": `${q + 2},${r}` });
  const { state, result } = endRound(near);
  assert.equal(result.legal, true);
  const hook = state.enemyStates[0];
  assert.equal(hook.hp, 10 - 4 - 0, "flat 4, armour ignored, no other damage");
  assert.ok(state.events.some((e) => e.type === "orchard-damaged" && e.amount === 2));
  const far = endRound(put(s, { "hookmole-1": K(10, 2) })).state.enemyStates[0];
  assert.equal(far.hp, 10);
  // refusal: orchard at 2 cannot take a storm commit
  const d = new Driver(put(powered({ enemyWake: 5 }, { kind: "storm" }), { bushel: "1,4" }));
  d.state.puzzleActive.selectedOutputIds = [];
  recomputeOutputs(d.state);
  d.state.orchardIntegrity = 2;
  d.cmd("edit-draft", null, { puzzleId: "fixture", edit: { type: "set-cell", row: 0, col: 0, value: 1 } });
  d.state.puzzleDraft.content.switches = [1, 0, 1, 1];
  const refused = d.preview("operate", "bushel", { draftRevision: d.state.puzzleDraft.revision, outputIds: ["bridge", "shelter"] });
  assert.equal(refused.reasonCode, "storm-would-destroy-orchard");
});

test("storm that empties the orchard loses before enemies act", () => {
  const s = powered({ enemyWake: 1 }, { kind: "storm" });
  s.orchardIntegrity = 2;
  const { state } = endRound(s);
  assert.equal(state.status, "lost");
  assert.equal(state.lossReason.code, "orchard-destroyed");
});

test("roots: the Breaker cannot move but still strikes from range 1; without roots it walks and strikes", () => {
  const bp = { enemyWake: 5, extraEnemies: [BREAKER(K(9, 5))] };
  const base = (effect) => {
    const s = powered(bp, effect);
    s.stationStates.number.charge = 3;
    return s;
  };
  const numberHex = base({ kind: "none" }).blueprint.stations.find((x) => x.id === "number").hex;
  const [q, r] = numberHex.split(",").map(Number);
  const free = endRound(put(base({ kind: "none" }), { "strawling-1": `${q + 3},${r}` })).state;
  assert.ok(free.events.some((e) => e.type === "station-damaged" && e.stationId === "number"), "walked 2 then struck");
  const rooted = endRound(put(base({ kind: "roots" }), { "strawling-1": `${q + 3},${r}` })).state;
  assert.equal(rooted.events.some((e) => e.type === "station-damaged"), false, "rooted at distance 3: out of range");
  const rootedAdjacent = endRound(put(base({ kind: "roots" }), { "strawling-1": `${q + 1},${r}` })).state;
  assert.ok(rootedAdjacent.events.some((e) => e.type === "station-damaged" && e.stationId === "number"), "roots do not stop an in-range strike");
});

test("Breaker targets the largest charge fraction; ties go Shape, Sustain, Number", () => {
  const s = powered({ enemyWake: 5, extraEnemies: [BREAKER(K(9, 5))] }, { kind: "none" });
  const target = (state) => forecastEnemyPhase(state).intents.find((i) => i.enemyId === "strawling-1").targetId;
  assert.equal(target(s), "shape", "all empty: tie order puts Shape first");
  s.stationStates.number.charge = 1;
  assert.equal(target(s), "number");
  s.stationStates.sustain.charge = 1;
  s.stationStates.number.charge = 1;
  assert.equal(target(s), "sustain", "equal fractions: Sustain before Number");
  s.stationStates.shape.charge = 1;
  assert.equal(target(s), "shape");
});

test("shelter shields stations before the enemies act; shield is consumed point for point", () => {
  const s = powered({ enemyWake: 5, extraEnemies: [BREAKER(K(9, 5))] }, { kind: "shelter", amount: 2, targetIds: ["number", "shape", "sustain"] });
  s.stationStates.shape.charge = 4;
  const shapeHex = s.blueprint.stations.find((x) => x.id === "shape").hex;
  const [q, r] = shapeHex.split(",").map(Number);
  const { state } = endRound(put(s, { "strawling-1": `${q + 1},${r}` }));
  const hit = state.events.find((e) => e.type === "station-damaged" && e.stationId === "shape");
  assert.equal(hit.power, 5);
  assert.equal(hit.shieldAbsorbed, 2);
  assert.equal(hit.damage, 3);
  assert.equal(state.stationStates.shape.integrity, 9);
  assert.equal(state.phaseEffects.grants.length, 0, "everything expires at the end of the phase");
});

test("strike window lowers enemy armour by 2 (minimum 0) for strikes and forecasts, without storing it", () => {
  const s = powered({ tier: 4, enemyWake: 1 }, { kind: "strike-window" });
  const d = new Driver(put(s, { kernel: "7,2", "hookmole-1": "9,2" }));
  assert.equal(d.state.enemyStates[0].defeated, false);
  const kernelRun = createRun({ blueprint: s.blueprint, cardIds: ["kernel", "cornix", "pip"], runId: "w" });
  kernelRun.puzzleActive = { content: { switches: [1, 0, 1, 1] }, selectedOutputIds: ["bridge", "shelter"] };
  recomputeOutputs(kernelRun);
  const dk = new Driver(put(kernelRun, { kernel: "7,2", cornix: "5,2", "hookmole-1": "9,2" }));
  const damage = (driver) => driver.preview("strike", "kernel", { targetId: "hookmole-1" }).factors.find((f) => f.key === "damage").value;
  assert.equal(damage(dk), 7 - 1, "armour 3 -> 1 with the window");
  dk.state.puzzleActive.selectedOutputIds = ["bridge"];
  recomputeOutputs(dk.state);
  assert.equal(damage(dk), 7 - 3, "corrupted/deselected: base armour returns immediately");
});

test("repair stream restores the orchard after hazards, never resurrects, and caps at maximum", () => {
  const s = powered({ enemyWake: 5 }, { kind: "repair-stream" });
  s.orchardIntegrity = 10;
  const { state } = endRound(s);
  assert.equal(state.orchardIntegrity, 10 - 3 + 2, "hazard 2+tier=3 first, then +2");
  const dying = powered({ enemyWake: 5 }, { kind: "repair-stream" });
  dying.orchardIntegrity = 3;
  const lost = endRound(dying).state;
  assert.equal(lost.status, "lost");
  assert.equal(lost.orchardIntegrity, 0);
  const capped = powered({ enemyWake: 5 }, { kind: "repair-stream" }, { mutate: (bp) => { bp.hazards = []; } });
  capped.orchardIntegrity = 19;
  assert.equal(endRound(capped).state.orchardIntegrity, 20);
});

test("balance reserve benefit: snapshot at phase start, shield when reserve >= 5 else +2 after hazards", () => {
  const effect = { kind: "reserve-benefit", amount: 2, targetIds: ["number", "shape"] };
  const rich = powered({ enemyWake: 5 }, effect, { kind: "fixture-reserve-8" });
  rich.orchardIntegrity = 10;
  const a = endRound(rich).state;
  assert.ok(a.events.some((e) => e.type === "reserve-shield"));
  assert.equal(a.orchardIntegrity, 7, "no restoration when the shield option applies");
  const poor = powered({ enemyWake: 5 }, effect, { kind: "fixture-reserve-2" });
  poor.orchardIntegrity = 10;
  const b = endRound(poor).state;
  assert.equal(b.orchardIntegrity, 10 - 3 + 2);
});

test("environment hazard: Stabilise on the Sustain site or a Sustain Hold blocks orchard damage; Lock does not", () => {
  const sustainHex = (s) => s.blueprint.stations.find((x) => x.id === "sustain").hex;
  const base = powered({ enemyWake: 5 }, { kind: "none" });
  assert.equal(endRound(base).state.orchardIntegrity, 17);
  const [q, r] = sustainHex(base).split(",").map(Number);
  const stab = new Driver(put(base, { pip: `${q},${r + 1}` }));
  stab.cmd("stabilise", "pip", { targetId: "sustain" });
  assert.equal(grantStrength(stab.state, "stabilise", "sustain"), 6);
  stab.endRound();
  assert.equal(stab.state.orchardIntegrity, 20, "S6 >= power 4");
  const held = new Driver(put(base, { pip: sustainHex(base) }));
  held.cmd("hold", "pip", { targetId: "sustain" });
  held.endRound();
  assert.equal(held.state.orchardIntegrity, 20, "Sustain Hold stabilises the hazard");
  const wrong = new Driver(put(base, { pip: sustainHex(base) }));
  wrong.state.phaseEffects.grants.push({ id: "l", kind: "lock", targetId: "network", amount: 9, source: "cast", sourceHoldId: null });
  wrong.endRound();
  assert.equal(wrong.state.orchardIntegrity, 17, "a lock never blocks orchard damage");
});

test("tier five hazard has two sites and each can hit; ordinary Stabilise protects only its own site", () => {
  const s = powered({ tier: 5, enemyWake: 5 }, { kind: "none" }, {
    mutate: (bp) => {
      bp.sites = [{ id: "passage-site", anchor: K(6, 4) }];
      bp.hazards = [{ id: "storm-drain", sites: [{ id: "sustain-site", targetId: "sustain" }, { id: "passage", targetId: "passage-site" }], mutation: { kind: "none" } }];
    },
  });
  const both = endRound(s).state;
  assert.equal(both.orchardIntegrity, s.orchardIntegrity - 14, "(2+5) per site");
  const [q, r] = s.blueprint.stations.find((x) => x.id === "sustain").hex.split(",").map(Number);
  const one = new Driver(put(s, { pip: `${q},${r + 1}` }));
  one.cmd("stabilise", "pip", { targetId: "sustain" });
  assert.equal(one.state.phaseEffects.grants.length, 1);
  one.state.phaseEffects.grants[0].amount = 9;
  one.endRound();
  assert.equal(one.state.orchardIntegrity, s.orchardIntegrity - 7);
});

test("environment hazard mutation follows the same lock rule as an enemy change and is forecast", () => {
  const s = powered({ enemyWake: 5 }, { kind: "none" }, { mutate: (bp) => { bp.hazards = [{ id: "rot", sites: [], mutation: { kind: "puzzle" } }]; } });
  const forecast = forecastEnemyPhase(s);
  assert.equal(forecast.hazards[0].mutation.applied, true);
  const after = endRound(s).state;
  assert.deepEqual(after.puzzleActive.content.switches, [0, 0, 1, 1]);
  assert.equal(after.activeOutputs.bridge, false);
  const locked = cloneState(s);
  locked.phaseEffects.grants.push({ id: "l", kind: "lock", targetId: "network", amount: 4, source: "cast", sourceHoldId: null });
  assert.deepEqual(endRound(locked).state.puzzleActive.content.switches, [1, 0, 1, 1]);
});

test("a dormant enemy only announces its wake phase and still occupies its hex", () => {
  const s = powered({ enemyWake: 4 }, { kind: "none" });
  const intent = forecastEnemyPhase(s).intents[0];
  assert.equal(intent.verb, "dormant");
  assert.equal(intent.wakePhase, 4);
  const d = new Driver(s);
  assert.equal(d.preview("move", "bushel", { destination: s.enemyStates[0].position, path: null }).legal, false);
});

test("reset-draft discards uncommitted edits (the End Round Discard choice) and draftDiffersFromActive tracks it", async () => {
  const { draftDiffersFromActive } = await import("./rules.js");
  const d = new Driver(powered({ enemyWake: 5 }, { kind: "none" }));
  assert.equal(draftDiffersFromActive(d.state), false);
  d.cmd("edit-draft", null, { puzzleId: "fixture", edit: { type: "set-cell", row: 0, col: 1, value: 1 } });
  assert.equal(draftDiffersFromActive(d.state), true);
  d.cmd("edit-draft", null, { puzzleId: "fixture", edit: { type: "reset-draft" } });
  assert.equal(draftDiffersFromActive(d.state), false);
  assert.deepEqual(d.state.puzzleDraft.content.switches, [1, 0, 1, 1]);
});
