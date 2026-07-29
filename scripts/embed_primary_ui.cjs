// One-off: resizes/compresses the generated Ninefold Orchard title-screen and UI chrome
// art, then overrides PRIMARY_TITLE_ART (background/front/title — NOT mascot, Sam wants
// the original wizard kangaroo kept) and PRIMARY_UI_ART (panelFrame/logoCompact) in
// KangarooMathsQuest.jsx with the real art in place of the borrowed Junior chrome.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard_ui");
const JSX = path.join(__dirname, "..", "KangarooMathsQuest.jsx");

async function toDataUri(file, { width, format, quality }) {
  let img = sharp(path.join(DIR, file)).resize({ width });
  img = format === "jpeg" ? img.jpeg({ quality }) : img.png({ quality, compressionLevel: 9 });
  const buf = await img.toBuffer();
  console.log(`${file}: -> ${(buf.length / 1024).toFixed(0)}KB`);
  return `data:image/${format};base64,${buf.toString("base64")}`;
}

async function main() {
  const background = await toDataUri("title_background.png", { width: 1400, format: "jpeg", quality: 85 });
  const front = await toDataUri("title_front.png", { width: 1400, format: "png", quality: 82 });
  const title = await toDataUri("title_logo.png", { width: 1000, format: "png", quality: 85 });
  const panelFrame = await toDataUri("panel_frame.png", { width: 520, format: "png", quality: 88 });

  // logoCompact carries a lot of transparent padding straight out of the generator —
  // trim it first so the letters fill the tiny 26px header slot instead of shrinking
  // inside dead space.
  const trimmedPath = path.join(DIR, "_logo_compact_trimmed.png");
  await sharp(path.join(DIR, "logo_compact.png")).trim().toFile(trimmedPath);
  const logoCompact = await toDataUri("_logo_compact_trimmed.png", { width: 900, format: "png", quality: 85 });
  fs.unlinkSync(trimmedPath);

  let src = fs.readFileSync(JSX, "utf8");

  const titleNeedle = "const PRIMARY_TITLE_ART = { ...JUNIOR_TITLE_ART };";
  if (!src.includes(titleNeedle)) { console.error("PRIMARY_TITLE_ART needle not found"); process.exit(1); }
  src = src.replace(titleNeedle, `const PRIMARY_TITLE_ART = { ...JUNIOR_TITLE_ART, background: "${background}", front: "${front}", title: "${title}" };`);

  const uiNeedle = "const PRIMARY_UI_ART = { ...JUNIOR_UI_ART };";
  if (!src.includes(uiNeedle)) { console.error("PRIMARY_UI_ART needle not found"); process.exit(1); }
  src = src.replace(uiNeedle, `const PRIMARY_UI_ART = { ...JUNIOR_UI_ART, panelFrame: "${panelFrame}", logoCompact: "${logoCompact}" };`);

  fs.writeFileSync(JSX, src, "utf8");
  console.log("\nOverrode PRIMARY_TITLE_ART.{background,front,title} and PRIMARY_UI_ART.{panelFrame,logoCompact}.");
}
main().catch((e) => { console.error(e); process.exit(1); });
