const fs=require('node:fs'),sharp=require('sharp'),crypto=require('node:crypto');
const {alphaAnalysis}=require('./prepare-orchard-v2-art.cjs');
const root='assets/expeditions/production/9fo/v2/enemy-art-batch-20261004',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const backgrounds={white:'#fff',black:'#000',green:'#56714a',cyan:'#00ffff'};
async function main(){
 for(const d of ['runtime','qa'])fs.mkdirSync(`${root}/${d}`,{recursive:true});
 const deliveryPath='docs/expeditions/v2/art-delivery.json',reviewPath='docs/expeditions/v2/art-preflight-review.json',overridesPath='docs/expeditions/v2/art-source-overrides.json';
 const delivery=JSON.parse(fs.readFileSync(deliveryPath)),reviews=JSON.parse(fs.readFileSync(reviewPath)),overrides=JSON.parse(fs.readFileSync(overridesPath)),assets=[];
 for(const id of ['enemy-scruffcrow-idle','enemy-scruffcrow-defeated','enemy-strawling-idle','enemy-strawling-defeated']){
  const old=delivery.assets.find(a=>a.id===id);let sourcePath=old.sourcePath,buffer,version=old.version;
  if(id==='enemy-scruffcrow-idle'){
   sourcePath=`${root}/source/scruffcrow-idle-v2.png`;version=2;
   buffer=await sharp(sourcePath).resize({width:384,height:384,fit:'inside'}).webp({quality:88,alphaQuality:100}).toBuffer();
  }else{buffer=fs.readFileSync(old.runtimePath);if(hash(buffer)!==old.sha256)throw Error(`Changed ${id}`);}
  const runtimePath=`${root}/runtime/${id}-v${version}.webp`;fs.writeFileSync(runtimePath,buffer);
  const raw=await sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true}),analysis=alphaAnalysis(raw.data,raw.info.width,raw.info.height),qaPaths={};
  for(const [name,bg]of Object.entries(backgrounds)){qaPaths[name]=`${root}/qa/${id}-${name}.png`;await sharp(buffer).flatten({background:bg}).png().toFile(qaPaths[name]);}
  const comps=[];for(const [i,size]of [48,96,192,384].entries())comps.push({input:await sharp(buffer).resize(size,size).png().toBuffer(),left:[10,72,185,400][i],top:400-size});
  qaPaths.atRuntimeScale=`${root}/qa/${id}-scales.png`;await sharp({create:{width:800,height:420,channels:4,background:'#d9dfc7'}}).composite(comps).png().toFile(qaPaths.atRuntimeScale);
  const bounds=analysis.visibleBounds,groundAnchor=id==='enemy-scruffcrow-idle'?[(bounds[0]+bounds[2])/2,bounds[3]-8]:old.groundAnchor;
  const sourceMeta=await sharp(sourcePath).metadata();
  const record={...old,sourcePath,sourceSha256:hash(fs.readFileSync(sourcePath)),sourceDimensions:[sourceMeta.width,sourceMeta.height],runtimePath,version,width:raw.info.width,height:raw.info.height,bytes:buffer.length,sha256:hash(buffer),alpha:true,visibleBounds:bounds,groundAnchor,qaPaths,alphaAnalysis:analysis,reviewStatus:'candidate',anchorStatus:'isolated-reviewed-live-pending',sourceBytes:fs.statSync(sourcePath).size};
  assets.push(record);delivery.assets[delivery.assets.findIndex(a=>a.id===id)]=record;
  reviews.assets[id]={sha256:record.sha256,...(analysis.detachedPixels>20?{intentionalDetachedComponents:true}:{}),reason:id==='enemy-scruffcrow-idle'?'Built-in imagegen repairs cropped upper plume; same perched bird, claws, branch and transparent complete silhouette. Four-background/scale isolated review, live anchor review pending.':id==='enemy-scruffcrow-defeated'?'Existing flee pose: branch, feather and leaves deliberately detach from airborne crow. Four-background/scale reviewed; no pixel cleanup or alpha relaxation.':'Existing Strawling figure; separate leaves/straw on defeated pose are deliberate defeat decoration, not unrelated fragments. Four-background/scale reviewed; live state anchor check pending.'};
 }
 overrides['enemy-scruffcrow-idle']={sourcePath:`${root}/source/scruffcrow-idle-v2.png`,version:2,reason:'Restore cropped top plume with built-in imagegen, preserve identity/pose/branch; originals retained.'};
 delivery.selectedBytes=delivery.assets.reduce((n,a)=>n+a.bytes,0);delivery.sourceBytes=delivery.assets.reduce((n,a)=>n+a.sourceBytes,0);delivery.withinBudget=delivery.selectedBytes<=delivery.budgetBytes;
 fs.writeFileSync(`${root}/manifest.json`,JSON.stringify({schemaVersion:1,ownerThread:'01a10869-af91-7490-9f19-c99e0842fcc1',status:'isolated-review',assets,selectedBytes:assets.reduce((n,a)=>n+a.bytes,0),generated:{tool:'built-in image_gen',source:`${root}/source/scruffcrow-idle-v2.png`,original:'assets/expeditions/production/9fo/runtime/enemies/po-scruffcrow-perch-v1.png',output:'C:/Users/samdb/.codex/generated_images/01a10869-af91-7490-9f19-c99e0842fcc1/exec-17597a13-bb10-41f3-b250-b758a7590297.png',prompt:'Precise object edit: complete cropped top plume only, retain identical right-facing charcoal/brown ragged Scruffcrow with amber eye, black beak and both claws on leafy branch; entire complete silhouette,8percent transparent margins, true alpha, no text/matte/checkerboard/newobjects.'}},null,2)+'\n');
 fs.writeFileSync(deliveryPath,JSON.stringify(delivery,null,2)+'\n');fs.writeFileSync(reviewPath,JSON.stringify(reviews,null,2)+'\n');fs.writeFileSync(overridesPath,JSON.stringify(overrides,null,2)+'\n');
 console.log(JSON.stringify(assets.map(a=>({id:a.id,bytes:a.bytes,sha256:a.sha256,detached:a.alphaAnalysis.detachedPixels,bounds:a.visibleBounds,groundAnchor:a.groundAnchor}))));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
