# Junior learning build memory

This file records the durable decisions for the Junior module. Read it before changing Junior topics, lessons, generators, practice progression, mock papers or Olympiad content.

## Purpose

Junior Maths is a Key Stage 3 learning course with UKMT-quality problem solving. It is not a catalogue of historical UKMT question types.

The curriculum determines what the visible regular topics are. The last ten years of JMC and Junior Kangaroo evidence determine how those topics are applied, disguised and combined.

JMO is a separate stretch pathway with its own training section and question set. JMO questions, proof progression and marking expectations do not belong in regular topics, practice generators or mocks.

## Editorial truth and acceptance standard

The 1 September curriculum overhaul completed the Junior architecture, not the full teaching rewrite. Consolidated lessons reuse useful earlier material, and the eight newly added KS3 lessons begin from serviceable templates. Neither fact proves that a ten-year-old can learn each idea independently.

Every visible Junior lesson must now be read and rewritten as a continuous first encounter. Start from its Primary or earlier-Junior prerequisite, introduce one new relationship at a time, explain vocabulary and representations before using them, justify the method in every example and bridge explicitly from direct KS3 work to JMC or Kangaroo-style disguise. Registered structures and four examples per section remain audit aids only.

## Evidence base

- Statutory KS3 mathematics programme of study for England.
- Department for Education and NCETM 2021 KS3 teaching guidance.
- Official UKMT Junior Mathematical Challenge, Junior Kangaroo and Junior Mathematical Olympiad papers from 2017 to 2026 inclusive.
- Detailed audit in `JUNIOR_KS3_UKMT_AUDIT.md`.

The 2020 JMC took place, but there was no Junior Kangaroo or JMO follow-on round. The reviewed competition corpus therefore contains 28 papers and 599 problems.

## Architectural decision

Use the 26 connected curriculum blocks in the DfE sample KS3 sequence as the default visible topic spine:

1. Place value
2. Properties of number
3. Arithmetic with integers and decimals
4. Expressions and equations
5. Plotting coordinates
6. Perimeter and area
7. Arithmetic including fractions
8. Multiplicative relationships: fractions and ratio
9. Transformations
10. Estimation and rounding
11. Sequences
12. Graphical representations of linear relationships
13. Solving linear equations
14. Percentages and proportionality
15. Statistical representations and measures
16. Statistical analysis
17. Perimeter, area and volume
18. Geometrical properties: polygons
19. Constructions
20. Similarity and Pythagoras
21. Probability
22. Non-linear relationships
23. Expressions and formulae
24. Trigonometry
25. Standard form
26. Graphical representations

This is a recommended sequence, not a claim that every block must receive equal time. Prerequisites and conceptual connections matter more than superficial coverage.

## Existing material

Preserve useful lesson prose, diagrams and generator builders. Rehome narrow current topics as structures inside curriculum topics.

Examples:

- age, sport, number-machine and backwards questions belong within equations or formulae
- clock and calendar questions belong within arithmetic, units or cyclic sequences
- pool, path, midpoint, divided-shape and triangle-area questions belong within perimeter and area
- isosceles, rhombus and parallel-line questions belong within polygons and deductive geometry
- seating and allocation can become systematic sample-space structures within probability
- digit puzzles belong within place value, number properties or algebra

`truthLiars`, `seating`, `pigeonhole`, `allocation`, `magicGrid`, `gridLogic` and `networkGraph` are retained as clearly labelled UKMT logic extensions. They remain available for lessons and practice, enter the mock rotation at Level 7 and do not displace the 26 statutory curriculum topics. They are not part of the Olympiad pathway.

## Regular-topic reasoning lenses

Every regular structure has one primary reasoning route:

1. translate and model
2. work backwards or use inverse operations
3. enumerate systematically
4. find structure, including parity, divisibility, remainders, symmetry or invariants
5. bound or optimise
6. deduce and justify at an appropriate curriculum level

The same reasoning lens should appear across different curriculum topics. This teaches transfer rather than recognition of a memorised story shell.

## Difficulty contract

- D1: prerequisite security, recognition and one principal step.
- D2: familiar KS3 application, usually two linked steps or one representation change.
- D3: method selection, interacting constraints or connected concepts; broadly middle-to-late JMC reasoning.
- D4: non-routine KS3 synthesis, interacting constraints, efficient casework, invariants, extremal reasoning or Junior Kangaroo-style extension.

Difficulty must increase through mathematical demand. Larger numbers, longer wording and closer distractors are not sufficient.

A structure may span several difficulties only when its mathematical or reasoning demand genuinely grows. It may be extended at the higher difficulty rather than copied unchanged.

JMO difficulty is separate from D1-D4. Olympiad training has its own strategy and proof-writing progression and uses only the separate Olympiad question bank.

## Lesson contract

- Every visible topic has a substantial, well-written lesson.
- Every teaching section contains exactly four fully worked examples.
- An example contains a complete question, explicit justified steps and a final answer.
- Worked reasoning explains why each step is valid, not merely what operation was performed. This standard of explanation does not turn a regular example into an Olympiad question.
- Direct counting, naming and recognition use a short Think, Work, Answer and Check. Intermediate calculations use State → Work → Conclude. Hard multi-step, proof, case, optimisation or unfamiliar formula work uses CLEAR: Comprehend → Link the facts → Explain the route → Apply it carefully → Review and conclude.
- Choose the scaffold from the actual reasoning demand. Do not force a formal method onto a simple question or fill CLEAR stages with generic prose.
- Examples should represent appropriate D1-D4 stages. Early foundation sections may reasonably concentrate on D1 and D2.
- Every worked example has a valid `structureId` matching the question generator.
- The lesson deliberately demonstrates representative structures used by the generator.
- Prerequisites are explicit and linked. Junior lessons may link to Primary lessons and later Junior lessons may build on earlier Junior lessons.
- Existing prose is retained when it fits the new topic and standard; it is rebuilt when it does not.

