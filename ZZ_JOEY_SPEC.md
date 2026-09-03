# Maths Card Battle – Complete Game Rules & Implementation Specification v1.0

## 1. Purpose

This document defines the complete rules for the collectible card battle game embedded within the maths app.

It is intended as an implementation specification. Where practical, game logic is expressed explicitly so that the rules can be translated directly into code.

The core design principles are:

- card collecting remains primarily driven by completing maths content and opening packs
- battles create an additional strategic use for the collection
- mathematical thinking is embedded naturally in gameplay rather than presented as separate maths questions
- high-rarity cards are stronger but cannot simply dominate through raw power
- Common and Uncommon cards remain useful throughout progression
- deck construction, card conservation, positioning, probability and tactical decisions should matter
- battles are PvE against the computer
- battles should be short enough to replay frequently but deep enough to support repeated play

---

# 2. Module Structure

The app contains three modules corresponding broadly to UK Key Stages 2, 3 and 4.

Each module contains:

## 40 collectible cards

Split into:

- **30 Regular Cards**
- **10 Boss Cards**

Cards have one of five rarity levels:

- Common
- Uncommon
- Rare
- Epic
- Legendary

Typical Battle Values are approximately:

| Rarity | Typical Battle Value |
|---|---:|
| Common | 12–13 |
| Uncommon | 15–16 |
| Rare | approximately 25 |
| Epic | low 30s |
| Legendary | 40s |

These are guidelines rather than rules requiring every card to fall within those exact ranges.

---

# 3. Card Data

Every collectible card requires the following battle data:

- Card ID
- Character name
- Module
- Boss or Regular status
- Rarity
- Battle Value
- Arithmetic stat
- Geometry stat
- Logic stat
- Science stat
- Speed stat
- Primary Type
- Named Set, if applicable
- Quantity owned
- Artwork state

The five statistics are:

1. Arithmetic
2. Geometry
3. Logic
4. Science
5. Speed

The card's **Primary Type** normally corresponds to its strongest statistic.

If the existing card data already defines Type, that stored value should be authoritative.

---

# 4. Named Sets

Cards may additionally belong to one of three named Sets:

- **Ninefold Orchard**
- **Little Reckoning**
- **Gifford**

Set membership is independent of Primary Type.

A Geometry card may therefore also be a Gifford card, for example.

A card can contribute simultaneously towards:

- a Type deck bonus
- a Set battlefield bonus

These are separate systems.

---

# 5. Battle Value

Battle Value, or **BV**, represents the cost of including a card within a deck.

BV is **not** directly added to a lane during battle.

A high-BV card generally has stronger statistics, but its higher deck-building cost prevents a deck from simply containing fifteen extremely powerful cards.

---

# 6. Player Deck

A legal standard battle deck contains:

## Exactly 15 cards

with:

## Maximum total BV: 300

and:

## Maximum 2 copies of the same character

The player must own each copy included in the deck.

Example:

If the player owns:

- 1 × Infinitus

they may include one Infinitus.

If they own:

- 3 × Infinitus

they may still include a maximum of two copies in one deck.

There is no minimum BV requirement.

---

# 7. Placeholder Cards

A player who does not yet own enough cards to create a 15-card deck receives temporary Placeholder Cards.

Each Placeholder has:

## Battle Value: 8

Its five statistics are randomly generated non-negative integers whose total is exactly:

## 8

Zero is permitted.

Valid examples include:

- 8 / 0 / 0 / 0 / 0
- 4 / 2 / 1 / 1 / 0
- 2 / 2 / 2 / 1 / 1
- 0 / 0 / 6 / 2 / 0

Placeholder cards should therefore sometimes be highly specialised.

The Placeholder's Primary Type is whichever statistic is highest.

If multiple statistics are tied for highest, randomly choose one of those tied Types.

Placeholder Cards:

- have BV 8
- may be used in battle
- may count towards Type thresholds
- do not belong to Ninefold Orchard, Little Reckoning or Gifford
- cannot be collected permanently
- cannot be staked in a Character Challenge

---

# 8. Battlefield

The battlefield contains five lanes:

## Arithmetic | Geometry | Logic | Science | Speed

Each player has a score in every lane.

Scores begin each round at:

## 0

Cards played during the round remain visible on the battlefield until the round ends.

---

# 9. Playing a Card

On a normal turn, the player must either:

## PLAY

