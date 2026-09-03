# Primary learning progression audit

Date: 31 August 2026

## Purpose and interpretation

This audit checks every Primary topic against the intended learning model:

1. a well-written lesson;
2. four genuine worked examples in every lesson section;
3. four clear generator difficulty bands;
4. at least five distinct question formulations at each difficulty, where the topic reasonably permits them;
5. a visible relationship between what the lesson teaches and what Practice and Mock Tests ask;
6. a defensible relationship to the English Key Stage 2 mathematics curriculum.

For this report, a question formulation means a recognisably different way in which a pupil can encounter the topic: a different context, representation, wording route, unknown or reasoning demand. Merely changing numbers or names does not count. The existing `structureId` registry is useful evidence, but its labels are not automatically accepted as proof of good verbal variety.

## Executive summary

- Primary contains 26 generator topics and 25 matching lesson objects. `negativeNumbers` has no lesson.
- The game wiring correctly exposes four generator bands. Practice maps levels 1-2 to difficulty 1, levels 3-4 to difficulty 2, levels 5-6 to difficulty 3 and levels 7-10 to difficulty 4. Mock Tests use a separate, sensible two-band ladder per level and call the same generators.
- Every generator declares at least five eligible `structureId` values at every difficulty. The lowest observed count is five and the highest is fourteen.
- That registry count is not the same as five strong verbal formulations. Much of the new work varies the mathematical operation or unknown while retaining a terse, abstract question frame. Division, time, area, logic, combinatorics and spatial reasoning currently make the best use of real contexts. Times tables, fraction arithmetic, decimals, additive comparison, compensation and the two formal-method topics remain heavily procedural.
- All existing lesson sections contain four `examples` entries after the recent lesson work. However, 12 lessons contain generic placeholder prompts, and several repeat them. Those entries are not genuine worked examples.
- Ten lessons have no detected placeholder examples and are broadly strong. Four have limited but material repair needs. Eleven require substantial example rewriting. `negativeNumbers` requires a complete lesson.
- Most topic headings have a sound KS2 home. Logic puzzles, combinatorics and parts of spatial puzzles are enrichment rather than named statutory content. Several upper difficulty structures cross into KS3-style algebra or geometry and should be explicitly marked as stretch rather than presented as ordinary KS2 progression.
- The most important systemic gap is that lesson examples are not tagged or mapped to generator `structureId` values. Alignment is therefore editorial and implicit, not testable.

## Rating key

- **Good**: usable as-is apart from normal copy-editing.
- **Repair**: sound core, but definite gaps or weak examples need correction.
- **Rebuild**: missing or too compromised to meet the requirement.
- **Strong variety**: substantially different contexts or representations occur across the band.
- **Mixed variety**: five registry entries exist, but many are abstract or are mathematical subtypes rather than distinct verbal formulations.
- **Procedural variety**: the numerical/procedural route changes, but the pupil repeatedly sees equation-like prompts. This does not fully meet the intended anti-pattern-learning goal.

## Complete topic audit