## Generator contract

- Every visible topic has D1-D4 question generation.
- Aim for at least five genuinely distinct verbal structures at every difficulty where the mathematics allows it.
- Diagram-bound topics may have fewer verbal forms when forcing five would create artificial duplicates. The exception must be recorded and justified.
- Ideally, five settings correspond to five reasoning routes rather than five cosmetic stories around one calculation.
- Across a suitable topic, target approximately one half story questions, one third diagram questions and one sixth direct questions. Diagram-dependent topics may deviate.
- Use UK standards and terminology, international contexts and the 9fo world flavour with 9fo character names.
- Every generated output exposes `structureId`, `variantId`, `representation`, `difficulty` and `stretch` where relevant.
- Every registered structure records its curriculum objective, prerequisite, reasoning route, eligible difficulties and representation.
- Every question has five distinct answer options, a valid correct index and a complete worked solution.
- Numeric randomisation inside one sentence frame is a variant, not a new structure.

## Practice and mock behaviour

- Practice difficulty is topic-specific and rises after ten credit-eligible correct answers at the current level.
- Repetition in practice is expected. Each structure should be encountered at least once per level before unconstrained reuse where practical.
- A mock draws questions appropriate to its level.
- A mock contains no exact repeat, no repeated `variantId` and no repeated `structureId` unless a paper specification explicitly requires it and there is no valid alternative.
- Prefer topic breadth before repeating a topic within a mock.
- The lesson opened from a practice or mock question must teach the same underlying curriculum objective and should include the same or a closely related registered structure.

## Migration rules

- Work in batches of five curriculum topics.
- Before rewriting, inventory reusable lesson paragraphs, diagrams and generator branches.
- Preserve player progress by defining old-key to new-key mappings before retiring old topics.
- Build a shared structure registry and metadata contract before bulk content migration.
- Run focused checks after each batch. Full cross-module regression may wait until all batches are complete unless shared code changes.
- Keep regular D4 stretch mathematically appropriate, taught and within the KS3 and Junior Kangaroo pathway.
- Keep the Olympiad training section, progression and question set separate. Audit or rebuild it as its own workstream.

## Implemented baseline: 1 September 2026

- 33 visible Junior topics: 26 KS3 curriculum topics and seven UKMT logic extensions.
- 33 visible lessons and 33 visible D1-D4 generators.
- 173 teaching sections and 692 worked examples; every section contains exactly four examples staged D1-D4.
- 165 globally unique registered structures: five for every visible topic and every difficulty.
- Every worked example links to a valid generator `structureId`.
- Practice generation rotates through the five eligible structures before reuse at each difficulty.
- Logic extensions enter mock selection at Level 7. Levels 1-6 draw only from the 26-topic KS3 spine.
- A 25-question mock has enough eligible unique topics at every level to avoid topic, structure and variant repetition.
- Old narrow-topic generators and lessons remain behind the visible catalogue where useful for content reuse and save compatibility.
- Old topic progress is merged once into the appropriate new curriculum topic. Logic progress and Olympiad progress are preserved unchanged.
- Olympiad training and its separate question bank were not modified.
- `node scripts/audit_junior_progression.cjs` is the focused curriculum gate. `node scripts/gen_sanity_test_junior.cjs` is the high-volume generator gate.
- This baseline is structurally complete but not editorially approved under the first-time-learner standard. A full slow-teaching pass across all 33 visible lessons remains required.

## Slow-teaching implementation checkpoint: 1 September 2026

- All 33 visible lessons now expose prior knowledge, the big idea, the method, a checking habit and the most likely misconception.
- All 656 displayed worked examples now use the lightest suitable format: 7 Simple, 558 State → Work → Conclude and 91 CLEAR. Every example retains a valid generator structure link.
- The eight newly authored KS3 lesson families use bespoke teaching prose rather than a generic lesson template.
- Seven incoherent consolidated lessons were replaced with prerequisite-led journeys: Place Value, Number Properties, Coordinates, Transformations, Statistical Measures, Similarity and Pythagoras and Non-linear Relationships.
- The replacements remove inherited jumps such as volume inside Transformations, network graphs inside Coordinates and money puzzles inside Statistical Measures.
- Structural review reports 33 visible lessons, 164 sections, 656 worked examples and no missing slow-teaching fields or placeholder setup steps.
- Hidden legacy lessons remain available for reuse and save compatibility but are not part of the visible Junior learning path.
- Olympiad content remains separate and unchanged.
- This records implementation. Rendered learner testing and continuing human review remain necessary evidence of the real reading experience.

### Correction from learner review

The shared worked-example wrapper must not borrow an abstract method from a topic or generator family when it does not fit the exact lesson question. Understand, Plan and Check wording follows the example's own steps and uses plain language. Technical vocabulary is acceptable only after it has been explained and when it is needed for that example.

The completed language and solution-format review is recorded in `PRIMARY_JUNIOR_LESSON_LANGUAGE_REVIEW.md`.

### Place Value spot-check correction

- Child-facing worked-example headings are only Example 1 to Example 4. Editorial phrases such as “Change the reading” must not appear as headings.
- A comparison of digit values must calculate the values of the actual digits, not merely the ratio between their columns. The corrected example uses the two 7s in 7.372: 7 ÷ 0.07 = 100.
- The State paragraph preserves the complete question, including decimal values. The lesson audit checks this for every worked example.
- Generic transition toppers such as “We start with...” and “This section grows from...” are removed from every section. Necessary prerequisite connections belong in the mathematical teaching, not in a generated preamble.
