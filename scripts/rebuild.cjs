// Rebuilds KangarooMathsQuest.html from KangarooMathsQuest.jsx (+ kq-art.js, kq-content.js).
// Usage: node scripts/rebuild.cjs
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = path.resolve(__dirname, "..");
const JSX = path.join(ROOT, "KangarooMathsQuest.jsx");
const HTML = path.join(ROOT, "KangarooMathsQuest.html");

const entryContents = `
import React from "react";
import { createRoot } from "react-dom/client";
import App from ${JSON.stringify(JSX.replace(/\\/g, "/"))};
createRoot(document.getElementById("root")).render(React.createElement(App));
`;

const result = esbuild.buildSync({
  stdin: {
    contents: entryContents,
    resolveDir: ROOT,
    loader: "jsx",
  },
  bundle: true,
  minify: true,
  write: false,
  loader: { ".png": "dataurl", ".jpg": "dataurl", ".jpeg": "dataurl", ".webp": "dataurl" },
  define: { "process.env.NODE_ENV": '"production"' },
});

if (result.errors.length) {
  console.error("Build failed:", result.errors);
  process.exit(1);
}

const bundle = result.outputFiles[0].text;
const shell = fs.readFileSync(HTML, "utf-8");
const m = shell.match(/\(\(\)=>\{var/);
if (!m) throw new Error("Could not find bundle marker in HTML shell — has the shell structure changed?");
const s = shell.lastIndexOf("<script>", m.index);
// Search backwards: the real </script> is the last one in the file; earlier occurrences are string literals inside the bundle.
const e = shell.lastIndexOf("</script>");
if (s === -1 || e === -1 || e < m.index) throw new Error("Could not find <script> boundaries around the bundle marker");

const out = shell.slice(0, s + "<script>".length) + bundle + shell.slice(e);
// Keep the Capacitor web asset root in sync first. This remains rebuildable while
// the convenience HTML copy is open in a browser on Windows.
const WWW = path.join(ROOT, "www");
if (fs.existsSync(WWW)) {
  try {
    fs.writeFileSync(path.join(WWW, "index.html"), out, "utf-8");
    console.log("Synced www/index.html for Capacitor");
  } catch (err) {
    console.warn("Could not sync www/index.html; continuing with the main HTML rebuild.");
  }
}

try {
  fs.writeFileSync(HTML, out, "utf-8");
  console.log("Rebuilt " + HTML + " — " + out.length + " bytes");
} catch (err) {
  const fallback = path.join(ROOT, "KangarooMathsQuest-latest.html");
  try {
    fs.writeFileSync(fallback, out, "utf-8");
    console.warn("The main HTML copy is locked; rebuilt " + fallback + " instead.");
  } catch (fallbackErr) {
    const timestamped = path.join(ROOT, "KangarooMathsQuest-rebuilt-" + Date.now() + ".html");
    fs.writeFileSync(timestamped, out, "utf-8");
    console.warn("The main and latest HTML copies are locked; rebuilt " + timestamped + " instead.");
  }
}
