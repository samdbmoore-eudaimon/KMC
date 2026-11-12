const fs=require('node:fs'),crypto=require('node:crypto'),sharp=require('sharp');
const {alphaAnalysis}=require('./prepare-orchard-v2-art.cjs');
const root='assets/expeditions/production/9fo/v2/overnight-art-20261004';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const backgrounds={white:'#ffffff',black:'#000000',green:'#56714a',cyan:'#00ffff'};
const svg=(w,h,body)=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);
async function main(){
 for(const d of ['runtime','qa'])fs.mkdirSync(`${root}/${d}`,{recursive:true});
 const station=read('docs/expeditions/v2/station-art-batch-manifest.json'),delivery=read('docs/expeditions/v2/art-delivery.json');
 const selected=[...station.assets,...delivery.assets.filter(a=>a.entity==='crosswind')],assets=[];
 for(const a of selected){
  const buffer=fs.readFileSync(a.runtimePath),sha256=crypto.createHash('sha256').update(buffer).digest('hex');
  if(sha256!==a.sha256||buffer.length!==a.bytes)throw Error(`Changed approved input ${a.id}`);
  const raw=await sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const diagnostics=alphaAnalysis(raw.data,raw.info.width,raw.info.height),runtimePath=`${root}/runtime/${a.id}.webp`;
  fs.writeFileSync(runtimePath,buffer);
  const qaPaths={};
  for(const [name,colour]of Object.entries(backgrounds)){
   qaPaths[name]=`${root}/qa/${a.id}-${name}.png`;
   await sharp(buffer).flatten({background:colour}).png().toFile(qaPaths[name]);
  }
  assets.push({...a,originalRuntimePath:a.runtimePath,runtimePath,alphaAnalysis:diagnostics,qaPaths,reviewStatus:'candidate',liveAcceptance:false});
 }
 const bases=assets.filter(a=>a.state==='base'||a.entity==='crosswind');
 for(const a of assets){
  const sizeComps=[];
  for(const [i,size]of [48,96,192,384].entries())sizeComps.push({input:await sharp(a.runtimePath).resize(size,size).png().toBuffer(),left:[12,80,190,398][i],top:400-size});
  a.qaPaths.atRuntimeScale=`${root}/qa/${a.id}-scales.png`;
  await sharp({create:{width:800,height:420,channels:4,background:'#d9dfc7'}}).composite(sizeComps).png().toFile(a.qaPaths.atRuntimeScale);
 }
 for(const [name,colour]of Object.entries(backgrounds)){
  const comps=[];
  for(const [i,a]of bases.entries()){
   comps.push({input:await sharp(a.runtimePath).resize(192,192).png().toBuffer(),left:i%4*220+14,top:Math.floor(i/4)*225});
   comps.push({input:svg(220,24,`<text x="4" y="16" fill="${name==='black'?'white':'#172d24'}" font-family="Arial" font-size="11">${a.id.replace('-base-v1','').replace('enemy-','')}</text>`),left:i%4*220,top:Math.floor(i/4)*225+195});
  }
  await sharp({create:{width:880,height:Math.ceil(bases.length/4)*225,channels:4,background:colour}}).composite(comps).png().toFile(`${root}/qa/contact-${name}.png`);
 }
 const props=bases.filter(a=>a.state==='base'),comps=[];
 for(const [row,a]of props.entries())for(const [col,zoom]of [.45,1,2].entries()){
  const [l,t,r,b]=a.visibleBounds,w=r-l,h=b-t,radius=36;
  const scale=Math.min(Math.sqrt(3)*radius/w,radius/(h/2+w/(2*Math.sqrt(3))))*zoom;
  const cx=col*260+120,cy=row*200+130,s=40*zoom;
  const points=Array.from({length:6},(_,i)=>{const angle=(-90+i*60)*Math.PI/180;return `${120+s*Math.cos(angle)},${130+s*Math.sin(angle)}`;}).join(' ');
  comps.push({input:svg(260,200,`<polygon points="${points}" fill="#90a46d" stroke="#314b34" stroke-width="2"/><text x="4" y="18" font-family="Arial" font-size="11">${a.entityId}: ${zoom}x asset composition</text>`),left:col*260,top:row*200});
  const pw=Math.round(a.width*scale),ph=Math.round(a.height*scale);
  comps.push({input:await sharp(a.runtimePath).resize(pw,ph).png().toBuffer(),left:Math.round(cx-(l+r)/2*scale),top:Math.round(cy-(t+b)/2*scale)});
 }
 await sharp({create:{width:780,height:props.length*200,channels:4,background:'#d9dfc7'}}).composite(comps).png().toFile(`${root}/qa/props-min-native-max.png`);
 const mapping={familyId:'turning-ravine',control:'four-locks-control-base-v1',number:'four-locks-number-bus-base-v1',shape:'four-locks-bridge-brace-base-v1',sustain:'turning-ravine-wind-stabiliser-base-v1',alcove:'four-locks-alcove-base-v1',note:'Calibration power junction uses bus silhouette; exact equation wheel remains separate live puzzle overlay. No certificate artId changes.'};
 fs.writeFileSync(`${root}/manifest.json`,JSON.stringify({schemaVersion:1,ownerThread:'01a10869-af91-7490-9f19-c99e0842fcc1',status:'isolated-review-candidates',assets,totalBytes:assets.reduce((n,a)=>n+a.bytes,0),proposedMapping:mapping,limitation:'Asset compositions only. Existing live screenshots predate station integration. Physical device and child QA unverified.'},null,2)+'\n');
 console.log(JSON.stringify({assets:assets.length,totalBytes:assets.reduce((n,a)=>n+a.bytes,0),output:root}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
