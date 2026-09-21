const sharp = require('sharp');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ui = path.join(root, 'assets', 'expeditions', 'production', '9fo', 'runtime', 'ui');

const buttons = [
  { id: 'move', label: 'Move', icon: 'po-icon-move-v1.webp' },
  { id: 'pick-up', label: 'Pick up', icon: 'po-icon-collect-v1.webp' }
];

const states = [
  { id: 'normal', frame: 'po-button-available-v1.webp', opacity: 1, saturation: 1, brightness: 1 },
  { id: 'selected', frame: 'po-button-selected-v1.webp', opacity: 1, saturation: 1, brightness: 1 },
  { id: 'disabled', frame: 'po-button-disabled-v1.webp', opacity: 0.56, saturation: 0.25, brightness: 0.9 }
];

function labelSvg(label, state) {
  const fill = state === 'disabled' ? '#d8d5c8' : '#fff4cf';
  const stroke = state === 'disabled' ? '#4e514d' : '#4b2412';
  const x = 1460;
  const size = label === 'Pick up' ? 158 : 190;
  return Buffer.from(`<svg width="2172" height="724" xmlns="http://www.w3.org/2000/svg"><text x="${x}" y="458" text-anchor="middle" font-family="Georgia, serif" font-size="${size}" font-weight="700" fill="${fill}" stroke="${stroke}" stroke-width="24" paint-order="stroke" letter-spacing="2">${label}</text></svg>`);
}

async function makeButton(button, state) {
  const framePipeline = sharp(path.join(ui, state.frame)).resize(2172, 724, { fit: 'contain' });
  if (state.id === 'disabled') {
    framePipeline.composite([{ input: Buffer.from('<svg width="2172" height="724" xmlns="http://www.w3.org/2000/svg"><rect width="2172" height="724" fill="#9eae9a" fill-opacity="0.22"/></svg>'), blend: 'multiply' }]);
  }
  const frame = await framePipeline.png().toBuffer();
  const icon = await sharp(path.join(ui, button.icon))
    .resize(500, 500, { fit: 'contain' })
    .modulate({ saturation: state.saturation, brightness: state.brightness })
    .ensureAlpha()
    .linear(1, 0)
    .composite([{ input: Buffer.from(`<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="500" fill="white" fill-opacity="${state.opacity}"/></svg>`), blend: 'dest-in' }])
    .png()
    .toBuffer();
  const out = path.join(ui, `po-action-${button.id}-${state.id}-v1.png`);
  await sharp(frame)
    .composite([
      { input: icon, left: 365, top: 112 },
      { input: labelSvg(button.label, state), left: 0, top: 0 }
    ])
    .png()
    .toFile(out);
  return out;
}

(async () => {
  for (const button of buttons) for (const state of states) await makeButton(button, state);
})();
