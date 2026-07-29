// One-off: derives a soft, washed-out ambient background for Primary's interactive hub
// screens from the existing title_background art (blurred + lightened so card text and
// borders stay legible on top of it), and embeds it as PRIMARY_UI_ART.hubBg. Junior and
// Intermediate get no such key, so their look is untouched — Home() only switches to the
// image treatment when UI_ART.hubBg is actually present.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard_ui");
const JSX = path.join(__dirname, "..", "KangarooMathsQuest.jsx");

async function main() {
  const srcPath = path.join(DIR, "title_background.png");
  const orig = await sharp(srcPath).metadata();
  const width = 1800, height = Math.round(orig.height * (1800 / orig.width));
  // Sam wants the background to read as the dominant feature, not a faint wash — keep it
  // sharp and vivid, just a touch of blur to stop it fighting with foreground text/art.
  const wash = await sharp({ create: { width, height, channels: 4, background: { r: 255, g: 250, b: 240, alpha: 0.18 } } }).png().toBuffer();
  const buf = await sharp(srcPath).resize({ width, height }).blur(1.5).composite([{ input: wash }]).jpeg({ quality: 85 }).toBuffer();
  console.log(`hubBg: -> ${(buf.length / 1024).toFixed(0)}KB`);
  const hubBg = `data:image/jpeg;base64,${buf.toString("base64")}`;

  let jsx = fs.readFileSync(JSX, "utf8");
  const withHubBg = /const PRIMARY_UI_ART = \{ \.\.\.JUNIOR_UI_ART, panelFrame: "[^"]+", logoCompact: "[^"]+", hubBg: "[^"]+"(.*?) \};/;
  const withoutHubBg = /const PRIMARY_UI_ART = \{ \.\.\.JUNIOR_UI_ART, panelFrame: "[^"]+", logoCompact: "[^"]+" \};/;
  if (withHubBg.test(jsx)) {
    jsx = jsx.replace(withHubBg, (_m, rest) => _m.replace(/hubBg: "[^"]+"/, `hubBg: "${hubBg}"`));
    console.log("Replaced existing PRIMARY_UI_ART.hubBg.");
  } else if (withoutHubBg.test(jsx)) {
    jsx = jsx.replace(withoutHubBg, (m) => m.replace(/ \};$/, `, hubBg: "${hubBg}" };`));
    console.log("Added PRIMARY_UI_ART.hubBg.");
  } else {
    console.error("PRIMARY_UI_ART override needle not found — has embed_primary_ui.cjs already run?");
    process.exit(1);
  }
  fs.writeFileSync(JSX, jsx, "utf8");
}
main().catch((e) => { console.error(e); process.exit(1); });
