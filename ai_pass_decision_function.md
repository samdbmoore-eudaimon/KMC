# AI Pass Decision Function

## v1.1 active-lane and Ingenuity rules

All lane loops, margins, deficits and control counts in this document operate only on `state.activeLanes`, which contains three distinct lanes. A round-winning position normally requires control of two active lanes, not three of five. Total-score comparisons likewise include only the three active lanes.

`ingenuityTokens` are playable resources. A side with no hand cards but at least one Ingenuity Token is still able to play and is not automatically finished. Comeback, rescue-cost and passing estimates must consider that each token can add +1 to an active lane but consumes one complete PLAY action. Tokens persist between rounds, so conceding a round may conserve them just as it conserves cards.

The AI may spend a token when +1 ties, captures or safely reinforces an important active lane. It should not treat a token as free lane score or spend several merely to reduce a large deficit.

The pass evaluator runs before every normal AI turn and returns:

```text
PASS
or
PLAY
```

Passing means the AI plays no more cards during the current round. Cards already played remain on the battlefield.

The core principle is:

```text
PASS when the expected value of conserving cards
is greater than the expected value of improving this round.
```

---

# 1. Main Function

```text
FUNCTION decidePass(state):

    metrics =
        analysePassState(state)

    # CASE 0: NO CARDS AVAILABLE
    IF aiHand.length == 0:
        RETURN PASS

    # CASE 1: OPPONENT HAS ALREADY PASSED
    IF state.oppHasPassed:
        RETURN decideAfterOpponentPass(
            state,
            metrics
        )

    # CASE 2: ROUND IS MATHEMATICALLY HOPELESS
    IF isRoundMathematicallyUnwinnable(
        state,
        metrics
    ):
        RETURN PASS

    # CASE 3: AI CURRENTLY CONTROLS 3+ LANES
    IF metrics.aiControlled >= 2:
        RETURN decideWhileAhead(
            state,
            metrics
        )

    # CASE 4: AI IS CURRENTLY BEHIND / TIED
    RETURN decideWhileNotAhead(
        state,
        metrics
    )
```

---

# 2. Precompute Pass Metrics

```text
FUNCTION analysePassState(state):

    aiControlled =
        countControlled(
            state.aiLanes,
            state.oppLanes
        )

    oppControlled =
        countControlled(
            state.oppLanes,
            state.aiLanes
        )

    aiTotal =
        SUM(state.aiLanes)

    oppTotal =
        SUM(state.oppLanes)

    laneMargins = []
    deficits = []

    FOR lane IN state.activeLanes:

        margin =
            state.aiLanes[lane]
            - state.oppLanes[lane]

        laneMargins[lane] =
            margin

        deficits[lane] =
            MAX(0, -margin)

    aiCardsRemaining =
        state.aiHand.length
        + state.aiReserveCount

    oppCardsRemaining =
        state.oppHandCount
        + state.oppReserveCount

    strongCards =
        cards in aiHand
        WHERE isStrongCard(card)

    strongCardCount =
        LENGTH(strongCards)

    strongCardBV =
        SUM(card.bv for card in strongCards)

    bestPlay =
        chooseBestPlay(state)

    RETURN {
        aiControlled,
        oppControlled,
        aiTotal,
        oppTotal,
        laneMargins,
        deficits,
        aiCardsRemaining,
        oppCardsRemaining,
        strongCardCount,
        strongCardBV,
        bestPlay
    }
```

---

# 3. Define a Strong Card

```text
FUNCTION isStrongCard(card):

    RETURN (
        card.bv >= 24
        OR MAX(card.s) >= 8
    )
```

---

# 4. Opponent Has Already Passed

```text
FUNCTION decideAfterOpponentPass(
    state,
    metrics
):

    result =
        projectedRoundResult(
            state.aiLanes,
            state.oppLanes
        )

    IF result == WIN:
        RETURN PASS

    IF metrics.bestPlay == NULL:
        RETURN PASS

    after =
        metrics.bestPlay.simulatedState

    afterResult =
        projectedRoundResult(
            after.aiLanes,
            after.oppLanes
        )

    IF afterResult == WIN:
        RETURN PLAY

    requiredExtraCards =
        estimateMinimumCardsToWinAfterPass(state)

    IF requiredExtraCards <= maxCardsWorthSpending(
        state
    ):
        RETURN PLAY

    RETURN PASS
```

