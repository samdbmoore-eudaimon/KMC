// generators/primary-generators.js — Primary module: PRIMARY_G, bosses, cards, and helpers.
import {
  rand, pick, shuffle, gcd, buildMC, buildMCStr, gbp, deg, simplifyFrac, sup, svgBox,
  N1, SL, SC, SR, ST, DAYS, MONTHS31, computePrimaryType, normaliseJoeyCardStats, pickStructure
} from './gen-shared.js';
import { JUNIOR_RARITY } from './junior-generators.js';


/* ============================================================
   MULTI-MODULE BUNDLE SYSTEM (Phase 0 of MODULE_EXPANSION_PLAN.md)
   Junior's content above is unchanged (just renamed to JUNIOR_*).
   Every one of these registries is a `let` binding, rebound in one
   shot by activateModule() whenever the player switches which module
   they're playing — every existing call site below keeps referencing
   the bare name (CARDS, G, TOPICS, ...) and just sees the new module's
   content on the next read, with zero call-site changes required.
   Primary/Intermediate are stub bundles until Phase 1/2 author real
   content; they stay locked in the module switcher until then.
   ============================================================ */

/* ============================================================
   PRIMARY MODULE — Phase 1 of MODULE_EXPANSION_PLAN.md
   KS2 (Years 4-6), primary-focused. Topics are curriculum-grounded (DfE
   "Mathematics guidance: key stages 1 and 2", June 2020, Years 4-6
   sections) but pitched in a playful primary problem-solving house style
   (light arithmetic wrapped in visual/logic reasoning, not heavy word
   problems). Building out topic-by-topic across sessions — this batch:
   placeValue, roundingEstimate, timesTablesFacts, divisionRemainders,
   factorsMultiplesPrimes, sequencePattern. Each generator uses brute-force
   search wherever a shortcut formula could hide a subtle bug (factor
   lists, primality, best digit arrangements) rather than a derived-by-hand
   formula, matching the verification standard set on Junior's generators.
   ============================================================ */
export const PRIMARY_TOPICS = [
  { key: "negativeNumbers",        label: "Negative Numbers",      emoji: "➖", color: "#5b3df0" },
  { key: "placeValue",             label: "Place Value",           emoji: "🔢", color: "#7c5cff" },
  { key: "roundingEstimate",       label: "Rounding & Estimating", emoji: "🎯", color: "#ff6b4a" },
  { key: "additionSubtraction",    label: "Addition & Subtraction", emoji: "➕", color: "#ff6b4a" },
  { key: "compensationMentalMaths", label: "Mental Maths Shortcuts", emoji: "⚡", color: "#ffc93c" },
  { key: "timesTablesFacts",       label: "Times Tables",          emoji: "✖️", color: "#22c8b8" },
  { key: "factorsMultiplesPrimes", label: "Factors & Multiples",   emoji: "🧩", color: "#2fc97a" },
  { key: "formalMultiplication",   label: "Column Multiplication",  emoji: "✖️", color: "#7c5cff" },
  { key: "divisionRemainders",     label: "Division & Remainders", emoji: "➗", color: "#ff5d8f" },
  { key: "formalDivision",         label: "Long Division",          emoji: "➗", color: "#ff5d8f" },
  { key: "fourOperationsProblems", label: "Four Operations Problems", emoji: "🧮", color: "#ff6b4a" },
  { key: "fractionOfQuantity",     label: "Fraction of an Amount", emoji: "🍰", color: "#22c8b8" },
  { key: "fractionEquivalence",    label: "Equivalent Fractions",  emoji: "🟰", color: "#ff5d8f" },
  { key: "fractionArithmetic",     label: "Fraction Calculations", emoji: "½",  color: "#7c5cff" },
  { key: "decimalPlaceValue",      label: "Decimals & Decimal Calculations", emoji: "🔟", color: "#ff6b4a" },
  { key: "percentages",            label: "Percentages",           emoji: "%", color: "#ffc93c" },
  { key: "ratioBasics",            label: "Ratio",                 emoji: "⚖️", color: "#2fc97a" },
  { key: "twoUnknowns",            label: "Two Mystery Numbers",   emoji: "❓", color: "#ffc93c" },
  { key: "additiveMultiplicative", label: "More Than vs Times As Many", emoji: "🔀", color: "#ff5d8f" },
  { key: "unitConversion",         label: "Units & Measures",       emoji: "📏", color: "#22c8b8" },
  { key: "areaPerimeter",          label: "Area & Perimeter",       emoji: "📐", color: "#2fc97a" },
  { key: "timeCalendar",           label: "Time & Calendar",        emoji: "🕐", color: "#ff6b4a" },
  { key: "statistics",             label: "Statistics",             emoji: "📊", color: "#22c8b8" },
  { key: "shapeProperties",        label: "Shape Properties",       emoji: "🔷", color: "#2fc97a", dia: true },
  { key: "angleBasics",            label: "Angles",                 emoji: "📐", color: "#ffc93c", dia: true },
  { key: "symmetryReflection",     label: "Symmetry",               emoji: "🪞", color: "#ff5d8f", dia: true },
  { key: "sequencePattern",        label: "Patterns & Sequences",  emoji: "🔁", color: "#ffc93c" },
  { key: "logicGrid",              label: "Logic Puzzles",          emoji: "🧩", color: "#7c5cff", stretch: true },
  { key: "combinatoricsCounting",  label: "Counting Possibilities", emoji: "🔢", color: "#22c8b8", stretch: true },
  { key: "spatialPuzzles",         label: "Spatial Puzzles",        emoji: "🧊", color: "#7c5cff", dia: true, stretch: true },
];
export const PRIMARY_DEEP_TOPICS = [];
export const PRIMARY_CONCEPTS = {
  placeValue: { idea: "Every digit's value depends on its position — the same digit means something different in the ones place vs the thousands place.", method: ["Identify the place (ones, tens, hundreds...) of each digit.", "Multiply the digit by the value of its place to find what it's really worth.", "Add the place values together to build or take apart a number."], tip: "Write the number under place-value headings if you're not sure.", watch: "The digit '0' still takes up a place — don't skip it when reading a number." },
  roundingEstimate: { idea: "Rounding replaces a number with a nearby 'friendly' one — look at the digit just after the place you're rounding to.", method: ["Find the place you're rounding to.", "Look at the very next digit: 5 or more rounds up, 4 or less rounds down.", "Change every digit after the rounding place to zero."], tip: "A number line helps — find the two multiples on either side and see which is closer.", watch: "Exactly halfway (like 450 to the nearest hundred) always rounds UP by convention." },
  negativeNumbers: { idea: "The number line carries on below zero — negative numbers count how far below zero something is, like a temperature colder than freezing.", method: ["Picture (or draw) a number line running through zero in both directions.", "Moving right (or up) makes a number bigger; moving left (or down) makes it smaller, even past zero.", "To find the gap between a negative and a positive number, count the total distance across zero."], tip: "The MORE negative a number is, the SMALLER it actually is — −8 is smaller than −3, even though 8 is bigger than 3.", watch: "Don't judge a negative number's size by ignoring its sign — always think about its actual position on the number line." },
  additionSubtraction: { idea: "Addition joins quantities or records an increase; subtraction finds what remains, the difference between quantities or a missing part.", method: ["Read the situation and decide what the whole, parts or change represent.", "Choose addition when quantities combine and subtraction when something is removed, compared or missing.", "Use the inverse operation to check the result."], tip: "Draw a bar model or number line when the wording hides which quantity is the whole.", watch: "Subtraction is not only 'take away': it can also mean finding a gap or working backwards to a missing value." },
  fourOperationsProblems: { idea: "The wording tells you which operations connect the quantities; difficult problems often need more than one operation in a deliberate order.", method: ["Identify what is known and what must be found.", "Write the calculation for each stage before evaluating it.", "Estimate, calculate and use inverse operations to check."], tip: "Ask whether each step joins, compares, groups, shares or reverses a change.", watch: "Do not simply calculate the numbers in the order they appear: decide what each number means first." },
  percentages: { idea: "A percentage describes parts out of 100 and can be written as an equivalent fraction or decimal.", method: ["Translate the percentage into a convenient unit such as 10%, 5% or 1%.", "Scale that unit to the required percentage.", "Check the result against the size of the whole."], tip: "25% is one quarter, 50% is one half and 75% is three quarters.", watch: "Compare actual amounts, not percentages alone, when the wholes differ." },
  statistics: { idea: "Data displays organise observations so totals, differences, averages and changes can be interpreted.", method: ["Read titles, labels and units.", "Extract only the values needed.", "Calculate and explain what the result means in context."], tip: "The mean is the total shared equally between the data values.", watch: "A graph's visual height is not an answer until you have read its scale." },
  timesTablesFacts: { idea: "Multiplication facts connect to each other — if you know one, you can work out many others.", method: ["Use known facts to scale by 10 or 100 (if 6×7=42, then 60×7=420).", "Split a number into tens and ones to multiply in parts.", "Remember multiplication works in any order: 6×9 = 9×6."], tip: "Every times-table fact also gives you two division facts for free.", watch: "Going one step further in a times table means adding (or subtracting) the table number itself." },
  divisionRemainders: { idea: "Division doesn't always come out exactly — what you DO with a remainder depends on the real question being asked.", method: ["Divide to find how many whole groups fit, and what's left over.", "Decide what the remainder means here: round up (need one more), round down (ignore the leftover), or share it further (as a decimal)."], tip: "Check: divisor × quotient + remainder should always equal the original number.", watch: "A remainder must always be smaller than the divisor — if it isn't, the division is wrong." },
  factorsMultiplesPrimes: { idea: "Factors divide exactly into a number; multiples are what you get by multiplying it. Prime numbers have exactly two factors: 1 and themselves.", method: ["To list factors, test every whole number up to the target and check for exact division.", "To find a common factor/multiple, list both numbers' factors/multiples and compare.", "To check if a number is prime, test whether any number from 2 upwards divides it exactly."], tip: "1 is a factor of every number, and every number is a multiple of 1.", watch: "1 is NOT a prime number — it only has one factor, not two." },
  sequencePattern: { idea: "A repeating pattern always comes back to its start after a fixed number of steps — find that cycle length and you can jump to any position.", method: ["Find how many items are in one full repeat of the pattern (the cycle length).", "Work out which position in ONE cycle matches the position you're asked about.", "Read off the answer from that one cycle."], tip: "Position N in the pattern matches position N ÷ cycle length (using the remainder, not the whole-number answer).", watch: "If a position divides EXACTLY into the cycle length, it matches the LAST item of the cycle, not a 'zeroth' one." },
  fractionEquivalence: { idea: "Two fractions can look completely different and still mean the same amount — multiply (or divide) the top and bottom by the same number and the value never changes.", method: ["To simplify, divide top and bottom by their highest common factor.", "To find an equivalent fraction, multiply top and bottom by the same number.", "To compare fractions, use reasoning (same numerator, or distance from a whole number) before reaching for a common denominator."], tip: "Same numerator? The fraction with the SMALLER denominator is bigger — fewer, larger slices.", watch: "Whatever you do to the bottom of a fraction, you must do to the top too, or the value changes." },
  fractionArithmetic: { idea: "Fractions with the same denominator add and subtract just like counting — only the numerators change.", method: ["Check the denominators match.", "Add or subtract the numerators only — the denominator stays the same.", "If the result passes a whole number, split it into wholes and a remaining fraction."], tip: "Convert between mixed numbers and improper fractions by multiplying the whole number by the denominator, then adding (or reversing with division).", watch: "If subtracting means the top number would go negative, borrow one whole from the whole-number part first." },
  fractionOfQuantity: { idea: "'A fraction of' a quantity always means: divide by the bottom number, then multiply by the top number.", method: ["Divide the total by the denominator to find what ONE part is worth.", "Multiply that one-part value by the numerator.", "To reverse it (given the fraction's value, find the whole), divide by the numerator then multiply by the denominator."], tip: "Find the unit fraction (1/denominator) first — everything else follows from it.", watch: "Don't multiply by the numerator before dividing by the denominator if that gives an awkward number — either order works mathematically, but dividing first often keeps the numbers friendlier." },
  decimalPlaceValue: { idea: "Decimals extend place value past the ones column — tenths, then hundredths — using exactly the same ×10/÷10 pattern as whole numbers.", method: ["Identify each digit's place: tenths (1/10) or hundredths (1/100).", "To multiply or divide by 10/100/1000, slide the decimal point right (×) or left (÷) that many places.", "Line up decimal points before comparing or ordering decimals."], tip: "Learn the fraction-decimal pairs by heart: 1/2=0.5, 1/4=0.25, 1/5=0.2, 1/10=0.1.", watch: "More decimal places does NOT mean a bigger number — 0.5 is bigger than 0.35, even though 0.35 'looks longer'." },
  ratioBasics: { idea: "A ratio compares two quantities that scale together — find the value of ONE 'part' or 'batch', then scale up or down.", method: ["Divide the given amount by its side of the ratio to find one 'unit'.", "Multiply that unit by the OTHER side of the ratio to find the matching amount.", "For a total, add up all the parts first, then divide the total by that many parts."], tip: "Check a ratio is equivalent to another by cross-multiplying: a:b = c:d exactly when a×d = b×c.", watch: "Scaling a recipe means multiplying EVERY ingredient by the same factor, not just adding the same amount to each." },
  twoUnknowns: { idea: "When two numbers are linked by a total AND a second clue (a difference, or one being a multiple of the other), the second clue lets you split the total fairly between them.", method: ["Sum + difference: add the total and difference, then halve, to get the bigger number; the total minus that gives the smaller.", "Sum + 'times as many': treat the smaller number as 1 'part' — the total is then a known number of parts.", "When many pairs could work (like two coin values reaching a total), list possibilities systematically rather than guessing."], tip: "Draw a bar model — two bars for the two unknowns — to see the relationship before calculating.", watch: "A problem like a×b=20 has MANY valid whole-number pairs — always check whether a question wants one specific solution or is testing whether you know several exist." },
  additiveMultiplicative: { idea: "Any two numbers can be compared two ways: additively ('how many more') and multiplicatively ('how many times as many') — and for very different-sized numbers, the multiplicative comparison is usually the more useful one.", method: ["For 'how many more', subtract the smaller from the bigger.", "For 'how many times as many', divide the bigger by the smaller.", "Choose whichever comparison makes the size difference clearest for the numbers involved."], tip: "If one number is many times bigger than the other, 'times as many' paints a clearer picture than a big 'more than' figure.", watch: "'3 more' and '3 times as many' are completely different relationships — don't mix up an additive clue with a multiplicative one." },
  unitConversion: { idea: "Every measurement unit connects to a bigger or smaller one by a fixed factor — usually 10, 100 or 1000 — so converting is really just multiplying or dividing by that factor.", method: ["Learn the key facts: 1km=1000m, 1m=100cm, 1cm=10mm, 1kg=1000g, 1l=1000ml, £1=100p.", "Converting a BIG unit to a SMALL one: multiply.", "Converting a SMALL unit to a BIG one: divide."], tip: "If you're ever unsure which way to convert, check: there should be MORE of the smaller unit than the bigger one.", watch: "Before comparing or adding two measurements, always convert them to the SAME unit first." },
  areaPerimeter: { idea: "Perimeter measures the distance all the way round the outside of a shape; area measures the space it covers inside.", method: ["Perimeter of a rectangle = 2 × (length + width); of a regular polygon = number of sides × side length.", "Area of a rectangle = length × width.", "For a compound (L-shaped) figure, cutting a rectangular notch from a corner changes the area but NEVER the perimeter."], tip: "Always check whether a question wants the OUTSIDE distance (perimeter) or the SPACE INSIDE (area) — they use different units (cm vs cm²).", watch: "A bigger perimeter does not always mean a bigger area, and vice versa — the two are not directly linked." },
  timeCalendar: { idea: "Days of the week repeat every 7 days and hours repeat every 24 — so any time or date gap collapses down to just its remainder after dividing by 7 (or 24).", method: ["To find a day N days away, divide N by 7 and count on (or back) by the remainder only.", "For clock times, convert everything to minutes, add or subtract, then convert back.", "For leap years: divisible by 4, except century years, which must be divisible by 400."], tip: "The whole number of weeks (or days) never changes what day of the week you land on — only the remainder matters.", watch: "Counting back and counting forward use the remainder in OPPOSITE directions — check which way the question is asking." },
  compensationMentalMaths: { idea: "You can often make a calculation easier by nudging the numbers to something friendlier — as long as you nudge them in a way that cancels out exactly.", method: ["Addition: increase one number and decrease the other by the SAME amount — the total is unchanged.", "Subtraction: add the SAME amount to both numbers — the difference is unchanged.", "Multiplication: multiply one factor and divide the other by the SAME amount — the product is unchanged."], tip: "Look for a nearby 'round' number (like 30, 100, or a multiple of 10) to nudge towards.", watch: "The adjustment rule is DIFFERENT for each operation — addition/subtraction compensate in opposite directions to each other, and multiplication compensates by scaling, not adding." },
  formalMultiplication: { idea: "Long multiplication breaks a hard multiplication into easier pieces using place value, then adds the pieces back together.", method: ["Split the bigger number into its place-value parts (tens, ones, etc.).", "Multiply the other number by EACH part separately.", "Add all the partial results together for the final answer."], tip: "Estimate first by rounding — it catches column-shift mistakes (being 10× too big or small).", watch: "When splitting a 2-digit multiplier into tens and ones, remember the 'tens' part is really that many TENS — multiply by the full value (e.g. 20, not 2), not just the digit." },
  formalDivision: { idea: "Long division builds up multiples of the divisor until they reach the dividend — the same idea as short division, just with bigger numbers.", method: ["List (or picture) convenient multiples of the divisor: ×2, ×5, ×10 are easiest to work with.", "Combine multiples to reach as close to the dividend as possible without going over.", "Whatever is left over is the remainder — express it as a whole-number remainder, a fraction, or a decimal, depending on what the question wants."], tip: "Doubling and halving BOTH the dividend and divisor never changes the answer — a useful shortcut for awkward-looking divisions.", watch: "A remainder must always be smaller than the divisor — if a 'remainder' comes out equal to or bigger than the divisor, a mistake has been made somewhere." },
  logicGrid: { idea: "Clue-based puzzles are solved by combining every clue at once, not one at a time — each clue rules out some possibilities until only one arrangement fits them all.", method: ["List every possibility before you start ruling anything out.", "Apply each clue in turn, crossing off whatever it makes impossible.", "Once only one possibility survives, check it against EVERY clue as a final proof."], tip: "A small table or grid, with possibilities down one side and clues along the top, keeps track of what's ruled out.", watch: "A clue that says what ISN'T true is just as useful as one that says what IS true — don't only look for direct statements." },
  combinatoricsCounting: { idea: "Counting how many ways something can happen almost always comes down to multiplying the number of choices at each independent step.", method: ["If choices are made one after another and don't affect each other, multiply the number of options at each step.", "If order doesn't matter (like picking a pair), count the ordered arrangements first, then divide out the repeats.", "For 'guarantee' questions, imagine the worst possible luck, then add one more."], tip: "Listing a few small cases by hand often reveals the pattern before you try to calculate it directly.", watch: "Choosing 2 people for a pair counts each pair once — remember to divide by 2 (or however many ways the same group could be ordered) if you first counted ordered pairs." },
  angleBasics: { idea: "Angles measure turn, and several fixed totals govern how they combine: a full turn is 360°, a straight line is 180°, and a right angle is 90°.", method: ["Angles on a straight line add to 180°.", "Angles around a single point add to 360°.", "Angles inside a triangle add to 180°."], tip: "Vertically opposite angles (across an X-shaped crossing) are always exactly equal.", watch: "The size of an angle depends only on the amount of turn between the two lines — NOT on how long the lines are drawn." },
  shapeProperties: { idea: "A shape's properties — its sides, angles, and symmetry — are what define it, and a REGULAR shape needs both equal sides AND equal angles, not just one.", method: ["Count sides and vertices — for a simple polygon, these are always equal.", "To classify a triangle by its sides, check which (if any) are equal: all three (equilateral), two (isosceles), or none (scalene).", "For coordinates, read across (x) before up (y), and add a translation vector directly to each coordinate."], tip: "A shape can have equal sides but NOT be regular if its angles aren't also all equal.", watch: "Don't assume a shape is regular just because it 'looks even' — check both sides AND angles." },
  symmetryReflection: { idea: "A line of symmetry splits a shape into two mirror-image halves — and reflecting a point flips the coordinate that crosses the mirror line, while the coordinate running ALONG it stays put.", method: ["Reflecting in a vertical line (like the y-axis) flips the x-coordinate's sign; reflecting in a horizontal line (the x-axis) flips the y-coordinate's sign.", "Reflecting in the diagonal line y = x swaps the x- and y-coordinates entirely.", "To complete a symmetric pattern, mirror each shaded cell's position exactly across the line of symmetry."], tip: "Regular shapes have as many lines of symmetry as they have sides — but irregular ones can have fewer, or none at all.", watch: "A shape can have rotational symmetry without having any line of symmetry — the two are different properties." },
  spatialPuzzles: { idea: "Spatial reasoning puzzles — folding, cutting, rotating, and building with cubes — are solved by tracking exactly what happens to each part through the transformation, not by guessing from the overall look.", method: ["For folds and cuts: whatever is cut through folded layers appears on EVERY layer once unfolded, mirrored across each fold line.", "For rotations: a genuine rotation always keeps the same reading order (e.g. clockwise stays clockwise) — a mirror image reverses it.", "For 3D shapes built from unit cubes: multiply length × width × height for the total count."], tip: "Physically imagining (or sketching) the transformation step-by-step beats trying to picture the final result all at once.", watch: "A rotation and a reflection can look deceptively similar — the tell is whether the reading order (clockwise/anticlockwise) is preserved or reversed." },
};

function PV_toRoman(value) {
  const symbols = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let remaining = value;
  let result = "";
  for (const [amount, symbol] of symbols) {
    while (remaining >= amount) { result += symbol; remaining -= amount; }
  }
  return result;
}

function PV_romanTileSvg(numeral) {
  return svgBox(SR(72, 22, 156, 82, "#5b4a8a", 3, "#fff7d6") + ST(150, 74, numeral, "middle", 32, "#5b3df0"), 300, 126);
}

// Structure registry for placeValue — see generators/gen-shared.js `pickStructure` for the
// dispatch mechanism. Each entry names a genuinely different reasoning route (the "given
// digit/place/value, find the third" triangle; composing/partitioning; comparing; ordering;
// representation-matching; digit-arrangement extremes; multi-clue deduction) rather than a
// reskin of the same computation. `difficulties` lists every band a structure is graded for;
// several span 2+ adjacent difficulties with their own internal scaling via the `d` argument.
const PLACE_VALUE_STRUCTURES = {
  count_through_zero: {
    difficulties: [1, 2],
    build(d) {
      const start = rand(1, 9);
      const back = rand(start + 1, start + 8);
      const answer = start - back;
      const decoys = [back - start, -(back - start - 1), -(back - start + 1), start + back].filter((x) => x !== answer);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `Start at ${start} and count back ${back}. What number do you land on?`, options, correctIndex,
        hint: "This is a counting back through zero question. The number line carries on below zero — once you pass zero, keep counting into negative numbers.",
        solution: {
          scenario: `We start at ${start} and count back ${back}.`,
          idea: "Counting back past zero doesn't stop — the number line continues into negative numbers, and you keep going the same way.",
          method: ["Count back to zero first.", "Keep counting back the rest of the way into negative numbers."],
          steps: [`Counting back from ${start} to 0 uses ${start} counts.`, `That leaves ${back - start} more counts to go past zero.`, `Landing on ${answer}.`],
          check: `${answer} + ${back} = ${answer + back}, matching the start of ${start}.`,
        } };
    },
  },
  digit_value_from_place: {
    difficulties: [1, 2],
    build(d) {
      const nd = d <= 1 ? 4 : pick([5, 6]);
      let digits;
      do { digits = Array.from({ length: nd }, () => rand(1, 9)); } while (new Set(digits).size !== nd);
      const num = Number(digits.join(""));
      const posIdx = rand(0, nd - 1);
      const place = nd - 1 - posIdx;
      const placeNames = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands"];
      const digit = digits[posIdx];
      const value = digit * Math.pow(10, place);
      const decoys = [digit, digit * Math.pow(10, place + 1), digit * Math.pow(10, Math.max(place - 1, 0)), value + digit].filter((x) => x !== value);
      const { options, correctIndex } = buildMC(value, decoys);
      const placeWorth = Math.pow(10, place);
      return { q: `What is the value of the digit ${digit} in the number ${num.toLocaleString()}?`, options, correctIndex,
        hint: "This is a place value question. Work out which place the named digit is sitting in, work out what that place is worth, then multiply.",
        solution: {
          scenario: `The number is ${num.toLocaleString()}. We need the value of the digit ${digit} in it.`,
          idea: "A digit's real value depends on its place. Multiply the digit by what its place is worth to find its true value.",
          method: ["Find which place the named digit is in.", "Work out what that place is worth.", "Multiply the digit by that place value."],
          steps: [`The digit ${digit} is in the ${placeNames[place]} place, worth ${placeWorth.toLocaleString()}.`, `${digit} × ${placeWorth.toLocaleString()} = ${value.toLocaleString()}.`],
          check: `${digit} lots of ${placeWorth.toLocaleString()} is ${value.toLocaleString()}, matching the place it sits in.`,
        } };
    },
  },
  digit_from_place_name: {
    difficulties: [1, 2],
    build(d) {
      const nd = d <= 1 ? 4 : pick([5, 6]);
      let digits;
      do { digits = Array.from({ length: nd }, () => rand(1, 9)); } while (new Set(digits).size !== nd);
      const num = Number(digits.join(""));
      const posIdx = rand(0, nd - 1);
      const place = nd - 1 - posIdx;
      const placeNames = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands"];
      const digit = digits[posIdx];
      const decoys = digits.filter((x) => x !== digit);
      const { options, correctIndex } = buildMC(digit, decoys);
      return { q: `In the number ${num.toLocaleString()}, what digit is in the ${placeNames[place]} place?`, options, correctIndex,
        hint: "This is a read the digit question. Find the place named in the question, then read off whichever digit is sitting there.",
        solution: {
          scenario: `We need to find which digit sits in the ${placeNames[place]} place of ${num.toLocaleString()}.`,
          idea: "Every place in a number is a fixed slot, from ones on the right through tens, hundreds and upward. Find the named slot and read off whatever digit is written there.",
          method: ["Count along the number to find the named place.", "Read off the digit sitting in that place."],
          steps: [`Counting from the right, the ${placeNames[place]} place in ${num.toLocaleString()} holds the digit ${digit}.`],
          check: `Putting ${digit} back in the ${placeNames[place]} place rebuilds ${num.toLocaleString()}.`,
        } };
    },
  },
  place_name_from_digit: {
    difficulties: [1, 2],
    build(d) {
      const nd = d <= 1 ? 4 : pick([5, 6]);
      let digits;
      do { digits = Array.from({ length: nd }, () => rand(1, 9)); } while (new Set(digits).size !== nd);
      const num = Number(digits.join(""));
      const posIdx = rand(0, nd - 1);
      const place = nd - 1 - posIdx;
      const placeNames = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands"];
      const digit = digits[posIdx];
      const correctName = placeNames[place];
      const decoyNames = placeNames.filter((n) => n !== correctName);
      const { options, correctIndex } = buildMCStr(correctName, decoyNames);
      return { q: `In the number ${num.toLocaleString()}, which place is the digit ${digit} in?`, options, correctIndex,
        hint: "This is a name the place question. Find where the given digit sits, counting places from the right (ones, tens, hundreds...), and name that place.",
        solution: {
          scenario: `We need to say which place the digit ${digit} occupies in ${num.toLocaleString()}.`,
          idea: "Each position in a number has its own name, counting from the right: ones, then tens, then hundreds, and so on.",
          method: ["Find the digit in the number.", "Count places from the right to name its position."],
          steps: [`Counting from the right, the digit ${digit} is in the ${correctName} place.`],
          check: `The ${correctName} place in ${num.toLocaleString()} does hold ${digit}.`,
        } };
    },
  },
  compose_from_named_parts: {
    difficulties: [1, 2],
    build(d) {
      const nd = d <= 1 ? 4 : 5;
      const unitPow = nd === 4 ? [1000, 100, 10, 1] : [10000, 1000, 100, 10, 1];
      const unitLabels = nd === 4 ? ["thousand", "hundred", "ten", "one"] : ["ten-thousand", "thousand", "hundred", "ten", "one"];
      let parts;
      do { parts = Array.from({ length: nd }, (_, i) => (i === 0 ? rand(1, 9) : rand(0, 9))); } while (parts.filter((p) => p > 0).length < Math.min(3, nd));
      const num = parts.reduce((sum, p, i) => sum + p * unitPow[i], 0);
      const descParts = parts.map((p, i) => (p ? `${p} ${unitLabels[i]}${p > 1 ? "s" : ""}` : null)).filter(Boolean);
      const desc = descParts.length > 1 ? descParts.slice(0, -1).join(", ") + " and " + descParts[descParts.length - 1] : descParts[0];
      const partVals = parts.map((p, i) => p * unitPow[i]).filter((v) => v > 0);
      const decoys = [num + unitPow[nd - 2] * 2, num - unitPow[1], Number(parts.filter((p) => p > 0).join("")), num + unitPow[0]].filter((x) => x !== num && x >= 0);
      const { options, correctIndex } = buildMC(num, decoys);
      return { q: `A number is made from ${desc}. What is the number?`, options, correctIndex,
        hint: "This is a build the number question. Work out the value of each named part, then add all the parts together.",
        solution: {
          scenario: `A number is made from ${desc}. We need to work out what the number is.`,
          idea: "A number can be split into place value parts. Each part already tells you a value, for example '3 hundreds' means 300. To rebuild the whole number, work out what each part is worth and add all the parts together.",
          method: ["Work out the value of each named part.", "Add all the values together."],
          steps: [...descParts.map((label, i) => `${label} is worth ${partVals[i].toLocaleString()}.`), `Adding these together gives ${num.toLocaleString()}.`],
          check: `Reading ${num.toLocaleString()} back digit by digit matches the parts given.`,
        } };
    },
  },
  missing_addend_partition: {
    difficulties: [1, 2],
    build(d) {
      const nd = d <= 1 ? pick([3, 4]) : pick([4, 5]);
      let digits;
      do { digits = Array.from({ length: nd }, () => rand(1, 9)); } while (new Set(digits).size !== nd);
      const num = Number(digits.join(""));
      const gapPlace = rand(0, nd - 2);
      const gapDigit = rand(1, 9);
      const gap = gapDigit * Math.pow(10, gapPlace);
      if (gap >= num) return null;
      const firstPart = num - gap;
      const decoys = [num - gap * 10, num + gap, firstPart + gap * 2, num].filter((x) => x !== gap && x > 0);
      const { options, correctIndex } = buildMC(gap, decoys);
      return { q: `${num.toLocaleString()} = ${firstPart.toLocaleString()} + ?. What number is missing?`, options, correctIndex,
        hint: "This is a fill in the missing part question. Take the known part away from the whole number to find the missing part.",
        solution: {
          scenario: `${num.toLocaleString()} is made of two parts added together. One part is ${firstPart.toLocaleString()}, and we need the other.`,
          idea: "If two parts add together to make a whole, and you know the whole and one part, subtracting the known part from the whole gives the missing part.",
          method: ["Take the known part away from the whole number.", "The result is the missing part."],
          steps: [`${num.toLocaleString()} − ${firstPart.toLocaleString()} = ${gap.toLocaleString()}.`],
          check: `Adding back: ${firstPart.toLocaleString()} + ${gap.toLocaleString()} = ${num.toLocaleString()}.`,
        } };
    },
  },
  unitizing: {
    difficulties: [2, 3],
    build(d) {
      const unit = d <= 2 ? pick(["tens", "hundreds"]) : pick(["hundreds", "thousands"]);
      const unitVal = unit === "tens" ? 10 : unit === "hundreds" ? 100 : 1000;
      const count = rand(15, unit === "thousands" ? 96 : 480);
      const num = count * unitVal;
      const decoys = [num, Math.round(num / (unitVal === 10 ? 100 : unitVal === 100 ? 1000 : 10)), count + unitVal / 10, count - 1]
        .filter((x) => x !== count && x >= 0 && Number.isFinite(x));
      const { options, correctIndex } = buildMC(count, decoys);
      return { q: `How many ${unit} are there in ${num.toLocaleString()}?`, options, correctIndex,
        hint: "This is a how many groups question. Since each group has a fixed size, divide the number by that size to see how many whole groups fit.",
        solution: {
          scenario: `We need to find how many ${unit} fit inside ${num.toLocaleString()}.`,
          idea: `A number can be thought of as a certain number of groups of ${unitVal}. To find how many groups fit into a number, divide the number by the size of the group.`,
          method: [`Work out the size of one group (${unitVal.toLocaleString()} for ${unit}).`, "Divide the number by the group size."],
          steps: [`${num.toLocaleString()} ÷ ${unitVal.toLocaleString()} = ${count}.`],
          check: `Multiplying back: ${count} × ${unitVal.toLocaleString()} = ${num.toLocaleString()}.`,
        } };
    },
  },
  compare_five_numbers: {
    difficulties: [1, 2],
    build(d) {
      const nd = d <= 1 ? 4 : 5;
      const nums = new Set();
      let guard = 0;
      while (nums.size < 5 && guard < 300) {
        guard++;
        const digits = Array.from({ length: nd }, () => rand(0, 9));
        if (digits[0] === 0) continue;
        nums.add(Number(digits.join("")));
      }
      if (nums.size < 5) return null;
      const arr = [...nums];
      const wantMax = pick([true, false]);
      const answer = wantMax ? Math.max(...arr) : Math.min(...arr);
      const shuffledArr = shuffle(arr);
      const options = shuffledArr.map((n) => n.toLocaleString());
      const correctIndex = shuffledArr.indexOf(answer);
      return { q: `Which of these numbers is the ${wantMax ? "largest" : "smallest"}: ${arr.map((n) => n.toLocaleString()).join(", ")}?`, options, correctIndex,
        hint: "This is a compare several numbers question. Compare digits one place at a time, starting from the leftmost digit.",
        solution: {
          scenario: `We need the ${wantMax ? "largest" : "smallest"} of these numbers: ${arr.map((n) => n.toLocaleString()).join(", ")}.`,
          idea: "The leftmost digit affects a number's size the most, so compare leftmost digits first, moving right only on a tie.",
          method: ["Line up the numbers by place value.", "Compare the leftmost digits first.", "Break ties by moving one place to the right."],
          steps: [`Comparing leftmost digits, the ${wantMax ? "largest" : "smallest"} number is ${answer.toLocaleString()}.`],
          check: `No other number in the list beats ${answer.toLocaleString()} for being the ${wantMax ? "largest" : "smallest"}.`,
        } };
    },
  },
  order_numbers: {
    difficulties: [2, 3],
    build(d) {
      const nd = d <= 2 ? 4 : 5;
      const nums = new Set();
      let guard = 0;
      while (nums.size < 4 && guard < 300) {
        guard++;
        const digits = Array.from({ length: nd }, () => rand(0, 9));
        if (digits[0] === 0) continue;
        nums.add(Number(digits.join("")));
      }
      if (nums.size < 4) return null;
      const arr = [...nums];
      const wantAsc = pick([true, false]);
      const sorted = [...arr].sort((a, b) => (wantAsc ? a - b : b - a));
      const correctStr = sorted.map((n) => n.toLocaleString()).join(", ");
      function permute(a) {
        if (a.length <= 1) return [a];
        const res = [];
        for (let k = 0; k < a.length; k++) { const rest = [...a.slice(0, k), ...a.slice(k + 1)]; for (const p of permute(rest)) res.push([a[k], ...p]); }
        return res;
      }
      const allPerms = permute(arr).map((p) => p.map((n) => n.toLocaleString()).join(", "));
      const wrongPerms = shuffle([...new Set(allPerms)].filter((s) => s !== correctStr));
      const decoys = wrongPerms.slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correctStr, decoys);
      return { q: `Put these numbers in order, from ${wantAsc ? "smallest to largest" : "largest to smallest"}: ${shuffle(arr).map((n) => n.toLocaleString()).join(", ")}.`, options, correctIndex,
        hint: "This is a full ordering question, not just picking one extreme. Compare every number's leftmost digits first, and work through them one at a time.",
        solution: {
          scenario: `We need to order ${arr.map((n) => n.toLocaleString()).join(", ")} from ${wantAsc ? "smallest to largest" : "largest to smallest"}.`,
          idea: "Comparing several numbers at once works the same way as comparing two: look at the leftmost digits first, and only move on when there's a tie.",
          method: ["Compare the leftmost digit of every number.", "Break any ties by moving one digit to the right.", "Arrange all the numbers in the required order."],
          steps: [`Comparing place by place gives the order: ${correctStr}.`],
          check: `Each number in this list is ${wantAsc ? "bigger" : "smaller"} than the one before it.`,
        } };
    },
  },
  matching_expanded_form: {
    difficulties: [2, 3],
    build(d) {
      const nd = d <= 2 ? 4 : 5;
      let digits;
      do { digits = Array.from({ length: nd }, () => rand(1, 9)); } while (new Set(digits).size !== nd);
      const num = Number(digits.join(""));
      const unitPow = nd === 4 ? [1000, 100, 10, 1] : [10000, 1000, 100, 10, 1];
      const correctParts = digits.map((dg, i) => dg * unitPow[i]);
      const correctStr = correctParts.map((v) => v.toLocaleString()).join(" + ");
      function decoyAt(swapIdx, dir) {
        const parts = correctParts.slice();
        const newPow = unitPow[swapIdx] * (dir === "up" ? 10 : 0.1);
        if (newPow < 1) return null;
        parts[swapIdx] = digits[swapIdx] * newPow;
        return parts.map((v) => v.toLocaleString()).join(" + ");
      }
      const candidateDecoys = [];
      for (let i = 0; i < nd; i++) {
        const up = decoyAt(i, "up"); if (up) candidateDecoys.push(up);
        const down = decoyAt(i, "down"); if (down) candidateDecoys.push(down);
      }
      const decoys = shuffle([...new Set(candidateDecoys)].filter((s) => s !== correctStr)).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correctStr, decoys);
      return { q: `Which of these is the correct expanded (partitioned) form of ${num.toLocaleString()}?`, options, correctIndex,
        hint: "This is a spot the correct partition question. Every digit's true value depends on its own place — check each term against the place it's supposed to represent.",
        solution: {
          scenario: `We need the expanded form of ${num.toLocaleString()} that correctly shows every digit's true value.`,
          idea: "Expanded form rewrites a number as the sum of each digit's real value. Getting one digit's place wrong changes its value by a factor of 10.",
          method: ["Work out each digit's place.", "Multiply each digit by what its place is worth.", "Add the parts together to check they rebuild the original number."],
          steps: [`${num.toLocaleString()} = ${correctStr}.`],
          check: `Adding ${correctParts.map((v) => v.toLocaleString()).join(" + ")} together gives ${num.toLocaleString()} again.`,
        } };
    },
  },
  two_step_partition: {
    difficulties: [2, 3],
    build(d) {
      const nd = pick([4, 5]);
      let digits;
      do { digits = Array.from({ length: nd }, () => rand(1, 9)); } while (new Set(digits).size !== nd);
      const num = Number(digits.join(""));
      const gap1 = rand(1, Math.floor(num / 4));
      const gap2 = rand(1, Math.floor(num / 4));
      const missing = num - gap1 - gap2;
      if (missing <= 0) return null;
      const decoys = [num - gap1, num - gap2, missing + gap1, missing - gap2].filter((x) => x !== missing && x > 0);
      const { options, correctIndex } = buildMC(missing, decoys);
      return { q: `${num.toLocaleString()} = ${gap1.toLocaleString()} + ${gap2.toLocaleString()} + ?. What number is missing?`, options, correctIndex,
        hint: "This is a fill in the missing part question with three parts instead of two. Add up the parts you already know, then subtract that from the whole.",
        solution: {
          scenario: `${num.toLocaleString()} is split into three parts. Two are ${gap1.toLocaleString()} and ${gap2.toLocaleString()}, and we need the third.`,
          idea: "If several parts add together to make a whole, and you know all but one part, add up the known parts and take that away from the whole.",
          method: ["Add together the parts you already know.", "Subtract that total from the whole number."],
          steps: [`${gap1.toLocaleString()} + ${gap2.toLocaleString()} = ${(gap1 + gap2).toLocaleString()}.`, `${num.toLocaleString()} − ${(gap1 + gap2).toLocaleString()} = ${missing.toLocaleString()}.`],
          check: `Adding back: ${gap1.toLocaleString()} + ${gap2.toLocaleString()} + ${missing.toLocaleString()} = ${num.toLocaleString()}.`,
        } };
    },
  },
  digit_range_for_inequality: {
    difficulties: [3, 4],
    build(d) {
      const nd = pick([4, 5]);
      const blankPos = d >= 4 ? nd - 1 : rand(1, nd - 2);
      let digits;
      do { digits = Array.from({ length: nd }, () => rand(0, 9)); } while (digits[0] === 0);
      const place = nd - 1 - blankPos;
      const placeVal = Math.pow(10, place);
      const baseWithoutBlank = Number(digits.map((dg, i) => (i === blankPos ? "0" : dg)).join(""));
      const wantGreater = pick([true, false]);
      const wantEven = d >= 4 ? pick([true, false]) : null;
      const x0 = rand(1, 8);
      const boundaryN = baseWithoutBlank + x0 * placeVal;
      const spread = Math.max(1, Math.min(placeVal, 50));
      const threshold = wantGreater ? boundaryN - rand(1, spread) : boundaryN + rand(1, spread);
      let validDigits = [];
      for (let x = 0; x <= 9; x++) {
        if (wantEven === true && x % 2 !== 0) continue;
        if (wantEven === false && x % 2 === 0) continue;
        const n = baseWithoutBlank + x * placeVal;
        if (wantGreater ? n > threshold : n < threshold) validDigits.push(x);
      }
      if (validDigits.length === 0) return null;
      const answer = wantGreater ? Math.min(...validDigits) : Math.max(...validDigits);
      const shownDigits = digits.map((dg, i) => (i === blankPos ? "_" : dg)).join("");
      const decoys = shuffle([...Array(10).keys()].filter((x) => x !== answer)).slice(0, 4);
      const { options, correctIndex } = buildMC(answer, decoys);
      const extreme = wantGreater ? "smallest" : "largest";
      const parityClause = wantEven === null ? "" : ` and the number must be ${wantEven ? "even" : "odd"}`;
      return { q: `In the number ${shownDigits}, what is the ${extreme} digit that could go in the blank so that the number is ${wantGreater ? "greater" : "less"} than ${threshold.toLocaleString()}${parityClause}?`, options, correctIndex,
        hint: "This is a find the boundary digit question. Try each possible digit in the blank and check it against every rule in the question, then pick the most extreme one that works.",
        solution: {
          scenario: `${shownDigits} must be ${wantGreater ? "greater" : "less"} than ${threshold.toLocaleString()}${parityClause}, and we need the ${extreme} valid digit for the blank.`,
          idea: "Filling the blank with a bigger digit always makes the whole number bigger, since every other digit stays fixed. Checking each digit from 0 to 9 against every rule finds all the digits that work.",
          method: ["Try each digit 0-9 in the blank.", "Check the resulting number against every rule in the question.", `Pick the ${extreme} digit that still satisfies all of them.`],
          steps: [
            `Filling the blank with digit x makes the number ${baseWithoutBlank.toLocaleString()} + x × ${placeVal.toLocaleString()}.`,
            `Checking each digit 0-9 against the rule${wantEven === null ? "" : "s"} shows it works for: ${validDigits.join(", ")}.`,
            `The ${extreme} of those is ${answer}.`,
          ],
          check: `Filling in ${answer} gives ${shownDigits.replace("_", answer)}, which is ${wantGreater ? "greater" : "less"} than ${threshold.toLocaleString()}${parityClause}.`,
        } };
    },
  },
  swap_two_digits_change: {
    difficulties: [3, 4],
    build(d) {
      const nd = d >= 4 ? 5 : pick([4, 5]);
      const placeNames = ["ones", "tens", "hundreds", "thousands", "ten thousands"];
      let digits;
      do { digits = Array.from({ length: nd }, () => rand(0, 9)); } while (digits[0] === 0 || new Set(digits).size !== nd);
      const i = rand(0, nd - 1), j = rand(0, nd - 1);
      if (i === j) return null;
      const before = Number(digits.join(""));
      const swapped = [...digits]; [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
      if (swapped[0] === 0) return null;
      const placeI = nd - 1 - i, placeJ = nd - 1 - j;
      const diff = (digits[j] - digits[i]) * Math.pow(10, placeI) + (digits[i] - digits[j]) * Math.pow(10, placeJ);
      const after = Number(swapped.join(""));
      if (after - before !== diff) return null;
      const decoys = [-diff, Math.abs(digits[i] - digits[j]), (digits[j] - digits[i]) * Math.pow(10, placeJ), -diff + 10].filter((x) => x !== diff);
      const { options, correctIndex } = buildMC(diff, decoys);
      const beforeValI = digits[i] * Math.pow(10, placeI);
      const beforeValJ = digits[j] * Math.pow(10, placeJ);
      const afterValI = digits[j] * Math.pow(10, placeI);
      const afterValJ = digits[i] * Math.pow(10, placeJ);
      return { q: `In the number ${before.toLocaleString()}, the digit in the ${placeNames[placeI]} place is swapped with the digit in the ${placeNames[placeJ]} place. By how much does the number change? (Use a negative number if it decreases.)`, options, correctIndex,
        hint: "This is a swap the digits question. Work out what each of the two digits was worth before the swap and what it's worth after, then combine the two changes.",
        solution: {
          scenario: `In ${before.toLocaleString()}, the digit in the ${placeNames[placeI]} place swaps with the digit in the ${placeNames[placeJ]} place. We need the overall change.`,
          idea: "When two digits swap places, each one moves to a place worth a different amount. The overall change is the change from the first digit moving, plus the change from the second.",
          method: ["Work out what each digit is worth in its original place.", "Work out what each digit is worth in its new place.", "Add up the two changes."],
          steps: [
            `Before: ${digits[i]} in the ${placeNames[placeI]} place is worth ${beforeValI.toLocaleString()}; ${digits[j]} in the ${placeNames[placeJ]} place is worth ${beforeValJ.toLocaleString()}.`,
            `After: ${digits[j]} in the ${placeNames[placeI]} place is worth ${afterValI.toLocaleString()}; ${digits[i]} in the ${placeNames[placeJ]} place is worth ${afterValJ.toLocaleString()}.`,
            `Change = (${afterValI.toLocaleString()} − ${beforeValI.toLocaleString()}) + (${afterValJ.toLocaleString()} − ${beforeValJ.toLocaleString()}) = ${diff.toLocaleString()}.`,
          ],
          check: `${before.toLocaleString()} became ${after.toLocaleString()}, a change of ${(after - before).toLocaleString()}, matching ${diff.toLocaleString()}.`,
        } };
    },
  },
  arrange_digits_extremum: {
    difficulties: [3],
    build(d) {
      const nd = pick([4, 5]);
      let digits, guard = 0;
      do { digits = Array.from({ length: nd }, () => rand(0, 9)); guard++; } while ((new Set(digits).size !== nd || digits.filter((x) => x === 0).length > 1) && guard < 200);
      if (guard >= 200) return null;
      const wantMax = pick([true, false]);
      function permute(arr) { if (arr.length <= 1) return [arr]; const res = []; for (let k = 0; k < arr.length; k++) { const rest = [...arr.slice(0, k), ...arr.slice(k + 1)]; for (const p of permute(rest)) res.push([arr[k], ...p]); } return res; }
      function bestArrangement(ds, max) {
        let best = null;
        for (const perm of permute(ds)) { if (perm[0] === 0) continue; const val = Number(perm.join("")); if (best === null || (max ? val > best : val < best)) best = val; }
        return best;
      }
      const answer = bestArrangement(digits, wantMax);
      if (answer === null) return null;
      const sortedDesc = Number([...digits].sort((a, b) => b - a).join(""));
      const sortedAsc = Number([...digits].sort((a, b) => a - b).join(""));
      const opp = bestArrangement(digits, !wantMax);
      const decoys = [sortedDesc, sortedAsc, opp, answer + 10, answer - 10].filter((x) => x !== null && Number.isFinite(x) && x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `Using the digits ${digits.join(", ")} exactly once each, what is the ${wantMax ? "largest" : "smallest"} number you can make?`, options, correctIndex,
        hint: "This is an arrange the digits question. Put your biggest digits in the places worth the most for the largest number, or your smallest digits there for the smallest number (without starting with 0).",
        solution: {
          scenario: `We must use the digits ${digits.join(", ")} exactly once each to make the ${wantMax ? "largest" : "smallest"} possible number.`,
          idea: "To make the biggest possible number from a set of digits, put the biggest digits in the places worth the most, reading from the left. To make the smallest, do the opposite — but the number still can't start with a 0.",
          method: ["Sort the digits by size.", "Place them in order into the number, leftmost place first, without starting with 0."],
          steps: [`Arranging ${digits.join(", ")} to be as ${wantMax ? "large" : "small"} as possible gives ${answer.toLocaleString()}.`],
          check: `${answer.toLocaleString()} uses each of the digits ${digits.join(", ")} exactly once.`,
        } };
    },
  },
  arrange_digits_with_parity: {
    difficulties: [4],
    build(d) {
      const nd = pick([4, 5]);
      let digits, guard = 0;
      do { digits = Array.from({ length: nd }, () => rand(0, 9)); guard++; } while ((new Set(digits).size !== nd || digits.filter((x) => x === 0).length > 1) && guard < 200);
      if (guard >= 200) return null;
      const wantMax = pick([true, false]);
      const wantEven = pick([true, false]);
      function permute(arr) { if (arr.length <= 1) return [arr]; const res = []; for (let k = 0; k < arr.length; k++) { const rest = [...arr.slice(0, k), ...arr.slice(k + 1)]; for (const p of permute(rest)) res.push([arr[k], ...p]); } return res; }
      function bestArrangement(ds, max, evenReq) {
        let best = null;
        for (const perm of permute(ds)) {
          if (perm[0] === 0) continue;
          if (evenReq === true && perm[perm.length - 1] % 2 !== 0) continue;
          if (evenReq === false && perm[perm.length - 1] % 2 === 0) continue;
          const val = Number(perm.join(""));
          if (best === null || (max ? val > best : val < best)) best = val;
        }
        return best;
      }
      const answer = bestArrangement(digits, wantMax, wantEven);
      if (answer === null) return null;
      const noParity = bestArrangement(digits, wantMax, null);
      const opp = bestArrangement(digits, !wantMax, wantEven);
      const flippedParity = bestArrangement(digits, wantMax, !wantEven);
      const decoys = [noParity, opp, flippedParity, answer + 10].filter((x) => x !== null && Number.isFinite(x) && x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `Using the digits ${digits.join(", ")} exactly once each, what is the ${wantMax ? "largest" : "smallest"} number you can make that is ${wantEven ? "even" : "odd"}?`, options, correctIndex,
        hint: "This is an arrange the digits question with an extra rule. Because the LAST digit decides odd or even, fix that digit first from the allowed set, then arrange the rest to be as big (or small) as possible.",
        solution: {
          scenario: `We must use the digits ${digits.join(", ")} exactly once each to make the ${wantMax ? "largest" : "smallest"} possible number that is ${wantEven ? "even" : "odd"}.`,
          idea: "Whether a number is even or odd depends only on its LAST digit. First decide which of the given digits are allowed in the last place, then arrange all the remaining digits to be as large (or small) as possible before it. This sometimes means giving up the very best arrangement to satisfy the extra rule.",
          method: [`Find which of the digits are ${wantEven ? "even" : "odd"} — only those can go last.`, "Put the largest (or smallest) remaining digits into the highest places, without starting with 0.", "Check the last digit still satisfies the rule."],
          steps: [`Arranging ${digits.join(", ")} to be as ${wantMax ? "large" : "small"} as possible while ending in a${wantEven ? "n even" : "n odd"} digit gives ${answer.toLocaleString()}.`],
          check: `${answer.toLocaleString()} uses each digit exactly once and ends in ${answer % 10}, which is ${answer % 10 % 2 === 0 ? "even" : "odd"} as required.`,
        } };
    },
  },
  two_number_extremum_sum: {
    difficulties: [3, 4],
    build(d) {
      const k = d >= 4 ? 3 : 2;
      const total = 2 * k;
      let digits;
      do { digits = Array.from({ length: total }, () => rand(1, 9)); } while (new Set(digits).size !== total);
      const wantMax = pick([true, false]);
      function permute(arr) { if (arr.length <= 1) return [arr]; const res = []; for (let i = 0; i < arr.length; i++) { const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]; for (const p of permute(rest)) res.push([arr[i], ...p]); } return res; }
      let best = null, bestPair = null;
      for (const perm of permute(digits)) {
        const a = Number(perm.slice(0, k).join(""));
        const b = Number(perm.slice(k).join(""));
        const sum = a + b;
        if (best === null || (wantMax ? sum > best : sum < best)) { best = sum; bestPair = [a, b]; }
      }
      const decoys = [best + 10, best - 10, best + 1, best - 100].filter((x) => x !== best && x > 0);
      const { options, correctIndex } = buildMC(best, decoys);
      return { q: `Using the digits ${digits.join(", ")} exactly once each, split them into two ${k}-digit numbers. What is the ${wantMax ? "largest" : "smallest"} possible sum of the two numbers?`, options, correctIndex,
        hint: "This is a split into two numbers question. Since addition doesn't care which number a digit ends up in, only which PLACE it lands in, put the biggest digits in the two most valuable places (across both numbers) for the largest sum, or the smallest digits there for the smallest sum.",
        solution: {
          scenario: `We split the digits ${digits.join(", ")} into two ${k}-digit numbers and want the ${wantMax ? "largest" : "smallest"} possible sum.`,
          idea: `Adding two numbers together, a digit's contribution to the total depends only on which place it sits in, not which of the two numbers it's part of. So to get the ${wantMax ? "largest" : "smallest"} sum, put the ${wantMax ? "biggest" : "smallest"} digits in the places worth the most across BOTH numbers.`,
          method: ["Work out how many places (across both numbers) are worth the most.", `Put the ${wantMax ? "biggest" : "smallest"} available digits into those places.`, "Fill in the rest and add the two numbers together."],
          steps: [`One arrangement that achieves this is ${bestPair[0]} and ${bestPair[1]}.`, `${bestPair[0]} + ${bestPair[1]} = ${best.toLocaleString()}.`],
          check: `No other way of splitting these digits into two ${k}-digit numbers gives a ${wantMax ? "bigger" : "smaller"} sum.`,
        } };
    },
  },
  two_number_extremum_product: {
    difficulties: [4],
    build(d) {
      const k = pick([2, 3]);
      const total = 2 * k;
      let digits;
      do { digits = Array.from({ length: total }, () => rand(1, 9)); } while (new Set(digits).size !== total);
      const wantMax = pick([true, false]);
      function permute(arr) { if (arr.length <= 1) return [arr]; const res = []; for (let i = 0; i < arr.length; i++) { const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]; for (const p of permute(rest)) res.push([arr[i], ...p]); } return res; }
      let best = null, bestPair = null;
      for (const perm of permute(digits)) {
        const a = Number(perm.slice(0, k).join(""));
        const b = Number(perm.slice(k).join(""));
        const prod = a * b;
        if (best === null || (wantMax ? prod > best : prod < best)) { best = prod; bestPair = [a, b]; }
      }
      const decoys = [Math.round(best * 1.1), Math.round(best * 0.9), Math.round(best + best / 10), Math.round(best - best / 5)].filter((x) => x !== best && x > 0);
      const { options, correctIndex } = buildMC(best, decoys);
      return { q: `Using the digits ${digits.join(", ")} exactly once each, split them into two ${k}-digit numbers. What is the ${wantMax ? "largest" : "smallest"} possible PRODUCT of the two numbers?`, options, correctIndex,
        hint: "This is a split into two numbers question, but for a product instead of a sum. Unlike a sum, it matters which number a digit goes into, not just which place — pairing the biggest remaining digit with the biggest remaining place, across both numbers, gives the biggest product.",
        solution: {
          scenario: `We split the digits ${digits.join(", ")} into two ${k}-digit numbers and want the ${wantMax ? "largest" : "smallest"} possible product.`,
          idea: `A product is much fussier than a sum about exactly how digits are placed, so the safest way to be sure of the true ${wantMax ? "biggest" : "smallest"} product is to check every genuinely different way of splitting the digits and compare.`,
          method: ["Try assigning digits to the two numbers systematically, largest/smallest digits toward the most valuable places.", "Work out the product for each arrangement.", "Compare to find the true extreme."],
          steps: [`One arrangement that achieves this is ${bestPair[0]} and ${bestPair[1]}.`, `${bestPair[0]} × ${bestPair[1]} = ${best.toLocaleString()}.`],
          check: `Checking other ways of splitting these digits confirms none gives a ${wantMax ? "bigger" : "smaller"} product.`,
        } };
    },
  },
  reconstruct_from_clues: {
    difficulties: [3, 4],
    build(d) {
      const nd = d >= 4 ? 5 : 4;
      // d3 leaves one digit genuinely unknown (a monotonic clue like "digit sum" pins it down
      // on its own); d4 leaves two unknown, needing two clues together — a real jump in search
      // effort, not just bigger numbers.
      const freeCount = d >= 4 ? 2 : 1;
      let digits;
      do { digits = Array.from({ length: nd }, () => rand(1, 9)); } while (new Set(digits).size !== nd);
      const target = Number(digits.join(""));
      const placeNames = ["ones", "tens", "hundreds", "thousands", "ten thousands"];
      // Re-roll which positions are "free" vs directly given up to 15 times — a fresh
      // combination is usually enough to land on one that pins the number down uniquely, and
      // uniqueness is always VERIFIED by brute force below before the question is ever used
      // (never assumed from the clue wording alone — that's exactly the class of bug this
      // structure must avoid).
      for (let attempt = 0; attempt < 15; attempt++) {
        const positions = shuffle([...Array(nd).keys()]);
        const freePositions = positions.slice(0, freeCount);
        const fixedPositions = positions.slice(freeCount);
        const fixedClues = fixedPositions.map((i) => ({ text: `its ${placeNames[nd - 1 - i]} digit is ${digits[i]}`, test: (ds) => ds[i] === digits[i] }));
        const sum = digits.reduce((a, b) => a + b, 0);
        const sumClue = { text: `the sum of all its digits is ${sum}`, test: (ds) => ds.reduce((a, b) => a + b, 0) === sum };
        let softClues;
        if (freeCount === 1) {
          softClues = [sumClue];
        } else {
          const [f0, f1] = freePositions;
          softClues = [sumClue, { text: `its ${placeNames[nd - 1 - f0]} digit is ${digits[f0] > digits[f1] ? "bigger than" : digits[f0] < digits[f1] ? "smaller than" : "equal to"} its ${placeNames[nd - 1 - f1]} digit`, test: (ds) => (digits[f0] > digits[f1] ? ds[f0] > ds[f1] : digits[f0] < digits[f1] ? ds[f0] < ds[f1] : ds[f0] === ds[f1]) }];
        }
        const allClues = shuffle([...fixedClues, ...softClues]);
        const ranges = freePositions.map((p) => (p === 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
        const matches = [];
        (function search(idx, ds) {
          if (matches.length >= 2) return;
          if (idx === freePositions.length) { if (allClues.every((c) => c.test(ds))) matches.push(Number(ds.join(""))); return; }
          for (const v of ranges[idx]) { const next = ds.slice(); next[freePositions[idx]] = v; search(idx + 1, next); }
        })(0, digits.slice());
        if (matches.length === 1 && matches[0] === target) {
          const decoys = [target + 10, target - 10, target + 100, target - 1].filter((x) => x !== target && x > 0);
          const { options, correctIndex } = buildMC(target, decoys);
          const clueList = allClues.map((c) => c.text).join(", and ");
          return { q: `A ${nd}-digit number has these clues: ${clueList}. What is the number?`, options, correctIndex,
            hint: "This is a work out the number from clues question. Use the clues one at a time to rule out possibilities, checking each surviving candidate against every clue.",
            solution: {
              scenario: `We need a ${nd}-digit number satisfying: ${clueList}.`,
              idea: "When several clues together pin down exactly one number, working through them in turn — using each clue to rule out numbers that don't fit — narrows the search down to the single answer.",
              method: ["Use the clues that name an exact digit first — they fix most of the number straight away.", "Use the remaining clues to narrow down whatever's left.", "Confirm only one number satisfies all the clues."],
              steps: [`Checking every clue together, the only ${nd}-digit number that fits all of them is ${target.toLocaleString()}.`],
              check: `${target.toLocaleString()} satisfies every clue: ${clueList}.`,
            } };
        }
      }
      return null;
    },
  },
  roman_clock_read: {
    difficulties: [1, 2],
    curriculum: "KS2 Roman numerals from I to C",
    build(d) {
      const value = d === 1 ? rand(1, 12) : rand(13, 100);
      const numeral = PV_toRoman(value);
      const { options, correctIndex } = buildMC(value, [value + 1, Math.max(1, value - 1), Math.min(100, value + 5), Math.max(1, value - 5)]);
      return { q: `${numeral} is written on an old Ninefold dial. What number does it represent?`, svg: PV_romanTileSvg(numeral), options, correctIndex,
        hint: "Read the symbols from left to right. A smaller symbol before a larger one is subtracted; otherwise the values are added.",
        solution: { scenario: `We need to read the Roman numeral ${numeral}.`, idea: "Roman numerals combine symbols by addition, except when a smaller symbol comes immediately before a larger one.", method: ["Name the value of each symbol.", "Notice any subtractive pair such as IV, IX, XL or XC.", "Combine the values and check the result."], steps: [`Using I = 1, V = 5, X = 10, L = 50 and C = 100, ${numeral} represents ${value}.`], check: `${PV_toRoman(value)} is the standard Roman-numeral form of ${value}.` } };
    },
  },
  roman_numeral_construct: {
    difficulties: [2, 3],
    curriculum: "KS2 writing Roman numerals to 1000",
    build(d) {
      const value = d === 2 ? rand(14, 100) : rand(101, 999);
      const correct = PV_toRoman(value);
      const candidates = [value + 1, value - 1, value + (d === 2 ? 10 : 100), Math.max(1, value - (d === 2 ? 10 : 100))].map(PV_toRoman).filter((option) => option !== correct);
      const { options, correctIndex } = buildMCStr(correct, candidates);
      return { q: `The Ninefold ledger needs the number ${value} written in Roman numerals. Which entry is correct?`, options, correctIndex,
        hint: "Build the number from its largest Roman-numeral parts first, using subtractive pairs such as IV, IX, XL, XC, CD and CM where needed.",
        solution: { scenario: `We need to write ${value} using Roman numerals.`, idea: "Roman numerals are another way to partition a number into place-value parts.", method: ["Split the number into hundreds, tens and ones.", "Convert each part using the standard Roman symbols and subtractive pairs.", "Join the parts from greatest to least."], steps: [`Partition ${value} by place value.`, `Convert each non-zero part and join them to obtain ${correct}.`], check: `Reading ${correct} back gives ${value}.` } };
    },
  },
  roman_numeral_compare: {
    difficulties: [3, 4],
    curriculum: "KS2 comparing values represented by Roman numerals",
    build(d) {
      const ceiling = d === 3 ? 500 : 1000;
      let first = rand(40, ceiling), second;
      do { second = rand(40, ceiling); } while (second === first);
      const correct = Math.max(first, second);
      const smaller = Math.min(first, second);
      const { options, correctIndex } = buildMC(correct, [smaller, Math.abs(first - second), first + second, Math.round((first + second) / 2)]);
      return { q: `Two orchard stones are marked ${PV_toRoman(first)} and ${PV_toRoman(second)}. What is the greater value in ordinary digits?`, options, correctIndex,
        hint: "Translate each Roman numeral separately, then compare the ordinary numbers from their highest place value.",
        solution: { scenario: `We compare ${PV_toRoman(first)} and ${PV_toRoman(second)}.`, idea: "Translate before comparing so the Roman symbols cannot disguise which value is greater.", method: ["Read the first Roman numeral.", "Read the second Roman numeral.", "Compare the two ordinary numbers."], steps: [`${PV_toRoman(first)} = ${first}.`, `${PV_toRoman(second)} = ${second}.`, `${correct} is greater than ${smaller}.`], check: `Writing ${correct} back as ${PV_toRoman(correct)} matches the larger stone.` } };
    },
  },
  roman_ledger_change: {
    difficulties: [4],
    curriculum: "KS2 recognising years and quantities written in Roman numerals",
    build() {
      const start = rand(120, 780);
      const change = rand(25, Math.min(180, 1000 - start));
      const subtract = pick([true, false]);
      const correct = subtract ? start - change : start + change;
      const operation = subtract ? "removed" : "added";
      const { options, correctIndex } = buildMC(correct, [start + change, Math.abs(start - change), correct + 10, Math.max(1, correct - 10)]);
      return { q: `A Ninefold ledger records ${PV_toRoman(start)} baskets. The next line says ${PV_toRoman(change)} baskets were ${operation}. How many baskets are recorded now?`, options, correctIndex,
        hint: "Translate both Roman numerals first. Then use the change word to choose addition or subtraction.",
        solution: { scenario: `The ledger starts with ${PV_toRoman(start)} and ${PV_toRoman(change)} are ${operation}.`, idea: "An unfamiliar numeral system should be translated before solving the underlying arithmetic problem.", method: ["Translate each Roman numeral.", `Because baskets were ${operation}, ${subtract ? "subtract" : "add"}.`, "Check the result against the direction of the change."], steps: [`${PV_toRoman(start)} = ${start}.`, `${PV_toRoman(change)} = ${change}.`, `${start} ${subtract ? "-" : "+"} ${change} = ${correct}.`], check: `The result is ${subtract ? "smaller" : "larger"} than ${start}, as it should be when baskets are ${operation}.` } };
    },
  },
};
// Structure registry for roundingEstimate. Covers three related but genuinely distinct
// skills: rounding itself (direct and reversed), the exact-halfway convention (a rule, not
// a computation), and using rounding to estimate a calculation (sum/difference/product) —
// plus a "rounding doesn't apply here" context structure (always round up when leftover
// people/items need a whole extra unit) that tests judgement rather than mechanics.
const ROUNDING_ESTIMATE_STRUCTURES = {
  round_whole_number: {
    difficulties: [1, 2],
    build(d) {
      const placePow = d <= 1 ? pick([1, 2]) : pick([2, 3, 4]);
      const placeNames = ["ten", "hundred", "thousand", "ten thousand"];
      const nd = placePow + rand(1, 2);
      let num;
      do { num = rand(Math.pow(10, nd - 1), Math.pow(10, nd) - 1); } while (num % Math.pow(10, placePow) === 0);
      const unit = Math.pow(10, placePow);
      const rounded = Math.round(num / unit) * unit;
      const roundedDown = Math.floor(num / unit) * unit;
      const roundedUp = Math.ceil(num / unit) * unit;
      const decoys = [roundedDown, roundedUp, num].filter((x) => x !== rounded);
      const { options, correctIndex } = buildMC(rounded, decoys);
      return { q: `Round ${num.toLocaleString()} to the nearest ${placeNames[placePow - 1]}.`, options, correctIndex,
        hint: "This is a rounding question. Look at the digit just after the place you're rounding to: 5 or more rounds up, 4 or less rounds down.",
        solution: {
          scenario: `We need to round ${num.toLocaleString()} to the nearest ${placeNames[placePow - 1]}.`,
          idea: "Every number sits between two 'round' numbers at the place you're rounding to. Look at the digit just after that place: 5 or more rounds up, 4 or less rounds down.",
          method: ["Find the two round numbers either side of the number.", "Look at the digit just after the place you're rounding to.", "Round up or down accordingly."],
          steps: [`The two ${placeNames[placePow - 1]}s either side of ${num.toLocaleString()} are ${roundedDown.toLocaleString()} and ${roundedUp.toLocaleString()}.`, `${num.toLocaleString()} rounds to ${rounded.toLocaleString()}.`],
          check: `${rounded.toLocaleString()} is one of the two nearest ${placeNames[placePow - 1]}s to ${num.toLocaleString()}.`,
        } };
    },
  },
  round_decimal: {
    difficulties: [1, 2],
    build(d) {
      const dp = d <= 1 ? 1 : 2;
      const whole = rand(1, 99);
      let num, rounded, targetDesc, decoys, fmtFn = (x) => String(x);
      if (dp === 1) {
        const frac = rand(1, 9);
        num = Number(`${whole}.${frac}`);
        rounded = Math.round(num);
        targetDesc = "the nearest whole number";
        decoys = [Math.floor(num), Math.ceil(num), whole].filter((x) => x !== rounded);
      } else {
        const frac = rand(1, 99);
        num = Number(`${whole}.${String(frac).padStart(2, "0")}`);
        rounded = Math.round(num * 10) / 10;
        targetDesc = "1 decimal place";
        decoys = [Math.floor(num * 10 + 1e-9) / 10, Math.ceil(num * 10 - 1e-9) / 10, whole].filter((x) => x !== rounded);
        fmtFn = (v) => v.toFixed(1);
      }
      const { options, correctIndex } = buildMC(rounded, decoys, fmtFn);
      return { q: `Round ${num} to ${targetDesc}.`, options, correctIndex,
        hint: "This is a rounding decimals question. Look at the digit just after the place you're rounding to: 5 or more rounds up, otherwise round down.",
        solution: {
          scenario: `We need to round ${num} to ${targetDesc}.`,
          idea: "Rounding a decimal works the same way as rounding whole numbers: look at the digit just after the place you're rounding to, then round up or down.",
          method: ["Find the digit just after the place you're rounding to.", "Round up if that digit is 5 or more, round down if it's 4 or less."],
          steps: [`${num} rounds to ${rounded} (to ${targetDesc}).`],
          check: `${rounded} is one of the two nearest options to ${num} at ${targetDesc}.`,
        } };
    },
  },
  nearest_multiple: {
    difficulties: [1, 2],
    build(d) {
      const unit = d <= 1 ? 100 : 1000;
      let num;
      do { num = rand(unit + 1, unit * 90 - 1); } while (num % unit === 0);
      const below = Math.floor(num / unit) * unit;
      const above = Math.ceil(num / unit) * unit;
      const wantBelow = pick([true, false]);
      const answer = wantBelow ? below : above;
      const decoys = [wantBelow ? above : below, num, answer + unit, answer - unit].filter((x) => x !== answer && x >= 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `What is the ${wantBelow ? "previous" : "next"} multiple of ${unit} ${wantBelow ? "before" : "after"} ${num.toLocaleString()}?`, options, correctIndex,
        hint: "This is a nearest multiple question. Find the two multiples either side of the number, then pick the one asked for.",
        solution: {
          scenario: `We need the ${wantBelow ? "previous" : "next"} multiple of ${unit} ${wantBelow ? "before" : "after"} ${num.toLocaleString()}.`,
          idea: "Multiples of a number sit at regular steps. Any number in between two multiples has one just before it and one just after it.",
          method: ["Find the multiple just below the number and the multiple just above it.", "Pick the one asked for."],
          steps: [`Multiples of ${unit} near ${num.toLocaleString()} are ${below.toLocaleString()} and ${above.toLocaleString()}.`, `The ${wantBelow ? "previous" : "next"} one is ${answer.toLocaleString()}.`],
          check: `${answer.toLocaleString()} ÷ ${unit} = ${answer / unit}, a whole number, confirming it's a multiple of ${unit}.`,
        } };
    },
  },
  closer_to_which_bound: {
    difficulties: [1],
    build(d) {
      const placePow = pick([1, 2]);
      const unit = Math.pow(10, placePow);
      let num;
      do { num = rand(unit, unit * 90); } while (num % unit === 0);
      const below = Math.floor(num / unit) * unit;
      const above = below + unit;
      const closer = Math.abs(num - below) < Math.abs(num - above) ? below : above;
      const other = closer === below ? above : below;
      const decoys = [other, num, closer + (closer === below ? -1 : 1) * unit].filter((x) => x !== closer && x >= 0);
      const { options, correctIndex } = buildMC(closer, decoys);
      return { q: `Is ${num.toLocaleString()} closer to ${below.toLocaleString()} or to ${above.toLocaleString()}?`, options, correctIndex,
        hint: "This is a which is it closer to question — the first step before rounding. Compare the gap to each round number.",
        solution: {
          scenario: `We need to know whether ${num.toLocaleString()} is closer to ${below.toLocaleString()} or ${above.toLocaleString()}.`,
          idea: "Every number between two round numbers is a certain distance from each. Whichever has the smaller gap is the one it's closer to — that's exactly what rounding is really asking.",
          method: [`Find the gap between ${num.toLocaleString()} and ${below.toLocaleString()}.`, `Find the gap between ${num.toLocaleString()} and ${above.toLocaleString()}.`, "Compare the two gaps."],
          steps: [`${num.toLocaleString()} − ${below.toLocaleString()} = ${num - below}.`, `${above.toLocaleString()} − ${num.toLocaleString()} = ${above - num}.`, `The smaller gap is to ${closer.toLocaleString()}.`],
          check: `${closer.toLocaleString()} is only ${Math.min(num - below, above - num)} away, while ${other.toLocaleString()} is ${Math.max(num - below, above - num)} away.`,
        } };
    },
  },
  round_and_compare: {
    difficulties: [1, 2],
    build(d) {
      const placePow = d <= 1 ? pick([1, 2]) : pick([2, 3]);
      const placeNames = ["ten", "hundred", "thousand"];
      const unit = Math.pow(10, placePow);
      let a, b;
      do { a = rand(unit, unit * 90); b = rand(unit, unit * 90); } while (a === b || a % unit === 0 || b % unit === 0);
      const roundedA = Math.round(a / unit) * unit;
      const roundedB = Math.round(b / unit) * unit;
      const same = roundedA === roundedB;
      const labelA = a.toLocaleString(), labelB = b.toLocaleString();
      const correct = same ? "they round to the same value" : `${roundedA > roundedB ? labelA : labelB} rounds to the bigger value`;
      const decoyPool = [
        same ? `${labelA} rounds to the bigger value` : `${roundedA > roundedB ? labelB : labelA} rounds to the bigger value`,
        same ? `${labelB} rounds to the bigger value` : "they round to the same value",
        "it's impossible to tell without rounding",
        "neither rounds to a whole number",
      ];
      const { options, correctIndex } = buildMCStr(correct, decoyPool);
      return { q: `Round ${labelA} and ${labelB} to the nearest ${placeNames[placePow - 1]}. Which is true?`, options, correctIndex,
        hint: "This is a round then compare question. Round each number separately first, then compare the two rounded results.",
        solution: {
          scenario: `We round ${labelA} and ${labelB} to the nearest ${placeNames[placePow - 1]} and compare.`,
          idea: "Two different numbers can round to the exact same value, especially if they're close together — always round each one fully before comparing, rather than assuming the bigger original number must round to the bigger value.",
          method: ["Round the first number.", "Round the second number.", "Compare the two rounded results."],
          steps: [`${labelA} rounds to ${roundedA.toLocaleString()}.`, `${labelB} rounds to ${roundedB.toLocaleString()}.`],
          check: same ? `Both round to ${roundedA.toLocaleString()}, so they really are the same.` : `${roundedA.toLocaleString()} and ${roundedB.toLocaleString()} are different rounded values.`,
        } };
    },
  },
  halfway_convention: {
    difficulties: [2, 3],
    build(d) {
      const unit = d <= 2 ? pick([10, 100]) : pick([100, 1000]);
      const halfBand = unit / 2;
      const base = rand(2, 80) * unit;
      const num = base + halfBand;
      const rounded = base + unit;
      const decoys = [base, num, base + unit * 2].filter((x) => x !== rounded);
      const { options, correctIndex } = buildMC(rounded, decoys);
      return { q: `${num.toLocaleString()} is exactly halfway between two multiples of ${unit}. By the usual rounding rule, what does ${num.toLocaleString()} round to (to the nearest ${unit})?`, options, correctIndex,
        hint: "This is a rounding a halfway number question. There's an agreed rule for exact halfway numbers, rather than the two sides balancing out.",
        solution: {
          scenario: `${num.toLocaleString()} sits exactly halfway between two multiples of ${unit}. We need to know what it rounds to.`,
          idea: "When a number is EXACTLY halfway between two round numbers, neither is closer. To avoid confusion, there's an agreed rule: exact halfway numbers always round UP.",
          method: ["Check the number is exactly halfway between two round numbers.", "Apply the halfway rule: round up."],
          steps: [`${num.toLocaleString()} is halfway between ${base.toLocaleString()} and ${(base + unit).toLocaleString()}.`, `Exactly halfway always rounds UP, so the answer is ${rounded.toLocaleString()}.`],
          check: `${rounded.toLocaleString()} is exactly ${halfBand} more than ${num.toLocaleString()}, confirming it really was the halfway point.`,
        } };
    },
  },
  reverse_rounding_choose: {
    difficulties: [2, 3],
    build(d) {
      const unit = d <= 2 ? pick([10, 100]) : pick([100, 1000]);
      const centre = rand(2, 90) * unit;
      const halfBand = unit / 2;
      const low = centre - halfBand, high = centre + halfBand - 1;
      const inBand = rand(low, high);
      const outOptions = [low - rand(1, halfBand), high + rand(1, halfBand), centre + unit + rand(0, halfBand - 1), centre - unit - rand(0, halfBand - 1)];
      const { options, correctIndex } = buildMC(inBand, outOptions);
      return { q: `A number rounds to ${centre.toLocaleString()} when rounded to the nearest ${unit}. Which of these numbers could it be?`, options, correctIndex,
        hint: "This is a working backwards from a rounded number question. Any number within half a step of the target could have rounded to it.",
        solution: {
          scenario: `A number rounds to ${centre.toLocaleString()} (nearest ${unit}). We need to work out which of the given numbers it could be.`,
          idea: "A whole range of numbers can round to the same target — anything within half a step below up to (but not including) half a step above.",
          method: ["Work out half of the rounding step.", "Find the smallest and largest number that would still round to the target.", "Check which given number falls inside that range."],
          steps: [`Half of ${unit} is ${halfBand}.`, `Numbers from ${low.toLocaleString()} to ${high.toLocaleString()} round to ${centre.toLocaleString()}.`, `${inBand.toLocaleString()} is in that range.`],
          check: `${inBand.toLocaleString()} is closer to ${centre.toLocaleString()} than to any other multiple of ${unit}.`,
        } };
    },
  },
  reverse_rounding_bounds: {
    difficulties: [3, 4],
    build(d) {
      const unit = pick([10, 100]);
      const centre = rand(2, 90) * unit;
      const halfBand = unit / 2;
      const wantSmallest = pick([true, false]);
      const answer = wantSmallest ? centre - halfBand : centre + halfBand - 1;
      const decoys = [wantSmallest ? centre + halfBand - 1 : centre - halfBand, centre, answer + unit, answer - unit].filter((x) => x !== answer && x >= 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `A number rounds to ${centre.toLocaleString()} when rounded to the nearest ${unit}. What is the ${wantSmallest ? "smallest" : "largest"} whole number it could have been?`, options, correctIndex,
        hint: "This is a find the exact boundary question. Work out half a step, then find the very edge of the range that still rounds to the target.",
        solution: {
          scenario: `A number rounds to ${centre.toLocaleString()} (nearest ${unit}). We need the ${wantSmallest ? "smallest" : "largest"} possible original number.`,
          idea: "A number rounds to a target if it's within half a step of it. The smallest possible original is exactly half a step below the target (since exact halfway rounds up); the largest is one less than half a step above it.",
          method: ["Work out half of the rounding step.", `Find the ${wantSmallest ? "smallest" : "largest"} whole number still within that range.`],
          steps: [`Half of ${unit} is ${halfBand}.`, `The ${wantSmallest ? "smallest" : "largest"} number that still rounds to ${centre.toLocaleString()} is ${answer.toLocaleString()}.`],
          check: `${answer.toLocaleString()} rounds to ${centre.toLocaleString()}, and ${wantSmallest ? answer - 1 : answer + 1} would not.`,
        } };
    },
  },
  reverse_halfway_value: {
    difficulties: [4],
    build(d) {
      const unit = pick([10, 100, 1000]);
      const halfBand = unit / 2;
      const base = rand(2, 80) * unit;
      const roundedResult = base + unit;
      const original = roundedResult - halfBand;
      const decoys = [roundedResult, base, original + unit, original - unit].filter((x) => x !== original);
      const { options, correctIndex } = buildMC(original, decoys);
      return { q: `A number was exactly halfway between two multiples of ${unit}, and by the usual rounding rule it rounded UP to ${roundedResult.toLocaleString()} (to the nearest ${unit}). What was the original number?`, options, correctIndex,
        hint: "This is a work backwards from a halfway rounding question. Since exact halfway numbers always round UP, the original must be exactly half a step below the rounded result.",
        solution: {
          scenario: `A number rounded UP to ${roundedResult.toLocaleString()} (nearest ${unit}) because it was exactly halfway. We need the original number.`,
          idea: "Because exact halfway numbers always round up, the only number that rounds up to a given value BY BEING HALFWAY is the one sitting exactly half a step below it.",
          method: [`Find half of ${unit}.`, "Subtract that from the rounded result."],
          steps: [`Half of ${unit} is ${halfBand}.`, `${roundedResult.toLocaleString()} − ${halfBand} = ${original.toLocaleString()}.`],
          check: `${original.toLocaleString()} is exactly halfway between ${base.toLocaleString()} and ${roundedResult.toLocaleString()}, and halfway numbers round up, giving ${roundedResult.toLocaleString()}.`,
        } };
    },
  },
  estimate_sum_by_rounding: {
    difficulties: [2, 3],
    build(d) {
      const unit = d <= 2 ? 10 : 100;
      const a = rand(unit * 2, unit * 90) + rand(1, unit - 1);
      const b = rand(unit * 2, unit * 90) + rand(1, unit - 1);
      const roundedA = Math.round(a / unit) * unit;
      const roundedB = Math.round(b / unit) * unit;
      const estimate = roundedA + roundedB;
      const decoys = [a + b, roundedA + b, a + roundedB].filter((x) => x !== estimate);
      const { options, correctIndex } = buildMC(estimate, decoys);
      return { q: `Estimate ${a.toLocaleString()} + ${b.toLocaleString()} by rounding each number to the nearest ${unit} first, then adding.`, options, correctIndex,
        hint: "This is an estimate a sum question. Round each number to a friendlier one first, then add.",
        solution: {
          scenario: `We need to estimate ${a.toLocaleString()} + ${b.toLocaleString()} by rounding each number first.`,
          idea: "Adding two big, awkward numbers can be slow and error-prone. Round each to the nearest ten, hundred or whatever is asked, then add those simpler numbers instead.",
          method: ["Round the first number.", "Round the second number.", "Add the two rounded numbers together."],
          steps: [`${a.toLocaleString()} rounds to ${roundedA.toLocaleString()}.`, `${b.toLocaleString()} rounds to ${roundedB.toLocaleString()}.`, `${roundedA.toLocaleString()} + ${roundedB.toLocaleString()} = ${estimate.toLocaleString()}.`],
          check: `The estimate ${estimate.toLocaleString()} is close to the exact sum ${(a + b).toLocaleString()}.`,
        } };
    },
  },
  estimate_difference_by_rounding: {
    difficulties: [3, 4],
    build(d) {
      const unit = pick([10, 100]);
      const b = rand(unit * 2, unit * 40) + rand(1, unit - 1);
      const a = b + rand(unit, unit * 30) + rand(1, unit - 1);
      const roundedA = Math.round(a / unit) * unit;
      const roundedB = Math.round(b / unit) * unit;
      const estimate = roundedA - roundedB;
      const decoys = [a - b, roundedA - b, a - roundedB].filter((x) => x !== estimate);
      const { options, correctIndex } = buildMC(estimate, decoys);
      return { q: `Estimate ${a.toLocaleString()} − ${b.toLocaleString()} by rounding each number to the nearest ${unit} first, then subtracting.`, options, correctIndex,
        hint: "This is an estimate a difference question. Round each number to a friendlier value first, then subtract.",
        solution: {
          scenario: `We need to estimate ${a.toLocaleString()} − ${b.toLocaleString()} by rounding first.`,
          idea: "Subtracting two big, awkward numbers is easy to get wrong. Rounding each to the nearest ten or hundred first gives a quick, approximate answer.",
          method: ["Round the first number.", "Round the second number.", "Subtract the rounded numbers."],
          steps: [`${a.toLocaleString()} rounds to ${roundedA.toLocaleString()}.`, `${b.toLocaleString()} rounds to ${roundedB.toLocaleString()}.`, `${roundedA.toLocaleString()} − ${roundedB.toLocaleString()} = ${estimate.toLocaleString()}.`],
          check: `The estimate ${estimate.toLocaleString()} is close to the exact difference ${(a - b).toLocaleString()}.`,
        } };
    },
  },
  estimate_product_by_rounding: {
    difficulties: [3, 4],
    build(d) {
      const unit = d >= 4 ? pick([10, 100]) : 10;
      const a = rand(unit * 2, unit * 20) + rand(1, unit - 1);
      const b = d >= 4 ? rand(2, 12) : rand(2, 9);
      const roundedA = Math.round(a / unit) * unit;
      const estimate = roundedA * b;
      const decoys = [a * b, roundedA * (b + 1), roundedA * (b - 1)].filter((x) => x !== estimate && x > 0);
      const { options, correctIndex } = buildMC(estimate, decoys);
      return { q: `Estimate ${a.toLocaleString()} × ${b} by rounding ${a.toLocaleString()} to the nearest ${unit} first, then multiplying.`, options, correctIndex,
        hint: "This is an estimate a product question. Round the awkward number to a friendlier one first, then multiply.",
        solution: {
          scenario: `We need to estimate ${a.toLocaleString()} × ${b} by rounding ${a.toLocaleString()} first.`,
          idea: "Multiplying an awkward number is slow and easy to get wrong. Rounding it to the nearest ten or hundred first gives a much friendlier calculation, at the cost of the answer only being an estimate.",
          method: [`Round ${a.toLocaleString()} to the nearest ${unit}.`, "Multiply the rounded number by the other number."],
          steps: [`${a.toLocaleString()} rounds to ${roundedA.toLocaleString()}.`, `${roundedA.toLocaleString()} × ${b} = ${estimate.toLocaleString()}.`],
          check: `The estimate ${estimate.toLocaleString()} is close to the exact answer ${(a * b).toLocaleString()}.`,
        } };
    },
  },
  choose_rounding_direction_context: {
    difficulties: [3, 4],
    build(d) {
      const capacity = d >= 4 ? pick([15, 25, 40]) : pick([8, 10, 20]);
      const total = rand(capacity * 3 + 1, capacity * 12 - 1);
      const groups = Math.ceil(total / capacity);
      const [singular, plural] = pick([["coach", "coaches"], ["minibus", "minibuses"], ["ferry", "ferries"], ["taxi", "taxis"]]);
      const decoys = [Math.floor(total / capacity), groups + 1, groups - 1, Math.round(total / capacity)].filter((x) => x !== groups && x > 0);
      const { options, correctIndex } = buildMC(groups, decoys);
      return { q: `${total} people need to travel and each ${singular} holds ${capacity} people. How many ${plural} are needed so that EVERYONE has a seat?`, options, correctIndex,
        hint: "This is a rounding in context question. You can't round down here, or some people would be left with nowhere to sit — you always need to round UP to the next whole vehicle.",
        solution: {
          scenario: `${total} people need transporting, ${capacity} per ${singular}. We need the number of ${plural} so everyone has a seat.`,
          idea: "Normal rounding rules don't apply to problems like this. If even one person is left over after filling whole vehicles, you still need another whole vehicle — so you always round UP, no matter how small the leftover is.",
          method: [`Divide ${total} by ${capacity}.`, "Round the result UP to the next whole number, even if the leftover is small."],
          steps: [`${total} ÷ ${capacity} = ${(total / capacity).toFixed(2)}.`, `Rounding up (never down, or someone is left behind) gives ${groups} ${plural}.`],
          check: `${groups} ${plural} hold ${(groups * capacity).toLocaleString()} people, enough for all ${total}, while ${groups - 1} would only hold ${((groups - 1) * capacity).toLocaleString()}.`,
        } };
    },
  },
};
// Structure registry for compensationMentalMaths. Covers the four operations' distinct
// compensation rules (add/subtract move by adjusting oppositely; multiply/divide move by
// scaling), several different UNKNOWNS on the same underlying rule (the adjustment amount,
// the adjusted number, the final result, the original number worked back to), a
// cross-operation discrimination task, and error-spotting/reverse-reasoning at the top end.
const COMPENSATION_STRUCTURES = {
  addition_compensation: {
    difficulties: [1, 2],
    build(d) {
      let a, adjust, guard = 0;
      do { a = rand(21, 89); adjust = (10 - (a % 10)) % 10; guard++; } while ((adjust === 0 || adjust > 9) && guard < 50);
      if (adjust === 0) return null;
      const b = rand(Math.max(21, adjust + 15), 89);
      const sum = a + b;
      const aAdj = a + adjust, bAdj = b - adjust;
      const decoys = [sum + adjust, sum - adjust, aAdj + bAdj + 1, a + b + 2 * adjust].filter((x) => x !== sum);
      const { options, correctIndex } = buildMC(sum, decoys);
      return { q: `${a} + ${b} can be worked out as ${aAdj} + ${bAdj} (round ${a} up to ${aAdj}, and take the same ${adjust} off ${b} to balance it). What is ${a} + ${b}?`, options, correctIndex,
        hint: "Addition compensation rounds one addend to a more convenient number, then adjusts the other addend in the opposite direction by the same amount to keep the total the same.",
        solution: {
          scenario: `${a} + ${b} is worked out via compensation as ${aAdj} + ${bAdj}.`,
          idea: "Increasing one addend and decreasing the other by the same amount leaves the sum unchanged.",
          method: ["Increase one addend to a round number.", "Decrease the other by the same amount.", "Add the adjusted numbers."],
          steps: [`Increasing ${a} by ${adjust} and decreasing ${b} by ${adjust} doesn't change the sum.`, `${aAdj} + ${bAdj} = ${sum}.`],
          check: `${a} + ${b} = ${sum} directly, matching ${aAdj} + ${bAdj} = ${sum}.`,
        } };
    },
  },
  subtraction_compensation: {
    difficulties: [1, 2],
    build(d) {
      let b, adjust, guard = 0;
      do { b = rand(21, 89); adjust = (10 - (b % 10)) % 10; guard++; } while ((adjust === 0 || adjust > 9) && guard < 50);
      if (adjust === 0) return null;
      const a = b + rand(20, 100);
      const diff = a - b;
      const aAdj = a + adjust, bAdj = b + adjust;
      const decoys = [diff + adjust, diff - adjust, aAdj - bAdj + 1, a - b - adjust].filter((x) => x !== diff);
      const { options, correctIndex } = buildMC(diff, decoys);
      return { q: `${a} − ${b} can be worked out as ${aAdj} − ${bAdj} (add ${adjust} to both numbers so ${b} becomes the round number ${bAdj}). What is ${a} − ${b}?`, options, correctIndex,
        hint: "Subtraction compensation adds the same amount to BOTH numbers, shifting them the same distance up the number line so their gap (the difference) stays the same.",
        solution: {
          scenario: `${a} − ${b} is worked out via compensation as ${aAdj} − ${bAdj}.`,
          idea: "Adding the same amount to both numbers in a subtraction does not change their difference.",
          method: ["Add the same amount to both numbers to make the second one round.", "Subtract the adjusted numbers."],
          steps: [`Adding ${adjust} to both ${a} and ${b} doesn't change the difference.`, `${aAdj} − ${bAdj} = ${diff}.`],
          check: `${a} − ${b} = ${diff} directly, matching ${aAdj} − ${bAdj} = ${diff}.`,
        } };
    },
  },
  multiplication_compensation: {
    difficulties: [1, 2],
    build(d) {
      const a = rand(2, 20);
      const scale = pick([2, 5, 10]);
      const bDiv = rand(2, 10);
      const b = bDiv * scale;
      const aScaled = a * scale;
      const product = a * b;
      const decoys = [product * scale, product / scale, aScaled * bDiv + 1, a * bDiv].filter((x) => x !== product && x > 0);
      const { options, correctIndex } = buildMC(product, decoys);
      return { q: `${a} × ${b} can be worked out as ${aScaled} × ${bDiv} (multiply one number by ${scale}, divide the other by ${scale}). What is ${a} × ${b}?`, options, correctIndex,
        hint: "Multiplying one factor by a number and dividing the other by the same number leaves the product unchanged.",
        solution: {
          scenario: `${a} × ${b} is worked out via compensation as ${aScaled} × ${bDiv}.`,
          idea: "Multiplying one factor by k and dividing the other by k leaves the product unchanged.",
          method: [`Multiply one factor by ${scale}.`, `Divide the other by ${scale}.`, "Multiply the adjusted numbers."],
          steps: [`Multiplying ${a} by ${scale} and dividing ${b} by ${scale} doesn't change the product.`, `${aScaled} × ${bDiv} = ${product}.`],
          check: `${a} × ${b} = ${product} directly, matching ${aScaled} × ${bDiv} = ${product}.`,
        } };
    },
  },
  find_the_adjustment: {
    difficulties: [1],
    build(d) {
      let a, adjust, guard = 0;
      do { a = rand(21, 89); adjust = (10 - (a % 10)) % 10; guard++; } while ((adjust === 0 || adjust > 9) && guard < 50);
      if (adjust === 0) return null;
      const b = rand(Math.max(21, adjust + 15), 89);
      const aAdj = a + adjust;
      const decoys = [10 - adjust, adjust + 1, adjust - 1, a % 10].filter((x) => x !== adjust && x > 0 && x <= 9);
      const { options, correctIndex } = buildMC(adjust, decoys);
      return { q: `To help work out ${a} + ${b}, ${a} is rounded up to ${aAdj}. What must be taken off ${b} to keep the total the same?`, options, correctIndex,
        hint: "This is a find the balancing adjustment question. Whatever amount one number is rounded up by, the same amount must come off the other to keep the total unchanged.",
        solution: {
          scenario: `${a} is rounded up to ${aAdj} to help calculate ${a} + ${b}. We need the matching adjustment to ${b}.`,
          idea: "Increasing one addend and decreasing the other by the SAME amount leaves the total unchanged.",
          method: [`Work out how much ${a} was increased by.`, "That same amount must be taken off the other number."],
          steps: [`${a} was increased by ${aAdj} − ${a} = ${adjust}.`, `The same ${adjust} must be taken off ${b} to balance it.`],
          check: `${aAdj} + (${b} − ${adjust}) = ${aAdj + (b - adjust)}, which equals ${a} + ${b} = ${a + b}.`,
        } };
    },
  },
  apply_the_rule_directly: {
    difficulties: [1, 2],
    build(d) {
      const op = d <= 1 ? pick(["add", "subtract"]) : pick(["add", "subtract", "multiply"]);
      if (op === "add") {
        let a, adjust, guard = 0;
        do { a = rand(21, 89); adjust = (10 - (a % 10)) % 10; guard++; } while ((adjust === 0 || adjust > 9) && guard < 50);
        if (adjust === 0) return null;
        const b = rand(Math.max(21, adjust + 15), 89);
        const aAdj = a + adjust, bAdj = b - adjust;
        const decoys = [b + adjust, b, b - adjust * 2, b + adjust * 2].filter((x) => x !== bAdj && x > 0);
        const { options, correctIndex } = buildMC(bAdj, decoys);
        return { q: `To calculate ${a} + ${b}, ${a} is increased to ${aAdj}. What must ${b} become to keep the total the same?`, options, correctIndex,
          hint: "Increase one number, decrease the other by the same amount — the total stays the same.",
          solution: {
            scenario: `${a} is increased to ${aAdj}. We need what ${b} must become so ${a} + ${b} stays the same.`,
            idea: "Increasing one addend and decreasing the other by the same amount leaves the total unchanged.",
            method: [`Work out how much ${a} increased by.`, `Decrease ${b} by the same amount.`],
            steps: [`${a} increased by ${aAdj - a}.`, `${b} − ${aAdj - a} = ${bAdj}.`],
            check: `${aAdj} + ${bAdj} = ${aAdj + bAdj}, matching ${a} + ${b} = ${a + b}.`,
          } };
      }
      if (op === "subtract") {
        let b, adjust, guard = 0;
        do { b = rand(21, 89); adjust = (10 - (b % 10)) % 10; guard++; } while ((adjust === 0 || adjust > 9) && guard < 50);
        if (adjust === 0) return null;
        const a = b + rand(20, 100);
        const bAdj = b + adjust, aAdj = a + adjust;
        const decoys = [a - adjust, a, a + adjust * 2, a - adjust * 2].filter((x) => x !== aAdj && x > 0);
        const { options, correctIndex } = buildMC(aAdj, decoys);
        return { q: `To calculate ${a} − ${b}, ${b} is increased to ${bAdj}. What must ${a} become to keep the difference the same?`, options, correctIndex,
          hint: "Add the same amount to both numbers in a subtraction — the difference stays the same.",
          solution: {
            scenario: `${b} is increased to ${bAdj}. We need what ${a} must become so ${a} − ${b} stays the same.`,
            idea: "Adding the same amount to BOTH numbers in a subtraction leaves the difference unchanged.",
            method: [`Work out how much ${b} increased by.`, `Increase ${a} by the same amount.`],
            steps: [`${b} increased by ${bAdj - b}.`, `${a} + ${bAdj - b} = ${aAdj}.`],
            check: `${aAdj} − ${bAdj} = ${aAdj - bAdj}, matching ${a} − ${b} = ${a - b}.`,
          } };
      }
      const a = rand(2, 20);
      const scale = pick([2, 5, 10]);
      const bDiv = rand(2, 10);
      const b = bDiv * scale;
      const aScaled = a * scale;
      const decoys = [bDiv * scale, bDiv + scale, bDiv - 1, bDiv + 1].filter((x) => x !== bDiv && x > 0);
      const { options, correctIndex } = buildMC(bDiv, decoys);
      return { q: `To calculate ${a} × ${b}, ${a} is multiplied by ${scale} to get ${aScaled}. What must ${b} become to keep the product the same?`, options, correctIndex,
        hint: "Multiply one factor and divide the other by the same amount — the product stays the same.",
        solution: {
          scenario: `${a} is multiplied by ${scale} to get ${aScaled}. We need what ${b} must become so the product stays the same.`,
          idea: "Multiplying one factor by a number and dividing the other by the same number leaves the product unchanged.",
          method: [`Note that ${a} was multiplied by ${scale}.`, `Divide ${b} by the same ${scale}.`],
          steps: [`${b} ÷ ${scale} = ${bDiv}.`],
          check: `${aScaled} × ${bDiv} = ${aScaled * bDiv}, matching ${a} × ${b} = ${a * b}.`,
        } };
    },
  },
  division_compensation: {
    difficulties: [2, 3],
    build(d) {
      const scale = pick([2, 3, 4, 5]);
      const q = rand(3, 20);
      const divisor = rand(2, 15);
      const dividend = q * divisor;
      const dividendScaled = dividend * scale, divisorScaled = divisor * scale;
      const decoys = [q * scale, Math.round(q / scale), dividendScaled / divisor, q + scale].filter((x) => x !== q && x > 0);
      const { options, correctIndex } = buildMC(q, decoys);
      return { q: `${dividend} ÷ ${divisor} gives the same answer as ${dividendScaled} ÷ ${divisorScaled} (both numbers scaled by ${scale}). What is ${dividend} ÷ ${divisor}?`, options, correctIndex,
        hint: "Division compensation works by scaling: if you multiply both the dividend and the divisor by the same number, the quotient stays the same.",
        solution: {
          scenario: `${dividend} ÷ ${divisor} is worked out via compensation as ${dividendScaled} ÷ ${divisorScaled}.`,
          idea: "Multiplying both dividend and divisor by the same factor leaves the quotient unchanged.",
          method: ["Scale both the dividend and divisor by the same amount.", "Divide the scaled numbers instead."],
          steps: [`Scaling both ${dividend} and ${divisor} by ${scale} doesn't change the answer.`, `${dividend} ÷ ${divisor} = ${q}.`],
          check: `${dividendScaled} ÷ ${divisorScaled} = ${q}, matching ${dividend} ÷ ${divisor} = ${q}.`,
        } };
    },
  },
  recognize_valid_pair: {
    difficulties: [2, 3],
    build(d) {
      const a = rand(30, 70), b = rand(30, 70);
      const adjust = pick([1, 2, 3, 4, 5]);
      const correctStr = `${a + adjust} + ${b - adjust}`;
      const decoys = [`${a + adjust} + ${b + adjust}`, `${a - adjust} + ${b - adjust}`, `${a + adjust} + ${b}`, `${a} + ${b - adjust}`];
      const { options, correctIndex } = buildMCStr(correctStr, decoys);
      return { q: `Which of these gives the SAME answer as ${a} + ${b}, using compensation?`, options, correctIndex,
        hint: "A valid compensation pair for addition must have the same total: one number up, the other down, by exactly the same amount.",
        solution: {
          scenario: `We need the option that gives the same total as ${a} + ${b}.`,
          idea: "Valid compensation: add k to one addend and subtract k from the other. The total stays the same because the changes cancel.",
          method: ["Check each option: does one number go up and the other down by the SAME amount?"],
          steps: [`${correctStr} = ${a + b}, which matches ${a} + ${b} = ${a + b}.`],
          check: `The other options either change both numbers the same way, or only adjust one — both break the balance.`,
        } };
    },
  },
  decimal_compensation: {
    difficulties: [3, 4],
    build(d) {
      const aWhole = rand(2, 9);
      const bScaled = rand(11, 80);
      const a = aWhole / 10;
      const b = bScaled * 10;
      const helperProduct = aWhole * bScaled;
      const decoys = [helperProduct * 10, Math.round(helperProduct / 10), helperProduct + aWhole, helperProduct - bScaled].filter((x) => x !== helperProduct && x > 0);
      const { options, correctIndex } = buildMC(helperProduct, decoys);
      return { q: `${a} × ${b} can be worked out using ${aWhole} × ${bScaled} instead (${a} is ${aWhole}÷10, and ${b} is ${bScaled}×10 — the ÷10 and ×10 cancel out). What is ${a} × ${b}?`, options, correctIndex,
        hint: "Multiplying one factor by 10 and dividing the other by 10 leaves the product unchanged — even when one factor is a decimal.",
        solution: {
          scenario: `${a} × ${b} is worked out via compensation as ${aWhole} × ${bScaled}.`,
          idea: "If one factor is scaled by ×10 and the other by ÷10, the product is unchanged. Use whole-number factors to compute the answer.",
          method: ["Spot the ×10/÷10 relationship between the two versions.", "Compute using the whole-number pair instead."],
          steps: [`${aWhole} × ${bScaled} = ${helperProduct}.`, `Since ${a} = ${aWhole}÷10 and ${b} = ${bScaled}×10, the ÷10 and ×10 cancel exactly.`],
          check: `${a} × ${b} = ${helperProduct}, matching ${aWhole} × ${bScaled} = ${helperProduct}.`,
        } };
    },
  },
  cross_operation_rule_check: {
    difficulties: [3, 4],
    build(d) {
      const k = rand(2, 9);
      const scale = pick([2, 5]);
      const variants = [
        { op: "addition", text: `for addition, increase one number by ${k} and decrease the other by ${k}`, valid: true },
        { op: "addition", text: `for addition, increase BOTH numbers by ${k}`, valid: false },
        { op: "subtraction", text: `for subtraction, add ${k} to both numbers`, valid: true },
        { op: "subtraction", text: `for subtraction, add ${k} to one number only`, valid: false },
        { op: "multiplication", text: `for multiplication, multiply one factor by ${scale} and divide the other by ${scale}`, valid: true },
        { op: "multiplication", text: `for multiplication, multiply BOTH factors by ${scale}`, valid: false },
        { op: "division", text: `for division, multiply both the dividend and divisor by ${scale}`, valid: true },
        { op: "division", text: `for division, multiply only the dividend by ${scale}`, valid: false },
      ];
      const validOnes = variants.filter((v) => v.valid);
      const invalidOnes = variants.filter((v) => !v.valid);
      const correct = pick(validOnes);
      const wrongSameOp = invalidOnes.find((v) => v.op === correct.op);
      const otherWrongs = shuffle(invalidOnes.filter((v) => v.op !== correct.op)).slice(0, 3);
      const decoyTexts = [wrongSameOp.text, ...otherWrongs.map((v) => v.text)];
      const { options, correctIndex } = buildMCStr(correct.text, decoyTexts);
      return { q: "Which of these correctly keeps the answer the same?", options, correctIndex,
        hint: "Each operation has its OWN compensation rule — addition/subtraction move by adding or subtracting an adjustment; multiplication/division move by scaling. Mixing up which rule belongs to which operation is the classic mistake.",
        solution: {
          scenario: "We need to spot which compensation move genuinely keeps the answer the same.",
          idea: "Addition and subtraction compensate by adding or subtracting the SAME amount; multiplication and division compensate by scaling by the SAME factor. Using the wrong kind of adjustment for an operation changes the answer instead of preserving it.",
          method: ["Check each option against the compensation rule that actually applies to its operation.", "Rule out any that use the wrong kind of adjustment or only adjust one side when both need it."],
          steps: [`"${correct.text}" correctly matches the compensation rule for ${correct.op}.`],
          check: "Each of the other options either scales when it should add, adds when it should scale, or only adjusts one side when both need adjusting.",
        } };
    },
  },
  alternative_scaling_pair: {
    difficulties: [3, 4],
    build(d) {
      const a = rand(4, 20);
      const scale = pick([2, 3, 4]);
      const bMultiple = rand(2, 10) * scale;
      const product = a * bMultiple;
      const correctPair = [a * scale, bMultiple / scale];
      const rawDecoys = [
        [a * scale, bMultiple * scale],
        [Math.round(a / scale) || 1, bMultiple / scale],
        [a + scale, bMultiple - scale],
        [a * scale, bMultiple],
        [a, bMultiple + scale],
        [a - scale, bMultiple + scale],
      ];
      const decoys = rawDecoys.filter(([x, y]) => x > 0 && y > 0 && x * y !== product).map(([x, y]) => `${x} × ${y}`);
      if (decoys.length < 4) return null;
      const correctStr = `${correctPair[0]} × ${correctPair[1]}`;
      const { options, correctIndex } = buildMCStr(correctStr, shuffle(decoys).slice(0, 4));
      return { q: `${a} × ${bMultiple} = ${product.toLocaleString()}. Which of these pairs also gives ${product.toLocaleString()} when multiplied?`, options, correctIndex,
        hint: "Multiplying one factor by a number and dividing the other by the SAME number always gives the same product.",
        solution: {
          scenario: `${a} × ${bMultiple} = ${product.toLocaleString()}. We need another pair with the same product.`,
          idea: "If you multiply one factor by k and divide the other by k, the product stays the same. Checking each option against this rule finds the genuine match.",
          method: ["Try multiplying one factor by a number and dividing the other by the same number.", "Check which option actually matches this pattern."],
          steps: [`${a} × ${scale} = ${correctPair[0]}, and ${bMultiple} ÷ ${scale} = ${correctPair[1]}.`, `${correctStr} = ${product.toLocaleString()}, matching the original product.`],
          check: `${correctPair[0]} × ${correctPair[1]} = ${correctPair[0] * correctPair[1]}, which equals ${product.toLocaleString()}.`,
        } };
    },
  },
  reverse_compensation: {
    difficulties: [4],
    build(d) {
      let a, adjust, guard = 0;
      do { a = rand(21, 89); adjust = (10 - (a % 10)) % 10; guard++; } while ((adjust === 0 || adjust > 9) && guard < 50);
      if (adjust === 0) return null;
      const b = rand(Math.max(21, adjust + 15), 89);
      const aAdj = a + adjust, bAdj = b - adjust;
      const decoys = [b + adjust, bAdj + adjust * 2, aAdj, b - adjust].filter((x) => x !== b && x > 0);
      const { options, correctIndex } = buildMC(b, decoys);
      return { q: `Using compensation, a sum was worked out as ${aAdj} + ${bAdj} instead of the original addition. ${aAdj} is ${adjust} more than the original first number. What was the original SECOND number?`, options, correctIndex,
        hint: "This is a work backwards through compensation question. If the first number was increased by an amount, the second must have been decreased by exactly the same amount — reverse that to find it.",
        solution: {
          scenario: `${aAdj} + ${bAdj} was used instead of the original sum, with the first number increased by ${adjust}. We need the original second number.`,
          idea: "Since the first number was increased by a certain amount, the second must have been decreased by exactly the same amount to keep the total the same. Adding that adjustment back recovers the original second number.",
          method: ["Note the adjustment made to the first number.", "Add that same adjustment back to the second (adjusted) number to undo it."],
          steps: [`The first number was increased by ${adjust}.`, `${bAdj} + ${adjust} = ${b}.`],
          check: `${a} + ${b} = ${a + b}, and ${aAdj} + ${bAdj} = ${aAdj + bAdj}, which match.`,
        } };
    },
  },
  compensation_error_spotting: {
    difficulties: [4],
    build(d) {
      let a, adjust, guard = 0;
      do { a = rand(21, 89); adjust = (10 - (a % 10)) % 10; guard++; } while ((adjust === 0 || adjust > 9) && guard < 50);
      if (adjust === 0) return null;
      const b = rand(Math.max(21, adjust + 15), 89);
      const trueSum = a + b;
      const wrongClaim = (a + adjust) + (b + adjust);
      const errorAmount = wrongClaim - trueSum;
      const decoys = [-errorAmount, adjust, 0].filter((x) => x !== errorAmount);
      const { options, correctIndex } = buildMC(errorAmount, decoys);
      return { q: `To calculate ${a} + ${b}, someone rounds ${a} up to ${a + adjust} by adding ${adjust}, but then MISTAKENLY also adds ${adjust} to ${b} instead of subtracting it. By how much is their answer too big?`, options, correctIndex,
        hint: "This is a spot the compensation error question. Adding to BOTH numbers instead of balancing one up and one down changes the total — work out by how much.",
        solution: {
          scenario: `${a} was correctly increased by ${adjust}, but ${b} was wrongly increased instead of decreased by the same amount.`,
          idea: "Valid compensation adds to one number and subtracts the SAME amount from the other, so the changes cancel. Adding to both instead means the total grows by twice the adjustment.",
          method: ["Work out what the correct compensation would do to the total (nothing).", "Work out what actually happened when both were increased.", "Find the difference."],
          steps: [`Correct compensation would leave the total unchanged at ${trueSum.toLocaleString()}.`, `Adding ${adjust} to BOTH numbers instead makes the total ${errorAmount} too big.`],
          check: `(${a + adjust}) + (${b + adjust}) = ${wrongClaim.toLocaleString()}, which is ${errorAmount} more than the true total ${trueSum.toLocaleString()}.`,
        } };
    },
  },
};
// Structure registry for timesTablesFacts. Covers direct recall, the inverse-of-recall
// unknowns (missing factor, fact family, "not true" spotting), the relationships BETWEEN
// facts (commutative order, stepping along a table, one-side vs two-side scaling and its
// reverse, splitting into partial products), and reasoning tasks that use facts rather than
// just stating them (comparing two products, counting factor pairs).
const TIMES_TABLES_STRUCTURES = {
  direct_recall: {
    difficulties: [1],
    build(d) {
      const a = rand(2, 12), b = rand(2, 12);
      const product = a * b;
      const decoys = [a * (b + 1), a * (b - 1), (a + 1) * b, a + b].filter((x) => x !== product && x > 0);
      const { options, correctIndex } = buildMC(product, decoys);
      return { q: `What is ${a} × ${b}?`, options, correctIndex,
        hint: "This is a times tables question. Multiply the two numbers together.",
        solution: {
          scenario: `We need to work out ${a} × ${b}.`,
          idea: "Multiplying two numbers means adding one of them to itself the other number of times.",
          method: ["Multiply the two numbers together."],
          steps: [`${a} × ${b} = ${product}.`],
          check: `${product} ÷ ${a} = ${b}, so the multiplication and its matching division agree.`,
        } };
    },
  },
  missing_factor: {
    difficulties: [1, 2],
    build(d) {
      const b = rand(2, 12);
      const missing = rand(2, 12);
      const product = b * missing;
      const decoys = [missing + 1, missing - 1, product, Math.round(product / (b + 1))].filter((x) => x !== missing && x > 0);
      const { options, correctIndex } = buildMC(missing, decoys);
      return { q: `___ × ${b} = ${product}. What number goes in the blank?`, options, correctIndex,
        hint: "This is a missing factor question. Since multiplying and dividing undo each other, divide the given answer by the number you know.",
        solution: {
          scenario: `We know the blank × ${b} = ${product}, and need to find the missing number.`,
          idea: "If two numbers multiply to give an answer, and you know the answer and one number, division (multiplication's opposite) finds the missing one.",
          method: ["Divide the given answer by the number you know."],
          steps: [`${product} ÷ ${b} = ${missing}.`],
          check: `${missing} × ${b} = ${missing * b}, which matches ${product}.`,
        } };
    },
  },
  commutative_property: {
    difficulties: [1, 2],
    build(d) {
      const a = rand(2, 12), b = rand(2, 12);
      if (a === b) return null;
      const correctStr = `${b} × ${a}`;
      const wrongOptions = [`${a} × ${b + 1}`, `${a + 1} × ${b}`, `${a + b} × 1`, `${a} + ${b}`];
      const { options, correctIndex } = buildMCStr(correctStr, wrongOptions);
      return { q: `Which of these has the same answer as ${a} × ${b}?`, options, correctIndex,
        hint: "This is a same answer, different order question. Multiplying gives the same answer whichever order you use.",
        solution: {
          scenario: `We need which option has the same answer as ${a} × ${b}.`,
          idea: "Multiplication doesn't care about order — a groups of b gives the same total as b groups of a.",
          method: ["Look for the option with the same two numbers multiplied in the opposite order."],
          steps: [`${a} × ${b} has the same answer as ${b} × ${a}.`],
          check: `${a} × ${b} = ${a * b} and ${b} × ${a} = ${b * a}, matching.`,
        } };
    },
  },
  step_along_table: {
    difficulties: [1, 2],
    build(d) {
      const table = rand(2, 12);
      const n = rand(2, 10);
      const known = table * n;
      const wantNext = pick([true, false]);
      const targetN = wantNext ? n + 1 : n - 1;
      if (targetN < 1) return null;
      const answer = wantNext ? known + table : known - table;
      const decoys = [known, known + 1, known + n, answer + table].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `${table} × ${n} = ${known}. What is ${table} × ${targetN}?`, options, correctIndex,
        hint: "This is a step along the times table question. One step further along changes the total by exactly the table's number.",
        solution: {
          scenario: `We know ${table} × ${n} = ${known}, and need ${table} × ${targetN}.`,
          idea: "Each step in a times table adds (or removes) one more group, changing the total by the table's own number each time.",
          method: ["Notice how much the table number changes by each step.", `${wantNext ? "Add" : "Subtract"} that amount.`],
          steps: [`${table} × ${targetN} = ${known} ${wantNext ? "+" : "−"} ${table} = ${answer}.`],
          check: `Working out ${table} × ${targetN} directly also gives ${table * targetN}.`,
        } };
    },
  },
  scale_by_ten_hundred: {
    difficulties: [1, 2],
    build(d) {
      const a = rand(2, 9), b = rand(2, 9);
      const base = a * b;
      const scale = pick([10, 100]);
      const bigA = a * scale;
      const answer = base * scale;
      const decoys = [base, bigA * b / scale, answer / 10, answer * 10].filter((x) => x !== answer && Number.isFinite(x));
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `Given that ${a} × ${b} = ${base}, what is ${bigA} × ${b}?`, options, correctIndex,
        hint: "This is a scaling up a fact question. Whatever you multiply one number by, the answer gets multiplied by that same amount.",
        solution: {
          scenario: `We know ${a} × ${b} = ${base}, and need ${bigA} × ${b}.`,
          idea: "If one number in a multiplication gets a certain number of times bigger, the answer gets exactly that many times bigger too.",
          method: ["Notice how many times bigger the new number is.", "Multiply the original answer by that same amount."],
          steps: [`${bigA} is ${scale} times bigger than ${a}.`, `${base} × ${scale} = ${answer}.`],
          check: `${answer} ÷ ${scale} = ${base}, the original fact.`,
        } };
    },
  },
  distributive_partition: {
    difficulties: [2, 3],
    build(d) {
      const tens = rand(1, 8), ones = rand(1, 9);
      const multiplicand = tens * 10 + ones;
      const b = rand(2, 9);
      const part1 = tens * 10 * b, part2 = ones * b;
      const answer = part1 + part2;
      const decoys = [tens * b + ones * b, multiplicand + b, (tens + ones) * b, answer + b].filter((x) => x !== answer);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `Work out ${multiplicand} × ${b} by splitting ${multiplicand} into ${tens * 10} + ${ones}. What is ${tens * 10}×${b} + ${ones}×${b}?`, options, correctIndex,
        hint: "This is a split and multiply question. Multiply each part separately, then add the results.",
        solution: {
          scenario: `We work out ${multiplicand} × ${b} by splitting ${multiplicand} into ${tens * 10} + ${ones}.`,
          idea: "A number like 34 is really 30 + 4. Multiplying 30 by something and 4 by something, then adding, gives exactly the same result as multiplying 34 directly.",
          method: ["Split the bigger number into two friendlier parts.", "Multiply each part separately.", "Add the two results together."],
          steps: [`${tens * 10} × ${b} = ${part1}.`, `${ones} × ${b} = ${part2}.`, `${part1} + ${part2} = ${answer}.`],
          check: `Working out ${multiplicand} × ${b} directly also gives ${answer}.`,
        } };
    },
  },
  fact_family: {
    difficulties: [2, 3, 4],
    build(d) {
      const a = rand(2, 12), b = rand(2, 12);
      if (a === b) return null;
      const product = a * b;
      if (d < 4) {
        const correctFact = pick([`${product} ÷ ${a} = ${b}`, `${product} ÷ ${b} = ${a}`]);
        const wrongFacts = [`${product} ÷ ${a + 1} = ${b}`, `${product} ÷ ${a} = ${b + 1}`, `${a} ÷ ${b} = ${product}`, `${product + a} ÷ ${a} = ${b}`];
        const { options, correctIndex } = buildMCStr(correctFact, wrongFacts);
        return { q: `Given that ${a} × ${b} = ${product}, which of these division facts must also be true?`, options, correctIndex,
          hint: "This is a fact family question. One multiplication fact comes with two matching division facts for free.",
          solution: {
            scenario: `We know ${a} × ${b} = ${product}, and need a division fact that must also be true.`,
            idea: "Multiplication and division are opposites. A fact like a × b = product always comes with product ÷ a = b and product ÷ b = a.",
            method: ["Start from the multiplication fact.", "Swap it round into a division."],
            steps: [`From ${a} × ${b} = ${product}, dividing back gives ${product} ÷ ${a} = ${b} and ${product} ÷ ${b} = ${a}.`],
            check: `Multiplying either division fact back up returns ${product}.`,
          } };
      }
      const trueFacts = [`${product} ÷ ${a} = ${b}`, `${product} ÷ ${b} = ${a}`];
      const falseFact = pick([`${product} ÷ ${a + 1} = ${b}`, `${product} ÷ ${a} = ${b + 1}`, `${product + a} ÷ ${a} = ${b}`]);
      const otherTrue = [`${a} × ${b} = ${product}`, `${b} × ${a} = ${product}`];
      const options5 = shuffle([falseFact, ...trueFacts, ...otherTrue]);
      const correctIndex = options5.indexOf(falseFact);
      return { q: `Given that ${a} × ${b} = ${product}, which of these is NOT a true fact from the same family?`, options: options5, correctIndex,
        hint: "This is a spot the false fact question. Four of these belong to the same multiplication/division family — one doesn't.",
        solution: {
          scenario: `We know ${a} × ${b} = ${product}, and need the one fact that ISN'T part of the same family.`,
          idea: "A multiplication fact's family only includes the two matching multiplications (in either order) and the two matching divisions. Anything else, even something that looks similar, isn't really part of it.",
          method: ["Check each option against the true family: the two orderings of the multiplication, and the two matching divisions.", "The one that doesn't match either pattern is the false one."],
          steps: [`The true family is: ${a}×${b}=${product}, ${b}×${a}=${product}, ${product}÷${a}=${b}, ${product}÷${b}=${a}.`, `"${falseFact}" doesn't match any of these.`],
          check: `Checking "${falseFact}" against the real values of ${a}, ${b} and ${product} shows it's false.`,
        } };
    },
  },
  double_scale_both_sides: {
    difficulties: [3, 4],
    build(d) {
      const a = rand(2, 9), b = rand(2, 9);
      const base = a * b;
      const scale = d >= 4 ? 100 : 10;
      const bigA = a * scale, bigB = b * scale;
      const answer = base * scale * scale;
      const decoys = [base * scale, answer / scale, answer * scale, base].filter((x) => x !== answer);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `Given that ${a} × ${b} = ${base}, what is ${bigA} × ${bigB}?`, options, correctIndex,
        hint: "This is a scale both sides question. If BOTH numbers get bigger by the same factor, the answer scales by that factor TWICE.",
        solution: {
          scenario: `We know ${a} × ${b} = ${base}, and need ${bigA} × ${bigB}.`,
          idea: `When one number scales by ${scale}, the answer scales by ${scale} once. When BOTH scale by ${scale}, the answer scales by ${scale} twice — by ${scale}×${scale} = ${scale * scale} altogether.`,
          method: ["Notice both numbers scaled by the same factor.", "Multiply the original answer by that factor twice (the factor squared)."],
          steps: [`Both ${a} and ${b} have grown ${scale} times bigger.`, `${base} × ${scale} × ${scale} = ${answer}.`],
          check: `${bigA} × ${bigB} worked out directly also gives ${answer}.`,
        } };
    },
  },
  reverse_scale: {
    difficulties: [3, 4],
    build(d) {
      const a = rand(2, 9), b = rand(2, 9);
      const base = a * b;
      const scale = d >= 4 ? 100 : 10;
      const bigA = a * scale;
      const bigAnswer = base * scale;
      const decoys = [bigAnswer, base * scale * scale, Math.round(base / scale), base + scale].filter((x) => x !== base && x > 0);
      const { options, correctIndex } = buildMC(base, decoys);
      return { q: `Given that ${bigA} × ${b} = ${bigAnswer}, what is ${a} × ${b}?`, options, correctIndex,
        hint: "This is a scale down a fact question. Dividing the answer by the same factor the number was scaled up by gets back the original fact.",
        solution: {
          scenario: `We know ${bigA} × ${b} = ${bigAnswer}, and need the smaller fact ${a} × ${b}.`,
          idea: `${bigA} is ${scale} times bigger than ${a}, so the answer ${bigAnswer} must also be ${scale} times bigger than the smaller answer.`,
          method: [`Notice ${bigA} is ${scale} times bigger than ${a}.`, `Divide the given answer by ${scale}.`],
          steps: [`${bigAnswer} ÷ ${scale} = ${base}.`],
          check: `${a} × ${b} worked out directly also gives ${base}.`,
        } };
    },
  },
  product_comparison: {
    difficulties: [3, 4],
    build(d) {
      let a, b, c, e, guard = 0;
      do { a = rand(2, 12); b = rand(2, 12); c = rand(2, 12); e = rand(2, 12); guard++; } while (a * b === c * e && guard < 50);
      if (a * b === c * e) return null;
      const p1 = a * b, p2 = c * e;
      const bigger = p1 > p2 ? `${a} × ${b}` : `${c} × ${e}`;
      const otherStr = p1 > p2 ? `${c} × ${e}` : `${a} × ${b}`;
      const decoyPool = [otherStr, "they are equal", "it's impossible to tell without working both out", "the one with smaller numbers is always smaller"];
      const { options, correctIndex } = buildMCStr(bigger, decoyPool);
      return { q: `Which is bigger: ${a} × ${b} or ${c} × ${e}?`, options, correctIndex,
        hint: "This is a compare two products question. Work out each product, then compare the two results.",
        solution: {
          scenario: `We compare ${a} × ${b} and ${c} × ${e}.`,
          idea: "The safest way to compare two multiplication facts is to work out each one fully, then compare the two totals directly.",
          method: [`Work out ${a} × ${b}.`, `Work out ${c} × ${e}.`, "Compare the two results."],
          steps: [`${a} × ${b} = ${p1}.`, `${c} × ${e} = ${p2}.`, `${bigger} is bigger.`],
          check: `${p1} ${p1 > p2 ? ">" : "<"} ${p2}, confirming ${bigger} is bigger.`,
        } };
    },
  },
  factor_pairs_count: {
    difficulties: [3, 4],
    build(d) {
      const maxFactor = d >= 4 ? 12 : 10;
      let target, pairs, guard = 0;
      do {
        const x = rand(2, maxFactor), y = rand(2, maxFactor);
        target = x * y;
        const rawPairs = [];
        for (let i = 2; i <= maxFactor; i++) { if (target % i === 0 && target / i >= 2 && target / i <= maxFactor) rawPairs.push([i, target / i]); }
        const seen = new Set(); pairs = [];
        for (const [p, q] of rawPairs) { const key = [p, q].sort((m, n) => m - n).join(","); if (!seen.has(key)) { seen.add(key); pairs.push([p, q]); } }
        guard++;
      } while (pairs.length < 2 && guard < 100);
      if (pairs.length < 2) return null;
      const answer = pairs.length;
      const decoys = [answer + 1, answer - 1, answer + 2, pairs.length * 2].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `${target} can be made by multiplying two numbers from 2 to ${maxFactor} together. How many DIFFERENT pairs of numbers give ${target}?`, options, correctIndex,
        hint: "This is a find all the factor pairs question. Try every possible first number in the allowed range and check whether it divides evenly, keeping only pairs where BOTH numbers are in range.",
        solution: {
          scenario: `We need every pair of numbers from 2 to ${maxFactor} that multiplies to ${target}.`,
          idea: "Checking every possible first number in the allowed range (and seeing if the target divides evenly by it, with the other factor also in range) finds every pair without missing any.",
          method: ["Try each number in the allowed range as the first factor.", "Check whether it divides the target evenly.", "Keep the pair only if the other factor is also in range.", "Count each pair once, not twice for the two orders."],
          steps: [`The valid pairs are: ${pairs.map(([p, q]) => `${p}×${q}`).join(", ")}.`, `That's ${answer} different pairs.`],
          check: `Each listed pair really does multiply to ${target}: ${pairs.map(([p, q]) => `${p}×${q}=${p * q}`).join(", ")}.`,
        } };
    },
  },
};
function fmpFactorsOf(n) { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; }
function fmpIsPrime(n) { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
// Structure registry for factorsMultiplesPrimes. Covers identifying (factor/multiple/prime/
// square), counting (how many factors, how many prime factors), the two "combine two
// numbers' factor lists" facts (HCF/LCM) at increasing generality (single answer -> nth
// common multiple -> word-problem application), and prime decomposition as the genuine
// stretch content at d4.
const FACTORS_MULTIPLES_STRUCTURES = {
  spot_non_factor: {
    difficulties: [1, 2],
    build(d) {
      const num = d <= 1 ? pick([12, 16, 18, 20, 24, 28, 30]) : pick([32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 64, 66, 70, 72]);
      const facs = fmpFactorsOf(num);
      const nonFacs = [];
      for (let i = 2; i <= num - 1 && nonFacs.length < 4; i++) if (!facs.includes(i)) nonFacs.push(i);
      if (nonFacs.length < 3) return null;
      const answer = pick(nonFacs);
      const wrongOpts = shuffle(facs.filter((f) => f > 1 && f < num)).slice(0, 4);
      if (wrongOpts.length < 4) return null;
      const { options, correctIndex } = buildMC(answer, wrongOpts);
      return { q: `Which of these is NOT a factor of ${num}?`, options, correctIndex,
        hint: "This is a spot the non-factor question. Check whether each option divides exactly into the target number.",
        solution: {
          scenario: `We need to find which of the given numbers is NOT a factor of ${num}.`,
          idea: "A factor of a number divides into it with no remainder. If dividing leaves any remainder, that number is not a factor.",
          method: ["List the factors of the target number.", "Find the option that is not in that list."],
          steps: [`The factors of ${num} are: ${facs.join(", ")}.`, `${answer} does not divide exactly into ${num}, so it is not a factor.`],
          check: `${num} ÷ ${answer} = ${(num / answer).toFixed(2)}, which is not a whole number.`,
        } };
    },
  },
  spot_prime: {
    difficulties: [1, 2],
    build(d) {
      const range = d <= 1 ? 50 : 97;
      const candidates = [];
      while (candidates.length < 5) { const n = rand(2, range); if (!candidates.includes(n)) candidates.push(n); }
      const primesAmong = candidates.filter(fmpIsPrime);
      if (primesAmong.length !== 1) return null;
      const answer = primesAmong[0];
      const { options, correctIndex } = buildMC(answer, candidates.filter((c) => c !== answer));
      return { q: "Which of these numbers is prime?", options, correctIndex,
        hint: "This is a spot the prime number question. A prime number can only be divided exactly by 1 and itself.",
        solution: {
          scenario: "We need to find which of the given numbers is prime.",
          idea: "A prime number has exactly two factors: 1 and itself. Checking each number for any OTHER factor finds the prime.",
          method: ["For each number, check if anything other than 1 and itself divides into it exactly.", "The number with no other factors is prime."],
          steps: [`${answer} is only divisible by 1 and ${answer}, so it is prime.`],
          check: `Trying to divide ${answer} by any number from 2 up to ${answer - 1} never comes out exact.`,
        } };
    },
  },
  spot_multiple: {
    difficulties: [1, 2],
    build(d) {
      const divisor = d <= 1 ? pick([5, 10]) : pick([10, 25, 50, 100]);
      const multiple = divisor * rand(3, 30);
      const nonMultiples = [];
      while (nonMultiples.length < 4) { const cand = multiple + rand(1, divisor - 1); if (cand % divisor !== 0 && !nonMultiples.includes(cand)) nonMultiples.push(cand); }
      const { options, correctIndex } = buildMC(multiple, nonMultiples);
      return { q: `Which of these numbers is a multiple of ${divisor}?`, options, correctIndex,
        hint: "This is a spot the multiple question. Check if each number divides exactly by the given number.",
        solution: {
          scenario: `We need to find which of the given numbers is a multiple of ${divisor}.`,
          idea: "A number IS a multiple of another exactly when dividing it by that other number gives a whole number with no remainder.",
          method: ["Divide each option by the given number.", "The one that divides exactly is the multiple."],
          steps: [`${multiple} ÷ ${divisor} = ${multiple / divisor}, so ${multiple} is a multiple of ${divisor}.`],
          check: `${divisor} × ${multiple / divisor} = ${multiple}.`,
        } };
    },
  },
  spot_square_number: {
    difficulties: [1, 2],
    build(d) {
      const squares = d <= 1 ? [1, 4, 9, 16, 25, 36, 49] : [36, 49, 64, 81, 100, 121, 144];
      const answer = pick(squares);
      const nonSquares = [];
      const allSquares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
      while (nonSquares.length < 4) { const cand = rand(2, 150); if (!allSquares.includes(cand) && cand !== answer && !nonSquares.includes(cand)) nonSquares.push(cand); }
      const { options, correctIndex } = buildMC(answer, nonSquares);
      return { q: "Which of these numbers is a square number?", options, correctIndex,
        hint: "This is a spot the square number question. A square number comes from multiplying a whole number by itself.",
        solution: {
          scenario: "We need to find which of the given numbers is a square number.",
          idea: "Square numbers come from multiplying a whole number by itself: 1×1=1, 2×2=4, 3×3=9, and so on.",
          method: ["Try to find a whole number that, multiplied by itself, gives the target number."],
          steps: [`${answer} = ${Math.sqrt(answer)} × ${Math.sqrt(answer)}.`],
          check: `${Math.sqrt(answer)} × ${Math.sqrt(answer)} = ${answer}.`,
        } };
    },
  },
  count_factors: {
    difficulties: [1, 2],
    build(d) {
      const num = d <= 1 ? pick([6, 8, 9, 10, 12, 14, 15, 16, 18, 20]) : pick([21, 24, 28, 30, 32, 36, 40, 42, 45, 48]);
      const facs = fmpFactorsOf(num);
      const answer = facs.length;
      const decoys = [answer + 1, answer - 1, answer + 2, num].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `How many factors does ${num} have?`, options, correctIndex,
        hint: "This is a count the factors question. List every whole number that divides exactly into the target, then count them.",
        solution: {
          scenario: `We need to count how many factors ${num} has.`,
          idea: "A factor divides exactly into a number, with nothing left over. Checking every whole number from 1 up to the target finds them all.",
          method: ["Test every whole number from 1 up to the target.", "Keep the ones that divide exactly.", "Count how many there are."],
          steps: [`The factors of ${num} are: ${facs.join(", ")}.`, `That's ${answer} factors.`],
          check: `Each of ${facs.join(", ")} divides exactly into ${num}, and there are ${answer} of them.`,
        } };
    },
  },
  highest_common_factor: {
    difficulties: [2, 3],
    build(d) {
      const a = d >= 3 ? rand(20, 90) : rand(10, 60);
      const b = d >= 3 ? rand(20, 90) : rand(10, 60);
      if (a === b) return null;
      const fa = fmpFactorsOf(a), fb = fmpFactorsOf(b);
      const common = fa.filter((x) => fb.includes(x));
      const hcf = Math.max(...common);
      if (hcf === 1) return null;
      const hcfPool = [Math.min(a, b), Math.max(a, b), hcf * 2, hcf + 1, hcf > 2 ? hcf - 1 : hcf + 3, common.length > 1 ? common[common.length - 2] : hcf * (b > a ? 2 : 3)];
      const decoys = [...new Set(hcfPool.filter((x) => x !== hcf && x >= 1))].slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMC(hcf, decoys);
      return { q: `What is the highest common factor of ${a} and ${b}?`, options, correctIndex,
        hint: "This is a highest common factor question. List the factors of each number and find the biggest one that appears in both lists.",
        solution: {
          scenario: `We need to find the highest common factor of ${a} and ${b}.`,
          idea: "The highest common factor is simply the biggest number that appears in BOTH numbers' factor lists.",
          method: ["List the factors of the first number.", "List the factors of the second number.", "Find the biggest number that appears in both lists."],
          steps: [`Factors of ${a}: ${fa.join(", ")}.`, `Factors of ${b}: ${fb.join(", ")}.`, `Common factors: ${common.join(", ")}. The highest is ${hcf}.`],
          check: `${a} ÷ ${hcf} = ${a / hcf} and ${b} ÷ ${hcf} = ${b / hcf}, both whole numbers.`,
        } };
    },
  },
  lowest_common_multiple: {
    difficulties: [2, 3],
    build(d) {
      const a = rand(2, 12), b = rand(2, 12);
      if (a === b) return null;
      const lcm = (a * b) / gcd(a, b);
      if (lcm > 144) return null;
      const lcmPool = [a * b, Math.max(a, b), lcm + Math.min(a, b), Math.max(1, lcm - Math.min(a, b)), lcm * 2, Math.min(a, b)];
      const decoys = [...new Set(lcmPool.filter((x) => x !== lcm && x >= 1))].slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMC(lcm, decoys);
      return { q: `What is the lowest common multiple of ${a} and ${b}?`, options, correctIndex,
        hint: "This is a lowest common multiple question. Find the smallest number that appears in both numbers' times tables.",
        solution: {
          scenario: `We need to find the lowest common multiple of ${a} and ${b}.`,
          idea: "The lowest common multiple is the smallest number that appears in BOTH times tables.",
          method: ["List some multiples of the first number.", "List some multiples of the second number.", "Find the smallest number that appears in both lists."],
          steps: [`Multiples of ${a}: ${a}, ${2 * a}, ${3 * a}, ${4 * a}...`, `Multiples of ${b}: ${b}, ${2 * b}, ${3 * b}, ${4 * b}...`, `The smallest number in both lists is ${lcm}.`],
          check: `${lcm} ÷ ${a} = ${lcm / a} and ${lcm} ÷ ${b} = ${lcm / b}, both whole numbers.`,
        } };
    },
  },
  product_of_three_factors: {
    difficulties: [3, 4],
    build(d) {
      const num = d >= 4 ? pick([120, 144, 150, 168, 180, 200, 210, 216, 240]) : pick([24, 36, 48, 60, 72, 90, 100, 120]);
      const facs = fmpFactorsOf(num).filter((f) => f > 1);
      let triple = null;
      outer: for (const a of facs) for (const b of facs) {
        if (a * b >= num) continue;
        if (num % (a * b) === 0) { const c = num / (a * b); if (c > 1 && facs.includes(c)) { triple = [a, b, c]; break outer; } }
      }
      if (!triple) return null;
      const correctStr = `${triple[0]} × ${triple[1]} × ${triple[2]}`;
      const wrong1 = `${triple[0]} × ${triple[1] + 1} × ${triple[2]}`;
      const wrong2 = `${triple[0] + 1} × ${triple[1]} × ${triple[2]}`;
      const wrong3 = `${triple[0]} × ${triple[1]} × ${triple[2] + 1}`;
      const wrong4 = `${triple[0] + 1} × ${triple[1] + 1} × ${triple[2]}`;
      const { options, correctIndex } = buildMCStr(correctStr, [wrong1, wrong2, wrong3, wrong4]);
      return { q: `Which of these is a correct way to write ${num} as a product of three factors, each greater than 1?`, options, correctIndex,
        hint: "This is a split into three factors question. Multiply the three given numbers together and check the result matches the target.",
        solution: {
          scenario: `We need to write ${num} as three factors, each bigger than 1, multiplied together.`,
          idea: "A number can often be split into three factors, as long as all three multiply back up to the original.",
          method: ["Multiply the three given numbers together.", "Check the result matches the target number."],
          steps: [`${triple[0]} × ${triple[1]} × ${triple[2]} = ${num}.`],
          check: `Multiplying any of the wrong options together instead does not give exactly ${num}.`,
        } };
    },
  },
  nth_common_multiple: {
    difficulties: [3, 4],
    build(d) {
      const a = rand(2, 10), b = rand(2, 10);
      if (a === b) return null;
      const lcm = (a * b) / gcd(a, b);
      if (lcm > 60) return null;
      const n = d >= 4 ? rand(3, 4) : 2;
      const answer = lcm * n;
      const decoys = [lcm * (n + 1), lcm * (n - 1), lcm, a * b * n].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      const ordinal = n === 2 ? "second" : n === 3 ? "third" : "fourth";
      return { q: `What is the ${ordinal} common multiple of ${a} and ${b}?`, options, correctIndex,
        hint: "This is a beyond-the-lowest common multiple question. Every common multiple after the lowest one is just a multiple of it.",
        solution: {
          scenario: `We need the ${ordinal} common multiple of ${a} and ${b}.`,
          idea: "Every common multiple of two numbers is a multiple of their LOWEST common multiple.",
          method: ["Find the lowest common multiple first.", `Multiply it by ${n} to get the ${ordinal} one.`],
          steps: [`The lowest common multiple of ${a} and ${b} is ${lcm}.`, `${lcm} × ${n} = ${answer}.`],
          check: `${answer} ÷ ${a} = ${answer / a} and ${answer} ÷ ${b} = ${answer / b}, both whole numbers.`,
        } };
    },
  },
  lcm_word_problem: {
    difficulties: [3, 4],
    build(d) {
      const a = d >= 4 ? rand(6, 15) : rand(3, 10);
      const b = d >= 4 ? rand(6, 15) : rand(3, 10);
      if (a === b) return null;
      const lcm = (a * b) / gcd(a, b);
      if (lcm > 200) return null;
      const scenario = pick([["bus", "buses", "minutes"], ["bell", "bells", "minutes"], ["light", "lights", "seconds"]]);
      const decoys = [a * b, a + b, Math.max(a, b), lcm * 2].filter((x) => x !== lcm && x > 0);
      const { options, correctIndex } = buildMC(lcm, decoys);
      return { q: `Two ${scenario[1]} go off together now. One goes off every ${a} ${scenario[2]}, and the other every ${b} ${scenario[2]}. In how many ${scenario[2]} will they next go off together?`, options, correctIndex,
        hint: "This is a when do they coincide again question. They coincide whenever the elapsed time is a multiple of BOTH gaps — the soonest is the lowest common multiple.",
        solution: {
          scenario: `Two ${scenario[1]} go off together now, one every ${a} ${scenario[2]} and the other every ${b} ${scenario[2]}.`,
          idea: "Both events happen together again only at a time that's a multiple of BOTH gaps. The soonest is the lowest common multiple of the two gaps.",
          method: [`Find the lowest common multiple of ${a} and ${b}.`],
          steps: [`The lowest common multiple of ${a} and ${b} is ${lcm}.`, `So they next go off together after ${lcm} ${scenario[2]}.`],
          check: `${lcm} ÷ ${a} = ${lcm / a} and ${lcm} ÷ ${b} = ${lcm / b}, both whole numbers.`,
        } };
    },
  },
  hcf_word_problem: {
    difficulties: [3, 4],
    build(d) {
      const a = d >= 4 ? rand(30, 90) : rand(12, 40);
      const b = d >= 4 ? rand(30, 90) : rand(12, 40);
      if (a === b) return null;
      const fa = fmpFactorsOf(a), fb = fmpFactorsOf(b);
      const common = fa.filter((x) => fb.includes(x));
      const hcf = Math.max(...common);
      if (hcf === 1) return null;
      const item = pick(["sweets", "stickers", "marbles", "pencils"]);
      const decoys = [Math.min(a, b), hcf * 2, hcf + 1, hcf > 2 ? hcf - 1 : hcf + 3].filter((x) => x !== hcf && x > 0);
      const { options, correctIndex } = buildMC(hcf, decoys);
      return { q: `A shop has ${a} ${item} and wants to pack them into bags, and ${b} of a different colour ${item} into the SAME size of bag, with none left over either time. What is the largest possible bag size?`, options, correctIndex,
        hint: "This is a largest equal groups question. The bag size must divide exactly into BOTH totals, so the biggest possible size is their highest common factor.",
        solution: {
          scenario: `${a} and ${b} ${item} both need packing into same-size bags with none left over.`,
          idea: "For a bag size to leave nothing over, it must divide exactly into BOTH totals. The biggest such size is the highest common factor.",
          method: ["Find the highest common factor of the two totals."],
          steps: [`The highest common factor of ${a} and ${b} is ${hcf}.`],
          check: `${a} ÷ ${hcf} = ${a / hcf} and ${b} ÷ ${hcf} = ${b / hcf}, both whole numbers.`,
        } };
    },
  },
  prime_factor_decomposition: {
    difficulties: [4],
    build(d) {
      function primeFactorize(n) {
        const factors = [];
        let x = n;
        for (let p = 2; p * p <= x; p++) { while (x % p === 0) { factors.push(p); x /= p; } }
        if (x > 1) factors.push(x);
        return factors;
      }
      const num = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 44, 45, 48, 50, 54, 56, 60, 63, 72, 75, 80]);
      const factors = primeFactorize(num);
      const answer = factors.length;
      const decoys = [answer + 1, answer - 1, answer + 2, new Set(factors).size].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `Writing ${num} as a product of prime numbers (like 12 = 2 × 2 × 3), how many prime factors does it have, counting any that repeat?`, options, correctIndex,
        hint: "This is a prime factorisation question. Keep dividing by the smallest prime number that fits until only 1 is left, counting every division.",
        solution: {
          scenario: `We need to break ${num} down into prime factors and count them, including repeats.`,
          idea: "Every whole number bigger than 1 can be broken down into a unique set of prime numbers multiplied together.",
          method: ["Divide by the smallest prime number that fits.", "Keep going with what's left until only 1 remains.", "Count every division."],
          steps: [`${num} = ${factors.join(" × ")}.`, `That's ${answer} prime factors, counting repeats.`],
          check: `Multiplying ${factors.join(" × ")} together gives ${factors.reduce((a, b) => a * b, 1)}, which equals ${num}.`,
        } };
    },
  },
};
// Structure registry for formalMultiplication. Covers the WRITTEN METHOD specifically (as
// distinct from timesTablesFacts' recall/scaling and compensationMentalMaths' shortcuts):
// single-digit column multiplication and its mechanics (carrying, individual partial
// products, spotting which partial products belong), missing-digit puzzles that scale into
// genuine long multiplication (2-digit × 2-digit) by d4, estimating/comparing products, and
// diagnosing a dropped-carry error as the top-end "understand the method, not just do it"
// reasoning task.
const FORMAL_MULTIPLICATION_STRUCTURES = {
  short_multiplication_1digit: {
    difficulties: [1, 2],
    build(d) {
      const digits = d <= 1 ? 3 : 4;
      const multiplicand = rand(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
      const multiplier = rand(2, 9);
      const product = multiplicand * multiplier;
      const decoys = [product + multiplier, product - multiplier, multiplicand + multiplier, product + 10].filter((x) => x !== product && x > 0);
      const { options, correctIndex } = buildMC(product, decoys);
      return { q: `Work out ${multiplicand} × ${multiplier}.`, options, correctIndex,
        hint: "Short multiplication multiplies a multi-digit number by a single digit. Work through each digit from right to left, carrying any tens into the next column.",
        solution: {
          scenario: `We need ${multiplicand} × ${multiplier}.`,
          idea: "Short multiplication multiplies each digit of the larger number by the single-digit multiplier, right to left, carrying as needed.",
          method: ["Multiply each digit from right to left.", "Carry any tens into the next column."],
          steps: [`${multiplicand} × ${multiplier} = ${product}.`],
          check: `${product} ÷ ${multiplier} = ${multiplicand}.`,
        } };
    },
  },
  identify_carried_digit: {
    difficulties: [1, 2],
    build(d) {
      const tensDigit = rand(1, 9), onesDigit = rand(1, 9);
      const multiplicand = tensDigit * 10 + onesDigit;
      const multiplier = rand(2, 9);
      const onesProduct = onesDigit * multiplier;
      const carry = Math.floor(onesProduct / 10);
      if (carry === 0) return null;
      const decoys = [onesProduct, onesDigit, multiplier, carry + 1].filter((x) => x !== carry && x >= 0);
      const { options, correctIndex } = buildMC(carry, decoys);
      return { q: `When working out ${multiplicand} × ${multiplier} using the column method, you first multiply ${onesDigit} × ${multiplier} = ${onesProduct}. What digit gets carried into the tens column?`, options, correctIndex,
        hint: "When a partial product exceeds 9, the tens digit must be carried to the next column.",
        solution: {
          scenario: `${onesDigit} × ${multiplier} = ${onesProduct}, and we need the digit carried into the tens column.`,
          idea: "The carried digit is the tens portion of the partial product — found by dividing by 10 and keeping the whole number part.",
          method: ["Divide the partial product by 10.", "Keep only the whole number part."],
          steps: [`${onesProduct} ÷ 10 = ${onesProduct / 10}, so ${carry} is carried and ${onesProduct % 10} is written down.`],
          check: `${carry} × 10 + ${onesProduct % 10} = ${onesProduct}.`,
        } };
    },
  },
  missing_digit_in_product: {
    difficulties: [1, 2, 3, 4],
    build(d) {
      const multiplicand = d <= 1 ? rand(12, 89) : d === 2 ? rand(100, 899) : d === 3 ? rand(1000, 8999) : rand(100, 999);
      const multiplier = d >= 4 ? rand(11, 29) : rand(2, 9);
      const product = multiplicand * multiplier;
      const productStr = String(product);
      const hideIdx = rand(0, productStr.length - 1);
      const hiddenDigit = Number(productStr[hideIdx]);
      const displayed = productStr.split("").map((dg, i) => (i === hideIdx ? "?" : dg)).join("");
      const decoys = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== hiddenDigit)).slice(0, 4);
      const { options, correctIndex } = buildMC(hiddenDigit, decoys);
      return { q: `${multiplicand} × ${multiplier} = ${displayed}. What digit does the ? represent?`, options, correctIndex,
        hint: "This is a missing digit puzzle. Work out the full product, then read off the missing digit.",
        solution: {
          scenario: `${multiplicand} × ${multiplier} = ${displayed}, and we need the hidden digit.`,
          idea: "Working out the full product directly reveals every digit, including the hidden one.",
          method: ["Calculate the full product.", "Read the digit at the hidden position."],
          steps: [`${multiplicand} × ${multiplier} = ${product}.`, `The missing digit is ${hiddenDigit}.`],
          check: `Putting ${hiddenDigit} back into the ? gives ${product}.`,
        } };
    },
  },
  partial_product_subcalc: {
    difficulties: [1],
    build(d) {
      const h = rand(1, 9), t = rand(0, 9), o = rand(0, 9);
      const multiplicand = h * 100 + t * 10 + o;
      const multiplier = rand(2, 9);
      const part = pick(["hundreds", "tens", "ones"]);
      const partValue = part === "hundreds" ? h * 100 : part === "tens" ? t * 10 : o;
      const answer = partValue * multiplier;
      const decoys = [answer + multiplier, answer - multiplier, partValue, answer * 10].filter((x) => x !== answer && x >= 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `Using the column method to work out ${multiplicand} × ${multiplier}, what is ${partValue} × ${multiplier}?`, options, correctIndex,
        hint: "This is a single step of the column method. Just multiply the named part by the multiplier.",
        solution: {
          scenario: `We need just one partial product from ${multiplicand} × ${multiplier}: the ${part} part.`,
          idea: "The column method breaks a multiplication into smaller partial products, one for each place value, before adding them all together.",
          method: [`Take the ${part} part of ${multiplicand}, which is ${partValue}.`, `Multiply it by ${multiplier}.`],
          steps: [`${partValue} × ${multiplier} = ${answer}.`],
          check: `${answer} ÷ ${multiplier} = ${partValue}, matching the part we started with.`,
        } };
    },
  },
  spot_correct_partial_products: {
    difficulties: [1, 2],
    build(d) {
      const h = rand(1, 9), t = rand(1, 9), o = rand(1, 9);
      const multiplicand = h * 100 + t * 10 + o;
      const multiplier = rand(2, 9);
      const trueParts = [`${h * 100} × ${multiplier}`, `${t * 10} × ${multiplier}`, `${o} × ${multiplier}`];
      const wrongPart = pick([`${multiplicand} × ${multiplier * 10}`, `${h * 10} × ${multiplier}`, `${t} × ${multiplier}`, `${o * 10} × ${multiplier}`]);
      const extraDecoy = `${multiplier === 9 ? 8 : multiplier + 1} × ${multiplicand}`;
      const finalOptions = [...new Set(shuffle([wrongPart, extraDecoy, ...trueParts]))];
      if (finalOptions.length < 5) return null;
      const correctIndex = finalOptions.indexOf(wrongPart);
      return { q: `To work out ${multiplicand} × ${multiplier} using the column method, which of these is NOT one of the partial products you would calculate?`, options: finalOptions, correctIndex,
        hint: "This is a spot the wrong partial product question. The column method multiplies EACH place-value part of the multiplicand by the multiplier — nothing else.",
        solution: {
          scenario: `We need the partial product that does NOT belong when working out ${multiplicand} × ${multiplier} by the column method.`,
          idea: "The column method splits the multiplicand into its place-value parts and multiplies each one separately by the multiplier.",
          method: ["List the true place-value parts of the multiplicand.", "Multiply each by the multiplier to get the real partial products.", "Spot the option that doesn't match any of them."],
          steps: [`The real partial products are: ${trueParts.join(", ")}.`, `"${wrongPart}" doesn't match any of these.`],
          check: `"${wrongPart}" uses the wrong place value or the wrong multiplier, so it isn't genuine here.`,
        } };
    },
  },
  distributive_partition_2digit: {
    difficulties: [2, 3],
    build(d) {
      const tens = rand(1, 8), ones = rand(1, 9);
      const multiplicand = tens * 10 + ones;
      const multiplier = d >= 3 ? rand(11, 49) : rand(11, 29);
      const multTens = Math.floor(multiplier / 10) * 10, multOnes = multiplier % 10;
      const part1 = multiplicand * multTens, part2 = multiplicand * multOnes;
      const answer = part1 + part2;
      const decoys = [multiplicand * multiplier + 10, answer - 10, multiplicand + multiplier, answer + multiplicand].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `Work out ${multiplicand} × ${multiplier} by splitting ${multiplier} into ${multTens} + ${multOnes}. What is ${multiplicand}×${multTens} + ${multiplicand}×${multOnes}?`, options, correctIndex,
        hint: "The grid method splits a 2-digit multiplier into its tens and ones parts, multiplies each part separately, then adds the results.",
        solution: {
          scenario: `We work out ${multiplicand} × ${multiplier} by splitting ${multiplier} into ${multTens} + ${multOnes}.`,
          idea: "The distributive law allows splitting the multiplier: a × (tens + ones) = a×tens + a×ones.",
          method: [`Multiply ${multiplicand} by ${multTens}.`, `Multiply ${multiplicand} by ${multOnes}.`, "Add the two results."],
          steps: [`${multiplicand} × ${multTens} = ${part1}.`, `${multiplicand} × ${multOnes} = ${part2}.`, `${part1} + ${part2} = ${answer}.`],
          check: `${multiplicand} × ${multiplier} worked out directly also gives ${answer}.`,
        } };
    },
  },
  estimate_product_before_calculating: {
    difficulties: [2, 3],
    build(d) {
      const a = d >= 3 ? rand(1002, 4989) : rand(102, 489);
      const b = rand(3, 9);
      const unit = d >= 3 ? 1000 : 100;
      const roundedA = Math.round(a / unit) * unit;
      const estimate = roundedA * b;
      const decoys = [a * b, roundedA + b, estimate + unit, estimate - unit].filter((x) => x !== estimate && x > 0);
      const { options, correctIndex } = buildMC(estimate, decoys);
      return { q: `Estimate ${a} × ${b} by rounding ${a} to the nearest ${unit} first.`, options, correctIndex,
        hint: "To estimate a product, round one number to a convenient value first, then multiply.",
        solution: {
          scenario: `We estimate ${a} × ${b} by rounding ${a} to the nearest ${unit} first.`,
          idea: "Estimate by rounding the larger number first, then multiplying — the result is an approximation, not the exact answer.",
          method: [`Round ${a} to the nearest ${unit}.`, "Multiply the rounded number by the other."],
          steps: [`${a} rounds to ${roundedA}.`, `${roundedA} × ${b} = ${estimate}.`],
          check: `The estimate ${estimate} is close to the exact answer ${a * b}.`,
        } };
    },
  },
  compare_two_products: {
    difficulties: [2, 3, 4],
    build(d) {
      const range = d >= 4 ? [100, 900] : [20, 90];
      const a1 = rand(range[0], range[1]), b1 = rand(2, 9);
      const a2 = rand(range[0], range[1]), b2 = rand(2, 9);
      const p1 = a1 * b1, p2 = a2 * b2;
      if (p1 === p2) return null;
      const wantBigger = pick([true, false]);
      const ans = wantBigger === (p1 > p2) ? `${a1} × ${b1}` : `${a2} × ${b2}`;
      const other = wantBigger === (p1 > p2) ? `${a2} × ${b2}` : `${a1} × ${b1}`;
      const decoys = [other, "they are equal", "it cannot be compared without a calculator", "the one with bigger-looking numbers is always bigger"];
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Which is ${wantBigger ? "bigger" : "smaller"}: ${a1} × ${b1} or ${a2} × ${b2}?`, options, correctIndex,
        hint: "To compare two products safely, work out both and compare the results directly.",
        solution: {
          scenario: `We compare ${a1} × ${b1} and ${a2} × ${b2}.`,
          idea: "The safest way to compare two products is to calculate both fully and compare the totals.",
          method: [`Work out ${a1} × ${b1}.`, `Work out ${a2} × ${b2}.`, "Compare the two results."],
          steps: [`${a1} × ${b1} = ${p1}.`, `${a2} × ${b2} = ${p2}.`, `${ans} is ${wantBigger ? "bigger" : "smaller"}.`],
          check: `${p1} ${p1 > p2 ? ">" : "<"} ${p2}.`,
        } };
    },
  },
  long_multiplication_2digit_full: {
    difficulties: [3, 4],
    build(d) {
      const a = d >= 4 ? rand(23, 89) : rand(12, 45);
      const b = d >= 4 ? rand(23, 89) : rand(12, 45);
      const product = a * b;
      const aTens = Math.floor(a / 10) * 10, aOnes = a % 10;
      const bTens = Math.floor(b / 10) * 10, bOnes = b % 10;
      const part1 = aTens * b, part2 = aOnes * b;
      const decoys = [product + 10, product - 10, aTens * bTens + aOnes * bOnes, a * b + a].filter((x) => x !== product && x > 0);
      const { options, correctIndex } = buildMC(product, decoys);
      return { q: `Work out ${a} × ${b} using long multiplication.`, options, correctIndex,
        hint: "This is a long multiplication question — both numbers have two digits. Split one number into tens and ones, multiply each part by the WHOLE of the other number, then add.",
        solution: {
          scenario: `We need ${a} × ${b}, both two-digit numbers.`,
          idea: `Splitting ${a} into ${aTens} + ${aOnes}, multiplying each part by ${b}, and adding the results gives the full product.`,
          method: [`Multiply ${aTens} × ${b}.`, `Multiply ${aOnes} × ${b}.`, "Add the two results."],
          steps: [`${aTens} × ${b} = ${part1}.`, `${aOnes} × ${b} = ${part2}.`, `${part1} + ${part2} = ${product}.`],
          check: `${a} × ${b} worked out directly also gives ${product}.`,
        } };
    },
  },
  spot_the_method_error: {
    difficulties: [3, 4],
    build(d) {
      const h = rand(1, 9), t = rand(1, 9), o = rand(1, 9);
      const multiplicand = h * 100 + t * 10 + o;
      const multiplier = rand(2, 9);
      const errorPlace = pick(["hundreds", "tens", "ones"]);
      const partVal = errorPlace === "hundreds" ? h * 100 : errorPlace === "tens" ? t * 10 : o;
      const truePartProduct = partVal * multiplier;
      if (truePartProduct < 10) return null;
      const brokenPartProduct = truePartProduct % 10;
      const errorAmount = truePartProduct - brokenPartProduct;
      const decoys = [errorAmount / 10, errorAmount * 10, truePartProduct, brokenPartProduct].filter((x) => x !== errorAmount && x > 0);
      const { options, correctIndex } = buildMC(errorAmount, decoys);
      return { q: `While working out ${multiplicand} × ${multiplier} by the column method, someone forgets to carry when they multiply the ${errorPlace} digit — they write ${brokenPartProduct} for that step instead of the correct ${truePartProduct}, and don't carry the difference forward. By how much is their final total too small?`, options, correctIndex,
        hint: "This is a spot the effect of a method error question. Work out how much smaller the mistaken partial product is than the correct one — that's exactly how much the final total is thrown off by.",
        solution: {
          scenario: `Someone forgets to carry on the ${errorPlace} step of ${multiplicand} × ${multiplier}, writing ${brokenPartProduct} instead of the correct ${truePartProduct}.`,
          idea: "Every partial product feeds directly into the final total. If one partial product is too small by a certain amount, the whole final total ends up too small by exactly that same amount.",
          method: ["Work out the correct partial product for that step.", "Work out the (wrong) partial product actually written.", "Find the difference."],
          steps: [`The correct partial product is ${truePartProduct}, but ${brokenPartProduct} was written instead.`, `${truePartProduct} − ${brokenPartProduct} = ${errorAmount}.`],
          check: `${brokenPartProduct} + ${errorAmount} = ${truePartProduct}.`,
        } };
    },
  },
  compound_area_multiplication: {
    difficulties: [4],
    build(d) {
      const length = rand(23, 78), width = rand(15, 68);
      const area = length * width;
      const unit = pick(["cm", "m"]);
      const lengthTens = Math.floor(length / 10) * 10, lengthOnes = length % 10;
      const widthTens = Math.floor(width / 10) * 10, widthOnes = width % 10;
      const decoys = [area + length, lengthTens * widthTens + lengthOnes * widthOnes, area + 10, area - 10].filter((x) => x !== area && x > 0);
      const { options, correctIndex } = buildMC(area, decoys);
      return { q: `A rectangular garden is ${length}${unit} long and ${width}${unit} wide. What is its area, in ${unit}²?`, options, correctIndex,
        hint: "This is an area from long multiplication question. Area of a rectangle is length × width — here that means multiplying two 2-digit numbers.",
        solution: {
          scenario: `A rectangle measures ${length}${unit} by ${width}${unit}.`,
          idea: "The area of a rectangle is its length multiplied by its width. With two-digit measurements, that means using long multiplication.",
          method: [`Multiply ${length} by ${width} using long multiplication.`],
          steps: [`${length} × ${width} = ${area}.`],
          check: `${area} ÷ ${length} = ${width}.`,
        } };
    },
  },
};
// Structure registry for formalDivision. Covers the WRITTEN METHOD's mechanics (quotient,
// remainder, and the "bring down and combine" running-remainder step as three separate
// unknowns from the same division), missing dividend/divisor as inverse reasoning,
// estimating before dividing exactly, the ratio-table technique at increasing divisor size,
// remainder-as-fraction and multi-step chains, and diagnosing two classic written-method
// errors (skipping a middle zero digit; the bring-down misconception) at the top end.
const FORMAL_DIVISION_STRUCTURES = {
  short_division_quotient: {
    difficulties: [1, 2],
    build(d) {
      const divisor = rand(3, 9);
      const quotient = rand(20, 120);
      const remainder = rand(1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      const decoys = [quotient + 1, quotient - 1, dividend, Math.round(dividend / (divisor + 1))].filter((x) => x !== quotient && x > 0);
      const { options, correctIndex } = buildMC(quotient, decoys);
      return { q: `Use the short division method to work out ${dividend} ÷ ${divisor}. What is the whole-number quotient?`, options, correctIndex,
        hint: "Short division processes each digit from left to right, dividing the divisor into each digit and carrying any remainder into the next.",
        solution: {
          scenario: `We need the whole-number quotient of ${dividend} ÷ ${divisor}.`,
          idea: "Short division works through each digit of the dividend from left to right, carrying remainders into the next column.",
          method: ["Divide each digit in turn, left to right.", "Carry any remainder into the next digit."],
          steps: [`${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}.`],
          check: `${divisor} × ${quotient} + ${remainder} = ${dividend}.`,
        } };
    },
  },
  missing_dividend_or_divisor: {
    difficulties: [1, 2],
    build(d) {
      const divisor = rand(4, 20);
      const quotient = rand(10, 50);
      const dividend = divisor * quotient;
      const askDivisor = pick([true, false]);
      const answer = askDivisor ? divisor : dividend;
      const decoys = (askDivisor ? [divisor + 1, divisor - 1, quotient, dividend] : [dividend + divisor, dividend - divisor, divisor, quotient]).filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      if (askDivisor) {
        return { q: `${dividend} ÷ ? = ${quotient}. What number goes in the blank?`, options, correctIndex,
          hint: "Use the inverse relationship: missing divisor = dividend ÷ quotient.",
          solution: {
            scenario: `${dividend} ÷ ? = ${quotient}, and we need the missing divisor.`,
            idea: "Division and multiplication are inverses: if A ÷ ? = B, then ? = A ÷ B.",
            method: ["Divide the dividend by the quotient."],
            steps: [`${dividend} ÷ ${quotient} = ${divisor}.`],
            check: `${dividend} ÷ ${divisor} = ${quotient}.`,
          } };
      }
      return { q: `? ÷ ${divisor} = ${quotient}. What number goes in the blank?`, options, correctIndex,
        hint: "Use the inverse relationship: missing dividend = divisor × quotient.",
        solution: {
          scenario: `? ÷ ${divisor} = ${quotient}, and we need the missing dividend.`,
          idea: "If ? ÷ divisor = quotient, then ? = divisor × quotient.",
          method: ["Multiply the divisor by the quotient."],
          steps: [`${divisor} × ${quotient} = ${dividend}.`],
          check: `${dividend} ÷ ${divisor} = ${quotient}.`,
        } };
    },
  },
  identify_remainder: {
    difficulties: [1],
    build(d) {
      const divisor = rand(3, 9);
      const quotient = rand(5, 30);
      const remainder = rand(1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      const decoys = [quotient, divisor, remainder + 1, divisor - remainder].filter((x) => x !== remainder && x >= 0);
      const { options, correctIndex } = buildMC(remainder, decoys);
      return { q: `${dividend} ÷ ${divisor} = ${quotient} remainder ?. What is the remainder?`, options, correctIndex,
        hint: "This is a find the remainder question. The remainder is whatever is left over after dividing as many whole times as possible.",
        solution: {
          scenario: `${dividend} ÷ ${divisor} gives a quotient of ${quotient} with something left over.`,
          idea: "The remainder is what's left after taking out as many whole groups as possible — it's always smaller than the divisor.",
          method: [`Multiply ${divisor} × ${quotient}.`, `Subtract that from ${dividend}.`],
          steps: [`${divisor} × ${quotient} = ${divisor * quotient}.`, `${dividend} − ${divisor * quotient} = ${remainder}.`],
          check: `${remainder} is smaller than ${divisor}, as a remainder should be.`,
        } };
    },
  },
  procedural_bring_down_digit: {
    difficulties: [1, 2],
    build(d) {
      const divisor = rand(2, 9);
      const dg1 = rand(1, 9), dg2 = rand(0, 9), dg3 = rand(0, 9);
      const dividend = Number(`${dg1}${dg2}${dg3}`);
      const answer = dg2;
      const wrongOpts = [...new Set([dg1, dg3, (dg2 + 1) % 10, (dg2 + 9) % 10])].filter((x) => x !== answer);
      if (wrongOpts.length < 3) return null;
      const { options, correctIndex } = buildMC(answer, wrongOpts);
      return { q: `You are dividing ${dividend} by ${divisor} using long division. After dealing with the first (hundreds) digit, which digit do you bring down next?`, options, correctIndex,
        hint: "Long division works from left to right. After the leftmost digit, the next step is always to bring down the digit immediately to its right.",
        solution: {
          scenario: `We're dividing ${dividend} by ${divisor}, and need the next digit brought down after the hundreds digit.`,
          idea: "Long division processes digits from left to right. After the hundreds digit, the tens digit is brought down next.",
          method: ["Identify the digit immediately to the right of the one just dealt with."],
          steps: [`After the hundreds digit (${dg1}), the next digit to bring down is the tens digit: ${answer}.`],
          check: `${answer} is indeed the tens digit of ${dividend}.`,
        } };
    },
  },
  estimate_the_quotient: {
    difficulties: [1, 2],
    build(d) {
      const divisor = d <= 1 ? rand(3, 9) : rand(11, 29);
      const roundedDividend = divisor * rand(10, 90);
      const offset = rand(1, Math.max(1, Math.floor((divisor - 1) / 2)));
      const dividend = roundedDividend + offset;
      const exact = roundedDividend / divisor;
      const decoys = [exact + 1, exact - 1, Math.round(dividend / (divisor + 1)), divisor].filter((x) => x !== exact && x > 0);
      const { options, correctIndex } = buildMC(exact, decoys);
      return { q: `Estimate ${dividend} ÷ ${divisor} by first rounding ${dividend} to the nearest multiple of ${divisor}.`, options, correctIndex,
        hint: "This is an estimate a division question. Round the dividend to a nearby number that divides exactly, then divide that instead.",
        solution: {
          scenario: `We estimate ${dividend} ÷ ${divisor} by rounding ${dividend} first.`,
          idea: "Rounding the dividend to a nearby multiple of the divisor makes the division come out exactly, giving a quick, close estimate.",
          method: [`Round ${dividend} to the nearest multiple of ${divisor}.`, "Divide that rounded number instead."],
          steps: [`${dividend} rounds to ${roundedDividend}.`, `${roundedDividend} ÷ ${divisor} = ${exact}.`],
          check: `${exact} × ${divisor} = ${roundedDividend}, close to the original ${dividend}.`,
        } };
    },
  },
  ratio_table_long_division: {
    difficulties: [2, 3],
    build(d) {
      const divisor = rand(11, 29);
      const quotient = d >= 3 ? rand(30, 90) : rand(20, 90);
      const dividend = divisor * quotient;
      const multipleUsed = pick([2, 5, 10]);
      const helperMultiple = divisor * multipleUsed;
      const decoys = [quotient + 1, quotient - 1, divisor, Math.round(dividend / (divisor + 1))].filter((x) => x !== quotient && x > 0);
      const { options, correctIndex } = buildMC(quotient, decoys);
      return { q: `To work out ${dividend} ÷ ${divisor}, a ratio table gives ${divisor}×${multipleUsed} = ${helperMultiple}. Using multiples of ${divisor} like this, what is ${dividend} ÷ ${divisor}?`, options, correctIndex,
        hint: "The ratio table method builds up known multiples of the divisor and combines them to reach the dividend. Add up the multipliers used to get the quotient.",
        solution: {
          scenario: `We work out ${dividend} ÷ ${divisor} using a ratio table starting from ${divisor}×${multipleUsed}=${helperMultiple}.`,
          idea: "Building up multiples of the divisor using known facts, then combining them to reach the dividend, avoids guessing at bigger divisions.",
          method: ["Build up multiples of the divisor.", "Combine multiples that add to the dividend.", "Add their multipliers together."],
          steps: [`Building up multiples of ${divisor} and combining them reaches ${dividend} exactly.`, `${dividend} ÷ ${divisor} = ${quotient}.`],
          check: `${divisor} × ${quotient} = ${dividend}.`,
        } };
    },
  },
  remainder_as_fraction: {
    difficulties: [2, 3, 4],
    build(d) {
      const divisor = d >= 4 ? rand(10, 20) : rand(3, 9);
      const quotient = rand(5, 20);
      const remainder = rand(1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      const g = gcd(remainder, divisor);
      const simN = remainder / g, simD = divisor / g;
      const ans = `${quotient} ${simN}/${simD}`;
      const candidates = [`${quotient} ${remainder}/${divisor}`, `${quotient + 1} ${simN}/${simD}`, `${quotient} ${simD}/${simN}`, `${quotient - 1} ${simN}/${simD}`, `${quotient} ${simN + 1}/${simD}`, `${quotient} ${Math.max(simN - 1, 1)}/${simD}`];
      const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${dividend} ÷ ${divisor}. Give your answer as a mixed number, remainder expressed as a fraction in simplest form.`, options, correctIndex,
        hint: "A mixed number quotient writes the whole-number result first, then the remainder as a fraction over the divisor, simplified to lowest terms.",
        solution: {
          scenario: `We need ${dividend} ÷ ${divisor} as a mixed number with the remainder simplified.`,
          idea: "The fraction part is remainder/divisor, simplified by dividing both by their highest common factor.",
          method: ["Divide to get a whole-number quotient and remainder.", "Write the remainder as a fraction over the divisor.", "Simplify the fraction."],
          steps: [`${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}.`, `${remainder}/${divisor}${g > 1 ? ` = ${simN}/${simD}` : ""}.`],
          check: `${ans} matches the division exactly.`,
        } };
    },
  },
  two_step_division: {
    difficulties: [2, 3, 4],
    build(d) {
      const divisor1 = rand(2, 9), divisor2 = rand(2, 9);
      const finalQuotient = rand(3, 15);
      const afterFirst = finalQuotient * divisor2;
      const dividend = afterFirst * divisor1;
      if (d < 4) {
        const decoys = [afterFirst, dividend, finalQuotient + 1, finalQuotient - 1].filter((x) => x !== finalQuotient && x > 0);
        const { options, correctIndex } = buildMC(finalQuotient, decoys);
        return { q: `Work out ${dividend} ÷ ${divisor1}, then divide that answer by ${divisor2}. What is the final answer?`, options, correctIndex,
          hint: "Apply the two divisions in sequence.",
          solution: {
            scenario: `We divide ${dividend} by ${divisor1}, then by ${divisor2}.`,
            idea: "Applying one division, then dividing that result again, gives the final answer step by step.",
            method: [`Divide ${dividend} by ${divisor1}.`, "Divide that result by the second divisor."],
            steps: [`${dividend} ÷ ${divisor1} = ${afterFirst}.`, `${afterFirst} ÷ ${divisor2} = ${finalQuotient}.`],
            check: `${finalQuotient} × ${divisor2} × ${divisor1} = ${dividend}.`,
          } };
      }
      const divisor3 = rand(2, 5);
      const beforeThird = finalQuotient * divisor3;
      const dividend3 = beforeThird * divisor2 * divisor1;
      const afterFirst3 = dividend3 / divisor1;
      const decoys = [afterFirst3, beforeThird, finalQuotient + 1, finalQuotient - 1].filter((x) => x !== finalQuotient && x > 0);
      const { options, correctIndex } = buildMC(finalQuotient, decoys);
      return { q: `Work out ${dividend3} ÷ ${divisor1}, then divide that by ${divisor2}, then divide THAT by ${divisor3}. What is the final answer?`, options, correctIndex,
        hint: "Apply all three divisions in sequence, one after another.",
        solution: {
          scenario: `We divide ${dividend3} by ${divisor1}, then ${divisor2}, then ${divisor3}.`,
          idea: "Applying three divisions one after another, each on the previous result, gives the final answer.",
          method: [`Divide ${dividend3} by ${divisor1}.`, "Divide that result by the second divisor.", "Divide that result by the third divisor."],
          steps: [`${dividend3} ÷ ${divisor1} = ${afterFirst3}.`, `${afterFirst3} ÷ ${divisor2} = ${beforeThird}.`, `${beforeThird} ÷ ${divisor3} = ${finalQuotient}.`],
          check: `${finalQuotient} × ${divisor3} × ${divisor2} × ${divisor1} = ${dividend3}.`,
        } };
    },
  },
  carried_remainder_value: {
    difficulties: [3, 4],
    build(d) {
      const divisor = d >= 4 ? rand(11, 29) : rand(2, 9);
      const dividend = d >= 4 ? divisor * rand(20, 90) + rand(1, divisor - 1) : rand(200, 899);
      const dividendStr = String(dividend);
      let remainder = 0, firstQuotientDigit = null, secondStepValue = null;
      for (let i = 0; i < dividendStr.length; i++) {
        const bringDown = remainder * 10 + Number(dividendStr[i]);
        const qd = Math.floor(bringDown / divisor);
        remainder = bringDown % divisor;
        if (i === 0) firstQuotientDigit = qd;
        if (i === 1) { secondStepValue = bringDown; break; }
      }
      if (secondStepValue === null || secondStepValue === 0) return null;
      const decoys = [Number(dividendStr[1]), remainder, secondStepValue + divisor, secondStepValue - divisor].filter((x) => x !== secondStepValue && x >= 0);
      const { options, correctIndex } = buildMC(secondStepValue, decoys);
      return { q: `Using long division for ${dividend} ÷ ${divisor}, after dividing the first digit, what number do you actually divide by ${divisor} next (after bringing down and combining with any remainder)?`, options, correctIndex,
        hint: "This is a track the running remainder question. Whatever is left over from the first step gets combined with the next digit brought down — THAT combined number is what's divided next, not just the bare digit.",
        solution: {
          scenario: `We're doing ${dividend} ÷ ${divisor} by long division and need the number actually divided at the second step.`,
          idea: "After each digit, any remainder is combined with the next digit brought down (remainder ×10 + next digit) — that combined number is divided next.",
          method: ["Work out the remainder from the first step.", "Combine it with the next digit brought down.", "That combined number is divided next."],
          steps: [`After the first digit, ${firstQuotientDigit} is written and a remainder is carried.`, `Combined with the next digit, the number to divide next is ${secondStepValue}.`],
          check: `${secondStepValue} ÷ ${divisor} gives a valid next quotient digit.`,
        } };
    },
  },
  long_division_2digit_divisor: {
    difficulties: [3, 4],
    build(d) {
      const divisor = rand(11, 29);
      const quotient = d >= 4 ? rand(20, 90) : rand(10, 40);
      const dividend = divisor * quotient;
      const decoys = [quotient + 1, quotient - 1, divisor, Math.round(dividend / (divisor + 1))].filter((x) => x !== quotient && x > 0);
      const { options, correctIndex } = buildMC(quotient, decoys);
      return { q: `Use long division to work out ${dividend} ÷ ${divisor}.`, options, correctIndex,
        hint: "This is a long division question with a 2-digit divisor. Build up multiples of the divisor and combine them to reach the dividend exactly.",
        solution: {
          scenario: `We need ${dividend} ÷ ${divisor}, with a 2-digit divisor.`,
          idea: "With a 2-digit divisor, building up known multiples (×10, ×5, ×2) and adding them to reach the dividend is more reliable than guessing single digits.",
          method: [`Build up multiples of ${divisor} (×10, ×5, ×2, ×1).`, "Combine the multiples that add up to the dividend exactly.", "Add their multipliers for the quotient."],
          steps: [`${divisor} × ${quotient} = ${dividend}.`],
          check: `${dividend} ÷ ${divisor} = ${quotient} exactly, with no remainder.`,
        } };
    },
  },
  spot_the_long_division_error: {
    difficulties: [4],
    build(d) {
      const divisor = rand(3, 9);
      const dividend = rand(200, 899);
      const dividendStr = String(dividend);
      let remainder = 0; const quotientDigits = [];
      for (let i = 0; i < dividendStr.length; i++) {
        const bringDown = remainder * 10 + Number(dividendStr[i]);
        quotientDigits.push(Math.floor(bringDown / divisor));
        remainder = bringDown % divisor;
      }
      const trueQuotient = Number(quotientDigits.join(""));
      if (trueQuotient < 10) return null;
      const zeroIdx = quotientDigits.findIndex((qd, i) => i > 0 && qd === 0);
      if (zeroIdx === -1) return null;
      const brokenDigits = quotientDigits.filter((_, i) => i !== zeroIdx);
      const claimedQuotient = Number(brokenDigits.join(""));
      const decoys = [trueQuotient, claimedQuotient + 1, claimedQuotient - 1, trueQuotient - claimedQuotient].filter((x) => x !== claimedQuotient && x > 0);
      const { options, correctIndex } = buildMC(claimedQuotient, decoys);
      return { q: `While doing ${dividend} ÷ ${divisor} by long division, someone forgets to write a 0 in the quotient when a step doesn't divide, and just skips that digit entirely. What answer do they end up with?`, options, correctIndex,
        hint: "This is a spot the effect of skipping a zero question. Every step of long division MUST get a digit (even a 0) in the quotient, or every later digit shifts into the wrong place.",
        solution: {
          scenario: `Someone skips writing a 0 in the quotient of ${dividend} ÷ ${divisor}, instead of leaving it in.`,
          idea: "Every step of long division produces exactly one quotient digit, even if it's 0. Skipping it shifts every later digit one place too far, changing the whole number.",
          method: ["Work out the TRUE quotient digit by digit, including any zeros.", "See what happens if a zero digit is skipped instead of written."],
          steps: [`The correct quotient is ${trueQuotient}.`, `Skipping the 0 digit instead gives ${claimedQuotient}.`],
          check: `${claimedQuotient} has one fewer digit than the correct ${trueQuotient}, exactly as skipping a digit would cause.`,
        } };
    },
  },
};
// Structure registry for divisionRemainders. Distinct from formalDivision (which covers the
// written METHOD) — this topic is entirely about INTERPRETING a remainder correctly for a
// given context: round up (everyone/everything must be housed), round down (only complete
// groups count), report it directly, convert it to a decimal (money) or a fraction (of the
// total, not the divisor — a classic confusion), classify which rule fits a scenario without
// even computing, chain two different rules in one problem, and reverse-reason about the
// boundary where an extra group becomes necessary.
const DIVISION_REMAINDERS_STRUCTURES = {
  quotient_or_remainder_direct: {
    difficulties: [1, 2],
    build(d) {
      const divisor = rand(3, 9);
      const quotient = rand(4, 20);
      const remainder = rand(1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      const askQuotient = pick([true, false]);
      const answer = askQuotient ? quotient : remainder;
      const decoys = (askQuotient ? [quotient + 1, quotient - 1, remainder] : [divisor - remainder, remainder + 1, quotient]).filter((x) => x !== answer && x >= 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `${dividend} ÷ ${divisor} = ? Give the ${askQuotient ? "whole number answer (quotient)" : "remainder"}.`, options, correctIndex,
        hint: "This is a division with a remainder question. When a division doesn't come out exactly, you get a whole number of groups plus a bit left over.",
        solution: {
          scenario: `We divide ${dividend} by ${divisor} and give the ${askQuotient ? "whole number part" : "remainder"}.`,
          idea: "Dividing doesn't always come out exact. If it doesn't, you get a whole number of full groups, plus a remainder smaller than the divisor.",
          method: ["Work out how many full groups fit in.", "Subtract to find what's left over."],
          steps: [`${divisor} × ${quotient} = ${divisor * quotient}.`, `${dividend} − ${divisor * quotient} = ${remainder}.`, `${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}.`],
          check: `The remainder ${remainder} is smaller than the divisor ${divisor}.`,
        } };
    },
  },
  round_remainder_up_context: {
    difficulties: [1, 2],
    build(d) {
      const capacity = rand(4, 9);
      const fullGroups = rand(2, 10);
      const extra = rand(1, capacity - 1);
      const total = capacity * fullGroups + extra;
      const answer = fullGroups + 1;
      const decoys = [fullGroups, Math.round(total / capacity), fullGroups + 2].filter((x) => x !== answer && x > 0);
      const nm = N1();
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `${nm} is organising a trip. Each minibus holds ${capacity} people, and ${total} people are going. How many minibuses are needed so that everyone has a seat?`, options, correctIndex,
        hint: "This is a round the remainder up question. Leftover people still need somewhere to sit, so a whole extra minibus is needed even if it isn't full.",
        solution: {
          scenario: `${total} people need seats on minibuses that each hold ${capacity}.`,
          idea: "Since the leftover people still need a seat, one more (not-quite-full) minibus is needed, rounding the number of groups UP.",
          method: ["Divide the total by the group size.", "If there's a remainder, add one more group."],
          steps: [`${total} ÷ ${capacity} = ${fullGroups} remainder ${extra}.`, `One more minibus is needed for the leftover ${extra}: ${answer}.`],
          check: `${answer} minibuses hold up to ${answer * capacity} people, enough for all ${total}.`,
        } };
    },
  },
  round_remainder_down_context: {
    difficulties: [1, 2],
    build(d) {
      const rowSize = rand(4, 9);
      const rows = rand(3, 10);
      const extra = rand(1, rowSize - 1);
      const total = rowSize * rows + extra;
      const decoys = [rows + 1, Math.round(total / rowSize), rows - 1].filter((x) => x !== rows && x >= 0);
      const { options, correctIndex } = buildMC(rows, decoys);
      return { q: `${total} tiles are used to make complete rows of ${rowSize} tiles each. How many complete rows can be made?`, options, correctIndex,
        hint: "This is a round the remainder down question. Leftover tiles that can't make a full row just don't count.",
        solution: {
          scenario: `${total} tiles are arranged into complete rows of ${rowSize}.`,
          idea: "Only whole, complete groups count here, so the remainder is simply left out of the count.",
          method: ["Divide the total by the group size.", "Ignore the remainder."],
          steps: [`${total} ÷ ${rowSize} = ${rows} remainder ${extra}.`, `${rows} complete rows can be made.`],
          check: `${rows} × ${rowSize} = ${rows * rowSize}, which is ${extra} less than ${total}.`,
        } };
    },
  },
  state_leftover_directly: {
    difficulties: [1, 2],
    build(d) {
      const children = rand(3, 9);
      const perChild = rand(3, 15);
      const extra = rand(1, children - 1);
      const total = children * perChild + extra;
      const nm = N1();
      const decoys = [perChild, children - extra, extra + 1].filter((x) => x !== extra && x >= 0);
      const { options, correctIndex } = buildMC(extra, decoys);
      return { q: `${nm} shares ${total} sweets equally among ${children} friends, giving out as many as possible. How many sweets are left over?`, options, correctIndex,
        hint: "This is a what's left over question. Give out as many whole shares as possible, and report exactly what's left.",
        solution: {
          scenario: `${total} sweets are shared among ${children} friends, giving out as many as possible.`,
          idea: "Whatever is left after giving out as many whole shares as possible, too little for another full share each, is the remainder.",
          method: ["Divide the total by the number of people.", "The leftover is the remainder."],
          steps: [`${total} ÷ ${children} = ${perChild} remainder ${extra}.`],
          check: `${children} × ${perChild} = ${children * perChild}, and ${total} − ${children * perChild} = ${extra}.`,
        } };
    },
  },
  classify_the_right_approach: {
    difficulties: [1],
    build(d) {
      const scenarios = [
        { text: "people need seats on buses that each hold a fixed number", answer: "round the number of buses UP" },
        { text: "counting how many complete full rows of tiles can be made from a pile", answer: "round the number of rows DOWN" },
        { text: "sharing sweets equally and asking how many are left over afterwards", answer: "give the remainder itself" },
        { text: "sharing an amount of money equally with nothing left over", answer: "give an exact decimal answer" },
        { text: "counting how many complete teams of a fixed size can be formed, with some left without a team", answer: "round the number of teams DOWN" },
      ];
      const correct = pick(scenarios);
      const decoys = scenarios.filter((s) => s !== correct).map((s) => s.answer);
      const { options, correctIndex } = buildMCStr(correct.answer, decoys);
      return { q: `You are ${correct.text}. What should you do with any leftover amount?`, options, correctIndex,
        hint: "This is a spot the right approach question. Different situations call for different ways of handling a remainder.",
        solution: {
          scenario: `We need the right way to handle a remainder when ${correct.text}.`,
          idea: "There's no single rule for a remainder — it depends on what's really happening. Ask: does the leftover still need accounting for, even though it isn't a full group?",
          method: ["Think about what the leftover amount actually represents.", "Decide whether it needs its own extra group, should be ignored, reported directly, or split further."],
          steps: [`In this situation, you should ${correct.answer}.`],
          check: "This matches how the leftover amount is really being used in the situation described.",
        } };
    },
  },
  remainder_as_decimal_money: {
    difficulties: [2, 3],
    build(d) {
      const people = pick([2, 4, 5, 8]);
      const perPerson = rand(10, 80);
      const totalPence = people * perPerson;
      const totalPounds = totalPence / 100;
      const perPersonPounds = perPerson / 100;
      const decoys = [Math.floor(perPersonPounds), totalPounds, perPersonPounds + 0.5].filter((x) => x !== perPersonPounds);
      const { options, correctIndex } = buildMC(perPersonPounds, decoys, (x) => "£" + x.toFixed(2));
      return { q: `£${totalPounds.toFixed(2)} is shared equally among ${people} people. How much does each person get?`, options, correctIndex,
        hint: "This is a sharing money exactly question. Money splits into pence, so it can be shared right down to an exact decimal with nothing left over.",
        solution: {
          scenario: `£${totalPounds.toFixed(2)} is shared equally among ${people} people.`,
          idea: "Unlike sweets or tiles, money splits into pence, so any leftover pounds convert into pence and share out exactly, giving a decimal answer instead of a remainder.",
          method: ["Divide the total amount by the number of people.", "Write the answer as pounds and pence."],
          steps: [`£${totalPounds.toFixed(2)} ÷ ${people} = £${perPersonPounds.toFixed(2)}.`],
          check: `${people} × £${perPersonPounds.toFixed(2)} = £${totalPounds.toFixed(2)}, with nothing left over.`,
        } };
    },
  },
  remainder_must_be_smaller_misconception: {
    difficulties: [2, 3, 4],
    build(d) {
      const divisor = d >= 4 ? rand(10, 20) : rand(4, 9);
      const quotient = rand(3, 12);
      const remainder = rand(1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      const wrongQuotient = quotient - 1;
      const wrongRemainder = remainder + divisor;
      const correctStr = `${quotient} remainder ${remainder}`;
      const wrongStr = `${wrongQuotient} remainder ${wrongRemainder}`;
      const otherWrong1 = `${quotient + 1} remainder ${remainder}`;
      const otherWrong2 = `${quotient} remainder ${remainder + divisor}`;
      const otherWrong3 = `${quotient + 1} remainder ${wrongRemainder}`;
      const { options, correctIndex } = buildMCStr(correctStr, [wrongStr, otherWrong1, otherWrong2, otherWrong3]);
      return { q: `Which of these correctly shows ${dividend} ÷ ${divisor}?`, options, correctIndex,
        hint: "This is a spot the mistake question about remainders. A genuine remainder must always be smaller than the divisor.",
        solution: {
          scenario: `We need the option that correctly shows ${dividend} ÷ ${divisor}.`,
          idea: "If a 'remainder' is equal to or bigger than the divisor, that means at least one more full group could have been made from it — so it isn't really left over at all.",
          method: ["Work out the correct quotient and remainder.", "Check each option's remainder is smaller than the divisor."],
          steps: [`${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}.`, `A remainder must be smaller than ${divisor}, ruling out options with a bigger one.`],
          check: `${divisor} × ${quotient} + ${remainder} = ${dividend}, and ${remainder} < ${divisor}.`,
        } };
    },
  },
  reconstruct_dividend_from_qr: {
    difficulties: [2, 3],
    build(d) {
      const divisor = rand(4, 9);
      const quotient = rand(5, 15);
      const remainder = rand(1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      const decoys = [divisor * quotient, dividend + divisor, dividend - remainder - 1].filter((x) => x !== dividend && x > 0);
      const { options, correctIndex } = buildMC(dividend, decoys);
      return { q: `When a number is divided by ${divisor}, the answer is ${quotient} remainder ${remainder}. What was the number?`, options, correctIndex,
        hint: "This is a work backwards to the original number question. Multiply the groups back up, then add the leftover back on.",
        solution: {
          scenario: `A number divided by ${divisor} gives ${quotient} remainder ${remainder}.`,
          idea: "To reverse a division, multiply the divisor by the quotient, then add the remainder back on.",
          method: ["Multiply the divisor by the quotient.", "Add the remainder."],
          steps: [`${divisor} × ${quotient} = ${divisor * quotient}.`, `${divisor * quotient} + ${remainder} = ${dividend}.`],
          check: `Dividing ${dividend} by ${divisor} again gives ${quotient} remainder ${remainder}.`,
        } };
    },
  },
  remainder_as_fraction_of_whole: {
    difficulties: [3, 4],
    build(d) {
      const divisor = d >= 4 ? rand(6, 12) : rand(4, 9);
      const quotient = rand(3, 15);
      const remainder = rand(1, divisor - 1);
      const total = divisor * quotient + remainder;
      const g = gcd(remainder, total);
      const simN = remainder / g, simD = total / g;
      const ans = `${simN}/${simD}`;
      const wrongCandidates = [`${remainder}/${total}`, `${remainder}/${divisor}`, `${simD}/${simN}`, `${simN + 1}/${simD}`, `${Math.max(simN - 1, 1)}/${simD}`];
      const decoys = [...new Set(wrongCandidates)].filter((s) => s !== ans).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      const item = pick(["sweets", "stickers", "counters"]);
      return { q: `${total} ${item} are shared equally among ${divisor} people, with ${remainder} left over. What FRACTION of the total ${item} were left over, in simplest form?`, options, correctIndex,
        hint: "This is a fraction of the WHOLE question, not a fraction of the divisor. The remainder is out of the total amount, not the number of people.",
        solution: {
          scenario: `${total} ${item} are shared among ${divisor} people with ${remainder} left over. We need what fraction of the TOTAL that remainder is.`,
          idea: "A fraction needs a 'whole' to compare against. Here, the whole is the TOTAL number of items, not the number of people sharing them.",
          method: [`Write the remainder over the total: ${remainder}/${total}.`, "Simplify the fraction."],
          steps: [`${remainder}/${total} simplifies to ${ans}.`],
          check: `${simN} × ${g} = ${remainder} and ${simD} × ${g} = ${total}.`,
        } };
    },
  },
  choose_correct_interpretation: {
    difficulties: [3, 4],
    build(d) {
      const divisor = d >= 4 ? rand(6, 12) : rand(4, 9);
      const quotient = rand(4, 15);
      const remainder = rand(1, divisor - 1);
      const total = divisor * quotient + remainder;
      const kind = pick(["needsAllHoused", "onlyFullGroupsCount"]);
      const item = pick(["cakes", "chairs", "footballs"]);
      let questionText, answer;
      if (kind === "needsAllHoused") {
        questionText = `A shop has ${total} ${item} and packs them into boxes of ${divisor}. If every single ${item.slice(0, -1)} must go in a box, how many boxes are needed?`;
        answer = quotient + 1;
      } else {
        questionText = `A shop has ${total} ${item} and wants to sell them in COMPLETE boxes of ${divisor} only (any leftover ${item} are not boxed). How many complete boxes can be sold?`;
        answer = quotient;
      }
      const decoys = [quotient, quotient + 1, quotient - 1, Math.round(total / divisor)].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: questionText, options, correctIndex,
        hint: "This is a read the scenario carefully question. Decide whether leftover items need their own extra box, or whether only full boxes count.",
        solution: {
          scenario: `${total} ${item} are packed into boxes of ${divisor}.`,
          idea: kind === "needsAllHoused"
            ? "If every item must be boxed, the leftover still needs a box of its own, even if it isn't full — round UP."
            : "If only complete boxes count as sellable, the leftover items are simply not included — round DOWN.",
          method: [`Divide ${total} by ${divisor} to get the full boxes and the remainder.`, kind === "needsAllHoused" ? "Add one more box for the leftover." : "Ignore the leftover."],
          steps: [`${total} ÷ ${divisor} = ${quotient} remainder ${remainder}.`, kind === "needsAllHoused" ? `One more box is needed for the ${remainder} leftover, giving ${answer}.` : `Only the ${quotient} complete boxes count.`],
          check: kind === "needsAllHoused" ? `${answer} boxes hold up to ${answer * divisor}, enough for all ${total}.` : `${quotient} × ${divisor} = ${quotient * divisor}, matching the complete boxes only.`,
        } };
    },
  },
  multi_remainder_chain: {
    difficulties: [4],
    build(d) {
      const boxSize = rand(4, 9);
      const itemsTotal = boxSize * rand(5, 15) + rand(1, boxSize - 1);
      const boxesNeeded = Math.ceil(itemsTotal / boxSize);
      const crateSize = rand(3, 6);
      const cratesFullOnly = Math.floor(boxesNeeded / crateSize);
      if (cratesFullOnly < 1) return null;
      const decoys = [Math.ceil(boxesNeeded / crateSize), cratesFullOnly + 1, cratesFullOnly - 1, boxesNeeded].filter((x) => x !== cratesFullOnly && x >= 0);
      const { options, correctIndex } = buildMC(cratesFullOnly, decoys);
      return { q: `${itemsTotal} items are packed into boxes of ${boxSize} (any leftover items still need their own box). Those boxes are then packed into crates of ${crateSize}, but only COMPLETE crates are shipped. How many complete crates can be shipped?`, options, correctIndex,
        hint: "This is a two-step remainder question — the FIRST step rounds up (every item needs a box), but the SECOND step rounds down (only full crates ship). Handle each step with its own correct rule.",
        solution: {
          scenario: `${itemsTotal} items go into boxes of ${boxSize} (rounding up), then those boxes go into crates of ${crateSize} (rounding down).`,
          idea: "Each step in a chain like this can need a DIFFERENT rounding rule — check what each step is really asking before assuming they're the same.",
          method: [`Divide ${itemsTotal} by ${boxSize}, rounding UP for the leftover items.`, `Divide that number of boxes by ${crateSize}, rounding DOWN since only complete crates count.`],
          steps: [`${itemsTotal} ÷ ${boxSize} needs ${boxesNeeded} boxes (rounding up).`, `${boxesNeeded} ÷ ${crateSize} = ${cratesFullOnly} complete crates (rounding down).`],
          check: `${cratesFullOnly} × ${crateSize} = ${cratesFullOnly * crateSize} boxes are shipped, out of the ${boxesNeeded} boxes made.`,
        } };
    },
  },
  smallest_total_needing_extra_group: {
    difficulties: [4],
    build(d) {
      const capacity = rand(4, 12);
      const n = rand(3, 15);
      const answer = capacity * n + 1;
      const decoys = [capacity * n, capacity * (n + 1), capacity * n + capacity, answer - 1].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `A minibus holds ${capacity} people. What is the SMALLEST number of people that would need ${n + 1} minibuses instead of just ${n}?`, options, correctIndex,
        hint: "This is a smallest number needing an extra group question. As soon as there is even ONE person too many for the full minibuses, a whole extra one is needed.",
        solution: {
          scenario: `We need the smallest number of people that tips over from needing ${n} minibuses to needing ${n + 1}.`,
          idea: "Exactly filling minibuses needs no extra one. The moment there is even a single extra person beyond that, a whole new minibus is needed.",
          method: [`Work out how many people exactly fill ${n} minibuses.`, "Add just 1 more person."],
          steps: [`${capacity} × ${n} = ${capacity * n} exactly fills ${n} minibuses.`, `${capacity * n} + 1 = ${answer} is the smallest number needing ${n + 1}.`],
          check: `${answer} people need ${n + 1} minibuses, while ${capacity * n} people need only ${n}.`,
        } };
    },
  },
};
// Structure registry for fractionOfQuantity. Covers the core "divide then multiply" skill
// at increasing generality (halves/quarters recall, unit fraction, non-unit fraction), its
// inverse (find the whole; find the missing numerator), a two-step extension (what's left
// after taking a fraction away; a fraction OF what's left — a classic "fraction of the
// remainder, not the original" trap — and its full reverse), comparing two fraction-of
// results across different quantities, and combining fractions of two separate totals.
const FRACTION_OF_QUANTITY_STRUCTURES = {
  half_and_quarter_recall: {
    difficulties: [1],
    build(d) {
      const [name, den] = pick([["half", 2], ["quarter", 4], ["third", 3]]);
      const total = den * rand(2, 20);
      const ans = total / den;
      const decoys = [total, ans + den, ans - 1, ans + 1].filter((x) => x !== ans && x > 0);
      const { options, correctIndex } = buildMC(ans, decoys);
      return { q: `What is a ${name} of ${total}?`, options, correctIndex,
        hint: `This is a find a ${name} question. A ${name} means splitting into ${den} equal parts and taking one.`,
        solution: {
          scenario: `We need a ${name} of ${total}.`,
          idea: `A ${name} of a number means dividing it into ${den} equal parts and taking one part.`,
          method: [`Divide ${total} by ${den}.`],
          steps: [`${total} ÷ ${den} = ${ans}.`],
          check: `${ans} × ${den} = ${total}.`,
        } };
    },
  },
  unit_fraction_of_quantity: {
    difficulties: [1, 2],
    build(d) {
      const den = d <= 1 ? rand(2, 6) : rand(2, 10);
      const multiple = rand(2, 15);
      const total = den * multiple;
      const decoys = [total, den, multiple + den, Math.round(total / (den + 1))].filter((x) => x !== multiple && x > 0);
      const { options, correctIndex } = buildMC(multiple, decoys);
      return { q: `What is 1/${den} of ${total}?`, options, correctIndex,
        hint: "A unit fraction of a quantity means splitting into that many equal parts and taking one. Divide the number by the denominator.",
        solution: {
          scenario: `We need 1/${den} of ${total}.`,
          idea: "To find 1/n of a quantity, divide by n.",
          method: [`Divide ${total} by ${den}.`],
          steps: [`${total} ÷ ${den} = ${multiple}.`],
          check: `${multiple} × ${den} = ${total}.`,
        } };
    },
  },
  non_unit_fraction_of_quantity: {
    difficulties: [1, 2],
    build(d) {
      const den = d <= 1 ? rand(3, 6) : rand(3, 10);
      const n = rand(2, den - 1);
      const unitPart = rand(2, 20);
      const total = den * unitPart;
      const ans = n * unitPart;
      const decoys = [unitPart, total, ans + unitPart, Math.round(total / n)].filter((x) => x !== ans && x > 0);
      const { options, correctIndex } = buildMC(ans, decoys);
      return { q: `What is ${n}/${den} of ${total}?`, options, correctIndex,
        hint: "Find one part first (divide by the denominator), then multiply by the numerator.",
        solution: {
          scenario: `We need ${n}/${den} of ${total}.`,
          idea: "To find n/d of a quantity: divide by d (to find 1/d), then multiply by n.",
          method: [`Divide ${total} by ${den}.`, `Multiply by ${n}.`],
          steps: [`${total} ÷ ${den} = ${unitPart} (this is 1/${den}).`, `${n} × ${unitPart} = ${ans}.`],
          check: `${ans} ÷ ${n} × ${den} = ${total}.`,
        } };
    },
  },
  reverse_find_whole: {
    difficulties: [1, 2],
    build(d) {
      const den = d <= 1 ? rand(3, 6) : rand(3, 10);
      const n = rand(2, den - 1);
      const unitPart = rand(2, 20);
      const total = den * unitPart;
      const given = n * unitPart;
      const decoys = [given, total + unitPart, total - unitPart, Math.round((given * den) / (n + 1))].filter((x) => x !== total && x > 0);
      const { options, correctIndex } = buildMC(total, decoys);
      const nm = N1();
      return { q: `${nm} has ${given}, and this is ${n}/${den} of what ${nm} started with. How much did ${nm} start with?`, options, correctIndex,
        hint: "This is the inverse of 'fraction of a quantity'. Find what one part is worth (divide by numerator), then multiply by the denominator.",
        solution: {
          scenario: `${n}/${den} of the total is ${given}, and we need the whole total.`,
          idea: "To find the whole when you know a fraction of it: divide by the numerator, then multiply by the denominator.",
          method: [`Divide ${given} by ${n}.`, `Multiply by ${den}.`],
          steps: [`${given} ÷ ${n} = ${unitPart} (this is 1/${den}).`, `${unitPart} × ${den} = ${total}.`],
          check: `${n}/${den} of ${total} = ${given}.`,
        } };
    },
  },
  fraction_then_remaining: {
    difficulties: [1, 2],
    build(d) {
      const den = d <= 1 ? rand(2, 5) : rand(3, 10);
      const n = rand(1, den - 1);
      const unitPart = rand(2, 15);
      const total = den * unitPart;
      const givenAway = n * unitPart;
      const remaining = total - givenAway;
      const decoys = [givenAway, total, remaining + unitPart, remaining - unitPart].filter((x) => x !== remaining && x > 0);
      const { options, correctIndex } = buildMC(remaining, decoys);
      const item = pick(["sweets", "marbles", "stickers", "pencils"]);
      return { q: `There are ${total} ${item}. ${n}/${den} of them are given away. How many ${item} are left?`, options, correctIndex,
        hint: "Work out how many were given away, then subtract that from the total.",
        solution: {
          scenario: `${total} ${item}, with ${n}/${den} given away. We need how many are left.`,
          idea: "Finding a fraction of a quantity tells you how many were taken. Subtracting that from the total gives what's left.",
          method: [`Find ${n}/${den} of ${total}.`, "Subtract that from the total."],
          steps: [`${n}/${den} of ${total} = ${givenAway}.`, `${total} − ${givenAway} = ${remaining}.`],
          check: `${givenAway} + ${remaining} = ${total}.`,
        } };
    },
  },
  what_fraction_is_part_of_whole: {
    difficulties: [2, 3],
    build(d) {
      const total = d >= 3 ? rand(20, 90) : rand(10, 40);
      const part = rand(1, total - 1);
      const g = gcd(part, total);
      const ans = `${part / g}/${total / g}`;
      const candidates = [`${part}/${total}`, `${part + 1}/${total}`, `${total - part}/${total}`, `${part / g}/${total / g + 1}`, `${total}/${part}`, `${Math.max(part - 1, 1)}/${total}`];
      const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `What fraction of ${total} is ${part}? Give your answer in its simplest form.`, options, correctIndex,
        hint: "Write the part over the whole, then simplify by dividing both by their highest common factor.",
        solution: {
          scenario: `We need ${part} as a fraction of ${total}, simplified.`,
          idea: "Part as a fraction of whole = part/whole, then simplify by dividing both by their HCF.",
          method: [`Write ${part}/${total}.`, "Simplify by the highest common factor."],
          steps: [`${part}/${total} simplifies (divide both by ${g}) to ${ans}.`],
          check: `${ans} multiplied back up by ${g} gives ${part}/${total}.`,
        } };
    },
  },
  fraction_of_money: {
    difficulties: [2, 3, 4],
    build(d) {
      const den = d >= 4 ? pick([8, 12, 20]) : pick([4, 5, 10]);
      const n = rand(1, den - 1);
      const unitP = rand(2, 15);
      const totalP = den * unitP;
      const ans = n * unitP;
      const decoys = [totalP, unitP, ans + unitP, totalP - ans].filter((x) => x !== ans && x >= 0);
      const { options, correctIndex } = buildMC(ans, decoys, (x) => (x >= 100 ? `£${(x / 100).toFixed(2)}` : `${x}p`));
      return { q: `What is ${n}/${den} of £${(totalP / 100).toFixed(2)}?`, options, correctIndex,
        hint: "Work in pence first: convert pounds to pence, apply divide-then-multiply, then convert back if needed.",
        solution: {
          scenario: `We need ${n}/${den} of £${(totalP / 100).toFixed(2)}.`,
          idea: "Convert to pence for easier arithmetic, find the fraction, then convert back to pounds.",
          method: ["Convert pounds to pence.", "Divide by the denominator, then multiply by the numerator.", "Convert back to pounds if 100p or more."],
          steps: [`£${(totalP / 100).toFixed(2)} = ${totalP}p.`, `${totalP}p ÷ ${den} = ${unitP}p.`, `${n} × ${unitP}p = ${ans}p${ans >= 100 ? ` = £${(ans / 100).toFixed(2)}` : ""}.`],
          check: `${ans}p × ${den} ÷ ${n} = ${totalP}p.`,
        } };
    },
  },
  missing_numerator: {
    difficulties: [2, 3],
    build(d) {
      const den = d >= 3 ? rand(4, 12) : rand(3, 8);
      const n = rand(1, den - 1);
      const unitPart = rand(2, 20);
      const total = den * unitPart;
      const given = n * unitPart;
      const decoys = [n + 1, n - 1, den - n, unitPart].filter((x) => x !== n && x > 0 && x < den);
      const { options, correctIndex } = buildMC(n, decoys);
      return { q: `?/${den} of ${total} = ${given}. What number goes in place of the ?`, options, correctIndex,
        hint: "Find what ONE part (1/denominator) is worth, then see how many parts fit into the given value.",
        solution: {
          scenario: `?/${den} of ${total} = ${given}, and we need the missing numerator.`,
          idea: "Finding what one part is worth, then seeing how many of those parts make up the given amount, reveals the numerator.",
          method: [`Find 1/${den} of ${total}.`, "Divide the given value by that."],
          steps: [`1/${den} of ${total} = ${unitPart}.`, `${given} ÷ ${unitPart} = ${n}.`],
          check: `${n}/${den} of ${total} = ${given}.`,
        } };
    },
  },
  compare_two_fraction_results: {
    difficulties: [2, 3, 4],
    build(d) {
      const range = d >= 4 ? [6, 12] : [2, 6];
      const den1 = rand(range[0], range[1]), n1 = rand(1, den1 - 1);
      const den2 = rand(range[0], range[1]), n2 = rand(1, den2 - 1);
      const q1 = rand(2, 10) * den1, q2 = rand(2, 10) * den2;
      if (q1 === q2) return null;
      const val1 = (n1 / den1) * q1, val2 = (n2 / den2) * q2;
      if (val1 === val2) return null;
      const wantBigger = pick([true, false]);
      const firstIsAnswer = wantBigger === val1 > val2;
      const ansStr = firstIsAnswer ? `${n1}/${den1} of ${q1}` : `${n2}/${den2} of ${q2}`;
      const otherStr = firstIsAnswer ? `${n2}/${den2} of ${q2}` : `${n1}/${den1} of ${q1}`;
      const candidates = [otherStr, `${n1}/${den1} of ${q2}`, `${n2}/${den2} of ${q1}`, `${n1}/${den1} of ${q1 + q2}`, `${n2}/${den2} of ${q1 + q2}`, `${n1}/${den1} of ${q2 + 1}`];
      const decoys = [...new Set(candidates)].filter((s) => s !== ansStr).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ansStr, decoys);
      return { q: `Which is ${wantBigger ? "bigger" : "smaller"}: ${n1}/${den1} of ${q1}, or ${n2}/${den2} of ${q2}?`, options, correctIndex,
        hint: "Calculate each result separately using divide-then-multiply, then compare. A bigger fraction doesn't automatically give a bigger result — it depends on the quantity too.",
        solution: {
          scenario: `We compare ${n1}/${den1} of ${q1} and ${n2}/${den2} of ${q2}.`,
          idea: "Calculate each fraction of its quantity separately, then compare the results.",
          method: [`Work out ${n1}/${den1} of ${q1}.`, `Work out ${n2}/${den2} of ${q2}.`, "Compare the two results."],
          steps: [`${n1}/${den1} of ${q1} = ${val1}.`, `${n2}/${den2} of ${q2} = ${val2}.`, `The ${wantBigger ? "bigger" : "smaller"} one is ${ansStr}.`],
          check: `${val1} ${val1 > val2 ? ">" : "<"} ${val2}.`,
        } };
    },
  },
  fraction_of_fraction_of_remainder: {
    difficulties: [3, 4],
    build(d) {
      const den1 = rand(2, 5);
      const den2 = d >= 4 ? rand(3, 8) : rand(2, 5);
      const n2 = rand(1, den2 - 1);
      const unitPart1 = rand(2, 12) * den2;
      const total = den1 * unitPart1;
      const takenFirst = unitPart1;
      const remaining = total - takenFirst;
      if (remaining % den2 !== 0) return null;
      const secondUnit = remaining / den2;
      const answer = n2 * secondUnit;
      const decoys = [takenFirst, remaining, secondUnit, answer + secondUnit].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      const item = pick(["marbles", "sweets", "counters"]);
      return { q: `There are ${total} ${item}. First, 1/${den1} are given away. Of what's LEFT, ${n2}/${den2} are then given away too. How many ${item} are given away in the SECOND step?`, options, correctIndex,
        hint: "This is a fraction of what's left question — a two-step problem. Work out the remaining amount after the FIRST fraction is taken, THEN find the fraction of THAT.",
        solution: {
          scenario: `${total} ${item}: 1/${den1} given away first, then ${n2}/${den2} of what's left given away second.`,
          idea: "'A fraction of what's LEFT' always refers to the amount remaining after the first step, not the original total.",
          method: [`Find 1/${den1} of ${total} and subtract it to find what's left.`, `Find ${n2}/${den2} of THAT remaining amount.`],
          steps: [`1/${den1} of ${total} = ${takenFirst}, leaving ${remaining}.`, `${n2}/${den2} of ${remaining} = ${answer}.`],
          check: `${answer} is a valid fraction of the remaining ${remaining}, not of the original ${total}.`,
        } };
    },
  },
  reverse_two_step: {
    difficulties: [4],
    build(d) {
      const den1 = rand(2, 5);
      const den2 = rand(2, 5);
      const finalRemaining = rand(2, 15) * den1 * den2;
      const afterFirstStep = (finalRemaining * den2) / (den2 - 1);
      if (!Number.isInteger(afterFirstStep)) return null;
      const original = (afterFirstStep * den1) / (den1 - 1);
      if (!Number.isInteger(original)) return null;
      const decoys = [afterFirstStep, finalRemaining, original + den1, original - den1].filter((x) => x !== original && x > 0);
      const { options, correctIndex } = buildMC(original, decoys);
      const item = pick(["sweets", "marbles", "counters"]);
      return { q: `${item[0].toUpperCase()}${item.slice(1)} start in a jar. First, 1/${den1} are given away. Then, 1/${den2} of what's LEFT is given away too, leaving exactly ${finalRemaining}. How many ${item} were there at the start?`, options, correctIndex,
        hint: "This is a work backwards through two fraction steps question. Undo the LAST step first, then undo the FIRST step.",
        solution: {
          scenario: `After two rounds of giving away a fraction, ${finalRemaining} ${item} are left. We need the starting amount.`,
          idea: "Undoing fraction-of-remainder steps means working backwards from the end, undoing the LAST step first.",
          method: [`Undo the second step: ${finalRemaining} represents ${den2 - 1}/${den2} of the amount before that step.`, "Undo the first step the same way."],
          steps: [`Before the second step, there were ${afterFirstStep} (since ${finalRemaining} = ${den2 - 1}/${den2} of it).`, `Before the first step (the start), there were ${original} (since ${afterFirstStep} = ${den1 - 1}/${den1} of it).`],
          check: `Removing 1/${den1} from ${original} leaves ${afterFirstStep}, and removing 1/${den2} from that leaves ${finalRemaining}.`,
        } };
    },
  },
  fraction_word_problem_two_groups: {
    difficulties: [4],
    build(d) {
      const den1 = rand(2, 6), n1 = rand(1, den1 - 1);
      const den2 = rand(2, 6), n2 = rand(1, den2 - 1);
      const total1 = den1 * rand(3, 15);
      const total2 = den2 * rand(3, 15);
      const val1 = (n1 / den1) * total1;
      const val2 = (n2 / den2) * total2;
      const combined = val1 + val2;
      const decoys = [val1, val2, total1 + total2, combined + 1].filter((x) => x !== combined && x > 0);
      const { options, correctIndex } = buildMC(combined, decoys);
      const activity = pick(["play football", "walk to school", "bring a packed lunch"]);
      return { q: `Class A has ${total1} pupils, and ${n1}/${den1} of them ${activity}. Class B has ${total2} pupils, and ${n2}/${den2} of them ${activity}. In total, how many pupils across both classes ${activity}?`, options, correctIndex,
        hint: "Work out each fraction of its OWN total separately first, then add the two results together.",
        solution: {
          scenario: `Class A: ${n1}/${den1} of ${total1}. Class B: ${n2}/${den2} of ${total2}. We need the combined total.`,
          idea: "Each fraction applies to its OWN group's total, not to the combined total — so work out each one separately before adding.",
          method: [`Find ${n1}/${den1} of ${total1}.`, `Find ${n2}/${den2} of ${total2}.`, "Add the two results together."],
          steps: [`${n1}/${den1} of ${total1} = ${val1}.`, `${n2}/${den2} of ${total2} = ${val2}.`, `${val1} + ${val2} = ${combined}.`],
          check: `${val1} + ${val2} = ${combined}, the combined total.`,
        } };
    },
  },
};
// Structure registry for fractionEquivalence. Covers constructing an equivalent fraction
// (scale up, simplify, read-from-a-diagram representation), verifying one (cross-multiply
// check — a different reasoning ROUTE from construction), the missing-term chain from both
// directions (numerator vs denominator, and a two-link chain at d4), two comparison
// reasoning routes (same-numerator shortcut, distance-from-a-whole shortcut, common
// denominator, and full decimal-conversion ordering of several fractions).
const FRACTION_EQUIVALENCE_STRUCTURES = {
  scale_to_equivalent: {
    difficulties: [1, 2],
    build(d) {
      const n = rand(1, 6), den = rand(n + 1, 9);
      if (gcd(n, den) !== 1) return null;
      const k = rand(2, 6);
      const bigN = n * k, bigD = den * k;
      const ans = `${bigN}/${bigD}`;
      const candidates = [`${bigN + 1}/${bigD}`, `${bigN}/${bigD + 1}`, `${n + 1}/${den}`, `${bigD}/${bigN}`, `${bigN - 1}/${bigD}`, `${n}/${den + 1}`];
      const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Which fraction is equivalent to ${n}/${den}?`, options, correctIndex,
        hint: "Multiply (or divide) both the numerator and denominator by the same number — the fraction's value doesn't change.",
        solution: {
          scenario: `We need a fraction equivalent to ${n}/${den}.`,
          idea: "Equivalent fractions are made by multiplying or dividing both numerator and denominator by the same non-zero number.",
          method: [`Multiply top and bottom by the same number.`],
          steps: [`${n}×${k} = ${bigN}, ${den}×${k} = ${bigD}.`, `${n}/${den} = ${ans}.`],
          check: `${bigN}/${bigD} simplifies back down to ${n}/${den}.`,
        } };
    },
  },
  simplify_to_lowest_terms: {
    difficulties: [1, 2],
    build(d) {
      const g = rand(2, 6);
      const rn = rand(1, 6), rd = rand(rn + 1, 9);
      if (gcd(rn, rd) !== 1) return null;
      const n = rn * g, den = rd * g;
      const ans = `${rn}/${rd}`;
      const candidates = [`${n}/${den}`, `${rn + 1}/${rd}`, `${rn}/${rd + 1}`, `${rd}/${rn}`, `${rn - 1}/${rd}`, `${rn}/${rd - 1}`];
      const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Simplify ${n}/${den} to its lowest terms.`, options, correctIndex,
        hint: "Divide both the numerator and denominator by their highest common factor.",
        solution: {
          scenario: `We need ${n}/${den} in lowest terms.`,
          idea: "To simplify a fraction, divide both top and bottom by their HCF.",
          method: [`Find the HCF of ${n} and ${den}.`, "Divide both by it."],
          steps: [`The HCF of ${n} and ${den} is ${g}.`, `${n}÷${g} = ${rn}, ${den}÷${g} = ${rd}.`],
          check: `${rn}/${rd} has no common factor left other than 1.`,
        } };
    },
  },
  same_numerator_comparison: {
    difficulties: [1, 2],
    build(d) {
      const n = rand(1, 5);
      const denoms = new Set();
      while (denoms.size < 5) denoms.add(rand(n + 1, 20));
      const arr = [...denoms];
      const wantLarger = pick([true, false]);
      const targetDenom = wantLarger ? Math.min(...arr) : Math.max(...arr);
      const ans = `${n}/${targetDenom}`;
      const decoys = arr.filter((x) => x !== targetDenom).map((x) => `${n}/${x}`);
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Which of these fractions is the ${wantLarger ? "largest" : "smallest"}: ${arr.map((x) => `${n}/${x}`).join(", ")}?`, options, correctIndex,
        hint: "With the same numerator, the SMALLER denominator gives the LARGER fraction — you're dividing into fewer, bigger pieces.",
        solution: {
          scenario: `We compare fractions that all share the numerator ${n}.`,
          idea: "With equal numerators, a smaller denominator means a larger fraction.",
          method: ["Find the smallest (or largest) denominator among the options."],
          steps: [`All have numerator ${n}, so the ${wantLarger ? "smallest" : "largest"} denominator gives the ${wantLarger ? "largest" : "smallest"} fraction.`, `The answer is ${ans}.`],
          check: `${targetDenom} is the ${wantLarger ? "smallest" : "largest"} denominator shown.`,
        } };
    },
  },
  missing_term_in_chain: {
    difficulties: [1, 2],
    build(d) {
      const n = rand(1, 6), den = rand(n + 1, 9);
      if (gcd(n, den) !== 1) return null;
      const k = rand(2, 8);
      const bigD = den * k;
      const answer = n * k;
      const decoys = [bigD, answer + 1, answer - 1, n + k].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `${n}/${den} = ?/${bigD}. What number goes in place of the ?`, options, correctIndex,
        hint: "Work out what the denominator was multiplied by, then multiply the numerator by the same amount.",
        solution: {
          scenario: `${n}/${den} = ?/${bigD}, and we need the missing numerator.`,
          idea: "Equivalent fractions need the same multiplier for both top and bottom.",
          method: [`Find what ${den} was multiplied by to get ${bigD}.`, "Multiply the numerator by the same amount."],
          steps: [`${bigD}÷${den} = ${k}.`, `${n}×${k} = ${answer}.`],
          check: `${n}/${den} = ${answer}/${bigD}.`,
        } };
    },
  },
  read_fraction_from_grid: {
    difficulties: [1, 2],
    build(d) {
      const total = d <= 1 ? rand(4, 12) : rand(6, 24);
      const shaded = rand(1, total - 1);
      const g = gcd(shaded, total);
      const simN = shaded / g, simD = total / g;
      const ans = `${simN}/${simD}`;
      const candidates = [`${shaded}/${total}`, `${simN + 1}/${simD}`, `${simD - simN}/${simD}`, `${simN}/${simD + 1}`, `${simD}/${simN}`, `${Math.max(simN - 1, 1)}/${simD}`];
      const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `${shaded} out of ${total} equal squares in a grid are shaded. What fraction is shaded, in its simplest form?`, options, correctIndex,
        hint: "Write the shaded count over the total count, then simplify.",
        solution: {
          scenario: `${shaded} out of ${total} equal squares are shaded.`,
          idea: "Write the fraction as shaded/total, then simplify by the HCF.",
          method: [`Write ${shaded}/${total}.`, "Simplify."],
          steps: [`${shaded}/${total} simplifies (÷${g}) to ${ans}.`],
          check: `${ans} matches ${shaded} shaded out of ${total} total.`,
        } };
    },
  },
  cross_multiply_check_equivalence: {
    difficulties: [2, 3],
    build(d) {
      const n1 = rand(1, 8), d1v = rand(n1 + 1, 12);
      if (gcd(n1, d1v) !== 1) return null;
      const isEquivalent = pick([true, false]);
      const k = rand(2, 6);
      let n2, d2v;
      if (isEquivalent) { n2 = n1 * k; d2v = d1v * k; }
      else { n2 = n1 * k + pick([-1, 1]); d2v = d1v * k; if (n2 <= 0) n2 = n1 * k + 2; }
      const trueEquivalent = n1 * d2v === n2 * d1v;
      if (trueEquivalent !== isEquivalent) return null;
      const allOptions = ["Yes, they are equivalent", "No, they are not equivalent", "Cannot be determined without a calculator", "Only equivalent if both are simplified first", "Only equivalent if the numerators are equal"];
      const ans = isEquivalent ? "Yes, they are equivalent" : "No, they are not equivalent";
      const decoys = allOptions.filter((s) => s !== ans);
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Are ${n1}/${d1v} and ${n2}/${d2v} equivalent fractions?`, options, correctIndex,
        hint: "Cross-multiply: if n1×d2 equals n2×d1, the fractions are equivalent.",
        solution: {
          scenario: `We check whether ${n1}/${d1v} and ${n2}/${d2v} are equivalent.`,
          idea: "Two fractions are equivalent exactly when cross-multiplying gives the same result both ways.",
          method: [`Multiply ${n1} × ${d2v}.`, `Multiply ${n2} × ${d1v}.`, "Compare."],
          steps: [`${n1} × ${d2v} = ${n1 * d2v}.`, `${n2} × ${d1v} = ${n2 * d1v}.`, `These are ${trueEquivalent ? "equal" : "different"}.`],
          check: `${(n1 / d1v).toFixed(3)} ${trueEquivalent ? "=" : "≠"} ${(n2 / d2v).toFixed(3)} as decimals.`,
        } };
    },
  },
  distance_from_whole_comparison: {
    difficulties: [2, 3],
    build(d) {
      const d1v = rand(3, 9), d2v = rand(3, 9);
      if (d1v === d2v) return null;
      const n1 = d1v - 1, n2 = d2v - 1;
      const wantLarger = pick([true, false]);
      const bigDen = Math.max(d1v, d2v), smallDen = Math.min(d1v, d2v);
      const ans = wantLarger ? `${bigDen - 1}/${bigDen}` : `${smallDen - 1}/${smallDen}`;
      const other = wantLarger ? `${smallDen - 1}/${smallDen}` : `${bigDen - 1}/${bigDen}`;
      const candidates = [other, `${n1}/${d2v}`, `${n2}/${d1v}`, `1/${bigDen}`, `1/${smallDen}`, `${bigDen - 2}/${bigDen}`];
      const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Which is ${wantLarger ? "larger" : "smaller"}: ${n1}/${d1v} or ${n2}/${d2v}?`, options, correctIndex,
        hint: "Each fraction is just one part short of a whole. The one closer to 1 (missing the smaller amount) is larger.",
        solution: {
          scenario: `We compare ${n1}/${d1v} and ${n2}/${d2v}, each one part short of a whole.`,
          idea: "Fractions of the form (n−1)/n are each 1/n short of a whole. The smaller shortfall is the larger fraction.",
          method: [`Work out how far short of a whole each fraction is.`, "The smaller shortfall wins."],
          steps: [`${n1}/${d1v} is 1/${d1v} short of a whole. ${n2}/${d2v} is 1/${d2v} short.`, `The ${wantLarger ? "larger" : "smaller"} fraction is ${ans}.`],
          check: `${(Number(ans.split("/")[0]) / Number(ans.split("/")[1])).toFixed(3)} is closer to 1 than the other option, as expected.`,
        } };
    },
  },
  order_four_mixed_denominators: {
    difficulties: [2, 3, 4],
    build(d) {
      const count = d >= 4 ? 5 : 4;
      const fracs = [];
      const seen = new Set();
      let guard = 0;
      while (fracs.length < count && guard < 300) {
        guard++;
        const dd = rand(2, 12), nn = rand(1, dd - 1);
        if (gcd(nn, dd) !== 1) continue;
        const key = `${nn}/${dd}`;
        if (seen.has(key)) continue;
        seen.add(key);
        fracs.push({ n: nn, d: dd, val: nn / dd });
      }
      if (fracs.length < count) return null;
      const wantLarger = pick([true, false]);
      const target = wantLarger ? fracs.reduce((a, b) => (b.val > a.val ? b : a)) : fracs.reduce((a, b) => (b.val < a.val ? b : a));
      const ans = `${target.n}/${target.d}`;
      const decoys = [...fracs.filter((f) => f !== target).map((f) => `${f.n}/${f.d}`), `${target.d}/${target.n}`].slice(0, 4);
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Which of these fractions is the ${wantLarger ? "largest" : "smallest"}: ${fracs.map((f) => `${f.n}/${f.d}`).join(", ")}?`, options, correctIndex,
        hint: "Convert each to a decimal (numerator ÷ denominator) and compare.",
        solution: {
          scenario: `We compare ${fracs.map((f) => `${f.n}/${f.d}`).join(", ")}.`,
          idea: "To compare fractions with unlike denominators, convert each to a decimal and compare the values.",
          method: ["Convert each fraction to a decimal.", "Compare the decimal values."],
          steps: [`As decimals: ${fracs.map((f) => `${f.n}/${f.d}≈${f.val.toFixed(2)}`).join(", ")}.`, `The ${wantLarger ? "largest" : "smallest"} is ${ans}.`],
          check: `${ans} has the ${wantLarger ? "biggest" : "smallest"} decimal value of the group.`,
        } };
    },
  },
  simplify_multistep: {
    difficulties: [3, 4],
    build(d) {
      const g1 = rand(2, 6), g2 = rand(2, 6);
      const rn = rand(1, 8), rd = rand(rn + 1, 12);
      if (gcd(rn, rd) !== 1) return null;
      const n = rn * g1 * g2, den = rd * g1 * g2;
      const ans = `${rn}/${rd}`;
      const fullGcf = g1 * g2;
      const candidates = [`${n / g1}/${den / g1}`, `${rn + 1}/${rd}`, `${n}/${den}`, `${rd}/${rn}`, `${rn}/${rd + 1}`];
      const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Simplify ${n}/${den} to its lowest terms.`, options, correctIndex,
        hint: "This fraction may need MORE than one round of simplifying. Keep dividing until no common factor remains.",
        solution: {
          scenario: `We need ${n}/${den} in its lowest terms.`,
          idea: "The full highest common factor here is bigger than it might first look — simplifying by a small factor once may still leave room to go further.",
          method: ["Find the full highest common factor (or simplify in stages).", "Divide both by it."],
          steps: [`The highest common factor of ${n} and ${den} is ${fullGcf}.`, `${n} ÷ ${fullGcf} = ${rn}, ${den} ÷ ${fullGcf} = ${rd}.`],
          check: `${rn}/${rd} cannot be simplified any further.`,
        } };
    },
  },
  missing_denominator_reverse: {
    difficulties: [3, 4],
    build(d) {
      const n = rand(1, 6), den = rand(n + 1, 9);
      if (gcd(n, den) !== 1) return null;
      const k = rand(2, 8);
      const bigN = n * k;
      const answer = den * k;
      const decoys = [bigN, answer + k, answer - k, den + k].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `${n}/${den} = ${bigN}/?. What number goes in place of the ?`, options, correctIndex,
        hint: "Work out what the numerator was multiplied by, then apply the same multiplier to the denominator.",
        solution: {
          scenario: `${n}/${den} = ${bigN}/?, and we need the missing denominator.`,
          idea: "Equivalent fractions need the same multiplier on both top and bottom.",
          method: [`Work out what ${n} was multiplied by to get ${bigN}.`, "Multiply the denominator by the same amount."],
          steps: [`${bigN} ÷ ${n} = ${k}.`, `${den} × ${k} = ${answer}.`],
          check: `${n}/${den} = ${bigN}/${answer}.`,
        } };
    },
  },
  compare_via_common_denominator: {
    difficulties: [3, 4],
    build(d) {
      const den1 = rand(2, 6);
      const multiplier = rand(2, 5);
      const den2 = den1 * multiplier;
      const n1 = rand(1, den1 - 1);
      const n2 = rand(1, den2 - 1);
      if (n1 * multiplier === n2) return null;
      const val1 = n1 / den1, val2 = n2 / den2;
      const wantBigger = pick([true, false]);
      const ans = wantBigger === (val1 > val2) ? `${n1}/${den1}` : `${n2}/${den2}`;
      const other = wantBigger === (val1 > val2) ? `${n2}/${den2}` : `${n1}/${den1}`;
      const commonN1 = n1 * multiplier;
      const decoys = [...new Set([other, `${commonN1}/${den2}`, `${n1}/${den2}`, `${n2}/${den1}`])].filter((s) => s !== ans);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Which is ${wantBigger ? "bigger" : "smaller"}: ${n1}/${den1} or ${n2}/${den2}?`, options, correctIndex,
        hint: `Since ${den2} is a multiple of ${den1}, convert ${n1}/${den1} to an equivalent fraction over ${den2}, then compare numerators directly.`,
        solution: {
          scenario: `We compare ${n1}/${den1} and ${n2}/${den2}.`,
          idea: `Since ${den2} is a multiple of ${den1}, converting the first fraction to the same denominator lets you compare numerators directly.`,
          method: [`Convert ${n1}/${den1} to an equivalent fraction over ${den2}.`, "Compare the numerators."],
          steps: [`${n1}/${den1} = ${commonN1}/${den2}.`, `Comparing ${commonN1} and ${n2}: the ${wantBigger ? "bigger" : "smaller"} one wins.`, `The ${wantBigger ? "bigger" : "smaller"} fraction is ${ans}.`],
          check: `${val1.toFixed(3)} ${val1 > val2 ? ">" : "<"} ${val2.toFixed(3)}.`,
        } };
    },
  },
  equivalence_chain_three_steps: {
    difficulties: [4],
    build(d) {
      const n = rand(1, 5), den = rand(n + 1, 8);
      if (gcd(n, den) !== 1) return null;
      const k1 = rand(2, 4), k2 = rand(2, 4);
      const midN = n * k1, midD = den * k1;
      const finalN = midN * k2, finalD = midD * k2;
      const ans = `${midN} and ${finalD}`;
      const decoys = [`${midN + 1} and ${finalD}`, `${midN} and ${finalD + k2}`, `${midN * k2} and ${finalD}`, `${n * k2} and ${den * k1}`].filter((s) => s !== ans);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `${n}/${den} = ?/${midD} = ${finalN}/?. What are the two missing numbers (in order: the missing numerator, then the missing denominator)?`, options, correctIndex,
        hint: "This is a two-link equivalence chain. Work out each link's own multiplier separately — the second link's multiplier comes from the SECOND fraction's numerator.",
        solution: {
          scenario: `${n}/${den} = ?/${midD} = ${finalN}/?, a chain with two missing values.`,
          idea: "Each link in the chain has its own multiplier — find the first link's from the denominators, then the second's from how the numerator changed.",
          method: [`Find the first multiplier from ${den} to ${midD}.`, "Apply it to find the first missing numerator.", "Find the second multiplier from the numerator change.", "Apply it to the middle denominator."],
          steps: [`${midD} ÷ ${den} = ${k1}, so the first missing numerator is ${n} × ${k1} = ${midN}.`, `${finalN} ÷ ${midN} = ${k2}, so the final missing denominator is ${midD} × ${k2} = ${finalD}.`],
          check: `${n}/${den} = ${midN}/${midD} = ${finalN}/${finalD}, all equivalent.`,
        } };
    },
  },
};
// FRACTION_ARITHMETIC_STRUCTURES: adding/subtracting fractions, increasing in complexity to
// unlike denominators and mixed numbers by Y6. Every decoy is filtered by computed NUMERIC
// value (not just string) against the correct answer, since buildMCStr only dedupes on exact
// string match and would otherwise let a same-value-different-text decoy slip through.
const FRACTION_ARITHMETIC_STRUCTURES = {
  same_denom_add: {
    difficulties: [1, 2],
    build(d) {
      const den = d <= 1 ? rand(4, 8) : rand(4, 12);
      const n1 = rand(1, den - 2);
      const n2 = rand(1, den - 1 - n1);
      const sumN = n1 + n2;
      const g = gcd(sumN, den);
      const ansVal = sumN / den;
      const ans = `${sumN / g}/${den / g}`;
      const cands = [
        { s: `${sumN}/${den}`, v: sumN / den },
        { s: `${sumN + 1}/${den}`, v: (sumN + 1) / den },
        { s: `${Math.abs(n1 - n2)}/${den}`, v: Math.abs(n1 - n2) / den },
        { s: `${den - sumN}/${den}`, v: (den - sumN) / den },
        { s: `${n1}/${den}`, v: n1 / den },
        { s: `${n1}/${den * 2}`, v: n1 / (den * 2) },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${n1}/${den} + ${n2}/${den}. Give your answer in its simplest form.`, options, correctIndex,
        hint: "Adding fractions with the same denominator is straightforward: keep the denominator and add the numerators, then simplify if you can.",
        solution: {
          scenario: `We need ${n1}/${den} + ${n2}/${den}, simplified.`,
          idea: "Same denominator: add the numerators and keep the denominator, then simplify.",
          method: ["Add the numerators.", "Keep the denominator the same.", "Simplify if possible."],
          steps: [`${n1}/${den} + ${n2}/${den} = ${sumN}/${den}.`, g > 1 ? `Simplify: ${sumN}/${den} = ${ans}.` : "This is already in simplest form."],
          check: `${g > 1 ? `${ans} scales back up to ${sumN}/${den}, and` : `${sumN}/${den}`} ${sumN} − ${n1} = ${n2}.`,
        } };
    },
  },
  same_denom_subtract: {
    difficulties: [1, 2],
    build(d) {
      const den = d <= 1 ? rand(4, 8) : rand(4, 12);
      const n1 = rand(2, den - 1);
      const n2 = rand(1, n1 - 1);
      const diffN = n1 - n2;
      const g = gcd(diffN, den);
      const ansVal = diffN / den;
      const ans = `${diffN / g}/${den / g}`;
      const cands = [
        { s: `${diffN}/${den}`, v: diffN / den },
        { s: `${n1 + n2}/${den}`, v: (n1 + n2) / den },
        { s: `${diffN + 1}/${den}`, v: (diffN + 1) / den },
        { s: `${Math.max(diffN - 1, 1)}/${den}`, v: Math.max(diffN - 1, 1) / den },
        { s: `${n2}/${den}`, v: n2 / den },
        { s: `${n1}/${den}`, v: n1 / den },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${n1}/${den} − ${n2}/${den}. Give your answer in its simplest form.`, options, correctIndex,
        hint: "Subtracting fractions with the same denominator works the same way as adding: keep the denominator and subtract the numerators, then simplify if you can.",
        solution: {
          scenario: `We need ${n1}/${den} − ${n2}/${den}, simplified.`,
          idea: "Same denominator: subtract the numerators and keep the denominator, then simplify.",
          method: ["Subtract the numerators.", "Keep the denominator the same.", "Simplify if possible."],
          steps: [`${n1}/${den} − ${n2}/${den} = ${diffN}/${den}.`, g > 1 ? `Simplify: ${diffN}/${den} = ${ans}.` : "This is already in simplest form."],
          check: `${n2}/${den} + ${ans === `${diffN}/${den}` ? ans : `${diffN}/${den}`} = ${n1}/${den}.`,
        } };
    },
  },
  mixed_to_improper: {
    difficulties: [1, 2],
    build(d) {
      const den = d <= 1 ? rand(3, 8) : rand(3, 12);
      const whole = rand(1, 6);
      const n = rand(1, den - 1);
      const improperN = whole * den + n;
      const ansVal = improperN / den;
      const ans = `${improperN}/${den}`;
      const cands = [
        { s: `${whole * den}/${den}`, v: (whole * den) / den },
        { s: `${improperN + 1}/${den}`, v: (improperN + 1) / den },
        { s: `${whole + n}/${den}`, v: (whole + n) / den },
        { s: `${improperN}/${den + 1}`, v: improperN / (den + 1) },
        { s: `${improperN - 1}/${den}`, v: (improperN - 1) / den },
        { s: `${whole}/${den}`, v: whole / den },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Write ${whole} ${n}/${den} as an improper fraction.`, options, correctIndex,
        hint: "Multiply the whole number by the denominator to see how many parts it is worth, then add the numerator. The denominator stays the same.",
        solution: {
          scenario: `We need ${whole} ${n}/${den} written as an improper fraction.`,
          idea: "Mixed to improper: multiply the whole number by the denominator, add the numerator, keep the denominator.",
          method: [`Multiply ${whole} by ${den}.`, `Add ${n}.`],
          steps: [`${whole} × ${den} = ${whole * den}.`, `${whole * den} + ${n} = ${improperN}, so the fraction is ${ans}.`],
          check: `${improperN} ÷ ${den} = ${whole} remainder ${n}.`,
        } };
    },
  },
  improper_to_mixed: {
    difficulties: [1, 2],
    build(d) {
      const den = d <= 1 ? rand(3, 8) : rand(3, 12);
      const whole = rand(1, 6);
      const n = rand(1, den - 1);
      const improperN = whole * den + n;
      const ansVal = whole + n / den;
      const ans = `${whole} ${n}/${den}`;
      const cands = [
        { s: `${whole + 1} ${n}/${den}`, v: whole + 1 + n / den },
        { s: `${whole} ${n + 1}/${den}`, v: whole + (n + 1) / den },
        { s: `${Math.floor(improperN / den) + 1} ${n}/${den}`, v: Math.floor(improperN / den) + 1 + n / den },
        { s: `${whole} ${den - n}/${den}`, v: whole + (den - n) / den },
        { s: `${Math.max(whole - 1, 0)} ${n}/${den}`, v: Math.max(whole - 1, 0) + n / den },
        { s: `${whole} ${Math.max(n - 1, 1)}/${den}`, v: whole + Math.max(n - 1, 1) / den },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Write ${improperN}/${den} as a mixed number.`, options, correctIndex,
        hint: "Divide the numerator by the denominator. The quotient is the whole number part; the remainder over the denominator is the fraction part.",
        solution: {
          scenario: `We need ${improperN}/${den} written as a mixed number.`,
          idea: "Improper to mixed: divide numerator by denominator. The quotient is the whole number; the remainder over the denominator is the fraction.",
          method: [`Divide ${improperN} by ${den}.`],
          steps: [`${improperN} ÷ ${den} = ${whole} remainder ${n}.`, `So ${improperN}/${den} = ${ans}.`],
          check: `${whole} × ${den} + ${n} = ${improperN}.`,
        } };
    },
  },
  missing_addend_same_denom: {
    difficulties: [1, 2, 3],
    build(d) {
      const den = d <= 2 ? rand(4, 8) : rand(5, 12);
      const target = rand(3, den - 1);
      const known = rand(1, target - 1);
      const missing = target - known;
      const ansVal = missing / den;
      const ans = `${missing}/${den}`;
      const cands = [
        { s: `${target}/${den}`, v: target / den },
        { s: `${target + known}/${den}`, v: (target + known) / den },
        { s: `${known}/${den}`, v: known / den },
        { s: `${missing + 1}/${den}`, v: (missing + 1) / den },
        { s: `${Math.max(missing - 1, 1)}/${den}`, v: Math.max(missing - 1, 1) / den },
        { s: `${den - known}/${den}`, v: (den - known) / den },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `?/${den} + ${known}/${den} = ${target}/${den}. What fraction goes in place of the ?`, options, correctIndex,
        hint: "The denominators already match, so this is really just a missing-numerator puzzle: what do you add to the known numerator to reach the target numerator?",
        solution: {
          scenario: `We need the missing fraction so that ?/${den} + ${known}/${den} = ${target}/${den}.`,
          idea: "With matching denominators, subtract the known numerator from the target numerator to find the missing numerator.",
          method: [`Subtract ${known} from ${target}.`, `Keep the denominator ${den}.`],
          steps: [`${target} − ${known} = ${missing}.`, `So the missing fraction is ${ans}.`],
          check: `${ans} + ${known}/${den} = ${target}/${den}.`,
        } };
    },
  },
  add_bridging_whole: {
    difficulties: [2, 3],
    build(d) {
      const den = d <= 2 ? rand(4, 8) : rand(6, 10);
      const whole = rand(1, 4);
      const n1 = rand(Math.max(1, den - 3), den - 1);
      const n2 = rand(2, den - 1);
      if (n1 + n2 <= den) return null;
      const carry = Math.floor((n1 + n2) / den);
      const remN = (n1 + n2) % den;
      const newWhole = whole + carry;
      const ansVal = newWhole + remN / den;
      const ans = remN === 0 ? `${newWhole}` : `${newWhole} ${remN}/${den}`;
      const fp = (w, r) => (r ? `${w} ${r}/${den}` : `${w}`);
      const cands = [
        { s: fp(whole, n1 + n2), v: whole + (n1 + n2) / den },
        { s: fp(newWhole + 1, remN), v: newWhole + 1 + remN / den },
        { s: fp(newWhole, Math.min(remN + 1, den - 1)), v: newWhole + Math.min(remN + 1, den - 1) / den },
        { s: fp(whole + 1, remN), v: whole + 1 + remN / den },
        { s: fp(Math.max(newWhole - 1, 0), remN), v: Math.max(newWhole - 1, 0) + remN / den },
        { s: fp(carry, remN), v: carry + remN / den },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${whole} ${n1}/${den} + ${n2}/${den}.`, options, correctIndex,
        hint: "When the two fraction parts add to more than one whole, you need to carry a whole number across. Add the numerators, turn the result into a whole-plus-remainder, then add that whole to the one you already had.",
        solution: {
          scenario: `We need ${whole} ${n1}/${den} + ${n2}/${den}.`,
          idea: "If the fractional parts add to a value greater than 1, convert that overflow into a whole number and add it on top.",
          method: ["Add the numerators.", "Convert the result to a whole number plus a remainder fraction.", "Add the whole number part to the whole you started with."],
          steps: [`${n1}/${den} + ${n2}/${den} = ${n1 + n2}/${den}, which is more than one whole.`, `${n1 + n2}/${den} = ${carry} whole${carry > 1 ? "s" : ""}${remN ? ` and ${remN}/${den}` : ""}.`, `${whole} + ${carry} = ${newWhole}, so the total is ${ans}.`],
          check: `${ans} − ${whole} ${n1}/${den} = ${n2}/${den}.`,
        } };
    },
  },
  subtract_borrow_whole: {
    difficulties: [2, 3],
    build(d) {
      const den = d <= 2 ? rand(4, 8) : rand(6, 10);
      const whole = rand(2, 5);
      const n1 = rand(1, den - 2);
      const n2 = rand(n1 + 1, den - 1);
      const borrowWhole = whole - 1;
      const borrowedN = n1 + den;
      const remN = borrowedN - n2;
      const ansVal = borrowWhole + remN / den;
      const ans = `${borrowWhole} ${remN}/${den}`;
      const cands = [
        { s: `${whole} ${Math.abs(n1 - n2)}/${den}`, v: whole + Math.abs(n1 - n2) / den },
        { s: `${whole - 1} ${remN + 1}/${den}`, v: whole - 1 + (remN + 1) / den },
        { s: `${Math.max(whole - 2, 0)} ${remN}/${den}`, v: Math.max(whole - 2, 0) + remN / den },
        { s: `${borrowWhole + 1} ${remN}/${den}`, v: borrowWhole + 1 + remN / den },
        { s: `${whole} ${remN}/${den}`, v: whole + remN / den },
        { s: `${borrowWhole} ${Math.max(remN - 1, 0)}/${den}`, v: borrowWhole + Math.max(remN - 1, 0) / den },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${whole} ${n1}/${den} − ${n2}/${den}.`, options, correctIndex,
        hint: "The fraction you're taking away is bigger than the one you have, so borrow one whole from the whole number part first. One whole equals the denominator over itself, so add that to your fraction before subtracting.",
        solution: {
          scenario: `We need ${whole} ${n1}/${den} − ${n2}/${den}.`,
          idea: "If the fraction being subtracted is larger than the fraction you have, borrow one whole from the whole number, turn it into a fraction, then subtract.",
          method: [`Borrow one whole from ${whole}, leaving ${borrowWhole}.`, `Add that whole (as ${den}/${den}) to ${n1}/${den}.`, "Subtract the numerators."],
          steps: [`${n1}/${den} is smaller than ${n2}/${den}, so borrow one whole from ${whole}.`, `${whole} ${n1}/${den} = ${borrowWhole} ${borrowedN}/${den}.`, `${borrowedN}/${den} − ${n2}/${den} = ${remN}/${den}, so the answer is ${ans}.`],
          check: `${ans} + ${n2}/${den} = ${whole} ${n1}/${den}.`,
        } };
    },
  },
  add_related_denom: {
    difficulties: [2, 3],
    build(d) {
      const smallD = d <= 2 ? rand(2, 5) : rand(2, 6);
      const mult = d <= 2 ? rand(2, 3) : rand(2, 4);
      const bigD = smallD * mult;
      const n1 = rand(1, smallD - 1);
      const n2 = rand(1, bigD - 1);
      const n1Scaled = n1 * mult;
      const sumN = n1Scaled + n2;
      const g = gcd(sumN, bigD);
      const ansVal = sumN / bigD;
      const ans = g > 1 ? `${sumN / g}/${bigD / g}` : `${sumN}/${bigD}`;
      const cands = [
        { s: `${n1 + n2}/${bigD}`, v: (n1 + n2) / bigD },
        { s: `${sumN}/${bigD}`, v: sumN / bigD },
        { s: `${sumN + 1}/${bigD}`, v: (sumN + 1) / bigD },
        { s: `${n1Scaled}/${bigD}`, v: n1Scaled / bigD },
        { s: `${n2}/${bigD}`, v: n2 / bigD },
        { s: `${sumN}/${smallD + bigD}`, v: sumN / (smallD + bigD) },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${n1}/${smallD} + ${n2}/${bigD}. Give your answer in its simplest form.`, options, correctIndex,
        hint: "One denominator is a multiple of the other, so you only need to scale up the fraction with the smaller denominator to match, then add as normal.",
        solution: {
          scenario: `We need ${n1}/${smallD} + ${n2}/${bigD}, simplified.`,
          idea: "When one denominator is a multiple of the other, convert only the smaller-denominator fraction to match, then add.",
          method: [`Work out how many times ${smallD} divides into ${bigD}.`, `Scale ${n1}/${smallD} up to ${bigD}ths.`, "Add the numerators."],
          steps: [`${bigD} ÷ ${smallD} = ${mult}, so ${n1}/${smallD} = ${n1Scaled}/${bigD}.`, `${n1Scaled}/${bigD} + ${n2}/${bigD} = ${sumN}/${bigD}.`, g > 1 ? `Simplify: ${ans}.` : "Already in simplest form."],
          check: `${ans === `${sumN}/${bigD}` ? ans : `${sumN}/${bigD}`} scales back down to ${ans}.`,
        } };
    },
  },
  subtract_related_denom: {
    difficulties: [2, 3, 4],
    build(d) {
      const smallD = d <= 2 ? rand(2, 5) : d === 3 ? rand(2, 6) : rand(2, 8);
      const mult = d <= 2 ? rand(2, 3) : rand(2, 5);
      const bigD = smallD * mult;
      const n1 = rand(1, smallD - 1);
      const n1Scaled = n1 * mult;
      if (n1Scaled < 2) return null;
      const n2 = rand(1, n1Scaled - 1);
      const diffN = n1Scaled - n2;
      const g = gcd(diffN, bigD);
      const ansVal = diffN / bigD;
      const ans = g > 1 ? `${diffN / g}/${bigD / g}` : `${diffN}/${bigD}`;
      const cands = [
        { s: `${Math.abs(n1 - n2)}/${bigD}`, v: Math.abs(n1 - n2) / bigD },
        { s: `${diffN}/${bigD}`, v: diffN / bigD },
        { s: `${diffN + 1}/${bigD}`, v: (diffN + 1) / bigD },
        { s: `${n1Scaled}/${bigD}`, v: n1Scaled / bigD },
        { s: `${n2}/${bigD}`, v: n2 / bigD },
        { s: `${diffN}/${smallD + bigD}`, v: diffN / (smallD + bigD) },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${n1}/${smallD} − ${n2}/${bigD}. Give your answer in its simplest form.`, options, correctIndex,
        hint: "One denominator is a multiple of the other, so scale the fraction with the smaller denominator up to match before subtracting.",
        solution: {
          scenario: `We need ${n1}/${smallD} − ${n2}/${bigD}, simplified.`,
          idea: "When one denominator is a multiple of the other, convert only the smaller-denominator fraction to match, then subtract.",
          method: [`Work out how many times ${smallD} divides into ${bigD}.`, `Scale ${n1}/${smallD} up to ${bigD}ths.`, "Subtract the numerators."],
          steps: [`${bigD} ÷ ${smallD} = ${mult}, so ${n1}/${smallD} = ${n1Scaled}/${bigD}.`, `${n1Scaled}/${bigD} − ${n2}/${bigD} = ${diffN}/${bigD}.`, g > 1 ? `Simplify: ${ans}.` : "Already in simplest form."],
          check: `${ans} + ${n2}/${bigD} = ${n1Scaled}/${bigD}.`,
        } };
    },
  },
  add_mixed_related_denom: {
    difficulties: [3, 4],
    build(d) {
      const smallD = d <= 3 ? rand(2, 5) : rand(2, 6);
      const mult = d <= 3 ? rand(2, 3) : rand(2, 4);
      const bigD = smallD * mult;
      const whole1 = rand(1, 4), whole2 = rand(1, 4);
      const n1 = rand(1, smallD - 1);
      const n2 = rand(1, bigD - 1);
      const n1Scaled = n1 * mult;
      const sumN = n1Scaled + n2;
      const carry = Math.floor(sumN / bigD);
      const remN = sumN % bigD;
      const g = remN > 0 ? gcd(remN, bigD) : 1;
      const newWhole = whole1 + whole2 + carry;
      const ansVal = newWhole + remN / bigD;
      const fracPart = remN === 0 ? "" : ` ${remN / g}/${bigD / g}`;
      const ans = `${newWhole}${fracPart}`;
      const fp = (w, r) => (r ? `${w} ${r}/${bigD}` : `${w}`);
      const cands = [
        { s: fp(whole1 + whole2, n1 + n2), v: whole1 + whole2 + (n1 + n2) / bigD },
        { s: fp(whole1 + whole2, sumN), v: whole1 + whole2 + sumN / bigD },
        { s: fp(newWhole, Math.min(remN + 1, bigD - 1)), v: newWhole + Math.min(remN + 1, bigD - 1) / bigD },
        { s: fp(newWhole + 1, remN), v: newWhole + 1 + remN / bigD },
        { s: fp(whole2 + carry, remN), v: whole2 + carry + remN / bigD },
        { s: fp(newWhole, remN), v: newWhole + remN / bigD },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${whole1} ${n1}/${smallD} + ${whole2} ${n2}/${bigD}.`, options, correctIndex,
        hint: "First scale the smaller-denominator fraction to match, then add the two fraction parts. If that total is a whole or more, carry it across to the whole numbers.",
        solution: {
          scenario: `We need ${whole1} ${n1}/${smallD} + ${whole2} ${n2}/${bigD}.`,
          idea: "Scale to a common denominator first, add the fraction parts, then carry any whole-number overflow into the whole-number total.",
          method: [`Scale ${n1}/${smallD} up to ${bigD}ths.`, "Add the fraction parts.", "Carry any whole number out of the fraction total, then add the two whole numbers."],
          steps: [`${bigD} ÷ ${smallD} = ${mult}, so ${n1}/${smallD} = ${n1Scaled}/${bigD}.`, `${n1Scaled}/${bigD} + ${n2}/${bigD} = ${sumN}/${bigD}${carry ? `, which is ${carry} whole${carry > 1 ? "s" : ""}${remN ? ` and ${remN}/${bigD}` : ""}` : ""}.`, `${whole1} + ${whole2}${carry ? ` + ${carry}` : ""} = ${newWhole}, so the total is ${ans}.`],
          check: `${ans} − ${whole2} ${n2}/${bigD} = ${whole1} ${n1}/${smallD}.`,
        } };
    },
  },
  subtract_mixed_unlike_denom_borrow: {
    difficulties: [3, 4],
    build(d) {
      const smallD = d <= 3 ? rand(2, 5) : rand(2, 6);
      const mult = d <= 3 ? rand(2, 3) : rand(2, 4);
      const bigD = smallD * mult;
      const whole1 = rand(3, 6);
      const whole2 = rand(1, whole1 - 1);
      const n1 = rand(1, smallD - 1);
      const n2 = rand(1, bigD - 1);
      const n1Scaled = n1 * mult;
      if (n1Scaled >= n2) return null;
      const borrowWhole = whole1 - 1;
      if (borrowWhole < whole2) return null;
      const borrowedN = n1Scaled + bigD;
      const remN = borrowedN - n2;
      const resWhole = borrowWhole - whole2;
      const g = gcd(remN, bigD);
      const ansVal = resWhole + remN / bigD;
      const ans = `${resWhole} ${remN / g}/${bigD / g}`;
      const cands = [
        { s: `${whole1 - whole2} ${Math.abs(n1Scaled - n2)}/${bigD}`, v: whole1 - whole2 + Math.abs(n1Scaled - n2) / bigD },
        { s: `${resWhole + 1} ${remN}/${bigD}`, v: resWhole + 1 + remN / bigD },
        { s: `${resWhole} ${Math.max(remN - 1, 0)}/${bigD}`, v: resWhole + Math.max(remN - 1, 0) / bigD },
        { s: `${Math.max(resWhole - 1, 0)} ${remN}/${bigD}`, v: Math.max(resWhole - 1, 0) + remN / bigD },
        { s: `${resWhole} ${remN}/${smallD + bigD}`, v: resWhole + remN / (smallD + bigD) },
        { s: `${whole1 - whole2 - 1} ${remN}/${bigD}`, v: whole1 - whole2 - 1 + remN / bigD },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${whole1} ${n1}/${smallD} − ${whole2} ${n2}/${bigD}.`, options, correctIndex,
        hint: "Scale the smaller-denominator fraction to match first. If the fraction you're taking away is still bigger than the one you have, borrow one whole from the first mixed number before subtracting.",
        solution: {
          scenario: `We need ${whole1} ${n1}/${smallD} − ${whole2} ${n2}/${bigD}.`,
          idea: "Scale to a common denominator first. If the fraction being subtracted is still larger, borrow one whole and add it to the fraction before subtracting.",
          method: [`Scale ${n1}/${smallD} up to ${bigD}ths.`, `Borrow one whole from ${whole1} if the fraction is too small.`, "Subtract the fractions, then the whole numbers."],
          steps: [`${bigD} ÷ ${smallD} = ${mult}, so ${n1}/${smallD} = ${n1Scaled}/${bigD}.`, `${n1Scaled}/${bigD} is smaller than ${n2}/${bigD}, so borrow one whole: ${whole1} ${n1Scaled}/${bigD} = ${borrowWhole} ${borrowedN}/${bigD}.`, `${borrowedN}/${bigD} − ${n2}/${bigD} = ${remN}/${bigD}, and ${borrowWhole} − ${whole2} = ${resWhole}, so the answer is ${ans}.`],
          check: `${ans} + ${whole2} ${n2}/${bigD} = ${whole1} ${n1}/${smallD}.`,
        } };
    },
  },
  missing_addend_unlike_denom: {
    difficulties: [3, 4],
    build(d) {
      const den1 = d <= 3 ? rand(3, 6) : rand(3, 8);
      const den2 = d <= 3 ? rand(3, 6) : rand(3, 8);
      if (den1 === den2) return null;
      const lcm = (den1 * den2) / gcd(den1, den2);
      const knownNum = rand(1, den1 - 1);
      const targetNum = rand(1, den2 - 1);
      const knownScaled = knownNum * (lcm / den1);
      const targetScaled = targetNum * (lcm / den2);
      if (targetScaled <= knownScaled) return null;
      const missingScaled = targetScaled - knownScaled;
      const g = gcd(missingScaled, lcm);
      const ansVal = missingScaled / lcm;
      const ans = `${missingScaled / g}/${lcm / g}`;
      const cands = [
        { s: `${targetNum}/${den2}`, v: targetNum / den2 },
        { s: `${knownNum}/${den1}`, v: knownNum / den1 },
        { s: `${targetScaled - knownNum}/${lcm}`, v: (targetScaled - knownNum) / lcm },
        { s: `${missingScaled + 1}/${lcm}`, v: (missingScaled + 1) / lcm },
        { s: `${Math.max(missingScaled - 1, 1)}/${lcm}`, v: Math.max(missingScaled - 1, 1) / lcm },
        { s: `${targetScaled + knownScaled}/${lcm}`, v: (targetScaled + knownScaled) / lcm },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `${knownNum}/${den1} + ? = ${targetNum}/${den2}. What fraction goes in place of the ?, in its simplest form?`, options, correctIndex,
        hint: "The denominators don't match, so first convert both fractions to a common denominator. Then it's a straightforward missing-numerator subtraction.",
        solution: {
          scenario: `We need the missing fraction so that ${knownNum}/${den1} + ? = ${targetNum}/${den2}.`,
          idea: "Convert both fractions to a common denominator, then subtract the known numerator from the target numerator.",
          method: [`Find a common denominator for ${den1} and ${den2}.`, "Convert both fractions to that denominator.", "Subtract the known scaled numerator from the target scaled numerator."],
          steps: [`${den1} and ${den2} share a common denominator of ${lcm}.`, `${knownNum}/${den1} = ${knownScaled}/${lcm} and ${targetNum}/${den2} = ${targetScaled}/${lcm}.`, `${targetScaled} − ${knownScaled} = ${missingScaled}, so the missing fraction is ${missingScaled}/${lcm}${g > 1 ? ` = ${ans}` : ""}.`],
          check: `${ans} + ${knownNum}/${den1} = ${targetNum}/${den2}.`,
        } };
    },
  },
  estimate_sum_comparison: {
    difficulties: [3, 4],
    build(d) {
      const den1 = rand(3, 9), den2 = rand(3, 9);
      const whole1 = rand(1, 5), whole2 = rand(1, 5);
      const n1 = rand(1, den1 - 1), n2 = rand(1, den2 - 1);
      const exact = whole1 + n1 / den1 + whole2 + n2 / den2;
      if (Math.abs(exact - Math.round(exact)) < 1e-9) return null;
      const lower = Math.floor(exact), upper = lower + 1;
      const ans = `${lower} and ${upper}`;
      const contains = (lo, hi) => exact >= lo && exact <= hi;
      const bandCands = [[lower - 2, lower - 1], [lower - 1, lower], [upper, upper + 1], [upper + 1, upper + 2]];
      const decoys = [];
      for (const [lo, hi] of bandCands) {
        if (lo < 0) continue;
        if (contains(lo, hi)) continue;
        decoys.push(`${lo} and ${hi}`);
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `${whole1} ${n1}/${den1} + ${whole2} ${n2}/${den2} lies between which two consecutive whole numbers?`, options, correctIndex,
        hint: "You don't need the exact answer here: add the whole numbers first, then think about whether the two fraction parts together add up to less than one whole or more than one whole.",
        solution: {
          scenario: `We need to place ${whole1} ${n1}/${den1} + ${whole2} ${n2}/${den2} between two consecutive whole numbers.`,
          idea: "Add the whole numbers first, then decide whether the two fraction parts together push the total past the next whole number.",
          method: [`Add the whole numbers: ${whole1} + ${whole2}.`, "Estimate whether the two fraction parts together add to more or less than 1."],
          steps: [`${whole1} + ${whole2} = ${whole1 + whole2}.`, `${n1}/${den1} + ${n2}/${den2} is worth ${(n1 / den1 + n2 / den2).toFixed(2)} on its own, so the exact total is ${exact.toFixed(2)}.`, `That lies between ${lower} and ${upper}.`],
          check: `${lower} < ${exact.toFixed(2)} < ${upper}.`,
        } };
    },
  },
  add_fully_unlike_denom: {
    difficulties: [4],
    build(d) {
      let den1, den2, tries = 0;
      do {
        den1 = rand(3, 9); den2 = rand(3, 9); tries++;
        if (tries > 30) return null;
      } while (den1 === den2 || den1 % den2 === 0 || den2 % den1 === 0);
      const lcm = (den1 * den2) / gcd(den1, den2);
      const n1 = rand(1, den1 - 1), n2 = rand(1, den2 - 1);
      const n1s = n1 * (lcm / den1), n2s = n2 * (lcm / den2);
      const sumN = n1s + n2s;
      const g = gcd(sumN, lcm);
      const ansVal = sumN / lcm;
      const ans = `${sumN / g}/${lcm / g}`;
      const cands = [
        { s: `${n1 + n2}/${lcm}`, v: (n1 + n2) / lcm },
        { s: `${n1s + n2s}/${den1 * den2}`, v: sumN / (den1 * den2) },
        { s: `${sumN + 1}/${lcm}`, v: (sumN + 1) / lcm },
        { s: `${n1s}/${lcm}`, v: n1s / lcm },
        { s: `${n2s}/${lcm}`, v: n2s / lcm },
        { s: `${sumN}/${den1 + den2}`, v: sumN / (den1 + den2) },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${n1}/${den1} + ${n2}/${den2}. Give your answer in its simplest form.`, options, correctIndex,
        hint: "Neither denominator is a multiple of the other, so find their lowest common multiple first, scale both fractions to it, then add.",
        solution: {
          scenario: `We need ${n1}/${den1} + ${n2}/${den2}, simplified.`,
          idea: "When neither denominator divides the other, find their lowest common multiple, convert both fractions to it, then add.",
          method: [`Find the lowest common multiple of ${den1} and ${den2}.`, "Scale both fractions to that denominator.", "Add the numerators."],
          steps: [`The lowest common multiple of ${den1} and ${den2} is ${lcm}.`, `${n1}/${den1} = ${n1s}/${lcm} and ${n2}/${den2} = ${n2s}/${lcm}.`, `${n1s}/${lcm} + ${n2s}/${lcm} = ${sumN}/${lcm}${g > 1 ? `, which simplifies to ${ans}` : ""}.`],
          check: `${ans === `${sumN}/${lcm}` ? ans : `${sumN}/${lcm}`} scales back down to ${ans}.`,
        } };
    },
  },
  subtract_fully_unlike_denom: {
    difficulties: [4],
    build(d) {
      let den1, den2, tries = 0;
      do {
        den1 = rand(3, 9); den2 = rand(3, 9); tries++;
        if (tries > 30) return null;
      } while (den1 === den2 || den1 % den2 === 0 || den2 % den1 === 0);
      const lcm = (den1 * den2) / gcd(den1, den2);
      const n1 = rand(1, den1 - 1), n2 = rand(1, den2 - 1);
      const n1s = n1 * (lcm / den1), n2s = n2 * (lcm / den2);
      if (n1s === n2s) return null;
      const big = n1s > n2s ? { n: n1, den: den1, s: n1s } : { n: n2, den: den2, s: n2s };
      const small = n1s > n2s ? { n: n2, den: den2, s: n2s } : { n: n1, den: den1, s: n1s };
      const diffN = big.s - small.s;
      const g = gcd(diffN, lcm);
      const ansVal = diffN / lcm;
      const ans = `${diffN / g}/${lcm / g}`;
      const cands = [
        { s: `${Math.abs(big.n - small.n)}/${lcm}`, v: Math.abs(big.n - small.n) / lcm },
        { s: `${diffN}/${den1 * den2}`, v: diffN / (den1 * den2) },
        { s: `${diffN + 1}/${lcm}`, v: (diffN + 1) / lcm },
        { s: `${big.s}/${lcm}`, v: big.s / lcm },
        { s: `${small.s}/${lcm}`, v: small.s / lcm },
        { s: `${diffN}/${den1 + den2}`, v: diffN / (den1 + den2) },
      ];
      const seenStr = new Set([ans]), seenVal = [ansVal], decoys = [];
      for (const c of cands) {
        if (seenStr.has(c.s) || seenVal.some((v) => Math.abs(v - c.v) < 1e-9)) continue;
        seenStr.add(c.s); seenVal.push(c.v); decoys.push(c.s);
        if (decoys.length === 4) break;
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Work out ${big.n}/${big.den} − ${small.n}/${small.den}. Give your answer in its simplest form.`, options, correctIndex,
        hint: "Neither denominator is a multiple of the other, so find their lowest common multiple first, scale both fractions to it, then subtract.",
        solution: {
          scenario: `We need ${big.n}/${big.den} − ${small.n}/${small.den}, simplified.`,
          idea: "When neither denominator divides the other, find their lowest common multiple, convert both fractions to it, then subtract.",
          method: [`Find the lowest common multiple of ${big.den} and ${small.den}.`, "Scale both fractions to that denominator.", "Subtract the numerators."],
          steps: [`The lowest common multiple of ${big.den} and ${small.den} is ${lcm}.`, `${big.n}/${big.den} = ${big.s}/${lcm} and ${small.n}/${small.den} = ${small.s}/${lcm}.`, `${big.s}/${lcm} − ${small.s}/${lcm} = ${diffN}/${lcm}${g > 1 ? `, which simplifies to ${ans}` : ""}.`],
          check: `${ans === `${diffN}/${lcm}` ? ans : `${diffN}/${lcm}`} + ${small.n}/${small.den} scales back to ${big.n}/${big.den}.`,
        } };
    },
  },
  multiply_fractions: {
    difficulties: [2, 3, 4],
    curriculum: "KS2 multiplying proper fractions using a fraction of a fraction",
    build(d) {
      const a = rand(1, d + 1), b = rand(2, d + 4), c = rand(1, d + 1), e = rand(2, d + 4);
      if (a >= b || c >= e) return null;
      const rawN = a * c, rawD = b * e, common = gcd(rawN, rawD), n = rawN / common, den = rawD / common;
      const answer = `${n}/${den}`;
      const { options, correctIndex } = buildMCStr(answer, [`${a + c}/${b + e}`, `${rawN}/${b + e}`, `${a * e}/${b * c}`, `${rawN + 1}/${rawD}`, `${rawN + 2}/${rawD}`, `${rawN}/${rawD + 1}`, `${a + c + 1}/${b + e}`].filter((value) => value !== answer));
      return { q: `Work out ${a}/${b} × ${c}/${e}. Give the answer in its simplest form.`, options, correctIndex,
        hint: "Multiply the numerators, multiply the denominators, then simplify.",
        solution: { scenario: `We need ${a}/${b} of ${c}/${e}.`, idea: "Multiplying fractions finds a part of a part.", method: ["Multiply the two numerators.", "Multiply the two denominators.", "Simplify the resulting fraction."], steps: [`${a} × ${c} = ${rawN}.`, `${b} × ${e} = ${rawD}.`, `${rawN}/${rawD}${common > 1 ? ` simplifies by dividing top and bottom by ${common}` : " is already simplest"}, giving ${answer}.`], check: "A fraction of a proper fraction must be smaller than either original fraction." } };
    },
  },
  divide_fraction_by_whole: {
    difficulties: [2, 3, 4],
    curriculum: "KS2 dividing proper fractions by whole numbers",
    build(d) {
      const den = rand(3, 10), n = rand(1, den - 1), divisor = rand(2, d + 3);
      const rawD = den * divisor, common = gcd(n, rawD), answer = `${n / common}/${rawD / common}`;
      const { options, correctIndex } = buildMCStr(answer, [`${n * divisor}/${den}`, `${n}/${den + divisor}`, `${Math.max(1, n - 1)}/${rawD}`, `${n}/${rawD + divisor}`, `${n + 1}/${rawD}`, `${n}/${rawD + 1}`, `${n * divisor + 1}/${den}`].filter((value) => value !== answer));
      return { q: `Work out ${n}/${den} ÷ ${divisor}. Give the answer in its simplest form.`, options, correctIndex,
        hint: `Dividing by ${divisor} means sharing the fraction into ${divisor} equal parts, so multiply its denominator by ${divisor}.`,
        solution: { scenario: `${n}/${den} is shared into ${divisor} equal parts.`, idea: "Dividing a fraction by a whole number makes each piece that many times smaller.", method: ["Keep the numerator.", `Multiply the denominator by ${divisor}.`, "Simplify if possible."], steps: [`${n}/${den} ÷ ${divisor} = ${n}/(${den} × ${divisor}) = ${n}/${rawD}.`, `${n}/${rawD}${common > 1 ? ` simplifies to ${answer}` : " is already simplest"}.`], check: `${answer} × ${divisor} returns to ${n}/${den}.` } };
    },
  },
  fraction_of_fraction_context: {
    difficulties: [3, 4],
    curriculum: "KS2 multi-step fraction reasoning",
    build(d) {
      const firstN = rand(1, 3), firstD = rand(firstN + 1, 6), secondN = rand(1, 3), secondD = rand(secondN + 1, 6);
      const rawN = firstN * secondN, rawD = firstD * secondD, common = gcd(rawN, rawD), answer = `${rawN / common}/${rawD / common}`;
      const { options, correctIndex } = buildMCStr(answer, [`${firstN + secondN}/${firstD + secondD}`, `${rawN}/${firstD + secondD}`, `${firstN * secondD}/${firstD * secondN}`, `${rawN + 1}/${rawD}`, `${rawN + 2}/${rawD}`, `${rawN}/${rawD + 1}`, `${firstN + secondN + 1}/${firstD + secondD}`].filter((value) => value !== answer));
      return { q: `${firstN}/${firstD} of the Ninefold seed store is for spring. ${secondN}/${secondD} of that spring seed is for Row Four. What fraction of the whole store is for Row Four?`, options, correctIndex,
        hint: "The second fraction is a fraction of the first fraction, so multiply.",
        solution: { scenario: `We need ${secondN}/${secondD} of ${firstN}/${firstD}.`, idea: "A fraction of a fraction is multiplication.", method: ["Write the two fractions as a product.", "Multiply tops and bottoms.", "Simplify and interpret the result as a fraction of the whole."], steps: [`${secondN}/${secondD} × ${firstN}/${firstD} = ${rawN}/${rawD}.`, `${rawN}/${rawD}${common > 1 ? ` simplifies to ${answer}` : " is already simplest"}.`], check: "The Row Four share is only part of the spring share, so it must be smaller." } };
    },
  },
};

// RATIO_BASICS_STRUCTURES: ten structures covering the genre's genuinely distinct reasoning
// routes. Deliberately NOT included: the old "scale a recipe for N people" / "unitary-method
// cost scaling" pair, which were the exact same unit-rate computation with only the scenario
// noun swapped — that logic now lives ONCE, in unitary_scale_match_one_quantity.
const RATIO_BASICS_STRUCTURES = {
  scale_ratio_by_given_factor: {
    difficulties: [1, 2],
    build(d) {
      const a = rand(2, 5), b = rand(2, 5);
      if (a === b || gcd(a, b) !== 1) return null;
      const k = d <= 1 ? rand(2, 6) : rand(3, 9);
      const amountA = a * k, amountB = b * k;
      const [itemA, itemB] = pick([
        ["red counters", "blue counters"],
        ["sweets", "biscuits"],
        ["cups of rice", "cups of water"],
        ["stickers", "badges"],
      ]);
      const decoys = [amountA, (a + b) * k, amountB + b, amountB - b, k].filter((x) => x !== amountB && x > 0);
      const { options, correctIndex } = buildMC(amountB, decoys);
      return { q: `A box contains ${itemA} and ${itemB} in the ratio ${a}:${b}. If ${k} identical boxes are combined, how many ${itemB} are there altogether?`, options, correctIndex,
        hint: "Multiply BOTH parts of the ratio by the number of boxes to find each total. The ratio itself stays the same; only the actual amounts scale up.",
        solution: {
          scenario: `${itemA} to ${itemB} is ${a}:${b} in one box; ${k} boxes are combined.`,
          idea: "Scaling a ratio up by a whole number of copies means multiplying every part of the ratio by that same number.",
          method: [`Multiply ${b} by ${k}.`],
          steps: [`${itemB}: ${b} × ${k} = ${amountB}.`],
          check: `${itemA}: ${a} × ${k} = ${amountA}; and ${amountA}:${amountB} simplifies back to ${a}:${b}.`,
        } };
    },
  },
  simplify_ratio_lowest_terms: {
    difficulties: [1, 2],
    build(d) {
      const p = rand(2, d >= 2 ? 9 : 5), q = rand(2, d >= 2 ? 9 : 5);
      if (p === q || gcd(p, q) !== 1) return null;
      const g = d >= 2 ? rand(3, 8) : rand(2, 5);
      const x = p * g, y = q * g;
      const ans = `${p}:${q}`;
      const candidates = [`${x}:${y}`, `${q}:${p}`, `${p}:${q + 1}`, `${p + 1}:${q}`, `${p}:${q * 2}`];
      const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Write the ratio ${x}:${y} in its simplest form.`, options, correctIndex,
        hint: "Divide both parts of the ratio by their highest common factor.",
        solution: {
          scenario: `${x}:${y} needs simplifying.`,
          idea: "A ratio is simplified by dividing both parts by their highest common factor, the same way a fraction is simplified.",
          method: [`Find the highest common factor of ${x} and ${y}.`, "Divide both parts by it."],
          steps: [`HCF of ${x} and ${y} is ${g}.`, `${x} ÷ ${g} = ${p}; ${y} ÷ ${g} = ${q}.`, `Simplest form: ${ans}.`],
          check: `${p} × ${g} = ${x} and ${q} × ${g} = ${y}.`,
        } };
    },
  },
  part_to_whole_ratio: {
    difficulties: [1, 2, 3],
    build(d) {
      const p = rand(2, d >= 3 ? 9 : 6), q = rand(2, d >= 3 ? 9 : 6);
      if (p === q || gcd(p, q) !== 1) return null;
      const g = d >= 3 ? rand(3, 9) : rand(2, 6);
      const a = p * g, b = q * g, total = a + b;
      const [groupA, groupB] = pick([
        ["girls", "boys"],
        ["red apples", "green apples"],
        ["comic books", "story books"],
        ["football stickers", "cricket stickers"],
      ]);
      const ans = `${p}:${p + q}`;
      const candidates = [`${p}:${q}`, `${q}:${p + q}`, `${a}:${total}`, `${p + q}:${p}`, `${q}:${p}`];
      const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `A shelf has ${a} ${groupA} and ${b} ${groupB}. What is the ratio of ${groupA} to the TOTAL number of items, in simplest form?`, options, correctIndex,
        hint: "This asks for the ratio of one part to the WHOLE, not part to part. Add both parts to get the whole, then simplify.",
        solution: {
          scenario: `${a} ${groupA} and ${b} ${groupB}, total ${total}.`,
          idea: "The ratio of a part to the whole is (that part):(the total), simplified by dividing by the highest common factor.",
          method: [`Total = ${a} + ${b} = ${total}.`, `Write ${a}:${total}.`, "Simplify by the highest common factor."],
          steps: [`${a}:${total} simplifies (divide both by ${g}) to ${p}:${p + q}.`],
          check: `${p} × ${g} = ${a} and ${p + q} × ${g} = ${total}.`,
        } };
    },
  },
  unitary_scale_match_one_quantity: {
    difficulties: [1, 2, 3],
    build(d) {
      const a = rand(2, d >= 3 ? 9 : 5), b = rand(2, d >= 3 ? 9 : 5);
      if (a === b || gcd(a, b) !== 1) return null;
      const k = d >= 3 ? rand(3, 12) : rand(2, 8);
      const amountA = a * k, amountB = b * k;
      const [itemA, itemB] = pick([
        ["blue paint", "yellow paint"],
        ["flour", "sugar"],
        ["orange squash", "water"],
        ["cement", "sand"],
      ]);
      const decoys = [amountA, amountA + a, amountB + b, amountB - b, k].filter((x) => x !== amountB && x > 0);
      const { options, correctIndex } = buildMC(amountB, decoys);
      return { q: `A mixture uses ${itemA} and ${itemB} in the ratio ${a}:${b}. If ${amountA}ml of ${itemA} is used, how much ${itemB} is needed?`, options, correctIndex,
        hint: "Divide the given amount by its own ratio number to find the value of one unit, then multiply by the OTHER ratio number.",
        solution: {
          scenario: `Ratio ${a}:${b}, and ${amountA}ml of ${itemA} is used.`,
          idea: "Find the scale factor by dividing the given amount by its ratio number, then multiply the other ratio number by the same scale factor.",
          method: [`${amountA} ÷ ${a} = ${k} (the scale factor).`, `${b} × ${k} = ${amountB}.`],
          steps: [`${amountA} ÷ ${a} = ${k}.`, `${itemB} needed = ${k} × ${b} = ${amountB}ml.`],
          check: `${amountB} ÷ ${k} = ${b}, matching the ratio.`,
        } };
    },
  },
  share_total_find_part: {
    difficulties: [1, 2, 3],
    build(d) {
      const a = rand(2, d >= 3 ? 9 : 6), b = rand(2, d >= 3 ? 9 : 6);
      if (a === b || gcd(a, b) !== 1) return null;
      const k = d >= 3 ? rand(3, 12) : rand(2, 8);
      const total = (a + b) * k;
      const partA = a * k, partB = b * k;
      const askSmaller = pick([true, false]);
      const answer = askSmaller ? Math.min(partA, partB) : Math.max(partA, partB);
      const other = askSmaller ? Math.max(partA, partB) : Math.min(partA, partB);
      const [groupA, groupB] = pick([
        ["dogs", "cats"],
        ["red counters", "blue counters"],
        ["boys", "girls"],
        ["apples", "oranges"],
      ]);
      const nm = N1();
      const decoys = [other, total, k, answer + k, answer - k].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoys);
      return { q: `${nm} has ${groupA} and ${groupB} in the ratio ${a}:${b}. There are ${total} in total. What is the ${askSmaller ? "smaller" : "larger"} share?`, options, correctIndex,
        hint: "When you know the total and the ratio, first find the value of one ratio unit by dividing the total by the sum of the ratio parts. Then multiply by the ratio number you need.",
        solution: {
          scenario: `${total} shared in the ratio ${a}:${b}.`,
          idea: "Divide the total by the sum of the ratio parts to find one unit, then multiply by each ratio number.",
          method: [`Add the ratio parts: ${a} + ${b} = ${a + b}.`, "Divide the total by that sum.", "Multiply by the ratio number needed."],
          steps: [`${total} ÷ ${a + b} = ${k}.`, `Shares are ${partA} and ${partB}; the ${askSmaller ? "smaller" : "larger"} is ${answer}.`],
          check: `${partA} + ${partB} = ${total}.`,
        } };
    },
  },
  find_total_given_one_part: {
    difficulties: [2, 3, 4],
    build(d) {
      const a = rand(2, d >= 4 ? 12 : 8), b = rand(2, d >= 4 ? 12 : 8);
      if (a === b || gcd(a, b) !== 1) return null;
      const k = d >= 4 ? rand(4, 14) : rand(2, 10);
      const partA = a * k, partB = b * k, total = partA + partB;
      const [groupA, groupB] = pick([
        ["saltwater fish", "freshwater fish"],
        ["red beads", "green beads"],
        ["novels", "comics"],
        ["oak trees", "birch trees"],
      ]);
      const decoys = [partA, partB, total + k, total - k, k].filter((x) => x !== total && x > 0);
      const { options, correctIndex } = buildMC(total, decoys);
      return { q: `A collection of ${groupA} and ${groupB} is in the ratio ${a}:${b}. There are ${partA} ${groupA}. How many items are there in total?`, options, correctIndex,
        hint: "Find the value of one ratio unit from the part you know, then use it to find the total by multiplying by the sum of the ratio parts.",
        solution: {
          scenario: `${partA} ${groupA}, with ${groupA}:${groupB} = ${a}:${b}.`,
          idea: "Divide the known part by its own ratio number to find one unit, then multiply by the sum of all ratio parts to find the total.",
          method: [`${partA} ÷ ${a} = ${k} (one ratio unit).`, `Multiply by the sum of the parts: ${k} × (${a} + ${b}).`],
          steps: [`One unit = ${partA} ÷ ${a} = ${k}.`, `Total = ${k} × (${a} + ${b}) = ${total}.`],
          check: `${groupB} = ${k} × ${b} = ${partB}; ${partA} + ${partB} = ${total}.`,
        } };
    },
  },
  check_ratio_equivalence: {
    difficulties: [2, 3, 4],
    build(d) {
      const r1 = rand(2, d >= 4 ? 9 : 6), r2 = rand(2, d >= 4 ? 9 : 6);
      if (r1 === r2 || gcd(r1, r2) !== 1) return null;
      const k = d >= 4 ? rand(2, 8) : rand(2, 6);
      const sameRatio = pick([true, false]);
      const c1 = sameRatio ? r1 * k : r1 * k + pick([1, -1]);
      const c2 = r2 * k;
      if (c1 <= 0) return null;
      const actuallyEquivalent = c1 * r2 === c2 * r1;
      const ans = actuallyEquivalent ? "Yes, it is the same ratio" : "No, it is a different ratio";
      const otherAns = actuallyEquivalent ? "No, it is a different ratio" : "Yes, it is the same ratio";
      const decoys = [otherAns, "Cannot be told without more information", "Only true if both numbers are even", "Yes, because both ratios use whole numbers"];
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Is the ratio ${c1}:${c2} the same as the ratio ${r1}:${r2}?`, options, correctIndex,
        hint: "Two ratios are equivalent if one can be reached from the other by multiplying (or dividing) both parts by the same number. Check by cross-multiplying: a:b equals c:d if a×d = b×c.",
        solution: {
          scenario: `Comparing ${c1}:${c2} with ${r1}:${r2}.`,
          idea: "Cross-multiply to check equivalence: a:b equals c:d if a×d = b×c.",
          method: [`Cross-multiply: ${c1} × ${r2} and ${c2} × ${r1}.`, "Compare the two results."],
          steps: [`${c1} × ${r2} = ${c1 * r2}; ${c2} × ${r1} = ${c2 * r1}.`, `They are ${actuallyEquivalent ? "equal, so the ratios ARE the same." : "different, so the ratios are NOT the same."}`],
          check: actuallyEquivalent ? `${c1}:${c2} simplifies to the same ratio as ${r1}:${r2}.` : `${c1}:${c2} does not simplify to ${r1}:${r2}.`,
        } };
    },
  },
  difference_given_ratio: {
    difficulties: [3, 4],
    build(d) {
      const a = rand(2, d >= 4 ? 11 : 7), b = rand(2, d >= 4 ? 11 : 7);
      if (a === b || gcd(a, b) !== 1) return null;
      const k = d >= 4 ? rand(3, 12) : rand(2, 9);
      const partA = a * k, partB = b * k;
      const larger = Math.max(partA, partB), smaller = Math.min(partA, partB);
      const difference = larger - smaller;
      const [groupA, groupB] = pick([
        ["Year 5 pupils", "Year 6 pupils"],
        ["red marbles", "green marbles"],
        ["blue tiles", "white tiles"],
        ["hens", "ducks"],
      ]);
      const decoys = [smaller, larger + difference, smaller + difference, k].filter((x) => x !== larger && x > 0);
      const { options, correctIndex } = buildMC(larger, decoys);
      return { q: `${groupA} and ${groupB} are in the ratio ${a}:${b}. There are ${difference} more in the larger group than the smaller. How many are in the larger group?`, options, correctIndex,
        hint: "The DIFFERENCE between the ratio numbers corresponds to the actual difference between the groups. Divide the actual difference by the difference of the ratio numbers to find one unit, then multiply.",
        solution: {
          scenario: `Ratio ${a}:${b}, and the difference between the groups is ${difference}.`,
          idea: "Find one ratio unit by dividing the actual difference by the difference between the ratio numbers, then multiply by the larger ratio number.",
          method: [`Difference in ratio parts: ${Math.abs(a - b)}.`, `${difference} ÷ ${Math.abs(a - b)} = ${k} (one unit).`, "Multiply by the larger ratio number."],
          steps: [`One unit = ${difference} ÷ ${Math.abs(a - b)} = ${k}.`, `Larger group = ${k} × ${Math.max(a, b)} = ${larger}.`],
          check: `${larger} − ${smaller} = ${difference}.`,
        } };
    },
  },
  three_way_ratio_share: {
    difficulties: [3, 4],
    build(d) {
      const range = d >= 4 ? 9 : 6;
      const a = rand(2, range), b = rand(2, range), c = rand(2, range);
      if (new Set([a, b, c]).size !== 3) return null;
      if (gcd(gcd(a, b), c) !== 1) return null;
      const k = d >= 4 ? rand(3, 10) : rand(2, 8);
      const partA = a * k, partB = b * k, partC = c * k, total = partA + partB + partC;
      const item = pick(["marbles", "stickers", "sweets", "conkers"]);
      const decoys = [partA, partB, total, k, partA + partB].filter((x) => x !== partC && x > 0);
      const { options, correctIndex } = buildMC(partC, decoys);
      return { q: `${total} ${item} are shared between Amir, Bo and Cai in the ratio ${a}:${b}:${c}. How many ${item} does Cai get?`, options, correctIndex,
        hint: "With a three-part ratio, divide the total by the sum of ALL THREE ratio parts to find one unit, then multiply by the part you need.",
        solution: {
          scenario: `${total} ${item} shared in the ratio ${a}:${b}:${c}.`,
          idea: "Divide the total by the sum of all three ratio parts to find one unit, then multiply by the number needed.",
          method: [`Add the ratio parts: ${a} + ${b} + ${c} = ${a + b + c}.`, "Divide the total by that sum.", "Multiply by Cai's ratio number."],
          steps: [`${total} ÷ ${a + b + c} = ${k}.`, `Cai's share = ${k} × ${c} = ${partC}.`],
          check: `${partA} + ${partB} + ${partC} = ${total}.`,
        } };
    },
  },
  missing_term_proportion: {
    difficulties: [2, 3, 4],
    build(d) {
      const p = rand(2, d >= 4 ? 9 : 6), q = rand(2, d >= 4 ? 9 : 6);
      if (p === q || gcd(p, q) !== 1) return null;
      const g = d >= 3 ? rand(2, 5) : rand(2, 3);
      const m = p * g, n = q * g;
      const k = d >= 4 ? rand(3, 10) : rand(2, 8);
      const c = p * k, x = q * k;
      const decoys = [m, n, c, x + q, x - q].filter((val) => val !== x && val > 0);
      const { options, correctIndex } = buildMC(x, decoys);
      return { q: `If ${m} : ${n} = ${c} : x, what is the value of x?`, options, correctIndex,
        hint: "First simplify the given ratio to its lowest terms, then work out the scale factor from the known number, and apply that same scale factor to find x.",
        solution: {
          scenario: `${m}:${n} = ${c}:x.`,
          idea: "Simplify the ratio first, then find the scale factor from the known number, then apply it to find x.",
          method: [`Simplify ${m}:${n} by dividing both by ${g}, giving ${p}:${q}.`, `Find the scale factor: ${c} ÷ ${p} = ${k}.`, `Multiply: ${q} × ${k} = x.`],
          steps: [`${m}:${n} simplifies to ${p}:${q}.`, `${c} ÷ ${p} = ${k}.`, `x = ${q} × ${k} = ${x}.`],
          check: `${c}:${x} simplifies (divide both by ${k}) back to ${p}:${q}, matching the simplified ratio.`,
        } };
    },
  },
};
// Structure registry for negativeNumbers — a brand new KS2 topic (Y4 "count backwards
// through zero"; Y5/6 "use negative numbers in context, calculate intervals across zero"),
// added mid-programme after the curriculum audit missed it. Scoped strictly to KS2: no
// algebra, no negative × negative or negative division. Contexts: temperature (the classic
// NC vehicle), a bare number line, lift floors, and an overdrawn bank balance at the top end.
const NEGATIVE_NUMBERS_STRUCTURES = {
  number_line_read: {
    difficulties: [1, 2],
    build(d) {
      const start = d <= 1 ? 0 : pick([-3, -2, -1, 0, 1, 2, 3]);
      const steps = d <= 1 ? rand(3, 9) : rand(5, 15);
      const dir = pick(["left", "right"]);
      const stepWord = steps === 1 ? "place" : "places";
      const end = dir === "left" ? start - steps : start + steps;
      const pool = [start + (dir === "left" ? steps : -steps), end + 1, end - 1, -end, steps]
        .filter((x) => Number.isFinite(x) && x !== end);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(end, decoys);
      return { q: `A counter sits at ${start} on a number line. It moves ${steps} ${stepWord} to the ${dir}. Which number does it land on?`, options, correctIndex,
        hint: "This is a number-line movement question. Moving left makes the value smaller (more negative); moving right makes it bigger: the line carries on below zero exactly the same way.",
        solution: {
          scenario: `The counter starts at ${start} and moves ${steps} ${stepWord} to the ${dir}.`,
          idea: "Moving right on a number line increases the value; moving left decreases it. Crossing zero doesn't change anything about how the counting works.",
          method: ["Decide whether the move increases or decreases the value.", "Add or subtract the number of places from the starting value."],
          steps: [`Moving ${dir} means we ${dir === "left" ? "subtract" : "add"} ${steps}.`, `${start} ${dir === "left" ? "−" : "+"} ${steps} = ${end}.`],
          check: `Moving back ${dir === "left" ? "right" : "left"} by ${steps} ${stepWord} from ${end} returns to ${start}, so the move checks out.`,
        } };
    },
  },
  count_on_across_zero: {
    difficulties: [1, 2],
    build(d) {
      const start = d <= 1 ? rand(-6, -1) : rand(-14, -1);
      const add = d <= 1 ? rand(2, 8) : rand(4, 16);
      const end = start + add;
      const nm = N1();
      const pool = [start - add, -end, end + 2, end - 2, add - Math.abs(start)]
        .filter((x) => Number.isFinite(x) && x !== end);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(end, decoys);
      return { q: `${nm} starts at ${start} and counts on ${add}. What number does ${nm} reach?`, options, correctIndex,
        hint: "This is a counting-on question. Counting on means adding: keep moving up the number line by the given amount, even starting from below zero.",
        solution: {
          scenario: `${nm} starts at ${start} and counts on ${add}.`,
          idea: "Counting on means adding. It works the same way whether you start above or below zero: you still move up the number line by the same amount.",
          method: ["Add the amount to the starting number.", "Keep counting up through zero if needed: nothing changes about the counting."],
          steps: [`${start} + ${add} = ${end}.`],
          check: `Counting up from ${start} one at a time, ${add} counts later lands on ${end}.`,
        } };
    },
  },
  count_back_across_zero: {
    difficulties: [1, 2],
    build(d) {
      const start = d <= 1 ? rand(1, 6) : rand(1, 12);
      const sub = d <= 1 ? rand(start + 2, start + 8) : rand(start + 3, start + 16);
      const end = start - sub;
      const nm = N1();
      const pool = [sub - start, start + sub, -end, end - 2, end + 2]
        .filter((x) => Number.isFinite(x) && x !== end);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(end, decoys);
      return { q: `${nm} starts at ${start} and counts back ${sub}. What number does ${nm} reach?`, options, correctIndex,
        hint: "This is a counting-back question. Counting back means subtracting, and you can carry straight on past zero into the negative numbers.",
        solution: {
          scenario: `${nm} starts at ${start} and counts back ${sub}.`,
          idea: "Counting back means subtracting. Zero isn't a wall: once you pass it, counting back keeps going into negative numbers.",
          method: ["Subtract the amount from the starting number.", "If the result would go below zero, let it: that's fine, it's a negative number."],
          steps: [`${start} − ${sub} = ${end}.`],
          check: `Counting up from ${end} by ${sub} in ones returns to ${start}.`,
        } };
    },
  },
  compare_two_values: {
    difficulties: [1, 2],
    build(d) {
      let a, b;
      if (d <= 1) { a = rand(-9, -1); b = rand(1, 9); }
      else {
        const small = -rand(1, 6);
        const big = small - rand(2, 12);
        [a, b] = pick([[small, big], [big, small]]);
      }
      const wantColder = pick([true, false]);
      const correct = wantColder ? Math.min(a, b) : Math.max(a, b);
      const other = correct === a ? b : a;
      const pool = [other, correct + 2, correct - 2, -correct]
        .filter((x) => Number.isFinite(x) && x !== correct);
      const decoys = [...new Set(pool)];
      const fmt = (x) => `${x}°C`;
      const { options, correctIndex } = buildMC(correct, decoys, fmt);
      return { q: `Town A is ${a}°C and Town B is ${b}°C. Which is the ${wantColder ? "colder" : "warmer"} of the two temperatures?`, options, correctIndex,
        hint: `This is a compare-two-readings question. The ${wantColder ? "colder" : "warmer"} temperature is the ${wantColder ? "smaller" : "larger"} number: remember that a more negative number is always colder, whatever its digits look like.`,
        solution: {
          scenario: `We need the ${wantColder ? "colder" : "warmer"} of ${a}°C and ${b}°C.`,
          idea: "On the temperature scale, colder means smaller (further left on the number line) and warmer means larger (further right); this stays true even when both readings are negative.",
          method: ["Compare the two readings directly as signed numbers.", `Pick the ${wantColder ? "smaller" : "larger"} one.`],
          steps: [`Comparing ${a} and ${b}, the ${wantColder ? "smaller" : "larger"} value is ${correct}.`],
          check: `${correct}°C is ${wantColder ? "colder" : "warmer"} than ${other}°C, since ${correct} is ${wantColder ? "less than" : "greater than"} ${other} on the number line.`,
        } };
    },
  },
  order_small_set: {
    difficulties: [1, 2],
    build(d) {
      let arr;
      if (d <= 1) {
        const s = new Set();
        let guard = 0;
        while (s.size < 3 && guard < 300) { guard++; s.add(rand(-6, 6)); }
        if (s.size < 3) return null;
        arr = [...s];
      } else {
        const smallNeg = -rand(1, 5);
        const bigNeg = smallNeg - rand(2, 8);
        let third; let guard = 0;
        do { third = rand(-12, 12); guard++; } while ([smallNeg, bigNeg].includes(third) && guard < 50);
        if ([smallNeg, bigNeg].includes(third)) return null;
        arr = [smallNeg, bigNeg, third];
      }
      const wantAsc = pick([true, false]);
      const sorted = [...arr].sort((a, b) => (wantAsc ? a - b : b - a));
      const correctStr = sorted.join(", ");
      function permute(a) {
        if (a.length <= 1) return [a];
        const res = [];
        for (let k = 0; k < a.length; k++) { const rest = [...a.slice(0, k), ...a.slice(k + 1)]; for (const p of permute(rest)) res.push([a[k], ...p]); }
        return res;
      }
      const allPerms = permute(arr).map((p) => p.join(", "));
      const wrongPerms = shuffle([...new Set(allPerms)].filter((s) => s !== correctStr));
      const decoys = wrongPerms.slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correctStr, decoys);
      return { q: `Put these numbers in order, from ${wantAsc ? "smallest to largest" : "largest to smallest"}: ${shuffle(arr).join(", ")}.`, options, correctIndex,
        hint: "This is an ordering question that mixes positive and negative numbers. Remember: the more negative a number is, the smaller it is; -7 is smaller than -3, even though 7 is bigger than 3.",
        solution: {
          scenario: `We need to order ${arr.join(", ")} from ${wantAsc ? "smallest to largest" : "largest to smallest"}.`,
          idea: "Every negative number is smaller than every positive number, and among negative numbers, the one further from zero is the smaller one.",
          method: ["Place any positive numbers above any negative numbers.", "Among the negative numbers, the more negative one counts as smaller.", "Arrange all the numbers in the required order."],
          steps: [`Ordering ${arr.join(", ")} gives: ${correctStr}.`],
          check: `Each number in ${correctStr} is ${wantAsc ? "bigger" : "smaller"} than the one before it.`,
        } };
    },
  },
  position_distance_to_zero: {
    difficulties: [1],
    build() {
      const val = rand(-9, -1);
      const correct = -val;
      const pool = [Math.abs(val) - 1, correct + 1, correct - 1, correct + 2]
        .filter((x) => Number.isFinite(x) && x > 0 && x !== correct);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(correct, decoys);
      return { q: `A thermometer reads ${val}°C. How many degrees must the temperature rise to reach 0°C?`, options, correctIndex,
        hint: "This is a distance-to-zero question. The number of steps from a negative number up to zero is just that number's size, ignoring the minus sign.",
        solution: {
          scenario: `The temperature is ${val}°C and we want to know how far it is to 0°C.`,
          idea: "The distance from a negative number up to zero is exactly that number's size once you drop the minus sign.",
          method: ["Find how far the number is below zero.", "That distance, ignoring the sign, is the number of degrees needed to rise."],
          steps: [`${val}°C is ${correct} degrees below zero.`, `So the temperature must rise by ${correct} degrees to reach 0°C.`],
          check: `${val} + ${correct} = 0, confirming the rise needed.`,
        } };
    },
  },
  missing_in_sequence: {
    difficulties: [1, 2],
    build(d) {
      const step = d <= 1 ? pick([1, 2, 5]) : pick([2, 3, 4, 5, 10]);
      const first = -step * (d <= 1 ? rand(2, 4) : rand(3, 8));
      const seq = [0, 1, 2, 3, 4].map((i) => first + i * step);
      const blankIdx = rand(1, 3);
      const missing = seq[blankIdx];
      const displayed = seq.map((v, i) => (i === blankIdx ? "?" : v));
      const pool = [missing + step, missing - step, missing + 2 * step, -missing]
        .filter((x) => Number.isFinite(x) && x !== missing);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(missing, decoys);
      return { q: `Here is a number sequence going up in steps of ${step}: ${displayed.join(", ")}. What is the missing number?`, options, correctIndex,
        hint: "This is a missing-term question. Work out the value on either side of the gap using the step size, and check both directions agree.",
        solution: {
          scenario: `The sequence goes up in steps of ${step}: ${displayed.join(", ")}.`,
          idea: "A sequence stepping through zero keeps adding the same step size the whole way; zero isn't a special stopping point.",
          method: ["Find a nearby known term.", "Add or subtract the step size to reach the missing term."],
          steps: [`${seq[blankIdx - 1]} + ${step} = ${missing}.`],
          check: `${missing} + ${step} = ${seq[blankIdx + 1]}, which matches the next term shown.`,
        } };
    },
  },
  order_mixed_five: {
    difficulties: [2, 3],
    build(d) {
      const smallNeg = -rand(1, 6);
      const bigNeg = smallNeg - rand(2, d <= 2 ? 8 : 14);
      const lo = d <= 2 ? -15 : -25, hi = d <= 2 ? 15 : 25;
      const set = new Set([smallNeg, bigNeg]);
      let guard = 0;
      while (set.size < 4 && guard < 300) { guard++; set.add(rand(lo, hi)); }
      if (set.size < 4) return null;
      const arr = [...set];
      const wantAsc = pick([true, false]);
      const sorted = [...arr].sort((a, b) => (wantAsc ? a - b : b - a));
      const correctStr = sorted.map((v) => `${v}°C`).join(", ");
      function permute(a) {
        if (a.length <= 1) return [a];
        const res = [];
        for (let k = 0; k < a.length; k++) { const rest = [...a.slice(0, k), ...a.slice(k + 1)]; for (const p of permute(rest)) res.push([a[k], ...p]); }
        return res;
      }
      const allPerms = permute(arr).map((p) => p.map((v) => `${v}°C`).join(", "));
      const wrongPerms = shuffle([...new Set(allPerms)].filter((s) => s !== correctStr));
      const decoys = wrongPerms.slice(0, 4);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correctStr, decoys);
      return { q: `Here are the temperatures recorded in 4 towns: ${shuffle(arr).map((v) => `${v}°C`).join(", ")}. Put them in order, from ${wantAsc ? "coldest to warmest" : "warmest to coldest"}.`, options, correctIndex,
        hint: "This is an ordering question with negative numbers. Remember: the more negative a number is, the colder (smaller) it is; -8°C is colder than -3°C, even though 8 is bigger than 3.",
        solution: {
          scenario: `We need to order ${arr.map((v) => `${v}°C`).join(", ")} from ${wantAsc ? "coldest to warmest" : "warmest to coldest"}.`,
          idea: "Ordering temperatures works exactly like ordering any signed numbers: positives beat negatives, and among negatives, further-from-zero means colder.",
          method: ["Place any positive readings above any negative readings.", "Among negative readings, the more negative one is colder.", "Arrange all the readings in the required order."],
          steps: [`Ordering these gives: ${correctStr}.`],
          check: `Each reading in ${correctStr} is ${wantAsc ? "warmer" : "colder"} than the one before it.`,
        } };
    },
  },
  interval_simple_diff: {
    difficulties: [2, 3],
    build(d) {
      const neg = d <= 2 ? rand(-9, -1) : rand(-15, -1);
      const pos = d <= 2 ? rand(1, 9) : rand(1, 20);
      const diff = pos - neg;
      const pool = [pos - Math.abs(neg), Math.abs(neg) - pos, diff + 1, diff - 1]
        .filter((x) => Number.isFinite(x) && x !== diff);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(diff, decoys);
      return { q: `At midnight the temperature was ${neg}°C. By midday it had risen to ${pos}°C. By how many degrees did the temperature rise?`, options, correctIndex,
        hint: "This is a temperature-rise-across-zero question. Find the gap from the colder reading up to the warmer one, counting straight through zero.",
        solution: {
          scenario: `The temperature went from ${neg}°C at midnight to ${pos}°C at midday.`,
          idea: "To find the rise, add together how far the first reading is below zero and how far the second reading is above zero; crossing zero doesn't break the count.",
          method: [`Find how far ${neg}°C is below zero: that's ${Math.abs(neg)} degrees.`, `Find how far ${pos}°C is above zero: that's ${pos} degrees.`, "Add these two distances together."],
          steps: [`${Math.abs(neg)} + ${pos} = ${diff}.`],
          check: `${neg} + ${diff} = ${pos}, confirming a rise of ${diff} degrees.`,
        } };
    },
  },
  temp_change_addition: {
    difficulties: [2, 3],
    build(d) {
      let start;
      do { start = d <= 2 ? rand(-8, 8) : rand(-15, 15); } while (start === 0);
      const changeAmt = d <= 2 ? rand(3, 10) : rand(5, 20);
      const changeDir = pick(["rises", "falls"]);
      const end = changeDir === "rises" ? start + changeAmt : start - changeAmt;
      const pool = [changeDir === "rises" ? start - changeAmt : start + changeAmt, end + 2, end - 2, -end]
        .filter((x) => Number.isFinite(x) && x !== end);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(end, decoys);
      return { q: `The temperature is ${start}°C. It ${changeDir} by ${changeAmt} degrees. What is the new temperature?`, options, correctIndex,
        hint: "This is a temperature-change question. A rise means add; a fall means subtract; the reading can carry on past zero into negative numbers.",
        solution: {
          scenario: `The temperature is ${start}°C and it ${changeDir} by ${changeAmt} degrees.`,
          idea: "A rise adds to the reading; a fall subtracts from it. This works the same whether the result stays positive or drops below zero.",
          method: [`Decide whether to add (${changeDir === "rises" ? "this case" : "a rise"}) or subtract (${changeDir === "falls" ? "this case" : "a fall"}).`, "Apply that to the starting reading."],
          steps: [`${start} ${changeDir === "rises" ? "+" : "−"} ${changeAmt} = ${end}.`],
          check: `Reversing the change: ${end} ${changeDir === "rises" ? "−" : "+"} ${changeAmt} = ${start}.`,
        } };
    },
  },
  floor_lift_scenario: {
    difficulties: [2, 3],
    build(d) {
      const startFloor = d <= 2 ? rand(-3, 5) : rand(-6, 10);
      const moveAmt = d <= 2 ? rand(2, 8) : rand(4, 14);
      const dir = pick(["up", "down"]);
      const floorWord = moveAmt === 1 ? "floor" : "floors";
      const endFloor = dir === "up" ? startFloor + moveAmt : startFloor - moveAmt;
      const nm = N1();
      const pool = [dir === "up" ? startFloor - moveAmt : startFloor + moveAmt, endFloor + 1, endFloor - 1, -endFloor]
        .filter((x) => Number.isFinite(x) && x !== endFloor);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(endFloor, decoys);
      return { q: `${nm} gets in a lift on floor ${startFloor} (floors below the ground floor are negative). The lift travels ${moveAmt} ${floorWord} ${dir}. Which floor does it stop on?`, options, correctIndex,
        hint: "This is a lift-floors question. Floors below ground are negative, so travelling down subtracts and travelling up adds, straight through the ground floor (0).",
        solution: {
          scenario: `The lift starts on floor ${startFloor} and travels ${moveAmt} ${floorWord} ${dir}.`,
          idea: "Floor numbers below ground work exactly like negative numbers on a number line. Going up adds to the floor number; going down subtracts, even past ground level.",
          method: [`Decide whether travelling ${dir} adds or subtracts.`, "Apply that to the starting floor."],
          steps: [`${startFloor} ${dir === "up" ? "+" : "−"} ${moveAmt} = ${endFloor}.`],
          check: `Travelling back ${dir === "up" ? "down" : "up"} ${moveAmt} ${floorWord} from floor ${endFloor} returns to floor ${startFloor}.`,
        } };
    },
  },
  interval_two_negatives: {
    difficulties: [3, 4],
    build(d) {
      const b = d <= 3 ? -rand(1, 6) : -rand(1, 10);
      const a = d <= 3 ? b - rand(2, 8) : b - rand(3, 15);
      const diff = b - a;
      const pool = [a - b, Math.abs(a) + Math.abs(b), diff + 1, diff - 1]
        .filter((x) => Number.isFinite(x) && x !== diff);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(diff, decoys);
      return { q: `Overnight the temperature fell to ${a}°C. By morning it had risen to ${b}°C. By how many degrees did it rise?`, options, correctIndex,
        hint: "This is a rise-between-two-negatives question. Remember that -8°C is colder than -3°C: count up from the colder (more negative) reading to the warmer one.",
        solution: {
          scenario: `The temperature was ${a}°C overnight and ${b}°C by morning.`,
          idea: "Even when both readings are negative, the warmer one is always the one closer to zero. The rise is the gap between them, counted along the number line.",
          method: [`Check which reading is colder (more negative): here it's ${a}°C.`, `Count up from ${a} to ${b}.`],
          steps: [`${b} − ${a} = ${diff}.`],
          check: `${a} + ${diff} = ${b}, confirming a rise of ${diff} degrees.`,
        } };
    },
  },
  multi_step_temp_change: {
    difficulties: [3, 4],
    build(d) {
      let start;
      do { start = d <= 3 ? rand(-6, 6) : rand(-10, 10); } while (start === 0);
      const amt1 = d <= 3 ? rand(3, 9) : rand(5, 15);
      const dir1 = pick(["falls", "rises"]);
      const mid = dir1 === "falls" ? start - amt1 : start + amt1;
      const amt2 = d <= 3 ? rand(2, 8) : rand(4, 12);
      const dir2 = pick(["falls", "rises"]);
      const end = dir2 === "falls" ? mid - amt2 : mid + amt2;
      const oneStepOnly = dir2 === "falls" ? mid - amt1 : mid + amt1;
      const bothSameDirAsFirst = dir1 === "falls" ? start - amt1 - amt2 : start + amt1 + amt2;
      const pool = [mid, oneStepOnly, bothSameDirAsFirst, end + 2, end - 2]
        .filter((x) => Number.isFinite(x) && x !== end);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(end, decoys);
      return { q: `The temperature starts at ${start}°C. It ${dir1} by ${amt1} degrees, then it ${dir2} by ${amt2} degrees. What is the temperature now?`, options, correctIndex,
        hint: "This is a two-step temperature question. Work out the temperature after the first change, then apply the second change to THAT new value, not to the original starting value.",
        solution: {
          scenario: `The temperature starts at ${start}°C, ${dir1} by ${amt1} degrees, then ${dir2} by ${amt2} degrees.`,
          idea: "Multi-step temperature questions are solved one step at a time: each change acts on the reading left over from the step before it.",
          method: ["Apply the first change to the starting reading.", "Apply the second change to the RESULT of the first, not to the start."],
          steps: [`After the first change: ${start} ${dir1 === "rises" ? "+" : "−"} ${amt1} = ${mid}.`, `After the second change: ${mid} ${dir2 === "rises" ? "+" : "−"} ${amt2} = ${end}.`],
          check: `Reversing both steps from ${end} gets back to ${start}.`,
        } };
    },
  },
  reasoning_which_change_bigger: {
    difficulties: [3, 4],
    build(d) {
      let a1, a2, b1, b2, dropA, dropB, guard = 0;
      do {
        a1 = d <= 3 ? rand(-4, 6) : rand(-8, 10);
        a2 = a1 - (d <= 3 ? rand(3, 9) : rand(5, 14));
        b1 = d <= 3 ? rand(-4, 6) : rand(-8, 10);
        b2 = b1 - (d <= 3 ? rand(3, 9) : rand(5, 14));
        dropA = a1 - a2; dropB = b1 - b2;
        guard++;
      } while (dropA === dropB && guard < 50);
      if (dropA === dropB) return null;
      const bigger = Math.max(dropA, dropB);
      const pool = [Math.min(dropA, dropB), dropA + dropB, bigger + 1, bigger - 1, Math.abs(dropA - dropB)]
        .filter((x) => Number.isFinite(x) && x !== bigger);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(bigger, decoys);
      return { q: `In Riverby the temperature fell from ${a1}°C to ${a2}°C. In Aldmoor it fell from ${b1}°C to ${b2}°C. What was the size of the bigger of the two falls, in degrees?`, options, correctIndex,
        hint: "This is a compare-two-changes question. Work out each fall as a positive number of degrees (earlier reading minus later reading), then compare the two sizes.",
        solution: {
          scenario: `Riverby fell from ${a1}°C to ${a2}°C; Aldmoor fell from ${b1}°C to ${b2}°C.`,
          idea: "Find each fall by subtracting the later, colder reading from the earlier one: that always gives the fall as a positive number of degrees, whatever the signs involved.",
          method: [`Riverby's fall: ${a1} − ${a2}.`, `Aldmoor's fall: ${b1} − ${b2}.`, "Compare the two sizes."],
          steps: [`Riverby: ${a1} − ${a2} = ${dropA} degrees.`, `Aldmoor: ${b1} − ${b2} = ${dropB} degrees.`, `The bigger fall is ${bigger} degrees.`],
          check: `${bigger} is larger than ${Math.min(dropA, dropB)}, so it is indeed the bigger fall.`,
        } };
    },
  },
  order_reasoning_table: {
    difficulties: [3, 4],
    build(d) {
      const n = d <= 3 ? 4 : 5;
      const lo = d <= 3 ? -10 : -15, hi = d <= 3 ? 10 : 20;
      const towns = ["Aldmoor", "Riverby", "Halden", "Combe Ferry", "Wickstead"];
      const set = new Set();
      let guard = 0;
      while (set.size < n && guard < 300) { guard++; set.add(rand(lo, hi)); }
      if (set.size < n) return null;
      const temps = [...set];
      const themax = Math.max(...temps), themin = Math.min(...temps);
      const rangeVal = themax - themin;
      const desc = temps.map((t, i) => `${towns[i]} ${t}°C`).join(", ");
      const pool = [themax + themin, Math.abs(themax) - Math.abs(themin), rangeVal + 2, rangeVal - 2]
        .filter((x) => Number.isFinite(x) && x !== rangeVal);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(rangeVal, decoys);
      return { q: `Here are the overnight temperatures in ${n} towns: ${desc}. What is the difference between the warmest and coldest temperature?`, options, correctIndex,
        hint: "This is a range-across-several-readings question. First find the warmest and coldest readings in the list, then find the gap between just those two.",
        solution: {
          scenario: `The readings are: ${desc}.`,
          idea: "The range of a set of readings is the gap between the single warmest and single coldest values; every other reading is ignored once those two are found.",
          method: ["Scan the list for the warmest (largest) and coldest (smallest) readings.", "Subtract the coldest from the warmest."],
          steps: [`Warmest: ${themax}°C. Coldest: ${themin}°C.`, `${themax} − ${themin} = ${rangeVal}.`],
          check: `${themin} + ${rangeVal} = ${themax}, confirming the gap.`,
        } };
    },
  },
  multi_step_interval_word: {
    difficulties: [3, 4],
    build(d) {
      let start;
      do { start = d <= 3 ? rand(-6, 6) : rand(-10, 10); } while (start === 0);
      const amt1 = d <= 3 ? rand(4, 10) : rand(6, 16);
      const dir1 = pick(["rises", "falls"]);
      const mid = dir1 === "rises" ? start + amt1 : start - amt1;
      const amt2 = d <= 3 ? rand(3, 9) : rand(5, 14);
      const dir2 = pick(["rises", "falls"]);
      const end = dir2 === "rises" ? mid + amt2 : mid - amt2;
      const net = end - start;
      if (net === 0) return null;
      const correctDir = net > 0 ? "rise" : "fall";
      const correctMag = Math.abs(net);
      const wordFor = (m) => (m === 1 ? "degree" : "degrees");
      const correctStr = `a ${correctDir} of ${correctMag} ${wordFor(correctMag)}`;
      const oppositeDirStr = `a ${correctDir === "rise" ? "fall" : "rise"} of ${correctMag} ${wordFor(correctMag)}`;
      const magPlus = correctMag + 2, magMinus = Math.max(1, correctMag - 2);
      const magPlusStr = `a ${correctDir} of ${magPlus} ${wordFor(magPlus)}`;
      const magMinusStr = `a ${correctDir} of ${magMinus} ${wordFor(magMinus)}`;
      const firstStepOnlyMag = amt1;
      const firstStepOnlyDir = dir1 === "rises" ? "rise" : "fall";
      const firstStepOnlyStr = `a ${firstStepOnlyDir} of ${firstStepOnlyMag} ${wordFor(firstStepOnlyMag)}`;
      const candidates = [oppositeDirStr, magPlusStr, magMinusStr, firstStepOnlyStr];
      const decoys = [...new Set(candidates)].filter((s) => s !== correctStr);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correctStr, decoys);
      const dir1Past = dir1 === "rises" ? "risen" : "fallen";
      const dir2Past = dir2 === "rises" ? "risen" : "fallen";
      return { q: `At 6am the temperature was ${start}°C. By midday it had ${dir1Past} by ${amt1} degrees. By midnight it had ${dir2Past} by ${amt2} degrees from the midday temperature. Overall, was there a rise or a fall from 6am to midnight, and by how much?`, options, correctIndex,
        hint: "This is a two-step net-change question. Work out the midday temperature first, then the midnight temperature, then compare midnight straight back to the very first (6am) reading.",
        solution: {
          scenario: `The temperature starts at ${start}°C at 6am, ${dir1} by ${amt1} degrees by midday, then ${dir2} by ${amt2} degrees by midnight.`,
          idea: "The overall change ignores the middle reading entirely: it only compares the very first and very last readings.",
          method: ["Work out the midday reading from the 6am reading.", "Work out the midnight reading from the midday reading.", "Compare the midnight reading directly back to the 6am reading."],
          steps: [`Midday: ${start} ${dir1 === "rises" ? "+" : "−"} ${amt1} = ${mid}.`, `Midnight: ${mid} ${dir2 === "rises" ? "+" : "−"} ${amt2} = ${end}.`, `Overall change: ${end} − ${start} = ${net}, which is ${correctStr}.`],
          check: `${start} plus a ${correctDir} of ${correctMag} gives ${end}, matching the midnight reading.`,
        } };
    },
  },
  sequence_gap_stepped: {
    difficulties: [3, 4],
    build(d) {
      const step = d <= 3 ? pick([2, 3, 4, 5]) : pick([3, 4, 5, 6, 7]);
      const start = -step * (d <= 3 ? rand(2, 4) : rand(3, 6)) - rand(0, step - 1);
      let t = start, count = 0, guard = 0;
      while (t < 0 && guard < 100) { count++; t += step; guard++; }
      if (count < 2 || count > 9) return null;
      const shown = [0, 1, 2, 3].map((i) => start + i * step);
      const pool = [count + 1, count - 1, count + 2, Math.round(Math.abs(start) / step)]
        .filter((x) => Number.isFinite(x) && x > 0 && x !== count);
      const decoys = [...new Set(pool)];
      const { options, correctIndex } = buildMC(count, decoys);
      return { q: `A sequence starts at ${start} and goes up in steps of ${step}: ${shown.join(", ")}, ... . How many terms in the sequence are negative before it reaches zero or a positive number?`, options, correctIndex,
        hint: "This is a crossing-zero counting question. List the terms out one at a time and count how many come before the sequence first reaches zero or turns positive.",
        solution: {
          scenario: `The sequence starts at ${start} and goes up in steps of ${step}.`,
          idea: "Since the sequence only ever adds the same step size, the number of negative terms can be found simply by listing terms one by one until the value stops being negative.",
          method: ["Write out the sequence term by term, adding the step size each time.", "Count how many terms come before the first term that is zero or positive."],
          steps: [`Listing terms: ${(() => { const arr = []; let v = start; for (let i = 0; i <= count; i++) { arr.push(v); v += step; } return arr.join(", "); })()}.`, `${count} of these terms are negative before the sequence reaches zero or positive.`],
          check: `The term right after those ${count} negative terms is ${start + count * step}, which is zero or positive.`,
        } };
    },
  },
  compound_word_problem_two_changes: {
    difficulties: [4],
    build() {
      const startDebt = rand(20, 80);
      const start = -startDebt;
      const deposit = rand(Math.max(10, startDebt - 15), startDebt + 60);
      const mid = start + deposit;
      if (mid === 0) return null;
      const spend = rand(10, 60);
      const end = mid - spend;
      if (end === 0) return null;
      const nm = N1();
      const label = (v) => (v >= 0 ? `£${v} in credit` : `£${Math.abs(v)} overdrawn`);
      const correctStr = label(end);
      const oppositeStr = label(-end);
      const forgotSpendStr = label(mid);
      const addedSpendStr = label(mid + spend);
      const offByStr = label(end + 5 * (end >= 0 ? 1 : -1));
      const candidates = [oppositeStr, forgotSpendStr, addedSpendStr, offByStr];
      const decoys = [...new Set(candidates)].filter((s) => s !== correctStr);
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correctStr, decoys);
      return { q: `${nm}'s bank balance is £${startDebt} overdrawn (a balance of -£${startDebt}). ${nm} pays in £${deposit}, then spends £${spend}. What is ${nm}'s balance now?`, options, correctIndex,
        hint: "This is a money crossing-zero question. Being overdrawn is a negative balance: add the deposit, then subtract the spending, in that order, then check whether the result is positive (in credit) or negative (overdrawn).",
        solution: {
          scenario: `${nm} starts £${startDebt} overdrawn, pays in £${deposit}, then spends £${spend}.`,
          idea: "A bank balance works exactly like a number line: overdrawn means negative, in credit means positive, and paying in or spending money moves the balance up or down just like adding or subtracting.",
          method: ["Add the deposit to the starting (negative) balance.", "Subtract the amount spent from that new balance.", "Decide whether the final balance is positive (in credit) or negative (overdrawn)."],
          steps: [`${start} + ${deposit} = ${mid}.`, `${mid} − ${spend} = ${end}.`],
          check: `${end} is ${end >= 0 ? "positive, so " + nm + " is in credit." : "negative, so " + nm + " is still overdrawn."}`,
        } };
    },
  },
};
// Structure registry for decimalPlaceValue. Wrapped in an IIFE so the shift/format helper
// functions (shiftPoint, dpCount, bumpLastDigit) stay scoped locally rather than polluting
// the module namespace — they're only needed by this topic's ×/÷ power-of-ten structures.
const DECIMAL_PLACE_VALUE_STRUCTURES = (() => {
  function shiftPoint(numStr, steps) {
    const [wholePart, fracPart = ""] = numStr.split(".");
    let digits = wholePart + fracPart;
    let pointPos = wholePart.length + steps;
    while (pointPos > digits.length) digits += "0";
    while (pointPos < 0) { digits = "0" + digits; pointPos++; }
    const intPart = digits.slice(0, pointPos) || "0";
    const fracOut = digits.slice(pointPos).replace(/0+$/, "");
    const intClean = String(Number(intPart));
    return fracOut ? `${intClean}.${fracOut}` : intClean;
  }
  function dpCount(s) { const i = s.indexOf("."); return i === -1 ? 0 : s.length - i - 1; }
  function bumpLastDigit(s, delta) {
    const idx = s.length - 1;
    const d = Number(s[idx]);
    const nd = ((d + delta) % 10 + 10) % 10;
    return s.slice(0, idx) + nd + s.slice(idx + 1);
  }

  return {
    digit_value_from_place: {
      difficulties: [1, 2],
      build(d) {
        const dp = d <= 1 ? 1 : 2;
        const whole = d <= 1 ? rand(1, 20) : rand(1, 99);
        const fracDigits = Array.from({ length: dp }, () => rand(0, 9));
        const posIdx = rand(0, dp - 1);
        if (fracDigits[posIdx] === 0) fracDigits[posIdx] = rand(1, 9);
        const digit = fracDigits[posIdx];
        const place = posIdx + 1;
        const placeNames = ["tenths", "hundredths"];
        const numStr = `${whole}.${fracDigits.join("")}`;
        const value = digit / Math.pow(10, place);
        const altDigit = digit === 9 ? digit - 1 : digit + 1;
        const decoys = [digit, digit * 10, altDigit / Math.pow(10, place)];
        const { options, correctIndex } = buildMC(value, decoys, (x) => x.toFixed(place));
        return {
          q: `What is the value of the digit ${digit} in the number ${numStr}?`,
          options, correctIndex,
          hint: "This is a decimal place value question. After the decimal point, the columns are tenths (divide by 10), then hundredths (divide by 100). The value of a digit is the digit divided by its column, not just the bare digit.",
          solution: {
            scenario: `The number is ${numStr}. We want the value of the digit ${digit}.`,
            idea: "Each place after the decimal point is worth a fraction of one: the first place is tenths, the second is hundredths. A digit's value is the digit divided by its column's power of ten.",
            method: ["Find which place after the point the digit sits in.", "Work out what that place is worth.", "Divide the digit by that place value's power of ten."],
            steps: [`The digit ${digit} is in the ${placeNames[posIdx]} place.`, `Its value is ${digit} ÷ ${Math.pow(10, place)} = ${value.toFixed(place)}.`],
            check: `${value.toFixed(place)} has the digit ${digit} sitting exactly in the ${placeNames[posIdx]} column of ${numStr}.`,
          },
        };
      },
    },
    digit_from_named_place: {
      difficulties: [1, 2],
      build(d) {
        const dp = d <= 1 ? 1 : 2;
        const whole = d <= 1 ? rand(1, 50) : rand(1, 99);
        const fracDigits = Array.from({ length: dp }, () => rand(0, 9));
        const askPos = rand(0, dp - 1);
        const digit = fracDigits[askPos];
        const placeNames = ["tenths", "hundredths"];
        const numStr = `${whole}.${fracDigits.join("")}`;
        const otherDigits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== digit)).slice(0, 4);
        const { options, correctIndex } = buildMC(digit, otherDigits);
        return {
          q: `In the number ${numStr}, what digit is in the ${placeNames[askPos]} place?`,
          options, correctIndex,
          hint: "This is a read the digit question. Find the place named in the question, counting from the decimal point, then read off whichever digit sits there.",
          solution: {
            scenario: `We need to find which digit sits in the ${placeNames[askPos]} place of ${numStr}.`,
            idea: "Every place after the decimal point is a fixed slot: tenths first, then hundredths. Find the named slot and read off the digit written there.",
            method: ["Count along from the decimal point to find the named place.", "Read off the digit sitting in that place."],
            steps: [`Counting from the decimal point, the ${placeNames[askPos]} place in ${numStr} holds the digit ${digit}.`],
            check: `Putting ${digit} back in the ${placeNames[askPos]} place rebuilds ${numStr}.`,
          },
        };
      },
    },
    place_name_from_digit: {
      difficulties: [1, 2],
      build(d) {
        const dp = d <= 1 ? 1 : 2;
        const whole = d <= 1 ? rand(1, 50) : rand(1, 99);
        const fracDigits = Array.from({ length: dp }, () => rand(0, 9));
        const askPos = rand(0, dp - 1);
        const digit = fracDigits[askPos];
        const placeNames = ["tenths", "hundredths"];
        const correctName = placeNames[askPos];
        const numStr = `${whole}.${fracDigits.join("")}`;
        const decoyPool = ["ones", "tens", "hundreds", "tenths", "hundredths", "thousandths"].filter((n) => n !== correctName);
        const decoys = shuffle(decoyPool).slice(0, 4);
        const { options, correctIndex } = buildMCStr(correctName, decoys);
        return {
          q: `In the number ${numStr}, which place is the digit ${digit} in?`,
          options, correctIndex,
          hint: "This is a name the place question. Find where the digit sits, counting places from the decimal point (tenths, then hundredths), and name that place.",
          solution: {
            scenario: `We need to say which place the digit ${digit} occupies in ${numStr}.`,
            idea: "Each position after the decimal point has its own name, counting from the point outward: tenths, then hundredths.",
            method: ["Find the digit in the number.", "Count places from the decimal point to name its position."],
            steps: [`Counting from the decimal point, the digit ${digit} is in the ${correctName} place.`],
            check: `The ${correctName} place in ${numStr} does hold ${digit}.`,
          },
        };
      },
    },
    compose_from_named_parts: {
      difficulties: [1, 2],
      build(d) {
        if (d <= 1) {
          const whole = rand(1, 50);
          const tenths = rand(1, 9);
          const numTenths = whole * 10 + tenths;
          const num = numTenths / 10;
          const desc = `${whole} ones and ${tenths} tenths`;
          const decoyTenths = [whole + tenths, numTenths + 1, numTenths - 1];
          const decoys = decoyTenths.filter((x) => x !== numTenths && x >= 0).map((x) => x / 10);
          const { options, correctIndex } = buildMC(num, decoys, (x) => (Math.round(x * 10) / 10).toFixed(1));
          return {
            q: `A number is made from ${desc}. What is the number?`,
            options, correctIndex,
            hint: "This is a build the number question. Write the ones in front of the decimal point, then place the tenths straight after it.",
            solution: {
              scenario: `A number is made from ${desc}. We need to work out what the number is.`,
              idea: "A decimal can be split into place value parts: ones before the point, tenths straight after it.",
              method: ["Write the ones part in front of the decimal point.", "Write the tenths part in the first decimal place."],
              steps: [`${whole} ones and ${tenths} tenths make ${num.toFixed(1)}.`],
              check: `Reading ${num.toFixed(1)} back gives ${whole} ones and ${tenths} tenths, matching the parts given.`,
            },
          };
        }
        const whole = rand(1, 40);
        const tenths = rand(1, 9);
        const hundredths = rand(0, 9);
        const numCents = whole * 100 + tenths * 10 + hundredths;
        const num = numCents / 100;
        const desc = hundredths ? `${whole} ones, ${tenths} tenths and ${hundredths} hundredths` : `${whole} ones and ${tenths} tenths`;
        const decoyCents = [whole * 100 + hundredths * 10 + tenths, (whole + tenths + hundredths) * 100, numCents + 10, numCents - 10];
        const decoys = decoyCents.filter((x) => x !== numCents && x >= 0).map((x) => x / 100);
        const { options, correctIndex } = buildMC(num, decoys, (x) => (Math.round(x * 100) / 100).toFixed(2));
        return {
          q: `A number is made from ${desc}. What is the number?`,
          options, correctIndex,
          hint: "This is a build the number question. Write the ones in front of the decimal point, then tenths in the first decimal place and hundredths in the second. Do not mix up the order.",
          solution: {
            scenario: `A number is made from ${desc}. We need to work out what the number is.`,
            idea: "A decimal can be split into place value parts: ones before the point, tenths in the first decimal place, hundredths in the second.",
            method: ["Write the ones part in front of the decimal point.", "Write the tenths digit straight after the point.", "Write the hundredths digit after that."],
            steps: [`${desc} makes ${num.toFixed(2)}.`],
            check: `Reading ${num.toFixed(2)} back digit by digit matches the parts given.`,
          },
        };
      },
    },
    fraction_decimal_equivalence: {
      difficulties: [1, 2],
      build(d) {
        const smallTable = [["1/2", 0.5], ["1/4", 0.25], ["3/4", 0.75], ["1/10", 0.1], ["1/5", 0.2]];
        const fullTable = [["1/2", 0.5], ["1/4", 0.25], ["3/4", 0.75], ["1/5", 0.2], ["2/5", 0.4], ["3/5", 0.6], ["4/5", 0.8], ["1/10", 0.1], ["3/10", 0.3], ["7/10", 0.7], ["9/10", 0.9]];
        const table = d <= 1 ? smallTable : fullTable;
        const [fracStr, dec] = pick(table);
        const askDecimal = pick([true, false]);
        if (askDecimal) {
          const decoyVals = shuffle(table.filter(([, v]) => v !== dec).map(([, v]) => v)).slice(0, 4);
          const { options, correctIndex } = buildMC(dec, decoyVals, (x) => (Math.round(x * 100) / 100).toFixed(2));
          return {
            q: `What is ${fracStr} as a decimal?`,
            options, correctIndex,
            hint: "Knowing the fraction to decimal equivalents for common fractions is very useful. Key ones: 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75, 1/5 = 0.2, 1/10 = 0.1. If you do not recall it, divide the numerator by the denominator.",
            solution: {
              scenario: `We need ${fracStr} written as a decimal.`,
              idea: "Common fraction to decimal equivalents are worth memorising, or found by dividing numerator by denominator.",
              method: ["Recall the equivalent, or divide the numerator by the denominator.", "Write the result as a decimal."],
              steps: [`${fracStr} = ${dec}.`],
              check: `Converting back, ${dec} matches ${fracStr}.`,
            },
          };
        }
        const decoyFracs = shuffle(table.filter(([, v]) => v !== dec).map(([f]) => f)).slice(0, 4);
        const { options, correctIndex } = buildMCStr(fracStr, decoyFracs);
        return {
          q: `What is ${dec} as a fraction?`,
          options, correctIndex,
          hint: "Converting a decimal to a fraction means recognising which common fraction it represents, or writing it over the matching power of ten and simplifying. For example, 0.4 = 4/10 = 2/5.",
          solution: {
            scenario: `We need ${dec} written as a fraction.`,
            idea: "To convert a decimal to a fraction, write it over the matching power of ten, then simplify.",
            method: ["Write the decimal over 10 or 100, matching its number of decimal places.", "Simplify the fraction."],
            steps: [`${dec} = ${fracStr}.`],
            check: `Converting ${fracStr} back to a decimal gives ${dec}.`,
          },
        };
      },
    },
    compare_mixed_length_decimals: {
      difficulties: [2, 3],
      build(d) {
        const dpChoices = d <= 2 ? [1, 2] : [1, 2, 3];
        const wholePart = rand(0, d <= 2 ? 4 : 9);
        const seen = new Set();
        const entries = [];
        let guard = 0;
        while (entries.length < 5 && guard < 400) {
          guard++;
          const dp = pick(dpChoices);
          const fracDigits = Array.from({ length: dp }, () => rand(0, 9));
          const fracStr = fracDigits.join("");
          const milli = wholePart * 1000 + Number(fracStr) * Math.pow(10, 3 - dp);
          if (seen.has(milli)) continue;
          seen.add(milli);
          entries.push({ milli, str: `${wholePart}.${fracStr}` });
        }
        if (entries.length < 5) return null;
        const wantLarger = pick([true, false]);
        const target = wantLarger ? Math.max(...entries.map((e) => e.milli)) : Math.min(...entries.map((e) => e.milli));
        const correctEntry = entries.find((e) => e.milli === target);
        const decoyStrs = entries.filter((e) => e !== correctEntry).map((e) => e.str);
        const shownOrder = shuffle(entries).map((e) => e.str);
        const { options, correctIndex } = buildMCStr(correctEntry.str, decoyStrs);
        return {
          q: `Which of these numbers is the ${wantLarger ? "largest" : "smallest"}: ${shownOrder.join(", ")}?`,
          options, correctIndex,
          hint: "Do not judge a decimal by how many digits it has. Line up the numbers by place value: compare whole numbers first, then tenths, then hundredths, then thousandths. A short decimal like 0.5 can beat a longer one like 0.35.",
          solution: {
            scenario: `We need the ${wantLarger ? "largest" : "smallest"} of: ${shownOrder.join(", ")}.`,
            idea: "More decimal digits does not mean a bigger number. Compare place by place from the decimal point outward: tenths first, then hundredths, then thousandths.",
            method: ["Line up the numbers by place value, not by length.", "Compare tenths digits first.", "Only move to hundredths, then thousandths, when tenths are tied."],
            steps: [`Comparing place by place, the ${wantLarger ? "largest" : "smallest"} number is ${correctEntry.str}.`],
            check: `No other number in the list beats ${correctEntry.str} for being the ${wantLarger ? "largest" : "smallest"}.`,
          },
        };
      },
    },
    order_four_decimals: {
      difficulties: [2, 3],
      build(d) {
        const dp = d <= 2 ? 1 : 2;
        const scale = Math.pow(10, dp);
        const nums = new Set();
        let guard = 0;
        while (nums.size < 4 && guard < 300) {
          guard++;
          const whole = d <= 2 ? rand(0, 3) : rand(0, 9);
          const fracDigits = Array.from({ length: dp }, () => rand(0, 9));
          nums.add(whole * scale + Number(fracDigits.join("")));
        }
        if (nums.size < 4) return null;
        const arr = [...nums];
        const toStr = (u) => { const whole = Math.floor(u / scale); const frac = String(u % scale).padStart(dp, "0"); return `${whole}.${frac}`; };
        const wantAsc = pick([true, false]);
        const sorted = [...arr].sort((a, b) => (wantAsc ? a - b : b - a));
        const correctStr = sorted.map(toStr).join(", ");
        function permute(a) {
          if (a.length <= 1) return [a];
          const res = [];
          for (let k = 0; k < a.length; k++) { const rest = [...a.slice(0, k), ...a.slice(k + 1)]; for (const p of permute(rest)) res.push([a[k], ...p]); }
          return res;
        }
        const allPerms = permute(arr).map((p) => p.map(toStr).join(", "));
        const wrongPerms = shuffle([...new Set(allPerms)].filter((s) => s !== correctStr));
        const decoys = wrongPerms.slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(correctStr, decoys);
        const shownArr = shuffle(arr).map(toStr).join(", ");
        return {
          q: `Put these numbers in order, from ${wantAsc ? "smallest to largest" : "largest to smallest"}: ${shownArr}.`,
          options, correctIndex,
          hint: "This is a full ordering question, not just picking one extreme. Compare each number's whole number part first, then tenths, then hundredths, working through every number.",
          solution: {
            scenario: `We need to order ${shownArr} from ${wantAsc ? "smallest to largest" : "largest to smallest"}.`,
            idea: "Ordering several decimals works the same way as comparing two: look at the whole number part first, then tenths, then hundredths, moving on only when there is a tie.",
            method: ["Compare the whole number part of every number.", "Break ties by comparing tenths, then hundredths.", "Arrange all the numbers in the required order."],
            steps: [`Comparing place by place gives the order: ${correctStr}.`],
            check: `Each number in this list is ${wantAsc ? "bigger" : "smaller"} than the one before it.`,
          },
        };
      },
    },
    multiply_divide_power_of_ten: {
      difficulties: [2, 3, 4],
      build(d) {
        if (d <= 3) {
          const wantMultiply = pick([true, false]);
          const scaleOptions = d <= 2 ? [10, 100] : [10, 100, 1000];
          const scale = pick(scaleOptions);
          const scalePow = Math.round(Math.log10(scale));
          const baseWhole = wantMultiply ? rand(0, 9) : rand(1, 9);
          const maxBaseDp = wantMultiply ? 2 : Math.max(0, 3 - scalePow);
          const baseDpOptions = Array.from({ length: maxBaseDp + 1 }, (_, i) => i).filter((v) => !wantMultiply || v >= 1);
          const baseDp = pick(baseDpOptions.length ? baseDpOptions : [0]);
          const baseFrac = baseDp === 0 ? "" : String(rand(1, Math.pow(10, baseDp) - 1)).padStart(baseDp, "0");
          const baseStr = baseFrac ? `${baseWhole}.${baseFrac}` : `${baseWhole}`;
          const steps = wantMultiply ? scalePow : -scalePow;
          const answerStr = shiftPoint(baseStr, steps);
          if (answerStr === baseStr || dpCount(answerStr) > 3) return null;
          const decoyCandidates = [baseStr, shiftPoint(baseStr, -steps), bumpLastDigit(answerStr, 1), bumpLastDigit(answerStr, -1), bumpLastDigit(answerStr, 3)];
          const decoys = [...new Set(decoyCandidates)].filter((s) => s !== answerStr && dpCount(s) <= 3);
          if (decoys.length < 4) return null;
          const { options, correctIndex } = buildMCStr(answerStr, decoys);
          return {
            q: `What is ${baseStr} ${wantMultiply ? "×" : "÷"} ${scale}?`,
            options, correctIndex,
            hint: "Multiplying by 10, 100 or 1000 shifts the decimal point right by 1, 2 or 3 places. Dividing shifts it left by the same number of places. Think of the digits shifting relative to a fixed decimal point.",
            solution: {
              scenario: `We need ${baseStr} ${wantMultiply ? "×" : "÷"} ${scale}.`,
              idea: "Multiplying by a power of ten shifts the decimal point right; dividing shifts it left, by one place for every zero in the power of ten.",
              method: [`Count the zeros in ${scale}: that is how many places the point moves.`, `Move the decimal point ${wantMultiply ? "right" : "left"}.`],
              steps: [`${wantMultiply ? "Multiplying" : "Dividing"} by ${scale} moves the point ${scalePow} place${scalePow > 1 ? "s" : ""} to the ${wantMultiply ? "right" : "left"}.`, `${baseStr} ${wantMultiply ? "×" : "÷"} ${scale} = ${answerStr}.`],
              check: `Reversing the operation on ${answerStr} gets back to ${baseStr}.`,
            },
          };
        }
        const baseWhole = rand(0, 9);
        const baseDp = pick([1, 2]);
        const baseFrac = String(rand(1, Math.pow(10, baseDp) - 1)).padStart(baseDp, "0");
        const baseStr = `${baseWhole}.${baseFrac}`;
        const step1Mult = pick([true, false]);
        const scale1 = pick([10, 100]);
        const step2Mult = pick([true, false]);
        const scale2 = pick([10, 100]);
        const steps1 = (step1Mult ? 1 : -1) * Math.round(Math.log10(scale1));
        const steps2 = (step2Mult ? 1 : -1) * Math.round(Math.log10(scale2));
        const afterStep1 = shiftPoint(baseStr, steps1);
        const answerStr = shiftPoint(afterStep1, steps2);
        if (answerStr === baseStr || dpCount(afterStep1) > 3 || dpCount(answerStr) > 3) return null;
        const decoyCandidates = [afterStep1, baseStr, bumpLastDigit(answerStr, 1), bumpLastDigit(answerStr, -1), bumpLastDigit(answerStr, 3)];
        const decoys = [...new Set(decoyCandidates)].filter((s) => s !== answerStr && dpCount(s) <= 3);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(answerStr, decoys);
        return {
          q: `A number is ${step1Mult ? "multiplied" : "divided"} by ${scale1}, then the result is ${step2Mult ? "multiplied" : "divided"} by ${scale2}. Starting from ${baseStr}, what is the final result?`,
          options, correctIndex,
          hint: "Do the two steps one at a time, in order. Work out the result of the first step fully, then apply the second step to that result, not to the original number.",
          solution: {
            scenario: `We start with ${baseStr}, ${step1Mult ? "multiply" : "divide"} by ${scale1}, then ${step2Mult ? "multiply" : "divide"} the result by ${scale2}.`,
            idea: "A chain of decimal point shifts is done one step at a time: finish the first shift completely before starting the second.",
            method: [`${step1Mult ? "Multiply" : "Divide"} ${baseStr} by ${scale1} first.`, `${step2Mult ? "Multiply" : "Divide"} that result by ${scale2}.`],
            steps: [`${baseStr} ${step1Mult ? "×" : "÷"} ${scale1} = ${afterStep1}.`, `${afterStep1} ${step2Mult ? "×" : "÷"} ${scale2} = ${answerStr}.`],
            check: `Undoing both steps in reverse on ${answerStr} gets back to ${baseStr}.`,
          },
        };
      },
    },
    skip_counting_decimal_steps: {
      difficulties: [2, 3],
      build(d) {
        const step = d <= 2 ? pick([0.1, 0.2, 0.5]) : pick([0.1, 0.2, 0.25, 0.5, 0.75]);
        const stepCents = Math.round(step * 100);
        const startAt = pick([0, step]);
        const startCents = Math.round(startAt * 100);
        const n = d <= 2 ? rand(4, 10) : rand(8, 20);
        const answerCents = startCents + stepCents * (n - 1);
        const answer = answerCents / 100;
        const fmt = (x) => String(Math.round(x * 100) / 100);
        const decoyCents = [answerCents + stepCents, answerCents - stepCents, startCents + stepCents * n, stepCents * (n - 1)];
        const decoys = [...new Set(decoyCents)].filter((c) => c !== answerCents && c >= 0).map((c) => c / 100);
        const secondTerm = startAt + step;
        const thirdTerm = startAt + 2 * step;
        const { options, correctIndex } = buildMC(answer, decoys, fmt);
        return {
          q: `Counting in steps of ${step} starting at ${startAt}: ${startAt}, ${Math.round(secondTerm * 100) / 100}, ${Math.round(thirdTerm * 100) / 100}, ... What is the ${n}th number in this count?`,
          options, correctIndex,
          hint: "Skip-counting with decimals follows the same rule as whole numbers. The nth term is: start + (n − 1) × step. Working in whole hundredths avoids messy decimal arithmetic.",
          solution: {
            scenario: `We are counting in steps of ${step} starting at ${startAt}, and want the ${n}th number.`,
            idea: "The nth term of a skip-counting sequence is the start plus (n − 1) lots of the step size.",
            method: ["Work out how many steps are needed to reach the nth term (that is n − 1 steps).", "Multiply the step size by that many steps.", "Add the result to the start."],
            steps: [`The ${n}th number is ${startAt} + ${n - 1} × ${step} = ${answer}.`],
            check: `Counting forward step by step from ${startAt} for ${n - 1} steps lands on ${answer}.`,
          },
        };
      },
    },
    missing_value_reverse_operation: {
      difficulties: [3, 4],
      build(d) {
        if (d === 3) {
          const op = pick(["multiply", "divide"]);
          const scale = pick([10, 100]);
          const scalePow = Math.round(Math.log10(scale));
          const resultWhole = rand(1, 90);
          const resultDp = pick([0, 1]);
          const resultFrac = resultDp === 0 ? "" : String(rand(1, 9));
          const resultStr = resultFrac ? `${resultWhole}.${resultFrac}` : `${resultWhole}`;
          const invertSteps = op === "multiply" ? -scalePow : scalePow;
          const originalStr = shiftPoint(resultStr, invertSteps);
          if (originalStr === resultStr || dpCount(originalStr) > 3) return null;
          const decoyCandidates = [shiftPoint(resultStr, -invertSteps), resultStr, bumpLastDigit(originalStr, 1), bumpLastDigit(originalStr, -1), bumpLastDigit(originalStr, 3)];
          const decoys = [...new Set(decoyCandidates)].filter((s) => s !== originalStr && dpCount(s) <= 3);
          if (decoys.length < 4) return null;
          const { options, correctIndex } = buildMCStr(originalStr, decoys);
          return {
            q: `A number is ${op === "multiply" ? "multiplied" : "divided"} by ${scale} to give ${resultStr}. What was the original number?`,
            options, correctIndex,
            hint: "Work backwards by undoing the operation: if the number was multiplied, divide the result back down; if it was divided, multiply the result back up.",
            solution: {
              scenario: `A number was ${op === "multiply" ? "multiplied" : "divided"} by ${scale}, giving ${resultStr}. We need the original number.`,
              idea: "To undo a multiplication or division, apply the opposite operation to the result.",
              method: [`The forward step was ${op === "multiply" ? "× " + scale : "÷ " + scale}.`, `Undo it with ${op === "multiply" ? "÷ " + scale : "× " + scale}.`],
              steps: [`${resultStr} ${op === "multiply" ? "÷" : "×"} ${scale} = ${originalStr}.`],
              check: `${originalStr} ${op === "multiply" ? "×" : "÷"} ${scale} = ${resultStr}, matching the given result.`,
            },
          };
        }
        const op1 = pick(["multiply", "divide"]);
        const scale1 = pick([10, 100]);
        const op2 = pick(["multiply", "divide"]);
        const scale2 = pick([10, 100]);
        const steps1 = (op1 === "multiply" ? 1 : -1) * Math.round(Math.log10(scale1));
        const steps2 = (op2 === "multiply" ? 1 : -1) * Math.round(Math.log10(scale2));
        const resultWhole = rand(1, 90);
        const resultDp = pick([0, 1]);
        const resultFrac = resultDp === 0 ? "" : String(rand(1, 9));
        const resultStr = resultFrac ? `${resultWhole}.${resultFrac}` : `${resultWhole}`;
        const netSteps = steps1 + steps2;
        const originalStr = shiftPoint(resultStr, -netSteps);
        if (originalStr === resultStr || dpCount(originalStr) > 3) return null;
        const undoStep2 = shiftPoint(resultStr, -steps2);
        if (dpCount(undoStep2) > 3) return null;
        const decoyCandidates = [undoStep2, resultStr, bumpLastDigit(originalStr, 1), bumpLastDigit(originalStr, -1), bumpLastDigit(originalStr, 3)];
        const decoys = [...new Set(decoyCandidates)].filter((s) => s !== originalStr && dpCount(s) <= 3);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(originalStr, decoys);
        return {
          q: `A number is ${op1 === "multiply" ? "multiplied" : "divided"} by ${scale1}, then the result is ${op2 === "multiply" ? "multiplied" : "divided"} by ${scale2}, giving ${resultStr}. What was the original number?`,
          options, correctIndex,
          hint: "Undo a chain of steps by reversing BOTH the operations and their order: undo the last thing that happened first.",
          solution: {
            scenario: `Starting from an unknown number, ${op1 === "multiply" ? "multiplying" : "dividing"} by ${scale1} then ${op2 === "multiply" ? "multiplying" : "dividing"} by ${scale2} gives ${resultStr}.`,
            idea: "To undo a chain of operations, work backwards from the end: undo the last step first, then the one before it.",
            method: [`Undo the second step: ${op2 === "multiply" ? "divide" : "multiply"} ${resultStr} by ${scale2}.`, `Undo the first step: ${op1 === "multiply" ? "divide" : "multiply"} that result by ${scale1}.`],
            steps: [`${resultStr} ${op2 === "multiply" ? "÷" : "×"} ${scale2} = ${undoStep2}.`, `${undoStep2} ${op1 === "multiply" ? "÷" : "×"} ${scale1} = ${originalStr}.`],
            check: `Applying both original steps to ${originalStr} rebuilds ${resultStr}.`,
          },
        };
      },
    },
    missing_addend_to_target: {
      difficulties: [3, 4],
      build(d) {
        if (d === 3) {
          const dp = pick([1, 2]);
          const scale = Math.pow(10, dp);
          const T = rand(2, 12);
          const addendUnits = rand(1, T * scale - 1);
          const missingUnits = T * scale - addendUnits;
          const fmtN = (u) => { const whole = Math.floor(u / scale); const frac = u % scale; return frac === 0 ? `${whole}` : `${whole}.${String(frac).padStart(dp, "0")}`; };
          const addendStr = fmtN(addendUnits);
          const missingStr = fmtN(missingUnits);
          const decoyUnits = [addendUnits, missingUnits + scale, missingUnits - 1, missingUnits + 1, T * scale - addendUnits - 1];
          const decoyStrs = [...new Set(decoyUnits.filter((u) => u !== missingUnits && u >= 0).map(fmtN))].filter((s) => s !== missingStr);
          if (decoyStrs.length < 4) return null;
          const { options, correctIndex } = buildMCStr(missingStr, decoyStrs);
          return {
            q: `${addendStr} + ? = ${T}. What is the missing number?`,
            options, correctIndex,
            hint: "Subtract the known part from the whole to find the missing part: total minus what you already have.",
            solution: {
              scenario: `${addendStr} plus a missing number makes ${T}.`,
              idea: "If two parts add to make a whole and you know the whole and one part, subtracting the known part from the whole gives the missing part.",
              method: ["Take the known addend away from the target total.", "The result is the missing number."],
              steps: [`${T} − ${addendStr} = ${missingStr}.`],
              check: `Adding back: ${addendStr} + ${missingStr} = ${T}.`,
            },
          };
        }
        const wholeT = rand(1, 8);
        const tenthsT = rand(0, 9);
        const hundredthsT = rand(1, 9);
        const targetUnits = wholeT * 100 + tenthsT * 10 + hundredthsT;
        const addendTenthsDigit = rand(1, 9);
        const addendUnits = addendTenthsDigit * 10;
        if (addendUnits >= targetUnits) return null;
        const missingUnits = targetUnits - addendUnits;
        const fmt2 = (u) => `${Math.floor(u / 100)}.${String(u % 100).padStart(2, "0")}`;
        const addendStr = `0.${addendTenthsDigit}`;
        const alignedAddendStr = fmt2(addendUnits);
        const targetStr = fmt2(targetUnits);
        const missingStr = fmt2(missingUnits);
        const decoyUnits = [addendUnits, missingUnits + 100, missingUnits - 10, missingUnits + 1, missingUnits - 1, targetUnits - addendTenthsDigit];
        const decoyStrs = [...new Set(decoyUnits.filter((u) => u !== missingUnits && u >= 0).map(fmt2))].filter((s) => s !== missingStr);
        if (decoyStrs.length < 4) return null;
        const { options, correctIndex } = buildMCStr(missingStr, decoyStrs);
        return {
          q: `${addendStr} + ? = ${targetStr}. What is the missing number?`,
          options, correctIndex,
          hint: "Line up the decimal points before subtracting. The addend has only a tenths digit, so its hundredths digit is 0: write it as such before you subtract, column by column.",
          solution: {
            scenario: `${addendStr} plus a missing number makes ${targetStr}, but the two numbers have a different number of decimal places.`,
            idea: "When adding or subtracting decimals with a different number of decimal places, line them up by the decimal point, not by their rightmost digit, filling empty columns with 0.",
            method: [`Write ${addendStr} as ${alignedAddendStr} so both numbers have the same number of decimal places.`, `Subtract from the target: ${targetStr} − ${alignedAddendStr}.`],
            steps: [`${targetStr} − ${alignedAddendStr} = ${missingStr}.`],
            check: `Adding back: ${addendStr} + ${missingStr} = ${targetStr}.`,
          },
        };
      },
    },
    equivalent_decimal_representations: {
      difficulties: [3, 4],
      build(d) {
        const TABLE = [
          { dec: "0.5", dec2: "0.50", frac: "1/2", frac2: "50/100" },
          { dec: "0.6", dec2: "0.60", frac: "3/5", frac2: "60/100" },
          { dec: "0.4", dec2: "0.40", frac: "2/5", frac2: "40/100" },
          { dec: "0.2", dec2: "0.20", frac: "1/5", frac2: "20/100" },
          { dec: "0.8", dec2: "0.80", frac: "4/5", frac2: "80/100" },
          { dec: "0.25", dec2: "0.250", frac: "1/4", frac2: "25/100" },
          { dec: "0.75", dec2: "0.750", frac: "3/4", frac2: "75/100" },
        ];
        const entry = pick(TABLE);
        const trueOptions = [entry.dec, entry.dec2, entry.frac, entry.frac2];
        const fracDigits = entry.dec.split(".")[1];
        let trapStr;
        if (d <= 3 || fracDigits.length < 2 || fracDigits[0] === fracDigits[1]) {
          trapStr = "0.0" + fracDigits;
        } else {
          trapStr = "0." + fracDigits.split("").reverse().join("");
        }
        const { options, correctIndex } = buildMCStr(trapStr, trueOptions);
        return {
          q: `Which of these is NOT equal to ${entry.dec}?`,
          options, correctIndex,
          hint: "A decimal can be written in more than one way: with an extra zero on the end, or as a fraction. Check each option's actual value, not just how it looks.",
          solution: {
            scenario: `We need to spot which of these is NOT equal to ${entry.dec}.`,
            idea: "Adding a zero at the END of a decimal (after the last digit) does not change its value, but adding a zero right after the decimal point does, because it shifts every digit into a smaller column.",
            method: [`Check whether each option represents the same value as ${entry.dec}.`, "Watch especially for extra zeros placed right after the decimal point, which do change the value."],
            steps: [`${entry.dec}, ${entry.dec2}, ${entry.frac} and ${entry.frac2} are all the same value.`, `${trapStr} is a different value.`],
            check: `${trapStr} is not equal to ${entry.dec}, so it is the odd one out.`,
          },
        };
      },
    },
    thousandths_fraction_decimal: {
      difficulties: [4],
      build(d) {
        const numerator = rand(1, 999);
        const decStr = "0." + String(numerator).padStart(3, "0");
        const askDecimal = pick([true, false]);
        if (askDecimal) {
          const reversedDigits = String(numerator).padStart(3, "0").split("").reverse().join("");
          const decoyCandidates = [
            "0." + String(numerator).padStart(4, "0"),
            "0." + String(numerator),
            "0." + reversedDigits,
            "0.0" + String(numerator).padStart(3, "0"),
          ];
          const decoys = [...new Set(decoyCandidates)].filter((s) => s !== decStr);
          if (decoys.length < 4) return null;
          const { options, correctIndex } = buildMCStr(decStr, decoys);
          return {
            q: `What is ${numerator}/1000 as a decimal?`,
            options, correctIndex,
            hint: "Thousandths is the third place after the decimal point. Write the numerator so it fills three decimal places exactly, padding with leading zeros if it has fewer than three digits.",
            solution: {
              scenario: `We need ${numerator}/1000 written as a decimal.`,
              idea: "A fraction over 1000 is read in thousandths: the third place after the decimal point. Write the numerator using exactly three digits, adding leading zeros if needed.",
              method: ["Write the numerator with exactly three digits, padding with zeros on the left if needed.", "Place a decimal point in front of those three digits."],
              steps: [`${numerator} padded to three digits is ${String(numerator).padStart(3, "0")}.`, `${numerator}/1000 = ${decStr}.`],
              check: `${decStr} has ${numerator} in its final three decimal places, matching thousandths.`,
            },
          };
        }
        const correctFrac = `${numerator}/1000`;
        const decoyFracs = [
          `${numerator}/100`,
          `${numerator}/10000`,
          `${Number(String(numerator).padStart(3, "0").split("").reverse().join(""))}/1000`,
          `${numerator + 1}/1000`,
        ];
        const decoys = [...new Set(decoyFracs)].filter((s) => s !== correctFrac);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(correctFrac, decoys);
        return {
          q: `What is ${decStr} as a fraction, in thousandths?`,
          options, correctIndex,
          hint: "Thousandths means the denominator is 1000. Read the three digits after the decimal point as the numerator.",
          solution: {
            scenario: `We need ${decStr} written as a fraction in thousandths.`,
            idea: "A decimal with three decimal places can be written directly as a fraction over 1000: the digits after the point become the numerator.",
            method: ["Read the three digits after the decimal point.", "Write them as the numerator over 1000."],
            steps: [`${decStr} = ${correctFrac}.`],
            check: `${correctFrac} converts back to ${decStr}.`,
          },
        };
      },
    },
  };
})();
// Structure registry for unitConversion. Metric length/mass/capacity + money conversion,
// both directions, plus decimal-of-a-unit, cross-unit comparison, mixed-unit sums/
// differences, and a two-step chained conversion at the hardest band.
const UNIT_CONVERSION_STRUCTURES = (() => {
  const CONVS = [
    { big: "km", small: "m", factor: 1000 },
    { big: "m", small: "cm", factor: 100 },
    { big: "cm", small: "mm", factor: 10 },
    { big: "kg", small: "g", factor: 1000 },
    { big: "l", small: "ml", factor: 1000 },
  ];
  const BIG_CONVS = CONVS.filter((c) => c.factor >= 100);
  const MIXED = [
    { unit: "cm", bigUnit: "m", factor: 100 },
    { unit: "g", bigUnit: "kg", factor: 1000 },
    { unit: "ml", bigUnit: "l", factor: 1000 },
  ];
  const r2 = (x) => Math.round(x * 100) / 100;
  const r3 = (x) => Math.round(x * 1000) / 1000;
  const fmtMoney = (p) => (p < 100 ? `${p}p` : `£${r2(p / 100).toFixed(2)}`);

  return {
    direct_convert_up: {
      difficulties: [1, 2],
      build(d) {
        const conv = pick(CONVS);
        const bigVal = d <= 1 ? rand(2, 9) : rand(2, 25);
        const smallVal = bigVal * conv.factor;
        const decoys = [bigVal * 10, Math.round(smallVal / (conv.factor / 10)), bigVal + 1, bigVal - 1]
          .filter((x) => x !== bigVal && x > 0);
        const { options, correctIndex } = buildMC(bigVal, decoys);
        return {
          q: `Convert ${smallVal} ${conv.small} to ${conv.big}.`, options, correctIndex,
          hint: "To convert from a smaller metric unit to a larger one, divide by the conversion factor. Learn the key facts: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g, 1 litre = 1000 ml.",
          solution: {
            scenario: `We need to convert ${smallVal} ${conv.small} into ${conv.big}.`,
            idea: "Going from a smaller unit to a bigger one always means dividing by the conversion factor, since it takes many of the small unit to make one of the big unit.",
            method: [`Recall that 1 ${conv.big} = ${conv.factor} ${conv.small}.`, "Divide the given amount by the conversion factor."],
            steps: [`${smallVal} ÷ ${conv.factor} = ${bigVal} ${conv.big}.`],
            check: `Multiplying back: ${bigVal} × ${conv.factor} = ${smallVal} ${conv.small}, which matches.`,
          },
        };
      },
    },
    direct_convert_down: {
      difficulties: [1, 2],
      build(d) {
        const conv = pick(CONVS);
        const bigVal = d <= 1 ? rand(2, 9) : rand(2, 25);
        const smallVal = bigVal * conv.factor;
        const decoys = [Math.round(smallVal / 10), bigVal, smallVal + conv.factor, smallVal - conv.factor]
          .filter((x) => x !== smallVal && x > 0);
        const { options, correctIndex } = buildMC(smallVal, decoys);
        return {
          q: `Convert ${bigVal} ${conv.big} to ${conv.small}.`, options, correctIndex,
          hint: "To convert from a larger metric unit to a smaller one, multiply by the conversion factor. Learn the key facts: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g, 1 litre = 1000 ml.",
          solution: {
            scenario: `We need to convert ${bigVal} ${conv.big} into ${conv.small}.`,
            idea: "Going from a bigger unit to a smaller one always means multiplying by the conversion factor, since each big unit is worth that many small units.",
            method: [`Recall that 1 ${conv.big} = ${conv.factor} ${conv.small}.`, "Multiply the given amount by the conversion factor."],
            steps: [`${bigVal} × ${conv.factor} = ${smallVal} ${conv.small}.`],
            check: `Dividing back: ${smallVal} ÷ ${conv.factor} = ${bigVal} ${conv.big}, which matches.`,
          },
        };
      },
    },
    money_to_pence: {
      difficulties: [1, 2],
      build(d) {
        const pounds = d <= 1 ? rand(1, 9) : rand(1, 50);
        const extraPence = pick([0, 5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 65, 70, 75, 80, 90, 95]);
        const totalPence = pounds * 100 + extraPence;
        const decoys = [pounds, totalPence + 10, totalPence - 10, pounds * 10 + extraPence]
          .filter((x) => x !== totalPence && x > 0);
        const { options, correctIndex } = buildMC(totalPence, decoys, (x) => `${x}p`);
        return {
          q: `Convert £${pounds}.${String(extraPence).padStart(2, "0")} to pence.`, options, correctIndex,
          hint: "There are 100 pence in one pound. To convert pounds to pence, multiply the pounds by 100 and add on the pence digits already after the decimal point.",
          solution: {
            scenario: `We need to write £${pounds}.${String(extraPence).padStart(2, "0")} as a number of pence.`,
            idea: "1 pound = 100 pence, so the two digits after the decimal point in a money amount are already pence — the whole-pound part just needs multiplying by 100.",
            method: ["Multiply the number of whole pounds by 100.", "Add on the pence shown after the decimal point."],
            steps: [`${pounds} × 100 = ${pounds * 100}p.`, `${pounds * 100}p + ${extraPence}p = ${totalPence}p.`],
            check: `Dividing back: ${totalPence} ÷ 100 = £${r2(totalPence / 100).toFixed(2)}, which matches.`,
          },
        };
      },
    },
    money_to_pounds: {
      difficulties: [1, 2],
      build(d) {
        let totalPence = d <= 1 ? rand(105, 995) : rand(105, 4995);
        if (totalPence % 100 === 0) totalPence += 1;
        const pounds = Math.floor(totalPence / 100);
        const answer = r2(totalPence / 100);
        const decoys = [totalPence, pounds, r2(answer + 1), r2(answer - 1)]
          .filter((x) => Math.abs(x - answer) > 0.001 && x >= 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => `£${r2(x).toFixed(2)}`);
        return {
          q: `Convert ${totalPence}p to pounds.`, options, correctIndex,
          hint: "To convert pence to pounds, divide by 100. Write the result to 2 decimal places, with the whole pounds before the point and the remaining pence after it.",
          solution: {
            scenario: `We need to write ${totalPence}p as an amount in pounds.`,
            idea: "1 pound = 100 pence, so dividing a number of pence by 100 gives pounds — the last two digits become the pence after the decimal point.",
            method: ["Divide the number of pence by 100.", "Write the answer to 2 decimal places."],
            steps: [`${totalPence} ÷ 100 = £${answer.toFixed(2)}.`],
            check: `Multiplying back: £${answer.toFixed(2)} × 100 = ${totalPence}p, which matches.`,
          },
        };
      },
    },
    recall_fact: {
      difficulties: [1],
      build() {
        const facts = [
          { q: "How many grams are in 1 kilogram?", a: 1000 },
          { q: "How many millilitres are in 1 litre?", a: 1000 },
          { q: "How many metres are in 1 kilometre?", a: 1000 },
          { q: "How many centimetres are in 1 metre?", a: 100 },
          { q: "How many millimetres are in 1 centimetre?", a: 10 },
          { q: "How many pence are in 1 pound?", a: 100 },
        ];
        const f = pick(facts);
        const decoys = [f.a / 10, f.a * 10, f.a + 10, f.a - 10].filter((x) => x !== f.a && x > 0);
        const { options, correctIndex } = buildMC(f.a, decoys);
        return {
          q: f.q, options, correctIndex,
          hint: "These are standard metric conversion facts worth knowing by heart: 1 kg = 1000 g, 1 litre = 1000 ml, 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, £1 = 100p.",
          solution: {
            scenario: `We need a standard metric conversion fact.`,
            idea: "Metric units are built on powers of ten, so each of these conversion facts is fixed and worth memorising rather than working out each time.",
            method: ["Recall the standard conversion fact directly."],
            steps: [`This is a fixed conversion fact: ${f.a}.`],
            check: `This matches the standard metric relationship every time it is used.`,
          },
        };
      },
    },
    decimal_amount_to_small: {
      difficulties: [2, 3],
      build(d) {
        const conv = pick(BIG_CONVS);
        const wholePart = d <= 2 ? rand(1, 9) : rand(1, 20);
        const fracPart = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);
        const bigVal = r2(wholePart + fracPart);
        const answer = Math.round(bigVal * conv.factor);
        const decoys = [
          Math.round(wholePart * conv.factor),
          answer + conv.factor / 10,
          answer - conv.factor / 10,
          Math.round(fracPart * conv.factor),
        ].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return {
          q: `Convert ${bigVal} ${conv.big} to ${conv.small}.`, options, correctIndex,
          hint: "When converting a decimal amount of a bigger unit to the smaller unit, multiply the whole decimal number by the conversion factor — the whole part and the fractional part are both converted in the same step.",
          solution: {
            scenario: `We need to convert ${bigVal} ${conv.big} into ${conv.small}.`,
            idea: "A decimal amount of a unit still converts by the same rule as a whole number: multiply by the conversion factor. The decimal part simply carries through the multiplication.",
            method: [`Recall that 1 ${conv.big} = ${conv.factor} ${conv.small}.`, "Multiply the whole decimal amount by the conversion factor."],
            steps: [`${bigVal} × ${conv.factor} = ${answer} ${conv.small}.`],
            check: `Dividing back: ${answer} ÷ ${conv.factor} = ${bigVal} ${conv.big}, which matches.`,
          },
        };
      },
    },
    small_as_decimal_of_big: {
      difficulties: [2, 3],
      build(d) {
        const conv = pick(BIG_CONVS);
        const pool = d <= 2
          ? [100, 200, 250, 400, 500, 600, 750, 800]
          : [25, 50, 75, 125, 150, 175, 375, 625, 875];
        const options25 = pool.filter((v) => v < conv.factor);
        if (!options25.length) return null;
        const smallVal = pick(options25);
        const answer = r3(smallVal / conv.factor);
        const decoys = [
          smallVal,
          r2(answer * 10),
          r2(answer * 100) / 10,
          r3(1 - answer),
        ].filter((x) => Math.abs(x - answer) > 0.0001 && x >= 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => String(x));
        return {
          q: `Write ${smallVal} ${conv.small} as a decimal number of ${conv.big}.`, options, correctIndex,
          hint: "To write a smaller-unit amount as a decimal of the bigger unit, divide by the conversion factor. For example, 250 g ÷ 1000 = 0.25 kg — the result is a fraction of the bigger unit written as a decimal.",
          solution: {
            scenario: `We need to write ${smallVal} ${conv.small} as a decimal amount of ${conv.big}.`,
            idea: "Dividing a smaller-unit amount by the conversion factor gives exactly what fraction of the bigger unit it is, written as a decimal.",
            method: [`Recall that 1 ${conv.big} = ${conv.factor} ${conv.small}.`, "Divide the smaller-unit amount by the conversion factor."],
            steps: [`${smallVal} ÷ ${conv.factor} = ${answer} ${conv.big}.`],
            check: `Multiplying back: ${answer} × ${conv.factor} = ${smallVal}, which matches.`,
          },
        };
      },
    },
    compare_two_units: {
      difficulties: [3, 4],
      build(d) {
        const conv = pick(BIG_CONVS);
        const bigVal = r2(rand(d <= 3 ? 2 : 3, d <= 3 ? 8 : 15) + pick([0, 0.25, 0.5, 0.75]));
        const bigInSmall = Math.round(bigVal * conv.factor);
        let delta = rand(d <= 3 ? 30 : 15, d <= 3 ? 200 : 400) * pick([1, -1]);
        if (delta === 0) delta = 50;
        const smallVal = bigInSmall + delta;
        if (smallVal <= 0) return null;
        const wantBigger = pick([true, false]);
        const aStr = `${bigVal} ${conv.big}`, bStr = `${smallVal} ${conv.small}`;
        const aIsBigger = bigInSmall > smallVal;
        const correctAns = wantBigger === aIsBigger ? aStr : bStr;
        const otherAns = wantBigger === aIsBigger ? bStr : aStr;
        const decoys = [
          otherAns,
          "They are exactly equal",
          "It is impossible to compare without more information",
          `A ${conv.big} amount is always bigger than a ${conv.small} amount`,
        ];
        const { options, correctIndex } = buildMCStr(correctAns, decoys);
        return {
          q: `Which is ${wantBigger ? "bigger" : "smaller"}: ${aStr} or ${bStr}?`, options, correctIndex,
          hint: "To compare measurements given in different units, first convert both to the same unit, then compare the numbers directly.",
          solution: {
            scenario: `We need to compare ${aStr} and ${bStr}.`,
            idea: "Numbers in different units cannot be compared directly — converting to a common unit first makes the comparison fair.",
            method: [`Convert ${aStr} into ${conv.small}.`, `Compare that with ${smallVal} ${conv.small}.`],
            steps: [
              `${bigVal} ${conv.big} = ${bigInSmall} ${conv.small}.`,
              `Comparing ${bigInSmall} ${conv.small} with ${smallVal} ${conv.small}, the ${wantBigger ? "bigger" : "smaller"} one is ${correctAns}.`,
            ],
            check: `${bigInSmall} and ${smallVal} are clearly different sizes once in the same unit, so the comparison is unambiguous.`,
          },
        };
      },
    },
    sum_mixed_units: {
      difficulties: [3, 4],
      build(d) {
        const conv = pick(MIXED);
        const granularity = conv.factor === 1000 ? 10 : 1;
        const partsCount = d <= 3 ? 2 : 3;
        const aBig = rand(1, d <= 3 ? 3 : 6);
        const aSmall = Math.round(rand(10, conv.factor - 10) / granularity) * granularity;
        const extras = Array.from({ length: partsCount - 1 }, () => Math.round(rand(10, conv.factor - 10) / granularity) * granularity);
        const totalSmall = aBig * conv.factor + aSmall + extras.reduce((s, v) => s + v, 0);
        const askBig = pick([true, false]);
        const answer = askBig ? r2(totalSmall / conv.factor) : totalSmall;
        const decoys = askBig
          ? [r2(answer + 1), r2(answer - 1), aBig, r2(Math.floor(answer * 10) / 10 + 0.5)].filter((x) => Math.abs(x - answer) > 0.001 && x >= 0)
          : [totalSmall + conv.factor, totalSmall - conv.factor, aBig * conv.factor + aSmall, aSmall + extras[0]].filter((x) => x !== totalSmall && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => `${x} ${askBig ? conv.bigUnit : conv.unit}`);
        const extrasStr = extras.map((v) => `${v} ${conv.unit}`).join(" + ");
        return {
          q: `${aBig} ${conv.bigUnit} ${aSmall} ${conv.unit} + ${extrasStr}. What is the total, in ${askBig ? conv.bigUnit : conv.unit}?`, options, correctIndex,
          hint: "When adding mixed-unit measurements, first convert everything to the same (smaller) unit, add the values, then convert the total back if a different unit is asked for.",
          solution: {
            scenario: `We need the total of ${aBig} ${conv.bigUnit} ${aSmall} ${conv.unit} and ${extrasStr}.`,
            idea: "Measurements in mixed units cannot be added directly — converting everything to one unit first avoids mixing up the place value of each part.",
            method: [`Convert the ${conv.bigUnit} part to ${conv.unit}.`, "Add every part together in that unit.", askBig ? `Convert the total back to ${conv.bigUnit}.` : ""].filter(Boolean),
            steps: [
              `${aBig} ${conv.bigUnit} = ${aBig * conv.factor} ${conv.unit}.`,
              `Total = ${aBig * conv.factor} + ${aSmall} + ${extras.join(" + ")} = ${totalSmall} ${conv.unit}.`,
              askBig ? `${totalSmall} ÷ ${conv.factor} = ${answer} ${conv.bigUnit}.` : "",
            ].filter(Boolean),
            check: `Converting the answer back to ${conv.unit} reproduces ${totalSmall}, matching the sum of all the parts.`,
          },
        };
      },
    },
    money_change_mixed: {
      difficulties: [3, 4],
      build(d) {
        const nItems = d <= 3 ? 2 : 3;
        const items = Array.from({ length: nItems }, () => rand(20, d <= 3 ? 320 : 650));
        const totalPence = items.reduce((s, v) => s + v, 0);
        const noteChoices = d <= 3 ? [500, 1000] : [1000, 2000];
        const candidates = noteChoices.filter((n) => n > totalPence);
        const note = candidates.length ? pick(candidates) : 2000;
        if (note <= totalPence) return null;
        const change = note - totalPence;
        const itemsStr = items.map(fmtMoney).join(" and ");
        const decoys = [totalPence, note - items[0], change + 10, change - 10]
          .filter((x) => x !== change && x > 0);
        const { options, correctIndex } = buildMC(change, decoys, fmtMoney);
        return {
          q: `A shopper buys items costing ${itemsStr}. They pay with a ${fmtMoney(note)} note. How much change do they receive?`, options, correctIndex,
          hint: "First add up all the item prices in pence, then subtract that total from the amount paid to find the change.",
          solution: {
            scenario: `Items costing ${itemsStr} are bought and paid for with a ${fmtMoney(note)} note.`,
            idea: "Change is found by adding up everything spent, then subtracting that total from the amount handed over.",
            method: ["Convert every price to pence and add them together.", "Subtract the total from the amount paid."],
            steps: [`Total cost = ${items.join(" + ")} = ${totalPence}p.`, `Change = ${note}p − ${totalPence}p = ${change}p.`],
            check: `Adding the change back: ${totalPence}p + ${change}p = ${note}p, matching the amount paid.`,
          },
        };
      },
    },
    difference_mixed_units: {
      difficulties: [4],
      build() {
        const conv = pick(BIG_CONVS);
        const bigVal = r2(rand(2, 9) + pick([0, 0.2, 0.4, 0.5, 0.6, 0.8]));
        const bigInSmall = Math.round(bigVal * conv.factor);
        const granularity = conv.factor === 1000 ? 10 : 1;
        const cutSmall = Math.round(rand(Math.floor(bigInSmall * 0.15), Math.floor(bigInSmall * 0.7)) / granularity) * granularity;
        if (cutSmall <= 0 || cutSmall >= bigInSmall) return null;
        const remainderSmall = bigInSmall - cutSmall;
        const askBig = pick([true, false]);
        const answer = askBig ? r2(remainderSmall / conv.factor) : remainderSmall;
        const decoys = askBig
          ? [r2(answer + 1), r2(answer - 1), r2(cutSmall / conv.factor), r2(bigVal)].filter((x) => Math.abs(x - answer) > 0.001 && x >= 0)
          : [remainderSmall + conv.factor, remainderSmall - conv.factor, cutSmall, bigInSmall].filter((x) => x !== remainderSmall && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => `${x} ${askBig ? conv.big : conv.small}`);
        return {
          q: `A length of ribbon measures ${bigVal} ${conv.big}. A piece measuring ${cutSmall} ${conv.small} is cut off. How much ribbon is left, in ${askBig ? conv.big : conv.small}?`, options, correctIndex,
          hint: "To subtract measurements given in different units, first convert both to the same unit, then subtract. Convert the answer back afterwards if a different unit is asked for.",
          solution: {
            scenario: `A ${bigVal} ${conv.big} ribbon has ${cutSmall} ${conv.small} cut from it.`,
            idea: "Two measurements in different units cannot be subtracted directly — converting to a common unit first makes the subtraction valid.",
            method: [`Convert ${bigVal} ${conv.big} into ${conv.small}.`, "Subtract the piece cut off.", askBig ? `Convert the remainder back to ${conv.big}.` : ""].filter(Boolean),
            steps: [
              `${bigVal} ${conv.big} = ${bigInSmall} ${conv.small}.`,
              `${bigInSmall} − ${cutSmall} = ${remainderSmall} ${conv.small} remaining.`,
              askBig ? `${remainderSmall} ÷ ${conv.factor} = ${answer} ${conv.big}.` : "",
            ].filter(Boolean),
            check: `Adding the cut piece back to the remainder: ${remainderSmall} + ${cutSmall} = ${bigInSmall} ${conv.small}, matching the original length.`,
          },
        };
      },
    },
    chain_conversion_two_step: {
      difficulties: [4],
      build() {
        const factor = 100000;
        const toCm = pick([true, false]);
        if (toCm) {
          const km = pick([0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
          const cm = Math.round(km * factor);
          const decoys = [Math.round(km * 1000), Math.round(km * 10000), cm + 1000, cm - 1000]
            .filter((x) => x !== cm && x > 0);
          const { options, correctIndex } = buildMC(cm, decoys);
          return {
            q: `Convert ${km} km to cm.`, options, correctIndex,
            hint: "There is no single 'km to cm' fact to memorise — go via metres. 1 km = 1000 m, and 1 m = 100 cm, so 1 km = 1000 × 100 = 100 000 cm.",
            solution: {
              scenario: `We need to convert ${km} km directly into cm.`,
              idea: "When two units are not adjacent, chain two known conversion facts together instead of trying to recall one giant fact.",
              method: ["Convert km to m first.", "Then convert that number of m to cm."],
              steps: [`${km} km = ${r3(km * 1000)} m.`, `${r3(km * 1000)} m = ${cm} cm.`],
              check: `Dividing back: ${cm} ÷ 100 000 = ${km} km, which matches.`,
            },
          };
        }
        const cm = pick([25000, 50000, 75000, 100000, 150000, 200000, 250000, 300000, 350000, 450000]);
        const km = r3(cm / factor);
        const decoys = [Math.round(cm / 1000), Math.round(cm / 10000), r3(km + 1), r3(km - 1)]
          .filter((x) => Math.abs(x - km) > 0.0001 && x >= 0);
        const { options, correctIndex } = buildMC(km, decoys, (x) => String(x));
        return {
          q: `Convert ${cm} cm to km.`, options, correctIndex,
          hint: "There is no single 'cm to km' fact to memorise — go via metres. 100 cm = 1 m, and 1000 m = 1 km, so 100 000 cm = 1 km.",
          solution: {
            scenario: `We need to convert ${cm} cm directly into km.`,
            idea: "When two units are not adjacent, chain two known conversion facts together instead of trying to recall one giant fact.",
            method: ["Convert cm to m first.", "Then convert that number of m to km."],
            steps: [`${cm} cm = ${Math.round(cm / 100)} m.`, `${Math.round(cm / 100)} m = ${km} km.`],
            check: `Multiplying back: ${km} × 100 000 = ${cm} cm, which matches.`,
          },
        };
      },
    },
  };
})();
// Structure registry for twoUnknowns (NC Y6 Algebra: "find pairs of numbers that satisfy
// an equation with two unknowns"). Covers bar-model sum+difference, parts-method sum+
// multiple and difference+multiple, ratio-notation sharing, algebraic substitution, true
// two-equation elimination, and the "several solutions exist" awareness structures (pick a
// valid coin combination; spot an invalid factor pair; count pairs with a property; verify
// a candidate against two clues at once).
const TWO_UNKNOWNS_STRUCTURES = {
  sum_and_difference: {
    difficulties: [1, 2, 3],
    build(d) {
      const maxV = d <= 1 ? 20 : d === 2 ? 45 : 90;
      const a = rand(4, maxV), b = rand(4, maxV);
      if (a === b) return null;
      const bigger = Math.max(a, b), smaller = Math.min(a, b);
      const sum = bigger + smaller, diff = bigger - smaller;
      const askBigger = pick([true, false]);
      const answer = askBigger ? bigger : smaller;
      const other = askBigger ? smaller : bigger;
      const decoyPool = [...new Set([other, sum, diff, Math.round(sum / 2), bigger + diff, smaller - diff])]
        .filter((x) => x !== answer && x >= 0 && Number.isFinite(x));
      const { options, correctIndex } = buildMC(answer, decoyPool);
      return { q: `Two numbers add up to ${sum}. Their difference is ${diff}. What is the ${askBigger ? "larger" : "smaller"} number?`, options, correctIndex,
        hint: "Adding the sum and the difference gives you twice the larger number; subtracting the difference from the sum gives you twice the smaller number. Halve each result to find the individual values.",
        solution: {
          scenario: `Two numbers add up to ${sum} and differ by ${diff}.`,
          idea: "Sum + difference = 2 × bigger; sum − difference = 2 × smaller. Halve each to find the values.",
          method: ["Add the sum and the difference, then halve, to find the bigger number.", "Subtract the difference from the sum, then halve, to find the smaller number."],
          steps: [
            `Bigger + smaller = ${sum}; bigger − smaller = ${diff}.`,
            `Adding these: 2 × bigger = ${sum + diff}, so bigger = ${bigger}.`,
            `Smaller = ${sum} − ${bigger} = ${smaller}.`,
          ],
          check: `${bigger} + ${smaller} = ${sum} and ${bigger} − ${smaller} = ${diff}, so both clues check out.`,
        } };
    },
  },
  sum_and_multiple: {
    difficulties: [1, 2, 3],
    build(d) {
      const k = d <= 1 ? rand(2, 3) : d === 2 ? rand(2, 5) : rand(2, 8);
      const smaller = rand(2, d <= 1 ? 12 : d === 2 ? 22 : 30);
      const bigger = smaller * k;
      const sum = smaller + bigger;
      const askBigger = pick([true, false]);
      const answer = askBigger ? bigger : smaller;
      const other = askBigger ? smaller : bigger;
      const decoyPool = [...new Set([other, sum, Math.round(sum / 2), sum - answer + 1, k])]
        .filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoyPool);
      return { q: `Two numbers add up to ${sum}. One number is ${k} times the other. What is the ${askBigger ? "larger" : "smaller"} number?`, options, correctIndex,
        hint: "Think in parts: if the smaller number is 1 part, the larger is k parts, so together they make (k+1) parts. Divide the total by (k+1) to find one part.",
        solution: {
          scenario: `Two numbers add up to ${sum}; one is ${k} times the other.`,
          idea: "If the smaller number is 1 unit and the larger is k units, together they are (k+1) units. Divide the total by (k+1) to find one unit.",
          method: [`Together the numbers make ${k + 1} equal parts.`, `Divide ${sum} by ${k + 1} to find one part (the smaller number).`, "Multiply by k to find the larger number."],
          steps: [
            `Smaller number is 1 part, larger is ${k} parts, so together ${k + 1} parts.`,
            `${sum} ÷ ${k + 1} = ${smaller} (the smaller number).`,
            `Larger = ${k} × ${smaller} = ${bigger}.`,
          ],
          check: `${smaller} + ${bigger} = ${sum} and ${bigger} ÷ ${smaller} = ${k}.`,
        } };
    },
  },
  given_one_find_other: {
    difficulties: [1, 2],
    build(d) {
      const sum = rand(d <= 1 ? 10 : 25, d <= 1 ? 50 : 90);
      const a = rand(2, sum - 2);
      const b = sum - a;
      const decoyPool = [...new Set([sum, a, sum + a, b + 2, b - 2, Math.round(sum / 2)])]
        .filter((x) => x !== b && x >= 0);
      const { options, correctIndex } = buildMC(b, decoyPool);
      return { q: `Two numbers add together to make ${sum}. One of the numbers is ${a}. What is the other number?`, options, correctIndex,
        hint: "If you know the total and one of the two numbers, subtract that number from the total to find the other one.",
        solution: {
          scenario: `Two numbers add to ${sum}; one of them is ${a}.`,
          idea: "If the total and one part are known, subtracting the known part from the total gives the other part.",
          method: ["Subtract the known number from the total."],
          steps: [`${sum} − ${a} = ${b}.`],
          check: `${a} + ${b} = ${sum}.`,
        } };
    },
  },
  coin_combination_which_works: {
    difficulties: [1, 2],
    build(d) {
      const coinA = pick([1, 2, 5]);
      const coinB = pick([2, 5, 10].filter((c) => c !== coinA));
      const total = rand(d <= 1 ? 10 : 20, d <= 1 ? 30 : 50);
      const validCombos = [];
      for (let na = 0; na * coinA <= total; na++) {
        const rem = total - na * coinA;
        if (rem % coinB === 0) validCombos.push([na, rem / coinB]);
      }
      if (validCombos.length < 2) return null;
      const correctCombo = pick(validCombos);
      const correctStr = `${correctCombo[0]} × ${coinA}p coins and ${correctCombo[1]} × ${coinB}p coins`;
      const decoyCombos = [];
      let guard = 0;
      while (decoyCombos.length < 4 && guard < 300) {
        guard++;
        const na = rand(0, Math.floor(total / coinA) + 3), nb = rand(0, Math.floor(total / coinB) + 3);
        if (na * coinA + nb * coinB === total) continue;
        const str = `${na} × ${coinA}p coins and ${nb} × ${coinB}p coins`;
        if (str !== correctStr && !decoyCombos.includes(str)) decoyCombos.push(str);
      }
      if (decoyCombos.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correctStr, decoyCombos);
      return { q: `A total of ${total}p is made using only ${coinA}p and ${coinB}p coins. Which of these could be the coins used?`, options, correctIndex,
        hint: "There may be more than one valid combination here. For each option, multiply the number of each coin by its value and add the two totals together to see whether it reaches the target.",
        solution: {
          scenario: `${total}p is made from ${coinA}p and ${coinB}p coins only.`,
          idea: "Check each option by computing its total value: (count A) × (value A) + (count B) × (value B). The correct option reaches the target; the others do not.",
          method: ["Multiply each coin count by its value.", "Add the two amounts and compare with the target."],
          steps: [
            `Check: ${correctCombo[0]} × ${coinA}p + ${correctCombo[1]} × ${coinB}p = ${correctCombo[0] * coinA + correctCombo[1] * coinB}p = ${total}p.`,
            validCombos.length > 2 ? `There are actually ${validCombos.length} different ways to make ${total}p with these coins; this is just one valid combination.` : "",
          ].filter(Boolean),
        } };
    },
  },
  sum_and_ratio_parts: {
    difficulties: [1, 2, 3],
    build(d) {
      const maxPQ = d <= 1 ? 4 : d === 2 ? 6 : 9;
      const p = rand(2, maxPQ), q = rand(2, maxPQ);
      if (p === q || gcd(p, q) !== 1) return null;
      const k = d <= 1 ? rand(2, 6) : d === 2 ? rand(3, 10) : rand(4, 16);
      const a = p * k, b = q * k;
      const sum = a + b;
      const askLarger = pick([true, false]);
      const bigger = Math.max(a, b), smaller = Math.min(a, b);
      const answer = askLarger ? bigger : smaller;
      const other = askLarger ? smaller : bigger;
      const decoyPool = [...new Set([other, sum, k, Math.round(sum / (p + q)), Math.round(sum / 2)])]
        .filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoyPool);
      return { q: `Two numbers are in the ratio ${p}:${q} and add up to ${sum}. What is the ${askLarger ? "larger" : "smaller"} number?`, options, correctIndex,
        hint: "A ratio tells you how many equal parts make up the total. Find the total number of parts, divide the sum by that to find one part, then multiply up.",
        solution: {
          scenario: `Two numbers are in the ratio ${p}:${q} and their sum is ${sum}.`,
          idea: "The ratio splits the total into equal parts. Dividing the sum by the total number of parts gives the value of one part.",
          method: [`Total parts = ${p} + ${q} = ${p + q}.`, `One part = ${sum} ÷ ${p + q} = ${k}.`, "Multiply each ratio number by the value of one part."],
          steps: [
            `${sum} ÷ ${p + q} = ${k} (the value of one part).`,
            `${p} parts = ${p} × ${k} = ${a}; ${q} parts = ${q} × ${k} = ${b}.`,
          ],
          check: `${a} + ${b} = ${sum}, and ${a}:${b} simplifies back to ${p}:${q}.`,
        } };
    },
  },
  product_pair_spot_invalid: {
    difficulties: [2, 3],
    build(d) {
      const product = d <= 2 ? pick([24, 36, 40]) : pick([36, 40, 48, 60]);
      function factorPairs(n) {
        const pairs = [];
        for (let i = 1; i * i <= n; i++) if (n % i === 0 && i !== n / i) pairs.push([i, n / i]);
        return pairs;
      }
      const pairs = factorPairs(product);
      if (pairs.length < 4) return null;
      const validSample = shuffle(pairs).slice(0, 4);
      let invalidPair, guard = 0;
      do { invalidPair = [rand(1, product), rand(1, product)]; guard++; } while (invalidPair[0] * invalidPair[1] === product && guard < 200);
      if (guard >= 200) return null;
      const ans = `${invalidPair[0]} and ${invalidPair[1]}`;
      const decoys = validSample.map((p) => `${p[0]} and ${p[1]}`);
      const { options, correctIndex } = buildMCStr(ans, decoys);
      return { q: `Two whole numbers multiply together to make ${product}. Which of these pairs of numbers could NOT be the two numbers?`, options, correctIndex,
        hint: "This has many valid pairs: any factor pair of the target works. Multiply each pair together and find the one option that does NOT give the target.",
        solution: {
          scenario: `Two whole numbers multiply to make ${product}.`,
          idea: "Check each pair by multiplying. The pair whose product is not the target is the answer.",
          method: ["Multiply each pair together.", "Compare the result with the target."],
          steps: [
            `${invalidPair[0]} × ${invalidPair[1]} = ${invalidPair[0] * invalidPair[1]}, which is NOT ${product}.`,
            `The other pairs shown DO multiply to ${product}; there is more than one valid pair, which is why this kind of problem can have several solutions.`,
          ],
        } };
    },
  },
  double_plus_extra_substitution: {
    difficulties: [2, 3, 4],
    build(d) {
      const mult = d <= 3 ? 2 : pick([2, 3]);
      const b = rand(3, d <= 2 ? 15 : d === 3 ? 25 : 35);
      const extra = rand(1, d <= 2 ? 8 : d === 3 ? 16 : 26);
      const a = mult * b + extra;
      const sum = a + b;
      const askA = pick([true, false]);
      const answer = askA ? a : b;
      const other = askA ? b : a;
      const decoyPool = [...new Set([other, sum, extra, b + extra, a - extra, Math.round(sum / (mult + 1))])]
        .filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoyPool);
      const multWord = mult === 2 ? "double" : "triple";
      return { q: `Two numbers add up to ${sum}. The first number is ${extra} more than ${multWord} the second number. What is the ${askA ? "first" : "second"} number?`, options, correctIndex,
        hint: `Call the second number n. The first number is then ${mult}n + ${extra}. Write an equation for the sum and solve for n.`,
        solution: {
          scenario: `Two numbers add to ${sum}; the first is ${extra} more than ${multWord} the second.`,
          idea: "Express one unknown in terms of the other using the given relationship, substitute into the sum, then solve.",
          method: [`Let the second number be n; the first is ${mult}n + ${extra}.`, `n + (${mult}n + ${extra}) = ${sum}.`, "Solve for n, then use the relationship to find the other number."],
          steps: [
            `${mult + 1}n + ${extra} = ${sum}, so ${mult + 1}n = ${sum - extra}.`,
            `n = ${b} (the second number).`,
            `First number = ${mult} × ${b} + ${extra} = ${a}.`,
          ],
          check: `${a} + ${b} = ${sum}, and ${a} is indeed ${extra} more than ${multWord} ${b}.`,
        } };
    },
  },
  difference_and_multiple_parts: {
    difficulties: [3, 4],
    build(d) {
      const k = d <= 3 ? rand(2, 4) : rand(3, 7);
      const smaller = rand(3, d <= 3 ? 20 : 36);
      const bigger = smaller * k;
      const diff = bigger - smaller;
      const askBigger = pick([true, false]);
      const answer = askBigger ? bigger : smaller;
      const other = askBigger ? smaller : bigger;
      const decoyPool = [...new Set([other, diff, diff * k, smaller + bigger, Math.round(diff / (k - 1))])]
        .filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, decoyPool);
      return { q: `Two numbers differ by ${diff}. One number is ${k} times the other. What is the ${askBigger ? "larger" : "smaller"} number?`, options, correctIndex,
        hint: "Think in parts: if the smaller number is 1 part, the larger is k parts, so the DIFFERENCE between them is (k−1) parts. Divide the difference by (k−1) to find one part.",
        solution: {
          scenario: `Two numbers differ by ${diff}; one is ${k} times the other.`,
          idea: "If the smaller number is 1 unit and the larger is k units, the gap between them is (k−1) units. Dividing the difference by (k−1) finds one unit.",
          method: [`The gap between the numbers is ${k - 1} equal parts.`, `Divide ${diff} by ${k - 1} to find one part (the smaller number).`, "Multiply by k to find the larger number."],
          steps: [
            `Difference = (${k} − 1) × smaller part = ${k - 1} parts = ${diff}.`,
            `${diff} ÷ ${k - 1} = ${smaller} (the smaller number).`,
            `Larger = ${k} × ${smaller} = ${bigger}.`,
          ],
          check: `${bigger} − ${smaller} = ${diff} and ${bigger} ÷ ${smaller} = ${k}.`,
        } };
    },
  },
  count_pairs_with_property: {
    difficulties: [3, 4],
    build(d) {
      const sum = rand(d <= 3 ? 12 : 24, d <= 3 ? 32 : 54);
      const conditions = [
        { label: "both even", test: (a, b) => a % 2 === 0 && b % 2 === 0 },
        { label: "both odd", test: (a, b) => a % 2 !== 0 && b % 2 !== 0 },
        { label: "both multiples of 3", test: (a, b) => a % 3 === 0 && b % 3 === 0 },
      ];
      const cond = pick(conditions);
      let count = 0;
      for (let a = 1; a < sum; a++) {
        const b = sum - a;
        if (a >= b) continue;
        if (cond.test(a, b)) count++;
      }
      if (count === 0) return null;
      const totalPairs = Math.floor((sum - 1) / 2);
      const decoyPool = [...new Set([count + 1, count - 1, count + 2, count - 2, totalPairs, Math.floor(sum / 3)])]
        .filter((x) => x !== count && x >= 0);
      if (decoyPool.length < 4) return null;
      const { options, correctIndex } = buildMC(count, decoyPool);
      return { q: `Two different whole numbers (both at least 1) add up to ${sum}. How many such pairs have ${cond.label}?`, options, correctIndex,
        hint: "List the pairs (a, b) with a < b and a + b equal to the target, then check which pairs satisfy the condition.",
        solution: {
          scenario: `Two different whole numbers add up to ${sum}.`,
          idea: "Systematically list every pair that adds to the target, then count how many of them satisfy the extra condition.",
          method: ["List pairs (a, b) with a < b and a + b = the target.", `Check each pair for being ${cond.label}.`, "Count how many pairs pass."],
          steps: [`There are ${totalPairs} pairs in total that add to ${sum}.`, `Of these, ${count} pair${count === 1 ? "" : "s"} are ${cond.label}.`],
        } };
    },
  },
  verify_pair_against_two_clues: {
    difficulties: [3, 4],
    build(d) {
      const smaller = rand(d <= 3 ? 3 : 5, d <= 3 ? 15 : 24);
      const bigger = rand(smaller + 1, smaller + (d <= 3 ? 15 : 24));
      const sum = smaller + bigger, product = smaller * bigger;
      const correctStr = `${smaller} and ${bigger}`;
      const seenStrs = new Set([correctStr]);
      const decoys = [];
      for (const delta of [1, 2, 3, -1, -2, -3, 4, -4]) {
        if (decoys.length >= 3) break;
        const x = smaller + delta, y = bigger - delta;
        if (x <= 0 || y <= 0 || x === y) continue;
        const lo = Math.min(x, y), hi = Math.max(x, y);
        const str = `${lo} and ${hi}`;
        const genuinelyInvalid = !(lo + hi === sum && lo * hi === product);
        if (genuinelyInvalid && !seenStrs.has(str)) { seenStrs.add(str); decoys.push(str); }
      }
      let guard = 0;
      while (decoys.length < 4 && guard < 300) {
        guard++;
        const x = rand(1, smaller + bigger + 15), y = rand(1, smaller + bigger + 15);
        if (x === y) continue;
        const lo = Math.min(x, y), hi = Math.max(x, y);
        const str = `${lo} and ${hi}`;
        if (seenStrs.has(str)) continue;
        if (lo + hi === sum && lo * hi === product) continue;
        seenStrs.add(str); decoys.push(str);
      }
      if (decoys.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correctStr, decoys);
      return { q: `Two numbers add up to ${sum} and multiply to make ${product}. Which pair could these numbers be?`, options, correctIndex,
        hint: "Check each option against BOTH clues: add the pair together, and multiply the pair together. Only one pair satisfies both at once.",
        solution: {
          scenario: `Two numbers add to ${sum} and multiply to ${product}.`,
          idea: "A sum and a product together pin down exactly one pair of numbers (in either order). Test each candidate pair against both clues rather than stopping at the first one that matches only one clue.",
          method: ["For each option, add the two numbers and compare with the target sum.", "For each option, multiply the two numbers and compare with the target product.", "Keep only the pair that satisfies both."],
          steps: [
            `${smaller} + ${bigger} = ${sum} and ${smaller} × ${bigger} = ${product}: both clues match.`,
            "The other pairs shown satisfy at most one of the two clues.",
          ],
        } };
    },
  },
  sum_and_double_elimination: {
    difficulties: [3, 4],
    build(d) {
      const x = rand(d <= 3 ? 3 : 6, d <= 3 ? 20 : 40);
      const y = rand(d <= 3 ? 3 : 6, d <= 3 ? 20 : 40);
      if (x === y) return null;
      const S = x + y;
      const T = 2 * x + y;
      const askFirst = pick([true, false]);
      const answer = askFirst ? x : y;
      const other = askFirst ? y : x;
      const decoyPool = [...new Set([other, S, T, T - S + 1, S - (T - S), Math.round(S / 2)])]
        .filter((v) => v !== answer && v > 0);
      const { options, correctIndex } = buildMC(answer, decoyPool);
      return { q: `Two numbers add up to ${S}. Twice the first number plus the second number equals ${T}. What is the ${askFirst ? "first" : "second"} number?`, options, correctIndex,
        hint: "Subtract the sum equation from the second equation. The second numbers cancel out, leaving just the first number.",
        solution: {
          scenario: `x + y = ${S} and 2x + y = ${T}, where x is the first number and y is the second.`,
          idea: "Subtracting one whole equation from another cancels a matching term, leaving one unknown on its own.",
          method: ["Subtract the first equation from the second: (2x + y) − (x + y) = x.", `This gives x = ${T} − ${S} = ${x}.`, "Substitute back into the sum to find the other number."],
          steps: [
            `(2x + y) − (x + y) = ${T} − ${S}, so x = ${x}.`,
            `y = ${S} − ${x} = ${y}.`,
          ],
          check: `${x} + ${y} = ${S} and (2 × ${x}) + ${y} = ${T}.`,
        } };
    },
  },
};
// Structure registry for additiveMultiplicative. Covers additive vs multiplicative
// comparison directly, solving for an unknown from either kind of clue, classifying a
// statement's comparison type, chaining comparisons of each kind, a combined multiply-then-
// add/subtract relationship both forward and reverse, a qualitative "which comparison is
// more informative" judgement, a sum-and-difference structure, and the Y6 negative-number
// "interval across zero" extension of additive comparison (temperature/lift/diver contexts).
const COMPARISON_CATEGORIES = [
  "An additive comparison (a difference)",
  "A multiplicative comparison (a scale factor)",
  "Both an additive and a multiplicative comparison equally",
  "Neither: the statement does not compare the two amounts",
  "You would need more information to tell",
];
const SIGNED_CONTEXTS = [
  {
    nameA: "Town A", nameB: "Town B", noun: "degree", cmpUp: "warmer", cmpDown: "colder",
    describe: (name, v) => `${name}'s temperature is ${v}°C`,
    fmt: (n) => `${n}°C`,
  },
  {
    nameA: "Lift A", nameB: "Lift B", noun: "floor", cmpUp: "higher", cmpDown: "lower",
    describe: (name, v) => `${name} is stopped at floor ${v}`,
    fmt: (n) => `${n}`,
  },
  {
    nameA: "Diver A", nameB: "Diver B", noun: "metre", cmpUp: "higher", cmpDown: "lower",
    describe: (name, v) => `${name}'s height above sea level is ${v} m`,
    fmt: (n) => `${n} m`,
  },
];
const ADDITIVE_MULTIPLICATIVE_STRUCTURES = {
  additive_diff_basic: {
    difficulties: [1, 2],
    build(d) {
      const a = d <= 1 ? rand(5, 30) : rand(20, 80);
      const diff = d <= 1 ? rand(2, 15) : rand(5, 40);
      const b = a + diff;
      const decoys = [a, b, diff + 2, diff - 2, Math.abs(a - diff)].filter((x) => x !== diff && x > 0);
      const { options, correctIndex } = buildMC(diff, [...new Set(decoys)]);
      return { q: `${a} and ${b}: how many more is ${b} than ${a}?`, options, correctIndex,
        hint: "An additive comparison asks how much more one quantity is than another: subtract the smaller from the larger.",
        solution: {
          scenario: `We are comparing ${a} and ${b}.`,
          idea: "The additive comparison between two quantities is their difference: how much more one is than the other.",
          method: ["Subtract the smaller number from the larger number."],
          steps: [`${b} − ${a} = ${diff}.`],
          check: `${a} + ${diff} = ${b}, confirming the difference.`,
        } };
    },
  },
  multiplicative_factor_basic: {
    difficulties: [1, 2],
    build(d) {
      const a = d <= 1 ? rand(2, 12) : rand(2, 15);
      const k = d <= 1 ? rand(2, 5) : rand(2, 6);
      const b = a * k;
      const decoys = [k + 1, k - 1, k + 2, a, b].filter((x) => x !== k && x > 0);
      const { options, correctIndex } = buildMC(k, [...new Set(decoys)]);
      return { q: `${a} and ${b}: how many times as many is ${b} compared to ${a}?`, options, correctIndex,
        hint: "A multiplicative comparison asks how many times as large one quantity is: divide the larger by the smaller.",
        solution: {
          scenario: `We are comparing ${a} and ${b}.`,
          idea: "The multiplicative comparison between two quantities is a scale factor: how many times as big one is as the other.",
          method: ["Divide the larger number by the smaller number."],
          steps: [`${b} ÷ ${a} = ${k}.`],
          check: `${a} × ${k} = ${b}, confirming the scale factor.`,
        } };
    },
  },
  solve_additive_clue: {
    difficulties: [1, 2],
    build(d) {
      const a = d <= 1 ? rand(5, 40) : rand(30, 90);
      const diff = d <= 1 ? rand(2, 20) : rand(5, 35);
      const wantMore = pick([true, false]);
      const b = wantMore ? a + diff : a - diff;
      if (b <= 0) return null;
      const decoys = [a, wantMore ? a - diff : a + diff, diff, b + diff, b - diff].filter((x) => x !== b && x > 0);
      const { options, correctIndex } = buildMC(b, [...new Set(decoys)]);
      return { q: `A number is ${diff} ${wantMore ? "more" : "less"} than ${a}. What is the number?`, options, correctIndex,
        hint: "'More than' means add the amount; 'less than' means subtract the amount, from the given number.",
        solution: {
          scenario: `A number is ${diff} ${wantMore ? "more" : "less"} than ${a}.`,
          idea: "An additive comparison clue tells you exactly how much to add or subtract to find the unknown number.",
          method: [`${wantMore ? "Add" : "Subtract"} ${diff} ${wantMore ? "to" : "from"} ${a}.`],
          steps: [`${a} ${wantMore ? "+" : "−"} ${diff} = ${b}.`],
          check: `${b} is ${diff} ${wantMore ? "more" : "less"} than ${a}, as required.`,
        } };
    },
  },
  identify_comparison_type: {
    difficulties: [1, 2],
    build(d) {
      const nm1 = N1(); let nm2; let guard = 0; do { nm2 = N1(); guard++; } while (nm2 === nm1 && guard < 30);
      if (nm2 === nm1) return null;
      const item = pick(["stickers", "sweets", "marbles", "points", "coins"]);
      const isAdditive = pick([true, false]);
      const amount = isAdditive ? rand(2, 12) : rand(2, 6);
      const statement = isAdditive
        ? `${nm2} has ${amount} more ${item} than ${nm1}.`
        : `${nm2} has ${amount} times as many ${item} as ${nm1}.`;
      const correctAns = isAdditive ? COMPARISON_CATEGORIES[0] : COMPARISON_CATEGORIES[1];
      const decoys = COMPARISON_CATEGORIES.filter((c) => c !== correctAns);
      const { options, correctIndex } = buildMCStr(correctAns, decoys);
      return { q: `"${statement}" What kind of comparison is being used here?`, options, correctIndex,
        hint: "An additive comparison uses words like 'more than' or 'fewer than' — that's a difference. A multiplicative comparison uses words like 'times as many' — that's a scale factor.",
        solution: {
          scenario: `The statement is: "${statement}"`,
          idea: isAdditive ? "The phrase 'more than' describes a difference, which is an additive comparison." : "The phrase 'times as many' describes a scale factor, which is a multiplicative comparison.",
          method: ["Look for the comparison words in the statement.", isAdditive ? "'More than' signals subtraction: an additive comparison." : "'Times as many' signals multiplication: a multiplicative comparison."],
          steps: [`The word${isAdditive ? "s 'more than'" : "s 'times as many'"} tell${isAdditive ? "" : "s"} you this is ${isAdditive ? "an additive" : "a multiplicative"} comparison.`],
          check: isAdditive ? "'More than' never describes a scale factor." : "'Times as many' never describes a plain difference.",
        } };
    },
  },
  additive_chain: {
    difficulties: [1, 2],
    build(d) {
      const n1 = N1();
      let n2; let g1 = 0; do { n2 = N1(); g1++; } while (n2 === n1 && g1 < 30);
      let n3; let g2 = 0; do { n3 = N1(); g2++; } while ((n3 === n1 || n3 === n2) && g2 < 30);
      if (n2 === n1 || n3 === n1 || n3 === n2) return null;
      const item = pick(["stickers", "sweets", "marbles", "points", "coins"]);
      const d1v = d <= 1 ? rand(2, 10) : rand(5, 20);
      const d2v = d <= 1 ? rand(2, 10) : rand(5, 20);
      const total = d1v + d2v;
      const decoys = [d1v, d2v, Math.abs(d1v - d2v), total + 2, total - 2].filter((x) => x !== total && x > 0);
      const { options, correctIndex } = buildMC(total, [...new Set(decoys)]);
      return { q: `${n2} has ${d1v} more ${item} than ${n1}. ${n3} has ${d2v} more ${item} than ${n2}. How many more ${item} does ${n3} have than ${n1}?`, options, correctIndex,
        hint: "Chain the two differences together: if B has some more than A, and C has some more than B, then C's lead over A is the sum of both differences.",
        solution: {
          scenario: `${n2} has ${d1v} more ${item} than ${n1}, and ${n3} has ${d2v} more ${item} than ${n2}.`,
          idea: "Additive comparisons chain by adding: the total lead of the last person over the first is the sum of each step's difference.",
          method: [`Add the two differences: ${d1v} + ${d2v}.`],
          steps: [`${d1v} + ${d2v} = ${total}.`],
          check: `If ${n1} had 10 ${item}, ${n2} would have ${10 + d1v} and ${n3} would have ${10 + d1v + d2v} — that is ${total} more than ${n1}'s 10.`,
        } };
    },
  },
  solve_multiplicative_clue: {
    difficulties: [2, 3],
    build(d) {
      const a = d <= 2 ? rand(2, 12) : rand(3, 15);
      const k = d <= 2 ? rand(2, 5) : rand(3, 7);
      const wantBigger = pick([true, false]);
      const unknown = wantBigger ? a * k : a;
      const known = wantBigger ? a : a * k;
      const decoys = [known, unknown + k, unknown - k, unknown * 2, a].filter((x) => x !== unknown && x > 0);
      const { options, correctIndex } = buildMC(unknown, [...new Set(decoys)]);
      return { q: wantBigger ? `A number is ${k} times as big as ${known}. What is the number?` : `${known} is ${k} times as big as a number. What is the number?`, options, correctIndex,
        hint: "'k times as big as n' means multiply n by k. If a bigger number IS k times as big as an unknown, divide it by k to find the unknown.",
        solution: {
          scenario: wantBigger ? `A number is ${k} times as big as ${known}.` : `${known} is ${k} times as big as a number.`,
          idea: "A multiplicative clue works via multiplication or its inverse, division, depending on which value is unknown.",
          method: [wantBigger ? `Multiply ${known} by ${k}.` : `Divide ${known} by ${k}.`],
          steps: [wantBigger ? `${known} × ${k} = ${unknown}.` : `${known} ÷ ${k} = ${unknown}.`],
          check: `${unknown} × ${k} = ${unknown * k}, matching the larger number in the question.`,
        } };
    },
  },
  combined_relation_forward: {
    difficulties: [2, 3],
    build(d) {
      const a = d <= 2 ? rand(5, 20) : rand(8, 30);
      const k = d <= 2 ? rand(2, 5) : rand(2, 6);
      const extra = d <= 2 ? rand(1, 10) : rand(2, 15);
      const b = a * k + extra;
      const decoys = [a * k, b - extra * 2, b + extra, a + k, a * (k + 1)].filter((x) => x !== b && x > 0);
      const { options, correctIndex } = buildMC(b, [...new Set(decoys)]);
      return { q: `A number is ${extra} more than ${k} times ${a}. What is the number?`, options, correctIndex,
        hint: "Work out the multiplicative part first (k times the number), then apply the additive adjustment.",
        solution: {
          scenario: `A number is ${extra} more than ${k} times ${a}.`,
          idea: "A combined relationship is worked out in order: multiply first, then add.",
          method: [`Multiply ${k} by ${a}.`, `Add ${extra}.`],
          steps: [`${k} × ${a} = ${a * k}.`, `${a * k} + ${extra} = ${b}.`],
          check: `${b} − ${extra} = ${a * k}, and ${a * k} ÷ ${k} = ${a}, matching the original number.`,
        } };
    },
  },
  signed_difference_find_gap: {
    difficulties: [2, 3],
    build(d) {
      const ctx = pick(SIGNED_CONTEXTS);
      const bothNeg = pick([true, false, false]);
      let a, b;
      if (bothNeg) {
        const lo = d <= 2 ? rand(-15, -6) : rand(-30, -8);
        const gap = d <= 2 ? rand(2, 8) : rand(3, 18);
        const hi = lo + gap;
        if (hi >= 0) return null;
        [a, b] = pick([[lo, hi], [hi, lo]]);
      } else {
        const neg = d <= 2 ? rand(-9, -1) : rand(-20, -1);
        const pos = d <= 2 ? rand(1, 9) : rand(1, 20);
        [a, b] = pick([[neg, pos], [pos, neg]]);
      }
      const diff = Math.abs(a - b);
      const bBigger = b > a;
      const decoys = [Math.abs(a) + Math.abs(b), Math.abs(Math.abs(a) - Math.abs(b)), diff + 1, diff - 1, Math.abs(a) + Math.abs(b) - 2]
        .filter((x) => Number.isFinite(x) && x !== diff && x > 0);
      const fmt = (n) => `${n} ${ctx.noun}${n === 1 ? "" : "s"}`;
      const { options, correctIndex } = buildMC(diff, [...new Set(decoys)], fmt);
      const hi = Math.max(a, b), loV = Math.min(a, b);
      const hiTxt = hi < 0 ? `(${hi})` : `${hi}`;
      const loTxt = loV < 0 ? `(${loV})` : `${loV}`;
      return { q: `${ctx.describe(ctx.nameA, a)}. ${ctx.describe(ctx.nameB, b)}. How many ${ctx.noun}s ${bBigger ? ctx.cmpUp : ctx.cmpDown} is ${ctx.nameB} than ${ctx.nameA}?`, options, correctIndex,
        hint: "This additive comparison still works when one or both values are negative: subtract the smaller (more negative) value from the larger one, straight across zero if needed.",
        solution: {
          scenario: `${ctx.describe(ctx.nameA, a)}. ${ctx.describe(ctx.nameB, b)}.`,
          idea: "An additive comparison is still just a difference, even when the numbers are negative: subtracting correctly counts the distance across zero.",
          method: [`Subtract: ${hiTxt} − ${loTxt}.`],
          steps: [`${hiTxt} − ${loTxt} = ${diff}.`],
          check: `${loTxt} + ${diff} = ${hiTxt}, confirming the gap.`,
        } };
    },
  },
  combined_relation_reverse: {
    difficulties: [3, 4],
    build(d) {
      const x = d <= 3 ? rand(2, 10) : rand(3, 15);
      const k = d <= 3 ? rand(2, 4) : rand(2, 6);
      const extra = d <= 3 ? rand(1, 10) : rand(1, 20);
      const b = k * x + extra;
      const decoys = [b, x + extra, x * k, Math.round(b / k), x + k].filter((v) => v !== x && v > 0);
      const { options, correctIndex } = buildMC(x, [...new Set(decoys)]);
      return { q: `The first number is ${extra} more than ${k} times the second number. The first number is ${b}. What is the second number?`, options, correctIndex,
        hint: "Undo the steps in reverse: subtract the extra amount first, then divide by the multiplier.",
        solution: {
          scenario: `The first number (${b}) is ${extra} more than ${k} times the second number.`,
          idea: "To undo a combined relationship, reverse both the operations and their order: subtract first, then divide.",
          method: [`Subtract ${extra} from ${b}.`, `Divide the result by ${k}.`],
          steps: [`${b} − ${extra} = ${b - extra}.`, `${b - extra} ÷ ${k} = ${x}.`],
          check: `${k} × ${x} + ${extra} = ${b}.`,
        } };
    },
  },
  multiplicative_chain: {
    difficulties: [3, 4],
    build(d) {
      const a = rand(2, 8);
      const k1 = d <= 3 ? rand(2, 3) : rand(2, 5);
      const k2 = d <= 3 ? rand(2, 3) : rand(2, 5);
      const b = a * k1;
      const c = b * k2;
      const answer = k1 * k2;
      const decoys = [k1, k2, k1 + k2, answer + 1, answer - 1].filter((v) => v !== answer && v > 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(decoys)]);
      return { q: `${b} is ${k1} times as many as ${a}. ${c} is ${k2} times as many as ${b}. How many times as many is ${c} compared to ${a}?`, options, correctIndex,
        hint: "Chain multiplicative comparisons by multiplying the two scale factors together.",
        solution: {
          scenario: `${b} is ${k1} times ${a}; ${c} is ${k2} times ${b}.`,
          idea: "Multiplicative comparisons chain by multiplying: the overall scale factor is the product of each step's factor.",
          method: [`Multiply the two scale factors: ${k1} × ${k2}.`],
          steps: [`${k1} × ${k2} = ${answer}.`],
          check: `${a} × ${answer} = ${a * answer}, which matches ${c}.`,
        } };
    },
  },
  judge_best_comparison: {
    difficulties: [3, 4],
    build(d) {
      const a = d <= 3 ? rand(2, 10) : rand(2, 8);
      const k = d <= 3 ? rand(20, 60) : rand(30, 100);
      const b = a * k;
      const diff = b - a;
      const correctAns = `"${b} is ${k} times as many as ${a}" — the multiplicative comparison`;
      const wrongAns = `"${b} is ${diff} more than ${a}" — the additive comparison`;
      const decoys = [wrongAns, "Both describe the relationship equally well here", "Neither description is mathematically valid", "You would need a calculator to compare these numbers at all"];
      const { options, correctIndex } = buildMCStr(correctAns, decoys);
      return { q: `${a} and ${b} can be compared additively ("${b} is ${diff} more than ${a}") or multiplicatively ("${b} is ${k} times as many as ${a}"). Since ${a} is so much smaller than ${b}, which comparison gives the clearer picture of the size difference?`, options, correctIndex,
        hint: "When two numbers are very different in size, the additive difference can be huge but uninformative, while the multiplicative scale factor usually gives a clearer sense of how the sizes relate.",
        solution: {
          scenario: `${a} and ${b} are very different in size (a scale factor of ${k}).`,
          idea: "For very different-sized quantities, a multiplicative comparison (scale factor) conveys the relationship more clearly than the raw additive difference.",
          method: ["Compare how informative each description is when the numbers are far apart.", `Notice "${k} times as many" gives a clear sense of scale, while "${diff} more" is a large number that says little on its own.`],
          steps: [`"${k} times as many" is the clearer comparison here.`],
          check: "Both statements are numerically true, but only the multiplicative one is easy to picture.",
        } };
    },
  },
  signed_difference_find_value: {
    difficulties: [3, 4],
    build(d) {
      const ctx = pick(SIGNED_CONTEXTS);
      const x = d <= 3 ? rand(-15, 15) : rand(-25, 25);
      const D = d <= 3 ? rand(3, 15) : rand(5, 25);
      const goesUp = pick([true, false]);
      const y = goesUp ? x + D : x - D;
      const decoys = [x, goesUp ? x - D : x + D, y + D, y - D, -y].filter((v) => Number.isFinite(v) && v !== y);
      const { options, correctIndex } = buildMC(y, [...new Set(decoys)], ctx.fmt);
      return { q: `${ctx.describe(ctx.nameA, x)}. ${ctx.nameB} is ${D} ${ctx.noun}${D === 1 ? "" : "s"} ${goesUp ? ctx.cmpUp : ctx.cmpDown} than ${ctx.nameA}. What is ${ctx.nameB}'s value?`, options, correctIndex,
        hint: "An additive comparison clue tells you how much to add or subtract, even if the starting value is negative or the answer crosses zero.",
        solution: {
          scenario: `${ctx.describe(ctx.nameA, x)}. ${ctx.nameB} is ${D} ${ctx.noun}${D === 1 ? "" : "s"} ${goesUp ? ctx.cmpUp : ctx.cmpDown} than ${ctx.nameA}.`,
          idea: "'Higher/warmer than' means add; 'lower/colder than' means subtract, exactly as with positive numbers, even when the value is negative or crosses zero.",
          method: [`${goesUp ? "Add" : "Subtract"} ${D} ${goesUp ? "to" : "from"} ${x}.`],
          steps: [`${x} ${goesUp ? "+" : "−"} ${D} = ${y}.`],
          check: `${y} is ${D} ${ctx.noun}${D === 1 ? "" : "s"} ${goesUp ? ctx.cmpUp : ctx.cmpDown} than ${x}, as required.`,
        } };
    },
  },
  count_comparison_from_totals: {
    difficulties: [3, 4],
    build(d) {
      const m = d <= 3 ? rand(5, 30) : rand(10, 50);
      const diff = d <= 3 ? rand(2, 20) : rand(3, 40);
      const larger = m + diff;
      const sum = m + larger;
      const askLarger = pick([true, false]);
      const answer = askLarger ? larger : m;
      const other = askLarger ? m : larger;
      const decoys = [other, sum, diff, Math.round(sum / 2), answer + diff].filter((x) => x !== answer && x > 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(decoys)]);
      return { q: `Two numbers add up to ${sum}. They differ by ${diff}. What is the ${askLarger ? "larger" : "smaller"} number?`, options, correctIndex,
        hint: "For a sum-and-difference puzzle, add the sum and the difference together and halve it to get the larger number; subtract the difference from that to get the smaller.",
        solution: {
          scenario: `Two numbers add to ${sum} and differ by ${diff}.`,
          idea: "The larger number is half of (sum + difference); the smaller is the larger number minus the difference.",
          method: [`Add the sum and the difference: ${sum} + ${diff} = ${sum + diff}.`, "Halve it to get the larger number.", askLarger ? "" : "Subtract the difference from the larger number to get the smaller."].filter(Boolean),
          steps: [`(${sum} + ${diff}) ÷ 2 = ${larger}.`, askLarger ? `The larger number is ${larger}.` : `${larger} − ${diff} = ${m}, the smaller number.`],
          check: `${m} + ${larger} = ${sum}, and ${larger} − ${m} = ${diff}.`,
        } };
    },
  },
};
// Structure registry for areaPerimeter. Covers rectangle/square area and perimeter both
// forward and reverse, grid-counting (whole and half squares), regular polygon perimeter,
// the area-vs-perimeter conceptual distinction, L-shape notch problems (area DOES change,
// perimeter does NOT — a deliberate contrast pair), shape comparison, tiling, a path-around-
// a-garden area problem, a ratio-of-sides reverse problem, and two composite-shape (two
// rectangles joined) problems for area and perimeter.
const AP_POLY_NAMES = { 3: "triangle", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon" };
function apGridSvg(rows, cols) {
  const cell = 28;
  const w = cols * cell, h = rows * cell;
  const ox = 10, oy = 10;
  let inner = SR(ox, oy, w, h, "#2a1a5e", 2, "none");
  for (let i = 1; i < cols; i++) inner += SL(ox + i * cell, oy, ox + i * cell, oy + h, "#8877c0", 1);
  for (let j = 1; j < rows; j++) inner += SL(ox, oy + j * cell, ox + w, oy + j * cell, "#8877c0", 1);
  return svgBox(inner, w + 20, h + 20);
}
function apLabelledRectSvg(L, W) {
  const pxW = 200, pxH = 110, ox = 50, oy = 30;
  let inner = SR(ox, oy, pxW, pxH, "#2a1a5e", 2, "none");
  inner += ST(ox + pxW / 2, oy - 10, `${L} cm`, "middle", 14);
  inner += ST(ox - 20, oy + pxH / 2 + 5, `${W} cm`, "middle", 14);
  return svgBox(inner, pxW + 90, pxH + 70);
}
const AREA_PERIMETER_STRUCTURES = {
  rect_area_basic: {
    difficulties: [1, 2],
    build(d) {
      const maxSide = d <= 1 ? 9 : 12;
      const L = rand(4, maxSide);
      let W = rand(2, L - 1);
      if (W === L) W = Math.max(2, W - 1);
      const area = L * W;
      const { options, correctIndex } = buildMC(area, [L + W, 2 * (L + W), (L - 1) * W, L * (W + 1)], (x) => `${x} cm²`);
      return {
        q: `A rectangle is ${L} cm long and ${W} cm wide. What is its area?`,
        options,
        correctIndex,
        hint: "To find the area of a rectangle, multiply the length by the width.",
        solution: {
          idea: "Area of a rectangle = length × width.",
          steps: [`Length = ${L} cm, width = ${W} cm`, `Area = ${L} × ${W} = ${area} cm²`],
          check: `${area} cm²`,
        },
      };
    },
  },

  rect_perimeter_basic: {
    difficulties: [1, 2],
    build(d) {
      const maxSide = d <= 1 ? 9 : 12;
      const L = rand(4, maxSide);
      let W = rand(2, L - 1);
      if (W === L) W = Math.max(2, W - 1);
      const perim = 2 * (L + W);
      const { options, correctIndex } = buildMC(perim, [L * W, L + W, 2 * L + W, L + 2 * W], (x) => `${x} cm`);
      return {
        q: `A rectangle is ${L} cm long and ${W} cm wide. What is its perimeter?`,
        options,
        correctIndex,
        hint: "The perimeter is the distance all the way around the shape: add up all four sides.",
        solution: {
          idea: "Perimeter of a rectangle = 2 × (length + width).",
          steps: [`Length = ${L} cm, width = ${W} cm`, `Perimeter = 2 × (${L} + ${W}) = 2 × ${L + W} = ${perim} cm`],
          check: `${perim} cm`,
        },
      };
    },
  },

  square_area_basic: {
    difficulties: [1, 2],
    build(d) {
      const s = rand(2, d <= 1 ? 9 : 12);
      const area = s * s;
      const { options, correctIndex } = buildMC(area, [4 * s, 2 * s, s * (s + 1), (s - 1) * s], (x) => `${x} cm²`);
      return {
        q: `A square has sides of length ${s} cm. What is its area?`,
        options,
        correctIndex,
        hint: "The area of a square is its side length multiplied by itself.",
        solution: {
          idea: "Area of a square = side × side.",
          steps: [`Side = ${s} cm`, `Area = ${s} × ${s} = ${area} cm²`],
          check: `${area} cm²`,
        },
      };
    },
  },

  square_perimeter_basic: {
    difficulties: [1, 2],
    build(d) {
      const s = rand(2, d <= 1 ? 9 : 12);
      const perim = 4 * s;
      const { options, correctIndex } = buildMC(perim, [s * s, 2 * s, 3 * s, 5 * s], (x) => `${x} cm`);
      return {
        q: `A square has sides of length ${s} cm. What is its perimeter?`,
        options,
        correctIndex,
        hint: "A square has four equal sides, so multiply the side length by 4.",
        solution: {
          idea: "Perimeter of a square = 4 × side.",
          steps: [`Side = ${s} cm`, `Perimeter = 4 × ${s} = ${perim} cm`],
          check: `${perim} cm`,
        },
      };
    },
  },

  grid_area_whole_squares: {
    difficulties: [1],
    build() {
      const rows = rand(2, 4);
      const cols = rand(2, 6);
      const area = rows * cols;
      const svg = apGridSvg(rows, cols);
      const { options, correctIndex } = buildMC(area, [rows + cols, 2 * (rows + cols), area + 1, (rows - 1) * cols], (x) => `${x} cm²`);
      return {
        q: `The grid is made up of squares that are each 1 cm by 1 cm, arranged in ${rows} rows and ${cols} columns. What is the total area of the grid?`,
        svg,
        options,
        correctIndex,
        hint: "Count the squares, or multiply the number of rows by the number of columns.",
        solution: {
          idea: "Each square is 1 cm², so the total area is the number of squares.",
          steps: [`Rows = ${rows}, columns = ${cols}`, `Number of squares = ${rows} × ${cols} = ${area}`],
          check: `${area} cm²`,
        },
      };
    },
  },

  regular_polygon_perimeter: {
    difficulties: [1, 2],
    build(d) {
      const nOptions = d <= 1 ? [3, 5, 6] : [3, 5, 6, 7, 8];
      const n = pick(nOptions);
      const s = rand(3, d <= 1 ? 9 : 12);
      const perim = n * s;
      const { options, correctIndex } = buildMC(perim, [s * (n - 1), s * (n + 1), s + n, n * s + s], (x) => `${x} cm`);
      return {
        q: `A regular ${AP_POLY_NAMES[n]} has ${n} sides, each ${s} cm long. What is its perimeter?`,
        options,
        correctIndex,
        hint: "In a regular polygon all the sides are equal, so multiply the side length by the number of sides.",
        solution: {
          idea: "Perimeter = number of sides × side length.",
          steps: [`Number of sides = ${n}`, `Perimeter = ${n} × ${s} = ${perim} cm`],
          check: `${perim} cm`,
        },
      };
    },
  },

  area_vs_perimeter_concept: {
    difficulties: [1, 2],
    build() {
      const scenarios = [
        { action: "put a fence all the way around", noun: "field", answer: "Perimeter" },
        { action: "lay new carpet over the floor of", noun: "room", answer: "Area" },
        { action: "put skirting board around the edge of", noun: "room", answer: "Perimeter" },
        { action: "cover the floor of", noun: "hall", answer: "Area" },
        { action: "paint the whole surface of", noun: "wall", answer: "Area" },
        { action: "put a ribbon around the edge of", noun: "noticeboard", answer: "Perimeter" },
      ];
      const sc = pick(scenarios);
      const pool = ["Area", "Perimeter", "Volume", "Both area and perimeter", "Diameter"];
      const distractors = pool.filter((x) => x !== sc.answer).slice(0, 4);
      const { options, correctIndex } = buildMCStr(sc.answer, distractors);
      return {
        q: `Priya wants to ${sc.action} a rectangular ${sc.noun}. Which measurement does she need to work out?`,
        options,
        correctIndex,
        hint: "Perimeter measures the distance around the edge of a shape; area measures the space inside it.",
        solution: {
          idea: "Decide whether the task is about the edge of the shape or the space it covers.",
          steps: [`To ${sc.action} the ${sc.noun} means working with ${sc.answer.toLowerCase()}.`],
          check: sc.answer,
        },
      };
    },
  },

  grid_area_half_squares: {
    difficulties: [2, 3],
    build() {
      const wholeCount = rand(4, 10);
      const halfCount = rand(2, 8);
      const area = wholeCount + halfCount * 0.5;
      const { options, correctIndex } = buildMC(
        area,
        [wholeCount + halfCount, wholeCount, area + 1, wholeCount + halfCount * 1.5],
        (x) => `${x} cm²`
      );
      return {
        q: `A shape is drawn on a centimetre grid. It is made up of ${wholeCount} whole squares and ${halfCount} half squares (each whole square is 1 cm by 1 cm). What is the total area of the shape?`,
        options,
        correctIndex,
        hint: "Two half squares make one whole square: work out how much area the half squares add up to first.",
        solution: {
          idea: "Add the area of the whole squares to the area of the half squares.",
          steps: [
            `Whole squares = ${wholeCount} × 1 cm² = ${wholeCount} cm²`,
            `Half squares = ${halfCount} × 0.5 cm² = ${halfCount * 0.5} cm²`,
            `Total area = ${wholeCount} + ${halfCount * 0.5} = ${area} cm²`,
          ],
          check: `${area} cm²`,
        },
      };
    },
  },

  reverse_rect_area_missing_side: {
    difficulties: [2, 3],
    build(d) {
      const W = rand(2, d <= 2 ? 8 : 12);
      const L = rand(3, d <= 2 ? 9 : 12);
      const area = L * W;
      const { options, correctIndex } = buildMC(W, [L, area, W + 1, W > 1 ? W - 1 : W + 2], (x) => `${x} cm`);
      return {
        q: `A rectangle has an area of ${area} cm² and one side is ${L} cm long. What is the length of the other side?`,
        options,
        correctIndex,
        hint: "Area = length × width, so divide the area by the side you know.",
        solution: {
          idea: "Divide the area by the known side to find the missing side.",
          steps: [`Area = length × width`, `${area} ÷ ${L} = ${W}`],
          check: `${W} cm`,
        },
      };
    },
  },

  reverse_rect_perimeter_missing_side: {
    difficulties: [2, 3],
    build(d) {
      const L = rand(3, d <= 2 ? 9 : 12);
      const W = rand(2, d <= 2 ? 8 : 12);
      const P = 2 * (L + W);
      const { options, correctIndex } = buildMC(W, [P - L, Math.round(P / 2), P / 2 + L, L], (x) => `${x} cm`);
      return {
        q: `A rectangle has a perimeter of ${P} cm. One side is ${L} cm long. What is the length of the other side?`,
        options,
        correctIndex,
        hint: "Halve the perimeter to get the sum of one length and one width, then subtract the side you know.",
        solution: {
          idea: "Perimeter = 2 × (length + width), so work backwards.",
          steps: [`Half the perimeter = ${P} ÷ 2 = ${P / 2} cm`, `Other side = ${P / 2} − ${L} = ${W} cm`],
          check: `${W} cm`,
        },
      };
    },
  },

  square_perimeter_to_area: {
    difficulties: [2, 3],
    build(d) {
      const s = rand(2, d <= 2 ? 9 : 12);
      const perim = 4 * s;
      const area = s * s;
      const { options, correctIndex } = buildMC(area, [perim, s, (s + 1) * (s + 1), 2 * s * s], (x) => `${x} cm²`);
      return {
        q: `A square has a perimeter of ${perim} cm. What is its area?`,
        options,
        correctIndex,
        hint: "First find the side length by dividing the perimeter by 4, then square it.",
        solution: {
          idea: "Find the side length from the perimeter, then use it to find the area.",
          steps: [`Side = ${perim} ÷ 4 = ${s} cm`, `Area = ${s} × ${s} = ${area} cm²`],
          check: `${area} cm²`,
        },
      };
    },
  },

  square_area_to_perimeter: {
    difficulties: [2, 3],
    build(d) {
      const s = rand(2, d <= 2 ? 9 : 12);
      const area = s * s;
      const perim = 4 * s;
      const { options, correctIndex } = buildMC(perim, [area, 2 * s, 4 * (s + 1), 3 * s], (x) => `${x} cm`);
      return {
        q: `A square has an area of ${area} cm². What is its perimeter?`,
        options,
        correctIndex,
        hint: "First find the side length by taking the square root of the area, then multiply by 4.",
        solution: {
          idea: "Find the side length from the area, then use it to find the perimeter.",
          steps: [`Side = √${area} = ${s} cm`, `Perimeter = 4 × ${s} = ${perim} cm`],
          check: `${perim} cm`,
        },
      };
    },
  },

  labelled_diagram_rect: {
    difficulties: [2, 3],
    build(d) {
      const L = rand(4, d <= 2 ? 10 : 12);
      let W = rand(3, L - 1);
      if (W === L) W = Math.max(2, W - 1);
      const askArea = pick([true, false]);
      const svg = apLabelledRectSvg(L, W);
      const area = L * W;
      const perim = 2 * (L + W);
      const answer = askArea ? area : perim;
      const distractors = askArea
        ? [L + W, 2 * (L + W), (L - 1) * W, L * (W + 1)]
        : [L * W, L + W, 2 * L + W, L + 2 * W];
      const fmt = (x) => (askArea ? `${x} cm²` : `${x} cm`);
      const { options, correctIndex } = buildMC(answer, distractors, fmt);
      return {
        q: `The rectangle shown has a length of ${L} cm and a width of ${W} cm. What is its ${askArea ? "area" : "perimeter"}?`,
        svg,
        options,
        correctIndex,
        hint: askArea
          ? "Multiply the length by the width to find the area."
          : "Add up all four sides, or use 2 × (length + width), to find the perimeter.",
        solution: {
          idea: askArea ? "Area of a rectangle = length × width." : "Perimeter of a rectangle = 2 × (length + width).",
          steps: askArea
            ? [`Length = ${L} cm, width = ${W} cm`, `Area = ${L} × ${W} = ${area} cm²`]
            : [`Length = ${L} cm, width = ${W} cm`, `Perimeter = 2 × (${L} + ${W}) = ${perim} cm`],
          check: fmt(answer),
        },
      };
    },
  },

  L_shape_area: {
    difficulties: [2, 3],
    build(d) {
      const W = rand(6, d <= 2 ? 10 : 14);
      const H = rand(5, d <= 2 ? 9 : 12);
      const w = rand(2, W - 2);
      const h = rand(2, H - 2);
      const wholeArea = W * H;
      const notchArea = w * h;
      const area = wholeArea - notchArea;
      const { options, correctIndex } = buildMC(area, [wholeArea, wholeArea + notchArea, notchArea, (W - w) * (H - h)], (x) => `${x} cm²`);
      return {
        q: `A shape is made from a rectangle ${W} cm by ${H} cm, with a smaller rectangle ${w} cm by ${h} cm cut from one corner. What is the area of the remaining shape?`,
        options,
        correctIndex,
        hint: "Find the area of the whole rectangle, then subtract the area of the corner that was cut out.",
        solution: {
          idea: "Area of the L-shape = area of the whole rectangle − area of the cut-out corner.",
          steps: [
            `Whole rectangle = ${W} × ${H} = ${wholeArea} cm²`,
            `Cut-out corner = ${w} × ${h} = ${notchArea} cm²`,
            `Remaining area = ${wholeArea} − ${notchArea} = ${area} cm²`,
          ],
          check: `${area} cm²`,
        },
      };
    },
  },

  L_shape_perimeter_invariant: {
    difficulties: [3, 4],
    build(d) {
      const W = rand(6, d <= 3 ? 12 : 16);
      const H = rand(5, d <= 3 ? 10 : 14);
      const w = rand(2, W - 2);
      const h = rand(2, H - 2);
      const perim = 2 * (W + H);
      const { options, correctIndex } = buildMC(
        perim,
        [perim - 2 * (w + h), perim + 2 * (w + h), 2 * (W - w + H - h), W * H - w * h],
        (x) => `${x} cm`
      );
      return {
        q: `A rectangle measuring ${W} cm by ${H} cm has a rectangular notch ${w} cm by ${h} cm cut from one corner. What is the perimeter of the resulting shape?`,
        options,
        correctIndex,
        hint: "Cutting a rectangular notch out of a corner does not change the perimeter: the edges you remove are replaced by edges of exactly the same total length.",
        solution: {
          idea: "Cutting a corner notch out of a rectangle does not change its perimeter.",
          steps: [
            `Perimeter of the original rectangle = 2 × (${W} + ${H}) = ${perim} cm`,
            `The notch removes two edges but adds two edges of the same total length, so the perimeter stays ${perim} cm`,
          ],
          check: `${perim} cm`,
        },
      };
    },
  },

  L_shape_which_changed: {
    difficulties: [3, 4],
    build(d) {
      const W = rand(6, d <= 3 ? 12 : 16);
      const H = rand(5, d <= 3 ? 10 : 14);
      const w = rand(2, W - 2);
      const h = rand(2, H - 2);
      const correct = "The area decreases; the perimeter stays the same";
      const distractors = [
        "Both the area and the perimeter decrease",
        "The area stays the same; the perimeter decreases",
        "Both the area and the perimeter stay the same",
        "The area increases; the perimeter stays the same",
      ];
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `A rectangular notch ${w} cm by ${h} cm is cut from one corner of a ${W} cm by ${H} cm rectangle. Compared with the original rectangle, what happens to the area and the perimeter of the shape?`,
        options,
        correctIndex,
        hint: "Cutting out the corner removes some of the surface, but the edges it removes are replaced by edges of equal total length.",
        solution: {
          idea: "Removing material always reduces the area, but a corner notch does not change the perimeter.",
          steps: [
            "The notch removes some of the surface, so the area gets smaller.",
            "The two edges removed by the notch are replaced by two edges of the same total length, so the perimeter is unchanged.",
          ],
          check: correct,
        },
      };
    },
  },

  compare_shapes: {
    difficulties: [3, 4],
    build(d) {
      const max = d <= 3 ? 12 : 16;
      const L1 = rand(3, max);
      const W1 = rand(2, L1 - 1);
      const L2 = rand(3, max);
      const W2 = rand(2, L2 - 1);
      const quantity = pick(["area", "perimeter"]);
      const q1 = quantity === "area" ? L1 * W1 : 2 * (L1 + W1);
      const q2 = quantity === "area" ? L2 * W2 : 2 * (L2 + W2);
      if (q1 === q2) return null;
      const correct = q1 > q2 ? "Rectangle A" : "Rectangle B";
      const pool = ["Rectangle A", "Rectangle B", "They are equal", "Not enough information", "Both are the same size"];
      const distractors = pool.filter((x) => x !== correct).slice(0, 4);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `Rectangle A is ${L1} cm by ${W1} cm. Rectangle B is ${L2} cm by ${W2} cm. Which rectangle has the greater ${quantity}?`,
        options,
        correctIndex,
        hint: `Work out the ${quantity} of each rectangle, then compare them.`,
        solution: {
          idea: `Calculate the ${quantity} of both rectangles and compare.`,
          steps: [
            quantity === "area" ? `Rectangle A area = ${L1} × ${W1} = ${q1} cm²` : `Rectangle A perimeter = 2 × (${L1} + ${W1}) = ${q1} cm`,
            quantity === "area" ? `Rectangle B area = ${L2} × ${W2} = ${q2} cm²` : `Rectangle B perimeter = 2 × (${L2} + ${W2}) = ${q2} cm`,
            `${q1} vs ${q2}, so ${correct} is greater`,
          ],
          check: correct,
        },
      };
    },
  },

  tiling_floor: {
    difficulties: [3, 4],
    build(d) {
      const t = rand(2, d <= 3 ? 4 : 6);
      const a = rand(2, d <= 3 ? 6 : 9);
      const b = rand(2, d <= 3 ? 6 : 9);
      const L = t * a, W = t * b;
      const tiles = a * b;
      const { options, correctIndex } = buildMC(tiles, [L * W, a + b, tiles + t, a * b * t], (x) => `${x}`);
      return {
        q: `A rectangular tabletop measures ${L} cm by ${W} cm. It is covered exactly, with no gaps or overlaps, using square tiles that are ${t} cm by ${t} cm. How many tiles are needed?`,
        options,
        correctIndex,
        hint: "Work out how many tiles fit along each side, then multiply those two numbers together.",
        solution: {
          idea: "Divide each side of the tabletop by the tile size to find how many tiles fit along it, then multiply.",
          steps: [
            `Tiles along the length = ${L} ÷ ${t} = ${a}`,
            `Tiles along the width = ${W} ÷ ${t} = ${b}`,
            `Total tiles = ${a} × ${b} = ${tiles}`,
          ],
          check: `${tiles} tiles`,
        },
      };
    },
  },

  path_around_garden: {
    difficulties: [3, 4],
    build(d) {
      const Lg = rand(4, d <= 3 ? 10 : 14);
      const Wg = rand(3, d <= 3 ? 8 : 12);
      const p = rand(1, d <= 3 ? 2 : 3);
      const outer = (Lg + 2 * p) * (Wg + 2 * p);
      const inner = Lg * Wg;
      const pathArea = outer - inner;
      const { options, correctIndex } = buildMC(pathArea, [outer, inner, 4 * p * p, 2 * p * (Lg + Wg)], (x) => `${x} m²`);
      return {
        q: `A rectangular garden measures ${Lg} m by ${Wg} m. It has a path ${p} m wide running all the way around the outside. What is the area of the path?`,
        options,
        correctIndex,
        hint: "Find the area of the garden plus path together, then subtract the area of the garden alone.",
        solution: {
          idea: "Area of the path = area of the outer rectangle (garden + path) − area of the garden.",
          steps: [
            `Outer rectangle = (${Lg} + ${2 * p}) × (${Wg} + ${2 * p}) = ${Lg + 2 * p} × ${Wg + 2 * p} = ${outer} m²`,
            `Garden = ${Lg} × ${Wg} = ${inner} m²`,
            `Path area = ${outer} − ${inner} = ${pathArea} m²`,
          ],
          check: `${pathArea} m²`,
        },
      };
    },
  },

  ratio_sides_area: {
    difficulties: [3, 4],
    build(d) {
      const w = rand(2, d <= 3 ? 5 : 7);
      const N = rand(2, d <= 3 ? 4 : 5);
      const L = N * w;
      const area = L * w;
      const { options, correctIndex } = buildMC(w, [Math.round(area / N), L, w + 1, w > 1 ? w - 1 : w + 2], (x) => `${x} cm`);
      return {
        q: `A rectangle has an area of ${area} cm². It is ${N} times as long as it is wide. What is the width of the rectangle?`,
        options,
        correctIndex,
        hint: "Let the width be w. The length is then N × w, so the area is N × w². Work backwards to find w.",
        solution: {
          idea: "Write the length in terms of the width, then use the area to find the width.",
          steps: [
            `Let the width = w, so the length = ${N} × w`,
            `Area = length × width = ${N} × w × w = ${N}w²`,
            `${N}w² = ${area}, so w² = ${area / N}`,
            `w = √${area / N} = ${w} cm`,
          ],
          check: `${w} cm`,
        },
      };
    },
  },

  composite_two_rectangles_area: {
    difficulties: [3, 4],
    build(d) {
      const max = d <= 3 ? 10 : 14;
      const w1 = rand(3, max), h1 = rand(2, max);
      const w2 = rand(2, max), h2 = rand(2, max);
      const a1 = w1 * h1, a2 = w2 * h2;
      const total = a1 + a2;
      const { options, correctIndex } = buildMC(total, [a1, a2, w1 * h1 * w2 * h2, total + Math.min(w1, w2) * Math.min(h1, h2)], (x) => `${x} cm²`);
      return {
        q: `A shape is made from two rectangles joined together with no overlap: one is ${w1} cm by ${h1} cm, the other is ${w2} cm by ${h2} cm. What is the total area of the shape?`,
        options,
        correctIndex,
        hint: "Find the area of each rectangle separately, then add them together.",
        solution: {
          idea: "When two shapes are joined with no overlap, their areas simply add together.",
          steps: [`First rectangle = ${w1} × ${h1} = ${a1} cm²`, `Second rectangle = ${w2} × ${h2} = ${a2} cm²`, `Total area = ${a1} + ${a2} = ${total} cm²`],
          check: `${total} cm²`,
        },
      };
    },
  },

  composite_two_rectangles_perimeter: {
    difficulties: [4],
    build() {
      const Wt = rand(6, 14);
      const Ws = rand(2, Wt - 2);
      const Ht = rand(2, 6);
      const Hs = rand(3, 8);
      const perim = 2 * (Wt + Ht + Hs);
      const { options, correctIndex } = buildMC(
        perim,
        [2 * (Wt + Ht + Hs + Ws), Wt * Ht + Ws * Hs, 2 * (Wt + Ht) + 2 * (Ws + Hs), perim - 2 * Ws],
        (x) => `${x} cm`
      );
      return {
        q: `A T-shaped tile is made from a horizontal bar ${Wt} cm by ${Ht} cm sitting on top of a vertical stem ${Ws} cm by ${Hs} cm, centred underneath the bar. What is the perimeter of the whole T-shape?`,
        options,
        correctIndex,
        hint: "Trace all the way around the outside edge of the T-shape, adding up every length as you go.",
        solution: {
          idea: "The perimeter of this T-shape is 2 × (bar width + bar height + stem height), because the step in and step out along the bottom of the bar cancel each other's length exactly.",
          steps: [
            `Bar: ${Wt} cm wide, ${Ht} cm tall`,
            `Stem: ${Ws} cm wide, ${Hs} cm tall`,
            `Perimeter = 2 × (${Wt} + ${Ht} + ${Hs}) = ${perim} cm`,
          ],
          check: `${perim} cm`,
        },
      };
    },
  },
};
// Structure registry for shapeProperties. Covers polygon naming both directions, side/
// vertex counting, regular-vs-irregular judgement, quadrilateral identification from
// stated properties (respecting the shape hierarchy so exactly one answer fits), regular
// polygon perimeter forward and reverse, lines-of-symmetry recall, triangle classification
// by sides and by angles, coordinate reading, point translation by a vector, missing-
// property reasoning, "what am I" riddles, a 4th-rectangle-vertex problem, and an odd-one-
// out-by-side-count task. The triangle diagram is deliberately fixed/decorative (no
// proportional claims) so it can never visually contradict a scalene/isosceles labelling —
// this is the fix for the known bug where a fixed-shape triangle diagram looked isosceles
// regardless of the stated (possibly scalene) side lengths.
const SP_POLY_NAMES = [
  { n: 3, name: "triangle" },
  { n: 4, name: "quadrilateral" },
  { n: 5, name: "pentagon" },
  { n: 6, name: "hexagon" },
  { n: 7, name: "heptagon" },
  { n: 8, name: "octagon" },
  { n: 9, name: "nonagon" },
  { n: 10, name: "decagon" },
];
const SP_QUAD_NAMES = ["square", "rectangle", "rhombus", "parallelogram", "trapezium"];
function spRegularPolygonSVG(n, opts = {}) {
  const { cx = 140, cy = 110, r = 75, color = "#2a1a5e" } = opts;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const angle = ((-90 + (i * 360) / n) * Math.PI) / 180;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="2.5"/>`;
}
function spGenericTriangleSVG() {
  return `<polygon points="140,40 60,180 220,180" fill="none" stroke="#2a1a5e" stroke-width="2.5"/>`;
}
function spGridSVG(maxX, maxY, points) {
  const cell = maxX > 10 || maxY > 10 ? 22 : 28;
  const padL = 40, padB = 36, padT = 20, padR = 24;
  const w = padL + maxX * cell + padR;
  const h = padT + maxY * cell + padB;
  const X = (x) => padL + x * cell;
  const Y = (y) => padT + (maxY - y) * cell;
  let s = "";
  for (let i = 0; i <= maxX; i++) s += SL(X(i), Y(0), X(i), Y(maxY), "#d8d0f0", 1);
  for (let j = 0; j <= maxY; j++) s += SL(X(0), Y(j), X(maxX), Y(j), "#d8d0f0", 1);
  s += SL(X(0), Y(0), X(maxX), Y(0));
  s += SL(X(0), Y(0), X(0), Y(maxY));
  for (let i = 0; i <= maxX; i++) s += ST(X(i), Y(0) + 18, String(i), "middle", 11);
  for (let j = 0; j <= maxY; j++) s += ST(X(0) - 16, Y(j) + 4, String(j), "middle", 11);
  points.forEach((p) => {
    const col = p.color || "#e0526b";
    s += SC(X(p.x), Y(p.y), 5, col, 2, col);
    if (p.label) s += ST(X(p.x) + 10, Y(p.y) - 8, p.label, "start", 13);
  });
  return svgBox(s, w, h);
}
function spUniqueStrCandidates(correctStr, rawCandidates) {
  const out = [];
  const seen = new Set([correctStr]);
  for (const c of rawCandidates) {
    if (seen.has(c)) continue;
    seen.add(c);
    out.push(c);
  }
  return out.slice(0, 4);
}
function spDistinctPositiveOffsets(correct, offsets) {
  const out = [];
  const seen = new Set([correct]);
  for (const o of offsets) {
    const v = correct + o;
    if (v <= 0 || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
    if (out.length >= 4) break;
  }
  let bump = out.length + 5;
  while (out.length < 4) {
    const v = correct + bump;
    bump++;
    if (v <= 0 || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}
function spClassifyAngles(a, b, c) {
  const mx = Math.max(a, b, c);
  if (mx === 90) return "right-angled";
  if (mx > 90) return "obtuse";
  return "acute";
}
const SP_QUAD_PROPERTY_SCENARIOS = [
  { desc: "all four sides are equal in length and all four angles are right angles", answer: "square" },
  { desc: "opposite sides are equal in length, all four angles are right angles, but not all four sides are equal", answer: "rectangle" },
  { desc: "all four sides are equal in length and opposite sides are parallel, but the angles are not right angles", answer: "rhombus" },
  { desc: "opposite sides are equal in length and parallel, but the sides are not all equal and the angles are not right angles", answer: "parallelogram" },
  { desc: "exactly one pair of opposite sides is parallel", answer: "trapezium" },
];
const SP_QUAD_RECALL_ITEMS = [
  { q: "Which of these shapes has exactly one pair of parallel sides?", answer: "trapezium" },
  { q: "Which of these shapes has four equal sides but does not necessarily have any right angles?", answer: "rhombus" },
  { q: "Which of these shapes has four right angles but does not necessarily have all sides equal?", answer: "rectangle" },
  { q: "Which of these shapes has both four equal sides and four right angles?", answer: "square" },
  { q: "Which of these shapes has two pairs of parallel sides but does not necessarily have equal sides or right angles?", answer: "parallelogram" },
];
const SP_MISSING_PROPERTY_SCENARIOS = [
  { text: "A shape has 4 equal sides, but its angles are not right angles. What shape must it be?", answer: "rhombus" },
  { text: "A shape has 4 right angles, but its sides are not all equal. What shape must it be?", answer: "rectangle" },
  { text: "A shape has two pairs of parallel sides, but no right angles and its sides are not all equal. What shape must it be?", answer: "parallelogram" },
  { text: "A shape has only one pair of parallel sides. What shape must it be?", answer: "trapezium" },
  { text: "A shape has 4 equal sides and 4 right angles. What shape must it be?", answer: "square" },
];
const SP_RIDDLE_SCENARIOS = [
  { text: "I have 3 sides, all different lengths. What am I?", answer: "scalene triangle", options: ["scalene triangle", "equilateral triangle", "isosceles triangle", "right-angled triangle", "regular hexagon"] },
  { text: "I have 3 sides, all equal in length. What am I?", answer: "equilateral triangle", options: ["equilateral triangle", "isosceles triangle", "scalene triangle", "regular pentagon", "square"] },
  { text: "I have 6 equal sides and 6 equal angles. What am I?", answer: "regular hexagon", options: ["regular hexagon", "irregular hexagon", "regular pentagon", "regular octagon", "irregular octagon"] },
  { text: "I have 4 sides, all different lengths, and no parallel sides. What am I?", answer: "irregular quadrilateral", options: ["irregular quadrilateral", "trapezium", "parallelogram", "rhombus", "kite"] },
  { text: "I have 5 equal sides and 5 equal angles. What am I?", answer: "regular pentagon", options: ["regular pentagon", "irregular pentagon", "regular hexagon", "square", "irregular hexagon"] },
];
const SHAPE_PROPERTIES_STRUCTURES = {

  polygon_name_from_sides: {
    difficulties: [1, 2],
    build(d) {
      const maxIdx = d <= 1 ? 5 : 7;
      const idx = rand(0, maxIdx);
      const item = SP_POLY_NAMES[idx];
      const svg = svgBox(spRegularPolygonSVG(item.n));
      const askName = pick([true, false]);
      if (askName) {
        const others = shuffle(SP_POLY_NAMES.filter((_, i) => i !== idx)).slice(0, 4).map((p) => p.name);
        const { options, correctIndex } = buildMCStr(item.name, others);
        return {
          q: `What is the name of a polygon with ${item.n} sides?`,
          options,
          correctIndex,
          svg,
          hint: "Match the number of sides to its name: 3=triangle, 4=quadrilateral, 5=pentagon, 6=hexagon, 7=heptagon, 8=octagon, 9=nonagon, 10=decagon.",
          solution: {
            idea: "Polygons are named after their number of sides.",
            steps: [`Count the sides shown: ${item.n}.`, `A polygon with ${item.n} sides is called a ${item.name}.`],
          },
        };
      }
      const others = shuffle(SP_POLY_NAMES.filter((_, i) => i !== idx)).slice(0, 4).map((p) => p.n);
      const { options, correctIndex } = buildMC(item.n, others);
      return {
        q: `How many sides does a ${item.name} have?`,
        options,
        correctIndex,
        svg,
        hint: "Match the shape name to its number of sides: triangle=3, quadrilateral=4, pentagon=5, hexagon=6, heptagon=7, octagon=8, nonagon=9, decagon=10.",
        solution: {
          idea: "Each polygon name tells you exactly how many sides it has.",
          steps: [`A ${item.name} always has ${item.n} sides.`],
        },
      };
    },
  },

  count_sides_vertices: {
    difficulties: [1, 2],
    build(d) {
      const maxIdx = d <= 1 ? 4 : 7;
      const idx = rand(0, maxIdx);
      const item = SP_POLY_NAMES[idx];
      const askVertices = pick([true, false]);
      const svg = svgBox(spRegularPolygonSVG(item.n));
      const correct = item.n;
      const others = spDistinctPositiveOffsets(correct, [-2, -1, 1, 2]);
      const { options, correctIndex } = buildMC(correct, others);
      return {
        q: askVertices ? "How many vertices (corners) does this shape have?" : "How many sides does this shape have?",
        options,
        correctIndex,
        svg,
        hint: "For any polygon, the number of vertices (corners) is always the same as the number of sides.",
        solution: {
          idea: "Count all the way around the shape.",
          steps: [
            `Counting each ${askVertices ? "corner" : "side"} gives ${item.n}.`,
            `This shape (a ${item.name}) has ${item.n} sides and ${item.n} vertices, since these are always equal for a polygon.`,
          ],
        },
      };
    },
  },

  regular_vs_irregular: {
    difficulties: [1, 2],
    build(d) {
      const maxIdx = d <= 1 ? 4 : 6;
      const idx = rand(0, maxIdx);
      const item = SP_POLY_NAMES[idx];
      const isRegular = pick([true, false]);
      let sideText, angleText;
      if (isRegular) {
        const side = rand(3, 9);
        sideText = `all ${item.n} sides are ${side} cm long`;
        angleText = "all its angles are equal";
      } else {
        const base = rand(3, 9);
        const lens = [];
        for (let i = 0; i < item.n; i++) lens.push(base + (i % 2 === 0 ? 0 : rand(1, 4)));
        if (new Set(lens).size === 1) lens[1] += 2;
        sideText = `its sides are ${lens.join(" cm, ")} cm long`;
        angleText = "its angles are not all equal";
      }
      const correct = `${isRegular ? "Regular" : "Irregular"} ${item.name}`;
      const otherNames = shuffle(SP_POLY_NAMES.filter((_, i) => i !== idx).map((p) => p.name)).slice(0, 3);
      const rawDistractors = [
        `${isRegular ? "Irregular" : "Regular"} ${item.name}`,
        ...otherNames.map((n) => `${pick(["Regular", "Irregular"])} ${n}`),
      ];
      const distractors = spUniqueStrCandidates(correct, rawDistractors);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      const svg = svgBox(spRegularPolygonSVG(item.n));
      const desc = sideText.charAt(0).toUpperCase() + sideText.slice(1);
      return {
        q: `A shape has ${item.n} sides. ${desc}, and ${angleText}. What is this shape?`,
        options,
        correctIndex,
        svg,
        hint: "A regular polygon has all sides the same length AND all angles equal. If either is not true, it is irregular.",
        solution: {
          idea: "Check both the sides and the angles before naming the shape.",
          steps: [
            `The shape has ${item.n} sides, so it is a kind of ${item.name}.`,
            isRegular
              ? "All the sides are equal and all the angles are equal, so it is regular."
              : "The sides are not all equal (and/or the angles are not all equal), so it is irregular.",
          ],
        },
      };
    },
  },

  quadrilateral_identify_from_properties: {
    difficulties: [1, 2],
    build(d) {
      const scenario = pick(SP_QUAD_PROPERTY_SCENARIOS);
      const others = SP_QUAD_NAMES.filter((n) => n !== scenario.answer);
      const { options, correctIndex } = buildMCStr(scenario.answer, others);
      return {
        q: `A quadrilateral has these properties: ${scenario.desc}. What is this shape called?`,
        options,
        correctIndex,
        hint: "Check the number of equal sides, whether sides are parallel, and whether the angles are right angles to narrow down the exact shape.",
        solution: {
          idea: "Match the properties given to the definition of each quadrilateral.",
          steps: [`The properties given (${scenario.desc}) match a ${scenario.answer} exactly.`],
        },
      };
    },
  },

  perimeter_regular_polygon_forward: {
    difficulties: [1, 2],
    build(d) {
      const maxIdx = d <= 1 ? 4 : 6;
      const idx = rand(0, maxIdx);
      const item = SP_POLY_NAMES[idx];
      const side = rand(3, d <= 1 ? 9 : 15);
      const correct = side * item.n;
      const others = spDistinctPositiveOffsets(correct, [item.n, -item.n, side, -side, item.n * 2, -item.n * 2]);
      const { options, correctIndex } = buildMC(correct, others);
      const svg = svgBox(spRegularPolygonSVG(item.n));
      return {
        q: `A regular ${item.name} has sides of length ${side} cm. What is its perimeter?`,
        options,
        correctIndex,
        svg,
        hint: "Perimeter of a regular polygon = number of sides × length of one side.",
        solution: {
          idea: "Multiply the side length by the number of sides.",
          steps: [`Number of sides: ${item.n}.`, `Perimeter = ${item.n} × ${side} = ${correct} cm.`],
        },
      };
    },
  },

  perimeter_regular_polygon_reverse: {
    difficulties: [2, 3],
    build(d) {
      const maxIdx = d <= 2 ? 6 : 7;
      const idx = rand(0, maxIdx);
      const item = SP_POLY_NAMES[idx];
      const side = rand(3, d <= 2 ? 12 : 20);
      const perimeter = side * item.n;
      const correct = side;
      const others = spDistinctPositiveOffsets(correct, [1, -1, 2, -2, 3, -3]);
      const { options, correctIndex } = buildMC(correct, others);
      const svg = svgBox(spRegularPolygonSVG(item.n));
      return {
        q: `A regular ${item.name} has a perimeter of ${perimeter} cm. What is the length of one side?`,
        options,
        correctIndex,
        svg,
        hint: "Divide the perimeter by the number of sides to find one side length.",
        solution: {
          idea: "The perimeter is shared equally between all the sides.",
          steps: [`Number of sides: ${item.n}.`, `Side length = ${perimeter} ÷ ${item.n} = ${side} cm.`],
        },
      };
    },
  },

  lines_of_symmetry_recall: {
    difficulties: [1, 2],
    build(d) {
      const maxIdx = d <= 1 ? 4 : 6;
      const idx = rand(0, maxIdx);
      const item = SP_POLY_NAMES[idx];
      const correct = item.n;
      const others = spDistinctPositiveOffsets(correct, [-1, 1, -2, 2]);
      const { options, correctIndex } = buildMC(correct, others);
      const svg = svgBox(spRegularPolygonSVG(item.n));
      return {
        q: `How many lines of symmetry does a regular ${item.name} have?`,
        options,
        correctIndex,
        svg,
        hint: "A regular polygon always has the same number of lines of symmetry as it has sides.",
        solution: {
          idea: "For any regular polygon, lines of symmetry = number of sides.",
          steps: [`A regular ${item.name} has ${item.n} sides.`, `So it has ${item.n} lines of symmetry.`],
        },
      };
    },
  },

  triangle_classify_sides: {
    difficulties: [2, 3],
    build(d) {
      const type = pick(["equilateral", "isosceles", "scalene"]);
      const cap = d <= 2 ? 9 : 15;
      let sides;
      if (type === "equilateral") {
        const s = rand(3, cap);
        sides = [s, s, s];
      } else if (type === "isosceles") {
        const s = rand(3, cap);
        let base;
        do { base = rand(3, cap); } while (base === s);
        sides = [s, s, base];
      } else {
        let a, b, c;
        let tries = 0;
        do {
          a = rand(3, cap + 1); b = rand(3, cap + 1); c = rand(3, cap + 1);
          tries++;
        } while ((a === b || b === c || a === c || a + b <= c || a + c <= b || b + c <= a) && tries < 50);
        if (tries >= 50) { a = 4; b = 6; c = 9; }
        sides = [a, b, c];
      }
      const correct = type;
      const distractors = ["equilateral", "isosceles", "scalene", "right-angled", "obtuse-angled"].filter((t) => t !== correct).slice(0, 4);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      const svg = svgBox(spGenericTriangleSVG());
      return {
        q: `A triangle has sides of length ${sides[0]} cm, ${sides[1]} cm and ${sides[2]} cm. What type of triangle is it (based on its sides)?`,
        options,
        correctIndex,
        svg,
        hint: "Equilateral: all 3 sides equal. Isosceles: exactly 2 sides equal. Scalene: all 3 sides different.",
        solution: {
          idea: "Compare the three side lengths carefully.",
          steps: [
            type === "equilateral"
              ? "All three sides are equal."
              : type === "isosceles"
              ? "Exactly two of the sides are equal."
              : "All three sides are different lengths.",
            `So this is a ${type} triangle.`,
          ],
        },
      };
    },
  },

  quadrilateral_property_recall: {
    difficulties: [2, 3],
    build(d) {
      const item = pick(SP_QUAD_RECALL_ITEMS);
      const others = SP_QUAD_NAMES.filter((n) => n !== item.answer);
      const { options, correctIndex } = buildMCStr(item.answer, others);
      return {
        q: item.q,
        options,
        correctIndex,
        hint: "Think about which quadrilateral is the general/basic case for that property, not a more special version of it.",
        solution: {
          idea: "Match the property to the shape that fits it without needing an extra property that was not stated.",
          steps: [`Only the ${item.answer} fits this description exactly.`],
        },
      };
    },
  },

  coordinates_read_point: {
    difficulties: [2, 3],
    build(d) {
      const maxC = d <= 2 ? 6 : 10;
      const x = rand(1, maxC);
      const y = rand(1, maxC);
      const correct = `(${x}, ${y})`;
      const rawDistractors = [
        `(${y}, ${x})`,
        `(${x + 1}, ${y})`,
        `(${x}, ${y + 1})`,
        `(${Math.max(x - 1, 0)}, ${y})`,
        `(${x}, ${Math.max(y - 1, 0)})`,
        `(${x + 2}, ${y})`,
        `(${x}, ${y + 2})`,
        `(${x + 1}, ${y + 1})`,
      ];
      const distractors = spUniqueStrCandidates(correct, rawDistractors);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      const svg = spGridSVG(maxC, maxC, [{ x, y, label: "P" }]);
      return {
        q: "What are the coordinates of point P?",
        options,
        correctIndex,
        svg,
        hint: "Coordinates are written (x, y): x is how far across (right), y is how far up.",
        solution: {
          idea: "Read across first, then up.",
          steps: [`Point P is ${x} across and ${y} up.`, `Its coordinates are ${correct}.`],
        },
      };
    },
  },

  triangle_classify_angles: {
    difficulties: [3, 4],
    build(d) {
      let a, b, c, type;
      if (d <= 3) {
        type = pick(["acute", "right-angled", "obtuse"]);
        if (type === "right-angled") {
          a = 90; b = rand(20, 60); c = 180 - a - b;
        } else if (type === "obtuse") {
          a = rand(91, 140); b = rand(10, 180 - a - 11); c = 180 - a - b;
        } else {
          do { a = rand(40, 80); b = rand(40, 80); c = 180 - a - b; } while (c <= 0 || c >= 90);
        }
      } else {
        type = pick(["acute", "right-angled", "obtuse"]);
        if (type === "right-angled") {
          a = 90; b = rand(15, 75);
        } else if (type === "obtuse") {
          a = rand(91, 150); b = rand(10, Math.max(10, 180 - a - 11));
        } else {
          do { a = rand(35, 85); b = rand(35, 85); } while (180 - a - b <= 0 || 180 - a - b >= 90);
        }
        c = 180 - a - b;
      }
      if (c <= 0 || spClassifyAngles(a, b, c) !== type) return null;
      const distractors = ["acute", "right-angled", "obtuse", "isosceles", "scalene"].filter((t) => t !== type).slice(0, 4);
      const { options, correctIndex } = buildMCStr(type, distractors);
      const svg = svgBox(spGenericTriangleSVG());
      if (d <= 3) {
        const angles = shuffle([a, b, c]);
        return {
          q: `A triangle has angles of ${angles[0]}°, ${angles[1]}° and ${angles[2]}°. What type of triangle is it (based on its angles)?`,
          options,
          correctIndex,
          svg,
          hint: "Acute: all angles under 90°. Right-angled: one angle is exactly 90°. Obtuse: one angle is over 90°.",
          solution: {
            idea: "Look at the largest angle.",
            steps: [
              `The largest angle is ${Math.max(a, b, c)}°.`,
              type === "right-angled"
                ? "It is exactly 90°, so the triangle is right-angled."
                : type === "obtuse"
                ? "It is more than 90°, so the triangle is obtuse."
                : "All angles are less than 90°, so the triangle is acute.",
            ],
          },
        };
      }
      return {
        q: `A triangle has angles of ${a}° and ${b}°. What type of triangle is it (based on its angles)?`,
        options,
        correctIndex,
        svg,
        hint: "First find the third angle: 180° minus the other two. Then check if the largest angle is under, exactly, or over 90°.",
        solution: {
          idea: "Angles in a triangle always sum to 180°.",
          steps: [
            `Third angle = 180° − ${a}° − ${b}° = ${c}°.`,
            `The largest angle is ${Math.max(a, b, c)}°.`,
            type === "right-angled"
              ? "One angle is exactly 90°, so it is right-angled."
              : type === "obtuse"
              ? "One angle is over 90°, so it is obtuse."
              : "All three angles are under 90°, so it is acute.",
          ],
        },
      };
    },
  },

  translate_point_vector: {
    difficulties: [3, 4],
    build(d) {
      const maxC = d <= 3 ? 10 : 12;
      let x = rand(0, maxC - 3);
      let y = rand(0, maxC - 3);
      let dx, dy, dirX, dirY;
      if (d <= 3) {
        dx = rand(1, 4); dy = rand(1, 4); dirX = "right"; dirY = "up";
      } else {
        dirX = pick(["right", "left"]);
        dirY = pick(["up", "down"]);
        dx = rand(1, 5); dy = rand(1, 5);
        if (dirX === "left") x = rand(dx, maxC);
        if (dirY === "down") y = rand(dy, maxC);
      }
      const nx = dirX === "right" ? x + dx : x - dx;
      const ny = dirY === "up" ? y + dy : y - dy;
      if (nx < 0 || ny < 0) return null;
      const correct = `(${nx}, ${ny})`;
      const rawDistractors = [
        `(${ny}, ${nx})`,
        `(${x + dx}, ${y + dy})`,
        `(${nx + 1}, ${ny})`,
        `(${nx}, ${ny + 1})`,
        `(${x}, ${y})`,
        `(${Math.max(nx - 1, 0)}, ${ny})`,
      ];
      const distractors = spUniqueStrCandidates(correct, rawDistractors);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      const svg = spGridSVG(Math.max(nx, x, maxC), Math.max(ny, y, maxC), [
        { x, y, label: "A", color: "#2a6ee0" },
        { x: nx, y: ny, label: "A'", color: "#e0526b" },
      ]);
      return {
        q: `Point A is at (${x}, ${y}). It is translated ${dx} ${dirX} and ${dy} ${dirY}. What are the coordinates of the translated point?`,
        options,
        correctIndex,
        svg,
        hint: "Moving right/left changes the x-coordinate; moving up/down changes the y-coordinate.",
        solution: {
          idea: "Adjust the x-coordinate for left/right, and the y-coordinate for up/down.",
          steps: [
            `Start at (${x}, ${y}).`,
            `Move ${dx} ${dirX}: x becomes ${nx}.`,
            `Move ${dy} ${dirY}: y becomes ${ny}.`,
            `New point: ${correct}.`,
          ],
        },
      };
    },
  },

  missing_property_reasoning: {
    difficulties: [3, 4],
    build(d) {
      const scenario = pick(SP_MISSING_PROPERTY_SCENARIOS);
      const others = SP_QUAD_NAMES.filter((n) => n !== scenario.answer);
      const { options, correctIndex } = buildMCStr(scenario.answer, others);
      return {
        q: scenario.text,
        options,
        correctIndex,
        hint: "Rule out the more special shapes first: if a property a special shape needs (like right angles or all sides equal) is missing, it cannot be that shape.",
        solution: {
          idea: "Use the properties given to rule out shapes that would need an extra property not mentioned, or that contradict a property explicitly missing.",
          steps: [`The described properties match a ${scenario.answer} exactly, once the more special shapes are ruled out.`],
        },
      };
    },
  },

  classify_from_properties_logic: {
    difficulties: [3, 4],
    build(d) {
      const scenario = pick(SP_RIDDLE_SCENARIOS);
      const others = scenario.options.filter((o) => o !== scenario.answer);
      const { options, correctIndex } = buildMCStr(scenario.answer, others);
      return {
        q: scenario.text,
        options,
        correctIndex,
        hint: "Work through each clue one at a time and rule out any shape that does not fit every clue.",
        solution: {
          idea: "Check every clue against each possible shape.",
          steps: [`Only "${scenario.answer}" satisfies every clue given.`],
        },
      };
    },
  },

  fourth_vertex_rectangle: {
    difficulties: [3, 4],
    build(d) {
      const maxC = d <= 3 ? 10 : 14;
      const x1 = rand(0, maxC - 4);
      const x2 = x1 + rand(2, 6);
      const y1 = rand(0, maxC - 4);
      const y2 = y1 + rand(2, 6);
      if (x2 > maxC || y2 > maxC) return null;
      const corners = { A: [x1, y1], B: [x2, y1], C: [x2, y2], D: [x1, y2] };
      const labels = ["A", "B", "C", "D"];
      const missing = pick(labels);
      const given = labels.filter((l) => l !== missing);
      const [mx, my] = corners[missing];
      const correct = `(${mx}, ${my})`;
      const altX = corners[given.find((l) => corners[l][1] === my && corners[l][0] !== mx)][0];
      const altY = corners[given.find((l) => corners[l][0] === mx && corners[l][1] !== my)][1];
      const rawDistractors = [
        `(${my}, ${mx})`,
        `(${altX}, ${my})`,
        `(${mx}, ${altY})`,
        `(${mx + 1}, ${my})`,
        `(${mx}, ${my + 1})`,
        `(${Math.max(mx - 1, 0)}, ${my})`,
      ];
      const distractors = spUniqueStrCandidates(correct, rawDistractors);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      const points = given.map((l) => ({ x: corners[l][0], y: corners[l][1], label: l }));
      const svg = spGridSVG(maxC, maxC, points);
      const givenText = given.map((l) => `${l}(${corners[l][0]}, ${corners[l][1]})`).join(", ");
      const allText = labels.map((l) => `${l}(${corners[l][0]}, ${corners[l][1]})`).join(", ");
      return {
        q: `Three corners of a rectangle are ${givenText}. What are the coordinates of the fourth corner, ${missing}?`,
        options,
        correctIndex,
        svg,
        hint: "In a rectangle drawn straight (sides along the grid lines), the fourth corner shares its x-coordinate with one neighbour and its y-coordinate with the other.",
        solution: {
          idea: "Opposite/adjacent corners of an axis-aligned rectangle share an x- or y-coordinate.",
          steps: [
            `The rectangle's corners are ${allText}.`,
            `Corner ${missing} must line up with its neighbours: x = ${mx}, y = ${my}.`,
            `So ${missing} = ${correct}.`,
          ],
        },
      };
    },
  },

  odd_one_out_property: {
    difficulties: [3, 4],
    build(d) {
      const quadPick = shuffle(SP_QUAD_NAMES).slice(0, 4);
      const oddChoices = SP_POLY_NAMES.filter((p) => p.n !== 4);
      const odd = pick(oddChoices);
      const items = shuffle([...quadPick, odd.name]);
      const correct = odd.name;
      const others = quadPick;
      const { options, correctIndex } = buildMCStr(correct, others);
      return {
        q: `Look at these shapes: ${items.join(", ")}. Which one has a different number of sides from the other four?`,
        options,
        correctIndex,
        hint: "Every quadrilateral (square, rectangle, rhombus, parallelogram, trapezium) has exactly 4 sides. Count the sides of the odd shape out.",
        solution: {
          idea: "All the quadrilaterals in the list have 4 sides; find the one shape that does not.",
          steps: [
            `${quadPick.join(", ")} are all quadrilaterals, so each has 4 sides.`,
            `${correct} has ${odd.n} sides, which is different from the rest.`,
          ],
        },
      };
    },
  },

};
// Structure registry for timeCalendar. Covers day-of-week arithmetic (forward/backward),
// simple clock durations, unit conversions (minutes/hours/days/weeks, plain and mixed
// h+m form), same-month date gaps, leap year identification, clock duration crossing an
// hour/day boundary, 12/24-hour conversion both directions, elapsed-time (reverse of
// duration), the Nth (or last) weekday of the month, date arithmetic crossing a month
// boundary using each month's real length, a bus-timetable structure, age-in-years-and-
// months (with borrowing), a century-leap-year anniversary structure, and a combined day-
// of-week + date multi-step structure.
const TC_MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function tcIsLeapYear(y) { return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0); }
function tcMonthLength(m, y) { if (m === 2) return tcIsLeapYear(y) ? 29 : 28; return MONTHS31.includes(m) ? 31 : 30; }
function tcPad(n) { return String(n).padStart(2, "0"); }
function tcFmt24(h, m) { return `${tcPad(((h % 24) + 24) % 24)}:${tcPad(m)}`; }
function tcOrdinal(n) { const s = ["th", "st", "nd", "rd"]; const v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
function tcTo12(h, m) { const ampm = h < 12 ? "am" : "pm"; let h12 = h % 12; if (h12 === 0) h12 = 12; return `${h12}:${tcPad(m)} ${ampm}`; }
function tcFormatDuration(mins) { const h = Math.floor(mins / 60); const r = mins % 60; return h > 0 ? (r > 0 ? `${h}h ${r}min` : `${h}h`) : `${r}min`; }
const TIME_CALENDAR_STRUCTURES = {

  dow_forward: {
    difficulties: [1, 2],
    build(d) {
      const startIdx = rand(0, 6);
      const n = d === 1 ? rand(1, 6) : rand(7, 60);
      const resultIdx = (startIdx + n) % 7;
      const correct = DAYS[resultIdx];
      const distractors = [1, 2, 3, 4, 5, 6].filter((off) => off !== 0).map((off) => DAYS[(resultIdx + off) % 7]);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `Today is ${DAYS[startIdx]}. What day of the week will it be in ${n} days' time?`,
        options,
        correctIndex,
        hint: `Since the days of the week repeat every 7 days, find the remainder when ${n} is divided by 7, then count on that many days from ${DAYS[startIdx]}.`,
        solution: {
          idea: "The 7-day week cycle repeats, so only the remainder after dividing by 7 matters.",
          steps: [
            `${n} ÷ 7 = ${Math.floor(n / 7)} remainder ${n % 7}`,
            `Counting ${n % 7} day(s) on from ${DAYS[startIdx]} lands on ${correct}.`,
          ],
          check: `Counting forward day by day from ${DAYS[startIdx]} for ${n} days also reaches ${correct}.`,
        },
      };
    },
  },

  dow_backward: {
    difficulties: [1, 2],
    build(d) {
      const startIdx = rand(0, 6);
      const n = d === 1 ? rand(1, 6) : rand(7, 60);
      const resultIdx = (((startIdx - n) % 7) + 7) % 7;
      const correct = DAYS[resultIdx];
      const distractors = [1, 2, 3, 4, 5, 6].map((off) => DAYS[(resultIdx + off) % 7]);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `Today is ${DAYS[startIdx]}. What day of the week was it ${n} days ago?`,
        options,
        correctIndex,
        hint: `Find the remainder when ${n} is divided by 7, then count back that many days from ${DAYS[startIdx]}.`,
        solution: {
          idea: "The 7-day week cycle repeats, so only the remainder after dividing by 7 matters when counting backwards.",
          steps: [
            `${n} ÷ 7 = ${Math.floor(n / 7)} remainder ${n % 7}`,
            `Counting back ${n % 7} day(s) from ${DAYS[startIdx]} lands on ${correct}.`,
          ],
          check: `Counting backward day by day from ${DAYS[startIdx]} for ${n} days also reaches ${correct}.`,
        },
      };
    },
  },

  duration_simple_minutes: {
    difficulties: [1, 2],
    build(d) {
      const h = rand(1, 11);
      const m1 = rand(0, d === 1 ? 29 : 40);
      const gap = d === 1 ? rand(5, 30) : rand(5, 55);
      const m2 = m1 + gap;
      if (m2 > 59) return null;
      const fmt = (x) => `${x} minutes`;
      const distractorVals = [gap + 5, gap - 5, gap + 10, gap - 3, m2, gap + 2].filter((x) => x !== gap);
      const { options, correctIndex } = buildMC(gap, distractorVals, fmt);
      return {
        q: `A cartoon starts at ${h}:${tcPad(m1)} and finishes at ${h}:${tcPad(m2)}. How many minutes long is the cartoon?`,
        options,
        correctIndex,
        hint: "Subtract the start time's minutes from the finish time's minutes, since both times are within the same hour.",
        solution: {
          idea: "Both times are in the same hour, so the length is just the difference in minutes.",
          steps: [`${tcPad(m2)} - ${tcPad(m1)} = ${gap} minutes`],
          check: `${m1} + ${gap} = ${m2}, which matches the finish time.`,
        },
      };
    },
  },

  unit_convert_time: {
    difficulties: [1, 2],
    build(d) {
      const type = pick(["min_to_hr", "hr_to_min", "day_to_wk", "wk_to_day", "hr_to_day", "day_to_hr"]);
      let q, correct, unit, distractors, stepLine;
      if (type === "min_to_hr") {
        const k = d === 1 ? rand(1, 4) : rand(5, 10);
        const minutes = k * 60;
        correct = k; unit = "hours";
        q = `How many hours is ${minutes} minutes?`;
        distractors = [k + 1, k - 1, k + 2, minutes, k + 3];
        stepLine = `${minutes} ÷ 60 = ${k}`;
      } else if (type === "hr_to_min") {
        const k = d === 1 ? rand(1, 5) : rand(6, 12);
        correct = k * 60; unit = "minutes";
        q = `How many minutes is ${k} hours?`;
        distractors = [correct + 60, correct - 60, correct + 30, k, correct - 30];
        stepLine = `${k} × 60 = ${correct}`;
      } else if (type === "day_to_wk") {
        const k = d === 1 ? rand(1, 3) : rand(4, 8);
        const days = k * 7;
        correct = k; unit = "weeks";
        q = `How many weeks is ${days} days?`;
        distractors = [k + 1, k - 1, k + 2, days, k + 3];
        stepLine = `${days} ÷ 7 = ${k}`;
      } else if (type === "wk_to_day") {
        const k = d === 1 ? rand(1, 4) : rand(5, 10);
        correct = k * 7; unit = "days";
        q = `How many days is ${k} weeks?`;
        distractors = [correct + 7, correct - 7, correct + 1, k, correct + 2];
        stepLine = `${k} × 7 = ${correct}`;
      } else if (type === "hr_to_day") {
        const k = d === 1 ? rand(1, 3) : rand(4, 6);
        const hours = k * 24;
        correct = k; unit = "days";
        q = `How many days is ${hours} hours?`;
        distractors = [k + 1, k - 1, k + 2, hours, k + 3];
        stepLine = `${hours} ÷ 24 = ${k}`;
      } else {
        const k = d === 1 ? rand(1, 3) : rand(4, 8);
        correct = k * 24; unit = "hours";
        q = `How many hours is ${k} days?`;
        distractors = [correct + 24, correct - 24, correct + 1, k, correct - 1];
        stepLine = `${k} × 24 = ${correct}`;
      }
      const fmt = (x) => `${x} ${unit}`;
      const { options, correctIndex } = buildMC(correct, distractors, fmt);
      return {
        q,
        options,
        correctIndex,
        hint: "Use the fact that there are 60 minutes in an hour, 24 hours in a day, and 7 days in a week to convert.",
        solution: {
          idea: "Multiply or divide by the standard conversion factor between the two units.",
          steps: [stepLine],
          check: "Converting the answer back using the opposite operation should give the original amount.",
        },
      };
    },
  },

  date_gap_same_month: {
    difficulties: [1, 2],
    build(d) {
      const month = pick(TC_MONTH_NAMES);
      const day1 = d === 1 ? rand(1, 15) : rand(1, 5);
      const gap = d === 1 ? rand(2, 10) : rand(10, 22);
      const day2 = day1 + gap;
      if (day2 > 28) return null;
      const fmt = (x) => `${x} days`;
      const distractorVals = [gap + 1, gap - 1, gap + 2, day2, gap + 3].filter((x) => x !== gap);
      const { options, correctIndex } = buildMC(gap, distractorVals, fmt);
      return {
        q: `In ${month}, one event is on the ${tcOrdinal(day1)} and another is on the ${tcOrdinal(day2)}. How many days apart are they?`,
        options,
        correctIndex,
        hint: "Since both dates are in the same month, subtract the earlier date from the later date.",
        solution: {
          idea: "Both dates fall in the same month, so the gap is a simple subtraction of the day numbers.",
          steps: [`${day2} - ${day1} = ${gap} days`],
          check: `${day1} + ${gap} = ${day2}, which matches the later date.`,
        },
      };
    },
  },

  leap_year_identify: {
    difficulties: [1, 2],
    build(d) {
      const askLeap = pick([true, false]);
      const leaps = d === 1 ? [1996, 2004, 2008, 2012, 2024] : [1996, 2000, 2004, 2024, 2400];
      const nonLeaps = d === 1 ? [1997, 1998, 1999, 2001, 2002] : [1800, 1900, 1999, 2100, 2200];
      const candidates = askLeap
        ? [pick(leaps), ...shuffle(nonLeaps).slice(0, 4)]
        : [pick(nonLeaps), ...shuffle(leaps).slice(0, 4)];
      const matches = candidates.filter((y) => tcIsLeapYear(y) === askLeap);
      const correct = String(matches[0]);
      const shuffled = shuffle(candidates);
      const distractors = shuffled.map(String).filter((s) => s !== correct);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `Which of these years ${askLeap ? "is" : "is NOT"} a leap year?`,
        options,
        correctIndex,
        hint: "A leap year is divisible by 4, but century years (ending in 00) must also be divisible by 400 to be a leap year.",
        solution: {
          idea: "Apply the leap year rule to each year: divisible by 4, and if it ends in 00, divisible by 400 as well.",
          steps: candidates.map((y) => `${y}: ${tcIsLeapYear(y) ? "leap year" : "not a leap year"}`),
          check: `Only ${correct} ${askLeap ? "satisfies" : "fails"} the condition asked about.`,
        },
      };
    },
  },

  clock_duration_cross_hour: {
    difficulties: [2, 3],
    build(d) {
      const startH = d === 2 ? rand(0, 21) : rand(20, 23);
      const startM = rand(1, 59);
      const durationMin = d === 2 ? rand(20, 90) : rand(90, 220);
      const totalStart = startH * 60 + startM;
      const totalEnd = totalStart + durationMin;
      const crossesMidnight = totalEnd >= 1440;
      if (d === 2 && crossesMidnight) return null;
      const endH = Math.floor(totalEnd / 60) % 24;
      const endM = totalEnd % 60;
      const correct = tcFmt24(endH, endM);
      const distractors = [
        tcFmt24((endH + 1) % 24, endM),
        tcFmt24((endH - 1 + 24) % 24, endM),
        tcFmt24(endH, (endM + 10) % 60),
        tcFmt24(startH, startM),
        tcFmt24((endH + 2) % 24, endM),
      ];
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `A film starts at ${tcFmt24(startH, startM)} and lasts ${durationMin} minutes. What time does it finish?`,
        options,
        correctIndex,
        hint: "Add the number of minutes onto the start time, carrying over into the next hour (or day) whenever the minutes reach 60.",
        solution: {
          idea: "Convert everything to minutes past midnight, add the duration, then convert back to hours and minutes.",
          steps: [
            `Start time = ${startH} × 60 + ${startM} = ${totalStart} minutes past midnight`,
            `${totalStart} + ${durationMin} = ${totalEnd} minutes past midnight`,
            `${totalEnd} ÷ 60 = ${Math.floor(totalEnd / 60)} hours remainder ${totalEnd % 60}, so the finish time is ${correct}${crossesMidnight ? " (the next day)" : ""}`,
          ],
          check: `${correct} minus ${durationMin} minutes brings us back to ${tcFmt24(startH, startM)}.`,
        },
      };
    },
  },

  clock_12_24_convert: {
    difficulties: [2, 3],
    build(d) {
      const direction = pick(["to12", "to24"]);
      let h24, m;
      if (d === 2) { h24 = rand(1, 23); if (h24 === 12) h24 = 13; m = rand(1, 59); } else { h24 = pick([0, 12, rand(1, 23)]); m = pick([0, rand(1, 59)]); }
      const correct12 = tcTo12(h24, m);
      const ampm = h24 < 12 ? "am" : "pm";
      let h12 = h24 % 12; if (h12 === 0) h12 = 12;
      if (direction === "to12") {
        const distractors = [
          tcTo12((h24 + 1) % 24, m),
          `${h12}:${tcPad(m)} ${ampm === "am" ? "pm" : "am"}`,
          tcTo12((h24 - 1 + 24) % 24, m),
          `${h12}:${tcPad((m + 10) % 60)} ${ampm}`,
          tcTo12((h24 + 2) % 24, m),
        ];
        const { options, correctIndex } = buildMCStr(correct12, distractors);
        return {
          q: `Write ${tcFmt24(h24, m)} (24-hour clock) as a 12-hour clock time.`,
          options,
          correctIndex,
          hint: "Subtract 12 from the hour if it is 13 or more, and use 'am' for times before noon and 'pm' from noon onwards.",
          solution: {
            idea: "Hours 00-11 are am and hours 12-23 are pm; subtract 12 to get the 12-hour hour, except that 00 becomes 12 and 12 stays 12.",
            steps: [
              `${tcFmt24(h24, m)} → hour ${h24} becomes ${h12} o'clock, and since it is ${ampm === "am" ? "before" : "from"} noon, this is ${ampm}`,
              `Answer: ${correct12}`,
            ],
            check: `Converting ${correct12} back to 24-hour clock gives ${tcFmt24(h24, m)}.`,
          },
        };
      }
      const correct24 = tcFmt24(h24, m);
      const distractors = [
        tcFmt24((h24 + 1) % 24, m),
        tcFmt24((h24 - 1 + 24) % 24, m),
        tcFmt24(h24 < 12 ? h24 + 12 : h24 - 12, m),
        tcFmt24(h24, (m + 10) % 60),
        tcFmt24((h24 + 2) % 24, m),
      ];
      const { options, correctIndex } = buildMCStr(correct24, distractors);
      return {
        q: `Write ${correct12} as a 24-hour clock time.`,
        options,
        correctIndex,
        hint: "For 'am' times, the 24-hour clock hour is usually the same (except 12 am, which is 00). For 'pm' times, add 12 to the hour (except 12 pm, which stays 12).",
        solution: {
          idea: "Add 12 to pm hours (unless it is already 12 pm), and change 12 am to 00.",
          steps: [
            `${correct12} → hour ${h12} with ${ampm} becomes hour ${h24}`,
            `Answer: ${correct24}`,
          ],
          check: `Converting ${correct24} back to 12-hour clock gives ${correct12}.`,
        },
      };
    },
  },

  elapsed_time_find_duration: {
    difficulties: [2, 3],
    build(d) {
      const startH = rand(0, 23);
      const startM = rand(0, 59);
      const crosses = d === 3 && pick([true, false]);
      const durationMin = d === 2 ? rand(15, 180) : rand(15, 300);
      const totalStart = startH * 60 + startM;
      const totalEnd = totalStart + durationMin;
      if (!crosses && totalEnd >= 1440) return null;
      if (crosses && totalEnd < 1440) return null;
      const endH = Math.floor(totalEnd / 60) % 24;
      const endM = totalEnd % 60;
      const correct = tcFormatDuration(durationMin);
      const durOffsets = [10, -10, 30, -30, 60].map((off) => durationMin + off).filter((x) => x > 0 && x !== durationMin);
      const distractors = durOffsets.map(tcFormatDuration);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `A journey starts at ${tcFmt24(startH, startM)} and ends at ${tcFmt24(endH, endM)}${crosses ? " the next day" : ""}. How long did the journey take?`,
        options,
        correctIndex,
        hint: "Convert both times to minutes past midnight, subtract (adding 1440 if the journey crosses midnight), then convert the answer back into hours and minutes.",
        solution: {
          idea: "Find the total minutes elapsed, then express it as hours and minutes.",
          steps: [
            `Start = ${totalStart} minutes past midnight, end = ${totalEnd % 1440} minutes past midnight${crosses ? " (next day)" : ""}`,
            `Elapsed = ${durationMin} minutes`,
            `${durationMin} ÷ 60 = ${Math.floor(durationMin / 60)} hours remainder ${durationMin % 60} minutes`,
          ],
          check: `${tcFmt24(startH, startM)} plus ${correct} gives ${tcFmt24(endH, endM)}.`,
        },
      };
    },
  },

  unit_convert_mixed: {
    difficulties: [2, 3],
    build(d) {
      const direction = pick(["to_hm", "to_min"]);
      const totalMin = d === 2 ? rand(65, 179) : rand(70, 600);
      if (totalMin % 60 === 0) return null;
      const hours = Math.floor(totalMin / 60);
      const mins = totalMin % 60;
      if (direction === "to_hm") {
        const correct = `${hours}h ${mins}min`;
        const offsets = [10, -10, 60, -60, 1].map((off) => totalMin + off).filter((x) => x > 0 && x !== totalMin);
        const distractors = offsets.map((x) => `${Math.floor(x / 60)}h ${x % 60}min`);
        const { options, correctIndex } = buildMCStr(correct, distractors);
        return {
          q: `Write ${totalMin} minutes as hours and minutes.`,
          options,
          correctIndex,
          hint: "Divide by 60 to find the number of whole hours, and the remainder is the leftover minutes.",
          solution: {
            idea: "Divide the total minutes by 60; the whole number of times 60 goes in is the hours, and what's left over is the minutes.",
            steps: [`${totalMin} ÷ 60 = ${hours} remainder ${mins}`, `So ${totalMin} minutes = ${hours} hour(s) and ${mins} minute(s)`],
            check: `${hours} × 60 + ${mins} = ${totalMin}`,
          },
        };
      }
      const correct = `${totalMin} minutes`;
      const offsets = [10, -10, 60, -60, 1].map((off) => totalMin + off).filter((x) => x > 0 && x !== totalMin);
      const distractors = offsets.map((x) => `${x} minutes`);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `Write ${hours} hours and ${mins} minutes as a total number of minutes.`,
        options,
        correctIndex,
        hint: "Multiply the number of hours by 60, then add the extra minutes.",
        solution: {
          idea: "Convert the hours to minutes first, then add on the remaining minutes.",
          steps: [`${hours} × 60 = ${hours * 60}`, `${hours * 60} + ${mins} = ${totalMin}`],
          check: `${totalMin} ÷ 60 = ${hours} remainder ${mins}, matching the original.`,
        },
      };
    },
  },

  nth_weekday_of_month: {
    difficulties: [3, 4],
    build(d) {
      const firstDayIdx = rand(0, 6);
      const targetDayIdx = rand(0, 6);
      const useLast = d === 4 && pick([true, false]);
      const offset = (targetDayIdx - firstDayIdx + 7) % 7;
      const firstOccurrence = 1 + offset;
      if (!useLast) {
        const n = d === 3 ? rand(1, 4) : rand(1, 5);
        const date = firstOccurrence + (n - 1) * 7;
        if (date > 28) return null;
        const correct = tcOrdinal(date);
        const dayOffsets = [3, 7, 11, 15, 19, 23];
        const distractors = dayOffsets.map((off) => tcOrdinal(((date - 1 + off) % 28) + 1));
        const { options, correctIndex } = buildMCStr(correct, distractors);
        return {
          q: `The 1st of the month is a ${DAYS[firstDayIdx]}. What date is the ${tcOrdinal(n)} ${DAYS[targetDayIdx]} of the month?`,
          options,
          correctIndex,
          hint: `Work out the date of the first ${DAYS[targetDayIdx]}, then add 7 days for each further ${DAYS[targetDayIdx]}.`,
          solution: {
            idea: `Find how many days after the 1st the first ${DAYS[targetDayIdx]} falls, then count on in weeks of 7 days.`,
            steps: [
              `The 1st is a ${DAYS[firstDayIdx]}, so the first ${DAYS[targetDayIdx]} is on the ${tcOrdinal(firstOccurrence)}`,
              `The ${tcOrdinal(n)} ${DAYS[targetDayIdx]} is ${n - 1} week(s) after that: ${firstOccurrence} + ${(n - 1) * 7} = ${date}`,
            ],
            check: `Counting in 7s from the ${tcOrdinal(firstOccurrence)}, ${n} times, reaches the ${correct}.`,
          },
        };
      }
      const month = rand(1, 12);
      const year = rand(2000, 2060);
      const mLen = tcMonthLength(month, year);
      let lastOcc = firstOccurrence;
      while (lastOcc + 7 <= mLen) lastOcc += 7;
      const correct = tcOrdinal(lastOcc);
      const dayOffsets = [3, 7, 11, 15, 19, 23];
      const distractors = dayOffsets.map((off) => tcOrdinal(((lastOcc - 1 + off) % 28) + 1));
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `${TC_MONTH_NAMES[month - 1]} ${year} has ${mLen} days, and the 1st is a ${DAYS[firstDayIdx]}. What date is the last ${DAYS[targetDayIdx]} of the month?`,
        options,
        correctIndex,
        hint: `Find the first ${DAYS[targetDayIdx]}, then keep adding 7 until adding 7 more would go past the end of the month.`,
        solution: {
          idea: `Find the first ${DAYS[targetDayIdx]} in the month, then add weeks of 7 days until the next one would fall after the last day of the month (${mLen}).`,
          steps: [
            `The first ${DAYS[targetDayIdx]} is on the ${tcOrdinal(firstOccurrence)}`,
            `Adding 7 repeatedly: the last ${DAYS[targetDayIdx]} within ${mLen} days is the ${correct}`,
          ],
          check: `${lastOcc} + 7 = ${lastOcc + 7}, which is more than ${mLen}, so ${correct} is indeed the last one.`,
        },
      };
    },
  },

  date_cross_month_boundary: {
    difficulties: [3, 4],
    build(d) {
      const month = rand(1, 12);
      const year = rand(2000, 2060);
      const mLen = tcMonthLength(month, year);
      const direction = pick(["forward", "backward"]);
      const n = d === 3 ? rand(5, 20) : rand(15, 50);
      if (direction === "forward") {
        const startDay = rand(Math.max(1, mLen - 15), mLen);
        let totalDay = startDay + n;
        let m = month, y = year, len = mLen;
        while (totalDay > len) { totalDay -= len; m += 1; if (m > 12) { m = 1; y += 1; } len = tcMonthLength(m, y); }
        if (m === month) return null;
        const correct = `${tcOrdinal(totalDay)} ${TC_MONTH_NAMES[m - 1]}`;
        const dayOffsets = [3, 7, 11];
        const distractors = [
          ...dayOffsets.map((off) => `${tcOrdinal(((totalDay - 1 + off) % 28) + 1)} ${TC_MONTH_NAMES[m - 1]}`),
          `${tcOrdinal(startDay)} ${TC_MONTH_NAMES[month - 1]}`,
          `${tcOrdinal(totalDay)} ${TC_MONTH_NAMES[month - 1]}`,
        ];
        const { options, correctIndex } = buildMCStr(correct, distractors);
        return {
          q: `It is the ${tcOrdinal(startDay)} of ${TC_MONTH_NAMES[month - 1]} ${year}. What date is it ${n} days later?`,
          options,
          correctIndex,
          hint: `${TC_MONTH_NAMES[month - 1]} has ${mLen} days, so work out how many days are left in ${TC_MONTH_NAMES[month - 1]} first, then continue counting into the next month.`,
          solution: {
            idea: `${TC_MONTH_NAMES[month - 1]} ${year} has ${mLen} days. Count how many days remain in the starting month, then carry the rest into the following month(s).`,
            steps: [
              `Days remaining in ${TC_MONTH_NAMES[month - 1]} after the ${tcOrdinal(startDay)}: ${mLen} - ${startDay} = ${mLen - startDay}`,
              `${n} - ${mLen - startDay} = ${n - (mLen - startDay)} day(s) spill into the next month`,
              `Landing on the ${correct}`,
            ],
            check: `Counting ${n} days forward from the ${tcOrdinal(startDay)} of ${TC_MONTH_NAMES[month - 1]} reaches the ${correct}.`,
          },
        };
      }
      const startDay = rand(1, Math.min(15, mLen));
      let totalDay = startDay - n;
      let m = month, y = year;
      while (totalDay < 1) { m -= 1; if (m < 1) { m = 12; y -= 1; } const len = tcMonthLength(m, y); totalDay += len; }
      if (m === month) return null;
      const correct = `${tcOrdinal(totalDay)} ${TC_MONTH_NAMES[m - 1]}`;
      const dayOffsets = [3, 7, 11];
      const distractors = [
        ...dayOffsets.map((off) => `${tcOrdinal(((totalDay - 1 + off) % 28) + 1)} ${TC_MONTH_NAMES[m - 1]}`),
        `${tcOrdinal(startDay)} ${TC_MONTH_NAMES[month - 1]}`,
        `${tcOrdinal(totalDay)} ${TC_MONTH_NAMES[month - 1]}`,
      ];
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `It is the ${tcOrdinal(startDay)} of ${TC_MONTH_NAMES[month - 1]} ${year}. What date was it ${n} days before?`,
        options,
        correctIndex,
        hint: `Work out how many days you need to go back past the 1st of ${TC_MONTH_NAMES[month - 1]}, then count backwards into the previous month using its actual length.`,
        solution: {
          idea: "Count back past the start of the month into the previous month, using its actual length.",
          steps: [
            `${n} - ${startDay - 1} = ${n - (startDay - 1)} day(s) need to be counted back before the 1st of ${TC_MONTH_NAMES[month - 1]}`,
            `Landing on the ${correct}`,
          ],
          check: `Counting ${n} days forward from the ${correct} reaches the ${tcOrdinal(startDay)} of ${TC_MONTH_NAMES[month - 1]}.`,
        },
      };
    },
  },

  timetable_schedule: {
    difficulties: [3, 4],
    build(d) {
      const startH = rand(6, 20);
      const startM = pick([0, 5, 10, 15, 20, 30, 40, 45]);
      const interval = pick([10, 12, 15, 20, 25, 30]);
      const k = d === 3 ? rand(2, 6) : rand(7, 15);
      const totalStart = startH * 60 + startM;
      const totalKth = totalStart + (k - 1) * interval;
      const kthH = Math.floor(totalKth / 60) % 24;
      const kthM = totalKth % 60;
      const crossesDay = totalKth >= 1440;
      if (d === 3 && crossesDay) return null;
      const correct = tcFmt24(kthH, kthM);
      const offsets = [interval, -interval, 2 * interval, -2 * interval, 5].map((off) => totalKth + off).filter((x) => x >= 0 && x !== totalKth);
      const distractors = offsets.map((x) => tcFmt24(Math.floor(x / 60) % 24, ((x % 60) + 60) % 60));
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `Buses leave a stop every ${interval} minutes, starting with the first bus at ${tcFmt24(startH, startM)}. What time does the ${tcOrdinal(k)} bus leave?`,
        options,
        correctIndex,
        hint: `The 1st bus is the start time itself, so the ${tcOrdinal(k)} bus leaves after ${k - 1} extra gaps of ${interval} minutes.`,
        solution: {
          idea: "The nth bus leaves (n - 1) intervals after the first bus.",
          steps: [
            `${k} - 1 = ${k - 1} interval(s) after the first bus`,
            `${k - 1} × ${interval} = ${(k - 1) * interval} minutes`,
            `${tcFmt24(startH, startM)} plus ${(k - 1) * interval} minutes = ${correct}${crossesDay ? " (the next day)" : ""}`,
          ],
          check: `Counting ${k - 1} gap(s) of ${interval} minutes from ${tcFmt24(startH, startM)} reaches ${correct}.`,
        },
      };
    },
  },

  age_date_diff_years_months: {
    difficulties: [3, 4],
    build(d) {
      const birthMonth = rand(1, 12);
      const birthYear = rand(1990, 2015);
      const forceBorrow = d === 4 && pick([true, false]);
      let todayMonth;
      if (forceBorrow) {
        todayMonth = rand(1, 12);
        if (todayMonth >= birthMonth) return null;
      } else {
        todayMonth = rand(birthMonth, 12);
      }
      const todayYear = birthYear + rand(5, 20);
      let years = todayYear - birthYear;
      let months = todayMonth - birthMonth;
      if (months < 0) { years -= 1; months += 12; }
      const correct = `${years} years ${months} months`;
      const distractors = [
        `${years} years ${months === 0 ? 11 : months - 1} months`,
        `${years} years ${(months + 1) % 12} months`,
        `${years - 1} years ${months} months`,
        `${years + 1} years ${months} months`,
        `${todayYear - birthYear} years ${Math.abs(todayMonth - birthMonth)} months`,
      ];
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `Amara was born in ${TC_MONTH_NAMES[birthMonth - 1]} ${birthYear}. How old was she (in years and months) in ${TC_MONTH_NAMES[todayMonth - 1]} ${todayYear}?`,
        options,
        correctIndex,
        hint: "Subtract the birth year from the current year, and subtract the birth month from the current month; if the month subtraction is negative, borrow a year.",
        solution: {
          idea: "Find the difference in years and months separately, borrowing a year if the birth month hasn't been reached yet in the current year.",
          steps: [
            `${todayYear} - ${birthYear} = ${todayYear - birthYear} years (before adjusting)`,
            todayMonth >= birthMonth
              ? `${TC_MONTH_NAMES[todayMonth - 1]} is the same as or later than ${TC_MONTH_NAMES[birthMonth - 1]}: ${todayMonth} - ${birthMonth} = ${todayMonth - birthMonth} months, no borrowing needed`
              : `${TC_MONTH_NAMES[birthMonth - 1]} is later in the year than ${TC_MONTH_NAMES[todayMonth - 1]}, so borrow one year and add 12 months: ${todayMonth} + 12 - ${birthMonth} = ${months}`,
            `Answer: ${correct}`,
          ],
          check: `${years} years and ${months} months after ${TC_MONTH_NAMES[birthMonth - 1]} ${birthYear} is ${TC_MONTH_NAMES[todayMonth - 1]} ${todayYear}.`,
        },
      };
    },
  },

  anniversary_leap_year: {
    difficulties: [4],
    build(d) {
      const birthYear = pick([1988, 1992, 1996, 2000, 2004, 2008, 2012, 1896, 1900, 2096, 2100]);
      if (!tcIsLeapYear(birthYear)) return null;
      let nextLeap = birthYear + 1;
      while (!tcIsLeapYear(nextLeap)) nextLeap++;
      const correct = String(nextLeap);
      const candidateVals = [birthYear + 4, birthYear + 8, birthYear + 1, birthYear + 2, birthYear + 5].filter((y) => y !== nextLeap);
      const distractors = candidateVals.map(String);
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `A baby was born on 29 February ${birthYear}, a leap year. In which year will they next be able to celebrate their birthday on the actual date, 29 February?`,
        options,
        correctIndex,
        hint: "Leap years usually occur every 4 years, but century years are only leap years if they divide exactly by 400.",
        solution: {
          idea: "Leap years occur every 4 years, except that a century year (ending in 00) is only a leap year if it is divisible by 400.",
          steps: [
            `${birthYear} + 4 = ${birthYear + 4}: ${tcIsLeapYear(birthYear + 4) ? "this is a leap year" : "this is NOT a leap year, since it is a century year not divisible by 400"}`,
            `The next actual leap year after ${birthYear} is ${nextLeap}`,
          ],
          check: `${nextLeap} is divisible by 4${nextLeap % 100 === 0 ? ", and also by 400" : ""}, so it is a leap year.`,
        },
      };
    },
  },

  multistep_dow_date: {
    difficulties: [3, 4],
    build(d) {
      const month = rand(1, 12);
      const year = rand(2000, 2060);
      const mLen = tcMonthLength(month, year);
      const startDay = rand(1, Math.min(20, mLen));
      const startDayIdx = rand(0, 6);
      const n = d === 3 ? rand(5, 25) : rand(10, 45);
      let totalDay = startDay + n;
      let m = month, y = year, len = mLen;
      while (totalDay > len) { totalDay -= len; m += 1; if (m > 12) { m = 1; y += 1; } len = tcMonthLength(m, y); }
      const crossesMonth = m !== month;
      if (d === 3 && crossesMonth) return null;
      const resultDayIdx = (startDayIdx + n) % 7;
      const correct = `${DAYS[resultDayIdx]} ${tcOrdinal(totalDay)} ${TC_MONTH_NAMES[m - 1]}`;
      const dateVariants = [3, 7, 11].map((off) => `${DAYS[resultDayIdx]} ${tcOrdinal(((totalDay - 1 + off) % 28) + 1)} ${TC_MONTH_NAMES[m - 1]}`);
      const dowVariants = [
        `${DAYS[(resultDayIdx + 1) % 7]} ${tcOrdinal(totalDay)} ${TC_MONTH_NAMES[m - 1]}`,
        `${DAYS[(resultDayIdx + 6) % 7]} ${tcOrdinal(totalDay)} ${TC_MONTH_NAMES[m - 1]}`,
      ];
      // Only offer the "wrong month, same day/date" decoy when a different month is actually
      // available (at d3 the month never crosses, so m === month and this would equal `correct`).
      const monthVariant = m !== month
        ? `${DAYS[resultDayIdx]} ${tcOrdinal(totalDay)} ${TC_MONTH_NAMES[month - 1]}`
        : `${DAYS[resultDayIdx]} ${tcOrdinal(((totalDay - 1 + 17) % 28) + 1)} ${TC_MONTH_NAMES[m - 1]}`;
      const distractors = [...dateVariants, ...dowVariants, monthVariant];
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `The ${tcOrdinal(startDay)} of ${TC_MONTH_NAMES[month - 1]} ${year} is a ${DAYS[startDayIdx]}. What day of the week, and what date, is it ${n} days later?`,
        options,
        correctIndex,
        hint: "Work out the date by counting the days forward (carrying into the next month if needed), and work out the day of the week separately using the remainder after dividing by 7.",
        solution: {
          idea: "This needs two calculations: the new date (counting on, and crossing into the next month if needed) and the new day of the week (using the 7-day cycle).",
          steps: [
            `Date: ${TC_MONTH_NAMES[month - 1]} has ${mLen} days${crossesMonth ? `, so counting ${n} days from the ${tcOrdinal(startDay)} crosses into ${TC_MONTH_NAMES[m - 1]}, landing on the ${tcOrdinal(totalDay)}` : `, so counting ${n} days from the ${tcOrdinal(startDay)} lands on the ${tcOrdinal(totalDay)} (still within ${TC_MONTH_NAMES[month - 1]})`}`,
            `Day of week: ${n} ÷ 7 = ${Math.floor(n / 7)} remainder ${n % 7}, so counting ${n % 7} on from ${DAYS[startDayIdx]} gives ${DAYS[resultDayIdx]}`,
            `Answer: ${correct}`,
          ],
          check: `Both the date and the day of the week were found independently, and combine to give ${correct}.`,
        },
      };
    },
  },

};
// Structure registry for angleBasics. Covers angle classification by type, comparison to a
// right angle, angle facts (straight line=180°, point=360°, triangle=180°, quadrilateral=
// 360°), compass-turn reasoning, ordering angles by size, comparing angles regardless of
// drawn line length, clock-hands and protractor-scale reasoning, algebraic straight-
// line/point-angle equations, a multi-step triangle+straight-line chain, isosceles base/
// apex angle facts (both directions), and an always/sometimes/never reasoning structure.
// All SVG diagrams are illustrative only — every value needed to answer is stated in the
// question text, so the diagrams never need to be pixel-accurate to the actual degrees.
function abClassifyAngle(deg) {
  if (deg === 90) return "right";
  if (deg === 180) return "straight";
  if (deg < 90) return "acute";
  if (deg < 180) return "obtuse";
  return "reflex";
}
function abNumericOptions(correct, candidates, fmt = (x) => String(x)) {
  const correctStr = fmt(correct);
  const seen = new Set([correctStr]);
  const out = [];
  for (const c of candidates) {
    if (c === undefined || c === null || !isFinite(c)) continue;
    if (correct >= 0 && c < 0) continue;
    const s = fmt(c);
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(c);
    if (out.length >= 4) break;
  }
  if (out.length < 4) return null;
  return buildMC(correct, out, fmt);
}
function abAngleIllustration(deg) {
  const type = abClassifyAngle(deg);
  const cx = 110, cy = 150, r = 80;
  const visDeg = type === "acute" ? 50 : type === "right" ? 90 : type === "obtuse" ? 130 : type === "straight" ? 180 : 130;
  const rad = (visDeg * Math.PI) / 180;
  const p2x = cx + r * Math.cos(rad);
  const p2y = cy - r * Math.sin(rad);
  let extra = "";
  if (type === "right") extra = `${SL(cx + 18, cy, cx + 18, cy - 18)}${SL(cx + 18, cy - 18, cx, cy - 18)}`;
  if (type === "reflex") extra = ST(cx, cy + 35, "(reflex angle)", "middle", 11, "#c0392b");
  return `${SL(cx, cy, cx + r, cy)}${SL(cx, cy, p2x, p2y)}${SC(cx, cy, 3)}${extra}${ST(cx + 20, cy - 15, deg + "°", "middle", 13)}`;
}
function abStraightLineSVG(a, b) {
  return `${SL(20, 110, 260, 110)}${SL(140, 110, 140, 30)}${SC(140, 110, 3)}${ST(85, 95, a + "°", "middle", 14)}${ST(200, 95, b + "°", "middle", 14)}`;
}
function abPointSVG(angles) {
  const cx = 120, cy = 110;
  const n = angles.length;
  const rays = angles.map((_, i) => {
    const ang = (360 / n) * i;
    const rad = (ang * Math.PI) / 180;
    const x = cx + 80 * Math.cos(rad), y = cy - 80 * Math.sin(rad);
    return SL(cx, cy, x, y);
  }).join("");
  const labels = angles.map((v, i) => {
    const ang = (360 / n) * i + (360 / n) / 2;
    const rad = (ang * Math.PI) / 180;
    const x = cx + 45 * Math.cos(rad), y = cy - 45 * Math.sin(rad);
    return ST(x, y, v + "°", "middle", 12);
  }).join("");
  return rays + labels + SC(cx, cy, 3);
}
function abTriangleSVG(a, b, c) {
  return `${SL(30, 170, 270, 170)}${SL(30, 170, 140, 30)}${SL(270, 170, 140, 30)}${ST(60, 160, a + "°", "middle", 13)}${ST(240, 160, b + "°", "middle", 13)}${ST(140, 55, c + "°", "middle", 13)}`;
}
function abCrossingSVG(a, b) {
  return `${SL(20, 110, 260, 110)}${SL(140, 20, 140, 200)}${ST(180, 90, a + "°", "middle", 12)}${ST(95, 90, b + "°", "middle", 12)}${ST(180, 140, a + "°", "middle", 12)}${ST(95, 140, b + "°", "middle", 12)}${SC(140, 110, 3)}`;
}
function abCompareRaysSVG(degA, degB) {
  return `<g>${SL(40, 150, 40, 90)}${SL(40, 150, 100, 150)}${ST(60, 175, "A: " + degA + "°", "middle", 12)}</g><g>${SL(180, 150, 180, 50)}${SL(180, 150, 280, 150)}${ST(220, 175, "B: " + degB + "°", "middle", 12)}</g>`;
}
function abQuadSVG(a, b, c, d) {
  return `${SL(40, 170, 220, 170)}${SL(220, 170, 260, 60)}${SL(260, 60, 90, 30)}${SL(90, 30, 40, 170)}${ST(60, 160, a + "°", "middle", 12)}${ST(210, 160, b + "°", "middle", 12)}${ST(245, 75, c + "°", "middle", 12)}${ST(100, 45, d + "°", "middle", 12)}`;
}
function abTriangleWithExteriorSVG(a, b, c, e) {
  return `${SL(30, 170, 180, 170)}${SL(180, 170, 260, 170)}${SL(30, 170, 130, 40)}${SL(180, 170, 130, 40)}${ST(55, 160, a + "°", "middle", 12)}${ST(150, 160, b + "°", "middle", 11)}${ST(215, 160, e + "°", "middle", 12)}${ST(130, 55, c + "°", "middle", 11)}`;
}
function abIsoscelesSVG(baseL, baseR, apex) {
  return `${SL(40, 170, 220, 170)}${SL(40, 170, 130, 40)}${SL(220, 170, 130, 40)}${ST(60, 160, baseL + "°", "middle", 12)}${ST(200, 160, baseR + "°", "middle", 12)}${ST(130, 55, apex + "°", "middle", 12)}`;
}
const abCoefWord = (c) => (c === 1 ? "x" : `${c}x`);
const ANGLE_BASICS_STRUCTURES = {

  classify_angle_diagram: {
    difficulties: [1, 2],
    build(d) {
      const pool = d <= 1
        ? [30, 45, 60, 90, 120, 135, 150]
        : [30, 45, 60, 90, 120, 135, 150, 180, 200, 225, 250, 300, 330];
      const deg = pick(pool);
      const type = abClassifyAngle(deg);
      const allTypes = ["acute", "right", "obtuse", "straight", "reflex"];
      const distractors = allTypes.filter((t) => t !== type);
      const { options, correctIndex } = buildMCStr(type, distractors);
      const explain = {
        right: "exactly 90°, a right angle.",
        straight: "exactly 180°, a straight angle.",
        acute: "less than 90°, so it is acute.",
        obtuse: "between 90° and 180°, so it is obtuse.",
        reflex: "more than 180°, so it is reflex.",
      };
      return {
        q: `An angle measures ${deg}°. What type of angle is this?`,
        svg: svgBox(abAngleIllustration(deg), 220, 200),
        options,
        correctIndex,
        hint: "Acute is less than 90°, right is exactly 90°, obtuse is between 90° and 180°, straight is exactly 180°, and reflex is more than 180°.",
        solution: {
          idea: "Compare the angle to the key benchmarks: 90° (a right angle) and 180° (a straight line).",
          steps: [`${deg}° is ${explain[type]}`],
        },
      };
    },
  },

  right_angle_compare: {
    difficulties: [1],
    build(d) {
      const x = pick([40, 55, 65, 90, 100, 110, 150, 70, 120]);
      const fixedOptions = [
        "smaller than a right angle",
        "exactly a right angle",
        "bigger than a right angle",
        "exactly a straight angle",
        "impossible to tell without measuring",
      ];
      const correctStr = x < 90 ? fixedOptions[0] : x === 90 ? fixedOptions[1] : fixedOptions[2];
      const distractors = fixedOptions.filter((s) => s !== correctStr);
      const { options, correctIndex } = buildMCStr(correctStr, distractors);
      return {
        q: `An angle measures ${x}°. Compared with a right angle (90°), this angle is:`,
        svg: svgBox(abAngleIllustration(x), 220, 200),
        options,
        correctIndex,
        hint: "A right angle is exactly 90°. Check whether the given angle is less than, equal to, or more than 90°.",
        solution: {
          idea: "Compare the angle to the 90° benchmark.",
          steps: [`${x}° ${x < 90 ? "<" : x === 90 ? "=" : ">"} 90°, so it is ${correctStr}.`],
        },
      };
    },
  },

  missing_angle_straight_line: {
    difficulties: [1, 2],
    build(d) {
      const a = d <= 1
        ? pick([20, 30, 40, 50, 60, 70, 80, 100, 110, 120, 130, 140, 150, 160])
        : pick([15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175]);
      if (a === 90) return null;
      const b = 180 - a;
      const mc = abNumericOptions(b, [a, b + 20, b - 20, b + 40, b - 40, 200 - a, Math.abs(90 - a)], (v) => v + "°");
      if (!mc) return null;
      return {
        q: `Two angles lie on a straight line. One angle is ${a}°. What is the size of the other angle?`,
        svg: svgBox(abStraightLineSVG(a, b), 260, 150),
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "Angles on a straight line always add up to 180°.",
        solution: {
          idea: "Angles on a straight line sum to 180°.",
          steps: [`180° − ${a}° = ${b}°`],
          check: `${a}° + ${b}° = 180°`,
        },
      };
    },
  },

  missing_angle_point: {
    difficulties: [1, 2],
    build(d) {
      if (d <= 1) {
        const bank = [60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
        const a = pick(bank);
        const bChoices = bank.filter((x) => x !== a && x + a < 340);
        if (!bChoices.length) return null;
        const b = pick(bChoices);
        const c = 360 - a - b;
        if (c <= 10 || c >= 340) return null;
        const mc = abNumericOptions(c, [a, b, 360 - a, 360 - b, a + b, Math.abs(a - b)], (v) => v + "°");
        if (!mc) return null;
        return {
          q: `Three angles meet at a point. Two of them are ${a}° and ${b}°. What is the third angle?`,
          svg: svgBox(abPointSVG([a, b, c]), 240, 220),
          options: mc.options,
          correctIndex: mc.correctIndex,
          hint: "Angles around a point always add up to 360°.",
          solution: {
            idea: "Angles around a point sum to 360°.",
            steps: [`360° − ${a}° − ${b}° = ${c}°`],
            check: `${a}+${b}+${c}=360`,
          },
        };
      }
      const bank = [50, 60, 70, 80, 90];
      const a = pick(bank), b = pick(bank), c = pick(bank);
      const e = 360 - a - b - c;
      if (e <= 10 || e >= 340) return null;
      const mc = abNumericOptions(e, [a, b, c, 360 - a - b, 360 - b - c, a + b - c], (v) => v + "°");
      if (!mc) return null;
      return {
        q: `Four angles meet at a point: ${a}°, ${b}°, ${c}° and one more. What is the size of the missing angle?`,
        svg: svgBox(abPointSVG([a, b, c, e]), 240, 220),
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "All the angles around a point add up to 360°.",
        solution: {
          idea: "Angles around a point sum to 360°.",
          steps: [`360° − ${a}° − ${b}° − ${c}° = ${e}°`],
          check: `${a}+${b}+${c}+${e}=360`,
        },
      };
    },
  },

  right_angle_context_clock: {
    difficulties: [1],
    build(d) {
      const angleOf = { "1:00": 30, "2:00": 60, "3:00": 90, "4:00": 120, "5:00": 150, "6:00": 180, "7:00": 150, "8:00": 120, "9:00": 90, "10:00": 60, "11:00": 30, "12:00": 0 };
      const rightTimes = ["3:00", "9:00"];
      const correctTime = pick(rightTimes);
      const others = Object.keys(angleOf).filter((t) => angleOf[t] !== 90);
      const shuffledOthers = shuffle(others);
      const distractorTimes = [];
      const usedAngles = new Set();
      for (const t of shuffledOthers) {
        if (!usedAngles.has(angleOf[t])) {
          distractorTimes.push(t);
          usedAngles.add(angleOf[t]);
        }
        if (distractorTimes.length >= 4) break;
      }
      if (distractorTimes.length < 4) return null;
      const mc = buildMCStr(correctTime, distractorTimes);
      const gapHours = 3;
      return {
        q: "The hour hand and minute hand of a clock make an angle between them. At which of these o'clock times do the hands form a right angle (90°)?",
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "At 3 o'clock and 9 o'clock exactly, the hands point straight up and straight across from each other, making a right angle.",
        solution: {
          idea: "At n o'clock exactly, the angle between the hands is 30° for each hour gap between them (the smaller way round).",
          steps: [`At ${correctTime}, the hands are ${gapHours} hours apart on the clock face.`, `${gapHours} × 30° = 90°, a right angle.`],
        },
      };
    },
  },

  turn_direction_compass: {
    difficulties: [1],
    build(d) {
      const dirs = ["north", "east", "south", "west"];
      const startIdx = rand(0, 3);
      const turnDeg = pick([90, 180, 270, 360]);
      const dir = pick(["clockwise", "anticlockwise"]);
      const steps90 = turnDeg / 90;
      const delta = dir === "clockwise" ? steps90 : -steps90;
      const endIdx = ((startIdx + delta) % 4 + 4) % 4;
      const startDir = dirs[startIdx], endDir = dirs[endIdx];
      const distractors = dirs.filter((dd) => dd !== endDir);
      distractors.push("cannot be determined");
      const mc = buildMCStr(endDir, distractors);
      return {
        q: `A robot starts facing ${startDir}. It turns ${turnDeg}° ${dir}. Which direction is it now facing?`,
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "A quarter turn is 90°, a half turn is 180°, a three-quarter turn is 270° and a full turn is 360° (back to the start).",
        solution: {
          idea: "Work out how many quarter turns are being made and count around the compass points.",
          steps: [`${turnDeg}° ÷ 90° = ${steps90} quarter turn(s) ${dir}.`, `Starting at ${startDir} and turning ${dir} ends up facing ${endDir}.`],
        },
      };
    },
  },

  order_angles_by_size: {
    difficulties: [1, 2],
    build(d) {
      const n = d <= 1 ? 3 : 4;
      const bank = d <= 1
        ? [20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170]
        : [20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 225, 250, 280, 300, 330];
      const vals = [];
      let guard = 0;
      while (vals.length < n && guard < 200) {
        const v = pick(bank);
        if (!vals.includes(v)) vals.push(v);
        guard++;
      }
      if (vals.length < n) return null;
      const letters = ["A", "B", "C", "D"].slice(0, n);
      const askMax = Math.random() < 0.5;
      const target = askMax ? Math.max(...vals) : Math.min(...vals);
      const correctLetter = letters[vals.indexOf(target)];
      const otherLetters = letters.filter((l) => l !== correctLetter);
      const extra = ["they are all the same size", "it cannot be told without measuring"];
      const distractors = otherLetters.concat(extra).slice(0, 4);
      if (distractors.length < 4) return null;
      const mc = buildMCStr(correctLetter, distractors);
      const labelList = letters.map((l, i) => `${l} = ${vals[i]}°`).join(", ");
      const nWord = n === 3 ? "Three" : "Four";
      return {
        q: `${nWord} angles are labelled: ${labelList}. Which angle is the ${askMax ? "largest" : "smallest"}?`,
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "Compare the degree values directly: a bigger number of degrees always means a bigger angle, no matter how the angle happens to be drawn.",
        solution: {
          idea: "Compare all the angle sizes given in degrees.",
          steps: [`The angles are ${labelList}.`, `The ${askMax ? "largest" : "smallest"} value is ${target}°, which is angle ${correctLetter}.`],
        },
      };
    },
  },

  turn_fraction_compare: {
    difficulties: [2],
    build(d) {
      const fracPool = [
        { frac: "a quarter turn", deg: 90 },
        { frac: "a half turn", deg: 180 },
        { frac: "a three-quarter turn", deg: 270 },
        { frac: "a third of a turn", deg: 120 },
        { frac: "a sixth of a turn", deg: 60 },
        { frac: "two-thirds of a turn", deg: 240 },
      ];
      const f = pick(fracPool);
      const otherPool = [60, 90, 120, 150, 180, 210, 240, 270, 300].filter((x) => x !== f.deg);
      const other = pick(otherPool);
      const biggerIsFrac = f.deg > other;
      const correct = biggerIsFrac ? `${f.frac} (${f.deg}°)` : `${other}°`;
      const wrong1 = biggerIsFrac ? `${other}°` : `${f.frac} (${f.deg}°)`;
      const distractors = [wrong1, "they are exactly the same size", "it cannot be compared", `${f.deg + other}°`];
      const mc = buildMCStr(correct, distractors);
      return {
        q: `Which is bigger: ${f.frac} or a turn of ${other}°?`,
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "Change the fraction of a turn into degrees (a full turn is 360°), then compare the two numbers of degrees.",
        solution: {
          idea: "Convert the fraction of a turn to degrees, then compare.",
          steps: [`${f.frac} = ${f.deg}°`, `Compare ${f.deg}° with ${other}°.`, `${correct} is bigger.`],
        },
      };
    },
  },

  triangle_missing_angle: {
    difficulties: [2, 3, 4],
    build(d) {
      let aBank, bBank;
      if (d <= 2) { aBank = [40, 50, 60, 70, 80, 90, 100]; bBank = [30, 40, 50, 60, 70, 80]; }
      else if (d === 3) { aBank = [35, 55, 65, 75, 85, 95, 105]; bBank = [25, 45, 65, 85]; }
      else { aBank = [37, 53, 68, 82, 94, 111]; bBank = [29, 41, 58, 73]; }
      const a = pick(aBank);
      const bChoices = bBank.filter((x) => x + a < 170);
      if (!bChoices.length) return null;
      const b = pick(bChoices);
      const c = 180 - a - b;
      if (c <= 5) return null;
      const mc = abNumericOptions(c, [a, b, 180 - a, 180 - b, a + b, Math.abs(a - b)], (v) => v + "°");
      if (!mc) return null;
      return {
        q: `A triangle has angles of ${a}° and ${b}°. What is the size of the third angle?`,
        svg: svgBox(abTriangleSVG(a, b, c), 260, 200),
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "The three angles inside any triangle always add up to 180°.",
        solution: {
          idea: "Angles in a triangle sum to 180°.",
          steps: [`180° − ${a}° − ${b}° = ${c}°`],
          check: `${a}+${b}+${c}=180`,
        },
      };
    },
  },

  vertically_opposite_crossing: {
    difficulties: [2, 3],
    build(d) {
      const bank = [30, 40, 50, 60, 70, 80, 100, 110, 120, 130, 140, 150];
      const a = pick(bank);
      const askOpposite = Math.random() < 0.5;
      const correct = askOpposite ? a : 180 - a;
      const mc = abNumericOptions(correct, [a, 180 - a, 90 - Math.min(a, 180 - a), a + 10, a - 10], (v) => v + "°");
      if (!mc) return null;
      return {
        q: `Two straight lines cross. One of the angles formed is ${a}°. What is the size of the angle ${askOpposite ? "directly opposite it (vertically opposite)" : "next to it, on the same straight line (adjacent)"}?`,
        svg: svgBox(abCrossingSVG(a, 180 - a), 260, 200),
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: askOpposite ? "Vertically opposite angles (across the crossing point from each other) are always equal." : "Angles next to each other on a straight line add up to 180°.",
        solution: {
          idea: askOpposite ? "Vertically opposite angles are always equal." : "Angles on a straight line sum to 180°.",
          steps: askOpposite ? [`The angle vertically opposite ${a}° is also ${a}°.`] : [`180° − ${a}° = ${180 - a}°`],
        },
      };
    },
  },

  angle_comparison_line_length: {
    difficulties: [2, 3],
    build(d) {
      const bank = [30, 40, 50, 60, 70, 80, 100, 110, 120];
      const degA = pick(bank);
      const bChoices = bank.filter((x) => x !== degA);
      const degB = pick(bChoices);
      const correct = degA > degB ? "Angle A" : "Angle B";
      const other = correct === "Angle A" ? "Angle B" : "Angle A";
      const distractors = [other, "they are the same size", "it depends on the length of the lines drawn", "it cannot be determined"];
      const mc = buildMCStr(correct, distractors);
      return {
        q: `Angle A measures ${degA}° and angle B measures ${degB}°. In the diagram, angle A is drawn with short lines and angle B is drawn with long lines. Which angle is actually bigger?`,
        svg: svgBox(abCompareRaysSVG(degA, degB), 320, 200),
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "The size of an angle depends only on the amount of turn between the two lines, not on how long the lines are drawn.",
        solution: {
          idea: "The length of the lines forming an angle does not change the size of the angle: only the amount of turn matters.",
          steps: [`Angle A = ${degA}°, angle B = ${degB}°.`, `${correct} has the bigger number of degrees, so ${correct} is the bigger angle, however it is drawn.`],
        },
      };
    },
  },

  protractor_scale_reading: {
    difficulties: [2, 3],
    build(d) {
      const inner = pick([20, 30, 40, 50, 55, 65, 70, 80]);
      const outer = 180 - inner;
      const isAcuteShown = Math.random() < 0.5;
      const correct = isAcuteShown ? inner : outer;
      const qDesc = isAcuteShown ? "clearly acute (smaller than a right angle)" : "clearly obtuse (bigger than a right angle but smaller than a straight line)";
      const mc = abNumericOptions(correct, [inner, outer, 90, Math.abs(inner - outer), inner + 10], (v) => v + "°");
      if (!mc) return null;
      return {
        q: `A pupil measures an angle with a protractor. The pointer lines up with ${inner}° on the inner scale and ${outer}° on the outer scale. Looking at the angle, it is ${qDesc}. Which reading should the pupil use?`,
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "A protractor has two scales running opposite ways. Always check which scale matches what the angle looks like: acute angles are less than 90°, obtuse angles are more than 90°.",
        solution: {
          idea: "Use the appearance of the angle to choose the correct scale on the protractor.",
          steps: [`The two scales give ${inner}° and ${outer}° (they add up to 180°).`, `Since the angle looks ${isAcuteShown ? "acute" : "obtuse"}, the correct reading is ${correct}°.`],
        },
      };
    },
  },

  quadrilateral_missing_angle: {
    difficulties: [3, 4],
    build(d) {
      const bank = [60, 70, 80, 90, 100];
      const a = pick(bank), b = pick(bank), c = pick(bank);
      const e = 360 - a - b - c;
      if (e <= 10 || e >= 170) return null;
      const mc = abNumericOptions(e, [a, b, c, 360 - a - b, 180 - c, a + b - c], (v) => v + "°");
      if (!mc) return null;
      return {
        q: `A quadrilateral (four-sided shape) has three angles of ${a}°, ${b}° and ${c}°. What is the size of the fourth angle?`,
        svg: svgBox(abQuadSVG(a, b, c, e), 260, 200),
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "A quadrilateral can be split into two triangles, so its angles always add up to 2 × 180° = 360°.",
        solution: {
          idea: "The angles in any quadrilateral add up to 360° (because it can be split into two triangles).",
          steps: [`360° − ${a}° − ${b}° − ${c}° = ${e}°`],
          check: `${a}+${b}+${c}+${e}=360`,
        },
      };
    },
  },

  algebraic_straight_line: {
    difficulties: [3, 4],
    build(d) {
      const coeffPool = [[3, 2], [4, 1], [2, 1], [5, 4], [3, 1], [7, 2]];
      const [p, q] = pick(coeffPool);
      const sumCoef = p + q;
      if (180 % sumCoef !== 0) return null;
      const x = 180 / sumCoef;
      if (x <= 0) return null;
      const angle1 = p * x, angle2 = q * x;
      const askX = Math.random() < 0.5;
      let correctVal, qText, askFirst = null;
      if (askX) {
        correctVal = x;
        qText = `On a straight line, two angles measure ${abCoefWord(p)}° and ${abCoefWord(q)}°. Find the value of x.`;
      } else {
        askFirst = Math.random() < 0.5;
        correctVal = askFirst ? angle1 : angle2;
        const target = askFirst ? p : q;
        qText = `On a straight line, two angles measure ${abCoefWord(p)}° and ${abCoefWord(q)}°. Find the size of the ${abCoefWord(target)}° angle.`;
      }
      const fmt = askX ? (v) => String(v) : (v) => v + "°";
      const mc = abNumericOptions(correctVal, [x, angle1, angle2, x + p, x - q], fmt);
      if (!mc) return null;
      const steps = [`${p}x + ${q}x = 180`, `${sumCoef}x = 180`, `x = ${x}`];
      if (!askX) {
        const target = askFirst ? p : q;
        steps.push(`${abCoefWord(target)}° = ${target} × ${x} = ${correctVal}°`);
      }
      return {
        q: qText,
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "Angles on a straight line add up to 180°. Add the coefficients of x, set that equal to 180, and solve for x.",
        solution: {
          idea: "Set up an equation using the straight-line fact (angles sum to 180°) and solve for x.",
          steps,
        },
      };
    },
  },

  angle_chain_multistep: {
    difficulties: [3, 4],
    build(d) {
      const aBank = [40, 50, 60, 70];
      const bBank = [30, 40, 50, 60];
      const a = pick(aBank);
      const bChoices = bBank.filter((x) => x + a < 170);
      if (!bChoices.length) return null;
      const b = pick(bChoices);
      const c = 180 - a - b;
      const e = 180 - c;
      const mc = abNumericOptions(e, [c, a, b, a + b, c + 10], (v) => v + "°");
      if (!mc) return null;
      return {
        q: `In a triangle, two of the angles are ${a}° and ${b}°. The third angle of the triangle sits on a straight line next to an angle marked e. What is the size of e?`,
        svg: svgBox(abTriangleWithExteriorSVG(a, b, c, e), 280, 220),
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "First use the triangle fact (angles sum to 180°) to find the third angle inside the triangle. Then use the straight-line fact (180°) to find e.",
        solution: {
          idea: "Work in two steps: find the missing triangle angle, then use the straight-line fact.",
          steps: [`Third angle in the triangle = 180° − ${a}° − ${b}° = ${c}°`, `e and ${c}° lie on a straight line, so e = 180° − ${c}° = ${e}°`],
          check: `${c}+${e}=180`,
        },
      };
    },
  },

  isosceles_triangle_base_angles: {
    difficulties: [3, 4],
    build(d) {
      const askApex = Math.random() < 0.5;
      if (askApex) {
        const base = pick([40, 50, 55, 65, 70, 75]);
        const apex = 180 - 2 * base;
        if (apex <= 0) return null;
        const mc = abNumericOptions(apex, [base, 2 * base, 180 - base, base * 2 - 10], (v) => v + "°");
        if (!mc) return null;
        return {
          q: `An isosceles triangle has two equal base angles of ${base}° each. What is the size of the apex angle (the angle between the two equal sides)?`,
          svg: svgBox(abIsoscelesSVG(base, base, apex), 260, 200),
          options: mc.options,
          correctIndex: mc.correctIndex,
          hint: "In an isosceles triangle, the two base angles are equal. All three angles still add up to 180°.",
          solution: {
            idea: "Use the equal base angles, then the angle sum of a triangle.",
            steps: [`${base}° + ${base}° = ${2 * base}°`, `180° − ${2 * base}° = ${apex}°`],
          },
        };
      }
      let apex = pick([20, 30, 40, 50, 60, 80, 100]);
      if ((180 - apex) % 2 !== 0) apex += 1;
      const base = (180 - apex) / 2;
      if (base <= 0) return null;
      const mc = abNumericOptions(base, [apex, 180 - apex, base + 10, base - 10], (v) => v + "°");
      if (!mc) return null;
      return {
        q: `An isosceles triangle has an apex angle of ${apex}°. The two base angles are equal. What is the size of each base angle?`,
        svg: svgBox(abIsoscelesSVG(base, base, apex), 260, 200),
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "The two base angles of an isosceles triangle are equal. Subtract the apex angle from 180° and share the rest equally between them.",
        solution: {
          idea: "Subtract the apex angle from 180°, then divide by 2 to share equally between the two equal base angles.",
          steps: [`180° − ${apex}° = ${180 - apex}°`, `${180 - apex}° ÷ 2 = ${base}°`],
        },
      };
    },
  },

  always_sometimes_never_reasoning: {
    difficulties: [3, 4],
    build(d) {
      const scenarios = [
        {
          correct: "Vertically opposite angles are always equal.",
          wrongs: [
            "Angles that are next to each other on a straight line are always equal.",
            "All obtuse angles are exactly 135°.",
            "An angle and its vertically opposite angle always add up to 180°.",
            "Angles around a point always add up to 180°.",
          ],
        },
        {
          correct: "The angles in a triangle always add up to 180°, whatever shape the triangle is.",
          wrongs: [
            "A triangle can never have an obtuse angle.",
            "The angles in a triangle add up to 360°.",
            "An isosceles triangle always has a right angle.",
            "The angles in a triangle add up to 90°.",
          ],
        },
        {
          correct: "Angles around a point always add up to 360°, however many angles there are.",
          wrongs: [
            "Angles around a point always add up to 180°.",
            "There can only ever be two angles around a point.",
            "Angles around a point add up to 90°.",
            "The total of the angles around a point changes depending on how many lines are drawn.",
          ],
        },
        {
          correct: "The angles in a quadrilateral always add up to 360°.",
          wrongs: [
            "The angles in a quadrilateral always add up to 180°.",
            "A quadrilateral always has at least one right angle.",
            "The angles in a quadrilateral add up to 720°.",
            "A square and a rectangle have different angle totals.",
          ],
        },
        {
          correct: "A reflex angle is always bigger than 180°.",
          wrongs: [
            "A reflex angle is always exactly 270°.",
            "A reflex angle is always smaller than a right angle.",
            "An obtuse angle is always bigger than a reflex angle.",
            "A straight angle is bigger than a reflex angle.",
          ],
        },
      ];
      const s = pick(scenarios);
      const mc = buildMCStr(s.correct, s.wrongs);
      return {
        q: "Which of these statements about angles is always true?",
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "Test each statement: could you draw an example that breaks it? If not, it must always be true.",
        solution: {
          idea: "Check each statement against the angle facts you know, looking for any case where it might fail.",
          steps: [`"${s.correct}" holds in every case, so it is the statement that is always true.`, "The others can each be broken by a counter-example or simply state the wrong number of degrees."],
        },
      };
    },
  },

  angle_around_point_algebraic: {
    difficulties: [3, 4],
    build(d) {
      const coeffPool = [[1, 2], [1, 3], [2, 3], [1, 4]];
      const [p, q] = pick(coeffPool);
      const fixedAngle = pick([60, 90, 120, 150]);
      const sumCoef = p + q;
      const remaining = 360 - fixedAngle;
      if (remaining % sumCoef !== 0) return null;
      const x = remaining / sumCoef;
      if (x <= 0) return null;
      const angle1 = p * x, angle2 = q * x;
      const askX = Math.random() < 0.5;
      let correctVal, qText, askFirst = null;
      if (askX) {
        correctVal = x;
        qText = `At a point, three angles meet: ${abCoefWord(p)}°, ${abCoefWord(q)}° and ${fixedAngle}°. Find the value of x.`;
      } else {
        askFirst = Math.random() < 0.5;
        correctVal = askFirst ? angle1 : angle2;
        const target = askFirst ? p : q;
        qText = `At a point, three angles meet: ${abCoefWord(p)}°, ${abCoefWord(q)}° and ${fixedAngle}°. Find the size of the ${abCoefWord(target)}° angle.`;
      }
      const fmt = askX ? (v) => String(v) : (v) => v + "°";
      const mc = abNumericOptions(correctVal, [x, angle1, angle2, fixedAngle, x + p], fmt);
      if (!mc) return null;
      const steps = [`${p}x + ${q}x + ${fixedAngle} = 360`, `${sumCoef}x = ${360 - fixedAngle}`, `x = ${x}`];
      if (!askX) {
        const target = askFirst ? p : q;
        steps.push(`${abCoefWord(target)}° = ${target} × ${x} = ${correctVal}°`);
      }
      return {
        q: qText,
        options: mc.options,
        correctIndex: mc.correctIndex,
        hint: "Angles around a point add up to 360°. Subtract the known angle, then share the rest according to the x-parts.",
        solution: {
          idea: "Use the angle-around-a-point fact to form an equation, then solve for x.",
          steps,
        },
      };
    },
  },

};
// Structure registry for sequencePattern. Covers repeating-cycle position lookups (forward,
// backward-from-end, and reverse "which position"), arithmetic sequences (increasing and
// decreasing next-term, missing-term, nth-term formula evaluation and derivation, threshold
// counting, membership testing), a growing-shape pattern, two independent repeating
// attributes combined, a two-stage "every Nth item is special" count, triangular/square
// numbers, a Fibonacci-style missing term, comparing the growth of two sequences, and an
// alternating two-operation sequence. Deliberately over-built at d3/d4 since this topic was
// flagged thin in the original variety audit.
function seqOrdinalSuffix(n) {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}
function seqFormatBTerm(b) { return b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`; }
function seqFormatLinear(coef, b) { return `${coef}n ${seqFormatBTerm(b)}`; }
const SEQ_SYMS = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "⚪", "⚫"];
const SEQ_SYM_NAME = {
  "🔴": "red", "🔵": "blue", "🟢": "green", "🟡": "yellow",
  "🟣": "purple", "🟠": "orange", "⚪": "white", "⚫": "black",
};
const SEQUENCE_PATTERN_STRUCTURES = {

  cycle_position_forward: {
    difficulties: [1, 2],
    build(d) {
      const cycleLen = d === 1 ? rand(3, 4) : rand(4, 5);
      const cycle = shuffle(SEQ_SYMS).slice(0, cycleLen);
      const N = d === 1 ? rand(9, 30) : rand(28, 70);
      const rem = N % cycleLen;
      const pos = rem === 0 ? cycleLen : rem;
      const correctSym = cycle[pos - 1];
      const distractPool = cycle.filter((s) => s !== correctSym);
      const opts4 = shuffle(distractPool).slice(0, Math.min(4, distractPool.length));
      while (opts4.length < 4) {
        const extra = pick(SEQ_SYMS.filter((s) => !cycle.includes(s)));
        if (!opts4.includes(extra)) opts4.push(extra);
      }
      const { options, correctIndex } = buildMCStr(correctSym, opts4);
      const cycleStr = cycle.join("");
      return {
        q: `A string of lights repeats this pattern of colours forever: ${cycleStr} ${cycleStr} ${cycleStr} ... Which colour is in position ${N}?`,
        options,
        correctIndex,
        hint: `Divide the position by the length of the repeating block (${cycleLen}) and look at the remainder: that tells you where you land inside one copy of the block.`,
        solution: {
          scenario: `The block ${cycleStr} (length ${cycleLen}) repeats over and over.`,
          idea: "Position inside a repeating cycle depends only on the remainder after dividing by the cycle length.",
          steps: [
            `${N} ÷ ${cycleLen} = ${Math.floor(N / cycleLen)} remainder ${rem}.`,
            `A remainder of 0 means the last item in the block, so position ${N} matches position ${pos} in ${cycleStr}.`,
            `Position ${pos} in ${cycleStr} is ${correctSym}.`,
          ],
          check: `Counting ${cycleLen} at a time, position ${N} lands on the same spot as position ${pos}, which is ${correctSym}.`,
        },
      };
    },
  },

  arithmetic_next_term: {
    difficulties: [1, 2],
    build(d) {
      const step = d === 1 ? rand(2, 6) : rand(3, 9);
      const start = d === 1 ? rand(1, 10) : rand(5, 25);
      const terms = [0, 1, 2, 3].map((i) => start + i * step);
      const answer = start + 4 * step;
      const distractors = [
        start + 3 * step,
        start + 5 * step,
        answer + step,
        answer - step,
        answer + 1,
        answer - 1,
      ].filter((v) => v !== answer);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `Look at this sequence: ${terms.join(", ")}, ? What is the next number?`,
        options,
        correctIndex,
        hint: "Find the constant amount added each time (the common difference), then add it once more to the last term.",
        solution: {
          idea: "In an arithmetic sequence the same amount is added each time.",
          steps: [
            `The difference between each term is ${step} (check: ${terms[1]} - ${terms[0]} = ${step}, ${terms[2]} - ${terms[1]} = ${step}).`,
            `Add ${step} to the last given term: ${terms[3]} + ${step} = ${answer}.`,
          ],
          check: `${terms.join(", ")}, ${answer} - each step increases by ${step}.`,
        },
      };
    },
  },

  skip_count_nth_term_formula: {
    difficulties: [1, 2],
    build(d) {
      const step = d === 1 ? rand(2, 5) : rand(3, 8);
      const start = d === 1 ? rand(1, 6) : rand(2, 12);
      const k = d === 1 ? rand(6, 9) : rand(8, 14);
      const answer = start + (k - 1) * step;
      const distractors = [
        start + k * step,
        start + (k - 2) * step,
        answer + step,
        answer - step,
        answer + 1,
      ].filter((v) => v !== answer && v >= 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `A counter starts at ${start} and jumps forward ${step} each time (${start}, ${start + step}, ${start + 2 * step}, ...). What number will it land on for the ${k}${seqOrdinalSuffix(k)} term of the sequence?`,
        options,
        correctIndex,
        hint: "You don't need to write out every term: the nth term of this sequence is start + (n - 1) × step.",
        solution: {
          idea: "Skip-counting sequences can be worked out directly without listing every term.",
          steps: [
            `Term number ${k} means the step has been added ${k - 1} times.`,
            `${start} + (${k} - 1) × ${step} = ${start} + ${k - 1} × ${step} = ${start} + ${(k - 1) * step} = ${answer}.`,
          ],
          check: `Counting up in ${step}s from ${start}, the ${k}${seqOrdinalSuffix(k)} number is ${answer}.`,
        },
      };
    },
  },

  missing_term_in_sequence: {
    difficulties: [1, 2],
    build(d) {
      const step = d === 1 ? rand(2, 6) : rand(3, 9);
      const start = d === 1 ? rand(1, 10) : rand(4, 20);
      const terms = [0, 1, 2, 3, 4, 5].map((i) => start + i * step);
      const missingIdx = rand(1, 4);
      const answer = terms[missingIdx];
      const shown = terms.map((t, i) => (i === missingIdx ? "?" : t));
      const distractors = [
        answer - step,
        answer + step,
        answer - 1,
        answer + 1,
        terms[missingIdx - 1],
        terms[missingIdx + 1],
      ].filter((v) => v !== answer && v >= 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `Find the missing number in this sequence: ${shown.join(", ")}`,
        options,
        correctIndex,
        hint: "Work out the constant difference from the numbers you can see, then use it to fill the gap.",
        solution: {
          idea: "A sequence with a constant difference lets you work backwards or forwards to any missing term.",
          steps: [
            `The gap between the terms you can see is ${step}.`,
            `The missing term is at position ${missingIdx + 1}, so it equals ${start} + ${missingIdx} × ${step} = ${answer}.`,
          ],
          check: `Filling in ${answer} gives ${terms.join(", ")}, which increases by ${step} each time.`,
        },
      };
    },
  },

  identify_rule_from_terms: {
    difficulties: [1, 2],
    build(d) {
      const ruleTypes = d === 1
        ? [{ type: "add", vals: [2, 3, 4, 5] }, { type: "sub", vals: [2, 3, 4] }]
        : [{ type: "add", vals: [3, 4, 5, 6, 7] }, { type: "sub", vals: [3, 4, 5] }, { type: "mul", vals: [2, 3] }];
      const chosen = pick(ruleTypes);
      const val = pick(chosen.vals);
      let start;
      if (chosen.type === "mul") start = rand(1, 4);
      else if (chosen.type === "sub") start = rand(30, 60);
      else start = rand(1, 15);
      const terms = [start];
      for (let i = 0; i < 3; i++) {
        const prev = terms[terms.length - 1];
        terms.push(chosen.type === "add" ? prev + val : chosen.type === "sub" ? prev - val : prev * val);
      }
      const describe = (type, v) => (type === "add" ? `add ${v} each time` : type === "sub" ? `subtract ${v} each time` : `multiply by ${v} each time`);
      const correctDesc = describe(chosen.type, val);
      const distractorPool = [];
      for (const rt of [{ type: "add", vals: [2, 3, 4, 5, 6, 7] }, { type: "sub", vals: [2, 3, 4, 5, 6] }, { type: "mul", vals: [2, 3, 4] }]) {
        for (const v of rt.vals) {
          const desc = describe(rt.type, v);
          if (desc !== correctDesc) distractorPool.push(desc);
        }
      }
      const { options, correctIndex } = buildMCStr(correctDesc, shuffle([...new Set(distractorPool)]).slice(0, 4));
      return {
        q: `Look at this sequence: ${terms.join(", ")}, ... What is the rule?`,
        options,
        correctIndex,
        hint: "Compare each term to the one before it: is the same amount being added, subtracted, or is it being multiplied?",
        solution: {
          idea: "The rule of a sequence describes how to get from one term to the next.",
          steps: terms.slice(1).map((t, i) => `${terms[i]} → ${t}`),
          check: `Every step follows the rule: ${correctDesc}.`,
        },
      };
    },
  },

  decreasing_arithmetic_next_term: {
    difficulties: [1, 2],
    build(d) {
      const step = d === 1 ? rand(2, 5) : rand(3, 8);
      const start = d === 1 ? rand(30, 50) : rand(50, 90);
      const terms = [0, 1, 2, 3].map((i) => start - i * step);
      const answer = start - 4 * step;
      if (answer < 0) return null;
      const distractors = [
        start - 3 * step,
        start - 5 * step,
        answer + step,
        answer - step,
        answer + 1,
      ].filter((v) => v !== answer && v >= 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `Look at this sequence: ${terms.join(", ")}, ? What is the next number?`,
        options,
        correctIndex,
        hint: "This sequence is going down: find the constant amount being subtracted each time, then subtract it once more.",
        solution: {
          idea: "A decreasing arithmetic sequence subtracts the same amount each time.",
          steps: [
            `The difference between each term is ${step} (going down).`,
            `Subtract ${step} from the last given term: ${terms[3]} - ${step} = ${answer}.`,
          ],
          check: `${terms.join(", ")}, ${answer} - each step decreases by ${step}.`,
        },
      };
    },
  },

  shape_growth_pattern: {
    difficulties: [1, 2],
    build(d) {
      const per = d === 1 ? rand(2, 4) : rand(3, 6);
      const first = d === 1 ? rand(3, 6) : rand(4, 10);
      const stageCounts = [0, 1, 2].map((i) => first + i * per);
      const answer = first + 3 * per;
      const distractors = [
        stageCounts[2] + per - 1,
        stageCounts[2] + per + 1,
        first + 4 * per,
        stageCounts[2] + 1,
        stageCounts[2] - 1,
      ].filter((v) => v !== answer && v >= 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `A stack of tins is built in stages. Each new stage adds ${per} more tins than the stage before. Stage 1 has ${stageCounts[0]} tins, stage 2 has ${stageCounts[1]} tins, stage 3 has ${stageCounts[2]} tins. How many tins will stage 4 have?`,
        options,
        correctIndex,
        hint: "Find how many extra tins are added at each stage, then apply that once more to get to the next stage.",
        solution: {
          idea: "A growing pattern that always adds the same amount is an arithmetic sequence.",
          steps: [
            `Each stage adds ${per} tins (check: ${stageCounts[1]} - ${stageCounts[0]} = ${per}).`,
            `Stage 4 = stage 3 + ${per} = ${stageCounts[2]} + ${per} = ${answer}.`,
          ],
          check: `Stages so far: ${stageCounts.join(", ")}, ${answer}.`,
        },
      };
    },
  },

  two_attribute_combo: {
    difficulties: [2, 3],
    build(d) {
      const bodyLen = rand(2, 3);
      const roofLen = rand(2, 3);
      const bodyColours = shuffle(["red", "blue", "green", "yellow"]).slice(0, bodyLen);
      const roofColours = shuffle(["white", "black", "silver", "orange"]).slice(0, roofLen);
      const N = d === 2 ? rand(12, 24) : rand(24, 40);
      const targetBody = pick(bodyColours);
      const targetRoof = pick(roofColours);
      let count = 0;
      for (let pos = 1; pos <= N; pos++) {
        const b = bodyColours[(pos - 1) % bodyLen];
        const r = roofColours[(pos - 1) % roofLen];
        if (b === targetBody && r === targetRoof) count++;
      }
      const answer = count;
      const distractors = [
        count - 1,
        count + 1,
        count - 2,
        count + 2,
        Math.floor(N / (bodyLen * roofLen)),
      ].filter((v) => v !== answer && v >= 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      const bodyPosText = bodyColours.map((c, i) => (c === targetBody ? i + 1 : null)).filter((x) => x).join(", ");
      const roofPosText = roofColours.map((c, i) => (c === targetRoof ? i + 1 : null)).filter((x) => x).join(", ");
      return {
        q: `A toy train has ${N} coaches in a line. The body colours repeat in this order: ${bodyColours.join(", ")} (then repeats). The roof colours repeat separately in this order: ${roofColours.join(", ")} (then repeats). How many of the ${N} coaches have a ${targetBody} body AND a ${targetRoof} roof?`,
        options,
        correctIndex,
        hint: "Work out the positions where each colour cycle lands on your target colour, then find the positions that match both.",
        solution: {
          idea: "Two independent repeating patterns line up together only at certain positions.",
          steps: [
            `The body colour repeats every ${bodyLen} coaches; ${targetBody} appears at position ${bodyPosText} within each block of ${bodyLen}.`,
            `The roof colour repeats every ${roofLen} coaches; ${targetRoof} appears at position ${roofPosText} within each block of ${roofLen}.`,
            `Checking all ${N} coaches one by one, both colours match at ${count} coaches.`,
          ],
          check: `Counted directly: ${count} coaches out of ${N} have both a ${targetBody} body and a ${targetRoof} roof.`,
        },
      };
    },
  },

  count_backward_from_end: {
    difficulties: [2, 3],
    build(d) {
      const cycleLen = rand(3, 5);
      const cycle = shuffle(SEQ_SYMS).slice(0, cycleLen);
      const N = d === 2 ? rand(20, 40) : rand(35, 70);
      const k = rand(2, Math.min(10, N - 1));
      const posFromStart = N - k + 1;
      const rem = posFromStart % cycleLen;
      const idx0 = (rem === 0 ? cycleLen : rem) - 1;
      const answer = cycle[idx0];
      const distractPool = cycle.filter((s) => s !== answer);
      const opts4 = shuffle(distractPool).slice(0, Math.min(4, distractPool.length));
      while (opts4.length < 4) {
        const extra = pick(SEQ_SYMS.filter((s) => !cycle.includes(s)));
        if (!opts4.includes(extra)) opts4.push(extra);
      }
      const { options, correctIndex } = buildMCStr(answer, opts4);
      const cycleStr = cycle.join("");
      return {
        q: `A ribbon has ${N} beads threaded on it, repeating the pattern ${cycleStr} from one end. What is the ${k}${seqOrdinalSuffix(k)} bead counting from the OTHER end?`,
        options,
        correctIndex,
        hint: "Turn \"counting from the end\" into \"counting from the start\" first: the kth bead from the end is bead number (total minus k plus 1) from the start.",
        solution: {
          idea: "Counting backwards from the end of a finite pattern can be converted into counting forwards from the start.",
          steps: [
            `The ${k}${seqOrdinalSuffix(k)} bead from the end is bead number ${N} - ${k} + 1 = ${posFromStart} counting from the start.`,
            `Position ${posFromStart} in the repeating block of ${cycleLen} lands on position ${idx0 + 1} of ${cycleStr}.`,
          ],
          check: `Position ${idx0 + 1} of ${cycleStr} is ${answer}.`,
        },
      };
    },
  },

  reverse_position_lookup: {
    difficulties: [2, 3],
    build(d) {
      const cycleLen = rand(3, 5);
      const cycle = shuffle(SEQ_SYMS).slice(0, cycleLen);
      const P = d === 2 ? rand(5, 20) : rand(15, 40);
      const targetIdx = rand(0, cycleLen - 1);
      const target = cycle[targetIdx];
      let pos = P + 1;
      while ((pos - 1) % cycleLen !== targetIdx) pos++;
      const answer = pos;
      const distractors = [
        answer - cycleLen,
        answer + cycleLen,
        answer - 1,
        answer + 1,
      ].filter((v) => v !== answer && v > P);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      const cycleStr = cycle.join("");
      const name = SEQ_SYM_NAME[target] || target;
      return {
        q: `Flags are hung in a line, repeating the pattern ${cycleStr} forever. After flag number ${P}, what is the position of the NEXT ${name} flag?`,
        options,
        correctIndex,
        hint: "Work out which position inside one copy of the pattern matches the flag you want, then count forward to the next position after your starting point that matches.",
        solution: {
          idea: "To find the next occurrence of a symbol in a repeating cycle, look for the next position with the correct remainder.",
          steps: [
            `${name} sits at position ${targetIdx + 1} in each block of ${cycleLen}.`,
            `Counting forward from position ${P}, the next position matching that spot in the pattern is ${answer}.`,
          ],
          check: `Position ${answer}: (${answer} - 1) mod ${cycleLen} = ${(answer - 1) % cycleLen}, which matches ${name}'s spot.`,
        },
      };
    },
  },

  nth_term_formula_evaluation: {
    difficulties: [2, 3],
    build(d) {
      const a = d === 2 ? rand(2, 6) : rand(3, 9);
      const bMag = d === 2 ? rand(1, 8) : rand(1, 10);
      const bSign = d === 2 ? 1 : pick([1, -1]);
      const b = bSign * bMag;
      const k = d === 2 ? rand(5, 12) : rand(8, 20);
      const answer = a * k + b;
      if (answer < 0) return null;
      const bStr = seqFormatBTerm(b);
      const distractors = [
        a * (k - 1) + b,
        a * k,
        a * (k + 1) + b,
        a * k + b + a,
        a * k - b,
      ].filter((v) => v !== answer);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `The nth term of a sequence is ${a}n ${bStr}. What is the value of the ${k}th term?`,
        options,
        correctIndex,
        hint: `Substitute n = ${k} into the formula and work it out carefully, following the order of operations.`,
        solution: {
          idea: "An nth-term formula lets you jump straight to any term without listing the sequence.",
          steps: [
            `Substitute n = ${k}: ${a} × ${k} ${bStr} = ${a * k} ${bStr}.`,
            `${a * k} ${bStr} = ${answer}.`,
          ],
          check: `Term ${k} = ${answer}.`,
        },
      };
    },
  },

  count_terms_in_range_threshold: {
    difficulties: [2, 3],
    build(d) {
      const step = d === 2 ? rand(2, 5) : rand(3, 7);
      const start = d === 2 ? rand(1, 8) : rand(2, 12);
      const N = d === 2 ? rand(8, 14) : rand(12, 20);
      const terms = Array.from({ length: N }, (_, i) => start + i * step);
      const eligible = terms.filter((t, i) => i > 0 && i < N - 1);
      const threshold = pick(eligible);
      const answer = terms.filter((t) => t > threshold).length;
      const distractors = [
        answer - 1,
        answer + 1,
        answer - 2,
        answer + 2,
        N - answer,
      ].filter((v) => v !== answer && v >= 0 && v <= N);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `A sequence starts at ${start} and increases by ${step} each time. Looking at the first ${N} terms, how many of them are greater than ${threshold}?`,
        options,
        correctIndex,
        hint: "Work out which term number first goes above the threshold, then count how many terms come after that (inclusive).",
        solution: {
          idea: "Once you know the position where the sequence crosses a threshold, every later term also satisfies it.",
          steps: [
            `The first ${N} terms are: ${terms.join(", ")}.`,
            `Terms greater than ${threshold}: ${terms.filter((t) => t > threshold).join(", ")}.`,
          ],
          check: `That is ${answer} terms.`,
        },
      };
    },
  },

  derive_nth_term_rule: {
    difficulties: [3, 4],
    build(d) {
      const step = d === 3 ? rand(2, 6) : rand(3, 9);
      const first = d === 3 ? rand(1, 10) : rand(1, 15);
      const t1 = first, t2 = first + step, t3 = first + 2 * step;
      const b = first - step;
      const correctFormula = seqFormatLinear(step, b);
      const altCoef1 = step + 1;
      const altCoef2 = step > 1 ? step - 1 : step + 2;
      const distractors = [
        seqFormatLinear(step, b + step),
        seqFormatLinear(step, b - step),
        seqFormatLinear(altCoef1, b),
        seqFormatLinear(altCoef2, b),
      ].filter((s) => s !== correctFormula);
      const { options, correctIndex } = buildMCStr(correctFormula, [...new Set(distractors)]);
      return {
        q: `A sequence begins ${t1}, ${t2}, ${t3}, ... and keeps the same pattern. Which expression gives the nth term?`,
        options,
        correctIndex,
        hint: "The number in front of n is the common difference; then check what needs to be added or subtracted to match the first term.",
        solution: {
          idea: "For an arithmetic sequence, the nth term has the form (common difference) × n, adjusted by a constant.",
          steps: [
            `The common difference is ${step} (each term is ${step} more than the last), so the formula starts with ${step}n.`,
            `When n = 1, ${step}n = ${step}, but the first term is ${first}, so the formula needs "${seqFormatBTerm(b)}" to correct it.`,
            `Check with n = 2: ${step} × 2 ${seqFormatBTerm(b)} = ${step * 2 + b}, which matches ${t2}.`,
          ],
          check: `nth term = ${correctFormula}.`,
        },
      };
    },
  },

  term_membership_check: {
    difficulties: [3, 4],
    build(d) {
      const step = d === 3 ? rand(3, 7) : rand(4, 9);
      const start = d === 3 ? rand(1, 10) : rand(2, 15);
      const isMember = Math.random() < 0.5;
      let target;
      if (isMember) {
        const k = rand(5, 20);
        target = start + k * step;
      } else {
        let candidate;
        do {
          const k = rand(5, 20);
          const offset = rand(1, step - 1);
          candidate = start + k * step + offset;
        } while ((candidate - start) % step === 0);
        target = candidate;
      }
      const belongs = (target - start) >= 0 && (target - start) % step === 0;
      const answerText = belongs ? "Yes, it appears in the sequence" : "No, it does not appear in the sequence";
      const otherText = belongs ? "No, it does not appear in the sequence" : "Yes, it appears in the sequence";
      const distractors = [
        otherText,
        "Not possible to tell without listing every term",
        `Yes, but only because ${target} is even`,
        `No, because ${step} is larger than ${start}`,
      ];
      const { options, correctIndex } = buildMCStr(answerText, distractors);
      const gap = target - start;
      return {
        q: `A sequence starts at ${start} and increases by ${step} each time: ${start}, ${start + step}, ${start + 2 * step}, ... Does the number ${target} appear in this sequence?`,
        options,
        correctIndex,
        hint: `Subtract the starting number from ${target}, then check whether the result divides exactly by ${step}.`,
        solution: {
          idea: "A number belongs to an arithmetic sequence only if the gap from the first term is an exact multiple of the step.",
          steps: [
            `${target} - ${start} = ${gap}.`,
            belongs
              ? `${gap} ÷ ${step} = ${gap / step}, an exact whole number.`
              : `${gap} ÷ ${step} = ${Math.floor(gap / step)} remainder ${gap % step}, not exact.`,
          ],
          check: belongs
            ? `${gap} divides exactly by ${step}, so ${target} does appear in the sequence.`
            : `${gap} does not divide exactly by ${step}, so ${target} does not appear in the sequence.`,
        },
      };
    },
  },

  two_stage_sequence: {
    difficulties: [3, 4],
    build(d) {
      const cycleLen = d === 3 ? rand(3, 5) : rand(4, 7);
      const specialOffset = rand(1, cycleLen);
      const N = d === 3 ? rand(30, 60) : rand(50, 100);
      let count = 0;
      for (let pos = 1; pos <= N; pos++) {
        const rem = pos % cycleLen;
        const p = rem === 0 ? cycleLen : rem;
        if (p === specialOffset) count++;
      }
      const answer = count;
      const distractors = [
        Math.floor(N / cycleLen),
        Math.ceil(N / cycleLen),
        count - 1,
        count + 1,
        Math.floor(N / cycleLen) + 1,
      ].filter((v) => v !== answer && v >= 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `Beads are threaded and numbered 1, 2, 3, ... Every ${cycleLen}${seqOrdinalSuffix(cycleLen)} bead is special, starting with bead number ${specialOffset}. Out of the first ${N} beads, how many are special?`,
        options,
        correctIndex,
        hint: "A special bead occurs at fixed positions in each group of beads: work out how many complete groups fit, then check the leftover beads.",
        solution: {
          idea: "Counting how often a position occurs in a repeating cycle can be done by counting whole groups plus a partial group.",
          steps: [
            `Special beads are numbered ${specialOffset}, ${specialOffset + cycleLen}, ${specialOffset + 2 * cycleLen}, ...`,
            `Counting these up to ${N} gives ${count} special beads.`,
          ],
          check: `${count} beads out of ${N} are special.`,
        },
      };
    },
  },

  triangular_or_square_number: {
    difficulties: [3, 4],
    build(d) {
      const useSquare = Math.random() < 0.5;
      const n = d === 3 ? rand(6, 10) : rand(9, 14);
      const answer = useSquare ? n * n : (n * (n + 1)) / 2;
      const scenario = useSquare
        ? `Tiles are arranged in a square grid, ${n} tiles along each side.`
        : `Cans are stacked so row 1 has 1 can, row 2 has 2 cans, row 3 has 3 cans, and so on, each row one more than the last, making a triangular stack ${n} rows high.`;
      const rawDistractors = useSquare
        ? [n * (n - 1), n * (n + 1), (n - 1) * (n - 1), n * 2, n * n - n]
        : [n * n, (n * (n - 1)) / 2, n * (n + 1), ((n + 1) * (n + 2)) / 2, (n * (n + 1)) / 2 + 1];
      const distractors = rawDistractors.filter((v) => Number.isInteger(v) && v !== answer && v >= 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `${scenario} How many ${useSquare ? "tiles" : "cans"} are there in total?`,
        options,
        correctIndex,
        hint: useSquare
          ? "A square arrangement with n along each side has n × n items in total."
          : "A triangular stack of n rows has the same total as 1 + 2 + 3 + ... + n, which equals n × (n + 1) ÷ 2.",
        solution: {
          idea: useSquare ? "The total in a square array is (side length) squared." : "The nth triangular number gives the total for a triangular stacking pattern.",
          steps: useSquare
            ? [`${n} × ${n} = ${answer}.`]
            : [`1 + 2 + ... + ${n} = ${n} × (${n} + 1) ÷ 2.`, `${n} × ${n + 1} ÷ 2 = ${n * (n + 1)} ÷ 2 = ${answer}.`],
          check: `Total = ${answer} ${useSquare ? "tiles" : "cans"}.`,
        },
      };
    },
  },

  fibonacci_style_missing_term: {
    difficulties: [3, 4],
    build(d) {
      const t1 = d === 3 ? rand(1, 4) : rand(1, 6);
      const t2 = d === 3 ? rand(1, 5) : rand(2, 7);
      const terms = [t1, t2];
      for (let i = 0; i < 4; i++) terms.push(terms[terms.length - 1] + terms[terms.length - 2]);
      const missingIdx = rand(2, 5);
      const answer = terms[missingIdx];
      const shown = terms.map((t, i) => (i === missingIdx ? "?" : t));
      const distractors = [
        answer - 1,
        answer + 1,
        terms[missingIdx - 1],
        terms[missingIdx - 1] + 1,
        missingIdx >= 3 ? terms[missingIdx - 1] * 2 : answer + 2,
      ].filter((v) => v !== answer && v >= 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `In this sequence, each term is the sum of the two terms before it: ${shown.join(", ")}. What is the missing number?`,
        options,
        correctIndex,
        hint: "Each number equals the two numbers just before it added together.",
        solution: {
          idea: "A Fibonacci-style sequence builds each new term from the two previous terms.",
          steps: [
            `Term ${missingIdx + 1} = term ${missingIdx} + term ${missingIdx - 1} = ${terms[missingIdx - 1]} + ${terms[missingIdx - 2]} = ${answer}.`,
          ],
          check: `Filling in ${answer} gives ${terms.join(", ")}, and each term is the sum of the two before it.`,
        },
      };
    },
  },

  compare_growth_two_sequences: {
    difficulties: [3, 4],
    build(d) {
      const a1 = d === 3 ? rand(1, 10) : rand(1, 15);
      const s1 = d === 3 ? rand(2, 5) : rand(2, 6);
      let a2, s2;
      do {
        a2 = d === 3 ? rand(1, 15) : rand(1, 20);
        s2 = d === 3 ? rand(3, 7) : rand(3, 9);
      } while (s2 === s1 || a2 === a1);
      const diffA = a2 - a1;
      const diffS = s1 - s2;
      let equalN = null;
      if (diffS !== 0 && diffA % diffS === 0) {
        const cand = diffA / diffS + 1;
        if (Number.isInteger(cand) && cand >= 1 && cand <= 40) equalN = cand;
      }
      if (equalN) {
        const answer = `term ${equalN}`;
        const candidateDistractors = [
          equalN - 1 >= 1 ? `term ${equalN - 1}` : null,
          `term ${equalN + 1}`,
          `term ${equalN + 2}`,
          "They are never equal",
        ].filter((v) => v && v !== answer);
        const { options, correctIndex } = buildMCStr(answer, [...new Set(candidateDistractors)]);
        return {
          q: `Sequence A starts at ${a1} and increases by ${s1} each time. Sequence B starts at ${a2} and increases by ${s2} each time. At which term do sequences A and B first become equal?`,
          options,
          correctIndex,
          hint: "Write an expression for term n of each sequence and find the value of n that makes them equal.",
          solution: {
            idea: "Two arithmetic sequences meet where their nth-term expressions give the same value.",
            steps: [
              `Term n of A is ${a1} + (n - 1) × ${s1}; term n of B is ${a2} + (n - 1) × ${s2}.`,
              `Setting them equal: (n - 1) × (${s1} - ${s2}) = ${a2} - ${a1}, so n - 1 = ${diffA} ÷ ${diffS} = ${equalN - 1}.`,
              `So n = ${equalN}.`,
            ],
            check: `Term ${equalN} of A = ${a1 + (equalN - 1) * s1}; term ${equalN} of B = ${a2 + (equalN - 1) * s2}.`,
          },
        };
      }
      const N = d === 3 ? rand(6, 10) : rand(8, 14);
      const valA = a1 + (N - 1) * s1;
      const valB = a2 + (N - 1) * s2;
      const answer = valA > valB ? "Sequence A" : valA < valB ? "Sequence B" : "They are equal";
      const distractors = ["Sequence A", "Sequence B", "They are equal", "Not possible to tell", "They can never be compared"].filter((v) => v !== answer);
      const { options, correctIndex } = buildMCStr(answer, distractors);
      return {
        q: `Sequence A starts at ${a1} and increases by ${s1} each time. Sequence B starts at ${a2} and increases by ${s2} each time. Which sequence is bigger at term ${N}?`,
        options,
        correctIndex,
        hint: "Work out term N for each sequence directly using the nth-term idea, then compare.",
        solution: {
          idea: "Comparing two arithmetic sequences at a given term means evaluating both nth terms and comparing.",
          steps: [
            `Term ${N} of A = ${a1} + (${N} - 1) × ${s1} = ${valA}.`,
            `Term ${N} of B = ${a2} + (${N} - 1) × ${s2} = ${valB}.`,
          ],
          check: `${valA} ${valA > valB ? ">" : valA < valB ? "<" : "="} ${valB}, so the answer is ${answer}.`,
        },
      };
    },
  },

  alternating_operation_sequence: {
    difficulties: [3, 4],
    build(d) {
      const op1 = d === 3 ? rand(3, 8) : rand(4, 10);
      const op2 = d === 3 ? rand(1, 4) : rand(2, 6);
      const start = d === 3 ? rand(10, 20) : rand(15, 30);
      const terms = [start];
      const ops = [];
      for (let i = 0; i < 5; i++) {
        const addStep = i % 2 === 0;
        ops.push(addStep);
        const prev = terms[terms.length - 1];
        terms.push(addStep ? prev + op1 : prev - op2);
      }
      if (terms.some((t) => t < 0)) return null;
      const answer = terms[5];
      const shownTerms = terms.slice(0, 5);
      const lastOpWasAdd = ops[4];
      const distractors = [
        shownTerms[4] + op2,
        shownTerms[4] - op1,
        answer + 1,
        answer - 1,
        shownTerms[4] + op1 + op2,
      ].filter((v) => v !== answer && v >= 0);
      const { options, correctIndex } = buildMC(answer, [...new Set(distractors)]);
      return {
        q: `A sequence follows an alternating rule: add ${op1}, then subtract ${op2}, then add ${op1}, then subtract ${op2}, and so on. Starting at ${start}, it goes: ${shownTerms.join(", ")}, ? What is the next number?`,
        options,
        correctIndex,
        hint: "Work out which of the two alternating operations comes next, based on the last operation used.",
        solution: {
          idea: "An alternating rule swaps between two operations every other term.",
          steps: [
            `The rule alternates: +${op1}, -${op2}, +${op1}, -${op2}, ...`,
            `The next operation is ${lastOpWasAdd ? `+${op1}` : `-${op2}`}: ${shownTerms[4]} ${lastOpWasAdd ? "+" : "-"} ${lastOpWasAdd ? op1 : op2} = ${answer}.`,
          ],
          check: `Full sequence: ${terms.join(", ")}.`,
        },
      };
    },
  },

};
// Structure registry for symmetryReflection. Focused on genuine reflection mechanics
// (rather than the sibling shapeProperties topic's simple symmetry-recall/translation):
// lines of symmetry of regular and partially-symmetric shapes, reflecting a point in an
// axis/diagonal/offset line, reflecting a whole triangle's vertices, completing a
// symmetric pattern across vertical/horizontal/diagonal mirror lines, comparing shapes by
// symmetry count, a two-step (compose two reflections) problem, working backwards from an
// image to the original point, and a line-vs-rotational-symmetry contrast structure.
function symGridSetup(range, cellPx) {
  const margin = 26;
  const half = range * cellPx;
  const W = half * 2 + margin * 2;
  const H = W;
  function toPx(x, y) { return { px: margin + half + x * cellPx, py: margin + half - y * cellPx }; }
  return { W, H, toPx, range, cellPx, margin };
}
function symGridLinesSVG(g, color = "#e6e0f7") {
  let s = "";
  for (let i = -g.range; i <= g.range; i++) {
    const a = g.toPx(i, -g.range), b = g.toPx(i, g.range);
    s += SL(a.px, a.py, b.px, b.py, color, 1);
    const c = g.toPx(-g.range, i), dd = g.toPx(g.range, i);
    s += SL(c.px, c.py, dd.px, dd.py, color, 1);
  }
  return s;
}
function symAxesSVG(g, color = "#2a1a5e") {
  const xA = g.toPx(-g.range, 0), xB = g.toPx(g.range, 0);
  const yA = g.toPx(0, -g.range), yB = g.toPx(0, g.range);
  return SL(xA.px, xA.py, xB.px, xB.py, color, 2) + SL(yA.px, yA.py, yB.px, yB.py, color, 2);
}
function symPointSVG(g, x, y, label, color = "#e0562b") {
  const p = g.toPx(x, y);
  return SC(p.px, p.py, 5, color, 2, color) + ST(p.px, p.py - 10, label, "middle", 13, color, 700);
}
function symMirrorLineSVG(g, line, k, color = "#1a8f5e") {
  let a, b;
  if (line === "x-axis") { a = g.toPx(-g.range, 0); b = g.toPx(g.range, 0); }
  else if (line === "y-axis") { a = g.toPx(0, -g.range); b = g.toPx(0, g.range); }
  else if (line === "y=x") { a = g.toPx(-g.range, -g.range); b = g.toPx(g.range, g.range); }
  else if (line === "y=-x") { a = g.toPx(-g.range, g.range); b = g.toPx(g.range, -g.range); }
  else if (line === "x=k") { a = g.toPx(k, -g.range); b = g.toPx(k, g.range); }
  else if (line === "y=k") { a = g.toPx(-g.range, k); b = g.toPx(g.range, k); }
  return `<line x1="${a.px}" y1="${a.py}" x2="${b.px}" y2="${b.py}" stroke="${color}" stroke-width="3" stroke-dasharray="6,4"/>`;
}
function symLineLabel(line, k) {
  if (line === "x-axis") return "the x-axis";
  if (line === "y-axis") return "the y-axis";
  if (line === "y=x") return "the line y = x";
  if (line === "y=-x") return "the line y = −x";
  if (line === "x=k") return `the line x = ${k}`;
  if (line === "y=k") return `the line y = ${k}`;
  return line;
}
function symReflectPoint([x, y], line, k) {
  if (line === "x-axis") return [x, -y];
  if (line === "y-axis") return [-x, y];
  if (line === "y=x") return [y, x];
  if (line === "y=-x") return [-y, -x];
  if (line === "x=k") return [2 * k - x, y];
  if (line === "y=k") return [x, 2 * k - y];
  throw new Error("unknown line " + line);
}
function symFmtPt([x, y]) { return `(${x}, ${y})`; }
function symDistinctOrNull(correct, distractors) {
  const set = new Set([correct, ...distractors]);
  return set.size === 1 + distractors.length ? distractors : null;
}
function symPolySVG(pts, color = "#2a1a5e", fill = "none", sw = 2) {
  return `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${fill}" stroke="${color}" stroke-width="${sw}"/>`;
}
function symRegularPolygonPoints(cx, cy, r, n, rotationDeg = -90) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const ang = ((rotationDeg + (i * 360) / n) * Math.PI) / 180;
    pts.push([+(cx + r * Math.cos(ang)).toFixed(1), +(cy + r * Math.sin(ang)).toFixed(1)]);
  }
  return pts;
}
function symIsoscelesTrianglePoints(cx, cy, r) {
  return [[cx, cy - r], [cx + r * 0.55, cy + r * 0.7], [cx - r * 0.55, cy + r * 0.7]];
}
function symKitePoints(cx, cy, r) {
  return [[cx, cy - r], [cx + r * 0.5, cy], [cx, cy + r * 0.8], [cx - r * 0.5, cy]];
}
function symRhombusPoints(cx, cy, r) {
  return [[cx, cy - r], [cx + r * 0.6, cy], [cx, cy + r], [cx - r * 0.6, cy]];
}
function symIsoscelesTrapeziumPoints(cx, cy, r) {
  return [[cx - r * 0.4, cy - r * 0.6], [cx + r * 0.4, cy - r * 0.6], [cx + r * 0.8, cy + r * 0.6], [cx - r * 0.8, cy + r * 0.6]];
}
function symParallelogramPoints(cx, cy, r) {
  return [[cx - r * 0.6, cy - r * 0.5], [cx + r * 0.9, cy - r * 0.5], [cx + r * 0.3, cy + r * 0.5], [cx - r * 1.2, cy + r * 0.5]];
}
function symScaleneTrianglePoints(cx, cy, r) {
  return [[cx - r * 0.7, cy + r * 0.7], [cx + r * 0.9, cy + r * 0.3], [cx - r * 0.1, cy - r]];
}
function symZTetrominoPoints(ox, oy, u) {
  return [[ox, oy], [ox + 2 * u, oy], [ox + 2 * u, oy + u], [ox + 3 * u, oy + u], [ox + 3 * u, oy + 2 * u], [ox + u, oy + 2 * u], [ox + u, oy + u], [ox, oy + u]];
}
const SYM_SHAPE_SYMMETRY_FACTS = [
  { name: "a parallelogram", count: 0 },
  { name: "a kite", count: 1 },
  { name: "a rectangle", count: 2 },
  { name: "an equilateral triangle", count: 3 },
  { name: "a square", count: 4 },
  { name: "a regular pentagon", count: 5 },
  { name: "a regular hexagon", count: 6 },
];
function symCellGridSVG(W, H, cellPx, shaded, mirror) {
  const margin = 20;
  const gw = W * cellPx, gh = H * cellPx;
  let s = "";
  for (let i = 0; i <= W; i++) s += SL(margin + i * cellPx, margin, margin + i * cellPx, margin + gh, "#cfc4ee", 1);
  for (let j = 0; j <= H; j++) s += SL(margin, margin + j * cellPx, margin + gw, margin + j * cellPx, "#cfc4ee", 1);
  s += SR(margin, margin, gw, gh, "#2a1a5e", 2);
  for (const [c, r, col] of shaded) {
    s += SR(margin + (c - 1) * cellPx, margin + (r - 1) * cellPx, cellPx, cellPx, "#2a1a5e", 2, col);
  }
  if (mirror.type === "v") {
    const x = margin + mirror.at * cellPx;
    s += `<line x1="${x}" y1="${margin - 8}" x2="${x}" y2="${margin + gh + 8}" stroke="#1a8f5e" stroke-width="3" stroke-dasharray="6,4"/>`;
  } else if (mirror.type === "h") {
    const y = margin + mirror.at * cellPx;
    s += `<line x1="${margin - 8}" y1="${y}" x2="${margin + gw + 8}" y2="${y}" stroke="#1a8f5e" stroke-width="3" stroke-dasharray="6,4"/>`;
  } else if (mirror.type === "d") {
    s += `<line x1="${margin}" y1="${margin}" x2="${margin + gw}" y2="${margin + gh}" stroke="#1a8f5e" stroke-width="3" stroke-dasharray="6,4"/>`;
  }
  return svgBox(s, margin * 2 + gw, margin * 2 + gh);
}
const symCellFmt = (c, r) => `column ${c}, row ${r}`;
const SYMMETRY_REFLECTION_STRUCTURES = {

  lines_of_symmetry_regular: {
    difficulties: [1, 2],
    build(d) {
      const shapes = [
        { name: "an equilateral triangle", count: 3, svg: (cx, cy, r) => symPolySVG(symRegularPolygonPoints(cx, cy, r, 3)) },
        { name: "a square", count: 4, svg: (cx, cy, r) => SR(cx - r * 0.8, cy - r * 0.8, r * 1.6, r * 1.6) },
        { name: "a rectangle", count: 2, svg: (cx, cy, r) => SR(cx - r, cy - r * 0.6, r * 2, r * 1.2) },
        { name: "a regular pentagon", count: 5, svg: (cx, cy, r) => symPolySVG(symRegularPolygonPoints(cx, cy, r, 5)) },
        { name: "a regular hexagon", count: 6, svg: (cx, cy, r) => symPolySVG(symRegularPolygonPoints(cx, cy, r, 6)) },
        { name: "an isosceles triangle", count: 1, svg: (cx, cy, r) => symPolySVG(symIsoscelesTrianglePoints(cx, cy, r)) },
      ];
      const shape = pick(shapes);
      const svg = svgBox(shape.svg(140, 110, 75));
      const { options, correctIndex } = buildMC(shape.count, [0, 1, 2, 3, 4, 5, 6].filter((n) => n !== shape.count));
      return {
        q: `How many lines of symmetry does ${shape.name} have?`,
        svg,
        options, correctIndex,
        hint: "A line of symmetry is a line you could fold the shape along so the two halves match exactly. Try imagining folding it in different directions.",
        solution: {
          idea: `${shape.name[0].toUpperCase()}${shape.name.slice(1)} is a shape with a fixed, well-known number of symmetry lines.`,
          steps: [
            `Look for every line that splits the shape into two mirror-image halves.`,
            `${shape.name[0].toUpperCase()}${shape.name.slice(1)} has exactly ${shape.count} such line${shape.count === 1 ? "" : "s"}.`,
          ],
          check: "Counting the lines of symmetry of standard shapes is worth memorising: triangle types, square, rectangle, and regular polygons all have fixed counts.",
        },
      };
    },
  },

  reflect_point_axis: {
    difficulties: [1, 2],
    build(d) {
      const range = d === 1 ? 4 : 5;
      const x = rand(1, range) * pick([1, -1]);
      let y = rand(1, range) * pick([1, -1]);
      while (Math.abs(y) === Math.abs(x)) y = rand(1, range) * pick([1, -1]);
      const axis = pick(["x-axis", "y-axis"]);
      const image = symReflectPoint([x, y], axis);
      const g = symGridSetup(range + 1, 22);
      const svg = svgBox(symGridLinesSVG(g) + symAxesSVG(g) + symPointSVG(g, x, y, "P"), g.W, g.H);
      const wrongSameSign = [x, y];
      const wrongBothNeg = [-x, -y];
      const wrongSwap = [y, x];
      const wrongOtherAxis = axis === "x-axis" ? [-x, y] : [x, -y];
      const distractors = symDistinctOrNull(symFmtPt(image), [symFmtPt(wrongSameSign), symFmtPt(wrongBothNeg), symFmtPt(wrongSwap), symFmtPt(wrongOtherAxis)]);
      if (!distractors) return null;
      const { options, correctIndex } = buildMCStr(symFmtPt(image), distractors);
      return {
        q: `Point P is at ${symFmtPt([x, y])}. What are the coordinates of P after it is reflected in ${symLineLabel(axis)}?`,
        svg, options, correctIndex,
        hint: axis === "x-axis"
          ? "Reflecting in the x-axis keeps the x-coordinate the same and flips the sign of the y-coordinate."
          : "Reflecting in the y-axis keeps the y-coordinate the same and flips the sign of the x-coordinate.",
        solution: {
          idea: `Reflecting in ${symLineLabel(axis)} keeps one coordinate the same and reverses the sign of the other.`,
          steps: [
            `Start at P${symFmtPt([x, y])}.`,
            axis === "x-axis" ? `The x-axis reflection keeps x = ${x} and flips y: ${y} becomes ${-y}.` : `The y-axis reflection keeps y = ${y} and flips x: ${x} becomes ${-x}.`,
            `The image is ${symFmtPt(image)}.`,
          ],
        },
      };
    },
  },

  complete_pattern_vertical_mirror: {
    difficulties: [1, 2],
    build(d) {
      const W = 8, H = d === 1 ? 4 : 6;
      let c0 = rand(1, W);
      while (c0 === W / 2) c0 = rand(1, W);
      const r0 = rand(1, H);
      const cImg = W + 1 - c0;
      if (cImg === c0) return null;
      const svg = symCellGridSVG(W, H, 28, [[c0, r0, "#f5a623"]], { type: "v", at: W / 2 });
      const correct = symCellFmt(cImg, r0);
      const distractors = symDistinctOrNull(correct, [symCellFmt(c0, r0), symCellFmt(W - c0, r0), symCellFmt(cImg, r0 === H ? r0 - 1 : r0 + 1), symCellFmt(c0, H + 1 - r0)]);
      if (!distractors) return null;
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: "One square is shaded on the grid. The dashed green line is a mirror line. Which square must also be shaded so the pattern is symmetrical?",
        svg, options, correctIndex,
        hint: "Count how many squares the shaded square is from the mirror line, then count the same number of squares on the other side.",
        solution: {
          idea: "A vertical mirror line reflects each column to the matching column on the other side, keeping the same row.",
          steps: [
            `The shaded square is at ${symCellFmt(c0, r0)}.`,
            `Column ${c0} is ${Math.abs(c0 - (W + 1) / 2)} steps from the mirror line, so its reflection is column ${W + 1} − ${c0} = ${cImg}.`,
            `The row does not change, so the matching square is ${correct}.`,
          ],
        },
      };
    },
  },

  complete_pattern_horizontal_mirror: {
    difficulties: [1, 2],
    build(d) {
      const H = 8, W = d === 1 ? 4 : 6;
      const c0 = rand(1, W);
      let r0 = rand(1, H);
      while (r0 === H / 2) r0 = rand(1, H);
      const rImg = H + 1 - r0;
      if (rImg === r0) return null;
      const svg = symCellGridSVG(W, H, 28, [[c0, r0, "#f5a623"]], { type: "h", at: H / 2 });
      const correct = symCellFmt(c0, rImg);
      const distractors = symDistinctOrNull(correct, [symCellFmt(c0, r0), symCellFmt(c0, H - r0), symCellFmt(c0 === W ? c0 - 1 : c0 + 1, rImg), symCellFmt(W + 1 - c0, r0)]);
      if (!distractors) return null;
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: "One square is shaded on the grid. The dashed green line is a mirror line. Which square must also be shaded so the pattern is symmetrical?",
        svg, options, correctIndex,
        hint: "Count how many squares the shaded square is from the mirror line, then count the same number of squares on the other side.",
        solution: {
          idea: "A horizontal mirror line reflects each row to the matching row on the other side, keeping the same column.",
          steps: [
            `The shaded square is at ${symCellFmt(c0, r0)}.`,
            `Row ${r0} reflects to row ${H + 1} − ${r0} = ${rImg}.`,
            `The column does not change, so the matching square is ${correct}.`,
          ],
        },
      };
    },
  },

  is_shape_symmetric_simple: {
    difficulties: [1, 2],
    build(d) {
      const shapes = [
        { name: "letter T shape", count: 1, svg: () => `${SR(120, 40, 40, 16)}${SR(132, 56, 16, 100)}` },
        { name: "letter L shape", count: 0, svg: () => `${SR(110, 40, 20, 116)}${SR(110, 136, 70, 20)}` },
        { name: "isosceles triangle", count: 1, svg: () => symPolySVG(symIsoscelesTrianglePoints(140, 40, 75)) },
        { name: "scalene triangle", count: 0, svg: () => symPolySVG(symScaleneTrianglePoints(140, 150, 70)) },
        { name: "kite", count: 1, svg: () => symPolySVG(symKitePoints(140, 110, 75)) },
        { name: "letter F shape", count: 0, svg: () => `${SR(105, 30, 18, 130)}${SR(105, 30, 60, 18)}${SR(105, 80, 45, 18)}` },
      ];
      const shape = pick(shapes);
      const svg = svgBox(shape.svg());
      const { options, correctIndex } = buildMC(shape.count, [0, 1, 2, 3, 4].filter((n) => n !== shape.count));
      return {
        q: `How many lines of symmetry does this ${shape.name} have?`,
        svg, options, correctIndex,
        hint: "Try imagining folding the shape in half in different directions. If the two halves match up exactly, that fold line is a line of symmetry.",
        solution: {
          idea: "Count the number of positions where the shape folds perfectly onto itself.",
          steps: [
            shape.count === 0
              ? "No fold line makes the two halves match, so it has 0 lines of symmetry."
              : `Folding along ${shape.count === 1 ? "one line" : `${shape.count} lines`} makes the two halves match exactly.`,
          ],
        },
      };
    },
  },

  shape_with_n_lines_lookup: {
    difficulties: [2, 3],
    build(d) {
      const chosen = shuffle(SYM_SHAPE_SYMMETRY_FACTS).slice(0, 5);
      const correctFact = pick(chosen);
      const options5 = chosen.map((s) => s.name);
      const distractors = options5.filter((n) => n !== correctFact.name);
      const { options, correctIndex } = buildMCStr(correctFact.name, distractors);
      return {
        q: `Which of these shapes has exactly ${correctFact.count} line${correctFact.count === 1 ? "" : "s"} of symmetry: ${chosen.map((s) => s.name).join(", ")}?`,
        options, correctIndex,
        hint: "Recall (or picture) each shape and count its lines of symmetry, then match to the number given.",
        solution: {
          idea: "Each shape has a fixed number of lines of symmetry that is worth knowing by heart.",
          steps: chosen.map((s) => `${s.name[0].toUpperCase()}${s.name.slice(1)} has ${s.count} line${s.count === 1 ? "" : "s"} of symmetry.`).concat([`Only ${correctFact.name} matches ${correctFact.count}.`]),
        },
      };
    },
  },

  reflect_triangle_vertices: {
    difficulties: [2, 3],
    build(d) {
      const range = d === 2 ? 4 : 5;
      function randPt() { return [rand(1, range) * pick([1, -1]), rand(1, range) * pick([1, -1])]; }
      let A, B, C, tries = 0, cross = 0;
      do {
        A = randPt(); B = randPt(); C = randPt();
        tries++;
        cross = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
      } while (cross === 0 && tries < 20);
      if (cross === 0) return null;
      const axis = pick(["x-axis", "y-axis"]);
      const [A2, B2, C2] = [A, B, C].map((p) => symReflectPoint(p, axis));
      const g = symGridSetup(range + 1, 20);
      const svg = svgBox(
        symGridLinesSVG(g) + symAxesSVG(g) +
        symPolySVG([g.toPx(...A), g.toPx(...B), g.toPx(...C)].map((p) => [p.px, p.py]), "#e0562b") +
        symPointSVG(g, ...A, "A") + symPointSVG(g, ...B, "B") + symPointSVG(g, ...C, "C"),
        g.W, g.H
      );
      const correct = `A'${symFmtPt(A2)}, B'${symFmtPt(B2)}, C'${symFmtPt(C2)}`;
      const wrongNoFlip = `A'${symFmtPt(A)}, B'${symFmtPt(B)}, C'${symFmtPt(C)}`;
      const wrongOtherAxis = `A'${symFmtPt(symReflectPoint(A, axis === "x-axis" ? "y-axis" : "x-axis"))}, B'${symFmtPt(symReflectPoint(B, axis === "x-axis" ? "y-axis" : "x-axis"))}, C'${symFmtPt(symReflectPoint(C, axis === "x-axis" ? "y-axis" : "x-axis"))}`;
      const wrongOnlyA = `A'${symFmtPt(A2)}, B'${symFmtPt(B)}, C'${symFmtPt(C)}`;
      const wrongOrigin = `A'${symFmtPt([-A[0], -A[1]])}, B'${symFmtPt([-B[0], -B[1]])}, C'${symFmtPt([-C[0], -C[1]])}`;
      const distractors = symDistinctOrNull(correct, [wrongNoFlip, wrongOtherAxis, wrongOnlyA, wrongOrigin]);
      if (!distractors) return null;
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `Triangle ABC has vertices A${symFmtPt(A)}, B${symFmtPt(B)} and C${symFmtPt(C)}. What are the coordinates of the image A'B'C' after the triangle is reflected in ${symLineLabel(axis)}?`,
        svg, options, correctIndex,
        hint: "Reflect each vertex separately using the same rule, then put the three new coordinates together.",
        solution: {
          idea: `Reflecting a whole shape in ${symLineLabel(axis)} means reflecting every one of its vertices using the same rule.`,
          steps: [
            `A${symFmtPt(A)} → A'${symFmtPt(A2)}`,
            `B${symFmtPt(B)} → B'${symFmtPt(B2)}`,
            `C${symFmtPt(C)} → C'${symFmtPt(C2)}`,
          ],
          check: "The reflected triangle should be the same size and shape as the original, just flipped.",
        },
      };
    },
  },

  count_lines_partial_symmetric_shape: {
    difficulties: [2, 3],
    build(d) {
      const shapes = [
        { name: "rectangle", count: 2, svg: (cx, cy, r) => SR(cx - r, cy - r * 0.6, r * 2, r * 1.2) },
        { name: "rhombus", count: 2, svg: (cx, cy, r) => symPolySVG(symRhombusPoints(cx, cy, r)) },
        { name: "kite", count: 1, svg: (cx, cy, r) => symPolySVG(symKitePoints(cx, cy, r)) },
        { name: "isosceles trapezium", count: 1, svg: (cx, cy, r) => symPolySVG(symIsoscelesTrapeziumPoints(cx, cy, r)) },
        { name: "parallelogram", count: 0, svg: (cx, cy, r) => symPolySVG(symParallelogramPoints(cx, cy, r)) },
        { name: "isosceles triangle", count: 1, svg: (cx, cy, r) => symPolySVG(symIsoscelesTrianglePoints(cx, cy, r)) },
      ];
      const shape = pick(shapes);
      const svg = svgBox(shape.svg(140, 110, 75));
      const { options, correctIndex } = buildMC(shape.count, [0, 1, 2, 3, 4].filter((n) => n !== shape.count));
      return {
        q: `How many lines of symmetry does this ${shape.name} have?`,
        svg, options, correctIndex,
        hint: "Some shapes look almost symmetrical but only fold exactly onto themselves along certain lines. Check each direction carefully.",
        solution: {
          idea: `A ${shape.name} has a specific number of lines of symmetry depending on its exact shape.`,
          steps: [
            shape.count === 0
              ? `No line splits this ${shape.name} into two matching halves.`
              : `This ${shape.name} folds onto itself along ${shape.count} line${shape.count === 1 ? "" : "s"} of symmetry.`,
          ],
        },
      };
    },
  },

  complete_pattern_diagonal_mirror: {
    difficulties: [2, 3],
    build(d) {
      const N = 6;
      const c0 = rand(1, N);
      let r0 = rand(1, N);
      while (r0 === c0 || c0 + r0 === N + 1) r0 = rand(1, N);
      const cImg = r0, rImg = c0;
      const svg = symCellGridSVG(N, N, 28, [[c0, r0, "#f5a623"]], { type: "d" });
      const correct = symCellFmt(cImg, rImg);
      const distractors = symDistinctOrNull(correct, [symCellFmt(c0, r0), symCellFmt(N + 1 - c0, N + 1 - r0), symCellFmt(c0, N + 1 - r0), symCellFmt(N + 1 - c0, r0)]);
      if (!distractors) return null;
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: "One square is shaded on the grid. The dashed green diagonal line is a mirror line. Which square must also be shaded so the pattern is symmetrical?",
        svg, options, correctIndex,
        hint: "A diagonal mirror line swaps the column number and the row number of the shaded square.",
        solution: {
          idea: "Reflecting in this diagonal line swaps the column and row numbers.",
          steps: [
            `The shaded square is at ${symCellFmt(c0, r0)}.`,
            `Swapping column and row gives ${correct}.`,
          ],
        },
      };
    },
  },

  most_fewest_lines_comparison: {
    difficulties: [2, 3],
    build(d) {
      const chosen = shuffle(SYM_SHAPE_SYMMETRY_FACTS).slice(0, 5);
      const wantMost = pick([true, false]);
      const sorted = [...chosen].sort((a, b) => (wantMost ? b.count - a.count : a.count - b.count));
      const correctFact = sorted[0];
      const distractors = chosen.filter((s) => s.name !== correctFact.name).map((s) => s.name);
      const { options, correctIndex } = buildMCStr(correctFact.name, distractors);
      return {
        q: `Which of these shapes has the ${wantMost ? "most" : "fewest"} lines of symmetry: ${chosen.map((s) => s.name).join(", ")}?`,
        options, correctIndex,
        hint: "Work out (or recall) the number of lines of symmetry for each shape, then compare them.",
        solution: {
          idea: "List the number of lines of symmetry for every shape given, then pick the largest (or smallest).",
          steps: chosen.map((s) => `${s.name[0].toUpperCase()}${s.name.slice(1)}: ${s.count}`).concat([`The ${wantMost ? "most" : "fewest"} is ${correctFact.name} with ${correctFact.count}.`]),
        },
      };
    },
  },

  reflect_point_diagonal_line: {
    difficulties: [3, 4],
    build(d) {
      const range = d === 3 ? 5 : 6;
      const x = rand(1, range) * pick([1, -1]);
      let y = rand(1, range) * pick([1, -1]);
      if (Math.abs(y) === Math.abs(x)) y = y + (y > 0 ? 1 : -1);
      const line = pick(["y=x", "y=-x"]);
      const image = symReflectPoint([x, y], line);
      const g = symGridSetup(range + 1, 20);
      const svg = svgBox(symGridLinesSVG(g) + symAxesSVG(g) + symMirrorLineSVG(g, line) + symPointSVG(g, x, y, "P"), g.W, g.H);
      const otherDiag = line === "y=x" ? "y=-x" : "y=x";
      const distractors = symDistinctOrNull(symFmtPt(image), [symFmtPt([x, y]), symFmtPt(symReflectPoint([x, y], otherDiag)), symFmtPt(symReflectPoint([x, y], "x-axis")), symFmtPt(symReflectPoint([x, y], "y-axis"))]);
      if (!distractors) return null;
      const { options, correctIndex } = buildMCStr(symFmtPt(image), distractors);
      return {
        q: `Point P is at ${symFmtPt([x, y])}. What are the coordinates of P after it is reflected in ${symLineLabel(line)}?`,
        svg, options, correctIndex,
        hint: line === "y=x" ? "Reflecting in y = x swaps the two coordinates round." : "Reflecting in y = −x swaps the coordinates round and changes both signs.",
        solution: {
          idea: `Reflecting in ${symLineLabel(line)} has a simple coordinate rule.`,
          steps: line === "y=x"
            ? [`Swap the coordinates: ${symFmtPt([x, y])} becomes ${symFmtPt(image)}.`]
            : [`Swap the coordinates and change both signs: ${symFmtPt([x, y])} becomes ${symFmtPt(image)}.`],
        },
      };
    },
  },

  reflect_point_offset_line: {
    difficulties: [3, 4],
    build(d) {
      const range = d === 3 ? 5 : 6;
      const line = pick(["x=k", "y=k"]);
      const k = rand(1, 3) * pick([1, -1]);
      const x = rand(-range, range);
      const y = rand(-range, range);
      if ((line === "x=k" && x === k) || (line === "y=k" && y === k)) return null;
      const image = symReflectPoint([x, y], line, k);
      const g = symGridSetup(range + 2, 18);
      const svg = svgBox(symGridLinesSVG(g) + symAxesSVG(g) + symMirrorLineSVG(g, line, k) + symPointSVG(g, x, y, "P"), g.W, g.H);
      const wrongAxisRule = line === "x=k" ? [-x, y] : [x, -y];
      const wrongNoDouble = line === "x=k" ? [k - x, y] : [x, k - y];
      const wrongSame = [x, y];
      const wrongWrongCoord = line === "x=k" ? [x, 2 * k - y] : [2 * k - x, y];
      const distractors = symDistinctOrNull(symFmtPt(image), [symFmtPt(wrongAxisRule), symFmtPt(wrongNoDouble), symFmtPt(wrongSame), symFmtPt(wrongWrongCoord)]);
      if (!distractors) return null;
      const { options, correctIndex } = buildMCStr(symFmtPt(image), distractors);
      return {
        q: `Point P is at ${symFmtPt([x, y])}. What are the coordinates of P after it is reflected in ${symLineLabel(line, k)}?`,
        svg, options, correctIndex,
        hint: "Find how far the point is from the mirror line, then go the same distance on the other side.",
        solution: {
          idea: `The point stays the same distance from ${symLineLabel(line, k)} but on the opposite side.`,
          steps: line === "x=k"
            ? [`P is ${Math.abs(x - k)} away from x = ${k} (P has x = ${x}).`, `Going the same distance the other side of x = ${k} gives x = ${image[0]}.`, `The y-coordinate does not change, so the image is ${symFmtPt(image)}.`]
            : [`P is ${Math.abs(y - k)} away from y = ${k} (P has y = ${y}).`, `Going the same distance the other side of y = ${k} gives y = ${image[1]}.`, `The x-coordinate does not change, so the image is ${symFmtPt(image)}.`],
        },
      };
    },
  },

  two_step_reflection: {
    difficulties: [3, 4],
    build(d) {
      const lines = shuffle(["x-axis", "y-axis", "y=x", "y=-x"]).slice(0, 2);
      const range = 5;
      const x = rand(1, range) * pick([1, -1]);
      let y = rand(1, range) * pick([1, -1]);
      if (Math.abs(y) === Math.abs(x)) y = y + (y > 0 ? 1 : -1);
      const p1 = symReflectPoint([x, y], lines[0]);
      const p2 = symReflectPoint(p1, lines[1]);
      const swappedOrder = symReflectPoint(symReflectPoint([x, y], lines[1]), lines[0]);
      const distractors = symDistinctOrNull(symFmtPt(p2), [symFmtPt(p1), symFmtPt(symReflectPoint([x, y], lines[1])), symFmtPt(swappedOrder), symFmtPt([x, y])]);
      if (!distractors) return null;
      const { options, correctIndex } = buildMCStr(symFmtPt(p2), distractors);
      return {
        q: `Point P is at ${symFmtPt([x, y])}. P is first reflected in ${symLineLabel(lines[0])}, then the image is reflected in ${symLineLabel(lines[1])}. What are the final coordinates?`,
        options, correctIndex,
        hint: "Do the reflections one at a time: work out the first image, then reflect that image in the second line.",
        solution: {
          idea: "Apply the two reflections in order, one after the other.",
          steps: [
            `Reflect P${symFmtPt([x, y])} in ${symLineLabel(lines[0])} to get ${symFmtPt(p1)}.`,
            `Reflect ${symFmtPt(p1)} in ${symLineLabel(lines[1])} to get ${symFmtPt(p2)}.`,
          ],
          check: "Doing the reflections in the wrong order can give a different answer, so always follow the order given.",
        },
      };
    },
  },

  find_original_point: {
    difficulties: [3, 4],
    build(d) {
      const range = d === 3 ? 5 : 6;
      const lineChoices = d === 3 ? ["x-axis", "y-axis", "y=x", "y=-x"] : ["x-axis", "y-axis", "y=x", "y=-x", "x=k", "y=k"];
      const line = pick(lineChoices);
      const k = rand(1, 3) * pick([1, -1]);
      let ix = rand(-range, range), iy = rand(-range, range);
      if ((line === "x=k" && ix === k) || (line === "y=k" && iy === k)) return null;
      const original = symReflectPoint([ix, iy], line, k);
      const g = symGridSetup(range + 1, 18);
      const svg = svgBox(symGridLinesSVG(g) + symAxesSVG(g) + symMirrorLineSVG(g, line, k) + symPointSVG(g, ix, iy, "Q"), g.W, g.H);
      const wrongSame = [ix, iy];
      const wrongOtherLine = symReflectPoint([ix, iy], line === "x-axis" ? "y-axis" : "x-axis");
      const wrongSignFlip = [-ix, -iy];
      const wrongPartial = line === "x=k" || line === "y=k" ? (line === "x=k" ? [k - ix, iy] : [ix, k - iy]) : [iy, ix];
      const distractors = symDistinctOrNull(symFmtPt(original), [symFmtPt(wrongSame), symFmtPt(wrongOtherLine), symFmtPt(wrongSignFlip), symFmtPt(wrongPartial)]);
      if (!distractors) return null;
      const { options, correctIndex } = buildMCStr(symFmtPt(original), distractors);
      return {
        q: `Point P was reflected in ${symLineLabel(line, k)} to give the image Q at ${symFmtPt([ix, iy])}. What were the original coordinates of P?`,
        svg, options, correctIndex,
        hint: "Reflections work the same way in both directions: apply the same reflection rule to the image to get back to the original point.",
        solution: {
          idea: `Reflecting Q back in ${symLineLabel(line, k)} returns to the original point P, because reflecting twice in the same line undoes itself.`,
          steps: [
            `Q is at ${symFmtPt([ix, iy])}.`,
            `Reflecting Q in ${symLineLabel(line, k)} gives P at ${symFmtPt(original)}.`,
          ],
          check: "Reflecting P in the same line should give Q back again.",
        },
      };
    },
  },

  symmetry_vs_rotational_contrast: {
    difficulties: [3, 4],
    build(d) {
      const shapes = [
        { name: "parallelogram", label: "rotational symmetry only", svg: () => symPolySVG(symParallelogramPoints(140, 110, 75)) },
        { name: "rectangle", label: "both line and rotational symmetry", svg: () => SR(65, 60, 150, 100) },
        { name: "isosceles trapezium", label: "line symmetry only", svg: () => symPolySVG(symIsoscelesTrapeziumPoints(140, 110, 75)) },
        { name: "Z-shaped tile (four squares)", label: "rotational symmetry only", svg: () => symPolySVG(symZTetrominoPoints(75, 40, 32)) },
        { name: "scalene triangle", label: "neither line nor rotational symmetry", svg: () => symPolySVG(symScaleneTrianglePoints(140, 150, 70)) },
        { name: "square", label: "both line and rotational symmetry", svg: () => SR(70, 35, 140, 140) },
      ];
      const shape = pick(shapes);
      const svg = svgBox(shape.svg());
      const allLabels = ["line symmetry only", "rotational symmetry only", "both line and rotational symmetry", "neither line nor rotational symmetry"];
      const distractors = allLabels.filter((l) => l !== shape.label).concat(["rotational symmetry of order 4 only"]).slice(0, 4);
      const { options, correctIndex } = buildMCStr(shape.label, distractors);
      return {
        q: `Look at this ${shape.name}. Which statement is true?`,
        svg, options, correctIndex,
        hint: "Line symmetry means it can be folded onto itself. Rotational symmetry means it can be turned (less than a full turn) and still look exactly the same. A shape can have one, both, or neither.",
        solution: {
          idea: "Check separately for line symmetry (folding) and rotational symmetry (turning): they are different properties.",
          steps: [
            `A ${shape.name} has ${shape.label}.`,
          ],
          check: "A shape like a parallelogram or a Z-shaped tile shows that rotational symmetry can exist without any line symmetry at all.",
        },
      };
    },
  },

};
// Structure registry for combinatoricsCounting (a stretch topic, gated to mock level 7+).
// Covers distinct counting principles rather than reskinned scenarios: the multiplication
// rule (2-way and 3-way), pigeonhole/guarantee reasoning, systematic coin-total listing,
// small sample-space listing, permutations and combinations (choose 2 and choose 3),
// counting distinct totals vs counting ways, a constrained-digit systematic listing,
// counting all squares in a grid, Pascal's-triangle route counting, digit-permutation
// numbers, the classic handshakes problem, a multiply-then-subtract-forbidden structure,
// and a keep-two-items-apart arrangement structure. Every structure shows the "list and
// count" logic alongside any formula shortcut, per this topic's house style.
function ccFactorial(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
function ccNPr(n, r) { let res = 1; for (let i = 0; i < r; i++) res *= (n - i); return res; }
function ccNCr(n, r) { return ccNPr(n, r) / ccFactorial(r); }
function ccMakeDistractors(correct, candidates) {
  const out = [];
  const seen = new Set([correct]);
  for (const c of candidates) {
    if (!Number.isFinite(c)) continue;
    if (c < 0) continue;
    if (seen.has(c)) continue;
    seen.add(c);
    out.push(c);
  }
  let delta = 1;
  while (out.length < 6 && delta <= 50) {
    for (const cand of [correct + delta, correct - delta, correct + delta * 2]) {
      if (out.length >= 6) break;
      if (cand < 0 || seen.has(cand)) continue;
      seen.add(cand);
      out.push(cand);
    }
    delta++;
  }
  return out;
}
const CC_COIN_TOTAL_CASES = [
  { a: 2, b: 5, target: 10 },
  { a: 2, b: 5, target: 14 },
  { a: 2, b: 5, target: 16 },
  { a: 2, b: 5, target: 20 },
  { a: 1, b: 5, target: 12 },
  { a: 5, b: 10, target: 30 },
  { a: 2, b: 10, target: 24 },
  { a: 5, b: 10, target: 40 },
];
function ccCountCoinWays(a, b, target) {
  let count = 0;
  for (let y = 0; y * b <= target; y++) {
    const rem = target - y * b;
    if (rem % a === 0) count++;
  }
  return count;
}
const CC_DIGIT_CAP_CASES = [
  { digits: [1, 3, 4, 7], cap: 4 },
  { digits: [1, 3, 4, 7], cap: 5 },
  { digits: [2, 3, 5, 8], cap: 5 },
  { digits: [1, 2, 6, 9], cap: 7 },
  { digits: [1, 4, 5, 9], cap: 5 },
  { digits: [2, 4, 6, 8], cap: 7 },
];
const COMBINATORICS_COUNTING_STRUCTURES = {
  mult_principle_2way: {
    difficulties: [1, 2],
    build(d) {
      const m = rand(2, d === 1 ? 4 : 5);
      const n = rand(2, d === 1 ? 4 : 5);
      const correct = m * n;
      const name = N1();
      const q = `${name} has ${m} different T-shirts and ${n} different pairs of shorts. If ${name} picks one T-shirt and one pair of shorts, how many different outfits could ${name} wear?`;
      const candidates = [m + n, (m - 1) * n, m * (n - 1), m * n + 1, m * n - 1, m * m, n * n];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: "For every choice of T-shirt, count how many choices of shorts go with it, then use the multiplication counting principle.",
        solution: {
          scenario: `${name} is choosing an outfit.`,
          idea: "When two choices are made independently, multiply the number of options for each choice together.",
          steps: [
            `There are ${m} T-shirts to choose from.`,
            `For each T-shirt, there are ${n} pairs of shorts that could go with it.`,
            `Total outfits = ${m} × ${n} = ${correct}.`,
          ],
          check: `Listing a few: T-shirt 1 with each of the ${n} shorts gives ${n} outfits, and there are ${m} T-shirts, so ${m} × ${n} = ${correct} in total.`,
        },
      };
    },
  },

  coin_totals_listing: {
    difficulties: [1, 2],
    build(d) {
      const pool = d === 1 ? CC_COIN_TOTAL_CASES.slice(0, 5) : CC_COIN_TOTAL_CASES;
      const { a, b, target } = pick(pool);
      const count = ccCountCoinWays(a, b, target);
      if (count < 1) return null;
      const q = `You have plenty of ${a}p and ${b}p coins. In how many different ways can you make exactly ${target}p, using only these two coin values (you may use any number of each, including none)?`;
      const candidates = [count + 1, count + 2, Math.max(0, count - 1), Math.floor(target / a), Math.floor(target / b)];
      const { options, correctIndex } = buildMC(count, ccMakeDistractors(count, candidates));
      const lines = [];
      for (let y = 0; y * b <= target; y++) {
        const rem = target - y * b;
        if (rem % a === 0) lines.push(`${rem / a} × ${a}p and ${y} × ${b}p`);
      }
      return {
        q,
        options,
        correctIndex,
        hint: "List every combination of the two coins systematically, starting from using none of the larger coin, and count how many ways work.",
        solution: {
          scenario: `Making ${target}p from ${a}p and ${b}p coins.`,
          idea: "Try every possible number of the bigger coin, and check whether the amount left over can be made exactly with the smaller coin.",
          steps: [
            `Try 0, 1, 2, ... coins of ${b}p and see what is left over each time.`,
            ...lines.map((l) => `${l} works.`),
            `That gives ${count} different way${count === 1 ? "" : "s"} in total.`,
          ],
          check: `Counting the list above gives ${count}.`,
        },
      };
    },
  },

  pigeonhole_guarantee: {
    difficulties: [1, 2],
    build(d) {
      const guaranteeCount = d === 1 ? 2 : pick([2, 2, 3]);
      const colours = d === 1 ? rand(2, 3) : rand(3, 5);
      const correct = (guaranteeCount - 1) * colours + 1;
      const q = `A drawer in the dark has socks in ${colours} different colours, plenty of each. What is the smallest number of socks you must pull out to be certain you have ${guaranteeCount} socks of the same colour?`;
      const candidates = [colours, colours + 1, colours * guaranteeCount, correct + 1, correct - 1, guaranteeCount * colours - 1];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: "Think about the worst possible luck: how many socks could you pull and still not have a match, before the very next one forces it?",
        solution: {
          scenario: "Guaranteeing a matching set of socks in the dark.",
          idea: "Work out the worst case: the most socks you could pull while still avoiding the target, then add one more.",
          steps: [
            `In the worst case you could pull ${guaranteeCount - 1} of each of the ${colours} colours without having ${guaranteeCount} of any one colour: ${guaranteeCount - 1} × ${colours} = ${(guaranteeCount - 1) * colours} socks.`,
            `The very next sock must complete a set of ${guaranteeCount}, however unlucky you are.`,
            `So you need ${(guaranteeCount - 1) * colours} + 1 = ${correct} socks.`,
          ],
          check: `With ${correct - 1} socks it is still possible to have only ${guaranteeCount - 1} of every colour, so ${correct - 1} is not enough; ${correct} always works.`,
        },
      };
    },
  },

  mult_principle_3way: {
    difficulties: [1, 2],
    build(d) {
      const a = rand(2, d === 1 ? 3 : 4);
      const b = rand(2, d === 1 ? 3 : 4);
      const c = rand(2, d === 1 ? 3 : 4);
      const correct = a * b * c;
      const q = `A cafe offers ${a} kinds of sandwich, ${b} kinds of drink and ${c} kinds of snack in its lunch deal. How many different lunch combos (one sandwich, one drink, one snack) are possible?`;
      const candidates = [a * b, b * c, a * c, a + b + c, a * b * c + 1, a * b * c - 1];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: "Multiply the number of choices at each of the three stages together.",
        solution: {
          scenario: "Choosing a three-part lunch combo.",
          idea: "With three independent choices, multiply all three totals together.",
          steps: [
            `${a} sandwiches × ${b} drinks = ${a * b} sandwich-and-drink pairs.`,
            `Each of those pairs can be combined with any of ${c} snacks: ${a * b} × ${c} = ${correct}.`,
          ],
          check: `${a} × ${b} × ${c} = ${correct}.`,
        },
      };
    },
  },

  coin_die_outcomes: {
    difficulties: [1, 2],
    build(d) {
      const sides = d === 1 ? pick([3, 4]) : pick([4, 5, 6]);
      const correct = 2 * sides;
      const q = `You flip a coin (Heads or Tails) and spin a fair spinner numbered 1 to ${sides}. How many different (coin, number) outcomes are possible altogether?`;
      const candidates = [sides, sides + 2, correct + 1, correct - 1, sides * sides, sides + 1];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      const listed = Array.from({ length: sides }, (_, i) => `(H,${i + 1})`).join(", ");
      return {
        q,
        options,
        correctIndex,
        hint: "List the outcomes systematically: every coin result can be paired with every spinner number.",
        solution: {
          scenario: "Listing every coin-and-spinner outcome.",
          idea: "For each of the 2 coin results, the same number of spinner results are possible, so multiply.",
          steps: [
            `With Heads, the spinner could land on any of ${sides} numbers: ${listed}.`,
            `The same ${sides} outcomes are possible with Tails.`,
            `Total outcomes = 2 × ${sides} = ${correct}.`,
          ],
          check: `2 × ${sides} = ${correct}.`,
        },
      };
    },
  },

  permutations_row: {
    difficulties: [2, 3],
    build(d) {
      const n = d === 2 ? rand(3, 4) : rand(4, 5);
      const correct = ccFactorial(n);
      const q = `${n} different books are arranged in a row on a shelf. How many different orders are possible?`;
      const candidates = [n * (n - 1), n * n, ccFactorial(n - 1), correct / n, correct + n, correct - n];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      const stepParts = [];
      for (let i = n; i >= 1; i--) stepParts.push(i);
      return {
        q,
        options,
        correctIndex,
        hint: "Count how many books could go first, then how many could go next, and so on, multiplying as you go.",
        solution: {
          scenario: "Arranging books in a row.",
          idea: "Each position in the row removes one book from the choices available for the next position.",
          steps: [
            `There are ${n} choices for the first position.`,
            `Once that book is placed, ${n - 1} choices remain for the second position.`,
            `Continuing this way: ${stepParts.join(" × ")} = ${correct}.`,
          ],
          check: `${n}! = ${correct}.`,
        },
      };
    },
  },

  combinations_pairs: {
    difficulties: [2, 3],
    build(d) {
      const n = d === 2 ? rand(4, 5) : rand(5, 7);
      const correct = (n * (n - 1)) / 2;
      const q = `There are ${n} friends at a park, and exactly 2 of them are needed to go and buy ice creams. How many different pairs of friends could be chosen (the order they're picked in doesn't matter)?`;
      const candidates = [n * (n - 1), n - 1, correct + 1, correct - 1, n * n];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: "Count ordered pairs first (first friend, second friend), then divide by 2 because the order within a pair doesn't matter.",
        solution: {
          scenario: "Choosing a pair of friends.",
          idea: "If order mattered there would be n × (n minus 1) ways, but each pair gets counted twice, so divide by 2.",
          steps: [
            `Ordered choices: ${n} × ${n - 1} = ${n * (n - 1)}.`,
            `Each pair of friends has been counted twice (e.g. Sam-then-Alex and Alex-then-Sam are the same pair).`,
            `Divide by 2: ${n * (n - 1)} ÷ 2 = ${correct}.`,
          ],
          check: `${n} × ${n - 1} ÷ 2 = ${correct}.`,
        },
      };
    },
  },

  different_totals_dice: {
    difficulties: [2, 3],
    build(d) {
      const pairs = d === 2 ? [[4, 6], [6, 6], [4, 4]] : [[6, 8], [4, 8], [6, 6], [8, 8]];
      const [a, b] = pick(pairs);
      const correct = a + b - 1;
      const q = a === b
        ? `Two fair ${a}-sided dice (numbered 1 to ${a}) are rolled together and their scores added. How many DIFFERENT possible totals are there (not how many ways to make them)?`
        : `A fair ${a}-sided dice and a fair ${b}-sided dice (numbered 1 to ${a} and 1 to ${b}) are rolled together and their scores added. How many DIFFERENT possible totals are there (not how many ways to make them)?`;
      const candidates = [a * b, a + b, Math.abs(a - b) + 1, correct + 1, correct - 1];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: "This asks how many different totals are possible, not how many ways to make each total. Find the smallest and largest totals and count everything in between.",
        solution: {
          scenario: "Counting the possible totals, not the possible ways.",
          idea: "The totals run consecutively from the smallest possible to the largest possible, so count every whole number in that range.",
          steps: [
            `Smallest possible total: 1 + 1 = 2.`,
            `Largest possible total: ${a} + ${b} = ${a + b}.`,
            `Every whole number from 2 to ${a + b} can actually be made, so there are ${a + b} − 2 + 1 = ${correct} different totals.`,
          ],
          check: `Note ${a * b} would be the number of ways to roll the dice, which is a different question from the number of different totals (${correct}).`,
        },
      };
    },
  },

  systematic_listing_constrained: {
    difficulties: [2, 3],
    build(d) {
      const { digits, cap } = pick(CC_DIGIT_CAP_CASES);
      const k = digits.length;
      const firstDigits = digits.filter((x) => x < cap);
      if (firstDigits.length < 1 || firstDigits.length >= k) return null;
      const correct = firstDigits.length * (k - 1) * (k - 2);
      const digitList = digits.join(", ");
      const threshold = cap * 100;
      const q = `Using each of the digits ${digitList} at most once, how many 3-digit numbers less than ${threshold} can be made?`;
      const candidates = [k * (k - 1) * (k - 2), correct + (k - 1) * (k - 2), Math.max(0, correct - (k - 1) * (k - 2)), firstDigits.length * k * (k - 1), correct + 1, correct - 1];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: `First work out which digits are small enough to go in the hundreds place (they must be less than ${cap}), then count the choices for the other two places.`,
        solution: {
          scenario: `3-digit numbers under ${threshold} from the digits ${digitList}.`,
          idea: "Fix the hundreds digit first, since that decides whether the number is small enough, then count the remaining choices for the other two places.",
          steps: [
            `Digits less than ${cap} that could go in the hundreds place: ${firstDigits.join(", ")}; that's ${firstDigits.length} choice(s).`,
            `Once the hundreds digit is used, ${k - 1} digits remain for the tens place.`,
            `Once that's used, ${k - 2} digits remain for the units place.`,
            `Total = ${firstDigits.length} × ${k - 1} × ${k - 2} = ${correct}.`,
          ],
          check: `${firstDigits.length} × ${k - 1} × ${k - 2} = ${correct}.`,
        },
      };
    },
  },

  counting_squares_grid: {
    difficulties: [2, 3],
    build(d) {
      const n = d === 2 ? rand(2, 3) : rand(3, 4);
      const sizeCounts = [];
      for (let k = 1; k <= n; k++) {
        const side = n - k + 1;
        sizeCounts.push({ k, side, count: side * side });
      }
      const correct = sizeCounts.reduce((s, x) => s + x.count, 0);
      const q = `A square grid is drawn with ${n} × ${n} small unit squares (like graph paper). Counting squares of ALL sizes (1×1, 2×2, and so on, all the way up to ${n}×${n}), how many squares are there in total?`;
      const candidates = [n * n, n * n + n, correct + 1, correct - 1, n * (n + 1), Math.round((n * (n + 1) * (2 * n + 1)) / 6)];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      const breakdown = sizeCounts.map((s) => `${s.k}×${s.k} squares: ${s.side}×${s.side} = ${s.count}`);
      const sumLine = sizeCounts.map((s) => s.count).join(" + ");
      return {
        q,
        options,
        correctIndex,
        hint: "Count the squares size by size: how many 1×1 squares, how many 2×2, and so on, then add them all up.",
        solution: {
          scenario: `Counting every square in a ${n}×${n} grid.`,
          idea: "A grid of side n has (n minus k plus 1) squared squares of size k×k for each size k from 1 up to n; add these up.",
          steps: [...breakdown, `Total = ${sumLine} = ${correct}.`],
          check: `Adding the count for each square size gives ${correct}.`,
        },
      };
    },
  },

  route_counting_grid: {
    difficulties: [3, 4],
    build(d) {
      const m = d === 3 ? rand(2, 3) : rand(3, 4);
      const n = d === 3 ? rand(2, 3) : rand(3, 5);
      const correct = ccNCr(m + n, m);
      const q = `A grid of streets is ${m} blocks across and ${n} blocks down. Moving only right or down along the streets, how many different routes are there from the top-left corner to the bottom-right corner?`;
      const candidates = [ccFactorial(m) * ccFactorial(n), (m + n) * (m + n - 1), correct + 1, correct - 1, m * n, ccNCr(m + n, m - 1)];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: "Every route needs the same total number of 'right' and 'down' moves; count how many different orders those moves can be arranged in.",
        solution: {
          scenario: `Routes across a ${m}×${n} block grid.`,
          idea: "Every route is a sequence of moves: R (right) and D (down). There are always the same total number of moves; only their order changes.",
          steps: [
            `Every route uses exactly ${m} 'right' moves and ${n} 'down' moves: ${m + n} moves in total.`,
            `The number of different routes is the number of ways to choose which ${m} of those ${m + n} moves are 'right' (the rest are 'down').`,
            `This is ${m + n} choose ${m} = ${correct}.`,
          ],
          check: `Building up the route counts junction by junction (each junction's count is the sum of the count above it and to its left, as in Pascal's triangle) also gives ${correct} at the bottom-right corner.`,
        },
      };
    },
  },

  digit_numbers_permutation: {
    difficulties: [3, 4],
    build(d) {
      const len = d === 3 ? 2 : 3;
      const k = rand(4, 6);
      const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k).sort((a, b) => a - b);
      const correct = ccNPr(k, len);
      const digitList = digits.join(", ");
      const q = `Using the digits ${digitList}, each at most once, how many different ${len}-digit numbers can be made?`;
      const candidates = [Math.pow(k, len), ccFactorial(k), correct + k, correct - k, k * k];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      const stepParts = [];
      for (let i = 0; i < len; i++) stepParts.push(k - i);
      const placeSteps = [`First digit: ${k} choices.`];
      if (len >= 2) placeSteps.push(`Second digit: ${k - 1} choices remain (it can't repeat the first).`);
      if (len >= 3) placeSteps.push(`Third digit: ${k - 2} choices remain.`);
      return {
        q,
        options,
        correctIndex,
        hint: "Count the choices for the first digit, then the choices for the next digit (one fewer, since it can't repeat), and so on.",
        solution: {
          scenario: `Building ${len}-digit numbers from ${k} digits with no repeats.`,
          idea: "Each digit used removes one option from the digits still available for the next place.",
          steps: [...placeSteps, `Total = ${stepParts.join(" × ")} = ${correct}.`],
          check: `${stepParts.join(" × ")} = ${correct}.`,
        },
      };
    },
  },

  combinations_choose3: {
    difficulties: [3, 4],
    build(d) {
      const n = d === 3 ? rand(5, 6) : rand(6, 8);
      const correct = ccNCr(n, 3);
      const ordered = ccNPr(n, 3);
      const q = `A club has ${n} members, and exactly 3 of them are needed to form a quiz team (the order they're chosen in doesn't matter). How many different teams of 3 could be chosen?`;
      const candidates = [ordered, correct + 1, correct - 1, n * n * n, ccNCr(n, 2)];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: "Count ordered picks of 3 members first, then divide by the number of ways to reorder a group of 3, since order doesn't matter for a team.",
        solution: {
          scenario: `Choosing a quiz team of 3 from ${n} members.`,
          idea: "If order mattered, count ordered picks; then divide by 3! = 6, because every team of 3 gets counted 6 times, once for each order it could be picked in.",
          steps: [
            `Ordered picks: ${n} × ${n - 1} × ${n - 2} = ${ordered}.`,
            `Each team of 3 people can be picked in 3! = 6 different orders.`,
            `Number of teams = ${ordered} ÷ 6 = ${correct}.`,
          ],
          check: `${ordered} ÷ 6 = ${correct}.`,
        },
      };
    },
  },

  handshakes_classic: {
    difficulties: [3, 4],
    build(d) {
      const n = d === 3 ? rand(5, 7) : rand(7, 9);
      const correct = (n * (n - 1)) / 2;
      const q = `${n} people go to a party. Everyone shakes hands with everyone else exactly once. How many handshakes take place in total?`;
      const candidates = [n * (n - 1), n, correct + 1, correct - 1, n * n];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: "This is the same idea as choosing pairs: work out ordered handshakes, then divide by 2 since each handshake is shared between two people.",
        solution: {
          scenario: `${n} people all shaking hands once each.`,
          idea: "Each handshake involves choosing 2 people out of the group, and order doesn't matter (you shaking my hand is the same handshake as me shaking yours).",
          steps: [
            `Each of the ${n} people shakes hands with the other ${n - 1} people: ${n} × ${n - 1} = ${n * (n - 1)} handshakes counted this way.`,
            `But each handshake has been counted twice, once from each person's point of view.`,
            `Divide by 2: ${n * (n - 1)} ÷ 2 = ${correct}.`,
          ],
          check: `This is the same calculation as choosing 2 people from ${n}: ${correct}.`,
        },
      };
    },
  },

  multistage_mult_minus_forbidden: {
    difficulties: [3, 4],
    build(d) {
      const a = d === 3 ? rand(3, 4) : rand(4, 5);
      const b = d === 3 ? rand(3, 4) : rand(4, 5);
      const forbidden = d === 3 ? 1 : rand(1, 2);
      const total = a * b;
      if (forbidden >= total) return null;
      const correct = total - forbidden;
      const q = `A shop sells ${a} different coats and ${b} different scarves. Normally any coat can be worn with any scarf, but ${forbidden} particular coat-and-scarf combination${forbidden > 1 ? "s clash" : " clashes"} and ${forbidden > 1 ? "are" : "is"} never worn together. How many coat-and-scarf outfits are actually possible?`;
      const candidates = [total, total + forbidden, a * b - a, a * b - b, correct + 1, correct - 1];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: "First count ALL possible combinations using the multiplication principle, then subtract the ones that are ruled out.",
        solution: {
          scenario: "Counting outfits with one combination ruled out.",
          idea: "Count every possible combination first, then take away the forbidden ones.",
          steps: [
            `All possible combinations: ${a} × ${b} = ${total}.`,
            `Take away the ${forbidden} clashing combination${forbidden > 1 ? "s" : ""}: ${total} − ${forbidden} = ${correct}.`,
          ],
          check: `${total} − ${forbidden} = ${correct}.`,
        },
      };
    },
  },

  arrangement_with_restriction: {
    difficulties: [3, 4],
    build(d) {
      const n = d === 3 ? rand(4, 5) : rand(5, 6);
      const total = ccFactorial(n);
      const together = 2 * ccFactorial(n - 1);
      const correct = total - together;
      const q = `${n} different books, including two particular favourites, are arranged in a row on a shelf. How many arrangements are there in which the two favourites are NOT standing next to each other?`;
      const candidates = [total, together, total + together, correct + 1, correct - 1, ccFactorial(n - 1)];
      const { options, correctIndex } = buildMC(correct, ccMakeDistractors(correct, candidates));
      return {
        q,
        options,
        correctIndex,
        hint: "Count all arrangements, then count and subtract the arrangements where the two favourites ARE next to each other.",
        solution: {
          scenario: "Keeping two particular books apart in a row.",
          idea: "It's easier to count the arrangements where the two books ARE together and subtract those from the total, than to count 'not together' directly.",
          steps: [
            `All arrangements of ${n} books: ${n}! = ${total}.`,
            `To count arrangements where the two favourites ARE together, stick them together as one block: this leaves ${n - 1} items to arrange, in ${n - 1}! = ${ccFactorial(n - 1)} ways, and the two books can swap places within their block in 2 ways: 2 × ${ccFactorial(n - 1)} = ${together}.`,
            `Arrangements where they are NOT together = ${total} − ${together} = ${correct}.`,
          ],
          check: `${total} − ${together} = ${correct}.`,
        },
      };
    },
  },
};
// Structure registry for spatialPuzzles (a stretch topic, gated to mock level 7+). Covers
// paper folding/cutting mirror prediction, repeating tile pattern completion, faces/edges/
// vertices recall plus Euler-rule lookups, cube-net identification and a spot-the-invalid-net
// variant (both backed by a genuine 3D fold simulator, not memorised shapes), unit-cube
// counting (simple, n×n×n, and with a bite/layer removed), hidden/visible face counting,
// combined-solid face counting, a maze shortest-path puzzle, front/side view of stacked
// cubes, rotation-vs-reflection recognition (flag and die-corner variants), a rectangle
// corner-cut area partition, and the classic painted-cube face-count problem. The maze and
// stacked-cube-view structures render as SVG grids (rather than newline-joined ASCII text)
// because the Practice UI answer buttons have no white-space:pre styling and would collapse
// literal newlines; net_not_valid's options use a " / " row separator for the same reason.
// structures_spatialPuzzles.js — standalone structure registry for the "spatialPuzzles"
// KS2 stretch topic (Primary/Ninefold Orchard module). CommonJS for standalone verification;
// real integration into generators/primary-generators.js (ES modules) done separately.

/* ---------------- local helpers used only by these structures ------------------------------ */

// Grow a random connected polyomino of exactly `n` cells (2D), starting at (0,0).
function SPZ_randomPolyomino(n, maxTries = 60) {
  for (let attempt = 0; attempt < maxTries; attempt++) {
    const cells = [[0, 0]];
    const key = (r, c) => r + "," + c;
    const occupied = new Set([key(0, 0)]);
    let ok = true;
    for (let i = 1; i < n; i++) {
      // candidate frontier cells: empty neighbours of any placed cell
      const frontier = [];
      for (const [r, c] of cells) {
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nr = r + dr, nc = c + dc;
          if (!occupied.has(key(nr, nc))) frontier.push([nr, nc]);
        }
      }
      if (!frontier.length) { ok = false; break; }
      const [nr, nc] = pick(frontier);
      cells.push([nr, nc]);
      occupied.add(key(nr, nc));
    }
    if (ok && cells.length === n) return SPZ_normalisePoly(cells);
  }
  return null;
}
function SPZ_normalisePoly(cells) {
  const minR = Math.min(...cells.map(c => c[0]));
  const minC = Math.min(...cells.map(c => c[1]));
  return cells.map(([r, c]) => [r - minR, c - minC]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
function SPZ_polyKey(cells) { return SPZ_normalisePoly(cells).map(c => c.join(",")).join(";"); }

// Render a polyomino as a compact ASCII grid string (rows joined by \n): 'X' filled, '.' empty.
function SPZ_polyToAscii(cells) {
  const maxR = Math.max(...cells.map(c => c[0]));
  const maxC = Math.max(...cells.map(c => c[1]));
  const filled = new Set(cells.map(c => c.join(",")));
  const rows = [];
  for (let r = 0; r <= maxR; r++) {
    let row = "";
    for (let c = 0; c <= maxC; c++) row += filled.has(r + "," + c) ? "X" : ".";
    rows.push(row);
  }
  return rows.join("\n");
}

// Same layout as SPZ_polyToAscii but joined with " / " instead of a real newline, so the result
// survives being placed inside a plain-text multiple-choice option (the Practice UI's answer
// buttons render option text with no `white-space: pre` styling, so a literal "\n" collapses
// to nothing visually and destroys the grid's row structure).
function SPZ_polyToInlineAscii(cells) {
  return SPZ_polyToAscii(cells).split("\n").join(" / ");
}

// Simulate folding a hexomino (6-cell polyomino, given as [row,col] cells) into a cube.
// Returns the map from cell-key -> outward face-normal ("+x","-x","+y","-y","+z","-z") if the
// net folds into a valid cube (bijection onto the 6 faces, consistent under revisits), else null.
// This is a genuine 3D fold simulation (rolling-die style frame propagation), not a memorised
// shape lookup, so it also correctly rejects nets with holes, overlaps or six-in-a-row etc.
function SPZ_foldNetToNormals(cells) {
  if (cells.length !== 6) return null;
  const key = (r, c) => r + "," + c;
  const cellSet = new Map(cells.map(([r, c]) => [key(r, c), true]));
  const start = cells[0];
  const startKey = key(start[0], start[1]);
  // frame: normal = outward face vector, right/up = in-plane axes, all in 3D
  const frames = new Map();
  frames.set(startKey, { normal: [0, 0, 1], right: [1, 0, 0], up: [0, 1, 0] });
  const visited = new Set([startKey]);
  const queue = [start];
  const vecStr = (v) => v.join(",");
  const usedNormals = new Map(); // vecStr(normal) -> cellKey (first assignment)
  usedNormals.set(vecStr([0, 0, 1]), startKey);
  while (queue.length) {
    const [r, c] = queue.shift();
    const k = key(r, c);
    const frame = frames.get(k);
    const neighbours = [
      { pos: [r, c + 1], dir: "E" }, { pos: [r, c - 1], dir: "W" },
      { pos: [r - 1, c], dir: "N" }, { pos: [r + 1, c], dir: "S" },
    ];
    for (const { pos, dir } of neighbours) {
      const [nr, nc] = pos;
      const nk = key(nr, nc);
      if (!cellSet.has(nk)) continue;
      let newFrame;
      const { normal, right, up } = frame;
      const neg = (v) => v.map(x => -x);
      if (dir === "E") newFrame = { normal: right, right: neg(normal), up };
      else if (dir === "W") newFrame = { normal: neg(right), right: normal, up };
      else if (dir === "N") newFrame = { normal: up, right, up: neg(normal) };
      else newFrame = { normal: neg(up), right, up: normal };
      if (visited.has(nk)) {
        // consistency check: revisiting via a different path must agree
        const existing = frames.get(nk);
        if (vecStr(existing.normal) !== vecStr(newFrame.normal)) return null;
        continue;
      }
      visited.add(nk);
      frames.set(nk, newFrame);
      const ns = vecStr(newFrame.normal);
      if (usedNormals.has(ns)) return null; // two net-squares fold onto the same cube face
      usedNormals.set(ns, nk);
      queue.push([nr, nc]);
    }
  }
  if (visited.size !== 6 || usedNormals.size !== 6) return null;
  return usedNormals;
}

function SPZ_generateValidCubeNet(maxTries = 200) {
  for (let i = 0; i < maxTries; i++) {
    const poly = SPZ_randomPolyomino(6);
    if (!poly) continue;
    if (SPZ_foldNetToNormals(poly)) return poly;
  }
  return null;
}
function SPZ_generateInvalidHexomino(maxTries = 200) {
  for (let i = 0; i < maxTries; i++) {
    const poly = SPZ_randomPolyomino(6);
    if (!poly) continue;
    if (!SPZ_foldNetToNormals(poly)) return poly;
  }
  return null;
}

// Render a net (list of [row,col] cells) as an SVG of small squares.
function SPZ_netSvg(cells) {
  const cell = 34;
  const maxR = Math.max(...cells.map(c => c[0]));
  const maxC = Math.max(...cells.map(c => c[1]));
  const w = (maxC + 1) * cell + 20, h = (maxR + 1) * cell + 20;
  let inner = "";
  for (const [r, c] of cells) {
    inner += SR(10 + c * cell, 10 + r * cell, cell, cell, "#2a1a5e", 2, "#e7dcff");
  }
  return svgBox(inner, w, h);
}

// Brute-force: count visible outer faces of a set of unit cubes placed at integer (x,y) grid
// positions, all resting in a single layer on a table (z = 0..1), nothing stacked on top.
function SPZ_countVisibleFacesFlat(cellsXY) {
  const set = new Set(cellsXY.map(([x, y]) => x + "," + y));
  let visible = 0;
  for (const [x, y] of cellsXY) {
    // top face: always visible (nothing stacked above in a flat layer)
    visible += 1;
    // bottom face: always hidden (resting on the table)
    // four side faces: hidden if a neighbouring cube occupies that side
    const sides = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of sides) if (!set.has(nx + "," + ny)) visible += 1;
  }
  return visible;
}

/* ============================================================================================
   STRUCTURE REGISTRY
   ============================================================================================ */

const SPATIAL_PUZZLES_STRUCTURES = {

  // ---------- d1-2: paper folding + cutting (mirror prediction) ----------
  paper_fold_cut: {
    difficulties: [1, 2],
    build(d) {
      const axes = d <= 1 ? ["v"] : ["v", "h"];
      const R = 2, C = d <= 1 ? pick([2, 3]) : 2;
      const cutR = rand(0, R - 1), cutC = rand(0, C - 1);
      const unfoldedCols = axes.includes("v") ? C * 2 : C;
      const colLetters = "ABCDEFGH".slice(0, unfoldedCols);
      const label = (r, c) => colLetters[c] + (r + 1);

      const rowIdxs = axes.includes("h") ? [cutR, 2 * R - 1 - cutR] : [cutR];
      const colIdxs = axes.includes("v") ? [cutC, 2 * C - 1 - cutC] : [cutC];
      const holesFor = (rIdxs, cIdxs) => {
        const s = [];
        for (const rr of rIdxs) for (const cc of cIdxs) s.push(label(rr, cc));
        return s.sort();
      };
      const fmtHoles = (h) => h.join(", ");
      const correctHoles = holesFor(rowIdxs, colIdxs);
      const correctStr = fmtHoles(correctHoles);

      const candidates = [];
      candidates.push(fmtHoles([label(cutR, cutC)])); // forgot to mirror at all
      if (axes.length === 2) {
        candidates.push(fmtHoles(holesFor([cutR], colIdxs))); // only mirrored left-right
        candidates.push(fmtHoles(holesFor(rowIdxs, [cutC]))); // only mirrored top-bottom
      }
      for (let rr = 0; rr < R && candidates.length < 10; rr++) {
        for (let cc = 0; cc < C && candidates.length < 10; cc++) {
          if (rr === cutR && cc === cutC) continue;
          const altRow = axes.includes("h") ? [rr, 2 * R - 1 - rr] : [rr];
          const altCol = axes.includes("v") ? [cc, 2 * C - 1 - cc] : [cc];
          candidates.push(fmtHoles(holesFor(altRow, altCol)));
        }
      }
      const distractors = [...new Set(candidates)].filter(c => c !== correctStr);
      if (distractors.length < 4) return null;
      const chosen = shuffle(distractors).slice(0, 4);
      const { options, correctIndex } = buildMCStr(correctStr, chosen);

      const cellPx = 36;
      let inner = "";
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
        const x = 20 + c * cellPx, y = 20 + r * cellPx;
        inner += SR(x, y, cellPx, cellPx, "#2a1a5e", 2, r === cutR && c === cutC ? "#ffd1c2" : "#fff");
        if (r === cutR && c === cutC) inner += ST(x + cellPx / 2, y + cellPx / 2 + 5, "✂", "middle", 18);
      }
      if (axes.includes("v")) inner += SL(20 + C * cellPx, 10, 20 + C * cellPx, 20 + R * cellPx + 10, "#ff6b4a", 2).replace("stroke-width=\"2\"", "stroke-width=\"2\" stroke-dasharray=\"4,4\"");
      if (axes.includes("h")) inner += SL(10, 20 + R * cellPx, 20 + C * cellPx + 10, 20 + R * cellPx, "#ff6b4a", 2).replace("stroke-width=\"2\"", "stroke-width=\"2\" stroke-dasharray=\"4,4\"");
      const svg = svgBox(inner, 20 + C * cellPx + 20, 20 + R * cellPx + 20);

      const foldWord = axes.length === 2 ? "folded in half twice (so it is folded into quarters)" : "folded in half";
      return {
        q: `A square of paper is ${foldWord}. While folded, a small triangle is snipped out of the corner shown by the scissors (at cell ${label(cutR, cutC)} using the grid on the FOLDED paper). When the paper is fully unfolded, which grid cells will have a hole?`,
        svg,
        options, correctIndex,
        hint: "Each fold creates a mirror line. A cut through several folded layers appears once on every layer, so it shows up as a hole reflected across every fold line, not just where the scissors actually touched.",
        solution: {
          scenario: `The paper was folded along ${axes.length === 2 ? "both a vertical and a horizontal line" : "one vertical line"}, then a hole was cut at the folded position ${label(cutR, cutC)}.`,
          idea: "Unfolding a cut made through folded paper reflects the hole across every fold line that was used.",
          steps: [
            `The cut is made at ${label(cutR, cutC)} on the folded paper.`,
            axes.length === 2
              ? `Reflecting across both fold lines gives ${correctHoles.length} holes in total: one in each quarter of the sheet.`
              : `Reflecting across the one fold line gives ${correctHoles.length} holes, one on each half of the sheet.`,
            `So the unfolded paper has holes at: ${correctStr}.`,
          ],
          check: "Count the holes: it should match 2 to the power of the number of folds.",
        },
      };
    },
  },

  // ---------- d1-2: repeating tile pattern completion ----------
  tile_pattern: {
    difficulties: [1, 2],
    build(d) {
      const u = d <= 1 ? 2 : 3;
      const palette = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Teal", "Pink"];
      const hex = { Red: "#ff4d6d", Blue: "#4d7dff", Green: "#2fc97a", Yellow: "#ffc93c", Purple: "#7c5cff", Orange: "#ff8a3c", Teal: "#22c8b8", Pink: "#ff5d8f" };
      const shuffledPalette = shuffle(palette);
      const k = u * u <= 4 ? rand(2, 3) : rand(3, 5); // distinct colours actually used in the unit
      const usedColours = shuffledPalette.slice(0, k);
      const outsidePool = shuffledPalette.slice(k);
      if (outsidePool.length < 1 || usedColours.length < 2) return null;

      // build a u x u unit, each cell a random used colour, retry until at least 2 distinct
      // colours actually appear (avoid a trivially blank single-colour "pattern")
      let unit;
      for (let tries = 0; tries < 10; tries++) {
        unit = Array.from({ length: u }, () => Array.from({ length: u }, () => pick(usedColours)));
        const distinctInUnit = new Set(unit.flat());
        if (distinctInUnit.size >= 2) break;
      }
      const gridSize = u * 2;
      const colourAt = (r, c) => unit[r % u][c % u];

      const missR = rand(0, gridSize - 1), missC = rand(0, gridSize - 1);
      const correct = colourAt(missR, missC);

      const inUnitAlternatives = [...new Set(unit.flat())].filter(col => col !== correct);
      const decoyPool = [...shuffle(inUnitAlternatives), ...shuffle(outsidePool)];
      const distractors = [...new Set(decoyPool)].filter(c => c !== correct).slice(0, 4);
      if (distractors.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correct, distractors);

      const cellPx = 32;
      let inner = "";
      for (let r = 0; r < gridSize; r++) for (let c = 0; c < gridSize; c++) {
        const x = 10 + c * cellPx, y = 10 + r * cellPx;
        if (r === missR && c === missC) {
          inner += SR(x, y, cellPx, cellPx, "#2a1a5e", 2, "#fff");
          inner += ST(x + cellPx / 2, y + cellPx / 2 + 6, "?", "middle", 20);
        } else {
          inner += SR(x, y, cellPx, cellPx, "#2a1a5e", 1, hex[colourAt(r, c)]);
        }
      }
      const svg = svgBox(inner, 20 + gridSize * cellPx, 20 + gridSize * cellPx);

      return {
        q: `This coloured grid repeats the same ${u}×${u} block of colours over and over. What colour should replace the "?" square?`,
        svg,
        options, correctIndex,
        hint: `Find the ${u}×${u} block that keeps repeating, then work out which cell of that block lines up with the missing square.`,
        solution: {
          scenario: `The grid is built from a repeating ${u}×${u} block of colours.`,
          idea: "A repeating pattern has a fixed block: to fill a missing cell, find where that cell sits inside the block by counting rows and columns modulo the block size.",
          steps: [
            `The missing square is in row ${missR + 1}, column ${missC + 1}.`,
            `Inside the repeating ${u}×${u} block, that position matches row ${(missR % u) + 1}, column ${(missC % u) + 1} of the block.`,
            `That block cell is coloured ${correct}.`,
          ],
        },
      };
    },
  },

  // ---------- d1-2: faces / edges / vertices recall (+ Euler relation at d2) ----------
  shape_fev: {
    difficulties: [1, 2],
    build(d) {
      const ALL_SHAPES = {
        cube: { F: 6, E: 12, V: 8 },
        cuboid: { F: 6, E: 12, V: 8 },
        tetrahedron: { F: 4, E: 6, V: 4 },
        "square-based pyramid": { F: 5, E: 8, V: 5 },
        "triangular prism": { F: 5, E: 9, V: 6 },
        "pentagonal prism": { F: 7, E: 15, V: 10 },
        "hexagonal prism": { F: 8, E: 18, V: 12 },
      };
      if (d <= 1 || pick([true, false])) {
        // direct recall
        const names = Object.keys(ALL_SHAPES);
        const shape = pick(names);
        const stats = ALL_SHAPES[shape];
        const prop = pick(["F", "E", "V"]);
        const propWord = { F: "faces", E: "edges", V: "vertices" }[prop];
        const correct = stats[prop];
        const otherVals = names.filter(n => n !== shape).map(n => ALL_SHAPES[n][prop]);
        const { options, correctIndex } = buildMC(correct, otherVals);
        return {
          q: `How many ${propWord} does a ${shape} have?`,
          options, correctIndex,
          hint: "Picture the shape and count carefully: faces are the flat (or curved) surfaces, edges are where two faces meet, vertices are the corner points.",
          solution: {
            scenario: `A ${shape} has ${stats.F} faces, ${stats.E} edges and ${stats.V} vertices.`,
            idea: "Count faces, edges and vertices directly from a mental picture (or model) of the shape.",
            steps: [`A ${shape} has ${correct} ${propWord}.`],
          },
        };
      }
      // d2: reverse lookup among shapes with genuinely distinct (F,E,V) triples, OR Euler relation
      if (pick([true, false])) {
        const distinctSet = { tetrahedron: ALL_SHAPES.tetrahedron, "square-based pyramid": ALL_SHAPES["square-based pyramid"], "triangular prism": ALL_SHAPES["triangular prism"], cube: ALL_SHAPES.cube, "pentagonal prism": ALL_SHAPES["pentagonal prism"], "hexagonal prism": ALL_SHAPES["hexagonal prism"] };
        const names = Object.keys(distinctSet);
        const shape = pick(names);
        const stats = distinctSet[shape];
        const distractorNames = shuffle(names.filter(n => n !== shape)).slice(0, 4);
        if (distractorNames.length < 4) return null;
        const { options, correctIndex } = buildMCStr(shape, distractorNames);
        return {
          q: `Which 3D shape has ${stats.F} faces, ${stats.E} edges and ${stats.V} vertices?`,
          options, correctIndex,
          hint: "Try matching the numbers to a shape you know well, or check Euler's rule (faces + vertices - edges = 2) for each candidate.",
          solution: {
            scenario: `We need F=${stats.F}, E=${stats.E}, V=${stats.V}.`,
            idea: "Compare the given face/edge/vertex counts against known shapes.",
            steps: [`A ${shape} has exactly ${stats.F} faces, ${stats.E} edges and ${stats.V} vertices.`, `Check: F + V - E = ${stats.F} + ${stats.V} - ${stats.E} = 2, which matches Euler's rule for any simple solid.`],
          },
        };
      } else {
        const names = Object.keys(ALL_SHAPES);
        const shape = pick(names);
        const stats = ALL_SHAPES[shape];
        const giveWhich = pick(["FV", "FE", "EV"]);
        let known1, known2, correct, missingWord, formula;
        if (giveWhich === "FV") { known1 = ["faces", stats.F]; known2 = ["vertices", stats.V]; correct = stats.F + stats.V - 2; missingWord = "edges"; formula = `edges = faces + vertices - 2 = ${stats.F} + ${stats.V} - 2`; }
        else if (giveWhich === "FE") { known1 = ["faces", stats.F]; known2 = ["edges", stats.E]; correct = stats.E - stats.F + 2; missingWord = "vertices"; formula = `vertices = edges - faces + 2 = ${stats.E} - ${stats.F} + 2`; }
        else { known1 = ["edges", stats.E]; known2 = ["vertices", stats.V]; correct = stats.E - stats.V + 2; missingWord = "faces"; formula = `faces = edges - vertices + 2 = ${stats.E} - ${stats.V} + 2`; }
        const distractors = [correct + 1, correct - 1, correct + 2, stats.F, stats.E, stats.V].filter(x => x !== correct && x > 0);
        const { options, correctIndex } = buildMC(correct, distractors);
        return {
          q: `A solid shape has ${known1[1]} ${known1[0]} and ${known2[1]} ${known2[0]}. Using Euler's rule (faces + vertices - edges = 2), how many ${missingWord} must it have?`,
          options, correctIndex,
          hint: "Rearrange Euler's rule (faces + vertices - edges = 2) to make the missing quantity the subject, then substitute the two you know.",
          solution: {
            scenario: `Euler's rule links faces, edges and vertices for any simple solid: faces + vertices - edges = 2.`,
            idea: "Substitute the two known values into Euler's rule and solve for the missing one.",
            steps: [formula, `= ${correct}`],
            check: `${missingWord} = ${correct} matches a real solid (a ${shape} has F=${stats.F}, E=${stats.E}, V=${stats.V}).`,
          },
        };
      }
    },
  },

  // ---------- d1-2: which shape does this net fold into ----------
  net_identify: {
    difficulties: [1, 2],
    build(d) {
      const poly = SPZ_generateValidCubeNet();
      if (!poly) return null;
      const svg = SPZ_netSvg(poly);
      const optionsNames = ["Cube", "Cuboid (rectangular box)", "Triangular prism", "Square-based pyramid", "Tetrahedron"];
      const { options, correctIndex } = buildMCStr("Cube", optionsNames.filter(n => n !== "Cube"));
      return {
        q: "Here is a flat net made of six squares. If you folded it up along the lines between the squares, which 3D shape would it make?",
        svg,
        options, correctIndex,
        hint: "Imagine folding each square upward along its edges until they meet. Six squares that fold up without gaps or overlaps always make the same familiar shape.",
        solution: {
          scenario: "The net is made of exactly six squares, joined edge to edge.",
          idea: "Six identical squares that fold up so every edge meets another edge exactly, with no gaps or overlaps, always fold into a cube.",
          steps: ["Fold each square up along the lines shown.", "Every square becomes one face of the solid.", "Six square faces meeting at right angles make a cube."],
        },
      };
    },
  },

  // ---------- d1-2: unit cubes in a simple (non-cubic) cuboid ----------
  cuboid_unit_cubes_simple: {
    difficulties: [1, 2],
    build(d) {
      let l, w, h;
      for (let tries = 0; tries < 10; tries++) {
        const max = d <= 1 ? 4 : 6;
        l = rand(2, max); w = rand(2, max); h = rand(2, max);
        if (!(l === w && w === h)) break; // must not be a cube
      }
      if (l === w && w === h) return null;
      const correct = l * w * h;
      const distractors = [l + w + h, l * w, l * h, w * h, (l + 1) * w * h, 2 * (l * w + w * h + h * l)];
      const { options, correctIndex } = buildMC(correct, distractors);
      const inner = SPZ_svgCuboidWireframe(l, w, h);
      return {
        q: `A cuboid is built from unit cubes, ${l} long, ${w} wide and ${h} high. How many unit cubes make up the whole cuboid?`,
        svg: inner,
        options, correctIndex,
        hint: "Multiply all three dimensions together: length × width × height.",
        solution: {
          scenario: `A ${l}×${w}×${h} cuboid built from unit cubes.`,
          idea: "The number of unit cubes in a cuboid is length × width × height.",
          steps: [`${l} × ${w} × ${h} = ${correct}`],
        },
      };
    },
  },

  // ---------- d2-3: hidden / visible faces of a flat arrangement of cubes ----------
  hidden_visible_faces: {
    difficulties: [2, 3],
    build(d) {
      const n = d <= 2 ? rand(3, 4) : rand(4, 6);
      let cells;
      if (d <= 2) {
        cells = Array.from({ length: n }, (_, i) => [i, 0]); // straight row
      } else {
        cells = SPZ_randomPolyomino(n);
        if (!cells) return null;
      }
      const total = 6 * n;
      const correct = SPZ_countVisibleFacesFlat(cells);
      const hidden = total - correct;
      const distractors = [total, total - n, correct + 2, correct - 2, 4 * n + 2, correct + 1];
      const { options, correctIndex } = buildMC(correct, distractors);
      const shapeWord = d <= 2 ? `a straight row of ${n} cubes` : `${n} cubes glued together in a flat arrangement`;
      return {
        q: `${n} unit cubes are glued together into ${shapeWord}, sitting flat on a table (no cube is stacked on another). How many of the small square faces can you see from OUTSIDE the shape (including the tops)?`,
        options, correctIndex,
        hint: "Every cube has 6 faces. The bottom face of every cube is hidden (on the table), and any face glued to a neighbouring cube is also hidden.",
        solution: {
          scenario: `${n} cubes, each with 6 faces, so ${total} faces in total before any gluing.`,
          idea: "Visible faces = total faces − faces on the table − faces glued to a neighbour.",
          steps: [
            `Total faces if the cubes were separate: 6 × ${n} = ${total}.`,
            `Each cube's bottom face touches the table and is hidden: ${n} faces hidden.`,
            `Every place two cubes touch hides one face on EACH cube (2 faces per join).`,
            `Visible faces = ${total} - ${hidden} = ${correct}.`,
          ],
        },
      };
    },
  },

  // ---------- d2-4: faces of a combined/stacked solid ----------
  combined_solid_faces: {
    difficulties: [2, 3, 4],
    build(d) {
      const SOLIDS = {
        cube: 6, cuboid: 6, cone: 2, cylinder: 3, "triangular prism": 5, "square-based pyramid": 5, tetrahedron: 4, hemisphere: 2,
      };
      const names = Object.keys(SOLIDS);
      const numSolids = d <= 3 ? 2 : 3;
      const chosen = [];
      const usedNames = new Set();
      for (let i = 0; i < numSolids; i++) {
        let nm;
        do { nm = pick(names); } while (usedNames.has(nm) && usedNames.size < names.length);
        usedNames.add(nm);
        chosen.push(nm);
      }
      const sum = chosen.reduce((a, nm) => a + SOLIDS[nm], 0);
      const junctions = numSolids - 1;
      const correct = sum - 2 * junctions;
      const distractors = [sum, sum - junctions, correct + 1, correct - 1, correct + 2];
      const { options, correctIndex } = buildMC(correct, distractors);
      const chain = chosen.join(" glued to a ");
      return {
        q: `A ${chain} are glued together, each flat face fully joined to the next so the shape forms one solid in a line. Counting a curved surface as one face, how many outer faces does the new combined solid have?`,
        options, correctIndex,
        hint: "Every place two solids are glued together hides one face from EACH solid, so subtract 2 faces for every join.",
        solution: {
          scenario: chosen.map(nm => `a ${nm} has ${SOLIDS[nm]} face${SOLIDS[nm] === 1 ? "" : "s"} (counting any curved surface as one face)`).join("; "),
          idea: "Add up all the faces of the separate solids, then subtract 2 faces for every glued join (one face disappears from each side of the join).",
          steps: [
            `Total faces before gluing: ${chosen.map(nm => SOLIDS[nm]).join(" + ")} = ${sum}.`,
            `Number of joins: ${junctions} (each hides 2 faces).`,
            `${sum} - 2 × ${junctions} = ${correct}.`,
          ],
        },
      };
    },
  },

  // ---------- d2 only: maze shortest path counting ----------
  maze_path: {
    difficulties: [2],
    build(d) {
      const size = 5;
      let grid, start, end, dist;
      for (let tries = 0; tries < 30; tries++) {
        grid = Array.from({ length: size }, () => Array.from({ length: size }, () => (Math.random() < 0.28 ? "#" : ".")));
        start = [0, 0]; end = [size - 1, size - 1];
        grid[start[0]][start[1]] = "."; grid[end[0]][end[1]] = ".";
        dist = SPZ_bfsGrid(grid, start, end);
        if (dist != null && dist >= 4) break;
        dist = null;
      }
      if (dist == null) return null;
      const correct = dist;
      const manhattan = Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);
      const distractors = [manhattan, correct + 1, correct - 1, correct + 2, correct + 1 + 1];
      const { options, correctIndex } = buildMC(correct, distractors);
      const svg = SPZ_mazeSvg(grid, start, end);
      return {
        q: `Here is a grid map (S = start, E = end, shaded squares are walls you cannot cross). Moving only up, down, left or right (not diagonally) between open squares, how many MOVES are in the shortest path from S to E?`,
        svg,
        options, correctIndex,
        hint: "Trace outward from S one step at a time, only through open squares, and find the fewest moves needed to reach E.",
        solution: {
          scenario: "A grid with some blocked squares, moving only up/down/left/right.",
          idea: "The shortest path avoids every wall and takes the fewest possible moves between open squares.",
          steps: [`Tracing the shortest route from S to E step by step gives a path of ${correct} moves.`],
          check: "Counting the straight-line (Manhattan) distance only gives the true shortest path when nothing is in the way; walls can force a longer route.",
        },
      };
    },
  },

  // ---------- d2-4: view from above -> front/side view (column/row maxima) ----------
  view_from_above: {
    difficulties: [2, 3, 4],
    build(d) {
      const rows = d <= 2 ? 2 : (d === 3 ? 2 : 3);
      const cols = d <= 2 ? 3 : (d === 3 ? 4 : 4);
      const maxH = d <= 2 ? 3 : 4;
      const heights = Array.from({ length: rows }, () => Array.from({ length: cols }, () => rand(1, maxH)));
      const viewIsFront = pick([true, false]);
      // front view: looking along the rows (depth), for each column take the max over rows
      const frontView = Array.from({ length: cols }, (_, c) => Math.max(...heights.map(row => row[c])));
      // side view: looking along the columns (width), for each row take the max over cols
      const sideView = Array.from({ length: rows }, (_, r) => Math.max(...heights[r]));
      const correctSeq = viewIsFront ? frontView : sideView;
      const otherSeq = viewIsFront ? sideView : frontView;
      const correct = correctSeq.join(", ");
      const candidates = new Set();
      candidates.add(otherSeq.join(", "));
      candidates.add([...correctSeq].reverse().join(", "));
      candidates.add(heights.map(row => row.reduce((a, b) => a + b, 0)).join(", "));
      candidates.add((viewIsFront ? Array.from({ length: cols }, (_, c) => heights.reduce((a, row) => a + row[c], 0)) : heights.map(row => row.reduce((a, b) => a + b, 0))).join(", "));
      const bumped = correctSeq.map((v, i) => (i === 0 ? v + 1 : v));
      candidates.add(bumped.join(", "));
      const distractors = [...candidates].filter(c => c !== correct);
      if (distractors.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correct, shuffle(distractors).slice(0, 4));

      const gridText = heights.map(row => row.join(" ")).join(", ");
      const svg = SPZ_heightsGridSvg(heights);
      const viewWord = viewIsFront ? "FRONT" : "SIDE";
      const lookDir = viewIsFront ? "looking at the grid from the bottom of the page upward (along the rows)" : "looking at the grid from the left side across (along the columns)";
      return {
        q: `A building is made of stacked unit cubes. The grid shown gives, for each position, how many cubes are stacked there (viewed from above). What would the ${viewWord} view look like: that is, the height you would see at each position ${viewIsFront ? "column" : "row"} by ${viewIsFront ? "column" : "row"}, ${lookDir}?`,
        svg,
        options, correctIndex,
        hint: `For each ${viewIsFront ? "column" : "row"}, the height you actually see from the ${viewWord.toLowerCase()} is the TALLEST stack in that ${viewIsFront ? "column" : "row"}: shorter stacks behind it are hidden.`,
        solution: {
          scenario: `Stack heights (rows = depth, columns = width), row by row: ${gridText}.`,
          idea: `Looking from the ${viewWord.toLowerCase()}, a shorter stack can be hidden behind a taller one in the same line of sight, so you only ever see the TALLEST stack in each ${viewIsFront ? "column" : "row"}.`,
          steps: viewIsFront
            ? Array.from({ length: cols }, (_, c) => `Column ${c + 1}: tallest stack is max(${heights.map(row => row[c]).join(", ")}) = ${frontView[c]}.`)
            : Array.from({ length: rows }, (_, r) => `Row ${r + 1}: tallest stack is max(${heights[r].join(", ")}) = ${sideView[r]}.`),
          check: `${viewWord} view: ${correct}.`,
        },
      };
    },
  },

  // ---------- d2-3: rotation vs reflection of a directional flag/arrow ----------
  rotation_reflection_flag: {
    difficulties: [2, 3],
    build(d) {
      const compass = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
      const transformNames = {
        r90: "Rotated 90° clockwise",
        r180: "Rotated 180°",
        r270: "Rotated 90° anticlockwise (270° clockwise)",
        fh: "Reflected left-right (flipped horizontally)",
        fv: "Reflected top-bottom (flipped vertically)",
      };
      const applyTransform = (angle, kind) => {
        if (kind === "r90") return (angle + 90) % 360;
        if (kind === "r180") return (angle + 180) % 360;
        if (kind === "r270") return (angle + 270) % 360;
        if (kind === "fh") return ((360 - angle) % 360 + 360) % 360; // mirror across vertical axis (N=0 fixed)
        if (kind === "fv") return ((180 - angle) % 360 + 360) % 360; // mirror across horizontal axis (E/W fixed)
      };
      const kinds = Object.keys(transformNames);
      // A collision between two WRONG transforms is harmless (the question only needs the
      // CHOSEN transform's result to be unmatched by any of the other four), so search for a
      // (start angle, chosen kind) pair where the chosen kind's result is unique among the 5.
      let startIdx, startAngle, results, chosenKind, chosenKindIdx, endAngle;
      let found = false;
      const order = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
      outer:
      for (const idx of order) {
        const angle = idx * 45;
        const res = kinds.map(k => applyTransform(angle, k));
        const uniqueIdxs = kinds.map((_, i) => i).filter(i => res.filter(v => v === res[i]).length === 1);
        if (uniqueIdxs.length) {
          startIdx = idx; startAngle = angle; results = res;
          chosenKindIdx = pick(uniqueIdxs);
          chosenKind = kinds[chosenKindIdx];
          endAngle = res[chosenKindIdx];
          found = true;
          break outer;
        }
      }
      if (!found) return null;
      const angleToCompass = (a) => compass[Math.round(a / 45) % 8];
      const startDir = compass[startIdx];
      const endDir = angleToCompass(endAngle);
      const distractorNames = kinds.filter(k => k !== chosenKind).map(k => transformNames[k]);
      const { options, correctIndex } = buildMCStr(transformNames[chosenKind], distractorNames);
      return {
        q: `A flag on a signpost points ${startDir}. After it is moved, it points ${endDir}. Which SINGLE transformation could have done this?`,
        options, correctIndex,
        hint: "Try each transformation on the starting direction in your head (or on a compass drawing) and see which one lands exactly on the ending direction.",
        solution: {
          scenario: `Flag starts pointing ${startDir} (${startAngle}° clockwise from North) and ends pointing ${endDir} (${endAngle}°).`,
          idea: "Rotations shift the compass direction by a fixed clockwise amount; reflections mirror it across an axis instead, which changes direction differently.",
          steps: [`${transformNames[chosenKind]} applied to ${startDir} gives ${endDir}.`],
          check: "Only one of the five transformations lands on the observed ending direction; check the others really do give a different result.",
        },
      };
    },
  },

  // ---------- d3-4: die-corner rotation vs reflection ----------
  rotation_reflection_die: {
    difficulties: [3, 4],
    build(d) {
      const nums = shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3);
      const [a, b, c] = nums;
      const rotations = [[a, b, c], [b, c, a], [c, a, b]];
      const reflections = [[a, c, b], [c, b, a], [b, a, c]];
      const fmt = (t) => t.join(", ");
      const correctTriple = pick(rotations.slice(1)); // a genuine different-looking valid rotation
      const correct = fmt(correctTriple);
      const decoyNums = shuffle([1, 2, 3, 4, 5, 6].filter(n => !nums.includes(n)));
      const bogus = fmt([decoyNums[0], b, c]);
      const reflectionStrs = reflections.map(fmt);
      const distractors = [...reflectionStrs, bogus];
      const { options, correctIndex } = buildMCStr(correct, distractors);
      return {
        q: `Looking at one corner of a die, the three numbers around it read ${a}, ${b}, ${c} going CLOCKWISE. If you turn the die (without picking it up off that corner) so you view the same corner from a different side, which of these could you now see reading clockwise?`,
        options, correctIndex,
        hint: "Turning the die keeps the clockwise order the same, just starting from a different number. A reflection (mirror image) reverses the order to anticlockwise instead: that is never possible just by turning the die.",
        solution: {
          scenario: `Original clockwise reading: ${a}, ${b}, ${c}.`,
          idea: "Rotating a die corner only ever cycles the three numbers around (keeping the same clockwise order); it can never reverse the order into anticlockwise, which is what a mirror image would do.",
          steps: [`The valid rotations of ${a}, ${b}, ${c} are: ${rotations.map(fmt).join(" / ")}.`, `${correct} is one of these, so it is a genuine rotation.`],
          check: `The reversed-order triples ${reflectionStrs.join(" / ")} would need a reflection (mirror image), which turning the die cannot produce.`,
        },
      };
    },
  },

  // ---------- d3-4: rectangle cut into two pieces, find the valid area pair ----------
  area_partition: {
    difficulties: [3, 4],
    build(d) {
      const W = rand(6, d <= 3 ? 10 : 14), H = rand(6, d <= 3 ? 10 : 14);
      const w = rand(2, W - 2), h = rand(2, H - 2);
      const total = W * H;
      const piece1 = w * h;
      const piece2 = total - piece1;
      const correct = `${piece1} and ${piece2}`;
      const wrongTotal1 = W * h; // used wrong total basis (mixed up which side pairs with which)
      const wrongTotal2 = w * H;
      const distractors = new Set();
      distractors.add(`${piece1} and ${wrongTotal1 - piece1}`); // correct small piece, wrong total basis
      distractors.add(`${w + h} and ${total - (w + h)}`); // used perimeter-ish sum instead of area
      distractors.add(`${piece1} and ${total - piece1 + 4}`); // arithmetic slip, doesn't actually sum to total
      distractors.add(`${piece1 + 2} and ${piece2 - 2}`); // sums correctly but wrong split (plausible slip)
      distractors.add(`${wrongTotal2} and ${total - wrongTotal2}`);
      const cleaned = [...distractors].filter(s => s !== correct);
      if (cleaned.length < 4) return null;
      const { options, correctIndex } = buildMCStr(correct, shuffle(cleaned).slice(0, 4));
      const inner = SPZ_svgCornerCutRect(W, H, w, h);
      return {
        q: `A rectangle ${W} units by ${H} units has a smaller rectangle ${w} units by ${h} units cut from one corner, leaving an L-shaped piece. What are the areas of the two pieces (small piece, then the L-shaped piece)?`,
        svg: inner,
        options, correctIndex,
        hint: "Find the small piece's area first (its own length × width), then subtract that from the WHOLE original rectangle's area to get the L-shaped piece.",
        solution: {
          scenario: `Whole rectangle: ${W} × ${H} = ${total}. Small cut piece: ${w} × ${h} = ${piece1}.`,
          idea: "The two pieces must add back up to the area of the original whole rectangle.",
          steps: [`Small piece area = ${w} × ${h} = ${piece1}.`, `L-shaped piece area = ${total} - ${piece1} = ${piece2}.`, `Check: ${piece1} + ${piece2} = ${total}, the whole rectangle's area.`],
        },
      };
    },
  },

  // ---------- d3-4: unit cubes in n×n×n or l×w×h blocks ----------
  unit_cubes_nxnxn_lwh: {
    difficulties: [3, 4],
    build(d) {
      const isCube = pick([true, false]);
      let l, w, h;
      if (isCube) { const n = rand(3, d <= 3 ? 6 : 8); l = w = h = n; }
      else { const max = d <= 3 ? 8 : 10; l = rand(2, max); w = rand(2, max); h = rand(2, max); }
      const correct = l * w * h;
      const distractors = [l + w + h, l * w, 2 * (l * w + w * h + h * l), (l + 1) * w * h, l * w * h - Math.min(l, w, h)];
      const { options, correctIndex } = buildMC(correct, distractors);
      const dims = isCube ? `${l}×${l}×${l}` : `${l}×${w}×${h}`;
      return {
        q: `A large ${isCube ? "cube" : "cuboid"} is built from unit cubes, measuring ${dims}. How many unit cubes were used altogether?`,
        options, correctIndex,
        hint: "Multiply the three dimensions together.",
        solution: {
          scenario: `A ${dims} block built from unit cubes.`,
          idea: "Volume in unit cubes = length × width × height.",
          steps: [`${l} × ${w} × ${h} = ${correct}`],
        },
      };
    },
  },

  // ---------- d3-4: cubes with a bite / layer removed ----------
  cubes_bite_removed: {
    difficulties: [3, 4],
    build(d) {
      const variant = pick(["corner", "layer"]);
      const max = d <= 3 ? 6 : 8;
      const l = rand(3, max), w = rand(3, max), h = rand(3, max);
      const total = l * w * h;
      let removed, correct, desc;
      if (variant === "corner") {
        const a = rand(1, l - 1), b = rand(1, w - 1), c = rand(1, h - 1);
        removed = a * b * c;
        correct = total - removed;
        desc = `A ${l}×${w}×${h} block of unit cubes has a smaller ${a}×${b}×${c} block of cubes removed from one corner.`;
      } else {
        removed = l * w * 1;
        correct = total - removed;
        desc = `A ${l}×${w}×${h} block of unit cubes has its top layer (a ${l}×${w}×1 layer) completely removed.`;
      }
      const distractors = [total, correct + removed - 1, correct + 1, correct - 1, total - removed * 2];
      const { options, correctIndex } = buildMC(correct, distractors);
      return {
        q: `${desc} How many unit cubes remain?`,
        options, correctIndex,
        hint: "Work out the total number of cubes in the whole block, then subtract however many were taken away.",
        solution: {
          scenario: desc,
          idea: "Remaining cubes = whole block's cubes − removed cubes.",
          steps: [`Whole block: ${l} × ${w} × ${h} = ${total}.`, `Removed: ${removed}.`, `Remaining: ${total} - ${removed} = ${correct}.`],
        },
      };
    },
  },

  // ---------- d3-4: painted cube, count unit cubes with exactly k painted faces ----------
  painted_cube: {
    difficulties: [3, 4],
    build(d) {
      const n = d <= 3 ? rand(3, 4) : rand(3, 6);
      const k = pick(n >= 3 ? [0, 1, 2, 3] : [1, 2, 3]);
      // brute-force count directly by simulating the n x n x n grid
      let count = 0;
      for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) {
        const painted = (x === 0 || x === n - 1 ? 1 : 0) + (y === 0 || y === n - 1 ? 1 : 0) + (z === 0 || z === n - 1 ? 1 : 0);
        if (painted === k) count++;
      }
      const correct = count;
      const corners = 8;
      const edges = 12 * Math.max(0, n - 2);
      const faces = 6 * Math.max(0, n - 2) ** 2;
      const interior = Math.max(0, n - 2) ** 3;
      const others = [corners, edges, faces, interior].filter(v => v !== correct);
      const distractors = [...others, correct + n, correct - 1, correct + 1];
      const kWord = { 0: "no painted faces", 1: "exactly 1 painted face", 2: "exactly 2 painted faces", 3: "exactly 3 painted faces" }[k];
      const { options, correctIndex } = buildMC(correct, distractors);
      return {
        q: `A large cube is made from a ${n}×${n}×${n} arrangement of unit cubes. The whole outside of the large cube is painted, then it is taken apart into its ${n * n * n} unit cubes. How many of the small cubes have ${kWord}?`,
        options, correctIndex,
        hint: k === 3 ? "Cubes at the CORNERS of the big cube touch 3 outer faces." : k === 2 ? "Cubes along an EDGE (but not at a corner) of the big cube touch 2 outer faces." : k === 1 ? "Cubes in the middle of a FACE (not on any edge) touch just 1 outer face." : "Cubes completely BURIED inside, touching no outer face at all, have no paint.",
        solution: {
          scenario: `A ${n}×${n}×${n} cube, painted on the outside, cut into ${n * n * n} unit cubes.`,
          idea: "Classify every unit cube by how many of the big cube's outer faces it touches: corner cubes touch 3, edge cubes touch 2, face-centre cubes touch 1, and fully interior cubes touch 0.",
          steps: [
            `Corner cubes (3 painted faces): always 8.`,
            `Edge cubes (2 painted faces, not counting corners): 12 × (${n} - 2) = ${edges}.`,
            `Face-centre cubes (1 painted face): 6 × (${n} - 2)² = ${faces}.`,
            `Interior cubes (0 painted faces): (${n} - 2)³ = ${interior}.`,
            `So the number with ${kWord} is ${correct}.`,
          ],
          check: `${corners} + ${edges} + ${faces} + ${interior} = ${corners + edges + faces + interior}, which matches the total ${n * n * n} unit cubes.`,
        },
      };
    },
  },

  // ---------- d3-4: which of these is NOT a valid net for a cube ----------
  net_not_valid: {
    difficulties: [3, 4],
    build(d) {
      const validNets = [];
      const invalidNets = [];
      const seenValid = new Set();
      const seenInvalid = new Set();
      for (let i = 0; i < 400 && (validNets.length < 4 || invalidNets.length < 1); i++) {
        const poly = SPZ_randomPolyomino(6);
        if (!poly) continue;
        const k = SPZ_polyKey(poly);
        const valid = !!SPZ_foldNetToNormals(poly);
        if (valid && !seenValid.has(k) && validNets.length < 4) { seenValid.add(k); validNets.push(poly); }
        else if (!valid && !seenInvalid.has(k) && invalidNets.length < 1) { seenInvalid.add(k); invalidNets.push(poly); }
      }
      if (validNets.length < 4 || invalidNets.length < 1) return null;
      const invalid = invalidNets[0];
      const correctAscii = SPZ_polyToInlineAscii(invalid);
      const validAsciis = validNets.map(SPZ_polyToInlineAscii);
      const allAsciis = new Set([correctAscii, ...validAsciis]);
      if (allAsciis.size < 5) return null;
      const { options, correctIndex } = buildMCStr(correctAscii, validAsciis);
      return {
        q: `Each of these five nets is made of six squares. Four of them fold up into a cube. Which ONE does NOT fold into a cube (it will overlap or leave a gap when folded)?`,
        options, correctIndex,
        hint: "Try folding each net up in your head, one square at a time. Watch for two squares that would land on top of each other, or a face of the cube that would be left uncovered.",
        solution: {
          scenario: "Five candidate six-square nets.",
          idea: "A valid cube net folds so each of the six squares becomes exactly one face, with no overlaps and no faces left uncovered.",
          steps: ["Folding the odd one out causes two squares to fold onto the same face of the cube (or leaves a face uncovered), so it cannot make a proper cube.", "The other four each fold up cleanly into one face per square."],
        },
      };
    },
  },
};

function SPZ_svgCuboidWireframe(l, w, h) {
  // simple labelled isometric-ish box, purely illustrative (not to exact scale)
  const ox = 60, oy = 140, sx = 18, sy = 10, hUnit = 16;
  const front = [[ox, oy], [ox + w * sx, oy], [ox + w * sx, oy - h * hUnit], [ox, oy - h * hUnit]];
  const back = front.map(([x, y]) => [x + l * sy, y - l * sy]);
  let inner = "";
  const poly = (pts, fill) => `<polygon points="${pts.map(p => p.join(",")).join(" ")}" fill="${fill}" stroke="#2a1a5e" stroke-width="2"/>`;
  inner += poly([back[0], back[1], back[2], back[3]], "#e7dcff");
  inner += poly([front[0], front[1], back[1], back[0]], "#d6c6ff");
  inner += poly([front[1], front[2], back[2], back[1]], "#c8b6ff");
  inner += poly([front[0], front[1], front[2], front[3]], "#f0e8ff");
  inner += ST(ox + (w * sx) / 2, oy + 20, `length ${l}`, "middle", 13);
  inner += ST(ox - 30, oy - (h * hUnit) / 2, `height ${h}`, "middle", 13);
  inner += ST(ox + w * sx + l * sy / 2 + 10, oy - h * hUnit - l * sy / 2 - 6, `width ${w}`, "middle", 13);
  return svgBox(inner, 260, 200);
}
function SPZ_svgCornerCutRect(W, H, w, h) {
  const scale = Math.min(220 / W, 160 / H);
  const ox = 30, oy = 20;
  const bigW = W * scale, bigH = H * scale, cutW = w * scale, cutH = h * scale;
  let inner = "";
  inner += SR(ox, oy, bigW, bigH, "#2a1a5e", 2, "#f0e8ff");
  inner += SR(ox, oy, cutW, cutH, "#2a1a5e", 2, "#ffd1c2");
  inner += ST(ox + bigW / 2, oy + bigH + 22, `${W} × ${H}`, "middle", 13);
  inner += ST(ox + cutW / 2, oy + cutH / 2 + 5, `${w}×${h}`, "middle", 12);
  return svgBox(inner, ox + bigW + 40, oy + bigH + 40);
}

function SPZ_heightsGridSvg(heights) {
  const rows = heights.length, cols = heights[0].length;
  const cell = 44, pad = 8;
  let inner = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      inner += SR(pad + c * cell, pad + r * cell, cell, cell, "#2a1a5e", 1.5, "#f0e8ff");
      inner += ST(pad + c * cell + cell / 2, pad + r * cell + cell / 2 + 7, String(heights[r][c]), "middle", 20, "#2a1a5e", 800);
    }
  }
  return svgBox(inner, pad * 2 + cols * cell, pad * 2 + rows * cell);
}
function SPZ_mazeSvg(grid, start, end) {
  const size = grid.length;
  const cell = 34;
  const pad = 6;
  let inner = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isWall = grid[r][c] === "#";
      const isStart = r === start[0] && c === start[1];
      const isEnd = r === end[0] && c === end[1];
      const fill = isWall ? "#b9adcf" : "#f7f3ff";
      inner += SR(pad + c * cell, pad + r * cell, cell, cell, "#2a1a5e", 1.5, fill);
      if (isStart) inner += ST(pad + c * cell + cell / 2, pad + r * cell + cell / 2 + 6, "S", "middle", 18, "#1a8f5e", 800);
      else if (isEnd) inner += ST(pad + c * cell + cell / 2, pad + r * cell + cell / 2 + 6, "E", "middle", 18, "#c0392b", 800);
    }
  }
  return svgBox(inner, pad * 2 + size * cell, pad * 2 + size * cell);
}
function SPZ_bfsGrid(grid, start, end) {
  const size = grid.length;
  const key = (r, c) => r + "," + c;
  const visited = new Set([key(start[0], start[1])]);
  let frontier = [start];
  let dist = 0;
  while (frontier.length) {
    for (const [r, c] of frontier) if (r === end[0] && c === end[1]) return dist;
    const next = [];
    for (const [r, c] of frontier) {
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
        if (grid[nr][nc] === "#") continue;
        const k = key(nr, nc);
        if (visited.has(k)) continue;
        visited.add(k);
        next.push([nr, nc]);
      }
    }
    frontier = next;
    dist++;
  }
  return null;
}


// Structure registry for logicGrid (a stretch topic, gated to mock level 7+). Covers
// distinct deduction types rather than reskinned scenarios: 3-item matching via negative
// clues, elimination when 2 of 3 are known, row-of-3/4/5 positional deduction, always/
// sometimes/never and must-be-true single-clue reasoning, a truth/contradiction spotter,
// circular seating neighbours, a 2x2 grid, chained pairwise comparisons, a pattern-misfit
// spotter, simultaneous numeric constraints, a full 4-item linked two-attribute grid, basic
// syllogism/quantifier reasoning, a 3-clue deduction chain, and a meta "which extra clue
// resolves this" reasoning structure. Every puzzle is verified to have a UNIQUE solution by
// brute-force search over every candidate assignment/ordering before being returned.
/* ---------------------------------------------------------------------
 * Small combinatorics utilities used inside build() for brute-force
 * uniqueness checking. These are NOT part of the production helper set;
 * they are private to this topic's structures.
 * ------------------------------------------------------------------- */

function LG_permutations(arr) {
  if (arr.length <= 1) return [arr.slice()];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of LG_permutations(rest)) result.push([arr[i], ...p]);
  }
  return result;
}

function LG_range(n) { return Array.from({ length: n }, (_, i) => i); }

function LG_singularOf(word) {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('s')) return word.slice(0, -1);
  return word;
}
function LG_articleFor(word) { return /^[aeiou]/i.test(word) ? 'an' : 'a'; }

/* ---------------------------------------------------------------------
 * Entity pools
 * ------------------------------------------------------------------- */

const LG_NAMES = ['Amir', 'Bea', 'Chen', 'Dee', 'Ewan', 'Farah', 'Gita', 'Hal', 'Ida', 'Jon', 'Kira', 'Leo'];
const LG_COLOURS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const LG_PETS = ['cat', 'dog', 'rabbit', 'hamster', 'fish', 'parrot'];
const LG_TOYS = ['kite', 'ball', 'yo-yo', 'top', 'drum', 'kazoo'];
const LG_DRINKS = ['juice', 'milk', 'water', 'squash', 'tea'];
const LG_FRUITS = ['apple', 'pear', 'plum', 'mango', 'kiwi', 'banana'];

function LG_namesFrom(n) { return shuffle(LG_NAMES).slice(0, n); }
function LG_freshNames(exclude, n) {
  return shuffle(LG_NAMES.filter((x) => !exclude.includes(x))).slice(0, n);
}

/* ======================================================================
 * STRUCTURE REGISTRY
 * ==================================================================== */

const LOGIC_GRID_STRUCTURES = {

  /* ---------- Difficulty 1-2 ---------- */

  three_negative_clues: {
    difficulties: [1, 2],
    build(d) {
      const names = LG_namesFrom(3);
      const petPool = shuffle(LG_PETS);
      const items = petPool.slice(0, 3);
      const extraPool = petPool.slice(3);
      const perms = LG_permutations([0, 1, 2]);

      for (let attempt = 0; attempt < 40; attempt++) {
        const truth = pick(perms);
        const candidates = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (truth[i] === j) {
              candidates.push({ text: `${names[i]} has the ${items[j]}.`, positive: true, person: i, item: j });
            } else {
              candidates.push({ text: `${names[i]} does not have the ${items[j]}.`, positive: false, person: i, item: j });
            }
          }
        }
        const wantPositive = d === 1 ? 1 : 0;
        const positives = shuffle(candidates.filter((c) => c.positive));
        const negatives = shuffle(candidates.filter((c) => !c.positive));
        const numNeg = d === 1 ? 2 : 3;
        const chosen = shuffle([...positives.slice(0, wantPositive), ...negatives.slice(0, numNeg)]);
        if (chosen.length < wantPositive + numNeg) continue;

        const consistent = perms.filter((p) => chosen.every((c) => (c.positive ? p[c.person] === c.item : p[c.person] !== c.item)));
        if (consistent.length === 1 && consistent[0].join(',') === truth.join(',')) {
          const askPerson = rand(0, 2);
          const correct = items[truth[askPerson]];
          const others = items.filter((_, idx) => idx !== truth[askPerson]);
          const { options, correctIndex } = buildMCStr(correct, [...others, ...extraPool].slice(0, 4));
          return {
            q: `${names[0]}, ${names[1]} and ${names[2]} each have a different pet: a ${items[0]}, a ${items[1]} and a ${items[2]}.\n${chosen.map((c) => c.text).join(' ')}\nWhat pet does ${names[askPerson]} have?`,
            options,
            correctIndex,
            hint: 'Use each clue to cross out a pet for a person. Keep going until only one pet is left for each person.',
            solution: {
              idea: 'Every clue rules something out. Once enough is ruled out, only one arrangement fits all the clues at once.',
              steps: [
                `The three pets are: ${items.join(', ')}.`,
                ...chosen.map((c) => c.text),
                `Checking the clues together, the only arrangement that fits is: ${names.map((n, i) => `${n} has the ${items[truth[i]]}`).join(', ')}.`,
                `So ${names[askPerson]} has the ${correct}.`,
              ],
            },
          };
        }
      }
      return null;
    },
  },

  elimination_two_known: {
    difficulties: [1, 2],
    build() {
      const names = LG_namesFrom(3);
      const petPool = shuffle(LG_PETS);
      const pets = petPool.slice(0, 3);
      const extraPets = petPool.slice(3);
      const colourPool = shuffle(LG_COLOURS);
      const colours = colourPool.slice(0, 3);
      const extraColours = colourPool.slice(3);
      const petPerm = shuffle([0, 1, 2]);
      const colourPerm = shuffle([0, 1, 2]);
      const hiddenIdx = rand(0, 2);
      const known = [0, 1, 2].filter((i) => i !== hiddenIdx);
      const askAttr = pick(['pet', 'colour']);
      const lines = known.map((i) => `${names[i]} has the ${colours[colourPerm[i]]} ${pets[petPerm[i]]}.`);

      const usedPetIdx = known.map((i) => petPerm[i]);
      const usedColIdx = known.map((i) => colourPerm[i]);
      const remainingPetIdx = [0, 1, 2].filter((x) => !usedPetIdx.includes(x));
      const remainingColIdx = [0, 1, 2].filter((x) => !usedColIdx.includes(x));
      if (remainingPetIdx.length !== 1 || remainingColIdx.length !== 1) return null;
      if (remainingPetIdx[0] !== petPerm[hiddenIdx] || remainingColIdx[0] !== colourPerm[hiddenIdx]) return null;

      const correct = askAttr === 'pet' ? pets[petPerm[hiddenIdx]] : colours[colourPerm[hiddenIdx]];
      const otherVals = askAttr === 'pet'
        ? pets.filter((_, idx) => idx !== petPerm[hiddenIdx])
        : colours.filter((_, idx) => idx !== colourPerm[hiddenIdx]);
      const extra = askAttr === 'pet' ? extraPets : extraColours;
      const { options, correctIndex } = buildMCStr(correct, [...otherVals, ...extra].slice(0, 4));
      const usedWord = askAttr === 'pet'
        ? pets.filter((_, idx) => usedPetIdx.includes(idx)).join(' and ')
        : colours.filter((_, idx) => usedColIdx.includes(idx)).join(' and ');

      return {
        q: `${names[0]}, ${names[1]} and ${names[2]} each have a different pet and a different favourite colour, one each from: ${pets.join(', ')}; and ${colours.join(', ')}.\n${lines.join(' ')}\nWhat ${askAttr === 'pet' ? 'pet' : 'colour'} does ${names[hiddenIdx]} have?`,
        options,
        correctIndex,
        hint: `Cross off the ${askAttr}s already used by the other two; whatever is left over must belong to ${names[hiddenIdx]}.`,
        solution: {
          idea: `All three ${askAttr}s are used exactly once, so once two are used up the third person is forced by elimination.`,
          steps: [
            ...lines,
            `That accounts for ${usedWord}, leaving only ${correct} for ${names[hiddenIdx]}.`,
          ],
        },
      };
    },
  },

  row_of_three_position: {
    difficulties: [1, 2],
    build(d) {
      const names = LG_namesFrom(3);
      const posWord = ['left end', 'middle', 'right end'];
      const perms = LG_permutations([0, 1, 2]);

      for (let attempt = 0; attempt < 40; attempt++) {
        const truth = pick(perms);
        const byPos = [0, 0, 0];
        truth.forEach((p, i) => { byPos[p] = i; });

        const candidates = [];
        for (let i = 0; i < 3; i++) {
          candidates.push({ text: `${names[i]} is standing at the ${posWord[truth[i]]}.`, check: (p) => p[i] === truth[i], direct: true });
        }
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (i !== j && truth[j] === truth[i] + 1) {
              candidates.push({ text: `${names[i]} is standing immediately to the left of ${names[j]}.`, check: (p) => p[j] === p[i] + 1, direct: false });
            }
          }
        }
        for (let i = 0; i < 3; i++) {
          if (truth[i] !== 0) candidates.push({ text: `${names[i]} is not at the left end.`, check: (p) => p[i] !== 0, direct: false });
          if (truth[i] !== 2) candidates.push({ text: `${names[i]} is not at the right end.`, check: (p) => p[i] !== 2, direct: false });
        }

        let pool = d >= 2 ? candidates.filter((c) => !c.direct) : candidates;
        if (pool.length < 2) pool = candidates;
        const chosen = shuffle(pool).slice(0, 2);
        if (chosen.length < 2) continue;

        const consistent = perms.filter((p) => chosen.every((c) => c.check(p)));
        if (consistent.length === 1) {
          const askPos = rand(0, 2);
          const correct = names[byPos[askPos]];
          const otherInPuzzle = names.filter((n) => n !== correct);
          const decoyNames = LG_freshNames(names, 2);
          const { options, correctIndex } = buildMCStr(correct, [...otherInPuzzle, ...decoyNames].slice(0, 4));
          return {
            q: `${names[0]}, ${names[1]} and ${names[2]} are standing in a row of three.\n${chosen.map((c) => c.text).join(' ')}\nWho is standing at the ${posWord[askPos]}?`,
            options,
            correctIndex,
            hint: 'Draw three boxes for the row and fill in what each clue tells you, working from the ends inward.',
            solution: {
              idea: 'With only three spots, a couple of clues about ends and neighbours is enough to fix everyone\'s place.',
              steps: [
                ...chosen.map((c) => c.text),
                `Only one arrangement fits both clues: ${byPos.map((i) => names[i]).join(', ')} from left to right.`,
                `So ${correct} is at the ${posWord[askPos]}.`,
              ],
            },
          };
        }
      }
      return null;
    },
  },

  must_be_true_statement: {
    difficulties: [1, 2],
    build() {
      const category = pick(['owl', 'fox', 'badger', 'squirrel', 'hedgehog']);
      const place = pick(['Tambleweed Wood', 'the old orchard', 'Bramble Hollow', 'the tall hedge', 'the quiet meadow']);
      const attr = pick(['grey', 'ginger', 'silver', 'speckled', 'brown']);
      const otherAttr = pick(LG_COLOURS.concat(['spotted', 'striped']).filter((a) => a !== attr));
      const name = pick(LG_NAMES);

      const correct = `${name} is ${attr}.`;
      const decoys = [
        `${name} is not ${attr}.`,
        `Some ${category}s outside ${place} are ${attr}.`,
        `All ${attr} animals are ${category}s.`,
        `${name} does not live in ${place}.`,
        `${name} is ${otherAttr}.`,
      ];
      const { options, correctIndex } = buildMCStr(correct, shuffle(decoys).slice(0, 4));

      return {
        q: `All the ${category}s in ${place} are ${attr}.\n${name} is a ${category} living in ${place}.\nWhich statement must be true?`,
        options,
        correctIndex,
        hint: 'If every member of a group has a property, and someone belongs to that group, they must have the property too.',
        solution: {
          idea: `The first sentence tells us every ${category} in ${place} is ${attr}. The second sentence tells us ${name} is one of those ${category}s.`,
          steps: [
            `All ${category}s in ${place} are ${attr}.`,
            `${name} is a ${category} in ${place}.`,
            `So ${name} must be ${attr} too: "${correct}"`,
          ],
        },
      };
    },
  },

  truth_contradiction_two: {
    difficulties: [1, 2],
    build() {
      const [nameA, nameB] = LG_namesFrom(2);
      const thing = pick(['football', 'kite', 'lunchbox', 'bike', 'jumper']);
      const [colA, colB] = shuffle(LG_COLOURS).slice(0, 2);
      const trueColour = pick([colA, colB]);
      const otherColour = trueColour === colA ? colB : colA;
      const truthTeller = trueColour === colA ? nameA : nameB;
      const liar = truthTeller === nameA ? nameB : nameA;

      const { options, correctIndex } = buildMCStr(
        truthTeller,
        [liar, `Neither ${nameA} nor ${nameB}`, `Both ${nameA} and ${nameB}`, 'It cannot be worked out'],
      );

      return {
        q: `${nameA} says: "The ${thing} is ${colA}."\n${nameB} says: "The ${thing} is ${colB}."\nIn fact, the ${thing} is ${trueColour}.\nWho is telling the truth?`,
        options,
        correctIndex,
        hint: 'The two statements cannot both be right, since the thing cannot be two different colours. Match the known fact to one of the statements.',
        solution: {
          idea: 'Only one colour can be correct, so only one of the two statements can match reality.',
          steps: [
            `${nameA} claims it is ${colA}; ${nameB} claims it is ${colB}.`,
            `We are told it is really ${trueColour}.`,
            `That matches what ${truthTeller} said, so ${truthTeller} is telling the truth (and ${liar} is wrong, since it is not ${otherColour}).`,
          ],
        },
      };
    },
  },

  /* ---------- Difficulty 2-3 ---------- */

  row_position_n: {
    difficulties: [2, 3],
    build(d) {
      const n = d <= 2 ? 4 : 5;
      const names = LG_namesFrom(n);
      const posWord = ['1st', '2nd', '3rd', '4th', '5th'].slice(0, n);
      const base = LG_range(n);
      const perms = LG_permutations(base);

      for (let attempt = 0; attempt < 150; attempt++) {
        const truth = pick(perms);
        const byPos = new Array(n);
        truth.forEach((p, i) => { byPos[p] = i; });

        const candidates = [];
        for (let i = 0; i < n; i++) {
          candidates.push({ text: `${names[i]} finished ${posWord[truth[i]]}.`, check: (p) => p[i] === truth[i] });
        }
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (i !== j && truth[j] === truth[i] + 1) {
              candidates.push({ text: `${names[i]} finished immediately ahead of ${names[j]}.`, check: (p) => p[j] === p[i] + 1 });
            }
          }
        }
        for (let i = 0; i < n; i++) {
          for (let k = 0; k < n; k++) {
            if (k !== truth[i]) candidates.push({ text: `${names[i]} did not finish ${posWord[k]}.`, check: (p) => p[i] !== k });
          }
        }

        const numClues = n - 1;
        const chosen = shuffle(candidates).slice(0, numClues);
        const consistent = perms.filter((p) => chosen.every((c) => c.check(p)));
        if (consistent.length === 1) {
          const askPos = rand(0, n - 1);
          const correct = names[byPos[askPos]];
          const otherInPuzzle = names.filter((nm) => nm !== correct);
          const decoyNames = LG_freshNames(names, 4);
          const { options, correctIndex } = buildMCStr(correct, [...otherInPuzzle, ...decoyNames].slice(0, 4));
          return {
            q: `${names.join(', ')} took part in a race.\n${chosen.map((c) => c.text).join(' ')}\nWho finished ${posWord[askPos]}?`,
            options,
            correctIndex,
            hint: 'Sketch the finishing order as empty slots, then use the clues one at a time to fill them in.',
            solution: {
              idea: 'Combine the direct and comparative clues: each one narrows down the possible orders until only one is left.',
              steps: [
                ...chosen.map((c) => c.text),
                `Working through the clues together gives the order: ${byPos.map((i) => names[i]).join(', ')}.`,
                `So ${correct} finished ${posWord[askPos]}.`,
              ],
            },
          };
        }
      }
      return null;
    },
  },

  circular_seating_neighbours: {
    difficulties: [2, 3],
    build(d) {
      const n = d <= 2 ? 5 : 6;
      const names = LG_namesFrom(n);
      const askIdx = rand(0, n - 1);
      const leftIdx = (askIdx - 1 + n) % n;
      const rightIdx = (askIdx + 1) % n;
      const correctPair = [names[leftIdx], names[rightIdx]];
      const correctStr = `${correctPair[0]} and ${correctPair[1]}`;

      const decoys = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i === j || i === askIdx || j === askIdx) continue;
          const pairStr = `${names[i]} and ${names[j]}`;
          if (pairStr !== correctStr && pairStr !== `${names[j]} and ${names[i]}` && !decoys.includes(pairStr)) decoys.push(pairStr);
        }
      }

      const { options, correctIndex } = buildMCStr(correctStr, shuffle(decoys).slice(0, 4));

      return {
        q: `${names.join(', ')} are sitting round a circular table, in that order going clockwise (so after the last person comes the first person again).\nWho is sitting next to ${names[askIdx]}?`,
        options,
        correctIndex,
        hint: 'Draw a circle of names in the order given, then look at who sits on either side of the named person, remembering the table wraps around.',
        solution: {
          idea: 'On a circular table, the seating wraps around: the person after the last one listed is the first one again.',
          steps: [
            `Going clockwise: ${names.join(' -> ')} -> back to ${names[0]}.`,
            `The two people either side of ${names[askIdx]} are ${names[leftIdx]} and ${names[rightIdx]}.`,
          ],
        },
      };
    },
  },

  two_by_two_grid: {
    difficulties: [2, 3],
    build() {
      const names = LG_namesFrom(2);
      const pets = shuffle(LG_PETS).slice(0, 2);
      const colours = shuffle(LG_COLOURS).slice(0, 2);
      const combos = [];
      for (const petPerm of [[0, 1], [1, 0]]) {
        for (const colPerm of [[0, 1], [1, 0]]) combos.push({ petPerm, colPerm });
      }
      const truth = pick(combos);

      const clueOptionsPool = [
        { text: `${names[0]} does not have the ${pets[1 - truth.petPerm[0]]}.`, check: (c) => c.petPerm[0] !== (1 - truth.petPerm[0]) },
        { text: `${names[1]} does not have the ${pets[1 - truth.petPerm[1]]}.`, check: (c) => c.petPerm[1] !== (1 - truth.petPerm[1]) },
        { text: `${names[0]} has the ${pets[truth.petPerm[0]]}.`, check: (c) => c.petPerm[0] === truth.petPerm[0] },
        { text: `${names[1]} has the ${colours[truth.colPerm[1]]} pet.`, check: (c) => c.colPerm[1] === truth.colPerm[1] },
        { text: `${names[0]} does not have the ${colours[1 - truth.colPerm[0]]} pet.`, check: (c) => c.colPerm[0] !== (1 - truth.colPerm[0]) },
        { text: `The person with the ${pets[0]} has the ${colours[truth.colPerm[truth.petPerm.indexOf(0)]]} one.`, check: (c) => c.colPerm[c.petPerm.indexOf(0)] === truth.colPerm[truth.petPerm.indexOf(0)] },
      ];

      for (let attempt = 0; attempt < 30; attempt++) {
        const chosen = shuffle(clueOptionsPool).slice(0, 2);
        const consistent = combos.filter((c) => chosen.every((cl) => cl.check(c)));
        if (consistent.length === 1) {
          const askWho = rand(0, 1);
          const correct = colours[truth.colPerm[askWho]];
          const otherColour = colours[1 - truth.colPerm[askWho]];
          const extraColours = LG_COLOURS.filter((c) => !colours.includes(c));
          const { options, correctIndex } = buildMCStr(correct, [otherColour, ...shuffle(extraColours)].slice(0, 4));
          return {
            q: `${names[0]} and ${names[1]} each have a pet, one a ${pets[0]} and one a ${pets[1]}, and the pets are coloured ${colours[0]} and ${colours[1]} (one each).\n${chosen.map((c) => c.text).join(' ')}\nWhat colour is ${names[askWho]}'s pet?`,
            options,
            correctIndex,
            hint: 'There are only two people, two pets and two colours: work out the pet for each person first, then match up the colour.',
            solution: {
              idea: 'With only two options for each attribute, two well-chosen clues are enough to fix the whole grid.',
              steps: [
                ...chosen.map((c) => c.text),
                `Together these clues fix everything: ${names[0]} has the ${colours[truth.colPerm[0]]} ${pets[truth.petPerm[0]]}, and ${names[1]} has the ${colours[truth.colPerm[1]]} ${pets[truth.petPerm[1]]}.`,
                `So ${names[askWho]}'s pet is ${correct}.`,
              ],
            },
          };
        }
      }
      return null;
    },
  },

  chain_comparison_order: {
    difficulties: [2, 3],
    build(d) {
      const n = d <= 2 ? 4 : 5;
      const names = LG_namesFrom(n);
      const order = shuffle(LG_range(n));
      const heightOf = new Array(n);
      order.forEach((personIdx, rankFromShortest) => { heightOf[personIdx] = rankFromShortest; });

      const chainLines = [];
      for (let rank = 0; rank < n - 1; rank++) {
        const shorter = names[order[rank]];
        const taller = names[order[rank + 1]];
        chainLines.push(`${shorter} is shorter than ${taller}.`);
      }

      const askType = pick(['tallest', 'shortest', 'above', 'below']);
      let q, correct, decoysBase;
      const tallestName = names[order[n - 1]];
      const shortestName = names[order[0]];
      if (askType === 'tallest') {
        q = 'Who is the tallest?';
        correct = tallestName;
      } else if (askType === 'shortest') {
        q = 'Who is the shortest?';
        correct = shortestName;
      } else {
        const idx = rand(0, n - 2);
        const lower = names[order[idx]];
        const upper = names[order[idx + 1]];
        if (askType === 'above') {
          q = `Who is exactly one place taller than ${lower}?`;
          correct = upper;
        } else {
          q = `Who is exactly one place shorter than ${upper}?`;
          correct = lower;
        }
      }
      const otherInPuzzle = names.filter((nm) => nm !== correct);
      const decoyNames = LG_freshNames(names, 4);
      const { options, correctIndex } = buildMCStr(correct, [...otherInPuzzle, ...decoyNames].slice(0, 4));

      return {
        q: `${names.join(', ')} are comparing their heights.\n${chainLines.join(' ')}\n${q}`,
        options,
        correctIndex,
        hint: 'Chain the clues together from shortest to tallest, like links, to build the full order.',
        solution: {
          idea: 'Each clue links two people together. Chaining every clue end to end gives the full order from shortest to tallest.',
          steps: [
            ...chainLines,
            `Putting the chain together, from shortest to tallest: ${order.map((i) => names[i]).join(' < ')}.`,
            `So the answer is ${correct}.`,
          ],
        },
      };
    },
  },

  pattern_misfit: {
    difficulties: [2, 3],
    build() {
      const names = LG_namesFrom(4);
      const opText = pick([
        { desc: 'double the starting number', apply: (x) => x * 2 },
        { desc: 'add 5 to the starting number', apply: (x) => x + 5 },
        { desc: 'take 3 away from the starting number', apply: (x) => x - 3 },
        { desc: 'add 10 to the starting number', apply: (x) => x + 10 },
      ]);
      const oddOneOut = rand(0, 3);
      const starts = [];
      const used = new Set();
      while (starts.length < 4) {
        const v = rand(2, 20);
        if (!used.has(v)) { used.add(v); starts.push(v); }
      }
      const results = starts.map((s) => opText.apply(s));
      // corrupt the odd one out with a different, clearly different offset
      let wrongResult = opText.apply(starts[oddOneOut]) + pick([-4, -2, 2, 4, 6]);
      if (wrongResult === results[oddOneOut]) wrongResult += 3;
      results[oddOneOut] = wrongResult;

      // Verify uniqueness: exactly one person's (start, result) pair breaks the common rule
      // by checking every candidate offset-from-rule; the rule is "apply(start) === result".
      const matches = starts.map((s, i) => opText.apply(s) === results[i]);
      const mismatchCount = matches.filter((m) => !m).length;
      if (mismatchCount !== 1 || matches[oddOneOut] !== false) return null;

      const lines = names.map((nm, i) => `${nm} started with ${starts[i]} and got ${results[i]}.`);
      const correct = names[oddOneOut];
      const decoyNames = names.filter((nm) => nm !== correct);
      const { options, correctIndex } = buildMCStr(correct, decoyNames.concat(LG_freshNames(names, 2)).slice(0, 4));

      return {
        q: `${names[0]}, ${names[1]}, ${names[2]} and ${names[3]} each started with a number and did the same thing to it: ${opText.desc}.\n${lines.join(' ')}\nWhose result does not fit the pattern the others used?`,
        options,
        correctIndex,
        hint: `Work out what ${opText.desc} would give for each starting number, then compare that to what they actually got.`,
        solution: {
          idea: 'Three of the four results follow the stated rule exactly. Checking each one finds the odd result out.',
          steps: [
            ...starts.map((s, i) => `${names[i]}: starting number ${s}, rule gives ${opText.apply(s)}, actual result given is ${results[i]}${matches[i] ? ' (matches)' : ' (does not match!)'}.`),
            `${correct} is the only one whose result does not match the rule, so ${correct} does not fit the pattern.`,
          ],
        },
      };
    },
  },

  /* ---------- Difficulty 3-4 ---------- */

  simultaneous_numeric_constraints: {
    difficulties: [3, 4],
    build(d) {
      const lo = 1, hi = d <= 3 ? 20 : 30;
      const boxNumbers = [];
      const used = new Set();
      while (boxNumbers.length < 4) {
        const v = rand(lo, hi);
        if (!used.has(v)) { used.add(v); boxNumbers.push(v); }
      }

      for (let attempt = 0; attempt < 30; attempt++) {
        const mysteryIdx = rand(0, 3);
        const mystery = boxNumbers[mysteryIdx];
        const parity = mystery % 2 === 0 ? 'even' : 'odd';
        const others = boxNumbers.filter((_, i) => i !== mysteryIdx);
        const cmpTarget = pick(others.concat([mystery + pick([-3, 3, -5, 5])]));
        const cmpDir = pick(['greater', 'less']);
        const cmpCheck = cmpDir === 'greater' ? (v) => v > cmpTarget : (v) => v < cmpTarget;

        const candidates = boxNumbers.filter((v) => (v % 2 === 0 ? 'even' : 'odd') === parity && cmpCheck(v));
        if (candidates.length === 1 && candidates[0] === mystery) {
          const others2 = boxNumbers.filter((v) => v !== mystery);
          const { options, correctIndex } = buildMC(mystery, others2.concat([mystery + 1, mystery - 1, mystery + 2]), (x) => String(x));
          return {
            q: `Four boxes contain the numbers ${boxNumbers.join(', ')} (one number in each box, not in this order).\nThe mystery number is ${parity}.\nThe mystery number is ${cmpDir} than ${cmpTarget}.\nWhat is the mystery number?`,
            options,
            correctIndex,
            hint: `First cross out any numbers that are not ${parity}. Then, of what is left, cross out any that are not ${cmpDir} than ${cmpTarget}.`,
            solution: {
              idea: 'Apply each clue as a filter over the possible numbers, one after another, until only one number is left.',
              steps: [
                `Numbers available: ${boxNumbers.join(', ')}.`,
                `Only ${parity} numbers can be the answer: ${boxNumbers.filter((v) => (v % 2 === 0 ? 'even' : 'odd') === parity).join(', ')}.`,
                `Of those, only ones ${cmpDir} than ${cmpTarget} remain: ${mystery}.`,
                `So the mystery number is ${mystery}.`,
              ],
            },
          };
        }
      }
      return null;
    },
  },

  linked_two_attribute_grid: {
    difficulties: [3, 4],
    build() {
      const names = LG_namesFrom(4);
      const petPool = shuffle(LG_PETS);
      const pets = petPool.slice(0, 4);
      const drinkPool = shuffle(LG_DRINKS);
      const drinks = drinkPool.slice(0, 4);
      const perms = LG_permutations([0, 1, 2, 3]);

      for (let attempt = 0; attempt < 80; attempt++) {
        const truth = pick(perms);
        const candidates = [];
        for (let i = 0; i < 4; i++) {
          candidates.push({ text: `${names[i]} has the ${pets[truth[i]]}.`, check: (p) => p[i] === truth[i] });
        }
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (i !== j) candidates.push({ text: `${names[i]} does not have the ${pets[truth[j]]}.`, check: (p) => p[i] !== truth[j] });
          }
        }
        const chosen = shuffle(candidates).slice(0, 3);
        const consistent = perms.filter((p) => chosen.every((c) => c.check(p)));
        // require genuinely needing all 3 (not solvable with any 2 of the 3)
        const needsAll3 = [0, 1, 2].every((skip) => {
          const subset = chosen.filter((_, idx) => idx !== skip);
          const c2 = perms.filter((p) => subset.every((c) => c.check(p)));
          return c2.length > 1;
        });
        if (consistent.length === 1 && needsAll3) {
          const catOwnerIdx = truth.indexOf(0); // person who has pets[0]
          const drinkRuleIdx = rand(0, 3);
          const drinkForCatOwner = drinks[drinkRuleIdx];
          const askName = names[catOwnerIdx];
          const correct = drinkForCatOwner;
          const otherDrinks = drinks.filter((dk) => dk !== correct);
          const { options, correctIndex } = buildMCStr(correct, otherDrinks.concat(LG_DRINKS.filter((dk) => !drinks.includes(dk))).slice(0, 4));
          return {
            q: `${names.join(', ')} each have a different pet: ${pets.join(', ')} (one each).\n${chosen.map((c) => c.text).join(' ')}\nWhoever has the ${pets[0]} always drinks ${drinkForCatOwner}.\nWhat does ${askName} drink?`,
            options,
            correctIndex,
            hint: `First use the three clues to work out who has the ${pets[0]}. Then use the extra rule about drinks.`,
            solution: {
              idea: 'This needs two steps: work out the pet assignment from the clues, then apply the separate rule linking pet to drink.',
              steps: [
                ...chosen.map((c) => c.text),
                `Combining all three clues, the only arrangement that fits is: ${names.map((n, i) => `${n} has the ${pets[truth[i]]}`).join(', ')}.`,
                `So ${askName} has the ${pets[0]}.`,
                `Since whoever has the ${pets[0]} drinks ${drinkForCatOwner}, ${askName} drinks ${drinkForCatOwner}.`,
              ],
            },
          };
        }
      }
      return null;
    },
  },

  syllogism_quantifier: {
    difficulties: [3, 4],
    build() {
      const [B, C, D] = shuffle(['squares', 'kangaroos', 'daisies', 'robins', 'triangles', 'otters', 'beetles', 'maple trees']).slice(0, 3);
      const template = pick(['invalid', 'valid']);

      if (template === 'invalid') {
        const correct = 'No, we cannot be sure';
        const decoys = [`Yes, all ${B} are ${D}`, `Yes, some ${B} are ${D}`, `No, definitely none of the ${B} are ${D}`, `Yes, but only one of the ${B} is ${D}`];
        const { options, correctIndex } = buildMCStr(correct, decoys);
        return {
          q: `All ${B} are ${C}.\nSome ${C} are ${D}.\nCan we be sure that some ${B} are ${D}?`,
          options,
          correctIndex,
          hint: 'The "some" fact might only be about the part of the group that is not made up of the first group at all.',
          solution: {
            idea: `Knowing all ${B} are ${C} just puts the ${B} inside the ${C} group. The "some ${C} are ${D}" fact could be entirely about ${C} that are not ${B}.`,
            steps: [
              `All ${B} are ${C}: so every ${LG_singularOf(B)} is a kind of ${LG_singularOf(C)}.`,
              `Some ${C} are ${D}, but we are not told which ${C} those are.`,
              `Those ${D}-related ${C} might all be ones that are not ${B}, so we cannot be certain any ${B} are ${D}.`,
            ],
          },
        };
      }
      const correct = `Yes, all ${B} are ${D}`;
      const decoys = ['No, we cannot be sure', `Yes, but only some ${B} are ${D}`, `No, none of the ${B} are ${D}`, `Yes, but only some ${C} are ${D}`];
      const { options, correctIndex } = buildMCStr(correct, decoys);
      return {
        q: `All ${B} are ${C}.\nAll ${C} are ${D}.\nDoes it follow that all ${B} are ${D}?`,
        options,
        correctIndex,
        hint: 'If every member of the first group is in the second, and every member of the second is in the third, follow the chain through.',
        solution: {
          idea: 'This is a chain: every B is a C, and every C is a D, so every B must also be a D.',
          steps: [
            `Take any one of the ${B}: it is ${LG_articleFor(LG_singularOf(C))} ${LG_singularOf(C)} (since all ${B} are ${C}).`,
            `It is also ${LG_articleFor(LG_singularOf(D))} ${LG_singularOf(D)} (since all ${C} are ${D}).`,
            `This works for every single one of the ${B}, so yes, all ${B} are ${D}.`,
          ],
        },
      };
    },
  },

  always_sometimes_never: {
    difficulties: [3, 4],
    build() {
      const names = LG_namesFrom(3);
      const lo = 8, hi = 13;
      const values = LG_range(hi - lo + 1).map((x) => x + lo);
      const triples = [];
      for (const a of values) for (const b of values) for (const c of values) {
        if (a !== b && b !== c && a !== c) triples.push([a, b, c]);
      }

      const clueSets = [
        { text: `${names[0]} is older than ${names[1]}.`, check: (t) => t[0] > t[1] },
        { text: `${names[1]} is younger than ${names[2]}.`, check: (t) => t[1] < t[2] },
      ];
      const numClues = rand(1, 2);
      const chosenClues = shuffle(clueSets).slice(0, numClues);
      const validWorlds = triples.filter((t) => chosenClues.every((c) => c.check(t)));
      if (validWorlds.length === 0) return null;

      const statementDefs = [
        { text: `${names[0]} is the oldest of the three.`, check: (t) => t[0] > t[1] && t[0] > t[2] },
        { text: `${names[2]} is the oldest of the three.`, check: (t) => t[2] > t[0] && t[2] > t[1] },
        { text: `${names[1]} is the youngest of the three.`, check: (t) => t[1] < t[0] && t[1] < t[2] },
        { text: `${names[0]} and ${names[2]} are the same age.`, check: () => false },
      ];
      const stmt = pick(statementDefs);
      const trueCount = validWorlds.filter(stmt.check).length;
      let classification;
      if (trueCount === validWorlds.length) classification = 'Always true';
      else if (trueCount === 0) classification = 'Never true';
      else classification = 'Sometimes true';

      const fullOptionPool = ['Always true', 'Sometimes true', 'Never true', 'Cannot be worked out at all', 'True for exactly two of them'];
      const decoys = fullOptionPool.filter((o) => o !== classification);
      const { options, correctIndex } = buildMCStr(classification, decoys);

      // Give one concrete example world for the solution steps
      const exampleWorld = validWorlds[0];
      const exampleTrue = stmt.check(exampleWorld);

      return {
        q: `${names[0]}, ${names[1]} and ${names[2]} are all different ages, somewhere between ${lo} and ${hi}.\n${chosenClues.map((c) => c.text).join(' ')}\nIs the statement "${stmt.text}" always true, sometimes true, or never true, given only what we know?`,
        options,
        correctIndex,
        hint: 'Try to think of two different sets of ages that both fit the clues. Does the statement come out the same both times?',
        solution: {
          idea: 'The clues do not pin down exact ages, so several different age combinations are possible. Check the statement against all of them.',
          steps: [
            ...chosenClues.map((c) => c.text),
            `For example, ages ${names[0]}=${exampleWorld[0]}, ${names[1]}=${exampleWorld[1]}, ${names[2]}=${exampleWorld[2]} fit the clues, and here the statement is ${exampleTrue ? 'true' : 'false'}.`,
            `Checking every age combination that fits the clues, the statement is ${classification.toLowerCase()}.`,
          ],
        },
      };
    },
  },

  deduction_chain_three_clues: {
    difficulties: [3, 4],
    build() {
      const n = 5;
      const names = LG_namesFrom(n);
      const posWord = ['1st', '2nd', '3rd', '4th', '5th'];
      const perms = LG_permutations(LG_range(n));

      for (let attempt = 0; attempt < 200; attempt++) {
        const truth = pick(perms);
        const byPos = new Array(n);
        truth.forEach((p, i) => { byPos[p] = i; });

        const candidates = [];
        for (let i = 0; i < n; i++) {
          candidates.push({ kind: 'direct', text: `${names[i]} finished ${posWord[truth[i]]}.`, check: (p) => p[i] === truth[i] });
        }
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (i !== j && truth[j] === truth[i] + 1) {
              candidates.push({ kind: 'adj', text: `${names[i]} finished immediately before ${names[j]}.`, check: (p) => p[j] === p[i] + 1 });
            }
          }
        }
        for (let i = 0; i < n; i++) {
          for (let k = 0; k < n; k++) {
            if (k !== truth[i]) candidates.push({ kind: 'neg', text: `${names[i]} did not finish ${posWord[k]}.`, check: (p) => p[i] !== k });
          }
        }

        const direct = candidates.filter((c) => c.kind === 'direct');
        const nonDirect = candidates.filter((c) => c.kind !== 'direct');
        const chosen = shuffle([...shuffle(direct).slice(0, 1), ...shuffle(nonDirect).slice(0, 2)]);
        if (chosen.length < 3) continue;

        const consistent = perms.filter((p) => chosen.every((c) => c.check(p)));
        if (consistent.length !== 1) continue;

        const needsAll3 = [0, 1, 2].every((skip) => {
          const subset = chosen.filter((_, idx) => idx !== skip);
          const c2 = perms.filter((p) => subset.every((c) => c.check(p)));
          return c2.length > 1;
        });
        if (!needsAll3) continue;

        const askPos = rand(0, n - 1);
        const correct = names[byPos[askPos]];
        const otherInPuzzle = names.filter((nm) => nm !== correct);
        const decoyNames = LG_freshNames(names, 4);
        const { options, correctIndex } = buildMCStr(correct, [...otherInPuzzle, ...decoyNames].slice(0, 4));
        return {
          q: `${names.join(', ')} took part in a race with five different finishing places.\n${chosen.map((c) => c.text).join(' ')}\nWho finished ${posWord[askPos]}?`,
          options,
          correctIndex,
          hint: 'You will need all three clues together: try each one and see what it rules out before moving to the next.',
          solution: {
            idea: 'Each of the three clues only narrows things down a little on its own; combining all three pins down the full order.',
            steps: [
              ...chosen.map((c) => c.text),
              `Working through the clues together, the only order that fits all three is: ${byPos.map((i) => names[i]).join(', ')}.`,
              `So ${correct} finished ${posWord[askPos]}.`,
            ],
          },
        };
      }
      return null;
    },
  },

  meta_which_clue_resolves: {
    difficulties: [4],
    build() {
      // Two direct clues fix two of the four runners' places, leaving exactly two possible
      // orders (the other two runners' places swapped). A single well-chosen further clue
      // about either of the two free runners is then enough to settle which order is right;
      // a clue about the two ALREADY-fixed runners (or one true of both remaining orders)
      // is not enough. With only one base clue, no single extra clue can ever narrow four
      // runners down to one order in this vocabulary, so two base clues are essential.
      const names = LG_namesFrom(4);
      const perms = LG_permutations(LG_range(4));
      const posWord = ['1st', '2nd', '3rd', '4th'];
      const allIdx = [0, 1, 2, 3];

      for (let attempt = 0; attempt < 150; attempt++) {
        const truth = pick(perms);
        const fixed = shuffle(allIdx).slice(0, 2);
        const free = allIdx.filter((i) => !fixed.includes(i));
        const baseClues = fixed.map((i) => ({ text: `${names[i]} finished ${posWord[truth[i]]}.`, check: (p) => p[i] === truth[i] }));
        const afterBase = perms.filter((p) => baseClues.every((c) => c.check(p)));
        if (afterBase.length !== 2) continue;

        const candidatePool = [];
        for (let i = 0; i < 4; i++) {
          for (let k = 0; k < 4; k++) {
            candidatePool.push({ text: `${names[i]} finished ${posWord[k]}.`, check: (p) => p[i] === k });
          }
        }
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (i !== j) candidatePool.push({ text: `${names[i]} finished immediately before ${names[j]}.`, check: (p) => p[j] === p[i] + 1 });
          }
        }
        // Negative clues matter here: a "did not finish Nth" statement about one of the
        // two ALREADY-fixed runners is always true and never narrows anything further, which
        // is exactly the kind of true-but-unhelpful decoy this question needs. Without these,
        // there are never enough genuine non-resolving options to fill the other four slots.
        for (let i = 0; i < 4; i++) {
          for (let k = 0; k < 4; k++) {
            candidatePool.push({ text: `${names[i]} did not finish ${posWord[k]}.`, check: (p) => p[i] !== k });
          }
        }

        const scored = [];
        for (const cand of candidatePool) {
          const remaining = afterBase.filter((p) => cand.check(p));
          scored.push({ cand, count: remaining.length });
        }
        // only offer clues consistent with the actual truth (count 1 or 2); a clue that
        // contradicts everything already known (count 0) would be a nonsensical option.
        const resolvers = scored.filter((s) => s.count === 1 && s.cand.check(truth));
        const nonResolvers = scored.filter((s) => s.count === 2 && s.cand.check(truth));
        if (resolvers.length === 0 || nonResolvers.length < 4) continue;

        const chosenResolver = pick(resolvers);
        const chosenNon = shuffle(nonResolvers);
        const seenTexts = new Set([chosenResolver.cand.text]);
        const finalDecoys = [];
        for (const nr of chosenNon) {
          if (finalDecoys.length >= 4) break;
          if (!seenTexts.has(nr.cand.text)) { seenTexts.add(nr.cand.text); finalDecoys.push(nr.cand.text); }
        }
        if (finalDecoys.length < 4) continue;

        const correct = chosenResolver.cand.text;
        const { options, correctIndex } = buildMCStr(correct, finalDecoys.slice(0, 4));
        const baseText = baseClues.map((c) => c.text).join(' ');

        return {
          q: `${names.join(', ')} took part in a race. All we know so far is: "${baseText}"\nThat still leaves more than one possible finishing order.\nWhich extra clue below would be enough, together with what we already know, to work out the exact finishing order?`,
          options,
          correctIndex,
          hint: 'Try adding each extra clue to what we already know, and see whether it narrows things down to exactly one possible order.',
          solution: {
            idea: 'A useful extra clue is one that, combined with what we already know, leaves only one possible order. The others leave more than one order still possible.',
            steps: [
              `We already know: ${baseText}`,
              `Adding "${correct}" leaves only one possible order, so it resolves the puzzle.`,
              'Each of the other options still leaves more than one possible order, so they do not fully resolve it.',
            ],
          },
        };
      }
      return null;
    },
  },

};


const AS_NAMES = ["Pip", "Sorrel", "Bramble", "Dapple", "Kernel", "Tuppence", "Russet", "Wicker"];

function AS_numberLineSvg(start, moves, end) {
  const moveText = moves.map((move) => move >= 0 ? `+${move}` : String(move)).join(", then ");
  return svgBox(
    SR(18, 52, 74, 48, "#5b4a8a", 2, "#fffaf0") +
    ST(55, 82, String(start), "middle", 18) +
    SL(94, 76, 202, 76, "#7c5cff", 4) +
    ST(148, 58, moveText, "middle", 14, "#5b3df0") +
    SR(204, 52, 74, 48, "#5b4a8a", 2, "#fffaf0") +
    ST(241, 82, String(end), "middle", 18),
    296,
    130
  );
}

function AS_compareSvg(first, second, firstLabel, secondLabel) {
  const max = Math.max(first, second, 1);
  const firstWidth = Math.round(210 * first / max);
  const secondWidth = Math.round(210 * second / max);
  return svgBox(
    ST(12, 45, firstLabel, "start", 13) +
    SR(74, 24, firstWidth, 32, "#5b4a8a", 2, "#d9cffd") +
    ST(82 + firstWidth, 45, String(first), "start", 13) +
    ST(12, 99, secondLabel, "start", 13) +
    SR(74, 78, secondWidth, 32, "#5b4a8a", 2, "#bcece4") +
    ST(82 + secondWidth, 99, String(second), "start", 13),
    340,
    132
  );
}

function AS_numericQuestion(correct, distractors) {
  return buildMC(correct, distractors);
}

function PF_withPresentation(question, { q, variantId, representation, svg }) {
  const solution = question.solution && !Array.isArray(question.solution)
    ? { ...question.solution, scenario: q }
    : question.solution;
  return { ...question, q, variantId, representation, ...(svg ? { svg } : {}), solution };
}

function PF_numbers(text) {
  return (String(text).match(/-?\d[\d,]*(?:\.\d+)?/g) || []).map((value) => Number(value.replace(/,/g, ""))).filter(Number.isFinite);
}

function PF_correctNumber(question) {
  const value = question.options?.[question.correctIndex];
  const numbers = PF_numbers(value);
  return numbers.length === 1 ? numbers[0] : null;
}

function PF_placeChartNumber(question) {
  if (new Set(["compose_from_named_parts", "matching_expanded_form"]).has(question.structureId)) return PF_correctNumber(question);
  const values = PF_numbers(question.q).filter(Number.isInteger);
  return values.length ? values.reduce((largest, value) => Math.abs(value) > Math.abs(largest) ? value : largest) : null;
}

function PF_roundingVisual(question) {
  const values = PF_numbers(question.q);
  if (!values.length) return null;
  const id = question.structureId;
  let value = values[0];
  let unit;
  const wordUnits = { ten: 10, hundred: 100, thousand: 1000, "ten thousand": 10000 };
  const wordMatch = String(question.q).match(/nearest (ten thousand|thousand|hundred|ten)\b/i);
  if (wordMatch) unit = wordUnits[wordMatch[1].toLowerCase()];
  const multipleMatch = String(question.q).match(/multiples? of ([\d,]+)/i);
  if (multipleMatch) unit = Number(multipleMatch[1].replace(/,/g, ""));
  const decimalPlaces = String(question.q).match(/(\d+) decimal place/i);
  if (decimalPlaces) unit = 10 ** -Number(decimalPlaces[1]);
  if (/nearest whole number/i.test(question.q)) unit = 1;
  if (id === "nearest_multiple") value = values[values.length - 1];
  if (id === "reverse_rounding_bounds") value = PF_correctNumber(question) ?? value;
  if (!unit) {
    const magnitude = Math.abs(value);
    unit = magnitude >= 1000 ? 1000 : magnitude >= 100 ? 100 : magnitude >= 10 ? 10 : 1;
  }
  return { value, unit };
}

function PF_placeChartSvg(number) {
  if (!Number.isInteger(number) || number < 0) return null;
  const digits = String(number).split("");
  const names = ["ones", "tens", "hundreds", "thousands", "ten-thousands", "hundred-thousands"];
  const cells = digits.map((digit, index) => {
    const x = 18 + index * 72;
    const place = names[digits.length - 1 - index] || `10^${digits.length - 1 - index}`;
    return SR(x, 36, 66, 50, "#5b4a8a", 2, "#fffaf0") + ST(x + 33, 68, digit, "middle", 22) + ST(x + 33, 108, place, "middle", 10, "#5b4a8a");
  }).join("");
  return svgBox(cells, Math.max(190, digits.length * 72 + 30), 132);
}

function PF_roundingLineSvg(value, unit) {
  if (!Number.isFinite(value) || !Number.isFinite(unit) || unit <= 0) return null;
  const lower = Math.floor(value / unit) * unit;
  const upper = lower + unit;
  const ratio = upper === lower ? 0.5 : (value - lower) / (upper - lower);
  const x = 34 + Math.max(0, Math.min(1, ratio)) * 232;
  return svgBox(
    SL(34, 72, 266, 72, "#5b4a8a", 3) +
    SL(34, 58, 34, 86, "#5b4a8a", 3) +
    SL(266, 58, 266, 86, "#5b4a8a", 3) +
    ST(34, 108, String(Number(lower.toFixed(6))), "middle", 14) +
    ST(266, 108, String(Number(upper.toFixed(6))), "middle", 14) +
    SC(x, 72, 7, "#ff6b4a", 2, "#ffcfbd") +
    ST(x, 43, String(Number(value.toFixed(6))), "middle", 14, "#c7472d"),
    300,
    126
  );
}

function PF_presentPlaceValue(question) {
  const id = question.structureId;
  const contexts = ["storehouse_ledger", "orchard_gate", "harvest_tally", "mill_counter", "row_marker"];
  const context = pick(contexts);
  const prefixes = {
    storehouse_ledger: "The Ninefold storehouse ledger shows this number.",
    orchard_gate: "A number is carved into the orchard gate.",
    harvest_tally: "Pip is checking a harvest tally.",
    mill_counter: "The mill counter displays this calculation.",
    row_marker: "A numbered marker stands at the end of an orchard row.",
  };
  const storyIds = new Set(["compare_five_numbers", "order_numbers", "unitizing", "missing_addend_partition", "two_step_partition", "arrange_digits_extremum", "arrange_digits_with_parity", "two_number_extremum_sum", "two_number_extremum_product", "reconstruct_from_clues", "roman_numeral_compare", "roman_ledger_change"]);
  const diagramIds = new Set(["digit_value_from_place", "digit_from_place_name", "place_name_from_digit", "compose_from_named_parts", "matching_expanded_form", "swap_two_digits_change", "digit_range_for_inequality"]);
  if (id === "roman_clock_read") return PF_withPresentation(question, { q: question.q, variantId: `${id}_old_dial`, representation: "diagram", svg: question.svg });
  if (diagramIds.has(id) && Math.random() < 0.7) {
    const value = PF_placeChartNumber(question);
    const svg = PF_placeChartSvg(value);
    if (svg) return PF_withPresentation(question, { q: `${prefixes[context]} ${question.q}`, variantId: `${id}_${context}_chart`, representation: "diagram", svg });
  }
  if (storyIds.has(id) || Math.random() < 0.45) return PF_withPresentation(question, { q: `${prefixes[context]} ${question.q}`, variantId: `${id}_${context}`, representation: "story" });
  return PF_withPresentation(question, { q: question.q, variantId: `${id}_notation`, representation: "direct" });
}

function PF_presentRounding(question) {
  const id = question.structureId;
  const contexts = ["harvest_count", "journey_distance", "market_budget", "store_capacity", "festival_crowd"];
  const context = pick(contexts);
  const prefixes = {
    harvest_count: "Pip needs a useful estimate for the orchard harvest.",
    journey_distance: "A Ninefold signpost gives a measured journey distance.",
    market_budget: "Sorrel is making a quick market estimate.",
    store_capacity: "The storekeeper is estimating how much space is needed.",
    festival_crowd: "Bramble is reporting an approximate festival crowd.",
  };
  const diagramIds = new Set(["round_whole_number", "round_decimal", "nearest_multiple", "closer_to_which_bound", "halfway_convention", "reverse_halfway_value", "reverse_rounding_bounds"]);
  const storyIds = new Set(["estimate_sum_by_rounding", "estimate_difference_by_rounding", "estimate_product_by_rounding", "choose_rounding_direction_context", "round_and_compare"]);
  if (diagramIds.has(id) && Math.random() < 0.75) {
    const visual = PF_roundingVisual(question);
    const svg = visual ? PF_roundingLineSvg(visual.value, visual.unit) : null;
    if (svg) return PF_withPresentation(question, { q: `${prefixes[context]} ${question.q}`, variantId: `${id}_${context}_line`, representation: "diagram", svg });
  }
  if (storyIds.has(id) || Math.random() < 0.35) return PF_withPresentation(question, { q: `${prefixes[context]} ${question.q}`, variantId: `${id}_${context}`, representation: "story" });
  return PF_withPresentation(question, { q: question.q, variantId: `${id}_notation`, representation: "direct" });
}

function PF_presentNegative(question) {
  const id = question.structureId;
  const diagramIds = new Set(["number_line_read", "count_on_across_zero", "count_back_across_zero", "missing_in_sequence", "sequence_gap_stepped"]);
  const directIds = new Set(["order_small_set"]);
  if (diagramIds.has(id)) {
    const numbers = String(question.q).replace(/,/g, "").match(/-?\d+/g)?.map(Number) || [];
    const start = numbers[0] ?? 0;
    const end = Number(String(question.options?.[question.correctIndex] || "0").replace(/[^\d-]/g, ""));
    const move = Number.isFinite(end) ? end - start : 0;
    return PF_withPresentation(question, { q: question.q, variantId: `${id}_number_line`, representation: "diagram", svg: AS_numberLineSvg(start, [move], Number.isFinite(end) ? end : start) });
  }
  if (directIds.has(id)) return PF_withPresentation(question, { q: question.q, variantId: `${id}_number_order`, representation: "direct" });
  if (Math.random() < 0.18) return PF_withPresentation(question, { q: question.q, variantId: `${id}_plain`, representation: "direct" });
  const context = id === "floor_lift_scenario"
    ? "storehouse_lift"
    : id === "compound_word_problem_two_changes"
      ? "market_ledger"
      : id.includes("temp") || id.includes("interval") || id.includes("order") || id.includes("change") || id === "compare_two_values" || id === "position_distance_to_zero" || id === "reasoning_which_change_bigger"
        ? "orchard_weather"
        : "row_marker";
  const prefixes = {
    storehouse_lift: "Beneath the Ninefold storehouse,",
    market_ledger: "At the Ninefold market,",
    orchard_weather: "The Ninefold Orchard weather board records this:",
    row_marker: "Along a numbered Ninefold orchard row,",
  };
  return PF_withPresentation(question, { q: `${prefixes[context]} ${question.q}`, variantId: `${id}_${context}`, representation: "story" });
}

function PF_presentCompensation(question) {
  const id = question.structureId;
  const contexts = ["market_total", "harvest_gap", "crate_array", "shared_seed", "mill_measure"];
  const context = pick(contexts);
  const prefixes = {
    market_total: "Pip is balancing two market totals to make the addition friendlier.",
    harvest_gap: "Sorrel keeps the gap between two harvest counts unchanged.",
    crate_array: "Bramble rearranges an equal array of fruit crates without changing how many there are.",
    shared_seed: "Kernel scales both parts of an equal seed-sharing calculation.",
    mill_measure: "The mill keeper rewrites a calculation using friendlier measures.",
  };
  const diagramIds = new Set(["recognize_valid_pair", "cross_operation_rule_check", "alternative_scaling_pair", "compensation_error_spotting"]);
  const directIds = new Set(["find_the_adjustment", "apply_the_rule_directly", "reverse_compensation"]);
  if (diagramIds.has(id)) {
    const svg = svgBox(ST(150, 38, "same value", "middle", 15, "#5b3df0") + SR(24, 56, 112, 44, "#5b4a8a", 2, "#fffaf0") + ST(80, 84, "original", "middle", 14) + ST(150, 84, "=", "middle", 20) + SR(164, 56, 112, 44, "#5b4a8a", 2, "#fffaf0") + ST(220, 84, "balanced", "middle", 14), 300, 122);
    return PF_withPresentation(question, { q: `${prefixes[context]} ${question.q}`, variantId: `${id}_${context}_balance`, representation: "diagram", svg });
  }
  if (!directIds.has(id) || Math.random() < 0.35) return PF_withPresentation(question, { q: `${prefixes[context]} ${question.q}`, variantId: `${id}_${context}`, representation: "story" });
  return PF_withPresentation(question, { q: question.q, variantId: `${id}_notation`, representation: "direct" });
}

function PF_arithmeticDiagramSvg(question, mode) {
  const values = PF_numbers(question.q).slice(0, 3);
  const first = values[0] ?? "?";
  const second = values[1] ?? "?";
  const titles = {
    multiply: `${first} × ${second}`,
    factors: `factor pairs for ${first}`,
    divide: `${first} ÷ ${second}`,
    fraction: `${first}/${second}`,
    decimal: `place-value model`,
  };
  const labels = mode === "divide" ? ["whole", "group size", "groups / remainder"] : mode === "factors" ? ["whole", "factor", "paired factor"] : mode === "fraction" ? ["numerator", "denominator", "result / whole"] : mode === "decimal" ? ["ones", "tenths", "hundredths"] : ["groups", "in each group", "total"];
  return svgBox(
    ST(150, 27, titles[mode], "middle", 16, "#5b3df0") +
    SR(14, 48, 82, 46, "#5b4a8a", 2, "#fffaf0") + ST(55, 76, String(first), "middle", 17) + ST(55, 112, labels[0], "middle", 10) +
    SR(109, 48, 82, 46, "#5b4a8a", 2, "#d9cffd") + ST(150, 76, String(second), "middle", 17) + ST(150, 112, labels[1], "middle", 10) +
    SR(204, 48, 82, 46, "#5b4a8a", 2, "#bcece4") + ST(245, 76, "?", "middle", 19) + ST(245, 112, labels[2], "middle", 10),
    300,
    130
  );
}

function PF_presentArithmeticTopic(question, config) {
  const id = question.structureId;
  const context = pick(Object.keys(config.contexts));
  if (config.diagramIds.has(id) && Math.random() < 0.7) return PF_withPresentation(question, { q: question.q, variantId: `${id}_${config.mode}_model`, representation: "diagram", svg: PF_arithmeticDiagramSvg(question, config.mode) });
  if (config.directIds.has(id) && Math.random() < (config.directRate ?? 0.7)) return PF_withPresentation(question, { q: question.q, variantId: `${id}_notation`, representation: "direct" });
  if (config.directChance && Math.random() < config.directChance) return PF_withPresentation(question, { q: question.q, variantId: `${id}_plain`, representation: "direct" });
  return PF_withPresentation(question, { q: `${config.contexts[context]} ${question.q}`, variantId: `${id}_${context}`, representation: "story" });
}

const PF_TIMES_PRESENTATION = {
  mode: "multiply",
  contexts: {
    orchard_rows: "Kernel is planning equal rows in the Ninefold Orchard.",
    seed_trays: "Pip is counting equal seed trays.",
    market_bundles: "Tuppence is checking equal market bundles.",
    fruit_crates: "Bushel is stacking identical fruit crates.",
    tally_board: "Sorrel is completing the orchard tally board.",
  },
  diagramIds: new Set(["commutative_property", "step_along_table", "distributive_partition", "fact_family", "product_comparison"]),
  directIds: new Set(["direct_recall", "missing_factor", "scale_by_ten_hundred", "reverse_scale"]),
};

const PF_FACTORS_PRESENTATION = {
  mode: "factors",
  contexts: {
    bell_cycles: "Two Ninefold gate bells follow repeating cycles.",
    planting_plots: "Kernel is arranging a rectangular planting plot.",
    basket_groups: "Bushel is testing equal basket groups.",
    seed_packets: "Pip is dividing seed into identical packets.",
    gate_patterns: "Bramble is checking the number pattern on an orchard gate.",
  },
  diagramIds: new Set(["spot_non_factor", "spot_multiple", "spot_square_number", "count_factors", "highest_common_factor"]),
  directIds: new Set(["spot_prime", "prime_factor_decomposition"]),
  directChance: 0.08,
};

const PF_FORMAL_MULTIPLICATION_PRESENTATION = {
  mode: "multiply",
  contexts: {
    store_ledger: "Barrow is checking a multiplication in the Ninefold store ledger.",
    field_area: "Kernel is calculating the size of a rectangular planting field.",
    cart_journeys: "Millrace is counting equal loads carried on repeated journeys.",
    unit_prices: "Tuppence is checking the total cost of equal market items.",
    stacked_crates: "Bushel is counting fruit in identical layers of crates.",
  },
  diagramIds: new Set(["identify_carried_digit", "partial_product_subcalc", "spot_correct_partial_products", "distributive_partition_2digit", "compound_area_multiplication"]),
  directIds: new Set(["short_multiplication_1digit", "missing_digit_in_product", "long_multiplication_2digit_full"]),
};

const PF_DIVISION_REMAINDERS_PRESENTATION = {
  mode: "divide",
  contexts: {
    cart_seats: "The Ninefold cart keeper is filling equal passenger carts.",
    fruit_packing: "Bushel is packing the harvest into equal crates.",
    market_money: "Tuppence is sharing a market payment equally.",
    shared_harvest: "Pip is sharing fruit equally between orchard helpers.",
    store_shelves: "Barrow is filling equal storehouse shelves.",
  },
  diagramIds: new Set(["quotient_or_remainder_direct", "state_leftover_directly", "reconstruct_dividend_from_qr", "remainder_as_fraction_of_whole", "multi_remainder_chain"]),
  directIds: new Set(["remainder_must_be_smaller_misconception", "classify_the_right_approach"]),
};

const PF_FORMAL_DIVISION_PRESENTATION = {
  mode: "divide",
  contexts: {
    orchard_store: "Barrow is dividing the Ninefold store count into equal groups.",
    mill_delivery: "Millrace is splitting a delivery equally between mill runs.",
    seed_sharing: "Pip is sharing seed equally between planting teams.",
    path_sections: "Furrow is dividing an orchard path into equal sections.",
    market_orders: "Tuppence is dividing a market order into equal parcels.",
  },
  diagramIds: new Set(["procedural_bring_down_digit", "ratio_table_long_division", "remainder_as_fraction", "carried_remainder_value", "long_division_2digit_divisor"]),
  directIds: new Set(["short_division_quotient", "missing_dividend_or_divisor", "identify_remainder"]),
};

const PF_FOUR_OPERATIONS_PRESENTATION = {
  mode: "multiply",
  contexts: { harvest_plan: "Pip is checking the harvest plan.", market_order: "Tuppence is checking a market order.", store_ledger: "Barrow is checking the store ledger.", orchard_rows: "Kernel is planning orchard rows.", mill_delivery: "Millrace is checking a mill delivery." },
  diagramIds: new Set(["equal_groups_and_sharing", "inverse_missing_quantity"]),
  directIds: new Set(["choose_the_operation", "expression_order_and_brackets"]),
  directRate: 0.55,
};

const PF_FRACTION_AMOUNT_PRESENTATION = {
  mode: "fraction",
  contexts: { fruit_share: "Pip is sharing the Ninefold fruit harvest.", seed_store: "Kernel is measuring seed from the store.", market_money: "Tuppence is finding a fraction of the market takings.", journey: "Furrow is measuring a fraction of an orchard path.", time_plan: "Sorrel is dividing the harvest-day timetable." },
  diagramIds: new Set(["half_and_quarter_recall", "unit_fraction_of_quantity", "non_unit_fraction_of_quantity", "fraction_then_remaining", "what_fraction_is_part_of_whole"]),
  directIds: new Set(["missing_numerator", "reverse_find_whole"]),
};

const PF_FRACTION_EQUIVALENCE_PRESENTATION = {
  mode: "fraction",
  contexts: { fruit_trays: "Bushel is comparing equal fruit trays.", seed_bags: "Pip is comparing shares of seed bags.", path_markers: "Furrow is comparing marked portions of a path.", recipe: "Sorrel is scaling a Ninefold recipe.", orchard_grid: "Kernel is studying a divided orchard grid." },
  diagramIds: new Set(["scale_to_equivalent", "read_fraction_from_grid", "same_numerator_comparison", "distance_from_whole_comparison"]),
  directIds: new Set(["simplify_to_lowest_terms", "cross_multiply_check_equivalence", "simplify_multistep"]),
};

const PF_FRACTION_ARITHMETIC_PRESENTATION = {
  mode: "fraction",
  contexts: { fruit_pies: "Bushel is combining portions of Ninefold fruit pies.", water_tanks: "Millrace is tracking fractions of orchard water tanks.", seed_mix: "Kernel is combining fractions of a seed mixture.", path_work: "Furrow is measuring completed sections of a path.", market_stock: "Tuppence is tracking fractional market stock." },
  diagramIds: new Set(["same_denom_add", "same_denom_subtract", "add_bridging_whole", "subtract_borrow_whole", "add_related_denom", "subtract_related_denom", "multiply_fractions"]),
  directIds: new Set(["mixed_to_improper", "improper_to_mixed", "missing_addend_same_denom", "divide_fraction_by_whole"]),
};

const PF_DECIMAL_PRESENTATION = {
  mode: "decimal",
  contexts: { market_money: "Tuppence is checking decimal amounts in the market ledger.", orchard_length: "Furrow is measuring an orchard path.", fruit_mass: "Bushel is recording the mass of a fruit crate.", water_volume: "Millrace is measuring water for the orchard.", seed_weight: "Kernel is weighing seed for planting." },
  diagramIds: new Set(["digit_value_from_place", "digit_from_named_place", "place_name_from_digit", "compose_from_named_parts", "fraction_decimal_equivalence"]),
  directIds: new Set(["multiply_divide_power_of_ten", "missing_value_reverse_operation", "missing_addend_to_target"]),
};

const PF_PERCENTAGE_PRESENTATION = {
  mode: "fraction",
  contexts: { harvest: "Pip is checking a percentage of the Ninefold harvest.", market: "Tuppence is checking a percentage in the market ledger.", seed: "Kernel is measuring a percentage of the seed store.", journey: "Furrow is measuring progress along an orchard path.", water: "Millrace is recording a percentage of the orchard water supply." },
  diagramIds: new Set(["percent_of_amount", "compare_percent_amounts"]),
  directIds: new Set(["convert_percent_forms", "reverse_percentage"]),
};

const PF_STATISTICS_PRESENTATION = {
  mode: "decimal",
  contexts: { harvest_table: "Barrow is reading the Ninefold harvest table.", line_graph: "Sorrel is studying the orchard line graph.", market_chart: "Tuppence is comparing a market chart.", weather_record: "Pip is reading the orchard weather record.", seed_survey: "Kernel is analysing a seed survey." },
  diagramIds: new Set(["read_data_table", "line_graph_change", "pie_chart_share"]),
  directIds: new Set(["mean_average"]),
};

const PF_COMMON_CONTEXTS = {
  harvest: "Pip is checking the Ninefold harvest.",
  market: "Tuppence is checking the orchard market ledger.",
  store: "Barrow is organising the Ninefold storehouse.",
  path: "Furrow is planning an orchard path.",
  seed: "Kernel is preparing the next planting.",
};

const PF_REMAINING_PRESENTATIONS = {
  ratioBasics: { mode: "fraction", diagramIds: new Set(["part_to_whole_ratio", "unitary_scale_match_one_quantity", "share_total_find_part", "difference_given_ratio", "three_way_ratio_share"]), directIds: new Set(["simplify_ratio_lowest_terms", "check_ratio_equivalence"]) },
  twoUnknowns: { mode: "fraction", diagramIds: new Set(["sum_and_difference", "sum_and_multiple", "sum_and_ratio_parts", "difference_and_multiple_parts"]), directIds: new Set(["verify_pair_against_two_clues", "count_pairs_with_property"]) },
  additiveMultiplicative: { mode: "multiply", diagramIds: new Set(["additive_diff_basic", "multiplicative_factor_basic", "additive_chain", "combined_relation_forward", "multiplicative_chain"]), directIds: new Set(["identify_comparison_type", "signed_difference_find_value"]) },
  unitConversion: { mode: "decimal", diagramIds: new Set(["decimal_amount_to_small", "small_as_decimal_of_big", "compare_two_units", "sum_mixed_units", "difference_mixed_units"]), directIds: new Set(["direct_convert_up", "direct_convert_down", "recall_fact"]) },
  areaPerimeter: { mode: "multiply", diagramIds: new Set(["rect_area_basic", "rect_perimeter_basic", "L_shape_area", "compare_shapes", "composite_two_rectangles_area"]), directIds: new Set(["area_vs_perimeter_concept", "reverse_rect_area_missing_side"]) },
  timeCalendar: { mode: "decimal", diagramIds: new Set(["dow_forward", "dow_backward", "duration_simple_minutes", "clock_duration_cross_hour", "elapsed_time_find_duration", "timetable_schedule"]), directIds: new Set(["unit_convert_time", "leap_year_identify"]) },
  shapeProperties: { mode: "multiply", diagramIds: new Set(["polygon_name_from_sides", "coordinates_read_point", "translate_point_vector"]), directIds: new Set(["quadrilateral_property_recall", "missing_property_reasoning"]) },
  angleBasics: { mode: "multiply", diagramIds: new Set(["missing_angle_straight_line", "missing_angle_point", "triangle_missing_angle"]), directIds: new Set(["always_sometimes_never_reasoning", "order_angles_by_size"]) },
  symmetryReflection: { mode: "multiply", diagramIds: new Set(["reflect_point_axis", "complete_pattern_vertical_mirror", "reflect_triangle_vertices"]), directIds: new Set(["lines_of_symmetry_regular", "symmetry_vs_rotational_contrast"]) },
  sequencePattern: { mode: "decimal", diagramIds: new Set(["cycle_position_forward", "missing_term_in_sequence", "identify_rule_from_terms", "shape_growth_pattern", "two_attribute_combo", "nth_term_formula_evaluation", "two_stage_sequence"]), directIds: new Set(["arithmetic_next_term", "derive_nth_term_rule"]) },
  logicGrid: { mode: "decimal", diagramIds: new Set(["row_of_three_position", "row_position_n", "circular_seating_neighbours", "two_by_two_grid", "chain_comparison_order", "linked_two_attribute_grid"]), directIds: new Set(["must_be_true_statement", "always_sometimes_never"]) },
  combinatoricsCounting: { mode: "multiply", diagramIds: new Set(["mult_principle_2way", "mult_principle_3way", "permutations_row", "systematic_listing_constrained", "counting_squares_grid", "route_counting_grid"]), directIds: new Set(["combinations_pairs", "handshakes_classic"]) },
  spatialPuzzles: { mode: "multiply", diagramIds: new Set(["paper_fold_cut", "net_identify", "view_from_above", "area_partition"]), directIds: new Set(["shape_fev", "cuboid_unit_cubes_simple"]) },
};

function PF_presentRemainingTopic(question, topic) {
  const config = PF_REMAINING_PRESENTATIONS[topic];
  const id = question.structureId;
  if (question.svg) return PF_withPresentation(question, { q: question.q, variantId: `${id}_visual`, representation: "diagram", svg: question.svg });
  if (config.diagramIds.has(id) && Math.random() < 0.7) return PF_withPresentation(question, { q: question.q, variantId: `${id}_model`, representation: "diagram", svg: PF_arithmeticDiagramSvg(question, config.mode) });
  if (config.directIds.has(id) && Math.random() < 0.65) return PF_withPresentation(question, { q: question.q, variantId: `${id}_notation`, representation: "direct" });
  if (Math.random() < 0.08) return PF_withPresentation(question, { q: question.q, variantId: `${id}_plain`, representation: "direct" });
  const context = pick(Object.keys(PF_COMMON_CONTEXTS));
  return PF_withPresentation(question, { q: `${PF_COMMON_CONTEXTS[context]} ${question.q}`, variantId: `${id}_${context}`, representation: "story" });
}

const ADDITION_SUBTRACTION_STRUCTURES = {
  remaining_amount: {
    difficulties: [1, 2, 3, 4],
    curriculum: "KS2 addition and subtraction problem solving",
    contexts: ["football_time", "journey_distance", "orchard_stock", "water_capacity", "score_target"],
    build(d) {
      const variantId = pick(this.contexts);
      const name = pick(AS_NAMES);
      let q, correct, steps;
      if (d === 1) {
        const total = rand(45, 120); const used = rand(12, total - 15); correct = total - used;
        const stories = {
          football_time: `A Ninefold Orchard football match lasts ${total} minutes. ${name}'s team takes the lead after ${used} minutes. How many minutes remain?`,
          journey_distance: `${name} is walking a ${total} km orchard trail and stops after ${used} km. How many kilometres remain?`,
          orchard_stock: `The storehouse begins with ${total} baskets of apples. ${name} carries out ${used} baskets. How many baskets remain?`,
          water_capacity: `A rain barrel holds ${total} litres. ${name} uses ${used} litres. How many litres remain?`,
          score_target: `${name} needs ${total} points to open the orchard gate and has already earned ${used}. How many more points are needed?`,
        };
        q = stories[variantId];
        steps = [`The whole amount is ${total}.`, `${used} has been used, travelled or earned, so subtract: ${total} - ${used} = ${correct}.`, `Check: ${used} + ${correct} = ${total}.`];
      } else if (d === 2) {
        const total = rand(130, 320); const first = rand(25, 90); const second = rand(18, Math.min(80, total - first - 20)); correct = total - first - second;
        q = `${name} has ${total} orchard tokens. First ${first} are spent repairing a bridge, then ${second} are spent on seed. How many tokens remain?`;
        steps = [`Start with ${total} tokens.`, `After the bridge repair: ${total} - ${first} = ${total - first}.`, `After buying seed: ${total - first} - ${second} = ${correct}.`, `Check: ${first} + ${second} + ${correct} = ${total}.`];
      } else if (d === 3) {
        const total = rand(350, 750); const first = rand(80, 180); const returned = rand(15, 55); const second = rand(60, 150); correct = total - first + returned - second;
        q = `The Ninefold store holds ${total} jars. ${name} sends ${first} jars to the market, receives ${returned} unused jars back, then sends ${second} jars to the mill. How many jars remain?`;
        steps = [`After the market delivery: ${total} - ${first} = ${total - first}.`, `Returned jars are added: ${total - first} + ${returned} = ${total - first + returned}.`, `After the mill delivery: ${total - first + returned} - ${second} = ${correct}.`, `Check the net change: -${first} + ${returned} - ${second} = ${correct - total}.`];
      } else {
        const first = rand(120, 260); const second = rand(75, 190); const returned = rand(20, 70); const remain = rand(140, 300); correct = remain + first + second - returned;
        q = `After ${name} sends ${first} fruit crates to Row Two, sends ${second} to the mill and receives ${returned} empty crates back, ${remain} crates remain in the yard. How many crates were there at the start?`;
        steps = [`Work backwards from the final ${remain} crates.`, `Undo the returned crates by subtracting ${returned}: ${remain} - ${returned} = ${remain - returned}.`, `Undo the two deliveries by adding them back: ${remain - returned} + ${second} + ${first} = ${correct}.`, `Check forwards: ${correct} - ${first} - ${second} + ${returned} = ${remain}.`];
      }
      const { options, correctIndex } = AS_numericQuestion(correct, [correct + 10, correct - 10, correct + 1, Math.abs(correct - 1), correct + 20]);
      return { q, options, correctIndex, variantId, representation: "story", hint: "Identify the starting whole, then follow each change in the order it happens.", solution: { scenario: q, idea: "A remaining-amount problem tracks a whole as quantities leave or return.", method: ["Identify the whole or final amount.", "Follow the changes in order, or reverse them if the start is unknown.", "Check by rebuilding the original relationship."], steps, check: steps[steps.length - 1] } };
    },
  },
  combine_totals: {
    difficulties: [1, 2, 3, 4],
    curriculum: "KS2 addition and subtraction problem solving",
    contexts: ["harvest_baskets", "orchard_visitors", "market_coins", "library_books", "seed_packets"],
    build(d) {
      const variantId = pick(this.contexts); const firstName = pick(AS_NAMES); const secondName = pick(AS_NAMES.filter((name) => name !== firstName));
      let q, correct, steps;
      if (d === 1) {
        const a = rand(18, 75); const b = rand(16, 70); correct = a + b;
        q = `${firstName} gathers ${a} windfall apples and ${secondName} gathers ${b}. How many apples do they gather altogether?`;
        steps = [`The two parts are ${a} and ${b}.`, `Join them: ${a} + ${b} = ${correct}.`, `Estimate: the answer should be close to ${Math.round(a / 10) * 10 + Math.round(b / 10) * 10}.`];
      } else if (d === 2) {
        const a = rand(45, 120); const b = rand(35, 105); const c = rand(25, 95); correct = a + b + c;
        q = `Three Ninefold rows send ${a}, ${b} and ${c} baskets to the storehouse. How many baskets arrive altogether?`;
        steps = [`Combine the first two rows: ${a} + ${b} = ${a + b}.`, `Add the third row: ${a + b} + ${c} = ${correct}.`, `Check by adding in another order: ${a} + (${b} + ${c}) = ${correct}.`];
      } else if (d === 3) {
        const a = rand(120, 260); const b = rand(100, 230); const extra = rand(30, 90); const spoiled = rand(15, 65); correct = a + b + extra - spoiled;
        q = `${firstName} and ${secondName} bring ${a} and ${b} pears to the market. Another cart adds ${extra}, but ${spoiled} pears are bruised and removed. How many saleable pears remain?`;
        steps = [`Combine the first deliveries: ${a} + ${b} = ${a + b}.`, `Add the extra cart: ${a + b} + ${extra} = ${a + b + extra}.`, `Remove the bruised pears: ${a + b + extra} - ${spoiled} = ${correct}.`, `Check that the result is smaller than the full delivery of ${a + b + extra}.`];
      } else {
        const first = rand(180, 340); const second = rand(150, 310); const removed = rand(45, 110); const final = first + second - removed; correct = second;
        q = `Two barns together supplied ${first + second} sacks. After ${removed} damaged sacks were removed, ${final} good sacks remained. The first barn supplied ${first} sacks. How many came from the second barn?`;
        steps = [`Recover the combined supply before damage: ${final} + ${removed} = ${first + second}.`, `Subtract the first barn's ${first} sacks: ${first + second} - ${first} = ${correct}.`, `Check: ${first} + ${correct} - ${removed} = ${final}.`];
      }
      const { options, correctIndex } = AS_numericQuestion(correct, [correct + 10, correct - 10, correct + 20, Math.abs(correct - 20), correct + 1]);
      return { q, options, correctIndex, variantId, representation: "story", hint: "Decide which quantities are parts being joined and which quantities must be removed.", solution: { scenario: q, idea: "A combine problem builds a whole from several parts, sometimes followed by a change.", method: ["Identify every part.", "Combine additions before applying any removal.", "Check the final amount against the original parts."], steps, check: steps[steps.length - 1] } };
    },
  },
  difference_compare: {
    difficulties: [1, 2, 3, 4],
    curriculum: "KS2 additive comparison",
    contexts: ["tree_height", "match_score", "path_distance", "fruit_store", "harvest_total"],
    build(d) {
      const variantId = pick(this.contexts); const firstName = pick(AS_NAMES); const secondName = pick(AS_NAMES.filter((name) => name !== firstName));
      let first, second, correct, q, steps;
      if (d === 1) {
        first = rand(45, 110); second = rand(15, first - 8); correct = first - second;
        q = `${firstName} collects ${first} plums and ${secondName} collects ${second}. How many more plums does ${firstName} collect?`;
        steps = [`The larger amount is ${first}; the smaller is ${second}.`, `Find the gap: ${first} - ${second} = ${correct}.`, `Check: ${second} + ${correct} = ${first}.`];
      } else if (d === 2) {
        first = rand(100, 220); second = rand(70, first - 15); const added = rand(12, 45); correct = first - (second + added);
        q = `${firstName} has ${first} orchard points. ${secondName} has ${second}, then earns ${added} more. What is the new gap between their scores?`;
        steps = [`Update ${secondName}'s score: ${second} + ${added} = ${second + added}.`, `Compare the scores: ${first} - ${second + added} = ${correct}.`, `Check by adding the gap to the smaller updated score.`];
      } else if (d === 3) {
        first = rand(180, 360); second = rand(140, first - 20); const firstChange = rand(25, 70); const secondChange = rand(15, 65); first += firstChange; second -= secondChange; correct = first - second;
        q = `Two Ninefold stores begin with ${first - firstChange} and ${second + secondChange} baskets. The first receives ${firstChange} more while the second sends away ${secondChange}. What is the difference between their new stocks?`;
        steps = [`First store: ${first - firstChange} + ${firstChange} = ${first}.`, `Second store: ${second + secondChange} - ${secondChange} = ${second}.`, `New difference: ${first} - ${second} = ${correct}.`, `The changes widen the original gap by ${firstChange + secondChange}.`];
      } else {
        const gap = pick([20, 40, 60, 80, 100]); second = rand(210, 360); first = second + gap; const total = first + second; correct = first;
        q = `Two orchard rows produce ${total} baskets altogether. The stronger row produces ${gap} more baskets than the other. How many baskets does the stronger row produce?`;
        steps = [`Remove the extra ${gap} baskets from the total: ${total} - ${gap} = ${total - gap}.`, `The remaining amount represents two equal smaller-row shares: ${total - gap} / 2 = ${second}.`, `Put the extra back onto the stronger row: ${second} + ${gap} = ${correct}.`, `Check: ${correct} + ${second} = ${total}.`];
      }
      const { options, correctIndex } = AS_numericQuestion(correct, [correct + 10, correct - 10, correct + 20, Math.abs(correct - 20), correct + 1]);
      return { q, svg: AS_compareSvg(first, second, firstName, secondName), options, correctIndex, variantId, representation: Math.random() < 0.5 ? "story" : "diagram", hint: "A comparison asks for the gap between two quantities, not their total.", solution: { scenario: q, idea: "Subtraction measures the distance between two quantities. If either quantity changes, update it before comparing.", method: ["Work out the current quantities.", "Subtract the smaller from the larger.", "Check by adding the gap back to the smaller quantity."], steps, check: steps[steps.length - 1] } };
    },
  },
  number_line_change: {
    difficulties: [1, 2, 3, 4],
    curriculum: "KS2 addition and subtraction on a number line",
    contexts: ["orchard_path", "winter_temperature", "cellar_lift", "stream_height", "match_score"],
    build(d) {
      const variantId = pick(this.contexts); let start, moves, correct, q, steps;
      if (d === 1) {
        start = rand(8, 45); const move = pick([rand(6, 24), -rand(4, Math.min(18, start))]); moves = [move]; correct = start + move;
        q = `Start at ${start} on the orchard number path and move ${Math.abs(move)} places ${move >= 0 ? "forwards" : "backwards"}. Where do you land?`;
        steps = [`Start at ${start}.`, `${move >= 0 ? "Moving forwards means add" : "Moving backwards means subtract"}: ${start} ${move >= 0 ? "+" : "-"} ${Math.abs(move)} = ${correct}.`, `Reverse the move to check that you return to ${start}.`];
      } else if (d === 2) {
        start = rand(-12, 12); const move = start >= 0 ? -rand(start + 2, start + 18) : rand(Math.abs(start) + 2, Math.abs(start) + 18); moves = [move]; correct = start + move;
        q = `The orchard thermometer starts at ${start}°C and changes by ${move >= 0 ? "+" : ""}${move}°C. What temperature does it reach?`;
        steps = [`Mark ${start} on the number line.`, `Apply the change ${move >= 0 ? "+" : ""}${move}: ${start} ${move >= 0 ? "+" : "-"} ${Math.abs(move)} = ${correct}.`, `The movement crosses zero, but the counting continues normally.`];
      } else if (d === 3) {
        start = rand(-20, 30); const first = rand(12, 35); const second = -rand(18, 42); moves = [first, second]; correct = start + first + second;
        q = `A cellar lift begins on level ${start}. It rises ${first} levels, then descends ${Math.abs(second)} levels. On which level does it finish?`;
        steps = [`After rising: ${start} + ${first} = ${start + first}.`, `After descending: ${start + first} - ${Math.abs(second)} = ${correct}.`, `Check the net movement: ${first} - ${Math.abs(second)} = ${first + second}.`];
      } else {
        const first = rand(24, 58); const second = -rand(30, 65); const end = rand(-18, 24); moves = [first, second]; start = end - first - second; correct = start;
        q = `A marker rises ${first} places, then falls ${Math.abs(second)} places and finishes at ${end}. Where did it start?`;
        steps = [`Work backwards from ${end}.`, `Undo the fall by adding ${Math.abs(second)}: ${end} + ${Math.abs(second)} = ${end - second}.`, `Undo the rise by subtracting ${first}: ${end - second} - ${first} = ${correct}.`, `Check forwards: ${correct} + ${first} - ${Math.abs(second)} = ${end}.`];
      }
      const end = d === 4 ? (start + moves.reduce((sum, move) => sum + move, 0)) : correct;
      const { options, correctIndex } = AS_numericQuestion(correct, [correct + 5, correct - 5, -correct, correct + 10, correct - 10]);
      return { q, svg: AS_numberLineSvg(start, moves, end), options, correctIndex, variantId, representation: "diagram", hint: "Follow each signed movement in order. If the starting point is missing, undo the moves in reverse order.", solution: { scenario: q, idea: "A number line turns addition and subtraction into movement, including movement through zero.", method: ["Mark the known position.", "Apply each move in order, or undo moves backwards.", "Check by reversing the complete journey."], steps, check: steps[steps.length - 1] } };
    },
  },
  calculation_detective: {
    difficulties: [1, 2, 3, 4],
    curriculum: "KS2 inverse operations and arithmetic reasoning",
    contexts: ["missing_addend", "missing_subtrahend", "operation_choice", "error_diagnosis", "missing_digit"],
    build(d) {
      const name = pick(AS_NAMES); let variantId, q, correct, steps;
      if (d === 1) {
        variantId = "missing_addend"; const known = rand(18, 75); const missing = rand(12, 65); const total = known + missing; correct = missing;
        q = `${known} + □ = ${total}. What number belongs in the box?`;
        steps = [`The total is ${total} and one part is ${known}.`, `Use the inverse operation: ${total} - ${known} = ${correct}.`, `Check: ${known} + ${correct} = ${total}.`];
      } else if (d === 2) {
        variantId = "missing_subtrahend"; const start = rand(110, 260); const removed = rand(35, 105); const end = start - removed; correct = removed;
        q = `${start} - □ = ${end}. What number was subtracted?`;
        steps = [`The gap from ${end} back to ${start} is the missing amount.`, `Calculate ${start} - ${end} = ${correct}.`, `Check: ${start} - ${correct} = ${end}.`];
      } else if (d === 3) {
        variantId = "error_diagnosis"; const a = rand(240, 680); const b = rand(90, 230); const claimed = a - b + pick([-20, -10, 10, 20]); correct = a - b;
        q = `${name} claims that ${a} - ${b} = ${claimed}. What should the answer be?`;
        steps = [`Estimate first: ${Math.round(a / 100) * 100} - ${Math.round(b / 100) * 100} is about ${Math.round(a / 100) * 100 - Math.round(b / 100) * 100}.`, `Calculate accurately: ${a} - ${b} = ${correct}.`, `${claimed} differs from the correct result by ${Math.abs(claimed - correct)}, so the claim is not correct.`, `Check: ${correct} + ${b} = ${a}.`];
      } else {
        variantId = "missing_digit"; const tens = rand(2, 8); const digit = rand(0, 9); const first = rand(320, 780); const second = tens * 10 + digit; const total = first + second; correct = digit;
        q = `${first} + ${tens}□ = ${total}. Which digit replaces the box?`;
        steps = [`Find the complete missing addend: ${total} - ${first} = ${second}.`, `The tens digit ${tens} is already shown.`, `The ones digit of ${second} is ${correct}, so that is the missing digit.`, `Check: ${first} + ${second} = ${total}.`];
      }
      const digitCandidates = d === 4 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((value) => value !== correct) : [correct + 10, Math.abs(correct - 10), correct + 1, Math.abs(correct - 1), correct + 20];
      const { options, correctIndex } = AS_numericQuestion(correct, digitCandidates);
      return { q, options, correctIndex, variantId, representation: "direct", hint: "Use addition and subtraction as inverse operations, then check the completed statement.", solution: { scenario: q, idea: "A calculation detective uses inverse operations, estimation and place value to recover or check missing information.", method: ["Identify the missing part or suspected error.", "Use the inverse operation.", "Substitute the result back into the original statement."], steps, check: steps[steps.length - 1] } };
    },
  },
};


const PERCENTAGE_STRUCTURES = {
  convert_percent_forms: { difficulties: [1,2,3,4], curriculum: "KS2 fraction, decimal and percentage equivalence", build() { const p = pick([10,20,25,40,50,60,75,80]); const correct = p / 100; const { options, correctIndex } = buildMC(correct, [p / 10, (100 - p) / 100, correct + 0.1, Math.max(0, correct - 0.1)], (v) => String(Number(v.toFixed(2)))); return { q: `Write ${p}% as a decimal.`, options, correctIndex, solution: { steps: [`${p}% means ${p}/100.`, `${p} ÷ 100 = ${correct}.`] } }; } },
  percent_of_amount: { difficulties: [1,2,3,4], curriculum: "KS2 percentages of amounts", build(d) { const p = pick(d <= 1 ? [10,25,50] : [5,10,15,20,25,40,60,75]); const unit = rand(2, 5 + d * 3), total = unit * 100, correct = unit * p; const { options, correctIndex } = buildMC(correct, [unit * (100 - p), correct + unit, Math.max(1, correct - unit), unit * (p + 10), unit * Math.max(1, p - 10)]); return { q: `Find ${p}% of ${total} Ninefold apples.`, options, correctIndex, solution: { steps: [`1% of ${total} is ${unit}.`, `${p}% is ${unit} × ${p} = ${correct}.`, `Check the answer is ${p}/100 of the whole.`] } }; } },
  percentage_change: { difficulties: [1,2,3,4], curriculum: "KS2 percentage increases and decreases", build(d) { const p = pick([10,20,25,50]), unit = rand(2, 7 + d * 2), start = unit * 100, change = unit * p, down = pick([true,false]), correct = down ? start - change : start + change; const { options, correctIndex } = buildMC(correct, [change, start, down ? start + change : start - change, correct + unit]); return { q: `The Ninefold market price is ${start} tokens and is ${down ? "reduced" : "increased"} by ${p}%. What is the new price?`, options, correctIndex, solution: { steps: [`${p}% of ${start} is ${change}.`, `${start} ${down ? "-" : "+"} ${change} = ${correct}.`] } }; } },
  reverse_percentage: { difficulties: [1,2,3,4], curriculum: "KS2 reverse percentage reasoning", build(d) { const p = pick([10,20,25,40,50]), unit = rand(2, 8 + d * 2), part = unit * p, correct = unit * 100; const { options, correctIndex } = buildMC(correct, [part * 100, part + p, unit * (100 - p), correct + 100]); return { q: `${p}% of a Ninefold harvest is ${part} baskets. How many baskets are in the whole harvest?`, options, correctIndex, solution: { steps: [`1% is ${part} ÷ ${p} = ${unit}.`, `100% is ${unit} × 100 = ${correct}.`, `Check: ${p}% of ${correct} is ${part}.`] } }; } },
  compare_percent_amounts: { difficulties: [1,2,3,4], curriculum: "KS2 comparing percentage quantities", build(d) { const p1 = pick([20,25,40,50]), p2 = pick([20,25,40,50]), t1 = rand(2,7+d)*100, t2 = rand(2,7+d)*100, a = p1*t1/100, b = p2*t2/100; if (a === b) return null; const correct = Math.max(a,b); const { options, correctIndex } = buildMC(correct, [Math.min(a,b), a+b, Math.abs(a-b), correct+10]); return { q: `Which is greater: ${p1}% of ${t1}, or ${p2}% of ${t2}?`, options, correctIndex, solution: { steps: [`${p1}% of ${t1} = ${a}.`, `${p2}% of ${t2} = ${b}.`, `Compare the results: ${correct} is greater.`] } }; } },
};

const STATISTICS_STRUCTURES = {
  read_data_table: { difficulties: [1,2,3,4], curriculum: "KS2 tables and charts", build(d) { const values = [rand(8,30+d*10), rand(8,30+d*10), rand(8,30+d*10)], index = rand(0,2), correct = values[index]; const { options, correctIndex } = buildMC(correct, [...values.filter((_,i)=>i!==index), correct+5, Math.max(0,correct-5)]); return { q: `A table records Row 1: ${values[0]} baskets, Row 2: ${values[1]} baskets and Row 3: ${values[2]} baskets. How many are recorded for Row ${index+1}?`, options, correctIndex, solution: { steps: [`Locate Row ${index+1}.`, `Read its value: ${correct} baskets.`] } }; } },
  data_total_difference: { difficulties: [1,2,3,4], curriculum: "KS2 interpreting data", build(d) { const a=rand(10,40+d*15), b=rand(10,40+d*15), total=pick([true,false]), correct=total?a+b:Math.abs(a-b); const {options,correctIndex}=buildMC(correct,[total?Math.abs(a-b):a+b,a,b,correct+1]); return {q:`A chart shows ${a} apple baskets and ${b} pear baskets. What is the ${total?"total":"difference"}?`,options,correctIndex,solution:{steps:[total?`Add the categories: ${a} + ${b} = ${correct}.`:`Subtract the smaller from the larger: ${Math.max(a,b)} - ${Math.min(a,b)} = ${correct}.`,"Interpret the result using baskets."]}}; } },
  mean_average: { difficulties: [1,2,3,4], curriculum: "KS2 mean average", build(d) { const mean=rand(7,15+d*5), offsets=pick([[-3,-1,1,3],[-6,-2,2,6]]), values=offsets.map(x=>mean+x), total=values.reduce((a,b)=>a+b,0), correct=mean; const {options,correctIndex}=buildMC(correct,[total,correct+1,correct-1,total/2]); return {q:`Find the mean of ${values.join(", ")}.`,options,correctIndex,solution:{steps:[`Add the values: ${values.join(" + ")} = ${total}.`,`Divide by 4: ${total} ÷ 4 = ${correct}.`]}}; } },
  line_graph_change: { difficulties: [1,2,3,4], curriculum: "KS2 line graphs", build(d) { const a=rand(5,30+d*10), b=rand(5,30+d*10); if(a===b)return null; const correct=Math.abs(b-a); const {options,correctIndex}=buildMC(correct,[a,b,a+b,correct+1]); return {q:`A line graph changes from ${a} baskets on Monday to ${b} on Tuesday. By how many baskets does it change?`,options,correctIndex,solution:{steps:[`Read the endpoints: ${a} and ${b}.`,`Find the gap: ${Math.max(a,b)} - ${Math.min(a,b)} = ${correct}.`,`It is a ${b>a?"rise":"fall"}.`]}}; } },
  pie_chart_share: { difficulties: [1,2,3,4], curriculum: "KS2 pie charts and percentages", build(d) { const [n,den]=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,10]]), unit=rand(2,8+d*2), total=unit*den, correct=unit*n; const {options,correctIndex}=buildMC(correct,[total-correct,total,correct+unit,Math.max(1,correct-unit)]); return {q:`${n}/${den} of a pie chart represents apple baskets. The chart covers ${total} baskets. How many are apple baskets?`,options,correctIndex,solution:{steps:[`One ${den}th of ${total} is ${unit}.`,`Take ${n} parts: ${unit} × ${n} = ${correct}.`]}}; } },
};

const FOUR_OPERATIONS_STRUCTURES = {
  choose_the_operation: {
    difficulties: [1, 2, 3, 4], curriculum: "KS2 choosing operations in context",
    build(d) {
      const a = rand(12, 30 + d * 30), b = rand(3, Math.min(a - 1, 8 + d * 5));
      const kind = pick(["combine", "difference", "groups", "share"]);
      const questions = {
        combine: [`Pip gathers ${a} apples and Sorrel gathers ${b}. Which calculation finds how many they have altogether?`, `${a} + ${b}`],
        difference: [`Bushel has ${a} baskets and Tuppence has ${b}. Which calculation finds how many more Bushel has?`, `${a} - ${b}`],
        groups: [`There are ${a} rows with ${b} trees in each. Which calculation finds the total number of trees?`, `${a} × ${b}`],
        share: [`${a * b} seeds are shared equally between ${b} rows. Which calculation finds the seeds in each row?`, `${a * b} ÷ ${b}`],
      };
      const [q, answer] = questions[kind];
      const { options, correctIndex } = buildMCStr(answer, [`${a} + ${b}`, `${a} - ${b}`, `${a} × ${b}`, `${a * b} ÷ ${b}`, `${a} ÷ ${b}`, `(${a} + ${b}) × ${b}`].filter((value) => value !== answer));
      return { q, options, correctIndex, solution: { steps: ["Identify whether the situation joins, compares, groups or shares.", `The matching calculation is ${answer}.`] } };
    },
  },
  equal_groups_and_sharing: {
    difficulties: [1, 2, 3, 4], curriculum: "KS2 multiplication and division problems",
    build(d) {
      const groups = rand(3, 6 + d * 2), each = rand(4, 8 + d * 4), total = groups * each, reverse = d > 1 && pick([true, false]);
      const correct = reverse ? groups : total;
      const q = reverse ? `${total} Ninefold fruit jars are packed ${each} to a crate. How many crates are filled?` : `${groups} Ninefold crates each hold ${each} fruit jars. How many jars are there altogether?`;
      const { options, correctIndex } = buildMC(correct, [correct + 1, Math.max(1, correct - 1), groups + each, total + each]);
      return { q, options, correctIndex, solution: { steps: [reverse ? `Equal sharing gives ${total} ÷ ${each}.` : `Equal groups give ${groups} × ${each}.`, `The result is ${correct}.`, reverse ? `${correct} × ${each} = ${total}, so the division checks.` : `${total} ÷ ${groups} = ${each}, so the multiplication checks.`] } };
    },
  },
  multi_step_quantity_change: {
    difficulties: [1, 2, 3, 4], curriculum: "KS2 multi-step four-operation problems",
    build(d) {
      const crates = rand(3, 7 + d), each = rand(8, 15 + d * 4), removed = rand(5, Math.min(30, crates * each - 2));
      const extra = d >= 3 ? rand(4, 20) : 0, correct = crates * each - removed + extra;
      const q = `${crates} orchard crates hold ${each} pears each. ${removed} pears are used${extra ? ` and ${extra} more arrive` : ""}. How many pears remain?`;
      const { options, correctIndex } = buildMC(correct, [crates * each, correct + removed, Math.max(1, correct - extra), correct + 1]);
      return { q, options, correctIndex, solution: { steps: [`First find the starting total: ${crates} × ${each} = ${crates * each}.`, `Follow the changes: ${crates * each} - ${removed}${extra ? ` + ${extra}` : ""} = ${correct}.`, "Check that each change moves the total in the stated direction."] } };
    },
  },
  inverse_missing_quantity: {
    difficulties: [1, 2, 3, 4], curriculum: "KS2 inverse operations and missing-number problems",
    build(d) {
      const groups = rand(3, 8 + d), each = rand(5, 12 + d * 3), used = rand(4, 18 + d * 3), final = groups * each - used, correct = groups;
      const q = `Some equal Ninefold crates held ${each} apples each. After ${used} apples were used, ${final} remained. How many crates were there?`;
      const { options, correctIndex } = buildMC(correct, [each, used, groups + 1, Math.max(1, groups - 1)]);
      return { q, options, correctIndex, solution: { steps: [`Undo the use: ${final} + ${used} = ${groups * each}.`, `Divide by ${each} apples per crate: ${groups * each} ÷ ${each} = ${correct}.`, `Check: ${correct} × ${each} - ${used} = ${final}.`] } };
    },
  },
  expression_order_and_brackets: {
    difficulties: [1, 2, 3, 4], curriculum: "KS2 order of operations",
    build(d) {
      const a = rand(3, 8 + d), b = rand(2, 7 + d), c = rand(2, 9 + d), bracketed = d >= 3 && pick([true, false]);
      const correct = bracketed ? (a + b) * c : a + b * c;
      const q = bracketed ? `Work out (${a} + ${b}) × ${c}.` : `Work out ${a} + ${b} × ${c}. Remember the order of operations.`;
      const { options, correctIndex } = buildMC(correct, [a + b + c, (a + b) * c, a * b + c, correct + 1]);
      return { q, options, correctIndex, solution: { steps: [bracketed ? `Brackets come first: ${a} + ${b} = ${a + b}.` : `Multiplication comes before addition: ${b} × ${c} = ${b * c}.`, bracketed ? `${a + b} × ${c} = ${correct}.` : `${a} + ${b * c} = ${correct}.`] } };
    },
  },
};

export const PRIMARY_STRUCTURES = { placeValue: PLACE_VALUE_STRUCTURES, roundingEstimate: ROUNDING_ESTIMATE_STRUCTURES, negativeNumbers: NEGATIVE_NUMBERS_STRUCTURES, additionSubtraction: ADDITION_SUBTRACTION_STRUCTURES, compensationMentalMaths: COMPENSATION_STRUCTURES, timesTablesFacts: TIMES_TABLES_STRUCTURES, factorsMultiplesPrimes: FACTORS_MULTIPLES_STRUCTURES, formalMultiplication: FORMAL_MULTIPLICATION_STRUCTURES, formalDivision: FORMAL_DIVISION_STRUCTURES, divisionRemainders: DIVISION_REMAINDERS_STRUCTURES, fourOperationsProblems: FOUR_OPERATIONS_STRUCTURES, fractionOfQuantity: FRACTION_OF_QUANTITY_STRUCTURES, fractionEquivalence: FRACTION_EQUIVALENCE_STRUCTURES, fractionArithmetic: FRACTION_ARITHMETIC_STRUCTURES, decimalPlaceValue: DECIMAL_PLACE_VALUE_STRUCTURES, percentages: PERCENTAGE_STRUCTURES, ratioBasics: RATIO_BASICS_STRUCTURES, unitConversion: UNIT_CONVERSION_STRUCTURES, twoUnknowns: TWO_UNKNOWNS_STRUCTURES, additiveMultiplicative: ADDITIVE_MULTIPLICATIVE_STRUCTURES, areaPerimeter: AREA_PERIMETER_STRUCTURES, timeCalendar: TIME_CALENDAR_STRUCTURES, statistics: STATISTICS_STRUCTURES, shapeProperties: SHAPE_PROPERTIES_STRUCTURES, angleBasics: ANGLE_BASICS_STRUCTURES, sequencePattern: SEQUENCE_PATTERN_STRUCTURES, symmetryReflection: SYMMETRY_REFLECTION_STRUCTURES, combinatoricsCounting: COMBINATORICS_COUNTING_STRUCTURES, spatialPuzzles: SPATIAL_PUZZLES_STRUCTURES, logicGrid: LOGIC_GRID_STRUCTURES };

export const PRIMARY_G = {
  // Every topic is built from a registry of named structures (see PRIMARY_STRUCTURES /
  // gen-shared.js `pickStructure`), each declaring which difficulty band(s) it's graded
  // for. Tagging output with structureId makes the sanity tests able to verify every
  // declared structure actually generates at every difficulty it claims, and that no one
  // structure dominates the random sampling.
  placeValue(d) {
    return PF_presentPlaceValue(pickStructure(PLACE_VALUE_STRUCTURES, d));
  },
  roundingEstimate(d) {
    return PF_presentRounding(pickStructure(ROUNDING_ESTIMATE_STRUCTURES, d));
  },
  negativeNumbers(d) {
    return PF_presentNegative(pickStructure(NEGATIVE_NUMBERS_STRUCTURES, d));
  },
  additionSubtraction(d) {
    return pickStructure(ADDITION_SUBTRACTION_STRUCTURES, d);
  },
  fourOperationsProblems(d) {
    return PF_presentArithmeticTopic(pickStructure(FOUR_OPERATIONS_STRUCTURES, d), PF_FOUR_OPERATIONS_PRESENTATION);
  },
  percentages(d) {
    return PF_presentArithmeticTopic(pickStructure(PERCENTAGE_STRUCTURES, d), PF_PERCENTAGE_PRESENTATION);
  },
  statistics(d) {
    return PF_presentArithmeticTopic(pickStructure(STATISTICS_STRUCTURES, d), PF_STATISTICS_PRESENTATION);
  },
  timesTablesFacts(d) {
    return PF_presentArithmeticTopic(pickStructure(TIMES_TABLES_STRUCTURES, d), PF_TIMES_PRESENTATION);
  },
  divisionRemainders(d) {
    return PF_presentArithmeticTopic(pickStructure(DIVISION_REMAINDERS_STRUCTURES, d), PF_DIVISION_REMAINDERS_PRESENTATION);
  },
  factorsMultiplesPrimes(d) {
    return PF_presentArithmeticTopic(pickStructure(FACTORS_MULTIPLES_STRUCTURES, d), PF_FACTORS_PRESENTATION);
  },
  sequencePattern(d) {
    return PF_presentRemainingTopic(pickStructure(SEQUENCE_PATTERN_STRUCTURES, d), "sequencePattern");
  },
  fractionEquivalence(d) {
    return PF_presentArithmeticTopic(pickStructure(FRACTION_EQUIVALENCE_STRUCTURES, d), PF_FRACTION_EQUIVALENCE_PRESENTATION);
  },
  fractionArithmetic(d) {
    return PF_presentArithmeticTopic(pickStructure(FRACTION_ARITHMETIC_STRUCTURES, d), PF_FRACTION_ARITHMETIC_PRESENTATION);
  },
  fractionOfQuantity(d) {
    return PF_presentArithmeticTopic(pickStructure(FRACTION_OF_QUANTITY_STRUCTURES, d), PF_FRACTION_AMOUNT_PRESENTATION);
  },
  decimalPlaceValue(d) {
    return PF_presentArithmeticTopic(pickStructure(DECIMAL_PLACE_VALUE_STRUCTURES, d), PF_DECIMAL_PRESENTATION);
  },
  ratioBasics(d) {
    return PF_presentRemainingTopic(pickStructure(RATIO_BASICS_STRUCTURES, d), "ratioBasics");
  },
  twoUnknowns(d) {
    return PF_presentRemainingTopic(pickStructure(TWO_UNKNOWNS_STRUCTURES, d), "twoUnknowns");
  },
  additiveMultiplicative(d) {
    return PF_presentRemainingTopic(pickStructure(ADDITIVE_MULTIPLICATIVE_STRUCTURES, d), "additiveMultiplicative");
  },
  unitConversion(d) {
    return PF_presentRemainingTopic(pickStructure(UNIT_CONVERSION_STRUCTURES, d), "unitConversion");
  },
  areaPerimeter(d) {
    return PF_presentRemainingTopic(pickStructure(AREA_PERIMETER_STRUCTURES, d), "areaPerimeter");
  },
  timeCalendar(d) {
    return PF_presentRemainingTopic(pickStructure(TIME_CALENDAR_STRUCTURES, d), "timeCalendar");
  },
  compensationMentalMaths(d) {
    return PF_presentCompensation(pickStructure(COMPENSATION_STRUCTURES, d));
  },
  formalMultiplication(d) {
    return PF_presentArithmeticTopic(pickStructure(FORMAL_MULTIPLICATION_STRUCTURES, d), PF_FORMAL_MULTIPLICATION_PRESENTATION);
  },
  formalDivision(d) {
    return PF_presentArithmeticTopic(pickStructure(FORMAL_DIVISION_STRUCTURES, d), PF_FORMAL_DIVISION_PRESENTATION);
  },
  logicGrid(d) {
    return PF_presentRemainingTopic(pickStructure(LOGIC_GRID_STRUCTURES, d), "logicGrid");
  },
  combinatoricsCounting(d) {
    return PF_presentRemainingTopic(pickStructure(COMBINATORICS_COUNTING_STRUCTURES, d), "combinatoricsCounting");
  },
  angleBasics(d) {
    return PF_presentRemainingTopic(pickStructure(ANGLE_BASICS_STRUCTURES, d), "angleBasics");
  },
  shapeProperties(d) {
    return PF_presentRemainingTopic(pickStructure(SHAPE_PROPERTIES_STRUCTURES, d), "shapeProperties");
  },
  symmetryReflection(d) {
    return PF_presentRemainingTopic(pickStructure(SYMMETRY_REFLECTION_STRUCTURES, d), "symmetryReflection");
  },
  spatialPuzzles(d) {
    return PF_presentRemainingTopic(pickStructure(SPATIAL_PUZZLES_STRUCTURES, d), "spatialPuzzles");
  },
};
export const PRIMARY_OLYMPIAD_PLAYBOOK = { steps: [], tactics: [] };
export const PRIMARY_OLYMPIAD = [];
export const PRIMARY_RARITY = JUNIOR_RARITY; // shared 5-tier pack economy shape (common/uncommon/rare/epic/legendary/boss)
// Ninefold Orchard cast, matching the approved 30-card roster (card art in card_art/ninefold_orchard/).
// Class assignment covers every common+uncommon hero exactly once (4 tank/3 healer/3 wizard/3 melee/4 ranged),
// mirroring Junior's 17-hero pattern. No PRIMARY_ADVENTURES exist yet, so classes are set up for when
// adventures are built, but don't do anything on their own until then.
export const PRIMARY_CARD_CLASS = {
  bushel: "tank", furrow: "tank", tuppence: "tank", cornix: "tank",
  pip: "healer", sorrel: "healer", beeswax: "healer",
  bramble: "wizard", dapple: "wizard", kernel: "wizard",
  wicker: "melee", russet: "melee", thistlewick: "melee",
  nine: "ranged", halfpenny: "ranged", windfall: "ranged", millrace: "ranged",
};
export const PRIMARY_MAX_LEVEL = 10;
/* Boss n sits at the end of level n (First Crow ends level 1, unlocking level 2, and so on);
   need thresholds scale to PRIMARY_MAX_STRENGTH_TOTAL the same way Junior's scale to its own total. */
export const PRIMARY_BOSSES = [
  { n: 1,  name: "The First Crow",      emoji: "🐦",  need: 3,  r: "common",    s: [2,2,2,1,6],   bv: 13, set: "ninefold_orchard", lore: "A scruffy young crow who stole fruit out of turn because he'd stopped trusting the whistle. Not evil, just frightened, and the first to notice something was wrong." },
  { n: 2,  name: "Old Roughweather",    emoji: "🌫️", need: 6,  r: "common",    s: [2,2,6,1,1],   bv: 12, set: "ninefold_orchard", lore: "Row Two's scarecrow, whistling 'about forty' instead of an exact count. Rounding felt kind, until three short pears a day added up to a family going hungry." },
  { n: 3,  name: "Widdershins",         emoji: "🌀", need: 10, r: "uncommon",  s: [3,8,3,2,2],   bv: 16, set: "ninefold_orchard", lore: "A small mischievous wind who unpicks finished sums for fun, spiralling the wrong way round the sundial. Nobody ever told him undoing was for anything." },
  { n: 4,  name: "Scratch",             emoji: "🎃", need: 15, r: "uncommon",  s: [5,2,7,2,2],   bv: 16, set: "ninefold_orchard", lore: "Row One's own scarecrow, the first to forget, because he alone was taught his numbers straight from the founding scarecrow's mouth, not passed down the row." },
  { n: 5,  name: "The Maybe-Flock",     emoji: "🐤", need: 21, r: "rare",      s: [6,3,5,8,3],   bv: 26, set: "ninefold_orchard", lore: "A directionless swarm of finches who gave up counting themselves and started guessing, so a lost brother could never be told apart from loads." },
  { n: 6,  name: "Strawless",           emoji: "🌾", need: 28, r: "rare",      s: [3,9,5,5,2],   bv: 25, set: "ninefold_orchard", lore: "A scarecrow whose ten counted bundles came apart into a shapeless heap, because he'd forgotten what a single bundle was even supposed to be." },
  { n: 7,  name: "The Murder",          emoji: "🐦‍⬛", need: 40, r: "epic",      s: [8,4,6,4,9],   bv: 33, set: "ninefold_orchard", lore: "Nine thousand frightened crows, drawn to the fading counting-song, terrified not of being many but of being uncountable, endless, with no far side." },
  { n: 8,  name: "Hollow Bough",        emoji: "🕳️", need: 55, r: "epic",      s: [5,6,7,9,4],   bv: 32, set: "ninefold_orchard", lore: "A bough at the orchard's heart with nothing hanging on it at all — not a wrong count, but the one honest nought kept on purpose, in honour of the very first fruit." },
  { n: 9,  name: "The Nearly",          emoji: "✨",  need: 75, r: "legendary", s: [9,8,9,8,9],   bv: 43, set: "ninefold_orchard", lore: "A shy, apologetic little presence who quietly shorts every basket near the heart by exactly one, and cannot see why 'nearly right' isn't the same as right." },
  { n: 10, name: "The First Scarecrow", emoji: "🌳", need: 90, r: "legendary", s: [10,9,9,9,9],  bv: 46, set: "ninefold_orchard", lore: "The founding scarecrow itself, planted with the Ninefold Tree a century ago, worn down to almost nothing at all. Not a monster to defeat, but a century of counting asking, gently, to be allowed to rest." },
];
// Every quest level has its own 25-question Mock Test and corresponding gate mark.
export const PRIMARY_EXAM_PASS_MARKS = { 1: 8, 2: 10, 3: 12, 4: 14, 5: 16, 6: 18, 7: 20, 8: 22, 9: 10, 10: 12 };
export const PRIMARY_examKindFor = (lv) => `level-${Math.min(Math.max(lv, 1), 10)}`;
export const PRIMARY_EXAM_NAMES = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`level-${i + 1}`, `Level ${i + 1} Mock Test`]));
// No adventures exist yet for Primary, so no upgrade bonus is achievable — base rarity strengths only.
// 12*1 (commons) + 5*2 (uncommons) + 5*4 (rares) + 6*8 (epics) + 2*16 (legendaries) = 122.
export const PRIMARY_MAX_STRENGTH_TOTAL = 122;
// Stats order matches STAT_DEFS: [Arithmetic, Geometry, Logic, Science, Speed]
export const PRIMARY_CARDS = [
  // ---- COMMON (12) ----
  { id: "pip",         name: "Pip",         emoji: "🌰", r: "common", s: [1,1,3,6,2], bv: 13, set: "ninefold_orchard", flavor: "Counts every seed in the orchard, twice, just to be sure." },
  { id: "nine",        name: "Nine",        emoji: "🐦‍⬛", r: "common", s: [2,1,2,1,7], bv: 14, set: "ninefold_orchard", flavor: "Can count to nine perfectly. Ten is still a bit much." },
  { id: "bramble",     name: "Bramble",     emoji: "🦔", r: "common", s: [2,1,2,7,1], bv: 14, set: "ninefold_orchard", flavor: "Never accepts an answer without checking it three ways." },
  { id: "sorrel",      name: "Sorrel",      emoji: "🐭", r: "common", s: [2,2,2,5,2], bv: 12, set: "ninefold_orchard", flavor: "Keeps her acorns in stacks of ten. Always exactly ten." },
  { id: "russet",      name: "Russet",      emoji: "🐞", r: "common", s: [2,6,2,2,1], bv: 13, set: "ninefold_orchard", flavor: "Has exactly the same number of spots on each wing. She checks." },
  { id: "halfpenny",   name: "Halfpenny",   emoji: "🐦", r: "common", s: [2,2,3,2,4], bv: 12, set: "ninefold_orchard", flavor: "Never takes more than her fair half." },
  { id: "wicker",      name: "Wicker",      emoji: "🕷️", r: "common", s: [1,6,2,2,2], bv: 13, set: "ninefold_orchard", flavor: "Every strand of her web is the same angle apart." },
  { id: "furrow",      name: "Furrow",      emoji: "🦫", r: "common", s: [1,4,2,1,5], bv: 12, set: "ninefold_orchard", flavor: "Digs every tunnel dead straight, or not at all." },
  { id: "dapple",      name: "Dapple",      emoji: "🦌", r: "common", s: [2,2,1,2,6], bv: 13, set: "ninefold_orchard", flavor: "Her spots follow a pattern nobody else has noticed yet." },
  { id: "bushel",      name: "Bushel",      emoji: "🐻", r: "common", s: [5,1,2,3,2], bv: 12, set: "ninefold_orchard", flavor: "Never picks a berry more or less than a full bushel." },
  { id: "tuppence",    name: "Tuppence",    emoji: "🐿️", r: "common", s: [4,1,4,2,2], bv: 12, set: "ninefold_orchard", flavor: "Won't trade unless the numbers add up exactly." },
  { id: "windfall",    name: "Windfall",    emoji: "🦉", r: "common", s: [1,1,2,4,5], bv: 12, set: "ninefold_orchard", flavor: "Always right about which apple falls next. Nobody knows how." },
  // ---- UNCOMMON (5) ----
  { id: "cornix",      name: "Cornix",      emoji: "🐦‍⬛", r: "uncommon", s: [6,2,6,3,4], bv: 15, set: "ninefold_orchard", flavor: "Knows the flock's exact number, even while it's flying." },
  { id: "thistlewick", name: "Thistlewick", emoji: "🎃", r: "uncommon", s: [4,4,5,4,4], bv: 15, set: "ninefold_orchard", flavor: "Learning to whistle every number exactly right." },
  { id: "beeswax",     name: "Beeswax",     emoji: "🐝", r: "uncommon", s: [2,2,4,6,7], bv: 16, set: "ninefold_orchard", flavor: "Counts every bee in the hive before breakfast." },
  { id: "kernel",      name: "Kernel",      emoji: "🌽", r: "uncommon", s: [6,7,3,3,2], bv: 16, set: "ninefold_orchard", flavor: "Sees every field as rows times columns." },
  { id: "millrace",    name: "Millrace",    emoji: "💧", r: "uncommon", s: [3,3,4,7,4], bv: 16, set: "ninefold_orchard", flavor: "Knows exactly how fast the water should run." },
  // ---- RARE (5) ----
  { id: "cobweb",      name: "Cobweb",      emoji: "🕸️", r: "rare", s: [3,8,4,4,3], bv: 26, set: "ninefold_orchard", flavor: "Her webs repeat the same pattern, smaller and smaller." },
  { id: "amberly",     name: "Amberly",     emoji: "✨", r: "rare", s: [3,3,7,6,3], bv: 25, set: "ninefold_orchard", flavor: "Blinks in a pattern you can always predict, if you count carefully." },
  { id: "barrow",      name: "Barrow",      emoji: "🦡", r: "rare", s: [7,3,8,2,2], bv: 26, set: "ninefold_orchard", flavor: "Keeps the only ledger in the orchard that's never once been wrong." },
  { id: "driftwood",   name: "Driftwood",   emoji: "🐦", r: "rare", s: [3,7,6,3,3], bv: 25, set: "ninefold_orchard", flavor: "Never wades in deeper than exactly one leg's length." },
  { id: "gable",       name: "Gable",       emoji: "🦉", r: "rare", s: [4,3,6,6,3], bv: 25, set: "ninefold_orchard", flavor: "Knows exactly which day of the week any date will fall on." },
  // ---- EPIC (6) ----
  { id: "warden",      name: "Warden",      emoji: "🧑‍🌾", r: "epic", s: [8,6,8,6,6], bv: 33, set: "ninefold_orchard", flavor: "The steadiest whistle in the orchard. Hasn't missed a number in sixty years." },
  { id: "harvestmoon", name: "Harvestmoon", emoji: "🦉", r: "epic", s: [6,6,8,8,6], bv: 33, set: "ninefold_orchard", flavor: "Only opens her eyes once a year — the night everything must be counted." },
  { id: "ninebark",    name: "Ninebark",    emoji: "🌳", r: "epic", s: [8,7,9,6,4], bv: 34, set: "ninefold_orchard", flavor: "Remembers every harvest the orchard has ever had, in order." },
  { id: "cascade",     name: "Cascade",     emoji: "💦", r: "epic", s: [8,6,6,9,5], bv: 34, set: "ninefold_orchard", flavor: "Says she's counted every drop. Nobody has ever caught her wrong." },
  { id: "longshadow",  name: "Longshadow",  emoji: "🦊", r: "epic", s: [6,6,7,8,7], bv: 33, set: "ninefold_orchard", flavor: "Tells the time from his own shadow, to the minute." },
  { id: "gossamer",    name: "Gossamer",    emoji: "🦋", r: "epic", s: [5,9,6,6,8], bv: 34, set: "ninefold_orchard", flavor: "Flies the same spiral every single night, never a wingbeat off." },
  // ---- LEGENDARY (2) ----
  { id: "ninefoldtree", name: "The Ninefold Tree",   emoji: "🌳", r: "legendary", s: [9,9,9,9,9],  bv: 45, set: "ninefold_orchard", flavor: "Every bough has borne fruit in the same pattern for a hundred years." },
  { id: "tenthscarecrow", name: "The Tenth Scarecrow", emoji: "🌱", r: "legendary", s: [10,8,10,8,9], bv: 46, set: "ninefold_orchard", flavor: "Nine scarecrows kept the count for a hundred years. Then there were ten." },
];
export const PRIMARY_ACADEMY = [];
export const PRIMARY_NAMES_COMMON = ["Pip", "Nine", "Bramble", "Sorrel", "Russet", "Halfpenny", "Wicker", "Furrow", "Dapple", "Bushel", "Tuppence", "Windfall"];
export const PRIMARY_NAMES_RARE = ["Cornix", "Thistlewick", "Beeswax", "Kernel", "Millrace", "Cobweb", "Amberly", "Barrow", "Driftwood", "Gable"];
export const PRIMARY_NAMES_EPIC = ["Warden", "Harvestmoon", "Ninebark", "Cascade", "Longshadow", "Gossamer"];
export const PRIMARY_NAMES_LEGENDARY = ["The Ninefold Tree", "The Tenth Scarecrow"];

// Phase 0: stamp primaryType onto every card and boss at module-load time (edge case §6).
for (const c of PRIMARY_CARDS) { normaliseJoeyCardStats(c); }
for (const b of PRIMARY_BOSSES) { normaliseJoeyCardStats(b); }
