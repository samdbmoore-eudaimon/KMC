const fs=require('node:fs'),crypto=require('node:crypto');
const input=process.argv[2]||'assets/expeditions/production/9fo/v2/river-art-batch/qa/collar-before/manifest.json';
const batch=JSON.parse(fs.readFileSync(input,'utf8'));
if(!batch.currentCandidateIds?.length)throw Error('Await complete candidate manifest');
const assets={},images={};let selectedBytes=0;
for(const id of batch.currentCandidateIds){
  const asset=batch.assets.find(a=>a.id===id);if(!asset)throw Error(`Missing ${id}`);
  const bytes=fs.readFileSync(asset.runtimePath);
  if(bytes.length!==asset.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw Error(`Changed runtime ${id}`);
  if(crypto.createHash('sha256').update(fs.readFileSync(asset.sourcePath)).digest('hex')!==asset.sourceSha256)throw Error(`Changed source ${id}`);
  for(const p of Object.values(asset.qaPaths))if(!fs.existsSync(p))throw Error(`Missing QA ${p}`);
  if(!asset.alpha||asset.alphaAnalysis.detachedPixels!==0||!asset.alphaAnalysis.checkerboardHeuristicPass||asset.bytes>70*1024)throw Error(`Failed alpha/budget ${id}`);
  assets[id]=asset;images[id]=`data:image/webp;base64,${bytes.toString('base64')}`;selectedBytes+=bytes.length;
}
fs.writeFileSync('expeditions/v2/art/river-art.js',`export const ORCHARD_RIVER_ART=${JSON.stringify(images)};\n`);
fs.writeFileSync('expeditions/v2/art/river-manifest.json',JSON.stringify({status:'candidate-live-review',sourceManifest:input,selectedBytes,assets},null,2)+'\n');
console.log(JSON.stringify({status:'candidate-live-review',selectedBytes,ids:Object.keys(assets)}));
