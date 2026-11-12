# Expeditions: fifteen core puzzle types and navigable maps

Design proposal v0.1, 1 October 2026. This is the current portfolio entry point. It supersedes the earlier priority of ten Orchard missions or five Orchard missions before the other modules. Read with `EXPEDITIONS_STATS_ROTATION_AND_FEEDBACK.md` for card necessity, all-stat use and feedback requirements.

## 1. Scope and counting

Sam requires at least fifteen different puzzle types, with at least five per module. Thirty is a desirable expansion target; deliver the core five per module first. Different art, maps, larger numbers, fewer clues and harder Sudoku instances do not create additional puzzle types.

The proposal below contains fifteen different primary solving structures. A type is defined by its permitted moves, mathematical constraints, reasoning method and answer validator. Reusing a mechanism renderer is welcome. Reusing the same puzzle with a different title does not satisfy the count.

Each core type starts with one mission family and five procedural difficulty tiers. Fifteen families therefore provide 75 distinct mission/tier first-clear awards if that tier scheme is retained. At the proposed three-star amount, the total is 225 stars. The fixed-star reward choice is agreed; three stars and final tier count remain proposals.

The minimum is a product requirement; the exact selection below is a design proposal. These are not fifteen playable or certified generators. Existing curriculum content has been consulted; no new curriculum research or production implementation was performed.

## 2. Five core types per module

### Ninefold Orchard: concrete quantities, deduction and spatial reasoning

#### PO-01: Sudoku with linked sum cages

**Mission:** The Orchard of Four Locks. **Moves:** assign 1–4 to cells, then select powered outputs. **Rules:** each row, column and 2×2 box uses 1–4 once; overlapping sum cages provide extra clues. **Reasoning:** eliminate candidates using interacting uniqueness and total constraints. **Validator:** all-different groups plus cage totals; count solutions when authoring.

Use the previously checked Four Locks grid and both tactical traces as the reference. Higher tiers remove direct clues, introduce cage deductions and require separate control/defence jobs. Do not turn this into a larger worksheet. Maths powers bridge, shelter, roots or storm; the party must choose which two to operate.

Curriculum support: `logicGrid`, `twoUnknowns`, `additionSubtraction`. Existing ledger, gate and root art supports the prototype.

#### PO-02: Coupled number/operator rotation

**Mission:** The Turning Ravine. **Moves:** rotate wheels to expose values/operators. **Rules:** shared wheel states feed several equations; selected correct equations power board outputs. **Reasoning:** identify a mutually consistent configuration, considering how one turn affects multiple relationships. **Validator:** finite wheel assignments and exact expression evaluation, distinguishing equivalent faces.

Checked small fixture: `A O B = 24`, `B + C = 11`, `C − A = 1`, with the declared face sets from the rotation supplement. Its effective solution is A=4, B=6, C=5, O=×. Higher tiers add shared sector values, output budgets and enemy rewinds. Hero stats determine calibration, locking, bracing and stabilisation capacity, never whether a false equation counts as true.

Curriculum support: `fourOperationsProblems`, `twoUnknowns`, `timesTablesFacts`. Existing wheel/current-turner art is reusable.

#### PO-03: Balance partition with limited weighing

**Mission:** The Unequal Crossing. **Moves:** allocate weights to pans/reserve and request permitted comparisons. **Rules:** exact balance, pan capacity and declared exclusions; later one unknown weight must be inferred from comparisons. **Reasoning:** partition totals and eliminate hidden-weight candidates. **Validator:** enumerate legal partitions and comparison outcomes, accepting all valid allocations.

Fixture: 7+4 balances 5+3+2+1 at 11. Higher tiers add reserve choices, informative weighing and simultaneous defended pans. This is numerical allocation, unlike arranging geometric pieces into a region. No repeated pickup/drop-off loop.

Curriculum support: `additionSubtraction`, `twoUnknowns`, `logicGrid`. Existing scales, loads, burrow and Hookmole art.

#### PO-04: Nonogram run-length deduction

**Mission:** Maybe-Flock Roost. **Moves:** mark a cell filled/empty/unknown, then choose whistle beams. **Rules:** row/column clues describe ordered groups of filled cells, separated by at least one empty cell. **Reasoning:** intersect line possibilities and deduce forced cells. **Validator:** ordered run lengths, plus uniqueness for generated deduction boards.

