# Orchard v2: procedural generation and the five mission packets

Version 1.0 design baseline, 1 October 2026. Shared actions/stats/AP and ownership are in the implementation spec. This file owns deterministic topology, puzzle rules, enemies and difficulty. All indices are zero-based in data; player coordinates are labelled from 1 where appropriate.

## 1. Generator architecture and certification

Use the existing FNV-1a/mulberry32 random source. Input identity is family ID, tier, rulesVersion=2, generatorVersion=1 and unsigned requested seed. No `Math.random`, current time or profile identity participates in content. Use independent labelled substreams derived from `${identity}|topology`, `|puzzle`, `|entities` and `|decoration`. Changing leaf decoration must not change puzzle truth or enemy placement.

**Generate and certify a bank offline, regenerate selected entries at runtime.** This avoids expensive tactical search on a child's phone while retaining procedurally constructed maps. Each family/tier ships at least 64 accepted parameter seeds plus one reference fallback. The bank stores compact generator parameters and certificate IDs, not 64 hand-painted maps. Solvers, full traces and QA metrics are development artifacts; runtime reconstructs exact blueprints from the parameter seed using the same pure generator.

Runtime `generateOrchardBlueprint` selects an entry with `requestedSeed % bank.length`, then skips recently used entries deterministically by incrementing index, up to eight probes. If all eight recently used, choose the first probe anyway and report a repeat; never change difficulty. `requestedSeed` and selected `parameterSeed` are recorded separately. Content reproducibility uses parameterSeed. Reward identity uses family/tier, neither seed. New Map uses a persisted attempt counter to derive requestedSeed, not an endlessly repeating date-based seed.

Offline candidate generation has a maximum 256 topology attempts and 256 puzzle attempts per accepted entry. Tactical trace search may examine at most 250,000 canonical states per squad/plan. Timeout is unknown; reject that candidate or use a different certified plan. Never label a timeout an impossibility proof. If the bank cannot reach 64 for a tier, the task is incomplete: report the cause and keep the reference available privately; do not ship 63 copies of one map under changed seeds.

Required certificates per entry:

1. Schema and geometry validity; connected walkable deployment-to-station regions.
2. Correct puzzle, intended solution properties and measured constraint difficulty.
3. Commissioning roster assignment feasibility for direct/alcove and exact lower-band exclusion.
4. Two complete legal winning traces with distinct plans and real target-band teams. Prefer direct guarded versus alcove/interception. Where the target band cannot meet the alcove's Speed6 profile, certify two target-band direct plans plus a separate higher-band alcove trace. Both physical routes must be usable; a candidate with only one viable team or physical route is rejected. The precise tier/team examples and exception are in §9.
5. State/event replay agreement, including charge, movement, AP, sight, hand exhaustion, puzzle damage and final enemy phase.

Store trace command arrays and state hashes after every command. The engine replays the proof; no separate hand-written approximate simulator certifies production rules. A high-level planner may propose commands, but only real reducer replay accepts them.

The bank must contain all four archetypes at every tier, at least eight different labelled-topology fingerprints per archetype and eight materially different puzzle dependency patterns. D6 transforms, artwork and changed labels do not count. Some banks may need more than64 entries. Topology fingerprint canonicalises sorted axial tile records (terrain/cost, anchor role, passage flags and hazard role) over12 D6 transforms and translation, choosing smallest serialization. Exclude entity IDs/art/numbers. Puzzle fingerprint canonicalises variable/constraint incidence with type, shared membership and clue/shape structure; remove decorative IDs and normalise family symbol/row/column/pan/piece symmetries. Publish the family canonicaliser and inspect the resulting patterns: differing hash labels alone do not prove diversity.

## 2. Exact base board construction

Use offset columns c=0..11 and rows r=0..8. Convert to axial q=`c-floor(r/2)`. Remove each 2×2 corner block: `(c<2 || c>9) && (r<2 || r>6)`. The remaining footprint has 92 hexes. Every tile record is created from this footprint; no percentage-positioned invented coordinates.

Four archetypes before reserved-cell protection:

| ID | Initial barriers and crossings | Tactical distinction |
|---|---|---|
| river | Water column 6; bridges at rows 2,4,6 | Three crossing choices; central bridge is puzzle controlled |
| islands | Water columns 4 and 7; bridges at rows 2,6 in each | Two cuts form a middle island; outer routes differ in exposure |
| hedges | Hedge columns 4 and 8 at rows 2,4,6; gaps at 3,5 | Central route loops around hedge teeth; no water dependency |
| terraces | Hedge rows 3 and 5 for columns 2..9, gaps at columns 3,8 | Upper/lower terraces with different approach distances |

For river/islands, all other water-column cells remain impassable. A bridge has a floor record whose open state is an output. The generated candidate must also have a permanent crossing on each cut, so no puzzle solve is necessary to reach the control. River's centre r4 bridge may open/close; islands' r2 bridges are permanent and r6 pair controlled. Hedges/terraces' controlled gate replaces a selected gap; leave another gap permanent.