or:

## PASS

When playing a card:

1. select one card from the hand
2. select one of the five lanes
3. place the card into that lane
4. add the card's corresponding statistic to that lane's score

Example card:

- Arithmetic 1
- Geometry 7
- Logic 3
- Science 1
- Speed 3

Played into Geometry:

## +7 Geometry

Played into Logic:

## +3 Logic

Played into Arithmetic:

## +1 Arithmetic

The same card can therefore have dramatically different tactical value depending upon where it is played.

---

# 10. Lane Control

A player controls a lane when their score in that lane is greater than the opponent's.

Example:

| Lane | Player | AI |
|---|---:|---:|
| Arithmetic | 8 | 11 |
| Geometry | 14 | 9 |
| Logic | 12 | 12 |
| Science | 7 | 5 |
| Speed | 6 | 8 |

The player controls:

- Geometry
- Science

The AI controls:

- Arithmetic
- Speed

Logic is tied and controlled by neither player.

---

# 11. Passing

Instead of playing a card, a player may **Pass**.

Passing means:

- the player plays no further cards during that round
- passing cannot be reversed
- cards already played remain on the battlefield
- the opponent may continue playing
- the round ends when both players have passed or can no longer play

Passing is a fundamental strategic mechanic.

Players must decide whether securing the current round is worth spending additional cards that might be more useful later.

---

# 12. Winning a Round

At the end of the round, count the lanes controlled by each player.

The player controlling more lanes wins the round.

Normally:

## 3 of the 5 lanes is sufficient to win.

A tied lane belongs to neither player.

If both players control the same number of lanes, compare:

## Total score across all five lanes.

Higher total wins the round.

If total scores are also identical, the round is a draw.

---

# 13. Winning a Battle

A battle is:

## Best of three rounds.

The first side to win:

## 2 rounds

wins the battle.

---

# 14. Cards Across Rounds

Cards played during a round are normally spent for the remainder of that battle.

They do not automatically return to the hand when a round finishes.

Cards remaining in the player's hand remain available in subsequent rounds.

This means players must manage their cards across the entire battle.

---

# 15. Starting a Battle

Each side begins with a 15-card deck.

At battle start:

1. shuffle the deck
2. draw 10 cards
3. leave 5 cards in the Reserve Deck
4. allow the player to Mulligan up to 2 cards

---

# 16. Mulligan

The player may replace up to two cards from the opening hand.

For each replacement:

1. select a card
2. temporarily remove it
3. draw a replacement from the Reserve Deck
4. return the removed card to the Reserve Deck
5. shuffle the Reserve Deck

The player therefore cannot immediately redraw the same Mulliganed card as its own replacement.

---

# 17. Drawing Between Rounds

After Round 1:

## Draw 2 cards from the Reserve Deck.

After Round 2:

## Draw 2 cards from the Reserve Deck.

If fewer than two cards remain, draw all remaining cards.

There is normally no automatic card draw during a round.

---

# 18. Starting Player

At the beginning of Round 1:

## randomly select the starting player.

For subsequent rounds:

## the player who lost the previous round plays first.

If the previous round was drawn, alternate the starting player.

---

# 19. Type Bonuses

Type bonuses are determined by the cards contained in the player's **15-card deck**.

The cards do not need to be drawn or played for the bonus to be unlocked.

There are two thresholds:

## 3 cards of one Type = Affinity

## 5 cards of one Type = Mastery

Mastery includes the Affinity benefit.

Example:

A deck containing five Geometry-type cards receives both Geometry Affinity and Geometry Mastery.

---

# 20. Arithmetic Type

Arithmetic represents:

- precision
- exact calculation
- planning
- control over future draws

## Arithmetic Affinity: Calculation

Requirement:

## 3 Arithmetic cards in the deck

Once per round:

If the **printed statistic** of a card you play produces an exact tie in that lane, you may inspect the top card of your Reserve Deck.

You may:

- leave it on top, or
- move it to the bottom of the Reserve Deck

No card is drawn.

Example:

Player Arithmetic score:

## 8

Opponent Arithmetic score:

## 13

Player plays a card with printed Arithmetic:

## 5

The result is exactly 13–13.

Calculation activates.

Effects caused by another ability do not manufacture this exact-tie condition.

---

## Arithmetic Mastery: Exact Answer

Requirement:

## 5 Arithmetic cards in the deck

