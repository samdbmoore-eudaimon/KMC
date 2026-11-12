# Expeditions redesign: evidence and product workshop

Date: 30 September 2026

Status: investigation and proposals for discussion with Sam. This is not an approved replacement specification and does not authorise implementation. Existing private access gating remains in force. No gameplay or art files were changed during this investigation.

## 1. Requested outcome

Sam wants a game between Gloomhaven and Tacticus, adapted to the age group and integrated with meaningful maths. Combat, complex puzzles, procedural maps and consequential card statistics must support team building and progression. The current Ninefold Orchard experience fails that expectation.

The deliverable is an agreed, detailed design and implementation specification that smaller development models can execute across Claude and ChatGPT. After agreement, Codex may act independently as product owner and scrum master within that specification. Product choices below remain proposals until agreed.

## 2. Investigation scope and limits

Read the master brief first, then the experience brief, card/combat contract, Ninefold route and recent engineering handover. Inspected the live catalogue, all ten Orchard scenario configurations, generation entry points, card conversion, readiness calculation, board command handling, action controls and render-test approach. Executed all ten existing Orchard reference simulation scripts successfully.

These results are engine executions and source inspection, not a fresh child playtest or a complete browser playthrough. A passing engine trace does not establish that a child can perform its actions through the UI. The distinction is crucial here. The working tree already contains extensive unrelated and Expedition changes; this review describes the current files, not a clean historical release or a verified installed APK.

## 3. Findings

### A. Engine abilities are missing from the playable interface

`expeditions/ExpeditionBoard.jsx`, especially `tileClick` and `NfoActionBar`, exposes movement, carrying, guarding, striking, basic rotation and visiting stones. It does not issue `USE_ACTION` commands for discipline abilities or `VISIBLE_CHECK` commands. The only exposed role action is Reframe.

The engine dispatcher supports those commands, but reference solutions call engine functions directly for Combine, Shift, Chain Reaction, Restore and Force Rotate. Examples include the standard solutions for Hedgejaw Maze, Rootfire Relay, Hollow Bough, Orchard Lockdown and First Whistle. Their successful engine tests therefore do not prove a playable UI route. This finding does not prove every alternative route is impossible; it proves the intended tested routes are unavailable through the inspected controls.

Basic strike immediately resolves on tapping an enemy, including in Move mode. There is no intermediate damage-and-consequence preview in that handler. The rotation interaction toggles orientation between 0 and 1 rather than offering all six orientations supported by the engine.

### B. Several scenarios finish before their defining systems matter

The following results were reproduced by running `scripts/simulate_<scenario>.mjs`. Action counts are the engine's player-action counter, excluding end-round commands. These are reference traces, not claims of globally optimal solutions.

| Map | Reference result | Consequence |
|---|---|---|
| Unequal Crossing | Round 4, 18 actions | Most activity is carrying four loads; reference totals are 20 per side |
| Cider Run | Round 2, 5 actions | One movement hex; Scruffcrow only watches before the win |
| Nine Across the Turning Bridge | Round 3, 12 actions | Wind closes a section after the loads have passed it |
| Hedgejaw Maze | Round 3, 8 actions | A real closure matters, but the solution uses Shift, absent from board controls |
| Maybe-Flock Roost | Round 2, 7 actions | The flock has not attacked; the numerical condition starts satisfied |
| Rootfire Relay | Round 1, 2 actions | Shift then Chain Reaction wins before Strawling acts |
| Murder at Moonfall | Round 1, 3 actions | Three moves close the ring before Crowbreaker acts |
| Hollow Bough Awakens | Round 5, 3 actions | Much of the run is ending rounds; solution uses Restore, absent from controls |
| Orchard Lockdown | Round 1, 1 action | One Combine wins; two of three gates already satisfy their conditions |
| First Whistle | Round 2, 9 actions | Open two branches and strike; First Root dies before its first active enemy turn |

The Hollow Bough report says round 5 because the fourth enemy phase advances the counter. It is not evidence of five active combat rounds.

### C. Some advertised maths is decorative

