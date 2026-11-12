import {topologyStream,generateTopology} from './topology.js';
import {crossingExitViolations} from './crossing-invariants.js';
import {solvePuzzle,solveWeighing,balanceHooks} from '../puzzles/balance.js';
import {validateBlueprint,CHARGE_CAPACITY,stationMaxIntegrity,orchardMaxIntegrity,neighbourKeys,hexDistance,offsetKey,hashValue} from '../index.js';

const CANDIDATE_COUNT=[0,0,0,3,4,5];
const ALLOWANCE=[0,0,0,2,3,3];
const mirrorKey=content=>{const key=side=>Object.entries(content.assignments).filter(([,pan])=>pan===side).map(([id])=>id).sort().join('+');const a=key('left'),b=key('right');return a<b?`${a}|${b}`:`${b}|${a}`;};

export function unequalCrossingOutputs(){
  return [{id:'balance-crossing',label:'Crossing',trigger:'on-commit',effect:{kind:'passage'}},{id:'reserve-benefit',label:'Reserve choice',trigger:'phase-start',effect:{kind:'reserve-benefit',amount:2,targetIds:['shape','sustain']}}];
}

function splitSizes(used,tier){
  if(tier===1)return [[3,3],[2,4],[4,2]];
  return used===4?[[2,2],[1,3],[3,1]]:used===5?[[2,3],[3,2],[1,4],[4,1]]:[[3,3],[2,4],[4,2],[1,5],[5,1]];
}

function composition(rng,count,target){
  const values=[];let left=target;
  for(let i=0;i<count;i++){
    const remaining=count-i-1,low=Math.max(1,left-remaining*12),high=Math.min(12,left-remaining);
    if(low>high)return null;
    const v=rng.int(low,high);values.push(v);left-=v;
  }
  return left===0?values:null;
}

function withValue(puzzle,loadId,value){return {...puzzle,loads:puzzle.loads.map(l=>l.id===loadId?{...l,value}:l)};}

