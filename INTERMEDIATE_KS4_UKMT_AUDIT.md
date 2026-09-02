# Intermediate module: KS4 (GCSE grade 9) and UKMT curriculum audit

Date: 2 September 2026. Generator remediation (phase 1 of the plan below) completed 2 September 2026 — see the status note immediately below the executive finding.

## Remediation status: generators (phase 1) complete

All seven diagram-based topics flagged below now have a real `pickStructure` registry, full `structureId`/`variantId`/`representation`/`stretch` metadata, and genuine D1-D4 structure growth confirmed by the same 40-sample-per-difficulty empirical method this audit used to find the problem — re-run after the fix, **0 of 28 topics** show identical D2/D3/D4 skeleton sets (was 7/28). `scripts/gen_sanity_test_intermediate.cjs` passes with 0 fails across three consecutive runs (~563,000 checks each). The missing GCSE content this audit identified (vectors, scatter graphs, sampling, set notation, etc.) has been substantially closed for the topics that naturally host it — see the per-topic notes below — with the remainder (a standalone vectors topic/section) logged as not yet done. The rest of this document is left as originally written, as the historical record of what the audit found; treat the paragraphs below describing the seven topics as "found broken, now fixed" rather than current state. `INTERMEDIATE_LEARNING_MEMORY.md` carries the up-to-date checklist.

Per-topic generator work:

- **Circle Theorems**: rebuilt from 4 static structures (no D3/D4 growth) to 5/5/9/7 across D1-D4, adding the previously-untested "angles in the same segment" theorem, algebraic tangent/chord problems, and multi-theorem-chain D4 questions.
- **Trigonometry**: rebuilt from 2 structures (SOHCAHTOA and sine rule only) to 5/5/9/7, adding the cosine rule, the ½ab sin C area formula, exact trig values, bearings, angles of elevation, and a 3D Pythagoras diagonal — the single thinnest topic in the original audit is now one of the richer ones.
- **Similar Shapes**: rebuilt from 3 structures to 5/5/9/7, adding negative and fractional scale factors (a confirmed Higher-only gap) and a structure directly targeting the examiner-documented cubed-volume-ratio error.
- **Geometry Chains** (multiStepGeometryProof): rebuilt from 3 structures to 5/5/8/6, adding polygon angle-sum algebra, congruence-criterion recognition, and multi-theorem chains with full justification.
- **Coordinate Geometry**: rebuilt from 4 structures to 5/5/9/7, adding the previously entirely-missing circle equation (`x² + y² = r²`), tangent-to-circle gradient, line-meets-circle intersection, and perpendicular bisector equation — this directly closes the "circle equations" content gap flagged earlier in this document.
- **3D Shapes**: rebuilt from 4 structures to 5/5/9/7, adding sphere and cone volume/surface area, pyramid volume, density (mass/volume, a genuine compound-units GCSE topic), composite solids, and a frustum (a confirmed missing GCSE topic, using the big-cone-minus-small-cone method).
- **Advanced Statistics**: rebuilt from 4 structures to 5/5/8/6, adding box plot construction from raw data, the 1.5×IQR outlier rule, stratified sampling, sampling bias critique, correlation type/strength recognition, and grouped-data median interpolation — this directly closes the box plots, scatter graphs, correlation and sampling content gaps flagged earlier in this document.

Two further fixes landed in the previously-sound 21-topic cluster while verifying the above: `functionsAndIteration`'s apparent D4 regression to 3 structures was a sampling artefact (confirmed 5 real structures on deeper sampling) but its `inverse_composite_function` structure had a fragile distractor generator that silently gave up whenever its "common wrong answer" candidates weren't whole numbers — fixed to pad with guaranteed-valid decoys instead of failing. `logicAndDeduction`'s D1 `clue_elimination_2clue` structure was real but succeeded only ~2% of the time per attempt (two independent random clues rarely narrow a 15-25 number range to exactly one answer), starving it of practice; given an internal retry loop, it now succeeds ~19% of the time, in line with its four D1 siblings.

A latent bug class was also found and fixed across several of the new and existing structures: several `buildMCStr` (text-option) call sites built their four multiple-choice decoys from a fixed small candidate list that could — for specific random draws — collide with the correct answer or with each other, silently shrinking to fewer than 4 real options and triggering `buildMCStr`'s "pad with `answer·N`" fallback (a placeholder the sanity suite explicitly checks for and rejects). Fixed by widening every affected candidate pool and, for point/line/fraction-shaped answers, adding a small local helper that guarantees 4 unique decoys regardless of input values. This is worth remembering as a house rule for any future `buildMCStr` usage in this codebase: never assume a fixed 4-candidate list can't collide — verify with a few hundred sampled draws, not just a single manual check.



## Success criterion under test

