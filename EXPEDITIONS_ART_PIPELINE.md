# Expeditions visual production pipeline

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. Use
> `EXPEDITIONS_SCENARIO_ART_MATRIX.md` to determine which assets each scenario actually needs.

## Decision

Expeditions should use 2.5D sprite theatre rather than real-time 3D models. A character is a painted transparent sprite with a small set of poses. The board supplies depth through isometric hex placement, depth sorting, scale, ground shadows, foreground occlusion, lighting overlays and short transform animations.

This gives the intended modern-art-made-like-a-classic-tactics-game look while keeping the app offline, the HTML bundle portable and the production burden realistic for ninety characters.

## What is already available

- The image-generation tool can create new character turnarounds, props, effects, scenery plates and UI concepts. It has produced the existing direction images in `assets/expeditions/`.
- Every collectible card already has finished portrait art. The playable slice uses that art immediately, so no card becomes unusable while bespoke field sprites are being produced.
- React and CSS can render the board, depth-sort figures, tint reachable hexes, draw intent markers and animate movement without adding a game framework.
- Sharp is installed locally. It can perform deterministic build-time trimming, resizing, WebP conversion and atlas assembly after an image has been approved.
- The current esbuild pipeline embeds the finished WebP or PNG assets into the single offline HTML and the Capacitor build.

Blender, Krita, Aseprite and FFmpeg are not installed on this machine. None is required for the chosen pipeline. Blender would only become necessary if we changed direction to genuine lit 3D meshes or wanted rendered turntables as intermediate source material.

## Current menu and control concepts

- `9fo-expeditions-home-tile-concept-v2.png`: the current Ninefold Orchard home tile using the established timber, apple, leaf and brass language and the subtitle "Quick tactical challenges". The miniature scene communicates an expedition through a bridge, hex path and balancing scales rather than a generic beige panel.
- `9fo-expeditions-home-tile-concept-v1.png`: retained as the superseded first wording study.
- `9fo-expedition-button-system-concept-v1.png`: an art-direction sheet for Move, Collect, Guard, Strike and End Round in available, highlighted, pressed and disabled states. Its centres are intentionally text-safe so labels, costs and accessibility text remain live UI.

These files are visual targets, not runtime assets. They must not be wired into the shipped interface until their crops, responsive behaviour, contrast and button hit areas have passed the art integration checks in `EXPEDITIONS_CLAUDE_HANDOVER.md`.

## First wiring-candidate package

The separated Ninefold Orchard package is available under `assets/expeditions/production/9fo/`. It now contains 231 runtime WebP files covering the complete 30-card field roster, Hookmole plus eight proposed encounter enemies, operator-wheel states, terrain, number loads, objective structures, effects, composable action controls, team readiness and the orchard gorge background.

`EXPEDITIONS_ART_HANDOVER.md` defines the wiring order and review status. `assets/expeditions/production/9fo/manifest.json` supplies stable ids and live-overlay anchors. `EXPEDITIONS_ART_PROMPTS.md` records the source prompt set. These assets remain private-prototype candidates until visual QA and explicit approval.

## Ownership and handover

Codex owns visual direction, sprite sheets, terrain, props, effects, module-specific chrome and visual quality review. Claude owns the data-driven renderer, asset manifest, fallbacks, interaction states and automated checks. Rules, numbers and labels must remain in code so artwork can be replaced without changing game behaviour.

## Per-character asset budget

The full art library targets five small WebP files per collectible character:

1. Front three-quarter idle
2. Rear three-quarter idle
3. Action or attack
4. Exhausted
5. Carrying a blank, reusable load

The current Ninefold Orchard board selects front idle, carrying and exhausted. Rear idle and action are prepared for movement and action animation but are not selected by the current renderer. Left-facing versions can be mirrored at runtime. Movement uses translation, a two-frame vertical hop, squash and shadow scaling. A full walk cycle is deliberately avoided.

Recommended source size is 768 by 768 with transparency. Runtime sizes are 192 and 384 pixels for standard and high-density displays. Keep feet on the same baseline and reserve roughly twelve per cent clear space beneath them for the oval shadow.

## Shared asset budget

Each world needs:

- One distant background plate per environment family
- A reusable isometric terrain atlas
- Objective props such as loads, switches, lanterns and route stones
- Enemy poses, usually idle, action and exhausted
- Shared effects for guard, heal, strike, selection, movement and objective completion
- Parchment or in-world panels matching that module's existing visual language

Ninefold Orchard should use soft autumn colour, timber, brass and carved stone. Little Reckoning should use saturated violet magic, paper geometry and more active silhouettes. Gifford should use burgundy, iron, rain, glass and precise mechanical overlays.

## Production sequence

1. Lock a character's silhouette and costume from its existing card art.
2. Generate the four-pose sheet against a plain background.
3. Regenerate or edit any pose whose identity, hands, props or costume drift.
4. Remove the background and inspect at the actual 96 to 160 pixel on-board size.
5. Crop to a shared baseline and export lossless working PNGs.
6. Build 192 and 384 pixel WebP variants with Sharp.
7. Test front and rear poses on light, dark, busy and glowing hexes.
8. Add the sprite manifest entry and use the portrait as a fallback until all poses pass review.

## Animation rules

- Movement: 180 to 240 milliseconds per hex, with later hexes accelerated
- Attack: 90 milliseconds anticipation, 120 milliseconds impact and 160 milliseconds recovery
- Guard: shield expands once, then rests at low opacity
- Damage: short directional recoil; never prolonged screen shake
- Enemy phase: actions may overlap, and a tap completes the current animation immediately
- Victory: the mathematical result appears first, then character celebration and reward

## Quality gates

- The character remains recognisable at 96 pixels tall
- The feet and shadow clearly identify the occupied hex
- Selection colour is distinguishable without relying on hue alone
- Intent icons remain legible at phone size
- No important number is baked only into scenery
- The objective state can be understood from a still frame
- Decorative text is optional; rules text and values must be live UI text

## Tooling conclusion

The current toolset can build the complete 2.5D version: image generation for source paintings, the existing art library for immediate fallbacks, Sharp for asset preparation and React/CSS for the field renderer. We do not need another paid or installed tool to ship the visual direction. A dedicated paint package would make manual touch-up more convenient later, but it is an efficiency choice rather than a dependency.
