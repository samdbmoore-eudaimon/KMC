# Main-app access handoff: 5 October 2026

Sam's explicit instruction is now to put all five types in the main app. The standalone launcher is a safe checkpoint only, not the intended delivery. No launcher tab was opened or published to Sam. Stop further standalone work and browser playthroughs.

Claude owns App, generation/index, runtime-bank and private route integration. Codex has made no production edits in this window. Current UI remains stable, including the guide containment fix and painted art. No UI ABI change is required to render these existing families.

## Existing contracts

`OrchardV2Route` receives `Ui`, `generateBlueprint`, `ensureHooks`, `activeModule`, `currentProfile`, `progress`, `setProgress`, `cards`, `avatarForCard`, optional `beep`, `fireConfetti`, `onExit`. It constructs the real controller over App progress, checks Primary plus the exact eudaimon/Rooke gate and supplies all five `ORCHARD_V2_FAMILIES` to the UI. Use actual App owned cards/progress; the all-cards disposable QA profile is only a fixture and must not be copied into App progress.

Ready generator exports return `{status:'success',blueprint,...}` or an explicit unknown result; inject the returned blueprint only after success:

| Family ID | Export from `expeditions/v2/generation/` | Available representative T1 parameters |
| --- | --- | --- |
| `four-locks` | `generateFourLocksCandidate` in `four-locks.js` | seed 6, river, Bushel/Furrow/Pip |
| `unequal-crossing` | `generateUnequalCrossingCandidate` in `unequal-crossing.js` | seed 3, river, Bushel/Furrow/Pip |
| `maybe-flock` | `generateMaybeFlockCandidate` in `maybe-flock.js` | seed 1, river, Tuppence/Dapple/Sorrel |
| `hollow-bough` | `generateHollowBoughCandidate` in `hollow-bough.js` | seed 1, river, Bushel/Furrow/Pip |
| `turning-ravine` | `generateTurningRavineCandidate` in `turning-ravine.js` | seed 1, river, Tuppence/Dapple/Sorrel |

All five preset candidates and fresh zero-command construction were checked during the bounded launcher build. The same bundle uses current engine nest snapshot fix, guide containment and art. The generator arguments are `{tier,seed,layoutId}`. Hooks: `registerOrchardPuzzleHooks` from `expeditions/v2/puzzles/index.js`.

The current main-app block is `orchardGenerationAvailability` in `generation/index.js`, which only returns true for Four Locks T1, and its certified-only `generateOrchardBlueprint` selector. These are Claude's integration boundary. Existing uncertified candidate content must not be relabelled as a certified bank or assigned fabricated certificates. Private playable development access and all-tier automated bank certification remain distinct. Preserve actual saved progress, tier/stat/card gates and the exact private profile gate.

## Safe checkpoint retained

Owned outputs: `index.html`, `play.html`, `build-checkpoint.json` in this directory, generated helper `scripts/dev/sam-playtest-preview.jsx` and builder `scripts/dev/build-sam-playtest-launcher.cjs`. They use separate `sam-orchard-private-20261005` keys; no main save was touched. `build-checkpoint.json` captures current source hashes and preset checks. No new playthrough, bank certificate, App integration or whole-Orchard completion is claimed.

Existing five-family browser evidence is summarised in `../code-overnight-20261004/browser-representative-handoff-20261005.md`. Historical Roost saves/hashes remain preserved separately from the new post-fix T3/T4 records.

Standalone claim ends here. Codex awaits a concrete required UI ABI/change from Claude and will claim its exact owned UI files if needed.
