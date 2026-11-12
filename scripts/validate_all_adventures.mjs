// Runs the existing validate_adventures.cjs (a CLI tool that expects a file
// whose entire source is one ADVENTURES object literal) against all three
// modules' real content files, which are ES modules exporting other things
// alongside the adventures object. Rather than rewrite that checker, this
// imports each module and re-serializes just the adventures object into a
// throwaway CommonJS file, then runs the checker against that. Adventures are
// plain data (no functions/regexes in the scene graph), so JSON round-tripping
// is safe.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODULES = [
  { file: "content/junior-story.js", exportName: "JUNIOR_ADVENTURES" },
  { file: "content/primary-story.js", exportName: "PRIMARY_ADVENTURES" },
  { file: "content/intermediate-story.js", exportName: "INTERMEDIATE_ADVENTURES" },
];

const tmpDir = mkdtempSync(path.join(tmpdir(), "wm-adventures-"));
let failed = false;
try {
  for (const { file, exportName } of MODULES) {
    const mod = await import(pathToFileURL(path.join(ROOT, file)).href);
    const adventures = mod[exportName];
    if (!adventures) { console.error(`${file}: no export named ${exportName}`); failed = true; continue; }
    const objectLiteralFile = path.join(tmpDir, `${exportName}.js`);
    writeFileSync(objectLiteralFile, JSON.stringify(adventures));
    console.log(`\n=== ${file} (${exportName}) ===`);
    try {
      execFileSync("node", [path.join(ROOT, "scripts", "validate_adventures.cjs"), objectLiteralFile], { stdio: "inherit" });
    } catch {
      failed = true;
    }
  }
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
