# Intermediate Module — KS4/UKMT Curriculum Map

Maps the confirmed 28-topic Intermediate generator list (`INTERMEDIATE_TOPICS` in
`generators/intermediate-generators.js`) against `INTERMEDIATE_DEEP_RESEARCH.md`
(UKMT IMC/Kangaroo/IMOK structure research + DfE/AQA GCSE KS4 curriculum research,
already completed in an earlier session — not re-run here) and the module's existing
`content/intermediate-lessons.js` metadata. Mirrors `PRIMARY_CURRICULUM_MAP.md`'s
format, but is confirmatory rather than exploratory: unlike Primary, Intermediate
already had every lesson's `order` field set (1-28, no gaps/dupes) and `tier: "higher"`
flags on 10 topics from earlier work, before this audit began.

**Tier definitions used below** (parallel to Primary's core/stretch, using this
module's existing vocabulary):
- **core** (no `tier` field) — GCSE Foundation-safe content, or Higher-adjacent
  content that both tiers substantially share (e.g. probability trees/Venn diagrams,
  which AQA does not wall off as Higher-only per the deep-research doc §4).
- **higher** (`tier: "higher"`) — confirmed Higher-tier-only GCSE content, or UKMT
  Kangaroo/IMC-signature content that goes beyond Foundation-tier GCSE (e.g. modular
  arithmetic, which isn't a GCSE topic at all but is a recurring IMC/Kangaroo hard-
  quarter device per the deep-research doc §1-2).

## Table

| order | topic key | label | strand | tier | rationale |
|---|---|---|---|---|---|
| 1 | `numberTheoryDivisibility` | Number Theory | Number | core | Divisibility/factors/primes are GCSE Foundation+Higher content (AO1 recall); natural first topic since KS4 number theory extends KS2/KS3 factors-and-multiples work already covered in Primary/Junior. |
| 2 | `algebraicManipulation` | Algebraic Manipulation | Algebra | core | Expanding/factorising/rearranging is core GCSE Foundation+Higher content and the load-bearing skill every later algebra topic depends on — correctly sequenced early. |
| 3 | `surdsAndIndices` | Surds & Indices | Number | **higher** | Confirmed Higher-tier-only per deep-research §4 ("simplifying surds and rationalising denominators"; fractional indices). Matches existing flag. |
| 4 | `percentageAndCompoundGrowth` | Compound Growth | Number / Ratio | core | Percentage change and simple compound interest are GCSE Foundation+Higher shared content; genuinely compound (iterative) growth edges toward Higher but the topic is framed at a Foundation-accessible level, so stays core. |
| 5 | `simultaneousEquations` | Simultaneous Equations | Algebra | core | Linear simultaneous equations are Foundation+Higher shared GCSE content (linear-quadratic simultaneous equations are the Higher-only extension, reserved for `quadratics`/`functionsAndIteration` instead). |
| 6 | `quadratics` | Quadratics | Algebra | **higher** | Confirmed Higher-tier-only per deep-research §4 (completing the square, quadratic formula, turning points). Matches existing flag. |
| 7 | `ratioProportionAlgebraic` | Proportion as Algebra | Ratio and proportion | **higher** | Confirmed Higher-tier-only per deep-research §4 ("direct/inverse proportion expressed algebraically, y=kx, y=k/x"). Matches existing flag. |
| 8 | `sequencesAndSeries` | Sequences | Algebra | core | Linear nth-term sequences are Foundation+Higher shared GCSE content (quadratic/geometric nth-term is the Higher extension, which the topic can lean into at its own d3/d4 without needing a separate module-level tier flag). |
| 9 | `graphsAndRatesOfChange` | Graphs & Rates | Algebra | **higher** | Confirmed Higher-tier-only per deep-research §4 (gradients of chords/tangents, area under non-linear graphs, instantaneous rate of change). Matches existing flag. |
| 10 | `surdicModularNumberTheory` | Modular Arithmetic | Number | **higher** | Not GCSE content at all (neither tier) but a recurring UKMT IMC/Kangaroo hard-quarter device per deep-research §1-2 — a genuine UKMT-signature stretch skill. Matches existing flag. Sequenced right after `surdsAndIndices` since both are Higher-only pure-number extensions. |
| 11 | `algebraicProof` | Algebraic Proof | Algebra | **higher** | Confirmed Higher-tier-only per deep-research §4, and flagged in §5 as a strong grade 8-9 discriminator ("weaker responses substituted a value for n, which cannot serve as a proof"). Matches existing flag. |
| 12 | `functionsAndIteration` | Functions & Iteration | Algebra | **higher** | Confirmed Higher-tier-only per deep-research §4 (composite/inverse functions, iteration for approximate equation solutions); §5 flags functions as "barely known even by higher-tier candidates," making this a genuine stretch skill worth deliberate practice. Matches existing flag. |
| 13 | `diophantineEquations` | Diophantine Puzzles | Number / Algebra | core | Not a named GCSE topic, but "find whole-number solutions" puzzles are a recurring accessible IMC/Kangaroo device solvable by systematic trial rather than requiring Higher-only technique, so it stays core rather than higher. |
| 14 | `combinatoricsAndCounting` | Combinatorics | Number | core | Not GCSE content (introduced at A-level), but the classic IMC/Kangaroo counting-principle puzzle; kept core since (mirroring Primary's `combinatoricsCounting`) systematic listing makes it accessible without Higher-tier algebra. |
| 15 | `advancedProbability` | Advanced Probability | Probability | core | Per deep-research §4, AQA does NOT wall off conditional probability/tree diagrams/Venn diagrams as Higher-only — both tiers cover them, so this stays core despite the "Advanced" label. |
| 16 | `invariantsAndParity` | Invariants & Parity | Number / Logic | core | Not GCSE content; a UKMT/olympiad-style reasoning device (odd/even and invariant arguments) accessible via concrete reasoning rather than Higher-only technique. |
| 17 | `logicAndDeduction` | Logic & Deduction | Logic | core | No GCSE strand at all (cross-curricular reasoning, same status as Primary's `logicGrid`); kept core here since Intermediate pupils are expected to handle harder deduction than Primary regardless of GCSE tier. |
| 18 | `optimisationAndExtremal` | Optimisation | Algebra / Number | core | "Find the maximum/minimum" puzzles are IMC/Kangaroo-signature but generally solvable by systematic reasoning at this level rather than calculus, so core rather than higher. |
| 19 | `proofTechniques` | Proof Techniques | Algebra / Logic | core | General proof strategy (direct, contradiction, counterexample) rather than the Higher-only *algebraic* proof already covered by `algebraicProof`; kept distinct and core. |
| 20 | `speedAndRelativeMotion` | Relative Motion | Ratio and proportion | core | Distance-speed-time and relative motion are Foundation+Higher shared GCSE content (compound units), reserved for the applied-topics cluster after the discrete-maths cluster (13-19). |
| 21 | `estimationAndBounds` | Bounds & Estimation | Number | core | Upper/lower bounds and error intervals are Foundation+Higher shared GCSE content. |
| 22 | `coordinateGeometry` | Coordinate Geometry | Geometry and measures | core | Straight-line coordinate geometry (gradient, midpoint, equation of a line) is Foundation+Higher shared GCSE content; circle equations are the Higher-only extension, correctly deferred to `circleTheoremsAndTangents`. First of the geometry cluster (22-27), which is deliberately sequenced last since diagram-heavy content benefits from all prior algebra/number foundations. |
| 23 | `similarShapesAndScaleFactors` | Similar Shapes | Geometry and measures | core | Linear scale factors are Foundation+Higher shared content (area/volume scale-factor ratios are the Higher extension, per deep-research §4 and the §5 finding that "only a few candidates understood how to calculate the ratio for similar volumes" — worth the topic leaning into at d3/d4 without a module-level tier flag). |
| 24 | `circleTheoremsAndTangents` | Circle Theorems | Geometry and measures | **higher** | Confirmed Higher-tier-only per deep-research §4 ("all circle theorems... circle equations & tangents"). Matches existing flag. |
| 25 | `trigonometryAdvanced` | Trigonometry | Geometry and measures | **higher** | Confirmed Higher-tier-only per deep-research §4 (sine rule, cosine rule, ½ab sinC, exact trig values). Matches existing flag. Also separately flagged in the original generator-variety audit as critically thin (only 2 structures: SOHCAHTOA + sine rule) — a priority fix during rebuild. |
| 26 | `threeDGeometryAndNets` | 3D Shapes | Geometry and measures | core | 3D volume/surface area and nets are Foundation+Higher shared GCSE content. |
| 27 | `multiStepGeometryProof` | Geometry Chains | Geometry and measures | core | Angle-chasing/multi-step geometric reasoning is Foundation+Higher shared content, though per deep-research §5 it's a genuine grade 8-9 discriminator ("reasons were not always linked clearly to working") — worth leaning into communication/justification structures at d3/d4. |
| 28 | `statisticsAdvanced` | Advanced Statistics | Statistics | **higher** | Confirmed Higher-tier-only per deep-research §4 (unequal-width histograms, cumulative frequency, box plots/IQR, inference from sampling). Matches existing flag. Correctly sequenced last, mirroring Primary's statistics-adjacent topics finishing that module. |

## Confirmed: no merge/drop/rename candidates

Every one of the 28 topics maps to either a real GCSE strand (Foundation or Higher)
or a documented, named UKMT IMC/Kangaroo/IMOK puzzle device from the existing deep
research — no two topics test the same underlying skill with no distinction, and the
existing `order`/`tier` metadata already reflects a coherent progression (foundational
number/algebra → higher-tier algebra extensions → discrete-maths/reasoning cluster →
applied topics → geometry cluster, diagram-heavy content deliberately last → statistics
finishing). No changes proposed to the topic list itself.

## Gap found and fixed (infrastructure, not content): `tier: "higher"` was unused

The `tier: "higher"` flag has existed on 10 `INTERMEDIATE_TOPICS` entries since an
earlier session but was never read anywhere in `KangarooMathsQuest.jsx` — Mock Test's
`buildPaper()` pulled from the full topic pool regardless of level, so "Higher-tier"
Intermediate content could appear in a level-1 mock paper alongside foundational
content. This is the exact same gap Primary had with `stretch` before this session's
Phase 1 infrastructure work fixed it. Applied the identical fix here: `buildPaper` now
filters `tier === "higher"` topics out of the mock pool before tower level 7, matching
Primary's `stretch` semantics exactly (Practice mode is unaffected — it still shows
all topics regardless of level, same as Primary).

## Rebuild priority notes (carried into the topic-by-topic pass)

From the original generator-variety audit, already known before this rebuild starts:
- **7 topics have zero difficulty differentiation above d2** (d2≡d3≡d4 identical
  structure pool): `circleTheoremsAndTangents`, `trigonometryAdvanced`,
  `similarShapesAndScaleFactors`, `multiStepGeometryProof`, `coordinateGeometry`,
  `threeDGeometryAndNets`, `statisticsAdvanced` — all 6 diagram topics plus stats.
- **Thinnest topics:** `trigonometryAdvanced` (2 structures: SOHCAHTOA + sine rule
  only — missing cosine rule, area=½ab sinC, inverse trig, bearings) and
  `multiStepGeometryProof` (3 structures only).
- `proofTechniques` draws from a fixed 5-item pool with **zero randomisation** —
  byte-identical question text on repeat. `logicAndDeduction`'s tier3 is also fully
  static.
- `algebraicProof`'s tier4 ("translate words into algebra") is a difficulty
  *regression* versus tier1 — easier and off-theme.
- Off-theme filler diluting the stated skill: `ratioProportionAlgebraic` (unit
  conversion filler), `advancedProbability` (plain fraction-of-total filler),
  `diophantineEquations` (coin-value filler with no actual equation),
  `estimationAndBounds` (standard-form-notation filler, not bounds reasoning).
- Fragile fallback: `simultaneousEquations`'s ultimate fallback can theoretically
  return null/undefined when the system is singular (a1·b2 = a2·b1) — low real-world
  risk but the `pickStructure` migration's retry-then-throw pattern fixes this as a
  side effect, same as it did for every migrated Primary topic.

## Sources

Fully carried over from the earlier session's completed research — see
`INTERMEDIATE_DEEP_RESEARCH.md` §§1-5 for the complete UKMT IMC/Kangaroo/IMOK
structure research and DfE/AQA GCSE KS4 curriculum research (13 primary sources,
all opened directly), not re-run for this audit.
