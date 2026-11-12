import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const esbuild = require("esbuild");
const here = path.dirname(fileURLToPath(import.meta.url));

async function loadRoute() {
  const cacheDir = path.join(here, "../../.cache");
  fs.mkdirSync(cacheDir, { recursive: true });
  const out = path.join(cacheDir, `orchard-v2-route-test-${process.pid}.mjs`);
  const entry = `
    import React from "react";
    import { renderToString } from "react-dom/server";
    import Route from ${JSON.stringify(path.join(here, "route.jsx").replace(/\\/g, "/"))};
    export function render(props) { return renderToString(React.createElement(Route, props)); }
  `;
  const result = await esbuild.build({ stdin: { contents: entry, resolveDir: here, loader: "jsx" }, bundle: true, format: "esm", platform: "node", write: false, banner: { js: "import { createRequire as __wmCreateRequire } from 'node:module'; const require = __wmCreateRequire(import.meta.url);" },  external: ["react", "react-dom"], jsx: "transform", nodePaths: [path.join(here, "../../node_modules")] });
  fs.writeFileSync(out, result.outputFiles[0].text);
  return import(pathToFileURL(out).href + `?t=${Date.now()}`);
}

const ROOKE = { name: "Eudaimon", avatar: "card:intermediate:gf_rooke" };
const Ui = ({ controller, families, bucket }) => `UI:${families.length}:${typeof controller.begin}:${bucket.version}`;

test("the route renders the injected v2 UI only for the exact private profile in Ninefold Orchard", async () => {
  const { render } = await loadRoute();
  const React = (await import("react")).default;
  const base = { Ui: (props) => React.createElement("div", null, Ui(props)), generateBlueprint: () => null, ensureHooks: () => {}, activeModule: "primary", progress: { cards: {} }, setProgress: () => {}, cards: [], avatarForCard: () => null, onExit: () => {} };
  assert.match(render({ ...base, currentProfile: ROOKE }), /UI:5:function:1/);
  for (const profile of [null, { name: "Alex", avatar: "card:intermediate:gf_rooke" }, { name: "eudaimon", avatar: "card:primary:pip" }, { name: "eudaimon" }]) {
    assert.equal(render({ ...base, currentProfile: profile }), "", `blocked: ${JSON.stringify(profile)}`);
  }
  assert.equal(render({ ...base, currentProfile: ROOKE, activeModule: "junior" }), "", "never offered outside Ninefold Orchard");
  assert.equal(render({ ...base, currentProfile: ROOKE, Ui: null }), "");
});
