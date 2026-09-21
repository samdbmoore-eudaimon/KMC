// Regression guard for the Expeditions developer-only gate (ACC-01 to ACC-06 in
// EXPEDITIONS_CLAUDE_HANDOVER.md). Expeditions is not approved for release: only the
// exact eudaimon profile with the Rooke avatar may ever see the home tile or enter the
// route. These tests must keep failing loudly if that gate is ever weakened, generalised
// or accidentally removed while the app source is edited.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canAccessExpeditions } from "../expeditions/expedition-access.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_SOURCE = fs.readFileSync(path.join(ROOT, "WallabyMaths.jsx"), "utf-8");
const APP_LINES = APP_SOURCE.split("\n");

function sliceBalanced(startLine, startPredicate) {
  const start = APP_LINES.findIndex(startPredicate);
  assert.ok(start >= 0, `expected to find ${startLine}`);
  let depth = 0;
  for (let i = start; i < APP_LINES.length; i += 1) {
    for (const ch of APP_LINES[i]) {
      if (ch === "{" || ch === "[") depth += 1;
      else if (ch === "}" || ch === "]") depth -= 1;
    }
    if (depth === 0 && i > start) return APP_LINES.slice(start, i + 1).join("\n");
  }
  throw new Error(`could not find the balanced end of ${startLine}`);
}

test("ACC-01: an ordinary named profile does not see the Expeditions tile", () => {
  assert.equal(canAccessExpeditions({ name: "Alex", avatar: "card:primary:pip" }), false);
  assert.equal(canAccessExpeditions(null), false);
  assert.ok(
    APP_SOURCE.includes('.filter((m) => m.key !== "expeditions" || canAccessExpeditions(me))'),
    "Home's tile list must gate the expeditions tile on canAccessExpeditions(me)"
  );
});

test("ACC-02: eudaimon with a non-Rooke avatar does not see the tile", () => {
  assert.equal(canAccessExpeditions({ name: "eudaimon", avatar: "card:primary:pip" }), false);
  assert.equal(canAccessExpeditions({ name: "eudaimon", avatar: "card:intermediate:gf_wrought" }), false);
  assert.equal(canAccessExpeditions({ name: "eudaimon", avatar: null }), false);
});

test("ACC-03: the Rooke avatar with a different profile name does not see the tile", () => {
  assert.equal(canAccessExpeditions({ name: "someone", avatar: "card:intermediate:gf_rooke" }), false);
  assert.equal(canAccessExpeditions({ name: "eudaimonx", avatar: "card:intermediate:gf_rooke" }), false);
});

test("ACC-04: exact eudaimon plus Rooke sees the tile, independent of the active module", () => {
  assert.equal(canAccessExpeditions({ name: "eudaimon", avatar: "card:intermediate:gf_rooke" }), true);
  assert.equal(canAccessExpeditions({ name: " Eudaimon ", avatar: "card:intermediate:gf_rooke" }), true);
  const filterLine = APP_LINES.find((line) => line.includes('m.key !== "expeditions"'));
  assert.ok(filterLine, "expected to find the expeditions tile filter");
  assert.ok(!/activeModule/.test(filterLine), "the expeditions tile filter must depend only on the profile, never the active module");
});

test('ACC-05: an ordinary profile forced onto screen="expeditions" is returned to a safe home view', () => {
  const routeLine = APP_LINES.find((line) => line.includes('screen === "expeditions" &&'));
  assert.ok(routeLine, "expected to find the expeditions route render");
  assert.ok(routeLine.includes("canAccessExpeditions(me) ? <ExpeditionScreen"), "route rendering must gate ExpeditionScreen on canAccessExpeditions(me)");
  assert.ok(routeLine.includes(": <Home"), "denied access must fall back to the Home screen, not a blank screen or error state");
});

test("ACC-06: Expeditions is absent from the welcome tour, the Get Started guide and the progress report", () => {
  const tourSource = sliceBalanced("TOUR_STEPS", (line) => line.trim().startsWith("const TOUR_STEPS = ["));
  assert.ok(!/expedition/i.test(tourSource), "the welcome tour must not mention Expeditions");

  const guideSource = sliceBalanced("GUIDE_TOPICS", (line) => line.trim().startsWith("const GUIDE_TOPICS = ["));
  assert.ok(!/expedition/i.test(guideSource), "the Get Started guide must not mention Expeditions");

  const reportSource = sliceBalanced("ProgressReport", (line) => line.startsWith("function ProgressReport("));
  assert.ok(!/expedition/i.test(reportSource), "the progress report must not mention Expeditions");
});

console.log("Expedition access-gate regression passed (ACC-01 to ACC-06)");
