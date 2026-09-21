# Expeditions scenario art assignment matrix

> Central entry point: `EXPEDITIONS_MASTER_BRIEF.md`. Read the experience/art brief before
> using this matrix, then record the resulting ids in the production manifest.

Status: proposed production map. This is the allocation layer for
`EXPEDITIONS_EXPERIENCE_AND_ART_BRIEF.md`. Each row names the art that a scenario must use,
so no asset is generated merely because it sounds useful and no scenario reaches implementation
without its visual vocabulary.

## Shared kit required by every scenario

`ui.hud.compact`, `ui.actionRail`, `ui.objectiveChip`, `ui.intentCard`,
`ui.combatCalculation`, `ui.statCheckPreview`, `tile.clear`, `tile.difficult`, `tile.blocked`,
`fx.reachable`, `fx.selected`, `fx.danger`, `fx.guarded`, `fx.stabilised`, `fx.corrupted`,
`fx.complete`, `base.idle`, `base.selected`, `base.carrying`, `base.exhausted`.

All values, formulae, health, Defence, objectives and player-facing labels remain live UI.
They are not baked into raster assets.

## Ninefold Orchard assignments

| Map | Environment and backdrop | Required props and mechanisms | Enemy / boss states | Unique effects |
|---|---|---|---|---|
| 1 Unequal Crossing | `po.env.ravineBridge` | `po.prop.brassPlatform`, `po.prop.tallyArch`, `po.prop.numberLoad`, `po.prop.burrow` | `po.enemy.hookmole`: idle, study, steal, hit, defeated | `po.fx.platformUnder`, `balanced`, `overloaded`, `archOpen` |
| 2 Cider Run | `po.env.ciderPressLanes` | `po.prop.ciderPress`, `po.prop.appleBasket`, `po.mech.flowArrow`, `po.prop.harvestGate` | `po.enemy.scruffcrow`: perch, peck, flee | `po.fx.ciderFlow`, `valueRaised`, `valueLowered` |
| 3 Nine Across the Turning Bridge | `po.env.windRavine` | `po.mech.currentTurner`, `po.prop.bridgeSection`, `po.prop.windVane`, `po.prop.safeAlcove` | `po.enemy.crosswind`: gather, push, dissipate | `po.fx.windPath`, `capacitySafe`, `capacityRisk` |
| 4 Hedgejaw Maze | `po.env.walkingHedge` | `po.prop.numberStone`, `po.prop.colourGate`, `po.mech.hedgeRoute` | `po.enemy.hedgejaw`: stalk, closeRoute, bite, stunned | `po.fx.routeClosing`, `routeClosed`, `sequenceCorrect` |
| 5 Rooststorm | `po.env.stormRoost` | `po.prop.whistleTower`, `po.mech.windDial`, `po.prop.stormFront` | `po.enemy.maybeFinch`: flock, dive, drivenOff | `po.fx.whistleBeam`, `stormSweep`, `towerHeld` |
| 6 Rootfire Relay | `po.env.rootfireCave` | `po.prop.rootNode`, `po.mech.rootLink`, `po.prop.sourceFruit`, `po.prop.bridgeRoot` | `po.enemy.strawling`: crawl, alter, retreat | `po.fx.rootPulse`, `chainTravel`, `parityMatch` |
| 7 Murder at Moonfall | `po.env.moonfallOrchard` | `po.prop.ringStone`, `po.mech.ringSegment`, `po.prop.gapMarker` | `po.enemy.crowSwarm`: flow, escape, contained; `po.enemy.crowbreaker`: smash, hit, defeated | `po.fx.ringOpen`, `ringClosed`, `flockContained` |
| 8 Hollow Bough Awakens | `po.env.memorialGrove` | `po.prop.memorialHex`, `po.prop.livingBranch`, `po.prop.rootBarrier`, `po.prop.fallMarker` | `po.enemy.overgrowth`: spread, lash, prune | `po.fx.branchForecast`, `memorialDamage`, `memorialSafe` |
| 9 Orchard Lockdown | `po.env.livingGateCourt` | `po.mech.hiveLedgerCell`, `po.mech.hiveGroupFlower`, `po.mech.hiveGroupRay`, `po.mech.hiveGroupRing`, `po.prop.livingGate` | `po.enemy.nearly`: inspect, corruptCell, retreat | `po.fx.cellLocked`, `cellCorrupt`, `groupSolved`, `gateAwake` |
| 10 First Whistle | `po.env.firstRootChamber` | `po.mech.branchPort`, `po.mech.branchRotator`, `po.prop.foundingStone`, `po.prop.signalRoot` | `po.boss.firstRoot`: dormant, shielded, forecast, vulnerable, strike, defeated | `po.fx.portConnected`, `networkLive`, `rootShield`, `rootVulnerable` |

