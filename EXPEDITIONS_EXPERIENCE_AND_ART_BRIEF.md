# Expeditions: experience, systems and art brief

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. Per-scenario asset assignments are in
> `EXPEDITIONS_SCENARIO_ART_MATRIX.md`.

Status: proposed replacement for objective-family-first scenario design. This document is the
creative source of truth for all three Expedition routes. The older route documents retain
their curriculum order and implementation notes, but their individual map descriptions are
superseded where they conflict with this brief.

## 1. The player experience

Expeditions must feel like a short tactical episode, not a worksheet with animated crates.
Each map has a distinctive situation, a battlefield rule that changes play, a mathematical
system embedded in the world and a decisive tactical moment.

Every scenario pitch must answer:

1. What is happening here that a child would want to see resolved?
2. What changes on the board during play?
3. What mathematical structure is the player mastering?
4. Which cards make a materially different plan possible?
5. What does the player do in the memorable final turn?

Backend objective families such as `delivery` or `connect` remain useful engine labels. They
are never sufficient as a map pitch.

## 2. The four pressure lanes

Every map declares two to four of these lanes in its briefing. This is how card statistics
become visible and how later collections become necessary.

| Lane | What the player sees | Stat and team consequence |
|---|---|---|
| Reach | A gate closes, a target flees or stations are far apart | Speed sets Move and initiative; relay and Dash create another route |
| Shape | Lines, ports, rotations, terrain or a spatial pattern block the plan | Geometry powers visible checks, Shape Field and long interactions |
| Truth | A rule, enemy condition or deduction determines the safe choice | Logic reveals, orders, locks or predicts before a costly commitment |
| Change | A tile decays, spreads, breaks or must be held stable | Science stabilises, repairs, transforms and extends survival through Hearts |
| Number | Values must be combined, split, bounded or made equivalent | Arithmetic enables exact operations and named numerical checks |
| Threat | An enemy occupies, damages or changes a vital system | Primary-stat strike, adjacent support, roles, Hearts and tactical positioning |

No map uses all six lanes. Early maps use two. Mid-route maps use three. Final maps use four,
with every pressure named in advance. A card is valuable because it answers a pressure lane,
not because its frame is a rarer colour.

## 3. Combat that belongs in the puzzle

Combat is decisive, short and deterministic:

```text
Power = named governing stat + adjacent allied support + shown bonuses
below Defence: 0 impact
meets Defence: 1 impact
at least 4 above Defence: 2 impact
```

An enemy usually has one to four hearts. A player should be able to read the result before
acting and either defeat the enemy, guard its target, bait it into a bad position or route
around it. Combat is a map-specific tactical question:

| Combat pattern | Example |
|---|---|
| Shield puzzle | A boss cannot be struck until an exact value, port or operator state is correct |
| Formation fight | Support positions are needed to reach Defence, but those positions are exposed |
| Control fight | Damage only counts while the party owns a median, ring or signal tile |
| Hunt | A target follows the highest value, weakest route or latest repair, so the player manipulates its choice |
| Optional obstacle | Defeating an enemy opens a shortcut, while avoidance preserves actions |

Enemy turns must change the board, not simply remove hearts. An enemy steals a route marker,
rewinds an operator, changes a forecast, closes an edge, moves a flock or corrupts a node.

## 4. Chaining systems

### 4.1 Hero chains

The core tactical chain is not pickup/drop-off. It is a visible sequence of complementary
actions, such as:

```text
Logic predicts the Root's target
→ Geometry rotates the safe branch
→ Speed reaches the far relay
→ Science stabilises the connection
→ the team strikes with adjacent support
```

Maps should reward at least one such sequence but never require a single exact card identity.
Different roles must offer alternative chains: Guard instead of Stabilise, supported combat
instead of an extra movement route or an Arithmetic transformation instead of a carried value.

### 4.2 Rotating hex mechanisms

A rotation hex is a real pointy-top board tile, not a square dial placed over a hex.

