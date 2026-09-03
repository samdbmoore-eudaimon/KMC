# Primary build foundation

Date: 31 August 2026

Status: proposed implementation baseline for the six five-topic batches.

## Baseline

- The working tree contains substantial pre-existing changes and must be preserved.
- The existing Primary generator sanity suite passes: 522,012 checks, 0 failures.
- There are 26 current Primary topics and 25 lessons.
- The new progression audit sampled 24,960 generated questions.
- Every current topic declares at least five structures at D1-D4.
- No generated question currently exposes `variantId` or `representation` metadata.
- No lesson example currently links to a generator `structureId`.
- Negative Numbers has no lesson.
- The audit found 42 actionable structural findings, principally lesson placeholders and missing lesson-to-generator links.

Run the reusable baseline audit with:

```bash
node scripts/audit_primary_progression.cjs
```

Use `--json` for machine-readable output. Use `--strict` only after a batch has been migrated to the new requirements; strict mode intentionally fails against the current baseline.

## Minimum topic expansion

Add four topics rather than creating a separate topic for every uncovered curriculum detail:

1. `additionSubtraction`: mental and written addition/subtraction, inverse checking and contextual interpretation.
2. `fourOperationsProblems`: choosing and combining operations in non-routine, multi-step problems.
3. `percentages`: percentages as parts of 100, fraction/decimal equivalence, percentage of amounts and reverse/comparison problems.
4. `statistics`: tables, pictograms, bar charts, line graphs, pie charts and age-appropriate mean problems.

Extend existing topics:

- Roman numerals within Place Value.
- Volume and capacity within Units & Measures, with connections to Area & Perimeter where spatial measurement is needed.
- Decimal addition, subtraction and problem solving within Decimals.
- Age-appropriate multiplication and division of fractions within the Fractions progression, with the lesson title/scope made accurate.

This produces 30 topics: exactly six implementation batches of five.

## Proposed ordered curriculum

| Order | Topic key | Label | Curriculum role | Main prerequisite |
|---:|---|---|---|---|
| 1 | `negativeNumbers` | Negative Numbers | Core | none |
| 2 | `placeValue` | Place Value | Core | Negative Numbers for counting through zero |
| 3 | `roundingEstimate` | Rounding & Estimating | Core | Place Value |
| 4 | `additionSubtraction` | Addition & Subtraction | Core, new | Place Value, Negative Numbers |
| 5 | `compensationMentalMaths` | Mental Maths Shortcuts | Core | Place Value, Rounding, Addition & Subtraction |
| 6 | `timesTablesFacts` | Times Tables | Core | Place Value |
| 7 | `factorsMultiplesPrimes` | Factors & Multiples | Core | Times Tables |
| 8 | `formalMultiplication` | Column Multiplication | Core | Times Tables, Place Value, Mental Maths |
| 9 | `divisionRemainders` | Division & Remainders | Core | Times Tables |
| 10 | `formalDivision` | Long Division | Core | Division & Remainders, Times Tables, Place Value |
| 11 | `fourOperationsProblems` | Four Operations Problems | Core, new | Addition & Subtraction, Multiplication, Division |
| 12 | `fractionOfQuantity` | Fraction of an Amount | Core | Division & Remainders, Times Tables |
| 13 | `fractionEquivalence` | Equivalent Fractions | Core | Fraction of an Amount, Factors & Multiples |
| 14 | `fractionArithmetic` | Fraction Calculations | Core | Equivalent Fractions |
| 15 | `decimalPlaceValue` | Decimals & Decimal Calculations | Core | Place Value, Equivalent Fractions, Addition & Subtraction |
| 16 | `percentages` | Percentages | Core, new | Equivalent Fractions, Decimals, Fraction of an Amount |
| 17 | `ratioBasics` | Ratio | Core | Factors & Multiples, Fraction of an Amount |
| 18 | `twoUnknowns` | Two Mystery Numbers | Core/algebra | Mental Maths, Division & Remainders |
| 19 | `additiveMultiplicative` | More Than vs Times As Many | Core | Addition & Subtraction, Ratio, Mental Maths |
| 20 | `unitConversion` | Units, Volume & Capacity | Core | Place Value, Decimals |
| 21 | `areaPerimeter` | Area & Perimeter | Core | Multiplication, Units & Measures |
| 22 | `timeCalendar` | Time & Calendar | Core | Addition & Subtraction, Division & Remainders |
| 23 | `statistics` | Statistics | Core, new | Four Operations, Fractions, Decimals, Percentages |
| 24 | `shapeProperties` | Shape Properties | Core | Place Value |
| 25 | `angleBasics` | Angles | Core with D4 stretch | Shape Properties |
| 26 | `symmetryReflection` | Symmetry | Core with D4 stretch | Shape Properties, Angles |
| 27 | `sequencePattern` | Patterns & Sequences | Core with D4 stretch | Division & Remainders, Times Tables |
| 28 | `logicGrid` | Logic Puzzles | Enrichment | none |
| 29 | `combinatoricsCounting` | Counting Possibilities | Enrichment | Times Tables, Logic Puzzles |
| 30 | `spatialPuzzles` | Spatial Puzzles | Enrichment | Shape Properties, Symmetry |

