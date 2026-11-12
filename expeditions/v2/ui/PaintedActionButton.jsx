import React,{useState} from 'react';
import {Footprints,Swords,Shield,Heart,LockKeyhole,Leaf,Zap,Hand,BookOpen,RotateCcw,Hourglass,Target,Wrench,Check,X} from 'lucide-react';
import {ORCHARD_UI_KIT,ORCHARD_UI_GEOMETRY} from '../art/ui-kit.js';

const icons={move:Footprints,dash:Footprints,intercept:Target,strike:Swords,guard:Shield,repair:Heart,lock:LockKeyhole,stabilise:Leaf,calibrate:Zap,hold:Hand,operate:Wrench,puzzle:BookOpen,undo:RotateCcw,'end-round':Hourglass,confirm:Check,cancel:X};
export default function PaintedActionButton({type,label,detail,title,selected=false,unavailable=false,spent=false,danger=false,confirm=false,disabled=false,onClick}){
  const [pressed,setPressed]=useState(false),[focused,setFocused]=useState(false);
  const appearance=spent?'spent':unavailable||disabled?'disabled':pressed?'pressed':focused?'focused':selected?'selected':danger?'danger':confirm?'confirm':'available';
  const geometry=ORCHARD_UI_GEOMETRY.available,{width,height,iconCircle,textSafeArea}=geometry,[cx,cy,r]=iconCircle;
  const box=([x,y,w,h])=>({left:`${100*x/width}%`,top:`${100*y/height}%`,width:`${100*w/width}%`,height:`${100*h/height}%`});
  const Icon=icons[type]||Zap;
  return <button className={`ov-painted-action${appearance==='disabled'?' ov-painted-unavailable':''}`} type="button" aria-label={label} aria-pressed={selected||undefined} aria-disabled={unavailable||undefined} disabled={disabled} data-unavailable={unavailable} data-appearance={appearance} title={title} onClick={onClick} onPointerDown={()=>setPressed(true)} onPointerUp={()=>setPressed(false)} onPointerLeave={()=>setPressed(false)} onBlur={()=>{setFocused(false);setPressed(false);}} onFocus={()=>setFocused(true)}>
    <img className="ov-painted-frame" src={ORCHARD_UI_KIT[appearance]||ORCHARD_UI_KIT.available} alt=""/>
    <span className="ov-painted-icon" style={box([cx-r,cy-r,2*r,2*r])}><Icon aria-hidden="true" strokeWidth={1.8}/></span>
    <span className="ov-painted-copy" style={box(textSafeArea)}><strong>{label}</strong>{detail&&<small>{detail}</small>}</span>
  </button>;
}
