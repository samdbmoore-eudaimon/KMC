// Little Reckoning, level 4: Lanterns in the Forgetting Fog (EXPEDITIONS_BUILD_BRIEF.md §14,
// EXPEDITIONS_SPEC.md §18-19, expedition-data.js's lr_fog_lanterns brief). Second E7 map for
// Little Reckoning, and the first scenario to use the route-marker mechanism and the
// "connect" family's route-marker integration, both built and tested ahead of any map.
//
// Simplification note: the brief asks for "the shortest unobstructed network" — a
// minimum-cost path. The "connect" family (graphConnected) only checks boolean connectivity,
// not path cost, so a literal shortest-network requirement is not modelled. Connectivity
// between the first and last lantern is the hard requirement; efficiency is rewarded the
// same way every other map already rewards it — the performance marks
// (exact_turn_target/minimum_movement) against this map's own verified reference trace —
// not a second hard constraint.
//
// The four lanterns sit in a line (lantern_1..4); three route markers, one between each
// adjacent pair, start rotated away from the chain and must be reframed (Logic's Reframe
// role action, already generic over any object with an `orientation` field) back to
// orientation 0 to complete the connection.
//
// Squad starts and round limit (2026-09-16): each hero now starts adjacent to her own
// marker, one hero per marker, so all three can be reframed in parallel — and the round
// limit is tightened to 1, per EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9. A solo hero would
// need to visit all three widely-spaced markers herself (a minimum of 3 reframes plus 2
// moves between them = 5 actions, at least 3 rounds for anyone), so turnLimit 1 blocks any
// solo attempt outright while the three-hero parallel solution finishes in round 1.
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

export const FOG_LANTERNS_CONFIG = {
  id: "lr_fog_lanterns",
  moduleKey: "junior",
  title: "Lanterns in the Forgetting Fog",
  turnLimit: 1,
  board: radiusBoard(3),
  units: [],
  enemies: [
    { id: "fogling_a", name: "Fogling", hp: 2, maxHp: 2, defence: 5, move: 2, range: 1, damage: 1, initiative: 4, pos: "3,-2", delay: 2, intent: "Advance on the nearest hero and strike." },
    { id: "fogling_b", name: "Fogling", hp: 2, maxHp: 2, defence: 5, move: 2, range: 1, damage: 1, initiative: 6, pos: "3,-1", delay: 2, intent: "Advance on the nearest hero and strike." },
  ],
  objects: [
    { id: "lantern_1", kind: "lantern", value: 1, pos: "-3,0", movable: false },
    { id: "marker_1", kind: "route-marker", orientation: 2, paths: [[0, 3]], pos: "-2,0", movable: false },
    { id: "lantern_2", kind: "lantern", value: 2, pos: "-1,0", movable: false },
    { id: "marker_2", kind: "route-marker", orientation: 2, paths: [[0, 3]], pos: "0,0", movable: false },
    { id: "lantern_3", kind: "lantern", value: 3, pos: "1,0", movable: false },
    { id: "marker_3", kind: "route-marker", orientation: 2, paths: [[0, 3]], pos: "2,0", movable: false },
    { id: "lantern_4", kind: "lantern", value: 4, pos: "3,0", movable: false },
  ],
  objective: {
    // "connect" family nodes are hex keys, matching what routeMarkerConnections produces —
    // not the lantern objects' own ids. The four lantern positions are the nodes; start and
    // end are the first and last lantern's hex.
    family: "connect",
    activeNodes: ["-3,0", "-1,0", "1,0", "3,0"],
    start: "-3,0",
    end: "3,0",
    routeMarkerIds: ["marker_1", "marker_2", "marker_3"],
  },
  flags: {
    briefing: "Rotate the three route markers so all four lanterns join into one unbroken network from the first to the last.",
  },
};

export function createFogLanterns(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("Lanterns in the Forgetting Fog requires exactly three heroes");
  const starts = ["-2,-1", "0,-1", "2,-1"];
  return createExpeditionState({
    ...FOG_LANTERNS_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
