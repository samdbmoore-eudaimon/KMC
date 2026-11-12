# Ninefold Orchard Expeditions: implementation specification

Version 1.0 design baseline, 1 October 2026. Owner: Codex product owner/scrum master. Status: complete proposed development baseline for handoff, not a claim of implemented or player-accepted gameplay. User requirements are binding; numerical defaults selected here are implementation decisions within that scope. Any changes to them require a logged spec amendment, not invention by a coding agent.

## 0. Package and precedence

Read in this order:

1. `EXPEDITIONS_MASTER_BRIEF.md`: private gate, repository boundaries and current direction.
2. This file: v2 Orchard rules, actions, state, UI and rewards.
3. `EXPEDITIONS_9FO_GENERATION_SPEC.md`: topology, deterministic algorithms, five puzzles and tier ladders.
4. `EXPEDITIONS_9FO_DELIVERY_BOARD.md`: dependencies, owned files, agent instructions and review evidence.
5. `EXPEDITIONS_9FO_ART_REQUEST.md`: Codex asset work and v2 renderer interface.

Within the four new baseline files plus the master brief, this file owns shared rules; generation owns puzzle mathematics/layout; delivery owns file ownership; art owns visuals. Explicit later user decisions override the package. Earlier examples/contracts are historical wherever they conflict. Do not combine old small-heart combat with this health/damage scale.

Supporting artifacts: `docs/expeditions/v2/spec-contract.json` records shared parameters; `spec-validation.json` records static roster/reference checks. Regenerate with `node scripts/dev/check-orchard-v2-spec.cjs`. `docs/expeditions/v2/reports/spec-review-2026-10-01.md` records the specification review and remaining implementation evidence. The documents are authoritative; these artifacts do not certify future gameplay.

This release implements exactly five Orchard mission families: Four Locks (Sudoku), Turning Ravine (equation rotation), Unequal Crossing (balance/weighing), Maybe-Flock Roost (nonogram) and Hollow Bough (polyhex packing). Five tiers per family: 25 rewarded clears. The fifteen-type cross-module requirement remains; LR and GF follow once this Orchard slice is accepted. The other five Orchard pitches are reserves.

The mode remains visible only to the exact `eudaimon` profile with the Rooke avatar through `canAccessExpeditions`. No preview URL, replay, saved state or development shortcut may bypass that check in the app. Existing Adventures, Joey, questions, card-pack odds and module entitlement remain outside scope.

## 1. Product contract

Three distinct owned Orchard cards deploy. Do not require rarity at entry. Show numerical missing capabilities and allow a warned practice attempt. No duplicate identity, borrowed card or commander. Use existing printed `card.s` values and existing class assignment; no Expedition card levels. Adventure equipment, commander, trait and honed bonuses do not modify v2 rules. Hide unsupported bonus controls and say so in the squad details rather than silently promising an effect. This freezes progression proofs to known printed values. Adding those bonuses later requires recertification.

Normal familiar play targets five minutes; there is no real-time countdown or automatic loss for thinking. Maximum five tactical rounds, including the final enemy phase. The child may use hints and pause. First clear of each family/tier gives three stars through normal pack conversion; replays give zero new stars. Three is the selected baseline amount, amendable through a logged product decision. Legacy awards are preserved.

Each expedition combines one substantial maths puzzle, alternative routes and fully visible enemy intent. Solving the maths alone is insufficient: a three-hero simultaneous commissioning completes its battlefield effect. Mission-specific names and art express these three physical jobs; do not render three anonymous stat padlocks.

## 2. Coordinates, occupancy and terrain

Engine coordinates are integer axial `(q,r)`, key `${q},${r}`. Directions, in order: E `[1,0]`, NE `[1,-1]`, NW `[0,-1]`, W `[-1,0]`, SW `[-1,1]`, SE `[0,1]`. Distance is `(abs(dq)+abs(dr)+abs(dq+dr))/2`. Graph paths use those neighbours, never screen rows. Ties use numerical `(r,q)` order then stable entity ID; never locale-dependent ordering.

Terrain costs: floor/path/bridge/clearing 1; roots 2; water, hedge, closed gate and missing tile impassable. All figures block each other's destination and traversal. No swapping or walking through allies. Mechanism tiles are walkable unless explicitly `solid:true`; a mechanism and a hero may share a tile. A hero can operate from that tile or a neighbouring tile, distance ≤1. Enemies may enter walkable mechanism tiles. Objects are not carried in these five families.

