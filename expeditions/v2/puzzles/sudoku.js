import {clone,ok,fail,cellId,parseCell,selectOutputs,outputIds} from './common.js';

const SIZE=4;
const ALL=[1,2,3,4];
const GROUPS=[
  ...ALL.map((_,r)=>ALL.map((_,c)=>r*4+c)),
  ...ALL.map((_,c)=>ALL.map((_,r)=>r*4+c)),
  ...[0,2].flatMap(r=>[0,2].map(c=>[r*4+c,r*4+c+1,(r+1)*4+c,(r+1)*4+c+1]))
];
const MEMBERS=Array.from({length:16},(_,i)=>GROUPS.filter(g=>g.includes(i)));
const givens=puzzle=>puzzle.givens||[];
function givenGrid(puzzle) {
  const grid=Array.from({length:4},()=>Array(4).fill(null));
  for(const given of givens(puzzle)) {
    const [r,c]=parseCell(given.cellId,4)||[given.row,given.col];
    if(!Number.isInteger(r)||!Number.isInteger(c)||r<0||r>3||c<0||c>3||!ALL.includes(given.value)||grid[r][c]!==null)throw Error('Invalid Sudoku given');
    grid[r][c]=given.value;
  }
  return grid;
}
function cageIndices(puzzle) {
  if(!Array.isArray(puzzle.cages||[]))throw Error('Invalid Sudoku cages');
  return (puzzle.cages||[]).map(cage=>{
    if(!Array.isArray(cage.cellIds)||cage.cellIds.length<2||cage.cellIds.length>3||new Set(cage.cellIds).size!==cage.cellIds.length||!Number.isInteger(cage.sum)||cage.sum<cage.cellIds.length||cage.sum>4*cage.cellIds.length)throw Error('Invalid Sudoku cage');
    return {id:cage.id,indices:cage.cellIds.map(id=>{
    const p=parseCell(id,4);if(!p)throw Error('Invalid Sudoku cage cell');return p[0]*4+p[1];
    }),sum:cage.sum};
  });
}
function shapeValid(grid) {
  return Array.isArray(grid)&&grid.length===4&&grid.every(row=>Array.isArray(row)&&row.length===4&&row.every(v=>v===null||ALL.includes(v)));
}
function consistent(puzzle,grid,complete=false) {
  if(!shapeValid(grid))return {valid:false,reason:'sudoku-domain'};
  const flat=grid.flat(),base=givenGrid(puzzle).flat();
  if(base.some((v,i)=>v!==null&&v!==flat[i]))return {valid:false,reason:'sudoku-given'};
  if(GROUPS.some(group=>{const values=group.map(i=>flat[i]).filter(v=>v!==null);return new Set(values).size!==values.length;}))return {valid:false,reason:'sudoku-repeated'};
  for(const cage of cageIndices(puzzle)) {
    if(new Set(cage.indices).size!==cage.indices.length||!Number.isInteger(cage.sum))return {valid:false,reason:'sudoku-cage-schema'};
    const values=cage.indices.map(i=>flat[i]),sum=values.reduce((s,v)=>s+(v||0),0),missing=values.filter(v=>v===null).length;
    if(!missing&&sum!==cage.sum)return {valid:false,reason:'sudoku-cage-sum',cageId:cage.id};
    if(sum+missing>cage.sum||sum+4*missing<cage.sum)return {valid:false,reason:'sudoku-cage-range',cageId:cage.id};
  }
  if(complete&&flat.includes(null))return {valid:false,reason:'sudoku-incomplete'};
  return {valid:true};
}

