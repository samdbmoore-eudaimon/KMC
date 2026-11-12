import React,{useState,useCallback,useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import OrchardV2Route from '../../expeditions/v2/route.jsx';
import OrchardExpedition from '../../expeditions/v2/ui/OrchardExpedition.jsx';
import {generateFourLocksCandidate} from '../../expeditions/v2/generation/four-locks.js';
import {generateTurningRavineCandidate} from '../../expeditions/v2/generation/turning-ravine.js';
import {generateUnequalCrossingCandidate} from '../../expeditions/v2/generation/unequal-crossing.js';
import {generateMaybeFlockCandidate} from '../../expeditions/v2/generation/maybe-flock.js';
import {generateHollowBoughCandidate} from '../../expeditions/v2/generation/hollow-bough.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {orchardRosterProfiles,exportRunRecord,createRun} from '../../expeditions/v2/index.js';
import {saveActiveRun} from '../../expeditions/v2/persistence.js';
import {NFO_CHARACTER_ART,NFO_CARD_ART} from '../../wm-9fo-card-art.js';
registerOrchardPuzzleHooks();
const generators={'four-locks':generateFourLocksCandidate,'turning-ravine':generateTurningRavineCandidate,'unequal-crossing':generateUnequalCrossingCandidate,'maybe-flock':generateMaybeFlockCandidate,'hollow-bough':generateHollowBoughCandidate};
const roster=orchardRosterProfiles(),cards=Object.keys(roster).map(id=>({id})),original=(module,card)=>NFO_CHARACTER_ART[card.id]||NFO_CARD_ART[card.id];
function Mission({family}){
  const candidate=useMemo(()=>generators[family]({tier:family==='unequal-crossing'?3:1,seed:['unequal-crossing','four-locks'].includes(family)?2:1}),[family]),key=`orchard-art-family-qa-20261005-${family}`;
  function initial(){const progress={cards:Object.fromEntries(cards.map(card=>[card.id,1])),stars:0,packs:0,expeditions:{version:2,scenarios:{},moduleSetRewarded:false}};return saveActiveRun(progress,createRun({blueprint:candidate.blueprint,cardIds:family==='unequal-crossing'?['barrow','cobweb','amberly']:['bushel','furrow','pip'],runId:`art-family-${family}-zero`}));}
  const [progress,setSaved]=useState(()=>{if(candidate.status!=='success')return null;try{return JSON.parse(localStorage.getItem(key))||initial();}catch{return initial();}}),[record,setRecord]=useState(()=>progress?.expeditions.v2?.activeRun?.record||null);
  const setProgress=useCallback(update=>setSaved(current=>{const next=typeof update==='function'?update(current):update;localStorage.setItem(key,JSON.stringify(next));return next;}),[key]);
  const ObservedUi=useMemo(()=>function ObservedUi(props){const controller=useMemo(()=>({...props.controller,dispatch(state,command){const result=props.controller.dispatch(state,command);if(result.result.legal)setRecord(exportRunRecord(result.state));return result;}}),[props.controller]);return <OrchardExpedition {...props} controller={controller}/>;},[]);
  if(!progress)return <p>Actual generator unavailable: {candidate.reasonCode||candidate.status}. No substitute blueprint.</p>;
  return <><OrchardV2Route Ui={ObservedUi} generateBlueprint={()=>candidate.blueprint} ensureHooks={registerOrchardPuzzleHooks} activeModule="primary" currentProfile={{name:'eudaimon',avatar:'card:intermediate:gf_rooke'}} progress={progress} setProgress={setProgress} cards={cards} avatarForCard={original} onExit={()=>{}}/><details className="qa-record"><summary>Disposable art QA progress and reducer trace</summary><pre className="qa-progress">{JSON.stringify(progress,null,2)}</pre><pre className="qa-trace">{JSON.stringify(record,null,2)}</pre></details></>;
}
function Preview(){const [family,setFamily]=useState('unequal-crossing');return <><style>{`html,body,#root{margin:0;height:100%;font-family:system-ui}#root{display:flex;flex-direction:column;background:#203e30}.qa-banner{color:#fff0c5;padding:6px 12px;font-size:12px}.qa-record{color:#fff0c5;max-height:30vh;overflow:auto}.qa-record pre{font-size:12px;white-space:pre-wrap}.ov-root{flex:1;min-height:0!important}`}</style><div className="qa-banner">Actual generator art QA; separate disposable saves; no tier certification. <label>Review family <select aria-label="Review family" value={family} onChange={e=>setFamily(e.target.value)}>{Object.keys(generators).map(id=><option key={id} value={id}>{id}</option>)}</select></label></div><Mission key={family} family={family}/></>;}
createRoot(document.getElementById('root')).render(<Preview/>);
