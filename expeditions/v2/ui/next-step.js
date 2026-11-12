// One actionable next step, in plain words, tied to a place on the board. Pure: reads production state only.
import {hexDistance,commissionProfile} from '../index.js';
import {mechanismReady,puzzleGuide} from './action-guide.js';

const stationOf=(state,id)=>state.blueprint.stations.find(s=>s.id===id);
const alive=state=>state.heroes.filter(h=>!h.defeated);

export function controlDistance(state){
  const control=stationOf(state,'control');
  const near=alive(state).map(h=>({id:h.id,distance:hexDistance(h.position,control.hex),ap:h.ap})).sort((a,b)=>a.distance-b.distance||a.id.localeCompare(b.id));
  return {control,nearest:near[0]||null,nearestWithActions:near.find(n=>n.ap>0)||null,adjacent:near.filter(n=>n.distance<=1)};
}

// A raised (closed) controlled passage next to a hero looks like a bridge but cannot be crossed.
export function raisedPassageNear(state,heroId){
  const hero=state.heroes.find(h=>h.id===heroId);
  if(!hero)return null;
  for(const [key,passage] of Object.entries(state.passages||{})){
    if(!passage.open&&hexDistance(hero.position,key)<=1)return {hex:key};
  }
  return null;
}

export function nextStep(state){
  const name=id=>state.profiles[id]?.name||id;
  const control=stationOf(state,'control'),{nearestWithActions,adjacent}=controlDistance(state);
  if(!alive(state).some(hero=>hero.ap>0))return {id:'review-phase',focus:null,title:'Review the enemy turn',text:'Your heroes have no actions left. Puzzle thinking and edits are still free. Preview End round to check what happens next. If the expedition continues, confirming restores actions for the surviving heroes. Use Undo to revise this round first if needed.',action:'end-round'};
  const active=mechanismReady(state),puzzle=puzzleGuide(state);
  if(!active){
    if(adjacent.some(a=>a.ap>0)){
      const who=adjacent.find(a=>a.ap>0).id;
      return {id:'activate',focus:'control',title:`Activate the ${puzzle.name}`,text:`${name(who)} is beside the ${control.name}. Open the Puzzle, ${puzzle.task}, then preview Activate (1 action) and confirm.`,action:'puzzle'};
    }
    const walker=nearestWithActions;
    return {id:'walk-to-control',focus:'control',title:`Walk a hero to the ${control.name}`,text:`Activate the ${puzzle.name} at ${control.name||'the control'} (${control.hex}). You can solve its puzzle from anywhere for free, but switching it on needs a hero standing on or beside it. ${name(walker.id)} is ${walker.distance} hex${walker.distance===1?'':'es'} away.`,action:'move'};
  }
  const empty=['number','shape','sustain'].filter(id=>state.stationStates[id].charge<stationOf(state,id).capacity);
  if(empty.length){
    const st=stationOf(state,empty[0]),store=state.stationStates[empty[0]];
    return {id:'charge',focus:empty[0],title:`Add power at ${st.name}`,text:`${st.name} (${st.hex}) holds ${store.charge} of ${st.capacity} power. Walk a hero beside it and use Add power (1 action each time, more with high Arithmetic). All three job stations must be full.`,action:'calibrate'};
  }
  const jobs=['number','shape','sustain'];
  const holders=jobs.map(id=>state.holds[id]||(id==='shape'?state.holds.alcove:null));
  if(holders.some(h=>!h)){
    const missing=jobs.filter((id,i)=>!holders[i]);
    const shapeNeed=commissionProfile(state.blueprint.tier,'shape',false);
    const alcoveOnly=state.preparedAlcove&&!alive(state).some(hero=>shapeNeed.every((need,i)=>state.profiles[hero.id].stats[i]>=need));
    const place=id=>stationOf(state,id==='shape'&&alcoveOnly?'alcove':id),st=place(missing[0]);
    return {id:'hold',focus:st.id,title:`Hold ${st.name}`,text:`Every station is full. Now a hero with the right printed stats must stand beside each job's holding place and use Hold (1 action) in the same round: ${missing.map(id=>place(id).name).join(', ')} still ${missing.length===1?'needs':'need'} a holder.${missing.includes('shape')&&alcoveOnly?' The prepared alcove holds the Shape job for this team.':''} Then press End round.`,action:'hold'};
  }
  return {id:'end',focus:null,title:'End the round',text:'All three stations are full and held. Press End round: if nothing breaks the lock or hurts a holder during the enemy turn, the orchard is saved.',action:'end-round'};
}
