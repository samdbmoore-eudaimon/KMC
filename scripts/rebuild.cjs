// Rebuilds KangarooMathsQuest.html from KangarooMathsQuest.jsx (+ kq-art.js, kq-content.js).
// Usage: node scripts/rebuild.cjs
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = path.join(__dirname, "..");
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
const e = shell.indexOf("</script>", m.index);
if (s === -1 || e === -1) throw new Error("Could not find <script> boundaries around the bundle marker");

const out = shell.slice(0, s + "<script>".length) + bundle + shell.slice(e);
fs.writeFileSync(HTML, out, "utf-8");
console.log("Rebuilt " + HTML + " — " + out.length + " bytes");

// Keep the Capacitor web asset root (www/index.html) in sync with the built game.
const WWW = path.join(ROOT, "www");
if (fs.existsSync(WWW)) {
  fs.writeFileSync(path.join(WWW, "index.html"), out, "utf-8");
  console.log("Synced www/index.html for Capacitor");
}