- It has six edge positions and rotates in 60-degree steps.
- It contains up to three edge-to-edge tracks, ports or operator faces.
- Each orientation has a named state, a readable arrow and an accessible text equivalent.
- Rotation changes connectivity, direction or the operation applied to an entering value.
- A Reckoner may rotate an adjacent tile once per action. Geometry checks can rotate a jammed
  heavy tile or affect a linked straight run.

Three approved uses:

| System | Board effect | Maths |
|---|---|---|
| Operator wheel | A travelling value passes through `+`, `−`, `×`, `÷` or inverse faces | Operation order, inverse operations and target values |
| Signal prism | Ports connect only when their colours or shapes align | Geometry, networks and matching constraints |
| Current turner | A river, wind or conveyor changes direction after rotation | Route planning, capacity and prediction |

The generator varies initial orientations and target values only when it can prove a solution.
It does not randomise all six faces freely.

### 4.3 Hex-native Sudoku variants

Do not force a square 9-by-9 Sudoku onto hex artwork. Use hex-native deduction puzzles with
explicit constraint groups.

**Hive Ledger** is the primary form. It uses a compact cluster of hexes and values 1–7. The
board displays several overlapping named groups: a flower neighbourhood, a straight axial ray,
a ring segment or a coloured hive. A group may require `use 1–7 once`, `sum to 20`, `have one
even value` or `contain exactly two primes`. Every cell belongs to two or three shown groups.
The player locks values while an enemy attempts to corrupt an unguarded group.

This has the deduction satisfaction of Sudoku but is truthful about its geometry and rules.
The generator must use a solver to prove a unique intended solution and must display all group
rules in words and symbols. It progresses by module:

- Ninefold Orchard: values 1–5 or 1–7, exact sums and simple parity.
- Little Reckoning: signed values, factors, multiples and operation results.
- Gifford: inequalities, equivalent expressions and mutually exclusive statements.

**Hex ring logic** is a second form: values move around a six- or twelve-cell ring; every
opposite pair, 120-degree sector or adjacent run satisfies a displayed relation. Rotating one
tile changes several relationships at once. This is better for a dramatic boss board than a
static ledger.

## 5. Rebuilt routes

### Ninefold Orchard: a living orchard under threat

| Lv | Map and set-piece | Maths in the world | Stat-driven tactical hook |
|---:|---|---|---|
| 1 | **The Unequal Crossing:** Hookmoles raid a newly opened ravine bridge | Partition 2, 3, 4 and 5 into equal totals | Speed shortens delivery, Guard protects a load, supported strike is optional |
| 2 | **The Cider Run:** rolling apple presses flood the lanes with changing values | Exact totals and one-step value changes | Arithmetic changes a press value, Speed outruns the cider flow |
| 3 | **Nine Across the Turning Bridge:** bridge hexes rotate with the wind | Capacity and routes through rotating current tiles | Geometry turns a bridge tile, Science holds a wind vane, Speed relays a load |
| 4 | **The Hedgejaw Maze:** a walking hedge closes one coloured route each round | Follow increasing values while predicting a closure | Logic predicts the closing path, Geometry shifts a blocker, Scout marks the Hedgejaw |
| 5 | **The Rooststorm:** three whistle towers direct a flock through storm fronts | Make three directional sums agree while holding towers | Three heroes occupy different systems; Guard, Speed and support combat all matter |
| 6 | **The Rootfire Relay:** glowing roots pass values to neighbouring roots | Chain reactions, exact totals and parity | Arithmetic changes a source value, Science propagates/stabilises, Geometry bridges a gap |
| 7 | **Murder at Moonfall:** a crow swarm moves through an incomplete ring | Perimeter, enclosure and a nine-cell ring | Geometry closes a run, Speed intercepts, an Epic striker clears the Crowbreaker |
| 8 | **The Hollow Bough Awakens:** the memorial tree walks and attacks its own roots | Safe zones, route exclusion and changing terrain | Science repairs branches, Guard absorbs a strike, Logic forecasts the next falling bough |
| 9 | **The Orchard Lockdown:** a Hive Ledger opens three living gates | Hex-native 1–7 deduction, sums and parity | Logic locks deductions, Arithmetic corrects values, three separate gates need all heroes |
| 10 | **The First Whistle:** the First Root rewires the orchard beneath the party | Rotating ports, small number relations and network restoration | Geometry rotates branches, Science stabilises, Logic predicts the boss and combat opens only after the network is live |

