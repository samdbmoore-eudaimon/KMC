import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createCountingOrchard, COUNTING_ORCHARD_CONFIG } from "./counting-orchard.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  interactObject,
  moveUnit,
  resolveEnemyPhase,
  useDisciplineAction,
} from "./expedition-engine.js";
import { EXPEDITION_READINESS_BY_LEVEL, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function squadOf(ids) {
  const roster = expeditionRoster("primary");
  return ids.map((id) => roster.find((profile) => profile.id === id));
}

test("The Counting Orchard creates a playable state from three Ninefold Orchard commons", () => {
  const state = createCountingOrchard(squadOf(["pip", "bramble", "nine"]));
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 1);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

test("REF-11: the loan squad fills the harvest gate with the two direct baskets (4 + 8 = 12) within the round budget", () => {
  const squad = squadOf(["pip", "bramble", "nine"]);
  let state = createCountingOrchard(squad);
  state = interactObject(state, "pip", "basket_8");
  state = moveUnit(state, "pip", "0,-1");
  state = interactObject(state, "bramble", "basket_4");
  state = interactObject(state, "bramble", "basket_4");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = interactObject(state, "pip", "basket_8");
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(objective.progress, "12/12");
  assert.ok(state.turn <= COUNTING_ORCHARD_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 5);
});

test("high-tier squad (target/high band): an all-Epic squad completes the identical reference trace", () => {
  const squad = squadOf(["warden", "ninebark", "cascade"]);
  let state = createCountingOrchard(squad);
  state = interactObject(state, "warden", "basket_8");
  state = moveUnit(state, "warden", "0,-1");
  state = interactObject(state, "ninebark", "basket_4");
  state = interactObject(state, "ninebark", "basket_4");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = interactObject(state, "warden", "basket_8");
  assert.equal(state.status, "won", "the same physical trace works for a stronger squad — nothing about this map mechanically favours or excludes any card");
  assert.equal(evaluateObjective(state).progress, "12/12");
});

test("Combine path: an Arithmetic hero can merge 3 + 4 into a fresh valid 7, matching the route doc's own worked example", () => {
  const state0 = createCountingOrchard(squadOf(["bushel", "pip", "nine"]));
  assert.equal(state0.units.bushel.discipline, "arithmetic");
  let state = state0;
  state = moveUnit(state, "bushel", "-2,0");
  state = interactObject(state, "bushel", "basket_3");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "bushel", "0,0");
  state = moveUnit(state, "bushel", "-1,2");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = interactObject(state, "bushel", "basket_3");
  state = useDisciplineAction(state, "bushel", "combine", { firstId: "basket_4", secondId: "basket_3" });
  assert.equal(state.objects.basket_4.value, 7, "3 + 4 = 7, a fresh partner for the untouched basket_5 (5 + 7 = 12)");
  assert.equal(state.objects.basket_3.removed, true);
});

test("guarding a basket protects it from the Scruffcrow's peck, which falls to the next-highest basket on that lane instead", () => {
  let state = createCountingOrchard(squadOf(["pip", "bramble", "nine"]));
  assert.equal(state.units.pip.pos, state.objects.basket_8.pos, "pip starts on basket_8, lane 1's highest value");
  state = guardTarget(state, "pip", "basket_8");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects.basket_8.value, 8, "guarded, so untouched");
  assert.equal(state.objects.basket_3.value, 2, "the peck falls to lane 1's next-highest unguarded basket instead");
});

test("ENM: the Scruffcrow advances through the three lanes in a fixed, repeating order and pecks each lane's highest unguarded basket by exactly one", () => {
  let state = createCountingOrchard(squadOf(["pip", "bramble", "nine"]));
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 1: lane 1
  assert.equal(state.objects.basket_8.value, 7, "lane 1's highest (8) is pecked to 7");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 2: lane 2
  assert.equal(state.objects.basket_7.value, 6, "lane 2's highest (7) is pecked to 6");
  assert.equal(state.objects.basket_8.value, 7, "lane 1 is untouched this round");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 3: lane 3
  assert.equal(state.objects.basket_5.value, 4, "lane 3's highest (5) is pecked to 4");
});

test("procedural envelope: the same six baskets support a target of 10, 11 or 12, each with at least two direct pairs, per the route doc's stated envelope", () => {
  const values = COUNTING_ORCHARD_CONFIG.objects.map((object) => object.value);
  function directPairCount(target) {
    let count = 0;
    for (let i = 0; i < values.length; i += 1) for (let j = i + 1; j < values.length; j += 1) if (values[i] + values[j] === target) count += 1;
    return count;
  }
  assert.equal(directPairCount(10), 2, "2 + 8 and 3 + 7");
  assert.equal(directPairCount(11), 2, "3 + 8 and 4 + 7");
  assert.equal(directPairCount(12), 2, "4 + 8 and 5 + 7 — the shipped target");
});

