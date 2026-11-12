# Expeditions: existing asset audit

1 October 2026. Scope: every file under `assets/expeditions`, both manifests and static image imports under `expeditions`. Other module card, avatar and UI art registries are noted as existing integration resources; their embedded binaries were not re-audited. This is an inventory and reuse assessment, not visual release approval.

## Conclusion

Ten genuinely different Ninefold Orchard mission families can be designed with the existing art. New mathematical labels, ports, grid lines, outlines and forecasts should be drawn as live text or geometry over the art. No new generated illustration is required to prototype them. Five families should be completed first; the other five justify separate mechanics rather than cosmetic reskins.

The limiting work is puzzle rules, tactical rules, procedural validation, readable instructions and correct rendering. Owning a sprite does not mean its behaviour exists or that it renders correctly.

## Measured inventory

| Package | Runtime image files | Disk size | Referenced by manifest | Statically imported |
|---|---:|---:|---:|---:|
| Ninefold Orchard | 425 | 278.49 MiB | 242 | 264 |
| Little Reckoning | 190 | 6.94 MiB | 189 | 189 |
| Total | 615 | 285.44 MiB | 431 | 453 |

The full asset tree has 738 files and occupies 641.37 MiB, including source sheets, references, concepts, mock-ups and QA outputs. These are a snapshot: active asset work can change counts. The earlier 231-file handover is not a current inventory.

No missing manifest/import targets and no image metadata decode failures were found. There are 184 runtime images outside the manifests and 162 outside the scanned imports. These sets overlap; neither count means that all the files should be imported. Some are superseded alternatives. Static imports are not proof of selection by the board renderer, inclusion in the current HTML or successful player-facing use.

Full per-file evidence:

- `docs/expeditions/asset-audit-2026-10-01/inventory.csv`: paths, sizes, dimensions, transparency and manifest/import references.
- `docs/expeditions/asset-audit-2026-10-01/inventory.json`: the same information plus SHA-256 hashes and sampled corner alpha.
- `docs/expeditions/asset-audit-2026-10-01/summary.json`: missing targets, duplicates, unmanifested files, unimported files and largest images.
- Reproduce with `node scripts/dev/audit-expedition-assets.cjs`. The script reads assets and writes audit outputs only.

## Ninefold Orchard coverage

| Category | Files | What it supports |
|---|---:|---|
| Characters | 150 | All 30 collected heroes, five poses each: front, back, action, carry and exhausted |
| Enemies | 73 | Hookmole, Scruffcrow, Crosswind, Strawling, Maybe-Finch, Hedgejaw, Crowbreaker, Crow Swarm and eight proposed enemy families; includes alternate versions |
| Terrain | 16 | Grass, paths, flagstones, stream, bridges, hedges, roots, tree, start, exit, socket, pond and earth wall |
| Mechanisms | 17 | Operator states, current-turner, wind dial, root relay, branch ports, signal root, ledger and gates |
| Objectives | 39 | Balance states, small scales, feeder/target gates, cider press, baskets, burrow, tower, ring stones, branches, memorial and founding stone |
| Props | 8 | Number-load states, including split, combined, heavy, guarded and delivered |
| Effects | 38 | Selection, danger, guard, impact, rotation, flow, wind, parity, corruption, forecast, containment and shield effects |
| UI | 79 | Buttons, action icons, selection frames, briefing, calculation/check previews, hearts, actions, intents and results |
| Backgrounds | 5 | Gorge PNG/WebP alternatives, cider lane, wind ravine and squad selection |

All 30 heroes have all five pose files on disk. The current registry does not import all of them. The board's character selector must eventually bind actions to the available poses rather than silently using front-idle for every state.

Eight manifest enemy families are explicitly marked proposed: Rootling, Flockling, Ledgerleech, Widdershins, Thorncap, Pebbleback, Muddlenook and Numbermoth. Each has idle, move, telegraph and defeated files. Using them is a proposed content choice, not proof that these enemies are canon or implemented.

Existing scene-specific enemies can cover the first five missions without adopting those proposed families. Hookmole has a rich pose set; Scruffcrow has perch, peck and flee. Crowbreaker and Crow Swarm have idle and telegraph only: removal/fade is a viable proposed defeat treatment, but a dedicated defeated sprite must not be claimed. Hedgejaw's simple SVG art is notably less detailed than surrounding illustrated enemies.

## Little Reckoning and Gifford