## Little Reckoning assignments

| Map | Environment and backdrop | Required props and mechanisms | Enemy / boss states | Unique effects |
|---|---|---|---|---|
| 1 Smudged Stones | `lr.env.fogStreet` | `lr.mech.operatorWheel`, `lr.prop.pathStone`, `lr.prop.fogBeacon` | `lr.enemy.fogThumb`: creep, smudge, revealed, defeated | `lr.fx.operatorClear`, `operatorSmudged`, `pathValid` |
| 2 Market of Approximate Things | `lr.env.driftingMarket` | `lr.prop.marketStall`, `lr.prop.goodsCrate`, `lr.mech.boundTag`, `lr.prop.scale` | `lr.enemy.mistVendor`: drift, withdrawStock, bargain | `lr.fx.boundKnown`, `weightOver`, `valueSafe` |
| 3 Backwards Courtyard | `lr.env.rewindCourt` | `lr.prop.recurrenceTile`, `lr.mech.rewindGate`, `lr.prop.bell` | `lr.enemy.reverseKnight`: rewind, guard, defeated | `lr.fx.stepValid`, `stepReversed`, `timelineRipple` |
| 4 Lanterns in the Forgetting Fog | `lr.env.lanternCanal` | `lr.mech.signalPrism`, `lr.prop.lantern`, `lr.prop.routeMarker`, `lr.prop.signalPost` | `lr.enemy.fogling`: drift, closePort, revealed | `lr.fx.prismBeam`, `portBlocked`, `networkMinimum` |
| 5 General Guesswork's Battery | `lr.env.artilleryBattery` | `lr.prop.rangeBeacon`, `lr.mech.intervalDial`, `lr.prop.barricade` | `lr.enemy.guessGuard`, `lr.enemy.guessArcher`, `lr.boss.generalGuesswork` | `lr.fx.intervalValid`, `intervalMiss`, `artilleryLine` |
| 6 Unshape's Theatre | `lr.env.foldingTheatre` | `lr.mech.perimeterEdge`, `lr.prop.stagePivot`, `lr.prop.seal` | `lr.boss.unshape`: fold, tear, stunned, defeated | `lr.fx.edgeUnstable`, `edgeSealed`, `perimetersEqual` |
| 7 Countless Chase | `lr.env.numberDistricts` | `lr.prop.districtSign`, `lr.mech.groupTile`, `lr.prop.courier` | `lr.enemy.countlessSwarm`: pursue, raiseCost, disperse | `lr.fx.groupEntered`, `routeInvalid`, `courierTrail` |
| 8 Madam Nought's House | `lr.env.noughtHouse` | `lr.mech.expressionLock`, `lr.prop.zeroDoor`, `lr.prop.courierCage` | `lr.enemy.noughtShadow`: inflate, possess, vanish | `lr.fx.expressionZero`, `lockInflated`, `courierFree` |
| 9 Almost Mirror | `lr.env.mirrorCourt` | `lr.mech.mirrorRing`, `lr.prop.reflectionTile`, `lr.prop.freezeSeal` | `lr.enemy.echo`: copy, misrotate, frozen | `lr.fx.reflectionMatch`, `copyError`, `congruent` |
| 10 Counted In | `lr.env.fracturedCity` | `lr.mech.partitionRegion`, `lr.prop.fragment`, `lr.prop.collapseAnchor` | `lr.enemy.muddleFragment`: drift, misplace, shattered | `lr.fx.placementValid`, `placementConflict`, `regionSecure` |

## Gifford assignments

