import { DIRECTIONS } from "./constants.js";

export const hexKey = (q, r) => `${q},${r}`;
export function parseHex(key) {
  const [q, r] = String(key).split(",").map(Number);
  return { q, r };
}
export const isHexKey = (key) => typeof key === "string" && /^-?\d+,-?\d+$/.test(key);

export function hexDistance(a, b) {
  const A = typeof a === "string" ? parseHex(a) : a;
  const B = typeof b === "string" ? parseHex(b) : b;
  const dq = A.q - B.q, dr = A.r - B.r;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

export function neighbourKeys(key) {
  const { q, r } = parseHex(key);
  return DIRECTIONS.map(([dq, dr]) => hexKey(q + dq, r + dr));
}

// Numerical (r,q) ordering, then caller's stable ID. Never locale dependent.
export function compareHex(a, b) {
  const A = parseHex(a), B = parseHex(b);
  return A.r - B.r || A.q - B.q;
}

export function offsetToAxial(c, r) {
  return { q: c - Math.floor(r / 2), r };
}
export const offsetKey = (c, r) => { const h = offsetToAxial(c, r); return hexKey(h.q, h.r); };

const NUDGE = [0.000001, 0.000001, -0.000002];

function cubeRound(x, y, z) {
  let rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
  const dx = Math.abs(rx - x), dy = Math.abs(ry - y), dz = Math.abs(rz - z);
  if (dx >= dy && dx >= dz) rx = -ry - rz;
  else if (dy >= dz) ry = -rx - rz;
  else rz = -rx - ry;
  return [rx + 0, ry + 0, rz + 0];
}

// Published line-of-sight helper: forecast, preview and resolution all call this.
// Returns every hex on the line including both endpoints.
export function hexLine(fromKey, toKey) {
  const a = parseHex(fromKey), b = parseHex(toKey);
  const n = hexDistance(a, b);
  const ax = a.q + NUDGE[0], ay = -a.q - a.r + NUDGE[1], az = a.r + NUDGE[2];
  const bx = b.q + NUDGE[0], by = -b.q - b.r + NUDGE[1], bz = b.r + NUDGE[2];
  const out = [];
  for (let i = 0; i <= n; i += 1) {
    const t = n === 0 ? 0 : i / n;
    const [x, , z] = cubeRound(ax + (bx - ax) * t, ay + (by - ay) * t, az + (bz - az) * t);
    out.push(hexKey(x, z));
  }
  return out;
}

export function rangeKeys(centreKey, radius) {
  const { q, r } = parseHex(centreKey);
  const out = [];
  for (let dq = -radius; dq <= radius; dq += 1) {
    for (let dr = Math.max(-radius, -dq - radius); dr <= Math.min(radius, -dq + radius); dr += 1) out.push(hexKey(q + dq, r + dr));
  }
  return out;
}
