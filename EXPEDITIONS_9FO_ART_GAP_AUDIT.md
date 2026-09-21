# Ninefold Orchard Expedition art gap audit

17 September 2026. This is an inventory, not a release approval or an instruction to build all assets at once.

## 18 September update: Maps 1–3 runtime candidate

The inventory below describes the position when the art was first produced. It is historical,
not the current wiring status. A separate `expeditions/expedition-9fo-scene-art.js` now imports
the Map 1 scale/burrow, Map 2 press/basket/gate/flow/Scruffcrow, Map 3 turner/vane/alcove/
Crosswind, dedicated backdrops, wide hero frame, action log plaque and 24 fixed action-button
images. `ExpeditionBoard.jsx` selects those assets by scenario or object/enemy identity. The
generated manifest remains unchanged, deliberately: its source says not to hand-edit it and
its generator is unavailable. The runtime candidate is therefore present and bundled, but
not yet a visually accepted or complete scenario.

The board preview bundles successfully. The new images were checked with the existing alpha
script and representative four-background visual composites. That script flags 19 pale images
(including the cider flow arrow, Crosswind and selected/disabled buttons) because it counts
light pixels inside the painted object as possible checkerboard. Inspection of their actual
alpha and composites shows transparent corners and no rectangular studio background. This
does **not** replace final board-scale review, especially at the edge of effects and labels.

Current open presentation work: review the three scenarios in the actual app; confirm press,
scale, vane, hero and enemy anchors at small and large viewports; make the Cider gate's two
placement hexes unambiguous; replace remaining generic contextual button/dialog treatments;
and add clear flood-lane feedback if the scenario mechanic is revised. Cider Run still shares
a radius-three all-clear board and old exact-sum pickup/drop loop with its predecessor. Its
distinct hazard is delayed until round three, while its generated reference solution can
finish in round two. It must not be called complete on the strength of the art wiring.

## Progress log

### Shared action buttons: full fixed-image set

Status: **full action-button set created, awaiting final visual and alpha QA**.

The first composited samples were rejected during visual review because the icon did not
sit correctly in the medallion and the label safe area was not faithful to the reference.
Those v1 samples are superseded. A new Move normal-state sample was edited directly from
the existing 9FO OK button, preserving its integrated medallion, carved timber, apple and
leaf ornament, brass treatment, proportions and serif lettering. No costs, AP, HP or other
changing values are baked into the image.

New sample:

- `assets/expeditions/production/9fo/runtime/ui/po-action-move-normal-v2.png`

The six v1 composites remain outside the manifest and must not be used.

Assets:

- `assets/expeditions/production/9fo/runtime/ui/po-action-move-normal-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-move-selected-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-move-disabled-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-pick-up-normal-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-pick-up-selected-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-pick-up-disabled-v1.png`

The v2 Move normal sample passes `scripts/validate_expedition_alpha.cjs`. The complete
eight-action set now exists in normal, selected and disabled variants. The normal variants
pass alpha preflight. The state variants are held outside the runtime manifest pending a
final alpha-safe pass and board-scale review.

Follow-on v2 state candidates are also saved for review:

- `assets/expeditions/production/9fo/runtime/ui/po-action-move-selected-v2.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-move-disabled-v2.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-pick-up-normal-v2.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-pick-up-selected-v2.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-pick-up-disabled-v2.png`

The normal Move and Pick up samples and both Move state samples pass alpha preflight. The
Pick up selected and disabled candidates are visually usable but are held back because the
current alpha checker flags their intentionally pale/neutral panel treatment. They require
one more alpha-safe finishing pass before manifest entry.

Additional normal-state assets now complete the set:

- `assets/expeditions/production/9fo/runtime/ui/po-action-put-down-normal-v2.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-guard-normal-v2.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-attack-normal-v2.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-rotate-normal-v2.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-undo-normal-v2.png`
- `assets/expeditions/production/9fo/runtime/ui/po-action-end-round-normal-v2.png`

