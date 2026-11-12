import {topologyStream,generateTopology} from './topology.js';
import {crossingExitViolations} from './crossing-invariants.js';
import {solvePuzzle,validatePacking,packingHooks,distinctTransforms,transformedCells} from '../puzzles/packing.js';
import {transformAxial} from './bank.js';
import {validateBlueprint,CHARGE_CAPACITY,stationMaxIntegrity,orchardMaxIntegrity,neighbourKeys,hexDistance,offsetKey,hashValue} from '../index.js';

const SHAPES={
  2:[['domino',[[0,0],[1,0]]]],
  3:[['straight3',[[0,0],[1,0],[2,0]]],['elbow3',[[0,0],[1,0],[0,1]]]],
  4:[['straight4',[[0,0],[1,0],[2,0],[3,0]]],['hook4',[[0,0],[1,0],[2,0],[1,1]]],['diamond4',[[0,0],[1,0],[0,1],[1,1]]]]
};
const TIER_RULES={
  1:{sizes:[2,3,3],sockets:3,forbidden:1,forecast:0,reflect:false},
  2:{sizes:[3,3,3],sockets:4,forbidden:2,forecast:0,reflect:false},
  3:{sizes:[3,3,4],sockets:4,forbidden:3,forecast:0,reflect:true},
  4:{sizes:[3,4,4],sockets:5,forbidden:3,forecast:1,reflect:true},
  5:{sizes:[3,4,4],sockets:5,forbidden:4,forecast:2,reflect:true}
};
const parse=id=>id.split(',').map(Number);
const key=([q,r])=>`${q},${r}`;

export function hollowBoughOutputs(){
  return [{id:'shelter-packing',label:'Shelter',trigger:'phase-start',effect:{kind:'shelter',amount:2,coverage:'puzzle',targetIds:[]}}];
}

function pickApproach(patchCells,tiles,centre,rng){
  const patch=new Set(patchCells),tileMap=new Map(tiles.map(t=>[`${t.q},${t.r}`,t])),open=id=>{const t=tileMap.get(id);return !!t&&!['water','hedge','gate'].includes(t.terrain)&&!t.solid&&!t.passageOutputId;};
  const ring=patchCells.filter(id=>hexDistance(id,centre)===2&&neighbourKeys(id).some(n=>!patch.has(n)&&open(n)));
  if(ring.length<2)return null;
  const first=rng.pick(ring),far=ring.filter(id=>hexDistance(id,first)>=3);
  return [first,far.length?rng.pick(far):rng.pick(ring.filter(id=>id!==first))];
}

function preplace(rng,pieces,patchCells,rules,approach,budget=4000){
  const patch=new Set(patchCells);let nodes=0;
  const options=pieces.map(piece=>distinctTransforms(piece,rules.reflect).flatMap(t=>patchCells.map(origin=>({pieceId:piece.id,originHex:origin,orientation:t.orientation,reflected:t.reflected}))));
  function go(i,placements){
    if(nodes++>budget)return null;
    if(i===pieces.length)return validatePacking({patchCells,pieces,sockets:[],forbiddenCells:[],approachCells:approach,reflectionAllowed:rules.reflect},{placements},{complete:true}).valid?placements:null;
    for(const option of rng.shuffle(options[i])){
      const next=[...placements,option];
      if(!validatePacking({patchCells,pieces,sockets:[],forbiddenCells:[],approachCells:approach,reflectionAllowed:rules.reflect},{placements:next},{complete:false}).valid)continue;
      const found=go(i+1,next);if(found)return found;
    }
    return null;
  }
  void patch;return go(0,[]);
}

