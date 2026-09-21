// Little Reckoning, level 1: The Smudged Stones (EXPEDITIONS_BUILD_BRIEF.md §13,
// EXPEDITIONS_SPEC.md §18-19). First E4 proof map for the Little Reckoning tier.
//
// Simplification note: the brief describes "crossing expression paths" (two routes
// sharing a number tile). This first proof map realises a single route of four number
// stones and three operator sockets — exactly the objects/target already authored in
// EXPEDITION_SCENARIOS ({ objects: [3,5,7,9], target: 24 }) — which is the smallest
// faithful slice of "restore missing operators so a path evaluates to 24". The richer
// two-crossing-paths version can extend this without changing the underlying mechanic
// (Reckoner's Reframe action, and the "chain" constraint kind in evaluateObjective).
//
// Round limit (2026-09-16): tightened from 5 to 2 so the map genuinely needs more than one
// hero, per EXPEDITIONS_CARD_COMBAT_CONTRACT.md §9. Restoring all three operators takes
// exactly 3 reframe actions plus at least 2 move actions between them (the operators are
// never mutually adjacent) — 5 actions minimum, needing at least 3 rounds for any single
// hero regardless of stats (AP resets to 2 per hero per round). Three heroes acting in
// parallel finish in round 2 (the existing reference trace), so turnLimit 2 blocks any solo
// attempt without touching the multi-hero solution at all.
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

export const SMUDGED_STONES_CONFIG = {
  id: "lr_smudged_stones",
  moduleKey: "junior",
  title: "The Smudged Stones",
  turnLimit: 2,
  board: radiusBoard(3),
  units: [],
  enemies: [
    { id: "smudge_a", name: "Fog-thumb", hp: 1, maxHp: 1, defence: 4, move: 2, range: 1, damage: 1, initiative: 5, pos: "3,-1", behaviour: "obscure-operator", delay: 2, intent: "Obscure the nearest unguarded operator." },
    { id: "smudge_b", name: "Ashen Print", hp: 1, maxHp: 1, defence: 4, move: 2, range: 1, damage: 1, initiative: 7, pos: "3,-2", behaviour: "obscure-operator", delay: 2, intent: "Obscure the nearest unguarded operator." },
  ],
  objects: [
    { id: "value_3", kind: "number", value: 3, pos: "-3,0", movable: false },
    { id: "op_1", kind: "operator", op: null, pos: "-2,0", movable: false },
    { id: "value_5", kind: "number", value: 5, pos: "-1,0", movable: false },
    { id: "op_2", kind: "operator", op: null, pos: "0,0", movable: false },
    { id: "value_7", kind: "number", value: 7, pos: "1,0", movable: false },
    { id: "op_3", kind: "operator", op: null, pos: "2,0", movable: false },
    { id: "value_9", kind: "number", value: 9, pos: "3,0", movable: false },
  ],
  objective: {
    family: "constraintGrid",
    constraints: [
      { kind: "chain", valueIds: ["value_3", "value_5", "value_7", "value_9"], operatorIds: ["op_1", "op_2", "op_3"], target: 24 },
    ],
  },
  flags: {
    briefing: "Restore the three missing operators so the whole path of stones reads exactly 24, before the Smudges rub them out again.",
  },
};

export function createSmudgedStones(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The Smudged Stones requires exactly three heroes");
  const starts = ["-3,1", "-3,2", "-3,3"];
  return createExpeditionState({
    ...SMUDGED_STONES_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
