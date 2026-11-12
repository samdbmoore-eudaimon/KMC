# River tile artwork instructions

Owner: Codex. User requests instructions for a rotatable bend river tile and compatible straight river, so the battlefield shows continuous flowing water.

Exact pre-edit claim: `docs/expeditions/v2/river-tile-art-request.md` and this report. This task writes the production brief only; it does not generate artwork or change the renderer/engine. Existing dirty files and original artwork are preserved.

Inspected the existing `po-terrain-stream-v1.webp`: its painted stream is useful as a colour/material reference, but its baked diamond/prism perspective must not be rotated as a whole. The new river surface needs registered edge mouths on the current exact pointy-top hex plane. Terrain walls and lighting remain fixed code layers.

Delivered `docs/expeditions/v2/river-tile-art-request.md`: required straight and gentle bend, a conditional tighter bend for otherwise unrepresentable connections, matching channel-mouth widths, 60-degree rotation, explicit source references, generation prompts, runtime/metadata limits and connected-river QA. Registration coordinates follow the existing pointy-top projection. Existing diamond crop must not be reused for these registered surfaces.

Outcome: instructions ready for artwork production. No images generated, renderer integration or engine edits performed. No executable game checks needed for this document-only change. Art generation, alpha/connected-strip checks and visual acceptance remain outstanding.
