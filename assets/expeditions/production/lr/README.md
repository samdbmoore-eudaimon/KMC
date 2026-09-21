# Little Reckoning expedition art: complete character roster and first world slice

This is an art candidate pack for The Smudged Stones, built from the existing Ninefold Orchard expedition asset contract. It is not wired into the board yet. The manifest lists the runtime files and uses the brighter `lr-smudged-stones-v2.webp` background.

The manifest currently contains 189 runtime assets totalling 6.68 MiB before application bundling.

## Included

- All 30 collectible card characters. Each has front idle, rear idle, action, exhausted and carrying states: 150 transparent field sprites in total.
- Twelve raised hex terrain tiles, six blank operator-wheel states and four Fog-thumb enemy states.
- Eight blank portable load states and eight tactical effects, including hex selection, danger and guard.
- A bright, calm-centred Little Reckoning environment plate.
- Source sheets and extracted card portraits in `source-sheets/` and `references/`.
- Roster review sheets in `qa/lr-idleFront-contact-v1.png` and `qa/lr-carry-contact-v1.png`.

The three loan characters for `lr_smudged_stones` are Addy, Zoomby and Hunchik. Their five states are all present. Carrying props have blank faces so live puzzle values can be placed by the renderer.

## Production and review

Run `node scripts/prepare_lr_expedition_art.cjs` to regenerate the transparent 384-pixel WebP assets and manifest from the source sheets. The character identity references can be recreated with `node scripts/extract_lr_portrait_refs.cjs`. Run `node scripts/render_lr_expedition_contact.cjs` to refresh the roster review sheets.

Run `node scripts/validate_lr_expedition_art.cjs` to check the 30-character five-state contract, manifest paths, sprite dimensions and transparent corners.

The currently shipped Ninefold Orchard renderer selects front idle, carrying and exhausted. Rear idle and action exist for future movement and interaction animation. Little Reckoning still uses portrait fallback until its art registry and renderer selection are wired.

Visual review found recognisable silhouettes and readable carrying poses across the 30-card roster. Quantakit's purple-orange head initially keyed out with the magenta background; connected-background extraction now preserves it. The existing alpha validator reports false positives for Zoomby's pale wings and a few pale stone tiles because it counts light neutral artwork as checkerboard. The source sheets use flat magenta or real alpha, and the extracted sprites have transparent surrounding pixels. The remaining magenta edge fringe should be cleaned in final QA before shipping.

## Next production batches

Add module-specific action controls, further map objectives and later-route environments. Keep all operators, values, numbers and interface wording as live text. Wire the Little Reckoning art registry after alpha-edge and board-scale review.
