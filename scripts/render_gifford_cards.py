from __future__ import annotations

import csv
import re
import time
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ART_DIR = ROOT / "card_art" / "gifford_cards"
ASSET_DIR = ROOT / "Joey Assets" / "Gifford"
FRAME_PATH = ASSET_DIR / "GF Card Frame Narrow Decorated Transparent.png"
DATA_PATH = ROOT / "card_data_export.tsv"
FONT_REGULAR = Path(r"C:\Windows\Fonts\georgia.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\georgiab.ttf")

ART_BOX = (267, 360, 715, 976)
NAME_CENTRE = (421, 181)
TYPE_CENTRE = (456, 307)
BATTLE_CENTRE = (825, 237)
STAT_CENTRES = [(792, 1034), (792, 1131), (792, 1228), (792, 1319), (792, 1413)]
STAT_NAMES = ("Arithmetic", "Geometry", "Logic", "Science", "Speed")
STAT_LABEL_Y_OFFSETS = (4, 0, 0, -5, -6)
TEXT_DARK = (54, 25, 9, 255)


def centred_text(draw, centre, text, font, fill):
    box = draw.textbbox((0, 0), text, font=font)
    x = centre[0] - (box[2] - box[0]) / 2 - box[0]
    y = centre[1] - (box[3] - box[1]) / 2 - box[1]
    draw.text((round(x), round(y)), text, font=font, fill=fill)


def adaptive_font(text, maximum, start, minimum=26):
    for size in range(start, minimum - 1, -1):
        font = ImageFont.truetype(FONT_BOLD, size)
        if font.getlength(text) <= maximum:
            return font
    return ImageFont.truetype(FONT_BOLD, minimum)


