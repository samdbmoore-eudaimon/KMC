# The Mill That Would Not Turn

Design demonstration v0.1, 30 September 2026. Proposed rules, not implemented game behaviour. Actual Orchard card statistics and current roles are retained. All abilities, enemy values and encounter rules below are new design candidates. The five-minute duration is a target awaiting child playtesting.

## What the child sees first

> The mill has stopped. The bread has not. Mrs Bushel considers this a serious disagreement.
>
> Open the sluice, turn the three water tiles to reach the mill and drive away the two thorn creatures.
>
> Tap a creature to see its next attack. You have four rounds.

The board highlights the sluice and mill when those words are selected. The three rotatable tiles show their tracks directly. Initially, the Warden's intent points at the mill and the Rootling's intent points at the mechanism operator. No special vocabulary is required to begin.

## The squad: real card values

| Hero | Existing role | Arithmetic | Geometry | Logic | Science | Speed |
|---|---|---:|---:|---:|---:|---:|
| Cornix | Guardian | 6 | 2 | 6 | 3 | 4 |
| Kernel | Reckoner | 6 | 7 | 3 | 3 | 2 |
| Beeswax | Mender | 2 | 2 | 4 | 6 | 7 |

Source: `expeditionRoster('primary')`, inspected on 30 September 2026. These are three Uncommon cards. This encounter demonstrates what a modest specialist team can do; it is not a late-campaign readiness test.

Demo health is 6 + Science: Cornix 9, Kernel 9, Beeswax 12. Movement is 1 + floor(Speed / 2): Cornix 3, Kernel 2, Beeswax 4. These provisional formulas are for this demonstration only. They do not establish final whole-roster balance.

## Turn rules

- Each living hero may move once, up to their movement budget, then take one action. They may omit movement. Choose hero order freely.
- Movement cannot pass through or end on another unit. Embedded mechanism tiles and the spring are walkable. Hedges and the mill building are not.
- Each hero starts with the three ability cards listed below. Play one and discard it for this encounter. There is no random draw or automatic recovery.
- Basic actions remain available: Strike an adjacent enemy for Arithmetic damage, turn one adjacent unlocked water tile to any orientation or operate the sluice while standing on it. Basic actions use the hero's action without discarding a card.
- All effects, ranges, expenditure and enemy consequences preview before commitment. Cancel or undo during the player phase. The demo does not use time pressure for thinking or answering.
- After all chosen actions, end the round. Recompute connectivity; a powered mill fires first, then surviving enemies act in Warden/Rootling order. Clear temporary protection and restore actions for the next round.
- Win when the water route is live and both enemies are defeated. Check victory after each action and after the mill pulse. Lose immediately if the mill reaches zero integrity or every hero is defeated; otherwise lose after the fourth enemy phase if not won.
- A hero at zero health is out for this encounter and cannot act or receive healing. The demonstration's two reference plans have no defeated heroes.

## Nine ability cards

These are the complete demo hand effects. Each card has one effect, short visible text and an expandable calculation. Dual-use cards remain an option for the wider design, not an extra rule in this first demonstration.

| Hero | Ability | Exact proposed effect |
|---|---|---|
| Cornix | Stand Firm | Challenge an enemy within 2 hexes whose Resolve is no greater than Logic. Its next attack this round targets Cornix instead. Reduce that attack's damage by Geometry, to a minimum of zero. The challenge bypasses that attack's ordinary target range. |
| Cornix | Reckoned Blow | Strike an adjacent enemy for Arithmetic. Optional one-use maths boost adds 6 before armour if solved correctly. |
| Cornix | Drive Back | Deal ceil(Arithmetic / 2) to an adjacent enemy, then push it one hex directly away if that destination exists and is unoccupied, walkable and not a building. Anchored enemies cannot be pushed; damage still applies. |
| Kernel | Turn Together | Choose any unlocked water tiles within 2 hexes whose printed resistance totals no more than Geometry. Set each chosen tile to any of its six orientations. The player chooses the orientations; the game does not solve them. |
| Kernel | Angle Shot | Deal Geometry damage to an enemy within 2 hexes. |
| Kernel | Wedge | An adjacent water tile cannot be rotated until the end of the next enemy phase. The player may inspect it but cannot turn it either. Useful against future interference, but unnecessary against these two enemies. |
| Beeswax | Shared Remedy | Allocate up to Science healing, in whole numbers, between one or two living heroes within 3 hexes. Cannot exceed a recipient's missing health. Beeswax may target herself. |
| Beeswax | Thorn Dart | Deal Science damage to an enemy within 3 hexes. |
| Beeswax | Slipstream | Move a willing other hero within 2 hexes up to ceil(Speed / 2) hexes along a legal path. This does not consume that hero's movement or action. |

