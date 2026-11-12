import fs from 'node:fs';
import os from 'node:os';
import {performance} from 'node:perf_hooks';
import {generateOrchardBlueprint} from '../../expeditions/v2/generation/index.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {createRun,previewCommand,reduceCommand,stateHash} from '../../expeditions/v2/index.js';

registerOrchardPuzzleHooks();
const traces=JSON.parse(fs.readFileSync(new URL('../../docs/expeditions/v2/certification/four-locks/tier-1-river-seed-1/traces.json',import.meta.url)));
const measurements={reconstruction:[],preview:[],reducer:[]},counts={};
const memoryBefore=process.memoryUsage();
for(let seed=0;seed<100;seed++){
  const started=performance.now();const blueprint=generateOrchardBlueprint({familyId:'four-locks',tier:1,seed});
  measurements.reconstruction.push(performance.now()-started);
  if(blueprint.certificateId!=='orchard-v2-7bb0c308bb8ec44f')throw Error('Certified entry changed');
}
for(let cycle=0;measurements.reducer.length<100;cycle++){
  const trace=traces[cycle%traces.length],initial=trace.initialRun;
  let state=createRun({blueprint:initial.blueprint,cardIds:initial.cardIds,runId:initial.runId,deploymentAssignment:initial.deploymentAssignment});
  for(const command of trace.commands){
    const before=stateHash(state),previewStart=performance.now(),preview=previewCommand(state,command);
    measurements.preview.push(performance.now()-previewStart);
    if(!preview.legal||stateHash(state)!==before)throw Error('Preview rejected or mutated state');
    const reducerStart=performance.now(),outcome=reduceCommand(state,command);
    measurements.reducer.push(performance.now()-reducerStart);
    if(!outcome.result.legal)throw Error('Certified command rejected');
    state=outcome.state;counts[command.type]=(counts[command.type]||0)+1;
  }
  if(state.status!=='won'||stateHash(state)!==trace.finalStateHash)throw Error('Trace no longer wins at its certified hash');
}
function summary(values){const sorted=values.toSorted((a,b)=>a-b),at=p=>sorted[Math.ceil(sorted.length*p)-1];return {samples:sorted.length,medianMs:at(.5),p95Ms:at(.95),maxMs:sorted.at(-1)};}
const measured=Object.fromEntries(Object.entries(measurements).map(([key,values])=>[key,summary(values)]));
const evidence={schemaVersion:1,measuredAt:new Date().toISOString(),host:{platform:process.platform,arch:process.arch,node:process.version,cpu:os.cpus()[0]?.model},certificateId:'orchard-v2-7bb0c308bb8ec44f',measurements:measured,commandCounts:counts,memoryBefore,memoryAfter:process.memoryUsage(),desktopBudgetChecks:{reconstruction:measured.reconstruction.p95Ms<=100,preview:measured.preview.p95Ms<=16,reducer:measured.reducer.p95Ms<=16},limitations:['Local desktop process only; supported tablet performance remains unmeasured.','No real browser rendering, drag/zoom, save/reward or whole-bundle performance measurement.','Command sample includes complete certified direct and alcove routes; no warm-up samples are discarded.','Heap and RSS snapshots include retained modules and are not a bounded-memory proof.']};
const destination=new URL('../../docs/expeditions/v2/performance/four-locks-reference.json',import.meta.url);
fs.mkdirSync(new URL('.',destination),{recursive:true});fs.writeFileSync(destination,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({measurements:measured,desktopBudgetChecks:evidence.desktopBudgetChecks,commandCounts:counts},null,2));
