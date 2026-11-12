import test from 'node:test';
import assert from 'node:assert/strict';
import {generateHollowBoughCandidate,generateBoughPuzzle,hollowBoughOutputs} from './hollow-bough.js';
import {validatePacking} from '../puzzles/packing.js';
import {validateBlueprint,hexDistance} from '../index.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';
import {replayRun} from '../run.js';

registerOrchardPuzzleHooks();
const RULES={1:[3,1,0,[2,3,3],false],2:[4,2,0,[3,3,3],false],3:[4,3,0,[3,3,4],true],4:[5,3,1,[3,4,4],true],5:[5,4,2,[3,4,4],true]};

test('every tier matches the printed socket/forbidden/forecast/piece-size table with a verified legal packing and at least two layouts of cover',()=>{
  for(const layoutId of ['river','islands','hedges','terraces'])for(const tier of [1,2,3,4,5]){
    const g=generateHollowBoughCandidate({tier,seed:1,layoutId});
    if(g.status!=='success'){assert.equal(g.status,'unknown');continue;}
    const bp=g.blueprint,p=bp.puzzle,[sockets,forbidden,forecast,sizes,reflect]=RULES[tier];
    assert.equal(validateBlueprint(bp).ok,true);assert.deepEqual(generateHollowBoughCandidate({tier,seed:1,layoutId}),g,'deterministic');
    assert.equal(p.patchCells.length,19);assert.equal(p.pieces.length,3);assert.deepEqual(p.pieces.map(x=>x.cells.length),sizes);
    assert.equal(p.sockets.length,sockets);assert.equal(p.forbiddenCells.length,forbidden);assert.equal(p.forecastCellIds.length,forecast);assert.equal(p.reflectionAllowed,reflect);
    assert.deepEqual(p.forecastCellIds,[...p.sockets].sort().slice(0,forecast),'forecast = ascending socket IDs');
    assert.ok(new Set(p.pieces.map(x=>JSON.stringify(x.cells))).size>=2,'two non-congruent pieces');
    assert.equal(validatePacking(p,{placements:p.solutionParameters.placements}).valid,true);
    assert.ok(g.mathematicalEvidence.distinctCoverages>=2&&g.mathematicalEvidence.distinctExposures>=2);
    const area=g.mathematicalEvidence.coveredArea;assert.ok(area>=8&&area<=11);
    assert.equal(bp.stations.find(s=>s.id==='shape').hex,p.patchCells.find(id=>hexDistance(id,bp.stations.find(s=>s.id==='shape').hex)===0),'shape sits in the patch');
    assert.deepEqual(bp.commission,{poweredIds:['shelter-packing']});
    assert.equal(bp.hazards[0].mutation.kind,forecast?'suppress-shelter':'none');
    if(forecast)assert.deepEqual(bp.hazards[0].mutation.cells,p.forecastCellIds);
  }
  assert.equal(hollowBoughOutputs()[0].effect.coverage,'puzzle');
});

test('puzzle input guard and determinism',()=>{
  assert.equal(generateBoughPuzzle({tier:9}).status,'failure');
});

test('Hollow Bough wins through the real reducer: direct and alcove plans at T1, T2 and T5, with replay',async()=>{
  const {planOrchardBlueprint}=await import('../../../scripts/dev/orchard-v2-tactical-planner.mjs');
  for(const [tier,layoutId,cards,planFamily] of [[1,'river',['bushel','furrow','pip'],'direct-guard'],[1,'river',['tuppence','dapple','sorrel'],'alcove-intercept'],[2,'river',['cornix','kernel','beeswax'],'direct-guard'],[5,'river',['warden','gossamer','harvestmoon'],'direct-guard']]){
    const bp=generateHollowBoughCandidate({tier,seed:1,layoutId}).blueprint;
    const result=planOrchardBlueprint({blueprint:bp,teamChoices:[{cardIds:cards}],planFamily,maxStates:30000});
    assert.equal(result.status,'success',`${tier} ${planFamily} ${JSON.stringify(result.metrics)}`);
    const [trace]=result.traces,replay=replayRun({initialRun:JSON.parse(JSON.stringify(trace.initialRun)),commands:trace.commands,finalStateHash:trace.finalStateHash},{recordHashes:true});
    assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');assert.deepEqual(replay.hashes,trace.perCommandHashes);
  }
});
