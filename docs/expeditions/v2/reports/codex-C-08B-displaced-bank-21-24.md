# C-08B: offline displaced T1 bank complete

2 October 2026. All strict offline T1 bank gates pass:64 distinct accepted material entries plus a separately certified fallback, four archetypes with at least eight topologies each and25 Sudoku patterns. Manifest `complete:true`, `status:complete`, `missing:[]`. T1 generation is stopped. This is offline version2 evidence only; no runtime migration or private UI/QA-01 acceptance.

## Changed files and preservation

Claims preceded edits in `codex-C-08B.md`. Changed owned driver `scripts/dev/assemble-displaced-t1-bank.mjs`, tests `scripts/dev/test-displaced-t1-bank.mjs`, derived `docs/expeditions/v2/certification/four-locks/displaced-v1/bank-manifest.json`, this report and parent report. New immutable evidence directories: `docs/expeditions/v2/certification/four-locks/displaced-v1/bank-candidates/tier-1-{river,islands,hedges}-seed-{21,22,23,24}/`. All four terrace seed21..24 directories remain absent.

Explicit `21-24` was added to the fixed-batch allowlist. Driver now preloads and independently replays every retained result before work, including the selected batch. Deterministic archetype/seed order stops immediately when strict verified coverage passes. Resume cannot generate unused slots after completion. Unknown/interrupted attempts remain consumed and immutable; unsupported ranges fail before work. At most16 new candidates, two8000-state requests per candidate, unchanged gameplay/stat/physical proof gates.

All652 prior evidence files, seed0 and seeds1..20, retain matching before/after SHA256 `b18f78798dd206a272ff3cdb84f51d622257cac4ef832e2129c0647bee3320bc`, computed from sorted relative filenames and exact bytes. Existing dirty changes were preserved. Runtime/default version1, Claude source, App/private access gate/rewards and shared build outputs were not edited. No further tiers/families or new artwork started.

## Executable checks and outcomes

```text
node scripts/dev/assemble-displaced-t1-bank.mjs --batch 21-24
node --test --test-reporter=spec scripts/dev/test-displaced-t1-bank.mjs expeditions/v2/generation/displaced-four-locks.test.js expeditions/v2/generation/runtime-generation.test.js scripts/dev/test-orchard-v2-certification.mjs
node scripts/dev/assemble-displaced-t1-bank.mjs --batch 21-24
```

All40 targeted checks pass. Final test reconstructs every64 accepted blueprint and the separate fallback from manifest parameters, compares complete candidate/content hashes and independently re-certifies using the real production reducer. Exact canonical full-serialization coverage and membership match the manifest. Every certificate continues to require genuine printed-card stats/commissioning assignments, distinct target-band teams, different actual output plans and a winning-phase physical alcove endpoint. Prior invalid command/hash/profile, weaker squad, duplicate proof, canonical/fallback/version/provenance, fail-closed runtime and interruption/no-retry tests remain passing.

Initial final-batch invocation stopped at12 new candidates/24 planner requests: seven new complete certificates, five retained unknowns,17 winning traces containing477 accepted commands. Stop reason `bank-complete`; four terrace candidates were never generated or planned. Disk resume: processed0/skipped12/notAttempted4, `bank-complete`, zero generator/planner calls. New workflow tests prove deterministic early stop and no unused-slot work on completed resume; incomplete coverage consumes only its authorised fixed range.

Each attempted directory's `traces.json` is executable production-reducer evidence, with full candidate/request/result checkpoints. Manifest parameters, candidate/content hashes and certificate IDs reconstruct and bind each accepted entry. No screenshots: the work certifies offline reducer playability, not private UI acceptance.

| Archetype | Seed | Outcome | Reported states, direct/alcove | Certificate |
| --- | --- | --- | --- | --- |
| river | 21 | unknown | 8035/4093 | none |
| river | 22 | certified | 1093/1461 | orchard-v2-00432741c7940344 |
| river | 23 | certified | 3751/4035 | orchard-v2-c3310bd5f772288c |
| river | 24 | certified | 219/242 | orchard-v2-dd05a587b74f9592 |
| islands | 21 | unknown | 8010/8010 | none |
| islands | 22 | unknown | 8035/2473 | none |
| islands | 23 | certified | 560/1366 | orchard-v2-7c48e94d412293b0 |
| islands | 24 | unknown | 8009/8003 | none |
| hedges | 21 | certified | 222/2085 | orchard-v2-f74b06aea1f19ddb |
| hedges | 22 | unknown | 1153/8015 | none |
| hedges | 23 | certified | 226/238 | orchard-v2-ab748619b337b074 |
| hedges | 24 | certified | 218/1017 | orchard-v2-24f08db21972685b |
| terraces | 21–24 | not attempted after completion | no calls | none |

Five new unknown candidates lack a second distinct target-team and different output-plan proof. River seed21 and islands seed22 retain real alcove wins but lack direct wins; hedges seed22 retains a direct win but lacks alcove proof. Islands seeds21/24 retain neither win. All unknowns remain excluded and immutable; they are not claims of impossibility. Known Claude-owned R-07 warning remains: seven exhausted requests report denied-spend overages35,10,10,35,9,3,15, total117. All requested caps are8000; these counters do not establish actual admitted reducer work beyond the cap. No planner, enemy, threshold or cost weakening.

## Complete offline coverage and ready dependencies

Seven new complete certificates add seven distinct full topology/puzzle identities; all previous57 accepted entries remain present. Complete manifest retains64 accepted entries,31 rejected unknown records and one separate fallback. Source/seed/art/hash labels cannot inflate counts. River seed0 fallback `orchard-v2-17b09eb354d2a122` remains unchanged and excluded from bank counts.

| Gate | Actual | Required | Remaining |
| --- | --- | --- | --- |
| Material entries | 64 | 64 | 0 |
| Archetypes represented | 4 | 4 | 0 |
| River topologies | 16 | 8 | 0 |
| Islands topologies | 16 | 8 | 0 |
| Hedges topologies | 18 | 8 | 0 |
| Terraces topologies | 14 | 8 | 0 |
| Sudoku patterns | 25 | 8 | 0 |
| Separate certified fallback | yes | yes | 0 |

Ready dependency: a complete, independently reconstructed/replayed offline generatorVersion2 T1 bank for scrum/Claude review. T1 generation stops here. C-08B as a whole remains in progress because further tiers, runtime integration and wider acceptance are outside this completed packet. No runtime migration, private App/QA-01, further tier/family, device or child acceptance claim. Advisory lock released after completion handoff to scrum and Claude.
