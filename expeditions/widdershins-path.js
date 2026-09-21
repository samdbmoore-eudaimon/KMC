// Ninefold Orchard, level 4: The Widdershins Path (EXPEDITIONS_NINEFOLD_ROUTE.md's Map 4,
// expedition-data.js's po_widdershins_path brief). Delegated backlog item 3.
//
// Four numbered stepping stones (2, 4, 6, 8) ring a central hex. Visit them in increasing
// numeric order, then stand on the centre. Each stone only registers a "visit" — implemented
// as a new side effect of moveUnit, expedition-engine.js's visitOrderedRouteStone — when it is
// currently the next required value AND the hero arrived from that stone's active entry hex
// (`requiredFrom` normally, `reversedFrom` once reversed). Landing on a stone out of turn, or
// from the wrong side, is harmless: nothing happens, free to leave and approach correctly
// later. Every stone's `reversedFrom` is the centre hex itself, so "the outer route" (walking
// the ring) is always the fast, normal approach and "reversed" always forces the slower
// detour back through the middle — a real routing cost, not just a relabelling.
//
// Design note: the route doc describes "five numbered stepping stones" forming the loop, but
// only ever names four required values (2, 4, 6, 8) and a separately-described "centre stone".
// Read literally that is five stones, but the fifth's value and role are never specified. This
// engine-only build uses four ring stones plus a plain centre hex (no fifth stone object) —
// the same "keep the real mechanic, drop the undecided detail" approach used for Sealed
// Archive's constraint grid. The four ring stones are deliberately NOT placed in ascending
// physical order around the ring (2, 4, 8, 6 going one way) so recognising numeric order is a
// real task, not a formality.
//
// The Widdershins creature (new `reverse-next` behaviour) reverses whichever ring stone is
// next needed, if it is still unvisited and unguarded — always fully predictable from the
// visible sequence and progress, never a hidden trap, and it never attacks a hero. Logic's Put
// in Order (a new third mode alongside its existing initiative/position swaps) repairs a
// reversed stone directly; the "shorter route enabled by Logic" the design doc describes.
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

export const WIDDERSHINS_PATH_CONFIG = {
  id: "po_widdershins_path",
  moduleKey: "primary",
  title: "The Widdershins Path",
  turnLimit: 4,
  board: radiusBoard(3),
  units: [],
  enemies: [
    { id: "widdershins", name: "Widdershins", hp: 3, maxHp: 3, defence: 5, move: 0, range: 1, damage: 1, initiative: 5, pos: "0,-2", delay: 0, behaviour: "reverse-next", intent: "Reverse the entry direction of whichever stone the party needs next, if it is still unvisited and unguarded." },
  ],
  objects: [
    { id: "stone_2", kind: "stone", value: 2, pos: "1,-1", requiredFrom: "1,-2", reversedFrom: "0,0", reversed: false },
    { id: "stone_4", kind: "stone", value: 4, pos: "-1,0", requiredFrom: "0,-1", reversedFrom: "0,0", reversed: false },
    { id: "stone_6", kind: "stone", value: 6, pos: "1,0", requiredFrom: "1,1", reversedFrom: "0,0", reversed: false },
    { id: "stone_8", kind: "stone", value: 8, pos: "0,1", requiredFrom: "-1,1", reversedFrom: "0,0", reversed: false },
  ],
  objective: {
    family: "orderedRoute",
    sequence: [2, 4, 6, 8],
    centreHex: "0,0",
  },
  flags: {
    briefing: "Visit the four stones in increasing order — 2, then 4, then 6, then 8 — then stand on the centre stone. Approach each from the right side: the Widdershins creature can reverse whichever stone you need next.",
  },
};

export function createWiddershinsPath(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The Widdershins Path requires exactly three heroes");
  const starts = ["3,-3", "3,0", "-3,3"];
  return createExpeditionState({
    ...WIDDERSHINS_PATH_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