| Topic | Lesson and four examples | Structures by difficulty (D1/D2/D3/D4) | Difficulty progression | Verbal variety | Lesson-generator relationship | KS2 relationship | Priority gap |
|---|---|---:|---|---|---|---|---|
| Place Value | **Good**: 8 sections, 32 genuine examples | 7/11/9/6 | **Repair**: generally clear, but `count_through_zero` belongs under Negative Numbers | **Mixed**: strong use of composing, partitioning, ordering and reconstruction, but many prompts remain abstract | **Strong** for the core place-value structures | **Direct**: number and place value, including large numbers | Move the negative-number structure and add more applied formulations at D1 and D4 |
| Rounding & Estimating | **Good**: 8 sections, 32 genuine examples | 5/7/7/5 | **Good**: direct rounding develops into bounds, reverse rounding and contextual estimation | **Mixed**: structurally diverse, but only limited everyday estimation contexts | **Strong**: lesson covers number lines, halfway cases, reverse rounding and estimating | **Direct**: rounding and estimation | Add contexts such as crowds, journey lengths, budgets and capacity at each band |
| Negative Numbers | **Rebuild**: no matching lesson | 7/10/10/7 | **Good**: number-line work develops into intervals and multi-step changes | **Mixed to strong**: temperature and floors help, but D1 is predominantly abstract | **Missing** because there is no lesson | **Direct**: interpreting negative numbers in context and counting through zero | Write the complete lesson, reuse temperature, lift/floor, sequence and interval structures |
| Times Tables | **Good**: 8 sections, 32 genuine examples | 5/6/6/5 | **Good**: recall develops into scaling, partitioning, reversal and comparison | **Procedural**: five IDs exist, but most prompts are naked facts or fact transformations | **Strong mathematically**, weaker as verbal preparation | **Direct**: multiplication and division facts, mental methods | Add arrays, packs, rows, rates, scaling and comparison stories at every difficulty |
| Division & Remainders | **Good**: 10 sections, 40 genuine examples | 5/7/5/5 | **Good**: direct division develops into interpreting and chaining remainders | **Strong**: sharing, packing, buying, transport and decimal/fraction remainders vary what the remainder means | **Very strong**: lesson explicitly teaches the same contextual decisions | **Direct**: division, remainders and problem solving | Keep as a model for other topics; add explicit lesson-to-structure tags |
| Factors & Multiples | **Good**: 8 sections, 32 genuine examples | 5/7/6/5 | **Good**, although formal prime factor decomposition at D4 should be treated cautiously | **Mixed**: varied mathematical tasks, with real contexts mostly delayed until D3-D4 | **Strong** for factors, multiples, HCF, LCM and primes | **Direct**, except formal prime factor decomposition is beyond the clearest statutory wording | Add grouping, schedules and tiling contexts earlier; label decomposition as stretch |
| Patterns & Sequences | **Rebuild examples**: 8 sections and 32 entries, but 12 are generic placeholders and repeated prompts reduce these to 26 unique questions | 7/12/12/7 | **Repair**: good range, but D4 nth-term algebra and membership tests need a deliberate KS2-stretch boundary | **Strong** in representation: cycles, shapes, arithmetic, alternating and Fibonacci-style sequences | **Partial**: the lesson heavily emphasises repeating cycles and simple arithmetic patterns, while the generator is much broader | **Broad KS2 reasoning**, with some D4 content closer to KS3 algebra | Replace all placeholders and teach the D3-D4 structures explicitly or mark them as stretch |
| Equivalent Fractions | **Good**: 9 sections, 36 genuine examples | 5/8/6/5 | **Good**: visual/direct equivalence develops into comparison, ordering and chains | **Mixed**: grids and comparisons help, but most frames are still symbolic | **Good core alignment**, though the lesson also teaches improper fractions, decimals and percentages that this generator does not assess | **Direct**: equivalent fractions, simplification, comparison and common denominators | Either add assessed structures for the extra lesson content or remove/move those sections |
| Adding Fractions | **Rebuild examples**: 10 sections and 40 entries, but 12 are generic placeholders | 5/9/9/7 | **Good** for addition/subtraction progression | **Procedural**: nearly all structures are symbolic transformations rather than varied situations | **Partial**: lesson includes multiplying fractions, while the generator is almost entirely addition/subtraction | **Direct** for addition/subtraction; fraction-by-fraction multiplication is outside normal KS2 statutory scope | Replace placeholders; split or remove multiplication material; add measures, recipes, distances and sharing contexts |
| Fraction of an Amount | **Good**: 9 sections, 36 genuine examples | 5/8/5/5 | **Good**: direct fractions develop into reverse and two-stage problems | **Mixed to strong**: money and remainder contexts are useful, but D1 is still mostly abstract | **Strong** | **Direct**: fractions of quantities and problem solving | Broaden D1 contexts and map examples to structure IDs |
| Decimals | **Repair**: 8 sections, 32 entries, 3 generic placeholders | 5/9/7/5 | **Good**: place value develops through ordering, scaling and thousandths | **Procedural**: most questions are digit/place/operation prompts | **Strong mathematically**, subject to replacing the placeholder section | **Direct**: decimal place value, comparison and powers-of-ten scaling | Replace placeholders and add money, measurement, scores, lengths and capacity formulations |
| Ratio | **Repair**: 8 sections, 32 entries, 6 generic placeholders and only 30 unique prompts | 5/8/8/5 | **Good**: scaling develops into totals, differences and three-way ratio | **Procedural to mixed**: recipe/share possibilities exist, but the registry is dominated by bare ratio operations | **Generally strong**, but placeholder sections weaken preparation | **Direct at Year 6**: ratio and proportion problems | Replace placeholders and make recipe, map, mixture, team and sharing formulations routine rather than occasional |
| Two Mystery Numbers | **Rebuild examples**: 7 sections, 28 entries, 9 generic placeholders and only 24 unique prompts | 5/7/9/5 | **Repair**: sensible progression, but several D4 forms are algebra-heavy for ordinary KS2 | **Mixed**: coins and clue puzzles help, but many structures are equations in prose | **Partial** until placeholder sections are rewritten | **Direct as Year 6 algebra/problem solving**, with D4 best treated as stretch | Replace placeholders; use ages, totals, scores, coins, lengths and bar-model contexts; mark advanced elimination as stretch |
| More Than vs Times As Many | **Rebuild examples**: 8 sections, 32 entries, 9 generic placeholders and only 28 unique prompts | 5/8/8/5 | **Good mathematical progression** | **Procedural**: many prompts ask pupils to label or solve comparison forms rather than interpret varied stories | **Partial** because the lesson examples are incomplete | **Direct** through additive and multiplicative comparison problems | Replace placeholders and add population, collections, distance, price, score and growth contexts at every band |
| Units & Measures | **Rebuild examples**: 8 sections, 32 entries, 12 generic placeholders and only 26 unique prompts | 5/6/5/5 | **Good**: recall/direct conversions develop into mixed and chained measures | **Mixed**: money is useful, but many formulations remain direct conversions | **Partial**: key methods align, but half the affected sections do not contain real worked examples | **Direct**: metric measures, money and conversion | Replace placeholders and add journey, container, recipe, shopping and construction problems |
| Area & Perimeter | **Rebuild examples**: 8 sections, 32 entries, 12 generic placeholders and only 26 unique prompts | 7/13/14/8 | **Good**, though ratio-of-sides area is an upper stretch item | **Strong**: grids, diagrams, tiling, gardens, paths and composite shapes give different readings | **Partial** only because lesson examples are incomplete | **Direct**: perimeter and area; compound/ratio work is extension | Replace placeholders; preserve the generator’s strong contextual range in the rewritten examples |
| Time & Calendar | **Repair**: 9 sections, 36 entries, 6 generic placeholders; one exact question is duplicated | 6/10/9/6 | **Good**: direct duration develops into timetables, dates and multi-step calendar reasoning | **Strong**: clocks, dates, timetables, ages and schedules naturally vary the verbal form | **Good**, apart from placeholders and the duplicate | **Direct**: time conversion, duration and timetables; leap-year detail is enrichment | Replace placeholders, remove duplication and ensure harder date arithmetic remains readable |
| Mental Maths Shortcuts | **Good**: 8 sections, 32 genuine examples | 5/6/5/5 | **Good**: applying compensation develops into validity, reversal and error spotting | **Procedural**: variation is mostly in the rule being tested rather than the story | **Very strong mathematically** | **Direct as fluency strategy**, although not a separately named statutory strand | Add shopping, distance, quantities and equal-scaling contexts without obscuring the mental method |
| Column Multiplication | **Good**: 9 sections, 36 genuine examples | 5/7/6/5 | **Good**: short methods develop into partial products, two-digit multiplication and diagnosis | **Procedural**, with only limited applied framing | **Strong** for the written method | **Direct**: formal written multiplication | Treat the constrained nature of the topic as an allowed exception, but add several concise applications such as arrays, costs and area |
| Long Division | **Good**: 8 sections, 32 genuine examples | 5/7/5/5 | **Good**: short/direct work develops into two-digit divisors and error diagnosis | **Procedural**, with limited applied framing | **Strong** for the written method | **Direct**: formal written division | Treat as a constrained exception, but add equal sharing, capacity, batching and rate contexts |
| Logic Puzzles | **Rebuild examples**: 8 sections, 32 entries, 12 generic placeholders and only 26 unique prompts | 5/10/10/6 | **Good as an enrichment ladder** | **Strong**: ordering, seating, truth, grids, contradictions and clue selection vary the reading demand | **Partial**: generator is much richer than the current lesson examples | **Enrichment** supporting the statutory reasoning aim, not a named KS2 content domain | Replace placeholders and label the topic clearly as reasoning/stretch rather than core curriculum coverage |
| Counting Possibilities | **Rebuild examples**: 10 sections, 40 entries, 18 generic placeholders and only 30 unique prompts | 5/10/11/6 | **Good as an enrichment ladder**, but several D3-D4 combinatorial forms exceed ordinary KS2 | **Strong**: outfits, menus, coins, dice, grids, routes, handshakes and restrictions | **Weak-to-partial** because nearly half the lesson examples are placeholders | **Enrichment**: systematic listing supports reasoning, but combinations/permutations are not a named KS2 strand | Rewrite the lesson examples extensively and mark the advanced material as stretch |
| Angles | **Rebuild examples**: 10 sections, 40 entries, 19 generic placeholders and only 30 unique prompts | 7/9/10/7 | **Repair**: D1-D3 progression is sound; ratio and algebraic angle equations at D4 are beyond core KS2 | **Mixed to strong for a constrained topic**: diagrams, clocks, turns, lines, points, triangles and reasoning give legitimate variety | **Partial**: the substantive later sections align, but the introductory half has placeholder examples | **Direct** for measuring/classifying angles and angle sums; algebraic/ratio forms are stretch | Replace placeholders; explicitly identify D4 algebraic variants as stretch |
| Shape Properties | **Rebuild examples**: 8 sections, 32 entries, 9 generic placeholders and only 28 unique prompts | 6/10/10/6 | **Good**, with coordinates and translations appropriately increasing demand | **Mixed to strong for a constrained topic**: classification, properties, perimeter, coordinates and odd-one-out reasoning | **Partial** due to placeholder examples | **Direct**: properties of shapes, coordinates and position/direction | Replace placeholders and ensure generator diagrams/representations are mirrored in lesson examples |
| Symmetry | **Repair**: 8 sections, 32 entries, 6 generic placeholders, plus one exact duplicate reflection question | 5/10/10/5 | **Repair**: axis reflection is sound; reflection in `y=x`, offset lines and two-step reflection are KS3-style extension | **Mixed to strong for a constrained topic**: shapes, grids, coordinates and rotational contrast | **Good core alignment**, weakened by placeholders and duplication | **Direct** for line symmetry and coordinate reflection; several D4 structures are stretch | Replace placeholders and duplicate; label diagonal/offset/composed reflections as stretch |
| Spatial Puzzles | **Rebuild examples**: 8 sections, 32 entries, 9 generic placeholders and only 28 unique prompts | 5/10/10/8 | **Good as an enrichment ladder** | **Strong**: folds, cuts, nets, rotations, views and cube constructions are genuinely different readings | **Partial**: generator breadth exceeds the lesson’s completed worked examples | **Partial/enrichment**: nets and 3D properties connect to KS2 geometry; painted cubes, hidden cubes and complex folds are extension | Replace placeholders and explicitly separate statutory geometry from enrichment |

