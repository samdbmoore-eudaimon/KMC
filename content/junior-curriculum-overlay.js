const CORE_SOURCES = {
  placeValue: ["countIntegers", "cryptarith", "digitDetective", "customCount", "estimation"],
  numberProperties: ["countIntegers", "modular", "digitDetective", "repeatOp", "productOpt"],
  integerDecimalArithmetic: ["multiExpr", "workBackwards", "clockArith", "estimation", "numberMachine"],
  expressionsEquations: ["multiExpr", "systemWord", "workBackwards", "numberMachine", "magicGrid"],
  coordGeom: ["coordGeom", "spatialTransform", "midpointSquare", "pythagQuest", "networkGraph"],
  perimeterArea: ["compoundPerimeter", "poolPath", "trianglesInRect", "midpointSquare", "partitionRect"],
  fractionUnusual: ["fractionUnusual", "ratioChain", "workBackwards", "multiExpr", "moneyTrail"],
  ratioChain: ["ratioChain", "multiRate", "inverseProp", "moneyTrail", "epicJourney"],
  transformations: ["spatialTransform", "shapeFold", "coordGeom", "tiling", "cubeProps"],
  estimation: ["estimation", "multiExpr", "clockArith", "multiRate", "moneyTrail"],
  sequences: ["customCount", "repeatOp", "bouncing", "modular", "numberMachine"],
  linearEquations: ["systemWord", "agePuzzle", "sportScore", "workBackwards", "numberMachine"],
  percentProportion: ["ratioChain", "inverseProp", "multiRate", "moneyTrail", "epicJourney"],
  statisticsMeasures: ["meanPuzzle", "sportScore", "allocation", "estimation", "moneyTrail"],
  areaVolume: ["cubeProps", "compoundPerimeter", "poolPath", "tiling", "partitionRect"],
  polygons: ["angleParallel", "angleIso", "angleRhombus", "shapeFold", "tiling"],
  similarityPythagoras: ["pythagQuest", "coordGeom", "midpointSquare", "trianglesInRect", "poolPath"],
  nonLinearRelations: ["bouncing", "productOpt", "repeatOp", "customCount", "numberMachine"],
};

const META = {
  placeValue: ["Place value across the number line", 1, [{ module: "primary", key: "placeValue" }, { module: "primary", key: "decimalPlaceValue" }]],
  numberProperties: ["Number properties: factors, powers and remainders", 2, [{ module: "primary", key: "factorsMultiplesPrimes" }]],
  integerDecimalArithmetic: ["Arithmetic with integers and decimals", 3, [{ module: "primary", key: "negativeNumbers" }, { module: "primary", key: "decimalPlaceValue" }]],
  expressionsEquations: ["Expressions and equations", 4, ["integerDecimalArithmetic"]],
  coordGeom: ["Coordinates in four quadrants", 5, [{ module: "primary", key: "shapeProperties" }]],
  perimeterArea: ["Perimeter and area reasoning", 6, [{ module: "primary", key: "areaPerimeter" }]],
  fractionUnusual: ["Fraction arithmetic", 7, [{ module: "primary", key: "fractionArithmetic" }]],
  ratioChain: ["Multiplicative relationships: fractions and ratio", 8, [{ module: "primary", key: "ratioBasics" }]],
  transformations: ["Transformations and symmetry", 9, ["coordGeom", { module: "primary", key: "symmetryReflection" }]],
  estimation: ["Estimation, rounding and bounds", 10, ["integerDecimalArithmetic"]],
  sequences: ["Sequences and rules", 11, [{ module: "primary", key: "sequencePattern" }, "expressionsEquations"]],
  linearEquations: ["Solving linear equations", 13, ["expressionsEquations"]],
  percentProportion: ["Percentages and proportionality", 14, ["fractionUnusual", "ratioChain"]],
  statisticsMeasures: ["Statistical representations and measures", 15, [{ module: "primary", key: "statistics" }]],
  areaVolume: ["Perimeter, area and volume", 17, ["perimeterArea"]],
  polygons: ["Geometrical properties: polygons", 18, [{ module: "primary", key: "angleBasics" }]],
  similarityPythagoras: ["Similarity and Pythagoras", 20, ["polygons", "transformations"]],
  nonLinearRelations: ["Non-linear relationships", 22, ["sequences", "linearGraphs"]],
};

