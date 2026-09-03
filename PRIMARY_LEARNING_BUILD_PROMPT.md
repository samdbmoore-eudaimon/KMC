# Build prompt: Primary learning progression, lesson alignment and verbal variety

> Status note, 1 September 2026: the structural migration described below has been completed. It did not constitute a full reader-centred rewrite. For the current Primary and Junior slow-teaching pass, use `PRIMARY_JUNIOR_SLOW_TEACHING_BUILD_PROMPT.md` as the controlling prompt. Where the two prompts differ, the slow-teaching prompt takes precedence.

Work locally in `C:\Users\samdb\UKMT App`.

Read these files before making changes:

1. `AGENTS.md`
2. `PRIMARY_LEARNING_MEMORY.md`
3. `PRIMARY_LEARNING_PROGRESSION_AUDIT.md`
4. `content/primary-lessons.js`
5. `generators/primary-generators.js`
6. `generators/gen-shared.js`
7. `scripts/gen_sanity_test_primary.cjs`
8. the Practice and Mock Test question-selection code in `KangarooMathsQuest.jsx`

Read only the relevant portions of the large lesson and generator files for the current batch. Preserve all unrelated work already present in the working tree.

## Objective

Build a coherent Primary learning system in which:

- every topic has a well-written lesson;
- each lesson section contains four genuine, progressively demanding worked examples;
- every generator offers four clear game difficulty bands;
- each difficulty normally offers at least five recognisably different verbal/context families;
- questions teach transfer of mathematical understanding rather than recognition of one repeated prompt;
- lessons explicitly prepare pupils for representative generator families at every difficulty;
- Practice gives useful repetition and progression;
- Mock Tests use the correct difficulty and do not repeat formulations within a paper;
- every topic has a defensible KS2 or labelled-enrichment curriculum position;
- all output remains original, offline, deterministic to mark and compatible with the existing app.

Difficulty 1-4 is game progression, not a rigid school-year mapping.

## Non-negotiable interpretation of “structure”

Treat a structure as a formulation family that changes how a child must read, model or reason about a problem. A good family may vary:

- real-world or Ninefold Orchard setting;
- representation, such as prose, diagram, table, number line or symbolic form;
- known and unknown quantities;
- order in which information must be used;
- number of reasoning steps;
- forward, reverse, comparison, error-spotting or decision-making route.

Changing only numbers, names or decorative wording does not create a new family.

Do not create twenty tiny mathematical registries merely to inflate a count. Prefer a comprehensible set of formulation families, each capable of rotating several natural contexts and, where appropriate, developing across more than one difficulty.

A family may support multiple difficulties only if its harder versions genuinely become harder. Across D1-D4, change the numbers, supplied information, unknown, representation, number of steps and reasoning demand as appropriate. Straight reuse with larger numbers is insufficient.

Aim for five families at every difficulty. A geometry, formal-method or diagram-dependent topic may have fewer only when five would be artificial. Record every exception with a concise pedagogical reason and compensate with strong internal variation where possible.

## Target question mix

Across a large sample of each topic and difficulty, aim for:

- approximately 50% contextual story questions;
- approximately 33% diagram or visual-representation questions;
- approximately 17% concise mathematical questions.

Diagram-dependent topics may use more diagrams. Do not force diagrams where they add no mathematical value.

Use Ninefold Orchard settings and established Primary character names. Retain UK English, UK mathematical conventions and UK currency/units where relevant, while keeping situations intelligible internationally. Avoid references requiring current events, commercial brands or specialist cultural knowledge.

Contexts must matter mathematically. Replacing “apples” with “lanterns” while leaving an identical sentence skeleton is a cosmetic reskin, not useful variety.

## Four difficulty bands

Apply these principles consistently within every topic:

### Difficulty 1

- one main idea;
- direct language and all necessary information supplied;
- small or friendly values;
- a clear representation;
- minimal decision-making.

### Difficulty 2

