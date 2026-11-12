import React,{useState,useCallback,useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import OrchardV2Route from '../../expeditions/v2/route.jsx';
import OrchardExpedition from '../../expeditions/v2/ui/OrchardExpedition.jsx';
import {generateUnequalCrossingCandidate} from '../../expeditions/v2/generation/unequal-crossing.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {orchardRosterProfiles,exportRunRecord,createRun} from '../../expeditions/v2/index.js';
import {saveActiveRun} from '../../expeditions/v2/persistence.js';
import {NFO_CHARACTER_ART,NFO_CARD_ART} from '../../wm-9fo-card-art.js';

registerOrchardPuzzleHooks();
const key='orchard-art-live-unequal-ui-20261004',candidate=generateUnequalCrossingCandidate({tier:3,seed:2});
if(candidate.status!=='success')throw Error('Generated Unequal preview packet unavailable');
const roster=orchardRosterProfiles(),cards=Object.keys(roster).map(id=>({id})),original=(module,card)=>NFO_CHARACTER_ART[card.id]||NFO_CARD_ART[card.id],generate=()=>candidate.blueprint;
function initial(){const progress={cards:Object.fromEntries(cards.map(card=>[card.id,1])),stars:0,packs:0,expeditions:{version:2,scenarios:{},moduleSetRewarded:false}};return saveActiveRun(progress,createRun({blueprint:candidate.blueprint,cardIds:['barrow','cobweb','amberly'],runId:'art-unequal-t3-browser-zero'}));}
function Preview(){
  const [progress,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))||initial();}catch{return initial();}}),[route,setRoute]=useState(true),[record,setRecord]=useState(()=>progress.expeditions.v2?.activeRun?.record||null);
  const setProgress=useCallback(update=>setSaved(current=>{const next=typeof update==='function'?update(current):update;localStorage.setItem(key,JSON.stringify(next));return next;}),[]);
  const ObservedUi=useMemo(()=>function ObservedUi(props){const controller=useMemo(()=>({...props.controller,dispatch(state,command){const result=props.controller.dispatch(state,command);if(result.result.legal)setRecord(exportRunRecord(result.state));return result;}}),[props.controller]);return <OrchardExpedition {...props} controller={controller}/>;},[]);
  return <><style>{`html,body,#root{margin:0;height:100%;font-family:system-ui}#root{display:flex;flex-direction:column;background:#203e30}.qa-banner{color:#fff0c5;padding:6px 12px;font-size:13px}.qa-record{color:#fff0c5;max-height:35vh;overflow:auto}.qa-record pre{font-size:12px;white-space:pre-wrap}.ov-root{flex:1;min-height:0!important}`}</style><div className="qa-banner">Art review: Unequal Crossing T3 seed 2, generated private QA mission, zero-command start, real route/controller/reducer. Disposable QA progress; uncertified family stays unavailable in production. <button onClick={()=>setRoute(!route)}>{route?'Leave route':'Resume run'}</button></div>{route&&<OrchardV2Route Ui={ObservedUi} generateBlueprint={generate} ensureHooks={registerOrchardPuzzleHooks} activeModule="primary" currentProfile={{name:'eudaimon',avatar:'card:intermediate:gf_rooke'}} progress={progress} setProgress={setProgress} cards={cards} avatarForCard={original} onExit={()=>setRoute(false)}/>}<details className="qa-record"><summary>Disposable QA progress and reducer trace</summary><pre className="qa-progress">{JSON.stringify(progress,null,2)}</pre><pre className="qa-trace">{JSON.stringify(record,null,2)}</pre></details></>;
}
createRoot(document.getElementById('root')).render(<Preview/>);

