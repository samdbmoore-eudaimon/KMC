from __future__ import annotations

import csv
import itertools
import json
import random
import re
import time
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "Joey Assets" / "LR"
ART_DIR = ROOT / "card_art" / "little_reckoning_cards"
FRAME_PATH = ASSET_DIR / "LR Card Frame Transparent.png"
LAYOUT_PATH = ASSET_DIR / "lr_card_layout.json"
DATA_PATH = ROOT / "card_data_export.tsv"
FONT_REGULAR = Path(r"C:\Windows\Fonts\georgia.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\georgiab.ttf")
FOCAL_Y = {"boss_junior_5": 18}
_OPENING_MASK: Image.Image | None = None


def centred_text(draw: ImageDraw.ImageDraw, centre: tuple[int, int], text: str,
                 font: ImageFont.FreeTypeFont, fill: str) -> None:
    box = draw.textbbox((0, 0), text, font=font)
    x = centre[0] - (box[2] - box[0]) / 2 - box[0]
    y = centre[1] - (box[3] - box[1]) / 2 - box[1]
    draw.text((round(x), round(y)), text, font=font, fill=fill)


def opening_mask(frame: Image.Image) -> Image.Image:
    global _OPENING_MASK
    if _OPENING_MASK is not None:
        return _OPENING_MASK
    rgb = np.asarray(frame.convert("RGB"))
    maximum = rgb.max(axis=2)
    minimum = rgb.min(axis=2)
    light = rgb.mean(axis=2)
    candidate = (maximum - minimum <= 10) & (light >= 25) & (light <= 255)
    seen = np.zeros(candidate.shape, dtype=np.uint8)
    queue = deque([(500, 500)])
    seen[500, 500] = 1
    while queue:
        y, x = queue.popleft()
        for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= yy < candidate.shape[0] and 0 <= xx < candidate.shape[1] and candidate[yy, xx] and not seen[yy, xx]:
                seen[yy, xx] = 1
                queue.append((yy, xx))
    _OPENING_MASK = Image.fromarray(seen * 255, "L").filter(ImageFilter.MaxFilter(7))
    return _OPENING_MASK


