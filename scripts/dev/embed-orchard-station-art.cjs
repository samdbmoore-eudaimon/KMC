const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'expeditions/v2/art');
const delivery=JSON.parse(fs.readFileSync(path.join(root,'docs/expeditions/v2/station-art-batch-manifest.json'),'utf8'));
const selected=delivery.assets.filter(a=>a.familyId==='four-locks'||a.id==='turning-ravine-wind-stabiliser-base-v1'||/^station-cue-(ready|working|damage|corrupted|prepared)-v1$/.test(a.id));
if(delivery.assets.length!==13||selected.length!==11)throw Error('Unexpected final station batch');
let verifiedBytes=0;
for(const a of delivery.assets){
  const bytes=fs.readFileSync(path.join(root,a.runtimePath));
  if(bytes.length!==a.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==a.sha256)throw Error(`Station asset changed: ${a.id}`);
  if(!fs.existsSync(path.join(root,a.sourcePath)))throw Error(`Source missing: ${a.id}`);
  for(const p of Object.values(a.qaPaths))if(!fs.existsSync(path.join(root,p)))throw Error(`QA missing: ${a.id}`);
  if(a.state==='base'&&(a.width!==384||a.height!==384||JSON.stringify(a.groundAnchor)!=='[192,330]'))throw Error(`Unregistered station anchor: ${a.id}`);
  for(const v of [a.groundAnchor,...Object.values(a.overlayAnchors||{})])if(!v.flat(Infinity).every(Number.isFinite))throw Error(`Invalid station coordinates: ${a.id}`);
  verifiedBytes+=bytes.length;
}
if(verifiedBytes!==delivery.totalRuntimeBytes)throw Error('Batch byte total changed');
const manifest={schemaVersion:1,status:'private-renderer-review',selectedBytes:selected.reduce((sum,a)=>sum+a.bytes,0),verifiedBatchBytes:verifiedBytes,assets:Object.fromEntries(selected.map(a=>[a.id,a])),staged:delivery.assets.filter(a=>!selected.includes(a)).map(a=>({id:a.id,bytes:a.bytes,sha256:a.sha256,runtimePath:a.runtimePath}))};
manifest.familyMappings={
 'four-locks':{control:'four-locks-control-base-v1',number:'four-locks-number-bus-base-v1',shape:'four-locks-bridge-brace-base-v1',sustain:'four-locks-tree-maintenance-base-v1',alcove:'four-locks-alcove-base-v1'},
 'turning-ravine':{control:'four-locks-control-base-v1',number:'four-locks-number-bus-base-v1',shape:'four-locks-bridge-brace-base-v1',sustain:'turning-ravine-wind-stabiliser-base-v1',alcove:'four-locks-alcove-base-v1'}
};
const sprite=JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8')),scene=JSON.parse(fs.readFileSync(path.join(out,'scene-kit.json'),'utf8'));
manifest.combinedSelectedBytes=manifest.selectedBytes+sprite.selectedBytes+(scene.selectedBytes??scene.totalBytes);
if(!Number.isFinite(manifest.combinedSelectedBytes)||manifest.combinedSelectedBytes>12*1024*1024)throw Error('Selected art budget invalid');
const assets=Object.fromEntries(selected.map(a=>[a.id,`data:image/webp;base64,${fs.readFileSync(path.join(root,a.runtimePath)).toString('base64')}`]));
fs.writeFileSync(path.join(out,'station-art.js'),`export const ORCHARD_STATION_ART=${JSON.stringify(assets)};\n`);
fs.writeFileSync(path.join(out,'station-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({verified:delivery.assets.length,selected:selected.length,selectedBytes:manifest.selectedBytes,combinedSelectedBytes:manifest.combinedSelectedBytes}));
