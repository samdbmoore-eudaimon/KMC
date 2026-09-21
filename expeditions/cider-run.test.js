import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createCiderRun, generateCiderRunLayout, REFERENCE_LAYOUT_SEED, CIDER_RUN_CONFIG } from "./cider-run.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  hexNeighbours,
  interactObject,
  moveUnit,
  resolveEnemyPhase,
  useDisciplineAction,
} from "./expedition-engine.js";
import { EXPEDITION_TIERS, EXPEDITION_READINESS_BY_LEVEL } from "./expedition-data.js";
import { assessSquadReadiness } from "./expedition-readiness.js";

function squadOf(ids) {
  const roster = expeditionRoster("primary");
  return ids.map((id) => roster.find((profile) => profile.id === id));
}

test("The Cider Run creates a playable state from three Ninefold Orchard commons", () => {
  const state = createCiderRun(squadOf(["pip", "bramble", "nine"]));
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 1);
  assert.equal(Object.keys(state.objects).length, 6);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

test("procedural generation: different seeds produce genuinely different, independently verified layouts", () => {
  const layouts = Array.from({ length: 20 }, (_, seed) => generateCiderRunLayout(seed));
  const valueSets = layouts.map((layout) => layout.presses.map((p) => p.value).sort((a, b) => a - b).join(","));
  const targets = layouts.map((layout) => layout.target);
  assert.ok(new Set(valueSets).size >= 15, `expected most of 20 seeds to have distinct press values, got ${new Set(valueSets).size} distinct sets`);
  assert.ok(new Set(targets).size > 1, "the target itself should vary across seeds, not just which presses reach it");
  for (const layout of layouts) {
    assert.equal(layout.presses.length, 6);
    assert.equal(new Set(layout.presses.map((p) => p.value)).size, 6, "no repeated values within one layout");
    const values = layout.presses.map((p) => p.value);
    let pairCount = 0;
    for (let i = 0; i < values.length; i += 1) for (let j = i + 1; j < values.length; j += 1) if (values[i] + values[j] === layout.target) pairCount += 1;
    assert.equal(pairCount, 1, `seed: exactly one pair should reach the target, got ${pairCount}`);
    assert.ok(!values.includes(layout.target), "no single press may equal the target — the gate genuinely needs a pair, both hexes, not one press on one hex (found live in ~30% of layouts before this check existed)");
  }
});

// Black-box regression for isRecoverableAfterOneFloodTick (cider-run.js): re-derives the same
// arithmetic externally, from the layout alone, rather than importing the private certifier —
// locking in the guarantee from outside, the same way this file already checks generation
// output rather than internal certifier plumbing. Found and fixed 2026-09-18 while first
// writing a "flood is consequential" test: the first post-redesign layout could be flooded into
// a dead run with no direct pair and no Combine able to reach the target at all.
test("procedural generation: no layout can be flooded into an unrecoverable dead run", () => {
  for (let seed = 0; seed < 40; seed += 1) {
    const layout = generateCiderRunLayout(seed);
    const { presses, target } = layout;
    const highestOnLane = {};
    for (const press of presses) {
      const current = highestOnLane[press.lane];
      if (!current || press.value > current.value) highestOnLane[press.lane] = press;
    }
    let solution = null;
    for (let i = 0; i < presses.length && !solution; i += 1) {
      for (let j = i + 1; j < presses.length; j += 1) {
        if (presses[i].value + presses[j].value === target) { solution = [presses[i], presses[j]]; break; }
      }
    }
    for (const press of solution) {
      if (highestOnLane[press.lane].id !== press.id) continue; // not vulnerable — flooding this lane never touches it
      const values = Object.fromEntries(presses.map((p) => [p.id, p.value]));
      values[press.id] += 1;
      const ids = Object.keys(values);
      const freshPair = ids.some((a, i) => ids.slice(i + 1).some((b) => values[a] + values[b] === target));
      assert.ok(freshPair, `seed ${seed}: flooding vulnerable solution press ${press.id} left no fresh direct pair for target ${target}`);
    }
  }
});

test("procedural generation: the same seed always reproduces the exact same layout (GEN-01)", () => {
  const a = generateCiderRunLayout("a-fixed-seed");
  const b = generateCiderRunLayout("a-fixed-seed");
  assert.deepEqual(a, b);
});

test("REF: the loan squad fills the press gate with the one exact pair, fast enough to beat Scruffcrow's flood", () => {
  // Loan squad is Bushel/Pip/Nine, not Pip/Bramble/Nine (2026-09-18: the default squad had no
  // Arithmetic hero to use the map's own named alternate route — see expedition-catalogue.js).
  // Bushel takes the "0,0" start slot; Pip sits this one out, same as an unneeded third hero
  // always has on this map. REFERENCE_LAYOUT_SEED's certified pair is press_4 (lane 2, far) +
  // press_11 (lane 3, far) — both a genuine "reach" trek from the gate, taking three rounds
  // (isRecoverableAfterOneFloodTick, cider-run.js, additionally guarantees this specific pair
  // is never a flood target at all, so a slower party is never punished for the extra travel).
  const squad = squadOf(["bushel", "pip", "nine"]);
  let state = createCiderRun(squad);
  assert.equal(state.objects.press_4.value, 4);
  assert.equal(state.objects.press_11.value, 11);
  assert.equal(state.objective.target, 15);
  state = moveUnit(state, "nine", "1,-3");
  state = interactObject(state, "nine", "press_4");
  state = moveUnit(state, "bushel", "-1,1");
  state = moveUnit(state, "bushel", "-3,2");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.history.filter((h) => h.unitId === "scruffcrow").at(-1).action, "watch", "the one-round delay means Scruffcrow does nothing in round 1");
  state = moveUnit(state, "nine", "1,-1");
  state = interactObject(state, "nine", "press_4", "1,-1");
  state = interactObject(state, "bushel", "press_11");
  state = moveUnit(state, "bushel", "-1,1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "bushel", "1,0");
  state = interactObject(state, "bushel", "press_11", "1,0");
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(objective.progress, "15/15");
  assert.ok(state.turn <= CIDER_RUN_CONFIG.turnLimit);
  assert.equal(state.counters.actions, 10);
});

test("high-tier squad: an all-Epic squad completes the identical reference trace", () => {
  const squad = squadOf(["warden", "ninebark", "cascade"]);
  let state = createCiderRun(squad);
  state = moveUnit(state, "cascade", "1,-3");
  state = interactObject(state, "cascade", "press_4");
  state = moveUnit(state, "warden", "-1,1");
  state = moveUnit(state, "warden", "-3,2");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "cascade", "1,-1");
  state = interactObject(state, "cascade", "press_4", "1,-1");
  state = interactObject(state, "warden", "press_11");
  state = moveUnit(state, "warden", "-1,1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "warden", "1,0");
  state = interactObject(state, "warden", "press_11", "1,0");
  assert.equal(state.status, "won", "the same physical trace works for a stronger squad");
});

test("Combine: an Arithmetic hero can merge two presses into a fresh value, the map's own 'Arithmetic changes a press value' alternate route", () => {
  const state0 = createCiderRun(squadOf(["bushel", "pip", "nine"]));
  assert.equal(state0.units.bushel.discipline, "arithmetic");
  // press_9 + press_2 (both lane 1, adjacent to each other) — not the shipped solution, but
  // proves the mechanism is genuinely usable on this map's own generated objects, the same
  // "prove the alternate route is real, not merely named" discipline as Counting Orchard's own
  // Combine test. Combine needs both objects on the ground and adjacent (expedition-engine.js),
  // so this is collect, carry, drop next to the other, then combine — a minimum of three
  // actions across two rounds even for the shortest possible case, meaning Scruffcrow's
  // one-round delay has already lapsed by the time it resolves: press_9, lane 1's highest, sits
  // alone and unguarded through round 2's enemy phase (press_2 is being carried, so is
  // flood-immune) and is genuinely flooded to 10 before the combine — itself a small extra
  // proof the two mechanics interact correctly, not a scripting error. 10 + 2 = 12.
  let state = moveUnit(state0, "bushel", "1,0");
  state = interactObject(state, "bushel", "press_2");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "bushel", "2,0");
  state = interactObject(state, "bushel", "press_2"); // drop back at bushel's own hex, adjacent to press_9
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects.press_9.value, 10, "lane 1's highest unguarded press once both are back on the ground");
  state = useDisciplineAction(state, "bushel", "combine", { firstId: "press_9", secondId: "press_2" });
  assert.equal(state.objects.press_9.value, 12);
  assert.equal(state.objects.press_2.removed, true);
});

