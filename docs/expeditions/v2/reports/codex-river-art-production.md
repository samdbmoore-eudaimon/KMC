# Orchard connecting river production

Owner: separate Codex art writer, ART-RIVER. Daytime task authorised by Sam through scrum. All writes remain within river-art-batch, its manifest, this report and prepare-orchard-river-art.cjs. Original sources, topology, certificates, UI, registries, progress, rewards and build outputs are untouched.

## Completed local delivery: v3 collar repair

Four current candidates are complete: adapted straight, matching gentle bend, reused painted earth sides and an isolated timber bridge. Current package 127,018 bytes, approximately 124 KiB. All original and generated sources are preserved. No global imports were made. Candidates require the builder's live review and scrum/Sam visual acceptance.

Sam's later correction in scrum-river-style-correction.md supersedes the first flat final-map interpretation. The v1 straight/bend and their crosshatched reflections are preserved as rejected visual-direction prototypes. They are not current candidate imports. The v2 paintings restore rich mossy banks, rounded stones and natural irregular reflections, without the diagonal mesh. The v3 derivatives retain these paintings while repairing the mouth blends. The assembled raised comparison is qa/collar-after/original-versus-raised-joined.png: original unchanged on the left, adapted straight and matching bend with original painted earth sides on the right.

| Current ID | Canvas | Bytes |
|---|---|---:|
| po-river-straight-surface-v3 |384×384|43,466|
| po-river-bend-gentle-surface-v3 |384×384|39,374|
| po-river-raised-front-walls-reuse-v1 |384×160|8,628|
| po-river-timber-bridge-structure-v1 |384×384|35,550|

Runtime files are in river-art-batch/runtime, full sources and registered512px intermediates in source. river-art-batch-manifest.json supplies exact SHA-256 hashes, bytes, actual dimensions, alpha bounds, source transforms, centres, mouths, rotation and QA paths. Its currentCandidateIds are the four rows above. Total eight runtime files including preserved v1/v2 prototypes: 299,034 bytes. Only currentCandidateBytes belongs in the proposed incremental import budget.

References inspected: stream, grass, timber bridge and the canonical Unequal Crossing painted map mockup. Whole old-stream reuse was tested before adapting its surface. qa/existing-straight-reuse-whole-test.png shows unchanged and60/120-degree whole-image joins: mouths do not align and the walls/viewpoint rotate. qa/existing-straight-uniform-crop-test.png tests the existing material crop with uniform scale: top/bottom gaps and corner-directed water remain. This demonstrates why direct whole-image rotation or the present crop cannot satisfy registration; it does not claim every possible adaptation is impossible.

Reuse is concrete: the wall layer projects actual original left/right earth-wall pixels into fixed world-facing quads, preserving painted rocks, roots and warm-left/darker-right lighting. The registered straight is an imagegen adaptation of the existing stream's top material, not a claim of unchanged pixel reuse. Its painted water and bank layers are uniformly scaled and rotated in-plane under registered masks. The missing bend was generated from the original stream and guide in the same material direction. No river surface is stretched on one axis. The bridge is an imagegen edit of the existing timber crossing: baked grass, water and walls removed, wood retained as a separate upright structure.

Generated geometry alone did not produce identical mouths. Scrum's review found the v2 shared collars visibly rectangular. The v3 repair adds a newly imagegen-painted blue-green water texture matched to the registered straight, assembled with 180-degree symmetric shared-edge pixels and an irregular feather into the existing interiors. Bank paint and logical geometry remain unchanged. The shared water mask remains96px on the512 guide,72px at runtime. Code assembles painted texture under alpha masks; it does not draw replacement illustrations. source/mouth-collar-provenance-v3.json records the texture crop, scale and symmetry. All v2 source/runtime files remain preserved with unchanged hashes. Native and2× before/after evidence is qa/collar-after/before-after-native-and-2x.png; geometry-invariants.json confirms dimensions, centres, vertices, mouths, edge IDs, rotations and coverage guard are unchanged. The repaired blend removes the broad rectangular patches in local visual review; final live review remains pending.

Seven successful built-in imagegen results and two recovered network failures are recorded in source/generation-records.json. No CLI fallback, source deletion, moderation bypass or new hero/faction/scenery set was used.

## Read-only topology audit

qa/topology-audit.json records77 saved packets: all64 entries selected in the displaced-v1 bank, its reference fallback and other saved non-bank-candidate certification packets, with overlapping paths counted once. This is adjacency inspection, not certification revalidation or a declaration that every saved packet is approved. It includes bridge tiles as water-bearing locations.

531 water/bridge tile observations:413 two-mouth gentle turns and118 one-mouth boundary outlets. No straight, adjacent-mouth tight turns, branches or broad-water clusters were found. The required straight remains a useful matching kit member; a tight bend is not justified by these routes. Do not generate one speculatively. No branch or broad-water artwork is required by this inspected slice. Such future topology is unsupported by a two-mouth kit and must get a separate request, never a forced connection. Boundary mouths may continue off the board only where the real neighbour is outside it; do not aim the spare mouth at an in-board land tile. Interior endpoint artwork, if later required, is a separate bounded gap.

## Registration and integration contract

Runtime384 square, centre192,192, regular pointy-top side162. Vertices:192,30;332.296,111;332.296,273;192,354;51.704,273;51.704,111. Mouth width72px along the edge, quiet approach24px. Straight west/east; gentle west/south-east. Clockwise edge order east, south-east, south-west, west, north-west, north-east. Positive rotation follows this order in screen coordinates. Six60-degree rotations around the same centre. One straight import and one gentle import, rather than separate orientation files.

