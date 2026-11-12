# Ninefold Orchard: connecting river tiles

## Superseding visual correction: 2 October2026

Sam rejects a bland flat final tile. Read `reports/scrum-river-style-correction.md` before continuing. Test reuse/adaptation of the existing painted straight river first and create a matching bend. Flat surface layers below are an internal connection technique only: final acceptance requires an assembled raised painted battlefield matching the existing stream/grass, with consistent perspective, earth sides and rich banks. Do not rotate baked perspective/walls, approve isolated flat candidates or commission a replacement straight without demonstrating why reuse fails. The joined map comparison is the acceptance evidence.

Create a small matching river kit so a river can continue through neighbouring battlefield hexes, turn naturally and pass beneath bridges. The required assets are a **straight river** and a **gentle bend**. Rotating their surface artwork in 60° steps must produce a continuous river, without gaps, blocked mouths or changing widths.

This is a production request, not permission to alter movement rules or map topology. New bitmaps must be generated using the imagegen skill. Read `EXPEDITIONS_MASTER_BRIEF.md`, `EXPEDITIONS_9FO_ART_REQUEST.md` and `EXPEDITIONS_VISUAL_ACCEPTANCE.md` first.

## References and appearance

Use these existing local assets as references, inspecting them before generation:

- `assets/expeditions/production/9fo/runtime/terrain/po-terrain-stream-v1.webp`: water colour, ripples, stones, grass and autumn planting.
- `assets/expeditions/production/9fo/runtime/terrain/po-terrain-hex-grass-v3.webp`: surrounding terrain palette and painted texture.
- `assets/expeditions/production/9fo/runtime/terrain/po-terrain-timber-bridge-v1.webp`: compatibility with Orchard crossings.

Match the warm, hand-painted Orchard style: clear blue-green shallow water, soft pale reflections, mossy earth, restrained round stones, golden grass and small autumn flowers. The water must read clearly at phone size. Keep the channel open, with modest bank detail; do not fill it with large boulders, plants, splashes or tiny clutter.

The existing stream image has a baked diamond/prism perspective. **Use its style, not its silhouette.** Rotating that entire image would also rotate its walls, perspective and shadows incorrectly.

## Layer and connection contract

Paint the **flat top surface only**: water and its immediate grassy banks, seen perpendicular to the battlefield's logical hex plane. No raised side walls, cast shadow, tilted perspective, border frame, text, arrows, numbers or highlights. Transparency outside the surface. Exact hex masks, registration guides and tactical overlays belong in code.

The top surface must fit the game's regular pointy-top hex, with a vertex at the top and bottom. All rotations use the same centre. Never squash, tilt or stretch one axis to make a connection fit. The renderer rotates the surface; tile walls, world lighting, props and bridge structures remain upright.

Use a code-authored registration guide. Reference layout on a 512×512 canvas:

- Hex centre: `(256,256)`; side length: `216`.
- Vertices: `(256,40)`, `(443.06,148)`, `(443.06,364)`, `(256,472)`, `(68.94,364)`, `(68.94,148)`.
- Water mouths sit at **edge midpoints**, never at corners.
- East mouth: `(443.06,256)`; west: `(68.94,256)`.
- South-east: `(349.53,418)`; south-west: `(162.47,418)`.
- North-east: `(349.53,94)`; north-west: `(162.47,94)`.

Both required tiles must share a **96-pixel water-mouth width**, measured along the connecting edge on this guide. Use the same water colour, bank positions and soft bank transition at every mouth. Keep the last 32 pixels approaching each mouth free of rocks, flowers, foam and other distinctive objects. Water must reach the edge fully, without a grass lip or a rounded closed end. Continue the channel beyond the guide boundary in the working painting, then apply the exact surface mask during preparation.

The mouth positions and widths are fixed registration requirements; the channel between them may curve organically. At a shared edge, the neighbouring tile must present the opposite mouth with the same width. No river may appear to climb the terrain wall or end against a strip of earth.

## Required tiles

| Asset | Base connections | Appearance |
|---|---|---|
| `po-river-straight-surface-v1` | West ↔ east | A continuous channel across the tile, with slight natural variation between its precisely aligned mouths. |
| `po-river-bend-gentle-surface-v1` | West ↔ south-east | A broad, smooth bend with a consistent channel width. Both banks follow the curve; water enters and leaves perpendicular to its connecting edge. |

