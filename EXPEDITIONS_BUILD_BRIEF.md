# Wallaby Maths Expeditions

> Central entry point: read `EXPEDITIONS_MASTER_BRIEF.md` first. The current scenario
> experience direction and per-map asset allocation live in the experience/art brief and
> scenario art matrix. Earlier scenario wording in this document is historical where it
> conflicts with those later documents.

## Full production build brief

Status: pre-production concept with a developer-only Ninefold Orchard prototype.

Engineering handover, staged delivery plan, maintenance requirements and acceptance tests are in `EXPEDITIONS_CLAUDE_HANDOVER.md`.

Release rule: Expeditions must not be visible to an ordinary profile until a separate release decision is made. During development, only the exact `eudaimon` profile using the Rooke avatar may see the home tile or enter the prototype.

## 1. Product proposition

Expeditions is a collection-powered tactical puzzle game played on a small illustrated hex board. A player chooses three to five characters from their cards, reads a mathematical situation and solves it through movement, positioning, interaction and occasional combat.

It is not a replacement for Adventures.

- Adventures remain narrative journeys that upgrade individual cards.
- Joey remains the card-battle mode built around deck construction.
- Expeditions becomes the short graphical mode that makes card statistics matter spatially.

The intended play session is close to five minutes. Ten minutes is a hard failure of scenario design except for an explicitly labelled multi-part finale.

## 2. Design pillars

### The board is the question

Mathematics should live in positions, routes, quantities, shapes, weights and constraints. A child should be able to point at the problem on the battlefield. Long question panels should not interrupt the tactical play.

### Combat is one verb, not the purpose

Some maps are battles. Most use enemies as moving constraints. A Hookmole threatens a numbered load. A Fogling breaks a network. A Clerk Drone closes a graph edge. Defeating it may help, but a stronger plan can often work around it.

### Cards create different solutions

A high-Speed character reaches a remote switch. A high-Geometry character moves an awkward object. A Logic character exposes a conditional enemy action. The same scenario should allow several squads, with different action budgets and risks.

### Complexity means richer decisions, not longer sessions

Ninefold Orchard is concrete and visible. Little Reckoning combines two rules. Gifford uses interacting constraints, uncertainty and optimisation. The round count remains tight across all three.

### Failure must be legible

The game states what changed and why the objective failed. It then offers immediate replay, preserving the player's squad and showing one useful observation without giving away the solution.

## 3. Audience scaling

Difficulty has two separate axes and both must rise:

1. **Collection difficulty within a module:** missions 1 to 10 demand progressively stronger cards. A few Uncommon cards should make the opening missions comfortable. Missions 9 and 10 are tuned so that every deployed card should be Epic or Legendary.
2. **Mathematical difficulty across modules:** a Gifford mission is not a Ninefold Orchard puzzle with larger numbers. It uses older concepts, more interacting constraints and less scaffolding while keeping the session short.

| Dimension | Ninefold Orchard, ages 8 to 11 | Little Reckoning, ages 10 to 13 | Gifford, ages 12 to 16 |
|---|---|---|---|
| Squad | 3 characters | 3 characters | 4 normally, selected maps 3 or 5 |
| Typical board | 25 to 39 hexes | 31 to 49 hexes | 37 to 61 hexes |
| Round budget | 4 | 5 | 5, occasionally 6 |
| Main conditions | 1 | 2 linked | 2 or 3 interacting |
| Values | Whole numbers, usually 0 to 20 | Integers, fractions, ratios, bounds and simple algebra | Algebra, percentages, inequalities, weighted graphs and optimisation |
| Enemy intent | Fully visible before acting | Revealed after the first action, or by Logic | May be conditional or partially concealed |
| Information | Concrete objects and exact totals | Symbols plus concrete state | Symbolic state, forecasts and trade-offs |
| Undo | Available until the enemy phase | Available until new information appears | Available until hidden information or a reaction resolves |
| Guidance | Relevant objects and legal destinations highlighted | Highlights available on request | No solution-directed highlight on first attempt |
| Expected first-clear rate | 70 to 85 per cent | 60 to 75 per cent | 50 to 65 per cent |

### Ninefold Orchard progression

Levels 1 to 3 teach one board verb at a time: balance, exact total and capacity. Levels 4 to 6 combine ordering, holding and grouping with visible interference. Levels 7 to 10 introduce larger structures such as rings, row constraints and networks, but each still has one plainly worded win condition.

The child should never need to infer an unstated rule. If an enemy will change a 5 to a 4, the intent panel must say so and preview the affected object.

### Little Reckoning progression

Levels 1 to 3 introduce symbolic manipulation, estimation and reversible sequences. Levels 4 to 6 make geometry and networks active board systems. Levels 7 to 10 combine route planning, zero, congruence and partition constraints.

At this tier the first obvious move may be inefficient, but it must not be a trap that makes the map unwinnable without warning. The consequence preview should identify irreversible actions.

### Gifford progression

Levels 1 to 3 establish scheduling, weighted routes and linked constraints. Levels 4 to 6 require equivalence, multi-variable balance and graph design. Levels 7 to 10 add percentage systems, combat with a mathematical control condition, deduction and minimax routing.

Gifford can ask the player to decide what to sacrifice. It must still present all formal rules precisely. Difficulty should come from reasoning about them, never from vague prose or tiny interface text.

### 3.1 Collection-power progression

**Corrected 2026-09-14: readiness is advisory, not a gate.** Every expedition displays a five-notch readiness meter before squad selection, and the notches are Starter, Uncommon, Rare, Epic and Masterwork, but the meter is guidance only. Embark is always available, for any squad, on any mission. A squad below the recommendation can still attempt — and, with luck or skilful play, clear — the mission; nothing pre-checks or refuses the attempt. What actually makes an underpowered squad struggle is the mission itself: fixed enemy defence, hearts and damage do not scale down for a weak squad, so a low-stat squad's strikes fail to land and its heroes get overwhelmed on the mission's own terms, not turned away at the door. The final two missions visibly recommend the Epic notch.