Bridge changes resolve before victory. A player Commit closing an occupied bridge is disabled and names occupants. If enemy corruption removes power while occupied, a safety interlock sets `closingPending`: existing occupants may leave, no new figure may enter, and the bridge closes immediately when empty. This is not a powered output for victory. No falling, teleport or hidden damage. Push cannot send a unit into blocked/water/off-map/occupied tiles.

Line of sight: convert axial to cube `(x=q,y=-q-r,z=r)` and nudge both endpoints by `(0.000001,0.000001,-0.000002)` before linear interpolation and cube rounding. Sample `distance+1` points, correcting the coordinate with the largest rounding error (ties x, then y, then z). Publish and test that helper. Intermediate hedge, closed gate or `solid:true` prop blocks sight; roots and figures do not. Range uses hex distance, movement uses weighted path cost. Targets behind a blocking object are unavailable. Forecast and preview call the same helper as resolution.

## 3. Stats and combat: one numerical scale

Let A, G, L, S and V denote Arithmetic, Geometry, Logic, Science and Speed.

| Derived value | Formula |
|---|---|
| Maximum health | `10 + S` |
| Move budget | `4 + floor(V/3)` terrain-cost points |
| Armour | `floor(G/4)` |
| Initiative | `12 − V`, then ID |
| Basic strike range | Scout 3, Reckoner 2, all other roles 1 |
| Basic strike stat | The card's existing primary discipline index; do not substitute `max(stats)` |
| Basic strike damage | `max(0, governingStat + support + mark − target.armour)` |
| Adjacent support | +1 per active ally adjacent to attacker, maximum +2; held allies contribute zero |
| Scout mark | +2 to the next successful damaging allied strike on that enemy, then consumed |

There are no critical hits, dice, hidden defences, hit chances or rounding of damage. Attacks need range and sight. A zero-damage strike is legal after a warning and still costs an action. A zero-damage strike does not consume a mark. Clamp health to `[0,maxHealth]`; defeated heroes cannot act, hold, support or block. They stay visible with an exhausted marker but free the tile. Mission is lost if any hero is defeated: the core objective needs all three, so do not make the child play a doomed run.

Enemy stats are defined in generation; enemy damage uses `max(0, power − armour)`, then consumes any guard shield. Shields absorb damage point for point and expire after the enemy phase. Station objects have integrity and armour 0. No health formula from the legacy engine is allowed in v2.

Example under this scale: Kernel's Geometry 7 + Cornix adjacent support 1 − Hookmole armour 3 = 5 damage. Hookmole health 8→3; it survives and its next jam remains forecast. With a mark, damage is 7. The old “1 impact” explanation must not remain beside this calculation.

Every stat additionally has a direct useful action: A transfer/calibration capacity, G shield/brace capacity, L lock strength, S repair/stabilisation strength, V dash reach. Each one-point increase changes a displayed strength/capacity even between rounded Move/Armour breakpoints. Core ability definitions below are global; agents must not vary them by mission.

## 4. Round ordering and consequences

Initial round is 1. All heroes have 2 AP, health at maximum and all four hand cards ready. Enemies start at fixed blueprint positions, with the first full forecast visible. Player chooses hero order freely. Hero initiative sets the initial selected hero and default tray order only; it creates no hidden interrupt or forced turn. Enemy initiative controls enemy resolution order. Speed has its combat value through Move, Dash and Intercept, and its operating requirements.

Each confirmed action: validate command against current state; spend AP/hand resource; apply effect; recompute puzzle outputs; reject forbidden bridge closure before spending; recompute forecasts; emit structured events; check immediate losses. A draft, selection, hint, camera move or invalid command costs nothing. Commands include expected state revision; stale commands fail without mutation.

End Round performs:

1. Ensure no uncommitted draft is mistaken for active puzzle state. Offer Save draft/Discard/Return choices if it differs. Do not auto-commit.
2. Apply phase-start outputs: storm cost/damage, shelter/packing shields and roots restraint. Compute a frozen enemy intent list from the resulting state, ordered by initiative then ID. Forecast dry-runs this same sequence, including path truncations, blocked changes and deaths, so shown results match resolution. Show the exact predicted sequence before confirmation.
3. Resolve enemies in that order. A defeated enemy skips. If an earlier enemy occupies its chosen destination, stop its path at the last free tile; do not pick a different target or path. If its target becomes invalid/dead, its action fizzles with an explanation; no secret retargeting.
4. Apply declared hazards after enemies, then repair-stream restoration if active. Any zero-health/integrity loss terminates the run before later restoration; repair never resurrects an objective. Protection may prevent hazards as specified.
5. Test all three commissioning holds, puzzle outputs, required preparation and integrity. If valid, win at this snapshot. If not, give the specific unmet conditions. Do not clear a solved puzzle merely because capability is insufficient.
6. Remove shields, one-phase locks/stabilisation, marks on dead enemies and holds. Marks on living enemies survive until consumed or mission end. If not won and round=5, lose to deadline. Otherwise increment round, reset AP to 2 and recompute forecast. Exhausted hand cards remain spent.