Suggested spending caps:

```text
IF aiRoundsWon == 0
AND oppRoundsWon == 0:
    maxCardsWorthSpending = 3

IF aiRoundsWon == 1
AND oppRoundsWon == 0:
    maxCardsWorthSpending = 2

IF aiRoundsWon == 0
AND oppRoundsWon == 1:
    maxCardsWorthSpending = 5

IF aiRoundsWon == 1
AND oppRoundsWon == 1:
    maxCardsWorthSpending = aiHand.length
```

---

# 5. Mathematically Unwinnable Round

```text
FUNCTION isRoundMathematicallyUnwinnable(
    state,
    metrics
):

    laneDeficits = []

    FOR lane IN state.activeLanes:

        required =
            state.oppLanes[lane]
            - state.aiLanes[lane]
            + 1

        IF required > 0:
            laneDeficits.ADD({
                lane,
                required
            })

    requiredLaneWins =
        lanesNeededToWinRound(state)

    IF requiredLaneWins <= 0:
        RETURN FALSE

    possibleLaneWins = 0

    FOR each deficit IN laneDeficits:

        lane =
            deficit.lane

        maximumPossible =
            0

        FOR card IN aiHand:

            maximumPossible +=
                maximumLegalContribution(
                    card,
                    lane,
                    state
                )

        IF maximumPossible >= deficit.required:
            possibleLaneWins += 1

    IF possibleLaneWins < requiredLaneWins:
        RETURN TRUE

    smallestRequiredDeficits =
        SORT ascending(
            deficit.required
            for uncontrolled lanes
        )

    minimumPointsNeeded =
        SUM(
            smallestRequiredDeficits[
                first requiredLaneWins
            ]
        )

    maximumHandContribution =
        SUM(
            MAX(card.s)
            for card IN aiHand
        )

    IF minimumPointsNeeded >
       maximumHandContribution:

        RETURN TRUE

    RETURN FALSE
```

This test is intentionally optimistic. If even this optimistic calculation says the round cannot be won, PASS.

---

# 6. Lanes Needed to Win

```text
FUNCTION lanesNeededToWinRound(state):

    aiControlled =
        countControlled(
            state.aiLanes,
            state.oppLanes
        )

    IF aiControlled >= 2:
        RETURN 0

    RETURN 3 - aiControlled
```

---

# 7. AI Already Controls 3+ Lanes

```text
FUNCTION decideWhileAhead(
    state,
    metrics
):

    safety =
        calculateLeadSafety(state)

    mode =
        getMatchMode(state)

    passThreshold = 60
    passScore = 0

    passScore += safety * 10
```

---

# 8. Lead Safety

```text
FUNCTION calculateLeadSafety(state):

    safetyScore = 0

    FOR lane IN state.activeLanes:

        margin =
            state.aiLanes[lane]
            - state.oppLanes[lane]

        IF margin <= 0:
            CONTINUE

        IF margin >= 7:
            safetyScore += 3

        ELSE IF margin >= 4:
            safetyScore += 2

        ELSE:
            safetyScore += 1

    RETURN safetyScore
```

Example:

```text
two active lanes ahead by:
+8, +5, +1

safetyScore =
3 + 2 + 1
= 6
```

---

# 9. Concrete Pass Rules While Ahead

```text
IF aiControlled >= 4
AND aiHand.length <= 5:

    PASS
```

```text
IF aiControlled == 3
AND all controlled lane margins >= 4
AND aiHand.length <= 6:

    PASS
```

Explicit low-hand rule:

```text
IF aiControlled >= 2
AND aiHand.length <= 4:

    IF oppCardsRemaining < 3:
        PASS

    ELSE:

        fragileLaneExists =
            EXISTS controlled lane
            WHERE margin <= 2

        IF NOT fragileLaneExists:
            PASS
```

---