Once per battle:

If playing a card leaves you exactly:

## 1 point ahead

in that lane, inspect the top:

## 3 cards

of your Reserve Deck.

Return those cards to the top in any order.

No cards are gained or removed.

---

# 21. Geometry Type

Geometry represents:

- spatial relationships
- neighbouring lanes
- movement
- symmetry

## Geometry Affinity: Adjacent Support

Requirement:

## 3 Geometry cards in the deck

Once per round:

When a Geometry-type card is played, choose **one adjacent lane**.

That lane receives:

## +1

Lane adjacency follows the battlefield order:

Arithmetic ↔ Geometry ↔ Logic ↔ Science ↔ Speed

Arithmetic therefore has only Geometry as a neighbour.

Logic has Geometry and Science as neighbours.

---

## Geometry Mastery: Symmetry

Requirement:

## 5 Geometry cards in the deck

Once per battle:

Move one of your played Geometry-type cards between a mirrored pair of lanes:

- Arithmetic ↔ Speed
- Geometry ↔ Science

When moved:

- remove its old contribution
- place it in the mirrored lane
- calculate its contribution using its printed statistic for the new lane

Logic has no mirrored partner.

Using Symmetry is optional.

---

# 22. Logic Type

Logic represents:

- information
- deduction
- prediction
- inference

## Logic Affinity: Deduction

Requirement:

## 3 Logic cards in the deck

At the beginning of each round:

Reveal one random card from the opponent's hand.

That card remains visible until:

- it is played, or
- the round ends

---

## Logic Mastery: Prediction

Requirement:

## 5 Logic cards in the deck

Once per round:

Before the opponent's next normal play, predict which lane they will play into.

If the prediction is correct:

## +1 to that lane

after the opponent's card resolves.

If incorrect:

No effect.

The ability is then spent for that round.

---

# 23. Science Type

Science represents:

- experimentation
- flexibility
- using cards in unconventional ways

## Science Affinity: Experiment

Requirement:

## 3 Science cards in the deck

Once per round:

When playing a card, the player may use that card's:

## second-highest statistic

instead of its normal statistic for the selected lane.

Example:

Card:

- Arithmetic 2
- Geometry 8
- Logic 6
- Science 3
- Speed 1

Played into Science normally:

## 3

Using Experiment:

## 6

---

## Science Mastery: Breakthrough

Requirement:

## 5 Science cards in the deck

Once per battle:

When playing a card, use that card's:

## highest statistic

regardless of which lane it is being played into.

Example:

A card whose highest statistic is Geometry 9 may contribute 9 to Arithmetic for that single play.

---

# 24. Speed Type

Speed represents:

- tempo
- reaction
- initiative
- card selection

## Speed Affinity: Quick Start

Requirement:

## 3 Speed cards in the deck

When drawing each normal card between rounds:

1. reveal the top two available cards from the Reserve Deck
2. choose one to draw
3. return the other to the Reserve Deck

The player still receives only the normal number of cards.

Quick Start therefore improves card selection but does not create card advantage.

---

## Speed Mastery: Initiative

Requirement:

## 5 Speed cards in the deck

Once per battle:

Immediately after the opponent plays a card, you may respond by playing one card before the opponent has another opportunity to act or pass.

The response card receives:

## +1 in the lane where it is played.

This response consumes your next normal turn.

Therefore Initiative changes the sequence of play but does **not** grant an additional card play overall.

---

# 25. Set Bonuses

Unlike Type bonuses, Set bonuses depend upon cards actually **played during the current round**.

Cards merely being present in the deck or hand do not activate Set bonuses.

Set counters reset to zero at the beginning of every round.

A Set has:

- a 2-card effect
- a 3-card effect

Each threshold can trigger only once during a round.

---

# 26. Ninefold Orchard

Ninefold Orchard represents:

## growth and spreading influence across the battlefield

### Orchard Growth

Trigger:

## Second Ninefold Orchard card played during the round

Choose up to:

## 2 lanes you currently occupy

Each receives:

## +1

---

### Full Bloom

Trigger:

## Third Ninefold Orchard card played during the round

Choose one of your played cards.

Then choose:

## one adjacent lane

to that card's current lane.

That adjacent lane receives:

## +2

The adjacent lane does not need to contain another card.

---

# 27. Little Reckoning

Little Reckoning represents:

## inexpensive cards, underdogs and efficient use of low-BV characters

