import {topologyBaseTiles,topologyStream,generateTopology} from './topology.js';
import {crossingExitViolations} from './crossing-invariants.js';
import {solvePuzzle,validateRotation,rotationHooks,activeFace} from '../puzzles/rotation.js';
import {validateBlueprint,CHARGE_CAPACITY,stationMaxIntegrity,orchardMaxIntegrity,neighbourKeys,hexDistance,offsetKey,compareHex,hashValue} from '../index.js';

const FACES=['=','+','−','×','÷',null];
const TRACK_IDS=[['A','O','B','E','target-1'],['B','plus','C','equals-2','target-2'],['C','minus','D','equals-3','target-3']];
const T2_TRACK_VARIANTS=[
  [['A','O','B','E','target-1'],['B','P','C','equals-2','target-2'],['C','minus','D','equals-3','target-3']],
  [['A','O','B','E','target-1'],['B','P','C','equals-2','target-2'],['C','plus','D','equals-3','target-3']],
  [['A','O','B','E','target-1'],['B','P','C','E','target-2'],['C','minus','D','equals-3','target-3']]
];
const ARITH={'+':(a,b)=>a+b,'−':(a,b)=>a-b,'×':(a,b)=>a*b,'÷':(a,b)=>b!==0&&a%b===0?a/b:null};
const mod=n=>((n%6)+6)%6;

export function turningRavineOutputs(tier=1){
  return [{id:'eq1',label:'Equation 1: bridge',trigger:'on-commit',effect:{kind:'passage'}},{id:'eq2',label:'Equation 2: shelter',trigger:'phase-start',effect:{kind:'shelter',amount:2,targetIds:['number','shape','sustain']}},{id:'eq3',label:'Equation 3: roots',trigger:'phase-start',effect:{kind:'roots'}},...(tier===5?[{id:'eq4',label:'Equation 4: strike window',trigger:'continuous',effect:{kind:'strike-window'}}]:tier>=3?[{id:'eq4',label:'Equation 4: repair stream',trigger:'post-hazard',effect:{kind:'repair-stream',amount:2}}]:[])];
}

export function placeRavineTracks({seed=1,tier=1,layoutId='river',nodeBudget=tier>=3?600000:50000}={}){
  if(![1,2,3,4,5].includes(tier))return {status:'unknown',reasonCode:'ravine-tier-placement-pending'};
  const rng=topologyStream({familyId:'turning-ravine',tier,seed},'puzzle-footprint');
  const patch=topologyBaseTiles(layoutId).filter(t=>{const c=t.q+Math.floor(t.r/2);return c>=4&&c<=8&&t.r>=2&&t.r<=6&&!['water','hedge','gate'].includes(t.terrain)&&!t.passageOutputId;}).map(t=>`${t.q},${t.r}`);
  const allowed=new Set(patch),order=rng.shuffle([...patch].sort(compareHex)),adjacency=new Map(order.map(id=>[id,rng.shuffle(neighbourKeys(id).filter(n=>allowed.has(n)).sort(compareHex))]));
  const variants=rng.shuffle(tier>=4?T4_TRACK_VARIANTS:tier===3?T3_TRACK_VARIANTS:tier===2?T2_TRACK_VARIANTS:[TRACK_IDS,[TRACK_IDS[0],TRACK_IDS[1],['C','minus','D','equals-2','target-3']],[TRACK_IDS[0],TRACK_IDS[1],['C','plus','D','equals-3','target-3']],[TRACK_IDS[0],TRACK_IDS[1],['C','plus','D','equals-2','target-3']],[TRACK_IDS[0],['B','plus','C','E','target-2'],['C','minus','D','equals-3','target-3']],[TRACK_IDS[0],['B','plus','C','E','target-2'],['C','minus','D','E','target-3']]]);
  let nodes=0,answer=null,exhausted=false,trackIds;
  function track(index,placed){
    if(answer||exhausted)return;if(index===trackIds.length){answer={...placed};return;}
    const ids=trackIds[index],used=new Set(Object.values(placed)),path=[];
    function step(slot){
      if(answer||exhausted)return;if(nodes++>=nodeBudget){exhausted=true;return;}
      if(slot===ids.length){track(index+1,{...placed,...Object.fromEntries(ids.map((id,i)=>[id,path[i]]))});return;}
      const id=ids[slot],choices=placed[id]?[placed[id]]:slot?adjacency.get(path[slot-1]):order;
      for(const hex of choices){if(path.includes(hex)||!placed[id]&&used.has(hex)||slot&&!adjacency.get(path[slot-1]).includes(hex))continue;path.push(hex);step(slot+1);path.pop();if(answer||exhausted)return;}
    }
    step(0);
  }
  for(const variant of variants){trackIds=variant;track(0,{});if(answer||exhausted)break;}
  return answer?{status:'success',placements:answer,trackTokenIds:trackIds.map(ids=>[...ids]),nodes}:{status:'unknown',reasonCode:exhausted?'ravine-footprint-budget':'ravine-footprint-no-fit',nodes};
}

