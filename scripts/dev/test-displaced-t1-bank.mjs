import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {verifyDisplacedBankEvidence,reviewDisplacedT1Bank,processDisplacedBankCandidate,displacedBankBatch,executeDisplacedBankBatch} from './assemble-displaced-t1-bank.mjs';
import {generateDisplacedFourLocksCandidate} from '../../expeditions/v2/generation/displaced-four-locks.js';
import {hashValue} from '../../expeditions/v2/index.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
const root=new URL('../../docs/expeditions/v2/certification/four-locks/displaced-v1/',import.meta.url);
const layouts=['river','islands','hedges','terraces'];
const read=(source,name)=>JSON.parse(fs.readFileSync(new URL(`${source}/${name}.json`,root),'utf8'));
const evidence=source=>({source,candidate:read(source,'candidate'),traces:read(source,'traces'),result:read(source,'result')});
const sources=layouts.flatMap(layout=>[0,1,2,3,4].map(seed=>`${seed?'bank-candidates/':''}tier-1-${layout}-seed-${seed}`));
registerOrchardPuzzleHooks();
const records=sources.map(source=>verifyDisplacedBankEvidence(evidence(source)));
const fallback=records.find(r=>r.source==='tier-1-river-seed-0');
const review=()=>reviewDisplacedT1Bank(records.filter(r=>r!==fallback),fallback);
const memory=()=>{const data=new Map();return {data,has:k=>data.has(k),read:k=>structuredClone(data.get(k)),write:(k,v)=>{assert.equal(data.has(k),false,`immutable ${k}`);data.set(k,structuredClone(v));}};};
const source='bank-candidates/tier-1-river-seed-1';
const saved=evidence(source);
const savedPlan=index=>{const value=read(source,`attempt-${index}`);return {...value.attempt,traces:value.traces};};

