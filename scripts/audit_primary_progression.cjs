const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.resolve(__dirname, "..");
const STRICT = process.argv.includes("--strict");
const JSON_ONLY = process.argv.includes("--json");
const SAMPLES_PER_DIFFICULTY = 240;
const MIGRATED_TOPICS = new Set(["negativeNumbers", "placeValue", "roundingEstimate", "additionSubtraction", "compensationMentalMaths", "timesTablesFacts", "factorsMultiplesPrimes", "formalMultiplication", "divisionRemainders", "formalDivision", "fourOperationsProblems", "fractionOfQuantity", "fractionEquivalence", "fractionArithmetic", "decimalPlaceValue", "percentages", "ratioBasics", "twoUnknowns", "additiveMultiplicative", "unitConversion", "areaPerimeter", "timeCalendar", "statistics", "shapeProperties", "angleBasics", "symmetryReflection", "sequencePattern", "logicGrid", "combinatoricsCounting", "spatialPuzzles"]);
const DIAGRAM_CONSTRAINED_TOPICS = new Set(["shapeProperties", "angleBasics", "symmetryReflection", "spatialPuzzles"]);

const PLACEHOLDER_PATTERNS = [
  /Begin with the idea:/i,
  /What should we notice before trying to calculate\?/i,
  /How does the method grow from that first idea\?/i,
  /Explain the main principle behind/i,
];

function isPlaceholder(text) {
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(String(text || "")));
}

