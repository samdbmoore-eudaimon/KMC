const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const artRoot = path.join(root, "assets", "expeditions", "production", "9fo");
const sourceRoot = path.join(artRoot, "source-sheets");
const runtimeRoot = path.join(artRoot, "runtime");

async function removeConnectedCheckerboard(input, output) {
  const image = sharp(input).removeAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const pixelCount = info.width * info.height;
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;

  function isBackground(index) {
    const offset = index * 3;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    return Math.max(r, g, b) - Math.min(r, g, b) <= 24 && Math.min(r, g, b) >= 125;
  }

  function enqueue(index) {
    if (index < 0 || index >= pixelCount || visited[index] || !isBackground(index)) return;
    visited[index] = 1;
    queue[tail++] = index;
  }

  for (let x = 0; x < info.width; x += 1) {
    enqueue(x);
    enqueue((info.height - 1) * info.width + x);
  }
  for (let y = 0; y < info.height; y += 1) {
    enqueue(y * info.width);
    enqueue(y * info.width + info.width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % info.width;
    if (x > 0) enqueue(index - 1);
    if (x + 1 < info.width) enqueue(index + 1);
    enqueue(index - info.width);
    enqueue(index + info.width);
  }

  const rgba = Buffer.alloc(pixelCount * 4);
  for (let index = 0; index < pixelCount; index += 1) {
    const sourceOffset = index * 3;
    const targetOffset = index * 4;
    rgba[targetOffset] = data[sourceOffset];
    rgba[targetOffset + 1] = data[sourceOffset + 1];
    rgba[targetOffset + 2] = data[sourceOffset + 2];
    rgba[targetOffset + 3] = visited[index] ? 0 : 255;
  }

  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(output);
}

async function removeChromaKey(input, output, aggressive = true) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixelCount = info.width * info.height;
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;

  function isBackdrop(index) {
    const offset = index * 3;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    return r > 145 && b > 145 && g < 165 && Math.min(r, b) - g > 45;
  }

  function enqueue(index) {
    if (index < 0 || index >= pixelCount || visited[index] || !isBackdrop(index)) return;
    visited[index] = 1;
    queue[tail++] = index;
  }

  for (let x = 0; x < info.width; x += 1) {
    enqueue(x);
    enqueue((info.height - 1) * info.width + x);
  }
  for (let y = 0; y < info.height; y += 1) {
    enqueue(y * info.width);
    enqueue(y * info.width + info.width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % info.width;
    if (x > 0) enqueue(index - 1);
    if (x + 1 < info.width) enqueue(index + 1);
    if (index >= info.width) enqueue(index - info.width);
    if (index + info.width < pixelCount) enqueue(index + info.width);
  }

  if (aggressive) {
    for (let index = 0; index < pixelCount; index += 1) {
      if (isBackdrop(index)) visited[index] = 1;
    }
  }

  for (let pass = 0; pass < 5; pass += 1) {
    const additions = [];
    for (let index = 0; index < pixelCount; index += 1) {
      if (visited[index]) continue;
      const x = index % info.width;
      const touchesBackdrop =
        (x > 0 && visited[index - 1]) ||
        (x + 1 < info.width && visited[index + 1]) ||
        (index >= info.width && visited[index - info.width]) ||
        (index + info.width < pixelCount && visited[index + info.width]);
      if (!touchesBackdrop) continue;
      const offset = index * 3;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      if (r > 95 && b > 95 && Math.min(r, b) - g > 18) additions.push(index);
    }
    if (!additions.length) break;
    for (const index of additions) visited[index] = 1;
  }

  const rgba = Buffer.alloc(pixelCount * 4);
  for (let index = 0; index < pixelCount; index += 1) {
    const sourceOffset = index * 3;
    const targetOffset = index * 4;
    rgba[targetOffset] = data[sourceOffset];
    rgba[targetOffset + 1] = data[sourceOffset + 1];
    rgba[targetOffset + 2] = data[sourceOffset + 2];
    rgba[targetOffset + 3] = visited[index] ? 0 : 255;
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(output);
}

async function splitSheet({ input, columns, rows, names, destination, width = 384, height = 384 }) {
  fs.mkdirSync(destination, { recursive: true });
  const metadata = await sharp(input).metadata();
  if (names.length !== columns * rows) throw new Error(`Wrong name count for ${input}`);

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const left = Math.round(column * metadata.width / columns);
      const top = Math.round(row * metadata.height / rows);
      const right = Math.round((column + 1) * metadata.width / columns);
      const bottom = Math.round((row + 1) * metadata.height / rows);
      const cell = await sharp(input)
        .extract({ left, top, width: right - left, height: bottom - top })
        .png()
        .toBuffer();
      await sharp(cell)
        .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
        .resize({ width, height, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 88, alphaQuality: 100, smartSubsample: true })
        .toFile(path.join(destination, `${names[index]}.webp`));
    }
  }
}

