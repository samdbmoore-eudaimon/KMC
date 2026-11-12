import PaintedButton from './PaintedButton.jsx';
import React from 'react';
import {controlDistance} from './next-step.js';

// Distinguishes free draft editing (anywhere) from paid activation (a hero on or beside the control).
export default function PuzzleNote({state,onShowControl}){
  const {control,nearest,adjacent}=controlDistance(state);
  const ready=adjacent.some(a=>a.ap>0);
  const name=id=>state.profiles[id]?.name||id;
  return <aside className="ov-puzzle-note" aria-label="How the puzzle works">
    <p><b>Two steps.</b> 1) Solve the draft: free, from anywhere, as often as you like. Edits are saved as you make them. 2) Activate it: a hero must stand on or beside the {control.name} and spend 1 action.</p>
    <p>{ready?`${name(adjacent.find(a=>a.ap>0).id)} is beside the control with an action to spare: you can Activate now.`:`No hero is beside the control. ${name(nearest.id)} is ${nearest.distance} hex${nearest.distance===1?'':'es'} away from ${control.name||'the control'} (${control.hex}).`}</p>
    <PaintedButton onClick={onShowControl}>Show the control on the map</PaintedButton>
  </aside>;
}
