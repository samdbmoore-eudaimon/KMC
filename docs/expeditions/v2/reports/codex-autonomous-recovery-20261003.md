# Autonomous saved-run recovery: 3 October 2026

Owner: dedicated Codex builder, RECOVERY-CONTINUATION-20261003. Sam's takeover authority is recorded in scrum-autonomous-recovery-20261003.md. Claude's 09:04 UTC final-build handoff reports all 25 regression steps passed and explicitly releases the final-build lock; mailbox status has no Claude claims. This is concrete evidence its shared-build step completed. A stable-source acknowledgement has also been requested through the mailbox. No still-held claim is stolen. Obsolete UX-VISUAL-20261003 released.

Exact additional files claimed before editing: new `expeditions/v2/save-recovery.js` and `save-recovery.test.js`; `expeditions/v2/persistence.js`, `controller.js` and `ui/OrchardExpedition.jsx` for automatic idempotent resume migration and a visible repair explanation; `scripts/dev/orchard-v2-tactical-planner.mjs` for real-reducer continuation search; `scripts/dev/orchard-recovery-preview.jsx` and its builder for a refreshed disposable preview that preserves the original QA storage key; new bounded recovery evidence tools, evidence in `docs/expeditions/v2/evidence/autonomous-recovery-20261003/` and this report. Shared generated App outputs will only be rebuilt under final-build. No historical certificate/trace/bank files will be overwritten.

State proposed: REVIEW. The executable saved-run recovery and App checks below are complete. QA-01 remains a scrum/product acceptance decision; device performance and child comprehension are unverified.

## Result and exact changes

The saved map automatically clears only hedges4,6 and4,2. The versioned repair verifies the original log, reconstructs the same initial run and replays every retained command. It accepts the repair only when the complete gameplay state hash is unchanged. Heroes, health, actions, round, puzzle work and holds are preserved. The old certificate/content hash are retired, and the original active save is archived once under `runMigrations`. Invalid or incompatible records stay intact with an explicit resume reason. Historical certified banks, traces and certificates were not edited.

Sam's original four commands are retained exactly. Original blueprint4ca99a048c1f76c1 becomes repaired blueprinta900267f8d2ea6c4; retained gameplay hash remains6601c1ad779b3490. The known source certificate is orchard-v2-7bb0c308bb8ec44f. Recovery provenance and the full unchanged-rule winning continuation are in the evidence directory.

Additional claimed production file: `expeditions/v2/ui/MapViewport.jsx`. Live testing found station inspection could cover a reachable destination: movement mode now clears inspection and suppresses station hover/focus until movement ends. The map still sends one destination callback per activation. `controller.js` was read, not changed.

Live winning acceptance also exposed two result-navigation defects. `OrchardExpedition.jsx` no longer saves a won state on Back, so leaving cannot resurrect a completed active run. `persistence.js` keeps `lastCompletedRun` when awarding a verified winner; Retry same map can start its exact blueprint after the active save is cleared. All ownership and award validation remains in force, and repeat clears add no stars.

Additional bounded development files: `scripts/dev/build-recovery-app-qa.mjs`, `serve-recovery-app.cjs`, `verify-recovery-ui-evidence.mjs`. Existing visual test script strengthened to focus an actual station destination during movement. No unrelated App, subscription, catalogue or legacy production files were edited.

## Actual UI evidence

All winning commands were entered through production controls. No winning state was injected. Isolated fixtures use disposable collections and storage; the original `orchard-recovery-qa-only-v1` key was not cleared or reset.

