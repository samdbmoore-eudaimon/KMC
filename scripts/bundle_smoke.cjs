// Confirms the rebuilt KangarooMathsQuest.html mounts cleanly in jsdom with zero runtime errors.
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const HTML = path.join(__dirname, "..", "KangarooMathsQuest.html");
const html = fs.readFileSync(HTML, "utf-8");

const errors = [];
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "http://localhost/",
  virtualConsole: new (require("jsdom").VirtualConsole)(),
});
dom.window.addEventListener("error", (e) => errors.push(e.error?.message || e.message));
dom.window.onerror = (msg) => errors.push(String(msg));

setTimeout(() => {
  const root = dom.window.document.getElementById("root");
  const mounted = root && root.children.length > 0;
  console.log("Root populated:", mounted);
  console.log("Runtime errors:", errors.length ? errors : "none");
  if (!mounted || errors.length) process.exit(1);
  console.log("SMOKE TEST PASSED");
  process.exit(0);
}, 3000);
