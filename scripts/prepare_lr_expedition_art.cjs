const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..', 'assets', 'expeditions', 'production', 'lr');
const source = path.join(root, 'source-sheets');
const runtime = path.join(root, 'runtime');
const poses = ['idle-front', 'idle-back', 'action', 'exhausted'];
const characterGroups = [
  { ids: ['addy', 'zoomby', 'hunchik'], poses: 'lr-starter-characters-01-v1.png', carry: 'lr-starter-carry-01-v1.png' },
  { ids: ['countra', 'tritip', 'cubble', 'sparkfin'], poses: 'lr-card-characters-02-v1.png', carry: 'lr-card-carry-02-v1.png' },
  { ids: ['pebble', 'loopy', 'burrowl', 'squarby'], poses: 'lr-card-characters-03-v1.png', carry: 'lr-card-carry-03-v1.png' },
  { ids: ['frostcal', 'multimoo', 'anglorap', 'owlgorith'], poses: 'lr-card-characters-04-v1.png', carry: 'lr-card-carry-04-v1.png' },
  { ids: ['flaskfox', 'cheetawat', 'fractail', 'hexabug'], poses: 'lr-card-characters-05-v1.png', carry: 'lr-card-carry-05-v1.png' },
  { ids: ['voltbird', 'probear', 'seqviper', 'primearch'], poses: 'lr-card-characters-06-v1.png', carry: 'lr-card-carry-06-v1.png' },
  { ids: ['geodrake', 'paradox', 'quantakit', 'sphinxa'], poses: 'lr-card-characters-07-v1.png', carry: 'lr-card-carry-07-v1.png' },
  { ids: ['novabear', 'infinitus', 'euclidon'], poses: 'lr-card-characters-08-v1.png', carry: 'lr-card-carry-08-v1.png' },
];
const characters = characterGroups.flatMap(group => group.ids);
const terrain = ['moor-grass', 'parchment-path', 'flagstone', 'stream', 'stone-bridge', 'map-edge', 'ink-stone', 'crystal', 'operator-socket', 'start', 'exit', 'fog'];
const operatorStates = ['neutral', 'selected', 'turning', 'locked', 'obscured', 'complete'];
const fogThumbStates = ['idle-front', 'idle-back', 'obscure', 'blocked'];
const loadStates = ['neutral', 'selected', 'carried', 'guarded', 'split', 'combined', 'heavy', 'delivered'];
const effectStates = ['shadow', 'reachable', 'selected', 'danger', 'guard', 'impact', 'rotate', 'complete'];

async function cellBuffer(file, columns, rows, column, row) {
  const metadata = await sharp(file).metadata();
  const left = Math.round(column * metadata.width / columns);
  const right = Math.round((column + 1) * metadata.width / columns);
  const characterRows = [0, 390, 750, 1090, metadata.height];
  const customRows = rows === 4 && file.includes('lr-starter-characters-01');
  const top = customRows ? characterRows[row] : Math.round(row * metadata.height / rows);
  const bottom = customRows ? characterRows[row + 1] : Math.round((row + 1) * metadata.height / rows);
  return sharp(file).extract({ left, top, width: right - left, height: bottom - top }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

function keepLargestAlphaComponent(data, width, height) {
  const seen = new Uint8Array(width * height);
  let best = [];
  for (let start = 0; start < seen.length; start += 1) {
    if (seen[start] || data[start * 4 + 3] < 32) continue;
    const group = [];
    const queue = [start];
    seen[start] = 1;
    for (let at = 0; at < queue.length; at += 1) {
      const index = queue[at];
      group.push(index);
      const x = index % width;
      const neighbours = [index - width, index + width];
      if (x > 0) neighbours.push(index - 1);
      if (x + 1 < width) neighbours.push(index + 1);
      for (const next of neighbours) {
        if (next < 0 || next >= seen.length || seen[next] || data[next * 4 + 3] < 32) continue;
        seen[next] = 1;
        queue.push(next);
      }
    }
    if (group.length > best.length) best = group;
  }
  const keep = new Uint8Array(width * height);
  for (const index of best) keep[index] = 1;
  for (let index = 0; index < keep.length; index += 1) {
    if (!keep[index]) data[index * 4 + 3] = 0;
  }
}

function removeConnectedMagenta(data, width, height) {
  const seen = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0;
  function isBackdrop(index) {
    const offset = index * 4;
    const red = data[offset], green = data[offset + 1], blue = data[offset + 2];
    return red > 145 && blue > 145 && Math.min(red, blue) - green > 45;
  }
  function enqueue(index) {
    if (index < 0 || index >= seen.length || seen[index] || !isBackdrop(index)) return;
    seen[index] = 1;
    queue[tail++] = index;
  }
  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }
  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    if (x > 0) enqueue(index - 1);
    if (x + 1 < width) enqueue(index + 1);
    if (index >= width) enqueue(index - width);
    if (index + width < seen.length) enqueue(index + width);
  }
  for (let index = 0; index < seen.length; index += 1) {
    const offset = index * 4;
    const red = data[offset], green = data[offset + 1], blue = data[offset + 2];
    if (seen[index] || (red > 180 && blue > 180 && green < 140 && Math.min(red, blue) - green > 70)) data[offset + 3] = 0;
  }
}

