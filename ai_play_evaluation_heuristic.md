# AI Play Evaluation Heuristic

## v1.1 active-lane and Ingenuity rules

The legal card actions are `(card, lane)` pairs where `lane` belongs to `state.activeLanes`. Exactly three of the five printed lanes are active each round. Inactive lanes are excluded from play, movement, control counts, round evaluation and total-score tiebreaks. Controlling two active lanes is normally a winning board position.

Playing a card into an active lane different from its stored `primaryType` adds one Ingenuity Token after the card resolves. The evaluator should include the option value of this future +1 action while also recognising that spending the token consumes a later normal turn. Science statistic substitution does not affect whether the token is earned, and movement never earns one.

When the AI owns tokens, also evaluate `(INGENUITY_TOKEN, lane)` for each active lane. This action contributes +1, consumes one token, creates a non-Type, non-Set token-card and passes priority normally. Prefer it when one point changes lane control or avoids committing a valuable hand card. It must not trigger Type or Set logic.

Any older reference in this document to `3+ controlled lanes`, loops from `0 TO 4` during live play or totals across all five lanes is superseded by this section: use `2+` and iterate the three `activeLanes`.

This document defines the AI play evaluation heuristic for the Joey collectible card battle game.

The AI has a hand of cards and must choose one card and one lane each turn. It should score every legal `(card, lane)` pair and return the highest-scoring option.

The evaluator is intentionally one-ply: it scores the immediate tactical consequences of each legal play using only information the AI is legally allowed to know.

---

# 1. Visible Game State

The AI may use:

```text
aiLanes[5], oppLanes[5]
aiHand: Card[]
aiPlayed: {card, lane, contribution}[]
oppPlayed: {card, lane, contribution}[]
oppHandCount: number
aiReserveCount, oppReserveCount
roundNum: 1|2|3
aiRoundsWon, oppRoundsWon
oppHasPassed: boolean
aiTypeBonuses: {
    affinity: Set<0..4>,
    mastery: Set<0..4>
}
aiSetCounts: {
    little_reckoning,
    ninefold_orchard,
    gifford
}
oncePerRoundUsed: Set<string>
oncePerBattleUsed: Set<string>
```

The AI must not inspect hidden cards in the opponent's hand or the hidden order of the opponent's Reserve Deck.

---

# 2. Lane Control

The AI controls lane `i` when:

```text
aiLanes[i] > oppLanes[i]
```

The opponent controls lane `i` when:

```text
oppLanes[i] > aiLanes[i]
```

A tied lane is controlled by neither side.

A round is won by controlling more lanes than the opponent.

Normally:

```text
2+ controlled active lanes = winning current board position
```

If both sides control the same number of lanes, total score across the three active lanes is the tiebreak.

---

# 3. Important Type-Bonus Rule

Type Affinity and Mastery are determined by **deck composition before battle**.

They are not unlocked by playing the third or fifth card of a Type during the match.

Therefore the play evaluator should use:

```text
aiTypeBonuses.affinity
aiTypeBonuses.mastery
```

to determine which Type abilities are already active.

The evaluator should then reward individual plays that successfully exploit those active bonuses.

Set bonuses are different: they are triggered by the number of cards from the same Set actually played during the current round.

---

# 4. Main Decision Function

```text
FUNCTION chooseBestPlay(gameState):

    bestAction = NULL
    bestScore = -INFINITY

    FOR cardIndex FROM 0 TO aiHand.length - 1:

        card = aiHand[cardIndex]

        FOR lane IN gameState.activeLanes:

            evaluation =
                evaluatePlay(card, lane, gameState)

            IF evaluation.finalScore > bestScore:

                bestScore = evaluation.finalScore

                bestAction = {
                    cardId: card.id,
                    handIndex: cardIndex,
                    lane: lane,
                    score: evaluation.finalScore,
                    breakdown: evaluation.components
                }

    RETURN bestAction
```

---

# 5. Starting Weights

These should be configurable constants.

