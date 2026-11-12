# Ten Orchard expeditions from existing assets

Design proposal v0.2, 1 October 2026. Read with `EXPEDITIONS_ASSET_AUDIT_2026_10_01.md`, the positively received `EXPEDITIONS_DEMO_FOUR_LOCKS.md` and `EXPEDITIONS_STATS_ROTATION_AND_FEEDBACK.md`. The latter records Sam's clarified equation-rotation, necessary card-progression, all-stat and player-feedback requirements and takes precedence over earlier weaker wording.

## Recommendation

**Scope update:** Sam subsequently requested a minimum of fifteen different puzzle types,
five per module, with thirty as a stretch goal. See
`EXPEDITIONS_PUZZLE_PORTFOLIO_AND_MAP_VIEW.md` for the current delivery priority and viewport
requirements. The ten Orchard designs below are retained as a content pool: five core
types and five reserves. The earlier Orchard-first delivery sequence is superseded.

There is enough art for ten distinct expedition families. Build five to a high standard first: Four Locks, Turning Ravine, Unequal Crossing, Cider Run and Rootfire Relay. Then complete Hedgejaw Maze, Moonfall, Hollow Bough, Maybe-Flock Roost and First Whistle. The second five each introduce a different mathematical structure; they are not merely alternate maps for the first five.

Each family has five proposed difficulty tiers and procedural layouts within each tier. That gives 50 first-clear prize-credit opportunities if all ten are adopted. A new seed at a cleared tier offers practice and a personal best, not another credit. Sam has chosen a fixed number of stars for each prize credit. The proposed amount is three stars, matching the existing first-clear award; the amount is still a balance proposal.

These are reviewable designs using verified existing files, not implemented or solver-certified scenarios. No new illustration is required for a prototype. Live puzzle geometry, labels, new rules and corrected art wiring are required. Some existing art also needs cleanup and optimisation.

`docs/expeditions/asset-audit-2026-10-01/mission-catalogue.json` gives stable proposed mission IDs and verified existing art references. `node scripts/dev/check-expedition-mission-proposal.cjs` checks those references, mathematical fixtures and the static three-job card-capability example. These checks do not certify full tactical missions or generators.

## Shared experience

- Three heroes, each with a small visible ability hand. Target four or five rounds and approximately five minutes for familiar players. No real-time countdown. Puzzle thinking and tactical planning can take longer on a first attempt.
- Explore roughly the scale of Four Locks: start from 70–100 walkable hexes, three or four connected regions and useful alternative routes. This is a design target to test, not an instruction to pad every map. Concentrate interactions into a few readable decision sites and avoid repeated travel between solved controls.
- One substantial puzzle system per mission, with at most one small linked secondary system. Solving it changes the battlefield. The player still chooses which advantage to spend and where to send the heroes.
- Enemies telegraph destinations, targets and changes. They block, disrupt, steal, rotate or damage something relevant. Defeating, baiting and bypassing must all be useful in at least some seeds.
- Board planning and puzzle editing are free. Committing a mechanism change, moving or using an ability consumes the action cost shown in its preview. Invalid puzzle drafts show the violated rule and consume no action. Valid committed changes can trigger the declared enemy reaction. No guessing penalties or surprise reactions.
- A briefing contains an objective, the next threat, the puzzle's rules and one useful example. Selecting a noun highlights that object. Each mechanism explains its current state, available outputs and cost. Hints progress through observation, deduction and worked help.
- All values and logical constraints are live text or geometry. No generated number painted on a stone is authoritative. Colours always have a second identifier.

The old engine movement/hearts contract and the newer Four Locks demonstration use different formulas. Positive feedback on the scenario does not resolve this conflict. Finalise one global turn, hand, combat and stat contract before certifying these tiers. Do not combine the demonstration's health with the old contract's enemy impact or apply both reward schemes accidentally.