Mandatory anchor defaults, in `(c,r)`:

- Deployment: `(2,3)`, `(2,4)`, `(2,5)` for assigned Number/Shape/Sustain in reference traces. Player may choose among these before Start.
- Puzzle control: `(4,4)`.
- Number station: `(8,4)`.
- Shape direct: `(9,1)`.
- Sustain station: `(8,7)`.
- Shape alcove: `(10,3)`.
- Orchard objective/tree: `(10,5)`.
- Enemy candidate entries: north `(10,2)`, middle `(9,4)`, south `(10,6)`.

Resolve proposed barriers conceptually before anchor choice. An anchor must be floor or permanent bridge, never water or a controlled closed passage. If its default fails, use nearest eligible floor within3 by `(distance,r,q)`, then optional jitter. Reservation removes decorative obstacles, never a water cut/controlled state. Station pair distance remains≥3. Each hero supplies only one hold; spatial separation additionally matters for utility/support.

Variation algorithm:

1. Seed-select archetype/family footprint policy. Resolve eligible default anchors, reserve the family footprint, then optionally jitter each operating anchor to its default or six neighbours in shuffled order. Accept first legal same-region position meeting pair-distance/access. Fixed reference uses eligible defaults without jitter. Materialise barriers using the explicit family policy; never arbitrary clearing.
2. For each bridge/gap, propose row/column displacement −1,0,+1, accepting only if the cut still has at least two valid passages and anchor regions remain reachable. Islands has two distinct cuts; validate each separately.
3. Add 6–10 decorative hedge obstacles from eligible non-reserved floor cells, sampling without replacement. Remove one candidate obstacle at a time if it destroys connectivity or path limits; cap rejection at 32, then restart candidate. Hedges/terraces may use only 4–6 additions to preserve walkable area.
4. Add 4–8 root-cost cells, none on deployment, a station, the only remaining crossing or its adjacent sole access cell. Roots change path costs without disconnecting.
5. Verify 70–86 walkable cells with controlled crossings open and ≥66 closed. Default barrier values may leave more than 86; add legal hedges to reach the interval. Never silently shrink below the interval. If constraints cannot be met, restart.
6. Compute weighted shortest paths. Deployment→control ≤6; control→Number ≤5; each deployment→its direct station ≤12; deployment→alcove ≤15. Number/Shape/Sustain remain in different local operating regions. Direct-versus-alcove approaches must have at least two distinct edges and a cost/exposure trade-off; mirror-only paths fail.
7. Place mechanisms/enemies on reserved cells, then revalidate. Order: conceptual barrier/family policy → anchors → puzzle footprint reservation → actual barriers/crossings → decorative hedges → roots → entities → validation.

Only the free map camera zooms; logical map size/coordinates stay fixed. High tier changes constraints and pressure, not extra twenty rows. Region template metadata includes labels used in briefings: western controls, upper crossing, lower grove, eastern orchard.

## 3. Common stations, hazards and enemy table

Station maximum integrity is `10+2*tier`; charge capacity is 4,6,7,7,8 from the shared spec. Orchard integrity starts at `18+2*tier`. Any station or orchard at zero loses immediately. Puzzle-control integrity is the same station maximum; it is repairable. Enemy jam means the declared puzzle-member corruption; there is no additional generic jammed-station status. Stations remain usable while intact, subject to their printed Hold profile. Repair integrity normally; correct corrupted maths through draft edits and paid Operate. Adequate one-phase Stabilise prevents a matching future change but does not solve an already false puzzle.

Every family has a round-end environmental hazard, power `3+tier`, targeting Sustain or the named controlled bridge. A matching stabilisation blocks it. Unblocked hazard removes `2+tier` integrity from the orchard and applies the family effect. Target and effect are in the forecast from round start. The Number/Shape/Sustain Hold actions also confer their natural one-phase protection: Number locks its family puzzle group at strength L, Shape braces its own station at strength G, Sustain stabilises the orchard/hazard at strength S. This makes the final simultaneous operation coherent, not three stat keys. An earlier Hold can protect while charging; its holder is still only that hero.

Enemies, all stats fixed by tier t:

| artId / ruleId | Health / armour / initiative | Move / range / power | Exact priority |
|---|---|---|---|
| hookmole / jammer | `8+2t` / `1+floor(t/2)` / 5 | 3 / 1 / disruption `3+t`, strike `3+t` | Target puzzle control; shortest path to a within-1 hex. If already in range, disrupt the canonical exposed group; if no group is disruptable, strike control. |
| scruffcrow / hunter | `5+2t` / 1 / 3 | 3 / 3 / strike `3+t` | Target living hero with lowest current HP; ties shortest path cost to within-range/sight, then hero ID. Move towards legal firing position, then strike if in range. |
| strawling / breaker | `7+2t` / `floor(t/2)` / 7 | 2 / 1 / strike `4+t` | Target station with largest charge fraction (compare cross products); ties Shape, Sustain, Number, then ID. Move then strike if range permits. |
| crosswind / rewinder | `6+2t` / 1 / 4 | 2 / 3 / disruption `3+t`, strike `2+t` | Rotation only: highest-degree wheel not protected by lock/stabilisation≥power, ties ID. Weak lock remains targetable and is consumed on change. Move within range/sight, rewind clockwise once. If all protected, strike nearest hero. |

