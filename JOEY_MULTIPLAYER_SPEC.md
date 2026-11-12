# Joey Multiplayer Specification

Status: deployed 14 September 2026; two-device integration test pending  
Scope: online friendly matches between players in the same Wallaby Maths family or school group  
Related rules: `JOEY_SPEC.md`

---

# 1. Purpose

Joey multiplayer allows two eligible players in the same trusted group to challenge each other to a live friendly match from separate devices.

The first release adds:

- a Challenge Hall where players can declare themselves ready
- a list of ready players in the same group
- challenge, accept, decline, cancel and expiry flows
- a server-authoritative two-player Joey match
- a 30-second turn timer
- reconnection to an unfinished match

The Joey tutorial and Card Lab Character Challenges remain available. There is no generic battle against an anonymous "Joey" opponent: every non-tutorial AI match begins by opening a revealed character in the Card Lab and pressing **Challenge**.

Multiplayer requires an internet connection. Losing connectivity must not damage either player's cards, collection or ordinary progress.

---

# 2. First-release boundaries

Multiplayer matches are Friendly Battles only.

They have:

- no staked cards
- no card rewards
- no Reveal Token rewards or costs
- no collection changes
- no stars or progression rewards
- no effect on boss, lesson, exam or adventure progress

A result may be recorded as a multiplayer win, loss, draw or concession for future statistics and achievements.

The first release does not include:

- public matchmaking
- play outside the player's family or school
- chat, reactions or custom messages
- spectator mode
- tournaments, rankings or leaderboards
- cross-module matches
- asynchronous play over several hours or days
- local pass-and-play on one device
- push notifications when the app is closed

---

# 3. Eligibility and group membership

Group membership is derived by the server from the authenticated account. A client-supplied family id, school code or other group key must never be trusted for authorisation.

## 3.1 Family group

For a personal account, every distinct profile owned by that account belongs to the same family group.

The effective group key is derived from:

```text
family:{account_id}
```

Two devices logged into the same personal account may select different profiles and challenge each other.

A profile may not challenge itself. Two sessions using the same `profile_id` represent the same player and must not be allowed to enter a match together.

## 3.2 School group

For a pupil seat account, every eligible pupil seat carrying the same server-verified `school_code` belongs to the same school group.

The effective group key is derived from:

```text
school:{school_code}
```

Only pupil seat accounts participate as players. A school administrator account does not appear in the Challenge Hall.

## 3.3 Required identity

Every lobby or match request requires:

- a valid account session
- a `profile_id` owned by the authenticated account
- an active entitlement sufficient to use Joey in the selected module
- a valid active Joey deck for that profile and module

The server exposes only the player's generated profile name, avatar and selected module to other players. It must not expose email addresses, usernames, school-seat labels, PIN information or account ids.

---

# 4. Entry points

Each world's front screen contains one **Joey** tile, replacing the former Joey Tutorial tile. Opening it presents three clear choices:

1. **Tutorial**
2. **Challenge a Player**
3. **Challenge a Card Character**

**Tutorial** opens the guided Joey lesson using the active world's cards and artwork.

**Challenge a Player** opens the Challenge Hall for the current profile and active module.

**Challenge a Card Character** opens the Card Lab. The player selects a revealed character, presses the illustrated **Challenge** button, chooses a stake and begins the existing AI Character Challenge. The Joey hub must not choose a random character or launch a generic AI battle.

If the device is offline, the multiplayer choice remains visible but disabled with:

```text
Connect to the internet to challenge another player.
```

If there is only one eligible profile in a personal account, the Challenge Hall may still open, but it explains that another profile in the family is needed before a family match can be played.

---

# 5. Challenge Hall

The Challenge Hall is a new full-screen interface styled for the active module.

It contains:

- the current player's avatar and generated profile name
- the current module
- the selected Joey deck name
- a **Ready for challenges** control
- a list of other ready players in the same group and module
- incoming challenge cards
- the current outgoing challenge, if any
- a connection status indicator
- a Back button

## 5.1 Ready state

Turning readiness on publishes a short-lived presence record containing public lobby information only.

