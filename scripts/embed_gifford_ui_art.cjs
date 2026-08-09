// Embeds the generated Gifford title-screen and hub UI chrome art into
// INTERMEDIATE_TITLE_ART (background/front/title — NOT mascot, Sam wants Rooke's
// mascot slot left as-is, same call as embed_primary_ui.cjs made for Primary/Pip) and
// INTERMEDIATE_UI_ART (panelFrame/logoCompact/hubBg/meter icons/nav icons) in
// KangarooMathsQuest.jsx, replacing the current bare Junior-chrome fallbacks.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DIR = path.join(__dirname, "..", "card_art", "gifford_ui");
const JSX = path.join(__dirname, "..", "KangarooMathsQuest.jsx");

async function toDataUri(file, { width, format, quality }) {
  let img = sharp(path.join(DIR, file)).resize({ width });
  img = format === "jpeg" ? img.jpeg({ quality }) : img.png({ quality, compressionLevel: 9 });
  const buf = await img.toBuffer();
  console.log(`${file}: -> ${(buf.length / 1024).toFixed(0)}KB`);
  return `data:image/${format};base64,${buf.toString("base64")}`;
}

async function main() {
  const background = await toDataUri("title_background.jpg", { width: 1400, format: "jpeg", quality: 85 });
  const front = await toDataUri("title_front.png", { width: 1400, format: "png", quality: 82 });
  const title = await toDataUri("title_wordmark.png", { width: 1000, format: "png", quality: 85 });
  const panelFrame = await toDataUri("panel_frame.png", { width: 520, format: "png", quality: 88 });

  const trimmedPath = path.join(DIR, "_logo_compact_trimmed.png");
  await sharp(path.join(DIR, "logo_compact.png")).trim().toFile(trimmedPath);
  const logoCompact = await toDataUri("_logo_compact_trimmed.png", { width: 900, format: "png", quality: 85 });
  fs.unlinkSync(trimmedPath);

  const hubBg = await toDataUri("hub_background.jpg", { width: 1800, format: "jpeg", quality: 85 });
  const meterPackIcon = await toDataUri("meter_pack_icon.png", { width: 300, format: "png", quality: 85 });
  const meterBossIcon = await toDataUri("meter_boss_icon.png", { width: 300, format: "png", quality: 85 });
  const iconLessons = await toDataUri("icon_lessons.png", { width: 300, format: "png", quality: 85 });
  const iconGuided = await toDataUri("icon_guided.png", { width: 300, format: "png", quality: 85 });
  const iconPractice = await toDataUri("icon_practice.png", { width: 300, format: "png", quality: 85 });
  const iconStorybook = await toDataUri("icon_storybook.png", { width: 300, format: "png", quality: 85 });
  const iconAcademy = await toDataUri("icon_academy.png", { width: 300, format: "png", quality: 85 });
  const iconOlympiad = await toDataUri("icon_olympiad.png", { width: 300, format: "png", quality: 85 });
  const iconTest = await toDataUri("icon_test.png", { width: 300, format: "png", quality: 85 });
  const iconCards = await toDataUri("icon_cards.png", { width: 300, format: "png", quality: 85 });
  const iconAdventures = await toDataUri("icon_adventures.png", { width: 300, format: "png", quality: 85 });

  let src = fs.readFileSync(JSX, "utf8");

  const titleNeedle = "const INTERMEDIATE_TITLE_ART = { ...JUNIOR_TITLE_ART };";
  if (!src.includes(titleNeedle)) { console.error("INTERMEDIATE_TITLE_ART needle not found"); process.exit(1); }
  src = src.replace(titleNeedle, `const INTERMEDIATE_TITLE_ART = { ...JUNIOR_TITLE_ART, background: "${background}", front: "${front}", title: "${title}" };`);

  const uiNeedle = "const INTERMEDIATE_UI_ART = { ...JUNIOR_UI_ART };";
  if (!src.includes(uiNeedle)) { console.error("INTERMEDIATE_UI_ART needle not found"); process.exit(1); }
  src = src.replace(
    uiNeedle,
    `const INTERMEDIATE_UI_ART = { ...JUNIOR_UI_ART, panelFrame: "${panelFrame}", logoCompact: "${logoCompact}", hubBg: "${hubBg}", meterPackIcon: "${meterPackIcon}", meterBossIcon: "${meterBossIcon}", iconLessons: "${iconLessons}", iconGuided: "${iconGuided}", iconPractice: "${iconPractice}", iconStorybook: "${iconStorybook}", iconAcademy: "${iconAcademy}", iconOlympiad: "${iconOlympiad}", iconTest: "${iconTest}", iconCards: "${iconCards}", iconAdventures: "${iconAdventures}" };`
  );

  fs.writeFileSync(JSX, src, "utf8");
  console.log("\nOverrode INTERMEDIATE_TITLE_ART.{background,front,title} and INTERMEDIATE_UI_ART.{panelFrame,logoCompact,hubBg,meter*,icon*}.");
}
main().catch((e) => { console.error(e); process.exit(1); });
