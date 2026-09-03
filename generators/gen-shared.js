// generators/gen-shared.js — shared utilities, topic lists, name pools and
// active-module live bindings, exported for all generator files and the main app.
import { CONTENT_MODULES, LESSONS } from '../kq-content.js';


/* ============================================================
   KANGAROO MATHS QUEST  (Years 7-9)
   Ten quest levels across four generator difficulty bands
   + Player profiles with progress saved across sessions
   All questions are ORIGINAL, written in UKMT style, not reproductions.
   ============================================================ */

export const T = {
  cream: "#fef4e4", cream2: "#ffe7c4", ink: "#2a1a5e", inkSoft: "#5b4a8a",
  violet: "#7c5cff", violetDk: "#5b3df0", coral: "#ff6b4a", yellow: "#ffc93c",
  teal: "#22c8b8", pink: "#ff5d8f", green: "#2fc97a", red: "#ff4d6d", white: "#ffffff",
  // "Quest" chrome — pulled from the title/card art palette (dusk sky + gold trim), used
  // to give Home a fantasy-adventure-board feel without touching every other screen's
  // existing light cream look.
  gold: "#f2b73c", goldLight: "#ffe6a3", goldDk: "#a8650f",
  nightDeep: "#1c1330", nightMid: "#362152", parchment: "#fffaf0", parchment2: "#fff1d6",
};
export const DIFF_LABELS = ["Warm-up", "Challenge", "Hard", "Year 9+"];

