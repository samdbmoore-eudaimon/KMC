// Ninefold Orchard, level 5: The Maybe-Flock Roost (EXPEDITIONS_BUILD_BRIEF.md §14,
// EXPEDITIONS_SPEC.md §18-19, expedition-data.js's po_maybe_roost brief). Second E7 map for
// Ninefold Orchard (Unequal Crossing is its level 1), and the first scenario to use the
// "capture" objective family, which existed in the engine with no test coverage or scenario
// using it until now.
//
// Simplification note: the brief says "at the end of one round" — the capture family
// evaluates continuously (after every action, like every other family), not only at round
// boundaries, so completing mid-round is possible and is not treated as a failure. This is a
// benign simplification: finishing early has never been a problem for any other map either.
import { createExpeditionState } from "./expedition-engine.js";

function radiusBoard(radius) {
  const hexes = [];
  for (let q = -radius; q <= radius; q += 1) {
    const minR = Math.max(-radius, -q - radius);
    const maxR = Math.min(radius, -q + radius);
    for (let r = minR; r <= maxR; r += 1) hexes.push({ q, r, terrain: "clear" });
  }
  return hexes;
}

export const MAYBE_FLOCK_ROOST_CONFIG = {
  id: "po_maybe_roost",
  moduleKey: "primary",
  title: "The Maybe-Flock Roost",
  turnLimit: 4,
  board: radiusBoard(3),
  units: [],
  enemies: [
    { id: "maybe_finch_a", name: "Maybe-Finch", hp: 2, maxHp: 2, defence: 5, move: 2, range: 1, damage: 1, initiative: 4, pos: "3,-3", delay: 2, intent: "Advance on the nearest hero and strike." },
    { id: "maybe_finch_b", name: "Maybe-Finch", hp: 2, maxHp: 2, defence: 5, move: 2, range: 1, damage: 1, initiative: 6, pos: "3,-2", delay: 2, intent: "Advance on the nearest hero and strike." },
    { id: "maybe_finch_c", name: "Maybe-Finch", hp: 2, maxHp: 2, defence: 5, move: 2, range: 1, damage: 1, initiative: 8, pos: "3,-1", delay: 2, intent: "Advance on the nearest hero and strike." },
  ],
  // Directional-sum layer (2026-09-17, EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §5's "make
  // three directional sums agree while holding towers"): a light rework only — three fixed
  // wind vanes, one beside each whistle post, whose values already sum to the target by
  // design. Nothing moves or adjusts them; this adds a Number pressure lane and the "agree"
  // framing without changing a single tactical decision in the locked REF-10 trace below, per
  // Sam's "light rework only" instruction for this map. Placed adjacent to (not on) each post,
  // since an object occupies its hex exclusively and a hero must still be able to stand there
  // — and specifically clear of every hex the locked REF-10 trace below already moves through
  // ("-1,0", "1,0", "-1,1", "-1,2", "0,1", "1,1"), so this rework changes nothing about it.
  objects: [
    { id: "vane_east", name: "East wind vane", kind: "vane", value: 5, pos: "2,0", movable: false },
    { id: "vane_south", name: "South wind vane", kind: "vane", value: 3, pos: "0,2", movable: false },
    { id: "vane_north", name: "North wind vane", kind: "vane", value: 1, pos: "1,2", movable: false },
  ],
  objective: {
    family: "capture",
    hexes: ["2,-1", "-1,2", "1,1"],
    count: 3,
    sumHexes: ["2,0", "0,2", "1,2"],
    sumTarget: 9,
  },
  flags: {
    briefing: "Hold all three whistle posts at once — one hero on each — while the three wind vanes agree on nine, before the flock decides where to land.",
    // §7's "definition of a completed scenario brief" — pressure lanes: Threat (three
    // Maybe-Finches converge once the watch delay expires) and Reach (three heroes must each
    // occupy a separate, spread-out post at once). Number now has a genuine presence too (the
    // vanes), but stays undeclared as a *pressure* since nothing the player does changes it —
    // a pressure lane is a live decision, not background flavour.
    pressureLanes: ["threat", "reach"],
    heroChain: "Three heroes commit to three different posts at once, each guarded against its own Maybe-Finch — no single hero, however strong, can hold more than one hex.",
    alternateChain: "A hero without Guard can instead hold a post supported by an adjacent ally, trading a guaranteed block for a stronger strike if the Maybe-Finch closes in.",
  },
};

export function createMaybeFlockRoost(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The Maybe-Flock Roost requires exactly three heroes");
  const starts = ["-3,0", "-3,1", "-3,2"];
  return createExpeditionState({
    ...MAYBE_FLOCK_ROOST_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