The system uses the cards' real battle values and statistics, not the rarity label alone. Rarity supplies a transparent floor and the statistics indicate whether the squad is well-suited to the particular jobs on the map.

| Missions | Expected collection | Recommended average battle value per deployed card | Individual-card guidance | Design consequence |
|---|---|---:|---|---|
| 1 to 2 | Commons with a few Uncommons | 12 | None | An early collection can learn the verbs and win |
| 3 to 4 | Uncommon-heavy with one useful specialist | 16 | At least two cards Uncommon or better | Positioning matters more than raw force |
| 5 to 6 | Rare-heavy | 22 | At least two cards Rare or better | Two specialist checks must be covered |
| 7 to 8 | Rare and Epic mixture | 28 | At least one Epic and no Common cards | Enemies and objectives create linked pressure |
| 9 | Full Epic squad | 32 | Every deployed card Epic or Legendary | Three simultaneous jobs prevent one strong card carrying weak cards |
| 10 | Strong full Epic squad | 34 | Every deployed card Epic or Legendary | Finale combines the module's signature mechanisms |

Legendary cards count as Epic or better. Boss Commanders occupy a separate support slot and never count toward a deployed-card recommendation.

The recommended average applies to the complete squad: three cards in Ninefold Orchard and Little Reckoning, normally four in Gifford. A mission may add clearly stated specialist guidance such as Geometry 7 for a rotating bridge or Logic 8 for a concealed rule. It may not add a hidden statistic check after the player embarks — any consequence of an underpowered squad must come from the mission's own visible rules, never a surprise condition revealed only after commitment.

Late expeditions lean on three design consequences so a single Legendary card cannot carry two weak cards through sheer luck:

- Every deployed card is recommended to meet the Epic rarity floor
- Separate stations require different characters to act during the same round
- Enemy pressure creates a minimum movement, defence or support requirement alongside the mathematical objective

When the squad is below the recommendation, Embark remains enabled and the game states exactly what is recommended, phrased as guidance rather than a refusal. It should say, for example, `Recommended: all 3 field cards Epic or Legendary` and `Recommended: one Geometry score of 7+`. The child should never spend five minutes wondering why they cannot even start — they can always start, and the interesting discovery is finding out, through play, why the recommendation exists.

### 3.2 Mathematical progression across modules

| Pattern | Ninefold Orchard | Little Reckoning | Gifford |
|---|---|---|---|
| Operator route | Whole-number `+`, `−`, `×2` and exact `÷2`; one target | Integers, fractions, operation order and two linked targets | Algebraic functions, inverse operations and composition where a route must work generally |
| Number placement | Mini Latin patterns, exact row totals and simple parity | Four-by-four Latin or cage constraints with factors and signed values | Simultaneous row, column, parity, inequality and algebraic clues with a unique solution |
| Balance | Equal whole-number totals | Ratios, fractions or bounded estimates | Several linked ratios, percentage change or algebraic equivalence |
| Route planning | Ordered multiples and capacities | Recurrences, weighted routes and set membership | Dynamic edge weights, scheduling dependencies and minimax routes |
| Combat maths | Compare attack and defence, count support | Hit only when an estimate or interval condition is valid | Control a changing median, satisfy an inequality or choose an optimal target under reactions |
| Information | Everything visible with previews | One layer may be revealed or changed | Conditional intentions, deductions and trade-offs, always governed by explicit rules |

The same physical verbs recur so the player does not relearn the interface. What changes is the mathematical object being manipulated and the number of consequences that must be held in mind.

## 4. Session structure

1. Expedition map: choose one of ten missions.
2. Briefing: one sentence states the win condition, then visual callouts show relevant objects.
3. Squad selection: choose legal owned characters and an optional Commander where permitted.
4. Deployment: fixed starts in 9FO, a small start zone in LR and a meaningful deployment choice in GF.
5. Player round: spend two action points per active character in any order.
6. Enemy round: resolve visible intentions quickly and deterministically.
7. Completion: show the mathematical state that satisfied or failed the objective.
8. Replay: retain squad, show optional performance marks and generate a fresh variant where allowed.

Target timings:

| Stage | Target time |
|---|---:|
| Briefing | 10 to 20 seconds |
| Squad selection | 15 to 30 seconds |
| Player decisions | 3 to 4 minutes |
| Enemy animation | 20 to 35 seconds total |
| Result and replay | 10 to 20 seconds |

## 5. Battlefield rules

The board uses pointy-topped axial hex coordinates. Each hex records terrain, height, objective membership, printed value and any occupying figure or object.

Standard terrain:

- Clear: movement cost one
- Difficult: movement cost two unless ignored by Sure-footed
- Blocked: cannot be entered or crossed
- Hazard: enter normally, then resolve its visible rule
- Mechanism: a scenario-owned tile such as a scale, switch, rail or valve

Figures cannot end movement on the same hex. Objects normally block movement but may share a hex with the character carrying or placing them. The route preview must show the full path and movement cost before confirmation.

## 6. Turn and action economy

Each field character begins a round with two action points. The player may alternate freely between characters.

Core actions:

- Move up to the character's allowance
- Interact with an adjacent object or mechanism
- Collect or place a portable object
- Strike a legal enemy
- Use the character's role action
- Use one equipped discipline action

Ending the round discards unused action points. There is no action-card hand, rest cycle or card exhaustion system.

This produces six player actions per round in 9FO and LR, normally eight in GF. A scenario's essential solution must consume no more than eighty-five per cent of the total action budget. The remaining margin covers a correction, defensive action or one inefficient move.

## 7. Character statistics

Every existing card retains its five printed statistics. The field conversion must be deterministic and visible from the card detail view.

### Arithmetic

