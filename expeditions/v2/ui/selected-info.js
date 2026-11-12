const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
export function placeSelectedInfo(anchor,size,controls=[],figures=[]) {
  if(size.width<8||size.height<8||anchor.x<0||anchor.y<0||anchor.x>size.width||anchor.y>size.height)return null;
  const margin=4,obstacles=[...controls,...figures];
  if(size.height<48)return null;
  const candidates=[[160,58],[90,40]].filter(([,height])=>height+8<=size.height).flatMap(([preferredWidth,height])=>{
    const width=Math.min(preferredWidth,size.width-8),xs=[anchor.x-width/2,anchor.x+18,anchor.x-width-18,margin,size.width-width-margin],ys=[anchor.y+16,anchor.y-height-18,margin,size.height-height-margin];
    for(const box of obstacles){xs.push(box.x-width-margin,box.x+box.width+margin);ys.push(box.y-height-margin,box.y+box.height+margin);}
    return xs.flatMap(x=>ys.map(y=>{
    const box={x:Math.max(margin,Math.min(size.width-width-margin,x)),y:Math.max(margin,Math.min(size.height-height-margin,y)),width,height};
    return {...box,compact:height===40,controlOverlap:controls.reduce((sum,r)=>sum+overlap(box,r),0),figureOverlap:figures.reduce((sum,r)=>sum+overlap(box,r),0),distance:Math.hypot(box.x+width/2-anchor.x,box.y+height/2-anchor.y)};
    }));
  });
  candidates.sort((a,b)=>a.controlOverlap-b.controlOverlap||a.figureOverlap-b.figureOverlap||Number(a.compact)-Number(b.compact)||a.distance-b.distance||a.y-b.y||a.x-b.x);
  return candidates[0];
}
export function selectedHeroInfo(state,id) {
  const hero=state.heroes.find(h=>h.id===id);if(!hero)return null;
  const name=state.profiles[id].name,holding=hero.holding&&state.blueprint.stations.find(s=>s.id===hero.holding)?.name;
  const condition=hero.hp<=0?'Down':hero.holding?'Holding':hero.ap===0?'No AP':'Ready';
  return {hero,name,condition,health:`${hero.hp} ♥ · ${hero.ap} AP`,label:`${name}: ${hero.hp} health, ${hero.ap} AP; ${holding?`Holding ${holding}`:condition}`};
}
