import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildPassageBaseline,validatePassageCuts,generateDisplacedTopology} from './displaced-topology.js';
import {hashValue} from '../index.js';
import {generateFourLocksPuzzle} from './four-locks.js';
const report=JSON.parse(fs.readFileSync(new URL('../../../docs/expeditions/v2/fixtures/four-locks-displaced-topology.json',import.meta.url),'utf8'));
const key=t=>`${t.q},${t.r}`,closed=t=>t&&!['water','hedge'].includes(t.terrain)&&!t.passageOutputId;
const directions=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
function independentPaths(tiles,start,{passagesOpen=true}={}){
  const map=new Map(tiles.map(t=>[key(t),t])),distance=new Map([[start,0]]),queue=[start];
  while(queue.length){queue.sort((a,b)=>distance.get(a)-distance.get(b));const current=queue.shift(),[q,r]=current.split(',').map(Number);
    for(const [dq,dr]of directions){const next=`${q+dq},${r+dr}`,tile=map.get(next);if(!tile||['water','hedge'].includes(tile.terrain)||(!passagesOpen&&tile.passageOutputId))continue;const cost=distance.get(current)+(tile.terrain==='roots'?2:1);if(!distance.has(next)||cost<distance.get(next)){distance.set(next,cost);if(!queue.includes(next))queue.push(next);}}
  }
  return distance;
}
test('strict displacement boundaries preserve permanent/control passages and reject collisions',()=>{
  for(const [layout,n]of [['river',3],['islands',4],['hedges',4],['terraces',4]]){
    for(const delta of [-1,0,1]){const baseline=buildPassageBaseline(layout,Array(n).fill(delta));assert.equal(baseline.tiles.length,92);assert.equal(validatePassageCuts(baseline).valid,true);assert.ok(baseline.cuts.every(c=>c.passages.every(p=>p.position===p.base+delta)));}
    assert.throws(()=>buildPassageBaseline(layout,Array(n).fill(2)),/Invalid passage/);assert.throws(()=>buildPassageBaseline(layout,[]),/Invalid passage/);
  }
  assert.throws(()=>buildPassageBaseline('river',[1,-1,0]),/collision/);assert.throws(()=>buildPassageBaseline('hedges',[1,-1,0,0]),/collision/);assert.throws(()=>buildPassageBaseline('missing',[]),/archetype/);
  const islands=buildPassageBaseline('islands',[0,0,0,0]);
  islands.tiles.find(t=>t.c===4&&t.r===2).terrain='water';const failed=validatePassageCuts(islands);assert.equal(failed.valid,false);assert.equal(failed.checks[0].valid,false);assert.equal(failed.checks[1].valid,true,'A valid second cut cannot disguise the first cut losing its permanent bridge');
});
test('saved sample has actual moved passages and independently checked weighted reachability',()=>{
  assert.equal(report.records.length,16);assert.equal(report.limits.plannerInvocations,0);assert.deepEqual(report.limits.seeds,[0,1,2,3]);
  for(const record of report.records){
    assert.equal(record.status,'success');assert.equal(record.certified,false);const t=record.topology;
    assert.ok(t.deltas.some(d=>d!==0));assert.ok(t.attempts<=256);assert.equal(t.canonical.hash,hashValue(t.canonical.serialization));assert.equal(validatePassageCuts(t).valid,true);
    const map=new Map(t.tiles.map(tile=>[key(tile),tile])),closedPaths=independentPaths(t.tiles,t.deployment[0],{passagesOpen:false});
    assert.ok(t.tiles.filter(closed).every(tile=>closedPaths.has(key(tile))));assert.ok([...t.deployment,...Object.values(t.anchors)].every(id=>closed(map.get(id))));
    const openCount=t.tiles.filter(tile=>!['water','hedge'].includes(tile.terrain)).length,closedCount=t.tiles.filter(closed).length;assert.ok(openCount>=70&&openCount<=86);assert.ok(closedCount>=66);
    const costs=t.deployment.map(start=>independentPaths(t.tiles,start));assert.ok(Math.min(...costs.map(c=>c.get(t.anchors.control)))<=6);assert.ok(independentPaths(t.tiles,t.anchors.control).get(t.anchors.number)<=5);
    assert.ok(['number','shape','sustain'].every((job,i)=>costs[i].get(t.anchors[job])<=12));assert.ok(Math.min(...costs.map(c=>c.get(t.anchors.alcove)))<=15);
    assert.equal(t.routeEvidence.directCost,costs[1].get(t.anchors.shape));assert.equal(t.routeEvidence.alcoveCost,costs[1].get(t.anchors.alcove));assert.ok(t.metrics.exclusiveEdges>=2);assert.ok(t.routeEvidence.tradeoff);
    assert.ok(t.routeEvidence.directCost!==t.routeEvidence.alcoveCost||t.routeEvidence.directExposure!==t.routeEvidence.alcoveExposure);
    for(const cut of t.cuts)for(const p of cut.passages){assert.ok([-1,0,1].includes(p.delta));assert.equal(p.position,p.base+p.delta);const tile=map.get(p.hex);assert.equal(!!tile.passageOutputId,p.controlled);assert.ok(!['water','hedge','roots'].includes(tile.terrain));}
    const validBaseline=buildPassageBaseline(record.layoutId,t.deltas);
    for(const tile of validBaseline.tiles.filter(tile=>['water','hedge'].includes(tile.terrain)))assert.equal(map.get(key(tile)).terrain,tile.terrain,'Declared barriers must not be silently cleared to fit anchors');
    assert.equal(record.maths.mathematicalEvidence.unique,true);assert.equal(record.maths.mathematicalEvidence.deductions.complete,true);
  }
  assert.ok(report.summary.every(s=>s.topologyCount===4&&s.puzzlePatterns===4&&s.actuallyDisplaced===4));
});
test('seed determinism, forbidden footprint and bounded unknown preserve strict reservations',()=>{
  const saved=report.records.find(r=>r.layoutId==='river'&&r.seed===0).topology;
  assert.deepEqual(generateDisplacedTopology({tier:1,layoutId:'river',seed:0}),saved);
  const impossible=generateDisplacedTopology({tier:1,layoutId:'river',seed:0,maxAttempts:1,reservedHexes:['6,0']});assert.equal(impossible.status,'unknown');assert.equal(impossible.rejections.reserved,1);assert.equal(impossible.lastRejection.reason,'reserved-footprint-blocked');assert.equal(impossible.attempts,1);
  assert.equal(generateDisplacedTopology({tier:1,layoutId:'river',seed:0,maxAttempts:0}).status,'unknown');
  for(const patch of [{seed:-1},{seed:0x100000000},{tier:6},{layoutId:'missing'},{maxAttempts:257},{reservedHexes:['99,99']},{reservedHexes:['2,0','2,0']}])assert.equal(generateDisplacedTopology({tier:1,layoutId:'river',seed:0,...patch}).status,'failure');
});
test('old mathematical reconstruction remains pinned',()=>{
  const expected=[['903b7d6bfc11f4c6','3dd50b0d2ff0f93c'],['68fdcdf0b0c4e0e7','60c53f915e41ba64'],['549e87a0d73c8acf','bc137d60eb2083fd']];
  for(const tier of [1,2,3])for(const [i,seed]of [1,29].entries())assert.equal(hashValue(generateFourLocksPuzzle({tier,seed})),expected[tier-1][i]);
});
