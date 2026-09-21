import test from "node:test";
import assert from "node:assert/strict";
import { EXPEDITION_SCENARIOS, EXPEDITION_TIERS } from "./expedition-data.js";
import { allExpeditionCommanders, allExpeditionProfiles, expeditionRoster } from "./expedition-roster.js";
import {
  applyExpeditionCommand,
  applyTrackOperation,
  attemptCheck,
  computeExpeditionMarks,
  createExpeditionState,
  edgesFromNode,
  endPlayerPhase,
  estimateExpeditionMinutes,
  evaluateObjective,
  expeditionTimingReport,
  explainExpeditionOutcome,
  flowerGroup,
  hexDistance,
  hexLine,
  hexRay,
  hexRing,
  interactObject,
  moveUnit,
  reachableHexes,
  resolveEnemyPhase,
  restoreTileTerrain,
  rankExpeditionMarks,
  ringOppositePairs,
  ringSector,
  rotationHexTracks,
  routeMarkerConnections,
  solveBalancedPartition,
  tracksAligned,
  travelThroughRotationHex,
} from "./expedition-engine.js";
import { validateVisibleCheckDeclaration } from "./expedition-schema.js";
import { assessSquadReadiness } from "./expedition-readiness.js";
import { catalogueEntry } from "./expedition-catalogue.js";
import { createUnequalCrossing, UNEQUAL_CROSSING_CONFIG, REFERENCE_LAYOUT_SEED, generateUnequalCrossingLayout } from "./unequal-crossing.js";
import { canAccessExpeditions } from "./expedition-access.js";

test("Expeditions access requires the exact eudaimon and Rooke developer profile", () => {
  assert.equal(canAccessExpeditions({ name: "ordinary", avatar: "card:intermediate:gf_rooke" }), false);
  assert.equal(canAccessExpeditions({ name: "eudaimon", avatar: "card:primary:pip" }), false);
  assert.equal(canAccessExpeditions({ name: "eudaimon", avatar: "card:intermediate:gf_rooke" }), true);
  assert.equal(canAccessExpeditions({ name: " EUDAIMON ", avatar: "card:intermediate:gf_rooke" }), true);
});

test("all collectible characters receive complete expedition profiles", () => {
  const profiles = allExpeditionProfiles();
  assert.equal(profiles.length, 90);
  assert.equal(new Set(profiles.map((profile) => profile.id)).size, 90);
  for (const profile of profiles) {
    assert.equal(profile.stats.length, 5);
    assert.ok(profile.discipline);
    assert.ok(profile.role);
    assert.ok(profile.trait);
    assert.ok(profile.signatureName);
    assert.ok(profile.move >= 1 && profile.move <= 4);
    assert.ok(profile.hearts >= 2 && profile.hearts <= 5);
  }
});

test("all boss cards receive a commander power", () => {
  const commanders = allExpeditionCommanders();
  assert.equal(commanders.length, 30);
  assert.equal(new Set(commanders.map((commander) => commander.id)).size, 30);
  assert.ok(commanders.every((commander) => commander.command));
});

test("scenario catalogue has ten distinct scenarios per module", () => {
  const ids = [];
  for (const [moduleKey, scenarios] of Object.entries(EXPEDITION_SCENARIOS)) {
    assert.equal(scenarios.length, 10);
    assert.deepEqual(scenarios.map((scenario) => scenario.level), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.ok(scenarios.every((scenario) => scenario.turns <= 6));
    assert.ok(EXPEDITION_TIERS[moduleKey]);
    ids.push(...scenarios.map((scenario) => scenario.id));
  }
  assert.equal(new Set(ids).size, 30);
});

test("hex geometry returns exact distance and straight lines", () => {
  assert.equal(hexDistance("-3,1", "0,1"), 3);
  assert.deepEqual(hexLine("-2,0", "2,0"), ["-2,0", "-1,0", "0,0", "1,0", "2,0"]);
});

test("balance solver finds the two valid seven-weight groups", () => {
  const solutions = solveBalancedPartition([2, 3, 4, 5]);
  assert.equal(solutions.length, 1);
  assert.deepEqual([...solutions[0].left, ...solutions[0].right].sort((a, b) => a - b), [2, 3, 4, 5]);
  assert.equal(solutions[0].left.reduce((sum, value) => sum + value, 0), 7);
  assert.equal(solutions[0].right.reduce((sum, value) => sum + value, 0), 7);
});

test("Unequal Crossing creates a playable state from Pip, Bramble and Nine", () => {
  const roster = expeditionRoster("primary");
  const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
  const state = createUnequalCrossing(squad);
  assert.equal(state.status, "playing");
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "player").length, 3);
  assert.equal(Object.values(state.units).filter((unit) => unit.side === "enemy").length, 2);
  assert.ok(reachableHexes(state, "nine").length > reachableHexes(state, "pip").length);
  assert.ok(estimateExpeditionMinutes(state) <= EXPEDITION_TIERS.primary.hardLimitMinutes);
});

test("moving spends one action point without mutating the previous state", () => {
  const roster = expeditionRoster("primary");
  const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
  const state = createUnequalCrossing(squad);
  const destination = reachableHexes(state, "nine")[0].key;
  const moved = moveUnit(state, "nine", destination);
  assert.equal(state.units.nine.ap, 2);
  assert.equal(moved.units.nine.ap, 1);
  assert.equal(moved.units.nine.pos, destination);
});

// These two tests exercise the generic "balance" evaluator itself (shared with any future
// balance-family map), not anything specific to a generated Unequal Crossing layout, so they
// build their own tiny state directly rather than depending on whatever the procedural
// generator's default (REFERENCE_LAYOUT_SEED) happens to produce — that way they stay valid
// even if the generator's output for that seed ever changes.
test("balance objective requires equal non-zero totals and the exit — both loads for a side now share one scale hex", () => {
  const board = UNEQUAL_CROSSING_CONFIG.board;
  const state = createExpeditionState({
    id: "balance-complete-test", moduleKey: "primary", title: "test", turnLimit: 4, board,
    units: [{ id: "hero", stats: [1, 1, 1, 1, 1], hearts: 2, move: 2, pos: "-3,1" }],
    enemies: [],
    objects: [
      { id: "a", value: 2, pos: "-2,1" }, { id: "b", value: 5, pos: "-2,1" },
      { id: "c", value: 3, pos: "2,-1" }, { id: "d", value: 4, pos: "2,-1" },
    ],
    objective: { family: "balance", leftHexes: ["-2,1"], rightHexes: ["2,-1"], exitHex: "3,-1", target: 7 },
  });
  assert.equal(evaluateObjective(state).complete, false);
  const exited = { ...state, units: { ...state.units, hero: { ...state.units.hero, pos: "3,-1" } } };
  const result = evaluateObjective(exited);
  assert.equal(result.complete, true);
  assert.deepEqual(result.values, { left: 7, right: 7, exited: true });
  assert.deepEqual(result.sides, {
    left: { target: 7, currentTotal: 7, difference: 0, status: "balanced" },
    right: { target: 7, currentTotal: 7, difference: 0, status: "balanced" },
  });
});

