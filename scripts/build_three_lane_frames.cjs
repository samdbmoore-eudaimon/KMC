"use strict";

const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const jobs = [
  ["C:/Users/samdb/.codex/generated_images/01a038a7-006d-71f0-98db-1b8d64253ad4/exec-f064c3e4-3aec-4e72-b47f-47cd3ab0a1e7.png", path.join(ROOT, "Joey Assets", "Gifford", "GF Frame 3 Lanes.png"), [0, 418, 836, 1254]],
];

function mappedX(x, source, target) {
  if (x <= target[0] || x >= target[3]) return x;
  let segment = x <= target[1] ? 0 : x <= target[2] ? 1 : 2;
  const ratio = (x - target[segment]) / (target[segment + 1] - target[segment]);
  return source[segment] + ratio * (source[segment + 1] - source[segment]);
}

async function extractAlpha(input, output, anchors) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  const lane = (anchors[3] - anchors[0]) / 3;
  const targets = [anchors[0], anchors[0] + lane, anchors[0] + lane * 2, anchors[3]];
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const sx = Math.max(0, Math.min(info.width - 1, Math.round(mappedX(x, anchors, targets))));
    const i = (y * info.width + sx) * 3;
    const o = (y * info.width + x) * 4;
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
  console.log(`${output} | ${metadata.width}x${metadata.height} | alpha=${metadata.hasAlpha} | equal lane width=${lane.toFixed(1)}px | alphaMin=${stats.channels[3].min}`);
}

Promise.all(jobs.map(([input, output, anchors]) => extractAlpha(input, output, anchors))).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
