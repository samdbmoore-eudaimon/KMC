# Gifford Expeditions: ten-map route

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. This document preserves curriculum and
> implementation sequencing. The individual map set-pieces and asset intent are superseded by
> `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` and `EXPEDITIONS_SCENARIO_ART_MATRIX.md`.

Status: proposed implementation brief. Gifford is for ages 12–16. It uses the same readable
grid tactics as the earlier modules, but treats the board as a compact system of algebraic,
logical and optimisation constraints. A normal clear targets six minutes, never more than nine.
Four cards deploy by default; selected challenge maps may use three or five only when the
briefing explains why.

## What changes after Little Reckoning

| Little Reckoning | Gifford |
|---|---|
| One or two linked constraints | Two or three simultaneous constraints |
| Short expressions and concrete bounds | Algebraic equivalence, inequalities, percentages and optimisation |
| Intent visible after an opening action | Conditional intent, with Logic exposing the condition |
| Short route or local network | Changing weighted graphs, dependencies and trade-offs |
| Strong squad covers two jobs | Four heroes coordinate separate jobs without a spare action |

The map must state all formal rules precisely. Difficulty comes from reasoning about the
system, never from tiny text, arbitrary symbols or a hidden numerical bonus.

## Route at a glance

| Lv | Map | Core mathematical problem | Tactical and card pressure | Expected collection |
|---:|---|---|---|---|
| 1 | The Examination Clock | Schedule tasks through stations before a deadline | Time slots, dependency order and Speed | Commons and Uncommons |
| 2 | Cross's Pursuit Network | Find a minimum route while used edges change cost | Weighted graph, dynamic edge costs and Logic prediction | Commons and Uncommons |
| 3 | The Sealed Archive | Satisfy row, column and parity constraints | Constraint grid, linked vaults and enemy timing | Uncommon-heavy |
| 4 | Vex's Demonstration | Build equivalent expressions from disjoint terms | Algebraic equivalence and resource allocation | Uncommon-heavy |
| 5 | Bramwell's Compromise | Balance flow, pressure and cost | Trade-offs and constrained optimisation | Rare-heavy |
| 6 | Vale's Filing System | Build a degree-limited spanning network | Graph degree, disruption and repair | Rare-heavy |
| 7 | Whistle's Price | Complete trades under percentage, ratio and capacity rules | Three simultaneous numerical conditions | Rare/Epic mixture |
| 8 | Scarrow's Ring | Win combat while controlling the median-valued hex | Ordered values, conditional attacks and area control | Rare/Epic mixture |
| 9 | The Chancellor's Ledger | Deduce six entries from inequalities and statements | Logic grid, mutually exclusive clues and time pressure | Full Epic squad |
| 10 | The Engine's Answer | Minimise maximum delay in a changing graph | Minimax routing, dependencies and multi-hero scheduling | Strong full Epic squad |

## Map 1: The Examination Clock

**Win:** route four examination tasks through three stations before the twelfth bell while
respecting every displayed prerequisite.

**Mathematics:** a small scheduling problem. Tasks have durations, a required station and
possibly one predecessor. The player minimises idle time, but only needs to meet the fixed
deadline for a standard clear.

**Pressure:** Proctors close one predicted station for one action if no hero is present. Their
visible conditional intent names the closure rule.

**Card lesson:** Speed controls physical arrival and initiative. Logic Predict exposes which
station will close. Science can Stabilise a station. Four heroes introduce task allocation
without requiring advanced notation.

**Variation:** choose from audited four-task dependency templates with total durations 8–12.
Randomise one station closure subject to a verified deadline-feasible schedule.

## Map 2: Cross's Pursuit Network

**Win:** reach the observatory by a route with minimum total cost before the tracker catches
the courier.

**Mathematics:** weighted paths. Using an edge increases the cost of one named neighbouring
edge, so the shortest-looking first step may make the eventual route worse.

**Pressure:** Trackers follow the lowest current-cost path to the courier. A Hound blocks a
single route marker when a stated condition is met.

**Card lesson:** Logic reveals the next cost reaction, Geometry reorients a route marker and
Speed gives a courier an escape margin. The player must calculate changing costs rather than
choose by visual distance.

**Variation:** hand-authored five-to-seven-node graphs with a unique minimising route after
the declared cost reaction. Generator may permute labels and one starting edge only.

## Map 3: The Sealed Archive

**Win:** satisfy the row, column and parity constraints to open three linked vaults.

**Mathematics:** a compact constraint grid. Entries are public values or parity tokens and all
row and column totals are shown. Opening one vault changes a stated feeder value for another.

**Pressure:** an Archive Warden advances after a delay, while Cipher Moths alter an unguarded
feeder under a public rule.

**Card lesson:** Arithmetic combines values, Logic locks a deduction and Science protects a
feeder. The party must sequence actions around the delayed enemy rather than merely fill cells.

**Variation:** use pre-solved grids with unique solutions and fixed parity conventions. Vary
the feeder order, one given value and enemy entry position only after solver verification.

## Map 4: Vex's Demonstration

**Win:** build two algebraically equivalent expressions using disjoint term tiles, then hold
both proof stands through the end of the round.

**Mathematics:** simplify and compare linear expressions such as `2(x + 3)` and `2x + 6`.
Terms may not be reused. The board displays expansion and simplification steps when inspected.

**Pressure:** Vex Assistants remove an unguarded term tile from the expression with the larger
current coefficient count.

**Card lesson:** Arithmetic combines like terms. Logic can verify an equivalence before the
player commits a proof stand. Geometry shifts a term along a constrained line. Stronger cards
make it possible to protect and assemble both stands in the same round.