Little Reckoning has 30 heroes with five poses each, 12 terrain images, six operator mechanism states, eight load props, eight effects, four Fog-thumb poses and two backgrounds. It provides a substantial existing kit for future Junior variants. It has only one dedicated enemy identity and no dedicated Expedition UI directory. Its current scene registry borrows Orchard UI. Do not silently reskin Orchard enemies as canonical Little Reckoning enemies.

There is no Gifford Expedition production directory or manifest in this asset tree. Existing `wm-gf-card-art.js`, `wm-gf-avatar-art.js` and `wm-gf-ui-art.js` are separate app resources, not evidence of a complete Gifford board kit. The ten missions in the accompanying proposal are Orchard missions; this audit does not promise ten finished missions in every module.

## Render wiring assessment

`expedition-9fo-art.js`, `expedition-9fo-extra-art.js`, `expedition-9fo-scene-art.js` and `expedition-lr-scene-art.js` are the principal registries. `ExpeditionBoard.jsx` selects art by scenario, enemy ID, object kind and a limited set of states.

The renderer contains live selectors for Hookmole, Scruffcrow, Crosswind, Strawling, Maybe-Finch, Hedgejaw and Crowbreaker. Historical reuse maps Overgrowth to Strawling, Nearly to Maybe-Finch and First Root to Hookmole. This makes reuse realistic, but adding a newly named captain to scenario data does not automatically select the correct sprite. Each new packet needs an explicit art identity independent of its display name.

The proposed manifest enemies are not handled by those named enemy selectors. Their existence must not be represented as completed wiring. Files also exist for forecast and network-wide effects whose anchoring is not equivalent to a single-hex object. They need a layer and geometry contract.

## Quality and size issues

1. **Stray sprite fragments.** The inspected contact sheets show detached fragments near the canvas edges of several enemy, tally and terrain assets. Examples include Flockling, Ledgerleech, Rootling, Muddlenook, Numbermoth, the tally arches and timber bridge. They require connected-component/bounds inspection and visual cleaning review before release. Alpha-channel presence alone does not certify clean cut-outs.
2. **Mixed geometry.** Original isometric terrain must not define hit polygons. The corrected pointy-top grass variant is available, but paths, rivers and bridges still need a consistent projection and ground anchor. Pond and earth-wall files are opaque, rectangular surfaces; they must be clipped or used as decoration, not stamped unmasked onto hexes.
3. **Placeholder style.** Hedgejaw, number stones, colour gates and some older wind/cider SVG alternatives are visibly simpler than the illustrated kit. The ten designs can reuse illustrated gates, stones and live labels instead. Prefer the PNG wind dial, whistle tower and Maybe-Finch v2 over older schematic alternatives.
4. **Exact duplicate.** `effects/po-orchard-lockdown-group-outline-v1.png` and `effects/po-rootfire-pulse-v1.png` have identical SHA-256 hashes. They cannot by themselves communicate distinct mechanics. Keep separate logical effect names if useful, but render meaningful live geometry and share the binary.
5. **Oversized runtime candidates.** Orchard UI alone is 93.54 MiB; characters are 39.95 MiB. Many later images are around 1,200–1,500 pixels per sprite and 2–3 MiB each. All scanned runtime imports total 226.60 MiB before potential bundler elimination. The current `WallabyMaths.html` snapshot is 93.44 MiB: it is a separate measurement, not the sum of every candidate. Optimise selected assets at their measured display size, preserve originals and set a bundle/device budget before expanding imports.
6. **Manifest drift.** Later PNG additions, alternate versions and many carry poses are outside the authoritative manifest. Consolidate the selected versions, state coverage, dimensions, visible bounds, ground anchors and overlay anchors. Do not simply append every file.

Contact sheets were generated for all runtime enemies, terrain, mechanisms, objectives, props and backgrounds in both worlds. Seven representative Orchard/Little Reckoning sheets were visually inspected during this audit. Character, effect and UI coverage was checked by metadata and wiring, not a full visual review of every individual file. Resized corner-alpha samples are diagnostic only. Source sheets, mock-ups and concepts were inventoried but are not approved runtime assets.

## Reuse plan and priority

Use a shared Orchard board kit, all existing hero identities, a small selected enemy pool and live puzzle overlays. Keep region silhouettes and gameplay topology varied even when backgrounds repeat. Use artwork as the object skin; puzzle truth must stay in plain data.

Before a mission reaches visual acceptance: select one version per asset, establish bounds/anchors, clean fragments, optimise losslessly where appropriate, verify on white/black/green/cyan and test touch targets on the actual hex projection. Existing master-brief visual gates still apply.

No production art, manifests, renderer, engine, progress or release gate was changed by this audit.
