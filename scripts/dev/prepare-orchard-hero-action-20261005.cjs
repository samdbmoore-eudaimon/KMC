const fs=require('node:fs'),sharp=require('sharp'),crypto=require('node:crypto');
const {alphaAnalysis}=require('./prepare-orchard-v2-art.cjs');
const root='assets/expeditions/production/9fo/v2/hero-action-batch-20261005',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
  for(const d of ['runtime','qa'])fs.mkdirSync(`${root}/${d}`,{recursive:true});
  const sourcePath=`${root}/source/amberly-action-v2.png`,buffer=await sharp(sourcePath).resize(384,384).webp({quality:88,alphaQuality:100}).toBuffer(),runtimePath=`${root}/runtime/hero-amberly-action-v2.webp`,qaPaths={};
  fs.writeFileSync(runtimePath,buffer);
  const raw=await sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true}),analysis=alphaAnalysis(raw.data,384,384);
  if(!analysis.checkerboardHeuristicPass||analysis.detachedPixels>20)throw Error('Amberly repair needs alpha/component review');
  for(const [name,bg]of Object.entries({white:'#fff',black:'#000',green:'#56714a',cyan:'#00ffff'})){qaPaths[name]=`${root}/qa/amberly-action-${name}.png`;await sharp(buffer).flatten({background:bg}).png().toFile(qaPaths[name]);}
  const comps=[];for(const [i,size]of [48,96,192,384].entries())comps.push({input:await sharp(buffer).resize(size,size).png().toBuffer(),left:[10,72,185,400][i],top:400-size});
  qaPaths.atRuntimeScale=`${root}/qa/amberly-action-scales.png`;await sharp({create:{width:800,height:420,channels:4,background:'#d9dfc7'}}).composite(comps).png().toFile(qaPaths.atRuntimeScale);
  const deliveryPath='docs/expeditions/v2/art-delivery.json',reviewPath='docs/expeditions/v2/art-preflight-review.json',overridePath='docs/expeditions/v2/art-source-overrides.json',delivery=JSON.parse(fs.readFileSync(deliveryPath)),reviews=JSON.parse(fs.readFileSync(reviewPath)),overrides=JSON.parse(fs.readFileSync(overridePath)),id='hero-amberly-action',index=delivery.assets.findIndex(a=>a.id===id),sourceMeta=await sharp(sourcePath).metadata();
  const record={...delivery.assets[index],sourcePath,sourceSha256:hash(fs.readFileSync(sourcePath)),sourceBytes:fs.statSync(sourcePath).size,sourceDimensions:[sourceMeta.width,sourceMeta.height],runtimePath,version:2,width:384,height:384,bytes:buffer.length,sha256:hash(buffer),visibleBounds:analysis.visibleBounds,groundAnchor:[206,analysis.visibleBounds[3]],topCentre:[192,analysis.visibleBounds[1]],qaPaths,alphaAnalysis:analysis,alpha:true,reviewStatus:'candidate',anchorStatus:'isolated-reviewed-live-pending'};
  delivery.assets[index]=record;delivery.selectedBytes=delivery.assets.reduce((n,a)=>n+a.bytes,0);delivery.sourceBytes=delivery.assets.reduce((n,a)=>n+a.sourceBytes,0);delivery.withinBudget=delivery.selectedBytes<=delivery.budgetBytes;
  overrides[id]={sourcePath,version:2,reason:'Built-in imagegen removes unrelated upper pose fragments and restores cropped feet. Identical Amberly working lantern identity; originals retained.'};
  reviews.assets[id]={sha256:record.sha256,reason:'Single built-in imagegen precise repair; full moth/scarf/wings/lantern/feet silhouette with margins. Unchanged alpha/component gates pass. Four-background/scale/actual held-state review required.'};
  fs.writeFileSync(`${root}/manifest.json`,JSON.stringify({schemaVersion:1,ownerThread:'01a10869-af91-7490-9f19-c99e0842fcc1',status:'isolated-candidate',assets:[record],selectedBytes:record.bytes,generated:{tool:'built-in image_gen',original:'assets/expeditions/production/9fo/runtime/characters/po-amberly-action-v1.webp',sourcePath,output:'C:/Users/samdb/.codex/generated_images/01a10869-af91-7490-9f19-c99e0842fcc1/exec-7e576208-d654-47bf-b70c-efcfa6855af3.png',purpose:'Remove unrelated top pose fragments and restore complete feet only; preserve lantern working identity with transparent margins.'}},null,2)+'\n');
  fs.writeFileSync(deliveryPath,JSON.stringify(delivery,null,2)+'\n');fs.writeFileSync(reviewPath,JSON.stringify(reviews,null,2)+'\n');fs.writeFileSync(overridePath,JSON.stringify(overrides,null,2)+'\n');
  console.log(JSON.stringify({id,bytes:record.bytes,sha256:record.sha256,analysis}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
