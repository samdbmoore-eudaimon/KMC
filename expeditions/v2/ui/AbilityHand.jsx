import PaintedButton from './PaintedButton.jsx';
import React,{useState} from 'react';
import {CARD_LABELS} from '../index.js';
import {reasonText} from './feedback.js';
import {actionGuide} from './action-guide.js';
import {actionHelpText} from './action-help-text.js';
import PaintedActionButton from './PaintedActionButton.jsx';
export default function AbilityHand({state,hero,commands,onSelect}) {
  const profile=state.profiles[hero.id],[help,setHelp]=useState(null);
  return <div className="ov-hand" aria-label={`${profile.name}'s four abilities`}>{profile.hand.map(card=>{
    const row=commands.find(c=>c.type===card.key),ready=hero.handReady[card.key],guide=actionGuide(card.key,profile);
    return <div key={card.key} className="ov-ability-control"><PaintedActionButton type={card.key} label={CARD_LABELS[card.key]} detail={ready?`${row?.apCost??1} action · ready`:'Spent'} spent={!ready} unavailable={!row?.available} title={row?actionHelpText(state,row,hero.id):guide.purpose} onClick={()=>onSelect(row)}/><PaintedButton className="ov-info" aria-label={`About ${CARD_LABELS[card.key]}`} aria-expanded={help===card.key} onClick={()=>setHelp(help===card.key?null:card.key)}>?</PaintedButton>{help===card.key&&<div className="ov-ability-help"><strong>{CARD_LABELS[card.key]}</strong><p>{guide.purpose}</p><p>{guide.stat} · {guide.target}</p>{!row?.available&&<p>{reasonText(row?.reasonCode,row?.reasonParams,state)}</p>}</div>}</div>;
  })}</div>;
}