Persistent puzzle corruption lasts until corrected/recommitted. Briefing and forecast identify exactly what can be changed. All randomness is generation only.

Undo may restore any player action since the previous End Round, including hand exhaustion, HP and puzzle state. Balance comparison knowledge and its spent allowance are irreversible within the run: the child cannot unlearn a result. Identical comparisons return their logged result free. Undo overlays the current comparison log on the restored draft. Enemy phase is an undo boundary. No rewards until confirmed terminal victory. A saved run retains its undo stack; do not duplicate rewards. Replay last phase is presentation only.

## 5. Available common moves

All cost 1 AP unless stated. Context menus show applicable moves, disabled reasons and a useful remedy. A target may be the acting hero where the action says ally/self. “Within 1” includes same tile. All checks and changes appear before confirmation.

| Command | Target/range | Exact result |
|---|---|---|
| Move | Empty reachable walkable destination | Traverse a chosen shortest weighted path up to Move budget; preview alternate equal-cost path if selected. No partial automatic walk to unreachable target. |
| Strike | Living enemy in role range and sight | Damage formula above. |
| Guard | Self, ally or station within 1 | Give shield G until end of enemy phase. Repeating keeps the larger shield, never adds. |
| Repair | Self, ally, station or orchard/tree within1 | Restore S health/integrity capped at maximum. Does not resurrect or repair a false equation. Orchard/tree is one repairable entity, never a fourth commissioning/charge job. |
| Lock | Puzzle mechanism/group within 1 | Set one-phase lock strength L. An enemy change is blocked when strength ≥ disruption power; otherwise the normal change occurs and the lock is removed. Protects the entire selected group defined in the puzzle packet, not arbitrary nearby tiles. |
| Stabilise | Station/bridge/puzzle group within1 of its declared anchor | Set one-phase stabilisation strength S; cancels a hazard/jam when strength≥power. Repeating keeps the larger strength. Family schema defines group IDs/anchors; a packing cell uses the patch anchor. |
| Calibrate | One station within 1 | Transfer min(A, missingCharge) charge, capped at its printed capacity. Charge persists; it does not increase commissioning stats. There is no inventory token to fetch. |
| Operate | Puzzle control within 1 | Commit the full validated draft for 1 AP. Math edits themselves are free; partial rotations may commit for rotation only. Different family validators are in generation. |
| Hold | One commissioning station within1 | 1AP, record hero as holder this phase; failed printed profile disables Hold with shortfalls. Remaining AP may perform any legal stationary action/hand card. Moving by any cause or holding another station cancels first hold; one hero never holds two. Displacement by True Shift also cancels it. |
| Prepare alcove | Shape alcove within 1 | Permanently prepare its +2 Geometry fixture, 1 AP. Any hero can prepare it. It affects only this station's commissioning check. It never changes printed card stats, combat or other checks. |
| Wait | None | Spend 1 AP, no other effect. Rarely needed; used in certified traces. |
| Refocus | None, requires 2 AP | Spend both AP to ready one exhausted hand card except Second Wind. No simultaneous Hold is created. Available once per hero per mission. |

Hold-derived protection records carry `sourceHoldId`. Cancelling a hold through movement, displacement or another Hold immediately removes that hold's lock, brace and stabilisation grants. Independently cast Guard/Lock/Stabilise grants remain. Expiration removes all phase grants. Effective shield strength is the maximum remaining grant, never their sum; when it absorbs damage, subtract the absorbed amount from every shield grant on that target, clamped at zero, so a weaker shield cannot become a second pool. Locks and stabilisation use the maximum applicable live grant. An insufficient lock that is broken removes all grants for that targeted lock group; a different group is unaffected. Show cancellation and lost protection in the action preview.

A station already held by another hero rejects Hold and names its holder; it never silently displaces that hero. Holding the same station again is disabled as already held. Direct Shape and its alcove are endpoints of one job: at most one may be held at a time. An ally's explicit move/displacement can release a holder, with preview, and Undo may reverse the player action.

