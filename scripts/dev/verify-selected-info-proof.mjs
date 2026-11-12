import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {replayRun,stateHash} from '../../expeditions/v2/run.js';
const folder=new URL('../../docs/expeditions/v2/evidence/code-overnight-20261004/',import.meta.url),read=name=>JSON.parse(fs.readFileSync(new URL(name,folder),'utf8'));
registerOrchardPuzzleHooks();
const entries=read('selected-info-states.json'),measurements=read('selected-info-stable-measurements.json'),baselines=new Map(),checks=[];
const captures=[];
for(const device of ['phone','tablet','desktop'])for(const state of ['held','exhausted'])for(const zoom of ['minimum','native','maximum'])captures.push(`selected-info-stable-${device}-${state}-${zoom}`);
for(const zoom of ['minimum','native','maximum'])captures.push(`selected-info-stable-phone-guide-${zoom}`);
for(const device of ['phone','tablet','desktop'])for(const stage of ['unselected-cobweb','pan','resize-before','resize-move','resize-preview','resize-cancel','refocus'])captures.push(`selected-info-stable-${device}-${stage}`);
assert.equal(measurements.length,captures.length);
measurements.forEach((m,i)=>{m.caseId=captures[i];assert.ok(fs.existsSync(new URL(m.caseId+'.png',folder)));const device=m.caseId.split('-')[3];assert.deepEqual(m.viewport,device==='phone'?[390,844]:device==='tablet'?[768,1024]:[1280,800]);});
for(const m of measurements){
  const record=JSON.parse(m.trace),entry=entries.find(e=>e.prefix===record.commands.length);assert.ok(entry);
  assert.deepEqual(record.initialRun,entry.record.initialRun);assert.deepEqual(record.commands,entry.record.commands.slice(0,entry.prefix));
  const replay=replayRun(record);assert.equal(replay.ok,true);assert.equal(stateHash(replay.state),record.finalStateHash);
  const before=baselines.get(entry.id)||m;baselines.set(entry.id,before);assert.equal(m.trace,before.trace);assert.equal(m.progress,before.progress);
  const hero=replay.state.heroes.find(h=>h.id===m.selected);assert.ok(hero);const name=replay.state.profiles[hero.id].name;
  assert.ok(m.label.startsWith(`${name}: ${hero.hp} health, ${hero.ap} AP; `));
  if(hero.holding)assert.ok(m.label.includes(`Holding ${replay.state.blueprint.stations.find(s=>s.id===hero.holding).name}`));
  assert.equal(m.labelCount,1);assert.equal(m.actualHudOverlap,0);assert.equal(Number(m.reportedFigureOverlap),0);assert.equal(Number(m.reportedControlOverlap),0);
  assert.ok(m.rect.x>=m.map.x&&m.rect.y>=m.map.y&&m.rect.x+m.rect.width<=m.map.x+m.map.width+1&&m.rect.y+m.rect.height<=m.map.y+m.map.height+1);
  for(const h of replay.state.heroes){const actual=m.entities.find(e=>e.id===h.id),[q,r]=h.position.split(',').map(Number);assert.ok(actual);assert.ok(Math.abs(Number(actual.cx)-Math.sqrt(3)*40*(q+r/2))<1e-8);assert.equal(Number(actual.cy),60*r+8);}
  checks.push({caseId:m.caseId,label:m.label,commands:record.commands.length,stateHash:record.finalStateHash,hero:hero.id,hp:hero.hp,ap:hero.ap,holding:hero.holding,unchanged:true});
}
const centre=m=>{const values=m.transform.match(/translate\(([-\d.e]+) ([-\d.e]+)\) scale\(([-\d.e]+)\)/).slice(1).map(Number);return {x:(Math.round(m.map.width)/2-values[0])/values[2],y:(Math.round(m.map.height)/2-values[1])/values[2]};};
for(const device of ['phone','tablet','desktop']){
  const before=measurements.find(m=>m.caseId===`selected-info-stable-${device}-resize-before`),point=centre(before);
  for(const stage of ['move','preview','cancel']){const m=measurements.find(m=>m.caseId===`selected-info-stable-${device}-resize-${stage}`),after=centre(m);assert.equal(m.scale,before.scale);assert.ok(Math.abs(after.x-point.x)<1e-8&&Math.abs(after.y-point.y)<1e-8);}
}
const sourceFiles=['expeditions/v2/ui/MapViewport.jsx','expeditions/v2/ui/SelectedHeroInfo.jsx','expeditions/v2/ui/selected-info.js','expeditions/v2/ui/selected-info.test.js','expeditions/v2/ui/viewport.js','expeditions/v2/ui/ui.test.js','docs/expeditions/v2/evidence/code-overnight-20261004/selected-info-ui-preview.html'];
const hashes=Object.fromEntries(sourceFiles.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(new URL('../../'+file,import.meta.url))).digest('hex')]));
const result={status:'pass',measurements:measurements.length,checks,hashes,limits:'Saved-state UI replay only; no new playthrough, certification, rewards, physical touch or final shared App acceptance.'};
fs.writeFileSync(new URL('selected-info-stable-measurements.json',folder),JSON.stringify(measurements,null,2));fs.writeFileSync(new URL('selected-info-stable-checkpoint.json',folder),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,measurements:result.measurements,hashes},null,2));
