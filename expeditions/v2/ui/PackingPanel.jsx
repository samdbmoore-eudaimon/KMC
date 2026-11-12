import PaintedButton from './PaintedButton.jsx';
import React,{useState} from 'react';
import {transformedCells,validatePacking} from '../puzzles/packing.js';

const point=id=>{const [q,r]=id.split(',').map(Number);return {x:Math.sqrt(3)*32*(q+r/2),y:48*r};};
const polygon=({x,y})=>Array.from({length:6},(_,i)=>{const angle=(-90+i*60)*Math.PI/180;return `${x+32*Math.cos(angle)},${y+32*Math.sin(angle)}`;}).join(' ');
export default function PackingPanel({puzzle,content,onEdit,onFocusCell,initialAnchorHex}) {
  const [pieceId,setPieceId]=useState(puzzle.pieces[0].id),[originHex,setOrigin]=useState(puzzle.patchCells.includes(initialAnchorHex)?initialAnchorHex:puzzle.patchCells[0]),[orientation,setOrientation]=useState(0),[reflected,setReflected]=useState(false);
  const placement={pieceId,originHex,orientation,reflected},next={...content,placements:[...content.placements.filter(item=>item.pieceId!==pieceId),placement]},check=validatePacking(puzzle,next,{complete:false});
  const piece=puzzle.pieces.find(item=>item.id===pieceId),[q,r]=originHex.split(',').map(Number);
  const preview=transformedCells(piece,orientation,reflected).map(([dq,dr])=>`${q+dq},${r+dr}`);
  const positions=puzzle.patchCells.map(point),left=Math.min(...positions.map(p=>p.x))-36,top=Math.min(...positions.map(p=>p.y))-36,width=Math.max(...positions.map(p=>p.x))-left+36,height=Math.max(...positions.map(p=>p.y))-top+36;
  const coverage=validatePacking(puzzle,content,{complete:false}).coveredCells||[];
  const reasons={'packing-outside':'Part of this branch lies outside the clearing.','packing-forbidden':'This branch covers a forbidden cell.','packing-overlap':'This branch overlaps another branch.'};
  function selectPiece(id){setPieceId(id);const current=content.placements.find(item=>item.pieceId===id);if(current){setOrigin(current.originHex);setOrientation(current.orientation);setReflected(current.reflected);}else{setOrientation(0);setReflected(false);}}
  return <section aria-label="Hollow Bough shelter draft"><p>Fit every branch, cover each socket (○) and avoid forbidden cells (×). Leave at least three connected free cells reached from an approach (A). Branches shelter the team without blocking movement. Editing is free.</p>
    <div className="ov-row">{puzzle.pieces.map(item=><PaintedButton key={item.id} aria-pressed={pieceId===item.id} onClick={()=>selectPiece(item.id)}>Branch {item.id} · {item.cells.length} cells{content.placements.some(p=>p.pieceId===item.id)?' · placed':''}</PaintedButton>)}</div>
    <div className="ov-row"><PaintedButton aria-label="Rotate branch anticlockwise" onClick={()=>setOrientation((orientation+5)%6)}>↶ Rotate</PaintedButton><PaintedButton aria-label="Rotate branch clockwise" onClick={()=>setOrientation((orientation+1)%6)}>Rotate ↷</PaintedButton>{puzzle.reflectionAllowed&&<PaintedButton aria-pressed={reflected} onClick={()=>setReflected(!reflected)}>Reflect branch</PaintedButton>}</div>
    <p>Branch {pieceId}: orientation {orientation}{reflected?', reflected':''}. Tap the branch’s anchor cell, then place it.</p>
    <svg style={{width:'100%',minWidth:300,maxHeight:390}} viewBox={`${left} ${top} ${width} ${height}`} role="group" aria-label="Shelter clearing">
      {puzzle.patchCells.map(id=>{const p=point(id),selected=preview.includes(id),covered=coverage.includes(id),forbidden=puzzle.forbiddenCells.includes(id),socket=puzzle.sockets.includes(id),forecast=(puzzle.forecastCellIds||[]).includes(id),approach=puzzle.approachCells.includes(id);return <g key={id} role="button" tabIndex={0} aria-label={`Anchor ${id}${socket?', socket':''}${forbidden?', forbidden':''}${approach?', approach':''}${covered?', covered':''}${forecast?', forecast root fall':''}`} aria-pressed={originHex===id} onClick={()=>setOrigin(id)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setOrigin(id);}}}><polygon points={polygon(p)} fill={forbidden?'#4b4140':selected?'#e6cf88':covered?'#79986b':'#f3ead3'} stroke={originHex===id?'#172d47':'#625746'} strokeWidth={originHex===id?4:2}/><text x={p.x} y={p.y+5} textAnchor="middle" fill="#172820" fontSize={18} pointerEvents="none">{forbidden?'×':socket?'○':approach?'A':''}{forecast?'!':''}</text></g>;})}
    </svg>
    <p role="status">{check.valid?'This placement fits the draft.':reasons[check.reason]||'Choose a legal anchor and orientation.'}</p>
    <div className="ov-row"><PaintedButton disabled={!check.valid} onClick={()=>onEdit({type:'place-piece',...placement})}>Place branch {pieceId}</PaintedButton><PaintedButton disabled={!content.placements.some(item=>item.pieceId===pieceId)} onClick={()=>onEdit({type:'remove-piece',pieceId})}>Remove branch {pieceId}</PaintedButton>{onFocusCell&&<PaintedButton onClick={()=>onFocusCell(originHex)}>Show anchor on battlefield</PaintedButton>}</div>
    <p>Placed: {content.placements.length} / {puzzle.pieces.length} branches. Covered sockets: {puzzle.sockets.filter(id=>coverage.includes(id)).length} / {puzzle.sockets.length}. {puzzle.forecastCellIds?.length?'Cells marked ! lose shelter after the enemies unless protected. ':''}Preview activation at the control after the whole clearing fits.</p>
  </section>;
}