### Small Advantage

Trigger:

## Second Little Reckoning card played during the round

Choose one of your played cards with:

## BV 16 or lower

The lane containing that card receives:

## +3

---

### Reckoning

Trigger:

## Third Little Reckoning card played during the round

Choose one of your played cards with:

## BV 16 or lower

For the remainder of that round:

## double that card's current contribution to its lane.

Example:

A BV 13 card currently contributes:

## 7 Geometry

Reckoning adds another:

## +7 Geometry

for a total contribution of:

## 14

Only the card's current battlefield contribution is doubled.

Other unrelated lane bonuses are not duplicated.

---

# 28. Gifford

Gifford represents:

## control and battlefield manipulation

### Recalibrate

Trigger:

## Second Gifford card played during the round

Move one of your previously played cards to:

## any other lane.

When moved:

1. remove its existing contribution from its original lane
2. calculate its printed statistic for the destination lane
3. add that value to the destination lane
4. add an additional:

## +1

to its destination contribution

Example:

A card currently contributes Geometry 8.

It is moved to Logic, where its printed Logic value is 4.

It now contributes:

## 5 Logic

---

### Override

Trigger:

## Third Gifford card played during the round

Perform both of the following, where legal:

### 1. Opponent movement

Move one opposing card into one immediately adjacent lane.

Its old contribution is removed.

It then contributes its printed statistic for the new lane.

### 2. Friendly movement

Move one of your own cards to any other lane.

It contributes its printed statistic for the new lane plus:

## +1

If one of the two movement effects has no legal target, resolve the other effect normally.

---

# 29. Interaction Between Bonuses

A single card may activate more than one system.

Example:

A Geometry-type Gifford card may:

- activate Geometry Affinity when played
- count as the second or third Gifford card of the round
- receive effects from other abilities

Unless specifically stated otherwise:

## effects resolve in the order in which they are triggered.

The implementation should show the player what has happened rather than silently altering scores.

---

# 30. Card Acquisition

The battle system does **not** replace the existing pack-opening progression.

The primary acquisition loop remains:

## Complete maths content → earn packs → open packs → collect cards

Cards can also be obtained through Boss progression and Character Challenges.

---

# 31. Boss Cards

Each 40-card module contains:

## 10 Boss Cards

Boss Cards are not obtained through Character Challenges.

Boss Cards are earned by:

## completing their associated maths test.

When a Boss is defeated:

1. the player receives one copy of that Boss Card
2. the Boss becomes owned normally
3. the player receives:

## 1 Challenge Token

There are therefore a maximum of:

## 10 Boss-earned Challenge Tokens per module.

---

# 32. Challenge Tokens

A Challenge Token allows the player to permanently unlock one **Regular Card** as a Character Challenge target.

There are:

## 30 Regular Cards

and only:

## 10 Challenge Tokens

per module.

Therefore the player may ultimately select:

## 10 of the 30 Regular Cards

to obtain through Character Challenges.

The remaining:

## 20 Regular Cards

must be obtained through packs.

Combined with the 10 Boss Cards:

## 20 of the module's 40 cards can potentially be won directly

while:

## 20 of the 40 must be pack-pulled.

---

# 33. Unlocking a Character Challenge

Before spending a Challenge Token, an unowned Regular Card that has not already been unlocked remains hidden according to the normal collection interface.

When the player chooses to spend one Challenge Token on a Regular Card:

1. consume one Challenge Token
2. permanently unlock that character's Challenge
3. reveal the card to the player
4. show its artwork in:

## black and white

5. show the card's battle information
6. mark it as:

## Revealed / Not Owned

Spending the token **unlocks the challenge permanently**.

The player does not need another token for future attempts against that same card.

The black-and-white artwork communicates:

> You have discovered this card but have not yet won it.

Once the card is obtained, display the normal full-colour version.

---

# 34. Character Challenge

A Character Challenge is a PvE battle against a deck built around the revealed target card.

The target card must be included in the AI's 15-card deck.

Its BV counts normally towards the AI's deck budget.

The target is not artificially strengthened.

The AI's overall deck strength is determined primarily by the target's rarity.

---

# 35. PvE Character Challenge Budgets

Use the following maximum AI deck Battle Values:

| Target rarity | AI deck BV |
|---|---:|
| Common | **250** |
| Uncommon | **275** |
| Rare | **300** |
| Epic | **325** |
| Legendary | **375** |

