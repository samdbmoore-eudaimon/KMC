# Edge Case Rulings

## v1.1: active lanes and Ingenuity Tokens

- At round start, select three distinct active lanes uniformly without replacement. Select a fresh combination independently for each round.
- Inactive lanes cannot receive cards, tokens, lane bonuses or moved cards and are ignored for control and tiebreak totals.
- Adjacency remains based on the five-lane printed order. Inactive lanes do not make formerly non-adjacent lanes adjacent.
- If an ability has no active legal destination, that part of the ability does not resolve. Resolve any other legal parts normally.
- A card earns exactly one Ingenuity Token when its played lane differs from its stored `primaryType`, even if Experiment or Breakthrough changes the statistic used.
- Placeholder Cards use their stored randomly selected tied-highest Primary Type for this comparison. Cards with no Primary Type do not earn Ingenuity.
- Movement never earns Ingenuity.
- Playing an Ingenuity Token is a normal PLAY action: it adds +1, ends that side's turn and cannot occur after passing or during a pending choice.
- A token-card has no printed data, Type, Set, BV or character. It cannot satisfy or trigger Type and Set rules and cannot be selected by movement, doubling or card-targeting effects.
- Unspent tokens persist across rounds but disappear at battle end. Played token-cards are cleared with the battlefield at round end.

This document resolves ambiguous edge cases in the Joey collectible card battle rules so they can be implemented consistently.

---

# 1. Speed Mastery (Initiative)

## Ruling

Yes. The response card played through **Speed Mastery: Initiative** counts towards Set thresholds for the current round.

Initiative changes the timing of the play, not whether the card counts as a played card.

Therefore the response card:

- increments the relevant `aiSetCounts`
- can be the 2nd Set card and trigger the Set minor effect
- can be the 3rd Set card and trigger the Set major effect
- can trigger Type abilities that normally trigger when a card is played

It still consumes the AI's next normal turn, so Initiative does not create an extra card play overall.

## Implementation rule

```text
initiativeResponsePlay.isNormalPlayForTriggers = true
initiativeResponsePlay.consumesNextNormalTurn = true
```

---

# 2. Geometry Mastery (Symmetry)

## Ruling

No. Moving a Geometry card with **Geometry Mastery: Symmetry** does not re-trigger **Geometry Affinity: Adjacent Support**.

Adjacent Support triggers only when the Geometry-type card is originally played from hand.

Symmetry is a movement effect, not a new play.

## Example

```text
Play Geometry card
-> Adjacent Support may trigger

Later move that card with Symmetry
-> Adjacent Support does NOT trigger again
```

## Implementation rule

```text
IF event.type == CARD_PLAYED_FROM_HAND:
    Geometry Affinity may trigger

IF event.type == CARD_MOVED:
    Geometry Affinity does not trigger
```

---

# 3. Gifford Override: Opponent Card Movement

## Ruling

When an opposing card is moved by **Gifford Override**, recalculate its contribution using the card's printed statistic for the destination lane.

Use:

```text
newContribution = movedCard.s[newLane]
```

Do not use the card's previous `currentContribution`.

Before recalculating:

1. remove the card's full current contribution from its original lane
2. move the card
3. set its new contribution from the printed stat for the destination lane

Do not carry across temporary contribution bonuses unless another rule explicitly says that bonus survives movement.

## Do not carry across

- the old lane contribution
- temporary contribution bonuses
- prior Geometry bonuses
- prior Gifford movement bonuses
- other previously altered contribution values

## Implementation rule

```text
oldLaneScore -= movedCard.currentContribution

movedCard.currentLane = newLane
movedCard.currentContribution = movedCard.card.s[newLane]

newLaneScore += movedCard.currentContribution
```

---

# 4. Little Reckoning: Reckoning

## Ruling

**Reckoning** doubles the selected card's total current contribution, including contribution bonuses currently attached to that card.

It does not double unrelated bonuses applied directly to the lane.

## Example: Gifford bonus

```text
printed contribution = 6
Gifford move bonus    = +1
current contribution  = 7

Reckoning:
7 -> 14
```

