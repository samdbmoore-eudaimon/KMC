import fs from 'node:fs';
import assert from 'node:assert/strict';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {replayRun,hashValue} from '../../expeditions/v2/run.js';
import {generateTurningRavineCandidate} from '../../expeditions/v2/generation/turning-ravine.js';
registerOrchardPuzzleHooks();
const dir='docs/expeditions/v2/evidence/turning-ravine-20261003';
const read=name=>JSON.parse(fs.readFileSync(`${dir}/${name}`,'utf8'));
const candidate=read('t1-reference-candidate.json'),proof=read('t1-reference-proof.json');
assert.deepEqual(candidate,generateTurningRavineCandidate({seed:1,layoutId:'hedges'}));
assert.equal(proof.contentHash,hashValue(candidate.blueprint));assert.equal(proof.runtimeAvailable,false);
const results=[];
for(const name of ['common-direct','common-alternate','higher-band-alcove','ui']){
  const trace=read(name==='ui'?'ui-winning-trace.json':`${name}-winning-trace.json`),replay=replayRun(trace,{recordHashes:true});
  assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');assert.ok(replay.state.round<=5);
  if(name!=='ui')assert.deepEqual(replay.hashes,trace.perCommandHashes);
  else assert.equal(replay.finalHash,trace.finalStateHash);
  results.push({name,commands:trace.commands.length,round:replay.state.round,finalHash:replay.finalHash,perCommandHashes:replay.hashes,hashEvidence:name==='ui'?'derived replay hashes; exported final hash matches':'all retained per-command hashes match'});
}
const edited=replayRun(read('ui-shared-wheel-trace.json'));
assert.equal(edited.ok,true);assert.ok(edited.state.heroes.every(hero=>hero.ap===2));assert.ok(Object.values(edited.state.activeOutputs).every(on=>!on));
const progress=read('ui-win-progress.json');assert.equal(progress.stars,3);
const summary={status:'verified-reference-only',familyId:'turning-ravine',tier:1,contentHash:proof.contentHash,results,uiFreeEditApPreserved:true,uiFirstClearStars:progress.stars,runtimeAvailable:false,visualAccepted:false,deviceAccepted:false,comprehensionAccepted:false};
fs.writeFileSync(`${dir}/independent-evidence-verification.json`,JSON.stringify(summary,null,2));
console.log(JSON.stringify({...summary,results:results.map(({perCommandHashes,...result})=>result)},null,2));