Hunter flies over water/roots at cost1, but not hedge/closed gates/solid props; still observes occupancy and sight. Others use normal terrain. No enemy passes through figures. A Move-then-action enemy moves up to its budget and then acts only if target satisfies its range/sight from the resulting position. Path endpoint tie order is weighted cost, hex distance to target, `(r,q)`. Target selection uses current state; the frozen phase thereafter never retargets.

Activation schedule:

| Tier | Active enemies | First acting phase |
|---|---|---|
| 1 | Jammer | phase 2 |
| 2 | Jammer + Hunter | Jammer 2, Hunter 2 |
| 3 | Jammer + Hunter + Breaker | Jammer 1, Hunter 2, Breaker 2 |
| 4 | Jammer + Hunter + Breaker | All phase 1 |
| 5 | Jammer + Hunter + Breaker | All phase 1; hazard affects two named sites instead of one |

Rotation substitutes Rewinder for Jammer, with the same activation phase. Existing art is reused; no new enemy required. An inactive enemy shows its wake phase and does not block strategic proof as a surprise. It physically occupies its tile. Start positions sample eligible candidate entries/jitter neighbours, distance ≥5 from deployment and ≥3 from control, with a reachable target; do not let all three start in one chokepoint.

T5 hazard's two targets are Sustain and the controlled passage. Both are forecast separately. Each unprotected listed site applies its own orchard damage2+tier, so two exposed sites can cause14 orchard damage atT5. Sustain Hold stabilises the orchard-wide hazard on both targets; an ordinary Stabilise protects only its selected target. A successful final snapshot therefore requires the Sustain hero's full operating profile rather than a generic remote buff.

Jam effect: Sudoku clears lowest-ID non-given active cell; rotation turns selected wheel; balance returns highest-value assigned load to reserve (ties ID); nonogram changes lowest-ID filled cell to empty; packing returns lowest-ID placed piece to tray. Locks block if strength≥power. Always forecast the selected member; never secret answer-dependent targeting.

Stable puzzle lock groups are anchored at control: Sudoku row-0..3 plus network; rotation wheel-ID plus network; balance left-pan/right-pan plus network; nonogram row-0..4 plus network; packing piece-ID plus patch/network. Ordinary Lock/Stabilise may target one group; Number Hold protects network with raw L. Canonical disruption chooses the specified-ranked member not protected by strength≥power. If none, jammer strikes control. Membership is immutable except loads' pan assignment. Data records group anchor, member IDs and affected effect kinds. A network lock is one explicit mechanism target, not unrestricted map protection.

Phase-start outputs apply once: shelter/packing shield takes max with other shields; roots sets Breaker movement0 but permits its in-range strike; storm removes2 orchard integrity then4 flat enemy HP within2 of Number (ignores armour, immediate loss/death); roost beams suppress their sectors. Resolve enemies, environmental/nest hazards, declared post-hazard restoration if orchard lives, then victory. Rotation eq5 is instead continuous: while its committed selected track is true, effective enemy armour is `max(0,baseArmour-2)`. Recompute before every strike and forecast; never mutate base armour or stack reductions. Corruption immediately removes this benefit. Draft editing never triggers output effects. Hazard protection accepts Stabilise on its named station/bridge/puzzle group; Sustain Hold stabilises the complete orchard hazard set for that phase.

## 4. Four Locks: exact Sudoku packet

Family ID `four-locks`, puzzle kind `sudoku4`. Board mechanism panel has cells `[row,col]`, values 1–4. Constraints: row, column and 2×2 box all-different, plus cages `{cellIds,sum}`. A given cannot be edited. Empty entries are null. Cages may overlap; highlight selected cage and list its cells, never rely on colour alone. Draft can be incomplete; commit requires a complete valid grid.

Reference solved grid:

```text
1 3 4 2
4 2 1 3
2 4 3 1
3 1 2 4
```

Reference givens r1c1=1 and r4c4=4. Reference pair cages: r1c2+r2c2=5, r1c3+r1c4=6, r2c1+r3c1=6, r2c3+r3c3=4, r3c2+r4c2=5, r3c4+r4c3=3. This reference fixture is already checked in the design tooling. It is the T2 teaching/reference puzzle; other tiers follow generation criteria rather than merely reuse its clue count.

