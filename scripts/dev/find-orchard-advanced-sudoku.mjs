import fs from 'node:fs';
import {createRequire} from 'node:module';
import {topologyStream} from '../../expeditions/v2/generation/topology.js';
import {solvePuzzle,nextDeduction,validateSudoku,sudokuHooks} from '../../expeditions/v2/puzzles/sudoku.js';
const oracle=createRequire(import.meta.url)('./orchard-v2-maths-oracles.cjs');
const cap=Number(process.argv[2]||5000);if(!Number.isInteger(cap)||cap<1||cap>100000)throw Error('Fixture search must be bounded to1..100000 candidates');
const rng=topologyStream({familyId:'four-locks',tier:4,seed:1},'independent-advanced-fixture-search');
const base=[[1,3,4,2],[4,2,1,3],[2,4,3,1],[3,1,2,4]],templates=[];
const neighbour=(a,b)=>Math.abs(Math.floor(a/4)-Math.floor(b/4))+Math.abs(a%4-b%4)===1;
for(let a=0;a<16;a++)for(let b=a+1;b<16;b++){
  if(neighbour(a,b))templates.push([a,b]);
  for(let c=b+1;c<16;c++)if([neighbour(a,b),neighbour(a,c),neighbour(b,c)].filter(Boolean).length>=2)templates.push([a,b,c]);
}
const counts={examined:0,unique:0,humanComplete:0,pair:0,intersection:0,both:0},examples=[];
for(let attempt=0;attempt<cap;attempt++){
  const symbols=rng.shuffle([1,2,3,4]),bands=rng.shuffle([0,1]),stacks=rng.shuffle([0,1]);
  const rows=bands.flatMap(b=>rng.shuffle([b*2,b*2+1])),cols=stacks.flatMap(b=>rng.shuffle([b*2,b*2+1]));
  const grid=rows.map(r=>cols.map(c=>symbols[base[r][c]-1])),givenIds=rng.shuffle(Array.from({length:16},(_,i)=>i)).slice(0,rng.int(1,2));
  const puzzle={kind:'sudoku4',size:4,givens:givenIds.map(i=>({row:Math.floor(i/4),col:i%4,value:grid[Math.floor(i/4)][i%4]})),cages:rng.shuffle(templates).slice(0,rng.int(5,7)).map((cells,i)=>({id:`cage-${i}`,cellIds:cells.map(n=>`r${Math.floor(n/4)}c${n%4}`),sum:cells.reduce((sum,n)=>sum+grid[Math.floor(n/4)][n%4],0)}))};
  counts.examined++;
  const solved=solvePuzzle(puzzle);if(solved.status!=='success'||!solved.exhaustive||solved.solutions.length!==1)continue;counts.unique++;
  const draft=sudokuHooks.createActive(puzzle),steps=[];
  for(let n=0;n<16;n++){const step=nextDeduction(puzzle,draft);if(!('value'in step))break;steps.push(...(step.reasonSteps||[]),step);draft.grid[step.row][step.col]=step.value;}
  if(!validateSudoku(puzzle,draft).valid)continue;counts.humanComplete++;
  const pair=steps.some(s=>s.type==='naked-pair'),intersection=steps.some(s=>s.type==='cage-intersection');if(pair)counts.pair++;if(intersection)counts.intersection++;
  if(!pair||!intersection)continue;counts.both++;
  const independent=oracle.sudokuSolutions({givens:puzzle.givens.map(g=>[g.row,g.col,g.value])}).filter(candidate=>puzzle.cages.every(cage=>cage.cellIds.reduce((sum,id)=>{const [,r,c]=/r(\d)c(\d)/.exec(id);return sum+candidate[Number(r)][Number(c)];},0)===cage.sum));
  if(independent.length!==1||JSON.stringify(independent[0])!==JSON.stringify(solved.solutions[0].grid))throw Error('Independent uniqueness disagreement');
  examples.push({attempt,puzzle,steps,solution:independent[0],independentUnique:true});if(examples.length===3)break;
}
const result={status:examples.length?'mathematical-fixtures-found-not-tactical-certificates':'unknown',seed:1,candidateCap:cap,counts,examples};
fs.writeFileSync(new URL('../../docs/expeditions/v2/fixtures/advanced-sudoku-search.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,examples:examples.map(e=>({attempt:e.attempt,steps:e.steps.length}))},null,2));