async function splitPoseComponents({ input, names, destination, canvas = 384 }) {
  fs.mkdirSync(destination, { recursive: true });
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixelCount = info.width * info.height;
  const labels = new Int32Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  const components = [];
  let nextLabel = 0;

  for (let start = 0; start < pixelCount; start += 1) {
    if (labels[start] || data[start * 4 + 3] < 20) continue;
    nextLabel += 1;
    let head = 0;
    let tail = 0;
    let count = 0;
    let sumX = 0;
    let sumY = 0;
    queue[tail++] = start;
    labels[start] = nextLabel;
    while (head < tail) {
      const index = queue[head++];
      const x = index % info.width;
      const y = Math.floor(index / info.width);
      count += 1;
      sumX += x;
      sumY += y;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (!dx && !dy) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= info.width || ny < 0 || ny >= info.height) continue;
          const neighbour = ny * info.width + nx;
          if (labels[neighbour] || data[neighbour * 4 + 3] < 20) continue;
          labels[neighbour] = nextLabel;
          queue[tail++] = neighbour;
        }
      }
    }
    components.push({ label: nextLabel, count, x: sumX / count, y: sumY / count });
  }

  const selected = components
    .sort((a, b) => b.count - a.count)
    .slice(0, names.length)
    .sort((a, b) => {
      const aRow = a.y < info.height / 2 ? 0 : 1;
      const bRow = b.y < info.height / 2 ? 0 : 1;
      return aRow - bRow || a.x - b.x;
    });
  if (selected.length !== names.length) throw new Error(`Could not find ${names.length} poses in ${input}`);

  for (let poseIndex = 0; poseIndex < selected.length; poseIndex += 1) {
    const masked = Buffer.from(data);
    const selectedLabel = selected[poseIndex].label;
    for (let index = 0; index < pixelCount; index += 1) {
      if (labels[index] !== selectedLabel) masked[index * 4 + 3] = 0;
    }
    await sharp(masked, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
      .resize({ width: canvas, height: canvas, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 88, alphaQuality: 100, smartSubsample: true })
      .toFile(path.join(destination, `${names[poseIndex]}.webp`));
  }
}

