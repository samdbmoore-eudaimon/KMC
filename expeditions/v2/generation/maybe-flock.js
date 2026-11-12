import {topologyStream,generateTopology} from './topology.js';
import {crossingExitViolations} from './crossing-invariants.js';
import {solvePuzzle,lineClues,lineCandidates,deductionTrace,nonogramHooks} from '../puzzles/nonogram.js';
import {cellId} from '../puzzles/common.js';
import {validateBlueprint,CHARGE_CAPACITY,stationMaxIntegrity,orchardMaxIntegrity,neighbourKeys,hexDistance,offsetKey,hashValue} from '../index.js';

const SECTORS=['north','east','south'];
const sectorOfRow=r=>r<2?'north':r===2?'east':'south';
const PERCH_TARGETS={north:offsetKey(9,1),east:offsetKey(10,4),south:offsetKey(9,7)};
const ENEMY_BY_SECTOR={north:{ruleId:'jammer',artId:'hookmole'},east:{ruleId:'hunter',artId:'scruffcrow'},south:{ruleId:'breaker',artId:'strawling'}};
const split=clues=>clues.length>1;

export function maybeFlockOutputs(){
  return SECTORS.map(sector=>({id:`beam-${sector}`,label:`Beam ${sector}`,trigger:'phase-start',effect:{kind:'beam',sector}}));
}

function patternMetrics(grid){
  const rows=grid.map(lineClues),cols=Array.from({length:5},(_,c)=>lineClues(grid.map(r=>r[c])));
  const lines=[...rows,...cols],degenerate=lines.filter(c=>!c.length||(c.length===1&&c[0]===5)).length;
  return {rows,cols,splitLines:lines.filter(split).length,degenerate,filled:grid.flat().filter(v=>v==='filled').length};
}

function dependencyChain(trace){
  let switches=0,multi=0,previous=null;
  for(const step of trace.steps){if(previous&&previous!==step.axis)switches++;previous=step.axis;if(step.candidateCount>=3)multi++;}
  return {steps:trace.steps.length,switches,multiCandidateSteps:multi,overlap:trace.steps.filter(s=>s.candidateCount>1).length};
}

// Parallel propagation rounds: every row and column is intersected against the grid as it stood at the start of the round.
// A cell forced in round n can only feed lines in round n+1, so the round count is the real dependency depth.
function propagationRounds(puzzle){
  const grid=Array.from({length:5},()=>Array(5).fill('unknown'));for(const g of puzzle.givens)grid[g.row][g.col]=g.value;
  const rows=puzzle.rowClues.map(lineCandidates),cols=puzzle.columnClues.map(lineCandidates);
  let rounds=0,alternations=0,last=null;
  for(;rounds<25;){
    const found=new Map();
    const scan=(axis,i,domain)=>{
      const line=axis==='row'?grid[i]:grid.map(r=>r[i]),cands=domain.filter(p=>p.every((v,j)=>line[j]==='unknown'||line[j]===v));
      for(let j=0;j<5;j++)if(line[j]==='unknown'&&cands.length&&cands.every(p=>p[j]===cands[0][j])){const r=axis==='row'?i:j,c=axis==='row'?j:i;if(!found.has(r*5+c))found.set(r*5+c,{axis,value:cands[0][j]});}
    };
    for(let i=0;i<5;i++){scan('row',i,rows[i]);scan('column',i,cols[i]);}
    if(!found.size)break;rounds++;
    const axes=new Set([...found.values()].map(f=>f.axis));
    if(last&&!axes.has(last)&&axes.size)alternations++;last=[...axes][0];
    for(const [k,f] of found)grid[Math.floor(k/5)][k%5]=f.value;
  }
  return {rounds,alternations,complete:grid.every(r=>!r.includes('unknown'))};
}

const TIER_RULES={
  1:{given:true,minSplit:1,minSteps:4,minSwitches:0,minOverlap:1,minRounds:2,noDegenerate:false},
  2:{given:false,minSplit:2,minSteps:6,minSwitches:2,minOverlap:2,minRounds:3,noDegenerate:false},
  3:{given:false,minSplit:3,minSteps:8,minSwitches:3,minOverlap:2,minRounds:4,noDegenerate:false},
  4:{given:false,minSplit:3,minSteps:8,minSwitches:3,minOverlap:2,noDegenerate:true,minMulti:1,minRounds:4},
  5:{given:false,minSplit:4,minSteps:10,minSwitches:5,minOverlap:3,noDegenerate:true,minMulti:1,minRounds:5}
};

