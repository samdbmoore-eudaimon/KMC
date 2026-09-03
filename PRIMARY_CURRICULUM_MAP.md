# Primary Module — KS2 Curriculum Map

Maps the confirmed 25-topic Primary generator list (`PRIMARY_TOPICS` /
`PRIMARY_CONCEPTS` in `generators/primary-generators.js`) against the current DfE
National Curriculum in England KS1&2 mathematics programme of study, plus what
research turned up on the actual Primary Maths Challenge (PMC) format and on DfE's
"greater depth" KS2 characterisation. This does not revisit or second-guess the
25-topic list itself (see `MODULE_EXPANSION_PLAN.md` lines 21-33, 280-297 for how it
was built and confirmed with Sam) — it only adds strand/year mapping, a core/stretch
tier, and a proposed teaching order on top of it.

**Tier definitions used below** (per the brief):
- **core** — mainstream KS2 Y4-6 content, available in-app from mock level 1.
- **stretch** — genuine "greater depth"/gifted content, or a PMC-signature puzzle
  skill that goes beyond typical classroom expectation; held back to mock level 7+,
  but still gets a full difficulty range built out.

## Table

**2026-08-29 update:** a `negativeNumbers` topic was added (see row 3) — the original audit below missed that negative numbers are a real NC KS2 requirement (Y4 "count backwards through zero"; Y5/6 "use negative numbers in context, calculate intervals across zero"). Inserted early since it only needs number-line/place-value understanding, not multiplication/fractions/ratio. Everything from `timesTablesFacts` onward shifted up by one order position accordingly. Negative-number examples are also being folded into `placeValue` (Y4 counting-through-zero) and `additiveMultiplicative` (Y6 interval-across-zero) as extra structures within those topics.

