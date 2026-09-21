// Gifford, level 1: The Examination Clock (EXPEDITIONS_BUILD_BRIEF.md §14,
// EXPEDITIONS_SPEC.md §18-19). First E4 proof map for the Gifford tier.
//
// Simplification note: the full brief imagines three stations processing four tasks in
// sequence, with idle time between them. This engine has no notion of a hex holding more
// than one object at a time, so a literal "three shared stations" model would need a
// process-then-clear mechanism that does not exist yet. This proof map instead gives each
// task its own station bay (four bays, not three), keeping the real mechanic intact — an
// "optimise" objective where every task must be delivered and the summed duration must
// not exceed the deadline (§16 Efficiency) — without inventing hex multi-occupancy. A
// true shared-station model can follow once that mechanism exists.
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

export const EXAMINATION_CLOCK_CONFIG = {
  id: "gf_examination_clock",
  moduleKey: "intermediate",
  title: "The Examination Clock",
  turnLimit: 5,
  board: radiusBoard(3),
  units: [],
  enemies: [
    { id: "proctor_a", name: "Proctor Weft", hp: 3, maxHp: 3, defence: 6, move: 1, range: 1, damage: 1, initiative: 6, pos: "3,-2", delay: 1, intent: "Advance on the nearest hero and block the station." },
    { id: "proctor_b", name: "Proctor Sill", hp: 3, maxHp: 3, defence: 6, move: 1, range: 1, damage: 1, initiative: 8, pos: "3,-3", delay: 1, intent: "Advance on the nearest hero and block the station." },
  ],
  objects: [
    { id: "task_a", kind: "task", value: 2, pos: "-1,0" },
    { id: "task_b", kind: "task", value: 3, pos: "-1,1" },
    { id: "task_c", kind: "task", value: 3, pos: "-1,2" },
    { id: "task_d", kind: "task", value: 4, pos: "-1,3" },
  ],
  objective: {
    family: "optimise",
    destinationHexes: ["2,0", "2,1", "1,2", "0,3"],
    requiredCount: 4,
    target: 12,
  },
  flags: {
    briefing: "Deliver all four tasks to their station bays before the twelfth bell — the combined processing time must not pass 12.",
  },
};

export function createExaminationClock(squad) {
  if (!Array.isArray(squad) || squad.length !== 4) throw new Error("The Examination Clock requires exactly four heroes");
  const starts = ["-3,0", "-3,1", "-3,2", "-3,3"];
  return createExpeditionState({
    ...EXAMINATION_CLOCK_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