Ready state is renewed while:

- the Challenge Hall is open
- the app is in the foreground
- the profile remains connected
- the profile is not already in another challenge or match

Readiness expires no later than 90 seconds after the most recent renewal. The client should renew it every 30 seconds.

Readiness ends immediately when:

- the player turns it off
- the player leaves the Challenge Hall
- the app reports that it entered the background
- the player sends or accepts a challenge
- a match begins
- the account session becomes invalid

The server remains responsible for expiry even when the client cannot send the final update.

## 5.2 Ready player list

Each ready-player row shows:

- avatar
- generated profile name
- module
- status: Ready or Challenging
- a **Challenge** button when available

The list excludes:

- the current profile
- expired presence records
- profiles in another match
- profiles with a pending challenge that prevents a new one
- profiles using a different module

No deck contents, deck BV, card rarity or collection information is shown.

## 5.3 Empty state

When nobody else is ready, show:

```text
Nobody else is ready just now. Keep this screen open while you wait.
```

---

# 6. Challenge lifecycle

A challenge has one of these states:

```text
pending
accepted
declined
cancelled
expired
superseded
match_created
```

## 6.1 Sending a challenge

When Player A presses **Challenge** beside Player B:

1. the server confirms that both profiles still belong to the same group
2. the server confirms that both profiles are ready in the same module
3. the server confirms that neither profile has another blocking challenge or live match
4. the server creates one pending challenge
5. Player A sees a waiting panel with **Cancel challenge**
6. Player B sees an incoming challenge with **Accept** and **Decline**

A challenge expires 60 seconds after creation.

The challenger cannot send another challenge while the first remains pending.

## 6.2 Accepting

When Player B accepts:

1. the server rechecks eligibility and group membership
2. both profiles' selected decks are validated and frozen as match snapshots
3. the server creates the authoritative match
4. the challenge becomes `match_created`
5. readiness ends for both profiles
6. both clients navigate to the match

Accept is idempotent. Repeating it returns the already-created match rather than creating another one.

## 6.3 Declining, cancelling and expiry

Player B may decline while the challenge is pending. Player A may cancel while it is pending.

When a challenge ends without a match:

- both players return to the ordinary Challenge Hall state
- no progress changes occur
- either player may become ready again

If two challenges involving the same profile are accepted at nearly the same time, the server creates at most one match. Any competing pending challenge becomes `superseded`.

---

# 7. Match preparation

The server owns all randomness and secret match state.

At match creation it:

1. copies and validates each player's selected 15-card deck
2. computes each deck's Type and Set bonuses
3. shuffles both decks
4. deals both opening hands
5. generates the complete legal three-round lane schedule
6. randomly chooses the first player
7. creates separate public and private views

The client must not be able to choose a shuffle seed, opening hand, lane schedule or first player.

## 7.1 Mulligan

Both players enter the mulligan phase simultaneously and see only their own hand.

Each player may make the mulligan allowed by the existing Joey rules, then presses **Ready**.

The mulligan has a 30-second deadline. At expiry, an unconfirmed player automatically keeps their current hand.

Gameplay starts when both players have confirmed or timed out.

One player's mulligan choices are never revealed to the other.

---

# 8. Multiplayer battle rules

Unless this document explicitly changes a rule, `JOEY_SPEC.md` remains authoritative.

The existing concepts of `player` and `ai` become two neutral match sides on the server:

```text
side_a
side_b
```

Each client presents its own side at the bottom of the board and labels it as the local player. The opponent is presented at the top. This means both players see themselves in the familiar player position without changing the meaning of the shared match state.

Both sides use the ordinary Joey rules for:

- PLAY and PASS
- lane control
- Ingenuity Tokens
- Type powers
- Set bonuses
- pending ability choices
- round resolution
- between-round draws
- battle resolution

There is no AI turn during a multiplayer match.

---

# 9. Turn timer

## 9.1 Core rule

On every normal turn, the active player has:

```text
30 seconds
```

to complete a legal action.

A legal completed action is:

