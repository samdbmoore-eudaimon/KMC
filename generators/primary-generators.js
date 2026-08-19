// generators/primary-generators.js — Primary module: PRIMARY_G, bosses, cards, and helpers.
import {
  rand, pick, shuffle, gcd, buildMC, buildMCStr, gbp, deg, simplifyFrac, sup, svgBox,
  N1, SL, SC, SR, ST, DAYS
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
   KS2 (Years 4-6), Kangaroo-only. Topics are curriculum-grounded (DfE
   "Mathematics guidance: key stages 1 and 2", June 2020, Years 4-6
   sections) but pitched in the Primary Kangaroo paper's own house style
   (light arithmetic wrapped in visual/logic reasoning, not heavy word
   problems). Building out topic-by-topic across sessions — this batch:
   placeValue, roundingEstimate, timesTablesFacts, divisionRemainders,
   factorsMultiplesPrimes, sequencePattern. Each generator uses brute-force
   search wherever a shortcut formula could hide a subtle bug (factor
   lists, primality, best digit arrangements) rather than a derived-by-hand
   formula, matching the verification standard set on Junior's generators.
   ============================================================ */
export const PRIMARY_TOPICS = [
  { key: "placeValue",             label: "Place Value",           emoji: "🔢", color: "#7c5cff" },
  { key: "roundingEstimate",       label: "Rounding & Estimating", emoji: "🎯", color: "#ff6b4a" },
  { key: "timesTablesFacts",       label: "Times Tables",          emoji: "✖️", color: "#22c8b8" },
  { key: "divisionRemainders",     label: "Division & Remainders", emoji: "➗", color: "#ff5d8f" },
  { key: "factorsMultiplesPrimes", label: "Factors & Multiples",   emoji: "🧩", color: "#2fc97a" },
  { key: "sequencePattern",        label: "Patterns & Sequences",  emoji: "🔁", color: "#ffc93c" },
  { key: "fractionEquivalence",    label: "Equivalent Fractions",  emoji: "🟰", color: "#ff5d8f" },
  { key: "fractionArithmetic",     label: "Adding Fractions",      emoji: "½",  color: "#7c5cff" },
  { key: "fractionOfQuantity",     label: "Fraction of an Amount", emoji: "🍰", color: "#22c8b8" },
  { key: "decimalPlaceValue",      label: "Decimals",              emoji: "🔟", color: "#ff6b4a" },
  { key: "ratioBasics",            label: "Ratio",                 emoji: "⚖️", color: "#2fc97a" },
  { key: "twoUnknowns",            label: "Two Mystery Numbers",   emoji: "❓", color: "#ffc93c" },
  { key: "additiveMultiplicative", label: "More Than vs Times As Many", emoji: "🔀", color: "#ff5d8f" },
  { key: "unitConversion",         label: "Units & Measures",       emoji: "📏", color: "#22c8b8" },
  { key: "areaPerimeter",          label: "Area & Perimeter",       emoji: "📐", color: "#2fc97a" },
  { key: "timeCalendar",           label: "Time & Calendar",        emoji: "🕐", color: "#ff6b4a" },
  { key: "compensationMentalMaths", label: "Mental Maths Shortcuts", emoji: "⚡", color: "#ffc93c" },
  { key: "formalMultiplication",   label: "Column Multiplication",  emoji: "✖️", color: "#7c5cff" },
  { key: "formalDivision",         label: "Long Division",          emoji: "➗", color: "#ff5d8f" },
  { key: "logicGrid",              label: "Logic Puzzles",          emoji: "🧩", color: "#7c5cff" },
  { key: "combinatoricsCounting",  label: "Counting Possibilities", emoji: "🔢", color: "#22c8b8" },
  { key: "angleBasics",            label: "Angles",                 emoji: "📐", color: "#ffc93c", dia: true },
  { key: "shapeProperties",        label: "Shape Properties",       emoji: "🔷", color: "#2fc97a", dia: true },
  { key: "symmetryReflection",     label: "Symmetry",               emoji: "🪞", color: "#ff5d8f", dia: true },
  { key: "spatialPuzzles",         label: "Spatial Puzzles",        emoji: "🧊", color: "#7c5cff", dia: true },
];
export const PRIMARY_DEEP_TOPICS = [];
export const PRIMARY_CONCEPTS = {
  placeValue: { idea: "Every digit's value depends on its position — the same digit means something different in the ones place vs the thousands place.", method: ["Identify the place (ones, tens, hundreds...) of each digit.", "Multiply the digit by the value of its place to find what it's really worth.", "Add the place values together to build or take apart a number."], tip: "Write the number under place-value headings if you're not sure.", watch: "The digit '0' still takes up a place — don't skip it when reading a number." },
  roundingEstimate: { idea: "Rounding replaces a number with a nearby 'friendly' one — look at the digit just after the place you're rounding to.", method: ["Find the place you're rounding to.", "Look at the very next digit: 5 or more rounds up, 4 or less rounds down.", "Change every digit after the rounding place to zero."], tip: "A number line helps — find the two multiples on either side and see which is closer.", watch: "Exactly halfway (like 450 to the nearest hundred) always rounds UP by convention." },
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
export const PRIMARY_G = {
  // Every branch tests a genuinely different place-value principle: reading a digit's value,
  // composing from named parts, unitizing (how many tens/hundreds), comparing by place value,
  // the effect of swapping two digits, building extremes from a digit set, and non-standard
  // partitioning — not five reskins of "what does this digit mean".
  placeValue(d) {
    const tier1 = [
      // (a) read the value of a named digit
      () => {
        const nd = pick([5, 6]);
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
          hint: "This is a place value question. The same digit is worth different amounts depending on where it sits inside a number, this is called its place. To answer, first work out which place (ones, tens, hundreds and so on) the named digit is sitting in, then work out what that place is worth, then multiply.",
          solution: {
            scenario: `The number is ${num.toLocaleString()}. We need to find the value of the digit ${digit} in it.`,
            idea: "A digit on its own just means a count from 0 to 9, but where it sits inside a number changes what it is really worth. The place furthest to the right is the ones place, worth 1 each. Moving one place to the left, each place is worth 10 times more than the one before it (tens, then hundreds, then thousands and so on). So to find a digit's real value, work out which place it is in, then multiply the digit by what that place is worth.",
            method: ["Count along the number to find which place the named digit is in.", "Work out what that place is worth (1, 10, 100, 1000...).", "Multiply the digit by that place value."],
            steps: [
              `The digit ${digit} is in the ${placeNames[place]} place in ${num.toLocaleString()}.`,
              `The ${placeNames[place]} place is worth ${placeWorth.toLocaleString()}.`,
              `${digit} × ${placeWorth.toLocaleString()} = ${value.toLocaleString()}.`,
            ],
            check: `The digit on its own is just ${digit}, and its value works out to ${value.toLocaleString()}, which is exactly ${digit} lots of ${placeWorth.toLocaleString()}, so that matches the place it sits in.`,
          } };
      },
      // (b) compose a number from named place-value parts
      () => {
        let parts;
        do { parts = [rand(1, 9), rand(0, 9), rand(0, 9), rand(0, 9), rand(0, 9)]; } while (parts.filter((p) => p > 0).length < 3);
        const num = parts[0] * 10000 + parts[1] * 1000 + parts[2] * 100 + parts[3] * 10 + parts[4];
        const unitLabels = ["ten-thousand", "thousand", "hundred", "ten", "one"];
        const descParts = parts.map((p, i) => p ? `${p} ${unitLabels[i]}${p > 1 ? "s" : ""}` : null).filter(Boolean);
        const desc = descParts.length > 1 ? descParts.slice(0, -1).join(", ") + " and " + descParts[descParts.length - 1] : descParts[0];
        const decoys = [num + parts[3] * 20, num - parts[2] * 100, Number(parts.join("")), num + 10000].filter((x) => x !== num && x >= 0);
        const { options, correctIndex } = buildMC(num, decoys);
        const unitPow = [10000, 1000, 100, 10, 1];
        const partVals = parts.map((p, i) => p * unitPow[i]).filter((v) => v > 0);
        return { q: `A number is made from ${desc}. What is the number?`, options, correctIndex,
          hint: "This is a build the number question. You are told how many ten-thousands, thousands, hundreds, tens and ones a number is made of, and you need to work out what number that makes. Each part already tells you a value, for example '3 hundreds' is worth 300, so once you know the value of every part, you just add them all up.",
          solution: {
            scenario: `A number is made from ${desc}. We need to work out what the number is.`,
            idea: "A number can always be split into place value parts, like so many ten-thousands, so many thousands, so many hundreds, so many tens and so many ones. Each of those parts already tells you a value, for example '3 hundreds' means 300. To rebuild the whole number, work out what each part is worth and add all the parts together.",
            method: ["Work out the value of each named part.", "Add all the values together to get the whole number."],
            steps: [
              ...descParts.map((label, i) => `${label} is worth ${partVals[i].toLocaleString()}.`),
              `Adding these together: ${partVals.map((v) => v.toLocaleString()).join(" + ")} = ${num.toLocaleString()}.`,
            ],
            check: `Reading ${num.toLocaleString()} back digit by digit matches the parts we were given, so the answer checks out.`,
          } };
      },
      // (c) unitizing: how many tens/hundreds are in a number
      () => {
        const unit = pick(["tens", "hundreds"]);
        const unitVal = unit === "tens" ? 10 : 100;
        const count = rand(15, 480);
        const num = count * unitVal;
        const decoys = [num, Math.round(num / (unit === "tens" ? 100 : 10)), count + unitVal / 10, count - 1].filter((x) => x !== count && x >= 0 && Number.isFinite(x));
        const { options, correctIndex } = buildMC(count, decoys);
        return { q: `How many ${unit} are there in ${num.toLocaleString()}?`, options, correctIndex,
          hint: "This is a how many groups question. Instead of asking for the value of a single digit, this asks how many whole tens or hundreds fit inside a number. Since each ten is a group of 10 and each hundred is a group of 100, you can find how many fit by dividing the number by the size of the group.",
          solution: {
            scenario: `We need to find how many ${unit} fit inside ${num.toLocaleString()}.`,
            idea: "A number like 470 can be thought of as a certain number of groups of ten, or a certain number of groups of a hundred. To find how many groups of a given size fit into a number, divide the number by the size of the group.",
            method: ["Work out the size of one group (10 for tens, 100 for hundreds).", "Divide the number by the group size."],
            steps: [
              `${num.toLocaleString()} is made up of groups of ${unitVal}.`,
              `${num.toLocaleString()} ÷ ${unitVal} = ${count}.`,
            ],
            check: `Multiplying back: ${count} × ${unitVal} = ${(count * unitVal).toLocaleString()}, which matches ${num.toLocaleString()}.`,
          } };
      },
      // (e) compare five numbers by place value
      () => {
        const nd = pick([4, 5]);
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
        // The question names all 5 of these numbers — every option must be one of them, so
        // this builds options directly from arr rather than going through buildMC (which would
        // only get 4 real distractors here and pad a 5th, unlisted number via a blind
        // correct±random fallback — that unlisted number was often bigger than the claimed
        // "largest" (or smaller than the claimed "smallest"), making the genuinely
        // correct-looking choice on screen get marked wrong).
        const shuffledArr = shuffle(arr);
        const options = shuffledArr.map((n) => n.toLocaleString());
        const correctIndex = shuffledArr.indexOf(answer);
        return { q: `Which of these numbers is the ${wantMax ? "largest" : "smallest"}: ${arr.map((n) => n.toLocaleString()).join(", ")}?`, options, correctIndex,
          hint: "This is a compare several numbers question. To find the largest or smallest among a list of numbers, compare them one place at a time starting from the leftmost digit (the biggest place value), since that place affects the size of the number the most. Only move to the next place along if the digits so far are tied.",
          solution: {
            scenario: `We need to find the ${wantMax ? "largest" : "smallest"} of these numbers: ${arr.map((n) => n.toLocaleString()).join(", ")}.`,
            idea: "The leftmost digit of a number (the one in the highest place value) affects its size the most. So when comparing several numbers, look at the leftmost digits first. Whichever number has the biggest leftmost digit is the biggest number overall, unless there's a tie, in which case move one place to the right and compare again.",
            method: ["Line up the numbers so their digits match up by place value.", "Compare the leftmost digits first.", "If there's a tie, compare the next digit along, and so on."],
            steps: [
              `The numbers are ${arr.map((n) => n.toLocaleString()).join(", ")}, and each one has ${nd} digits.`,
              `Since they all have the same number of digits, compare the leftmost digit of each number first.`,
              `The ${wantMax ? "largest" : "smallest"} number is ${answer.toLocaleString()}.`,
            ],
            check: `Looking back at the list, no other number beats ${answer.toLocaleString()} for being the ${wantMax ? "largest" : "smallest"}.`,
          } };
      },
    ];
    const tier2 = [
      // (a) effect of swapping two digits
      () => {
        const nd = pick([4, 5]);
        const placeNames = ["ones", "tens", "hundreds", "thousands", "ten-thousands"];
        let digits;
        do { digits = Array.from({ length: nd }, () => rand(0, 9)); } while (digits[0] === 0);
        const i = rand(0, nd - 1), j = rand(0, nd - 1);
        if (i === j || digits[i] === digits[j]) return null;
        const before = Number(digits.join(""));
        const swapped = [...digits]; [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
        if (swapped[0] === 0) return null;
        const placeI = nd - 1 - i, placeJ = nd - 1 - j;
        const diff = (digits[j] - digits[i]) * Math.pow(10, placeI) + (digits[i] - digits[j]) * Math.pow(10, placeJ);
        const after = Number(swapped.join(""));
        if (after - before !== diff) return null;
        const decoys = [-diff, Math.abs(digits[i] - digits[j]), (digits[j] - digits[i]) * Math.pow(10, placeJ)].filter((x) => x !== diff);
        const { options, correctIndex } = buildMC(diff, decoys);
        const beforeValI = digits[i] * Math.pow(10, placeI);
        const beforeValJ = digits[j] * Math.pow(10, placeJ);
        const afterValI = digits[j] * Math.pow(10, placeI);
        const afterValJ = digits[i] * Math.pow(10, placeJ);
        return { q: `In the number ${before.toLocaleString()}, the digit in the ${placeNames[placeI]} place is swapped with the digit in the ${placeNames[placeJ]} place. By how much does the number change? (Use a negative number if it decreases.)`, options, correctIndex,
          hint: "This is a swap the digits question. Swapping two digits changes a number because each digit is worth a different amount depending on its place. To find the change, work out what each of the two digits was worth before the swap and what it's worth after, then combine the two changes.",
          solution: {
            scenario: `In ${before.toLocaleString()}, the digit in the ${placeNames[placeI]} place swaps with the digit in the ${placeNames[placeJ]} place. We need to find how much the number changes by.`,
            idea: "When two digits in a number swap places, one digit moves to a place worth more (or less) and the other moves the opposite way. The overall change in the number is the change caused by the first digit moving, plus the change caused by the second digit moving. Working out each digit's old and new value, then combining the differences, gives the total change.",
            method: ["Work out what each of the two digits is worth in its original place.", "Work out what each digit is worth in its new place after swapping.", "Add up the two changes to get the overall change."],
            steps: [
              `Before swapping, the digit ${digits[i]} is in the ${placeNames[placeI]} place, worth ${beforeValI.toLocaleString()}.`,
              `Before swapping, the digit ${digits[j]} is in the ${placeNames[placeJ]} place, worth ${beforeValJ.toLocaleString()}.`,
              `After swapping, the digit ${digits[j]} moves into the ${placeNames[placeI]} place, becoming worth ${afterValI.toLocaleString()}.`,
              `After swapping, the digit ${digits[i]} moves into the ${placeNames[placeJ]} place, becoming worth ${afterValJ.toLocaleString()}.`,
              `The change is (${afterValI.toLocaleString()} − ${beforeValI.toLocaleString()}) + (${afterValJ.toLocaleString()} − ${beforeValJ.toLocaleString()}) = ${diff.toLocaleString()}.`,
            ],
            check: `The number went from ${before.toLocaleString()} to ${after.toLocaleString()}, a change of ${(after - before).toLocaleString()}, which matches ${diff.toLocaleString()}.`,
          } };
      },
      // (b) largest/smallest number from a digit set, with an optional parity condition
      () => {
        const nd = pick([4, 5]);
        let digits;
        let guard = 0;
        do { digits = Array.from({ length: nd }, () => rand(0, 9)); guard++; } while ((new Set(digits).size !== nd || digits.filter((x) => x === 0).length > 1) && guard < 200);
        if (guard >= 200) return null;
        const wantMax = pick([true, false]);
        const wantEven = pick([true, false, null]);
        function permute(arr) {
          if (arr.length <= 1) return [arr];
          const res = [];
          for (let k = 0; k < arr.length; k++) { const rest = [...arr.slice(0, k), ...arr.slice(k + 1)]; for (const p of permute(rest)) res.push([arr[k], ...p]); }
          return res;
        }
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
        const sortedDesc = Number([...digits].sort((a, b) => b - a).join(""));
        const sortedAsc = Number([...digits].sort((a, b) => a - b).join(""));
        const opp = bestArrangement(digits, !wantMax, wantEven);
        const flippedParity = bestArrangement(digits, wantMax, wantEven === null ? null : !wantEven);
        const decoys = [sortedDesc, sortedAsc, opp, flippedParity].filter((x) => x !== null && Number.isFinite(x) && x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        const constraint = wantEven === null ? "" : ` that is an ${wantEven ? "even" : "odd"} number`;
        return { q: `Using the digits ${digits.join(", ")} exactly once each, what is the ${wantMax ? "largest" : "smallest"} number you can make${constraint}?`, options, correctIndex,
          hint: "This is an arrange the digits question. You're given a set of digits and asked to arrange them to make the largest or smallest possible number, sometimes with an extra rule about the last digit being even or odd. Put your biggest digits in the places worth the most (for the largest number) or your smallest digits there (for the smallest number), then check the extra rule still holds.",
          solution: {
            scenario: `We must use the digits ${digits.join(", ")} exactly once each to make the ${wantMax ? "largest" : "smallest"} number possible${constraint}.`,
            idea: "To make the biggest possible number from a set of digits, put the biggest digits in the places worth the most, reading from the left. To make the smallest possible number, do the opposite: put the smallest digits in the places worth the most, as long as the very first digit isn't 0 (a number can't start with a 0). If there's an extra rule, like the number must be even, you may need to give up the very best arrangement and settle for the next best one that still follows the rule.",
            method: ["Sort the digits from biggest to smallest (or smallest to biggest, if the smallest number is wanted).", "Place them in order into the number, leftmost place first, without starting with 0.", "If there's an extra rule about the last digit, check it, and adjust the arrangement if needed while keeping the number as large (or small) as possible."],
            steps: [
              `The digits to use are ${digits.join(", ")}.`,
              wantEven !== null ? `Because the answer must be an ${wantEven ? "even" : "odd"} number, the last digit has to be ${wantEven ? "an even digit (0, 2, 4, 6 or 8)" : "an odd digit (1, 3, 5, 7 or 9)"} from the set.` : `There's no extra rule here, so we just arrange the digits by size.`,
              `Putting the ${wantMax ? "biggest" : "smallest"} remaining digits into the highest places (without starting with a 0) gives ${answer.toLocaleString()}.`,
            ],
            check: `${answer.toLocaleString()} uses each of the digits ${digits.join(", ")} exactly once${wantEven !== null ? `, and it ends in ${answer % 10}, which is ${wantEven ? "even" : "odd"} as required` : ""}.`,
          } };
      },
      // (c) non-standard partition: find the missing piece
      () => {
        const nd = pick([4, 5]);
        let digits;
        do { digits = Array.from({ length: nd }, () => rand(1, 9)); } while (new Set(digits).size !== nd);
        const num = Number(digits.join(""));
        const gapPlace = rand(1, nd - 2);
        const gapDigit = rand(1, 9);
        const gap = gapDigit * Math.pow(10, gapPlace);
        if (gap >= num) return null;
        const firstPart = num - gap;
        const decoys = [num - gap * 10, num + gap, firstPart + gap * 2, num].filter((x) => x !== gap && x > 0);
        const { options, correctIndex } = buildMC(gap, decoys);
        return { q: `${num.toLocaleString()} = ${firstPart.toLocaleString()} + ?. What number is missing?`, options, correctIndex,
          hint: "This is a fill in the missing part question. A number can be split into two parts that add together to make it. You're given the whole number and one part, and need to find the other part, by subtracting the part you know from the whole number.",
          solution: {
            scenario: `${num.toLocaleString()} is made of two parts added together. One part is ${firstPart.toLocaleString()}, and we need to find the other part.`,
            idea: "If two parts add together to make a whole number, and you know the whole number and one of the parts, you can find the missing part by taking away the known part from the whole. This is just subtraction undoing addition.",
            method: ["Take the known part away from the whole number.", "The result is the missing part."],
            steps: [`${num.toLocaleString()} − ${firstPart.toLocaleString()} = ${gap.toLocaleString()}.`],
            check: `Adding back: ${firstPart.toLocaleString()} + ${gap.toLocaleString()} = ${num.toLocaleString()}.`,
          } };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.placeValue(d);
  },
  roundingEstimate(d) {
    const tier1 = [
      // (a) round a whole number to a stated place
      () => {
        const placePow = pick([1, 2, 3, 4]);
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
          hint: "This is a rounding question. Rounding means replacing a number with a nearby simpler number that ends in zeros, to make it easier to work with. To round to a certain place, look at the very next digit after that place: if it's 5 or more, round up, if it's 4 or less, round down.",
          solution: {
            scenario: `We need to round ${num.toLocaleString()} to the nearest ${placeNames[placePow - 1]}.`,
            idea: "Every number sits between two 'round' numbers at the place you're rounding to, for example 340 and 350. To decide which one it's closer to, look at the digit just after the place you're rounding to. If that digit is 5, 6, 7, 8 or 9, round up to the bigger round number. If it's 0, 1, 2, 3 or 4, round down to the smaller one.",
            method: ["Find the two round numbers either side of the number, at the place you're rounding to.", "Look at the digit just after that place.", "Round up if that digit is 5 or more, round down if it's 4 or less."],
            steps: [
              `The two ${placeNames[placePow - 1]}s either side of ${num.toLocaleString()} are ${roundedDown.toLocaleString()} and ${roundedUp.toLocaleString()}.`,
              `Look at the digit just after the ${placeNames[placePow - 1]}s place.`,
              `${num.toLocaleString()} rounds to ${rounded.toLocaleString()}.`,
            ],
            check: `${rounded.toLocaleString()} ends in zeros from the ${placeNames[placePow - 1]}s place onwards, and it's one of the two nearest ${placeNames[placePow - 1]}s to ${num.toLocaleString()}.`,
          } };
      },
      // (b) round a decimal
      () => {
        const dp = pick([1, 2]);
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
          // Epsilon-guard floor/ceil against binary floating-point representation error at the
          // boundary (e.g. num*10 landing on 85.99999999999999 instead of 86), which was
          // producing visible float-noise decoys like "0.6000000000000001".
          decoys = [Math.floor(num * 10 + 1e-9) / 10, Math.ceil(num * 10 - 1e-9) / 10, whole].filter((x) => x !== rounded);
          // whole is a plain integer, mismatching the 1dp shape of rounded/floor/ceil unless
          // every option is displayed to a consistent 1 decimal place.
          fmtFn = (v) => v.toFixed(1);
        }
        const { options, correctIndex } = buildMC(rounded, decoys, fmtFn);
        return { q: `Round ${num} to ${targetDesc}.`, options, correctIndex,
          hint: "This is a rounding decimals question. A decimal number has a whole number part and a part after the decimal point. Rounding a decimal works the same way as rounding whole numbers: look at the digit just after the place you're rounding to, and if it's 5 or more round up, otherwise round down.",
          solution: {
            scenario: `We need to round ${num} to ${targetDesc}.`,
            idea: "To round a decimal, decide which place you are rounding to (for example the nearest whole number, or 1 decimal place), then look at the very next digit after that place. If it's 5 or more, round up. If it's 4 or less, round down, keeping everything up to that place and dropping the rest.",
            method: ["Find the digit just after the place you're rounding to.", "Round up if that digit is 5 or more, round down if it's 4 or less."],
            steps: [
              `Look at the digit just after the place we're rounding to in ${num}.`,
              `${num} rounds to ${rounded} (to ${targetDesc}).`,
            ],
            check: `${rounded} is one of the two nearest options to ${num} at ${targetDesc}.`,
          } };
      },
      // (c) nearest multiple below/above on a number line
      () => {
        const unit = pick([100, 1000]);
        let num;
        do { num = rand(unit + 1, unit * 90 - 1); } while (num % unit === 0);
        const below = Math.floor(num / unit) * unit;
        const above = Math.ceil(num / unit) * unit;
        const wantBelow = pick([true, false]);
        const answer = wantBelow ? below : above;
        const decoys = [wantBelow ? above : below, num, answer + unit, answer - unit].filter((x) => x !== answer && x >= 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `What is the ${wantBelow ? "previous" : "next"} multiple of ${unit} ${wantBelow ? "before" : "after"} ${num.toLocaleString()}?`, options, correctIndex,
          hint: "This is a nearest multiple question. A multiple of a number is what you get by counting up in steps of that number, like 100, 200, 300 for multiples of 100. To find the nearest multiple before or after a given number, find the two multiples either side of it.",
          solution: {
            scenario: `We need the ${wantBelow ? "previous" : "next"} multiple of ${unit} ${wantBelow ? "before" : "after"} ${num.toLocaleString()}.`,
            idea: "Multiples of a number sit at regular steps, like 100, 200, 300, 400 for multiples of 100. Any number in between two multiples has one multiple just before it and one multiple just after it. To find the multiple asked for, work out those two neighbouring multiples first.",
            method: ["Divide the number by the step size to see roughly where it falls.", "Find the multiple just below it and the multiple just above it.", "Pick the one asked for (before or after)."],
            steps: [
              `Multiples of ${unit} near ${num.toLocaleString()} are ${below.toLocaleString()} and ${above.toLocaleString()}.`,
              `The ${wantBelow ? "previous" : "next"} one is ${answer.toLocaleString()}.`,
            ],
            check: `${answer.toLocaleString()} ÷ ${unit} = ${answer / unit}, a whole number, confirming it really is a multiple of ${unit}.`,
          } };
      },
    ];
    const tier2 = [
      // (a) reverse rounding: which number could it have been
      () => {
        const unit = pick([10, 100]);
        const centre = rand(2, 90) * unit;
        const halfBand = unit / 2;
        const low = centre - halfBand, high = centre + halfBand - 1;
        const inBand = rand(low, high);
        const outOptions = [low - rand(1, halfBand), high + rand(1, halfBand), centre + unit + rand(0, halfBand - 1), centre - unit - rand(0, halfBand - 1)];
        const { options, correctIndex } = buildMC(inBand, outOptions);
        return { q: `A number rounds to ${centre.toLocaleString()} when rounded to the nearest ${unit}. Which of these numbers could it be?`, options, correctIndex,
          hint: "This is a working backwards from a rounded number question. Instead of rounding a number, you're told what a number rounds to, and need to work out which numbers it could have started as. Any number close enough to the rounded value, within half a step either side, would round to it.",
          solution: {
            scenario: `A number rounds to ${centre.toLocaleString()} when rounded to the nearest ${unit}. We need to work out which of the given numbers it could be.`,
            idea: "When a number rounds to a target, it means the original number was closer to that target than to any other round number at that place, or exactly halfway. That means the original number must lie within half a step below the target, up to (but not including) half a step above the next one along. So there's a whole range of numbers that could round to the same target, not just one.",
            method: ["Work out half of the rounding step.", "Find the smallest and largest number that would still round to the target.", "Check which of the given numbers falls inside that range."],
            steps: [
              `Half of ${unit} is ${halfBand}.`,
              `Numbers from ${low.toLocaleString()} to ${high.toLocaleString()} round to ${centre.toLocaleString()}.`,
              `${inBand.toLocaleString()} is in that range.`,
            ],
            check: `${inBand.toLocaleString()} is closer to ${centre.toLocaleString()} than to any other multiple of ${unit}, so it really would round to ${centre.toLocaleString()}.`,
          } };
      },
      // (b) the exact-halfway convention
      () => {
        const unit = pick([10, 100, 1000]);
        const halfBand = unit / 2;
        const base = rand(2, 80) * unit;
        const num = base + halfBand;
        const rounded = base + unit;
        const decoys = [base, num, base + unit * 2].filter((x) => x !== rounded);
        const { options, correctIndex } = buildMC(rounded, decoys);
        return { q: `${num.toLocaleString()} is exactly halfway between two multiples of ${unit}. By the usual rounding rule, what does ${num.toLocaleString()} round to (to the nearest ${unit})?`, options, correctIndex,
          hint: "This is a rounding a halfway number question. Sometimes a number sits exactly halfway between two round numbers, so it isn't obviously closer to one or the other. There's a rule that always applies in this case, rather than the two ways balancing out.",
          solution: {
            scenario: `${num.toLocaleString()} sits exactly halfway between two multiples of ${unit}. We need to know what it rounds to.`,
            idea: "Normally, rounding works by seeing which round number is closer. But when a number is EXACTLY halfway between two round numbers, neither one is closer, they're both the same distance away. To avoid confusion, there's an agreed rule that exact halfway numbers always round UP, no matter what.",
            method: ["Check the number is exactly halfway between two round numbers.", "Apply the halfway rule: round up."],
            steps: [
              `${num.toLocaleString()} is halfway between ${base.toLocaleString()} and ${(base + unit).toLocaleString()}.`,
              `Exactly halfway always rounds UP, so the answer is ${rounded.toLocaleString()}.`,
            ],
            check: `${rounded.toLocaleString()} is exactly ${halfBand} more than ${num.toLocaleString()}, and ${num.toLocaleString()} was exactly ${halfBand} more than ${base.toLocaleString()}, confirming it really was the halfway point.`,
          } };
      },
      // (c) estimate a sum by rounding each addend first
      () => {
        const unit = pick([10, 100]);
        const a = rand(unit * 2, unit * 90) + rand(1, unit - 1);
        const b = rand(unit * 2, unit * 90) + rand(1, unit - 1);
        const roundedA = Math.round(a / unit) * unit;
        const roundedB = Math.round(b / unit) * unit;
        const estimate = roundedA + roundedB;
        const decoys = [a + b, roundedA + b, a + roundedB].filter((x) => x !== estimate);
        const { options, correctIndex } = buildMC(estimate, decoys);
        return { q: `Estimate ${a.toLocaleString()} + ${b.toLocaleString()} by rounding each number to the nearest ${unit} first, then adding.`, options, correctIndex,
          hint: "This is an estimate a sum question. Instead of adding two large numbers exactly, you round each one to a friendlier number first, then add the friendlier numbers. This gives a quick, approximate answer without doing the full exact addition.",
          solution: {
            scenario: `We need to estimate ${a.toLocaleString()} + ${b.toLocaleString()} by rounding each number to the nearest ${unit} first.`,
            idea: "Adding two big, awkward numbers can be slow and easy to get wrong. If you only need a rough answer, round each number to the nearest ten, hundred or whatever is asked first, then add those simpler numbers instead. It won't give the exact answer, but it gives a good estimate quickly.",
            method: ["Round the first number.", "Round the second number.", "Add the two rounded numbers together."],
            steps: [
              `${a.toLocaleString()} rounds to ${roundedA.toLocaleString()}.`,
              `${b.toLocaleString()} rounds to ${roundedB.toLocaleString()}.`,
              `${roundedA.toLocaleString()} + ${roundedB.toLocaleString()} = ${estimate.toLocaleString()}.`,
            ],
            check: `The estimate ${estimate.toLocaleString()} is close to the exact sum ${(a + b).toLocaleString()}, which makes sense since rounding only changed each number by a small amount.`,
          } };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.roundingEstimate(d);
  },
  timesTablesFacts(d) {
    const tier1 = [
      // (a) direct recall
      () => {
        const a = rand(2, 12), b = rand(2, 12);
        const product = a * b;
        const decoys = [a * (b + 1), a * (b - 1), (a + 1) * b, a + b].filter((x) => x !== product && x > 0);
        const { options, correctIndex } = buildMC(product, decoys);
        return { q: `What is ${a} × ${b}?`, options, correctIndex,
          hint: "This is a times tables question. It's simply asking you to recall or work out a multiplication fact, there's no trick here, just multiply the two numbers together.",
          solution: {
            scenario: `We need to work out ${a} × ${b}.`,
            idea: "Multiplying two numbers means adding one of them to itself the other number of times, for example 4 × 3 means 4 add 4 add 4. Knowing times tables facts means you don't have to add it out every time, you can just recall or quickly work out the answer.",
            method: ["Multiply the two numbers together."],
            steps: [`${a} × ${b} = ${product}.`],
            check: `${product} ÷ ${a} = ${b}, so the multiplication and its matching division agree.`,
          } };
      },
      // (b) scale a known fact by 10 or 100
      () => {
        const a = rand(2, 9), b = rand(2, 9);
        const base = a * b;
        const scale = pick([10, 100]);
        const bigA = a * scale;
        const answer = base * scale;
        const decoys = [base, bigA * b / scale, answer / 10, answer * 10].filter((x) => x !== answer && Number.isFinite(x));
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Given that ${a} × ${b} = ${base}, what is ${bigA} × ${b}?`, options, correctIndex,
          hint: "This is a scaling up a fact question. If you already know a smaller multiplication fact, you can use it to work out a bigger one instantly, as long as one of the numbers has just been made 10 or 100 times bigger. Whatever you multiply one number by, the answer gets multiplied by that same amount.",
          solution: {
            scenario: `We know ${a} × ${b} = ${base}, and need to work out ${bigA} × ${b}.`,
            idea: "If you know a fact like 4 × 3 = 12, and one of the numbers gets 10 times bigger (like 40 instead of 4), the answer also gets exactly 10 times bigger, so 40 × 3 = 120. This works because multiplying one side of a multiplication by something is the same as multiplying the whole answer by that same amount.",
            method: ["Notice how many times bigger the new number is compared to the original.", "Multiply the original answer by that same amount."],
            steps: [
              `${bigA} is ${scale} times bigger than ${a}.`,
              `So the answer is also ${scale} times bigger than ${base}: ${base} × ${scale} = ${answer}.`,
            ],
            check: `${answer} ÷ ${scale} = ${base}, which is the original fact ${a} × ${b}, confirming the scaling worked.`,
          } };
      },
      // (c) distributive partition
      () => {
        const tens = rand(1, 8), ones = rand(1, 9);
        const multiplicand = tens * 10 + ones;
        const b = rand(2, 9);
        const part1 = tens * 10 * b, part2 = ones * b;
        const answer = part1 + part2;
        const decoys = [tens * b + ones * b, multiplicand + b, (tens + ones) * b, answer + b].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Work out ${multiplicand} × ${b} by splitting ${multiplicand} into ${tens * 10} + ${ones}. What is ${tens * 10}×${b} + ${ones}×${b}?`, options, correctIndex,
          hint: "This is a split and multiply question. A bigger multiplication can be made easier by splitting one number into two friendlier parts, multiplying each part separately, then adding the results back together. This works because multiplying is 'shared out' evenly across the parts of a sum.",
          solution: {
            scenario: `We need to work out ${multiplicand} × ${b} by splitting ${multiplicand} into ${tens * 10} + ${ones}.`,
            idea: "A number like 34 is really 30 + 4. When you multiply 34 by something, you can instead multiply 30 by it, multiply 4 by it, and add those two answers together. You get exactly the same result, but with two easier multiplications instead of one harder one.",
            method: ["Split the bigger number into two friendlier parts.", "Multiply each part separately.", "Add the two results together."],
            steps: [
              `${tens * 10} × ${b} = ${part1}.`,
              `${ones} × ${b} = ${part2}.`,
              `${part1} + ${part2} = ${answer}.`,
            ],
            check: `Working out ${multiplicand} × ${b} directly also gives ${answer}.`,
          } };
      },
      // (d) missing factor
      () => {
        const b = rand(2, 12);
        const missing = rand(2, 12);
        const product = b * missing;
        const decoys = [missing + 1, missing - 1, product, Math.round(product / (b + 1))].filter((x) => x !== missing && x > 0);
        const { options, correctIndex } = buildMC(missing, decoys);
        return { q: `___ × ${b} = ${product}. What number goes in the blank?`, options, correctIndex,
          hint: "This is a missing factor question. You're given a multiplication with one number hidden and told the answer, and need to find the hidden number. Since multiplying and dividing undo each other, you can find the missing number by dividing the given answer by the number you do know.",
          solution: {
            scenario: `We know the blank × ${b} = ${product}, and need to find the missing number.`,
            idea: "If two numbers multiply to give an answer, and you know the answer and one of the numbers, you can find the missing number using division, because division is multiplication done backwards.",
            method: ["Divide the given answer by the number you know.", "The result is the missing number."],
            steps: [`${product} ÷ ${b} = ${missing}.`],
            check: `${missing} × ${b} = ${missing * b}, which matches the given answer ${product}.`,
          } };
      },
    ];
    const tier2 = [
      // (a) fact family: multiplication implies two division facts
      () => {
        const a = rand(2, 12), b = rand(2, 12);
        if (a === b) return null;
        const product = a * b;
        const correctFact = pick([`${product} ÷ ${a} = ${b}`, `${product} ÷ ${b} = ${a}`]);
        const wrongFacts = [`${product} ÷ ${a + 1} = ${b}`, `${product} ÷ ${a} = ${b + 1}`, `${a} ÷ ${b} = ${product}`, `${product + a} ÷ ${a} = ${b}`];
        const { options, correctIndex } = buildMCStr(correctFact, wrongFacts);
        return { q: `Given that ${a} × ${b} = ${product}, which of these division facts must also be true?`, options, correctIndex,
          hint: "This is a fact family question. One multiplication fact is secretly connected to two division facts, because dividing undoes multiplying. If you know a × b equals a product, you also automatically know that product divided by either a or b.",
          solution: {
            scenario: `We know ${a} × ${b} = ${product}, and need to spot a division fact that must also be true.`,
            idea: "Multiplication and division are opposite operations, one undoes the other. So every multiplication fact like a × b = product comes as part of a 'family' that also includes product ÷ a = b and product ÷ b = a. Knowing one fact means you already know the other two.",
            method: ["Start from the multiplication fact you're given.", "Swap it round into a division: the answer divided by one number gives the other number."],
            steps: [`From ${a} × ${b} = ${product}, dividing back gives ${product} ÷ ${a} = ${b} and ${product} ÷ ${b} = ${a}.`],
            check: `Multiplying either division fact back up, ${a} × ${b}, returns ${product}, confirming the family is consistent.`,
          } };
      },
      // (b) commutative property: same product, different expression
      () => {
        const a = rand(2, 12), b = rand(2, 12);
        if (a === b) return null;
        const correctStr = `${b} × ${a}`;
        const wrongOptions = [`${a} × ${b + 1}`, `${a + 1} × ${b}`, `${a + b} × 1`, `${a} + ${b}`];
        const { options, correctIndex } = buildMCStr(correctStr, wrongOptions);
        return { q: `Which of these has the same answer as ${a} × ${b}?`, options, correctIndex,
          hint: "This is a same answer, different order question. Multiplying two numbers gives the same answer whichever order you multiply them in, so a times b will always equal b times a.",
          solution: {
            scenario: `We need to find which option has the same answer as ${a} × ${b}.`,
            idea: "Multiplication doesn't care about order, 3 groups of 4 gives the same total as 4 groups of 3, both are 12. This means for any two numbers, swapping their order in a multiplication never changes the answer.",
            method: ["Look for the option with the same two numbers multiplied in the opposite order."],
            steps: [`${a} × ${b} has the same answer as ${b} × ${a}, because multiplication order doesn't matter.`],
            check: `${a} × ${b} = ${a * b} and ${b} × ${a} = ${b * a}, both give the same answer.`,
          } };
      },
      // (c) adjacent multiples in a times table differ by the multiplier
      () => {
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
          hint: "This is a step along the times table question. Moving one step further along a times table (or one step back) changes the total by exactly the table's number each time, since you're adding or taking away one more group.",
          solution: {
            scenario: `We know ${table} × ${n} = ${known}, and need to find ${table} × ${targetN}.`,
            idea: "A times table like the 6 times table goes 6, 12, 18, 24, each one is the number before plus 6 more, because each step adds one more group of 6. So to move one step forward in any times table, add the table's number, and to move one step back, subtract it.",
            method: ["Notice how much the table number changes by each step.", `${wantNext ? "Add" : "Subtract"} that amount to move to the next term.`],
            steps: [
              `Each step in the ${table} times table changes by ${table}.`,
              `${table} × ${targetN} = ${known} ${wantNext ? "+" : "−"} ${table} = ${answer}.`,
            ],
            check: `Working out ${table} × ${targetN} directly also gives ${table * targetN}.`,
          } };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.timesTablesFacts(d);
  },
  divisionRemainders(d) {
    const tier1 = [
      // (a) find the quotient or remainder directly
      () => {
        const divisor = rand(3, 9);
        const quotient = rand(4, 20);
        const remainder = rand(1, divisor - 1);
        const dividend = divisor * quotient + remainder;
        const askQuotient = pick([true, false]);
        const answer = askQuotient ? quotient : remainder;
        const decoys = (askQuotient ? [quotient + 1, quotient - 1, remainder] : [divisor - remainder, remainder + 1, quotient]).filter((x) => x !== answer && x >= 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `${dividend} ÷ ${divisor} = ? Give the ${askQuotient ? "whole number answer (quotient)" : "remainder"}.`, options, correctIndex,
          hint: "This is a division with a remainder question. When one number doesn't divide exactly into another, you get a whole number of groups plus a bit left over, called the remainder. This question asks for either the whole number part or the leftover part.",
          solution: {
            scenario: `We need to divide ${dividend} by ${divisor} and give the ${askQuotient ? "whole number part" : "remainder"}.`,
            idea: "Dividing doesn't always come out exact. If it doesn't, you get a whole number of full groups, and then a remainder, which is whatever is left over that isn't enough to make another full group. The remainder is always smaller than the number you're dividing by.",
            method: ["Work out how many full groups fit in.", "Subtract that from the total to find what's left over.", "Give either the whole number part or the remainder, whichever is asked for."],
            steps: [
              `${divisor} × ${quotient} = ${divisor * quotient}.`,
              `${dividend} − ${divisor * quotient} = ${remainder}.`,
              `So ${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}.`,
            ],
            check: `The remainder ${remainder} is smaller than the divisor ${divisor}, as it should be.`,
          } };
      },
      // (b) round the remainder UP: one more group is needed
      () => {
        const capacity = rand(4, 9);
        const fullGroups = rand(2, 10);
        const extra = rand(1, capacity - 1);
        const total = capacity * fullGroups + extra;
        const answer = fullGroups + 1;
        const decoys = [fullGroups, Math.round(total / capacity), fullGroups + 2].filter((x) => x !== answer && x > 0);
        const nm = N1();
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `${nm} is organising a trip. Each minibus holds ${capacity} people, and ${total} people are going. How many minibuses are needed so that everyone has a seat?`, options, correctIndex,
          hint: "This is a round the remainder up question. When sharing things into groups and there's some left over, sometimes those leftovers still need their own extra group, like an extra minibus for people who don't fit in the full ones. In that case you round the number of groups UP, even though the leftover group isn't full.",
          solution: {
            scenario: `${total} people need seats on minibuses that each hold ${capacity} people. We need to find how many minibuses are needed so everyone has a seat.`,
            idea: "Dividing a total by a group size tells you how many full groups fit, plus a remainder. Normally you might just report the remainder as leftover, but here every single person still needs somewhere to sit. Since the leftover people still need a seat, one more (not-quite-full) minibus is needed, so you round the number of groups UP by one.",
            method: ["Divide the total by the group size to get the full groups and the remainder.", "If there's a remainder, add one more group for the leftovers."],
            steps: [
              `${total} ÷ ${capacity} = ${fullGroups} remainder ${extra}.`,
              `${fullGroups} minibuses are full, but ${extra} more people still need a seat, so one more minibus is needed: ${answer}.`,
            ],
            check: `${answer} minibuses can hold up to ${answer * capacity} people, which is enough for all ${total}.`,
          } };
      },
      // (c) round the remainder DOWN: the leftover is discarded
      () => {
        const rowSize = rand(4, 9);
        const rows = rand(3, 10);
        const extra = rand(1, rowSize - 1);
        const total = rowSize * rows + extra;
        const decoys = [rows + 1, Math.round(total / rowSize), rows - 1].filter((x) => x !== rows && x >= 0);
        const { options, correctIndex } = buildMC(rows, decoys);
        return { q: `${total} tiles are used to make complete rows of ${rowSize} tiles each. How many complete rows can be made?`, options, correctIndex,
          hint: "This is a round the remainder down question. When sharing things into groups but the leftovers can't make a full group of their own, those leftovers just don't count, so the answer is rounded DOWN to the number of full groups.",
          solution: {
            scenario: `${total} tiles are arranged into complete rows of ${rowSize} tiles each. We need to find how many complete rows can be made.`,
            idea: "Sometimes only complete, full groups count as 'proper' groups, like complete rows of tiles. If dividing leaves some tiles over, those extra tiles can't make a whole row, so they're simply left out of the count. The answer is just the number of full groups, ignoring the remainder.",
            method: ["Divide the total by the group size to get the full groups and the remainder.", "Ignore the remainder, since it can't make a full group."],
            steps: [
              `${total} ÷ ${rowSize} = ${rows} remainder ${extra}.`,
              `Only whole rows count, so ${rows} complete rows can be made (with ${extra} tiles left over).`,
            ],
            check: `${rows} × ${rowSize} = ${rows * rowSize}, which is ${extra} less than ${total}, matching the leftover tiles.`,
          } };
      },
      // (d) state the leftover directly
      () => {
        const children = rand(3, 9);
        const perChild = rand(3, 15);
        const extra = rand(1, children - 1);
        const total = children * perChild + extra;
        const nm = N1();
        const decoys = [perChild, children - extra, extra + 1].filter((x) => x !== extra && x >= 0);
        const { options, correctIndex } = buildMC(extra, decoys);
        return { q: `${nm} shares ${total} sweets equally among ${children} friends, giving out as many as possible. How many sweets are left over?`, options, correctIndex,
          hint: "This is a what's left over question. When sharing something out equally and it doesn't divide exactly, the amount left over after giving out as much as possible is the remainder, and that's exactly what this question is asking for.",
          solution: {
            scenario: `${total} sweets are shared equally among ${children} friends, giving out as many as possible. We need to find how many sweets are left over.`,
            idea: "Sharing a total equally among a number of people means dividing. If the total doesn't divide exactly, you give out as many whole shares as you can, and whatever is left afterwards, too little to give another whole share to everyone, is the remainder.",
            method: ["Divide the total by the number of people to find how many each gets, and what's left over.", "The leftover amount is the remainder."],
            steps: [
              `${total} ÷ ${children} = ${perChild} remainder ${extra}.`,
              `${extra} sweets are left over.`,
            ],
            check: `${children} × ${perChild} = ${children * perChild}, and ${total} − ${children * perChild} = ${extra}, confirming the leftover amount.`,
          } };
      },
    ];
    const tier2 = [
      // (a) remainder as a decimal (money splits exactly, unlike sweets or tiles)
      () => {
        const people = pick([2, 4, 5, 8]);
        const perPerson = rand(10, 80);
        const totalPence = people * perPerson;
        const totalPounds = totalPence / 100;
        const perPersonPounds = perPerson / 100;
        const decoys = [Math.floor(perPersonPounds), totalPounds, perPersonPounds + 0.5].filter((x) => x !== perPersonPounds);
        const { options, correctIndex } = buildMC(perPersonPounds, decoys, (x) => "£" + x.toFixed(2));
        return { q: `£${totalPounds.toFixed(2)} is shared equally among ${people} people. How much does each person get?`, options, correctIndex,
          hint: "This is a sharing money exactly question. Money splits into pence, so unlike sweets or tiles which can only be shared in whole amounts, money can be shared right down to an exact decimal amount with nothing left over.",
          solution: {
            scenario: `£${totalPounds.toFixed(2)} is shared equally among ${people} people. We need to find how much each person gets.`,
            idea: "With things like sweets or tiles, if a division doesn't come out exact you're left with a whole-number remainder that can't be split further. Money is different, because pounds split into 100 pence each, so any leftover pounds can be converted into pence and shared out too, giving an exact decimal answer instead of a remainder.",
            method: ["Divide the total amount by the number of people.", "Write the answer as pounds and pence (a decimal), since money can always be split exactly."],
            steps: [`£${totalPounds.toFixed(2)} ÷ ${people} = £${perPersonPounds.toFixed(2)}.`],
            check: `${people} × £${perPersonPounds.toFixed(2)} = £${totalPounds.toFixed(2)}, so the shares add back up to the total with nothing left over.`,
          } };
      },
      // (b) misconception check: a remainder must be smaller than the divisor
      () => {
        const divisor = rand(4, 9);
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
          hint: "This is a spot the mistake question about remainders. A remainder is what's left over after making as many full groups as possible, so it always has to follow one rule: it must be smaller than the number you divided by, otherwise you could have made one more full group.",
          solution: {
            scenario: `We need to work out ${dividend} ÷ ${divisor} and pick the option that shows it correctly.`,
            idea: "Think about what a remainder actually means, it's the bit left over once you can't make any more full groups. If the leftover amount was equal to or bigger than the divisor, that would mean you could have made at least one more full group from it, so it isn't really 'left over' at all. This means a genuine remainder must always be smaller than the divisor.",
            method: ["Work out the correct quotient and remainder for the division.", "Check each option's remainder is smaller than the divisor.", "Rule out any option where the remainder is too big."],
            steps: [
              `${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}.`,
              `Checking this: ${divisor} × ${quotient} + ${remainder} = ${dividend}, which matches, so it's correct.`,
              `A remainder must always be smaller than the divisor (${divisor}), so any option with a remainder of ${divisor} or more must be wrong.`,
            ],
            check: `The remainder ${remainder} is smaller than the divisor ${divisor}, confirming ${quotient} remainder ${remainder} is the correct way to write it.`,
          } };
      },
      // (c) reconstruct the dividend from quotient and remainder
      () => {
        const divisor = rand(4, 9);
        const quotient = rand(5, 15);
        const remainder = rand(1, divisor - 1);
        const dividend = divisor * quotient + remainder;
        const decoys = [divisor * quotient, dividend + divisor, dividend - remainder - 1].filter((x) => x !== dividend && x > 0);
        const { options, correctIndex } = buildMC(dividend, decoys);
        return { q: `When a number is divided by ${divisor}, the answer is ${quotient} remainder ${remainder}. What was the number?`, options, correctIndex,
          hint: "This is a work backwards to the original number question. If you know how many full groups fit and how much was left over, you can rebuild the original number by multiplying the groups back up and adding the leftover back on.",
          solution: {
            scenario: `A number divided by ${divisor} gives ${quotient} remainder ${remainder}. We need to find the original number.`,
            idea: "Division splits a number into full groups and a remainder. To reverse this and find the original number, do the opposite of dividing: multiply the number of full groups by the group size, then add the remainder back on.",
            method: ["Multiply the divisor by the quotient (the number of full groups).", "Add the remainder to that result."],
            steps: [
              `${divisor} × ${quotient} = ${divisor * quotient}.`,
              `${divisor * quotient} + ${remainder} = ${dividend}.`,
            ],
            check: `Dividing ${dividend} by ${divisor} again gives ${quotient} remainder ${remainder}, back where we started.`,
          } };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.divisionRemainders(d);
  },
  factorsMultiplesPrimes(d) {
    function factorsOf(n) { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; }
    function isPrime(n) { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
    const tier1 = [
      // (a) which of these is NOT a factor
      () => {
        const num = pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 64, 66, 70, 72]);
        const facs = factorsOf(num);
        const nonFacs = [];
        for (let i = 2; i <= num - 1 && nonFacs.length < 4; i++) if (!facs.includes(i)) nonFacs.push(i);
        if (nonFacs.length < 3) return null;
        const answer = pick(nonFacs);
        // Always supply 4 real wrong options (never fewer) — buildMC tops up any shortfall
        // with a blind correct±random filler that has no idea 0 (or another real factor)
        // isn't a valid "not a factor" answer, which is how 0 was sneaking into these options.
        const wrongOpts = shuffle(facs.filter((f) => f > 1 && f < num)).slice(0, 4);
        if (wrongOpts.length < 4) return null;
        const { options, correctIndex } = buildMC(answer, wrongOpts);
        return { q: `Which of these is NOT a factor of ${num}?`, options, correctIndex,
          hint: "This is a spot the non-factor question. A factor of a number is a whole number that divides into it exactly, with nothing left over. To find which given number is NOT a factor, check whether each one divides exactly into the target number.",
          solution: {
            scenario: `We need to find which of the given numbers is NOT a factor of ${num}.`,
            idea: "A factor of a number divides into it with no remainder at all, for example 3 is a factor of 12 because 12 ÷ 3 = 4 exactly. If dividing leaves any remainder, that number is not a factor. So to spot the one that isn't a factor, try dividing the target number by each option and look for the one that doesn't divide exactly.",
            method: ["List the factors of the target number (or check each option by dividing).", "Find the option that is not in that list."],
            steps: [
              `The factors of ${num} are: ${facs.join(", ")}.`,
              `${answer} does not divide exactly into ${num}, so it is not a factor.`,
            ],
            check: `${num} ÷ ${answer} = ${(num / answer).toFixed(2)}, which is not a whole number, confirming ${answer} is not a factor.`,
          } };
      },
      // (b) which of these is prime
      () => {
        // 5 candidates (not 4) so the 4 non-prime ones are real distractors, not a buildMC filler.
        const candidates = [];
        while (candidates.length < 5) { const n = rand(2, 97); if (!candidates.includes(n)) candidates.push(n); }
        const primesAmong = candidates.filter(isPrime);
        if (primesAmong.length !== 1) return null;
        const answer = primesAmong[0];
        const { options, correctIndex } = buildMC(answer, candidates.filter((c) => c !== answer));
        return { q: `Which of these numbers is prime?`, options, correctIndex,
          hint: "This is a spot the prime number question. A prime number is a whole number bigger than 1 that can only be divided exactly by 1 and itself, nothing else. To find the prime among a list, check whether each number has any other factors.",
          solution: {
            scenario: `We need to find which of the given numbers is prime.`,
            idea: "Most numbers can be divided exactly by several different numbers, for example 12 can be divided by 1, 2, 3, 4, 6 and 12. A prime number is special: it can ONLY be divided exactly by 1 and itself, no other whole number works. So to find the prime number in a list, check each one for any other factors, the one with none is prime.",
            method: ["For each number, check if anything other than 1 and itself divides into it exactly.", "The number with no other factors is prime."],
            steps: [
              `A prime number has exactly two factors: 1 and itself.`,
              `${answer} is only divisible by 1 and ${answer}, so it is prime. The others have more factors.`,
            ],
            check: `Trying to divide ${answer} by any number from 2 up to ${answer - 1} never comes out exact, confirming it is prime.`,
          } };
      },
      // (c) recognise a multiple by structure
      () => {
        const divisor = pick([5, 10, 25, 50, 100]);
        const multiple = divisor * rand(3, 30);
        const nonMultiples = [];
        while (nonMultiples.length < 4) { const cand = multiple + rand(1, divisor - 1); if (cand % divisor !== 0 && !nonMultiples.includes(cand)) nonMultiples.push(cand); }
        const { options, correctIndex } = buildMC(multiple, nonMultiples);
        return { q: `Which of these numbers is a multiple of ${divisor}?`, options, correctIndex,
          hint: "This is a spot the multiple question. A multiple of a number is what you get when you multiply it by a whole number, like 15, 20 and 25 are all multiples of 5. To check if a number is a multiple of another, see if it divides exactly by it.",
          solution: {
            scenario: `We need to find which of the given numbers is a multiple of ${divisor}.`,
            idea: "Multiples of a number are found by multiplying it by 1, 2, 3, 4 and so on, they're the numbers in its times table. A number IS a multiple of another exactly when dividing it by that other number gives a whole number with no remainder.",
            method: ["Divide each option by the given number.", "The one that divides exactly (no remainder) is the multiple."],
            steps: [`${multiple} ÷ ${divisor} = ${multiple / divisor}, so ${multiple} is a multiple of ${divisor}.`],
            check: `${divisor} × ${multiple / divisor} = ${multiple}, confirming it.`,
          } };
      },
      // (d) square numbers
      () => {
        const squares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
        const answer = pick(squares);
        const nonSquares = [];
        while (nonSquares.length < 4) { const cand = rand(2, 150); if (!squares.includes(cand) && cand !== answer && !nonSquares.includes(cand)) nonSquares.push(cand); }
        const { options, correctIndex } = buildMC(answer, nonSquares);
        return { q: `Which of these numbers is a square number?`, options, correctIndex,
          hint: "This is a spot the square number question. A square number is what you get when you multiply a whole number by itself, like 4 (2×2) or 9 (3×3). To check if a number is a square number, see if it can be made by multiplying some whole number by itself.",
          solution: {
            scenario: `We need to find which of the given numbers is a square number.`,
            idea: "Square numbers come from multiplying a whole number by itself: 1×1=1, 2×2=4, 3×3=9, and so on. A number is a square number only if you can find a whole number that, multiplied by itself, gives exactly that number.",
            method: ["Try to find a whole number that, multiplied by itself, gives the target number.", "If you find one, it's a square number."],
            steps: [`${answer} = ${Math.sqrt(answer)} × ${Math.sqrt(answer)}, so it is a square number.`],
            check: `${Math.sqrt(answer)} × ${Math.sqrt(answer)} = ${answer}, confirming it's a square number.`,
          } };
      },
    ];
    const tier2 = [
      // (a) product of three factors
      () => {
        const num = pick([24, 36, 48, 60, 72, 90, 100, 120]);
        const facs = factorsOf(num).filter((f) => f > 1);
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
          hint: "This is a split into three factors question. Instead of writing a number as two numbers multiplied together, you're writing it as three numbers multiplied together, each one bigger than 1. The three numbers still have to multiply back up to the original number exactly.",
          solution: {
            scenario: `We need to write ${num} as three factors, each bigger than 1, multiplied together.`,
            idea: "Just as a number can be split into two factors multiplied together (like 12 = 3 × 4), it can often be split into three factors too (like 12 = 2 × 2 × 3), as long as all three numbers multiply back up to the original. To check if a given triple is correct, just multiply all three together and see if you get the target number.",
            method: ["Multiply the three given numbers together.", "Check the result matches the target number."],
            steps: [`${triple[0]} × ${triple[1]} × ${triple[2]} = ${num}.`],
            check: `Multiplying any of the wrong options together instead does not give exactly ${num}.`,
          } };
      },
      // (b) highest common factor
      () => {
        const a = rand(10, 60), b = rand(10, 60);
        if (a === b) return null;
        const fa = factorsOf(a), fb = factorsOf(b);
        const common = fa.filter((x) => fb.includes(x));
        const hcf = Math.max(...common);
        if (hcf === 1) return null;
        // A full pool of plausible wrong answers, so buildMC never has to invent a filler
        // (its blind correct±random fallback can land on 0, or on another genuine common factor).
        const hcfPool = [Math.min(a, b), Math.max(a, b), hcf * 2, hcf + 1, hcf > 2 ? hcf - 1 : hcf + 3, common.length > 1 ? common[common.length - 2] : hcf * (b > a ? 2 : 3)];
        const decoys = [...new Set(hcfPool.filter((x) => x !== hcf && x >= 1))].slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMC(hcf, decoys);
        return { q: `What is the highest common factor of ${a} and ${b}?`, options, correctIndex,
          hint: "This is a highest common factor question. Two numbers can share some of the same factors, and the biggest factor they both have in common is called the highest common factor. To find it, list the factors of each number and see which is the biggest one that appears in both lists.",
          solution: {
            scenario: `We need to find the highest common factor of ${a} and ${b}.`,
            idea: "A factor of a number divides into it exactly. Two different numbers often share some of the same factors, for example both 12 and 18 can be divided exactly by 1, 2, 3 and 6. The highest common factor is simply the biggest number that appears in BOTH numbers' factor lists.",
            method: ["List the factors of the first number.", "List the factors of the second number.", "Find the biggest number that appears in both lists."],
            steps: [
              `Factors of ${a}: ${fa.join(", ")}.`,
              `Factors of ${b}: ${fb.join(", ")}.`,
              `Common factors: ${common.join(", ")}. The highest is ${hcf}.`,
            ],
            check: `${a} ÷ ${hcf} = ${a / hcf} and ${b} ÷ ${hcf} = ${b / hcf}, both whole numbers, confirming ${hcf} divides exactly into both.`,
          } };
      },
      // (c) lowest common multiple
      () => {
        const a = rand(2, 12), b = rand(2, 12);
        if (a === b) return null;
        const lcm = (a * b) / gcd(a, b);
        if (lcm > 144) return null;
        const lcmPool = [a * b, Math.max(a, b), lcm + Math.min(a, b), Math.max(1, lcm - Math.min(a, b)), lcm * 2, Math.min(a, b)];
        const decoys = [...new Set(lcmPool.filter((x) => x !== lcm && x >= 1))].slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMC(lcm, decoys);
        return { q: `What is the lowest common multiple of ${a} and ${b}?`, options, correctIndex,
          hint: "This is a lowest common multiple question. Two numbers each have their own list of multiples (their times tables), and sometimes the same number turns up in both lists. The smallest number that appears in both times tables is called the lowest common multiple.",
          solution: {
            scenario: `We need to find the lowest common multiple of ${a} and ${b}.`,
            idea: "A multiple of a number is any number in its times table. Two different numbers' times tables sometimes overlap, sharing some of the same numbers. The lowest common multiple is the smallest number that appears in BOTH times tables.",
            method: ["List some multiples of the first number.", "List some multiples of the second number.", "Find the smallest number that appears in both lists."],
            steps: [
              `Multiples of ${a}: ${a}, ${2 * a}, ${3 * a}, ${4 * a}...`,
              `Multiples of ${b}: ${b}, ${2 * b}, ${3 * b}, ${4 * b}...`,
              `The smallest number in both lists is ${lcm}.`,
            ],
            check: `${lcm} ÷ ${a} = ${lcm / a} and ${lcm} ÷ ${b} = ${lcm / b}, both whole numbers, confirming ${lcm} is a multiple of both.`,
          } };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.factorsMultiplesPrimes(d);
  },
  sequencePattern(d) {
    const tier1 = [
      // (a) position within one repeating cycle
      () => {
        const cycleLen = rand(2, 4);
        const palette = ["🔴", "🔵", "🟢", "🟡", "🟣"];
        const cycle = shuffle(palette).slice(0, cycleLen);
        const n = rand(cycleLen * 4, cycleLen * 20);
        const idx = (n - 1) % cycleLen;
        const answer = cycle[idx];
        const posInCycle = idx + 1;
        const otherInCycle = cycle.filter((s) => s !== answer);
        const unused = palette.filter((s) => !cycle.includes(s));
        const decoys = [...otherInCycle, ...unused];
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `A pattern repeats forever: ${cycle.join(" ")} | ${cycle.join(" ")} | ...\nWhat is the symbol in position ${n} of the pattern?`, options, correctIndex,
          hint: "This is a cyclic pattern question. The symbols repeat in a fixed block that loops forever. To find what appears at any position, work out where that position falls within one cycle. Divide the position number by the cycle length — the remainder tells you the position within one cycle (with remainder 0 meaning the last item).",
          solution: {
            idea: "For a repeating cycle of length n, the item at position p is determined by the remainder when (p − 1) is divided by n.",
            steps: [
              `The pattern repeats every ${cycleLen} symbols, so position ${n} matches position ${posInCycle} within one cycle.`,
              `Position ${posInCycle} is ${answer}.`
            ]
          }
        };
      },
      // (b) arithmetic sequence: find the next term
      () => {
        const step = pick([2, 3, 4, 5, 10, -2, -3, -4]);
        const start = step < 0 ? rand(30, 60) : rand(2, 20);
        if (start + 4 * step < 0) return null;
        const seq = Array.from({ length: 4 }, (_, i) => start + i * step);
        const nextTerm = start + 4 * step;
        const decoys = [nextTerm + step, nextTerm - step, seq[3] + 1].filter((x) => x !== nextTerm);
        const { options, correctIndex } = buildMC(nextTerm, decoys);
        return { q: `What is the next number in the sequence: ${seq.join(", ")}, ...?`, options, correctIndex,
          hint: "This is an arithmetic sequence — one where each term is obtained from the previous by adding a fixed amount called the common difference. Find the difference between consecutive terms, confirm it is constant, then apply it one more time to find the next term.",
          solution: {
            idea: "An arithmetic sequence has a constant difference between consecutive terms. Add this difference to the last term to find the next.",
            steps: [
              `Each term ${step > 0 ? "increases" : "decreases"} by ${Math.abs(step)}.`,
              `The next term is ${seq[3]} ${step > 0 ? "+" : "−"} ${Math.abs(step)} = ${nextTerm}.`
            ]
          }
        };
      },
      // (c) skip-counting to a specific term
      () => {
        const step = pick([25, 50, 100, 200, 250, 500]);
        const startAt = pick([0, step]);
        const n = rand(5, 20);
        const answer = startAt + step * (n - 1);
        const decoys = [answer + step, answer - step, step * n].filter((x) => x !== answer && x >= 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Counting in steps of ${step} starting at ${startAt}: ${startAt}, ${startAt + step}, ${startAt + 2 * step}, ... What is the ${n}th number in this count?`, options, correctIndex,
          hint: "Skip-counting builds a sequence by repeatedly adding the same step. To find the nth term directly without listing every term, use: nth term = start + (n − 1) × step size. This avoids counting one term at a time.",
          solution: {
            idea: "The nth term of a skip-counting sequence starting at s with step d is: s + (n − 1) × d.",
            steps: [
              `The ${n}th number is ${startAt} + ${n - 1} × ${step} = ${answer}.`
            ]
          }
        };
      },
      // (d) missing term inside a sequence
      () => {
        const step = pick([2, 3, 4, 5, 6]);
        const start = rand(2, 15);
        const len = 6;
        const seq = Array.from({ length: len }, (_, i) => start + i * step);
        const gapIdx = rand(1, len - 2);
        const answer = seq[gapIdx];
        const displayed = seq.map((v, i) => (i === gapIdx ? "?" : v));
        const decoys = [answer + step, answer - step, answer + 1].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Find the missing number in the sequence: ${displayed.join(", ")}`, options, correctIndex,
          hint: "To find a missing term inside a sequence, identify the common difference by comparing visible neighbouring terms. The missing term equals the term before it plus the step, or the term after it minus the step. Check both to confirm they agree.",
          solution: {
            idea: "The missing term in an arithmetic sequence is found by applying the common difference to an adjacent known term.",
            steps: [
              `Each term increases by ${step}.`,
              `The missing number is ${seq[gapIdx - 1]} + ${step} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) two independent repeating attributes combined
      () => {
        const colours = ["red", "yellow", "blue", "green"];
        const bodyCycle = shuffle(colours).slice(0, rand(2, 3));
        const roofCycle = shuffle(colours).slice(0, rand(2, 3));
        const totalItems = rand(12, 20);
        const tBody = pick(bodyCycle), tRoof = pick(roofCycle);
        let count = 0;
        for (let i = 0; i < totalItems; i++) if (bodyCycle[i % bodyCycle.length] === tBody && roofCycle[i % roofCycle.length] === tRoof) count++;
        if (count === 0 || count === totalItems) return null;
        const decoys = [count + 1, count - 1, Math.floor(totalItems / bodyCycle.length)].filter((x) => x !== count && x >= 0);
        const { options, correctIndex } = buildMC(count, decoys);
        return { q: `A train has ${totalItems} coaches. Each coach's body colour follows this repeating pattern: ${bodyCycle.join(", ")}. Each coach's roof colour follows this repeating pattern: ${roofCycle.join(", ")}. How many of the ${totalItems} coaches have a ${tBody} body AND a ${tRoof} roof?`, options, correctIndex,
          hint: "This question has two independent repeating patterns — one for body colour and one for roof colour — and asks how many coaches satisfy both at once. Work through each coach in order, tracking which body colour and roof colour it gets according to its position in each separate cycle, then count the coaches where both match your targets.",
          solution: {
            idea: "Two independent repeating attributes combine independently. Check each item's position in both cycles simultaneously and count where both conditions are met.",
            steps: [
              `Body colour repeats every ${bodyCycle.length} coaches; roof colour repeats every ${roofCycle.length} coaches.`,
              `Checking each of the ${totalItems} coaches against both patterns at once: ${count} coaches match both.`
            ]
          }
        };
      },
      // (b) counting backwards from the end
      () => {
        const total = rand(20, 60);
        const cycleLen = rand(2, 4);
        const palette = ["🔴", "🔵", "🟢", "🟡", "🟣"];
        const cycle = shuffle(palette).slice(0, cycleLen);
        const fromEnd = rand(2, 6);
        const posFromStart = total - fromEnd + 1;
        const idx = (posFromStart - 1) % cycleLen;
        const answer = cycle[idx];
        const otherInCycle = cycle.filter((s) => s !== answer);
        const unused = palette.filter((s) => !cycle.includes(s));
        const decoys = [...otherInCycle, ...unused];
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `A pattern has ${total} symbols in total, built from this repeating block: ${cycle.join(" ")}. Counting backwards from the very end (the last symbol is position 1, the one before it is position 2, and so on), what symbol is in position ${fromEnd}?`, options, correctIndex,
          hint: "Counting backwards from the end of a sequence can be converted to a forwards position. Position k from the end of a sequence of length N is position (N − k + 1) from the start. Once you have the forward position, apply the usual repeating-cycle calculation.",
          solution: {
            idea: "Position k from the end of a sequence of length N equals position (N − k + 1) from the start. Then use the cycle rule.",
            steps: [
              `Position ${fromEnd} from the end is the same as position ${posFromStart} counting from the start (since ${total} − ${fromEnd} + 1 = ${posFromStart}).`,
              `Position ${posFromStart} matches position ${idx + 1} within one cycle: ${answer}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.sequencePattern(d);
  },
  fractionEquivalence(d) {
    const tier1 = [
      // (a) scale a fraction up to an equivalent one
      () => {
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
          hint: "Equivalent fractions represent the same value even though they look different. To find an equivalent fraction, multiply (or divide) both the numerator and the denominator by the same number. The fraction's value does not change as long as you do the same thing to both top and bottom.",
          solution: {
            idea: "Equivalent fractions are made by multiplying or dividing both numerator and denominator by the same non-zero number.",
            steps: [
              `Multiply the top and bottom of ${n}/${den} by ${k}.`,
              `${n}×${k} = ${bigN}, ${den}×${k} = ${bigD}.`,
              `${n}/${den} = ${ans}.`
            ]
          }
        };
      },
      // (b) simplify a fraction to lowest terms
      () => {
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
          hint: "Simplifying a fraction means dividing both the numerator and denominator by their highest common factor (HCF) until no common factor greater than 1 remains. A fraction is in its lowest terms when the numerator and denominator share no common factor other than 1.",
          solution: {
            idea: "To simplify a fraction, divide both the top and bottom by their HCF. Repeat until no further simplification is possible.",
            steps: [
              `The highest common factor of ${n} and ${den} is ${g}.`,
              `${n}÷${g} = ${rn}, ${den}÷${g} = ${rd}.`,
              `${n}/${den} = ${ans}.`
            ]
          }
        };
      },
      // (c) same-numerator comparison: smaller denominator = larger fraction
      () => {
        const n = rand(1, 5);
        const denoms = new Set();
        while (denoms.size < 5) denoms.add(rand(n + 1, 20));
        const arr = [...denoms];
        const wantLarger = pick([true, false]);
        const targetDenom = wantLarger ? Math.min(...arr) : Math.max(...arr);
        const ans = `${n}/${targetDenom}`;
        const shown = [targetDenom, ...arr.filter((x) => x !== targetDenom).slice(0, 4)];
        const decoys = shown.filter((x) => x !== targetDenom).map((x) => `${n}/${x}`);
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Which of these fractions is the ${wantLarger ? "largest" : "smallest"}: ${arr.map((x) => `${n}/${x}`).join(", ")}?`, options, correctIndex,
          hint: "When fractions have the same numerator (top number), the one with the smaller denominator (bottom number) is actually larger — because you are dividing the same quantity into fewer pieces, so each piece is bigger. This is the opposite of what many people first expect.",
          solution: {
            idea: "With equal numerators, a smaller denominator means a larger fraction — the fewer the equal parts, the bigger each part is.",
            steps: [
              `All these fractions have the same numerator (${n}), so the one with the ${wantLarger ? "smallest" : "largest"} denominator is the ${wantLarger ? "largest" : "smallest"}.`,
              `The answer is ${ans}.`
            ]
          }
        };
      },
      // (d) missing term in an equivalence chain
      () => {
        const n = rand(1, 6), den = rand(n + 1, 9);
        if (gcd(n, den) !== 1) return null;
        const k = rand(2, 8);
        const bigD = den * k;
        const answer = n * k;
        const decoys = [bigD, answer + 1, answer - 1, n + k].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `${n}/${den} = ?/${bigD}. What number goes in place of the ?`, options, correctIndex,
          hint: "This is a missing numerator in an equivalence chain. Work out what the denominator was multiplied by to get from the original to the new one, then multiply the numerator by the same amount. The key insight is that equivalent fractions require the same multiplier for both top and bottom.",
          solution: {
            idea: "To find a missing numerator in an equivalent fraction, find what the denominator was multiplied by, then apply the same factor to the numerator.",
            steps: [
              `${bigD}÷${den} = ${k}, so multiply the numerator by ${k} too.`,
              `${n}×${k} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) "distance from a whole number" reasoning
      () => {
        const d1 = rand(3, 9), d2 = rand(3, 9);
        if (d1 === d2) return null;
        const n1 = d1 - 1, n2 = d2 - 1;
        const wantLarger = pick([true, false]);
        const bigDen = Math.max(d1, d2), smallDen = Math.min(d1, d2);
        const ans = wantLarger ? `${bigDen - 1}/${bigDen}` : `${smallDen - 1}/${smallDen}`;
        const other = wantLarger ? `${smallDen - 1}/${smallDen}` : `${bigDen - 1}/${bigDen}`;
        const candidates = [other, `${n1}/${d2}`, `${n2}/${d1}`, `1/${bigDen}`, `1/${smallDen}`, `${bigDen - 2}/${bigDen}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Which is ${wantLarger ? "larger" : "smaller"}: ${n1}/${d1} or ${n2}/${d2}?`, options, correctIndex,
          hint: "These fractions are each just one part short of a whole. Think about how far each is from 1 — the one that is closer to 1 (i.e. missing less) is the larger fraction. The fraction n/(n+1) is 1/(n+1) short of a whole, so the one with the bigger denominator is actually closer to 1.",
          solution: {
            idea: "Fractions of the form (n−1)/n are each 1/n short of a whole. The one with the smaller 'shortfall' is larger.",
            steps: [
              `${n1}/${d1} is 1/${d1} short of a whole. ${n2}/${d2} is 1/${d2} short of a whole.`,
              `The fraction with the SMALLER "short of a whole" amount is the bigger fraction overall.`,
              `So the ${wantLarger ? "larger" : "smaller"} fraction is ${ans}.`
            ]
          }
        };
      },
      // (b) order 4 mixed-denominator fractions
      () => {
        const fracs = [];
        const seen = new Set();
        let guard = 0;
        while (fracs.length < 4 && guard < 300) {
          guard++;
          const dd = rand(2, 12), nn = rand(1, dd - 1);
          if (gcd(nn, dd) !== 1) continue;
          const key = `${nn}/${dd}`;
          if (seen.has(key)) continue;
          seen.add(key);
          fracs.push({ n: nn, d: dd, val: nn / dd });
        }
        if (fracs.length < 4) return null;
        const wantLarger = pick([true, false]);
        const target = wantLarger ? fracs.reduce((a, b) => (b.val > a.val ? b : a)) : fracs.reduce((a, b) => (b.val < a.val ? b : a));
        const ans = `${target.n}/${target.d}`;
        const decoys = [...fracs.filter((f) => f !== target).map((f) => `${f.n}/${f.d}`), `${target.d}/${target.n}`];
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Which of these fractions is the ${wantLarger ? "largest" : "smallest"}: ${fracs.map((f) => `${f.n}/${f.d}`).join(", ")}?`, options, correctIndex,
          hint: "Comparing fractions with different denominators is easiest if you convert each to a decimal (divide numerator by denominator) or find a common denominator. Converting to decimals is usually quicker for a multiple-choice comparison — just divide and compare the decimal values.",
          solution: {
            idea: "To compare fractions with unlike denominators, convert each to a decimal (n ÷ d) and compare the decimal values.",
            steps: [
              `Convert each to a decimal to compare: ${fracs.map((f) => `${f.n}/${f.d}≈${f.val.toFixed(2)}`).join(", ")}.`,
              `The ${wantLarger ? "largest" : "smallest"} is ${ans}.`
            ]
          }
        };
      },
      // (c) read a fraction from a count, simplified
      () => {
        const total = rand(6, 24);
        const shaded = rand(1, total - 1);
        const g = gcd(shaded, total);
        if (g === 1) return null;
        const simN = shaded / g, simD = total / g;
        const ans = `${simN}/${simD}`;
        const candidates = [`${shaded}/${total}`, `${simN + 1}/${simD}`, `${simD - simN}/${simD}`, `${simN}/${simD + 1}`, `${simD}/${simN}`, `${Math.max(simN - 1, 1)}/${simD}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `${shaded} out of ${total} equal squares in a grid are shaded. What fraction is shaded, in its simplest form?`, options, correctIndex,
          hint: "Reading a fraction from a diagram means writing the shaded count over the total count. But the question asks for simplest form — so after writing the fraction as shaded/total, divide both numbers by their highest common factor to reduce it as far as possible.",
          solution: {
            idea: "Write the fraction as shaded/total, then simplify by dividing both parts by their HCF.",
            steps: [
              `${shaded}/${total} simplifies by dividing both by ${g}.`,
              `${shaded}/${total} = ${ans}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.fractionEquivalence(d);
  },
  fractionArithmetic(d) {
    const tier1 = [
      // (a) add, same denominator, no bridging
      () => {
        const den = rand(4, 12);
        const n1 = rand(1, den - 2), n2 = rand(1, den - 1 - n1);
        const sumN = n1 + n2;
        const g = gcd(sumN, den);
        const ans = `${sumN / g}/${den / g}`;
        const candidates = [`${sumN}/${2 * den}`, `${sumN + 1}/${den}`, `${Math.abs(n1 - n2)}/${den}`, `${sumN}/${den}`, `${den - sumN}/${den}`, `${n1}/${den}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Work out ${n1}/${den} + ${n2}/${den}. Give your answer in its simplest form.`, options, correctIndex,
          hint: "Adding fractions with the same denominator is straightforward — the denominator stays the same and you just add the numerators. After adding, simplify the result by dividing both numerator and denominator by their highest common factor if needed.",
          solution: {
            idea: "When denominators match, add the numerators and keep the denominator. Then simplify the result.",
            steps: [
              `${n1}/${den} + ${n2}/${den} = ${sumN}/${den}.`,
              g > 1 ? `Simplify: ${sumN}/${den} = ${ans}.` : `This is already in simplest form.`
            ]
          }
        };
      },
      // (b) subtract, same denominator, no bridging
      () => {
        const den = rand(4, 12);
        const n1 = rand(2, den - 1), n2 = rand(1, n1 - 1);
        const diffN = n1 - n2;
        const g = gcd(diffN, den);
        const ans = `${diffN / g}/${den / g}`;
        const candidates = [`${diffN}/${den}`, `${n1 + n2}/${den}`, `${diffN + 1}/${den}`, `${diffN - 1}/${den}`, `${n2}/${den}`, `${n1}/${den}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Work out ${n1}/${den} − ${n2}/${den}. Give your answer in its simplest form.`, options, correctIndex,
          hint: "Subtracting fractions with the same denominator works like addition — the denominator stays the same and you subtract the numerators. After subtracting, simplify the result if numerator and denominator share a common factor.",
          solution: {
            idea: "When denominators match, subtract the numerators and keep the denominator. Then simplify.",
            steps: [
              `${n1}/${den} − ${n2}/${den} = ${diffN}/${den}.`,
              g > 1 ? `Simplify: ${diffN}/${den} = ${ans}.` : `This is already in simplest form.`
            ]
          }
        };
      },
      // (c) convert mixed number to improper fraction
      () => {
        const den = rand(3, 12);
        const whole = rand(1, 6);
        const n = rand(1, den - 1);
        const improperN = whole * den + n;
        const ans = `${improperN}/${den}`;
        const candidates = [`${whole * den}/${den}`, `${improperN + 1}/${den}`, `${whole + n}/${den}`, `${improperN}/${den + 1}`, `${improperN - 1}/${den}`, `${whole}/${den}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Write ${whole} ${n}/${den} as an improper fraction.`, options, correctIndex,
          hint: "A mixed number has a whole part and a fraction part. To convert it to an improper fraction, multiply the whole number by the denominator (to express the whole number as that many parts), then add the numerator. The denominator stays the same.",
          solution: {
            idea: "Mixed to improper: multiply the whole number by the denominator, add the numerator, keep the denominator.",
            steps: [
              `${whole} wholes = ${whole} × ${den} = ${whole * den} (in ${den}ths).`,
              `Add the extra ${n}: ${whole * den} + ${n} = ${improperN}, so the fraction is ${improperN}/${den}.`
            ]
          }
        };
      },
      // (d) convert improper fraction to mixed number
      () => {
        const den = rand(3, 12);
        const whole = rand(1, 6);
        const n = rand(1, den - 1);
        const improperN = whole * den + n;
        const ans = `${whole} ${n}/${den}`;
        const candidates = [`${whole + 1} ${n}/${den}`, `${whole} ${n + 1}/${den}`, `${Math.floor(improperN / den) + 1} ${n}/${den}`, `${whole} ${den - n}/${den}`, `${whole - 1 >= 0 ? whole - 1 : whole + 2} ${n}/${den}`, `${whole} ${Math.max(n - 1, 0)}/${den}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Write ${improperN}/${den} as a mixed number.`, options, correctIndex,
          hint: "An improper fraction has a numerator larger than or equal to its denominator. To convert to a mixed number, divide the numerator by the denominator — the quotient gives the whole number part, and the remainder over the denominator gives the fraction part.",
          solution: {
            idea: "Improper to mixed: divide numerator by denominator. The quotient is the whole number part; the remainder over the denominator is the fractional part.",
            steps: [
              `${improperN} ÷ ${den} = ${whole} remainder ${n}.`,
              `So ${improperN}/${den} = ${ans}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) add, bridging a whole number
      () => {
        const den = rand(4, 10);
        const whole = rand(1, 4);
        const n1 = rand(Math.max(1, den - 3), den - 1);
        const n2 = rand(2, den - 1);
        if (n1 + n2 <= den) return null;
        const carry = Math.floor((n1 + n2) / den);
        const remN = (n1 + n2) % den;
        const newWhole = whole + carry;
        const ans = remN === 0 ? `${newWhole}` : `${newWhole} ${remN}/${den}`;
        const candidates = [`${whole} ${n1 + n2}/${den}`, `${newWhole + 1}${remN ? ` ${remN}/${den}` : ""}`, `${newWhole}${remN ? ` ${remN + 1}/${den}` : ""}`, `${whole + 1} ${remN}/${den}`, `${Math.max(newWhole - 1, 0)}${remN ? ` ${remN}/${den}` : ""}`, `${newWhole}${remN ? ` ${Math.max(remN - 1, 1)}/${den}` : " 1"}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Work out ${whole} ${n1}/${den} + ${n2}/${den}.`, options, correctIndex,
          hint: "When adding fractions that sum to more than a whole, the fractional parts combine to give a value greater than 1 — so you need to carry one (or more) whole numbers across. Add the numerators as usual, convert any improper result to a whole number plus remainder fraction, then add to the existing whole number.",
          solution: {
            idea: "When the sum of the fractions exceeds 1, convert the improper fraction result to a mixed number and add the whole number part to the existing whole.",
            steps: [
              `${n1}/${den} + ${n2}/${den} = ${n1 + n2}/${den}, which is more than one whole.`,
              `${n1 + n2}/${den} = ${carry} whole${carry > 1 ? "s" : ""}${remN ? ` and ${remN}/${den}` : ""}.`,
              `${whole} + ${carry} = ${newWhole}, so the total is ${ans}.`
            ]
          }
        };
      },
      // (b) subtract, crossing a whole number ("borrowing")
      () => {
        const den = rand(4, 10);
        const whole = rand(2, 5);
        const n1 = rand(1, den - 2);
        const n2 = rand(n1 + 1, den - 1);
        const borrowWhole = whole - 1;
        const borrowedN = n1 + den;
        const remN = borrowedN - n2;
        const ans = `${borrowWhole} ${remN}/${den}`;
        const candidates = [`${whole} ${Math.abs(n1 - n2)}/${den}`, `${whole - 1} ${remN + 1}/${den}`, `${Math.max(whole - 2, 0)} ${remN}/${den}`, `${borrowWhole + 1} ${remN}/${den}`, `${whole} ${remN}/${den}`, `${borrowWhole} ${Math.max(remN - 1, 0)}/${den}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Work out ${whole} ${n1}/${den} − ${n2}/${den}.`, options, correctIndex,
          hint: "When the fraction being subtracted is larger than the fraction you have, borrow one whole from the whole number part and add it to the fractional part. One whole equals den/den, so your fractional part becomes (n1 + den)/den. Then subtract as normal.",
          solution: {
            idea: "If the fractional part being subtracted is too large, borrow one whole (which equals den/den) from the whole number, add it to the fraction, then subtract.",
            steps: [
              `${n1}/${den} is smaller than ${n2}/${den}, so borrow one whole from ${whole}.`,
              `${whole} ${n1}/${den} = ${borrowWhole} ${borrowedN}/${den}.`,
              `${borrowedN}/${den} − ${n2}/${den} = ${remN}/${den}, so the answer is ${ans}.`
            ]
          }
        };
      },
      // (c) add fractions with related (not equal) denominators
      () => {
        const smallD = rand(2, 6);
        const mult = rand(2, 4);
        const bigD = smallD * mult;
        const n1 = rand(1, smallD - 1);
        const n2 = rand(1, bigD - 1);
        const n1Scaled = n1 * mult;
        const sumN = n1Scaled + n2;
        const g = gcd(sumN, bigD);
        const ans = g > 1 ? `${sumN / g}/${bigD / g}` : `${sumN}/${bigD}`;
        const candidates = [`${n1 + n2}/${bigD}`, `${sumN}/${bigD}`, `${sumN + 1}/${bigD}`, `${n1Scaled}/${bigD}`, `${sumN}/${smallD + bigD}`, `${n2}/${bigD}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Work out ${n1}/${smallD} + ${n2}/${bigD}. Give your answer in its simplest form.`, options, correctIndex,
          hint: "To add fractions with different denominators, first make the denominators match. Here, one denominator is a multiple of the other, so you only need to scale up the fraction with the smaller denominator. Multiply its numerator and denominator by the appropriate factor, then add as normal.",
          solution: {
            idea: "When one denominator is a multiple of the other, convert only the smaller-denominator fraction to match the larger, then add.",
            steps: [
              `${bigD} ÷ ${smallD} = ${mult}, so ${n1}/${smallD} = ${n1Scaled}/${bigD}.`,
              `${n1Scaled}/${bigD} + ${n2}/${bigD} = ${sumN}/${bigD}.`,
              g > 1 ? `Simplify: ${ans}.` : `Already in simplest form.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.fractionArithmetic(d);
  },
  fractionOfQuantity(d) {
    const tier1 = [
      // (a) unit fraction of a quantity
      () => {
        const den = rand(2, 10);
        const multiple = rand(2, 15);
        const total = den * multiple;
        const ans = multiple;
        const decoys = [total, den, multiple + den, Math.round(total / (den + 1))].filter((x) => x !== ans && x > 0);
        const { options, correctIndex } = buildMC(ans, decoys);
        return { q: `What is 1/${den} of ${total}?`, options, correctIndex,
          hint: "A unit fraction (one with 1 on top) of a quantity means splitting that quantity into equal parts and taking one of them. To find 1/n of a number, divide the number by n. This is sometimes called 'finding one part' of a whole that has been divided into n equal parts.",
          solution: {
            idea: "To find 1/n of a quantity, divide by n.",
            steps: [`${total} ÷ ${den} = ${ans}.`]
          }
        };
      },
      // (b) non-unit fraction of a quantity
      () => {
        const den = rand(3, 10);
        const n = rand(2, den - 1);
        const unitPart = rand(2, 20);
        const total = den * unitPart;
        const ans = n * unitPart;
        const decoys = [unitPart, total, ans + unitPart, Math.round(total / n)].filter((x) => x !== ans && x > 0);
        const { options, correctIndex } = buildMC(ans, decoys);
        return { q: `What is ${n}/${den} of ${total}?`, options, correctIndex,
          hint: "To find a non-unit fraction of a quantity, use a two-step approach. First find one part (divide by the denominator), then multiply by the numerator to find the required number of parts. Think of it as 'divide to find one part, multiply to find n parts'.",
          solution: {
            idea: "To find n/d of a quantity: divide by d (to find 1/d), then multiply by n.",
            steps: [
              `${total} ÷ ${den} = ${unitPart} (this is 1/${den}).`,
              `${n}/${den} = ${n} × ${unitPart} = ${ans}.`
            ]
          }
        };
      },
      // (c) reverse: given the fraction's value, find the whole
      () => {
        const den = rand(3, 10);
        const n = rand(2, den - 1);
        const unitPart = rand(2, 20);
        const total = den * unitPart;
        const given = n * unitPart;
        const decoys = [given, total + unitPart, total - unitPart, Math.round((given * den) / (n + 1))].filter((x) => x !== total && x > 0);
        const { options, correctIndex } = buildMC(total, decoys);
        const nm = N1();
        return { q: `${nm} has ${given}, and this is ${n}/${den} of what ${nm} started with. How much did ${nm} start with?`, options, correctIndex,
          hint: "This is the inverse of 'fraction of a quantity' — you know the result and need to find the original whole. First find what one part (1/den) is worth by dividing the given value by the numerator, then multiply by the denominator to find the whole.",
          solution: {
            idea: "To find the whole when you know a fraction of it: divide by the numerator (to find 1/den), then multiply by the denominator.",
            steps: [
              `${n}/${den} of the total is ${given}, so 1/${den} of the total = ${given}÷${n} = ${unitPart}.`,
              `The whole total = ${unitPart} × ${den} = ${total}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) what fraction is one quantity of another
      () => {
        const total = rand(10, 60);
        const part = rand(1, total - 1);
        const g = gcd(part, total);
        const ans = `${part / g}/${total / g}`;
        const candidates = [`${part}/${total}`, `${part + 1}/${total}`, `${total - part}/${total}`, `${part / g}/${total / g + 1}`, `${total}/${part}`, `${Math.max(part - 1, 1)}/${total}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `What fraction of ${total} is ${part}? Give your answer in its simplest form.`, options, correctIndex,
          hint: "To express one quantity as a fraction of another, write the part over the whole (part/whole). Then simplify by dividing both numerator and denominator by their highest common factor. Make sure to write the part on top and the total on the bottom.",
          solution: {
            idea: "Part as a fraction of whole = part/whole, then simplify by dividing both by their HCF.",
            steps: [`${part}/${total} simplifies (divide both by ${g}) to ${ans}.`]
          }
        };
      },
      // (b) fraction of a money quantity
      () => {
        const den = pick([4, 5, 10]);
        const n = rand(1, den - 1);
        const unitP = rand(2, 15);
        const totalP = den * unitP;
        const ans = n * unitP;
        const decoys = [totalP, unitP, ans + unitP, totalP - ans].filter((x) => x !== ans && x >= 0);
        const { options, correctIndex } = buildMC(ans, decoys, (x) => (x >= 100 ? `£${(x / 100).toFixed(2)}` : `${x}p`));
        return { q: `What is ${n}/${den} of £${(totalP / 100).toFixed(2)}?`, options, correctIndex,
          hint: "When finding a fraction of a money amount, it is usually easier to work in pence first. Convert pounds to pence, apply the two-step method (divide by denominator, multiply by numerator), then convert back to pounds if the answer is 100p or more.",
          solution: {
            idea: "Convert to pence for easier arithmetic, find the fraction, then convert back to pounds.",
            steps: [
              `£${(totalP / 100).toFixed(2)} = ${totalP}p.`,
              `${totalP}p ÷ ${den} = ${unitP}p.`,
              `${n}/${den} = ${n} × ${unitP}p = ${ans}p${ans >= 100 ? ` = £${(ans / 100).toFixed(2)}` : ""}.`
            ]
          }
        };
      },
      // (c) compare two "fraction of a quantity" results
      () => {
        const d1 = rand(2, 6), n1 = rand(1, d1 - 1);
        const d2 = rand(2, 6), n2 = rand(1, d2 - 1);
        const q1 = rand(2, 10) * d1, q2 = rand(2, 10) * d2;
        if (q1 === q2) return null;
        const val1 = (n1 / d1) * q1, val2 = (n2 / d2) * q2;
        if (val1 === val2) return null;
        const wantBigger = pick([true, false]);
        const firstIsAnswer = wantBigger === val1 > val2;
        const ansStr = firstIsAnswer ? `${n1}/${d1} of ${q1}` : `${n2}/${d2} of ${q2}`;
        const otherStr = firstIsAnswer ? `${n2}/${d2} of ${q2}` : `${n1}/${d1} of ${q1}`;
        const candidates = [otherStr, `${n1}/${d1} of ${q2}`, `${n2}/${d2} of ${q1}`, `${n1}/${d1} of ${q1 + q2}`, `${n2}/${d2} of ${q1 + q2}`, `${n1}/${d1} of ${q2 + 1}`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ansStr).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ansStr, decoys);
        return { q: `Which is ${wantBigger ? "bigger" : "smaller"}: ${n1}/${d1} of ${q1}, or ${n2}/${d2} of ${q2}?`, options, correctIndex,
          hint: "To compare two 'fraction of a quantity' expressions, calculate each result separately using the divide-then-multiply method, then compare the two numbers you get. A bigger fraction does not automatically give a bigger result — it depends on the quantity too.",
          solution: {
            idea: "Calculate each fraction of its quantity separately, then compare the results.",
            steps: [
              `${n1}/${d1} of ${q1} = ${val1}.`,
              `${n2}/${d2} of ${q2} = ${val2}.`,
              `The ${wantBigger ? "bigger" : "smaller"} one is ${ansStr}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.fractionOfQuantity(d);
  },
  decimalPlaceValue(d) {
    const tier1 = [
      // (a) read the value of a digit in a decimal
      () => {
        const whole = rand(1, 99);
        const dp = pick([1, 2]);
        const fracDigits = Array.from({ length: dp }, () => rand(1, 9));
        const numStr = `${whole}.${fracDigits.join("")}`;
        const num = Number(numStr);
        const posIdx = rand(0, dp - 1);
        const placeNames = ["tenths", "hundredths"];
        const digit = fracDigits[posIdx];
        const place = posIdx + 1;
        const value = digit / Math.pow(10, place);
        const decoys = [digit, digit * 10, value * 10, value + digit].filter((x) => x !== value);
        const { options, correctIndex } = buildMC(value, decoys, (x) => x.toFixed(place));
        return { q: `What is the value of the digit ${digit} in the number ${numStr}?`, options, correctIndex,
          hint: "This is a decimal place value question. After the decimal point, the columns are tenths (÷10), hundredths (÷100), thousandths (÷1000), and so on. The value of a decimal digit is the digit divided by the column's power of ten — not just the digit itself.",
          solution: {
            idea: "Each position after the decimal point is worth a fraction: tenths (1/10), hundredths (1/100), etc. The digit's value is the digit times its column value.",
            steps: [
              `The digit ${digit} is in the ${placeNames[posIdx]} place.`,
              `Its value is ${digit}/${Math.pow(10, place)} = ${value}.`
            ]
          }
        };
      },
      // (b) compose a decimal from named parts
      () => {
        const whole = rand(1, 50);
        const tenths = rand(1, 9);
        const hundredths = rand(0, 9);
        const numCents = whole * 100 + tenths * 10 + hundredths;
        const num = numCents / 100;
        const desc = hundredths ? `${whole} ones, ${tenths} tenths and ${hundredths} hundredths` : `${whole} ones and ${tenths} tenths`;
        const decoys = [whole + tenths + hundredths, (whole * 100 + tenths) / 100, num + 0.1, (whole * 100 + hundredths * 10 + tenths) / 100].filter((x) => Math.abs(x - num) > 0.001);
        const { options, correctIndex } = buildMC(num, decoys, (x) => (Math.round(x * 100) / 100).toFixed(2));
        return { q: `A number is made from ${desc}. What is the number?`, options, correctIndex,
          hint: "To compose a decimal from named parts, write the whole number in front of the decimal point, then place each digit in the correct decimal column. Tenths go in the first decimal place, hundredths in the second. Be careful not to mix up the order.",
          solution: {
            idea: "Build the decimal by placing each part in its correct column: ones to the left of the decimal point, tenths in the first decimal place, hundredths in the second.",
            steps: [`${whole} + ${tenths}/10 + ${hundredths}/100 = ${num}.`]
          }
        };
      },
      // (c) fraction-decimal equivalence
      () => {
        const table = [["1/2", 0.5], ["1/4", 0.25], ["3/4", 0.75], ["1/5", 0.2], ["2/5", 0.4], ["3/5", 0.6], ["4/5", 0.8], ["1/10", 0.1], ["3/10", 0.3], ["7/10", 0.7], ["9/10", 0.9]];
        const [fracStr, dec] = pick(table);
        const askDecimal = pick([true, false]);
        if (askDecimal) {
          const decoys = [dec + 0.1, dec - 0.1, 1 - dec, dec * 10].filter((x) => Math.abs(x - dec) > 0.001 && x >= 0 && x <= 10);
          const { options, correctIndex } = buildMC(dec, decoys, (x) => (Math.round(x * 100) / 100).toFixed(2));
          return { q: `What is ${fracStr} as a decimal?`, options, correctIndex,
            hint: "Knowing the fraction-decimal equivalents for common fractions is very useful. Key ones to know: 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75, 1/5 = 0.2, 1/10 = 0.1. If you do not recall it, you can divide the numerator by the denominator.",
            solution: {
              idea: "Common fraction-decimal equivalents are worth memorising. Alternatively, divide numerator by denominator.",
              steps: [`${fracStr} = ${dec}.`]
            }
          };
        }
        const wrongFracs = table.filter(([, v]) => v !== dec).map(([f]) => f);
        const decoys = shuffle(wrongFracs).slice(0, 4);
        const { options, correctIndex } = buildMCStr(fracStr, decoys);
        return { q: `What is ${dec} as a fraction?`, options, correctIndex,
          hint: "Converting a decimal to a fraction means recognising which common fraction it represents, or writing it as a fraction with the appropriate power of ten as the denominator and then simplifying. For example, 0.4 = 4/10 = 2/5.",
          solution: {
            idea: "To convert a decimal to a fraction, write it over the appropriate power of ten (10 for one decimal place, 100 for two), then simplify.",
            steps: [`${dec} = ${fracStr}.`]
          }
        };
      },
      // (d) order/compare decimals
      () => {
        const nums = new Set();
        while (nums.size < 4) { const whole = rand(0, 9), dp1 = rand(0, 9), dp2 = rand(0, 9); nums.add(Number(`${whole}.${dp1}${dp2}`)); }
        const arr = [...nums];
        const wantLarger = pick([true, false]);
        const ans = wantLarger ? Math.max(...arr) : Math.min(...arr);
        const { options, correctIndex } = buildMC(ans, arr.filter((x) => x !== ans), (x) => String(x));
        return { q: `Which of these numbers is the ${wantLarger ? "largest" : "smallest"}: ${arr.join(", ")}?`, options, correctIndex,
          hint: "To compare decimals, look at the digits column by column from left to right, just as with whole numbers. Compare the whole number part first; if equal, compare the tenths digit; if still equal, compare the hundredths digit. Do not be misled by the number of decimal places — 0.9 is greater than 0.85.",
          solution: {
            idea: "Compare decimals digit by digit from left to right. The whole number part takes priority, then tenths, then hundredths.",
            steps: [
              `Compare the whole number part first, then tenths, then hundredths.`,
              `The ${wantLarger ? "largest" : "smallest"} is ${ans}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) multiply or divide by a power of 10, crossing 1
      () => {
        const wantMultiply = pick([true, false]);
        const scale = wantMultiply ? pick([10, 100, 1000]) : pick([10, 100]);
        const scalePow = Math.round(Math.log10(scale));
        const baseDp = wantMultiply ? pick([1, 2]) : (scalePow === 2 ? 0 : 1);
        const baseWhole = rand(1, 9);
        const baseFracDigits = baseDp === 0 ? "" : baseDp === 1 ? String(rand(1, 9)) : String(rand(1, 99)).padStart(2, "0");
        const base = baseFracDigits ? Number(`${baseWhole}.${baseFracDigits}`) : baseWhole;
        const allDigits = `${baseWhole}${baseFracDigits}`;
        const decimalPos = 1;
        let pos = wantMultiply ? decimalPos + scalePow : decimalPos - scalePow;
        let digits = allDigits;
        while (pos > digits.length) digits += "0";
        while (pos < 0) { digits = "0" + digits; pos++; }
        const intPart = digits.slice(0, pos) || "0";
        const fracPart = digits.slice(pos).replace(/0+$/, "");
        const answerStr = fracPart ? `${Number(intPart)}.${fracPart}` : `${Number(intPart)}`;
        const answer = Number(answerStr);
        const decoys = [base, wantMultiply ? base / scale : base * scale, answer * 10, answer / 10].map((x) => Math.round(x * 100) / 100).filter((x) => x !== answer && Number.isFinite(x));
        const { options, correctIndex } = buildMC(answer, decoys, (x) => String(x));
        return { q: `What is ${base} ${wantMultiply ? "×" : "÷"} ${scale}?`, options, correctIndex,
          hint: "Multiplying by 10, 100, or 1000 shifts the decimal point to the right by 1, 2, or 3 places; dividing shifts it to the left. Think of the digits staying still and the decimal point moving — or equivalently, the digits themselves shifting left or right relative to the decimal point.",
          solution: {
            idea: "Multiplying by a power of 10 shifts the decimal point right (or equivalently, moves all digits left); dividing shifts it left.",
            steps: [
              `${wantMultiply ? "Multiplying" : "Dividing"} by ${scale} moves the decimal point ${scalePow} place${scalePow > 1 ? "s" : ""} to the ${wantMultiply ? "right" : "left"}.`,
              `${base} ${wantMultiply ? "×" : "÷"} ${scale} = ${answerStr}.`
            ]
          }
        };
      },
      // (b) skip-counting in decimal steps
      () => {
        const step = pick([0.1, 0.2, 0.25, 0.5]);
        const startAt = pick([0, step]);
        const n = rand(4, 15);
        const stepCents = Math.round(step * 100);
        const startCents = Math.round(startAt * 100);
        const answerCents = startCents + stepCents * (n - 1);
        const answer = answerCents / 100;
        const decoys = [(answerCents + stepCents) / 100, (answerCents - stepCents) / 100, (stepCents * n) / 100].filter((x) => x !== answer && x >= 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => String(Math.round(x * 100) / 100));
        return { q: `Counting in steps of ${step} starting at ${startAt}: ${startAt}, ${Math.round((startAt + step) * 100) / 100}, ${Math.round((startAt + 2 * step) * 100) / 100}, ... What is the ${n}th number in this count?`, options, correctIndex,
          hint: "Skip-counting with decimals follows the same rule as with whole numbers. To find the nth term directly, use: start + (n − 1) × step size. Working in pence (multiply by 100) avoids floating-point errors when doing the arithmetic.",
          solution: {
            idea: "The nth term of a skip-counting sequence with decimal step d and start s is: s + (n − 1) × d.",
            steps: [
              `The ${n}th number is ${startAt} + ${n - 1} × ${step} = ${answer}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.decimalPlaceValue(d);
  },
  ratioBasics(d) {
    const CONVS = [
      { big: "km", small: "m", factor: 1000 }, { big: "m", small: "cm", factor: 100 },
      { big: "cm", small: "mm", factor: 10 }, { big: "kg", small: "g", factor: 1000 },
      { big: "l", small: "ml", factor: 1000 },
    ];
    const tier1 = [
      // (a) scale a ratio table to find a matching amount
      () => {
        const r1 = rand(1, 4), r2 = rand(1, 4);
        if (gcd(r1, r2) !== 1 || r1 === r2) return null;
        const k = rand(2, 10);
        const amount1 = r1 * k, amount2 = r2 * k;
        const [itemA, itemB] = pick([["cups of rice", "cups of water"], ["spoons of sugar", "spoons of butter"], ["litres of blue paint", "litres of yellow paint"], ["red beads", "blue beads"]]);
        const decoys = [amount1, amount2 + r2, amount2 - r2, Math.round((amount1 * r2) / r1)].filter((x) => x !== amount2 && x > 0);
        const { options, correctIndex } = buildMC(amount2, decoys);
        return { q: `A mixture uses ${itemA} and ${itemB} in the ratio ${r1}:${r2}. If ${amount1} ${itemA} are used, how many ${itemB} are needed?`, options, correctIndex,
          hint: "Ratio questions can be solved using the unitary method. First find how many 'batches' of the ratio are represented by the given amount (divide by the ratio part for that ingredient), then multiply by the ratio part for the ingredient you need. The ratio tells you the proportion, and you scale both parts equally.",
          solution: {
            idea: "Find the scale factor by dividing the given amount by the relevant ratio part, then multiply the other ratio part by the same scale factor.",
            steps: [
              `The ratio ${r1}:${r2} means for every ${r1} ${itemA}, there are ${r2} ${itemB}.`,
              `${amount1} ÷ ${r1} = ${k} (how many "batches" of the ratio).`,
              `${itemB} needed = ${k} × ${r2} = ${amount2}.`
            ]
          }
        };
      },
      // (b) scale a recipe for a different number of people
      () => {
        const servesOrig = rand(2, 6);
        const servesNew = rand(2, 8);
        if (servesOrig === servesNew) return null;
        const perServing = rand(2, 8);
        const origAmount = perServing * servesOrig;
        const scaledAmount = perServing * servesNew;
        const ingredient = pick(["grams of flour", "ml of milk", "grams of sugar", "grams of butter"]);
        const nm = N1();
        const decoys = [origAmount, scaledAmount + perServing, scaledAmount - perServing, Math.round((origAmount * servesNew) / (servesOrig + 1))].filter((x) => x !== scaledAmount && x > 0);
        const { options, correctIndex } = buildMC(scaledAmount, decoys);
        return { q: `${nm}'s recipe for ${servesOrig} people uses ${origAmount} ${ingredient}. How much ${ingredient} is needed to make the recipe for ${servesNew} people?`, options, correctIndex,
          hint: "Recipe scaling is a proportion problem. Find the amount per person (unitary method), then multiply by the new number of people. This works because recipes scale proportionally — more people means more of every ingredient by the same factor.",
          solution: {
            idea: "Find the amount per single person (divide total by servings), then multiply by the new number of servings.",
            steps: [
              `Per person: ${origAmount} ÷ ${servesOrig} = ${perServing} ${ingredient}.`,
              `For ${servesNew} people: ${perServing} × ${servesNew} = ${scaledAmount}.`
            ]
          }
        };
      },
      // (c) find the total given one part of a ratio
      () => {
        const r1 = rand(2, 5), r2 = rand(2, 5);
        if (gcd(r1, r2) !== 1 || r1 === r2) return null;
        const k = rand(2, 8);
        const a = r1 * k, b = r2 * k, total = a + b;
        const [itemA, itemB] = pick([["boys", "girls"], ["red counters", "blue counters"], ["cats", "dogs"], ["apples", "oranges"]]);
        const decoys = [a, b, total + r1 + r2, Math.round((total * r1) / r2)].filter((x) => x !== total && x > 0);
        const { options, correctIndex } = buildMC(total, decoys);
        return { q: `${itemA[0].toUpperCase() + itemA.slice(1)} and ${itemB} are in the ratio ${r1}:${r2}. There are ${a} ${itemA}. How many ${itemA} and ${itemB} are there in total?`, options, correctIndex,
          hint: "When you know one part of a ratio and the ratio itself, you can find all other parts and the total. Find the value of one ratio unit by dividing the known quantity by its ratio number, then use that unit value to find the other quantity, and finally add both to get the total.",
          solution: {
            idea: "Find the value of one ratio unit, use it to find the other quantity, then add both for the total.",
            steps: [
              `${a} ${itemA} ÷ ${r1} = ${k} (one "unit" of the ratio).`,
              `${itemB} = ${k} × ${r2} = ${b}.`,
              `Total = ${a} + ${b} = ${total}.`
            ]
          }
        };
      },
      // (d) unitary method (cost scaling)
      () => {
        const unitCost = rand(2, 20);
        const qty1 = rand(2, 8), qty2 = rand(2, 12);
        if (qty1 === qty2) return null;
        const cost1 = unitCost * qty1;
        const answer = unitCost * qty2;
        const item = pick(["pencils", "stickers", "apples", "balloons"]);
        const decoys = [cost1, answer + unitCost, answer - unitCost, Math.round((cost1 * qty2) / (qty1 + 1))].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys, gbp);
        return { q: `${qty1} ${item} cost £${cost1}. How much would ${qty2} ${item} cost (at the same price each)?`, options, correctIndex,
          hint: "The unitary method finds the cost of one item first, then multiplies by the required quantity. Divide the total cost by the number of items to find the unit price, then multiply by the new quantity. This assumes the price per item stays the same.",
          solution: {
            idea: "Unitary method: find the cost of 1, then multiply by the quantity required.",
            steps: [
              `One ${item.replace(/s$/, "")} costs £${cost1} ÷ ${qty1} = £${unitCost}.`,
              `${qty2} ${item} cost £${unitCost} × ${qty2} = £${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) find one part given the total
      () => {
        const r1 = rand(2, 7), r2 = rand(2, 7);
        if (gcd(r1, r2) !== 1 || r1 === r2) return null;
        const k = rand(2, 10);
        const total = (r1 + r2) * k;
        const a = r1 * k, b = r2 * k;
        const askSmaller = pick([true, false]);
        const answer = askSmaller ? Math.min(a, b) : Math.max(a, b);
        const decoys = [askSmaller ? Math.max(a, b) : Math.min(a, b), total, k, answer + k].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        const nm = N1();
        return { q: `${nm} shares ${total} sweets in the ratio ${r1}:${r2}. What is the ${askSmaller ? "smaller" : "larger"} share?`, options, correctIndex,
          hint: "When sharing in a ratio and given the total, first find the value of one ratio unit by dividing the total by the sum of the ratio parts. Then multiply by each ratio number to find the individual shares. The sum of the ratio parts tells you how many equal units the total is divided into.",
          solution: {
            idea: "Divide the total by the sum of ratio parts (the number of units), then multiply each ratio part by the unit value.",
            steps: [
              `Total parts = ${r1}+${r2} = ${r1 + r2}.`,
              `One part = ${total} ÷ ${r1 + r2} = ${k}.`,
              `The shares are ${a} and ${b}; the ${askSmaller ? "smaller" : "larger"} is ${answer}.`
            ]
          }
        };
      },
      // (b) are two ratios actually equivalent?
      () => {
        const r1 = rand(2, 6), r2 = rand(2, 6);
        if (gcd(r1, r2) !== 1) return null;
        const k = rand(2, 6);
        const sameRatio = pick([true, false]);
        const c1 = sameRatio ? r1 * k : r1 * k + pick([1, -1]);
        const c2 = r2 * k;
        if (c1 <= 0) return null;
        const actuallyEquivalent = c1 * r2 === c2 * r1;
        const ans = actuallyEquivalent ? "Yes — it is the same ratio" : "No — it is a different ratio";
        const otherAns = actuallyEquivalent ? "No — it is a different ratio" : "Yes — it is the same ratio";
        const decoys = [otherAns, "Cannot be told without more information", "Only true if both numbers are even", "Yes, because both ratios use whole numbers"];
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Is the ratio ${c1}:${c2} the same as the ratio ${r1}:${r2}?`, options, correctIndex,
          hint: "Two ratios are equivalent if one can be obtained from the other by multiplying (or dividing) both parts by the same number. A quick test is cross-multiplication: ratios a:b and c:d are equivalent if a×d = b×c. Alternatively, simplify both ratios to their lowest terms and see if they match.",
          solution: {
            idea: "Check equivalence by cross-multiplying: a:b equals c:d if a×d = b×c.",
            steps: [
              `Cross-multiply to check: ${c1}×${r2} = ${c1 * r2}, and ${c2}×${r1} = ${c2 * r1}.`,
              `They are ${actuallyEquivalent ? "equal, so the ratios ARE the same." : "not equal, so the ratios are NOT the same."}`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.ratioBasics(d);
  },
  twoUnknowns(d) {
    const tier1 = [
      // (a) sum and difference (bar model)
      () => {
        const a = rand(5, 40), b = rand(5, 40);
        if (a === b) return null;
        const bigger = Math.max(a, b), smaller = Math.min(a, b);
        const sum = a + b, diff = bigger - smaller;
        const askBigger = pick([true, false]);
        const answer = askBigger ? bigger : smaller;
        const decoys = [askBigger ? smaller : bigger, sum, diff, Math.round(sum / 2)].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Two numbers add up to ${sum}. Their difference is ${diff}. What is the ${askBigger ? "larger" : "smaller"} number?`, options, correctIndex,
          hint: "When you know the sum and difference of two numbers, there is a neat shortcut. Adding the sum and the difference gives you twice the larger number; subtracting the difference from the sum gives you twice the smaller number. Halve each result to find the individual values.",
          solution: {
            idea: "Sum + difference = 2 × bigger; sum − difference = 2 × smaller. Halve each to find the values.",
            steps: [
              `Bigger + smaller = ${sum}. Bigger − smaller = ${diff}.`,
              `Adding these: 2 × bigger = ${sum + diff}, so bigger = ${(sum + diff) / 2}.`,
              `Smaller = ${sum} − ${bigger} = ${smaller}.`,
              `The ${askBigger ? "larger" : "smaller"} number is ${answer}.`
            ]
          }
        };
      },
      // (b) sum and a "times as many" relationship
      () => {
        const k = rand(2, 5);
        const smaller = rand(2, 20);
        const bigger = smaller * k;
        const sum = smaller + bigger;
        const askBigger = pick([true, false]);
        const answer = askBigger ? bigger : smaller;
        const decoys = [askBigger ? smaller : bigger, sum, Math.round(sum / 2), sum - answer + 1].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Two numbers add up to ${sum}. One number is ${k} times the other. What is the ${askBigger ? "larger" : "smaller"} number?`, options, correctIndex,
          hint: "When one number is a multiple of the other, think in terms of parts. If the smaller number is 1 part, the larger is k parts, so together they make (k+1) parts. Divide the total by (k+1) to find one part, then multiply to find each number.",
          solution: {
            idea: "If the smaller number is 1 unit and the larger is k units, together they are (k+1) units. Divide the total by (k+1) to find one unit.",
            steps: [
              `If the smaller number is 1 "part", the bigger is ${k} parts, so together they're ${k + 1} parts.`,
              `${sum} ÷ ${k + 1} = ${smaller} (the smaller number).`,
              `Bigger = ${k} × ${smaller} = ${bigger}.`
            ]
          }
        };
      },
      // (c) several solutions: a coin-combination problem
      () => {
        const coinA = pick([1, 2, 5]);
        const coinB = pick([2, 5, 10].filter((c) => c !== coinA));
        const total = rand(10, 40);
        const validCombos = [];
        for (let na = 0; na * coinA <= total; na++) { const rem = total - na * coinA; if (rem % coinB === 0) validCombos.push([na, rem / coinB]); }
        if (validCombos.length < 2) return null;
        const correctCombo = pick(validCombos);
        const correctStr = `${correctCombo[0]} × ${coinA}p coins and ${correctCombo[1]} × ${coinB}p coins`;
        const decoyCombos = [];
        let guard = 0;
        while (decoyCombos.length < 4 && guard < 200) {
          guard++;
          const na = rand(0, Math.floor(total / coinA) + 2), nb = rand(0, Math.floor(total / coinB) + 2);
          if (na * coinA + nb * coinB === total) continue;
          const str = `${na} × ${coinA}p coins and ${nb} × ${coinB}p coins`;
          if (str !== correctStr && !decoyCombos.includes(str)) decoyCombos.push(str);
        }
        if (decoyCombos.length < 4) return null;
        const { options, correctIndex } = buildMCStr(correctStr, decoyCombos);
        return { q: `A total of ${total}p is made using only ${coinA}p and ${coinB}p coins. Which of these could be the coins used?`, options, correctIndex,
          hint: "This is a two-variable problem where there may be more than one valid solution. For each answer option, check whether the combination of coins actually adds up to the target total. Multiply the number of each coin type by its value, and check the sum.",
          solution: {
            idea: "Check each option by computing the total value: (count A) × (value A) + (count B) × (value B). The correct option sums to the target.",
            steps: [
              `Check: ${correctCombo[0]} × ${coinA}p + ${correctCombo[1]} × ${coinB}p = ${correctCombo[0] * coinA + correctCombo[1] * coinB}p = ${total}p. ✓`,
              validCombos.length > 1 ? `There could be more than one way to make ${total}p with these coins — this is just one valid combination.` : ""
            ].filter(Boolean)
          }
        };
      },
    ];
    const tier2 = [
      // (a) infinite solutions: spot the pair that does NOT fit
      () => {
        const product = pick([12, 18, 20, 24, 30, 36, 40]);
        function factorPairs(n) { const p = []; for (let i = 1; i <= n; i++) if (n % i === 0) p.push([i, n / i]); return p; }
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
          hint: "This question has many valid pairs — any factor pair of the target number will work. Your job is to identify the one option that does NOT multiply to give the target. For each pair, multiply the two numbers and check whether the product equals the target.",
          solution: {
            idea: "Check each pair by multiplying. The pair whose product is not equal to the target is the answer.",
            steps: [
              `Check each pair: does it multiply to ${product}?`,
              `${invalidPair[0]} × ${invalidPair[1]} = ${invalidPair[0] * invalidPair[1]}, which is NOT ${product}.`,
              `All the other pairs shown DO multiply to ${product} — there is more than one valid pair, which is why this kind of problem can have several solutions.`
            ]
          }
        };
      },
      // (b) combined "double plus a fixed extra" structure
      () => {
        const b = rand(3, 20);
        const extra = rand(1, 10);
        const a = 2 * b + extra;
        const sum = a + b;
        const askA = pick([true, false]);
        const answer = askA ? a : b;
        const decoys = [askA ? b : a, sum, extra, b + extra].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Two numbers add up to ${sum}. The first number is ${extra} more than double the second number. What is the ${askA ? "first" : "second"} number?`, options, correctIndex,
          hint: "Use algebra. Call the second number n. The first number is 2n + extra. Write an equation for their sum and solve for n. This is a structured two-variable problem where one variable can be expressed in terms of the other.",
          solution: {
            idea: "Express one unknown in terms of the other using the given relationship, substitute into the sum equation, and solve.",
            steps: [
              `If the second number is n, the first is 2n + ${extra}.`,
              `Together: n + (2n + ${extra}) = ${sum}, so 3n + ${extra} = ${sum}.`,
              `3n = ${sum - extra}, so n = ${b} (the second number).`,
              `First number = 2 × ${b} + ${extra} = ${a}.`
            ]
          }
        };
      },
      // (c) count how many solutions satisfy an extra constraint
      () => {
        const sum = rand(10, 30);
        const wantBothEven = pick([true, false]);
        let count = 0;
        for (let a = 1; a < sum; a++) { const b = sum - a; if (a >= b) continue; if (wantBothEven ? (a % 2 === 0 && b % 2 === 0) : (a % 2 !== 0 && b % 2 !== 0)) count++; }
        if (count === 0) return null;
        const decoys = [count + 1, count - 1, Math.floor(sum / 2)].filter((x) => x !== count && x >= 0);
        const { options, correctIndex } = buildMC(count, decoys);
        return { q: `Two different whole numbers (both at least 1) add up to ${sum}. How many such pairs have BOTH numbers ${wantBothEven ? "even" : "odd"}?`, options, correctIndex,
          hint: "Count pairs systematically. List all pairs (a, b) with a < b and a + b = the target. For each, check whether both numbers satisfy the parity condition (both even or both odd). Notice that if the sum is even, both numbers can be even or both odd; if the sum is odd, they cannot both be the same parity.",
          solution: {
            idea: "Systematically list valid pairs and filter by the parity condition.",
            steps: [
              `List pairs (a,b) with a+b=${sum} and a<b, then check which have both numbers ${wantBothEven ? "even" : "odd"}.`,
              `There are ${count} such pair${count === 1 ? "" : "s"}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.twoUnknowns(d);
  },
  additiveMultiplicative(d) {
    const tier1 = [
      // (a) express the additive relationship
      () => {
        const a = rand(5, 50);
        const diff = rand(2, 40);
        const b = a + diff;
        const decoys = [a, b, diff + 1, Math.abs(a - diff)].filter((x) => x !== diff && x >= 0);
        const { options, correctIndex } = buildMC(diff, decoys);
        return { q: `${a} and ${b}: how many more is ${b} than ${a}?`, options, correctIndex,
          hint: "An additive comparison asks how much more (or less) one quantity is than another. The answer is the difference between the two numbers — you subtract the smaller from the larger. This describes the gap between them on a number line.",
          solution: {
            idea: "Additive comparison: the difference tells you how much more one quantity is than another.",
            steps: [`${b} − ${a} = ${diff}.`]
          }
        };
      },
      // (b) express the multiplicative relationship
      () => {
        const a = rand(2, 15);
        const k = rand(2, 6);
        const b = a * k;
        const decoys = [k + 1, k - 1, a, Math.round(b / (k + 1))].filter((x) => x !== k && x > 0);
        const { options, correctIndex } = buildMC(k, decoys);
        return { q: `${a} and ${b}: how many times as many is ${b} compared to ${a}?`, options, correctIndex,
          hint: "A multiplicative comparison asks how many times as large one quantity is compared to another. Divide the larger quantity by the smaller to find the multiplying factor. This is different from asking 'how many more' — it describes a ratio rather than a gap.",
          solution: {
            idea: "Multiplicative comparison: divide the larger by the smaller to find the scale factor.",
            steps: [`${b} ÷ ${a} = ${k}. So ${b} is ${k} times as many as ${a}.`]
          }
        };
      },
      // (c) given one number and an additive clue, find the other
      () => {
        const a = rand(5, 60);
        const diff = rand(2, 30);
        const wantMore = pick([true, false]);
        const b = wantMore ? a + diff : a - diff;
        if (b <= 0) return null;
        const decoys = [a, wantMore ? a - diff : a + diff, diff, b + diff].filter((x) => x !== b && x > 0);
        const { options, correctIndex } = buildMC(b, decoys);
        return { q: `A number is ${diff} ${wantMore ? "more" : "less"} than ${a}. What is the number?`, options, correctIndex,
          hint: "If a number is described as being a certain amount more or less than a given number, you simply add or subtract that amount from the given number. 'More' means add; 'less' means subtract.",
          solution: {
            idea: "'More than' means add; 'less than' means subtract.",
            steps: [`${a} ${wantMore ? "+" : "−"} ${diff} = ${b}.`]
          }
        };
      },
    ];
    const tier2 = [
      // (a) given one number and a multiplicative clue, find the other
      () => {
        const a = rand(2, 15);
        const k = rand(2, 6);
        const wantBigger = pick([true, false]);
        let base, target;
        if (wantBigger) { base = a; target = a * k; } else { base = a * k; target = a; }
        const decoys = [base, target + k, target - k, target * 2].filter((x) => x !== target && x > 0);
        const { options, correctIndex } = buildMC(target, decoys);
        return { q: wantBigger ? `A number is ${k} times as big as ${a}. What is the number?` : `${base} is ${k} times as big as a number. What is the number?`, options, correctIndex,
          hint: "Multiplicative clues work via multiplication or division. 'k times as big as n' means multiply n by k. 'n is k times as big as some unknown' means the unknown is n divided by k. Identify which direction the scaling goes before computing.",
          solution: {
            idea: "If A is k times B, then A = k × B (multiply); or B = A ÷ k (divide to find the smaller).",
            steps: [
              wantBigger ? `${a} × ${k} = ${target}.` : `${base} ÷ ${k} = ${target}.`
            ]
          }
        };
      },
      // (b) judge which comparison is more useful for very different-sized numbers
      () => {
        const a = rand(2, 10);
        const k = rand(20, 100);
        const b = a * k;
        const diff = b - a;
        const correctAns = `"${b} is ${k} times as many as ${a}" — the multiplicative comparison`;
        const wrongAns = `"${b} is ${diff} more than ${a}" — the additive comparison`;
        const decoys = [wrongAns, "Both describe the relationship equally well in every situation", "Neither description is mathematically valid", "You would need a calculator to compare these numbers at all"];
        const { options, correctIndex } = buildMCStr(correctAns, decoys);
        return { q: `${a} and ${b} can be compared additively ("${b} is ${diff} more than ${a}") or multiplicatively ("${b} is ${k} times as many as ${a}"). Since ${a} is so much smaller than ${b}, which comparison gives the clearer picture of the size difference?`, options, correctIndex,
          hint: "When two numbers are very different in size, the additive comparison (how many more) can be misleading or uninformative, because a huge difference in absolute terms might still represent the same proportional relationship. The multiplicative comparison (how many times as big) usually gives a clearer sense of scale when the numbers are far apart.",
          solution: {
            idea: "For very different-sized quantities, multiplicative comparison (scale factor) conveys the relationship more meaningfully than the additive difference.",
            steps: [
              `When one number is MUCH bigger than another, "${k} times as many" is much more informative than "${diff} more" — the multiplicative comparison captures the scale of the difference.`
            ]
          }
        };
      },
      // (c) combine an additive AND a multiplicative fact
      () => {
        const a = rand(5, 20);
        const k = rand(2, 5);
        const extra = rand(1, 10);
        const b = a * k + extra;
        const decoys = [a * k, b - extra * 2, b + extra, a + k].filter((x) => x !== b && x > 0);
        const { options, correctIndex } = buildMC(b, decoys);
        return { q: `A number is ${extra} more than ${k} times ${a}. What is the number?`, options, correctIndex,
          hint: "This is a combined relationship — both a multiplicative step and an additive adjustment. Work out the multiplicative part first (k times the given number), then apply the additive adjustment (add or subtract the extra amount).",
          solution: {
            idea: "Apply the multiplicative part first, then the additive adjustment.",
            steps: [
              `${k} times ${a} = ${a * k}.`,
              `${a * k} + ${extra} = ${b}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.additiveMultiplicative(d);
  },
  unitConversion(d) {
    const CONVS = [
      { big: "km", small: "m", factor: 1000 }, { big: "m", small: "cm", factor: 100 },
      { big: "cm", small: "mm", factor: 10 }, { big: "kg", small: "g", factor: 1000 },
      { big: "l", small: "ml", factor: 1000 },
    ];
    const tier1 = [
      // (a) convert between adjacent metric units, either direction
      () => {
        const conv = pick(CONVS);
        const toSmall = pick([true, false]);
        const bigVal = rand(2, 9);
        const smallVal = bigVal * conv.factor;
        const answer = toSmall ? smallVal : bigVal;
        const question = toSmall ? `${bigVal} ${conv.big}` : `${smallVal} ${conv.small}`;
        const askUnit = toSmall ? conv.small : conv.big;
        const decoys = (toSmall ? [bigVal, smallVal / 10, smallVal + conv.factor, smallVal - conv.factor] : [smallVal, bigVal + 1, bigVal - 1, bigVal * 10]).filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Convert ${question} to ${askUnit}.`, options, correctIndex,
          hint: "Metric unit conversions use powers of ten. To convert from a larger unit to a smaller one, multiply by the conversion factor. To convert from smaller to larger, divide. The key conversion facts to know are: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g, 1 litre = 1000 ml.",
          solution: {
            idea: "Larger to smaller: multiply by the conversion factor. Smaller to larger: divide by it.",
            steps: [
              `1 ${conv.big} = ${conv.factor} ${conv.small}.`,
              toSmall ? `${bigVal} ${conv.big} = ${bigVal} × ${conv.factor} = ${answer} ${askUnit}.` : `${smallVal} ${conv.small} = ${smallVal} ÷ ${conv.factor} = ${answer} ${askUnit}.`
            ]
          }
        };
      },
      // (b) a decimal amount of a larger unit, converted to the smaller unit
      () => {
        const conv = pick(CONVS.filter((c) => c.factor >= 100));
        const wholePart = rand(1, 9);
        const fracPart = pick([0.25, 0.5, 0.75, 0.1, 0.2, 0.4, 0.6, 0.8]);
        const bigVal = wholePart + fracPart;
        const answer = Math.round(bigVal * conv.factor);
        const decoys = [Math.round(wholePart * conv.factor), answer + conv.factor / 10, answer - conv.factor / 10, Math.round(fracPart * conv.factor)].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Convert ${bigVal} ${conv.big} to ${conv.small}.`, options, correctIndex,
          hint: "When converting a decimal number of a larger unit to the smaller unit, multiply by the conversion factor. The decimal part represents a fraction of the larger unit, and multiplying converts everything to the smaller unit simultaneously.",
          solution: {
            idea: "Multiply the decimal amount by the conversion factor — both the whole and fractional parts are converted at once.",
            steps: [
              `1 ${conv.big} = ${conv.factor} ${conv.small}.`,
              `${bigVal} × ${conv.factor} = ${answer} ${conv.small}.`
            ]
          }
        };
      },
      // (c) money conversion, both directions
      () => {
        const toPence = pick([true, false]);
        if (toPence) {
          const pounds = rand(1, 20), extraPence = pick([0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90]);
          const totalPence = pounds * 100 + extraPence;
          const decoys = [pounds, totalPence + 10, totalPence - 10, pounds * 10].filter((x) => x !== totalPence && x > 0);
          const { options, correctIndex } = buildMC(totalPence, decoys, (x) => `${x}p`);
          return { q: `Convert £${pounds}.${String(extraPence).padStart(2, "0")} to pence.`, options, correctIndex,
            hint: "There are 100 pence in one pound. To convert pounds to pence, multiply by 100 (or move the decimal point two places to the right). The digits after the decimal point in pounds become the pence when you write the total in pence.",
            solution: {
              idea: "1 pound = 100 pence. Multiply by 100 (or equivalently, remove the decimal point and treat the digits as pence).",
              steps: [`£${pounds}.${String(extraPence).padStart(2, "0")} = ${totalPence}p.`]
            }
          };
        }
        const totalPence = rand(150, 2000);
        const pounds = Math.floor(totalPence / 100);
        const answer = totalPence / 100;
        const decoys = [totalPence, answer + 1, answer - 1, pounds].filter((x) => x !== answer && x >= 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => `£${x.toFixed(2)}`);
        return { q: `Convert ${totalPence}p to pounds.`, options, correctIndex,
          hint: "To convert pence to pounds, divide by 100. The result may have a decimal part — the whole number of pounds is to the left of the decimal point, and the remaining pence (as a fraction of a pound) to the right. Always write it to 2 decimal places for money.",
          solution: {
            idea: "Divide by 100 to convert pence to pounds. Write the result to 2 decimal places.",
            steps: [`${totalPence}p ÷ 100 = £${answer.toFixed(2)}.`]
          }
        };
      },
    ];
    const tier2 = [
      // (a) smaller to larger unit, expressed as a decimal
      () => {
        const conv = pick(CONVS.filter((c) => c.factor >= 100));
        const smallVal = pick([250, 500, 750, 100, 200, 400, 600, 800, 50, 150]);
        if (smallVal >= conv.factor) return null;
        const answer = smallVal / conv.factor;
        const decoys = [smallVal, Math.round(answer * 1000) / 100, Math.round(answer * 10) / 100, Math.round((1 - answer) * 100) / 100].filter((x) => Math.abs(x - answer) > 0.001 && x >= 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => String(x));
        return { q: `Convert ${smallVal} ${conv.small} to ${conv.big}.`, options, correctIndex,
          hint: "Converting from a smaller unit to a larger one gives a decimal result. Divide by the conversion factor. For example, 250 g ÷ 1000 = 0.25 kg. The result is a fraction of the larger unit expressed as a decimal.",
          solution: {
            idea: "Divide the smaller-unit value by the conversion factor to get the larger-unit value as a decimal.",
            steps: [`${smallVal} ÷ ${conv.factor} = ${answer} ${conv.big}.`]
          }
        };
      },
      // (b) compare two measurements given in different units
      () => {
        const conv = pick(CONVS.filter((c) => c.factor >= 100));
        const bigVal = rand(2, 8) + pick([0, 0.25, 0.5, 0.75]);
        const bigInSmall = Math.round(bigVal * conv.factor);
        let delta = rand(-200, 200);
        if (delta === 0) delta = 50;
        const smallVal = bigInSmall + delta;
        if (smallVal <= 0) return null;
        const wantBigger = pick([true, false]);
        const aStr = `${bigVal} ${conv.big}`, bStr = `${smallVal} ${conv.small}`;
        const aIsBigger = bigInSmall > smallVal;
        const ans = wantBigger === aIsBigger ? aStr : bStr;
        const other = wantBigger === aIsBigger ? bStr : aStr;
        const decoys = [other, "They are exactly equal", "Cannot be compared without more information", `${conv.big.charAt(0).toUpperCase() + conv.big.slice(1)} is always bigger than ${conv.small}`];
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Which is ${wantBigger ? "bigger" : "smaller"}: ${aStr} or ${bStr}?`, options, correctIndex,
          hint: "To compare measurements in different units, first convert both to the same unit. Then compare the numbers directly. Always convert before comparing — you cannot compare 2.5 km and 2600 m directly without converting one of them.",
          solution: {
            idea: "Convert both measurements to the same unit, then compare the values.",
            steps: [
              `${bigVal} ${conv.big} = ${bigInSmall} ${conv.small}.`,
              `Compare ${bigInSmall} ${conv.small} with ${smallVal} ${conv.small}.`,
              `The ${wantBigger ? "bigger" : "smaller"} one is ${ans}.`
            ]
          }
        };
      },
      // (c) sum of mixed-unit measurements
      () => {
        const conv = pick([{ unit: "cm", bigUnit: "m", factor: 100 }, { unit: "g", bigUnit: "kg", factor: 1000 }, { unit: "ml", bigUnit: "l", factor: 1000 }]);
        const granularity = conv.factor === 1000 ? 10 : 1;
        const a_big = rand(1, 3), a_small = Math.round(rand(10, conv.factor - 10) / granularity) * granularity;
        const b_small = Math.round(rand(10, conv.factor - 10) / granularity) * granularity;
        const totalSmall = a_big * conv.factor + a_small + b_small;
        const askBig = pick([true, false]);
        const answer = askBig ? totalSmall / conv.factor : totalSmall;
        const decoys = askBig
          ? [answer + 1, answer - 1, a_big, Math.round(answer * 10) / 10 + 0.5].filter((x) => x !== answer && x >= 0)
          : [totalSmall + conv.factor, totalSmall - conv.factor, a_big * conv.factor + a_small, a_small + b_small].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => `${x} ${askBig ? conv.bigUnit : conv.unit}`);
        return { q: `${a_big} ${conv.bigUnit} ${a_small} ${conv.unit} + ${b_small} ${conv.unit}. What is the total, in ${askBig ? conv.bigUnit : conv.unit}?`, options, correctIndex,
          hint: "When adding mixed-unit measurements, first convert everything to the same (smaller) unit. Add all the values in that unit, then convert the total back to the required unit if necessary. This avoids errors from mixing units mid-calculation.",
          solution: {
            idea: "Convert all measurements to the smallest unit, add, then convert the total back if required.",
            steps: [
              `Convert everything to ${conv.unit}: ${a_big} ${conv.bigUnit} = ${a_big * conv.factor} ${conv.unit}.`,
              `Total = ${a_big * conv.factor} + ${a_small} + ${b_small} = ${totalSmall} ${conv.unit}.`,
              askBig ? `${totalSmall} ÷ ${conv.factor} = ${answer} ${conv.bigUnit}.` : ``
            ].filter(Boolean)
          }
        };
      },
      // (d) recall a conversion fact directly
      () => {
        const facts = [
          { q: "How many grams are in 1 kilogram?", a: 1000 }, { q: "How many millilitres are in 1 litre?", a: 1000 },
          { q: "How many metres are in 1 kilometre?", a: 1000 }, { q: "How many centimetres are in 1 metre?", a: 100 },
          { q: "How many millimetres are in 1 centimetre?", a: 10 }, { q: "How many pence are in 1 pound?", a: 100 },
        ];
        const f = pick(facts);
        const decoys = [f.a / 10, f.a * 10, f.a + 10, f.a - 10].filter((x) => x !== f.a && x > 0);
        const { options, correctIndex } = buildMC(f.a, decoys);
        return { q: f.q, options, correctIndex,
          hint: "These are standard metric conversion facts that are worth knowing by heart. The key ones: 1 kg = 1000 g, 1 litre = 1000 ml, 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, £1 = 100p. The prefix 'kilo' always means 1000, 'centi' means 1/100, 'milli' means 1/1000.",
          solution: {
            idea: "Standard metric conversion facts: kilo = ×1000, centi = ×1/100, milli = ×1/1000.",
            steps: [`This is a standard conversion fact: ${f.a}.`]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.unitConversion(d);
  },
  areaPerimeter(d) {
    const tier1 = [
      // (a) area by counting whole + half squares
      () => {
        const whole = rand(8, 20), half = pick([0, 2, 4, 6]);
        const area = whole + half / 2;
        const decoys = [whole, whole + half, area + 1, area - 1].filter((x) => x !== area && x > 0);
        const { options, correctIndex } = buildMC(area, decoys, (x) => `${x} cm²`);
        return { q: `A shape is drawn on centimetre-squared paper. It covers ${whole} whole squares and ${half} half squares. What is its area?`, options, correctIndex,
          hint: "Area on squared paper is found by counting squares. Count all the whole squares as full units; each pair of half squares also makes one whole square. Two half-squares equal one whole square, so divide the number of halves by 2 and add to the whole square count.",
          solution: {
            idea: "Count area on squared paper: whole squares count as 1 each; half squares count as 0.5 each.",
            steps: [
              `${half} half squares = ${half / 2} whole squares' worth.`,
              `Total area = ${whole} + ${half / 2} = ${area} cm².`
            ]
          }
        };
      },
      // (b) rectangle area from length × width
      () => {
        const l = rand(4, 20), w = rand(3, 15);
        const area = l * w;
        const decoys = [l + w, area + w, area - l, l * w + 1].filter((x) => x !== area && x > 0);
        const { options, correctIndex } = buildMC(area, decoys, (x) => `${x} cm²`);
        return { q: `A rectangle is ${l} cm long and ${w} cm wide. What is its area?`, options, correctIndex,
          hint: "The area of a rectangle is found by multiplying its length by its width (Area = length × width). Make sure to give the answer in square units (cm², m², etc.). Area is always measured in square units because it covers a two-dimensional surface.",
          solution: {
            idea: "Area of a rectangle = length × width. The result is in square units.",
            steps: [`Area = length × width = ${l} × ${w} = ${area} cm².`]
          }
        };
      },
      // (c) perimeter of a rectangle or a regular polygon
      () => {
        const isRect = pick([true, false]);
        if (isRect) {
          const l = rand(4, 20), w = rand(3, 15);
          const perim = 2 * (l + w);
          const decoys = [l * w, l + w, perim + 2, perim - 2].filter((x) => x !== perim && x > 0);
          const { options, correctIndex } = buildMC(perim, decoys, (x) => `${x} cm`);
          return { q: `A rectangle is ${l} cm long and ${w} cm wide. What is its perimeter?`, options, correctIndex,
            hint: "The perimeter of a shape is the total distance around its outside. For a rectangle, there are two lengths and two widths, so the perimeter is 2 × (length + width). Alternatively, add all four sides: length + width + length + width.",
            solution: {
              idea: "Perimeter of a rectangle = 2 × (length + width), because rectangles have two equal lengths and two equal widths.",
              steps: [`Perimeter = 2 × (length + width) = 2 × (${l} + ${w}) = ${perim} cm.`]
            }
          };
        }
        const sides = pick([3, 5, 6, 8]);
        const sideLen = rand(3, 12);
        const perim = sides * sideLen;
        const decoys = [sideLen, perim + sideLen, perim - sideLen, sides + sideLen].filter((x) => x !== perim && x > 0);
        const { options, correctIndex } = buildMC(perim, decoys, (x) => `${x} cm`);
        return { q: `A regular ${sides}-sided polygon has sides of length ${sideLen} cm. What is its perimeter?`, options, correctIndex,
          hint: "A regular polygon has all sides equal in length. The perimeter is just the number of sides multiplied by the length of one side. This is much simpler than an irregular polygon, where you would need to add all sides individually.",
          solution: {
            idea: "For a regular polygon, perimeter = number of sides × side length.",
            steps: [`Perimeter = ${sides} × ${sideLen} = ${perim} cm.`]
          }
        };
      },
    ];
    const tier2 = [
      // (a) reverse: given area and one side, find the other side
      () => {
        const w = rand(3, 12);
        const l = rand(w + 1, w + 15);
        const area = l * w;
        const decoys = [w, area, l + 1, l - 1].filter((x) => x !== l && x > 0);
        const { options, correctIndex } = buildMC(l, decoys, (x) => `${x} cm`);
        return { q: `A rectangle has area ${area} cm² and width ${w} cm. What is its length?`, options, correctIndex,
          hint: "This is the reverse of the area formula. If Area = length × width, then length = Area ÷ width. You are given the area and one dimension, and need to find the missing dimension by dividing.",
          solution: {
            idea: "Rearranging Area = l × w gives l = Area ÷ w.",
            steps: [`Length = area ÷ width = ${area} ÷ ${w} = ${l} cm.`]
          }
        };
      },
      // (b) square: given perimeter, find area
      () => {
        const side = rand(3, 15);
        const perim = 4 * side;
        const area = side * side;
        const decoys = [perim, area + side, area - side, side * side + side].filter((x) => x !== area && x > 0);
        const { options, correctIndex } = buildMC(area, decoys, (x) => `${x} cm²`);
        return { q: `A square has perimeter ${perim} cm. What is its area?`, options, correctIndex,
          hint: "A square has four equal sides, so its perimeter is 4 × side length. Working backwards: side length = perimeter ÷ 4. Once you know the side length, the area is side × side (or side squared).",
          solution: {
            idea: "For a square: side = perimeter ÷ 4, then area = side².",
            steps: [
              `Side length = ${perim} ÷ 4 = ${side} cm.`,
              `Area = ${side} × ${side} = ${area} cm².`
            ]
          }
        };
      },
      // (c) compound (L-shaped) figure: cutting a corner notch never changes the perimeter
      () => {
        const W = rand(8, 16), H = rand(8, 16);
        const cutW = rand(2, W - 4), cutH = rand(2, H - 4);
        const perim = 2 * (W + H);
        const decoys = [2 * (W + H) - 2 * (cutW + cutH), 2 * (W - cutW) + 2 * (H - cutH), perim + cutW, perim - cutH].filter((x) => x !== perim && x > 0);
        const { options, correctIndex } = buildMC(perim, decoys, (x) => `${x} cm`);
        return { q: `A rectangle ${W} cm by ${H} cm has a smaller rectangle ${cutW} cm by ${cutH} cm cut from one corner, making an L-shape. What is the perimeter of the L-shape?`, options, correctIndex,
          hint: "This is a classic spatial reasoning question. When you cut a rectangular notch from one corner of a rectangle, the two edges you remove are exactly replaced by two new edges of the same total length going inwards. The perimeter of the L-shape equals the perimeter of the original rectangle.",
          solution: {
            idea: "Cutting a rectangular notch from a corner replaces the two outer edges with two inner edges of the same total length — so the perimeter is unchanged.",
            steps: [
              `Cutting a rectangular notch from a CORNER never changes the total perimeter — the missing edges are exactly replaced by new inner edges.`,
              `Perimeter = perimeter of the original rectangle = 2 × (${W} + ${H}) = ${perim} cm.`
            ]
          }
        };
      },
      // (d) compare two rectangles' area OR perimeter
      () => {
        const l1 = rand(3, 10), w1 = rand(3, 10), l2 = rand(3, 10), w2 = rand(3, 10);
        const compareArea = pick([true, false]);
        const v1 = compareArea ? l1 * w1 : 2 * (l1 + w1);
        const v2 = compareArea ? l2 * w2 : 2 * (l2 + w2);
        if (v1 === v2) return null;
        const wantBigger = pick([true, false]);
        const label = compareArea ? "AREA" : "PERIMETER";
        const ans = wantBigger === (v1 > v2) ? `Rectangle A (${l1}×${w1})` : `Rectangle B (${l2}×${w2})`;
        const other = wantBigger === (v1 > v2) ? `Rectangle B (${l2}×${w2})` : `Rectangle A (${l1}×${w1})`;
        const decoys = [other, `They have the same ${label.toLowerCase()}`, "Cannot be determined", "It depends on which is measured first"];
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Rectangle A is ${l1} cm by ${w1} cm. Rectangle B is ${l2} cm by ${w2} cm. Which has the ${wantBigger ? "bigger" : "smaller"} ${label}?`, options, correctIndex,
          hint: "Calculate the area (length × width) or perimeter (2 × (length + width)) for each rectangle separately, then compare the two values. Note that a rectangle with a bigger area does not necessarily have a bigger perimeter, and vice versa.",
          solution: {
            idea: "Calculate the relevant measure for each rectangle and compare.",
            steps: [
              `${label === "AREA" ? "Area" : "Perimeter"} A = ${v1}${compareArea ? " cm²" : " cm"}. ${label === "AREA" ? "Area" : "Perimeter"} B = ${v2}${compareArea ? " cm²" : " cm"}.`,
              `The ${wantBigger ? "bigger" : "smaller"} is ${ans}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.areaPerimeter(d);
  },
  timeCalendar(d) {
    const tier1 = [
      // (a) day of the week N days after
      () => {
        const start = rand(0, 6);
        const n = rand(1, 60);
        const ans = DAYS[(start + n) % 7];
        const { options, correctIndex } = buildMCStr(ans, shuffle(DAYS.filter((x) => x !== ans)).slice(0, 4));
        return { q: `Today is ${DAYS[start]}. What day of the week will it be in ${n} days?`, options, correctIndex,
          hint: "Days of the week repeat in a cycle of 7. To find a day that is N days in the future, divide N by 7 and use the remainder to count forward from the starting day. If the remainder is 0, you land on the same day of the week as the start.",
          solution: {
            idea: "Days repeat in a cycle of 7. Divide N by 7; the remainder tells you how many days to count forward from the start day.",
            steps: [
              `${n} ÷ 7 = ${Math.floor(n / 7)} remainder ${n % 7}.`,
              `Count on ${n % 7} days from ${DAYS[start]}: ${ans}.`
            ]
          }
        };
      },
      // (b) day of the week N days before
      () => {
        const start = rand(0, 6);
        const n = rand(1, 60);
        let idx = (start - n) % 7; if (idx < 0) idx += 7;
        const ans = DAYS[idx];
        const { options, correctIndex } = buildMCStr(ans, shuffle(DAYS.filter((x) => x !== ans)).slice(0, 4));
        return { q: `Today is ${DAYS[start]}. What day of the week was it ${n} days ago?`, options, correctIndex,
          hint: "Counting backwards through days of the week uses the same 7-day cycle. Divide N by 7 and use the remainder to count backwards from the starting day. If counting back lands you before Monday in the cycle, wrap around to Sunday and continue.",
          solution: {
            idea: "Days repeat in a cycle of 7. Divide N by 7; the remainder tells you how many days to count back from the start day.",
            steps: [
              `${n} ÷ 7 = ${Math.floor(n / 7)} remainder ${n % 7}.`,
              `Count back ${n % 7} days from ${DAYS[start]}: ${ans}.`
            ]
          }
        };
      },
      // (c) days between two dates in the same month
      () => {
        const monthLen = pick([28, 30, 31]);
        const day1 = rand(1, monthLen - 10);
        const day2 = rand(day1 + 1, monthLen);
        const gap = day2 - day1;
        const decoys = [gap + 1, gap - 1, day1 + day2, monthLen - gap].filter((x) => x !== gap && x > 0);
        const { options, correctIndex } = buildMC(gap, decoys);
        return { q: `In a month, one event happens on day ${day1} and another on day ${day2}. How many days apart are they?`, options, correctIndex,
          hint: "The number of days between two dates in the same month is simply the later date minus the earlier date. Be careful: the gap is the difference in the dates, not the number of days including both endpoints unless specified.",
          solution: {
            idea: "Days between two dates in the same month = later date − earlier date.",
            steps: [`${day2} − ${day1} = ${gap} days.`]
          }
        };
      },
      // (d) leap year identification
      () => {
        function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
        const candidates = [];
        while (candidates.length < 4) { const y = rand(1700, 2100); if (!candidates.includes(y)) candidates.push(y); }
        const leapAmong = candidates.filter(isLeap);
        if (leapAmong.length !== 1) return null;
        const answer = leapAmong[0];
        const { options, correctIndex } = buildMC(answer, candidates.filter((c) => c !== answer));
        return { q: `Which of these years is a leap year?`, options, correctIndex,
          hint: "The leap year rule has two parts. A year is a leap year if it is divisible by 4 — EXCEPT that century years (ending in 00) must be divisible by 400 to count. So 1900 was not a leap year, but 2000 was.",
          solution: {
            idea: "Leap year rule: divisible by 4, EXCEPT century years must be divisible by 400.",
            steps: [
              `A year is a leap year if divisible by 4 — EXCEPT century years (ending in 00), which must be divisible by 400.`,
              `${answer} is divisible by 4${answer % 100 === 0 ? " and by 400" : ""}, so it is a leap year. The others are not.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) clock duration arithmetic
      () => {
        const startH = rand(9, 20), startM = pick([0, 10, 15, 20, 30, 40, 45, 50]);
        const durMin = pick([30, 45, 50, 60, 75, 90, 105, 120, 135]);
        const totalMin = startH * 60 + startM + durMin;
        const endH = Math.floor(totalMin / 60) % 24, endM = totalMin % 60;
        const ans = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
        const decoyPool = [
          `${String((endH + 1) % 24).padStart(2, "0")}:${String(endM).padStart(2, "0")}`,
          `${String(endH).padStart(2, "0")}:${String((endM + 15) % 60).padStart(2, "0")}`,
          `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`,
          `${String((endH - 1 + 24) % 24).padStart(2, "0")}:${String(endM).padStart(2, "0")}`,
          `${String(endH).padStart(2, "0")}:${String((endM + 30) % 60).padStart(2, "0")}`,
        ];
        const decoys = [...new Set(decoyPool)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `A film starts at ${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")} and lasts ${durMin} minutes. What time does it finish?`, options, correctIndex,
          hint: "For duration arithmetic with clocks, convert the start time to total minutes past midnight, add the duration in minutes, then convert back to hours and minutes. Remember that 60 minutes makes one hour, and the time wraps around after midnight (24:00 becomes 00:00).",
          solution: {
            idea: "Convert start time to minutes, add duration, then convert back. Account for any carry when minutes exceed 60.",
            steps: [
              `${durMin} minutes = ${Math.floor(durMin / 60)}h ${durMin % 60}m.`,
              `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")} + ${durMin} minutes = ${ans}.`
            ]
          }
        };
      },
      // (b) 12-hour <-> 24-hour clock conversion
      () => {
        const h24 = rand(0, 23);
        const m = pick([0, 15, 30, 45]);
        const isPM = h24 >= 12;
        const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
        const to24 = pick([true, false]);
        if (to24) {
          const ans = `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
          const decoyPool = [`${String((h24 + 12) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`, `${String(h24).padStart(2, "0")}:${String((m + 15) % 60).padStart(2, "0")}`, `${String((h24 + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`, `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")}`];
          const decoys = [...new Set(decoyPool)].filter((s) => s !== ans).slice(0, 4);
          if (decoys.length < 4) return null;
          const { options, correctIndex } = buildMCStr(ans, decoys);
          return { q: `Write ${h12}:${String(m).padStart(2, "0")} ${isPM ? "pm" : "am"} using the 24-hour clock.`, options, correctIndex,
            hint: "To convert from 12-hour to 24-hour clock: for am times (except 12 am, which is 00:xx), keep the hour the same. For pm times (except 12 pm, which stays as 12:xx), add 12 to the hour number. Midnight is 00:00 and noon is 12:00 in 24-hour time.",
            solution: {
              idea: "12-hour to 24-hour: add 12 to pm hours (except 12 pm), set midnight to 00:xx.",
              steps: [`${h12}:${String(m).padStart(2, "0")} ${isPM ? "pm" : "am"} = ${ans} in 24-hour time.`]
            }
          };
        }
        const ans = `${h12}:${String(m).padStart(2, "0")} ${isPM ? "pm" : "am"}`;
        const decoyPool = [`${h12}:${String(m).padStart(2, "0")} ${isPM ? "am" : "pm"}`, `${h12 === 12 ? 1 : h12 + 1}:${String(m).padStart(2, "0")} ${isPM ? "pm" : "am"}`, `${h24}:${String(m).padStart(2, "0")} ${isPM ? "pm" : "am"}`, `${h12}:${String((m + 15) % 60).padStart(2, "0")} ${isPM ? "pm" : "am"}`];
        const decoys = [...new Set(decoyPool)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Write ${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")} using the 12-hour clock (include am or pm).`, options, correctIndex,
          hint: "To convert from 24-hour to 12-hour clock: hours 00-11 become am (with 00 becoming 12 am); hours 12-23 become pm (subtract 12 for hours 13-23, but 12 stays as 12 pm). Always include am or pm in your 12-hour answer.",
          solution: {
            idea: "24-hour to 12-hour: 00:xx = 12 am, 01-11 = am (same hour), 12:xx = 12 pm, 13-23 = pm (subtract 12).",
            steps: [`${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")} in 24-hour time = ${ans}.`]
          }
        };
      },
      // (c) the Nth weekday of the month
      () => {
        const firstDayIdx = rand(0, 6);
        const n = rand(1, 4);
        const targetDayIdx = rand(0, 6);
        const firstOccurrence = (((targetDayIdx - firstDayIdx) % 7) + 7) % 7 + 1;
        const date = firstOccurrence + (n - 1) * 7;
        if (date > 31) return null;
        const decoys = [date + 7, date - 7, date + 1, firstOccurrence].filter((x) => x !== date && x > 0);
        const { options, correctIndex } = buildMC(date, decoys);
        const ordinals = ["first", "second", "third", "fourth"];
        return { q: `The 1st of the month is a ${DAYS[firstDayIdx]}. What date is the ${ordinals[n - 1]} ${DAYS[targetDayIdx]} of the month?`, options, correctIndex,
          hint: "To find the Nth occurrence of a weekday in a month, first find the date of the first occurrence of that weekday. Count forward from the 1st of the month to the first time that weekday appears (it takes between 1 and 7 days). Then add 7 days for each additional occurrence you need.",
          solution: {
            idea: "Find when the target weekday first occurs after the 1st, then add 7 days for each subsequent occurrence.",
            steps: [
              `The first ${DAYS[targetDayIdx]} falls on day ${firstOccurrence}.`,
              `Each following ${DAYS[targetDayIdx]} is 7 days later: the ${ordinals[n - 1]} one is on day ${firstOccurrence} + ${(n - 1) * 7} = ${date}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.timeCalendar(d);
  },
  compensationMentalMaths(d) {
    const tier1 = [
      // (a) addition compensation
      () => {
        let a, adjust, guard = 0;
        do { a = rand(21, 89); adjust = (10 - (a % 10)) % 10; guard++; } while ((adjust === 0 || adjust > 9) && guard < 50);
        if (adjust === 0) return null;
        const b = rand(Math.max(21, adjust + 15), 89);
        const sum = a + b;
        const aAdj = a + adjust, bAdj = b - adjust;
        const decoys = [sum + adjust, sum - adjust, aAdj + bAdj + 1, a + b + 2 * adjust].filter((x) => x !== sum);
        const { options, correctIndex } = buildMC(sum, decoys);
        return { q: `${a} + ${b} can be worked out as ${aAdj} + ${bAdj} (round ${a} up to ${aAdj}, and take the same ${adjust} off ${b} to balance it). What is ${a} + ${b}?`, options, correctIndex,
          hint: "Addition compensation is a mental maths strategy. You round one addend to a more convenient number (usually a multiple of 10), then adjust the other addend in the opposite direction by the same amount to keep the total the same. Adding to one and subtracting the same from the other leaves the sum unchanged.",
          solution: {
            idea: "Increasing one addend and decreasing the other by the same amount leaves the sum unchanged. Use this to create an easier calculation.",
            steps: [
              `Increasing one addend by ${adjust} and decreasing the other by the same amount doesn't change the sum.`,
              `${aAdj} + ${bAdj} = ${sum}.`
            ]
          }
        };
      },
      // (b) subtraction compensation
      () => {
        let b, adjust, guard = 0;
        do { b = rand(21, 89); adjust = (10 - (b % 10)) % 10; guard++; } while ((adjust === 0 || adjust > 9) && guard < 50);
        if (adjust === 0) return null;
        const a = b + rand(20, 100);
        const diff = a - b;
        const aAdj = a + adjust, bAdj = b + adjust;
        const decoys = [diff + adjust, diff - adjust, aAdj - bAdj + 1, a - b - adjust].filter((x) => x !== diff);
        const { options, correctIndex } = buildMC(diff, decoys);
        return { q: `${a} − ${b} can be worked out as ${aAdj} − ${bAdj} (add ${adjust} to both numbers so ${b} becomes the round number ${bAdj}). What is ${a} − ${b}?`, options, correctIndex,
          hint: "Subtraction compensation works by adding the same amount to both numbers in a subtraction. This shifts both numbers up the number line by the same distance, so the gap between them (the difference) stays exactly the same. The goal is to make the subtracted number a round multiple of 10.",
          solution: {
            idea: "Adding the same amount to both numbers in a subtraction does not change their difference — the gap stays the same.",
            steps: [
              `Adding the same amount to BOTH numbers doesn't change their difference.`,
              `${aAdj} − ${bAdj} = ${diff}.`
            ]
          }
        };
      },
      // (c) multiplication compensation
      () => {
        const a = rand(2, 20);
        const scale = pick([2, 5, 10]);
        const bDiv = rand(2, 10);
        const b = bDiv * scale;
        const aScaled = a * scale;
        const product = a * b;
        const decoys = [product * scale, product / scale, aScaled * bDiv + 1, a * bDiv].filter((x) => x !== product && x > 0);
        const { options, correctIndex } = buildMC(product, decoys);
        return { q: `${a} × ${b} can be worked out as ${aScaled} × ${bDiv} (multiply one number by ${scale}, divide the other by ${scale}). What is ${a} × ${b}?`, options, correctIndex,
          hint: "Multiplication compensation uses the fact that if you multiply one factor by a number and divide the other by the same number, the product stays unchanged. For example, 4 × 15 = 8 × 7.5 = 12 × 5 = 60. Use this to transform one factor into a more convenient number.",
          solution: {
            idea: "Multiplying one factor by k and dividing the other by k leaves the product unchanged.",
            steps: [
              `Multiplying one factor by ${scale} and dividing the other by ${scale} doesn't change the product.`,
              `${aScaled} × ${bDiv} = ${product}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) division compensation: scale both dividend and divisor the same way
      () => {
        const scale = pick([2, 3, 4, 5]);
        const q = rand(3, 20);
        const divisor = rand(2, 15);
        const dividend = q * divisor;
        const dividendScaled = dividend * scale, divisorScaled = divisor * scale;
        const decoys = [q * scale, Math.round(q / scale), dividendScaled / divisor, q + scale].filter((x) => x !== q && x > 0);
        const { options, correctIndex } = buildMC(q, decoys);
        return { q: `${dividend} ÷ ${divisor} gives the same answer as ${dividendScaled} ÷ ${divisorScaled} (both numbers scaled by ${scale}). What is ${dividend} ÷ ${divisor}?`, options, correctIndex,
          hint: "Division compensation works differently from subtraction. If you multiply both the dividend and the divisor by the same number, the quotient stays the same — because you are scaling the numerator and denominator of a fraction by the same factor. Use this to simplify to easier numbers.",
          solution: {
            idea: "Multiplying both dividend and divisor by the same factor leaves the quotient unchanged.",
            steps: [
              `Scaling BOTH the dividend and divisor by the same amount doesn't change the answer.`,
              `${dividend} ÷ ${divisor} = ${q}.`
            ]
          }
        };
      },
      // (b) recognise a genuine compensation pair among decoys
      () => {
        const a = rand(30, 70), b = rand(30, 70);
        const adjust = pick([1, 2, 3, 4, 5]);
        const correctStr = `${a + adjust} + ${b - adjust}`;
        const decoys = [`${a + adjust} + ${b + adjust}`, `${a - adjust} + ${b - adjust}`, `${a + adjust} + ${b}`, `${a} + ${b - adjust}`];
        const { options, correctIndex } = buildMCStr(correctStr, decoys);
        return { q: `Which of these gives the SAME answer as ${a} + ${b}, using compensation?`, options, correctIndex,
          hint: "A valid compensation pair for addition must have the same total. That means one number is increased by a given amount and the other is decreased by exactly the same amount. If both numbers go up, or both go down, the total changes — only one up and one down by the same amount keeps it equal.",
          solution: {
            idea: "Valid compensation: add k to one addend and subtract k from the other. The total stays the same because the changes cancel.",
            steps: [
              `Compensation means increasing one number and decreasing the other by the SAME amount.`,
              `${correctStr} = ${a + b}, which matches ${a}+${b} = ${a + b}.`
            ]
          }
        };
      },
      // (c) decimal application: a scaled-up/scaled-down factor pair that exactly cancels
      () => {
        const aWhole = rand(2, 9);
        const bScaled = rand(11, 80);
        const a = aWhole / 10;
        const b = bScaled * 10;
        const helperProduct = aWhole * bScaled;
        const decoys = [helperProduct * 10, Math.round(helperProduct / 10), helperProduct + aWhole, helperProduct - bScaled].filter((x) => x !== helperProduct && x > 0);
        const { options, correctIndex } = buildMC(helperProduct, decoys);
        return { q: `${a} × ${b} can be worked out using ${aWhole} × ${bScaled} instead (${a} is ${aWhole}÷10, and ${b} is ${bScaled}×10 — the ÷10 and ×10 cancel out). What is ${a} × ${b}?`, options, correctIndex,
          hint: "This decimal compensation question uses the fact that multiplying one factor by 10 and dividing the other by 10 leaves the product unchanged. Here, one factor is a decimal (×1/10 compared to the helper) and the other is correspondingly larger (×10), so the two adjustments cancel perfectly.",
          solution: {
            idea: "If one factor is scaled by ×10 and the other by ÷10, the product is unchanged. Use whole-number factors to compute the answer.",
            steps: [
              `${aWhole} × ${bScaled} = ${helperProduct}.`,
              `Since ${a} = ${aWhole}÷10 and ${b} = ${bScaled}×10, the ÷10 and ×10 cancel exactly: ${a} × ${b} = ${helperProduct}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.compensationMentalMaths(d);
  },
  formalMultiplication(d) {
    const tier1 = [
      // (a) short multiplication (3-4 digit x 1 digit)
      () => {
        const digits = pick([3, 4]);
        const multiplicand = rand(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
        const multiplier = rand(2, 9);
        const product = multiplicand * multiplier;
        const decoys = [product + multiplier, product - multiplier, multiplicand + multiplier, product + 10].filter((x) => x !== product && x > 0);
        const { options, correctIndex } = buildMC(product, decoys);
        return { q: `Work out ${multiplicand} × ${multiplier}.`, options, correctIndex,
          hint: "Short multiplication multiplies a multi-digit number by a single digit. Work through each digit of the larger number from right to left, multiplying by the single digit and carrying any tens into the next column. Write down the units digit of each partial product and carry the rest.",
          solution: {
            idea: "Short multiplication: multiply each digit of the larger number by the single-digit multiplier, right to left, carrying as needed.",
            steps: [`${multiplicand} × ${multiplier} = ${product}.`]
          }
        };
      },
      // (b) identify a carried digit during the column method
      () => {
        const tensDigit = rand(1, 9), onesDigit = rand(1, 9);
        const multiplicand = tensDigit * 10 + onesDigit;
        const multiplier = rand(2, 9);
        const onesProduct = onesDigit * multiplier;
        const carry = Math.floor(onesProduct / 10);
        if (carry === 0) return null;
        const decoys = [onesProduct, onesDigit, multiplier, carry + 1].filter((x) => x !== carry && x >= 0);
        const { options, correctIndex } = buildMC(carry, decoys);
        return { q: `When working out ${multiplicand} × ${multiplier} using the column method, you first multiply ${onesDigit} × ${multiplier} = ${onesProduct}. What digit gets carried into the tens column?`, options, correctIndex,
          hint: "When a partial product in the column method exceeds 9, the tens digit must be carried to the next column. The carried digit is the tens digit of the partial product — found by dividing by 10 and taking the whole number part. The units digit of the partial product is written in the current column.",
          solution: {
            idea: "The carried digit is the tens portion of the partial product: carry = floor(partial product ÷ 10).",
            steps: [
              `${onesDigit} × ${multiplier} = ${onesProduct}.`,
              `Write down ${onesProduct % 10} and carry ${carry} into the tens column.`
            ]
          }
        };
      },
      // (c) distributive/partition method for a 2-digit multiplier
      () => {
        const tens = rand(1, 8), ones = rand(1, 9);
        const multiplicand = tens * 10 + ones;
        const multiplier = rand(11, 29);
        const multTens = Math.floor(multiplier / 10) * 10, multOnes = multiplier % 10;
        const part1 = multiplicand * multTens, part2 = multiplicand * multOnes;
        const answer = part1 + part2;
        const decoys = [multiplicand * multiplier + 10, answer - 10, multiplicand + multiplier, answer + multiplicand].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `Work out ${multiplicand} × ${multiplier} by splitting ${multiplier} into ${multTens} + ${multOnes}. What is ${multiplicand}×${multTens} + ${multiplicand}×${multOnes}?`, options, correctIndex,
          hint: "The grid method (or partitioning) splits a 2-digit multiplier into its tens and ones parts, multiplies each part separately, then adds the results. This uses the distributive law: a × (b + c) = a×b + a×c. Multiply by the tens part first, then the ones part.",
          solution: {
            idea: "The distributive law allows splitting the multiplier: a × (tens + ones) = a×tens + a×ones.",
            steps: [
              `${multiplicand} × ${multTens} = ${part1}.`,
              `${multiplicand} × ${multOnes} = ${part2}.`,
              `${part1} + ${part2} = ${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) estimate a product by rounding first
      () => {
        const a = rand(102, 489), b = rand(3, 9);
        const roundedA = Math.round(a / 100) * 100;
        const estimate = roundedA * b;
        const decoys = [a * b, roundedA + b, estimate + 100, estimate - 100].filter((x) => x !== estimate && x > 0);
        const { options, correctIndex } = buildMC(estimate, decoys);
        return { q: `Estimate ${a} × ${b} by rounding ${a} to the nearest hundred first.`, options, correctIndex,
          hint: "To estimate a product, round one or both numbers to a convenient value and multiply the rounded numbers. The question tells you which number to round and to which precision. The estimate will be close to but not exactly equal to the true answer.",
          solution: {
            idea: "Estimate by rounding the larger number first, then multiplying. The result is an approximation.",
            steps: [
              `${a} rounds to ${roundedA}.`,
              `${roundedA} × ${b} = ${estimate}.`
            ]
          }
        };
      },
      // (b) missing-digit puzzle
      () => {
        const multiplicand = rand(12, 89);
        const multiplier = rand(2, 9);
        const product = multiplicand * multiplier;
        const productStr = String(product);
        const hideIdx = rand(0, productStr.length - 1);
        const hiddenDigit = Number(productStr[hideIdx]);
        const displayed = productStr.split("").map((dg, i) => (i === hideIdx ? "?" : dg)).join("");
        const decoys = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== hiddenDigit)).slice(0, 4);
        const { options, correctIndex } = buildMC(hiddenDigit, decoys);
        return { q: `${multiplicand} × ${multiplier} = ${displayed}. What digit does the ? represent?`, options, correctIndex,
          hint: "Work out the full product using the standard multiplication method, then identify which digit is hidden. The easiest approach is simply to calculate the answer and read off the missing digit from the correct position.",
          solution: {
            idea: "Calculate the full product, then read the digit at the hidden position.",
            steps: [
              `${multiplicand} × ${multiplier} = ${product}.`,
              `The missing digit is ${hiddenDigit}.`
            ]
          }
        };
      },
      // (c) compare two products without necessarily computing both exactly
      () => {
        const a1 = rand(20, 90), b1 = rand(2, 9);
        const a2 = rand(20, 90), b2 = rand(2, 9);
        const p1 = a1 * b1, p2 = a2 * b2;
        if (p1 === p2) return null;
        const wantBigger = pick([true, false]);
        const ans = wantBigger === (p1 > p2) ? `${a1} × ${b1}` : `${a2} × ${b2}`;
        const other = wantBigger === (p1 > p2) ? `${a2} × ${b2}` : `${a1} × ${b1}`;
        const decoys = [other, "They are equal", "Cannot be compared without calculating both exactly", "The one with bigger numbers shown is always bigger"];
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Without necessarily working out the exact answers, which is ${wantBigger ? "bigger" : "smaller"}: ${a1} × ${b1} or ${a2} × ${b2}?`, options, correctIndex,
          hint: "To compare two products, you can calculate both if needed, but sometimes estimation or inspection is enough. If the numbers are close, work out both — the question says 'without necessarily', meaning you may compute if it helps.",
          solution: {
            idea: "Calculate or estimate both products and compare. Both results are needed if they are close in value.",
            steps: [
              `${a1} × ${b1} = ${p1}. ${a2} × ${b2} = ${p2}.`,
              `The ${wantBigger ? "bigger" : "smaller"} one is ${ans}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.formalMultiplication(d);
  },
  formalDivision(d) {
    const tier1 = [
      // (a) short division with remainder
      () => {
        const divisor = rand(3, 9);
        const quotient = rand(20, 120);
        const remainder = rand(1, divisor - 1);
        const dividend = divisor * quotient + remainder;
        const decoys = [quotient + 1, quotient - 1, dividend, Math.round(dividend / (divisor + 1))].filter((x) => x !== quotient && x > 0);
        const { options, correctIndex } = buildMC(quotient, decoys);
        return { q: `Use the short division method to work out ${dividend} ÷ ${divisor}. What is the whole-number quotient?`, options, correctIndex,
          hint: "Short division (the 'bus stop' method) processes each digit of the dividend from left to right. Divide the divisor into each digit in turn, writing the whole-number result above and carrying any remainder into the next digit. The final remainder is not part of the whole-number quotient.",
          solution: {
            idea: "Short division: work through each digit of the dividend from left to right, carrying remainders into the next column.",
            steps: [
              `${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}.`,
              `The whole-number quotient is ${quotient}.`
            ]
          }
        };
      },
      // (b) long division via a ratio table of multiples
      () => {
        const divisor = rand(11, 29);
        const quotient = rand(20, 90);
        const dividend = divisor * quotient;
        const multipleUsed = pick([2, 5, 10]);
        const helperMultiple = divisor * multipleUsed;
        const decoys = [quotient + 1, quotient - 1, divisor, Math.round(dividend / (divisor + 1))].filter((x) => x !== quotient && x > 0);
        const { options, correctIndex } = buildMC(quotient, decoys);
        return { q: `To work out ${dividend} ÷ ${divisor}, a ratio table gives ${divisor}×${multipleUsed} = ${helperMultiple}. Using multiples of ${divisor} like this, what is ${dividend} ÷ ${divisor}?`, options, correctIndex,
          hint: "The ratio table method for division builds up known multiples of the divisor (like ×2, ×5, ×10) and combines them to reach the dividend. Once you know which combination totals the dividend exactly, add up the multipliers — that gives the quotient.",
          solution: {
            idea: "Build up multiples of the divisor using known facts (×2, ×5, ×10), then combine to reach the dividend.",
            steps: [
              `Build up multiples of ${divisor}: ${divisor}×${multipleUsed} = ${helperMultiple}, and continue until reaching ${dividend}.`,
              `${dividend} ÷ ${divisor} = ${quotient} exactly.`
            ]
          }
        };
      },
      // (c) missing dividend or divisor
      () => {
        const divisor = rand(4, 20);
        const quotient = rand(10, 50);
        const dividend = divisor * quotient;
        const askDivisor = pick([true, false]);
        const answer = askDivisor ? divisor : dividend;
        const decoys = (askDivisor ? [divisor + 1, divisor - 1, quotient, dividend] : [dividend + divisor, dividend - divisor, divisor, quotient]).filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        if (askDivisor) {
          return { q: `${dividend} ÷ ? = ${quotient}. What number goes in the blank?`, options, correctIndex,
            hint: "To find a missing divisor, use the inverse relationship between multiplication and division. If dividend ÷ ? = quotient, then the missing divisor = dividend ÷ quotient. You can check your answer by multiplying divisor × quotient and seeing if you get the dividend.",
            solution: {
              idea: "Division and multiplication are inverses: if A ÷ ? = B, then ? = A ÷ B (equivalently, ? × B = A).",
              steps: [`${dividend} ÷ ${quotient} = ${divisor}.`]
            }
          };
        }
        return { q: `? ÷ ${divisor} = ${quotient}. What number goes in the blank?`, options, correctIndex,
          hint: "To find a missing dividend, reverse the division. If ? ÷ divisor = quotient, then the missing dividend = divisor × quotient. Multiplication is the inverse of division.",
          solution: {
            idea: "If ? ÷ divisor = quotient, then ? = divisor × quotient.",
            steps: [`${divisor} × ${quotient} = ${dividend}.`]
          }
        };
      },
    ];
    const tier2 = [
      // (a) remainder expressed as a fraction of the divisor
      () => {
        const divisor = rand(3, 9);
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
          hint: "A mixed number quotient puts the whole-number result first, then expresses the remainder as a fraction over the divisor. The fraction part is remainder/divisor, which must then be simplified to lowest terms by dividing both numerator and denominator by their highest common factor.",
          solution: {
            idea: "Divide to get a whole-number quotient and remainder, then write the remainder as a fraction over the divisor and simplify.",
            steps: [
              `${dividend} ÷ ${divisor} = ${quotient} remainder ${remainder}.`,
              `The remainder as a fraction of the divisor: ${remainder}/${divisor}${g > 1 ? ` = ${simN}/${simD}` : ""}.`,
              `Answer: ${ans}.`
            ]
          }
        };
      },
      // (b) two-step division
      () => {
        const divisor1 = rand(2, 9), divisor2 = rand(2, 9);
        const finalQuotient = rand(3, 15);
        const afterFirst = finalQuotient * divisor2;
        const dividend = afterFirst * divisor1;
        const decoys = [afterFirst, dividend, finalQuotient + 1, finalQuotient - 1].filter((x) => x !== finalQuotient && x > 0);
        const { options, correctIndex } = buildMC(finalQuotient, decoys);
        return { q: `Work out ${dividend} ÷ ${divisor1}, then divide that answer by ${divisor2}. What is the final answer?`, options, correctIndex,
          hint: "Two-step division means applying the division operation twice. Complete the first division to get an intermediate result, then divide that result by the second divisor. Note that dividing by two numbers in sequence is the same as dividing by their product in one step.",
          solution: {
            idea: "Apply the two divisions in sequence: first ÷ first divisor, then the result ÷ second divisor.",
            steps: [
              `${dividend} ÷ ${divisor1} = ${afterFirst}.`,
              `${afterFirst} ÷ ${divisor2} = ${finalQuotient}.`
            ]
          }
        };
      },
      // (c) procedural literacy: which digit gets brought down next
      () => {
        const divisor = rand(2, 9);
        const d1 = rand(1, 9), d2 = rand(0, 9), d3 = rand(0, 9);
        const dividend = Number(`${d1}${d2}${d3}`);
        const answer = d2;
        const wrongOpts = [...new Set([d1, d3, (d2 + 1) % 10, (d2 + 9) % 10])].filter((x) => x !== answer);
        if (wrongOpts.length < 3) return null;
        const { options, correctIndex } = buildMC(answer, wrongOpts);
        return { q: `You are dividing ${dividend} by ${divisor} using long division. After dealing with the first (hundreds) digit, which digit do you bring down next?`, options, correctIndex,
          hint: "Long division works from left to right through the digits of the dividend. After you have dealt with the leftmost (hundreds) digit — dividing it by the divisor and writing the first digit of the quotient above it — the next step is always to bring down the next digit to the right, which is the tens digit.",
          solution: {
            idea: "Long division processes digits from left to right. After the hundreds digit, bring down the tens digit next.",
            steps: [`After the hundreds digit (${d1}), the next digit to bring down is the tens digit: ${answer}.`]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.formalDivision(d);
  },
  logicGrid(d) {
    function permute(arr) {
      if (arr.length <= 1) return [arr];
      const res = [];
      for (let i = 0; i < arr.length; i++) { const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]; for (const p of permute(rest)) res.push([arr[i], ...p]); }
      return res;
    }
    const tier1 = [
      // (a) 3-person, 3-item matching via two negative clues
      () => {
        const people = shuffle(["Ali", "Beth", "Cara"]);
        const items = shuffle(["a red kite", "a blue kite", "a green kite"]);
        const truePerm = shuffle(items);
        const allPerms = permute(items);
        const clueItem0 = pick(items.filter((it) => it !== truePerm[0]));
        const clueItem1 = pick(items.filter((it) => it !== truePerm[1]));
        const consistent = allPerms.filter((perm) => perm[0] !== clueItem0 && perm[1] !== clueItem1);
        if (consistent.length !== 1 || consistent[0].join() !== truePerm.join()) return null;
        const askPerson = rand(0, 2);
        const answer = truePerm[askPerson];
        const decoyPool = [...items.filter((it) => it !== answer), "a yellow kite", "a purple kite"];
        const { options, correctIndex } = buildMCStr(answer, decoyPool.slice(0, 4));
        return { q: `${people[0]}, ${people[1]} and ${people[2]} each have a different kite: ${items.join(", ")}. ${people[0]} does not have ${clueItem0}. ${people[1]} does not have ${clueItem1}. Which kite does ${people[askPerson]} have?`, options, correctIndex,
          hint: "This is a logic puzzle — use the clues to eliminate possibilities. Each person has exactly one kite, and each kite belongs to exactly one person. A clue saying someone does NOT have a particular kite rules out one cell in the grid. Use both clues together with the 'each person has a different kite' rule to find who has what.",
          solution: {
            idea: "Use negative clues to eliminate options. With only three items and two eliminations, the remaining assignment is forced.",
            steps: [
              `Use both clues together with "each person has a different kite" to work out who has what.`,
              `${people[0]} has ${truePerm[0]}, ${people[1]} has ${truePerm[1]}, ${people[2]} has ${truePerm[2]}.`,
              `So ${people[askPerson]} has ${answer}.`
            ]
          }
        };
      },
      // (b) position in a row of 3, from an end-clue + an adjacency clue
      () => {
        const names = shuffle(["Ann", "Ben", "Cho"]);
        const posOf = {}; names.forEach((n, i) => (posOf[n] = i));
        const allPerms = permute(names);
        const atEndName = names[0];
        const adjA = names[0], adjB = names[1];
        const consistent = allPerms.filter((perm) => perm[0] === atEndName && perm.indexOf(adjB) === perm.indexOf(adjA) + 1);
        if (consistent.length !== 1) return null;
        const askName = pick(names);
        const answer = posOf[askName] + 1;
        const decoys = [1, 2, 3].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `${names.join(", ")} stand in a row of 3, left to right. ${atEndName} stands at the left end, and ${adjB} stands immediately to the right of ${adjA}. What position (from the left) does ${askName} stand in?`, options, correctIndex,
          hint: "Work out the full order by applying one clue at a time. Start with the clue that fixes someone to a specific position (the end), then use the adjacency clue to determine who stands next. Once two positions are known, the third is forced.",
          solution: {
            idea: "Apply the position clue first to fix one person, then use the adjacency clue to determine the order of all three.",
            steps: [
              `Positions from the left: ${names.map((n) => `${n}=${posOf[n] + 1}`).join(", ")}.`,
              `${askName} is in position ${answer}.`
            ]
          }
        };
      },
      // (c) direct attribute elimination: two of three are stated, the third is forced
      () => {
        const rows = shuffle(["cat", "dog", "fish"]);
        const cols = shuffle(["red", "blue", "green"]);
        const people = ["Sam", "Tia", "Zoe"];
        const petOf = {}, colorOf = {};
        people.forEach((p, i) => { petOf[p] = rows[i]; colorOf[p] = cols[i]; });
        const known = shuffle(people).slice(0, 2);
        const askPerson = people.find((p) => !known.includes(p));
        const answer = petOf[askPerson];
        const decoyPool = [...rows.filter((r) => r !== answer), "a hamster", "a rabbit"];
        const { options, correctIndex } = buildMCStr(answer, decoyPool.slice(0, 4));
        return { q: `${people[0]}, ${people[1]} and ${people[2]} each have a different pet (${rows.join(", ")}) and a different favourite colour (${cols.join(", ")}). ${known[0]} has a ${petOf[known[0]]} and likes ${colorOf[known[0]]}. ${known[1]} has a ${petOf[known[1]]} and likes ${colorOf[known[1]]}. What pet does ${askPerson} have?`, options, correctIndex,
          hint: "When two out of three possibilities are accounted for, the third is automatically determined. Two people's pets are given — since each pet is unique, the remaining person must have the only pet not yet taken. You do not need to use the colour information for this question.",
          solution: {
            idea: "When two options are taken, the third person gets the remaining one by elimination.",
            steps: [
              `Since each person has a different pet, and the other two pets are already taken by ${known[0]} and ${known[1]}, ${askPerson} must have the remaining pet: ${answer}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) circular seating: identify the two neighbours
      () => {
        const names = shuffle(["Jun", "Kim", "Lea", "Mai", "Nao"]);
        const n = names.length;
        const askPerson = pick(names);
        const i = names.indexOf(askPerson);
        const left = names[(i - 1 + n) % n], right = names[(i + 1) % n];
        const answer = `${left} and ${right}`;
        const others = names.filter((nm) => nm !== askPerson);
        const wrongPairs = [];
        for (let a = 0; a < others.length; a++) for (let b = a + 1; b < others.length; b++) {
          const pairSet = new Set([others[a], others[b]]);
          if (pairSet.has(left) && pairSet.has(right)) continue;
          wrongPairs.push(`${others[a]} and ${others[b]}`);
        }
        if (wrongPairs.length < 4) return null;
        const { options, correctIndex } = buildMCStr(answer, shuffle(wrongPairs).slice(0, 4));
        return { q: `${names.join(", ")} sit in a circle holding hands, in this order going round: ${names.join(" - ")} - (back to ${names[0]}). Who are the two people sitting next to ${askPerson}?`, options, correctIndex,
          hint: "In a circular arrangement, each person sits between two neighbours: the person immediately before them in the circle and the person immediately after. Think of the circle as a loop — the last person listed is also next to the first. Find where the named person appears in the order, then look at who is directly on either side.",
          solution: {
            idea: "In the circular order given, each person's neighbours are the one immediately before and immediately after them in the list, wrapping around.",
            steps: [`In the circle ${names.join(" - ")} - ${names[0]}, ${askPerson}'s neighbours are ${left} and ${right}.`]
          }
        };
      },
      // (b) chain pairwise comparisons into a full order
      () => {
        const names = shuffle(["Ali", "Bo", "Cy", "Di"]);
        const heights = shuffle([1, 2, 3, 4]);
        const heightOf = {}; names.forEach((n, i) => (heightOf[n] = heights[i]));
        const sorted = [...names].sort((a, b) => heightOf[a] - heightOf[b]);
        const askWhich = pick(["tallest", "shortest"]);
        const answer = askWhich === "tallest" ? sorted[3] : sorted[0];
        const decoys = names.filter((n) => n !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoys.length >= 4 ? decoys.slice(0, 4) : [...decoys, "Cannot be determined"]);
        return { q: `${sorted[0]} is shorter than ${sorted[1]}. ${sorted[1]} is shorter than ${sorted[2]}. ${sorted[2]} is shorter than ${sorted[3]}. Who is the ${askWhich}?`, options, correctIndex,
          hint: "A chain of comparisons (A shorter than B, B shorter than C, C shorter than D) defines a complete order from shortest to tallest. Write out the order by linking the clues: the person always on the left of 'shorter than' comparisons is shortest; the one always on the right is tallest.",
          solution: {
            idea: "Link the pairwise comparisons to build a complete order from shortest to tallest.",
            steps: [
              `Chaining the clues gives the full order from shortest to tallest: ${sorted.join(" < ")}.`,
              `The ${askWhich} is ${answer}.`
            ]
          }
        };
      },
      // (c) satisfy two clues at once among four candidates
      () => {
        const boxes = [];
        while (boxes.length < 4) { const n = rand(10, 99); if (!boxes.includes(n)) boxes.push(n); }
        const target = pick(boxes);
        const clue1 = target % 2 === 0 ? "the number is even" : "the number is odd";
        const clue2 = target > 50 ? "the number is greater than 50" : "the number is 50 or less";
        const passesBoth = (n) => (target % 2 === 0 ? n % 2 === 0 : n % 2 !== 0) && (target > 50 ? n > 50 : n <= 50);
        const satisfying = boxes.filter(passesBoth);
        if (satisfying.length !== 1) return null;
        const answer = satisfying[0];
        const { options, correctIndex } = buildMC(answer, boxes.filter((b) => b !== answer));
        return { q: `Four boxes contain the numbers ${boxes.join(", ")}. The mystery box satisfies both: ${clue1}, and ${clue2}. Which number is in the mystery box?`, options, correctIndex,
          hint: "Check each candidate number against BOTH clues simultaneously. A number that passes only one clue is not the answer — it must satisfy both at once. Testing each number in turn against all conditions is a systematic approach called logical deduction.",
          solution: {
            idea: "Test each number against both conditions. Only one will satisfy both at the same time.",
            steps: [`Check each number against both clues — only ${answer} satisfies both.`]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 20) { guard++; result = pick(bank)(); }
    return result || G.logicGrid(d);
  },
  combinatoricsCounting(d) {
    const tier1 = [
      // (a) the multiplication counting principle
      () => {
        const opt1 = rand(2, 5), opt2 = rand(2, 5);
        const total = opt1 * opt2;
        const item1 = pick(["shirts", "hats", "pencil cases", "bookmarks"]);
        const item2 = pick(["trousers", "scarves", "pencils", "stickers"]);
        const decoys = [opt1 + opt2, total + opt1, total - opt2, opt1 * opt2 + 1].filter((x) => x !== total && x > 0);
        const { options, correctIndex } = buildMC(total, decoys);
        return { q: `A shop sells ${opt1} different ${item1} and ${opt2} different ${item2}. If you choose one of each, how many different combinations are possible?`, options, correctIndex,
          hint: "The multiplication counting principle says: if one choice can be made in m ways and an independent second choice can be made in n ways, the total number of combined choices is m × n. Each of the first items can be paired with each of the second, so you multiply — not add — the numbers of options.",
          solution: {
            idea: "Multiply the number of choices at each independent stage: total combinations = options1 × options2.",
            steps: [`${opt1} × ${opt2} = ${total} combinations.`]
          }
        };
      },
      // (b) guarantee (pigeonhole) reasoning
      () => {
        const colours = rand(2, 5);
        const perColourAtLeast = rand(2, 4);
        const worstCase = colours * (perColourAtLeast - 1);
        const answer = worstCase + 1;
        const decoys = [worstCase, colours, perColourAtLeast, answer + 1].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `A drawer has socks in ${colours} different colours, with plenty of each colour. What is the smallest number of socks you must pull out (without looking) to be SURE of having ${perColourAtLeast} socks of the same colour?`, options, correctIndex,
          hint: "This is a pigeonhole-principle puzzle about the worst-case scenario. In the worst case, you might pick almost equal numbers of each colour before finally getting enough of one. Work out the worst case: you could pick (target − 1) of every colour without quite reaching the target. The very next sock must tip one colour over.",
          solution: {
            idea: "Worst case: pick (target − 1) of every colour without reaching the target. One more sock guarantees the target for some colour.",
            steps: [
              `Worst case: you could pull ${perColourAtLeast - 1} of EACH colour (${worstCase} socks) without having ${perColourAtLeast} of any one colour.`,
              `One more sock (${answer} total) guarantees ${perColourAtLeast} of some colour.`
            ]
          }
        };
      },
      // (c) permutations of distinct objects in a row
      () => {
        const n = rand(3, 5);
        function factorial(k) { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; }
        const total = factorial(n);
        const decoys = [n * n, total + n, total - n, factorial(n - 1)].filter((x) => x !== total && x > 0);
        const { options, correctIndex } = buildMC(total, decoys);
        const nm = N1();
        return { q: `${nm} has ${n} different books to arrange in a row on a shelf. In how many different orders can they be arranged?`, options, correctIndex,
          hint: "When arranging distinct objects in a row, count the choices at each position. There are n choices for the first spot, then (n − 1) remaining for the second, and so on, multiplying all the way down to 1 for the last position. This product is called a factorial.",
          solution: {
            idea: "Arrangements of n distinct objects = n factorial = n × (n−1) × ... × 1. Each step, one fewer choice remains.",
            steps: [
              `There are ${n} choices for the first spot, ${n - 1} for the next, and so on.`,
              `${Array.from({ length: n }, (_, i) => n - i).join(" × ")} = ${total}.`
            ]
          }
        };
      },
    ];
    const tier2 = [
      // (a) combinations (unordered pairs)
      () => {
        const n = rand(4, 7);
        const total = (n * (n - 1)) / 2;
        const decoys = [n, n * (n - 1), total + 1, total - 1].filter((x) => x !== total && x > 0);
        const { options, correctIndex } = buildMC(total, decoys);
        const nm = N1();
        return { q: `${nm} has ${n} friends and wants to invite exactly 2 of them to a picnic. How many different pairs of friends could ${nm} invite?`, options, correctIndex,
          hint: "To count unordered pairs, use the combination formula. For ordered pairs (where A inviting B is different from B inviting A), you would multiply: n × (n − 1). But since the order does not matter here (inviting A and B is the same as inviting B and A), divide by 2 to remove double-counting.",
          solution: {
            idea: "Count ordered selections then halve to remove double-counting of identical pairs: combinations = n × (n−1) ÷ 2.",
            steps: [
              `Each friend can be paired with any of the other ${n - 1}, giving ${n}×${n - 1} ordered pairs — but each PAIR is counted twice (A-B and B-A), so divide by 2.`,
              `${n}×${n - 1} ÷ 2 = ${total}.`
            ]
          }
        };
      },
      // (b) route-counting on a grid
      () => {
        const right = rand(2, 4), down = rand(2, 4);
        const grid = Array.from({ length: down + 1 }, () => Array(right + 1).fill(0));
        for (let i = 0; i <= down; i++) for (let j = 0; j <= right; j++) { if (i === 0 || j === 0) grid[i][j] = 1; else grid[i][j] = grid[i - 1][j] + grid[i][j - 1]; }
        const total = grid[down][right];
        const decoys = [right + down, right * down, total + 1, total - 1].filter((x) => x !== total && x > 0);
        const { options, correctIndex } = buildMC(total, decoys);
        return { q: `On a grid, you can only move right or down. How many different shortest routes are there from the top-left corner to a point ${right} steps right and ${down} steps down?`, options, correctIndex,
          hint: "Count shortest routes by building up from the top-left, cell by cell. Each cell can only be reached from the cell to its left or the cell above it, so the number of routes to each cell equals the sum of routes to those two neighbours (Pascal's triangle pattern). Fill in the grid systematically to find the total.",
          solution: {
            idea: "Build a route-count grid: each cell's count = (routes from left) + (routes from above). This mirrors Pascal's triangle.",
            steps: [
              `Build up route counts like Pascal's triangle: each point's count = (routes from the left) + (routes from above).`,
              `The total number of routes is ${total}.`
            ]
          }
        };
      },
      // (c) counting numbers formed under a digit constraint
      () => {
        const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
        const nPick2 = digits.length * (digits.length - 1);
        const decoys = [digits.length, digits.length * digits.length, nPick2 + 1, nPick2 - 1].filter((x) => x !== nPick2 && x > 0);
        const { options, correctIndex } = buildMC(nPick2, decoys);
        return { q: `Using two different digits from ${digits.join(", ")} (each digit used at most once), how many different 2-digit numbers can you form?`, options, correctIndex,
          hint: "The tens digit can be any of the available digits, and the units digit can be any of the remaining digits — one fewer, because each digit can be used at most once. Multiply: choices for tens × choices for units. This is a permutation (order matters, since 23 and 32 are different numbers).",
          solution: {
            idea: "Permutation with no repetition: choices for tens digit × choices for units digit (one fewer than tens, since that digit is used).",
            steps: [
              `Choose the tens digit (${digits.length} ways), then the units digit (${digits.length - 1} remaining ways).`,
              `${digits.length} × ${digits.length - 1} = ${nPick2}.`
            ]
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.combinatoricsCounting(d);
  },
  angleBasics(d) {
    const anglePt = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
    const tier1 = [
      // (a) classify an angle by type
      () => {
        const deg = pick([30, 45, 60, 90, 110, 135, 150, 180, 200, 250, 300, 330]);
        const classify = (dg) => (dg === 90 ? "right" : dg === 180 ? "straight" : dg < 90 ? "acute" : dg < 180 ? "obtuse" : "reflex");
        const answer = classify(deg);
        const cx = 140, cy = 140, r = 90;
        const [x1, y1] = anglePt(cx, cy, r, 0);
        const [x2, y2] = anglePt(cx, cy, r, deg);
        const svg = svgBox(SL(cx, cy, x1, y1) + SL(cx, cy, x2, y2) + SC(cx, cy, 3, "#2a1a5e", 1, "#2a1a5e"), 280, 220);
        const allTypes = ["acute", "right", "obtuse", "straight", "reflex"];
        const { options, correctIndex } = buildMCStr(answer, allTypes.filter((t) => t !== answer));
        return { q: `The diagram shows an angle of ${deg}°. What type of angle is this?`, options, correctIndex, svg,
          hint: "This is an angle classification question. Angles are measured in degrees — think of them as how far a hand on a clock turns. A right angle is exactly 90° (like the corner of a square), an acute angle is less than 90°, an obtuse angle is between 90° and 180°, a straight angle is exactly 180° (a flat line), and a reflex angle is anything bigger than 180° (more than half a full turn).",
          solution: {
            scenario: `The diagram shows an angle of ${deg}°. Identify what type of angle this is.`,
            idea: "Angles are sorted into five named types based on their size in degrees. A right angle is exactly 90°. An acute angle is less than 90°. An obtuse angle is between 90° and 180°. A straight angle is exactly 180° — it looks like a flat line. A reflex angle is between 180° and 360° — it's more than half a full turn.",
            method: ["Read the angle measurement.", "Compare it to the key boundaries: 90°, 180°, 360°.", "Pick the matching name."],
            steps: [
              `The angle is ${deg}°.`,
              `${deg}° is ${answer === "right" ? "exactly 90°" : answer === "straight" ? "exactly 180°" : answer === "acute" ? "less than 90°" : answer === "obtuse" ? "between 90° and 180°" : "between 180° and 360°"}.`,
              `This makes it ${answer === "acute" || answer === "obtuse" ? "an" : "a"} ${answer} angle.`
            ],
            check: `${deg}° fits in the ${answer} range, so the classification is correct.`
          }
        };
      },
      // (b) missing angle on a straight line
      () => {
        const a = rand(20, 160);
        const b = 180 - a;
        const svg = svgBox(SL(20, 150, 260, 150) + SL(140, 150, 140 + 80 * Math.cos((a * Math.PI) / 180), 150 - 80 * Math.sin((a * Math.PI) / 180)) + ST(90, 130, `${a}°`, "middle", 14) + ST(190, 130, "?", "middle", 14, "#7c5cff", 800), 280, 180);
        const decoys = [a, b + 10, b - 10, 180 - b + 5].filter((x) => x !== b && x > 0);
        const { options, correctIndex } = buildMC(b, decoys, (x) => `${x}°`);
        return { q: `The diagram shows two angles on a straight line, one of which is ${a}°. What is the size of the other angle, marked "?"?`, options, correctIndex, svg,
          hint: "This is a straight line angles question. A straight line is also an angle of exactly 180°. When a line is drawn from a point ON the straight line, it cuts the 180° into two pieces. Because the two pieces must add up to 180°, you can find the missing one by subtracting the one you know from 180.",
          solution: {
            scenario: `A straight line is cut into two angles by another line meeting it. One angle is ${a}°. Find the other angle.`,
            idea: "Angles on a straight line always add up to exactly 180°. This is because a straight line itself is a 180° angle — any line branching off it splits that 180° into two parts that must together reach 180°.",
            method: ["Write down the total (180°).", "Subtract the known angle.", "The result is the missing angle."],
            steps: [
              `Angles on a straight line add up to 180°.`,
              `Missing angle = 180° − ${a}° = ${b}°.`
            ],
            check: `${a}° + ${b}° = 180°. ✓`
          }
        };
      },
      // (c) missing angle around a point
      () => {
        const a = rand(60, 150), b = rand(60, 150);
        if (a + b >= 350) return null;
        const c = 360 - a - b;
        const svg = svgBox(SL(140, 110, 140, 20) + SL(140, 110, 140 + 85 * Math.cos(((90 - a) * Math.PI) / 180), 110 - 85 * Math.sin(((90 - a) * Math.PI) / 180)) + SL(140, 110, 140 + 85 * Math.cos(((90 - a - b) * Math.PI) / 180), 110 - 85 * Math.sin(((90 - a - b) * Math.PI) / 180)) + ST(165, 65, `${a}°`, "middle", 13) + ST(195, 110, `${b}°`, "middle", 13) + ST(100, 150, "?", "middle", 13, "#7c5cff", 800), 280, 200);
        const decoys = [a, b, c + 10, c - 10].filter((x) => x !== c && x > 0);
        const { options, correctIndex } = buildMC(c, decoys, (x) => `${x}°`);
        return { q: `Three angles meet at a point, measuring ${a}°, ${b}° and "?". What is the size of "?"?`, options, correctIndex, svg,
          hint: "This is an angles around a point question. If you draw any number of lines from a single point, all the angles between them fit around a full turn. A full turn is 360°. So all the angles at that point must add up to 360°. Subtract the ones you know to find the missing one.",
          solution: {
            scenario: `Three angles meet at a single point, measuring ${a}°, ${b}° and an unknown. Find the unknown angle.`,
            idea: "All the angles around a single point always add up to exactly 360° — this is because going all the way round a point brings you back to where you started, and a full turn is 360°.",
            method: ["Write down the total (360°).", "Add the known angles together.", "Subtract from 360° to find the missing one."],
            steps: [
              `Angles around a point add up to 360°.`,
              `Known angles: ${a}° + ${b}° = ${a + b}°.`,
              `Missing angle: 360° − ${a + b}° = ${c}°.`
            ],
            check: `${a}° + ${b}° + ${c}° = 360°. ✓`
          }
        };
      },
    ];
    const tier2 = [
      // (a) missing angle in a triangle
      () => {
        const a = rand(30, 100);
        const b = rand(30, Math.max(31, 165 - a));
        if (a + b >= 170) return null;
        const c = 180 - a - b;
        if (c <= 0) return null;
        const svg = svgBox(SL(40, 170, 240, 170) + SL(40, 170, 140, 30) + SL(240, 170, 140, 30) + ST(70, 155, `${a}°`, "middle", 13) + ST(210, 155, `${b}°`, "middle", 13) + ST(140, 55, "?", "middle", 13, "#7c5cff", 800), 280, 200);
        const decoys = [a, b, c + 10, c - 10].filter((x) => x !== c && x > 0);
        const { options, correctIndex } = buildMC(c, decoys, (x) => `${x}°`);
        return { q: `A triangle has two angles of ${a}° and ${b}°. What is the size of the third angle, marked "?"?`, options, correctIndex, svg,
          hint: "This is a missing angle in a triangle question. No matter what shape or size a triangle is, its three inside angles always add up to exactly 180°. If you know two of them, just add those two together and subtract from 180° to get the third.",
          solution: {
            scenario: `A triangle has angles of ${a}°, ${b}° and an unknown third angle. Find the missing angle.`,
            idea: "The three angles inside any triangle always add up to 180°. This is true for every triangle, however stretched or squashed it looks.",
            method: ["Write down the total for a triangle (180°).", "Add the two known angles.", "Subtract from 180° to find the third."],
            steps: [
              `Angles in a triangle add up to 180°.`,
              `Known angles: ${a}° + ${b}° = ${a + b}°.`,
              `Missing angle: 180° − ${a + b}° = ${c}°.`
            ],
            check: `${a}° + ${b}° + ${c}° = 180°. ✓`
          }
        };
      },
      // (b) vertically opposite / adjacent angles at a crossing
      () => {
        const a = rand(20, 160);
        const opposite = a, adjacent = 180 - a;
        const askOpposite = pick([true, false]);
        const answer = askOpposite ? opposite : adjacent;
        const svg = svgBox(SL(40, 190, 240, 30) + SL(40, 30, 240, 190) + SC(140, 110, 3, "#2a1a5e", 1, "#2a1a5e") + ST(165, 90, `${a}°`, "middle", 13), 280, 220);
        const decoys = [a, adjacent, opposite + 10, adjacent - 10].filter((x) => x !== answer && x > 0);
        const { options, correctIndex } = buildMC(answer, decoys, (x) => `${x}°`);
        return { q: `Two straight lines cross, making an angle of ${a}° on one side. What is the size of the angle ${askOpposite ? "vertically opposite it (directly across the crossing point)" : "immediately next to it (on the same line)"}?`, options, correctIndex, svg,
          hint: `This is a crossing lines angles question. When two straight lines cross, they make four angles. Angles directly opposite each other at the crossing point — called vertically opposite angles — are always equal. Angles next to each other that share a straight-line edge must add up to 180°.`,
          solution: {
            scenario: `Two straight lines cross, making an angle of ${a}° on one side. Find the angle ${askOpposite ? "directly opposite it" : "immediately next to it on the same line"}.`,
            idea: `When two lines cross, they form four angles. The two pairs directly opposite each other (called vertically opposite angles) are always equal to each other. The two angles sitting side-by-side on any straight line add up to 180°.`,
            method: [
              askOpposite
                ? "Identify that the asked angle is directly opposite the known one."
                : "Identify that the asked angle is next to the known one on a straight line.",
              askOpposite
                ? "Vertically opposite angles are equal, so copy the known value."
                : "Angles on a straight line add to 180°, so subtract from 180°."
            ],
            steps: askOpposite
              ? [`Vertically opposite angles are always equal.`, `The angle opposite ${a}° is also ${opposite}°.`]
              : [`Angles on a straight line add to 180°.`, `180° − ${a}° = ${adjacent}°.`],
            check: askOpposite
              ? `${a}° and ${opposite}° are equal — confirmed vertically opposite.`
              : `${a}° + ${adjacent}° = 180°. ✓`
          }
        };
      },
      // (c) compare which of two drawn angles is bigger
      () => {
        const a = rand(20, 160);
        let b = rand(20, 160);
        if (Math.abs(a - b) < 15) return null;
        const svg = svgBox(
          ST(70, 30, "Angle A", "middle", 13, "#2a1a5e", 700) + SL(70, 180, 70, 100) + SL(70, 180, 70 + 70 * Math.cos(((90 - a) * Math.PI) / 180), 180 - 70 * Math.sin(((90 - a) * Math.PI) / 180)) +
          ST(210, 30, "Angle B", "middle", 13, "#2a1a5e", 700) + SL(210, 180, 210, 100) + SL(210, 180, 210 + 70 * Math.cos(((90 - b) * Math.PI) / 180), 180 - 70 * Math.sin(((90 - b) * Math.PI) / 180)), 280, 200);
        const wantBigger = pick([true, false]);
        const ans = wantBigger === a > b ? "Angle A" : "Angle B";
        const decoys = [wantBigger === a > b ? "Angle B" : "Angle A", "They are equal", "Cannot be determined from the diagram", "It depends on the length of the lines drawn"];
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Which is the ${wantBigger ? "bigger" : "smaller"} angle: A or B?`, options, correctIndex, svg,
          hint: "This is an angle comparison question. The key thing to remember is that the SIZE of an angle only depends on the amount of turn between the two lines — it has nothing to do with how long those lines are drawn. Look at the gap between the lines, not their length.",
          solution: {
            scenario: `Two angles are drawn: Angle A = ${a}° and Angle B = ${b}°. Find the ${wantBigger ? "bigger" : "smaller"} one.`,
            idea: "The size of an angle is the amount of turning between two lines — it doesn't depend on how long the lines are drawn. A wider gap between the lines means a bigger angle.",
            method: ["Read each angle's measurement.", "Compare the two values directly.", "Pick the one that is bigger (or smaller, as asked)."],
            steps: [
              `Angle A = ${a}°, Angle B = ${b}°.`,
              `${a}° ${a > b ? ">" : "<"} ${b}°, so ${ans} is ${wantBigger ? "bigger" : "smaller"}.`
            ],
            check: "The length of the lines doesn't affect the answer — only the degree values matter."
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.angleBasics(d);
  },
  shapeProperties(d) {
    function polygonPath(cx, cy, r, sides) {
      const pts = [];
      for (let i = 0; i < sides; i++) { const ang = -90 + (i * 360) / sides; pts.push([cx + r * Math.cos((ang * Math.PI) / 180), cy + r * Math.sin((ang * Math.PI) / 180)]); }
      let path = "";
      for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i]; const [x2, y2] = pts[(i + 1) % pts.length]; path += SL(x1, y1, x2, y2); }
      return { path, pts };
    }
    const tier1 = [
      // (a) count sides or vertices of a named regular polygon
      () => {
        const shapes = [{ name: "triangle", sides: 3 }, { name: "quadrilateral", sides: 4 }, { name: "pentagon", sides: 5 }, { name: "hexagon", sides: 6 }, { name: "heptagon", sides: 7 }, { name: "octagon", sides: 8 }];
        const shape = pick(shapes);
        const askVertices = pick([true, false]);
        const answer = shape.sides;
        const { path } = polygonPath(140, 110, 70, shape.sides);
        const svg = svgBox(path, 280, 220);
        const decoys = [answer + 1, answer - 1, answer + 2, answer - 2].filter((x) => x !== answer && x > 2);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `The diagram shows a regular ${shape.name}. How many ${askVertices ? "vertices (corners)" : "sides"} does it have?`, options, correctIndex, svg,
          hint: "This is a polygon properties question. A polygon is any flat shape with straight sides. The name of a polygon tells you how many sides it has — 'tri' means 3, 'quad' means 4, 'penta' means 5, 'hexa' means 6, 'hepta' means 7, and 'octa' means 8. Also, for any simple polygon, the number of sides always equals the number of corners (called vertices).",
          solution: {
            scenario: `A regular ${shape.name} is shown. Count how many ${askVertices ? "vertices (corners)" : "sides"} it has.`,
            idea: "The name of a polygon tells you its side count: triangle = 3, quadrilateral = 4, pentagon = 5, hexagon = 6, heptagon = 7, octagon = 8. For any simple polygon, the number of sides always equals the number of vertices — one corner sits at each join between two sides.",
            method: ["Read the shape's name.", "Use the name to find the side count.", "Vertices always equal sides for a simple polygon."],
            steps: [
              `A ${shape.name} has ${answer} sides.`,
              `It also has ${answer} vertices, since each corner joins two sides.`,
              `Answer: ${answer}.`
            ],
            check: `A ${shape.name} is defined as a polygon with ${answer} sides — confirmed.`
          }
        };
      },
      // (b) regular vs irregular
      () => {
        const isRegular = pick([true, false]);
        const sides = pick([4, 5, 6]);
        const cx = 140, cy = 110, r = 70;
        const pts = [];
        for (let i = 0; i < sides; i++) { const ang = -90 + (i * 360) / sides; const rr = isRegular ? r : r * (0.65 + 0.5 * ((i * 37) % 10) / 10); pts.push([cx + rr * Math.cos((ang * Math.PI) / 180), cy + rr * Math.sin((ang * Math.PI) / 180)]); }
        let path = ""; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i]; const [x2, y2] = pts[(i + 1) % pts.length]; path += SL(x1, y1, x2, y2); }
        const svg = svgBox(path, 280, 220);
        const answer = isRegular ? "Regular" : "Irregular";
        const { options, correctIndex } = buildMCStr(answer, [isRegular ? "Irregular" : "Regular", "Cannot be determined", "Both regular and irregular", "It depends on which side you measure from"]);
        return { q: `Is the ${sides}-sided shape shown regular or irregular?`, options, correctIndex, svg,
          hint: "This is a regular vs irregular shape question. A regular shape has ALL sides exactly the same length AND all angles exactly the same size — both conditions must be true. If any side or angle differs from the rest, the shape is irregular. Look carefully at whether the shape appears uniform all the way round or uneven in any place.",
          solution: {
            scenario: `A ${sides}-sided shape is shown. Decide whether it is regular or irregular.`,
            idea: "A regular polygon must have every side the same length AND every angle the same size. Both conditions must be met. If either condition fails — even one unequal side or one different angle — the shape is irregular.",
            method: ["Look at whether all sides appear equal.", "Check whether all angles appear equal.", "If both, regular; otherwise, irregular."],
            steps: [
              `A regular polygon needs equal sides AND equal angles.`,
              `This shape is ${answer.toLowerCase()}${isRegular ? " — every side and angle matches." : " — the sides are not all the same length."}`
            ],
            check: isRegular ? "All sides and all angles are equal — regular confirmed." : "At least one side differs — irregular confirmed."
          }
        };
      },
      // (c) perimeter of a regular polygon shown with one side labelled
      () => {
        const sides = pick([3, 5, 6, 8]);
        const sideLen = rand(4, 15);
        const perim = sides * sideLen;
        const { path, pts } = polygonPath(140, 110, 70, sides);
        const labelSvg = ST(pts[0][0] + (pts[1][0] - pts[0][0]) / 2, pts[0][1] + (pts[1][1] - pts[0][1]) / 2 - 8, `${sideLen} cm`, "middle", 12);
        const svg = svgBox(path + labelSvg, 280, 220);
        const decoys = [sideLen, perim + sideLen, perim - sideLen, sides + sideLen].filter((x) => x !== perim && x > 0);
        const { options, correctIndex } = buildMC(perim, decoys, (x) => `${x} cm`);
        return { q: `The diagram shows a regular ${sides}-sided polygon with one side labelled. What is its perimeter?`, options, correctIndex, svg,
          hint: "This is a regular polygon perimeter question. The perimeter of a shape is the total distance all the way round its outside edge. Because the shape is regular, every side is the same length. So instead of measuring each side separately, you can multiply the one labelled side by the total number of sides.",
          solution: {
            scenario: `A regular ${sides}-sided polygon has one side labelled ${sideLen} cm. Find its perimeter.`,
            idea: "The perimeter of a shape is the total length of its outside edges added together. For a regular polygon — where all sides are equal — this is simply the side length multiplied by the number of sides.",
            method: ["Read the labelled side length.", "Count the number of sides.", "Multiply: perimeter = side length × number of sides."],
            steps: [
              `The polygon has ${sides} sides, each ${sideLen} cm long (because it's regular).`,
              `Perimeter = ${sides} × ${sideLen} = ${perim} cm.`
            ],
            check: `Adding ${sides} lots of ${sideLen} cm gives ${perim} cm. ✓`
          }
        };
      },
    ];
    const tier2 = [
      // (a) read coordinates of a plotted point (first quadrant)
      () => {
        const x = rand(1, 9), y = rand(1, 9);
        const CX = 40, CY = 200, PX = 20;
        const [px, py] = [CX + x * PX, CY - y * PX];
        const axesSvg = SL(CX, CY, CX + 200, CY, "#c9bff0", 1.5) + SL(CX, CY, CX, 20, "#c9bff0", 1.5);
        const svg = svgBox(axesSvg + SC(px, py, 4, "#7c5cff", 2, "#7c5cff") + ST(px + 8, py - 8, "P", "start", 13), 280, 240);
        const ans = `(${x}, ${y})`;
        const candidates = [`(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${y + 1})`, `(${Math.max(x - 1, 0)}, ${y})`, `(${x}, ${Math.max(y - 1, 0)})`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Point P is plotted on the grid. What are its coordinates?`, options, correctIndex, svg,
          hint: "This is a reading coordinates question. Coordinates are written as two numbers in brackets, like (3, 5). The first number is how far across (left or right), and the second is how far up (or down). A helpful way to remember: go along the corridor first, then up the stairs.",
          solution: {
            scenario: `Point P is plotted on a grid. Read off its coordinates.`,
            idea: "Coordinates are written as (x, y). The first number, x, counts squares across from the left (along the horizontal axis). The second number, y, counts squares up from the bottom (along the vertical axis). Always read across first, then up.",
            method: ["Count how many squares across Point P is from the vertical axis.", "Count how many squares up Point P is from the horizontal axis.", "Write as (x, y)."],
            steps: [
              `P is ${x} unit${x === 1 ? "" : "s"} across.`,
              `P is ${y} unit${y === 1 ? "" : "s"} up.`,
              `Coordinates: (${x}, ${y}).`
            ],
            check: `Going ${x} across and ${y} up lands exactly on P. ✓`
          }
        };
      },
      // (b) translate a point by a vector
      () => {
        const x = rand(0, 6), y = rand(0, 6);
        const a = rand(-4, 4) || 1, b = rand(-4, 4) || 2;
        const nx = x + a, ny = y + b;
        const CX = 100, CY = 200, PX = 16;
        const [px, py] = [CX + x * PX, CY - y * PX];
        const axesSvg = SL(CX, CY, CX + 160, CY, "#c9bff0", 1.5) + SL(CX, CY, CX, 20, "#c9bff0", 1.5);
        const svg = svgBox(axesSvg + SC(px, py, 4, "#7c5cff", 2, "#7c5cff") + ST(px + 8, py - 8, "P", "start", 13), 280, 240);
        const ans = `(${nx}, ${ny})`;
        const candidates = [`(${x - a},${y - b})`, `(${nx},${y})`, `(${x},${ny})`, `(${nx + 1},${ny})`, `(${nx},${ny + 1})`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Point P = (${x}, ${y}) is shown on the grid. P is translated by (${a}, ${b}) — that means ${a >= 0 ? `${a} right` : `${-a} left`} and ${b >= 0 ? `${b} up` : `${-b} down`}. What are the new coordinates?`, options, correctIndex, svg,
          hint: "This is a translation question. A translation means sliding a point to a new position without rotating or flipping it. The translation is given as two numbers — the first says how far to move left or right (positive = right, negative = left), and the second says how far up or down (positive = up, negative = down). Add these numbers directly to the original coordinates.",
          solution: {
            scenario: `Point P = (${x}, ${y}) is translated by (${a}, ${b}). Find the new coordinates.`,
            idea: "A translation slides every point by the same amount. The translation (a, b) means: add a to the x-coordinate (moving right if positive, left if negative) and add b to the y-coordinate (moving up if positive, down if negative).",
            method: ["Take the original x-coordinate and add the first translation number.", "Take the original y-coordinate and add the second translation number.", "Write the new pair as coordinates."],
            steps: [
              `New x: ${x} + (${a}) = ${nx}.`,
              `New y: ${y} + (${b}) = ${ny}.`,
              `New coordinates: (${nx}, ${ny}).`
            ],
            check: `Moving ${Math.abs(a)} ${a >= 0 ? "right" : "left"} and ${Math.abs(b)} ${b >= 0 ? "up" : "down"} from (${x}, ${y}) reaches (${nx}, ${ny}). ✓`
          }
        };
      },
      // (c) classify a triangle by its side lengths
      () => {
        const type = pick(["equilateral", "isosceles", "scalene"]);
        let sides;
        if (type === "equilateral") { const s = rand(4, 10); sides = [s, s, s]; }
        else if (type === "isosceles") { const s = rand(4, 10); let s2; do { s2 = rand(4, 10); } while (s2 === s); sides = [s, s, s2]; }
        else { let s1 = rand(4, 10), s2, s3; do { s2 = rand(4, 10); } while (s2 === s1); do { s3 = rand(4, 10); } while (s3 === s1 || s3 === s2); sides = [s1, s2, s3]; }
        const cx = 140, cy = 170;
        const svg = svgBox(SL(cx - 70, cy, cx + 70, cy) + SL(cx - 70, cy, cx, cy - 100) + SL(cx + 70, cy, cx, cy - 100) + ST(cx - 40, cy + 15, `${sides[0]} cm`, "middle", 11) + ST(cx + 45, cy - 45, `${sides[1]} cm`, "middle", 11) + ST(cx - 45, cy - 45, `${sides[2]} cm`, "middle", 11), 280, 220);
        const answer = type.charAt(0).toUpperCase() + type.slice(1);
        const decoyPool = ["Equilateral", "Isosceles", "Scalene", "Right-angled", "Cannot be classified"].filter((t) => t !== answer);
        const { options, correctIndex } = buildMCStr(answer, decoyPool.slice(0, 4));
        return { q: `A triangle has sides ${sides.join(" cm, ")} cm. How would you classify this triangle by its sides?`, options, correctIndex, svg,
          hint: "This is a classify triangles by sides question. Triangles are named by how many of their sides match each other. An equilateral triangle has all three sides equal. An isosceles triangle has exactly two sides equal (and the third different). A scalene triangle has all three sides different — no two match.",
          solution: {
            scenario: `A triangle has sides ${sides.join(" cm, ")} cm. Classify it by its side lengths.`,
            idea: "Triangles are sorted into three types by their sides. Equilateral: all three sides equal. Isosceles: exactly two sides equal. Scalene: all three sides different. Count the equal sides to decide.",
            method: ["List the side lengths.", "Count how many are identical.", "Match to the correct name."],
            steps: [
              `Side lengths: ${sides.join(" cm, ")} cm.`,
              type === "equilateral"
                ? `All three sides are equal (${sides[0]} cm each): equilateral.`
                : type === "isosceles"
                ? `Two sides are equal (${sides[0]} cm and ${sides[1]} cm): isosceles.`
                : `All three sides are different: scalene.`,
              `Answer: ${answer}.`
            ],
            check: type === "equilateral"
              ? `${sides[0]} = ${sides[1]} = ${sides[2]}, so equilateral is correct. ✓`
              : type === "isosceles"
              ? `Two matching sides (${sides[0]} cm), one different (${sides[2]} cm), so isosceles is correct. ✓`
              : `${sides[0]}, ${sides[1]}, ${sides[2]} are all different, so scalene is correct. ✓`
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.shapeProperties(d);
  },
  symmetryReflection(d) {
    const tier1 = [
      // (a) lines of symmetry of a shown shape
      () => {
        const shapes = [
          { name: "equilateral triangle", sides: 3, lines: 3 }, { name: "square", sides: 4, lines: 4 },
          { name: "regular pentagon", sides: 5, lines: 5 }, { name: "regular hexagon", sides: 6, lines: 6 },
          { name: "rectangle (non-square)", sides: 4, lines: 2, special: "rect" },
          { name: "isosceles triangle (non-equilateral)", sides: 3, lines: 1, special: "isoTri" },
        ];
        const shape = pick(shapes);
        const cx = 140, cy = 110, r = 70;
        let path;
        if (shape.special === "rect") path = SR(cx - 90, cy - 50, 180, 100, "#2a1a5e", 2);
        else if (shape.special === "isoTri") path = SL(cx - 70, cy + 50, cx + 70, cy + 50) + SL(cx - 70, cy + 50, cx - 20, cy - 60) + SL(cx + 70, cy + 50, cx - 20, cy - 60);
        else {
          const pts = []; for (let i = 0; i < shape.sides; i++) { const ang = -90 + (i * 360) / shape.sides; pts.push([cx + r * Math.cos((ang * Math.PI) / 180), cy + r * Math.sin((ang * Math.PI) / 180)]); }
          path = ""; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i]; const [x2, y2] = pts[(i + 1) % pts.length]; path += SL(x1, y1, x2, y2); }
        }
        const svg = svgBox(path, 280, 220);
        const answer = shape.lines;
        const decoys = [answer + 1, answer - 1, answer + 2, shape.sides].filter((x) => x !== answer && x >= 0);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `How many lines of symmetry does this shape have?`, options, correctIndex, svg,
          hint: "This is a lines of symmetry question. A line of symmetry is an imaginary line you can fold a shape along so that both halves match perfectly. For regular polygons — shapes with all sides and angles equal — the number of lines of symmetry equals the number of sides. A rectangle that is not a square has 2 lines. An isosceles triangle (two equal sides) has just 1.",
          solution: {
            scenario: `Count the lines of symmetry of the ${shape.name} shown.`,
            idea: "A line of symmetry divides a shape into two mirror-image halves. For regular polygons, there is one line of symmetry per side (e.g. a regular hexagon has 6 lines). Shapes that are only partly symmetrical have fewer — a rectangle has 2, an isosceles triangle has 1, and a parallelogram (not a rectangle) has none.",
            method: ["Identify the shape.", "Recall (or count) how many ways it can be folded onto itself.", "State the number."],
            steps: [
              `The shape is ${shape.name === "rectangle (non-square)" ? "a rectangle (not a square)" : shape.name === "isosceles triangle (non-equilateral)" ? "an isosceles triangle" : `a ${shape.name}`}.`,
              `It has ${answer} line${answer === 1 ? "" : "s"} of symmetry.`
            ],
            check: `A ${shape.name} has ${answer} line${answer === 1 ? "" : "s"} — this is a standard fact worth remembering.`
          }
        };
      },
      // (b) reflect a point in the x-axis or y-axis
      () => {
        const x = rand(-6, 6), y = rand(1, 6);
        const axis = pick(["x-axis", "y-axis"]);
        const nx = axis === "y-axis" ? -x : x;
        const ny = axis === "x-axis" ? -y : y;
        const CX = 140, CY = 120, PX = 14;
        const [ox, oy] = [CX + x * PX, CY - y * PX];
        const axesSvg = SL(20, CY, 260, CY, "#c9bff0", 1.5) + SL(CX, 20, CX, 220, "#c9bff0", 1.5);
        const svg = svgBox(axesSvg + SC(ox, oy, 4, "#7c5cff", 2, "#7c5cff") + ST(ox + 8, oy - 8, "P", "start", 13), 280, 240);
        const ans = `(${nx}, ${ny})`;
        const candidates = [`(${x},${y})`, `(${-x},${y})`, `(${x},${-y})`, `(${-x},${-y})`, `(${nx + 1},${ny})`, `(${nx},${ny + 1})`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Point P = (${x}, ${y}) is reflected in the ${axis}. What are the coordinates of the reflected point?`, options, correctIndex, svg,
          hint: `This is a reflection in an axis question. Reflecting a point in the x-axis (the horizontal line) flips it vertically — the x-coordinate stays the same but the y-coordinate changes sign (positive becomes negative, or vice versa). Reflecting in the y-axis (the vertical line) flips it horizontally — the y-coordinate stays the same but the x-coordinate changes sign.`,
          solution: {
            scenario: `Point P = (${x}, ${y}) is reflected in the ${axis}. Find the new coordinates.`,
            idea: `Reflecting in the x-axis flips the sign of the y-coordinate (the up/down position) while leaving x unchanged. Reflecting in the y-axis flips the sign of the x-coordinate (left/right) while leaving y unchanged. Think of it as flipping the point to the other side of the mirror line.`,
            method: [
              `Identify which axis is the mirror line.`,
              axis === "x-axis"
                ? "Reflecting in the x-axis: keep x the same, flip the sign of y."
                : "Reflecting in the y-axis: keep y the same, flip the sign of x.",
              "Write the new coordinates."
            ],
            steps: axis === "x-axis"
              ? [`Reflecting in the x-axis: x stays as ${x}, y changes sign from ${y} to ${ny}.`, `Reflected point: (${nx}, ${ny}).`]
              : [`Reflecting in the y-axis: y stays as ${y}, x changes sign from ${x} to ${nx}.`, `Reflected point: (${nx}, ${ny}).`],
            check: `The point is now on the opposite side of the ${axis} — same distance, other side. ✓`
          }
        };
      },
      // (c) complete a symmetric grid pattern
      () => {
        const gridSize = 4;
        const shadedCol = rand(0, 1), shadedRow = rand(0, 3);
        const mirrorCol = gridSize - 1 - shadedCol;
        const cellSize = 40, ox = 40, oy = 20;
        let s = "";
        for (let r = 0; r < gridSize; r++) for (let c = 0; c < gridSize; c++) { const filled = r === shadedRow && c === shadedCol; s += SR(ox + c * cellSize, oy + r * cellSize, cellSize, cellSize, "#2a1a5e", 1.5, filled ? "#7c5cff" : "none"); }
        s += SL(ox + (gridSize * cellSize) / 2, oy, ox + (gridSize * cellSize) / 2, oy + gridSize * cellSize, "#ff6b4a", 2);
        const svg = svgBox(s, 280, 240);
        const ans = `Row ${shadedRow + 1}, Column ${mirrorCol + 1}`;
        const decoyPool = [];
        for (let r = 0; r < gridSize; r++) for (let c = 0; c < gridSize; c++) { if (r === shadedRow && c === mirrorCol) continue; decoyPool.push(`Row ${r + 1}, Column ${c + 1}`); }
        const { options, correctIndex } = buildMCStr(ans, shuffle(decoyPool).slice(0, 4));
        return { q: `The grid shows one shaded cell and a vertical line of symmetry (in orange). Which cell must ALSO be shaded to make the pattern symmetric about that line?`, options, correctIndex, svg,
          hint: "This is a completing a symmetrical pattern question. A vertical line of symmetry acts like a mirror running up and down the middle. Each shaded cell on the left must have a matching cell at the same height on the right — the same distance from the mirror line, but on the other side. Find where the shaded cell's mirror image lands.",
          solution: {
            scenario: `A cell in Row ${shadedRow + 1}, Column ${shadedCol + 1} is shaded. A vertical line of symmetry runs down the middle. Find the cell that must also be shaded.`,
            idea: "A vertical line of symmetry acts like a mirror. Any cell on the left at distance d from the line has its mirror image at distance d on the right — in the same row but a different column. The row stays the same; the column flips across the mirror.",
            method: ["Find the row of the shaded cell — it stays the same after reflection.", "Count how far the column is from the mirror line.", "Go the same distance on the other side — that's the reflected column."],
            steps: [
              `Shaded cell: Row ${shadedRow + 1}, Column ${shadedCol + 1}.`,
              `The mirror line is between columns ${gridSize / 2} and ${gridSize / 2 + 1}.`,
              `Reflecting Column ${shadedCol + 1} gives Column ${mirrorCol + 1}.`,
              `The matching cell is Row ${shadedRow + 1}, Column ${mirrorCol + 1}.`
            ],
            check: `Row ${shadedRow + 1}, Column ${mirrorCol + 1} is the same distance from the mirror on the opposite side. ✓`
          }
        };
      },
    ];
    const tier2 = [
      // (a) identify which shape has a given number of symmetry lines
      () => {
        const shapes = [{ name: "an equilateral triangle", lines: 3 }, { name: "a square", lines: 4 }, { name: "a regular pentagon", lines: 5 }, { name: "a regular hexagon", lines: 6 }, { name: "a rectangle that is not a square", lines: 2 }, { name: "a parallelogram that is not a rectangle", lines: 0 }];
        const target = rand(0, 4);
        const matching = shapes.filter((s) => s.lines === target);
        if (matching.length !== 1) return null;
        const answer = matching[0].name;
        const decoys = shapes.filter((s) => s.lines !== target).map((s) => s.name);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(answer, shuffle(decoys).slice(0, 4));
        return { q: `Which of these shapes has exactly ${target} line${target === 1 ? "" : "s"} of symmetry?`, options, correctIndex,
          hint: "This is a symmetry facts question. The number of lines of symmetry depends on the shape: a regular polygon has as many lines as it has sides (e.g. a regular hexagon has 6). A rectangle that is not a square has 2. A parallelogram that is not a rectangle has 0 — it has rotational symmetry but no line symmetry. Learn these key facts by shape name.",
          solution: {
            scenario: `Find which of the listed shapes has exactly ${target} line${target === 1 ? "" : "s"} of symmetry.`,
            idea: "For regular polygons, lines of symmetry = number of sides. For non-regular shapes: a rectangle (not square) has 2 lines; a parallelogram (not rectangle) has 0 lines. Symmetry counts are fixed properties of each named shape.",
            method: ["Recall the lines of symmetry for each shape.", "Find the one that matches the target number."],
            steps: [
              `Target: exactly ${target} line${target === 1 ? "" : "s"} of symmetry.`,
              `${answer.charAt(0).toUpperCase() + answer.slice(1)} has exactly ${target} line${target === 1 ? "" : "s"} of symmetry.`
            ],
            check: `Check: a square has 4 lines, equilateral triangle has 3, pentagon has 5, hexagon has 6, rectangle (not square) has 2, parallelogram (not rectangle) has 0.`
          }
        };
      },
      // (b) reflect a point in the diagonal line y=x
      () => {
        const x = rand(1, 7), y = rand(1, 7);
        if (x === y) return null;
        const CX = 40, CY = 200, PX = 18;
        const [ox, oy] = [CX + x * PX, CY - y * PX];
        const axesSvg = SL(CX, CY, CX + 180, CY, "#c9bff0", 1.5) + SL(CX, CY, CX, 20, "#c9bff0", 1.5) + SL(CX, CY, CX + 160, CY - 160, "#ffc93c", 1.5);
        const svg = svgBox(axesSvg + SC(ox, oy, 4, "#7c5cff", 2, "#7c5cff") + ST(ox + 8, oy - 8, "P", "start", 13), 280, 240);
        const ans = `(${y}, ${x})`;
        const candidates = [`(${x},${y})`, `(${-x},${y})`, `(${x},${-y})`, `(${y + 1},${x})`, `(${y},${x + 1})`];
        const decoys = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `Point P = (${x}, ${y}) is reflected in the diagonal line y = x (shown in yellow). What are the coordinates of the reflected point?`, options, correctIndex, svg,
          hint: "This is a reflection in y = x question. The line y = x is the diagonal line going through (0, 0), (1, 1), (2, 2), and so on — it runs at 45° across the grid. Reflecting a point in this line swaps its two coordinates: the x-value becomes y and the y-value becomes x. So (3, 7) becomes (7, 3), and so on.",
          solution: {
            scenario: `Point P = (${x}, ${y}) is reflected in the line y = x. Find the new coordinates.`,
            idea: "The line y = x is the diagonal running through (0,0), (1,1), (2,2) etc. Reflecting any point in this line simply swaps its x- and y-coordinates. The rule is: (x, y) → (y, x).",
            method: ["Note the original coordinates.", "Swap x and y.", "Write the result."],
            steps: [
              `Original: (${x}, ${y}).`,
              `Swap the coordinates: x becomes ${y}, y becomes ${x}.`,
              `Reflected point: (${y}, ${x}).`
            ],
            check: `(${x}, ${y}) → (${y}, ${x}): the two values have been swapped. ✓`
          }
        };
      },
      // (c) judge whether a shown shape has line symmetry at all
      () => {
        const hasSymmetry = pick([true, false]);
        const cx = 140, cy = 110;
        let path, answer;
        if (hasSymmetry) {
          path = SL(cx, cy - 70, cx + 50, cy) + SL(cx + 50, cy, cx, cy + 40) + SL(cx, cy + 40, cx - 50, cy) + SL(cx - 50, cy, cx, cy - 70);
          answer = "Yes — it has a vertical line of symmetry";
        } else {
          path = SL(cx - 60, cy - 50, cx + 55, cy - 20) + SL(cx + 55, cy - 20, cx + 20, cy + 55) + SL(cx + 20, cy + 55, cx - 40, cy + 30) + SL(cx - 40, cy + 30, cx - 60, cy - 50);
          answer = "No — it has no line of symmetry";
        }
        const svg = svgBox(path, 280, 220);
        const decoyPool = ["Yes — it has a vertical line of symmetry", "Yes — it has a horizontal line of symmetry", "No — it has no line of symmetry", "Yes — it has rotational symmetry only", "Cannot be determined from the picture"];
        const decoys = decoyPool.filter((s) => s !== answer).slice(0, 4);
        const { options, correctIndex } = buildMCStr(answer, decoys);
        return { q: `Does the shape shown have a line of symmetry?`, options, correctIndex, svg,
          hint: "This is a does the shape have symmetry question. A shape has a line of symmetry if there is a straight line you could fold it along so that both halves match perfectly. Try imagining folding the shape along a vertical, horizontal, or diagonal line — do the two halves land exactly on top of each other? If yes for any line, the shape is symmetric.",
          solution: {
            scenario: `A shape is shown. Decide whether it has a line of symmetry.`,
            idea: "A line of symmetry is a fold line that splits a shape into two exact mirror halves. You can test vertical, horizontal and diagonal fold lines. If even one works — if both halves would land perfectly on each other — the shape has line symmetry.",
            method: ["Mentally try folding along a vertical line.", "Try a horizontal line.", "Check diagonal lines if needed.", "State the result."],
            steps: [
              hasSymmetry
                ? "Folding along the vertical centre line makes the two halves match perfectly."
                : "Folding along any candidate line leaves the two halves mismatched.",
              answer
            ],
            check: hasSymmetry
              ? "Both halves are mirror images — line symmetry confirmed. ✓"
              : "No fold line produces matching halves — no line symmetry. ✓"
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.symmetryReflection(d);
  },
  spatialPuzzles(d) {
    const tier1 = [
      // (a) paper folding + cutting: predict the unfolded result
      () => {
        const cutX = rand(15, 55), cutY = rand(15, 75), cutSize = 20;
        const svg = svgBox(SR(20, 20, 60, 120, "#2a1a5e", 2) + SR(20 + cutX, 20 + cutY, cutSize, cutSize, "#2a1a5e", 1.5, "#ff6b4a"), 160, 160);
        const correctDesc = "A matching cut-out appears in mirror-image position on the right half too";
        const decoys = ["The cut only appears once, on the left half only", "A matching cut-out appears in the SAME (non-mirrored) position on the right half", "Two cuts appear, both on the left half", "The cut disappears when unfolded"];
        const { options, correctIndex } = buildMCStr(correctDesc, decoys);
        return { q: `A square of paper is folded in half vertically (left onto right). A small square is cut out near the fold, as shown. What does the paper look like when unfolded?`, options, correctIndex, svg,
          hint: "This is a paper folding and cutting question. When paper is folded and then cut, the scissors go through both layers at once. Unfolding reverses the fold, so the cut-out appears on both halves — but mirrored, because the second layer was flipped over when the paper was folded. Imagine unfolding it step by step.",
          solution: {
            scenario: `Paper is folded in half (left onto right) and a square is cut near the fold. Predict the result when unfolded.`,
            idea: "Folding paper brings two layers together. Cutting through both layers simultaneously makes a hole in each layer. Unfolding reverses the fold, placing the two holes on opposite sides of the fold line — mirror images of each other, not copies in the same position.",
            method: ["Note where the cut is relative to the fold.", "The cut goes through both layers simultaneously.", "Unfolding produces mirror-image holes on both halves."],
            steps: [
              "The paper is folded so the left half lies on top of the right half.",
              "The cut goes through both layers — making a hole in each.",
              "Unfolding places one hole on the left and its mirror image on the right.",
              `Correct description: ${correctDesc}.`
            ],
            check: "The fold line acts as a line of symmetry — one cut always makes a symmetric pair of holes."
          }
        };
      },
      // (b) complete a repeating 2x2 colour tile pattern
      () => {
        const colors = ["#ff6b4a", "#22c8b8", "#ffc93c", "#7c5cff"];
        const colorNames = { "#ff6b4a": "orange", "#22c8b8": "teal", "#ffc93c": "yellow", "#7c5cff": "purple" };
        const pattern = shuffle(colors);
        const gridSize = 4, cellSize = 35, ox = 30, oy = 20;
        const missingR = rand(0, 3), missingC = rand(0, 3);
        const colorAt = (r, c) => pattern[(r % 2) * 2 + (c % 2)];
        let s = "";
        for (let r = 0; r < gridSize; r++) for (let c = 0; c < gridSize; c++) {
          const isMissing = r === missingR && c === missingC;
          s += SR(ox + c * cellSize, oy + r * cellSize, cellSize, cellSize, "#2a1a5e", 1.5, isMissing ? "#fff" : colorAt(r, c));
          if (isMissing) s += ST(ox + c * cellSize + cellSize / 2, oy + r * cellSize + cellSize / 2 + 5, "?", "middle", 18, "#2a1a5e", 800);
        }
        const svg = svgBox(s, 280, 220);
        const answerColor = colorAt(missingR, missingC);
        const ans = colorNames[answerColor];
        const decoyPool = [...colors.filter((c) => c !== answerColor).map((c) => colorNames[c]), "white", "black"];
        const { options, correctIndex } = buildMCStr(ans, decoyPool.slice(0, 4));
        return { q: `The grid shows a repeating 2×2 colour pattern, with one square missing (marked "?"). What colour should replace the "?"?`, options, correctIndex, svg,
          hint: "This is a repeating pattern question. The colours repeat in a 2×2 tile — meaning every 2 rows and every 2 columns, the pattern starts again. To find a missing cell, look at the cells around it that are in the same position within the repeating block. The missing cell must match the colour that belongs to that position in the tile.",
          solution: {
            scenario: `A 4×4 grid uses a repeating 2×2 colour tile pattern. One cell is missing. Find the correct colour.`,
            idea: "A repeating 2×2 pattern means every pair of rows repeats the same arrangement, and every pair of columns repeats too. Any cell's colour depends only on whether it is in an odd or even row, and an odd or even column — not on its exact position in the grid.",
            method: ["Note the row and column of the missing cell.", "Find another cell in the same position within the 2×2 tile (same odd/even row, same odd/even column).", "Its colour matches the missing cell."],
            steps: [
              `The missing cell is in Row ${missingR + 1}, Column ${missingC + 1}.`,
              `Its position in the repeating tile: row parity ${missingR % 2}, column parity ${missingC % 2}.`,
              `The colour at this tile position is ${ans}.`
            ],
            check: `Other cells at matching positions (same row parity, same column parity) are all ${ans}. ✓`
          }
        };
      },
      // (c) faces/edges/vertices of a 3D shape
      () => {
        const shapes = [{ name: "cube", faces: 6, edges: 12, vertices: 8 }, { name: "triangular prism", faces: 5, edges: 9, vertices: 6 }, { name: "square-based pyramid", faces: 5, edges: 8, vertices: 5 }, { name: "cuboid", faces: 6, edges: 12, vertices: 8 }, { name: "tetrahedron (triangular pyramid)", faces: 4, edges: 6, vertices: 4 }];
        const shape = pick(shapes);
        const askWhat = pick(["faces", "edges", "vertices"]);
        const answer = shape[askWhat];
        const decoys = [shape.faces, shape.edges, shape.vertices, answer + 1].filter((x) => x !== answer);
        const { options, correctIndex } = buildMC(answer, decoys);
        return { q: `How many ${askWhat} does a ${shape.name} have?`, options, correctIndex,
          hint: "This is a 3D shape properties question. Three-dimensional shapes are described by three counts: faces (the flat surfaces), edges (the lines where two faces meet) and vertices (the corners where edges meet). Learn the key ones: a cube has 6 faces, 12 edges and 8 vertices; a triangular prism has 5 faces, 9 edges and 6 vertices; a square-based pyramid has 5 faces, 8 edges and 5 vertices.",
          solution: {
            scenario: `Count the ${askWhat} of a ${shape.name}.`,
            idea: "A face is a flat surface. An edge is a straight line where two faces meet. A vertex (plural: vertices) is a corner point where edges meet. Every 3D shape has fixed counts for all three — learn the key shapes by heart.",
            method: ["Identify the 3D shape.", "Recall its face, edge and vertex counts.", "Pick the count for what's asked."],
            steps: [
              `A ${shape.name} has ${shape.faces} face${shape.faces === 1 ? "" : "s"}, ${shape.edges} edge${shape.edges === 1 ? "" : "s"} and ${shape.vertices} ${shape.vertices === 1 ? "vertex" : "vertices"}.`,
              `The question asks for ${askWhat}: ${answer}.`
            ],
            check: `Euler's rule for convex shapes: faces + vertices − edges = 2. Check: ${shape.faces} + ${shape.vertices} − ${shape.edges} = ${shape.faces + shape.vertices - shape.edges}. ✓`
          }
        };
      },
    ];
    const tier2 = [
      // (a) rotation-vs-reflection recognition (die-corner chirality)
      () => {
        const [l1, l2, l3] = shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3);
        const ref = [l1, l2, l3];
        const rot1 = [ref[1], ref[2], ref[0]];
        const rot2 = [ref[2], ref[0], ref[1]];
        const mirror1 = [ref[0], ref[2], ref[1]];
        const mirrorRot1 = [mirror1[1], mirror1[2], mirror1[0]];
        const mirrorRot2 = [mirror1[2], mirror1[0], mirror1[1]];
        const fmt = (a) => a.join(", ");
        const validRot = pick([rot1, rot2]);
        const ans = fmt(validRot);
        const decoys = [fmt(mirror1), fmt(mirrorRot1), fmt(mirrorRot2), "None of these could be the same corner"];
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `A die's corner shows ${fmt(ref)} reading clockwise. Which of these could be the SAME corner, just rotated (not flipped/mirrored)?`, options, correctIndex,
          hint: "This is a rotation versus reflection question. Rotating an object — turning it round without picking it up — keeps everything in the same clockwise or anticlockwise order. Reflecting (flipping) reverses that order, like a mirror image. To tell rotation from reflection, check whether the sequence of numbers reads clockwise in the same order, just starting from a different place. If so, it's a rotation. If the order is reversed, it's a reflection.",
          solution: {
            scenario: `A die corner shows the sequence ${fmt(ref)} reading clockwise. Decide which option is the same corner rotated (not flipped).`,
            idea: "A rotation keeps the clockwise reading order intact — the numbers go in the same direction, just shifted to start from a different one. A reflection reverses the order — what was clockwise becomes anticlockwise. So a valid rotation of ${fmt(ref)} is any cyclic shift: the same numbers, same order, different starting point.",
            method: ["List the cyclic rotations of the original sequence.", "Check each option: does it match a cyclic rotation?", "Pick the one that does."],
            steps: [
              `Original: ${fmt(ref)} (clockwise).`,
              `Cyclic rotations: ${fmt(rot1)} and ${fmt(rot2)}.`,
              `Reflections (order reversed): ${fmt(mirror1)}, ${fmt(mirrorRot1)}, ${fmt(mirrorRot2)}.`,
              `The valid rotation is ${ans}.`
            ],
            check: `${ans} has the same clockwise order as ${fmt(ref)}, just starting from a different number. ✓`
          }
        };
      },
      // (b) match piece-areas that sum to a target total
      () => {
        const targetArea = rand(20, 60);
        const p0 = rand(5, targetArea - 5);
        const validPair = [p0, targetArea - p0];
        if (validPair[1] <= 0) return null;
        const pairs = [validPair];
        let tries = 0;
        while (pairs.length < 5 && tries < 80) {
          tries++;
          const p1 = rand(3, targetArea + 10), p2 = rand(3, targetArea + 10);
          if (p1 + p2 === targetArea) continue;
          if (pairs.some((p) => p[0] === p1 && p[1] === p2)) continue;
          pairs.push([p1, p2]);
        }
        if (pairs.length < 5) return null;
        const ans = `${validPair[0]} cm² and ${validPair[1]} cm²`;
        const decoys = pairs.filter((p) => p !== validPair).map((p) => `${p[0]} cm² and ${p[1]} cm²`);
        const { options, correctIndex } = buildMCStr(ans, decoys.slice(0, 4));
        return { q: `A rectangle with total area ${targetArea} cm² is cut into two pieces. Which of these pairs of piece-areas could be the two pieces?`, options, correctIndex,
          hint: "This is a find the valid partition question. When a shape is cut into two pieces, the two piece-areas must add up to the original total area. Test each pair of numbers by adding them together — the pair that adds up to the given total is the answer.",
          solution: {
            scenario: `A rectangle with area ${targetArea} cm² is cut into two pieces. Find the pair of areas that could be the two pieces.`,
            idea: "Cutting a shape into pieces doesn't change the total area — the two pieces together must equal the whole. So the correct pair of areas must add up to exactly ${targetArea} cm².",
            method: ["Note the total area.", "Test each option by adding the two piece-areas.", "The pair that sums to the total is correct."],
            steps: [
              `Total area = ${targetArea} cm².`,
              `${validPair[0]} + ${validPair[1]} = ${targetArea}. ✓`,
              `Answer: ${validPair[0]} cm² and ${validPair[1]} cm².`
            ],
            check: `${validPair[0]} + ${validPair[1]} = ${targetArea}. The other options don't add up to ${targetArea}. ✓`
          }
        };
      },
      // (c) counting unit cubes in a larger cube
      () => {
        const n = rand(2, 5);
        const total = n * n * n;
        const decoys = [n * n, n * 3, total + 1, total - 1].filter((x) => x !== total && x > 0);
        const { options, correctIndex } = buildMC(total, decoys);
        return { q: `A large cube is built from small unit cubes: ${n} cubes long, ${n} wide and ${n} high. How many small cubes make up the large cube?`, options, correctIndex,
          hint: "This is a counting cubes in 3D question. To count how many small cubes fill a larger rectangular box (or cube), multiply the three measurements together: length × width × height. This gives the total volume in unit cubes.",
          solution: {
            scenario: `A cube is ${n} long, ${n} wide and ${n} high. Count the total number of small unit cubes.`,
            idea: "The number of unit cubes filling a rectangular block is found by multiplying its three dimensions together: length × width × height. For a cube, all three dimensions are equal, so the answer is n × n × n (called n cubed).",
            method: ["Read the three dimensions.", "Multiply: length × width × height."],
            steps: [
              `Dimensions: ${n} × ${n} × ${n}.`,
              `Total = ${n} × ${n} × ${n} = ${total} small cubes.`
            ],
            check: `${n}³ = ${total}. A cube with side ${n} always contains ${total} unit cubes. ✓`
          }
        };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 15) { guard++; result = pick(bank)(); }
    return result || G.spatialPuzzles(d);
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
  { n: 1,  name: "The First Crow",      emoji: "🐦", need: 3,  lore: "A scruffy young crow who stole fruit out of turn because he'd stopped trusting the whistle. Not evil, just frightened, and the first to notice something was wrong." },
  { n: 2,  name: "Old Roughweather",    emoji: "🌫️", need: 6,  lore: "Row Two's scarecrow, whistling 'about forty' instead of an exact count. Rounding felt kind, until three short pears a day added up to a family going hungry." },
  { n: 3,  name: "Widdershins",         emoji: "🌀", need: 10, lore: "A small mischievous wind who unpicks finished sums for fun, spiralling the wrong way round the sundial. Nobody ever told him undoing was for anything." },
  { n: 4,  name: "Scratch",             emoji: "🎃", need: 15, lore: "Row One's own scarecrow, the first to forget, because he alone was taught his numbers straight from the founding scarecrow's mouth, not passed down the row." },
  { n: 5,  name: "The Maybe-Flock",     emoji: "🐤", need: 21, lore: "A directionless swarm of finches who gave up counting themselves and started guessing, so a lost brother could never be told apart from loads." },
  { n: 6,  name: "Strawless",           emoji: "🌾", need: 28, lore: "A scarecrow whose ten counted bundles came apart into a shapeless heap, because he'd forgotten what a single bundle was even supposed to be." },
  { n: 7,  name: "The Murder",          emoji: "🐦‍⬛", need: 40, lore: "Nine thousand frightened crows, drawn to the fading counting-song, terrified not of being many but of being uncountable, endless, with no far side." },
  { n: 8,  name: "Hollow Bough",        emoji: "🕳️", need: 55, lore: "A bough at the orchard's heart with nothing hanging on it at all — not a wrong count, but the one honest nought kept on purpose, in honour of the very first fruit." },
  { n: 9,  name: "The Nearly",          emoji: "✨", need: 75, lore: "A shy, apologetic little presence who quietly shorts every basket near the heart by exactly one, and cannot see why 'nearly right' isn't the same as right." },
  { n: 10, name: "The First Scarecrow", emoji: "🌳", need: 90, lore: "The founding scarecrow itself, planted with the Ninefold Tree a century ago, worn down to almost nothing at all. Not a monster to defeat, but a century of counting asking, gently, to be allowed to rest." },
];
// Kangaroo-only: gentle early gates, tougher late, spread across all 10 levels since there's no Challenge/Olympiad band split.
// Levels 1-8: Primary Kangaroo, gating starts at 8/25 and climbs by 2 each level.
// Levels 9-10: a "JMC Level 1" stretch band, previewing real JMC-style difficulty
// using Primary's own generators (buildPaper's difficulty schedule for any kind
// other than "jmc"/"kangaroo" is already the hardest of the three, same mechanism
// Junior's own "year9" stretch band relies on) — the mark resets down to 10 then
// climbs to 12, matching the same "resets lower when a harder kind begins" pattern
// Junior uses at its own kind boundaries (jmc->kangaroo->year9).
export const PRIMARY_EXAM_PASS_MARKS = { 1: 8, 2: 10, 3: 12, 4: 14, 5: 16, 6: 18, 7: 20, 8: 22, 9: 10, 10: 12 };
export const PRIMARY_examKindFor = (lv) => (lv <= 8 ? "kangaroo" : "jmc1");
export const PRIMARY_EXAM_NAMES = { kangaroo: "Primary Kangaroo", jmc1: "JMC Level 1 (stretch)" };
// No adventures exist yet for Primary, so no upgrade bonus is achievable — base rarity strengths only.
// 12*1 (commons) + 5*2 (uncommons) + 5*4 (rares) + 6*8 (epics) + 2*16 (legendaries) = 122.
export const PRIMARY_MAX_STRENGTH_TOTAL = 122;
// Stats order matches STAT_DEFS: [Arithmetic, Geometry, Logic, Science, Speed]
export const PRIMARY_CARDS = [
  // ---- COMMON (12) ----
  { id: "pip",         name: "Pip",         emoji: "🌰", r: "common", s: [6,1,3,1,2], flavor: "Counts every seed in the orchard, twice, just to be sure." },
  { id: "nine",        name: "Nine",        emoji: "🐦‍⬛", r: "common", s: [2,1,2,1,7], flavor: "Can count to nine perfectly. Ten is still a bit much." },
  { id: "bramble",     name: "Bramble",     emoji: "🦔", r: "common", s: [2,1,7,2,1], flavor: "Never accepts an answer without checking it three ways." },
  { id: "sorrel",      name: "Sorrel",      emoji: "🐭", r: "common", s: [5,2,2,2,2], flavor: "Keeps her acorns in stacks of ten. Always exactly ten." },
  { id: "russet",      name: "Russet",      emoji: "🐞", r: "common", s: [2,6,2,2,1], flavor: "Has exactly the same number of spots on each wing. She checks." },
  { id: "halfpenny",   name: "Halfpenny",   emoji: "🐦", r: "common", s: [4,2,3,2,2], flavor: "Never takes more than her fair half." },
  { id: "wicker",      name: "Wicker",      emoji: "🕷️", r: "common", s: [1,6,2,2,2], flavor: "Every strand of her web is the same angle apart." },
  { id: "furrow",      name: "Furrow",      emoji: "🦫", r: "common", s: [1,5,2,1,4], flavor: "Digs every tunnel dead straight, or not at all." },
  { id: "dapple",      name: "Dapple",      emoji: "🦌", r: "common", s: [2,2,6,2,1], flavor: "Her spots follow a pattern nobody else has noticed yet." },
  { id: "bushel",      name: "Bushel",      emoji: "🐻", r: "common", s: [5,1,2,3,2], flavor: "Never picks a berry more or less than a full bushel." },
  { id: "tuppence",    name: "Tuppence",    emoji: "🐿️", r: "common", s: [4,1,4,2,2], flavor: "Won't trade unless the numbers add up exactly." },
  { id: "windfall",    name: "Windfall",    emoji: "🦉", r: "common", s: [1,1,2,4,5], flavor: "Always right about which apple falls next. Nobody knows how." },
  // ---- UNCOMMON (5) ----
  { id: "cornix",      name: "Cornix",      emoji: "🐦‍⬛", r: "uncommon", s: [6,2,6,3,4], flavor: "Knows the flock's exact number, even while it's flying." },
  { id: "thistlewick", name: "Thistlewick", emoji: "🎃", r: "uncommon", s: [4,4,5,4,4], flavor: "Learning to whistle every number exactly right." },
  { id: "beeswax",     name: "Beeswax",     emoji: "🐝", r: "uncommon", s: [7,2,4,6,2], flavor: "Counts every bee in the hive before breakfast." },
  { id: "kernel",      name: "Kernel",      emoji: "🌽", r: "uncommon", s: [6,7,3,3,2], flavor: "Sees every field as rows times columns." },
  { id: "millrace",    name: "Millrace",    emoji: "💧", r: "uncommon", s: [3,3,4,7,4], flavor: "Knows exactly how fast the water should run." },
  // ---- RARE (5) ----
  { id: "cobweb",      name: "Cobweb",      emoji: "🕸️", r: "rare", s: [3,8,4,4,3], flavor: "Her webs repeat the same pattern, smaller and smaller." },
  { id: "amberly",     name: "Amberly",     emoji: "✨", r: "rare", s: [3,3,7,6,3], flavor: "Blinks in a pattern you can always predict, if you count carefully." },
  { id: "barrow",      name: "Barrow",      emoji: "🦡", r: "rare", s: [7,3,8,2,2], flavor: "Keeps the only ledger in the orchard that's never once been wrong." },
  { id: "driftwood",   name: "Driftwood",   emoji: "🐦", r: "rare", s: [3,7,6,3,3], flavor: "Never wades in deeper than exactly one leg's length." },
  { id: "gable",       name: "Gable",       emoji: "🦉", r: "rare", s: [4,3,6,6,3], flavor: "Knows exactly which day of the week any date will fall on." },
  // ---- EPIC (6) ----
  { id: "warden",      name: "Warden",      emoji: "🧑‍🌾", r: "epic", s: [8,6,8,6,6], flavor: "The steadiest whistle in the orchard. Hasn't missed a number in sixty years." },
  { id: "harvestmoon", name: "Harvestmoon", emoji: "🦉", r: "epic", s: [6,6,8,8,6], flavor: "Only opens her eyes once a year — the night everything must be counted." },
  { id: "ninebark",    name: "Ninebark",    emoji: "🌳", r: "epic", s: [8,7,9,6,4], flavor: "Remembers every harvest the orchard has ever had, in order." },
  { id: "cascade",     name: "Cascade",     emoji: "💦", r: "epic", s: [8,6,6,9,5], flavor: "Says she's counted every drop. Nobody has ever caught her wrong." },
  { id: "longshadow",  name: "Longshadow",  emoji: "🦊", r: "epic", s: [6,6,7,8,7], flavor: "Tells the time from his own shadow, to the minute." },
  { id: "gossamer",    name: "Gossamer",    emoji: "🦋", r: "epic", s: [5,9,6,6,8], flavor: "Flies the same spiral every single night, never a wingbeat off." },
  // ---- LEGENDARY (2) ----
  { id: "ninefoldtree", name: "The Ninefold Tree",   emoji: "🌳", r: "legendary", s: [9,9,9,9,9],  flavor: "Every bough has borne fruit in the same pattern for a hundred years." },
  { id: "tenthscarecrow", name: "The Tenth Scarecrow", emoji: "🌱", r: "legendary", s: [10,8,10,8,9], flavor: "Nine scarecrows kept the count for a hundred years. Then there were ten." },
];
export const PRIMARY_ACADEMY = [];
export const PRIMARY_NAMES_COMMON = ["Pip", "Nine", "Bramble", "Sorrel", "Russet", "Halfpenny", "Wicker", "Furrow", "Dapple", "Bushel", "Tuppence", "Windfall"];
export const PRIMARY_NAMES_RARE = ["Cornix", "Thistlewick", "Beeswax", "Kernel", "Millrace", "Cobweb", "Amberly", "Barrow", "Driftwood", "Gable"];
export const PRIMARY_NAMES_EPIC = ["Warden", "Harvestmoon", "Ninebark", "Cascade", "Longshadow", "Gossamer"];
export const PRIMARY_NAMES_LEGENDARY = ["The Ninefold Tree", "The Tenth Scarecrow"];
