import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import PartyTray from '../../expeditions/v2/ui/PartyTray.jsx';
import PaintedActionButton from '../../expeditions/v2/ui/PaintedActionButton.jsx';
import {RECOVERY_CSS} from '../../expeditions/v2/ui/recovery.css.js';
import {ORCHARD_UI_KIT,ORCHARD_UI_GEOMETRY} from '../../expeditions/v2/art/ui-kit.js';
import manifest from '../../expeditions/v2/art/ui-kit.json' with {type:'json'};
import {NFO_CHARACTER_ART,NFO_CARD_ART} from '../../wm-9fo-card-art.js';
import {orchardRosterProfiles} from '../../expeditions/v2/index.js';
const roster=orchardRosterProfiles(),ids=['harvestmoon','longshadow','ninebark'],cards=ids.map(id=>({id}));
const original=(module,card)=>NFO_CHARACTER_ART[card.id]||NFO_CARD_ART[card.id];
function Preview(){
  const [selected,setSelected]=useState(ids[0]),[width,setWidth]=useState(390),[long,setLong]=useState(true),[action,setAction]=useState('move');
  const state={heroes:ids.map((id,i)=>({id,hp:i===2?0:roster[id].maxHealth,ap:i===0?2:0,defeated:i===2,holding:i===1?'shape':null})),profiles:{...roster,harvestmoon:{...roster.harvestmoon,name:long?'Harvestmoon of Ninefold Orchard':roster.harvestmoon.name}}};
  return <><style>{RECOVERY_CSS}{`body{margin:0;background:#213d2e;font-family:system-ui;color:#fff2d0}main{padding:12px}nav{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}nav button{min-height:44px}.ov-root{height:auto;min-height:0;border:1px solid #a98d5c;overflow:hidden;margin:auto}.ov-party-tray{display:flex;overflow:auto}.ov-root button{font-family:inherit;cursor:pointer}h1{font-size:20px}.qa-frame-viewport{padding:8px}.qa-frame-viewport p{margin:4px 0}button:focus-visible{outline:3px solid #fff1a5}`}</style><main><h1>Original portrait/team frame: isolated browser QA</h1><p>Component layout and input events only. No mission, save or reward evidence.</p><nav>{[390,768,1280].map(value=><button key={value} aria-pressed={width===value} onClick={()=>setWidth(value)}>{value===390?'Phone':value===768?'Tablet':'Desktop'} width</button>)}<button onClick={()=>setLong(!long)}>Toggle long name</button></nav><section className="ov-root" style={{width,maxWidth:'100%'}}><div className="qa-frame-viewport"><PartyTray state={state} selectedHero={selected} cards={cards} avatarForCard={original} frame={ORCHARD_UI_KIT.team} geometry={ORCHARD_UI_GEOMETRY.team} visibleBounds={manifest.assets.team.visibleBounds} onSelect={hero=>setSelected(hero.id)}/><div className="ov-actions" style={{display:'flex',overflow:'auto',gap:8}}>{[['move','Move',false,false],['operate','Activate mechanism',false,false],['counterturn','Counterturn',true,true],['hold','Hold station',true,false]].map(([type,label,spent,unavailable])=><span className="ov-action-cell" key={type}><PaintedActionButton type={type} label={label} detail={spent?'Spent':'1 action'} selected={action===type} spent={spent} unavailable={unavailable} onClick={()=>setAction(type)}/><button className="ov-info" aria-label={`About ${label}`}>?</button></span>)}</div><p>Preview selection: {action}. No reducer action in this fixture.</p><p role="status">Selected: {state.profiles[selected].name}</p><p>First hero ready; second hero spent and holding; third hero defeated and disabled.</p></div></section></main></>;
}
createRoot(document.getElementById('root')).render(<Preview/>);