function domains(puzzle,grid,trace=null) {
  const flat=grid.flat(),result=flat.map((v,i)=>v===null?ALL.filter(x=>!MEMBERS[i].some(g=>g.some(j=>flat[j]===x))):[v]);
  let changed=true;
  const cages=cageIndices(puzzle);
  while(changed) {
    changed=false;
    for(const cage of cages) {
      const supports=cage.indices.map(()=>new Set()),assignment=[],completions=trace?[]:null,inputDomains=trace?result.map(values=>[...values]):null;
      function visit(j,sum) {
        if(j===cage.indices.length){if(sum===cage.sum){assignment.forEach((v,k)=>supports[k].add(v));completions?.push([...assignment]);}return;}
        const i=cage.indices[j];
        for(const v of result[i]) {
          if(cage.indices.slice(0,j).some((other,k)=>assignment[k]===v&&MEMBERS[i].some(g=>g.includes(other))))continue;
          if(sum+v>cage.sum)continue;
          assignment[j]=v;visit(j+1,sum+v);
        }
      }
      visit(0,0);
      const removed=[];
      cage.indices.forEach((i,j)=>{const next=result[i].filter(v=>supports[j].has(v));if(next.length!==result[i].length){if(trace)removed.push({index:i,values:result[i].filter(v=>!supports[j].has(v))});result[i]=next;changed=true;}});
      if(trace&&removed.length)trace.push({type:'cage-filter',cageId:cage.id,cellIds:cage.indices.map(i=>cellId(Math.floor(i/4),i%4)),sum:cage.sum,inputDomains,completions,removed});
    }
  }
  return result;
}

export function sudokuCandidateEvidence(puzzle,content){
  const validation=validateSudoku(puzzle,content,{complete:false});if(!validation.valid)return {valid:false,reason:validation.reason};
  const reductions=[],candidates=domains(puzzle,content.grid,reductions),empty=candidates.findIndex(values=>!values.length);
  return {valid:empty<0,candidates,reductions,...(empty>=0?{reason:'sudoku-empty-domain',cellId:cellId(Math.floor(empty/4),empty%4)}:{})};
}

export function validateSudoku(puzzle,content,{complete=true}={}) {
  try{return consistent(puzzle,content?.grid,complete);}catch{return {valid:false,reason:'sudoku-schema'};}
}
export function solvePuzzle(puzzle,{limit=2,nodeBudget=100000,content=null}={}) {
  if(!Number.isInteger(limit)||limit<1||!Number.isInteger(nodeBudget)||nodeBudget<0)return {status:'failure',reasonCode:'solver-options',solutions:[],nodes:0};
  let grid;try{grid=content?clone(content.grid):givenGrid(puzzle);givenGrid(puzzle);cageIndices(puzzle);}catch(error){return {status:'failure',reasonCode:'sudoku-schema',solutions:[],nodes:0};}
  const solutions=[];let nodes=0,unknown=false;
  function visit(current) {
    if(solutions.length>=limit||unknown)return;
    if(nodes>=nodeBudget){unknown=true;return;}nodes++;
    if(!consistent(puzzle,current).valid)return;
    const candidates=domains(puzzle,current),flat=current.flat();
    if(candidates.some(d=>!d.length))return;
    let next=-1;
    for(let i=0;i<16;i++)if(flat[i]===null&&(next<0||candidates[i].length<candidates[next].length))next=i;
    if(next<0){if(consistent(puzzle,current,true).valid)solutions.push({grid:clone(current)});return;}
    for(const value of candidates[next]){const copy=clone(current);copy[Math.floor(next/4)][next%4]=value;visit(copy);}
  }
  visit(grid);
  return {status:unknown?'unknown':solutions.length?'success':'failure',solutions,nodes,exhaustive:!unknown&&solutions.length<limit};
}