Arithmetic controls exact numerical force, splitting, combining, capacity and value adjustment.

- Basic numerical test: `Arithmetic + support` against the scenario threshold
- Combine limit: total value up to `2 × Arithmetic`
- Split choices: up to `1 + floor(Arithmetic / 3)` legal partitions shown
- Arithmetic 8 to 10 unlocks the strongest exact-value action result, not extra action points

### Geometry

Geometry controls lines, orientation, pushing, pulling, shape manipulation and resistance.

- Push distance: `1 + floor(Geometry / 4)`, maximum three
- Construction span: `1 + floor(Geometry / 3)` edges
- Geometry contributes to hearts and physical defence
- Geometry 7 or more can ignore one occupied corner when checking a shape boundary

### Logic

Logic controls prediction, ordering, hidden information and constraint manipulation.

- Intent preview depth: one consequence, plus one at Logic 6 and another at Logic 9
- Deduction actions remove false possibilities rather than selecting the answer automatically
- Tied rule checks favour the higher Logic character
- Logic never makes a puzzle solution free; it narrows or safely exposes the state

### Science

Science controls repair, healing, state changes, stabilisation and connected effects.

- Repair or healing strength: one, plus one at Science 7
- Stabilise duration: one enemy phase, or two at Science 9
- Chain length: `1 + floor(Science / 3)`, maximum four objects
- Science contributes to hearts

### Speed

Speed controls movement, initiative, relays and reactions.

- Movement: `2 + floor(Speed / 4)`, maximum four clear hexes per Move action
- Initiative: `12 - Speed`; lower acts earlier
- Relay length: one ally, plus one at Speed 7
- Speed 9 or 10 grants a one-hex opening step, never another full action point

### Hearts, range and power

- Hearts: `2 + floor((Geometry + Science) / 7)`, maximum five
- Standard range: one
- Reckoner range: two
- Scout range: three
- Strike power: chosen relevant statistic plus adjacent support
- One impact when power meets defence
- Two impact when power exceeds defence by four

The full assignment for all ninety regular cards and thirty boss Commanders is in `EXPEDITIONS_ROSTER.md`.

## 8. Roles

| Role | Purpose | Baseline action |
|---|---|---|
| Guardian | Protects a route, ally or scenario object | Guard: cancel the next hostile effect on an adjacent target |
| Mender | Repairs damage and keeps systems functioning | Mend: restore one heart or one damage state |
| Reckoner | Manipulates rules and board mechanisms | Reconfigure: rotate or change one adjacent legal state |
| Mover | Repositions figures and objects | Shove: after a close action, move the target one legal hex |
| Scout | Extends reach and creates support | Mark: allies gain one support against a visible target |

Each module has exactly six characters in every role. Existing Adventure roles are preserved first. Remaining cards are assigned from their statistics, then balanced across the module.

## 9. Disciplines

Characters equip one of three actions from their primary discipline. Scenarios may recommend an action but should rarely require one exact character.

### Arithmetic actions

- Combine: merge adjacent numbered objects
- Split: replace one value with a legal pair whose total is unchanged
- Balance: transfer one point between linked systems

### Geometry actions

- True Shift: slide an object along a straight clear line
- Rotate: turn a shape, direction or mechanism one step
- Measure: reveal distance, area, perimeter or line-of-sight consequences

### Logic actions

- Predict: reveal one enemy's complete next intention
- Order: swap two adjacent positions in a sequence
- Deduce: remove a false location, value or rule possibility

### Science actions

- Transform: advance an object through its state cycle
- Stabilise: prevent one target changing during the next enemy phase
- Chain Reaction: repeat a one-point effect through connected matching objects

### Speed actions

- Dash: move again after interacting
- Relay: pass a carried object through adjacent allies
- Interrupt: move one hex when a declared enemy action begins

## 10. Objective engines

The engine should support twelve reusable families rather than thirty one-off rules.

| Family | Completion test | Typical mathematics |
|---|---|---|
| Eliminate | No required enemy remains | Comparison, intervals, support totals |
| Capture | Required number of marked hexes occupied at check time | Counting, majority, spatial planning |
| Exact total | Objects in a region equal a target | Arithmetic, fractions, algebra |
| Balance | Linked regions satisfy equality or a stated ratio | Partition, equivalence, proportion |
| Ordered route | Required nodes visited in a valid sequence | Sequences, inequalities, logic |
| Delivery | Required objects reach destinations within constraints | Capacity, time, distance |
| Containment | Boundary has enough closed sides | Perimeter, topology, counting |
| Connect | A valid path or network links terminals | Graphs, shortest paths, connectivity |
| Rescue | Rescue flag set and a figure reaches the exit | Multi-stage reasoning |
| Protect | Target survives through the final enemy phase | Forecasting, defence, rates |
| Optimise | Base task complete within a minimum or maximum | Efficiency, scheduling, minimax |
| Constraint grid | Every listed relation is simultaneously true | Deduction, parity, inequalities |

### 10.1 Reusable board mechanisms

Objective families describe how a mission is won. Board mechanisms describe what the player physically touches. A scenario combines two or three of these mechanisms:

| Mechanism | What the player sees | Character action | Procedural variation |
|---|---|---|---|
| Operator wheel | A brass hex with an operation printed on each edge | Stand beside it and rotate 60 degrees | Operations, orientation, route and target |
| Number load | A crate, fruit basket, ledger tile or signal carrying a value | Collect, carry, relay, split or place | Values, weights, destinations and decoys |
| Constraint cell | A socket belonging to a row, column, region or hex ring | Place or exchange number stones | Grid shape, clues, cage totals and unique solution |
| Route tile | A hex with paths joining selected edges | Rotate, lock or traverse | Connectivity skeleton and blocked edges |
| Scale or meter | Two or more regions with a live total, ratio or bound | Add, remove or transfer a load | Target relation and available partitions |
| Pressure plate | A marked hex checked at a stated time | Occupy, guard or leave at the right moment | Required count, timing and enemy contest |
| Converter | A machine that changes an entering value | Feed a load or redirect its output | Function, capacity, cooldown and output route |
| Combat ward | An enemy shield labelled with a mathematical condition | Satisfy the condition, then strike | Values, intervals, support and enemy order |

