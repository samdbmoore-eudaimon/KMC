const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const m=require('./orchard-v2-maths-oracles.cjs');
const expectedSudoku=[[1,3,4,2],[4,2,1,3],[2,4,3,1],[3,1,2,4]];

test('independent enumeration: 288 Sudoku grids, unique reference and inconsistent given',()=>{
  assert.equal(m.sudokuSolutions().length,288);
  assert.deepEqual(m.sudokuSolutions(m.sudokuReference),[expectedSudoku]);
  assert.equal(m.sudokuSolutions({...m.sudokuReference,givens:[[0,0,2],[3,3,4]]}).length,0);
});
test('six sector index wraps in both directions; blank remains blank',()=>{
  const faces=['=','+','−','×','÷',null];
  assert.deepEqual(Array.from({length:6},(_,i)=>m.activeFace(faces,i)),['=',null,'÷','×','−','+']);
  for(let i=-12;i<=12;i++)assert.equal(m.activeFace(faces,i),m.activeFace(faces,i+6));
});
test('equations use explicit left association and equality in either operator slot',()=>{
  assert.equal(m.equation([2,'+',3,'×',4,'=',20]).powered,true);
  assert.equal(m.equation([20,'=',2,'+',3,'×',4]).powered,true);
  assert.equal(m.equation([2,'+',3,'=',1,'+',4]).powered,true);
  assert.equal(m.equation([2,'+',3,'×',4,'=',14]).powered,false);
  for(const tokens of [[1,'=',2,'=',3],[1,null,2,'=',3],[5,'÷',2,'=',2],[4,'÷',0,'=',0],[1,'−',2,'=',0],[24,'×',6,'=',100]])assert.equal(m.equation(tokens).valid,false);
  assert.equal(m.equation([8,'÷',2,'=',4]).powered,true);
});
test('balance enumerates legal partitions and keeps equal-valued identities distinct',()=>{
  const solutions=m.allocations([1,2,3,4,5,7],{target:11});
  assert(solutions.some(p=>JSON.stringify(p)===JSON.stringify([1,1,1,0,1,0])));
  assert.equal(solutions.length,4);
  assert.equal(m.allocations([1,1,2,2,3,3],{target:3,usedCount:4,maxCount:2}).length,4);
  assert.equal(m.allocations([1,2,3,4,5,7],{target:11,capacity:10}).length,0);
  assert(m.allocations([1,2,3,4,5,7],{target:11,pairs:[[3,5]]}).every(p=>p[3]!==p[5]));
});
test('weighing tree distinguishes every hidden candidate within advertised allowance',()=>{
  const known=[1,2,3,4,5],candidates=[2,4,6,8,10],tree=m.weighingTree(known,candidates,3);
  assert(tree&&tree.depth<=3);
  for(const candidate of candidates) {
    let node=tree,count=0;
    while(node.pans){const outcome=Math.sign([...known,candidate].reduce((s,v,i)=>s+(node.pans[i]===0?v:node.pans[i]===1?-v:0),0));node=node.children[outcome];count++;}
    assert.equal(node.value,candidate);assert(count<=3);
  }
  assert.equal(m.weighingTree([1],[7,8,9],3),null);
});
test('nonogram empty clues, ordered runs, separators and forced-only hints',()=>{
  assert.deepEqual(m.linePatterns([]),[[0,0,0,0,0]]);
  assert.equal(m.linePatterns([2,2]).length,1);
  assert.deepEqual(m.runs([1,1,0,1,1]),[2,2]);
  assert.deepEqual(m.forcedLine([3],[null,null,null,null,null]),[{index:2,value:1}]);
  assert.deepEqual(m.forcedLine([1],[null,null,null,null,null]),[]);
  const clues=[[1],[1],[5],[1],[1]];
  assert.deepEqual(m.nonogramSolutions(clues,clues),[[[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0]]]);
  assert.equal(m.nonogramSolutions(clues,clues,[[0,0,1]]).length,0);
});
test('polyhex D6 transformations preserve cells and deduplicate rotations',()=>{
  for(const p of [[1,0],[1,1],[-2,1]]){let q=p;for(let i=0;i<6;i++)q=m.rotate(q);assert.deepEqual(q,p);assert.deepEqual(m.reflect(m.reflect(p)),p);}
  assert.equal(m.transforms([[0,0],[1,0]]).length,3);
  assert.equal(m.transforms([[0,0],[1,0],[0,1]]).length,2);
  assert.equal(m.transforms([[0,0],[1,0],[2,0],[1,1]],true).length,12);
});
test('packing rejects clipping, overlap, forbidden cells and disconnected free space',()=>{
  const patch=[];for(let q=-2;q<=2;q++)for(let r=-2;r<=2;r++)if(Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))<=2)patch.push([q,r]);
  const pieces=[[[-2,0],[-2,1]],[[-1,-1],[0,-2],[1,-2]],[[2,0],[2,-1],[1,0]]];
  const approach=[[0,0]];
  assert.equal(m.packingLegal(patch,pieces,[[-2,0]],[],approach),true);
  assert.equal(m.packingLegal(patch,[...pieces,[[-2,0]]],[],[],approach),false);
  assert.equal(m.packingLegal(patch,[[[3,0]]],[],[],approach),false);
  assert.equal(m.packingLegal(patch,pieces,[[0,0]],[],approach),false);
  assert.equal(m.packingLegal(patch,pieces,[],[[-2,0]],approach),false);
  assert.equal(m.packingLegal(patch,pieces,[],[],[]),false);
});

const out=path.resolve(__dirname,'../../docs/expeditions/v2/fixtures');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'maths-reference.json'),JSON.stringify({status:'independent-mathematics-only',sudoku:{...m.sudokuReference,solution:expectedSudoku},rotation:{faces:['=','+','−','×','÷',null],validExamples:[[2,'+',3,'×',4,'=',20],[20,'=',2,'+',3,'×',4]],reference:{A:4,B:6,C:5,O:'×'}},balance:{weights:[1,2,3,4,5,7],target:11,allocations:m.allocations([1,2,3,4,5,7],{target:11})},nonogram:{tutorialOnly:true,rowClues:[[1],[1],[5],[1],[1]],colClues:[[1],[1],[5],[1],[1]]},notCertified:['production puzzle ABI','tactical playability','human difficulty ladders','procedural banks']},null,2)+'\n');