const CUSTOM_META = {
  linearGraphs: ["Graphical representations of linear relationships", 12, ["coordGeom", "expressionsEquations"]],
  statisticsAnalysis: ["Statistical analysis", 16, ["statisticsMeasures"]],
  constructions: ["Geometric constructions", 19, ["polygons"]],
  probability: ["Probability and sample spaces", 21, ["fractionUnusual", "statisticsMeasures"]],
  expressionsFormulae: ["Expressions and formulae", 23, ["linearEquations"]],
  trigonometry: ["Right-angled trigonometry", 24, ["similarityPythagoras"]],
  standardForm: ["Standard form", 25, ["numberProperties", "integerDecimalArithmetic"]],
  graphicalRepresentations: ["Interpreting non-linear and contextual graphs", 26, ["linearGraphs", "nonLinearRelations"]],
};

const LOGIC = ["truthLiars", "seating", "pigeonhole", "allocation", "magicGrid", "gridLogic", "networkGraph"];

function validExample(example) {
  return example && example.q && Array.isArray(example.steps) && example.steps.length && example.answer !== undefined;
}

function sourceExamples(lesson) {
  const result = [];
  for (const section of lesson?.sections || []) {
    for (const example of section.examples || []) if (validExample(example)) result.push(example);
    if (section.tryit?.q && section.tryit?.answer) result.push({ q: section.tryit.q, steps: ["Identify the information and the required result.", "Apply the method developed in this section.", "Check that the result satisfies the original conditions."], answer: section.tryit.answer });
  }
  return result;
}

function fourFrom(pool, start, structureId) {
  if (!pool.length) throw new Error(`No examples available for ${structureId}`);
  return Array.from({ length: 4 }, (_, i) => ({ ...pool[(start + i) % pool.length], structureId, difficulty: i + 1 }));
}

function consolidate(lessons, topic, sources, meta) {
  const [title, order, prereq] = meta;
  const sections = [];
  sources.forEach((source, sourceIndex) => {
    const original = lessons[source];
    if (!original) return;
    const pool = sourceExamples(original);
    const candidates = (original.sections || []).filter((section) => Array.isArray(section.body) && section.body.length);
    const take = source === topic ? Math.min(3, candidates.length) : Math.min(1, candidates.length);
    for (let i = 0; i < take; i++) {
      const section = candidates[i];
      sections.push({
        h: `${sections.length + 1}. ${String(section.h || section.heading || original.title).replace(/^\d+\.\s*/, "")}`,
        body: section.body,
        note: section.note,
        examples: fourFrom(pool, i * 4, `${topic}_route_${sourceIndex + 1}_${source}`),
      });
    }
  });
  lessons[topic] = {
    title,
    order,
    prereq,
    minutes: Math.max(18, Math.min(32, sections.length * 4)),
    intro: `${title} is part of the connected Key Stage 3 curriculum. This lesson brings together related methods that were previously separated into narrow puzzle types. Learn the underlying relationship first, then recognise it in direct questions, stories, diagrams and unfamiliar UKMT-style settings.`,
    sections,
    recap: ["Name the mathematical relationship before calculating.", "Choose a representation that makes the structure visible.", "Explain each step and check the result against the original conditions."],
    mistakes: ["Recognising a familiar story but applying the wrong underlying method.", "Treating larger numbers as harder mathematics without checking the reasoning demand.", "Giving an answer without checking units, signs, scale or constraints."],
  };
}

const labels = {
  linearGraphs: ["gradient from two points", "substitution in y = mx + c", "gradient and intercept", "linear modelling", "intersections"],
  statisticsAnalysis: ["comparing distributions", "median and range", "outliers", "frequency tables", "sampling"],
  constructions: ["perpendicular bisectors", "angle bisectors", "perpendicular distance", "constructing triangles", "intersecting loci"],
  probability: ["single events", "complements", "combined events", "sets and Venn diagrams", "expected frequency"],
  expressionsFormulae: ["collecting like terms", "expanding brackets", "factorising", "substitution", "rearranging formulae"],
  trigonometry: ["naming the sides", "sine", "cosine", "tangent", "similarity and ratios"],
  standardForm: ["large numbers", "small numbers", "multiplication", "division", "comparison"],
  graphicalRepresentations: ["journey graphs", "gradient as a rate", "reciprocal graphs", "quadratic graphs", "intersections"],
};

