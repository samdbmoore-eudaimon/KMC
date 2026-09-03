from __future__ import annotations

import argparse
import csv
import itertools
import random
import re
import time
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
CARD_DIR = ROOT / "card_art" / "ninefold_orchard"
FRAME_PATH = CARD_DIR / "9f Frame Narrow Decorated.png"
DATA_PATH = ROOT / "card_data_export.tsv"
FONT_REGULAR = Path(r"C:\Windows\Fonts\georgia.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\georgiab.ttf")

TITLE_CENTRE = (475, 130)
TYPE_CENTRE = (475, 217)
BATTLE_CENTRE = (865, 195)
STAT_CENTRES = [(848, 1027), (848, 1126), (848, 1225), (848, 1318), (848, 1417)]
ART_BOX = (212, 242, 767, 959)

# Card-specific crop nudges are recorded here after contact-sheet review.
CROP_NUDGES: dict[str, tuple[int, int]] = {}


def checkerboard_opening_mask(frame: Image.Image) -> Image.Image:
    arr = np.asarray(frame.convert("RGB"))
    spread = arr.max(axis=2) - arr.min(axis=2)
    light = arr.mean(axis=2)
    candidate = (spread <= 4) & (light >= 205) & (light <= 255)
    candidate[:220, :] = False
    candidate[1010:, :] = False
    candidate[:, :80] = False
    candidate[:, 950:] = False

    start = (500, 500)
    seen = np.zeros(candidate.shape, dtype=np.uint8)
    queue = deque([start])
    seen[start] = 1
    while queue:
        y, x = queue.popleft()
        for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= yy < candidate.shape[0] and 0 <= xx < candidate.shape[1] and candidate[yy, xx] and not seen[yy, xx]:
                seen[yy, xx] = 1
                queue.append((yy, xx))

    mask = Image.fromarray(seen * 255, "L")
    return mask.filter(ImageFilter.MaxFilter(5))


def fit_art(art: Image.Image, key: str) -> Image.Image:
    x0, y0, x1, y1 = ART_BOX
    target_w, target_h = x1 - x0, y1 - y0
    trim = 55 if art.height > art.width * 1.2 else 45
    art = art.crop((trim, trim, art.width - trim, art.height - trim))
    if art.height > art.width * 1.2:
        return art.resize((target_w, target_h), Image.Resampling.LANCZOS)
    scale = max(target_w / art.width, target_h / art.height)
    resized = art.resize((round(art.width * scale), round(art.height * scale)), Image.Resampling.LANCZOS)
    nudge_x, nudge_y = CROP_NUDGES.get(key, (0, 0))
    left = (resized.width - target_w) // 2 + nudge_x
    top = (resized.height - target_h) // 2 + nudge_y
    left = min(max(left, 0), resized.width - target_w)
    top = min(max(top, 0), resized.height - target_h)
    return resized.crop((left, top, left + target_w, top + target_h))


def centred_text(draw: ImageDraw.ImageDraw, centre: tuple[int, int], text: str, font: ImageFont.FreeTypeFont,
                 fill: tuple[int, int, int], stroke_width: int = 0,
                 stroke_fill: tuple[int, int, int] | None = None) -> None:
    box = draw.textbbox((0, 0), text, font=font, stroke_width=stroke_width)
    x = centre[0] - (box[2] - box[0]) / 2 - box[0]
    y = centre[1] - (box[3] - box[1]) / 2 - box[1]
    draw.text((round(x), round(y)), text, font=font, fill=fill,
              stroke_width=stroke_width, stroke_fill=stroke_fill)


def title_font(text: str) -> ImageFont.FreeTypeFont:
    for size in range(68, 31, -1):
        font = ImageFont.truetype(FONT_BOLD, size)
        if font.getlength(text) <= 550:
            return font
    return ImageFont.truetype(FONT_BOLD, 31)


