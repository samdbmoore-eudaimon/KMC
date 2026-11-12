const words=value=>String(value||'').replaceAll('-',' ');
export function rewardText(award){
  if(award?.ok===false)return 'This clear could not be verified for a reward. No stars were awarded.';
  if(award?.locked)return 'This tier was not unlocked. No stars were awarded.';
  if(award?.alreadyAwarded)return 'Already awarded: no replay stars.';
  if(award)return `${award.stars} stars awarded through your collection.`;
  return 'Expedition complete. Check your collection for its recorded reward.';
}
export function entityName(state,id) {
  if(id==='orchard')return state.blueprint.orchard.name||'Ninefold tree';
  const enemy=state.blueprint.enemies.find(e=>e.id===id),enemyNames={hookmole:'Hookmole',scruffcrow:'Scruffcrow',strawling:'Strawling',crosswind:'Crosswind'};
  if(typeof id==='string'&&id===state.blueprint.puzzle?.networkGroupId)return ({'equation-wheels':'Equation network',nonogram5:'Whole nest chart',balance:'All loads',polyhex:'Branch clearing'})[state.blueprint.puzzle.kind]||'Whole number lock';
  const group=/^(row|col|box)-(\d+)$/.exec(id||'');if(group)return `${{row:'Row',col:'Column',box:'Box'}[group[1]]} ${Number(group[2])+1}`;
  const cell=/^r(\d+)c(\d+)$/.exec(id||'');if(cell)return `row ${Number(cell[1])+1}, column ${Number(cell[2])+1}`;
  return state.profiles[id]?.name||state.blueprint.stations.find(s=>s.id===id)?.name||enemy?.name||enemyNames[enemy?.artId]||words(id);
}
export function reasonText(code,params={},state=null) {
  params=params||{};
  const names=id=>state?entityName(state,id):words(id);
  const known={
    'not-enough-ap':'This hero needs more action points. End the round to restore them.',
    'card-exhausted':'This ability is spent. Use Second Wind or Refocus to ready it.',
    'out-of-range':'Move closer to the target first.',
    'no-line-of-sight':'A hedge or closed gate blocks the view. Find a clear angle.',
    'stale-revision':'The board has changed. Review the new preview.',
    'stale-forecast':'The forecast has changed. Review it before ending the round.',
    'stale-draft':'The puzzle draft has changed. Review Commit again.',
    'station-held':`${names(params.holderId)} already holds this station.`,
    'already-held':'This hero already holds the station.',
    'alcove-unprepared':'Prepare the alcove before holding it.',
    'alcove-already-prepared':'The alcove is already prepared.',
    'already-charged':'This station is fully charged.',
    'nothing-to-repair':'This target is already at full health or integrity.',
    'nothing-to-do':'There is no missing power or damage to restore. Choose a different target or action.',
    'card-not-exhausted':'No spent ability selected. Use an ability first, then choose it to ready again.',
    'refocus-needs-full-ap':'Refocus needs both actions. Try it at the start of a round.',
    'refocus-used':'This hero has already used their once-per-run Refocus.',
    'no-target':'There is no suitable target for this action yet.',
    'invalid-targets':'Choose one or two different targets within this action’s range.',
    'nowhere-to-go':'No reachable unoccupied hex is available. Move another hero or open a route first.',
    'nothing-to-undo':'There is no player action to undo in this round.',
    'sudoku-incomplete':'Fill all 16 ledger cells before committing.',
    'sudoku-repeated':'A row, column or box repeats a value.',
    'sudoku-cage-sum':'A cage does not add to its displayed total.',
    'sudoku-given':'This printed clue cannot be changed.',
    'puzzle-output-budget':`These circuits cost ${params.cost}; the machine has a budget of ${params.budget}.`,
    'puzzle-output-count':`Choose ${params.count??params.max} circuits.`,
    'rotation-selected-unpowered':'A selected equation is not true. Correct it or choose another circuit.',
    'rotation-true-track-count':`Only ${params.count} equations are true. This mission needs ${params.required} true equations through the enemy turn.`,
    'nonogram-incomplete':'Mark every cell as filled or empty before committing.',
    'nonogram-clue':'A row or column does not match its printed run clues. Check the filled runs and the gaps between them.',
    'nonogram-given':'This printed nest clue cannot be changed.',
    'balance-hidden-value':'Infer the hidden load’s value and place that load on a pan before activation.',
    'balance-used-count':'Use the printed number of loads on the pans and leave the rest in reserve.',
    'balance-pan-total':'Check both pan totals, their capacities and their maximum load counts.',
    'balance-incompatible':'Two loads that cannot share a pan are together. Move one to the other pan or reserve.',
    'balance-inference-contradicts-comparison':'This value disagrees with a recorded comparison. Review the scale results before choosing it.',
    'no-comparisons-left':'The weighing allowance is used. Review your recorded results; repeating a known comparison is free.',
    'load-on-both-sides':'Use each load on only one side of the comparison scale.',
    'packing-missing-piece':'Place every branch before activation.',
    'packing-outside':'Part of a branch is outside the clearing. Choose a different anchor or orientation.',
    'packing-forbidden':'A branch covers a forbidden cell. Move or turn it.',
    'packing-socket-suppressed':'A compulsory socket has lost shelter. Protect it from the forecast root fall before the next commissioning turn.',
    'packing-overlap':'Two branches overlap. Move one to a free part of the clearing.',
    'packing-socket':'Cover every compulsory socket.',
    'packing-free-access':'Leave at least three free cells connected to the approach.',
    'bridge-occupied':`The bridge cannot close while ${params.blockers?.map(names).join(', ')||'a figure'} is on it.`,
    'storm-would-destroy-orchard':'The storm would destroy the orchard. Repair it before choosing Storm.'
  };
  if(code==='hold-profile-short')return (params.shortfalls||[]).map(s=>`${s.name||s.statName||s.stat}: ${s.actual??s.have}; needs ${s.required??s.need}`).join('; ')+' Operating requirements use printed stats.';
  if(code==='deadline')return 'The fifth enemy phase ended before all three operating jobs and the puzzle were ready.';
  if(code==='hero-defeated')return `${names(params.heroId)} was defeated. Every party member must survive.`;
  if(code==='station-destroyed')return `${names(params.stationId)} was destroyed. Repair or protect it earlier.`;
  if(code==='orchard-destroyed')return 'The orchard lost all its integrity. Protect tree maintenance or repair the tree.';
  if(code==='zero-damage')return `Power ${params.raw} does not exceed armour ${params.armour}; the strike deals no damage.`;
  if(code==='allocation-exceeds-stat')return 'The shared amount exceeds this hero’s printed stat. Reduce the allocation.';
  if(code==='exceeds-capacity'||code==='exceeds-missing')return 'The target cannot receive that much. Reduce the allocated amount.';
  return known[code]||`Unavailable: ${words(code)}.`;
}
export function factorText(factor,state) {
  if(factor.key==='strike')return `${factor.governingStat??factor.stat??factor.base??''} + support ${factor.support??0} + mark ${factor.mark??0} − armour ${factor.armour??0} = ${factor.damage??0} damage`;
  if(factor.key==='charge')return factor.charge?`Arithmetic ${factor.value}; transfers ${factor.applied} charge: ${factor.charge[0]} → ${factor.charge[1]}/${factor.capacity}`:`Arithmetic ${factor.limit}; total shared charge ${factor.total}`;
  if(factor.key==='restore')return `Science ${factor.value}${factor.applied!==undefined?`; restores ${factor.applied}`:' restored'} health or integrity`;
  if(factor.key==='shield')return `Shield strength ${factor.value}: absorbs damage during the next enemy turn, then expires`;
  if(factor.key==='governing')return `${factor.label} ${factor.value}`;
  if(factor.key==='budget')return `Travel budget: ${factor.value} movement points`;
  if(factor.key==='cost')return `Travel cost: ${factor.value} movement point${factor.value===1?'':'s'}`;
  if(['support','mark','bonus','armour','damage'].includes(factor.key))return `${words(factor.key)}: ${factor.value}`;
  if(['lock','stabilise'].includes(factor.key))return `${factor.stat} ${factor.value}: ${words(factor.key)} strength`;
  if(factor.key==='hold')return `${entityName(state,factor.targetId||factor.stationId||factor.job)}: ${(factor.need||[]).map((need,i)=>need?`${['Arithmetic','Geometry','Logic','Science','Speed'][i]} ${factor.have[i]} / ${need} required`:null).filter(Boolean).join('; ')}. Hold applies while the hero stays in place through this enemy turn.`;
  if(factor.key==='hold-grant')return `Hold grants ${factor.kind==='lock'?'protection against puzzle changes':factor.kind==='stabilise'?'protection against roots':'a damage shield'}: strength ${factor.amount}.`;
  if(factor.key==='move')return `Movement cost ${factor.cost??factor.pathCost??0}; budget ${factor.budget??0}`;
  if(factor.key==='comparison')return words(factor.result);
  if(factor.key==='commit')return 'Draft committed; circuits updated';
  return null;
}
export function eventText(event,state) {
  const actor=entityName(state,event.heroId||event.enemyId||event.id),target=entityName(state,event.targetId),station=entityName(state,event.stationId);
  const cause=event.cause?.enemyId?entityName(state,event.cause.enemyId):event.cause?.heroId?entityName(state,event.cause.heroId):event.cause?.nestSector?`The exposed ${words(event.cause.nestSector)} nest`:event.cause?.hazardId==='root-drain'?'The orchard roots':event.cause?.hazardId==='ravine-wind'?'The ravine wind':event.cause?.hazardId?words(event.cause.hazardId):event.cause?.outputId?words(event.cause.outputId):words(event.cause?.verb||(typeof event.cause==='string'?event.cause:null));
  if(event.type==='hero-damaged')return `${cause||'The attack'}: power ${event.power} − armour ${event.armour} − shield ${event.shieldAbsorbed} = ${event.damage} damage to ${actor}. Health ${event.hpBefore} → ${event.hpAfter}.`;
  if(event.type==='enemy-damaged')return `${cause||'The attack'} deals ${event.damage} damage to ${actor}. Health ${event.hpBefore} → ${event.hpAfter}. ${event.hpAfter>0?'The enemy survives.':'The enemy is defeated.'}`;
  if(event.type==='station-damaged')return `${cause||'The attack'}: power ${event.power} − shield ${event.shieldAbsorbed} = ${event.damage} damage to ${station}. Integrity ${event.integrityBefore} → ${event.integrityAfter}.`;
  if(event.type==='orchard-damaged')return `${cause||'The hazard'} ${event.cause?.hazardId==='root-drain'?'remove':'removes'} ${event.amount} orchard integrity: ${event.integrityBefore} → ${event.integrityAfter}.`;
  if(event.type==='orchard-restored')return `The orchard regains ${event.amount} integrity: ${event.integrityBefore} → ${event.integrityAfter}.`;
  if(event.type==='hero-restored')return `${actor} regains ${event.amount} health: ${event.hpBefore} → ${event.hpAfter}.`;
  if(event.type==='station-repaired')return `${station} regains ${event.amount} integrity: ${event.integrityBefore} → ${event.integrityAfter}.`;
  if(event.type==='station-charged')return `${actor} transfers ${event.amount} charge to ${station}: ${event.charge}/${event.capacity}.`;
  if(event.type==='hold-started')return `${actor} holds ${station}. Its operating protection lasts through this phase while the hero stays there.`;
  if(event.type==='hold-cancelled')return `${actor} stops holding ${station} because of ${words(event.cause)}. Its Hold protection is lost${event.lostProtection?.length?`: ${event.lostProtection.map(g=>`${words(g.kind)} ${g.amount}`).join(', ')}`:''}.`;
  if(event.type==='enemy-moved')return `${actor} advances along the marked route (${event.from} → ${event.to}).`;
  if(event.type==='shelter-applied')return Array.isArray(event.targetIds)?event.targetIds.length?`Shelter gives ${event.amount} shield to ${event.targetIds.map(id=>entityName(state,id)).join(', ')} this enemy turn.`:'Shelter covers no hero or station this enemy turn.':'Shelter gives the job stations shields for this enemy turn.';
  if(event.type==='shelter-suppressed')return `Shelter is suppressed${event.cells?.length?` at ${event.cells.join(', ')}`:''} for this enemy turn.`;
  if(event.type==='roots-active')return 'Roots stop Breaker enemies moving this turn.';
  if(event.type==='beam-active')return `The ${words(event.sector)} beam scatters birds in its sector this turn.`;
  if(event.type==='nest-blocked')return `Protection keeps the ${words(event.sectorId)} nest from damaging the orchard.`;
  if(event.type==='enemy-idle')return event.reason==='dormant'?`${actor} waits until enemy phase ${event.wakePhase}.`:`${actor} cannot act: ${words(event.reason)}.`;
  if(event.type==='enemy-out-of-range')return `${actor} cannot reach ${target} this phase.`;
  if(event.type==='disruption-blocked')return `${actor}'s change to ${event.memberId} is blocked: protection ${event.strength} meets power ${event.power}.`;
  if(event.type==='lock-broken')return `${actor} breaks protection ${event.strength} with power ${event.power}.`;
  if(event.type==='disruption-cancelled')return `${entityName(state,event.heroId)} cancels ${entityName(state,event.enemyId)}'s disruption.`;
  if(event.type==='alcove-prepared')return `${actor} prepares the alcove. Its Shape job adds 2 Geometry and requires Speed 6.`;
  if(event.type==='card-spent')return `${actor}'s ${words(event.cardId)} is spent.`;
  if(event.type==='card-readied')return `${actor}'s ${words(event.cardId)} is ready again.`;
  if(event.type==='run-won')return 'All three jobs and the correct puzzle held through the enemy phase. Expedition complete.';
  if(event.type==='run-lost')return reasonText(event.code,event.params,state);
  if(event.type==='round-started')return `Round ${event.round}: each surviving hero has 2 action points.`;
  if(event.type==='damage')return `${target}: ${event.before} → ${event.after} health`;
  if(event.type==='hero-moved')return `${actor} reached the marked hex.`;
  if(event.type==='puzzle-disrupted'){
    const changed=Object.entries(event.outputsAfter||{}).filter(([id,on])=>event.outputsBefore?.[id]!==on).map(([id,on])=>`${state.blueprint.outputs?.find(output=>output.id===id)?.label||words(id)} turned ${on?'on':'off'}`);
    const draft=({nonogram5:'nest chart',balance:'pan allocation','equation-wheels':'equation draft',polyhex:'branch draft'})[state.blueprint.puzzle?.kind]||'number draft';
    return `${actor} changed ${entityName(state,event.memberId)}. ${changed.length?changed.join('; ')+'.':'Check the affected circuits.'} Restore the ${draft} and activate it again.`;
  }
  if(event.type==='hazard-blocked')return 'Protection blocked the forecast hazard.';
  if(event.type==='hazard-mutation'){
    const kind=state.blueprint.puzzle?.kind;
    if(kind==='balance')return `The hazard returns load ${event.memberId} to reserve. Restore the pan allocation in your free draft and activate it again.`;
    if(kind==='nonogram5')return `The hazard clears ${entityName(state,event.memberId)}. Restore the nest chart in your free draft and activate it again; check the exposed perch.`;
    if(kind==='polyhex')return `The roots remove shelter at ${event.memberId} for this phase. Branch placements stay intact. Protect the forecast socket before the next commissioning turn.`;
    return `The wind turns wheel ${event.memberId} clockwise once. Check every linked equation; restore the draft and activate it again.`;
  }
  if(event.type==='puzzle-committed')return 'Puzzle committed; the selected circuits now use this draft.';
  if(event.type==='won')return 'All three jobs held through the enemy phase. Expedition complete.';
  if(event.type==='lost')return `Expedition ended: ${words(event.reason||event.code)}.`;
  return `${words(event.type)}${event.targetId?`: ${target}`:''}.`;
}
export function intentText(intent,state) {
  const actor=entityName(state,intent.enemyId);
  if(intent.verb==='dormant')return `${actor} waits until enemy phase ${intent.wakePhase}.`;
  const move=intent.actualPath?.length?`moves to ${intent.actualPath.at(-1)} then `:'';
  const change=intent.puzzleChange,member=change?entityName(state,change.memberId):'';
  const mutation=change?`; ${change.applied===true?`changes ${member}`:change.applied===false?`change to ${member} is not applied`:`plans a change to ${member}`}`:'';
  const verb=change?.applied===false?`attempts to ${words(intent.verb)}`:words(intent.verb);
  const blocked=intent.blockedBy?`; blocked: ${reasonText(intent.blockedBy.code,intent.blockedBy,state).replace(/[.!?]+$/,'')}`:'';
  return `${actor} ${move}${verb}${intent.targetId?` ${entityName(state,intent.targetId)}`:''}; power ${intent.power}${mutation}${blocked}.`;
}
export function hazardText(hazard,state=null) {
  const member=hazard.mutation?.memberId,kind=state?.blueprint.puzzle?.kind;
  const mutation=!member?'':kind==='balance'?`The hazard will return load ${member} to reserve. `:kind==='nonogram5'?`The hazard will clear ${entityName(state,member)} in the nest chart. `:kind==='polyhex'?`The roots will remove shelter at ${member} for this phase; branch placements stay intact. `:`The wind will turn wheel ${member} clockwise once, changing its linked equations. `;
  return `${hazard.hazardId==='root-drain'?'Orchard roots':words(hazard.hazardId)}: protection ${hazard.power} required. ${mutation}${(hazard.sites||[]).map(site=>site.blocked?'The orchard is protected at this site.':`This exposed site removes ${site.damage} orchard integrity.`).join(' ')}`;
}
