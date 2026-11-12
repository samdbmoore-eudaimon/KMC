const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../..');
const sourceRoot = 'assets/expeditions/production/9fo/runtime';
const deliveryRoot = 'assets/expeditions/production/9fo/v2';
const backgrounds = {white:'#ffffff', black:'#000000', green:'#577249', cyan:'#00ffff'};
const relative = p => path.relative(root, p).replaceAll('\\', '/');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const readJSON = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const writeJSON = (p,v) => fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');

function alphaAnalysis(data, width, height) {
  const seen = new Uint8Array(width*height), components = [];
  let left=width, top=height, right=0, bottom=0, transparent=0, neutral=0, visible=0;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const i=y*width+x, a=data[i*4+3];
    if(a<8){transparent++;continue;}
    visible++;left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x+1);bottom=Math.max(bottom,y+1);
    const rgb=[data[i*4],data[i*4+1],data[i*4+2]];
    if(Math.max(...rgb)-Math.min(...rgb)<13 && Math.min(...rgb)>178)neutral++;
    if(seen[i])continue;
    seen[i]=1;const queue=[i];let count=0;
    for(let j=0;j<queue.length;j++) {
      const k=queue[j], cx=k%width, cy=Math.floor(k/width);count++;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++) {
        const nx=cx+dx,ny=cy+dy,n=ny*width+nx;
        if(nx<0||ny<0||nx>=width||ny>=height||seen[n]||data[n*4+3]<8)continue;
        seen[n]=1;queue.push(n);
      }
    }
    components.push(count);
  }
  components.sort((a,b)=>b-a);
  return {visibleBounds:[left,top,right,bottom],transparentPixels:transparent,visiblePixels:visible,
    components:components.slice(0,20),componentCount:components.length,
    detachedPixels:components.slice(1).reduce((a,b)=>a+b,0),
    checkerboardHeuristicPass:neutral<=Math.max(800,visible*0.015)};
}

function selection() {
  const selected=[];
  const add=(id,file,category,extra={})=>selected.push({id,sourcePath:`${sourceRoot}/${category}/${file}`,category,...extra});
  const manifest=readJSON('assets/expeditions/production/9fo/manifest.json');
  const characters={};
  for(const [hero,poses]of Object.entries(manifest.characters)) {
    characters[hero]={};
    for(const [state,key]of Object.entries({idle:'idleFront',rear:'idleBack',action:'action',exhausted:'exhausted'})) {
      const id=`hero-${hero}-${state}`;
      if(!poses[key])throw Error(`Missing ${hero} ${key}`);
      selected.push({id,sourcePath:`${sourceRoot}/${poses[key]}`,category:'characters',entity:hero,state});
      characters[hero][state]=id;
    }
  }
  const enemyStates={
    hookmole:{idle:'idle-front',rear:'idle-back',action:'action',jam:'jam',hit:'hit',defeated:'defeated'},
    scruffcrow:{idle:'perch',action:'peck',defeated:'flee'},
    strawling:{idle:'idle',telegraph:'telegraph',hit:'hit',defeated:'defeated'},
    crosswind:{idle:'idle',telegraph:'telegraph',hit:'hit',defeated:'defeated'}
  };
  const enemies={};
  for(const [enemy,states]of Object.entries(enemyStates)) {
    enemies[enemy]={};
    for(const [state,pose]of Object.entries(states)) {
      const stem=`po-${enemy}-${pose}-v1`, dir=path.join(root,sourceRoot,'enemies');
      const file=['webp','png'].map(ext=>`${stem}.${ext}`).find(f=>fs.existsSync(path.join(dir,f)));
      if(!file)throw Error(`Missing ${stem}`);
      const id=`enemy-${enemy}-${state}`;add(id,file,'enemies',{entity:enemy,state});enemies[enemy][state]=id;
    }
  }
  for(const stem of ['hex-grass-v3','path-v1','flagstone-v1','hedge-v1','roots-v1','stream-v1','stone-bridge-v1','timber-bridge-v1','apple-tree-v1','start-v1','exit-v1','objective-socket-v1'])add(`terrain-${stem}`,`po-terrain-${stem}.webp`,'terrain');
  for(const stem of ['hive-ledger-board-v1','hive-ledger-corruption-v1','hive-ledger-solved-cell-v1','orchard-lockdown-gate-v1','current-turner-hex-v1','rooststorm-wind-dial-v2'])add(`mechanism-${stem}`,`po-${stem}.png`,'mechanisms');
  for(const state of ['neutral','selected','rotate','locked','jammed','complete'])add(`operator-${state}`,`po-operator-${state}-v1.webp`,'mechanisms');
  for(const state of ['empty','selected','loaded','overloaded','complete','broken'])add(`balance-${state}`,`po-balance-${state}-v1.webp`,'objectives');
  for(const stem of ['unequal-crossing-scale-one-hex-v1','unequal-crossing-scale-under-v1','unequal-crossing-scale-overloaded-v1','unequal-crossing-burrow-v1','rooststorm-whistle-tower-v2','hollow-bough-living-branches-v1','hollow-bough-memorial-hex-v1','orchard-root-fall-marker-v1','orchard-living-root-barrier-v1'])add(`objective-${stem}`,`po-${stem}.png`,'objectives');
  for(const stem of ['hero-card-frame-wide','contextual-button-frame','contextual-dialog-frame','enemy-intent-plaque','round-objective-frame','first-clear-frame','replay-result-frame','heart-badge','ap-badge'])add(`ui-${stem}`,`po-${stem}-v1.png`,'ui');
  add('background-gorge','po-orchard-gorge-v1.webp','backgrounds');
  for(const [id,file]of [['equation-frame','po-equation-six-sector-neutral-v1.png'],['mechanism-plinth','po-mechanism-plinth-normal-v1.png'],['mechanism-plinth-damaged','po-mechanism-plinth-damaged-v1.png']])selected.push({id,sourcePath:`${deliveryRoot}/source/${file}`,category:'structures'});
  const overridePath='docs/expeditions/v2/art-source-overrides.json';
  const overrides=fs.existsSync(path.join(root,overridePath))?readJSON(overridePath):{};
  for(const item of selected){const override=overrides[item.id];if(!override)continue;
    if(!Number.isInteger(override.version)||override.version<2||!path.resolve(root,override.sourcePath).startsWith(root+path.sep))throw Error(`Invalid art override: ${item.id}`);
    item.sourcePath=override.sourcePath;item.version=override.version;item.repairReason=override.reason;
  }
  return {selected,characters,enemies};
}

