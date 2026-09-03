// Diagnostic audit of the Intermediate module against the shared structure-ID / four-example /
// D1-D4 contract in LEARNING_MODULE_REQUIREMENTS.md. Unlike audit_junior_progression.cjs this is
// NOT a pass/fail gate (Intermediate has not yet been migrated to the shared contract) — it is
// evidence-gathering for INTERMEDIATE_KS4_UKMT_AUDIT.md. Always exits 0.
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.resolve(__dirname, "..");

function normaliseSkeleton(q) {
  return String(q || "").replace(/-?\d+(\.\d+)?/g, "#").replace(/\s+/g, " ").trim();
}

async function main() {
  const shared = await import(pathToFileURL(path.join(ROOT, "generators", "gen-shared.js")).href);
  const generators = await import(`${pathToFileURL(path.join(ROOT, "generators", "intermediate-generators.js")).href}?audit=${Date.now()}`);
  const lessonsMod = await import(`${pathToFileURL(path.join(ROOT, "content", "intermediate-lessons.js")).href}?audit=${Date.now()}`);
  shared.setActiveModuleKey && shared.setActiveModuleKey("intermediate");

  const topics = generators.INTERMEDIATE_TOPICS;
  const lessons = lessonsMod.INTERMEDIATE_LESSONS;
  const G = generators.INTERMEDIATE_G;

  console.log(`Intermediate curriculum progression audit (evidence-gathering, not a gate)`);
  console.log(`Visible topics: ${topics.length} (${topics.filter(t => t.tier === "higher").length} flagged tier:"higher", ${topics.filter(t => t.dia).length} flagged dia:true)`);

  let totalSections = 0, totalExamples = 0, examplesWithStructureId = 0, examplesFourPerSection = 0, sectionsTotal = 0;
  const rows = [];

  for (const topic of topics) {
    const key = topic.key;
    const lesson = lessons[key];
    const generator = G[key];
    const row = { key, tier: topic.tier || "core", dia: !!topic.dia, hasLesson: !!lesson, hasGenerator: typeof generator === "function" };

    if (lesson) {
      const sections = lesson.sections || [];
      row.sections = sections.length;
      row.order = lesson.order;
      row.prereq = (lesson.prereq || []).join(",");
      let exCount = 0, exWithStructureId = 0, fourExSections = 0;
      for (const section of sections) {
        totalSections++;
        const examples = section.examples || [];
        if (examples.length === 4) { fourExSections++; examplesFourPerSection++; }
        for (const example of examples) {
          exCount++; totalExamples++;
          if (example.structureId) { exWithStructureId++; examplesWithStructureId++; }
        }
      }
      row.examples = exCount;
      row.examplesWithStructureId = exWithStructureId;
      row.fourExampleSections = `${fourExSections}/${sections.length}`;
    }

    if (generator) {
      // Sample each difficulty band heavily and record: distinct structureIds seen, distinct
      // normalised question skeletons seen, whether metadata fields are populated, and whether
      // the *set* of skeletons at d3/d4 is identical to d2 (a proxy for "no real differentiation").
      const perDiff = {};
      for (const d of [1, 2, 3, 4]) {
        const structureIds = new Set();
        const skeletons = new Set();
        let missingMeta = 0, sampleCount = 40;
        for (let i = 0; i < sampleCount; i++) {
          let q;
          try { q = generator(d); } catch (e) { continue; }
          if (!q) continue;
          if (q.structureId) structureIds.add(q.structureId);
          skeletons.add(normaliseSkeleton(q.q));
          if (!q.structureId || !q.variantId || !q.representation || typeof q.difficulty !== "number") missingMeta++;
        }
        perDiff[d] = { structureIds: structureIds.size, skeletons: skeletons.size, missingMeta, skeletonSet: skeletons };
      }
      row.d1Structures = perDiff[1].structureIds; row.d1Skeletons = perDiff[1].skeletons; row.d1MissingMeta = perDiff[1].missingMeta;
      row.d2Structures = perDiff[2].structureIds; row.d2Skeletons = perDiff[2].skeletons; row.d2MissingMeta = perDiff[2].missingMeta;
      row.d3Structures = perDiff[3].structureIds; row.d3Skeletons = perDiff[3].skeletons; row.d3MissingMeta = perDiff[3].missingMeta;
      row.d4Structures = perDiff[4].structureIds; row.d4Skeletons = perDiff[4].skeletons; row.d4MissingMeta = perDiff[4].missingMeta;
      // Same-skeleton-set proxy for "identical difficulty bands"
      const setsEqual = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
      row.d2eqd3 = setsEqual(perDiff[2].skeletonSet, perDiff[3].skeletonSet);
      row.d3eqd4 = setsEqual(perDiff[3].skeletonSet, perDiff[4].skeletonSet);
      row.d2eqd4 = setsEqual(perDiff[2].skeletonSet, perDiff[4].skeletonSet);
    }

    rows.push(row);
  }

  console.log("\nkey,order,tier,dia,hasLesson,sections,examples,examplesWithStructureId,fourExampleSections,d1Str,d1Skel,d2Str,d2Skel,d3Str,d3Skel,d4Str,d4Skel,d2eqd3,d3eqd4,d1MissingMeta,d4MissingMeta");
  for (const r of rows) {
    console.log([r.key, r.order, r.tier, r.dia, r.hasLesson, r.sections, r.examples, r.examplesWithStructureId, r.fourExampleSections,
      r.d1Structures, r.d1Skeletons, r.d2Structures, r.d2Skeletons, r.d3Structures, r.d3Skeletons, r.d4Structures, r.d4Skeletons,
      r.d2eqd3, r.d3eqd4, r.d1MissingMeta, r.d4MissingMeta].join(","));
  }

  console.log(`\nTotals: ${topics.length} topics, ${totalSections} sections, ${totalExamples} examples, ${examplesWithStructureId} examples with structureId (${(100*examplesWithStructureId/totalExamples).toFixed(1)}%), ${examplesFourPerSection}/${totalSections} sections with exactly 4 examples`);
  const noDiffCount = rows.filter(r => r.d2eqd3 && r.d3eqd4).length;
  console.log(`Topics where D2, D3 and D4 sampled question-skeleton sets are identical (no detectable difficulty growth above D2): ${noDiffCount}/${topics.length}`);
  const anyMissingMeta = rows.filter(r => (r.d1MissingMeta > 0) || (r.d4MissingMeta > 0));
  console.log(`Topics with any sampled question missing structureId/variantId/representation/difficulty metadata: ${anyMissingMeta.length}/${topics.length}`);
  anyMissingMeta.forEach(r => console.log(`  - ${r.key}: d1 missing ${r.d1MissingMeta}/40, d4 missing ${r.d4MissingMeta}/40`));
}

main().catch((error) => { console.error(error.stack || error.message); process.exit(1); });
