// Rebuilds WallabyMaths.html from WallabyMaths.jsx (+ wm-art.js, wm-content.js).
// Usage: node scripts/rebuild.cjs
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const { imageOptimisePlugin } = require("./lib/image-optimise.cjs");

const ROOT = path.resolve(__dirname, "..");
const JSX = path.join(ROOT, "WallabyMaths.jsx");
const HTML = path.join(ROOT, "WallabyMaths.html");

const entryContents = `
import React from "react";
import { createRoot } from "react-dom/client";
import App from ${JSON.stringify(JSX.replace(/\\/g, "/"))};
createRoot(document.getElementById("root")).render(React.createElement(App));
`;

(async () => {
const imageStats = { files: 0, inline: 0, before: 0, after: 0 };
const result = await esbuild.build({
  stdin: {
    contents: entryContents,
    resolveDir: ROOT,
    loader: "jsx",
  },
  bundle: true,
  minify: true,
  write: false,
  loader: { ".png": "dataurl", ".jpg": "dataurl", ".jpeg": "dataurl", ".webp": "dataurl", ".svg": "dataurl" },
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [imageOptimisePlugin({ root: ROOT, stats: imageStats })],
  logLevel: "error",
});
console.log(`Optimised ${imageStats.files} image files + ${imageStats.inline} inline images: ${(imageStats.before / 1e6).toFixed(1)}MB -> ${(imageStats.after / 1e6).toFixed(1)}MB`);

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
  const fallback = path.join(ROOT, "WallabyMaths-latest.html");
  try {
    fs.writeFileSync(fallback, out, "utf-8");
    console.warn("The main HTML copy is locked; rebuilt " + fallback + " instead.");
  } catch (fallbackErr) {
    const timestamped = path.join(ROOT, "WallabyMaths-rebuilt-" + Date.now() + ".html");
    fs.writeFileSync(timestamped, out, "utf-8");
    console.warn("The main and latest HTML copies are locked; rebuilt " + timestamped + " instead.");
  }
}
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
