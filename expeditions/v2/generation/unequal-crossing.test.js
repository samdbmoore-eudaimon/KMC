import test from 'node:test';
import assert from 'node:assert/strict';
import {generateUnequalCrossingCandidate,generateUnequalPuzzle,unequalCrossingOutputs} from './unequal-crossing.js';
import {validateBalance,compareLoads,solveWeighing,solvePuzzle} from '../puzzles/balance.js';
import {validateBlueprint} from '../index.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';
import {replayRun} from '../run.js';

registerOrchardPuzzleHooks();

// Independent 3^6 enumeration that does not use the production validator.
function independentPartitions(puzzle){
  const found=new Set();
  const ids=puzzle.loads.map(l=>l.id);
  for(let n=0;n<3**6;n++){
    let x=n;const pan={};for(const id of ids){pan[id]=['left','right','reserve'][x%3];x=Math.floor(x/3);}
    const sum={left:0,right:0},count={left:0,right:0};let reserve=0;
    for(const l of puzzle.loads){if(pan[l.id]==='reserve')reserve++;else{sum[pan[l.id]]+=l.value;count[pan[l.id]]++;}}
    if(reserve!==puzzle.reserveCount||sum.left!==puzzle.target||sum.right!==puzzle.target)continue;
    if(count.left>puzzle.maxPanCount.left||count.right>puzzle.maxPanCount.right)continue;
    if(puzzle.hiddenLoadId&&pan[puzzle.hiddenLoadId]==='reserve')continue;
    if(puzzle.incompatiblePairs.some(([a,b])=>pan[a]===pan[b]&&pan[a]!=='reserve'))continue;
    const side=s=>ids.filter(id=>pan[id]===s).join('+');const a=side('left'),b=side('right');
    found.add(a<b?`${a}|${b}`:`${b}|${a}`);
  }
  return found;
}

function replayTree(puzzle,tree,value){
  let node=tree;
  for(let step=0;step<=puzzle.comparisonAllowance;step++){
    if(node.value!==undefined)return node.value;
    const result=compareLoads(puzzle,node.leftLoadIds,node.rightLoadIds,value);
    node=node.children[result];if(!node)return null;
  }
  return node?.value??null;
}

test('every tier builds a schema-valid puzzle with a reproducible solution and tier-correct shape',()=>{
  for(const tier of [1,2,3,4,5]){
    for(const seed of [1,2,3,4]){
      const first=generateUnequalPuzzle({tier,seed});
      assert.equal(first.status,'success',`tier ${tier} seed ${seed}`);
      assert.deepEqual(generateUnequalPuzzle({tier,seed}),first,'deterministic');
      const p=first.puzzle;
      assert.equal(p.loads.length,6);assert.ok(p.loads.every(l=>l.value>=1&&l.value<=12));
      assert.equal(p.usedCount+p.reserveCount,6);
      if(tier===1){assert.equal(p.usedCount,6);assert.deepEqual(p.maxPanCount,{left:4,right:4});assert.equal(p.incompatiblePairs.length,0);assert.equal(p.hiddenLoadId,null);}
      if(tier===2){assert.ok([4,5].includes(p.usedCount));assert.ok(p.incompatiblePairs.length>=1&&p.incompatiblePairs.length<=2);assert.equal(p.hiddenLoadId,null);}
      if(tier>=3){
        assert.ok(p.usedCount>=4&&p.usedCount<=6);assert.ok(p.incompatiblePairs.length>=1&&p.incompatiblePairs.length<=2);
        assert.equal(p.loads.filter(l=>!l.visible).length,1);
        const h=p.loads.find(l=>l.id===p.hiddenLoadId);assert.equal(h.candidates.length,[0,0,0,3,4,5][tier]);assert.ok(h.candidates.includes(h.value));
        assert.equal(p.comparisonAllowance,[0,0,0,2,3,3][tier]);
      }
      const solved=validateBalance(p,{assignments:p.solutionParameters.assignments,inferredValue:p.solutionParameters.inferredValue});
      assert.equal(solved.valid,true,JSON.stringify(solved));
    }
  }
});

