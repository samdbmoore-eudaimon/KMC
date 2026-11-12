import fs from 'node:fs';
import {generateTurningRavineCandidate} from '../../expeditions/v2/generation/turning-ravine.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {planOrchardBlueprint} from './orchard-v2-tactical-planner.mjs';
import {replayRun,hashValue} from '../../expeditions/v2/run.js';
registerOrchardPuzzleHooks();
const dir='docs/expeditions/v2/evidence/turning-ravine-20261003';fs.mkdirSync(dir,{recursive:true});
const candidate=generateTurningRavineCandidate({seed:1,tier:1,layoutId:'hedges'});if(candidate.status!=='success')throw Error(JSON.stringify(candidate));
fs.writeFileSync(`${dir}/t1-reference-candidate.json`,JSON.stringify(candidate,null,2));
const results=[],traces=[];
for(const [name,cardIds,planFamily] of [['common-direct',['tuppence','furrow','sorrel'],'direct-guard'],['common-alternate',['bushel','wicker','pip'],'direct-guard'],['higher-band-alcove',['tuppence','dapple','sorrel'],'alcove-intercept']]){
  const plan=planOrchardBlueprint({blueprint:candidate.blueprint,teamChoices:[{cardIds}],planFamily,maxStates:80000,beamWidth:40,avoidOutputChoices:name==='common-alternate'&&traces.length?[traces[0].outputChoice]:[]});
  results.push({name,cardIds,status:plan.status,reasonCode:plan.reasonCode,metrics:plan.metrics});
  if(plan.status==='success'){const trace=plan.traces[0],replay=replayRun(trace,{recordHashes:true});if(!replay.ok||replay.state.status!=='won'||JSON.stringify(replay.hashes)!==JSON.stringify(trace.perCommandHashes))throw Error('Reference replay mismatch');traces.push({...trace,name});fs.writeFileSync(`${dir}/${name}-winning-trace.json`,JSON.stringify(trace,null,2));}
  console.log(JSON.stringify(results.at(-1)));
}
const certificate={status:traces.length===3?'reference-proved':'unknown',familyId:'turning-ravine',tier:1,parameterSeed:1,layoutId:'hedges',contentHash:hashValue(candidate.blueprint),mathematics:candidate.mathematicalEvidence,topology:candidate.topologyEvidence,results,traceCount:traces.length,runtimeAvailable:false};
fs.writeFileSync(`${dir}/t1-reference-proof.json`,JSON.stringify(certificate,null,2));if(certificate.status!=='reference-proved')process.exitCode=1;

