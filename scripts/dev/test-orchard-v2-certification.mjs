import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyTrace,certifyCandidate,isTargetBandTeam,lowerBandProof} from './orchard-v2-certification.mjs';
import {createRun,reduceCommand,exportRunRecord,stateHash,forecastEnemyPhase,hashValue} from '../../expeditions/v2/index.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {orchardGenerationAvailability} from '../../expeditions/v2/generation/index.js';
import {canonicalTopology,canonicalSudokuPattern} from '../../expeditions/v2/generation/bank.js';
const read=name=>JSON.parse(fs.readFileSync(new URL(`../../docs/expeditions/v2/references/four-locks/${name}.json`,import.meta.url),'utf8'));
const candidate=read('candidate'),win=read('tuppence-furrow-sorrel'),loss=read('bushel-furrow-pip');
const asTrace=e=>({...e.record,perCommandHashes:e.hashes.slice(1),cardIds:e.record.initialRun.cardIds});

test('terrace direct follow-up reuses the exact original candidate and alcove trace within two caps',()=>{
  const readBatch=(id,file)=>JSON.parse(fs.readFileSync(new URL(`../../docs/expeditions/v2/certification/four-locks/tier-1-terraces-seed-1-${id}/${file}.json`,import.meta.url),'utf8'));
  const original=readBatch('archetypes-20261002','candidate'),inherited=readBatch('archetypes-20261002','traces'),candidate=readBatch('reuse-20261002','candidate'),traces=readBatch('reuse-20261002','traces'),saved=readBatch('reuse-20261002','result');
  assert.deepEqual(candidate,original);assert.deepEqual(traces[0],inherited[0]);assert.equal(saved.sourceProof.candidateHash,hashValue(original));assert.equal(saved.sourceProof.blueprintHash,hashValue(original.blueprint));assert.deepEqual(saved.sourceProof.inheritedTraceHashes,inherited.map(t=>t.finalStateHash));
  assert.deepEqual(saved.requestedLimits,{maxStatesPerInvocation:8000,maxPlannerInvocations:2});assert.equal(saved.attempts.length,2);
  assert.deepEqual(saved.attempts.map(a=>a.cardIds),[['tuppence','furrow','pip'],['tuppence','wicker','pip']]);
  for(const attempt of saved.attempts){assert.equal(attempt.planFamily,'direct-guard');assert.equal(attempt.requestedMaxStates,8000);assert.equal(attempt.metrics.maxStates,8000);assert.deepEqual(attempt.avoidOutputChoices,[['bridge','shelter']]);assert.equal(attempt.reportedStateOverage,Math.max(0,attempt.metrics.statesSpent-8000));assert.ok(isTargetBandTeam(1,attempt.cardIds));}
  assert.equal(saved.attempts[0].status,'unknown');assert.equal(saved.attempts[0].reasonCode,'budget-exhausted');assert.equal(saved.attempts[1].status,'success');
  for(const trace of traces){assert.equal(hashValue(trace.initialRun.blueprint),saved.sourceProof.blueprintHash);assert.equal(verifyTrace(candidate.blueprint,trace).ok,true);}
  const checked=certifyCandidate(candidate,traces);assert.deepEqual(checked,saved.certification);assert.equal(checked.status,'success');assert.equal(checked.certificateId,'orchard-v2-2bba81eed75cf92d');
  assert.ok(checked.checks[0].alcove);assert.equal(checked.checks[1].alcove,false);assert.notDeepEqual(checked.checks[0].outputChoice,checked.checks[1].outputChoice);
  const altered=structuredClone(traces);altered[1].initialRun.blueprint.tiles[0].terrain='water';assert.equal(certifyCandidate(candidate,altered).status,'unknown');
});

