# Four Locks recovery evidence

Scope: actual browser interaction with a labelled development fixture wrapping the real private controller route and production reducer. Shared App browser acceptance remains pending. Viewports: desktop 1280×900, tablet 768×1024, phone 390×844. No physical device or child timing claim.

Review the restored setup in `setup-desktop-final.jpg`, `setup-tablet-final.jpg` and `setup-phone-final.jpg`, then `battlefield-desktop-final.jpg` and `battlefield-phone-final.jpg`. The phone view keeps the checklist collapsed and permits pan/zoom. Final caption backing and station name readability are visible in these captures. Earlier non-final images are preserved and may show older decoration.

The directory includes actual briefing stages, movement previews/results, free number draft, paid activation, station actions, ability purposes and unavailable reasons, enemy forecast/recap, combat, success and failure. Phone/tablet captures supplement the desktop flow; not every screen has a three-viewport capture.

`winning-replay-trace.json` is a 31-command complete UI win. `production-replay-verification.json` certifies it with the actual reducer and retains each state hash. Final hash: `1e3ad163b6f385f2`. `first-clear-progress.json` records three stars; `replay-progress.json` remains three, with zero replay award. The first 41-command manual-draft win has screenshot/award metadata; its full command record was not captured before activeRun clearing.

`failed-attempt-progress.json` contains the five-command deadline loss and zero stars. `failed-active-enemy-trace.json` is an additional UI loss after activation and visible enemy disruption.

Recheck with `node --test scripts/dev/test-orchard-recovery.mjs`. Rebuild only this isolated preview with `node scripts/dev/build-orchard-recovery-preview.cjs`. The generated `controller-route-preview.html` is not a shared App build or a public route.

Full ownership, changes, checks, limitations and required next integration/review steps: `docs/expeditions/v2/reports/codex-player-experience-recovery.md`.

Visual movement follow-up: `dash-map-{desktop,tablet,phone}.jpg` shows direct coloured destination selection with real travel-cost numerals, replacing the main coordinate list. `dash-preview-{desktop,tablet,phone}.jpg` shows selected hex/path and the real one-AP action cost. `dash-map-command-trace.json` and `dash-map-verification.json` certify a cost-9 Dash clicked through the board; it spends one AP and marks Dash spent. Details and current integration limits are in `docs/expeditions/v2/reports/codex-movement-map-ux.md`.