The stated goal for Intermediate (Gifford) is that a player who reaches Mock level 10 and beats the final boss should be almost sure of a grade 9 at GCSE maths. That is a much higher bar than "the topic list resembles the specification." It requires every piece of content a grade-9 candidate is actually examined on to be taught AND practised AND tested at full difficulty before the final boss, and it requires the hardest UKMT material (IMC, Intermediate Kangaroo, Cayley/Hamilton/Maclaurin) to be used, in the same way the Junior audit used JMC/Junior Kangaroo/JMO, as a reasoning and difficulty layer over that curriculum rather than as a replacement for it.

This audit tests the module against that bar using the same method as `JUNIOR_KS3_UKMT_AUDIT.md`: primary-sourced competition evidence, statutory/exam-board curriculum sources, and a full mechanical inventory of the current lessons and generators.

## Executive finding

**The module cannot currently deliver the stated guarantee, and the shortfall is precise and fixable rather than diffuse.**

The 28-topic architecture is sound and was already deliberately mapped to GCSE Foundation/Higher and to named UKMT hard-question devices (`INTERMEDIATE_CURRICULUM_MAP.md`). The lesson prose is often genuinely strong: several lessons (Surds & Indices, Circle Theorems, Trigonometry, Statistics) teach the real GCSE content, including named theorems and formulae, in patient, worked, first-principles style. That is more advanced than the pre-rewrite state Junior and Primary were audited from.

But three separate problems combine to break the guarantee:

1. **A closed content gap.** Several topics that are unambiguously part of the GCSE Higher/grade-9 specification, and that UKMT's own harder Kangaroo and Olympiad papers lean on, do not appear anywhere in the module at all: **vectors** (including vector geometric proof, a documented grade 8-9 discriminator), **circle equations** (`x² + y² = r²` and tangents to them), **bearings**, **sector area and arc length**, **scatter graphs and correlation**, **sampling**, the **shapes** of cubic/reciprocal/exponential graphs, and **set notation** for inequalities. A player can complete every level and beat the final boss without ever meeting these.
2. **A lesson-generator alignment gap that is worse than it looks from the topic list.** Several lessons teach content their own generator never produces. Trigonometry's lesson teaches the cosine rule and the ½ab sin C area formula; the generator has never asked either. Circle Theorems' lesson teaches "angles in the same segment"; the generator has no structure for it. Statistics' lesson teaches box plots as its first section; the generator has zero box-plot structures. Similar Shapes' lesson teaches volume scale factors — the single most reliably documented grade 8-9 failure point in the GCSE examiner-report evidence below — and the generator barely touches it. A player can read the lesson, believe they have learned the idea, and then never be asked it again.
3. **A structural metadata gap identical to Junior's and Primary's pre-rewrite state.** Zero of the 368 worked lesson examples carry a `structureId`. All seven diagram-based topics (exactly the geometry and statistics cluster: Circle Theorems, Trigonometry, Similar Shapes, Geometry Chains, Coordinate Geometry, 3D Shapes, Advanced Statistics) generate no `structureId`, `variantId` or `representation` metadata at all, and — measured empirically by sampling each difficulty forty times — show **no detectable difficulty growth above D2**. Two of those seven are flagged `tier: "higher"`, meaning the module's own Higher-content mock filter is currently gating players into topics that do not actually get harder once they arrive.

None of this is a criticism of the writing quality that exists. It is a description of exactly where the guarantee currently breaks, so it can be closed topic by topic in the same batched, evidence-led way Junior and Primary were rebuilt.

## Research scope and method

### Curriculum sources

- DfE statutory National Curriculum in England: mathematics programmes of study, key stage 4.
- AQA GCSE Mathematics (8300) specification, subject content pages 3.1–3.6 and scheme of assessment.
- Two Pearson Edexcel Higher Paper 3 Principal Examiner Feedback reports (Summer 2019, Summer 2023) and the WJEC/Eduqas Summer 2025 GCSE Examiners' Report.
- Ofqual's GCSE Subject Level Guidance for Mathematics (June 2015) and AQA's Assessment Objective Guidance.

This part of the evidence base is carried over unchanged from `INTERMEDIATE_DEEP_RESEARCH.md` §4–5, which read these sources directly (not secondary summaries) in a prior session; it is not re-run here, in line with the project's standing instruction not to re-do that research. Where this audit draws a curriculum conclusion, it is traceable to that document.

**Known scope limit carried over honestly**: the deep-research document itself flags that its Higher-tier-only content list was read via an AI-summarising fetch of AQA's pages rather than the primary specification PDF, and that it is a Higher-**only** list, not a full GCSE content inventory. This audit's own content-gap findings below (vectors, sector/arc, bearings, scatter graphs, Venn diagrams, sampling) are cross-checked directly against the module's own source code by keyword search, which is a harder, reproducible form of evidence than a specification reading, and several of the confirmed-missing items (sector area, arc length, bearings, Venn diagrams, scatter graphs) are Foundation **and** Higher content, not Higher-only extensions — meaning they matter for the guarantee at every grade, not only at grade 9.

### Competition corpus

