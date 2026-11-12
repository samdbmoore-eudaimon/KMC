import React from 'react';
import {ORCHARD_V2_ART} from './runtime-art.js';
import {WHEEL_GEOMETRY,WHEEL_STATES,wheelSlots,wheelSector} from './wheel-geometry.js';

export default function EquationWheel({faces=[],rotation=0,appearance='neutral',x=0,y=0,diameter=84,label='Equation wheel'}){
  if(!WHEEL_STATES.includes(appearance)||faces.length!==0&&faces.length!==6)throw Error('Invalid wheel appearance or face count');
  const slots=wheelSlots(rotation),active=((rotation%6)+6)%6,colour={neutral:'#967745',selected:'#fff1a2',locked:'#397058',jammed:'#ad513e'}[appearance];
  return <g transform={`translate(${x} ${y}) scale(${diameter/WHEEL_GEOMETRY.visibleDiameter}) translate(-256 -256)`} pointerEvents="none" role="img" aria-label={`${label}: ${appearance}; active face ${faces[active]==null||faces[active]===''?'blank':faces[active]}`} data-wheel-state={appearance}>
    <g data-wheel-layer="inner" transform={`rotate(${-rotation*60} 256 256)`}>
      <image href={ORCHARD_V2_ART['equation-frame']} width="512" height="512"/>
      {Array.from({length:6},(_,i)=><path key={i} d={wheelSector(i)} fill={appearance==='jammed'?'#ad513e20':appearance==='locked'?'#39705818':'none'} stroke={appearance==='selected'?'#fff1a2':'#927341'} strokeWidth={appearance==='selected'?4:1}/>) }
    </g>
    {appearance!=='neutral'&&<circle cx="256" cy="256" r="191" fill="none" stroke={colour} strokeWidth="6" strokeDasharray={appearance==='jammed'?'12 8':undefined}/>}
    <g data-wheel-layer="glyphs" fill="#263b2e" fontFamily="sans-serif" fontSize="44" fontWeight="700" textAnchor="middle" dominantBaseline="central">
      {slots.map(slot=><text key={slot.index} x={slot.x} y={slot.y} fontSize={Math.min(44,56/Math.max(1,String(faces[slot.index]??'').length))} data-face-index={slot.index}>{faces[slot.index]??''}</text>)}
    </g>
    <g data-wheel-layer="fixed-pointer"><path d="M244,94H268L256,118Z" fill="#263b2e" stroke="#fff0bc" strokeWidth="3"/></g>
    {appearance==='locked'&&<g fill="#397058" stroke="#f7edc9" strokeWidth="3"><rect x="241" y="247" width="30" height="24" rx="4"/><path d="M247,247v-8a9,9 0 0 1 18,0v8" fill="none"/></g>}
    {appearance==='jammed'&&<path d="M244,244l24,24m0,-24l-24,24" stroke="#ad513e" strokeWidth="7" strokeLinecap="round"/>}
  </g>;
}