export function nextDeduction(puzzle,content,{advanced=true}={}) {
  if(!validateSudoku(puzzle,content,{complete:false}).valid)return {type:'conflict',text:'Check the repeated values and the cage totals before filling another cell.'};
  const flat=content.grid.flat(),candidates=domains(puzzle,content.grid);
  if(candidates.some(values=>!values.length))return {type:'conflict',text:'A cell has no possible value. Check the entered numbers against its row, column, box and cage total.'};
  for(let i=0;i<16;i++)if(flat[i]===null&&candidates[i].length===1) {
    const value=candidates[i][0],row=Math.floor(i/4),col=i%4;
    const basic=ALL.filter(v=>!MEMBERS[i].some(g=>g.some(j=>flat[j]===v)));
    return {type:basic.length===1?'single':'cage-single',row,col,value,text:`Row ${row+1}, column ${col+1} can only be ${value}${basic.length===1?' after checking its row, column and box':' when its cage total is included'}.`};
  }
  for(let g=0;g<GROUPS.length;g++)for(const value of ALL) {
    const places=GROUPS[g].filter(i=>flat[i]===null&&candidates[i].includes(value));
    if(places.length===1&&!GROUPS[g].some(i=>flat[i]===value)) {
      const i=places[0],row=Math.floor(i/4),col=i%4;
      return {type:'hidden-single',row,col,value,group:g,text:`${value} has only one possible place in this ${g<4?'row':g<8?'column':'box'}: row ${row+1}, column ${col+1}.`};
    }
  }
  if(advanced){
    const reasons=[];
    for(let iteration=0;iteration<64;iteration++){
      const step=pairElimination(flat,candidates)||cageIntersection(puzzle,flat,candidates);
      if(!step)break;reasons.push(step);
      for(const removal of step.removed)candidates[removal.index]=candidates[removal.index].filter(v=>!removal.values.includes(v));
      if(candidates.some(values=>!values.length))return {type:'conflict',reasonSteps:reasons,text:'These entries leave a cell with no possible value. Check the cage totals and earlier entries.'};
      for(let i=0;i<16;i++)if(flat[i]===null&&candidates[i].length===1){
        const row=Math.floor(i/4),col=i%4,value=candidates[i][0];
        return {type:'derived-single',row,col,value,reasonSteps:reasons,text:`${reasons.map(reason=>reason.text).join(' ')} Row ${row+1}, column ${col+1} must therefore be ${value}.`};
      }
      for(let g=0;g<GROUPS.length;g++)for(const value of ALL){
        const places=GROUPS[g].filter(i=>flat[i]===null&&candidates[i].includes(value));
        if(places.length===1&&!GROUPS[g].some(i=>flat[i]===value)){
          const row=Math.floor(places[0]/4),col=places[0]%4;
          return {type:'derived-hidden-single',row,col,value,reasonSteps:reasons,text:`${reasons.map(reason=>reason.text).join(' ')} Only row ${row+1}, column ${col+1} can now hold ${value} in this ${g<4?'row':g<8?'column':'box'}.`};
        }
      }
    }
    if(reasons.length)return {type:'elimination',reasonSteps:reasons,text:reasons.map(reason=>reason.text).join(' ')};
  }
  return {type:'observation',text:'Compare the remaining cage totals with the missing values in each row, column and box.'};
}

function pairElimination(flat,candidates) {
  for(let g=0;g<GROUPS.length;g++)for(const i of GROUPS[g]){
    if(flat[i]!==null||candidates[i].length!==2)continue;
    const pair=GROUPS[g].filter(j=>flat[j]===null&&candidates[j].length===2&&candidates[j].every(v=>candidates[i].includes(v)));
    if(pair.length!==2||pair[0]!==i)continue;
    const removed=GROUPS[g].filter(j=>flat[j]===null&&!pair.includes(j)).map(index=>({index,values:candidates[index].filter(v=>candidates[i].includes(v))})).filter(r=>r.values.length);
    if(removed.length)return {type:'naked-pair',group:g,cellIds:pair.map(j=>cellId(Math.floor(j/4),j%4)),values:[...candidates[i]],removed,text:`${pair.map(j=>`row ${Math.floor(j/4)+1}, column ${j%4+1}`).join(' and ')} use ${candidates[i].join(' and ')} between them. Remove those values from the other cells in this ${g<4?'row':g<8?'column':'box'}.`};
  }
  return null;
}
function cageIntersection(puzzle,flat,candidates) {
  for(const cage of cageIndices(puzzle)){
    const completions=[],assignment=[];
    const visit=(j,sum)=>{
      if(j===cage.indices.length){if(sum===cage.sum)completions.push([...assignment]);return;}
      const index=cage.indices[j];
      for(const value of candidates[index]){
        if(cage.indices.slice(0,j).some((other,k)=>assignment[k]===value&&MEMBERS[index].some(group=>group.includes(other))))continue;
        assignment[j]=value;visit(j+1,sum+value);
      }
    };
    visit(0,0);if(!completions.length)continue;
    for(const value of ALL){
      if(!completions.every(values=>values.includes(value)))continue;
      const positions=cage.indices.filter((_,k)=>completions.some(values=>values[k]===value));
      for(let g=0;g<GROUPS.length;g++){
        if(!positions.every(index=>GROUPS[g].includes(index)))continue;
        const removed=GROUPS[g].filter(index=>flat[index]===null&&!positions.includes(index)&&candidates[index].includes(value)).map(index=>({index,values:[value]}));
        if(removed.length)return {type:'cage-intersection',cageId:cage.id,group:g,value,cellIds:positions.map(i=>cellId(Math.floor(i/4),i%4)),removed,text:`Cage ${cage.id} must contain ${value}, and every possible place for it is in this ${g<4?'row':g<8?'column':'box'}. Remove ${value} from its other cells.`};
      }
    }
  }
  return null;
}

