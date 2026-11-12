import React,{useState,useCallback,useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import OrchardV2Route from '../../expeditions/v2/route.jsx';
import OrchardExpedition from '../../expeditions/v2/ui/OrchardExpedition.jsx';
import {generateTurningRavineCandidate} from '../../expeditions/v2/generation/turning-ravine.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {orchardRosterProfiles,exportRunRecord,createRun} from '../../expeditions/v2/index.js';
import {saveActiveRun} from '../../expeditions/v2/persistence.js';

registerOrchardPuzzleHooks();
const storageKey='orchard-turning-ravine-reference-qa-v1';
const candidate=generateTurningRavineCandidate({seed:1,layoutId:'hedges'});
if(candidate.status!=='success')throw Error('Ravine reference construction failed');
const generateReference=()=>candidate.blueprint;
function initial(){
  const progress={cards:Object.fromEntries(Object.keys(orchardRosterProfiles()).map(id=>[id,1])),stars:0,packs:0,expeditions:{version:2,scenarios:{},moduleSetRewarded:false}};
  const state=createRun({blueprint:candidate.blueprint,cardIds:['tuppence','furrow','sorrel'],runId:'ravine-reference-ui-1'});
  return saveActiveRun(progress,state);
}
function Preview(){
  const [progress,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem(storageKey))||initial();}catch{return initial();}}),[route,setRoute]=useState(true);
  const [record,setRecord]=useState(()=>progress.expeditions.v2?.activeRun?.record||null);
  const ObservedUi=useMemo(()=>function ObservedUi(props){const observed=useMemo(()=>({...props.controller,save(state){setRecord(exportRunRecord(state));return props.controller.save(state);},dispatch(state,command){const outcome=props.controller.dispatch(state,command);if(outcome.result.legal)setRecord(exportRunRecord(outcome.state));return outcome;}}),[props.controller]);return <OrchardExpedition {...props} controller={observed}/>;},[]);
  const setProgress=useCallback(update=>setSaved(current=>{const next=typeof update==='function'?update(current):update;localStorage.setItem(storageKey,JSON.stringify(next));return next;}),[]);
  return <><div className="qa-banner">Turning Ravine T1 reference: private development preview, real controller and reducer. Starts at zero commands; disposable QA progress. Runtime banks remain unavailable.<button onClick={()=>setRoute(!route)}>{route?'Leave route':'Resume reference'}</button></div>{route&&<OrchardV2Route Ui={ObservedUi} generateBlueprint={generateReference} ensureHooks={registerOrchardPuzzleHooks} activeModule="primary" currentProfile={{name:'eudaimon',avatar:'card:intermediate:gf_rooke'}} progress={progress} setProgress={setProgress} cards={[]} onExit={()=>setRoute(false)}/>}<details className="qa-record"><summary>QA progress and reducer trace</summary><pre className="qa-progress">{JSON.stringify(progress,null,2)}</pre><pre className="qa-trace">{JSON.stringify(record,null,2)}</pre></details></>;
}
createRoot(document.getElementById('root')).render(<Preview/>);
