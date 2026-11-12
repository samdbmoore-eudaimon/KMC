import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {generateFourLocksCandidate} from '../../expeditions/v2/generation/four-locks.js';
import {generateTurningRavineCandidate} from '../../expeditions/v2/generation/turning-ravine.js';
import {generateUnequalCrossingCandidate} from '../../expeditions/v2/generation/unequal-crossing.js';
import {generateMaybeFlockCandidate} from '../../expeditions/v2/generation/maybe-flock.js';
import {generateHollowBoughCandidate} from '../../expeditions/v2/generation/hollow-bough.js';
import {orchardArtFor} from '../../expeditions/v2/art/renderer.js';
const root='docs/expeditions/v2/evidence/art-live-20261004',rows=[],sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const generators={'four-locks':generateFourLocksCandidate,'turning-ravine':generateTurningRavineCandidate,'unequal-crossing':generateUnequalCrossingCandidate,'maybe-flock':generateMaybeFlockCandidate,'hollow-bough':generateHollowBoughCandidate};
for(const [family,generate]of Object.entries(generators)){
  for(let tier=1;tier<=5;tier++){
    let packet,params,attempts=[];
    for(const p of [{tier,seed:2},{tier,seed:1},{tier,seed:2,layoutId:'hedges'},{tier,seed:3,layoutId:'hedges'}]){
      try{packet=generate(p);}catch(error){packet={status:'unsupported',reasonCode:error.message};}
      attempts.push({params:p,status:packet.status,reasonCode:packet.reasonCode});params=p;
      if(packet.status==='success')break;
    }
    if(packet.status!=='success'){rows.push({family,tier,status:packet.status,reason:packet.reasonCode,attempts,certified:false});continue;}
    const blueprint=packet.blueprint,state={blueprint,events:[]},stations=blueprint.stations.map(s=>{
      const art=orchardArtFor({...s,kind:'station'},state);
      return {id:s.id,name:s.name,hex:s.hex,assetId:art?.id||null,available:!!art?.url,fallback:art?.fallback,groundOffset:art?.groundOffset};
    }),enemies=blueprint.enemies.map(e=>({id:e.id,artId:e.artId,idle:!!orchardArtFor({id:e.id,kind:'enemy'},state)?.url,defeated:!!orchardArtFor({id:e.id,kind:'enemy',defeated:true},state)?.url}));
    rows.push({family,tier,status:'render-metadata-only',params,stations,enemies,panStationIds:blueprint.puzzle.panStationIds,certified:false,allAssetsResolve:stations.every(s=>s.available)&&enemies.every(e=>e.idle&&e.defeated)});
  }
  const panels=[];
  for(const [r,viewport]of ['phone','tablet','desktop'].entries())for(const [c,zoom]of ['minimum','native','maximum'].entries()){
    const file=`${root}/${family}-${viewport}-${zoom}-20261005.jpg`,input=await sharp(file).resize({width:320,height:300,fit:'contain',background:'#203e30'}).jpeg().toBuffer();
    panels.push({input,left:c*320,top:r*300});
  }
  await sharp({create:{width:960,height:900,channels:3,background:'#203e30'}}).composite(panels).jpeg({quality:92}).toFile(`${root}/${family}-contact-20261005.jpg`);
}
const sourceHashes=Object.fromEntries(['scripts/dev/art-family-live-preview-20261005.jsx','expeditions/v2/art/renderer.js','expeditions/v2/art/family-art.js','expeditions/v2/art/family-manifest.json','expeditions/v2/ui/MapViewport.jsx','expeditions/v2/ui/OrchardExpedition.jsx','expeditions/v2/ui/recovery.css.js'].map(p=>[p,sha(fs.readFileSync(p))]));
const captures=JSON.parse(fs.readFileSync(`${root}/capture-log-20261005.json`));
const evidence={schemaVersion:1,scope:'actual generator art reference audit, bounded candidates, no certification or availability promotion',createdAt:new Date().toISOString(),rows,sourceHashes,previewSha256:sha(fs.readFileSync(`${root}/family-art-preview-20261005.html`)),captures:captures.map(c=>({...c,sha256:sha(fs.readFileSync(c.path))})),contactOrder:{columns:['minimum','native','maximum'],rows:['phone','tablet','desktop']}};
fs.writeFileSync(`${root}/family-art-audit-20261005.json`,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({slots:rows.length,resolved:rows.filter(r=>r.allAssetsResolve).length,unknown:rows.filter(r=>!r.allAssetsResolve).map(r=>({family:r.family,tier:r.tier,status:r.status,reason:r.reason})),captures:captures.length}));