Selected and disabled v2 variants were produced for all eight actions from their approved
normal artwork, preserving exact wording and layout. The set remains a presentation
candidate until the state variants complete alpha-safe finishing and runtime-size review.

### Top-right action-log plaque

Status: **created, awaiting runtime-size review**.

`assets/expeditions/production/9fo/runtime/ui/po-action-log-plaque-v1.png` uses the
existing 9FO Name Frame as its style reference. It provides a wide blank parchment area
for live action-log entries and a shallow blank header tab. It contains no baked text or
icons and is intended to be populated by live UI text. It is not in the runtime manifest yet.

### Map 1 one-hex brass scale

Status: **created, awaiting runtime-size and board-anchor review**.

`assets/expeditions/production/9fo/runtime/objectives/po-unequal-crossing-scale-one-hex-v1.png`
is a single dedicated brass scale prop derived from the existing balance objective style.
It has a clear one-hex footprint, a blank central pan for live value overlays and transparent
corners. It is not in the runtime manifest yet.

The accompanying state candidates are now also present: `po-unequal-crossing-scale-under-v1.png`,
`po-unequal-crossing-scale-overloaded-v1.png` and `po-unequal-crossing-scale-arch-open-v1.png`.
The base image is the balanced state. All four pass alpha preflight; they remain outside the
manifest pending board-scale review and confirmation that the live value anchor stays legible.

### Map 1 Hookmole burrow

Status: **created, awaiting runtime-size and board-anchor review**.

`assets/expeditions/production/9fo/runtime/objectives/po-unequal-crossing-burrow-v1.png`
is a dedicated roots-and-earth burrow entrance prop in the existing 9FO terrain style. It
contains no creature or baked state label, has transparent corners and is sized as a compact
board prop rather than a full terrain tile. It is not in the runtime manifest yet.

### Wider hero card frame

Status: **created, awaiting runtime-size review**.

`assets/expeditions/production/9fo/runtime/ui/po-hero-card-frame-wide-v1.png` uses the
existing 9FO Name Frame as its style reference. It provides one large portrait medallion,
a wide live-name plaque sized for “The Tenth Scarecrow”, and two empty live-stat medallions
for AP and HP. It contains no baked portrait, name, numbers or labels and passes alpha
preflight. It is not in the runtime manifest yet.

### Map 2 Cider Run backdrop

Status: **created, awaiting board-scale and readability review**.

`assets/expeditions/production/9fo/runtime/backgrounds/po-cider-run-press-lane-v1.png`
is a dedicated orchard press lane with presses, baskets, apple crates, a crossing stream and
harvest gate. The central lane is intentionally open for the tactical board overlay. It is
not in the runtime manifest yet.

The standalone press prop `assets/expeditions/production/9fo/runtime/objectives/po-cider-press-v1.png`
is also created and passes alpha preflight. Its front tray is kept clear for live cider/value
overlays. It remains outside the manifest pending board-scale review.

The separate harvest basket `assets/expeditions/production/9fo/runtime/objectives/po-cider-apple-basket-v1.png`
is also created and passes alpha preflight. It is a reusable live-placement prop and remains
outside the manifest pending board-scale review.

The reusable flow cue is now supplied as the transparent vector
`assets/expeditions/production/9fo/runtime/effects/po-cider-flow-arrow-v1.svg`. Two raster
attempts were held out after alpha preflight found hidden opaque background pixels; the vector
version avoids that defect and remains outside the manifest pending board-scale review.

The named enemy's perch candidate is now present as
`assets/expeditions/production/9fo/runtime/enemies/po-scruffcrow-perch-v1.png`; it passes alpha
preflight and remains outside the manifest pending runtime identity and scale review.

Scruffcrow's peck and flee candidates are now also present as
`po-scruffcrow-peck-v1.png` and `po-scruffcrow-flee-v1.png`; both pass alpha preflight and
remain outside the manifest pending runtime review.