test('all twenty saved packets independently replay; thirteen entries and separate fallback remain incomplete',()=>{
  const bank=review();assert.equal(records.filter(r=>r.eligible).length,14);
  assert.equal(bank.accepted.length,13);assert.equal(bank.rejected.length,6);assert.equal(bank.complete,false);
  assert.deepEqual(bank.coverage.archetypes.map(a=>a.topologies),[2,5,2,4]);
  assert.equal(bank.coverage.puzzlePatterns,5);assert.equal(bank.coverage.missingEntries,51);
  assert.equal(bank.coverage.fallbackSeparate,true);assert.ok(bank.accepted.every(r=>r.candidateHash!==fallback.candidateHash));
  assert.deepEqual(bank.missing,['64-distinct-material-entries','eight-topologies-per-archetype','eight-puzzle-patterns']);
  let attempts=0,wins=0,unknown=0,overages=0;
  for(const record of records.filter(r=>r.seed!==0)){
    const result=read(record.source,'result');attempts+=result.attempts.length;
    for(const a of result.attempts){assert.equal(a.requestedMaxStates,8000);assert.equal(a.metrics.maxStates,8000);if(a.status==='success')wins++;else unknown++;overages+=a.reportedStateOverage;}
  }
  assert.equal(attempts,32);assert.equal(wins,26);assert.equal(unknown,6);assert.equal(overages,129);
});
test('accepted packet reconstruction reproduces full immutable candidate hashes',()=>{
  for(const record of [...review().accepted,fallback]){
    const reconstructed=generateDisplacedFourLocksCandidate(record.parameters);
    assert.equal(hashValue(reconstructed),record.candidateHash,record.source);
  }
});
test('version, request identity, limits, canonical metadata and certificate tampering reject',()=>{
  for(const alter of [e=>{e.candidate.blueprint.generatorVersion=1;},e=>{e.source='bank-candidates/tier-1-river-seed-2';},e=>{e.result.requestedLimits.maxStatesPerInvocation=8001;},e=>{e.result.attempts.push(e.result.attempts[0]);},e=>{e.result.certification.certificateId='forged';},e=>{e.candidate.canonical.topology.serialization+='forged';},e=>{e.traces[0].finalStateHash='forged';}]){
    const changed=structuredClone(saved);alter(changed);assert.equal(verifyDisplacedBankEvidence(changed).eligible,false);
  }
});
test('count gates use full material identities, exclude fallback and reject wrong versions',()=>{
  const eligible=review().accepted[0];
  const copies=Array.from({length:80},(_,i)=>({...eligible,source:`copy-${i}`,candidateHash:`copy-${i}`}));
  const bank=reviewDisplacedT1Bank([...copies,{...fallback,source:'copied-fallback'},{...eligible,generatorVersion:1}],fallback);
  assert.equal(bank.accepted.length,1);assert.equal(bank.rejected.filter(r=>r.reason==='canonical-duplicate').length,79);
  assert.ok(bank.rejected.some(r=>r.reason==='fallback-equivalent'));assert.ok(bank.rejected.some(r=>r.reason==='unverified-or-version'));
  const serialChanged={...eligible,canonical:structuredClone(eligible.canonical)};serialChanged.canonical.topology.serialization+='material-change';
  assert.equal(reviewDisplacedT1Bank([eligible,serialChanged],fallback).accepted.length,2);
});
test('synthetic gate boundaries require sixty-four entries, four archetypes, eight topologies each and eight patterns',()=>{
  const fixture=(topologies=8,patterns=8)=>layouts.flatMap(layoutId=>Array.from({length:16},(_,i)=>({...fallback,source:`gate-fixture-${layoutId}-${i}`,layoutId,canonical:{topology:{serialization:`fixture-${layoutId}-${i%topologies}`},puzzle:{serialization:`fixture-pattern-${(Math.floor(i/topologies)+i%patterns)%patterns}`}}})));
  const full=fixture();assert.equal(reviewDisplacedT1Bank(full,fallback).complete,true);
  assert.ok(reviewDisplacedT1Bank(full.slice(1),fallback).missing.includes('64-distinct-material-entries'));
  assert.ok(reviewDisplacedT1Bank(full.filter(r=>r.layoutId!=='river'),fallback).missing.includes('all-four-archetypes'));
  const sevenTopologies=full.map((r,i)=>({...r,canonical:{topology:{serialization:`fixture-${r.layoutId}-${i%7}`},puzzle:{serialization:`unique-pattern-${i}`}}}));
  assert.ok(reviewDisplacedT1Bank(sevenTopologies,fallback).missing.includes('eight-topologies-per-archetype'));
  const sevenPatterns=full.map((r,i)=>({...r,canonical:{topology:{serialization:`unique-topology-${i}`},puzzle:{serialization:`pattern-${i%7}`}}}));
  assert.ok(reviewDisplacedT1Bank(sevenPatterns,fallback).missing.includes('eight-puzzle-patterns'));
  for(const bad of [null,{...fallback,generatorVersion:1},{...fallback,tier:2},{...fallback,eligible:false}])assert.ok(reviewDisplacedT1Bank(full,bad).missing.includes('separate-certified-fallback'));
});
test('completed candidate resumes with zero generation and planner calls',()=>{
  const store=memory();let generated=0,planned=0;
  const options={layoutId:'river',seed:1,store,generate:()=>{generated++;return saved.candidate;},plan:()=>savedPlan(planned++)};
  const first=processDisplacedBankCandidate(options);assert.equal(first.result.certification.status,'success');assert.equal(generated,1);assert.equal(planned,2);
  const snapshot=hashValue([...store.data]);assert.equal(processDisplacedBankCandidate(options).skipped,true);
  assert.equal(hashValue([...store.data]),snapshot);assert.equal(generated,1);assert.equal(planned,2);
});
test('interrupted planner and generation markers consume slots without retrying unknown work',()=>{
  const store=memory();let planned=0;
  const options={layoutId:'river',seed:1,store,generate:()=>saved.candidate,plan:()=>{planned++;throw Error('simulated interruption');}};
  assert.throws(()=>processDisplacedBankCandidate(options),/simulated interruption/);assert.equal(planned,1);
  const resumed=processDisplacedBankCandidate({...options,generate:()=>assert.fail('generation retry'),plan:()=>{planned++;return savedPlan(1);}});
  assert.equal(planned,2);assert.equal(resumed.result.attempts[0].reasonCode,'interrupted-planner-attempt-no-retry');assert.equal(resumed.result.certification.status,'unknown');
  assert.equal(processDisplacedBankCandidate({...options,plan:()=>assert.fail('planner retry')}).skipped,true);
  const generation=memory();generation.write('generation-started',{layoutId:'river',seed:1});
  const unproved=processDisplacedBankCandidate({layoutId:'river',seed:1,store:generation,generate:()=>assert.fail('generator retry'),plan:()=>assert.fail('planner for missing candidate')});
  assert.equal(unproved.candidate.reasonCode,'interrupted-generation-no-retry');assert.equal(unproved.result.attempts.length,0);assert.notEqual(unproved.result.certification.status,'success');
});
test('saved finished attempts and trace checkpoint resume without planning or overwriting',()=>{
  const store=memory();store.write('candidate',saved.candidate);
  for(let i=0;i<2;i++)store.write(`attempt-${i}`,read(source,`attempt-${i}`));store.write('traces',saved.traces);
  const done=processDisplacedBankCandidate({layoutId:'river',seed:1,store,generate:()=>assert.fail('generator retry'),plan:()=>assert.fail('planner retry')});
  assert.equal(done.result.certification.status,'success');assert.equal(hashValue(store.read('traces')),hashValue(saved.traces));
  assert.throws(()=>processDisplacedBankCandidate({layoutId:'river',seed:5,store}),/fixed sixteen/);
  const mismatch=memory();mismatch.write('candidate',saved.candidate);
  assert.throws(()=>processDisplacedBankCandidate({layoutId:'river',seed:2,store:mismatch}),/identity differs/);
});
test('explicit next batch accepts only seeds five to eight and records immutable request identity',()=>{
  assert.deepEqual(displacedBankBatch('5-8').seeds,[5,6,7,8]);assert.deepEqual(displacedBankBatch().seeds,[1,2,3,4]);
  for(const batchId of ['25-28','1-8','5-9','',5,null,'__proto__'])assert.throws(()=>displacedBankBatch(batchId),/batch identity/);
  for(const seed of [0,1,4,9,5.5,'5'])assert.throws(()=>processDisplacedBankCandidate({layoutId:'river',seed,batchId:'5-8',store:memory()}),/fixed sixteen/);
  const store=memory();let calls=0;
  const done=processDisplacedBankCandidate({layoutId:'river',seed:5,batchId:'5-8',store,generate:generateDisplacedFourLocksCandidate,plan:request=>{calls++;assert.equal(request.maxStates,8000);return {status:'unknown',reasonCode:'test-no-search',traces:[],metrics:{maxStates:8000,statesSpent:0}};}});
  assert.equal(calls,2);assert.equal(done.result.batchId,'5-8');assert.equal(store.read('generation-started').batchId,'5-8');
  assert.equal(processDisplacedBankCandidate({layoutId:'river',seed:5,batchId:'5-8',store,plan:()=>assert.fail('repeat planner')}).skipped,true);
  const changed=structuredClone(saved);changed.result.batchId='5-8';assert.ok(verifyDisplacedBankEvidence(changed).errors.includes('batch-identity'));
  const mismatched=memory();mismatched.write('generation-started',{layoutId:'river',seed:5,batchId:'1-4'});
  assert.throws(()=>processDisplacedBankCandidate({layoutId:'river',seed:5,batchId:'5-8',store:mismatched}),/checkpoint identity/);
});
test('second fixed batch independently replays, retains earlier coverage and cannot mark an incomplete bank complete',()=>{
  const next=layouts.flatMap(layout=>[5,6,7,8].map(seed=>verifyDisplacedBankEvidence(evidence(`bank-candidates/tier-1-${layout}-seed-${seed}`))));
  assert.equal(next.filter(r=>r.eligible).length,12);
  const combined=reviewDisplacedT1Bank([...records.filter(r=>r!==fallback),...next],fallback);
  assert.equal(combined.accepted.length,25);assert.equal(combined.rejected.length,10);assert.equal(combined.complete,false);
  assert.deepEqual(combined.coverage.archetypes.map(a=>a.topologies),[4,8,6,7]);assert.equal(combined.coverage.puzzlePatterns,9);
  assert.deepEqual(combined.missing,['64-distinct-material-entries','eight-topologies-per-archetype']);
  let calls=0,wins=0,overages=0;
  for(const r of next){const saved=evidence(r.source);assert.equal(saved.result.batchId,'5-8');assert.equal(saved.result.attempts.length,2);
    for(const a of saved.result.attempts){calls++;assert.equal(a.requestedMaxStates,8000);assert.equal(a.metrics.maxStates,8000);if(a.status==='success')wins++;overages+=a.reportedStateOverage;}
    if(r.eligible)assert.equal(hashValue(generateDisplacedFourLocksCandidate(r.parameters)),r.candidateHash,r.source);
  }
  assert.equal(calls,32);assert.equal(wins,26);assert.equal(overages,67);
  const manifest=JSON.parse(fs.readFileSync(new URL('bank-manifest.json',root),'utf8'));
  assert.equal(manifest.referenceFallback.candidateHash,fallback.candidateHash);
  const retained=new Set(manifest.entries.map(e=>e.candidateHash));assert.ok(combined.accepted.every(e=>retained.has(e.candidateHash)));
});
test('third fixed batch preserves exact request bounds and rejects mismatched identities',()=>{
  assert.deepEqual(displacedBankBatch('9-12').seeds,[9,10,11,12]);
  for(const seed of [0,8,13,9.5,'9'])assert.throws(()=>processDisplacedBankCandidate({layoutId:'river',seed,batchId:'9-12',store:memory()}),/fixed sixteen/);
  const store=memory();let calls=0;
  const done=processDisplacedBankCandidate({layoutId:'river',seed:9,batchId:'9-12',store,generate:generateDisplacedFourLocksCandidate,plan:request=>{calls++;assert.equal(request.maxStates,8000);return {status:'unknown',reasonCode:'test-no-search',traces:[],metrics:{maxStates:8000,statesSpent:0}};}});
  assert.equal(calls,2);assert.equal(done.result.batchId,'9-12');assert.equal(store.read('generation-started').batchId,'9-12');
  assert.equal(processDisplacedBankCandidate({layoutId:'river',seed:9,batchId:'9-12',store,plan:()=>assert.fail('retry')}).skipped,true);
  const changed=structuredClone(saved);changed.result.batchId='9-12';assert.ok(verifyDisplacedBankEvidence(changed).errors.includes('batch-identity'));
});
test('third saved increment independently replays and retains full cumulative manifest coverage',()=>{
  const next=layouts.flatMap(layout=>[9,10,11,12].map(seed=>verifyDisplacedBankEvidence(evidence(`bank-candidates/tier-1-${layout}-seed-${seed}`))));
  const previous=layouts.flatMap(layout=>[5,6,7,8].map(seed=>verifyDisplacedBankEvidence(evidence(`bank-candidates/tier-1-${layout}-seed-${seed}`))));
  assert.equal(next.filter(r=>r.eligible).length,12);
  const combined=reviewDisplacedT1Bank([...records.filter(r=>r!==fallback),...previous,...next],fallback);
  assert.equal(combined.accepted.length,37);assert.equal(combined.rejected.length,14);assert.equal(combined.complete,false);
  assert.deepEqual(combined.coverage.archetypes.map(a=>a.topologies),[7,11,9,10]);assert.equal(combined.coverage.puzzlePatterns,13);
  assert.deepEqual(combined.missing,['64-distinct-material-entries','eight-topologies-per-archetype']);
  let calls=0,wins=0,overages=0;
  for(const r of next){const saved=evidence(r.source);assert.equal(saved.result.batchId,'9-12');assert.equal(saved.result.attempts.length,2);
    for(const a of saved.result.attempts){calls++;assert.equal(a.requestedMaxStates,8000);assert.equal(a.metrics.maxStates,8000);if(a.status==='success')wins++;overages+=a.reportedStateOverage;}
    if(r.eligible)assert.equal(hashValue(generateDisplacedFourLocksCandidate(r.parameters)),r.candidateHash,r.source);
  }
  assert.equal(calls,32);assert.equal(wins,27);assert.equal(overages,42);
  const manifest=JSON.parse(fs.readFileSync(new URL('bank-manifest.json',root),'utf8'));
  assert.equal(manifest.referenceFallback.candidateHash,fallback.candidateHash);
  const retained=new Set(manifest.entries.map(e=>e.candidateHash));assert.ok(combined.accepted.every(e=>retained.has(e.candidateHash)));
});
test('fourth fixed batch enforces seeds thirteen to sixteen and rejects unsupported ranges',()=>{
  assert.deepEqual(displacedBankBatch('13-16').seeds,[13,14,15,16]);
  for(const seed of [0,12,17,13.5,'13'])assert.throws(()=>processDisplacedBankCandidate({layoutId:'river',seed,batchId:'13-16',store:memory()}),/fixed sixteen/);
  const store=memory();let calls=0;
  const done=processDisplacedBankCandidate({layoutId:'river',seed:13,batchId:'13-16',store,generate:generateDisplacedFourLocksCandidate,plan:request=>{calls++;assert.equal(request.maxStates,8000);return {status:'unknown',reasonCode:'test-no-search',traces:[],metrics:{maxStates:8000,statesSpent:0}};}});
  assert.equal(calls,2);assert.equal(done.result.batchId,'13-16');assert.equal(store.read('generation-started').batchId,'13-16');
  assert.equal(processDisplacedBankCandidate({layoutId:'river',seed:13,batchId:'13-16',store,plan:()=>assert.fail('retry')}).skipped,true);
  const changed=structuredClone(saved);changed.result.batchId='13-16';assert.ok(verifyDisplacedBankEvidence(changed).errors.includes('batch-identity'));
});
test('fourth saved increment independently replays and passes diversity gates while entry count remains incomplete',()=>{
  const next=layouts.flatMap(layout=>[13,14,15,16].map(seed=>verifyDisplacedBankEvidence(evidence(`bank-candidates/tier-1-${layout}-seed-${seed}`))));
  const previous=layouts.flatMap(layout=>[5,6,7,8,9,10,11,12].map(seed=>verifyDisplacedBankEvidence(evidence(`bank-candidates/tier-1-${layout}-seed-${seed}`))));
  assert.equal(next.filter(r=>r.eligible).length,10);
  const combined=reviewDisplacedT1Bank([...records.filter(r=>r!==fallback),...previous,...next],fallback);
  assert.equal(combined.accepted.length,47);assert.equal(combined.rejected.length,20);assert.equal(combined.complete,false);
  assert.deepEqual(combined.coverage.archetypes.map(a=>a.topologies),[9,14,11,13]);assert.equal(combined.coverage.puzzlePatterns,17);
  assert.deepEqual(combined.missing,['64-distinct-material-entries']);
  let calls=0,wins=0,overages=0;
  for(const r of next){const saved=evidence(r.source);assert.equal(saved.result.batchId,'13-16');assert.equal(saved.result.attempts.length,2);
    for(const a of saved.result.attempts){calls++;assert.equal(a.requestedMaxStates,8000);assert.equal(a.metrics.maxStates,8000);if(a.status==='success')wins++;overages+=a.reportedStateOverage;}
    if(r.eligible)assert.equal(hashValue(generateDisplacedFourLocksCandidate(r.parameters)),r.candidateHash,r.source);
  }
  assert.equal(calls,32);assert.equal(wins,25);assert.equal(overages,161);
  const manifest=JSON.parse(fs.readFileSync(new URL('bank-manifest.json',root),'utf8'));
  assert.equal(manifest.referenceFallback.candidateHash,fallback.candidateHash);
  const retained=new Set(manifest.entries.map(e=>e.candidateHash));assert.ok(combined.accepted.every(e=>retained.has(e.candidateHash)));
});
test('fifth fixed batch accepts only seeds seventeen to twenty and retains request identity',()=>{
  assert.deepEqual(displacedBankBatch('17-20').seeds,[17,18,19,20]);
  for(const seed of [0,16,21,17.5,'17'])assert.throws(()=>processDisplacedBankCandidate({layoutId:'river',seed,batchId:'17-20',store:memory()}),/fixed sixteen/);
  const store=memory();let calls=0;
  const done=processDisplacedBankCandidate({layoutId:'river',seed:17,batchId:'17-20',store,generate:generateDisplacedFourLocksCandidate,plan:request=>{calls++;assert.equal(request.maxStates,8000);return {status:'unknown',reasonCode:'test-no-search',traces:[],metrics:{maxStates:8000,statesSpent:0}};}});
  assert.equal(calls,2);assert.equal(done.result.batchId,'17-20');assert.equal(store.read('generation-started').batchId,'17-20');
  assert.equal(processDisplacedBankCandidate({layoutId:'river',seed:17,batchId:'17-20',store,plan:()=>assert.fail('retry')}).skipped,true);
  const changed=structuredClone(saved);changed.result.batchId='17-20';assert.ok(verifyDisplacedBankEvidence(changed).errors.includes('batch-identity'));
});
test('fifth saved increment independently replays and retains honest entry-count gap',()=>{
  const next=layouts.flatMap(layout=>[17,18,19,20].map(seed=>verifyDisplacedBankEvidence(evidence(`bank-candidates/tier-1-${layout}-seed-${seed}`))));
  const previous=layouts.flatMap(layout=>Array.from({length:12},(_,i)=>i+5).map(seed=>verifyDisplacedBankEvidence(evidence(`bank-candidates/tier-1-${layout}-seed-${seed}`))));
  assert.equal(next.filter(r=>r.eligible).length,10);
  const combined=reviewDisplacedT1Bank([...records.filter(r=>r!==fallback),...previous,...next],fallback);
  assert.equal(combined.accepted.length,57);assert.equal(combined.rejected.length,26);assert.equal(combined.complete,false);
  assert.deepEqual(combined.coverage.archetypes.map(a=>a.topologies),[13,15,15,14]);assert.equal(combined.coverage.puzzlePatterns,21);
  assert.equal(combined.coverage.missingEntries,7);assert.deepEqual(combined.missing,['64-distinct-material-entries']);
  let calls=0,wins=0,overages=0;
  for(const r of next){const saved=evidence(r.source);assert.equal(saved.result.batchId,'17-20');assert.equal(saved.result.attempts.length,2);
    for(const a of saved.result.attempts){calls++;assert.equal(a.requestedMaxStates,8000);assert.equal(a.metrics.maxStates,8000);if(a.status==='success')wins++;overages+=a.reportedStateOverage;}
    if(r.eligible)assert.equal(hashValue(generateDisplacedFourLocksCandidate(r.parameters)),r.candidateHash,r.source);
  }
  assert.equal(calls,32);assert.equal(wins,26);assert.equal(overages,107);
  const manifest=JSON.parse(fs.readFileSync(new URL('bank-manifest.json',root),'utf8'));
  assert.equal(manifest.referenceFallback.candidateHash,fallback.candidateHash);
  const retained=new Set(manifest.entries.map(e=>e.candidateHash));assert.ok(combined.accepted.every(e=>retained.has(e.candidateHash)));
});
test('final fixed batch bounds reject further automatic ranges',()=>{
  assert.deepEqual(displacedBankBatch('21-24').seeds,[21,22,23,24]);
  for(const seed of [20,25,21.5,'21'])assert.throws(()=>processDisplacedBankCandidate({layoutId:'river',seed,batchId:'21-24',store:memory()}),/fixed sixteen/);
  const store=memory();let calls=0;
  const done=processDisplacedBankCandidate({layoutId:'river',seed:21,batchId:'21-24',store,generate:generateDisplacedFourLocksCandidate,plan:request=>{calls++;assert.equal(request.maxStates,8000);return {status:'unknown',reasonCode:'test-no-search',traces:[],metrics:{maxStates:8000,statesSpent:0}};}});
  assert.equal(calls,2);assert.equal(done.result.batchId,'21-24');
  assert.equal(processDisplacedBankCandidate({layoutId:'river',seed:21,batchId:'21-24',store,plan:()=>assert.fail('retry')}).skipped,true);
});
test('batch execution stops deterministically at completion and never resumes unused slots',()=>{
  const requests=[];const result=executeDisplacedBankBatch({batchId:'21-24',isComplete:()=>requests.length===7,process:r=>requests.push(r)});
  assert.equal(result.processed,7);assert.equal(result.notAttempted,9);assert.equal(result.stopReason,'bank-complete');
  assert.deepEqual(requests.map(r=>[r.layoutId,r.seed]),[['river',21],['river',22],['river',23],['river',24],['islands',21],['islands',22],['islands',23]]);
  const resumed=executeDisplacedBankBatch({batchId:'21-24',completed:new Set(requests.map(r=>r.source)),isComplete:()=>true,process:()=>assert.fail('generation after completion')});
  assert.equal(resumed.processed,0);assert.equal(resumed.skipped,7);assert.equal(resumed.notAttempted,9);
});
test('incomplete unknown coverage consumes at most the selected range without repeating completed slots',()=>{
  const completed=new Set(['bank-candidates/tier-1-river-seed-21']),requests=[];
  const result=executeDisplacedBankBatch({batchId:'21-24',completed,isComplete:()=>false,process:r=>requests.push(r)});
  assert.equal(result.processed,15);assert.equal(result.skipped,1);assert.equal(result.notAttempted,0);assert.equal(result.stopReason,'batch-limit');
  assert.ok(requests.every(r=>r.seed>=21&&r.seed<=24&&!completed.has(r.source)));
});
test('final saved increment stops at sixty-four entries and leaves all unused terrace slots absent',()=>{
  const next=layouts.slice(0,3).flatMap(layout=>[21,22,23,24].map(seed=>verifyDisplacedBankEvidence(evidence(`bank-candidates/tier-1-${layout}-seed-${seed}`))));
  const previous=layouts.flatMap(layout=>Array.from({length:16},(_,i)=>i+5).map(seed=>verifyDisplacedBankEvidence(evidence(`bank-candidates/tier-1-${layout}-seed-${seed}`))));
  assert.equal(next.filter(r=>r.eligible).length,7);
  const combined=reviewDisplacedT1Bank([...records.filter(r=>r!==fallback),...previous,...next],fallback);
  assert.equal(combined.accepted.length,64);assert.equal(combined.rejected.length,31);assert.equal(combined.complete,true);
  assert.deepEqual(combined.coverage.archetypes.map(a=>a.topologies),[16,16,18,14]);assert.equal(combined.coverage.puzzlePatterns,25);assert.deepEqual(combined.missing,[]);
  let calls=0,wins=0,overages=0;
  for(const r of next){const saved=evidence(r.source);assert.equal(saved.result.batchId,'21-24');assert.equal(saved.result.attempts.length,2);
    for(const a of saved.result.attempts){calls++;assert.equal(a.requestedMaxStates,8000);assert.equal(a.metrics.maxStates,8000);if(a.status==='success')wins++;overages+=a.reportedStateOverage;}
  }
  assert.equal(calls,24);assert.equal(wins,17);assert.equal(overages,117);
  for(const seed of [21,22,23,24])assert.equal(fs.existsSync(new URL(`bank-candidates/tier-1-terraces-seed-${seed}/`,root)),false);
  const manifest=JSON.parse(fs.readFileSync(new URL('bank-manifest.json',root),'utf8'));
  assert.equal(manifest.complete,true);assert.equal(manifest.status,'complete');assert.deepEqual(manifest.coverage,combined.coverage);assert.deepEqual(manifest.missing,[]);
  assert.deepEqual(new Set(manifest.entries.map(e=>e.candidateHash)),new Set(combined.accepted.map(e=>e.candidateHash)));
});
test('all sixty-four manifest entries and separate fallback reconstruct and independently certify on the real reducer',()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('bank-manifest.json',root),'utf8'));
  assert.equal(manifest.entries.length,64);assert.equal(manifest.generatorVersion,2);
  const verified=[];
  for(const entry of [...manifest.entries,manifest.referenceFallback]){
    const reconstructed=generateDisplacedFourLocksCandidate(entry.parameters);
    assert.equal(hashValue(reconstructed),entry.candidateHash,entry.source);assert.equal(hashValue(reconstructed.blueprint),entry.contentHash,entry.source);
    const replayed=verifyDisplacedBankEvidence({...evidence(entry.source),candidate:reconstructed});
    assert.equal(replayed.eligible,true,entry.source);assert.equal(replayed.certificateId,entry.certificateId);verified.push(replayed);
  }
  const review=reviewDisplacedT1Bank(verified.slice(0,64),verified[64]);assert.equal(review.complete,true);assert.deepEqual(review.coverage,manifest.coverage);
  assert.equal(review.accepted.length,64);assert.equal(review.rejected.length,0);
});
