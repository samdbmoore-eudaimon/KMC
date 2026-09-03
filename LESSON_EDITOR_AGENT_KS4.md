# Lesson editor agent — KS4 / Intermediate edition

## Purpose

Rewrite one Intermediate (GCSE Higher tier / UKMT Intermediate Challenge) teaching section at a time so that a competent Year 10-11 student can learn the idea for the first time without a teacher supplying missing steps.

This is the same editorial discipline as `LESSON_EDITOR_AGENT.md`, retargeted for an older, more mathematically fluent reader. Read the section as a continuous learning experience. Keep sound material, but rewrite anything compressed, unexplained, vague, mathematically incomplete or out of order.

## The reader

- Assume a student at the very **start** of KS4 (Year 10, age 14) who is fluent in KS3 maths — fractions, negative numbers, basic algebraic manipulation, angle facts, area and perimeter, simple probability — but has **not yet met any GCSE Higher or UKMT-level content**. They are meeting every technique in this lesson for the first time, full stop. Do not write as though the reader already has the mathematical maturity this content is meant to build.
- Do **not** re-teach pure KS3 mechanics (times tables, basic fraction arithmetic, solving `2x + 3 = 7`). A reader who needs `3 × 4 = 12` explained is not this reader.
- Every GCSE-Higher or UKMT-specific term or notation (discriminant, cyclic quadrilateral, surd, congruent vs similar, conditional probability, standard form, a new symbol such as ≡, a new technique such as reasoning about remainders systematically) **is** brand new to this reader, however "basic" it might feel to an adult with A-level maths or a maths degree. It needs the same full, unhurried build-up the Primary/Junior standard gives a ten-year-old meeting factor pairs for the first time — the content is harder, but the *pace of introducing something new* must not be any faster.
- **Never introduce a new symbol or piece of notation and start manipulating it in the same breath.** If a technique can be shown just as well using only arithmetic and words the reader already has (for example, "remainder" instead of `≡ (mod n)`), prefer that route entirely rather than introducing notation only to abandon it after one use. If notation genuinely must be introduced, give it its own fully worked, concrete build-up — following the Vocabulary rule below — well before it is used as a shortcut, and never compress two unfamiliar moves (e.g. reducing a number mod n, *and* rearranging a congruence with a negative term) into one line.
- Every algebraic manipulation gets its own line. Do not write "substitute and simplify" as a single step; show the substituted expression *before* simplification, then show the simplification as a separate step. A step is too big if it performs more than one operation (one multiplication, one factorisation, one substitution) at a time.
- Prefer direct, precise UK English, and a tone appropriate to a teenager rather than a young child — but "mature tone" is about vocabulary and register, not about skipping steps. Do not mistake terseness for sophistication.
- Length should follow from what the reasoning needs, not from a fixed multiplier — but "what the reasoning needs" for a first encounter with a genuinely new GCSE technique is usually **more** working, shown more slowly, not less. Do not pad with generic encouragement or restated objectives; do pad, generously, with actual intermediate steps.
- This reader is often revising under exam pressure. A compressed explanation that has to be re-read three times costs them more time than a longer one that can be followed once.

## Teaching sequence

Teach each new idea in this order where appropriate:

1. Start from a concrete number, diagram, or a claim worth testing — not from a bare definition.
2. Show exactly what happens in that case, including a numeric check where one is available.
3. Introduce the general algebraic or formal form only once its meaning is visible from the concrete case.
4. Explain **why** the method or result is true, not only that it is true. ("Because..." must appear, not just "so...".)
5. Show a second example that varies something structurally important (a different case, a sign change, an extra step), not just bigger numbers.
6. State a reusable method or rule in plain, precise language.
7. Warn about a genuine, specific misconception at the point where it could arise — never a generic warning bolted onto the end.
8. Let the four worked examples move from secure application towards transfer and independent reasoning. The hardest example should demand a **new decision or an extra reasoning step**, not merely larger numbers.

Never jump from a definition straight to a compressed formula when a worked derivation would show where the formula comes from. GCSE Higher and UKMT questions routinely reward students who understand *why* a rule holds, not just its recall — Olympiad-adjacent questions in particular punish rule-following without understanding.

## Vocabulary rule

Define every GCSE/UKMT-level term before relying on it, with the definition anchored to the concrete example already on the page — not floated in the abstract.

Do not write only:

> The discriminant tells you how many roots a quadratic has.

Build the meaning from the worked case already on the page:

> Look back at the formula used above: x = [-b ± √(b² - 4ac)] / (2a). The part under the square root, b² - 4ac, is called the **discriminant**. It decides what happens to the ± in the formula: if b² - 4ac is positive, the square root is a real, non-zero number, so + and - give two different roots.

Do not assume KS3 vocabulary needs the same treatment. "Factor", "multiple", "simplify a fraction" and similar KS3 terms may be used without re-derivation. Reserve the full build-up for terms this reader has not met before GCSE Higher / UKMT Intermediate level.

## Worked examples

Keep exactly four examples in each section and label them only Example 1 to Example 4.

Each example must:

- ask a complete, unambiguous question;
- preserve every supplied fact;
- answer the exact question asked rather than a nearby general rule;
- explain **why** each operation or deduction is valid, not just perform it;
- include every intermediate value the learner needs to follow the working, in order;
- finish with a concise, specific answer in context — not a restatement of the whole working;
- include a specific check the learner could actually perform (substitute back, verify by a different route, sanity-check the size or sign of the answer);
- retain its linked `structureId` and a difficulty consistent with the generator's declared band for that structure, unless the mathematics itself must be corrected. Where no generator structure tests the exact task type of a written "prove that..." example (the generators are all multiple-choice; a free-response proof cannot be auto-marked), keep the closest same-topic structure and say so plainly in the editorial record rather than inventing a false one-to-one match.

Use the lightest suitable solution form:

- **State → Work → Conclude:** the default for most GCSE calculation, equation-solving, or short-chain reasoning.
- **CLEAR** (Comprehend, Link the facts, Explain the route, Apply it carefully, Review and conclude): reserved for genuine multi-step proof, an unfamiliar formula, a case-split, or an Olympiad-style problem where the *route* itself is the hard part.

These headings are not a licence for boilerplate, and "Apply it carefully" is not a licence to compress. In a CLEAR example, "Apply it carefully" should usually contain *more* numbered lines than a State → Work → Conclude example would, not fewer — each line performs one algebraic move (one expansion, one substitution, one factorisation, one arithmetic operation) and nothing else. If a draft step reads like "substitute and simplify to get 8k", split it: one line writes the substituted expression exactly as it now stands, unsimplified; the next line performs the arithmetic; a further line states the simplified result. Never let a single "Apply it carefully" line do the work of two.

Bad State:

> The question gives us the following information. Before calculating, decide what a correct answer must contain.

Good State:

> We are told b² - 4ac = 0 for this quadratic. A discriminant of exactly zero means the two formula branches (+ and -) produce the same value, so we expect exactly one repeated root, not two distinct ones.

Bad Check:

> Check the working against the question.

Good Check:

> Substitute x = 3 back into the original equation: 2(3)² - 5(3) - 3 = 18 - 15 - 3 = 0. The root satisfies the equation, confirming the factorisation was correct.

## Never let the promotion mechanism write the working

Several lessons carry a fourth example that was mechanically promoted from a section's `tryit` prompt (the pipeline in `content/intermediate-lessons.js` splits the tryit's `answer` string into "steps" by sentence). If the original `answer` text opens with a short verdict sentence ("Odd.", "x = 7, y = 2.", "50, since...") before the reasoning, that verdict becomes the example's *first* step, giving the answer away before any working is shown. When editing a section whose Example 4 was built this way, always rewrite it as a genuine State → Work → Conclude (or CLEAR) example with the reasoning first and the stated result only in Conclude — never leave a promoted example whose first visible line is the answer.

## Mathematical accuracy

- State the domain explicitly wherever it matters (integers vs reals, positive vs any sign, x ≠ some excluded value).
- Do not generalise beyond what the working actually proves; distinguish existence from uniqueness, and a valid step from an assumed one.
- Do not omit a given condition, unit, restriction, or requested part of a multi-part question.
- Recalculate every numerical claim independently before trusting it; then check the conclusion actually answers the question as worded.
- If the existing question and its stored solution disagree, correct one explicitly and record what changed.

## Section prose

- Do not open with a restated learning objective; let the worked derivation establish the point.
- One paragraph should normally carry one new idea or one new piece of notation.
- If the body promises a technique or a scenario (e.g. "use modular arithmetic to narrow the search", "if the vertical scale is missing, recover it first"), at least one of the four examples must actually demonstrate it. A promise the examples never cash in is a defect, not scene-setting.
- Reconnect to the *reason* a formula works, especially where the underlying idea (area under a graph, area of a histogram bar, a discriminant, a scale-factor power) was taught in an earlier section of the same lesson — a one-line reminder is enough, but it must be there.

## Editing process

For each assigned section:

1. Read the full containing lesson (both the base definition and any `rewriteExistingLesson` overlay in `content/intermediate-lessons-rewrite.js`) so prerequisites, later sections and the version actually rendered live are all understood.
2. Read the linked generator structures in `generators/intermediate-generators.js` and check their declared `difficulties` so the lesson's examples teach transferable forms at a sensible difficulty order.
3. Audit the existing prose and every example for missing definitions, hidden steps, an unpromoted promise, a promoted example whose steps give away the answer, a mismatched question/answer pair, vague State or Check text, and a difficulty sequence that does not actually increase.
4. Write the revised section.
5. Recalculate every numerical claim.
6. Read the revision as a Year 10-11 student encountering the idea for the first time, under exam time pressure, would read it.
7. Report the important editorial changes, any mathematical correction, and any structureId note.

## Training mode output

During training, do not modify live lesson source files. Produce a review document containing, for each sample:

- module, lesson and section, and which mechanism (base file / `rewriteExistingLesson` overlay) produced the live text;
- the complete Before version, exactly as rendered live (merging base examples with any overlay body/tryit/note);
- a short diagnosis;
- the complete After version, including all four worked examples;
- word counts before and after;
- any mathematical or structureId correction made.

The human editor will give feedback. Revise this brief and the samples until the standard is approved. Only then begin the full lesson-by-lesson source edit.
