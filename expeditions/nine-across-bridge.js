// Ninefold Orchard, level 3: Nine Across the Turning Bridge (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md
// §5 supersedes the original "Nine Across the Bridge" design; expedition-data.js's
// po_nine_across brief title/rule updated to match). Rebuilt on the rotation-hex primitive
// (2026-09-17 handover, Build A) per Sam's explicit instruction — "bridge hexes rotate with the
// wind, changing capacity routes."
//
// Three loads (2, 3, 4) must still all reach the far orchard while neither bridge section's
// live carried weight ever exceeds nine — the same `capacityLimits` mechanism and the same
// honest note as before: 2 + 3 + 4 = 9 exactly, so no arrangement of these three loads alone
// can ever exceed a section's raw cap. What is new is that each section's cap is now gated by
// its own wind vane's live orientation (`objective.capacityLimits[i].openWhenOrientation`, a
// new small extension to evaluateObjective) — a section open at orientation 0, otherwise its
// effective cap is zero, so sending any load into a closed section is an immediate, fully
// visible failure, never a hidden one.
//
// Two rotation-hex "wind vane" objects gate the two sections, both ordinary (not jammed) —
// checked directly against the loan squad before deciding this, not assumed: Pip (Mender) and
// Nine (Scout) are neither the Reckoner role nor Geometry discipline, and Bramble, the squad's
// only Reckoner (role "wizard"), is Science discipline, not Geometry. Reframe is role-gated,
// not stat-gated, so Bramble can freely turn either vane — but a `jammed: true` vane's Force
// Rotate is genuinely discipline-gated (`useDisciplineAction`'s `discipline === "geometry"`
// check), which nothing in this loan squad could ever pass. The "Geometry checks can rotate a
// jammed heavy tile" half of the primitive is real and tested (see expedition-actions.test.js)
// but deliberately not used on this early map for that reason — it is a better fit for a later
// map whose expected squad actually includes a Geometry specialist (The First Whistle, level
// 10, names Geometry directly in its own stat hook).
//
// Crosswind (new `gust` enemy behaviour) turns the nearest still-open, unprotected vane one
// step away from 0 once its delay has passed. Science's Stabilise ("holds a wind vane")
// protects one from that for a round, exactly like it already protects any other
// rotatable/changeable object in this project — available here via either Pip or Bramble,
// both Science discipline. This replaces the original "sidewind" push mechanic entirely — that
// behaviour and its dedicated tests are removed outright (see the engine changelog), not left
// in as orphaned dead code, since nothing else in the project used it.
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

export const NINE_ACROSS_BRIDGE_CONFIG = {
  id: "po_nine_across",
  moduleKey: "primary",
  title: "Nine Across the Turning Bridge",
  turnLimit: 4,
  board: radiusBoard(2),
  units: [],
  enemies: [
    {
      id: "crosswind",
      name: "Crosswind",
      hp: 2,
      maxHp: 2,
      defence: 4,
      move: 0,
      range: 1,
      damage: 1,
      initiative: 5,
      pos: "-1,0",
      delay: 1,
      behaviour: "gust",
      vaneIds: ["vane_near", "vane_far"],
      intent: "Turn the nearest open, unprotected wind vane one step, closing its bridge section.",
    },
  ],
  objects: [
    { id: "crate_2", kind: "load", value: 2, pos: "-2,0" },
    { id: "crate_3", kind: "load", value: 3, pos: "-2,1" },
    { id: "crate_4", kind: "load", value: 4, pos: "-2,2" },
    // Placed off the direct r=-1..1 crossing rows, adjacent to their own section and to each
    // other, so reaching either never blocks or detours the loads' own route.
    { id: "vane_near", name: "Near wind vane", kind: "vane", pos: "0,-2", orientation: 0, tracks: [[0, 3]] },
    { id: "vane_far", name: "Far wind vane", kind: "vane", pos: "1,-2", orientation: 0, tracks: [[0, 3]] },
  ],
  objective: {
    family: "delivery",
    destinationHexes: ["2,-2", "2,-1", "2,0"],
    count: 3,
    capacityLimits: [
      { label: "the near bridge section", hexes: ["0,-1", "0,0", "0,1"], max: 9, openWhenOrientation: { objectId: "vane_near", orientations: [0] } },
      { label: "the far bridge section", hexes: ["1,-1", "1,0", "1,1"], max: 9, openWhenOrientation: { objectId: "vane_far", orientations: [0] } },
    ],
  },
  flags: {
    briefing: "Carry all three loads across to the far orchard. A closed wind vane shuts its whole bridge section to any weight at all.",
    // §7's "definition of a completed scenario brief" — pressure lanes: Shape (turning a vane
    // is a spatial, adjacency-gated action) and Change (Crosswind closes a section over time,
    // so timing and Science's Stabilise matter). Number (the capacity maths itself) stays
    // undeclared as a pressure since these three loads can never mathematically exceed a raw
    // cap — the same honest note the original design already carried.
    pressureLanes: ["shape", "change"],
    heroChain: "Science stabilises the far vane against Crosswind, Speed relays the last load across while it holds, the Reckoner turns the near vane back open the moment it closes.",
    alternateChain: "Without a hero free to mind the vanes: the party can simply finish crossing before Crosswind's one-round delay expires, or accept a section closing late once nothing of value is still inside it.",
  },
};

export function createNineAcrossBridge(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("Nine Across the Turning Bridge requires exactly three heroes");
  const starts = ["-2,0", "-2,1", "-2,2"];
  return createExpeditionState({
    ...NINE_ACROSS_BRIDGE_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
