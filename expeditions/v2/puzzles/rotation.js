import {clone,ok,fail,selectOutputs} from './common.js';
const OPERATORS=['=','+','−','×','÷',null];
const mod=n=>((n%6)+6)%6;
export const activeFace=(faces,orientation)=>faces[mod(-orientation)];

export function evaluateEquation(values,tokenIds=[]) {
  if(!Array.isArray(values)||![5,7].includes(values.length))return {valid:false,reason:'rotation-track-length'};
  if(values.some((v,i)=>i%2===0?!Number.isInteger(v)||v<0||v>100:!OPERATORS.includes(v)||v===null))return {valid:false,reason:'rotation-incomplete'};
  const equals=values.flatMap((v,i)=>v==='='?[i]:[]);
  if(equals.length!==1)return {valid:false,reason:'rotation-equals-count'};
  function expression(start,end) {
    let rational={num:values[start],den:1},ast={type:'number',value:values[start],tokenId:tokenIds[start]};
    for(let i=start+1;i<end;i+=2) {
      const op=values[i],right=values[i+1];
      if(op==='÷'&&right===0)return {valid:false,reason:'rotation-zero-division'};
      let num=op==='+'?rational.num+right*rational.den:op==='−'?rational.num-right*rational.den:op==='×'?rational.num*right:rational.num,den=op==='÷'?rational.den*right:rational.den;
      let a=Math.abs(num),b=Math.abs(den);while(b){const rest=a%b;a=b;b=rest;}num/=a;den/=a;if(den<0){num=-num;den=-den;}rational={num,den};
      if(den!==1)return {valid:false,reason:'rotation-inexact-division'};
      if(num<0||num>100)return {valid:false,reason:'rotation-intermediate-range'};
      ast={type:'binary',op,left:ast,right:{type:'number',value:right,tokenId:tokenIds[i+1]}};
    }
    return {valid:true,value:rational.num,ast};
  }
  const split=equals[0],left=expression(0,split),right=expression(split+1,values.length);
  if(!left.valid||!right.valid)return !left.valid?left:right;
  return {valid:true,powered:left.value===right.value,leftValue:left.value,rightValue:right.value,ast:{left:left.ast,right:right.ast,equalityTokenId:tokenIds[split]}};
}

