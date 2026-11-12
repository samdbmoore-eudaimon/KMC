import React,{useState,useCallback,useMemo} from 'react';
import usePointerQA from './pointer-input-recorder.jsx';
import {createRoot} from 'react-dom/client';
import OrchardV2Route from '../../expeditions/v2/route.jsx';
import OrchardExpedition from '../../expeditions/v2/ui/OrchardExpedition.jsx';
import {generateUnequalCrossingCandidate} from '../../expeditions/v2/generation/unequal-crossing.js';
import {generateMaybeFlockCandidate} from '../../expeditions/v2/generation/maybe-flock.js';
import {generateHollowBoughCandidate} from '../../expeditions/v2/generation/hollow-bough.js';
import {generateTurningRavineCandidate} from '../../expeditions/v2/generation/turning-ravine.js';
import {generateFourLocksCandidate} from '../../expeditions/v2/generation/four-locks.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {orchardRosterProfiles,exportRunRecord,createRun} from '../../expeditions/v2/index.js';
import {saveActiveRun} from '../../expeditions/v2/persistence.js';
import {NFO_CHARACTER_ART,NFO_CARD_ART} from '../../wm-9fo-card-art.js';

registerOrchardPuzzleHooks();
const params=new URLSearchParams(location.search),family=params.get('family')||'unequal-crossing',tier=Number(params.get('tier')||3),seed=Number(params.get('seed')||(family==='unequal-crossing'?2:1)),layoutId=params.get('layout')||'river';
const generators={'unequal-crossing':generateUnequalCrossingCandidate,'maybe-flock':generateMaybeFlockCandidate,'hollow-bough':generateHollowBoughCandidate,'turning-ravine':generateTurningRavineCandidate,'four-locks':generateFourLocksCandidate};
const qaCase=params.get('case')||'',teamParam=params.get('team');
const key=location.search?`orchard-code-pointer-ui-20261005-${family}-${tier}-${seed}-${layoutId}${teamParam||qaCase?`-${teamParam||'default'}-${qaCase}`:''}`:'orchard-code-pointer-default-20261005',candidate=generators[family]?.({tier,seed,layoutId});
if(candidate?.status!=='success')throw Error('Generated family preview packet unavailable');
const team=teamParam?.split(',')||(family==='maybe-flock'&&tier===1?['tuppence','dapple','sorrel']:family==='hollow-bough'&&tier===1?['bushel','furrow','pip']:['barrow','cobweb','amberly']);
const roster=orchardRosterProfiles(),cards=Object.keys(roster).map(id=>({id})),original=(module,card)=>NFO_CHARACTER_ART[card.id]||NFO_CARD_ART[card.id],generate=()=>candidate.blueprint;
if(team.length!==3||new Set(team).size!==3||team.some(id=>!roster[id]))throw Error('Invalid QA team');
function initial(){const progress={cards:Object.fromEntries(cards.map(card=>[card.id,1])),stars:0,packs:0,expeditions:{version:2,scenarios:{},moduleSetRewarded:false}};return saveActiveRun(progress,createRun({blueprint:candidate.blueprint,cardIds:team,runId:`code-${family}-t${tier}-browser-zero${qaCase?`-${qaCase}`:''}`}));}
function Preview(){
  usePointerQA();
  const [progress,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))||initial();}catch{return initial();}}),[route,setRoute]=useState(true),[runKey,setRunKey]=useState(0),[record,setRecord]=useState(()=>progress.expeditions.v2?.activeRun?.record||null);
  const setProgress=useCallback(update=>setSaved(current=>{const next=typeof update==='function'?update(current):update;localStorage.setItem(key,JSON.stringify(next));return next;}),[]);
  const ObservedUi=useMemo(()=>function ObservedUi(props){const controller=useMemo(()=>({...props.controller,dispatch(state,command){const result=props.controller.dispatch(state,command);if(result.result.legal)setRecord(exportRunRecord(result.state));return result;}}),[props.controller]);return <OrchardExpedition {...props} controller={controller}/>;},[]);
  return <><style>{`html,body,#root{margin:0;height:100%;font-family:system-ui}#root{display:flex;flex-direction:column;background:#203e30}.qa-banner{color:#fff0c5;padding:6px 12px;font-size:13px}.qa-record{color:#fff0c5;max-height:35vh;overflow:auto}.qa-record pre{font-size:12px;white-space:pre-wrap}.ov-root{flex:1;min-height:0!important}`}</style><div className="qa-banner" style={params.has('compactBanner')?{height:22,flex:'0 0 22px',overflow:'hidden',fontSize:11,padding:'3px 6px'}:undefined}>{family} T{tier} seed {seed}: generated private QA mission, zero-command start, real route/controller/reducer. Disposable QA progress; uncertified family stays unavailable in production. <button onClick={()=>setRoute(!route)}>{route?'Leave route':'Resume run'}</button><button onClick={()=>{const fresh=initial();setSaved(fresh);localStorage.setItem(key,JSON.stringify(fresh));setRecord(fresh.expeditions.v2?.activeRun?.record||null);setRunKey(value=>value+1);setRoute(true);}}>New zero-command QA run</button></div>{route&&<OrchardV2Route key={runKey} Ui={ObservedUi} generateBlueprint={generate} ensureHooks={registerOrchardPuzzleHooks} activeModule="primary" currentProfile={{name:'eudaimon',avatar:'card:intermediate:gf_rooke'}} progress={progress} setProgress={setProgress} cards={cards} avatarForCard={original} onExit={()=>setRoute(false)}/>}<details className="qa-record"><summary>Disposable QA progress and reducer trace</summary><pre className="qa-progress">{JSON.stringify(progress,null,2)}</pre><pre className="qa-trace">{JSON.stringify(record,null,2)}</pre><pre className="qa-input-events"/></details></>;
}
createRoot(document.getElementById('root')).render(<Preview/>);
