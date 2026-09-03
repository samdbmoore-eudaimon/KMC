# AI Deck Construction Algorithm

## v1.1 active-lane and Ingenuity rules

This algorithm uses the v1.1 battlefield rules in `JOEY_SPEC.md`:

- each round has three randomly selected active lanes from the five printed lanes
- only active lanes are legal destinations during that round
- playing a card outside its stored Primary Type earns one Ingenuity Token
- an Ingenuity Token is a later +1 PLAY action and persists between rounds

Where older pseudocode evaluates all five lanes, it is evaluating long-term deck coverage across the possible three-lane combinations. During a battle, lane-specific evaluation must iterate `state.activeLanes`, never every lane unconditionally.

Deck construction should continue to value broad statistical coverage because the active combination is not known in advance. It should also value cards whose second and third-best statistics are efficient enough to make off-Type placement credible. Add an `ingenuityFlexibility` component based on useful non-primary statistics, but do not value the future token as a guaranteed immediate +1: spending it consumes a later PLAY action.

Using the card battle spec already provided, this document defines the AI deck construction algorithm as concrete pseudocode.

## Card Data Shape

```text
{ id, r, s: [Arithmetic, Geometry, Logic, Science, Speed], bv, set, primaryType }
```

`primaryType` is the index from `0–4` of the card's highest stat. If multiple stats tie for highest, use the lowest index.

## Inputs

```text
targetCard
bvCap
cardPool
```

Where:

- `targetCard` is the card that must appear exactly once in the AI deck
- `bvCap` is determined by target rarity:
  - Common → 250
  - Uncommon → 275
  - Rare → 300
  - Epic → 325
  - Legendary → 375
- `cardPool` contains all 40 cards in the module
- each card has a `quantity` field
- assume the AI has one of every card, including the target

## Output

Return:

```text
[
    { cardId, count },
    ...
]
```

Rules:

- exactly 15 total cards
- total BV ≤ `bvCap`
- maximum 2 copies of one character
- target appears exactly once
- AI cannot use more copies than available quantity

## Bonus Thresholds

Type bonuses are based on deck composition:

```text
Affinity = 3 cards of one primaryType
Mastery  = 5 cards of one primaryType
```

Set bonuses are based on cards actually played during a round:

```text
Minor Set effect = 2nd played card from same set
Major Set effect = 3rd played card from same set
```

---

# 1. Overall Algorithm

```text
FUNCTION buildAIDeck(targetCard, bvCap, cardPool):

    CONSTANT DECK_SIZE = 15
    CONSTANT MAX_COPIES = 2
    CONSTANT TYPE_AFFINITY = 3
    CONSTANT TYPE_MASTERY = 5
    CONSTANT SET_MINOR = 2
    CONSTANT SET_MAJOR = 3

    ASSERT targetCard exists in cardPool
    ASSERT targetCard.bv <= bvCap

    deck = []
    deckCounts = map default 0
    totalBV = 0

    # STEP 1: PLACE TARGET
    addCard(targetCard)

    # Target must appear exactly once regardless of quantity.

    # STEP 2: SELECT STRATEGY
    strategy = chooseStrategy(targetCard, bvCap, cardPool)

    IF strategy == TYPE_MASTERY:
        buildTypeMasteryDeck()

    ELSE IF strategy == SET_CLUSTER:
        buildSetClusterDeck()

    ELSE IF strategy == BALANCED_POWER:
        buildBalancedPowerDeck()

    ELSE IF strategy == TYPE_AFFINITY_HYBRID:
        buildTypeAffinityHybridDeck()

    # STEP 3: COMPLETE / REPAIR DECK
    fillRemainingSlots()
    improveDeckWithoutBreakingSynergies()
    validateDeck()

    RETURN compressDeck(deck)
```

---

# 2. Common Helper Functions

## Can a card be added?

```text
FUNCTION canAdd(card):

    IF card.id == targetCard.id:
        RETURN FALSE

    availableCopies =
        MIN(card.quantity, MAX_COPIES)

    IF deckCounts[card.id] >= availableCopies:
        RETURN FALSE

    IF LENGTH(deck) >= DECK_SIZE:
        RETURN FALSE

    IF totalBV + card.bv > bvCap:
        RETURN FALSE

    RETURN TRUE
```

## Add a card

```text
FUNCTION addCard(card):

    deck.APPEND(card)
    deckCounts[card.id] += 1
    totalBV += card.bv
```

## Remaining capacity

