import {CARD_LABELS,STAT_NAMES,STORM_ENEMY_DAMAGE,STORM_ORCHARD_COST,STORM_RADIUS,getPuzzleHooks} from '../index.js';

const guides={
  move:['Move','Travel to a highlighted reachable hex. Roots shorten your reach.','Speed determines reach','Reachable hex'],
  strike:['Strike','Damage an enemy with this hero’s strongest discipline; nearby allies can support.','Discipline + support − armour','Enemy in printed strike range'],
  guard:['Protect','Give a hero or station a shield against damage this enemy turn.','Geometry','Self or adjacent ally/station'],
  repair:['Repair','Restore missing health, station integrity or orchard integrity.','Science','Self or adjacent friendly target'],
  lock:['Protect numbers','Protect a group of puzzle cells against enemy changes this turn.','Logic','Adjacent puzzle group'],
  stabilise:['Protect from roots','Protect a station or puzzle area from environmental changes this turn.','Science','Adjacent station, group or site'],
  calibrate:['Add power','Transfer power into a station, up to its capacity.','Arithmetic','Adjacent station'],
  hold:['Hold station','Stay working at the station through the enemy turn; moving cancels Hold.','Printed job requirements','At or beside the station'],
  'prepare-alcove':['Prepare alcove','Prepare the alternative bridge station: +2 Geometry locally, Speed 6 required.','Geometry and Speed for later Hold','Adjacent alcove'],
  operate:['Activate mechanism','Apply your solved draft and chosen effects to the battlefield.','Solved puzzle','At or adjacent to the control'],
  wait:['Wait','Spend an action without moving; keep a holder in place.','No stat check','This hero'],
  refocus:['Refocus','Once per run, spend both actions to ready one spent ability.','No stat check','This hero’s spent ability'],
  'exact-blow':[null,'Strike with two extra power.','Discipline + 2 + support − armour','Enemy in printed strike range'],
  'shared-charge':[null,'Split this hero’s Arithmetic power between nearby stations.','Arithmetic','Stations within 2 hexes, clear view'],
  'true-shift':[null,'Shift a nearby figure one hex; a friendly figure also gains a shield.','Geometry','Another figure within 2 hexes, clear view'],
  'wide-brace':[null,'Shield up to two nearby heroes or stations for this enemy turn.','Geometry','Up to 2 allies/stations within 2 hexes, clear view'],
  counterturn:[null,'Cancel one enemy’s puzzle disruption when Logic meets its power.','Logic','Enemy within 3 hexes, clear view'],
  'linked-lock':[null,'Protect up to two puzzle groups against enemy changes this turn.','Logic','Up to 2 groups within 2 hexes, clear view'],
  'field-repair':[null,'Split up to twice Science in repairs between nearby friendly targets.','Science × 2','Friendly targets within 2 hexes, clear view'],
  'root-shelter':[null,'Protect up to two stations or puzzle areas from roots this turn.','Science','Up to 2 targets within 2 hexes, clear view'],
  dash:[null,'Make a longer move using this hero’s Speed.','Speed determines reach','Reachable hex'],
  intercept:[null,'Move quickly and mark a visible enemy for stronger strikes.','Speed','Reachable hex and visible enemy within strike range'],
  'stand-together':[null,'Shield this hero and a nearby ally for this enemy turn.','Geometry','Another hero or station within 2 hexes, clear view'],
  'mend-and-mend-again':[null,'Repair a nearby friendly target and add a shield where possible.','Science','Friendly target within 2 hexes, clear view'],
  crosswire:[null,'Activate the solved draft from farther away and protect one puzzle group.','Logic','Control and chosen group within 2 hexes, clear view'],
  'driving-blow':[null,'Strike and optionally push an enemy into an adjacent free hex.','Discipline + support − armour','Enemy in printed strike range'],
  'marked-shot':[null,'Strike one hex farther away and mark the enemy for later strikes.','Discipline + support − armour','Enemy within printed strike range + 1'],
  'second-wind':[null,'Ready one spent ability; optionally step one free adjacent hex.','No stat check','This hero’s spent ability']
};
export function actionGuide(type,profile=null){
  const [label,purpose,stat,target]=guides[type]||[null,'Inspect the production preview before acting.','Shown in preview','Choose a target'];
  return {label:label||CARD_LABELS[type]||type.replaceAll('-',' '),purpose,stat:profile?stat.replace('Discipline',STAT_NAMES[profile.primaryStat]):stat,target:profile?target.replace('printed strike range + 1',`${profile.strikeRange+1} hexes`).replace('printed strike range',`${profile.strikeRange} hexes`):target};
}
export function outputDescription(output,state=null){
  const effect=output.effect||{};
  if(effect.kind==='beam')return `Scatter birds in the ${effect.sector} sector this enemy turn. Enemies in that sector pause and its filled nests do not damage the orchard.`;
  if(effect.kind==='shelter'&&effect.coverage==='puzzle')return `Give heroes and stations under the fitted branches ${effect.amount??2} shield at phase start. Forecast root falls can remove shelter from marked cells.`;
  if(effect.kind==='reserve-benefit')return 'At phase start, unused loads totalling at least 5 give both scales 2 shield; otherwise restore 2 orchard integrity after hazards if the tree survives.';
  if(effect.kind==='repair-stream')return `Restore ${effect.amount??2} orchard integrity after hazards if the tree survives.`;
  return {passage:'Open the marked shortcut on the map.',shelter:`Give the three job stations ${effect.amount} shield against damage each enemy turn.`,roots:`Stop Breaker enemies moving each enemy turn.${state&&!state.blueprint.enemies.some(e=>e.ruleId==='breaker')?' This map has no Breakers.':''}`,storm:`Deal ${STORM_ENEMY_DAMAGE} damage to enemies within ${STORM_RADIUS} hexes of the number station each enemy turn; lose ${STORM_ORCHARD_COST} orchard integrity.`}[effect.kind]||'Inspect the marked mechanism’s effect in the preview.';
}
export function targetMatches(target,id,state=null){const ids=[target.targetId,target.payload?.targetId,...target.payload?.targetIds||[],...target.payload?.allocations?.map(a=>a.targetId)||[]];if(ids.includes(id))return true;return id==='control'&&state?.blueprint.puzzle.lockGroups?.some(group=>ids.includes(group.id));}
export function mechanismReady(state){
  if(!state.puzzleValid)return false;
  const commission=state.blueprint.commission,powered=Object.keys(state.activeOutputs).filter(id=>state.activeOutputs[id]);
  if(commission.poweredIds&&!commission.poweredIds.every(id=>powered.includes(id)))return false;
  const pool=commission.selectableOutputIds||state.blueprint.outputs.map(output=>output.id);
  if(commission.poweredCount!=null&&powered.filter(id=>pool.includes(id)).length<commission.poweredCount)return false;
  if(!['equation-wheels','polyhex'].includes(state.blueprint.puzzle.kind))return true;
  const hooks=getPuzzleHooks(state.blueprint.puzzle.kind);
  return !hooks.commissionCheck||hooks.commissionCheck(state.blueprint.puzzle,state.puzzleActive.content,{selectedOutputIds:state.puzzleActive.selectedOutputIds||[],poweredOutputIds:powered,suppressedShelterCells:state.phaseEffects?.suppressedShelterCells||[],tier:state.blueprint.tier}).ok;
}
export function puzzleGuide(state){
  const puzzle=state.blueprint.puzzle,required=state.blueprint.commission.poweredCount??state.blueprint.commission.poweredIds?.length??1;
  const guides={
    sudoku4:{name:'number lock',title:'Solve the number lock',task:`use 1–4 once in each row, column and 2×2 box, match the cage totals, then choose ${required} effects and Save`,brief:`Use 1–4 once in each row, column and 2×2 box. Cage cells add to the printed total. Choose ${required} circuits and save those choices.`},
    'equation-wheels':{name:'equation network',title:'Turn the linked equations',task:`complete the linked equations, then choose ${required} true circuits and Save`,brief:`Turn the six-sector overlays on the battlefield. Read each fixed top notch: a shared wheel changes every connected equation. Follow the displayed parentheses; division must give a whole number. To finish, keep ${puzzle.minimumTrueTracksForCommission} tracks true and ${required} circuits active. The wind and Crosswind can rewind exposed wheels; inspect their forecast.`},
    balance:{name:'balanced crossing',title:'Balance the pans',task:'balance both pans at the printed target, follow the load restrictions and infer any hidden value',brief:`Place exactly ${puzzle.usedCount} loads on the pans and leave ${puzzle.reserveCount} in reserve. Both pans must total ${puzzle.target}; follow capacity, count and incompatible-pair rules. ${puzzle.hiddenLoadId?'Use the comparison scale to identify the hidden weight, then enter your inferred value. Comparisons spend weighing allowance and keep every hero’s actions. ':''}The crossing is a fixed output. Protect assigned loads against the thief and the forecast hazard.`},
    nonogram5:{name:'nest chart',title:'Read the nest chart',task:'mark every cell filled or empty to match the run clues, then choose two beams and Save',brief:'Read filled runs in order from the row and column clues. Separate runs need an empty cell; unknown is not empty. Complete all 25 cells, then choose two whistle beams and save the choices. Those beams scatter birds in two sectors; defend or protect the uncovered perch. Inspect the enemy and nest forecast.'},
    polyhex:{name:'branch shelter',title:'Fit the branch shelter',task:'place every branch, cover the sockets and leave a connected free approach',brief:`Fit every branch without overlaps or forbidden cells. Cover every socket and leave at least three connected free cells reached from an approach. Rotate in 60° steps${puzzle.reflectionAllowed?' or reflect the branches':''}. Shelter is overhead and never blocks walking. The shelter is a fixed output; protect forecast sockets from root falls before finishing.`}
  };
  return guides[puzzle.kind]||{name:'mechanism',title:'Solve the mechanism',task:'complete the draft and save its effect choices',brief:'Read the printed puzzle rules and inspect the forecast before activation.'};
}
export function missionChecklist(state){
  return [{id:'control',name:`Activate the ${puzzleGuide(state).name}`,ready:mechanismReady(state)},...['number','shape','sustain'].map(id=>{const st=state.blueprint.stations.find(s=>s.id===id),store=state.stationStates[id],held=state.holds[id]||id==='shape'&&state.holds.alcove;return {id,name:st.name,ready:store.charge>=st.capacity&&!!held,detail:`Power ${store.charge}/${st.capacity} · ${held?'holder in place':'needs a holder'}`};})];
}