Reused directly from `INTERMEDIATE_DEEP_RESEARCH.md` (5 August-2026 parallel research agents, all primary sources: UKMT papers, extended solutions, markers' reports):

- **IMC**: 2015, 2017, 2019, 2021, 2023, 2024, 2025 — hardest-quarter (Q18–25) analysis for each year.
- **Grey Kangaroo** (Y9 and below): 2016, 2018, 2022, 2023, 2025, 2026.
- **Pink Kangaroo** (Y10–11): 2016, 2019, 2022, 2023, 2026.
- **Cayley / Hamilton / Maclaurin** (IMOK, Y9/Y10/Y11): structure and marking philosophy from all three; detailed topic progression from the matched 2025 triple; recurring proof-writing failures from Cayley 2024/2025, Hamilton 2025 and Maclaurin 2025 markers' reports.

This is a sampled decade rather than Junior's consecutive ten years, but it is deeper per paper (a named hardest-quarter table and a proof-failure analysis for every sampled year, against Junior's aggregate topic tally), and it already spans 2015–2026. A supplementary pass fetching the 2026 IMC and 2026 Cayley/Hamilton/Maclaurin papers — the one clear remaining gap, since those cycles have now run — was commissioned as part of this audit and its findings are appended below once returned; this document will be updated in place rather than left to go stale.

### Codebase inventory

Freshly built for this audit, since no equivalent tooling existed for Intermediate before now:

- `scripts/audit_intermediate_progression.cjs` (new): imports the live module, inventories every topic/lesson/generator, and empirically samples each generator 40 times per difficulty band to measure structure counts, metadata completeness and cross-difficulty differentiation. This is evidence-gathering, not a pass/fail gate — Intermediate has not yet been migrated to the shared contract, so a first run is expected to fail almost everything, exactly as Junior's and Primary's first audits did.
- Direct keyword search across `generators/intermediate-generators.js` (17,919 lines) and `content/intermediate-lessons.js` + `content/intermediate-lessons-rewrite.js` for specific named GCSE Higher/grade-9 content, to convert "is this taught?" from a reading judgement into a reproducible count.

## What KS4 (Higher tier, grade 9) requires

The statutory KS4 programme of study uses the same six domains as KS3 — Number; Algebra; Ratio, proportion and rates of change; Geometry and measures; Probability; Statistics — and explicitly expects pupils to make cross-domain connections, not just deeper single-topic content.

Confirmed Higher-tier-only content (never examined on Foundation papers, per AQA 8300 §3.1–3.6):

- **Number**: fractional indices; simplifying surds and rationalising denominators; converting recurring decimals to fractions.
- **Algebra**: algebraic proof; iteration for approximate equation solutions; composite/inverse functions; completing the square and turning points; the quadratic formula; cubic, reciprocal, exponential and trig graph shapes; gradient/area under non-linear graphs; circle equations and tangents to them; linear-quadratic simultaneous equations; quadratic inequalities and set notation; quadratic/geometric nth term.
- **Ratio/proportion/rates of change**: direct/inverse proportion expressed algebraically (`y = kx`, `y = k/x`); density and pressure; instantaneous rate of change (gradients of chords/tangents); growth and decay including compound interest via iteration.
- **Geometry and measures**: all circle theorems; exact trig values; the sine rule, cosine rule and ½ab sin C area formula; vector geometric proof; negative/fractional enlargement scale factors and area/volume ratios for similar shapes.
- **Statistics**: unequal-width histograms; cumulative frequency graphs; box plots and inter-quartile range; inference from sampling.
- **Probability**: AQA does not wall conditional probability, tree diagrams or Venn diagrams off as Higher-only — both tiers examine them; the difference at grade 9 is the complexity of the numbers and the presence of algebraic unknowns inside the tree, not a topic boundary.

Grade 8–9 vs grade 6–7, per the Edexcel and WJEC/Eduqas examiner reports read directly in the deep research:

- Checking and sense-checking a result is the single most repeated gap in examiner commentary at every grade band, but its absence is what most often turns a nearly-correct grade-8 script into a grade-7 one.
- Algebraic proof is a structural discriminator: weak candidates substitute a specific number for `n` and believe that proves the general statement.
- Multi-step, unstructured problems — vector geometry, circle geometry combined with coordinates, non-replacement conditional probability, algebraic fractions that resolve into a quadratic — are where full marks become rare even among strong candidates.
- Communication costs marks independently of the mathematics: an angle-chasing proof loses marks when reasons are not clearly linked to working, even when every number is right.
- Functions, iteration and similar-shape volume ratios are weak even among the Higher-tier cohort as a whole. On one Eduqas paper, 40% of candidates gave the wrong (linear instead of cubed) answer for a similar-volume ratio — this is exactly the skill this module's `similarShapesAndScaleFactors` generator barely tests (see below).
- The 2015 reform's AO3 style deliberately removes scaffolding, adds redundant information, and asks pupils to connect two topics the question does not name for them (its own worked example: "given the surface area of a sphere, find the volume of the cube containing it"). A module that only ever asks single-topic, single-method questions will not train this, regardless of how hard its numbers are.

