# The Orchard of Four Locks

Design demonstration v0.2 · 1 October 2026

This replaces The Mill That Would Not Turn as the current discussion example. Sam found that example too simple and its map too small. This is a new candidate, not an approved production specification or a change to the existing game. The character stats are real; conversion formulas, abilities, scenario rules and enemy values are provisional.

## Player brief

> The Thorn Captain has crossed the river. The orchard's old controls still work, if someone can remember the numbers.
>
> Defeat the Captain and ring the eastern bell before the fourth round ends. Keep the orchard standing.
>
> Two circuits can run at once. Open a bridge, raise shelter, trap the Captain or call a storm. The storm damages the orchard too.

Selecting a named place highlights it on the map. Each enemy displays its next destination and target before the player commits. The larger map does not introduce fog of war or hidden rules in this demonstration.

## What is different

- 82 total hexes, including river, hedges and a central orchard tree. 72 are walkable when the central bridge is open; 71 when shut.
- Three places with different jobs: western controls, northern crossing and eastern orchard. There is also a southern crossing for alternatives not used by the two reference traces.
- A 4×4 deduction puzzle with row, column, box and linked-sum constraints. It has one verified solution, not a pair of obvious sums.
- Four useful puzzle outputs, but only two can run. Completing the maths does not decide which battlefield arrangement to choose.
- One strategy crosses under shelter and joins the fight. Another leaves Kernel at the controls, cuts the return bridge and uses roots plus storm.
- Three enemy jobs: a moving Captain, a ranged Archer covering the northern route and a Sapper threatening the controls. The Sapper is deliberately defeated before acting in both reference plans; doing so consumes an ability and position.
- The traces use different durations and damage the orchard differently. They are valid examples, not a claim to exhaust all strategies or identify the optimal one.

Five minutes remains a target for a familiar player. A first solve of this puzzle could take longer. Do not simplify the deductions or count walkthrough-reading time as proof of the target.

## Real squad, revised provisional conversion

| Hero | Role | Arithmetic | Geometry | Logic | Science | Speed | Demo health | Demo Move |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Cornix | Guardian | 6 | 2 | 6 | 3 | 4 | 13 | 5 |
| Kernel | Reckoner | 6 | 7 | 3 | 3 | 2 | 13 | 4 |
| Beeswax | Mender | 2 | 2 | 4 | 6 | 7 | 16 | 6 |

Health = 10 + Science. Move = 4 + floor(Speed / 3). These replace the first demo's conversions for this candidate only. Larger movement budgets keep the larger map from becoming a walking exercise. Basic adjacent attacks use the named primary stat: Arithmetic 6 for Cornix, Geometry 7 for Kernel and Science 6 for Beeswax. Every attack subtracts target armour, with a minimum of zero damage.

There is no global rule that every stat boosts every attack. Stats enable different jobs. The final design still needs full-roster balance and upgrade analysis.

## The number puzzle

Coordinates use column letters A–D and row numbers 1–4. Put 1, 2, 3 and 4 exactly once in every row, column and 2×2 box. The two given cells are A1 = 1 and D4 = 4.

```text
      A B | C D
  1   1 . | . .
  2   . . | . .
      ----+----
  3   . . | . .
  4   . . | . 4
```

Six linked clues:

| Pair | Total |
|---|---:|
| B1 + B2 | 5 |
| C1 + D1 | 6 |
| A2 + A3 | 6 |
| C2 + C3 | 4 |
| B3 + B4 | 5 |
| D3 + C4 | 3 |

These are linked sums, not necessarily contiguous cages. In the interface selecting a clue highlights both cells. Normal Sudoku exclusions still apply. There is no guessing timer. Pencil notes and reasoning do not cost tactical actions; committing a correctly completed row at the controls does.

The puzzle has one solution:

```text
  1 3 | 4 2
  4 2 | 1 3
  ----+----
  2 4 | 3 1
  3 1 | 2 4
```

One deduction chain, for hints and acceptance:

1. C1 + D1 = 6 with no repeats forces {2,4}; row 1 therefore makes B1 = 3.
2. B1 + B2 = 5 gives B2 = 2. The top-left box forces A2 = 4.
3. A2 + A3 = 6 gives A3 = 2. Column A gives A4 = 3.
4. The bottom-left box needs {1,4} at B3/B4. D4 already contains 4, so B4 = 1 and B3 = 4.
5. Row 4 gives C4 = 2. The D3+C4 clue gives D3 = 1.
6. Row 3 gives C3 = 3. The C2+C3 clue gives C2 = 1.
7. Row 2 gives D2 = 3. Column C gives C1 = 4; row 1 gives D1 = 2.

This reasoning crosses several regions. The rows are not four independent puzzles. A child may deduce most of the grid before activating anything. Tactical choice comes from which solved rows to commit and power, not from pretending the numerical answer has multiple solutions.

## Four outputs, two live circuits

| Completed row | Circuit | Effect | Crosswire load |
|---|---|---|---:|
| 1 | Shelter | Attacks against heroes in the eastern courtyard deal 2 less damage | 2 |
| 2 | Bridge | Open the direct central crossing | 3 |
| 3 | Roots | Deal 2 to the Captain at each enemy phase and prevent its movement that phase; it can still attack | 4 |
| 4 | Storm | Deal 6 to the Captain at each enemy phase, but remove 3 orchard integrity | 5 |

Any hero adjacent to the controls can use a basic action to activate one completed row. If two circuits are already live, choose which to replace. Previously verified rows remain recorded and may be reactivated without re-solving. An incorrectly completed row cannot be activated; explain the relevant conflict without spending an action.

Kernel's Crosswire can activate two completed rows in one action if their loads total no more than his Geometry. Geometry 7 allows Bridge+Shelter (5), Bridge+Roots (7) or Shelter+Storm (7), but not Roots+Storm (9). He can assemble Roots+Storm over two actions by replacing a circuit normally. The load threshold restricts simultaneous activation, not what the network may sustain.

A bridge cannot be withdrawn while any living unit occupies its central hex. The control preview shows the closure and affected routes before commitment. There is no accidental drowning rule.

## Hands and basic actions

Each hero has three face-up ability cards and may spend one card or take a basic action each round, after optional movement. Played cards leave the hand for the encounter. Movement cannot pass through living units, deep water, hedges or the orchard tree. There is no automatic redraw.

| Hero | Card | Proposed effect |
|---|---|---|
| Cornix | Stand Firm | Challenge the Captain within 3 hexes if Logic meets Resolve 6. Redirect its next attack to Cornix and reduce that attack by Geometry. Shelter can reduce the remainder. |
| Cornix | Reckoned Blow | Adjacent strike using Arithmetic. Solving the optional spark challenge adds 6 before armour. |
| Cornix | Drive Back | Adjacent Arithmetic strike, then push the target one hex directly away if the destination is legal and empty. |
| Kernel | Crosswire | Activate up to two solved rows at adjacent controls, subject to the Geometry load rule. |
| Kernel | Angle Shot | Geometry damage at range 3, with line of sight. |
| Kernel | Shaped Shelter | Protect one hero within 2 hexes against its next hit this round, absorbing up to Geometry damage. |
| Beeswax | Thorn Dart | Science damage at range 3, with line of sight. |
| Beeswax | Shared Remedy | Divide up to Science healing in whole numbers between at most two living heroes within 3 hexes and line of sight. No overhealing or revival. |
| Beeswax | Slipstream | Move a willing other hero within 2 hexes up to ceil(Speed / 2) legal steps; do not consume that hero's movement or action. |

Basic actions: strike an adjacent enemy with the named primary stat, operate the adjacent controls or ring the bell while standing on its tile. Passing an action is permitted. The bell can be rung before the Captain falls; victory requires both conditions.

The optional spark challenge is retained to isolate the change in map/puzzle design: three quarters of 12 sparks enter a beam, one third of those are lost, leaving 6. Declining it gives an ordinary blow; hints and a worked explanation are available. These two reference traces use the correct boost. They do not establish that every mistake or card substitution wins in four rounds.