```text
WEIGHTS = {

    # Board control
    LANE_CONTROL_UNIT:        24,
    ROUND_WIN_GAIN:           40,
    ROUND_WIN_SECURITY:       12,

    # Efficient card use
    EXACT_ONE_AHEAD:           8,
    EXACT_TIE:                 3,
    OVERKILL_PER_POINT:       -1.5,
    BV_SPEND_PER_POINT:       -0.22,
    STAT_WASTE_PER_POINT:     -0.50,

    # Type ability use
    TYPE_AFFINITY_USE:         7,
    TYPE_MASTERY_USE:         11,

    # Set sequencing
    SET_FIRST_CARD:            1,
    SET_SECOND_CARD:           7,
    SET_THIRD_CARD:           12,
    SET_FOURTH_PLUS:           2,

    # General tactical positioning
    WEAK_LANE_SUPPORT:         4,
    STRONG_LANE_OVERCOMMIT:   -3,

    # Opponent has passed
    WIN_AFTER_OPP_PASS:        30,
    OVERSPEND_AFTER_PASS:     -0.40,

    # Match state
    MATCH_POINT_WIN:           25,
    MATCH_POINT_LOSS_AVOID:    20
}
```

These are intended as starting values for playtesting.

The largest values belong to changing lane control and improving the probability of winning the current round.

Raw score increases should be less important than whether those points actually change control.

---

# 6. Core Evaluation

```text
FUNCTION evaluatePlay(card, lane, state):

    simulated =
        simulateImmediatePlay(card, lane, state)

    components = {}

    components.control =
        scoreLaneControlDelta(state, simulated)

    components.round =
        scoreRoundPosition(state, simulated)

    components.efficiency =
        scoreEfficiency(card, lane, state, simulated)

    components.type =
        scoreTypeBonusUse(card, lane, state, simulated)

    components.set =
        scoreSetSequencing(card, state, simulated)

    components.matchState =
        scoreMatchState(card, lane, state, simulated)

    components.position =
        scoreGeneralPosition(card, lane, state, simulated)

    baseScore =
        components.control
        + components.round
        + components.efficiency
        + components.type
        + components.set
        + components.matchState
        + components.position

    modifier =
        matchAggressionModifier(state)

    finalScore =
        applyMatchModifier(
            baseScore,
            components,
            modifier
        )

    RETURN {
        finalScore,
        components,
        simulatedState: simulated
    }
```

---

# 7. Simulate the Immediate Play

Do not evaluate only the card's printed lane statistic.

The evaluator should simulate all immediate legal consequences of the play.

```text
FUNCTION simulateImmediatePlay(card, lane, state):

    sim = CLONE(state)

    printedContribution =
        card.s[lane]

    contribution =
        printedContribution

    triggeredEffects = []

    # -----------------------------------
    # SCIENCE AFFINITY
    # -----------------------------------

    IF Science Affinity active
    AND "science_affinity" NOT IN oncePerRoundUsed:

        secondHighest =
            SECOND_HIGHEST(card.s)

        IF secondHighest > contribution:

            contribution =
                secondHighest

            triggeredEffects.ADD(
                "science_affinity"
            )

    # -----------------------------------
    # SCIENCE MASTERY
    # -----------------------------------

    IF Science Mastery active
    AND "science_mastery" NOT IN oncePerBattleUsed:

        highest =
            MAX(card.s)

        IF highest > contribution:

            contribution =
                highest

            triggeredEffects.ADD(
                "science_mastery"
            )

    sim.aiLanes[lane] += contribution

    sim.aiPlayed.ADD({
        card,
        lane,
        contribution
    })

    simulateArithmeticEffects(...)
    simulateGeometryEffects(...)
    simulateSetEffects(...)

    RETURN {
        state: sim,
        lane,
        contribution,
        printedContribution,
        triggeredEffects
    }
```

For once-per-battle abilities, evaluate both:

```text
play WITHOUT spending ability
play WITH spending ability
```

Only consume the once-per-battle ability if the additional value exceeds a minimum threshold.

Suggested starting threshold:

```text
MIN_MASTERY_GAIN = 8
```

Example:

```text
IF Science Mastery improves evaluation by < 8:
    save it
```

This prevents the AI from wasting a powerful once-per-battle effect for a trivial gain.

---

# 8. Lane-State Representation

Represent lane ownership as:

```text
AI controls       = +1
Tied              =  0
Opponent controls = -1
```

```text
FUNCTION laneState(aiScore, oppScore):

    IF aiScore > oppScore:
        RETURN +1

    IF aiScore < oppScore:
        RETURN -1

    RETURN 0
```

---

# 9. Lane-Control Delta

```text
FUNCTION scoreLaneControlDelta(before, after):

    score = 0

    FOR lane IN state.activeLanes:

        beforeState =
            laneState(
                before.aiLanes[lane],
                before.oppLanes[lane]
            )

        afterState =
            laneState(
                after.aiLanes[lane],
                after.oppLanes[lane]
            )

        delta =
            afterState - beforeState

        score +=
            delta
            * WEIGHTS.LANE_CONTROL_UNIT

    RETURN score
```

