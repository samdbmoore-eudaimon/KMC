from collections import deque
from pathlib import Path
import sys

from PIL import Image, ImageFilter, ImageOps


def largest_component(mask):
    width, height = mask.size
    data = mask.load()
    seen = bytearray(width * height)
    largest = []
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if seen[index] or not data[x, y]:
                continue
            component = []
            queue = deque([(x, y)])
            seen[index] = 1
            while queue:
                cx, cy = queue.popleft()
                component.append((cx, cy))
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        ni = ny * width + nx
                        if not seen[ni] and data[nx, ny]:
                            seen[ni] = 1
                            queue.append((nx, ny))
            if len(component) > len(largest):
                largest = component
    result = Image.new("L", mask.size)
    output = result.load()
    for x, y in largest:
        output[x, y] = 255
    return result


def fill_holes(mask):
    inverse = ImageOps.invert(mask)
    width, height = mask.size
    data = inverse.load()
    exterior = Image.new("L", mask.size)
    out = exterior.load()
    queue = deque()
    for x in range(width):
        queue.extend(((x, 0), (x, height - 1)))
    for y in range(height):
        queue.extend(((0, y), (width - 1, y)))
    while queue:
        x, y = queue.popleft()
        if out[x, y] or not data[x, y]:
            continue
        out[x, y] = 255
        if x:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))
    return ImageOps.invert(exterior)


def main(source, destination):
    image = Image.open(source).convert("RGBA")
    luminance = ImageOps.grayscale(image)
    seed = luminance.point(lambda value: 255 if value >= 118 else 0)
    subject = largest_component(seed).filter(ImageFilter.MaxFilter(25))
    subject = fill_holes(subject).filter(ImageFilter.GaussianBlur(0.8))
    image.putalpha(subject)
    Path(destination).parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, optimize=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