### 10.2 Rotating operator tiles

This becomes one of the signature Expedition mechanisms.

An operator wheel is a raised hexagonal tile with a different operation on each usable edge, for example `+3`, `−2`, `×2` and `÷2`. A glowing number token enters through one edge and leaves through another. The outward-facing edge applies its operation. Rotating the wheel changes both the connected route and the operation that will be applied.

A typical play sequence is:

1. Pip carries a value `4` onto the first feeder hex.
2. Bramble rotates the adjacent wheel so its `+3` edge faces the route.
3. The route preview displays `4 → 7` before confirmation.
4. Nine runs to the second wheel and rotates `×2` toward the exit.
5. The token travels through both wheels as `4 → 7 → 14` and opens the target gate.

The wheel is never a separate arithmetic worksheet. It is part of the terrain: characters must reach it, spend an action to rotate it and defend it from enemies that may turn, jam or occupy it.

Scaling rules:

- Ninefold Orchard uses two to four wheels, whole-number results and exact division only. Invalid fractional exits are visibly crossed out.
- Little Reckoning uses three to five wheels, negative values, fractions and operation-order choices. Two tokens may need different destinations.
- Gifford uses four to six wheels as functions such as `x ↦ 2x − 3`, inverse pairs or algebraic transformations. A late puzzle may require the same route to produce the required relation for every permitted input, not merely one tested number.

Generation begins with a valid operation composition and works backwards to choose the start value, target and orientations. It then adds decoy edges that encode specific misconceptions. Every generated wheel board is rejected unless the solver proves reachability, numerical legality and at least one complete action trace within budget.

### 10.3 Sudoku and constraint-grid play

Constraint grids are made spatial. Number stones sit on the board and characters physically carry them into sockets. Rows, columns, rings and regions illuminate when valid. Invalid placement remains allowed where the puzzle requires experimentation, but the affected rule displays a precise state such as `row repeats 3` or `cage total 11 of 10`.

- Ninefold Orchard: three-by-three Latin patterns, missing values, odd and even rows, simple magic totals and seven-cell hex flowers
- Little Reckoning: four-by-four Latin grids, factor cages, signed values, fraction totals and overlapping region rules
- Gifford: Latin and KenKen-style cages combined with inequalities, parity, algebraic totals or conditional clues

The generator first creates a complete solution, derives valid clues, then removes clues while repeatedly checking uniqueness. It also checks the physical layer: required stones must be reachable, the carrying distance must fit the round budget and enemies must not be able to seal every valid placement.

### 10.4 Combat patterns

Combat missions retain the same board language and are not simple health races.

- **Break the ward:** arrange nearby values so the shield equation becomes true, then attack
- **Hold the median:** the central enemy is vulnerable only while a hero occupies the current median-valued hex
- **Prime formation:** enemies sharing factor-linked hexes support one another; break the graph before striking
- **Interval volley:** choose an attack whose lower and upper bounds contain the target distance
- **Last-one-standing:** a small Nim-style field of counters determines which enemy may be attacked
- **Area denial:** close a perimeter or complete a shape to trap a mobile enemy

Two or three missions per module may be combat-led. Other scenarios use combat as an optional way to remove pressure. Enemy health remains low; stronger cards matter through reach, support, protection and mathematical thresholds rather than inflated hit points.

## 11. Procedural generation

Procedural generation changes values, layouts and enemy schedules inside a hand-authored scenario grammar. It must not invent arbitrary rules or prose.

### 11.1 What remains authored

Every expedition keeps a fixed identity:

- Narrative situation
- Objective family
- Available board mechanisms
- Enemy behaviour types
- Allowed mathematical concepts
- Difficulty envelope
- Visual environment
- Tutorial callouts
- Optional marks

### 11.2 What may vary

- Numerical values and target
- Which valid partition or ordering is required
- Walkable hex arrangement chosen from approved chunks
- Object and enemy starting positions
- One of several approved enemy intent schedules
- Optional secondary condition
- Cosmetic scenery and weather

### 11.3 Generation pipeline

1. Select the scenario blueprint and difficulty band.
2. Derive a deterministic seed from module, scenario, variant and profile-safe local attempt index.
3. Generate the mathematical kernel and its complete solution set.
4. Construct the objective regions backwards from one chosen solution.
5. Add routes and obstacles while preserving required distances.
6. Place squad starts, objects and enemies.
7. Calculate lower and upper action bounds for every required sub-goal.
8. Run a deterministic solver against the actual rules engine.
9. Run adversarial enemy schedules allowed by the blueprint.
10. Reject variants that are impossible, trivial, ambiguous or over budget.
11. Score the survivors for novelty and clarity.
12. Save only the seed and blueprint version, allowing the same board to be reconstructed offline.

### 11.4 Mathematical kernel generation

Generate the answer before the question state.

For a balance map, choose two legal groups first, shuffle their values, then calculate the target. For a route map, generate a sequence and valid route before adding false branches. For a constraint grid, generate a complete assignment, derive clues from it and remove clues only while uniqueness remains.

Distractors must be plausible states produced by a known misconception, not random values.

### 11.5 Solvability checks

A generated map is accepted only when:

- At least one legal squad archetype can complete it
- The required mathematical state has at least one solution
- A uniqueness-required puzzle has exactly one solution
- The shortest verified playthrough fits the action budget
- No enemy can destroy every solution before the player can respond
- Required objects remain reachable after every mandatory state change
- The exit cannot be permanently blocked by a legal enemy move
- The intended age tier does not exceed its reading or calculation bounds

