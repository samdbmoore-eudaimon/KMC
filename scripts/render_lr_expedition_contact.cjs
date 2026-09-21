const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..', 'assets', 'expeditions', 'production', 'lr');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const ids = Object.keys(manifest.characters);
const qa = path.join(root, 'qa');
fs.mkdirSync(qa, { recursive: true });

async function contact(state) {
  const width = 1200, height = 1050, cellWidth = 200, cellHeight = 210;
  const layers = [];
  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    const x = index % 6 * cellWidth;
    const y = Math.floor(index / 6) * cellHeight;
    const sprite = path.join(root, 'runtime', manifest.characters[id][state]);
    layers.push({ input: await sharp(sprite).resize(176, 176, { fit: 'contain' }).png().toBuffer(), left: x + 12, top: y + 5 });
    const label = Buffer.from(`<svg width="200" height="24"><text x="100" y="17" text-anchor="middle" font-family="Arial" font-size="15" fill="#352d4e">${id}</text></svg>`);
    layers.push({ input: label, left: x, top: y + 181 });
  }
  await sharp({ create: { width, height, channels: 4, background: '#ebe8f3' } })
    .composite(layers).png().toFile(path.join(qa, `lr-${state}-contact-v1.png`));
}

Promise.all([contact('idleFront'), contact('carry')]).catch(error => { console.error(error); process.exitCode = 1; });