The challenged character is included within this total.

Example:

A Legendary target with:

## BV 44

in a Legendary challenge leaves up to:

## 331 BV

for the other 14 cards.

The player retains the standard:

## 300 BV

deck limit.

---

# 36. Character Challenge Risk

Character Challenges use the risk mechanic.

Before beginning the battle, the player selects:

## one owned collectible card to stake.

The selected stake must be shown clearly before confirmation.

Placeholder Cards cannot be staked.

If the player wins:

- they keep the staked card
- they receive one copy of the challenged character
- the target becomes fully owned and shown in colour

If the player loses:

- they do not receive the challenged character
- they lose the staked card from their collection
- the Character Challenge remains unlocked
- they may try again later without another Challenge Token

If losing the staked card would reduce the number owned from two to one, one copy remains.

If the player owns only one copy, that card is removed from their collection.

Decks containing that card must subsequently be validated and repaired if necessary.

---

# 37. Challenge Token Behaviour

Challenge Tokens are spent when:

## unlocking a new Regular Card challenge

not when starting an individual battle.

Therefore:

- losing a Character Challenge does not consume another token
- retrying an unlocked challenge does not require another token
- a maximum of ten different Regular Cards can be challenge-unlocked within each module

This ensures the player's ten Boss victories ultimately allow ten Regular Cards to become challengeable while preserving genuine risk through the card-staking mechanic.

---

# 38. Winning an Already-Owned Challenge Card

If the player obtains the target card from a pack after unlocking its Character Challenge but before defeating it:

- the card becomes owned normally
- its artwork becomes full colour
- its Character Challenge remains available as a Friendly Battle
- winning that challenge does not award an additional free copy unless a future design explicitly adds repeat rewards

A Challenge Token is not refunded.

The token was used to unlock the character encounter, not to purchase the card itself.

---

# 39. Friendly Battles

A player may challenge:

## any card they already own

to a Friendly Battle.

Friendly Battles:

- use the standard battle rules
- use the target character as the centrepiece of the AI deck
- use the target's normal rarity-based AI BV budget
- require no Challenge Token
- require no staked card
- do not award another copy of the target
- do not remove cards if the player loses

Friendly Battles exist for:

- replayability
- deck testing
- practising against particular characters
- experimenting with new card combinations
- enjoying favourite encounters again

---

# 40. AI Deck Construction

Every AI opponent uses:

## exactly 15 cards.

For a Character Challenge or Friendly Battle:

1. target character must be included
2. determine AI BV cap from target rarity
3. construct the remaining deck within that budget
4. respect the same maximum-two-copies rule unless a deliberately authored Boss encounter later overrides it

AI decks should attempt to create coherent strategies.

They should not simply select the fifteen highest-value cards available.

Where possible, the AI should consider:

- Type bonuses
- named Set combinations
- complementary stat distributions
- specialist cards
- efficient BV usage

---

# 41. AI Information Rules

The AI must not cheat.

The AI may use:

- its own hand
- its own Reserve Deck composition
- all cards already played
- visible player cards
- current lane scores
- known active Type bonuses
- known triggered Set effects
- number of cards remaining

The AI must not inspect:

- hidden cards in the player's hand
- hidden order of the player's Reserve Deck

except where a legitimate game ability reveals that information.

---

# 42. AI Difficulty

Difficulty comes from:

- different AI deck BV budgets
- better or worse deck construction
- better or worse lane evaluation
- better or worse passing decisions
- better or worse preservation of strong cards
- better or worse use of Type and Set abilities

The AI should not receive secret statistical bonuses solely because an opponent is high rarity.

---

# 43. Passing AI

The AI must be capable of intentionally conceding a round.

It should consider factors including:

- lanes currently controlled
- size of lane deficits
- cards remaining in its hand
- cards remaining in the player's hand
- current round score
- match score
- likely cost of overturning the current round
- value of conserving cards for later rounds

A strong AI should not continually spend cards trying to rescue a mathematically hopeless round.

---

# 44. Collection Value of Lower-Rarity Cards

The system is specifically designed so that Common and Uncommon cards remain useful.

Their advantages include:

### Lower BV cost

A 12-BV Common consumes far less deck budget than a 44-BV Legendary.

### Specialisation

A low-rarity card may still have one unusually strong statistic.

### Type composition

