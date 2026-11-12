import React,{useState,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import OrchardV2Route from '../../expeditions/v2/route.jsx';
import OrchardExpedition from '../../expeditions/v2/ui/OrchardExpedition.jsx';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {orchardRosterProfiles,replayRun} from '../../expeditions/v2/index.js';
import {saveActiveRun} from '../../expeditions/v2/persistence.js';
import {NFO_CHARACTER_ART,NFO_CARD_ART} from '../../wm-9fo-card-art.js';
import states from '../../docs/expeditions/v2/evidence/code-overnight-20261004/selected-info-states.json';
registerOrchardPuzzleHooks();
const params=new URLSearchParams(location.search),entry=states.find(e=>e.id===params.get('state'))||states[0],key='orchard-code-selected-info-20261005-'+entry.id+'-'+params.get('case'),cards=Object.keys(orchardRosterProfiles()).map(id=>({id}));
function Preview(){
  const [progress,setSaved]=useState(()=>{const replay=replayRun({initialRun:entry.record.initialRun,commands:entry.record.commands.slice(0,entry.prefix)});if(!replay.ok)throw Error('Replay failed');return saveActiveRun({cards:Object.fromEntries(cards.map(c=>[c.id,1])),stars:0,packs:0,expeditions:{version:2,scenarios:{},moduleSetRewarded:false}},replay.state);});
  const setProgress=useCallback(update=>setSaved(current=>{const next=typeof update==='function'?update(current):update;localStorage.setItem(key,JSON.stringify(next));return next;}),[]);
  return <><style>{`html,body,#root{margin:0;height:100%;font-family:system-ui}#root{display:flex;flex-direction:column;background:#203e30}.qa-banner{color:#fff0c5;padding:6px;font-size:11px}.qa-record{color:#fff0c5;max-height:35vh;overflow:auto}.qa-record pre{font-size:12px;white-space:pre-wrap}.ov-root{flex:1;min-height:0!important}`}</style><div className="qa-banner">Saved-state replay QA: {entry.id}, source command {entry.prefix}. No new playthrough, certification or reward claim.</div><OrchardV2Route Ui={OrchardExpedition} generateBlueprint={()=>entry.record.initialRun.blueprint} ensureHooks={registerOrchardPuzzleHooks} activeModule="primary" currentProfile={{name:'eudaimon',avatar:'card:intermediate:gf_rooke'}} progress={progress} setProgress={setProgress} cards={cards} avatarForCard={(module,card)=>NFO_CHARACTER_ART[card.id]||NFO_CARD_ART[card.id]} onExit={()=>{}}/><details className="qa-record"><summary>Private replay record</summary><pre className="qa-progress">{JSON.stringify(progress,null,2)}</pre><pre className="qa-trace">{JSON.stringify(progress.expeditions.v2.activeRun.record,null,2)}</pre></details></>;
}
createRoot(document.getElementById('root')).render(<Preview/>);
