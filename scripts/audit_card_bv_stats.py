from __future__ import annotations

import csv
import itertools
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "card_data_export.tsv"
STAT_FIELDS = ("arith", "geom", "logic", "sci", "speed")
TYPE_INDEX = {
    "Arithmetic": 0,
    "Geometry": 1,
    "Logic": 2,
    "Science": 3,
    "Speed": 4,
}
RARITY_RANGES = {
    "generic": (8, 8),
    "common": (12, 15),
    "common_upgraded": (15, 18),
    "uncommon": (18, 21),
    "uncommon_upgraded": (21, 24),
    "rare": (25, 28),
    "epic": (33, 36),
    "epic_upgraded": (36, 39),
    "legendary": (44, 46),
    "boss_L1": (12, 15),
    "boss_L2": (12, 15),
    "boss_L3": (18, 21),
    "boss_L4": (18, 21),
    "boss_L5": (25, 28),
    "boss_L6": (25, 28),
    "boss_L7": (33, 36),
    "boss_L8": (33, 36),
    "boss_L9": (44, 46),
    "boss_L10": (44, 46),
}


def allocations(total: int):
    for first in range(1, total - 3):
        for second in range(1, total - first - 2):
            for third in range(1, total - first - second - 1):
                for fourth in range(1, total - first - second - third):
                    fifth = total - first - second - third - fourth
                    if fifth >= 1:
                        yield (first, second, third, fourth, fifth)


def rebalance(old: tuple[int, ...], total: int, card_type: str) -> tuple[int, ...]:
    type_index = TYPE_INDEX.get(card_type)
    best = None
    best_score = None
    for candidate in allocations(total):
        if type_index is not None:
            typed = candidate[type_index]
            if typed != max(candidate):
                continue
            ties = sum(value == typed for value in candidate) - 1
        else:
            ties = 0
        absolute = sum(abs(new - prior) for new, prior in zip(candidate, old, strict=True))
        squared = sum((new - prior) ** 2 for new, prior in zip(candidate, old, strict=True))
        maximum = max(candidate)
        score = (absolute, ties, squared, maximum, candidate)
        if best_score is None or score < best_score:
            best_score = score
            best = candidate
    if best is None:
        raise ValueError(f"No valid allocation for total {total}, type {card_type}")
    return best


def main():
    with DATA_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        fieldnames = reader.fieldnames
        rows = list(reader)
    if fieldnames is None:
        raise ValueError("Missing TSV header")

    changes = []
    for row in rows:
        battle = int(row["bv"])
        low, high = RARITY_RANGES[row["rarity"]]
        if not low <= battle <= high:
            battle = (low + high) // 2
            row["bv"] = str(battle)
        old = tuple(int(row[field]) for field in STAT_FIELDS)
        if sum(old) != battle:
            new = rebalance(old, battle, row["type"])
            for field, value in zip(STAT_FIELDS, new, strict=True):
                row[field] = str(value)
            changes.append((row["id"], old, new, battle, row["type"]))

    with DATA_PATH.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, delimiter="\t", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    print(f"Updated {len(changes)} of {len(rows)} cards")
    for card_id, old, new, battle, card_type in changes:
        print(f"{card_id}: {old} -> {new}; BV {battle}; {card_type}")


if __name__ == "__main__":
    main()
