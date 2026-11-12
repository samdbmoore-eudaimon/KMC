# Visual movement selection

Owner: Codex. User request: selecting Dash should show reachable coloured battlefield hexes, rather than a coordinate target list.

Exact pre-edit claim: `expeditions/v2/ui/{OrchardExpedition.jsx,MapViewport.jsx,ActionPreview.jsx,recovery.css.js,feedback.js}`, new `expeditions/v2/ui/movement-view.js`, `scripts/dev/test-orchard-recovery.mjs`, this report and browser captures under `docs/expeditions/v2/evidence/player-recovery/`. C-05 lock held. Existing dirty changes preserved. No shared engine, route, persistence or legacy edits.

Keep production rules: Move, Dash and Intercept each spend one AP; path costs consume their Speed-based movement budget. Green = cost 1, amber = cost 2, blue = cost 3 or more, with actual cost numerals on the hexes. Selecting a destination previews first; Confirm executes the real command. Coordinate controls remain a secondary keyboard/text alternative, not the primary choice interface.

Additional pre-edit claim: `scripts/dev/build-orchard-recovery-preview.cjs`, solely to fit the labelled fixture banner, UI and QA trace disclosure to the real browser viewport without clipping mobile controls. No shared App layout changes.

## Delivered

Move, Dash and Intercept now select destinations directly on the battlefield. Selecting one closes any drawer, exposes that production command's reachable targets and shows a compact legend instead of TargetPicker's coordinate list. A green/amber/blue geometry-conforming overlay and readable cost numeral are attached to each legal hex. The same budget distinction is explicit in the legend and preview: any legal Dash spends one AP, while its distance/terrain cost uses Speed-based travel budget. Blue groups costs 3 and above; each actual value remains visible.

Clicking a reachable station hex while choosing movement previews movement rather than opening the station drawer. A chosen destination is marked with a tick and its production path is drawn on the board. Preview/cancel do not mutate gameplay. Confirm dispatches the actual command once, then leaves movement selection. Spent or otherwise unavailable Dash shows its reason and advertises no reachable destinations. Intercept keeps its optional named enemy selector. Coordinate controls remain only in the collapsed text/keyboard alternative; destination coordinates were removed from the main preview and movement result message.

Changed files: the exact claimed UI files and `movement-view.js`, `scripts/dev/test-orchard-recovery.mjs`, the isolated preview builder, this report and movement browser evidence. No new bitmap artwork, source asset changes or core numerical/ABI changes.

## Executable checks

`node --test expeditions/v2/ui/ui.test.js scripts/dev/test-orchard-recovery.mjs expeditions/v2/route-ui.test.js`: 13 passed. The controller UI check confirms Dash exposes greater reach than ordinary Move, each displayed cost matches the actual command target, map selection is a pure preview, Confirm spends one AP/readies no extra action and marks Dash spent, and spent Dash has no legal overlay. Existing duplicate-confirm, free puzzle editing, private gate, shared route resume, winning replay and reward checks still pass.

`node scripts/dev/build-orchard-recovery-preview.cjs`: isolated QA preview built, approximately 9.36 MB; no shared HTML rebuilt. Existing module/React act warnings remain non-failing.

## Actual browser evidence

Tested the existing Codex in-app browser development fixture at 1280×900, 768×1024 and 390×844. Saved `dash-map-{desktop,tablet,phone}.jpg` and `dash-preview-{desktop,tablet,phone}.jpg` under `docs/expeditions/v2/evidence/player-recovery/`. The fixture banner and QA disclosure now fit with the UI in the viewport, keeping phone Cancel movement accessible.

Pointer-clicked the highlighted control/station hex: a Dash preview opened directly with the selected hex and path, without the object drawer. Cancelled that preview without spending anything. Then pointer-selected a cost-9 hex and confirmed: Furrow spent one AP, moved to the selected destination and Dash became spent. Save & exit / Open route preserved this state. Its one-command record is `dash-map-command-trace.json`; production replay passes and `dash-map-verification.json` retains its hash, cost and AP evidence. The preview-only and cancelled interactions add no commands. Used production Undo afterwards to leave the disposable preview ready to inspect Dash again; the accepted pre-Undo trace remains preserved.

## Dependencies and limits

Scoped UX correction is implemented and its checks pass. Shared App build/integration remains Claude-owned and requires the final-build lock; no engine fix or new interface is required. Wider QA-01 and physical-device/child usability acceptance remain pending as recorded in the player-experience recovery report. The current browser is a labelled development fixture, not evidence of the integrated account route. Existing unrelated working-tree changes remain preserved.

Handoff: Claude `1790945907019-e4091095588a`, scrum `1790945907913-2d358bfcd894`. C-05 lock released after delivery.
