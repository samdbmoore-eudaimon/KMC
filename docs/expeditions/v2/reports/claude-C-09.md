# Claude C-09: saves, stars, migration, App catalogue integration, final build

Task ID / owner / spec version: C-09 / Claude / baseline 1.0, coordination 1.1
State proposed: IN_PROGRESS (persistence, reward reducer and regression wiring done; final route wiring and whole-suite acceptance wait on C-06A/B)

## Claimed files

New: `expeditions/v2/persistence.js`, `persistence.test.js`, `controller.test.js`.
Edited (shared): `wm-progress-actions.js` (one re-export line for `applyOrchardV2Result`), `scripts/run_regression.mjs` (one step: `node --test "expeditions/v2/**/*.test.js"`). Build outputs `WallabyMaths.html` and `www/index.html` are gitignored; I rebuilt them.

## What exists

- `orchardV2Bucket` lives at `progress.expeditions.v2` with `{activeRun, familyTiers, tierAwards, tierBest, recentSeeds, attemptCounters, lossCounts}`; legacy `scenarios`, `moduleSetRewarded` and every other field are never rewritten; no change to `freshExpeditionProgress`/`migrateExpeditionProgress` was needed because a version-2 bucket is passed through unchanged (verified: a bucket without `v2` reads as fresh; a bucket with it round-trips).
- Saves: the active run is stored as its immutable `initialRun` plus the cumulative accepted-command log (and blueprint hash, rules version). Resume is deterministic replay, so hand, draft, effects, holds, comparison knowledge and the Undo stack come back exactly, and a finished enemy phase is restored whole, never half an action. Save version, blueprint hash or replay mismatch is reported (`save-version`, `blueprint-changed`, `blueprint-invalid`, replay failure) and never silently loaded.
- Reward: `applyOrchardV2Result(progress,{record})` replays the record; only a replay-verified win with the saved final hash can award. Key `primary:<familyId>:<tier>`; 3 stars with the existing `PACK_COST` conversion on first clear only; unlocks the next tier; best rounds/commands recorded; duplicates, repeat wins, locked tiers, forged/edited traces, non-wins and wrong module return the input object unchanged. No Reveal token, `moduleSetRewarded` untouched.
- Retry reuses the saved blueprint under a new run id; New map advances the persisted attempt counter and derives its seed from it (never date based); last 8 parameter seeds per family/tier are kept and passed to the generator.

## Evidence

`node --test expeditions/v2/persistence.test.js expeditions/v2/controller.test.js` -> 15 pass, 0 fail. These assert: 19 stars + 3 -> 2 stars and 5 packs; unlock chain and skipped tiers; legacy fields preserved; duplicate callback returns the identical object; a later win of an awarded tier adds 0; forged `won:true`, dropped command, wrong hash, status edit and wrong module are all refused; save -> load equality of the state hash incl. Undo; phase-boundary resume; tampered blueprint/rules version reported; two profiles isolated; loss counted once; retry and New map; the 8-seed cap; input progress never mutated; and the controller flow begin -> 27 dispatches -> auto-claimed win -> bucket cleared.

Build: `node scripts/rebuild.cjs` rebuilt (`WallabyMaths.html` 98,007,809 bytes; I did not measure the v2 contribution separately) and `node scripts/bundle_smoke.cjs` printed `Runtime errors: none` / `SMOKE TEST PASSED`. The full `npm test` has NOT yet been run for this report (see below).

## Known failures or unverified acceptance

- `npm test` as a whole is not claimed. `node --test "expeditions/v2/**/*.test.js"` (the new regression step) passed 92 of 92 in 2.8 s on a re-run; one earlier run of the same glob did not finish inside a 120 s tool limit while other work was using the machine, and I have not reproduced or explained that, so treat step duration as unverified.
- Not yet wired into the visible app; see `claude-C-06A.md`.
- Android/device persistence, real localStorage size with a long command log, and the effect of `setProgress` writes on a tablet are unmeasured.

## Next dependency

C-06B (Codex) -> I wire `ExpeditionScreen`, update `scripts/test_expedition_screen.cjs`, run the full `npm test`, rebuild and report exact outputs.

## Scrum review fixes (R-02 to R-05) with evidence

- R-02: `beginOrchardRun` rejects invalid or unowned squads (`unowned-card`, `invalid-squad`) for empty, missing, zero, negative and string counts. Fixtures now own their cards.
- R-03: rewards require `finalStateHash`, a saved run with matching id, blueprint hash and origin whose log is a prefix of the winner, owned cards and printed roster profiles. Tests cover foreign record, no saved run, different saved run, missing hash, altered profile, unowned card, non-extending log; save-then-claim, resume then win, and duplicate claims still award once (3 stars).
- R-04: recent list stores `parameterSeed` (fallback `seed`); test uses a distinct requested seed and parameter seed 999.
- R-05: `shouldPersist` is true for every accepted command; test closes/reloads after a maths edit and a hint (draft and hint stage restored). Cost with realistic logs is not yet measured.
- Evidence: `node --test "expeditions/v2/**/*.test.js"` -> 99 tests, 99 pass; the scrum repro script now shows unownedSquadAccepted false, freeDraftEditPersisted true, full-health Mend legal.
- Route: `profile={currentProfile}` added (D-13), ENGINE_API sections 9 and 11 updated. Real route integration is still open: `expeditions/v2/ui/OrchardExpedition.jsx` does not exist yet (only sub-components). Full regression/build re-run follows that wiring. Device, tablet and child-playtest acceptance remain open.

## Overnight status (revision 1.2)

Real route wiring is still pending: `ui/OrchardExpedition.jsx` exists and matches the controller props, but Codex has not yet published a public blueprint generator entry or certified reference (their message of 22:32). Resume steps for the wiring pass: (1) inject Codex's generator as `generateBlueprint` and `registerOrchardPuzzleHooks` as `ensureHooks` in a primary-only branch of `expeditions/ExpeditionScreen.jsx`; (2) update the primary expectation in `scripts/test_expedition_screen.cjs`; (3) claim `final-build`, run `npm test`, rebuild, bundle smoke; (4) release. Latest unit evidence: `node --test "expeditions/v2/**/*.test.js" scripts/dev/test-orchard-v2-tactical-planner.mjs` -> 123 tests, 123 pass.