- one extra inference or step;
- a changed unknown or less familiar presentation;
- modest distractor information;
- straightforward transfer into a new setting.

### Difficulty 3

- multi-step application;
- selecting relevant information;
- combining related ideas;
- reverse reasoning, comparison or interpretation;
- less immediately obvious modelling.

### Difficulty 4

- confident transfer to unfamiliar wording or representation;
- several linked steps;
- incomplete or indirect information;
- justification, diagnosis or reverse construction;
- legitimate enrichment or stretch where it is taught and clearly identified.

Difficulty should come from reasoning, not merely bigger arithmetic.

## Lesson requirements

Every topic must have a matching lesson. Create the missing Negative Numbers lesson.

Every lesson section must contain exactly four real worked examples. Replace generic placeholders such as:

- “Begin with the idea...”
- “What should we notice before trying to calculate?”
- “How does the method grow from that first idea?”
- generic requests to explain a heading without a concrete mathematical task.

Preserve existing prose and examples when they are clear, correct and useful. Rewrite only what needs rewriting, but do not retain weak material merely to minimise the diff.

Examples should become progressively harder. Where pedagogically appropriate, use D1, D2, D3 and D4 examples in that order. Early foundational sections may reasonably remain within D1-D2 until later sections introduce harder reasoning. Never force a D4 example before the lesson has taught the necessary idea.

Every example must include:

```js
{
  q: "...",
  steps: ["...", "...", "..."],
  answer: "...",
  structureId: "family_id"
}
```

If a structure family has difficulty-specific expansions, use a stable family ID and, if helpful, add non-displayed metadata such as `difficulty: 2` or `variantId`. Do not expose internal labels to pupils.

Worked solutions should follow the Olympiad method in age-appropriate prose:

1. understand what is known and what must be found;
2. identify the mathematical idea;
3. choose and explain a plan;
4. execute every step without hidden jumps;
5. state the answer clearly;
6. check or interpret the result where useful.

Use verbose clarity rather than terse answer-key arithmetic. Keep the reading level appropriate for Primary pupils.

Lessons need representative coverage from every difficulty and every important family, but do not need to reproduce every rotating context. Attach valid structure IDs to examples so coverage is testable.

Where a topic builds on another topic, add explicit prerequisite metadata or a clear lesson reference. Cross-topic development is welcome. For example, counting through zero may appear later in Place Value if Negative Numbers occurs earlier and the dependency is made explicit.

Related content may remain in a broader lesson when it creates a coherent progression. Make the relationship clear and ensure the relevant generator coverage exists.

## Curriculum requirements

Map every topic and structure family to one of:

- a statutory KS2 content statement;
- a KS2 mathematical fluency, reasoning or problem-solving aim;
- explicitly labelled enrichment/stretch.

Retain Logic Puzzles, Counting Possibilities and Spatial Puzzles.

Retain well-taught D4 stretch. Do not quietly present KS3-style material as ordinary KS2 content. Mark it in metadata and teach it before testing it.

Add missing Primary topics or clearly separated topic strands for:

- addition and subtraction;
- percentages;
- statistics, including appropriate work with tables, line graphs, pie charts and mean;
- volume and capacity problem solving;
- decimal calculations beyond place value alone;
- fraction multiplication and division at an appropriate Primary level;
- Roman numerals;
- coherent four-operations problem solving.

Place new topics at sensible numbered positions in the Primary learning order. Each new topic needs:

- topic metadata;
- concepts metadata;
- a complete lesson;
- generator families at D1-D4;
- boss/mock/practice compatibility where relevant;
- curriculum mapping;
- sanity and editorial coverage.

First audit existing coverage carefully so the new topics do not duplicate material that should instead be reorganised or made visible.

## Generator design

Use a consistent, auditable registry. Recommended conceptual shape:

```js
const TOPIC_STRUCTURES = {
  remaining_amount: {
    difficulties: [1, 2, 3, 4],
    curriculum: "KS2 addition and subtraction problem solving",
    stretch: false,
    variants: {
      1: [/* football time, journey distance, orchard baskets, water capacity, score gap */],
      2: [/* harder versions with changed unknowns or an extra inference */],
      3: [/* multi-step or information-selection versions */],
      4: [/* reverse, comparative or unfamiliar-transfer versions */]
    },
    build(difficulty) { /* balanced context rotation */ }
  }
};
```

This is illustrative, not a command to rewrite every existing registry into one exact syntax. Reuse the current `pickStructure` mechanism where it remains clean.

Each generated question must expose enough metadata to audit:

- `structureId` for the formulation family;
- optionally `variantId` for its rotating context/template;
- optionally `representation` with values such as `story`, `diagram` or `direct`;
- optionally `stretch: true` for extension content.

Keep the existing output contract intact: `q`, exactly five options, `correctIndex`, solution data and optional `svg`. Additional metadata must not break Practice, Lessons, Boss Battles, Mock Tests or the offline build.

Balance selection so that:

- no eligible family dominates without a documented pedagogical reason;
- context variants within a family rotate reasonably;
- Practice can repeat a family across a level because repetition supports learning;
- a pupil answering ten questions to advance a topic level has a strong chance of meeting the breadth available at that difficulty.

## Practice behaviour

Preserve the per-topic progression rule: ten credited correct answers advance that topic by one game level.

Practice repetition is expected. However, avoid serving one family repeatedly while other eligible families remain unseen. Consider lightweight recent-family tracking or balanced sampling if the existing random selector cannot achieve this reliably.

Do not block a useful revisit across a level. The aim is distributed practice, not perfect uniqueness.

## Mock Test behaviour

Preserve the existing level-to-difficulty ladder unless a verified bug requires correction and is reported before changing it.

Within one paper:

- do not repeat the same exact question;
- do not repeat the same normalised wording template;
- do not repeat a formulation family while another eligible family for that topic and difficulty remains unused;
- select only structures eligible for the requested difficulty;
- retain topic breadth and existing paper length/marking behaviour.

If a paper must reuse a family because the eligible pool is exhausted, choose a materially different variant and representation.

## Automated checks

Extend the Primary sanity and audit tooling to verify at least:

1. every generator works repeatedly at D1-D4;
2. every declared family can generate at every declared difficulty;
3. every question includes a valid `structureId`;
4. every declared `variantId`, if used, is reachable;
5. every question has five distinct options and a valid `correctIndex`;
6. solutions contain complete, non-empty worked steps;
7. generated text contains no placeholders, debug fields, `undefined`, `NaN` or filler distractors;
8. at least five families exist per difficulty unless the topic has a documented exception;
9. sampling is reasonably balanced across families and variants;
10. the story/diagram/direct mix is reported and broadly matches the target;
11. every lesson exists;
12. every lesson section contains exactly four genuine examples;
13. every lesson example has a question, worked steps, answer and valid structure ID;
14. representative lesson coverage exists at every difficulty;
15. prerequisite links resolve to earlier topics;
16. normalised question skeleton analysis detects cosmetic duplicates;
17. Mock Test papers contain no avoidable family/template repetition;
18. no invalid-solution or duplicate-question regression is introduced.

Do not pretend that automatic checks prove pedagogical or verbal quality. They provide evidence for human review.

## Editorial sample report

For every completed batch, generate a readable report containing:

- every topic in the batch;
- its lesson sections and linked structure coverage;
- curriculum mapping and prerequisite links;
- structure-family counts by difficulty;
- context/diagram/direct proportions;
- at least one generated sample from every family at every supported difficulty;
- the complete worked solution for each sample;
- any constrained-topic exception;
- any stretch content;
- detected normalised-template collisions;
- a short editorial judgement on clarity, naturalness and progression.

Review every sample for mathematical correctness, reading level, Ninefold Orchard voice, UK English, plausibility of the situation and consistency between question and solution.

## Batch workflow

Work in batches of five topics. Do not launch a mass rewrite of all topics at once.

