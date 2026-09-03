from pathlib import Path

from PIL import Image


SOURCE = Path(r"C:\Users\samdb\.codex\generated_images\01a035a2-1fc9-7fd3-b36f-d6f2864098af\exec-c867a115-ab57-47ee-b6d3-e0dc70a6d3de.png")
OUTPUT = Path(r"C:\Users\samdb\UKMT App\Joey Assets\Gifford\GF Card Frame Narrow Decorated Transparent.png")


def main():
    image = Image.open(SOURCE).convert("RGBA")
    pixels = image.load()

    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, _ = pixels[x, y]
            spread = max(red, green, blue) - min(red, green, blue)

            if min(red, green, blue) >= 232 and spread <= 5:
                pixels[x, y] = (red, green, blue, 0)
            elif min(red, green, blue) >= 222 and spread <= 4:
                alpha = round(255 * (232 - min(red, green, blue)) / 10)
                pixels[x, y] = (red, green, blue, max(0, min(255, alpha)))

    image.save(OUTPUT, "PNG", optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
