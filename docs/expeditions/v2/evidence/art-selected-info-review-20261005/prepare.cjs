const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const source='docs/expeditions/v2/evidence/code-overnight-20261004',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
  const checkpoint=JSON.parse(fs.readFileSync(source+'/selected-info-stable-checkpoint.json','utf8')),files=fs.readdirSync(source).filter(f=>f.startsWith('selected-info-stable-')&&f.endsWith('.png')).sort(),screens=[];
  if(files.length!==42||checkpoint.measurements!==42)throw Error('Expected42stablecaptures');
  for(const file of files){const bytes=fs.readFileSync(source+'/'+file),m=await sharp(bytes).metadata();screens.push({file,sha256:hash(bytes),width:m.width,height:m.height,bytes:bytes.length});}
  for(let group=0;group<7;group++){const inputs=[];for(let i=0;i<6;i++){const file=files[group*6+i],tile=await sharp(source+'/'+file).resize(640,512,{fit:'contain',background:'#222'}).png().toBuffer();inputs.push({input:tile,left:(i%2)*640,top:Math.floor(i/2)*512});}await sharp({create:{width:1280,height:1536,channels:4,background:'#222'}}).composite(inputs).png().toFile(path.join(__dirname,'contact-'+(group+1)+'.png'));}
  const production=['expeditions/v2/ui/MapViewport.jsx','expeditions/v2/ui/SelectedHeroInfo.jsx','expeditions/v2/ui/selected-info.js','expeditions/v2/art/runtime-art.js','expeditions/v2/art/manifest.json','docs/expeditions/v2/art-preflight-review.json','docs/expeditions/v2/art-delivery.json','wm-9fo-card-art.js'];
  const result={createdAt:new Date().toISOString(),scope:'Independent visual review of existing stable saved-state captures only',sourceCheckpointSha256:hash(fs.readFileSync(source+'/selected-info-stable-checkpoint.json')),screens,contactOrder:files,productionHashes:Object.fromEntries(production.map(p=>[p,hash(fs.readFileSync(p))])),status:'awaiting independent visual review'};
  fs.writeFileSync(path.join(__dirname,'review.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({captures:files.length,contacts:7}));
}main().catch(e=>{console.error(e);process.exitCode=1;});
