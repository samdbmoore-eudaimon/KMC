import test from 'node:test';
import assert from 'node:assert/strict';
import {balanceHooks,nextBalanceDeduction,compareLoads,solvePuzzle} from './balance.js';
const puzzle={kind:'balance',loads:[1,2,3,4,5,7].map((value,i)=>({id:`load-${i}`,value,visible:i!==5,candidates:i===5?[3,5,7]:[]})),target:11,usedCount:6,reserveCount:0,panCapacity:{left:11,right:11},maxPanCount:{left:4,right:4},incompatiblePairs:[],hiddenLoadId:'load-5',comparisonAllowance:2};
const hiddenValue=value=>({...puzzle,loads:puzzle.loads.map(load=>load.id===puzzle.hiddenLoadId?{...load,value}:load)});

test('next weighing advice depends on printed candidates, never secret truth, and spends no allowance',()=>{
  const ctx={comparisonLog:[],comparisonsUsed:0},content=balanceHooks.createActive(puzzle),before=JSON.stringify({content,ctx});
  const hints=puzzle.loads[5].candidates.map(value=>nextBalanceDeduction(hiddenValue(value),content,ctx));
  assert.ok(hints.every(hint=>hint.type==='comparison'));for(const hint of hints)assert.deepEqual(hint,hints[0]);
  assert.equal(JSON.stringify({content,ctx}),before);assert.equal(balanceHooks.hint(puzzle,content,2,ctx).params.type,'comparison');
});

test('recommended comparison branches identify every candidate within printed allowance',()=>{
  for(const value of [3,5,7]){
    const actual=hiddenValue(value),content=balanceHooks.createActive(actual),ctx={comparisonLog:[],comparisonsUsed:0};let step;
    for(let i=0;i<=actual.comparisonAllowance;i++){
      step=nextBalanceDeduction(actual,content,ctx);
      if(step.type==='inference')break;
      assert.equal(step.type,'comparison',JSON.stringify(step));assert.ok(ctx.comparisonsUsed<actual.comparisonAllowance);
      ctx.comparisonLog.push({left:step.leftLoadIds,right:step.rightLoadIds,result:compareLoads(actual,step.leftLoadIds,step.rightLoadIds)});ctx.comparisonsUsed++;
    }
    assert.equal(step.type,'inference');assert.equal(step.value,value);assert.equal(content.inferredValue,null);
  }
});

test('bounded unknown, exhausted comparisons and impossible knowledge remain honest',()=>{
  const content=balanceHooks.createActive(puzzle);
  assert.equal(nextBalanceDeduction(puzzle,content,{nodeBudget:0}).solverStatus,'unknown');
  const exhausted=nextBalanceDeduction(puzzle,content,{comparisonsUsed:2});assert.equal(exhausted.type,'observation');assert.match(exhausted.text,/No new comparisons remain/);assert.equal('value'in exhausted,false);
  const conflict=nextBalanceDeduction(puzzle,content,{comparisonLog:[{left:['load-5'],right:['load-0'],result:'left-lighter'}]});assert.equal(conflict.type,'conflict');
});

test('allocation hint gives one constructive change backed by a legal solution and leaves draft intact',()=>{
  const visible={...puzzle,hiddenLoadId:null,comparisonAllowance:0,loads:puzzle.loads.map(load=>({...load,visible:true,candidates:[]}))},content=balanceHooks.createActive(visible),before=JSON.stringify(content);
  const step=nextBalanceDeduction(visible,content),solutions=solvePuzzle(visible).solutions;assert.equal(step.type,'constructive-allocation');assert.ok(solutions.some(solution=>solution.assignments[step.loadId]===step.pan));assert.equal(JSON.stringify(content),before);
  assert.equal(nextBalanceDeduction(visible,solutions[0]).type,'ready');
});

test('unique logged inference controls allocation advice even if private truth is replaced in a test',()=>{
  const content=balanceHooks.createActive(puzzle);content.inferredValue=7;
  const ctx={comparisonsUsed:1,comparisonLog:[{left:['load-5'],right:['load-4'],result:'left-heavier'}]};
  const advice=[3,5,7].map(value=>nextBalanceDeduction(hiddenValue(value),content,ctx));for(const step of advice)assert.deepEqual(step,advice[0]);assert.equal(advice[0].type,'constructive-allocation');
});