## Example: attached card bonus

```text
printed contribution = 5
persistent card contribution bonus = +1
current contribution = 6

Reckoning:
6 -> 12
```

## Lane-only bonuses

If a lane contains:

```text
card.currentContribution = 6
lane.staticBonus = +2
```

then Reckoning changes:

```text
card.currentContribution:
6 -> 12
```

The lane bonus remains:

```text
+2
```

Final lane contribution from these effects:

```text
12 + 2 = 14
```

## Implementation rule

Keep card contribution and lane-only bonuses separate:

```text
PlayedCard
    currentContribution

Lane
    staticBonuses
```

Reckoning applies only to:

```text
PlayedCard.currentContribution
```

---

# 5. Science Mastery (Breakthrough) with Geometry Affinity

## Ruling

Yes. A Geometry-type card can still trigger **Geometry Affinity: Adjacent Support** when **Science Mastery: Breakthrough** causes it to contribute a different statistic in the lane where it is played.

Geometry Affinity cares about:

```text
card.primaryType
```

not which statistic is ultimately used for the card's contribution.

## Example

```text
card.primaryType = Geometry

card played into Arithmetic

Breakthrough:
use highest stat = Geometry 9
```

The card is still a Geometry-type card being played.

Therefore Geometry Affinity may trigger if:

- Geometry Affinity is active
- Geometry Affinity has not already been used this round

The adjacent lane is determined from the lane where the card was actually played.

In this example:

```text
played lane = Arithmetic
```

so the only adjacent lane is:

```text
Geometry
```

The fact that Breakthrough used the card's Geometry stat does not move the card into the Geometry lane.

## Implementation rule

```text
triggerType =
    card.primaryType

playedLane =
    selectedLane

contributionStat =
    abilityModifiedStat
```

These are separate concepts.

---

# 6. Primary Type Tiebreaker for Regular Cards

## Ruling

Regular collectible cards should store an explicit:

```text
primaryType
```

field.

When card data is initially generated or imported:

1. find the highest stat
2. if one stat is uniquely highest, use that Type
3. if multiple stats tie for highest, use the lowest Type index

Type indices are:

```text
0 = Arithmetic
1 = Geometry
2 = Logic
3 = Science
4 = Speed
```

## Example

```text
stats = [10, 7, 10, 6, 8]
```

Highest value:

```text
10
```

Tied between:

```text
Arithmetic = index 0
Logic      = index 2
```

Lowest index wins:

```text
primaryType = 0
```

Therefore:

```text
primaryType = Arithmetic
```

## Persist the value

Store it with the card:

```text
{
    id,
    r,
    s,
    bv,
    set,
    primaryType
}
```

Gameplay should read the stored `primaryType`.

Do not repeatedly derive it during battle.

---

# 7. Placeholder Exception

Placeholder cards are different.

Their five stats are randomly generated when the Placeholder is created.

If multiple stats tie for highest:

```text
randomly select one of the tied highest Types
```

Then store that chosen value as the Placeholder's `primaryType` for the lifetime of that Placeholder.

Do not reroll its Type during battle.

## Example

```text
stats = [3, 3, 1, 1, 0]
```

Highest Types:

```text
Arithmetic
Geometry
```

Choose randomly between those two once:

```text
primaryType = Arithmetic
```

or:

```text
primaryType = Geometry
```

Then retain that result.

---

# 8. General Implementation Principle

Use the following distinctions consistently:

```text
PLAYED
!=
MOVED
```

A movement effect does not automatically retrigger effects that trigger when a card is played.

Use:

```text
printed card stats
```

as the source of truth when an effect says a moved card recalculates its contribution in a new lane.

Use:

```text
currentContribution
```

as the source of truth when an effect explicitly modifies, doubles or otherwise operates on the contribution currently attached to a played card.

Keep:

```text
card contribution bonuses
```

separate from:

```text
lane-only bonuses
```

where possible.

This avoids ambiguous stacking behaviour and makes effect resolution much easier to debug.
