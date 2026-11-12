import test from "node:test";
import assert from "node:assert/strict";
import { expeditionRoster } from "./expedition-roster.js";
import { createCiderRun, deliverCertifiedPair, generateCiderRunLayout, REFERENCE_LAYOUT_SEED, CIDER_RUN_CONFIG } from "./cider-run.js";
import {
  createExpeditionState,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  guardTarget,
  hexDistance,
  hexNeighbours,
  interactObject,
  moveUnit,
  reachableHexes,
  resolveEnemyPhase,
  useDisciplineAction,
} from "./expedition-engine.js";

// A minimal greedy walk to get a unit adjacent to a hex, spending a fresh round's AP if it
// doesn't fit in one — the exact same strategy deliverCertifiedPair (cider-run.js) uses
// internally, reimplemented locally here only because that one is wired specifically to the
// two gate hexes, not an arbitrary destination.
function walkAdjacent(state, unitId, targetHex, roundBudget = 3) {
  for (let round = 0; round < roundBudget; round += 1) {
    for (let guard = 0; guard < 20 && state.units[unitId].ap > 0 && hexDistance(state.units[unitId].pos, targetHex) > 1; guard += 1) {
      const options = reachableHexes(state, unitId);
      if (!options.length) break;
      let best = options[0];
      for (const opt of options) if (hexDistance(opt.key, targetHex) < hexDistance(best.key, targetHex)) best = opt;
      if (hexDistance(best.key, targetHex) >= hexDistance(state.units[unitId].pos, targetHex)) break;
      state = moveUnit(state, unitId, best.key);
    }
    if (hexDistance(state.units[unitId].pos, targetHex) <= 1) return state;
    state = resolveEnemyPhase(endPlayerPhase(state));
  }
  return state;
}
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
    // 2026-09-21 rebuild: exactly two pairs, not one — a real choice between two independently
    // certified routes, not a single findable answer to execute (see cider-run.js's header).
    assert.equal(pairCount, 2, `seed: exactly two pairs should reach the target, got ${pairCount}`);
    assert.ok(!values.includes(layout.target), "no single press may equal the target — the gate genuinely needs a pair, both hexes, not one press on one hex (found live in ~30% of layouts before this check existed)");
    assert.ok(layout.safePairIds && layout.fastPairIds, "every layout names which pair is the guaranteed-safe one and which is merely deliverable");
    const soleOverlap = layout.safePairIds.filter((id) => layout.fastPairIds.includes(id));
    assert.deepEqual(soleOverlap, [], "the two certified pairs never share a press");
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

// Driven by deliverCertifiedPair (cider-run.js) — the exact same greedy simulator the
// generator's own certifier uses to accept this layout — rather than a hand-transcribed hex
// sequence. 2026-09-21 rebuild: generateCiderRunLayout now certifies two independent pairs per
// layout (pairCount: 2, a genuine choice), so a hand-authored trace tied to one specific pair's
// hex coordinates would silently go stale the next time the generator's output changed. This
// proves the layout's guaranteed-safe pair (safePairIds) specifically.
test("REF: the loan squad fills the press gate with the guaranteed-safe pair, fast enough to beat Scruffcrow's flood", () => {
  // Loan squad is Bushel/Pip/Nine, not Pip/Bramble/Nine (2026-09-18: the default squad had no
  // Arithmetic hero to use the map's own named alternate route — see expedition-catalogue.js).
  const squad = squadOf(["bushel", "pip", "nine"]);
  const state0 = createCiderRun(squad);
  const layout = generateCiderRunLayout(REFERENCE_LAYOUT_SEED);
  const [firstId, secondId] = layout.safePairIds;
  assert.equal(state0.objects[firstId].value + state0.objects[secondId].value, layout.target, "the safe pair really does sum to the printed target");
  const { success, state } = deliverCertifiedPair(state0, firstId, secondId, CIDER_RUN_CONFIG.turnLimit);
  assert.ok(success, "the certifier's own simulator must be able to deliver the pair it certified");
  assert.equal(state.status, "won");
  const objective = evaluateObjective(state);
  assert.equal(objective.complete, true);
  assert.equal(objective.progress, `${layout.target}/${layout.target}`);
  assert.ok(state.turn <= CIDER_RUN_CONFIG.turnLimit);
});

test("high-tier squad: an all-Epic squad completes the identical guaranteed-safe pair", () => {
  const squad = squadOf(["warden", "ninebark", "cascade"]);
  const state0 = createCiderRun(squad);
  const layout = generateCiderRunLayout(REFERENCE_LAYOUT_SEED);
  const { success, state } = deliverCertifiedPair(state0, layout.safePairIds[0], layout.safePairIds[1], CIDER_RUN_CONFIG.turnLimit);
  assert.ok(success, "the same route works for a stronger squad");
  assert.equal(state.status, "won", "the same physical trace works for a stronger squad");
});