With `LANE_CONTROL_UNIT = 24`:

```text
Opponent control -> AI control = +48
Opponent control -> tie        = +24
Tie -> AI control              = +24

AI control -> tie              = -24
AI control -> opponent control = -48
```

This naturally gives high value to effects that flip multiple lanes.

---

# 10. Count Controlled Lanes

```text
FUNCTION countControlled(aiLanes, oppLanes):

    count = 0

    FOR i IN state.activeLanes:

        IF aiLanes[i] > oppLanes[i]:
            count += 1

    RETURN count
```

---

# 11. Round-Position Score

```text
FUNCTION scoreRoundPosition(before, after):

    beforeControlled =
        countControlled(
            before.aiLanes,
            before.oppLanes
        )

    afterControlled =
        countControlled(
            after.aiLanes,
            after.oppLanes
        )

    score = 0

    IF beforeControlled < 3
    AND afterControlled >= 2:

        score +=
            WEIGHTS.ROUND_WIN_GAIN

    IF beforeControlled >= 2
    AND afterControlled >= 2:

        score +=
            WEIGHTS.ROUND_WIN_SECURITY

    IF before.oppHasPassed
    AND projectedRoundResult(
        after.aiLanes,
        after.oppLanes
    ) == WIN:

        score +=
            WEIGHTS.WIN_AFTER_OPP_PASS

    RETURN score
```

The normal `ROUND_WIN_GAIN` should not be excessive because the opponent may still respond.

If the opponent has already passed, the current board result is final once the AI also passes, so the additional reward can be larger.

---

# 12. Projected Round Result

```text
FUNCTION projectedRoundResult(
    aiLanes,
    oppLanes
):

    aiControlled =
        countControlled(
            aiLanes,
            oppLanes
        )

    oppControlled =
        countControlled(
            oppLanes,
            aiLanes
        )

    IF aiControlled > oppControlled:
        RETURN WIN

    IF aiControlled < oppControlled:
        RETURN LOSS

    aiTotal =
        SUM(aiLanes)

    oppTotal =
        SUM(oppLanes)

    IF aiTotal > oppTotal:
        RETURN WIN

    IF aiTotal < oppTotal:
        RETURN LOSS

    RETURN DRAW
```

---

# 13. Efficiency Score

The AI should value accomplishing the tactical objective with the least wasted strength.

A lane won by exactly one point is preferable to winning it by eight points if all other consequences are equal.

```text
FUNCTION scoreEfficiency(
    card,
    lane,
    before,
    after
):

    score = 0

    margin =
        after.aiLanes[lane]
        - after.oppLanes[lane]

    # -----------------------------------
    # Winning margin
    # -----------------------------------

    IF margin == 1:

        score +=
            WEIGHTS.EXACT_ONE_AHEAD

    ELSE IF margin == 0:

        score +=
            WEIGHTS.EXACT_TIE

    ELSE IF margin > 1:

        overkill =
            margin - 1

        score +=
            overkill
            * WEIGHTS.OVERKILL_PER_POINT

    # -----------------------------------
    # BV conservation
    # -----------------------------------

    score +=
        card.bv
        * WEIGHTS.BV_SPEND_PER_POINT

    # -----------------------------------
    # Specialist conservation
    # -----------------------------------

    maxStat =
        MAX(card.s)

    actualContribution =
        after.playedContribution

    statWaste =
        MAX(
            0,
            maxStat - actualContribution
        )

    score +=
        statWaste
        * WEIGHTS.STAT_WASTE_PER_POINT

    RETURN score
```

Example BV penalties:

```text
BV 12:
12 * -0.22 = -2.64

BV 45:
45 * -0.22 = -9.90
```

This does not make expensive cards undesirable.

It simply means a Legendary should be used when its larger tactical impact is actually needed.

---

# 14. Specialist Waste

Example:

```text
card.s = [9,2,3,2,2]
```

Played into Geometry:

```text
contribution = 2
max stat      = 9
stat waste    = 7
```

With:

```text
STAT_WASTE_PER_POINT = -0.50
```

penalty:

```text
7 * -0.50 = -3.5
```

The AI may still make the play if doing so creates enough tactical value.

---

# 15. General Position Score

