# Expeditions card-collection audit (delegated backlog item 2, 2026-09-16)

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. Compare this audit against the current
> card/combat contract and scenario experience brief before making balance conclusions.

Status: analysis only. No card data was altered to hide a mismatch, per the instruction.

## Scope

This audits the real 90-card collection (30 per module) that `expedition-roster.js` actually
derives Expedition profiles from (`JUNIOR_CARDS`/`PRIMARY_CARDS`/`INTERMEDIATE_CARDS` in the
three `generators/*.js` files — the same cards players open in packs, not a separate
Expeditions-only dataset), and tests `EXPEDITIONS_NINEFOLD_ROUTE.md`'s stated per-map readiness
requirements against that real Ninefold Orchard (Primary) collection specifically, since that is
the only route document this item covers. Little Reckoning and Gifford get the equivalent
audit when backlog items 9 and 10 reach those route documents.

Every figure below comes from `expeditions/card-audit.test.js`, which asserts them directly
against the live `expeditionRoster`/`assessSquadReadiness`/`EXPEDITION_SCENARIOS` — this
report is a readable rendering of that test file's findings, not a separate hand count.

## The audited 90-card table

Stats are printed in `[Arithmetic, Geometry, Logic, Science, Speed]` order. Move, Hearts and
Power are the exact values `expeditionProfile` (`expedition-roster.js`) derives from each
card's five stats — not separately authored, so they can never drift from the engine's own
reading of a card. BV is the flat per-rarity value `assessSquadReadiness` actually uses
(13/21/25/34/45 for common/uncommon/rare/epic/legendary), reproduced here for a readable table;
note this is a step function of rarity alone, not a per-card computed number, so two cards of
the same rarity always contribute identically to average battle value regardless of how their
five stats differ.

### Ninefold Orchard (Primary) — 30 cards

Rarity distribution: 12 common, 5 uncommon, 5 rare, 6 epic, 2 legendary (30 total).

| id | name | rarity | BV | stats [Ari, Geo, Log, Sci, Spd] | discipline | role | trait | Move | Hearts | Power |
|---|---|---|---:|---|---|---|---|---:|---:|---:|
| bramble | Bramble | common | 13 | [2, 1, 2, 7, 1] | Science | Reckoner | Precise | 2 | 3 | 7 |
| bushel | Bushel | common | 13 | [5, 1, 2, 3, 2] | Arithmetic | Guardian | Adaptable | 2 | 2 | 5 |
| dapple | Dapple | common | 13 | [2, 2, 1, 2, 6] | Speed | Reckoner | Precise | 3 | 2 | 6 |
| furrow | Furrow | common | 13 | [1, 4, 2, 1, 5] | Speed | Guardian | Sure-footed | 3 | 2 | 5 |
| halfpenny | Halfpenny | common | 13 | [2, 2, 3, 2, 4] | Speed | Scout | Foresight | 3 | 2 | 4 |
| nine | Nine | common | 13 | [2, 1, 2, 1, 7] | Speed | Scout | Precise | 3 | 2 | 7 |
| pip | Pip | common | 13 | [1, 1, 3, 6, 2] | Science | Mender | Foresight | 2 | 3 | 6 |
| russet | Russet | common | 13 | [2, 6, 2, 2, 1] | Geometry | Mover | Precise | 2 | 3 | 6 |
| sorrel | Sorrel | common | 13 | [2, 2, 2, 5, 2] | Science | Mender | Precise | 2 | 3 | 5 |
| tuppence | Tuppence | common | 13 | [4, 1, 4, 2, 2] | Arithmetic | Guardian | Foresight | 2 | 2 | 4 |
| wicker | Wicker | common | 13 | [1, 6, 2, 2, 2] | Geometry | Mover | Foresight | 2 | 3 | 6 |
| windfall | Windfall | common | 13 | [1, 1, 2, 4, 5] | Speed | Scout | Adaptable | 3 | 2 | 5 |
| beeswax | Beeswax | uncommon | 21 | [2, 2, 4, 6, 7] | Speed | Mender | Adaptable | 3 | 3 | 7 |
| cornix | Cornix | uncommon | 21 | [6, 2, 6, 3, 4] | Arithmetic | Guardian | Foresight | 3 | 2 | 6 |
| kernel | Kernel | uncommon | 21 | [6, 7, 3, 3, 2] | Geometry | Reckoner | Precise | 2 | 3 | 7 |
| millrace | Millrace | uncommon | 21 | [3, 3, 4, 7, 4] | Science | Scout | Foresight | 3 | 3 | 7 |
| thistlewick | Thistlewick | uncommon | 21 | [4, 4, 5, 4, 4] | Logic | Mover | Precise | 3 | 3 | 5 |
| amberly | Amberly | rare | 25 | [4, 4, 7, 6, 4] | Logic | Mender | Adaptable | 3 | 3 | 7 |
| barrow | Barrow | rare | 25 | [7, 4, 8, 3, 3] | Logic | Mover | Precise | 2 | 3 | 8 |
| cobweb | Cobweb | rare | 25 | [5, 8, 4, 4, 4] | Geometry | Scout | Precise | 3 | 3 | 8 |
| driftwood | Driftwood | rare | 25 | [4, 7, 6, 4, 4] | Geometry | Scout | Foresight | 3 | 3 | 7 |
| gable | Gable | rare | 25 | [5, 4, 6, 6, 4] | Logic | Mender | Adaptable | 3 | 3 | 6 |
| cascade | Cascade | epic | 34 | [8, 6, 6, 9, 5] | Science | Guardian | Precise | 3 | 4 | 9 |
| gossamer | Gossamer | epic | 34 | [5, 9, 6, 6, 8] | Geometry | Guardian | Quick | 4 | 4 | 9 |
| harvestmoon | Harvestmoon | epic | 34 | [6, 6, 8, 8, 6] | Logic | Reckoner | Adaptable | 3 | 4 | 8 |
| longshadow | Longshadow | epic | 34 | [6, 6, 7, 8, 7] | Science | Mender | Foresight | 3 | 4 | 8 |
| ninebark | Ninebark | epic | 34 | [8, 7, 9, 6, 4] | Logic | Mover | Precise | 3 | 3 | 9 |
| warden | Warden | epic | 34 | [8, 6, 8, 6, 6] | Arithmetic | Mover | Foresight | 3 | 3 | 8 |
| ninefoldtree | The Ninefold Tree | legendary | 45 | [9, 9, 9, 9, 9] | Arithmetic | Reckoner | Sure-footed | 4 | 4 | 9 |
| tenthscarecrow | The Tenth Scarecrow | legendary | 45 | [10, 8, 10, 8, 9] | Arithmetic | Reckoner | Foresight | 4 | 4 | 10 |

