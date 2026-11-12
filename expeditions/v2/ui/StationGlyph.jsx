import React from 'react';

const top=Array.from({length:6},(_,i)=>{const angle=(-90+i*60)*Math.PI/180;return [26*Math.cos(angle),26*Math.sin(angle)];});
const points=vertices=>vertices.map(p=>p.join(',')).join(' ');

export default function StationGlyph({entity,state,x,y}) {
  const job=entity.id==='alcove'?'shape':entity.id,definition=state.blueprint.stations.find(s=>s.id===job),station=state.stationStates[job];
  const held=Boolean(state.holds[entity.id]),damaged=station&&station.integrity<definition.maxIntegrity,charged=station&&station.charge>=definition.capacity;
  const edge=damaged?'#ad6451':held?'#fff0a1':charged?'#bce1a4':'#997b40',surface=damaged?'#bdb094':'#e3d1a2';
  return <g transform={`translate(${x} ${y-12})`}>
    <polygon points={points([top[2],top[3],top[4],[top[4][0],top[4][1]+10],[top[3][0],top[3][1]+10],[top[2][0],top[2][1]+10]])} fill="#705b39" stroke="#403b29" strokeWidth="2"/>
    <polygon points={points(top)} fill={surface} stroke={edge} strokeWidth="3"/>
    {entity.id==='control'?<g stroke="#6e643e" strokeWidth="2" fill="#f4e8bf"><rect x="-16" y="-20" width="32" height="34" rx="2"/>{[-8,0,8].map(n=><React.Fragment key={n}><path d={`M${n},-20v34 M-16,${n-4}h32`}/></React.Fragment>)}</g>:job==='number'?<g stroke="#665337" strokeWidth="2.5" fill="#bb9650"><rect x="-15" y="-19" width="30" height="31" rx="4"/><rect x="-10" y="-14" width="20" height="12" rx="2" fill="#f4e7b9"/><path d="M-8,6H8 M0,6v12"/><circle cy="-8" r="3" fill="#648151"/></g>:job==='shape'?<g stroke="#6d5436" strokeWidth="5" fill="#e9c67c" strokeLinecap="round"><path d="M-17,14V-15M17,14V-15M-17,-15H17M-17,14L17,-15"/><circle cx="-17" cy="14" r="4"/><circle cx="17" cy="-15" r="4"/></g>:<g fill="none" stroke="#6e5a38" strokeWidth="4" strokeLinecap="round"><path d="M0,-13V14M0,2Q-16,0 -17,-13 M0,5Q16,-2 17,-13 M0,12L-15,20M0,12L14,20"/><path d="M-17,-13q0,-11 10,-7q0,10 -10,7 M17,-13q0,-11 -10,-7q0,10 10,7" fill="#72954c" stroke="#49663b" strokeWidth="2"/></g>}
    {entity.id==='alcove'&&<path d="M-23,9V-8Q0,-38 23,-8V9" fill="none" stroke="#61714b" strokeWidth="4"/>}
    {damaged&&<path d="M-10,-23l7,10 -5,5 7,8" stroke="#745044" strokeWidth="2" fill="none"/>}
    {held&&<circle cy="30" r="5" fill="#fff0a1" stroke="#596b42" strokeWidth="2"/>}
  </g>;
}
