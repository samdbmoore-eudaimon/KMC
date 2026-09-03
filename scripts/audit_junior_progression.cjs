const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.resolve(__dirname, "..");

async function main() {
  const shared = await import(pathToFileURL(path.join(ROOT, "generators", "gen-shared.js")).href);
  const generators = await import(`${pathToFileURL(path.join(ROOT, "generators", "junior-generators.js")).href}?audit=${Date.now()}`);
  const lessons = await import(`${pathToFileURL(path.join(ROOT, "content", "junior-lessons.js")).href}?audit=${Date.now()}`);
  shared.setActiveModuleKey("junior");
  shared.setNamePools(shared.JUNIOR_NAMES_COMMON, shared.JUNIOR_NAMES_RARE, shared.JUNIOR_NAMES_EPIC, shared.JUNIOR_NAMES_LEGENDARY);
  shared.setModuleSharedVars(shared.JUNIOR_TOPICS, shared.JUNIOR_DEEP_TOPICS, generators.JUNIOR_G);

  const findings = [];
  const topics = shared.JUNIOR_TOPICS;
  const core = topics.filter((topic) => !topic.logicExtension);
  const logic = topics.filter((topic) => topic.logicExtension);
  if (topics.length !== 33) findings.push(`Expected 33 visible topics; found ${topics.length}`);
  if (core.length !== 26) findings.push(`Expected 26 KS3 curriculum topics; found ${core.length}`);
  if (logic.length !== 7) findings.push(`Expected 7 logic extensions; found ${logic.length}`);
  if (logic.some((topic) => topic.mockFrom !== 7)) findings.push("Every logic extension must enter mocks at Level 7");

  const visibleKeys = new Set(topics.map((topic) => topic.key));
  const globalStructureIds = new Set();
  const orders = new Set();
  let sectionCount = 0;
  let exampleCount = 0;

  for (const topic of topics) {
    const lesson = lessons.JUNIOR_LESSONS[topic.key];
    const registry = generators.JUNIOR_STRUCTURES[topic.key];
    const generator = generators.JUNIOR_G[topic.key];
    if (!lesson) { findings.push(`${topic.key}: missing lesson`); continue; }
    if (typeof generator !== "function") findings.push(`${topic.key}: missing generator`);
    if (!registry || Object.keys(registry).length < 5) findings.push(`${topic.key}: fewer than five structures`);
    if (!Number.isInteger(lesson.order) || orders.has(lesson.order)) findings.push(`${topic.key}: missing or duplicate curriculum order`);
    orders.add(lesson.order);

    for (const prereq of lesson.prereq || []) {
      if (typeof prereq === "string" && !visibleKeys.has(prereq)) findings.push(`${topic.key}: unresolved Junior prerequisite ${prereq}`);
      if (typeof prereq === "object" && (!prereq.module || !prereq.key)) findings.push(`${topic.key}: malformed cross-module prerequisite`);
    }

    for (const [id, structure] of Object.entries(registry || {})) {
      if (globalStructureIds.has(id)) findings.push(`${topic.key}: structure ID ${id} is not globally unique`);
      globalStructureIds.add(id);
      if (![1, 2, 3, 4].every((difficulty) => structure.difficulties.includes(difficulty))) findings.push(`${topic.key}: ${id} is not available across D1-D4`);
      if (!structure.curriculumObjective || !structure.reasoningRoute) findings.push(`${topic.key}: ${id} lacks curriculum metadata`);
    }

    for (const section of lesson.sections || []) {
      sectionCount++;
      const examples = section.examples || [];
      if (examples.length !== 4) findings.push(`${topic.key}: section ${section.h || section.heading || "untitled"} has ${examples.length} examples`);
      examples.forEach((example, index) => {
        exampleCount++;
        if (!example.q || !Array.isArray(example.steps) || !example.steps.length || example.answer === undefined) findings.push(`${topic.key}: incomplete worked example`);
        if (!registry?.[example.structureId]) findings.push(`${topic.key}: example links to unknown structure ${example.structureId || "(missing)"}`);
        if (example.difficulty !== index + 1) findings.push(`${topic.key}: examples are not explicitly staged D1-D4`);
      });
    }

    for (let difficulty = 1; difficulty <= 4; difficulty++) {
      const reached = new Set();
      for (let sample = 0; sample < 10; sample++) {
        const q = generator(difficulty);
        reached.add(q.structureId);
        if (q.difficulty !== difficulty) findings.push(`${topic.key}: generated question reports the wrong difficulty`);
        if (!q.variantId || !["story", "diagram", "direct"].includes(q.representation)) findings.push(`${topic.key}: generated metadata is incomplete`);
      }
      const eligible = Object.keys(registry).filter((id) => registry[id].difficulties.includes(difficulty));
      if (eligible.some((id) => !reached.has(id))) findings.push(`${topic.key} D${difficulty}: rotation did not cover every structure before reuse`);
    }
  }

  for (let level = 1; level <= 10; level++) {
    const eligible = topics.filter((topic) => !topic.mockFrom || level >= topic.mockFrom);
    if (eligible.length < 25) findings.push(`Mock Level ${level}: fewer than 25 eligible unique topics`);
    if (level < 7 && eligible.some((topic) => topic.logicExtension)) findings.push(`Mock Level ${level}: logic extension admitted too early`);
    if (level >= 7 && !logic.every((topic) => eligible.includes(topic))) findings.push(`Mock Level ${level}: not every logic extension is eligible`);
    const questions = eligible.slice(0, 25).map((topic, index) => generators.JUNIOR_G[topic.key](index < 15 ? Math.min(4, Math.ceil(level / 2)) : Math.min(4, Math.ceil((level + 1) / 2))));
    if (new Set(questions.map((q) => q.structureId)).size !== questions.length) findings.push(`Mock Level ${level}: repeated structure ID in a 25-topic paper simulation`);
    if (new Set(questions.map((q) => q.variantId)).size !== questions.length) findings.push(`Mock Level ${level}: repeated variant ID in a 25-topic paper simulation`);
  }

  console.log("Junior curriculum progression audit");
  console.log(`Visible topics: ${topics.length} (${core.length} KS3 core + ${logic.length} UKMT logic extensions)`);
  console.log(`Lessons: ${topics.filter((topic) => lessons.JUNIOR_LESSONS[topic.key]).length}; teaching sections: ${sectionCount}; worked examples: ${exampleCount}`);
  console.log(`Registered structures: ${globalStructureIds.size}; mock levels checked: 10`);
  console.log(`Findings: ${findings.length}`);
  findings.forEach((finding) => console.log(`- ${finding}`));
  if (findings.length) process.exit(1);
}

main().catch((error) => { console.error(error.stack || error.message); process.exit(1); });
