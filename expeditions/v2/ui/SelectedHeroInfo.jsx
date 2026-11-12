import React from 'react';
import {projectHex} from './viewport.js';
import {placeSelectedInfo,selectedHeroInfo} from './selected-info.js';
export default function SelectedHeroInfo({state,selectedHero,camera,size,entities,artFor,overlays=[]}) {
  const info=selectedHeroInfo(state,selectedHero);if(!info)return null;
  const p=projectHex(info.hero.position),anchor={x:p.x*camera.scale+camera.x,y:p.y*camera.scale+camera.y};
  const figures=entities.filter(e=>e.kind==='hero'||e.kind==='enemy').map(e=>{
    const point=projectHex(e.hex),sprite=artFor?.(e,state);
    const bounds=sprite?.visibleBounds||[0,0,sprite?.width||50,sprite?.height||90];
    return {x:(point.x+(sprite?.groundOffset?.[0]||0)+(sprite?(bounds[0]-sprite.anchor[0])*sprite.scale:-25))*camera.scale+camera.x,y:(point.y+(sprite?.groundOffset?.[1]||0)+(sprite?(bounds[1]-sprite.anchor[1])*sprite.scale:-60))*camera.scale+camera.y,width:(sprite?(bounds[2]-bounds[0])*sprite.scale:50)*camera.scale,height:(sprite?(bounds[3]-bounds[1])*sprite.scale:90)*camera.scale};
  });
  const box=placeSelectedInfo(anchor,size,overlays,figures);if(!box)return null;
  return <g pointerEvents="none" role="status" aria-label={info.label} data-selected-hero-info={selectedHero} data-control-overlap={box.controlOverlap} data-figure-overlap={box.figureOverlap}>
    <path d={`M${anchor.x},${anchor.y}L${box.x+box.width/2},${box.y+box.height/2}`} stroke="#fff0bb" strokeWidth="1.5"/>
    <g transform={`translate(${box.x} ${box.y})`}><rect width={box.width} height={box.height} rx="7" fill="#18372afc" stroke="#fff0bb" strokeWidth="2"/>
      <text x={box.width/2} y="16" textAnchor="middle" fontSize={box.compact?12:13} fill="#fff4d1"><tspan fontWeight="bold">{info.name}</tspan><tspan x={box.width/2} y={box.compact?32:34} fontSize={box.compact?11:13}>{box.compact?`${info.hero.hp} ♥ ${info.hero.ap} AP${info.condition==='Holding'?' Hold':info.condition==='Down'?' Down':''}`:info.health}</tspan>{!box.compact&&<tspan x={box.width/2} y="50" fill="#ffe69f">{info.condition}</tspan>}</text>
    </g>
  </g>;
}
