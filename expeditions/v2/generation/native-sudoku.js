import {topologyStream} from './topology.js';
import {solvePuzzle} from '../puzzles/sudoku.js';
import {humanSudokuTrace} from '../puzzles/human-sudoku.js';
import {generateAdvancedSudoku} from './advanced-sudoku.js';

const GRID=[[1,3,4,2],[4,2,1,3],[2,4,3,1],[3,1,2,4]];
const INDICES=Array.from({length:16},(_,i)=>i),id=i=>`r${Math.floor(i/4)}c${i%4}`;
const adjacent=(a,b)=>Math.abs(Math.floor(a/4)-Math.floor(b/4))+Math.abs(a%4-b%4)===1;
const connected=cells=>{const reached=new Set([cells[0]]);for(let n=0;n<cells.length;n++)for(const cell of cells)if(cells.some(other=>reached.has(other)&&adjacent(cell,other)))reached.add(cell);return reached.size===cells.length;};
const TEMPLATES=[];
for(let a=0;a<16;a++)for(let b=a+1;b<16;b++){
  if(adjacent(a,b))TEMPLATES.push([a,b]);
  for(let c=b+1;c<16;c++)if(connected([a,b,c]))TEMPLATES.push([a,b,c]);
}
function checked(puzzle,nodeBudget){const proof=solvePuzzle(puzzle,{nodeBudget});return {unique:proof.status==='success'&&proof.exhaustive&&proof.solutions.length===1,proof};}
export function evaluateNativeSudokuPuzzle(puzzle,{tier,solverNodeBudget=100000}={}){
  if(![4,5].includes(tier)||!Number.isInteger(solverNodeBudget)||solverNodeBudget<0||solverNodeBudget>100000)return {status:'failure',reasonCode:'native-packet-options'};
  if(!puzzle||puzzle.kind!=='sudoku4'||puzzle.size!==4||!Array.isArray(puzzle.givens)||puzzle.givens.length<(tier===4?1:0)||puzzle.givens.length>2||!Array.isArray(puzzle.cages)||puzzle.cages.length<5||puzzle.cages.length>(tier===4?7:8))return {status:'failure',reasonCode:'native-tier-target'};
  if(puzzle.cages.some(c=>!Array.isArray(c.cellIds)||![2,3].includes(c.cellIds.length)||c.cellIds.some(id=>!/^r[0-3]c[0-3]$/.test(id))||new Set(c.cellIds).size!==c.cellIds.length||!connected(c.cellIds.map(id=>Number(id[1])*4+Number(id[3])))))return {status:'failure',reasonCode:'native-cage-geometry'};
  const final=checked(puzzle,solverNodeBudget);
  if(!final.unique)return {status:final.proof.status==='unknown'?'unknown':'failure',reasonCode:final.proof.status==='unknown'?'native-solver-budget':'native-uniqueness-unproved'};
  const deductions=humanSudokuTrace(puzzle,{allowContradiction:tier===5});
  if(!deductions.complete)return {status:'unknown',reasonCode:'native-human-incomplete'};
  const reasons=deductions.steps.flatMap(s=>s.reasonSteps||[]);
  if(!reasons.some(s=>s.type==='naked-pair')||(tier===4?!reasons.some(s=>s.type==='cage-intersection'):!deductions.steps.some(s=>s.cageChains.length)))return {status:'unknown',reasonCode:'native-techniques-unproved'};
  return {status:'success',solution:final.proof.solutions[0].grid,mathematicalEvidence:{unique:true,solverNodes:final.proof.nodes,deductions}};
}
export function generateNativeSudokuPacket({tier,seed,maxAttempts=256,solverNodeBudget=100000,fallbackAttempts=0}={}){
  if(![4,5].includes(tier)||!Number.isInteger(seed)||seed<0||seed>0xffffffff||!Number.isInteger(maxAttempts)||maxAttempts<0||maxAttempts>256||!Number.isInteger(solverNodeBudget)||solverNodeBudget<0||solverNodeBudget>100000||!Number.isInteger(fallbackAttempts)||fallbackAttempts<0||fallbackAttempts>maxAttempts)return {status:'failure',reasonCode:'native-packet-options'};
  const packetId='native-adjacent-v1',nativeBudget=maxAttempts-fallbackAttempts,rng=topologyStream({familyId:'four-locks',tier,seed},packetId),rejections={geometry:0,clueTarget:0,cageTarget:0,solverUnknown:0,humanIncomplete:0,techniques:0};
  for(let attempt=0;attempt<nativeBudget;attempt++){
    const symbols=rng.shuffle([1,2,3,4]),bands=rng.shuffle([0,1]),stacks=rng.shuffle([0,1]),rows=bands.flatMap(b=>rng.shuffle([b*2,b*2+1])),cols=stacks.flatMap(b=>rng.shuffle([b*2,b*2+1]));
    const solution=rows.map(r=>cols.map(c=>symbols[GRID[r][c]-1])),targetGivenCount=rng.int(tier===4?1:0,2),targetCageCount=rng.int(5,tier===4?7:8);
    let puzzle={kind:'sudoku4',size:4,givens:INDICES.map(i=>({row:Math.floor(i/4),col:i%4,value:solution[Math.floor(i/4)][i%4]})),cages:[]};
    const changes=[],cage=cells=>({cellIds:cells.map(id),sum:cells.reduce((s,i)=>s+solution[Math.floor(i/4)][i%4],0)});
    for(const cells of rng.shuffle(TEMPLATES).slice(0,targetCageCount)){
      const next={...puzzle,cages:[...puzzle.cages,cage(cells)]},check=checked(next,solverNodeBudget);
      if(!check.unique){if(check.proof.status==='unknown')rejections.solverUnknown++;break;}
      puzzle=next;changes.push({type:'add-cage',cellIds:cells.map(id),unique:true,solverNodes:check.proof.nodes});
    }
    if(puzzle.cages.length!==targetCageCount){rejections.cageTarget++;continue;}
    for(const i of rng.shuffle(INDICES)){
      if(puzzle.givens.length<=targetGivenCount)break;
      const next={...puzzle,givens:puzzle.givens.filter(g=>g.row*4+g.col!==i)},check=checked(next,solverNodeBudget);
      if(check.unique){puzzle=next;changes.push({type:'remove-given',cellId:id(i),unique:true,solverNodes:check.proof.nodes});}
      else if(check.proof.status==='unknown')rejections.solverUnknown++;
    }
    if(puzzle.givens.length!==targetGivenCount){rejections.clueTarget++;continue;}
    puzzle.cages=puzzle.cages.map((c,i)=>({...c,id:`cage-${i}`}));
    if(tier===5)puzzle.humanContradictionAllowed=true;
    const accepted=evaluateNativeSudokuPuzzle(puzzle,{tier,solverNodeBudget});
    if(accepted.status!=='success'){
      if(accepted.reasonCode==='native-solver-budget')rejections.solverUnknown++;
      else if(accepted.reasonCode==='native-human-incomplete')rejections.humanIncomplete++;
      else rejections.techniques++;
      continue;
    }
    return {status:'success',packetId,source:'native',tier,seed,puzzle,solution,attempts:attempt+1,nativeAttempts:attempt+1,mathematicalEvidence:{...accepted.mathematicalEvidence,construction:{canonicalTransform:{rows,cols,symbols},targetGivenCount,targetCageCount,initialCages:[],changes},rejections},certified:false};
  }
  if(fallbackAttempts){
    const fallback=generateAdvancedSudoku({tier,seed,maxAttempts:fallbackAttempts,solverNodeBudget});
    if(fallback.status==='success')return {...fallback,packetId,source:'explicit-template-fallback',tier,seed,nativeAttempts:nativeBudget,attempts:nativeBudget+fallback.attempt+1,nativeRejections:rejections,certified:false};
    return {status:'unknown',packetId,reasonCode:'native-and-fallback-attempt-budget',attempts:maxAttempts,nativeAttempts:nativeBudget,rejections,fallback:{status:fallback.status,reasonCode:fallback.reasonCode,attempts:fallback.attempts,rejections:fallback.rejections}};
  }
  return {status:'unknown',packetId,reasonCode:'native-attempt-budget',attempts:nativeBudget,nativeAttempts:nativeBudget,rejections};
}
