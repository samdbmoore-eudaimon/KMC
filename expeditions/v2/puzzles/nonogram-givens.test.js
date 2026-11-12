import test from 'node:test';
import assert from 'node:assert/strict';
import {nonogramHooks} from './nonogram.js';

test('filled and empty printed givens are immutable and excluded from disruption',()=>{
  const puzzle={givens:[{cellId:'r0c0',value:'filled'},{row:0,col:1,value:'empty'}],controlHex:'2,5'};
  const active=nonogramHooks.createActive(puzzle);
  active.grid[1][0]='filled';active.grid[2][3]='filled';
  const before=structuredClone(active);
  assert.deepEqual(nonogramHooks.disruptionCandidates(puzzle,active).map(c=>c.memberId),['r1c0','r2c3']);
  for(const id of ['r0c0','r0c1'])assert.deepEqual(nonogramHooks.disrupt(puzzle,active,id),before);
  for(const col of [0,1])assert.equal(nonogramHooks.applyEdit(puzzle,active,{type:'set-cell',row:0,col,value:'unknown'}).reasonCode,'nonogram-given');
  const changed=nonogramHooks.disrupt(puzzle,active,'r1c0');
  assert.equal(changed.grid[1][0],'empty');assert.equal(changed.grid[0][0],'filled');
  assert.deepEqual(active,before);
});

test('a grid whose only filled cells are printed givens has no puzzle disruption target',()=>{
  const puzzle={givens:[{row:3,col:4,value:'filled'}],controlHex:'2,5'};
  assert.deepEqual(nonogramHooks.disruptionCandidates(puzzle,nonogramHooks.createActive(puzzle)),[]);
});