For planning, retain the demonstration's two actions per hero per round and its larger movement scale. Hand proposal: four visible ability cards per hero, comprising two discipline tools, one role tool and one signature. Each starts ready, costs one action and exhausts until the mission ends unless explicitly labelled otherwise. Move, ordinary interaction and basic Strike remain available outside the hand. This gives genuine decisions about spending powerful tools without an extra deck-drawing system. Exact strengths and signatures belong in the agreed global contract.

## The ten mission packets

### 1. The Orchard of Four Locks: deduction and selective power

**Player brief:** “Solve the orchard ledger. Only two circuits can run: choose how to stop the Captain and reach the bell.”

Retain the demonstrated 4×4 Sudoku with linked sums, river crossings and four outputs. Extend the generator around the demonstrated puzzle and both verified traces rather than replacing them with a generic number grid. Existing art: Hive Ledger board, corruption and solved cell; living gates; tally arch as bell; root barrier; wind/storm effects. Use Hookmole for the Captain, Scruffcrow for the ranged pest and Strawling for a root saboteur, with explicit art IDs.

**Decision:** bridge plus shelter brings the party together safely; roots plus storm creates a faster remote-control plan with orchard damage. Later variants change which pairs are affordable, where each circuit acts and which enemy can disrupt the terminal. A correct grid must not automatically activate every benefit.

**Generation:** start from a solved 4×4 Latin/Sudoku grid, permute valid symbols/rows/columns, then remove clues and add connected sum cages. Accept only one solution. Generate at least two valid circuit selections and different route costs. Keep the terminal reachable without the powered central bridge. The demonstration's exact grid remains a fallback reference, not a procedural certificate.

**Tier escalation:** T1 has a compact forced chain and one active disruptor; T2 has the demonstrated linked sums and two threats; T3 adds interdependent cages and a damaged circuit to repair; T4 has two exposed operating sites and incompatible useful outputs; T5 requires three heroes to hold separate jobs while a final circuit switch creates the strike window. All puzzles remain 4×4; difficulty grows through inference and tactical dependency rather than huge grids.

**Card difference:** Logic protects committed deductions against corruption; Geometry controls more than one output; Science holds an exposed circuit; Speed reaches a distant site; Arithmetic governs the visible circuit budget. A Logic tool may reveal a relation or protect a row, but it must not simply solve the whole puzzle.

### 2. The Turning Ravine: rotating numbers and operators

**Player brief:** “Turn the numbers and operators to make the bridge equations true. One number can change several equations.”

Use current-turner hexes, operator-wheel states, timber/stone bridges, wind dial, safe alcove and the wind-ravine background. Numbers, operators, equation links and targets are live overlays. Crosswind rewinds a forecast wheel; Hookmole jams a turning station.

**Puzzle:** rotate six to nine number/operator wheels to satisfy coupled equations. A shared wheel changes two or more equations. The checked teaching fixture in the requirements supplement has `A O B = 24`, `B + C = 11` and `C − A = 1`, with the unique effective solution A = 4, B = 6, C = 5 and O = ×. Full missions add dependencies and selective output budgets. Completing equations powers crossings, shelter or traps; the player still chooses the active configuration and tactical route.

**Generation:** construct a solved equation network, derive targets and legal wheel faces, then scramble orientations. Validate effective number/operator assignments separately from equivalent duplicate-face orientations. Wind affects specified wheels, never a hidden random tile. Reject independent one-equation exercises disguised as a linked puzzle. Validate route consequences, action costs and lower/target team feasibility separately.

**Tier escalation:** T1 rotating numbers with fixed operators; T2 coupled equations and a rotating operator; T3 shared sector values and a limited output budget; T4 separated controls and a declared rewind; T5 simultaneous calibration, bracing and stabilisation to create a strike window.

**Card difference:** Arithmetic supplies calibration capacity, Geometry braces/manipulates the wheels, Logic locks the shared configuration, Science prevents a rewind or repairs the stream and Speed reaches the exposed station. Roles change the cost/positioning of these actions. High stats never make a false equation true.

