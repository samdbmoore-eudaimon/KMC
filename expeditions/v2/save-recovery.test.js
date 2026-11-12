import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {registerOrchardPuzzleHooks} from './puzzles/index.js';
import {recoverLegacyBridgeRecord} from './save-recovery.js';
import {blueprintHash,exportRunRecord,replayRun,stateHash} from './run.js';
import {loadActiveRun,saveActiveRun,orchardV2Bucket,applyOrchardV2Result,beginOrchardRun} from './persistence.js';
import {previewCommand} from './actions.js';
import {crossingExitViolations} from './generation/crossing-invariants.js';
registerOrchardPuzzleHooks();
const source=JSON.parse(fs.readFileSync(new URL('../../docs/expeditions/v2/evidence/playthrough-recovery-20261003/sam-playthrough-trace.json',import.meta.url)));
test('known defective saved map repairs only two hedges, retires old certification and preserves all retained actions and gameplay state',()=>{
  const before=JSON.stringify(source),old=replayRun(source),fixed=recoverLegacyBridgeRecord(source);assert.equal(fixed.ok,true);assert.equal(JSON.stringify(source),before);assert.equal(stateHash(fixed.state),stateHash(old.state));assert.deepEqual(fixed.record.commands,source.commands);assert.notEqual(blueprintHash(fixed.state.blueprint),blueprintHash(old.state.blueprint));
  assert.equal(fixed.state.blueprint.certificateId,null);assert.equal(fixed.state.blueprint.certifiedContentHash,null);assert.equal(crossingExitViolations(fixed.state.blueprint).length,0);
  assert.deepEqual(fixed.state.blueprint.tiles.filter((t,i)=>JSON.stringify(t)!==JSON.stringify(old.state.blueprint.tiles[i])).map(t=>`${t.q},${t.r}`),['4,2','4,6']);
  assert.equal(previewCommand(fixed.state,{type:'move',heroId:'sorrel',expectedRevision:fixed.state.revision,payload:{destination:'4,6',path:null}}).legal,true);assert.equal(previewCommand(fixed.state,{type:'move',heroId:'tuppence',expectedRevision:fixed.state.revision,payload:{destination:'4,4',path:null}}).legal,false);
});
test('resume migration archives the exact original save once and leaves collection, rewards and legacy progress intact',()=>{
  const progress={stars:19,packs:2,cards:Object.fromEntries(source.initialRun.cardIds.map(id=>[id,1])),expeditions:{scenarios:{legacy:{complete:true}},moduleSetRewarded:true}};
  const saved=saveActiveRun(progress,replayRun(source).state),original=orchardV2Bucket(saved).activeRun;
  const loaded=loadActiveRun(saved);assert.equal(loaded.ok,true);assert.ok(loaded.recovery);assert.deepEqual(orchardV2Bucket(saved).activeRun,original,'load is pure until the UI effect persists');
  const migrated=saveActiveRun(saved,loaded.state);assert.deepEqual(Object.values(orchardV2Bucket(migrated).runMigrations)[0].source,original);assert.deepEqual(migrated.cards,progress.cards);assert.equal(migrated.stars,19);assert.equal(migrated.packs,2);assert.deepEqual(migrated.expeditions.scenarios,progress.expeditions.scenarios);assert.equal(migrated.expeditions.moduleSetRewarded,true);
  const again=loadActiveRun(migrated);assert.equal(again.recovery,undefined);assert.deepEqual(saveActiveRun(migrated,again.state),migrated);assert.equal(Object.keys(orchardV2Bucket(migrated).runMigrations).length,1);
});
test('invalid original log is retained and never silently migrated',()=>{
  const invalid=structuredClone(source);invalid.commands[0].payload.destination='100,100';const before=JSON.stringify(invalid),result=recoverLegacyBridgeRecord(invalid);assert.equal(result.ok,false);assert.equal(result.reason,'recovery-original-replay');assert.equal(JSON.stringify(invalid),before);
});
test('saved-map winning continuation extends all original actions through unchanged rules and awards exactly once',()=>{
  const proof=JSON.parse(fs.readFileSync(new URL('../../docs/expeditions/v2/evidence/autonomous-recovery-20261003/sam-winning-continuation.json',import.meta.url))),win=replayRun(proof);assert.equal(win.ok,true);assert.equal(win.state.status,'won');assert.ok(win.state.round<=5);assert.deepEqual(proof.commands.slice(0,source.commands.length),source.commands);
  const fixed=recoverLegacyBridgeRecord(source);let progress=saveActiveRun({stars:19,packs:2,cards:Object.fromEntries(source.initialRun.cardIds.map(id=>[id,1]))},replayRun(source).state);progress=saveActiveRun(progress,fixed.state);progress=saveActiveRun(progress,win.state);const awarded=applyOrchardV2Result(progress,{record:exportRunRecord(win.state)});assert.equal(awarded.stars,2);assert.equal(awarded.packs,3);assert.equal(orchardV2Bucket(awarded).activeRun,null);assert.equal(Object.keys(orchardV2Bucket(awarded).runMigrations).length,1);assert.equal(applyOrchardV2Result(awarded,{record:exportRunRecord(win.state)}),awarded);
});