```text
FUNCTION scoreGeneralPosition(
    card,
    lane,
    before,
    after
):

    score = 0

    beforeMargin =
        before.aiLanes[lane]
        - before.oppLanes[lane]

    IF beforeMargin < 0:

        score +=
            WEIGHTS.WEAK_LANE_SUPPORT

    IF beforeMargin >= 8:

        score +=
            WEIGHTS.STRONG_LANE_OVERCOMMIT

    RETURN score
```

This discourages adding unnecessary cards to a lane the AI already dominates.

---

# 16. Type-Bonus Scoring

The Type threshold is already active before the battle.

The play evaluator therefore rewards using the active ability successfully.

```text
FUNCTION scoreTypeBonusUse(
    card,
    lane,
    before,
    after
):

    score = 0

    FOR each effect
    IN after.triggeredEffects:

        IF effect is Affinity:

            score +=
                WEIGHTS.TYPE_AFFINITY_USE

        IF effect is Mastery:

            score +=
                WEIGHTS.TYPE_MASTERY_USE

    RETURN score
```

Starting values:

```text
Affinity use = +7
Mastery use  = +11
```

The actual board effect is also scored through lane-control and round-position changes.

---

# 17. Type-Specific Notes

## Arithmetic

If the play meets the exact printed-stat condition required by Arithmetic Affinity or Mastery:

```text
reward ability activation
```

but also simulate the actual scry/reordering effect separately.

## Geometry

If playing a Geometry card activates Adjacent Support:

```text
+7 Type bonus use
```

plus whatever value the adjacent `+1` creates in the board simulation.

If Geometry Mastery movement is used:

```text
+11 Type bonus use
```

plus the actual resulting board change.

## Logic

Deduction and Prediction are not normally triggered by selecting a particular card and lane.

Do not award Type-use points simply because a Logic card is played.

Prediction should have its own decision/reaction evaluation.

## Science

If Experiment is used:

```text
+7
```

If Breakthrough is used:

```text
+11
```

subject to the once-per-battle conservation threshold.

## Speed

Speed Mastery is a reaction ability.

Do not add a Speed Mastery bonus to ordinary play selection unless the evaluated action is specifically the Initiative response.

---

# 18. Set Sequencing

```text
FUNCTION scoreSetSequencing(
    card,
    before,
    after
):

    IF card.set IS NULL:
        RETURN 0

    current =
        before.aiSetCounts[card.set]

    newCount =
        current + 1

    IF newCount == 1:
        RETURN WEIGHTS.SET_FIRST_CARD

    IF newCount == 2:
        RETURN WEIGHTS.SET_SECOND_CARD

    IF newCount == 3:
        RETURN WEIGHTS.SET_THIRD_CARD

    RETURN WEIGHTS.SET_FOURTH_PLUS
```

Starting values:

```text
1st Set card = +1
2nd Set card = +7
3rd Set card = +12
4th+         = +2
```

The actual Set effect must also be simulated and scored through its board impact.

The mild double reward is intentional.

Completing a difficult Set sequence should be strategically attractive.

---

# 19. Ninefold Orchard Evaluation

## Second Set card

Test every valid choice of up to two occupied lanes.

```text
FOR each legal lane pair:

    clone board

    add +1 to both selected lanes

    evaluate resulting position

choose highest-value result
```

## Third Set card

```text
FOR every legal adjacent lane
to every eligible played card:

    clone board

    add +2 to adjacent lane

    evaluate resulting position

choose highest-value result
```

---

# 20. Little Reckoning Evaluation

## Second Set card

```text
eligibleCards =
    all aiPlayed cards
    WHERE card.bv <= 16

FOR each eligible card:

    clone board

    add +3 to its lane

    evaluate position

choose highest-value result
```

## Third Set card

```text
eligibleCards =
    all aiPlayed cards
    WHERE card.bv <= 16

FOR each eligible card:

    clone board

    add its current contribution again
    to its current lane

    evaluate position

choose highest-value result
```

---

# 21. Gifford Evaluation

## Second Set card

Test every legal friendly movement.

```text
FOR each aiPlayed card:

    FOR each destination lane
    other than current lane:

        clone board

        remove current contribution
        from original lane

        newContribution =
            card.s[destination]
            + 1

        add newContribution
        to destination lane

        evaluate position

choose best movement
```

## Third Set card

Resolve both components.

### Opponent move

```text
FOR each opponent played card:

    FOR each adjacent legal lane:

        clone board

        remove old contribution

        newContribution =
            card.s[newLane]

        add newContribution
        to new lane

        evaluate
```

Choose the best opponent move.

### Friendly move

