# Claude C-08A: tactical planner

Task ID / owner / spec version: C-08A / Claude / baseline 1.0, coordination 1.2
State proposed: REVIEW (interface published; search strength is limited, see below)

## Claimed files
`scripts/dev/orchard-v2-tactical-planner.mjs`, `scripts/dev/test-orchard-v2-tactical-planner.mjs`, `scripts/dev/orchard-v2-plan-cli.mjs` (reference invocation), this report.

## Interface (FROZEN for Codex's C-08B)
```js
import { planOrchardBlueprint, feasibleJobAssignments } from "scripts/dev/orchard-v2-tactical-planner.mjs";
planOrchardBlueprint({ blueprint, teamChoices: [{cardIds, deploymentAssignment?}], planFamily: "direct-guard"|"alcove-intercept",
                       maxStates = 250000, beamWidth = 120, avoidOutputChoices = [], profiles = null, onRound = null })
 -> { status: "success"|"unsatisfiable"|"unknown", traces, metrics, reasonCode? }
```
- `success` means EVERY team in `teamChoices` has a verified trace. `traces[i] = {teamIndex, cardIds, planFamily, assignment:{number,shape,sustain}, outputChoice, committer, initialRun, commands, perCommandHashes, finalStateHash, rounds, commandCount, beamWidth}`.
- A trace is returned only after `replayRun` re-accepts every command through the real reducer and ends `won` by round 5. Replay it with `replayRun({initialRun, commands, finalStateHash})`.
- `unsatisfiable` only when EVERY team is statically infeasible: no assignment of its three cards to Number/Shape/Sustain meets the printed profiles (direct, or the alcove profile for `alcove-intercept`). That is an exact proof, reported as `reasonCode:"stat-infeasible"` with 0 states spent. Per team detail is in `metrics.perTeam[]`.
- Everything else is `unknown` (`budget-exhausted`, `no-plan-found`, `partial`). A failed search is never an impossibility claim.
- To get a second plan on the same team, pass `avoidOutputChoices:[firstTrace.outputChoice]` and/or the other `planFamily`.
- Blueprints must be Codex's real `generateFourLocksCandidate(...).blueprint` (or any validated blueprint whose puzzle hooks are registered with `registerOrchardPuzzleHooks()`); the planner needs `hooks.solutionDraft`.

Runnable reference: `node scripts/dev/orchard-v2-plan-cli.mjs --tier 2 --cards cornix,kernel,beeswax --seeds 1-4 [--family alcove-intercept] [--out traces.json]`.

## How it searches (and what it does not prove)
Round-synchronous beam search over macro states, de-duplicated by the canonical `stateHash`; iterative widening beam 3, 8, 24, then `beamWidth`. A hero's round is a script: commit the puzzle (worked-solution draft via `request-hint` stage 3, `select-outputs`, paid Operate; it re-commits after corruption), prepare the alcove, walk to the job station, calibrate, then one spare action from the legal protection/strike/charge-help set (lock, Counterturn, strike, Exact Blow, Stand Together, Guard, Stabilise, helper Calibrate, Repair, or for the alcove family Intercept/Marked Shot), a "help another station" walk, or an "engage the nearest enemy" walk; then synchronous Holds; then End Round. Branching: job assignment, deployment (nearest-station first), output pair, committer, movement endpoint (best two), spare option (up to four). Pruning is duplicate-state only. HP dominance is NOT used because the Hunter targets lowest current HP. Candidates are ranked by a progress score, so the beam cuts valid plans: the search is incomplete by design and its failures mean "not found".

## Evidence
- `node --test scripts/dev/test-orchard-v2-tactical-planner.mjs`: 6 pass, 0 fail (replayable win with matching per-command hashes; stat-infeasible squad -> unsatisfiable with 0 states; 15-state budget -> unknown; two distinct teams; alcove family prepares and holds the alcove; avoiding an output pair).
- Real Four Locks candidates (`generateFourLocksCandidate`, river layout), direct-guard, 12,000-40,000 states:
  - Tier 2 Cornix/Kernel/Beeswax: seeds 1 to 4 all success in 235 to 1,146 states, 4 or 5 rounds, 26 to 32 commands.
  - Tier 3 Barrow/Cobweb/Amberly: seeds 2 and 3 success, seed 1 unknown at 12,000 states.
  - Tier 1 Bushel/Furrow/Pip: seeds 1 to 6 all unknown at 12,000 and 60,000 states (see below).
  - alcove-intercept: Tier 1 Bushel/Dapple/Pip success on seeds 1 and 4 (unknown on 2 and 3); Tier 2 Cornix/Warden/Beeswax success on seeds 1 to 3.

## Known limits
- Tier 1 Bushel/Furrow/Pip has not been solved on any tried seed. By hand: the Jammer reaches the control by phase 4 and its disruption lands before the winning snapshot, the only squad member able to stabilise (Pip, Science 6) cannot also hold the Sustain station, and winning by round 3 needs about 7 AP from Furrow. Either a better plan exists that this macro set cannot express, or that candidate is genuinely infeasible; the planner cannot tell which. Codex's C-08B should treat Tier 1 as unproven rather than rejected.
- Only Four Locks (Sudoku hooks) has been exercised end to end. Other families need Codex blueprints; the engine integration tests for them are in `claude-integration-extra.md`.
- Speed: roughly 0.6 ms per reducer call (state clone), 12,000 states is about 6 s. Not tuned for tablets (tooling only).
- Defeating enemies is only attempted by the "engage" macro; protection by Stabilise or Lock is only used when the caster happens to be in range.

## R-07 (2 October)

`Budget` now counts admitted transitions only (a denied spend never increments `used`), is hard capped at 250,000, and a non-integer or negative `maxStates` returns `unknown` with `invalidbudget` semantics (`reasonCode:"invalid-budget"`). Regression: `test-orchard-v2-tactical-planner.mjs` (7 tests pass). Engine 1.3 also passes `{comparisonLog, comparisonsUsed}` as a fourth argument to `hooks.hint` (Codex's balance-hint request).
