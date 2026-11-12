# C-08B: resumable offline displaced T1 bank

2 October 2026. Fixed first batch complete and stopped. GeneratorVersion2, explicit `four-locks-displaced-v1` construction packet only. This is an offline review manifest; bank completion and QA-01 acceptance remain false.

## Changed files

Claims were recorded in `codex-C-08B.md` before edits. New driver `scripts/dev/assemble-displaced-t1-bank.mjs`, new tests `scripts/dev/test-displaced-t1-bank.mjs`, this report and parent report. Derived manifest: `docs/expeditions/v2/certification/four-locks/displaced-v1/bank-manifest.json`. New immutable evidence: `docs/expeditions/v2/certification/four-locks/displaced-v1/bank-candidates/tier-1-{river,islands,hedges,terraces}-seed-{1,2,3,4}/`.

Each directory contains generation/request start markers, full candidate, two request/result records, winning traces and final certification result. Four existing seed0 evidence directories were read without modification. Claude-owned core, planner, App/save integration and current runtime version1 reference were not edited. Existing dirty working-tree changes were preserved. No shared build or new artwork was needed for this offline driver.

## Executable checks

```text
node scripts/dev/assemble-displaced-t1-bank.mjs
node --test --test-reporter=spec scripts/dev/test-displaced-t1-bank.mjs expeditions/v2/generation/displaced-four-locks.test.js expeditions/v2/generation/runtime-generation.test.js scripts/dev/test-orchard-v2-certification.mjs
node scripts/dev/assemble-displaced-t1-bank.mjs
```

Initial run: exactly16 new candidates, seeds1..4 per archetype, exactly32 planner invocations, two per candidate requesting8000 states each. No expansion or unknown retries. Ten new complete certificates, six retained unknown certificates,26 winning traces containing717 accepted commands. Independent production-reducer replay, production card/stat commissioning, distinct target-band teams, different actual output plans and winning-phase physical alcove requirements determine eligibility. No thresholds, enemies or costs were changed.

Targeted checks:27/27 pass. Tests cover all20 saved candidate records, full deterministic reconstruction of every accepted packet plus fallback, production command hashes, tampering, version/provenance/request limits, canonical deduplication, fallback exclusion and each completeness gate. Synthetic count fixtures test gate boundaries only; they are never saved as certified mission evidence. In-memory interruption tests prove completed slots cannot call the generator/planner again, interrupted started slots consume their allowance and retained trace checkpoints cannot be overwritten.

Actual disk resume: processed0, skipped16, zero generation or planner calls. It independently replays retained evidence and refreshes only the derived manifest. An interrupted generation/attempt is retained as unknown rather than retried. Immutable file writes refuse existing paths; unresolved partial-write collisions require review.

## Batch outcomes

| Archetype | Seed | Outcome | Reported states, direct/alcove | Certificate |
| --- | --- | --- | --- | --- |
| river | 1 | certified | 238/1039 | orchard-v2-030d1dca182d94ab |
| river | 2 | certified | 213/1028 | orchard-v2-c00028182093c875 |
| river | 3 | unknown | 1984/8020 | none |
| river | 4 | unknown | 1143/8033 | none |
| islands | 1 | certified | 256/309 | orchard-v2-70c397790c9aeb20 |
| islands | 2 | certified | 196/300 | orchard-v2-0bf00a1df486cb24 |
| islands | 3 | certified | 1559/248 | orchard-v2-beb9dfe2005f35a7 |
| islands | 4 | certified | 1000/1703 | orchard-v2-da4a33476439f0a2 |
| hedges | 1 | unknown | 602/8053 | none |
| hedges | 2 | unknown | 8007/3593 | none |
| hedges | 3 | certified | 194/563 | orchard-v2-6eea5ce40a18854d |
| hedges | 4 | unknown | 1689/8003 | none |
| terraces | 1 | unknown | 205/8013 | none |
| terraces | 2 | certified | 244/364 | orchard-v2-3b6c3e819c5e1dc4 |
| terraces | 3 | certified | 222/1893 | orchard-v2-08035f95a9bda1dc |
| terraces | 4 | certified | 5257/2807 | orchard-v2-2d7d7cb97705e2f0 |

Six unknown candidates lack a second distinct target-team and different output-plan proof. Hedges seed2 retains a genuine alcove win but lacks the direct proof; the other five unknowns lack a physical alcove proof. Unknown means unproved within this search budget, not impossible. Their successful single traces are retained but cannot create a bank entry.

Known Claude-owned R-07 remains visible: six exhausted requests report overages20,33,53,7,3,13, totalling129 denied-spend counts. Every request is8000. These counters do not establish actual admitted reducer work beyond the cap. Driver neither repairs the planner nor weakens acceptance.

## Coverage and ready dependencies

The three existing non-river seed0 certificates plus ten new certificates yield13 distinct accepted entries. Existing river seed0 certificate `orchard-v2-17b09eb354d2a122` is the separately identified certified fallback, excluded from entry/topology/pattern counts. Full canonical topology and Sudoku incidence serializations determine deduplication; a changed source ID, seed, art, hash label or copied fallback cannot inflate counts. Parameters, full candidate/content hashes and certificate IDs are retained in the manifest for reconstruction and review.

| Gate | Actual | Required | Remaining |
| --- | --- | --- | --- |
| Material entries | 13 | 64 | 51 |
| Archetypes represented | 4 | 4 | 0 |
| River topologies | 2 | 8 | 6 |
| Islands topologies | 5 | 8 | 3 |
| Hedges topologies | 2 | 8 | 6 |
| Terraces topologies | 4 | 8 | 4 |
| Sudoku patterns | 5 | 8 | 3 |
| Separate certified fallback | yes | yes | 0 |

Three failed gates keep `complete:false`:64 distinct material entries, eight topologies per archetype and eight puzzle patterns. Driver and evidence are ready for scrum/Claude review. No runtime import or migration, no private App/QA-01 acceptance, no other-family expansion and no device/child acceptance. No new screenshots: this batch executes offline production reducer traces only. Trace paths are the `traces.json` files in each immutable evidence directory above. C-08B remains in progress; this fixed batch is stopped and its advisory lock is released after handoff.