export function generateFlockPuzzle({tier=1,seed=1,controlHex='2,4',maxAttempts=256}={}){
  const rules=TIER_RULES[tier];if(!rules||!Number.isInteger(seed))return {status:'failure',reasonCode:'flock-input'};
  const rng=topologyStream({familyId:'maybe-flock',tier,seed},'puzzle');
  for(let attempt=0;attempt<Math.min(256,maxAttempts);attempt++){
    const count=rng.int(8,16),order=rng.shuffle(Array.from({length:25},(_,i)=>i)),on=new Set(order.slice(0,count));
    const grid=Array.from({length:5},(_,r)=>Array.from({length:5},(_,c)=>on.has(r*5+c)?'filled':'empty'));
    const m=patternMetrics(grid);
    if(m.degenerate>1||m.splitLines<rules.minSplit||(rules.noDegenerate&&m.degenerate>0))continue;
    if(!SECTORS.every(sector=>grid.some((row,r)=>sectorOfRow(r)===sector&&row.includes('filled'))))continue;
    let givens=[];
    if(rules.given){const empties=rng.shuffle(grid.flatMap((row,r)=>row.flatMap((v,c)=>v==='empty'?[{row:r,col:c}]:[])));if(!empties.length)continue;givens=[{...empties[0],value:'empty'}];}
    const puzzle={id:'maybe-flock',kind:'nonogram5',size:5,controlId:'control',controlHex,draftSchemaVersion:1,networkGroupId:'network',rowClues:m.rows,columnClues:m.cols,givens,sectorByCell:Object.fromEntries(grid.flatMap((row,r)=>row.map((_,c)=>[cellId(r,c),sectorOfRow(r)]))),defaultOutputIds:['beam-north','beam-east'],outputs:maybeFlockOutputs(),solutionParameters:{grid}};
    const proof=solvePuzzle(puzzle,{limit:2,nodeBudget:100000});
    if(proof.status!=='success'||proof.solutions.length!==1||!proof.exhaustive)continue;
    const trace=deductionTrace(puzzle);if(!trace.complete)continue;
    const chain={...dependencyChain(trace),...(()=>{const r=propagationRounds(puzzle);return {rounds:r.rounds,roundAlternations:r.alternations,roundsComplete:r.complete};})()};if(!chain.roundsComplete||chain.rounds<rules.minRounds)continue;
    if(chain.steps<rules.minSteps||chain.switches<rules.minSwitches||chain.overlap<rules.minOverlap||chain.multiCandidateSteps<(rules.minMulti||0))continue;
    const start=nonogramHooks.createActive(puzzle);if(nonogramHooks.evaluate(puzzle,start).valid)continue;
    return {status:'success',puzzle,attempt,mathematicalEvidence:{unique:true,solverNodes:proof.nodes,filled:m.filled,splitLines:m.splitLines,degenerateLines:m.degenerate,givens:givens.length,...chain},puzzleFingerprint:(()=>{const rows=grid.map(r=>r.map(v=>v==='filled'?1:0).join('')),mirrored=rows.map(r=>[...r].reverse().join(''));return hashValue({grid:[rows.join('/'),mirrored.join('/')].sort()[0],given:givens.map(g=>[g.row,g.col])});})()};
  }
  return {status:'unknown',reasonCode:'flock-puzzle-attempt-budget',attempts:Math.min(256,maxAttempts)};
}

function placePerches(tiles,reserved){
  const eligible=tiles.filter(t=>!['water','hedge','gate'].includes(t.terrain)&&!t.solid&&!t.passageOutputId).map(t=>`${t.q},${t.r}`),taken=new Set(reserved),perches={};
  for(const sector of SECTORS){
    const choice=eligible.filter(id=>!taken.has(id)).sort((a,b)=>hexDistance(a,PERCH_TARGETS[sector])-hexDistance(b,PERCH_TARGETS[sector])||(a<b?-1:1))[0];
    if(!choice)return null;perches[sector]=choice;taken.add(choice);
  }
  return perches;
}

