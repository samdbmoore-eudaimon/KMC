// One-off: drops the now-unused treeDim/scarecrowDim keys (dead since FillBar replaced
// the old dual-image reveal mechanic with a single riding icon) and renames
// treeVivid/scarecrowVivid to the module-agnostic meterPackIcon/meterBossIcon, so Junior
// can reuse the exact same PRIMARY_UI_ART shape/JSX code path with its own art.
"use strict";
const fs = require("fs");
const path = require("path");

const JSX = path.join(__dirname, "..", "KangarooMathsQuest.jsx");
let src = fs.readFileSync(JSX, "utf8");

function dropKey(key) {
  const re = new RegExp(`${key}: "[^"]+", `);
  if (!re.test(src)) throw new Error(`key not found: ${key}`);
  src = src.replace(re, "");
}
function renameKey(oldKey, newKey) {
  const re = new RegExp(`${oldKey}: "`, "g");
  const count = (src.match(re) || []).length;
  if (count === 0) throw new Error(`key not found: ${oldKey}`);
  src = src.replace(re, `${newKey}: "`);
  return count;
}

dropKey("treeDim");
dropKey("scarecrowDim");
console.log("Dropped treeDim/scarecrowDim (unused).");
console.log("Renamed treeVivid ->", renameKey("treeVivid", "meterPackIcon"), "occurrence(s)");
console.log("Renamed scarecrowVivid ->", renameKey("scarecrowVivid", "meterBossIcon"), "occurrence(s)");

fs.writeFileSync(JSX, src, "utf8");