The solver stores a reference trace for every accepted seed. Regression tests replay representative traces whenever movement, actions or enemy rules change.

### 11.6 Difficulty controls

Difficulty should be adjusted using explicit levers:

- Increase or decrease the number of candidate objects
- Tighten or loosen the action margin
- Add or remove one secondary condition
- Reveal or conceal an enemy intention
- Change an enemy's activation round
- Add a reversible or irreversible transformation
- Widen or narrow allowed numerical ranges
- Change whether the solution must be unique or merely valid

Enemy health should not be inflated as a substitute for difficulty.

### 11.6.1 Procedural difficulty budget

Every generated variant receives a deterministic difficulty score before it can be offered:

`difficulty = maths depth + state-space size + route pressure + enemy pressure + information burden − assistance`

Each term is stored separately so balancing remains explainable. A variant cannot reach a high band merely by raising one number.

| Component | Low value | High value |
|---|---|---|
| Maths depth | One calculation or relation | Three linked relations or a proof-like dependency |
| State-space size | Two or three meaningful choices | Several interacting placements, rotations or routes |
| Route pressure | Short clear paths and generous actions | Split objectives, terrain costs and tight sequencing |
| Enemy pressure | One slow, fully visible disruption | Coordinated deterministic threats affecting different systems |
| Information burden | All values and consequences shown | One or two rule-governed unknowns requiring deduction |
| Assistance | Exact legal highlights and generous undo | Consequence-only previews and limited hints |

Mission number selects a narrow band within the module. Module selects the permitted mathematics and reasoning depth. Rarity readiness is validated separately. This prevents a procedurally awkward early board, an accidentally trivial finale or a Gifford mission that is difficult only because the numbers are large.

### 11.6.2 Variation without shapeless randomness

Each scenario should ship with three to six hand-authored board skeletons. Generation may vary values, orientations, objective locations, safe scenery, obstacle chunks and enemy schedules inside those skeletons. It may not spray random hexes and hope a solver finds a game.

For each accepted seed, the build stores:

- The mathematical solution set
- A shortest reference action trace
- At least one non-optimal but successful trace
- Required squad capability tags
- Estimated decision count and completion time
- The misconception represented by each distractor

The daily pool should avoid repeating the same skeleton, solution shape or dominant discipline within the last five plays. A player may still choose Replay Same Map after a result.

### 11.7 Repetition control

The last five played seeds are stored locally per scenario. New generation should avoid the same mathematical solution shape, board chunk combination and enemy schedule. A child may choose Replay Same Map from the result screen when practising a particular solution.

## 12. Ninefold Orchard scenarios

### 1. The Unequal Crossing

- Core idea: partition 2, 3, 4 and 5 into two totals of 7
- Board: a bridge with two brass platforms and an exit arch
- Threat: Hookmoles target the largest unguarded load after a visible two-round wind-up
- Lesson: move, collect, place, visible intent and equality
- Variants: other four-value equal partitions with targets from 6 to 15
- Complexity control: fixed starts and full highlights on first play

### 2. The Counting Orchard

- Core idea: choose a subset totalling exactly 12
- Board: six numbered fruit plots around one tally basket
- Threat: a Scruff Crow obscures one visible value each round
- Lesson: addition combinations and checking alternatives
- Variants: targets from 8 to 20 with four to seven candidate values
- Failure explanation: shows the chosen total and the smallest correction

### 3. Nine Across the Bridge

- Core idea: deliver three loads while no bridge section exceeds capacity 9
- Board: three linked bridge spans with live capacity plaques
- Threat: Crosswind pushes one unguarded load east
- Lesson: capacity, order and temporary totals
- Variants: loads from 1 to 6 and capacities from 7 to 12
- Complexity control: overload is previewed before confirming placement

### 4. The Widdershins Path

- Core idea: visit 2, 4, 6 and 8 in increasing order
- Board: spiral stepping stones with tempting odd shortcuts
- Threat: Widdershins reverses the last unguarded marker
- Lesson: even numbers, order and route planning
- Variants: multiples, simple descending sequences or one missing term
- Complexity control: the next valid family of stones is highlighted, not the exact stone

### 5. The Maybe-Flock Roost

- Core idea: hold three whistle posts at the same round end
- Board: three branches joined by a central roost
- Threat: Maybe Finches contest the nearest open post
- Lesson: simultaneous state and anticipating movement
- Variants: post spacing and Finch priority
- Complexity control: enemy destination hexes are shown before the player acts

### 6. Ten Honest Bundles

- Core idea: form two separate groups totalling 10
- Board: paired market stalls and six bundles
- Threat: Strawlings split the largest unguarded bundle
- Lesson: repeated exact totals and equal grouping
- Variants: duplicated values and targets from 8 to 15
- Complexity control: no more than two unused objects in 9FO

### 7. Count the Murder

- Core idea: close a ring around a flock while counting nine boundary positions
- Board: a large orchard clearing with partial hedges
- Threat: the Crow Swarm moves toward the widest opening
- Lesson: perimeter as a boundary and spatial counting
- Variants: ring shape, fixed hedge sides and moving opening
- Complexity control: closed sides illuminate and display the current count

### 8. The Hollow Bough

- Core idea: protect a memorial hex until the fourth whistle
- Board: one central hollow surrounded by branching routes
- Threat: Overgrowth expands into the nearest unprotected adjacent hex
- Lesson: forecasting, adjacency and defensive allocation
- Variants: growth order and pre-blocked sides
- Complexity control: every next growth hex is shown

### 9. Every Basket One Short

- Core idea: correct three rows so every basket tally is exact
- Board: three short rows of baskets and movable one-point counters
- Threat: The Nearly reduces the largest unguarded exact basket by one
- Lesson: checking totals, difference and simultaneous correctness
- Variants: row totals up to 20 with one or two errors
- Complexity control: rows display live differences such as `needs 1 more`

