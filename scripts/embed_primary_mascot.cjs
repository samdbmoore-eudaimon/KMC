// One-off: resizes/compresses the generated Primary mascot (Pip) down to a
// reasonable icon size and overrides PRIMARY_TITLE_ART.mascot with it.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IN_PATH = path.join(__dirname, "..", "card_art", "ninefold_orchard_ui", "pip_mascot.png");
const JSX = path.join(__dirname, "..", "KangarooMathsQuest.jsx");

async function main() {
  const outBuf = await sharp(IN_PATH).resize(512, 512, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer();
  console.log(`Mascot: ${(fs.statSync(IN_PATH).size / 1024).toFixed(0)}KB -> ${(outBuf.length / 1024).toFixed(0)}KB`);
  const dataUri = `data:image/jpeg;base64,${outBuf.toString("base64")}`;

  let src = fs.readFileSync(JSX, "utf8");
  const needle = "const PRIMARY_TITLE_ART = { ...JUNIOR_TITLE_ART };";
  if (!src.includes(needle)) { console.error("Needle not found"); process.exit(1); }
  const replacement = `const PRIMARY_TITLE_ART = { ...JUNIOR_TITLE_ART, mascot: "${dataUri}" };`;
  src = src.replace(needle, replacement);
  fs.writeFileSync(JSX, src, "utf8");
  console.log("Overrode PRIMARY_TITLE_ART.mascot with the generated Pip art.");
}
main().catch((e) => { console.error(e); process.exit(1); });
