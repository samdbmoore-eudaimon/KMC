const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const root=process.cwd(),staging='assets/expeditions/production/9fo/v2/pose-staging-20261005',hash=b=>crypto.createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const {alphaAnalysis}=require(path.join(root,'scripts/dev/prepare-orchard-v2-art.cjs'));
async function main(){
  const staged=read(`${staging}/staged-manifest.json`),visual=read(`${staging}/visual-review.json`),baseline=read(`${staging}/actual-pose-requirements.json`),accepted=staged.assets.filter(a=>a.gateStatus==='alpha-and-margins-pass');
  if(accepted.length!==15)throw Error('Authorised window requires exactly fifteen candidates');
  for(const [p,h]of Object.entries(baseline.frozenHashes))if(hash(fs.readFileSync(p))!==h)throw Error(`Baseline changed: ${p}`);
  for(const a of accepted){
    if(['hero-cobweb-exhausted','hero-warden-action','hero-cornix-action'].includes(a.id))throw Error(`Withheld: ${a.id}`);
    const bytes=fs.readFileSync(a.runtimePath),source=fs.readFileSync(a.sourcePath),review=visual.assets.find(v=>v.id===a.id);
    if(hash(bytes)!==a.sha256||bytes.length!==a.bytes||hash(source)!==a.sourceSha256||review?.sha256!==a.sha256||hash(fs.readFileSync(review.contactPath))!==review.contactSha256)throw Error(`Exact evidence mismatch: ${a.id}`);
    const raw=await sharp(bytes).ensureAlpha().raw().toBuffer(),analysis=alphaAnalysis(raw,384,384);
    if(!analysis.checkerboardHeuristicPass||analysis.detachedPixels>20||JSON.stringify(analysis)!==JSON.stringify(a.alphaAnalysis)||!a.visibleBounds.every((v,i)=>i<2?v>0:v<384))throw Error(`Unchanged gate failed: ${a.id}`);
  }
  const deliveryPath='docs/expeditions/v2/art-delivery.json',reviewsPath='docs/expeditions/v2/art-preflight-review.json',overridesPath='docs/expeditions/v2/art-source-overrides.json',delivery=read(deliveryPath),reviews=read(reviewsPath),overrides=read(overridesPath);
  fs.writeFileSync(path.join(__dirname,'before-records.json'),JSON.stringify({delivery,reviews,overrides},null,2)+'\n');
  for(const a of accepted){
    const index=delivery.assets.findIndex(x=>x.id===a.id);if(index<0)throw Error(`Named delivery record missing: ${a.id}`);
    const m=await sharp(a.sourcePath).metadata();
    delivery.assets[index]={...delivery.assets[index],...a,sourceBytes:fs.statSync(a.sourcePath).size,sourceDimensions:[m.width,m.height],alpha:true,topCentre:[192,a.visibleBounds[1]],reviewStatus:'isolated-reviewed',anchorStatus:'imported-live-review-pending'};
    overrides[a.id]={sourcePath:a.sourcePath,version:a.version,reason:`Reviewed existing identity; ${a.preparation.mode}; exact source preserved. Actual recorded hold/AP0 requirement, fifteen-pose authorised window.`};
    reviews.assets[a.id]={sha256:a.sha256,reason:'Unchanged alpha/component/margin gates pass. Exact four-background/native/minimum/maximum ground contact inspected; actual recorded pose requirement verified. Authorised fifteen-pose import, live consumer review pending.'};
  }
  delivery.selectedBytes=delivery.assets.reduce((n,a)=>n+a.bytes,0);delivery.sourceBytes=delivery.assets.reduce((n,a)=>n+a.sourceBytes,0);delivery.withinBudget=delivery.selectedBytes<=delivery.budgetBytes;
  for(const [p,data]of [[deliveryPath,delivery],[reviewsPath,reviews],[overridesPath,overrides]])fs.writeFileSync(p,JSON.stringify(data,null,2)+'\n');
  fs.writeFileSync(path.join(__dirname,'import-validation.json'),JSON.stringify({createdAt:new Date().toISOString(),count:15,bytes:accepted.reduce((n,a)=>n+a.bytes,0),ids:accepted.map(a=>a.id),assets:accepted.map(a=>({id:a.id,sha256:a.sha256,sourceSha256:a.sourceSha256,bytes:a.bytes,visibleBounds:a.visibleBounds,groundAnchor:a.groundAnchor})),baselineVerified:true,unchangedGates:true},null,2)+'\n');
  console.log(JSON.stringify({count:15,bytes:accepted.reduce((n,a)=>n+a.bytes,0),deliveryBytes:delivery.selectedBytes}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
