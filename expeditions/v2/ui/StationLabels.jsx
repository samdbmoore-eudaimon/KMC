import React from 'react';
import {projectHex} from './viewport.js';
import {stationPresentation} from './station-state.js';
import {placeStationLabels} from './station-labels.js';
export default function StationLabels({state,camera,size,entities,artFor,activeStationId,overlays=[],onActions,onDismiss,onHover}) {
  const figures=entities.filter(e=>e.kind!=='station').map(e=>{const p=projectHex(e.hex),sprite=artFor?.(e,state);return {x:(p.x+(sprite?.groundOffset?.[0]||0)-(sprite?sprite.anchor[0]*sprite.scale:25))*camera.scale+camera.x,y:(p.y+(sprite?.groundOffset?.[1]||0)-(sprite?sprite.anchor[1]*sprite.scale:60))*camera.scale+camera.y,width:(sprite?sprite.width*sprite.scale:50)*camera.scale,height:(sprite?sprite.height*sprite.scale:90)*camera.scale};});
  const items=state.blueprint.stations.filter(st=>st.id===activeStationId).flatMap(st=>{
    if(!artFor?.({...st,kind:'station'},state))return [];
    const p=projectHex(st.hex),view=stationPresentation(state,st.id),lines=view.lines;
    const width=Math.max(128,Math.min(196,Math.max(st.name.length,...lines.map(line=>line.length))*6.2+14));
    return [{id:st.id,name:st.name,lines,label:view.label,damaged:view.damaged||view.corrupted,held:!!view.holder,x:p.x*camera.scale+camera.x,y:p.y*camera.scale+camera.y,width:Math.max(180,width),height:68+lines.length*15}];
  });
  const reserved=[...figures,...overlays];
  const labels=placeStationLabels(items,size.width,size.height,reserved);
  return <g data-station-label-layer="screen">{labels.map(item=>{const colour=item.damaged?'#f2a178':item.held?'#ffe69f':'#e3efc0',station=state.blueprint.stations.find(s=>s.id===item.id);return <g key={item.id} id={`ov-station-tooltip-${item.id}`} role="tooltip" aria-label={item.label} data-station-popup={item.id} onPointerEnter={()=>onHover?.(station)} onPointerLeave={()=>onHover?.(null)} onPointerMove={event=>event.stopPropagation()} onPointerDown={event=>event.stopPropagation()} onPointerUp={event=>event.stopPropagation()}><path pointerEvents="none" d={`M${item.x+item.width/2},${item.y}L${projectHex(station.hex).x*camera.scale+camera.x},${projectHex(station.hex).y*camera.scale+camera.y}`} stroke={colour} strokeWidth="1.5"/><rect x={item.x} y={item.y} width={item.width} height={item.height} rx="7" fill="#18372afc" stroke={colour}/><text pointerEvents="none" x={item.x+item.width/2} y={item.y+17} textAnchor="middle" fontSize="12" fill="#fff4d1"><tspan fontWeight="bold">{item.name}</tspan>{item.lines.map((line,i)=><tspan key={line} x={item.x+item.width/2} y={item.y+34+i*15}>{line}</tspan>)}</text><foreignObject x={item.x+5} y={item.y+item.height-45} width={item.width-10} height="42"><div style={{display:'flex',gap:4}}><button aria-label={`Actions at ${item.name}`} onClick={()=>onActions?.({...station,kind:'station'})} style={{flex:1,minHeight:40,padding:5,borderRadius:5,background:'#f6e8bb',color:'#243c2d',fontSize:12}}>Actions here</button><button aria-label="Close station tooltip" onClick={onDismiss} style={{minHeight:40,padding:5,borderRadius:5,background:'#f6e8bb',color:'#243c2d',fontSize:12}}>Close</button></div></foreignObject></g>;})}</g>;
}
