import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {generateNativeSudokuPacket,evaluateNativeSudokuPuzzle} from './native-sudoku.js';
import {generateFourLocksPuzzle} from './four-locks.js';
import {hashValue} from '../index.js';
const oracle=createRequire(import.meta.url)('../../../scripts/dev/orchard-v2-maths-oracles.cjs');
const read=file=>JSON.parse(fs.readFileSync(new URL(`../../../docs/expeditions/v2/${file}`,import.meta.url),'utf8'));
const index=id=>Number(id[1])*4+Number(id[3]);
const sameUnit=(a,b)=>Math.floor(a/4)===Math.floor(b/4)||a%4===b%4||(Math.floor(a/8)===Math.floor(b/8)&&Math.floor(a%4/2)===Math.floor(b%4/2));
function localCompletions(reduction){
  const cells=reduction.cellIds.map(index),result=[];
  for(let encoded=0;encoded<4**cells.length;encoded++){
    const values=cells.map((_,k)=>1+Math.floor(encoded/4**k)%4);
    if(values.reduce((a,b)=>a+b,0)!==reduction.sum||cells.some((cell,k)=>!reduction.inputDomains[cell].includes(values[k])))continue;
    if(cells.some((cell,k)=>cells.slice(0,k).some((other,j)=>sameUnit(cell,other)&&values[k]===values[j])))continue;
    result.push(values);
  }
  return result.sort();
}
test('offline native acceptance gate independently proves labelled existing T4/T5 fixtures',()=>{
  for(const [tier,file]of [[4,'tier-4-river-seed-0-followup-20261002'],[5,'tier-5-river-seed-29-bounded-20261002']]){
    const puzzle=read(`certification/four-locks/${file}/candidate.json`).blueprint.puzzle,original=structuredClone(puzzle),proof=evaluateNativeSudokuPuzzle(puzzle,{tier});assert.equal(proof.status,'success');assert.deepEqual(puzzle,original);
    const solutions=oracle.sudokuSolutions({givens:puzzle.givens.map(g=>[g.row,g.col,g.value])}).filter(grid=>puzzle.cages.every(c=>c.cellIds.reduce((sum,id)=>sum+grid[Math.floor(index(id)/4)][index(id)%4],0)===c.sum));
    assert.equal(solutions.length,1);assert.deepEqual(solutions[0],proof.solution);
    const reasons=proof.mathematicalEvidence.deductions.steps.flatMap(s=>s.reasonSteps||[]);assert.ok(reasons.some(s=>s.type==='naked-pair'));if(tier===4)assert.ok(reasons.some(s=>s.type==='cage-intersection'));else assert.ok(proof.mathematicalEvidence.deductions.steps.some(s=>s.cageChains.length));
    const grid=Array.from({length:4},()=>Array(4).fill(null));for(const g of puzzle.givens)grid[g.row][g.col]=g.value;
    for(const step of proof.mathematicalEvidence.deductions.steps){
      assert.deepEqual(step.gridBefore,grid);assert.equal(step.value,solutions[0][step.row][step.col]);
      for(const reduction of step.candidateEvidence.reductions){const completions=localCompletions(reduction);assert.deepEqual([...reduction.completions].sort(),completions);for(const removal of reduction.removed)for(const value of removal.values)assert.ok(!completions.some(values=>values[reduction.cellIds.map(index).indexOf(removal.index)]===value));}
      for(const reason of step.reasonSteps||[])for(const removal of reason.removed)assert.ok(!removal.values.includes(solutions[0][Math.floor(removal.index/4)][removal.index%4]));
      for(const chain of step.cageChains){const dependent=step.candidateEvidence.reductions[chain.dependentReductionIndex],domains=dependent.inputDomains.map(d=>[...d]);for(const removal of chain.restored)domains[removal.index]=[...new Set([...domains[removal.index],...removal.values])];const restored=localCompletions({...dependent,inputDomains:domains});assert.deepEqual([...chain.counterfactualCompletions].sort(),restored);for(const removal of chain.dependentRemovals)for(const value of removal.values)assert.ok(restored.some(values=>values[dependent.cellIds.map(index).indexOf(removal.index)]===value));}
      grid[step.row][step.col]=step.value;
    }
    assert.deepEqual(grid,solutions[0]);assert.equal(evaluateNativeSudokuPuzzle(puzzle,{tier,solverNodeBudget:0}).status,'unknown');
    const disconnected=structuredClone(puzzle);disconnected.cages[0].cellIds=['r0c0','r3c3'];assert.equal(evaluateNativeSudokuPuzzle(disconnected,{tier}).reasonCode,'native-cage-geometry');
    const outsideTarget=structuredClone(puzzle);outsideTarget.givens=[...puzzle.givens,{row:0,col:1,value:1},{row:0,col:2,value:2},{row:0,col:3,value:3}];assert.equal(evaluateNativeSudokuPuzzle(outsideTarget,{tier}).reasonCode,'native-tier-target');
  }
});
test('native packet enforces attempt/solver bounds and labels optional fallback honestly',()=>{
  assert.equal(evaluateNativeSudokuPuzzle(null,{tier:4}).status,'failure');
  const zero=generateNativeSudokuPacket({tier:4,seed:0,maxAttempts:0});assert.equal(zero.status,'unknown');assert.equal(zero.attempts,0);
  const first=generateNativeSudokuPacket({tier:4,seed:0,maxAttempts:1});assert.equal(first.status,'unknown');assert.equal(first.attempts,1);assert.equal(first.rejections.geometry,0);assert.deepEqual(first,generateNativeSudokuPacket({tier:4,seed:0,maxAttempts:1}));
  const noSolver=generateNativeSudokuPacket({tier:4,seed:0,maxAttempts:1,solverNodeBudget:0});assert.equal(noSolver.status,'unknown');assert.ok(noSolver.rejections.solverUnknown>0);
  for(const option of [{maxAttempts:257},{seed:-1},{seed:0x100000000},{tier:3},{solverNodeBudget:100001},{fallbackAttempts:257},{fallbackAttempts:-1}])assert.equal(generateNativeSudokuPacket({tier:4,seed:0,...option}).status,'failure');
  const fallback=generateNativeSudokuPacket({tier:4,seed:0,maxAttempts:256,fallbackAttempts:256});assert.equal(fallback.status,'success');assert.equal(fallback.source,'explicit-template-fallback');assert.equal(fallback.nativeAttempts,0);assert.ok(fallback.attempts<=256);assert.equal(fallback.certified,false);
  const failedFallback=generateNativeSudokuPacket({tier:4,seed:0,maxAttempts:1,fallbackAttempts:1});assert.equal(failedFallback.status,'unknown');assert.equal(failedFallback.attempts,1);assert.equal(failedFallback.fallback.status,'unknown');
});
test('published sixteen-request native comparison credits no unknown or fallback pattern',()=>{
  const comparison=read('fixtures/four-locks-native-comparison.json');assert.equal(comparison.records.length,16);assert.equal(comparison.limits.requests,16);assert.equal(comparison.limits.fallbackAttempts,0);assert.equal(comparison.limits.plannerInvocations,0);
  assert.equal(new Set(comparison.records.map(r=>`${r.tier}/${r.seed}`)).size,16);
  for(const record of comparison.records){assert.equal(record.status,'unknown');assert.equal(record.result.attempts,256);assert.equal(record.result.nativeAttempts,256);assert.equal(record.pattern,null);assert.equal(record.result.rejections.geometry,0);assert.equal(record.result.rejections.clueTarget+record.result.rejections.humanIncomplete+record.result.rejections.techniques,256);}
  assert.deepEqual(comparison.summary.map(s=>s.canonicalPatterns),[0,0]);assert.deepEqual(comparison.summary.map(s=>s.baselinePatterns),[4,3]);
});
test('separate packet leaves pinned default generations and certified candidate hashes intact',()=>{
  const expected=[['903b7d6bfc11f4c6','3dd50b0d2ff0f93c'],['68fdcdf0b0c4e0e7','60c53f915e41ba64'],['549e87a0d73c8acf','bc137d60eb2083fd']];
  for(const tier of [1,2,3])for(const [i,seed]of [1,29].entries())assert.equal(hashValue(generateFourLocksPuzzle({tier,seed})),expected[tier-1][i]);
  const previous=read('fixtures/four-locks-advanced-generation.json');for(const record of previous.records)if(record.status==='success')assert.equal(hashValue(generateFourLocksPuzzle({tier:record.tier,seed:record.seed}).puzzle),record.puzzleHash);
  const source=read('certification/four-locks/tier-1-terraces-seed-1-archetypes-20261002/candidate.json');assert.equal(hashValue(source),'17576a9c85fdeca7');assert.equal(hashValue(source.blueprint),'f0a1f73bbe8af8ac');
});
