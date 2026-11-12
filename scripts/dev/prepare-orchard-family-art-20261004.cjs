const fs=require('node:fs'),sharp=require('sharp'),crypto=require('node:crypto');
const {alphaAnalysis}=require('./prepare-orchard-v2-art.cjs');
const root='assets/expeditions/production/9fo/v2/family-art-batch-20261004',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
 for(const d of ['runtime','qa'])fs.mkdirSync(`${root}/${d}`,{recursive:true});
 const delivery=JSON.parse(fs.readFileSync('docs/expeditions/v2/art-delivery.json')),a=delivery.assets.find(a=>a.id==='objective-unequal-crossing-scale-one-hex-v1'),original=fs.readFileSync(a.runtimePath);
 if(hash(original)!==a.sha256||original.length!==a.bytes)throw Error('Changed pan input');
 const [l,t,r,b]=a.visibleBounds,w=r-l,h=b-t,k=320/Math.max(w,h),rw=Math.round(w*k),rh=Math.round(h*k),left=Math.round((384-rw)/2),top=338-rh;
 const buffer=await sharp(original).extract({left:l,top:t,width:w,height:h}).resize(rw,rh).extend({left,top,right:384-rw-left,bottom:46,background:'#00000000'}).webp({quality:88,alphaQuality:100}).toBuffer();
 const runtimePath=`${root}/runtime/unequal-pan-v1.webp`;fs.writeFileSync(runtimePath,buffer);
 const raw=await sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true}),qaPaths={};
 for(const [name,bg]of Object.entries({white:'#fff',black:'#000',green:'#56714a',cyan:'#00ffff'})){qaPaths[name]=`${root}/qa/pan-${name}.png`;await sharp(buffer).flatten({background:bg}).png().toFile(qaPaths[name]);}
 const comps=[];for(const [i,size]of [48,96,192,384].entries())comps.push({input:await sharp(buffer).resize(size,size).png().toBuffer(),left:[10,72,185,400][i],top:400-size});
 qaPaths.atRuntimeScale=`${root}/qa/pan-scales.png`;await sharp({create:{width:800,height:420,channels:4,background:'#d9dfc7'}}).composite(comps).png().toFile(qaPaths.atRuntimeScale);
 const asset={id:'unequal-pan-v1',familyId:'unequal-crossing',entityId:'shape',state:'base',version:1,sourcePath:a.sourcePath,sourceSha256:a.sourceSha256,preparedInputPath:a.runtimePath,preparedInputSha256:a.sha256,runtimePath,width:384,height:384,bytes:buffer.length,sha256:hash(buffer),alpha:true,alphaAnalysis:alphaAnalysis(raw.data,384,384),groundAnchor:[192,330],visibleBounds:[left,top,left+rw,338],overlayAnchors:{status:[328,72],work:[42,250]},labelSafeAreas:[[98,102,280,190]],qaPaths,reviewStatus:'candidate',liveAcceptance:false};
 const manifest={schemaVersion:1,status:'private-renderer-review',selectedBytes:buffer.length,assets:{[asset.id]:asset},familyMappings:{'unequal-crossing':{control:'four-locks-control-base-v1',number:'four-locks-number-bus-base-v1',shape:asset.id,sustain:'four-locks-tree-maintenance-base-v1',alcove:'four-locks-alcove-base-v1'}},note:'Physical pan skin only. Exact totals, load assignments, hidden-value knowledge and pan comparison remain live code. No painted terrain defines hit geometry.'};
 fs.writeFileSync(`${root}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');require('./embed-orchard-family-art-20261005.cjs');
 console.log(JSON.stringify({selectedBytes:buffer.length,sha256:asset.sha256}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