- Turning Bridge's loads are 2, 3 and 4; their combined weight is exactly the stated capacity of 9. No combination can exceed that raw capacity. Open/closed vanes matter, numerical load planning does not.
- Maybe-Flock's fixed vanes already sum to 9. The player does not solve or change the sum.
- Orchard Lockdown's parity and use-1-to-3-once gates begin solved. Its remaining calculation is repaired by one addition.
- Rootfire's objective checks sum and parity, not whether the entire advertised root chain is connected. Connectivity restricts the Chain Reaction action, which is a different requirement.
- Hedgejaw asks for ascending 3, 5, 9. The positional constraint provides more challenge than the mathematical ordering.

Small numbers can support deep reasoning. The problem is the lack of interacting constraints, deductions and consequential alternatives, not simply the size of the numbers.

The older route and tier data explicitly target approximately four minutes, one objective layer and numbers 0–20 for Orchard. Current generated values already vary beyond some older examples, so increasing a range alone would not address the problem.

### D. Procedural values have been mistaken for procedural battlefields

Only Unequal Crossing and Cider Run receive fresh seeds from the playable Orchard catalogue. The other eight constructors use fixed configurations.

Unequal Crossing varies values and crate positions within a fixed terrain layout. Cider Run varies values on fixed spokes; its own source explicitly states that geometry does not vary. Many maps use the same clear radius-three hex board with object placement and scenery supplying most of their distinction.

Seed helpers exist, but the two live seeded entry points use `Date.now()`. The catalogue records attempt/seed persistence as unwired. Best-performance targets remain fixed reference values despite generated layouts varying in difficulty.

### E. Collection and stat consequences are weak or obscured

`WallabyMaths.jsx` passes the module's `CARDS` into the Expedition screen. `ExpeditionBriefing` filters its roster by membership in that full card table, not ownership in `progress.cards`. Unowned cards are labelled Training card and remain selectable. This may be useful for private testing, but it defeats collection-driven progression if retained as normal play.

The stat conversion has large plateaus:

- Move is `min(4, 2 + floor(Speed / 4))`.
- Hearts is `min(5, 2 + floor((Geometry + Science) / 7))`.
- Basic strike yields only 0, 1 or 2 impact, with a four-point gap between damage thresholds.

These rules do use stats. However, many stat increases produce no visible change to an action, particularly against low-defence enemies. Abilities are largely selected by discipline or role; many of the interesting abilities are inaccessible through the UI. Enemies often do not act in a successful run. Rarity recommendations cannot compensate for those structural problems.

### F. Guidance describes intentions rather than teaching interactions

Briefings describe concepts such as a root relay, matching vanes or ledger gates without consistently showing the exact action required. They sometimes promise a challenge that is already solved or avoided by the reference trace.

There are concrete rule/copy disagreements. Nearly's text says highest-value target, while its implementation has been documented as selecting by proximity. First Root's text promises rewiring, but its scenario declares no bespoke rewiring behaviour. Its network gate controls vulnerability; its active AI uses the generic hunt-and-strike path.

The child also has to reconcile role names, disciplines, five printed stats, abstract pressure lanes, traits and signature names. The interface does not expose a matching set of actions. Better prose alone cannot fix missing interactions.

### G. Completion criteria rewarded implementation rather than experience

`scripts/test_expedition_screen.cjs` renders components to HTML and checks strings. It does not execute the reference solutions through controls. Several scenario source comments explicitly celebrate a short solution or preserve an existing trace when adding a new system.

Solvability tests are necessary, but these can pass when the enemy never acts, the maths is pre-solved, two heroes are redundant or the required ability cannot be selected on screen. Existing tests should remain useful evidence of old behaviour, not become constraints that force a redesigned game to preserve it.

## 4. Recommended product direction, awaiting agreement

Make Expeditions a small tactical campaign with mathematical problem solving inside it. Use character identity, ability timing, positioning and team combinations as the core decisions. Maths should change what the player can achieve on the battlefield.

Confirmed by Sam during this review:

- Normal missions take around five minutes once the controls are familiar. This supersedes the earlier 8–12-minute decision.
- Maths combines board puzzles with occasional maths challenges that power tactical abilities.
- Each hero has a small ability hand, rather than a fixed skill bar with cooldowns.
- Puzzle variety is essential, including Sudoku-like deduction, rotating hexes and other familiar mathematical puzzle structures.
- Every printed stat and each card's role must have real gameplay consequences.

Other recommended starting assumptions:

- Save after every committed action, with a shorter introductory mission. Use compact encounters and consequential rounds to fit the agreed five minutes; do not pad duration with travel or enemy health. Five minutes is an experience target, not a real-time countdown that punishes slower reading or thinking.
- Start with three heroes for Orchard. Expand only if playtesting shows that an extra hero adds value without excessive management.
- Deterministic combat with fully visible enemy intentions in Orchard. Tactical depth comes from choices and consequences rather than hidden hit rolls.
- Distinct attacks, support abilities and movement abilities with limited resources or cooldowns. Repeating Attack should rarely be the strongest whole-team plan.
- Real terrain: chokepoints, blocked sightlines, safe and exposed approaches, hazardous ground and useful elevations or cover. Each terrain rule must justify its cognitive cost.
- Maths difficulty and tactical difficulty are separate settings. A strong mathematician should not need to complete baby arithmetic to learn movement controls.
- Use collected cards for campaign teams. Restrict loans to a clearly labelled tutorial or separate testing mode. Decide explicitly how existing Adventure upgrades contribute.
- Procedurally assemble meaningful encounter layouts within authored scenario structures. Generate route choices and enemy/objective relationships as well as numbers.
- Teach controls through short contextual demonstrations. Present challenge through the board, not long rule paragraphs.

Useful reference directions are Cephalofair's Gloomhaven resources and its separate Jaws of the Lion tutorial resources, and Tacticus's stated emphasis on heroes, abilities and terrain. These are inspiration rather than a requirement to reproduce either ruleset:

- https://cephalofair.com/pages/gloomhaven
- https://cephalofair.com/pages/gloomhaven-jaws-of-the-lion-tutorial-videos/defaultsite
- https://tacticusgame.com/guidepost/definitive-turn-based-tactics-game/

### Ability hand: agreed direction, proposed detailed rules

Candidate: three heroes, each with three visible ability cards. Each hero gets movement plus one substantial action per round. An ability offers a combat use or a mechanism/support use; choose one, then discard the card for this encounter. The player chooses hero order freely, then resolves the clearly forecast enemy phase. A simple basic action remains available after the hand is spent, so running out never produces an unexplained dead end. No random draw is proposed for the initial design.

Target three to four consequential rounds as an initial pacing hypothesis, subject to timed playtests. A short encounter with nine meaningful ability uses can still offer substantial choices. Do not require all nine uses and do not inflate turn count just to meet a duration target. Recovery mechanics and initiative planning are deferred proposals, not implied requirements of choosing an ability hand.

Before approving these detailed rules, work through at least two rounds on paper: show each available ability, enemy response, maths choice and forgone alternative. The ability-hand direction itself is already agreed.

### Stats and roles: proposed division of responsibilities

A stat determines the strength or reach of a named effect. A role determines the kinds of actions in the hand and the hero's battlefield job. Neither should be a decorative label. A player with a high-Logic card still solves the puzzle personally; the character does not automatically supply the answer.

| Stat | Proposed dependable effect | Proposed mechanism use |
|---|---|---|
| Arithmetic | Strength of direct force effects, with a visible numerical attack or barrier value | Amount of power that can be allocated, transferred or transformed in a numerical mechanism |
| Geometry | Strength of shields and spatial control effects | Reach or extent of rotation, displacement and connected-tile effects |
| Logic | Potency of disruption against enemy intent or defences | Capacity to lock verified placements against corruption or protect linked solved conditions |
| Science | Strength of healing, repair and persistent effects | Capacity to stabilise hazards, restore mechanisms or sustain powered connections |
| Speed | Movement budget and reach of movement abilities | Ability to reach, relay or interact across separated locations efficiently |

This is a functional proposal, not a formula table. Balance against the actual roster before assigning coefficients. Each stat needs a visible contribution in ordinary play, not only one rare scenario check. Avoid making Arithmetic the sole useful offensive stat: roles should give Geometry, Logic, Science and Speed clear ways to contribute to winning combat through protection, control, effects and positioning.

Stat and role combinations should change the same broad job. A Geometry Guardian might block an approach with a shaped barrier; a Science Guardian might maintain protection over successive enemy actions. A high-Speed Mender can reach separated allies; a high-Science Mender restores more when it arrives. Exact abilities must be individually specified and tested against real cards.

Proposed role jobs:

- Guardian: intercept, protect and hold important ground.
- Mender: repair, heal and keep a threatened mechanism working.
- Reckoner: manipulate puzzle state and battlefield systems.
- Mover: displace enemies, break formations and exploit close combat.
- Scout: reach objectives, mark priority targets and attack at range.

