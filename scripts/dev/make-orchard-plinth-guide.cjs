const sharp=require('sharp');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const side=160,centre=[192,168],vertices=Array.from({length:6},(_,i)=>{const angle=(-90+i*60)*Math.PI/180;return [centre[0]+side*Math.cos(angle),centre[1]+side*Math.sin(angle)];});
const points=rows=>rows.map(p=>p.join(',')).join(' ');
const front=[vertices[2],vertices[3],vertices[4],[vertices[4][0],vertices[4][1]+40],[vertices[3][0],vertices[3][1]+40],[vertices[2][0],vertices[2][1]+40]];
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="1280" viewBox="0 0 384 384"><polygon points="${points(front)}" fill="#91774c" stroke="#5c4d35" stroke-width="3"/><polygon points="${points(vertices)}" fill="#eedfc0" stroke="#b18c47" stroke-width="7" stroke-linejoin="round"/></svg>`;
sharp(Buffer.from(svg)).png().toFile(path.join(root,'assets/expeditions/production/9fo/v2/source/po-plinth-geometry-guide.png')).then(()=>console.log(JSON.stringify({topCentre:centre,side,vertices,width:Math.sqrt(3)*side,height:2*side,sourceScale:1280/384}))).catch(error=>{console.error(error);process.exitCode=1;});