### Before batch 1

1. Inventory the actual current topics, lesson order, prerequisite possibilities and missing KS2 areas.
2. Propose the revised ordered Primary topic list, including new topics.
3. Define the shared metadata and testing approach.
4. Run the existing Primary sanity suite to establish the baseline.
5. Record the working-tree diff so unrelated changes can be protected.

### For each five-topic batch

1. Audit the five existing lessons and generators against this brief.
2. Write a short design table before editing: families, D1-D4 development, context variants, representations, lesson coverage, curriculum link and stretch status.
3. Reuse sound existing work.
4. Implement lessons and generators.
5. Add or update focused automated checks.
6. Run syntax checks and the Primary sanity suite.
7. Generate and inspect the editorial sample report.
8. Correct all mathematical, wording, progression and alignment problems found.
9. Report the batch results and changed files before proceeding.

Do not begin the next batch until the current batch is internally complete and reviewed.

After each module-level milestone, rerun the Junior and Intermediate sanity suites to catch shared-helper regressions.

## Suggested batch order

Confirm the final topic order before implementation, but begin with the highest-value gaps:

1. Negative Numbers plus the first four missing/core arithmetic topics identified by the curriculum inventory.
2. The remaining new KS2 topics.
3. The lessons with the largest placeholder burden: Angles, Counting Possibilities, then other lessons with 9-12 placeholders.
4. Procedural generators needing contextual variety: Times Tables, Adding Fractions, Decimals, More Than vs Times As Many and Mental Maths Shortcuts.
5. Formal and constrained topics, then the remaining strong topics for alignment metadata and final polish.

The exact batches may change to preserve prerequisite order and reduce overlapping edits.

## Completion criteria

The build is complete only when all of the following are true:

- every retained and new Primary topic has a curriculum position and prerequisite relationship;
- every topic has a complete lesson;
- every lesson section has four genuine progressively demanding examples;
- every lesson example has full worked steps, an answer and a valid structure-family ID;
- every generator has clear D1-D4 progression;
- every difficulty has at least five strong formulation families or a documented justified exception;
- the target mixture of contextual, diagram and direct questions is substantially achieved;
- Practice samples families broadly and supports ten-answer level progression;
- Mock Tests avoid repeat families/templates within a paper where alternatives exist;
- the editorial report covers every topic, difficulty and family;
- every generated sample has been manually reviewed;
- Primary, Junior and Intermediate generator sanity suites pass;
- syntax checks pass;
- the application rebuild succeeds;
- both `KangarooMathsQuest.html` and `www/index.html` are produced;
- representative Practice, Lesson and Mock Test flows are verified;
- no unrelated changes have been overwritten.

Run the repository's prescribed final commands:

```bash
node --check kq-content.js
node scripts/gen_sanity_test_junior.cjs
node scripts/gen_sanity_test_primary.cjs
node scripts/gen_sanity_test_intermediate.cjs
node scripts/rebuild.cjs
```

Add any new audit commands created during the work and include their results in the final report.

## Required final report

Report:

- the final ordered topic list and KS2/enrichment mapping;
- the five-topic batch history;
- lesson completeness and example counts;
- structure-family counts by topic and difficulty;
- verbal-context and representation coverage;
- prerequisite and lesson-generator coverage;
- constrained-topic exceptions;
- D4 stretch content;
- new automated audit coverage;
- manual editorial-review results;
- exact verification and rebuild results;
- any remaining limitations.

## Guardrails

- Use plain JavaScript/JSX and UK English.
- Use no new runtime dependencies.
- Keep all questions original and fully markable offline.
- Do not alter unrelated game systems.
- Do not silently change Mock Test marks, length or difficulty ladder.
- Do not equate passing tests with completed educational review.
- Do not report a batch as complete while placeholder examples, invalid mappings or unreviewed generated families remain.
- Do not optimise for line count or registry size. Optimise for clear learning progression, transfer and maintainability.