function tokensById(puzzle){return new Map(puzzle.tokens.map(t=>[t.id,t]));}
function variable(token){return Array.isArray(token.faces)&&!token.given;}
function schemaValid(puzzle) {
  if(!Array.isArray(puzzle?.tokens)||!puzzle.tokens.length||!Array.isArray(puzzle.tracks)||!puzzle.tracks.length)return false;
  const ids=new Set();
  for(const token of puzzle.tokens) {
    if(typeof token?.id!=='string'||!token.id||ids.has(token.id)||!['number','operator'].includes(token.kind)||token.given!==undefined&&typeof token.given!=='boolean')return false;ids.add(token.id);
    if(token.faces) {
      if(!Array.isArray(token.faces)||token.faces.length!==6||!Number.isInteger(token.orientation)||token.orientation<0||token.orientation>5)return false;
      if(token.kind==='operator'&&JSON.stringify(token.faces)!==JSON.stringify(OPERATORS))return false;
      if(token.kind==='number'&&(new Set(token.faces).size!==6||token.faces.some(v=>!Number.isInteger(v)||v<0||v>24)))return false;
      if(!['number','operator'].includes(token.kind))return false;
    } else if(token.kind==='number'?!Number.isInteger(token.value)||token.value<0||token.value>100:!OPERATORS.includes(token.value))return false;
  }
  return new Set(puzzle.tracks.map(t=>t?.id)).size===puzzle.tracks.length&&puzzle.tracks.every(t=>typeof t?.id==='string'&&!!t.id&&Array.isArray(t.tokenIds)&&[5,7].includes(t.tokenIds.length)&&new Set(t.tokenIds).size===t.tokenIds.length&&t.tokenIds.every((id,i)=>ids.has(id)&&puzzle.tokens.find(token=>token.id===id).kind===(i%2?'operator':'number')));
}
function orientationsValid(puzzle,content) {
  if(!schemaValid(puzzle)||!content?.orientations||typeof content.orientations!=='object')return false;
  const variables=puzzle.tokens.filter(variable);
  return Object.keys(content.orientations).length===variables.length&&variables.every(t=>Number.isInteger(content.orientations[t.id])&&content.orientations[t.id]>=0&&content.orientations[t.id]<=5);
}
function trackResult(puzzle,content,track) {
  const map=tokensById(puzzle);
  return evaluateEquation(track.tokenIds.map(id=>{const t=map.get(id);return t.faces?activeFace(t.faces,variable(t)?content.orientations[id]:t.orientation):t.value;}),track.tokenIds);
}
export function validateRotation(puzzle,content) {
  if(!orientationsValid(puzzle,content))return {valid:false,reason:'rotation-domain',tracks:{}};
  return {valid:true,tracks:Object.fromEntries(puzzle.tracks.map(t=>[t.id,trackResult(puzzle,content,t)]))};
}
export function solvePuzzle(puzzle,{limit=2,nodeBudget=100000,requiredTrackIds=null}={}) {
  if(!schemaValid(puzzle)||!Number.isInteger(limit)||limit<1||!Number.isInteger(nodeBudget)||nodeBudget<0)return {status:'failure',solutions:[],nodes:0,reasonCode:'rotation-schema'};
  const required=requiredTrackIds||puzzle.tracks.map(t=>t.id);
  if(!Array.isArray(required)||new Set(required).size!==required.length||required.some(id=>!puzzle.tracks.some(t=>t.id===id)))return {status:'failure',solutions:[],nodes:0,reasonCode:'rotation-track-unknown'};
  const variables=puzzle.tokens.filter(variable),domains=Object.fromEntries(variables.map(t=>[t.id,[0,1,2,3,4,5]]));
  const constraints=[];let nodes=0,unknown=false;
  for(const track of puzzle.tracks.filter(t=>required.includes(t.id))) {
    const names=[...new Set(track.tokenIds.filter(id=>Object.hasOwn(domains,id)))],tuples=[];
    function enumerate(i,orientations) {
      if(unknown)return;if(nodes>=nodeBudget){unknown=true;return;}nodes++;
      if(i===names.length){const r=trackResult(puzzle,{orientations},track);if(r.valid&&r.powered)tuples.push({...orientations});return;}
      for(const value of domains[names[i]])enumerate(i+1,{...orientations,[names[i]]:value});
    }
    enumerate(0,{});constraints.push({names,tuples});if(unknown)break;
  }
  const solutions=[];
  function search(assigned) {
    if(unknown||solutions.length>=limit)return;if(nodes>=nodeBudget){unknown=true;return;}nodes++;
    const surviving=constraints.map(c=>({...c,tuples:c.tuples.filter(t=>c.names.every(id=>!Object.hasOwn(assigned,id)||t[id]===assigned[id]))}));
    if(surviving.some(c=>!c.tuples.length))return;
    const remaining=variables.filter(t=>!Object.hasOwn(assigned,t.id));
    if(!remaining.length){solutions.push({orientations:{...assigned},outputIds:[]});return;}
    const choices=remaining.map(t=>({id:t.id,values:domains[t.id].filter(v=>surviving.every(c=>!c.names.includes(t.id)||c.tuples.some(tuple=>tuple[t.id]===v)))})).sort((a,b)=>a.values.length-b.values.length||a.id.localeCompare(b.id));
    for(const v of choices[0].values)search({...assigned,[choices[0].id]:v});
  }
  if(!unknown)search({});
  return {status:unknown?'unknown':solutions.length?'success':'failure',solutions,nodes,exhaustive:!unknown&&solutions.length<limit};
}
export function nextRotationDeduction(puzzle,content) {
  const evaluated=validateRotation(puzzle,content);
  if(!evaluated.valid)return {type:'conflict',text:'Check the wheel orientations and printed token types.'};
  const track=puzzle.tracks.find(t=>!evaluated.tracks[t.id]?.powered);
  if(!track)return {type:'complete',text:'All tracks are true. Choose the circuits you want to protect.'};
  const proof=solvePuzzle(puzzle,{limit:1000,nodeBudget:100000});
  if(proof.status==='success'&&proof.exhaustive){
    for(const wheel of puzzle.tokens.filter(variable).toSorted((a,b)=>puzzle.tracks.filter(t=>t.tokenIds.includes(b.id)).length-puzzle.tracks.filter(t=>t.tokenIds.includes(a.id)).length||(a.id<b.id?-1:1))){
      const orientation=proof.solutions[0].orientations[wheel.id];
      if(orientation===content.orientations[wheel.id]||!proof.solutions.every(s=>s.orientations[wheel.id]===orientation))continue;
      const clockwise=mod(orientation-content.orientations[wheel.id]),steps=clockwise<=3?clockwise:6-clockwise,direction=clockwise<=3?'clockwise':'anticlockwise',face=activeFace(wheel.faces,orientation);
      return {type:'forced-wheel',wheelId:wheel.id,orientation,face,direction,steps,trackIds:puzzle.tracks.map(t=>t.id),text:`Making all the connected tracks true requires wheel ${wheel.id} to show ${face}. Turn it ${steps} step${steps===1?'':'s'} ${direction}; shared tracks change together.`};
    }
  }
  return {type:'observation',trackId:track.id,solverStatus:proof.status,text:`${track.id} is not powered. Work from left to right inside each parenthesis. It needs one equals sign, exact divisions and equal totals on both sides.`};
}