### Little Reckoning (Junior) — 30 cards

Rarity distribution: 12 common, 5 uncommon, 5 rare, 6 epic, 2 legendary (30 total).

| id | name | rarity | BV | stats [Ari, Geo, Log, Sci, Spd] | discipline | role | trait | Move | Hearts | Power |
|---|---|---|---:|---|---|---|---|---:|---:|---:|
| addy | Addy | common | 13 | [3, 1, 2, 1, 6] | Speed | Mender | Precise | 3 | 2 | 6 |
| burrowl | Burrowl | common | 13 | [3, 1, 2, 5, 1] | Science | Scout | Precise | 2 | 2 | 5 |
| countra | Countra | common | 13 | [4, 2, 3, 2, 2] | Arithmetic | Reckoner | Foresight | 2 | 2 | 4 |
| cubble | Cubble | common | 13 | [2, 2, 2, 5, 1] | Science | Guardian | Precise | 2 | 3 | 5 |
| frostcal | Frostcal | common | 13 | [4, 2, 2, 4, 1] | Arithmetic | Mender | Adaptable | 2 | 2 | 4 |
| hunchik | Hunchik | common | 13 | [2, 1, 6, 1, 2] | Logic | Scout | Precise | 2 | 2 | 6 |
| loopy | Loopy | common | 13 | [3, 2, 5, 1, 1] | Logic | Reckoner | Precise | 2 | 2 | 5 |
| pebble | Pebble | common | 13 | [2, 4, 2, 2, 2] | Geometry | Guardian | Precise | 2 | 2 | 4 |
| sparkfin | Sparkfin | common | 13 | [1, 1, 2, 5, 3] | Science | Mover | Quick | 2 | 2 | 5 |
| squarby | Squarby | common | 13 | [1, 3, 1, 1, 6] | Speed | Guardian | Sure-footed | 3 | 2 | 6 |
| tritip | Tri-Tip | common | 13 | [1, 6, 2, 1, 2] | Geometry | Mover | Foresight | 2 | 3 | 6 |
| zoomby | Zoomby | common | 13 | [2, 1, 1, 2, 6] | Speed | Scout | Precise | 3 | 2 | 6 |
| flaskfox | Flaskfox | uncommon | 21 | [3, 3, 4, 8, 3] | Science | Mender | Foresight | 2 | 3 | 8 |
| fractail | Fractail | uncommon | 21 | [4, 4, 3, 3, 7] | Speed | Mover | Precise | 3 | 3 | 7 |
| multimoo | Multimoo | uncommon | 21 | [8, 3, 4, 3, 3] | Arithmetic | Guardian | Foresight | 2 | 2 | 8 |
| owlgorith | Owlgorithm | uncommon | 21 | [4, 3, 8, 4, 2] | Logic | Reckoner | Precise | 2 | 3 | 8 |
| voltbird | Voltbird | uncommon | 21 | [3, 3, 4, 4, 7] | Speed | Scout | Foresight | 3 | 3 | 7 |
| anglorap | Angloraptor | rare | 25 | [5, 8, 4, 4, 4] | Geometry | Mover | Precise | 3 | 3 | 8 |
| cheetawat | Cheetawatt | rare | 25 | [5, 4, 4, 4, 8] | Speed | Scout | Precise | 4 | 3 | 8 |
| hexabug | Hexabug | rare | 25 | [5, 7, 5, 4, 4] | Geometry | Mover | Precise | 3 | 3 | 7 |
| probear | Probear | rare | 25 | [5, 5, 7, 4, 4] | Logic | Mender | Precise | 3 | 3 | 7 |
| seqviper | Seqviper | rare | 25 | [6, 4, 5, 4, 6] | Arithmetic | Scout | Quick | 3 | 3 | 6 |
| geodrake | Geodrake | epic | 34 | [6, 9, 6, 6, 6] | Geometry | Guardian | Precise | 3 | 4 | 9 |
| novabear | Novabear | epic | 34 | [6, 6, 7, 8, 6] | Science | Reckoner | Foresight | 3 | 4 | 8 |
| paradox | Paradox | epic | 34 | [6, 6, 9, 6, 6] | Logic | Reckoner | Precise | 3 | 3 | 9 |
| primearch | Primearch | epic | 34 | [9, 5, 8, 6, 5] | Arithmetic | Mover | Foresight | 3 | 3 | 9 |
| quantakit | Quantakit | epic | 34 | [6, 6, 6, 9, 6] | Science | Mender | Precise | 3 | 4 | 9 |
| sphinxa | Sphinxa | epic | 34 | [6, 7, 8, 6, 6] | Logic | Mender | Sure-footed | 3 | 3 | 8 |
| euclidon | Euclidon | legendary | 45 | [8, 10, 9, 8, 9] | Geometry | Guardian | Foresight | 4 | 4 | 10 |
| infinitus | Infinitus | legendary | 45 | [10, 9, 10, 9, 8] | Arithmetic | Reckoner | Foresight | 4 | 4 | 10 |