def compose(name: str, card_type: str, battle: int, stats: list[int], art_path: Path, key: str) -> Image.Image:
    frame = Image.open(FRAME_PATH).convert("RGB")
    art = Image.open(art_path).convert("RGB")
    fitted = fit_art(art, key)
    art_layer = frame.copy()
    art_layer.paste(fitted, ART_BOX[:2])
    mask = opening_mask(frame)
    card = Image.composite(art_layer, frame, mask)

    draw = ImageDraw.Draw(card)
    dark = (48, 24, 7)
    cream = (255, 245, 207)
    centred_text(draw, TITLE_CENTRE, name, title_font(name), dark)
    centred_text(draw, TYPE_CENTRE, card_type, ImageFont.truetype(FONT_REGULAR, 37), cream,
                 stroke_width=2, stroke_fill=(74, 54, 17))
    centred_text(draw, BATTLE_CENTRE, str(battle), ImageFont.truetype(FONT_REGULAR, 110), dark)
    stat_font = ImageFont.truetype(FONT_REGULAR, 51)
    for centre, value in zip(STAT_CENTRES, stats, strict=True):
        centred_text(draw, centre, str(value), stat_font, dark)
    return card


_MASK: Image.Image | None = None


def opening_mask(frame: Image.Image) -> Image.Image:
    global _MASK
    if _MASK is None:
        _MASK = checkerboard_opening_mask(frame)
    return _MASK


def visible_name(name: str) -> str:
    return re.sub(r"\s*\(upgraded\)\s*$", "", name, flags=re.I).strip()


def sanitised_name(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9 ]", "", visible_name(name)).strip()


def load_rows() -> list[dict[str, str]]:
    with DATA_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle, delimiter="\t"))
    return [row for row in rows if row["module"] == "Ninefold Orchard" and row["rarity"] != "generic"]


def art_inventory() -> tuple[dict[str, Path], dict[str, Path], dict[str, str]]:
    character_files: dict[str, Path] = {}
    character_names: dict[str, str] = {}
    boss_files: dict[str, Path] = {}
    for path in CARD_DIR.glob("*.png"):
        match = re.match(r"(\d+)_(.+)\.png$", path.name, flags=re.I)
        if not match:
            continue
        number, remainder = match.group(1), match.group(2).lower()
        if remainder.startswith(("common_", "rare_", "epic_", "legendary_")):
            character_files[str(int(number))] = path
            # The name embedded in the filename itself (e.g. "common_Pip" -> "pip") — kept so
            # callers can verify the ordinal position actually matches this file's character,
            # rather than trusting position alone.
            character_names[str(int(number))] = remainder.split("_", 1)[1]
        else:
            boss_files[str(int(number))] = path
    return character_files, boss_files, character_names


def validate_rows(rows: list[dict[str, str]]) -> None:
    if len(rows) != 57:
        raise ValueError(f"Expected 57 Ninefold data rows, found {len(rows)}")
    for row in rows:
        values = [row[field] for field in ("bv", "arith", "geom", "logic", "sci", "speed")]
        if not all(value.isdigit() for value in values):
            raise ValueError(f"Non-numeric stat in {row['id']}")


def render_apple_variants(selected: set[str] | None = None) -> list[Path]:
    existing = (2, 1, 1, 2, 2)
    possibilities = [values for values in itertools.product(range(1, 5), repeat=5)
                     if sum(values) == 8 and values != existing]
    allocations = random.Random(904).sample(possibilities, 9)
    outputs = []
    for suffix, stats in zip("bcdefghij", allocations, strict=True):
        key = f"apple_{suffix}"
        if selected is not None and key not in selected:
            continue
        out = CARD_DIR / f"9f_Apple Picker_{suffix}.png"
        compose("Apple Picker", "No Type", 8, stats, CARD_DIR / "9f_AP_art.png", key).save(out)
        outputs.append(out)
    return outputs


