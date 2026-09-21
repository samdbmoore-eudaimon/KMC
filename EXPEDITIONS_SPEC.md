# Wallaby Maths Expeditions

> Central entry point: read `EXPEDITIONS_MASTER_BRIEF.md` first. This remains the rules-engine
> and data-architecture reference. The experience/art brief supersedes its older scenario
> catalogue pitches where they conflict.

## Complete rules and implementation specification v0.1

## 1. Purpose

Expeditions is a short, replayable tactical puzzle mode that gives collected cards a second life on a graphical hex board.

It does not replace Adventures. Adventures remain the story-led route for recovering three relics and upgrading a card. Joey remains the deeper fifteen-card deck game. Expeditions sits alongside both as a quick play mode.

The intended feeling is a modern illustrated game designed with the clarity and restraint of a late-era 2D console tactics game. Characters are high-quality painted sprites, while layered hexes, depth sorting, shadows, scenery and animation create a convincing three-dimensional board.

Every expedition must satisfy five promises:

1. The objective is understood within fifteen seconds.
2. The interesting question is not always who to attack.
3. Printed card statistics materially change available solutions.
4. A normal run lasts between three and six minutes.
5. Failure teaches enough to make an immediate replay attractive.

## 2. Relationship to the rest of the app

The collection supports three distinct play patterns.

| Mode | Core decision | Party or deck | Progression effect |
|---|---|---:|---|
| Adventures | Which route, companion and risk should I take? | Leader plus two companions | Three relics upgrade the leader |
| Joey | Which cards should I conserve and where should I play them? | Fifteen-card deck | Character challenges and collection use |
| Expeditions | Where should my characters stand and how can their numbers work together? | Three or four field characters, optional commander | Small first-clear and replay recognition |

Expeditions never awards card upgrades. The recommended economy is:

