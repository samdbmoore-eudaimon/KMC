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
placement hexes unambiguous; review the new contextual button/dialog frames at runtime size;
and add clear flood-lane feedback if the scenario mechanic is revised. Cider Run still shares
a radius-three all-clear board and old exact-sum pickup/drop loop with its predecessor. Its
distinct hazard is delayed until round three, while its generated reference solution can
finish in round two. It must not be called complete on the strength of the art wiring.

## 21 September update: three-enemy reuse pool for Maps 8–10

Sam's call: Ninefold Orchard does not need a freshly commissioned, uniquely named enemy
portrait set for every one of its ten maps. Three fully realised, alpha-clean, raster
four-state enemy sets already exist and currently sit unused outside their own map:

- **Hookmole** (Map 1) — the richest set by far: idle-front, idle-back, action, exhausted,
  warning, jam, steal, blocked, plus the newer hit and defeated poses (ten states total, all
  alpha preflight-passed).
- **Maybe-Finch** (Map 5) — corrected v2 raster idle, telegraph, hit and defeated, all
  alpha-pass.
- **Strawling** (Map 6) — raster idle, telegraph, hit and defeated, all alpha-pass.

(Scruffcrow, Crosswind, Hedgejaw, Crow Swarm and Crowbreaker also exist but are either
partial-state, SVG-only or single-state, so they are not part of this reuse pool — see the
per-map notes below for what each already covers on its own map.)

That is more than enough coverage to retire the plan for three more bespoke enemies. **Maps
8, 9 and 10 no longer need new enemy art.** They will reuse the sets above instead of
`po.enemy.overgrowth`, `po.enemy.nearly` and `po.boss.firstRoot` getting their own portraits:

- **Map 8 Hollow Bough Awakens — Overgrowth:** reuse **Strawling**'s idle/telegraph/hit/
  defeated set. Both are plant creatures, so no new art is required.
- **Map 9 Orchard Lockdown — Nearly:** reuse **Maybe-Finch**'s idle/telegraph/hit/defeated
  set. A small, darting presence that inspects a cell and retreats fits Maybe-Finch's
  existing dive/drivenOff behaviour better than a burrowing or windborne creature would.
- **Map 10 First Whistle — First Root (boss):** reuse **Hookmole**'s set. It is the most
  root-and-earth-themed of the three and has by far the widest range of existing poses, so
  its extra narrative beats (dormant, shielded, forecast, vulnerable, strike) can be read off
  Hookmole's existing idle/warning/jam/steal/hit/defeated art rather than commissioned fresh.
  Only revisit this if playtesting shows the reused poses don't read as a final boss at
  boss-encounter scale — that would be a new, explicit decision, not a default assumption.

This changes nothing about each map's win condition, mechanics or narrative name (Overgrowth,
Nearly and First Root stay as designed in `EXPEDITIONS_NINEFOLD_ROUTE.md`); it only changes
which existing art asset renders them. `EXPEDITIONS_SCENARIO_ART_MATRIX.md`'s enemy/boss
column for Maps 8–10 has been updated to match. The "Missing per-map Ninefold art" table below
is left as the historical inventory it was, with a note added to each of the three affected
rows rather than rewritten, so the audit trail stays intact.

## Progress log

### Squad-selection screen first production slice

Status: **created as alpha-pass Ninefold Orchard selector candidates; outside the runtime
manifest pending layout integration and visual review**.

The main selector now has a first art package. The complete character card face remains the
primary choice surface: it is supplied by the existing card-art sources used by `GameCard` and
`JoeyCard`, so the printed stats and rarity remain visible. The new art only supplies the scene
and surrounding selector surfaces:

- `assets/expeditions/production/9fo/runtime/backgrounds/po-squad-select-backdrop-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-briefing-panel-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-party-tray-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-map-preview-frame-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-embark-button-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-survival-badges-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-coverage-plaque-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-card-selection-corners-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-reach-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-shape-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-truth-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-change-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-number-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-squad-pressure-threat-v1.png`

The briefing panel and party tray pass `scripts/validate_expedition_alpha.cjs`. The backdrop is
an opaque scene plate and is intentionally not sent through the transparent-art check. These
files are not yet in the generated manifest or wired into `ExpeditionScreen.jsx`; the next
integration pass must record desktop, tablet and phone safe areas, confirm the whole card face
fits without shrinking its stat rows below legible size, and check that the tray's right-hand
live-text area does not collide with the three selected-card wells.