## Requirement totals

### Lessons

- **Good with four genuine examples in every section:** 10 topics: Place Value, Rounding & Estimating, Times Tables, Division & Remainders, Equivalent Fractions, Fraction of an Amount, Mental Maths Shortcuts, Column Multiplication, Long Division and Factors & Multiples.
- **Repairable but not yet fully compliant:** 4 topics: Decimals, Ratio, Time & Calendar and Symmetry.
- **Substantial example rewrite required:** 11 topics: Patterns & Sequences, Adding Fractions, Two Mystery Numbers, More Than vs Times As Many, Units & Measures, Area & Perimeter, Logic Puzzles, Counting Possibilities, Angles, Shape Properties and Spatial Puzzles.
- **Missing:** Negative Numbers.

### Four difficulty bands

- **Mechanically present:** 26 of 26 topics generate at difficulties 1-4.
- **Clearly progressive without a major scope warning:** approximately 19 topics.
- **Progressive but needing explicit stretch labelling or content relocation:** Place Value, Patterns & Sequences, Factors & Multiples, Two Mystery Numbers, Area & Perimeter, Angles, Symmetry and Spatial Puzzles.

### Five formulations per difficulty

- **Registry threshold met:** 26 of 26 topics have at least five declared structures at every difficulty.
- **Strongly meets the intended verbal/contextual goal:** Division & Remainders, Area & Perimeter, Time & Calendar, Logic Puzzles, Counting Possibilities and Spatial Puzzles.
- **Reasonable for a visually or procedurally constrained topic:** Patterns & Sequences, Angles, Shape Properties and Symmetry.
- **Meets the registry count but needs more contextual/verbal rewriting:** the remaining 16 topics, especially Times Tables, Adding Fractions, Decimals, More Than vs Times As Many, Mental Maths Shortcuts, Column Multiplication and Long Division.