export function boundedSudokuContradiction(puzzle,content,{branchBudget=32,placementBudget=16}={}){
  if(!Number.isInteger(branchBudget)||branchBudget<0||branchBudget>32||!Number.isInteger(placementBudget)||placementBudget<0||placementBudget>16)return {status:'failure',reasonCode:'sudoku-contradiction-options'};
  const initial=sudokuCandidateEvidence(puzzle,content);if(!initial.valid)return {status:'failure',reasonCode:initial.reason};
  let branches=0;
  for(let cell=0;cell<16;cell++)if(content.grid.flat()[cell]===null&&initial.candidates[cell].length===2)for(const assumedValue of initial.candidates[cell]){
    if(branches>=branchBudget)return {status:'unknown',reasonCode:'sudoku-contradiction-budget',branches};
    branches++;
    const branch={grid:content.grid.map(row=>[...row])},steps=[];
    branch.grid[Math.floor(cell/4)][cell%4]=assumedValue;
    for(let n=0;n<=placementBudget;n++){
      const candidateEvidence=sudokuCandidateEvidence(puzzle,branch),validation=validateSudoku(puzzle,branch,{complete:false});
      let contradiction=!candidateEvidence.valid&&['sudoku-empty-domain','sudoku-cage-sum','sudoku-cage-range'].includes(candidateEvidence.reason)?{...candidateEvidence,...(!validation.valid?{cageId:validation.cageId}:{})}:null;
      const step=contradiction?null:nextDeduction(puzzle,branch);
      if(step?.type==='conflict'&&step.reasonSteps){
        const candidates=candidateEvidence.candidates.map(d=>[...d]);
        for(const reason of step.reasonSteps)for(const r of reason.removed)candidates[r.index]=candidates[r.index].filter(v=>!r.values.includes(v));
        const empty=candidates.findIndex(d=>!d.length);
        if(empty>=0)contradiction={reason:'sudoku-empty-domain',cellId:`r${Math.floor(empty/4)}c${empty%4}`,candidateEvidence,reasonSteps:step.reasonSteps,candidates};
      }
      if(contradiction){
        const value=initial.candidates[cell].find(v=>v!==assumedValue),row=Math.floor(cell/4),col=cell%4;
        return {status:'success',branches,type:'bounded-contradiction',row,col,value,assumption:{row,col,value:assumedValue},branchSteps:steps,contradiction,contradictionGrid:branch.grid,text:`If row ${row+1}, column ${col+1} were ${assumedValue}, the shown deductions would ${contradiction.reason==='sudoku-empty-domain'?'leave a cell with no possible value':'break a cage total'}. Its only other candidate is ${value}.`};
      }
      if(n===placementBudget||!step||!('value'in step))break;
      steps.push({...step,gridBefore:branch.grid.map(row=>[...row]),candidateEvidence});
      branch.grid[step.row][step.col]=step.value;
    }
  }
  return {status:'unknown',reasonCode:'sudoku-no-bounded-contradiction',branches};
}

