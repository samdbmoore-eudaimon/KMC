import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {replayRun,stateHash} from '../../expeditions/v2/run.js';
registerOrchardPuzzleHooks();
const folder=new URL('../../docs/expeditions/v2/evidence/code-overnight-20261004/',import.meta.url),results=[];
for(const family of ['t1','ravine'])for(const size of ['phone','tablet','desktop']){
  const id='guide-stable-'+family+'-'+size,read=stage=>JSON.parse(fs.readFileSync(new URL(id+'-'+stage+'.json',folder),'utf8')),zero=read('zero'),selected=read('hero-click'),final=read('confirmed'),before=JSON.parse(fs.readFileSync(new URL('guide-zero-'+family+'-'+size+'-zero.json',folder),'utf8')),hero=family==='t1'?'Bushel':'Barrow';
  assert.ok(before.guide.bottom>before.map.bottom);assert.equal(zero.root.top,0);assert.equal(zero.root.height,zero.viewport[1]);assert.equal(zero.guide.bottom,zero.map.bottom-12);assert.ok(zero.guide.bottom<zero.party.top);assert.ok(zero.guideScroll.scroll>zero.guideScroll.client);assert.equal(selected.selected,'Select '+hero);
  const files=fs.readdirSync(folder).filter(f=>f.startsWith(id+'-')&&f.endsWith('.json')),stages=files.map(f=>JSON.parse(fs.readFileSync(new URL(f,folder),'utf8'))),initial=JSON.parse(zero.trace).initialRun;
  for(const s of stages){const record=JSON.parse(s.trace),replay=replayRun(record);assert.deepEqual(record.initialRun,initial);assert.equal(replay.ok,true);assert.equal(stateHash(replay.state),record.finalStateHash);assert.equal(replay.state.status,'playing');if(s.guide){assert.ok(s.guide.bottom<=s.map.bottom-11.9);assert.ok(s.guide.bottom<s.party.top);}if(record.commands.length===0){assert.equal(s.trace,zero.trace);assert.equal(s.progress,zero.progress);}else assert.equal(record.commands.length,1);}
  const record=JSON.parse(final.trace),state=replayRun(record).state,command=record.commands[0];assert.equal(record.commands.length,1);assert.equal(command.type,'move');assert.equal(command.expectedRevision,0);assert.equal(state.heroes.find(h=>h.id===command.heroId).ap,1);assert.ok(state.heroes.filter(h=>h.id!==command.heroId).every(h=>h.ap===2));const progress=JSON.parse(final.progress);assert.equal(progress.stars,0);assert.equal(progress.packs,0);assert.deepEqual(progress.expeditions.v2.tierAwards,{});
  const events=JSON.parse(final.events),select=JSON.parse(selected.events).find(e=>e.type==='pointerdown'&&e.phase==='capture');assert.equal(select.trusted,true);assert.equal(select.pointerType,'mouse');assert.equal(select.targetName,'Select '+hero);
  for(const name of ['Move','Cancel','Confirm'])assert.ok(events.some(e=>e.type==='click'&&e.phase==='capture'&&e.targetName===name&&e.trusted));
  const hide=stages.find(s=>s.stage==='hide-for-destination');assert.equal(!!hide,size==='phone');if(hide){assert.equal(hide.guide,null);assert.ok(JSON.parse(hide.events).some(e=>e.type==='click'&&e.phase==='capture'&&e.targetName==='Hide guide'));}
  results.push({id,stages:stages.length,beforeOverflow:before.guide.bottom-before.map.bottom,root:zero.root,map:zero.map,guide:zero.guide,party:zero.party,scroll:zero.guideScroll,heroPointer:select,phoneGuideHiddenForDestination:!!hide,commands:1,AP:1,rewards:0,finalStateHash:record.finalStateHash});
}
const unchanged=JSON.parse(fs.readFileSync(new URL('selected-info-stable-checkpoint.json',folder),'utf8')).hashes;
for(const [file,hash] of Object.entries(unchanged).filter(([file])=>file.startsWith('expeditions/')))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../../'+file,import.meta.url))).digest('hex'),hash);
const hashes=Object.fromEntries(['expeditions/v2/ui/recovery.css.js','expeditions/v2/ui/chrome.test.js','expeditions/v2/ui/Guide.jsx','docs/expeditions/v2/evidence/code-overnight-20261004/guide-containment-preview.html'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(new URL('../../'+file,import.meta.url))).digest('hex')]));
const result={status:'pass',results,hashes,previousStableProductionSourcesUnchanged:unchanged,limits:'Full-height real production route in a private QA host. Mouse pointer at emulated viewport sizes, not integrated App or physical touch/device. Phone destination flows use Hide guide normally.'};
fs.writeFileSync(new URL('guide-containment-stable-checkpoint-20261005.json',folder),JSON.stringify(result,null,2));console.log(JSON.stringify({status:'pass',cases:results.length,stages:results.reduce((n,r)=>n+r.stages,0),hashes},null,2));