### 10. The First Whistle

- Core idea: reconnect nine branches to the founding stone
- Board: a tree-shaped network with rotatable branch tiles
- Threat: Forgetting Root disconnects the least-supported branch
- Lesson: connectivity and systematic checking
- Variants: approved tree networks with nine named terminals
- Complexity control: disconnected components use distinct patterns as well as colour

## 13. Little Reckoning scenarios

### 1. The Smudged Stones

- Core idea: restore missing operations so all routes evaluate to 24
- Board: crossing expression paths with operator sockets
- Threat: Walking Smudges obscure the nearest unguarded operator
- Mathematics: operation order and inverse checking
- Variants: targets 12 to 36 using whole-number intermediate results
- Tier step: two routes share at least one number tile

### 2. Roughly at the Market

- Core idea: collect value at least 50 while carrying no more than weight 20
- Board: stalls with paired value and weight labels
- Threat: Mist Vendors alter displayed estimates within visible bounds
- Mathematics: estimation, bounds and constrained selection
- Variants: six to eight goods with several valid portfolios
- Tier step: the best exact choice is not required, only a valid bounded choice

### 3. The Backwards Courtyard

- Core idea: complete a reversed sequence
- Board: courtyard stones labelled 21, 13, 8, 5, 3, 2 and 1
- Threat: a Reverse Knight undoes the last unguarded step
- Mathematics: recognising and reversing a recurrence
- Variants: Fibonacci-like, alternating and simple difference sequences
- Tier step: the recurrence is discoverable from at least four visible terms

### 4. Lanterns in the Forgetting Fog

- Core idea: connect four lanterns using a shortest valid network
- Board: foggy paths with junction costs
- Threat: Foglings extinguish the least-connected active lantern
- Mathematics: networks, connectivity and path length
- Variants: small weighted graphs with two or more candidate networks
- Tier step: the current total length remains visible

### 5. General Guesswork's Lines

- Core idea: clear a formation using attacks whose estimate intervals contain the true value
- Board: lanes with hidden exact distances and visible bounds
- Threat: guards advance while an archer widens one interval
- Mathematics: lower bounds, upper bounds and estimation
- Variants: lengths, areas or populations with age-appropriate magnitudes
- Tier step: combat is the objective, but mathematical interval choice determines every hit

### 6. A Shape Coming Apart

- Core idea: maintain equal perimeter on two sides while sealing six unstable edges
- Board: linked polyomino regions whose boundaries change
- Threat: the Unshape removes an exposed edge
- Mathematics: perimeter, shared edges and equivalence
- Variants: approved shapes with verified equal-perimeter solutions
- Tier step: area is displayed as irrelevant information on harder variants

### 7. The Countless Crossing

- Core idea: make a route visiting every required group exactly once
- Board: regions joined by bridges
- Threat: the Countless Swarm divides into the largest open region
- Mathematics: graph traversal and systematic counting
- Variants: six to nine regions with a guaranteed route
- Tier step: revisiting a region is legal but breaks the optional efficiency mark

### 8. Madam Nought's House

- Core idea: reduce every lock expression to zero, then rescue the courier
- Board: rooms connected by operation locks
- Threat: Nought Shadows replace a nearby operation with subtraction
- Mathematics: zero, negatives and inverse operations
- Variants: integer expressions whose intermediate values stay within minus 20 to 20
- Tier step: the rescue creates a second linked objective after the locks

### 9. The Almost Mirror

- Core idea: make two halves congruent
- Board: a reflection line with movable shapes and values
- Threat: Almost Echoes repeat the previous transformation with one altered detail
- Mathematics: reflection, congruence and identifying the changed property
- Variants: orientation, length, angle and label differences
- Tier step: the imitation is previewed but must be incorporated into the plan

### 10. Counted In

- Core idea: assign every fragment to exactly one valid region
- Board: five overlapping rule regions
- Threat: Muddle Fragments move toward the region with fewest candidates
- Mathematics: set membership, elimination and partition
- Variants: property rules covering parity, factors, shape and simple inequalities
- Tier step: several placements may look locally valid, but the final assignment is unique

## 14. Gifford scenarios

### 1. The Examination Clock

- Core idea: schedule four tasks through three stations before bell twelve
- Board: a time track crossed with three processing stations
- Threat: Proctors block the station with the shortest remaining task
- Mathematics: scheduling, duration and dependency
- Variants: task durations 1 to 5 with one or two prerequisites
- GF step: the player must consider idle time and ordering simultaneously

### 2. Cross's Pursuit Network

- Core idea: choose a minimum-cost route while used edges increase neighbouring costs
- Board: a weighted street graph
- Threat: Trackers close cheap edges and a Hound pursues the lowest-initiative hero
- Mathematics: dynamic shortest paths and cumulative cost
- Variants: verified graphs with two near-optimal routes
- GF step: the cheapest first edge may not belong to the cheapest complete route

### 3. The Sealed Archive

- Core idea: satisfy row, column and parity constraints to open three vaults
- Board: a linked grid of number plaques
- Threat: an Archive Warden locks a nearly complete row while a Cipher Moth conceals one clue
- Mathematics: simultaneous equations, parity and constraint propagation
- Variants: uniquely solvable Latin-style grids using values 1 to 9
- GF step: Logic actions reveal, but do not solve, concealed constraints

### 4. Vex's Demonstration

- Core idea: construct two algebraically equivalent totals from disjoint tiles
- Board: two expression benches with movable constants, variables and operators
- Threat: Vex's Assistants transfer one unguarded term between benches
- Mathematics: equivalence, substitution and rearrangement
- Variants: linear expressions with integer coefficients
- GF step: equality must hold for all permitted values, not one test value

### 5. Bramwell's Compromise

