import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {sudokuHooks,solvePuzzle,validateSudoku,nextDeduction} from './sudoku.js';
import {rotationHooks,solvePuzzle as solveRotation,evaluateEquation,activeFace,nextRotationDeduction} from './rotation.js';
import {balanceHooks,solvePuzzle as solveBalance,solveWeighing,compareLoads,validateBalance} from './balance.js';
import {nonogramHooks,solvePuzzle as solveNonogram,lineCandidates,deductionTrace} from './nonogram.js';
import {packingHooks,solvePuzzle as solvePacking,distinctTransforms,validatePacking} from './packing.js';
import {registerOrchardPuzzleHooks,ORCHARD_PUZZLE_HOOKS} from './index.js';
import {getPuzzleHooks} from '../puzzle-hooks.js';
const require=createRequire(import.meta.url);
const oracle=require('../../../scripts/dev/orchard-v2-maths-oracles.cjs');
const reference={kind:'sudoku4',size:4,
  givens:oracle.sudokuReference.givens.map(([row,col,value])=>({row,col,value})),
  cages:oracle.sudokuReference.cages.map(([a,b,sum],i)=>({id:`cage-${i}`,cellIds:[`r${a[0]}c${a[1]}`,`r${b[0]}c${b[1]}`],sum})),
  outputs:[{id:'bridge',cost:2},{id:'shelter',cost:3},{id:'roots',cost:4},{id:'storm',cost:5}],outputBudget:7};