### Little Reckoning: a city whose rules are coming loose

| Lv | Map and set-piece | Maths in the world | Stat-driven tactical hook |
|---:|---|---|---|
| 1 | **The Smudged Stones:** Fog-thumbs erase the operators that hold a path together | Operations and target values | Logic restores wheels, Guard preserves a correct operator |
| 2 | **The Market of Approximate Things:** stalls drift through fog before their prices settle | Bounds, estimates, value and weight | Arithmetic certifies an interval, Speed reaches the right stall |
| 3 | **The Backwards Courtyard:** each correct move rewinds part of the maze | Inverse sequences and recurrence | Logic repairs the route order, Quick cards seize the opening step |
| 4 | **Lanterns in the Forgetting Fog:** signal prisms must face through moving mist | Minimum-cost connections and rotations | Geometry rotates prisms, Logic predicts fog closure, Speed covers the remote light |
| 5 | **General Guesswork's Battery:** artillery only fires through a valid estimate interval | Intervals and error bounds in combat | Arithmetic validates a shot, Scouts create support formation, Logic exposes a false range |
| 6 | **The Unshape's Theatre:** the stage folds as two perimeters must stay equal | Perimeter, symmetry and edge accounting | Geometry seals a run, Science freezes a break, Guardian protects the pivot |
| 7 | **The Countless Chase:** a courier changes faction as it crosses number districts | Set membership, multiples, primes and route constraints | Logic reads the next district rule, Speed chases, Geometry crosses an exact line |
| 8 | **Madam Nought's House:** rooms reset unless their expressions are reduced together | Signed expressions, inverse operations and linked states | Arithmetic reduces, Logic locks, Science stops re-inflation |
| 9 | **The Almost Mirror:** Echoes copy every rotation one step wrong | Congruence, reflection and rotating hex rings | Geometry sets the shape, Logic predicts the error, Science freezes one side |
| 10 | **Counted In:** a fracturing city map must be partitioned before it collapses | Fractions, ratios and overlapping membership constraints | Logic locks placements, Arithmetic proves equivalence, all heroes secure regions simultaneously |

### Gifford: dangerous systems and intelligent opposition

| Lv | Map and set-piece | Maths in the world | Stat-driven tactical hook |
|---:|---|---|---|
| 1 | **The Examination Clock:** stations run only in a correct schedule | Dependencies, durations and deadlines | Speed schedules bodies, Logic predicts a Proctor closure |
| 2 | **Cross's Pursuit Network:** every chosen edge changes the graph behind it | Dynamic weighted shortest paths | Logic forecasts cost reactions, Geometry redirects a route |
| 3 | **The Sealed Archive:** vaults reshape the grid when another vault opens | Row, column and parity constraints | Arithmetic combines feeders, Logic locks deductions, Science protects them |
| 4 | **Vex's Proof Forge:** expression tiles power rival constructs | Algebraic equivalence and disjoint resources | Arithmetic combines terms, Geometry positions proof rails, combat breaks a construct only after proof |
| 5 | **Bramwell's Compromise Engine:** every valve improves one gauge and threatens another | Feasibility, bounds and optimisation trade-offs | Science transforms a valve, Arithmetic verifies totals, Logic forecasts perturbation |
| 6 | **Vale's Filing War:** clerk drones sever a degree-limited archive network | Spanning networks and degree limits | Geometry repairs edges, Science stabilises high-degree nodes |
| 7 | **Whistle's Exchange:** three hostile traders change each other's prices | Percentages, ratios and capacity | Arithmetic works distinct trade stations, Logic identifies the price reaction |
| 8 | **Scarrow's Ring:** the boss moves the median as it fights | Median, ordered data and control combat | Logic predicts value shifts, Speed captures the new median, high Power is useless without control |
| 9 | **The Chancellor's Living Ledger:** a deduction board erases itself under pressure | Inequalities, exactly-one clues and logical implication | Logic locks entries, Science preserves a row, team splits to secure clues |
| 10 | **The Engine's Answer:** three signals race through a self-rewriting machine | Minimax routing, dependencies and dynamic weights | Four specialist lanes must be solved together before the boss becomes vulnerable |

