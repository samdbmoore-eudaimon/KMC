// Sanity sweep for JUNIOR_G. Same pattern as gen_sanity_test_primary.cjs.
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = "C:/Users/samdb/UKMT App";
const JSX = path.join(ROOT, "KangarooMathsQuest.jsx");

const src = fs.readFileSync(JSX, "utf-8");
const patched = src + "\nexport { JUNIOR_G };\n";
const tmpPath = "C:/Users/samdb/UKMT App/_gen_test_junior_copy.jsx";
fs.writeFileSync(tmpPath, patched, "utf-8");

let mod;
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
  mod = m.exports;
} catch (e) {
  console.error("BUILD/LOAD FAILED:", e.message); process.exit(1);
} finally {
  fs.unlinkSync(tmpPath);
}

const G = mod.JUNIOR_G;
if (!G) { console.error("JUNIOR_G not exported"); process.exit(1); }

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
    if (Array.isArray(q.options) && q.options.length) {
      const dpOf = (s) => { const i = s.indexOf("."); return i === -1 ? 0 : s.length - i - 1; };
      const numeric = q.options.filter((o) => /^-?\d+(\.\d+)?$/.test(String(o)));
      if (numeric.length) check(`${label} no rogue unrounded decoy (>4dp)`, numeric.every((o) => dpOf(String(o)) <= 4), q.options.join(" | "));
    }
  }
}

console.log(`Testing ${ALL_TOPICS.length} JUNIOR generators (${RUNS_PER_DIFF} runs per difficulty)...`);

for (const key of ALL_TOPICS) {
  const gen = G[key];
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