**Variation:** select expression pairs from an authored bank with one intended disjoint
partition. Coefficients remain small integers and no hidden variable convention is introduced.

## Map 5: Bramwell's Compromise

**Win:** choose valve settings that keep flow within bounds, pressure below its cap and total
cost within budget for one round.

**Mathematics:** constrained optimisation. No setting maximises every quantity, so the player
must find a feasible compromise, then optionally improve efficiency for performance marks.

**Pressure:** Pressure Valves alter one forecast value each round. The preview shows both the
new value and which constraint it threatens.

**Card lesson:** Science transforms a valve state, Arithmetic checks totals and Logic predicts
the next perturbation. A visible check based on Science or Arithmetic can operate a high-load
valve. This is the first map where an underpowered specialist loses an entire feasible branch.

**Variation:** use a library of small linear systems with integer solutions and two to four
feasible settings. Solver must identify one normal-clear setting and one efficiency-optimal
setting, never falsely claim a unique optimum.

## Map 6: Vale's Filing System

**Win:** connect every archive desk to the central file while observing the displayed degree
limits and surviving one predicted edge closure.

**Mathematics:** build a spanning network. Each node has a maximum number of connections;
cycles can be legal but may waste a scarce degree.

**Pressure:** Clerk Drones close one predicted edge and then move towards the least protected
high-degree desk.

**Card lesson:** Geometry connects and repairs an edge, Science stabilises a critical link and
Logic reveals the closure condition. A team needs coverage in several parts of the network;
one high-power fighter is of little help.

**Variation:** use hand-authored six-to-eight-node graph templates with an intended robust
spanning solution. Permute node labels and one closure candidate only.

## Map 7: Whistle's Price

**Win:** complete three trades that jointly satisfy percentage discount, ratio and carrying
capacity constraints.

**Mathematics:** percentages, ratios and bounds. Each trade looks manageable alone, but the
same stock and capacity are shared. Values and formulae are visible before a hero commits.

**Pressure:** a Broker raises one price under a stated condition, while a Collector blocks the
most overloaded carrier.

**Card lesson:** Arithmetic is needed at three stations, Speed delivers the chosen stock and
Logic identifies which price reaction will matter. Separate stations force the full party to
meet different numerical requirements on the same round.

**Variation:** generate from audited trade bundles with integer or terminating-decimal answers,
at least one feasible set and one common percentage-error distractor. Never use ambiguous
rounding.

## Map 8: Scarrow's Ring

**Win:** defeat Scarrow while controlling the hex whose value is the median of the active ring
at each round end.

**Mathematics:** ordered data and median under change. The ring's values and any update are
public, so the player re-evaluates the median rather than memorising a fixed central tile.

**Pressure:** Scarrow's conditional strike is stronger when the party does not control the
median. Two Seconds change two values after their intent conditions are met.

**Card lesson:** combat uses the normal visible Power calculation, but good attacks must be
scheduled around median control. Logic forecasts the value change, Speed reaches the next
median and a strong striker needs support. This is tactical maths combat, not a damage sponge.

**Variation:** select odd-sized ring sets of five or seven values with one or two planned
updates. Solver must prove a controllable median each round and a combat win within five rounds.

## Map 9: The Chancellor's Ledger

**Win:** deduce six hidden entries from inequalities, totals and mutually exclusive statements,
then secure the ledger before the guards erase a row.

**Mathematics:** a formal logic grid with inequalities and exactly-one conditions. Every clue
is accessible as text and all candidate domains are displayed.

**Pressure:** Ledger Guards erase a predicted unguarded row after a stated delay. Erasure does
not make the puzzle unknowable: it removes a convenient representation and raises the action
cost of restoring it.

**Card lesson:** Logic Deduce locks correct entries, Arithmetic verifies totals and Science
stabilises a row. The four heroes must secure separate deductions while protecting the ledger,
which is why a full Epic team is recommended.

**Variation:** only use authored clue sets with a machine-verified unique solution. Generator
may permute names, row order and one equivalent clue wording, not the logical structure.

## Map 10: The Engine's Answer

**Win:** route three signals through a changing weighted graph and minimise the maximum arrival
delay while keeping all essential stations live.

**Mathematics:** minimax optimisation with dependencies. The player compares the worst signal
arrival time, rather than merely minimising one path or the total. Edge weights change when a
station becomes active and some signals cannot travel before another has reached a gate.

**Pressure:** Engine Processes alter a named edge cost or temporarily disable a station under
shown conditions. Their behaviour is deterministic but requires the player to plan ahead.

**Card lesson:** Logic reveals conditional reactions, Geometry repairs or redirects a route,
Science stabilises a station and Speed keeps a delayed signal within the deadline. Four strong
specialists must execute in different regions, making a full Epic squad a meaningful practical
recommendation rather than a rarity lock.

**Variation:** use authored seven-to-nine-node dependency graph templates with solver-proven
minimax values. Randomise equivalent node labels and one process entry condition only. No
arbitrary graph generation until a complete exact solver is in place.

## Implementation and validation sequence

1. Preserve The Examination Clock and The Sealed Archive reference traces.
2. Build a general weighted-graph and dynamic-edge solver before claiming Map 2 or Map 10 is
complete.
3. Build algebra-expression equivalence as a validated, inspectable object system before Map 4.
4. Build constrained-system and degree-limited-network fixtures before Maps 5 and 6.
5. Build percentage/ratio, median-control and unique-clue solvers before Maps 7–9.
6. Every map requires target-band squad simulation, an explicitly weaker squad with a real
shortfall and a performance-mark reference trace. No map is complete merely because its
objective evaluator returns true.