export const sudokuHooks={
  hookInterfaceVersion:1,
  createActive:puzzle=>({grid:givenGrid(puzzle),outputIds:[]}),
  createDraft:(puzzle,active)=>({...clone(active),outputIds:[...(puzzle.defaultOutputIds||active.outputIds)]}),
  applyEdit(puzzle,content,edit) {
    if(edit.type==='select-outputs') {
      const selected=sudokuHooks.checkOutputSelection(puzzle,edit.outputIds);
      return selected.ok?ok({...clone(content),outputIds:[...edit.outputIds]}):selected;
    }
    if(edit.type!=='set-cell')return fail('puzzle-edit-type');
    const {row,col,value}=edit;
    if(!Number.isInteger(row)||!Number.isInteger(col)||row<0||row>=4||col<0||col>=4||(value!==null&&!ALL.includes(value)))return fail('sudoku-domain');
    if(givenGrid(puzzle)[row][col]!==null)return fail('sudoku-given',{row,col});
    const next=clone(content);next.grid[row][col]=value;return ok(next);
  },
  checkOutputSelection:(puzzle,ids)=>selectOutputs(puzzle,ids,{count:2,budget:puzzle.outputBudget}),
  commit(puzzle,content,ids) {
    const selection=sudokuHooks.checkOutputSelection(puzzle,ids);if(!selection.ok)return selection;
    if(JSON.stringify([...content.outputIds].sort())!==JSON.stringify([...ids].sort()))return fail('puzzle-output-draft-mismatch');
    const check=validateSudoku(puzzle,content);return check.valid?ok(clone(content)):fail(check.reason,check);
  },
  evaluate(puzzle,content) {
    const check=validateSudoku(puzzle,content);
    return {valid:check.valid,outputTruth:Object.fromEntries(outputIds(puzzle).map(id=>[id,check.valid])),details:check};
  },
  disruptionCandidates(puzzle,content,kind) {
    if(kind==='environment')return [];
    const base=givenGrid(puzzle);
    return content.grid.flatMap((row,r)=>row.flatMap((v,c)=>v!==null&&base[r][c]===null?[{memberId:cellId(r,c),groupIds:[`row-${r}`,'network'],hex:puzzle.controlHex}]:[]));
  },
  disrupt(puzzle,content,memberId) {
    const pos=parseCell(memberId,4),next=clone(content);
    if(pos&&givenGrid(puzzle)[pos[0]][pos[1]]===null)next.grid[pos[0]][pos[1]]=null;
    return next;
  },
  hint(puzzle,content,stage) {
    let step=nextDeduction(puzzle,content);
    if(puzzle.humanContradictionAllowed&&!('value'in step)){const proof=boundedSudokuContradiction(puzzle,content);if(proof.status==='success')step=proof;}
    return {text:stage===1?'Each row, column and box uses 1, 2, 3 and 4 once. Cage cells must add to their shown total.':step.text,params:step};
  },
  solutionDraft(puzzle) {
    const solved=solvePuzzle(puzzle,{limit:1});
    if(solved.status!=='success')return {grid:givenGrid(puzzle),outputIds:[]};
    const ids=puzzle.defaultOutputIds||outputIds(puzzle).flatMap((a,i)=>outputIds(puzzle).slice(i+1).map(b=>[a,b])).find(pair=>sudokuHooks.checkOutputSelection(puzzle,pair).ok)||[];
    return {content:{...solved.solutions[0],outputIds:[...ids]},selectedOutputIds:[...ids]};
  },
  commissionCheck(puzzle,content,ctx) {
    const check=validateSudoku(puzzle,content);
    if(!check.valid)return fail(check.reason);
    return ctx.poweredOutputIds.length===2?{ok:true}:fail('puzzle-output-count',{count:2});
  }
};
