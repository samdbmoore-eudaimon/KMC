import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {generateAdvancedSudoku} from './advanced-sudoku.js';
import {generateFourLocksPuzzle} from './four-locks.js';
import {solvePuzzle,nextDeduction,sudokuHooks,validateSudoku} from '../puzzles/sudoku.js';
import {boundedSudokuContradiction} from '../puzzles/human-sudoku.js';
const oracle=createRequire(import.meta.url)('../../../scripts/dev/orchard-v2-maths-oracles.cjs');
const index=id=>Number(id[1])*4+Number(id[3]);
function independent(puzzle){return oracle.sudokuSolutions({givens:puzzle.givens.map(g=>[g.row,g.col,g.value])}).filter(grid=>puzzle.cages.every(c=>c.cellIds.reduce((sum,id)=>sum+grid[Math.floor(index(id)/4)][index(id)%4],0)===c.sum));}
function local(cage,domains){
  const cells=cage.cellIds.map(index),result=[];
  for(let encoded=0;encoded<4**cells.length;encoded++){
    const values=cells.map((_,k)=>1+Math.floor(encoded/4**k)%4);
    if(values.reduce((a,b)=>a+b,0)!==cage.sum||cells.some((i,k)=>!domains[i].includes(values[k])))continue;
    if(cells.some((i,k)=>cells.slice(0,k).some((j,l)=>values[k]===values[l]&&(Math.floor(i/4)===Math.floor(j/4)||i%4===j%4||(Math.floor(i/8)===Math.floor(j/8)&&Math.floor(i%4/2)===Math.floor(j%4/2))))))continue;
    result.push(values);
  }
  return result.sort();
}
function checkReductions(evidence){
  for(const reduction of evidence.reductions){
    const completions=local(reduction,reduction.inputDomains);assert.deepEqual([...reduction.completions].sort(),completions);
    const cells=reduction.cellIds.map(index);
    const removed=cells.map((i,k)=>({index:i,values:reduction.inputDomains[i].filter(v=>!completions.some(values=>values[k]===v))})).filter(r=>r.values.length);
    assert.deepEqual(reduction.removed,removed);
  }
}

test('T5 has exhaustive uniqueness, a real pair and independently verified causal cage chains',()=>{
  for(const seed of [0,29,53,100]){
    const result=generateFourLocksPuzzle({tier:5,seed});assert.equal(result.status,'success');assert.deepEqual(generateFourLocksPuzzle({tier:5,seed}),result);
    assert.ok(result.puzzle.givens.length<=2);assert.ok(result.puzzle.cages.length>=5&&result.puzzle.cages.length<=8);
    const solutions=independent(result.puzzle);assert.equal(solutions.length,1);
    const steps=result.mathematicalEvidence.deductions.steps;assert.ok(steps.flatMap(s=>s.reasonSteps||[]).some(s=>s.type==='naked-pair'));
    assert.ok(steps.some(s=>s.cageChains.length));
    for(const step of steps){
      assert.equal(step.value,solutions[0][step.row][step.col]);checkReductions(step.candidateEvidence);
      for(const chain of step.cageChains){
        const reductions=step.candidateEvidence.reductions,source=reductions[chain.sourceReductionIndex],dependent=reductions[chain.dependentReductionIndex];
        assert.ok(chain.sourceReductionIndex<chain.dependentReductionIndex);assert.notEqual(source.cageId,dependent.cageId);
        const domains=dependent.inputDomains.map(d=>[...d]);
        for(const restored of chain.restored){assert.ok(dependent.cellIds.includes(`r${Math.floor(restored.index/4)}c${restored.index%4}`));assert.ok(source.removed.some(r=>r.index===restored.index&&r.values.join()===restored.values.join()));domains[restored.index]=[...new Set([...domains[restored.index],...restored.values])].sort();}
        const counterfactual=local(dependent,domains);assert.deepEqual([...chain.counterfactualCompletions].sort(),counterfactual);
        assert.ok(chain.dependentRemovals.length);
        for(const removal of chain.dependentRemovals)for(const value of removal.values){const k=dependent.cellIds.map(index).indexOf(removal.index);assert.ok(counterfactual.some(values=>values[k]===value));assert.ok(!dependent.completions.some(values=>values[k]===value));}
      }
    }
  }
  assert.equal(generateFourLocksPuzzle({tier:5,seed:1}).status,'unknown');
  assert.equal(generateFourLocksPuzzle({tier:5,seed:0xffffffff}).status,'unknown');
});

test('one-assumption contradiction has a locally replayable failure and hard budgets',()=>{
  const puzzle=generateFourLocksPuzzle({tier:5,seed:29}).puzzle,content=sudokuHooks.createActive(puzzle),proof=boundedSudokuContradiction(puzzle,content);
  assert.equal(proof.status,'success');assert.equal(proof.branches,1);assert.ok(proof.branchSteps.length<=16);
  const branch={grid:content.grid.map(r=>[...r])};branch.grid[proof.assumption.row][proof.assumption.col]=proof.assumption.value;
  assert.equal(independent({...puzzle,givens:[...puzzle.givens,proof.assumption]}).length,0);
  assert.ok(independent(puzzle).every(grid=>grid[proof.row][proof.col]===proof.value));
  for(const step of proof.branchSteps){assert.deepEqual(step.gridBefore,branch.grid);checkReductions(step.candidateEvidence);assert.deepEqual(nextDeduction(puzzle,branch),Object.fromEntries(Object.entries(step).filter(([key])=>!['gridBefore','candidateEvidence'].includes(key))));assert.notEqual(step.type,'bounded-contradiction');branch.grid[step.row][step.col]=step.value;}
  assert.deepEqual(branch.grid,proof.contradictionGrid);assert.equal(proof.contradiction.reason,'sudoku-empty-domain');checkReductions(proof.contradiction);
  assert.ok(proof.contradiction.candidates.some(d=>d.length===0));
  assert.equal(boundedSudokuContradiction(puzzle,content,{branchBudget:0}).reasonCode,'sudoku-contradiction-budget');
  assert.equal(boundedSudokuContradiction(puzzle,content,{branchBudget:1,placementBudget:0}).status,'unknown');
  for(const opts of [{branchBudget:33},{placementBudget:17},{branchBudget:-1}])assert.equal(boundedSudokuContradiction(puzzle,content,opts).status,'failure');
});