- Three stars for the first clear of each ordinary expedition
- One star for each subsequent clear of an already-cleared expedition (see
  `EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md` §8.6; this supersedes the earlier "repeat victories
  do not award stars, packs or tokens" rule)
- One Reveal token for clearing all ten expeditions in a module
- Cosmetic performance marks, rank and personal-best tracking for optional goals

This keeps the mode rewarding without making it a compulsory progression route.

## 3. Session budget

The design target is five minutes, including briefing and completion.

| Activity | Target |
|---|---:|
| Briefing and deployment | 20 seconds |
| Player decisions | 180 to 240 seconds |
| Enemy resolution | 20 to 35 seconds |
| Completion and replay choice | 15 seconds |
| Total target | 3.5 to 5.5 minutes |

No standard scenario may exceed six rounds. No enemy animation may hold input for more than 650 milliseconds. Consecutive enemy movements should overlap or resolve at increased speed. A tap during an animation completes it immediately.

## 4. Module complexity

### 4.1 Ninefold Orchard

Ninefold Orchard is guided and concrete.

- Three characters
- Four rounds
- Twenty-five to thirty-nine hexes
- One main objective
- Enemy intentions fully visible
- Whole numbers normally between 0 and 20
- One transformation rule at a time
- No hidden penalties
- A correct next move is always available without guessing
- Optional highlights may show relevant hexes and objects

Typical ideas include balancing, exact totals, ordering, equal groups, simple routes, capacity and symmetry.

### 4.2 Little Reckoning

Little Reckoning is tactical and compositional.

- Three characters
- Five rounds
- Thirty-one to forty-nine hexes
- Two linked objective conditions
- Enemy intentions appear after the first player action unless revealed by Logic
- Negative numbers, fractions, ratios, estimates and intervals may appear
- Two transformation rules may interact
- Hazards and enemies can change the puzzle state
- Several viable solutions should exist, with different efficiencies

Typical ideas include bounds, sequences, area and perimeter, networks, reverse operations, parity and constrained grouping.

### 4.3 Gifford

Gifford is intricate but still short.

- Four characters by default
- Five rounds, exceptionally six
- Thirty-seven to sixty-one hexes
- Two or three simultaneous constraints
- Some enemy intentions are concealed or conditional
- Variables, inequalities, percentages, weighted graphs and optimisation may appear
- The board can contain linked systems whose states change together
- A locally attractive move may make the final objective impossible
- Undo remains available until hidden information is revealed or an enemy phase begins

Gifford gains complexity from richer state, not longer play.

## 5. Battlefield

The battlefield uses pointy-topped axial hex coordinates. Each tile has:

- Coordinate
- Height
- Terrain
- Optional printed value or symbol
- Optional objective membership
- Optional occupying figure
- Optional movable object
- Optional state such as active, guarded, damaged or concealed

Standard terrain is clear, difficult or blocked. Difficult terrain costs two movement unless the character is Sure-footed. Blocked terrain cannot be entered or crossed. Scenario rules may add bridges, water, hazards, doors, rails and conveyors.

The camera is fixed to a three-quarter view. Small drag or keyboard movement may pan a large Gifford board, but the player cannot freely rotate the camera. A fixed view protects visual clarity and halves the required character sprite directions.

## 6. Squad construction

The player selects field characters from owned regular cards in the active module.

- Ninefold Orchard: exactly three
- Little Reckoning: exactly three
- Gifford: exactly four, with selected challenge maps allowing three or five

Every field character is defined by five printed statistics, one mathematical discipline, one role, one trait and one signature action.

Boss cards do not become field figures because several represent places, crowds or abstract forces. One owned boss card may instead occupy the Commander slot. Commander powers are single-use scenario modifiers and never add another unit to the board.

## 7. Character statistics

The five existing statistics retain their printed values.

### Arithmetic

Arithmetic governs combining, splitting, exact totals, direct numerical force and capacity calculations.

### Geometry

Geometry governs pushing, pulling, lines, range, shapes, reflection, rotation and difficult terrain.

### Logic

Logic governs prediction, initiative manipulation, hidden constraints, ordering and deduction.

### Science

Science governs state changes, stabilisation, repair, healing, propagation and environmental systems.

### Speed

Speed governs movement allowance, initiative, relays, interception and timed objectives.

Movement is `2 + floor(Speed / 4)`, capped at four hexes per Move action. Even the slowest character therefore crosses two clear hexes with one action; Speed still creates a meaningful third or fourth hex without making low-Speed favourites unusable.

Hearts are `2 + floor((Geometry + Science) / 7)`, capped at five.

Basic range is one. Scouts have range three and Reckoners have range two.

Initiative is `12 - Speed`, with lower values acting first when ordering is required.

## 8. Roles

Roles reuse the identity already established by Adventures while using clearer Expedition names.

| Internal role | Expedition name | Always-available action |
|---|---|---|
| Tank | Guardian | Guard an adjacent ally or object |
| Healer | Mender | Restore one heart or repair an object |
| Wizard | Reckoner | Change an adjacent operation or orientation |
| Melee | Mover | Push after a close action |
| Ranged | Scout | Mark a visible target for allied support |

Existing Adventure roles are preserved. Characters without an existing role are assigned by their statistical profile, then balanced so every module contains six characters of every role.

## 9. Traits

The second-highest printed statistic determines the trait. Ties use the leftmost statistic.

| Trait | Rule |
|---|---|
| Precise | The first exact result each round gains one support |
| Sure-footed | Ignore the first difficult hex entered each round |
| Foresight | Preview one additional consequence before confirming an action |
| Adaptable | Once per expedition, use the second-highest statistic for an action |
| Quick | Win tied initiative and gain one free opening step |

## 10. Turns and action points

Every active field character begins a round with two action points.

An action normally costs one point. A character may act twice consecutively or the player may alternate freely between characters. Ending the player phase discards all unspent action points.

Always-available actions are:

- Move
- Interact
- Basic strike
- Role action
- Equipped discipline action

There are no hands, draw piles, rests or card exhaustion. Actions may be displayed as illustrated cards because that presentation is tactile and readable, but they are buttons into a fixed rules system.

Once-per-expedition actions visibly turn face down after use. Once-per-round actions display the round number on their cooldown marker.

## 11. Movement

A Move action travels up to the character's movement allowance.

- Allies and enemies block ending hexes
- Ordinary characters cannot pass through enemies
- Carried objects do not reduce movement unless the scenario gives them a Heavy tag
- Difficult terrain costs two movement
- A player may inspect the full path and consequences before confirming
- The route preview shows movement cost on every traversed hex

Forced movement never triggers voluntary Interact effects. A pushed object cannot pass through a figure or another object unless an action explicitly permits it.

## 12. Objects and interaction

Movable objects may be collected when adjacent, carried and dropped on the character's hex. Collection and dropping each cost one action unless a scenario explicitly combines them.

Objects may contain:

- A numerical value
- Weight
- Capacity
- Direction
- State
- Colour or category
- Connection ports
- A protected or unstable tag

The interface always shows the result of moving an object before confirmation. For example, carrying a five-crate onto a platform changes its displayed total from two to seven.

## 13. Combat

Combat is deterministic.

`Power = relevant printed statistic + allied support + terrain bonus`

- No impact when Power is below Defence
- One impact when Power meets Defence
- Two impact when Power exceeds Defence by at least four

An adjacent ally supplies one support. Some marks, traits and objectives supply further support. The complete calculation is shown before confirmation.

Enemies normally have one to four hearts. Major scenario enemies may have five to seven, but they must not become repetitive damage sponges. Enemy defeat should remove a tactical obstacle or alter the objective state.

A character reduced to zero hearts is exhausted and removed from the board. The expedition is lost only when every field character is exhausted or the objective becomes impossible.

## 14. Enemy phase

Enemies act after the player ends the round. Their intention is selected at the start of the round, not after the player's choices.

Enemy behaviour uses four ordered questions:

1. Is there a scenario-specific object or hex to affect?
2. Can the intended action be completed now?
3. Which route reaches the target in the fewest legal moves?
4. Which tied target has the lowest player initiative?

Negative terrain is avoided when another route exists. Enemies never receive secret numerical bonuses. All state changes appear in the battle log.

Ninefold Orchard shows exact destinations and results. Little Reckoning initially shows the action and target category. Gifford may show only a conditional intention until Logic reveals it.

## 15. Disciplines and generic actions

Each discipline has three reusable actions. A character equips one for the expedition. Scenario recommendations may suggest an action but cannot require an unowned character.

### Arithmetic

- Combine: add two adjacent object values
- Split: divide one even value into two equal objects
- Exact Count: gain a bonus when the final result exactly matches the target

### Geometry

- True Shift: push or pull an object along a straight line
- Shape Field: affect a marked line, triangle, ring or symmetric set
- Measure: interact at an exact range through one low obstacle

### Logic

- Predict: reveal an enemy intention or concealed constraint
- Put in Order: swap initiative positions or ordered tiles
- Deduce: eliminate a false location or lock a correct value

### Science

- Transform: advance an object through its state cycle
- Stabilise: prevent an object, unit or tile from changing for one enemy phase
- Chain Reaction: repeat a one-point effect through connected objects

### Speed

- Dash: move again after an interaction
- Relay: pass a carried object through adjacent allies
- Interrupt: move one hex when an enemy begins its action

## 16. Objective engines

The game contains twelve reusable objective evaluators.

### Clear the board

Win when no required enemy remains. Optional enemies may be ignored.

### Capture and hold

Win by occupying a required number of marked hexes at the same round boundary.

### Exact total

Win when objects or occupied hexes in a target region total exactly the required value.

### Balance

Win when two or more regions contain equal non-zero totals, plus any specified exit condition.

### Ordered route

Win by visiting or activating values in the required sequence.

### Delivery

Win by moving required objects to destinations while respecting capacity or route rules.

### Containment

Win by occupying or blocking the required neighbouring hexes around a target.

### Repair the network

Win when active nodes connect the specified start and end according to graph rules.

### Rescue and escape

Win after setting the rescue flag and moving a surviving character to the exit.

### Protect

Win when the protected target survives through the final enemy phase.

### Efficiency

Win when the base condition is met within a maximum cost, distance, time or resource value.

### Constraint grid

Win when every declared sum, inequality, parity or uniqueness constraint is simultaneously true.

## 17. Scenario construction

A scenario is data, not custom screen logic. It specifies:

- Identifier, module, level and title
- Board cells and terrain
- Deployment hexes
- Objects and values
- Enemy groups and behaviour decks
- Objective family and parameters
- Turn limit
- Explanatory briefing
- Optional performance marks
- Seeded variation rules

Generated variants must be passed through a solver before becoming playable. A candidate is rejected when:

- No solution exists
- The shortest solution exceeds the turn budget
- The solution depends on an unavailable discipline
- An enemy can make the objective permanently impossible before the player can respond
- The opening move has only one viable answer without this being explicitly taught
- The target calculation exceeds the module's numerical range

## 18. Authored scenario catalogue

### Ninefold Orchard

| Level | Scenario | Family | Core problem |
|---:|---|---|---|
| 1 | The Unequal Crossing | Balance | Split 2, 3, 4 and 5 into two totals of seven, then reach the exit |
| 2 | The Counting Orchard | Exact total | Occupy or deliver values totalling twelve |
| 3 | Nine Across the Bridge | Delivery | Deliver three loads without exceeding bridge capacity nine |
| 4 | The Widdershins Path | Ordered route | Visit even stones in increasing order while one is reversed |
| 5 | The Maybe-Flock Roost | Capture | Hold three whistle posts simultaneously |
| 6 | Ten Honest Bundles | Exact total | Make two separate groups worth exactly ten |
| 7 | Count the Murder | Containment | Close a nine-hex ring around a moving flock |
| 8 | The Hollow Bough | Protect | Keep the memorial hex empty and undamaged |
| 9 | Every Basket One Short | Constraint grid | Correct three linked basket tallies |
| 10 | The First Whistle | Network | Reconnect nine branches to the founding stone |

### Little Reckoning

| Level | Scenario | Family | Core problem |
|---:|---|---|---|
| 1 | The Smudged Stones | Constraint grid | Restore operators so every path evaluates to twenty-four |
| 2 | Roughly at the Market | Efficiency | Meet value and weight requirements using estimates and bounds |
| 3 | The Backwards Courtyard | Ordered route | Complete a reversed sequence while moves are undone |
| 4 | Lanterns in the Forgetting Fog | Network | Connect four lanterns with the shortest network |
| 5 | General Guesswork's Lines | Combat | Attack through valid estimation intervals |
| 6 | A Shape Coming Apart | Containment | Preserve equal perimeter while sealing unstable edges |
| 7 | The Countless Crossing | Efficiency | Visit every required group exactly once |
| 8 | Madam Nought's House | Rescue | Reduce linked expressions to zero and release the courier |
| 9 | The Almost Mirror | Constraint grid | Make two halves congruent despite imperfect copying |
| 10 | Counted In | Capture | Assign every fragment to one valid partition region |

### Gifford

| Level | Scenario | Family | Core problem |
|---:|---|---|---|
| 1 | The Examination Clock | Efficiency | Schedule tasks through three stations before a deadline |
| 2 | Cross's Pursuit Network | Ordered route | Find a minimum-cost route while edge costs react |
| 3 | The Sealed Archive | Constraint grid | Satisfy row, column and parity constraints |
| 4 | Vex's Demonstration | Exact total | Build equivalent expressions from disjoint terms |
| 5 | Bramwell's Compromise | Balance | Balance flow, pressure and cost without a perfect optimum |
| 6 | Vale's Filing System | Network | Build a degree-limited spanning network under disruption |
| 7 | Whistle's Price | Efficiency | Satisfy percentage, ratio and capacity constraints |
| 8 | Scarrow's Ring | Combat | Win combat while controlling the median-valued hex |
| 9 | The Chancellor's Ledger | Constraint grid | Deduce hidden entries from inequalities and statements |
| 10 | The Engine's Answer | Efficiency | Minimise maximum delay through a changing weighted graph |

## 19. The Unequal Crossing vertical slice

The board contains thirty-seven traversable hexes over an orchard ravine. Two brass weighing platforms each contain two load hexes. Four crates have weights 2, 3, 4 and 5. The only equal non-zero partition using every crate is 2 + 5 and 3 + 4.

Pip, Bramble and Nine deploy on the west side. They are lent for this opening lesson if the player has not collected them. Two Hookmoles begin near the east side. They visibly study the loads for two rounds before advancing. A Hookmole then targets the highest-valued unguarded crate, walks towards it and drags it to its burrow when adjacent.

The party wins when:

1. Both platforms contain seven weight.
2. At least one surviving hero occupies the exit arch.
3. This is achieved by the end of round four.

The scenario teaches Move, collect, drop, Guard, enemy intent and visible totals. It does not require combat. Possible tactical answers include guarding the five-crate, intercepting a Hookmole, moving the high-value crate first or defeating one enemy.

The reference pass completes in round four using nineteen player actions: Nine carries 5 west, Pip places 2 beside it, Bramble carries 3 east, Pip follows with 4 and Nine takes the outer route to the tally arch. This exact pass is executable in `scripts/simulate_unequal_crossing.mjs` and is locked into the engine test suite so later movement or map changes cannot quietly make the tutorial impossible.

## 20. Visual specification

Characters use modern painted sprite sheets, not pixel art.

Each regular character requires:

- Front three-quarter idle pose
- Rear three-quarter idle pose
- Action pose
- Hurt or startled pose
- Forty-eight-pixel and ninety-six-pixel portrait crops
- Ground shadow mask

The front and rear poses may be mirrored to create four facings. Movement uses translation, a restrained vertical hop, squash and shadow scaling rather than a full walk cycle. Action poses use anticipation, a short movement arc, impact particles and recovery.

Hex tiles have top, front-left and front-right surfaces. Depth is controlled by axial coordinate plus elevation. Characters and props sort against the same depth key.

The renderer should use PixiJS or a similarly lightweight sprite layer, with React responsible for menus, action controls, calculations and accessibility. A DOM fallback may be retained for tests and low-capability devices.

## 21. Interface rules

The board occupies at least seventy per cent of the landscape play area.

- Top: round and initiative
- Left: compact party portraits, hearts and action points
- Right: objective and selected-target information
- Bottom: contextual actions, preview, undo and confirm
- Board: movement, targeting and mathematical relationships

Only legal destinations are highlighted. Selecting an action must display its governing statistic, support, resistance and final result before confirmation.

Undo is available until the player reveals hidden information, resolves random variation or ends the round.

Touch targets remain at least forty-four device pixels. The battlefield must remain playable at 360 CSS pixels wide in landscape orientation.

## 22. Accessibility

- Every tile has an accessible coordinate and state label
- Colour is paired with shape, icon or text
- Movement and targeting do not depend on drag gestures
- Animation can be reduced
- Enemy intentions have text equivalents
- Calculations remain visible in the battle log
- A board summary lists objective totals and critical state changes

## 23. Rewards and records

The first playable slice stores:

```js
{
  completed: { [scenarioId]: true },
  bestTurns: { [scenarioId]: number }
}
```

This deliberately records completion rather than a repeat-clear count. A first clear awards three stars and a replay awards no currency. When the full sets are implemented, add `marks` and `moduleSetRewarded` fields without changing the meaning of the two existing fields.

Performance marks may recognise:

- No character exhausted
- No enemy defeated
- Exact turn target
- Minimum movement
- Optional mathematical constraint

Marks are decorative records. They do not gate lessons, cards, bosses, Adventures or other Expeditions.

## 24. Validation and balancing

Automated checks must verify:

- Ninety regular cards have a complete profile
- Thirty boss cards have a commander power
- Every module has six characters in each discipline
- Every module has six characters in each role
- Every authored scenario references valid enemies and an implemented objective family
- All generated numerical scenarios have at least one solution
- Estimated standard duration stays below the module hard limit
- State transitions do not mutate earlier snapshots
- Enemy behaviour is deterministic for a fixed state

The first balancing target is a seventy to eighty-five per cent first-attempt success rate in Ninefold Orchard, sixty to seventy-five per cent in Little Reckoning and fifty to sixty-five per cent in Gifford. Failure rates should come from strategic errors, not unreadable rules or concealed arithmetic.

## 25. Source files

- `expeditions/expedition-data.js`: tiers, actions, scenarios, readiness guidance and enemies
- `expeditions/expedition-schema.js`: versioned JSDoc contracts and build-time content validation
- `expeditions/expedition-readiness.js`: advisory collection-power assessment (never a hard gate)
- `expeditions/expedition-roster.js`: all character and boss assignments
- `expeditions/expedition-engine.js`: hex logic, actions, enemy resolution, objectives, the
  command dispatcher and failure-explanation/timing helpers
- `expeditions/expedition-commander.js`: Commander slot and the implemented Commander powers
- `expeditions/expedition-random.js`: seeded PRNG and seed derivation (Stage G1)
- `expeditions/expedition-kernels.js`: mathematical kernels — equal partition, operator
  restoration, scheduling (Stage G2/G4)
- `expeditions/unequal-crossing.js`: first playable scenario configuration (Ninefold Orchard 1)
- `expeditions/smudged-stones.js`: second playable scenario configuration (Little Reckoning 1)
- `expeditions/examination-clock.js`: third playable scenario configuration (Gifford 1)
- `expeditions/expedition-catalogue.js`: registry of which scenarios are wired up and playable
- `expeditions/expedition-9fo-art.js`: Ninefold Orchard's art manifest, imported as inlined
  base64 WebP data URIs (auto-generated from `assets/expeditions/production/9fo/manifest.json`)
- `expeditions/expedition-ui-shared.jsx`: styling/layout helpers shared by the two screens below
- `expeditions/ExpeditionScreen.jsx`: the pre-game flow — map, briefing, squad selection —
  for whichever scenario the active module has playable
- `expeditions/ExpeditionBoard.jsx`: the tactical board and result screen, generalised to run
  any catalogued scenario; dispatches through applyExpeditionCommand and renders Ninefold
  Orchard's art manifest with a graceful stand-in fallback for the other two modules
- `expeditions/*.test.js`: unit, readiness, action/role/trait, commander, generation and
  per-scenario simulation checks
- `scripts/validate_expeditions.mjs`: catalogue-wide validation report
- `scripts/simulate_unequal_crossing.mjs`, `scripts/simulate_smudged_stones.mjs`,
  `scripts/simulate_examination_clock.mjs`: executable reference playthroughs
- `EXPEDITIONS_ROSTER.md`: readable assignment for all ninety cards and thirty commanders
- `EXPEDITIONS_ART_PIPELINE.md`: production tooling, asset budget and quality gates
- `EXPEDITIONS_ART_HANDOVER.md`: the Ninefold Orchard wiring-candidate art package and manifest
- `EXPEDITIONS_MOCKUPS.md`: three full-screen concepts and a sprite sheet

## 26. Implementation sequence

1. Complete pure engine and automated validation: complete.
2. Build the Unequal Crossing board with portrait stand-ins: complete.
3. Add touch selection, movement preview, object collection and dropping: complete.
4. Add platform totals, Hookmole intentions, Guard and deterministic combat: complete.
5. Add completion, replay and first-clear storage: complete. Of §23's performance marks, four
   of the five categories are now computed (`computeExpeditionMarks` in expedition-engine.js —
   no exhaustion, no enemy defeated, exact turn target, minimum movement, against each
   scenario's own verified reference trace as par) and shown on the result overlay; the fifth,
   an optional mathematical constraint, is scenario-specific and not yet built.
6. Establish final Pip, Bramble, Nine, Hookmole, crate and terrain direction: complete; transparent extraction remains.
7. Test desktop and Android landscape performance: pending device pass.
8. Implement one additional scenario family per module: complete for Little Reckoning
   (The Smudged Stones) and Gifford (The Examination Clock, then a second, The Sealed
   Archive — a constraintGrid puzzle using Arithmetic's Combine); Ninefold Orchard still has
   only The Unequal Crossing. All four are wired into the UI (ExpeditionScreen.jsx +
   ExpeditionBoard.jsx), which now lets a module offer more than one playable scenario and
   choose between them before squad selection. Ninefold Orchard also renders its
   wiring-candidate art manifest; Little Reckoning and Gifford still use the emoji/portrait
   stand-ins.
9. Add procedural scenario generation and solver validation: seeded PRNG and three
   mathematical kernels (equal partition, operator restoration, scheduling) complete;
   board-grammar generation and adversarial enemy-schedule validation still need more proof
   maps to generate against.
10. Expand from the authored thirty-scenario catalogue to thirty playable board configurations: six of thirty now exist (see source files above); twenty-four remain. A
   fifth (The Counting Orchard) was attempted and reverted after its reference trace hit
   real path-congestion issues — see EXPEDITIONS_CLAUDE_HANDOVER.md's "Not implemented".