### 3. The Unequal Crossing: partition and limited weighing

**Player brief:** “Set both platforms to the same weight and keep them balanced until the gate opens.”

Use the six-state balance platform, number-load states, one-hex scale, burrow and Hookmole. Numbers are allocated at a nearby control, not carried one tile at a time. The board contains two distant balance stations and a burrow shortcut.

**Puzzle:** assign visible values to left, right or reserve. Respect the target total, a capacity limit and a condition such as “the two largest cannot share a pan”. At higher tiers one load has a hidden weight drawn from a visible small candidate set; comparison results allow deduction. Require a unique hidden value, but accept every legal allocation. A fixture could use 1, 2, 3, 4, 5 and 7: 7+4 balances 5+3+2+1 at 11 per pan.

**Decision:** hold a defended balance for two phases or open the burrow and eliminate the thief before committing. A thief targets the highest unsecured pan value, with deterministic ties. Guarding a pan can be preferable to attacking.

**Generation:** produce a valid partition first, derive capacities and optional exclusions, then enumerate all allocations and permitted comparison trees. Reject a hidden-value puzzle if the allowed weighings cannot identify it. Enemy timing must allow at least one committed balance to survive.

**Tier escalation:** T1 open values; T2 reserve values and pan capacities; T3 one unknown with two informative comparisons; T4 separated simultaneous balances; T5 an inferred weight and simultaneous holding under theft pressure. Do not add more than six loads merely to increase arithmetic workload.

**Card difference:** Arithmetic provides safe pan capacity, Logic protects a recorded comparison, Geometry redistributes loads at range, Guardians secure a pan and Science repairs a cracked scale. No hero changes the truth of the balance equation.

### 4. The Cider Run: flow, conservation and operations

**Player brief:** “Send the right amounts to both harvest gates. Every apple must be accounted for.”

Use cider press, baskets, feeder/target gates, operator-wheel states, live arrows and the cider-lane background. Scruffcrow steals from the next unguarded output; Hookmole can jam an operator.

**Puzzle:** choose a splitter allocation and operators so two sinks meet exact demands, total output equals source plus explicitly shown transformations and no edge exceeds capacity. Only whole-number flows are allowed. Example fixture: source 18; left gains 2 and must finish at 10, right loses 2 and must finish at 8; the unique split is 8 left and 10 right. Later puzzles link two splitters or an intermediate tank.

**Decision:** run a short exposed channel and guard its vulnerable output, or store a batch in a safe tank and spend an extra phase. Operators occupy budget slots; the player cannot install every helpful operation simultaneously. Once solved, preview each batch and enemy theft before sending it.

**Generation:** generate valid integer flows, derive demands, scramble eligible operations and enumerate the resulting system. Reject negative flow, fractional Primary answers, unbounded loops and all seeds where guarding is irrelevant.

**Tier escalation:** T1 one split with one transform; T2 two capacities; T3 a shared intermediate tank; T4 two output windows and a competing repair; T5 split, store and release while all three heroes service separate vulnerable sites.

**Card difference:** Arithmetic increases batch capacity, Science stabilises a leaking edge, Geometry reroutes, Logic locks the selected operation against a jam and Speed intercepts the crow. The correct mathematical flow remains necessary at every tier.

### 5. Rootfire Relay: parity, networks and resource allocation

**Player brief:** “Carry the root signal to both trees. Change its parity only where the roots allow it.”

Use rootfire nodes, source fruit, bridge-root link, signal network, parity/pulse effects and Strawling. The illustrated links decorate a graph drawn from actual hex adjacency, not an arbitrary texture.

**Puzzle:** select a connected network from one source to two sinks. Each edge has a cost; marked nodes flip odd/even state. Each sink requires a specified parity and the total chosen-edge cost must fit a budget. Branches may share a trunk, so two separately shortest routes are not necessarily the cheapest combined network. Example path starting odd and crossing two flip nodes ends odd; crossing one ends even.

