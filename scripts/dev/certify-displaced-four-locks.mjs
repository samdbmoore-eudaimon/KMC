import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {assembleDisplacedFourLocks} from '../../expeditions/v2/generation/displaced-four-locks.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {planOrchardBlueprint} from './orchard-v2-tactical-planner.mjs';
import {certifyCandidate} from './orchard-v2-certification.mjs';
import {hashValue} from '../../expeditions/v2/index.js';
const sample=JSON.parse(fs.readFileSync(new URL('../../docs/expeditions/v2/fixtures/four-locks-displaced-topology.json',import.meta.url),'utf8'));
const root=fileURLToPath(new URL('../../docs/expeditions/v2/certification/four-locks/displaced-v1/',import.meta.url));
const directories=['river','islands','hedges','terraces'].map(layoutId=>({layoutId,out:path.join(root,`tier-1-${layoutId}-seed-0`)}));
if(directories.some(d=>fs.existsSync(path.join(d.out,'result.json')))||fs.existsSync(path.join(root,'summary.json')))throw Error('Displaced evidence already exists; do not overwrite this stopped batch');
registerOrchardPuzzleHooks();const summaries=[];
for(const {layoutId,out}of directories){
  const source=sample.records.find(r=>r.layoutId===layoutId&&r.seed===0),candidate=assembleDisplacedFourLocks(source.topology),traces=[],attempts=[];
  if(candidate.status==='success'){
    for(const [cardIds,planFamily]of [[['tuppence','wicker','pip'],'direct-guard'],[['bushel','dapple','pip'],'alcove-intercept']]){
      const avoidOutputChoices=planFamily==='direct-guard'?[['bridge','shelter']]:traces.length?[traces[0].outputChoice]:[];
      const result=planOrchardBlueprint({blueprint:candidate.blueprint,teamChoices:[{cardIds}],planFamily,maxStates:8000,avoidOutputChoices});
      attempts.push({cardIds,planFamily,avoidOutputChoices,requestedMaxStates:8000,status:result.status,reasonCode:result.reasonCode,metrics:result.metrics,reportedStateOverage:Math.max(0,result.metrics.statesSpent-8000),accountingNote:'Known Claude-owned R-07: denied spends inflate statesSpent; reported overage is not an accepted reducer-call count.'});traces.push(...result.traces);
      console.log(JSON.stringify({layoutId,cardIds,planFamily,status:result.status,reasonCode:result.reasonCode,states:result.metrics.statesSpent}));
    }
  }
  const certification=certifyCandidate(candidate,traces),result={packetId:'four-locks-displaced-v1',generatorVersion:2,sourceTopologyHash:hashValue(source.topology),candidateHash:hashValue(candidate),requestedLimits:{candidatesPerArchetype:1,seed:0,maxPlannerInvocations:2,maxStatesPerInvocation:8000},attempts,certification};
  fs.mkdirSync(out,{recursive:true});for(const [name,value]of [['candidate',candidate],['traces',traces],['result',result]])fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
  summaries.push({layoutId,seed:0,candidateStatus:candidate.status,status:certification.status,certificateId:certification.certificateId,errors:certification.errors,traceCount:traces.length,evidence:path.basename(out)});
}
fs.writeFileSync(path.join(root,'summary.json'),JSON.stringify({packetId:'four-locks-displaced-v1',generatorVersion:2,limits:{candidates:4,maxPlannerInvocationsPerCandidate:2,maxStatesPerInvocation:8000},summaries,limitations:['Separate offline packet; not default generatorVersion1, runtime entry or completed bank.','All traces are checked with the production reducer. Unknown does not establish impossibility.','Private App/QA-01, device/child testing and R-07 remain pending.']},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({summaries}));
