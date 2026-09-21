# Ninefold Orchard Expedition visual acceptance

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. Match scenario-specific props and
> effects to `EXPEDITIONS_SCENARIO_ART_MATRIX.md`; this file governs visual quality and
> geometry acceptance.

## Canonical reference

`assets/expeditions/production/9fo/mockups/po-unequal-crossing-opening-v1.png`
is the composition and readability target for The Unequal Crossing. It is not a
runtime bitmap. All information must continue to come from the expedition state.

## Board rules

- The battlefield is an axial hex map. Every visible walkable tile is a raised,
  six-sided hex prism, never an isometric square, diamond, cube or rectangle.
- Terrain art, hit area and movement effects are separate layers. The visible art
  must not be clipped by the hit-area mask.
- The hit area uses a six-sided polygon. A click in transparent square padding
  around a hex must not select that tile.
- Every generated transparent asset must pass
  `node scripts/validate_expedition_alpha.cjs <asset>` before it is imported.
  Checkerboard pixels are a hard failure, even if a file technically has an alpha
  channel at its outer edge.
- Reachable, selected and danger states use hex-shaped art only. No CSS rectangle,
  box shadow or border may be used to imply a tactical tile state.
- Adjacent axial coordinates must meet as an intelligible hex field. Depth sorting
  is based on projected screen y so rear tile walls do not cover front units.
- The rejected percentage positioning formula must not be restored. Presentation uses
  a regular pointy-top pixel projection with side length `s`: top face width
  `sqrt(3) × s`, top face height `2 × s`, horizontal centre spacing
  `sqrt(3) × s`, vertical centre spacing `1.5 × s` and alternate-row offset
  `sqrt(3) × s / 2`.
- Axial coordinates project as `x = originX + sqrt(3) × s × (q + r/2)` and
  `y = originY + 1.5 × s × r`. The entire board chooses one responsive value of
  `s`; x and y spacing may not be scaled independently.
- Faux-3D depth begins below the measured top face. It must not alter tile centres,
  hit polygons, movement overlays or unit and prop ground anchors.
- Verify changes with `node --test scripts/test_expedition_hex_layout.mjs` and
  `node scripts/render_expedition_hex_qa.cjs`, then inspect
  `assets/expeditions/production/9fo/qa/hex-projection-v4.png`.

## Figure and load rules

- A figure is a transparent sprite above a shared circular or oval field base and
  shadow. Portrait frames and capsule wrappers are prohibited on the board.
- State art is chosen from engine state: idle, rear-facing, action, carrying,
  exhausted and enemy telegraph where available.
- The portable load keeps its live numerical value visible on the brass plaque.
  Values are accessible DOM text but must visually appear engraved into the prop.
- A carried load removes the map load and selects the carrying pose of the hero.
  Pip, Bramble and Nine have carry-state candidates under
  `runtime/characters/po-*-carry-v1.webp`.

## Objective and action rules

- The two brass balance platforms and tally arch appear on the board itself.
  Their totals, status and lock state are live text over state-driven art.
- A carrying hero must be given an unmistakable route cue to a valid platform.
- The top HUD is concise. The bottom rail holds contextual actions. Detailed party
  and objective information belongs in drawers, not permanent board-side columns.

## Required review states

Capture and review screenshots for:

1. Opening deployment and reachable movement spaces
2. Load selected
3. Pip carrying a load
4. Bramble carrying a load
5. Nine carrying a load
6. One platform underweight
7. Both platforms balanced and the arch open
8. Hookmole warning and steal behaviour
9. Exhausted hero
10. Narrow tablet layout

No further Expedition art or scenario additions are approved until all ten states
are reviewed against the canonical reference.