async function main() {
  const {selected,characters,enemies}=selection();
  const only=process.argv.find(arg=>arg.startsWith('--only='))?.slice(7).split(',');
  const previous=only?readJSON('docs/expeditions/v2/art-delivery.json'):null;
  const records=previous?previous.assets.filter(a=>!only.includes(a.id)):[];
  const baseline={};
  for(const file of ['WallabyMaths.html','www/index.html'])if(fs.existsSync(path.join(root,file)))baseline[file]={bytes:fs.statSync(path.join(root,file)).size,sha256:hash(fs.readFileSync(path.join(root,file)))};
  for(const item of selected) {
    if(only&&!only.includes(item.id))continue;
    const source=path.join(root,item.sourcePath), bytes=fs.readFileSync(source), inputMeta=await sharp(bytes).metadata();
    const isUI=item.category==='ui', isBackground=item.category==='backgrounds', isWheel=item.id==='equation-frame';
    const maxWidth=isBackground?1600:isWheel?512:isUI&&!item.id.endsWith('badge')?512:384;
    const maxHeight=isBackground?900:isUI&&!item.id.endsWith('badge')?192:maxWidth;
    const version=item.version||1,runtimePath=`${deliveryRoot}/runtime/${item.category}/${item.id}-v${version}.webp`;
    fs.mkdirSync(path.dirname(path.join(root,runtimePath)),{recursive:true});
    let pipeline=sharp(bytes).toColourspace('srgb');
    if(isWheel)pipeline=pipeline.rotate(30,{background:{r:0,g:0,b:0,alpha:0}});
    const optimised=await pipeline.resize(maxWidth,maxHeight,{fit:'inside',withoutEnlargement:true}).webp({quality:82,alphaQuality:100,effort:6}).toBuffer();
    fs.writeFileSync(path.join(root,runtimePath),optimised);
    const {data,info}=await sharp(optimised).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const analysis=alphaAnalysis(data,info.width,info.height),bounds=analysis.visibleBounds;
    const centre=[info.width/2,info.height/2];
    const topCentre=item.id.startsWith('mechanism-plinth')?[info.width/2,info.height*0.46]:centre;
    const groundAnchor=['characters','enemies'].includes(item.category)?[(bounds[0]+bounds[2])/2,bounds[3]-Math.max(2,info.height*0.04)]:topCentre;
    const qaBase=`${deliveryRoot}/qa/${item.category}/${item.id}${version>1?`-v${version}`:''}`;
    const qaPaths={};
    fs.mkdirSync(path.dirname(path.join(root,qaBase)),{recursive:true});
    for(const [name,colour]of Object.entries(backgrounds)) {
      qaPaths[name]=`${qaBase}-${name}.png`;
      await sharp(optimised).flatten({background:colour}).png().toFile(path.join(root,qaPaths[name]));
    }
    qaPaths.atRuntimeScale=`${qaBase}-scales.png`;
    const tiles=[];
    for(let i=0;i<3;i++) {
      const size=[48,96,192][i],input=await sharp(optimised).resize(size,size,{fit:'contain',background:backgrounds.green}).png().toBuffer();
      tiles.push({input,left:[0,64,176][i],top:0});
    }
    await sharp({create:{width:368,height:192,channels:3,background:backgrounds.green}}).composite(tiles).png().toFile(path.join(root,qaPaths.atRuntimeScale));
    const wheel=isWheel?await import('../../expeditions/v2/art/wheel-geometry.js'):null;
    const overlayAnchors=isWheel?{sectorCentres:wheel.wheelSlots().map(p=>[p.x,p.y]),labelSafeRadius:wheel.WHEEL_GEOMETRY.labelSafeRadius,fixedPointer:wheel.WHEEL_GEOMETRY.fixedPointer,rotationCentre:centre}:{};
    records.push({...item,version,runtimePath,width:info.width,height:info.height,bytes:optimised.length,sourceBytes:bytes.length,sourceDimensions:[inputMeta.width,inputMeta.height],sha256:hash(optimised),sourceSha256:hash(bytes),alpha:inputMeta.hasAlpha===true,visibleBounds:bounds,groundAnchor,topCentre,overlayAnchors,allowedStates:item.state?[item.state]:isWheel?['neutral','selected','locked','jammed']:['neutral'],reviewStatus:'candidate',anchorStatus:isWheel?'measured-sector-layout':'estimated-needs-renderer-review',alphaAnalysis:analysis,qaPaths});
  }
  const total=records.reduce((s,r)=>s+r.bytes,0),sourceTotal=records.reduce((s,r)=>s+r.sourceBytes,0);
  const delivery={schemaVersion:1,status:fs.existsSync(path.join(root,'expeditions/v2/art/manifest.json'))?'candidate-partially-imported':'candidate-not-imported',rulesBaseline:'1.0',characters,enemies,assets:records,selectedBytes:total,sourceBytes:sourceTotal,budgetBytes:12*1024*1024,withinBudget:total<=12*1024*1024,baselineBundles:baseline,limitations:['Final acceptance requires screenshots through the real gated App adapter.','Estimated ground anchors require state-by-state visual review.','Detached components are diagnostic only: no automatic removal from approved originals.','Plinth top polygon needs measured geometry acceptance.','Wheel states use the shared frame plus future live geometry markers.']};
  writeJSON('docs/expeditions/v2/art-delivery.json',delivery);
  writeJSON('docs/expeditions/v2/art-selection.json',{characters,enemies,selected:selected.map(x=>({id:x.id,sourcePath:x.sourcePath})),excluded:['carry poses','proposed enemy factions','opaque pond/earth-wall stamps','superseded schematic SVGs']});
  for(const category of [...new Set(records.filter(r=>!only||only.includes(r.id)).map(r=>r.category))]) {
    const rows=records.filter(r=>r.category===category);
    for(let offset=0;offset<rows.length;offset+=24) {
      const chunk=rows.slice(offset,offset+24),composites=[];
      for(let i=0;i<chunk.length;i++) {
        const r=chunk[i],left=(i%6)*200,top=Math.floor(i/6)*180;
        const thumb=await sharp(path.join(root,r.runtimePath)).resize(180,140,{fit:'contain',background:backgrounds.green}).png().toBuffer();
        const label=Buffer.from(`<svg width="200" height="40"><text x="5" y="14" fill="white" font-size="10">${r.id.slice(0,30)}</text><text x="5" y="29" fill="white" font-size="10">${r.id.slice(30)} ${r.bytes}B</text></svg>`);
        composites.push({input:thumb,left:left+10,top},{input:label,left,top:top+140});
      }
      await sharp({create:{width:1200,height:Math.ceil(chunk.length/6)*180,channels:3,background:backgrounds.green}}).composite(composites).png().toFile(path.join(root,`${deliveryRoot}/qa/${category}-contact-${offset/24+1}.png`));
    }
  }
  console.log(JSON.stringify({assets:records.length,heroes:Object.keys(characters).length,enemies:Object.keys(enemies).length,selectedBytes:total,sourceBytes:sourceTotal,budgetPass:delivery.withinBudget,checkerboardFlags:records.filter(r=>!r.alphaAnalysis.checkerboardHeuristicPass).map(r=>r.id),detachedReview:records.filter(r=>r.alphaAnalysis.detachedPixels>20).map(r=>({id:r.id,pixels:r.alphaAnalysis.detachedPixels}))},null,2));
}

module.exports={alphaAnalysis,selection};
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
