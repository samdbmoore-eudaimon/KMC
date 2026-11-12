# Orchard v2: Codex artwork packet

Version 1.0, 1 October 2026. Codex owns all artwork, visual direction, asset preparation and visual acceptance. Under coordination revision1.1, Codex also owns v2 rendering, manifests/import registries, layer positioning, interaction and wiring. Claude owns the core engine and App/progress integration. Codex must align art to logical geometry rather than change engine rules to make an image fit. Claude must not generate replacement art or crop a source contact sheet at runtime.

Read the master brief, v2 implementation/generation specs, asset audit and visual acceptance document first. The v2 rule/data layer owns every digit, mathematical operator, arrow direction, health value and readiness message. Art must leave safe areas for live overlays.

## 1. Existing asset selection

Do not import the whole runtime directory. Select one approved version for each state and preserve originals. The audit inventory provides dimensions, bytes and current registry references. Supply a delivery metadata file outside the authoritative manifest; Codex integrates the selected v2 records after QA; Claude retains ownership of legacy/shared integration files.

| Use | Existing source under `assets/expeditions/production/9fo/runtime/` |
|---|---|
| Base field | `terrain/po-terrain-hex-grass-v3.webp`, path, flagstone, hedge, roots, stream, bridge, tree, start/exit |
| Heroes | All30 hero five-pose files in `characters/`; do not generate new heroes |
| Enemies | Hookmole idle/action/jam/hit/defeated, Scruffcrow perch/peck/flee, Strawling idle/telegraph/hit/defeated, Crosswind PNG states |
| Sudoku | `mechanisms/po-hive-ledger-board-v1.png`, corruption and solved-cell; living gate/root barrier |
| Rotation | `mechanisms/po-current-turner-hex-v1.png`, operator neutral/selected/rotate/locked/jammed/complete WebPs; wind dial v2 |
| Balance | balance six-state WebPs, one-hex scale states, number-load states, burrow |
| Nonogram | whistle tower v2, Finch v2 if a perch figure is needed, stormfront v2, wind dial v2 |
| Packing | living branches, memorial hex, root-fall marker, overgrowth forecast/damage |
| UI | Selected existing card/action/intent/calculation/stat-preview/round/result frames and heart/AP badges |

Simple placeholder SVGs are not the desired final visual style. Reuse illustrated gates with live labels before requesting a complete new set. Pond/earth-wall opaque rectangles are scenic layers only unless correctly clipped by the renderer. Detached fragments in older tiles/enemies must be inspected and cleaned in new versioned derivatives. Do not overwrite unrelated approved source assets.

Core squads deliberately differ from the earlier Cornix/Kernel/Beeswax demo. All30 characters need working state mappings, not just the reference three. A hero may have idle, rear, action and exhausted states; carry poses exist but v2 does not use carrying. They need not be loaded into this release's selected bundle.

## 2. New art request, in priority order

Only these structural gaps justify initial new illustrations. Live geometry may provide an interim implementation so coding is not blocked by generation.

| ID | Deliverable | Required design / states |
|---|---|---|
| ASSET-01 | Six-sector equation overlay | Brass/orchard frame with six blank readable sectors, centre hub and transparent outside. Neutral, selected, locked, jammed. No digits/operators. Rotation occurs in code. Fixed reading pointer is a separate layer. |
| ASSET-02 | Clean pointy-top mechanism plinth | A neutral top surface for wheel/station overlays, matching true pointy-top projection and raised terrain. Normal and damaged. No perspective distortion of the logical face. |
| ASSET-03 | Three operating-station skins | Meter/ledger bus, brace joint and root/wind maintainer, visually distinct at small size. Each neutral, charged, held, damaged; reuse existing scales/tower/tree wherever that makes the new asset redundant. Do not make three identical locked doors. |
| ASSET-04 | Packing clearing/socket details | Small orchard socket and branch anchor skins. Live polyhex outlines remain code; do not paint specific shapes or occupied cells. Neutral, covered and threatened cues can be drawn with existing effects. |
| ASSET-05 | Ability-hand frame and spent treatment | Reuse hero/action frames first. At most one compact frame and exhausted overlay; text/icons are live. No new 50-card illustrated ability set. |

ASSET IDs identify deliverables; ART-01..03 in the delivery board identify work tasks. Produce ASSET-01/02 first. ASSET-03/04/05 require an actual rendering gap identified in the v2 renderer; otherwise mark fulfilled-by-reuse. No new backgrounds, hero sets or enemy factions are required for v2. Prefer a consistent gorge/cider/ravine palette over five unrelated painted scenes.

