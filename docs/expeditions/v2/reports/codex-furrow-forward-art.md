# Furrow forward-facing artwork

Owner: Codex builder. Exact pre-edit claim: `expeditions/v2/art/{renderer.js,art.test.js}`, `expeditions/v2/ui/OrchardExpedition.jsx`, this report and `furrow-forward-*` evidence in the player-recovery directory. C-10 lock held. No dedicated station-art files, bitmap source assets, engine or App edits.

Inspected existing Furrow front, back and selected idle derivative: front/idle files are correct. The resolver incorrectly held the rear pose indefinitely after any earlier move towards the top of the board, including events retained after Undo. The portrait tray also requested the live battlefield pose. Use forward idle for stationary heroes and a stable forward portrait; preserve action/holding and exhausted battlefield cues. Rear artwork remains preserved for a future actual movement animation, not inferred persistent state.

Delivered: removed the lasting rear-pose inference from movement history; introduced `orchardPortraitFor` selecting forward idle independently of AP, holding or old moves, and wired the tray to it. Existing front artwork, anchors, original files and gameplay state are unchanged. This fixes the same persistent rear-pose defect for all stationary heroes rather than adding a Furrow-only exception.

Checks: `node --test expeditions/v2/art/art.test.js`: four passed, including forward Furrow after a northward move and stable forward portrait. Holding/exhausted cues, repaired Wicker asset bounds, sprite anchors and embedded byte/hash checks remain passing. An initial test adaptation accidentally applied repaired rear-asset margin requirements to Wicker's existing idle; corrected the test to keep validating the original repaired rear asset separately, without weakening bounds or art acceptance.

Browser: refreshed isolated controller-route preview; visually verified forward Furrow on the board and tray at desktop and phone sizes. Evidence: `docs/expeditions/v2/evidence/player-recovery/furrow-forward-desktop.jpg` and `furrow-forward-phone.jpg`. Temporary viewport override reset. No shared App build; Claude integration and broader QA-01 remain pending. The separate station-art writer's assignment message remains unacknowledged, since it is intended for that writer.

Scoped fix complete; no unresolved executable failures. C-05 was also claimed for the tray integration, with both C-05 and C-10 released after handoff.
