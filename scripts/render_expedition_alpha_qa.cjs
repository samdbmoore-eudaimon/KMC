const path = require("node:path");
const sharp = require("sharp");

const [output, ...files] = process.argv.slice(2);
if (!output || !files.length) throw new Error("Usage: node scripts/render_expedition_alpha_qa.cjs <output.png> <asset...>");

const backgrounds = [
  { name: "WHITE", colour: "#ffffff", label: "#161616" },
  { name: "BLACK", colour: "#101010", label: "#ffffff" },
  { name: "ORCHARD", colour: "#315b3f", label: "#ffffff" },
  { name: "CYAN", colour: "#00e5ff", label: "#10242a" },
];
const cellWidth = 230;
const cellHeight = 230;
const headerHeight = 34;
const labelHeight = 30;

function labelSvg(text, width, height, colour, size = 13) {
  const safe = text.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><text x="${width / 2}" y="${height * .68}" text-anchor="middle" font-family="Arial" font-size="${size}" font-weight="700" fill="${colour}">${safe}</text></svg>`);
}

async function render() {
  const width = backgrounds.length * cellWidth;
  const height = headerHeight + files.length * (cellHeight + labelHeight);
  const composites = [];
  backgrounds.forEach((background, column) => {
    composites.push({ input: labelSvg(background.name, cellWidth, headerHeight, background.label), left: column * cellWidth, top: 0 });
  });
  for (let row = 0; row < files.length; row += 1) {
    const file = files[row];
    const image = await sharp(file).resize(cellWidth - 28, cellHeight - 28, { fit: "contain" }).png().toBuffer();
    const filename = path.basename(file);
    backgrounds.forEach((background, column) => {
      const left = column * cellWidth;
      const top = headerHeight + row * (cellHeight + labelHeight);
      composites.push({ input: { create: { width: cellWidth, height: cellHeight + labelHeight, channels: 4, background: background.colour } }, left, top });
      composites.push({ input: image, left: left + 14, top: top + 14 });
      composites.push({ input: labelSvg(filename, cellWidth, labelHeight, background.label, 11), left, top: top + cellHeight });
    });
  }
  await sharp({ create: { width, height, channels: 4, background: "#1b2d31" } }).composite(composites).png().toFile(output);
  console.log(`${output}: ${width}x${height}`);
}

render().catch((error) => { console.error(error); process.exit(1); });
