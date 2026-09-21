export const HEX_SQRT_3 = Math.sqrt(3);

export function pointyHexMetrics(side) {
  if (!Number.isFinite(side) || side <= 0) throw new Error("Hex side length must be a positive number");
  return {
    side,
    width: HEX_SQRT_3 * side,
    height: 2 * side,
    horizontalSpacing: HEX_SQRT_3 * side,
    verticalSpacing: 1.5 * side,
    alternateRowOffset: HEX_SQRT_3 * side / 2,
  };
}

export function parseAxialKey(key) {
  const [q, r] = String(key).split(",").map(Number);
  if (!Number.isFinite(q) || !Number.isFinite(r)) throw new Error(`Invalid axial hex key: ${key}`);
  return { q, r };
}

export function axialToPixel(hex, side, origin = { x: 0, y: 0 }) {
  const { q, r } = typeof hex === "string" ? parseAxialKey(hex) : hex;
  const metrics = pointyHexMetrics(side);
  return {
    x: origin.x + metrics.horizontalSpacing * (q + r / 2),
    y: origin.y + metrics.verticalSpacing * r,
  };
}

export function pointyHexVertices(centre, side) {
  const { width } = pointyHexMetrics(side);
  const halfWidth = width / 2;
  return [
    { x: centre.x, y: centre.y - side },
    { x: centre.x + halfWidth, y: centre.y - side / 2 },
    { x: centre.x + halfWidth, y: centre.y + side / 2 },
    { x: centre.x, y: centre.y + side },
    { x: centre.x - halfWidth, y: centre.y + side / 2 },
    { x: centre.x - halfWidth, y: centre.y - side / 2 },
  ];
}

export function pointyHexBounds(keys, side = 1) {
  if (!keys.length) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  const { width } = pointyHexMetrics(side);
  const centres = keys.map((key) => axialToPixel(key, side));
  const minX = Math.min(...centres.map((point) => point.x - width / 2));
  const maxX = Math.max(...centres.map((point) => point.x + width / 2));
  const minY = Math.min(...centres.map((point) => point.y - side));
  const maxY = Math.max(...centres.map((point) => point.y + side));
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

export function fitPointyHexLayout(keys, viewportWidth, viewportHeight, options = {}) {
  const padding = options.padding ?? 24;
  const depth = options.depth ?? 0;
  const unitBounds = pointyHexBounds(keys, 1);
  const usableWidth = Math.max(1, viewportWidth - 2 * padding);
  const usableHeight = Math.max(1, viewportHeight - 2 * padding - depth);
  const side = Math.min(usableWidth / unitBounds.width, usableHeight / unitBounds.height);
  const scaledBounds = pointyHexBounds(keys, side);
  const origin = {
    x: (viewportWidth - scaledBounds.width) / 2 - scaledBounds.minX,
    y: (viewportHeight - depth - scaledBounds.height) / 2 - scaledBounds.minY,
  };
  return { side, origin, bounds: scaledBounds, metrics: pointyHexMetrics(side), depth };
}

export function fitProjectedPointyHexLayout(keys, viewportWidth, viewportHeight, options = {}) {
  const verticalScale = options.verticalScale ?? 0.6;
  if (!Number.isFinite(verticalScale) || verticalScale <= 0) throw new Error("Vertical projection scale must be positive");
  const padding = options.padding ?? 24;
  const depth = options.depth ?? 0;
  const unitBounds = pointyHexBounds(keys, 1);
  const usableWidth = Math.max(1, viewportWidth - 2 * padding);
  const usableHeight = Math.max(1, viewportHeight - 2 * padding - depth);
  const side = Math.min(usableWidth / unitBounds.width, usableHeight / (unitBounds.height * verticalScale));
  const bounds = pointyHexBounds(keys, side);
  const projectedHeight = bounds.height * verticalScale;
  const origin = {
    x: (viewportWidth - bounds.width) / 2 - bounds.minX,
    y: (viewportHeight - depth - projectedHeight) / 2 - bounds.minY * verticalScale,
  };
  const regular = pointyHexMetrics(side);
  return {
    side,
    origin,
    depth,
    verticalScale,
    metrics: { ...regular, height: regular.height * verticalScale, sideY: side * verticalScale, verticalSpacing: regular.verticalSpacing * verticalScale },
    bounds: { ...bounds, minY: bounds.minY * verticalScale, maxY: bounds.maxY * verticalScale, height: projectedHeight },
  };
}

export function pointInPointyHex(point, centre, side) {
  const dx = Math.abs(point.x - centre.x);
  const dy = Math.abs(point.y - centre.y);
  return dx <= HEX_SQRT_3 * side / 2 && dy <= side && dx + HEX_SQRT_3 * dy <= HEX_SQRT_3 * side;
}
