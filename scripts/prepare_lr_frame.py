from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Joey Assets" / "LR" / "LR Card Frame.png"
OUTPUT = ROOT / "Joey Assets" / "LR" / "LR Card Frame Transparent.png"


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    rgb = np.asarray(image)
    maximum = rgb.max(axis=2)
    minimum = rgb.min(axis=2)
    candidate = (maximum <= 64) & ((maximum - minimum) <= 28)
    height, width = candidate.shape
    exterior = np.zeros((height, width), dtype=np.uint8)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        for y in (0, height - 1):
            if candidate[y, x] and not exterior[y, x]:
                exterior[y, x] = 1
                queue.append((y, x))
    for y in range(height):
        for x in (0, width - 1):
            if candidate[y, x] and not exterior[y, x]:
                exterior[y, x] = 1
                queue.append((y, x))

    while queue:
        y, x = queue.popleft()
        for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= yy < height and 0 <= xx < width and candidate[yy, xx] and not exterior[yy, xx]:
                exterior[yy, xx] = 1
                queue.append((yy, xx))

    alpha = np.full((height, width), 255, dtype=np.uint8)
    edge_alpha = np.clip((maximum.astype(np.float32) - 3) * (255 / 45), 0, 255).astype(np.uint8)
    alpha[exterior.astype(bool)] = edge_alpha[exterior.astype(bool)]
    alpha[(exterior.astype(bool)) & (maximum <= 3)] = 0

    rgba = np.dstack((rgb, alpha))
    Image.fromarray(rgba, "RGBA").save(OUTPUT)
    print(OUTPUT)


if __name__ == "__main__":
    main()
