# C-08B: bounded Four Locks candidate-pool inventory

Owner: Codex. Coordination1.2. This inventory batch is complete and stopped. Parent bank task remains IN_PROGRESS.

Changed files: `scripts/dev/inventory-four-locks-pool.mjs`, `scripts/dev/test-four-locks-pool.mjs`, `docs/expeditions/v2/certification/four-locks/candidate-pool-inventory.json`, this report and the parent C-08B report. Current generators, certified candidates/traces/results, runtime entries, planner, core, App and shared build outputs were not edited.

Exactly160 requests: seeds0..7 × tiers1..5 × river/islands/hedges/terraces. Each uses the unchanged256 topology-attempt and256 puzzle-attempt caps. No planner call, extra seed, certification or bank entry.144 mathematical/topology successes,16 bounded unknowns, zero explicit failures. All unknowns are `sudoku-advanced-attempt-budget`: T4 seed4 in every archetype; T5 seeds1,5,6 in every archetype. No sampled topology or entity-placement rejection occurs. Unknown remains distinct from impossibility.

| Tier | Archetype | Success / unknown | Canonical topologies | Sudoku patterns |
| --- | --- | --- | --- | --- |
| 1 | river | 8 / 0 | 8 | 8 |
| 1 | islands | 8 / 0 | 8 | 8 |
| 1 | hedges | 8 / 0 | 8 | 8 |
| 1 | terraces | 8 / 0 | 8 | 8 |
| 2 | river | 8 / 0 | 8 | 8 |
| 2 | islands | 8 / 0 | 8 | 8 |
| 2 | hedges | 8 / 0 | 8 | 8 |
| 2 | terraces | 8 / 0 | 8 | 8 |
| 3 | river | 8 / 0 | 8 | 8 |
| 3 | islands | 8 / 0 | 8 | 8 |
| 3 | hedges | 8 / 0 | 8 | 8 |
| 3 | terraces | 8 / 0 | 8 | 8 |
| 4 | river | 7 / 1 | 7 | 4 |
| 4 | islands | 7 / 1 | 7 | 4 |
| 4 | hedges | 7 / 1 | 7 | 4 |
| 4 | terraces | 7 / 1 | 7 | 4 |
| 5 | river | 5 / 3 | 5 | 3 |
| 5 | islands | 5 / 3 | 5 | 3 |
| 5 | hedges | 5 / 3 | 5 | 3 |
| 5 | terraces | 5 / 3 | 5 | 3 |

Patterns are the same for a given tier/seed across archetypes because the mathematical substream is independent of topology; changing control coordinates is correctly omitted from Sudoku incidence. Thus each tier has8,8,8,4,3 patterns respectively, not32,32,32,16,12. Counts use full canonical serializations. Sums, artwork, IDs and D6/Sudoku symmetries do not count. Every distinct sampled topology/pattern has a representative seed, hash and complete canonical serialization in the JSON, with terrain/cost/anchor/passage/hazard roles and givens/cage/protection incidence inspectable. Per-request solver uniqueness, deduction count, topology metrics and advanced rejection counters are retained.

T1–3 already demonstrate the required eight mathematical patterns and eight topologies in each archetype in this small sample. This makes those diversity counts plausible for a future bank, but only32 candidates per tier were sampled, all uncertified here. Nothing proves64 tactically playable entries, an extra fallback or child/UI acceptance.

T4 lacks one sampled successful topology per archetype and four puzzle patterns; T5 lacks three topologies per archetype and five patterns. These are sampling shortfalls, not a universal limit. T4 already yields four patterns despite only three warm-start templates, so claiming a hard three-pattern ceiling would be false.

## Exact advanced-construction bottleneck and proposed next change

`expeditions/v2/generation/advanced-sudoku.js` starts from only three verified `PATTERNS`, transforms their cage memberships with arbitrary box-preserving row/column permutations and rejects the entire attempt if any cage becomes disconnected. These permutations preserve Sudoku validity but usually do not preserve physical cage adjacency. Across the eight independent river seeds (not multiplied by the identical maths in other archetypes), T4 records922 geometry rejections and53 technique rejections before seven accepts; T5 records1508 geometry rejections and104 technique rejections before five accepts. All other advanced rejection counters are zero in this sample. That is approximately94%/93% geometry loss over attempted constructions. Six of seven T4 successes and four of five T5 successes use warm-start pattern1; pattern2 produces no accepted result in this sample. Constraint additions/removals still produce some genuine incidence changes, but repeated transformed warm starts dominate the accepted pool.

Concrete proposal within generation-spec§4: keep seeded canonical solution/symbol/row/column generation, but construct initial cages directly from the existing native adjacent2/3-cell `templates` on the final board, deriving totals from that solution. Start with all16 givens, remove shuffled givens with exhaustive uniqueness after each accepted removal and add/remove seeded connected cages to exact tier targets. Preserve the complete human-rule acceptance, T4 pair+intersection and T5 pair+proved causal-chain requirements, all costs/enemies/output budgets and256-attempt bound. This spends attempts on genuinely different cage incidence rather than mostly invalid geometric transforms. Use the existing warm starts as optional fallback inputs, not a source of diversity credit. This is a proposal only; no construction change or extra search was made here.

Any implementation must leave the certified reconstruction path/content hashes pinned. A separately selectable offline construction packet with deterministic parameters can be evaluated before a reviewed runtime regeneration/version handoff; it must not silently change current certified seeds or claim a new bank. Connectivity rejection can also be reduced by choosing a native cage set after the solution transform rather than transforming its geometry. Neither approach lowers the acceptance rules or guarantees eight accepted advanced patterns without fresh evidence.

Topology's current baseline crossings remain fixed to the archetype defaults; jittered anchors, native hedge additions and root costs nevertheless yield eight distinct sampled maps for T1–3. No structural topology ceiling is proved. The proposed crossing displacement step in generation-spec§2 is not implemented in the current topology loop; this is an existing coverage limitation to address before claiming the complete procedural algorithm, not a reason to change certified outputs in this batch.

Executable checks:

```text
node scripts/dev/inventory-four-locks-pool.mjs
node --test --test-reporter=dot scripts/dev/test-four-locks-pool.mjs expeditions/v2/generation/bank.test.js expeditions/v2/generation/runtime-generation.test.js
```

Outcome:11/11 targeted checks pass. Tests verify the160-request cap and unique request identities with an injected fixture generator, reject invalid sampling bounds before generating, keep unknown/failure evidence out of diversity counts and validate every saved representative/hash and published group count. Equivalent seed/label copies remain one topology/pattern. Tests do not generate another live pool or call the planner. Existing certified T1 production-reducer runtime routes still replay successfully. No new screenshot for this offline inventory.

Ready dependency: bounded pool evidence can inform subsequent Four Locks construction/bank work. Current certified-coverage audit remains unchanged: it counts only replayed certificates, while this JSON counts uncertified candidate-pool feasibility. Runtime remains the accepted river T1 reference only. Bank certification/depth, advanced pattern expansion, private App/QA-01, other-family gates, device/child acceptance and Claude-owned R-07 remain pending.
