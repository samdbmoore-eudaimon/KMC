"use strict";

const sharp = require("sharp");

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node scripts/extract_generated_alpha.cjs <input> <output>");

async function main() {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const minimum = Math.min(r, g, b);
    const neutral = Math.max(r, g, b) - minimum <= 9;
    let alpha = 255;
    if (neutral && minimum >= 238) alpha = 0;
    else if (neutral && minimum >= 220) alpha = Math.round(255 * (238 - minimum) / 18);
    rgba[o] = r; rgba[o + 1] = g; rgba[o + 2] = b; rgba[o + 3] = alpha;
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(output);
  const metadata = await sharp(output).metadata();
  const stats = await sharp(output).stats();
  console.log(`${output} | ${metadata.width}x${metadata.height} | alpha=${metadata.hasAlpha} | alphaMin=${stats.channels[3].min}`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
