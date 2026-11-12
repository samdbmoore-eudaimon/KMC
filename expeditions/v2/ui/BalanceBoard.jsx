import React from 'react';
import {projectHex} from './viewport.js';
import {placeStationLabels} from './station-labels.js';

export function displayedPanTotal(puzzle,content,pan){
  const loads=puzzle.loads.filter(load=>content.assignments[load.id]===pan);
  const values=loads.map(load=>load.visible?load.value:content.inferredValue);
  const total=values.reduce((sum,value)=>sum+(value??0),0);
  return values.some(value=>value==null)?`${total} + ?`:String(total);
}
export default function BalanceBoard({state,zoom=1,camera={x:0,y:0},size={width:1000,height:1000},overlays=[]}){
  const puzzle=state.blueprint.puzzle;if(puzzle.kind!=='balance'||!puzzle.panStationIds||zoom<0.7)return null;
  const active=state.puzzleActive.content,draft=state.puzzleDraft.content;
  const items=['left','right'].flatMap(pan=>{
      const station=state.blueprint.stations.find(item=>item.id===puzzle.panStationIds[pan]);if(!station)return null;
      const p=projectHex(station.hex),name=pan==='left'?'Left pan':'Right pan',committed=displayedPanTotal(puzzle,active,pan),planned=displayedPanTotal(puzzle,draft,pan);
      return [{id:station.id,hex:station.hex,x:p.x*zoom+camera.x,y:p.y*zoom+camera.y,width:160,height:38,label:`${name}: committed ${committed}, draft ${planned}, target ${puzzle.target}`,line:`${name}: ${committed} / ${puzzle.target}`,draft:`Draft: ${planned}`}];
    }).filter(Boolean);
  for(const id of ['number',puzzle.controlId].filter(Boolean)){
      const station=state.blueprint.stations.find(item=>item.id===id);if(!station)continue;
      const p=projectHex(station.hex),totals=content=>`L ${displayedPanTotal(puzzle,content,'left')} · R ${displayedPanTotal(puzzle,content,'right')}`;
      items.push({id,summary:true,hex:station.hex,x:p.x*zoom+camera.x,y:p.y*zoom+camera.y,width:160,height:38,label:`Shared pan totals at ${station.name||id}: committed ${totals(active)}, draft ${totals(draft)}, target ${puzzle.target}`,line:`${totals(active)} / ${puzzle.target}`,draft:`Draft: ${totals(draft)}`});
  }
  return <g pointerEvents="none" data-balance-pans="world">
    {placeStationLabels(items,size.width,size.height,overlays).map(item=>{
      const anchor=items.find(entry=>entry.id===item.id);
      return <g key={item.id} data-pan-station={item.summary?undefined:item.id} data-pan-summary={item.summary?item.id:undefined} data-pan-hex={item.hex} aria-label={item.label}>
        <path d={`M${anchor.x},${anchor.y}L${item.x+item.width/2},${item.y}`} stroke="#e8d29a" strokeWidth="1.5"/>
        <g transform={`translate(${item.x} ${item.y})`}><rect width={item.width} height={item.height} rx="5" fill="#203d2af2" stroke="#e8d29a"/>
        <text x={item.width/2} y="15" textAnchor="middle" fontSize="12" fill="#fff4d1">{item.line}</text>
        <text x={item.width/2} y="30" textAnchor="middle" fontSize="11" fill="#fff4d1">{item.draft}</text></g>
      </g>;
    })}
  </g>;
}
