'use strict';
const fs   = require('fs');
const path = require('path');

const PROSE_DIR  = path.join(__dirname, '..', 'intermediate_prose');
const KC_FILE    = path.join(__dirname, '..', 'kq-content.js');
const BACKUP     = KC_FILE + '.bak';
const DRY_RUN    = process.argv.includes('--dry');

// ─── helpers ────────────────────────────────────────────────────────────────

function escRx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Convert MD prose to the JS escaped-string format used in kq-content.js
function mdToJs(raw) {
  let t = raw.replace(/\r\n/g, '\n').trim();

  // Drop bare --- separator lines (they sometimes appear inside the text block)
  t = t.split('\n').filter(l => l !== '---').join('\n').trim();

  // Strip single-star italic markers (* but not **)
  // Works iteratively to handle nested / adjacent occurrences
  t = t.replace(/(?<!\*)\*(?!\*)([^*\n]+?)(?<!\*)\*(?!\*)/g, '$1');

  // Escape backslashes, then double-quotes
  t = t.replace(/\\/g, '\\\\');
  t = t.replace(/"/g, '\\"');

  // Newlines → \n (JS escape)
  t = t.replace(/\n/g, '\\n');

  return t;
}

// ─── MD parser ──────────────────────────────────────────────────────────────

function parseMd(content) {
  // Adventure ID from the header line  e.g.  # gf_tambrindle — "Title"
  const idM = content.match(/^#\s+(gf_\w+)/m);
  if (!idM) return null;
  const adventureId = idM[1];

  const ops = [];          // [{sceneId, field, text}]
  let currentLabel = null;
  let textLines    = [];
  let combatScene  = null; // tracks which combat scene owns hitText etc.

  function flush() {
    if (!currentLabel) return;
    const label = currentLabel;
    const raw   = textLines.join('\n').trim();
    if (!raw) return;

    // Remove trailing separator
    const text = raw.replace(/\n---\s*$/, '').trim();
    if (!text) return;

    // ── classify the label ──────────────────────────────────────────────
    const dashMatch = label.match(/^(.+?)\s*[—–]\s*(.+)$/);
    const isSubField = dashMatch && ['forged','notForged','notforged','goodText','midText'].includes(dashMatch[2].trim());
    const isCombatSub = dashMatch && ['hitText','strikeText','defeatText'].includes(dashMatch[2].trim());

    if (label === 'tagline') {
      ops.push({ sceneId: null, field: 'tagline', text });

    } else if (isSubField) {
      const sceneId = dashMatch[1].trim();
      const field   = dashMatch[2].trim() === 'notForged' ? 'notforged' : dashMatch[2].trim();
      ops.push({ sceneId, field, text });

    } else if (isCombatSub) {
      if (!combatScene) { console.warn(`  ⚠ No combat scene for: ${label}`); return; }
      ops.push({ sceneId: combatScene, field: dashMatch[2].trim(), text });

    } else {
      // Plain scene label (possibly " (scene intro)" annotation)
      const sceneId = label.replace(/\s*\(.*\)\s*$/, '').trim();
      ops.push({ sceneId, field: 'text', text });
      combatScene = label.includes('(scene intro)') ? sceneId : null;
    }
  }

  for (const line of content.split('\n')) {
    const m = line.match(/^\*\*(.+?)\*\*(.*)$/);
    if (m) {
      flush();
      const annotation = m[2].trim();
      currentLabel = annotation ? `${m[1].trim()} ${annotation}` : m[1].trim();
      textLines = [];
    } else if (currentLabel !== null) {
      textLines.push(line);
    }
  }
  flush();

  return { adventureId, ops };
}

// ─── JS field replacer ──────────────────────────────────────────────────────

function replaceField(js, adventureId, sceneId, field, newVal) {
  // 1. Find adventure start
  const advRx    = new RegExp(`\\b${escRx(adventureId)}:\\s*\\{`);
  const advMatch = advRx.exec(js);
  if (!advMatch) { console.warn(`  ❌ adventure missing: ${adventureId}`); return js; }
  const advStart = advMatch.index;

  // 2. Find next adventure boundary (so we stay inside this one)
  const boundRx  = /\bgf_\w+:\s*\{/g;
  boundRx.lastIndex = advStart + adventureId.length;
  const nextAdv  = boundRx.exec(js);
  const advEnd   = nextAdv ? nextAdv.index : js.length;
  const advBlock = js.slice(advStart, advEnd);

  // 3. Locate the scene (or stay at adventure level for tagline)
  let blockStart = advStart;
  if (sceneId !== null) {
    const sceneRx    = new RegExp(`\\b${escRx(sceneId)}:\\s*\\{`);
    const sceneMatch = sceneRx.exec(advBlock);
    if (!sceneMatch) { console.warn(`  ❌ scene missing: ${adventureId}.${sceneId}`); return js; }
    blockStart = advStart + sceneMatch.index;
  }

  // 4. Locate the field value within that block
  const fieldRx    = new RegExp(`\\b${escRx(field)}:\\s*"`);
  const fieldMatch = fieldRx.exec(js.slice(blockStart, advEnd));
  if (!fieldMatch) { console.warn(`  ❌ field missing: ${adventureId}.${sceneId}.${field}`); return js; }

  const valStart = blockStart + fieldMatch.index + fieldMatch[0].length;

  // 5. Walk to the closing unescaped "
  let i = valStart;
  while (i < js.length) {
    if (js[i] === '\\') { i += 2; continue; }
    if (js[i] === '"')  { break; }
    i++;
  }
  if (i >= js.length) { console.warn(`  ❌ unclosed string: ${adventureId}.${sceneId}.${field}`); return js; }

  return js.slice(0, valStart) + newVal + js.slice(i);
}

// ─── main ────────────────────────────────────────────────────────────────────

function main() {
  const advFiles = fs.readdirSync(PROSE_DIR)
    .filter(f => f.includes('_adv_') && f.endsWith('.md'))
    .sort();

  console.log(`Found ${advFiles.length} prose files. ${DRY_RUN ? '[DRY RUN]' : ''}`);

  let js = fs.readFileSync(KC_FILE, 'utf8');

  if (!DRY_RUN) {
    fs.writeFileSync(BACKUP, js);
    console.log(`Backed up → kq-content.js.bak\n`);
  }

  let total = 0, done = 0;

  for (const file of advFiles) {
    const md     = fs.readFileSync(path.join(PROSE_DIR, file), 'utf8');
    const parsed = parseMd(md);
    if (!parsed) { console.warn(`Could not parse: ${file}`); continue; }

    console.log(`${file}  →  ${parsed.adventureId}  (${parsed.ops.length} snippets)`);

    for (const { sceneId, field, text } of parsed.ops) {
      const jsVal  = mdToJs(text);
      const before = js;
      total++;
      if (!DRY_RUN) {
        js = replaceField(js, parsed.adventureId, sceneId, field, jsVal);
        if (js !== before) { done++; process.stdout.write(`  ✓ ${sceneId ?? 'adventure'}.${field}\n`); }
      } else {
        console.log(`  [DRY] ${sceneId ?? 'adventure'}.${field}  (${jsVal.length} chars)`);
        done++;
      }
    }
  }

  if (!DRY_RUN) {
    fs.writeFileSync(KC_FILE, js);
    console.log(`\n${done}/${total} replacements written to kq-content.js`);
  } else {
    console.log(`\n${done}/${total} replacements would be made`);
  }
}

main();