The first generated card-selection overlay was rejected because it filled the card interior and
would have hidden the printed stats. It remains only as a rejected preview and must not be
copied into the runtime package. The replacement must be proper painted raster art with a
genuinely transparent outer outline, shadow/lift layer or ring around the complete existing card
face. A painted corner-and-check ornament sheet is now present as
`po-squad-card-selection-corners-v1.png`; it still needs a runtime composition review around
the full card face. SVG or CSS substitutes are not approved for this screen.

The first pressure-lane atlas was also rejected because it carried an opaque dark background.
The six pressure symbols were regenerated as six separately validated painted raster icons with
real transparency. They still need a visual consistency and 32 to 48 pixel legibility review.
SVG or CSS substitutes are not approved for this screen.

### Turn-state centre flashes: Your Turn and Enemy Turn

Status: **created as alpha-pass Ninefold Orchard UI candidates; outside the runtime
manifest pending integration and board-scale review**.

These are wide centre-flash overlays modelled on the Joey `You Win` / `You Lose` pop-ups,
but rebuilt for Ninefold Orchard with carved orchard plaques, brass trim, abundant apples,
green leaves and exact, readable text. Use them for the player-turn and enemy-turn flash
at the centre of the battle board:

- `assets/expeditions/production/9fo/runtime/ui/po-your-turn-flash-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-enemy-turn-flash-v1.png`

Both files pass `scripts/validate_expedition_alpha.cjs`.

### Shared combat and tactical feedback kit: first production pass

Status: **created as alpha-pass Ninefold Orchard candidates; outside the runtime manifest
pending runtime-size, anchor and readability review**.

The next shared objectives are now covered by reusable transparent assets:

- `assets/expeditions/production/9fo/runtime/ui/po-enemy-intent-plaque-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-calculation-strip-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-stat-check-preview-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-heart-badge-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-ap-badge-v1.png`
- `assets/expeditions/production/9fo/runtime/effects/po-targetable-hex-ring-v1.png`
- `assets/expeditions/production/9fo/runtime/effects/po-invalid-hex-ring-v1.png`
- `assets/expeditions/production/9fo/runtime/effects/po-stabilised-corrupted-state-v1.png`

All eight files pass `scripts/validate_expedition_alpha.cjs`. The panels intentionally
leave their text and value areas blank for live UI content.

### Shared field states and result frames: first production pass

Status: **created as alpha-pass Ninefold Orchard candidates; outside the runtime manifest
pending runtime-size, anchor and readability review**.

The remaining shared state and result-frame candidates are now present:

- `assets/expeditions/production/9fo/runtime/effects/po-carrying-state-v1.png`
- `assets/expeditions/production/9fo/runtime/effects/po-exhausted-state-v1.png`
- `assets/expeditions/production/9fo/runtime/effects/po-moving-state-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-first-clear-frame-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-replay-result-frame-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-round-objective-frame-v1.png`

All six files pass `scripts/validate_expedition_alpha.cjs`; their text and value areas are
intentionally blank for live UI content.

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

### Contextual button and dialogue frames

Status: **created as transparent Ninefold Orchard chrome candidates; outside the runtime
manifest pending runtime-size and composition review**.

The remaining generic contextual treatment is now covered by reusable blank frames based on
the existing 9FO OK button language. Live labels, icons, messages and button text remain
outside the raster so they cannot overflow or be baked incorrectly:

- `assets/expeditions/production/9fo/runtime/ui/po-contextual-button-frame-v1.png`
- `assets/expeditions/production/9fo/runtime/ui/po-contextual-dialog-frame-v1.png`

Both pass transparent-art preflight and were visually checked for a clean alpha canvas. An
attempted confirmation-panel variant was rejected because it included a painted green haze
outside the frame and is not part of the production set.

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

## Ninefold Orchard squad-selection screen audit

Added 21 September 2026 from the approved selector mock-up. This is a pre-production art
breakdown for the screen shown before a player enters a map. It is separate from the tactical
board asset list above. The selector must feel like an expedition desk in the orchard, not a
generic catalogue or a row of compressed strips.

### Asset boundary

The following must remain live UI, never baked into an illustration: card names, roles, rarity
names, all six pressure-lane values, Hearts, Move, ability copy, selected count, expedition
title, objective description, pressure-lane wording, coverage explanation, collection count,
progress, button labels, checkmarks and any accessibility text. Art supplies the frame, portrait,
ornament, icon treatment and background only.