The unused hand cards above are specified alternatives for discussion. The small demonstration checker exercises the used cards, basic actions and circuit rules, not every unused card. The final app must expose and test the whole hand before this can count as playable content.

## Map contract

Pointy-top axial coordinates `(q,r)`. Start with q = 0–10, r = 0–7. Remove (0,0), (0,1), (0,7), (10,0), (10,6), (10,7). The remaining 82 hexes form an irregular cut-corner field.

- River: q = 5. Northern crossing (5,1) and southern crossing (5,6) are always walkable. Central crossing (5,3) requires Bridge. All other river hexes are impassable water.
- Hedges: (3,5), (4,5), (7,5), (8,0). These block movement and line of sight.
- Controls: (3,3), walkable. Orchard tree: (9,3), blocks movement and line of sight. Bell: (9,4), walkable.
- Shelter courtyard: q = 6–9 and r = 2–4. Shelter affects heroes standing here, not all heroes everywhere.
- Hero starts: Cornix (2,3), Kernel (2,4), Beeswax (2,2).
- Enemy starts: Captain (8,3), Archer (8,1), Sapper (6,1).

For the opening state, a journey from (4,3) to (6,3) takes seven steps around the occupied northern approach, versus two with the central bridge open. The route calculation includes units, not just terrain. The western-to-eastern trip therefore changes with both the mechanism and enemy positions.

The southern route is a genuine traversable connection but is not used by either reference solution. A later balance pass must demonstrate a worthwhile southern-route plan before claiming all of the map's space is equally useful. This is still a layout candidate, not final terrain production.

## Enemies and resolution

Start orchard integrity at 10. Win with positive integrity, Captain defeated and bell rung. Lose at zero integrity, when every hero is down or at the end of round 4 without satisfying victory. There are no rewards specified for this demo; full integrity is an explicit optional performance goal.

At end of round:

1. Apply Roots and Storm damage and Storm's orchard cost. Treat these circuit effects as one resolution batch; do not stop between them to avoid the advertised storm cost.
2. Check loss, then victory. A circuit kill can prevent the Captain's attack, but cannot cancel Storm damage to the orchard.
3. Captain acts, then Archer, then Sapper. Check defeat as soon as a fatal condition occurs. Clear temporary protection and restore movement/actions if another round remains.

**Captain:** 24 health, armour 3, Move 2, Resolve 6. Without Roots, move towards a reachable hex adjacent to a living hero along a shortest legal path, stopping as soon as adjacent. Route ties use the fixed direction order east, south-east, south-west, west, north-west, north-east and stable hero order Cornix, Kernel, Beeswax. Strike the adjacent hero with lowest health for 5, with alphabetical ID breaking health ties. If none is adjacent, scatter thorns at the orchard for 3. Stand Firm redirects either attack to Cornix; its Geometry reduction applies before Shelter.

**Archer:** 6 health, no armour, stationary, range 4, damage 3. Among visible heroes in range, prefer a hero on the northern road (r <= 1), then shortest distance, then alphabetical ID. No target means no shot. It fires in the first round of both traces.

**Sapper:** 6 health, no armour, Move 2. Strike an adjacent hero for 3 instead of moving; stable hero order breaks ties. Otherwise advance towards the controls. If adjacent after movement, switch off one live circuit in order Storm, Roots, Bridge, Shelter. Do not retract an occupied bridge; in that case the attempted shutdown does nothing. The preview names the target circuit. The reference plans deliberately spend Thorn Dart on it before its first turn.

Line of sight follows the straight hex-centre line. Hedges and the orchard tree block intermediate cells; water and units do not. All attacks made in the reference traces were checked for range and line of sight.

## Plan A: bridge and shelter

The player chooses preservation over speed. Solve and activate Shelter and Bridge first.

