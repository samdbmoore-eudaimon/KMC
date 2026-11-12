// Bridge and gate crossings must be usable from both land sides (Sam's playthrough, 3 October 2026:
// a decorative hedge sat on the far exit of a permanent bridge, leaving a dead-end deck).
//
// Land is every tile a hero can stand on once all crossing tiles (terrain bridge or gate) are removed. A
// crossing is usable only when its passable neighbours touch at least two DIFFERENT land components, and
// every touched component is large enough to be a real region rather than a hedge-enclosed pocket.
import { neighbourKeys, hexKey, hexDistance } from '../index.js';

const MIN_REGION = 8;
const isCrossing = (t) => t.terrain === 'bridge' || t.terrain === 'gate';
const isLand = (t) => !!t && !isCrossing(t) && !['water', 'hedge'].includes(t.terrain) && !t.solid;

export function landComponents(tiles) {
  const map = new Map(tiles.map((t) => [hexKey(t.q, t.r), t]));
  const comp = new Map();
  let id = 0;
  for (const [key, tile] of map) {
    if (comp.has(key) || !isLand(tile)) continue;
    const queue = [key];
    comp.set(key, id);
    for (let i = 0; i < queue.length; i += 1) for (const n of neighbourKeys(queue[i])) if (!comp.has(n) && isLand(map.get(n))) { comp.set(n, id); queue.push(n); }
    id += 1;
  }
  const sizes = new Map();
  for (const c of comp.values()) sizes.set(c, (sizes.get(c) || 0) + 1);
  return { map, comp, sizes };
}

// Returns [] when every crossing connects two real land regions; otherwise one record per bad crossing.
export function crossingExitViolations(blueprint) {
  const { map, comp, sizes } = landComponents(blueprint.tiles);
  const bad = [];
  for (const tile of blueprint.tiles.filter(isCrossing)) {
    const key = hexKey(tile.q, tile.r);
    if (tile.terrain === 'gate') {
      // A gate sits in a hedge line that permanent gaps already keep connected: it must be a real through-passage.
      const open = neighbourKeys(key).filter((n) => isLand(map.get(n)));
      const through = open.some((a) => open.some((b) => hexDistance(a, b) >= 2));
      if (!through) bad.push({ crossing: key, controlled: !!tile.passageOutputId, regionsTouched: open.length, neighbours: neighbourKeys(key).map((n) => n + ':' + (map.get(n)?.terrain || 'off')) });
      continue;
    }
    const touched = new Set();
    for (const n of neighbourKeys(key)) if (comp.has(n) && sizes.get(comp.get(n)) >= MIN_REGION) touched.add(comp.get(n));
    if (touched.size < 2) {
      const neighbours = neighbourKeys(key).map((n) => `${n}:${map.get(n)?.terrain || 'off'}`);
      bad.push({ crossing: key, controlled: !!tile.passageOutputId, regionsTouched: touched.size, neighbours });
    }
  }
  return bad;
}