- Core idea: balance flow, pressure and cost when no arrangement maximises all three
- Board: linked pipes, valves and contract meters
- Threat: Runaway Valves increase the greatest pressure difference
- Mathematics: ratio, simultaneous constraints and trade-offs
- Variants: two or three feasible solutions with different performance marks
- GF step: the win condition is feasibility; optimisation supplies optional mastery

### 6. Vale's Filing System

- Core idea: build a connected network satisfying degree limits
- Board: archive nodes with maximum connection counts
- Threat: Clerk Drones close the active edge with greatest network importance
- Mathematics: spanning trees, degree and connectivity
- Variants: seven to ten nodes with a stored reference tree
- GF step: the player must avoid a network with a single critical bridge

### 7. Whistle's Price

- Core idea: complete three trades satisfying percentage, ratio and capacity conditions
- Board: market desks connected by exchange-rate tracks
- Threat: a Broker changes one rate by five per cent and a Collector targets the highest unattended token
- Mathematics: percentages, ratio and chained conversion
- Variants: rates chosen to keep final arithmetic manageable without calculators
- GF step: visible rounding policy is part of the formal rules

### 8. Scarrow's Ring

- Core idea: win a combat while controlling the median-valued hex each round
- Board: a ring of ordered values around a central arena
- Threat: Scarrow attacks the median controller while Seconds support or contest it
- Mathematics: median under a changing data set
- Variants: odd-sized sets from five to eleven values
- GF step: removing an enemy may change which hex is the median

### 9. The Chancellor's Ledger

- Core idea: deduce six hidden entries from totals, inequalities and exclusive statements
- Board: ledger columns represented as mechanical vault strips
- Threat: Ledger Guards temporarily falsify one currently true statement
- Mathematics: inequalities, systems and logical implication
- Variants: generated from a unique full assignment and verified after clue removal
- GF step: six-round exception because the puzzle contains staged revelation

### 10. The Engine's Answer

- Core idea: route three signals through a changing weighted graph and minimise maximum delay
- Board: a large engine network with shared-capacity edges
- Threat: Engine Processes increase the weight of the busiest edge
- Mathematics: weighted graphs, load balancing and minimax optimisation
- Variants: hand-approved graph skeletons with procedurally generated weights
- GF step: several successful routes exist, but only strong coordination earns the optimal mark

## 15. Enemy design

Every enemy must publish a concise intent sentence and a target marker. Enemies use deterministic priority lists so the player can reason rather than guess.

Priority example for a Hookmole:

1. Highest-valued portable object
2. Ignore carried, guarded or stabilised objects
3. Prefer shortest path
4. Break distance ties by clockwise board order

Randomness may choose a variant before the expedition begins. It must not choose between equally valid targets during resolution unless the choice and odds were shown before the player committed.

## 16. Rewards

Expeditions is optional play, not another progression grind.

- First clear of an ordinary expedition: small star award, currently three in the private prototype
- Repeat clear: one star (see `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` §8.6; supersedes the
  earlier "no currency" rule)
- Optional marks: no exhaustion, no combat, exact turn target and minimum movement, plus a
  visible rank and personal-best comparison built from the same marks (§8.2-8.3 of the same
  document)
- Proposed module-set reward: one Reveal token after all ten first clears

Reward values remain configuration, not a rules dependency. They must be reviewed against card-pack pacing before release.

## 17. Interface inventory

Required screens:

1. Home tile
2. Expedition map
3. Mission briefing
4. Squad selection and Commander slot
5. Deployment
6. Tactical board
7. Expanded character and action inspection
8. Objective resolution
9. Failure explanation
10. Performance record

### What the tactical screen looks like

The screen is a painted adventure scene viewed from a high three-quarter angle. A compact 5 by 7 or 7 by 7 hex field sits inside the scenery rather than on a blank abstract board. Orchard streams pass under bridges, Little Reckoning geometry floats above violet stone and Gifford streets run between iron machinery and rain-dark buildings.

The board occupies roughly two-thirds of a landscape screen. Characters are modern painted sprites posed like pieces in a classic tactics game. Their feet sit on the hex centre with a soft oval shadow. Taller scenery can pass in front of them, creating the faux-3D effect without real 3D models.

Persistent information is deliberately small:

- Top left: one-sentence objective and the live mathematical state
- Top right: round number and enemy intentions
- Bottom edge: three or four character portraits with hearts and action-point pips
- Beside the selected portrait: only the actions currently available
- On the board: values, routes, operators, targets and threat arrows as live readable overlays

When a character is selected, reachable hexes rise slightly and receive a patterned glow. Selecting a destination draws the complete path and cost. Selecting a mechanism shows a local preview directly on the board, such as `rotate clockwise: 4 → 7 → 14`. Confirmation animates the character first, then the mechanism and finally the new total. The camera does not cut away to a question card.

Enemy turns are quick and readable. A Hookmole displays a curved arrow toward the crate it intends to steal. A Smudge points to the operator it will obscure. A Warden traces the row it will lock. Pressing End Round first shows every predicted change, then resolves them in under three seconds unless the player has chosen reduced motion.

### One complete visual example: The Turning Orchard

The map contains three brass operator wheels connected by a glowing orchard path. A blue number token marked `4` waits at the left gate. The right gate displays `TARGET 14`. Two heroes begin near separate wheels and a Hookmole threatens to jam the centre wheel at the end of round two.

The player can see that the current route produces `4 → 8 → 6`, which is wrong. Bramble walks to the first wheel and rotates it from `×2` to `+3`. Nine dashes across the bridge and turns the last wheel to `×2`. The route preview now reads `4 → 7 → 14`. Pip guards the centre mechanism, the token is released and it rolls visibly across the board through both operations. The gate opens as the equality lights up. The mathematics, movement and defence are one continuous action sequence.

On Ninefold Orchard mission 2, both wheels are adjacent and the enemy arrives late. On mission 10, three Epic characters must operate distant wheels during the same round, one wheel offers exact division and two enemies threaten different parts of the route. Little Reckoning versions add negative or fractional branches. Gifford versions replace the token with `x` and ask the player to construct a transformation such as `x ↦ 3x − 5` while minimising rotations.