| Round | Kernel | Beeswax | Cornix | Enemy consequences |
|---|---|---|---|---|
| 1 | Reach controls, Crosswire Bridge+Shelter | Reach northern crossing, Dart kills Sapper | Cross central bridge, Stand Firm | Captain advances and hits Cornix for 1 after both protections; Archer hits Beeswax for 3 |
| 2 | Leave controls, Angle Shot from west bank deals 4 after armour | Flank and defeat Archer with basic Science strike | Boosted blow deals 9 after armour | Captain hits Cornix for 3 through Shelter |
| 3 | Cross bridge and strike Captain for 4 | Join from northern flank and strike for 3 | Strike for 3 | Captain survives on 1 health and hits Cornix for 3 |
| 4 | No required action | Reach and ring eastern bell | Finish Captain with a basic strike | Victory before another enemy phase |

Result: orchard 10/10. Cornix 6/13, Kernel 13/13, Beeswax 13/16. Kernel has physically changed jobs from operator to ranged support to close attacker. Beeswax's flanking route contributes to both removing the Archer and reaching the bell.

## Plan B: roots and storm

The player accepts orchard damage for an earlier finish. Solve Bridge and Roots, then Storm. Kernel remains at the controls.

| Round | Kernel | Beeswax | Cornix | Enemy consequences |
|---|---|---|---|
| 1 | Crosswire Bridge+Roots | Same northern interception of Sapper | Cross the bridge and challenge Captain | Roots deal 2 and stop movement. The redirected thorn attack deals 1 to Cornix; Archer hits Beeswax for 3 |
| 2 | Replace Bridge with Storm, leaving Roots active | Defeat Archer on the northern flank | Move beside Captain; boosted blow deals 9 | Roots+Storm deal 8, orchard falls to 7; Captain hits Cornix for 5 |
| 3 | No required action | Run five steps to the eastern bell and ring it | Basic strike leaves Captain on 2 health | Roots+Storm defeat Captain, orchard falls to 4; victory before enemy attacks |

Result: orchard 4/10. Cornix 7/13, Kernel 13/13, Beeswax 13/16. Kernel has stayed west; the bridge is now shut behind Cornix. This route gains one round and preserves more of Kernel's hand, but sacrifices six orchard integrity. It does not dominate the preservation plan because full-integrity success is a separate visible objective.

## What the comparison proves, and what it does not

Both traces run against the same board, puzzle, characters and enemy rules. There is no hidden retuning for the chosen strategy. They demonstrate a difference in deployment, puzzle outputs, use of Kernel, return-route access and outcome.

Stat consequences are concrete:

- Arithmetic 6 supplies Cornix's damage. Armour subtraction makes intermediate improvements matter more regularly than the old 0/1/2 bands.
- Geometry 7 allows Bridge+Roots in one Crosswire and gives Kernel a 7-power shot. Geometry 4 would not permit even Bridge+Shelter in that action.
- Logic 6 is enough to divert the Resolve-6 Captain's attack. A lower-Logic Guardian needs another opening plan.
- Science 6 defeats the six-health Sapper in one Dart. It also supplies Beeswax's close attack and optional healing budget.
- Speed 7 gives Beeswax six movement. In the control trace the final bell journey takes five steps, which a four-movement hero cannot copy in that turn without another tool.

Remaining limits: the starting squad is still the same in both examples; full role substitution is unproven. The puzzle is fixed, not procedurally generated. Some cards and the southern route are unused. Enemy movement is simple deterministic targeting. The five-minute estimate is unmeasured. These are explicit follow-up design tasks, not reasons to call the candidate complete.

## Verification and review

`node scripts/dev/orchard-locks-demo.cjs` checks the two scripts, paths, movement/action budgets, used cards, range, line of sight, circuit activation load, damage, end-round order and victory. It enumerates the valid 4×4 Sudoku layouts and proves the supplied clues select one solution. It also checks the bridge's opening-state journey change and board count.

The inline diagram is an annotated replay, not free tactical play. Its separate puzzle practice lets Sam solve the actual grid without changing the replay state. It is deliberately a rules diagram rather than an art proposal.

Review the size, the deduction chain and the choice between preservation and speed before authorising implementation. The next useful test is a playable low-art version with the whole hand and unprescribed turns, not another purely scripted victory.