# 10. Opponent Comeback Pressure

```text
FUNCTION estimateComebackRisk(state):

    risk = 0

    FOR each AI-controlled lane:

        margin =
            aiLanes[lane]
            - oppLanes[lane]

        IF margin == 1:
            risk += 3

        ELSE IF margin == 2:
            risk += 2

        ELSE IF margin <= 4:
            risk += 1

    IF oppHandCount >= 6:
        risk *= 1.30

    ELSE IF oppHandCount >= 4:
        risk *= 1.15

    ELSE IF oppHandCount <= 2:
        risk *= 0.70

    RETURN risk
```

Starting interpretation:

```text
IF aiControlled >= 2
AND comebackRisk <= 5:
    lean strongly toward PASS

IF comebackRisk >= 9:
    usually continue unless conservation is extremely important
```

---

# 11. Match Score Adjustment

```text
FUNCTION passAggressionProfile(state):

    IF aiRoundsWon == 1
    AND oppRoundsWon == 0:

        RETURN {
            passBias: +18,
            rescueBias: -12,
            conservationMultiplier: 1.35
        }

    IF aiRoundsWon == 0
    AND oppRoundsWon == 1:

        RETURN {
            passBias: -20,
            rescueBias: +18,
            conservationMultiplier: 0.65
        }

    IF aiRoundsWon == 1
    AND oppRoundsWon == 1:

        RETURN {
            passBias: -30,
            rescueBias: +30,
            conservationMultiplier: 0.20
        }

    RETURN {
        passBias: 0,
        rescueBias: 0,
        conservationMultiplier: 1.00
    }
```

---

# 12. Card Conservation Value

```text
FUNCTION calculateConservationValue(state):

    IF roundNum == 3:
        RETURN 0

    value = 0

    FOR card IN aiHand:

        cardValue = 0

        IF card.bv >= 38:
            cardValue += 16

        ELSE IF card.bv >= 29:
            cardValue += 11

        ELSE IF card.bv >= 23:
            cardValue += 7

        ELSE IF card.bv >= 14:
            cardValue += 4

        ELSE:
            cardValue += 2

        highest =
            MAX(card.s)

        IF highest >= 9:
            cardValue += 5

        ELSE IF highest >= 8:
            cardValue += 3

        IF card primaryType has AI Mastery:
            cardValue += 2

        IF card belongs to a Set
        AND another same-Set card remains in hand:
            cardValue += 2

        value += cardValue

    IF aiRoundsWon == 1
    AND oppRoundsWon == 0:
        value *= 1.35

    IF aiRoundsWon == 0
    AND oppRoundsWon == 1:
        value *= 0.65

    RETURN value
```

---

# 13. Quantifying Strong Cards Saved

```text
strongCardsSaved =
    count of strong cards currently in hand
```

Concrete rule:

```text
IF passing saves >= 3 strong cards
AND AI already controls >= 2 active lanes:

    PASS unless comebackRisk >= 9
```

If currently losing:

```text
IF passing saves >= 3 strong cards
AND current round probably requires
>= 3 cards to rescue:

    IF match score == 0-0:
        PASS

    IF match score == 1-0:
        PASS

    IF match score == 0-1:
        PLAY

    IF match score == 1-1:
        PLAY
```

---

# 14. Estimate Minimum Cards Required to Win

```text
FUNCTION estimateMinimumCardsToWin(state):

    deficits =
        uncontrolled lanes sorted
        by points needed to take control

    lanesNeeded =
        3 - currentAIControlled

    IF lanesNeeded <= 0:
        RETURN 0

    remainingCards =
        COPY(aiHand)

    cardsUsed = 0

    FOR targetLane IN easiest lanes first:

        pointsNeeded =
            oppLanes[targetLane]
            - aiLanes[targetLane]
            + 1

        candidateCards =
            remainingCards sorted descending
            by legalContribution(card, targetLane)

        runningTotal = 0

        WHILE runningTotal < pointsNeeded:

            IF candidateCards empty:
                RETURN INFINITY

            card =
                POP best candidate

            runningTotal +=
                legalContribution(
                    card,
                    targetLane
                )

            REMOVE card from remainingCards

            cardsUsed += 1

        lanesNeeded -= 1

        IF lanesNeeded == 0:
            RETURN cardsUsed

    RETURN INFINITY
```

