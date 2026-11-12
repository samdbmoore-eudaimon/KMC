const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'wm-art.js'), 'utf8');
const output = path.join(__dirname, '..', 'assets', 'expeditions', 'production', 'lr', 'references');
fs.mkdirSync(output, { recursive: true });
for (const id of [
  'addy', 'zoomby', 'hunchik', 'countra', 'tritip', 'cubble', 'sparkfin',
  'pebble', 'loopy', 'burrowl', 'squarby', 'frostcal', 'multimoo',
  'anglorap', 'owlgorith', 'flaskfox', 'cheetawat', 'fractail',
  'hexabug', 'voltbird', 'probear', 'seqviper', 'primearch', 'geodrake',
  'paradox', 'quantakit', 'sphinxa', 'novabear', 'infinitus', 'euclidon',
]) {
  const match = source.match(new RegExp(`\\b${id}: "data:image/jpeg;base64,([^"]+)"`));
  if (!match) throw new Error(`Missing portrait: ${id}`);
  fs.writeFileSync(path.join(output, `${id}-portrait.jpg`), Buffer.from(match[1], 'base64'));
}
