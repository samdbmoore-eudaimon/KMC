import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {generateFourLocksPuzzle} from '../../expeditions/v2/generation/four-locks.js';
import {orchardGenerationAvailability} from '../../expeditions/v2/generation/index.js';
import {hashValue} from '../../expeditions/v2/index.js';
import {boundedSudokuContradiction,sudokuHooks} from '../../expeditions/v2/puzzles/sudoku.js';

const oracle=createRequire(import.meta.url)('./orchard-v2-maths-oracles.cjs');
const seeds=[0,1,29,53,100,0xffffffff],maxAttempts=256,records=[];
const index=id=>Number(id[1])*4+Number(id[3]);
const independent=puzzle=>oracle.sudokuSolutions({givens:puzzle.givens.map(g=>[g.row,g.col,g.value])}).filter(grid=>puzzle.cages.every(c=>c.cellIds.reduce((sum,id)=>sum+grid[Math.floor(index(id)/4)][index(id)%4],0)===c.sum));
for(const tier of [4,5])for(const seed of seeds){
  const result=generateFourLocksPuzzle({tier,seed,maxAttempts});
  assert.deepEqual(result,generateFourLocksPuzzle({tier,seed,maxAttempts}));
  assert.equal(orchardGenerationAvailability('four-locks',tier),false);
  if(result.status==='success'){
    const solutions=independent(result.puzzle);assert.equal(solutions.length,1);assert.deepEqual(solutions[0],result.puzzle.solutionParameters.grid);
    assert.equal(result.mathematicalEvidence.deductions.complete,true);
    for(const step of result.mathematicalEvidence.deductions.steps)assert.equal(step.value,solutions[0][step.row][step.col]);
    records.push({tier,seed,status:'success',independentSolutionCount:1,puzzleHash:hashValue(result.puzzle),certificateId:null,runtimeAvailable:false,result});
  }else{
    assert.equal(result.status,'unknown');assert.equal(result.reasonCode,'sudoku-advanced-attempt-budget');assert.equal(result.attempts,maxAttempts);
    records.push({tier,seed,status:'unknown',certificateId:null,runtimeAvailable:false,result});
  }
}
const pinned=[['903b7d6bfc11f4c6','3dd50b0d2ff0f93c'],['68fdcdf0b0c4e0e7','60c53f915e41ba64'],['549e87a0d73c8acf','bc137d60eb2083fd']];
const basicHashes=[];
for(const tier of [1,2,3])for(const [i,seed]of [1,29].entries()){
  const hash=hashValue(generateFourLocksPuzzle({tier,seed}));assert.equal(hash,pinned[tier-1][i]);basicHashes.push({tier,seed,hash});
}
const puzzle=records.find(r=>r.tier===5&&r.seed===29).result.puzzle;
const contradiction=boundedSudokuContradiction(puzzle,sudokuHooks.createActive(puzzle));
assert.equal(contradiction.status,'success');assert.equal(contradiction.branches,1);
assert.equal(independent({...puzzle,givens:[...puzzle.givens,contradiction.assumption]}).length,0);
const evidence={schemaVersion:1,kind:'four-locks-advanced-mathematical-proof',command:'node scripts/dev/prove-four-locks-advanced.mjs',limits:{maxAttempts,solverNodeBudget:100000,contradictionBranchBudget:32,contradictionPlacementBudget:16},summary:[4,5].map(tier=>({tier,success:records.filter(r=>r.tier===tier&&r.status==='success').length,unknown:records.filter(r=>r.tier===tier&&r.status==='unknown').length})),basicHashes,records,optionalContradiction:{tier:5,seed:29,independentAssumptionSolutionCount:0,proof:contradiction},limitations:['Mathematical evidence only. No T4/5 mission certification or production-reducer winning trace.','Advanced construction starts from three verified cage patterns; bank topology and pattern diversity acceptance is unproved.','QA-01 and actual private App integration remain pending.'],independentChecks:'advanced-sudoku.test.js checks every recorded local cage completion, elimination, counterfactual chain and contradiction branch.'};
const target=new URL('../../docs/expeditions/v2/fixtures/four-locks-advanced-generation.json',import.meta.url);
fs.writeFileSync(target,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({evidence:target.pathname,summary:evidence.summary,basicHashesPreserved:true,runtimeAvailableT4:false,runtimeAvailableT5:false,contradictionBranches:contradiction.branches}));
