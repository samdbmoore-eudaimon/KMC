// Ninefold Orchard, level 2: The Counting Orchard (EXPEDITIONS_NINEFOLD_ROUTE.md's Map 2,
// expedition-data.js's po_counting_orchard brief). Delegated backlog item 3.
//
// Six baskets (2, 3, 4, 5, 7, 8) sit on three lanes, two per lane. Carry any two baskets onto
// the two harvest-gate hexes so their values total exactly 12 (the generic `exactSum`
// objective family already checks exactly this: the sum of every object sitting on the
// objective's hexes). The gate itself is only two hexes, so the engine's own one-object-per-hex
// rule is what actually enforces "only two baskets can occupy the gate" — no separate rule
// needed. Two direct pairs exist (4+8, 5+7); Arithmetic's Combine can also make a third route
// by merging 3+4 into a fresh 7, which then partners the original 5 for another 12 — matching
// the route doc's own worked example exactly. 8+3=11 (both on lane 1) is the deliberate
// near-miss.
//
// The Scruffcrow (new `peck-lane` enemy behaviour in expedition-engine.js) advances through
// the lanes in a fixed, repeating order and reduces that lane's highest *unguarded* basket by
// one each round — purely by lane membership, never by chasing a hero, so its target is always
// fully predictable from the visible lane order. A basket being carried (`pos: null`) is
// automatically safe, same as a guarded one.
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

export const COUNTING_ORCHARD_CONFIG = {
  id: "po_counting_orchard",
  moduleKey: "primary",
  title: "The Counting Orchard",
  turnLimit: 4,
  board: radiusBoard(3),
  units: [],
  enemies: [
    {
      id: "scruffcrow",
      name: "Scruffcrow",
      hp: 2,
      maxHp: 2,
      defence: 4,
      move: 1,
      range: 1,
      damage: 1,
      initiative: 6,
      pos: "3,-3",
      delay: 0,
      behaviour: "peck-lane",
      laneSequence: [1, 2, 3],
      laneMarkers: { 1: "3,-3", 2: "3,-2", 3: "3,-1" },
      intent: "Advance to the next lane and peck its highest unguarded basket, reducing its value by one.",
    },
  ],
  objects: [
    { id: "basket_8", kind: "basket", value: 8, pos: "-2,-1", lane: 1 },
    { id: "basket_3", kind: "basket", value: 3, pos: "-2,1", lane: 1 },
    { id: "basket_7", kind: "basket", value: 7, pos: "0,-2", lane: 2 },
    { id: "basket_4", kind: "basket", value: 4, pos: "0,2", lane: 2 },
    { id: "basket_5", kind: "basket", value: 5, pos: "2,-1", lane: 3 },
    { id: "basket_2", kind: "basket", value: 2, pos: "2,1", lane: 3 },
  ],
  objective: {
    family: "exactSum",
    hexes: ["0,-1", "0,1"],
    target: 12,
  },
  flags: {
    briefing: "Fill the harvest gate with baskets worth exactly twelve, before the Scruffcrow pecks your plan apart.",
  },
};

export function createCountingOrchard(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The Counting Orchard requires exactly three heroes");
  const starts = ["-2,-1", "0,1", "1,1"];
  return createExpeditionState({
    ...COUNTING_ORCHARD_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
