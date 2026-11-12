import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateFourLocksCandidate} from '../../expeditions/v2/generation/four-locks.js';
import {canonicalTopology,canonicalSudokuPattern} from '../../expeditions/v2/generation/bank.js';
const ARCHETYPES=['river','islands','hedges','terraces'];
export function inventoryFourLocksPool({seedCount=8,generate=generateFourLocksCandidate,onGroup=()=>{}}={}){
  if(!Number.isInteger(seedCount)||seedCount<1||seedCount>8)throw Error('Pool sampling bound is seeds0..7 only');
  const requests=[],groups=[];
  for(let tier=1;tier<=5;tier++)for(const layoutId of ARCHETYPES){
    const topologies=new Map(),patterns=new Map(),reasonCounts={};let successes=0,unknowns=0,failures=0;
    for(let seed=0;seed<seedCount;seed++){
      const result=generate({tier,seed,layoutId});
      if(!['success','unknown','failure'].includes(result.status))throw Error('Invalid candidate status');
      if(result.status==='success'){
        const bp=result.blueprint;
        if(bp.familyId!=='four-locks'||bp.tier!==tier||bp.parameterSeed!==seed||bp.layoutId!==layoutId||bp.certificateId!==null||result.certified!==false)throw Error('Unexpected candidate identity or certification');
        const topology=canonicalTopology(bp),puzzle=canonicalSudokuPattern(bp.puzzle);
        successes++;
        if(!topologies.has(topology.serialization))topologies.set(topology.serialization,{seed,hash:topology.hash,serialization:topology.serialization});
        if(!patterns.has(puzzle.serialization))patterns.set(puzzle.serialization,{seed,hash:puzzle.hash,serialization:puzzle.serialization});
        requests.push({tier,layoutId,seed,status:'success',certified:false,certificateId:null,topologyHash:topology.hash,puzzleHash:puzzle.hash,acceptedTopologyAttempt:bp.attempt,mathematicalEvidence:{unique:result.mathematicalEvidence.unique,solverNodes:result.mathematicalEvidence.solverNodes,deductionSteps:result.mathematicalEvidence.deductions.steps.length,advancedPatternIndex:result.mathematicalEvidence.construction?.patternIndex,rejections:result.mathematicalEvidence.rejections},topologyMetrics:result.topologyEvidence});
      }else{
        if(result.status==='unknown')unknowns++;else failures++;
        reasonCounts[result.reasonCode||'unspecified']=(reasonCounts[result.reasonCode||'unspecified']||0)+1;
        requests.push({tier,layoutId,seed,status:result.status,certified:false,certificateId:null,reasonCode:result.reasonCode,attempts:result.attempts,rejections:result.rejections,lastRejection:result.lastRejection,errors:result.errors});
      }
    }
    const group={tier,layoutId,requests:seedCount,successes,unknowns,failures,topologyCount:topologies.size,puzzlePatternCount:patterns.size,missingTopologies:Math.max(0,8-topologies.size),reasonCounts,representativeTopologies:[...topologies.values()],representativePatterns:[...patterns.values()]};
    groups.push(group);onGroup({tier,layoutId,successes,unknowns,failures,topologyCount:topologies.size,puzzlePatternCount:patterns.size});
  }
  const tiers=Array.from({length:5},(_,i)=>{
    const tier=i+1,selected=groups.filter(g=>g.tier===tier),patterns=new Set(selected.flatMap(g=>g.representativePatterns.map(p=>p.serialization)));
    return {tier,requests:selected.reduce((s,g)=>s+g.requests,0),successes:selected.reduce((s,g)=>s+g.successes,0),puzzlePatternCount:patterns.size,missingPuzzlePatterns:Math.max(0,8-patterns.size),allArchetypesHaveEightTopologies:selected.every(g=>g.topologyCount>=8),sampleMeetsDiversityCounts:selected.every(g=>g.topologyCount>=8)&&patterns.size>=8};
  });
  return {schemaVersion:1,kind:'uncertified-four-locks-candidate-pool',command:'node scripts/dev/inventory-four-locks-pool.mjs',limits:{seeds:Array.from({length:seedCount},(_,i)=>i),maxRequests:160,actualRequests:requests.length,topologyAttemptsPerRequest:256,puzzleAttemptsPerRequest:256,plannerInvocations:0},groups,tiers,requests,limitations:['Candidate-pool inventory only. No tactical search, certificate, runtime entry or complete-bank acceptance.','Counts use full canonical serializations, not hashes, sums, labels or cosmetic transformations.','Eight sampled seeds cannot prove that a generator has fewer than eight possible patterns/topologies. Shortfalls are measured evidence, not impossibility.','All existing certified evidence and runtime content remain unchanged.']};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const report=inventoryFourLocksPool({onGroup:group=>console.log(JSON.stringify({phase:'inventory-group',...group}))});
  const target=new URL('../../docs/expeditions/v2/certification/four-locks/candidate-pool-inventory.json',import.meta.url);
  fs.writeFileSync(target,JSON.stringify(report,(_,value)=>typeof value==='number'&&!Number.isFinite(value)?String(value):value,2)+'\n');
  console.log(JSON.stringify({phase:'complete',requests:report.limits.actualRequests,plannerInvocations:0,tiers:report.tiers}));
}