Charge is a meaningful Arithmetic contribution before simultaneous operation. Every station capacity equals its tier's Number Arithmetic requirement: 4, 6, 7, 7 or 8. One Calibrate from the Number-qualified hero fills one station; lower-Arithmetic heroes may need several actions. Commissioning requires all three stations fully charged. Direct and alcove Shape endpoints share one charge store, so selecting an alternative never requires charging four stations. Any hero may contribute while another fights. Repeated Calibrate never changes puzzle truth or capability. Successful commissioning consumes charges only on victory; a failed snapshot retains them. Charge protects against no damage by itself.

## 6. Ability hand: four cards, no random draw

Every hero gets two cards from its primary discipline, one role card and Second Wind. Each costs 1 AP and exhausts on a successful command. Invalid targeting spends nothing. No draw pile, deck building, mana or per-mission random card selection. Reframe/Rotate is not automatically free on every hero.

### Two discipline cards

| Primary | Card 1 | Card 2 |
|---|---|---|
| Arithmetic | **Exact Blow:** strike in normal range with governing A, +2 power; all other strike rules unchanged. | **Shared Charge:** split a total A charge across up to two stations within 2 and sight; chosen integer allocations sum ≤A, station caps apply. |
| Geometry | **True Shift:** move one enemy or ally within 2 and sight to a selected adjacent empty walkable hex, then grant the affected ally shield G; enemies receive no shield. No damage and cannot move a solid prop. | **Wide Brace:** shield up to two selected allies/stations within 2 and sight, each strength G, until enemy-phase end. |
| Logic | **Counterturn:** cancel the next disruption from one enemy within 3 and sight when L≥its disruption power. It may still move/strike normally. | **Linked Lock:** lock up to two puzzle groups within 2 and sight, each strength L, for this phase. |
| Science | **Field Repair:** distribute total `2*S` restoration across self/allies/stations/orchard within2 and sight, integer choices capped by missing integrity. | **Root Shelter:** stabilise up to two stations/bridges/puzzle groups within2 and sight of their anchors, each strength S this phase. |
| Speed | **Dash:** move up to `4+V` weighted terrain-cost points; normal occupancy, sight not required. This is the direct per-point Speed effect. | **Intercept:** move up to V points, then optionally mark one enemy within normal strike range/sight for +2. This mark uses the same non-stacking rules as Scout. |

### Role card

| Existing class | Display role/card | Exact rule |
|---|---|---|
| tank | Guardian: **Stand Together** | Shield self and one ally/station within 1, each strength G. Stay in place. |
| healer | Mender: **Mend and Mend Again** | Restore S to self/ally/station/orchard within2 and sight; grant target shield `ceil(S/2)` this phase. |
| wizard | Reckoner: **Crosswire** | Commit a legal puzzle draft from within 2 and sight of its control; additionally Lock one chosen puzzle group, strength L, this phase. Cost is this card only, not Operate plus card. |
| melee | Mover: **Driving Blow** | Normal strike; if damage>0, optionally push enemy one adjacent legal hex. Push is not required for damage. |
| ranged | Scout: **Marked Shot** | Normal strike range increased by 1 for this action; place a +2 mark before striking and consume it if damage>0. |

Second Wind: ready one other exhausted hand card, then optionally move one adjacent legal hex. No healing, charge or stat bonus. It cannot ready itself or another hero's card. One mission use unless restored is prohibited: Refocus excludes Second Wind. Animation text says which ability returned.

No legacy signature/trait ability runs alongside these. Card identity is represented by printed stats, primary discipline, role, name and art; no agent invents bespoke abilities for thirty heroes in this version.

Ordinary Repair rejects a full-health target as nothing to repair, without spending AP. Mend and Mend Again remains legal at full health when it can grant its shield; zero restoration does not remove that secondary effect. Its range, cost, strength and exhaustion are unchanged.

## 7. Necessary card progression and three physical jobs

All three jobs must be held by distinct heroes at the same enemy-phase snapshot, with intact puzzle outputs and fully charged stations. A hero standing nearby is not automatically a holder. Held stats are checked again at resolution, so a displaced/dead hero does not count. No adjacency, mark, hand power, equipment or Commander bonus affects a commissioning profile. Label this narrow rule: “Operating requirements use printed stats; the alcove fixture adds +2 Geometry here.” Utility and combat retain normal bonuses.