**Decision:** use a cheap shared trunk and protect its vulnerable junction, or spend more root energy on independent paths. Strawling corrupts the cheapest exposed active junction according to a shown tie rule.

**Generation:** generate a graph with at least one branching solution and two structurally different feasible networks, then assign cost/parity constraints. Validate parity along each source-to-sink path and reject ambiguous cycles unless the rule explicitly resolves them. Prefer a tree or acyclic directed graph for the first version.

**Tier escalation:** T1 one sink and one flip; T2 two sinks and a shared trunk; T3 competing budgets; T4 corruption plus a science hold; T5 separated simultaneous relays whose protected path and strike route conflict.

**Card difference:** Science holds nodes, Geometry reconnects a displaced edge, Arithmetic extends an explicit energy budget, Logic predicts the corruption rule and Speed reaches the far relay. Adjacent support costs positioning, so a single exceptional card cannot cover three sites.

### 6. Hedgejaw Maze: route constraints and optimisation

**Player brief:** “Find a route that obeys every gate rule. The shortest path is not always safe.”

Use hedge/path/stone terrain, gates, number stones with live labels and Hedgejaw or Hookmole as a moving blocker. Prefer illustrated stones/gates with live symbols over the schematic placeholder SVGs for the eventual screen.

**Puzzle:** select a route with a finite-state rule: visit numbered checkpoints in a required order, use exactly two eastward edges and finish with an even running total. State the directions with icons and words. Find a qualifying route within a step budget, then decide how to execute it with the moving enemy. Example route totals 2+5+3=10 and satisfies even arrival; a shorter 2+5 route does not.

**Generation:** solve the product graph of location, visited checkpoints, directional count and running-total parity. Place a second legal route that has different danger exposure. Avoid long traversal tasks: the selected route opens a gate or establishes a fast movement corridor.

**Tier escalation:** add order, direction, parity, then an enemy-dependent detour across T1–T4; T5 requires one hero to hold the moving hedge open while two traverse different constrained corridors.

**Card difference:** Speed changes reachable windows, Logic can preserve a gate condition, Geometry creates an allowed detour and a Mover displaces the blocker. A shortcut still obeys the printed route constraint.

### 7. Murder at Moonfall: edge-count loops and containment

**Player brief:** “Close one unbroken ring around the founding stone before the crows escape.”

Use ring stones, ring gap, containment effect, founding stone, Crow Swarm and Crowbreaker. This is an edge puzzle on a small marked patch within a larger tactical board, not repeated stone delivery.

**Puzzle:** select board edges to make exactly one non-self-intersecting closed loop. Each marked hex states how many of its six boundary edges belong to the loop; unmarked cells impose no count. At every loop vertex, selected degree is zero or two. Enclose the founding stone and exclude the burrow. A single hex ring has six selected edges and satisfies a centre clue of six; this is a teaching fixture, not a full mission.

**Decision:** a compact ring is cheap to hold but concentrates crow pressure; a wider ring shelters a firing position but requires a distant anchor. Closing the ring pins the Swarm for a decisive combat phase. Do not require killing every enemy.

**Generation:** derive clues from an authored legal loop, remove clues only while preserving a unique puzzle solution or explicitly accepting multiple legal loops. Check connectedness, degree, inside/outside and reachable anchors independently. Never infer enclosure from a decorative circular sprite.

**Tier escalation:** introduce more useful missing clues, an exclusion region, exposed anchors, then simultaneous ring maintenance. Keep the active loop patch small enough to reason about in minutes.

**Card difference:** Geometry holds longer ring sections, Logic protects an anchor rule, Science restores an interrupted section and Scouts mark a trapped target. Crowbreaker can fade on defeat; no absent defeated sprite is required.

### 8. The Hollow Bough: shape packing and changing shelter

**Player brief:** “Fit the living branches into the clearing. Leave room for the party before the roots fall.”

