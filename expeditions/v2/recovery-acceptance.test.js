// Independent acceptance checks for the 3 October 2026 playthrough recovery. They drive the REAL ExpeditionScreen
// (route + OrchardExpedition + runtime generator + puzzle hooks) in jsdom as the eligible private profile with a real
// owned collection, and read what App would persist. jsdom has no layout or touch hardware: native device and child
// comprehension checks are NOT covered here.
import test from "node:test";
import assert from "node:assert/strict";
import { bundle, dom, click, ROOKE } from "./route-harness.js";
import { generateOrchardBlueprint } from "./generation/index.js";
import { crossingExitViolations } from "./generation/crossing-invariants.js";

let mod = null;
const OWNED = { tuppence: 1, furrow: 1, sorrel: 2 };

async function session(profile = ROOKE, cards = OWNED) {
  mod ||= await bundle();
  const d = dom();
  const state = { saved: { cards: { ...cards }, stars: 0, packs: 0, expeditions: { version: 2, scenarios: { legacy: { completed: true } }, moduleSetRewarded: false } }, exits: 0 };
  const handle = mod.mount(d.window.document.getElementById("root"), { profile, progress: state.saved, onProgress: (p) => { state.saved = p; }, onExit: () => { state.exits += 1; } });
  const root = d.window.document.getElementById("root");
  const buttons = () => [...root.querySelectorAll("button")];
  const label = (b) => `${b.textContent} ${b.getAttribute("aria-label") || ""}`.trim();
  const find = (re) => buttons().find((b) => re.test(label(b)));
  const text = () => { const c = root.cloneNode(true); c.querySelectorAll("style").forEach((x) => x.remove()); return c.textContent; };
  const commands = () => state.saved.expeditions.v2?.activeRun?.record.commands || [];
  return { d, handle, root, state, buttons, find, text, commands, click: (b) => { assert.ok(b, "button exists"); return click(handle, b); } };
}
async function embark(s) {
  await s.click(s.find(/Embark/));
  assert.ok(s.commands().length === 0 && s.state.saved.expeditions.v2.activeRun, "run saved before any move");
}

test("movement: first tap previews only, second tap on the same hex commits exactly once, a different hex replaces the preview", async () => {
  const s = await session();
  await embark(s);
  await s.click(s.find(/Select Furrow/));
  const previews = s.buttons().filter((b) => /^Preview move to/.test(b.textContent));
  assert.ok(previews.length >= 2);
  const [a, b] = previews;
  await s.click(a);
  assert.equal(s.commands().length, 0, "first tap spends and saves nothing");
  assert.ok(s.find(/Confirm/), "explicit Confirm remains available");
  await s.click(b);
  assert.equal(s.commands().length, 0, "tapping another hex only replaces the preview");
  const again = s.buttons().find((x) => x.textContent === b.textContent);
  await s.click(again);
  assert.equal(s.commands().length, 1, "second tap on the same hex commits one command");
  assert.equal(s.commands()[0].type, "move");
  assert.equal(s.commands()[0].heroId, "furrow");
});

test("movement: keyboard-style Confirm works, and changing hero drops a stale preview", async () => {
  const s = await session();
  await embark(s);
  await s.click(s.find(/Select Furrow/));
  const preview = s.buttons().find((b) => /^Preview move to/.test(b.textContent));
  const dest = preview.textContent;
  await s.click(preview);
  await s.click(s.find(/Select Sorrel/));
  assert.equal(s.root.querySelector(".ov-preview"), null, "selecting another hero drops the stale preview");
  const same = s.buttons().find((b) => b.textContent === dest);
  if (same) {
    await s.click(same);
    assert.equal(s.commands().length, 0, "a preview made for another hero never commits for this one");
  }
  await s.click(s.find(/Select Furrow/));
  await s.click(s.buttons().find((b) => /^Preview move to/.test(b.textContent)));
  assert.equal(s.commands().length, 0, "after switching back, the first tap only previews again");
  await s.click(s.find(/^Confirm/));
  assert.equal(s.commands().length, 1, "Confirm commits exactly one command");
});