const CUSTOM_TEACHING = {
  linearGraphs: [
    ["A gradient describes how much the vertical value changes for each one-unit horizontal change. Begin with two points and draw the horizontal and vertical steps between them.", "The gradient is change in y divided by change in x. Keeping the changes in the same direction protects the sign: a line falling from left to right has a negative gradient.", "Before using a formula, say in words what one unit of x does to y. That sentence gives the gradient a meaning rather than leaving it as an isolated number."],
    ["The rule y = mx + c is a compact description of a straight line. The letter m is the gradient and c is the value of y when x is zero.", "To find a point, substitute the chosen x-value and keep the multiplication visible before adding the intercept. This prevents the common mistake of adding x directly to c.", "A table of two or three values is a useful bridge between the equation and the graph. Every row of the table should satisfy the same equation."],
    ["The y-intercept is where the line crosses the vertical axis. Every point on that axis has x = 0, so substituting zero leaves only c.", "The gradient and intercept play different jobs. The intercept chooses the starting height; the gradient controls the repeated change.", "Reading both features lets you sketch a line and compare two relationships without calculating many separate points."],
    ["Many constant-rate stories have a fixed starting amount and an amount added for each unit. That is the same structure as y = mx + c.", "Name the input and output with units. The rate becomes m, while the amount present when the input is zero becomes c.", "After calculating, interpret the coordinate in the story. A number without its hours, kilometres or tokens has lost part of its meaning."],
    ["At an intersection, two relationships give the same output for the same input. This is why their y-expressions may be set equal.", "Solve the resulting equation for x, then substitute that x-value into either original rule to find the shared y-value.", "Finally check the point in both rules. An intersection belongs to both graphs, so one failed substitution exposes an error."],
  ],
  statisticsAnalysis: [
    ["Two data sets can share the same mean but have very different spreads. Compare a measure of centre and a measure of spread before describing which set is more consistent.", "A smaller range means the extreme values are closer together, although range alone says nothing about the values between the extremes.", "Use comparative language carefully: say what is larger or smaller and what that suggests, rather than claiming that one set is simply 'better'."],
    ["The median is the middle value after ordering, while the range is the distance from smallest to largest. Ordering is not optional because position defines the median.", "For an even number of values, the median lies halfway between the two central values. The range still uses only the two extremes.", "Write the ordered list first, circle the central position and mark the endpoints. This makes three different jobs visible."],
    ["An outlier is a value far from most of the data. It enters the total used by the mean, so it can pull the mean strongly towards itself.", "The median depends mainly on order and is often less affected. That does not make the median automatically best: the choice depends on the question and the shape of the data.", "Compare the measure before and after adding the outlier. The change, not a memorised slogan, explains the effect."],
    ["A frequency table compresses repeated values. The frequency tells us how many copies of a value contribute to the total.", "Multiply each value by its frequency, add those products and divide by the total frequency. Dividing by the number of rows would ignore repeated observations.", "Check that the mean lies between the smallest and largest values and is pulled towards values with greater frequency."],
    ["A sample is useful only when it represents the population named in the question. Ask who had a chance to be selected and who was excluded.", "Random selection reduces personal choice, while sampling across relevant groups prevents one year, club or location from dominating.", "A large biased sample can still mislead. Size helps precision only after the selection method is fair."],
  ],
  constructions: [
    ["Every point on the perpendicular bisector of a segment is equally distant from the segment's two endpoints. The construction creates that complete set of possible points.", "Draw equal-radius arcs from both endpoints, using a radius large enough for the arcs to cross. The line through the intersections is perpendicular and passes through the midpoint.", "The compass radius need not equal the segment length, but it must stay unchanged for both endpoints."],
    ["Every point on an angle bisector is equally distant from the two sides of the angle. This property, not visual halving, makes the construction exact.", "First mark equal distances along both arms. Then draw equal arcs from those marks and join their intersection to the original vertex.", "Check by measuring perpendicular distance to the two arms or by folding mentally along the bisector."],
    ["The distance from a point to a line is the shortest possible connecting length. That shortest connector meets the line at a right angle.", "Use an arc centred at the point to mark two places on the line, then construct the perpendicular bisector of the marked segment.", "The resulting perpendicular passes through the original point because that point is equally distant from the two marked places."],
    ["Three side lengths fix a triangle only when the two shorter lengths add to more than the longest. Check this triangle inequality before drawing.", "Draw one side as a base. Arcs with the other two side lengths locate the possible third vertex at their intersection.", "A reflected triangle on the other side of the base is congruent, not a genuinely different set of side lengths."],
    ["A locus is the full set of points satisfying one condition. When a point must satisfy two conditions, it lies where the two loci intersect.", "Translate each sentence separately: fixed distance from a point gives a circle, equal distance from two points gives a perpendicular bisector and fixed distance from a line gives parallel lines.", "Check every intersection against every original condition. A point on only one locus is not a solution."],
  ],
  probability: [
    ["Probability compares favourable outcomes with all equally likely outcomes. Define the experiment and its possible outcomes before writing a fraction.", "Count each outcome once. The numerator counts outcomes matching the event; the denominator counts the complete equally likely sample space.", "A probability of zero is impossible and one is certain, so every answer must lie between them."],
    ["An event and its complement cover every possibility without overlapping. Their probabilities therefore add to one.", "Write one as a fraction with the same denominator, then subtract the known probability. Keep the event labels visible so that the complement is not confused with an unrelated outcome.", "Add the event and complement probabilities at the end. The sum must be exactly one."],
    ["For two-stage experiments, a list, table or tree prevents missing and duplicated outcomes. Start with the first result, then attach every possible second result.", "When all final outcomes are equally likely, count the ones satisfying the combined event. If branch probabilities differ, multiply along each route instead.", "Check the sample-space size using the multiplication principle: first-stage choices multiplied by second-stage choices."],
    ["Venn diagrams separate 'A only', 'B only', 'both' and 'neither'. The overlap belongs to both sets but is still one group of objects.", "For A or B, combine the non-overlapping regions once each. If starting from totals for A and B, subtract one copy of the overlap because it was counted twice.", "Add every region, including neither when appropriate, and compare with the population total."],
    ["Expected frequency predicts a long-run count from a probability. It is not a promise about one short experiment.", "Multiply the probability by the number of trials, keeping the units as expected occurrences.", "Compare the result with the trial total. An expected count cannot exceed the number of trials, and repeated experiments should fluctuate around it."],
  ],
  expressionsFormulae: [
    ["Like terms describe the same kind of quantity, such as x and x or square metres and square metres. Their numerical coefficients can be combined.", "Keep unlike terms separate. The constant term has no x, so it cannot merge with an x-term.", "Check by substituting a simple value such as x = 2 into the original and simplified expressions."],
    ["Expanding removes brackets by multiplying the outside factor by every term inside. The bracket represents a complete group, not only its first item.", "Draw arrows from the factor to each term or use an area model. Record each product before simplifying.", "Factorising the result should rebuild the original bracket, giving a reliable reverse check."],
    ["Factorising is the reverse of expanding. Look for the greatest factor shared by every term.", "Place the shared factor outside the bracket and divide each original term by it to create the bracket contents.", "Expand the factorised form immediately. If any original term is missing, the factorisation is incomplete."],
    ["Substitution replaces a symbol with a particular value while preserving operation order. Use brackets around a negative replacement.", "Write the expression again with the value inserted before calculating. This separates translation from arithmetic.", "Estimate the sign and size first, then compare with the calculated value."],
    ["Making a subject means isolating one symbol while preserving equality. Treat the equation like a balanced scale.", "Undo operations in reverse order and perform the same inverse operation on both sides. Show the balance rather than saying a term 'moves'.", "Substitute a test value into both forms. They should describe the same relationship."],
  ],
  trigonometry: [
    ["The names opposite and adjacent depend on the chosen angle. The hypotenuse is fixed: it is opposite the right angle and is the longest side.", "Mark the chosen angle first, then touch each side and name its role. Do this before selecting a trigonometric ratio.", "Check that the hypotenuse is never called adjacent, even though it physically touches the chosen angle."],
    ["Sine connects the side opposite the chosen angle with the hypotenuse. The relationship is sin θ = opposite ÷ hypotenuse.", "Label the two relevant sides, substitute their lengths and solve the one-step equation. Keep the ratio below or equal to one.", "A longer opposite side should produce a larger sine value for an acute angle."],
    ["Cosine connects the side adjacent to the chosen angle with the hypotenuse. The relationship is cos θ = adjacent ÷ hypotenuse.", "Use the non-hypotenuse side touching the angle as adjacent. Substitute only after all three sides have been named.", "The cosine ratio for an acute angle lies between zero and one, which checks the division order."],
    ["Tangent connects opposite and adjacent without using the hypotenuse. The relationship is tan θ = opposite ÷ adjacent.", "Choose tangent when those two sides are known or required. Rearrange the ratio carefully if the unknown is in the denominator.", "Use the relative side lengths to predict whether the tangent is below, equal to or above one."],
    ["All right triangles sharing an acute angle are similar, so their corresponding side ratios match. Trigonometry records those permanent ratios.", "Use a known triangle to identify the scale factor, then multiply every corresponding side by the same factor.", "Divide corresponding sides to confirm one common scale factor throughout the triangle."],
  ],
  standardForm: [
    ["Standard form writes a large number as a coefficient from 1 up to, but not including, 10 multiplied by a power of ten.", "Move the decimal until one non-zero digit remains before it. Count the places moved to find the positive exponent.", "Expand the power of ten and move the decimal back to recover the original number."],
    ["Small positive numbers use negative powers because each step to the right of the decimal divides by ten.", "Move the decimal right until the coefficient is between 1 and 10. The number of moves becomes the magnitude of the negative exponent.", "A negative exponent does not make the number negative; it describes repeated division by ten."],
    ["When multiplying standard-form numbers, multiply coefficients and add exponents because powers of ten multiply.", "After the calculation, normalise the coefficient. Moving its decimal one place left increases the exponent by one.", "Estimate the order of magnitude before calculating so an exponent error becomes visible."],
    ["When dividing standard-form numbers, divide coefficients and subtract the divisor's exponent from the dividend's exponent.", "Normalise only after completing both parts. Keep coefficient work and exponent work on separate lines.", "Multiply the quotient by the divisor to reconstruct the dividend."],
    ["To compare standard-form numbers, compare exponents first. A larger exponent usually decides the greater positive number.", "If exponents match, compare coefficients. If they do not, rewrite one number with a common power when a close comparison is helpful.", "Expand a rough ordinary-number version to check the order."],
  ],
  graphicalRepresentations: [
    ["A journey graph uses one axis for time and another for distance or position. Every segment describes what happened during an interval.", "A rising segment means the measured distance increased, a horizontal segment means it stayed unchanged and a falling segment means it decreased.", "Read both endpoint coordinates and describe the event with units rather than saying only 'the line goes up'."],
    ["Gradient on a contextual graph represents a rate: change in the vertical quantity for each horizontal unit.", "Choose two clear points, calculate both changes and divide with units attached.", "Use the story to decide whether a steeper gradient should mean faster, more expensive or some other greater rate."],
    ["A reciprocal graph describes an inverse relationship such as y = k/x. Increasing one positive variable makes the other decrease.", "Use a value table to see that equal increases in x do not cause equal decreases in y. This changing rate creates a curve.", "Multiply corresponding x and y values. Their constant product checks the inverse relationship."],
    ["A quadratic graph changes direction at a turning point and is often U-shaped or upside-down U-shaped.", "Use symmetry to connect pairs of x-values with equal y-values and identify the axis through the turning point.", "Substitute values on both sides of the axis to check the symmetry rather than trusting a sketch."],
    ["An intersection is a coordinate satisfying two relationships at once. Its x-value is the shared input and its y-value is the shared output.", "Read or calculate both coordinates and interpret them in the context of both graphs.", "Substitute the x-value into both relationships. They must produce the same y-value."],
  ],
};

