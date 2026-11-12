import React,{useState,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import OrchardV2Route from '../../../../../expeditions/v2/route.jsx';
import OrchardExpedition from '../../../../../expeditions/v2/ui/OrchardExpedition.jsx';
import {registerOrchardPuzzleHooks} from '../../../../../expeditions/v2/puzzles/index.js';
import {orchardRosterProfiles,replayRun} from '../../../../../expeditions/v2/index.js';
import {saveActiveRun} from '../../../../../expeditions/v2/persistence.js';
import {NFO_CHARACTER_ART,NFO_CARD_ART} from '../../../../../wm-9fo-card-art.js';
import states from './states.json';
registerOrchardPuzzleHooks();
const cards=Object.keys(orchardRosterProfiles()).map(id=>({id}));
function Mission({entry}){
  const [progress,setSaved]=useState(()=>{const replay=replayRun({initialRun:entry.record.initialRun,commands:entry.record.commands.slice(0,entry.prefix)});if(!replay.ok)throw Error('Replay failed');return saveActiveRun({cards:Object.fromEntries(cards.map(c=>[c.id,1])),stars:0,packs:0,expeditions:{version:2,scenarios:{},moduleSetRewarded:false}},replay.state);});
  const setProgress=useCallback(update=>setSaved(current=>{const next=typeof update==='function'?update(current):update;localStorage.setItem('orchard-art-pose-qa-20261005-'+entry.id,JSON.stringify(next));return next;}),[entry.id]);
  return <OrchardV2Route Ui={OrchardExpedition} generateBlueprint={()=>entry.record.initialRun.blueprint} ensureHooks={registerOrchardPuzzleHooks} activeModule="primary" currentProfile={{name:'eudaimon',avatar:'card:intermediate:gf_rooke'}} progress={progress} setProgress={setProgress} cards={cards} avatarForCard={(module,card)=>NFO_CHARACTER_ART[card.id]||NFO_CARD_ART[card.id]} onExit={()=>{}}/>;
}
function Preview(){const [id,setId]=useState(states[0].id),entry=states.find(e=>e.id===id);return <><style>{`html,body,#root{margin:0;height:100%;font-family:system-ui}#root{display:flex;flex-direction:column;background:#203e30}.qa-banner{color:#fff0c5;padding:6px;font-size:11px}.ov-root{flex:1;min-height:0!important}`}</style><div className="qa-banner">Replayed saved-state art QA; no new playthrough, certification or reward claim. <label>Review pose <select aria-label="Review pose" value={id} onChange={e=>setId(e.target.value)}>{states.map(e=><option key={e.id}>{e.id}</option>)}</select></label> Source command {entry.prefix}.</div><Mission key={id} entry={entry}/></>;}
createRoot(document.getElementById('root')).render(<Preview/>);
