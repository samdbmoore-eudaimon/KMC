import { CHARGE_CAPACITY, DEADLINE_ROUNDS, ENEMY_RULES, FAMILY_IDS, PUZZLE_KINDS, RULES_VERSION, SCHEMA_VERSION, SQUAD_SIZE, MODULE_KEY, orchardMaxIntegrity, stationMaxIntegrity } from "./constants.js";
import { hexDistance, hexKey, isHexKey, neighbourKeys } from "./hex.js";

const TERRAINS = ["floor", "path", "bridge", "clearing", "roots", "water", "hedge", "gate"];
const OUTPUT_EFFECTS = ["passage", "shelter", "roots", "storm", "repair-stream", "strike-window", "beam", "reserve-benefit", "none"];
const OUTPUT_TRIGGERS = ["on-commit", "continuous", "phase-start", "post-hazard"];
const REQUIRED_STATIONS = ["control", "number", "shape", "sustain", "alcove"];

// Structured result: {ok, status:'ok'|'invalid', errors:[{code,path,message}]}. Never throws on bad data.
export function validateBlueprint(blueprint) {
  const errors = [];
  const err = (code, path, message) => errors.push({ code, path, message });
  if (!blueprint || typeof blueprint !== "object") return { ok: false, status: "invalid", errors: [{ code: "not-an-object", path: "", message: "Blueprint must be an object" }] };
  if (blueprint.schemaVersion !== SCHEMA_VERSION) err("schema-version", "schemaVersion", `schemaVersion must be ${SCHEMA_VERSION}`);
  if (blueprint.rulesVersion !== RULES_VERSION) err("rules-version", "rulesVersion", `rulesVersion must be ${RULES_VERSION}`);
  if (blueprint.moduleKey !== MODULE_KEY) err("module", "moduleKey", "Orchard v2 is Ninefold Orchard (primary) only");
  if (!FAMILY_IDS.includes(blueprint.familyId)) err("family", "familyId", "Unknown family");
  if (!Number.isInteger(blueprint.tier) || blueprint.tier < 1 || blueprint.tier > 5) err("tier", "tier", "Tier must be 1..5");
  if (blueprint.deadline !== DEADLINE_ROUNDS) err("deadline", "deadline", `deadline must be ${DEADLINE_ROUNDS}`);
  if (errors.length) return { ok: false, status: "invalid", errors };
  const tier = blueprint.tier;

  const tiles = new Map();
  if (!Array.isArray(blueprint.tiles) || !blueprint.tiles.length) err("tiles", "tiles", "tiles required");
  else {
    for (const tile of blueprint.tiles) {
      if (!Number.isInteger(tile.q) || !Number.isInteger(tile.r)) { err("tile-coords", "tiles", "Tile needs integer q,r"); continue; }
      const key = hexKey(tile.q, tile.r);
      if (tiles.has(key)) err("tile-duplicate", `tiles.${key}`, "Duplicate tile");
      if (!TERRAINS.includes(tile.terrain)) err("tile-terrain", `tiles.${key}`, `Unknown terrain ${tile.terrain}`);
      tiles.set(key, tile);
    }
  }
  const walkable = (key) => { const t = tiles.get(key); return !!t && !t.solid && !["water", "hedge", "gate"].includes(t.terrain) && !(t.terrain === "bridge" && t.passageOutputId) && !t.passageOutputId; };
  const standable = (key) => { const t = tiles.get(key); return !!t && !["water", "hedge"].includes(t.terrain); };

  const outputs = new Map();
  for (const output of blueprint.outputs || []) {
    if (outputs.has(output.id)) err("output-duplicate", `outputs.${output.id}`, "Duplicate output");
    outputs.set(output.id, output);
    if (!OUTPUT_EFFECTS.includes(output.effect?.kind)) err("output-effect", `outputs.${output.id}`, "Unknown effect kind");
    if (!OUTPUT_TRIGGERS.includes(output.trigger)) err("output-trigger", `outputs.${output.id}`, "Unknown trigger");
  }
  for (const [key, tile] of tiles) if (tile.passageOutputId && !outputs.has(tile.passageOutputId)) err("passage-output", `tiles.${key}`, "passageOutputId has no output");

  const stations = new Map();
  for (const st of blueprint.stations || []) {
    if (stations.has(st.id)) err("station-duplicate", `stations.${st.id}`, "Duplicate station");
    stations.set(st.id, st);
    if (!isHexKey(st.hex) || !standable(st.hex)) err("station-hex", `stations.${st.id}`, "Station must stand on a non-water, non-hedge tile");
  }
  for (const id of REQUIRED_STATIONS) if (!stations.has(id)) err("station-missing", `stations.${id}`, `Missing station ${id}`);
  for (const id of ["number", "shape", "sustain"]) {
    const st = stations.get(id);
    if (st && st.capacity !== CHARGE_CAPACITY[tier - 1]) err("station-capacity", `stations.${id}`, `capacity must be ${CHARGE_CAPACITY[tier - 1]}`);
  }
  for (const id of ["control", "number", "shape", "sustain"]) {
    const st = stations.get(id);
    if (st && st.maxIntegrity !== stationMaxIntegrity(tier)) err("station-integrity", `stations.${id}`, `maxIntegrity must be ${stationMaxIntegrity(tier)}`);
  }
  for (const [a, b] of [["number", "shape"], ["number", "sustain"], ["shape", "sustain"]]) {
    if (stations.get(a) && stations.get(b) && hexDistance(stations.get(a).hex, stations.get(b).hex) < 3) err("station-spacing", `stations.${a}`, `${a} and ${b} must be at least 3 apart`);
  }
  if (!blueprint.orchard || !isHexKey(blueprint.orchard.hex) || !standable(blueprint.orchard.hex)) err("orchard-hex", "orchard", "Orchard needs a standable hex");
  if (blueprint.orchardMaxIntegrity !== orchardMaxIntegrity(tier)) err("orchard-integrity", "orchardMaxIntegrity", `must be ${orchardMaxIntegrity(tier)}`);

  const puzzle = blueprint.puzzle;
  if (!puzzle || (!blueprint.fixture && puzzle.kind !== PUZZLE_KINDS[blueprint.familyId])) err("puzzle-kind", "puzzle.kind", `Family ${blueprint.familyId} needs kind ${PUZZLE_KINDS[blueprint.familyId]}`);
  const groupIds = new Set();
  for (const group of puzzle?.lockGroups || []) {
    if (groupIds.has(group.id)) err("group-duplicate", `puzzle.lockGroups.${group.id}`, "Duplicate lock group");
    groupIds.add(group.id);
    if (!isHexKey(group.anchor) || !tiles.has(group.anchor)) err("group-anchor", `puzzle.lockGroups.${group.id}`, "Group anchor must be a tile");
  }
  if (puzzle && puzzle.networkGroupId && !groupIds.has(puzzle.networkGroupId)) err("network-group", "puzzle.networkGroupId", "networkGroupId must name a lock group");
  if (puzzle && !puzzle.networkGroupId && !groupIds.has("network")) err("network-group", "puzzle.lockGroups", "A group named network (or puzzle.networkGroupId) is required");
  const siteIds = new Set();
  for (const site of blueprint.sites || []) {
    siteIds.add(site.id);
    if (!isHexKey(site.anchor) || !tiles.has(site.anchor)) err("site-anchor", `sites.${site.id}`, "Site anchor must be a tile");
  }

  const deployment = blueprint.deployment;
  if (!Array.isArray(deployment) || deployment.length !== SQUAD_SIZE || new Set(deployment).size !== SQUAD_SIZE || !deployment.every((k) => isHexKey(k) && walkable(k))) err("deployment", "deployment", "Three distinct walkable deployment hexes required");

  const used = new Set(deployment || []);
  for (const enemy of blueprint.enemies || []) {
    if (!ENEMY_RULES[enemy.ruleId]) err("enemy-rule", `enemies.${enemy.id}`, "Unknown enemy rule");
    if (!isHexKey(enemy.position) || !walkable(enemy.position)) err("enemy-position", `enemies.${enemy.id}`, "Enemy start must be a walkable tile");
    if (used.has(enemy.position)) err("enemy-overlap", `enemies.${enemy.id}`, "Enemy start overlaps another start");
    used.add(enemy.position);
    if (!Number.isInteger(enemy.wakePhase) || enemy.wakePhase < 1 || enemy.wakePhase > DEADLINE_ROUNDS) err("enemy-wake", `enemies.${enemy.id}`, "wakePhase must be 1..5");
    if (stations.get("control") && isHexKey(enemy.position) && hexDistance(enemy.position, stations.get("control").hex) < 3) err("enemy-near-control", `enemies.${enemy.id}`, "Enemy must start at least 3 from control");
    for (const d of deployment || []) if (isHexKey(enemy.position) && hexDistance(enemy.position, d) < 5) err("enemy-near-deployment", `enemies.${enemy.id}`, "Enemy must start at least 5 from deployment");
  }

  for (const hazard of blueprint.hazards || []) {
    for (const site of hazard.sites || []) if (!stations.has(site.targetId) && !siteIds.has(site.targetId)) err("hazard-site", `hazards.${hazard.id}`, `Unknown hazard target ${site.targetId}`);
  }
  if (!blueprint.commission || (blueprint.commission.poweredCount == null && !blueprint.commission.poweredIds)) err("commission", "commission", "commission needs poweredCount or poweredIds");

  // Static connectivity with every controlled passage closed: no puzzle solve may be needed to reach a station.
  if (!errors.length) {
    const start = deployment[0];
    const seen = new Set([start]);
    const queue = [start];
    for (let i = 0; i < queue.length; i += 1) for (const n of neighbourKeys(queue[i])) if (!seen.has(n) && walkable(n)) { seen.add(n); queue.push(n); }
    for (const d of deployment) if (!seen.has(d)) err("deployment-split", "deployment", `Deployment ${d} is cut off from the others`);
    for (const id of ["control", "number", "shape", "sustain", "alcove"]) {
      const st = stations.get(id);
      if (st && !seen.has(st.hex)) err("station-unreachable", `stations.${id}`, `${id} is unreachable without puzzle bridges`);
    }
    if (blueprint.orchard && !seen.has(blueprint.orchard.hex)) err("orchard-unreachable", "orchard", "Orchard is unreachable without puzzle bridges");
  }
  return { ok: errors.length === 0, status: errors.length ? "invalid" : "ok", errors };
}
