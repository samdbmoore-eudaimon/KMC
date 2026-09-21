const path = require("node:path");
const { pathToFileURL } = require("node:url");
const sharp = require("sharp");

const output = "assets/expeditions/production/9fo/qa/hex-projection-v4.png";
const side = 50;
const padding = 55;

function radiusKeys(radius) {
  const keys = [];
  for (let q = -radius; q <= radius; q += 1) {
    for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r += 1) keys.push(`${q},${r}`);
  }
  return keys;
}

function points(vertices) {
  return vertices.map((point) => `${point.x.toFixed(3)},${point.y.toFixed(3)}`).join(" ");
}

async function render() {
  const layoutUrl = pathToFileURL(path.resolve("expeditions/expedition-hex-layout.js")).href;
  const { axialToPixel, pointyHexBounds, pointyHexVertices } = await import(layoutUrl);
  const keys = radiusKeys(3);
  const bounds = pointyHexBounds(keys, side);
  const width = Math.ceil(bounds.width + 2 * padding);
  const height = Math.ceil(bounds.height + 2 * padding);
  const origin = { x: padding - bounds.minX, y: padding - bounds.minY };
  const cells = keys.map((key) => ({ key, centre: axialToPixel(key, side, origin) })).sort((a, b) => a.centre.y - b.centre.y || a.centre.x - b.centre.x);
  const polygons = cells.map(({ key, centre }, index) => {
    const fill = index % 2 ? "#9fcf67" : "#b9df77";
    return `<g><polygon points="${points(pointyHexVertices(centre, side))}" fill="${fill}" stroke="#173d47" stroke-width="1"/><circle cx="${centre.x}" cy="${centre.y}" r="2.5" fill="#ff4b35"/><text x="${centre.x}" y="${centre.y + 4}" text-anchor="middle" font-family="Arial" font-size="10" font-weight="700" fill="#173224">${key}</text></g>`;
  }).join("");
  const originCentre = axialToPixel("0,0", side, origin);
  const originEdges = pointyHexVertices(originCentre, side);
  const guides = originEdges.map((point, index) => `<line x1="${originCentre.x}" y1="${originCentre.y}" x2="${point.x}" y2="${point.y}" stroke="#fff" stroke-width="1.5"/><text x="${point.x}" y="${point.y - 4}" text-anchor="middle" font-family="Arial" font-size="9" fill="#fff">v${index}</text>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#245663"/><g>${polygons}</g><g>${guides}</g><text x="20" y="28" font-family="Arial" font-size="15" font-weight="700" fill="#fff">Pointy-top regular hex QA: s=50, W=86.6025, row=75, offset=43.3013</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(output);
  console.log(`${output}: ${width}x${height}`);
}

render().catch((error) => { console.error(error); process.exit(1); });
