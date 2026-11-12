const fs=require('node:fs');
const sharp=require('sharp');
const out='docs/expeditions/v2/evidence/river-hex-assembly';
fs.mkdirSync(out,{recursive:true});
const root='assets/expeditions/production/9fo/v2/river-art-batch/runtime/';
const uri=p=>'data:image/webp;base64,'+fs.readFileSync(p).toString('base64');
const straight=uri(root+'po-river-straight-surface-v3.webp'),bend=uri(root+'po-river-bend-gentle-surface-v3.webp'),walls=uri(root+'po-river-raised-front-walls-reuse-v1.webp');
const grass=uri('assets/expeditions/production/9fo/runtime/terrain/po-terrain-hex-grass-v3.webp');
const dirs=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],steps=[0,0,0,1,1,0,0,5,5];
const route=[[0,0]];for(const e of steps){const a=route.at(-1);route.push([a[0]+dirs[e][0],a[1]+dirs[e][1]]);}
const river=new Map(route.map((p,i)=>{const edges=[i?((steps[i-1]+3)%6):3,i<steps.length?steps[i]:0];let kind,turn;for(const [k,base] of [['straight',[3,0]],['bend',[3,1]]])for(let t=0;t<6;t++)if(base.map(e=>(e+t)%6).sort().join()===edges.slice().sort().join()){kind=k;turn=t;}if(!kind)throw Error('Unsupported bend');return [p.join(','),{kind,turn}];}));
const S=100,H=Math.sqrt(3)*S/2,scale=S/162,depth=36*scale;
const xy=(q,r)=>[Math.sqrt(3)*S*(q+r/2),1.5*S*r];
const tiles=[];for(let r=-2;r<=4;r++)for(let q=-3;q<=9;q++){const [x,y]=xy(q,r);if(x>=0&&x<=7*Math.sqrt(3)*S)tiles.push({q,r,x,y,key:`${q},${r}`});}
const occupied=new Set(tiles.map(t=>t.key));
const vertices=[[0,-S],[H,-S/2],[H,S/2],[0,S],[-H,S/2],[-H,-S/2]];
const points=(x,y)=>vertices.map(v=>`${x+v[0]},${y+v[1]}`).join(' ');
let defs='',sideLayers='',tops='';
for(const [i,t]of tiles.entries()){
 const [x,y]=[t.x,t.y],id='h'+i;defs+=`<clipPath id="${id}"><polygon points="${points(x,y)}"/></clipPath>`;
 for(const [e,a,b]of [[1,2,3],[2,3,4]]){const d=dirs[e];if(occupied.has(`${t.q+d[0]},${t.r+d[1]}`))continue;const A=vertices[a],B=vertices[b],face=`${x+A[0]},${y+A[1]} ${x+B[0]},${y+B[1]} ${x+B[0]},${y+B[1]+depth} ${x+A[0]},${y+A[1]+depth}`;defs+=`<clipPath id="${id}w${e}"><polygon points="${face}"/></clipPath>`;sideLayers+=`<image href="${walls}" x="${x-192*scale}" y="${y+65*scale}" width="${384*scale}" height="${160*scale}" clip-path="url(#${id}w${e})"/>`;}
 const water=river.get(t.key);
 if(water)tops+=`<image href="${water.kind==='straight'?straight:bend}" x="${x-192*scale}" y="${y-192*scale}" width="${384*scale}" height="${384*scale}" transform="rotate(${water.turn*60} ${x} ${y})"/>`;
 else tops+=`<svg x="${x-H}" y="${y-S}" width="${2*H}" height="${2*S}" viewBox="28 26 328 248" preserveAspectRatio="xMidYMid slice" clip-path="none"><image href="${grass}" width="384" height="384"/></svg>`;
 tops+=`<polygon points="${points(x,y)}" fill="none" stroke="#51442e" stroke-opacity=".38" stroke-width="1.2"/>`;
}
// Each grass image needs a world-space clip; nested SVG preserves painted texture only.
let cursor=0;tops=tops.replace(/<svg x=/g,()=>`<svg data-grass="${cursor++}" x=`);
// Build the tops independently so each image's clip stays in world coordinates.
tops='';for(const [i,t]of tiles.entries()){const water=river.get(t.key),x=t.x,y=t.y;tops+=`<g clip-path="url(#h${i})">`+(water?`<image href="${water.kind==='straight'?straight:bend}" x="${x-192*scale}" y="${y-192*scale}" width="${384*scale}" height="${384*scale}" transform="rotate(${water.turn*60} ${x} ${y})"/>`:`<svg x="${x-H}" y="${y-S}" width="${2*H}" height="${2*S}" viewBox="28 26 328 248" preserveAspectRatio="xMidYMid slice"><image href="${grass}" width="384" height="384"/></svg>`)+`</g><polygon points="${points(x,y)}" fill="none" stroke="#51442e" stroke-opacity=".35" stroke-width="1"/>`;}
const width=1500,height=1040;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs>${defs}<radialGradient id="bg"><stop stop-color="#66754b"/><stop offset="1" stop-color="#273f31"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#bg)"/><g transform="translate(145 315) scale(1 .68)">${sideLayers}${tops}</g></svg>`;
async function render(){let rendered=svg;for(const original of [straight,bend,walls,grass]){const png=await sharp(Buffer.from(original.split(',')[1],'base64')).png().toBuffer();rendered=rendered.split(original).join('data:image/png;base64,'+png.toString('base64'));}fs.writeFileSync(out+'/river-hex-map.svg',rendered);await sharp(Buffer.from(rendered)).png().toFile(out+'/river-hex-map.png');} 
render().then(()=>console.log(JSON.stringify({path:out+'/river-hex-map.png',tiles:tiles.length,straight:[...river.values()].filter(t=>t.kind==='straight').length,bends:[...river.values()].filter(t=>t.kind==='bend').length}))).catch(e=>{console.error(e);process.exitCode=1;});