### Gifford (Intermediate) — 30 cards

Rarity distribution: 9 common, 5 uncommon, 5 rare, 9 epic, 2 legendary (30 total).

| id | name | rarity | BV | stats [Ari, Geo, Log, Sci, Spd] | discipline | role | trait | Move | Hearts | Power |
|---|---|---|---:|---|---|---|---|---:|---:|---:|
| gf_adavoss | Second Examiner Ada Voss | common | 13 | [4, 2, 3, 2, 1] | Arithmetic | Mender | Foresight | 2 | 2 | 4 |
| gf_colworth | Magistrate Colworth | common | 13 | [3, 2, 4, 2, 1] | Logic | Guardian | Precise | 2 | 2 | 4 |
| gf_higgins | Corporal Higgins | common | 13 | [2, 2, 3, 2, 3] | Logic | Guardian | Quick | 2 | 2 | 3 |
| gf_jory | Jory Fenwick | common | 13 | [3, 2, 3, 2, 2] | Logic | Reckoner | Foresight | 2 | 2 | 3 |
| gf_marta | Marta the Grocer | common | 13 | [3, 4, 2, 2, 1] | Geometry | Reckoner | Precise | 2 | 2 | 4 |
| gf_nettle | Nettle | common | 13 | [2, 3, 2, 3, 2] | Geometry | Mender | Adaptable | 2 | 2 | 3 |
| gf_pip | Pip | common | 13 | [2, 3, 2, 2, 3] | Geometry | Mover | Quick | 2 | 2 | 3 |
| gf_ratchet | Ratchet | common | 13 | [2, 2, 2, 2, 4] | Speed | Scout | Precise | 3 | 2 | 4 |
| gf_tambrindle | Tam Brindle | common | 13 | [2, 3, 2, 2, 4] | Speed | Mover | Sure-footed | 3 | 2 | 4 |
| gf_delphine | Delphine Ashworth | uncommon | 21 | [3, 3, 4, 3, 5] | Speed | Scout | Foresight | 3 | 2 | 5 |
| gf_fenn | Fenn Okonkwo | uncommon | 21 | [4, 4, 3, 3, 4] | Arithmetic | Guardian | Sure-footed | 3 | 3 | 4 |
| gf_growl | Growl | uncommon | 21 | [3, 3, 3, 4, 5] | Speed | Mover | Adaptable | 3 | 3 | 5 |
| gf_maude | Sister Maude | uncommon | 21 | [3, 3, 4, 5, 3] | Science | Mender | Foresight | 2 | 3 | 5 |
| gf_pemberton | Clerk Pemberton | uncommon | 21 | [5, 3, 4, 3, 3] | Arithmetic | Reckoner | Foresight | 2 | 2 | 5 |
| gf_adelina | Lady Adelina Corvain | rare | 25 | [5, 5, 5, 6, 4] | Science | Mender | Precise | 3 | 3 | 6 |
| gf_bramwell | Old Bramwell | rare | 25 | [4, 6, 4, 7, 4] | Science | Mover | Sure-footed | 3 | 3 | 7 |
| gf_kade | Inspector Yusuf Kade | rare | 25 | [5, 6, 5, 5, 4] | Geometry | Mover | Precise | 3 | 3 | 6 |
| gf_tessa | Tessa Brindle | rare | 25 | [5, 5, 5, 5, 5] | Speed | Scout | Sure-footed | 3 | 3 | 5 |
| gf_whistle | Whistle | rare | 25 | [6, 4, 4, 4, 7] | Speed | Scout | Precise | 3 | 3 | 7 |
| gf_ashcombe | Captain Reeve Ashcombe | epic | 34 | [7, 7, 7, 6, 6] | Arithmetic | Guardian | Sure-footed | 3 | 3 | 7 |
| gf_corvain | Corvain | epic | 34 | [7, 6, 8, 6, 6] | Logic | Reckoner | Precise | 3 | 3 | 8 |
| gf_halloway | Mother Halloway | epic | 34 | [7, 7, 6, 7, 6] | Science | Guardian | Sure-footed | 3 | 4 | 7 |
| gf_kell | Grandmaster Osric Kell | epic | 34 | [8, 6, 9, 5, 5] | Logic | Reckoner | Precise | 3 | 3 | 9 |
| gf_marrow | Marrow | epic | 34 | [7, 6, 6, 8, 6] | Science | Mender | Precise | 3 | 4 | 8 |
| gf_prewitt | Chancellor Isolde Prewitt | epic | 34 | [6, 9, 6, 6, 6] | Geometry | Mover | Precise | 3 | 4 | 9 |
| gf_rooke | Rooke | epic | 34 | [6, 8, 7, 6, 6] | Geometry | Scout | Foresight | 3 | 4 | 8 |
| gf_thorncastle | Professor Linnea Thorncastle | epic | 34 | [7, 6, 6, 8, 6] | Science | Mender | Precise | 3 | 4 | 8 |
| gf_vane | Silas Vane | epic | 34 | [7, 6, 7, 6, 7] | Logic | Scout | Foresight | 3 | 3 | 7 |
| gf_aldous | Aldous Wrought | legendary | 45 | [9, 9, 9, 9, 8] | Arithmetic | Reckoner | Sure-footed | 4 | 4 | 9 |
| gf_theengine | The Differential Engine | legendary | 45 | [9, 9, 9, 9, 9] | Arithmetic | Guardian | Sure-footed | 4 | 4 | 9 |


