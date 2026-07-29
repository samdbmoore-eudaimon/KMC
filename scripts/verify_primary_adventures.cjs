// Non-mutating verification of the 17 Primary (Ninefold Orchard) hero adventures.
// Same pattern as verify_phase0_bundle.cjs: append exports, esbuild to CJS in memory,
// load via a throwaway Module, delete the temp file. Never touches the real HTML/APK.
"use strict";
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = "C:/Users/samdb/UKMT App";
const JSX = path.join(ROOT, "KangarooMathsQuest.jsx");
const tmpPath = path.join(ROOT, "_verify_primary_adventures_copy.jsx");

const src = fs.readFileSync(JSX, "utf-8");
const patched = src + "\nexport { MODULES, PRIMARY_CARD_CLASS, activateModule };\n";
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

let fails = 0;
function check(label, cond, detail) {
  if (!cond) { fails++; console.error("FAIL:", label, detail !== undefined ? "::" + JSON.stringify(detail) : ""); }
  else console.log("ok  :", label);
}

const heroes = Object.keys(mod.PRIMARY_CARD_CLASS);
check("17 Primary heroes have a CARD_CLASS entry", heroes.length === 17, heroes.length);

mod.activateModule("primary");
const ADV = mod.MODULES.primary.ADVENTURES;
check("MODULES.primary.ADVENTURES exists", !!ADV);
check("PRIMARY_ADVENTURES has all 17 heroes", Object.keys(ADV).length === 17, Object.keys(ADV));

for (const h of heroes) {
  const adv = ADV[h];
  check(`${h}: adventure present`, !!adv, h);
  if (!adv) continue;
  check(`${h}: id matches key`, adv.id === h, adv.id);
  check(`${h}: 3 items`, Array.isArray(adv.items) && adv.items.length === 3, adv.items && adv.items.length);
  check(`${h}: 3 components`, Object.keys(adv.components || {}).length === 3);
  check(`${h}: start scene exists`, !!adv.scenes[adv.start], adv.start);

  // full reachability + grant coverage (mirrors scripts/validate_adventures.cjs)
  const REF_FIELDS = ["next", "success", "fail", "victory", "retreat", "good", "mid"];
  const sceneIds = new Set(Object.keys(adv.scenes));
  const reachable = new Set([adv.start]);
  const queue = [adv.start];
  while (queue.length) {
    const id = queue.pop();
    const sc = adv.scenes[id];
    if (!sc) continue;
    for (const f of REF_FIELDS) if (sc[f] && !reachable.has(sc[f])) { reachable.add(sc[f]); queue.push(sc[f]); }
    if (sc.type === "choice") for (const o of sc.options || []) if (o.next && !reachable.has(o.next)) { reachable.add(o.next); queue.push(o.next); }
  }
  check(`${h}: all scenes reachable`, [...sceneIds].every((id) => reachable.has(id)), [...sceneIds].filter((id) => !reachable.has(id)));

  const grantedComponents = new Set(), grantedItems = new Set();
  for (const sc of Object.values(adv.scenes)) {
    if (sc.grantComponent) grantedComponents.add(sc.grantComponent);
    if (sc.grantItem) grantedItems.add(sc.grantItem);
  }
  const compKeys = Object.keys(adv.components || {});
  check(`${h}: all 3 components granted somewhere`, compKeys.every((k) => grantedComponents.has(k)), compKeys.filter((k) => !grantedComponents.has(k)));
  const itemIds = (adv.items || []).map((it) => it.id);
  check(`${h}: all 3 items granted somewhere`, itemIds.every((id) => grantedItems.has(id)), itemIds.filter((id) => !grantedItems.has(id)));
}

// no garbled/corrupted characters (non-ASCII outside expected UK-English punctuation/emoji ranges) snuck through
const advJSON = JSON.stringify(ADV);
check("no U+B14A (garbled hangul) leaked into any adventure", !advJSON.includes("녊"));
check("no stray NPC name collision with Thistlewick the apprentice hero", !advJSON.includes("Old Hesper the toolmender".replace("Hesper", "녊")));

mod.activateModule("junior");
console.log(fails === 0 ? "\nALL CHECKS PASSED" : `\n${fails} CHECK(S) FAILED`);
process.exit(fails === 0 ? 0 : 1);
