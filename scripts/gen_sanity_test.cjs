// Full generator sanity sweep after the principle-based retrofit.
// Bundles the REAL source (KangarooMathsQuest.jsx) with `export { G }` appended,
// via esbuild to CJS, then drives every generator directly (bypassing makeQuestion's
// silent try/catch fallback, which would otherwise mask a throwing generator).
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = "C:/Users/samdb/UKMT App";
const JSX = path.join(ROOT, "KangarooMathsQuest.jsx");
const TMP = path.join(ROOT, "..", "scratchpad_gen_test_copy.jsx");

const src = fs.readFileSync(JSX, "utf-8");
const patched = src + "\nexport { G };\n";
const tmpPath = "C:/Users/samdb/UKMT App/_gen_test_copy.jsx";
fs.writeFileSync(tmpPath, patched, "utf-8");

let mod;
try {
  const result = esbuild.buildSync({
    entryPoints: [tmpPath],
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
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

const G = mod.G;
if (!G) { console.error("G not exported"); process.exit(1); }

const ALL_TOPICS = Object.keys(G);
const RETROFIT_TOPICS = [
  "angleIso","angleRhombus","trianglesInRect","midpointSquare",
  "partitionRect","poolPath","compoundPerimeter","cubeProps",
  "ratioChain","multiRate","inverseProp","estimation",
  "sportScore","tiling","seating","productOpt",
  "calendar","workBackwards","repeatOp","agePuzzle",
];

let fails = 0, total = 0;
const problems = [];
function check(label, cond, detail) {
  total++;
  if (!cond) { fails++; problems.push(`${label}${detail ? " :: " + detail : ""}`); }
}

const UNIT_TOKENS = ["£", "kg", "°", "cm", "km", "m ", "ml", "hours", "minutes"];
function scanLeaks(q, label) {
  const text = JSON.stringify(q);
  check(`${label} no debug leak`, !/adjust:|checking constraints|TODO|\bundefined\b|\bNaN\b|\[object Object\]/i.test(text), text.slice(0, 160));
  // buildMCStr pads to 4 distractors with a literal "correct·N" filler when given fewer than 4
  // genuinely distinct decoys — a real generator bug (weak decoy space), not just a debug leak.
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
      const numeric = q.options.filter((o) => /^-?\d+(\.\d+)?$/.test(String(o)));
      if (numeric.length) check(`${label} no rogue unrounded decoy (>4dp)`, numeric.every((o) => dpOf(String(o)) <= 4), q.options.join(" | "));
    }
  }
}

console.log(`Testing ${ALL_TOPICS.length} generators (${RETROFIT_TOPICS.length} retrofitted this session)...`);

for (const key of ALL_TOPICS) {
  const gen = G[key];
  const runsPerDiff = RETROFIT_TOPICS.includes(key) ? 150 : 30;
  for (let d = 1; d <= 4; d++) {
    for (let i = 0; i < runsPerDiff; i++) {
      let q;
      try {
        q = gen(d);
      } catch (e) {
        check(`${key} d${d} threw`, false, e.message);
        continue;
      }
      const label = `${key} d${d}`;
      check(`${label} returned object`, q && typeof q === "object", JSON.stringify(q).slice(0, 100));
      if (!q) continue;
      check(`${label} has q text`, typeof q.q === "string" && q.q.length > 5);
      const hasMC = Array.isArray(q.options) && Number.isInteger(q.correctIndex);
      check(`${label} has options+correctIndex`, hasMC, JSON.stringify(q).slice(0, 200));
      if (hasMC) {
        check(`${label} options length 5`, q.options.length === 5, q.options.join(" | "));
        check(`${label} options distinct`, new Set(q.options).size === q.options.length, q.options.join(" | "));
        check(`${label} correctIndex in range`, q.correctIndex >= 0 && q.correctIndex < q.options.length, q.correctIndex);
      }
      check(`${label} has solution`, Array.isArray(q.solution) && q.solution.length > 0, JSON.stringify(q.solution).slice(0, 100));
      scanLeaks(q, label);
    }
  }
}

console.log(`\nTOTAL: ${total} checks, ${fails} fails`);
if (fails > 0) {
  console.log("\nFirst 40 problems:");
  problems.slice(0, 40).forEach(p => console.log(" - " + p));
  process.exit(1);
} else {
  console.log("ALL GREEN");
}