No essential puzzle interaction should be hard-locked to a single role. Basic interactions remain possible for any team; specialists offer better action efficiency or alternative tactical routes. Owning the correct role must not replace mathematical reasoning.

For every stat, the final balance packet must show a real weaker/stronger card comparison and a situation where the difference changes a worthwhile decision. For every role, it must show a distinctive contribution and a viable team without that role. It need not force all five stats to be equally important in every individual mission.

### Puzzle portfolio: proposed families

Each five-minute mission centres on one compact puzzle family. Variation comes from different constraints, layouts and tactical situations across missions. Do not put every puzzle family into one encounter.

| Family | Player reasoning | Battlefield consequence |
|---|---|---|
| Sudoku-like number gardens | Fill a small grid using row, column and region exclusions; later add sum cages | Completing particular groups powers different gates or protection zones |
| Rotating hex networks | Rotate tracks or ports to connect sources and destinations while avoiding unwanted branches | Redirect water, light or power to change movement routes or enemy vulnerability |
| Number cages and cross-sums | Find values satisfying overlapping totals and non-repeat rules | Allocate power between an attack mechanism and a protective mechanism |
| Spatial packing and symmetry | Fit pieces, complete reflections or transform shapes under explicit restrictions | Form cover, repair a crossing or close a dangerous route |
| Operator routes | Choose a path and operation order that reaches a target under stated constraints | Route a charge to one of several useful effects |
| Bridge and connection puzzles | Satisfy node connection counts and connectivity restrictions | Build a traversable network or cut off reinforcement access |

The player may be deducing a unique mathematical answer while still having several tactical ways to create time and access to complete it. Do not force multiple valid answers into a Sudoku-like puzzle merely to claim replayability. Other families can deliberately support multiple mathematical solutions, provided the victory evaluator accepts all valid ones.

Generation must preserve each family's exact rules. Deduction puzzles need validated solutions and an intended reasoning path, not just a satisfiable final grid. Rotation puzzles need genuine connectivity validation. Tactical layouts need distinct route/cover/objective relationships, rather than a cosmetic rotation of one board.

Before approval, select one deduction mission and one spatial mechanism mission as fully worked design examples. They should demonstrate shared combat rules with genuinely different mathematical play.

### Maths as a source of tactical choices

Agreed direction: combine substantial board puzzles with occasional challenges that power tactical abilities. Proposed implementation: make those challenges optional ways to strengthen or modify an ability, without interrupting every ordinary attack with a question. Optionality and exact rewards are not yet agreed.

For example, a player might choose a weaker immediate action, spend time solving a problem to power a stronger action or use a teammate's control ability to create a better opportunity. Difficulty must come from a stated curriculum and reasoning steps, with hints and explanations. Exact rewards, mistake handling and retry rules remain to be designed.

Potential Orchard puzzle families include sharing and remainders, fraction equivalence, constrained totals, spatial transformations, route optimisation and deduction from overlapping clues. These are proposals for the 9–10-year-old audience, not an approved curriculum sequence.

### Concrete mission concept for discussion: reopen the storm mill

The team must restart two water channels and stop a guardian from destroying the mill. A short exposed route reaches the guardian; a longer route reaches the controls. Enemies contest the useful positions from the beginning.

One control puzzle allocates 24 units between two channels: one must receive twice the other, so the intended allocation is 8 and 16. A subsequent announced blockage changes the available flow and requires replanning. This numerical example is illustrative; the final puzzle needs several linked deductions and a fully specified board.

The tactical choice is whether to hold a chokepoint while solving, spend a limited ability to disable the guardian briefly or reroute water to create a safer approach. A control specialist, durable defender and mobile attacker should produce a different plan from a damage-heavy squad.

A stronger card should make a concrete difference that the player sees before embarking: survive an additional attack, reach a crucial control in one movement, affect an extra target or sustain a protection effect longer. Those examples must become numerical comparisons using actual collection cards, not invented balance assumptions.

This is a discussion concept, not yet a solvable mission specification. Geometry, abilities, enemy values, alternate solutions and timing must be worked out before development.

## 5. What the agreed specification must contain

The final package should have one indexed source of truth with versioned supporting contracts, not multiple equally authoritative narratives.

