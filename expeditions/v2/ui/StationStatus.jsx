import React from 'react';
import {ORCHARD_STATION_ART} from '../art/station-art.js';
import {stationPresentation,stationCuePositions} from './station-state.js';
import {polygonPoints} from './viewport.js';

export default function StationStatus({state,entity,sprite,x,y,zoom,layer='cues',detailed=false}) {
  const view=stationPresentation(state,entity.id);if(!view)return null;
  if(layer==='damage')return view.damaged?<path d={`M${x-8},${y-12}l4,6 -3,5 5,7`} stroke="#ffe3bc" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"/>:null;
  const colour=view.damaged||view.corrupted?'#f2a178':view.holder?'#ffe69f':'#e3efc0';
  const ready=view.cues.filter(c=>c==='ready'||c==='prepared'),warning=view.cues.filter(c=>c==='damage'||c==='corrupted');
  const all=[...ready,...view.cues.filter(c=>c==='working'),...warning],visible=detailed?all:warning.length?[warning[0]]:view.holder?['working']:ready.slice(0,1);
  const positions=stationCuePositions(sprite,visible,zoom);
  return <g role="img" aria-label={view.label} data-station-id={entity.id} data-station-cues={view.cues.join(' ')}>
    <title>{view.label}</title>
    {(view.damaged||view.corrupted||view.holder)&&<polygon points={polygonPoints(entity.hex)} fill="none" stroke={colour} strokeWidth="2.5" strokeDasharray={view.damaged||view.corrupted?'5 3':undefined} vectorEffect="non-scaling-stroke"/>}
    {visible.map(cue=>{const p=positions[cue];return <g key={cue} transform={`translate(${x+p[0]} ${y+p[1]}) scale(${1/zoom})`}><image href={ORCHARD_STATION_ART[`station-cue-${cue}-v1`]} x="-6" y="-6" width="12" height="12"/></g>;})}
  </g>;
}
