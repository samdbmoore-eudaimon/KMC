import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assembleDisplacedFourLocks,generateDisplacedFourLocksCandidate} from './displaced-four-locks.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';
import {validateBlueprint,createRun,previewCommand,reduceCommand,stateHash,hashValue,CHARGE_CAPACITY,stationMaxIntegrity,orchardMaxIntegrity} from '../index.js';
import {generateOrchardBlueprint} from './index.js';
import {verifyTrace,certifyCandidate,isTargetBandTeam} from '../../../scripts/dev/orchard-v2-certification.mjs';
const sample=JSON.parse(fs.readFileSync(new URL('../../../docs/expeditions/v2/fixtures/four-locks-displaced-topology.json',import.meta.url),'utf8'));
const read=(layout,file)=>JSON.parse(fs.readFileSync(new URL(`../../../docs/expeditions/v2/certification/four-locks/displaced-v1/tier-1-${layout}-seed-0/${file}.json`,import.meta.url),'utf8'));
registerOrchardPuzzleHooks();

test('full packet reconstruction is deterministic, versioned and retains all production pressure',()=>{
  for(const layout of ['river','islands','hedges','terraces']){
    const topology=sample.records.find(r=>r.layoutId===layout&&r.seed===0).topology,candidate=read(layout,'candidate'),bp=candidate.blueprint;
    assert.deepEqual(assembleDisplacedFourLocks(topology),candidate);
    assert.deepEqual(generateDisplacedFourLocksCandidate({...bp.constructionPacket.parameters,sourceTopologyHash:bp.constructionPacket.sourceTopologyHash}),candidate);
    assert.equal(bp.generatorVersion,2);assert.equal(bp.constructionPacket.id,'four-locks-displaced-v1');assert.equal(bp.constructionPacket.sourceTopologyHash,hashValue(topology));assert.equal(bp.certificateId,null);assert.equal(candidate.certified,false);assert.equal(validateBlueprint(bp).ok,true);
    assert.equal(bp.deadline,5);assert.equal(bp.orchardMaxIntegrity,orchardMaxIntegrity(1));assert.equal(bp.puzzle.outputBudget,7);assert.deepEqual(bp.outputs.map(o=>[o.id,o.cost]),[['bridge',2],['shelter',3],['roots',4],['storm',5]]);
    for(const station of bp.stations.filter(s=>['number','shape','sustain'].includes(s.id))){assert.equal(station.capacity,CHARGE_CAPACITY[0]);assert.equal(station.maxIntegrity,stationMaxIntegrity(1));}
    assert.deepEqual(bp.enemies.map(e=>[e.ruleId,e.wakePhase]),[['jammer',2]]);assert.deepEqual(bp.hazards,[{id:'root-drain',sites:[{id:'sustain-site',targetId:'sustain'}],mutation:{kind:'none'}}]);assert.ok(bp.puzzle.lockGroups.every(g=>g.anchor===bp.puzzle.controlHex));
    assert.throws(()=>generateOrchardBlueprint({familyId:'four-locks',tier:1,seed:0,generatorVersion:2}),/Unsupported/);
  }
});
test('invalid source placement and changed reconstruction parameters reject without clearing barriers',()=>{
  const topology=sample.records.find(r=>r.layoutId==='river'&&r.seed===0).topology,hash=hashValue(topology);
  assert.equal(assembleDisplacedFourLocks(null).status,'failure');
  for(const mutate of [t=>{t.anchors.control='6,0';},t=>{t.deltas[0]=2;},t=>{t.tiles[0].terrain='water';},t=>{t.reservedHexes=['6,0'];},t=>{t.tier=2;}]){const altered=structuredClone(topology);mutate(altered);assert.equal(assembleDisplacedFourLocks(altered).status,'failure');}
  assert.equal(hashValue(topology),hash);
  assert.equal(generateDisplacedFourLocksCandidate({seed:0,layoutId:'river',deltas:[0,0,0]}).reasonCode,'displaced-reconstruction-mismatch');
  assert.equal(generateDisplacedFourLocksCandidate({seed:0,layoutId:'river',sourceTopologyHash:'changed'}).reasonCode,'displaced-reconstruction-mismatch');
});
test('saved bounded planner evidence independently certifies both real target-band physical routes',()=>{
  for(const [layout,id]of [['river','orchard-v2-17b09eb354d2a122'],['islands','orchard-v2-91f754b4a76a9a59'],['hedges','orchard-v2-a76ac63b62658806'],['terraces','orchard-v2-3506d26e75f76e17']]){
    const candidate=read(layout,'candidate'),traces=read(layout,'traces'),result=read(layout,'result');assert.equal(traces.length,2);assert.equal(result.attempts.length,2);assert.equal(result.requestedLimits.maxStatesPerInvocation,8000);
    for(const attempt of result.attempts){assert.equal(attempt.requestedMaxStates,8000);assert.equal(attempt.metrics.maxStates,8000);assert.equal(attempt.reportedStateOverage,Math.max(0,attempt.metrics.statesSpent-8000));assert.ok(isTargetBandTeam(1,attempt.cardIds));}
    const certification=certifyCandidate(candidate,traces);assert.deepEqual(JSON.parse(JSON.stringify(certification)),result.certification);assert.equal(certification.evidence.blueprintHash,hashValue(candidate.blueprint));assert.equal(certification.status,'success');assert.equal(certification.certificateId,id);
    assert.equal(verifyTrace(candidate.blueprint,traces[0]).alcove,false);assert.equal(verifyTrace(candidate.blueprint,traces[1]).alcove,true);assert.ok(certification.checks[1].winningShape.holdId);assert.notDeepEqual(certification.checks[0].outputChoice,certification.checks[1].outputChoice);
  }
});
test('real preview and reducer agree on every saved command and reject invalid movement immutably',()=>{
  for(const layout of ['river','islands','hedges','terraces'])for(const trace of read(layout,'traces')){
    let state=createRun(trace.initialRun);
    const water=state.blueprint.tiles.find(t=>t.terrain==='water'||t.terrain==='hedge'),blocked={type:'move',heroId:state.heroes[0].id,expectedRevision:state.revision,payload:{destination:`${water.q},${water.r}`}},before=hashValue(state);
    assert.equal(previewCommand(state,blocked).legal,false);const rejected=reduceCommand(state,blocked);assert.equal(rejected.result.legal,false);assert.equal(hashValue(rejected.state),before);assert.equal(hashValue(state),before);
    for(const [i,command]of trace.commands.entries()){
      const inputHash=hashValue(state),preview=previewCommand(state,command);assert.equal(preview.legal,true);assert.equal(hashValue(state),inputHash);
      const next=reduceCommand(state,command);assert.equal(next.result.legal,true);assert.equal(stateHash(next.state),trace.perCommandHashes[i]);state=next.state;
    }
    assert.equal(state.status,'won');assert.equal(stateHash(state),trace.finalStateHash);
  }
});