```text
FUNCTION remainingSlots():
    RETURN DECK_SIZE - LENGTH(deck)

FUNCTION remainingBV():
    RETURN bvCap - totalBV

FUNCTION averageAffordableBV():
    IF remainingSlots() == 0:
        RETURN 0

    RETURN remainingBV() / remainingSlots()
```

`averageAffordableBV()` is important because the AI must not overspend early and make a legal 15-card deck impossible.

---

# 3. Analyse the Target Card

```text
FUNCTION analyseTarget(target):

    targetType = target.primaryType
    targetSet = target.set

    highestStat = MAX(target.s)
    secondHighestStat = SECOND_HIGHEST(target.s)

    specialisation =
        highestStat - AVERAGE(other four stats)

    typePool =
        cards in cardPool
        WHERE card.primaryType == targetType
        AND card.id != target.id

    setPool =
        cards in cardPool
        WHERE card.set == targetSet
        AND card.id != target.id

    affordableTypeCount =
        number of typePool cards reasonably usable under bvCap

    affordableSetCount =
        number of setPool cards reasonably usable under bvCap

    RETURN analysis
```

---

# 4. Card Efficiency

```text
FUNCTION cardEfficiency(card):

    statSum = SUM(card.s)

    highest = MAX(card.s)

    specialistBonus =
        MAX(0, highest - 6) * 0.20

    RETURN
        (statSum / card.bv)
        + specialistBonus
```

For lane-specific evaluation:

```text
FUNCTION laneEfficiency(card, lane):

    RETURN card.s[lane] / card.bv
```

---

# 5. Strategy Selection

```text
FUNCTION chooseStrategy(target, bvCap, cardPool):

    analysis = analyseTarget(target)

    scores = {
        TYPE_MASTERY: 0,
        SET_CLUSTER: 0,
        TYPE_AFFINITY_HYBRID: 0,
        BALANCED_POWER: 0
    }
```

## Type Mastery score

```text
IF analysis.affordableTypeCount >= 4:

    scores.TYPE_MASTERY += 30

    scores.TYPE_MASTERY += analysis.specialisation * 3

    avgTypeBV =
        average BV of best 4 available target-type cards

    IF avgTypeBV <= 18:
        scores.TYPE_MASTERY += 12

    ELSE IF avgTypeBV <= 25:
        scores.TYPE_MASTERY += 6
```

## Set Cluster score

```text
IF target.set IS NOT NULL:

    IF analysis.affordableSetCount >= 2:
        scores.SET_CLUSTER += 25

    IF analysis.affordableSetCount >= 4:
        scores.SET_CLUSTER += 8

    avgSetBV =
        average BV of best available set partners

    IF avgSetBV <= 18:
        scores.SET_CLUSTER += 10
```

## Type Affinity Hybrid score

```text
IF analysis.affordableTypeCount >= 2:
    scores.TYPE_AFFINITY_HYBRID += 18

IF target.set IS NOT NULL
AND analysis.affordableSetCount >= 1:
    scores.TYPE_AFFINITY_HYBRID += 10

IF target.bv >= 35:
    scores.TYPE_AFFINITY_HYBRID += 8
```

## Balanced Power score

```text
scores.BALANCED_POWER += 15

IF target.bv >= 38:
    scores.BALANCED_POWER += 12

IF target.set IS NULL:
    scores.BALANCED_POWER += 8

IF analysis.affordableTypeCount < 4:
    scores.BALANCED_POWER += 6
```

## Final strategy choice

```text
bestScore = MAX(scores)

candidates =
    strategies within 5 points of bestScore

RETURN weightedRandom(candidates, using strategy scores)
```

This variation prevents repeated Friendly Battles against the same target from producing exactly the same deck every time.

---

# 6. Strategy A: Pursue Type Mastery

Objective:

```text
5 cards of target.primaryType
```

including the target.

```text
FUNCTION buildTypeMasteryDeck():

    type = targetCard.primaryType

    need =
        5 - countCardsOfType(deck, type)

    reserveSlots =
        remainingSlots() - need

    minimumReserveBV =
        minimumFeasibleBV(reserveSlots)

    synergyBudget =
        remainingBV() - minimumReserveBV
```

Same-Type candidate scoring:

```text
score =
    4.0 * typeSynergy
    + 2.0 * cardEfficiency
    + 1.5 * dominantLaneValue
    + 1.0 * secondaryStatCoverage
    + 0.8 * setSynergy
    - overspendPenalty
```

Where:

```text
typeSynergy = 1
dominantLaneValue = card.s[type]
```