Armour subtracts from damage, to a minimum of zero. This replaces the current engine's 0/1/2 impact bands for the demo. Attacks and abilities require a clear line between tile centres; hedges and the mill block sight, units and water tiles do not. Endpoints do not block their own targeting. Neither reference plan has an obstructed line.

Unused cards are real alternatives, not required steps. Wedge is deliberately a poor pick in this encounter: team/hand value should depend on the mission. Later design work should determine whether hands are fixed or selected from a wider hero repertoire.

## Board and puzzle

Use pointy-top axial hexes, radius 3: all `(q,r)` with max(abs(q), abs(r), abs(q+r)) <= 3. Hedges occupy `(0,2)` and `(0,-2)`.

| Entity | Coordinate | Starting state |
|---|---|---|
| Spring | (-1,0) | Output towards the east |
| Water tile A | (0,0) | Straight track, resistance 2, orientation 2 |
| Water tile B | (1,0) | Bent track, resistance 3, orientation 0 |
| Water tile C | (1,1) | Bent track, resistance 4, orientation 1; locked until sluice opened |
| Mill | (2,1) | 8 integrity, inlet from the west |
| Sluice | (2,-2) | Closed |
| Cornix | (-1,2) | 9 health |
| Kernel | (-1,1) | 9 health |
| Beeswax | (-2,1) | 12 health |
| Thorn Warden | (2,0) | 18 health, armour 2, Resolve 6, anchored |
| Rootling | (0,-1) | 6 health, armour 0, Resolve 3, anchored |

Edge indices increase clockwise: 0 east, 1 south-east, 2 south-west, 3 west, 4 north-west, 5 north-east. Rotation adds its orientation modulo 6 to each base port. Tile A has base ports [0,3]; B and C have [0,2]. There are no hidden track connections.

The route must run Spring → A → B → C → Mill. The player can reason backwards from the mill: B is north-west of C, so C must connect north-west to east. B must connect west to south-east. A must connect west to east. The board must communicate this through the actual tracks; do not show this worked solution before the player requests a hint.

Valid orientations: A = 0 or 3, B = 1, C = 4. Both equivalent straight-tile orientations are accepted. There are exactly two winning orientation triples, representing the same connected route. Open the sluice as well to make the circuit live.

Tile resistance measures the effort required to turn it with Turn Together, not how many 60-degree clicks the player makes. Any hero can turn one adjacent unlocked tile with a basic action regardless of resistance. Geometry 7 lets Kernel turn A+B together (cost 5), A+C together (cost 6) or B+C together (cost 7), but never all three (cost 9).

The powered mill removes the Warden's armour immediately and deals 4 damage to it at the start of each end-round resolution. Defeating enemies alone does not restart the mill; finishing the puzzle alone does not remove the Rootling.

## Enemy intentions

Both creatures are anchored to their tiles. This is a compact siege encounter; future missions need mobile enemies too. Do not mistake these stationary opponents for the whole proposed combat system.

**Thorn Warden** alternates:

- Odd rounds: fire a 6-damage volley at the mill. A successful Stand Firm redirects it.
- Even rounds: rake an adjacent living hero for 6. Choose the lowest current health, then alphabetical hero ID. If none is adjacent, hit the mill for 6 instead.

**Rootling:** deal 4 to the living hero who most recently turned a water tile, if that hero is within 3 hexes and visible. Otherwise deal 4 to the mill. The initial intended operator is Kernel. Retarget the preview whenever an action changes the selected target or its legality.

## Playthrough A: protect, solve, then finish

### Round 1: everyone has a different job

1. Beeswax moves four hexes: (-1,0), (0,0), (1,-1), (2,-2). She opens the sluice with her basic action. Tile C unlocks. Her Speed 7 makes this possible now; a Speed 2 hero moves only two hexes and cannot follow this timing.
2. Cornix moves through (0,1) to (1,0), standing on B. He plays Stand Firm against the Warden. Logic 6 meets Resolve 6; Geometry 2 will absorb two damage. Without the challenge, the mill would fall from 8 to 2 integrity this round.
3. Kernel moves to (0,1). He plays Turn Together on A and B, setting them to 0 and 1. Their resistance totals 5, within his Geometry 7. C still points the wrong way. There is no automatic selection of the correct settings.
4. End round. The mill is not powered. The Warden's volley hits Cornix for 6 − 2 = 4: health 9 → 5. Rootling hits Kernel for 4: health 9 → 5. The mill stays at 8.

Decision: Kernel could instead align B+C or A+C. The third tile would still require a later action. Basic rotations could solve it too, but would consume more of the team's actions.

### Round 2: allocate healing and spend the attack