async function buildContactSheet(output, background, foreground) {
  const categories = ["characters", "enemies", "mechanisms", "terrain", "props", "objectives", "effects", "ui"];
  const files = categories.flatMap(category =>
    fs.readdirSync(path.join(runtimeRoot, category))
      .filter(file => file.endsWith(".webp"))
      .sort()
      .map(file => ({ category, file }))
  );
  const columns = 7;
  const cellWidth = 220;
  const cellHeight = 220;
  const rows = Math.ceil(files.length / columns);
  const composites = [];

  for (let index = 0; index < files.length; index += 1) {
    const { category, file } = files[index];
    const left = (index % columns) * cellWidth;
    const top = Math.floor(index / columns) * cellHeight;
    const sprite = await sharp(path.join(runtimeRoot, category, file))
      .resize({ width: 180, height: 180, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    composites.push({ input: sprite, left: left + 20, top: top + 6 });
    const label = file.replace(".webp", "").replace("po-", "").slice(0, 30);
    const svg = Buffer.from(`<svg width="${cellWidth}" height="28" xmlns="http://www.w3.org/2000/svg"><text x="110" y="18" text-anchor="middle" font-family="Arial" font-size="12" fill="${foreground}">${label}</text></svg>`);
    composites.push({ input: svg, left, top: top + 190 });
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  await sharp({ create: { width: columns * cellWidth, height: rows * cellHeight, channels: 4, background } })
    .composite(composites)
    .png()
    .toFile(output);
}

async function main() {
  const checkerboardSheets = ["po-nine-poses-v1", "po-bramble-poses-v1"];
  for (const baseName of checkerboardSheets) {
    await removeConnectedCheckerboard(
      path.join(sourceRoot, `${baseName}.png`),
      path.join(sourceRoot, `${baseName}-alpha.png`)
    );
  }

  const chromaSheets = ["po-number-loads-v2", "po-objective-structures-v1", "po-hookmole-behaviours-v1", "po-action-button-frames-v1", "po-action-icons-v1", "po-card-characters-01-v1", "po-card-characters-02-v1", "po-card-characters-03-v1", "po-card-characters-04-v1", "po-card-characters-05-v1", "po-card-characters-06-v1", "po-card-characters-07-v1", "po-enemies-01-v1", "po-enemies-02-v1"];
  for (const baseName of chromaSheets) {
    await removeChromaKey(
      path.join(sourceRoot, `${baseName}.png`),
      path.join(sourceRoot, `${baseName}-alpha.png`)
    );
  }
  await removeChromaKey(
    path.join(sourceRoot, "po-team-readiness-v1.png"),
    path.join(sourceRoot, "po-team-readiness-v1-alpha.png"),
    false
  );

  const poses = ["idle-front", "idle-back", "action", "exhausted"];
  for (const id of ["pip", "nine", "bramble"]) {
    const input = id === "pip"
      ? path.join(sourceRoot, "po-pip-poses-v2.png")
      : path.join(sourceRoot, `po-${id}-poses-v1-alpha.png`);
    await splitPoseComponents({
      input,
      names: poses.map(pose => `po-${id}-${pose}-v1`),
      destination: path.join(runtimeRoot, "characters")
    });
  }
  await splitPoseComponents({
    input: path.join(sourceRoot, "po-hookmole-poses-v1.png"),
    names: poses.map(pose => `po-hookmole-${pose}-v1`),
    destination: path.join(runtimeRoot, "enemies")
  });
  const characterSheets = [
    { file: "po-card-characters-01-v1-alpha.png", ids: ["sorrel", "russet", "halfpenny", "wicker"] },
    { file: "po-card-characters-02-v1-alpha.png", ids: ["furrow", "dapple", "bushel", "tuppence"] },
    { file: "po-card-characters-03-v1-alpha.png", ids: ["windfall", "cornix", "thistlewick", "beeswax"] },
    { file: "po-card-characters-04-v1-alpha.png", ids: ["kernel", "millrace", "cobweb", "amberly"] },
    { file: "po-card-characters-05-v1-alpha.png", ids: ["barrow", "driftwood", "gable", "warden"] },
    { file: "po-card-characters-06-v1-alpha.png", ids: ["harvestmoon", "ninebark", "cascade", "longshadow"] }
  ];
  for (const sheet of characterSheets) {
    const names = [];
    for (const pose of ["idle-front", "idle-back", "action", "exhausted"]) {
      for (const id of sheet.ids) names.push(`po-${id}-${pose}-v1`);
    }
    await splitSheet({ input: path.join(sourceRoot, sheet.file), columns: 4, rows: 4, names, destination: path.join(runtimeRoot, "characters") });
  }
  const finalCharacterNames = [];
  for (const pose of ["idle-front", "idle-back", "action", "exhausted"]) {
    for (const id of ["gossamer", "ninefoldtree", "tenthscarecrow"]) finalCharacterNames.push(`po-${id}-${pose}-v1`);
  }
  await splitSheet({ input: path.join(sourceRoot, "po-card-characters-07-v1-alpha.png"), columns: 3, rows: 4, names: finalCharacterNames, destination: path.join(runtimeRoot, "characters") });
  const enemySheets = [
    { file: "po-enemies-01-v1-alpha.png", ids: ["rootling", "flockling", "ledgerleech", "widdershins"] },
    { file: "po-enemies-02-v1-alpha.png", ids: ["thorncap", "pebbleback", "muddlenook", "numbermoth"] }
  ];
  for (const sheet of enemySheets) {
    const names = [];
    for (const pose of ["idle", "move", "telegraph", "defeated"]) {
      for (const id of sheet.ids) names.push(`po-${id}-${pose}-v1`);
    }
    await splitSheet({ input: path.join(sourceRoot, sheet.file), columns: 4, rows: 4, names, destination: path.join(runtimeRoot, "enemies") });
  }
  await splitSheet({
    input: path.join(sourceRoot, "po-hookmole-behaviours-v1-alpha.png"),
    columns: 2,
    rows: 2,
    names: ["po-hookmole-warning-v1", "po-hookmole-jam-v1", "po-hookmole-steal-v1", "po-hookmole-blocked-v1"],
    destination: path.join(runtimeRoot, "enemies")
  });
  await splitSheet({
    input: path.join(sourceRoot, "po-operator-wheel-states-v1.png"),
    columns: 3,
    rows: 2,
    names: ["po-operator-neutral-v1", "po-operator-selected-v1", "po-operator-rotate-v1", "po-operator-locked-v1", "po-operator-jammed-v1", "po-operator-complete-v1"],
    destination: path.join(runtimeRoot, "mechanisms")
  });
  await splitSheet({
    input: path.join(sourceRoot, "po-terrain-atlas-v1.png"),
    columns: 4,
    rows: 3,
    names: ["po-terrain-grass-v1", "po-terrain-path-v1", "po-terrain-flagstone-v1", "po-terrain-stream-v1", "po-terrain-timber-bridge-v1", "po-terrain-stone-bridge-v1", "po-terrain-hedge-v1", "po-terrain-roots-v1", "po-terrain-apple-tree-v1", "po-terrain-objective-socket-v1", "po-terrain-start-v1", "po-terrain-exit-v1"],
    destination: path.join(runtimeRoot, "terrain")
  });
  await splitSheet({
    input: path.join(sourceRoot, "po-effects-atlas-v1.png"),
    columns: 4,
    rows: 2,
    names: ["po-fx-shadow-v1", "po-fx-reachable-v1", "po-fx-selected-v1", "po-fx-danger-v1", "po-fx-guard-v1", "po-fx-impact-v1", "po-fx-rotate-v1", "po-fx-complete-v1"],
    destination: path.join(runtimeRoot, "effects")
  });
  await splitSheet({
    input: path.join(sourceRoot, "po-number-loads-v2-alpha.png"),
    columns: 4,
    rows: 2,
    names: ["po-load-neutral-v1", "po-load-selected-v1", "po-load-carried-v1", "po-load-guarded-v1", "po-load-split-v1", "po-load-combined-v1", "po-load-heavy-v1", "po-load-delivered-v1"],
    destination: path.join(runtimeRoot, "props")
  });
  await splitSheet({
    input: path.join(sourceRoot, "po-balance-platform-alpha-attempt-v1.png"),
    columns: 3,
    rows: 2,
    names: ["po-balance-empty-v1", "po-balance-loaded-v1", "po-balance-selected-v1", "po-balance-complete-v1", "po-balance-overloaded-v1", "po-balance-broken-v1"],
    destination: path.join(runtimeRoot, "objectives")
  });
  await splitSheet({
    input: path.join(sourceRoot, "po-objective-structures-v1-alpha.png"),
    columns: 4,
    rows: 2,
    names: ["po-tally-dormant-v1", "po-tally-active-v1", "po-tally-complete-v1", "po-tally-blocked-v1", "po-feeder-empty-v1", "po-feeder-loaded-v1", "po-target-locked-v1", "po-target-open-v1"],
    destination: path.join(runtimeRoot, "objectives")
  });
  await splitSheet({
    input: path.join(sourceRoot, "po-action-button-frames-v1-alpha.png"),
    columns: 4,
    rows: 2,
    names: ["po-button-available-v1", "po-button-focused-v1", "po-button-selected-v1", "po-button-pressed-v1", "po-button-confirm-v1", "po-button-danger-v1", "po-button-spent-v1", "po-button-disabled-v1"],
    destination: path.join(runtimeRoot, "ui"),
    width: 512,
    height: 192
  });
  await splitSheet({
    input: path.join(sourceRoot, "po-action-icons-v1-alpha.png"),
    columns: 4,
    rows: 2,
    names: ["po-icon-move-v1", "po-icon-interact-v1", "po-icon-rotate-v1", "po-icon-guard-v1", "po-icon-collect-v1", "po-icon-strike-v1", "po-icon-undo-v1", "po-icon-end-round-v1"],
    destination: path.join(runtimeRoot, "ui")
  });
  await splitSheet({
    input: path.join(sourceRoot, "po-team-readiness-v1-alpha.png"),
    columns: 2,
    rows: 3,
    names: ["po-readiness-empty-v1", "po-readiness-starter-v1", "po-readiness-uncommon-v1", "po-readiness-rare-v1", "po-readiness-epic-v1", "po-readiness-masterwork-v1"],
    destination: path.join(runtimeRoot, "ui"),
    width: 640,
    height: 192
  });
  await sharp(path.join(runtimeRoot, "backgrounds", "po-orchard-gorge-v1.png"))
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 86, smartSubsample: true })
    .toFile(path.join(runtimeRoot, "backgrounds", "po-orchard-gorge-v1.webp"));
  await buildContactSheet(path.join(artRoot, "qa", "po-runtime-contact-light-v1.png"), "#f4e3b4", "#38250f");
  await buildContactSheet(path.join(artRoot, "qa", "po-runtime-contact-dark-v1.png"), "#20241f", "#f7e8bd");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