Use living branches, root barrier, memorial hex, root-fall marker and overgrowth forecast/damage effects. Strawling represents the advancing overgrowth. Shapes and footprints are crisp live polygons; a stretched branch illustration must not determine legality.

**Puzzle:** place three connected polyhex pieces, permitting the stated rotations and reflections, into a marked shelter region without overlap. Cover compulsory sockets while leaving three accessible hero spaces. The next root-fall forecast removes specified cells. The accepted packing must survive that removal or contain a deliberate repair plan.

**Decision:** spread shelter protects separate operating positions; compact shelter is easy to defend but cannot cover both far objectives. Geometry moves a placed piece; Science stabilises an exposed cell; the enemy grows towards the largest unprotected cluster.

**Generation:** build a legal packing and derive a region/forecast, then enumerate accepted piece transforms. Check free-space connectivity and movement access as well as mathematical packing. Include at least two tactically different accepted packings rather than claiming every tiling puzzle must be unique.

**Tier escalation:** T1 rotation of two pieces; T2 three pieces; T3 blocked cells; T4 a two-phase root forecast; T5 separated shelter jobs with a limited repair and simultaneous final hold. Do not increase puzzle size simply by adding pieces.

**Card difference:** Geometry is placement reach/capacity, Science is shelter durability, Speed beats the advancing front and Guardian protection buys a phase. Strong cards can sustain a risky packing but cannot overlap pieces or cover forbidden cells.

### 9. Maybe-Flock Roost: nonogram deduction and target selection

**Player brief:** “Read the roost clues. Find the real nests, then aim the whistle without waking every bird.”

Use Maybe-Finch v2, whistle tower, wind dial, ledger frame and storm-front/beam effects. A live 5×5 square deduction panel sits at the tower; the tactical field remains hexagonal.

**Puzzle:** row/column clues give lengths of filled nest groups, separated by at least one empty cell. Generate a unique 5×5 pattern. A teaching cross pattern has row and column clues 1, 1, 5, 1, 1 and its filled cells in the centre row/column. Full missions require less obvious generated patterns. Solved nests map to labelled perch hexes.

**Decision:** only two whistle beams can be powered. Choose which confirmed nest clusters to scatter, which to contain with a hero and which to avoid. Logic reveals a targeting condition or protects a solved row, not all nests. Bird intention is visible even before the panel is complete; deduction controls safe outputs rather than hiding surprise damage.

**Generation:** enumerate line candidates, count complete-board solutions and reject guesses-only teaching seeds. Map nests to distinct reachable perch groups and reject seeds where one beam trivially covers every relevant bird.

**Tier escalation:** T1 short single-run clues; T2 split runs; T3 linked line deductions; T4 competing beam directions and two roost groups; T5 three separated nests with only two powered beams and an active enemy response.

**Card difference:** Logic anchors deduction, Arithmetic supplies beam budget, Geometry changes beam orientation, Science maintains the whistle and Speed handles the uncovered nest. No colouring-in points or nest pickup objective.

### 10. The First Whistle: schedules and synchronised strike windows

**Player brief:** “Make the three branches sing together. The Root's shield opens only on the shared beat.”

Use founding stone, branch ports, signal-root network, shield/vulnerability effects and Hookmole as First Root. All timing is round/beat based and previewed; no reflex input is required.

**Puzzle:** choose allowed starting offsets for two periodic signals and a delayed branch so their next pulses coincide within the visible planning horizon. Whole-number beats only. Example: one signal at 1, 4, 7, 10 and another at 2, 6, 10 meet at beat 10. The player can pay a reroute cost to shorten a branch delay and create a different shared beat. The correct schedule opens the shield for one explicitly stated phase.

**Decision:** protect the cheap late schedule through an extra enemy phase, or spend scarce hand abilities to align earlier and place an attacker before the shield opens. A hero committed to a branch cannot also contribute adjacent strike support across the map.

