const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
export function placeStationLabels(items,width,height,reserved=[]) {
  const occupied=[...reserved],result=[];
  for(const item of items){
    if(item.x<0||item.x>width||item.y<0||item.y>height)continue;
    const options=[[0,15],[-80,15],[80,15],[0,65],[-110,-35],[110,-35],[0,-100],[-80,65],[80,65],[0,110]];
    const candidates=options.map(([dx,dy],index)=>{const rect={x:Math.max(4,Math.min(width-item.width-4,item.x+dx-item.width/2)),y:Math.max(4,Math.min(height-item.height-4,item.y+dy)),width:item.width,height:item.height};return {...rect,index,score:occupied.reduce((sum,r)=>sum+overlap(rect,r),0)};});
    candidates.sort((a,b)=>a.score-b.score||a.index-b.index);const chosen=candidates[0];occupied.push({...chosen,x:chosen.x-4,y:chosen.y-4,width:chosen.width+8,height:chosen.height+8});result.push({...item,...chosen});
  }
  return result;
}