The checked teaching cross has row/column clues 1,1,5,1,1; full missions need less obvious patterns. Higher tiers add split runs and deductions across lines. Confirmed nests map to perch groups; the player chooses which to scatter, contain or avoid. This is binary run inference, not the all-different arithmetic of Sudoku.

Curriculum support: `logicGrid`, `combinatoricsCounting`. Run-length notation needs a short new static teaching example. Existing Finch, tower, dial and ledger frame art.

#### PO-05: Polyhex packing with shelter constraints

**Mission:** The Hollow Bough. **Moves:** translate/rotate and, where explicitly allowed, reflect connected pieces. **Rules:** no overlap, compulsory covered sockets, forbidden cells and accessible spaces for heroes. **Reasoning:** spatial exact cover and packing. **Validator:** occupied-cell sets, legal transforms, socket coverage and free-space connectivity.

Higher tiers add irregular regions, competing useful packings and a visible root-fall forecast. A legal packing may still be a poor tactical shelter. Geometry changes placement/bracing capacity; Science preserves threatened shelter; the party must reach and defend it.

Curriculum support: `spatialPuzzles`, `symmetryReflection`, `shapeProperties`. Existing living branches, barriers, memorial and forecast art.

### Little Reckoning: rational quantities, uncertainty and formal rules

#### LR-01: Chained ratio allocation

**Mission:** The Divided Lanterns. **Moves:** allocate quantities to linked tanks, then transfer a permitted fraction. **Rules:** total conservation, ratios and stated transfer order. **Reasoning:** common units, equivalent ratios and dependent fractional changes. **Validator:** exact rational equations; reduce fractions rather than compare rounded decimals.

Fixture: divide 25 in ratio 2:3, giving 10 and 15. Transfer one fifth of the first tank to the second: 8 and 17. Higher tiers use linked ratios such as A:B and B:C, fractional transfers and changing demand windows. This differs from balancing: the goal is proportional relationships through transformations, not two equal sums.

Tactical effect: the allocation powers distinct lantern fields; efficient routing exposes one tank while a safer allocation costs repair. Curriculum: `ratioChain`, `fractionUnusual`, `inverseProp`. Existing LR load/wheel/terrain kit; live lantern markers can use existing effect shapes. No dedicated new lantern sprite is assumed.

#### LR-02: Interval-bound resource selection

**Mission:** Roughly at the Market. **Moves:** choose supplies and, when allowed, inspect a bound. **Rules:** meet a guaranteed minimum value under a weight limit using interval lower bounds; optional objectives may ask for an upper bound. **Reasoning:** distinguish guaranteed, possible and impossible outcomes. **Validator:** exact intervals and universal bounds, not a random sample value.

Fixture: A is worth [8,10], weight 3; B [7,9], weight 2; C [5,12], weight 4. Weight limit 5 and guaranteed value 15 make A+B valid. C's possible value is not a guarantee. Higher tiers add linked uncertainty, rounding intervals and a trade-off between inspection and defending stock.

Tactical effect: selected supply bounds govern whether a shield survives the next forecast. No item dragging across the map. Curriculum: `estimation`, `allocation`. LR crate/operator art and live item plaques suffice.

#### LR-03: Coordinate transformation composition

**Mission:** The Almost Mirror. **Moves:** compose translations, rotations and reflections to map a labelled shape onto a target. **Rules:** order matters; all vertices must match, with orientation labels preserved where required. **Reasoning:** transformations on four-quadrant coordinates and composition. **Validator:** exact vertex mapping under specified transforms.

Fixture: (1,2), (2,2), (1,3), rotated 90° anticlockwise about the origin then translated by (4,1), becomes (2,2), (2,3), (1,2). Higher tiers change centres, add reflected orientation and constrain the number of transformations.

Tactical effect: the transformed footprint opens shelter/attack positions; moving the wrong footprint can expose a control. This maps a fixed labelled figure to another, unlike packing several pieces. Curriculum: `coordGeom`, `transformations`, `spatialTransform`. Shapes remain live geometry over LR terrain.

#### LR-04: Remainder and divisibility locks

**Mission:** The Remainder Gates. **Moves:** select a number or combination of counters satisfying several remainder clues. **Rules:** every stated congruence/divisibility condition and range restriction holds simultaneously. **Reasoning:** residue classes and intersecting possible values. **Validator:** integer remainder checks plus enumeration of the declared domain.