The current automated sanity test confirms structure reachability and sampling balance. It does not test whether five prompts are genuinely different to a child. A future audit test should normalise numbers and names from generated question text and report repeated prompt skeletons, but final approval still needs human editorial review.

## Lesson-generator alignment gaps

1. Lesson examples do not carry `structureId` or a separate `teachesStructures` field. There is no machine-checkable answer to “does the lesson teach every structure the generator can ask?”
2. Placeholder prompts create false compliance with the four-example rule.
3. Some lessons teach material that the associated generator does not assess:
   - Equivalent Fractions includes improper fractions, mixed numbers, decimals and percentages.
   - Adding Fractions includes fraction multiplication.
4. Some generators assess material not adequately taught in the lesson:
   - Patterns & Sequences has a much broader D3-D4 bank than its lesson.
   - Logic, combinatorics and spatial generators are substantially richer than their current lessons.
5. Place Value incorrectly contains `count_through_zero`, which belongs in Negative Numbers.
6. Several D4 structures need a visible `stretch` designation: algebraic angle equations, diagonal/offset reflections, advanced nth-term algebra, painted-cube reasoning and some combinatorics.

## KS2 curriculum coverage observations

The topic set has strong coverage of number, calculation, fractions, ratio, measures and geometry. It also supports the national curriculum aims of fluency, mathematical reasoning and solving problems in varied contexts. The curriculum basis used for this review is the Department for Education's current Key Stages 1 and 2 mathematics programme of study.

