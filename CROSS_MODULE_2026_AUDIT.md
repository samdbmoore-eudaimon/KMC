# Cross-module audit — Primary, Junior, Intermediate (2026-09-03)

Read-only audit against the standard in `LEARNING_MODULE_REQUIREMENTS.md` plus the session's specific bar: genuine D1-D4 generator scaling with ≥5 verbal structures per difficulty (narrow exact-geometry topics excepted), verbose jargon-free lessons at a ten-year-old's reading level, exactly 4 escalating examples per section, State→Work→Outcome (full CLEAR on the hardest), an `order` number on every lesson with no forward-referenced unexplained terms, and accurate prereq links (including cross-module).

No files were edited during the audit itself. Fixes already applied this session (before the audit ran): merged/deduplicated `surdsAndIndices`, and re-homed 4 dead `.visual` mutations + deleted 3 dead `numberTheoryDivisibility` mutations that a full-replacement rewrite was silently discarding.

## Severity ranking

**Intermediate: clean.** **Primary: clean, minor bugs.** **Junior: clean** — see the corrected section below; the original pass here mistakenly audited superseded legacy code instead of the live 33-topic curriculum.

---

## Intermediate (Gifford)

- Generators: all 29 topics have ≥5 structures at every D1-D4 band, 0 empty bands, D4 independently confirmed as genuinely harder (not "D1 with bigger numbers") across the board.
- Two minor generator bugs: `surdsAndIndices`' `neg_frac_index_eval` can draw an unreduced exponent like "-2/2"; `simultaneousEquations`' `word_problem_two_totals` prints "1 pen(s)" instead of "1 pen".
- Lessons: all 29 have unique `order` 1-29, no gaps/dupes. Prereqs all resolve. All 108 sections have exactly 4 examples, genuinely escalating. Jargon/verbosity sample (11 lessons across the order range) found no issues — terms are built from scratch even at GCSE level.
- Two lesson/generator alignment gaps: `simultaneousEquations`'s lesson only teaches linear-linear systems, but D3/D4 generators test line-meets-hyperbola, line-meets-parabola and no-solution conditions never taught. `graphsAndRatesOfChange`'s D4 generators use "chord"/"tangent"/"acceleration" framing the lesson never introduces.
- No remaining shadowed/dead lesson content (independently re-verified). All 524 structureIds across all lessons resolve to real generator structures.
- Recommendation: keep the lighter `understand/steps/answer/check` schema rather than retrofitting Junior/Primary's `solutionFormat`/`clear` schema — the prose already carries full State→Work→Outcome reasoning without it.

## Primary (Ninefold Orchard)

- Generators: 0 empty bands anywhere, minimum 5 across all 30 topics. Real "D4 = D1 with bigger numbers" bugs: `percentages`' `convert_percent_forms` ignores difficulty entirely; `statistics`' `mean_average` only widens the random range; same pattern in `timesTablesFacts` (`double_scale_both_sides`/`reverse_scale`), `formalMultiplication`/`formalDivision` (`long_multiplication_2digit_full`/`long_division_2digit_divisor` — same method already required at D3), and `areaPerimeter` (`composite_two_rectangles_area`).
- Lessons: all 30 have unique `order` 1-30, no gaps/dupes (one soft sequencing oddity: `fractionOfQuantity` at order 12 precedes the more foundational `fractionEquivalence` at 13 — self-contained, not a hard failure). Prereqs all resolve, all orders correctly earlier than the lessons citing them. All 300 sections have exactly 4 genuinely escalating examples.
- **Genuine forward-reference jargon bug** (exactly the class asked for): `statistics` (order 23) uses "vertical axis" without defining "axis" — the lessons that actually teach axis vocabulary (`shapeProperties`, `symmetryReflection`) sit at orders 24 and 26, *after* it.
- Also flagged: `compensationMentalMaths` uses "invariants" once, unexplained, never reused. `areaPerimeter` states perimeter is "never cm²" before squared units are explained two sections later in the same lesson (minor, self-healing).

## Junior (The Kangaroo Quest) — CORRECTED, see below

**This section was wrong in the original pass and has been corrected (2026-09-03).** The findings originally recorded here (45 legacy generator functions with no `d` parameter, no `order`/`prereq` fields, always-3-examples, etc.) were all real — but they describe the *pre-1-September legacy content*, not the module a player actually sees. A 1 September 2026 rebuild (documented in `JUNIOR_LEARNING_MEMORY.md`) replaced the visible Junior curriculum with 33 KS3-aligned topics (26 core + 7 UKMT logic extensions), built by `content/junior-curriculum-overlay.js` and `generators/junior-curriculum-overlay.js` at load time. Those overlays *consume* most of the old 44/45 legacy lessons/generators as raw source material (via `sourceExamples()` and `runLegacy()`), so the legacy code is a live dependency, not dead weight, for all but one topic.

**Verified ground truth**, via the module's own dedicated gate, `scripts/audit_junior_progression.cjs` (run directly, not inferred):
```
Visible topics: 33 (26 KS3 core + 7 UKMT logic extensions)
Lessons: 33; teaching sections: 164; worked examples: 656
Registered structures: 165; mock levels checked: 10
Findings: 0
```
That script verifies, per visible topic: a real lesson and generator exist, ≥5 structures spanning all of D1-D4, every structure is sampled and genuinely reachable at every difficulty (not just declared), every example is staged D1-D4 with a valid `structureId`, `order`/`prereq` resolve with no duplicates, and mock-level topic/structure/variant uniqueness holds. Zero findings. `JUNIOR_LEARNING_MEMORY.md` additionally documents a completed slow-teaching/language pass across all 656 examples (7 Simple, 558 State→Work→Conclude, 91 CLEAR).

**Archiving performed this session**: of the 45 pre-1-September `JUNIOR_G` functions and 44 `JUNIOR_LESSONS` objects, only **one topic, `calendar`**, was confirmed genuinely unreferenced by either overlay (on both the lesson and generator side) — archived to `archive/junior-calendar-legacy.md` and removed from the live files. Two dead metadata arrays (`JUNIOR_LEGACY_TOPICS`, `JUNIOR_LEGACY_DEEP_TOPICS` in `generators/gen-shared.js`, unused label/emoji lists superseded by `JUNIOR_TOPICS`) were removed too. Everything else in the 44/45 legacy set remains load-bearing and was left in place. All four dedicated test suites (junior/primary/intermediate sanity, `audit_junior_progression.cjs`, `audit_lesson_experience.cjs`) still pass 0 findings/fails after the archiving.

**Lesson for future audits of this module**: always check `scripts/audit_junior_progression.cjs` and the two `*-curriculum-overlay.js` files before drawing conclusions from `content/junior-lessons.js` or `generators/junior-generators.js` in isolation — reading either raw file alone reproduces this exact mistake.

## Suggested priority order for a future remediation pass

1. Primary: fix the 5 "ignores difficulty" generator bugs (`percentages`, `statistics`, `timesTablesFacts` ×2, `formalMultiplication`/`formalDivision`, `areaPerimeter`) and the `statistics`/axis-vocabulary forward reference.
2. Intermediate: fix the 2 minor generator bugs and close the 2 lesson/generator alignment gaps (`simultaneousEquations`, `graphsAndRatesOfChange`).
3. Junior: no known outstanding issues as of this correction — its own audit gate reports 0 findings.