**Distribution asymmetry, not a bug:** Gifford (Intermediate) has 9 Common and 9 Epic cards
against Ninefold Orchard and Little Reckoning's 12 Common and 6 Epic (all three share 5
Uncommon, 5 Rare, 2 Legendary). This tracks Gifford's larger squad size (4 fielded heroes
against the other two modules' 3) and its harder intended readiness bands — a deliberately
richer top end, not an inconsistency between modules.

## Ninefold Orchard route-requirement feasibility

Exhaustive check over all C(30,3) = 4,060 possible three-card Primary squads (every squad is
tested against `assessSquadReadiness`, exactly as the game itself would):

| Lvl | Map | Stated requirement | Squads meeting it | All-Common squads meeting it |
|---:|---|---|---|---:|
| 1 | The Unequal Crossing | avgBV≥12 | 4060/4060 (100.0%) | 220/220 |
| 2 | The Counting Orchard | avgBV≥12 | 4060/4060 (100.0%) | 220/220 |
| 3 | Nine Across the Bridge | avgBV≥16; 2+ uncommon-or-better | 2652/4060 (65.3%) | 0/220 |
| 4 | The Widdershins Path | avgBV≥16; 2+ uncommon-or-better | 2652/4060 (65.3%) | 0/220 |
| 5 | The Maybe-Flock Roost | avgBV≥22; 2+ rare-or-better | 1492/4060 (36.7%) | 0/220 |
| 6 | Ten Honest Bundles | avgBV≥22; 2+ rare-or-better | 1492/4060 (36.7%) | 0/220 |
| 7 | Count the Murder | avgBV≥28; 1+ epic-or-better; no common | 486/4060 (12.0%) | 0/220 |
| 8 | The Hollow Bough | avgBV≥28; 1+ epic-or-better; no common | 486/4060 (12.0%) | 0/220 |
| 9 | Every Basket One Short | avgBV≥32; all cards epic-or-better | 56/4060 (1.4%) | 0/220 |
| 10 | The First Whistle | avgBV≥34; all cards epic-or-better | 56/4060 (1.4%) | 0/220 |

