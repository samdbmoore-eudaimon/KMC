const fs=require('node:fs'),crypto=require('node:crypto'),sharp=require('sharp');
const {alphaAnalysis}=require('./prepare-orchard-v2-art.cjs');
const root='assets/expeditions/production/9fo/v2/ui-frame-batch-20261004';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const backgrounds={white:'#ffffff',black:'#000000',green:'#284d35',cyan:'#00ffff'};
const svg=(w,h,body)=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);
const text=(x,y,t,size=14)=>`<text x="${x}" y="${y}" font-family="Arial" font-size="${size}" fill="#253a2c">${t}</text>`;
async function main(){
 for(const d of ['runtime','qa','portrait-references'])fs.mkdirSync(`${root}/${d}`,{recursive:true});
 const states=['available','selected','pressed','focused','disabled','spent','danger','confirm'],assets={},urls={};
 const configs=[['team','po-contextual-button-frame-v1.png'],...states.map(s=>[s,`po-button-${s}-v1.webp`]),['panel','po-contextual-dialog-frame-v1.png']];
 for(const [id,file]of configs){
  const sourcePath=`assets/expeditions/production/9fo/runtime/ui/${file}`,input=fs.readFileSync(sourcePath);
  let job=sharp(input);if(states.includes(id))job=job.extract({left:64,top:0,width:360,height:192});
  const buffer=await job.resize({width:id==='team'?512:id==='panel'?512:384,withoutEnlargement:true}).webp({quality:88,alphaQuality:100}).toBuffer();
  const runtimePath=`${root}/runtime/${id}.webp`;fs.writeFileSync(runtimePath,buffer);
  const raw=await sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true}),diagnostics=alphaAnalysis(raw.data,raw.info.width,raw.info.height),qaPaths={};
  for(const [name,bg]of Object.entries(backgrounds)){qaPaths[name]=`${root}/qa/${id}-${name}.png`;await sharp(buffer).flatten({background:bg}).png().toFile(qaPaths[name]);}
  const geometry=id==='team'?{width:512,height:171,portraitCircle:[148.5,85.3,39],textSafeArea:[214,62,176,54],recommendedSize:[360,120],minimumSize:[300,100],portraitObjectPosition:'50% 38%',longNameLines:2}:states.includes(id)?{width:360,height:192,iconCircle:[92,96,53],textSafeArea:[170,64,139,71],recommendedSize:[240,128],minimumSize:[216,115.2]}:{width:raw.info.width,height:raw.info.height,textSafeArea:[80,65,352,Math.max(25,raw.info.height-125)]};
  assets[id]={id,sourcePath,sourceSha256:hash(input),runtimePath,width:raw.info.width,height:raw.info.height,bytes:buffer.length,sha256:hash(buffer),alpha:true,visibleBounds:diagnostics.visibleBounds,alphaAnalysis:diagnostics,geometry,qaPaths,reviewStatus:'candidate',liveAcceptance:false};urls[id]=`data:image/webp;base64,${buffer.toString('base64')}`;
 }
 const source=fs.readFileSync('wm-9fo-card-art.js','utf8'),part=source.split('export const NFO_CHARACTER_ART = ')[1].split('\n};')[0]+'\n}';
 const portraits=JSON.parse(part.replace(/,\s*}/g,'}')),portraitMetadata={};
 for(const [id,url]of Object.entries(portraits).filter(([id])=>!id.startsWith('boss_'))){
  const buffer=Buffer.from(url.split(',')[1],'base64'),path=`${root}/portrait-references/${id}.webp`;fs.writeFileSync(path,buffer);
  const m=await sharp(buffer).metadata();portraitMetadata[id]={id,source:'wm-9fo-card-art.js:NFO_CHARACTER_ART',referencePath:path,bytes:buffer.length,sha256:hash(buffer),width:m.width,height:m.height,runtimeImport:false};
 }
 const sampleIds=['furrow','harvestmoon','tenthscarecrow'],names=['Furrow','Harvestmoon','The Tenth Scarecrow'];
 const portraitComps=[];
 for(const [i,[id,url]]of Object.entries(portraits).filter(([,entry])=>!entry[0].startsWith('boss_')).entries()){
  const dataUri=`data:image/png;base64,${(await sharp(Buffer.from(url.split(',')[1],'base64')).png().toBuffer()).toString('base64')}`;
  portraitComps.push({input:svg(160,180,`<defs><clipPath id="circle"><circle cx="80" cy="80" r="64"/></clipPath></defs><image href="${dataUri}" x="16" y="16" width="128" height="128" preserveAspectRatio="xMidYMid slice" clip-path="url(#circle)"/>${text(8,166,id,12)}`),left:i%6*160,top:Math.floor(i/6)*180});
 }
 await sharp({create:{width:960,height:900,channels:4,background:'#e6ddb8'}}).composite(portraitComps).png().toFile(`${root}/qa/original-portrait-circles.png`);
 const pngUrls={};for(const [id,url]of Object.entries({...urls,...Object.fromEntries(sampleIds.map(id=>[id,portraits[id]]))}))pngUrls[id]=`data:image/png;base64,${(await sharp(Buffer.from(url.split(',')[1],'base64')).png().toBuffer()).toString('base64')}`;
 for(const width of [300,360,420]){
  const height=Math.round(width/3),rows=[];
  for(const [i,id]of sampleIds.entries()){
   const a=assets.team,g=a.geometry,k=width/a.width,c={cx:g.portraitCircle[0],cy:g.portraitCircle[1],r:g.portraitCircle[2]};
   const body=`<defs><clipPath id="p"><circle cx="${c.cx}" cy="${c.cy}" r="${c.r}"/></clipPath></defs><image href="${pngUrls.team}" width="${a.width}" height="${a.height}"/><image href="${pngUrls[id]}" x="${c.cx-c.r}" y="${c.cy-c.r}" width="${c.r*2}" height="${c.r*2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#p)"/>${text(216,78,names[i]==='The Tenth Scarecrow'?'The Tenth':names[i],17)}${text(216,97,names[i]==='The Tenth Scarecrow'?'Scarecrow':'12 hearts · 2 actions',names[i]==='The Tenth Scarecrow'?17:13)}${names[i]==='The Tenth Scarecrow'?text(216,112,'12 hearts · 2 actions',13):''}`;
   rows.push({input:await sharp(svg(a.width,a.height,body)).resize(width,height).png().toBuffer(),left:10,top:20+i*(height+20)});
  }
  await sharp({create:{width:width+20,height:(height+20)*3+20,channels:4,background:'#284d35'}}).composite(rows).png().toFile(`${root}/qa/team-${width}.png`);
 }
 for(const [name,bg]of Object.entries(backgrounds)){
  const comps=[];
  for(const [i,id]of states.entries()){comps.push({input:await sharp(assets[id].runtimePath).png().toBuffer(),left:i%2*400,top:Math.floor(i/2)*220});comps.push({input:svg(384,24,text(12,18,id)),left:i%2*400,top:Math.floor(i/2)*220+192});}
  await sharp({create:{width:800,height:880,channels:4,background:bg}}).composite(comps).png().toFile(`${root}/qa/states-${name}.png`);
 }
 const manifest={schemaVersion:1,ownerThread:'01a10869-af91-7490-9f19-c99e0842fcc1',status:'isolated-review',assets,portraits:portraitMetadata,selectedBytes:Object.values(assets).reduce((n,a)=>n+a.bytes,0),contract:'Keep aspect ratio. Separate circle and text DOM layers; live text wraps. Original avatarForCard portraits only. Icon glyphs in code. State labels and disabled semantics remain live. Portrait reference copies are QA only, never a second runtime import.'};
 assets.disabled.runtimeSelected=false;assets.disabled.reviewStatus='withheld-validator-neutral-silver-warning';
 manifest.selectedBytes-=assets.disabled.bytes;
 manifest.disabledState={base:'available',treatment:'CSS grayscale(1), live unavailable label and DOM disabled/aria-disabled semantics. Original silver disabled candidate staged: alpha validator flags neutral silver, no validator change or hidden pixel repair.'};
 urls.disabled=urls.available;
 fs.writeFileSync(`${root}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
 fs.writeFileSync('expeditions/v2/art/ui-kit.json',JSON.stringify(manifest,null,2)+'\n');
 fs.writeFileSync('expeditions/v2/art/ui-kit.js',`export const ORCHARD_UI_KIT=${JSON.stringify(urls)};\nexport const ORCHARD_UI_GEOMETRY=${JSON.stringify(Object.fromEntries(Object.entries(assets).map(([id,a])=>[id,a.geometry])))};\n`);
 console.log(JSON.stringify({assets:Object.keys(assets).length,portraits:Object.keys(portraitMetadata).length,selectedBytes:manifest.selectedBytes}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
