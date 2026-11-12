import React from 'react';
import EquationWheel from '../art/EquationWheel.jsx';
import {projectHex,polygonPoints} from './viewport.js';
import {activeFace,validateRotation} from '../puzzles/rotation.js';
import {memberProtection} from '../rules.js';

const colours=['#ffe39d','#8bded0','#f1b2c0','#b6c9fa','#d8d390'];
const glyph=value=>value===null?'blank':String(value);
function expression(ast){return ast.type==='number'?String(ast.value):`(${expression(ast.left)} ${ast.op} ${expression(ast.right)})`;}
export function rotationTrackText(puzzle,content,track){
  const result=validateRotation(puzzle,content).tracks[track.id];
  if(result?.valid)return `${expression(result.ast.left)} = ${expression(result.ast.right)}: ${result.powered?'true':'not equal'}`;
  const values=track.tokenIds.map(id=>{const t=puzzle.tokens.find(t=>t.id===id);return glyph(t.faces?activeFace(t.faces,content.orientations[id]??t.orientation):t.value);});
  return `${values.join(' ')}: ${result?.reason==='rotation-equals-count'?'needs exactly one equals sign':result?.reason==='rotation-zero-division'?'cannot divide by zero':result?.reason==='rotation-inexact-division'?'division must give a whole number':result?.reason==='rotation-intermediate-range'?'each result must stay between 0 and 100':'complete the numbers and operators'}`;
}

export default function RotationBoard({state,selectedId}){
  if(state.blueprint.puzzle.kind!=='equation-wheels')return null;
  const puzzle=state.blueprint.puzzle,content=state.puzzleDraft.content;
  const draft=validateRotation(puzzle,content);
  const committed=state.events.findLast(event=>event.type==='puzzle-committed')?.seq??Infinity,altered=new Set(state.events.filter(event=>event.seq>committed&&['puzzle-disrupted','hazard-mutation'].includes(event.type)).map(event=>event.memberId));
  return <g pointerEvents="none" data-equation-network="draft">
    {puzzle.tracks.map((track,i)=><g key={track.id} data-equation-track={track.id} aria-label={`${track.id}: ${rotationTrackText(puzzle,content,track)}; ${state.activeOutputs[track.id]?'active circuit':'circuit off'}`}><polyline points={track.tokenIds.map(id=>{const p=projectHex(puzzle.tokens.find(t=>t.id===id).hex);return `${p.x},${p.y}`;}).join(' ')} fill="none" stroke="#172f25" strokeWidth="9"/><polyline points={track.tokenIds.map(id=>{const p=projectHex(puzzle.tokens.find(t=>t.id===id).hex);return `${p.x},${p.y}`;}).join(' ')} fill="none" stroke={colours[i]} strokeWidth="4" strokeDasharray={draft.tracks[track.id]?.powered?undefined:'7 4'}/></g>)}
    {puzzle.tokens.map(token=>{const p=projectHex(token.hex),orientation=content.orientations[token.id]??token.orientation;
      return token.faces?<g key={token.id} data-equation-wheel={token.id} data-wheel-orientation={orientation}><EquationWheel faces={token.faces} rotation={-orientation} diameter={60} x={p.x} y={p.y} label={`Wheel ${token.id}`} appearance={selectedId===token.id?'selected':altered.has(token.id)?'jammed':memberProtection(state,[`wheel-${token.id}`,puzzle.networkGroupId],{wide:true})>=3+state.blueprint.tier?'locked':'neutral'}/><circle cx={p.x} cy={p.y} r="11" fill="#f9ecc7" stroke="#294731"/><text x={p.x} y={p.y+5} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#203e30">{glyph(activeFace(token.faces,orientation))==='blank'?'·':glyph(activeFace(token.faces,orientation))}</text><text x={p.x} y={p.y+36} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff2c6">{token.id}</text></g>:<g key={token.id} data-equation-plate={token.id}><polygon points={polygonPoints(token.hex)} fill="#e9d5a088" stroke="#75633e"/><rect x={p.x-23} y={p.y-17} width="46" height="34" rx="6" fill="#fff0c8" stroke="#64563a"/><text x={p.x} y={p.y+7} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#243d2c">{glyph(token.value)}</text>{puzzle.tracks.filter(track=>track.tokenIds.at(-1)===token.id).map((track,i)=><text key={track.id} x={p.x} y={p.y+32+i*12} fontSize="12" textAnchor="middle" fill="#fff2c6">{track.id}</text>)}</g>;
    })}
  </g>;
}

export function RotationControls({state,wheelId,onEdit,onClose}){
  const puzzle=state.blueprint.puzzle,token=puzzle.tokens.find(t=>t.id===wheelId);if(!token?.faces||token.given)return null;
  const content=state.puzzleDraft.content,orientation=content.orientations[wheelId];
  const active=state.puzzleActive.content.orientations[wheelId],tracks=puzzle.tracks.filter(track=>track.tokenIds.includes(wheelId));
  return <section style={{padding:8,background:"#f0e4be",color:"#243d2c",borderRadius:10}} className="ov-wheel-controls" aria-label={`Turn wheel ${wheelId}`}><strong>Wheel {wheelId}: draft {glyph(activeFace(token.faces,orientation))}</strong><small>On the map: {glyph(activeFace(token.faces,active))}. Turning the draft is free; activation uses 1 action beside {puzzle.controlHex}.</small><div className="ov-row"><button aria-label={`Turn ${wheelId} anticlockwise`} onClick={()=>onEdit({type:'rotate-wheel',wheelId,delta:-1})}>↶ Anticlockwise</button><button aria-label={`Turn ${wheelId} clockwise`} onClick={()=>onEdit({type:'rotate-wheel',wheelId,delta:1})}>Clockwise ↷</button><button onClick={onClose}>Close wheel</button></div><small>Six faces: {token.faces.map(glyph).join(' · ')}. Read the face under the fixed top notch.</small>{tracks.map(track=><p key={track.id}>{track.id}: {rotationTrackText(puzzle,content,track)}</p>)}<small>Shared wheel: all linked equations change together. Parentheses show the order; division must give a whole number.</small></section>;
}