- playing a card into a legal active lane and completing any required ability choice
- playing an Ingenuity Token into a legal active lane
- passing voluntarily

Merely selecting a card, opening a card detail view or highlighting a lane does not stop the timer.

## 9.2 Timeout result

If no completed legal action is accepted by the deadline:

```text
the active player passes for the remainder of the current round
```

This is the same state as pressing PASS voluntarily. It is not a one-turn skip.

Passed state resets at the beginning of the next round under the normal Joey round-reset rules.

## 9.3 Consecutive turns

After one player has passed, the remaining player may continue taking normal turns until they also pass or run out of legal plays.

Each newly granted turn receives a fresh 30-second deadline.

## 9.4 Ability choices

A card play and any ability choice it creates form one complete turn.

The recommended server model is:

1. the player submits the card and lane
2. the server validates and records the provisional play
3. if a choice is required, the same turn deadline continues
4. the player submits the ability choice before the deadline
5. the server commits the completed turn and passes priority

If time expires during an optional ability choice, the server applies the ability's safe no-effect or cancel outcome, commits the already-played card and passes priority normally. The player is not marked as passed because they did play a card.

If a future ability has no safe default and its choice is required to make the play legal, the complete provisional action is cancelled and the player is marked as passed for the round.

Every ability must declare its timeout default before multiplayer release.

## 9.5 Server clock

The authoritative state stores:

```text
turn_started_at
turn_deadline_at
```

Both are server timestamps.

The client displays a countdown calculated from `turn_deadline_at` and a server-time offset. The display is informative only. The server decides whether an action arrived in time.

At zero the local controls become disabled and the screen shows:

```text
Time expired. Passing for this round…
```

An action received after the deadline is rejected even if the sending device still displayed time remaining.

## 9.6 Animations

Local animations never consume a player's decision time.

The server starts a turn deadline only after the match state has entered a state in which that player can legally act. Each response includes the deadline. The client may shorten or skip animations when necessary to display an already-active turn promptly.

Round scoring and round-result presentation do not wait indefinitely for either player to dismiss an overlay. The next round begins from server state after a short fixed presentation interval. Either client may finish its local animation later and then catch up to the current match revision.

---

# 10. Server authority and hidden information

The server is the sole authority for:

- group eligibility
- lobby presence
- challenge state
- deck snapshots
- shuffle order
- hands and Reserve Decks
- lane schedule
- turn order
- legal actions
- ability resolution
- timer deadlines and timeout passes
- round and match results

Clients submit intentions, not replacement state.

Example:

```text
play the card in hand slot 3 into Geometry
```

A client must never submit a complete modified battle object as an action.

## 10.1 Per-player views

Each match response is rendered for the authenticated viewing profile.

The local player may receive:

- their complete hand
- their Reserve Deck count, but not necessarily its future order
- their private ability choices
- all public battlefield information

The opponent may expose only:

- hand count
- Reserve Deck count
- public cards already played
- lane scores
- Ingenuity Token count
- public Type and Set bonuses
- passed state
- public action history

The opponent's hidden hand, Reserve Deck order and private pending choices must never appear in the response, logs or WebSocket events sent to the wrong player.

## 10.2 Action revision

Every authoritative match change increments:

```text
revision
```

Every action contains:

```text
match_id
expected_revision
action_id
action
```

The server rejects an action when `expected_revision` is stale, then returns the latest permitted view.

`action_id` is unique per client action. Repeating the same `action_id` must return the original result without applying the action twice.

---

# 11. Connection and reconnection

The preferred live transport is a WebSocket connected to the authoritative match room. Ordinary authenticated HTTP endpoints provide creation, retrieval and action fallback.

If the WebSocket disconnects:

1. show **Reconnecting…**
2. disable new actions until current state is confirmed
3. attempt to reconnect
4. retrieve the latest per-player match view
5. resume from the current revision and server deadline

The turn timer does not pause during disconnection.

A player who reconnects before their deadline may still act. A player who reconnects after it sees the server-applied timeout result.

Refreshing the page or restarting the app must reopen the unfinished match for that profile.