Stat vector order A,G,L,S,V. Zero means no minimum for that stat on that job.

| Tier | Number/Truth | Shape/Reach direct | Sustain |
|---|---|---|---|
| 1 | `[4,0,2,0,0]` | `[0,4,0,0,2]` | `[0,0,0,5,2]` |
| 2 | `[6,0,5,0,0]` | `[0,6,0,0,2]` | `[0,0,0,6,4]` |
| 3 | `[7,0,7,0,0]` | `[0,7,0,0,4]` | `[0,0,6,6,4]` |
| 4 | `[7,0,7,0,0]` | `[0,8,0,0,4]` | `[0,0,6,7,4]` |
| 5 | `[8,0,8,0,0]` | `[0,8,0,0,7]` | `[0,0,7,8,4]` |

Every generated map includes the alternative Shape alcove. Once prepared, its requirement is direct Geometry minus 2, with Speed 6 at every tier. That is a fixed +2 local fixture and a different reach requirement, not a global party buff. Direct and alcove are mutually exclusive Shape endpoints of one job; commissioning needs either, never both. The alcove costs one extra preparation action and has an extra exposed approach. It is not secretly generated only when the party needs it.

Real roster enumeration, direct/alcove deduplicated union:

| Tier | Feasible distinct squads | Lowest capability-bearing rarity mix | Intended example |
|---|---:|---|---|
| 1 | 1,975 | Three Commons | Bushel / Furrow / Pip |
| 2 | 608 | Common + two Uncommons | Cornix / Kernel / Beeswax |
| 3 | 210 | Three Rares | Barrow / Cobweb / Amberly |
| 4 | 93 | Two Rares + an Epic | Barrow / Cobweb / Harvestmoon |
| 5 | 33 | Three Epics | Warden / Gossamer / Harvestmoon |

Order is Number/Shape/Sustain. T5 includes eight all-Epic squads, four without Gossamer. Alcove examples: Warden / Longshadow / Harvestmoon, and Ninebark / Warden / Longshadow. No named Epic is mandatory. One Legendary plus two Commons cannot commission tiers 2–5. No Common/Uncommon can fill any T3 job; no Common/Uncommon/Rare can fill any T5 job. These are static capability proofs, not full winning traces; generation certificates must additionally prove charge, travel, survival and enemy handling.

The jobs express the puzzle: Four Locks has equation bus/bridge brace/tree maintenance; Turning Ravine has number calibration/bridge turning/wind stabilisation; Unequal Crossing has numerical scale lock/platform brace/scale repair; Roost has beam calibration/tower alignment/whistle maintenance; Hollow Bough has shelter capacity/shape anchors/root maintenance. No extra unrelated five-stat locks are added.

## 8. Puzzles on screen

Sudoku remains an accepted square mechanism panel opened from a station. It is not presented as hex Sudoku. The panel can dock over part of the map; retain selected hero, AP, next threat and a Return to board control. Nonogram uses the same square-panel host with its own rules. Solving drafts while away from the station is allowed; committing requires an eligible Operate/Crosswire target.

Rotation is on actual battlefield hexes. Each overlay has six sectors; number sectors contain six values, operator sectors are exactly `["=","+","−","×","÷",null]`. Fixed reading notch at the top chooses one active face. Rotate ±1 moves 60°. All labels remain upright. Do not rotate terrain, hit polygons, world coordinates or hero art. The active glyph is read from a defined source index in generation. Shared wheel glyphs appear in all linked tracks; the tracks highlight while selected. Blank breaks a track; it is not zero. Parser requires exactly one `=`, legal operator placement and non-empty expressions on both sides. Invalid/incomplete tracks stay visibly unpowered, not red error pop-ups on every turn.

Free draft editing animates tentative overlays with a dotted status. Until committed, previews show both “planned” and “active” outputs. Use a single Commit control at the appropriate station, not AP per trial rotation. This keeps substantial maths reasoning without turning a puzzle solve into many paid clicks. The mathematical solution and the chosen active-output subset remain separate states.

Balance allocates values in a control view with matching live totals on the physical scales. No dragging loads through terrain. Polyhex pieces are placed on a labelled clearing patch on the map; enlarged planning view uses the exact same axial cells. Shapes must show clear outlines; one invalid overlapping placement cannot be committed.

## 9. Player feedback: exact interface contract

Briefing starts with four short items: Goal, How the puzzle works, Next threat, Team requirements. Each named object is clickable and highlights/recentres it. One mini example appears on the first visit to a family and can be replayed; practice consumes no AP. Do not write an impenetrable paragraph of flavour as instructions.