All new raster art must be delivered as transparent PNG working masters and trimmed WebP runtime
copies where the image is not a flat opaque background. Use the existing Ninefold Orchard style:
warm timber, brass, carved leaves, apples, parchment, deep blue-green ink and soft painted
edges. Do not generate a second visual language for the selector.

**Important card decision:** the selector must display each character's complete existing card
face, not a newly cropped portrait in a blank selector frame. The full card is the source of
truth for character identity, printed stats, rarity, flavour and collection state. Selector art
must frame, lift and annotate that complete card without covering its stat rows. A portrait-only
asset may still be used in the small selected-party tray if needed, but it is never the primary
choice surface.

### Reuse without new art

These are already sufficient for the first implementation and should be reused:

| Screen element | Existing source | Treatment |
|---|---|---|
| Complete character cards | `CARD_LAB_ART.fullCards`, `NFO_CARD_ART` or the module's existing full-card source used by `GameCard`/`JoeyCard` | Use the whole card face in the main selector. Render it at a readable size so the six stats, rarity, name, type and flavour remain visible. Do not replace it with a portrait crop. |
| Character portraits for the selected-party tray | `runtime/characters/po-<id>-idle-front-v1.webp` for all 30 cards | Optional small-tray treatment only. It is a secondary reminder of the chosen team, never the place where the player must compare stats. |
| Orchard backdrop | `runtime/backgrounds/po-orchard-gorge-v1.webp` | Use as the default full-screen scene plate, darkened with a live overlay behind panels. The central composition must leave calm space behind the card grid. |
| Map-specific briefing image | `po-cider-run-press-lane-v1.png`, `po-nine-across-wind-ravine-v1.png` and later approved map backdrops | Use a small cropped preview in the expedition briefing panel when the selected map has one. Do not stretch a board tile or use the full board screenshot. |
| Orchard frame language | `runtime/ui/po-hero-card-frame-wide-v1.png` and existing 9FO name-frame artwork | Reuse the carved timber, leaf and brass treatment as the style reference. The wide hero frame is not the final collection-card frame because its layout is for a field HUD. |
| Readiness badges | `runtime/ui/po-readiness-empty-v1.webp`, `starter`, `uncommon`, `rare`, `epic`, `masterwork` | Reuse as small rarity/readiness markers where the scale remains legible. Keep the text name live beside the badge. |
| Existing card-art rendering | `GameCard`, `JoeyCard` and `fullCardArt()` | Reuse the existing complete-card artwork and its live collection state. Check every card at selector width before adding any decorative overlay. |

### New selector art assets

#### 1. Selector scene backdrop

`artId: po-squad-select-backdrop`

**Usage:** Full-screen background behind the briefing, card collection and selected-party tray.

**Runtime specification:** One opaque 16:9 landscape plate, target 2560 x 1440, with a 1920 x
1080 safe composition. No alpha is required. Keep the focal orchard bridge or expedition camp
in the outer thirds. Leave the centre and lower-middle quiet enough for parchment panels.

**Creation instructions:** Paint a warm Ninefold Orchard expedition staging area seen at child
eye level: apple branches above, a distant ravine bridge or orchard path, a timber table,
rolled maps, compass, small satchel, apples and soft late-afternoon light. Keep all props
secondary and avoid a character or large object directly behind the card grid. Make the lower
edge darker than the card area so cream cards read clearly. Supply a clean version without
text, panels or UI. Avoid a detailed board grid, hard horizon lines, modern furniture, empty
green gradient or a dramatic scene that competes with the cards.

**Acceptance:** At 430 x 900, the background must still read as orchard atmosphere rather than
an indistinct blur. At desktop width, no high-contrast branch, face or bright apple may sit under
the primary text. Provide an approved crop map for desktop, tablet and portrait phone.

#### 2. Briefing parchment panel frame

`artId: po-squad-briefing-panel`

**Usage:** Left-hand expedition briefing panel containing the map preview, title, summary and
the live “What this expedition asks” pressure list.

**Runtime specification:** Transparent ornamental frame, nominal 760 x 920 source canvas,
usable live-text rectangle approximately x 120 to 665 and y 300 to 810. Preserve a small
illustration window at the top, approximately 600 x 230. The frame must scale down without
making its inner parchment texture muddy.

