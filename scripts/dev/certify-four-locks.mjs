import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateFourLocksCandidate} from '../../expeditions/v2/generation/four-locks.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {planOrchardBlueprint,feasibleJobAssignments} from './orchard-v2-tactical-planner.mjs';
import {certifyCandidate,verifyTrace,isTargetBandTeam} from './orchard-v2-certification.mjs';
import {orchardRosterProfiles,hashValue} from '../../expeditions/v2/index.js';
import {canonicalTopology,canonicalSudokuPattern} from '../../expeditions/v2/generation/bank.js';

const args=process.argv.slice(2),value=(name,fallback)=>{const i=args.indexOf(`--${name}`);return i<0?fallback:args[i+1];};
const tier=Number(value('tier',1)),seed=Number(value('seed',1)),layoutId=value('layout','river'),maxStates=Number(value('max-states',12000)),reference=args.includes('--reference');
const evidenceId=value('evidence-id','');
const sourceEvidence=value('source-evidence','');
if(sourceEvidence&&!/^tier-1-terraces-seed-1-[a-z0-9-]+$/.test(sourceEvidence))throw Error('Invalid source evidence ID');
if(sourceEvidence&&(tier!==1||seed!==1||layoutId!=='terraces'||maxStates>8000||!value('direct-team',null)||!value('second-team',null)))throw Error('Terrace follow-up requires two explicit squads and at most8000 states');
if(evidenceId&&!/^[a-z0-9-]{1,64}$/.test(evidenceId))throw Error('Invalid evidence ID');
if(!Number.isInteger(tier)||tier<1||tier>5||!Number.isInteger(seed)||seed<0||seed>0xffffffff||!Number.isInteger(maxStates)||maxStates<1||maxStates>250000)throw Error('Invalid bounded certification request');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),out=path.join(root,'docs/expeditions/v2/certification/four-locks',`tier-${tier}-${layoutId}-seed-${seed}${reference?'-reference':''}${evidenceId?`-${evidenceId}`:''}`);
if(!/^[a-z-]+$/.test(layoutId))throw Error('Invalid layout ID');
if(fs.existsSync(path.join(out,'result.json')))throw Error('Evidence already exists; use a new --evidence-id to preserve previous results');
fs.mkdirSync(out,{recursive:true});registerOrchardPuzzleHooks();
const sourceFolder=sourceEvidence?path.join(root,'docs/expeditions/v2/certification/four-locks',sourceEvidence):null;
const candidate=sourceFolder?JSON.parse(fs.readFileSync(path.join(sourceFolder,'candidate.json'),'utf8')):reference&&tier===1&&seed===1&&layoutId==='river'?JSON.parse(fs.readFileSync(path.join(root,'docs/expeditions/v2/references/four-locks/candidate.json'),'utf8')):generateFourLocksCandidate({tier,seed,layoutId,reference});
let sourceTraces=[],sourceProof=null;
if(sourceFolder){
  const bp=candidate.blueprint;
  if(candidate.status!=='success'||bp?.tier!==tier||bp.parameterSeed!==seed||bp.layoutId!==layoutId)throw Error('Source candidate identity mismatch');
  sourceTraces=JSON.parse(fs.readFileSync(path.join(sourceFolder,'traces.json'),'utf8'));
  if(!sourceTraces.length||sourceTraces.some(t=>hashValue(t.initialRun.blueprint)!==hashValue(bp)||!verifyTrace(bp,t).ok)||!sourceTraces.some(t=>verifyTrace(bp,t).alcove))throw Error('Source lacks matching verified alcove proof');
  sourceProof={directory:sourceEvidence,candidateHash:hashValue(candidate),blueprintHash:hashValue(bp),inheritedTraceHashes:sourceTraces.map(t=>t.finalStateHash||t.finalHash)};
}
const targetTeams={1:[['tuppence','furrow','sorrel'],['bushel','dapple','pip']],2:[['cornix','kernel','beeswax'],['cornix','kernel','millrace']],3:[['barrow','cobweb','amberly'],['barrow','driftwood','gable']],4:[['barrow','cobweb','harvestmoon'],['warden','longshadow','cascade']],5:[['warden','gossamer','harvestmoon'],['ninebark','warden','longshadow']]};
const alcoveTeams={1:['bushel','dapple','pip'],2:['cornix','warden','beeswax'],3:['barrow','warden','amberly'],4:['warden','longshadow','cascade'],5:['ninebark','warden','longshadow']};
const secondPlanFamily=sourceFolder?'direct-guard':tier===1||tier>=4?'alcove-intercept':'direct-guard';
function selectedTeam(option,fallback,planFamily,targetBand){
  const supplied=value(option,null),cardIds=supplied===null?fallback:supplied.split(',');
  if(supplied!==null){
    const profiles=orchardRosterProfiles();
    if(cardIds.length!==3||new Set(cardIds).size!==3||cardIds.some(id=>!profiles[id])||(targetBand&&!isTargetBandTeam(tier,cardIds)))throw Error(`Invalid production target squad: --${option}`);
    if(candidate.status==='success'&&!feasibleJobAssignments(candidate.blueprint,cardIds,planFamily).length)throw Error(`Stat-infeasible squad: --${option}`);
  }
  return cardIds;
}
const directTeam=selectedTeam('direct-team',targetTeams[tier][0],'direct-guard',true),secondTeam=selectedTeam('second-team',targetTeams[tier][1],secondPlanFamily,true),alcoveTeam=selectedTeam('alcove-team',alcoveTeams[tier],'alcove-intercept',tier>=4);
if(sourceFolder){
  const key=ids=>[...ids].sort().join('|'),excluded=new Set([key(['tuppence','furrow','sorrel']),...sourceTraces.map(t=>key(t.cardIds||t.initialRun.cardIds))]);
  if(key(directTeam)===key(secondTeam)||[directTeam,secondTeam].some(ids=>excluded.has(key(ids))))throw Error('Follow-up requires distinct new Common direct squads');
}
const traces=[...sourceTraces],attempts=[];
if(candidate.status==='success'){
  if(reference&&tier===1&&seed===1&&layoutId==='river'){
    const old=JSON.parse(fs.readFileSync(path.join(root,'docs/expeditions/v2/references/four-locks/tuppence-furrow-sorrel.json'),'utf8'));
    const trace={...old.record,cardIds:old.record.initialRun.cardIds,perCommandHashes:old.hashes.slice(1),planFamily:'direct-guard'};
    if(verifyTrace(candidate.blueprint,trace).ok)traces.push(trace);
  }
  const plan=(cardIds,planFamily,avoidOutputChoices=[])=>{
    console.log(JSON.stringify({phase:'planning',tier,seed,cardIds,planFamily,maxStates}));
    const result=planOrchardBlueprint({blueprint:candidate.blueprint,teamChoices:[{cardIds}],planFamily,maxStates,avoidOutputChoices});
    attempts.push({cardIds,planFamily,avoidOutputChoices,requestedMaxStates:maxStates,status:result.status,reasonCode:result.reasonCode,metrics:result.metrics,reportedStateOverage:Math.max(0,result.metrics.statesSpent-maxStates),accountingNote:'Known R-07: Budget.spend increments used for denied spends. Reported statesSpent may exceed the requested cap; it is not an accepted-reducer-call count. Planner remains unchanged.'});traces.push(...result.traces);
    console.log(JSON.stringify({phase:'result',cardIds,planFamily,status:result.status,reasonCode:result.reasonCode,states:result.metrics.statesSpent}));
  };
  if(sourceFolder){
    const avoid=sourceTraces.map(t=>verifyTrace(candidate.blueprint,t).outputChoice);
    plan(directTeam,'direct-guard',avoid);
    if(certifyCandidate(candidate,traces).status!=='success')plan(secondTeam,'direct-guard',avoid);
    if(hashValue(candidate)!==sourceProof.candidateHash)throw Error('Reused candidate changed');
  }else{
    if(!traces.length)plan(directTeam,'direct-guard',tier===1?[['bridge','shelter']]:[]);
    const firstChoice=traces[0]?.outputChoice||traces[0]?.initialRun?.blueprint?.puzzle?.defaultOutputIds;
    plan(secondTeam,secondPlanFamily,firstChoice?[firstChoice]:[]);
    if(!traces.some(t=>t.planFamily==='alcove-intercept'))plan(alcoveTeam,'alcove-intercept');
  }
}
const certification=certifyCandidate(candidate,traces);
const canonicalFingerprints=candidate.status==='success'?{topology:canonicalTopology(candidate.blueprint),puzzle:canonicalSudokuPattern(candidate.blueprint.puzzle)}:null;
fs.writeFileSync(path.join(out,'candidate.json'),JSON.stringify(candidate,null,2)+'\n');
fs.writeFileSync(path.join(out,'traces.json'),JSON.stringify(traces,null,2)+'\n');
fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({request:{tier,seed,layoutId,reference,evidenceId},sourceProof,candidateStatus:candidate.status,canonicalFingerprints,requestedLimits:{maxStatesPerInvocation:maxStates,maxPlannerInvocations:sourceFolder?2:3},teamSelection:{directTeam,secondTeam,secondPlanFamily,alcoveTeam},plannerAccountingIssue:'R-07, Claude-owned: denied spends inflate statesSpent. Unknown does not establish impossibility.',attempts,certification},null,2)+'\n');
console.log(JSON.stringify({status:certification.status,certificateId:certification.certificateId,errors:certification.errors,evidencePath:path.relative(root,out)},null,2));
process.exitCode=certification.status==='success'?0:2;
