# Orchard v2 core engine: published interface (hook interface version 1, engine 1.0)

Owner: Claude (C-01/C-04). Consumers: Codex puzzles, generators, UI, certification. Import only from `expeditions/v2/index.js`. Everything here is pure JS, JSON-serialisable, deterministic and has no React or DOM dependency. Spec reference: `EXPEDITIONS_9FO_IMPLEMENTATION_SPEC.md` (rules) and `EXPEDITIONS_9FO_GENERATION_SPEC.md` (maths); this document only fixes the callable surface and every interpretation the specs left open.

Changing anything marked FROZEN needs a versioned note in `docs/expeditions/v2/reports/claude-C-01.md` and an update from the owner of each affected file.

## 1. Public functions (FROZEN names, signatures)

```js
import {
  validateBlueprint, createRun, listCommands, previewCommand, reduceCommand,
  forecastEnemyPhase, resolveEnemyPhase, evaluateVictory,
  exportRunRecord, replayRun, stateHash, registerPuzzleHooks,
} from "expeditions/v2/index.js";
```

| Function | Returns |
|---|---|
| `validateBlueprint(blueprint)` | `{ok, status:'ok'\|'invalid', errors:[{code,path,message}]}` structured; never throws |
| `createRun({blueprint, cardIds, runId, deploymentAssignment?, profiles?})` | `state` (throws on invalid blueprint or squad). `deploymentAssignment` is `{cardId: hexKey}` choosing among `blueprint.deployment`; default is `cardIds[i] -> blueprint.deployment[i]`. `profiles` overrides the roster for tests. |
| `previewCommand(state, command)` | result payload (below). Never mutates. Includes `forecastAfter`. |
| `reduceCommand(state, command)` | `{state, result}`. On rejection `state` is the identical input object, revision unchanged, nothing logged. |
| `listCommands(state, heroId)` | rows `{type,label,cardKey,apCost,available,reasonCode,reasonParams,targets}`; for move/dash/intercept `targets` is `[{destination,cost}]`, others `[{targetId,payload,legal,reasonCode,reasonParams}]` |
| `forecastEnemyPhase(state)` | `{revision,round,intents,hazards,phaseStartEvents,outcome,events}`: a dry run of exactly the code `end-round` executes |
| `resolveEnemyPhase(state)` | `{state, record}` (what `end-round` calls) |
| `evaluateVictory(state)` | `{won, unmet:[{code,params}]}` for the *current* snapshot |
| `exportRunRecord(state)` / `replayRun(record,{recordHashes})` | `{schemaVersion,initialRun,commands,finalStateHash,...}` / `{ok,reason,index,state,finalHash,hashes}` |
| `stateHash(state)` / `hashValue(v)` | 16-hex local consistency hash (canonical JSON, two FNV-1a passes). Not tamper protection. Excludes blueprint, profiles, initialRun, undo, events, log. |

`generateOrchardBlueprint`, `solvePuzzle`, `certifyBlueprint` are Codex's. `applyOrchardV2Result` is C-09 (not yet published).

## 2. Command ABI (FROZEN)

`{type, heroId: null|string, expectedRevision: number, payload: object}` exactly as spec §11. `heroId` is the card id (e.g. `"kernel"`); it is also the hero's state id. Zero-AP, hero-less types: `edit-draft`, `compare-loads`, `request-hint`, `undo`, `end-round` (use `heroId:null`). `end-round.payload = {forecastRevision}` must equal `state.revision` (the revision the forecast was shown at).

Interpretations the spec left open:

* `move`/`dash`/`intercept` `path` is the list of hex keys **after** the start, ending at `destination`. `path:null` means "canonical shortest path" (deterministic: Dijkstra expanding by cost then `(r,q)`). A given path must be contiguous, unblocked, within budget and a *shortest* weighted path to the destination or it is rejected `path-not-shortest`. `intercept` may have `destination:null`/current hex to mark without moving.
* `hold`/`calibrate`/`prepare-alcove` `targetId` is one of `number|shape|sustain|alcove` (`alcove` is a second place to hold the Shape job; it shares the Shape store: charge, integrity, shield, locks).
* Targets: hero id, enemy id, station id (`control`,`number`,`shape`,`sustain`,`alcove`), `orchard`, a lock group id (`puzzle.lockGroups[].id`) or a site id (`blueprint.sites[].id`).
* `lock` targets a group; `stabilise`/`root-shelter` target a station, group or site. `linked-lock` targets groups only.
* `operate`/`crosswire` `outputIds` must equal the saved draft's `selectedOutputIds` (set with `edit-draft` `select-outputs`). `crosswire.lockGroupId` must name a lock group.
* Preview and reduce share one code path (`evaluateCommand`); `reduceCommand` does not recompute anything the preview did not.

