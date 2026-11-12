"use strict";
const path = require("path");
const sharp = require("sharp");

const [input, output, topArg, leftArg] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node position_gifford_portrait.cjs input.png output.png");

async function main() {
  const width = 896;
  const height = 1232;
  const placedTop = Number.isFinite(Number(topArg)) ? Number(topArg) : 200;
  const placedLeft = Number.isFinite(Number(leftArg)) ? Number(leftArg) : -60;
  const placedWidth = 896;
  const foreground = await sharp(input).resize({ width: placedWidth }).png().toBuffer();
  const background = await sharp(input).resize(width, height, { fit: "cover" }).blur(22).modulate({ brightness: 0.72 }).png().toBuffer();
  await sharp(background).composite([{ input: foreground, left: placedLeft, top: placedTop }]).png().toFile(output);
  console.log(path.resolve(output));
}
main().catch(error => { console.error(error); process.exit(1); });
