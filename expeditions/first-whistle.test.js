import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createFirstWhistle, FIRST_WHISTLE_CONFIG } from "./first-whistle.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  moveUnit,
  reframeTarget,
  resolveEnemyPhase,
  strikeEnemy,
  useDisciplineAction,
} from "./expedition-engine.js";
import { EXPEDITION_READINESS_BY_LEVEL, EXPEDITION_TIERS } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function squadOf(ids) {
  const roster = expeditionRoster("primary");
  return ids.map((id) => roster.find((profile) => profile.id === id));
}

test("The First Whistle creates a playable state, First Root shielded until the network is live", () => {
  const state = createFirstWhistle(squadOf(["russet", "bramble", "nine"]));
  assert.equal(state.status, "playing");
  assert.equal(state.units.russet.discipline, "geometry");
  assert.equal(state.objects.marker_near.orientation, 2);
  assert.equal(state.objects.marker_far.jammed, true);
  const struck = strikeEnemy(state, "russet", "first_root");
  assert.equal(struck.history.at(-1).impact, 0, "the network is not yet connected, however strong the strike");
  assert.equal(struck.units.first_root.hp, 6, "a shielded strike is a legal action with no effect, not a thrown error");
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

// Verified by direct simulation before being locked in. Both branches rotate true in round 1
// (the ordinary one by Reframe, the jammed one by Russet's Force Rotate), opening the network
// immediately — Russet, already adjacent to First Root, lands the first strike the same round.
// The remaining two heroes close the distance and finish the boss together in round 2, before
// its one-round delay even lets it act.
test("REF: both branches turn true, opening the network; the party defeats First Root by round 2", () => {
  const squad = squadOf(["russet", "bramble", "nine"]);
  let state = createFirstWhistle(squad);
  state = reframeTarget(state, "bramble", "marker_near", { orientation: 0 });
  assert.equal(state.objects.marker_near.orientation, 0);
  state = useDisciplineAction(state, "russet", "forceRotate", { objectId: "marker_far", orientation: 0 });
  assert.equal(state.objects.marker_far.orientation, 0);
  assert.equal(state.history.at(-1).success, true);

  state = strikeEnemy(state, "russet", "first_root");
  assert.equal(state.history.at(-1).networkLive, true, "both branches aligned — the network reads connected");
  assert.equal(state.history.at(-1).impact, 1);
  assert.equal(state.units.first_root.hp, 5);

  state = moveUnit(state, "bramble", "0,1");
  state = moveUnit(state, "nine", "0,-1");
  state = moveUnit(state, "nine", "2,-1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.history.filter((h) => h.unitId === "first_root").at(-1).action, "watch", "the one-round delay means it does nothing in round 1");

  state = strikeEnemy(state, "russet", "first_root");
  state = strikeEnemy(state, "bramble", "first_root");
  state = strikeEnemy(state, "nine", "first_root");

  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(state.units.first_root.hp, 0);
  assert.ok(state.turn <= FIRST_WHISTLE_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 9);
});

test("high-tier squad: an all-Epic squad (Gossamer standing in for Russet's Geometry role) completes the identical trace shape", () => {
  const squad = squadOf(["gossamer", "cascade", "warden"]);
  let state = createFirstWhistle(squad);
  state = reframeTarget(state, "cascade", "marker_near", { orientation: 0 });
  state = useDisciplineAction(state, "gossamer", "forceRotate", { objectId: "marker_far", orientation: 0 });
  state = strikeEnemy(state, "gossamer", "first_root");
  assert.equal(state.history.at(-1).networkLive, true);
  state = moveUnit(state, "cascade", "0,1");
  state = moveUnit(state, "warden", "0,-1");
  state = moveUnit(state, "warden", "2,-1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "cascade", "2,1"); // Cascade (Tank, range 1) needs to close the last hex; Bramble's wizard range 2 in the loan-squad trace covered this from the same spot
  for (const hero of ["gossamer", "cascade", "warden"]) {
    if (state.units.first_root.hp <= 0) break;
    state = strikeEnemy(state, hero, "first_root");
  }
  assert.equal(state.status, "won", "a stronger squad clears First Root at least as fast as the loan squad, never slower");
  assert.equal(state.units.first_root.hp, 0);
});

test("Reckoner (reframe): any hero with the wizard role, not a Geometry specialist, turns the ordinary branch", () => {
  const state = createFirstWhistle(squadOf(["russet", "bramble", "nine"]));
  assert.equal(state.units.bramble.discipline, "science", "Bramble reframes by role, not by Geometry discipline");
  const reframed = reframeTarget(state, "bramble", "marker_near", { orientation: 0 });
  assert.equal(reframed.objects.marker_near.orientation, 0);
});

test("Force Rotate: the jammed far branch refuses an ordinary Reframe, and needs a real Geometry discipline check", () => {
  const state = createFirstWhistle(squadOf(["russet", "bramble", "nine"]));
  const near = { ...state, units: { ...state.units, bramble: { ...state.units.bramble, pos: "1,1" } } };
  assert.throws(() => reframeTarget(near, "bramble", "marker_far", { orientation: 0 }), /jammed and needs a Geometry check/);
  const rotated = useDisciplineAction(state, "russet", "forceRotate", { objectId: "marker_far", orientation: 0 });
  assert.equal(rotated.objects.marker_far.orientation, 0);
});

test("guarding First Root does not block a strike once the network is live — Guard protects a target from being struck, not the other way round", () => {
  let state = createFirstWhistle(squadOf(["russet", "bramble", "nine"]));
  state = reframeTarget(state, "bramble", "marker_near", { orientation: 0 });
  state = useDisciplineAction(state, "russet", "forceRotate", { objectId: "marker_far", orientation: 0 });
  state = { ...state, units: { ...state.units, nine: { ...state.units.nine, pos: "2,1" } } };
  state = guardTarget(state, "nine", "first_root");
  assert.equal(state.units.first_root.guarded, true, "Guard on an enemy has no defined game effect here — this only proves the action itself does not interfere with networkGate");
  const struck = strikeEnemy(state, "russet", "first_root");
  assert.equal(struck.history.at(-1).networkLive, true);
  assert.equal(struck.history.at(-1).impact, 1);
});

test("ENM: First Root uses the engine's default hunt-and-strike behaviour once active — no new combat mechanism was needed for that half", () => {
  const board = FIRST_WHISTLE_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "1,0" }];
  const enemy = { id: "first_root", name: "First Root", side: "enemy", hp: 6, defence: 4, move: 1, range: 1, damage: 1, pos: "0,0", delay: 0 };
  const state = createExpeditionState({ id: "first-root-test", moduleKey: "primary", title: "test", turnLimit: 5, board, units, enemies: [enemy], objects: [], objective: { family: "eliminate" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 2, "an unguarded hero already in range takes a strike, exactly like any other default-behaviour enemy");
});

test("§9: a below-battle-value squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 13, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = { level: 10, readiness: EXPEDITION_READINESS_BY_LEVEL[10] };
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
  assert.ok(result.shortfalls.some((s) => s.code === "all_cards_minimum_rarity"));
});