function customExample(topic, family, i) {
  const id = `${topic}_${["interpret", "calculate", "represent", "apply", "reason"][family]}`;
  const a = i + 2, b = i + 3;
  if (topic === "linearGraphs") {
    if (family === 0) return { structureId: id, q: `A line passes through (1, ${a + 1}) and (3, ${3 * a + 1}). Find its gradient.`, steps: [`Change in y = ${3*a+1} - ${a+1} = ${2*a}.`, "Change in x = 3 - 1 = 2.", `Gradient = ${2*a} ÷ 2 = ${a}.`], answer: `${a}.` };
    if (family === 1) return { structureId: id, q: `For y = ${a}x + ${b}, find y when x = ${i + 1}.`, steps: [`Substitute x = ${i+1}.`, `${a} × ${i+1} + ${b} = ${a*(i+1)+b}.`], answer: `${a*(i+1)+b}.` };
    if (family === 2) return { structureId: id, q: `State the gradient and y-intercept of y = ${a}x - ${b}.`, steps: ["Compare with y = mx + c.", `m = ${a} and c = -${b}.`], answer: `Gradient ${a}; intercept -${b}.` };
    if (family === 3) return { structureId: id, q: `A cart costs ${b} tokens plus ${a} tokens per hour. Find the cost for ${i+4} hours.`, steps: [`Variable cost = ${a} × ${i+4} = ${a*(i+4)}.`, `Add the fixed ${b}: ${a*(i+4)} + ${b} = ${a*(i+4)+b}.`], answer: `${a*(i+4)+b} tokens.` };
    return { structureId: id, q: `The lines y = ${a}x + 1 and y = ${a+1}x - ${i+1} intersect. Find x.`, steps: ["Set the y-values equal.", `${a}x + 1 = ${a+1}x - ${i+1}.`, `Subtract ${a}x and add ${i+1}: x = ${i+2}.`], answer: `x = ${i+2}.` };
  }
  if (topic === "statisticsAnalysis") {
    if (family === 0) return { structureId: id, q: `Set A has mean ${a+5} and range ${b}. Set B has mean ${a+5} and range ${b+4}. Which is more consistent?`, steps: ["The means are equal, so compare spread.", `Set A has the smaller range: ${b} < ${b+4}.`, "A smaller range means the values are more tightly grouped."], answer: "Set A." };
    if (family === 1) return { structureId: id, q: `Find the median and range of ${a}, ${a+2}, ${a+5}, ${a+8}, ${a+10}.`, steps: ["The data are ordered; the third value is the median.", `Median = ${a+5}.`, `Range = ${a+10} - ${a} = 10.`], answer: `Median ${a+5}; range 10.` };
    if (family === 2) return { structureId: id, q: `The data ${a}, ${a+1}, ${a+2}, ${a+3} gain the outlier ${a+30}. Which average is affected most?`, steps: ["The outlier enters the total used by the mean.", "It does not become the middle value.", "Therefore the mean is pulled much farther than the median."], answer: "The mean." };
    if (family === 3) return { structureId: id, q: `A value ${a} occurs twice and ${b} occurs three times. Find the mean.`, steps: [`Total = 2 × ${a} + 3 × ${b} = ${2*a+3*b}.`, "There are 5 values.", `Mean = ${2*a+3*b} ÷ 5 = ${(2*a+3*b)/5}.`], answer: `${(2*a+3*b)/5}.` };
    return { structureId: id, q: "Explain why asking only members of the athletics club about exercise habits is biased.", steps: ["Identify who has been included.", "Athletics-club members are more likely to exercise than the whole school.", "The sample therefore over-represents active pupils."], answer: "It is not representative of the whole school." };
  }
  if (topic === "constructions") {
    const qs = [
      ["What property does every point on a perpendicular bisector have?", "It is equally distant from the segment's endpoints."],
      ["What property does every point on an angle bisector have?", "It is equally distant from the two sides of the angle."],
      ["Why is a perpendicular used for the distance from a point to a line?", "It gives the shortest distance."],
      ["Can side lengths 3 cm, 4 cm and 8 cm form a triangle?", "No, because 3 + 4 is less than 8."],
      ["How do you locate points 5 cm from A and equally distant from B and C?", "Intersect the circle centred at A with the perpendicular bisector of BC."],
    ];
    const steps = [
      ["The two endpoints are the fixed reference points.", "Draw equal-radius arcs from both endpoints so that the arcs cross above and below the segment.", "Join the arc intersections. Every point on this line is equally distant from the endpoints."],
      ["The two arms of the angle are the fixed reference lines.", "Mark equal distances along the arms, then draw equal-radius arcs from those marks.", "Join the new arc intersection to the angle's vertex. Points on this line are equally distant from the arms."],
      ["Distance to a line is measured along the shortest route.", "The shortest segment from a point to a line meets the line at 90°.", "Therefore construct a perpendicular through the point and measure along it."],
      ["Test the triangle inequality before drawing: the two shorter sides must add to more than the longest.", "Here 3 + 4 = 7, which is less than 8.", "The two shorter sides cannot meet, so the triangle cannot be constructed."],
      ["Being 5 cm from A gives a circle with centre A and radius 5 cm.", "Being equally distant from B and C gives the perpendicular bisector of BC.", "Points satisfying both conditions are the intersections of that circle and perpendicular bisector."],
    ][family];
    return { structureId: id, q: qs[family][0], steps, answer: qs[family][1] };
  }
  if (topic === "probability") {
    if (family === 0) return { structureId: id, q: `A bag has ${a} red and ${b} blue counters. Find P(red).`, steps: [`Total counters = ${a+b}.`, `${a} favourable outcomes are red.`, `Probability = ${a}/${a+b}.`], answer: `${a}/${a+b}.` };
    if (family === 1) return { structureId: id, q: `P(win) = ${a}/10. Find P(not win).`, steps: ["Complementary probabilities total 1.", `10/10 - ${a}/10 = ${10-a}/10.`], answer: `${10-a}/10.` };
    if (family === 2) return { structureId: id, q: "Two coins are tossed. Find P(exactly one head).", steps: ["List HH, HT, TH and TT.", "HT and TH are favourable: 2 of 4.", "Simplify 2/4."], answer: "1/2." };
    if (family === 3) return { structureId: id, q: `${a} pupils choose A only, ${b} choose B only and ${i+1} choose both. How many choose A or B?`, steps: ["The union contains the three non-overlapping regions.", `${a} + ${b} + ${i+1} = ${a+b+i+1}.`], answer: `${a+b+i+1}.` };
    return { structureId: id, q: `An event has probability 1/${a}. Find its expected frequency in ${a*20} trials.`, steps: ["Expected frequency = probability × trials.", `1/${a} × ${a*20} = 20.`], answer: "20." };
  }
  if (topic === "expressionsFormulae") {
    if (family === 0) return { structureId: id, q: `Simplify ${a}x + ${b}x - 2.`, steps: ["The x terms are like terms.", `${a} + ${b} = ${a+b}.`, "Keep the constant separate."], answer: `${a+b}x - 2.` };
    if (family === 1) return { structureId: id, q: `Expand ${a}(x + ${b}).`, steps: [`Multiply x by ${a}: ${a}x.`, `Multiply ${b} by ${a}: ${a*b}.`], answer: `${a}x + ${a*b}.` };
    if (family === 2) return { structureId: id, q: `Factorise ${a*b}x + ${a}.`, steps: [`Both terms contain ${a}.`, `Divide each term by ${a}.`], answer: `${a}(${b}x + 1).` };
    if (family === 3) return { structureId: id, q: `Find ${a}x + ${b} when x = ${i+1}.`, steps: [`Substitute ${i+1}.`, `${a} × ${i+1} + ${b} = ${a*(i+1)+b}.`], answer: `${a*(i+1)+b}.` };
    return { structureId: id, q: `Make x the subject of y = ${a}x + ${b}.`, steps: [`Subtract ${b}: y - ${b} = ${a}x.`, `Divide by ${a}.`], answer: `x = (y - ${b})/${a}.` };
  }
  if (topic === "trigonometry") {
    const qs = [
      ["State the sine ratio for angle θ in a right triangle.", "sin θ = opposite/hypotenuse."],
      ["A 3-4-5 right triangle has side 3 opposite θ. Find sin θ.", "3/5."],
      ["A 5-12-13 right triangle has side 12 adjacent to θ. Find cos θ.", "12/13."],
      ["A 8-15-17 right triangle has side 8 opposite and 15 adjacent to θ. Find tan θ.", "8/15."],
      [`A triangle similar to a 3-4-5 triangle has hypotenuse ${5*a}. Find the corresponding shortest side.`, `${3*a}.`],
    ];
    const steps = [
      ["Find the right angle first. The side opposite it is the hypotenuse.", "Now look from angle θ. The side across from θ is opposite; the remaining shorter side touching θ is adjacent.", "Sine compares opposite with hypotenuse, so sin θ = opposite ÷ hypotenuse."],
      ["In a 3-4-5 triangle, the hypotenuse is 5 because it is the longest side opposite the right angle.", "The side opposite θ is given as 3.", "Use sine: sin θ = opposite ÷ hypotenuse = 3 ÷ 5 = 3/5."],
      ["The hypotenuse is 13 because it is opposite the right angle.", "The side adjacent to θ is given as 12.", "Use cosine: cos θ = adjacent ÷ hypotenuse = 12 ÷ 13 = 12/13."],
      ["The question identifies the opposite side as 8 and the adjacent side as 15.", "Tangent is the ratio using those two sides.", "tan θ = opposite ÷ adjacent = 8 ÷ 15 = 8/15."],
      [`The original 3-4-5 triangle has hypotenuse 5; the similar triangle has hypotenuse ${5*a}.`, `The scale factor is ${5*a} ÷ 5 = ${a}.`, `The shortest side corresponds to 3, so it becomes 3 × ${a} = ${3*a}.`],
    ][family];
    return { structureId: id, q: qs[family][0], steps, answer: qs[family][1] };
  }
  if (topic === "standardForm") {
    const exp = i + 3;
    if (family === 0) return { structureId: id, q: `Write ${a * 10 ** exp} in standard form.`, steps: [`Move the decimal ${exp} places left to obtain ${a}.`, `Compensate with 10^${exp}.`], answer: `${a} × 10^${exp}.` };
    if (family === 1) return { structureId: id, q: `Write ${(a * 10 ** -exp).toFixed(exp)} in standard form.`, steps: [`Move the decimal ${exp} places right to obtain ${a}.`, "A small number uses a negative power."], answer: `${a} × 10^-${exp}.` };
    if (family === 2) return { structureId: id, q: `Calculate (${a} × 10²) × (${b} × 10³).`, steps: [`Multiply coefficients: ${a} × ${b} = ${a*b}.`, "Add powers: 2 + 3 = 5.", a*b >= 10 ? `Renormalise ${a*b} × 10⁵.` : "The coefficient is already in range."], answer: a*b >= 10 ? `${a*b/10} × 10⁶.` : `${a*b} × 10⁵.` };
    if (family === 3) return { structureId: id, q: `Calculate (${a*b} × 10⁶) ÷ (${b} × 10²).`, steps: [`Divide coefficients: ${a*b} ÷ ${b} = ${a}.`, "Subtract powers: 6 - 2 = 4."], answer: `${a} × 10⁴.` };
    return { structureId: id, q: `Which is larger: ${a} × 10⁵ or ${b} × 10⁴?`, steps: [`Rewrite ${b} × 10⁴ as ${b/10} × 10⁵.`, `Compare ${a} with ${b/10}.`], answer: `${a} × 10⁵.` };
  }
  const graphExamples = [
    ["A distance-time graph is horizontal for ten minutes. Interpret this section.", "The traveller is stationary."],
    [`A graph rises ${a*b} km in ${b} hours. Find its gradient.`, `${a} km/h.`],
    ["Describe the positive branch of y = 12/x as x increases.", "It falls quickly, then approaches zero."],
    [`State the turning point of y = (x - ${a})² - ${b}.`, `(${a}, -${b}).`],
    [`Two graphs meet at (${a}, ${b}). Interpret the intersection.`, `Both relationships have output ${b} when the input is ${a}.`],
  ];
  const graphSteps = [
    ["A horizontal segment has no vertical change while time continues to pass.", "No change in distance means the traveller is not moving during that interval.", "Describe the event as stationary, not merely as a flat line."],
    [`The vertical change is ${a*b} km and the horizontal change is ${b} hours.`, `Gradient = change in distance ÷ change in time = ${a*b} ÷ ${b}.`, `The gradient is ${a} km/h, which is the speed represented by the segment.`],
    ["For y = 12/x, increasing x makes the quotient smaller.", "Equal increases in x produce smaller and smaller falls in y.", "The positive branch therefore falls quickly and then approaches, but never reaches, zero."],
    [`The equation is in completed-square form y = (x - ${a})² - ${b}.`, `The squared part is smallest when x = ${a}, because it then equals zero.`, `At x = ${a}, y = -${b}, so the turning point is (${a}, -${b}).`],
    [`At an intersection, both graphs share the coordinate (${a}, ${b}).`, `The shared input is ${a} and the shared output is ${b}.`, `So both relationships have output ${b} when their input is ${a}.`],
  ][family];
  return { structureId: id, q: graphExamples[family][0], steps: graphSteps, answer: graphExamples[family][1] };
}

