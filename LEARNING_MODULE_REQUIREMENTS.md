# Learning content requirements for all modules

This is the shared build contract for Primary, Junior and Intermediate lessons and question generators. Module-specific curriculum memories and research reports provide the content scope.

## Shared product intention

The game must produce a genuine progression of mathematical learning. Players should learn underlying mathematics and transferable reasoning, not memorise one wording of a recurring question.

The primary acceptance test is the learner experience, not the data shape. Read each lesson as a ten-year-old who is meeting the idea for the first time. A lesson is complete only when that learner can understand where the idea comes from, recognise when to use it, follow every inference and attempt a related problem without an adult filling in hidden steps. Counts, IDs and automated tests are safeguards; they cannot award editorial approval.

Each visible topic must connect:

1. curriculum objective
2. prerequisite knowledge
3. D1-D4 learning progression
4. registered question structures
5. lesson examples using those structures
6. practice questions at the player's topic level
7. mock questions at the paper's level

## Shared lesson requirements

- A well-written lesson for every visible topic.
- Begin from explicitly named prior knowledge. Never assume that a rule, symbol or technical word is already understood merely because it appeared in an earlier school year.
- Introduce one new idea at a time. Explain its meaning with a concrete, visual or familiar model before compressing it into a rule or formula.
- Do not add generic section toppers announcing prior knowledge or saying that a section grows from the previous one. If a prerequisite connection matters, explain it naturally in the mathematical teaching itself.
- Give the learner a reading cue: how to recognise what kind of problem this is and which information matters.
- Explain the choice of method before carrying it out. A calculation without a reason is not a worked explanation.
- Break multi-step reasoning into small, complete inferences. Do not hide regrouping, unit changes, inverse operations, diagram facts or intermediate totals.
- End by checking magnitude, units, constraints or the original story and interpret what the answer means.
- Anticipate the likely misconception at the point where it can occur, then contrast it with the correct idea.
- Build deliberately from secure, concrete examples to changed unknowns, connected representations and unfamiliar applications. Difficulty labels need not be visible to the child.
- Clear conceptual explanations and explicit prerequisite links.
- Exactly four worked examples in every teaching section.
- Label these plainly for the child as Example 1, Example 2, Example 3 and Example 4. Pedagogical roles such as transfer or changed representation are editorial metadata, not child-facing headings.
- Each example has a complete question, fully explained steps and a final answer.
- Use fully explained reasoning where appropriate: state the idea, justify each inference, calculate, check and conclude.
- Draw examples from appropriate D1-D4 levels. Early sections may focus on D1-D2 when that best supports learning.
- Every worked example has a valid generator `structureId`.
- Use some of the same structures in the lesson and generator so the teaching-practice link is real and auditable.
- Preserve existing writing where it is strong and correctly placed; rebuild it where the curriculum home, progression or explanation is wrong.

### Reader-experience rejection tests

Reject or rewrite a lesson when any of these are true:

- the first example begins calculating before the idea has been made meaningful;
- a ten-year-old must already know the rule in order to understand the explanation of the rule;
- steps merely restate symbols, such as `35 ÷ 5 = 7`, without explaining why division is the correct move;
- a new term appears without a plain-language explanation;
- several examples differ only in their numbers while the underlying reading and reasoning are unchanged;
- the lesson jumps from a direct example to a difficult application without a bridging example;
- a check says only that the answer is correct rather than showing how the learner could detect an error;
- prose is long but not instructional: length alone is not slow teaching;
- generic headings such as “Understand”, “Plan” or “Check” contain interchangeable boilerplate rather than mathematics specific to the example;
- the lesson technically has four examples but a first-time learner would still need an adult explanation.
- an Understand, Plan or Check paragraph describes the broad topic or generator family instead of the exact worked question;
- a simple question is made harder by unnecessary mathematical language;
- a technical word appears before it has been taught and before it is needed;
- stock phrases such as “interpret the result in the original setting” or “the proposed answer must satisfy that check” replace a real explanation;
- the explanation is longer than the mathematics but less clear than the original question.

For a simple example, simple language is the correct standard. Slow teaching means that no reasoning jump is hidden. It does not mean surrounding an easy idea with abstract prose.

### Worked-solution formats

Choose the lightest format that makes the reasoning visible. Do not assign a format merely from the example number or difficulty label.

- **Simple:** for counting, naming, reading or recognising when there is no meaningful chain of calculation. Use a short Think, Work, Answer and repeatable Check. Do not force an Olympiad scaffold onto “How many digits?” or a similar direct task.
- **State → Work → Conclude:** for an intermediate calculation or a short chain of reasoning. State what is known and what must be found, show the mathematical work in justified steps, then give a clear conclusion in the words and units of the question.
- **CLEAR:** for harder multi-step reasoning, proof, case analysis, optimisation or unfamiliar formula work. CLEAR means **Comprehend → Link the facts → Explain the route → Apply it carefully → Review and conclude**. Each part must contain mathematics specific to the question.

These are writing habits borrowed from Olympiad problem solving. Their use in ordinary lessons does not move an example into the separate Olympiad pathway.

### Human editorial approval