**Creation instructions:** Create a vertical orchard field-notes plaque with carved dark wood
outer edge, brass corner fasteners, cream parchment centre, leaf sprigs and a small blank
illustration window. Make the lower half calm and text-safe. Include no title, map name, symbols,
pressure-lane icons or written instructions. Match the existing action-log plaque and 9FO name
frame rather than inventing a new border shape.

**States:** neutral, selected-map warm highlight and disabled/locked. The selected variant may
use a thin apple-gold inner glow, but must not change the live text area.

#### 3. Map preview inset frame

`artId: po-squad-map-preview-frame`

**Usage:** Small frame for a live or pre-rendered crop of the selected expedition environment.

**Runtime specification:** Transparent frame at 720 x 300, with an inner crop safe area of
roughly 640 x 230. The frame is decorative only. It must accept different map backdrops and
never contain a baked map title.

**Creation instructions:** Paint a shallow timber-and-brass landscape window with clipped
parchment corners, subtle leaf ornament and a clear inner opening. Provide a normal state and a
completed-map state with a restrained green leaf or tick treatment. Do not bake stars, progress,
enemy art or scenario-specific props into the frame.

#### 4. Full-card selector treatment

`artId: po-squad-card-selection`

**Usage:** A non-obscuring selection and presentation treatment around the existing complete
character card face.

**Runtime specification:** Transparent overlay matching the existing full-card aspect ratio. Use
the actual card dimensions returned by the card-art source, with runtime candidates around
320 x 480 or the existing `GameCard` ratio. The overlay must leave the entire card face visible,
especially the six stat rows and rarity treatment. Supply an outer edge, a corner checkmark
anchor and optional shadow/lift layers as separate files if this makes CSS composition cleaner.

**Creation instructions:** Do not paint a new card face, portrait window, name area, stat bars,
rarity label or ability wording. Instead create a slim orchard-gold edge, a soft green lift glow,
and a small leaf-and-brass checkmark that sits outside the existing card artwork. The treatment
must look good around both portrait and landscape variations of the existing full-card art. It
must never cover printed stats or reduce their contrast.

**States:** neutral, hovered, selected, unavailable because squad is full, and filtered/faded.
Selected art needs a gold outer ring, lifted edge and soft green orchard glow. Disabled art must
remain recognisable and must not rely on opacity alone: include a muted parchment treatment and
let the live interface add the lock explanation. The unavailable treatment should be applied to
the whole card, not just its portrait.

#### 5. Selected-card lift and selection ring

`artId: po-squad-card-lift`

**Usage:** Non-rectangular feedback that makes selected cards feel chosen and movable into the
party tray.

**Runtime specification:** Transparent overlay matching the outside silhouette of the complete
card face, plus a separate shadow/lift layer. Supply the selected card overlay at the source
card ratio and a 256 x 256 optional party-tray portrait-ring version. The selection shape must
sit outside the painted card and leave every printed stat unobscured.

**Creation instructions:** Paint a warm brass selection edge with three or four tiny leaf
highlights and a small live checkmark anchor in the top-right corner. Provide a hover version
with a softer green edge and a selected version with a stronger gold edge. Do not draw a hard
rectangular CSS border into the art. A CSS transform may lift the whole card, but the art itself
must remain the existing complete card face.

#### 6. Pressure-lane icon set

`artId: po-squad-pressure-icons`

**Usage:** Small visual anchors for Reach, Shape, Truth, Change, Number and Threat on the cards,
briefing panel and team-coverage summary.

**Runtime specification:** Six matching transparent icons, each supplied at 192 x 192 master
size and 48, 64 and 96 pixel runtime sizes. Each icon needs a monochrome dark-ink version and a
small brass-highlight version. They must remain recognisable without colour.

**Creation instructions:** Create a coherent orchard field-kit vocabulary, not emoji: Reach as
path/boot or compass, Shape as connected hex/gear, Truth as lantern or eye, Change as sprouting
leaf/flow, Number as tally stones or abacus, Threat as shield with warning mark. Use the same
line weight and carved-brass inset as the action icons. Do not include letters or numbers inside
the icons and do not make them look like combat-only symbols.

#### 7. Stat-bar and lane-marker kit

`artId: po-squad-stat-markers`

**Usage:** Decorative live UI pieces behind the six visible stat values on each card and the
coverage summary.

**Runtime specification:** One short horizontal stat-track frame, one filled-segment cap, one
empty-segment cap and one missing/disabled treatment. Target 640 x 96 master for the track and
96 x 96 for caps. Values remain live HTML or SVG, not painted into the image.

