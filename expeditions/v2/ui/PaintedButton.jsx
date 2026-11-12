import React,{useState} from 'react';
export default function PaintedButton({children,className='',onPointerDown,onPointerUp,onPointerLeave,onFocus,onBlur,...props}){
  const [pressed,setPressed]=useState(false),[focused,setFocused]=useState(false);
  const appearance=props.disabled?'disabled':pressed?'pressed':focused?'focused':props['aria-pressed']?'selected':'available';
  return <button {...props} type={props.type||'button'} className={`ov-painted-button ${className}`} data-appearance={appearance} onPointerDown={event=>{setPressed(true);onPointerDown?.(event);}} onPointerUp={event=>{setPressed(false);onPointerUp?.(event);}} onPointerLeave={event=>{setPressed(false);onPointerLeave?.(event);}} onFocus={event=>{setFocused(true);onFocus?.(event);}} onBlur={event=>{setFocused(false);setPressed(false);onBlur?.(event);}}><span className="ov-painted-button-label">{props['aria-pressed']?<span aria-hidden="true">✓ </span>:null}{children}</span></button>;
}
