# Build prompt: Primary and Junior slow-teaching editorial rewrite

Work locally in `C:\Users\samdb\UKMT App`.

## Read first

1. `AGENTS.md`
2. `LEARNING_MODULE_REQUIREMENTS.md`
3. `PRIMARY_LEARNING_MEMORY.md`
4. `JUNIOR_LEARNING_MEMORY.md`
5. the relevant lesson file and generator registry for the topic being edited
6. the `RichLesson` renderer in `KangarooMathsQuest.jsx`

Do not rerun curriculum research. Preserve the existing Primary KS2 and Junior KS3 catalogues, structure registries, progress migration and mock-selection rules. Do not alter any Olympiad pathway in this editorial workstream.

## Objective

Rewrite every visible Primary and Junior lesson so that a ten-year-old encountering the topic for the first time can learn it independently and calmly.

This is a teaching and reading task. It is not a schema-filling task. Four examples, valid IDs, long prose, generated metadata and passing tests cannot by themselves make a lesson successful.

The finished experience should feel like a patient expert sitting beside the learner:

- beginning with something already understood;
- naming the new idea in plain language;
- using a concrete or visual model before a compressed rule;
- showing how to recognise the idea in a question;
- explaining why a method fits;
- carrying out every inference without hidden jumps;
- checking and interpreting the answer;
- warning about the tempting wrong turn;
- gradually removing support as examples become less familiar.

## The reader to design for

Assume the learner:

- is ten years old;
- is willing but may be anxious about mathematics;
- can read ordinary conversational English but may not know technical vocabulary;
- may have forgotten a prerequisite despite having seen it before;
- will take literal instructions seriously;
- cannot ask an adult what an unexplained step means;
- benefits from seeing the purpose of a calculation before seeing its symbols;
- needs a visible bridge between a lesson example and a differently worded practice question.

Never use a child's confusion as evidence that the child is not ready. First ask whether the explanation skipped a relationship, changed representation too quickly or used a word before making it meaningful.

## Required lesson journey

Each lesson must have a deliberate narrative rather than a collection of sections.

### Opening

Explain:

1. what earlier knowledge this lesson uses;
2. why the new idea is useful;
3. the central meaning in ordinary language;
4. what the learner will be able to do by the end.

Prerequisite links must be accurate and earlier in the learning order. A link does not replace a brief reminder of the prerequisite inside the lesson.

### Sections

Each section should add one manageable idea. Where a connection to an earlier idea matters, explain it naturally within the teaching. Introduce notation only after its meaning is clear.

Do not display a generic transition paragraph above the section, such as “This section grows from...” or “We start with...”. Make any necessary connection inside the actual mathematical explanation, where it can be concrete and useful.

Use several of the following where appropriate:

- objects, groups, lengths, money, time or movement;
- number lines, bar models, arrays, grids, tables or diagrams;
- a comparison between two cases;
- a deliberately wrong idea followed by a careful correction;
- a sentence frame that helps translate words into mathematics;
- a short verbal check before calculation;
- an explanation of units and what the final number represents.

Do not overload a section merely to make it look substantial. Slow teaching means controlled conceptual steps, not large walls of prose.

### Four worked examples

Keep exactly four examples per section because the interface and coverage tools expect them, but give each example a pedagogical job:

1. **Secure the meaning:** direct, concrete and fully supported.
2. **Use the method:** a familiar application with the method made explicit.
3. **Change the reading:** a different representation, unknown or context that requires recognition.
4. **Transfer and reason:** a multi-step, reverse, comparative or unfamiliar application using only ideas already taught.

These descriptions are for authors only. The child-facing headings must be exactly Example 1, Example 2, Example 3 and Example 4.

Early foundation sections may use four carefully varied D1-D2 examples. Never insert premature difficulty merely to occupy the fourth position.

Every example must contain:

- a complete question;
- an `understand` explanation identifying the known information and the required result;
- a `plan` explaining why the chosen mathematical relationship applies;
- small worked steps with no concealed arithmetic or logical transition;
- a clearly worded answer with units or interpretation;
- a `check` the child could genuinely repeat;
- a valid `structureId` linking it to practice;
- a difficulty or teaching-stage value where the lesson data supports it.

The renderer may show Understand, Plan, Work and Check separately. Do not fill those headings with interchangeable boilerplate. Each statement must refer to the mathematics of that example.

Choose the solution format by the reasoning actually required:

- use a short Think, Work, Answer and Check for genuinely simple counting, naming, reading or recognition;
- use **State → Work → Conclude** for intermediate calculations and short reasoning chains;
- use **CLEAR** for hard multi-step, proof, case, optimisation or unfamiliar formula questions. CLEAR means **Comprehend → Link the facts → Explain the route → Apply it carefully → Review and conclude**.

Do not force formal headings onto a simple question. Do not use CLEAR as decorative boilerplate: every stage must say something useful about the exact problem.