Lobby presence and challenges may use short polling as a fallback if a live connection is unavailable.

---

# 12. Leaving and abandoned matches

The battle screen includes **Leave Match** behind a confirmation step:

```text
Leave this match? This counts as a concession.
```

A confirmed leave immediately awards the opponent the match by concession.

Closing the app, losing connectivity or entering the background is not an immediate concession. The ordinary turn timer continues.

If an absent player times out and passes, play continues under the normal rules. To prevent a match remaining live indefinitely, the server may close a match as abandoned when it has received no player connection or action for 10 minutes. An abandoned closure makes no collection or progression changes.

Completed and abandoned match rooms may be deleted from live storage after their result and minimal audit data have been retained.

---

# 13. Battle-screen changes

The existing Joey board remains the basis of the multiplayer screen.

Required changes are:

- opponent generated name and avatar
- local generated name and avatar where space permits
- a prominent turn countdown
- **Your turn**, **Waiting for {name}** and **Passed this round** states
- connection and reconnection status
- a concession control
- multiplayer-aware mulligan readiness
- no local AI thinking or AI action loop
- automatic retrieval of the latest server state after a stale action

The timer should be readable without obscuring cards or lane scores. Its urgency states are:

- 30–11 seconds: ordinary
- 10–6 seconds: highlighted
- 5–1 seconds: urgent pulse with an optional quiet tick
- 0 seconds: disabled and waiting for server confirmation

Timer audio respects the existing sound setting. It must not play while it is the opponent's turn.

The labels **AI**, **AI hand** and similar solo terminology must not appear in multiplayer mode.

---

# 14. Suggested server records

These names are provisional. The implementation may use database tables, Durable Object storage or a combination, but it must preserve the stated invariants.

## 14.1 Presence

```text
JoeyPresence
    profileId
    accountId
    groupKey
    moduleKey
    publicName
    publicAvatar
    deckIndex
    state
    connectionId
    createdAt
    refreshedAt
    expiresAt
```

`accountId`, `groupKey`, `deckIndex` and `connectionId` are private server fields.

## 14.2 Challenge

```text
JoeyChallenge
    challengeId
    groupKey
    moduleKey
    challengerAccountId
    challengerProfileId
    challengedAccountId
    challengedProfileId
    state
    createdAt
    expiresAt
    resolvedAt
    matchId
```

## 14.3 Match

```text
JoeyMatch
    matchId
    groupKey
    moduleKey
    sideAAccountId
    sideAProfileId
    sideBAccountId
    sideBProfileId
    status
    phase
    revision
    authoritativeState
    currentSide
    turnStartedAt
    turnDeadlineAt
    createdAt
    updatedAt
    completedAt
    winnerSide
    completionReason
```

Full authoritative state is private. It must never be returned directly to a client.

---

# 15. Proposed HTTP contract

Exact paths may change during implementation, but the behavioural contract should remain stable.

## 15.1 Lobby

```text
GET  /joey/lobby?profile_id={id}&module={module}
POST /joey/lobby/ready
POST /joey/lobby/not-ready
```

`GET /joey/lobby` returns:

- current presence state
- ready players in the same derived group and module
- incoming pending challenges
- outgoing pending challenge
- recoverable live match, if one exists
- server time

`POST /joey/lobby/ready` accepts:

```json
{
  "profile_id": "profile id",
  "module": "primary",
  "deck_index": 0
}
```

The server verifies the selected deck from the profile's stored progress.

## 15.2 Challenges

```text
POST /joey/challenges
POST /joey/challenges/{challenge_id}/accept
POST /joey/challenges/{challenge_id}/decline
POST /joey/challenges/{challenge_id}/cancel
```

Creating a challenge accepts the current `profile_id` and target `profile_id`. Group membership is derived and verified on the server.

## 15.3 Matches

```text
GET  /joey/matches/current?profile_id={id}
GET  /joey/matches/{match_id}?profile_id={id}
POST /joey/matches/{match_id}/mulligan
POST /joey/matches/{match_id}/actions
POST /joey/matches/{match_id}/concede
GET  /joey/matches/{match_id}/events
```