Fixture: 1≤n≤15, n leaves remainder 1 on division by 3 and remainder 2 on division by 5. Only n=7 fits. Higher tiers introduce non-coprime divisors, impossible combinations and a limited shared token budget.

Tactical effect: choosing a valid gate signature changes which corridor is protected; locks are not periodic timers. Curriculum: `modular`, `numberProperties`, `countIntegers`. Existing LR operators and live gate labels.

#### LR-05: Truth-statement logic grid

**Mission:** The Witness Lanterns. **Moves:** assign truth values and identify the consistent location/identity. **Rules:** conditional statements, truth/lie counts and exclusions must agree. **Reasoning:** test assumptions, derive implications and reject contradictions. **Validator:** Boolean/model enumeration; exactly one model when unique deduction is promised.

Fixture: exactly one witness tells the truth. A says the key is west, B says east, C says B is lying. The consistent location is east: A false, B true, C false. Higher tiers use conditional statements, linked identities and a required conclusion rather than merely finding any consistent assignment.

Tactical effect: the deduction identifies which exposed control is genuine; full enemy damage intentions remain visible. Curriculum: `truthLiars`, `gridLogic`. LR Fog-thumb and operator kit with live statement plaques.

### Gifford: symbolic structure, discrete optimisation and conditional reasoning

#### GF-01: Algebraic identity assembly

**Mission:** Vex's Demonstration. **Moves:** place/rewrite symbolic fragments using approved algebraic moves. **Rules:** the assembled expression equals a target for every allowed variable value, not only one test input. **Reasoning:** expansion, factorisation and equivalence. **Validator:** exact polynomial normalisation for a bounded initial grammar; later rational forms must record excluded values.

Fixture: `2(x+3)` matches `2x+6`; `2x+3` does not. Higher tiers add two variables, factorised quadratics, constrained fragment reuse and domain restrictions. This differs from number-wheel rotation: the test is universal symbolic equivalence, not one numerical result.

Tactical effect: an equivalent expression removes a shield or redirects an engine without changing its invariant. Curriculum: `algebraicManipulation`, `algebraicProof`. No existing Gifford board kit was found; prototype with live geometry and existing card portraits, without claiming world art is complete.

#### GF-02: Integer-only resource equations

**Mission:** The Discrete Foundry. **Moves:** select integer counts of components. **Rules:** coupled equations/inequalities, non-negative integrality and inventory caps. **Reasoning:** divisibility, integer feasibility and bounded search. **Validator:** integer lattice enumeration or a bounded exact constraint solver.

Fixture: `3x+5y=19`, x,y non-negative integers, has only x=3,y=2. Higher tiers link two recipes, shared inventories, congruence deductions and an optimisation tie-break. A fractional answer solving the equation is invalid here.

Tactical effect: components determine a feasible defensive construction, with heroes servicing separate production sites. Curriculum: `diophantineEquations`, `simultaneousEquations`, `numberTheoryDivisibility`.

#### GF-03: Precedence and station scheduling

**Mission:** The Examination Clock. **Moves:** place tasks on a timeline and assign stations/heroes. **Rules:** durations, predecessor completion, exclusive station use and the declared deadline. **Reasoning:** critical paths, concurrency and resource conflicts. **Validator:** interval non-overlap, precedence and makespan.

Fixture: A takes 2 beats on station 1; B takes 3 on station 2 after A; C takes 2 on station 1 independently. Schedule A [0,2), B [2,5), C [2,4): finish at 5, matching the A→B lower bound. Higher tiers add conditional closures, transfer time and two feasible schedules with different tactical exposure.

Tactical effect: the team must execute the planned jobs, protect stations and use the resulting completion window. Beats are planning units, not a real-time countdown. Curriculum support: `optimisationAndExtremal`, `speedAndRelativeMotion`; explicit task-scheduling rules are enrichment and need new static teaching copy.

#### GF-04: Degree-limited spanning network

**Mission:** Vale's Filing System. **Moves:** choose edges connecting every required node. **Rules:** connectedness, no cycles when a tree is required, degree caps and a total-cost budget. **Reasoning:** topology, edge trade-offs and constrained network design. **Validator:** graph traversal, cycle checks, vertex degrees and exact summed cost.