### Result payload (FROZEN)

```js
{ legal, reasonCode, reasonParams, type, heroId,
  cost:{ap, card}, changedEntities:[{id,kind,field,before,after}],
  factors:[{key,...numbers}], warnings:[{code,params}],
  outputsBefore, outputsAfter,                 // {outputId: boolean}
  forecastAfter,                               // forecastEnemyPhase of the post-action state (preview only)
  events:[...], status, comparison?, hint?, path?, phase? }
```
`reasonCode` values are stable machine strings (see `commandReasonCodes()` in `actions.js` and the table in section 6). `factors` always carry the numbers needed to build the sentence (governing stat, support, mark, armour, damage...). The UI localises codes; it must not recompute outcomes.

## 3. State shape (FROZEN field names)

```js
state = {
  schemaVersion:2, rulesVersion:2, runId, revision, round, status:'playing'|'won'|'lost', lossReason:{code,params}|null,
  blueprint,                  // immutable, shared by reference
  profiles:{[cardId]:profile},// immutable, frozen at createRun (printed stats only)
  heroes:[{id,cardId,position,hp,ap,handReady:{[cardKey]:boolean},refocusUsed,defeated,holding:null|stationId}],
  enemyStates:[{id,position,hp,defeated}],     // static fields live in blueprint.enemies
  stationStates:{[id]:{charge,integrity}},     // id in control|number|shape|sustain (alcove delegates to shape)
  orchardIntegrity,
  puzzleActive:{content, selectedOutputIds},   // committed
  puzzleDraft:{content, selectedOutputIds, revision}, // editable, revision = draftRevision
  puzzleValid, activeOutputs:{[outputId]:boolean},
  passages:{[tileKey]:{open, closingPending}},
  marks:{[enemyId]:2}, holds:{[stationId]:{holdId,heroId}}, preparedAlcove,
  phaseEffects:{grants:[{id,kind:'shield'|'lock'|'stabilise',targetId,amount,source,sourceHoldId,heroId}], counters, suppressedShelterCells, suppressedSectors, pendingRestore, rootsActive, nestSnapshot},
  comparisonLog:[{key,left,right,result}], comparisonsUsed,
  events:[{seq,type,round,...}], undo:[snapshots], hintStage, actionCount,
  log:[acceptedCommands], initialRun:{runId,blueprint,cardIds,deploymentAssignment,profiles,initialStateHash}
}
```
Effective shield/lock/stabilise strength per target is the maximum matching grant (never a sum); the UI should read it with the exported helpers or `changedEntities` `protection.summary`, not by summing grants.

## 4. Blueprint contract the engine consumes

Required fields (checked by `validateBlueprint`): everything in spec §11 plus:

* `tiles:[{q,r,terrain,solid?,passageOutputId?}]`, terrain in `floor|path|bridge|clearing|roots|water|hedge|gate`. A `bridge`/`gate` with `passageOutputId` is open only while that output is powered; occupied-bridge closure uses the spec interlock (`passages[key].closingPending`).
* `stations:[{id,hex,name,capacity?,maxIntegrity?}]` for `control,number,shape,sustain,alcove` (hex = hex key `"q,r"`). Capacity/integrity must equal the tier table or validation fails.
* `orchard:{hex}`, `orchardMaxIntegrity`.
* `puzzle:{id?, kind, controlHex, networkGroupId?, lockGroups:[{id,anchor,memberIds,effectKinds}], defaultOutputIds?, comparisonAllowance?, ...family fields}`. The group named `network` (or `networkGroupId`) is what the Number Hold locks.
* `outputs:[{id,label,trigger,effect:{kind,...}}]`, effect kinds the engine implements: `passage` (tiles reference it by `passageOutputId`), `shelter {amount,targetIds,coverage?:'puzzle'}`, `roots`, `storm`, `repair-stream {amount?}`, `strike-window`, `beam {sector}`, `reserve-benefit {amount,targetIds}`, `none`.
* `enemies:[{id,ruleId:'jammer'|'hunter'|'breaker'|'rewinder',artId,wakePhase,position,sector?}]`.
* `hazards:[{id,power?,sites:[{id,targetId,orchardDamage?}],mutation:{kind:'none'|'puzzle'|'suppress-shelter',groupId?,cells?}}]`; `nests:[{sectorId,groupId}]` for Roost; `sites:[{id,anchor}]` for extra stabilisable targets (e.g. the controlled passage).
* `commission:{poweredCount?, poweredIds?, selectableOutputIds?}` plus optional hook `commissionCheck`.
* `deployment:[hexKey x3]`.