test('retry after a completed run retains the exact repaired map and awards no repeat stars',()=>{
  const proof=JSON.parse(fs.readFileSync(new URL('../../docs/expeditions/v2/evidence/autonomous-recovery-20261003/sam-winning-continuation.json',import.meta.url)));
  const winner=replayRun(proof).state;
  const progress=applyOrchardV2Result(saveActiveRun({stars:0,packs:0,cards:Object.fromEntries(source.initialRun.cardIds.map(id=>[id,1]))},winner),{record:exportRunRecord(winner)});
  const retry=beginOrchardRun(progress,{familyId:'four-locks',tier:1,cardIds:source.initialRun.cardIds,deploymentAssignment:proof.initialRun.deploymentAssignment,mode:'retry',generateBlueprint:()=>{throw Error('retry must retain its map');}});
  assert.equal(retry.ok,true);assert.deepEqual(retry.state.blueprint,proof.initialRun.blueprint);assert.notEqual(retry.state.runId,proof.initialRun.runId);assert.equal(exportRunRecord(retry.state).commands.length,0);
  const retried=replayRun({...exportRunRecord(retry.state),commands:proof.commands,finalStateHash:null});assert.equal(retried.ok,true);assert.equal(retried.state.status,'won');
  const saved=retry.update(progress),awarded=applyOrchardV2Result(saved,{record:exportRunRecord(retried.state)});assert.equal(awarded.stars,3);assert.equal(awarded.packs,0);assert.equal(orchardV2Bucket(awarded).activeRun,null);assert.equal(Object.keys(orchardV2Bucket(awarded).tierAwards).length,1);
});

test('Back from a completed expedition cannot restore its cleared active save',async()=>{
  const {bundle,dom,click,ROOKE}=await import('./route-harness.js');const mod=await bundle(),page=dom(),root=page.window.document.getElementById('root');
  const proof=JSON.parse(fs.readFileSync(new URL('../../docs/expeditions/v2/evidence/autonomous-recovery-20261003/sam-winning-continuation.json',import.meta.url)));
  const ready=replayRun({...proof,commands:proof.commands.slice(0,-1),finalStateHash:null}).state;
  let saved=saveActiveRun({stars:0,packs:0,cards:Object.fromEntries(source.initialRun.cardIds.map(id=>[id,1]))},ready),exited=false;
  const handle=mod.mount(root,{profile:ROOKE,progress:saved,onProgress:next=>{saved=next;},onExit:()=>{exited=true;}});
  const find=text=>[...root.querySelectorAll('button')].find(button=>button.textContent===text||button.getAttribute('aria-label')===text);
  await click(handle,find('End round'));await click(handle,find('Confirm end round'));
  assert.match(root.textContent,/The orchard is safe/);assert.equal(orchardV2Bucket(saved).activeRun,null);assert.equal(saved.stars,3);
  await click(handle,[...root.querySelectorAll('button')].find(button=>button.textContent==='Back'));assert.equal(exited,true);assert.equal(orchardV2Bucket(saved).activeRun,null);assert.equal(saved.stars,3);handle.unmount();
});