After Mastery is reached, approximately prioritise:

```text
40% = complementary efficient cards
30% = useful Set clusters
20% = lane coverage
10% = premium / high-BV opportunity
```

These are scoring weights, not hard budget partitions.

---

# 7. Strategy B: Build a Set Cluster

Preferred Set density:

```text
4–6 cards from the Set
```

Minimum:

```text
3 cards
```

```text
FUNCTION buildSetClusterDeck():

    setName = targetCard.set

    desiredSetCount = choose between 4 and 5

    IF very cheap viable set cards exist:
        desiredSetCount = 5

    ELSE IF target is expensive:
        desiredSetCount = 4

    need =
        desiredSetCount
        - countCardsOfSet(deck, setName)

    reserveSlots =
        remainingSlots() - need

    availableForSet =
        remainingBV()
        - minimumFeasibleBV(reserveSlots)
```

Set partner score:

```text
score =
    4.0 * setSynergy
    + 2.0 * cardEfficiency
    + 1.5 * typeThresholdContribution
    + 1.5 * laneCoverage
    + effectSpecificValue
```

### Ninefold Orchard

Prefer:

```text
versatile cards
useful secondary stats
different primaryTypes
```

### Little Reckoning

```text
IF card.bv <= 16:
    effectSpecificValue += large bonus
```

### Gifford

Prefer cards with:

```text
multiple reasonably strong stats
OR
large differences between stats
```

After the Set cluster is established, prioritise:

```text
Type Affinity if cheaply attainable
lane coverage
efficient premium cards
```

---

# 8. Strategy C: Balanced High-BV

Use when synergy routes are weak or the target is expensive.

Aspirational type spread:

```text
approximately [3,3,3,3,3]
```

```text
FUNCTION weakestDeckLane():

    projected[lane] =
        SUM useful lane strength of current deck

    RETURN lane with lowest projected value
```

Candidate score:

```text
score =
    3.0 * cardEfficiency
    + 2.5 * weakestLaneImprovement
    + 1.5 * typeThresholdOpportunity
    + 1.0 * setThresholdOpportunity
    + 1.0 * specialistValue
    + 0.5 * rawPower
```

Example with a 44-BV target in a 300-BV deck:

```text
remaining BV = 256
remaining slots = 14
average affordable BV ≈ 18.3
```

Example with a 12-BV target in a 250-BV deck:

```text
remaining BV = 238
remaining slots = 14
average affordable BV = 17
```

---

# 9. Strategy D: Type Affinity + Set Hybrid

Aim for:

```text
3 cards of one Type
+
3–4 cards of one Set
```

```text
FUNCTION buildTypeAffinityHybridDeck():

    targetType = targetCard.primaryType
    targetSet = targetCard.set

    first achieve:
        targetType count >= 3

    then achieve:
        targetSet count >= 3

    BUT at every selection:
        strongly favour cards contributing to BOTH
```

Candidate bonus:

```text
IF card.primaryType == targetType:
    score += 4

IF card.set == targetSet:
    score += 4

IF both:
    score += additional 4
```

After both thresholds are achieved:

```text
lane coverage
efficient cards
potential second Affinity
premium card opportunity
```

---

# 10. Dynamic BV Guardrail

```text
FUNCTION safeToAdd(candidate):

    IF NOT canAdd(candidate):
        RETURN FALSE

    newRemainingSlots =
        DECK_SIZE - (LENGTH(deck) + 1)

    newRemainingBV =
        bvCap - (totalBV + candidate.bv)

    cheapestCompletion =
        minimum cost of selecting
        newRemainingSlots legal available cards

    RETURN cheapestCompletion <= newRemainingBV
```

---

# 11. Fill Remaining Slots

```text
FUNCTION fillRemainingSlots():

    WHILE LENGTH(deck) < DECK_SIZE:

        candidates =
            all cards WHERE safeToAdd(card)

        FOR each candidate:

            score =
                genericCandidateScore(candidate)

        selected =
            weighted choice among top candidates

        addCard(selected)
```

```text
FUNCTION genericCandidateScore(card):

    score = 0

    score += cardEfficiency(card) * 3
    score += laneCoverageScore(card) * 2
    score += typeThresholdScore(card) * 2
    score += setThresholdScore(card) * 2
    score += specialistScore(card)
    score += budgetFitScore(card)

    RETURN score
```

---

# 12. Type Threshold Scoring

```text
2 -> 3 = very large bonus
4 -> 5 = very large bonus
3 -> 4 = small bonus
```

