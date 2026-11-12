export function stationPresentation(state,id) {
  const definition=state.blueprint.stations.find(s=>s.id===id);
  if(!definition)return null;
  const store=state.stationStates[id],holder=state.holds[id]?.heroId;
  const name=holder?state.profiles[holder]?.name||holder:null;
  const cues=[],lines=[];
  if(id==='control') {
    if(state.blueprint.puzzle.kind==='equation-wheels'){
      const powered=Object.values(state.activeOutputs).filter(Boolean).length;
      lines.push(`${powered} active circuit${powered===1?'':'s'}`);if(powered)cues.push('ready');
      if(!powered&&state.events.some(e=>e.type==='puzzle-disrupted'||e.type==='hazard-mutation')){cues.push('corrupted');lines.push('Restore the linked equations');}
    }else{
    const corrupted=!state.puzzleValid&&state.events.some(e=>e.type==='puzzle-disrupted');
    lines.push(state.puzzleValid?'Active':corrupted?'Corrupted':'Inactive');
    if(state.puzzleValid)cues.push('ready');
    if(corrupted)cues.push('corrupted');
    }
  } else if(id==='alcove') {
    lines.push(state.preparedAlcove?'Prepared':'Not prepared');
    if(state.preparedAlcove)cues.push('prepared');
    if(state.stationStates.shape.integrity<state.blueprint.stations.find(s=>s.id==='shape').maxIntegrity){cues.push('damage');lines.push('Bridge damaged');}
  } else if(store) {
    const ready=store.charge>=definition.capacity;
    lines.push(`Power ${store.charge}/${definition.capacity}${ready?' · ready':''}`);
    if(ready)cues.push('ready');
  }
  if(holder){cues.push('working');lines.push(`Held: ${name}`);}
  if(id!=='alcove'&&store){
    const damaged=store.integrity<definition.maxIntegrity;
    if(damaged)cues.push('damage');
    lines.push(`${damaged?'Damaged · ':''}Integrity ${store.integrity}/${definition.maxIntegrity}`);
  }
  return {id,name:definition.name,cues,lines,holder,damaged:cues.includes('damage'),corrupted:cues.includes('corrupted'),label:[definition.name,...lines].join('. ')};
}

export function stationCuePositions(sprite,cues,zoom) {
  const anchor=key=>{const p=sprite.overlayAnchors[key];return [(p[0]-sprite.anchor[0])*sprite.scale,(p[1]-sprite.anchor[1])*sprite.scale];};
  const status=anchor('status'),positions={working:anchor('work')};
  cues.filter(c=>c!=='working').forEach((cue,i)=>{positions[cue]=[status[0]+i*24/zoom,status[1]];});
  return positions;
}