test("bridges: the runtime never offers a map with an unusable crossing", () => {
  for (let seed = 0; seed < 64; seed += 1) {
    const bp = generateOrchardBlueprint({ familyId: "four-locks", tier: 1, seed });
    assert.deepEqual(crossingExitViolations(bp), [], `bank entry ${seed}`);
  }
});

test("puzzle: the draft is free from anywhere, activation is explained and honestly unavailable away from the control", async () => {
  const s = await session();
  await embark(s);
  assert.match(s.text(), /Next: (Activate the number lock|Walk a hero to the Ledger control)/);
  await s.click(s.find(/^(Puzzle|Open the puzzle)/));
  assert.match(s.text(), /Two steps/);
  assert.match(s.text(), /free, from anywhere/);
  assert.match(s.text(), /on or beside the Ledger control/);
  assert.match(s.text(), /(is beside the control with an action to spare|No hero is beside the control)/);
  assert.equal(s.commands().filter((c) => c.type === "operate").length, 0, "opening the puzzle activates nothing");
});

test("action help: every action explains purpose, cost, target and reason without executing; touch help uses a separate button", async () => {
  const s = await session();
  await embark(s);
  await s.click(s.find(/Select Tuppence/));
  const infos = s.buttons().filter((b) => /^About /.test(b.getAttribute("aria-label") || ""));
  assert.ok(infos.length >= 5);
  const before = s.commands().length;
  await s.click(infos[0]);
  const help = s.root.querySelector(".ov-action-help");
  assert.ok(help, "help panel opens");
  assert.match(help.textContent, /Cost:/);
  assert.match(help.textContent, /Target:/);
  assert.match(help.textContent, /Uses:/);
  assert.equal(s.commands().length, before, "help never dispatches");
  await s.click(s.find(/Close help/));
  assert.equal(s.root.querySelector(".ov-action-help"), null);
  const titled = s.buttons().filter((b) => /1 action|2 actions/.test(b.textContent) && b.getAttribute("title"));
  assert.ok(titled.length >= 5, "desktop hover/focus text exists on action buttons");
  for (const b of titled) assert.match(b.getAttribute("title"), /Cost: \d action/);
});

test("enemy phase and loss: ending every round shows what the enemy turn did and the exact loss reason", async () => {
  const s = await session();
  await embark(s);
  const hide = s.find(/Hide guide/);
  if (hide) await s.click(hide);
  for (let round = 1; round <= 5; round += 1) {
    await s.click(s.find(/^End round/));
    assert.match(s.text(), /Next enemy phase/);
    await s.click(s.find(/Confirm end round/));
    assert.equal(s.commands().filter((c) => c.type === "end-round").length, round);
    const cont = s.find(/Continue round/);
    if (cont) { assert.match(s.text(), /What happened this enemy turn/); await s.click(cont); }
  }
  const status = s.state.saved.expeditions.v2.activeRun.status;
  assert.equal(status, "lost");
  assert.match(s.text(), /deadline|fifth|round 5|did not save|time ran out|ran out/i);
  assert.equal(s.state.saved.stars, 0, "a loss never rewards");
});

test("eligible-profile App path: owned collection, save before the first move, resume after remount, legacy fields intact, gate holds", async () => {
  const s = await session();
  await embark(s);
  assert.deepEqual(s.state.saved.expeditions.scenarios, { legacy: { completed: true } }, "legacy Expeditions progress untouched");
  assert.equal(s.state.saved.expeditions.moduleSetRewarded, false);
  await s.click(s.find(/Select Furrow/));
  await s.click(s.buttons().find((b) => /^Preview move to/.test(b.textContent)));
  await s.click(s.find(/Confirm/));
  const saved = s.state.saved;
  s.handle.unmount();
  const second = dom();
  const handle = mod.mount(second.window.document.getElementById("root"), { profile: ROOKE, progress: saved, onProgress: () => {}, onExit: () => {} });
  assert.match(second.window.document.getElementById("root").textContent, /Round 1\/5/);
  handle.unmount();
  const blocked = await session({ name: "Eudaimon", avatar: "card:primary:pip" });
  assert.equal(blocked.root.innerHTML, "", "any other profile renders nothing");
  const unowned = await session(ROOKE, {});
  assert.equal(unowned.find(/Embark/)?.disabled ?? true, true, "no owned cards: no Embark");
});