The cider/value-change cue is supplied as the transparent vector
`assets/expeditions/production/9fo/runtime/effects/po-cider-value-change-v1.svg`. Its raster
candidate was held out after alpha preflight found hidden opaque background pixels. The vector
version remains outside the manifest pending board-scale review.

The harvest gate is supplied as the transparent vector
`assets/expeditions/production/9fo/runtime/objectives/po-cider-harvest-gate-v1.svg`. The
generated raster gate was held out because its studio background remained opaque. The vector
version remains outside the manifest pending board-scale review.

### Map 3 Nine Across the Turning Bridge backdrop

Status: **created, awaiting board-scale and readability review**.

`assets/expeditions/production/9fo/runtime/backgrounds/po-nine-across-wind-ravine-v1.png`
is a dedicated wind ravine with a readable turning bridge, wind vane, safe alcove and open
central approach. It is not in the runtime manifest yet.

The dedicated current-turner mechanism
`assets/expeditions/production/9fo/runtime/mechanisms/po-current-turner-hex-v1.png` is now
created and passes alpha preflight. It uses the existing operator-wheel language, has six
edge ports and a live-direction centre arrow. It remains outside the manifest pending board-
scale and rotation-anchor review.

The dedicated safe alcove prop
`assets/expeditions/production/9fo/runtime/objectives/po-wind-safe-alcove-v1.png` is now
created and passes alpha preflight. It is an isolated rocky shelter with a timber canopy,
lantern and bench, and remains outside the manifest pending board-scale review.

The Crosswind idle concept is supplied as the transparent vector
`assets/expeditions/production/9fo/runtime/enemies/po-crosswind-idle-v1.svg`. The generated
PNG concept was held out after alpha preflight found hidden opaque pixels. Transparent vector
telegraph, hit and defeated states now exist at
`assets/expeditions/production/9fo/runtime/enemies/po-crosswind-telegraph-v1.svg`,
`assets/expeditions/production/9fo/runtime/enemies/po-crosswind-hit-v1.svg` and
`assets/expeditions/production/9fo/runtime/enemies/po-crosswind-defeated-v1.svg`. All four
remain outside the manifest pending identity, board-scale and state review.

The separate brass wind vane is supplied as the transparent vector
`assets/expeditions/production/9fo/runtime/objectives/po-wind-vane-v1.svg`. It remains outside
the manifest pending board-scale and direction-anchor review.

## Sources and precedence

Compared `EXPEDITIONS_MASTER_BRIEF.md`, `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md`, `EXPEDITIONS_SCENARIO_ART_MATRIX.md`, `EXPEDITIONS_ART_HANDOVER.md`, `EXPEDITIONS_ART_PIPELINE.md` and `EXPEDITIONS_VISUAL_ACCEPTANCE.md` against `assets/expeditions/production/9fo/manifest.json` and its runtime files. The revised experience brief and scenario matrix supersede older map pitches. Sam's later, explicit requirement for **one finished, static image per action button, including its icon and label**, supersedes the old art-handover instruction to assemble buttons with live labels. Dynamic numbers, AP, HP, objective values and formulas remain live UI.

## What exists

- The runtime folder has 244 files; 242 are referenced by the manifest and every referenced path exists. The two unlisted files are an older gorge PNG and older hex-grass WebP.
- All 30 collectible Ninefold characters have front idle, rear idle, action and exhausted candidates. Eight have a bespoke carry candidate: Pip, Nine, Bramble, Sorrel, Russet, Halfpenny, Furrow and Dapple. The other 22 use an interim idle-plus-load composite.
- One orchard-gorge backdrop; grass, path, flagstone, stream, bridge, hedge, roots, pond, tree and related terrain candidates; an earth-wall strip; eight general effects; eight blank button frames and eight separate action icons.
- Number loads in eight states, an operator wheel in six states, balance artwork in six states, tally arch in four states, two feeder-gate states and two target-gate states.
- Hookmole has front/rear idle, action, exhausted, warning, jam, steal and blocked art. Eight other four-state enemy candidates exist, but they are marked **proposed** and do not correspond to most named enemies in the new ten-map matrix.
- Existing Ninefold UI art outside this manifest includes Back, OK, Cancel and a narrow character name frame. The current board also draws some controls and the one-hex scale procedurally. These are not completed static action-button or scale assets.

