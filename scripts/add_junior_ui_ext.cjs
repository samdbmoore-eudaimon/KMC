// One-off: introduces a JUNIOR_UI_ART_EXT wrapper (mirroring PRIMARY_UI_ART/
// INTERMEDIATE_UI_ART's `{ ...BASE, overrides }` pattern) so Junior can get its own Home
// overhaul art (hubBg, meter icons, tile icons) without touching the base kq-ui-art.js
// data file. Rewires the two UI_ART bindings that currently point straight at the plain
// import to use the extended wrapper instead.
"use strict";
const fs = require("fs");
const path = require("path");

const JSX = path.join(__dirname, "..", "KangarooMathsQuest.jsx");
let src = fs.readFileSync(JSX, "utf8");

const anchor = "const PRIMARY_UI_ART = { ...JUNIOR_UI_ART,";
const anchorIdx = src.indexOf(anchor);
if (anchorIdx === -1) throw new Error("PRIMARY_UI_ART anchor not found");
if (!src.includes("const JUNIOR_UI_ART_EXT")) {
  src = src.slice(0, anchorIdx) + "const JUNIOR_UI_ART_EXT = { ...JUNIOR_UI_ART };\n" + src.slice(anchorIdx);
  console.log("Inserted JUNIOR_UI_ART_EXT declaration.");
} else {
  console.log("JUNIOR_UI_ART_EXT already declared — skipping insertion.");
}

const before1 = "UI_ART: JUNIOR_UI_ART,";
const after1 = "UI_ART: JUNIOR_UI_ART_EXT,";
if (src.includes(before1)) { src = src.replace(before1, after1); console.log("Rewired MODULES.junior.UI_ART."); }
else if (!src.includes(after1)) throw new Error("MODULES.junior UI_ART binding not found");

const before2 = "let TITLE_ART = JUNIOR_TITLE_ART, UI_ART = JUNIOR_UI_ART;";
const after2 = "let TITLE_ART = JUNIOR_TITLE_ART, UI_ART = JUNIOR_UI_ART_EXT;";
if (src.includes(before2)) { src = src.replace(before2, after2); console.log("Rewired initial UI_ART binding."); }
else if (!src.includes(after2)) throw new Error("Initial UI_ART binding not found");

fs.writeFileSync(JSX, src, "utf8");