**Generation:** enumerate finite pulse sets and permitted offset/delay choices. Require at least two viable schedules with different phase costs and a reachable strike position. Reject horizons that require waiting several empty rounds; represent beats within a round and cap the mission at the same four/five-round target.

**Tier escalation:** T1 align two branches; T2 add a delay; T3 choose between two timing windows; T4 a branch interruption forces a declared reschedule; T5 hold three jobs and build a supported strike in the shared window. This remains scheduling/number-pattern reasoning rather than another rotating-path map.

**Card difference:** Arithmetic handles pulse/offset capacity, Science holds a signal, Logic protects the schedule, Geometry shortens a declared branch and Speed reaches the strike position. A high-stat attacker cannot hurt the shielded Root.

## Difficulty and meaningful collection progression

Use five tiers per mission, independently unlocked in order by clearing the previous tier. T1 is available across all ten; learning one puzzle family must not require finishing an unrelated puzzle family. A harder tier has fixed requirements for its seed; it must not scale down to whichever party the player selects. Rarity remains advice rather than an entry lock.

| Tier | Collection guidance | Dominant specialist checks | Concurrent jobs | Pressure change |
|---|---|---|---:|---|
| 1: Fieldwork | Useful Common specialists | 4–5; individual Science/Speed checks may be 6 | 1 main job plus a supporting choice | One meaningful disruptor, generous recovery |
| 2: Entangled | Uncommon-led party | 6–7 | 2 | One system can fail while another is serviced |
| 3: Contested | Rare-led party | 7–8 | 2 plus a short interruption | More expensive repairs, competing positioning |
| 4: Besieged | Epic-led party | 8–9 | 3 | Separated pressure sites and limited hand recovery |
| 5: Masterwork | Strong complementary Epic party; Legendary helps | 9, or 8 plus an explicitly earned one-point fixture bonus | 3 with a shared final window | Fixed simultaneous demands; no new hidden rules |

These are capability targets, not ten identical stat gates. Each packet picks two to four main pressure lanes and its own three jobs, while retaining consequential uses of all five stats for every hero. Do not require every statistic on every hero to reach nine, a specific named card or three copies of one role. Supply target-band wins and a valid lower-band infeasibility certificate for harder tiers. The final numerical enemy thresholds depend on the agreed combat scale.

Real Orchard card values support the intended bands. Stat order below is Arithmetic, Geometry, Logic, Science and Speed:

| Card | Rarity / role | Stats | Concrete capability distinction |
|---|---|---|---|
| Bushel | Common Guardian | 5,1,2,3,2 | Numerical load capacity 5 |
| Russet | Common Mover | 2,6,2,2,1 | Geometry 6 but poor reach |
| Tuppence | Common Guardian | 4,1,4,2,2 | Best base Common Logic is 4 |
| Cornix | Uncommon Guardian | 6,2,6,3,4 | Logic 6 reaches a check no unsupported Common can meet |
| Kernel | Uncommon Reckoner | 6,7,3,3,2 | Geometry 7 opens multi-output/rotation options |
| Beeswax | Uncommon Mender | 2,2,4,6,7 | Science and fast support; not a strong attacker in every discipline |
| Barrow | Rare Mover | 7,4,8,3,3 | Logic 8 changes difficult constraint-control plans |
| Cobweb | Rare Scout | 5,8,4,4,4 | Geometry 8 with ranged support |
| Amberly | Rare Mender | 4,4,7,6,4 | Logic support plus recovery |
| Gossamer | Epic Guardian | 5,9,6,6,8 | Geometry 9 and Speed 8 at an exposed far station |
| Harvestmoon | Epic Reckoner | 6,6,8,8,6 | Logic/Science 8, flexible but weaker in Arithmetic/Geometry |
| Longshadow | Epic Mender | 6,6,7,8,7 | Science 8 recovery with fast access |
| Ninebark | Epic Mover | 8,7,9,6,4 | Logic 9 without requiring Legendary ownership |
| Cascade | Epic Guardian | 8,6,6,9,5 | Science 9 but cannot also be the Logic specialist |