export function generateUnequalPuzzle({tier=1,seed=1,controlHex='2,4',maxAttempts=256}={}){
  if(!Number.isInteger(tier)||tier<1||tier>5||!Number.isInteger(seed))return {status:'failure',reasonCode:'unequal-input'};
  const rng=topologyStream({familyId:'unequal-crossing',tier,seed},'puzzle'),hiddenTier=tier>=3;
  for(let attempt=0;attempt<Math.min(256,maxAttempts);attempt++){
    const usedCount=tier===1?6:tier===2?rng.pick([4,5]):rng.int(4,6),[leftCount,rightCount]=rng.pick(splitSizes(usedCount,tier));
    const target=rng.int(tier===1?9:8,tier===1?16:24);
    const leftValues=composition(rng,leftCount,target),rightValues=composition(rng,rightCount,target);
    if(!leftValues||!rightValues)continue;
    const reserveValues=Array.from({length:6-usedCount},()=>rng.int(1,12));
    const entries=rng.shuffle([...leftValues.map(v=>({v,pan:'left'})),...rightValues.map(v=>({v,pan:'right'})),...reserveValues.map(v=>({v,pan:'reserve'}))]);
    const solutionPan=Object.fromEntries(entries.map((e,i)=>[`load-${i}`,e.pan]));
    const used=Object.keys(solutionPan).filter(id=>solutionPan[id]!=='reserve');
    let hiddenLoadId=null,candidates=[];
    if(hiddenTier){
      hiddenLoadId=rng.pick(used);const actual=entries[Number(hiddenLoadId.slice(5))].v,pool=Array.from({length:12},(_,i)=>i+1).filter(v=>v!==actual);
      candidates=[...rng.shuffle(pool).slice(0,CANDIDATE_COUNT[tier]-1),actual].sort((a,b)=>a-b);
    }
    const loads=entries.map((e,i)=>({id:`load-${i}`,value:e.v,visible:`load-${i}`!==hiddenLoadId,candidates:`load-${i}`===hiddenLoadId?candidates:[]}));
    let incompatiblePairs=[];
    if(tier>=2){
      const cross=[];for(const a of used)for(const b of used)if(a<b&&solutionPan[a]!==solutionPan[b])cross.push([a,b]);
      incompatiblePairs=rng.shuffle(cross).slice(0,rng.int(1,2)).sort((x,y)=>x[0]<y[0]?-1:1);
      if(!incompatiblePairs.length)continue;
    }
    const base={id:'unequal-crossing',kind:'balance',controlId:'control',controlHex,draftSchemaVersion:1,networkGroupId:'network',loads,target,panCapacity:{left:target,right:target},usedCount,reserveCount:6-usedCount,maxPanCount:{left:tier===1?4:Math.max(leftCount,rightCount),right:tier===1?4:Math.max(leftCount,rightCount)},incompatiblePairs,hiddenLoadId,comparisonAllowance:hiddenTier?ALLOWANCE[tier]:0,defaultOutputIds:['balance-crossing'],outputs:unequalCrossingOutputs().filter(o=>o.id==='balance-crossing'),solutionParameters:{assignments:solutionPan,inferredValue:hiddenLoadId?entries[Number(hiddenLoadId.slice(5))].v:null},
      lockGroups:[{id:'network',anchor:controlHex,memberIds:loads.map(l=>l.id),effectKinds:['jam','environment']},...['left','right'].map(pan=>({id:`${pan}-pan`,anchor:controlHex,memberIds:loads.map(l=>l.id),effectKinds:['jam','environment']}))]};
    const proof=solvePuzzle(base,{limit:729,nodeBudget:20000});
    if(proof.status!=='success'||!proof.exhaustive)continue;
    const solutions=[...new Set(proof.solutions.map(mirrorKey))];
    if(!proof.solutions.some(s=>Object.entries(solutionPan).every(([id,pan])=>s.assignments[id]===pan)))continue;
    const noPairs=incompatiblePairs.length?solvePuzzle({...base,incompatiblePairs:[]},{limit:729,nodeBudget:20000}):proof;
    if(incompatiblePairs.length&&new Set(noPairs.solutions.map(mirrorKey)).size<=solutions.length)continue;
    const capBinds=tier===1?solvePuzzle({...base,maxPanCount:{left:6,right:6}},{limit:729,nodeBudget:20000}).solutions.length>proof.solutions.length:null;
    const evidence={solutionsMirrorReduced:solutions.length,solutionCount:proof.solutions.length,solverNodes:proof.nodes,capBinds,exclusionBinds:incompatiblePairs.length?true:null,usedCount,reserveTotal:reserveValues.reduce((s,v)=>s+v,0)};
    if(hiddenTier){
      const consistent=candidates.filter(c=>solvePuzzle(withValue(base,hiddenLoadId,c),{limit:1,nodeBudget:20000}).status==='success');
      if(consistent.length<2)continue;
      const weighing=solveWeighing(base,{nodeBudget:100000});
      if(weighing.status!=='success'||!weighing.tree||weighing.tree.depth>base.comparisonAllowance)continue;
      Object.assign(evidence,{candidatesWithValidAllocation:consistent,decisionDepth:weighing.tree.depth,weighingNodes:weighing.nodes});
    }
    const baseCheck=balanceHooks.evaluate(base,balanceHooks.createActive(base));if(baseCheck.valid)continue;
    return {status:'success',puzzle:base,attempt,mathematicalEvidence:evidence,puzzleFingerprint:hashValue({tier,hidden:!!hiddenLoadId,used:usedCount,pairs:incompatiblePairs.length,split:[leftCount,rightCount].sort(),sorted:loads.map(l=>l.value).sort((a,b)=>a-b)})};
  }
  return {status:'unknown',reasonCode:'unequal-puzzle-attempt-budget',attempts:Math.min(256,maxAttempts)};
}