test('production Sudoku matches independent exhaustive reference',()=>{
  const result=solvePuzzle(reference);
  assert.equal(result.status,'success');assert.equal(result.exhaustive,true);
  assert.deepEqual(result.solutions.map(c=>c.grid),oracle.sudokuSolutions(oracle.sudokuReference));
  assert.equal(solvePuzzle(reference,{nodeBudget:0}).status,'unknown');
  assert.equal(solvePuzzle(reference,{limit:0}).status,'failure');
});
test('zero, one and multiple solutions have honest bounded solver status',()=>{
  assert.equal(solvePuzzle({...reference,givens:[{row:0,col:0,value:2},{row:3,col:3,value:4}]}).status,'failure');
  const multiple=solvePuzzle({...reference,givens:[],cages:[]});
  assert.equal(multiple.solutions.length,2);assert.equal(multiple.exhaustive,false);
});
test('malformed Sudoku cages fail before search and do not masquerade as bounded unknown',()=>{
  for(const cages of [{},[{cellIds:['r0c1','r9c1'],sum:5}],[{cellIds:['r0c1','r0c1'],sum:5}],[{cellIds:['r0c1'],sum:3}],[{cellIds:['r0c1','r0c2'],sum:2.5}],[{cellIds:Array(100).fill('r0c1'),sum:300}]]){
    const puzzle={...reference,cages},solved=solvePuzzle(puzzle);
    assert.equal(solved.status,'failure');assert.equal(solved.reasonCode,'sudoku-schema');assert.equal(solved.nodes,0);
    assert.equal(validateSudoku(puzzle,{grid:oracle.sudokuSolutions(oracle.sudokuReference)[0]}).valid,false);
  }
});
test('edits protect givens and domains without mutating source',()=>{
  const active=sudokuHooks.createActive(reference),before=JSON.stringify(active);
  assert.equal(sudokuHooks.applyEdit(reference,active,{type:'set-cell',row:0,col:0,value:2}).ok,false);
  for(const edit of [{row:4,col:1,value:2},{row:0,col:1,value:0},{row:0,col:1,value:2.5}])assert.equal(sudokuHooks.applyEdit(reference,active,{type:'set-cell',...edit}).ok,false);
  const edited=sudokuHooks.applyEdit(reference,active,{type:'set-cell',row:0,col:1,value:3});
  assert.equal(edited.content.grid[0][1],3);assert.equal(JSON.stringify(active),before);
});
test('complete commit enforces cages, all-different, two outputs and budget',()=>{
  const grid=solvePuzzle(reference).solutions[0].grid,content={grid,outputIds:['bridge','storm']};
  assert.equal(sudokuHooks.commit(reference,content,content.outputIds).ok,true);
  assert.equal(sudokuHooks.checkOutputSelection(reference,['roots','storm']).ok,false);
  assert.equal(sudokuHooks.checkOutputSelection(reference,['bridge','bridge']).ok,false);
  assert.equal(sudokuHooks.checkOutputSelection(reference,['bridge','imaginary']).ok,false);
  assert.equal(sudokuHooks.commit(reference,content,['bridge','shelter']).ok,false);
  const wrong=structuredClone(content);wrong.grid[0][1]=4;assert.equal(validateSudoku(reference,wrong).valid,false);
  const incomplete=structuredClone(content);incomplete.grid[0][1]=null;assert.equal(sudokuHooks.commit(reference,incomplete,content.outputIds).ok,false);
  assert.equal(sudokuHooks.evaluate(reference,incomplete).outputTruth.bridge,false);
});
test('canonical jam clears first non-given, environment leaves Four Locks intact',()=>{
  const content={...solvePuzzle(reference).solutions[0],outputIds:['bridge','storm']};
  const candidates=sudokuHooks.disruptionCandidates(reference,content,'jam');
  assert.equal(candidates[0].memberId,'r0c1');assert.deepEqual(candidates[0].groupIds,['row-0','network']);
  assert.deepEqual(sudokuHooks.disruptionCandidates(reference,content,'environment'),[]);
  const changed=sudokuHooks.disrupt(reference,content,candidates[0].memberId,'jam');
  assert.equal(changed.grid[0][1],null);assert.equal(content.grid[0][1],3);
  assert.deepEqual(sudokuHooks.disrupt(reference,content,'r0c0','jam'),content);
  assert.equal(sudokuHooks.evaluate(reference,changed).valid,false);
});
test('every proposed hint value agrees with exhaustive remaining solutions',()=>{
  let draft=sudokuHooks.createActive(reference);
  for(let i=0;i<14;i++) {
    const step=nextDeduction(reference,draft);if(!('value' in step))break;
    const solutions=solvePuzzle(reference,{content:draft,limit:300});
    assert.equal(solutions.status,'success');assert(solutions.solutions.every(s=>s.grid[step.row][step.col]===step.value));
    draft=sudokuHooks.applyEdit(reference,draft,{type:'set-cell',row:step.row,col:step.col,value:step.value}).content;
  }
  assert.equal(validateSudoku(reference,draft).valid,true);
});
test('naked-pair and cage-intersection hints remove only independently impossible candidates',()=>{
  const fixtures=[
    {type:'naked-pair',givens:[],cages:[{id:'pair',cellIds:['r0c0','r0c1'],sum:3}]},
    {type:'cage-intersection',givens:[{row:2,col:3,value:1}],cages:[{id:'linked',cellIds:['r0c0','r1c1','r2c2'],sum:6}]}
  ];
  for(const fixture of fixtures){
    const puzzle={...reference,givens:fixture.givens,cages:fixture.cages},draft=sudokuHooks.createActive(puzzle),before=JSON.stringify(draft),step=nextDeduction(puzzle,draft);
    assert.ok(step.reasonSteps?.some(reason=>reason.type===fixture.type),JSON.stringify(step));
    const solutions=oracle.sudokuSolutions({givens:fixture.givens.map(g=>[g.row,g.col,g.value])}).filter(grid=>fixture.cages.every(cage=>cage.cellIds.reduce((sum,id)=>{const [,r,col]=/r(\d)c(\d)/.exec(id);return sum+grid[Number(r)][Number(col)];},0)===cage.sum));
    assert.ok(solutions.length>0);
    for(const reason of step.reasonSteps)for(const removal of reason.removed)assert.ok(solutions.every(grid=>!removal.values.includes(grid[Math.floor(removal.index/4)][removal.index%4])));
    assert.equal(JSON.stringify(draft),before);
  }
});
test('bounded advanced search fixtures have unique complete chains with both required techniques',()=>{
  const found=require('../../../docs/expeditions/v2/fixtures/advanced-sudoku-search.json');assert.equal(found.examples.length,3);
  for(const fixture of found.examples){
    const result=solvePuzzle(fixture.puzzle);assert.equal(result.exhaustive,true);assert.equal(result.solutions.length,1);
    const draft=sudokuHooks.createActive(fixture.puzzle),types=[];
    for(let n=0;n<16;n++){const step=nextDeduction(fixture.puzzle,draft);if(!('value'in step))break;types.push(...(step.reasonSteps||[]).map(s=>s.type));assert.equal(step.value,fixture.solution[step.row][step.col]);draft.grid[step.row][step.col]=step.value;}
    assert.equal(validateSudoku(fixture.puzzle,draft).valid,true);assert.ok(types.includes('naked-pair'));assert.ok(types.includes('cage-intersection'));
  }
});