test("Combine: an Arithmetic hero can merge two presses into a fresh value, the map's own 'Arithmetic changes a press value' alternate route", () => {
  const state0 = createCiderRun(squadOf(["bushel", "pip", "nine"]));
  assert.equal(state0.units.bushel.discipline, "arithmetic");
  // Neither of the layout's two certified pairs (safePairIds/fastPairIds) — the two presses
  // left over once both are accounted for — proves the mechanism is genuinely usable on this
  // map's own generated objects without disturbing either certified route at all, the same
  // "prove the alternate route is real, not merely named" discipline as Counting Orchard's own
  // Combine test. Combine needs both objects on the ground and adjacent (expedition-engine.js),
  // so this is collect, carry, drop next to the other, then combine.
  const layout = generateCiderRunLayout(REFERENCE_LAYOUT_SEED);
  const solutionIds = new Set([...layout.safePairIds, ...layout.fastPairIds]);
  const decoys = Object.keys(state0.objects).filter((id) => !solutionIds.has(id));
  assert.equal(decoys.length, 2, "exactly two presses are left over once both certified pairs are accounted for");
  const [firstId, secondId] = decoys;
  const expected = state0.objects[firstId].value + state0.objects[secondId].value;

  let state = walkAdjacent(state0, "bushel", state0.objects[firstId].pos);
  if (state.units.bushel.ap < 1) state = resolveEnemyPhase(endPlayerPhase(state));
  state = interactObject(state, "bushel", firstId);
  state = walkAdjacent(state, "bushel", state.objects[secondId].pos);
  if (state.units.bushel.ap < 1) state = resolveEnemyPhase(endPlayerPhase(state));
  state = interactObject(state, "bushel", firstId); // drop back at bushel's own hex, now adjacent to secondId
  state = useDisciplineAction(state, "bushel", "combine", { firstId, secondId });
  assert.equal(state.objects[firstId].value, expected);
  assert.equal(state.objects[secondId].removed, true);
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
// generateCiderRunLayout returns has been checked so that if a certified pair's press is ever
// the one a flood would hit, a real party can still physically deliver a fresh pair in whatever
// rounds are left.
//
// The 2026-09-18 version of this test walked the fixed REFERENCE_LAYOUT_SEED trace by hand and
// asserted the flood landed on a specific untouched press. That no longer holds in general now
// that generateCiderRunLayout offers two certified pairs, not one (2026-09-21 rebuild) — the
// safe pair's own two lanes vary by seed, and for REFERENCE_LAYOUT_SEED specifically the
// guaranteed-safe pair wins before Scruffcrow ever gets an active turn at all (see
// scripts/simulate_cider_run.mjs's actual output), so a hand-picked "the flood definitely lands
// on press X" assertion would just be asserting this one seed's incidental timing. The
// mechanism itself — a flood that's genuinely live and provably never turns the printed target
// into a dead run — is already covered generically, across every seed, by "procedural
// generation: no layout can be flooded into an unrecoverable dead run" above and by the ENM
// tests below; nothing here duplicated that more narrowly, so nothing needed replacing it.

// Rewritten 2026-09-21 (Sam's playtest of The Cider Run: Guard "doesn't do anything" —
// EXPEDITIONS_CLAUDE_HANDOVER.md). Scruffcrow (and every other lane/erosion-style enemy) now
// strikes an unguarded hero standing in its reach instead of touching its usual object target
// that round — see strikeAdjacentHero in expedition-engine.js. The old contract this test
// named ("never attacks a hero directly") was exactly the gap that made Guard/hp/stats inert
// on this map; this now asserts the replacement contract instead of the removed one.
test("ENM: an unguarded hero in Scruffcrow's reach is struck instead of the press flooding; Guard blocks the strike; with nobody exposed, the flood proceeds as before", () => {
  const board = CIDER_RUN_CONFIG.board;
  const enemy = { id: "scruffcrow", name: "Scruffcrow", side: "enemy", hp: 2, defence: 4, move: 1, range: 1, damage: 1, pos: "3,-3", delay: 0, behaviour: "flood-lane", laneSequence: [1] };
  const press = { id: "press", kind: "press", value: 5, pos: "3,-2", lane: 1 };
  const objective = { family: "exactSum", hexes: ["0,0"], target: 5 };

  const exposed = { id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, hp: 3, maxHp: 3, move: 1, pos: "3,-3" };
  const exposedState = createExpeditionState({ id: "scruffcrow-strike-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [exposed], enemies: [{ ...enemy }], objects: [{ ...press }], objective });
  const exposedResolved = resolveEnemyPhase(endPlayerPhase(exposedState));
  assert.equal(exposedResolved.units.hero.hp, 2, "an unguarded hero standing in range is struck instead of the flood");
  assert.equal(exposedResolved.objects.press.value, 5, "the strike replaces the flood this round — the press is untouched");

  const guardedState = createExpeditionState({ id: "scruffcrow-strike-guarded-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [{ ...exposed, guarded: true }], enemies: [{ ...enemy }], objects: [{ ...press }], objective });
  const guardedResolved = resolveEnemyPhase(endPlayerPhase(guardedState));
  assert.equal(guardedResolved.units.hero.hp, 3, "Guard blocks the strike entirely");
  assert.equal(guardedResolved.objects.press.value, 5, "a blocked strike still isn't a flood — the press is safe that round too");

  const clearState = createExpeditionState({ id: "scruffcrow-flood-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [{ ...exposed, pos: "0,0" }], enemies: [{ ...enemy }], objects: [{ ...press }], objective });
  const clearResolved = resolveEnemyPhase(endPlayerPhase(clearState));
  assert.equal(clearResolved.units.hero.hp, 3, "no hero in range — nobody is struck");
  assert.equal(clearResolved.objects.press.value, 6, "with nobody exposed, the flood proceeds exactly as before");
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