## Worked-solution writing rules

Prefer:

> We know the whole journey is 120 km and 85 km has already been travelled. The unknown is the part still left. A completed part plus a remaining part makes the whole, so subtraction will recover the missing part.

Then show the subtraction, explain any regrouping and check that completed distance plus remaining distance returns to 120 km.

Reject:

> 120 - 85 = 35.

Also reject padded boilerplate such as:

> Understand the question. Choose subtraction. Calculate carefully. Check your answer.

The explanation must name why subtraction represents this particular relationship.

Use complete, friendly sentences. Explain equals signs as relationships rather than using them as punctuation. When a written algorithm is taught, describe what is regrouped or exchanged and why. When a formula is used, connect each symbol to the object or measurement in the question.

## Progression

Across sections and examples, support should fade while reasoning demand grows:

- concrete object or visual model;
- spoken relationship;
- diagram or organised representation;
- calculation and notation;
- changed unknown;
- connected steps;
- unfamiliar wording;
- justification, comparison or reverse construction.

Harder examples must remain teachable from the lesson. Larger numbers and longer sentences do not create meaningful difficulty.

For Junior, explicitly bridge the ordinary KS3 form to JMC and Junior Kangaroo disguise. State which relationship remains unchanged when the context or representation changes.

## Relationship with question structures

Use registered structures to ensure that teaching transfers into Practice, but write lessons in conceptual order rather than registry order.

The child should meet representative direct, story and diagram forms. Explain the common mathematical relationship connecting them. A structure ID is invisible implementation metadata and must never substitute for that explanation.

Do not create cosmetic examples whose only difference is a character name or number. Different examples should alter the reading task, model, unknown, representation or reasoning route.

## Topic review procedure

For each topic:

1. Read the lesson from beginning to end in displayed order.
2. State the precise knowledge assumed at the start.
3. Identify the single conceptual gain in every section.
4. Remove duplicated explanations and unexplained jumps.
5. Rewrite all terse or answer-key-style worked solutions.
6. Check that examples 1-4 have distinct teaching jobs.
7. Compare examples with live D1-D4 practice questions from the linked structures.
8. Read the prose aloud for sentence length, warmth and clarity.
9. Check vocabulary, notation, units and diagrams.
10. Record a human editorial judgement: approved, needs revision or blocked by a mathematical/content defect.

Do not approve a topic merely because a script reports zero findings.

## Automated review support

Automated tools should flag, without automatically failing or passing pedagogy:

- examples with fewer than three substantive worked steps;
- missing Understand, Plan or Check content;
- very short worked explanations;
- identical or near-identical explanation text;
- repeated question skeletons;
- undefined technical vocabulary;
- examples whose difficulty rises only through number size;
- a prerequisite ordered after the lesson;
- missing structure links;
- sections with other than four examples;
- generated questions not represented in teaching.

Continue to run generator sanity suites, curriculum audits and the offline rebuild. These protect functionality only.

## Completion gate

The Primary and Junior rewrite is complete only when:

- all 30 visible Primary lessons and all 33 visible Junior lessons have been reviewed in displayed order;
- every topic has an explicit prior-knowledge bridge and coherent section progression;
- every displayed worked example contains example-specific Understand, Plan, Work and Check teaching;
- terse one-line answer-key solutions have been removed;
- representative lesson-to-practice transfer has been manually checked;
- the learner-experience audit contains a topic-by-topic human judgement rather than only counts;
- Primary, Junior and Intermediate generator regressions pass;
- the offline and Capacitor HTML files rebuild successfully;
- Olympiad content remains unchanged.

When reporting completion, distinguish structural validation, editorial review and rendered-app verification. Never call the lessons complete if only the first has passed.

## Worked-example plain-language rule

Judge every Understand, Plan and Check paragraph against the exact question beside it. Never generate these paragraphs from a broad topic summary when the particular question uses a narrower idea. A question about counting the digits in 47 must talk about the two written symbols 4 and 7, not about recombining place-value parts.

Use a technical word only when the lesson has already explained it and the word helps with this exact example. Prefer “the number we divide by” to “divisor” during a first encounter, and prefer “put the parts back together” to “recompose”. Easy examples should remain easy to read. Verbosity is not a substitute for teaching.

The check must tell the learner what to do in ordinary language. Do not use abstract compliance phrases such as “satisfy the conditions”, “interpret the result in the original setting” or “the proposed answer must satisfy the check”.

## Current implementation state: 1 September 2026

The shared slow-teaching presentation and editorial data model has now been applied to all visible Primary and Junior lessons. The known terse Primary sections have been deepened. The known incoherent Junior consolidated lessons have been replaced with coherent curriculum journeys. Continue to use this prompt as the acceptance standard: passing counts and tests must never substitute for reading the displayed lesson as a first-time ten-year-old learner.