function normaliseQuestion(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/£\s*\d+(?:\.\d+)?/g, "£#")
    .replace(/\b\d+(?:\.\d+)?\b/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

function validWorkedExample(example) {
  return !!(
    example &&
    typeof example.q === "string" &&
    example.q.trim() &&
    !isPlaceholder(example.q) &&
    Array.isArray(example.steps) &&
    example.steps.length > 0 &&
    example.steps.every((step) => typeof step === "string" && step.trim()) &&
    typeof example.answer === "string" &&
    example.answer.trim()
  );
}

async function loadModules() {
  const stamp = `audit=${Date.now()}`;
  const lessonUrl = `${pathToFileURL(path.join(ROOT, "content", "primary-lessons.js")).href}?${stamp}`;
  const generatorUrl = `${pathToFileURL(path.join(ROOT, "generators", "primary-generators.js")).href}?${stamp}`;
  const sharedUrl = pathToFileURL(path.join(ROOT, "generators", "gen-shared.js")).href;
  const [lessons, generators, shared] = await Promise.all([import(lessonUrl), import(generatorUrl), import(sharedUrl)]);
  shared.setActiveModuleKey("primary");
  shared.setNamePools(generators.PRIMARY_NAMES_COMMON, generators.PRIMARY_NAMES_RARE, generators.PRIMARY_NAMES_EPIC, generators.PRIMARY_NAMES_LEGENDARY);
  return { lessons, generators };
}

function auditLesson(topic, lesson, registry) {
  if (!lesson) {
    return {
      present: false,
      sectionCount: 0,
      exampleCount: 0,
      exampleCounts: [],
      invalidExampleCount: 0,
      placeholderCount: 0,
      mappedExampleCount: 0,
      invalidStructureLinks: [],
      representedStructureIds: [],
      prereq: [],
    };
  }

  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  const examples = sections.flatMap((section) => Array.isArray(section.examples) ? section.examples : []);
  const invalidStructureLinks = examples
    .filter((example) => example.structureId && !registry?.[example.structureId])
    .map((example) => example.structureId);

  return {
    present: true,
    sectionCount: sections.length,
    exampleCount: examples.length,
    exampleCounts: sections.map((section) => Array.isArray(section.examples) ? section.examples.length : 0),
    invalidExampleCount: examples.filter((example) => !validWorkedExample(example)).length,
    placeholderCount: examples.filter((example) => isPlaceholder(example.q)).length,
    mappedExampleCount: examples.filter((example) => typeof example.structureId === "string" && example.structureId).length,
    invalidStructureLinks: [...new Set(invalidStructureLinks)],
    representedStructureIds: [...new Set(examples.map((example) => example.structureId).filter(Boolean))],
    prereq: Array.isArray(lesson.prereq) ? lesson.prereq : [],
  };
}

function auditGenerator(topic, generator, registry) {
  const byDifficulty = {};
  const errors = [];
  const collisions = [];

  for (let difficulty = 1; difficulty <= 4; difficulty++) {
    const eligibleIds = registry
      ? Object.entries(registry).filter(([, structure]) => structure.difficulties.includes(difficulty)).map(([id]) => id)
      : [];
    const reached = new Set();
    const variants = new Set();
    const representations = { story: 0, diagram: 0, direct: 0, unclassified: 0 };
    const skeletonOwners = new Map();

    for (let sample = 0; sample < SAMPLES_PER_DIFFICULTY; sample++) {
      let question;
      try {
        question = generator(difficulty);
      } catch (error) {
        errors.push(`D${difficulty}: ${error.message}`);
        continue;
      }
      if (!question || typeof question !== "object") {
        errors.push(`D${difficulty}: generator returned no question`);
        continue;
      }
      if (question.structureId) reached.add(question.structureId);
      if (question.variantId) variants.add(question.variantId);
      const representation = question.representation || (question.svg ? "diagram" : "unclassified");
      if (Object.hasOwn(representations, representation)) representations[representation]++;
      else representations.unclassified++;

      const skeleton = normaliseQuestion(question.q);
      if (skeleton && question.structureId) {
        const owners = skeletonOwners.get(skeleton) || new Set();
        owners.add(question.structureId);
        skeletonOwners.set(skeleton, owners);
      }
    }

    for (const [skeleton, owners] of skeletonOwners.entries()) {
      if (owners.size > 1) collisions.push({ difficulty, skeleton, structureIds: [...owners] });
    }

    byDifficulty[difficulty] = {
      eligibleCount: eligibleIds.length,
      eligibleIds,
      reachedCount: reached.size,
      missingIds: eligibleIds.filter((id) => !reached.has(id)),
      variantCount: variants.size,
      representations,
    };
  }

  return { byDifficulty, errors, collisions };
}

function buildFindings(topics, lessons) {
  const topicKeys = new Set(topics.map((topic) => topic.key));
  const findings = [];
  for (const topic of topics) {
    const lesson = topic.lesson;
    if (!lesson.present) findings.push(`${topic.key}: missing lesson`);
    if (lesson.present && lesson.exampleCounts.some((count) => count !== 4)) findings.push(`${topic.key}: one or more lesson sections do not contain exactly four examples`);
    if (lesson.invalidExampleCount) findings.push(`${topic.key}: ${lesson.invalidExampleCount} incomplete or placeholder worked examples`);
    if (lesson.mappedExampleCount === 0) findings.push(`${topic.key}: no lesson examples link to structure IDs`);
    if (MIGRATED_TOPICS.has(topic.key) && lesson.mappedExampleCount !== lesson.exampleCount) findings.push(`${topic.key}: not every worked example links to a generator structure`);
    if (lesson.invalidStructureLinks.length) findings.push(`${topic.key}: invalid lesson structure links: ${lesson.invalidStructureLinks.join(", ")}`);
    const badPrereq = lesson.prereq.filter((key) => !topicKeys.has(key));
    if (badPrereq.length) findings.push(`${topic.key}: unresolved prerequisites: ${badPrereq.join(", ")}`);
    for (let difficulty = 1; difficulty <= 4; difficulty++) {
      const band = topic.generator.byDifficulty[difficulty];
      if (band.eligibleCount < 5) findings.push(`${topic.key} D${difficulty}: only ${band.eligibleCount} declared families`);
      if (band.missingIds.length) findings.push(`${topic.key} D${difficulty}: unreachable families: ${band.missingIds.join(", ")}`);
      if (MIGRATED_TOPICS.has(topic.key) && band.variantCount < 5) findings.push(`${topic.key} D${difficulty}: only ${band.variantCount} generated verbal variants`);
    }
    if (MIGRATED_TOPICS.has(topic.key)) {
      const totals = [1, 2, 3, 4].reduce((sum, difficulty) => {
        Object.entries(topic.generator.byDifficulty[difficulty].representations).forEach(([key, count]) => { sum[key] = (sum[key] || 0) + count; });
        return sum;
      }, {});
      const generated = Object.values(totals).reduce((sum, count) => sum + count, 0);
      const share = (key) => (totals[key] || 0) / generated;
      if (DIAGRAM_CONSTRAINED_TOPICS.has(topic.key)) {
        if (share("diagram") < 0.4) findings.push(`${topic.key}: diagram-dependent topic generated fewer than 40% diagram questions`);
      } else {
        if (share("story") < 0.4 || share("story") > 0.7) findings.push(`${topic.key}: story representation is outside the 40-70% audit tolerance`);
        if (share("diagram") < 0.2 || share("diagram") > 0.45) findings.push(`${topic.key}: diagram representation is outside the 20-45% audit tolerance`);
        if (share("direct") < 0.08 || share("direct") > 0.3) findings.push(`${topic.key}: direct representation is outside the 8-30% audit tolerance`);
      }
      if (totals.unclassified) findings.push(`${topic.key}: ${totals.unclassified} generated questions have no representation classification`);
    }
    if (topic.generator.errors.length) findings.push(`${topic.key}: generator errors: ${topic.generator.errors.join("; ")}`);
  }
  for (const key of Object.keys(lessons)) {
    if (!topicKeys.has(key)) findings.push(`${key}: lesson exists without a Primary topic`);
  }
  return findings;
}

function printHuman(report) {
  console.log("Primary progression audit");
  console.log(`Topics: ${report.summary.topicCount}; lessons: ${report.summary.lessonCount}; samples: ${report.summary.generatedSamples}`);
  console.log("");
  console.log("topic\tlesson\tinvalid examples\tlinked examples\tD1/D2/D3/D4 families\tvariants found\tstory/diagram/direct/other\ttemplate collisions");
  for (const topic of report.topics) {
    const bands = [1, 2, 3, 4].map((difficulty) => topic.generator.byDifficulty[difficulty]);
    const representations = bands.reduce((totals, band) => {
      Object.entries(band.representations).forEach(([key, count]) => { totals[key] = (totals[key] || 0) + count; });
      return totals;
    }, {});
    console.log([
      topic.key,
      topic.lesson.present ? `${topic.lesson.sectionCount} sections` : "MISSING",
      topic.lesson.invalidExampleCount,
      topic.lesson.mappedExampleCount,
      bands.map((band) => band.eligibleCount).join("/"),
      bands.map((band) => band.variantCount).join("/"),
      [representations.story || 0, representations.diagram || 0, representations.direct || 0, representations.unclassified || 0].join("/"),
      topic.generator.collisions.length,
    ].join("\t"));
  }
  console.log("");
  console.log(`Findings: ${report.findings.length}`);
  report.findings.forEach((finding) => console.log(`- ${finding}`));
}

async function main() {
  const { lessons, generators } = await loadModules();
  const lessonMap = lessons.PRIMARY_LESSONS || {};
  const registries = generators.PRIMARY_STRUCTURES || {};
  const generatorMap = generators.PRIMARY_G || {};
  const topicMeta = generators.PRIMARY_TOPICS || [];

  const topics = topicMeta.map((meta) => {
    const registry = registries[meta.key];
    const generator = generatorMap[meta.key];
    return {
      key: meta.key,
      label: meta.label,
      stretch: !!meta.stretch,
      lesson: auditLesson(meta.key, lessonMap[meta.key], registry),
      generator: generator
        ? auditGenerator(meta.key, generator, registry)
        : { byDifficulty: {}, errors: ["missing generator"], collisions: [] },
    };
  });

  const findings = buildFindings(topics, lessonMap);
  const report = {
    generatedAt: new Date().toISOString(),
    strict: STRICT,
    summary: {
      topicCount: topics.length,
      lessonCount: topics.filter((topic) => topic.lesson.present).length,
      generatedSamples: topics.length * 4 * SAMPLES_PER_DIFFICULTY,
      findingCount: findings.length,
    },
    topics,
    findings,
  };

  if (JSON_ONLY) console.log(JSON.stringify(report, null, 2));
  else printHuman(report);

  const strictFindings = findings.filter((finding) => MIGRATED_TOPICS.has(finding.split(":", 1)[0]));
  if (STRICT && strictFindings.length) {
    console.error(`\nStrict migrated-topic gate: ${strictFindings.length} finding(s)`);
    strictFindings.forEach((finding) => console.error(`- ${finding}`));
    process.exitCode = 1;
  } else if (STRICT) {
    console.log("\nStrict migrated-topic gate: PASS");
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