Squad view shows each card's five stats, health, Move, role, primary discipline and four hand cards. It assigns the three job icons to actual selected heroes, lists exact shortfalls and offers direct/alcove alternatives. Show “Suitable team” only for static feasibility; say “Needs Geometry 8 or the prepared alcove” when incomplete. Never promise a win from the readiness badge.

Selected-action rail contains actor, verb, target, AP cost, hand exhaustion, relevant equation and the full numeric outcome. All figures come from the engine's `previewCommand`, not UI calculations. Expand details for factors. When unavailable, report the specific reason and only a remedy that is currently legal.

Example preview: “Kernel: Geometry 7 + Cornix support 1 − armour 3 = 5 damage. Hookmole: 8→3 health. It will survive and jam the upper wheel.” Example wheel preview: “B: 5→6. Bridge 4×6=24, powered. Shelter 6+5=11, powered. Crosswind will rewind B unless protected.” Example Hold failure: “Logic 6; this station needs 7. Adjacent support does not change its operating requirement.”

After an action, show result plus consequence, not merely Success: “5 damage; Hookmole survives. Upper wheel remains threatened.” Enemy phase gives one named event at a time, with optional follow camera; summary afterwards lists at most three material changes and the full log remains available. If the forecast changes after an action, highlight the changed target/effect. No hidden target preference.

Persistent HUD: Round n/5, selected hero/AP, orchard integrity, three job states and relevant output subset. Each missing condition has a direct link to its object. Health, shields, charged amount/capacity and locks appear near selected objects, with symbols plus text. Full squad stats and rules stay in drawers so the board remains dominant.

Hints are static templates instantiated from deterministic puzzle deductions: observation, next deduction, worked step. A final Show solution fills a draft; the player still executes battlefield actions. Hints do not reduce star awards. Explain a local failed equation/row, never silently fill a puzzle automatically upon opening it.

Win report: completed family/tier, roles/stat contributions from actual events, rounds/actions, three stars or Already awarded, next tier. Lose report: exact failure, preserved maths understanding and a relevant retry/team suggestion. “Your squad is weak” is unacceptable; state the missing capacity or missed protection.

## 10. Viewport, touch and accessibility

Map is a pannable, zoomable world inside a fixed viewport. Initial side length s=40 CSS px; camera scale starts at 1. Fit-overview is computed from bounds with 16 px padding, clamped to `[0.45,1]`; manual zoom range `[0.45,2]`. Overview uses simplified symbols below scale 0.75, detailed labels above. Selected details remain ≥16 px in untransformed UI at every zoom.

Pointy-top projection: x=`originX+sqrt(3)*s*(q+r/2)`, y=`originY+1.5*s*r`. One uniform scale, no independent x/y stretch. Hit testing inverts pan/zoom before testing the measured top polygon. Decorative faux depth does not determine hit areas.

Touch: tap selects; one-pointer motion >8 CSS px becomes pan and cancels the tap; pinch zooms about gesture centre and never issues an action. Only explicit command confirmation moves a hero. Mouse: drag empty board or middle drag anywhere pans; wheel pans; Ctrl+wheel zooms around pointer, prevent page scroll only when pointer is over viewport. Visible +/− and Overview/Party/Objective buttons are always available.

Keyboard in board focus: arrows pan by 60 CSS px; +/− zoom; Home overview; Escape closes detail/draft choice safely; Tab moves among actionable figures/controls. Do not intercept arrows in input controls. Screen-reader equivalent lists legal reachable targets and object state; no requirement to navigate a visual hex diagram.

Minimap collapsible, showing viewport rectangle, heroes, stations and forecast targets. Off-screen markers identify named threats and are clickable. Selecting a tray hero centres it unless camera lock is on. Enemy follow camera defaults on only when not dragging/locked; reduced motion uses instantaneous framing. HUD stays outside camera transform. Clamp world bounds with one-hex margin, taking drawers/safe areas into account. Camera never enters solver state or spends AP.

UI target sizes ≥44 CSS px where interactive; mechanism panel digits ≥20 px. Test portrait 390×844, landscape 844×390, tablet 768×1024 and desktop 1280×800. Below 390 width preserve interaction through drawers/scroll, not shrunken illegible maths. Colour always has a symbol/text equivalent. Reduced motion and replay last phase are presentation-only.

## 11. State and API contracts