## 6. Required art inventory

Art is not a request to generate everything immediately. It is a production checklist. Every
asset needs a stable id, source dimensions, alpha bounds, ground anchor, runtime size and
states before import.

### Shared tactical presentation

- Pointy-top terrain top textures and separate depth walls: clear grass, stone, dirt, water
  edge, blocked, difficult and void. These follow the measured hex template exactly.
- Tactical overlays: reachable, selected, targetable, danger, guarded, stabilised, corrupted,
  complete and invalid. All are real hex masks, not rectangles.
- Unit field bases: idle, selected, moving, exhausted, guarded, carrying and targetable.
- Compact HUD panels, bottom action rail, drawer headers, round/undo/end controls, objective
  chips, enemy-intent cards, combat calculation strip and stat-check preview strip.
- Number, operator, fraction, inequality, ratio and percentage glyph treatments that remain
  live text wherever possible. Do not bake values into art.

### Mechanism kit

- Rotation hex top face, direction arrow, six-state orientation marker and accessible
  orientation symbols.
- Operator-wheel faces: `+`, `−`, `×`, `÷`, inverse and neutral, with jammed, active,
  guarded and corrupted states.
- Signal-prism ports: colour/shape connectors, powered path glow, blocked port and broken
  port.
- Current, wind and conveyor indicators with directional state overlays.
- Hive Ledger group outlines: flower, ray, ring segment and coloured hive, plus locked,
  corrupted and solved cell states.
- Network pieces: branch, wire, valve, signal, station, bridge, edge closure and repair.

### Ninefold Orchard set

- Environments: ravine bridge, cider press lanes, turning bridge, walking hedge maze,
  storm roost, rootfire cave, moonlit orchard ring, memorial bough and First Root chamber.
- Props: brass platforms, tally arch, cider presses, wind vanes, whistle towers, root nodes,
  ring stones, memorial branches, living gates and rotating branch ports.
- Enemies: Hookmole, Scruffcrow, Crosswind spirit, Hedgejaw, Maybe-Finch flock, Strawling,
  Crowbreaker, Overgrowth, Nearly and First Root. Each needs idle, move, intent, hit,
  defeated and scenario-specific action poses where it changes board state.
- Boss set-piece: First Root body, shielded/vulnerable states, root strike telegraph and
  network-activation effect.

### Little Reckoning set

- Environments: fog street, moving market, rewinding courtyard, lantern canal, artillery
  battery, folding theatre, number districts, Nought house, mirror court and fractured city.
- Props: operator stones, drifting stalls, rewind tiles, signal prisms, range beacons,
  perimeter edges, district signs, expression locks, mirror rings and partition regions.
- Enemies: Fog-thumb, Mist Vendor, Reverse Knight, Fogling, Guess Guard, General Guesswork,
  Unshape, Countless Swarm, Nought Shadow, Echo and Muddle Fragment.

### Gifford set

- Environments: examination hall, pursuit network, sealed archive, proof forge, compromise
  engine, filing vault, hostile exchange, Scarrow arena, living ledger and Engine chamber.
- Props: task stations, weighted edges, vault feeders, expression tiles, gauges and valves,
  degree-limited desks, trade stands, median ring, clue ledger and signal processors.
- Enemies and bosses: Proctor, Tracker, Hound, Archive Warden, Cipher Moth, Vex Construct,
  Pressure Valve, Clerk Drone, Broker, Collector, Scarrow, Ledger Guard, Chancellor and
  Engine Process.

## 7. Definition of a completed scenario brief

Before an art maker or engineer starts a map, the brief must include the set-piece, objective,
pressure lanes, exact maths rules, stat checks, enemy intents, alternate tactical chains,
reference solution, procedural envelope, art ids and accessibility copy. A map is rejected if
its pitch could be reduced to “move object A to socket B” without losing anything important.

## 8. Scoring, ranking and replay

