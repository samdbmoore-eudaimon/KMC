# Ninefold Orchard Expeditions: ten-map route

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. This document preserves curriculum and
> implementation sequencing. The individual map set-pieces and asset intent are superseded by
> `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` and `EXPEDITIONS_SCENARIO_ART_MATRIX.md`.

Status: proposed implementation brief. This is the first complete Expedition route and the
model for Little Reckoning and Gifford. It is for ages 8–11: concrete objects, whole numbers
from 0 to 20, fully visible enemy intentions and one clear win sentence per map.

Only Map 1 currently has a production engine trace. The level names and families in
`expeditions/expedition-data.js` are catalogue placeholders for Maps 2–10; this document is
the intended numerical and scenario design to align with that data before each map is built.

## Route rules

- A normal first clear should take four to five minutes, never more than seven.
- Missions 1–3 introduce one board verb at a time. Missions 4–6 combine two familiar verbs.
  Missions 7–10 require a plan across the whole board, not harder arithmetic alone.
- Every map has a deterministic reference solution and at least three procedural variants.
- Enemy pressure is visible before the player ends a round. It is a problem to solve, not a
  surprise punishment.
- Readiness is advice, never a lock. Late recommendations are intentionally stern because
  the board itself requires a strong, well-balanced party.

## Route at a glance

| Lv | Map | Maths and board verb | What makes cards matter | Expected collection |
|---:|---|---|---|---|
| 1 | The Unequal Crossing | Make two totals of 7, carry and drop | Speed shortens delivery; Guard protects a load; optional supported combat | Commons plus a few Uncommons |
| 2 | The Counting Orchard | Make exactly 12 at the harvest gate | Arithmetic can combine or split; Speed reaches a moving basket | Commons plus a few Uncommons |
| 3 | Nine Across the Bridge | Deliver loads while capacity never exceeds 9 | Geometry shifts a load, Speed relays, hearts absorb Crosswind pressure | Uncommon-heavy |
| 4 | The Widdershins Path | Visit 2, 4, 6, 8 in order | Logic repairs the reversed stone; Speed gives a safer route | Uncommon-heavy |
| 5 | The Maybe-Flock Roost | Hold three posts together | Three heroes must occupy separate places; Scout marks and Guardian holds | Rare-heavy |
| 6 | Ten Honest Bundles | Make two separate totals of 10 | Arithmetic rearranges values; Science stabilises a threatened bundle | Rare-heavy |
| 7 | Count the Murder | Close a nine-hex ring around a flock | Geometry spans the ring, Speed intercepts and an Epic specialist covers a gap | Rare/Epic mixture |
| 8 | The Hollow Bough | Keep one memorial hex empty and safe | Science repairs, Guardian protects and strong movement covers two approaches | Rare/Epic mixture |
| 9 | Every Basket One Short | Repair three linked basket totals | All heroes operate separate stations; Logic reveals a false tally, Arithmetic corrects values | Full Epic squad |
| 10 | The First Whistle | Reconnect nine branches to a founding stone | Three simultaneous jobs, network choices, repair and enemy pressure | Strong full Epic squad |

## Map 1: The Unequal Crossing

**Win:** place loads worth seven on each brass platform, then send one hero through the tally
arch before round four ends.

**Board state:** crates marked 2, 3, 4 and 5. The only all-crate split is 2 + 5 and 3 + 4.
Two Hookmoles spend their first two rounds studying the board, then drag the highest-value
unguarded load towards a burrow.

**Teaches:** select hero, Move, collect, carry, drop, read a changing total, Guard, inspect
an enemy intention and optional Basic Strike.

**Stat lesson:** this is deliberately forgiving. A Speed 4 card moves three hexes instead of
two and makes delivery simpler. A Guardian can protect the 5-crate. Two heroes beside a
Hookmole can support one another to reach its Defence. No player is required to fight.

**Procedural envelope:** retain weights 2, 3, 4 and 5 and target seven. Mirror the board,
swap which platform is reached by the longer route or swap the two Hookmole starting sides.
Never randomise the target or introduce a different partition in this teaching map.

**Readiness:** average BV 12. No specialist requirement.

**Reference party and trace:** lend Pip, Bramble and Nine when necessary. The existing locked
nineteen-action trace remains the acceptance trace.

## Map 2: The Counting Orchard

**Win:** fill the harvest gate with exactly twelve apples before the Scruffcrow reaches it.

**Board state:** six visible baskets valued 2, 3, 4, 5, 7 and 8 sit on three orchard lanes.
Only two baskets can occupy the gate. Each round the Scruffcrow advances one lane and pecks
the highest unguarded basket on that lane, reducing its value by one.

**Mathematics:** find a pair, or use a visible Arithmetic tool to form 12. The teaching
variant has two direct pairs, 5 + 7 and 4 + 8, plus one tempting near-miss of 11. Combine
can create another valid 7 from 3 + 4, leaving the 5 as its partner.

