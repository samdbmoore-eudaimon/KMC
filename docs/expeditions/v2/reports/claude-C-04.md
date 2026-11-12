# Claude C-04: enemy forecast/resolution, hazards, commissioning, charge, holds, Undo

Task ID / owner / spec version: C-04 / Claude / baseline 1.0, coordination 1.1
State proposed: REVIEW (engine side). Integration with Codex's generated maps is the open item; see "Known failures".

## Claimed files

`expeditions/v2/enemy.js`, `rules.js` (protection, damage, passages), `actions.js` (hold, calibrate, prepare-alcove, undo, end-round), tests `phase.test.js`, `phase2.test.js`, `cards.test.js`, `combat.test.js`, `integration.test.js`. No Codex-owned file edited.

## Behaviour implemented (and where the spec left a choice, what was chosen)

- **Frozen forecast**: `forecastEnemyPhase` clones the state and runs the same `runEnemyPhase` that `end-round` runs. Targets and per-enemy paths are planned once after phase-start outputs, then executed in initiative order (ascending number, then id); an occupied step stops the walk at the last free tile; a lost target fizzles; no retargeting. Forecast records carry `path`, `actualPath`, `targetId`, `verb`, `power`, `puzzleChange`, `hpChange`, `blockedBy`.
- **Enemy rules** per generation spec section 3: Jammer disrupts the first ranked member whose group protection is below its power, else strikes the control; Hunter lowest HP (ties path cost then id), flies over water/roots and respects sight; Breaker largest charge fraction by cross product with Shape/Sustain/Number tie order and roots set its movement to 0 but allow an in-range strike; Rewinder takes the highest-degree unprotected wheel from range 3 with sight, else strikes the nearest hero.
- **Protection**: shield = maximum grant, damage absorbed is subtracted from every grant; lock/stabilise use the maximum applicable grant; a weak lock or stabilise that is out-powered is consumed together with the other grants on that member's groups; hold-derived grants carry `sourceHoldId` and vanish when that hold is cancelled (move, True Shift, switching station, defeat) while casts survive; Counterturn cancels the next disruption of one enemy.
- **Occupied bridge**: a player Commit that would close an occupied open passage is refused (`bridge-occupied` naming occupants); an enemy corruption sets `closingPending` (occupants may leave, nobody may enter) and the passage closes the moment it is empty. Unpowered passages are impassable (the Hunter alone flies over a closed bridge).
- **Phase order**: phase-start outputs (storm, shelter incl. covered cells, roots, beams, reserve benefit, repair stream snapshot, nest snapshot) -> frozen intents -> enemy resolution -> environmental hazards (per site, optional puzzle mutation, shelter suppression) -> nest hazards -> post-hazard restoration only if the orchard lives -> commissioning test on the same snapshot -> cleanup (grants, holds, one-phase effects) -> deadline or next round.
- **Commissioning** (`evaluateVictory`): three distinct heroes, each holding their own job at the snapshot, printed stats re-checked (alcove profile = Geometry-2, Speed 6, only if prepared), all three stores full, required outputs powered, plus the family `commissionCheck` hook. Unmet conditions are listed with codes and numbers.
- **Charge** (`calibrate`, Shared Charge): capacity per tier, min(Arithmetic, missing), Shape and alcove share one store; charge is retained on a failed snapshot and nothing is consumed at all (win is terminal).
- **Undo**: snapshot per accepted non-boundary command, restores AP, hand, hp, positions, draft, effects; comparison log and allowance and hint stage overlay the restored state; End Round clears the stack; Undo itself is a replayable command.

## Evidence (all run on this machine, 2026-10-01)

`node --test expeditions/v2/engine.test.js combat.test.js phase.test.js phase2.test.js cards.test.js integration.test.js persistence.test.js controller.test.js route.test.js` -> 74 tests, 74 pass, about 1.2 s. Highlights beyond C-01's list: storm/roots/strike-window/shelter/repair stream/reserve benefit/T5 two-site hazards/beams/nests/shelter suppression/Rewinder/Counterturn/alcove/Breaker targeting each have a dedicated assertion; every one of the 30 roster heroes gets the exact four-card hand; 12 of 16 hand cards have a direct behavioural test (Exact Blow, Marked Shot, Shared Charge, True Shift, Wide Brace, Stand Together, Field Repair, Mend, Root Shelter, Linked Lock, Intercept, Dash, Driving Blow, Crosswire, Counterturn, Second Wind). `integration.test.js` drives Codex's real `sudokuHooks` end to end: reference puzzle solved through draft edits, 5-point output budget accepted and 9 refused, Tier 2 Cornix/Kernel/Beeswax run wins and replays with an identical hash, and a Hookmole jam removes the lowest non-given cell.

Fixed this round after Codex's report `codex-C-02.md`: `compare-loads` now rejects unknown load ids (`unknown-load`) before the hook runs, and any exception thrown by a hook surfaces as `internal-error` instead of crashing the UI. Test in `combat.test.js`.

## Known failures or unverified acceptance

- Only the Sudoku hooks have run end to end. Rotation, balance, nonogram and packing hooks are untested through the engine until Codex's blueprints for them exist (C-03/C-07). I will add the same style of integration test when they land.
- No tactical certificate (two target-band winning traces per bank entry) exists; that is C-08 and uses `Driver`/`reduceCommand`. A helper (`test-helpers.js` `Driver`) is available but is not a planner.
- The `jammed`-station wording and the per-site T5 hazard damage need a product decision (see `claude-C-01.md` interpretations 2 and 3).
- Performance numbers are fixture-only (see claude-C-01.md).
- Hero `initiative` is carried in the profile but, per spec, only sets default tray order in the UI; the engine imposes no turn order.

## Next dependency now ready

Codex can assemble the Four Locks slice (C-06B) as soon as `ui/OrchardExpedition.jsx` exists: the route adapter, controller, persistence and reward reducer are published (`ENGINE_API.md` section 9).

## Scrum review fixes (R-01)

Mend and Mend Again now works on full-health heroes and stations for its shield (3 for Science 6), still 1 AP, hand-exhausting, same range; a full orchard stays `nothing-to-repair`; Repair unchanged. Test: `review-fixes.test.js` R-01.