The gentle tile makes a 60° change in the travelling river's direction. It has mouths on edges separated by 120° around the hex. Do not confuse the direction change with the angle between its edge connections.

One straight tile provides three distinct alignments; the bend provides six. Reuse these with runtime rotation, rather than generating separate pictures for every orientation.

**Conditional additional tile:** if an approved river route needs a tighter turn, create `po-river-bend-tight-surface-v1`, with west ↔ south-west mouths. This is a 120° direction change between adjacent connecting edges. The gentle bend cannot supply this connection merely by rotation. Do not produce junctions, waterfalls or a new scenery set for this request.

## Generation prompts

Generate the straight tile first, then use its approved image as a reference for the bend. Include the inspected stream/grass references and the appropriate code-authored connection guide. The guide is a placement aid; its lines and labels must not appear in the delivered painting.

**Straight river prompt**

> Paint a single reusable Ninefold Orchard river top-surface tile. Match the supplied Orchard stream and grass references: warm hand-painted storybook tactics terrain, blue-green shallow water with restrained pale ripples, mossy earth and golden grassy banks. Use the supplied pointy-top hex registration guide exactly. A clear river crosses from the midpoint of the west edge to the midpoint of the east edge. Both openings have identical prescribed width and bank alignment, and water continues right to and beyond the guide boundary before masking. Keep each opening unobstructed and visually simple so another copy joins without a seam. Natural variation belongs inside the tile, away from its connection mouths. Flat surface viewed perpendicular to its plane; transparent outside. No prism walls, perspective tilt, cast shadow, bridge, border, text, symbols, arrows, grid, baked lighting direction or tactical effects. Preserve the full square registration canvas and centre.

**Gentle river bend prompt**

> Create the matching gentle-bend version of the approved straight Orchard river surface. Keep exactly the same scale, canvas centre, water colour, mouth width, grassy banks and painting style. Follow the supplied guide: the channel connects the west edge midpoint to the south-east edge midpoint in a broad, smooth curve. Water approaches both openings perpendicular to their edge, with precisely matching mouths and no narrowing, earth cap, rocks or foam obstructing the joins. Both banks follow the curve naturally. Continue water beyond the guide boundary before applying the exact surface mask. This is a flat, rotatable top-surface painting, with transparent outside; no side walls, cast shadow, perspective tilt, border, text, arrows, symbols or baked tactical effects. Do not copy the diamond perspective of the old stream reference.

## Delivery and acceptance

Preserve original assets and full-resolution generated PNG sources. Deliver transparent sRGB WebP surfaces on an untrimmed **384×384 runtime canvas**, uniformly reduced from the registration canvas. Aim for at most 70 KiB per surface, retaining clean water and alpha edges. Do not make six separate orientation imports.

Record source/runtime paths, dimensions, bytes, hash, alpha, visible bounds, centre, mouth positions/width, connection edges, allowed 60° rotations and review status in the v2 art metadata. Express anchors in the actual file's pixel coordinates; rescale the reference guide consistently. Keep each asset `candidate` until it passes review.

Before importing:

1. Run `node scripts/validate_expedition_alpha.cjs <asset>` and inspect white, black, orchard-green and cyan composites. Reject checkerboard pixels, opaque fringes or detached paint fragments.
2. Assemble a code-positioned river strip containing straight → bend → straight, several consecutive bends and a bridge crossing. Test every rotated connection. Show the strip without grid lines so strokes cannot hide seams.
3. Check that water width, banks and colour join cleanly; no land wedge, gap, doubled rock or channel end appears at any shared edge.
4. Review at native size, minimum zoom and maximum zoom on desktop, tablet and phone. Movement colours, cost badges and selection outlines must remain readable over water.
5. Record contact sheets and actual renderer screenshots before acceptance. A convincing isolated bend is insufficient if it does not connect in the map.

Renderer integration must use the full registered surface canvas, with uniform scaling and the exact code hex mask. Do **not** reuse the old diamond-material crop window: it would move the mouths and spoil rotation alignment. Choose shape/orientation from the real river's neighbouring connections, including water beneath a bridge; do not rotate tiles randomly. Keep all hit areas, movement costs, collisions and production map topology unchanged. Any branch or broad-water area unsupported by these two-mouth tiles needs a separate recorded fallback or art request, not a forced bend.