## What UKMT Intermediate papers actually reward

### Intermediate Mathematical Challenge (IMC)

25 multiple-choice, 60 minutes, no calculator; negative marking only on Q16–25 (a deliberate design difference from JMC, which never penalises). Across the seven sampled years, the hardest quarter is genuinely mixed between single "aha" insight and sustained multi-step execution, tilted more toward execution than JMC's hardest quarter: geometry questions routinely combine one clever framing insight with a real computational tail (a quadratic, a Pythagoras step, a full algebraic rearrangement). Recurring named machinery across the sampled years includes repeated Pythagoras, circle theorems, tangent/inscribed-circle configurations, surds (telescoping products), modular exponentiation, quadratics arising from geometric setups, and full three-variable simultaneous systems — i.e. genuine GCSE-Higher technical stamina, not just a bigger version of a KS3 insight puzzle.

### Grey and Pink Kangaroo

Same 25-question, no-calculator, no-negative-marking format at both tiers. Grey (Y9 and below) leans on a recognisable house style inherited from Junior Kangaroo: epistemic/liar logic puzzles recur almost every sampled year, alongside parity/invariant tricks and 3D spatial nets — insight-heavy, lighter on formal technique. Pink (Y10–11) keeps some of that DNA but shifts weight toward content that needs real KS4 machinery: Diophantine coin/weight systems, modular-arithmetic digit puzzles, perfect-square-via-prime-factorisation arguments, coordinate/vector geometry using symmetry and affine area ratios, and 3D volume/frustum problems in the late paper. The gap between Pink Kangaroo and IMC's hard end is narrower than the gap between Grey and IMC — Pink already expects insight *plus* technique.

### Cayley / Hamilton / Maclaurin (IMOK)

Two hours, six questions, ten marks each, every question a full written proof from Q1 — there is no multiple-choice section at any of the three tiers. UKMT's own marking philosophy is explicit and unlike GCSE: a correct final answer with no justification earns very little credit ("just stating an answer, even a correct one, will earn you very few marks"), and markers are told to ask themselves whether a two-minute interview with the candidate could fix the gap in their write-up. Recurring failures across four markers' reports read directly: asserting a geometric fact with no rule cited; proving one example instead of the general case; finding *a* solution but not proving no other exists; smuggling in an unproven restriction; citing a named method (similarity, for instance) without verifying its conditions. The three papers are deliberately vertically aligned — the same underlying scenario (a water-tank ratio problem, a keypad-PIN divisibility problem) reappears across Cayley/Hamilton/Maclaurin at escalating difficulty in the same year, which is a genuinely different design from JMO's independent papers.

### The important curriculum conclusion, mirroring Junior's

UKMT Intermediate papers under-sample some statutory Higher content for the same structural reason JMC under-samples KS3 graphs and statistics: a 60-minute no-calculator multiple-choice paper cannot easily examine box plots, scatter graphs, sampling, or a fully worked vector proof. Their rarity in the competition corpus is not evidence that this content does not matter for a grade 9 — GCSE examiner reports say the opposite for several of these (vector geometry, similar-shape volume ratios). UKMT should shape the module's *reasoning style and hardest-quarter difficulty*, not its topic list. The topic list must come from the full GCSE Higher specification, deliberately including the content the multiple-choice competitions rarely touch.

## Current Intermediate inventory

From `scripts/audit_intermediate_progression.cjs` against the live module:

- **28 visible topics** (10 flagged `tier: "higher"`, 7 flagged `dia: true`), each with a lesson and a generator. No missing lessons or missing generators.
- **92 teaching sections, 368 worked examples.** Every section already has exactly four examples — the one respect in which Intermediate starts ahead of where Junior and Primary began.
- **0 of 368 worked examples carry a `structureId`.** The lesson-generator link required by the shared contract is completely unaudited, identical to Junior's and Primary's pre-rewrite state.
- **21 of 28 generators** (every non-diagram topic: number, algebra, probability, combinatorics, logic and applied topics) use a proper `pickStructure` registry. Sampled output from these correctly carries `structureId`, `variantId`, `representation` and `stretch`. Verified against 200 samples per difficulty (the first-pass 40-sample script undercounted several pools and wrongly suggested `functionsAndIteration` regressed at D4 — corrected below), **20 of these 21 topics reach five or more genuinely distinct verbal/reasoning structures at every one of D1-D4**, several reaching eight or nine (Surds & Indices D3: 9; Algebraic Manipulation D3/D4: 5-6; Sequences: 5 throughout). This is materially better than Junior's or Primary's pre-rewrite state and needs no structural rebuild, only the specific small fixes below. The one exception is `logicAndDeduction`, which has only 4 structures at D1 (chained-age deduction, modus ponens, pigeonhole, simple syllogism) — one short of the five-structure bar.
- **7 of 28 generators** — exactly the diagram-heavy cluster (Circle Theorems, Trigonometry, Similar Shapes, Geometry Chains, Coordinate Geometry, 3D Shapes, Advanced Statistics) — still use an older hand-written `tier1`/`tier2` array pattern with no registry at all. Sampled output from every one of these seven carries **no** `structureId`, `variantId`, `representation` or `stretch`, and empirical sampling (40 questions per difficulty) shows the **same set of question skeletons at D2, D3 and D4** in all seven — meaning a player sees no real difficulty growth in geometry or statistics after the first difficulty step, all the way to the final boss. Two of these seven (Circle Theorems, Trigonometry) are also flagged `tier: "higher"`, so the module's own Higher-content mock gate is currently protecting content that does not get harder once unlocked.
- Two lessons (`simultaneousEquations`, `logicAndDeduction`) have only two teaching sections against a typical three to five elsewhere — thin relative to the depth Junior/Primary now expect, though not necessarily wrong for those specific topics.

