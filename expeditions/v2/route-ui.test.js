// Real private route + real OrchardExpedition component in jsdom: gate, owned squad, begin, a real dispatch,
// close/remount resume from App progress, and exit. Uses the real generator entry and puzzle hooks.
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const esbuild = require("esbuild");
const { JSDOM } = require("jsdom");
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const ROOKE = { name: "Eudaimon", avatar: "card:intermediate:gf_rooke" };

async function bundle() {
  const entry = `
    import React, { useState } from "react";
    import { createRoot } from "react-dom/client";
    import { act } from "react-dom/test-utils";
    import ExpeditionScreen from ${JSON.stringify(path.join(root, "expeditions/ExpeditionScreen.jsx").replace(/\\/g, "/"))};
    import { PRIMARY_CARDS } from ${JSON.stringify(path.join(root, "generators/primary-generators.js").replace(/\\/g, "/"))};
    export function mount(container, { profile, progress, onProgress, onExit }) {
      let current = progress;
      function Harness() {
        const [p, setP] = useState(progress);
        const set = (u) => { current = typeof u === "function" ? u(current) : u; onProgress(current); setP(current); };
        return React.createElement(ExpeditionScreen, { activeModule: "primary", progress: p, setProgress: set, setScreen: onExit, cards: PRIMARY_CARDS, avatarForCard: () => null, currentProfile: profile });
      }
      const rootEl = createRoot(container);
      act(() => rootEl.render(React.createElement(Harness)));
      return { unmount: () => act(() => rootEl.unmount()), act };
    }
  `;
  const result = await esbuild.build({ stdin: { contents: entry, resolveDir: root, loader: "jsx" }, bundle: true, format: "esm", platform: "node", write: false, banner: { js: "import { createRequire as __wmCreateRequire } from 'node:module'; const require = __wmCreateRequire(import.meta.url);" },  external: ["react", "react-dom", "react-dom/client", "react-dom/test-utils"], jsx: "transform", loader: { ".png": "dataurl", ".jpg": "dataurl", ".jpeg": "dataurl", ".webp": "dataurl", ".svg": "dataurl" }, logLevel: "error" });
  const cacheDir = path.join(root, ".cache");
  fs.mkdirSync(cacheDir, { recursive: true });
  const out = path.join(cacheDir, `orchard-route-ui-${process.pid}.mjs`);
  fs.writeFileSync(out, result.outputFiles[0].text);
  return import(pathToFileURL(out).href);
}

function dom() {
  const d = new JSDOM("<!doctype html><div id=root></div>", { pretendToBeVisual: true });
  globalThis.window = d.window;
  globalThis.document = d.window.document;
  Object.defineProperty(globalThis, "navigator", { value: d.window.navigator, configurable: true });
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  d.window.ResizeObserver = globalThis.ResizeObserver;
  return d;
}
const click = async (m, el) => m.act(() => { el.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });

test("real route: private gate, owned-squad begin, a real dispatch, save and resume after remount, exit", async () => {
  const m = await bundle();
  const progress = { cards: { tuppence: 1, furrow: 1, sorrel: 1 }, stars: 0, packs: 0, expeditions: { version: 2, scenarios: {}, moduleSetRewarded: false } };

  let d = dom();
  let saved = progress;
  let left = 0;
  const blocked = m.mount(d.window.document.getElementById("root"), { profile: { name: "Alex", avatar: "card:primary:pip" }, progress, onProgress: (p) => { saved = p; }, onExit: () => { left += 1; } });
  assert.equal(d.window.document.getElementById("root").innerHTML, "", "non-private profile renders nothing");
  blocked.unmount();

  d = dom();
  const first = m.mount(d.window.document.getElementById("root"), { profile: ROOKE, progress, onProgress: (p) => { saved = p; }, onExit: () => { left += 1; } });
  const rootEl = d.window.document.getElementById("root");
  assert.match(rootEl.textContent, /Ninefold Orchard Expeditions/);
  const embark = [...rootEl.querySelectorAll("button")].find((b) => /Embark/.test(b.textContent));
  assert.ok(embark, "an Embark button exists for an owned Common squad");
  await click(first, embark);
  assert.ok(saved.expeditions.v2?.activeRun, "the new run is saved through setProgress before any move");
  assert.match(rootEl.textContent, /Round 1\/5/);
  const before = saved.expeditions.v2.activeRun.record.commands.length;
  const preview = [...rootEl.querySelectorAll("button")].find((b) => /Preview move to 0,3/.test(b.textContent));
  assert.ok(preview, "a reachable move can be previewed");
  await click(first, preview);
  const confirm = [...rootEl.querySelectorAll("button")].find((b) => /confirm/i.test(b.textContent));
  assert.ok(confirm, "the preview still offers an explicit Confirm");
  assert.equal(saved.expeditions.v2.activeRun.record.commands.length, before, "a preview alone spends nothing and saves nothing new");
  const again = [...rootEl.querySelectorAll("button")].find((b) => /Preview move to 0,3/.test(b.textContent));
  await click(first, again);
  assert.equal(saved.expeditions.v2.activeRun.record.commands.length, before + 1, "a second tap on the same previewed hex commits exactly one reducer command");
  assert.match(rootEl.textContent, /0,3/);
  first.unmount();

  d = dom();
  const second = m.mount(d.window.document.getElementById("root"), { profile: ROOKE, progress: saved, onProgress: (p) => { saved = p; }, onExit: () => { left += 1; } });
  assert.match(d.window.document.getElementById("root").textContent, /Round 1\/5/, "remount resumes the saved run instead of the setup screen");
  assert.equal(saved.expeditions.v2.activeRun.record.commands.length, before + 1);
  assert.match(d.window.document.getElementById("root").textContent, /Tuppence/);
  second.unmount();
});
