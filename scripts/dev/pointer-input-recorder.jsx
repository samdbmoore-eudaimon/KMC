import {useEffect} from 'react';
export default function usePointerQA(){
  useEffect(()=>{
    const events=[];
    const record=(event,phase)=>{
      const target=event.target.closest?.('button,[data-hit-hex]'),rect=target?.getBoundingClientRect(),trace=document.querySelector('.qa-trace')?.textContent;
      let commands=null;try{commands=JSON.parse(trace)?.commands.length;}catch{}
      events.push({seq:events.length,type:event.type,phase,trusted:event.isTrusted,pointerType:event.pointerType||null,clientX:event.clientX,clientY:event.clientY,targetTag:event.target.tagName,targetName:target?.getAttribute('aria-label')||target?.textContent?.trim()||null,hex:target?.getAttribute('data-hit-hex')||null,rect:rect?{x:rect.x,y:rect.y,width:rect.width,height:rect.height}:null,movementVisible:!!document.querySelector('.ov-movement-choice'),selectedHero:document.querySelector('.ov-team-tray [aria-pressed="true"]')?.getAttribute('aria-label')||[...document.querySelectorAll('button[aria-pressed="true"]')].find(e=>e.getAttribute('aria-label')?.startsWith('Select '))?.getAttribute('aria-label')||null,notice:document.querySelector('.ov-notice')?.textContent||null,preview:!!document.querySelector('.ov-preview'),commands});
      const output=document.querySelector('.qa-input-events');if(output)output.textContent=JSON.stringify(events,null,2);
    };
    const capture=event=>{record(event,'capture');setTimeout(()=>record(event,'settled'),0);};
    const types=['pointerdown','pointerup','pointercancel','mousedown','mouseup','click'];
    types.forEach(type=>document.addEventListener(type,capture,{capture:true,passive:true}));
    return()=>types.forEach(type=>document.removeEventListener(type,capture,true));
  },[]);
}