## Confirmed content gaps against the GCSE Higher/grade-9 specification

Checked by direct keyword search of the live generator and lesson source (not a reading judgement), so these are reproducible counts, not impressions.

### Not taught anywhere in the module (lesson AND generator both silent)

| Content | GCSE status | Evidence |
|---|---|---|
| Vectors, including vector geometric proof | Higher-only; documented grade 8-9 discriminator (deep research §5) | Zero hits for "vector", "column vector" or "resultant" across 17,919 generator lines and both lesson files |
| Circle equations (`x² + y² = r²`) and tangents to a circle in coordinate form | Higher-only | Zero hits for "circle equation"; one incidental `x² + y²` hit with no teaching around it |
| Bearings | Foundation + Higher | Zero hits anywhere |
| Sector area and arc length | Foundation + Higher | Zero hits for either term anywhere |
| Scatter graphs and correlation | Foundation + Higher | Zero hits for either term anywhere |
| Sampling / inference from a sample | Higher-only | Zero hits anywhere |
| Cubic, reciprocal and exponential graph shapes | Higher-only | Zero hits for any of the three, despite a topic literally named `graphsAndRatesOfChange` |
| Set notation for inequalities | Higher-only | Zero hits anywhere |
| Growth and decay as a named idea distinct from simple compound interest | Higher-only | One incidental hit only |

### Taught in the lesson, absent or negligible in the generator (lesson-generator gap)

| Topic | Lesson section | Generator evidence |
|---|---|---|
| Trigonometry | "3. The cosine rule" and "4. Area of any triangle: ½ab sin C" are sections 3–4 of 4 | Zero cosine-rule hits, zero ½ab sin C hits in the generator; the topic's own registry only ever produces SOHCAHTOA (D1) or the sine rule (D2–D4, unchanged) |
| Circle Theorems | "3. Angles in the same segment are equal" is section 3 of 5 | No structure for it; the generator's D1 pair is semicircle + centre/circumference, its D2–D4 pair (identical across all three) is cyclic quadrilateral + tangent-radius |
| Advanced Statistics | "1. Box plots: five key numbers" is the lesson's opening section | Zero box-plot hits in the generator across all four difficulties |
| Similar Shapes | "3. Volume scales by the CUBE of the scale factor" — the exact skill Eduqas 2025 reports 40% of Higher candidates got wrong by cubing incorrectly | "Similar…volume" returns zero hits; "volume scale factor" returns one |
| Probability | Venn diagrams appear twice in lesson prose | Zero Venn-diagram hits in the generator |

This table is the sharpest evidence for the success-criterion failure: a player can complete the lesson, correctly answer the lesson's own worked examples, and then never be asked the cosine rule, angles in the same segment, a box plot, a correctly-cubed volume ratio, or a Venn diagram again in practice or in any mock, including the final one.

## Lesson audit against the agreed standard

The target standard, unchanged from `LEARNING_MODULE_REQUIREMENTS.md`: a well-written lesson for every topic; exactly four worked examples per teaching section; every example carrying a valid generator `structureId`; representative D1-D4 coverage; explicit prerequisites; the lightest suitable Simple/State-Work-Conclude/CLEAR format chosen per example rather than forced uniformly.

Current result:

- 28 of 28 lessons exist; all 92 sections already contain exactly four examples (a genuine strength — no placeholder-example repair pass is needed here, unlike Junior's and Primary's starting states).
- 0 of 368 examples carry a `structureId`. The lesson-generator relationship cannot currently be audited at all.
- Spot-checked lesson prose (Surds & Indices, Circle Theorems, Trigonometry, Statistics) is written to a genuinely good first-principles standard already: it proves the surd-multiplication rule algebraically before using it, names and explains circle theorems in plain language before applying them, and derives frequency density from first principles for histograms. This is materially better than the pre-rewrite Junior/Primary baseline and suggests the lesson-writing pass, where it has happened, does not need the scale of rewrite Junior and Primary needed — the priority gap here is metadata and generator alignment, not prose quality.
- That spot-check is not a substitute for the full section-by-section first-time-learner review `LESSON_EDITOR_AGENT.md` requires. It has not been done for any of the 28 Intermediate lessons and should not be assumed complete merely because the samples read well.
- Two lessons are thin on section count (`simultaneousEquations`, `logicAndDeduction`, two sections each) relative to the rest of the module.

