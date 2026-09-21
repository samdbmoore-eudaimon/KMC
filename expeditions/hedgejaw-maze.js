// Ninefold Orchard, level 4: The Hedgejaw Maze (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §5).
// Replaces The Widdershins Path at level 4 per the master brief's conflict rule and Sam's
// explicit "new build" instruction (2026-09-17) — the brief's stat hook ("Logic predicts the
// closing path, Geometry shifts a blocker, Scout marks the Hedgejaw") doesn't match
// Widdershins' actual shipped mechanic (Logic *repairs* a reversed stone via Order's "repair"
// mode, no blocking object, no Predict, no Mark), so this needed a genuine new build rather
// than a rename. widdershins-path.js/.test.js and scripts/simulate_widdershins_path.mjs are
// left in place, real and tested, just removed from the catalogue and expedition-data.js's
// ten-level list, the same treatment as The Counting Orchard.
//
// The generic "orderedRoute" family (three stones, increasing values, visited in order) plus
// visitStone's existing, optional `requiredFrom` (a stone may only be visited from one named
// adjacent hex — Widdershins already established this field; here it is never reversed, just
// used to define each stone's one approach). The genuinely new piece is a single "hedge"
// blocking object (kind "hedge", deliberately `movable: false` so ordinary carrying can never
// clear it) that the Hedgejaw ("walk-hedge", expedition-engine.js) relocates onto whichever
// stone's gate the party needs *next*, closing that route — always the current target's own
// gate, never hidden or random, so predictable from the visible sequence alone. Geometry's
// existing True Shift discipline action (no change needed — Shift never required `movable`)
// is the only way to clear it once it is there, since Combine/Split/ordinary carrying all
// require a movable object. Logic's existing Predict and Scout's existing Mark both work on
// the Hedgejaw unchanged, satisfying the rest of the brief's stat hook with no new mechanism.
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

export const HEDGEJAW_MAZE_CONFIG = {
  id: "po_hedgejaw_maze",
  moduleKey: "primary",
  title: "The Hedgejaw Maze",
  turnLimit: 5,
  board: radiusBoard(3),
  units: [],
  enemies: [
    {
      id: "hedgejaw",
      name: "Hedgejaw",
      hp: 3,
      maxHp: 3,
      defence: 5,
      move: 0,
      range: 1,
      damage: 1,
      initiative: 7,
      pos: "0,0",
      delay: 1,
      behaviour: "walk-hedge",
      hedgeId: "hedge",
      intent: "Grow the hedge across the next required stone's only approach, closing that route.",
    },
  ],
  objects: [
    { id: "stone_3", kind: "stone", value: 3, pos: "2,-1", requiredFrom: "1,0", movable: false },
    { id: "stone_5", kind: "stone", value: 5, pos: "-1,2", requiredFrom: "0,1", movable: false },
    { id: "stone_9", kind: "stone", value: 9, pos: "-2,-1", requiredFrom: "-1,-1", movable: false },
    // Parked off to the side at the start — the maze is fully open until the Hedgejaw first
    // acts (its one-round delay), never a surprise closure on round 1.
    { id: "hedge", kind: "hedge", pos: "3,-3", movable: false },
  ],
  objective: {
    family: "orderedRoute",
    sequence: [3, 5, 9],
  },
  flags: {
    briefing: "Visit the three stones in increasing order, before the Hedgejaw grows across your next approach.",
    // §7's "definition of a completed scenario brief" — pressure lanes: Truth (predicting
    // which gate closes next — always fully deterministic, never hidden) and Shape (the hedge
    // is a real spatial obstacle only Geometry's True Shift can move).
    pressureLanes: ["truth", "shape"],
    heroChain: "Logic predicts the Hedgejaw's next target, Speed reaches that stone's gate before the hedge does, Geometry shifts the hedge clear on any gate reached too late.",
    alternateChain: "Without a Reckoner or Predict: the closing gate is always the current sequence target's own approach, fully readable from the visible order and progress alone — no hidden information to reveal.",
  },
};

export function createHedgejawMaze(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The Hedgejaw Maze requires exactly three heroes");
  const starts = ["-3,1", "-1,-2", "1,2"];
  return createExpeditionState({
    ...HEDGEJAW_MAZE_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
