// Ninefold Orchard, level 8: The Hollow Bough Awakens (EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md
// §5). New build — the old placeholder brief `po_hollow_bough` ("Keep the memorial hex empty
// and undamaged until the fourth whistle") was never engine-built (checked before starting: no
// hollow-bough.js anywhere in the repo), so this is fresh content, not a replacement, just a
// title/rule update to match the new brief's fuller framing.
//
// The memorial is a plain, non-movable object (`kind: "memorial"`, `damaged: false`) — not a
// unit. A first draft made it a stationary player-side *unit* instead, reusing the "protect"
// family's existing hp check unmodified; that broke ExpeditionBoard.jsx's party panel, which
// zips every player-side unit against the caller-supplied `squad` array of real hero cards and
// crashes reading `.discipline` off the `undefined` match for a fourth, card-less unit —
// caught by running the real render test, not assumed safe. Rebuilt around the object instead,
// which needed two small, precedented engine additions rather than forcing an object into a
// unit-shaped hole: the "protect" family now also fails on a `damaged` object target (the same
// field Mender's Restore already uses to repair objects elsewhere, so Restore needs zero
// changes), and a new `grow-toward` enemy behaviour (Overgrowth's own — modelled directly on
// `obscure-operator`/`steal-highest`'s approach-then-strike shape) damages a single named
// object once adjacent, unless it is guarded or already damaged. Guard and Restore are both
// unmodified, existing actions, satisfying the rest of the brief's stat hook through reuse.
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

export const HOLLOW_BOUGH_AWAKENS_CONFIG = {
  id: "po_hollow_bough",
  moduleKey: "primary",
  title: "The Hollow Bough Awakens",
  turnLimit: 4,
  board: radiusBoard(3),
  units: [],
  enemies: [
    {
      id: "overgrowth",
      name: "Overgrowth",
      hp: 5,
      maxHp: 5,
      defence: 5,
      move: 2,
      range: 1,
      damage: 1,
      initiative: 5,
      pos: "3,-3",
      delay: 1,
      behaviour: "grow-toward",
      targetObjectId: "memorial",
      intent: "Grow towards the memorial and damage it, unless it is guarded.",
    },
  ],
  objects: [
    { id: "memorial", kind: "memorial", pos: "0,0", damaged: false, movable: false },
  ],
  objective: {
    family: "protect",
    targetId: "memorial",
  },
  flags: {
    briefing: "Keep the memorial standing until the fourth whistle — Overgrowth will grow towards it and strike if it's ever left unguarded.",
    // §7's "definition of a completed scenario brief" — pressure lanes: Threat (Overgrowth
    // damages the memorial directly if it's ever left unguarded) and Change (Science's Restore
    // is the only way to undo a strike that gets through).
    pressureLanes: ["threat", "change"],
    heroChain: "A hero screens the memorial with Guard every round Overgrowth is close enough to threaten it, Logic predicts when it will arrive, Science restores any strike that gets through.",
    alternateChain: "Without a dedicated guardian: Overgrowth takes real time to close the distance, so simply reaching the memorial first and holding Guard from round one is enough — no single card identity is required.",
  },
};

export function createHollowBoughAwakens(squad) {
  if (!Array.isArray(squad) || squad.length !== 3) throw new Error("The Hollow Bough Awakens requires exactly three heroes");
  const starts = ["-1,0", "1,0", "-2,1"];
  return createExpeditionState({
    ...HOLLOW_BOUGH_AWAKENS_CONFIG,
    units: squad.map((profile, index) => ({ ...profile, pos: starts[index] })),
  });
}