## Generator audit against the agreed standard

The target standard: four genuine D1-D4 bands where every structure becomes mathematically harder, not merely numerically bigger; at least five distinct structures per difficulty where the mathematics allows it; every output carrying `structureId`, `variantId`, `representation`, `difficulty` and `stretch`; UK terminology and full worked solutions.

Current result:

- 28 of 28 topics generate successfully at D1–D4 with five valid options and a complete worked solution — the harness itself is sound and never crashes or produces malformed output, confirmed by `node scripts/gen_sanity_test_intermediate.cjs` (529,559 checks, 0 fails) run as part of this audit.
- 21 of 28 topics (every non-`dia` topic) meet or nearly meet the five-structures-per-difficulty bar and expose full `structureId`/`variantId`/`representation`/`stretch` metadata. Two need direct repair: `functionsAndIteration` regresses from 5 structures to 3 at D4, and `logicAndDeduction` has only 4 at D1–D2.
- 7 of 28 topics — every diagram topic — have **no** structure registry, **no** metadata, and **empirically zero difficulty growth from D2 to D4** (confirmed by sampling, not inferred from code reading). This is the single highest-priority technical finding in this audit: it affects the entire geometry and statistics half of the GCSE specification, it includes two topics already flagged `tier: "higher"`, and it means the hardest visible content in exactly the domain (geometry and measures, statistics) where GCSE Higher papers place 20% and 15% of marks respectively is not actually the hardest content the topic could produce.
- `difficulty` is not returned as an explicit field on generator output (only `structureId`/`variantId`/`representation`/`stretch` are). This is a minor gap relative to the metadata gaps above, since the caller always knows the difficulty it requested; it is noted here only for completeness against the shared contract's literal wording.
- Confirmed from the July build notes and still true: `proofTechniques` draws from a fixed pool with no randomisation (byte-identical question text on repeat), and `diophantineEquations`/`estimationAndBounds`/`ratioProportionAlgebraic`/`advancedProbability` contain off-theme filler structures that dilute their stated skill.

## Difficulty model for Intermediate

Adapting the Junior model to GCSE Higher/grade-9 framing and UKMT Intermediate evidence:

- **D1**: secure the GCSE Foundation-safe form of the idea; one representation, one principal step.
- **D2**: apply the Higher-tier form of the method in a familiar setting; two linked steps or one representation change; roughly AQA AO1/early-AO2 weight.
- **D3**: choose the method, connect two ideas, or handle a constraint; IMC middle-paper reasoning; the level at which AO3-style "spot the cross-topic link" questions should start appearing.
- **D4**: non-routine synthesis at the grade 8-9 ceiling — multi-step unstructured problems of the kind Edexcel/Eduqas examiner reports say strong candidates still fail (vector proof, circle geometry with coordinates, non-replacement conditional probability, a quadratic formed from algebraic fractions), Pink Kangaroo/IMC-hard-quarter reasoning, or genuine communication demand (a fully linked, correctly notated proof). It remains within the GCSE Higher specification and the regular Kangaroo/IMC pathway; it is not Cayley/Hamilton/Maclaurin-level proof, which stays in the separate Olympiad academy.

Under this model, none of the seven diagram topics currently reach D4 as defined — their D4 output is identical to their D2 output, which by definition cannot carry AO3-level synthesis.

## Recommended remediation, in priority order

