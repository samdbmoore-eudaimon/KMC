const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node scripts/prepare_title_logo.cjs input.png output.png");

(async () => {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = info.width * info.height;
  const visited = new Uint8Array(pixels);
  const queue = new Uint32Array(pixels);
  let head = 0;
  let tail = 0;

  const isBackground = (index) => {
    const offset = index * 3;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    return Math.min(r, g, b) >= 235 && Math.max(r, g, b) - Math.min(r, g, b) <= 8;
  };

  const add = (index) => {
    if (!visited[index] && isBackground(index)) {
      visited[index] = 1;
      queue[tail++] = index;
    }
  };

  for (let x = 0; x < info.width; x++) {
    add(x);
    add((info.height - 1) * info.width + x);
  }
  for (let y = 0; y < info.height; y++) {
    add(y * info.width);
    add(y * info.width + info.width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % info.width;
    const y = Math.floor(index / info.width);
    if (x > 0) add(index - 1);
    if (x + 1 < info.width) add(index + 1);
    if (y > 0) add(index - info.width);
    if (y + 1 < info.height) add(index + info.width);
  }

  // Enclosed counters in letters cannot be reached by the edge flood fill.
  // Remove the same near-white neutral grid pixels wherever they occur.
  for (let index = 0; index < pixels; index++) {
    if (isBackground(index)) visited[index] = 1;
  }

  // Enclosed counters in letters cannot be reached by the edge flood fill.
  // Remove the same near-white neutral grid pixels wherever they occur.
  for (let index = 0; index < pixels; index++) {
    if (isBackground(index)) visited[index] = 1;
  }

  const rgba = Buffer.allocUnsafe(pixels * 4);
  for (let index = 0; index < pixels; index++) {
    const source = index * 3;
    const target = index * 4;
    rgba[target] = data[source];
    rgba[target + 1] = data[source + 1];
    rgba[target + 2] = data[source + 2];
    rgba[target + 3] = visited[index] ? 0 : 255;
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(output);
})();