function customLesson(topic, meta) {
  const [title, order, prereq] = meta;
  return {
    title,
    order,
    prereq,
    minutes: 24,
    intro: `${title} develops a statutory Key Stage 3 idea that was missing from the former puzzle-led Junior catalogue. The five sections move between interpretation, calculation, representation, application and justification so that the method transfers to unfamiliar questions.`,
    sections: labels[topic].map((label, family) => ({
      h: `${family + 1}. ${label[0].toUpperCase()}${label.slice(1)}`,
      body: CUSTOM_TEACHING[topic]?.[family] || [`This section develops ${label}. Begin by identifying the quantities and representation, then choose the relationship that connects them.`, "Write one justified line at a time. A correct method should explain why the calculation or conclusion follows, not merely state an answer.", "At higher difficulty the same idea may be combined with another representation, an unknown value or a constraint."],
      examples: Array.from({ length: 4 }, (_, i) => ({ ...customExample(topic, family, i), difficulty: i + 1 })),
    })),
    recap: ["Identify the representation and the relationship it shows.", "Choose a method before substituting values.", "Check the result against the graph, construction, probability bound or algebraic condition."],
    mistakes: ["Reading a diagram by appearance instead of using its mathematical properties.", "Using a formula without identifying what each value represents.", "Stopping at a numerical answer without interpreting it."],
  };
}

