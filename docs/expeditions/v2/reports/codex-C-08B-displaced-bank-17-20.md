# C-08B: fixed displaced T1 increment, seeds17..20

2 October 2026. Fifth authorised batch complete and stopped:16 fresh candidates,32 planner invocations,ten new complete certificates and six retained unknowns. Offline version2 bank now has57 distinct accepted entries plus separate fallback. All diversity/fallback gates pass; seven missing entries keep `complete:false`.

## Changed files and preservation

Exact claims preceded edits in `codex-C-08B.md`. Changed owned driver `scripts/dev/assemble-displaced-t1-bank.mjs`, tests `scripts/dev/test-displaced-t1-bank.mjs`, derived `docs/expeditions/v2/certification/four-locks/displaced-v1/bank-manifest.json`, parent report and this report. New immutable directories: `docs/expeditions/v2/certification/four-locks/displaced-v1/bank-candidates/tier-1-{river,islands,hedges,terraces}-seed-{17,18,19,20}/`.

Explicit batch `17-20` is added to the allowlist; exact seed membership and unchanged two8000-state limits apply. Unsupported ranges fail before work. No automatic next batch, cap escalation or old unknown/checkpoint retry. Earlier completed batches are independently replayed into cumulative coverage. All524 prior evidence files, seed0 and seeds1..16, retain matching before/after SHA256 `488c957ee8a24adc4a5afef634b463edebebd0eed5f3432da9473f4e0ef31481`, computed from sorted relative filenames and exact bytes.

Existing dirty changes were preserved. Runtime/default version1, Claude source, App/private gate/rewards and shared build outputs were untouched. No artwork or live UI change in this offline increment.

## Executable checks and outcomes

```text
node scripts/dev/assemble-displaced-t1-bank.mjs --batch 17-20
node --test --test-reporter=spec scripts/dev/test-displaced-t1-bank.mjs expeditions/v2/generation/displaced-four-locks.test.js expeditions/v2/generation/runtime-generation.test.js scripts/dev/test-orchard-v2-certification.mjs
node scripts/dev/assemble-displaced-t1-bank.mjs --batch 17-20
```

All35 targeted checks pass. New tests enforce fifth-batch seed bounds/request identity, independently replay all16 new packets, reconstruct ten accepted packets, verify32 requests/26 wins and exact cumulative manifest membership/gaps. Existing production reducer/preview hashes, real printed-card stat/commissioning assignments, target strength bands, distinct teams/different output plans, actual winning alcove endpoint, canonical/provenance/tampering checks, separate fallback and interruption/no-retry tests remain passing.

Initial invocation processed16/skipped0, exactly two8000-state requests each.26 new winning traces contain700 accepted commands. Each new directory's `traces.json` is executable real production-reducer evidence and `result.json` records requests/counters/independent certification. Actual disk resume processed0/skipped16 with zero generation/planner calls; only derived manifest refreshed. No screenshots: this is offline reducer certification, not private UI acceptance.

| Archetype | Seed | Outcome | Reported states, direct/alcove | Certificate |
| --- | --- | --- | --- | --- |
| river | 17 | certified | 692/1514 | orchard-v2-17c644cc9d4161a5 |
| river | 18 | certified | 211/2010 | orchard-v2-7ac95362cea4d257 |
| river | 19 | certified | 226/1180 | orchard-v2-6058ba0c890830b1 |
| river | 20 | certified | 163/955 | orchard-v2-8309ba5137799e74 |
| islands | 17 | unknown | 1426/8011 | none |
| islands | 18 | certified | 595/1509 | orchard-v2-d6043f6949474d34 |
| islands | 19 | unknown | 1521/8008 | none |
| islands | 20 | unknown | 1515/8032 | none |
| hedges | 17 | certified | 1115/1010 | orchard-v2-b7806758087d0299 |
| hedges | 18 | certified | 232/980 | orchard-v2-166052e476ccea79 |
| hedges | 19 | certified | 214/1473 | orchard-v2-c459a29c463b89cd |
| hedges | 20 | certified | 250/258 | orchard-v2-27ab2530f949acf1 |
| terraces | 17 | unknown | 195/8035 | none |
| terraces | 18 | unknown | 193/8002 | none |
| terraces | 19 | unknown | 216/8019 | none |
| terraces | 20 | certified | 714/4796 | orchard-v2-fe6afc64f0a2f075 |

All six unknowns retain genuine direct wins but lack a second distinct target-team, different output-plan and actual alcove proof. They remain unknown without retries; bounded search failure does not prove impossibility. Known Claude-owned R-07 remains explicit: six exhausted calls report denied-spend overages11,8,32,35,2,19, total107. Requested caps remain8000; these counters do not establish actual admitted reducer work beyond the cap. No planner, enemy, threshold or cost weakening.

## Cumulative canonical coverage and ready dependencies

Ten new complete certificates add ten distinct full topology/puzzle material identities. All previous47 entries remain accepted; copied source/seed/hash/art labels cannot inflate counts. Unchanged river seed0 fallback remains separately identified and excluded from bank entry/topology/pattern counts.

| Gate | Actual | Required | Remaining |
| --- | --- | --- | --- |
| Material entries | 57 | 64 | 7 |
| Archetypes represented | 4 | 4 | 0 |
| River topologies | 13 | 8 | 0 |
| Islands topologies | 15 | 8 | 0 |
| Hedges topologies | 15 | 8 | 0 |
| Terraces topologies | 14 | 8 | 0 |
| Sudoku patterns | 21 | 8 | 0 |
| Separate certified fallback | yes | yes | 0 |

Manifest retains57 accepted entries,26 rejected unknown records and one fallback. Only `64-distinct-material-entries` fails. Ten additional reconstructible production-certified packets are ready for offline review. No runtime migration, private App/QA-01, other-family, device or child acceptance claim. Fixed seeds17..20 increment stopped; C-08B remains in progress and advisory lock released after scrum/Claude handoff.
