import test from 'node:test';
import assert from 'node:assert/strict';
import {generateFourLocksCandidate,generateFourLocksPuzzle} from './four-locks.js';
import {solvePuzzle,validateSudoku} from '../puzzles/sudoku.js';
import {validateBlueprint,CHARGE_CAPACITY,stationMaxIntegrity,orchardMaxIntegrity,hashValue} from '../index.js';

test('Four Locks teaching fixture preserves exact givens and published cage totals',()=>{
  const result=generateFourLocksPuzzle({tier:2,seed:1,reference:true});
  assert.equal(result.status,'success');
  assert.deepEqual(result.puzzle.givens,[{row:0,col:0,value:1},{row:3,col:3,value:4}]);
  assert.deepEqual(result.puzzle.cages.map(c=>c.sum),[5,6,6,4,5,3]);
  assert.equal(result.mathematicalEvidence.unique,true);
});
test('ready puzzle tiers have exhaustive uniqueness and a forced human completion chain',()=>{
  for(const tier of [1,2,3])for(const seed of [1,29]){
    const generated=generateFourLocksPuzzle({tier,seed});assert.equal(generated.status,'success');
    const puzzle=generated.puzzle,solved=solvePuzzle(puzzle);
    assert.equal(solved.exhaustive,true);assert.equal(solved.solutions.length,1);
    const grid=Array.from({length:4},()=>Array(4).fill(null));
    for(const given of puzzle.givens)grid[given.row][given.col]=given.value;
    for(const step of generated.mathematicalEvidence.deductions.steps){
      const remaining=solvePuzzle(puzzle,{content:{grid},limit:300});
      assert.equal(remaining.exhaustive,true);assert.ok(remaining.solutions.every(s=>s.grid[step.row][step.col]===step.value));
      grid[step.row][step.col]=step.value;
    }
    assert.equal(validateSudoku(puzzle,{grid}).valid,true);
  }
});
test('candidate schemas preserve production pressure and explicitly lack certification',()=>{
  for(const tier of [1,2,3]){
    const result=generateFourLocksCandidate({tier,seed:1,reference:true});assert.equal(result.status,'success');
    const bp=result.blueprint;assert.equal(validateBlueprint(bp).ok,true);assert.equal(bp.deadline,5);
    for(const station of bp.stations.filter(s=>['number','shape','sustain'].includes(s.id))){assert.equal(station.capacity,CHARGE_CAPACITY[tier-1]);assert.equal(station.maxIntegrity,stationMaxIntegrity(tier));}
    assert.equal(bp.orchardMaxIntegrity,orchardMaxIntegrity(tier));assert.equal(bp.certificateId,null);assert.equal(result.certified,false);
    assert.deepEqual(bp.outputs.map(o=>[o.id,o.cost]),[['bridge',2],['shelter',3],['roots',4],['storm',5]]);
    assert.deepEqual(bp.enemies.map(e=>e.ruleId),tier===1?['jammer']:tier===2?['jammer','hunter']:['jammer','hunter','breaker']);
    assert.deepEqual(generateFourLocksCandidate({tier,seed:1,reference:true}),result);
  }
});
test('advanced candidates remain uncertified and bounded failures are honest',()=>{
  assert.equal(generateFourLocksPuzzle({tier:4,seed:1,maxAttempts:0}).status,'unknown');
  assert.equal(generateFourLocksPuzzle({tier:5,seed:1,maxAttempts:0}).reasonCode,'sudoku-advanced-attempt-budget');
  for(const [tier,seed]of [[4,1],[5,29]]){
    const result=generateFourLocksCandidate({tier,seed});assert.equal(result.status,'success');
    assert.equal(result.certified,false);assert.equal(result.blueprint.certificateId,null);assert.equal(validateBlueprint(result.blueprint).ok,true);
    assert.equal(result.blueprint.puzzle.outputBudget,8);assert.equal(result.blueprint.deadline,5);
    assert.deepEqual(result.blueprint.outputs.map(o=>[o.id,o.cost]),[['bridge',2],['shelter',3],['roots',4],['storm',5]]);
    assert.ok(result.blueprint.enemies.every(e=>e.wakePhase===1));
    assert.ok(result.blueprint.stations.filter(s=>['number','shape','sustain'].includes(s.id)).every(s=>s.capacity===CHARGE_CAPACITY[tier-1]&&s.maxIntegrity===stationMaxIntegrity(tier)));
  }
});
test('T1–3 seeded outputs retain their pinned pre-advanced-generation hashes',()=>{
  const expected=[['903b7d6bfc11f4c6','3dd50b0d2ff0f93c'],['68fdcdf0b0c4e0e7','60c53f915e41ba64'],['549e87a0d73c8acf','bc137d60eb2083fd']];
  for(const tier of [1,2,3])for(const [i,seed]of [1,29].entries())assert.equal(hashValue(generateFourLocksPuzzle({tier,seed})),expected[tier-1][i]);
});
