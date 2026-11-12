# Ninefold Orchard: dedicated asset audit and production handoff

Version1.0,2 October2026. Product owner: scrum chat. This is a separate Codex art-production assignment authorised by Sam. It corrects the incomplete audit that counted prepared images without checking every visible game object and state. It supersedes the older restriction that ASSET-03 needed another screenshot before production: Four Locks control, three stations and alcove are now confirmed rendering gaps. All artwork remains Codex-owned.

## Outcome

Audit what we have AND what the approved Ninefold Orchard v2 experience needs, then make the missing assets. Do not stop at an inventory or promise. Four Locks is first: ledger control, ledger bus, bridge brace, tree maintenance, prepared alcove and their state cues must all have explicit art mappings. Their function must be recognisable to a child without reading an engine identifier. Preserve the attractive established9fo style.

## Read first

1. EXPEDITIONS_MASTER_BRIEF.md
2. This file, EXPEDITIONS_9FO_IMPLEMENTATION_SPEC.md and EXPEDITIONS_9FO_GENERATION_SPEC.md
3. EXPEDITIONS_9FO_ART_REQUEST.md, EXPEDITIONS_ASSET_AUDIT_2026_10_01.md, EXPEDITIONS_ART_PIPELINE.md and EXPEDITIONS_VISUAL_ACCEPTANCE.md
4. docs/expeditions/v2/reports/scrum-player-experience-recovery.md
5. Latest codex-ART-01.md, codex-ART-02.md, codex-C-10.md and codex-art-daytime-20261002.md, and the current art-delivery/selection/preflight records
6. Read-only live renderer/components and blueprint/state definitions: StationGlyph.jsx, MapViewport.jsx, OrchardExpedition.jsx, EquationWheel.jsx where present; generation/four-locks.js, displaced-four-locks.js, catalogue.js, schema.js, actions.js and enemy.js as needed. Derive actual states from source, not guessed visual names.

## One writer per file: strict separate boundaries

The existing builder is restoring UI/art integration. You own ONLY:
- assets/expeditions/production/9fo/v2/station-art-batch/source/
- assets/expeditions/production/9fo/v2/station-art-batch/runtime/
- assets/expeditions/production/9fo/v2/station-art-batch/qa/
- docs/expeditions/v2/reports/codex-station-art-audit.md
- docs/expeditions/v2/reports/codex-station-art-delivery.md
- docs/expeditions/v2/station-art-batch-manifest.json
- scripts/dev/audit-orchard-station-art.cjs and scripts/dev/prepare-orchard-station-art.cjs, if needed

You may read other files. Do NOT edit existing global manifests, source overrides, art selection/preflight/delivery JSON, renderer/imports, UI, shared App/route/progress, engine, banks, legacy assets or build outputs. Do not overwrite any existing source or other writer's report. Existing builder integrates your completed local manifest. Claim ART-STATIONS through the local mailbox; read codex inbox but do not acknowledge messages intended for the other Codex writer. Put distinctive station-art identity in messages and reports. Send delivery to codex, scrum and claude using mailbox, not another chat API. Mailbox does not wake external Claude. No full rebuild/regression is required for this asset-only task.

## Full audit: required deliverable

Create one row per required visual object/state, not one row per file. Cover all five approved9fo families plus their shared setup/board/feedback systems. Read exact approved family definitions before deciding needs. Inspect source images and representative contact sheets; filenames alone are not acceptance.

Each row records:
- family/object ID, player-facing purpose and state;
- existing source path, exact ID/version, current actual renderer mapping or UNWIRED;
- visual suitability at intended size, transparency/fragment/anchor defects;
- classification: ready reuse / repair / missing new / live code overlay;
- selected source and reason, planned missing deliverable, priority and owner;
- state implementation: alternate sprite versus overlay, live code requirements;
- QA evidence path and status, bytes/hash/anchor metadata.