def fit_art(path: Path, box: tuple[int, int, int, int], key: str) -> Image.Image:
    art = Image.open(path).convert("RGB")
    width, height = box[2] - box[0], box[3] - box[1]
    scale = max(width / art.width, height / art.height)
    resized = art.resize((round(art.width * scale), round(art.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - width) // 2
    top = (resized.height - height) // 2 + FOCAL_Y.get(key, 0)
    left = min(max(left, 0), resized.width - width)
    top = min(max(top, 0), resized.height - height)
    return resized.crop((left, top, left + width, top + height))


def adaptive_font(text: str, maximum: int, start: int, minimum: int = 34) -> ImageFont.FreeTypeFont:
    for size in range(start, minimum - 1, -1):
        font = ImageFont.truetype(FONT_BOLD, size)
        if font.getlength(text) <= maximum:
            return font
    return ImageFont.truetype(FONT_BOLD, minimum)


def compose(name: str, card_type: str, battle: int, stats: list[int], art_path: Path, key: str) -> Image.Image:
    layout = json.loads(LAYOUT_PATH.read_text(encoding="utf-8"))
    frame = Image.open(FRAME_PATH).convert("RGBA")
    box = tuple(layout["artwork"]["opening_bbox"])
    mask = opening_mask(frame)
    frame_alpha = frame.getchannel("A")
    frame_alpha = Image.composite(Image.new("L", frame.size, 0), frame_alpha, mask)
    frame.putalpha(frame_alpha)

    card = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    card.paste(fit_art(art_path, box, key), box[:2])
    card.alpha_composite(frame)

    draw = ImageDraw.Draw(card)
    centred_text(draw, tuple(layout["name"]["centre"]), name,
                 adaptive_font(name, layout["name"]["max_width"], 68), layout["name"]["colour"])
    centred_text(draw, tuple(layout["type"]["centre"]), card_type,
                 ImageFont.truetype(FONT_REGULAR, 37), layout["type"]["colour"])
    centred_text(draw, tuple(layout["battle_value"]["centre"]), str(battle),
                 ImageFont.truetype(FONT_REGULAR, 108), layout["battle_value"]["colour"])
    stat_font = ImageFont.truetype(FONT_REGULAR, 51)
    for centre, value in zip(layout["stat_values"]["centres"], stats, strict=True):
        centred_text(draw, tuple(centre), str(value), stat_font, layout["stat_values"]["colour"])
    return card


def data_row(row_id: str) -> dict[str, str]:
    with DATA_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = csv.DictReader(handle, delimiter="\t")
        return next(row for row in rows if row["id"] == row_id and row["module"] == "Little Reckoning")


def row_stats(row: dict[str, str]) -> list[int]:
    return [int(row[field]) for field in ("arith", "geom", "logic", "sci", "speed")]


def visible_name(name: str) -> str:
    return re.sub(r"\s*\(upgraded\)\s*$", "", name, flags=re.I).strip()


def filename_name(name: str) -> str:
    clean = re.sub(r"[^A-Za-z0-9 ]", "", visible_name(name)).strip()
    return re.sub(r"\s+", "_", clean)


def all_rows() -> list[dict[str, str]]:
    with DATA_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        return [row for row in csv.DictReader(handle, delimiter="\t")
                if row["module"] == "Little Reckoning" and row["rarity"] != "generic"]


def art_path_for(row: dict[str, str]) -> Path:
    if row["set"] == "little_reckoning":
        stem = row["id"].removesuffix("_upgraded")
    else:
        stem = filename_name(row["name"]).lower()
    path = ART_DIR / f"{stem}.jpg"
    if not path.exists():
        raise FileNotFoundError(f"Missing artwork for {row['id']}: {path}")
    return path


def main() -> None:
    started = time.perf_counter()
    outputs: list[Path] = []
    generic_a = (2, 1, 3, 1, 1)
    possibilities = [values for values in itertools.product(range(1, 5), repeat=5)
                     if sum(values) == 8 and values != generic_a]
    allocations = [generic_a, *random.Random(417).sample(possibilities, 9)]
    generic_art = ART_DIR / "LIttle Reckoner.png"
    for suffix, stats in zip("abcdefghij", allocations, strict=True):
        output = ART_DIR / f"LR_Little_Reckoner_{suffix}.png"
        compose("Little Reckoner", "No Type", 8, list(stats), generic_art,
                f"little_reckoner_{suffix}").save(output)
        outputs.append(output)

    rows = all_rows()
    ordinary = [row for row in rows if row["set"] == "little_reckoning"]
    bosses = [row for row in rows if row["set"] == "junior_bosses"]
    if len(ordinary) != 47 or len(bosses) != 10:
        raise ValueError(f"Expected 47 ordinary rows and 10 bosses, found {len(ordinary)} and {len(bosses)}")
    paired = {visible_name(row["name"]) for row in ordinary if row["id"].endswith("_upgraded")}
    for row in ordinary:
        name = visible_name(row["name"])
        upgraded = row["id"].endswith("_upgraded")
        suffix = "_b" if upgraded else ("_a" if name in paired else "")
        output = ART_DIR / f"LR_{filename_name(name)}{suffix}.png"
        compose(name, row["type"], int(row["bv"]), row_stats(row), art_path_for(row), row["id"]).save(output)
        outputs.append(output)

    for row in bosses:
        name = visible_name(row["name"])
        output = ART_DIR / f"LR_{filename_name(name)}.png"
        compose(name, row["type"], int(row["bv"]), row_stats(row), art_path_for(row), row["id"]).save(output)
        outputs.append(output)

    elapsed = time.perf_counter() - started
    print(f"Rendered {len(outputs)} cards in {elapsed:.2f}s ({elapsed / len(outputs):.2f}s per card)")
    for output in outputs:
        print(output)


if __name__ == "__main__":
    main()
