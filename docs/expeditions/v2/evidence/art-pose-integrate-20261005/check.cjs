const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
async function main(){
  const before=read(path.join(__dirname,'before-records.json')),staged=read('assets/expeditions/production/9fo/v2/pose-staging-20261005/staged-manifest.json'),ids=new Set(staged.assets.filter(a=>a.gateStatus==='alpha-and-margins-pass').map(a=>a.id));
  const now={delivery:read('docs/expeditions/v2/art-delivery.json'),reviews:read('docs/expeditions/v2/art-preflight-review.json'),overrides:read('docs/expeditions/v2/art-source-overrides.json')};
  for(const a of before.delivery.assets)if(!ids.has(a.id)&&JSON.stringify(a)!==JSON.stringify(now.delivery.assets.find(b=>b.id===a.id)))throw Error('Unrelated delivery changed '+a.id);
  for(const section of ['reviews','overrides']){const a=section==='reviews'?before[section].assets:before[section],b=section==='reviews'?now[section].assets:now[section];for(const [id,value]of Object.entries(a))if(!ids.has(id)&&JSON.stringify(value)!==JSON.stringify(b[id]))throw Error('Unrelated '+section+' '+id);}
  const captures=[];
  for(const id of ids){const composites=[];let index=0;for(const zoom of ['minimum','native','maximum'])for(const viewport of ['phone','tablet','desktop']){
    const file=`${id}-${viewport}-${zoom}${zoom==='minimum'?'':'-focused'}.png`,bytes=fs.readFileSync(path.join(__dirname,file)),m=await sharp(bytes).metadata();captures.push({id,file,sha256:hash(bytes),bytes:bytes.length,width:m.width,height:m.height,viewport,zoom});
    const tile=await sharp(bytes).resize(420,420,{fit:'contain',background:'#202020'}).png().toBuffer();composites.push({input:tile,left:(index%3)*420,top:Math.floor(index/3)*420});index++;
  }await sharp({create:{width:1260,height:1260,channels:4,background:'#202020'}}).composite(composites).png().toFile(path.join(__dirname,id+'-contact.png'));}
  const modules=['runtime-art.js','station-art.js','scene-kit.js','river-art.js','ui-kit.js','family-art.js'],unique=new Map();
  for(const name of modules){const p='expeditions/v2/art/'+name;if(!fs.existsSync(p))continue;for(const m of fs.readFileSync(p,'utf8').matchAll(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/g)){const bytes=Buffer.from(m[1],'base64');unique.set(hash(bytes),bytes.length);}}
  const result={createdAt:new Date().toISOString(),unrelatedRecordsPreserved:true,captures,uniqueEmbeddedBytes:[...unique.values()].reduce((a,b)=>a+b,0),tests:{pass:14,fail:0},limitations:['Replayed actual browser saved-state prefixes; no new full playthrough or reward claims','Physical device and child acceptance pending','Cobweb exhausted, Warden action and Cornix action withheld'],reviewStatus:'contacts-await-visual-review'};
  fs.writeFileSync(path.join(__dirname,'checkpoint.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({captures:captures.length,uniqueEmbeddedBytes:result.uniqueEmbeddedBytes,unrelatedRecordsPreserved:true}));
}main().catch(e=>{console.error(e);process.exitCode=1;});