Categories to cover: scenic backgrounds; all used terrain and passage open/closed/damaged cues; heroes and their idle/rear/action/exhausted states; four prescribed enemies with intent/hit/defeat states; objective tree; puzzle control and operating stations; alcove; circuit effects/protection/corruption; puzzle panels; team selectors; hero/action/ability/intent/result frames; focus/selection/movement/danger overlays; badges and objective/readiness progress. Summarise existing hero/enemy preparation instead of regenerating it, flag concrete gaps. Distinguish no asset from asset exists but not wired.

Audit the other four families too: Turning Ravine wheels/joint/stabiliser; Unequal Crossing scale/loads/platform/repair; Maybe-Flock Roost deduction/beam/tower/whistle; Hollow Bough polyhex clearing/sockets/anchors/root maintenance. Reuse actual existing scale/tower/branches if recognisable and suitable. No new mission designs or new faction/background sets. The audit must identify additional missing approved assets and include an ordered production queue; do not claim all modules or all25tiers complete.

## Confirmed Four Locks production queue

P0 deliver all five distinct object identities below. Review existing candidates first, but generic tree/scale/ledger substituted for every station is insufficient. An appropriate existing painted object may be adapted with imagegen. At least one recognisable reviewed painted candidate per identity, with its required state plan, is required in this batch.

| Runtime entity | Identity and function | Art direction | Required states/cues |
| control | Ledger control: solve the number puzzle and activate selected mechanisms | Small freestanding timber/brass console with an open hive ledger or blank gridded tablet, operating lever and clearly separate activation fitting. Distinct from the power-distribution bus. Grid, numbers and cage totals are live code; no baked puzzle. | Inactive/uncommitted, active/committed, corrupted. Hover/selected/focus cues in live overlay. Do not invent a charge meter for control. |
| number | Ledger bus: distribute power and staff the Number job | Orchard timber/brass distribution cabinet with counting beads or blank register, three cable/root ports and a prominent blank meter slot. Recognisable as a power junction, not another book. | Uncharged/idle, charged/ready, held/working, damaged. Numerical fill/capacity and holder identity remain live. |
| shape | Bridge brace: keep the bridge structurally steady | Compact timber triangular brace with brass joints, clamp/locking pin and foundation feet; communicates support. It fits one anchor hex and cannot paint a whole bridge or imply a fixed crossing direction. | Idle, charged/ready, held/working, damaged. Live meter/holder/selection cues. |
| sustain | Tree maintenance: protect roots and sustain the orchard | Root-care workstation: copper irrigation reservoir/pump, root collar and repair tools with living shoots. Separate from the large Ninefold tree objective. Avoid a second generic apple tree. | Idle, charged/ready, held/working, damaged. Live reservoir/power/holder values and hazard protection cues. |
| alcove | Prepared alcove: alternate safe work position for Shape | Small root-and-stone sheltered nook with a folded/open brace fitting. Recognisable as an alternate work position, not decorative scenery or another station power store. | Unprepared, prepared, held/working. Damage cue only if actual engine state affects the linked Shape station; annotate linkage. No invented independent charge/integrity pool. |

P1 validate reuse for the separate orchard target, physical bridge/gate passages and selected-output effects: bridge opening, root protection, shelter and storm. Read blueprint output effects. Each needs an unambiguous visual cue. Existing tree/passages/effects may fully satisfy these; document mapping and repairs. Never paint numerical values, selectable output names or fake connections into fixed art.

## Style and reference selection

Use the imagegen skill and built-in image tool for new raster art and edits. Inspect local references before editing. Choose actual existing9fo images as style references: painted orchard terrain, timber/brass mechanism, living tree and relevant UI frame. Record chosen paths. Match warm autumn palette, soft painted texture, strong readable silhouette, carved timber, cream stone, aged brass, gentle faux depth and transparent surroundings. Mechanisms should feel made by Orchard inhabitants, not generic industrial sci-fi props. No emoji/plain schematic placeholders passed off as finished art.

Build five coherent but visually distinct silhouettes. The control, bus and root-care station must not be confused at96px. Preserve reference scale/perspective/light. All state variants retain the same object, canvas, scale and anchors. Prefer a base plus a damaged variant and reusable transparent state overlays when that avoids unnecessary copies; deliver a complete mapping for every required state. Held means being worked by a separate hero, not a permanently painted character. Readiness needs a structural cue, not colour alone. Damage stays child-friendly.

