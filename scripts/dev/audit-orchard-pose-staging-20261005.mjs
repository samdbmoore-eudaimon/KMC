import fs from 'node:fs';
import crypto from 'node:crypto';
import {replayRun} from '../../expeditions/v2/index.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {orchardArtFor} from '../../expeditions/v2/art/renderer.js';

const root='assets/expeditions/production/9fo/v2/pose-staging-20261005';
const files=['docs/expeditions/v2/evidence/code-overnight-20261004/unequal-browser-win-record.json','docs/expeditions/v2/evidence/code-overnight-20261004/roost-browser-win-record.json','docs/expeditions/v2/evidence/code-overnight-20261004/bough-browser-win-record.json','docs/expeditions/v2/evidence/art-live-20261004/art-unequal-working-record-20261005.json'];
const rows=[];
files.push('docs/expeditions/v2/evidence/code-overnight-20261004/bough-t5-direct-reference-plan.json','docs/expeditions/v2/evidence/code-overnight-20261004/bough-t5-alcove-reference-plan.json');
for(const file of fs.readdirSync('docs/expeditions/v2/evidence/code-overnight-20261004'))if(/^bough-t[1-5]-(direct|alcove)-browser-win-record\.json$/.test(file))files.push(`docs/expeditions/v2/evidence/code-overnight-20261004/${file}`);
registerOrchardPuzzleHooks();
for(const file of files){
  const record=JSON.parse(fs.readFileSync(file)),seen=new Map(),verification=replayRun(record),positions=new Map();
  if(!verification.ok)throw Error(`Replay failed: ${file}`);
  for(let count=0;count<=record.commands.length;count++){
    const partial=replayRun({initialRun:record.initialRun,commands:record.commands.slice(0,count)});
    if(!partial.ok)throw Error(`Prefix failed: ${file} ${count}`);
    const state=partial.state;
    for(const hero of state.heroes){
      const art=orchardArtFor({...hero,id:hero.cardId,kind:'hero'},state);
      const key=`${hero.cardId}:${art?.pose}:${art?.fallback}`;
      const detail={cardId:hero.cardId,pose:art?.pose,available:!!art?.url,fallback:art?.fallback,firstCommand:count,holding:hero.holding,hp:hero.hp,ap:hero.ap,position:hero.position};
      if(!seen.has(key))seen.set(key,detail);
      if(positions.has(hero.cardId)&&positions.get(hero.cardId)!==hero.position&&!seen.has(`${hero.cardId}:moved`))seen.set(`${hero.cardId}:moved`,{...detail,reason:'actual move; resolver chooses idle unless AP reaches zero'});
      positions.set(hero.cardId,hero.position);
    }
    for(const enemy of state.enemyStates){
      const art=orchardArtFor({...enemy,kind:'enemy'},state),key=`${enemy.id}:${art?.pose}:${art?.fallback}`;
      if(!seen.has(key))seen.set(key,{enemyId:enemy.id,pose:art?.pose,available:!!art?.url,fallback:art?.fallback,firstCommand:count,hp:enemy.hp});
    }
  }
  rows.push({file,sourceScope:file.includes('reference-plan')?'reducer reference plan, not browser evidence':'actual browser record',sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),family:record.initialRun.blueprint.familyId,tier:record.initialRun.blueprint.tier,commands:record.commands.length,finalStatus:verification.state.status,states:[...seen.values()]});
}
const frozenPaths=['expeditions/v2/art/runtime-art.js','expeditions/v2/art/manifest.json','expeditions/v2/art/family-art.js','expeditions/v2/art/family-manifest.json','expeditions/v2/art/station-art.js','expeditions/v2/art/station-manifest.json','expeditions/v2/art/renderer.js','docs/expeditions/v2/art-delivery.json'];
const frozenHashes=Object.fromEntries(frozenPaths.map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')]));
fs.mkdirSync(root,{recursive:true});
if(fs.existsSync(`${root}/actual-pose-requirements.json`)){
  const baseline=JSON.parse(fs.readFileSync(`${root}/actual-pose-requirements.json`));
  for(const [p,h]of Object.entries(baseline.frozenHashes))if(frozenHashes[p]!==h)throw Error(`Frozen art input changed: ${p}`);
}
fs.writeFileSync(`${root}/actual-pose-requirements.json`,JSON.stringify({scope:'Read-only replay; browser and reference-plan evidence labelled separately; no save import, certification or state injection',createdAt:new Date().toISOString(),rows,frozenHashes},null,2)+'\n');
console.log(JSON.stringify(rows.map(r=>({family:r.family,tier:r.tier,commands:r.commands,fallbacks:r.states.filter(s=>s.fallback),held:r.states.filter(s=>s.holding)}))));
