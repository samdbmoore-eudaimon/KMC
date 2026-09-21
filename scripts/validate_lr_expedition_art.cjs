const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const artRoot = path.join(__dirname, '..', 'assets', 'expeditions', 'production', 'lr');
const manifest = JSON.parse(fs.readFileSync(path.join(artRoot, 'manifest.json'), 'utf8'));
const requiredStates = ['idleFront', 'idleBack', 'action', 'exhausted', 'carry'];

function paths(value) {
  return typeof value === 'string' ? [value] : Object.values(value).flatMap(paths);
}

async function main() {
  const ids = Object.keys(manifest.characters);
  if (ids.length !== 30) throw new Error(`Expected 30 characters, found ${ids.length}`);
  for (const id of ids) {
    for (const state of requiredStates) {
      if (!manifest.characters[id][state]) throw new Error(`Missing ${state} for ${id}`);
    }
  }
  const files = paths({ backgrounds: manifest.backgrounds, characters: manifest.characters,
    terrain: manifest.terrain, mechanisms: manifest.mechanisms, enemies: manifest.enemies,
    props: manifest.props, effects: manifest.effects });
  for (const relative of files) {
    const file = path.join(artRoot, 'runtime', relative);
    if (!fs.existsSync(file)) throw new Error(`Missing asset: ${relative}`);
    const metadata = await sharp(file).metadata();
    if (relative.startsWith('backgrounds/')) continue;
    if (metadata.width !== 384 || metadata.height !== 384 || !metadata.hasAlpha) {
      throw new Error(`Bad sprite format: ${relative}`);
    }
    const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (const [x, y] of [[0, 0], [info.width - 1, 0], [0, info.height - 1], [info.width - 1, info.height - 1]]) {
      if (data[(y * info.width + x) * 4 + 3] > 16) throw new Error(`Opaque corner: ${relative}`);
    }
  }
  console.log(`${ids.length} characters, ${files.length} manifest assets: paths, dimensions and corners pass`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