Fixture: AB=2, BC=1, CD=2, AD=8, AC=4, BD=5. AB+BC+CD spans all four nodes, costs 5 and has maximum degree 2. Higher tiers add differing degree limits, repair alternatives and forecast removal of one named edge. A shortest source-to-target path does not satisfy a spanning requirement.

Tactical effect: active edges power multiple objectives; a vulnerable junction makes an otherwise cheap network costly to defend. Curriculum support: `optimisationAndExtremal`, `combinatoricsAndCounting`; graph terminology and degree rules are enrichment, not a claimed existing standalone lesson.

#### GF-05: Conditional probability and sample-space filtering

**Mission:** The Filtered Archive. **Moves:** classify or combine possible outcomes and select a policy meeting a probability condition. **Rules:** stated sampling model, replacement convention, observation and exact threshold. **Reasoning:** condition on evidence by restricting the sample space, avoiding incorrect independence assumptions. **Validator:** enumerate small exact sample spaces and rational probabilities.

Fixture: two red and two blue tokens, draw two without replacement. Given that at least one is red, probability both are red is 1/5: one red-red pair out of five eligible unordered pairs. Higher tiers introduce unequal compositions, ordered observations and alternative inspection policies.

Tactical effect: a mathematically valid policy opens the archive defence. There are no random combat rolls: the puzzle evaluates a hypothetical probability model deterministically. Actual enemy intentions remain predictable. Curriculum: `advancedProbability`, `combinatoricsAndCounting`.

## 3. Progression across modules

The fifteen core types above are counted once each. Additional variants can reuse familiar ideas across modules without contributing to the unique-type total:

| Shared concept | Orchard | Little Reckoning | Gifford |
|---|---|---|---|
| Equation wheels | Whole-number coupled equations | Signed values, fractions and explicit operation order | Symbolic/domain-aware constraints and equivalent forms |
| Deduction boards | 4×4 Sudoku and sum cages | Linked inequalities, signed clues and factors | Boolean alternatives, variable relations and constraint implications |
| Shape reasoning | Packing concrete pieces | Coordinate compositions and invariant orientation | Vectors, similarity and exact geometry constraints |
| Resource systems | Whole-number balance | Ratios, fractional changes and guaranteed bounds | Integer feasibility and constrained optimisation |

A module's later content should demand deeper inference, not merely a longer equation or bigger numeral. Familiar puzzle forms can give pupils a stable way into more advanced maths. For example, a more difficult Sudoku is still Sudoku and does not consume a new type slot.

Within each module, maintain two explicit axes: mathematical constraint complexity and tactical/card capability tier. The main rewarded progression increases both through authored bands. An optional puzzle-practice setting can vary mathematical difficulty without promising a higher card-tier reward. Never auto-reduce the fixed battlefield requirements to the selected party.

For each of the fifteen families, the five tiers need a concrete constraint ladder, five-stat contribution map, necessary higher-capability evidence, reference seeds, two distinct winning plans and readable feedback. The examples above establish the mathematical identity of each type; they are not enough to certify five complete tiers.

## 4. Thirty-type expansion reserve

These fifteen candidates would take the portfolio to thirty globally distinct types, ten per module. They remain reserve candidates, with curriculum, distinctness and pacing to be verified before promotion. No bonus unique-type count is earned merely by changing their module or symbols.

| Module | Additional candidate | Distinct main solving structure |
|---|---|---|
| Orchard | Cider flow | Conservation across splitters and capacity edges |
| Orchard | Rootfire parity network | Path-state propagation through parity-changing nodes |
| Orchard | Hedgejaw constrained route | Path search with ordered visits and direction/count rules |
| Orchard | Moonfall loop | Boundary edge counts and single-loop enclosure |
| Orchard | First Whistle | Intersection of periodic pulse sets and phase offsets |
| Little Reckoning | Digit detective | Column carries, place-value substitution and distinct digits |
| Little Reckoning | Equal-edge garden | Construct shapes under simultaneous area/perimeter requirements |
| Little Reckoning | Nets workshop | Fold/identify valid 3D nets and opposite faces |
| Little Reckoning | Mixed-rate journey | Piecewise speed/time conservation and meeting points |
| Little Reckoning | Ordered seating | Permutation constraints and adjacency exclusions |
| Gifford | Minimax pursuit | Minimise worst-case cost across declared adversarial responses |
| Gifford | Invariant moves | Prove/identify reachable states under conserved quantities |
| Gifford | Function machine | Compose/invert functions and reason about iteration |
| Gifford | Circle proof chain | Exact angle relations and a justified dependency chain |
| Gifford | Statistical reconstruction | Recover a distribution from median/quartile/frequency constraints |