Presence is not approval: visual fit, alpha, anchor, phone-scale legibility and the ten required review states still need checking.

## Missing shared presentation kit

| Need | Present position | Gap |
|---|---|---|
| Finished action buttons | Blank frames plus separate icons | Bake icon and words into each fixed image: Move, Pick up, Put down, Guard, Attack, Rotate, Undo, End round, plus contextual controls. Make normal, warm-gold selected and disabled states. Do not bake variable costs or values. |
| Wider hero card | Narrow existing name frame | Wider themed frame accommodating “The Tenth Scarecrow”, portrait, AP and HP without overlap. AP/HP remain live. |
| Compact HUD and action log | Existing partial frames/procedural presentation | Themed action-log plaque for the top-right HUD; objective and round frames; coherent bottom action rail/drawer headers. |
| Tactical feedback | Reachable, selected, danger, guard, impact, rotate, complete exist | Hex-native targetable, invalid, stabilised, corrupted and explicit carrying/exhausted/moving field-base states. Existing effects may be reusable but are not the full matrix contract. |
| Combat and checks | No dedicated art in manifest | Enemy-intent card, calculation strip, stat-check preview and readable heart/AP badges. Numbers and wording remain live. |
| Reusable mechanisms | Operator-wheel art exists | True six-edge rotation markers/ports, current/wind/conveyor direction cues, route/network pieces, Hive Ledger group outlines and cell states. |
| Result/reward presentation | No dedicated runtime result package | First-clear recognition treatment and replay result frame. |

## Missing per-map Ninefold art

| Revised map | Existing usable art | Main missing package |
|---|---|---|
| 1 Unequal Crossing | Gorge backdrop, generic terrain, load family, balance/tally art, Hookmole states | One-hex impassable brass scale sprite and legible live-value slots; burrow; dedicated under/balanced/overloaded/arch-open feedback; Hookmole hit and defeated poses, with “study” explicitly matched to a pose; final board-specific visual review. The scale, burrow, scale-state candidates and Hookmole hit/defeated candidates now exist; runtime review and any remaining state matching are open. |
| 2 Cider Run | Generic orchard terrain and number loads may be reused | Cider-press-lane backdrop, presses, apple baskets, flow arrows, harvest gate, Scruffcrow perch/peck/flee and cider/value-change effects. The complete named package now exists in PNG/SVG candidates; runtime review and manifest wiring remain open. |
| 3 Nine Across the Turning Bridge | Generic bridges and operator-wheel style may inform it | Wind-ravine backdrop, rotating current-turner hex, bridge section, wind vane, safe alcove, Crosswind spirit states and capacity/wind-path effects. Reusable bridge terrain can cover the bridge section; the backdrop, current-turner hex, safe alcove, wind vane and Crosswind idle/telegraph/hit/defeated concepts now exist; remaining effects and runtime review remain open. |
| 4 Hedgejaw Maze | Hedge terrain only | Walking-hedge environment, number stones, colour gates, moving route, Hedgejaw states and closure/sequence effects. Reuse the existing hedge terrain; new number-stone, colour-gate, route-cue and Hedgejaw idle/telegraph/hit/defeated concepts now exist as transparent SVG candidates, outside the manifest pending board-scale review. |
| 5 Rooststorm | Proposed Flockling is not the named Maybe-Finch flock | Storm-roost environment, whistle towers, wind dial, storm front, Maybe-Finch states and beam/sweep/held feedback. Reuse existing terrain and backdrop treatment. The earlier SVG placeholders are superseded and held out; corrected 9FO raster candidates now exist for the whistle tower, wind dial, storm front, Maybe-Finch idle/telegraph/hit/defeated states and beam sweep, all alpha-pass and outside the manifest pending board-scale review. |
| 6 Rootfire Relay | Roots terrain; proposed Rootling is not Strawling | Rootfire-cave environment, root nodes/links, source fruit, bridge root, Strawling states and pulse/chain/parity effects. Reuse existing roots and bridge terrain; corrected 9FO raster candidates now exist for the relay node, source fruit, bridge-root link and Strawling idle/telegraph/hit/defeated, all alpha-pass and outside the manifest pending board-scale review. Pulse/chain/parity effects remain open. |
| 7 Murder at Moonfall | No dedicated package | Moonfall environment, ring stones/segments/gaps, Crow Swarm and Crowbreaker states, open/closed/contained effects. Corrected 9FO raster candidates now exist for the Moonfall ring stone, Crow Swarm idle and Crowbreaker idle, all alpha-pass and outside the manifest pending board-scale review. Ring segments/gaps, remaining enemy states and containment effects remain open. |
| 8 Hollow Bough Awakens | Tree and roots terrain can inform style | Memorial-grove environment, memorial hex, living branches, root barrier/fall marker, Overgrowth states and forecast/damage/safe effects. |
| 9 Orchard Lockdown | No Hive Ledger kit; proposed Ledger Leech is not Nearly | Living-gate court, Hive Ledger cells and flower/ray/ring group outlines, living gates, Nearly states and lock/corrupt/solved/gate effects. |
| 10 First Whistle | No dedicated boss package | First Root chamber, branch ports/rotators, founding stone, signal roots, First Root full boss state set and network/shield/strike/vulnerability effects. |

