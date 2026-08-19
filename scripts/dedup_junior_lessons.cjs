'use strict';
const fs = require('fs');
const path = require('path');

const KC_FILE = path.join(__dirname, '..', 'kq-content.js');
const DRY_RUN = process.argv.includes('--dry');

const content = fs.readFileSync(KC_FILE, 'utf8');
const lines = content.split('\n');

// Find all JUNIOR_LESSONS.X = { assignments with their 0-based line indices
const pattern = /^JUNIOR_LESSONS\.(\w+)\s*=\s*\{/;
const allMatches = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(pattern);
  if (m) allMatches.push({ topic: m[1], line: i });
}

console.log(`Found ${allMatches.length} JUNIOR_LESSONS topic assignments`);

// Identify duplicate second occurrences (walk in order, mark seen)
const seen = new Map(); // topic -> first line index
const deleteRanges = []; // [{from, to}] in 0-based inclusive line indices

for (let i = 0; i < allMatches.length; i++) {
  const { topic, line } = allMatches[i];
  if (seen.has(topic)) {
    // Second occurrence: mark for deletion from this line to just before next topic
    const nextEntry = allMatches[i + 1];
    const toLine = nextEntry ? nextEntry.line - 1 : lines.length - 1;
    deleteRanges.push({ from: line, to: toLine, topic });
    console.log(`  DUPLICATE ${topic}: lines ${line + 1}–${toLine + 1} (will delete)`);
  } else {
    seen.set(topic, line);
    console.log(`  KEEP      ${topic}: line ${line + 1}`);
  }
}

if (deleteRanges.length === 0) {
  console.log('\nNo duplicates found — nothing to do.');
  process.exit(0);
}

// Build set of line indices to delete
const toDelete = new Set();
for (const { from, to } of deleteRanges) {
  for (let i = from; i <= to; i++) toDelete.add(i);
}

console.log(`\nTotal lines to remove: ${toDelete.size}`);

if (DRY_RUN) {
  console.log('[DRY RUN] — no changes written.');
  process.exit(0);
}

// Write cleaned file
const newContent = lines.filter((_, i) => !toDelete.has(i)).join('\n');
fs.writeFileSync(KC_FILE, newContent, 'utf8');
console.log('Done — kq-content.js updated.');
