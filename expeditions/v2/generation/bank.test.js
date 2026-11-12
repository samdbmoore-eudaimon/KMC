import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {canonicalTopology,canonicalSudokuPattern,transformAxial,auditFourLocksCoverage} from './bank.js';
const candidate=JSON.parse(fs.readFileSync(new URL('../../../docs/expeditions/v2/certification/four-locks/tier-4-river-seed-0-followup-20261002/candidate.json',import.meta.url),'utf8'));
const blueprint=candidate.blueprint;
const clone=value=>structuredClone(value);
function transformedTopology(bp,rotation,reflected){
  const b=clone(bp),hex=id=>{const [q,r]=transformAxial(id.split(',').map(Number),rotation,reflected);return `${q+19},${r-31}`;};
  b.tiles=b.tiles.map(t=>{const [q,r]=hex(`${t.q},${t.r}`).split(',').map(Number);return {...t,q,r};}).reverse();
  b.stations=b.stations.map(s=>({...s,hex:hex(s.hex)})).reverse();b.deployment=b.deployment.map(hex).reverse();b.orchard.hex=hex(b.orchard.hex);b.sites=b.sites.map(s=>({...s,anchor:hex(s.anchor)}));
  return b;
}
const permutations=a=>a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>i!==j)).map(rest=>[v,...rest])):[[]];
const rows=permutations([0,1]).flatMap(bands=>permutations([0,1]).flatMap(a=>permutations([0,1]).map(b=>[...a.map(i=>bands[0]*2+i),...b.map(i=>bands[1]*2+i)])));
function transformedPuzzle(puzzle,rs=[0,1,2,3],cs=[0,1,2,3],symbols=[1,2,3,4],transpose=false){
  const p=clone(puzzle),cell=id=>{const r=rs.indexOf(Number(id[1])),c=cs.indexOf(Number(id[3]));return transpose?`r${c}c${r}`:`r${r}c${c}`;};
  p.givens=p.givens.map(g=>{const id=cell(`r${g.row}c${g.col}`);return {cellId:id,value:symbols[g.value-1]};}).reverse();
  p.cages=p.cages.map((c,i)=>({...c,id:`renamed-${i}`,cellIds:c.cellIds.map(cell).reverse(),sum:c.sum+100})).reverse();
  p.lockGroups=p.lockGroups.map((g,i)=>({...g,id:`renamed-group-${i}`,memberIds:g.memberIds.map(cell).reverse()})).reverse();
  delete p.solutionParameters;return p;
}
test('topology normalises all twelve D6 transforms, translation, ordering and decorative IDs',()=>{
  const expected=canonicalTopology(blueprint);
  for(const reflected of [false,true])for(let rotation=0;rotation<6;rotation++)assert.deepEqual(canonicalTopology(transformedTopology(blueprint,rotation,reflected)),expected);
  const renamed=clone(blueprint),ids=new Map(renamed.stations.map((s,i)=>[s.id,`station-${i}`]));
  renamed.stations=renamed.stations.map(s=>({...s,role:s.id,id:ids.get(s.id),name:'Changed',artId:'changed',capacity:999}));
  renamed.hazards.forEach(h=>{h.id='changed';h.sites.forEach(s=>{s.id='changed';if(ids.has(s.targetId))s.targetId=ids.get(s.targetId);});});
  renamed.tiles.forEach(t=>{t.id='changed';t.artId='changed';if(t.passageOutputId)t.passageOutputId='renamed-output';});
  renamed.seed=1234;renamed.enemies=[];renamed.orchard.artId='changed';
  assert.deepEqual(canonicalTopology(renamed),expected);
});
test('topology retains material terrain, cost, anchor, passage and hazard roles',()=>{
  const base=canonicalTopology(blueprint).serialization;
  for(const mutate of [b=>{b.tiles[0].terrain=b.tiles[0].terrain==='floor'?'hedge':'floor';},b=>{b.tiles[0].cost=9;},b=>{b.stations.find(s=>s.id==='number').role='shape';},b=>{b.tiles.find(t=>t.passageOutputId).passageOutputId=null;},b=>{b.tiles[0].permanentPassage=true;},b=>{b.hazards[0].sites[0].targetId='number';},b=>{b.hazards[0].mutation.kind='clear';}]){const b=clone(blueprint);mutate(b);assert.notEqual(canonicalTopology(b).serialization,base);}
});
test('Sudoku normalises digit, row, column, band, stack, transpose and constraint renamings',()=>{
  const expected=canonicalSudokuPattern(blueprint.puzzle);
  for(const permutation of rows){assert.deepEqual(canonicalSudokuPattern(transformedPuzzle(blueprint.puzzle,permutation)),expected);assert.deepEqual(canonicalSudokuPattern(transformedPuzzle(blueprint.puzzle,undefined,permutation)),expected);}
  for(const symbols of permutations([1,2,3,4]))assert.deepEqual(canonicalSudokuPattern(transformedPuzzle(blueprint.puzzle,undefined,undefined,symbols)),expected);
  assert.deepEqual(canonicalSudokuPattern(transformedPuzzle(blueprint.puzzle,rows[5],rows[3],[4,2,1,3],true)),expected);
  const redundant=clone(blueprint.puzzle);redundant.cages.push({...redundant.cages[0],id:'duplicate'});redundant.lockGroups.push({...redundant.lockGroups[0],id:'duplicate'});
  assert.deepEqual(canonicalSudokuPattern(redundant),expected);
});
test('Sudoku retains givens, cage shape/shared incidence and protection dependency structure',()=>{
  const base=canonicalSudokuPattern(blueprint.puzzle).serialization;
  for(const mutate of [p=>{p.givens=[];},p=>{p.cages.pop();},p=>{p.cages[0].cellIds=['r0c0','r0c1'];},p=>{p.cages[0].linked=true;},p=>{p.lockGroups.pop();}]){const p=clone(blueprint.puzzle);mutate(p);assert.notEqual(canonicalSudokuPattern(p).serialization,base);}
  const p={kind:'sudoku4',size:4,givens:[{row:0,col:0,value:1},{row:3,col:3,value:1}],cages:[]};
  const different=clone(p);different.givens[1].value=2;assert.notEqual(canonicalSudokuPattern(p).serialization,canonicalSudokuPattern(different).serialization);
});
test('equivalent evidence copies cannot satisfy entry, topology or puzzle-pattern diversity',()=>{
  const entries=[];
  for(let i=0;i<80;i++)entries.push({tier:4,certified:true,layoutId:'river',topology:canonicalTopology(transformedTopology(blueprint,i%6,i%2===0)),puzzle:canonicalSudokuPattern(transformedPuzzle(blueprint.puzzle,rows[i%8],rows[(i+3)%8]))});
  entries.push({...entries[0],tier:5,certified:false});
  const audit=auditFourLocksCoverage(entries),t=audit.tiers[3];assert.equal(t.certifiedRecords,80);assert.equal(t.materialEntries,1);assert.equal(t.puzzlePatterns,1);assert.equal(t.archetypes[0].topologies,1);assert.equal(t.missingEntries,63);assert.equal(t.complete,false);assert.equal(audit.complete,false);assert.equal(audit.tiers[4].materialEntries,0);
});