Implement Orchard v2 in separate modules initially; do not rewrite the legacy engine for LR/GF. Proposed directory `expeditions/v2/`. Versioned catalog entry contains `engineVersion:2` and routes only the new five families to this engine. Legacy scenarios/save state stay readable, without double entry points in the visible Orchard catalogue. Never parse a v1 snapshot as v2.

```js
blueprint = {
  schemaVersion: 2, moduleKey: 'primary', familyId, tier,
  seed, generatorVersion: 1, rulesVersion: 2, attempt,
  layoutId, tiles, stations, puzzle, outputs, enemies,
  hazards, deployment, deadline: 5, orchardMaxIntegrity,
  certificateId, structuralFingerprint
};
state = {
  schemaVersion: 2, runId, revision, blueprint, round: 1,
  status: 'playing', heroes, enemyStates, stationStates,
  puzzleActive, puzzleDraft, activeOutputs, orchardIntegrity,
  marks, phaseEffects, holds, preparedAlcove, events, undo,
  hintStage, actionCount
};
```

Blueprint is immutable, including the puzzle truth on the local device. There is no runtime AI or server. The child UI does not expose the hidden solution unless worked help is requested. Station state: `{charge, integrity, holderId, shield, lockStrength, stabiliseStrength}`. Hero state includes `{cardId,position,hp,ap,handReady,refocusUsed}`. Every entity has stable ID and `artId` independent of its story name.

Required pure interfaces, names fixed for handoff:

```js
generateOrchardBlueprint({familyId,tier,seed,generatorVersion})
validateBlueprint(blueprint)
solvePuzzle(puzzle, {limit:2,nodeBudget})
createRun({blueprint,cardIds,runId})
listCommands(state,heroId)
previewCommand(state,command)
reduceCommand(state,command)
forecastEnemyPhase(state)
resolveEnemyPhase(state)
evaluateVictory(state)
certifyBlueprint(blueprint,certificatePlan)
applyOrchardV2Result(progress,result)
```

`previewCommand` returns `{legal,reasonCode,reasonParams,cost,changedEntities,factors,outputsBefore,outputsAfter,forecastAfter}`. `reduceCommand` returns new state and the actual same result payload. It never mutates input. Presentation localises reason/event codes into plain UK English; it does not calculate outcomes. Events retain IDs, before/after values, factor names and blocked causes. Do not generate explanations by concatenating internal object dumps.

Enemy forecast returns exact ordered records `{enemyId,path,targetId,verb,power,puzzleChange,hpChange,blockedBy}`. Blueprint validator and puzzle solver return structured success/failure/unknown statuses. A node-budget timeout is `unknown`, not unsatisfiable or a successful certificate.

### Command ABI and replay origin

Store immutable `initialRun:{runId,blueprint,cardIds,deploymentAssignment,initialStateHash}` separately from evolving state. Reconstruct it and replay every accepted tactical/free-state command to validate rewards. Camera and animation never enter the canonical state hash.

Every command is `{type,heroId:null|string,expectedRevision,payload}`. Accepted commands increment revision and enter the replay log; rejected commands do neither. Target IDs reference blueprint entities/groups, never DOM coordinates. `allocations` is an array of `{targetId,amount}`, non-negative integers, no duplicate targets. `targetIds` are distinct and all validated before mutation.

| type | payload | Rule |
|---|---|---|
| move, dash | `{destination,path}` | Destination differs from current hex; validate selected path/terrain/occupancy, never silently replace it. |
| strike, exact-blow, marked-shot | `{targetId}` | Published strike/hand rules. |
| driving-blow | `{targetId,pushDestination:null|hexKey}` | Validate proposed push after strike; only positive damage allows push. |
| guard, repair, lock, stabilise, calibrate, hold, prepare-alcove, counterturn | `{targetId}` | Published target/range/check rules. |
| shared-charge, field-repair | `{allocations}` | Totals, caps, sight/range validated atomically. |
| true-shift | `{targetId,destination}` | Destination adjacent to target, empty/legal. |
| wide-brace, linked-lock, root-shelter | `{targetIds}` | One or two distinct targets. |
| stand-together, mend-and-mend-again | `{targetId}` | Guardian's second target cannot be self; Mender may target self. |
| intercept | `{destination,path,markTargetId:null|string}` | Check mark range/sight after movement. |
| operate, crosswire | `{draftRevision,outputIds,lockGroupId:null|string}` | Saved draft version matches; Crosswire requires a valid selected lock group. |
| second-wind | `{readyCardId,stepDestination:null|hexKey}` | Other exhausted hand card; optional adjacent step validated first. |
| refocus | `{readyCardId}` | 2AP, once per hero, never Second Wind. |
| wait | `{}` | 1AP. |
| edit-draft | `{puzzleId,edit}` | 0AP. Edit types: set-cell, rotate-wheel, assign-load, inferred-value, place-piece, remove-piece, select-outputs. Validate against family schema; increment draftRevision. |
| compare-loads | `{leftLoadIds,rightLoadIds}` | 0AP, irreversible allowance/knowledge within run. |
| request-hint | `{puzzleId,stage}` | 0AP, saved hint stage. Worked solution writes a replayable draft edit. |
| undo | `{}` | NoAP; restore last tactical/draft mutation, retaining comparison log. |
| end-round | `{forecastRevision}` | NoAP; matching revision required, resolve whole deterministic phase. |

