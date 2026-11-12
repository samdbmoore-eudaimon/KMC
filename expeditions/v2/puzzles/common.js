export const clone = value => JSON.parse(JSON.stringify(value));
export const ok = content => ({ok:true,content});
export const fail = (reasonCode,reasonParams={}) => ({ok:false,reasonCode,reasonParams});
export const cellId = (row,col) => `r${row}c${col}`;
export function parseCell(id,size) {
  const match=/^r(\d+)c(\d+)$/.exec(id);
  if(!match)return null;
  const row=Number(match[1]),col=Number(match[2]);
  return row<size&&col<size?[row,col]:null;
}
export function outputIds(puzzle) {
  return (puzzle.outputs||[]).map(output=>typeof output==='string'?output:output.id);
}
export function selectOutputs(puzzle,ids,{count=null,max=Infinity,budget=Infinity}={}) {
  if(!Array.isArray(ids)||new Set(ids).size!==ids.length)return fail('puzzle-output-duplicate');
  const allowed=outputIds(puzzle);
  if(ids.some(id=>!allowed.includes(id)))return fail('puzzle-output-unknown');
  if((count!==null&&ids.length!==count)||ids.length>max)return fail('puzzle-output-count',{count,max});
  const cost=ids.reduce((sum,id)=>sum+(puzzle.outputs.find(o=>o.id===id)?.cost||0),0);
  if(cost>budget)return fail('puzzle-output-budget',{cost,budget});
  return {ok:true};
}
