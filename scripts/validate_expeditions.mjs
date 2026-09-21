import assert from "node:assert/strict";
import { EXPEDITION_ENEMIES, EXPEDITION_OBJECTIVE_FAMILIES, EXPEDITION_SCENARIOS, EXPEDITION_TIERS } from "../expeditions/expedition-data.js";
import { allExpeditionCommanders, allExpeditionProfiles, expeditionRoster } from "../expeditions/expedition-roster.js";
import { createUnequalCrossing } from "../expeditions/unequal-crossing.js";
import { estimateExpeditionMinutes, solveBalancedPartition } from "../expeditions/expedition-engine.js";
import { assertValidExpeditionContent } from "../expeditions/expedition-schema.js";
import { COMMANDER_POWERS } from "../expeditions/expedition-commander.js";

// Build-time content validation (E1): fails loudly with the precise scenario id and field
// for every broken entry, instead of letting bad content reach the engine or the UI.
assertValidExpeditionContent();
const profiles = allExpeditionProfiles();
const commanders = allExpeditionCommanders();
assert.equal(profiles.length, 90);
assert.equal(commanders.length, 30);

// Every Commander must at least have a registry entry (ROS-09) — implemented or not — so a
// renamed/missing commander id is caught here, not discovered later behind a UI click.
for (const commander of commanders) assert.ok(COMMANDER_POWERS[commander.id], `${commander.id} has no Commander power registry entry`);
const implementedCommanders = commanders.filter((c) => COMMANDER_POWERS[c.id].implemented).length;

for (const profile of profiles) {
  assert.ok(profile.signatureName && profile.signatureRule, `${profile.id} needs a signature`);
  assert.ok(profile.role && profile.trait && profile.discipline, `${profile.id} needs a complete assignment`);
}

const allScenarios = Object.values(EXPEDITION_SCENARIOS).flat();
assert.equal(allScenarios.length, 30);
assert.equal(new Set(allScenarios.map((scenario) => scenario.id)).size, 30);
for (const scenario of allScenarios) {
  assert.ok(EXPEDITION_OBJECTIVE_FAMILIES[scenario.family], `${scenario.id} has unknown family ${scenario.family}`);
  assert.ok(scenario.rule, `${scenario.id} needs a rule`);
  for (const enemy of scenario.enemies || []) assert.ok(EXPEDITION_ENEMIES[enemy], `${scenario.id} references missing enemy ${enemy}`);
}

const balanceSolutions = solveBalancedPartition([2, 3, 4, 5], 7);
assert.equal(balanceSolutions.length, 1);

const prototypeSquad = ["pip", "bramble", "nine"].map((id) => expeditionRoster("primary").find((profile) => profile.id === id));
const prototype = createUnequalCrossing(prototypeSquad);
const prototypeMinutes = estimateExpeditionMinutes(prototype);
assert.ok(prototypeMinutes <= EXPEDITION_TIERS.primary.hardLimitMinutes);

console.log(`Expedition validation passed`);
console.log(`  content schema: all ${allScenarios.length} scenario blueprints valid (schema v${allScenarios[0]?.schemaVersion ?? "?"})`);
console.log(`  ${profiles.length} field-character profiles`);
console.log(`  ${commanders.length} boss commander powers (${implementedCommanders} implemented, ${commanders.length - implementedCommanders} pending later content stages)`);
console.log(`  ${allScenarios.length} authored scenario briefs`);
console.log(`  ${Object.keys(EXPEDITION_OBJECTIVE_FAMILIES).length} objective engines`);
console.log(`  ${Object.keys(EXPEDITION_ENEMIES).length} enemy behaviours`);
console.log(`  Unequal Crossing estimated duration: ${prototypeMinutes.toFixed(1)} minutes`);
for (const moduleKey of ["primary", "junior", "intermediate"]) {
  const roster = expeditionRoster(moduleKey);
  const roles = Object.fromEntries(["tank", "healer", "wizard", "melee", "ranged"].map((role) => [role, roster.filter((profile) => profile.role === role).length]));
  const disciplines = Object.fromEntries(["arithmetic", "geometry", "logic", "science", "speed"].map((discipline) => [discipline, roster.filter((profile) => profile.discipline === discipline).length]));
  console.log(`  ${moduleKey}: roles ${JSON.stringify(roles)}; disciplines ${JSON.stringify(disciplines)}`);
}
