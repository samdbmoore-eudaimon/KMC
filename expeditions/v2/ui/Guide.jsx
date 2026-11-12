import PaintedButton from './PaintedButton.jsx';
import React from 'react';
import {nextStep} from './next-step.js';
export default function Guide({state,onPuzzle,onFocus,onSkip}){
  const step=nextStep(state);
  const target=step.focus?state.blueprint.stations.find(s=>s.id===step.focus):null;
  return <aside className="ov-guide" aria-label="Next step"><strong>Next: {step.title}</strong><p>{step.text}</p>
    <div className="ov-row">{step.action==='puzzle'&&<PaintedButton onClick={onPuzzle}>Open the puzzle</PaintedButton>}{target&&<PaintedButton onClick={()=>onFocus({...target,kind:'station'})}>Show it on the map</PaintedButton>}</div>
    <PaintedButton onClick={onSkip}>Hide guide</PaintedButton></aside>;
}
