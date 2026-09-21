// Ninefold Orchard, level 9: The Orchard Lockdown (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md §5,
// primitive B — Hive Ledger, EXPEDITIONS_CLAUDE_HANDOVER.md's Build B). New build — the old
// placeholder brief `po_one_short` ("Every Basket One Short," constraintGrid) was never
// engine-built (checked before starting: no scenario file exists), so this supersedes only a
// description, not tested work, and happens to already share the right family.
//
// Three Hive Ledger gates, each a `constraintGrid` constraint (the same generic evaluator The
// Sealed Archive already uses): a sum gate, a parity gate and a `useEachOnce` gate (Build B's
// own new kind, "use 1-3 once" here rather than the brief's full "1-7" — a genuine, smaller
// instance of the same rule, not every constraint kind needing to reach seven). The sum gate
// starts deliberately wrong (2 + 3, needing 9) — a real puzzle to solve, not a defend-only
// map — fixed by Arithmetic's existing Combine, merging in an unofficial "spare" cell (never
// itself flagged `ledgerCell`, so Nearly can never threaten the fix before it happens) rather
// than merging two of the constraint's own listed cells, which would double-count a removed
// object's stale value (Combine sets `removed: true` but never zeroes `value`, and the "sum"
// constraint reads every listed id's value regardless of `removed` — a real gotcha checked and
// avoided here, not one this map's own design happens to dodge by luck). The parity and
// useEachOnce gates already read correctly at the start; the puzzle there is purely defensive.
// Nearly (already in the Ninefold cast, reused from the old placeholder) uses the existing
// `corrupt-value` behaviour (Build B, previously built but never exercised by a real scenario)
// unmodified — Guard or Logic's Deduce (value mode, already existing) both protect a cell.
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

export const ORCHARD_LOCKDOWN_CONFIG = {
  id: "po_one_short",
  moduleKey: "primary",
  title: "The Orchard Lockdown",
  turnLimit: 4,
  board: radiusBoard(3),
  units: [],
  enemies: [
    {
      id: "nearly",
      name: "Nearly",
      hp: 3,
      maxHp: 3,
      defence: 5,
      move: 2,
      range: 1,
      damage: 1,
      initiative: 6,
      pos: "3,-3",
      delay: 1,
      behaviour: "corrupt-value",
      intent: "Corrupt the highest-value unguarded, unlocked gate cell anywhere on the ledger.",
    },
  ],
  objects: [
    // Gate A (sum 9): deliberately short — 2 + 3 = 5. spare_a is not a ledgerCell, so Nearly
    // can never threaten the fix, and Combine folding it into a2 cannot double-count.
    { id: "a1", kind: "ledger", value: 2, pos: "-2,0", movable: false, ledgerCell: true },
    { id: "a2", kind: "ledger", value: 3, pos: "-1,0", movable: true, ledgerCell: true },
    { id: "spare_a", kind: "ledger", value: 4, pos: "0,0", movable: true },
    // Gate B (parity — every value even): already correct.
    { id: "b1", kind: "ledger", value: 2, pos: "-2,2", movable: false, ledgerCell: true },
    { id: "b2", kind: "ledger", value: 4, pos: "-1,2", movable: false, ledgerCell: true },
    { id: "b3", kind: "ledger", value: 6, pos: "0,2", movable: false, ledgerCell: true },
    // Gate C (use 1-3 once each): already correct.
    { id: "c1", kind: "ledger", value: 1, pos: "-1,-2", movable: false, ledgerCell: true },
    { id: "c2", kind: "ledger", value: 2, pos: "0,-2", movable: false, ledgerCell: true },
    { id: "c3", kind: "ledger", value: 3, pos: "1,-2", movable: false, ledgerCell: true },
  ],
  objective: {
    family: "constraintGrid",
    constraints: [
      { kind: "sum", objectIds: ["a1", "a2"], target: 9 },
      { kind: "parity", objectIds: ["b1", "b2", "b3"], parity: "even" },
      { kind: "useEachOnce", objectIds: ["c1", "c2", "c3"], range: [1, 3] },
    ],
  },
  flags: {
    briefing: "Open all three ledger gates at once — correct gate A's short total, and hold gates B and C against Nearly.",
    // §7's "definition of a completed scenario brief" — pressure lanes: Number (gate A's exact
    // sum) and Truth (Nearly's target is always the single highest-value unguarded, unlocked
    // cell — fully deterministic, so which cell needs a defender first is always knowable).
    pressureLanes: ["number", "truth"],
    heroChain: "Arithmetic combines the spare into gate A while the other two heroes guard gate B and gate C's highest cells, all three gates open at once.",
    alternateChain: "Without an Arithmetic hero free: Logic's Deduce can lock a threatened cell directly instead of guarding it, freeing that hero to help elsewhere the same round.",
  },
};

export function createOrchardLockdown(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The Orchard Lockdown requires exactly three heroes");
  const starts = ["0,1", "-2,3", "0,-3"];
  return createExpeditionState({
    ...ORCHARD_LOCKDOWN_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
