# C-06B: Four Locks private vertical slice

## Latest continuation handoff,2 October

Changed owned files in this batch: `puzzles/puzzles.test.js`; `ui/PuzzlePanel.jsx`, `OrchardExpedition.jsx`, `MapViewport.jsx`, new `StationGlyph.jsx`; `art/renderer.js`, `art.test.js`, `runtime-art.js`, `manifest.json`; `scripts/dev/embed-orchard-v2-art.cjs`, `prepare-orchard-v2-art.cjs`, new `review-orchard-idle-art.cjs`, `make-orchard-plinth-guide.cjs`, `measure-orchard-v2.mjs`; task reports, `art-source-overrides.json`, new `art-preflight-review.json`, art-delivery metadata, repaired/guide bitmap sources and versioned QA/runtime derivatives. Paths under puzzles/ui/art are relative to `expeditions/v2/`. No Claude-owned or shared build file changed.

Executable checks: `node --test expeditions/v2/puzzles/puzzles.test.js`22 passed; `node --test expeditions/v2/ui/ui.test.js`6 passed via in-memory esbuild; `node --test expeditions/v2/art/art.test.js scripts/dev/test-orchard-v2-art.cjs`5 passed; embed/review/guide/performance scripts succeeded. Current49 embedded assets cover all30 hero idles,17 first-slice extra poses and2 Hookmole states,1,266,492 bytes. Hints are visible inside the drawer, output selection stays coherent, tree art is reused, poses follow real state/events and regular station geometry distinguishes jobs. Desktop command performance evidence is under `performance/four-locks-reference.json`.

Trace evidence remains `docs/expeditions/v2/certification/four-locks/tier-1-river-seed-1/{candidate,traces,result}.json`, certificate `orchard-v2-7bb0c308bb8ec44f`. Historical losing/teaching attempts remain under `references/four-locks/`. Isolated artwork QA is under `assets/expeditions/production/9fo/v2/qa/`, including the four30-idle contact sheets and versioned repair sheets. No real App screenshots exist yet; do not treat art contact sheets as them.

Ready dependencies: default/named UI with D-13 profile/controller props, registered five real puzzle hooks and certified Four Locks T1 generator export are ready for Claude's C-06A route wiring. Still blocked: real App route, UI playthrough/screenshots, QA-01 and subsequent family/bank expansion. Remaining independent art issues: rejected painted plinths, withheld Dapple action with reported idle fallback, non-imported poses/effects and live anchor alignment. Balance knowledge-aware hints await optional context publication; R-07 is Claude-owned. No full build/regression ran without the shared build lock. The private gate and legacy files are preserved.

## Current dependency snapshot,2 October

Certified reducer proofs and runtime generation entry are ready as recorded below. Certification tests now pass8/8. The private renderer imports26 assets and has real-state pose mapping, a reused living tree objective, distinct station/control geometry and readable in-drawer hints. UI checks6/6, puzzle checks22/22, artwork checks5/5. No shared App/build/save/reward file has been edited by Codex.

Blocker: Claude's `expeditions/ExpeditionScreen.jsx` has not yet wired the published v2 component/generator/hooks. Its C-06A report still states it is waiting for those exports, but the exports and certified fallback have been published in this report and sent through the mailbox. The mailbox cannot wake an external stopped Claude session. The real private UI playthrough, screenshots and QA-01 submission must wait for that route. No substitute preview, borrowed cards or gate bypass is used. Expansion to other families remains gated on first-slice review.

Owner: Codex. Baseline 1.0, coordination 1.1. State: IN_PROGRESS.

Claimed files: `scripts/dev/assemble-four-locks-reference.mjs`, `docs/expeditions/v2/references/four-locks/`, `expeditions/v2/generation/four-locks.test.js`, `docs/expeditions/v2/reports/codex-C-06B.md`. Existing C-03 and C-05 files remain claimed by the same writer. Real reducer, replay and engine-owned enemy phase are read-only dependencies. No winning trace or visual acceptance is claimed until executable evidence exists.

`ui/OrchardExpedition.jsx` now exists with the C-06A frozen controller props. All existing shared route, App and bundle files remain Claude-owned. Generator export and first certified reference will follow here; please wire them only after that readiness record.

## Current evidence

`node --test expeditions/v2/generation/four-locks.test.js`: 4 passed. T1–3 samples have exhaustive uniqueness and forced completion chains. The T2 reference preserves its exact two givens and six cage sums. Candidate blueprints retain real charge capacities, integrity, enemy wake/roster, five-round deadline and output costs. T4/5 explicitly return unknown pending advanced deduction evidence.

Production reducer traces: `references/four-locks/tuppence-furrow-sorrel.json` wins round4, 34 commands, final hash `bea753c9ffe4cf36`, replay verified. `bushel-furrow-pip.json` loses at the round5 deadline, 41 commands, final hash `2584867205ffe1b3`, replay verified. Both use `candidate.json`. This is reproducible planning evidence, not a certificate. C-08A planner is now Claude-owned and has these inputs through the mailbox; the missing second squad/alcove win remains a dependency for runtime bank readiness. QA-01 has not been submitted.

## Certified private reference ready for C-06A

The old teaching-fixture attempts above are retained. A different generated T1 candidate is now certified, without any changed costs or pressure: `docs/expeditions/v2/certification/four-locks/tier-1-river-seed-1/`. It has two distinct Common squads and output plans, including the prepared physical alcove. Direct Tuppence/Furrow/Sorrel: round5, 32 commands, hash `eb243ce597680830`. Alcove Bushel/Dapple/Pip: round4, 25 commands, hash `9b7ed500343d0e41`. Certificate `orchard-v2-7bb0c308bb8ec44f` is accepted by independent per-command production replay. This supersedes the missing-reference dependency above, not the unfinished bank/QA claims.

Claude may now import `generateOrchardBlueprint` from `expeditions/v2/generation/index.js` and `registerOrchardPuzzleHooks` from `expeditions/v2/puzzles/index.js`, then pass the latter as ensureHooks. Named/default UI remains `expeditions/v2/ui/OrchardExpedition.jsx`, with D-13 props including profile. Only Four Locks tier1 is available. The runtime returns the certified private reference fallback, regenerates its exact content hash, keeps requested seed distinct from parameterSeed1 and reports repeats. It does not claim a64-entry procedural bank. No App or ExpeditionScreen edits by Codex.

Checks: `node scripts/dev/certify-four-locks.mjs --tier 1 --seed 1 --max-states 40000` succeeded; `node --test scripts/dev/test-orchard-v2-certification.mjs` 4 passed; `node --test expeditions/v2/generation/runtime-generation.test.js` 3 passed, including both actual winning command arrays with a different runtime requested seed. Renderer screenshots, UI playthrough, art import and QA-01 review remain.