All letters/digits/operators, health/charge values, puzzle cells/cages, labels, holder names, arrows, selection/target polygons and mathematical connections belong in code. Leave documented clear spaces. Base art may contain decorative blank ledgers/meters. No numerals hidden in texture.

## Geometry, files and metadata

Props are transparent sRGB WebP, maximum384x384 runtime, typical<=100KiB per mechanism. High-resolution PNG source retained. Do not bake the background or entire terrain hex into a station sprite. Avoid plinth-dependent art: exact underlying pointy hex remains renderer geometry. Prior generated plinths failed width/height measurement; do not repeat that loop. Optional painted pedestal may not define tile shape or adjacency. No non-uniform scaling to make artwork fit.

Ground contact anchor is consistent across states. Record visible bounding box, ground anchor, safe label/meter rectangle and any top/port centres in source pixels. Props must leave visual room for an adjacent working hero and avoid occluding neighbouring tile centres. Show isolated composition with exact pointy hex and representative hero at actual size. Annotate as asset composition, not live App acceptance.

Stable IDs suggested: four-locks-control-{state}-v1, four-locks-number-bus-{state}-v1, four-locks-bridge-brace-{state}-v1, four-locks-tree-maintenance-{state}-v1, four-locks-alcove-{state}-v1. Record proposed ID mapping separately; do not mutate immutable blueprint certificates/IDs. Builder maps existing entity IDs to art via resolver.

Local manifest contains id/version/entityId/state/sourcePath/runtimePath,width,height,bytes,sha256,alpha,visibleBounds,groundAnchor,labelSafeAreas,overlayAnchors,allowedStates,stateLayers,qaPaths,reviewStatus. Mark candidate until independent/live review. Describe exact engine predicate and overlay precedence for each visual state; damage and held/charged can coexist, so don't flatten all conditions into one ambiguous state.

## Production and QA workflow

1. Publish audit and reference selections, then immediately produce P0 missing assets without waiting for an extra approval. Sam authorises creation. Resolve routine art decisions yourself.
2. Generate control first, then bus, brace, maintenance and alcove; use the agreed reference style and retain originals. Derive state variants from each approved base identity. Inspect each before continuing.
3. Use the applicable imagegen instructions for creation/editing. Sharp may perform export preparation, trim/resize/WebP and metadata generation; do not use programmatic painting to disguise poor generated artwork. Background removal/visual edits follow imagegen skill/tool instructions. No paid fallback or moderation bypass.
4. Inspect white, black, orchard-green and cyan backgrounds; inspect48/96/192px sizes. Check real transparency, no checkerboard/white matte, detached fragments, clipped lever/tool/root parts, readable silhouette and consistent anchors. Keep machine diagnostics; documented intentional decoration exceptions are tied to exact hashes, not silently lowered thresholds.
5. Create labelled identity comparison and state comparison contact sheets, plus prop/hero/hex anchor compositions. Show blank overlay safe areas and all state cues. Two objects requiring a label to tell them apart need redesign.
6. Publish audit, local manifest, delivery report and QA paths. Measure all runtime bytes; global art budget remains12MiB and builder owns final accounting/import gate. Prepared sources elsewhere are not automatically selected imports.
7. Deliver the completed P0 set and P1 reuse mapping to builder/scrum via mailbox. Continue remaining audit-confirmed missing approved9fo assets in priority order within this asset-only boundary, reporting bounded batches. Don't invent new artwork just to keep busy.

## Completion must be concrete

The report includes what existed, what was unwired, what was repaired, what was newly made, every required object/state mapping, exact generation/QA evidence, bytes, hashes, anchors, remaining gaps and integration instructions. Beautiful source images without usable derivatives/metadata do not complete the task. Asset-only QA is not final browser/device acceptance; builder and scrum review these in the recovered actual UI before accepting.

Do not deploy, alter gameplay rules, generate new heroes/background sets, remove private gating or edit another writer's files. No need to ask Sam to restate already authorised missing stations. If a tool genuinely fails, preserve the work and report the exact blocked deliverable; proceed with independent assets.