## Six five-topic batches

### Batch 1: number foundations

1. Negative Numbers
2. Place Value
3. Rounding & Estimating
4. Addition & Subtraction
5. Mental Maths Shortcuts

This batch establishes the metadata conventions, writes the missing Negative Numbers lesson and creates the first new topic. It also proves that intentional prerequisite reuse works.

### Batch 2: multiplication and division

6. Times Tables
7. Factors & Multiples
8. Column Multiplication
9. Division & Remainders
10. Long Division

This batch focuses on adding meaningful contexts to procedural topics while preserving the particularly strong remainder work.

### Batch 3: operations and fractions

11. Four Operations Problems
12. Fraction of an Amount
13. Equivalent Fractions
14. Fraction Calculations
15. Decimals & Decimal Calculations

This batch creates the explicit transfer/problem-selection topic and resolves the current fraction lesson/generator scope mismatch.

### Batch 4: proportional reasoning and measures

16. Percentages
17. Ratio
18. Two Mystery Numbers
19. More Than vs Times As Many
20. Units, Volume & Capacity

This batch creates Percentages and repairs several placeholder-heavy lessons.

### Batch 5: applied data and geometry

21. Area & Perimeter
22. Time & Calendar
23. Statistics
24. Shape Properties
25. Angles

This batch creates Statistics and repairs the lesson with the largest detected placeholder count.

### Batch 6: transformations and enrichment

26. Symmetry
27. Patterns & Sequences
28. Logic Puzzles
29. Counting Possibilities
30. Spatial Puzzles

This batch completes enrichment and makes stretch boundaries explicit.

## Minimal metadata convention

Do not replace the current registry system. Extend it incrementally.

### Generated question

```js
{
  q,
  options,
  correctIndex,
  solution,
  structureId: "remaining_amount",
  variantId: "football_time",
  representation: "story",
  stretch: false,
}
```

- `structureId`: stable formulation/reasoning family.
- `variantId`: rotating verbal setting or template within the family.
- `representation`: `story`, `diagram` or `direct`.
- `stretch`: optional; true only for explicitly taught extension content.

### Registry entry

Keep existing `difficulties` and `build`. Add metadata only where it provides audit value:

```js
remaining_amount: {
  difficulties: [1, 2, 3, 4],
  curriculum: "addition and subtraction problem solving",
  contexts: ["football_time", "journey_distance", "orchard_baskets", "water_capacity", "score_gap"],
  build(difficulty) { /* rotate contexts and increase reasoning demand */ },
}
```

Constrained-topic exceptions may declare:

```js
varietyException: "A formal written-method question has limited useful diagram and story forms."
```

The audit should require a real explanation, not merely the presence of the field.

### Lesson example

```js
{
  q: "...",
  steps: ["...", "...", "..."],
  answer: "...",
  structureId: "remaining_amount",
}
```

Difficulty metadata may be added internally when useful, but it should not be displayed to pupils.

## Audit-tool migration strategy

`scripts/audit_primary_progression.cjs` begins as a non-blocking baseline reporter. During each batch:

1. add structure links to the five lessons;
2. add variant and representation metadata to the five generators;
3. remove placeholders from the five lessons;
4. add any justified constrained-topic exception;
5. extend the audit to enforce strict compliance for migrated topics only;
6. generate a compact editorial sample report for those five topics.

After batch 6, `--strict` becomes the required all-Primary gate.

## Complexity controls

- Reuse existing mathematical builders and distractor logic.
- Put rotating contexts in small data tables rather than duplicating generator functions.
- Preserve strong lessons and questions.
- Replace only demonstrated gaps.
- Generate one canonical editorial sample per family/difficulty plus extra automatic collision samples.
- Do not print thousands of samples into a review document.
- Do not add a new topic when an existing topic can absorb the material coherently.
- Do not add dependencies.
- Do not perform another mass rewrite of the three large generator files.