test('seeded T4 targets, canonical solutions and advanced reasons match the independent oracle',()=>{
  const canonical=[[1,3,4,2],[4,2,1,3],[2,4,3,1],[3,1,2,4]];
  for(const seed of [0,1,29,53,100,0xffffffff]){
    const result=generateFourLocksPuzzle({tier:4,seed});assert.equal(result.status,'success');assert.deepEqual(generateFourLocksPuzzle({tier:4,seed}),result);
    const {puzzle,mathematicalEvidence:evidence}=result;
    assert.ok([1,2].includes(puzzle.givens.length));assert.ok(puzzle.cages.length>=5&&puzzle.cages.length<=7);
    for(const cage of puzzle.cages){const cells=cage.cellIds.map(index),seen=new Set([cells[0]]);for(let n=0;n<cells.length;n++)for(const a of cells)if(cells.some(b=>seen.has(b)&&Math.abs(Math.floor(a/4)-Math.floor(b/4))+Math.abs(a%4-b%4)===1))seen.add(a);assert.equal(seen.size,cells.length);}
    const transform=evidence.construction.canonicalTransform,derived=transform.rows.map(r=>transform.cols.map(c=>transform.symbols[canonical[r][c]-1]));
    assert.deepEqual(derived,puzzle.solutionParameters.grid);
    const solutions=independent(puzzle);assert.equal(solutions.length,1);assert.deepEqual(solutions[0],derived);
    const reasons=evidence.deductions.steps.flatMap(s=>s.reasonSteps||[]);assert.ok(reasons.some(s=>s.type==='naked-pair'));assert.ok(reasons.some(s=>s.type==='cage-intersection'));
    for(const step of evidence.deductions.steps){
      assert.equal(step.value,solutions[0][step.row][step.col]);
      for(const reason of [...step.candidateEvidence.reductions,...(step.reasonSteps||[])])for(const removal of reason.removed)assert.ok(solutions.every(grid=>!removal.values.includes(grid[Math.floor(removal.index/4)][removal.index%4])));
    }
    const content=sudokuHooks.createActive(puzzle);for(let n=0;n<16;n++){const step=nextDeduction(puzzle,content,{advanced:false});if(!('value'in step))break;content.grid[step.row][step.col]=step.value;}
    assert.equal(validateSudoku(puzzle,content).valid,false,'Advanced reasoning must do work beyond the complete basic-rule closure');
  }
});
test('every recorded constraint change preserves exhaustive uniqueness',()=>{
  const result=generateFourLocksPuzzle({tier:4,seed:1}),construction=result.mathematicalEvidence.construction,grid=result.puzzle.solutionParameters.grid;
  let puzzle={kind:'sudoku4',size:4,givens:grid.flatMap((row,r)=>row.map((value,c)=>({row:r,col:c,value}))),cages:structuredClone(construction.initialCages)};
  for(const change of construction.changes){
    if(change.type==='remove-given')puzzle.givens=puzzle.givens.filter(g=>g.row*4+g.col!==index(change.cellId));
    if(change.type==='remove-cage')puzzle.cages=puzzle.cages.filter(c=>c.cellIds.join(',')!==change.cellIds.join(','));
    if(change.type==='add-cage')puzzle.cages.push({cellIds:change.cellIds,sum:change.cellIds.reduce((sum,id)=>sum+grid[Math.floor(index(id)/4)][index(id)%4],0)});
    const proof=solvePuzzle(puzzle);assert.equal(proof.exhaustive,true);assert.equal(proof.solutions.length,1);assert.ok(change.unique&&change.solverNodes>0);
  }
  assert.deepEqual(puzzle.givens,result.puzzle.givens);assert.deepEqual(puzzle.cages.map(c=>[c.cellIds,c.sum]),result.puzzle.cages.map(c=>[c.cellIds,c.sum]));
});
test('advanced generation reports bounded unknown and rejects unbounded or invalid requests',()=>{
  const unknown=generateAdvancedSudoku({tier:4,seed:1,maxAttempts:0});assert.equal(unknown.status,'unknown');assert.equal(unknown.attempts,0);
  assert.equal(generateAdvancedSudoku({tier:4,seed:1,maxAttempts:1}).status,'unknown');
  const noProof=generateAdvancedSudoku({tier:4,seed:1,solverNodeBudget:0});assert.equal(noProof.status,'unknown');assert.ok(noProof.rejections.solverUnknown>0);
  for(const patch of [{seed:-1},{seed:1.5},{tier:6},{maxAttempts:32769},{solverNodeBudget:100001}])assert.equal(generateAdvancedSudoku({tier:4,seed:1,...patch}).status,'failure');
});