function logicLesson(lessons, topic, order) {
  const original = lessons[topic];
  const pool = sourceExamples(original);
  const candidates = (original?.sections || []).filter((section) => Array.isArray(section.body) && section.body.length);
  lessons[topic] = {
    ...original,
    order,
    logicExtension: true,
    mockFrom: 7,
    intro: `${original?.intro || "This is a UKMT logic topic."} It remains available for learning and practice because this reasoning appears in UKMT papers. It joins the regular mock rotation from Level 7 and is not part of the Olympiad bank.`,
    sections: Array.from({ length: 5 }, (_, family) => {
      const source = candidates[family % Math.max(1, candidates.length)] || {};
      return { h: `${family + 1}. ${String(source.h || source.heading || `Reasoning route ${family + 1}`).replace(/^\d+\.\s*/, "")}`, body: source.body || ["Organise the possibilities, apply every condition and check that only the claimed answer survives."], examples: fourFrom(pool, family * 4, `${topic}_logic_route_${family + 1}`) };
    }),
  };
}

export function applyJuniorCurriculumOverlay(lessons) {
  for (const [topic, sources] of Object.entries(CORE_SOURCES)) consolidate(lessons, topic, sources, META[topic]);
  for (const [topic, meta] of Object.entries(CUSTOM_META)) lessons[topic] = customLesson(topic, meta);
  LOGIC.forEach((topic, index) => logicLesson(lessons, topic, 27 + index));
}