## 3. Technical art contract

Raster assets: transparent WebP, sRGB, maximum384×384 for individual figures/props,512×512 for rotating frame,512×192 for a wide small UI frame. Scene backgrounds max1600×900. Retain high-resolution source outside selected runtime imports. Typical figure≤70 KiB, mechanism≤100 KiB, frame≤50 KiB, background≤300 KiB. Exceptions need bytes, visible-size rationale and product-owner approval in the delivery board, not an unexplained2 MiB image.

The wheel is viewed top-down in its overlay plane, with six sector centres at angles `-90+i*60` degrees. Rotate only the inner frame/sector group. The fixed pointer and glyph text are separate. Slot centres and a label-safe radius must be documented; readable live glyphs are never obscured by decorative leaves. A border/surface may be bitmap art, but logical hex outlines and sectors remain exact code geometry.

Pointy-top plinth's measured top polygon must have width `sqrt(3)*s`, height `2*s`, with uniform scaling. Example source layout: top centre(192,168), side160, vertices(192,8),(330.56,88),(330.56,248),(192,328),(53.44,248),(53.44,88), with a decorative wall below to y368. Metadata separates top centre from sprite ground anchor. The engine projects its own polygon; no image dimensions change neighbour relations.

For each delivered asset, provide a JSON record:

```js
{
  id, version, sourcePath, runtimePath, width, height, bytes,
  sha256, alpha: true,
  visibleBounds: [left,top,right,bottom],
  groundAnchor: [x,y], topCentre: [x,y],
  overlayAnchors: { /* sectorCentres, labelSafeAreas, etc */ },
  allowedStates, reviewStatus: 'candidate'|'accepted',
  qaPaths: {white,black,green,cyan,atRuntimeScale}
}
```

All coordinates in metadata are source pixels. Renderer converts them using one uniform scale and world anchor. Different state files must align to the same ground/top centre. Any source cropping is performed offline and reflected in those coordinates.

Record `candidate` until alpha checks, detached-component review, white/black/green/cyan inspection and native/max-zoom previews pass. A boolean alpha channel alone is insufficient. Palette, outlines, faux depth and soft ground shadows match the existing Orchard art. The board owns depth ordering by projected ground y then layer/entity ID.

## 4. Layer interface for the Codex v2 renderer

Order: background; terrain wall/top art; exact reachable/danger polygons; puzzle links and socket outlines; props; hero/enemy sprites with ground shadows; rotary inner frame; upright active/inactive glyphs and fixed pointer; intent/world labels; untransformed HUD/drawers. Exact per-object z-order can move a wheel under a sprite when the hero stands there, but glyph labels must remain discoverable in selected detail. Decorative art never catches pointer events.

State mapping is driven by events/state, not timers guessing when an action happened. Return to idle after an animation without losing exhausted/held status. CARRY is unused in v2. Defeated Hookmole/Strawling choose supplied defeat pose; Scruffcrow uses flee. Missing accepted pose falls back to accepted idle plus live state marker and a logged integration issue, never an emoji claiming polished acceptance.

The selected incremental Orchard-v2 art budget is ≤12 MiB before base64 expansion, including selected hero poses and reused art attributed to this mode. The whole HTML must be measured before/after; do not promise12 MiB total app size. If the selected package exceeds budget, optimise or reduce redundant imported states before requesting an exception. Art already shared by other screens is counted once for bundle analysis.

## 5. Codex handoff and completion

Write `docs/expeditions/v2/art-delivery.json`, contact previews and QA evidence under a versioned production/QA folder. Codex integrates these records into its owned v2 art manifest/import registry. Do not edit legacy root registries; request any necessary shared integration from Claude with exact IDs and metadata. Preserve old file paths so legacy scenes keep rendering.

A completion report names delivered IDs/states, replaced/reused candidates, bytes before/after, missing poses, anchor contract, QA evidence and unresolved gaps. Update the Codex task row and post the report in the shared delivery board. Visual QA includes real renderer screenshots produced by Codex through Claude's private App adapter at phone/tablet/desktop sizes; beautiful isolated artwork is not sufficient.

Generation agent must use the imagegen skill/tool for genuinely new bitmap art, and inspect existing local images before editing. Geometry-native outlines/text/ports belong in the renderer. The present document is an art request; it does not claim new images have been produced.