def fitted_art(path):
    art = Image.open(path).convert("RGB")
    width = ART_BOX[2] - ART_BOX[0]
    height = ART_BOX[3] - ART_BOX[1]
    scale = max(width / art.width, height / art.height)
    resized = art.resize((round(art.width * scale), round(art.height * scale)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - width) // 2)
    top = max(0, (resized.height - height) // 2)
    return resized.crop((left, top, left + width, top + height))


def opened_frame():
    frame = Image.open(FRAME_PATH).convert("RGBA")
    opening = Image.new("L", frame.size, 0)
    draw = ImageDraw.Draw(opening)
    draw.rounded_rectangle(ART_BOX, radius=43, fill=255)
    opening = opening.filter(ImageFilter.GaussianBlur(0.8))
    alpha = frame.getchannel("A")
    alpha = Image.composite(Image.new("L", frame.size, 0), alpha, opening)
    frame.putalpha(alpha)
    return frame


def compose(name, card_type, battle, stats, art_path):
    frame = opened_frame()
    card = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    card.paste(fitted_art(art_path), ART_BOX[:2])
    card.alpha_composite(frame)
    draw = ImageDraw.Draw(card)
    centred_text(draw, NAME_CENTRE, name, adaptive_font(name, 500, 68), TEXT_DARK)
    centred_text(draw, TYPE_CENTRE, card_type, ImageFont.truetype(FONT_REGULAR, 37), TEXT_DARK)
    centred_text(draw, BATTLE_CENTRE, str(battle), ImageFont.truetype(FONT_REGULAR, 108), TEXT_DARK)
    stat_font = ImageFont.truetype(FONT_REGULAR, 51)
    label_font = ImageFont.truetype(FONT_BOLD, 43)
    for centre, label, y_offset, value in zip(
        STAT_CENTRES, STAT_NAMES, STAT_LABEL_Y_OFFSETS, stats, strict=True
    ):
        label_box = draw.textbbox((0, 0), label, font=label_font)
        label_y = centre[1] + y_offset - (label_box[3] - label_box[1]) / 2 - label_box[1]
        draw.text((380, round(label_y)), label, font=label_font, fill=TEXT_DARK)
        centred_text(draw, centre, str(value), stat_font, TEXT_DARK)
    return card


def rows_by_id():
    with DATA_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        return {row["id"]: row for row in csv.DictReader(handle, delimiter="\t")}


def visible_name(name):
    return re.sub(r"\s*\(upgraded\)\s*$", "", name, flags=re.I).strip()


def filename_name(name):
    clean = re.sub(r"[^A-Za-z0-9 ]", "", visible_name(name)).strip()
    return re.sub(r"\s+", "_", clean)


ART_BY_NAME = {
    "Aldous Wrought": "Aldous.png",
    "The Differential Engine": "TheEngine.png",
    "Chancellor Isolde Prewitt": "Prewitt.png",
    "Silas Vane": "Vane.png",
    "Captain Reeve Ashcombe": "Ashcombe.png",
    "Professor Linnea Thorncastle": "Thorncastle.png",
    "Mother Halloway": "Halloway.png",
    "Grandmaster Osric Kell": "Kell.png",
    "Tessa Brindle": "Tessa.png",
    "Inspector Yusuf Kade": "Kade.png",
    "Old Bramwell": "Bramwell.png",
    "Lady Adelina Corvain": "Adelina.png",
    "Whistle": "Whistle.png",
    "Fenn Okonkwo": "Fenn.png",
    "Delphine Ashworth": "Delphine.png",
    "Growl": "Growl.png",
    "Clerk Pemberton": "Pemberton.png",
    "Sister Maude": "Maude.png",
    "Rooke": "Rooke.png",
    "Corvain": "Corvain.png",
    "Marrow": "Marrow.png",
    "Tam Brindle": "Tam Brindle.png",
    "Nettle": "Nettle.png",
    "Corporal Higgins": "Higgins.png",
    "Marta the Grocer": "Marta.png",
    "Jory Fenwick": "Jory.png",
    "Ratchet": "Ratchet.png",
    "Magistrate Colworth": "Colworth.png",
    "Pip": "Pip.png",
    "Second Examiner Ada Voss": "Ada Voss.png",
}

BOSS_ART = {
    "boss_intermediate_1": "Boss1.png",
    "boss_intermediate_2": "Boss2.png",
    "boss_intermediate_3": "Boss3.png",
    "boss_intermediate_4": "Boss4.png",
    "boss_intermediate_5": "Boss5.png",
    "boss_intermediate_6": "Boss6.png",
    "boss_intermediate_7": "Boss7.png",
    "boss_intermediate_8": "Boss8.png",
    "boss_intermediate_9": "Boss 9 Chacellors Ledger.png",
    "boss_intermediate_10": "Boss10TheEnginesAnswer.png",
}


def main():
    started = time.perf_counter()
    rows = rows_by_id()
    gifford_rows = [row for row in rows.values() if row["module"] == "Gifford"]
    if len(gifford_rows) != 57:
        raise ValueError(f"Expected 57 collectible Gifford rows, found {len(gifford_rows)}")

    ordinary = [row for row in gifford_rows if row["set"] == "gifford" and row["rarity"] != "generic"]
    bosses = [row for row in gifford_rows if row["set"] == "intermediate_bosses"]
    paired = {visible_name(row["name"]) for row in ordinary if row["id"].endswith("_upgraded")}
    outputs = []

    for row in ordinary:
        name = visible_name(row["name"])
        upgraded = row["id"].endswith("_upgraded")
        suffix = "_b" if upgraded else ("_a" if name in paired else "")
        output = ART_DIR / f"GF_{filename_name(name)}{suffix}.png"
        art_path = ART_DIR / ART_BY_NAME[name]
        stats = [int(row[key]) for key in ("arith", "geom", "logic", "sci", "speed")]
        compose(name, row["type"], int(row["bv"]), stats, art_path).save(output, "PNG", optimize=True)
        outputs.append(output)

    for row in bosses:
        name = visible_name(row["name"])
        output = ART_DIR / f"GF_{filename_name(name)}.png"
        stats = [int(row[key]) for key in ("arith", "geom", "logic", "sci", "speed")]
        compose(name, row["type"], int(row["bv"]), stats, ART_DIR / BOSS_ART[row["id"]]).save(
            output, "PNG", optimize=True
        )
        outputs.append(output)

    elapsed = time.perf_counter() - started
    print(f"Rendered {len(outputs)} cards in {elapsed:.2f}s ({elapsed / len(outputs):.2f}s per card)")
    for output in outputs:
        print(output.name)


if __name__ == "__main__":
    main()