| Map | Environment and backdrop | Required props and mechanisms | Enemy / boss states | Unique effects |
|---|---|---|---|---|
| 1 Examination Clock | `gf.env.examinationHall` | `gf.prop.taskStation`, `gf.mech.clockFace`, `gf.prop.deadlineGate` | `gf.enemy.proctor`: inspect, closeStation, retreat | `gf.fx.taskScheduled`, `stationClosed`, `bellAdvance` |
| 2 Cross's Pursuit Network | `gf.env.pursuitNetwork` | `gf.mech.weightedEdge`, `gf.prop.costNode`, `gf.prop.courier` | `gf.enemy.tracker`, `gf.enemy.hound` | `gf.fx.edgeCostChanged`, `routeMinimum`, `courierThreat` |
| 3 Sealed Archive | `gf.env.sealedArchive` | `gf.mech.vaultGrid`, `gf.prop.feeder`, `gf.prop.paritySeal` | `gf.enemy.archiveWarden`, `gf.enemy.cipherMoth` | `gf.fx.constraintMet`, `feederChanged`, `vaultOpen` |
| 4 Vex's Proof Forge | `gf.env.proofForge` | `gf.mech.expressionRail`, `gf.prop.termTile`, `gf.prop.proofStand` | `gf.enemy.vexConstruct`, `gf.enemy.vexAssistant` | `gf.fx.termCombined`, `proofEquivalent`, `constructVulnerable` |
| 5 Bramwell's Compromise Engine | `gf.env.compromiseEngine` | `gf.mech.valve`, `gf.prop.flowGauge`, `gf.prop.pressureGauge`, `gf.prop.costGauge` | `gf.enemy.pressureValve`: surge, alterForecast, vent | `gf.fx.constraintSafe`, `constraintFail`, `feasibleSet` |
| 6 Vale's Filing War | `gf.env.filingVault` | `gf.mech.degreeNode`, `gf.mech.fileEdge`, `gf.prop.centralFile` | `gf.enemy.clerkDrone`: closeEdge, pursueDesk, disabled | `gf.fx.degreeLimit`, `edgeRestored`, `networkSpanning` |
| 7 Whistle's Exchange | `gf.env.hostileExchange` | `gf.prop.tradeStand`, `gf.mech.priceTag`, `gf.prop.capacityCart` | `gf.enemy.broker`, `gf.enemy.collector` | `gf.fx.priceShift`, `tradeValid`, `cartOverload` |
| 8 Scarrow's Ring | `gf.env.scarrowArena` | `gf.mech.medianRing`, `gf.prop.valueObelisk`, `gf.prop.controlFlag` | `gf.boss.scarrow`, `gf.enemy.second` | `gf.fx.medianChanged`, `medianControlled`, `bossExposed` |
| 9 Chancellor's Living Ledger | `gf.env.livingLedger` | `gf.mech.inequalityCell`, `gf.prop.clueScroll`, `gf.prop.rowSeal` | `gf.enemy.ledgerGuard`, `gf.boss.chancellor` | `gf.fx.clueLocked`, `rowErased`, `deductionComplete` |
| 10 Engine's Answer | `gf.env.engineChamber` | `gf.mech.signalProcessor`, `gf.mech.dynamicEdge`, `gf.prop.delayGauge` | `gf.enemy.engineProcess`, `gf.boss.engineCore` | `gf.fx.signalTravel`, `edgeRewrite`, `minimaxSolved`, `coreVulnerable` |

## State minimums

Each reusable mechanism needs these art states before it is marked production-ready:

| Asset type | States |
|---|---|
| Interactive mechanism | idle, selected, valid target, invalid target, active, disabled, damaged/corrupted, solved |
| Enemy | idle, intent, move, signature action, hit, defeated |
| Boss | dormant, shielded, forecast, active, vulnerable, hit, defeat |
| Network/route | inactive, selectable, connected, blocked, overloaded, repaired, complete |
| Deduction cell | unknown, candidate, selected, locked, corrupted, conflict, solved |

## Production ordering

1. Complete shared kit and Ninefold Maps 1–3, because these establish terrain, loading,
   rotating hexes, flow and capacity.
2. Produce the reusable Hive Ledger, signal-prism and rotation assets before Ninefold 9–10.
3. Produce Little Reckoning mechanisms as a coherent fog-and-brass package, not one enemy at a
   time.
4. Produce Gifford after its solver contracts are stable, beginning with weighted edges,
   vault grids and expression rails.

No scenario may enter a visual implementation pass without the row above being checked against
the art manifest and the named state minimums.
