// Focused render tests for the Expedition screens — independent of the initial app mount
// (see EXPEDITIONS_CLAUDE_HANDOVER.md "Known prototype history": a normal bundle smoke test
// only proves the root mounted, not that a lazily-visited screen renders). Covers the
// briefing for every module and the tactical board for every catalogued scenario (E6).
const esbuild = require("esbuild");
const path = require("path");

const root = path.resolve(__dirname, "..");
const screen = path.join(root, "expeditions", "ExpeditionScreen.jsx").replace(/\\/g, "/");
const board = path.join(root, "expeditions", "ExpeditionBoard.jsx").replace(/\\/g, "/");
const roster = path.join(root, "expeditions", "expedition-roster.js").replace(/\\/g, "/");
const primaryCards = path.join(root, "generators", "primary-generators.js").replace(/\\/g, "/");
const juniorCards = path.join(root, "generators", "junior-generators.js").replace(/\\/g, "/");
const intermediateCards = path.join(root, "generators", "intermediate-generators.js").replace(/\\/g, "/");

const source = `
  import React from "react";
  import { renderToString } from "react-dom/server";
  import ExpeditionScreen from ${JSON.stringify(screen)};
  import ExpeditionBoard from ${JSON.stringify(board)};
  import { expeditionRoster } from ${JSON.stringify(roster)};
  import { PRIMARY_CARDS } from ${JSON.stringify(primaryCards)};
  import { JUNIOR_CARDS } from ${JSON.stringify(juniorCards)};
  import { INTERMEDIATE_CARDS } from ${JSON.stringify(intermediateCards)};

  const noopProgress = { cards: {}, stars: 0, packs: 0, expeditions: { completed: {}, bestTurns: {} } };
  const noop = () => null;

  // Briefing renders for every module, since all three now have a playable entry.
  // Ninefold Orchard now routes to the private Orchard v2 engine: nothing renders without the exact private profile.
  const ungated = renderToString(<ExpeditionScreen activeModule="primary" progress={noopProgress} setProgress={noop} setScreen={noop} cards={PRIMARY_CARDS} avatarForCard={noop} currentProfile={{ name: "Alex", avatar: "card:primary:pip" }} />);
  if (ungated !== "") throw new Error("Primary Expedition v2 route rendered for a non-private profile");
  const primaryV2 = renderToString(<ExpeditionScreen activeModule="primary" progress={{ ...noopProgress, cards: { pip: 1, bushel: 1, furrow: 1 } }} setProgress={noop} setScreen={noop} cards={PRIMARY_CARDS} avatarForCard={noop} currentProfile={{ name: "Eudaimon", avatar: "card:intermediate:gf_rooke" }} />);
  if (!primaryV2.includes("Ninefold Orchard Expeditions")) throw new Error("Primary Expedition v2 entry did not render for the private profile");

  const juniorBriefing = renderToString(<ExpeditionScreen activeModule="junior" progress={noopProgress} setProgress={noop} setScreen={noop} cards={JUNIOR_CARDS} avatarForCard={noop} />);
  if (!juniorBriefing.includes("The Smudged Stones") || !juniorBriefing.includes("Begin the expedition")) throw new Error("Junior Expedition briefing did not render");
  // Little Reckoning now has two playable scenarios too.
  if (!juniorBriefing.includes("Lanterns in the Forgetting Fog")) throw new Error("Junior Expedition briefing did not list Lanterns in the Forgetting Fog as a selectable scenario");

  const intermediateBriefing = renderToString(<ExpeditionScreen activeModule="intermediate" progress={noopProgress} setProgress={noop} setScreen={noop} cards={INTERMEDIATE_CARDS} avatarForCard={noop} />);
  if (!intermediateBriefing.includes("The Examination Clock") || !intermediateBriefing.includes("Begin the expedition")) throw new Error("Intermediate Expedition briefing did not render");
  // Gifford now has two playable scenarios; the catalogue list must offer both even though
  // only the first (Examination Clock) is selected by default.
  if (!intermediateBriefing.includes("The Sealed Archive")) throw new Error("Intermediate Expedition briefing did not list The Sealed Archive as a selectable scenario");

  console.log("Expedition briefing render passed (primary, junior, intermediate)");

  // The tactical board renders for every catalogued scenario, not just the one behind
  // the original prototype's hard-coded UI.
  function board(scenarioId, squadIds, cards, moduleKey) {
    const roster = expeditionRoster(moduleKey);
    const squad = squadIds.map((id) => roster.find((p) => p.id === id));
    return renderToString(<ExpeditionBoard scenarioId={scenarioId} squad={squad} cards={cards} avatarForCard={noop} progress={noopProgress} setProgress={noop} onExit={noop} onRestart={noop} />);
  }

  const primaryBoard = board("po_unequal_crossing", ["pip", "bramble", "nine"], PRIMARY_CARDS, "primary");
  if (!primaryBoard.includes("The Unequal Crossing") || !primaryBoard.includes("End round")) throw new Error("Unequal Crossing board did not render");
  for (const label of ["Party health and action points", "Pick up", "Put down", "Guard", "Attack", "Move", "Back to Expeditions"]) {
    if (!primaryBoard.includes(label)) throw new Error("Ninefold tactical control missing: " + label);
  }
  if (primaryBoard.includes("NINEFOLD ORCHARD")) throw new Error("The Ninefold module heading should not repeat above the board");
  for (const [scenarioId, title] of [
    ["po_cider_run", "The Cider Run"],
    ["po_nine_across", "Nine Across the Turning Bridge"],
    ["po_hedgejaw_maze", "The Hedgejaw Maze"],
    ["po_maybe_roost", "The Maybe-Flock Roost"],
    ["po_rootfire_relay", "The Rootfire Relay"],
    ["po_count_the_murder", "Murder at Moonfall"],
    ["po_hollow_bough", "The Hollow Bough Awakens"],
    ["po_one_short", "The Orchard Lockdown"],
    ["po_first_whistle", "The First Whistle"],
  ]) {
    const html = board(scenarioId, ["pip", "bramble", "nine"], PRIMARY_CARDS, "primary");
    if (!html.includes(title) || !html.includes("Party health and action points") || !html.includes("Put down")) throw new Error("Ninefold action dock missing from " + scenarioId);
  }

  const juniorBoard = board("lr_smudged_stones", ["addy", "zoomby", "hunchik"], JUNIOR_CARDS, "junior");
  if (!juniorBoard.includes("The Smudged Stones") || !juniorBoard.includes("End round")) throw new Error("Smudged Stones board did not render");

  const intermediateBoard = board("gf_examination_clock", ["gf_tambrindle", "gf_ratchet", "gf_higgins", "gf_marta"], INTERMEDIATE_CARDS, "intermediate");
  if (!intermediateBoard.includes("The Examination Clock") || !intermediateBoard.includes("End round")) throw new Error("Examination Clock board did not render");

  const sealedArchiveBoard = board("gf_sealed_archive", ["gf_adavoss", "gf_higgins", "gf_marta", "gf_tambrindle"], INTERMEDIATE_CARDS, "intermediate");
  if (!sealedArchiveBoard.includes("The Sealed Archive") || !sealedArchiveBoard.includes("End round")) throw new Error("Sealed Archive board did not render");

  const fogLanternsBoard = board("lr_fog_lanterns", ["addy", "zoomby", "hunchik"], JUNIOR_CARDS, "junior");
  if (!fogLanternsBoard.includes("Lanterns in the Forgetting Fog") || !fogLanternsBoard.includes("End round")) throw new Error("Lanterns in the Forgetting Fog board did not render");

  console.log("Expedition board render passed (all nine catalogued scenarios)");
`;

const result = esbuild.buildSync({
  stdin: { contents: source, resolveDir: root, loader: "jsx" },
  bundle: true,
  platform: "node",
  format: "cjs",
  write: false,
  loader: { ".png": "dataurl", ".jpg": "dataurl", ".jpeg": "dataurl", ".webp": "dataurl", ".svg": "dataurl" },
});

const moduleShim = { exports: {} };
new Function("require", "module", "exports", result.outputFiles[0].text)(require, moduleShim, moduleShim.exports);
