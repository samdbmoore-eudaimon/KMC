import React from 'react';
import {SIDE,projectHex,hexVertices} from './viewport.js';
import {exposedFrontEdges} from './river-layout.js';
import manifest from '../art/river-manifest.json' with {type:'json'};
import {ORCHARD_RIVER_ART} from '../art/river-art.js';
import {fitSpriteInHex} from '../art/placement.js';
const find=prefix=>Object.values(manifest.assets).find(a=>a.id.startsWith(prefix));
export function RiverSurface({layout}) {
  if(!layout?.kind)return null;
  const asset=find(`po-river-${layout.kind==='bend'?'bend-gentle':'straight'}-surface`),p=projectHex(layout.hex),scale=SIDE/asset.side;
  return <g pointerEvents="none" data-river-hex={layout.hex} data-river-rotation={layout.rotation} data-river-mouths={layout.mouths.join(',')} data-river-candidate={asset.id} transform={`translate(${p.x} ${p.y}) rotate(${layout.rotation}) scale(${scale})`}><image href={ORCHARD_RIVER_ART[asset.id]} x={-asset.centre[0]} y={-asset.centre[1]} width={asset.width} height={asset.height}/></g>;
}
export function PaintedWalls({tile,tiles}) {
  const edges=exposedFrontEdges(tile,tiles);if(!edges.length)return null;
  const asset=find('po-river-raised-front-walls'),scale=SIDE/162,p=projectHex(tile),v=hexVertices(tile),depth=36*scale,id=`ov-wall-${tile.q}-${tile.r}`;
  return <g pointerEvents="none" data-painted-wall="fixed"><defs><clipPath id={id}>{edges.map(e=>{const a=v[e+1],b=v[(e+2)%6];return <polygon key={e} points={`${a.x},${a.y} ${b.x},${b.y} ${b.x},${b.y+depth} ${a.x},${a.y+depth}`}/>;})}</clipPath></defs><image clipPath={`url(#${id})`} href={ORCHARD_RIVER_ART[asset.id]} x={p.x-asset.topCentre[0]*scale} y={p.y-asset.topCentre[1]*scale} width={asset.width*scale} height={asset.height*scale}/></g>;
}
export function RiverBridge({hex,closed=false,closingPending=false}) {
  const asset=find('po-river-timber-bridge'),p=projectHex(hex),{scale,anchor}=fitSpriteInHex(asset,SIDE);
  if(closed)return <g pointerEvents="none" data-river-bridge="raised" data-bridge-hex={hex} transform={`translate(${p.x} ${p.y})`}><title>Bridge raised: activate the number lock to lower it</title><ellipse cy="9" rx="24" ry="9" fill="#102e3944"/>{[-1,1].map(direction=><g key={direction} transform={`scale(${direction} 1)`}><path d="M7,18 L24,13 L21,-19 L8,-25 Z" fill="#a7854b" stroke="#493b27" strokeWidth="2"/><path d="M8,-17 L21,-12 M8,-9 L22,-4 M8,-1 L23,4 M8,7 L24,12" stroke="#e7c98a" strokeWidth="2"/><path d="M7,18 L5,-27 M24,13 L23,-20" stroke="#473d2d" strokeWidth="3"/><circle cx="8" cy="18" r="3" fill="#edd79a"/></g>)}<path d="M-6,-3 L6,9 M6,-3 L-6,9" stroke="#ffcfac" strokeWidth="3"/></g>;
  return <g pointerEvents="none" data-river-bridge={closingPending?'closing-pending':'upright'} data-bridge-hex={hex}><title>{closingPending?'Bridge stays lowered until occupying figures leave':'Bridge lowered'}</title><image href={ORCHARD_RIVER_ART[asset.id]} x={p.x-anchor[0]*scale} y={p.y-anchor[1]*scale} width={asset.width*scale} height={asset.height*scale}/></g>;
}
