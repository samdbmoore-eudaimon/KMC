# Primary learning progression memory

Last updated: 31 August 2026

## Purpose

This file records the agreed intent for the Primary learning, lesson and question-generator system. Read it before changing Primary lessons, generators, Practice question selection or Mock Test question selection.

The detailed implementation brief is in `PRIMARY_LEARNING_BUILD_PROMPT.md`. The baseline audit is in `PRIMARY_LEARNING_PROGRESSION_AUDIT.md`. The agreed low-complexity topic order, metadata convention and six-batch sequence are in `PRIMARY_BUILD_FOUNDATION.md`.

## Product intent

Primary should provide a clear game progression from accessible questions to demanding questions. Difficulty 1-4 represents increasing game difficulty, not a fixed mapping to school years.

Children should learn the underlying mathematics rather than memorise one familiar question form. Each topic should therefore expose the same mathematical ideas through varied language, settings, representations and reasoning routes.

## Editorial truth and acceptance standard

The 31 August structural migration did not complete the Primary teaching experience. It removed placeholders, expanded the catalogue and linked lesson examples to generators, but many explanations remain too compressed for a ten-year-old learning independently.

Primary is approved topic by topic only after a human reader-experience review. Four examples, valid IDs, generator coverage and passing tests are necessary but never sufficient. The reviewer must assume the child does not yet understand the topic and ask whether the lesson patiently creates that understanding without an adult supplying missing reasoning.

Every section must connect prior knowledge to one new idea, explain what that idea means, show how to recognise it in a question, justify the chosen method, expose every intermediate step, check the result and name the likely mistake. Worked examples should read like calm tutoring, not an answer key.

## Agreed difficulty model

- D1: direct and accessible, with one main idea and generous clarity.
- D2: a modest extra step, a less familiar presentation or a changed unknown.
- D3: multi-step application, information selection or a less obvious reasoning route.
- D4: confident transfer, reverse reasoning, interacting ideas or legitimate stretch.
- A formulation may span multiple difficulties only when it genuinely develops. Harder versions should change more than the numbers: they may change the information supplied, the unknown, number of steps, representation and reasoning demand.
- Some D4 content may extend beyond the statutory KS2 core. It must be taught and should be identified as stretch where appropriate.

## Agreed formulation model

- Aim for at least five verbal/context families at each difficulty wherever the topic reasonably allows.
- Ideally, the five families use five different real-world or Ninefold Orchard settings and invite five different reasoning routes.
- A family may rotate several surface contexts rather than creating a separate registry entry for every reskin.
- Merely changing numbers, character names or decorative nouns is not structural variety.
- Geometry, trigonometric-style, formal-method and diagram-dependent topics may support fewer natural variants. Use judgement and document justified exceptions.
- Target question mix across a sufficiently large sample:
  - about one half contextual story questions;
  - about one third diagram or visual-representation questions;
  - about one sixth concise, straightforward mathematical questions.
- Diagram-dependent topics may exceed the diagram proportion.
- Context should use the Ninefold Orchard world and its character names while retaining UK English, UK conventions and broad international intelligibility.

## Lessons

- Every existing and new topic needs a well-written lesson.
- Each lesson section must contain four complete worked examples.
- Examples should increase in difficulty, normally moving towards D1-D4 where appropriate.
- Early foundational sections may reasonably concentrate on D1-D2. Do not force an advanced example where the concept has not yet been taught.
- Each example must contain a full question, verbose worked steps and a clear answer.
- Worked solutions use the lightest suitable reasoning scaffold. Direct counting, naming and recognition use a short Think, Work, Answer and Check. Intermediate calculations use State → Work → Conclude. Hard multi-step, proof, case, optimisation or unfamiliar formula work uses CLEAR: Comprehend → Link the facts → Explain the route → Apply it carefully → Review and conclude.
- These habits prepare children for Olympiad-style thinking without turning ordinary D1-D4 examples into Olympiad questions. Formal scaffolds must not make a simple question harder to read.
- Difficulty labels do not need to be shown to the pupil in lesson prose.
- Each worked example must carry the relevant generator `structureId` or structure-family ID so lesson-generator coverage is auditable.
- Lessons should teach representative structures from every difficulty, not necessarily every individual context variant.
- Existing prose should be preserved when it is genuinely useful. Generic placeholders and weak material should be replaced.
- Lessons may build deliberately on earlier topics. When they do, add an explicit prerequisite link or reference. For example, counting through zero may remain in Place Value if Negative Numbers is earlier in the ordered curriculum and the dependency is made clear.
- A lesson may develop related mathematics beyond its narrow title when that progression is intentional, taught and linked clearly.

## Curriculum scope

- Retain all existing Primary topics, including Logic Puzzles, Counting Possibilities and Spatial Puzzles.
- Retain useful enrichment and reasonable D4 stretch.
- Add missing KS2 areas, including at least:
  - standalone addition and subtraction;
  - percentages;
  - statistics, including tables, line graphs, pie charts and mean where age-appropriate;
  - clearer volume and capacity problem solving;
  - clearer decimal calculation progression;
  - coherent fraction multiplication and division coverage;
  - Roman numerals;
  - a coherent four-operations problem-solving progression.
- New topics need an appropriate numbered position in the Primary learning order, a lesson, concepts metadata, generators, structure metadata and tests.
- All topics should map either to statutory KS2 mathematics or to clearly described mathematical-reasoning enrichment.

