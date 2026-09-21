import assert from "node:assert/strict";
import test from "node:test";
import {
  HEX_SQRT_3,
  axialToPixel,
  fitProjectedPointyHexLayout,
  pointInPointyHex,
  pointyHexBounds,
  pointyHexMetrics,
  pointyHexVertices,
} from "../expeditions/expedition-hex-layout.js";

const EPSILON = 0.001;
const SIDE = 50;
const DIRECTIONS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const EDGE_PAIRS = [
  [[1, 2], [5, 4]],
  [[0, 1], [4, 3]],
  [[5, 0], [3, 2]],
  [[4, 5], [2, 1]],
  [[3, 4], [1, 0]],
  [[2, 3], [0, 5]],
];

function close(actual, expected, label) {
  assert.ok(Math.abs(actual - expected) <= EPSILON, `${label}: expected ${expected}, received ${actual}`);
}

function radiusKeys(radius) {
  const keys = [];
  for (let q = -radius; q <= radius; q += 1) {
    for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r += 1) keys.push(`${q},${r}`);
  }
  return keys;
}

test("pointy-top metrics match the regular-hex contract", () => {
  const metrics = pointyHexMetrics(SIDE);
  close(metrics.width, HEX_SQRT_3 * SIDE, "width");
  close(metrics.height, 2 * SIDE, "height");
  close(metrics.horizontalSpacing, HEX_SQRT_3 * SIDE, "horizontal spacing");
  close(metrics.verticalSpacing, 1.5 * SIDE, "vertical spacing");
  close(metrics.alternateRowOffset, HEX_SQRT_3 * SIDE / 2, "alternate row offset");
});

test("all six axial neighbours have the exact pointy-top centre vectors", () => {
  const origin = axialToPixel("0,0", SIDE);
  const expected = [
    [HEX_SQRT_3 * SIDE, 0],
    [HEX_SQRT_3 * SIDE / 2, -1.5 * SIDE],
    [-HEX_SQRT_3 * SIDE / 2, -1.5 * SIDE],
    [-HEX_SQRT_3 * SIDE, 0],
    [-HEX_SQRT_3 * SIDE / 2, 1.5 * SIDE],
    [HEX_SQRT_3 * SIDE / 2, 1.5 * SIDE],
  ];
  DIRECTIONS.forEach(([q, r], index) => {
    const neighbour = axialToPixel({ q, r }, SIDE);
    close(neighbour.x - origin.x, expected[index][0], `direction ${index} x`);
    close(neighbour.y - origin.y, expected[index][1], `direction ${index} y`);
  });
});

test("neighbouring top faces share identical edge endpoints", () => {
  const originCentre = axialToPixel("0,0", SIDE);
  const originVertices = pointyHexVertices(originCentre, SIDE);
  DIRECTIONS.forEach(([q, r], directionIndex) => {
    const neighbourVertices = pointyHexVertices(axialToPixel({ q, r }, SIDE), SIDE);
    const [originEdge, neighbourEdge] = EDGE_PAIRS[directionIndex];
    originEdge.forEach((originVertexIndex, endpointIndex) => {
      const neighbourVertexIndex = neighbourEdge[endpointIndex];
      close(originVertices[originVertexIndex].x, neighbourVertices[neighbourVertexIndex].x, `direction ${directionIndex} endpoint ${endpointIndex} x`);
      close(originVertices[originVertexIndex].y, neighbourVertices[neighbourVertexIndex].y, `direction ${directionIndex} endpoint ${endpointIndex} y`);
    });
  });
});

test("affine isometric projection widens the visible hex without opening neighbour gaps", () => {
  const layout = fitProjectedPointyHexLayout(radiusKeys(2), 900, 560, { verticalScale: 0.6, padding: 20, depth: 24 });
  close(layout.metrics.width / layout.metrics.height, HEX_SQRT_3 / 1.2, "projected width-to-height ratio");
  const project = (key) => {
    const centre = axialToPixel(key, layout.side, layout.origin);
    return pointyHexVertices(centre, layout.side).map((vertex) => ({ x: vertex.x, y: layout.origin.y + (vertex.y - layout.origin.y) * layout.verticalScale }));
  };
  const originVertices = project("0,0");
  DIRECTIONS.forEach(([q, r], directionIndex) => {
    const neighbourVertices = project(`${q},${r}`);
    const [originEdge, neighbourEdge] = EDGE_PAIRS[directionIndex];
    originEdge.forEach((originVertexIndex, endpointIndex) => {
      const match = neighbourVertices[neighbourEdge[endpointIndex]];
      close(originVertices[originVertexIndex].x, match.x, `projected direction ${directionIndex} x`);
      close(originVertices[originVertexIndex].y, match.y, `projected direction ${directionIndex} y`);
    });
  });
});

test("a radius-three top-face field has the specified complete bounds", () => {
  const bounds = pointyHexBounds(radiusKeys(3), SIDE);
  close(bounds.width, 7 * HEX_SQRT_3 * SIDE, "radius-three width");
  close(bounds.height, 11 * SIDE, "radius-three height");
});

test("the hit test accepts the hex and rejects rectangular padding", () => {
  const centre = { x: 100, y: 100 };
  assert.equal(pointInPointyHex(centre, centre, SIDE), true);
  pointyHexVertices(centre, SIDE).forEach((vertex) => {
    const inset = { x: centre.x + (vertex.x - centre.x) * 0.98, y: centre.y + (vertex.y - centre.y) * 0.98 };
    assert.equal(pointInPointyHex(inset, centre, SIDE), true);
  });
  const halfWidth = HEX_SQRT_3 * SIDE / 2;
  [
    { x: centre.x - halfWidth, y: centre.y - SIDE },
    { x: centre.x + halfWidth, y: centre.y - SIDE },
    { x: centre.x - halfWidth, y: centre.y + SIDE },
    { x: centre.x + halfWidth, y: centre.y + SIDE },
  ].forEach((corner) => assert.equal(pointInPointyHex(corner, centre, SIDE), false));
});
