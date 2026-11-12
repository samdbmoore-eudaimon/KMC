import {topologyStream} from './topology.js';
import {solvePuzzle} from '../puzzles/sudoku.js';
import {humanSudokuTrace} from '../puzzles/human-sudoku.js';

const CANONICAL=[[1,3,4,2],[4,2,1,3],[2,4,3,1],[3,1,2,4]];
const PATTERNS=[
  {sourceAttempt:9797,rows:[0,1,2,3],cols:[0,1,2,3],symbols:[3,2,4,1],givens:[14],cages:[[6,10,14],[0,1],[5,9,10],[9,10],[10,13,14],[3,6,7]]},
  {sourceAttempt:12538,rows:[0,1,3,2],cols:[0,1,2,3],symbols:[3,4,2,1],givens:[1],cages:[[7,11,15],[10,13,14],[4,5,9],[3,7],[4,5,8]]},
  {sourceAttempt:26186,rows:[0,1,2,3],cols:[0,1,3,2],symbols:[3,1,2,4],givens:[12],cages:[[5,8,9],[11,15],[0,1],[5,6,9],[0,4,8]]}
];
const indices=Array.from({length:16},(_,i)=>i);
const id=i=>`r${Math.floor(i/4)}c${i%4}`;
const adjacent=(a,b)=>Math.abs(Math.floor(a/4)-Math.floor(b/4))+Math.abs(a%4-b%4)===1;
function connected(cells){const seen=new Set([cells[0]]);for(let pass=0;pass<cells.length;pass++)for(const cell of cells)if(cells.some(other=>seen.has(other)&&adjacent(cell,other)))seen.add(cell);return seen.size===cells.length;}
const templates=[];
for(let a=0;a<16;a++)for(let b=a+1;b<16;b++){
  if(adjacent(a,b))templates.push([a,b]);
  for(let c=b+1;c<16;c++)if(connected([a,b,c]))templates.push([a,b,c]);
}
const unique=(puzzle,nodeBudget)=>{const proof=solvePuzzle(puzzle,{nodeBudget});return {ok:proof.status==='success'&&proof.exhaustive&&proof.solutions.length===1,proof};};
const signature=cells=>[...cells].sort((a,b)=>a-b).join(',');

