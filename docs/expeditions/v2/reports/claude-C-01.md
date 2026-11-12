# Claude C-01: schemas, constants, printed profile, pure rules/actions/combat/preview/replay

Task ID / owner / spec version: C-01 / Claude / baseline 1.0, coordination 1.1
State proposed: REVIEW (interface FROZEN as of this report; see ENGINE_API.md)

## Claimed files (exact)

All new, under `expeditions/v2/`. No existing file was edited by C-01.

- `constants.js`, `schema.js`, `profile.js`, `hex.js`, `rules.js`, `actions.js`, `enemy.js`, `run.js`, `puzzle-hooks.js`, `fixture.js`, `test-helpers.js`, `index.js`
- Tests: `engine.test.js`, `combat.test.js`
- Docs and fixtures: `docs/expeditions/v2/ENGINE_API.md`, `docs/expeditions/v2/fixtures/{blueprint.fixture,state.initial,state.final,preview-move,preview-hold-fail,preview-stale,forecast.round1,list-commands.bushel,win-trace.record}.json`
- Script: `scripts/dev/export-orchard-v2-engine-fixtures.mjs` (regenerates the fixtures)

C-04 content (enemy forecast/resolution, hazards, commissioning, charge, holds, Undo) is also already in `enemy.js`/`actions.js`; its completion record is `claude-C-04.md`.

## Problem and resulting behaviour

Codex had no engine to code against. There is now one pure, deterministic core: `createRun`, `listCommands`, `previewCommand`, `reduceCommand`, `forecastEnemyPhase`, `resolveEnemyPhase`, `evaluateVictory`, `exportRunRecord`/`replayRun`, plus a frozen puzzle hook registry. Preview and reduce run the same code; the forecast is a dry run of `end-round`.

## Public interfaces

See `docs/expeditions/v2/ENGINE_API.md` (command ABI, result payload, state shape, blueprint contract, hook interface, reason codes). Import only `expeditions/v2/index.js`.

## Evidence

Commands and exact outcomes (2026-10-01, Windows, Node on this machine):

- `node --test expeditions/v2/engine.test.js expeditions/v2/combat.test.js`: 23 pass, 0 fail
- `node scripts/dev/export-orchard-v2-engine-fixtures.mjs`: wrote fixtures; 27-command winning run, final hash `ad11f1ecfdc51221`, replays identically with a per-command hash
- Preview p95 over 100 previews on the 92-tile fixture is inside the 16 ms budget (asserted in `combat.test.js`; this is the fixture tier-1 map on this machine only, not the supported tablet)

What the tests actually prove: derived stat formulas for printed cards; spec worked example (G7 + support 1 - armour 3 = 5, mark makes 7); zero-damage strike legal with warning and mark kept; held allies give no support; Hold shortfalls and station-held reasons; hold cancellation removes only that hold's grants; shield grants never form a second pool; stale/invalid commands do not mutate; AP, hand exhaustion, Refocus and Second Wind rules; forecast equals resolution; Hunter lowest-HP targeting; occupied-bridge refusal and the enemy-corruption interlock; lock/Counterturn protection; Undo within a round and not across End Round; irreversible weighing knowledge with free repeats and swaps; deadline and hero-death losses; alcove preparation and profile; complete replayable winning run and refusal of a tampered trace.

## Known failures or unverified acceptance

- Only a trivial fixture puzzle is exercised. The real five puzzle hooks (Codex C-02) have not been run through the engine yet; `claude-C-04.md` records that integration as the next step.
- Output effects `storm`, `roots`, `strike-window`, `beam`, `reserve-benefit`, `repair-stream` and T5 two-site hazards are implemented but have no tests yet (C-04 owns them).
- Tablet performance, memory and child timing are not measured.

## Interpretations Codex and the product owner should review (also listed in ENGINE_API.md section 6)

1. Enemy order is ascending initiative number (Hunter 3, Rewinder 4, Jammer 5, Breaker 7).
2. Jam "disabled station" wording in spec section 3 is not implemented: nothing in the spec says which action disables a station, so there is no `jammed` flag. Please confirm none is wanted.
3. Orchard hazard damage applies per listed site (T5 can take it twice in one phase).
4. A Sustain Hold's stabilisation does not protect against Jammer/Rewinder puzzle changes (only a lock or stabilise on a group does), matching the spec's group-versus-site distinction.
5. Wide Brace may target the caster; Stand Together may not.
6. `Repair`/Mend refuse a full-health target (`nothing-to-repair`) rather than spending AP for nothing.

## Questions for Codex

- Hooks must return `outputTruth` per output id and members with `hex` (needed for Rewinder range). Is that compatible with your `sudokuHooks`? Your `common.js` expects `puzzle.outputs[].cost`; the engine reads `blueprint.outputs` for effects, so put `cost` on those same records.
- Blueprint `puzzle.lockGroups[].anchor` must be a hex key; please include a group named `network` (or set `puzzle.networkGroupId`).

## Next dependency now ready

- Codex: C-02 (hooks can be registered and exercised end to end), C-03 (blueprint schema is `validateBlueprint`), C-05 (preview payload is frozen; `fixtures/` for UI states). The only thing C-06B still waits for is C-06A's route adapter.

## Addendum (engine 1.1)

Backward compatible changes after Codex's `codex-C-02.md` report: `reset-draft` edit, `draftDiffersFromActive`, unknown-load rejection and structured `internal-error` for hook exceptions (details in `ENGINE_API.md` section 10). Latest evidence: `node --test "expeditions/v2/**/*.test.js"` -> 93 tests, 93 pass (includes Codex's puzzle and topology tests). Full `npm test`: 24 of 25 steps passed; "primary generator sanity" failed once with `BUILD/LOAD FAILED: The service was stopped` (an esbuild service error, likely concurrent builds) and passed on a standalone rerun (604,977 checks, 0 fails). A clean full re-run has not yet been done.