Example numerical distinctions: a Geometry-8 hold is unavailable to unsupported Kernel (7) but available to Cobweb (8); a Logic-9 lock is available to Ninebark (9), or to Harvestmoon (8) after earning a local +1 fixture. Gossamer (Geometry 9), Ninebark (Logic 9) and Cascade (Science 9) can cover three different simultaneous specialist jobs with a full Epic party. That is a feasibility example, not proof that this party wins every mission.

Common cards already reach Geometry 6, Science 7 and Speed 7. Therefore “threshold 6 everywhere” cannot produce meaningful progression. Logic, Arithmetic, action economy, exposed positions and simultaneous obligations must matter. Optional supporting bonuses must be capped and local. A permanent global +3 would erase most of these distinctions.

Every printed stat needs a proportional application, not only a rounded derived value: Arithmetic as operation/load capacity, Geometry as shape/brace capacity, Logic as protected deductions/rule-control capacity, Science as repair/stabilisation strength and Speed as Dash/relay capacity as well as ordinary movement. Preview the exact stat, cost, bonus and effect. Lower-stat cards can still perform the basic action but cannot silently receive the stronger specialised effect.

Roles must alter action economy: Guardian holds an object against disruption; Mender repairs or restores; Reckoner changes a permitted operation/orientation; Mover displaces an enemy/obstruction; Scout marks for ranged support. These effects still need exact final hand definitions, duration, range and caps. A role must never bypass puzzle validity. No stat check substitutes for player deduction.

## Procedural generation contract

Use authored encounter grammars, not random scattering. Each family has at least three region templates: forked river, terraced grove, looping hedge or other suitable silhouettes. Seed changes must affect chokepoints, branch distances, route exposure, puzzle dependencies or enemy interaction. Palette changes, reflected coordinates and changed numbers alone do not count as new tactical layouts.

Proposed generation order:

1. Pick mission family, tier, rules version, generator version and seed before squad selection.
2. Generate region graph and routes with distinct trade-offs. Embed it in axial hex coordinates.
3. Construct a solved mathematical state, derive clues and scramble only legal states.
4. Place controls, enemies and objectives from declared pressure relationships.
5. Run the family puzzle validator: uniqueness only for deduction; enumerate accepted solutions for allocation/packing/optimisation where multiple answers are deliberate.
6. Search or replay a complete legal tactical trace with a declared target-band real squad. Check enemy changes, movement, hands, costs and final victory timing, not just puzzle completion.
7. Demonstrate a second target-band plan/squad and establish why the lower capability band cannot meet the mandatory demands, including all permitted support and upgrades. A weak reference trace losing is not an infeasibility certificate.
8. Reject failed candidates with a bounded retry count. Return a certified authored fallback for that family/tier on exhaustion. Never silently lower the selected difficulty.

Store `{missionId, tier, seed, rulesVersion, generatorVersion, blueprintVersion}`. Save the generated blueprint with an interrupted run so an update cannot change the board beneath the player. Randomness is confined to generation, not hidden enemy rolls.

Acceptance corpus proposal: 100 fixed seeds per family/tier, all producing a puzzle-valid board or explicit certified fallback. Run target-squad traces on every accepted seed. Record solve time, search limits, fallback count, reachable area, route separation, puzzle deductions and distinct structural fingerprints. For each tier/family, manually inspect at least five seeds and play two materially different plans through the real UI. A search timeout is not evidence of mathematical impossibility.

Harder tiers must require stronger feasible teams, not merely make weaker parties less convenient. Enumerate roster-to-job assignments where checks permit it; otherwise search legal play or derive sound resource/reach bounds. A timeout is unknown, not proof of impossibility. Revise or reject uncertified seeds. Exact methods and comparison bands are specified in `EXPEDITIONS_STATS_ROTATION_AND_FEEDBACK.md`.