The following topics are legitimate enrichment rather than direct named curriculum strands:

- Logic Puzzles;
- Counting Possibilities;
- the harder parts of Spatial Puzzles;
- some advanced structures in Two Mystery Numbers, Angles and Symmetry.

There are also notable KS2 coverage gaps or topics hidden inside other lessons rather than represented clearly in Practice:

- no standalone addition and subtraction topic;
- no standalone percentages topic;
- no statistics topic covering tables, line graphs, pie charts and mean;
- limited explicit volume/capacity problem solving;
- limited decimal calculation beyond place value and scaling;
- fraction multiplication/division coverage is confused with the Adding Fractions lesson rather than cleanly scoped;
- Roman numerals are not visible as a topic;
- the four-operations problem-solving progression is distributed across several procedural topics rather than presented coherently.

## Recommended order of repair

1. Write the missing Negative Numbers lesson and move `count_through_zero` into that topic.
2. Replace every generic lesson placeholder with a real worked example. Start with Angles, Counting Possibilities, then the nine lessons with 9-12 placeholders.
3. Add lesson-to-generator mapping metadata. A simple `structureIds: [...]` field on each worked example or section would make coverage auditable.
4. Editorially review each generator difficulty using the user's verbal-structure definition. Keep the mathematical variety, but add multiple natural contexts where current questions are predominantly symbolic.
5. Mark beyond-core structures as `stretch: true` or move them into a separate enrichment route so four-band progression does not quietly become KS3 progression.
6. Resolve lesson scope mismatches, particularly Equivalent Fractions and Adding Fractions.
7. Decide whether the missing KS2 curriculum areas should become new topics or be explicitly incorporated into existing topics.

## Overall judgement

Primary now has a much stronger technical structure system than it had before. It can generate at every difficulty and its registries exceed the numerical variety threshold. It is not yet a completed learning progression.

The strongest part is the generator infrastructure. The weakest part is the editorial bridge between teaching and testing: missing or placeholder lesson examples, no explicit structure mapping, abstract formulations in several arithmetic topics and unlabelled stretch content. Fixing those gaps is more valuable now than adding further generator structures.