Outputs: bridge cost2, shelter3, roots4, storm5. Tier budgets7,7,7,8,8; exactly two selected. The two trace plans use different output pairs. Bridge opens controlled passage; shelter gives station shields2; roots stops Breaker movement, not an in-range strike; storm removes2 orchard and deals4 flat enemy health within2 of Number at phase start. Outputs require a valid active puzzle. Reject storm Commit if its next phase-start cost alone would reach zero and explain Repair. Inputs remain until disrupted.

Commissioning requires two currently powered chosen outputs, all three physical jobs and charges. Bridge need not be one of the two if heroes take the permanent route. The output budget is a printed machine constraint, not Arithmetic stat; Arithmetic still charges and runs the Number station.

Generate from canonical solved grid by symbol permutation, row swaps within bands, band swaps, column swaps within stacks and stack swaps. Construct adjacent 2/3-cell cage candidates; optionally one non-adjacent linked pair in T4/5 with a drawn connector. Derive sums from solution. Start with all givens, remove in shuffled order while respecting tier targets and uniqueness. Add/remove cage constraints using shuffled candidates; run uniqueness at each accepted change. Reject any givens/cages that disclose all cells immediately.

| Tier | Given count | Cages | Required reasoning evidence |
|---|---:|---:|---|
| 1 | 6 | 2–3 | ≥4 placements, singles plus one sum deduction |
| 2 | 2–4 | 5–6 | ≥8 placements, two cages affecting other groups |
| 3 | 2–3 | 5–7 | ≥2 interacting cage deductions, no isolated independent rows |
| 4 | 1–2 | 5–7 | At least one naked-pair elimination and one cage intersection |
| 5 | 0–2 | 5–8 | Pair plus chained cage deductions; optional one bounded contradiction step |

Human deduction evaluator: candidate values consistent with filled row/column/box and all cage-completion assignments; singles, hidden singles, naked pairs, cage-to-group intersections. Each step records the exact reason. A bounded contradiction step chooses a 2-candidate cell, explores one assumption through those rules, rejects on empty domain/violated sum and accepts the other. No arbitrary deep guessing. Count solution uniqueness by independent backtracking, not this hint evaluator alone. If T4/5 constraints cannot produce the required evidence in a 4×4 grid, report the failure; do not promote harder numbers as equivalent.

Player brief: “Solve the ledger. Choose two circuits. Charge and hold the controls together before round five ends.” Names: Number=ledger bus, Shape=bridge brace, Sustain=tree maintenance. Hazard: unheld roots drain orchard integrity. The accepted popup is explicit; do not attempt unapproved hex Sudoku.

## 5. Turning Ravine: exact in-grid rotation packet

Family `turning-ravine`, kind `equation-wheels`. A wheel has `{id,hex,faces:[six],orientation:0..5,kind:'number'|'operator',given:false}`. Active value = `faces[((0-orientation)%6+6)%6]`. Clockwise command adds1; anticlockwise subtracts1 mod6. All six faces appear around the rotating overlay with a fixed top notch; text is counter-rotated upright.

Number faces are six distinct integers from0..24. Operator faces are exactly `['=','+','−','×','÷',null]`, one of each. A fixed-value token/target can be a separate plate on its own hex or a track-end plaque. One wheel may be shared between several drawn tracks; every linked equation reads the same active glyph in v1. Edge-specific different faces are deliberately outside this release to avoid two simultaneous reading conventions.

Track data is an ordered list of wheel/fixed-token IDs. Its polyline follows adjacent hexes; it may turn/share vertices, with labelled equation IDs. Grammar alternates number/operator for5 or7 tokens. Exactly one current operator must be `=`; split there, build each side as a left-associated AST and display its parentheses: `(a op b) op c = d`, `a op b = c op d` or `a = (b op c) op d`. AST shape is `{type:'number',value,tokenId}` or `{type:'binary',op,left,right}` and equation `{left,right,equalityTokenId}`. Parentheses are derived from the current equality position, not fixed painted clues. Two/no equals, blank or role mismatch is incomplete/invalid with a reason. No implicit precedence or agent-chosen evaluation rule.

Evaluate exact rational pairs `(num,den)`, reduced by gcd with positive denominator. A powered track requires every division exact and all intermediate values in0..100. Divide-by-zero, negative or fractional intermediate invalidates that track. Inactive tracks may be incomplete/invalid in a committed rotation configuration. Do not use eval or float tolerance.

Checked small reference relationship: A O B=24, B+C=11, C−A=1, solution A4 B6 C5 O×. The O wheel uses the user's six operator faces, not duplicated symbols. Fixed +,−,= plates fill other slots in tutorial. Full puzzle uses6–9 variable wheels; T1 requires≥1 shared-number vertex, T2–5≥2.

| Tier | Variable wheels / tracks | Constraint escalation |
|---|---|---|
| 1 | 6 / 3 | Four number wheels, two operator wheels; two tracks include fixed operator plates; one shared number |
| 2 | 7 / 3 | Three operator choices, ≥2 shared-number vertices |
| 3 | 8 / 4 | Output budget3 of4 tracks; one exact-division constraint |
| 4 | 9 / 4 | One 7-token parenthesised track and declared rewind |
| 5 | 9 / 5 | Two long linked tracks, active budget3 and two hazard sites |

