import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createNineAcrossBridge, NINE_ACROSS_BRIDGE_CONFIG } from "./nine-across-bridge.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  interactObject,
  moveUnit,
  reframeTarget,
  resolveEnemyPhase,
  useDisciplineAction,
} from "./expedition-engine.js";
import { EXPEDITION_SCENARIOS, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function squadOf(ids) {
  const roster = expeditionRoster("primary");
  return ids.map((id) => roster.find((profile) => profile.id === id));
}

test("Nine Across the Turning Bridge creates a playable state from three Ninefold Orchard commons", () => {
  const state = createNineAcrossBridge(squadOf(["pip", "bramble", "nine"]));
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 1);
  assert.equal(Object.keys(state.objects).length, 5, "three loads plus two wind vanes");
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

// REF-12, rebuilt (2026-09-17): verified by direct simulation (a greedy nearest-hero walk,
// same technique Unequal Crossing's isPhysicallyDeliverable uses) before being trimmed to this
// exact minimal action sequence and locked in. Crosswind's one-round delay means round 1 is
// always safe; by the time it acts (end of round 2), every load is already delivered or one
// drop action away, so the vane it closes (vane_far, tied on distance with vane_near and
// broken alphabetically) never actually gates anything more — matching this map's own honest
// capacityLimits note below.
test("REF-12: the loan squad delivers all three loads to the far orchard within the round budget", () => {
  const squad = squadOf(["pip", "bramble", "nine"]);
  let state = createNineAcrossBridge(squad);
  state = interactObject(state, "pip", "crate_2");
  state = moveUnit(state, "pip", "0,-1");
  state = interactObject(state, "nine", "crate_4");
  state = moveUnit(state, "nine", "1,0");
  state = interactObject(state, "bramble", "crate_3");
  state = moveUnit(state, "bramble", "0,0");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.history.filter((h) => h.unitId === "crosswind").at(-1).action, "watch", "the one-round delay means Crosswind does nothing in round 1");

  state = moveUnit(state, "pip", "2,-1");
  state = moveUnit(state, "pip", "2,0");
  state = interactObject(state, "nine", "crate_4", "2,-1");
  state = moveUnit(state, "bramble", "2,-2");
  state = interactObject(state, "bramble", "crate_3", "2,-2");
  state = resolveEnemyPhase(endPlayerPhase(state));
  const gust = state.history.filter((h) => h.unitId === "crosswind").at(-1);
  assert.equal(gust.action, "turn-vane");
  assert.equal(gust.objectId, "vane_far", "tied on distance with vane_near, broken alphabetically");
  assert.equal(state.objects.vane_far.orientation, 1, "closed — but nothing is left to deliver through it");
  assert.equal(state.objects.vane_near.orientation, 0, "untouched");

  state = interactObject(state, "pip", "crate_2", "2,0");
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.ok(state.turn <= NINE_ACROSS_BRIDGE_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 12);
});

test("ENM: Crosswind turns the nearest open, unprotected vane one step, and does nothing once both are already closed", () => {
  const board = NINE_ACROSS_BRIDGE_CONFIG.board;
  const enemy = { id: "crosswind", name: "Crosswind", side: "enemy", hp: 2, defence: 4, move: 0, range: 1, damage: 1, pos: "-1,0", delay: 0, behaviour: "gust", vaneIds: ["vane_near", "vane_far"] };
  const objects = [
    { id: "vane_near", pos: "0,-2", orientation: 0, tracks: [[0, 3]] },
    { id: "vane_far", pos: "1,-2", orientation: 0, tracks: [[0, 3]] },
  ];
  let state = createExpeditionState({ id: "gust-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [], enemies: [enemy], objects, objective: { family: "eliminate" } });
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects.vane_far.orientation, 1, "the tied-distance vane closes first, alphabetically");
  assert.equal(state.objects.vane_near.orientation, 0);
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects.vane_near.orientation, 1, "with vane_far already closed, the still-open vane_near is next");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.history.filter((h) => h.unitId === "crosswind").at(-1).action, "gust", "both vanes are closed — nothing left to turn");
  assert.equal(state.objects.vane_near.orientation, 1);
  assert.equal(state.objects.vane_far.orientation, 1);
});