const T3_TRACK_VARIANTS=[
  [['A','O','B','E','target-1'],['B','plus','C','equals-2','target-2'],['C','P','D','equals-3','target-3'],['D','minus','F','equals-4','target-4']],
  [['A','O','B','E','target-1'],['B','plus','C','equals-2','target-2'],['C','P','D','equals-3','target-3'],['D','plus','F','equals-4','target-4']]
];
const T4_TRACK_VARIANTS=[
  [['A','O','B','P','C','E','target-1'],['B','plus','C','equals-2','target-2'],['C','divide','D','equals-2','target-3'],['D','Q','F','equals-4','target-4']],
  [['A','O','B','P','C','E','target-1'],['B','plus','C','equals-2','target-2'],['C','divide','D','equals-2','target-3'],['D','Q','F','E','target-4']],
  [['A','O','B','P','C','E','target-1'],['B','plus','C','E','target-2'],['C','divide','D','equals-3','target-3'],['D','Q','F','E','target-4']],
  [['A','O','B','P','C','E','target-1'],['B','plus','C','equals-2','target-2'],['C','divide','D','equals-3','target-3'],['D','Q','F','equals-4','target-4']]
];
// T5 (decision 5 Oct): the spec's five tracks with two 7-token tracks are proven not to fit the reserved patch, so T5 reuses the
// T4 four-track geometry (one 7-token track) with a multiplication in the solved network, larger operands and the strike-window output.
function deriveT5(rng,placed){
  for(let i=0;i<40;i++){const d=deriveT4(rng,placed);if(d&&d.arith.includes('×')&&d.values.C>=12)return d;}
  return null;
}
function deriveT4(rng,placed){
  void placed;
  const D=rng.int(2,6),q=rng.int(2,Math.floor(24/D)),values={A:rng.int(2,12),B:rng.int(2,12),C:D*q,D,F:rng.int(1,12)},ops={O:rng.pick(['+','×','−']),P:rng.pick(['+','×','−']),E:'=',Q:rng.pick(['+','×','−'])};
  const mid=ARITH[ops.O](values.A,values.B);if(mid===null||mid<0||mid>100)return null;
  const t1=ARITH[ops.P](mid,values.C),t2=values.B+values.C,t3=q,t4=ARITH[ops.Q](values.D,values.F);
  if([t1,t2,t3,t4].some(t=>t===null||t<1||t>100)||new Set([ops.O,ops.P,ops.Q]).size<2)return null;
  return {values,ops,fixed:{plus:'+',divide:'÷','equals-2':'=','equals-3':'=','equals-4':'=','target-1':t1,'target-2':t2,'target-3':t3,'target-4':t4},arith:[ops.O,ops.P,'+','÷',ops.Q]};
}
function deriveT2(rng,placed){
  const third=placed.trackTokenIds[2][1]==='minus'?'−':'+',values={A:rng.int(2,12),B:rng.int(2,12),C:rng.int(3,24),D:rng.int(1,12)},ops={O:rng.pick(['+','×','−']),P:rng.pick(['+','×','−','÷']),E:'='};
  const t1=ARITH[ops.O](values.A,values.B),t2=ARITH[ops.P](values.B,values.C),t3=ARITH[third](values.C,values.D);
  if([t1,t2,t3].some(t=>t===null||t<1||t>100)||new Set([ops.O,ops.P,third]).size<2)return null;
  return {values,ops,fixed:{plus:'+',minus:'−','equals-2':'=','equals-3':'=','target-1':t1,'target-2':t2,'target-3':t3},arith:[ops.O,ops.P,third]};
}
function deriveT3(rng,placed){
  const fourth=placed.trackTokenIds[3][1]==='minus'?'−':'+',D=rng.int(2,6),q=rng.int(2,Math.floor(24/D)),values={A:rng.int(2,12),B:rng.int(2,12),C:D*q,D,F:rng.int(1,12)},ops={O:rng.pick(['+','×','−']),P:'÷',E:'='};
  const t1=ARITH[ops.O](values.A,values.B),t2=values.B+values.C,t3=q,t4=ARITH[fourth](values.D,values.F);
  if([t1,t2,t3,t4].some(t=>t===null||t<1||t>100)||values.C>24)return null;
  return {values,ops,fixed:{plus:'+',minus:'−','equals-2':'=','equals-3':'=','equals-4':'=','target-1':t1,'target-2':t2,'target-3':t3,'target-4':t4},arith:[ops.O,'+','÷',fourth]};
}
// Mission subsets (spec 5): each set of maxActive tracks is solved on its own wheels; a useful configuration is a wheel
// assignment that powers that subset. At least two are required overall and one must differ from the full solution.
function usefulConfigurations(puzzle,fullOrientations,subsetSize){
  const configs=new Map();
  for(let skip=0;skip<puzzle.tracks.length;skip++){
    const tracks=puzzle.tracks.filter((_,i)=>i!==skip).slice(0,subsetSize),ids=new Set(tracks.flatMap(t=>t.tokenIds));
    const sub={...puzzle,tracks,tokens:puzzle.tokens.filter(t=>ids.has(t.id)),outputs:puzzle.outputs.filter(o=>tracks.some(t=>t.id===o.id)),maxActiveOutputs:subsetSize,minimumTrueTracksForCommission:subsetSize,defaultOutputIds:tracks.slice(0,2).map(t=>t.id),lockGroups:[]};
    const result=solvePuzzle(sub,{limit:50,nodeBudget:200000});
    for(const sol of result.solutions||[]){const key=tracks.map(t=>t.id).join('+')+'|'+Object.keys(sol.orientations).sort().map(k=>k+sol.orientations[k]).join(',');configs.set(key,{subset:tracks.map(t=>t.id),differs:Object.keys(sol.orientations).some(k=>fullOrientations[k]!==sol.orientations[k])});}
  }
  return [...configs.values()];
}
const TIER_RULES={
  2:{derive:deriveT2,maxActive:2,minShared:2},
  3:{derive:deriveT3,maxActive:3,minShared:2},
  4:{derive:deriveT4,maxActive:3,minShared:2},
  5:{derive:deriveT5,maxActive:3,minShared:2}
};
function generateRavinePuzzleTiered({tier,seed,layoutId,controlHex,placement,maxAttempts}){
  const rules=TIER_RULES[tier],placed=placement||placeRavineTracks({seed,tier,layoutId});if(placed.status!=='success')return placed;
  const rng=topologyStream({familyId:'turning-ravine',tier,seed},'puzzle');
  for(let attempt=0;attempt<Math.min(256,maxAttempts);attempt++){
    const derived=rules.derive(rng,placed);if(!derived)continue;
    const {values,ops,fixed}=derived;
    const tokens=Object.entries(placed.placements).map(([id,hex])=>{
      if(Object.hasOwn(values,id)){const faces=rng.shuffle([values[id],...rng.shuffle(Array.from({length:25},(_,i)=>i).filter(v=>v!==values[id])).slice(0,5)]);return {id,hex,kind:'number',faces,orientation:rng.int(0,5),given:false};}
      if(Object.hasOwn(ops,id))return {id,hex,kind:'operator',faces:[...FACES],orientation:rng.int(0,5),given:false};
      return {id,hex,kind:typeof fixed[id]==='number'?'number':'operator',value:fixed[id],given:true};
    });
    const orientations=Object.fromEntries(tokens.filter(t=>t.faces).map(t=>[t.id,mod(-t.faces.indexOf(t.kind==='operator'?ops[t.id]:values[t.id]))]));
    const outputs=turningRavineOutputs(tier),variables=tokens.filter(t=>t.faces);
    const puzzle={id:'ravine-network',kind:'equation-wheels',controlId:'control',controlHex,draftSchemaVersion:1,networkGroupId:'network',tokens,tracks:placed.trackTokenIds.map((tokenIds,i)=>({id:`eq${i+1}`,tokenIds})),outputs,maxActiveOutputs:rules.maxActive,minimumTrueTracksForCommission:rules.maxActive===2?3:rules.maxActive,defaultOutputIds:['eq1','eq2','eq3'].slice(0,rules.maxActive),solutionParameters:{orientations},lockGroups:[{id:'network',anchor:controlHex,memberIds:variables.map(t=>t.id),effectKinds:['rewind','environment']},...variables.map(t=>({id:`wheel-${t.id}`,anchor:controlHex,memberIds:[t.id],effectKinds:['rewind','environment']}))]};
    const proof=solvePuzzle(puzzle,{limit:2,nodeBudget:600000});
    if(proof.status!=='success'||proof.solutions.length!==1||!proof.exhaustive)continue;
    const content=rotationHooks.createActive(puzzle),results=validateRotation(puzzle,content),changed=variables.filter(t=>content.orientations[t.id]!==orientations[t.id]).length;
    if(changed<Math.ceil(variables.length/2)||Object.values(results.tracks).filter(t=>t.powered).length>1)continue;
    const full=validateRotation(puzzle,{orientations});if(!Object.values(full.tracks).every(t=>t.valid&&t.powered))continue;
    const shared=variables.filter(t=>t.kind==='number'&&puzzle.tracks.filter(track=>track.tokenIds.includes(t.id)).length>1).map(t=>t.id);
    if(shared.length<rules.minShared)continue;
    let useful=null;
    if(tier>=3){useful=usefulConfigurations(puzzle,orientations,rules.maxActive);if(useful.length<2||!useful.some(c=>c.differs))continue;}
    return {status:'success',puzzle,attempt,mathematicalEvidence:{fullSolutions:1,exhaustive:true,solverNodes:proof.nodes,initialChanged:changed,initialTrueTracks:Object.values(results.tracks).filter(t=>t.powered).length,solvedValues:Object.fromEntries(variables.map(t=>[t.id,activeFace(t.faces,orientations[t.id])])),sharedNumbers:shared,distinctOperators:[...new Set(derived.arith)],exactDivision:derived.arith.includes('÷'),...(useful?{usefulConfigurations:useful.length,usefulDifferingFromFull:useful.filter(c=>c.differs).length}:{})},puzzleFingerprint:hashValue({roles:tokens.map(t=>[t.id,t.kind,!!t.faces]),tracks:puzzle.tracks.map(t=>t.tokenIds),solved:Object.fromEntries(tokens.map(t=>[t.id,t.faces?t.faces[((0-orientations[t.id])%6+6)%6]:t.value]))})};
  }
  return {status:'unknown',reasonCode:'ravine-puzzle-attempt-budget',attempts:Math.min(256,maxAttempts)};
}

