const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const darkBackground = process.argv.includes("--dark");
const files = process.argv.slice(2).filter((file) => file !== "--dark");
if (!files.length) throw new Error("Pass one or more PNG paths");

function isBackdrop(data, offset) {
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];
  const high = Math.max(r, g, b);
  const low = Math.min(r, g, b);
  if (darkBackground) return high <= 12;
  return (r + g + b) / 3 >= 185 && high - low <= 32;
}

async function repair(file) {
  const absolute = path.resolve(file);
  const { data, info } = await sharp(absolute).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const seen = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  function add(x, y) {
    const index = y * width + x;
    if (seen[index] || !isBackdrop(data, index * 4)) return;
    seen[index] = 1;
    queue[tail++] = index;
  }

  for (let x = 0; x < width; x++) {
    add(x, 0);
    add(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    add(0, y);
    add(width - 1, y);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = (index / width) | 0;
    if (x > 0) add(x - 1, y);
    if (x + 1 < width) add(x + 1, y);
    if (y > 0) add(x, y - 1);
    if (y + 1 < height) add(x, y + 1);
  }

  for (let i = 0; i < seen.length; i++) {
    if (seen[i]) data[i * 4 + 3] = 0;
  }

  const temporary = absolute.replace(/\.png$/i, ".alpha-fix.png");
  await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile(temporary);
  fs.renameSync(temporary, absolute);
  console.log(`${path.basename(file)}: ${tail} transparent pixels`);
}

(async () => {
  for (const file of files) await repair(file);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
