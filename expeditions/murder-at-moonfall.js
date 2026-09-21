// Ninefold Orchard, level 7: Murder at Moonfall (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §5).
// New build — this level's placeholder id, `po_count_the_murder`, is confirmed (by reading
// EXPEDITIONS_NINEFOLD_ROUTE.md's Map 7 section directly, not assumed from the title) to
// already BE this same map under its working title, not a separate design elsewhere. Nothing
// was previously engine-built for it, so there is no conflict to resolve — this is the map's
// first implementation.
//
// Uses the generic "containment" objective family exactly as it already exists (built earlier
// this project, never previously exercised by a real scenario): complete once all six hexes
// neighbouring a named target unit are each either occupied by a living player or permanently
// blocked terrain. A genuine discovery while designing this, not assumed: an off-board
// neighbour (e.g. a board-corner position) never counts as closed — `state.board[hex]` is
// undefined there, so `undefined === "blocked"` is false — so containment is only ever
// achievable at an interior hex with a real, on-board neighbour for every one of its six sides.
// The Crowbreaker sits with three of those six sides already hedge-walled (`terrain:
// "blocked"`), leaving exactly three open approaches for the three heroes to close — "an
// incomplete ring," matching the brief directly. The Crowbreaker uses no special enemy
// behaviour at all — the engine's own default (hunt the nearest hero, strike once in range,
// otherwise close the distance) is exactly "a crow swarm moves" without inventing anything new;
// once a hero occupies each open hex, it is already in range of one of them and never needs to
// move again, so the ring holds on its own.
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

export const MURDER_AT_MOONFALL_CONFIG = {
  id: "po_count_the_murder",
  moduleKey: "primary",
  title: "Murder at Moonfall",
  turnLimit: 4,
  board: radiusBoard(3).map((hex) => {
    const key = `${hex.q},${hex.r}`;
    // Three of the Crowbreaker's six neighbours (its hedge-walled sides): 2,0 / 2,-1 / 1,-1.
    if (["2,0", "2,-1", "1,-1"].includes(key)) return { ...hex, terrain: "blocked" };
    return hex;
  }),
  units: [],
  enemies: [
    {
      id: "crowbreaker",
      name: "Crowbreaker",
      hp: 5,
      maxHp: 5,
      defence: 6,
      move: 1,
      range: 1,
      damage: 1,
      initiative: 8,
      pos: "1,0",
      delay: 1,
      intent: "Close on the nearest hero and strike once in range.",
    },
  ],
  objects: [],
  objective: {
    family: "containment",
    targetId: "crowbreaker",
  },
  flags: {
    briefing: "Close the ring around the Crowbreaker — three hedge walls already pen three of its sides, so the three heroes must hold the rest.",
    // §7's "definition of a completed scenario brief" — pressure lanes: Reach (three heroes
    // must each claim a separate open hex at once, the same "no single hero can hold two"
    // structure as The Maybe-Flock Roost) and Threat (the Crowbreaker strikes back once in
    // range, so absorbing or avoiding that matters while closing the ring).
    pressureLanes: ["reach", "threat"],
    heroChain: "Speed reaches an open hex before the Crowbreaker closes on a slower ally, Geometry lines up the last approach exactly, the ring closes with all three heroes in place at once.",
    alternateChain: "A hero who arrives late can still hold the ring's final side once the Crowbreaker has already committed to striking someone else — the containment check reads the board's current state, not a fixed arrival order.",
  },
};

export function createMurderAtMoonfall(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("Murder at Moonfall requires exactly three heroes");
  const starts = ["-2,0", "-1,2", "1,2"];
  return createExpeditionState({
    ...MURDER_AT_MOONFALL_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