test("guarding a press protects it from Scruffcrow's flood, which falls to the next-highest unguarded press on that lane instead", () => {
  let state = createCiderRun(squadOf(["pip", "bramble", "nine"]));
  const laneOnePresses = Object.values(state.objects).filter((object) => object.lane === 1).sort((a, b) => b.value - a.value);
  const [highest, other] = laneOnePresses;
  // Guard only lasts one round (resolveEnemyPhase clears it on every object at round end, the
  // same as it clears a unit's), so the one delay round happens first with nothing to protect,
  // then Guard is applied fresh immediately before round 2 — the first round the flood, rotated
  // to land on lane 1 first (see cider-run.js's laneSequence comment), actually reaches it.
  state = resolveEnemyPhase(endPlayerPhase(state));
  const adjacentHex = hexNeighbours(highest.pos).find((hex) => state.board[hex] && hex !== other.pos);
  state = { ...state, units: { ...state.units, pip: { ...state.units.pip, pos: adjacentHex } } };
  state = guardTarget(state, "pip", highest.id);
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects[highest.id].value, highest.value, "guarded, so untouched even though the flood reaches lane 1 this round");
  assert.equal(state.objects[other.id].value, other.value + 1, "the flood falls to lane 1's next-highest unguarded press instead");
});

test("ENM: Scruffcrow advances through the three lanes in a fixed, repeating order and floods each lane's highest unguarded press by exactly one, only once its delay has passed", () => {
  let state = createCiderRun(squadOf(["pip", "bramble", "nine"]));
  const byLane = (lane) => Object.values(state.objects).filter((object) => object.lane === lane).sort((a, b) => b.value - a.value)[0];
  const lane1Highest = byLane(1).id;
  const startValue = state.objects[lane1Highest].value;
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 1: delay
  assert.equal(state.objects[lane1Highest].value, startValue, "still within the one-round delay");
  state = resolveEnemyPhase(endPlayerPhase(state)); // round 2: lane 1 floods
  assert.equal(state.objects[lane1Highest].value, startValue + 1, "lane 1's highest press rises by one once the delay has passed");
});