## Character carry backlog

Map 1 Hookmole hit and defeated poses are now present as `po-hookmole-hit-v1.png` and
`po-hookmole-defeated-v1.png`; both pass alpha preflight and remain outside the manifest
pending runtime review. 22 bespoke carry poses are absent: Wicker, Bushel, Tuppence,
Windfall, Cornix, Thistlewick, Beeswax, Kernel, Millrace, Cobweb, Amberly, Barrow, Driftwood,
Gable, Warden, Harvestmoon, Ninebark, Cascade, Longshadow, Gossamer, The Ninefold Tree and
The Tenth Scarecrow. The current composite keeps these cards playable, but it is not finished
character art. New cutouts must pass transparent-corner and checkerboard checks before use.

## Recommended art production order

1. **Current-screen correction:** two sample complete buttons (Move and Pick up) for Sam's approval, then the remaining fixed action buttons; wider hero frame; top-right action-log frame; one-hex brass scale. Review on the actual board before doing a large batch.
2. **Finish Map 1 presentation:** missing Hookmole poses, burrow, scale feedback and the ten visual-acceptance screenshots. This establishes the shared size, anchor and contrast rules.
3. **Build reusable interactive systems with Maps 2–3:** flow/wind cues, rotating current hex, scenario props, enemies and state feedback. Existing and newly created backdrops may be reused across maps and modules; new bespoke backdrops are optional and are lower priority than gameplay assets.
4. **Carry poses:** small approved batches, with identity and alpha review at runtime size; prioritise cards actually selected in test squads.
5. **Maps 4–10:** produce each scenario's matrix row only after its interaction and state contract is stable. Shared Hive Ledger and branch-port kits should precede Maps 9–10.

## Coordination boundary

Codex art work: produce and visually review the assets, stable ids, alpha, dimensions, ground anchors and safe areas. Claude work belongs in an explicit section of `EXPEDITIONS_CLAUDE_HANDOVER.md` before delegation: import/wiring, state selection, packaging, automated tests and engine/scenario work. The art task must not silently change engine state, release gating or persistence.
