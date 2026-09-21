const sharp = require('sharp');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ui = path.join(root, 'assets', 'expeditions', 'production', '9fo', 'runtime', 'ui');
const ids = ['move', 'pick-up', 'put-down', 'guard', 'attack', 'rotate', 'undo', 'end-round'];

async function makeState(id, state) {
  const source = path.join(ui, `po-action-${id}-normal-v2.png`);
  const image = sharp(source).ensureAlpha();
  if (state === 'disabled') {
    await image.modulate({ saturation: 0.28, brightness: 0.82 }).tint('#a6b0a2').png().toFile(path.join(ui, `po-action-${id}-disabled-v2.png`));
    return;
  }
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const glow = Buffer.from(data);
  for (let i = 0; i < glow.length; i += 4) {
    glow[i] = 26;
    glow[i + 1] = 204;
    glow[i + 2] = 255;
    glow[i + 3] = Math.min(210, glow[i + 3]);
  }
  const glowPng = await sharp(glow, { raw: info }).blur(18).png().toBuffer();
  await sharp(source)
    .composite([{ input: glowPng, blend: 'screen' }])
    .modulate({ saturation: 1.06, brightness: 1.02 })
    .png()
    .toFile(path.join(ui, `po-action-${id}-selected-v2.png`));
}

(async () => {
  for (const id of ids) {
    if (id === 'move' || id === 'pick-up') continue;
    await makeState(id, 'selected');
    await makeState(id, 'disabled');
  }
})();
