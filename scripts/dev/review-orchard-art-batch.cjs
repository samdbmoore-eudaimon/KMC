const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp'),{transform}=require('esbuild'),{createRequire}=require('node:module'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),qa='assets/expeditions/production/9fo/v2/qa/structures/daytime-20261002',backgrounds={white:'#fff',black:'#000',green:'#577249',cyan:'#0ff'};
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
async function main(){
  fs.mkdirSync(path.join(root,qa),{recursive:true});
  const delivery=read('docs/expeditions/v2/art-delivery.json'),wheel=delivery.assets.find(a=>a.id==='equation-frame');
  const componentPath=path.join(root,'expeditions/v2/art/EquationWheel.jsx'),built=await transform(fs.readFileSync(componentPath,'utf8'),{loader:'jsx',format:'cjs'});
  const module={exports:{}};new Function('require','module','exports',built.code)(createRequire(componentPath),module,module.exports);const Component=module.exports.default;
  const pngWheel=`data:image/png;base64,${(await sharp(path.join(root,wheel.runtimePath)).png().toBuffer()).toString('base64')}`;
  const states=['neutral','selected','locked','jammed'],numeric=[2,4,6,8,10,12],operators=['=','+','−','×','÷',''];
  const markup=(props)=>renderToStaticMarkup(React.createElement(Component,props)).replace(/data:image\/webp;base64,[A-Za-z0-9+/=]+/g,pngWheel);
  const htmlStates=states.map(appearance=>`<figure><svg viewBox="0 0 512 512" width="256" height="256">${renderToStaticMarkup(React.createElement(Component,{faces:operators,rotation:1,appearance,diameter:384,x:256,y:256}))}</svg><figcaption>${appearance}</figcaption></figure>`).join('');
  fs.writeFileSync(path.join(root,`${qa}/wheel-isolated.html`),`<!doctype html><html lang="en"><meta charset="utf-8"><title>Orchard wheel isolated component QA</title><style>body{background:#577249;color:#fff;font:16px sans-serif}main{display:flex;flex-wrap:wrap}figure{margin:12px}h1{font-size:22px}</style><h1>Isolated component evidence</h1><p>Actual EquationWheel React output. This is not integrated App acceptance. Fixed pointer and upright glyphs are separate from the rotating inner frame.</p><main>${htmlStates}</main></html>`);
  const tile=(background,appearance,faces,rotation=0,size=192)=>`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="260"><rect width="300" height="260" fill="${background}"/><polygon points="150,10 245.26,65 245.26,175 150,230 54.74,175 54.74,65" fill="#809967" fill-opacity=".18" stroke="${background==='#000'?'#bbb':'#31523e'}"/>${markup({faces,appearance,rotation,diameter:size,x:150,y:120})}<rect y="238" width="300" height="22" fill="#294b36"/><text x="10" y="253" font-size="12" fill="#fff">${appearance}; rotation ${rotation}; isolated component</text></svg>`;
  const composites=[];let row=0;
  for(const [name,background]of Object.entries(backgrounds)){
    const parts=[];for(let col=0;col<4;col++){const svg=tile(background,states[col],operators,1);parts.push({input:await sharp(Buffer.from(svg)).png().toBuffer(),left:col*300,top:0});}
    const file=`${qa}/wheel-${name}-states.png`;await sharp({create:{width:1200,height:260,channels:3,background}}).composite(parts).png().toFile(path.join(root,file));
    composites.push({input:fs.readFileSync(path.join(root,file)),left:0,top:row++*260});
  }
  await sharp({create:{width:1200,height:1040,channels:3,background:'#294b36'}}).composite(composites).png().toFile(path.join(root,`${qa}/wheel-four-backgrounds.png`));
  const rotations=[];
  for(let i=0;i<6;i++)rotations.push({input:await sharp(Buffer.from(tile(backgrounds.green,'selected',numeric,i))).png().toBuffer(),left:(i%3)*300,top:Math.floor(i/3)*260});
  await sharp({create:{width:900,height:520,channels:3,background:backgrounds.green}}).composite(rotations).png().toFile(path.join(root,`${qa}/wheel-six-rotations.png`));
  const scales=[];
  for(let i=0;i<3;i++)for(let j=0;j<4;j++){const size=[48,96,192][i];scales.push({input:await sharp(Buffer.from(tile(backgrounds.green,states[j],operators,0,size))).png().toBuffer(),left:j*300,top:i*260});}
  await sharp({create:{width:1200,height:780,channels:3,background:backgrounds.green}}).composite(scales).png().toFile(path.join(root,`${qa}/wheel-scales.png`));
  const geometry=await import('../../expeditions/v2/art/wheel-geometry.js');
  const guides=geometry.wheelSlots().map(s=>`<circle cx="${s.x}" cy="${s.y}" r="24" fill="none" stroke="#cc2736"/><circle cx="${s.x}" cy="${s.y}" r="2" fill="#cc2736"/>`).join('');
  const geometrySvg=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#0ff"/>${markup({diameter:384,x:256,y:256})}${guides}</svg>`;
  await sharp(Buffer.from(geometrySvg)).png().toFile(path.join(root,`${qa}/wheel-slot-geometry.png`));
  const poses=delivery.assets.filter(a=>a.id.startsWith('hero-wicker-')&&a.state!=='idle');
  for(const pose of poses){const parts=[];for(let i=0;i<4;i++)parts.push({input:await sharp(path.join(root,pose.qaPaths[Object.keys(backgrounds)[i]])).resize(192,192).png().toBuffer(),left:i*192,top:0});
    for(let i=0;i<3;i++){const size=[48,96,192][i];parts.push({input:await sharp(path.join(root,pose.runtimePath)).resize(size,size,{fit:'contain',background:backgrounds.green}).png().toBuffer(),left:[0,64,176][i],top:216});}
    await sharp({create:{width:768,height:408,channels:3,background:backgrounds.green}}).composite(parts).png().toFile(path.join(root,`${qa}/${pose.id}-v${pose.version}-review.png`));
  }
  const manifest=read('expeditions/v2/art/manifest.json'),ids=new Set();
  const {orchardArtFor}=await import('../../expeditions/v2/art/renderer.js'),anchorTiles=[];
  for(const [i,pose]of ['idle','rear','action','exhausted'].entries()){
    const state={blueprint:{enemies:[]},events:pose==='rear'?[{type:'hero-moved',heroId:'wicker',from:'0,1',to:'0,0'}]:[]},entity={id:'wicker',kind:'hero',hp:5,ap:pose==='exhausted'?0:1,...(pose==='action'?{holding:'shape'}:{})};
    const art=orchardArtFor(entity,state),png=`data:image/png;base64,${(await sharp(Buffer.from(art.url.split(',')[1],'base64')).png().toBuffer()).toString('base64')}`;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180"><rect width="240" height="180" fill="#577249"/><ellipse cx="120" cy="120" rx="22" ry="9" fill="#102c2580"/><image href="${png}" x="${120-art.anchor[0]*art.scale}" y="${120-art.anchor[1]*art.scale}" width="${art.width*art.scale}" height="${art.height*art.scale}"/><path d="M100,120h40m-20,-10v20" stroke="#fff" fill="none"/><text x="8" y="158" fill="#fff" font-size="12">${pose}: ${art.fallback?'idle fallback':'selected'}</text></svg>`;
    anchorTiles.push({input:await sharp(Buffer.from(svg)).png().toBuffer(),left:i*240,top:0});
  }
  await sharp({create:{width:960,height:180,channels:3,background:'#577249'}}).composite(anchorTiles).png().toFile(path.join(root,`${qa}/wicker-anchor-composition.png`));
  const bankRoot='docs/expeditions/v2/certification/four-locks/displaced-v1',bank=read(`${bankRoot}/bank-manifest.json`);
  for(const entry of bank.entries)for(const trace of read(`${bankRoot}/${entry.source}/traces.json`))for(const id of trace.cardIds)ids.add(id);
  const line=poses=>Object.entries(poses).map(([state,id])=>`${state}: ${manifest.assets[id]?'selected for private QA':id==='hero-dapple-action'?'withheld; idle fallback':'candidate; idle fallback'}`).join('; ');
  const rows=Object.entries(delivery.characters).map(([hero,poses])=>`| ${hero}${ids.has(hero)?' (certified team)':''} | ${line(poses)} |`);
  const enemies=Object.entries(delivery.enemies).map(([enemy,poses])=>`| ${enemy} | ${line(poses)} |`);
  fs.writeFileSync(path.join(root,'docs/expeditions/v2/art-coverage.md'),`# Orchard selected state coverage\n\nIsolated candidate/selection inventory, 2 October 2026. No live renderer acceptance. ${Object.keys(manifest.assets).length} selected assets/${manifest.selectedBytes} bytes. Certified bank trace IDs: ${[...ids].sort().join(', ')}. Dapple action remains withheld with explicit idle fallback. Wicker repaired states are selected only after exact-hash/fragment/scale preflight; original clipped candidates are retained. No new enemy factions or carry imports.\n\n| Hero | Pose coverage |\n| --- | --- |\n${rows.join('\n')}\n\n| Enemy | State coverage |\n| --- | --- |\n${enemies.join('\n')}\n\nIllustrated plinth normal/damaged remain withheld; exact StationGlyph interim remains. ASSET-03/04/05 have no newly established renderer gap; code/reuse remain pending live review.\n`);
  console.log(JSON.stringify({qa,limitation:'Actual React component SSR exported through SVG/PNG; isolated composition only, not integrated App screenshots.'}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