export function generateMaybeFlockCandidate({tier=1,seed=1,layoutId='river',reference=false}={}){
  const topology=generateTopology({familyId:'maybe-flock',tier,seed,layoutId,reference});if(topology.status!=='success')return topology;
  const open=topology.tiles.map(({passageOutputId,...t})=>t),violations=crossingExitViolations({tiles:open});if(violations.length)return {status:'unknown',reasonCode:'flock-crossing-invalid',violations};
  const maths=generateFlockPuzzle({tier,seed,controlHex:topology.anchors.control});if(maths.status!=='success')return maths;
  const {anchors,deployment}=topology,tiles=open,reserved=[...deployment,...Object.values(anchors)];
  const perches=placePerches(tiles,reserved);if(!perches)return {status:'unknown',reasonCode:'flock-perch-placement'};
  const rng=topologyStream({familyId:'maybe-flock',tier,seed},'entities'),used=new Set([...reserved,...Object.values(perches)]);
  const roster=tier===1?['east']:tier===2?['east','north']:['east','north','south'],wake=tier<=2?2:tier===3?2:1,enemies=[];
  for(const sector of roster){
    const choices=rng.shuffle([perches[sector],...neighbourKeys(perches[sector])]);
    const position=choices.find(id=>!used.has(id)&&deployment.every(d=>hexDistance(id,d)>=5)&&hexDistance(id,anchors.control)>=3&&tiles.some(t=>`${t.q},${t.r}`===id&&!['water','hedge','gate'].includes(t.terrain)&&!t.passageOutputId));
    if(!position)return {status:'unknown',reasonCode:'flock-enemy-placement'};used.add(position);
    const {ruleId,artId}=ENEMY_BY_SECTOR[sector];enemies.push({id:`${ruleId}-1`,ruleId,artId,position,wakePhase:tier>=4?1:wake,sector});
  }
  const names={control:'Beam control',number:'Beam calibrator',shape:'Whistle tower',sustain:'Whistle keeper',alcove:'Brace alcove'},integrity=stationMaxIntegrity(tier),capacity=CHARGE_CAPACITY[tier-1];
  const controlCells=maths.puzzle.lockGroups,outputs=maybeFlockOutputs();
  const allCells=Array.from({length:25},(_,i)=>cellId(Math.floor(i/5),i%5));
  const puzzle={...maths.puzzle,perches:SECTORS.map(sector=>({sector,hex:perches[sector],groupId:`nest-${sector}`})),
    lockGroups:[{id:'network',anchor:anchors.control,memberIds:allCells,effectKinds:['jam','environment']},...[0,1,2,3,4].map(r=>({id:`row-${r}`,anchor:anchors.control,memberIds:Array.from({length:5},(_,c)=>cellId(r,c)),effectKinds:['jam','environment']})),...SECTORS.map(sector=>({id:`nest-${sector}`,anchor:perches[sector],memberIds:[],effectKinds:['nest']}))]};
  void controlCells;
  const blueprint={schemaVersion:2,moduleKey:'primary',familyId:'maybe-flock',tier,seed:seed>>>0,parameterSeed:seed>>>0,generatorVersion:1,rulesVersion:2,layoutId:topology.layoutId,attempt:topology.attempt,tiles,deployment,puzzle,outputs,
    stations:Object.entries(names).map(([id,name])=>({id,name,hex:anchors[id],artId:id==='sustain'?'terrain-apple-tree-v1':id==='shape'?'mechanism-plinth':'mechanism-hive-ledger-board-v1',...(id==='alcove'?{}:{maxIntegrity:integrity}),...(['number','shape','sustain'].includes(id)?{capacity}:{})})),
    enemies,hazards:[{id:'roost-drain',sites:[{id:'sustain-site',targetId:'sustain'}],mutation:{kind:'puzzle'}}],nests:SECTORS.map(sector=>({sectorId:sector,groupId:`nest-${sector}`})),
    sites:(()=>{const c=tiles.find(t=>t.passageOutputId);return c?[{id:'controlled-passage',anchor:`${c.q},${c.r}`}]:[];})(),deadline:5,orchard:{hex:anchors.orchard,name:'Ninefold tree',artId:'terrain-apple-tree-v1'},orchardMaxIntegrity:orchardMaxIntegrity(tier),certificateId:null,structuralFingerprint:topology.structuralFingerprint,commission:{poweredCount:2,selectableOutputIds:outputs.map(o=>o.id)}};
  const check=validateBlueprint(blueprint);if(!check.ok)return {status:'failure',reasonCode:'flock-blueprint-schema',errors:check.errors};
  return {status:'success',blueprint,topologyEvidence:topology.metrics,mathematicalEvidence:maths.mathematicalEvidence,puzzleFingerprint:maths.puzzleFingerprint,certified:false};
}