Track outputs: eq1 bridge, eq2 shelter (station shields2), eq3 roots (Breaker move0), eq4 repair stream (orchard+2 after hazard), eq5 strike window (enemy armour−2, minimum0). During work, Operate may activate0..2 outputs at T1/2,0..3 at T3–5; each selected track must be valid/true. Commissioning requires exactly2 at T1/2 and exactly3 at T3–5. T1/2 commissioning additionally needs all3 tracks true; T3–5 needs only the selected3 true. Inactive count is trackCount−activeCount, so T5 may have2 incomplete tracks. Count full all-track solutions separately from accepted mission subsets.

Generation lays3/4/5 track walks in reserved columns4..8,rows2..6; lengths5, with one long7 track at T4 and two at T5. No repeated tile within a track. Each hex has one token ID; reuse by other tracks requires the same ID and number/operator role. Variable counts (number,operator) are(4,2),(4,3),(5,3),(5,4),(5,4). Remaining tokens are fixed plates in role-correct slots, stored with explicit values/hexes. Construct neighbour walks in numeric lexicographic order, shuffle once, backtrack until compatible role/ID sharing fits the patch. Number domains contain solved value plus five distinct distractors in0..24. Choose a solved assignment, evaluate legal equations and derive fixed targets; if target>100 or cannot be placed consistently, reject. Fixed IDs may share when value/type agree. No all-zero multiplication shortcut. CSP forward checking independently proves exactly one effective full all-track solution (stop at2); zero/multiple/unknown rejects. Separately enumerate accepted selected-output subsets; at T3–5 require≥2 useful configurations, at least one differing from full solution. All placement and domain choices are seeded; no full network is guessed from artwork.

Initial scramble changes≥half variable wheels and leaves at most one track true. Solved full network must use≥2 different arithmetic operators, plus exact division fromT3. No arbitrary numeral remapping unless targets are recomputed/recertified. Geometry/operator roles remain consistent. Canonical track/token/solution data is stored, never inferred from art.

Brief: “Turn the hex overlays to complete linked equations. A shared number changes every connected track. Commit useful circuits, then hold the bridge through the wind.” Names: calibration wheel, turning joint, wind stabiliser. Hazard rewinds highest-degree inadequately protected wheel plus integrity loss. Weak locks do not prevent targeting; adequate Lock/Stabilise does. Ties use stable ID.

## 6. Unequal Crossing: exact balance/weighing packet

Family `unequal-crossing`, kind `balance`. Six loads have stable IDs and integer values1..12; each assigned left, right or reserve. Two pans must meet a displayed equal target, do not exceed pan capacities and obey declared exclusions. All totals live on scale art. No physical carrying. A comparison request is free puzzle reasoning and consumes a limited **weighing allowance**, never AP; its result is deterministic and part of saved puzzle state.

For hidden-value tiers, exactly one load has a value in a shown finite candidate set of size3–5. Player chooses assignments for a hypothetical comparison scale; feedback is left lighter/equal/heavier. Maximum2 comparisons at T3,3 at T4/5. Compare using actual generated value; do not reveal numeric difference. Solver must prove a decision tree distinguishes every candidate within allowance, rather than rely on the player guessing the true candidate. Final draft must include the inferred value and a legal allocation.

Reference six open weights: `[1,2,3,4,5,7]`, target11, capacities11 each. Accept all partitions, including7+4 versus1+2+3+5. Given exclusions must have at least one valid partition and appear before assignment; never retroactively reject.

| Tier | Allocation challenge | Deduction challenge |
|---|---|---|
| 1 | Six visible weights, no reserve required | Exact balance and one max-count condition |
| 2 | Six weights, blueprint usedCount4 or5 | ReserveCount=6−usedCount; incompatible-pair condition |
| 3 | Six weights, one hidden | Identify3 candidates in≤2 comparisons, then partition |
| 4 | Six weights, one hidden | Four candidates, pan caps and an exclusion |
| 5 | Six weights, one hidden | Five candidates, separate final pan hold, ≤3 comparisons |

Generate solution-first partitions/reserve, target/caps and an exclusion, then enumerate3^6 allocations. Store exact usedCount and reserveCount, including hidden tiers. Reject already assigned/obvious singleton-only states. Unknown candidate set contains actual value; enumerate comparison assignments with each load at most once and at least one load per side. Dynamic-program worst-case decision depth; reject non-distinguishable sets. Final inferredValue must equal actual hidden truth and agree with every logged result; free Worked help may supply it without requiring wasted comparisons. Comparison queries/log/allowance are irreversible within a run and included in replay. Hints never spend comparison allowance automatically.

