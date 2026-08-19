// Audits how many topics (per module) have migrated from the old flat `solution: [steps]`
// array to the new { scenario, idea, method, steps, check } shape + a top-level `hint`.
// Run with: node scripts/audit_hint_schema.cjs [junior|primary|intermediate|all]
"use strict";
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = "C:/Users/samdb/UKMT App";
const JSX = path.join(ROOT, "KangarooMathsQuest.jsx");

function loadModule() {
  const src = fs.readFileSync(JSX, "utf-8");
  const patched = src + "\nexport { JUNIOR_G, PRIMARY_G, INTERMEDIATE_G, JUNIOR_TOPICS, PRIMARY_TOPICS, INTERMEDIATE_TOPICS, JUNIOR_DEEP_TOPICS, PRIMARY_DEEP_TOPICS, INTERMEDIATE_DEEP_TOPICS };\n";
  const tmpPath = path.join(ROOT, "_audit_hint_schema_copy.jsx");
  fs.writeFileSync(tmpPath, patched, "utf-8");
  try {
    const result = esbuild.buildSync({
      entryPoints: [tmpPath], bundle: true, write: false, format: "cjs", platform: "node",
      external: ["react", "react-dom", "react-dom/client", "lucide-react", "tone"],
      define: { "process.env.NODE_ENV": '"production"' }, logLevel: "silent",
    });
    const code = result.outputFiles[0].text;
    const Module = require("module");
    const m = new Module(tmpPath, module);
    m.filename = tmpPath; m.paths = Module._nodeModulePaths(ROOT);
    m._compile(code, tmpPath);
    return m.exports;
  } finally {
    fs.unlinkSync(tmpPath);
  }
}

function auditOne(name, G, TOPICS, DEEP_TOPICS) {
  const allKeys = [...TOPICS.map(t => t.key), ...DEEP_TOPICS.map(t => t.key)];
  let migrated = 0, legacy = 0, broken = [];
  const migratedKeys = [], legacyKeys = [];
  for (const key of allKeys) {
    const gen = G[key];
    if (!gen) { broken.push(`${key}: no generator`); continue; }
    let sawStructured = false, sawLegacy = false, problems = [];
    for (let d = 1; d <= 4; d++) {
      let q;
      try { q = gen(d); } catch (e) { broken.push(`${key}@d${d}: ${e.message}`); continue; }
      if (Array.isArray(q.solution)) {
        sawLegacy = true;
      } else if (q.solution && typeof q.solution === "object") {
        sawStructured = true;
        if (!q.hint || typeof q.hint !== "string" || q.hint.length < 10) problems.push(`d${d}: missing/short hint`);
        if (!q.solution.scenario) problems.push(`d${d}: missing solution.scenario`);
        if (!q.solution.idea) problems.push(`d${d}: missing solution.idea`);
        if (!Array.isArray(q.solution.method) || q.solution.method.length === 0) problems.push(`d${d}: missing solution.method`);
        if (!Array.isArray(q.solution.steps) || q.solution.steps.length === 0) problems.push(`d${d}: missing solution.steps`);
        if (!q.solution.check) problems.push(`d${d}: missing solution.check`);
      } else {
        problems.push(`d${d}: no solution at all`);
      }
    }
    if (problems.length) broken.push(`${key}: ${problems.join("; ")}`);
    else if (sawStructured) { migrated++; migratedKeys.push(key); }
    else if (sawLegacy) { legacy++; legacyKeys.push(key); }
  }
  console.log(`\n=== ${name.toUpperCase()} === ${allKeys.length} topics: ${migrated} migrated, ${legacy} legacy (unmigrated), ${broken.length} with problems`);
  if (broken.length) { console.log("  PROBLEMS:"); broken.forEach(b => console.log("   -", b)); }
  if (process.argv.includes("--list")) {
    console.log("  Migrated:", migratedKeys.join(", ") || "(none)");
    console.log("  Legacy:  ", legacyKeys.join(", ") || "(none)");
  }
  return { total: allKeys.length, migrated, legacy, brokenCount: broken.length };
}

const which = (process.argv[2] || "all").toLowerCase();
const mod = loadModule();
const results = {};
if (which === "all" || which === "junior") results.junior = auditOne("junior", mod.JUNIOR_G, mod.JUNIOR_TOPICS, mod.JUNIOR_DEEP_TOPICS);
if (which === "all" || which === "primary") results.primary = auditOne("primary", mod.PRIMARY_G, mod.PRIMARY_TOPICS, mod.PRIMARY_DEEP_TOPICS);
if (which === "all" || which === "intermediate") results.intermediate = auditOne("intermediate", mod.INTERMEDIATE_G, mod.INTERMEDIATE_TOPICS, mod.INTERMEDIATE_DEEP_TOPICS);

const totalBroken = Object.values(results).reduce((a, r) => a + r.brokenCount, 0);
console.log(totalBroken > 0 ? `\nFAIL: ${totalBroken} topic(s) with schema problems` : `\nOK: no schema problems detected`);
process.exit(totalBroken > 0 ? 1 : 0);