const rotation={kind:'equation-wheels',maxActiveOutputs:2,minimumTrueTracksForCommission:3,
  tokens:[
    ...[['A',[2,3,4,5,6,7]],['B',[3,4,5,6,7,8]],['C',[1,2,3,4,5,6]]].map(([id,faces])=>({id,faces,kind:'number',orientation:0,given:false})),
    {id:'O',faces:['=','+','−','×','÷',null],kind:'operator',orientation:0,given:false},
    ...[['eq','operator','='],['plus','operator','+'],['minus','operator','−'],['24','number',24],['11','number',11],['1','number',1]].map(([id,kind,value])=>({id,kind,value,given:true}))
  ],tracks:[{id:'eq1',tokenIds:['A','O','B','eq','24']},{id:'eq2',tokenIds:['B','plus','C','eq','11']},{id:'eq3',tokenIds:['C','minus','A','eq','1']}]};
test('production rotation unique shared-wheel solution matches independent equations',()=>{
  const solved=solveRotation(rotation);assert.equal(solved.status,'success');assert.equal(solved.solutions.length,1);assert.equal(solved.exhaustive,true);
  const orientations=solved.solutions[0].orientations;
  assert.deepEqual(Object.fromEntries(rotation.tokens.filter(t=>t.faces).map(t=>[t.id,activeFace(t.faces,orientations[t.id])])),{A:4,B:6,C:5,O:'×'});
  assert.equal(solveRotation(rotation,{nodeBudget:0}).status,'unknown');
  for(const tokens of [[2,'+',3,'×',4,'=',20],[20,'=',2,'+',3,'×',4],[4,'÷',0,'=',0],[5,'÷',2,'=',2],[1,'=',2,'=',3],[1,null,2,'=',3]])assert.equal(evaluateEquation(tokens).valid,oracle.equation(tokens).valid);
});
test('partial rotation commits only true selected outputs and preserves fixed tokens',()=>{
  const initial=rotationHooks.createActive(rotation),before=JSON.stringify(initial);
  assert.equal(rotationHooks.commit(rotation,initial,[]).ok,true);
  assert.equal(rotationHooks.applyEdit(rotation,initial,{type:'rotate-wheel',wheelId:'24',delta:1}).ok,false);
  assert.equal(rotationHooks.applyEdit(rotation,initial,{type:'rotate-wheel',wheelId:'A',delta:2}).ok,false);
  assert.equal(rotationHooks.applyEdit(rotation,initial,{type:'rotate-wheel',wheelId:'A',delta:-1}).content.orientations.A,5);
  assert.equal(JSON.stringify(initial),before);
  const solved=solveRotation(rotation).solutions[0];solved.outputIds=['eq1','eq2'];assert.equal(rotationHooks.commit(rotation,solved,solved.outputIds).ok,true);
  const disrupted=rotationHooks.disrupt(rotation,solved,'B','rewind');assert.equal(disrupted.orientations.B,(solved.orientations.B+1)%6);
  assert.equal(rotationHooks.disruptionCandidates(rotation,solved)[0].memberId,'A');
  assert.equal(rotationHooks.evaluate(rotation,disrupted).outputTruth.eq1,false);assert.equal(rotationHooks.evaluate(rotation,disrupted).outputTruth.eq2,false);
});
test('rotation hints prove a forced face and give executable steps in either direction',()=>{
  const solutions=solveRotation(rotation,{limit:1000});assert.equal(solutions.exhaustive,true);
  for(const offset of [1,5]){
    let draft=rotationHooks.createActive(rotation);draft.orientations=structuredClone(solutions.solutions[0].orientations);draft.orientations.B=(draft.orientations.B+offset)%6;
    const before=JSON.stringify(draft),step=nextRotationDeduction(rotation,draft);
    assert.equal(step.type,'forced-wheel');assert.equal(step.wheelId,'B');assert.equal(step.steps,1);assert.equal(step.direction,offset===1?'anticlockwise':'clockwise');
    assert.ok(solutions.solutions.every(s=>s.orientations[step.wheelId]===step.orientation));assert.equal(JSON.stringify(draft),before);
    for(let i=0;i<step.steps;i++)draft=rotationHooks.applyEdit(rotation,draft,{type:'rotate-wheel',wheelId:step.wheelId,delta:step.direction==='clockwise'?1:-1}).content;
    assert.equal(nextRotationDeduction(rotation,draft).type,'complete');
  }
});
test('rotation rejects malformed token roles and solves ordinary IDs that match object prototype names',()=>{
  for(const patch of [{faces:'123456'},{kind:'unknown'},{faces:[1,1,2,3,4,5]},{orientation:6}]){
    const bad=structuredClone(rotation);Object.assign(bad.tokens[0],patch);assert.equal(solveRotation(bad).reasonCode,'rotation-schema');
  }
  assert.equal(solveRotation(rotation,{requiredTrackIds:'eq1'}).status,'failure');
  const named=structuredClone(rotation);named.tokens.find(t=>t.id==='A').id='toString';named.tracks.forEach(t=>t.tokenIds=t.tokenIds.map(id=>id==='A'?'toString':id));
  const result=solveRotation(named);assert.equal(result.status,'success');assert.equal(result.solutions.length,1);assert.ok(Object.hasOwn(result.solutions[0].orientations,'toString'));
});
const balance={kind:'balance',loads:[1,2,3,4,5,7].map((value,i)=>({id:`load-${i}`,value,visible:true,candidates:[]})),target:11,panCapacity:{left:11,right:11},usedCount:6,reserveCount:0,maxPanCount:{left:4,right:4},incompatiblePairs:[],hiddenLoadId:null,comparisonAllowance:0};
test('production balance exhaustive allocation identities match independent oracle',()=>{
  const result=solveBalance(balance);assert.equal(result.status,'success');
  const actual=result.solutions.map(c=>balance.loads.map(l=>['left','right','reserve'].indexOf(c.assignments[l.id])).join(','));
  assert.deepEqual(actual.sort(),oracle.allocations([1,2,3,4,5,7],{target:11}).map(p=>p.join(',')).sort());
  assert.equal(solveBalance(balance,{nodeBudget:0}).status,'unknown');
  const draft=balanceHooks.createActive(balance);assert.equal(balanceHooks.applyEdit(balance,draft,{type:'assign-load',loadId:'unknown',pan:'left'}).ok,false);
  assert.equal(balanceHooks.applyEdit(balance,draft,{type:'assign-load',loadId:'load-0',pan:'middle'}).ok,false);
  assert.equal(balanceHooks.commit(balance,draft,['balance-crossing']).ok,false);
  const solved=result.solutions[0],top=balanceHooks.disruptionCandidates(balance,solved)[0];assert.equal(top.memberId,'load-5');
  assert.equal(balanceHooks.disrupt(balance,solved,top.memberId).assignments[top.memberId],'reserve');
});
test('production weighing tree proves every candidate rather than guessing truth',()=>{
  const puzzle=structuredClone(balance);puzzle.hiddenLoadId='load-5';puzzle.loads[5].visible=false;puzzle.loads[5].candidates=[3,5,7];puzzle.comparisonAllowance=2;
  const result=solveWeighing(puzzle);assert.equal(result.status,'success');assert(result.tree.depth<=2);
  for(const value of [3,5,7]){let node=result.tree;while(node.leftLoadIds)node=node.children[compareLoads(puzzle,node.leftLoadIds,node.rightLoadIds,value)];assert.equal(node.value,value);}
  assert.equal(solveWeighing(puzzle,{nodeBudget:0}).status,'unknown');
  assert.throws(()=>compareLoads(puzzle,['load-0'],['load-0']));
  assert.throws(()=>compareLoads(puzzle,['missing'],['load-0']));
});
test('balance rejects malformed load values, reserve totals and unknown pair members before enumeration',()=>{
  for(const patch of [{reserveCount:6},{target:NaN},{incompatiblePairs:[['load-0','missing']]},{loads:balance.loads.map((l,i)=>i?l:{...l,value:1.5})}]){
    const bad={...balance,...patch},result=solveBalance(bad);assert.equal(result.status,'failure');assert.equal(result.nodes,0);assert.equal(result.reasonCode,'balance-schema');
    assert.equal(validateBalance(bad,balanceHooks.createActive(balance)).valid,false);assert.equal(solveWeighing(bad).status,'failure');
  }
});
const nonogram={kind:'nonogram5',size:5,rowClues:[[1],[1],[5],[1],[1]],columnClues:[[1],[1],[5],[1],[1]],givens:[]};
test('production nonogram matches exhaustive oracle and only fills forced cells',()=>{
  const solved=solveNonogram(nonogram);assert.equal(solved.status,'success');assert.equal(solved.solutions.length,1);
  assert.deepEqual(solved.solutions[0].grid.map(r=>r.map(v=>v==='filled'?1:0)),oracle.nonogramSolutions(nonogram.rowClues,nonogram.columnClues)[0]);
  assert.deepEqual(lineCandidates([]),[['empty','empty','empty','empty','empty']]);assert.equal(lineCandidates([2,2]).length,1);
  assert.equal(deductionTrace(nonogram).complete,true);assert.equal(deductionTrace(nonogram).steps.length,25);
  assert.equal(solveNonogram(nonogram,{nodeBudget:0}).status,'unknown');
  assert.equal(nonogramHooks.evaluate(nonogram,nonogramHooks.createActive(nonogram)).valid,false);
  assert.equal(nonogramHooks.checkOutputSelection(nonogram,['beam-north','beam-east']).ok,true);
  assert.equal(nonogramHooks.checkOutputSelection(nonogram,['beam-north','beam-north']).ok,false);
  assert.deepEqual(nonogramHooks.sectorFill(nonogram,solved.solutions[0]),{north:true,east:true,south:true});
  assert.equal(nonogramHooks.disruptionCandidates(nonogram,solved.solutions[0])[0].memberId,'r0c2');
});
test('nonogram rejects malformed clues and locked givens before search',()=>{
  for(const patch of [{rowClues:'11111'},{columnClues:[[4,4],[],[],[],[]]},{givens:[{row:9,col:0,value:'filled'}]},{givens:[{row:0,col:0,value:'unknown'}]},{givens:[{row:0,col:0,value:'filled'},{row:0,col:0,value:'empty'}]}]){
    const result=solveNonogram({...nonogram,...patch});assert.equal(result.status,'failure');assert.equal(result.nodes,0);assert.equal(result.reasonCode,'nonogram-schema');
  }
});
const patch=[];for(let q=-2;q<=2;q++)for(let r=-2;r<=2;r++)if(Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))<=2)patch.push(`${q},${r}`);
const packing={kind:'polyhex',patchCells:patch,pieces:[{id:'a',cells:[[0,0],[1,0]]},{id:'b',cells:[[0,0],[1,0],[0,1]]},{id:'c',cells:[[0,0],[1,0],[2,0]]}],sockets:['0,0','1,0','0,1'],forbiddenCells:['-2,0'],approachCells:['2,-2','-1,2'],reflectionAllowed:false,forecastCellIds:['0,0']};
test('production packing has multiple valid arrangements and explicit suppression checks',()=>{
  const solved=solvePacking(packing);assert.equal(solved.status,'success');assert.equal(solved.solutions.length,2);
  for(const content of solved.solutions){assert.equal(validatePacking(packing,content).valid,true);assert.equal(packingHooks.commissionCheck(packing,content,{suppressedShelterCells:['0,0']}).ok,false);assert.equal(packingHooks.commissionCheck(packing,content,{suppressedShelterCells:[]}).ok,true);}
  assert.equal(solvePacking(packing,{nodeBudget:0}).status,'unknown');
  assert.equal(distinctTransforms(packing.pieces[0]).length,oracle.transforms(packing.pieces[0].cells).length);
  const draft=packingHooks.createActive(packing);
  assert.equal(packingHooks.applyEdit(packing,draft,{type:'place-piece',pieceId:'a',originHex:'9,9',orientation:0,reflected:false}).ok,false);
  assert.equal(packingHooks.applyEdit(packing,draft,{type:'place-piece',pieceId:'a',originHex:'0,0',orientation:0,reflected:true}).ok,false);
  assert.equal(packingHooks.applyEdit(packing,draft,{type:'place-piece',pieceId:'unknown',originHex:'0,0',orientation:0,reflected:false}).ok,false);
  const duplicated=structuredClone(solved.solutions[0]);duplicated.placements.push(duplicated.placements[0]);assert.equal(validatePacking(packing,duplicated).valid,false);
  const active=solved.solutions[0];assert.deepEqual(packingHooks.disrupt(packing,active,'0,0','environment'),active);
  assert.equal(packingHooks.disrupt(packing,active,'a','jam').placements.length,2);
});
test('packing rejects malformed polyhexes and unsafe cells before transform enumeration',()=>{
  for(const bad of [
    {...packing,pieces:[{id:'broken',cells:[]}]},
    {...packing,pieces:[{id:'broken',cells:[[0,0],[9,9]]}]},
    {...packing,pieces:[{id:'broken',cells:[[0,0],[0,0]]}]},
    {...packing,pieces:[{id:'broken',cells:[[0,0],[.5,1]]}]},
    {...packing,patchCells:[...packing.patchCells,'unsafe']},
    {...packing,sockets:['9,9']},
    {...packing,approachCells:[]}
  ]){
    const result=solvePacking(bad);assert.equal(result.status,'failure');assert.equal(result.nodes,0);assert.equal(result.reasonCode,'packing-schema');
    assert.equal(validatePacking(bad,{placements:[]}).valid,false);
  }
  assert.equal(validatePacking(packing,{placements:[null]}).valid,false);
});
test('packing hints extend existing placements without moving them or spoiling free access',()=>{
  let draft=packingHooks.createActive(packing);
  for(let i=0;i<packing.pieces.length;i++){
    const before=JSON.stringify(draft),hint=packingHooks.hint(packing,draft,2);
    assert.equal(hint.params.type,'constructive-placement');assert.equal(JSON.stringify(draft),before);
    const earlier=structuredClone(draft.placements),edit={type:'place-piece',...hint.params.placement},result=packingHooks.applyEdit(packing,draft,edit);
    assert.equal(result.ok,true);draft=result.content;
    for(const placement of earlier)assert.deepEqual(draft.placements.find(p=>p.pieceId===placement.pieceId),placement);
    assert.equal(solvePacking(packing,{content:draft,limit:1}).status,'success');
  }
  assert.equal(validatePacking(packing,draft).valid,true);assert.match(packingHooks.hint(packing,draft,2).text,/shelter fits/);
});
test('all five production hooks register through the frozen Claude registry',()=>{
  registerOrchardPuzzleHooks();for(const [kind,hooks]of Object.entries(ORCHARD_PUZZLE_HOOKS))assert.equal(getPuzzleHooks(kind),hooks);
});