Deployment is chosen before createRun and fixed after Start. App owns Start/retry/resume/new map, not hero commands. Free edits can be coalesced only with replay-equivalent snapshots. Canonical comparisons sort IDs on each side; swapping sides reuses the inverse known outcome without spending allowance.

Draft edit payloads, all additionally include `edit.type`: set-cell=`{row,col,value}` (Sudoku value1..4|null, nonogram filled/empty/unknown); rotate-wheel=`{wheelId,delta}` (delta±1 only); assign-load=`{loadId,pan:'left'|'right'|'reserve'}`; inferred-value=`{loadId,value}` from its displayed candidate set; place-piece=`{pieceId,originHex,orientation,reflected}`; remove-piece=`{pieceId}`; select-outputs=`{outputIds}`. Invalid placement can be displayed as local hover but is not a saved accepted draft edit; the child receives overlap/bounds reasons. Operate's outputIds must equal saved draft selection, preventing an unpreviewed change. For families without selectable outputs, outputIds is their declared singleton enabled output list.

## 12. Persistence, rewards and retry

All writes go through App's existing `setProgress`. No component localStorage writes. Store v2 under the existing expedition bucket with `v2:{activeRun, familyTiers, tierAwards, recentSeeds, attemptCounters}`; preserve legacy `scenarios`, `moduleSetRewarded` and other unrelated fields. The module's current profile owns this bucket; prefix award key `primary:<familyId>:<tier>` for stable identity.

Winner result contains runId, familyId, tier, seed, rulesVersion, blueprint hash, final-state hash and event history/action trace. Validate by deterministic replay from its saved run before granting. Local hashes establish consistency, not anti-tamper security; do not claim cryptographic protection. An ad-hoc `won:true` callback alone is insufficient.

Reducer transaction: if validated winner and no tierAward key, record award + tier clear + best stats, add 3 stars, apply existing `PACK_COST` conversion. Duplicate run or any seed on an awarded tier gives zero new stars. Undo/reload/crash must never duplicate the award. Wins with hints remain eligible. New family tier unlocks previous+1; T1 always available. Do not auto-award skipped tiers. Loss/retry has no reward and retains only personal attempt/history.

No new module-set Reveal token is granted by v2. Previously earned tokens remain. This freezes the new economy to 25×3=75 stars, independently of historical rewards. Blueprint/art/rules corrections never reset award identity. A family rename retains its stable ID. Existing v1 clears do not convert to v2 tiers.

Retry same seed restores the same blueprint/initial resources. New map increments persisted attempt counter and derives a new deterministic seed; it does not clear tier awards. Resume saves full blueprint, active/draft puzzle, effects, AP, hand, holds and undo at each confirmed action/End Round. Saves inside an animated phase commit its complete deterministic phase state and replay events on resume, not half an enemy action.

## 13. Completion gates

Required before any family is called done: exact parser/solver correctness, 25 certified family/tier reference blueprints across the release, target-band winning traces, lower-band exclusion certificates, live UI execution of alternative plans, meaningful uses of every stat, clean asset wiring, map interaction accessibility, atomic rewards, offline build and observed child playtests.

No agent reports “finished” based only on engine tests or rendering a screenshot. Five-minute pacing is measured with familiar players: report median and range from at least six completed attempts per family, including both children where available. A slower first tutorial is acceptable; if familiar attempts repeatedly exceed eight minutes, remove travel/interaction overhead before simplifying the maths. Product owner reviews timing evidence; absence of children for a test is a recorded remaining acceptance item, not an excuse to claim success.

The engineering and art agents report into the delivery board. Production release remains a separate user decision.