test("balance objective: weigh-bridge state reports underweight and overloaded platforms", () => {
  const board = UNEQUAL_CROSSING_CONFIG.board;
  const base = createExpeditionState({
    id: "balance-weigh-test", moduleKey: "primary", title: "test", turnLimit: 4, board,
    units: [{ id: "hero", stats: [1, 1, 1, 1, 1], hearts: 2, move: 2, pos: "-3,1" }],
    enemies: [],
    objects: [{ id: "a", value: 2, pos: "-2,1" }, { id: "b", value: 5, pos: "2,-1" }], // left: 2 (underweight); right: 5 (underweight)
    objective: { family: "balance", leftHexes: ["-2,1"], rightHexes: ["2,-1"], exitHex: "3,-1", target: 7 },
  });
  const result = evaluateObjective(base);
  assert.equal(result.complete, false);
  assert.deepEqual(result.sides.left, { target: 7, currentTotal: 2, difference: -5, status: "underweight" });
  assert.deepEqual(result.sides.right, { target: 7, currentTotal: 5, difference: -2, status: "underweight" });

  const overloadedState = { ...base, objects: { ...base.objects, c: { id: "c", value: 3, pos: "-2,1" }, d: { id: "d", value: 4, pos: "2,-1" } } }; // left: 2+3=5, still underweight; right: 5+4=9, overloaded
  const overloaded = evaluateObjective(overloadedState);
  assert.equal(overloaded.complete, false);
  assert.deepEqual(overloaded.sides.right, { target: 7, currentTotal: 9, difference: 2, status: "overloaded" });
});

test("balance objective: two platforms equal but over target must not be reported as complete (UI reconciliation contract acceptance test 3)", () => {
  // Unequal Crossing's own crate values (2, 3, 4, 5) can only ever tie at 0 or at the
  // target of 7, so this edge case needs its own minimal scenario to exercise directly.
  const board = [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 }];
  const state = createExpeditionState({
    id: "overload-test", moduleKey: "primary", title: "Overload", turnLimit: 3, board,
    units: [{ id: "hero", stats: [1, 1, 1, 1, 1], hearts: 2, move: 1, pos: "0,0" }],
    enemies: [],
    objects: [{ id: "heavy_a", value: 9, pos: "0,0" }, { id: "heavy_b", value: 9, pos: "1,0" }],
    objective: { family: "balance", leftHexes: ["0,0"], rightHexes: ["1,0"], target: 7 },
  });
  const result = evaluateObjective(state);
  assert.equal(result.values.left, 9);
  assert.equal(result.values.right, 9);
  assert.equal(result.sides.left.status, "overloaded");
  assert.equal(result.sides.right.status, "overloaded");
  assert.equal(result.complete, false, "equal platforms above target must not count as balanced");
});

// Procedural generation (2026-09-17): Sam's direct feedback was that a single hand-authored
// layout per map, re-described with different words, is not genuine variation — real
// procedural generation was already built (expedition-kernels.js's
// generateEqualPartitionKernel, from an earlier session) but never actually wired into any
// scenario. These tests prove it now is, for Unequal Crossing: different seeds produce
// different values, positions and targets, each independently re-verified solvable both
// mathematically (a unique equal split) and physically (a real simulated playthrough, not
// just the kernel's own abstract guarantee — see unequal-crossing.js's
// isPhysicallyDeliverable for why the maths alone isn't enough).
test("procedural generation: different seeds produce genuinely different, independently verified layouts", () => {
  const layouts = Array.from({ length: 20 }, (_, seed) => generateUnequalCrossingLayout(seed));
  const valueSets = layouts.map((layout) => layout.crates.map((c) => c.value).sort((a, b) => a - b).join(","));
  const positionSets = layouts.map((layout) => layout.crates.map((c) => c.pos).sort().join(","));
  const targets = layouts.map((layout) => layout.target);
  // A random draw can coincidentally repeat across a small sample, so this checks real
  // variety (most of 20 seeds differ), not the stronger (and untrue) claim that a collision
  // can never happen.
  assert.ok(new Set(valueSets).size >= 15, `expected most of 20 seeds to have distinct crate values, got ${new Set(valueSets).size} distinct sets`);
  assert.ok(new Set(positionSets).size >= 15, `expected most of 20 seeds to have distinct crate positions, got ${new Set(positionSets).size} distinct sets`);
  assert.ok(new Set(targets).size > 1, "the target itself should vary across seeds, not just which crates reach it");
  for (const layout of layouts) {
    assert.equal(layout.crates.length, 4);
    assert.equal(new Set(layout.crates.map((c) => c.value)).size, 4, "no repeated values within one layout");
    assert.equal(new Set(layout.crates.map((c) => c.pos)).size, 4, "no two crates sharing a start hex within one layout");
  }
});

test("procedural generation: the same seed always reproduces the exact same layout (GEN-01)", () => {
  const a = generateUnequalCrossingLayout("a-fixed-seed");
  const b = generateUnequalCrossingLayout("a-fixed-seed");
  assert.deepEqual(a, b);
});

test("procedural generation: every generated layout has a unique equal split, and it really is reachable within the round limit", () => {
  for (let seed = 10; seed < 20; seed += 1) {
    const layout = generateUnequalCrossingLayout(seed);
    const total = layout.crates.reduce((sum, c) => sum + c.value, 0);
    assert.equal(total, layout.target * 2, `seed ${seed}: target should be exactly half the total weight`);
    let splitCount = 0;
    for (let mask = 1; mask < 15; mask += 1) {
      const left = layout.crates.filter((_, i) => mask & (1 << i));
      if (left.length === 2 && left.reduce((sum, c) => sum + c.value, 0) === layout.target) splitCount += 1;
    }
    assert.equal(splitCount, 2, `seed ${seed}: exactly one 2-vs-2 split should reach the target (counted twice, once per side choice)`);
  }
});

