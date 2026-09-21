// Ninefold Orchard, level 10 (module boss): The First Whistle
// (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §5, primitive A — Build A, EXPEDITIONS_CLAUDE_HANDOVER.md).
// New build — po_first_whistle's old placeholder ("connect" family, "Reconnect all nine
// branches to the founding stone") was never engine-built, so this is fresh content with a
// richer rule, not a replacement.
//
// Two route markers in series relay the network from the party's side to First Root: one
// ordinary (any Reckoner-role hero rotates it), one `jammed: true` (needing Geometry's Force
// Rotate) — the first map this session where that half of primitive A is actually usable by
// its own loan squad (Nine Across the Turning Bridge and The Hedgejaw Maze both deliberately
// deferred it once checking found no Geometry hero available there; this map's loan squad
// includes Russet specifically so it finally lands). A route marker connects two of its *own*
// neighbouring hexes, never its own hex to one of them — both markers sit on a third hex
// adjacent to the two nodes they join, not on either node itself, a real placement mistake
// caught and fixed while writing this map's own engine-level tests
// (expedition-actions.test.js) before this scenario file was written at all.
//
// "Combat opens only after the network is live" is the new `enemy.networkGate`
// (expedition-engine.js's strikeEnemy): First Root takes 0 impact from any strike, however
// strong, until graphConnected reads the two markers' current rotation as a connected path —
// the same function and the same routeMarkerIds/edges shape the "connect" family already uses,
// not a second implementation. Once live, First Root fights back with the engine's ordinary
// default behaviour (hunt the nearest hero, strike in range) — no new combat mechanism needed
// for that half either.
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

export const FIRST_WHISTLE_CONFIG = {
  id: "po_first_whistle",
  moduleKey: "primary",
  title: "The First Whistle",
  turnLimit: 5,
  board: radiusBoard(3),
  units: [],
  enemies: [
    {
      id: "first_root",
      name: "First Root",
      hp: 6,
      maxHp: 6,
      defence: 4,
      move: 1,
      range: 1,
      damage: 1,
      initiative: 9,
      pos: "2,0",
      delay: 1,
      networkGate: {
        activeNodes: ["-2,0", "0,0", "2,0"],
        routeMarkerIds: ["marker_near", "marker_far"],
        start: "-2,0",
        end: "2,0",
      },
      intent: "Rewire the network shut while it is closed; once it opens, close on the nearest hero and strike.",
    },
  ],
  objects: [
    // marker_near joins -2,0 (the party's side) and 0,0 — orientation 2 leaves it
    // unconnected; any Reckoner-role hero turns it to 0 to align it.
    { id: "marker_near", kind: "branch", pos: "-1,0", orientation: 2, paths: [[0, 3]], movable: false },
    // marker_far joins 0,0 and 2,0 (First Root's own hex) — orientation 2, jammed: only a
    // Geometry discipline hero's Force Rotate can turn it. (Orientation 3 would have looked
    // misaligned but is not: a straight [0,3] path is 180 degrees end to end, so rotating it
    // three of six steps maps it onto itself — checked directly by computing the neighbour
    // indices rather than assumed, after a first draft used exactly that non-misalignment.)
    { id: "marker_far", kind: "branch", pos: "1,0", orientation: 2, jammed: true, jamDifficulty: 5, paths: [[0, 3]], movable: false },
  ],
  objective: {
    family: "eliminate",
  },
  flags: {
    briefing: "Rewire both branches to reconnect the network, then bring down First Root — it cannot be struck at all until the network is live.",
    // §7's "definition of a completed scenario brief" — pressure lanes: Shape (two branches,
    // one of them jammed, both genuinely need turning) and Threat (once the network opens,
    // First Root fights back for real).
    pressureLanes: ["shape", "threat"],
    heroChain: "The Reckoner turns the near branch true, Geometry force-rotates the jammed far branch, the network reads connected and the whole party strikes First Root together.",
    alternateChain: "Without a free Reckoner: any hero adjacent to the near branch may still Reframe it — the role, not a specific card identity, is what the action needs.",
  },
};

export function createFirstWhistle(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The First Whistle requires exactly three heroes");
  const starts = ["1,1", "-1,1", "-3,0"];
  return createExpeditionState({
    ...FIRST_WHISTLE_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