1. **Close the seven-topic diagram gap first.** Give Circle Theorems, Trigonometry, Similar Shapes, Geometry Chains, Coordinate Geometry, 3D Shapes and Advanced Statistics a real `pickStructure` registry each, at minimum lifting every structure already written into the lesson (cosine rule, ½ab sin C, angles in the same segment, box plots, correctly-cubed volume ratios) into a generator structure, then building genuine D3/D4 extensions (combined theorems, coordinate-and-circle-theorem hybrids, multi-step trigonometry with a bearing, comparing two box plots). This single fix directly repairs the sharpest evidence in this audit and restores meaning to the `tier: "higher"` mock gate for the two topics that carry it.
2. **Add the content that is missing outright.** Vectors and vector proof, circle equations and tangents in coordinate form, bearings, sector area and arc length, scatter graphs and correlation, sampling, the three missing graph shapes, and set notation each need a home. Some extend an existing topic naturally (bearings and sector/arc into Trigonometry or a geometry topic; scatter graphs, correlation and sampling into Advanced Statistics; circle equations into Coordinate Geometry; set notation into Quadratics or Algebraic Manipulation); vectors are substantial enough, and flagged strongly enough by the GCSE evidence, to justify their own topic or a clearly-scoped major section, most naturally sequenced in the geometry cluster.
3. **Fix the two regressions in the otherwise-sound 21-topic cluster**: restore `functionsAndIteration` to five genuine D4 structures, and add at least one more D1/D2 structure to `logicAndDeduction`. Replace `proofTechniques`' static pool with genuine randomisation, and remove the off-theme filler flagged in `diophantineEquations`, `estimationAndBounds`, `ratioProportionAlgebraic` and `advancedProbability`.
4. **Attach `structureId` to every one of the 368 lesson examples**, choosing, wherever practical, a structure that genuinely exists in that topic's generator once step 1 is complete — the same discipline Junior and Primary already applied. Where a lesson currently teaches something the generator cannot yet produce, fixing the generator (steps 1–2) must come first so the link is real rather than retrofitted to a structure that doesn't match.
5. **Only then**, run the equivalent of Junior's and Primary's slow-teaching editorial pass on all 28 lessons against `LESSON_EDITOR_AGENT.md`, since the spot-checked prose quality suggests this pass will need less rewriting here than it did for Junior or Primary, but it has not been done and should not be assumed complete.
6. **Extend the competition-corpus sampling to the full 2017-2026 decade** to match Junior's consecutive-year standard, once the commissioned 2026-cycle research (IMC 2026, Cayley/Hamilton/Maclaurin 2026) returns; fold its findings into this document rather than starting a second one.

## Final judgement

The architecture is right and should not be rebuilt from zero: 28 topics, correctly tiered, correctly sequenced, with lesson prose in several spot-checked cases already at the standard Junior and Primary only reached after their full rewrite. What is missing is the same three things that were missing from Junior and Primary before their rewrites — structure IDs linking lesson to generator, genuine D1-D4 growth in every topic, and full statutory coverage — concentrated almost entirely in one identifiable half of the module (the seven diagram topics) plus a short, named list of missing GCSE content (vectors above all). Closing exactly those gaps, in the priority order above, is what stands between the current module and the "almost sure of a 9" guarantee the game is meant to deliver.

---

## Addendum: 2026 UKMT cycle

A supplementary research pass read the IMC 2026 paper and all three 2026 IMOK papers and markers' reports directly (sources listed below). This extends the sampled decade to 2015-2026 and brings the evidence fully current as of this audit.

**IMC 2026** (sat 28 January 2026) hardest quarter (Q18-25): double-isosceles-triangle angle chase, nested continued-fraction equation, 45°-lattice perimeter with surds, cubic-sum algebraic identity, Hamiltonian-path counting on a hexagon grid, percentage-blending optimisation, midpoint-quadrilateral area invariant with an interior point, circular non-consecutive-day probability. This year leans noticeably more toward multi-case execution than 2025: four of the eight hardest questions demand systematic casework or path enumeration rather than a single flash of insight, with only two genuinely single-insight questions. **This means the "insight vs execution" balance for IMC's hardest quarter should be read as year-dependent, not a stable trend** — 2025 skewed toward sharp insight, 2026 skews toward sustained casework. A module aiming for the IMC hard tier needs both, not a fixed ratio.

**Cayley 2026 (Y9)**: three-person money-ratio algebra, digit-placement combinatorics constrained by divisibility by 4, a rectangle-proof (show a quadrilateral is a rectangle), an isosceles-triangle midpoint proof, a clock-face rearrangement parity/impossibility question, a three-prime Diophantine equation. Arithmetic/algebraic manipulation and basic angle-chase geometry still dominate, consistent with 2025.

**Hamilton 2026 (Y10)**: a two-part palindromic-sum number-theory proof (non-existence, then multiplicity), a fractional-part functional-equation counting problem, a lattice-path combinatorics question, an angle-condition parallelogram proof, a fraction-pair algebra puzzle, and a minimum-probes combinatorial strategy problem (an information-theoretic padlock-code puzzle) — a genuine step up in abstraction over Cayley.

**Maclaurin 2026 (Y11)**: an existence/impossibility proof for a nested-equation identity over distinct integers, a square-dissection perimeter/area-ratio problem, a powers-of-two sum-and-product count under one million, a 5×5 grid repainting combinatorics count, an isosceles-trapezium ratio problem, and an intricate 10×10-grid combinatorial-geometry count — the closest of the three to genuine olympiad case-counting.

**New recurring proof-writing failure, not previously documented**: pattern-spotting mistaken for proof. Hamilton 2026's markers' report explicitly flags candidates who "continued the pattern that works" for small cases and treated that as a proof, and separately notes candidates who correctly *observed* a parity pattern but did not prove it must hold. This sits alongside the already-documented failures (asserting facts without foundation, proving one example instead of the general case, circular reasoning, unjustified perpendicularity/right-angle assumptions) and should be added to whatever proof-writing guidance the Olympiad academy gives.

