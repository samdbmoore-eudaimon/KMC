// Confirms the rebuilt WallabyMaths.html mounts cleanly in jsdom with zero runtime errors.
//
// The real file is ~260MB, almost all of it base64-embedded art (boss/card portraits,
// UI chrome, backgrounds — see CLAUDE.md's "Art" file map). Handing that whole string to
// jsdom to tokenize and execute as JS needs 8GB+ of heap (confirmed by hand — even
// --max-old-space-size=8192 still OOMs) — more than a typical CI runner has, and enough
// to strain a dev machine too. None of that art payload carries any logic risk; it's
// static data with no code paths of its own. So before handing the HTML to jsdom, every
// embedded base64 data-URI payload is shrunk down to a tiny valid placeholder (same
// declared mime, same "it's a non-empty data: URI" shape) — everything else in the file,
// including every real line of app logic, is untouched. This keeps the test honest about
// what it's actually meant to catch (broken imports, syntax errors, a component throwing
// on mount) without paying to decode gigabytes of image bytes nothing here decodes anyway
// (jsdom has no canvas/image backend installed, so pixel data was never inspected).
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const HTML = path.join(__dirname, "..", "WallabyMaths.html");
let html = fs.readFileSync(HTML, "utf-8");

const realBytes = html.length;
const TINY_PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
html = html.replace(/(data:[a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+;base64,)[A-Za-z0-9+/=]{200,}/g, `$1${TINY_PNG}`);
console.log(`Stubbed embedded art: ${realBytes} bytes -> ${html.length} bytes`);

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
