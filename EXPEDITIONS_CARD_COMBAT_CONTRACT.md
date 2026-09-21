# Expeditions card, combat and collection contract

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. Scenario-specific uses of this contract
> are assigned in `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md`.

Status: proposed product contract for implementation planning. This document closes the
gap between a collected card and a decision on an Expedition board. It does not approve a
release of Expeditions.

## 1. The promise to the player

An Expedition is won by solving the visible mathematical situation on the board. Better
cards make more solutions available and make difficult plans reliable. They do not replace
the mathematical plan, turn the game into random combat or prevent a child from attempting
a map.

Every card must answer four player questions before deployment:

1. How far can this character get?
2. What board problems can this character solve?
3. How well can this character survive or help in a fight?
4. Why is this card a better choice than a weaker one?

The squad-selection screen and every in-board action preview must answer these questions
with numbers, not rarity colour alone.

## 2. Card profile used by Expeditions

An Expedition field card has these inputs:

| Input | Source | Board meaning |
|---|---|---|
| Arithmetic, Geometry, Logic, Science, Speed | Printed card statistics | Action strength and visible scenario checks |
| Primary discipline | The card's primary statistic | Default strike statistic and the character's three discipline tools |
| Role | Existing Adventure role | One permanent tactical support action |
| Trait | Second-highest printed statistic | A small, clearly labelled tactical exception |
| Battle value and rarity | Existing card data | Collection-readiness guidance, never an entry lock |
| Adventure-honed status | Completed card Adventure | Must be shown honestly once its Expedition effect is implemented |

The current engine already derives movement, hearts, initiative, discipline, role and
trait from the printed profile. It must continue to use the real card values rather than
inventing a separate Expedition level.

## 3. What every statistic does

| Statistic | Permanent effect | Typical visible check or tool |
|---|---|---|
| Arithmetic | Governs the default strike for Arithmetic-primary cards | Combine, split, calibrate an exact total or meet a capacity |
| Geometry | Contributes to hearts | Push or pull, shape fields, range through an obstacle, terrain geometry |
| Logic | Governs the default strike for Logic-primary cards | Predict intention, reveal a rule, order tiles or eliminate a false option |
| Science | Contributes to hearts | Stabilise, repair, transform state or propagate through a network |
| Speed | Sets movement and initiative | Dash, relay, intercept, reach a timed station |

Derived values are fixed and visible:

```text
Move   = min(4, 2 + floor(Speed / 4)) hexes per Move action
Hearts = min(5, 2 + floor((Geometry + Science) / 7))
Initiative = 12 - Speed, lowest value acts first
```

Role changes how a card helps a team: Guardians guard an adjacent ally or object,
Menders restore a heart or repair, Reckoners change an operation or orientation, Movers
push after a close action and Scouts mark a visible target. Traits remain small bonuses,
not a second class system.

## 4. Visible checks

Some map objects need more than being adjacent. A scenario may declare a **visible check**:

```text
Check power = named statistic + shown support + shown terrain or object bonus
Success when check power meets the printed difficulty
```

There is no die roll and no hidden threshold. The preview names the statistic, every bonus,
the difficulty and the result before confirmation.

Examples:

- `Geometry 7 required`: shift a jammed bridge panel.
- `Science 8 required`: stabilise a leaking value node for one enemy phase.
- `Speed 6 required`: reach a closing gate in one action.
- `Logic 7 required`: identify the true route before committing to it.

An ordinary action is never silently converted into a check. The scenario briefing, object
label and action preview all state that the check exists.

This is the main way a stronger specialist changes a mathematical puzzle: it can open a
route, hold a state or reveal information that a weaker character cannot. The player still
chooses whether that route is the right solution.

## 5. Combat

Combat is short, deterministic and usually serves the map objective.

### Basic strike

The basic strike uses the attacker's primary-discipline statistic by default. A scenario
may explicitly name another governing statistic for a special attack, but it must show this
before squad selection and in the action preview.

```text
Strike power = governing printed statistic + adjacent allied support
             + shown mark, trait and terrain bonuses

below Defence             = 0 impact
meets Defence             = 1 impact
at least 4 above Defence  = 2 impact
```

One adjacent ally gives one support. A Scout's mark, a Precise trait and a marked terrain
feature can add support only when shown in the preview. Enemy Defence, hearts, move, range,
damage and intent are public in Ninefold Orchard. Later modules may conceal a conditional
intent only when a Logic action can reveal it.

Example:

```text
Pip's Arithmetic 6 + Bramble adjacent support 1 = Power 7
Hookmole Defence 7 = 1 impact

With a further visible mark: 6 + 1 + 1 = Power 8 = still 1 impact
Against Defence 4: 6 + 1 = 7 = 2 impact
```

An enemy normally has one to four hearts. It should be defeated in one or two good tactical
turns, not treated as a long health bar. Defeating it must remove an obstacle, protect an
object, open a route or advance a stated combat objective.

### Mathematical combat by module

| Module | Combat question |
|---|---|
| Ninefold Orchard, ages 8–11 | Can I compare the numbers, stand together and make enough support to beat the Defence? |
| Little Reckoning, ages 10–13 | Can I choose an operation, estimate or interval that makes this attack valid? |
| Gifford, ages 12–16 | Can I satisfy the combat condition while controlling a changing inequality, median, route or reaction? |

Combat must never become the only answer unless the map is explicitly labelled Combat.
Most enemies are moving constraints: they steal a high-value crate, obscure an operator,
close a graph edge or damage a station. The player can defeat, guard against, intercept or
route around them.

## 6. How better cards make later maps genuinely harder

Rarity is a transparent shorthand for the usual quality of a card profile. It is not a
damage multiplier and it is not a hard permission gate. Battle value is the readiness
summary; the individual five statistics decide whether the squad fits the specific map.

| Mission band | Collection expectation | What the board demands |
|---|---|---|
| 1–2 | Commons and a few Uncommons | One clear verb, low Defence and generous time |
| 3–4 | Uncommon-heavy | A useful specialist or efficient positioning |
| 5–6 | Rare-heavy | Two visible specialist pressures at once |
| 7–8 | Rare/Epic mixture | Linked objective pressure, enemy interference and at least one Epic specialist |
| 9 | Full Epic squad | Three separate jobs in the same round, no Common card can be carried by one star |
| 10 | Strong full Epic squad | The module's signature mechanisms combine under visible pressure |

The briefing must state the recommendation as guidance, for example:

```text
Recommended: all three field cards Epic or Legendary
Recommended specialist: Geometry 7+ for the rotating bridge
Threat: the Brass Warden has Defence 8 and reaches the east platform in two rounds
```

Embark stays enabled. A weaker team can discover a clever route, but fixed enemy Defence,
fixed time pressure and visible checks do not soften for it. A late map is therefore difficult
because its rules demand more capacity from all three or four cards, not because the app
declines to let the child play.

## 7. Adventure upgrades

Adventure upgrades currently improve the parent game and show upgraded card art, but their
Expedition effect has not been defined or wired. Expeditions must not imply that an upgrade
improves a card while silently ignoring it.

Until an explicit implementation decision is made, Adventure-honed status is cosmetic in
Expeditions and must not be used in readiness calculations or board maths. The follow-up
design choice is deliberately narrow: either an upgrade promotes the card's effective
readiness rarity by one step, capped at Epic, or it gives one named once-per-expedition
tactical benefit. It must not secretly alter printed statistics. Choose one approach, display
it on the card and add deterministic tests before wiring it.

## 8. Required player-facing explanations

The implementation is not complete until these are present:

1. Squad cards show the five values, derived Move and Hearts, primary discipline, role and
   trait.
2. The briefing shows readiness, specific specialist guidance and visible enemy pressure.
3. Choosing Move shows the legal distance. Choosing a check or strike shows the full sum and
   projected result.
4. The combat log says why damage was zero, one or two.
5. A defeat report identifies the relevant shortfall, for example: `Your highest available
   power was 6. The Warden's Defence was 8. Bring support, a mark or a stronger striker.`
6. A victory report credits the plan, not rarity: `Nine relayed the 5-crate; Pip's exact
   total held the bridge; Bramble guarded it from Nib.`

## 9. Scenario authoring and test contract

Every playable scenario must declare:

- its objective family and the mathematics being practised
- all visible checks, their governing statistic and difficulty
- enemy Defence, hearts, damage, intent and timing
- recommended average battle value, rarity guidance and specialist guidance
- a reference squad and deterministic winning trace
- a below-recommendation test squad that can embark but experiences the stated shortfall
- an explanation of why one powerful card cannot satisfy every late-map job alone

Tests must reject a scenario if a required check is hidden, if its reference trace cannot
win within the turn limit, if an enemy has an undisclosed numerical bonus or if the displayed
readiness statement does not match the scenario data.
