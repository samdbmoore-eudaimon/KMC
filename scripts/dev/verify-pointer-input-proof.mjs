import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {replayRun,stateHash} from '../../expeditions/v2/run.js';
const folder=new URL('../../docs/expeditions/v2/evidence/code-overnight-20261004/',import.meta.url),cases=['pointer-t1-phone','pointer-t1-tablet','pointer-t1-desktop','pointer-ravine-phone','pointer-ravine-tablet','pointer-ravine-desktop'];
registerOrchardPuzzleHooks();
const results=[];
for(const id of cases){
  const files=fs.readdirSync(folder).filter(f=>f.startsWith(id+'-')&&f.endsWith('.json')),stages=files.map(f=>JSON.parse(fs.readFileSync(new URL(f,folder),'utf8'))),zero=stages.find(s=>s.stage==='zero'),hero=stages.find(s=>s.stage==='hero-click'),move=stages.find(s=>s.stage==='move-click'),final=stages.find(s=>s.stage==='clear-confirm-click');
  assert.ok(zero&&hero&&move&&final);const initial=JSON.parse(zero.trace);assert.equal(initial.commands.length,0);assert.equal(move.movement,true);
  for(const s of stages){const record=JSON.parse(s.trace);assert.deepEqual(record.initialRun,initial.initialRun);const replay=replayRun(record);assert.equal(replay.ok,true);assert.equal(stateHash(replay.state),record.finalStateHash);assert.equal(replay.state.status,'playing');
    if(s.stage!=='clear-confirm-click'){assert.equal(s.trace,zero.trace);assert.equal(s.progress,zero.progress);}else assert.equal(record.commands.length,1);
    if(s.stage.startsWith('clear-move'))assert.equal(s.movement,true);
    if(s.stage.startsWith('clear-destination'))assert.equal(s.hasConfirm,true);
    if(s.stage.startsWith('clear-cancel'))assert.equal(s.movement,false);
  }
  const expected=id.includes('-t1-')?'Select Bushel':'Select Barrow',phone=id.endsWith('-phone');assert.equal(hero.selected===expected,!phone);
  const misses=JSON.parse(hero.events).filter(e=>e.type==='pointerdown'&&e.phase==='capture');assert.ok(misses.length);assert.equal(misses[0].trusted,true);assert.equal(misses[0].pointerType,'mouse');
  if(phone){assert.equal(misses[0].targetTag,'ASIDE');assert.equal(misses[0].targetName,null);}else assert.equal(misses[0].targetName,expected);
  const record=JSON.parse(final.trace),replay=replayRun(record),command=record.commands[0];assert.equal(command.type,'move');assert.equal(command.expectedRevision,0);assert.equal(replay.state.heroes.find(h=>h.id===command.heroId).ap,1);assert.equal(replay.state.heroes.find(h=>h.id===command.heroId).position,command.payload.destination);
  assert.ok(replay.state.heroes.filter(h=>h.id!==command.heroId).every(h=>h.ap===2));const p=JSON.parse(final.progress);assert.equal(p.stars,0);assert.equal(p.packs,0);assert.deepEqual(p.expeditions.v2.tierAwards,{});
  const events=JSON.parse(final.events),moveClicks=events.filter(e=>e.type==='click'&&e.phase==='capture'&&e.targetName==='Move');assert.ok(moveClicks.length>=3);
  for(const click of moveClicks){const settled=events.find(e=>e.seq>click.seq&&e.type==='click'&&e.phase==='settled'&&e.targetName==='Move');assert.ok(settled?.movementVisible);}
  results.push({caseId:id,stages:stages.length,initialSelectionMiss:phone,missPointer:phone?misses[0]:null,initialMoveOpened:true,movePointerClicks:moveClicks.length,finalCommands:1,hero:command.heroId,destination:command.payload.destination,finalAP:1,finalStateHash:record.finalStateHash,rewards:0,allPreconfirmationTraceAndProgressUnchanged:true});
}
const stable=JSON.parse(fs.readFileSync(new URL('selected-info-stable-checkpoint.json',folder),'utf8')).hashes,production=Object.fromEntries(Object.entries(stable).filter(([file])=>file.startsWith('expeditions/')).map(([file,expected])=>{const actual=crypto.createHash('sha256').update(fs.readFileSync(new URL('../../'+file,import.meta.url))).digest('hex');assert.equal(actual,expected);return [file,actual];}));
const compactResults=[];
for(const id of ['pointer-compact-t1-phone','pointer-compact-ravine-phone']){
  const stages=['zero','hero-click','move-click'].map(stage=>JSON.parse(fs.readFileSync(new URL(id+'-'+stage+'.json',folder),'utf8'))),[zero,hero,move]=stages;
  for(const s of stages){assert.equal(s.trace,zero.trace);assert.equal(s.progress,zero.progress);assert.equal(JSON.parse(s.trace).commands.length,0);const replay=replayRun(JSON.parse(s.trace));assert.equal(replay.ok,true);assert.equal(stateHash(replay.state),JSON.parse(s.trace).finalStateHash);}
  const t1=id.includes('-t1-'),event=JSON.parse(hero.events).find(e=>e.type==='pointerdown'&&e.phase==='capture');
  assert.equal(event.trusted,true);assert.equal(event.pointerType,'mouse');if(t1)assert.equal(event.targetTag,'ASIDE');assert.equal(event.targetName,t1?null:'Select Barrow');assert.equal(hero.selected,t1?'Select Furrow':'Select Barrow');assert.equal(move.movement,true);
  compactResults.push({caseId:id,stages:3,heroClickIntercepted:t1,event,initialMoveOpened:true,commands:0,traceAndProgressUnchanged:true});
}
const result={status:'pass',results,compactResults,productionSourcesUnchanged:production,limits:'Mouse pointer events at emulated viewport dimensions. QA header height affects available layout space: compact control is 28px rather than original 83px. No physical touch/pinch/device, integrated App, new browser win, certified bank or complete Orchard acceptance claim.'};
fs.writeFileSync(new URL('pointer-input-checkpoint-20261005.json',folder),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,cases:results.length,stages:results.reduce((n,r)=>n+r.stages,0),moveClicks:results.reduce((n,r)=>n+r.movePointerClicks,0),results},null,2));