Then:

```text
FOR each aiPlayed card:

    FOR each legal destination:

        remove old contribution

        newContribution =
            card.s[destination]
            + 1

        evaluate
```

Choose the best friendly move.

Then evaluate the combined final board.

---

# 22. Match-State Mode

```text
FUNCTION getMatchMode(state):

    IF aiRoundsWon == 1
    AND oppRoundsWon == 0:

        RETURN CONSERVATIVE

    IF aiRoundsWon == 0
    AND oppRoundsWon == 1:

        RETURN AGGRESSIVE

    IF aiRoundsWon == 1
    AND oppRoundsWon == 1:

        RETURN DECISIVE

    RETURN NORMAL
```

Suggested multipliers:

```text
NORMAL:
    controlMultiplier      = 1.00
    resourceCostMultiplier = 1.00

CONSERVATIVE:
    controlMultiplier      = 0.95
    resourceCostMultiplier = 1.30

AGGRESSIVE:
    controlMultiplier      = 1.15
    resourceCostMultiplier = 0.75

DECISIVE:
    controlMultiplier      = 1.20
    resourceCostMultiplier = 0.60
```

---

# 23. Applying Match-State Modifiers

```text
FUNCTION applyMatchModifier(
    baseScore,
    components,
    mode
):

    boardValue =
        components.control
        + components.round
        + components.type
        + components.set
        + components.position

    resourceValue =
        components.efficiency

    result =
        boardValue
        * mode.controlMultiplier

        + resourceValue
        * mode.resourceCostMultiplier

        + components.matchState

    RETURN result
```

When ahead 1–0:

```text
resource conservation matters more
```

When behind 0–1:

```text
winning the current round matters more
```

At 1–1:

```text
there is little reason to preserve cards
for a future round that cannot occur
```

---

# 24. Match-Point Bonuses

```text
FUNCTION scoreMatchState(
    card,
    lane,
    before,
    after
):

    score = 0

    afterControls =
        countControlled(
            after.aiLanes,
            after.oppLanes
        )

    IF aiRoundsWon == 1
    AND afterControls >= 2:

        score +=
            WEIGHTS.MATCH_POINT_WIN

    IF oppRoundsWon == 1
    AND afterControls >= 2:

        score +=
            WEIGHTS.MATCH_POINT_LOSS_AVOID

    RETURN score
```

These are potential-match-state bonuses.

The opponent may still respond unless it has passed.

---

# 25. Opponent Has Passed

When the opponent has passed, the AI has complete information about the final score it must beat.

Before evaluating another play:

```text
IF oppHasPassed
AND projectedRoundResult(
    aiLanes,
    oppLanes
) == WIN:

    PASS
```

Do not spend another card.

If the AI is not yet winning:

```text
choose the lowest-cost play
that produces a round win
```

Play scoring should include:

```text
IF oppHasPassed
AND simulated position wins round:

    score +=
        WEIGHTS.WIN_AFTER_OPP_PASS
```

Also punish unnecessary card expenditure.

```text
excessBV =
    card.bv
    - cheapestCardThatWouldWin.bv

score +=
    excessBV
    * WEIGHTS.OVERSPEND_AFTER_PASS
```

With:

```text
OVERSPEND_AFTER_PASS = -0.40
```

the AI becomes strongly reluctant to use an expensive card when a cheap one already guarantees the round.

---

# 26. Hand and Reserve Pressure

```text
FUNCTION handPressure(state):

    aiCardsRemaining =
        aiHand.length
        + aiReserveCount

    oppCardsRemaining =
        oppHandCount
        + oppReserveCount

    RETURN
        aiCardsRemaining
        - oppCardsRemaining
```

Adjust resource pressure:

```text
difference =
    handPressure(state)

IF difference <= -3:

    resourceCostMultiplier *= 1.25

IF difference >= +3:

    resourceCostMultiplier *= 0.85
```

If the AI is down three or more remaining cards, it should become more conservative.

If it has a substantial card advantage, it can spend more freely.

---

# 27. Round-Number Pressure

```text
IF roundNum == 1:

    resourceCostMultiplier *= 1.10

IF roundNum == 2:

    resourceCostMultiplier *= 1.00

IF roundNum == 3:

    resourceCostMultiplier *= 0.75
```

Round 1 should encourage preservation.

Round 3 should encourage using available resources.

---

# 28. Complete Starting Score Formula

Conceptually:

```text
FINAL SCORE =

    laneControlDelta
    + roundPositionValue
    + efficientMarginValue
    + cardConservationValue
    + typeAbilityValue
    + setSequenceValue
    + positionalValue
    + matchSituationValue
```

Concrete starting implementation:

```text
control =
    24 * changeInLaneOwnershipUnits

round =
    +40 if move crosses into 2+ controlled active lanes
    +12 if already at 3+ and strengthens position
    +30 extra if opponent has passed and move wins

efficiency =
    +8 if target lane ends exactly +1
    +3 if target lane ends tied
    -1.5 * overkillPoints
    -0.22 * cardBV
    -0.50 * unusedMaxStatDifference

type =
    +7 for useful Affinity activation
    +11 for useful Mastery activation

set =
    +1 if first Set card this round
    +7 if second
    +12 if third
    +2 if fourth+

position =
    +4 when reinforcing a lane currently lost
    -3 when adding into a lane already ahead by 8+

match =
    +25 when creating a potential match-winning round
    +20 when avoiding potential match elimination
```

Then apply match-state and card-pressure multipliers.

---

# 29. Example

Current Arithmetic lane:

```text
AI       = 8
Opponent = 12
```

Card A:

```text
BV = 13
stats = [5,1,2,3,2]
```

Played into Arithmetic:

```text
AI becomes 13
Opponent remains 12
```

The lane changes from:

```text
opponent-controlled
```

to:

```text
AI-controlled
```

Lane-control score:

```text
+48
```

Exact one-point lead:

```text
+8
```

BV penalty:

```text
13 * -0.22
= -2.86
```

If Arithmetic is the highest stat:

```text
stat waste = 0
```

If this is the second Little Reckoning card this round:

```text
Set sequencing = +7
```

Before considering the actual Set effect:

```text
48
+ 8
- 2.86
+ 7
= 60.14
```

This is a strong play.

---

# 30. Expensive Alternative Example

Suppose a BV 43 card contributes 10 to the same lane.

Result:

```text
AI = 18
Opponent = 12
```

It still flips only one lane.

Control score:

```text
+48
```

Winning margin:

```text
6
```

Overkill:

```text
5 points
```

Overkill penalty:

```text
5 * -1.5
= -7.5
```

BV penalty:

```text
43 * -0.22
= -9.46
```

Before other factors:

```text
48
- 7.5
- 9.46
= 31.04
```

The AI therefore strongly prefers the cheaper card that achieves the same lane-control result.

---

# 31. Difficulty-Based Imperfection

Do not make all AI difficulty levels choose the mathematical best action every time.

Suggested:

```text
LEGENDARY AI:
    choose best action 100%

EPIC:
    choose best action 95%
    otherwise weighted among top 3

RARE:
    choose best action 85%
    otherwise weighted among top 3

UNCOMMON:
    choose best action 70%
    otherwise weighted among top 4

COMMON:
    choose best action 55%
    otherwise weighted among top 5
```

Never include absurdly bad plays in the randomised candidate set.

Use a score tolerance:

```text
candidate.score >=
    bestScore - MAX_ERROR
```

Suggested:

```text
Common MAX_ERROR    = 18
Uncommon            = 12
Rare                 = 8
Epic                 = 4
Legendary            = 0
```

This lets weaker opponents make plausible mistakes without behaving randomly.

---

# 32. Pass Decision Should Be Separate

The card/lane evaluator answers:

> If I play a card, what is my best play?

Passing is a separate strategic question.

Recommended structure:

```text
FUNCTION chooseAITurn(state):

    bestPlay =
        chooseBestPlay(state)

    passScore =
        evaluatePass(state)

    IF passScore >= bestPlay.score:

        RETURN {
            action: PASS
        }

    RETURN {
        action: PLAY,
        cardId: bestPlay.cardId,
        lane: bestPlay.lane
    }
```

This separation makes AI behaviour easier to tune and debug.

---

# 33. Debug Logging

For each selected move, expose a component breakdown.

Example:

```text
PLAY tritip -> Geometry

Lane control       +48.0
Round position     +40.0
Efficiency          +5.1
Type bonus          +7.0
Set sequencing      +0.0
Position            +4.0
Match state        +20.0
--------------------------------
Raw score          124.1

Aggression modifier 1.15
Resource modifier   0.75

FINAL              136.8
```

This logging should be available in development builds so that unexpected AI decisions can be diagnosed quickly.

The most important debugging question should always be:

```text
Why did this card/lane pair score higher
than the alternatives?
```

The component breakdown should make that answer explicit.
