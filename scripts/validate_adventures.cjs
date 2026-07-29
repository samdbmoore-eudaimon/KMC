// Validates PRIMARY_ADVENTURES scene graphs: every next/success/fail/victory/retreat/good/mid
// reference must resolve to a real scene, items/components must be internally consistent,
// puzzle/dice answer indices must be in range. Run against the assembled adventures file
// before splicing into kq-content.js. Non-mutating: only reads and reports.
"use strict";
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
if (!file) { console.error("Usage: node validate_adventures.cjs <path-to-adventures-object-literal-js>"); process.exit(1); }

const src = fs.readFileSync(file, "utf8");
// Evaluate the file as a JS module exporting ADVENTURES
const Module = require("module");
const m = new Module(file, module);
m.filename = file;
m.paths = Module._nodeModulePaths(path.dirname(file));
m._compile("module.exports = " + src, file);
const ADVENTURES = m.exports;

const REF_FIELDS = ["next", "success", "fail", "victory", "retreat", "good", "mid"];
let totalErrors = 0;

for (const heroId of Object.keys(ADVENTURES)) {
  const adv = ADVENTURES[heroId];
  const errs = [];
  if (adv.id !== heroId) errs.push(`id mismatch: key=${heroId} but id=${adv.id}`);
  if (!adv.scenes[adv.start]) errs.push(`start scene "${adv.start}" does not exist`);

  const itemIds = (adv.items || []).map((it) => it.id);
  if (itemIds.length !== 3) errs.push(`expected 3 items, found ${itemIds.length}`);
  const expectedHows = ["found", "quest", "forged"];
  (adv.items || []).forEach((it, i) => {
    if (it.how !== expectedHows[i]) errs.push(`item[${i}] how="${it.how}", expected "${expectedHows[i]}"`);
    if (typeof it.stat !== "number" || it.stat < 0 || it.stat > 4) errs.push(`item[${i}] stat out of range: ${it.stat}`);
  });

  const compKeys = Object.keys(adv.components || {});
  if (compKeys.length !== 3) errs.push(`expected 3 components, found ${compKeys.length}`);

  const sceneIds = new Set(Object.keys(adv.scenes));
  const grantedComponents = new Set();
  const grantedItems = new Set();

  for (const [sceneId, sc] of Object.entries(adv.scenes)) {
    if (!sc.type) errs.push(`scene "${sceneId}" missing type`);
    if (!sc.emoji && sc.type !== "end") errs.push(`scene "${sceneId}" missing emoji`);
    if (!sc.text && sc.type !== "end") errs.push(`scene "${sceneId}" missing text`);

    for (const f of REF_FIELDS) {
      if (sc[f] !== undefined && !sceneIds.has(sc[f])) {
        errs.push(`scene "${sceneId}".${f} -> "${sc[f]}" does not exist`);
      }
    }
    if (sc.grantComponent) {
      if (!compKeys.includes(sc.grantComponent)) errs.push(`scene "${sceneId}" grants unknown component "${sc.grantComponent}"`);
      grantedComponents.add(sc.grantComponent);
    }
    if (sc.grantItem) {
      if (!itemIds.includes(sc.grantItem)) errs.push(`scene "${sceneId}" grants unknown item "${sc.grantItem}"`);
      grantedItems.add(sc.grantItem);
    }
    if (sc.type === "puzzle") {
      if (!Array.isArray(sc.options) || sc.options.length < 2) errs.push(`puzzle "${sceneId}" needs options array`);
      if (typeof sc.answer !== "number" || sc.answer < 0 || sc.answer >= (sc.options || []).length) errs.push(`puzzle "${sceneId}" answer index ${sc.answer} out of range`);
      if (!sc.good || !sc.mid) errs.push(`puzzle "${sceneId}" missing good/mid`);
    }
    if (sc.type === "dice") {
      if (!sc.predict) errs.push(`dice "${sceneId}" missing predict`);
      else {
        if (typeof sc.predict.answer !== "number" || sc.predict.answer < 0 || sc.predict.answer >= (sc.predict.options || []).length) errs.push(`dice "${sceneId}" predict.answer out of range`);
      }
      if (!sc.success || !sc.fail) errs.push(`dice "${sceneId}" missing success/fail`);
    }
    if (sc.type === "skillcheck") {
      if (typeof sc.stat !== "number" || sc.stat < 0 || sc.stat > 4) errs.push(`skillcheck "${sceneId}" stat out of range`);
      if (!sc.success || !sc.fail) errs.push(`skillcheck "${sceneId}" missing success/fail`);
    }
    if (sc.type === "combat") {
      if (!sc.enemy || !sc.enemy.name || !sc.enemy.hits || !sc.enemy.toHit) errs.push(`combat "${sceneId}" incomplete enemy`);
      if (!sc.victory || !sc.retreat) errs.push(`combat "${sceneId}" missing victory/retreat`);
    }
    if (sc.type === "forge") {
      if (!sc.forged || !sc.notforged || !sc.grantItem || !sc.next) errs.push(`forge "${sceneId}" incomplete`);
    }
    if (sc.type === "end") {
      if (!sc.goodText || !sc.midText || !sc.grantItem) errs.push(`end "${sceneId}" incomplete`);
    }
  }

  compKeys.forEach((k) => { if (!grantedComponents.has(k)) errs.push(`component "${k}" is never granted by any scene`); });
  itemIds.forEach((id) => { if (!grantedItems.has(id)) errs.push(`item "${id}" is never granted by any scene`); });

  // every scene should be reachable from start (basic reachability check)
  const reachable = new Set([adv.start]);
  const queue = [adv.start];
  while (queue.length) {
    const id = queue.pop();
    const sc = adv.scenes[id];
    if (!sc) continue;
    for (const f of REF_FIELDS) {
      if (sc[f] && !reachable.has(sc[f])) { reachable.add(sc[f]); queue.push(sc[f]); }
    }
    if (sc.type === "choice") for (const o of sc.options || []) if (o.next && !reachable.has(o.next)) { reachable.add(o.next); queue.push(o.next); }
  }
  for (const id of sceneIds) if (!reachable.has(id)) errs.push(`scene "${id}" is unreachable from start`);

  if (errs.length) {
    console.log(`\n=== ${heroId}: ${errs.length} problem(s) ===`);
    errs.forEach((e) => console.log("  - " + e));
    totalErrors += errs.length;
  } else {
    console.log(`${heroId}: OK (${sceneIds.size} scenes, ${compKeys.length} components, ${itemIds.length} items)`);
  }
}

console.log(`\nTotal heroes checked: ${Object.keys(ADVENTURES).length}`);
console.log(`Total errors: ${totalErrors}`);
process.exit(totalErrors ? 1 : 0);
