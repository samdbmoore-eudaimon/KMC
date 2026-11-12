# Playthrough recovery: 3 October 2026

Sam rejected the current playthrough and explicitly authorised handing60–70% of this recovery to Claude. This task allocation supersedes earlier61/39 ownership for the files below, only for this recovery. QA-01 remains failed. No assertion that the preview is now acceptable.

## User observations

Sorrel moved towards the lower bridge and a hedge appeared to block the far exit. Tuppence reached the next bridge but could not leave, with no apparent blocker. Neither cause has yet been diagnosed. Sam wants generated hedges to preserve usable bridge approaches/exits and paths. Do not assume an AP, holder, root-cost or closed-passage explanation without reproducing and showing it.

Movement should preview on the first destination tap and execute on a second tap of the same hex; retaining a Confirm alternative is fine. Do not dispatch twice or spend actions on the first tap.

The mission remains incomprehensible. Explain what to do, where and why, using recognisable places on the board. Puzzle opens Sudoku from anywhere, although Sam expected to stand at its control: distinguish free draft editing from actual adjacent activation under the existing rules, with a clear route to the control and honest availability. Do not silently change rules to fit the UI.

Permanent station labels obscure the board. Replace them with desktop hover/focus and mobile tap inspection. Every action needs an accessible explanation, especially Puzzle. Station props span several hexes, so their actual tile is unclear: shrink and centre them to fit the hex and visibly mark its exact footprint. Hero feet float above their shadows: correct registration or remove the misleading shadow.

## Claude: approximately65% of recovery effort

Transferred exact production files for this task:

- `expeditions/v2/ui/OrchardExpedition.jsx`, `ActionPreview.jsx`, `Briefing.jsx`, `Guide.jsx`, `PuzzlePanel.jsx`, `action-guide.js`, `AbilityHand.jsx`, `feedback.js`, `recovery.css.js`, `movement-view.js`. Claude owns movement interaction state, preview/second-tap confirmation, availability explanations, mission onboarding, contextual next step and action tooltips. Codex does not write these files during this recovery.
- `expeditions/v2/generation/four-locks.js`, `displaced-four-locks.js`, `displaced-metrics.js`, `index.js` and associated generator tests: bridge approach/exit and useful-path hedge invariants. Existing core/route/App ownership continues.
- New generation regression fixtures, any required versioned bank/planner recertification tooling/evidence and shared App build under final-build lock. Preserve previous save/certificate artifacts; do not overwrite a certified packet with changed topology or infer playability from static connectivity. Any new/changed selected mission must replay through the real production reducer with unchanged costs/stats/enemies.
- Report `docs/expeditions/v2/reports/claude-playthrough-recovery-20261003.md` and Claude-specific evidence directory.

First reproduce Sam's two movement cases using the retained current controller trace/save. Publish the actual causes, chosen repairs and exact regression checks. If insufficient trace remains, use real fresh UI playthroughs and label what is or is not reproduced. Fix both gameplay and visual misleading passage feedback where appropriate.

Map callback contract stays `onMoveTarget(hex)` for each destination tap. `movementPreview.destination/path` already exists. Claude handles repeated destination taps in the parent, while Codex preserves pointer/keyboard hits and calls the same callback. Publish any additional required props early; no invented core ABI.

For action explanations implement hover/focus help on desktop and explicit touch/keyboard help that does not accidentally execute an action. Keep primary tap activation clear; do not make ordinary play require a tooltip dismissal. Guidance must explain: reach the number lock; edit/activate correctly; power the three distinct jobs; keep eligible holders in place; survive the enemy phase. Tailor exact verbs, costs and position requirements to production state. Showing counts without explaining purpose is insufficient.

## Codex: approximately35% of recovery effort

Exact file claims: `expeditions/v2/art/renderer.js`, `art.test.js`, `station-art.test.js`, new `placement.js`; `expeditions/v2/ui/MapViewport.jsx`, `StationLabels.jsx`, `StationStatus.jsx`, `station-labels.js`, `station-state.js`, `RiverTerrain.jsx`; new `scripts/dev/playthrough-visual-review.jsx`, `build-playthrough-visual-review.cjs`, `playthrough-visual.test.mjs` and bounded visual evidence under `docs/expeditions/v2/evidence/playthrough-recovery-20261003/`. All bitmap/manifests remain art-owned; repair placement in code first. Codex owns station/hero/bridge scale, grounding, exact hex footprint and map hover/focus/tap inspection. No engine, generator or transferred instructional UI edits.

Shared isolated preview builders remain Codex-owned. Do not concurrently rebuild their HTML while either contributor changes imported sources. Shared full App build remains Claude-owned with final-build lock.

## Acceptance checks

1. Real bridge crossings usable from both land approaches; hedge placement cannot close a crossing's useful exit or sever required routes. Old save behavior explicitly checked.
2. First tap previews only; second same-hex tap commits exactly once. Changed target replaces preview; actor/revision changes cancel stale preview. Keyboard Confirm remains usable.
3. Child-facing instructions identify one actionable next step and board location. Puzzle purpose and remote draft/adjacent activation distinction explicit.
4. Station names/status appear on demand, with touch/focus access and dismissal. Action help explains purpose, cost, target and unavailable reason.
5. Station artwork fits its one logical hex; tapping/hovering points to that exact tile, never sprite-overlap neighbours. Feet and ground contact agree at minimum/native/maximum zoom on phone/tablet/desktop.
6. Full production-reducer winning run, save/resume/rewards/private gate and actual App integration evidence required before another ready-to-play invitation. No lowered thresholds or weaker enemies.

Handoff mechanism: shared local Claude mailbox. Claude is external to the available Codex chat tools, so a mailbox delivery does not claim to awaken its session. This report is the copyable instruction packet for that session.