test('non-river T1 batch retains actual different grammars and honest terrace missing proof',()=>{
  const reference=JSON.parse(fs.readFileSync(new URL('../../docs/expeditions/v2/certification/four-locks/tier-1-river-seed-1/candidate.json',import.meta.url),'utf8'));
  const topologies=new Set([canonicalTopology(reference.blueprint).serialization]),pattern=canonicalSudokuPattern(reference.blueprint.puzzle).serialization;
  for(const [layoutId,status,id]of [['islands','success','orchard-v2-2343002d9bd9767a'],['hedges','success','orchard-v2-7a4ad8d2230e72c5'],['terraces','unknown',undefined]]){
    const readBatch=file=>JSON.parse(fs.readFileSync(new URL(`../../docs/expeditions/v2/certification/four-locks/tier-1-${layoutId}-seed-1-archetypes-20261002/${file}.json`,import.meta.url),'utf8'));
    const candidate=readBatch('candidate'),traces=readBatch('traces'),saved=readBatch('result'),bp=candidate.blueprint;
    assert.equal(bp.layoutId,layoutId);assert.equal(bp.tier,1);assert.equal(bp.parameterSeed,1);assert.deepEqual(saved.requestedLimits,{maxStatesPerInvocation:8000,maxPlannerInvocations:3});assert.equal(saved.attempts.length,2);
    assert.deepEqual(saved.canonicalFingerprints,{topology:canonicalTopology(bp),puzzle:canonicalSudokuPattern(bp.puzzle)});topologies.add(saved.canonicalFingerprints.topology.serialization);assert.equal(saved.canonicalFingerprints.puzzle.serialization,pattern);
    const waterColumns=[...new Set(bp.tiles.filter(t=>t.terrain==='water').map(t=>t.q+Math.floor(t.r/2)))].sort();
    if(layoutId==='islands')assert.deepEqual(waterColumns,[4,7]);else{assert.deepEqual(waterColumns,[]);assert.ok(bp.tiles.some(t=>t.terrain==='gate'&&t.passageOutputId));}
    if(layoutId==='hedges')for(const c of [4,8])for(const r of [2,4,6])assert.equal(bp.tiles.find(t=>t.q+Math.floor(t.r/2)===c&&t.r===r).terrain,'hedge');
    if(layoutId==='terraces')for(const r of [3,5])for(const c of [2,4,5,6,7,9])assert.equal(bp.tiles.find(t=>t.q+Math.floor(t.r/2)===c&&t.r===r).terrain,'hedge');
    for(const attempt of saved.attempts){assert.equal(attempt.requestedMaxStates,8000);assert.equal(attempt.metrics.maxStates,8000);assert.equal(attempt.reportedStateOverage,Math.max(0,attempt.metrics.statesSpent-8000));}
    for(const trace of traces)assert.equal(verifyTrace(bp,trace).ok,true);
    const checked=certifyCandidate(candidate,traces);assert.deepEqual(checked,saved.certification);assert.equal(checked.status,status);assert.equal(checked.certificateId,id);
    assert.ok(checked.checks.some(c=>c.alcove&&c.winningShape.holdId));assert.ok(checked.checks.every(c=>isTargetBandTeam(1,c.cardIds)));
    if(status==='success'){assert.equal(traces.length,2);assert.notDeepEqual(checked.checks[0].outputChoice,checked.checks[1].outputChoice);}
    else{assert.equal(traces.length,1);assert.equal(saved.attempts[0].reasonCode,'budget-exhausted');assert.deepEqual(checked.errors,['two-distinct-target-teams-missing','different-target-output-plans-missing']);}
    assert.equal(bp.certificateId,null);assert.equal(orchardGenerationAvailability('four-locks',1),true);
  }
  assert.equal(topologies.size,4,'Actual river/islands/hedges/terraces tile-role structures must differ');
});

test('bounded T4 follow-up certifies seed0 while seed29 remains unknown with explicit production squads',()=>{
  for(const [seed,status,certificateId]of [[0,'success','orchard-v2-82446cb7d436b578'],[29,'unknown',undefined]]){
    const readBatch=file=>JSON.parse(fs.readFileSync(new URL(`../../docs/expeditions/v2/certification/four-locks/tier-4-river-seed-${seed}-followup-20261002/${file}.json`,import.meta.url),'utf8'));
    const candidate=readBatch('candidate'),traces=readBatch('traces'),saved=readBatch('result');
    assert.deepEqual(saved.requestedLimits,{maxStatesPerInvocation:8000,maxPlannerInvocations:3});assert.equal(saved.attempts.length,seed===0?2:3);
    assert.deepEqual(saved.teamSelection,{directTeam:['warden','gossamer','harvestmoon'],secondTeam:['ninebark','warden','longshadow'],secondPlanFamily:'alcove-intercept',alcoveTeam:['barrow','harvestmoon','longshadow']});
    for(const attempt of saved.attempts){assert.ok(isTargetBandTeam(4,attempt.cardIds));assert.equal(attempt.requestedMaxStates,8000);assert.equal(attempt.metrics.maxStates,8000);assert.equal(attempt.reportedStateOverage,Math.max(0,attempt.metrics.statesSpent-8000));}
    for(const trace of traces)assert.equal(verifyTrace(candidate.blueprint,trace).ok,true);
    const actual=certifyCandidate(candidate,traces);assert.deepEqual(actual,saved.certification);assert.equal(actual.status,status);assert.equal(actual.certificateId,certificateId);
    const lower=actual.evidence?.lowerBand||actual.lowerBand;assert.ok(lower.exclusions.every(e=>e.excluded&&e.feasible.length===0));
    if(seed===0){assert.equal(traces.length,2);assert.ok(actual.checks.every(c=>isTargetBandTeam(4,c.cardIds)));assert.ok(actual.checks.some(c=>c.alcove&&c.winningShape.holdId));assert.notDeepEqual(actual.checks[0].outputChoice,actual.checks[1].outputChoice);}
    else{assert.equal(traces.length,1);assert.ok(saved.attempts.slice(1).every(a=>a.status==='unknown'&&a.reasonCode==='budget-exhausted'));assert.deepEqual(actual.errors,['two-distinct-target-teams-missing','different-target-output-plans-missing','physical-alcove-proof-missing']);}
    assert.equal(candidate.blueprint.certificateId,null);assert.equal(orchardGenerationAvailability('four-locks',4),false);
  }
});

