const CORE_SOURCE_MAP = {
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

const CUSTOM_TOPICS = ["linearGraphs", "statisticsAnalysis", "constructions", "probability", "expressionsFormulae", "trigonometry", "standardForm", "graphicalRepresentations"];

const STORY = ["Addy", "Countra", "Tri-Tip", "Cubble", "Hunchik", "Sparkfin", "Zoomby", "Pebble", "Loopy", "Burrowl"];

function finishNumeric(h, q, correct, decoys, solution, extra = {}) {
  const tidy = (value) => Number(Number(value).toFixed(4));
  const answer = tidy(correct);
  const choices = [...new Set(decoys.filter(Number.isFinite).map(tidy))].filter((value) => value !== answer);
  for (let offset = 1; choices.length < 4; offset++) {
    const candidate = tidy(answer + offset * (Math.abs(answer) >= 10 ? 2 : 1));
    if (candidate !== answer && !choices.includes(candidate)) choices.push(candidate);
  }
  const built = h.buildMC(answer, choices.slice(0, 4));
  return { q, ...built, solution: solution.map(cleanText), ...extra };
}

function finishString(h, q, correct, decoys, solution, extra = {}) {
  const answer = cleanText(correct);
  const choices = [...new Set(decoys.map(cleanText))].filter((value) => value !== answer);
  for (const fallback of ["Cannot be determined", "No valid value", "More than one answer", "None of these"]) {
    if (choices.length >= 4) break;
    if (fallback !== answer && !choices.includes(fallback)) choices.push(fallback);
  }
  const built = h.buildMCStr(answer, choices.slice(0, 4));
  return { q: cleanText(q), ...built, solution: solution.map(cleanText), ...extra };
}

function cleanText(value) {
  return String(value).replace(/-?\d+\.\d{5,}/g, (match) => String(Number(Number(match).toFixed(4))));
}

function rotatingGenerator(registry, h) {
  const nextByDifficulty = {};
  return (difficulty) => {
    const ids = Object.keys(registry).filter((id) => registry[id].difficulties.includes(difficulty));
    const next = nextByDifficulty[difficulty] ?? h.rand(0, ids.length - 1);
    const id = ids[next % ids.length];
    nextByDifficulty[difficulty] = (next + 1) % ids.length;
    return { ...h.pickStructure({ [id]: registry[id] }, difficulty), difficulty };
  };
}

function customQuestionBase(topic, family, d, h) {
  const nm = h.pick(STORY);
  if (topic === "linearGraphs") {
    if (family === 0) {
      const m = h.rand(d >= 3 ? -5 : 1, 6), x1 = h.rand(-3, 2), step = h.rand(1, 4), x2 = x1 + step, y1 = h.rand(-5, 8), y2 = y1 + m * step;
      return finishNumeric(h, `A straight line passes through (${x1}, ${y1}) and (${x2}, ${y2}). What is its gradient?`, m, [m + 1, m - 1, step, y2 - y1], [`Change in y = ${y2} - ${y1} = ${y2 - y1}.`, `Change in x = ${x2} - ${x1} = ${step}.`, `Gradient = change in y ÷ change in x = ${m}.`], { representation: "diagram" });
    }
    if (family === 1) {
      const m = h.rand(d >= 3 ? -5 : 1, 6), c = h.rand(-8, 8), x = h.rand(-4, 7), y = m * x + c;
      return finishNumeric(h, `For the line y = ${m}x ${c < 0 ? "- " + Math.abs(c) : "+ " + c}, find y when x = ${x}.`, y, [y + m, y - m, m + c, x + c], [`Substitute x = ${x}.`, `y = ${m} × ${x} ${c < 0 ? "- " + Math.abs(c) : "+ " + c}.`, `Therefore y = ${y}.`], { representation: "direct" });
    }
    if (family === 2) {
      const m = h.rand(d >= 3 ? -5 : 1, 6), c = h.rand(-9, 9);
      return finishNumeric(h, `What is the y-intercept of y = ${m}x ${c < 0 ? "- " + Math.abs(c) : "+ " + c}?`, c, [m, -c, c + m, 0], ["The y-intercept is the value of y when x = 0.", `Substitute x = 0: y = ${m} × 0 ${c < 0 ? "- " + Math.abs(c) : "+ " + c}.`, `The line crosses the y-axis at ${c}.`], { representation: "diagram" });
    }
    if (family === 3) {
      const start = h.rand(2, 8), per = h.rand(2, 7), units = h.rand(3, 12), total = start + per * units;
      return finishNumeric(h, `${nm} hires a 9fo cart for ${start} tokens plus ${per} tokens per hour. What is the cost for ${units} hours?`, total, [per * units, start * units, total + per, total - start], [`The fixed intercept is ${start}.`, `The changing part is ${per} × ${units} = ${per * units}.`, `Total = ${start} + ${per * units} = ${total} tokens.`], { representation: "story" });
    }
    const m1 = h.rand(1, 4), m2 = m1 + h.rand(1, 4), x = h.rand(1, 6), c1 = h.rand(0, 6), c2 = c1 + (m1 - m2) * x;
    return finishNumeric(h, `The lines y = ${m1}x + ${c1} and y = ${m2}x ${c2 < 0 ? "- " + Math.abs(c2) : "+ " + c2} intersect. What is the x-coordinate of the intersection?`, x, [x + 1, x - 1, m2 - m1, c1 - c2], [`At the intersection the y-values are equal.`, `${m1}x + ${c1} = ${m2}x ${c2 < 0 ? "- " + Math.abs(c2) : "+ " + c2}.`, `Rearranging gives x = ${x}.`], { representation: "direct" });
  }

  if (topic === "statisticsAnalysis") {
    if (family === 0) {
      const a = h.rand(6, 15), b = a + h.rand(1, 6), shift = d >= 3 ? h.rand(2, 5) : 0;
      return finishString(h, `Orchard A has mean ${a} and Orchard B has mean ${b}. Every value in A is increased by ${shift}. Which mean is now greater?`, a + shift > b ? "Orchard A" : a + shift < b ? "Orchard B" : "They are equal", ["Orchard A", "Orchard B", "They are equal", "Not enough information", "Both means become 0"], [`Adding ${shift} to every value raises A's mean by ${shift}.`, `A's new mean is ${a + shift}; B's remains ${b}.`, `Compare ${a + shift} with ${b}.`], { representation: "story" });
    }
    if (family === 1) {
      const values = [h.rand(2, 5), h.rand(6, 9), h.rand(10, 13), h.rand(14, 17), h.rand(18, 24)].sort((a, b) => a - b), med = values[2], range = values[4] - values[0];
      return finishString(h, `For the ordered data ${values.join(", ")}, what are the median and range?`, `${med} and ${range}`, [`${values[1]} and ${range}`, `${med} and ${values[4]}`, `${values.reduce((a,b)=>a+b,0)/5} and ${range}`, `${values[2]} and ${values[4]-values[1]}`], [`The middle of five ordered values is the third: ${med}.`, `Range = largest - smallest = ${values[4]} - ${values[0]} = ${range}.`], { representation: "direct" });
    }
    if (family === 2) return finishString(h, "One unusually large value is added to a data set. Which statement is always true?", "The range cannot decrease", ["The median must double", "The mode must increase", "The mean cannot change", "The range must stay equal"], ["A new value larger than the old maximum either increases the maximum or equals a new maximum.", "The minimum does not rise, so maximum - minimum cannot get smaller.", "The mean may rise, while the median and mode may or may not change."], { representation: "direct" });
    if (family === 3) {
      const x1 = h.rand(1, 4), x2 = x1 + 2, f1 = h.rand(2, 5), f2 = h.rand(2, 5), mean = (x1*f1+x2*f2)/(f1+f2);
      return finishNumeric(h, `A frequency table has ${f1} values equal to ${x1} and ${f2} values equal to ${x2}. What is the mean?`, mean, [x1+x2, (x1+x2)/2, mean+1, mean-1], [`Total = ${x1} × ${f1} + ${x2} × ${f2} = ${x1*f1+x2*f2}.`, `Frequency = ${f1+f2}.`, `Mean = ${x1*f1+x2*f2} ÷ ${f1+f2} = ${mean}.`], { representation: "diagram" });
    }
    return finishString(h, "Which survey is most likely to give an unbiased estimate of how all pupils travel to school?", "Randomly sample pupils from every year group", ["Ask only the cycling club", "Ask the first ten pupils at the bike racks", "Ask only Year 7", "Ask pupils who volunteer online"], ["A representative sample must give every relevant group a fair chance to appear.", "Sampling randomly from every year group reduces selection bias.", "The other methods over-represent a particular type of pupil."], { representation: "story" });
  }

  if (topic === "constructions") {
    const construction = [
      ["perpendicular bisector", "points equally distant from the two ends of a segment"],
      ["angle bisector", "points equally distant from the two sides of an angle"],
      ["perpendicular from a point", "the shortest distance from the point to the line"],
      ["SSS triangle construction", "a triangle fixed by three side lengths"],
      ["locus intersection", "points satisfying two construction conditions at once"],
    ][family];
    const q = family < 3 ? `What does a ${construction[0]} identify?` : family === 3 ? "Which information determines one triangle up to reflection?" : "How do you find points that are 4 cm from A and equally distant from B and C?";
    const correct = family < 3 ? construction[1] : family === 3 ? "Three valid side lengths" : "Intersect a circle centred at A with the perpendicular bisector of BC";
    const decoys = family < 3 ? ["the longest route", "all parallel lines", "the area of a circle", "only the midpoint of an angle"] : family === 3 ? ["One side length", "Two angles only", "The perimeter only", "One angle only"] : ["Draw only the circle", "Draw only line BC", "Measure the diagram by eye", "Draw any parallel line"];
    return finishString(h, q, correct, decoys, [`The construction must encode every condition in the question.`, `${construction[0]} represents ${construction[1]}.`, `The required result is ${correct}.`], { representation: "diagram" });
  }

  if (topic === "probability") {
    if (family === 0) {
      const red = h.rand(2, 7), blue = h.rand(2, 7), total = red + blue;
      return finishString(h, `A bag has ${red} red and ${blue} blue counters. What is P(red)?`, `${red}/${total}`, [`${blue}/${total}`, `1/${total}`, `${red}/100`, `${total}/${red}`], [`There are ${total} equally likely counters.`, `${red} are red.`, `P(red) = ${red}/${total}.`], { representation: "story" });
    }
    if (family === 1) {
      const n = h.rand(1, 8), den = 10;
      return finishString(h, `P(rain) = ${n}/${den}. What is P(no rain)?`, `${den-n}/${den}`, [`${n}/${den}`, `${den}/${n}`, `1/${n}`, `${den-n}/100`], ["An event and its complement have total probability 1.", `P(no rain) = ${den}/${den} - ${n}/${den} = ${den-n}/${den}.`], { representation: "direct" });
    }
    if (family === 2) return finishString(h, "Two fair coins are tossed. What is the probability of exactly one head?", "1/2", ["1/4", "3/4", "1/3", "2/3"], ["List HH, HT, TH, TT.", "Exactly one head occurs in HT and TH: 2 outcomes out of 4.", "2/4 = 1/2."], { representation: "diagram" });
    if (family === 3) {
      const both = h.rand(2, 5), aOnly = h.rand(2, 6), bOnly = h.rand(2, 6), total = both+aOnly+bOnly;
      return finishNumeric(h, `In a group, ${aOnly} choose apples only, ${bOnly} choose berries only and ${both} choose both. How many choose apples or berries?`, total, [aOnly+bOnly, total+both, both, aOnly], [`The union includes apples only, berries only and both.`, `${aOnly} + ${bOnly} + ${both} = ${total}.`], { representation: "diagram" });
    }
    const pNum = h.rand(1, 4), trials = 20 * h.rand(3, 8), expected = trials * pNum / 5;
    return finishNumeric(h, `An event has probability ${pNum}/5. In ${trials} trials, what is its expected frequency?`, expected, [trials/5, expected+5, expected-5, trials*pNum], [`Expected frequency = probability × number of trials.`, `${pNum}/5 × ${trials} = ${expected}.`, "This is a long-run expectation, not a guarantee."], { representation: "story" });
  }

  if (topic === "expressionsFormulae") {
    const a = h.rand(2, 7), b = h.rand(2, 7), c = h.rand(1, 8);
    if (family === 0) return finishString(h, `Simplify ${a}x + ${b}x - ${c}.`, `${a+b}x - ${c}`, [`${a*b}x - ${c}`, `${a+b-c}x`, `${a+b}x + ${c}`, `${a}x + ${b-c}`], [`${a}x and ${b}x are like terms.`, `Add their coefficients: ${a} + ${b} = ${a+b}.`, `The constant -${c} remains separate.`], { representation: "direct" });
    if (family === 1) return finishString(h, `Expand ${a}(x + ${b}).`, `${a}x + ${a*b}`, [`${a}x + ${b}`, `x + ${a*b}`, `${a+b}x`, `${a*b}x`], [`Multiply every term inside the bracket by ${a}.`, `${a} × x = ${a}x and ${a} × ${b} = ${a*b}.`], { representation: "direct" });
    if (family === 2) return finishString(h, `Factorise ${a*b}x + ${a*c}.`, `${a}(${b}x + ${c})`, [`${a}(${b+c}x)`, `${b}(${a}x + ${c})`, `${a*b}(x + ${c})`, `${a}(x + ${b+c})`], [`Both terms share factor ${a}.`, `Divide each term by ${a}: ${a*b}x ÷ ${a} = ${b}x and ${a*c} ÷ ${a} = ${c}.`, `So the expression is ${a}(${b}x + ${c}).`], { representation: "direct" });
    if (family === 3) {
      const x = h.rand(-4, 8), ans = a*x+b;
      return finishNumeric(h, `Find ${a}x + ${b} when x = ${x}.`, ans, [a+b+x, a*(x+b), ans+a, ans-b], [`Substitute ${x} for x.`, `${a} × ${x} + ${b} = ${ans}.`], { representation: "story" });
    }
    return finishString(h, `Make x the subject of y = ${a}x + ${b}.`, `x = (y - ${b})/${a}`, [`x = y/${a} - ${b}`, `x = (y + ${b})/${a}`, `x = ${a}(y - ${b})`, `x = y - ${a+b}`], [`Subtract ${b} from both sides: y - ${b} = ${a}x.`, `Divide both sides by ${a}.`, `x = (y - ${b})/${a}.`], { representation: "direct" });
  }

  if (topic === "trigonometry") {
    const triples = [[3,4,5],[5,12,13],[8,15,17]], [opp,adj,hyp] = h.pick(triples);
    if (family === 0) return finishString(h, "Relative to an angle θ in a right-angled triangle, which ratio is sin θ?", "opposite/hypotenuse", ["adjacent/hypotenuse", "opposite/adjacent", "hypotenuse/opposite", "adjacent/opposite"], ["SOH is the sine relationship.", "Sine = Opposite ÷ Hypotenuse.", "The side names are relative to the chosen angle."], { representation: "diagram" });
    if (family === 1) return finishString(h, `A right triangle has opposite side ${opp} and hypotenuse ${hyp}. What is sin θ?`, `${opp}/${hyp}`, [`${adj}/${hyp}`, `${opp}/${adj}`, `${hyp}/${opp}`, `${adj}/${opp}`], ["Use SOH: sin θ = opposite/hypotenuse.", `sin θ = ${opp}/${hyp}.`], { representation: "diagram" });
    if (family === 2) return finishString(h, `A right triangle has adjacent side ${adj} and hypotenuse ${hyp}. What is cos θ?`, `${adj}/${hyp}`, [`${opp}/${hyp}`, `${opp}/${adj}`, `${hyp}/${adj}`, `${adj}/${opp}`], ["Use CAH: cos θ = adjacent/hypotenuse.", `cos θ = ${adj}/${hyp}.`], { representation: "diagram" });
    if (family === 3) return finishString(h, `A right triangle has opposite side ${opp} and adjacent side ${adj}. What is tan θ?`, `${opp}/${adj}`, [`${adj}/${opp}`, `${opp}/${hyp}`, `${adj}/${hyp}`, `${hyp}/${opp}`], ["Use TOA: tan θ = opposite/adjacent.", `tan θ = ${opp}/${adj}.`], { representation: "diagram" });
    const scale = h.rand(2, d + 3);
    return finishNumeric(h, `A triangle similar to a ${opp}-${adj}-${hyp} right triangle has hypotenuse ${hyp*scale}. What is the side corresponding to ${opp}?`, opp*scale, [adj*scale, opp+scale, hyp, opp*scale+1], [`The scale factor is ${hyp*scale} ÷ ${hyp} = ${scale}.`, `Corresponding side = ${opp} × ${scale} = ${opp*scale}.`, "Trigonometric ratios stay constant in similar right triangles."], { representation: "diagram" });
  }

  if (topic === "standardForm") {
    const a = h.rand(12, 98) / 10, n = h.rand(d >= 3 ? -6 : 2, d >= 3 ? 8 : 6);
    if (family === 0) {
      const value = a * 10 ** Math.max(2, n);
      return finishString(h, `Write ${value.toLocaleString("en-GB", { maximumFractionDigits: 8 })} in standard form.`, `${a} × 10^${Math.max(2,n)}`, [`${a*10} × 10^${Math.max(1,n-1)}`, `${a} × 10^${Math.max(1,n-1)}`, `${a/10} × 10^${Math.max(2,n)}`, `${value} × 10^0`], ["Move the decimal point until the first factor is at least 1 but below 10.", `The decimal moves ${Math.max(2,n)} places.`, `So the number is ${a} × 10^${Math.max(2,n)}.`], { representation: "direct" });
    }
    if (family === 1) {
      const exp = -h.rand(2, 6), value = a * 10 ** exp;
      return finishString(h, `Write ${value.toFixed(Math.abs(exp)+1)} in standard form.`, `${a} × 10^${exp}`, [`${a} × 10^${-exp}`, `${a*10} × 10^${exp}`, `${a/10} × 10^${exp}`, `${value} × 10^0`], ["A small positive number uses a negative power of ten.", `Move the decimal ${Math.abs(exp)} places to obtain ${a}.`, `The answer is ${a} × 10^${exp}.`], { representation: "direct" });
    }
    if (family === 2) {
      const b = h.rand(2, 8), e1 = h.rand(2, 5), e2 = h.rand(2, 5), coeff = a*b, adjust = coeff >= 10 ? 1 : 0, outCoeff = adjust ? coeff/10 : coeff, outExp=e1+e2+adjust;
      return finishString(h, `Calculate (${a} × 10^${e1}) × (${b} × 10^${e2}) in standard form.`, `${outCoeff} × 10^${outExp}`, [`${a+b} × 10^${e1+e2}`, `${outCoeff} × 10^${e1*e2}`, `${coeff} × 10^${e1+e2+1}`, `${outCoeff} × 10^${outExp-1}`], [`Multiply coefficients: ${a} × ${b} = ${coeff}.`, `Add powers: ${e1} + ${e2} = ${e1+e2}.`, `Renormalise so the first factor lies from 1 to 10: ${outCoeff} × 10^${outExp}.`], { representation: "direct" });
    }
    if (family === 3) {
      const b = h.pick([2,4,5]), coeff = a*b, e1=h.rand(3,7), e2=h.rand(1,3);
      return finishString(h, `Calculate (${coeff} × 10^${e1}) ÷ (${b} × 10^${e2}).`, `${a} × 10^${e1-e2}`, [`${a} × 10^${e1+e2}`, `${coeff-b} × 10^${e1-e2}`, `${a} × 10^${e2-e1}`, `${a/b} × 10^${e1-e2}`], [`Divide coefficients: ${coeff} ÷ ${b} = ${a}.`, `Subtract powers: ${e1} - ${e2} = ${e1-e2}.`], { representation: "direct" });
    }
    const b = Math.min(9.9, a + 0.5), e = h.rand(-3, 5);
    return finishString(h, `Which is larger: ${a} × 10^${e} or ${b} × 10^${e-1}?`, `${a} × 10^${e}`, [`${b} × 10^${e-1}`, "They are equal", "Cannot be compared", "Both are zero"], ["Compare powers first: a number with power 10^e is ten times the same coefficient at 10^(e-1).", `Rewrite ${b} × 10^${e-1} as ${b/10} × 10^${e}.`, `${a} is greater than ${b/10}.`], { representation: "direct" });
  }

  if (topic === "graphicalRepresentations") {
    if (family === 0) return finishString(h, `${nm}'s distance-time graph is horizontal from 10:00 to 10:15. What does this mean?`, `${nm} was stationary`, [`${nm} moved at constant speed`, `${nm} returned home`, `${nm} accelerated`, "The distance was zero"], ["A horizontal distance-time segment has no change in distance.", "No change in distance during changing time means zero speed.", `${nm} was stationary.`], { representation: "diagram" });
    if (family === 1) {
      const time=h.rand(2,6), distance=time*h.rand(3,8), speed=distance/time;
      return finishNumeric(h, `A straight distance-time segment rises ${distance} km in ${time} hours. What speed does its gradient represent?`, speed, [distance*time, distance-time, speed+1, time/distance], [`Gradient = change in distance ÷ change in time.`, `${distance} ÷ ${time} = ${speed} km/h.`], { representation: "diagram" });
    }
    if (family === 2) return finishString(h, "Which description matches an inverse relationship y = k/x for positive x?", "y falls quickly, then levels towards zero", ["a straight rising line", "a horizontal line", "a U-shaped parabola", "a vertical line"], ["As x increases, k/x decreases.", "The decreases become smaller, so the curve levels towards zero.", "It never reaches zero for finite positive x."], { representation: "diagram" });
    if (family === 3) {
      const r=h.rand(2,5), min=-(r*r);
      return finishString(h, `The graph y = (x - ${r})² ${min < 0 ? "- " + Math.abs(min) : "+ " + min} has its turning point where?`, `(${r}, ${min})`, [`(0, ${min})`, `(${-r}, ${min})`, `(${r}, 0)`, `(${min}, ${r})`], ["The completed-square form y = (x-a)²+b has turning point (a,b).", `Here a = ${r} and b = ${min}.`], { representation: "diagram" });
    }
    return finishString(h, "Two graphs intersect at (4, 11). What does that point mean?", "Both relationships have value 11 when the input is 4", ["Their gradients are both 4", "Their intercepts are both 11", "They never have equal values", "Both graphs are straight lines"], ["At an intersection, both graphs share the same coordinate.", "The x-coordinate is the common input and the y-coordinate is the common output.", "So both have value 11 when x = 4."], { representation: "diagram" });
  }

  throw new Error(`No custom Junior curriculum builder for ${topic}/${family}`);
}

function customQuestion(topic, family, difficulty, h) {
  const first = customQuestionBase(topic, family, difficulty, h);
  if (difficulty <= 2) return first;
  const parts = [first, customQuestionBase(topic, difficulty === 3 ? family : (family + 1) % 5, difficulty, h)];
  if (difficulty === 4) parts.push(customQuestionBase(topic, (family + 2) % 5, difficulty, h));
  const answers = parts.map((part) => String(part.options[part.correctIndex]));
  const correct = answers.join("; ");
  const decoys = parts.map((part, index) => {
    const altered = answers.slice();
    altered[index] = String(part.options[(part.correctIndex + 1) % part.options.length]);
    return altered.join("; ");
  });
  while (decoys.length < 4) {
    const altered = answers.slice().reverse();
    altered[0] = String(parts[0].options[(parts[0].correctIndex + decoys.length) % parts[0].options.length]);
    decoys.push(altered.join("; "));
  }
  const labels = ["(a)", "(b)", "(c)"];
  const q = `${difficulty === 4 ? "Connect three related ideas" : "Complete both parts"}. ${parts.map((part, index) => `${labels[index]} ${part.q}`).join(" ")} Give the answers in order.`;
  const solution = parts.flatMap((part, index) => [`${labels[index]} ${part.q}`, ...part.solution.map((step) => `${labels[index]} ${step}`)]);
  return finishString(h, q, correct, decoys, solution, { representation: parts.some((part) => part.representation === "diagram") ? "diagram" : parts.some((part) => part.representation === "story") ? "story" : "direct" });
}

function logicQuestion(topic, family, difficulty, h) {
  const n = h.rand(4 + difficulty, 8 + difficulty * 2);
  if (topic === "truthLiars") {
    if (family === 0) return finishNumeric(h, `${n} gatekeepers make one statement each. Exactly one statement is false. How many statements are true?`, n - 1, [n, n - 2, 1, 0], ["Exactly one of the statements is false.", `The other ${n - 1} statements are true.`], { representation: "story" });
    if (family === 1) return finishString(h, "Addy says, 'Countra is lying.' Countra says, 'We are the same type.' If each always tells the truth or always lies, who tells the truth?", "Addy only", ["Countra only", "Both", "Neither", "It cannot be decided"], ["If Addy is truthful, Countra lies.", "Countra's claim that they are the same type is then false, which is consistent.", "The opposite assumption makes Countra's statement contradict itself."], { representation: "story" });
    if (family === 2) return finishString(h, "A creature tells the truth on three specified days and lies on the other four. Today it says, 'I lied yesterday.' What should you do first?", "Test the possible pairs of consecutive day-types", ["Assume today is Monday", "Count the letters in the sentence", "Ignore yesterday", "Assume every statement is true"], ["The statement connects today with yesterday.", "Test truth-day after lie-day and lie-day after truth-day.", "Keep only transitions consistent with what was said."], { representation: "direct" });
    if (family === 3) return finishNumeric(h, `${n} creatures each claim, 'Exactly one of us is lying.' If the claim is true, how many liars are there?`, 1, [0, 2, n - 1, n], ["Treat the shared claim as a condition.", "The condition itself states that the number of liars is exactly 1.", "One liar makes every truthful creature's claim correct."], { representation: "story" });
    return finishString(h, "Three statements are made: P: 'Q is false.' Q: 'R is false.' R: 'P and Q have the same truth value.' Which method is reliable?", "Make a truth table and eliminate inconsistent rows", ["Trust P first", "Count the longest statement", "Assume all three are false", "Choose the middle statement"], ["There are only eight truth-value triples.", "Test each statement against its claimed value.", "Eliminate every row containing a contradiction."], { representation: "diagram" });
  }
  if (topic === "seating") {
    const fact = (x) => Array.from({ length: x }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
    if (family === 0) return finishNumeric(h, `How many orders are possible for ${Math.min(7, 3 + difficulty)} different 9fo creatures in a line?`, fact(Math.min(7, 3 + difficulty)), [fact(Math.min(7, 3 + difficulty) - 1), Math.min(7, 3 + difficulty) ** 2, fact(Math.min(7, 3 + difficulty)) / 2, Math.min(7, 3 + difficulty)], ["Choose the first place, then the second and continue.", "Multiply the decreasing numbers of choices.", `The total is ${Math.min(7, 3 + difficulty)}!.`], { representation: "story" });
    if (family === 1) return finishNumeric(h, `${n} seats are in a row. Addy must sit in the leftmost seat. How many choices remain for Countra's seat?`, n - 1, [n, n - 2, 1, 2], ["Addy's fixed seat is no longer available.", `${n} - 1 = ${n - 1} seats remain for Countra.`], { representation: "diagram" });
    if (family === 2) return finishNumeric(h, `${n} numbered seats form a row. In how many adjacent pairs could Addy and Countra sit?`, n - 1, [n, n - 2, 2 * n, n * (n - 1)], ["The adjacent seat-pairs are (1,2), (2,3) and so on.", `There are ${n - 1} such pairs.`], { representation: "diagram" });
    if (family === 3) return finishNumeric(h, `${Math.min(8, n)} creatures sit around a circular table. Fix Addy's place to remove rotations. How many choices are there for Countra's place?`, Math.min(8, n) - 1, [Math.min(8, n), Math.min(8, n) - 2, 2, 1], ["Rotating everyone together does not make a new circular arrangement.", "Fix Addy as an anchor.", `Countra then has ${Math.min(8, n) - 1} places.`], { representation: "story" });
    return finishString(h, "Four creatures must sit in a row. Addy is left of Countra and Pebble is not at an end. What is the safest method?", "List positions systematically and cross out failures", ["Guess one arrangement", "Ignore the end condition", "Multiply every number mentioned", "Put Addy and Countra together automatically"], ["Use the strongest positional condition first.", "List the remaining cases without duplication.", "Check both conditions against every survivor."], { representation: "direct" });
  }
  if (topic === "pigeonhole") {
    if (family === 0) return finishNumeric(h, `A drawer contains socks in ${n} colours. What is the least number drawn blindly to guarantee two of one colour?`, n + 1, [n, n + 2, 2 * n, 2], [`The worst case gives one sock of each of the ${n} colours.`, `The next sock, number ${n + 1}, must match a colour.`], { representation: "story" });
    if (family === 1) return finishNumeric(h, `What is the least number of people needed to guarantee that two share a birth month?`, 13, [12, 14, 24, 2], ["There are 12 month-boxes.", "At most 12 people can occupy different months.", "The thirteenth guarantees a shared month."], { representation: "story" });
    if (family === 2) return finishNumeric(h, `Integers are grouped by their remainder when divided by ${n}. How many remainder classes are there?`, n, [n - 1, n + 1, 2 * n, 1], [`The possible remainders are 0, 1, ..., ${n - 1}.`, `That is ${n} distinct classes.`], { representation: "direct" });
    if (family === 3) return finishNumeric(h, `${n * 3 + 1} counters are placed into ${n} boxes. What occupancy is guaranteed in at least one box?`, 4, [3, 5, n, n + 1], [`If every box held at most 3, the total would be at most ${3 * n}.`, `There is one extra counter, so some box contains at least 4.`], { representation: "diagram" });
    return finishString(h, "To prove a repeated value must occur, what should the 'boxes' represent?", "The possible categories or values", ["The order objects arrive", "Only the repeated objects", "The final answer choices", "The largest number"], ["Identify the limited set of possible categories.", "Treat those categories as boxes and the objects as pigeons.", "Compare the number of objects with the number of categories."], { representation: "direct" });
  }
  if (topic === "allocation") {
    if (family === 0) return finishNumeric(h, `${n} identical counters are split between two labelled boxes, allowing an empty box. How many splits are possible?`, n + 1, [n, n - 1, 2 * n, n + 2], [`The first box can receive 0, 1, ..., ${n} counters.`, "The second box then receives the remainder.", `There are ${n + 1} splits.`], { representation: "diagram" });
    if (family === 1) return finishNumeric(h, `${n} identical counters are split between two labelled boxes with at least one in each. How many splits are possible?`, n - 1, [n, n + 1, n - 2, 2 * n], [`The first box can receive 1 through ${n - 1}.`, `That gives ${n - 1} valid splits.`], { representation: "diagram" });
    if (family === 2) return finishNumeric(h, `${n * 2} counters fill boxes holding at most ${n}. What is the minimum number of boxes needed?`, 2, [1, 3, n, 2 * n], [`One box holds at most ${n}.`, `${2 * n} ÷ ${n} = 2`, "Two full boxes are sufficient."], { representation: "story" });
    if (family === 3) return finishString(h, `Can ${n * 2 + 1} counters be split equally between two boxes?`, "No, the total is odd", ["Yes, always", "No, the total is even", "Only if both are empty", "It cannot be decided"], [`${n * 2 + 1} is odd.`, "Two equal whole-number shares would have an even total.", "Therefore an equal split is impossible."], { representation: "direct" });
    return finishString(h, "A distribution problem has several conditions. Which approach avoids double counting?", "Record each case as an ordered tuple", ["List totals only", "Change the labels halfway", "Count one example repeatedly", "Ignore empty boxes"], ["Use one coordinate per labelled box.", "Generate tuples in a fixed order.", "Test each tuple against every condition once."], { representation: "direct" });
  }
  if (topic === "magicGrid") {
    const target = n + h.rand(5, 10), a = h.rand(1, n), missing = target - a;
    if (family === 0) return finishNumeric(h, `A magic row totals ${target}. Two entries are ${a} and ${missing - 2}. What is the missing entry?`, 2, [1, 3, target, missing], [`Known entries total ${target - 2}.`, `${target} - ${target - 2} = 2.`], { representation: "diagram" });
    if (family === 1) return finishNumeric(h, `Each of three rows totals ${target}. What is the total of all nine cells?`, 3 * target, [target, 2 * target, 3 * target + 1, target ** 2], ["The rows do not overlap.", `Three row totals give 3 × ${target} = ${3 * target}.`], { representation: "diagram" });
    if (family === 2) return finishString(h, "In a 3 by 3 normal magic square using 1 to 9, which number must be at the centre?", "5", ["1", "3", "7", "9"], ["Opposite cells pair to 10.", "The middle is the average of 1 to 9.", "That average is 5."], { representation: "diagram" });
    if (family === 3) return finishNumeric(h, `A column in a sum-${target} grid contains ${a}, ${missing} and x. Find x.`, 0, [1, 2, target, a + missing], [`The known entries already total ${a + missing} = ${target}.`, `So x = ${target} - ${target} = 0.`], { representation: "diagram" });
    return finishString(h, "Rows, columns and diagonals have the same total. What is the most efficient first move?", "Write equations for lines with only one unknown", ["Guess every cell", "Use the longest diagonal only", "Add random entries", "Ignore the common total"], ["A line with one unknown gives a direct subtraction.", "Use that result in another nearly complete line.", "Continue until all constraints agree."], { representation: "direct" });
  }
  if (topic === "gridLogic") {
    if (family === 0) return finishNumeric(h, `A row must contain 1 to ${n} once each. It currently contains every value except ${n - 1}. What is missing?`, n - 1, [n, n - 2, 1, 0], ["Compare the row with the complete allowed set.", `Only ${n - 1} is absent.`], { representation: "diagram" });
    if (family === 1) return finishNumeric(h, "On a 2 by 2 grid, moving only right or down, how many shortest paths go from the top-left to the bottom-right?", 6, [2, 4, 8, 12], ["Every shortest path uses two right moves and two down moves.", "Choose which two of four positions contain the right moves.", "There are 6 choices."], { representation: "diagram" });
    if (family === 2) return finishNumeric(h, `A numbered cell says ${Math.min(4, difficulty + 1)}. How many adjacent marked cells must surround it?`, Math.min(4, difficulty + 1), [difficulty, difficulty + 2, 0, 8], ["The number is a local constraint.", `Exactly ${Math.min(4, difficulty + 1)} adjacent cells must be marked.`], { representation: "diagram" });
    if (family === 3) return finishString(h, "Every row of a binary grid must contain an even number of 1s. A row currently has three 1s and one blank. What fills the blank?", "1", ["0", "Either value", "The row is impossible", "2"], ["Three is odd.", "Adding 1 makes four, which is even.", "Adding 0 would leave an odd total."], { representation: "diagram" });
    return finishString(h, "Several row and column clues interact in a logic grid. Which method is sound?", "Apply one forced placement, then propagate its consequences", ["Fill every blank at once", "Use only row clues", "Choose the most attractive pattern", "Restart after each clue"], ["Find a clue with only one possible completion.", "Record that forced value.", "Use it to reduce the possibilities in crossing lines."], { representation: "direct" });
  }
  if (family === 0) return finishNumeric(h, `${n} creatures each shake hands once with every other creature. How many handshakes occur?`, n * (n - 1) / 2, [n * (n - 1), n, n - 1, n * (n + 1) / 2], [`Counting from each creature gives ${n} × ${n - 1}, but counts each pair twice.`, `Divide by 2 to get ${n * (n - 1) / 2}.`], { representation: "story" });
  if (family === 1) return finishNumeric(h, `${n} disconnected islands each have an internal road network. What is the minimum number of bridges needed to connect all islands?`, n - 1, [n, n + 1, n - 2, 2 * n], ["Each bridge can reduce the number of components by at most one.", `Reducing ${n} components to one takes ${n - 1} bridges.`], { representation: "diagram" });
  if (family === 2) return finishNumeric(h, `A graph has total degree ${2 * n}. How many edges does it have?`, n, [2 * n, n - 1, n + 1, 4 * n], ["Every edge contributes 1 to the degree at each endpoint.", "So total degree is twice the edge count.", `${2 * n} ÷ 2 = ${n}.`], { representation: "diagram" });
  if (family === 3) return finishString(h, "A connected graph has exactly two odd-degree vertices. What kind of trail can use every edge once?", "An open Euler trail between the odd vertices", ["A closed Euler circuit", "No trail is possible", "Any Hamilton cycle", "Only a one-edge trail"], ["An Euler trail uses each edge once.", "Exactly two odd vertices become its endpoints.", "All other vertices have even degree."], { representation: "direct" });
  return finishString(h, "What is the minimum number of colours needed for an odd cycle graph?", "3", ["1", "2", "4", "It depends on its size"], ["Alternating two colours around an odd cycle makes the final vertex clash with the first.", "A third colour resolves the clash.", "Therefore the minimum is 3."], { representation: "diagram" });
}

export function installJuniorCurriculumGenerators(G, h) {
  const structures = {};
  const legacyGenerators = { ...G };
  const runLegacy = (key, difficulty) => {
    const current = G[key];
    G[key] = legacyGenerators[key];
    try { return legacyGenerators[key](difficulty); }
    finally { G[key] = current; }
  };
  for (const [topic, sources] of Object.entries(CORE_SOURCE_MAP)) {
    const registry = {};
    sources.forEach((source, index) => {
      registry[`${topic}_route_${index + 1}_${source}`] = {
        difficulties: [1, 2, 3, 4],
        curriculumObjective: topic,
        reasoningRoute: ["translate_model", "work_backwards", "systematic_cases", "find_structure", "bound_optimise"][index],
        build(d) {
          const q = runLegacy(source, d);
          return { ...q, variantId: `${topic}_${source}_${d}`, representation: q.representation || (q.svg ? "diagram" : index === 0 || index === 4 ? "story" : "direct") };
        },
      };
    });
    structures[topic] = registry;
    G[topic] = rotatingGenerator(registry, h);
  }
  for (const topic of CUSTOM_TOPICS) {
    const registry = {};
    for (let family = 0; family < 5; family++) {
      const id = `${topic}_${["interpret", "calculate", "represent", "apply", "reason"][family]}`;
      registry[id] = {
        difficulties: [1, 2, 3, 4],
        curriculumObjective: topic,
        reasoningRoute: ["translate_model", "calculate", "change_representation", "contextual_apply", "deduce_justify"][family],
        build: (d) => customQuestion(topic, family, d, h),
      };
    }
    structures[topic] = registry;
    G[topic] = rotatingGenerator(registry, h);
  }
  for (const topic of ["truthLiars", "seating", "pigeonhole", "allocation", "magicGrid", "gridLogic", "networkGraph"]) {
    const registry = {};
    for (let family = 0; family < 5; family++) {
      const id = `${topic}_logic_route_${family + 1}`;
      registry[id] = {
        difficulties: [1, 2, 3, 4],
        curriculumObjective: "UKMT logic extension",
        reasoningRoute: ["eliminate", "enumerate", "invariant", "extreme_case", "deduce_justify"][family],
        build(d) {
          const q = logicQuestion(topic, family, d, h);
          return { ...q, variantId: `${topic}_${family + 1}_${d}` };
        },
      };
    }
    structures[topic] = registry;
    G[topic] = rotatingGenerator(registry, h);
  }
  return structures;
}