Cheap cards can efficiently unlock 3-card and 5-card Type bonuses.

### Set composition

Low-rarity cards may be required to activate Ninefold Orchard, Little Reckoning or Gifford.

### Little Reckoning

Cards with BV 16 or lower receive direct strategic support from the Little Reckoning Set.

### Resource management

A player may commit inexpensive cards to an early round while saving premium cards for later.

---

# 45. Duplicates

Players may collect unlimited copies of any normal collectible card.

Battle decks may use:

## maximum 2 copies of one character.

Copies beyond two remain in the player's collection.

No fusion, upgrade or crafting system is defined by these battle rules.

---

# 46. Rarity

Rarity does not itself generate a combat modifier.

There is no rule such as:

> Legendary cards receive +5.

A Legendary is stronger because its printed statistics are generally stronger.

Its counterbalance is its high BV cost.

---

# 47. UI Information During Battle

The player should always be able to see:

- their hand
- cards they have played
- cards the opponent has played
- current Arithmetic score
- current Geometry score
- current Logic score
- current Science score
- current Speed score
- which lanes each player currently controls
- number of cards in each hand
- number of cards remaining in each Reserve Deck
- current round number
- rounds won
- whether either player has passed
- active Type bonuses
- Set progress during the current round
- whether once-per-round abilities remain available
- whether once-per-battle abilities remain available

---

# 48. Hidden Mathematical Thinking

There are no mandatory separate maths questions inside standard card battles.

The maths is embedded in gameplay.

Players naturally perform or develop:

- addition
- subtraction
- comparison
- differences
- exact totals
- optimisation
- probability
- planning
- spatial reasoning
- sequencing
- resource allocation
- opportunity-cost reasoning
- pattern recognition
- deduction

Examples include:

> "I am 4 behind in Logic. Which card can win that lane without wasting my strongest card?"

> "I control three lanes. Do I need to play again?"

> "I've already used most of my Geometry specialists. How likely am I to draw another?"

> "If I move this card with Gifford, I lose 7 here but gain 5 there. Does that actually improve the number of lanes I control?"

The educational value should emerge naturally from these decisions.

---

# 49. Core Numerical Constants

For implementation, the current standard values are:

```text
CARDS_PER_MODULE = 40

REGULAR_CARDS_PER_MODULE = 30
BOSS_CARDS_PER_MODULE = 10

DECK_SIZE = 15
PLAYER_BV_LIMIT = 300

MAX_COPIES_PER_CHARACTER = 2

OPENING_HAND_SIZE = 10
MULLIGAN_LIMIT = 2

DRAW_AFTER_ROUND_1 = 2
DRAW_AFTER_ROUND_2 = 2

LANE_COUNT = 5

ROUNDS_TO_WIN = 2
MAX_NORMAL_ROUNDS = 3

PLACEHOLDER_BV = 8
PLACEHOLDER_TOTAL_STATS = 8

TYPE_AFFINITY_THRESHOLD = 3
TYPE_MASTERY_THRESHOLD = 5

SET_MINOR_THRESHOLD = 2
SET_MAJOR_THRESHOLD = 3

BOSS_CHALLENGE_TOKENS_REWARDED = 1

MAX_CHALLENGE_TOKENS_PER_MODULE = 10
MAX_REGULAR_CHALLENGE_UNLOCKS_PER_MODULE = 10

COMMON_AI_BV = 250
UNCOMMON_AI_BV = 275
RARE_AI_BV = 300
EPIC_AI_BV = 325
LEGENDARY_AI_BV = 375
```

---

# 50. Battle State

A battle implementation should maintain at least:

```text
Battle
    roundNumber
    playerRoundsWon
    opponentRoundsWon
    startingPlayer
    currentTurn
    battleFinished
    winner

PlayerBattleState
    deck
    reserveDeck
    hand
    playedCards
    laneScores[5]
    hasPassed
    typeBonuses
    oncePerRoundAbilities
    oncePerBattleAbilities
    setCardsPlayedThisRound
```

---

# 51. Card Battlefield State

A played card should retain:

```text
PlayedCard
    cardId
    owner
    currentLane
    currentContribution
    originalPrintedContribution
    temporaryBonuses
    movedThisRound
```

This is important because movement effects must remove the card's **current contribution**, not blindly subtract its original printed value.

---

# 52. Round Reset

At the end of a round:

Reset:

- lane scores
- battlefield cards
- Set counters
- once-per-round abilities
- passed state

Do not reset:

- hand
- Reserve Deck
- cards already spent
- round wins
- once-per-battle abilities already used

Then perform the appropriate between-round draw.

---

# 53. Character Collection State

Each collectible card should support at least:

```text
CollectionCardState
    cardId
    quantityOwned
    challengeUnlocked
    challengeCompleted
    isBoss
    artworkState
```

Possible artwork states:

```text
HIDDEN
REVEALED_BLACK_AND_WHITE
OWNED_COLOUR
```

---

# 54. Challenge Token State

Challenge Tokens should be tracked separately for each module.

Example:

```text
ModuleProgress
    moduleId
    bossesDefeated
    challengeTokensAvailable
    regularChallengesUnlocked
```

When a Boss is defeated:

```text
bossesDefeated += 1
challengeTokensAvailable += 1
```

When a new Regular Card challenge is unlocked:

```text
challengeTokensAvailable -= 1
regularChallengesUnlocked += 1
target.challengeUnlocked = true
target.artworkState = REVEALED_BLACK_AND_WHITE
```

Maximum:

```text
regularChallengesUnlocked <= 10
```

---

# 55. Character Challenge Resolution

On victory:

```text
target.quantityOwned += 1
target.challengeCompleted = true
target.artworkState = OWNED_COLOUR
```

On defeat:

```text
stakedCard.quantityOwned -= 1
target.challengeCompleted remains false
target.challengeUnlocked remains true
```

Do not consume another Challenge Token.

---

# 56. Friendly Battle Resolution

Friendly Battle:

```text
reward = none
stake = none
collectionChanges = none
```

The result may still be stored for:

- statistics
- achievements
- win/loss history
- future progression systems

but no such system is required by these rules.

---

# 57. Current Balance Status

The rules have been repeatedly simulated with randomly generated card pools.

The rarity-based AI BV progression has consistently produced the intended broad difficulty pattern:

- Common: favourable to player
- Uncommon: moderately favourable
- Rare: approximately even
- Epic: difficult
- Legendary: very difficult

The current AI BV ladder is therefore considered sufficiently stable for implementation and human playtesting.

The Type and Set abilities should be treated as **prototype-balanced rather than mathematically final**.

Actual gameplay telemetry should ultimately take precedence over simulation because human players may value:

- hidden information
- movement
- prediction
- passing
- draw manipulation

differently from a computational heuristic.

---

# 58. Rules to Treat as Locked for Initial Prototype

The initial implementation should regard the following as fixed unless playtesting identifies a specific problem:

- 15-card decks
- 300 player BV limit
- 10-card opening hand
- two-card Mulligan
- two cards drawn between rounds
- five lanes
- best-of-three structure
- lane-control victory
- passing
- cards spent across rounds
- maximum two copies per character
- BV 8 Placeholders with random stats totalling 8
- Type bonuses based on deck composition
- Set bonuses based on cards played that round
- 3-card Affinity threshold
- 5-card Mastery threshold
- 2-card and 3-card Set thresholds
- 250 / 275 / 300 / 325 / 375 opponent BV ladder
- ten Boss Cards per module
- thirty Regular Cards per module
- Boss Cards earned through maths tests
- one Challenge Token per Boss defeated
- maximum ten Regular Card challenge unlocks
- Challenge Tokens permanently unlock encounters
- Character Challenges use card staking
- Friendly Battles have no stake or reward
- 20 of the 40 cards can potentially be won directly
- 20 Regular Cards remain pack-only

---

# 59. Overall Player Progression

The intended progression loop is:

```text
Complete maths activities
        ↓
Earn card packs
        ↓
Open packs
        ↓
Grow collection
        ↓
Build stronger / more interesting decks
        ↓
Complete Boss maths tests
        ↓
Win Boss Cards
        ↓
Earn Challenge Tokens
        ↓
Choose Regular Cards to reveal and challenge
        ↓
Risk owned cards in Character Challenges
        ↓
Win selected characters
        ↓
Experiment with new decks
        ↓
Replay owned characters in Friendly Battles
```

Pack opening remains essential because even a player who defeats every Boss and wins every available Character Challenge still has:

## 20 of the 40 cards in each module that can only be obtained from packs.

The battle game therefore expands the value of the collection without replacing the maths-learning and pack-opening systems that generate it.