/* ---------------- helpers ---------------- */
export const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export function shuffle(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
export function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
export function buildMC(correct, distractors, fmt = (x) => String(x)) {
  // Dedup on the DISPLAYED string, not the raw value — reduced-precision formatting (e.g.
  // toFixed(2)) can make two genuinely different raw numbers print identically, which used to
  // slip through as a visible duplicate option.
  const seenDisplay = new Set([fmt(correct)]); const pool = [];
  for (const d of distractors) if (Number.isFinite(d) && !seenDisplay.has(fmt(d)) && (d >= 0 || correct < 0)) { seenDisplay.add(fmt(d)); pool.push(d); }
  let guard = 0;
  // Match each fallback candidate's decimal precision to `correct`'s own. Plain
  // `correct + delta` floating-point addition can land 1 ULP off a "clean" decimal (e.g.
  // 15.3 + 3 computing to the double that prints as "18.300000000000004"), producing a
  // visible float-noise decoy next to otherwise-clean options. Rounding to correct's own
  // decimal-place count keeps every fallback candidate the same visible shape.
  const correctStr = String(correct);
  const dotIdx = correctStr.indexOf(".");
  const correctDp = dotIdx === -1 ? 0 : correctStr.length - dotIdx - 1;
  while (pool.length < 4 && guard < 300) {
    guard++; const delta = rand(1, 9) * (Math.random() < 0.5 ? -1 : 1);
    let cand = correct + delta;
    if (correctDp > 0) { const scale = Math.pow(10, correctDp); cand = Math.round(cand * scale) / scale; }
    if (Number.isFinite(cand) && !seenDisplay.has(fmt(cand)) && (cand >= 0 || correct < 0)) { seenDisplay.add(fmt(cand)); pool.push(cand); }
  }
  const opts = shuffle([correct, ...pool.slice(0, 4)]);
  return { options: opts.map(fmt), correctIndex: opts.indexOf(correct) };
}
export function buildMCStr(correct, distractors) {
  const seen = new Set([correct]); const pool = [];
  for (const d of distractors) if (d != null && !seen.has(d)) { seen.add(d); pool.push(d); }
  while (pool.length < 4) pool.push(correct + "·" + pool.length);
  const opts = shuffle([correct, ...pool.slice(0, 4)]);
  return { options: opts, correctIndex: opts.indexOf(correct) };
}
export const gbp = (x) => "£" + x;
export const deg = (x) => x + "°";
export function simplifyFrac(n, d) { const g = gcd(n, d); return [n / g, d / g]; }
// Structure registry picker: registry = { [structureId]: { difficulties: [1-4...], build(d) => q|null } }.
// Replaces the ad hoc "bank = d<=2 ? tier1 : tier2; while(!result){result=pick(bank)()} return result || G.topic(d)"
// pattern duplicated across every topic — one safe fallback path instead of N slightly-different ones, and every
// migrated topic gets a genuine structureId on its output for free. Retries within the difficulty-eligible pool
// first; only widens to the full registry if every eligible structure fails `tries` times (keeps generate() total
// rather than throwing on a merely-unlucky run, while still surfacing a real authoring bug via the final throw).
export function pickStructure(registry, d, { tries = 12 } = {}) {
  const eligible = Object.entries(registry).filter(([, s]) => s.difficulties.includes(d));
  const pool = eligible.length ? eligible : Object.entries(registry);
  for (let i = 0; i < tries; i++) {
    const [id, s] = pick(pool);
    const q = s.build(d);
    if (q) return { ...q, structureId: id, variantId: q.variantId || id, representation: q.representation || (q.svg ? "diagram" : "direct"), stretch: q.stretch ?? !!s.stretch };
  }
  for (const [id, s] of pool) { const q = s.build(d); if (q) return { ...q, structureId: id, variantId: q.variantId || id, representation: q.representation || (q.svg ? "diagram" : "direct"), stretch: q.stretch ?? !!s.stretch }; }
  throw new Error(`pickStructure: all structures failed for d=${d}`);
}
// Edge case §6: primaryType = index of highest stat; lowest index wins on tie.
// Used at card-generation time (never re-derived during battle).
export function computePrimaryType(s) { const m = Math.max(...s); return s.indexOf(m); }
export function normaliseJoeyCardStats(card) {
  const ranges = { common: [12, 15], uncommon: [18, 21], rare: [25, 28], epic: [33, 36], legendary: [44, 46] };
  const range = ranges[card.r];
  if (!range || !Array.isArray(card.s) || card.s.length !== 5) return card;
  const type = computePrimaryType(card.s);
  const stats = card.s.slice();
  const current = stats.reduce((sum, value) => sum + value, 0);
  const target = Math.max(range[0], Math.min(range[1], current));
  let delta = target - current;
  while (delta > 0) {
    const candidates = stats.map((value, index) => ({ value, index }))
      .filter(({ index, value }) => index !== type && value + 1 <= stats[type])
      .sort((a, b) => a.value - b.value || a.index - b.index);
    stats[candidates[0]?.index ?? type]++;
    delta--;
  }
  while (delta < 0) {
    const candidates = stats.map((value, index) => ({ value, index }))
      .filter(({ index, value }) => index !== type && value > 1)
      .sort((a, b) => b.value - a.value || b.index - a.index);
    const index = candidates[0]?.index ?? type;
    stats[index]--;
    delta++;
  }
  card.s = stats;
  card.bv = stats.reduce((sum, value) => sum + value, 0);
  card.primaryType = type;
  return card;
}
export function sup(n) { const m = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" }; return String(n).split("").map((c) => m[c] || c).join(""); }

/* ---------------- SVG helpers ---------------- */
export function svgBox(inner, w = 280, h = 220) {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;width:100%;height:auto;display:block;margin:0 auto">${inner}</svg>`;
}
export const txt = (x, y, s, opt = {}) =>
  `<text x="${x}" y="${y}" font-family="Fredoka, sans-serif" font-size="${opt.size || 15}" font-weight="600" fill="${opt.fill || T.ink}" text-anchor="${opt.anchor || "middle"}">${s}</text>`;

/* ---------------- topics ---------------- */
// JUNIOR_LEGACY_TOPICS and JUNIOR_LEGACY_DEEP_TOPICS (pre-1-September UI topic metadata,
// superseded by JUNIOR_TOPICS below) were archived 2026-09-03 to
// archive/junior-calendar-legacy.md's sibling note — confirmed imported nowhere in the
// codebase. This is distinct from the 45 JUNIOR_G generator functions and 44 JUNIOR_LESSONS
// objects of the same era, which mostly remain live (reused as raw content by
// generators/junior-curriculum-overlay.js and content/junior-curriculum-overlay.js) —
// do not assume those are dead just because these two label/emoji arrays were.
export const JUNIOR_TOPICS = [
  { key: "placeValue", label: "Place Value", emoji: "🔢", color: "#7c5cff" },
  { key: "numberProperties", label: "Number Properties", emoji: "🧩", color: "#2fc97a" },
  { key: "integerDecimalArithmetic", label: "Integer & Decimal Arithmetic", emoji: "➕", color: "#ff6b4a" },
  { key: "expressionsEquations", label: "Expressions & Equations", emoji: "🧮", color: "#2fc97a" },
  { key: "coordGeom", label: "Coordinates", emoji: "📍", color: "#22c8b8", dia: true },
  { key: "perimeterArea", label: "Perimeter & Area", emoji: "📏", color: "#ff6b4a", dia: true },
  { key: "fractionUnusual", label: "Fraction Arithmetic", emoji: "½", color: "#ff5d8f" },
  { key: "ratioChain", label: "Fractions & Ratio", emoji: "⚖️", color: "#22c8b8" },
  { key: "transformations", label: "Transformations", emoji: "🪞", color: "#ff5d8f", dia: true },
  { key: "estimation", label: "Estimation & Rounding", emoji: "🎯", color: "#ffc93c" },
  { key: "sequences", label: "Sequences", emoji: "🔁", color: "#7c5cff" },
  { key: "linearGraphs", label: "Linear Graphs", emoji: "📈", color: "#22c8b8", dia: true },
  { key: "linearEquations", label: "Linear Equations", emoji: "🟰", color: "#5b3df0" },
  { key: "percentProportion", label: "Percentages & Proportion", emoji: "%", color: "#ffc93c" },
  { key: "statisticsMeasures", label: "Statistics & Measures", emoji: "📊", color: "#ff5d8f", dia: true },
  { key: "statisticsAnalysis", label: "Statistical Analysis", emoji: "🔎", color: "#22c8b8", dia: true },
  { key: "areaVolume", label: "Area & Volume", emoji: "🧊", color: "#2fc97a", dia: true },
  { key: "polygons", label: "Polygons & Angles", emoji: "📐", color: "#ffc93c", dia: true },
  { key: "constructions", label: "Geometric Constructions", emoji: "🧭", color: "#ff6b4a", dia: true },
  { key: "similarityPythagoras", label: "Similarity & Pythagoras", emoji: "📐", color: "#3dcb78", dia: true },
  { key: "probability", label: "Probability", emoji: "🎲", color: "#22c8b8" },
  { key: "nonLinearRelations", label: "Non-linear Relationships", emoji: "〰️", color: "#7c5cff", dia: true },
  { key: "expressionsFormulae", label: "Expressions & Formulae", emoji: "🔣", color: "#5b3df0" },
  { key: "trigonometry", label: "Trigonometry", emoji: "📐", color: "#ff5d8f", dia: true },
  { key: "standardForm", label: "Standard Form", emoji: "🔬", color: "#22c8b8" },
  { key: "graphicalRepresentations", label: "Interpreting Graphs", emoji: "📉", color: "#ff6b4a", dia: true },
  { key: "truthLiars", label: "Truth & Lies", emoji: "🃏", color: "#5b3df0", logicExtension: true, mockFrom: 7 },
  { key: "seating", label: "Arrangements", emoji: "💺", color: "#ff5d8f", logicExtension: true, mockFrom: 7 },
  { key: "pigeonhole", label: "Certainty", emoji: "🎰", color: "#22c8b8", logicExtension: true, mockFrom: 7 },
  { key: "allocation", label: "Counters & Boxes", emoji: "📦", color: "#2fc97a", logicExtension: true, mockFrom: 7 },
  { key: "magicGrid", label: "Magic Grids", emoji: "🔯", color: "#e0a72e", dia: true, logicExtension: true, mockFrom: 7 },
  { key: "gridLogic", label: "Logic Grids", emoji: "🔢", color: "#5b3df0", dia: true, logicExtension: true, mockFrom: 7 },
  { key: "networkGraph", label: "Networks", emoji: "🕸️", color: "#2fc97a", dia: true, logicExtension: true, mockFrom: 7 },
];
export const JUNIOR_DEEP_TOPICS = [];
export const topicMeta = (k) => TOPICS.find((t) => t.key === k) || DEEP_TOPICS.find((t) => t.key === k) || TOPICS[0];
// Recommended-order rank (1, 2, 3...) for every core topic in the currently active module,
// shared between the Lessons list and the Practice topic picker so the same topic always
// shows the same "#N" wherever it appears. Topics whose lesson defines an explicit `order`
// (curriculum sequence) are ranked by that; everything else keeps its existing hand-curated
// position in TOPICS, via the array index as a stable tiebreaker. Deep quests aren't part of
// this sequence (they're optional extensions), so they're deliberately left unranked.
export function topicOrderIndex() {
  const ranked = TOPICS.map((t, i) => ({ key: t.key, i })).sort((a, b) => {
    const oa = LESSONS[a.key]?.order ?? Infinity, ob = LESSONS[b.key]?.order ?? Infinity;
    return oa !== ob ? oa - ob : a.i - b.i;
  });
  const map = {};
  ranked.forEach((r, idx) => { map[r.key] = idx + 1; });
  return map;
}
// Resolves a lesson `prereq` entry (a bare same-module topic key, or { module, key } pointing
// at a Junior/Primary lesson) to a display title — looked up via CONTENT_MODULES rather than
// the currently-active LESSONS variable, so it resolves correctly regardless of which module
// is currently active.
export function resolvePrereqInfo(p) {
  const key = typeof p === "string" ? p : p.key;
  const module = typeof p === "string" ? null : p.module;
  const lessonsObj = module ? CONTENT_MODULES[module]?.LESSONS : LESSONS;
  const lesson = lessonsObj ? lessonsObj[key] : null;
  const moduleLabel = module === "junior" ? "Junior Maths" : module === "primary" ? "Primary Maths" : null;
  return { key, module, title: lesson ? lesson.title.split(":")[0] : key, moduleLabel };
}

/* ---------------- teaching lessons ---------------- */
export const JUNIOR_CONCEPTS = {
  multiExpr: { idea: "BIDMAS tells you the order: Brackets, Indices, Division/Multiplication, then Addition/Subtraction.", method: ["Evaluate each expression step by step.", "Multiplication and division before addition and subtraction.", "Compare all results to find largest or smallest."], tip: "Write out each step — don't try to do it all in your head. If a calculation is wrong by a small amount, increasing one number by 1 changes the result by a predictable amount depending on its role in the expression.", watch: "BIDMAS can mislead: 10 − 2 + 5 is 13, not 3. Addition and subtraction have EQUAL rank and are worked left to right. Same goes for × and ÷." },
  countIntegers: { idea: "Systematic checking is the key — work through possibilities in order.", method: ["Set up the condition clearly (e.g. one digit = 2 × other).", "Test each candidate in the range.", "Keep a tally to avoid missing any."], tip: "A table of tens digit vs units digit often helps.", watch: "Being systematic IS the maths: list candidates in order so you can prove nothing was missed, not just hope." },
  modular: { idea: "Cyclic patterns repeat. Find the cycle length, then use the remainder.", method: ["Hours cycle in 24; days in 7.", "Divide the total by the cycle length.", "The remainder tells you where you land."], tip: "Always check your answer by adding the remainder back on." },
  fractionUnusual: { idea: "To compare fractions, convert to a common denominator or to decimals.", method: ["Find which fraction is closest to the target by comparing distances.", "For arithmetic, find LCM of denominators.", "Always simplify your answer."], tip: "Convert to decimals for comparison problems.", watch: "Don't treat decimals like whole numbers: 0.35 < 0.5 even though 35 > 5. Line up place value before comparing." },
  cryptarith: { idea: "Use algebra or systematic trial: each letter stands for a distinct digit.", method: ["Set up the column arithmetic carefully.", "Use constraints (e.g. the sum must fit in a certain number of digits).", "Narrow down possibilities before guessing."], tip: "Start with the column that gives you the most information." },
  meanPuzzle: { idea: "Mean × count = total. This one formula unlocks most mean puzzles.", method: ["Find the total from the known mean and count.", "Adjust for removals or additions.", "Divide the new total by the new count."], tip: "Always work with totals, not means, when combining groups.", watch: "One extreme value drags the mean a long way. Ask whether the mean or the median is the honest 'average' for the data." },
  ratioChain: { idea: "A ratio compares parts of a whole. The same underlying skill covers sharing a total, reading a ratio as a fraction, simplifying (even across units), chaining two ratios through a shared term, using the DIFFERENCE between parts, and seeing what changes (or doesn't) when a ratio is disturbed.", method: ["Find the value of ONE part first (total ÷ parts, or difference ÷ part-difference).", "Multiply that one-part value by however many parts you need.", "When chaining two ratios, rescale each until the shared term matches, then join."], tip: "Whatever the scenario, ratio questions almost always reduce to: find one part, then scale.", watch: "Ratios scale by MULTIPLYING, never by adding the same amount to both parts. 7:2 doubled is 14:4, not 9:4. And removing a whole category changes the total but NOT the ratio between what's left." },
  systemWord: { idea: "Word problems often hide a system of equations. Name the unknowns and write them down.", method: ["Identify what is unknown.", "Write one equation per piece of information.", "Solve by substitution or elimination."], tip: "Check your answer satisfies all the conditions, not just one." },
  workBackwards: { idea: "Whatever operations were done forwards — adding, subtracting, multiplying, taking a fraction of a remainder, even a percentage change — can be undone one at a time, in REVERSE order, to recover the start.", method: ["List every step that happened, in the order it happened.", "Undo them from the LAST step to the FIRST, turning each operation into its opposite (add ↔ subtract, ×k ↔ ÷k, a % increase ↔ dividing by that same factor).", "For a 'fixed amount plus a fraction of the rest' step, remember the amount left over is only PART of what was there before that step — scale back up to the whole before undoing the fixed amount."], tip: "Draw a flow diagram showing each step, then reverse both the operations AND their order.", watch: "The single most common slip is undoing the steps in the ORIGINAL order instead of reverse — the last thing that happened must be the first thing you undo." },
  multiRate: { idea: "A rate compares two different quantities. Multi-rate questions test whether you can combine rates correctly: adding rates that work together, subtracting a rate that works against you, converting given TIMES into rates before combining them, comparing unit rates for best value, and handling a rate that changes partway through a job.", method: ["Get every rate onto the same basis (same units) before combining.", "If you're given TIMES rather than rates, invent a convenient job size and convert.", "Add rates working together, subtract ones working against you, then divide the job by the combined rate."], tip: "Write down what your rate MEANS (so much per one of something) before you multiply or divide by it.", watch: "Average speed is TOTAL distance ÷ TOTAL time. It is NOT the average of the two speeds — the slower leg takes longer, so it counts for more." },
  inverseProp: { idea: "More of one thing can mean less of another. A fixed 'pile' (of work, food-days, or distance) stays constant, so it gets shared out differently depending on how many things are sharing it — whether that's workers and days, cats and food, or speed and time. Some questions add a fixed part that does NOT scale, or change two things at once.", method: ["Find the fixed total ('pile'): multiply the two quantities that trade off against each other.", "Divide that pile by the NEW number to get the new value.", "Watch for a FIXED part that doesn't scale at all, or TWO changes happening at the same time."], tip: "Multiply to find the constant pile; divide to share it out again.", watch: "More workers means LESS time — don't scale both quantities the same way. And a fixed set-up cost or time does NOT get divided along with the rest." },
  sportScore: { idea: "League and match puzzles are cracked by translating every stated fact — a half-time state, a total-and-difference, a points system, a running commentary, or a property like 'the score was prime' — into an equation or a direct calculation, then squeezing until only one answer survives.", method: ["Name the unknowns (goals, wins, draws, losses) and turn every clue into its own equation or step.", "Use the most restrictive clue first to narrow things down, then check every surviving candidate against ALL the clues, not just the one you used last.", "For 'which of these could be true' questions, test each option against every clue rather than trusting the first plausible-looking one."], tip: "When a total and a difference are both given, add them together to get double the larger value.", watch: "Finding one combination that fits is not proof it's the only one — for points-table puzzles in particular, always check whether another combination also works before committing to an answer." },
  clockArith: { idea: "Clocks are just modular arithmetic — hours wrap at 12 or 24, days at 7.", method: ["Convert to total minutes or hours.", "Divide by the cycle (24 or 7) and take the remainder.", "Convert back to hours and minutes."], tip: "For time zones, first convert to a reference city, then convert on." },
  calendar: { idea: "The days of the week repeat every 7 days, so any gap of days collapses down to just its remainder mod 7 — the whole number of weeks in between never changes what weekday you land on.", method: ["Work out the total number of days spanned (careful with month lengths, and February in a leap year).", "Divide that gap by 7 — only the REMAINDER matters.", "Step that remainder forward (or back) from the known weekday."], tip: "A year is 365 days normally (a remainder of 1 mod 7) or 366 in a leap year (remainder 2) — so the same date shifts by 1 or 2 weekdays each year.", watch: "A year is a leap year if divisible by 4, except century years, which must be divisible by 400 (so 2000 was a leap year but 2100 will not be)." },
  angleParallel: { idea: "Parallel lines cut by a transversal create equal and supplementary angle pairs.", method: ["Alternate angles are equal (Z angles).", "Co-interior angles add to 180° (C angles).", "Corresponding angles are equal (F angles)."], tip: "Label each angle as you find it — one leads to the next.", watch: "Give named reasons: 'corresponding angles are equal', 'co-interior angles add to 180°'. 'It looks equal' is never a reason." },
  angleIso: { idea: "An isosceles triangle has two equal sides and, because of that, two equal base angles — spot the equal sides (marked ticks, or two radii of a circle) before you touch any angles.", method: ["Given the apex (top) angle: each base angle = (180° − apex) ÷ 2.", "Given a base angle: apex = 180° − 2 × base angle.", "An exterior angle at a base vertex = apex + the far base angle.", "The line from the apex to the midpoint of the base hits it at 90° and bisects the apex angle — draw it in to create two right-angled triangles you can chase."], tip: "Mark the two equal sides with tick marks first, then decide which angles they force to match — a top angle and a base angle are handled by opposite arithmetic.", watch: "Two radii of the same circle are automatically equal — that hidden isosceles triangle is one of the commonest examiner disguises. Always check whether the angle you were GIVEN is the apex or a base angle before halving or doubling anything." },
  angleRhombus: { idea: "A rhombus has four equal sides. That alone forces opposite angles equal, neighbouring angles supplementary, and — via its diagonals — a pair of congruent isosceles triangles hiding inside it.", method: ["Opposite angles are equal: they don't share a side (∠P = ∠R, ∠Q = ∠S).", "Neighbouring (adjacent) angles add to 180°: they DO share a side (∠P + ∠Q = 180°).", "Each diagonal bisects the two corner angles it passes through, and the diagonals always cross at right angles.", "A diagonal that does NOT pass through a vertex still creates an isosceles triangle there, because two rhombus sides meet at that vertex."], tip: "Redraw the rhombus and label every angle you already know before hunting for the missing one.", watch: "Don't confuse opposite (equal) with adjacent (supplementary) — sharing a side is the test, not how the letters look on the page. A rhombus need not have right angles: only its diagonals are guaranteed perpendicular, not its corners." },
  trianglesInRect: { idea: "A triangle's area is always ½ × base × height — the trick is spotting which rectangle it's really half of (or a quarter, or the leftover after cutting a triangle away).", method: ["A rectangle's diagonal always splits it into two congruent triangles, each exactly half the rectangle's area.", "Both diagonals together always split a rectangle into four triangles of EQUAL area (a quarter each), even though they aren't all the same shape.", "If a triangle's base is a full side of the rectangle, its area depends only on the perpendicular height to that base — sliding the opposite vertex along a parallel line never changes the area.", "To find a leftover area, work out the whole rectangle and subtract the triangle(s) removed."], tip: "Always ask: is this triangle's height the FULL side of the rectangle, or something shorter?", watch: "A triangle that 'looks' bigger because its apex has shifted sideways isn't bigger at all if the perpendicular height hasn't changed — judge area by height, never by eye." },
  midpointSquare: { idea: "Joining the midpoints of a square's (or rectangle's) sides always makes a new shape with exactly half the area, because the four corner triangles you cut off between them add up to that other half.", method: ["Each corner triangle has legs equal to HALF of the two original sides that meet there.", "Four such corners always total exactly half of the original area, whatever the original's exact size.", "For a square the inner shape is a (tilted) square; for a rectangle it's a rhombus — either way it's still exactly half.", "The rule works backwards too: double a midpoint shape's area to get the original, and it can be applied again to the inner shape itself."], tip: "If you're given the perimeter instead of the side, divide by 4 first — the halving rule still needs the side length.", watch: "The corner triangle's legs are HALF the side, not the full side — using the full side by mistake is the single most common error in this topic." },
  partitionRect: { idea: "Cutting a rectangle with one line across and one line down makes four smaller rectangles whose perimeters are secretly linked: the two pieces diagonally opposite each other always have perimeters that add up to the same total — and that total is also exactly the outer rectangle's own perimeter.", method: ["Label the two column widths (a, b) and two row heights (c, e). Every small perimeter is built from exactly one width and one height.", "Diagonally-opposite pairs (top-left & bottom-right, or top-right & bottom-left) always sum to the same total, so a missing perimeter = sum of the other diagonal pair − the piece diagonally opposite it.", "That same diagonal sum is also exactly the big rectangle's own outer perimeter — so knowing the outer perimeter plus just ONE small perimeter can be enough to find its diagonal partner."], tip: "Sketch the 2×2 grid and mark which two pieces are truly diagonal before applying any shortcut — row pairs and column pairs look similar but are NOT guaranteed to match.", watch: "The four small perimeters ADD UP to double the outer perimeter (each internal cut is walked twice), which is a different fact from the diagonal-pair equality — don't mix the two up." },
  compoundPerim: { idea: "When squares are joined edge-to-edge, internal edges disappear from the perimeter.", method: ["Count the outer edges only.", "Each joined edge removes 2 from the total border.", "Or: use the bounding rectangle ± adjustments."], tip: "Count edges systematically: top, right, bottom, left." },
  poolPath: { idea: "A path of constant width running all the way round a pool turns the pool's dimensions into a bigger rectangle — but the path is added on EACH side, so twice per dimension, not once.", method: ["Outer rectangle = (pool length + 2×path width) by (pool width + 2×path width). Path's own area = outer area − pool area.", "Never multiply the pool's perimeter by the path width to find the path's area — that shortcut always misses the four corner squares.", "If a dimension is unknown, either divide straight through (when the path width is already known) or set up (length+2w)(width+2w) = total area and solve for w; for a circular pool use π×r² for both areas and add the path width just once to the radius."], tip: "Always build the FULL outer shape first and subtract — never try to shortcut with perimeter × width.", watch: "For a circular pool, the path only adds its width ONCE to the radius (not twice) — a radius already measures outward from the centre in every direction at once, unlike a rectangle's length or width." },
  cubeProps: { idea: "Cubes and cuboids link volume (s³, or l×w×h) and surface area (6s², or the sum of 3 pairs of matching faces) — and a painted, subdivided cube turns those same face-counting ideas into a counting puzzle.", method: ["Volume = s³ for a cube, l×w×h for a cuboid — or more generally cross-section area × length for any prism (a triangle's cross-section needs halving).", "Surface area is safest built face by face: a cube has 6 identical square faces, a cuboid has 3 matching pairs.", "In a painted n×n×n cube: corners (8) always show 3 faces, edges (12×(n−2)) show 2, face-centres (6×(n−2)²) show 1, and the buried interior ((n−2)³) shows none — and with TWO paint colours (one opposite pair each colour, the third pair split), all 8 corners plus 8 of the 12 edges show both colours."], tip: "Never assume 'multiply all the lengths' works beyond a cuboid — a triangular prism needs its cross-section's area (with a halving for the triangle) found first.", watch: "For the two-colour painted cube, only a colouring where no corner touches three faces of the SAME colour is valid — that always means one whole opposite pair one colour, another whole pair the other colour, and the last pair split." },
  productOpt: { idea: "For a FIXED total split between numbers, the product is biggest when the numbers are as equal as possible and smallest when they are as unequal as possible — and the same idea mirrors exactly for a fixed product's sum, and for a rectangle's area given a fixed perimeter.", method: ["Decide whether the TOTAL (sum) or the PRODUCT is the fixed quantity in the question.", "For maximum product from a fixed sum, split as evenly as possible; for minimum, split as unevenly as possible using the smallest allowed part.", "When comparing several actual candidate splits, just compute each one's product directly and compare."], tip: "A fixed-perimeter rectangle's area follows the very same rule: a square (equal sides) always gives the biggest area for that perimeter.", watch: "Don't assume 'more different numbers' multiply to something bigger — for a fixed sum, spreading the numbers apart always SHRINKS the product, never grows it." },
  tiling: { idea: "Tiling puzzles are proved, not guessed. A colouring argument (like a chessboard) reveals an exact upper bound on how many pieces can fit or whether a board can be covered at all, and a fixed-size rectangle gives you an exact tile count directly from its dimensions.", method: ["Colour the grid like a chessboard and count each colour.", "Every tile of a given shape covers a fixed, predictable mixture of colours — use this to bound the number of tiles or dominoes that fit.", "Check whether that bound is actually achievable, or compute an exact count directly from the stated dimensions."], tip: "A demonstration that a few attempts fail is not a proof; a colouring argument settles every arrangement at once.", watch: "Removing two squares of the SAME colour makes a full domino tiling impossible; removing two of DIFFERENT colours still allows one." },
  truthLiars: { idea: "Assume someone is a truth-teller and trace the consequences. If you get a contradiction, they must be a liar.", method: ["Start with the first person and assume truth-teller.", "Follow the chain of statements.", "If you reach a contradiction, flip the assumption."], tip: "In a circular chain of 'X says Y is lying', alternating truth/liar often works." },
  seating: { idea: "Seating puzzles are solved by turning every clue about who sits where into a hard constraint, then either deducing the one arrangement that fits all of them or counting how many arrangements are possible under one.", method: ["Fix one named person's seat at a round table so rotations aren't counted as different arrangements.", "Apply the tightest clues (exact seats, 'immediately next to') before loose ones ('not next to').", "For counting questions, glue people who must sit together into a single block before counting arrangements."], tip: "'Next to' allows either side; only a directional clue like 'immediately clockwise of' picks just one.", watch: "Always check a finished arrangement against every clue, not just the ones used to build it — and never mistake a rotation of the same seating for a genuinely new one." },
  pigeonhole: { idea: "To guarantee a condition, assume the worst case and add one more.", method: ["Ask: what is the worst possible sequence of picks?", "That is the maximum you might take without meeting the condition.", "Add one to guarantee success."], tip: "Worst case means the 'universe' is as unhelpful as possible.", watch: "Always imagine the WORST possible luck first. Certainty means even the unluckiest draw still works." },
  allocation: { idea: "Set up two simultaneous equations: one for the count, one for the total.", method: ["Let the number with each value be x, y, z.", "Equation 1: x + y + z = total boxes.", "Equation 2: 1x + 2y + 3z = total counters."], tip: "With three unknowns and two equations, use the given extra info to fix one." },
  repeatOp: { idea: "When an operation is applied over and over, you almost never need to grind through every step — look instead for a quantity that never changes (an invariant) or a state that starts repeating (a cycle).", method: ["Apply the operation a handful of times by hand and watch what happens.", "Check whether some quantity (a difference, a parity, a digit-based value) stays exactly the same every time — that's an invariant.", "If instead the values start repeating, find the cycle's length and use remainders to jump straight to a huge step number."], tip: "Adding or removing the SAME amount from every quantity never changes the difference between them.", watch: "An operation that changes something by a fixed amount each time (like flipping exactly 2 coins) can only ever change a count by an EVEN number — so an odd target may be permanently unreachable." },
  customCount: { idea: "Systematic listing with a clear rule beats trying to guess.", method: ["Write out the sequence explicitly up to a few terms.", "Spot any patterns (e.g. which digits are skipped).", "Count carefully to the required term."], tip: "A tally chart helps — cross off entries as you count them." },
  agePuzzle: { idea: "Age puzzles turn on one fixed idea: the GAP between two people's ages never changes as time passes, even though their RATIO does — everything else is setting up an equation from that.", method: ["Let the youngest or simplest unknown age be x, and write every other age in terms of x (or in terms of time N).", "Translate 'times as old' and 'years older/younger' directly into the equation.", "Solve, then check the answer forwards against every condition in the question."], tip: "Sums of ages change by (number of people) × (years passed) — three people all gain 3 years of combined age every single year.", watch: "Age GAPS never change as time passes; ratios of ages do, and always move towards 1 (closer together) as everyone gets older." },
  estimation: { idea: "A good estimate rounds sensibly, chains several rough steps together confidently, and knows how far off a rounded value could really be. It's not just rounding the final answer — it's rounding the INPUTS first, chaining rounded steps together (Fermi-style), working out a best-case/worst-case range, and sanity-checking that an answer has the right order of magnitude.", method: ["Round each input to a friendly number BEFORE calculating.", "For multi-step (Fermi) estimates, chain each rounded step together.", "For bounds, work out the smallest-possible and largest-possible rounding at each step."], tip: "If an answer has the wrong number of digits, check your rounding and units again before anything else.", watch: "Rounding first, then calculating, is not the same as calculating exactly and then rounding the answer — the second one isn't really an estimate at all." },
  bouncing: { idea: "Doing the same multiply or divide over and over, again and again, follows a pattern you can track — whether that's a bouncing ball losing height, or a number being repeatedly multiplied and divided.", method: ["Bouncing ball: each bounce reaches a fraction of the height before it. Work out that next height each time, and count how many bounces are still above the target line.", "Repeated multiply/divide by two numbers (like 2 and 3): every result you can ever reach is built ONLY out of extra 2s and 3s alongside your starting number — nothing else can appear, no matter how many steps you take.", "So to check whether a given number could be a possible result, see whether reaching it would need some OTHER factor (like a 5 or a 7) that isn't a 2 or a 3."], tip: "If a candidate answer needs a factor your operations can never produce, it's impossible — no need to work out the exact number of steps." },
  compoundPerimeter: { idea: "Perimeter of a compound (multi-part) shape is never just 'add up the pieces' perimeters' — you must trace the TRUE outer boundary, and any edge shared between two parts vanishes from that boundary entirely.", method: ["For shapes built from unit squares, count every exposed unit edge (an edge only counts if no neighbouring square covers it).", "For shapes glued from separate rectangles, combined perimeter = sum of the separate perimeters − 2 × the shared edge length.", "For a rectangle with a corner notch removed, use the balance rule (horizontal pieces across the top total the same as the bottom; vertical pieces up one side total the same as the other) to find any missing edge, then add every edge once."], tip: "Cutting a rectangular notch out of a corner never changes the total perimeter — only the shape changes. Use that as a quick sanity check on harder questions.", watch: "The same number of unit squares can have very different perimeters depending on how spread out the shape is — a straight row always has the biggest perimeter for its area, a compact block the smallest." },
  epicJourney: { idea: "Journey problems are time-distance-speed bookkeeping. Handle each leg separately, then combine.", method: ["Convert everything to the same units before combining (km with km, minutes with minutes).", "Time = distance ÷ speed for each leg, and don't forget waiting time.", "For average speed use TOTAL distance ÷ TOTAL time, right at the end."], tip: "Sketch a quick timeline of the journey — it stops the legs getting muddled.", watch: "Average speed is NOT the average of the speeds. The slower leg takes longer, so it counts for more." },
  moneyTrail: { idea: "Money chains are fraction-of-what-REMAINS problems. Track the remaining fraction, or undo the steps from the end.", method: ["Forwards: after spending 1/3 you KEEP 2/3 — multiply the keep-fractions together.", "Backwards: undo the last event first, then the one before it.", "Work in pence to keep every step a whole number."], tip: "Write down the amount remaining after every single step.", watch: "'A third of what is LEFT' is not 'a third of the original'. Always check which whole the fraction refers to." },
  digitDetective: { idea: "Digit puzzles crack open with place value: a two-digit number is 10a + b, a three-digit number is 100a + 10b + c.", method: ["Translate each clue into a fact about the digits.", "Use structure: reversing a two-digit number changes it by 9 × (difference of its digits).", "List candidates systematically, smallest to largest, and test each clue.", "To maximise a digit sum under a constraint (like a real calendar date), push for the largest possible digits and check each candidate is actually valid."], tip: "Digits only run 0-9, so the search is much smaller than it looks.", watch: "Check EVERY clue against your final answer — a candidate that fits one clue often fails another." },
  pythagQuest: { idea: "Pythagoras: in a RIGHT-angled triangle, the two shorter sides' squares add to the hypotenuse's square: a² + b² = c².", method: ["Identify the right angle. The side OPPOSITE it is the hypotenuse — always the longest side.", "Finding the hypotenuse? ADD the squares, then square root. Finding a shorter side? SUBTRACT, then square root.", "For 3D diagonals, use Pythagoras twice: floor diagonal first, then up the height.", "Learn the classic triples — 3,4,5 · 5,12,13 · 8,15,17 · 7,24,25 — and their multiples. Challenge papers love them."], tip: "Sketch the triangle and label the hypotenuse before touching the numbers.", watch: "Pythagoras ONLY works with a right angle, and mixing up add/subtract is the classic error: the hypotenuse must come out longer than both other sides — sanity-check it." },
  numberMachine: { idea: "Function machines: to find the input, undo every step in reverse order.", method: ["Draw the chain: input → × a → + b → output.", "Undo in reverse: the last operation is undone first (subtract before you divide, if the machine multiplied then added).", "To find a mystery rule from two examples, look at how much the output grows when the input grows by 1."], tip: "Always check by feeding your answer forwards through the machine.", watch: "Reverse the ORDER of the steps, not just each operation — undoing ×3 then +2 means −2 first, THEN ÷3." },
  coordGeom: { idea: "Every coordinate question reduces to one of a few moves: average for a midpoint, Pythagoras for a distance, or matching a shape's property to find a missing vertex.", method: ["Midpoint = average the x's, average the y's.", "Distance: build a right-angled triangle from the horizontal and vertical gaps, then use Pythagoras.", "Missing vertex: translate ONE property of the shape (matching sides, or equal diagonal midpoints) into a coordinate equation."], tip: "Always find x before y, and write down the coordinate after each transformation step rather than doing two in your head.", watch: "Reflecting in the x-axis flips y, not x — the axis you reflect IN is the one that stays fixed. Chained transformations must be done in the stated order; swapping it usually changes the answer." },
  magicGrid: { idea: "Every magic grid promises that some family of lines (rows, columns, diagonals, or pairs) all share the same total. Find that total from any complete line, then subtract to find a missing number.", method: ["Scan the whole grid for ANY complete line, not just the one next to the blank.", "Add it up to get the shared total.", "Subtract the known numbers in the blank's own line from that total."], tip: "If no line is complete, use the grand total of every number divided by the number of rows instead.", watch: "Rows, columns AND diagonals share the SAME total in a full magic grid — you can source it from any of them, not just the row nearest the blank." },
  shapeFold: { idea: "Folding always doubles the layers (2^n after n folds); cutting always adds on the next whole number of pieces (the k-th cut adds k pieces).", method: ["Folds: 2^(number of folds) layers; multiply by the number of separate punches for the hole count.", "Cuts: build the running total one cut at a time, or use 1 + n + n(n-1)/2 directly.", "Equal-area cuts: find the shape's TOTAL area (adding or subtracting rectangles), then halve it."], tip: "To reverse either formula (given the result, find n), test small values of n in order rather than trying to rearrange the formula.", watch: "A hole punched ON a crease does not double — creases are still joined paper, not two separate layers." },
  gridLogic: { idea: "Every row, column (and box, if marked) must contain a fixed set of numbers exactly once. A missing number is whichever one from the set has not appeared yet in every rule that applies to it.", method: ["List the full number set, then cross off whatever the blank's row already shows.", "If that leaves more than one candidate, cross off what the column shows too (and the box, if there is one).", "Whatever survives every applicable line is the answer."], tip: "Check both directions (row and column) before settling on one — start with whichever line gives more information.", watch: "A candidate only survives if it is left over from EVERY applicable rule, not just one of them." },
  networkGraph: { idea: "Picture connection problems as dots and lines. Full connection count for n dots is n(n-1)/2; joining k separate groups always needs k-1 extra links, whatever their sizes.", method: ["Handshakes / full connections: n(n-1)/2.", "Joining k separate groups into one: k-1 extra links, regardless of group sizes.", "Colouring so neighbours differ: 2 or 3 for a ring (even or odd), n for a fully-connected network."], tip: "To reverse the handshake formula, test small values of n in order rather than trying to rearrange it.", watch: "Group SIZES are a red herring when counting extra links to join groups — only the number of groups matters. A ring needs 2 cuts to disconnect (it has a spare connection); a line only needs 1." },
  spatialTransform: { idea: "A regular polygon's lines of symmetry AND rotational order both equal its number of sides. Cube nets: faces sharing an edge in the net are never opposite once folded. Rotations preserve clockwise order; only a mirror image reverses it.", method: ["Regular polygon: n sides -> n lines of symmetry AND rotational order n.", "Irregular shapes need their own known facts — don't over-apply the regular-polygon shortcut.", "Cube net: the two ends of a straight run of 4 faces pair up (1st-3rd, 2nd-4th); perpendicular arms pair with each other."], tip: "For 'is this rotation possible', check whether the clockwise order of labels around a corner has been preserved or reversed.", watch: "A reversed (anticlockwise-for-clockwise) reading is a mirror image, which no rotation can ever produce." },
};

/* ============================================================
   GENERATORS  -> { q, options[5], correctIndex, solution[], svg? }
   40 families modelled on 5 years of Junior Kangaroo papers.
   UK names pool used throughout for narrative framing.
   ============================================================ */

// Creature names from the card collection, grouped by rarity so that easier
// questions feature the common creatures and harder questions bring in the
// rarer ones. This ties the whole app to the same cast of characters.
export const JUNIOR_NAMES_COMMON = ["Addy", "Countra", "Tri-Tip", "Cubble", "Hunchik", "Sparkfin", "Zoomby", "Pebble", "Loopy", "Burrowl", "Squarby", "Frostcal"];
export const JUNIOR_NAMES_RARE = ["Multimoo", "Angloraptor", "Owlgorithm", "Flaskfox", "Cheetawatt", "Fractail", "Hexabug", "Voltbird", "Probear", "Seqviper"];
export const JUNIOR_NAMES_EPIC = ["Primearch", "Geodrake", "Paradox", "Quantakit", "Sphinxa", "Novabear"];
export const JUNIOR_NAMES_LEGENDARY = ["Infinitus", "Euclidon"];
// Early module aliases: these four are consumed immediately below (NAMES/namePool),
// before the main MODULES let-binding block further down the file.
export let NAMES_COMMON = JUNIOR_NAMES_COMMON, NAMES_RARE = JUNIOR_NAMES_RARE, NAMES_EPIC = JUNIOR_NAMES_EPIC, NAMES_LEGENDARY = JUNIOR_NAMES_LEGENDARY;
export const NAMES = [...NAMES_COMMON, ...NAMES_RARE, ...NAMES_EPIC, ...NAMES_LEGENDARY];
// Difficulty-aware name pool: d1 mostly commons, building to rarer creatures by d4.
export function namePool(d) {
  if (!d || d <= 1) return NAMES_COMMON;
  if (d === 2) return [...NAMES_COMMON, ...NAMES_RARE];
  if (d === 3) return [...NAMES_RARE, ...NAMES_EPIC];
  return [...NAMES_EPIC, ...NAMES_LEGENDARY, ...NAMES_RARE];
}
export let _ND = 1; // current difficulty hint for name selection, set by makeQuestion
export let _NL = 1; // current game level (1-10), set by makeLevelQuestion
export const NP = () => { const pool = namePool(_ND); const a = pick(pool), b = pick(pool.filter(n => n !== a)); return [a, b]; };
export const N1 = () => pick(namePool(_ND));
export const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
export const MONTHS31 = [1,3,5,7,8,10,12];
/* SVG shorthands (gbp/deg/svgBox already defined above) */
export const SL = (x1,y1,x2,y2,col="#2a1a5e",sw=2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}"/>`;
export const SC = (cx,cy,r,col="#2a1a5e",sw=2,fill="none") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${col}" stroke-width="${sw}"/>`;
export const SR = (x,y,w,h,col="#2a1a5e",sw=2,fill="none") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${col}" stroke-width="${sw}" rx="2"/>`;
export const ST = (x,y,s,anch="middle",sz=14,col="#2a1a5e",fw=600) => `<text x="${x}" y="${y}" font-family="Fredoka,sans-serif" font-size="${sz}" font-weight="${fw}" fill="${col}" text-anchor="${anch}">${s}</text>`;

// Folded in from the retired dateDigit topic — used inside G.digitDetective. Finds the true
// max (or min) digit sum of any real dd/mm date in a year by brute-force checking every date,
// so it's correct by exhaustive search rather than a guessed formula.
export function dateDigitScenario() {
  const wantMax = pick([true,true,false]); // max slightly more often, it's the punchier question
  let best = wantMax ? -1 : 99, bestDate = "";
  for (let m=1;m<=12;m++) {
    const maxDay = m===2?28:MONTHS31.includes(m)?31:30;
    for (let day=1;day<=maxDay;day++) {
      const s = `${String(day).padStart(2,"0")}/${String(m).padStart(2,"0")}`;
      const sum = [...s].filter(c=>c>="0"&&c<="9").reduce((a,c)=>a+Number(c),0);
      if ((wantMax && sum>best) || (!wantMax && sum<best)) { best=sum; bestDate=s; }
    }
  }
  const decoys = wantMax ? [best-3,best-4,best+1,best-1].filter(x=>x>0) : [best+3,best+4,best-1,best+1].filter(x=>x>=0);
  const {options,correctIndex} = buildMC(best,decoys);
  const nm = N1();
  return { q:`Every day, ${nm} writes the date in the form dd/mm and calculates the sum of the digits. For example on 11th June ${nm} writes 11/06 and gets 1+1+0+6=8. What is the ${wantMax?"largest":"smallest"} such sum ${nm} calculates over the course of a year?`, options, correctIndex, solution:[`Look for dates with digits as ${wantMax?"large":"small"} as possible.${wantMax?" Avoid months like 10,11,12 which have zeros.":""}`, `The date ${bestDate} gives ${[...bestDate].filter(c=>c>="0"&&c<="9").join("+")} = ${best}.`, `This is the ${wantMax?"maximum":"minimum"} across the whole year.`] };
}

// ── Active-module live bindings ───────────────────────────────────────────
// Initialised to Junior defaults (which are all defined above in this file).
// Updated by the main file's activateModule() via the setters below.
export let ACTIVE_MODULE_KEY = "junior";
export function setActiveModuleKey(k) { ACTIVE_MODULE_KEY = k; }

// TOPICS and DEEP_TOPICS can be initialised here because JUNIOR_TOPICS and
// JUNIOR_DEEP_TOPICS are defined just above.  G starts null and is wired
// to JUNIOR_G by the main file once all module files have been evaluated.
export let TOPICS = JUNIOR_TOPICS;
export let DEEP_TOPICS = JUNIOR_DEEP_TOPICS;
export let G = null;

export function setModuleSharedVars(topics, deepTopics, g) {
  TOPICS = topics; DEEP_TOPICS = deepTopics; G = g;
}

// Allow junior-generators (and callers) to update _ND / _NL without
// assigning directly to imported bindings (ES modules forbid that).
export function setND(v) { _ND = v; }
export function setNL(v) { _NL = v; }

// Switch the name pools used by namePool() when the active module changes.
export function setNamePools(c, r, e, l) {
  NAMES_COMMON = c; NAMES_RARE = r; NAMES_EPIC = e; NAMES_LEGENDARY = l;
}

// ── Module-specific active bindings used by functions in junior-generators ─
// These are null-initialised and set to JUNIOR values by the main file at startup
// (after all modules have been imported), then updated on module switches.
export let examKindFor = null;
export let EXAM_PASS_MARKS = null;
export let RARITY = null;
export let CARD_CLASS = null;
export let CARDS = null;

export function setModuleActiveVars(ekf, epm, rarity, cardClass, cards) {
  examKindFor = ekf;
  EXAM_PASS_MARKS = epm;
  RARITY = rarity;
  CARD_CLASS = cardClass;
  CARDS = cards;
}