// Canonical pattern over the 12 symmetries of the radius-2 disc: piece shapes plus where sockets, forbidden cells and approaches sit.
export function canonicalBoughPattern(puzzle,centre){
  const [cq,cr]=parse(centre),forms=[];
  for(const reflected of [false,true])for(let rotation=0;rotation<6;rotation++){
    const map=ids=>ids.map(id=>{const [q,r]=parse(id);return JSON.stringify(transformAxial([q-cq,r-cr],rotation,reflected));}).sort();
    forms.push(JSON.stringify({sockets:map(puzzle.sockets),forbidden:map(puzzle.forbiddenCells),approach:map(puzzle.approachCells),forecast:map(puzzle.forecastCellIds)}));
  }
  return hashValue({shapes:puzzle.pieces.map(p=>p.cells.length+':'+JSON.stringify(p.cells)).sort(),pattern:forms.sort()[0]});
}

export function generateBoughPuzzle({tier=1,seed=1,controlHex='2,4',patchCells,tiles,centre,maxAttempts=256}={}){
  const rules=TIER_RULES[tier];if(!rules||!Array.isArray(patchCells)||patchCells.length!==19)return {status:'failure',reasonCode:'bough-input'};
  const rng=topologyStream({familyId:'hollow-bough',tier,seed},'puzzle');
  for(let attempt=0;attempt<Math.min(256,maxAttempts);attempt++){
    const chosen=rules.sizes.map(size=>rng.pick(SHAPES[size]));
    if(new Set(chosen.map(c=>c[0])).size<2)continue;
    const pieces=chosen.map(([,cells],i)=>({id:String.fromCharCode(97+i),cells}));
    const approach=pickApproach(patchCells,tiles,centre,rng);if(!approach)return {status:'unknown',reasonCode:'bough-approach'};
    const placed=preplace(rng,pieces,patchCells,rules,approach);if(!placed)continue;
    const covered=new Set(placed.flatMap(p=>transformedCells(pieces.find(x=>x.id===p.pieceId),p.orientation,p.reflected).map(([q,r])=>{const o=parse(p.originHex);return key([q+o[0],r+o[1]]);})));
    const coveredList=[...covered].sort(),uncovered=patchCells.filter(id=>!covered.has(id)&&!approach.includes(id));
    if(coveredList.length<rules.sockets||uncovered.length<rules.forbidden)continue;
    const sockets=rng.shuffle(coveredList).slice(0,rules.sockets).sort(),forbidden=rng.shuffle(uncovered).slice(0,rules.forbidden).sort();
    const forecastCellIds=sockets.slice(0,rules.forecast);
    const puzzle={id:'hollow-bough',kind:'polyhex',controlId:'control',controlHex,draftSchemaVersion:1,networkGroupId:'network',patchCells:[...patchCells],pieces,sockets,forbiddenCells:forbidden,approachCells:approach,reflectionAllowed:rules.reflect,forecastCellIds,defaultOutputIds:['shelter-packing'],outputs:hollowBoughOutputs(),solutionParameters:{placements:placed},
      lockGroups:[{id:'network',anchor:controlHex,memberIds:[],effectKinds:['jam','environment']},{id:'patch',anchor:centre,memberIds:[],effectKinds:['jam','environment']},...pieces.map(p=>({id:`piece-${p.id}`,anchor:centre,memberIds:[p.id],effectKinds:['jam']}))]};
    if(!validatePacking(puzzle,{placements:placed}).valid)continue;
    const proof=solvePuzzle(puzzle,{limit:24,nodeBudget:400000});
    if(!['success','unknown'].includes(proof.status)||!proof.solutions.length)continue;
    const coverages=new Set(proof.solutions.map(s=>validatePacking(puzzle,s).coveredCells.join(';'))),exposed=new Set(proof.solutions.map(s=>validatePacking(puzzle,s).freeCells.join(';')));
    if(coverages.size<2||exposed.size<2)continue;
    if(packingHooks.evaluate(puzzle,packingHooks.createActive(puzzle)).valid)continue;
    return {status:'success',puzzle,attempt,mathematicalEvidence:{legalPackingsFound:proof.solutions.length,distinctCoverages:coverages.size,distinctExposures:exposed.size,exhaustive:!!proof.exhaustive,solverNodes:proof.nodes,coveredArea:coveredList.length,pieceShapes:chosen.map(c=>c[0]),reflection:rules.reflect},puzzleFingerprint:canonicalBoughPattern(puzzle,centre)};
  }
  return {status:'unknown',reasonCode:'bough-puzzle-attempt-budget',attempts:Math.min(256,maxAttempts)};
}

