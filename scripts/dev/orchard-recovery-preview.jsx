import React,{useState,useCallback,useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import OrchardV2Route from '../../expeditions/v2/route.jsx';
import OrchardExpedition from '../../expeditions/v2/ui/OrchardExpedition.jsx';
import {generateOrchardBlueprint} from '../../expeditions/v2/generation/index.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {orchardRosterProfiles,exportRunRecord} from '../../expeditions/v2/index.js';
import {replayRun} from '../../expeditions/v2/run.js';
import {saveActiveRun} from '../../expeditions/v2/persistence.js';
import retained from '../../docs/expeditions/v2/evidence/playthrough-recovery-20261003/sam-playthrough-trace.json';

registerOrchardPuzzleHooks();
const qaMode=new URLSearchParams(location.search).get('qa');
const storageKey=qaMode==='retained'?'orchard-autonomous-retained-qa-v1':qaMode==='fresh'?'orchard-autonomous-fresh-qa-v1':'orchard-recovery-qa-only-v1';
const fresh=()=>({cards:Object.fromEntries(Object.keys(orchardRosterProfiles()).map(id=>[id,1])),stars:0,packs:0,expeditions:{version:2,scenarios:{},moduleSetRewarded:false}});
function Preview(){
  const [progress,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem(storageKey))||(qaMode==='retained'?saveActiveRun(fresh(),replayRun(retained).state):fresh());}catch{return fresh();}}),[route,setRoute]=useState(true);
  const [record,setRecord]=useState(()=>progress.expeditions.v2?.activeRun?.record||null);
  const ObservedUi=useMemo(()=>function ObservedUi(props){const observed=useMemo(()=>({...props.controller,save(state){setRecord(exportRunRecord(state));return props.controller.save(state);},dispatch(state,command){const outcome=props.controller.dispatch(state,command);if(outcome.result.legal)setRecord(exportRunRecord(outcome.state));return outcome;}}),[props.controller]);return <OrchardExpedition {...props} controller={observed}/>;},[]);
  const setProgress=useCallback(update=>setSaved(current=>{const next=typeof update==='function'?update(current):update;localStorage.setItem(storageKey,JSON.stringify(next));return next;}),[]);
  return <><div className="qa-banner">Development controller-route fixture · real private gate, generator and reducer · disposable {qaMode||'original'} QA collection <button onClick={()=>setRoute(!route)}>{route?'Leave route':'Open route'}</button></div>{route&&<OrchardV2Route Ui={ObservedUi} generateBlueprint={generateOrchardBlueprint} ensureHooks={registerOrchardPuzzleHooks} activeModule="primary" currentProfile={{name:'eudaimon',avatar:'card:intermediate:gf_rooke'}} progress={progress} setProgress={setProgress} cards={[]} onExit={()=>setRoute(false)}/>}<details className="qa-record"><summary>QA progress and reducer trace</summary><pre className="qa-progress">{JSON.stringify(progress,null,2)}</pre><pre className="qa-trace">{JSON.stringify(record,null,2)}</pre></details></>;
}
createRoot(document.getElementById('root')).render(<Preview/>);
