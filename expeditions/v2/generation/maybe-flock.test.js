import test from 'node:test';
import assert from 'node:assert/strict';
import {generateMaybeFlockCandidate,generateFlockPuzzle,maybeFlockOutputs} from './maybe-flock.js';
import {validateBlueprint,hexDistance} from '../index.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';
import {replayRun} from '../run.js';

registerOrchardPuzzleHooks();

const runs=bits=>{const out=[];let n=0;for(const b of [...bits,0]){if(b)n++;else if(n){out.push(n);n=0;}}return out;};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
// Independent solution counter: row bitmask enumeration, no production nonogram code.
function countSolutions(rowClues,columnClues,givens=[]){
  const lines=clue=>Array.from({length:32},(_,m)=>Array.from({length:5},(_,i)=>(m>>i)&1)).filter(l=>same(runs(l),clue));
  const rows=rowClues.map(lines);let count=0;
  (function go(r,grid){
    if(r===5){if(columnClues.every((clue,c)=>same(runs(grid.map(row=>row[c])),clue)))count++;return;}
    for(const line of rows[r]){
      if(givens.some(g=>g.row===r&&line[g.col]!==(g.value==='filled'?1:0)))continue;
      go(r+1,[...grid,line]);
    }
  })(0,[]);
  return count;
}

test('every tier has an independently unique 5x5 pattern with nest-sector coverage',()=>{
  for(const tier of [1,2,3,4,5])for(const seed of [1,2,3]){
    const g=generateFlockPuzzle({tier,seed});assert.equal(g.status,'success',`tier ${tier} seed ${seed}`);
    assert.deepEqual(generateFlockPuzzle({tier,seed}),g,'deterministic');
    const p=g.puzzle,grid=p.solutionParameters.grid;
    assert.equal(countSolutions(p.rowClues,p.columnClues,p.givens),1);
    const filled=grid.flat().filter(v=>v==='filled').length;assert.ok(filled>=8&&filled<=16);
    for(const [sector,rows] of [['north',[0,1]],['east',[2]],['south',[3,4]]])assert.ok(rows.some(r=>grid[r].includes('filled')),`sector ${sector}`);
    const splitLines=[...p.rowClues,...p.columnClues].filter(c=>c.length>1).length;
    assert.ok(splitLines>=[0,1,2,3,3,4][tier]);
    assert.equal(p.givens.length,tier===1?1:0);
    if(tier>=4)assert.equal([...p.rowClues,...p.columnClues].filter(c=>!c.length||(c.length===1&&c[0]===5)).length,0);
    assert.ok(g.mathematicalEvidence.rounds>=[0,2,3,4,4,5][tier],`rounds ${g.mathematicalEvidence.rounds}`);
    if(tier===1)assert.ok(p.givens.every(x=>x.value==='empty'),'printed given is an empty cell, never jam-eligible');
  }
});

test('candidates are schema-valid blueprints with perches, nests, sector enemies and beam outputs',()=>{
  assert.equal(maybeFlockOutputs().length,3);let built=0;
  for(const tier of [1,2,3,4,5])for(let seed=1;seed<=4;seed++){
    const g=generateMaybeFlockCandidate({tier,seed});
    if(g.status!=='success'){assert.equal(g.status,'unknown');continue;}
    built++;assert.deepEqual(generateMaybeFlockCandidate({tier,seed}),g);
    const bp=g.blueprint;assert.equal(validateBlueprint(bp).ok,true);
    assert.deepEqual(bp.commission,{poweredCount:2,selectableOutputIds:['beam-north','beam-east','beam-south']});
    assert.equal(bp.nests.length,3);assert.ok(bp.tiles.every(t=>!t.passageOutputId));
    assert.equal(bp.puzzle.perches.length,3);
    const hexes=new Set([...bp.deployment,...bp.stations.map(s=>s.hex),...bp.puzzle.perches.map(p=>p.hex)]);
    assert.equal(hexes.size,bp.deployment.length+bp.stations.length+3,'perches relocate off reserved tokens');
    for(const perch of bp.puzzle.perches)assert.ok(bp.puzzle.lockGroups.some(l=>l.id===perch.groupId&&l.anchor===perch.hex));
    assert.deepEqual(bp.enemies.map(e=>e.sector),tier===1?['east']:tier===2?['east','north']:['east','north','south']);
    assert.ok(bp.enemies.every(e=>e.wakePhase===(tier>=4?1:2)||(tier===3&&e.wakePhase===2)));
    for(const e of bp.enemies)assert.ok(hexDistance(e.position,bp.puzzle.perches.find(p=>p.sector===e.sector).hex)<=1);
  }
  assert.ok(built>=12,`only ${built} built`);
});

test('direct and alcove plans win through the real reducer and replay (T1-T4)',async()=>{
  const {planOrchardBlueprint}=await import('../../../scripts/dev/orchard-v2-tactical-planner.mjs');
  for(const [tier,cards,planFamily] of [[1,['tuppence','dapple','sorrel'],'alcove-intercept'],[2,['cornix','warden','beeswax'],'alcove-intercept'],[1,['bushel','furrow','pip'],'direct-guard'],[3,['barrow','cobweb','amberly'],'direct-guard'],[4,['barrow','cobweb','harvestmoon'],'direct-guard']]){
    const bp=generateMaybeFlockCandidate({tier,seed:1}).blueprint;
    const result=planOrchardBlueprint({blueprint:bp,teamChoices:[{cardIds:cards}],planFamily,maxStates:30000});
    assert.equal(result.status,'success',JSON.stringify(result.metrics));
    const [trace]=result.traces,replay=replayRun({initialRun:JSON.parse(JSON.stringify(trace.initialRun)),commands:trace.commands,finalStateHash:trace.finalStateHash},{recordHashes:true});
    assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');assert.deepEqual(replay.hashes,trace.perCommandHashes);
  }
});