---

# 15. Concrete Rescue Thresholds

At 0-0:

```text
IF estimatedCardsToWin >= 4:
    PASS

IF estimatedCardsToWin == 3
AND strongCardsRequired >= 2:
    PASS
```

Ahead 1-0:

```text
IF estimatedCardsToWin >= 3:
    PASS

IF estimatedCardsToWin == 2
AND strongCardsRequired >= 2:
    PASS
```

Behind 0-1:

```text
IF estimatedCardsToWin <= 4:
    PLAY

IF estimatedCardsToWin >= 5:
    PASS only if comeback probability is very low
```

At 1-1:

```text
IF mathematically winnable:
    PLAY
```

unless already winning.

---

# 16. Decision While Not Ahead

```text
FUNCTION decideWhileNotAhead(
    state,
    metrics
):

    mode =
        getMatchMode(state)

    cardsNeeded =
        estimateMinimumCardsToWin(state)

    conservation =
        calculateConservationValue(state)

    strongNeeded =
        estimateStrongCardsRequiredToWin(state)

    IF cardsNeeded == INFINITY:
        RETURN PASS

    # FINAL ROUND
    IF state.aiRoundsWon == 1
    AND state.oppRoundsWon == 1:

        IF mathematically winnable:
            RETURN PLAY

        RETURN PASS

    # BEHIND 0-1
    IF state.aiRoundsWon == 0
    AND state.oppRoundsWon == 1:

        IF cardsNeeded <= 4:
            RETURN PLAY

        IF cardsNeeded == 5
        AND aiHand.length >= 6:
            RETURN PLAY

        RETURN PASS

    # AHEAD 1-0
    IF state.aiRoundsWon == 1
    AND state.oppRoundsWon == 0:

        IF cardsNeeded >= 3:
            RETURN PASS

        IF cardsNeeded == 2
        AND strongNeeded >= 2:
            RETURN PASS

        RETURN PLAY

    # 0-0
    IF cardsNeeded >= 4:
        RETURN PASS

    IF cardsNeeded == 3
    AND strongNeeded >= 2:
        RETURN PASS

    RETURN PLAY
```

---

# 17. Generic Pass Score

```text
FUNCTION calculatePassScore(state, metrics):

    score = 0

    score +=
        metrics.aiControlled * 14

    score -=
        metrics.oppControlled * 10

    FOR margin IN metrics.laneMargins:

        IF margin >= 7:
            score += 8

        ELSE IF margin >= 4:
            score += 5

        ELSE IF margin >= 1:
            score += 1

    conservation =
        calculateConservationValue(state)

    score +=
        conservation * 0.35

    score -=
        estimateComebackRisk(state) * 4

    profile =
        passAggressionProfile(state)

    score +=
        profile.passBias

    IF roundNum == 1:
        score += 8

    ELSE IF roundNum == 2:
        score += 2

    ELSE IF roundNum == 3:
        score -= 20

    RETURN score
```

---

# 18. Compare PASS to PLAY

```text
FUNCTION finalPassComparison(
    state,
    metrics
):

    passScore =
        calculatePassScore(
            state,
            metrics
        )

    bestPlayScore =
        metrics.bestPlay.finalScore

    PASS_MARGIN = 5

    IF passScore >=
       bestPlayScore + PASS_MARGIN:

        RETURN PASS

    RETURN PLAY
```

---

# 19. Complete Decision Tree

