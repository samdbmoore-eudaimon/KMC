import {crossingExitViolations} from './crossing-invariants.js';
import {topologyStream,generateTopology} from './topology.js';
import {solvePuzzle,nextDeduction,validateSudoku,sudokuHooks} from '../puzzles/sudoku.js';
import {generateAdvancedSudoku} from './advanced-sudoku.js';
import {validateBlueprint,CHARGE_CAPACITY,stationMaxIntegrity,orchardMaxIntegrity,neighbourKeys,hexDistance,offsetKey,hashValue} from '../index.js';
const SOLUTION=[[1,3,4,2],[4,2,1,3],[2,4,3,1],[3,1,2,4]];
const REFERENCE_CAGES=[['r0c1','r1c1',5],['r0c2','r0c3',6],['r1c0','r2c0',6],['r1c2','r2c2',4],['r2c1','r3c1',5],['r2c3','r3c2',3]];
export function fourLocksOutputs() {
  return [
    {id:'bridge',label:'Bridge',cost:2,trigger:'on-commit',effect:{kind:'passage'}},
    {id:'shelter',label:'Shelter',cost:3,trigger:'phase-start',effect:{kind:'shelter',amount:2,targetIds:['number','shape','sustain']}},
    {id:'roots',label:'Roots',cost:4,trigger:'phase-start',effect:{kind:'roots'}},
    {id:'storm',label:'Storm',cost:5,trigger:'phase-start',effect:{kind:'storm'}}
  ];
}
function reasoning(puzzle) {
  const content=sudokuHooks.createActive(puzzle),steps=[];
  for(let n=0;n<16;n++){const step=nextDeduction(puzzle,content,{advanced:false});if(!('value'in step))break;steps.push(step);content.grid[step.row][step.col]=step.value;}
  return {complete:validateSudoku(puzzle,content).valid,steps};
}
export function generateFourLocksPuzzle({tier=1,seed=1,controlHex='2,4',reference=false,maxAttempts=256}={}) {
  if(tier>=4){
    const result=generateAdvancedSudoku({tier,seed,maxAttempts});if(result.status!=='success')return result;
    const puzzle={...result.puzzle,id:'four-locks-ledger',controlId:'control',controlHex,draftSchemaVersion:1,networkGroupId:'network',outputs:fourLocksOutputs(),outputBudget:[7,7,7,8,8][tier-1],defaultOutputIds:['bridge','shelter'],solutionParameters:{grid:result.solution},lockGroups:[{id:'network',anchor:controlHex,memberIds:Array.from({length:16},(_,i)=>`r${Math.floor(i/4)}c${i%4}`),effectKinds:['jam']},...Array.from({length:4},(_,row)=>({id:`row-${row}`,anchor:controlHex,memberIds:Array.from({length:4},(_,col)=>`r${row}c${col}`),effectKinds:['jam']}))]};
    return {status:'success',puzzle,attempt:result.attempt,mathematicalEvidence:result.mathematicalEvidence,puzzleFingerprint:hashValue({givens:puzzle.givens.map(g=>[g.row,g.col]),cages:puzzle.cages.map(c=>c.cellIds).sort()})};
  }
  const rng=topologyStream({familyId:'four-locks',tier,seed},'puzzle');
  for(let attempt=0;attempt<maxAttempts;attempt++) {
    const symbols=reference?[1,2,3,4]:rng.shuffle([1,2,3,4]);
    const solved=SOLUTION.map(row=>row.map(v=>symbols[v-1]));
    let givens,cages;
    if(tier===2&&reference){givens=[{row:0,col:0,value:1},{row:3,col:3,value:4}];cages=REFERENCE_CAGES.map(([a,b,sum],i)=>({id:`cage-${i}`,cellIds:[a,b],sum}));}
    else {
      const order=rng.shuffle(Array.from({length:16},(_,i)=>i)),givenCount=tier===1?6:tier===2?rng.int(2,4):rng.int(2,3);
      givens=order.slice(0,givenCount).map(i=>({row:Math.floor(i/4),col:i%4,value:solved[Math.floor(i/4)][i%4]}));
      const pairs=[];
      for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(const [dr,dc]of [[0,1],[1,0]])if(r+dr<4&&c+dc<4)pairs.push({cellIds:[`r${r}c${c}`,`r${r+dr}c${c+dc}`],sum:solved[r][c]+solved[r+dr][c+dc]});
      cages=rng.shuffle(pairs).slice(0,tier===1?rng.int(2,3):tier===2?rng.int(5,6):rng.int(5,7)).map((cage,i)=>({...cage,id:`cage-${i}`}));
    }
    const puzzle={id:'four-locks-ledger',kind:'sudoku4',size:4,controlId:'control',controlHex,givens,cages,draftSchemaVersion:1,networkGroupId:'network',outputs:fourLocksOutputs(),outputBudget:[7,7,7,8,8][tier-1],defaultOutputIds:['bridge','shelter'],solutionParameters:{grid:solved},
      lockGroups:[{id:'network',anchor:controlHex,memberIds:Array.from({length:16},(_,i)=>`r${Math.floor(i/4)}c${i%4}`),effectKinds:['jam']},...Array.from({length:4},(_,row)=>({id:`row-${row}`,anchor:controlHex,memberIds:Array.from({length:4},(_,col)=>`r${row}c${col}`),effectKinds:['jam']}))]};
    const proof=solvePuzzle(puzzle),deductions=reasoning(puzzle);
    const cageSteps=deductions.steps.filter(s=>s.type==='cage-single').length;
    if(proof.status!=='success'||proof.solutions.length!==1||!proof.exhaustive||!deductions.complete||deductions.steps.length<(tier===1?4:8)||cageSteps<(tier===1?1:2))continue;
    return {status:'success',puzzle,attempt,mathematicalEvidence:{unique:true,solverNodes:proof.nodes,deductions},puzzleFingerprint:hashValue({givens:givens.map(g=>[g.row,g.col]),cages:cages.map(c=>c.cellIds).sort()})};
  }
  return {status:'unknown',reasonCode:'sudoku-attempt-budget',attempts:maxAttempts};
}
export function generateFourLocksCandidate({tier=1,seed=1,layoutId='river',reference=false,legacyCrossings=false}={}) {
  const topology=generateTopology({familyId:'four-locks',tier,seed,layoutId,reference});if(topology.status!=='success')return topology;
  if(!legacyCrossings){const violations=crossingExitViolations({tiles:topology.tiles});if(violations.length)return {status:'unknown',reasonCode:'crossing-exit-blocked',violations};}
  const maths=generateFourLocksPuzzle({tier,seed,controlHex:topology.anchors.control,reference});if(maths.status!=='success')return maths;
  const {anchors,tiles,deployment}=topology,capacity=CHARGE_CAPACITY[tier-1],integrity=stationMaxIntegrity(tier);
  const names={control:'Ledger control',number:'Ledger bus',shape:'Bridge brace',sustain:'Tree maintenance',alcove:'Brace alcove'};
  const entityRng=topologyStream({familyId:'four-locks',tier,seed},'entities'),used=new Set([...deployment,...Object.values(anchors)]);
  const activeRules=tier===1?['jammer']:tier===2?['jammer','hunter']:['jammer','hunter','breaker'],enemies=[];
  for(const [i,ruleId]of activeRules.entries()) {
    const defaultHex=[offsetKey(10,2),offsetKey(9,4),offsetKey(10,6)][i];
    const choices=reference?[defaultHex,...neighbourKeys(defaultHex)]:entityRng.shuffle([defaultHex,...neighbourKeys(defaultHex)]);
    const position=choices.find(id=>!used.has(id)&&deployment.every(d=>hexDistance(id,d)>=5)&&hexDistance(id,anchors.control)>=3&&tiles.some(t=>`${t.q},${t.r}`===id&&!['water','hedge','gate'].includes(t.terrain)&&!t.passageOutputId));
    if(!position)return {status:'unknown',reasonCode:'enemy-placement'};used.add(position);
    enemies.push({id:`${ruleId}-1`,ruleId,artId:{jammer:'hookmole',hunter:'scruffcrow',breaker:'strawling'}[ruleId],position,wakePhase:tier<3?2:tier===3&&ruleId!=='jammer'?2:1});
  }
  const bridge=tiles.find(t=>t.passageOutputId),sites=bridge?[{id:'controlled-passage',anchor:`${bridge.q},${bridge.r}`}]:[];
  const blueprint={schemaVersion:2,moduleKey:'primary',familyId:'four-locks',tier,seed:seed>>>0,parameterSeed:seed>>>0,generatorVersion:1,rulesVersion:2,attempt:topology.attempt,layoutId:topology.layoutId,tiles,
    stations:Object.entries(names).map(([id,name])=>({id,hex:anchors[id],name,artId:id==='sustain'?'terrain-apple-tree-v1':id==='shape'?'mechanism-plinth':'mechanism-hive-ledger-board-v1',...(id==='alcove'?{}:{maxIntegrity:integrity}),...(['number','shape','sustain'].includes(id)?{capacity}:{})})),
    puzzle:maths.puzzle,outputs:fourLocksOutputs(),enemies,hazards:[{id:'root-drain',sites:[{id:'sustain-site',targetId:'sustain'},...(tier===5?[{id:'passage-site',targetId:'controlled-passage'}]:[])],mutation:{kind:'none'}}],sites,
    deployment,deadline:5,orchard:{hex:anchors.orchard,name:'Ninefold tree',artId:'terrain-apple-tree-v1'},orchardMaxIntegrity:orchardMaxIntegrity(tier),certificateId:null,structuralFingerprint:topology.structuralFingerprint,commission:{poweredCount:2,selectableOutputIds:['bridge','shelter','roots','storm']}};
  const schema=validateBlueprint(blueprint);if(!schema.ok)return {status:'failure',reasonCode:'blueprint-schema',errors:schema.errors};
  return {status:'success',blueprint,topologyEvidence:topology.metrics,mathematicalEvidence:maths.mathematicalEvidence,puzzleFingerprint:maths.puzzleFingerprint,certified:false};
}
