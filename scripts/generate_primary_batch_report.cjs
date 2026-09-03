const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "PRIMARY_EDITORIAL_REPORT.md");
const SAMPLE_SIZE = 400;

function clean(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function percentage(count, total) {
  return `${Math.round((count / total) * 100)}%`;
}

async function loadModules() {
  const stamp = `report=${Date.now()}`;
  const [lessons, generators, shared] = await Promise.all([
    import(`${pathToFileURL(path.join(ROOT, "content", "primary-lessons.js")).href}?${stamp}`),
    import(`${pathToFileURL(path.join(ROOT, "generators", "primary-generators.js")).href}?${stamp}`),
    import(pathToFileURL(path.join(ROOT, "generators", "gen-shared.js")).href),
  ]);
  shared.setActiveModuleKey("primary");
  shared.setNamePools(generators.PRIMARY_NAMES_COMMON, generators.PRIMARY_NAMES_RARE, generators.PRIMARY_NAMES_EPIC, generators.PRIMARY_NAMES_LEGENDARY);
  return { lessons: lessons.PRIMARY_LESSONS, generators };
}

function collect(generator, registry, difficulty) {
  const eligible = Object.entries(registry).filter(([, structure]) => structure.difficulties.includes(difficulty)).map(([id]) => id);
  const examples = new Map();
  const representations = { story: 0, diagram: 0, direct: 0, unclassified: 0 };
  for (let attempt = 0; attempt < 5000 && (attempt < SAMPLE_SIZE || examples.size < eligible.length); attempt++) {
    const question = generator(difficulty);
    if (attempt < SAMPLE_SIZE) {
      const representation = question.representation || (question.svg ? "diagram" : "unclassified");
      representations[representation] = (representations[representation] || 0) + 1;
    }
    if (eligible.includes(question.structureId) && !examples.has(question.structureId)) examples.set(question.structureId, question);
  }
  return { eligible, examples, representations };
}

async function main() {
  const { lessons, generators } = await loadModules();
  const topicMeta = Object.fromEntries(generators.PRIMARY_TOPICS.map((topic) => [topic.key, topic]));
  const lines = [
    "# Primary Editorial Evidence Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This report is a reproducible review pack for all Primary topics. Percentages are measured from 1,600 fresh questions per topic. The detailed tables contain one live generated question from every declared family at every difficulty.",
    "",
    "## Automated acceptance summary",
    "",
    "| Order | Topic | Lesson sections | Worked examples | Linked examples | D1/D2/D3/D4 families | Story | Diagram | Direct | Result |",
    "|---:|---|---:|---:|---:|---|---:|---:|---:|---|",
  ];

  const evidence = [];
  for (const key of generators.PRIMARY_TOPICS.map((topic) => topic.key)) {
    const lesson = lessons[key];
    const registry = generators.PRIMARY_STRUCTURES[key];
    const generator = generators.PRIMARY_G[key];
    const bands = [1, 2, 3, 4].map((difficulty) => collect(generator, registry, difficulty));
    const examples = lesson.sections.flatMap((section) => section.examples || []);
    const totals = bands.reduce((sum, band) => {
      Object.entries(band.representations).forEach(([kind, count]) => { sum[kind] = (sum[kind] || 0) + count; });
      return sum;
    }, {});
    const total = Object.values(totals).reduce((sum, count) => sum + count, 0);
    const reachedAll = bands.every((band) => band.examples.size === band.eligible.length);
    const constrained = new Set(["shapeProperties", "angleBasics", "symmetryReflection", "spatialPuzzles"]).has(key);
    const mixPass = constrained ? totals.diagram / total >= 0.4 : totals.story / total >= 0.4 && totals.story / total <= 0.7 && totals.diagram / total >= 0.2 && totals.diagram / total <= 0.45 && totals.direct / total >= 0.08 && totals.direct / total <= 0.3;
    const passed = lesson.sections.every((section) => section.examples?.length === 4) && examples.every((example) => example.structureId && registry[example.structureId]) && bands.every((band) => band.eligible.length >= 5) && reachedAll && totals.unclassified === 0 && mixPass;
    lines.push(`| ${lesson.order} | ${clean(topicMeta[key].label)} | ${lesson.sections.length} | ${examples.length} | ${examples.filter((example) => example.structureId && registry[example.structureId]).length} | ${bands.map((band) => band.eligible.length).join("/")} | ${percentage(totals.story, total)} | ${percentage(totals.diagram, total)} | ${percentage(totals.direct, total)} | ${passed ? "PASS" : "REVIEW"} |`);
    evidence.push({ key, lesson, bands });
  }

  lines.push(
    "",
    "Acceptance tolerances are 40-70% story, 20-45% diagram and 8-30% direct. Shape Properties, Angles, Symmetry and Spatial Puzzles use the documented diagram-dependent exception and require at least 40% diagrams. The target ratio remains approximately 1/2, 1/3 and 1/6 wherever the topic allows.",
    "",
    "## Family-by-family evidence",
    "",
  );

  for (const { key, lesson, bands } of evidence) {
    lines.push(`### ${lesson.order}. ${clean(lesson.title)}`, "");
    for (let index = 0; index < bands.length; index++) {
      const difficulty = index + 1;
      const band = bands[index];
      lines.push(`#### D${difficulty}`, "", "| Structure | Presentation | Variant | Live question | Correct answer |", "|---|---|---|---|---|");
      for (const structureId of band.eligible) {
        const question = band.examples.get(structureId);
        const answer = question ? question.options?.[question.correctIndex] : "NOT REACHED";
        lines.push(`| ${clean(structureId)} | ${clean(question?.representation)} | ${clean(question?.variantId)} | ${clean(question?.q)} | ${clean(answer)} |`);
      }
      lines.push("");
    }
  }

  lines.push(
    "## Editorial interpretation",
    "",
    "- Passing this report proves structural coverage, reachability, lesson linkage and presentation balance. It does not replace reading the sampled questions for age, clarity or mathematical authenticity.",
    "- A verbal variant counts only when it changes the setting or reasoning route meaningfully. A changed character name or noun alone is presentation variation, not a new structure.",
    "- Diagram questions must remain solvable from the displayed mathematical information. Decorative artwork is not counted as a diagram.",
    "- D1 to D4 is game progression. Higher bands may extend an earlier family, but the reasoning or number demands must genuinely increase.",
    "",
  );

  fs.writeFileSync(OUTPUT, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${OUTPUT}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
