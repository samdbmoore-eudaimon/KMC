const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'../..');
const core = [
  ['po-sudoku','primary','Sudoku with linked sum cages','all-different-and-sums',['logicGrid','twoUnknowns']],
  ['po-equation-rotation','primary','Coupled number/operator rotation','finite-wheel-expression-network',['fourOperationsProblems','timesTablesFacts']],
  ['po-balance','primary','Balance partition and limited weighing','partition-and-comparison-tree',['additionSubtraction','twoUnknowns']],
  ['po-nonogram','primary','Nonogram run-length deduction','binary-run-length-lines',['logicGrid','combinatoricsCounting']],
  ['po-polyhex','primary','Polyhex packing','geometric-exact-cover',['spatialPuzzles','shapeProperties']],
  ['lr-ratio','junior','Chained ratio allocation','rational-proportional-conservation',['ratioChain','fractionUnusual']],
  ['lr-bounds','junior','Interval-bound selection','robust-interval-feasibility',['estimation','allocation']],
  ['lr-transform','junior','Coordinate transformation composition','labelled-vertex-transform-composition',['coordGeom','transformations']],
  ['lr-remainder','junior','Remainder and divisibility locks','integer-residue-intersection',['modular','numberProperties']],
  ['lr-truth','junior','Truth-statement logic grid','boolean-statement-models',['truthLiars','gridLogic']],
  ['gf-identity','intermediate','Algebraic identity assembly','universal-symbolic-equivalence',['algebraicManipulation','algebraicProof']],
  ['gf-integer','intermediate','Integer-only resource equations','bounded-integer-lattice',['diophantineEquations','simultaneousEquations']],
  ['gf-schedule','intermediate','Precedence and station scheduling','precedence-and-resource-intervals',['optimisationAndExtremal']],
  ['gf-network','intermediate','Degree-limited spanning network','spanning-degree-cost-graph',['optimisationAndExtremal','combinatoricsAndCounting']],
  ['gf-probability','intermediate','Conditional probability filtering','conditional-exact-sample-space',['advancedProbability','combinatoricsAndCounting']]
].map(([id,moduleKey,title,validator,lessonKeys])=>({id,moduleKey,title,validator,lessonKeys,status:'proposed-core-type',tierCountProposed:5}));
const reserve = [
  ['primary','Flow conservation'],['primary','Parity-state network'],['primary','Constrained ordered route'],['primary','Edge-count enclosure loop'],['primary','Periodic pulse alignment'],
  ['junior','Column-carry digit substitution'],['junior','Area/perimeter construction'],['junior','3D net folding'],['junior','Piecewise mixed-rate journey'],['junior','Adjacency-constrained seating'],
  ['intermediate','Adversarial minimax'],['intermediate','Invariant reachability'],['intermediate','Function composition and iteration'],['intermediate','Circle proof chain'],['intermediate','Distribution reconstruction']
].map(([moduleKey,title])=>({moduleKey,title,status:'reserve-not-certified-distinct'}));
async function main() {
  const [{PRIMARY_LESSONS},{JUNIOR_LESSONS},{INTERMEDIATE_LESSONS}] = await Promise.all([
    import('../../content/primary-lessons.js'),import('../../content/junior-lessons.js'),import('../../content/intermediate-lessons.js')
  ]);
  const lessons={primary:PRIMARY_LESSONS,junior:JUNIOR_LESSONS,intermediate:INTERMEDIATE_LESSONS};
  assert.equal(core.length,15);assert.equal(new Set(core.map(x=>x.id)).size,15);assert.equal(new Set(core.map(x=>x.validator)).size,15);
  for(const key of Object.keys(lessons))assert.equal(core.filter(x=>x.moduleKey===key).length,5);
  for(const item of core)for(const key of item.lessonKeys)assert(lessons[item.moduleKey][key],`${item.id}:${key}`);
  assert.equal(25/5*2,10);assert.equal(25/5*3,15);assert.equal(10-10/5,8);assert.equal(15+10/5,17);
  const goods=[{id:'A',low:8,weight:3},{id:'B',low:7,weight:2},{id:'C',low:5,weight:4}], feasible=[];
  for(let mask=0;mask<8;mask++) {const selection=goods.filter((_,i)=>mask&(1<<i));if(selection.reduce((s,x)=>s+x.weight,0)<=5&&selection.reduce((s,x)=>s+x.low,0)>=15)feasible.push(selection.map(x=>x.id));}
  assert.deepEqual(feasible,[['A','B']]);
  assert.deepEqual([[1,2],[2,2],[1,3]].map(([x,y])=>[-y+4,x+1]),[[2,2],[2,3],[1,2]]);
  assert.deepEqual(Array.from({length:15},(_,i)=>i+1).filter(n=>n%3===1&&n%5===2),[7]);
  assert.deepEqual(['west','east'].filter(location=>[location==='west',location==='east',location!=='east'].filter(Boolean).length===1),['east']);
  assert.deepEqual([2*3,2],[6,2]);assert.notDeepEqual([3,2],[6,2]);
  const integerSolutions=[];for(let x=0;x<=6;x++)for(let y=0;y<=3;y++)if(3*x+5*y===19)integerSolutions.push([x,y]);
  assert.deepEqual(integerSolutions,[[3,2]]);
  const tasks=[{station:1,start:0,end:2},{station:2,start:2,end:5},{station:1,start:2,end:4}];
  assert(tasks[1].start>=tasks[0].end);assert.equal(Math.max(...tasks.map(x=>x.end)),5);
  for(let i=0;i<tasks.length;i++)for(let j=i+1;j<tasks.length;j++)if(tasks[i].station===tasks[j].station)assert(tasks[i].end<=tasks[j].start||tasks[j].end<=tasks[i].start);
  const tree=[['A','B',2],['B','C',1],['C','D',2]], degree={};
  for(const [a,b] of tree){degree[a]=(degree[a]||0)+1;degree[b]=(degree[b]||0)+1;}
  assert.equal(Object.keys(degree).length,4);assert.equal(Math.max(...Object.values(degree)),2);assert.equal(tree.reduce((s,e)=>s+e[2],0),5);
  const bag=['R','R','B','B'],pairs=[];for(let i=0;i<bag.length;i++)for(let j=i+1;j<bag.length;j++)pairs.push([bag[i],bag[j]]);
  const eligible=pairs.filter(p=>p.includes('R'));assert.equal(eligible.length,5);assert.equal(eligible.filter(p=>p.every(c=>c==='R')).length,1);
  const output={status:'design-proposal-not-implemented',coreTypes:core,reserveTypes:reserve,notes:'Distinctness is a product review judgement. Unique validator labels and checked teaching examples do not certify complete puzzle generators or tactical missions.'};
  fs.mkdirSync(path.join(root,'docs/expeditions'),{recursive:true});
  fs.writeFileSync(path.join(root,'docs/expeditions/puzzle-portfolio.json'),JSON.stringify(output,null,2));
  console.log('Checked 15 proposed core types, five per module, existing lesson references and ten LR/GF teaching fixtures. Primary examples are checked by check-expedition-mission-proposal.cjs. Full generators, tier progression and viewport remain to implement.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
