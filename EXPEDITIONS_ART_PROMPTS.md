# Expeditions art prompt register

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. This is a historical prompt register,
> not an automatic generation queue. Use the scenario art matrix for current asset assignment.

Mode: built-in image-generation tool.

This register records the source intent for the first Ninefold Orchard production slice. Exact character identity references were the existing Pip, Nine and Bramble card portraits.

## Pip pose sheet

Create the card-accurate green acorn-headed Pip in four isolated poses on genuine transparency: front three-quarter idle, rear three-quarter idle, mechanism interaction and exhausted. Preserve the brown acorn cap, acorn backpack, proportions and colours. Use a polished modern hand-painted game-sprite finish with warm orchard light. Keep equal quadrants, consistent scale, clean edges and no text, ground or shadow.

## Nine pose sheet

Create the card-accurate natural black crow Nine in four isolated poses on genuine transparency: front three-quarter idle, rear three-quarter idle, airborne relay and exhausted. Preserve blue-black plumage, pale eye, black beak and red ankle cord. Add no clothing. Use consistent warm orchard lighting, equal quadrants and no text, ground or shadow.

## Bramble pose sheet

Create the card-accurate warm-brown hedgehog Bramble in four isolated poses on genuine transparency: front three-quarter idle, rear three-quarter idle, calculating with a blank slate and exhausted. Preserve dark spines, cream belly, round black spectacles, friendly proportions and slate. Use equal quadrants and no text, ground or shadow.

## Hookmole pose sheet

Create a compact charcoal-grey mole with pink snout, digging claws, worn burgundy orchard coat and brown aviator cap with brass goggles. Supply four isolated poses: front idle with brass utility hook, rear sneaking, carrying a crate with blank label plate and exhausted. The enemy is mischievous rather than frightening. Use genuine transparency and no numbers or text.

## Operator-wheel sheet

Create six identical isometric hexagonal brass-and-oak operator wheels: neutral, teal selected, rotating clockwise, locked, thorn-jammed and complete. Each wheel has six blank edge plaques and a blank centre plate for live UI. Use genuine transparency, consistent perspective and no baked operators, text or numbers.

## Terrain atlas

Create twelve matching isometric Ninefold Orchard hex tiles: grass, worn path, flagstone, stream, timber bridge, stone bridge, hedge, difficult roots, apple-tree obstacle, brass objective socket, leafy start marker and exit arch. Use consistent footprint, scale, lighting and genuine transparency. Include no characters, values or UI.

## Effects atlas

Create eight isolated tactical effects: oval shadow, teal reachable hex, gold-and-teal selected hex, red thorn danger hex, translucent leaf-faceted guard dome, warm impact burst, brass clockwise rotation arrow and golden completion sparkle. Use genuine transparency, consistent isometric orientation and no text.

## Orchard gorge background

Create a wide high-three-quarter autumn orchard gorge with apple orchards, stone walls, a blue stream, small waterfall, sandstone cliffs and a ruined tally arch. Keep the central two-thirds calm and unobstructed for a separately rendered tactical board. Use a polished modern storybook environment style and no hexes, characters, objects, values or interface.

## Background-extraction correction

For Pip, remove the generated grey-and-white checkerboard and replace it with a real alpha channel while preserving every figure, pose, edge and position. A similar Nine correction was attempted but did not produce an alpha channel, so it is retained only as a rejected source attempt and is not used by the preparation script.

## Number-load atlas

Create eight isometric honey-oak and brass number-load props: neutral, teal selected, carried with straps, guarded by a blue leaf shield, split, combined, reinforced heavy and gold delivered. Keep each brass value plate blank, use a strict 4 by 2 atlas and include no text or numbers. The first pass baked a checkerboard into glowing states. A second correction replaces the backdrop with flat magenta for deterministic chroma removal and is the production source.

## Balance-platform atlas

Create six versions of the same compact two-pad weighing platform: empty, one load placed, teal selected, balanced, overloaded and broken. Keep the central dial blank for a live total. The first generation included a semi-transparent gradient backdrop. A follow-up alpha correction is used as the current wiring candidate and still requires final edge review.

## Objective-structure atlas

Create four states of a stone-and-brass tally arch, then empty and loaded feeder gates and locked and open target gates. Keep every plaque and medallion blank for live overlays. Use a flat magenta source background for deterministic extraction.

## Hookmole behaviour atlas

Preserve the existing Hookmole identity and create warning, mechanism-jamming, crate-stealing and harmlessly-blocked poses. Use a strict 2 by 2 layout, local action effects and a flat magenta source background.

## Action-button frames

Create eight identical blank orchard button frames: available, focused, selected, pressed, confirm, dangerous, spent and disabled. Each has a blank circular icon socket and a blank label field. Use a flat magenta source background and no baked icons or text.

## Action icons

Create eight separate brass medallions for move, interact, rotate, guard, collect, strike, undo and end round. Make pictograms readable at 32 to 48 pixels and independent of text. Use a flat magenta source background.

## Team-readiness meter

Create six identical five-leaf readiness meters: empty, starter, uncommon, rare, epic-ready and masterwork. Communicate strength by fill count as well as colour. Keep the label panel blank and use a flat magenta source background.

## Complete card-character atlas set

Seven atlases cover the remaining 27 Ninefold Orchard card characters. Each atlas uses one column per character and one row per state: front idle, rear idle, action and exhausted. The exact character groups are:

- Sorrel, Russet, Halfpenny, Wicker
- Furrow, Dapple, Bushel, Tuppence
- Windfall, Cornix, Thistlewick, Beeswax
- Kernel, Millrace, Cobweb, Amberly
- Barrow, Driftwood, Gable, Warden
- Harvestmoon, Ninebark, Cascade, Longshadow
- Gossamer, The Ninefold Tree, The Tenth Scarecrow

Each prompt preserves the card identity, species, silhouette and gameplay prop while using the same orchard sprite language and flat magenta extraction background.

## Proposed enemy atlas set

Two four-column atlases cover eight proposed non-card enemies. Each has idle, move, telegraph and defeated states: Rootling, Flockling, Ledger Leech, Widdershins, Thorncap, Pebbleback, Muddlenook and Numbermoth. These are deliberately friendly enough for Ninefold Orchard ages and remain marked as proposed in the manifest until scenarios adopt them.

## Unequal Crossing vertical slice screens

Generate three state variants of one 16:9 tactical-game screen, preserving the same orchard gorge, board footprint, HUD rail and action rail. Keep objective copy, numbers, operators, scores and rewards as blank live-text-safe panels. Opening state shows Pip, Nine and Bramble on start hexes with unclaimed crates and a distant Hookmole. Mid-puzzle shows Nine carrying a crate, Bramble rotating the operator, an uneven balance platform and a Hookmole warning telegraph. Completion shows the open target arch, delivered crates, level balance, blocked Hookmole and a parchment result panel with blank award sockets. Use the existing runtime sprites as identity references and the existing gorge background as the scene reference.