| order | topic key | label | KS2 strand(s) | year(s) | tier | rationale |
|---|---|---|---|---|---|---|
| 1 | `placeValue` | Place Value | Number — number and place value | Y3–5 (esp. Y4–5 for numbers to 10,000/1,000,000) | core | Textbook NC place-value strand; foundational, taught from Y3 onward. |
| 2 | `roundingEstimate` | Rounding & Estimating | Number — number and place value | Y4–5 (round to 10/100/1000/any degree of accuracy) | core | Directly named in the NC place-value strand for Y4 and Y5. |
| 3 | `negativeNumbers` | Negative Numbers | Number — number and place value | Y4 (count through zero); Y5–6 (negative numbers in context, intervals across zero) | core | Explicit NC objective, missed by the original audit — added 2026-08-29. Only depends on number-line/place-value understanding, so sits early. |
| 4 | `compensationMentalMaths` | Mental Maths Shortcuts | Number — addition and subtraction; Number — multiplication and division | Y3–6 | core | NC requires mental strategies for all four operations every year; DfE/NCETM's "additive/multiplicative reasoning" ready-to-progress strands cover exactly this compensation skill as mainstream progression, not GDS-only content. |
| 5 | `timesTablesFacts` | Times Tables | Number — multiplication and division | Y3–4 (tables to 12×12 by end of Y4, statutory) | core | Explicit, statutory NC Y4 objective ("recall multiplication and division facts for multiplication tables up to 12×12"). |
| 6 | `factorsMultiplesPrimes` | Factors & Multiples | Number — multiplication and division | Y5 (factors, multiples, prime/composite numbers explicit Y5 objectives) | core | Named Y5 NC objectives ("identify multiples and factors... recognise prime numbers up to 19"). |
| 7 | `formalMultiplication` | Column Multiplication | Number — multiplication and division | Y5–6 (formal written methods for multi-digit numbers) | core | NC Y5/Y6 statutory requirement to multiply using formal written layout. |
| 8 | `divisionRemainders` | Division & Remainders | Number — multiplication and division | Y4–6 (interpreting remainders per context is an explicit Y5/6 objective) | core | NC Y5/6 explicitly requires interpreting remainders "according to the context". |
| 9 | `formalDivision` | Long Division | Number — multiplication and division | Y5–6 (short/long division of multi-digit numbers) | core | NC Y6 statutory requirement for formal long division. |
| 10 | `fractionOfQuantity` | Fraction of an Amount | Number — fractions (including decimals and percentages) | Y4–6 (extends a Y2/3 skill to larger/harder amounts) | core | Directly named NC objective every year from Y2 up ("find fractions of amounts"), scaled up through KS2. |
| 11 | `fractionEquivalence` | Equivalent Fractions | Number — fractions (including decimals and percentages) | Y4–5 (equivalent fractions, simplifying) | core | Explicit Y4/Y5 NC objectives on recognising and simplifying equivalent fractions. |
| 12 | `fractionArithmetic` | Adding Fractions | Number — fractions (including decimals and percentages) | Y3–6 (adding/subtracting fractions, increasing in complexity) | core | NC objective present every year from Y3, building to unlike denominators and mixed numbers by Y6. |
| 13 | `decimalPlaceValue` | Decimals | Number — fractions (including decimals and percentages); Number — number and place value | Y4–6 | core | NC decimal place value is explicitly folded into the "fractions" strand heading from Y4 onward. |
| 14 | `ratioBasics` | Ratio | Ratio and proportion | Y6 only | core | "Ratio and proportion" is a named NC heading that exists only in Y6 — squarely mainstream Y6 content despite being a single-year strand. |
| 15 | `twoUnknowns` | Two Mystery Numbers | Algebra | Y6 only | core | Matches the NC Y6 Algebra objective verbatim: "find pairs of numbers that satisfy an equation with two unknowns". |
| 16 | `additiveMultiplicative` | More Than vs Times As Many | Number — addition and subtraction; Number — multiplication and division; Ratio and proportion | Y5–6 | core | Matches the DfE/NCETM ready-to-progress "multiplicative reasoning" strand — an explicitly mainstream Y5/6 progression theme (moving from additive to multiplicative comparison), not a GDS-exclusive skill. Will also carry the Y6 "calculate intervals across zero" negative-number structures. |
| 17 | `unitConversion` | Units & Measures | Measurement | Y3–6 (metric conversion facts build year on year) | core | NC Measurement strand, every year, explicit conversion-factor objectives from Y3 (cm/m) through Y5/6 (km, compound units). |
| 18 | `areaPerimeter` | Area & Perimeter | Measurement | Y4–6 (perimeter Y4, area of rectangles Y4–5, compound-shape area Y5–6) | core | Explicit NC Measurement objectives at each of those year levels. |
| 19 | `timeCalendar` | Time & Calendar | Measurement | Y3–4 (telling time, converting units of time; calendar/leap-year facts non-statutory extension) | core | Time is a named NC Measurement objective in Y3/Y4; leap-year/calendar-cycle reasoning is a natural, common classroom extension of it. |
| 20 | `shapeProperties` | Shape Properties | Geometry — properties of shapes | Y3–6 (2D/3D shape classification, coordinates and translation from Y4–6) | core | Core NC Geometry strand present in every KS2 year. |
| 21 | `angleBasics` | Angles | Geometry — properties of shapes | Y4–6 (angle facts on a line/at a point Y5, angle sum of a triangle Y6) | core | Explicit NC Y5/Y6 Geometry — properties of shapes objectives. |
| 22 | `symmetryReflection` | Symmetry | Geometry — position and direction | Y4–6 (reflection and translation in NC Y4–6; symmetry itself is non-statutory but is the standard companion skill taught alongside reflection every year) | core | NC "position and direction" explicitly covers reflection/coordinates Y4–6; line/rotational symmetry is the conventional pairing taught alongside it in every KS2 scheme of work. |
| 23 | `sequencePattern` | Patterns & Sequences | Algebra (Y6: "generate and describe linear number sequences"); informal pattern-spotting is non-statutory across Y1–5 | Y6 (statutory), scaffolded earlier | core | Sits on the NC Y6 Algebra heading; the app's cyclic/"find position N in a repeating pattern" framing is a very common KS2 mastery-classroom reasoning-question style, not exclusive to competition papers, so it stays core despite also being a favourite PMC device. |
| 24 | `logicGrid` | Logic Puzzles | No direct KS2 NC strand — cross-curricular reasoning/deduction | N/A (not year-specific; used as an enrichment/reasoning activity across KS2) | stretch | Doesn't map to any NC content strand at all; matches the DfE 2018 KS2 "working at greater depth" exemplification's emphasis on systematic working and testing possibilities exhaustively, and matches the app's own observation that real PMC papers lean heavily on clue-based deduction — a genuine step beyond mainstream classroom expectation. |
| 25 | `combinatoricsCounting` | Counting Possibilities | Weak link to Number — multiplication and division (systematic counting); not a named KS2 strand | N/A | stretch | Enumerating arrangements/combinations is not KS2 NC content (it isn't introduced until GCSE); it is, however, a recurring PMC "how many ways" puzzle type — a real PMC-signature stretch skill, not an invented one. |
| 26 | `spatialPuzzles` | Spatial Puzzles | Loosely Geometry — properties of shapes (Y5 "nets of 3D shapes" gives a toehold) but the fold/cut/rotate-and-view style goes beyond that objective | N/A | stretch | The one NC hook (Y5 nets) covers only a fraction of what this topic actually tests; folding-paper and view-from-an-angle puzzles are exactly what the app's own research (`MODULE_EXPANSION_PLAN.md` line 284-286) found dominates real PMC papers, and the DfE GDS exemplification's "non-routine, unfamiliar problem" characterisation fits this topic better than any other in the list. |

## PROPOSED CHANGES — NEEDS SAM'S SIGN-OFF

None — the existing 25-topic list holds up well against current NC/PMC research. No
two topics test the same underlying skill with no curriculum distinction, and every
topic maps to either a real KS2 NC strand or a documented PMC puzzle style (the three
flagged `stretch` topics — `logicGrid`, `combinatoricsCounting`, `spatialPuzzles` —
are real PMC content, just not NC-curriculum content, which is why they're a tier
call rather than a "doesn't belong" call).

One factual note worth flagging even though it needs no action: the Primary Maths
Challenge is organised by **The Mathematical Association**, not UKMT — the app's own
planning notes (and this brief) refer to it as "run by UKMT / Primary Maths Challenge
organisers", which is technically imprecise but doesn't affect any content decision
here.

## Sources

- [National curriculum in England: mathematics programmes of study (GOV.UK, HTML)](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study) — used to confirm the exact Y3–Y6 strand headings, and that "Ratio and proportion" and "Algebra" appear only as Y6 headings.
- [National curriculum in England: mathematics programmes of study — key stages 1 and 2 (PDF, GOV.UK assets)](https://assets.publishing.service.gov.uk/media/5a81a9abe5274a2e8ab55319/PRIMARY_national_curriculum.pdf) — the underlying statutory document (PDF text extraction failed in this session; the HTML page above supplied the same content in readable form).
- [2018 key stage 2 teacher assessment exemplification materials — mathematics, working at greater depth ("Frankie")](https://assets.publishing.service.gov.uk/media/5a81e17540f0b62302699a9e/2018_exemplification_materials_KS2-GDS__Frankie_.pdf) — DfE's own "greater depth" characterisation for KS2 maths: reasoning/justification, multi-step and non-routine problems, working systematically, ratio/algebra/geometry applied with sophistication. Used to ground the `stretch` tier calls.
- [The new DfE Mathematics Guidance for KS1 and KS2 — Oxford Education Blog](https://educationblog.oup.com/primary/the-new-dfe-mathematics-guidance-for-ks1-and-ks2) and [Ready To Progress? — Third Space Learning](https://thirdspacelearning.com/blog/ready-to-progress-criteria-mathematics/) — background on the DfE/NCETM June 2020 "Mathematics guidance: key stages 1 and 2" (ready-to-progress criteria), confirming this is a progression/sequencing document, not a "greater depth" document, and that multiplicative reasoning is treated as mainstream Y5/6 progression content rather than GDS-exclusive.
- [Primary Maths Challenge — About the PMC](https://www.primarymathschallenge.org.uk/about-the-pmc) and [Primary Maths Challenge — PMC Past Papers](https://www.primarymathschallenge.org.uk/downloads) — confirms PMC is run by The Mathematical Association (ages 9–11), 25 questions/45 minutes, 20 multiple-choice rising in difficulty plus 5 write-in answers, problem-solving/reasoning style rather than reliant on formal knowledge — consistent with this app's own prior finding that real papers lean heavily on pattern completion, folding, cube-nets and clue-based deduction.
