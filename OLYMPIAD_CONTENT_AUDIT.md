# Olympiad content: research + gap report (2026-09-03)

Research question: what does authoritative Olympiad-training practice say about teaching
problem-solving technique, and how does that compare to what Kangaroo Maths Quest currently
has for Junior (JMO-level) and Intermediate (IMOK/BMO1-feeder level)?

## External research: the technique canon

**Arthur Engel's *Problem-Solving Strategies*** is the most widely cited technique-organised
olympiad text and orders its chapters: invariance principle, colouring proofs, extremal
principle, the box (pigeonhole) principle, enumerative combinatorics, number theory,
inequalities, the induction principle, sequences, polynomials, functional equations, geometry,
games, further strategies.

**UKMT/JMO-specific guidance** (from UKMT materials and JMO-focused prep sources) names the
core JMO meta-skills as: counting and complementary counting, the pigeonhole principle, trying
small cases first, symmetry, invariants and parity, the extremal principle, and working
backwards — a subset of Engel's canon, appropriately scaled to age 11-14.

**IMOK (the Intermediate Olympiad — Cayley/Hamilton/Maclaurin)** explicitly states it has "no
set syllabus... not a question of extra knowledge, more one of know-how." This is an important
finding: Intermediate Olympiad is NOT a different technique set from Junior's — it is the SAME
meta-skill toolkit (invariants, pigeonhole, extremal, working backwards, casework, proof) applied
to more mathematically mature content, at a much stricter standard of written rigour.

**BMO1** (which IMOK feeds into) adds genuinely new material appropriate to GCSE-and-beyond
maturity: algebraic inequalities (AM-GM, Cauchy-Schwarz), functional equations, deeper number
theory (modular arithmetic, divisibility proofs), and formal induction. It also names two
specific, teachable rigour failures that cost real marks every year: dividing by an expression
without checking it isn't zero, and ignoring equality/boundary conditions in an inequality.

**Proof-writing pedagogy** (AoPS and others) converges on: plan before writing (state what must
be proved, identify any lemmas), know the four basic proof shapes (direct, contradiction,
induction, contrapositive), work backwards from the goal when the forward path isn't obvious,
label and define everything before using it, and verify the finished argument against the
original conditions.

## What Junior already has

Junior's Olympiad Academy (`JUNIOR_ACADEMY`, `generators/junior-generators.js`) is a genuine,
already-built 18-module course, plus a 40-problem self-marked written test bank
(`JUNIOR_OLYMPIAD`) and a short 4-step playbook (`JUNIOR_OLYMPIAD_PLAYBOOK`). It is presented as
a book-style reader identical to the regular lessons, with named creature tutors, and — this is
its strongest feature — **every "write" step and every test problem carries a genuine
criterion-by-criterion mark scheme that mirrors how the real JMO separates method marks from the
final accuracy mark**, self-ticked by the child against a revealed model solution.

Checked against the external canon, 7 of 9 classic techniques already have a dedicated module:
working backwards (m2, m11), systematic enumeration (m5), pigeonhole (m12), invariants/parity
(m9, m13), the extremal principle (m6), proof by contradiction (m18), and full justified
solution-writing (m1, m3, m7, m8 — the connective thread of the whole course). The writing voice
is consistently warm, patient and non-condescending throughout, with no module notably thinner
than another.

**Two gaps against the canon**: colouring arguments have no dedicated module (only folded in as
one example inside the invariants module, m13); symmetry arguments exist only narrowly, scoped
to numeric pairing (Gauss-sum style), not the wider family of symmetric combinatorial or
geometric arguments.

**One gap against the "fully verbose, slow" bar you set for the regular curriculum**: each
Academy module has exactly **one** worked example before its self-marked write task, versus the
now-established 4-examples-per-section standard everywhere else in the app (confirmed this
session for Primary, Intermediate, and Junior's own regular curriculum). The voice quality per
example is good, but there is only one demonstration of each technique before a student is
asked to apply it cold in free response — this is the main quantitative shortfall, not writing
quality.

## What Intermediate has

Nothing. `INTERMEDIATE_OLYMPIAD_PLAYBOOK = { steps: [], tactics: [] }`,
`INTERMEDIATE_OLYMPIAD = []`, `INTERMEDIATE_ACADEMY = []` — three confirmed-empty stubs in
`generators/intermediate-generators.js`, with a comment noting the intent ("unlocked at chapter
8") but no content ever written. The "Gifford School of Written Mathematics" screen title
already exists in the UI and the book-reader/self-marking mechanism is fully generic and
module-agnostic — the infrastructure Junior uses would work unmodified for Intermediate; only
the content (`INTERMEDIATE_ACADEMY`, `INTERMEDIATE_OLYMPIAD`, `INTERMEDIATE_OLYMPIAD_PLAYBOOK`)
needs writing.

## What this means for the rewrite

1. **Junior**: not a rebuild — a deepening pass. Add colouring arguments as its own module (9
   modules → keep the existing sequence, insert one). Broaden the symmetry module beyond numeric
   pairing. Most importantly, bring every module from 1 worked example up to a real multi-example
   progression (matching the "fully verbose, slow" standard already applied to the regular
   curriculum this session), while preserving the existing voice, tutors and mark-scheme
   mechanism, which are already good and shouldn't be rebuilt from scratch.
2. **Intermediate**: a genuine build from zero. It should reuse Junior's same 9-10 core
   techniques (this is externally validated — IMOK itself says Intermediate Olympiad is "know-how,
   not extra knowledge") applied to GCSE-level mathematical content, THEN add the
   Intermediate-specific new material BMO1 preparation calls for: algebraic inequalities (AM-GM,
   Cauchy-Schwarz basics), functional equations, formal induction, and deeper number theory — plus
   explicit teaching of the two named rigour failures (unjustified division by a possibly-zero
   expression; ignoring equality/boundary cases in inequalities), since those are concretely
   documented as the two most common ways marks are lost.
3. Both should keep the existing self-marked, criterion-by-criterion mark-scheme mechanism
   (`write` steps + revealed model solution + self-tick) — it already faithfully mirrors real
   competition marking and doesn't need to change, only the volume and breadth of content sitting
   on top of it.
