import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {orchardGenerationStatus,generateOrchardBlueprint,generateOrchardFallbackBlueprint,generateLegacyReferenceBlueprint,orchardGenerationAvailability} from './index.js';
import {RUNTIME_BANK} from './runtime-bank.js';
import {crossingExitViolations} from './crossing-invariants.js';
import {validateBlueprint,createRun,reduceCommand} from '../index.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';
import {generateFourLocksCandidate} from './four-locks.js';
const evidence=JSON.parse(fs.readFileSync(new URL('../../../docs/expeditions/v2/certification/four-locks/tier-1-river-seed-1/traces.json',import.meta.url),'utf8'));
test('legacy reference regenerates exact content with distinct requested and parameter seeds',()=>{
  const bp=generateLegacyReferenceBlueprint({seed:4982});bp.repeat=true;
  assert.equal(bp.parameterSeed,1);assert.equal(bp.seed,4982);assert.equal(bp.requestedSeed,4982);assert.equal(bp.referenceFallback,true);assert.equal(bp.legacy,true);
  assert.equal(bp.certificateId,'orchard-v2-7bb0c308bb8ec44f');assert.equal(validateBlueprint(bp).ok,true);
  assert.deepEqual(bp.tiles,evidence[0].initialRun.blueprint.tiles);assert.deepEqual(bp.puzzle,evidence[0].initialRun.blueprint.puzzle);
});
test('both certified plans still execute when runtime records a different requested seed',()=>{
  registerOrchardPuzzleHooks();
  for(const trace of evidence){
    let state=createRun({...trace.initialRun,blueprint:generateLegacyReferenceBlueprint({seed:0xffffffff})});
    for(const command of trace.commands){const next=reduceCommand(state,command);assert.equal(next.result.legal,true,next.result.reasonCode);state=next.state;}
    assert.equal(state.status,'won');assert.ok(state.round<=5);
  }
});
test('runtime selects certified bank entries with no unusable crossing, honours recent entries and reports repeats',()=>{
  assert.equal(RUNTIME_BANK.length,64);
  const first=generateOrchardBlueprint({familyId:'four-locks',tier:1,seed:130});
  assert.equal(first.bankIndex,130%64);assert.equal(first.requestedSeed,130);assert.equal(first.referenceFallback,false);assert.equal(first.repeat,false);assert.equal(validateBlueprint(first).ok,true);
  const skipped=generateOrchardBlueprint({familyId:'four-locks',tier:1,seed:130,recentParameterSeeds:[2]});
  assert.equal(skipped.bankIndex,3);
  const allRecent=generateOrchardBlueprint({familyId:'four-locks',tier:1,seed:130,recentParameterSeeds:[2,3,4,5,6,7,8,9]});
  assert.equal(allRecent.bankIndex,2);assert.equal(allRecent.repeat,true);
  assert.equal(generateOrchardFallbackBlueprint().referenceFallback,true);
});
test('every certified runtime entry and the fallback reconstruct exactly and keep both bridge approaches usable',()=>{
  for(let i=0;i<RUNTIME_BANK.length;i++){const bp=generateOrchardBlueprint({familyId:'four-locks',tier:1,seed:i});assert.equal(bp.bankIndex,i);assert.deepEqual(crossingExitViolations(bp),[],'entry '+i);}
  assert.deepEqual(crossingExitViolations(generateOrchardFallbackBlueprint()),[]);
});
test('the legacy reference is the known dead-end map and new candidates reject such topologies',()=>{
  const legacy=generateLegacyReferenceBlueprint({seed:1});
  const bad=crossingExitViolations(legacy);
  assert.equal(bad.length,1);assert.equal(bad[0].crossing,'3,6');assert.match(bad[0].neighbours.join(' '),/4,6:hedge/);
  const rejected=generateFourLocksCandidate({tier:1,seed:1,layoutId:'river'});
  assert.equal(rejected.status,'unknown');assert.equal(rejected.reasonCode,'crossing-exit-blocked');
  assert.equal(generateFourLocksCandidate({tier:1,seed:0,layoutId:'river'}).status,'success');
});
test('unproved tiers, families and invalid requests cannot produce runtime blueprints',()=>{
  assert.equal(orchardGenerationAvailability('four-locks',1),true);
  for(const [familyId,tier]of [['missing',1],['four-locks',6],['turning-ravine',0]]){assert.equal(orchardGenerationAvailability(familyId,tier),false);assert.throws(()=>generateOrchardBlueprint({familyId,tier,seed:1}));}
  for(const seed of [-1,1.2,0x100000000])assert.throws(()=>generateOrchardBlueprint({familyId:'four-locks',tier:1,seed}));
});
test('every runtime bank entry still has real production-reducer winning traces on the regenerated map',()=>{
  registerOrchardPuzzleHooks();
  let replayed=0;
  for(let i=0;i<RUNTIME_BANK.length;i++){
    const entry=RUNTIME_BANK[i],file=new URL(`../../../docs/expeditions/v2/certification/four-locks/displaced-v1/${entry.source}/traces.json`,import.meta.url);
    const traces=JSON.parse(fs.readFileSync(file,'utf8'));
    assert.ok(traces.length>=2,entry.source);
    const blueprint=generateOrchardBlueprint({familyId:'four-locks',tier:1,seed:i});
    for(const trace of traces){
      let state=createRun({...trace.initialRun,blueprint});
      for(const command of trace.commands){const next=reduceCommand(state,command);assert.equal(next.result.legal,true,`${entry.source} ${next.result.reasonCode}`);state=next.state;}
      assert.equal(state.status,'won',entry.source);replayed+=1;
    }
  }
  assert.ok(replayed>=128);
});

test('private development access: every family/tier regenerates a planner-verified, truthfully labelled, uncertified map; Four Locks T1 stays certified',()=>{
  registerOrchardPuzzleHooks();
  assert.deepEqual(orchardGenerationStatus('four-locks',1),{available:true,certified:true,status:'certified',label:'Certified'});
  const certified=generateOrchardBlueprint({familyId:'four-locks',tier:1,seed:7});
  assert.equal(certified.privateDevelopment,undefined);assert.ok(certified.certificateId);
  for(const familyId of ['four-locks','turning-ravine','unequal-crossing','maybe-flock','hollow-bough'])for(const tier of [1,2,3,4,5]){
    if(familyId==='four-locks'&&tier===1)continue;
    const status=orchardGenerationStatus(familyId,tier);
    assert.equal(status.available,true,familyId+tier);assert.equal(status.certified,false);assert.equal(status.status,'private-development');
    const a=generateOrchardBlueprint({familyId,tier,seed:12345}),b=generateOrchardBlueprint({familyId,tier,seed:12345});
    assert.deepEqual(a,b,'deterministic');
    assert.equal(a.familyId,familyId);assert.equal(a.tier,tier);assert.equal(a.privateDevelopment,true);assert.equal(a.certificateId,null);assert.equal(a.bankStatus,'planner-verified-uncertified');
    assert.equal(validateBlueprint(a).ok,true);
    const other=generateOrchardBlueprint({familyId,tier,seed:12345,recentParameterSeeds:[a.bankIndex]});
    if(status.entries>1)assert.notEqual(other.bankIndex,a.bankIndex,'recently used entries are skipped');
  }
});
