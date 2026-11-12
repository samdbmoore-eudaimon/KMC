import {clone,ok,fail,cellId,parseCell,selectOutputs} from './common.js';
const STATES=['unknown','filled','empty'];
export function lineClues(line) {
  let count=0;const clues=[];
  for(const value of [...line,'empty'])if(value==='filled')count++;else if(count){clues.push(count);count=0;}
  return clues;
}
export function lineCandidates(clues) {
  if(!Array.isArray(clues)||clues.some(n=>!Number.isInteger(n)||n<1||n>5))return [];
  const signature=JSON.stringify(clues),out=[];
  for(let n=0;n<32;n++){const line=Array.from({length:5},(_,i)=>n&(1<<i)?'filled':'empty');if(JSON.stringify(lineClues(line))===signature)out.push(line);}
  return out;
}
function givenGrid(puzzle) {
  const grid=Array.from({length:5},()=>Array(5).fill('unknown'));
  if(!Array.isArray(puzzle.givens||[]))throw Error('Invalid nonogram givens');
  for(const given of puzzle.givens||[]){const pos=parseCell(given.cellId,5)||[given.row,given.col];if(!pos.every(n=>Number.isInteger(n)&&n>=0&&n<5)||!['filled','empty'].includes(given.value)||grid[pos[0]][pos[1]]!=='unknown')throw Error('Invalid nonogram given');grid[pos[0]][pos[1]]=given.value;}
  return grid;
}
function schemaValid(puzzle) {
  if(!Array.isArray(puzzle?.rowClues)||puzzle.rowClues.length!==5||!Array.isArray(puzzle.columnClues)||puzzle.columnClues.length!==5||![...puzzle.rowClues,...puzzle.columnClues].every(clues=>lineCandidates(clues).length))return false;
  try{givenGrid(puzzle);return true;}catch{return false;}
}
function validDomain(puzzle,content) {
  if(!Array.isArray(content?.grid)||content.grid.length!==5||!content.grid.every(r=>Array.isArray(r)&&r.length===5&&r.every(v=>STATES.includes(v))))return false;
  try{const given=givenGrid(puzzle);return given.every((row,r)=>row.every((v,c)=>v==='unknown'||content.grid[r][c]===v));}catch{return false;}
}
export function validateNonogram(puzzle,content) {
  if(!schemaValid(puzzle))return {valid:false,reason:'nonogram-schema'};
  if(!validDomain(puzzle,content))return {valid:false,reason:'nonogram-domain'};
  if(content.grid.some(r=>r.includes('unknown')))return {valid:false,reason:'nonogram-incomplete'};
  for(let i=0;i<5;i++)if(JSON.stringify(lineClues(content.grid[i]))!==JSON.stringify(puzzle.rowClues[i])||JSON.stringify(lineClues(content.grid.map(r=>r[i])))!==JSON.stringify(puzzle.columnClues[i]))return {valid:false,reason:'nonogram-clue',line:i};
  return {valid:true};
}
export function solvePuzzle(puzzle,{limit=2,nodeBudget=100000,content=null}={}) {
  const solutions=[];let nodes=0,unknown=false;
  if(!schemaValid(puzzle)||!Number.isInteger(limit)||limit<1||!Number.isInteger(nodeBudget)||nodeBudget<0)return {status:'failure',solutions,nodes,reasonCode:'nonogram-schema'};
  let partial;try{partial=content?.grid||givenGrid(puzzle);}catch{return {status:'failure',solutions,nodes,reasonCode:'nonogram-schema'};}
  const rows=puzzle.rowClues.map(lineCandidates),columns=puzzle.columnClues.map(lineCandidates);
  if(!validDomain(puzzle,{grid:partial}))return {status:'failure',solutions,nodes,reasonCode:'nonogram-domain'};
  function visit(grid) {
    if(unknown||solutions.length>=limit)return;if(nodes>=nodeBudget){unknown=true;return;}nodes++;
    if(grid.length===5){solutions.push({grid:clone(grid),outputIds:[]});return;}
    const r=grid.length;
    for(const row of rows[r]) {
      if(row.some((v,c)=>partial[r][c]!=='unknown'&&partial[r][c]!==v))continue;
      const next=[...grid,row];
      if(columns.some((domain,c)=>!domain.some(pattern=>next.every((line,i)=>line[c]===pattern[i]))))continue;
      visit(next);
    }
  }
  visit([]);return {status:unknown?'unknown':solutions.length?'success':'failure',solutions,nodes,exhaustive:!unknown&&solutions.length<limit};
}
export function nextDeduction(puzzle,content) {
  for(const axis of ['row','column'])for(let i=0;i<5;i++) {
    const line=axis==='row'?content.grid[i]:content.grid.map(r=>r[i]);
    const candidates=lineCandidates((axis==='row'?puzzle.rowClues:puzzle.columnClues)[i]).filter(p=>p.every((v,j)=>line[j]==='unknown'||line[j]===v));
    if(!candidates.length)return {type:'conflict',text:`${axis==='row'?'Row':'Column'} ${i+1} cannot match its clues.`,axis,line:i};
    for(let j=0;j<5;j++)if(line[j]==='unknown'&&candidates.every(p=>p[j]===candidates[0][j]))return {type:'line-intersection',axis,line:i,candidateCount:candidates.length,row:axis==='row'?i:j,col:axis==='row'?j:i,value:candidates[0][j],text:`Every remaining pattern for ${axis} ${i+1} makes this cell ${candidates[0][j]}.`};
  }
  return {type:'observation',text:'Use each row and column clue in order, with an empty cell between separate runs.'};
}
export function deductionTrace(puzzle) {
  let content={grid:givenGrid(puzzle)},steps=[];
  for(let n=0;n<25;n++){const step=nextDeduction(puzzle,content);if(!('value'in step))break;steps.push(step);content.grid[step.row][step.col]=step.value;}
  return {complete:validateNonogram(puzzle,content).valid,steps,grid:content.grid};
}
export const nonogramHooks={
  hookInterfaceVersion:1,
  createActive:puzzle=>({grid:givenGrid(puzzle),outputIds:[]}),
  createDraft:(puzzle,active)=>({...clone(active),outputIds:[...(puzzle.defaultOutputIds||active.outputIds)]}),
  applyEdit(puzzle,content,edit) {
    if(edit.type==='select-outputs'){const check=nonogramHooks.checkOutputSelection(puzzle,edit.outputIds);return check.ok?ok({...clone(content),outputIds:[...edit.outputIds]}):check;}
    if(edit.type!=='set-cell')return fail('puzzle-edit-type');
    const {row,col,value}=edit;if(!Number.isInteger(row)||!Number.isInteger(col)||row<0||row>4||col<0||col>4||!STATES.includes(value))return fail('nonogram-domain');
    if(givenGrid(puzzle)[row][col]!=='unknown')return fail('nonogram-given');
    const next=clone(content);next.grid[row][col]=value;return ok(next);
  },
  checkOutputSelection:(puzzle,ids)=>selectOutputs({outputs:['beam-north','beam-east','beam-south']},ids,{count:2}),
  commit(puzzle,content,ids){const selection=nonogramHooks.checkOutputSelection(puzzle,ids);if(!selection.ok)return selection;if(JSON.stringify([...ids].sort())!==JSON.stringify([...content.outputIds].sort()))return fail('puzzle-output-draft-mismatch');const check=validateNonogram(puzzle,content);return check.valid?ok(clone(content)):fail(check.reason,check);},
  evaluate(puzzle,content){const check=validateNonogram(puzzle,content);return {valid:check.valid,outputTruth:Object.fromEntries(['beam-north','beam-east','beam-south'].map(id=>[id,check.valid])),details:check};},
  disruptionCandidates(puzzle,content){const givens=givenGrid(puzzle);return content.grid.flatMap((row,r)=>row.flatMap((v,c)=>v==='filled'&&givens[r][c]==='unknown'?[{memberId:cellId(r,c),groupIds:[`row-${r}`,'network'],hex:puzzle.controlHex}]:[]));},
  disrupt(puzzle,content,id){const p=parseCell(id,5),next=clone(content);if(p&&givenGrid(puzzle)[p[0]][p[1]]==='unknown')next.grid[p[0]][p[1]]='empty';return next;},
  sectorFill(puzzle,content){const result={north:false,east:false,south:false};for(let r=0;r<5;r++)for(let c=0;c<5;c++)if(content.grid[r][c]==='filled')result[puzzle.sectorByCell?.[cellId(r,c)]||(r<2?'north':r===2?'east':'south')]=true;return result;},
  hint(puzzle,content,stage){return {text:stage===1?'Clues show filled runs in order. Separate runs need an empty cell; an unknown cell is not empty.':nextDeduction(puzzle,content).text,params:nextDeduction(puzzle,content)};},
  solutionDraft(puzzle){const content=solvePuzzle(puzzle,{limit:1}).solutions[0]||nonogramHooks.createActive(puzzle),ids=puzzle.defaultOutputIds||['beam-north','beam-east'];return {content:{...content,outputIds:[...ids]},selectedOutputIds:[...ids]};},
  commissionCheck(puzzle,content){const check=validateNonogram(puzzle,content);return check.valid?{ok:true}:fail(check.reason);}
};
