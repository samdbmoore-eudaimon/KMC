# Expeditions art handover

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. This is the current asset-package
> handover; `EXPEDITIONS_SCENARIO_ART_MATRIX.md` assigns assets to individual scenarios.

## Current production slice

This package gives Claude a coherent Ninefold Orchard visual slice to wire behind the existing developer gate. It contains 230 individual transparent WebP candidates, one compressed environment plate and a machine-readable manifest. The complete runtime package is 8.64 MiB before application bundling.

Root: `assets/expeditions/production/9fo/`

Manifest: `assets/expeditions/production/9fo/manifest.json`

Preparation command:

```bash
node scripts/prepare_expedition_art.cjs
```

The preparation script is deterministic. It removes generated checkerboard or chroma-key source backdrops, extracts equal atlas cells, trims transparent padding and creates compressed WebP files. Board art uses a 384 by 384 canvas. Button frames use 512 by 192 and readiness meters use 640 by 192. It also converts the environment plate to WebP and regenerates both QA contact sheets.

## Supplied runtime candidates

### Characters

Pip, Nine and Bramble each have:

- Front three-quarter idle
- Rear three-quarter idle
- Action
- Exhausted

The four states use stable paths under `runtime/characters/`. Left-facing poses are mirrored in the renderer.

### Enemy

Hookmole has the same four-state contract under `runtime/enemies/`, plus warning, jam, steal and blocked behaviours. These behaviours are explicit engine telegraphs: do not infer gameplay state from the image filename alone.

Eight additional enemy candidates are supplied with four states each: Rootling, Flockling, Ledger Leech, Widdershins, Thorncap, Pebbleback, Muddlenook and Numbermoth. They are marked `status: proposed` in the manifest. They are visual encounter candidates, not additions to the card collection or story canon until the scenario spec adopts them.

### Complete Ninefold Orchard card roster

All 30 primary card identities now have the same four-state field contract: Pip, Nine, Bramble, Sorrel, Russet, Halfpenny, Wicker, Furrow, Dapple, Bushel, Tuppence, Windfall, Cornix, Thistlewick, Beeswax, Kernel, Millrace, Cobweb, Amberly, Barrow, Driftwood, Gable, Warden, Harvestmoon, Ninebark, Cascade, Longshadow, Gossamer, The Ninefold Tree and The Tenth Scarecrow.

The four field states are front idle, rear idle, action and exhausted. Card portraits remain the fallback when a future state is not appropriate to a particular expedition.

### Operator wheel

The rotating operator mechanism has six visual states:

- Neutral
- Selected
- Rotating
- Locked
- Jammed
- Complete

The artwork contains blank brass plates. Operators, numbers and expressions are live interface text. Normalised centre and edge-plate anchors are stored in the manifest. Claude must rotate the logical edge values with the engine state, not rotate baked text.

### Terrain

The first atlas contains:

- Grass
- Worn path
- Flagstone
- Stream
- Timber bridge
- Stone bridge
- Hedge
- Difficult roots
- Apple-tree obstacle
- Brass objective socket
- Start marker
- Exit arch

Every tile uses the same isometric family and is supplied separately under `runtime/terrain/`.

### Effects

The first effects package contains:

- Neutral figure shadow
- Reachable hex
- Selected hex
- Dangerous hex
- Guard dome
- Impact
- Rotate indication
- Objective complete

### Loads and objective structures

The portable number-load family contains neutral, selected, carried, guarded, split, combined, heavy and delivered states. The main brass plate is blank. Its live value anchor is in the manifest.

The objective family contains:

- A six-state two-pad balance platform
- A four-state tally arch
- Empty and loaded feeder gates
- Locked and open target gates

All totals, targets and expressions remain live text. The artwork must never be used as the source of truth for whether a puzzle is solved.

### Production controls