Two physical scale stations share the mathematical display; Shape holds the exposed pan, Sustain keeps the damaged scale stable, Number locks/calibrates totals. Hazard drains scale integrity and returns an unprotected highest-weight load to reserve. A solved allocation powers the crossing and gives the party one reserve-choice benefit: unused total≥5 grants shield2 to both physical scales at phase start; otherwise restore2 orchard integrity after hazards, capped at maximum and only if the orchard remains alive. Snapshot allocation validity and reserve total at phase start for these benefits, so later corruption does not alter that phase's restoration entitlement. This applies every phase with a valid committed allocation at its start, not just round5 or a commissioning attempt. This choice is derived from actual allocation, not another puzzle. Commissioning still requires all three jobs/charges and intact balance.

Brief: “Find the weights and balance the pans. Keep the thief off the scales while the team opens the crossing.” Both left/right assignment symmetry is accepted; never count mirrored pan allocations as different deduction patterns for diversity.

Balance data fields: `loads:[{id,value,visible,candidates}]`, `target`, `panCapacity:{left,right}`, `usedCount`, `maxPanCount:{left,right}`, `incompatiblePairs:[[id,id]]`, `hiddenLoadId:null|id`, `comparisonAllowance`. T1 usedCount6,maxPanCount4 each,no pair exclusions. T2 usedCount4 or5; other tiers choose4..6 from generated solution. Generate one or two incompatible pairs forT2–5 from loads not sharing a solution pan; pair means cannot occupy the same non-reserve pan. Hidden load must be included in final allocation. Draft records every pan and inferredValue separately; active puzzle stores the validated entire allocation. Comparisons use all six loads regardless of draft pan but may not put one identity on both sides. A repeated known query is free; an uninformative new query is allowed with a warning and spends one allowance.

## 7. Maybe-Flock Roost: exact nonogram packet

Family `maybe-flock`, kind `nonogram5`. 5×5 cells have state unknown, filled or empty. Row/column clue arrays give positive run lengths in order with ≥1 empty separator. Empty clue [] means no filled cells. Complete commit requires every cell known and all row/column clues matching. Unknown isn't empty. No solution counter is visible unless hints request it.

Reference cross rows `00100`,`00100`,`11111`,`00100`,`00100`; row/column clues `[1],[1],[5],[1],[1]`. This is tutorial practice only, too obvious for a normal expedition. Family reference bank needs meaningful overlap deductions.

Generate5×5 binary patterns with8–16 filled cells, no more than one empty or full row/column, at least two split-run clues. Derive row/column runs; enumerate line bitmasks matching clues then solve by iterative row/column candidate intersection and backtracking. Accept unique solution and a human-solvable deduction chain with no arbitrary guesses.

| Tier | Line complexity | Required deductions |
|---|---|---|
| 1 | At least one split run; one introductory given filled/empty cell | ≥4 forced cells and one overlap deduction |
| 2 | ≥2 split-run lines, no givens | ≥2 row↔column deductions |
| 3 | ≥3 split-run lines | ≥3 alternating row/column dependency steps |
| 4 | No full/empty line | One deduction needs intersection of multiple line candidates |
| 5 | Same5×5 size, no givens | Longer dependency chain≥5, then scarce beam coverage |

A deduction step must change a cell with a reason: filled/empty in every remaining legal line candidate, propagate to perpendicular line, repeat. Count dependencies between affected lines, not number of clicks. If no forced cell remains before solution, reject as guesses-only. Do not increase to10×10 to meet complexity.

Nest sectors are fixed before play: square rows0/1=north, row2=east, rows3/4=south. Each generated pattern must have≥1 filled cell in each sector. Three physical perch markers are nearest eligible floor to(9,1),(10,4),(9,7), relocated deterministically outside reserved tokens. Exactly2 of3 beams selected after valid pattern commit. At phase start, a powered beam suppresses movement and all actions of enemies assigned to that sector for this phase; it does not remove their figure or health. An uncovered non-empty sector contributes one nest hazard of orchard damage1+t unless adequate Sustain Hold/global hazard protection or Stabilise on its sector group prevents it. Thus the uncovered sector matters even at T1. Two certified plans choose different sector pairs and enemy/route consequences.

Roost overrides enemy schedule: T1 Hunter in east, wakes phase2; T2 Hunter east/Jammer north, both phase2; T3 Hunter east/Jammer north/Breaker south with common activation times; T4/5 all three phase1. Blueprint records each sector. No random spawning. Number calibrates beams, Shape aligns tower, Sustain maintains whistle. Environmental hazard changes lowest-ID inadequately protected filled cell and applies common orchard damage. Nest hazard resolves after that; its sector grouping comes from the committed solved pattern before disruption, so an enemy cannot erase a cell to make its nest safe. Sector group anchor is its physical perch; Lock and Stabilise have their published group rules. Adequate Sustain Hold protects both hazard types.