export function generateRavinePuzzle({tier=1,seed=1,layoutId='river',controlHex='2,4',placement=null,maxAttempts=256}={}){
  if(tier>=2&&tier<=5)return generateRavinePuzzleTiered({tier,seed,layoutId,controlHex,placement,maxAttempts});
  if(tier!==1)return {status:'unknown',reasonCode:'ravine-tier-maths-pending'};
  const placed=placement||placeRavineTracks({seed,tier,layoutId});if(placed.status!=='success')return placed;
  const rng=topologyStream({familyId:'turning-ravine',tier,seed},'puzzle');
  for(let attempt=0;attempt<Math.min(256,maxAttempts);attempt++){
    const subtract=placed.trackTokenIds[2][1]==='minus';
    const values={A:rng.int(2,10),B:rng.int(2,10),C:rng.int(3,20)},op=subtract?rng.pick(['+','×']):'×';values.D=rng.int(1,values.C-1);
    const fixed={plus:'+',minus:'−','equals-2':'=','equals-3':'=','target-1':op==='+'?values.A+values.B:values.A*values.B,'target-2':values.B+values.C,'target-3':subtract?values.C-values.D:values.C+values.D};
    const tokens=Object.entries(placed.placements).map(([id,hex])=>{
      if(Object.hasOwn(values,id)){const faces=rng.shuffle([values[id],...rng.shuffle(Array.from({length:25},(_,i)=>i).filter(v=>v!==values[id])).slice(0,5)]);return {id,hex,kind:'number',faces,orientation:rng.int(0,5),given:false};}
      if(['O','E'].includes(id))return {id,hex,kind:'operator',faces:[...FACES],orientation:rng.int(0,5),given:false};
      return {id,hex,kind:typeof fixed[id]==='number'?'number':'operator',value:fixed[id],given:true};
    });
    const orientations=Object.fromEntries(tokens.filter(t=>t.faces).map(t=>[t.id,mod(-t.faces.indexOf(t.id==='O'?op:t.id==='E'?'=':values[t.id]))]));
    const outputs=turningRavineOutputs(tier),variables=tokens.filter(t=>t.faces);
    const puzzle={id:'ravine-network',kind:'equation-wheels',controlId:'control',controlHex,draftSchemaVersion:1,networkGroupId:'network',tokens,tracks:placed.trackTokenIds.map((tokenIds,i)=>({id:`eq${i+1}`,tokenIds})),outputs,maxActiveOutputs:2,minimumTrueTracksForCommission:3,defaultOutputIds:['eq1','eq2'],solutionParameters:{orientations},lockGroups:[{id:'network',anchor:controlHex,memberIds:variables.map(t=>t.id),effectKinds:['rewind','environment']},...variables.map(t=>({id:`wheel-${t.id}`,anchor:controlHex,memberIds:[t.id],effectKinds:['rewind','environment']}))]};
    const proof=solvePuzzle(puzzle,{limit:2,nodeBudget:100000});
    if(proof.status!=='success'||proof.solutions.length!==1||!proof.exhaustive)continue;
    const content=rotationHooks.createActive(puzzle),results=validateRotation(puzzle,content),changed=variables.filter(t=>content.orientations[t.id]!==orientations[t.id]).length;
    if(changed<Math.ceil(variables.length/2)||Object.values(results.tracks).filter(t=>t.powered).length>1)continue;
    const full=validateRotation(puzzle,{orientations});if(!Object.values(full.tracks).every(t=>t.valid&&t.powered))continue;
    return {status:'success',puzzle,attempt,mathematicalEvidence:{fullSolutions:1,exhaustive:true,solverNodes:proof.nodes,initialChanged:changed,initialTrueTracks:Object.values(results.tracks).filter(t=>t.powered).length,solvedValues:Object.fromEntries(variables.map(t=>[t.id,activeFace(t.faces,orientations[t.id])])),sharedNumbers:variables.filter(t=>t.kind==='number'&&puzzle.tracks.filter(track=>track.tokenIds.includes(t.id)).length>1).map(t=>t.id)},puzzleFingerprint:hashValue({roles:tokens.map(t=>[t.id,t.kind,!!t.faces]),tracks:puzzle.tracks.map(t=>t.tokenIds)})};
  }
  return {status:'unknown',reasonCode:'ravine-puzzle-attempt-budget',attempts:Math.min(256,maxAttempts)};
}

