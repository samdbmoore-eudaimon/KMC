# C-03 native-adjacent offline construction packet

Owner: Codex, C-02/C-03, coordination1.2. This bounded packet/comparison batch is complete and stopped. Advanced diversity and the overall tasks remain incomplete.

Changed files: new `expeditions/v2/generation/native-sudoku.js`, `native-sudoku.test.js`, `scripts/dev/compare-four-locks-native.mjs`, `docs/expeditions/v2/fixtures/four-locks-native-comparison.json`, this report and existing C-02/C-03 claim reports. No current default generator, topology source, existing candidate/trace/certificate, runtime entry, shared engine/hook ABI, App, planner or build output was changed. Existing reconstruction hashes remain pinned.

The separate offline export is `generateNativeSudokuPacket({tier,seed,maxAttempts=256,solverNodeBudget=100000,fallbackAttempts=0})`, packet ID `native-adjacent-v1`. It has no production runtime import. Seeded symbol/band/row/stack/column permutations first construct the solved board. It then samples directly from native connected2/3-cell cages on those final cell coordinates and derives totals from the solution. Cage geometry is never transformed with a Sudoku row/column permutation. It starts with all16 givens, adds shuffled cages while proving exhaustive uniqueness after each addition and removes shuffled givens while proving uniqueness after each accepted deletion. Final targets are exactly the seeded1–2 givens/5–7 cages for T4 and0–2/5–8 for T5. Every change in an accepted packet records its cells and uniqueness solver nodes.

The pure `evaluateNativeSudokuPuzzle` gate independently enforces target ranges and native adjacency, exhaustive unique solution and a complete human-rule trace. T4 requires an actual naked-pair elimination and cage intersection; T5 requires an actual pair plus a proved causal cage chain. T5 can use at most one accepted bounded contradiction in its complete human trace, through the existing verified human-rule helper. No costs, pressure, tier rules, mathematical threshold or attempt budget were reduced.

The explicit optional `fallbackAttempts` reserves that many of the same total maximum256 attempts for the unchanged template generator. Fallback results are labelled `source:'explicit-template-fallback'` and retain their separate native rejection counts. A fallback never earns native pattern diversity. All comparison calls set this option to zero. This option is not invoked at runtime.

## Sixteen-request comparison outcome

Exactly16 full mathematical requests: tiers4/5 × seeds0..7,256 attempts each, no planner. All16 return bounded `unknown`; there are zero accepted native puzzles and zero accepted native canonical patterns. Full per-seed results/counters and baseline identities are retained in `docs/expeditions/v2/fixtures/four-locks-native-comparison.json`. Baselines were read from the prior inventory and were not regenerated. The comparison was sampled once; subsequent targeted tests exercise boundary options and labelled existing fixtures rather than sampling another full pool.

| Tier | Native successes / unknowns | Native patterns | Geometry rejects | Clue-target rejects | Human-incomplete rejects | Technique rejects | Previous successes / patterns |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4 | 0 / 8 | 0 | 0 | 169 | 6 | 1873 | 7 / 4 |
| 5 | 0 / 8 | 0 | 0 | 453 | 0 | 1595 | 5 / 3 |

No cage-target or solver-budget rejection occurred in the default comparison. Each tier spends2048 native construction attempts. The previous warm-start sample stopped earlier on success: its922/1508 geometry and53/104 technique rejects are therefore actual work counters over different attempted totals, not matched-rate denominators. Native cages remove the measured geometry bottleneck but uniform cage selection does not yield the required advanced combination within this bound. This is not an improvement in accepted-puzzle yield and not proof that native construction cannot work.

There is no accepted native serialization to publish as an eight-pattern claim. The comparison explicitly stores null pattern entries for unknowns. Future work would need a deterministic cage-selection/constraint-incidence strategy that produces the required rules often enough, followed by fresh bounded evidence. Do not replace the current construction, add these unknowns to a bank, loosen techniques or extend this batch's search. No topology displacement change was made.

## Executable checks and limits

```text
node scripts/dev/compare-four-locks-native.mjs
node --test --test-reporter=dot expeditions/v2/generation/native-sudoku.test.js expeditions/v2/generation/advanced-sudoku.test.js expeditions/v2/generation/runtime-generation.test.js scripts/dev/test-orchard-v2-certification.mjs
```

Outcome:24/24 targeted tests pass. Independently exhaustive oracles check the acceptance gate against clearly labelled existing proved T4/T5 fixtures, including the unique solution, every human placement and local cage completion/removal, actual advanced eliminations and counterfactual causal-chain support. These fixtures test the gate; they are not new native construction successes. Disconnected cages, invalid targets, missing inputs and exhausted solver budgets cannot pass. Tests distinguish unknown from failure, enforce the256-attempt cap, preserve all16 unknown sample identities and zero pattern credit, and verify that the optional known-template fallback is explicit and stays inside the same total budget. No nested guessing is introduced.

Regression evidence includes all six pinned basic-generation hashes, previously saved advanced puzzle hashes, existing production-reducer candidate certificates and both certified T1 runtime replays. The reusable terrace candidate/blueprint hashes remain `17576a9c85fdeca7`/`f0a1f73bbe8af8ac`. Runtime remains the accepted river T1 reference only. No full rebuild, screenshot, device/child test or complete-bank acceptance.

Ready dependencies: a separate deterministic native packet, an independently checked strict acceptance gate and honest negative yield evidence are available for review. Unresolved: native advanced incidence selection, eight-pattern coverage, certified bank depth, actual private App/QA-01, other-family gates and Claude-owned R-07. All existing accepted evidence remains usable. C-02/C-03 remain IN_PROGRESS; native comparison stopped and C-03 lock released after handoff.