## 5. Puzzle hook interface (FROZEN, version 1)

Full contract is the comment block at the top of `expeditions/v2/puzzle-hooks.js`. Register with `registerPuzzleHooks(kind, hooks)`. Required: `createActive`, `createDraft`, `applyEdit`, `checkOutputSelection`, `commit`, `evaluate`, `disruptionCandidates`, `disrupt`. Optional: `hint`, `solutionDraft`, `compare`, `reserveTotal`, `sectorFill`, `coverage`, `commissionCheck`.

Division of labour: **the engine** owns draft revisions, output selection, powering outputs (`selected AND outputTruth`), bridge interlocks, protection grants and ranking *against protection*, comparison allowance/log/Undo overlay, and the paid Operate. **The hook** owns all mathematics: parsing, validity, which members a Jam/Rewind/environment change would hit (canonical rank order, including `hex` of the member for the Rewinder), what the change does, and the comparison answer. `disruptionCandidates` must return the members in the canonical spec order; the engine picks the first whose `groupIds` protection (max lock/stabilise grant on those groups) is below the enemy's disruption power.

Minimal runnable example: `expeditions/v2/fixture.js` (`fixture-switches`).

## 6. Rules interpretations to review (open product questions are listed in reports/claude-C-01.md)

* Enemy order uses ascending initiative (hunter 3, rewinder 4, jammer 5, breaker 7) then id, matching hero `12-V`.
* The frozen forecast is a dry run of `end-round` on a clone; targets and per-enemy paths are chosen once at phase start (after phase-start outputs) and never retarget; a planned path is truncated if blocked at execution.
* Shield/lock/stabilise are cleared at phase end, along with holds. Marks on living enemies persist.
* Hold grants: Number -> `lock` on the network group, strength raw L; Shape -> `shield` on the Shape store, strength G; Sustain -> a wide `stabilise` (`targetId:"*hazard"`) strength S, which protects every hazard site, hazard mutation, nest and shelter-suppression but not a Jammer/Rewinder change (those need lock or stabilise on a group).
* Hazard orchard damage is per site; T5's two sites can each hit.
* A weak lock/stabilise that is out-powered is consumed (all lock/stabilise grants on that member's groups).

## 7. Reason codes

`stale-revision, run-over, unknown-command, unknown-hero, hero-defeated, not-enough-ap, card-not-in-hand, card-exhausted, invalid-target, out-of-range, no-line-of-sight, destination-is-current, destination-unreachable, path-* (not-contiguous, blocked-by-figure, impassable, too-costly, not-shortest), hold-profile-short {job,need,shortfalls}, station-held {holderId}, shape-endpoint-held, already-held, alcove-unprepared, alcove-already-prepared, stale-draft, output-selection-mismatch, bridge-occupied {blockers}, storm-would-destroy-orchard, push-needs-damage, push-blocked, push-target-defeated, refocus-used, refocus-needs-full-ap, nothing-to-undo, stale-forecast, no-comparisons-left, already-charged, nothing-to-repair, exceeds-capacity, allocation-exceeds-stat, ...` plus whatever a puzzle hook returns as `reasonCode`.

## 8. Fixtures and runnable checks

* `node --test expeditions/v2/engine.test.js` runs the engine suite.
* `docs/expeditions/v2/fixtures/*.json` (regenerate with `node scripts/dev/export-orchard-v2-engine-fixtures.mjs`): `blueprint.fixture.json`, `state.initial.json`, `preview-*.json`, `forecast.json`, `win-trace.record.json` (a complete legal winning run through the real reducer; `replayRun` it).

## 9. App entry, controller and persistence (C-06A / C-09, published)

Codex's v2 UI default-exports a React component `ui/OrchardExpedition.jsx`. `expeditions/v2/route.jsx` (Claude) mounts it with these props (FROZEN for the first slice, decision D-13; `profile` is currentProfile so the UI repeats the private gate check):

```js
<Ui profile controller bucket families ownedCards cards avatarForCard beep fireConfetti onExit />
```
`controller` (`expeditions/v2/controller.js`) is the only thing the UI uses for game state, so previews, saves and rewards cannot drift from the engine:

| Method | Meaning |
|---|---|
| `status(familyId)` | `{tiers:[{tier,unlocked,awarded,best,losses}], unlockedTier}`; tier 1 always open, tier n+1 after a real clear of n |
| `bucket()` | read-only v2 save bucket |
| `resume()` | `null` (nothing saved), `{ok:true,state}` (rebuilt by deterministic replay, incl. hand, draft, holds, Undo) or `{ok:false,reason}` (`save-version`, `blueprint-changed`, `blueprint-invalid`, `replay-error`, replay failure): never silently loaded; offer Discard |
| `begin({familyId,tier,cardIds,deploymentAssignment?,mode})` | `mode` `new` (default; uses the persisted attempt counter), `new-map` (advances it) or `retry` (same blueprint, new runId). Returns `{ok,state,key,attempt,runId}` or `{ok:false,reason}` (`tier-locked`, `unknown-family-or-tier`, `nothing-to-retry`, `create-failed`) |
| `dispatch(state, command)` | `{state,result,award}`; applies one command, saves after EVERY accepted command (maths edits, hints and weighings included, so a close/reload loses nothing), records a loss once, and on a win claims the reward once. `award` is `{stars:3|0, alreadyAwarded, unlocksTier}` on the winning dispatch, else `null` |
| `preview(state, command)`, `forecast(state)`, `listCommands(state, heroId)` | engine pass-throughs |
| `save(state)`, `discard()`, `claimWin(state)` | explicit save (pause/exit), clear a stored run, idempotent claim of a won run |

Reward rules (spec section 12) live in `persistence.js` `applyOrchardV2Result(progress,{record})`: it replays the whole `record` through the real reducer and refuses anything that does not replay to a win with the saved final hash; award key `primary:<familyId>:<tier>`; first clear adds 3 stars with the existing `PACK_COST` conversion, unlocks the next tier and records best rounds/commands; any other win of an awarded tier, a duplicate callback or a locked tier changes nothing; no Reveal token and `moduleSetRewarded` is never touched. It is re-exported from `wm-progress-actions.js`.

Blueprint generator contract used by `begin`: `generateBlueprint({familyId, tier, seed, generatorVersion, recentParameterSeeds})` where `seed` is `deriveExpeditionSeed({moduleKey:'primary', scenarioId:'primary:<familyId>:<tier>', variant:2, attemptIndex})` and `recentParameterSeeds` are the last 8 SELECTED parameter seeds (`blueprint.parameterSeed`, falling back to `blueprint.seed`), never requested seeds. The requested seed is not stored in that list.

Hooks must be registered before `resume`/`begin`/replay: pass `ensureHooks` (Codex's `registerOrchardPuzzleHooks`) to the route.

## 10. ABI changelog (backward compatible additions, engine 1.1)

* `edit-draft` accepts `{type:'reset-draft'}`: replaces the draft with the committed puzzle (the End Round "Discard" choice). The engine forwards `select-outputs` to the hook's `applyEdit` too, so hooks that mirror the selection in their content (Codex's do) stay in step; hooks must accept that edit type.
* `draftDiffersFromActive(state)` is exported: true when uncommitted draft edits exist (drives the Save draft / Discard / Return prompt; the engine never auto-commits).
* `compare-loads` rejects unknown load ids (`unknown-load`) when `puzzle.loads` exists; any exception inside a hook is returned as `{legal:false, reasonCode:'internal-error', reasonParams:{message}}`.

## 11. Production boundaries (engine 1.2, review fixes R-01 to R-05)

* `begin` rejects any squad that is not three distinct cards each with a positive integer count in `progress.cards` (`invalid-squad`, `unowned-card`). Pure `createRun` stays permissive for certification tooling.
* `applyOrchardV2Result` additionally requires `record.finalStateHash`, a saved active run with the same run id, blueprint hash, origin (initial state hash, cards, deployment) whose command log is a prefix of the winner's, owned cards, and `initialRun.profiles` equal to the printed roster profiles. Anything else returns the input unchanged. Hash checks are consistency checks, not anti-tamper security.
* Mend and Mend Again is legal on a full-health hero or station for its shield (`ceil(Science/2)`); the orchard cannot be shielded so a full orchard is still `nothing-to-repair`; ordinary Repair still refuses full health.
* D-12: jam means puzzle corruption only (no disabled-station flag); T5 damage is per exposed site.