### Finding 1 — flagged: Levels 1–2's recommendation is met by literally every squad, not "almost every"

The lowest battle value anywhere in the 30-card Primary collection is 13 (any Common card).
Three Commons therefore always average at least 13, which already clears both levels' stated
"average BV 12" bar. The exhaustive check above confirms 4,060/4,060 (100%) of all possible
squads — including all 220 all-Common squads — meet Level 1 and Level 2's recommendation. The
readiness meter cannot show a shortfall on these two levels with the current card numbers: it
is not merely generous, it is unfalsifiable. This matches the backlog's named failure mode
("almost every Common squad already meets") in its strongest form.

This is a numbers-only finding, not a request to change anything: Map 1 and 2's own design
notes ("this is deliberately forgiving", "no specialist requirement") suggest the readiness
floor was never meant to bind here. Recorded so the fact is on record rather than assumed.

### Finding 2 — clean bill of health: no level is actually impossible

Every level from 3 to 10 has at least one real three-card combination that fully satisfies its
stated recommendation (the smallest count, 56 squads for Levels 9–10, is exactly
C(8,3) — the number of ways to choose 3 of the collection's 6 Epic + 2 Legendary cards, with no
further restriction). No stated per-map recommendation in the route document asks for something
the real card collection cannot provide.

### Finding 3 — a real cliff, not a slope, at the Uncommon/Rare rarity floors

0 of the 220 all-Common squads meet any Level 3+ recommendation (all require at least one
Uncommon-or-better, rising to Rare-or-better, Epic-or-better and finally all-Epic-or-better by
Level 9–10). A player relying purely on Commons hits a hard wall at Level 3, not a gradual
softening — worth knowing for any future onboarding or difficulty-curve copy, though it matches
the route document's own framing ("Uncommon-heavy", "Rare-heavy", etc. per level).

### Finding 4 — the average-BV and rarity-floor conditions are not always redundant

For several levels, meeting the stated rarity floor does not automatically clear the stated
average-BV bar. For example, two Rare cards (25 BV each) plus one Common (13 BV) meets Level
5/6's "at least two Rare-or-better" floor but averages only 21, short of the stated "average BV
22" — a squad can satisfy the letter of the rarity recommendation while still falling short
overall. This is not a design flaw (both conditions are independently satisfiable, per Finding
2), just a reason the two readiness conditions should both keep being checked and displayed
together rather than treated as one implying the other.

## Suggested (non-enforced) capability stats

The route document also names suggested single-stat thresholds per level (e.g. "one Speed 4+
or Geometry 5+ card" for Map 3, "Arithmetic 7+ and Logic 7+" for Map 9). These are not currently
wired into `EXPEDITION_READINESS_BY_LEVEL`'s `capabilityRequirements` (every level's array is
empty today), so they are purely descriptive text in the route document and never checked or
displayed by the readiness meter. Spot-checking the real collection against every suggested
threshold through Map 10: none is unreachable at its own map's expected tier. The early,
low-bar suggestions (Map 3's Speed 4+ or Geometry 5+) are already available on several Common
cards (e.g. `dapple` Speed 6, `russet` Geometry 6), well below the tier those maps actually
recommend. The hardest suggestion, Map 10's "Geometry 8+, Arithmetic 7+, Science-or-Logic 7+",
is cleared by a single card in each case (`gossamer` and `ninefoldtree` both reach Geometry 9;
`tenthscarecrow` and `ninefoldtree` both reach Arithmetic 9–10), and both Legendaries
(`ninefoldtree` [9,9,9,9,9] and `tenthscarecrow` [10,8,10,8,9]) individually clear all three of
Map 10's suggested thresholds at once. None of the suggested stats is currently unreachable if
they were ever wired in as real `capabilityRequirements`.
