const fs=require('node:fs');
const path=require('node:path');
const sharp=require('sharp');
const root=path.resolve(__dirname,'../..'),directory='assets/expeditions/production/9fo/v2/qa';
async function main(){
  const delivery=JSON.parse(fs.readFileSync(path.join(root,'docs/expeditions/v2/art-delivery.json'),'utf8'));
  const records=Object.values(delivery.characters).map(poses=>delivery.assets.find(a=>a.id===poses.idle));
  if(records.length!==30||records.some(a=>!a))throw Error('Missing idle hero');
  for(const background of ['white','black','green','cyan']){
    const composites=[];
    for(const [i,record]of records.entries()){
      const left=(i%6)*192,top=Math.floor(i/6)*216;
      composites.push({input:await sharp(path.join(root,record.qaPaths[background])).resize(192,192,{fit:'contain'}).png().toBuffer(),left,top});
      composites.push({input:Buffer.from(`<svg width="192" height="24"><rect width="192" height="24" fill="#294b36"/><text x="6" y="17" fill="#fff4d1" font-size="12">${record.id}</text></svg>`),left,top:top+192});
    }
    await sharp({create:{width:1152,height:1080,channels:3,background:'#294b36'}}).composite(composites).png().toFile(path.join(root,`${directory}/idle-${background}-contact.png`));
  }
  console.log(JSON.stringify({heroes:records.length,paths:['white','black','green','cyan'].map(b=>`${directory}/idle-${b}-contact.png`),limitation:'Isolated 192px QA only; real board anchor and occlusion acceptance remains pending.'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
