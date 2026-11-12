import PaintedButton from './PaintedButton.jsx';
import React from 'react';

const marks={unknown:'?',filled:'●',empty:'×'};
const next={unknown:'filled',filled:'empty',empty:'unknown'};
export default function NonogramPanel({puzzle,content,onEdit}) {
  const givenAt=(row,col)=>(puzzle.givens||[]).some(given=>given.cellId===`r${row}c${col}`||(given.row===row&&given.col===col));
  const clues=values=>values.length?values.join(' · '):'0';
  return <section aria-label="Maybe-Flock Roost nest draft"><p>Clues give filled runs in order. Leave at least one empty cell between runs. Tap to cycle unknown (?), filled (●) and empty (×). Every cell needs a decision; editing is free.</p>
    <div style={{overflowX:'auto'}}><table className="ov-nest-chart" style={{borderSpacing:3,minWidth:300,width:'100%',tableLayout:'fixed'}} aria-label="Nest chart with row and column clues"><thead><tr><td aria-label="Row clues"/>{puzzle.columnClues.map((values,col)=><th key={col} scope="col" aria-label={`Column ${col+1} clues: ${clues(values)}`}>{clues(values)}</th>)}</tr></thead><tbody>{content.grid.map((line,row)=><tr key={row}><th scope="row" aria-label={`Row ${row+1} clues: ${clues(puzzle.rowClues[row])}`}>{clues(puzzle.rowClues[row])}</th>{line.map((value,col)=><td key={col}><PaintedButton style={{minWidth:44,minHeight:44,width:'100%'}} disabled={givenAt(row,col)} aria-label={`Row ${row+1}, column ${col+1}: ${value}${givenAt(row,col)?', printed clue':''}`} onClick={()=>onEdit({type:'set-cell',row,col,value:next[value]})}>{marks[value]}</PaintedButton></td>)}</tr>)}</tbody></table></div>
    <p>A printed clue stays fixed. A filled nest chart powers the beams you choose below after activation at the control. Choose two beams and check which perch remains exposed.</p>
  </section>;
}
