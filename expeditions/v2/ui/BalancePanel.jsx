import PaintedButton from './PaintedButton.jsx';
import React,{useState} from 'react';

const panNames={left:'Left pan',right:'Right pan',reserve:'Reserve'};
const resultNames={'left-lighter':'Left side is lighter','left-heavier':'Left side is heavier',equal:'Both sides weigh the same'};
export default function BalancePanel({puzzle,content,comparisonLog=[],comparisonsUsed=0,onEdit,onCommand}) {
  const [weighing,setWeighing]=useState({});
  const hidden=puzzle.loads.find(load=>load.id===puzzle.hiddenLoadId);
  const values=Object.fromEntries(puzzle.loads.map(load=>[load.id,load.visible?load.value:content.inferredValue]));
  const left=puzzle.loads.filter(load=>weighing[load.id]==='left').map(load=>load.id),right=puzzle.loads.filter(load=>weighing[load.id]==='right').map(load=>load.id);
  const same=(a,b)=>a.length===b.length&&a.every(id=>b.includes(id));
  const known=comparisonLog.some(log=>(same(log.left,left)&&same(log.right,right))||(same(log.left,right)&&same(log.right,left)));
  const remaining=Math.max(0,puzzle.comparisonAllowance-comparisonsUsed);
  return <section aria-label="Unequal Crossing load draft">
    <p>Put exactly {puzzle.usedCount} loads on the pans and leave {puzzle.reserveCount} in reserve. Each pan must total {puzzle.target}. Moving draft loads is free.</p>
    <div className="ov-row">{Object.keys(panNames).map(pan=>{
      const loads=puzzle.loads.filter(load=>content.assignments[load.id]===pan),unknown=loads.some(load=>values[load.id]==null),total=loads.reduce((sum,load)=>sum+(values[load.id]??0),0);
      return <div key={pan}><strong>{panNames[pan]}</strong><p>{loads.length} loads · {unknown?`${total} + unknown`:total}{pan!=='reserve'?` / target ${puzzle.target}`:''}</p>{pan!=='reserve'&&<small>Capacity {puzzle.panCapacity[pan]} · at most {puzzle.maxPanCount[pan]} loads</small>}</div>;
    })}</div>
    {puzzle.incompatiblePairs.length>0&&<p>Keep these pairs on different pans: {puzzle.incompatiblePairs.map(pair=>pair.join(' and ')).join('; ')}. Reserve is allowed.</p>}
    {puzzle.loads.map(load=><label key={load.id} className="ov-row"><span>Load {load.id}: {load.visible?load.value:`unknown (${load.candidates.join(', ')})`}</span><select aria-label={`Place load ${load.id}`} value={content.assignments[load.id]} onChange={event=>onEdit({type:'assign-load',loadId:load.id,pan:event.target.value})}>{Object.entries(panNames).map(([pan,label])=><option key={pan} value={pan}>{label}</option>)}</select></label>)}
    {hidden&&<><label className="ov-row">Your value for load {hidden.id}<select aria-label={`Inferred value for ${hidden.id}`} value={content.inferredValue??''} onChange={event=>{if(event.target.value!=='')onEdit({type:'inferred-value',loadId:hidden.id,value:Number(event.target.value)});}}><option value="" disabled>Choose after weighing</option>{hidden.candidates.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
      <fieldset><legend>Comparison scale: {remaining} new comparisons left</legend><p>Choose separate loads for each side. A comparison keeps every hero’s actions but uses one comparison allowance. Repeating a recorded comparison is free. It does not move your draft loads.</p>
        {puzzle.loads.map(load=><label key={load.id} className="ov-row">Load {load.id}<select aria-label={`Comparison side for ${load.id}`} value={weighing[load.id]||'off'} onChange={event=>setWeighing({...weighing,[load.id]:event.target.value})}><option value="off">Off scale</option><option value="left">Left side</option><option value="right">Right side</option></select></label>)}
        <PaintedButton disabled={!left.length||!right.length||(!remaining&&!known)} onClick={()=>onCommand('compare-loads',{leftLoadIds:left,rightLoadIds:right})}>{known?'Repeat recorded comparison':'Compare selected loads'}</PaintedButton>
        <ol aria-label="Recorded comparisons">{comparisonLog.map((log,index)=><li key={log.key||index}>{log.left.join(' + ')} against {log.right.join(' + ')}: {resultNames[log.result]||log.result}</li>)}</ol>
      </fieldset></>}
    <p>The draft changes no crossing on the map. Preview activation at the control when both pans and the load restrictions are ready.</p>
  </section>;
}