test("procedural envelope: a target-10 variant of this scenario is genuinely playable end-to-end (2 + 8 = 10)", () => {
  const squad = squadOf(["pip", "bramble", "nine"]);
  const variantConfig = { ...COUNTING_ORCHARD_CONFIG, objective: { ...COUNTING_ORCHARD_CONFIG.objective, target: 10 } };
  let state = createExpeditionState({ ...variantConfig, units: squad.map((profile, index) => ({ ...profile, pos: ["-2,-1", "2,1", "1,-2"][index] })) });
  state = interactObject(state, "pip", "basket_8");
  state = moveUnit(state, "pip", "0,-1");
  state = interactObject(state, "bramble", "basket_2");
  state = moveUnit(state, "bramble", "0,1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = interactObject(state, "bramble", "basket_2");
  state = interactObject(state, "pip", "basket_8");
  assert.equal(state.status, "won");
  assert.equal(evaluateObjective(state).progress, "10/10");
});

test("no-unannounced-impossible-state: after one full round of complete inaction, a valid 12-pair still exists among the six baskets", () => {
  // The Scruffcrow's target is always a deterministic function of the visible lane order and
  // basket values, never hidden information or a coin flip, so any state it produces was
  // fully predictable in advance. This checks the realistic worst case (a player who takes no
  // action at all for one round) rather than the degenerate case of standing still for the
  // entire turn limit, which the route doc's own "no single map should feel unforgiving in one
  // teaching round" framing does not promise to protect against.
  let state = createCountingOrchard(squadOf(["pip", "bramble", "nine"]));
  state = resolveEnemyPhase(endPlayerPhase(state));
  const values = Object.values(state.objects).map((object) => object.value);
  let found = false;
  for (let i = 0; i < values.length && !found; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      if (values[i] + values[j] === 12) { found = true; break; }
    }
  }
  assert.ok(found, `expected some pair of basket values to sum to 12; got ${JSON.stringify(values)}`);
});

// EXPEDITIONS_CARD_AUDIT.md's Finding 1 was recorded against this map while it held the
// level-2 catalogue slot; it now belongs to The Cider Run, which replaced it there (2026-09-17,
// see cider-run.js's header). This scenario is no longer in EXPEDITION_SCENARIOS at all, so its
// own readiness band is read directly off EXPEDITION_READINESS_BY_LEVEL[2] — the same level-2
// band, unchanged — rather than through a now-nonexistent catalogue lookup.
test("§2/low band: even the weakest possible squad (three of the lowest-BV Commons) meets level 2's readiness recommendation", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = { level: 2, readiness: EXPEDITION_READINESS_BY_LEVEL[2] };
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, true);
  assert.deepEqual(result.shortfalls, []);
});

// Rewritten 2026-09-21 alongside cider-run.test.js's identical fix: peck-lane now shares
// strikeAdjacentHero with flood-lane (expedition-engine.js), so an unguarded hero in reach is
// struck instead of the basket being pecked that round. Not catalogued/playable any more (see
// this file's header), but still real, tested code — the contract it asserts should match.
test("ENM: an unguarded hero in Scruffcrow's reach is struck instead of the basket being pecked; Guard blocks the strike", () => {
  const board = COUNTING_ORCHARD_CONFIG.board;
  const enemy = { id: "scruffcrow", name: "Scruffcrow", side: "enemy", hp: 2, defence: 4, move: 1, range: 1, damage: 1, pos: "3,-3", delay: 0, behaviour: "peck-lane", laneSequence: [1] };
  const basket = { id: "basket", kind: "basket", value: 5, pos: "3,-2", lane: 1 };
  const objective = { family: "exactSum", hexes: ["0,0"], target: 5 };

  const exposed = { id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "3,-3" };
  const exposedState = createExpeditionState({ id: "scruffcrow-test", moduleKey: "primary", title: "Scruffcrow test", turnLimit: 4, board, units: [exposed], enemies: [{ ...enemy }], objects: [{ ...basket }], objective });
  const exposedResolved = resolveEnemyPhase(endPlayerPhase(exposedState));
  assert.equal(exposedResolved.units.hero.hp, 2, "an unguarded hero standing in range is struck instead of the peck");
  assert.equal(exposedResolved.objects.basket.value, 5, "the strike replaces the peck this round");

  const guardedState = createExpeditionState({ id: "scruffcrow-test-guarded", moduleKey: "primary", title: "Scruffcrow test", turnLimit: 4, board, units: [{ ...exposed, guarded: true }], enemies: [{ ...enemy }], objects: [{ ...basket }], objective });
  const guardedResolved = resolveEnemyPhase(endPlayerPhase(guardedState));
  assert.equal(guardedResolved.units.hero.hp, 3, "Guard blocks the strike entirely");
  assert.equal(guardedResolved.objects.basket.value, 5, "a blocked strike still isn't a peck");

  const clearState = createExpeditionState({ id: "scruffcrow-test-clear", moduleKey: "primary", title: "Scruffcrow test", turnLimit: 4, board, units: [{ ...exposed, pos: "0,0" }], enemies: [{ ...enemy }], objects: [{ ...basket }], objective });
  const clearResolved = resolveEnemyPhase(endPlayerPhase(clearState));
  assert.equal(clearResolved.objects.basket.value, 4, "with nobody exposed, the peck proceeds exactly as before");
});
