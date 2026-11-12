import React from 'react';
import {entityName,reasonText,factorText} from './feedback.js';
import {actionGuide} from './action-guide.js';
import {MOVEMENT_TYPES} from './movement-view.js';
import PaintedActionButton from './PaintedActionButton.jsx';
import PaintedPanel from './PaintedPanel.jsx';
export default function ActionPreview({state,command,result,onConfirm,onCancel}) {
  if(!command||!result)return null;
  const factors=result.factors?.filter(f=>!MOVEMENT_TYPES.includes(command.type)||!['budget','cost','move'].includes(f.key)).map(f=>factorText(f,state)).filter(Boolean)||[],damage=result.factors?.find(f=>f.key==='damage'),governing=result.factors?.find(f=>f.key==='governing');
  const value=key=>result.factors.find(f=>f.key===key)?.value;
  const guide=actionGuide(command.type,state.profiles[command.heroId]),target=command.payload?.targetId||command.payload?.readyCardId;
  return <PaintedPanel as="div" className="ov-preview" aria-live="polite"><strong>{command.heroId?entityName(state,command.heroId)+': ':''}{guide.label}{target?` → ${entityName(state,target)}`:''}</strong><p>{guide.purpose}</p>{command.payload?.destination&&<p>Travel to the marked hex along the shown path. Nothing changes until you confirm (tap the marked hex again, or press Confirm).</p>}{result.legal?<>
    <p>{result.cost.ap} action{result.cost.ap===1?'':'s'}{result.cost.card?`; ${actionGuide(result.cost.card).label} becomes spent`:''}</p>{damage&&governing?<p>{governing.label} {governing.value} + support {value('support')} + mark {value('mark')} + bonus {value('bonus')} − armour {-value('armour')} = {damage.value} damage. Health {damage.targetHp[0]} → {damage.targetHp[1]}. {damage.targetHp[1]>0?'The enemy survives.':'The enemy is defeated.'}</p>:factors.map((text,i)=><p key={i}>{text}</p>)}
    {result.changedEntities?.filter(e=>['hp','integrity','charge','ap','holding'].includes(e.field)).map((e,i)=><p key={i}>{entityName(state,e.id)}: {String(e.before??'none')} → {String(e.after??'none')} {e.field==='charge'?'power':e.field==='ap'?'actions':e.field}</p>)}
    {Object.keys(result.outputsAfter||{}).filter(id=>result.outputsBefore?.[id]!==result.outputsAfter[id]).map(id=><p key={id}>{state.blueprint.outputs.find(o=>o.id===id)?.label||id}: {result.outputsBefore[id]?'on':'off'} → {result.outputsAfter[id]?'on':'off'}</p>)}
    {result.warnings?.map((warning,i)=><p key={i}>{reasonText(warning.code,warning.params,state)}</p>)}
  </>:<p>{reasonText(result.reasonCode,result.reasonParams,state)}</p>}<div className="ov-preview-buttons">{result.legal&&<PaintedActionButton type="confirm" label="Confirm" detail="Apply this action" confirm onClick={onConfirm}/>}<PaintedActionButton type="cancel" label="Cancel" detail="Return to board" onClick={onCancel}/></div></PaintedPanel>;
}