### Home-tile art requirement

The temporary generic beige tile is not acceptable for release.

Each module needs a dedicated tile built inside its existing frame system:

- 9FO: an orchard bridge diorama, Pip or Nine and glowing brass hexes
- LR: a violet tactical board with paper geometry and one Little Reckoner
- GF: a burgundy and iron planning table with a weighted route overlay

The title and subtitle should be part of the live interface wherever possible. Decorative scene art may be baked into the image, but release-critical wording must not rely on generated lettering.

The tile must be supplied at the same dimensions and crop-safe area as the other home tiles, with normal, hover or pressed and locked or unreleased treatments.

### Tactical-board controls

- Selection and legal destinations need shape as well as colour
- Action buttons require commissioned module-specific art
- Disabled, available, selected, spent and dangerous states must be visually distinct
- End Round needs greater visual weight than an ordinary action but must be separated from the most common action area
- Undo remains text-labelled
- Touch targets must be at least 44 CSS pixels
- The player may tap any value to see its contribution to the current objective

## 18. Art production

The preferred presentation uses painted 2D sprites in a 2.5D renderer.

Per character:

- Front three-quarter idle
- Rear three-quarter idle
- Action pose
- Exhausted pose
- Shared oval shadow

Mirroring supplies left-facing variants. Movement uses translation, hop and shadow scaling. It does not need a complete walk cycle.

The image-generation tool, existing card art, React/CSS renderer, Sharp processing and current bundler are sufficient. Blender is unnecessary unless the direction changes to true 3D meshes.

Full details are in `EXPEDITIONS_ART_PIPELINE.md`. The current mock-ups are visual direction only. They are not approved UI assets and generated text should never be shipped as interface copy.

## 19. Accessibility and safeguarding

- No chat, user-created names or shared content
- No necessary information communicated by colour alone
- Enemy intentions have text equivalents
- Reduced-motion mode removes hops, shakes and particle bursts
- Screen-reader summary lists figures, objects, current totals and objective state
- Keyboard, mouse and touch can complete every action
- Mathematical notation uses accessible live text
- Failure language describes the state, never the child's ability

## 20. Analytics for balancing

If privacy-safe analytics are later enabled, record only anonymous gameplay events already permitted by the product's policy:

- Scenario and variant version
- Squad role and discipline composition, not profile identity
- Clear or fail
- Round and action count
- Objective state at failure
- Hint use
- Undo count
- Enemy defeats

Key review questions:

- Where does a child first become unable to state the goal?
- Which card profiles are never selected?
- Are failures caused by mathematics, pathing or misunderstood UI?
- Does an efficient solution still fit within five minutes?
- Does Gifford increase reasoning depth without increasing reading time excessively?

## 21. Technical architecture

Keep the engine pure and independent of React.

- Scenario data defines authored grammar and presentation metadata
- Roster conversion derives immutable field profiles from card data
- Engine functions accept a state and return a new state
- Enemy resolution is deterministic
- Objective evaluators are reusable across worlds
- React renders state and dispatches legal actions
- Progress records only completion and performance
- Generated variants store seed plus blueprint version

No server or runtime AI is required. Every map, solver and rule works offline in the browser and Android package.

## 22. Testing requirements

Before a scenario becomes visible outside the developer profile:

- Its briefing and board render without runtime errors
- At least one stored reference squad completes every approved seed
- The lowest reasonable movement squad is tested where legal
- Enemy tie-breaking is deterministic
- Earlier state objects remain immutable
- First-clear rewards are idempotent
- Replay does not grant another reward
- Desktop, tablet landscape and phone landscape layouts pass visual inspection
- Touch targets pass the size rule
- Text fits at 200 per cent zoom
- Existing Adventures, Joey, lessons, tests and card storage still pass regression
- Missions 1 and 2 have a verified winning trace using a legal early Uncommon-heavy squad
- Missions 9 and 10 flag a readiness shortfall for every squad containing a card below Epic, without disabling Embark
- Missions 9 and 10 have winning traces for at least three distinct full-Epic role combinations
- Raising enemy health alone cannot change a scenario's difficulty band
- Every generated constraint grid is unique where uniqueness is promised
- Every operator-wheel solution keeps all intermediate values legal for its module
- The same seed, blueprint version and squad always reconstruct the same board and enemy schedule

## 23. Delivery phases

### Phase A: pre-production

- Approve this brief
- Approve reward economy
- Approve the three age-tier difficulty envelopes
- Commission final home-tile and action-button art
- Choose one additional proof map per world

### Phase B: developer prototypes

- Keep access restricted to `eudaimon` plus Rooke
- Stabilise The Unequal Crossing
- Build one LR and one GF proof map
- Run child-observation sessions focused on goal comprehension and duration

### Phase C: production system

- Finish sprite manifests and shared terrain atlases
- Implement all discipline and role actions
- Build generation kernels and solver rejection pipeline
- Add performance marks and module-set reward
- Complete accessibility presentation

### Phase D: content production

- Implement all thirty board configurations
- Produce and verify procedural variants
- Balance every legal role composition
- Complete final art, sound and animation

### Phase E: release decision

- Remove the developer-only gate only after explicit approval
- Run the full Android and offline-browser matrix
- Review reward pacing and freemium behaviour
- Publish release notes and parent-facing explanation

## 24. Current private prototype boundary

The existing code is a disposable validation slice, not an approved feature implementation. It proves that the hex engine, collection-derived squad, object handling, deterministic enemy phase and balance objective can coexist in the current offline app.

It must remain hidden from every profile except the exact developer unlock. Its placeholder panels and buttons do not set the final visual standard. Further implementation should stop at maintenance and fault correction until the build brief, button art and cross-age proof maps are approved.