---

# 13. Set Threshold Scoring

```text
0 -> 1 = small
1 -> 2 = high
2 -> 3 = very high
3 -> 4 = moderate consistency bonus
4 -> 5 = moderate consistency bonus
5+     = diminishing returns
```

---

# 14. Budget Fit

Recommended utilisation:

```text
minimum preferred = 94% of bvCap
ideal             = 97–100%
```

```text
FUNCTION budgetFitScore(card):

    afterBV =
        totalBV + card.bv

    slotsAfter =
        DECK_SIZE - LENGTH(deck) - 1

    idealRemainingAverage =
        (bvCap - afterBV) / MAX(1, slotsAfter)

    penalise if:
        candidate makes remaining average unrealistically low

    reward if:
        candidate keeps projected final deck
        close to 95–100% of cap
```

---

# 15. Improvement Pass

```text
FUNCTION improveDeckWithoutBreakingSynergies():

    repeat until no useful swap found
    OR maximum iteration count reached:

        choose one current non-target card

        test replacement with every legal unused candidate

        replacement must:
            remain <= bvCap
            keep deck size 15
            respect quantities
            preserve required strategy thresholds

        calculate deckScore before and after

        IF replacement meaningfully improves score:
            perform best swap
```

Never remove the target.

If using Type Mastery:

```text
never reduce target Type below 5
```

If using Set Cluster:

```text
never reduce chosen Set below intended cluster minimum
```

---

# 16. Overall Deck Score

```text
FUNCTION scoreDeck(deck):

    score = 0

    score += totalStatEfficiency(deck)

    FOR type 0..4:

        count =
            countCardsOfType(deck, type)

        IF count >= 3:
            score += AFFINITY_VALUE

        IF count >= 5:
            score += MASTERY_VALUE

    FOR each named set:

        count =
            countCardsOfSet(deck, set)

        IF count >= 2:
            score += SET_MINOR_VALUE

        IF count >= 3:
            score += SET_MAJOR_VALUE

        IF count == 4:
            score += DRAW_CONSISTENCY_BONUS

        IF count == 5:
            score += larger DRAW_CONSISTENCY_BONUS

    score += laneCoverageScore(deck)
    score += specialistDiversityScore(deck)

    utilisation =
        totalBV / bvCap

    IF utilisation >= 0.94:
        score += utilisation bonus

    RETURN score
```

---

# 17. Deck-Building Quality by Challenge Rarity

```text
COMMON:
    choose among top 4 strategy variants
    tolerate inefficient cards
    target final BV utilisation 90–96%

UNCOMMON:
    choose among top 3 strategy variants
    target 93–98%

RARE:
    choose among top 2 strategy variants
    target 95–100%

EPIC:
    normally choose highest-rated strategy
    optimise thresholds
    target 97–100%

LEGENDARY:
    choose highest-rated strategy
    perform full optimisation pass
    target 98–100%
```

Difficulty should therefore come from:

```text
higher BV cap
+
better use of that BV
```

rather than hidden stat boosts.

---

# 18. Final Validation

```text
FUNCTION validateDeck():

    ASSERT LENGTH(deck) == 15

    ASSERT totalBV <= bvCap

    ASSERT count(deck, targetCard.id) == 1

    FOR each cardId:

        ASSERT deckCounts[cardId] <= 2

        sourceCard =
            cardPool[cardId]

        IF cardId != targetCard.id:
            ASSERT deckCounts[cardId] <= sourceCard.quantity

    ASSERT every card belongs to the same module cardPool
```

If validation fails:

```text
rebuild using BALANCED_POWER
with stricter safeToAdd checks
```

---

# 19. Output Conversion

```text
FUNCTION compressDeck(deck):

    counts =
        group deck by card.id

    RETURN [
        {
            cardId: id,
            count: number of occurrences
        }
        FOR each unique id
    ]
```

The final output must satisfy:

```text
SUM(all count values) == 15
```

---

# 20. Intended Behaviour

The deck builder should create encounters that reflect the target card's identity.

Examples:

- a Geometry-aligned Gifford target may generate a movement-heavy Geometry hybrid
- a Little Reckoning target may deliberately surround itself with efficient low-BV cards
- a Legendary target with weak natural synergy may lead a broad, high-efficiency balanced deck
- a strongly specialised target with cheap same-Type allies may pursue full Type Mastery

Individual Character Challenges should therefore feel meaningfully tied to the character being fought, rather than behaving as different skins over the same rarity-based deck.