1. Retained save: automatic migration, first-tap preview, second-tap travel, repaired bridge exit, save/exit/resume, free official puzzle solution hint, honest remote activation rejection, adjacent paid activation, lowered crossing, station power/protection and three separate holders. Won on enemy turn4 with26 commands. Independently replayed final hash842ccaa06a398651. Exactly3stars, active save cleared, one original-save archive.
2. Fresh runtime bank entry41: explicitly selected owned Tuppence/Furrow/Sorrel, activated the puzzle, travelled, powered stations, struck Hookmole and held all three jobs. Won on enemy turn4 with25 commands; replay hashcd8639bffc367b92. Mouse confirmed the first moves; later off-screen hexes used the keyboard destination controls and Confirm. Exactly3stars, active save cleared.
3. Retry same map: actual Retry button retained blueprintc173f27b11ee929c, started a new run ID and replayed all25 reviewed actions through UI controls. Won on turn4; hash1bd5c462d8752b05. Result explicitly says "Already awarded: no replay stars." Currency stays3stars, one tier award. Back/re-entry returns to setup with the tier marked cleared.
4. Live warned-practice loss: initial Pip/Nine/Bramble team, five explicitly confirmed enemy phases, deadline loss explaining unfinished operating jobs/puzzle and a next-attempt hint. Real replay confirms lost at round5; currency stays3stars.
5. Rebuilt offline App: copied the unmodified built App into a separate-port fixture with synthetic local profiles, starting collection and Sam's original four-command save only. The existing Rooke developer shortcut naturally maxes the collection/currency on entry. Opened real Home → Expeditions; automatic migration was visible; moved Tuppence, saved/exited and resumed; completed the same26-command winning route on turn4 through App controls. Back → Home → Expeditions shows cleared-tier setup, not the completed active run. A normal Pip profile has no Expeditions entry. Main-App result/navigation DOM captures are retained; no separate full-App command export or normal-account pack conversion is claimed.

Evidence root: `docs/expeditions/v2/evidence/autonomous-recovery-20261003/`. Winning UI records, progress records, loss records, App DOM captures, provenance, logs and `ui-evidence-verification.json` are retained there. Earlier browser screenshots include migration, movement, draft/activation/help, bridge exit, enemy forecast, three holders at phone/tablet/desktop and the retained-run winning screen. The prior144-capture placement matrix is in `evidence/playthrough-recovery-20261003/` and documented by `codex-builder-recovery-20261003.md`.

## Verification and build

- `npm test`: all25steps passed after the production migration, movement-inspection and post-win changes. Includes rebuild, bundle smoke and191v2 tests. Full log `regression.log`.
- Final `node --test expeditions/v2/save-recovery.test.js scripts/dev/playthrough-visual.test.mjs`:8pass,0fail. Checks exact-state repair, archive/idempotence/legacy preservation, invalid logs, retained winning proof/reward carry, post-win exact-map retry/zero reward, UI Back without resurrection and geometry/inspection/input invariants. Log `focused-final.log`. These final test additions do not change bundled production source.
- `node scripts/dev/verify-recovery-ui-evidence.mjs`: passed. Independently replays three actual UI wins and the loss, checks retained commands, exact retry blueprint, one award, cleared saves and App DOM results.
- Both shared HTML outputs are101543835bytes and SHA25641197d418d5ac8a9bb093fa0951734aed13d63a2454426c3a43d9ac1c4d5095c. Main App and controller preview rebuilt under this builder's final-build claim. No deployment or APK package modification.

Bundler tests initially hit sandbox parent-directory read restrictions; the approved normal-read execution passed. Early new retry-test failures were test setup errors: the production award boundary requires an owned saved origin, and the state command log is exported through `exportRunRecord`. They were corrected without weakening any production guard. Final evidence is green.

## Honest limits and next dependency

Later fresh/full-App screenshot capture timed out in the browser capture service, including its documented fallback; their actual DOM results and route records are retained. The earlier retained-run visual screenshots and matrix remain valid. No fresh/full-App bitmap capture, physical touch, native Android, tablet performance, child comprehension or five-minute completion time is claimed. The UI still uses the exact private gate and unchanged costs, stats, enemies, deadlines and rewards.

The code/trace/desktop development part of the P0 recovery is ready for scrum review. Current board requires QA-01 review before C-07/other-family bank expansion, and product acceptance is scrum-owned. No new family or art batch was invented. Sources are stable and final-build is released with this report; the remaining staged redesign dependencies can be assigned once that review gate is recorded.

