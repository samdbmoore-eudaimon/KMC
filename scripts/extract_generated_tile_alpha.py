from collections import deque
from pathlib import Path
import sys

from PIL import Image, ImageFilter


def main(source, destination):
    image = Image.open(source).convert("RGBA")
    width, height = image.size
    pixels = image.load()
    background = bytearray(width * height)
    queue = deque()

    def likely_checkerboard(x, y):
        red, green, blue, _ = pixels[x, y]
        checker = min(red, green, blue) >= 185 and max(red, green, blue) - min(red, green, blue) <= 7
        black = max(red, green, blue) <= 18
        return checker or black

    for x in range(width):
        for y in (0, height - 1):
            if likely_checkerboard(x, y):
                queue.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            if likely_checkerboard(x, y):
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if background[index] or not likely_checkerboard(x, y):
            continue
        background[index] = 255
        if x:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    if sum(background) < width * height * 12:
        background = bytearray(width * height)
        queue = deque((x, 0) for x in range(width))
        queue.extend((x, height - 1) for x in range(width))
        queue.extend((0, y) for y in range(height))
        queue.extend((width - 1, y) for y in range(height))
        while queue:
            x, y = queue.popleft()
            index = y * width + x
            if background[index]:
                continue
            background[index] = 255
            red, green, blue, _ = pixels[x, y]
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if not (0 <= nx < width and 0 <= ny < height):
                    continue
                neighbour_index = ny * width + nx
                if background[neighbour_index]:
                    continue
                nr, ng, nb, _ = pixels[nx, ny]
                if max(abs(red - nr), abs(green - ng), abs(blue - nb)) <= 12:
                    queue.append((nx, ny))

    exterior = Image.frombytes("L", image.size, bytes(background)).filter(ImageFilter.MaxFilter(5))
    softened = exterior.filter(ImageFilter.GaussianBlur(0.7))
    alpha = Image.eval(softened, lambda value: 255 - value)
    image.putalpha(alpha)
    Path(destination).parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, optimize=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