The earlier ten Orchard mission designs therefore remain useful: five are now the Orchard core, five are its reserve. This is a scope reprioritisation, not a request to discard useful design or art.

## 5. Map viewport

The board sits in a pannable and zoomable viewport. The map can extend beyond the visible screen. Camera movement never spends an action, alters board coordinates or changes the enemy forecast. Do not enlarge the map merely because panning exists.

Required interactions:

- Touch: one-finger drag on empty board to pan; pinch to zoom; tap a hero/object/tile to select. Movement executes only through the selected action and confirmation. A drag must not accidentally issue Move.
- Mouse: drag empty board or use a dedicated pan gesture; wheel pans, Ctrl+wheel zooms around the pointer. Provide visible +/− controls so zoom does not depend on a gesture.
- Keyboard: accessible pan/zoom commands and focusable hero/objective controls. Keep them out of text inputs and provide on-screen help.
- Quick camera controls: “Party”, “Objective”, “Overview” and “Reset view”. Selecting a hero in the party tray or a named object in the briefing can centre it.
- Small overview: show viewport location, heroes, active objectives and forecast threats. It can collapse on phones. Off-screen markers retain names and let the player jump to relevant places.

Zoom limits are determined by legibility and selection, not an arbitrary maximum. At close zoom, show full equation labels and tactical previews. At overview scale, simplify art and display symbols for roles/threats; detailed values remain available in the selected-object panel. Never make important information accessible only by visually inspecting tiny text.

Keep the HUD outside the transformed map layer. The contextual puzzle panel can expand within the viewport or into a drawer; retain a clear way back to the board. A square Sudoku/nonogram is a labelled mechanism panel, not a distorted hex battlefield.

When an enemy phase begins, offer a follow-action camera setting. Default to showing the relevant action when the player is not actively panning; respect a manual camera lock and reduced-motion preference. An off-screen enemy result must have a persistent marker/log entry. Avoid repeatedly snapping between three distant heroes.

Hit testing uses the inverse camera transform against the same pointy-top hex polygons used for display. Clamp panning to map bounds plus a useful margin and preserve the selected object while zooming. Account for the fixed HUD, open drawers and device safe areas when centring. The same saved tactical state must resolve identically at every zoom.

Camera position is presentation state. Saving/restoring it is optional convenience; it must not enter solver state, seed identity or reward identity. Moving between practice puzzle and battlefield does not reset the tactical run.

Viewport acceptance: touch drag versus tap, pinch, mouse wheel, zoom around pointer, keyboard access, off-screen threat discovery, readable equations, correct hex selection at min/max zoom, resize/orientation changes and no accidental actions during camera navigation. Use the actual supported phone/tablet/browser sizes before accepting the interaction design.

## 6. Delivery and acceptance order

1. Agree the core fifteen selection and unified stat/hand/combat rules. Preserve the existing private gate.
2. Produce exact data contracts and mathematical validators for five types in each module. Use existing lessons for vocabulary; add short static puzzle tutorials where needed.
3. Complete one end-to-end Orchard vertical slice and viewport interaction, then one representative LR and GF slice before expanding the rest. Check mature-module complexity without silently turning a five-minute mission into a long examination.
4. Certify each remaining core family and its tier ladder. Prioritise coverage of all three modules over delivering ten Orchard families first.
5. Only promote reserve types after the fifteen core types meet the same mathematical, tactical, card-progression, feedback and child-playtest gates.

Asset readiness differs: Orchard has a broad production kit; LR has heroes/terrain/mechanisms but limited dedicated enemy/UI art; GF has no dedicated Expedition board kit in the audited tree. This does not stop mathematical design or schematic prototypes. It does mean a polished GF release needs a separate art/reuse decision, not an invented claim that all assets exist.

This document does not authorise production implementation or dispatch development agents. The final shared specification must resolve formulas, module party size, exact enemy rules, tier contracts and acceptance traces before handing bounded tasks to lower-powered agents.