test('bounded T2–5 batch independently replays every saved trace without exposing tiers',()=>{
  for(const [tier,seed,status,certificateId]of [[2,1,'success','orchard-v2-0ffb784b641580f8'],[3,2,'success','orchard-v2-892dcb83a818e5e4'],[4,1,'unknown',undefined],[5,29,'success','orchard-v2-b839fe5ed87db2b9']]){
    const readBatch=file=>JSON.parse(fs.readFileSync(new URL(`../../docs/expeditions/v2/certification/four-locks/tier-${tier}-river-seed-${seed}-bounded-20261002/${file}.json`,import.meta.url),'utf8'));
    const candidate=readBatch('candidate'),traces=readBatch('traces'),saved=readBatch('result');
    assert.equal(saved.requestedLimits.maxStatesPerInvocation,8000);assert.equal(saved.requestedLimits.maxPlannerInvocations,3);assert.ok(saved.attempts.length<=3);
    assert.ok(saved.attempts.every(a=>a.requestedMaxStates===8000&&a.metrics.maxStates===8000&&a.reportedStateOverage===Math.max(0,a.metrics.statesSpent-8000)));
    assert.ok(traces.length>0);for(const trace of traces)assert.equal(verifyTrace(candidate.blueprint,trace).ok,true);
    const actual=certifyCandidate(candidate,traces);assert.deepEqual(actual,saved.certification);assert.equal(actual.status,status);assert.equal(actual.certificateId,certificateId);
    assert.equal(candidate.blueprint.certificateId,null);assert.equal(candidate.certified,false);assert.equal(orchardGenerationAvailability('four-locks',tier),false);
    if(status==='success'){
      const target=actual.checks.filter(c=>isTargetBandTeam(tier,c.cardIds));assert.ok(new Set(target.map(c=>[...c.cardIds].sort().join('|'))).size>=2);assert.ok(new Set(target.map(c=>[...c.outputChoice].sort().join('|'))).size>=2);
      assert.ok(actual.checks.some(c=>c.alcove&&c.winningShape.endpoint==='alcove'&&c.winningShape.holdId));
    }else{
      assert.equal(traces.length,1);assert.ok(saved.attempts.slice(1).every(a=>a.status==='unknown'&&a.reasonCode==='budget-exhausted'));
      assert.deepEqual(actual.errors,['two-distinct-target-teams-missing','different-target-output-plans-missing','physical-alcove-proof-missing']);
    }
  }
  assert.equal(orchardGenerationAvailability('four-locks',1),true);
});
test('independent production replay accepts recorded win and each command hash',()=>{
  const result=verifyTrace(candidate.blueprint,asTrace(win));assert.equal(result.ok,true);assert.equal(result.finalHash,'bea753c9ffe4cf36');assert.equal(result.round,4);assert.equal(result.alcove,false);
});
test('deadline loss and hash or blueprint tampering cannot pass certification',()=>{
  assert.ok(verifyTrace(candidate.blueprint,asTrace(loss)).errors.includes('deadline-victory-missing'));
  const altered=asTrace(win);altered.perCommandHashes[0]='tampered';assert.ok(verifyTrace(candidate.blueprint,altered).errors.includes('command-hashes-mismatch'));
  const blueprint=structuredClone(candidate.blueprint);blueprint.seed+=1;assert.ok(verifyTrace(blueprint,asTrace(win)).errors.includes('trace-blueprint-mismatch'));
});
test('one winning trace or duplicated proof cannot create a certificate',()=>{
  for(const traces of [[asTrace(win)],[asTrace(win),asTrace(win)]]){
    const result=certifyCandidate(candidate,traces);assert.equal(result.status,'unknown');assert.equal(result.certificateId,undefined);
    for(const error of ['two-distinct-target-teams-missing','different-target-output-plans-missing','physical-alcove-proof-missing'])assert.ok(result.errors.includes(error));
  }
});
test('higher-rarity squads do not count as low-tier target-band proofs',()=>{
  assert.equal(isTargetBandTeam(1,['tuppence','furrow','sorrel']),true);
  assert.equal(isTargetBandTeam(1,['cornix','furrow','sorrel']),false);
  assert.equal(isTargetBandTeam(1,['tuppence','tuppence','sorrel']),false);
  assert.equal(isTargetBandTeam(2,['cornix','kernel','beeswax']),true);
});
test('invented stronger profiles cannot certify a named production card',()=>{
  const trace=structuredClone(asTrace(win));trace.initialRun.profiles.tuppence.stats[0]=99;
  assert.ok(verifyTrace(candidate.blueprint,trace).errors.includes('non-production-card-profile'));
});
test('stronger tiers exclude lower-band triples and one Legendary with two Commons by exact assignment enumeration',()=>{
  for(const tier of [2,3,4,5]){
    const proof=lowerBandProof(tier);assert.equal(proof.exclusions.length,2);
    assert.ok(proof.exclusions.every(row=>row.examined>0&&row.excluded&&row.feasible.length===0));
  }
});
test('an earlier legal alcove Hold followed by a direct winning Hold is not an alcove proof',()=>{
  registerOrchardPuzzleHooks();
  const blueprint=structuredClone(candidate.blueprint),anchors={control:'0,3',number:'0,2',shape:'0,5',sustain:'-2,8',alcove:'1,5'};
  blueprint.stations.forEach(st=>st.hex=anchors[st.id]);blueprint.puzzle.controlHex=anchors.control;
  blueprint.puzzle.lockGroups.forEach(group=>group.anchor=anchors.control);
  blueprint.deployment=['0,2','0,5','-2,8'];
  let state=createRun({blueprint,cardIds:['tuppence','warden','sorrel'],runId:'alcove-provenance-test-fixture'}),hashes=[];
  const dispatch=(type,heroId,payload={})=>{const next=reduceCommand(state,{type,heroId,payload,expectedRevision:state.revision});assert.equal(next.result.legal,true,next.result.reasonCode);state=next.state;hashes.push(stateHash(state));};
  const end=()=>dispatch('end-round',null,{forecastRevision:forecastEnemyPhase(state).revision});
  dispatch('request-hint',null,{puzzleId:blueprint.puzzle.id,stage:3});
  dispatch('operate','tuppence',{draftRevision:state.puzzleDraft.revision,outputIds:state.puzzleDraft.selectedOutputIds,lockGroupId:null});
  dispatch('calibrate','tuppence',{targetId:'number'});
  dispatch('prepare-alcove','warden');dispatch('calibrate','warden',{targetId:'shape'});
  dispatch('calibrate','sorrel',{targetId:'sustain'});dispatch('calibrate','sorrel',{targetId:'sustain'});end();
  dispatch('hold','warden',{targetId:'alcove'});dispatch('hold','sorrel',{targetId:'sustain'});end();
  dispatch('hold','warden',{targetId:'shape'});dispatch('hold','tuppence',{targetId:'number'});dispatch('hold','sorrel',{targetId:'sustain'});end();
  assert.equal(state.status,'won');
  const trace={...exportRunRecord(state),perCommandHashes:hashes,planFamily:'alcove-intercept'},checked=verifyTrace(blueprint,trace);
  assert.equal(checked.ok,true);assert.equal(checked.alcove,false);assert.equal(checked.winningShape.endpoint,'shape');
});
test('the certified production alcove trace holds the alcove in its winning phase',()=>{
  const folder=new URL('../../docs/expeditions/v2/certification/four-locks/tier-1-river-seed-1/',import.meta.url);
  const current=JSON.parse(fs.readFileSync(new URL('candidate.json',folder))),traces=JSON.parse(fs.readFileSync(new URL('traces.json',folder)));
  const result=certifyCandidate(current,traces);assert.equal(result.status,'success');assert.equal(result.certificateId,'orchard-v2-7bb0c308bb8ec44f');
  assert.deepEqual(result.checks.map(c=>c.winningShape.endpoint),['shape','alcove']);assert.equal(result.checks[1].winningShape.heroId,'dapple');
});
