import {clone,ok,fail,selectOutputs} from './common.js';
const key=([q,r])=>`${q},${r}`;
const parse=id=>typeof id==='string'&&/^-?\d+,-?\d+$/.test(id)?id.split(',').map(Number):null;
const dirs=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
function schemaValid(puzzle) {
  const cells=puzzle?.patchCells;
  if(!Array.isArray(cells)||cells.length<3||cells.length>19||new Set(cells).size!==cells.length||cells.some(id=>!parse(id)?.every(Number.isSafeInteger)))return false;
  for(const field of ['sockets','forbiddenCells','approachCells'])if(!Array.isArray(puzzle[field])||new Set(puzzle[field]).size!==puzzle[field].length||puzzle[field].some(id=>!cells.includes(id)))return false;
  if(!puzzle.approachCells.length||puzzle.sockets.some(id=>puzzle.forbiddenCells.includes(id)))return false;
  if(puzzle.reflectionAllowed!==undefined&&typeof puzzle.reflectionAllowed!=='boolean')return false;
  if(puzzle.forecastCellIds!==undefined&&(!Array.isArray(puzzle.forecastCellIds)||puzzle.forecastCellIds.some(id=>!cells.includes(id))))return false;
  if(!Array.isArray(puzzle.pieces)||!puzzle.pieces.length||puzzle.pieces.length>5||new Set(puzzle.pieces.map(p=>p?.id)).size!==puzzle.pieces.length)return false;
  for(const piece of puzzle.pieces){
    if(typeof piece?.id!=='string'||!piece.id||!Array.isArray(piece.cells)||!piece.cells.length||piece.cells.length>6||piece.cells.some(p=>!Array.isArray(p)||p.length!==2||!p.every(Number.isSafeInteger)))return false;
    const shape=new Set(piece.cells.map(key));if(shape.size!==piece.cells.length)return false;
    const queue=[piece.cells[0]],seen=new Set([key(piece.cells[0])]);
    for(let i=0;i<queue.length;i++){const [q,r]=queue[i];for(const [dq,dr]of dirs){const next=[q+dq,r+dr],id=key(next);if(shape.has(id)&&!seen.has(id)){seen.add(id);queue.push(next);}}}
    if(seen.size!==shape.size)return false;
  }
  return true;
}
export const rotateAxial=([q,r])=>[-r,q+r];
export const reflectAxial=([q,r])=>[-q-r,r];
export function transformedCells(piece,orientation,reflected=false) {
  let cells=piece.cells.map(p=>reflected?reflectAxial(p):[...p]);
  for(let i=0;i<orientation;i++)cells=cells.map(rotateAxial);
  return cells;
}
export function distinctTransforms(piece,reflectionAllowed=false) {
  const seen=new Set(),out=[];
  for(const reflected of reflectionAllowed?[false,true]:[false])for(let orientation=0;orientation<6;orientation++) {
    const cells=transformedCells(piece,orientation,reflected),anchor=cells.toSorted((a,b)=>a[1]-b[1]||a[0]-b[0])[0];
    const fingerprint=cells.map(([q,r])=>[q-anchor[0],r-anchor[1]]).sort((a,b)=>a[1]-b[1]||a[0]-b[0]).map(key).join(';');
    if(!seen.has(fingerprint)){seen.add(fingerprint);out.push({orientation,reflected,cells,fingerprint});}
  }
  return out;
}
function placedCells(puzzle,placement) {
  const piece=puzzle.pieces.find(p=>p.id===placement.pieceId),origin=parse(placement.originHex);
  if(!piece||!origin||!Number.isInteger(placement.orientation)||placement.orientation<0||placement.orientation>5||typeof placement.reflected!=='boolean'||placement.reflected&&!puzzle.reflectionAllowed)return null;
  return transformedCells(piece,placement.orientation,placement.reflected).map(([q,r])=>key([q+origin[0],r+origin[1]]));
}
export function validatePacking(puzzle,content,{complete=true}={}) {
  if(!schemaValid(puzzle))return {valid:false,reason:'packing-schema'};
  if(!Array.isArray(content?.placements)||content.placements.some(p=>!p||typeof p.pieceId!=='string')||new Set(content.placements.map(p=>p.pieceId)).size!==content.placements.length)return {valid:false,reason:'packing-duplicate-piece'};
  const allowed=new Set(puzzle.patchCells),forbidden=new Set(puzzle.forbiddenCells),covered=new Set();
  for(const placement of content.placements) {
    const cells=placedCells(puzzle,placement);if(!cells)return {valid:false,reason:'packing-placement-domain'};
    if(new Set(cells).size!==cells.length)return {valid:false,reason:'packing-piece-duplicate-cell'};
    for(const cell of cells){if(!allowed.has(cell))return {valid:false,reason:'packing-outside',cell};if(forbidden.has(cell))return {valid:false,reason:'packing-forbidden',cell};if(covered.has(cell))return {valid:false,reason:'packing-overlap',cell};covered.add(cell);}
  }
  if(!complete)return {valid:true,coveredCells:[...covered].sort()};
  if(content.placements.length!==puzzle.pieces.length)return {valid:false,reason:'packing-missing-piece'};
  if(!puzzle.sockets.every(id=>covered.has(id)))return {valid:false,reason:'packing-socket'};
  const free=new Set([...allowed].filter(id=>!covered.has(id))),queue=(puzzle.approachCells||[]).filter(id=>free.has(id)),seen=new Set(queue);
  for(let i=0;i<queue.length;i++){const [q,r]=parse(queue[i]);for(const [dq,dr]of dirs){const id=key([q+dq,r+dr]);if(free.has(id)&&!seen.has(id)){seen.add(id);queue.push(id);}}}
  if(free.size<3||seen.size!==free.size)return {valid:false,reason:'packing-free-access'};
  return {valid:true,coveredCells:[...covered].sort(),freeCells:[...free].sort()};
}
export function solvePuzzle(puzzle,{limit=2,nodeBudget=100000,content=null}={}) {
  const solutions=[];let nodes=0,unknown=false;
  if(!schemaValid(puzzle)||!Number.isInteger(limit)||limit<1||!Number.isInteger(nodeBudget)||nodeBudget<0)return {status:'failure',solutions,nodes,reasonCode:'packing-schema'};
  if(content&&!validatePacking(puzzle,content,{complete:false}).valid)return {status:'failure',solutions,nodes,reasonCode:'packing-placement-domain'};
  const choices=puzzle.pieces.map(piece=>{
    const fixed=content?.placements.find(p=>p.pieceId===piece.id);if(fixed)return [clone(fixed)];
    return distinctTransforms(piece,puzzle.reflectionAllowed).flatMap(t=>puzzle.patchCells.map(originHex=>({pieceId:piece.id,originHex,orientation:t.orientation,reflected:t.reflected}))).filter(placement=>validatePacking(puzzle,{placements:[placement]},{complete:false}).valid);
  });
  const solutionFingerprints=new Set();
  function search(i,placements) {
    if(unknown||solutions.length>=limit)return;if(nodes>=nodeBudget){unknown=true;return;}nodes++;
    const content={placements,outputIds:['shelter-packing']};
    if(i===puzzle.pieces.length) {
      const check=validatePacking(puzzle,content);if(!check.valid)return;
      // Identical labelled-piece swaps are one mathematical packing, not extra diversity.
      const grouped=new Map();
      for(const p of placements){const shape=distinctTransforms(puzzle.pieces.find(x=>x.id===p.pieceId),true).map(t=>t.fingerprint).sort()[0];grouped.set(shape,[...(grouped.get(shape)||[]),placedCells(puzzle,p).sort().join(';')]);}
      const fingerprint=[...grouped].map(([shape,sets])=>`${shape}:${sets.sort().join('|')}`).sort().join('/');
      if(!solutionFingerprints.has(fingerprint)){solutionFingerprints.add(fingerprint);solutions.push(clone(content));}return;
    }
    for(const placement of choices[i]){const next=[...placements,placement];if(validatePacking(puzzle,{placements:next},{complete:false}).valid)search(i+1,next);}
  }
  search(0,[]);return {status:unknown?'unknown':solutions.length?'success':'failure',solutions,nodes,exhaustive:!unknown&&solutions.length<limit};
}
export const packingHooks={
  hookInterfaceVersion:1,
  createActive:()=>({placements:[],outputIds:['shelter-packing']}),
  createDraft:(puzzle,active)=>clone(active),
  applyEdit(puzzle,content,edit) {
    if(!schemaValid(puzzle)||!Array.isArray(content?.placements))return fail('packing-schema');
    const next=clone(content);
    if(edit.type==='select-outputs'){const check=packingHooks.checkOutputSelection(puzzle,edit.outputIds);return check.ok?ok({...next,outputIds:[...edit.outputIds]}):check;}
    if(!['place-piece','remove-piece'].includes(edit.type)||!puzzle.pieces.some(p=>p.id===edit.pieceId))return fail('packing-piece-unknown');
    next.placements=next.placements.filter(p=>p.pieceId!==edit.pieceId);
    if(edit.type==='place-piece')next.placements.push({pieceId:edit.pieceId,originHex:edit.originHex,orientation:edit.orientation,reflected:edit.reflected});
    const check=validatePacking(puzzle,next,{complete:false});return check.valid?ok(next):fail(check.reason,check);
  },
  checkOutputSelection:(puzzle,ids)=>selectOutputs({outputs:['shelter-packing']},ids,{count:1}),
  commit(puzzle,content,ids){const selection=packingHooks.checkOutputSelection(puzzle,ids);if(!selection.ok)return selection;const check=validatePacking(puzzle,content);return check.valid?ok(clone(content)):fail(check.reason,check);},
  evaluate(puzzle,content){const check=validatePacking(puzzle,content);return {valid:check.valid,outputTruth:{'shelter-packing':check.valid},details:check};},
  disruptionCandidates(puzzle,content,kind){return kind==='environment'?(puzzle.forecastCellIds||[]).map(id=>({memberId:id,groupIds:['patch','network'],hex:id})):content.placements.toSorted((a,b)=>a.pieceId<b.pieceId?-1:1).map(p=>({memberId:p.pieceId,groupIds:[`piece-${p.pieceId}`,'patch','network'],hex:puzzle.controlHex}));},
  disrupt(puzzle,content,id,kind){const next=clone(content);if(kind!=='environment')next.placements=next.placements.filter(p=>p.pieceId!==id);return next;},
  coverage(puzzle,content){const check=validatePacking(puzzle,content,{complete:false});const cells=check.coveredCells||[];return {coveredCells:cells,socketsCovered:puzzle.sockets.every(id=>cells.includes(id))};},
  hint(puzzle,content,stage){
    if(stage===1)return {text:'Place all three branches over the sockets. Keep a connected free approach for the team; shelter does not block movement.'};
    const check=validatePacking(puzzle,content);if(check.valid)return {text:'The shelter fits. Protect the forecast sockets before commissioning.'};
    const completion=solvePuzzle(puzzle,{content,limit:1,nodeBudget:100000});
    if(completion.status==='success'){
      const placement=completion.solutions[0].placements.find(p=>!content.placements.some(current=>current.pieceId===p.pieceId));
      if(placement){const sockets=placedCells(puzzle,placement).filter(id=>puzzle.sockets.includes(id));return {text:`One workable next placement puts branch ${placement.pieceId} at ${placement.originHex}, orientation ${placement.orientation}${placement.reflected?', reflected':''}${sockets.length?`, covering socket${sockets.length===1?'':'s'} ${sockets.join(', ')}`:''}. The remaining branches can still fit and leave a connected approach.`,params:{type:'constructive-placement',placement,sockets}};}
    }
    return {text:completion.status==='unknown'?'Check the uncovered sockets and leave a connected free approach; the bounded search has not found a continuation yet.':'These placements cannot be completed. Move a branch to free a socket or reconnect the approach.',params:{reason:check.reason,solverStatus:completion.status}};
  },
  solutionDraft:puzzle=>solvePuzzle(puzzle,{limit:1}).solutions[0]||packingHooks.createActive(puzzle),
  commissionCheck(puzzle,content,ctx){const check=validatePacking(puzzle,content);if(!check.valid)return fail(check.reason);const suppressed=ctx.suppressedShelterCells||[];return puzzle.sockets.some(id=>suppressed.includes(id))?fail('packing-socket-suppressed'):{ok:true};}
};