export function generateHollowBoughCandidate({tier=1,seed=1,layoutId='river',reference=false}={}){
  const topology=generateTopology({familyId:'hollow-bough',tier,seed,layoutId,reference});if(topology.status!=='success')return topology;
  const {anchors,deployment,tiles,patchCells}=topology;
  const open=tiles.map(({passageOutputId,...t})=>t),violations=crossingExitViolations({tiles:open});if(violations.length)return {status:'unknown',reasonCode:'bough-crossing-invalid',violations};
  const maths=generateBoughPuzzle({tier,seed,controlHex:anchors.control,patchCells,tiles:open,centre:anchors.shape});if(maths.status!=='success')return maths;
  const used=new Set([...deployment,...Object.values(anchors)]),rng=topologyStream({familyId:'hollow-bough',tier,seed},'entities');
  const rules=tier===1?['jammer']:tier===2?['jammer','hunter']:['jammer','hunter','breaker'],enemies=[];
  for(const [i,ruleId] of rules.entries()){
    const defaultHex=[offsetKey(10,2),offsetKey(9,4),offsetKey(10,6)][i],choices=rng.shuffle([defaultHex,...neighbourKeys(defaultHex)]);
    const position=choices.find(id=>!used.has(id)&&!patchCells.includes(id)&&deployment.every(d=>hexDistance(id,d)>=5)&&hexDistance(id,anchors.control)>=3&&open.some(t=>`${t.q},${t.r}`===id&&!['water','hedge','gate'].includes(t.terrain)));
    if(!position)return {status:'unknown',reasonCode:'bough-enemy-placement'};used.add(position);
    enemies.push({id:`${ruleId}-1`,ruleId,artId:{jammer:'hookmole',hunter:'scruffcrow',breaker:'strawling'}[ruleId],position,wakePhase:tier<3?2:tier===3&&ruleId!=='jammer'?2:1});
  }
  const names={control:'Branch control',number:'Shelter meter',shape:'Branch clearing',sustain:'Root keeper',alcove:'Brace alcove'},integrity=stationMaxIntegrity(tier),capacity=CHARGE_CAPACITY[tier-1];
  const outputs=hollowBoughOutputs(),forecast=maths.puzzle.forecastCellIds;
  const blueprint={schemaVersion:2,moduleKey:'primary',familyId:'hollow-bough',tier,seed:seed>>>0,parameterSeed:seed>>>0,generatorVersion:1,rulesVersion:2,layoutId:topology.layoutId,attempt:topology.attempt,tiles:open,deployment,puzzle:maths.puzzle,outputs,
    stations:Object.entries(names).map(([id,name])=>({id,name,hex:anchors[id],artId:id==='sustain'?'terrain-apple-tree-v1':id==='shape'?'mechanism-plinth':'mechanism-hive-ledger-board-v1',...(id==='alcove'?{}:{maxIntegrity:integrity}),...(['number','shape','sustain'].includes(id)?{capacity}:{})})),
    enemies,hazards:[{id:'roots-fall',sites:[{id:'sustain-site',targetId:'sustain'}],mutation:forecast.length?{kind:'suppress-shelter',groupId:'patch',cells:[...forecast]}:{kind:'none'}}],sites:[],deadline:5,orchard:{hex:anchors.orchard,name:'Ninefold tree',artId:'terrain-apple-tree-v1'},orchardMaxIntegrity:orchardMaxIntegrity(tier),certificateId:null,structuralFingerprint:topology.structuralFingerprint,commission:{poweredIds:['shelter-packing']}};
  const check=validateBlueprint(blueprint);if(!check.ok)return {status:'failure',reasonCode:'bough-blueprint-schema',errors:check.errors};
  return {status:'success',blueprint,topologyEvidence:topology.metrics,mathematicalEvidence:maths.mathematicalEvidence,puzzleFingerprint:maths.puzzleFingerprint,certified:false};
}