## Prize credit and persistence

User decisions: clearing a new difficulty awards prize credit, and that credit represents a fixed number of stars. Proposed implementation: each first verified win of a mission/tier awards three stars, including T1. Ten missions × five tiers gives 50 awards and 150 stars per profile/module. Through the existing 20-star pack conversion, that is seven packs plus ten stars from a zero starting balance. Five core families give 25 awards and 75 stars. Three stars is the proposed fixed amount, not an agreed new exchange rate. There is no separate currency or redemption shop.

Reward identity is stable: `primary:<missionId>:<tier>`. Seed, build date and blueprint version are not part of this identity. Replays, new seeds, retries, losses, duplicate callbacks and app resumes award zero additional credits for a cleared tier. Higher tiers unlock sequentially; there is no implied reward for an unplayed lower tier.

Proposed stored state:

```js
expeditions: {
  rewardSchemaVersion: 2,
  tierStarAwards: {
    // 'primary:four-locks:2': { runId, seed, rulesVersion, awardedAt }
  },
  missionTiers: {
    // 'primary:four-locks': { highestClearedTier: 2, tiers: { ... } }
  },
  activeRun: null
}
```

Treat this as a proposed shape to reconcile with the existing profile/module storage, not a migration to apply now. Each award record also stores `starsAwarded: 3`. The authoritative progress reducer verifies the completed run, sets its tier-clear record and adds three stars through the existing pack conversion in one state update. Every write still goes through App's `setProgress`; no direct component storage writes. A crash or duplicate completion event must not record a clear without its award or grant the award twice.

The existing reducer awards three stars for a first scenario clear, one for replay and a module-set Reveal token. Proposed new tiered missions use the three-star tier award as their first-clear reward, rather than adding another three-star scenario award. Replays of a cleared tier receive no new stars under this proposal. Legacy rewards already earned remain. The module-set Reveal rule must be explicitly retained or retired when the final progression contract is agreed. Do not silently change old unrelated scenarios.

Old completion flags are historical accomplishments, not certified new-tier wins. Migration preserves them and their rewards but does not create new tier star awards. Corrections to art, solver or rules never reset the award ledger. A renamed display title keeps the mission ID. Explicitly replacing a family would require a product decision about a new reward identity.

Normal hints and worked help do not disqualify a child from the tier reward. Developer cheats or invalid imported run state cannot produce a certified win. Interrupted/resumed valid runs remain eligible. Prize credit is offline local progress; the app does not need a server or AI runtime.

## Delivery after design agreement

1. Reconcile global formulas, hand rules, round ordering, reward currency and existing contracts. Record the decision in the master brief and handover; preserve the exact private gate.
2. Optimise/clean the selected shared art and define state/anchor bindings. Do not import the whole candidate directory.
3. Implement Four Locks as the first complete vertical slice with reference seed, two UI-executed plans and stronger/weaker real-card evidence.
4. Implement independent puzzle validators before procedural wrappers for Turning Ravine, Unequal Crossing, Cider Run and Rootfire Relay.
5. Certify the five core families and their tier progression before adding the remaining five.
6. Expand to ten only when the later five pass the same distinctness, pacing and stat-value tests. If two families converge in actual play, merge them rather than protecting the number ten.

Each development packet must name owned files, frozen interfaces, exact example input/output, acceptance commands, trace evidence and allowed asset paths. Lower-powered agents implement a settled packet; they must not invent missing puzzle rules or rewards. Claude/ChatGPT coordination uses one shared backlog and a single writer per shared file. No development tasks have been dispatched by this proposal.

## Review gates

Before calling any family ready: valid mathematical examples, complete deterministic enemy rules, actual hand definitions, a reference seed, two different legal tactical plans, meaningful real-card comparisons, bounded procedural generation, reward-idempotence checks and child playtests. Five-minute pacing must be observed with familiar players rather than inferred from round count. For safety, the private development gate remains unchanged until a separate release decision.
