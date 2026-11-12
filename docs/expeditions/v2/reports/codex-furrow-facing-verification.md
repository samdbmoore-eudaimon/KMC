# Furrow facing verification

User request: use the forward-facing Furrow artwork rather than the rear view.

Scope: read-only inspection of renderer, embedded assets and current controller preview; evidence files in `docs/expeditions/v2/evidence/player-recovery/hero-furrow-{idle,rear}-embedded.webp` and `furrow-forward-after-move.jpg`. No engine, shared App, gameplay or artwork source edits.

The current renderer already selects `hero-furrow-idle` for standing and moved heroes. The embedded image, runtime derivative and manifest all match SHA256 `fe496e68240ba58a1532efa4bc097c273bd79652f0db80a09dd34241f6cd0c9e`. Visually inspected this image: Furrow's face and blue neckerchief are visible. The rear asset has a different hash and is not selected by movement.

Reloaded the existing localhost controller preview, retried its disposable QA map and confirmed a real northward move from the UI. Furrow retained the forward image with one action remaining. Saved the visible battlefield screenshot above. Current source required no further change.

Executable check: `node --test expeditions/v2/art/art.test.js`: four tests passed. Shared App/build acceptance remains Claude-owned and was not run.
