# Claude: independent recovery acceptance, setup/roles (3 October 2026)

State: REVIEW for the checks below. QA-01 is NOT accepted; no native device or child comprehension check was possible and none is claimed.

## Files
New: `expeditions/v2/route-harness.js` (jsdom harness bundling the real ExpeditionScreen), `recovery-acceptance.test.js`, `recovery-reward.test.js`, `recovery.test.js`. Edited (transferred): `ui/MissionSetup.jsx`, `ui/squad-advice.js`, `ui/OrchardExpedition.jsx`, `ui/recovery.css.js`. Builder-owned renderer/map files were only read.

## Setup and roles
`squad-advice.js` adds `heroJobSummary`, `heroFitLine`, `heroRoleLine`, `PRACTICE_TEXT`; every owned card in setup now says what the hero is best at and which station job(s) its printed stats meet (or the closest job and exact shortfalls), and the shortfall warning states what a practice attempt means: same rules, a hero below a job's printed stats cannot Hold that station, nothing lowered, nothing chosen for you. The starting three cards are still the collection's first three (explicitly labelled not a recommendation); the owned-team suggestion still changes the squad only on its explicit button.

## Defect found by the new acceptance run (fixed)
Switching hero left the previous hero's move preview on screen, and tapping the same hex after switching back committed immediately (a stale preview acting as a first tap). Selecting a hero (tray or map) now clears the pending preview. Test: `recovery-acceptance.test.js` movement case 2.

## Evidence (real ExpeditionScreen as the eligible profile with an owned collection)
`node --test expeditions/v2/recovery-acceptance.test.js`: 7 pass.
- Movement: first tap previews, saves and spends nothing; a different hex replaces it; second tap on the same hex commits exactly one command; Confirm commits exactly one; stale preview dropped on hero change.
- Bridges: all 64 runtime bank maps have no unusable crossing (`crossing-invariants`).
- Puzzle: Next-step guidance, "Two steps" note (free from anywhere vs on or beside the Ledger control), opening it activates nothing.
- Action help: every action has a title and a separate `?` button; help shows Cost/Uses/Target and never dispatches.
- Enemy phase and loss: five rounds through the UI show the forecast, the recap and a loss message; no stars on loss.
- App path: legacy Expeditions progress untouched, run saved before the first move, resume after remount, any other profile renders nothing, no owned cards means no Embark.
`node --test expeditions/v2/recovery-reward.test.js`: 5 pass. Certified winning traces for bank entries 0, 17, 40 and 63 are played through the controller on their regenerated runtime maps: 3 stars once (19 -> 2 stars, 2 -> 3 packs), tier 2 unlocked, save cleared, legacy fields intact, second claim a no-op. Setup advice test passes.

## Not covered
jsdom has no layout, touch or pixels: tooltip positioning, station footprints and hero foot registration, raised-bridge drawing and screenshots remain the builder's visual evidence. A full win driven through UI clicks (rather than the controller) is not done. Native device, child comprehension, tablet performance: unverified.

## Shared build (3 October, after Codex's visual sources were declared stable)

Under the final-build lock: `npm test` -> All 25 steps passed (includes the v2 suite, rebuild of WallabyMaths.html and www/index.html, and the bundle smoke test). Lock released. This does not accept QA-01: no live-UI win, native device, tablet or child comprehension check has been done.