## Practice and Mock Tests

- Practice progression is driven by correct answers in each topic: ten credited correct answers increase that topic's level by one.
- Repetition in Practice is expected and helpful. Across each level, pupils should encounter the available formulation families rather than one family dominating.
- Mock Tests must not repeat a question formulation within the same paper where a non-repeating eligible alternative exists.
- Mock Tests must continue to request questions from the difficulty appropriate to the mock level.
- Do not weaken or bypass the existing four-band progression.

## Audit and quality requirements

- Automated checks must verify:
  - every topic generates successfully at D1-D4;
  - each declared formulation family is reachable at every supported difficulty;
  - at least five families exist per difficulty, except documented constrained-topic exceptions;
  - options are five, distinct and correctly indexed;
  - solution data is valid and complete;
  - every lesson section has four real examples;
  - placeholder prompts are absent;
  - lesson examples reference valid structure IDs;
  - every difficulty has representative lesson coverage;
  - Practice sampling is reasonably balanced;
  - Mock Tests avoid formulation repetition;
  - normalised question skeletons reveal accidental cosmetic duplicates.
- Automated tests cannot approve writing quality. Produce an editorial sample report showing questions from every topic, difficulty and formulation family.
- Manually review mathematical correctness, reading clarity, progression, context quality and correspondence with the lesson.

## Delivery process

- Work in batches of five topics.
- For each batch: audit, design, implement, run focused checks, generate the editorial sample report and review the batch before starting the next five.
- Preserve unrelated working-tree changes.
- Completion requires all of the following:
  - generators and lessons implemented;
  - curriculum mapping completed;
  - automated checks passing;
  - samples from every topic/difficulty/formulation reviewed;
  - all three generator sanity suites passing;
  - the offline HTML rebuilt successfully;
  - relevant app flows verified without regressions.

## Baseline findings from the 31 August 2026 audit

- 26 Primary generators exist and all generate at D1-D4.
- 25 matching lessons exist; Negative Numbers has no lesson.
- All generator registries currently declare at least five structures per difficulty, but many structures are mathematical/procedural variants rather than strong verbal/context families.
- Ten lessons have four genuine examples in every section.
- Four lessons need moderate repair.
- Eleven lessons contain substantial generic placeholder examples.
- The current strongest contextual generators are Division & Remainders, Area & Perimeter, Time & Calendar, Logic Puzzles, Counting Possibilities and Spatial Puzzles.
- The most procedural generators include Times Tables, Adding Fractions, Decimals, More Than vs Times As Many, Mental Maths Shortcuts, Column Multiplication and Long Division.
- Lesson-generator alignment is currently implicit because examples do not carry structure IDs.
- Several D4 structures need explicit stretch treatment.

## Important guardrail

Do not respond to the variety requirement by indefinitely multiplying narrow mathematical micro-structures. Prefer a small, comprehensible family system in which each family can produce several high-quality settings and can develop meaningfully through difficulty bands. The goal is pupil transfer and learning progression, not the largest possible registry.

## Slow-teaching implementation checkpoint: 1 September 2026

- All 30 visible lessons now expose the learner journey in the lesson itself: prior knowledge, big idea, method, checking habit and tempting misconception.
- All 948 displayed worked examples now use the lightest suitable format: 52 Simple, 775 State → Work → Conclude and 121 CLEAR.
- Every section still has four examples and every example keeps its generator structure link.
- Existing long-form Primary teaching was preserved. The terse Negative Numbers, Addition and Subtraction and Four Operations sections were deepened with child-facing explanations and conceptual bridges. Percentages and Statistics were separately expanded from their earlier summary form.
- Structural review reports 30 lessons, 237 sections, 948 worked examples, no missing teaching fields and no placeholder setup steps.
- This records implementation, not proof that every child will learn unaided. A rendered learner playtest and continuing human editorial sampling remain valid quality checks.

### Correction from learner review

The first slow-teaching wrapper was too abstract in worked examples. It sometimes described the whole topic rather than the exact question and introduced jargon into simple examples. The wrapper must follow the example's own authored steps. Simple questions use short, concrete language. Example-specific wording takes priority over uniform length or a repeated template.

The completed language and solution-format review is recorded in `PRIMARY_JUNIOR_LESSON_LANGUAGE_REVIEW.md`.

Child-facing worked-example headings are always Example 1 to Example 4. Descriptions such as “Secure the meaning” or “Change the reading” are author planning notes only and must not appear in the lesson screen. State must preserve every fact in the complete question, including decimal values.

Do not display generated section transition toppers. Phrases such as “We start with...” and “This section grows from...” add no teaching unless the connection is explained concretely in the lesson body.

## Build checkpoint

- All six batches and all 30 ordered Primary topics are structurally migrated.
- Percentages, Statistics, Four Operations Problems and Addition & Subtraction were added as new curriculum topics.
- Negative Numbers received its missing lesson; Place Value now includes Roman numerals.
- Every lesson section has four examples and every example links to a valid generator family, but this does not constitute editorial approval.
- The strict progression audit and all three generator regression suites pass.
- The final editorial evidence report is `PRIMARY_EDITORIAL_REPORT.md`.
- A new slow-teaching editorial pass is required across all 30 topics. The report's automated `PASS` labels refer to structural tolerances, not the experience of a first-time learner.
