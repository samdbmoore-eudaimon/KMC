import React from 'react';
import {validatePacking,transformedCells} from '../puzzles/packing.js';
import {projectHex,polygonPoints} from './viewport.js';

const colours=['#f8d58d','#9bd4d2','#ddaaca','#b5c796','#bfbcf1'];
export function packingBranchCells(puzzle,content){
  if(!validatePacking(puzzle,content,{complete:false}).valid)return [];
  return content.placements.map(placement=>{const piece=puzzle.pieces.find(item=>item.id===placement.pieceId),[q,r]=placement.originHex.split(',').map(Number);return {id:piece.id,cells:transformedCells(piece,placement.orientation,placement.reflected).map(([dq,dr])=>`${q+dq},${r+dr}`)};});
}
export default function PackingBoard({state,selectedHex}){
  const puzzle=state.blueprint.puzzle;if(puzzle.kind!=='polyhex')return null;
  const active=packingBranchCells(puzzle,state.puzzleActive.content),draft=packingBranchCells(puzzle,state.puzzleDraft.content),suppressed=new Set(state.phaseEffects?.suppressedShelterCells||[]);
  const powered=state.blueprint.outputs?.some(output=>output.effect.kind==='shelter'&&output.effect.coverage==='puzzle'&&state.activeOutputs[output.id])||false;
  const coverage=new Set(active.flatMap(branch=>branch.cells));
  return <g pointerEvents="none" data-packing-clearing="world" aria-label="Branch clearing: dashed outlines are the free draft; solid outlines are committed branches">
    {puzzle.patchCells.map(hex=>{const p=projectHex(hex),socket=puzzle.sockets.includes(hex),forbidden=puzzle.forbiddenCells.includes(hex),approach=puzzle.approachCells.includes(hex),forecast=puzzle.forecastCellIds?.includes(hex),sheltered=powered&&coverage.has(hex)&&!suppressed.has(hex);return <g key={hex} data-packing-cell={hex} data-sheltered={sheltered} aria-label={`Clearing ${hex}${socket?', compulsory socket':''}${forbidden?', forbidden':''}${approach?', approach':''}${forecast?', forecast roots':''}${suppressed.has(hex)?', shelter suppressed':sheltered?', shelter active':''}`}><polygon points={polygonPoints(hex)} fill={sheltered?'#91d3a044':'#e8d39a18'} stroke={selectedHex===hex?'#fff8c4':'#e5d2a7'} strokeWidth={selectedHex===hex?4:2} vectorEffect="non-scaling-stroke"/>{socket&&<circle cx={p.x} cy={p.y} r="12" fill="none" stroke="#fff0be" strokeWidth="3"/>}{(forbidden||approach||forecast||suppressed.has(hex))&&<text x={p.x} y={p.y+6} fontSize="18" textAnchor="middle" fill="#fff2c5">{forbidden?'×':suppressed.has(hex)?'!':approach?'A':'↓'}</text>}</g>;})}
    {active.map((branch,i)=><g key={branch.id} data-committed-branch={branch.id}>{branch.cells.map(hex=><polygon key={hex} points={polygonPoints(hex)} fill="none" stroke={colours[i%colours.length]} strokeWidth="5" vectorEffect="non-scaling-stroke"/>)}</g>)}
    {draft.map((branch,i)=><g key={branch.id} data-draft-branch={branch.id} aria-label={`Draft branch ${branch.id}: ${branch.cells.join('; ')}`}>{branch.cells.map(hex=><polygon key={hex} points={polygonPoints(hex)} fill="none" stroke={colours[i%colours.length]} strokeWidth="2" strokeDasharray="5 4" vectorEffect="non-scaling-stroke"/>)}</g>)}
  </g>;
}