test('partition counts agree with an independent enumeration and exclusions genuinely remove options',()=>{
  for(const tier of [1,2,3,4]){
    const g=generateUnequalPuzzle({tier,seed:2}),p=g.puzzle,independent=independentPartitions(p);
    assert.equal(independent.size,g.mathematicalEvidence.solutionsMirrorReduced);
    assert.ok(independent.size>=1);
    const sol=solvePuzzle(p,{limit:729,nodeBudget:20000});assert.equal(sol.solutions.length,g.mathematicalEvidence.solutionCount);
    if(p.incompatiblePairs.length){
      const without=independentPartitions({...p,incompatiblePairs:[]});
      assert.ok(without.size>independent.size,'exclusion removes at least one otherwise valid partition');
      for(const [a,b] of p.incompatiblePairs)assert.notEqual(p.solutionParameters.assignments[a],p.solutionParameters.assignments[b],'pair is satisfied by the generated solution');
    }
  }
});

test('hidden tiers: the weighing tree is proven within the allowance and every candidate is identified',()=>{
  for(const tier of [3,4,5]){
    for(const seed of [1,2,3]){
      const g=generateUnequalPuzzle({tier,seed}),p=g.puzzle,h=p.loads.find(l=>l.id===p.hiddenLoadId);
      assert.ok(g.mathematicalEvidence.candidatesWithValidAllocation.length>=2,'not inferable from solvability alone');
      const weighing=solveWeighing(p,{nodeBudget:100000});
      assert.equal(weighing.status,'success');assert.ok(weighing.tree.depth<=p.comparisonAllowance);
      for(const candidate of h.candidates)assert.equal(replayTree(p,weighing.tree,candidate),candidate,`candidate ${candidate}`);
      assert.equal(replayTree(p,weighing.tree,h.value),h.value);
    }
  }
});

test('a hidden-tier puzzle with a shortened allowance is not distinguishable, so the allowance is load-bearing',()=>{
  const g=generateUnequalPuzzle({tier:4,seed:1}),p={...g.puzzle,comparisonAllowance:1};
  assert.notEqual(solveWeighing(p,{nodeBudget:100000}).status,'success');
});

test('candidates are full blueprints with the printed outputs, mutation and commissioning for the family',()=>{
  const outputs=unequalCrossingOutputs();
  assert.deepEqual(outputs.map(o=>o.id),['balance-crossing','reserve-benefit']);
  let built=0;
  for(const tier of [1,2,3,4,5]){
    for(let seed=1;seed<=6;seed++){
      const g=generateUnequalCrossingCandidate({tier,seed});
      if(g.status!=='success'){assert.equal(g.status,'unknown');assert.ok(g.reasonCode);continue;}
      built++;
      assert.deepEqual(generateUnequalCrossingCandidate({tier,seed}),g,'deterministic');
      const bp=g.blueprint;assert.equal(validateBlueprint(bp).ok,true);
      assert.equal(bp.familyId,'unequal-crossing');assert.equal(bp.puzzle.kind,'balance');
      assert.deepEqual(bp.commission,{poweredIds:['balance-crossing']});
      assert.deepEqual(bp.puzzle.panStationIds,{left:'shape',right:'sustain'});
      assert.deepEqual(bp.hazards[0].mutation,{kind:'puzzle'});
      assert.ok(bp.tiles.filter(t=>t.passageOutputId).every(t=>t.passageOutputId==='balance-crossing'));
      assert.equal(bp.deadline,5);assert.equal(g.certified,false);
    }
  }
  assert.ok(built>=20,`only ${built} candidates built`);
});

test('a generated candidate wins through the real reducer via the reusable planner, and replays',async()=>{
  const {planOrchardBlueprint}=await import('../../../scripts/dev/orchard-v2-tactical-planner.mjs');
  const bp=generateUnequalCrossingCandidate({tier:3,seed:2}).blueprint;
  const result=planOrchardBlueprint({blueprint:bp,teamChoices:[{cardIds:['barrow','cobweb','amberly']}],planFamily:'direct-guard',maxStates:20000});
  assert.equal(result.status,'success',JSON.stringify(result.metrics));
  const [trace]=result.traces;
  const replay=replayRun({initialRun:JSON.parse(JSON.stringify(trace.initialRun)),commands:trace.commands,finalStateHash:trace.finalStateHash},{recordHashes:true});
  assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');assert.deepEqual(replay.hashes,trace.perCommandHashes);
  assert.ok(trace.rounds<=bp.deadline);
});