**Structural note revised**: the 2025 papers shared the same underlying scenario across Cayley/Hamilton/Maclaurin at escalating difficulty (a water-tank problem, a PIN-digit problem). No such shared scenario is evident across the 2026 triple. **The "vertical alignment" design note in the original deep research should therefore be treated as something that happens in some years, not a fixed yearly design commitment** — do not build content-generation logic that assumes every year's three papers share a scenario.

Sources (all opened directly): `ukmt.org.uk/wp-content/uploads/2026/01/IMC_Paper_2026.pdf`, `ukmt.org.uk/free-past-papers/intermediate-mathematical-challenge-2026`, `ukmt.org.uk/wp-content/uploads/2026/03/Cayley_Paper_2026.pdf`, `.../2026/04/Cayley-Markers-Report.pdf`, `.../2026/03/Hamilton_Paper_2026.pdf`, `.../2026/04/Hamilton-Markers-Report.pdf`, `.../2026/03/Maclaurin_Paper_2026.pdf`, `.../2026/04/Maclaurin-Markers-Report.pdf`.

## Correction after deeper generator sampling

The first-pass audit script sampled each difficulty 40 times, which undercounted structure pools for topics whose `pickStructure` eligibility is uneven. Re-sampling every non-diagram topic 200 times per difficulty and reading the actual distinct `structureId`s and question text (not just skeleton counts) gives a materially more positive and more precise picture:

- **20 of the 21 non-diagram topics reach five or more genuinely distinct verbal/reasoning structures at every one of D1-D4**, several reaching eight or nine at their hardest bands (Surds & Indices D3: 9 structures — surd arithmetic, index-law manipulation, equation-solving, error-spotting and rationalising a conjugate all appear as genuinely separate skills, not numeric reskins). This is well inside the "5, up to 10" richness bar used for Junior and Primary, and needs no structural rebuild.
- `functionsAndIteration` does **not** regress to 3 structures at D4, as the first pass suggested — deeper sampling finds all 5 (composite-solve-for-x, inverse-composite-function, fixed-point, three-step linear iteration, two-step square-root iteration). The July build note's flag was a sampling artefact, not a real defect. This is now corrected wherever it appeared above.
- The one genuine, confirmed shortfall among the 21 is `logicAndDeduction` at D1: exactly 4 structures (chained-age deduction, modus ponens, pigeonhole, simple syllogism), one short of the five-structure bar.
- This does not change the central finding of this audit: the seven diagram topics remain the priority, since they are the ones with zero structure registry, zero metadata, and confirmed zero difficulty growth from D2 to D4.

## Remediation status: lessons (phase 2) complete

Every worked example and try-it prompt across all 28 Intermediate lessons (`content/intermediate-lessons.js` plus the six full-replacement lessons and 21 rewrite-only lessons in `content/intermediate-lessons-rewrite.js`) now carries a `structureId` pointing at a real, currently-registered generator structure in `INTERMEDIATE_STRUCTURES`. Coverage: **460/460 items** (368 primary examples/promoted-tryits plus 92 secondary try-it prompts that the `rewriteExistingLesson` mechanism attaches on top of the base examples — these were not counted in the original 368 figure and were discovered only once a whole-file audit script checked `section.tryit` as well as `section.examples`), verified with 0 mismatches by cross-checking every `structureId` against the live `INTERMEDIATE_STRUCTURES` registry keys for its topic.

This closes a real content-integrity gap: several lessons had a second `tryit` object (introduced by `rewriteExistingLesson`'s per-section rewrite) sitting alongside the four already-tagged `examples`, untagged and therefore unverifiable against the generator that's supposed to back it. All 21 affected topics plus `surdsAndIndices`'s direct-assignment tryits were fixed via a small `attachTryitIds` post-processing block at the end of `applyIntermediateLessonRewrites`, rather than by re-editing prose deep inside each `teaching(...)` call.

Verified after linking: `node --check` on both content files, a full `INTERMEDIATE_LESSONS`/`INTERMEDIATE_STRUCTURES` cross-check script (460/460, 0 bad IDs), `scripts/gen_sanity_test_intermediate.cjs` (0 fails, ~562,900 checks), `scripts/gen_sanity_test_junior.cjs` and `scripts/gen_sanity_test_primary.cjs` (0 fails, confirming no collateral breakage), and a full `node scripts/rebuild.cjs`.

Not done (per standing instruction to note gaps rather than build them now — see `INTERMEDIATE_LEARNING_MEMORY.md` "Not yet done"): a standalone vectors topic, and the full lesson editorial (slow-teaching prose) pass. The `proofTechniques` static-pool issue and the off-theme filler in `diophantineEquations`/`estimationAndBounds`/`ratioProportionAlgebraic`/`advancedProbability`, both previously logged as open, were checked during this pass and found already fixed in the generator source (confirmed by source comments and by empirical sampling showing 21-30 distinct questions per 30 draws at every difficulty) — the memory doc's stale note has been corrected.