Place the full surface image at hex centre minus192 multiplied by a single uniform scale. Scale equals logical side/162. Remove the old diamond material crop for these surfaces: MapViewport currently uses viewBox28 26 328 248. Derive shape and rotation from real water/bridge neighbouring edges, including under controlled bridges. Exact logical vertices remain unchanged. Runtime paint includes a0.75px coverage guard beyond the nominal hex mask to prevent raster antialias cracks between adjacent surfaces. This is recorded as textureCoverageBleed, not a changed hex side, hit area or mouth. Avoid double antialiased per-tile clipping that reintroduces cracks; use a shared field boundary mask or shared-edge coverage when applying exact geometry. Never cover seams with grid strokes.

The wall's topCentre is192,-65 in its384×160 file, intentionally above the cropped wall canvas. Place its image at world hex centre minus this topCentre times the same uniform scale. Front depth36px at the384 surface scale. groundAnchor192,133. Keep rotation0 for the walls regardless of river rotation. Paint or mask only exposed front faces, sort by world depth and let near top faces occlude internal rear walls. Do not render a thin plain extrusion as the finished substitute: use the supplied painted material or original matching wall art. source/raised-wall-provenance.json records original source hash, quads and texture projection.

Keep bridge structure upright and independent of surface rotation. Align deckCentre192,216 to the bridge hex centre with one uniform scale; groundAnchor192,336. The six crossing studies use the retained original upright deck view over every water rotation. This is one established bridge view, not six yaw views. If live passage presentation needs a different physical deck orientation, request a bounded additional upright view after inspecting actual land/water adjacency; do not rotate the entire sprite or change topology. No current saved water route justifies tight bends, junctions or a broad-water kit.

Metadata uses actual file coordinates, with sourceCoordinates separately labelled. Source full-resolution PNGs are preserved. No registration-guide markings belong in delivered illustrations. Candidates stay candidate pending visual and live owner review.

## QA evidence and limits

All four current assets pass the existing alpha validator: one connected component each, zero detached pixels. No checkerboard, opaque fringe or black matte was seen on white, black, orchard-green or cyan. Native four-background contact sheet and48/96/192 checks are in qa/collar-after/selected-four-backgrounds.png and selected-48-96-192.png. Hash, bytes, dimension, alpha, QA-path and70 KiB limit checks pass for all eight retained runtime records in qa/final-checks.json. All four mouths share a72px design mask; colour heuristic profiles are recorded per mouth, with antialiased/transition pixels retained. The heuristic is diagnostic, not a substitute for the code mask or visual review.

qa/collar-after/all-24-rotated-joins.png contains all six edge directions and all straight/bend pair combinations. Individual native joins are indexed by join-index.json. The strip contains straight → bend → straight; certified-river-consecutive-bends.png follows saved actual river adjacency, excluding the two boundary endpoints rather than inventing another neighbour. bridge-all-rotations.png and six individual crossing files keep timber and earth sides upright while rotating only water. Native joins remain open without land wedges, blocked ends or doubled large rocks at mouths. The revised shared-edge texture and any baked stone-highlight direction need live maximum-zoom assessment; no final visual acceptance is asserted.

Local assembled compositions at390,768 and1280px are saved. movement-selection-cost-colour-study.png checks current mint movement colour, cream selection and a fixed-size dark/cream cost label over water at48/96/192. This is a palette study, not a claim that those labels are implemented or App screenshots. Actual phone/tablet/desktop, minimum/native/maximum camera zoom and UI interaction screenshots are still builder-owned. Asset-only evidence is not App acceptance.

## Deduplicated repair queue

qa/deduplicated-repair-queue.json preserves all76 original repair/review rows, deduplicated into45 distinct runtime paths with their original hash, diagnostic and repeated uses.43 are not selected in today's art manifest or scene-kit. Two lineages are selected through newer recovery files: roots and timber bridge. Original diagnostic hashes are not the current recovery hashes and must not be treated as exact-hash acceptance of those files.

The cyan contact sheet is qa/repair-queue-contact.png. Fragment counts are diagnostic, not proof of unwanted paint: Millrace/Cascade water beads, Gossamer light motes, detached wings and Hollow Bough paired branches include deliberate disconnected forms. No blanket component deletion, alpha-threshold relaxation or complete hero/faction set is justified.

Bounded next queue:

1. P0, current river renderer: connect and register the new surfaces using real neighbours. The present whole-diamond water/bridge crop fails the connection contract. This batch addresses the art dependency; builder owns integration and actual phone/tablet/desktop evidence.
2. P0, current bridge: replace its baked terrain tile over water with the independent timber structure once crossings pass review. The new derivative addresses this precise layered-art gap. Do not rotate its walls or use it to invent river connections.
3. P1, current hero state fallback: today's manifest selects idle poses and Hookmole idle/defeated. Existing resolver requests hero action when holding and exhausted at AP0/HP0, then falls back to idle when absent. Builder must verify visible working/exhausted indicators or select already prepared reviewed poses. Kernel action/exhausted are first among the staged flagged poses for a T2 trace; Warden action and Gossamer action/exhausted follow only when the accepted current slice reaches those tiers. Their hashes and cyan previews are in the queue. Inspect clipping and isolated effects before any narrowly scoped imagegen repair.
4. P2, roots recovery source: exact-hash four-background/current crop review before proposing paint repair. The old643 detached-pixel finding may lie outside the current code crop. Inspect the actual rendered tile; no demonstrated current replacement need is claimed from that count alone.
5. Deferred: other hero rear/action states, Scruffcrow/Strawling/Crosswind effects and Hollow Bough branches. They are not current selected defects. Select only as needed by real renderer requests and family commissioning, inspect exact files and preserve legitimate particles/paired branches. No new hero set.

Live renderer screenshots, minimum/native/maximum zoom, movement/selection/cost contrast and phone/tablet/desktop review remain the builder's dependency. Asset-only evidence is not App acceptance.
