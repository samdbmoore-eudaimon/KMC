// Sanity sweep for INTERMEDIATE_G — same pattern as gen_sanity_test_primary.cjs.
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = "C:/Users/samdb/UKMT App";
const JSX = path.join(ROOT, "KangarooMathsQuest.jsx");

const src = fs.readFileSync(JSX, "utf-8");
const patched = src + "\nexport { INTERMEDIATE_G, INTERMEDIATE_STRUCTURES };\n";
const tmpPath = "C:/Users/samdb/UKMT App/_gen_test_intermediate_copy.jsx";
fs.writeFileSync(tmpPath, patched, "utf-8");

let mod;
try {
  const result = esbuild.buildSync({
    entryPoints: [tmpPath], bundle: true, write: false, format: "cjs", platform: "node",
    loader: { ".png": "dataurl", ".webp": "dataurl", ".jpg": "dataurl", ".jpeg": "dataurl" },
    external: ["react", "react-dom", "react-dom/client", "lucide-react", "tone"],
    define: { "process.env.NODE_ENV": '"production"' }, logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const Module = require("module");
  const m = new Module(tmpPath, module);
  m.filename = tmpPath; m.paths = Module._nodeModulePaths(ROOT);
  m._compile(code, tmpPath);
  mod = m.exports;
} catch (e) {
  console.error("BUILD/LOAD FAILED:", e.message); process.exit(1);
} finally {
  fs.unlinkSync(tmpPath);
}

const G = mod.INTERMEDIATE_G;
if (!G) { console.error("INTERMEDIATE_G not exported"); process.exit(1); }
const STRUCTURES = mod.INTERMEDIATE_STRUCTURES || {};

const ALL_TOPICS = Object.keys(G);
const RUNS_PER_DIFF = 400;

let fails = 0, total = 0;
const problems = [];
function check(label, cond, detail) { total++; if (!cond) { fails++; problems.push(`${label}${detail ? " :: " + detail : ""}`); } }

function scanLeaks(q, label) {
  const text = JSON.stringify(q);
  check(`${label} no debug leak`, !/adjust:|checking constraints|TODO|\bundefined\b|\bNaN\b|\[object Object\]/i.test(text), text.slice(0, 200));
  if (Array.isArray(q.options)) {
    const hasFiller = q.options.some((o) => typeof o === "string" && /·\d+$/.test(o));
    check(`${label} no "correct·N" filler decoy`, !hasFiller, q.options.join(" | "));
    // Sam's 2026-08-03 report, narrowed 2026-08-03 after over-correction: the actual bug is
    // ROGUE unrounded floating-point noise (a 9dp decoy like 14.666666666666666 next to clean
    // integers) — not "decimals may never sit next to integers." 3-4dp is fine when the
    // question genuinely calls for it (e.g. unit conversions). Only flag options that clearly
    // look like unrounded float noise: more than 4 decimal places.
    if (Array.isArray(q.options) && q.options.length) {
      const dpOf = (s) => { const i = s.indexOf("."); return i === -1 ? 0 : s.length - i - 1; };
      // estimationAndBounds legitimately produces clean small-number decimals like "0.00042"
      // (from converting standard form back to an ordinary number) that have >4 decimal
      // places but only a handful of genuine SIGNIFICANT figures (leading/trailing zeros are
      // padding, not noise). Distinguish these from real unrounded float noise (e.g.
      // 14.666666666666666, which has many significant digits) by significant-figure count,
      // not raw decimal-place count, so this topic's exact small values aren't flagged.
      const sigFigsOf = (s) => {
        let t = s.replace(/^-/, "").replace(".", "");
        t = t.replace(/^0+/, "") || "0";
        t = t.replace(/0+$/, "") || "0";
        return t.length;
      };
      const numeric = q.options.filter((o) => /^-?\d+(\.\d+)?$/.test(String(o)));
      if (numeric.length) check(`${label} no rogue unrounded decoy (>4dp, >4sf)`, numeric.every((o) => dpOf(String(o)) <= 4 || sigFigsOf(String(o)) <= 4), q.options.join(" | "));
    }
  }
}

console.log(`Testing ${ALL_TOPICS.length} INTERMEDIATE generators (${RUNS_PER_DIFF} runs per difficulty)...`);

// structureCounts[topic][d] = { structureId: count } — built up as we go, checked for
// reachability/balance once every run has completed (mirrors gen_sanity_test_primary.cjs).
const structureCounts = {};

for (const key of ALL_TOPICS) {
  const gen = G[key];
  const registry = STRUCTURES[key];
  for (let d = 1; d <= 4; d++) {
    for (let i = 0; i < RUNS_PER_DIFF; i++) {
      let q;
      try { q = gen(d); } catch (e) {
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

// Reachability + balance check, once per migrated topic/difficulty.
for (const key of Object.keys(STRUCTURES)) {
  const registry = STRUCTURES[key];
  for (let d = 1; d <= 4; d++) {
    const eligible = Object.entries(registry).filter(([, s]) => s.difficulties.includes(d)).map(([id]) => id);
    if (!eligible.length) continue;
    const counts = (structureCounts[key] && structureCounts[key][d]) || {};
    const missing = eligible.filter((id) => !counts[id]);
    check(`${key} d${d} every declared structure reachable`, missing.length === 0, `missing: ${missing.join(", ")}`);
    if (eligible.length >= 2) {
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      for (const [id, c] of Object.entries(counts)) {
        check(`${key} d${d} structure "${id}" not dominating (<=75% share)`, c / total <= 0.75, `${c}/${total}`);
      }
    }
  }
}

console.log(`\nTOTAL: ${total} checks, ${fails} fails`);
if (fails > 0) {
  console.log("\nFirst 80 problems:");
  problems.slice(0, 5000).forEach((p) => console.log(" - " + p));
  process.exit(1);
} else {
  console.log("ALL GREEN");
}