export const rotationHooks={
  hookInterfaceVersion:1,
  createActive:puzzle=>({orientations:Object.fromEntries(puzzle.tokens.filter(variable).map(t=>[t.id,t.orientation])),outputIds:[]}),
  createDraft:(puzzle,active)=>({...clone(active),outputIds:[...(puzzle.defaultOutputIds||active.outputIds)]}),
  applyEdit(puzzle,content,edit) {
    if(edit.type==='select-outputs'){const check=rotationHooks.checkOutputSelection(puzzle,edit.outputIds);return check.ok?ok({...clone(content),outputIds:[...edit.outputIds]}):check;}
    if(edit.type!=='rotate-wheel')return fail('puzzle-edit-type');
    const wheel=puzzle.tokens.find(t=>t.id===edit.wheelId);
    if(!wheel||!variable(wheel))return fail('rotation-wheel-fixed-or-unknown');
    if(![-1,1].includes(edit.delta))return fail('rotation-delta');
    const next=clone(content);next.orientations[wheel.id]=mod(next.orientations[wheel.id]+edit.delta);return ok(next);
  },
  checkOutputSelection:(puzzle,ids)=>selectOutputs({...puzzle,outputs:puzzle.tracks.map(t=>({id:t.id}))},ids,{max:puzzle.maxActiveOutputs}),
  commit(puzzle,content,ids) {
    const check=rotationHooks.checkOutputSelection(puzzle,ids);if(!check.ok)return check;
    const evaluated=validateRotation(puzzle,content);if(!evaluated.valid)return fail(evaluated.reason);
    if(JSON.stringify([...content.outputIds].sort())!==JSON.stringify([...ids].sort()))return fail('puzzle-output-draft-mismatch');
    if(ids.some(id=>!evaluated.tracks[id].powered))return fail('rotation-selected-unpowered');
    return ok(clone(content));
  },
  evaluate(puzzle,content) {
    const result=validateRotation(puzzle,content);
    return {valid:result.valid,outputTruth:Object.fromEntries(puzzle.tracks.map(t=>[t.id,!!result.tracks[t.id]?.powered])),details:result};
  },
  disruptionCandidates(puzzle,content) {
    return puzzle.tokens.filter(variable).map(t=>({memberId:t.id,groupIds:[`wheel-${t.id}`,'network'],hex:t.hex,degree:puzzle.tracks.filter(track=>track.tokenIds.includes(t.id)).length})).sort((a,b)=>b.degree-a.degree||(a.memberId<b.memberId?-1:1));
  },
  disrupt(puzzle,content,id) {const next=clone(content);if(id in next.orientations)next.orientations[id]=mod(next.orientations[id]+1);return next;},
  hint(puzzle,content,stage) {
    if(stage===1)return {text:'Read the top face of each wheel. A shared wheel changes every connected equation.'};
    const step=nextRotationDeduction(puzzle,content);return {text:step.text,params:step};
  },
  solutionDraft(puzzle){const content=solvePuzzle(puzzle,{limit:1}).solutions[0]||rotationHooks.createActive(puzzle),ids=puzzle.defaultOutputIds||puzzle.tracks.slice(0,puzzle.maxActiveOutputs).map(t=>t.id);return {content:{...content,outputIds:[...ids]},selectedOutputIds:[...ids]};},
  commissionCheck(puzzle,content,ctx) {
    const result=validateRotation(puzzle,content);
    if(!result.valid)return fail(result.reason);
    const count=Object.values(result.tracks).filter(t=>t.powered).length;
    return count>=puzzle.minimumTrueTracksForCommission?{ok:true}:fail('rotation-true-track-count',{count,required:puzzle.minimumTrueTracksForCommission});
  }
};