export function generateAdvancedSudoku({tier,seed,maxAttempts=256,solverNodeBudget=100000}){
  if(![4,5].includes(tier)||!Number.isInteger(seed)||seed<0||seed>0xffffffff||!Number.isInteger(maxAttempts)||maxAttempts<0||maxAttempts>32768||!Number.isInteger(solverNodeBudget)||solverNodeBudget<0||solverNodeBudget>100000)return {status:'failure',reasonCode:'sudoku-generator-options'};
  const rng=topologyStream({familyId:'four-locks',tier,seed},'advanced-puzzle'),rejections={geometry:0,clueTarget:0,cageTarget:0,solverUnknown:0,humanIncomplete:0,techniques:0};
  for(let attempt=0;attempt<maxAttempts;attempt++){
    const patternIndex=rng.int(0,PATTERNS.length-1),pattern=PATTERNS[patternIndex],symbols=rng.shuffle([1,2,3,4]),bands=rng.shuffle([0,1]),stacks=rng.shuffle([0,1]);
    const rows=bands.flatMap(b=>rng.shuffle([b*2,b*2+1])),cols=stacks.flatMap(b=>rng.shuffle([b*2,b*2+1]));
    const base=pattern.rows.map(r=>pattern.cols.map(c=>pattern.symbols[CANONICAL[r][c]-1]));
    const solution=rows.map(r=>cols.map(c=>symbols[base[r][c]-1])),map=i=>rows.indexOf(Math.floor(i/4))*4+cols.indexOf(i%4);
    const sets=pattern.cages.map(cells=>cells.map(map).sort((a,b)=>a-b));
    if(sets.some(cells=>!connected(cells))){rejections.geometry++;continue;}
    const targetGivenCount=rng.int(tier===5?0:1,2),targetCageCount=rng.int(5,tier===5?8:7),protectedCells=targetGivenCount?pattern.givens.map(map):[];
    for(const i of rng.shuffle(indices))if(protectedCells.length<targetGivenCount&&!protectedCells.includes(i))protectedCells.push(i);
    const cage=cells=>({cellIds:cells.map(id),sum:cells.reduce((sum,i)=>sum+solution[Math.floor(i/4)][i%4],0)});
    let puzzle={kind:'sudoku4',size:4,givens:indices.map(i=>({row:Math.floor(i/4),col:i%4,value:solution[Math.floor(i/4)][i%4]})),cages:sets.map((cells,i)=>({...cage(cells),id:`cage-${i}`}))};
    const changes=[],initialCages=puzzle.cages.map(c=>({...c,cellIds:[...c.cellIds]}));
    for(const i of rng.shuffle(indices.filter(i=>!protectedCells.includes(i)))){
      const next={...puzzle,givens:puzzle.givens.filter(g=>g.row*4+g.col!==i)},check=unique(next,solverNodeBudget);
      if(check.ok){puzzle=next;changes.push({type:'remove-given',cellId:id(i),unique:true,solverNodes:check.proof.nodes});}
      else if(check.proof.status==='unknown')rejections.solverUnknown++;
    }
    if(puzzle.givens.length!==targetGivenCount){rejections.clueTarget++;continue;}
    for(const entry of rng.shuffle(puzzle.cages)){
      if(puzzle.cages.length<=targetCageCount)break;
      const next={...puzzle,cages:puzzle.cages.filter(c=>c!==entry)},check=unique(next,solverNodeBudget);
      if(check.ok){puzzle=next;changes.push({type:'remove-cage',cellIds:entry.cellIds,unique:true,solverNodes:check.proof.nodes});}
      else if(check.proof.status==='unknown')rejections.solverUnknown++;
    }
    for(const cells of rng.shuffle(templates)){
      if(puzzle.cages.length>=targetCageCount)break;
      if(puzzle.cages.some(c=>signature(c.cellIds.map(s=>Number(s[1])*4+Number(s[3])))===signature(cells)))continue;
      const next={...puzzle,cages:[...puzzle.cages,cage(cells)]},check=unique(next,solverNodeBudget);
      if(check.ok){puzzle=next;changes.push({type:'add-cage',cellIds:cells.map(id),unique:true,solverNodes:check.proof.nodes});}
      else if(check.proof.status==='unknown')rejections.solverUnknown++;
    }
    if(puzzle.cages.length!==targetCageCount){rejections.cageTarget++;continue;}
    puzzle.cages=puzzle.cages.map((c,i)=>({...c,id:`cage-${i}`}));
    if(tier===5)puzzle.humanContradictionAllowed=true;
    const check=unique(puzzle,solverNodeBudget);if(!check.ok){if(check.proof.status==='unknown')rejections.solverUnknown++;continue;}
    const deductions=humanSudokuTrace(puzzle,{allowContradiction:tier===5});if(!deductions.complete){rejections.humanIncomplete++;continue;}
    const reasons=deductions.steps.flatMap(step=>step.reasonSteps||[]);
    const chained=deductions.steps.some(step=>step.cageChains.length>0);
    if(!reasons.some(step=>step.type==='naked-pair')||(tier===4?!reasons.some(step=>step.type==='cage-intersection'):!chained)){rejections.techniques++;continue;}
    return {status:'success',puzzle,solution,attempt,mathematicalEvidence:{unique:true,solverNodes:check.proof.nodes,deductions,construction:{patternIndex,sourceAttempt:pattern.sourceAttempt,canonicalTransform:{rows:rows.map(r=>pattern.rows[r]),cols:cols.map(c=>pattern.cols[c]),symbols:pattern.symbols.map(v=>symbols[v-1])},targetGivenCount,targetCageCount,initialCages,changes},rejections}};
  }
  return {status:'unknown',reasonCode:'sudoku-advanced-attempt-budget',attempts:maxAttempts,rejections};
}
