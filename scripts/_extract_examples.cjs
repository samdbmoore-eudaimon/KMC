const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const ROOT = "C:/Users/samdb/UKMT App";
const JSX = path.join(ROOT, "KangarooMathsQuest.jsx");
const src = fs.readFileSync(JSX, "utf-8");
const patched = src + "\nexport { G, PRIMARY_G, INTERMEDIATE_G };\n";
const tmpPath = path.join(ROOT, "_extract_tmp.jsx");
fs.writeFileSync(tmpPath, patched, "utf-8");
let mod;
try {
  const result = esbuild.buildSync({
    entryPoints: [tmpPath], bundle: true, write: false, format: "cjs", platform: "node",
    external: ["react", "react-dom", "react-dom/client", "lucide-react", "tone"],
    define: { "process.env.NODE_ENV": '"production"' }, logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const Module = require("module");
  const m = new Module(tmpPath, module);
  m.filename = tmpPath; m.paths = Module._nodeModulePaths(ROOT);
  m._compile(code, tmpPath);
  mod = m.exports;
} finally {
  fs.unlinkSync(tmpPath);
}
const mods = { junior: mod.G, primary: mod.PRIMARY_G, intermediate: mod.INTERMEDIATE_G };
for (const [name, G] of Object.entries(mods)) {
  const keys = Object.keys(G);
  console.log(`\n=== ${name.toUpperCase()} (${keys.length} topics) ===`);
  console.log("ALL TOPICS:", keys.join(", "));
}