The interface package contains eight blank button-frame states, eight separate action icons and six card-team readiness states. Claude should compose icon, frame and live label at runtime. The readiness meter is advisory feedback: the engine's authored rarity and stat checks remain authoritative.

### Background

`po-orchard-gorge-v1.webp` is a wide, calm-centred environment plate intended to sit behind independently positioned terrain tiles.

## Wiring order for Claude

1. Load `manifest.json` only inside the developer-gated Expedition route.
2. Render the environment plate as a non-interactive background.
3. Render terrain by stable terrain id and axial position.
4. Depth-sort figures by projected screen y, then board height.
5. Place the shared shadow beneath every figure.
6. Select front or rear pose from movement direction. Mirror only for left-facing movement.
7. Place selection and threat effects between terrain and figures.
8. Draw values, operators, paths and objective text as accessible live UI above the relevant art.
9. Compose controls from a frame, an icon and a live text label. Never bake labels into bitmaps.
10. Drive action, exhausted and enemy telegraph poses from structured engine events.
11. Keep portrait fallbacks until a character has all required field poses.

## Vertical-slice screen pack

Three state-complete screen compositions for The Unequal Crossing are saved under `assets/expeditions/production/9fo/mockups/`:

- `po-unequal-crossing-opening-v1.png`: team on start hexes, crates unclaimed, target arch locked and Hookmole distant
- `po-unequal-crossing-mid-puzzle-v1.png`: Nine carrying a crate, Bramble at a rotated operator, uneven balance platform and Hookmole telegraph
- `po-unequal-crossing-complete-v1.png`: crates delivered, target arch open, balance complete, Hookmole safely blocked and completion panel visible

These are art-direction and layout contracts. Claude should reproduce the state changes with runtime sprites, live labels and accessible DOM controls. The images do not replace the engine or act as a source of truth.

Recommended board-space anchors from the screen pack:

- Keep the board inside the calm central gorge, with the top HUD and bottom action rail outside the board projection.
- Reserve a large empty parchment panel for objective text and completion results. Do not draw score text into the bitmap.
- Use teal for reachable or active spaces, gold for the selected unit or solved mechanism and blue leaf shielding for safe enemy denial.
- Keep the three deployed figures at a common scale. Large environmental props may overlap the board edge, but figures and crates must remain legible at phone width.

Do not import the full source sheets into the application bundle. Import only runtime files that the gated route uses.

## Status and acceptance

These are wiring candidates, not public-release approvals. They are suitable for the private prototype and layout testing. Before release, every asset needs visual review on light terrain, dark terrain, at 96 pixels and at 200 per cent display scaling.

Known review points:

- The generated rear poses are three-quarter turns rather than strict animation turnarounds.
- Fine transparent edges should be checked against both pale and dark backdrops.
- Hookmole's hook, whiskers and crate must remain legible at the intended board scale.
- The four behaviour poses should be checked at the final enemy scale. Jam includes a tall post and blocked includes a wide guard arc.
- Button labels need automated fit tests for `Move`, `Interact`, `Rotate`, `Guard`, `Collect`, `Strike`, `Undo` and `End round` at 200 per cent display scaling.
- Readiness must be announced in words by the accessible interface. Colour and leaf fill count are supplementary.
- Values placed on the operator plates need automated fit tests for `−12`, `÷3`, `×1.5` and `2x−3`.
- Terrain tile footprints need to be measured against Claude's final projection before their board-space offsets are frozen.

## Art requests from Claude

Further requests must include:

- Stable art id
- World and scenario
- Object or character state
- Runtime box
- Required alpha
- Live-text safe area
- Intended board scale
- Whether mirroring is permitted
- Interaction meaning

Example:

```text
artId: po_number_crate
usage: portable numbered load
states: neutral, selected, carried, guarded
runtime box: 384x384
alpha required: yes
live text anchor: centre [0.50, 0.48]
board scale: 0.72 terrain-tile widths
mirroring: permitted
interaction meaning: a character may collect, carry and place this value
```