export function generateUnequalCrossingCandidate({tier=1,seed=1,layoutId='river',reference=false}={}){
  const topology=generateTopology({familyId:'unequal-crossing',tier,seed,layoutId,reference});if(topology.status!=='success')return topology;
  const maths=generateUnequalPuzzle({tier,seed,controlHex:topology.anchors.control});if(maths.status!=='success')return maths;
  const {anchors,deployment,tiles}=topology;
  const violations=crossingExitViolations({tiles});if(violations.length)return {status:'unknown',reasonCode:'unequal-crossing-invalid',violations};
  const used=new Set([...deployment,...Object.values(anchors)]),rng=topologyStream({familyId:'unequal-crossing',tier,seed},'entities');
  const rules=tier===1?['jammer']:tier===2?['jammer','hunter']:['jammer','hunter','breaker'],enemies=[];
  for(const [i,ruleId] of rules.entries()){
    const defaultHex=[offsetKey(10,2),offsetKey(9,4),offsetKey(10,6)][i],choices=rng.shuffle([defaultHex,...neighbourKeys(defaultHex)]);
    const position=choices.find(id=>!used.has(id)&&deployment.every(d=>hexDistance(id,d)>=5)&&hexDistance(id,anchors.control)>=3&&tiles.some(t=>`${t.q},${t.r}`===id&&!['water','hedge','gate'].includes(t.terrain)&&!t.passageOutputId));
    if(!position)return {status:'unknown',reasonCode:'unequal-enemy-placement'};used.add(position);
    enemies.push({id:`${ruleId}-1`,ruleId,artId:{jammer:'hookmole',hunter:'scruffcrow',breaker:'strawling'}[ruleId],position,wakePhase:tier<3?2:tier===3&&ruleId!=='jammer'?2:1});
  }
  const names={control:'Scale control',number:'Scale lock',shape:'Platform brace',sustain:'Scale repair',alcove:'Brace alcove'},integrity=stationMaxIntegrity(tier),capacity=CHARGE_CAPACITY[tier-1];
  const crossing=tiles.find(t=>t.passageOutputId),outputs=unequalCrossingOutputs(),tilesOut=tiles.map(t=>t.passageOutputId?{...t,passageOutputId:'balance-crossing'}:t);
  const puzzle={...maths.puzzle,outputs,panStationIds:{left:'shape',right:'sustain'}};
  const blueprint={schemaVersion:2,moduleKey:'primary',familyId:'unequal-crossing',tier,seed:seed>>>0,parameterSeed:seed>>>0,generatorVersion:1,rulesVersion:2,layoutId:topology.layoutId,attempt:topology.attempt,tiles:tilesOut,deployment,puzzle,outputs,
    stations:Object.entries(names).map(([id,name])=>({id,name,hex:anchors[id],artId:id==='sustain'?'terrain-apple-tree-v1':id==='shape'?'mechanism-plinth':'mechanism-hive-ledger-board-v1',...(id==='alcove'?{}:{maxIntegrity:integrity}),...(['number','shape','sustain'].includes(id)?{capacity}:{})})),
    enemies,hazards:[{id:'scale-drain',sites:[{id:'sustain-site',targetId:'sustain'}],mutation:{kind:'puzzle'}}],sites:crossing?[{id:'controlled-passage',anchor:`${crossing.q},${crossing.r}`}]:[],deadline:5,orchard:{hex:anchors.orchard,name:'Ninefold tree',artId:'terrain-apple-tree-v1'},orchardMaxIntegrity:orchardMaxIntegrity(tier),certificateId:null,structuralFingerprint:topology.structuralFingerprint,commission:{poweredIds:['balance-crossing']}};
  const check=validateBlueprint(blueprint);if(!check.ok)return {status:'failure',reasonCode:'unequal-blueprint-schema',errors:check.errors};
  return {status:'success',blueprint,topologyEvidence:topology.metrics,mathematicalEvidence:maths.mathematicalEvidence,puzzleFingerprint:maths.puzzleFingerprint,certified:false};
}