Brief: “Read the row and column clues to find the nests. Two whistle beams can run; choose which birds to scatter and which route to defend.” A solved nonogram does not automatically silence every threat.

## 8. Hollow Bough: exact polyhex packing packet

Family `hollow-bough`, kind `polyhex`. Puzzle patch is a radius2 axial disc, 19 cells, centred on Shape direct or a relocated neighbouring clearing. Puzzle cells overlay normal floor and remain selectable as terrain. Active shelter footprints cannot block hero movement; piece placement denotes overhead shelter, not a solid wall. Solid root barriers are separate blueprint terrain.

Exactly three labelled connected pieces, each2–4 cells, total covered area8–11. Permitted transforms are six axial rotations and translations; reflection is disallowed T1/2 and explicitly enabled T3–5. Rotation around a piece anchor: `(q,r)→(-r,q+r)` for one60° turn. Reflection: `(q,r)→(-q-r,r)`. Normalise a piece by subtracting its anchor; deduplicate equivalent transforms.

Legal placement: within allowed patch, no overlaps, cover all compulsory sockets, cover no forbidden cells, leave at least three free patch cells connected to accessible approach cells. Every piece must be placed. Accept all legal packings; no unique-solution claim. A forecast names up to two covered cells that will lose shelter after enemies unless stabilised. Verify placement validity separately from forecast survival.

| Tier | Pieces and patch | Constraint escalation |
|---|---|---|
| 1 | Sizes2,3,3;19 allowed cells | 3 sockets,1 forbidden cell, rotations |
| 2 | Sizes3,3,3 | 4 sockets,2 forbidden cells |
| 3 | Sizes3,3,4 | 4 sockets,3 forbidden, reflection permitted |
| 4 | Sizes3,4,4 | 5 sockets,3 forbidden,1 forecast cell |
| 5 | Sizes3,4,4 | 5 sockets,4 forbidden,2 forecast cells and separate holds |

Generate three shapes from a small explicit catalogue: domino `[(0,0),(1,0)]`; straight trihex `[(0,0),(1,0),(2,0)]`; elbow trihex `[(0,0),(1,0),(0,1)]`; straight tetrahex `[(0,0),(1,0),(2,0),(3,0)]`; hook tetrahex `[(0,0),(1,0),(2,0),(1,1)]`; diamond tetrahex `[(0,0),(1,0),(0,1),(1,1)]`. Select by size table, keeping at least two non-congruent pieces. Pre-place one legal solution by backtracking, choose sockets from covered cells and forbidden from uncovered cells, then enumerate all placements/transforms. Reject fewer than two legal packings with different sheltered approaches or exposed operating positions. Do not count piece-label swaps of identical shapes as different solutions.

Radius2 cannot contain all straight tetrahex transforms: reject invalid placements, never stretch. Packing footprint centre is offset(3,4); all19 cells must be retained floor. Shape direct relocates to that centre; Number/Sustain use common anchors. For packing only, islands uses water columns6/9, hedges uses blocked columns6/9 and terraces uses row3/5 barriers in columns6..10 with gap8. River remains column6. These explicit family variants leave the western clearing intact; do not clear water after generation. Reserve the patch before decorative hedges/roots, then validate alternate-route/area constraints. Shape alcove remains(10,3), preserving a long alternative. The world patch may relocate only if its entire disc fits an existing contiguous floor region and anchor distance constraints remain valid.

Piece shelter grants shield2 to covered heroes/stations at phase start, taking max with larger shields. Number meters capacity, Shape anchors, Sustain maintains roots. Hazard records `suppressedShelterCells` for this phase; piece coordinates remain intact. Covered compulsory socket suppression invalidates commissioning. Suppression expires only at the next player's round start, not by recommitting mid-phase. No player commands run during enemy resolution. Adequate Stabilise on patch/group or Sustain Hold prevents suppression. Remaining covered cells retain piece identity, never movable fragments. Select forecast cell IDs by ascending eligible compulsory socket ID, one at T4,two at T5; at T1–3 the hazard is integrity-only.

Brief: “Fit all three branches, cover the sockets and leave room for the team. The forecast roots will fall after the enemies move.” The maths is on the hex clearing, with an optional enlarged view of the same cells.

## 9. Reference plans and layout acceptance

### Family schemas and environmental effects

All puzzle data includes `{kind,controlId,controlHex,lockGroups,solutionParameters,draftSchemaVersion:1}`. `solutionParameters` remains local and hidden from normal UI, used by hints/certification. Sudoku adds `{size:4,givens,cages}`. Rotation adds `{tokens,tracks,maxActiveOutputs,minimumTrueTracksForCommission}` with token fields as above. Nonogram adds `{size:5,rowClues,columnClues,givens,sectorByCell,perches}`. Packing adds `{patchCells,pieces,sockets,forbiddenCells,reflectionAllowed,forecastCellIds}`. Balance fields are in§6. Validators reject unknown IDs, duplicate placements and out-of-domain values before mutation.

