import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateDisplacedFourLocksCandidate,DISPLACED_FOUR_LOCKS_PACKET} from '../../expeditions/v2/generation/displaced-four-locks.js';
import {canonicalTopology,canonicalSudokuPattern} from '../../expeditions/v2/generation/bank.js';
import {hashValue} from '../../expeditions/v2/index.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {planOrchardBlueprint} from './orchard-v2-tactical-planner.mjs';
import {certifyCandidate} from './orchard-v2-certification.mjs';

const ARCHETYPES=['river','islands','hedges','terraces'];
const LIMITS={newCandidates:16,seeds:[1,2,3,4],maxPlannerInvocationsPerCandidate:2,maxStatesPerInvocation:8000};
const BATCHES={'1-4':[1,2,3,4],'5-8':[5,6,7,8],'9-12':[9,10,11,12],'13-16':[13,14,15,16],'17-20':[17,18,19,20],'21-24':[21,22,23,24]};
export function displacedBankBatch(batch='1-4'){
  if(typeof batch!=='string'||!Object.hasOwn(BATCHES,batch))throw Error('Unsupported fixed batch identity');
  return {batchId:batch,...LIMITS,seeds:[...BATCHES[batch]]};
}
const identity=r=>JSON.stringify([r.canonical.topology.serialization,r.canonical.puzzle.serialization]);
function validPacket(candidate){
  const b=candidate?.blueprint,p=b?.constructionPacket;
  return candidate?.status==='success'&&candidate.packetId===DISPLACED_FOUR_LOCKS_PACKET&&b?.generatorVersion===2&&b.familyId==='four-locks'&&b.tier===1&&p?.id===DISPLACED_FOUR_LOCKS_PACKET&&p.version===1&&p.topologyPacketId==='passage-displacement-v1'&&p.parameters?.tier===1&&p.parameters.seed===b.parameterSeed&&p.parameters.layoutId===b.layoutId&&p.parameters.maxAttempts===256&&Array.isArray(p.parameters.deltas)&&typeof p.sourceTopologyHash==='string';
}
export function verifyDisplacedBankEvidence({candidate,traces,result,source}){
  const errors=[];
  if(!validPacket(candidate))return {source,eligible:false,errors:['packet-version-or-identity']};
  const bp=candidate.blueprint;
  const sourceIdentity=/^(?:bank-candidates\/)?tier-1-(river|islands|hedges|terraces)-seed-(\d+)$/.exec(source||'');
  if(!sourceIdentity||sourceIdentity[1]!==bp.layoutId||Number(sourceIdentity[2])!==bp.parameterSeed)errors.push('source-request-identity');
  if(result.generatorVersion!==2||result.packetId!==DISPLACED_FOUR_LOCKS_PACKET||result.candidateHash!==hashValue(candidate)||result.sourceTopologyHash!==bp.constructionPacket.sourceTopologyHash)errors.push('evidence-provenance');
  if(result.batchId!==undefined&&(typeof result.batchId!=='string'||!Object.hasOwn(BATCHES,result.batchId)||!displacedBankBatch(result.batchId).seeds.includes(bp.parameterSeed)))errors.push('batch-identity');
  if(!Array.isArray(result.attempts)||result.attempts.length>2||result.requestedLimits?.maxPlannerInvocations!==2||result.requestedLimits?.maxStatesPerInvocation!==8000||result.attempts.some(a=>a.requestedMaxStates!==8000||a.metrics?.maxStates!==8000))errors.push('request-limits');
  const certification=certifyCandidate(candidate,traces);
  if(certification.status!=='success'||hashValue(certification)!==hashValue(result.certification))errors.push('independent-certificate-unproved');
  const canonical={topology:canonicalTopology(bp),puzzle:canonicalSudokuPattern(bp.puzzle)};
  if(hashValue(canonical)!==hashValue(candidate.canonical))errors.push('canonical-fingerprint-mismatch');
  return {source,packetId:DISPLACED_FOUR_LOCKS_PACKET,generatorVersion:2,tier:1,eligible:errors.length===0,errors,certificationErrors:certification.errors||[],layoutId:bp.layoutId,seed:bp.parameterSeed,certificateId:certification.certificateId,contentHash:hashValue(bp),candidateHash:hashValue(candidate),parameters:{...bp.constructionPacket.parameters,sourceTopologyHash:bp.constructionPacket.sourceTopologyHash},canonical};
}
export function reviewDisplacedT1Bank(records,fallback){
  const fallbackValid=!!fallback?.eligible&&fallback.packetId===DISPLACED_FOUR_LOCKS_PACKET&&fallback.generatorVersion===2&&fallback.tier===1&&ARCHETYPES.includes(fallback.layoutId);
  const accepted=[],rejected=[],seen=new Set(),fallbackKey=fallbackValid?identity(fallback):null;
  for(const record of records){
    if(!record.eligible||record.packetId!==DISPLACED_FOUR_LOCKS_PACKET||record.generatorVersion!==2||record.tier!==1){rejected.push({source:record.source,reason:'unverified-or-version',errors:record.errors,certificationErrors:record.certificationErrors});continue;}
    if(!ARCHETYPES.includes(record.layoutId)){rejected.push({source:record.source,reason:'archetype'});continue;}
    const key=identity(record);
    if(key===fallbackKey){rejected.push({source:record.source,reason:'fallback-equivalent'});continue;}
    if(seen.has(key)){rejected.push({source:record.source,reason:'canonical-duplicate'});continue;}
    seen.add(key);accepted.push(record);
  }
  const archetypes=ARCHETYPES.map(layoutId=>{const count=new Set(accepted.filter(r=>r.layoutId===layoutId).map(r=>r.canonical.topology.serialization)).size;return {layoutId,topologies:count,missing:Math.max(0,8-count)};});
  const patterns=new Set(accepted.map(r=>r.canonical.puzzle.serialization)).size,missing=[];
  if(accepted.length<64)missing.push('64-distinct-material-entries');
  if(archetypes.some(a=>a.topologies===0))missing.push('all-four-archetypes');
  if(archetypes.some(a=>a.topologies<8))missing.push('eight-topologies-per-archetype');
  if(patterns<8)missing.push('eight-puzzle-patterns');
  if(!fallbackValid)missing.push('separate-certified-fallback');
  return {complete:missing.length===0,status:missing.length?'incomplete':'complete',accepted,rejected,fallback:fallbackValid?fallback:null,coverage:{materialEntries:accepted.length,missingEntries:Math.max(0,64-accepted.length),archetypes,puzzlePatterns:patterns,missingPuzzlePatterns:Math.max(0,8-patterns),fallbackSeparate:fallbackValid},missing};
}
export function processDisplacedBankCandidate({layoutId,seed,batchId='1-4',store,generate=generateDisplacedFourLocksCandidate,plan=planOrchardBlueprint,onAttempt=()=>{}}){
  const limits=displacedBankBatch(batchId);
  if(!ARCHETYPES.includes(layoutId)||!limits.seeds.includes(seed))throw Error('Outside fixed sixteen-candidate batch');
  if(store.has('result')){
    const candidate=store.read('candidate'),result=store.read('result');
    if(validPacket(candidate)&&(candidate.blueprint.parameterSeed!==seed||candidate.blueprint.layoutId!==layoutId)||result.batchId!==undefined&&result.batchId!==batchId)throw Error('Immutable evidence identity differs from request');
    return {candidate,traces:store.read('traces'),result,skipped:true};
  }
  if(store.has('generation-started')){
    const started=store.read('generation-started');
    if(started.layoutId!==layoutId||started.seed!==seed||started.batchId!==undefined&&started.batchId!==batchId)throw Error('Generation checkpoint identity differs from request');
  }
  if(!store.has('candidate')){
    let candidate;
    if(store.has('generation-started'))candidate={status:'unknown',reasonCode:'interrupted-generation-no-retry'};
    else{store.write('generation-started',{layoutId,seed,batchId,generatorVersion:2});candidate=generate({tier:1,seed,layoutId});}
    store.write('candidate',candidate);
  }
  const candidate=store.read('candidate'),traces=[],attempts=[];
  if(validPacket(candidate)&&(candidate.blueprint.parameterSeed!==seed||candidate.blueprint.layoutId!==layoutId))throw Error('Immutable evidence identity differs from request');
  if(validPacket(candidate)){
    registerOrchardPuzzleHooks();
    for(let index=0;index<2;index++){
      const name=`attempt-${index}`,started=`${name}-started`,cardIds=index?['bushel','dapple','pip']:['tuppence','wicker','pip'],planFamily=index?'alcove-intercept':'direct-guard';
      if(store.has(name)){const old=store.read(name);attempts.push(old.attempt);traces.push(...old.traces);continue;}
      const avoidOutputChoices=index?(traces.length?[traces[0].outputChoice]:[]):[['bridge','shelter']];
      let result;
      if(store.has(started))result={status:'unknown',reasonCode:'interrupted-planner-attempt-no-retry',traces:[],metrics:{maxStates:8000,statesSpent:null}};
      else{store.write(started,{cardIds,planFamily,avoidOutputChoices,maxStates:8000});result=plan({blueprint:candidate.blueprint,teamChoices:[{cardIds}],planFamily,maxStates:8000,avoidOutputChoices});}
      const attempt={cardIds,planFamily,avoidOutputChoices,requestedMaxStates:8000,status:result.status,reasonCode:result.reasonCode,metrics:result.metrics,reportedStateOverage:result.metrics.statesSpent===null?null:Math.max(0,result.metrics.statesSpent-8000),accountingNote:'Known Claude-owned R-07: denied spends inflate statesSpent. Null means interrupted work with unknown spend; never retry that slot.'};
      store.write(name,{attempt,traces:result.traces});attempts.push(attempt);traces.push(...result.traces);onAttempt({layoutId,seed,index,status:result.status,states:result.metrics.statesSpent});
    }
  }
  const certification=certifyCandidate(candidate,traces),result={packetId:DISPLACED_FOUR_LOCKS_PACKET,generatorVersion:2,batchId,sourceTopologyHash:candidate.blueprint?.constructionPacket?.sourceTopologyHash,candidateHash:hashValue(candidate),requestedLimits:{maxPlannerInvocations:2,maxStatesPerInvocation:8000},attempts,certification};
  if(!store.has('traces'))store.write('traces',traces);else if(hashValue(store.read('traces'))!==hashValue(traces))throw Error('Immutable trace checkpoint mismatch');
  store.write('result',result);return {candidate,traces,result,skipped:false};
}
function diskStore(folder){
  fs.mkdirSync(folder,{recursive:true});const file=name=>path.join(folder,name+'.json');
  return {has:name=>fs.existsSync(file(name)),read:name=>JSON.parse(fs.readFileSync(file(name),'utf8')),write:(name,value)=>{
    if(fs.existsSync(file(name)))throw Error('Immutable evidence already exists');const temporary=file(name)+'.partial';
    fs.writeFileSync(temporary,JSON.stringify(value,null,2)+'\n',{flag:'wx'});fs.renameSync(temporary,file(name));
  }};
}
const compact=record=>record?{source:record.source,layoutId:record.layoutId,parameterSeed:record.seed,certificateId:record.certificateId,contentHash:record.contentHash,candidateHash:record.candidateHash,parameters:record.parameters,topologyFingerprint:record.canonical.topology.hash,puzzleFingerprint:record.canonical.puzzle.hash}:null;
export function executeDisplacedBankBatch({batchId,completed=new Set(),isComplete,process}){
  const limits=displacedBankBatch(batchId),requests=ARCHETYPES.flatMap(layoutId=>limits.seeds.map(seed=>({layoutId,seed,source:`bank-candidates/tier-1-${layoutId}-seed-${seed}`})));
  const skipped=requests.filter(r=>completed.has(r.source)).length;let processed=0;
  for(const request of requests){
    if(isComplete())break;
    if(completed.has(request.source))continue;
    process(request);processed++;
  }
  return {processed,skipped,notAttempted:limits.newCandidates-processed-skipped,stopReason:isComplete()?'bank-complete':'batch-limit'};
}
export function runDisplacedT1Bank({batchId='1-4'}={}){
  const limits=displacedBankBatch(batchId);
  const root=fileURLToPath(new URL('../../docs/expeditions/v2/certification/four-locks/displaced-v1/',import.meta.url)),reviews=[];
  const existing=layoutId=>{const folder=path.join(root,`tier-1-${layoutId}-seed-0`),read=name=>JSON.parse(fs.readFileSync(path.join(folder,name+'.json'),'utf8'));return verifyDisplacedBankEvidence({candidate:read('candidate'),traces:read('traces'),result:read('result'),source:path.basename(folder)});};
  const fallback=existing('river');for(const layout of ARCHETYPES.slice(1))reviews.push(existing(layout));
  const completed=new Set();
  for(const layoutId of ARCHETYPES)for(const seed of Object.values(BATCHES).flat()){
    const source=`bank-candidates/tier-1-${layoutId}-seed-${seed}`,folder=path.join(root,source);
    if(fs.existsSync(path.join(folder,'result.json'))){const store=diskStore(folder);reviews.push(verifyDisplacedBankEvidence({source,candidate:store.read('candidate'),traces:store.read('traces'),result:store.read('result')}));completed.add(source);}
  }
  const checkpoint=()=>{
    const review=reviewDisplacedT1Bank([...reviews].sort((a,b)=>a.source.localeCompare(b.source)),fallback),manifest={schemaVersion:1,packetId:DISPLACED_FOUR_LOCKS_PACKET,generatorVersion:2,familyId:'four-locks',tier:1,status:review.status,complete:review.complete,limits,allowedBatches:Object.keys(BATCHES),requirements:{entries:64,archetypes:ARCHETYPES,topologiesPerArchetype:8,puzzlePatterns:8,separateCertifiedFallback:true},coverage:review.coverage,missing:review.missing,referenceFallback:compact(review.fallback),entries:review.accepted.map(compact),rejected:review.rejected,limitations:['Offline review manifest only; no runtime import or migration.','Canonical serializations from independently replayed evidence determine counts; hashes alone do not.','Interrupted/unknown slots are retained and never retried automatically.','Private App/QA-01, device/child acceptance, native advanced yield and R-07 remain pending.']};
    const target=path.join(root,'bank-manifest.json'),temporary=target+'.checkpoint';fs.writeFileSync(temporary,JSON.stringify(manifest,null,2)+'\n');fs.renameSync(temporary,target);return manifest;
  };
  let manifest=checkpoint();
  const outcome=executeDisplacedBankBatch({batchId,completed,isComplete:()=>manifest.complete,process:({layoutId,seed,source})=>{
    const store=diskStore(path.join(root,source));
    const evidence=processDisplacedBankCandidate({layoutId,seed,batchId,store,onAttempt:progress=>console.log(JSON.stringify({phase:'attempt',...progress}))});
    reviews.push(verifyDisplacedBankEvidence({...evidence,source}));manifest=checkpoint();
    console.log(JSON.stringify({phase:'checkpoint',layoutId,seed,skipped:evidence.skipped,materialEntries:manifest.coverage.materialEntries,status:manifest.status}));
  }});
  manifest=checkpoint();console.log(JSON.stringify({phase:'stopped',...outcome,coverage:manifest.coverage,missing:manifest.missing}));return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2);
  if(args.length&&!(args.length===2&&args[0]==='--batch'))throw Error('Usage: assemble-displaced-t1-bank.mjs [--batch 1-4|5-8|9-12|13-16|17-20|21-24]');
  runDisplacedT1Bank({batchId:args[1]??'1-4'});
}
