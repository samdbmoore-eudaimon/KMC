// Embeds the new Home-screen overhaul art into PRIMARY_UI_ART: the tree/scarecrow meter
// pairs (a vivid version straight from the generator, plus a dim/silhouette twin derived
// programmatically via sharp so the two share exact pixel geometry for the clip-path
// reveal) and the 7 tile icons.
"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DIR = path.join(__dirname, "..", "card_art", "ninefold_orchard_ui");
const JSX = path.join(__dirname, "..", "KangarooMathsQuest.jsx");

async function vividDataUri(file, width) {
  const buf = await sharp(path.join(DIR, file)).resize({ width }).png({ quality: 85, compressionLevel: 9 }).toBuffer();
  console.log(`${file} (vivid): -> ${(buf.length / 1024).toFixed(0)}KB`);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

// Recolours every opaque pixel to a single dark, desaturated tone while preserving the
// original alpha shape exactly, using a porter-duff "dest-in" composite (destination =
// the dark rectangle, kept only where the source's alpha is opaque).
async function dimDataUri(file, width, tint) {
  // NOTE: sharp's .metadata() reports the SOURCE file's dimensions, not a pending
  // .resize()'s output — read the real post-resize size from the already-resized buffer.
  const srcBuf = await sharp(path.join(DIR, file)).resize({ width }).png().toBuffer();
  const meta = await sharp(srcBuf).metadata();
  const darkRect = await sharp({ create: { width: meta.width, height: meta.height, channels: 4, background: tint } }).png().toBuffer();
  const buf = await sharp(darkRect).composite([{ input: srcBuf, blend: "dest-in" }]).png({ quality: 85, compressionLevel: 9 }).toBuffer();
  console.log(`${file} (dim): -> ${(buf.length / 1024).toFixed(0)}KB`);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function iconDataUri(file) {
  const buf = await sharp(path.join(DIR, file)).resize({ width: 300 }).png({ quality: 82, compressionLevel: 9 }).toBuffer();
  console.log(`${file}: -> ${(buf.length / 1024).toFixed(0)}KB`);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function main() {
  const treeVivid = await vividDataUri("tree_meter.png", 460);
  const treeDim = await dimDataUri("tree_meter.png", 460, { r: 46, g: 58, b: 40, alpha: 0.55 });
  const scarecrowVivid = await vividDataUri("scarecrow_meter.png", 460);
  const scarecrowDim = await dimDataUri("scarecrow_meter.png", 460, { r: 30, g: 26, b: 38, alpha: 0.55 });

  const iconLessons = await iconDataUri("icon_lessons.png");
  const iconGuided = await iconDataUri("icon_guided.png");
  const iconPractice = await iconDataUri("icon_practice.png");
  const iconStorybook = await iconDataUri("icon_storybook.png");
  const iconTest = await iconDataUri("icon_test.png");
  const iconCards = await iconDataUri("icon_cards.png");
  const iconAdventures = await iconDataUri("icon_adventures.png");

  let jsx = fs.readFileSync(JSX, "utf8");
  const re = /(const PRIMARY_UI_ART = \{ \.\.\.JUNIOR_UI_ART, panelFrame: "[^"]+", logoCompact: "[^"]+", hubBg: "[^"]+")(, treeDim: "[^"]+", treeVivid: "[^"]+", scarecrowDim: "[^"]+", scarecrowVivid: "[^"]+", iconLessons: "[^"]+", iconGuided: "[^"]+", iconPractice: "[^"]+", iconStorybook: "[^"]+", iconTest: "[^"]+", iconCards: "[^"]+", iconAdventures: "[^"]+")?( \};)/;
  if (!re.test(jsx)) { console.error("PRIMARY_UI_ART needle not found"); process.exit(1); }
  const addition = `, treeDim: "${treeDim}", treeVivid: "${treeVivid}", scarecrowDim: "${scarecrowDim}", scarecrowVivid: "${scarecrowVivid}", iconLessons: "${iconLessons}", iconGuided: "${iconGuided}", iconPractice: "${iconPractice}", iconStorybook: "${iconStorybook}", iconTest: "${iconTest}", iconCards: "${iconCards}", iconAdventures: "${iconAdventures}"`;
  jsx = jsx.replace(re, (_m, head, _old, tail) => head + addition + tail);
  fs.writeFileSync(JSX, jsx, "utf8");
  console.log("\nEmbedded tree/scarecrow meter pairs and 7 tile icons into PRIMARY_UI_ART.");
}
main().catch((e) => { console.error(e); process.exit(1); });
