// Shared jsdom harness: bundles the REAL ExpeditionScreen (route + component + generator + hooks) and mounts it.
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const esbuild = require("esbuild");
const { JSDOM } = require("jsdom");
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
export const ROOKE = { name: "Eudaimon", avatar: "card:intermediate:gf_rooke" };

export async function bundle() {
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

let shared = null;
// One JSDOM per process: React DOM binds to the first window it sees, so later sessions reuse it with a fresh root.
export function dom() {
  if (!shared) {
    shared = new JSDOM("<!doctype html><div id=root></div>", { pretendToBeVisual: true });
    globalThis.window = shared.window;
    globalThis.document = shared.window.document;
    Object.defineProperty(globalThis, "navigator", { value: shared.window.navigator, configurable: true });
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
    shared.window.ResizeObserver = globalThis.ResizeObserver;
  }
  shared.window.document.body.innerHTML = "<div id=root></div>";
  return shared;
}
export const click = async (m, el) => m.act(() => { el.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });

