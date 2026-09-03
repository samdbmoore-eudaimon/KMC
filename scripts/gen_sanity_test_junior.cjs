const path = require("path");
const { pathToFileURL } = require("url");
const ROOT = path.resolve(__dirname, "..");
const RUNS_PER_DIFF = 160;

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

async function main() {
const shared = await import(pathToFileURL(path.join(ROOT, "generators", "gen-shared.js")).href);
const mod = await import(`${pathToFileURL(path.join(ROOT, "generators", "junior-generators.js")).href}?sanity=${Date.now()}`);
shared.setActiveModuleKey("junior");
shared.setNamePools(shared.JUNIOR_NAMES_COMMON, shared.JUNIOR_NAMES_RARE, shared.JUNIOR_NAMES_EPIC, shared.JUNIOR_NAMES_LEGENDARY);
const G = mod.JUNIOR_G;
const STRUCTURES = mod.JUNIOR_STRUCTURES;
const ALL_TOPICS = shared.JUNIOR_TOPICS.map((topic) => topic.key);
if (!G || !STRUCTURES || !ALL_TOPICS.length) throw new Error("Junior curriculum exports missing");
shared.setModuleSharedVars(shared.JUNIOR_TOPICS, shared.JUNIOR_DEEP_TOPICS, G);

console.log(`Testing ${ALL_TOPICS.length} JUNIOR generators (${RUNS_PER_DIFF} runs per difficulty)...`);

for (const key of ALL_TOPICS) {
  const gen = G[key];
  const registry = STRUCTURES[key];
  check(`${key} has generator`, typeof gen === "function");
  check(`${key} has structure registry`, registry && typeof registry === "object");
  if (!gen || !registry) continue;
  for (let d = 1; d <= 4; d++) {
    const eligible = Object.entries(registry).filter(([, structure]) => structure.difficulties.includes(d)).map(([id]) => id);
    const reached = new Set();
    check(`${key} d${d} has at least five structures`, eligible.length >= 5, eligible.join(" | "));
    for (let i = 0; i < RUNS_PER_DIFF; i++) {
      let q;
      try { q = gen(d); } catch (e) {
        check(`${key} d${d} threw`, false, e.stack ? e.stack.split("\n").slice(0, 3).join(" | ") : e.message);
        continue;
      }
      const label = `${key} d${d}`;
      check(`${label} returned object`, q && typeof q === "object", JSON.stringify(q).slice(0, 150));
      if (!q) continue;
      if (q.structureId) reached.add(q.structureId);
      check(`${label} has q text`, typeof q.q === "string" && q.q.length > 5);
      check(`${label} has valid structureId`, typeof q.structureId === "string" && eligible.includes(q.structureId), q.structureId);
      check(`${label} has variantId`, typeof q.variantId === "string" && q.variantId.length > 0, q.variantId);
      check(`${label} has representation`, ["story", "diagram", "direct"].includes(q.representation), q.representation);
      check(`${label} reports difficulty`, q.difficulty === d, q.difficulty);
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
    check(`${key} d${d} reaches every structure`, eligible.every((id) => reached.has(id)), eligible.filter((id) => !reached.has(id)).join(" | "));
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
}

main().catch((error) => { console.error("BUILD/LOAD FAILED:", error.stack || error.message); process.exit(1); });