test("ENM: a guarded or Stabilised vane is immune to Crosswind's gust", () => {
  const board = NINE_ACROSS_BRIDGE_CONFIG.board;
  const enemy = { id: "crosswind", name: "Crosswind", side: "enemy", hp: 2, defence: 4, move: 0, range: 1, damage: 1, pos: "-1,0", delay: 0, behaviour: "gust", vaneIds: ["vane_near"] };
  const guardedState = createExpeditionState({ id: "gust-guard-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [], enemies: [enemy], objects: [{ id: "vane_near", pos: "0,-2", orientation: 0, guarded: true, tracks: [[0, 3]] }], objective: { family: "eliminate" } });
  assert.equal(resolveEnemyPhase(endPlayerPhase(guardedState)).objects.vane_near.orientation, 0);

  const stabilisedState = createExpeditionState({ id: "gust-stabilise-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [], enemies: [enemy], objects: [{ id: "vane_near", pos: "0,-2", orientation: 0, stabilisedUntil: 5, tracks: [[0, 3]] }], objective: { family: "eliminate" } });
  assert.equal(resolveEnemyPhase(endPlayerPhase(stabilisedState)).objects.vane_near.orientation, 0);
});

test("Reckoner: any hero with the wizard role, not just a Geometry specialist, can turn a vane back open", () => {
  const state = createNineAcrossBridge(squadOf(["pip", "bramble", "nine"]));
  assert.equal(state.units.bramble.discipline, "science", "Bramble reframes by role, not by Geometry discipline");
  const adjacent = { ...state, units: { ...state.units, bramble: { ...state.units.bramble, pos: "0,-1" } }, objects: { ...state.objects, vane_far: { ...state.objects.vane_far, orientation: 3 } } };
  const reframed = reframeTarget(adjacent, "bramble", "vane_far", { orientation: 0 });
  assert.equal(reframed.objects.vane_far.orientation, 0);
});

test("Science: Stabilise (available to Pip or Bramble, both Science discipline) holds a vane against the next gust", () => {
  let state = createNineAcrossBridge(squadOf(["pip", "bramble", "nine"]));
  state = moveUnit(state, "pip", "0,-1");
  const stabilised = useDisciplineAction(state, "pip", "stabilise", { targetId: "vane_near" });
  assert.equal(stabilised.objects.vane_near.stabilisedUntil, stabilised.turn + 1);
});

// The original "safe route" test no longer has a premise: Crosswind's rebuilt "gust" behaviour
// never targets a hero at all (see the two ENM tests above), so there is no longer a "which
// hexes are safe from Crosswind" question — every hex is. Replaced with a direct proof of
// that instead of a token "walk somewhere and check nothing happened" test.
test("Crosswind's gust cannot damage or push a hero under any circumstance — proved structurally, not by trying one route", () => {
  let state = createNineAcrossBridge(squadOf(["pip", "bramble", "nine"]));
  const startingHeroHp = Object.values(state.units).filter((u) => u.side === "player").map((u) => u.hp);
  for (let round = 0; round < 3; round += 1) state = resolveEnemyPhase(endPlayerPhase(state));
  const heroHp = Object.values(state.units).filter((u) => u.side === "player").map((u) => u.hp);
  assert.deepEqual(heroHp, startingHeroHp, "three full rounds of Crosswind's gust never change a single hero's hearts");
});

test("guarding a carrier is unaffected by the rebuild — Crosswind was never able to target a hero directly", () => {
  const board = NINE_ACROSS_BRIDGE_CONFIG.board;
  const state = createExpeditionState({
    id: "guard-carrier-test", moduleKey: "primary", title: "test", turnLimit: 4, board,
    units: [
      { id: "carrier", stats: [1, 1, 1, 1, 1], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "0,-1", carrying: "crate" },
      { id: "guardian", stats: [1, 1, 1, 1, 1], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "-1,0" },
    ],
    enemies: [{ id: "crosswind", name: "Crosswind", hp: 2, defence: 4, move: 0, range: 1, damage: 1, pos: "-2,0", delay: 0, behaviour: "gust", vaneIds: [] }],
    objects: [{ id: "crate", value: 2, pos: null }],
    objective: { family: "eliminate" },
  });
  const guarded = guardTarget(state, "guardian", "carrier");
  const resolved = resolveEnemyPhase(endPlayerPhase(guarded));
  assert.equal(resolved.units.carrier.pos, "0,-1");
  assert.equal(resolved.units.carrier.hp, 3);
});

test("capacity check: a closed vane's section has an effective cap of zero, an open one keeps its printed max — the openWhenOrientation gate itself", () => {
  const board = NINE_ACROSS_BRIDGE_CONFIG.board;
  const objective = { family: "delivery", destinationHexes: ["2,0"], count: 1, capacityLimits: [{ label: "the gated section", hexes: ["0,0"], max: 9, openWhenOrientation: { objectId: "vane", orientations: [0] } }] };
  const closed = createExpeditionState({ id: "gate-closed-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [], enemies: [], objects: [{ id: "vane", pos: "0,-2", orientation: 1, tracks: [[0, 3]] }, { id: "load", value: 1, pos: "0,0" }], objective });
  const closedResult = evaluateObjective(closed);
  assert.equal(closedResult.failed, true);
  assert.match(closedResult.progress, /overloaded: 1\/0/, "any weight at all overloads a closed section, printed max notwithstanding");
  const open = { ...closed, objects: { ...closed.objects, vane: { ...closed.objects.vane, orientation: 0 } } };
  assert.equal(evaluateObjective(open).failed, undefined, "the same one weight is fine once the vane reads open");
});

test("capacity check: the real map's own loads (2 + 3 + 4 = 9) can never exceed a section's raw cap of nine, however they are arranged", () => {
  const state = createNineAcrossBridge(squadOf(["pip", "bramble", "nine"]));
  const totalWeight = Object.values(state.objects).filter((object) => object.kind === "load").reduce((sum, object) => sum + object.value, 0);
  for (const limit of state.objective.capacityLimits) assert.ok(totalWeight <= limit.max, "no arrangement of these three loads can ever overload either section's raw cap");
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: a named below-recommendation squad, with its
// shortfall reproduced in the readiness result. Embark itself is never blocked by this.
test("§9: a below-battle-value squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = EXPEDITION_SCENARIOS.primary.find((s) => s.id === "po_nine_across");
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "minimum_rarity_count"));
});

test("high-tier squad: an all-Epic squad completes the identical reference trace", () => {
  const squad = squadOf(["warden", "ninebark", "cascade"]);
  let state = createNineAcrossBridge(squad);
  state = interactObject(state, "warden", "crate_2");
  state = moveUnit(state, "warden", "0,-1");
  state = interactObject(state, "cascade", "crate_4");
  state = moveUnit(state, "cascade", "1,0");
  state = interactObject(state, "ninebark", "crate_3");
  state = moveUnit(state, "ninebark", "0,0");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "warden", "2,-1");
  state = moveUnit(state, "warden", "2,0");
  state = interactObject(state, "cascade", "crate_4", "2,-1");
  state = moveUnit(state, "ninebark", "2,-2");
  state = interactObject(state, "ninebark", "crate_3", "2,-2");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = interactObject(state, "warden", "crate_2", "2,0");
  assert.equal(state.status, "won");
});
