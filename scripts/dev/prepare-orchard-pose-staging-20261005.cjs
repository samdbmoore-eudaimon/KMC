const fs=require('node:fs'),crypto=require('node:crypto'),sharp=require('sharp');
const {alphaAnalysis}=require('./prepare-orchard-v2-art.cjs');
const root='assets/expeditions/production/9fo/v2/pose-staging-20261005',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
  for(const dir of ['runtime','qa'])fs.mkdirSync(`${root}/${dir}`,{recursive:true});
  const assets=[];
  const specs=[['cobweb','action',3,'Unequal Crossing T3 browser win command23 Shape hold'],['barrow','action',2,'Unequal Crossing T3 browser win command18 Number hold'],['dapple','action',2,'Maybe-Flock Roost T1 browser win command31 Alcove hold'],['cobweb','exhausted',2,'Unequal Crossing T3 browser win command3 AP0'],['barrow','exhausted',2,'Unequal Crossing T3 browser win command5 AP0'],['amberly','exhausted',3,'Unequal Crossing T3 browser win command13 AP0'],['warden','action',2,'Hollow Bough T5 direct browser win command19 Number hold'],['warden','exhausted',2,'Hollow Bough T5 direct browser win command3 AP0'],['gossamer','action',2,'Hollow Bough T5 direct browser win command20 Shape hold'],['gossamer','exhausted',2,'Hollow Bough T5 direct browser win command5 AP0'],['harvestmoon','action',2,'Hollow Bough T5 direct browser win command21 Sustain hold'],['harvestmoon','exhausted',2,'Hollow Bough T5 direct browser win command7 AP0']];
  for(const hero of ['cornix','kernel','beeswax'])for(const pose of ['action','exhausted'])specs.push([hero,pose,2,`Hollow Bough T2 actual browser win ${pose==='action'?'hold':'AP0'}`]);
  for(const [hero,pose,version,requirement]of specs){
    const stem=`${hero}-${pose}-v${version}`,sourcePath=`${root}/source/${stem}.png`;
    if(!fs.existsSync(sourcePath))continue;
    const source=fs.readFileSync(sourcePath),sourceMeta=await sharp(source).metadata(),buffer=await sharp(source).resize(384,384,{fit:'contain',background:'#00000000'}).webp({quality:88,alphaQuality:100}).toBuffer(),runtimePath=`${root}/runtime/${stem}.webp`;
    fs.writeFileSync(runtimePath,buffer);
    const raw=await sharp(buffer).ensureAlpha().raw().toBuffer(),analysis=alphaAnalysis(raw,384,384),bounds=analysis.visibleBounds,footXs=[];
    for(let y=bounds[3]-3;y<bounds[3];y++)for(let x=bounds[0];x<bounds[2];x++)if(raw[(y*384+x)*4+3]>=8)footXs.push(x);
    const footAnchorX=hero==='dapple'&&pose==='action'?138:Math.round(footXs.reduce((n,x)=>n+x,0)/footXs.length);
    const groundAnchor=[footAnchorX,bounds[3]],qaPaths={};
    for(const [name,bg]of Object.entries({white:'#ffffff',black:'#000000',green:'#577249',cyan:'#00ffff'})){
      qaPaths[name]=`${root}/qa/${stem}-${name}.png`;
      await sharp(buffer).flatten({background:bg}).png().toFile(qaPaths[name]);
    }
    const comps=[];
    for(const [i,zoom]of [.45,1,2].entries()){
      const scale=66/(bounds[3]-bounds[1])*zoom,size=Math.round(384*scale),sprite=await sharp(buffer).resize(size,size).png().toBuffer();
      comps.push({input:sprite,left:Math.round(130+i*250-groundAnchor[0]*scale),top:Math.round(210-groundAnchor[1]*scale)});
    }
    const line=Buffer.from('<svg width="760" height="240"><path d="M0 210H760" stroke="#b25024" stroke-width="2"/><g fill="#b25024">'+[130,380,630].map(x=>`<circle cx="${x}" cy="210" r="3"/>`).join('')+'</g></svg>');
    qaPaths.groundScale=`${root}/qa/${stem}-ground-min-native-max.png`;
    await sharp({create:{width:760,height:240,channels:4,background:'#d9dfc7'}}).composite([...comps,{input:line}]).png().toFile(qaPaths.groundScale);
    qaPaths.contact=`${root}/qa/${stem}-review.png`;
    await sharp({create:{width:768,height:1008,channels:4,background:'#d9dfc7'}}).composite(Object.entries(qaPaths).filter(([name])=>['white','black','green','cyan'].includes(name)).map(([,input],i)=>({input,left:i%2*384,top:Math.floor(i/2)*384})).concat([{input:qaPaths.groundScale,left:4,top:768}])).png().toFile(qaPaths.contact);
    const evidence=JSON.parse(fs.readFileSync(`${root}/actual-pose-requirements.json`)).rows.flatMap(r=>r.states.filter(s=>s.cardId===hero&&s.pose===pose&&!s.reason).map(s=>({file:r.file,sourceSha256:r.sourceSha256,sourceScope:r.sourceScope,family:r.family,tier:r.tier,firstCommand:s.firstCommand,holding:s.holding,position:s.position,ap:s.ap,hp:s.hp})));
    const sourceExports=fs.existsSync(`${root}/source-export-provenance.json`)?JSON.parse(fs.readFileSync(`${root}/source-export-provenance.json`,'utf8').replace(/^\uFEFF/,'')):[],sourceExport=sourceExports.find(p=>p.outputSha256===hash(source));
    const preparation=sourceExport?{mode:'unchanged-source-export',original:sourceExport.source,originalSha256:sourceExport.sourceSha256,crop:sourceExport.crop,treatment:sourceExport.treatment}:{mode:'built-in-imagegen-existing-identity-repair'};
    assets.push({id:`hero-${hero}-${pose}`,version,sourcePath,sourceSha256:hash(source),sourceDimensions:[sourceMeta.width,sourceMeta.height],preparation,runtimePath,sha256:hash(buffer),bytes:buffer.length,width:384,height:384,visibleBounds:bounds,groundAnchor,groundOffset:[0,8],renderedHeight:66,alphaAnalysis:analysis,qaPaths,gateStatus:analysis.checkerboardHeuristicPass&&analysis.detachedPixels<=20&&bounds.every((v,i)=>i<2?v>0:v<384)?'alpha-and-margins-pass':'withheld',status:'staged-only-not-imported',requirement:`Actual ${requirement}`,evidence});
  }
  const baseline=JSON.parse(fs.readFileSync(`${root}/actual-pose-requirements.json`)),frozenUnchanged=Object.entries(baseline.frozenHashes).every(([p,h])=>hash(fs.readFileSync(p))===h);
  if(!frozenUnchanged)throw Error('Frozen art inputs changed; report exact external source change before review');
  fs.writeFileSync(`${root}/staged-manifest.json`,JSON.stringify({createdAt:new Date().toISOString(),ownerThread:'01a10869-af91-7490-9f19-c99e0842fcc1',status:'staged-only; visual review required; Claude window required before any promotion',stagedBytes:assets.reduce((n,a)=>n+a.bytes,0),passingBytes:assets.filter(a=>a.gateStatus==='alpha-and-margins-pass').reduce((n,a)=>n+a.bytes,0),frozenUnchanged,assets},null,2)+'\n');
  console.log(JSON.stringify(assets.map(a=>({id:a.id,bytes:a.bytes,sha256:a.sha256,bounds:a.visibleBounds,anchor:a.groundAnchor,gateStatus:a.gateStatus,alpha:a.alphaAnalysis}))));
}
main().catch(error=>{console.error(error);process.exitCode=1;});

