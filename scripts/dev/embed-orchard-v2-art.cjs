const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'expeditions/v2/art');
const delivery=JSON.parse(fs.readFileSync(path.join(root,'docs/expeditions/v2/art-delivery.json'),'utf8'));
const reviews=JSON.parse(fs.readFileSync(path.join(root,'docs/expeditions/v2/art-preflight-review.json'),'utf8'));
const ids=[...Object.values(delivery.characters).map(poses=>poses.idle),...['pip','sorrel','furrow','dapple','bushel','tuppence'].flatMap(id=>['rear','action','exhausted'].map(pose=>`hero-${id}-${pose}`)).filter(id=>id!=='hero-dapple-action'),'hero-wicker-rear','hero-wicker-action','hero-wicker-exhausted','enemy-hookmole-idle','enemy-hookmole-defeated','equation-frame'];
ids.push('enemy-crosswind-idle','enemy-crosswind-defeated');
ids.push('enemy-scruffcrow-idle','enemy-scruffcrow-defeated','enemy-strawling-idle','enemy-strawling-defeated');
ids.push('hero-amberly-action');
ids.push('hero-cobweb-action','hero-barrow-action','hero-dapple-action','hero-barrow-exhausted','hero-amberly-exhausted','hero-warden-exhausted','hero-gossamer-action','hero-gossamer-exhausted','hero-harvestmoon-action','hero-harvestmoon-exhausted','hero-cornix-exhausted','hero-kernel-action','hero-kernel-exhausted','hero-beeswax-action','hero-beeswax-exhausted');
const assets={},manifest={schemaVersion:1,status:'private-renderer-qa',selectedBytes:0,assets:{}};
for(const id of ids){
  const record=delivery.assets.find(a=>a.id===id),review=reviews.assets[id],reviewMatches=review?.sha256===record?.sha256;
  if((id==='equation-frame'||id.startsWith('hero-wicker-')&&!id.endsWith('-idle'))&&!reviewMatches)throw Error(`Exact-hash isolated review missing: ${id}`);
  if(!record||!record.alpha||!record.alphaAnalysis.transparentPixels||(!record.alphaAnalysis.checkerboardHeuristicPass&&!(reviewMatches&&review.alphaHeuristicFalsePositive)))throw Error(`Asset preflight missing: ${id}`);
  if(record.alphaAnalysis.detachedPixels>20&&!(reviewMatches&&review.intentionalDetachedComponents))throw Error(`Detached component review needed: ${id}`);
  for(const p of Object.values(record.qaPaths))if(!fs.existsSync(path.join(root,p)))throw Error(`QA evidence missing: ${id}`);
  const bytes=fs.readFileSync(path.join(root,record.runtimePath));
  if(crypto.createHash('sha256').update(bytes).digest('hex')!==record.sha256)throw Error(`Asset changed: ${id}`);
  assets[id]=`data:image/webp;base64,${bytes.toString('base64')}`;
  manifest.selectedBytes+=bytes.length;
  manifest.assets[id]={id,width:record.width,height:record.height,groundAnchor:record.groundAnchor,topCentre:record.topCentre,overlayAnchors:record.overlayAnchors,allowedStates:record.allowedStates,visibleBounds:record.visibleBounds,sha256:record.sha256,bytes:record.bytes,sourcePath:record.sourcePath,runtimePath:record.runtimePath,qaPaths:record.qaPaths,anchorStatus:'live-review-pending',...(reviewMatches?{manualPreflightReview:review.reason}:{})};
}
if(manifest.selectedBytes>12*1024*1024)throw Error('Selected v2 artwork exceeds12MiB');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'runtime-art.js'),`export const ORCHARD_V2_ART=${JSON.stringify(assets)};\n`);
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({assets:ids.length,selectedBytes:manifest.selectedBytes,status:manifest.status}));
