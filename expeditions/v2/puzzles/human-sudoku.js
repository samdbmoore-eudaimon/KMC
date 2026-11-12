import {nextDeduction,validateSudoku,sudokuHooks,sudokuCandidateEvidence,boundedSudokuContradiction} from './sudoku.js';

const index=id=>Number(id[1])*4+Number(id[3]);
const sameUnit=(a,b)=>Math.floor(a/4)===Math.floor(b/4)||a%4===b%4||(Math.floor(a/8)===Math.floor(b/8)&&Math.floor(a%4/2)===Math.floor(b%4/2));
function localCompletions(cells,sum,domains){
  const values=[],result=[];
  function visit(k,total){
    if(k===cells.length){if(total===sum)result.push([...values]);return;}
    for(const value of domains[cells[k]]){
      if(cells.slice(0,k).some((cell,j)=>sameUnit(cell,cells[k])&&values[j]===value))continue;
      values[k]=value;visit(k+1,total+value);
    }
  }
  visit(0,0);return result;
}

export function cageDeductionChains(evidence){
  const chains=[],reductions=evidence.reductions||[];
  for(let b=1;b<reductions.length;b++)for(let a=0;a<b;a++){
    const source=reductions[a],dependent=reductions[b];if(source.cageId===dependent.cageId)continue;
    const cells=dependent.cellIds.map(index),domains=dependent.inputDomains.map(d=>[...d]);
    const shared=source.removed.filter(r=>cells.includes(r.index)&&r.values.some(v=>!domains[r.index].includes(v)));
    if(!shared.length)continue;
    for(const removal of shared)domains[removal.index]=[...new Set([...domains[removal.index],...removal.values])].sort();
    const counterfactualCompletions=localCompletions(cells,dependent.sum,domains);
    const dependentRemovals=dependent.removed.map(r=>({index:r.index,values:r.values.filter(v=>counterfactualCompletions.some(values=>values[cells.indexOf(r.index)]===v))})).filter(r=>r.values.length);
    if(dependentRemovals.length)chains.push({sourceReductionIndex:a,dependentReductionIndex:b,sourceCageId:source.cageId,dependentCageId:dependent.cageId,restored:shared,dependentRemovals,counterfactualCompletions,text:`The reduced candidates in cage ${source.cageId} restrict the shared cells of cage ${dependent.cageId}, allowing a further cage deduction.`});
  }
  return chains;
}

export function humanSudokuTrace(puzzle,{allowContradiction=false}={}){
  const content=sudokuHooks.createActive(puzzle),steps=[];
  let contradictions=0;
  for(let n=0;n<16;n++){
    if(validateSudoku(puzzle,content).valid)return {complete:true,steps,finalGrid:content.grid};
    let step=nextDeduction(puzzle,content);
    if(!('value'in step)&&allowContradiction&&contradictions===0){const proof=boundedSudokuContradiction(puzzle,content);if(proof.status==='success'){step=proof;contradictions++;}}
    if(!('value'in step))return {complete:false,steps,stalled:step,finalGrid:content.grid};
    const candidateEvidence=sudokuCandidateEvidence(puzzle,content);
    steps.push({...step,gridBefore:content.grid.map(row=>[...row]),candidateEvidence,cageChains:cageDeductionChains(candidateEvidence)});
    content.grid[step.row][step.col]=step.value;
  }
  return {complete:validateSudoku(puzzle,content).valid,steps,finalGrid:content.grid};
}

export {boundedSudokuContradiction} from './sudoku.js';
