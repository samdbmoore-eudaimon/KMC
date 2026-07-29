// Embeds the Junior Home-screen overhaul art into JUNIOR_UI_ART_EXT: a hub background,
// the two meter icons, and the 9 tile icons. Junior's own existing panelFrame border
// art (already in JUNIOR_UI_ART) is reused as-is for the FillBar frame — nothing new
// needed there.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DIR = path.join(__dirname, "..", "card_art", "little_reckoning_ui");
const JSX = path.join(__dirname, "..", "KangarooMathsQuest.jsx");

async function hubBgDataUri() {
  const srcPath = path.join(DIR, "hub_background.png");
  const orig = await sharp(srcPath).metadata();
  const width = 1800, height = Math.round(orig.height * (1800 / orig.width));
  const wash = await sharp({ create: { width, height, channels: 4, background: { r: 20, g: 18, b: 40, alpha: 0.12 } } }).png().toBuffer();
  const buf = await sharp(srcPath).resize({ width, height }).blur(1.2).composite([{ input: wash }]).jpeg({ quality: 85 }).toBuffer();
  console.log(`hub_background.png: -> ${(buf.length / 1024).toFixed(0)}KB`);
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

async function iconDataUri(file, width) {
  const buf = await sharp(path.join(DIR, file)).resize({ width }).png({ quality: 85, compressionLevel: 9 }).toBuffer();
  console.log(`${file}: -> ${(buf.length / 1024).toFixed(0)}KB`);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function main() {
  const hubBg = await hubBgDataUri();
  const meterPackIcon = await iconDataUri("meter_pack.png", 300);
  const meterBossIcon = await iconDataUri("meter_boss.png", 300);
  const iconLessons = await iconDataUri("icon_lessons.png", 300);
  const iconGuided = await iconDataUri("icon_guided.png", 300);
  const iconPractice = await iconDataUri("icon_practice.png", 300);
  const iconStorybook = await iconDataUri("icon_storybook.png", 300);
  const iconAcademy = await iconDataUri("icon_academy.png", 300);
  const iconOlympiad = await iconDataUri("icon_olympiad.png", 300);
  const iconTest = await iconDataUri("icon_test.png", 300);
  const iconCards = await iconDataUri("icon_cards.png", 300);
  const iconAdventures = await iconDataUri("icon_adventures.png", 300);

  let jsx = fs.readFileSync(JSX, "utf8");
  const bareNeedle = "const JUNIOR_UI_ART_EXT = { ...JUNIOR_UI_ART };";
  const filledRe = /const JUNIOR_UI_ART_EXT = \{ \.\.\.JUNIOR_UI_ART(?:, hubBg: "[^"]+", meterPackIcon: "[^"]+", meterBossIcon: "[^"]+", iconLessons: "[^"]+", iconGuided: "[^"]+", iconPractice: "[^"]+", iconStorybook: "[^"]+", iconAcademy: "[^"]+", iconOlympiad: "[^"]+", iconTest: "[^"]+", iconCards: "[^"]+", iconAdventures: "[^"]+")? \};/;
  const replacement = `const JUNIOR_UI_ART_EXT = { ...JUNIOR_UI_ART, hubBg: "${hubBg}", meterPackIcon: "${meterPackIcon}", meterBossIcon: "${meterBossIcon}", iconLessons: "${iconLessons}", iconGuided: "${iconGuided}", iconPractice: "${iconPractice}", iconStorybook: "${iconStorybook}", iconAcademy: "${iconAcademy}", iconOlympiad: "${iconOlympiad}", iconTest: "${iconTest}", iconCards: "${iconCards}", iconAdventures: "${iconAdventures}" };`;
  if (filledRe.test(jsx)) {
    jsx = jsx.replace(filledRe, replacement);
    console.log("Replaced existing JUNIOR_UI_ART_EXT overrides.");
  } else if (jsx.includes(bareNeedle)) {
    jsx = jsx.replace(bareNeedle, replacement);
    console.log("Added JUNIOR_UI_ART_EXT overrides.");
  } else {
    console.error("JUNIOR_UI_ART_EXT needle not found — has add_junior_ui_ext.cjs run?");
    process.exit(1);
  }
  fs.writeFileSync(JSX, jsx, "utf8");
}
main().catch((e) => { console.error(e); process.exit(1); });