**Creation instructions:** Paint a slim parchment-and-brass track with five or six clean
segments, rounded ends and enough contrast for green, blue, slate, ochre, teal and red live
fills. Supply a Ninefold palette mapping for each pressure lane, but ensure the pattern and icon
also distinguish lanes for colour-blind players. Do not use a glossy mobile-game bar, bevelled
neon or baked digits.

#### 8. Hearts and Move badges

`artId: po-squad-survival-badges`

**Usage:** Small inline badges for live Hearts and Move values on every card and in the selected
party tray.

**Runtime specification:** Two matching transparent badge icons, 160 x 160 master each, with
clear live-number safe centres. Provide normal and muted versions. The heart must read as
survival, not a generic social-game heart. Move must read as movement and remain distinct from
Reach.

**Creation instructions:** Paint an orchard-carved heart-leaf badge and a boot/path badge with
brass outline and deep ink interior. Keep the central area plain so a live number can be placed
on top. Do not bake 3, 4, 5 or any other value into the art.

#### 9. Ability plaque and role marker

`artId: po-squad-ability-plaque`

**Usage:** The bottom strip of each card for one short signature ability and a small live role
label.

**Runtime specification:** Transparent shallow plaque, target 640 x 150 master, with an inner
live-text safe area of 520 x 90. Supply a neutral and selected/active treatment.

**Creation instructions:** Create a small carved applewood label with a central parchment
insert, one icon anchor at the left and no text. It must fit abilities such as “Finds a safer
path” and “Stands firm for others” in two lines at card width. Avoid a long ribbon that makes the
card look like a banner.

#### 10. Selected-party tray frame

`artId: po-squad-party-tray`

**Usage:** Bottom “Your expedition” area where three selected characters are shown together.

**Runtime specification:** Transparent wide timber tray, target 1800 x 430 master, designed for
three portrait medallions at desktop and a two-row or horizontal-scroll fallback on phone. Keep
the centre and right side sufficiently open for live team summary text and the action button.

**Creation instructions:** Paint a substantial expedition packing tray with carved wood, brass
rivets, leaf ornament and three clearly separated portrait wells. Provide a shallow header tab
for the live “Your expedition” title. Do not paint character portraits, names, stats or the
button into the tray. The three wells must work with any roster order, including repeated role
types.

#### 11. Team-coverage summary plaque

`artId: po-squad-coverage-plaque`

**Usage:** Live explanation of why the selected three-card team works for the chosen map.

**Runtime specification:** Transparent parchment plaque, target 720 x 360 master, with room for
three short live coverage rows and one small icon per row. Supply neutral, strong-coverage and
warning treatments.

**Creation instructions:** Create a calm cream parchment inset with a carved green-wood edge,
small leaf corners and three icon anchors. It should support live lines such as “Strong movement
and scouting”, “Solves mechanical challenges” and “Good balance of safety and support”. Do not
prepaint claims or use a traffic-light colour scheme that implies a hidden score.

#### 12. Embark button frame

`artId: po-squad-embark-button`

**Usage:** Large final action button labelled live as “Begin the expedition”.

**Runtime specification:** Transparent horizontal button frame, target 960 x 220 master, with a
live label safe area at least 700 x 100. Supply normal, focused, pressed and disabled states.

**Creation instructions:** Extend the approved Ninefold OK/action-button language into a larger
green orchard-confirmation button with brass trim, leaf tips and a right-pointing path or arrow
motif. The button should feel like stepping onto the path, not accepting a form. Do not bake
the words, squad count or map title into the artwork. Disabled must be readable at low contrast
without looking broken.

#### 13. Collection filters and tab ornaments

`artId: po-squad-filter-chrome`

**Usage:** Optional filter row for All, Reach, Shape, Truth, Change, Number, Threat and rarity.
This is needed once the 30-card collection no longer fits comfortably on one screen.

**Runtime specification:** One compact tab/segmented-control family, target 480 x 96 master per
tab state, plus a small sort/filter icon at 128 x 128. Supply neutral, active and disabled
states. Text remains live.

**Creation instructions:** Use narrow applewood tabs with parchment centres and small leaf or
brass separators. The active state should be a lifted green-gold tab. Keep the design compact
enough for horizontal scrolling on phones. Do not create a second card-lab frame system.

#### 14. Small interaction feedback set

`artId: po-squad-feedback-icons`

