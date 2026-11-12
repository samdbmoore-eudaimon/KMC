import {validateBlueprint,hashValue,createRun,reduceCommand,stateHash,orchardRosterProfiles,commissionProfile} from '../../expeditions/v2/index.js';
import {solvePuzzle,registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';

const rarityRank={common:0,uncommon:1,rare:2,epic:3,legendary:4};
const targetRank=[0,1,2,3,3];
export function isTargetBandTeam(tier,cardIds,profiles=orchardRosterProfiles()) {
  return cardIds.length===3&&new Set(cardIds).size===3&&cardIds.every(id=>profiles[id]&&rarityRank[profiles[id].rarity]<=targetRank[tier-1]);
}
export function verifyTrace(blueprint,trace) {
  registerOrchardPuzzleHooks();
  const errors=[];
  if(!trace?.initialRun||!Array.isArray(trace.initialRun.cardIds)||!Array.isArray(trace.commands))return {ok:false,errors:['trace-shape']};
  if(hashValue(trace.initialRun.blueprint)!==hashValue(blueprint))errors.push('trace-blueprint-mismatch');
  const initial=trace.initialRun;
  const roster=orchardRosterProfiles();
  if(initial.profiles&&initial.cardIds.some(id=>hashValue(initial.profiles[id])!==hashValue(roster[id])))errors.push('non-production-card-profile');
  let state;
  try{state=createRun({blueprint:initial.blueprint,cardIds:initial.cardIds,runId:initial.runId,deploymentAssignment:initial.deploymentAssignment});}catch{return {ok:false,errors:[...errors,'initial-run-invalid']};}
  if(initial.initialStateHash!==state.initialRun.initialStateHash)errors.push('initial-hash-mismatch');
  const hashes=[];let winningShape=null;
  for(let i=0;i<trace.commands.length;i++) {
    const next=reduceCommand(state,trace.commands[i]);
    if(!next.result.legal){errors.push(`command-${i}:${next.result.reasonCode}`);break;}
    if(trace.commands[i].type==='end-round'&&next.state.status==='won'){
      const alcove=state.holds.alcove,holder=state.heroes.find(h=>h.id===alcove?.heroId);
      winningShape=state.preparedAlcove&&alcove&&!state.holds.shape&&holder?.holding==='alcove'?{endpoint:'alcove',heroId:holder.id,holdId:alcove.holdId}:{endpoint:'shape',heroId:state.holds.shape?.heroId,holdId:state.holds.shape?.holdId};
    }
    state=next.state;hashes.push(stateHash(state));
  }
  const expected=trace.perCommandHashes||trace.hashes;
  if(!Array.isArray(expected)||expected.length!==hashes.length||expected.some((h,i)=>h!==hashes[i]))errors.push('command-hashes-mismatch');
  if(stateHash(state)!==(trace.finalStateHash||trace.finalHash))errors.push('final-hash-mismatch');
  if(state.status!=='won'||state.round>blueprint.deadline)errors.push('deadline-victory-missing');
  if(!trace.commands.some(c=>c.type==='operate'))errors.push('paid-operate-missing');
  const cardIds=state.heroes.map(h=>h.id);
  if(trace.cardIds&&hashValue([...trace.cardIds].sort())!==hashValue([...cardIds].sort()))errors.push('trace-party-mismatch');
  const alcove=winningShape?.endpoint==='alcove';
  return {ok:errors.length===0,errors,cardIds,finalHash:stateHash(state),round:state.round,outputChoice:state.puzzleActive.selectedOutputIds,alcove,winningShape,hashes};
}
export function lowerBandProof(tier,profiles=orchardRosterProfiles()) {
  const rows=[];
  for(const job of ['number','shape','sustain']) {
    const requirement=commissionProfile(tier,job),below=Object.values(profiles).filter(p=>rarityRank[p.rarity]<targetRank[tier-1]);
    rows.push({job,requirement,eligibleBelow:below.filter(p=>requirement.every((n,i)=>p.stats[i]>=n)).map(p=>p.cardId)});
  }
  const cards=Object.values(profiles),exclusions=[];
  const rank=targetRank[tier-1];
  const rules=tier===1?[]:[
    {id:'all-below-target-band',matches:squad=>squad.every(p=>rarityRank[p.rarity]<rank)},
    {id:'one-legendary-two-commons',matches:squad=>squad.filter(p=>p.rarity==='legendary').length===1&&squad.filter(p=>p.rarity==='common').length===2}
  ];
  const assignments=squad=>squad.flatMap((a,i)=>squad.filter((_,j)=>j!==i).map(b=>[a,b,squad.find(c=>c!==a&&c!==b)]));
  for(const rule of rules){
    let examined=0;const feasible=[];
    for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++)for(let k=j+1;k<cards.length;k++){
      const squad=[cards[i],cards[j],cards[k]];if(!rule.matches(squad))continue;examined++;
      if(assignments(squad).some(ordered=>['number','shape','sustain'].every((job,index)=>commissionProfile(tier,job).every((n,stat)=>ordered[index].stats[stat]>=n))))feasible.push(squad.map(p=>p.cardId));
    }
    exclusions.push({id:rule.id,examined,feasible,excluded:feasible.length===0});
  }
  return {method:'exact-printed-stat-enumeration',rows,...(tier>1?{exclusions}:{})};
}
export function certifyCandidate(candidate,traces) {
  const errors=[],blueprint=candidate?.blueprint;
  if(candidate?.status!=='success'||!blueprint)return {status:'failure',errors:['candidate-missing']};
  if(blueprint.familyId!=='four-locks')return {status:'unknown',errors:['family-certification-criteria-pending']};
  const schema=validateBlueprint(blueprint);if(!schema.ok)errors.push('blueprint-schema');
  const maths=solvePuzzle(blueprint.puzzle,{limit:2});
  if(maths.status!=='success'||!maths.exhaustive||maths.solutions.length!==1)errors.push('unique-puzzle-unproven');
  const checks=traces.map(trace=>verifyTrace(blueprint,trace));
  checks.forEach((check,i)=>{if(!check.ok)errors.push(...check.errors.map(e=>`trace-${i}:${e}`));});
  const target=checks.filter(c=>c.ok&&isTargetBandTeam(blueprint.tier,c.cardIds));
  if(new Set(target.map(c=>[...c.cardIds].sort().join('|'))).size<2)errors.push('two-distinct-target-teams-missing');
  if(new Set(target.map(c=>[...c.outputChoice].sort().join('|'))).size<2)errors.push('different-target-output-plans-missing');
  if(!checks.some(c=>c.ok&&c.alcove))errors.push('physical-alcove-proof-missing');
  const lowerBand=lowerBandProof(blueprint.tier);
  if(lowerBand.exclusions?.some(proof=>!proof.excluded))errors.push('lower-band-exclusion-failed');
  if(errors.length)return {status:'unknown',errors,checks,lowerBand};
  const evidence={blueprintHash:hashValue(blueprint),structuralFingerprint:blueprint.structuralFingerprint,puzzleFingerprint:candidate.puzzleFingerprint,traceHashes:checks.map(c=>c.finalHash),lowerBand};
  return {status:'success',certificateId:`orchard-v2-${hashValue(evidence)}`,evidence,checks};
}
