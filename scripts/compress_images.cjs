"use strict";
// Compresses large PNG/JPEG source images in-place using sharp.
// Tiles → WebP 85 quality (web UI, largest contributor to bundle size)
// Card art → WebP 88 quality (portraits need a bit more fidelity)
// Keeps originals as *.bak.png if you need to revert.
const fs   = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");

const JOBS = [
  // ── UI tile images (directly imported by esbuild → main bundle bloat) ──
  { glob: "UI elements/*.png",              quality: 85, label: "9FO tiles" },
  { glob: "UI elements/LR Tiles/*.png",     quality: 85, label: "LR tiles" },
  { glob: "UI elements/GF Tiles/*.png",     quality: 85, label: "GF tiles" },
  // ── Full card art source images (embedded by scripts/embed_*.cjs) ──
  { glob: "card_art/ninefold_orchard/9f_*.png",          quality: 88, label: "9FO full card art" },
  { glob: "card_art/little_reckoning_cards/LR_*.png",    quality: 88, label: "LR full card art" },
  { glob: "card_art/gifford_cards/GF_*.png",             quality: 88, label: "Gifford full card art" },
];

function expandGlob(pattern) {
  const parts  = pattern.split("/");
  const fname  = parts.pop(); // may contain * wildcard
  const dir    = path.join(ROOT, ...parts);
  if (!fs.existsSync(dir)) return [];
  // Convert shell glob to regex: * → .*
  const reStr  = "^" + fname.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$";
  const re     = new RegExp(reStr, "i");
  return fs.readdirSync(dir)
    .filter(f => re.test(f))
    .map(f => path.join(dir, f));
}

async function compressFile(filePath, quality) {
  const beforeBytes = fs.statSync(filePath).size;

  try {
    // Convert to WebP entirely in memory — keeps same dimensions, optimises colour.
    // We deliberately avoid toFile()+copyFileSync()/rename() (temp file + overwrite fails with
    // an unrecoverable "UNKNOWN" libuv error for a large, consistent subset of files here) AND
    // avoid sharp(filePath) (libvips can keep the SOURCE path's handle open past toBuffer()'s
    // resolve, colliding with an immediate writeFileSync to that same path). Reading the source
    // into a plain buffer first, so sharp only ever touches in-memory data, sidesteps both.
    const srcBuf = fs.readFileSync(filePath);
    const buf = await sharp(srcBuf).webp({ quality, effort: 4 }).toBuffer();
    const afterBytes = buf.length;

    if (afterBytes >= beforeBytes) {
      // Already smaller as-is, keep original
      console.log(`  skip ${path.basename(filePath)} — already ${(beforeBytes/1024).toFixed(0)} KB`);
      return { saved: 0, before: beforeBytes, after: beforeBytes };
    }

    // Back up the original bytes (already in memory from the read above) before overwriting —
    // written with writeFileSync to a new path rather than copyFileSync/renameSync, for the same
    // reason described above (those hit the same unrecoverable libuv error for a consistent
    // subset of files here). Only written if a backup doesn't already exist, so a second run
    // (e.g. after tweaking quality) never clobbers the true original with an already-compressed
    // copy.
    const backupPath = filePath.replace(/\.png$/i, ".bak.png");
    if (!fs.existsSync(backupPath)) fs.writeFileSync(backupPath, srcBuf);

    // Replace original with WebP bytes (keeping the same extension name so imports still work) —
    // esbuild's loader reads bytes, not format from ext.
    fs.writeFileSync(filePath, buf);

    const saved = beforeBytes - afterBytes;
    console.log(`  ${path.basename(filePath)}: ${(beforeBytes/1024).toFixed(0)} KB → ${(afterBytes/1024).toFixed(0)} KB  (saved ${(saved/1024).toFixed(0)} KB)`);
    return { saved, before: beforeBytes, after: afterBytes };
  } catch (e) {
    console.warn(`  ERROR ${path.basename(filePath)}: ${e.message}`);
    return { saved: 0, before: beforeBytes, after: beforeBytes };
  }
}

async function main() {
  let totalBefore = 0, totalAfter = 0;

  for (const { glob: pattern, quality, label } of JOBS) {
    const files = expandGlob(pattern);
    if (!files.length) { console.log(`\n[${label}] — no files found`); continue; }
    console.log(`\n[${label}] — ${files.length} files`);
    for (const f of files) {
      const r = await compressFile(f, quality);
      totalBefore += r.before;
      totalAfter  += r.after;
    }
  }

  const saved = totalBefore - totalAfter;
  console.log(`\n═══════════════════════════════════════`);
  console.log(`Total before: ${(totalBefore/1024/1024).toFixed(1)} MB`);
  console.log(`Total after:  ${(totalAfter/1024/1024).toFixed(1)} MB`);
  console.log(`Saved:        ${(saved/1024/1024).toFixed(1)} MB  (${((saved/totalBefore)*100).toFixed(0)}%)`);
}

main().catch(e => { console.error(e); process.exit(1); });