1. Product contract: age bands, mission duration, session flow, campaign structure, progression, loss/retry behaviour and release boundaries.
2. Complete round rules: movement, actions, ability resources, targeting, sightlines, terrain, status duration, enemy order, ties, victory timing, undo and save/resume.
3. Card conversion and balance: formulas for all five stats, roles, individual abilities, upgrades, ownership and loans. Include real roster examples and stronger/weaker comparisons.
4. Maths contract: module curriculum, challenge bands, puzzle grammar, answer validation, equivalent answers, hints, errors and how solving affects the board.
5. Enemy contract: distinct roles, exact intent selection, target tie-breaks, visible forecasts and reactions when the board changes.
6. Procedural contract: seed/version format, authored encounter templates, topology variation, maths generation, placement, rejection conditions, fallback and reproducible replay.
7. UI contract: every action from selection through preview, confirmation, animation and explanation. Specify touch, keyboard, text equivalents and small-screen behaviour.
8. Scenario packets: exact maps and entities for a reference seed, turn-by-turn valid solutions, alternate tactics, maths deductions, enemy responses and underpowered-team evidence.
9. Persistence and integration: state shape, schema versioning, migration, idempotent rewards, interruptions and compatibility with existing profile progress.
10. Acceptance plan: engine tests, UI-executed scenario traces, seed diversity, performance, accessibility and observed child playtests.
11. Delivery backlog: dependencies, tightly bounded tasks, owning files, acceptance commands, required evidence and escalation rules.

No development agent should be asked to invent an ability formula, choose what an unclear puzzle means or decide whether a mechanically empty scenario is sufficiently fun.

## 6. Development and acceptance approach after agreement

First build one complete Orchard mission containing actual combat, a linked puzzle, at least two viable squad plans and meaningful procedural variants. Review it before multiplying content across thirty scenarios. Preserve existing useful art and engine infrastructure where they support the agreed rules.

Proposed acceptance gates:

- The reference solution can be performed through the real UI. Every required ability has a working selection and preview path.
- The mission's named puzzle requires player reasoning. Required subproblems do not begin solved unless explicitly part of teaching or a deliberate trade-off.
- Every advertised enemy or hazard affects a viable line of play. A clever avoidance plan is welcome; universal irrelevance is not.
- At least two materially different plans are demonstrated, with a real resource, exposure or timing trade-off. Two cosmetically different paths do not qualify.
- Two different squad compositions change those plans. At least one real card upgrade changes a useful outcome, with numerical evidence.
- Generated layouts alter tactical decisions. Seed testing records structural diversity, not just differing hashes or numerical labels.
- Generation is certified against an explicit reference capability band. It must not silently weaken enemies or reshape challenges to make every selected squad win.
- Hints progress from a relevant observation to a useful deduction to a worked example. They do not simply announce an opaque action chain.
- A child can identify the objective, next threat and reason an action is unavailable without an adult translating the interface.
- A child playtest confirms engagement and understandable consequences. Automated success is not a substitute for this gate.

Exact quantitative thresholds and sample sizes belong in the agreed spec; these are proposed principles.

### Coordination across Claude and ChatGPT

After agreement, use a shared on-disk backlog and decision log. Each task has a stable ID, approved spec version, dependencies, allowed files, explicit exclusions, data/API contracts, examples, acceptance checks and handover template. Assign one writer per shared file. Cross-provider transfers include the packet and evidence, not a request to reconstruct decisions from chat history.

Codex's product-owner role should resolve routine implementation questions within the agreed design, review evidence and reject incomplete work. Changes to learning goals, core turn structure, progression, mission length or player-visible scope return to Sam. Existing Claude/Codex file ownership must be reconciled explicitly when the new delivery plan is agreed.

## 7. Decisions for the next discussion

Normal mission duration (around five minutes), mixed board/ability maths, hero ability hands, varied puzzle families and meaningful stat/role consequences are agreed. Next work through the proposed hand rules and stat/role interactions with real cards and concrete turns, then team progression and fully specified deduction/spatial mission examples. Detailed campaign authoring follows those decisions.

Outstanding investigation for the final specification includes a numerical roster balance study, current-browser interaction traces, a representative device performance baseline and curriculum mapping using the existing lesson content. Do not call this review a completed design specification.

## 8. First worked demonstration