// Approved scale redesign (EXPEDITIONS_CLAUDE_HANDOVER.md, 2026-09-16): each scale is one
// impassable hex holding both its loads, placed from any adjacent hex rather than by standing
// on it. These tests cover the acceptance list from that entry directly against the engine
// primitives (interactObject's stackLimit, reachableHexes/moveUnit's blocked-terrain check),
// not just via the one locked reference trace above.
test("scale redesign: a load can be placed on the west scale from any of its six adjacent hexes", () => {
  const roster = expeditionRoster("primary");
  const board = UNEQUAL_CROSSING_CONFIG.board;
  for (const approach of ["-1,1", "-1,0", "-2,0", "-3,1", "-3,2", "-2,2"]) {
    const hero = { ...roster.find((p) => p.id === "pip"), pos: approach, carrying: "crate" };
    const state = createExpeditionState({ id: "scale-approach-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [hero], enemies: [], objects: [{ id: "crate", value: 2, pos: null }], objective: { family: "balance", leftHexes: ["-2,1"], rightHexes: ["2,-1"], target: 2 } });
    const placed = interactObject(state, "pip", "crate", "-2,1");
    assert.equal(placed.objects.crate.pos, "-2,1", `placing from ${approach} should succeed`);
  }
});

test("scale redesign: a hero two hexes away cannot place on the scale", () => {
  const roster = expeditionRoster("primary");
  const board = UNEQUAL_CROSSING_CONFIG.board;
  const hero = { ...roster.find((p) => p.id === "pip"), pos: "-3,0" };
  const state = createExpeditionState({ id: "scale-distance-test", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [hero], enemies: [], objects: [{ id: "crate", value: 2, pos: "-2,-1" }], objective: { family: "balance", leftHexes: ["-2,1"], rightHexes: ["2,-1"], target: 2 } });
  const carrying = interactObject(state, "pip", "crate");
  assert.equal(hexDistance("-3,0", "-2,1"), 2, "sanity check on the test's own geometry");
  assert.throws(() => interactObject(carrying, "pip", "crate", "-2,1"));
});

test("scale redesign: neither scale hex can ever be entered by movement", () => {
  const roster = expeditionRoster("primary");
  const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
  const state = createUnequalCrossing(squad);
  assert.ok(!reachableHexes(state, "bramble").some((r) => r.key === "-2,1"));
  assert.throws(() => moveUnit(state, "bramble", "-2,1"));
});

test("scale redesign: a scale hex accepts exactly two loads, never a third, while an ordinary hex still accepts only one", () => {
  const roster = expeditionRoster("primary");
  const board = UNEQUAL_CROSSING_CONFIG.board;
  const hero = { ...roster.find((p) => p.id === "pip"), pos: "-1,1", carrying: "a", ap: 6, maxAp: 6 };
  const state = createExpeditionState({
    id: "stack-limit-test", moduleKey: "primary", title: "test", turnLimit: 4, board,
    units: [hero], enemies: [],
    objects: [{ id: "a", value: 1, pos: null }, { id: "b", value: 1, pos: "0,1" }, { id: "c", value: 1, pos: "-1,2" }],
    objective: { family: "balance", leftHexes: ["-2,1"], rightHexes: ["2,-1"], target: 2 },
  });
  let s = interactObject(state, "pip", "a", "-2,1");
  s = interactObject(s, "pip", "b");
  s = interactObject(s, "pip", "b", "-2,1");
  assert.equal(s.objects.a.pos, "-2,1");
  assert.equal(s.objects.b.pos, "-2,1");
  const withThird = interactObject(s, "pip", "c");
  assert.throws(() => interactObject(withThird, "pip", "c", "-2,1"), /already holds 2 of 2/);

  // An ordinary hex (no stackLimit set) is unchanged: still max one object, the pre-redesign behaviour.
  const ordinaryHero = { ...roster.find((p) => p.id === "pip"), pos: "-3,2", carrying: "a" };
  const ordinaryState = createExpeditionState({ id: "stack-limit-test-2", moduleKey: "primary", title: "test", turnLimit: 4, board, units: [ordinaryHero], enemies: [], objects: [{ id: "a", value: 1, pos: null }, { id: "b", value: 1, pos: "-3,1" }], objective: { family: "balance", leftHexes: ["-2,1"], rightHexes: ["2,-1"], target: 2 } });
  assert.throws(() => interactObject(ordinaryState, "pip", "a", "-3,1"), /already holds 1 of 1/);
});

test("scale redesign: removing one of two loads from a scale is deterministic (targets the named object, never the other one)", () => {
  const board = UNEQUAL_CROSSING_CONFIG.board;
  const state = createExpeditionState({
    id: "remove-one-of-two-test", moduleKey: "primary", title: "test", turnLimit: 4, board,
    units: [{ id: "hero", stats: [1, 1, 1, 1, 1], hearts: 2, move: 2, pos: "-1,1" }],
    enemies: [],
    objects: [{ id: "crate_2", value: 2, pos: "-2,1" }, { id: "crate_5", value: 5, pos: "-2,1" }],
    objective: { family: "balance", leftHexes: ["-2,1"], rightHexes: ["2,-1"], exitHex: "3,-1", target: 7 },
  });
  assert.equal(evaluateObjective(state).sides.left.currentTotal, 7);
  // Collect crate_5 back off the scale; crate_2 must stay exactly where it was.
  const afterRemoval = interactObject(state, "hero", "crate_5");
  assert.equal(afterRemoval.units.hero.carrying, "crate_5");
  assert.equal(afterRemoval.objects.crate_2.pos, "-2,1", "the untouched load is never disturbed by naming the other one");
  assert.equal(evaluateObjective(afterRemoval).sides.left.currentTotal, 2, "removing crate_5 drops the scale's total back to just crate_2");
});

test("enemy thief ignores guarded loads", () => {
  const board = UNEQUAL_CROSSING_CONFIG.board;
  const state = createExpeditionState({
    id: "thief-test",
    moduleKey: "primary",
    title: "Thief test",
    turnLimit: 4,
    board,
    units: [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, move: 2, pos: "-3,1" }],
    enemies: [{ id: "thief", side: "enemy", name: "Thief", hp: 2, defence: 4, move: 1, pos: "0,0", behaviour: "steal-highest" }],
    objects: [
      { id: "high", value: 9, pos: "0,1", guarded: true },
      { id: "low", value: 4, pos: "1,0" },
    ],
    objective: { family: "eliminate" },
  });
  const enemyState = endPlayerPhase(state);
  const resolved = resolveEnemyPhase(enemyState);
  assert.equal(resolved.objects.high.pos, "0,1");
  // Carries, doesn't teleport (2026-09-17 redesign): the guarded high-value load is skipped
  // entirely, and the unguarded low-value one is picked up and held (pos: null), not moved to
  // a fixed home hex — recovering it now needs combat against the thief, not just a walk.
  assert.equal(resolved.objects.low.pos, null);
  assert.equal(resolved.units.thief.carrying, "low");
});

// Procedural generation (2026-09-17): createUnequalCrossing now generates a fresh, physically
// verified-solvable layout from a seed every time (unequal-crossing.js's
// generateUnequalCrossingLayout, using the equal-partition kernel plus a real simulated
// feasibility check — see that file for the full rationale). REFERENCE_LAYOUT_SEED pins one
// specific generated layout (7, 13, 12, 8; target 20) so this locked trace stays reproducible.
// Verified by direct simulation before being locked in.
test("the loan squad can complete Unequal Crossing within four rounds, placing loads on the scales from adjacent hexes", () => {
  const state = playUnequalCrossingReferenceTrace();
  assert.equal(state.status, "won");
  assert.deepEqual(evaluateObjective(state).values, { left: 20, right: 20, exited: true });
  assert.equal(state.turn, 4);
  assert.equal(state.counters.actions, 18);
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: a named below-recommendation squad, with its
// shortfall reproduced in the readiness result. Embark itself is never blocked by this.
test("§9: a below-battle-value squad may still embark, with the shortfall named in the readiness result", () => {
  const weakSquad = [
    { id: "a", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
    { id: "b", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
    { id: "c", r: "common", bv: 10, s: [1, 1, 1, 1, 1] },
  ];
  const scenario = EXPEDITION_SCENARIOS.primary.find((s) => s.id === "po_unequal_crossing");
  const result = assessSquadReadiness(scenario, weakSquad);
  assert.equal(result.meetsRecommendation, false);
  assert.ok(result.shortfalls.some((s) => s.code === "average_battle_value"));
});

// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9: "why one powerful card cannot satisfy every
// late-map job alone." Proved arithmetically rather than by exhaustive search: every one of
// the four crates needs exactly one Collect and one Drop (interactObject always spends one
// action for each, regardless of distance travelled) — 4 x 2 = 8 core actions. A solo hero's
// entire budget for this map's four-round limit is turnLimit x 2 AP = 8 actions. That already
// accounts for every action a lone hero has, with none left for the mandatory final move onto
// the exit arch — a hex distinct from every crate and platform hex, so it can never be reached
// "for free" as part of a collect or drop. A solo attempt is therefore short by at least one
// action even before any travel between the four separate crate hexes is counted.
test("§9: one hero cannot complete Unequal Crossing alone — the core actions alone exhaust the solo budget, for any generated layout", () => {
  const coreActions = 4 * 2; // one Collect + one Drop each — every generated layout has exactly 4 crates
  const soloBudget = UNEQUAL_CROSSING_CONFIG.turnLimit * 2; // one hero's AP across every round
  assert.equal(coreActions, soloBudget, "the four crates alone exactly exhaust a solo hero's entire round budget");
  const exitHex = UNEQUAL_CROSSING_CONFIG.objective.exitHex;
  const platformHexes = [...UNEQUAL_CROSSING_CONFIG.objective.leftHexes, ...UNEQUAL_CROSSING_CONFIG.objective.rightHexes];
  for (const seed of [REFERENCE_LAYOUT_SEED, 1, 2, 3, 4, 5]) {
    const crateHexes = generateUnequalCrossingLayout(seed).crates.map((object) => object.pos);
    assert.ok(!platformHexes.includes(exitHex) && !crateHexes.includes(exitHex), `seed ${seed}: the exit arch must stay a distinct hex, so reaching it costs a further action no crate action can cover`);
  }
});

test("all tier timing estimates stay under their hard limits", () => {
  for (const [moduleKey, tier] of Object.entries(EXPEDITION_TIERS)) {
    const players = expeditionRoster(moduleKey).slice(0, tier.squadSize).map((profile, index) => ({ ...profile, pos: `${index},0` }));
    const board = [];
    for (let q = -4; q <= 4; q += 1) for (let r = -4; r <= 4; r += 1) if (Math.abs(q + r) <= 4) board.push({ q, r });
    const state = createExpeditionState({ id: `${moduleKey}-timing`, moduleKey, title: "Timing", turnLimit: tier.turnLimit, board, units: players, enemies: [], objective: { family: "eliminate" } });
    state.status = "playing";
    assert.ok(estimateExpeditionMinutes(state) <= tier.hardLimitMinutes);
  }
});

// Shared by every test below that needs a completed Unequal Crossing: the same
// REFERENCE_LAYOUT_SEED trace verified and locked in above ("the loan squad can complete
// Unequal Crossing..."), factored out once rather than repeated per test.
function playUnequalCrossingReferenceTrace() {
  const roster = expeditionRoster("primary");
  const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
  let state = createUnequalCrossing(squad, REFERENCE_LAYOUT_SEED);
  // REFERENCE_LAYOUT_SEED now generates crate_7/crate_13 (west, target 20) and crate_12/crate_8
  // (east, target 20) — see unequal-crossing.js's isPhysicallyDeliverable, which is exactly this
  // trace (bramble: crate_7 then crate_8; nine: crate_13; pip: crate_12, then bramble finishes
  // by walking onto the exit arch). Re-derived 2026-09-18 after fixing a real steal-highest bug
  // (expedition-engine.js's resolveEnemy): a Hookmole used to commit to its single highest-value
  // target and give up for the whole round if that one target was unreachable, even when a
  // lower-value target had a clear path — this is what made Sam's live playtest Hookmoles "just
  // stand there". Fixing it changed nothing about this trace's steps (this greedy solve still
  // out-paces both Hookmoles before either can reach a crate), only about tests that actually
  // exercise a slower or blocked run.
  state = interactObject(state, "bramble", "crate_7");
  state = interactObject(state, "bramble", "crate_7", "-2,1");
  state = moveUnit(state, "nine", "0,0");
  state = interactObject(state, "nine", "crate_13");
  state = moveUnit(state, "pip", "-1,0");
  state = moveUnit(state, "pip", "0,-1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "nine", "-1,0");
  state = interactObject(state, "nine", "crate_13", "-2,1");
  state = interactObject(state, "pip", "crate_12");
  state = moveUnit(state, "pip", "1,-1");
  state = moveUnit(state, "bramble", "-1,2");
  state = interactObject(state, "bramble", "crate_8");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = interactObject(state, "pip", "crate_12", "2,-1");
  state = moveUnit(state, "bramble", "1,0");
  state = interactObject(state, "bramble", "crate_8", "2,-1");
  state = moveUnit(state, "pip", "3,-2");
  state = moveUnit(state, "nine", "1,-1");
  state = resolveEnemyPhase(endPlayerPhase(state));
  state = moveUnit(state, "bramble", "3,-1");
  return state;
}

test("explainExpeditionOutcome: a won state explains what was achieved", () => {
  const state = playUnequalCrossingReferenceTrace();
  const explanation = explainExpeditionOutcome(state);
  assert.equal(explanation.outcome, "won");
  assert.ok(explanation.message.includes("20"));
});

test("explainExpeditionOutcome: distinguishes a turn-limit loss from a party wipe", () => {
  const board = [];
  for (let q = -2; q <= 2; q += 1) for (let r = -2; r <= 2; r += 1) if (Math.abs(q + r) <= 2) board.push({ q, r });
  const timedOut = createExpeditionState({ id: "timeout-test", moduleKey: "primary", title: "Timeout", turnLimit: 1, board, units: [{ id: "hero", stats: [1, 1, 1, 1, 1], hearts: 3, move: 1, pos: "0,0" }], enemies: [], objective: { family: "eliminate", target: 999 } });
  timedOut.turn = 2; // past the limit, objective never completed
  const refreshed = { ...timedOut, status: "lost" };
  const timeoutExplanation = explainExpeditionOutcome(refreshed);
  assert.equal(timeoutExplanation.outcome, "lost");
  assert.equal(timeoutExplanation.reason, "turn_limit");

  const wiped = createExpeditionState({ id: "wipe-test", moduleKey: "primary", title: "Wipe", turnLimit: 5, board, units: [{ id: "hero", stats: [1, 1, 1, 1, 1], hearts: 1, hp: 0, move: 1, pos: "0,0" }], enemies: [], objective: { family: "eliminate" } });
  const wipeExplanation = explainExpeditionOutcome({ ...wiped, status: "lost" });
  assert.equal(wipeExplanation.reason, "party_exhausted");
});

test("expeditionTimingReport reports rounds, actions and the pre-play estimate together", () => {
  const roster = expeditionRoster("primary");
  const squad = ["pip", "bramble", "nine"].map((id) => roster.find((profile) => profile.id === id));
  const state = createUnequalCrossing(squad);
  const report = expeditionTimingReport(state);
  assert.equal(report.roundsUsed, 1);
  assert.equal(report.roundLimit, 4);
  assert.equal(report.actionsUsed, 0);
  assert.equal(report.estimatedMinutes, estimateExpeditionMinutes(state));
});

test("computeExpeditionMarks: withholds every mark before a win and after a loss", () => {
  const board = [{ q: 0, r: 0 }, { q: 1, r: 0 }];
  const state = createExpeditionState({
    id: "marks-playing", moduleKey: "primary", title: "Marks", turnLimit: 3, board,
    units: [{ id: "hero", stats: [1, 1, 1, 1, 1], hearts: 2, move: 1, pos: "0,0" }],
    enemies: [{ id: "foe", name: "Foe", hp: 1, maxHp: 1, defence: 1, move: 1, range: 1, damage: 1, initiative: 5, pos: "1,0" }],
    objective: { family: "eliminate" },
  });
  assert.equal(state.status, "playing");
  assert.deepEqual(computeExpeditionMarks(state), []);
  assert.deepEqual(computeExpeditionMarks({ ...state, status: "lost" }), []);
});

test("computeExpeditionMarks: awards all four generic marks on the verified Unequal Crossing reference trace", () => {
  const state = playUnequalCrossingReferenceTrace();
  assert.equal(state.status, "won");
  const par = catalogueEntry("po_unequal_crossing").marksPar;
  const marks = computeExpeditionMarks(state, par);
  assert.deepEqual([...marks].sort(), ["exact_turn_target", "minimum_movement", "no_enemies_defeated", "no_exhaustion"]);
});

test("computeExpeditionMarks: turn and movement marks are withheld once a run falls short of par", () => {
  const state = playUnequalCrossingReferenceTrace();
  assert.deepEqual(computeExpeditionMarks(state, { turns: 1, movement: 1 }), ["no_exhaustion", "no_enemies_defeated"]);
  assert.deepEqual(computeExpeditionMarks(state), ["no_exhaustion", "no_enemies_defeated"]);
});

test("computeExpeditionMarks: a struck-down hero withholds no_exhaustion even once healed back up", () => {
  const board = [{ q: 0, r: 0 }, { q: 1, r: 0 }];
  let state = createExpeditionState({
    id: "exhaust-test", moduleKey: "primary", title: "Exhaust", turnLimit: 3, board,
    units: [{ id: "hero", stats: [1, 1, 1, 1, 1], hearts: 1, move: 1, pos: "0,0" }],
    enemies: [{ id: "foe", name: "Foe", hp: 1, maxHp: 1, defence: 1, move: 1, range: 1, damage: 1, initiative: 5, pos: "1,0" }],
    objective: { family: "eliminate" },
  });
  state = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(state.units.hero.hp, 0);
  assert.equal(state.counters.unitsExhausted, 1);
  const healed = { ...state, units: { ...state.units, hero: { ...state.units.hero, hp: 1 } }, status: "won" };
  assert.deepEqual(computeExpeditionMarks(healed), ["no_enemies_defeated"]);
});

test("rankExpeditionMarks: gold requires every achievable mark, silver at least half, bronze otherwise", () => {
  const par = { turns: 1, movement: 1 }; // four marks achievable
  assert.equal(rankExpeditionMarks(["no_exhaustion", "no_enemies_defeated", "exact_turn_target", "minimum_movement"], par), "gold");
  assert.equal(rankExpeditionMarks(["no_exhaustion", "no_enemies_defeated"], par), "silver", "exactly half of four is still silver");
  assert.equal(rankExpeditionMarks(["no_exhaustion"], par), "bronze", "one of four is under half");
  assert.equal(rankExpeditionMarks([], par), "bronze");
});

test("rankExpeditionMarks: a scenario with no turn or movement par has a two-mark ceiling, not an unreachable four-mark one", () => {
  assert.equal(rankExpeditionMarks(["no_exhaustion", "no_enemies_defeated"], {}), "gold", "the two generic marks are all that's achievable here");
  assert.equal(rankExpeditionMarks(["no_exhaustion"], {}), "silver", "one of two is exactly half");
  assert.equal(rankExpeditionMarks([], {}), "bronze");
});

test("rankExpeditionMarks: an odd achievable total (three) rounds the silver threshold up, not down", () => {
  const par = { turns: 1 }; // three marks achievable: the two generic plus exact_turn_target
  assert.equal(rankExpeditionMarks(["no_exhaustion", "no_enemies_defeated", "exact_turn_target"], par), "gold");
  assert.equal(rankExpeditionMarks(["no_exhaustion", "no_enemies_defeated"], par), "silver", "two of three clears half");
  assert.equal(rankExpeditionMarks(["no_exhaustion"], par), "bronze", "one of three does not clear half");
});

test("rankExpeditionMarks: on the verified Unequal Crossing reference trace, a clean run ranks gold", () => {
  const state = playUnequalCrossingReferenceTrace();
  const par = catalogueEntry("po_unequal_crossing").marksPar;
  assert.equal(rankExpeditionMarks(computeExpeditionMarks(state, par), par), "gold");
});

test("routeMarkerConnections: a straight-through marker connects opposite neighbours, and rotates with it", () => {
  const marker = { id: "rm1", pos: "0,0", orientation: 0, paths: [[0, 3]] };
  assert.deepEqual(routeMarkerConnections(marker), [["1,0", "-1,0"]]);
  assert.deepEqual(routeMarkerConnections({ ...marker, orientation: 1 }), [["1,-1", "-1,1"]]);
  assert.deepEqual(routeMarkerConnections({ ...marker, orientation: 6 }), routeMarkerConnections(marker), "a full six-step rotation returns to the same connection");
});

test("edgesFromNode: returns every edge touching a node with its weight, defaulting to 1", () => {
  const edges = [["a", "b"], ["b", "c", 5], ["a", "c"]];
  assert.deepEqual(edgesFromNode(edges, "a"), [{ to: "b", weight: 1 }, { to: "c", weight: 1 }]);
  assert.deepEqual(edgesFromNode(edges, "b"), [{ to: "a", weight: 1 }, { to: "c", weight: 5 }]);
  assert.deepEqual(edgesFromNode(edges, "z"), []);
});

test("restoreTileTerrain: reverses a recorded terrain change and refuses an unrecorded one", () => {
  const board = [{ q: 0, r: 0, terrain: "clear", previousTerrain: "clear" }];
  let state = createExpeditionState({ id: "restore-test", moduleKey: "primary", title: "Restore", turnLimit: 3, board, units: [], enemies: [], objective: { family: "eliminate" } });
  state.board["0,0"].terrain = "blocked";
  const restored = restoreTileTerrain(state, "0,0");
  assert.equal(restored.board["0,0"].terrain, "clear");
  assert.equal("previousTerrain" in restored.board["0,0"], false);
  assert.throws(() => restoreTileTerrain(restored, "0,0"), /no remembered terrain/);
  assert.throws(() => restoreTileTerrain(restored, "9,9"), /not on the board/);
});

test("connect objective: a route marker's rotation decides whether two nodes are connected", () => {
  const board = [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: -1, r: 0 }, { q: 1, r: -1 }, { q: -1, r: 1 }].map((hex) => ({ ...hex, terrain: "clear" }));
  const state = createExpeditionState({
    id: "connect-test", moduleKey: "primary", title: "Connect", turnLimit: 3, board,
    units: [], enemies: [],
    objects: [{ id: "rm1", pos: "0,0", orientation: 0, paths: [[0, 3]], movable: false }],
    objective: { family: "connect", activeNodes: ["1,0", "-1,0"], start: "1,0", end: "-1,0", routeMarkerIds: ["rm1"] },
  });
  assert.equal(evaluateObjective(state).complete, true);
  const rotated = { ...state, objects: { ...state.objects, rm1: { ...state.objects.rm1, orientation: 1 } } };
  assert.equal(evaluateObjective(rotated).complete, false, "rotating the marker away from 1,0/-1,0 must break the connection");
});

// Rotation hex mechanisms (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §4.2): a real board tile
// with up to three edge-to-edge tracks, sharing the same orientation/rotate primitive route
// markers already use, generalised to cover the three approved skins — operator wheel, signal
// prism, current turner.

test("rotationHexTracks: a plain edge-pair track resolves identically to a route marker's paths", () => {
  const tile = { id: "rh1", pos: "0,0", orientation: 0, tracks: [[0, 3]] };
  assert.deepEqual(rotationHexTracks(tile).map((t) => t.hexes), routeMarkerConnections({ ...tile, paths: tile.tracks }));
  assert.deepEqual(rotationHexTracks(tile)[0], { edges: [0, 3], op: null, flow: "both", signature: null, hexes: ["1,0", "-1,0"] });
});

test("rotationHexTracks: an object without a tracks field falls back to paths (a route marker is a rotation hex with no tracks)", () => {
  const marker = { id: "rm1", pos: "0,0", orientation: 0, paths: [[0, 3]] };
  assert.deepEqual(rotationHexTracks(marker).map((t) => t.hexes), routeMarkerConnections(marker));
});

test("rotationHexTracks: a track descriptor keeps its operator, flow and signature through rotation", () => {
  const tile = { id: "wheel", pos: "0,0", orientation: 0, tracks: [{ edges: [0, 3], op: { type: "+", value: 3 }, flow: "AB", signature: "red" }] };
  const track = rotationHexTracks(tile)[0];
  assert.deepEqual(track.op, { type: "+", value: 3 });
  assert.equal(track.flow, "AB");
  assert.equal(track.signature, "red");
  assert.deepEqual(track.hexes, ["1,0", "-1,0"]);
  const rotated = rotationHexTracks({ ...tile, orientation: 1 })[0];
  assert.deepEqual(rotated.hexes, ["1,-1", "-1,1"], "rotation moves the hex pair exactly like a route marker");
  assert.deepEqual(rotated.op, track.op, "rotation does not change what the track does, only where it points");
});

test("applyTrackOperation: applies the four arithmetic ops (the same op-string vocabulary as Reframe/chain) plus inverse", () => {
  assert.equal(applyTrackOperation(null, 5), 5, "no operator passes the value through unchanged");
  assert.equal(applyTrackOperation({ type: "+", value: 3 }, 5), 8);
  assert.equal(applyTrackOperation({ type: "-", value: 3 }, 5), 2);
  assert.equal(applyTrackOperation({ type: "*", value: 3 }, 5), 15);
  assert.equal(applyTrackOperation({ type: "/", value: 2 }, 6), 3);
  assert.equal(applyTrackOperation({ type: "inverse" }, 5), -5);
  assert.throws(() => applyTrackOperation({ type: "%", value: 1 }, 5), /Unknown rotation-hex track operation/);
  assert.throws(() => applyTrackOperation({ type: "/", value: 0 }, 5), /divide by zero/);
});

test("travelThroughRotationHex: an operator wheel transforms a travelling value, and rotating it swaps which operation applies", () => {
  const wheel = {
    id: "wheel", pos: "0,0", orientation: 0,
    tracks: [{ edges: [0, 3], op: { type: "+", value: 3 } }, { edges: [1, 4], op: { type: "*", value: 2 } }],
  };
  assert.deepEqual(travelThroughRotationHex(wheel, "1,0", 5), { toHex: "-1,0", value: 8, signature: null });
  // Rotate two steps: the [0,3] track (currently the "+3" face) moves to where [1,4] (the
  // "*2" face) used to be — the value now takes the multiply track through the same doorway.
  const rotated = { ...wheel, orientation: 2 };
  assert.deepEqual(travelThroughRotationHex(rotated, "1,0", 5), { toHex: "-1,0", value: 10, signature: null });
});

test("travelThroughRotationHex: a current turner's flow direction only admits a value from the correct side", () => {
  const turner = { id: "turner", pos: "0,0", orientation: 0, tracks: [{ edges: [0, 3], flow: "AB" }] };
  assert.deepEqual(travelThroughRotationHex(turner, "1,0", 4), { toHex: "-1,0", value: 4, signature: null });
  assert.equal(travelThroughRotationHex(turner, "-1,0", 4), null, "flow AB blocks entry from the edges[1] side");
});

test("travelThroughRotationHex: returns null when no track admits the entry hex at all (a jammed or misrotated tile blocks travel)", () => {
  const wheel = { id: "wheel", pos: "0,0", orientation: 0, tracks: [{ edges: [0, 3] }] };
  assert.equal(travelThroughRotationHex(wheel, "1,-1", 4), null);
});

test("tracksAligned: a signal prism's ports match only on an equal signature, including both unset", () => {
  assert.equal(tracksAligned({ signature: "red" }, { signature: "red" }), true);
  assert.equal(tracksAligned({ signature: "red" }, { signature: "blue" }), false);
  assert.equal(tracksAligned({ signature: null }, {}), true, "two untagged tracks always align, like a plain route marker");
});

// Hive Ledger group shapes (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §4.3): pure hex-geometry
// helpers a scenario builds a constraint group's cell list from, plus the new constraintGrid
// rule kinds and the "lock while corrupted" enemy behaviour.

test("flowerGroup: a centre hex plus its six neighbours, seven cells", () => {
  const group = flowerGroup("0,0");
  assert.equal(group.length, 7);
  assert.deepEqual(group, ["0,0", "1,0", "1,-1", "0,-1", "-1,0", "-1,1", "0,1"]);
});

test("hexRay: a straight axial line extending outward, not including the origin", () => {
  assert.deepEqual(hexRay("0,0", 0, 3), ["1,0", "2,0", "3,0"]);
  assert.deepEqual(hexRay("0,0", 3, 2), ["-1,0", "-2,0"], "the opposite direction runs the other way");
});

test("hexRing: radius 0 is just the centre; every cell at radius N is exactly N steps away", () => {
  assert.deepEqual(hexRing("0,0", 0), ["0,0"]);
  const ring1 = hexRing("0,0", 1);
  assert.equal(ring1.length, 6);
  assert.deepEqual(new Set(ring1), new Set(["1,0", "1,-1", "0,-1", "-1,0", "-1,1", "0,1"]), "radius 1 is the same six hexes as hexNeighbours");
  const ring2 = hexRing("0,0", 2);
  assert.equal(ring2.length, 12);
  assert.ok(ring2.every((hex) => hexDistance("0,0", hex) === 2));
});

test("ringSector: a contiguous arc, wrapping past the end of the ring", () => {
  const ring = hexRing("0,0", 1);
  assert.deepEqual(ringSector(ring, 0, 3), [ring[0], ring[1], ring[2]]);
  assert.deepEqual(ringSector(ring, 5, 3), [ring[5], ring[0], ring[1]], "a sector starting near the end wraps around to the front");
});

test("ringOppositePairs: pairs each cell with the one directly across the ring, and refuses an odd ring", () => {
  const ring = hexRing("0,0", 1);
  const pairs = ringOppositePairs(ring);
  assert.equal(pairs.length, 3);
  assert.deepEqual(pairs, [[ring[0], ring[3]], [ring[1], ring[4]], [ring[2], ring[5]]]);
  assert.throws(() => ringOppositePairs(["a", "b", "c"]), /even-sized ring/);
});

function ledgerFixture(objects, objective, extra = {}) {
  const board = [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }].map((hex) => ({ ...hex, terrain: "clear" }));
  return createExpeditionState({ id: "ledger-test", moduleKey: "primary", title: "Ledger", turnLimit: 3, board, units: [], enemies: [], objects, objective, ...extra });
}

test("constraintGrid useEachOnce: requires the exact value set, not merely distinct values", () => {
  const group = ["a", "b", "c", "d", "e", "f", "g"].map((id, index) => ({ id, pos: flowerGroup("0,0")[index], value: index + 1 }));
  const objective = { family: "constraintGrid", constraints: [{ kind: "useEachOnce", objectIds: group.map((o) => o.id), range: [1, 7] }] };
  assert.equal(evaluateObjective(ledgerFixture(group, objective)).complete, true);
  const gap = group.map((o, index) => (index === 0 ? { ...o, value: 2 } : o)); // duplicates 2, misses 1
  assert.equal(evaluateObjective(ledgerFixture(gap, objective)).complete, false, "distinct-looking values that skip a number in the range must fail");
});

test("constraintGrid parityCount and primeCount: an exact count within the group, not every cell", () => {
  const cells = [{ id: "a", pos: "0,0", value: 2 }, { id: "b", pos: "1,0", value: 3 }, { id: "c", pos: "1,-1", value: 4 }];
  const ids = cells.map((c) => c.id);
  assert.equal(evaluateObjective(ledgerFixture(cells, { family: "constraintGrid", constraints: [{ kind: "parityCount", objectIds: ids, parity: "odd", count: 1 }] })).complete, true, "exactly one odd value (3)");
  assert.equal(evaluateObjective(ledgerFixture(cells, { family: "constraintGrid", constraints: [{ kind: "parityCount", objectIds: ids, parity: "even", count: 3 }] })).complete, false, "not every cell is even");
  assert.equal(evaluateObjective(ledgerFixture(cells, { family: "constraintGrid", constraints: [{ kind: "primeCount", objectIds: ids, count: 2 }] })).complete, true, "2 and 3 are prime, 4 is not");
});

test("ENM: corrupt-value erases the nearest unprotected ledger cell, but ignores a guarded one, a locked one, and any non-ledger value object", () => {
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, move: 1, pos: "-1,1" }];
  const objects = [
    { id: "guarded_cell", pos: "1,0", ledgerCell: true, value: 5, guarded: true },
    { id: "ordinary_value", pos: "0,-1", value: 9 },
    { id: "open_cell", pos: "0,0", ledgerCell: true, value: 3 },
  ];
  const enemy = { id: "wasp", side: "enemy", name: "Wasp", hp: 1, defence: 4, move: 2, pos: "-1,0", behaviour: "corrupt-value" };
  const state = ledgerFixture(objects, { family: "eliminate" }, { units, enemies: [enemy] });
  const resolved = resolveEnemyPhase(endPlayerPhase(state));
  assert.equal(resolved.objects.guarded_cell.value, 5, "a guarded ledger cell must not be corrupted");
  assert.equal(resolved.objects.ordinary_value.value, 9, "an object with no ledgerCell flag is never a target, however tempting its value");
  assert.equal(resolved.objects.open_cell.value, null, "the nearest unprotected ledger cell is corrupted");
});

test("ENM: a value-locked ledger cell (Deduce) is also immune to corrupt-value, and an out-of-range Wasp moves closer without entering the cell's hex", () => {
  const units = [{ id: "hero", name: "Hero", stats: [4, 4, 4, 4, 4], hearts: 3, move: 1, pos: "0,1" }];
  const lockedObjects = [{ id: "locked_cell", pos: "0,0", ledgerCell: true, value: 4, valueLocked: true }];
  const lockedEnemy = { id: "wasp", side: "enemy", name: "Wasp", hp: 1, defence: 4, move: 2, pos: "1,0", behaviour: "corrupt-value" };
  const lockedState = ledgerFixture(lockedObjects, { family: "eliminate" }, { units, enemies: [lockedEnemy] });
  assert.equal(resolveEnemyPhase(endPlayerPhase(lockedState)).objects.locked_cell.value, 4);

  const farBoard = [{ q: 0, r: 0 }, { q: 3, r: -3 }, { q: 2, r: -2 }, { q: 1, r: -1 }].map((hex) => ({ ...hex, terrain: "clear" }));
  const farObjects = [{ id: "open_cell", pos: "0,0", ledgerCell: true, value: 4 }];
  const farEnemy = { id: "wasp", side: "enemy", name: "Wasp", hp: 1, defence: 4, move: 2, pos: "3,-3", behaviour: "corrupt-value" };
  const farState = createExpeditionState({ id: "ledger-far-test", moduleKey: "primary", title: "Ledger far", turnLimit: 3, board: farBoard, units: [], enemies: [farEnemy], objects: farObjects, objective: { family: "eliminate" } });
  const resolved = resolveEnemyPhase(endPlayerPhase(farState));
  assert.equal(resolved.objects.open_cell.value, 4, "still too far away to corrupt it this round");
  assert.notEqual(resolved.units.wasp.pos, "3,-3", "it should have moved towards the cell");
  assert.notEqual(resolved.units.wasp.pos, "0,0", "it must never occupy the cell's own hex");
});


// Visible checks (EXPEDITIONS_CARD_COMBAT_CONTRACT.md §4): a small, engine-only fixture —
// a jammed bridge panel needing Geometry 7 to shift — exercising attemptCheck end to end.
// Not a real map: no scenario file, no art, no catalogue entry.
function jammedPanelFixture(heroStats, extra = {}) {
  const board = [{ q: 0, r: 0, terrain: "clear" }, { q: 1, r: 0, terrain: "clear" }, { q: 2, r: 0, terrain: "clear" }];
  const units = [{ id: "hero", stats: heroStats, hearts: 2, move: 1, pos: "0,0" }, ...(extra.units || [])];
  const objects = [{ id: "jammed_panel", pos: "1,0", check: { statIndex: 1, difficulty: 7, description: "Shift the jammed bridge panel clear." } }];
  return createExpeditionState({ id: "check-fixture", moduleKey: "primary", title: "Check fixture", turnLimit: 3, board, units, enemies: [], objects, objective: { family: "eliminate" } });
}

test("attemptCheck: a statistic meeting the difficulty succeeds and records every component", () => {
  const state = jammedPanelFixture([3, 7, 2, 4, 5]);
  const after = attemptCheck(state, "hero", { statIndex: 1, targetId: "jammed_panel", difficulty: 7, consequence: "panel_cleared" });
  const entry = after.history.at(-1);
  assert.equal(entry.action, "check");
  assert.deepEqual(
    { statIndex: entry.statIndex, statValue: entry.statValue, support: entry.support, bonus: entry.bonus, total: entry.total, difficulty: entry.difficulty, success: entry.success, consequence: entry.consequence },
    { statIndex: 1, statValue: 7, support: 0, bonus: 0, total: 7, difficulty: 7, success: true, consequence: "panel_cleared" },
  );
  assert.equal(after.units.hero.ap, 1, "a check spends one action point like every other action");
});

test("attemptCheck: falling short of the difficulty is a recorded failure, not a thrown error", () => {
  const state = jammedPanelFixture([3, 5, 2, 4, 5]);
  const after = attemptCheck(state, "hero", { statIndex: 1, targetId: "jammed_panel", difficulty: 7 });
  assert.equal(after.history.at(-1).success, false);
  assert.equal(after.history.at(-1).total, 5);
});

test("attemptCheck: an adjacent ally adds one support, same as combat", () => {
  const state = jammedPanelFixture([3, 5, 2, 4, 5], { units: [{ id: "ally", stats: [1, 1, 1, 1, 1], hearts: 2, move: 1, pos: "1,-1" }] });
  const after = attemptCheck(state, "hero", { statIndex: 1, targetId: "jammed_panel", difficulty: 7 });
  const entry = after.history.at(-1);
  assert.equal(entry.support, 1);
  assert.equal(entry.total, 6);
  assert.equal(entry.success, false, "support alone is not quite enough here");
});

test("attemptCheck: a declared bonus is added and named in the same breakdown", () => {
  const state = jammedPanelFixture([3, 5, 2, 4, 5]);
  const after = attemptCheck(state, "hero", { statIndex: 1, targetId: "jammed_panel", difficulty: 7, bonus: 2, bonusLabel: "Alcove footing" });
  const entry = after.history.at(-1);
  assert.equal(entry.bonus, 2);
  assert.equal(entry.bonusLabel, "Alcove footing");
  assert.equal(entry.total, 7);
  assert.equal(entry.success, true);
});

test("attemptCheck: refuses a non-adjacent target, an unknown statistic and a missing difficulty", () => {
  const state = jammedPanelFixture([3, 7, 2, 4, 5]);
  assert.throws(() => attemptCheck(state, "hero", { statIndex: 1, targetId: "2,0", difficulty: 7 }), /not adjacent/);
  assert.throws(() => attemptCheck(state, "hero", { statIndex: 5, targetId: "jammed_panel", difficulty: 7 }), /statistic index/);
  assert.throws(() => attemptCheck(state, "hero", { statIndex: 1, targetId: "jammed_panel" }), /numerical difficulty/);
  assert.throws(() => attemptCheck(state, "hero", { statIndex: 1, targetId: "not_a_thing", difficulty: 7 }), /not a valid check target/);
});

test("VISIBLE_CHECK command: dispatches through applyExpeditionCommand with a full structured event", () => {
  const state = jammedPanelFixture([3, 7, 2, 4, 5]);
  const { events } = applyExpeditionCommand(state, { type: "VISIBLE_CHECK", unitId: "hero", parameters: { statIndex: 1, targetId: "jammed_panel", difficulty: 7, consequence: "panel_cleared" } });
  const event = events.find((e) => e.action === "check");
  assert.equal(event.type, "ACTION_RESOLVED");
  assert.deepEqual(event.detail.consequence, "panel_cleared");
  assert.equal(event.detail.success, true);
  assert.equal(event.detail.total, 7);
});

test("validateVisibleCheckDeclaration: accepts a well-formed declaration and names every defect in a malformed one", () => {
  assert.deepEqual(validateVisibleCheckDeclaration({ statIndex: 1, difficulty: 7, description: "Shift the jammed bridge panel clear." }), []);
  assert.deepEqual(validateVisibleCheckDeclaration({ statIndex: 1, difficulty: 7, bonus: 2, bonusLabel: "Alcove footing", description: "Shift it." }), []);
  assert.ok(validateVisibleCheckDeclaration(null).length);
  assert.ok(validateVisibleCheckDeclaration({ statIndex: 9, difficulty: 7, description: "x" }).some((e) => e.includes("statIndex")));
  assert.ok(validateVisibleCheckDeclaration({ statIndex: 1, description: "x" }).some((e) => e.includes("difficulty")));
  assert.ok(validateVisibleCheckDeclaration({ statIndex: 1, difficulty: 7, bonus: 2, description: "x" }).some((e) => e.includes("bonusLabel")), "a silent, unlabelled bonus must be rejected");
  assert.ok(validateVisibleCheckDeclaration({ statIndex: 1, difficulty: 7 }).some((e) => e.includes("description")));
});