**Usage:** Live overlay cues for selected, newly recommended, already deployed, unavailable and
recently inspected cards.

**Runtime specification:** Five transparent icons or badges, 128 x 128 master, with accessible
text equivalents in the UI: check, sparkle/recommendation, party marker, lock/full and inspect.

**Creation instructions:** Match the existing readiness and action icon family. The check must
be an orchard leaf-and-brass check rather than a generic app tick. The recommendation sparkle
must be restrained and never imply that the game has chosen the team for the child. These are
small overlays, so use bold silhouettes and no fine text.

### Asset package that is not required

Do not commission separate portraits for “Pip”, “Nine”, “Bramble”, “Marta”, “Clover” or “Tumble”
just for the selector. The names in the mock-up are sample content. The real selector should
use the existing 30-card roster and its current character identities. Do not create a static
image containing all cards, a screenshot of the selector, baked stat numbers, baked map
descriptions, or a new full board background for each map.

### Creation and review order

1. Approve the backdrop composition and safe areas at desktop, tablet and phone crops.
2. Create the collection-card frame, selection overlay and live-text measurements.
3. Create the party tray, briefing panel, coverage plaque and embark button as one chrome family.
4. Create the six pressure icons, stat markers and Hearts/Move badges.
5. Add map preview frame and filter chrome only after the first roster layout is tested with all
   30 cards.
6. Build transparent PNG masters, trim them deterministically, produce WebP runtime copies and
   record bounds, anchors and safe areas in the manifest.
7. Test every card with at least three small, three tall and three wide character silhouettes.
8. Review selected, disabled, hovered and full-squad states at 430 x 900, 768 x 1024 and 1920 x
   1080. Check that the cards remain proper cards and never collapse back into strips.

### Selector-screen acceptance gate

The package is not ready for integration until a still frame lets a child answer all of these
without opening a second screen: What expedition am I choosing? What pressures will it use? Who
is on my team? What does each hero do? How strong are their six visible lanes? How many Hearts and
how much Move do they have? Why is this team a sensible choice? Can I tell which cards are
selected, available or unavailable? Where do I start?

The final art review must also confirm that no decorative frame hides live values, the card
portraits remain recognisable, the panel hierarchy works over the reused orchard backdrop and
the screen still feels like Ninefold Orchard rather than a generic deck builder.

## Sources and precedence

Compared `EXPEDITIONS_MASTER_BRIEF.md`, `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md`, `EXPEDITIONS_SCENARIO_ART_MATRIX.md`, `EXPEDITIONS_ART_HANDOVER.md`, `EXPEDITIONS_ART_PIPELINE.md` and `EXPEDITIONS_VISUAL_ACCEPTANCE.md` against `assets/expeditions/production/9fo/manifest.json` and its runtime files. The revised experience brief and scenario matrix supersede older map pitches. Sam's later, explicit requirement for **one finished, static image per action button, including its icon and label**, supersedes the old art-handover instruction to assemble buttons with live labels. Dynamic numbers, AP, HP, objective values and formulas remain live UI.

## What exists

- The runtime folder has 244 files; 242 are referenced by the manifest and every referenced path exists. The two unlisted files are an older gorge PNG and older hex-grass WebP.
- All 30 collectible Ninefold characters have front idle, rear idle, action and exhausted candidates. All 30 now also have a bespoke carry candidate: the original eight (`Pip`, `Nine`, `Bramble`, `Sorrel`, `Russet`, `Halfpenny`, `Furrow`, `Dapple`) plus the completed 22-character carry set recorded below. Carry cutouts were visually checked against their corresponding action art before being retained.
- One orchard-gorge backdrop; grass, path, flagstone, stream, bridge, hedge, roots, pond, tree and related terrain candidates; an earth-wall strip; eight general effects; eight blank button frames and eight separate action icons.
- Number loads in eight states, an operator wheel in six states, balance artwork in six states, tally arch in four states, two feeder-gate states and two target-gate states.
- Hookmole has front/rear idle, action, exhausted, warning, jam, steal and blocked art. Eight other four-state enemy candidates exist, but they are marked **proposed** and do not correspond to most named enemies in the new ten-map matrix.
- Existing Ninefold UI art outside this manifest includes Back, OK, Cancel and a narrow character name frame. The current board also draws some controls and the one-hex scale procedurally. These are not completed static action-button or scale assets.

Presence is not approval: visual fit, alpha, anchor, phone-scale legibility and the ten required review states still need checking.