def render_data_cards(selected: set[str] | None = None) -> list[Path]:
    rows = load_rows()
    validate_rows(rows)
    characters, bosses, character_names = art_inventory()
    ordinary = [row for row in rows if row["set"] == "ninefold_orchard"]
    boss_rows = [row for row in rows if row["set"] == "primary_bosses"]
    base_names = []
    for row in ordinary:
        clean = visible_name(row["name"])
        if clean not in base_names:
            base_names.append(clean)
    if len(base_names) != 30 or len(boss_rows) != 10:
        raise ValueError(f"Expected 30 character artworks and 10 bosses; found {len(base_names)} and {len(boss_rows)}")

    # The name-to-art assignment below is still positional (index N -> the Nth numbered file),
    # but it's no longer BLIND positional trust: cross-check each slot against the character
    # name actually embedded in that file's own filename (e.g. "01_common_Pip.png" -> "pip").
    # If PRIMARY_CARDS is ever reordered, or a card inserted, without renumbering the portrait
    # files to match, this now fails loudly here instead of silently baking the wrong portrait
    # onto a card.
    def normalise_for_comparison(value: str) -> str:
        # Portrait filenames drop articles (e.g. "The Ninefold Tree" -> "NinefoldTree"), so
        # strip "the" as a whole word before comparing, not just non-alphanumerics.
        return re.sub(r"[^a-z0-9]", "", re.sub(r"\bthe\b", "", value.lower()))

    for index, name in enumerate(base_names, start=1):
        expected = normalise_for_comparison(name)
        actual = normalise_for_comparison(character_names.get(str(index), ""))
        if expected != actual:
            raise ValueError(
                f"Art/name mismatch at position {index}: card '{name}' expected a portrait "
                f"named like '{index:02d}_<rarity>_{name}.png' but the file there is named "
                f"'...{character_names.get(str(index))}.png' instead. PRIMARY_CARDS order and "
                f"the numbered portrait files in {CARD_DIR} have drifted apart — fix the mismatch "
                f"before rendering, or every card from here on gets the wrong portrait."
            )

    art_for_name = {name: characters[str(index)] for index, name in enumerate(base_names, start=1)}
    paired = {visible_name(row["name"]) for row in ordinary if row["id"].endswith("_upgraded")}
    outputs = []
    for row in ordinary:
        card_name = visible_name(row["name"])
        upgraded = row["id"].endswith("_upgraded")
        suffix = "_b" if upgraded else ("_a" if card_name in paired else "")
        key = row["id"]
        if selected is not None and key not in selected:
            continue
        out = CARD_DIR / f"9f_{sanitised_name(card_name)}{suffix}.png"
        stats = [int(row[field]) for field in ("arith", "geom", "logic", "sci", "speed")]
        compose(card_name, row["type"], int(row["bv"]), stats, art_for_name[card_name], key).save(out)
        outputs.append(out)

    for row in boss_rows:
        number = row["id"].rsplit("_", 1)[-1]
        card_name = visible_name(row["name"])
        key = row["id"]
        if selected is not None and key not in selected:
            continue
        out = CARD_DIR / f"9f_{sanitised_name(card_name)}.png"
        stats = [int(row[field]) for field in ("arith", "geom", "logic", "sci", "speed")]
        compose(card_name, row["type"], int(row["bv"]), stats, bosses[str(int(number))], key).save(out)
        outputs.append(out)
    return outputs


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--calibration", action="store_true")
    parser.add_argument("--ids", help="Comma-separated card IDs, for example apple_b,cobweb,boss_primary_1")
    args = parser.parse_args()
    if args.ids:
        selected = {value.strip() for value in args.ids.split(",") if value.strip()}
    elif args.calibration:
        selected = {"apple_b", "apple_c", "pip", "pip_upgraded", "boss_primary_1"}
    else:
        selected = None
    started = time.perf_counter()
    outputs = render_apple_variants(selected)
    outputs.extend(render_data_cards(selected))
    elapsed = time.perf_counter() - started
    rate = elapsed / len(outputs) if outputs else 0
    print(f"Rendered {len(outputs)} cards in {elapsed:.2f}s ({rate:.2f}s per card)")
    for output in outputs:
        print(output.name)


if __name__ == "__main__":
    main()
