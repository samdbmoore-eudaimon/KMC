// Ninefold Orchard, level 6: The Rootfire Relay (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §5).
// Replaces Ten Honest Bundles at level 6 per the master brief's conflict rule — that
// placeholder brief was never engine-built (checked directly before starting: no
// ten-honest-bundles.js exists anywhere in the repo), so unlike Cider Run/Hedgejaw Maze this
// supersedes only a description, not real tested work.
//
// Five root objects (kind "root") form a chain: root_a-root_b-root_c are already adjacent;
// root_d starts two hexes from root_c, a genuine gap; root_e (the trunk) is adjacent to
// root_d's starting hex. The constraintGrid family (already used elsewhere) checks two rules
// at once — "exact totals and parity" per the brief: the whole chain must sum to the target,
// and the trunk (root_e) must be even. Every action involved is an existing, unmodified
// engine primitive used in combination, not a new mechanism:
//   - Geometry's True Shift "bridges a gap": relocates root_d adjacent to root_c, closing the
//     chain into one connected run of five.
//   - Science's Chain Reaction "propagates" the change: +1 to every object in a connected,
//     adjacent sub-chain in one action — used here on [root_c, root_d] once the gap is closed.
//   - Arithmetic's Combine/Split remain available as the "changes a source value" alternate
//     route the brief names, same optional-but-real status as every other map's use of them.
// Strawling (a new "wilt-root" enemy behaviour, expedition-engine.js) reduces the single
// highest-value unguarded root anywhere on the board by one each active round — reused from
// the existing Ninefold cast (already used for the old, unbuilt "Ten Honest Bundles" brief),
// so this needs no new art.
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

export const ROOTFIRE_RELAY_CONFIG = {
  id: "po_rootfire_relay",
  moduleKey: "primary",
  title: "The Rootfire Relay",
  turnLimit: 4,
  board: radiusBoard(3),
  units: [],
  enemies: [
    {
      id: "strawling",
      name: "Strawling",
      hp: 2,
      maxHp: 2,
      defence: 4,
      move: 1,
      range: 1,
      damage: 1,
      initiative: 6,
      pos: "3,-3",
      delay: 1,
      behaviour: "wilt-root",
      intent: "Wilt the highest-value unguarded root on the whole relay by one.",
    },
  ],
  objects: [
    { id: "root_a", kind: "root", value: 1, pos: "-2,0", movable: true },
    { id: "root_b", kind: "root", value: 2, pos: "-1,0", movable: true },
    { id: "root_c", kind: "root", value: 1, pos: "0,0", movable: true },
    { id: "root_d", kind: "root", value: 2, pos: "2,-1", movable: true },
    { id: "root_e", kind: "root", value: 2, pos: "2,0", movable: true },
  ],
  objective: {
    family: "constraintGrid",
    constraints: [
      { kind: "sum", objectIds: ["root_a", "root_b", "root_c", "root_d", "root_e"], target: 10 },
      { kind: "parity", objectIds: ["root_e"], parity: "even" },
    ],
  },
  flags: {
    briefing: "Close the gap in the root chain and let the fire relay through until the whole relay reads ten, with the trunk root reading even.",
    // §7's "definition of a completed scenario brief" — pressure lanes: Number (the exact
    // sum-and-parity target) and Change (Strawling's wilt is permanent and one-directional
    // once it lands, so timing which root to protect matters).
    pressureLanes: ["number", "change"],
    heroChain: "Geometry closes the gap between root_c and root_d, Science's Chain Reaction relays the rise through both at once, reaching ten with the trunk still even.",
    alternateChain: "Without a Reckoner-free Geometry hero: Arithmetic's Combine can merge two adjacent roots into a fresh value instead, reaching the same total by a different route.",
  },
};

export function createRootfireRelay(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The Rootfire Relay requires exactly three heroes");
  const starts = ["2,-2", "0,-1", "-3,0"];
  return createExpeditionState({
    ...ROOTFIRE_RELAY_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
