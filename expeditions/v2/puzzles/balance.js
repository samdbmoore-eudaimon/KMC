import {clone,ok,fail,selectOutputs} from './common.js';
const PANS=['left','right','reserve'];
const hidden=puzzle=>puzzle.loads.find(l=>l.id===puzzle.hiddenLoadId);
function schemaValid(puzzle) {
  if(!Array.isArray(puzzle?.loads)||puzzle.loads.length!==6||new Set(puzzle.loads.map(l=>l?.id)).size!==6||puzzle.loads.some(l=>typeof l?.id!=='string'||!l.id||!Number.isSafeInteger(l.value)||l.value<1||l.value>100||typeof l.visible!=='boolean'||!Array.isArray(l.candidates)))return false;
  if(!Number.isSafeInteger(puzzle.target)||puzzle.target<1||!Number.isInteger(puzzle.usedCount)||puzzle.usedCount<1||puzzle.usedCount>6||puzzle.reserveCount!==6-puzzle.usedCount)return false;
  if(['left','right'].some(pan=>!Number.isSafeInteger(puzzle.panCapacity?.[pan])||puzzle.panCapacity[pan]<1||!Number.isInteger(puzzle.maxPanCount?.[pan])||puzzle.maxPanCount[pan]<1||puzzle.maxPanCount[pan]>6))return false;
  const ids=new Set(puzzle.loads.map(l=>l.id));
  if(!Array.isArray(puzzle.incompatiblePairs)||puzzle.incompatiblePairs.some(pair=>!Array.isArray(pair)||pair.length!==2||pair[0]===pair[1]||pair.some(id=>!ids.has(id))))return false;
  if(puzzle.hiddenLoadId!==null&&!ids.has(puzzle.hiddenLoadId))return false;
  if(!Number.isInteger(puzzle.comparisonAllowance)||puzzle.comparisonAllowance<0||puzzle.comparisonAllowance>6)return false;
  const h=hidden(puzzle);
  if(h&&(h.visible||h.candidates.length<2||new Set(h.candidates).size!==h.candidates.length||h.candidates.some(v=>!Number.isSafeInteger(v)||v<1||v>100)||!h.candidates.includes(h.value)))return false;
  return puzzle.loads.every(l=>l.id===puzzle.hiddenLoadId||l.visible);
}
function assignmentsValid(puzzle,content) {
  return content?.assignments&&Object.keys(content.assignments).length===puzzle.loads.length&&puzzle.loads.every(l=>Object.hasOwn(content.assignments,l.id)&&PANS.includes(content.assignments[l.id]));
}
export function validateBalance(puzzle,content) {
  if(!schemaValid(puzzle))return {valid:false,reason:'balance-schema'};
  if(!assignmentsValid(puzzle,content))return {valid:false,reason:'balance-assignment-domain'};
  const totals={left:0,right:0,reserve:0},counts={left:0,right:0,reserve:0};
  for(const load of puzzle.loads){const pan=content.assignments[load.id];totals[pan]+=load.value;counts[pan]++;}
  const h=hidden(puzzle);
  if(h&&(content.inferredValue!==h.value||content.assignments[h.id]==='reserve'))return {valid:false,reason:'balance-hidden-value',totals,counts};
  if(counts.left+counts.right!==puzzle.usedCount||counts.reserve!==puzzle.reserveCount)return {valid:false,reason:'balance-used-count',totals,counts};
  for(const pan of ['left','right'])if(totals[pan]!==puzzle.target||totals[pan]>puzzle.panCapacity[pan]||counts[pan]>puzzle.maxPanCount[pan])return {valid:false,reason:'balance-pan-total',pan,totals,counts};
  if(puzzle.incompatiblePairs.some(([a,b])=>content.assignments[a]===content.assignments[b]&&content.assignments[a]!=='reserve'))return {valid:false,reason:'balance-incompatible',totals,counts};
  return {valid:true,totals,counts};
}
export function solvePuzzle(puzzle,{limit=729,nodeBudget=10000}={}) {
  const solutions=[];let nodes=0,unknown=false;
  if(!schemaValid(puzzle)||!Number.isInteger(limit)||limit<1||!Number.isInteger(nodeBudget)||nodeBudget<0)return {status:'failure',solutions,nodes,reasonCode:'balance-schema'};
  function visit(i,assignments) {
    if(unknown||solutions.length>=limit)return;if(nodes>=nodeBudget){unknown=true;return;}nodes++;
    if(i===puzzle.loads.length){const content={assignments,inferredValue:hidden(puzzle)?.value??null,outputIds:['balance-crossing']};if(validateBalance(puzzle,content).valid)solutions.push(clone(content));return;}
    for(const pan of PANS)visit(i+1,{...assignments,[puzzle.loads[i].id]:pan});
  }
  visit(0,{});return {status:unknown?'unknown':solutions.length?'success':'failure',solutions,nodes,exhaustive:!unknown&&solutions.length<limit};
}
function comparisonValid(puzzle,left,right) {
  const ids=new Set(puzzle.loads.map(l=>l.id)),all=[...left,...right];
  return left.length>0&&right.length>0&&new Set(all).size===all.length&&all.every(id=>ids.has(id));
}
export function compareLoads(puzzle,left,right,valueOverride=null) {
  if(!Array.isArray(left)||!Array.isArray(right)||!comparisonValid(puzzle,left,right))throw Error('Invalid comparison load IDs');
  const sum=ids=>ids.reduce((s,id)=>{const l=puzzle.loads.find(l=>l.id===id);return s+(l.id===puzzle.hiddenLoadId&&valueOverride!==null?valueOverride:l.value);},0);
  const diff=sum(left)-sum(right);return diff<0?'left-lighter':diff>0?'left-heavier':'equal';
}
export function solveWeighing(puzzle,{nodeBudget=100000}={}) {
  if(!schemaValid(puzzle)||!Number.isInteger(nodeBudget)||nodeBudget<0)return {status:'failure',tree:null,nodes:0,reasonCode:'balance-schema'};
  const h=hidden(puzzle);if(!h)return {status:'success',tree:null,nodes:0};
  const queries=[];let nodes=0,unknown=false;
  const ids=puzzle.loads.map(l=>l.id);
  for(let n=0;n<3**ids.length;n++) {
    let x=n;const left=[],right=[];
    for(const id of ids){const pan=x%3;x=Math.floor(x/3);if(pan===0)left.push(id);if(pan===1)right.push(id);}
    if(left.length&&right.length)queries.push({left,right});
  }
  const memo=new Map();
  function visit(candidates,remaining) {
    if(nodes>=nodeBudget){unknown=true;return null;}nodes++;
    if(candidates.length===1)return {value:candidates[0],depth:0};
    if(!remaining)return null;
    const key=`${candidates.join(',')}|${remaining}`;if(memo.has(key))return memo.get(key);
    let best=null;
    for(const query of queries) {
      if(unknown)break;
      const groups=new Map();for(const value of candidates){const result=compareLoads(puzzle,query.left,query.right,value);groups.set(result,[...(groups.get(result)||[]),value]);}
      if(groups.size===1)continue;
      const children={};let depth=0,valid=true;
      for(const [result,values]of groups){const child=visit(values,remaining-1);if(!child){valid=false;break;}children[result]=child;depth=Math.max(depth,child.depth+1);}
      if(valid&&(!best||depth<best.depth))best={leftLoadIds:query.left,rightLoadIds:query.right,children,depth};
      if(best?.depth===1)break;
    }
    memo.set(key,best);return best;
  }
  const tree=visit(h.candidates,puzzle.comparisonAllowance);
  return {status:unknown?'unknown':tree?'success':'failure',tree,nodes};
}
export function nextBalanceDeduction(puzzle,content,{comparisonLog=[],comparisonsUsed=0,nodeBudget=100000}={}) {
  if(!schemaValid(puzzle)||!assignmentsValid(puzzle,content))return {type:'conflict',text:'Check the printed loads and their pan assignments before asking for a deduction.'};
  const h=hidden(puzzle);
  let allocationPuzzle=puzzle;
  if(h){
    let candidates;
    try{candidates=h.candidates.filter(value=>comparisonLog.every(log=>compareLoads(puzzle,log.left,log.right,value)===log.result));}catch{return {type:'conflict',text:'A recorded comparison names an invalid load. Return to the comparison record.'};}
    if(!candidates.length)return {type:'conflict',text:'The recorded comparisons leave no possible hidden value. Review the comparison record.'};
    if(candidates.length===1&&content.inferredValue!==candidates[0])return {type:'inference',loadId:h.id,value:candidates[0],text:`Only ${candidates[0]} fits every recorded comparison for load ${h.id}. Enter that inferred value before balancing the pans.`};
    if(candidates.length===1)allocationPuzzle={...puzzle,loads:puzzle.loads.map(load=>load.id===h.id?{...load,value:candidates[0]}:load)};
    if(candidates.length>1){
      const remaining=Math.max(0,puzzle.comparisonAllowance-comparisonsUsed);
      if(!remaining)return {type:'observation',candidates,text:`The recorded results still allow ${candidates.join(', ')} for load ${h.id}. No new comparisons remain; review those results and the pan restrictions, or request the worked solution.`};
      const publicPuzzle={...puzzle,comparisonAllowance:remaining,loads:puzzle.loads.map(load=>load.id===h.id?{...load,value:candidates[0],candidates}:load)};
      const weighing=solveWeighing(publicPuzzle,{nodeBudget});
      if(weighing.status==='success')return {type:'comparison',leftLoadIds:weighing.tree.leftLoadIds,rightLoadIds:weighing.tree.rightLoadIds,candidates,text:`Compare loads ${weighing.tree.leftLoadIds.join(' + ')} on the left with ${weighing.tree.rightLoadIds.join(' + ')} on the right. Lighter, equal or heavier will separate the remaining values ${candidates.join(', ')} within your ${remaining} comparison${remaining===1?'':'s'}. This hint has not used the scale.`};
      return {type:'observation',candidates,solverStatus:weighing.status,text:weighing.status==='unknown'?'The bounded search has not found a comparison plan yet. Compare the hidden load with known totals and keep each load on one side only.':'Those recorded results cannot guarantee a unique value within the remaining allowance. Review them or request the worked solution.'};
    }
  }
  const check=validateBalance(allocationPuzzle,content);
  if(check.valid)return {type:'ready',text:'Both pans meet the target and all load restrictions. Activate the draft, then charge and protect the physical scales.'};
  const solved=solvePuzzle(allocationPuzzle,{nodeBudget:Math.min(nodeBudget,10000)});
  if(solved.status==='unknown')return {type:'observation',solverStatus:'unknown',text:'The bounded search has not completed. Check each pan against the target and the printed load-count restrictions.'};
  const best=solved.solutions.toSorted((a,b)=>puzzle.loads.filter(load=>a.assignments[load.id]!==content.assignments[load.id]).length-puzzle.loads.filter(load=>b.assignments[load.id]!==content.assignments[load.id]).length)[0];
  const load=best&&puzzle.loads.find(load=>content.assignments[load.id]!==best.assignments[load.id]);
  if(load)return {type:'constructive-allocation',loadId:load.id,pan:best.assignments[load.id],text:`One workable next move puts load ${load.id} in ${best.assignments[load.id]==='reserve'?'reserve':`the ${best.assignments[load.id]} pan`}. This leads towards a legal allocation; both pans must still total ${puzzle.target} and obey every printed restriction.`};
  return {type:'conflict',text:'These printed loads and restrictions have no legal allocation. Review the puzzle data.'};
}
export const balanceHooks={
  hookInterfaceVersion:1,
  createActive:puzzle=>({assignments:Object.fromEntries(puzzle.loads.map(l=>[l.id,'reserve'])),inferredValue:null,outputIds:['balance-crossing']}),
  createDraft:(puzzle,active)=>clone(active),
  applyEdit(puzzle,content,edit,ctx={}) {
    const next=clone(content);
    if(edit.type==='assign-load'){if(!puzzle.loads.some(l=>l.id===edit.loadId)||!PANS.includes(edit.pan))return fail('balance-assignment-domain');next.assignments[edit.loadId]=edit.pan;return ok(next);}
    if(edit.type==='inferred-value'){const h=hidden(puzzle);if(!h||h.id!==edit.loadId||!h.candidates.includes(edit.value))return fail('balance-hidden-domain');if((ctx.comparisonLog||[]).some(log=>compareLoads(puzzle,log.left,log.right,edit.value)!==log.result))return fail('balance-inference-contradicts-comparison');next.inferredValue=edit.value;return ok(next);}
    if(edit.type==='select-outputs'){const check=balanceHooks.checkOutputSelection(puzzle,edit.outputIds);return check.ok?ok({...next,outputIds:[...edit.outputIds]}):check;}
    return fail('puzzle-edit-type');
  },
  checkOutputSelection:(puzzle,ids)=>selectOutputs({outputs:['balance-crossing']},ids,{count:1}),
  commit(puzzle,content,ids){const selection=balanceHooks.checkOutputSelection(puzzle,ids);if(!selection.ok)return selection;const check=validateBalance(puzzle,content);return check.valid?ok(clone(content)):fail(check.reason,check);},
  evaluate(puzzle,content){const check=validateBalance(puzzle,content);return {valid:check.valid,outputTruth:{'balance-crossing':check.valid},details:check};},
  disruptionCandidates(puzzle,content){return puzzle.loads.filter(l=>content.assignments[l.id]!=='reserve').sort((a,b)=>b.value-a.value||(a.id<b.id?-1:1)).map(l=>({memberId:l.id,groupIds:[`${content.assignments[l.id]}-pan`,'network'],hex:puzzle.controlHex}));},
  disrupt(puzzle,content,id){const next=clone(content);if(id in next.assignments)next.assignments[id]='reserve';return next;},
  compare:(puzzle,content,left,right)=>compareLoads(puzzle,left,right),
  reserveTotal:(puzzle,content)=>puzzle.loads.filter(l=>content.assignments[l.id]==='reserve').reduce((s,l)=>s+l.value,0),
  hint(puzzle,content,stage,ctx={}){if(stage===1)return {text:'Both pans must reach the displayed total. Each labelled load can be used once; reserve loads stay off the pans. Compare hidden loads using the scale before entering an inferred value.'};const step=nextBalanceDeduction(puzzle,content,ctx);return {text:step.text,params:step};},
  solutionDraft:puzzle=>solvePuzzle(puzzle,{limit:1}).solutions[0]||balanceHooks.createActive(puzzle),
  commissionCheck(puzzle,content){const check=validateBalance(puzzle,content);return check.valid?{ok:true}:fail(check.reason);}
};
