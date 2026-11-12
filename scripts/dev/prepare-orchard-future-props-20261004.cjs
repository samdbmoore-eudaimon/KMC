const fs=require('node:fs'),sharp=require('sharp'),crypto=require('node:crypto');
const {alphaAnalysis}=require('./prepare-orchard-v2-art.cjs');
const root='assets/expeditions/production/9fo/v2/future-prop-batch-20261004',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
  for(const d of ['runtime','qa'])fs.mkdirSync(`${root}/${d}`,{recursive:true});
  const delivery=JSON.parse(fs.readFileSync('docs/expeditions/v2/art-delivery.json')),assets=[];
  const hero=delivery.assets.find(a=>a.id==='hero-furrow-idle');
  for(const [input,id,familyId,labelSafeAreas]of [
    ['objective-rooststorm-whistle-tower-v2','whistle-tower-v1','maybe-flock',[[165,85,215,168]]],
    ['objective-hollow-bough-living-branches-v1','living-branches-v1','hollow-bough',[[150,88,234,235]]]
  ]){
    const a=delivery.assets.find(a=>a.id===input),original=fs.readFileSync(a.runtimePath);
    if(hash(original)!==a.sha256||original.length!==a.bytes)throw Error(`Changed ${input}`);
    const [l,t,r,b]=a.visibleBounds,w=r-l,h=b-t,k=320/Math.max(w,h),rw=Math.round(w*k),rh=Math.round(h*k),left=Math.round((384-rw)/2),top=338-rh;
    const buffer=await sharp(original).extract({left:l,top:t,width:w,height:h}).resize(rw,rh).extend({left,top,right:384-rw-left,bottom:46,background:'#00000000'}).webp({quality:88,alphaQuality:100}).toBuffer();
    const runtimePath=`${root}/runtime/${id}.webp`;fs.writeFileSync(runtimePath,buffer);
    const raw=await sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true}),analysis=alphaAnalysis(raw.data,384,384),qaPaths={};
    for(const [name,bg]of Object.entries({white:'#fff',black:'#000',green:'#56714a',cyan:'#00ffff'})){qaPaths[name]=`${root}/qa/${id}-${name}.png`;await sharp(buffer).flatten({background:bg}).png().toFile(qaPaths[name]);}
    const comps=[];for(const [i,size]of [48,96,192,384].entries())comps.push({input:await sharp(buffer).resize(size,size).png().toBuffer(),left:[10,72,185,400][i],top:400-size});
    qaPaths.atRuntimeScale=`${root}/qa/${id}-scales.png`;await sharp({create:{width:800,height:420,channels:4,background:'#d9dfc7'}}).composite(comps).png().toFile(qaPaths.atRuntimeScale);
    const asset={id,familyId,version:1,state:'base',sourcePath:a.sourcePath,sourceSha256:a.sourceSha256,preparedInputPath:a.runtimePath,preparedInputSha256:a.sha256,runtimePath,width:384,height:384,bytes:buffer.length,sha256:hash(buffer),alpha:true,alphaAnalysis:analysis,visibleBounds:analysis.visibleBounds,groundAnchor:[192,330],overlayAnchors:{status:[328,72],work:[42,250]},labelSafeAreas,reviewStatus:'candidate',runtimeSelected:false,liveAcceptance:false,qaPaths,intentionalDetachedComponents:id==='living-branches-v1'?'Two separate growing boughs form the original paired identity. No component removed.':false};
    const {fitSpriteInHex}=await import('../../expeditions/v2/art/placement.js'),fit=fitSpriteInHex(asset),zoomComps=[];
    for(const [i,z]of [.45,1,2].entries()){
      const scale=fit.scale*z,sw=Math.round(384*scale),sh=sw,cx=160,cy=180;
      const hexPoints=Array.from({length:6},(_,n)=>{const rad=(n*60-30)*Math.PI/180;return `${cx+40*z*Math.cos(rad)},${cy+40*z*Math.sin(rad)}`;}).join(' ');
      const backdrop=Buffer.from(`<svg width="320" height="340"><rect width="320" height="340" fill="#d9dfc7"/><polygon points="${hexPoints}" fill="#90a46b" stroke="#344831" stroke-width="2"/><text x="12" y="24" font-size="16">${id}: ${z} zoom, isolated QA</text></svg>`);
      const heroSize=Math.round(66*z*384/(hero.visibleBounds[3]-hero.visibleBounds[1])),heroImage=await sharp(hero.runtimePath).resize(heroSize,heroSize).png().toBuffer();
      const panel=await sharp(backdrop).composite([{input:await sharp(buffer).resize(sw,sh).png().toBuffer(),left:Math.round(cx-fit.anchor[0]*scale),top:Math.round(cy-fit.anchor[1]*scale)},{input:heroImage,left:Math.round(cx+34*z-hero.groundAnchor[0]*heroSize/384),top:Math.round(cy+8*z-hero.visibleBounds[3]*heroSize/384)}]).png().toBuffer();
      zoomComps.push({input:panel,left:i*320,top:0});
    }
    qaPaths.hexHeroComposition=`${root}/qa/${id}-hex-hero.png`;await sharp({create:{width:960,height:340,channels:4,background:'#d9dfc7'}}).composite(zoomComps).png().toFile(qaPaths.hexHeroComposition);
    assets.push(asset);
  }
  fs.writeFileSync(`${root}/manifest.json`,JSON.stringify({schemaVersion:1,status:'isolated-candidate-not-imported',ownerThread:'01a10869-af91-7490-9f19-c99e0842fcc1',assets,selectedBytes:0,stagedBytes:assets.reduce((n,a)=>n+a.bytes,0),note:'Code retains cells, sockets, whistle values, clues and anchor counts. No speculative station IDs or runtime family enablement.'},null,2)+'\n');
  console.log(JSON.stringify(assets.map(({id,bytes,sha256,alphaAnalysis})=>({id,bytes,sha256,alphaAnalysis}))));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
