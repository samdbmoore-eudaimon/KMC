#!/usr/bin/env bash
# Claude: runs the bank-yield scan over every family/tier (seeds from $1 to $2, default 1-16). Output JSON under docs/expeditions/v2/certification/scan/.
cd "$(dirname "$0")/../.."
from=${1:-1}; to=${2:-16}
mkdir -p docs/expeditions/v2/certification/scan
for family in unequal-crossing maybe-flock hollow-bough turning-ravine four-locks; do
  for tier in 1 2 3 4 5; do
    node scripts/dev/orchard-v2-bank-scan.mjs --family $family --tier $tier --seeds $from-$to --max-states 6000 --out docs/expeditions/v2/certification/scan/$family-t$tier-s$from-$to.json 2>/dev/null | tail -1
  done
done