**Stat lesson:** an Arithmetic card can Combine two adjacent baskets or Split an even basket
to create another solution. A fast card can reach the threatened lane. A guarded basket is
safe. The player sees that different cards create different valid plans, rather than merely
adding damage.

**Procedural envelope:** choose target 10, 11 or 12; use six values from 1–8; generator must
create at least two direct or Combine-enabled solutions before enemy movement and at least one
solution after the advertised enemy action. The target, all candidate values and the peck
preview are visible.

**Readiness:** average BV 12. Suggested, not required: one Arithmetic card.

## Map 3: Nine Across the Bridge

**Win:** deliver three marked loads to the far orchard while no bridge section ever carries
more than nine weight.

**Board state:** loads 2, 3 and 4 start on different near-bank tiles. The bridge has two
sections, each displaying its live carried weight. Crosswind pushes an unguarded carrier one
hex sideways at the end of a round. A safe route is longer but has stone alcoves.

**Mathematics:** capacity and route planning. The player must understand that 2 + 3 + 4 = 9
is safe only when all three loads use the same bridge section at the same time. A careless
drop or a Crosswind push can overload it.

**Stat lesson:** Speed enables a relay or fast safe delivery. Geometry can True Shift a crate
into an alcove or across a straight bridge line. Geometry plus Science determines Hearts, so
a tougher card can endure Crosswind damage if the player chooses the shorter route.

**Procedural envelope:** choose load triples that total 8 or 9. Randomise which lane has the
safe alcove and which bridge section Crosswind targets. Solver must retain a route that does
not require taking damage.

**Readiness:** average BV 16, at least two Uncommon-or-better cards. Suggested: one Speed 4+
or Geometry 5+ card.

## Map 4: The Widdershins Path

**Win:** visit stones 2, 4, 6 and 8 in increasing order, then stand on the centre stone.

**Board state:** five numbered stepping stones form a loop. One visibly shows a backwards
arrow. The Widdershins creature reverses the next unguarded stone in the sequence at round
end. A reversed stone changes its entry direction, not its value.

**Mathematics:** ordering even numbers and following a simple directed route.

**Stat lesson:** Logic's Put in Order can repair the reversed stone or swap two ordered tiles.
A faster scout can take the outer route before the reversal. A Foresight trait lets a child
preview the creature's next consequence. This is the first map where information and route
quality can beat brute force.

**Procedural envelope:** use an increasing even sequence from 2–10; reverse exactly one
stone at the start and one predicted future stone. Preserve one route solvable without Logic
and a shorter route enabled by Logic.

**Readiness:** average BV 16, at least two Uncommon-or-better cards. Suggested: Logic 5+.

## Map 5: The Maybe-Flock Roost

**Win:** hold all three whistle posts at the end of one round.

**Board state:** three posts lie at the corners of a small triangle. Three Maybe-Finches fly
towards the nearest unguarded post. A post counts only if occupied by a hero who is not
exhausted. The finches have low Defence and one heart.

**Mathematics:** read a three-place spatial constraint and make a simultaneous arrangement.

**Stat lesson:** no single strong card can win: all three heroes are needed. Speed determines
whether a distant post is reachable. A Guardian keeps a post safe. A Scout mark lets an ally
remove a Finch efficiently. This is the first clear evidence that a balanced three-card party
beats three copies of one kind of hero.

**Procedural envelope:** rotate the triangle, select one of three entrance configurations and
vary which Finch has priority for the centre post. All intentions remain fully shown.

**Readiness:** average BV 22, at least two Rare-or-better cards. Suggested: one Speed 6+ or
one Guardian.

## Map 6: Ten Honest Bundles

**Win:** make two separate bundles worth exactly ten and keep them unchanged until the next
round boundary.

**Board state:** values 1, 1, 2, 2, 4, 5 and 5 lie around two packing tables. Strawlings move
towards the most valuable unguarded table and change one loose value by +1 each round.

**Mathematics:** partition values into two exact groups, with no item used twice. The central
teaching case is 5 + 4 + 1 and 5 + 2 + 2 + 1. Both groups are worth ten and all seven values
are used exactly once.

**Stat lesson:** Arithmetic makes and checks exact values. Science can Stabilise a table across
the enemy phase. Guardians give an alternative defence. Higher Hearts make it possible to
hold a dangerous table while a partner completes the other.

**Procedural envelope:** use values 1–8, target 8–12 and exactly two valid partitions. The
generator must show the values and certify no easy third partition invalidates the lesson.

**Readiness:** average BV 22, at least two Rare-or-better cards. Suggested: Arithmetic 6+ or
Science 6+.

## Map 7: Count the Murder

**Win:** complete a marked nine-hex ring around the moving crow flock and hold it through one
enemy phase.

**Board state:** the flock moves one step towards the largest unsealed gap. Ring segments are
activated by standing on them, placing a stone or using Shape Field. One Crowbreaker attacks
the highest-numbered active segment.

