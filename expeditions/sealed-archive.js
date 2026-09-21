// Gifford, level 3: The Sealed Archive (EXPEDITIONS_BUILD_BRIEF.md §14, EXPEDITIONS_SPEC.md
// §18-19, expedition-data.js's gf_sealed_archive brief). Second E4 proof map for the
// Gifford tier.
//
// Simplification note: the authored brief imagines "row, column and parity constraints" —
// a full deduction grid. This engine's constraintGrid family checks a list of independent
// constraints by object id, not a spatial row/column grid (there is no cell-adjacency
// concept for constraints, only for movement), so a literal grid would need a new
// row/column addressing scheme that does not exist yet. This proof map keeps the real
// mechanic intact — three simultaneous constraints of genuinely different kinds (a sum, a
// parity check and an inequality), each independently authored to open one vault, matching
// the brief's own "three linked vaults" framing exactly — using constraintSatisfied's
// existing "sum", "parity" and "lessThan" kinds rather than a spatial grid.
//
// The three vault stones (vault_a/b/c) start at a seed value and are raised to their
// required value with Arithmetic's Combine action (merging an adjacent feeder stone into
// them) — the same generic engine action Split/Combine already implement, used here for the
// first time by a proof map.
//
// Feeder placement (2026-09-16): moved far from their vaults, per
// EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9. Only Gifford's arithmetic common (Adavoss) can
// Combine at all — the loan squad has no second arithmetic card to split that work with —
// so genuine cooperation instead comes from carrying: feeder stones are ordinary movable
// objects (vault stones are marked movable too, since Combine requires both the source and
// target object to be movable), so the other three heroes fetch one each (interactObject's
// existing collect, carry and drop) and bring it to its vault, while Adavoss travels between
// vaults combining whatever has arrived. Verified by direct simulation: the three-hero relay
// wins in round 5 (25 actions), while Adavoss working alone — fetching, carrying and combining
// every stone herself, across the same real distances, with the other two vault stones sat on
// the board blocking her most direct routes — has completed only one of three vaults by the
// end of round 5 and is still working on the second when she runs out of rounds. turnLimit
// stays 5 (unchanged): the redesign is entirely in the objects' placement and movability, not
// in tightening the clock.
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

export const SEALED_ARCHIVE_CONFIG = {
  id: "gf_sealed_archive",
  moduleKey: "intermediate",
  title: "The Sealed Archive",
  turnLimit: 5,
  board: radiusBoard(3),
  units: [],
  enemies: [
    { id: "archive_warden", name: "Archive Warden", hp: 4, maxHp: 4, defence: 7, move: 1, range: 1, damage: 1, initiative: 5, pos: "3,-1", delay: 2, intent: "Advance on the nearest hero and strike." },
    { id: "cipher_moth", name: "Cipher Moth", hp: 2, maxHp: 2, defence: 5, move: 2, range: 1, damage: 1, initiative: 3, pos: "3,0", delay: 2, intent: "Advance on the nearest hero and strike." },
  ],
  objects: [
    { id: "vault_a", kind: "stone", value: 3, pos: "0,0", movable: true },
    { id: "feeder_a", kind: "stone", value: 5, pos: "-3,3", movable: true },
    { id: "vault_b", kind: "stone", value: 4, pos: "0,2", movable: true },
    { id: "feeder_b", kind: "stone", value: 8, pos: "0,-3", movable: true },
    { id: "vault_c", kind: "stone", value: 9, pos: "-2,0", movable: true },
    { id: "feeder_c", kind: "stone", value: 5, pos: "0,3", movable: true },
  ],
  objective: {
    family: "constraintGrid",
    constraints: [
      { kind: "sum", objectIds: ["vault_a", "vault_b"], target: 20 },
      { kind: "parity", objectIds: ["vault_c"], parity: "even" },
      { kind: "lessThan", objectIds: ["vault_b", "vault_c"] },
    ],
  },
  flags: {
    briefing: "Raise each vault stone to its required value: the first two vaults must total twenty, the third must be even, and the second vault must stay lower than the third.",
  },
};

export function createSealedArchive(squad) {
  if (!Array.isArray(squad) || squad.length !== 4) throw new Error("The Sealed Archive requires exactly four heroes");
  const starts = ["-3,0", "-3,1", "-3,2", "-3,3"];
  return createExpeditionState({
    ...SEALED_ARCHIVE_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