// Codex's Cider Run distinctness review (2026-09-18): "make the flood visible and consequential
// within a normal five-minute playthrough... a normal player can recognise the threatened lane
// and recover or choose an alternate plan." Investigating this directly (not assuming it) is
// what found the real bug documented above isRecoverableAfterOneFloodTick: the first version of
// this test, against the first post-redesign reference layout, discovered that layout's
// certified pair *could* be flooded into a genuinely unrecoverable dead run — no direct pair, no
// Combine, nothing. That is now a generation-time guarantee instead of a hope: every layout
// generateCiderRunLayout returns has been checked so that if either solution press is ever the
// one a flood would hit, a real party can still physically deliver a fresh pair in whatever
// rounds are left. REFERENCE_LAYOUT_SEED's own certified pair (press_4 lane 2, press_11 lane 3)
// happens to need no such rescue at all — neither is ever its lane's flood target — so this
// test instead proves the flood is genuinely live during completely normal play (not merely
// theoretically possible), and that a lane's flood, even while it's happening, never comes near
// the printed target: the reference trace above never touches lane 1's presses at all, so
// Scruffcrow's rotation reaches it and floods press_9 right on schedule, entirely as a
// side-effect of ordinary play, while the certified pair sails through untouched.
test("the flood is genuinely live during ordinary play, and never threatens the certified pair", () => {
  const squad = squadOf(["bushel", "pip", "nine"]);
  let state = createCiderRun(squad);
  assert.equal(state.objects.press_4.value + state.objects.press_11.value, state.objective.target, "the certified pair is valid before any flood");

  // The reference trace's own route: nine fetches lane 2's far press, bushel fetches lane 3's
  // far press. Lane 1 is never touched, so its highest press (press_9) is exactly what
  // Scruffcrow's schedule says it should flood, unprompted by anything this test does.
  state = moveUnit(state, "nine", "1,-3");
  state = interactObject(state, "nine", "press_4");
  state = moveUnit(state, "bushel", "-1,1");
  state = moveUnit(state, "bushel", "-3,2");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects.press_9.value, 9, "still within the one-round delay");

  state = moveUnit(state, "nine", "1,-1");
  state = interactObject(state, "nine", "press_4", "1,-1");
  state = interactObject(state, "bushel", "press_11");
  state = moveUnit(state, "bushel", "-1,1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.objects.press_9.value, 10, "lane 1 floods right on schedule, purely because nobody happened to touch it");
  assert.equal(state.objects.press_4.value + state.objects.press_11.value, state.objective.target, "the certified pair is completely unaffected by a flood on a different lane");

  state = moveUnit(state, "bushel", "1,0");
  state = interactObject(state, "bushel", "press_11", "1,0");
  assert.equal(state.status, "won", "the flood happened, in full view, and changed nothing about whether this run wins");
  assert.equal(evaluateObjective(state).progress, "15/15");
});

test("ENM: Scruffcrow never attacks a hero directly — flooding a press is its entire behaviour", () => {
  const board = CIDER_RUN_CONFIG.board;
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "3,-3" }];
  const enemy = { id: "scruffcrow", name: "Scruffcrow", side: "enemy", hp: 2, defence: 4, move: 1, range: 1, damage: 1, pos: "3,-3", delay: 0, behaviour: "flood-lane", laneSequence: [1] };
  const state = createExpeditionState({ id: "scruffcrow-flood-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units, enemies: [enemy], objects: [{ id: "press", kind: "press", value: 5, pos: "3,-2", lane: 1 }], objective: { family: "exactSum", hexes: ["0,0"], target: 5 } });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.units.hero.hp, 3, "adjacent or not, Scruffcrow only ever floods a press, never strikes a hero");
  assert.equal(resolved.objects.press.value, 6);
});

// EXPEDITIONS_CARD_AUDIT.md's Finding 1 (the level-2 readiness band is trivially met by every
// possible squad) carries over unchanged: this map inherits the same level-2 band, unchanged
// by the mechanic swap.
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
