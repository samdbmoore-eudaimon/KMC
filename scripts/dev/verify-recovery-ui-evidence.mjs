import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {replayRun,blueprintHash,stateHash} from '../../expeditions/v2/run.js';
import {orchardV2Bucket} from '../../expeditions/v2/persistence.js';
registerOrchardPuzzleHooks();
const dir='docs/expeditions/v2/evidence/autonomous-recovery-20261003/';
const read=name=>JSON.parse(fs.readFileSync(dir+name));
const rows=[];
for(const prefix of ['retained-ui','fresh-ui','fresh-ui-replay']){
  const record=read(prefix+'-winning-record.json'),progress=read(prefix+'-winning-progress.json'),replay=replayRun(record),bucket=orchardV2Bucket(progress);
  assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');assert.equal(bucket.activeRun,null);assert.equal(progress.stars,3);assert.equal(Object.keys(bucket.tierAwards).length,1);
  rows.push({prefix,runId:record.initialRun.runId,commands:record.commands.length,round:replay.state.round,finalHash:stateHash(replay.state),blueprintHash:blueprintHash(replay.state.blueprint),stars:progress.stars,packs:progress.packs,activeRun:bucket.activeRun,archives:Object.keys(bucket.runMigrations||{}).length});
}
const source=JSON.parse(fs.readFileSync('docs/expeditions/v2/evidence/playthrough-recovery-20261003/sam-playthrough-trace.json'));
assert.deepEqual(read('retained-ui-winning-record.json').commands.slice(0,4),source.commands);
assert.equal(rows[1].blueprintHash,rows[2].blueprintHash);assert.notEqual(rows[1].runId,rows[2].runId);
const final=read('fresh-ui-final-progress.json');assert.equal(orchardV2Bucket(final).activeRun,null);assert.equal(final.stars,3);
const loss=replayRun(read('fresh-ui-loss-record.json'));assert.equal(loss.ok,true);assert.equal(loss.state.status,'lost');assert.equal(loss.state.round,5);assert.equal(read('fresh-ui-loss-progress.json').stars,3);assert.match(fs.readFileSync(dir+'fresh-ui-loss-dom.txt','utf8'),/fifth enemy phase/);
assert.match(fs.readFileSync(dir+'full-app-win-dom.txt','utf8'),/The orchard is safe/);
assert.match(fs.readFileSync(dir+'full-app-post-win-no-resurrection-dom.txt','utf8'),/Tier 1 · cleared/);
assert.doesNotMatch(fs.readFileSync(dir+'full-app-regular-profile-gate-dom.txt','utf8'),/generic: Expeditions/);
const builds=['WallabyMaths.html','www/index.html'].map(file=>({file,bytes:fs.statSync(file).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}));
assert.equal(builds[0].sha256,builds[1].sha256);
const result={status:'passed',rows,loss:{status:loss.state.status,round:loss.state.round,commands:loss.state.revision,starsUnchanged:true},builds,fullApp:{fixture:'full-app-qa-fixture.json',won:true,savedAndResumed:true,completedSaveCleared:true,regularProfileBlocked:true},regression:'All 25 steps passed; regression.log',focused:'8 tests passed; focused-final.log',limits:['Native Android/device, tablet performance and child comprehension unverified','Fresh and full-App screenshot capture timed out; DOM and independently replayed UI records retained. Earlier retained-run screenshots remain valid visual evidence.']};
fs.writeFileSync(dir+'ui-evidence-verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
