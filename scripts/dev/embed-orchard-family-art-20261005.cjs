const fs=require('node:fs'),crypto=require('node:crypto');
const root='expeditions/v2/art',base=JSON.parse(fs.readFileSync('assets/expeditions/production/9fo/v2/family-art-batch-20261004/manifest.json')),staged=JSON.parse(fs.readFileSync('assets/expeditions/production/9fo/v2/future-prop-batch-20261004/manifest.json'));
const assets={...base.assets},urls={};
for(const asset of staged.assets){
  const bytes=fs.readFileSync(asset.runtimePath);
  if(bytes.length!==asset.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==asset.sha256||!asset.alphaAnalysis.checkerboardHeuristicPass)throw Error(`Changed or failed preflight: ${asset.id}`);
  if(asset.alphaAnalysis.detachedPixels>20&&!asset.intentionalDetachedComponents)throw Error(`Detached review missing: ${asset.id}`);
  assets[asset.id]={...asset,entityId:'shape',runtimeSelected:true,reviewStatus:'isolated-reviewed-live-pending'};
}
const shared={control:'four-locks-control-base-v1',number:'four-locks-number-bus-base-v1',sustain:'four-locks-tree-maintenance-base-v1',alcove:'four-locks-alcove-base-v1'};
const manifest={...base,assets,familyMappings:{...base.familyMappings,'unequal-crossing':{...base.familyMappings['unequal-crossing'],sustain:'unequal-pan-v1'},'maybe-flock':{...shared,shape:'whistle-tower-v1'},'hollow-bough':{...shared,shape:'living-branches-v1'}},selectedBytes:0,note:'Art maps only actual generator station contracts; family availability and certificates unchanged. Unequal left=shape/right=sustain as explicit panStationIds. Printed values, patch, perches, nest groups and beam geometry remain live code.'};
for(const [id,asset]of Object.entries(assets)){
  const bytes=fs.readFileSync(asset.runtimePath);
  if(bytes.length!==asset.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw Error(`Changed ${id}`);
  urls[id]=`data:image/webp;base64,${bytes.toString('base64')}`;manifest.selectedBytes+=bytes.length;
}
if(manifest.selectedBytes>12*1024*1024)throw Error('Family art budget exceeded');
fs.writeFileSync(`${root}/family-manifest.json`,JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(`${root}/family-art.js`,`export const ORCHARD_FAMILY_ART=${JSON.stringify(urls)};\n`);
console.log(JSON.stringify({assets:Object.keys(assets).length,bytes:manifest.selectedBytes,families:Object.keys(manifest.familyMappings)}));
