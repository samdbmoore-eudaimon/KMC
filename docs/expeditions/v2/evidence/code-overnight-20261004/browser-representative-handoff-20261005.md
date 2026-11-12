# Representative browser handoff: 5 October 2026

Sam reduced manual/browser playtesting to approximately one case per type. No further tier-by-tier, alternate-team or exhaustive viewport playthrough is queued. All 25 tiers still require their implementation and automated rules, puzzle and bank certification; manual coverage is not that certification.

## One existing browser case per family

| Family | Representative record | Browser outcome |
| --- | --- | --- |
| Four Locks | `four-t1-seed6-direct-browser-win-verification.json` | T1, 28 commands, round 4, won; recorded hash `cd96974cd0b7c0ef` |
| Hollow Bough | `bough-browser-win-verification.json` | T1, 32 commands, round 5, won; recorded hash `d99c12cdfe19cf68` |
| Unequal Crossing | `unequal-browser-win-verification.json` | T3, 27 commands, round 4, won; recorded hash `e8abbc1211930657` |
| Turning Ravine | `ravine-t1-alcove-browser-win-verification.json` | T1, 32 commands, round 5, won; recorded hash `d06f2bfed0215d1b` |
| Maybe-Flock Roost | `roost-t3-post-nest-20261005-browser-win-verification.json` | Fresh post-fix T3, 30 commands, round 4, won; hash `bd1ffd6565a0ce44` |

The first four entries identify preserved evidence verified at the time of those playthroughs. They were not replayed again in this handoff. Old Roost records and hashes remain historical evidence and are not asserted as current-engine certified records.

## Completed before the scope change arrived

The two assigned post-fix Roost browser missions had already finished:

- T3 seed 1 river, direct route, Barrow/Cobweb/Amberly: 30 commands, round 4, hash `bd1ffd6565a0ce44`.
- T4 seed 1 river, direct route, Barrow/Cobweb/Harvestmoon: 35 commands, round 5, hash `4c97a0019391a674`.

Both start with actual zero-command records and use the normal Show solution, saved east/south beam choices, paid activation, movement via Find on map, strikes, power transfers and station holds. Both have genuine Leave route/Resume run at 9 commands: before/after trace and progress exports are byte-identical. Independent `verify-family-ui-record.mjs` passes for both new records; locked tiers award zero stars and duplicate application returns the original progress unchanged. No unlocks, certificates or playing-state injection were used.

No further browser actions or repeated verification followed the scope change. An unfinished optional cross-check helper was removed; it produced no new checkpoint, certificate or coverage index. The verified win records and existing evidence are retained.

## Source provenance

Only new own QA helpers, executable, evidence and report were written during this window. The existing Claude `final-build` lock was observed and production/core/planner/generator/bank/shared HTML were not edited.

`roost-post-nest-source-checkpoint-20261005.json` captures the 169 imported source/executable hashes. The new fixture uses distinct local progress keys (`orchard-code-roost-post-nest-20261005`) and case names, preserving original saves. Engine `enemy.js` SHA-256 is `c1c9ae042d3d0f44048ae7e81222756fc4e7d6c4699e16cd20fc26e6ef4961ea`; it uses the phase-start `suppressedSectors` snapshot for nest coverage. Blueprint rules version remains 2: the source hash distinguishes these records from the historical pre-fix Roost evidence.

Each new `roost-t[3|4]-post-nest-20261005-*` group includes a reference plan, zero baseline, exact resume export, browser win record/progress/verification and win/forecast screenshots. The reference guides visible controls only; no commands or snapshots are imported into the browser state. Temporary viewport overrides were reset.

## Genuine remaining dependencies

- Ravine T5 implementation and all-tier certified bank requirements remain Claude dependencies. Missing manual wins are no longer acceptance blockers.
- App integration, offline/device/child acceptance and staged art decisions remain distinct from these private route-host demonstrations.
- The guide containment fix has a separate stable handoff. On phone, Hide guide is used to expose covered destinations; full App integration stays with Claude.

No whole-Orchard or runtime-bank completion claim. QA claim `QA-ROOST-TARGET-BROWSER-20261005` ends here; wait for a concrete implementation dependency.