```text
FUNCTION decidePass(state):

    IF aiHand.length == 0:
        RETURN PASS

    metrics =
        analysePassState(state)

    # OPPONENT HAS PASSED
    IF oppHasPassed:

        IF projectedRoundResult(
            aiLanes,
            oppLanes
        ) == WIN:

            RETURN PASS

        IF isRoundMathematicallyUnwinnable(
            state,
            metrics
        ):

            RETURN PASS

        RETURN PLAY

    # HOPELESS ROUND
    IF isRoundMathematicallyUnwinnable(
        state,
        metrics
    ):

        RETURN PASS

    # FINAL ROUND: 1-1
    IF aiRoundsWon == 1
    AND oppRoundsWon == 1:

        IF metrics.aiControlled >= 2
        AND estimateComebackRisk(state) <= 5:

            RETURN PASS

        RETURN PLAY

    # AI CONTROLS 4+ LANES
    IF metrics.aiControlled >= 4:

        IF aiHand.length <= 5:
            RETURN PASS

        IF estimateComebackRisk(state) <= 8:
            RETURN PASS

    # AI CONTROLS EXACTLY 3 LANES
    IF metrics.aiControlled == 3:

        IF all controlled lane margins >= 4
        AND aiHand.length <= 6:

            RETURN PASS

        IF aiHand.length <= 4:

            IF metrics.oppCardsRemaining < 3:
                RETURN PASS

            fragileLaneExists =
                EXISTS controlled lane
                WHERE margin <= 2

            IF NOT fragileLaneExists:
                RETURN PASS

        IF metrics.strongCardCount >= 3
        AND estimateComebackRisk(state) < 9:

            RETURN PASS

    # MATCH LEAD 1-0
    IF aiRoundsWon == 1
    AND oppRoundsWon == 0:

        cardsNeeded =
            estimateMinimumCardsToWin(state)

        strongNeeded =
            estimateStrongCardsRequiredToWin(
                state
            )

        IF cardsNeeded >= 3:
            RETURN PASS

        IF cardsNeeded == 2
        AND strongNeeded >= 2:
            RETURN PASS

    # MATCH TRAIL 0-1
    IF aiRoundsWon == 0
    AND oppRoundsWon == 1:

        cardsNeeded =
            estimateMinimumCardsToWin(state)

        IF cardsNeeded <= 4:
            RETURN PLAY

        IF cardsNeeded == 5
        AND aiHand.length >= 6:
            RETURN PLAY

    # FIRST ROUND / 0-0
    IF aiRoundsWon == 0
    AND oppRoundsWon == 0:

        cardsNeeded =
            estimateMinimumCardsToWin(state)

        strongNeeded =
            estimateStrongCardsRequiredToWin(
                state
            )

        IF cardsNeeded >= 4:
            RETURN PASS

        IF cardsNeeded == 3
        AND strongNeeded >= 2:
            RETURN PASS

    # FALLBACK NUMERIC COMPARISON
    passScore =
        calculatePassScore(
            state,
            metrics
        )

    bestPlayScore =
        metrics.bestPlay.finalScore

    IF passScore >=
       bestPlayScore + 5:

        RETURN PASS

    RETURN PLAY
```

---

# 20. Strong-Card Requirement Estimate

```text
FUNCTION estimateStrongCardsRequiredToWin(state):

    targetCards =
        cards selected by
        estimateMinimumCardsToWin()

    count = 0

    FOR card IN targetCards:

        IF isStrongCard(card):
            count += 1

    RETURN count
```

Prefer returning a richer object from the rescue estimator:

```text
{
    cardsNeeded,
    cardsUsed[],
    achievable
}
```

---

# 21. Recommended Debug Output

```text
PASS DECISION

Round:                  1
Match score:            AI 1 - 0 Opponent

AI lanes controlled:    2
Opponent controlled:    2

Cards in AI hand:       6
Strong cards saved:     3

Estimated cards to win: 3
Strong cards required:  2

Comeback risk:          4
Conservation value:     41

Mathematically hopeless: false

Pass score:             78
Best play score:        61

DECISION: PASS
```

Final-round example:

```text
PASS DECISION

Round:                  3
Match score:            1 - 1

AI lanes controlled:    2
Estimated cards to win: 2
Mathematically hopeless: false

Conservation weighting: minimal

DECISION: PLAY
```

Hopeless-round example:

```text
PASS DECISION

Estimated cards to win: INFINITY
Mathematically hopeless: true

DECISION: PASS
```

This directly implements the rule that a strong AI should not continually spend cards trying to rescue a mathematically hopeless round.