Status: added following a product review of Expeditions against the engagement patterns of
tactics games this audience already plays (Fortnite, Tacticus). This section is additive: it
changes nothing about pressure lanes, combat, visible checks or any rule above. It amends one
economy line recorded elsewhere; see 8.6.

### 8.1 Why this exists

Deterministic, no-dice combat is the right choice for trust and transparency, but it means a
solved map has little pull to be replayed once the puzzle is understood. Performance marks (no
exhaustion, no enemy defeated, exact turn target, minimum movement) already exist against each
scenario's own reference trace, but nothing yet turns them into something a child chases. This
section closes that gap without adding hidden numbers, dice or a second, softer ruleset behind
the visible one.

### 8.2 Result rank

Every completed run shows a rank built only from marks that already exist:

```text
Gold:   every performance mark achieved
Silver: at least half the marks achieved, objective complete
Bronze: objective complete, no marks achieved
```

Exact thresholds are a balance decision for whoever wires this in. The requirement is the
shape: three visible, deterministic tiers built from marks that already exist, not a specific
cutoff and not a hidden score.

The rank sits beside the victory line already specified in the card/combat contract (§8, point
6): "Nine relayed the 5-crate; Pip's exact total held the bridge; Bramble guarded it from Nib."
That sentence becomes the headline of the result screen. The rank and reward are secondary to
it, not the other way round.

### 8.3 Personal best

Each scenario already stores its own best turn count and best action count (Claude handover
PRG-06/PRG-07). The result screen states plainly when a run beats, matches or misses that best,
for example `New best: 3 rounds (was 4)`. This gives a reason to attempt an already-solved map
again besides waiting for a new procedural seed.

### 8.4 Local sibling comparison

Status: deferred — skipped from the active build order on 2026-09-17. Kept here as a design
record only; do not build against this section without checking
`EXPEDITIONS_CLAUDE_HANDOVER.md`'s build-order entry first.

No server, no account and no new persistence surface beyond what already exists per profile. On
a shared device, the result screen may show the best turn or action record set by any profile
on that device for the same scenario id, named by profile, for example `Best on this device: 3
rounds — eudaimon`. This is read-only and cosmetic: it never affects rewards, gating or
difficulty, and it must degrade silently to nothing shown when only one profile has played a
scenario.

### 8.5 Chain acknowledgement

When a completed action sequence matches a hero chain named in that scenario's brief (§4.1),
the result screen names it once, in the same plain-numbers voice as everything else, for
example `Chain complete: Logic predicted the Root's target, Geometry rotated the safe branch.`
This is presentation only. It reads the history entries the command dispatcher already
produces and requires no new rule.

### 8.6 Replay reward

Decision: a replayed clear (any scenario already cleared once before) awards one star, matching
the practice-question rate of one star per correct answer.

This amends two things recorded elsewhere, deliberately and not silently:

- The master brief's line "First clear gives a small recognition reward only. Expeditions is
  not an economy shortcut" — a replayed clear now also gives a small, capped-by-design reward.
- The Claude handover's `PRG-04` ("replay grants no currency") and the matching lines in
  `EXPEDITIONS_SPEC.md` §2 and `EXPEDITIONS_BUILD_BRIEF.md` §16.

Both documents, and the implementation they describe (`applyExpeditionResult` in
`wm-progress-actions.js`, currently commented "replays earn nothing") and its test, must be
updated to match before this is real. It is recorded here as the current word on replay
rewards; anyone building against the older lines should treat this section as superseding them.

Guardrails, so this rewards a genuine replay rather than a fast idle loop:

- Only a scenario already cleared at least once is eligible. A fresh first clear keeps its
  existing three-star award unchanged, and the two are not additive on the same run.
- The award is per completed run, not per attempt. Quitting or losing grants nothing,
  consistent with `PRG-11`'s existing "failed or abandoned run grants no first-clear reward"
  for the same reason.
- No further cap is added at this stage: a genuine solve still costs the section's target
  three-to-six-minute run, which is a slower rate than practising ordinary questions. If a
  trivial early scenario turns out to be worth farming once this is measured against real
  play, add a per-day cap per scenario rather than removing the reward outright.
