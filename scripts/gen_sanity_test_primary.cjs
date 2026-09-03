// Sanity sweep for PRIMARY_G, the Primary module's question generators (Phase 1 of
// MODULE_EXPANSION_PLAN.md). Same pattern as scripts/gen_sanity_test.cjs: bundles the REAL
// source with `export { PRIMARY_G }` appended, via esbuild to CJS, then drives every generator
// directly at every difficulty tier, bypassing makeQuestion's silent try/catch fallback (which
// would otherwise mask a throwing generator).
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = "C:/Users/samdb/UKMT App";
const JSX = path.join(ROOT, "KangarooMathsQuest.jsx");

const src = fs.readFileSync(JSX, "utf-8");
const patched = src + "\nexport { PRIMARY_G, PRIMARY_STRUCTURES };\n";
const tmpPath = "C:/Users/samdb/UKMT App/_gen_test_primary_copy.jsx";
fs.writeFileSync(tmpPath, patched, "utf-8");

let mod;
try {
  const result = esbuild.buildSync({
    entryPoints: [tmpPath],
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    loader: { ".png": "dataurl", ".webp": "dataurl", ".jpg": "dataurl", ".jpeg": "dataurl" },
    external: ["react", "react-dom", "react-dom/client", "lucide-react", "tone"],
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const Module = require("module");
  const m = new Module(tmpPath, module);
  m.filename = tmpPath;
  m.paths = Module._nodeModulePaths(ROOT);
  m._compile(code, tmpPath);
  mod = m.exports;
} catch (e) {
  console.error("BUILD/LOAD FAILED:", e.message);
  process.exit(1);
} finally {
  fs.unlinkSync(tmpPath);
}

const G = mod.PRIMARY_G;
if (!G) { console.error("PRIMARY_G not exported"); process.exit(1); }
const STRUCTURES = mod.PRIMARY_STRUCTURES || {};

const ALL_TOPICS = Object.keys(G);
const RUNS_PER_DIFF = 400; // higher than Junior's 150 — this content is brand new, want more coverage

let fails = 0, total = 0;
const problems = [];
function check(label, cond, detail) {
  total++;
  if (!cond) { fails++; problems.push(`${label}${detail ? " :: " + detail : ""}`); }
}

function scanLeaks(q, label) {
  const text = JSON.stringify(q);
  check(`${label} no debug leak`, !/adjust:|checking constraints|TODO|\bundefined\b|\bNaN\b|\[object Object\]/i.test(text), text.slice(0, 200));
  // buildMCStr pads to 4 distractors with a literal "correct·N" filler when given fewer than 4
  // genuinely distinct decoys — this is a real generator bug (weak/insufficient decoy space),
  // not just a debug leak, so it gets its own explicit check rather than living inside scanLeaks'
  // generic regex.
  if (Array.isArray(q.options)) {
    const hasFiller = q.options.some((o) => typeof o === "string" && /·\d+$/.test(o));
    check(`${label} no "correct·N" filler decoy`, !hasFiller, q.options.join(" | "));
    // Sam's 2026-08-03 report, narrowed 2026-08-03 after over-correction: the actual bug is
    // ROGUE unrounded floating-point noise (a 9dp decoy like 14.666666666666666 next to clean
    // integers) — not "decimals may never sit next to integers." 3-4dp is fine when the
    // question genuinely calls for it (e.g. unit conversions). Only flag options that clearly
    // look like unrounded float noise: more than 4 decimal places.
    if (q.options.length) {
      const dpOf = (s) => { const i = s.indexOf("."); return i === -1 ? 0 : s.length - i - 1; };
      const numeric = q.options.filter((o) => /^-?\d+(\.\d+)?$/.test(String(o)));
      if (numeric.length) check(`${label} no rogue unrounded decoy (>4dp)`, numeric.every((o) => dpOf(String(o)) <= 4), q.options.join(" | "));
    }
  }
}

console.log(`Testing ${ALL_TOPICS.length} PRIMARY generators (${RUNS_PER_DIFF} runs per difficulty)...`);

// structureCounts[topic][d] = { structureId: count } — built up as we go, checked for
// reachability/balance once every run has completed (see the block after the main loop).
const structureCounts = {};

for (const key of ALL_TOPICS) {
  const gen = G[key];
  const registry = STRUCTURES[key];
  for (let d = 1; d <= 4; d++) {
    for (let i = 0; i < RUNS_PER_DIFF; i++) {
      let q;
      try {
        q = gen(d);
      } catch (e) {
        check(`${key} d${d} threw`, false, e.stack ? e.stack.split("\n").slice(0, 3).join(" | ") : e.message);
        continue;
      }
      const label = `${key} d${d}`;
      check(`${label} returned object`, q && typeof q === "object", JSON.stringify(q).slice(0, 150));
      if (!q) continue;
      check(`${label} has q text`, typeof q.q === "string" && q.q.length > 5);
      const hasMC = Array.isArray(q.options) && Number.isInteger(q.correctIndex);
      check(`${label} has options+correctIndex`, hasMC, JSON.stringify(q).slice(0, 250));
      if (hasMC) {
        check(`${label} options length 5`, q.options.length === 5, q.options.join(" | "));
        check(`${label} options distinct`, new Set(q.options).size === q.options.length, q.options.join(" | "));
        check(`${label} correctIndex in range`, q.correctIndex >= 0 && q.correctIndex < q.options.length, q.correctIndex);
      }
      const solOk = Array.isArray(q.solution) ? q.solution.length > 0
        : q.solution && typeof q.solution === "object" && Array.isArray(q.solution.steps) && q.solution.steps.length > 0;
      check(`${label} has solution`, solOk, JSON.stringify(q.solution).slice(0, 150));
      scanLeaks(q, label);
      // Topics migrated onto the pickStructure registry (see generators/gen-shared.js) must
      // tag every question with a structureId that the registry actually declares for this
      // topic and difficulty — catches a structure silently escaping its declared band, or a
      // typo'd/undeclared id slipping through.
      if (registry) {
        check(`${label} has structureId`, typeof q.structureId === "string" && q.structureId.length > 0, JSON.stringify(q).slice(0, 150));
        if (q.structureId) {
          const s = registry[q.structureId];
          check(`${label} structureId "${q.structureId}" is declared`, !!s, Object.keys(registry).join(", "));
          if (s) check(`${label} structureId "${q.structureId}" declared eligible at d${d}`, s.difficulties.includes(d), s.difficulties.join(","));
          structureCounts[key] = structureCounts[key] || {};
          structureCounts[key][d] = structureCounts[key][d] || {};
          structureCounts[key][d][q.structureId] = (structureCounts[key][d][q.structureId] || 0) + 1;
        }
      }
    }
  }
}

// Reachability + balance pass: every structure a topic declares eligible for a difficulty
// must actually turn up in that difficulty's sample (proves it isn't dead code / unreachable
// due to an overly-strict build()), and no one structure may dominate the random sampling
// when 2+ structures are eligible for that difficulty.
for (const [key, registry] of Object.entries(STRUCTURES)) {
  for (let d = 1; d <= 4; d++) {
    const eligible = Object.entries(registry).filter(([, s]) => s.difficulties.includes(d)).map(([id]) => id);
    if (!eligible.length) continue;
    const counts = (structureCounts[key] && structureCounts[key][d]) || {};
    const missing = eligible.filter((id) => !counts[id]);
    check(`${key} d${d} every declared structure reachable`, missing.length === 0, `missing: ${missing.join(", ")}`);
    const total_ = Object.values(counts).reduce((a, b) => a + b, 0);
    if (eligible.length > 1 && total_ > 0) {
      const dominant = Object.entries(counts).find(([, c]) => c / total_ > 0.75);
      check(`${key} d${d} no structure dominates sampling`, !dominant, dominant ? `${dominant[0]}: ${((dominant[1] / total_) * 100).toFixed(1)}%` : "");
    }
  }
}

console.log(`\nTOTAL: ${total} checks, ${fails} fails`);
if (fails > 0) {
  console.log("\nFirst 60 problems:");
  problems.slice(0, 60).forEach((p) => console.log(" - " + p));
  process.exit(1);
} else {
  console.log("ALL GREEN");
}