For every topic, a reviewer must read the lesson in the same order the child sees it and judge:

1. Is the assumed starting knowledge reasonable and linked?
2. Does each section add one manageable piece to the previous section?
3. Is every worked example mathematically and verbally complete?
4. Does the explanation say why, not only what?
5. Are the examples sufficiently different to teach transfer?
6. Is the reading level warm, direct and suitable for a ten-year-old?
7. Could the child explain the central idea in their own words afterwards?

Automated checks may identify likely failures, such as one-step solutions, very short explanations, repeated prose or missing checks. They must report these as review prompts, never convert them into an automatic pedagogical pass.

## Shared generator requirements

- Four genuine difficulty bands, D1-D4.
- At least five distinct structures per difficulty where the topic allows it.
- A structure may span or be extended across difficulties only when the mathematics or reasoning becomes genuinely harder.
- Ideally, different settings also require different reasoning routes.
- Across suitable topics, aim for one half story questions, one third diagram questions and one sixth direct questions. Diagram-dependent topics may depart from this ratio.
- Use UK mathematical terminology, international settings and the module's world flavour and character names.
- Generated questions expose `structureId`, `variantId`, `representation`, `difficulty` and `stretch` metadata.
- Structure definitions record curriculum objective, prerequisites, reasoning route, representation and eligible difficulties.
- Every output includes five distinct options, a correct index and a complete worked solution.
- Changing names and numbers is a variant. It does not create a new structure.

## Shared progression and assessment requirements

- Practice progression is per topic: ten credit-eligible correct answers increase that topic by one level.
- Repetition in practice is expected and each structure should appear at least once per level where practical.
- Mock questions use the difficulty appropriate to the mock level.
- No exact question, variant or structure repeats within one mock unless an explicit paper specification makes repetition necessary.
- Difficulty is mathematical: more decisions, representations, constraints, steps or abstraction. Larger values and longer wording alone do not count.
- D4 may contain appropriate stretch, but the required ideas must be taught or linked through prerequisites.

## Separate Olympiad pathways

- Where a module has Olympiad training, it is a separate stretch pathway with its own lessons, progression, question bank and marking model.
- Olympiad papers may inform that pathway, but their questions and proof demands do not enter regular topic generators, practice sessions or curriculum mocks.
- Regular D4 remains the hardest level of the ordinary curriculum and Challenge or Kangaroo pathway. It is not the first Olympiad level.
- Fully justified worked solutions remain desirable in regular lessons because they teach mathematical reasoning, not because regular questions are Olympiad questions.

## Module scope

### Primary: Ninefold Orchard

- Curriculum spine: Key Stage 2 mathematics.
- Primary requirements and migration history: `PRIMARY_LEARNING_MEMORY.md`, `PRIMARY_CURRICULUM_MAP.md` and `PRIMARY_LEARNING_PROGRESSION_AUDIT.md`.
- Preserve the completed Primary topic architecture, but do not treat its lessons as editorially complete. Every visible lesson requires the first-time-learner review above.

### Junior: The Kangaroo Quest

- Curriculum spine: Key Stage 3 mathematics.
- Regular competition layer: Junior Mathematical Challenge and Junior Kangaroo.
- Separate stretch pathway: Junior Mathematical Olympiad training and its own question set. JMO content does not enter regular topics, practice generators or mocks.
- Junior topics should follow the connected 26-block KS3 spine recorded in `JUNIOR_LEARNING_MEMORY.md`.
- Historical competition archetypes are usually structures or reasoning lenses, not visible curriculum topics.
- Full audit: `JUNIOR_KS3_UKMT_AUDIT.md`.
- The curriculum overlay and structure registry are architecture, not proof of teaching quality. Every consolidated and newly created Junior lesson requires a slow, section-by-section editorial rewrite.

### Intermediate: Gifford

- Curriculum spine: Key Stage 4 mathematics (GCSE Higher tier, targeting grade 9), with the existing IMC, Kangaroo, Olympiad and GCSE research as its competition and assessment layer.
- Research reference: `INTERMEDIATE_DEEP_RESEARCH.md` and curriculum map `INTERMEDIATE_CURRICULUM_MAP.md`.
- Full audit against KS4/grade-9 and a decade of IMC/Kangaroo/Olympiad evidence: `INTERMEDIATE_KS4_UKMT_AUDIT.md`. Durable build decisions: `INTERMEDIATE_LEARNING_MEMORY.md`.
- The audit found the 28-topic architecture sound but identified three concrete gaps to close before any further content rewrite: named GCSE Higher/grade-9 content missing outright (vectors, circle equations, bearings, sector/arc, scatter graphs, sampling, three graph shapes, set notation); several lessons teaching content their own generator never tests (cosine rule, box plots, angles in the same segment, cubed volume ratios); and all seven diagram-based topics using a legacy pattern with no structure metadata and no measurable difficulty growth above D2. Do not assume previous completion means compliance with the refreshed standard.

## Delivery method

- Work in batches of five topics.
- Reuse before rewriting.
- Run focused checks during migration and full regression after all batches, except when a shared interface change requires earlier cross-module checks.
- Keep audit outputs concise and machine-readable so future work can identify only the remaining gaps.
