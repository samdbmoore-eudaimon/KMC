const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node scripts/clean_expedition_alpha.cjs <input> <output>");

function checkerboardPixel(data, offset) {
  if (data[offset + 3] < 8) return true;
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  return Math.max(red, green, blue) - Math.min(red, green, blue) < 13 && red > 178 && green > 178 && blue > 178;
}

async function clean() {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = info.width * info.height;
  const outside = new Uint8Array(pixels);
  const queue = [];
  const visit = (x, y) => {
    if (x < 0 || y < 0 || x >= info.width || y >= info.height) return;
    const pixel = y * info.width + x;
    if (outside[pixel] || !checkerboardPixel(data, pixel * 4)) return;
    outside[pixel] = 1;
    queue.push(pixel);
  };
  for (let x = 0; x < info.width; x += 1) { visit(x, 0); visit(x, info.height - 1); }
  for (let y = 1; y < info.height - 1; y += 1) { visit(0, y); visit(info.width - 1, y); }
  for (let index = 0; index < queue.length; index += 1) {
    const pixel = queue[index];
    const x = pixel % info.width;
    const y = Math.floor(pixel / info.width);
    for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) if (dx || dy) visit(x + dx, y + dy);
  }
  for (let pixel = 0; pixel < pixels; pixel += 1) if (outside[pixel]) {
    data[pixel * 4] = 0;
    data[pixel * 4 + 1] = 0;
    data[pixel * 4 + 2] = 0;
    data[pixel * 4 + 3] = 0;
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(384, 384, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(output);
}

clean().catch((error) => { console.error(error); process.exit(1); });