## Missing shared presentation kit

| Need | Present position | Gap |
|---|---|---|
| Finished action buttons | Fixed Move, Pick up, Put down, Guard, Attack, Rotate, Undo and End round images in normal, selected and disabled states; contextual button/dialog frames now exist | Final alpha-safe and runtime-size review. Do not bake variable costs or values. |
| Wider hero card | Narrow existing name frame | Wider themed frame accommodating “The Tenth Scarecrow”, portrait, AP and HP without overlap. AP/HP remain live. |
| Compact HUD and action log | Existing partial frames/procedural presentation | Themed action-log plaque for the top-right HUD; objective and round frames; coherent bottom action rail/drawer headers. |
| Tactical feedback | Reachable, selected, danger, guard, impact, rotate, complete exist | Targetable, invalid, stabilised, corrupted, carrying, exhausted and moving candidates now exist. Runtime matrix review remains open. |
| Combat and checks | No dedicated art in manifest | Enemy-intent plaque, calculation strip, stat-check preview and live heart/AP badges now exist as transparent candidates. Runtime-size review remains open. |
| Reusable mechanisms | Operator-wheel art plus current-turner, branch-port, wind-path, route cue, relay-node/link, signal-root network and Hive Ledger board/cell/group candidates | Runtime review of anchors, direction cues and six-edge rotation behaviour remains open. |
| Result/reward presentation | No dedicated runtime result package | First-clear recognition, replay-result and round/objective frame candidates now exist. Runtime review remains open. |

## Missing per-map Ninefold art

| Revised map | Existing usable art | Main missing package |
|---|---|---|
| 1 Unequal Crossing | Gorge backdrop, generic terrain, load family, balance/tally art, Hookmole states | One-hex impassable brass scale sprite and legible live-value slots; burrow; dedicated under/balanced/overloaded/arch-open feedback; Hookmole hit and defeated poses, with “study” explicitly matched to a pose; final board-specific visual review. The scale, burrow, scale-state candidates and Hookmole hit/defeated candidates now exist; runtime review and any remaining state matching are open. |
| 2 Cider Run | Generic orchard terrain and number loads may be reused | Cider-press-lane backdrop, presses, apple baskets, flow arrows, harvest gate, Scruffcrow perch/peck/flee and cider/value-change effects. The complete named package now exists in PNG/SVG candidates; runtime review and manifest wiring remain open. |
| 3 Nine Across the Turning Bridge | Generic bridges and operator-wheel style may inform it | Wind-ravine backdrop, rotating current-turner hex, bridge section, wind vane, safe alcove, Crosswind spirit states and capacity/wind-path effects. Reusable bridge terrain can cover the bridge section; the backdrop, current-turner hex, safe alcove, wind vane, Crosswind idle/telegraph/hit/defeated concepts, wind-path and capacity effects now exist; runtime review remains open. |
| 4 Hedgejaw Maze | Hedge terrain only | Walking-hedge environment, number stones, colour gates, moving route, Hedgejaw states and closure/sequence effects. Reuse the existing hedge terrain; new number-stone, colour-gate, route-cue and Hedgejaw idle/telegraph/hit/defeated concepts now exist as transparent SVG candidates, outside the manifest pending board-scale review. |
| 5 Rooststorm | Proposed Flockling is not the named Maybe-Finch flock | Storm-roost environment, whistle towers, wind dial, storm front, Maybe-Finch states and beam/sweep/held feedback. Reuse existing terrain and backdrop treatment. The earlier SVG placeholders are superseded and held out; corrected 9FO raster candidates now exist for the whistle tower, wind dial, storm front, Maybe-Finch idle/telegraph/hit/defeated states and beam sweep, all alpha-pass and outside the manifest pending board-scale review. |
| 6 Rootfire Relay | Roots terrain; proposed Rootling is not Strawling | Rootfire-cave environment, root nodes/links, source fruit, bridge root, Strawling states and pulse/chain/parity effects. Reuse existing roots and bridge terrain; corrected 9FO raster candidates now exist for the relay node, source fruit, bridge-root link, Strawling idle/telegraph/hit/defeated and pulse/chain/parity effects, all outside the manifest pending board-scale review. |
| 7 Murder at Moonfall | No dedicated package | Moonfall environment, ring stones/segments/gaps, Crow Swarm and Crowbreaker states, open/closed/contained effects. Corrected 9FO raster candidates now exist for the Moonfall ring stone, ring gap, Crow Swarm idle/telegraph, Crowbreaker idle/telegraph and containment effect, all outside the manifest pending board-scale review. |
| 8 Hollow Bough Awakens | Tree and roots terrain can inform style | Memorial-grove environment, memorial hex, living branches, root barrier/fall marker and forecast/damage/safe effects. Memorial hex, living branches, root barrier, fall marker, forecast, damage and safe-path effects now exist as alpha-pass 9FO raster candidates; Overgrowth reuses Strawling's existing idle/telegraph/hit/defeated set. Dedicated memorial-grove backdrop remains optional. |
| 9 Orchard Lockdown | No Hive Ledger kit; proposed Ledger Leech is not Nearly | Living-gate court, Hive Ledger cells and flower/ray/ring group outlines, living gates and lock/corrupt/solved/gate effects. Hive Ledger board, corruption seal, solved cell, living gate, lockdown pulse and flower/ray/ring group outline now exist as 9FO raster candidates; Nearly reuses Maybe-Finch's existing idle/telegraph/hit/defeated set. |
| 10 First Whistle | No dedicated boss package | First Root chamber, branch ports/rotators, founding stone, signal roots and network/shield/strike/vulnerability effects. Branch port, founding stone, signal-root network, shield and strike/vulnerability effects now exist as alpha-pass 9FO raster candidates; First Root reuses Hookmole's existing ten-pose set. Dedicated chamber backdrop remains optional. |

