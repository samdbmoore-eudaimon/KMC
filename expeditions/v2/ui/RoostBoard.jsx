import React from 'react';
import {projectHex,polygonPoints} from './viewport.js';
import {nonogramHooks} from '../puzzles/nonogram.js';

export default function RoostBoard({state,zoom=1}){
  const puzzle=state.blueprint.puzzle;if(puzzle.kind!=='nonogram5'||!puzzle.perches)return null;
  const occupied=nonogramHooks.sectorFill(puzzle,state.puzzleActive.content);
  return <g pointerEvents="none" data-roost-perches="world">
    {puzzle.perches.map(perch=>{
      const beam=state.blueprint.outputs.some(output=>output.effect.kind==='beam'&&output.effect.sector===perch.sector&&state.activeOutputs[output.id]),p=projectHex(perch.hex);
      const status=beam?'Beam active':occupied[perch.sector]?'Nest exposed':'Nest empty';
      return <g key={perch.sector} data-roost-perch={perch.sector} data-perch-hex={perch.hex} data-beam-active={beam} aria-label={`${perch.sector} perch at ${perch.hex}: ${status}`}>
        <polygon points={polygonPoints(perch.hex)} fill={beam?'#f2dc7544':'#b3745422'} stroke={beam?'#ffe7a0':'#dca480'} strokeWidth="3" strokeDasharray={beam?undefined:'4 4'} vectorEffect="non-scaling-stroke"/>
        {zoom>=0.7&&<g transform={`translate(${p.x} ${p.y+22}) scale(${1/zoom})`}><rect x="-64" y="0" width="128" height="34" rx="5" fill="#203d2af2"/><text x="0" y="14" textAnchor="middle" fontSize="12" fill="#fff4d1">{perch.sector} perch</text><text x="0" y="28" textAnchor="middle" fontSize="11" fill="#fff4d1">{status}</text></g>}
      </g>;
    })}
  </g>;
}