`EXPEDITIONS_DEMO_STORM_MILL.md` contains The Mill That Would Not Turn: a rotating-hex encounter using Cornix, Kernel and Beeswax's real card statistics. It specifies proposed hands, a complete reference board, enemy intentions, a cautious three-round playthrough and a faster two-round playthrough. A separate small simulator checks the two paths and an unboosted recovery. The inline step-through illustrates those verified paths. These are design candidates for review, not approved changes to the game. Five-minute pacing still requires player timing; a contrasting deduction-puzzle encounter remains to be designed.

Sam's review: still too simple; map too small. Treat this demonstration as rejected for depth and spatial scale, not as an accepted foundation to implement.

## 9. Replacement demonstration: 1 October 2026

`EXPEDITIONS_DEMO_FOUR_LOCKS.md` is the current review candidate. The Orchard of Four Locks uses 82 total hexes, 72 walkable with the bridge open, three river crossings, a uniquely solvable linked-sum Sudoku and four circuit outputs, of which only two can run. A four-round bridge-and-shelter plan preserves all orchard integrity; a three-round roots-and-storm plan sacrifices six integrity and leaves Kernel at the controls. Both traces are checked against the same rules. The inline view includes separate puzzle practice.

The proposed 70–100 playable-hex scale is an exploration target following the small-map feedback, not an approved universal minimum for every mission. Five minutes remains a familiar-player target; no real-time countdown and no unmeasured claim of successful pacing. Mobile enemies, more terrain and actual free play still require further development and review. The current demonstration includes one moving captain and a mobile sapper, but the hand and enemy system are not a complete tactical prototype.

## 10. Asset-backed mission portfolio

Sam received Four Locks positively and requested an audit of existing assets, then ten different procedural expeditions if feasible, otherwise five strong ones. `EXPEDITIONS_ASSET_AUDIT_2026_10_01.md` inventories the Expedition asset tree. `EXPEDITIONS_TEN_MISSION_PROPOSAL.md` defines ten distinct Orchard families and proposes delivering five core families first, with five difficulty tiers per family. Existing art can support all ten prototypes; gameplay, procedural certification and art acceptance remain outstanding.

Sam chose a fixed number of stars for each prize credit. Three stars per first mission/tier clear is the current balance proposal. The exact amount and replay/module-set reward rules are not yet agreed. The portfolio is the next review document, not the full implementation spec.

Sam subsequently clarified that rotation should turn numbers/operators to complete equations, higher difficulties must need better cards, every stat must count and feedback must explain objectives and in-game outcomes. `EXPEDITIONS_STATS_ROTATION_AND_FEEDBACK.md` records the stronger requirements, a coupled-equation fixture, an all-stat contribution contract, a simultaneous three-job Epic capability fixture and player-facing explanation examples. The Turning Ravine proposal now centres on equation rotation. Lower-band infeasibility evidence replaces the weaker criterion that stronger cards merely offer more convenient plans.

## 11. Fifteen-type minimum and map navigation

Sam now requires at least fifteen different mathematical puzzle types, with five in each module. Thirty is a stretch target; the core five per module come first. Shared concepts can become harder across modules but do not inflate the unique-type count. `EXPEDITIONS_PUZZLE_PORTFOLIO_AND_MAP_VIEW.md` is the current proposed portfolio, with fifteen core types, fifteen reserve candidates, curriculum links and a pannable/zoomable viewport contract. The earlier ten Orchard families remain useful as a five-core/five-reserve pool. Core priority now spans all three modules.

## 12. Orchard-first full implementation handoff

Sam subsequently requested Orchard-first full specification/code instructions, with all artwork owned by Codex and coding by Claude, plus shared scrum/agent discussion records. The four-file v1.0 package is now indexed in the master brief: implementation spec, procedural generation spec, delivery board and art request. It resolves earlier incompatible numeric rules and records exact six-sector on-map rotation, accepted square Sudoku panel, five Orchard families,25 tiers, three-star first-tier awards and necessary card progression with a fixed alcove alternative. The cross-module15-type minimum remains the later scope. The package is for implementation handoff; no gameplay, seed bank or new artwork has been implemented by writing it.

### Subsequent build allocation

Sam revised the split to approximately65% Codex and35% Claude. Coordination revision1.1 in the delivery board assigns Codex all artwork plus puzzles, procedural generation, v2 UI/art wiring and certification tooling/banks. Claude retains core engine/phase rules and App/save/reward integration. The100-point effort ledger, owned-file map and copyable prompts supersede the initial art-only Codex split; gameplay rules remain unchanged.
