const esbuild = require("esbuild");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const board = path.join(root, "expeditions", "ExpeditionBoard.jsx").replace(/\\/g, "/");
const roster = path.join(root, "expeditions", "expedition-roster.js").replace(/\\/g, "/");
const primaryCards = path.join(root, "generators", "primary-generators.js").replace(/\\/g, "/");
const output = path.join(root, "assets", "expeditions", "production", "9fo", "qa", "unequal-crossing-runtime-v1.html");

const source = `
  import React from "react";
  import { createRoot } from "react-dom/client";
  import ExpeditionBoard from ${JSON.stringify(board)};
  import { expeditionRoster } from ${JSON.stringify(roster)};
  import { PRIMARY_CARDS } from ${JSON.stringify(primaryCards)};

  const profiles = expeditionRoster("primary");
  const requested = new URLSearchParams(window.location.search).get("squad");
  const scenarioId = new URLSearchParams(window.location.search).get("scenario") || "po_unequal_crossing";
  const ids = requested ? requested.split(",").slice(0, 5) : ["pip", "bramble", "nine"];
  const squad = ids.map((id) => profiles.find((profile) => profile.id === id)).filter(Boolean);
  const progress = { cards: {}, stars: 0, packs: 0, expeditions: { version: 2, scenarios: {}, moduleSetRewarded: false } };
  const noop = () => null;
  createRoot(document.getElementById("root")).render(<ExpeditionBoard scenarioId={scenarioId} squad={squad} cards={PRIMARY_CARDS} avatarForCard={noop} progress={progress} setProgress={noop} onExit={noop} onRestart={noop} />);
`;

const result = esbuild.buildSync({
  stdin: { contents: source, resolveDir: root, loader: "jsx" },
  bundle: true,
  platform: "browser",
  format: "iife",
  write: false,
  loader: { ".png": "dataurl", ".jpg": "dataurl", ".jpeg": "dataurl", ".webp": "dataurl", ".svg": "dataurl" },
});

const bundle = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unequal Crossing runtime preview</title><style>*{box-sizing:border-box}html,body,#root{margin:0;min-width:100%;min-height:100%;background:#263b32}button{font:inherit}</style></head><body><div id="root"></div><script>${bundle}</script></body></html>`;
fs.writeFileSync(output, html);
console.log(output);