## Next art slice

The Unequal Crossing and Turning Orchard now have their core object, enemy and control vocabulary. After Claude confirms projection, board scale and overlay anchors, the next useful slice is scenario-specific feedback:

1. Route arrows, ordered checkpoints and delivery-path markers
2. Pressure plates, movable number stones and swap indicators
3. Countdown, action-point and objective-progress frames
4. A compact result screen with first-clear reveal-token treatment
5. One complete in-play composition at target phone and tablet aspect ratios
6. A restrained set of Little Reckoning visual adaptations after the Ninefold slice is accepted

## Production follow-up: projected terrain and chrome (2026-09-16)

The Ninefold Orchard runtime now uses a 0.6 vertical screen projection of the regular
pointy-top axial grid. This is an affine presentation transform, not a change to hex
adjacency or movement. `fitProjectedPointyHexLayout` in
`expeditions/expedition-hex-layout.js` fits the transformed bounds and returns the
projected tile metrics. The six-neighbour shared-edge test covers the projection.
Do not independently stretch individual tile assets or alter their map coordinates.

New raster assets, both referenced from `assets/expeditions/production/9fo/manifest.json`
and `expeditions/expedition-9fo-art.js`:

- `runtime/terrain/po-terrain-pond-v1.png`: opaque top-face texture. A complete pond is
  inset within grass on every edge. Use for an impassable water cell, not a stream join.
- `runtime/terrain/po-terrain-earth-wall-v1.png`: painted soil, stones and grass lip for
  exposed hex side walls. Crop its central painted band at runtime; the source includes
  black space above and below the band.

For The Unequal Crossing, the two existing blocked cells at `0,-3` and `1,-3` use the
pond texture. `-1,-2` uses the existing apple-tree cutout. These are visual mappings of
existing blocked cells, not new terrain rules. The tree is implemented as
`NfoTreeObstacle` in `ExpeditionBoard.jsx`: its root anchor sits on one hex, and the
canopy may extend above it. Reuse the component at a supplied tile position rather than
baking the tree into a terrain bitmap. Difficult cells retain the existing root art,
layered over grass so transparent source margins do not show a flat green wedge.

The same board file contains scalable vector chrome assets as components:
`ExpeditionHudPlaque` (module-specific apple/star/diamond border ornaments),
`NfoNavButton`, `NfoActionButton` (icon and live label inside one SVG surface) and
`NfoActionBar` (carved-wood action frame). Keep live wording out of generated bitmap
frames. The Objective, Round and Party plaques use the module variant in all three
worlds; the Ninefold navigation and bottom action controls are wired in play.

Validation: desktop runtime preview inspected, the End round control advanced Round 1
to Round 2, six geometry tests passed, all five catalogued scenario board renders
passed, the release-gate regression passed (ACC-01 to ACC-06) and the offline build
passed. These assets remain subject to the user's visual audit, especially scale and
occlusion at smaller viewports.

Responsive visual QA was subsequently run at 768 × 1024 and 430 × 900. The phone pass
exposed HUD overflow, now corrected: Objective takes the full first row, Round and Party
share the second, the title wraps below the back button, the board uses tighter fit
padding and the action buttons shrink inside their frame. The viewport was reset to
desktop after QA. The screen render, geometry tests and offline build passed again.
The Unequal Crossing now outlines both engine-owned hexes on each weigh platform with
an exact projected brass hex border. The dial and engine-owned `currentTotal/target`
appear on the first cell; the second has the same brass border so it is visibly a valid
load destination. These are non-interactive presentation overlays, not new board cells.
The larger balance illustration remains in the Objective drawer.

The scale engine contract has now landed. The board renders one brass hex prop per
engine-owned impassable scale cell, with a live dial and two small load-value slots.
The surrounding six hexes remain the hero approach positions. Clicking the scale
while carrying places that load; clicking a loaded scale retrieves it or opens a
specific-load choice if both slots are occupied. The earlier two outlines are gone.
This is still vector presentation art; a more detailed sprite can replace it later
without changing the footprint, state source or interaction.

Carrying art status: Pip, Nine and Bramble already had individual poses. New
individual poses for Sorrel, Russet, Halfpenny, Furrow and Dapple are now saved as
`runtime/characters/po-<id>-carry-v1.png`. Each passed PNG RGBA and transparent-corner
checks before being added to the manifest. `expedition-9fo-extra-art.js` wires their
carry files and the existing idle cutouts for all 27 other Ninefold cards. The 22
characters still missing bespoke carry poses currently show the existing carried-load
prop over their idle cutout, so every card has a visible carrying state. This is an
interim runtime composite, not a finished bespoke sprite. Do not use the opaque
imagegen drafts: the tool repeatedly baked an RGB checkerboard into those files.

The offline bundle was rebuilt successfully after the one-hex scale and carrying
changes. The preview generator accepts a `?squad=wicker,dapple,bushel` query so any
three-to-five-card roster can be inspected without changing playable defaults.
The five new carry cutouts passed `scripts/validate_expedition_alpha.cjs` on
2026-09-16. Bespoke art for the other 22 remains a production backlog; the runtime
composite is deliberately labelled as interim in the code and this handover.
The alternate `wicker,dapple,bushel` preview was visually checked: Dapple picks up
the 2-load, its crate disappears from the board, her carrying composite appears and
her AP falls from 2 to 1. The preview was then restored to Pip, Bramble and Nine.
Bushel's candidate carrying pose was deliberately rejected after both generation
and one extraction pass produced an opaque RGB checkerboard; it was not copied into
the game or manifest. Do not attempt further extraction of that draft without a
reliable alpha method.

The 2026-09-16 visual pass reduced character art and stands by 20%, reduced the tree
prop and feathered its source background so it reads as an obstacle on a cell. Terrain
tops now use an overscanned grass underlay beneath softly masked variant art, including
the roots. The top-face outline uses the projected vertical dimension (`sideY`), not
the unprojected hex side. This removes the flat green margin wedges and misaligned
outlines seen in the review crops. Keep the same base/overlay composition when adding
new terrain variants; opaque source imagery is still preferred for repeatable art.

The two raster assets above were made with the built-in imagegen tool. Their final
generation prompts were:

```text
Use case: stylized-concept. Asset type: Ninefold Orchard tactical board terrain texture, to be cropped to a pointy hex by the game. Input image: the existing orchard grass tile is a style reference only, not the edit target. Primary request: a single self-contained small orchard pond entirely enclosed by grassy banks, with calm clear blue-green water, a few submerged pebbles and soft ripples. Style: the same detailed warm, painterly, modern illustrated game art as the reference. Composition: perfectly overhead flat terrain surface filling a square image, pond oval centred and comfortably inset from every edge; uninterrupted grass on all four outer edges so no water can bleed into neighbouring hexes. NO isometric vertical cube, NO side walls, NO horizon, NO background scene, NO bridge, NO text, NO border, NO transparency. The pond must be recognisable at small tactical-grid size.

Use case: stylized-concept. Asset type: repeatable side-wall texture for Ninefold Orchard faux-3D tactical hex tiles. Input image: existing orchard hex grass tile is a style reference only, not an edit target. Primary request: a seamless horizontally repeatable close-up of earthy orchard soil and embedded irregular rounded stones, warm umber and ochre earth, small roots, a thin mossy grassy lip across the top. Style: same polished painterly illustrated game art as reference, warm natural light. Composition: straight-on side elevation, a broad horizontal strip with no perspective cube, no top face, no diagonal seams. Must read clearly at 20-40 pixel height and repeat along many hex side walls. No grey masonry lines, no checkerboard, no text, no transparent background, no border, no shadows cast outside the tile.
```
