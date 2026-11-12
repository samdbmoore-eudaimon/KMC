const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const root=path.resolve(__dirname,'../..'),legacy='assets/expeditions/production/9fo/runtime',output='assets/expeditions/production/9fo/v2/recovery';
const files={backdrop:['backgrounds/po-squad-select-backdrop-v1.png',1400],gorge:['backgrounds/po-orchard-gorge-v1.webp',1400],briefing:['ui/po-squad-briefing-panel-v1.png',620],heroFrame:['ui/po-hero-card-frame-wide-v1.png',440],button:['ui/po-button-available-v1.webp',220],embark:['ui/po-squad-embark-button-v1.png',400],corners:['ui/po-squad-card-selection-corners-v1.png',220],grass:['terrain/po-terrain-hex-grass-v3.webp',384],path:['terrain/po-terrain-path-v1.webp',384],roots:['terrain/po-terrain-roots-v1.webp',384],water:['terrain/po-terrain-stream-v1.webp',384],hedge:['terrain/po-terrain-hedge-v1.webp',384],bridge:['terrain/po-terrain-timber-bridge-v1.webp',384]};
async function main(){
  fs.mkdirSync(path.join(root,output,'qa'),{recursive:true});const assets={},records={};
  for(const[id,[file,width]]of Object.entries(files)){
    const sourcePath=`${legacy}/${file}`,runtimePath=`${output}/${id}.webp`,input=fs.readFileSync(path.join(root,sourcePath));
    const bytes=await (id==='button'?sharp(input).trim():sharp(input)).resize({width,withoutEnlargement:true}).webp({quality:86,alphaQuality:100}).toBuffer(),meta=await sharp(bytes).metadata();
    fs.writeFileSync(path.join(root,runtimePath),bytes);assets[id]=`data:image/webp;base64,${bytes.toString('base64')}`;
    const qaPaths=[];
    if(meta.hasAlpha)for(const[name,colour]of [['white','#fff'],['black','#000'],['green','#284d35'],['cyan','#00ffff']]){const qa=`${output}/qa/${id}-${name}.png`;fs.writeFileSync(path.join(root,qa),await sharp(bytes).flatten({background:colour}).png().toBuffer());qaPaths.push(qa);}
    records[id]={sourcePath,runtimePath,width:meta.width,height:meta.height,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),alpha:!!meta.hasAlpha,qaPaths,use:['grass','path','roots','water','hedge','bridge'].includes(id)?'surface-material-on-code-hex':'scenery-or-responsive-ui'};
  }
  const selectedBytes=Object.values(records).reduce((sum,r)=>sum+r.bytes,0),heroes=JSON.parse(fs.readFileSync(path.join(root,'expeditions/v2/art/manifest.json'))).selectedBytes;
  if(selectedBytes+heroes>12*1024*1024)throw Error('Combined artwork exceeds 12 MiB');
  fs.writeFileSync(path.join(root,'expeditions/v2/art/scene-kit.js'),`export const ORCHARD_SCENE_KIT=${JSON.stringify(assets)};\n`);
  fs.writeFileSync(path.join(root,'expeditions/v2/art/scene-kit.json'),JSON.stringify({status:'private-browser-review-pending',selectedBytes,combinedSelectedBytes:selectedBytes+heroes,assets:records},null,2)+'\n');
  console.log(JSON.stringify({assets:Object.keys(records).length,selectedBytes,combinedSelectedBytes:selectedBytes+heroes}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
