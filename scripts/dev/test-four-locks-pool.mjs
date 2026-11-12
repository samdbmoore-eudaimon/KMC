import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {inventoryFourLocksPool} from './inventory-four-locks-pool.mjs';
import {hashValue} from '../../expeditions/v2/index.js';
const read=file=>JSON.parse(fs.readFileSync(new URL(`../../docs/expeditions/v2/certification/four-locks/${file}`,import.meta.url),'utf8'));

test('sampling makes exactly one bounded request per tier/archetype/seed without certifying copies',()=>{
  const fixture=read('tier-4-river-seed-0-followup-20261002/candidate.json'),seen=[];
  const report=inventoryFourLocksPool({generate:request=>{seen.push(request);const candidate=structuredClone(fixture);Object.assign(candidate.blueprint,{tier:request.tier,parameterSeed:request.seed,layoutId:request.layoutId});return candidate;}});
  assert.equal(seen.length,160);assert.equal(new Set(seen.map(r=>JSON.stringify(r))).size,160);assert.equal(report.limits.plannerInvocations,0);
  assert.ok(report.groups.every(g=>g.successes===8&&g.topologyCount===1&&g.puzzlePatternCount===1));assert.ok(report.tiers.every(t=>!t.sampleMeetsDiversityCounts));assert.ok(report.requests.every(r=>r.certified===false&&r.certificateId===null));
  for(const seedCount of [0,9,-1,1.5])assert.throws(()=>inventoryFourLocksPool({seedCount,generate:()=>{throw Error('Must not generate');}}),/sampling bound/);
});
test('unknowns and explicit rejections remain recorded and do not enter diversity counts',()=>{
  const report=inventoryFourLocksPool({seedCount:2,generate:({seed})=>seed===0?{status:'unknown',reasonCode:'topology-attempt-budget',attempts:256,lastRejection:{roots:0}}:{status:'failure',reasonCode:'blueprint-schema',errors:['geometry']}});
  assert.equal(report.limits.actualRequests,40);assert.ok(report.groups.every(g=>g.successes===0&&g.unknowns===1&&g.failures===1&&g.topologyCount===0&&g.puzzlePatternCount===0));
  assert.ok(report.groups.every(g=>g.reasonCounts['topology-attempt-budget']===1&&g.reasonCounts['blueprint-schema']===1));assert.ok(report.requests.filter(r=>r.status==='unknown').every(r=>r.attempts===256&&r.lastRejection.roots===0));
});
test('published160-request inventory has inspectable canonical representatives and honest advanced gaps',()=>{
  const report=read('candidate-pool-inventory.json');
  assert.deepEqual(report.limits.seeds,[0,1,2,3,4,5,6,7]);assert.equal(report.limits.actualRequests,160);assert.equal(report.requests.length,160);assert.equal(report.limits.plannerInvocations,0);assert.equal(report.limits.topologyAttemptsPerRequest,256);assert.equal(report.limits.puzzleAttemptsPerRequest,256);
  assert.equal(report.requests.filter(r=>r.status==='success').length,144);assert.equal(report.requests.filter(r=>r.status==='unknown').length,16);assert.ok(report.requests.every(r=>r.certified===false&&r.certificateId===null));
  for(const group of report.groups){
    const requests=report.requests.filter(r=>r.tier===group.tier&&r.layoutId===group.layoutId);assert.equal(requests.length,8);assert.deepEqual(requests.map(r=>r.seed),[0,1,2,3,4,5,6,7]);
    assert.equal(new Set(group.representativeTopologies.map(r=>r.serialization)).size,group.topologyCount);assert.equal(new Set(group.representativePatterns.map(r=>r.serialization)).size,group.puzzlePatternCount);
    for(const representative of [...group.representativeTopologies,...group.representativePatterns]){assert.equal(hashValue(representative.serialization),representative.hash);assert.doesNotThrow(()=>JSON.parse(representative.serialization));}
    for(const r of requests.filter(r=>r.status==='success')){assert.ok(group.representativeTopologies.some(t=>t.hash===r.topologyHash));assert.ok(group.representativePatterns.some(p=>p.hash===r.puzzleHash));assert.equal(r.mathematicalEvidence.unique,true);}
  }
  assert.deepEqual(report.tiers.map(t=>t.puzzlePatternCount),[8,8,8,4,3]);assert.deepEqual(report.tiers.map(t=>t.successes),[32,32,32,28,20]);assert.ok(report.tiers.slice(0,3).every(t=>t.sampleMeetsDiversityCounts));assert.ok(report.tiers.slice(3).every(t=>!t.sampleMeetsDiversityCounts));
  for(const tier of [1,2,3,4,5])for(let seed=0;seed<8;seed++){const perSeed=report.requests.filter(r=>r.tier===tier&&r.seed===seed);assert.equal(new Set(perSeed.map(r=>r.status)).size,1);assert.equal(new Set(perSeed.filter(r=>r.status==='success').map(r=>r.puzzleHash)).size,perSeed[0].status==='success'?1:0);}
});