export function generateTurningRavineCandidate({tier=1,seed=1,layoutId='river',reference=false}={}){
  if(![1,2,3,4,5].includes(tier))return {status:'unknown',reasonCode:'ravine-tier-pending'};
  const placement=placeRavineTracks({tier,seed,layoutId});if(placement.status!=='success')return placement;
  const topology=generateTopology({familyId:'turning-ravine',tier,seed,layoutId,reference,reservedHexes:Object.values(placement.placements)});if(topology.status!=='success')return topology;
  const maths=generateRavinePuzzle({tier,seed,layoutId,controlHex:topology.anchors.control,placement});if(maths.status!=='success')return maths;
  const {anchors,deployment}=topology,tiles=topology.tiles.map(t=>t.passageOutputId?{...t,passageOutputId:'eq1'}:t);
  const violations=crossingExitViolations({tiles});if(violations.length)return {status:'unknown',reasonCode:'ravine-crossing-invalid',violations};
  const used=new Set([...deployment,...Object.values(anchors),...Object.values(placement.placements)]),rng=topologyStream({familyId:'turning-ravine',tier,seed},'entities');
  const positions=rng.shuffle([offsetKey(10,2),...neighbourKeys(offsetKey(10,2))]);
  const position=positions.find(hex=>!used.has(hex)&&deployment.every(d=>hexDistance(d,hex)>=5)&&hexDistance(hex,anchors.control)>=3&&tiles.some(t=>`${t.q},${t.r}`===hex&&!['water','hedge','gate'].includes(t.terrain)&&!t.passageOutputId));
  if(!position)return {status:'unknown',reasonCode:'ravine-enemy-placement'};
  const integrity=stationMaxIntegrity(tier),names={control:'Ravine control',number:'Calibration wheel',shape:'Turning joint',sustain:'Wind stabiliser',alcove:'Brace alcove'};
  const controlled=tiles.find(t=>t.passageOutputId),blueprint={schemaVersion:2,moduleKey:'primary',familyId:'turning-ravine',tier,seed:seed>>>0,parameterSeed:seed>>>0,generatorVersion:1,rulesVersion:2,layoutId,attempt:topology.attempt,tiles,deployment,puzzle:maths.puzzle,outputs:turningRavineOutputs(tier),stations:Object.entries(names).map(([id,name])=>({id,name,hex:anchors[id],artId:id==='sustain'?'terrain-apple-tree-v1':id==='shape'?'mechanism-plinth':'mechanism-hive-ledger-board-v1',...(id==='alcove'?{}:{maxIntegrity:integrity}),...(['number','shape','sustain'].includes(id)?{capacity:CHARGE_CAPACITY[tier-1]}:{})})),enemies:[{id:'rewinder-1',ruleId:'rewinder',artId:'crosswind',position,wakePhase:2}],hazards:[{id:'ravine-wind',sites:[{id:'wind-site',targetId:'sustain'},...(tier===5&&controlled?[{id:'passage-site',targetId:'controlled-passage'}]:[])],mutation:{kind:'puzzle'}}],sites:controlled?[{id:'controlled-passage',anchor:`${controlled.q},${controlled.r}`}]:[],deadline:5,orchard:{hex:anchors.orchard,name:'Ninefold tree',artId:'terrain-apple-tree-v1'},orchardMaxIntegrity:orchardMaxIntegrity(tier),certificateId:null,structuralFingerprint:topology.structuralFingerprint,constructionPacket:{id:'ravine-tracks-v1',version:1,reservedHexes:Object.values(placement.placements),placementNodes:placement.nodes},commission:{poweredCount:tier>=3?3:2,selectableOutputIds:turningRavineOutputs(tier).map(o=>o.id)}};
  const check=validateBlueprint(blueprint);if(!check.ok)return {status:'failure',reasonCode:'ravine-blueprint-schema',errors:check.errors};
  return {status:'success',blueprint,topologyEvidence:topology.metrics,mathematicalEvidence:maths.mathematicalEvidence,puzzleFingerprint:maths.puzzleFingerprint,certified:false};
}