1. Beeswax plays Shared Remedy from the sluice. Cornix is two hexes away; Kernel is three. She has 6 healing to share. Allocate 4 to Cornix and 2 to Kernel: Cornix 5 → 9, Kernel 5 → 7. The visible next attacks are 6 and 4, so both will survive. A 3/3 split also works; all 6 on either hero cannot be accepted because each is missing only 4.
2. Cornix plays Reckoned Blow before the circuit is live. The Warden still has armour 2. He takes the optional boost challenge:

   > A lantern holds 12 sparks. Three quarters enter the beam. One third of those are lost in the rain. How many reach the Warden?

   Three quarters of 12 is 9; one third of 9 is 3; 9 − 3 = **6**. The powered blow is Arithmetic 6 + boost 6 − armour 2 = **10 damage**. Warden health: 18 → 8.

   On a wrong answer, keep the action uncommitted and give a staged hint. The child can use a worked explanation to earn the boost or choose the ordinary 6-power blow. No guess penalty or reaction timer. This teaching choice is provisional.
3. Kernel takes a basic turn action on adjacent C and chooses orientation 4. The route is now live. Warden armour becomes zero.
4. End round. The mill pulse deals 4: Warden 8 → 4. Its rake hits adjacent Cornix for 6: 9 → 3. Rootling hits Kernel for 4: 7 → 3. Both enemies have affected play twice.

Decision: turning C before attacking removes the armour first and gains another 2 damage. The shown order is intentionally safe but not optimal; the interface should let a child discover and improve it. It does not change this route's three-round finish.

### Round 3: divide the targets

1. Beeswax plays Thorn Dart at Rootling, two hexes away. Science 6 deals 6; Rootling is defeated. Her role has provided both recovery and a finishing attack.
2. Cornix uses his basic Strike against the adjacent Warden. Arithmetic 6 exceeds its remaining 4 health and armour is zero. The Warden is defeated. Kernel need not spend another card.
3. Both threats are gone and the water route is live: victory before another enemy phase. Mill integrity is 8; Cornix and Kernel each have 3 health.

Not every hero needs to act in the final round. Requiring filler actions would work against the five-minute target.

## Playthrough B: a faster, exposed two-round clear

Use the same positions and board:

- Round 1: Beeswax opens the sluice; Cornix uses basic Strike for 6 − 2 = 4 damage instead of Stand Firm; Kernel aligns A+B. Warden falls to 14 health. The volley hits the mill, leaving only 2 integrity; Rootling reduces Kernel to 5 health.
- Round 2: Kernel aligns C first, removing armour. Cornix's boosted Reckoned Blow deals 12, leaving Warden on 2. Beeswax uses Thorn Dart to defeat Rootling instead of healing. End round: the mill pulse defeats Warden before it can rake. Victory with mill integrity 2.

This plan uses action order, a maths-powered ability and precise enemy timing. If Cornix takes the unboosted blow, Warden survives that round's pulse on 4 health and rakes him down to 3. The team still has a recovery line: Cornix's basic Strike finishes it in round 3 before its next mill volley. The fast plan therefore carries a visibly damaged mill and less tolerance for further mistakes, rather than an undisclosed instant-loss trap.

## What changed because of the cards

- Arithmetic 6: Cornix's ordinary and boosted damage are visible quantities, not identical 1-impact attacks across a broad stat range.
- Geometry 7: Kernel turns two mechanisms with one action. Geometry 4 could not turn even the cheapest pair, A+B costing 5, in that action.
- Logic 6: Cornix can divert this Resolve-6 Warden. Bushel, another Guardian with Logic 2, cannot use the same safe opening against it. A different team needs a different plan.
- Science 6: Beeswax divides six healing and defeats a six-health Rootling with one Dart. Science 5 would leave that enemy alive on one health.
- Speed 7: Beeswax reaches the sluice in four steps. Pip, a Mender with Speed 2 and Science 6, retains the healing strength but needs different movement support or a later opening.
- Roles: Guardian protection, Reckoner multi-tile manipulation and Mender shared healing are distinct actions. The same stat profile on another role would not supply the same hand.

These are demonstrated local differences, not proof of whole-game balance. The current formulas still contain movement thresholds and favour Science for health; evaluate that across the full roster before adopting them.

## What this demonstration should help us decide

Does spending a small hero hand while solving the mechanism feel like the intended game? Are three rounds enough when each contains a puzzle or tactical choice? Does this amount of arithmetic and deduction feel appropriate?

This three-tile network is a compact proof of combined combat and puzzle play. It does not yet demonstrate the complexity required of later deduction missions. The next contrasting example should use an overlapping-clue or number-cage puzzle, with enough deductions that the answer is not immediately apparent.

The step-through is an explanation of verified scripted plans, not a free-play prototype. No existing engine, art, access gate or progression data has been changed.

Validation: `node scripts/dev/expeditions-storm-mill-demo.cjs` checks the cautious, fast and unboosted recovery traces, including movement, range, line of sight, action budgets, used cards, healing, enemy resolution and victory. It enumerates all 216 orientation triples and accepts exactly the two equivalent connected solutions. The demonstration's Previous/Next controls and both playthrough choices were also exercised in a DOM runtime. This does not constitute child timing or usability acceptance.