Non-selectable output IDs are `balance-crossing` and `shelter-packing`; Sudoku/rotation IDs are their named circuit/eq IDs; nonogram uses `beam-north`,`beam-east`,`beam-south`. The `outputs` table supplies trigger (on-commit, continuous, phase-start or post-hazard), target IDs and exact effect kind, never imperative hidden scripts. Bridge/gate passability updates on committed truth change and corruption, with the safety interlock from the shared spec.

Environmental hazard table, in addition to its common orchard damage2+t when not adequately stabilised: Four Locks has no puzzle mutation; Turning Ravine rewinds its ranked inadequately protected wheel; Unequal Crossing returns the ranked unprotected assigned load to reserve; Roost clears its ranked unprotected filled cell and then resolves nest damage; Hollow Bough suppresses forecast cells onlyT4/5. Jammer and environment are separate potential changes with separately visible causes. A lock blocks a member mutation, but does not itself block orchard damage; Stabilise/Sustain Hold does. If there is no eligible mutation member, the environmental integrity damage still applies unless stabilised. Always forecast the actual eligible target.

Common selected target rules apply to a group's anchor. Environmental full-hazard target anchor is Sustain; its secondaryT5 bridge target is the controlled crossing. Ordinary Stabilise on Sustain protects that site and its corresponding orchard damage; it does not automatically protect remote puzzle mutations. Stabilise on network protects its puzzle mutation but not orchard damage. Sustain Hold is the explicit whole-hazard protection. This distinction must appear in previews.

### Constructive tactical certification

Implement two macro planners, each expanding only real legal commands: direct/guard and alcove/intercept. Use the puzzle solver's completed draft as their plan input, but still log edits and paid Operate. Assign Number/Shape/Sustain by roster enumeration; priority goals are puzzle commit, cheapest charge contributions, route traversal, imminent integrity protection, declared disruptor handling and final holds. Branch on shortest legal movement endpoints, relevant protection/strike targets, role/discipline tools, output subset and direct/alcove selection. Do not branch on arbitrary erroneous puzzle guesses or decorative camera state.

Search is breadth-first by rounds, then action count, with canonical tactical-state deduplication (same blueprint,round,positions,hp,AP,charge,integrity,hand/effects/holds,active puzzle/output state). Free draft edits are coalesced into one macro that still emits the exact replayable edits. Knowledge logs remain part of state. A dominance reduction may drop strictly worse HP/AP/resource states only when positions,puzzle,effects and all future target rules are identical; lowest-HP Hunter targeting makes careless HP dominance unsound. Publish reductions/tests rather than assuming them.

For each accepted entry, require direct proof from the first assigned real target team and alcove proof from a different team/route. Target examples: T1 Bushel/Furrow/Pip vs Tuppence/Wicker/Sorrel (if alcove needs anotherCommon Shape, enumerate rather than forceWicker); T2 Cornix/Kernel/Beeswax vs Cornix/Kernel/Millrace; T3 Barrow/Cobweb/Amberly vs Barrow/Driftwood/Gable; T4 Barrow/Cobweb/Harvestmoon vs Warden/Longshadow/Cascade; T5 Warden/Gossamer/Harvestmoon vs Ninebark/Warden/Longshadow. Those named direct teams are static fits; alcove candidates must use the route-specific Speed6 profile. ForT1–3, a candidate may have two direct target-band traces plus a separately certified higher-band alcove trace when the target band cannot use the alcove. In every case demonstrate two different target-band teams and plans, and prove the alternate physical route is genuinely usable; do not force every low-tier team to have an Epic-speed alcove member.

Every tier must ship a reference direct plan and reference alcove/interception plan, with concrete command arrays, chosen card IDs, puzzle draft, output selections and final hashes. The following is a required planning skeleton, not an asserted already-winning trace:

- Phase1: Number-side hero reaches control; other heroes take upper/lower approaches. Complete puzzle draft; Operate when adjacent and resources permit.
- Phase2: charge/repair while intercepting the declared disruptor or applying Lock. Use abilities where doing so saves travel/defence actions. Shape alternative prepares alcove.
- Phase3/4: complete station charge, preserve correct outputs, move each hero into operating range. Direct plan spends actions on defence; alcove plan pays its preparation/exposure cost and uses a different Shape hero.
- Winning phase≤5: all three hold, with remaining AP spent on legal stationary protection/strike. Forecast exactly resolves. Puzzle remains valid, no station/hero/orchard destroyed; evaluateVictory returns won.

If the actual reducer cannot execute this with at least two target teams for a candidate, reject it. Do not edit AP, enemy wake phases, station requirements or puzzle truth just for that seed. A tactical certificate may use different precise action ordering from this skeleton, but must include the same published costs and threats.

This specification is sufficient to implement generators and validators; it does not falsely claim the bank/traces already exist. Producing and proving them is an explicit Codex deliverable using Claude's production reducer before completion.