The events path may upgrade to WebSocket transport.

An action request has this minimum shape:

```json
{
  "profile_id": "profile id",
  "expected_revision": 12,
  "action_id": "client-generated unique id",
  "action": {
    "type": "play_card",
    "hand_index": 3,
    "lane": 1
  }
}
```

Supported action types initially include:

```text
play_card
play_ingenuity
pass
activate_power
resolve_ability
cancel_ability
```

Every success response returns the caller's redacted match view, new revision and server time.

---

# 16. Live match room responsibilities

The recommended architecture uses one Cloudflare Durable Object per live match because a room provides:

- serial processing of actions
- one authoritative in-memory and durable state owner
- WebSocket fan-out to both players
- server alarms for exact turn deadlines
- simpler duplicate-action and revision handling

The existing accounts Worker remains the authenticated public entry point. It verifies sessions, account ownership and group membership before forwarding authorised requests to a match room.

D1 remains suitable for:

- lobby presence if short polling is used
- challenges and their lifecycle
- recoverable match indexes
- completed match summaries
- minimal audit and diagnostics

The authoritative match room must apply a timeout even if neither client sends another request. A client request after a deadline must first cause all overdue server transitions to be applied before the requested action is considered.

---

# 17. Security, privacy and safeguarding

The first release deliberately avoids free-form communication.

The server must enforce:

- same-group access on every lobby, challenge and match request
- profile ownership on every request
- entitlement and module access
- legal deck construction
- legal turn ownership and action shape
- hidden-information redaction
- rate limits for readiness changes and challenge creation
- at most one live match per profile
- at most one blocking pending challenge per profile

Clients must treat all player names and avatar identifiers as untrusted display values, even though current profile names are generated safely.

Operational logs should record ids, state transitions and errors, but not private hands, complete decks, access tokens or credentials.

There is no facility to challenge an arbitrary account id, profile id, school code or typed player name. Targets come only from the server-provided ready-player list.

---

# 18. Progress and result recording

No multiplayer action writes ordinary profile progress during a live match.

At completion, an optional summary may record:

```text
matchId
moduleKey
playerProfileId
opponentProfileId
result
completionReason
roundsWon
roundsLost
startedAt
completedAt
```

The full opponent deck, hidden hand history and Reserve Deck order do not need to be retained.

If profile progress later includes multiplayer statistics, the backend must update revisions safely so it cannot overwrite newer learning or collection progress from another device.

---

# 19. Error states and user-facing messages

Errors should be specific and recoverable where possible.

| Condition | User-facing response |
|---|---|
| Target stopped being ready | “That player is no longer ready.” |
| Challenge expired | “The challenge expired. You can try again.” |
| Challenge declined | “The challenge was declined.” |
| Target entered another match | “That player has joined another match.” |
| Session expired | Return safely to account sign-in without changing progress |
| Stale action | Refresh match state and explain only if the action could not be retained |
| Network interruption | “Reconnecting…” with actions disabled |
| Match cannot be recovered | Return to the Challenge Hall with no collection changes |
| Opponent concedes | Show victory by concession |
| Local timer reaches zero | Disable actions and wait for the authoritative timeout event |

Technical server errors must not expose internal state or database details.

---

# 20. Engine changes

The multiplayer implementation should preserve one rules engine rather than creating a separate simplified multiplayer copy.

Required engine work includes:

- permit both sides to be controlled through submitted actions
- separate AI decision-making from core state transitions
- support neutral side identifiers or a safe server-side side mapping
- make match setup server-controlled
- expose strict action validation
- support redacted per-side views outside the core authoritative state
- make duplicate requests harmless
- define timeout defaults for every pending ability
- preserve current Card Lab Character Challenge behaviour and tutorial tests

The AI may continue to call the same legal action functions during Character Challenges and tutorial play.

Random operations that influence a multiplayer match occur only on the server. Tests should be able to inject deterministic randomness or a fixed prepared state.

---

# 21. Testing requirements

## 21.1 Engine tests

Test at least:

- each side can legally play, pass and resolve abilities
- a voluntary pass lasts for the whole round
- a timeout pass has the same rules effect as a voluntary pass
- passed state resets next round
- the remaining player receives consecutive turns after the opponent passes
- round and match results are identical from both player views
- every pending ability has a deterministic timeout outcome
- Card Lab Character Challenges against AI still work

## 21.2 Authority and privacy tests

Test at least:

- a profile cannot act as another account's profile
- players outside the group are never listed and cannot be challenged by id
- a school code supplied by a client cannot alter membership
- opponent hand contents are absent from every response and event
- opponent Reserve Deck order is absent
- an out-of-turn action is rejected
- an illegal lane or card selection is rejected
- a stale revision cannot overwrite newer state
- a repeated `action_id` is not applied twice
- only one competing challenge can create a match

## 21.3 Timer tests

Use a controllable server clock to test:

- action accepted just before the deadline
- action rejected at or after the deadline
- timeout while no card is selected
- timeout after local selection but before submission
- timeout during an optional ability
- timeout while the opponent has already passed
- deadline restoration after reconnect
- client clock changes do not affect the server decision

## 21.4 End-to-end tests

Test with two independent browser sessions:

- two family profiles on separate devices
- two pupil seats in the same school
- two pupils in different schools
- challenge acceptance and decline
- challenge cancellation and expiry
- full three-round match
- refresh during mulligan
- refresh during a turn
- connection loss around zero seconds
- voluntary concession
- app background and foreground transitions

---

# 22. Delivery plan and ownership boundary

## Stage 1: contract

Agree this document and record any rule changes before implementation.

## Stage 2: shared engine preparation

Refactor the Joey rules engine and add deterministic two-player tests without changing the visible Card Lab Character Challenge experience.

## Stage 3: parallel implementation

Client ownership:

- Challenge Hall
- multiplayer API client
- battle-screen adaptation
- timer display
- reconnect flow
- Character Challenge and tutorial regression testing

Cloudflare ownership:

- schema migration
- lobby, presence and challenge endpoints
- group authorisation
- live match room
- server timer
- action validation and redaction
- backend tests

The Cloudflare implementation must consume the agreed engine and protocol contract. It must not invent a second set of Joey rules.

## Stage 4: integration

Connect two independent clients to one deployed test backend and verify privacy, timing and recovery.

## Stage 5: visual polish

Complete styling with existing module art first. Add new Challenge Hall or timer artwork only after the functional layout has been tested on desktop and Android-sized landscape screens.

---

# 23. Acceptance criteria

The first release is complete when all of the following are true:

1. Two distinct family profiles can see each other while ready and complete a match from separate devices.
2. Two eligible pupil seats in the same school can do the same.
3. A player outside the authenticated group cannot be discovered, challenged or joined by manipulating a request.
4. Challenges can be accepted, declined, cancelled and expired without creating duplicate matches.
5. Both players always observe the same public board, round score and final result.
6. Neither player receives the other's hidden hand or Reserve Deck order.
7. Every active turn has a server-enforced 30-second deadline.
8. Timing out causes a pass for the rest of that round.
9. A disconnected player can recover an unfinished match and see the correct remaining time or timeout result.
10. Refreshing or duplicating a request cannot play a card twice.
11. Leaving deliberately records a concession.
12. Multiplayer never changes cards, Reveal Tokens, stars or ordinary learning progress.
13. Card Lab Character Challenges and tutorial play continue to work, with no generic random-opponent route.
14. The interface works in the packaged Android app and an ordinary browser.

---

# 24. Decisions fixed for version one

Unless deliberately amended before implementation, version one uses:

- same-group matches only
- same-module matches only
- Friendly Battle rules only
- no rewards or stakes
- no chat
- 90-second renewable ready presence
- 60-second challenge expiry
- 30-second mulligan deadline
- 30-second server-authoritative turn deadline
- timeout pass for the remainder of the round
- safe default for optional abilities at timeout
- concession on deliberate Leave Match
- WebSocket live updates with authenticated HTTP recovery
- one live match per profile
