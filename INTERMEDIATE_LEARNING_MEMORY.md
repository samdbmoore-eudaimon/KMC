# Intermediate learning build memory

This file records the durable decisions for the Intermediate (Gifford) module. Read it before changing Intermediate topics, lessons, generators, practice progression, mock papers or the Olympiad academy.

## Purpose

Intermediate is a Key Stage 4 (GCSE) learning course with UKMT-quality problem solving layered on top. The product promise is specific and testable: a player who reaches Mock level 10 and beats the final boss should be almost sure of a grade 9 at GCSE maths. Every architectural and content decision is judged against that bar, not against "the topic list looks like the specification."

The full GCSE Higher specification determines what the visible regular topics must eventually cover, including the content UKMT's multiple-choice papers rarely test (vectors, box plots, scatter graphs, sampling, circle equations). The last decade of IMC, Intermediate Kangaroo and Cayley/Hamilton/Maclaurin evidence determines the reasoning style, disguise and hardest-quarter difficulty within those topics — it is a difficulty and reasoning layer over the curriculum, not a substitute for it.

The Cayley/Hamilton/Maclaurin Olympiad (IMOK) is a separate stretch pathway in its own academy area (unlocked at chapter 8), with its own fully-written-proof format and marking philosophy. Its papers and questions do not enter regular topics, practice generators or mocks.

## Editorial and structural truth standard

The 28-topic architecture is sound and was deliberately mapped to GCSE Foundation/Higher tiers and named UKMT hard-question devices before this audit (`INTERMEDIATE_CURRICULUM_MAP.md`). That mapping is a defensible topic list, not proof of teaching or testing quality.

The full audit (`INTERMEDIATE_KS4_UKMT_AUDIT.md`, 2 September 2026) found the module has not yet had the structure-ID / four-example / D1-D4 rebuild that Junior and Primary have completed, and — unlike Junior and Primary's pre-rewrite states — its core problem is not primarily thin prose. It is three specific, fixable gaps:

1. A short, named list of GCSE Higher/grade-9 content missing from the module entirely: vectors (including vector geometric proof), circle equations and tangents in coordinate form, bearings, sector area and arc length, scatter graphs and correlation, sampling, cubic/reciprocal/exponential graph shapes, and set notation.
2. A lesson-generator alignment gap: several lessons teach content (the cosine rule, ½ab sin C, angles in the same segment, box plots, correctly-cubed volume ratios, Venn diagrams) that their own generator never produces, so a player can learn an idea in the lesson and never be asked it again.
3. All seven diagram-based topics (Circle Theorems, Trigonometry, Similar Shapes, Geometry Chains, Coordinate Geometry, 3D Shapes, Advanced Statistics) still use a legacy hand-written difficulty pattern with no structure registry, no metadata, and empirically zero difficulty growth from D2 to D4.

Treat these three findings as the rebuild's starting checklist. Do not assume any topic is compliant with the refreshed standard merely because its lesson prose reads well on inspection — several spot-checked lessons already write to a genuinely good first-principles standard, which is precisely why the generator and metadata gaps are the priority, not another prose rewrite.

## Evidence base

- Statutory KS4 National Curriculum programme of study for England.
- AQA GCSE Mathematics (8300) specification (subject content 3.1–3.6, scheme of assessment).
- Pearson Edexcel Higher Paper 3 Principal Examiner Feedback (Summer 2019, Summer 2023) and WJEC/Eduqas Summer 2025 GCSE Examiners' Report.
- Ofqual GCSE Subject Level Guidance for Mathematics (June 2015) and AQA's Assessment Objective Guidance.
- Official UKMT IMC (2015, 2017, 2019, 2021, 2023, 2024, 2025), Grey Kangaroo (2016, 2018, 2022, 2023, 2025, 2026), Pink Kangaroo (2016, 2019, 2022, 2023, 2026) and Cayley/Hamilton/Maclaurin papers and markers' reports (structure from all years; detailed topic progression 2025; proof-failure patterns from 2024–2025 reports).
- Full detail: `INTERMEDIATE_DEEP_RESEARCH.md` (primary-source competition and curriculum research), `INTERMEDIATE_CURRICULUM_MAP.md` (topic-to-tier rationale) and `INTERMEDIATE_KS4_UKMT_AUDIT.md` (this audit, including the fresh codebase inventory and content-gap keyword search).
- A supplementary pass covering the 2026 IMC and 2026 Cayley/Hamilton/Maclaurin cycle was commissioned to extend the sampled decade toward Junior's consecutive-year standard; fold its results into the audit document in place when it returns rather than starting a new file.

## Architectural decision: topic list unchanged

Keep the confirmed 28-topic list and its existing `order`/`tier`/`dia` metadata in `generators/intermediate-generators.js`. No topic needs merging, dropping or renaming — every one already maps to a real GCSE strand or a named UKMT device. New GCSE content that is currently missing should extend the most natural existing topic rather than create narrow one-off topics:

- vectors and vector proof: substantial enough to justify their own topic or a clearly-scoped major section in the geometry cluster;
- bearings and sector/arc: extend Trigonometry or a geometry topic;
- circle equations and tangents in coordinate form: extend Coordinate Geometry;
- scatter graphs, correlation and sampling: extend Advanced Statistics;
- set notation: extend Quadratics or Algebraic Manipulation.

`tier: "higher"` already gates 10 topics out of mocks before Level 7 in `KangarooMathsQuest.jsx`'s `buildPaper()`. Preserve that gate. Fixing the seven diagram topics' difficulty growth (below) restores meaning to the two `tier: "higher"` topics inside that cluster (Circle Theorems, Trigonometry), since the gate is currently protecting content that does not get harder once unlocked.

## Reasoning lenses

Every regular structure should record one primary reasoning route, consistent with Junior's model but weighted toward GCSE AO2/AO3 demand:

1. translate and model an unfamiliar or unscaffolded context (the AO3 skill GCSE reform specifically rewards);
2. work backwards or use inverse operations, including iteration;
3. enumerate systematically: cases, tables, sample spaces;
4. find structure: parity, invariants, modular behaviour, symmetry;
5. connect two topics the question does not name for the player (the sharpest AO3 discriminator in the examiner-report evidence: "given the surface area of a sphere, find the volume of the cube containing it");
6. construct and communicate a complete, correctly notated argument — the standard Cayley/Hamilton/Maclaurin markers' reports repeatedly say weak candidates fail even when their mathematics is sound.

## Difficulty contract

- **D1**: GCSE Foundation-safe form of the idea; one representation, one principal step.
- **D2**: Higher-tier form of the method in a familiar setting; two linked steps or one representation change.
- **D3**: method selection, an interacting constraint, or an AO3-style cross-topic link; IMC middle-paper reasoning.
- **D4**: grade 8-9 ceiling — multi-step unstructured problems of the kind examiner reports say strong candidates still fail (vector proof, circle geometry with coordinates, non-replacement conditional probability, a quadratic formed from algebraic fractions), Pink Kangaroo/IMC hard-quarter reasoning, or full communication demand. It stays inside the GCSE Higher specification and the regular Kangaroo/IMC pathway; it is not Cayley/Hamilton/Maclaurin-level proof, which stays in the separate Olympiad academy.

A topic's D4 must be empirically distinguishable from its D2 (different structures, not merely different numbers). The July 2026 build notes and this audit's sampling both confirm this currently fails for exactly the seven diagram topics — treat "sample 40 questions per difficulty and diff the skeleton sets" as a standing verification step for every topic touched during rebuild, not a one-off audit technique.

## Lesson contract

Same as Junior and Primary: four worked examples per teaching section (already true for all 92 Intermediate sections — do not regress this); every example carries a valid `structureId` matching a real generator structure (currently 0 of 368 — the top content-linking priority); lightest suitable Simple/State-Work-Conclude/CLEAR format chosen per example; explicit prerequisites; existing strong prose preserved.

Where a lesson already teaches content the generator cannot yet produce (the cosine rule, ½ab sin C, angles in the same segment, box plots, cubed volume ratios, Venn diagrams), fix the generator first so the `structureId` link is real, rather than retrofitting an example to point at a structure that does not match what it teaches.

## Generator contract

Same shared contract as Junior and Primary: every output exposes `structureId`, `variantId`, `representation` and `stretch`; at least five distinct structures per difficulty where the mathematics allows it; a structure may extend across difficulties only when the reasoning genuinely grows; full worked solutions.

Two specific repairs beyond the seven-topic diagram rebuild:

- `functionsAndIteration` must not regress from 5 structures at D1–D3 to 3 at D4.
- `logicAndDeduction` needs at least one more D1/D2 structure (currently 4, not 5).
- `proofTechniques` must draw with genuine randomisation, not a static pool that repeats byte-identical questions.
- Remove off-theme filler flagged in `diophantineEquations`, `estimationAndBounds`, `ratioProportionAlgebraic` and `advancedProbability` that dilutes each topic's stated skill.

## Migration rules

- Work in batches, prioritised by the audit: (1) the seven diagram topics, since they carry the sharpest evidence and include two `tier: "higher"` topics; (2) the missing-content list, homed into existing topics per the architectural decision above; (3) the two regression fixes and static-pool fix in the otherwise-sound 21-topic cluster; (4) `structureId` attachment across all 368 lesson examples, only once the generator each example points to actually exists; (5) the full first-time-learner slow-teaching editorial pass, expected to need less rewriting here than it did for Junior or Primary given the spot-checked prose quality, but not to be skipped or assumed complete.
- Reuse before rewriting: the lesson prose spot-checked in the audit (Surds & Indices, Circle Theorems, Trigonometry, Statistics) is already close to the standard `LESSON_EDITOR_AGENT.md` asks for.
- Run `node scripts/audit_intermediate_progression.cjs` and `node scripts/gen_sanity_test_intermediate.cjs` after each batch. The progression script is evidence-gathering, not a strict pass/fail gate, until the rebuild is far enough along that a genuine completion bar makes sense (mirroring how Junior's and Primary's progression audits only became gates after their architecture was rebuilt).
- Keep the Olympiad academy (Cayley/Hamilton/Maclaurin) untouched by this workstream; audit or rebuild it separately if needed.

## Done (2 September 2026)

- All seven diagram topics now have a real `pickStructure` registry (`CIRCLE_THEOREMS_AND_TANGENTS_STRUCTURES`, `TRIGONOMETRY_ADVANCED_STRUCTURES`, `SIMILAR_SHAPES_AND_SCALE_FACTORS_STRUCTURES`, `MULTI_STEP_GEOMETRY_PROOF_STRUCTURES`, `COORDINATE_GEOMETRY_STRUCTURES`, `THREE_D_GEOMETRY_AND_NETS_STRUCTURES`, `STATISTICS_ADVANCED_STRUCTURES`), each registered in `INTERMEDIATE_STRUCTURES`, each with 5+ genuine structures at every difficulty and real D3/D4 growth (verified empirically, not just by code reading).
- Vectors are the only major missing-content item from the audit not yet homed anywhere (still needs its own topic/section — see below). Circle equations, bearings, sector/arc, sampling, scatter graphs/correlation, and set-notation-adjacent content (frustum, density) now have generator coverage; box plots, cosine rule, ½ab sinC and cubed-volume-ratio are now generator-tested, not just lesson-taught.
- `functionsAndIteration` and `logicAndDeduction` (`clue_elimination_2clue`) reliability fixes landed (see audit addendum for detail).
- A latent `buildMCStr` decoy-collision bug class was found and fixed across several topics (old and new) — see the audit document's remediation note. Treat this as a standing verification step for any future generator work in this codebase: sample a structure a few hundred times before trusting a fixed decoy candidate list.
- `node scripts/gen_sanity_test_intermediate.cjs` passes 0 fails across repeated runs (~563,000 checks). `node scripts/audit_intermediate_progression.cjs` confirms 0/28 topics have identical D2-D4 structure-skeleton sets (was 7/28) and full metadata on every topic.

## Done (2 September 2026, phase 2 — lesson linking)

- **Every lesson example and try-it prompt now carries a `structureId`**: 460/460 items across all 28 Intermediate lessons, cross-checked with 0 mismatches against the live `INTERMEDIATE_STRUCTURES` registry for each topic. This includes not just the 368 originally-scoped examples but a further 92 secondary try-it prompts that `rewriteExistingLesson` attaches on top of the base examples in 21 topics (plus `surdsAndIndices`'s directly-assigned tryits) — these were only discovered once the coverage-check script was extended to look at `section.tryit` as well as `section.examples`. See `INTERMEDIATE_KS4_UKMT_AUDIT.md`'s "Remediation status: lessons (phase 2) complete" for the full method and verification steps (`node --check`, cross-check script, all three modules' sanity suites, full rebuild — all green).

## Not yet done

- **Missing content**: vectors (including vector geometric proof) still has no home anywhere in the module — this is the one substantial content gap from the audit not addressed by the generator remediation above, since it doesn't fit naturally as an extension of an existing topic the way the others did. Needs a scoping decision (new topic vs. major new section in an existing geometry topic) before building.
- **Lesson editorial pass**: the full first-time-learner slow-teaching review (`LESSON_EDITOR_AGENT.md` standard) has not been done for any of the 28 lessons. Spot-checked prose quality suggests less rewriting will be needed here than Junior/Primary required, but this has not been verified lesson-by-lesson.
- ~~The static-pool fix for `proofTechniques` and the off-theme filler in `diophantineEquations`/`estimationAndBounds`/`ratioProportionAlgebraic`/`advancedProbability`~~ — checked 2 September 2026 during the lesson-linking pass and found already resolved: the generator source comments for all four topics explicitly record the fix (e.g. "The audit-flagged off-theme d1 filler ... has been replaced entirely with genuine integer-reasoning content" on `diophantineEquations`, "off-theme d2 filler ... has been replaced with the general addition rule" on `advancedProbability`), and empirical sampling (30 draws/difficulty) confirms 21-30 distinct question texts out of 30 for every difficulty across all four topics — no byte-identical repeats. This must have been done in an earlier, unrecorded pass; the July build notes describing it as open were stale.
- The 2026 UKMT competition cycle (IMC 2026, Cayley/Hamilton/Maclaurin 2026) has been folded into `INTERMEDIATE_KS4_UKMT_AUDIT.md`'s addendum — the evidence base is current as of this writing.