**Mathematics:** recognise a closed ring and reason about gaps, adjacency and a perimeter of
nine. This remains visual and countable, not formal graph theory.

**Stat lesson:** a Geometry 7+ Shape Field can activate a multi-hex straight segment. Speed
is needed to intercept the flock's likely escape. A strong primary striker or supported team
can remove the Crowbreaker. Each hero has a separate job, so one Epic card cannot make three
weak cards adequate.

**Procedural envelope:** use three ring shapes with nine marked cells, choose one of two
flock starts and one of three initial gaps. Solver must prove a four-round solution with the
recommended squad and no unannounced forced combat.

**Readiness:** average BV 28, at least one Epic, no Common cards. Suggested: Geometry 7+.

## Map 8: The Hollow Bough

**Win:** keep the memorial hex empty and undamaged until the fourth whistle.

**Board state:** two Overgrowths approach along different lanes. A falling branch is forecast
to land on one of three adjacent hexes each round. The memorial is damaged if an enemy enters
it, a crate is dropped on it or an unstable branch reaches it.

**Mathematics:** compare routes and use a simple exclusion region: the protected hex must
remain empty while adjacent tiles are used strategically.

**Stat lesson:** Science repairs or Stabilises a branch. Geometry moves an obstacle into a
lane. Speed covers the second approach. Guardians protect the memorial. The party must split
without losing the ability to support a strike, which makes strong Hearts and stats matter.

**Procedural envelope:** choose two approach pairs and one of three branch schedules. Show all
four whistles and every branch forecast at the start. At least one plan must avoid combat.

**Readiness:** average BV 28, at least one Epic, no Common cards. Suggested: Science 7+ and
one Guardian or Geometry 7+.

## Map 9: Every Basket One Short

**Win:** correct three linked basket rows so every displayed tally is exact at the same round
boundary.

**Board state:** three tables each show a target and two baskets. Every basket initially has a
number one short or one over its correct value. Changing a basket also changes the linked row
or column tally. The Nearly creature attempts to reverse the last unguarded correction.

**Mathematics:** a small fully visible 3-by-3 constraint grid using totals up to 20. Children
deduce which one-step changes make all three row targets agree. No hidden values.

**Stat lesson:** Arithmetic applies exact corrections. Logic can Deduce and lock a known-correct
basket. Science can Stabilise a completed row. Three stations force all three heroes to
contribute in the final round. A low-stat party can begin, but will not have enough movement,
checks and enemy resilience to complete all stations.

**Procedural envelope:** generator chooses targets and starting values from a pre-solved 3-by-3
template, then changes exactly three entries by plus or minus one. It must have one intended
solution, no values below zero and an explanation trace suitable for the field report.

**Readiness:** average BV 32, all three cards Epic or Legendary. Suggested: Arithmetic 7+ and
Logic 7+.

## Map 10: The First Whistle

**Win:** reconnect all nine orchard branches to the founding stone and keep the root from
breaking a completed connection before the fifth round ends.

**Board state:** nine branch tiles form a small visible network. Each tile has a simple port
shape and a value. A connection is active only when ports match and the joined values satisfy
the displayed rule, such as `sum 9` or `difference 1`. The Forgetting Root advances towards
the most recently repaired unguarded branch.

**Mathematics:** build a connected network using small number relationships, counting degree
and avoiding a cycle that disconnects a needed branch. All node values stay 0–20.

**Stat lesson:** Geometry rotates or shifts a branch into place, Arithmetic verifies a
connection rule, Science repairs a damaged link and Logic predicts the Root's next target.
Three repairs in different areas must be made in the same round, then defended. This is why a
full Epic squad is recommended: it requires several strong specialists, movement and survival
at once, not simply a large attack value.

**Procedural envelope:** select from hand-authored nine-node templates with a unique intended
spanning network, rotate a subset of tiles and randomise one Root entry lane. Do not generate
arbitrary graphs for the first version. Every template needs a solver proof, a minimum of two
plausible-looking wrong connections and a clear post-loss explanation.

**Readiness:** average BV 34, all three cards Epic or Legendary. Suggested: Geometry 8+,
Arithmetic 7+ and Science or Logic 7+.

## First implementation sequence

1. Preserve Map 1's tested engine trace, but add the required card-stat and combat previews.
2. Build Maps 2 and 3 next. Together they prove exact totals, capacity, Arithmetic, Geometry,
   Speed, Guard and visible enemy pressure.
3. Build Map 5 before Map 4 if a three-hero simultaneous-objective test is needed early.
4. Do not implement Maps 7–10 until their visible-check contract, readiness display and
   scenario solver tests exist.

## Non-negotiable tests for every map

- A reference squad completes the map inside the stated round limit.
- A lower-readiness squad may embark, but its predicted shortfall appears in the briefing and
  is reproduced by the board's fixed rules.
- Every procedural seed has a solution and a child-readable explanation.
- No enemy action creates an unannounced impossible state.
- The map can be completed without relying on a visual distinction that is not also labelled.