## Character carry backlog

Map 1 Hookmole hit and defeated poses are now present as `po-hookmole-hit-v1.png` and
`po-hookmole-defeated-v1.png`; both pass alpha preflight and remain outside the manifest
pending runtime review. The 22 bespoke carry poses are now present and visually matched to
their action references:

- `po-wicker-carry-v1.png`, `po-bushel-carry-v1.png`, `po-tuppence-carry-v1.png`,
  `po-windfall-carry-v1.png`, `po-cornix-carry-v1.png`, `po-thistlewick-carry-v1.png`,
  `po-beeswax-carry-v1.png`, `po-kernel-carry-v1.png`, `po-millrace-carry-v1.png`,
  `po-cobweb-carry-v1.png`, `po-amberly-carry-v1.png`, `po-barrow-carry-v1.png`,
  `po-driftwood-carry-v1.png`, `po-gable-carry-v1.png`, `po-warden-carry-v1.png`,
  `po-harvestmoon-carry-v1.png`, `po-ninebark-carry-v1.png`, `po-cascade-carry-v1.png`,
  `po-longshadow-carry-v1.png`, `po-gossamer-carry-v1.png`, `po-ninefoldtree-carry-v1.png`,
  `po-tenthscarecrow-carry-v1.png`.

All 22 pass transparent-corner and alpha checks; the checkerboard heuristic gives false
positives on the pale water/tree artwork, but raw alpha inspection confirms transparent
empty corners and transparent unused canvas. They remain outside the manifest pending runtime
review.

## Recommended art production order

1. **Current-screen correction:** two sample complete buttons (Move and Pick up) for Sam's approval, then the remaining fixed action buttons; wider hero frame; top-right action-log frame; one-hex brass scale. Review on the actual board before doing a large batch.
2. **Finish Map 1 presentation:** missing Hookmole poses, burrow, scale feedback and the ten visual-acceptance screenshots. This establishes the shared size, anchor and contrast rules.
3. **Build reusable interactive systems with Maps 2–3:** flow/wind cues, rotating current hex, scenario props, enemies and state feedback. Existing and newly created backdrops may be reused across maps and modules; new bespoke backdrops are optional and are lower priority than gameplay assets.
4. **Carry poses:** complete for all 30 characters; remaining work is runtime-size review and manifest wiring, not new character artwork.
5. **Maps 4–10:** produce each scenario's matrix row only after its interaction and state contract is stable. Shared Hive Ledger and branch-port kits should precede Maps 9–10. Maps 8–10 need no new enemy/boss art — see the 21 September reuse-pool decision above — so their remaining work is environment, prop and effect art only.

## Coordination boundary

Codex art work: produce and visually review the assets, stable ids, alpha, dimensions, ground anchors and safe areas. Claude work belongs in an explicit section of `EXPEDITIONS_CLAUDE_HANDOVER.md` before delegation: import/wiring, state selection, packaging, automated tests and engine/scenario work. The art task must not silently change engine state, release gating or persistence.