async function writeCell(file, columns, rows, column, row, output, chroma, keepAll = false, alphaFloor = 0) {
  const { data, info } = await cellBuffer(file, columns, rows, column, row);
  if (chroma) removeConnectedMagenta(data, info.width, info.height);
  if (alphaFloor) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < alphaFloor) data[i + 3] = 0;
    }
  }
  if (!keepAll) keepLargestAlphaComponent(data, info.width, info.height);
  const extracted = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png().toBuffer();
  const trimmed = await sharp(extracted).trim({ background: '#00000000', threshold: 10 }).toBuffer();
  await sharp(trimmed).resize(352, 352, { fit: 'contain', background: '#00000000' })
    .extend({ top: 16, bottom: 16, left: 16, right: 16, background: '#00000000' })
    .webp({ quality: 88, effort: 5 }).toFile(output);
}

async function main() {
  const characterDir = path.join(runtime, 'characters');
  const terrainDir = path.join(runtime, 'terrain');
  const mechanismDir = path.join(runtime, 'mechanisms');
  const enemyDir = path.join(runtime, 'enemies');
  const propDir = path.join(runtime, 'props');
  const effectDir = path.join(runtime, 'effects');
  fs.mkdirSync(characterDir, { recursive: true });
  fs.mkdirSync(terrainDir, { recursive: true });
  fs.mkdirSync(mechanismDir, { recursive: true });
  fs.mkdirSync(enemyDir, { recursive: true });
  fs.mkdirSync(propDir, { recursive: true });
  fs.mkdirSync(effectDir, { recursive: true });
  for (const group of characterGroups) {
    for (let c = 0; c < group.ids.length; c += 1) {
      for (let p = 0; p < poses.length; p += 1) {
        await writeCell(path.join(source, group.poses), group.ids.length, 4, c, p,
          path.join(characterDir, `lr-${group.ids[c]}-${poses[p]}-v1.webp`), true);
      }
      await writeCell(path.join(source, group.carry), group.ids.length, 1, c, 0,
        path.join(characterDir, `lr-${group.ids[c]}-carry-v1.webp`), true);
    }
  }
  const terrainSource = path.join(source, 'lr-terrain-01-v1.png');
  for (let t = 0; t < terrain.length; t += 1) {
    await writeCell(terrainSource, 4, 3, t % 4, Math.floor(t / 4),
      path.join(terrainDir, `lr-terrain-${terrain[t]}-v1.webp`), false);
  }
  const mechanismSource = path.join(source, 'lr-operator-wheel-01-v1.png');
  for (let state = 0; state < operatorStates.length; state += 1) {
    await writeCell(mechanismSource, 3, 2, state % 3, Math.floor(state / 3),
      path.join(mechanismDir, `lr-operator-${operatorStates[state]}-v1.webp`), true);
  }
  const enemySource = path.join(source, 'lr-fog-thumb-01-v1.png');
  for (let state = 0; state < fogThumbStates.length; state += 1) {
    await writeCell(enemySource, 2, 2, state % 2, Math.floor(state / 2),
      path.join(enemyDir, `lr-fog-thumb-${fogThumbStates[state]}-v1.webp`), false);
  }
  const loadSource = path.join(source, 'lr-number-loads-01-v1-magenta.png');
  for (let state = 0; state < loadStates.length; state += 1) {
    await writeCell(loadSource, 4, 2, state % 4, Math.floor(state / 4),
      path.join(propDir, `lr-load-${loadStates[state]}-v1.webp`), true, loadStates[state] === 'split');
  }
  const effectSource = path.join(source, 'lr-effects-01-v2.png');
  for (let state = 0; state < effectStates.length; state += 1) {
    await writeCell(effectSource, 4, 2, state % 4, Math.floor(state / 4),
      path.join(effectDir, `lr-fx-${effectStates[state]}-v1.webp`), false, true, 72);
  }
  const manifest = {
    schemaVersion: 1, moduleKey: 'junior', world: 'Little Reckoning', status: 'art-candidate',
    root: 'assets/expeditions/production/lr/runtime',
    backgrounds: { lr_smudged_stones: 'backgrounds/lr-smudged-stones-v2.webp' },
    characters: Object.fromEntries(characters.map(id => [id, Object.fromEntries(poses.map((pose, index) =>
      [['idleFront', 'idleBack', 'action', 'exhausted'][index], `characters/lr-${id}-${pose}-v1.webp`]).concat([['carry', `characters/lr-${id}-carry-v1.webp`]]))])),
    terrain: Object.fromEntries(terrain.map(id => [id, `terrain/lr-terrain-${id}-v1.webp`])),
    mechanisms: { operatorWheel: Object.fromEntries(operatorStates.map(id => [id, `mechanisms/lr-operator-${id}-v1.webp`])) },
    enemies: { fogThumb: Object.fromEntries(fogThumbStates.map(id => [id, `enemies/lr-fog-thumb-${id}-v1.webp`])) },
    props: { numberLoad: Object.fromEntries(loadStates.map(id => [id, `props/lr-load-${id}-v1.webp`])) },
    effects: Object.fromEntries(effectStates.map(id => [id, `effects/lr-fx-${id}-v1.webp`])),
  };
  fs.writeFileSync(path.join(root, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
