export const RIVER_DIRECTIONS=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
export const waterBearing=tile=>['water','bridge'].includes(tile.terrain);
export function riverLayout(tiles) {
  const board=new Map(tiles.map(t=>[`${t.q},${t.r}`,t]));
  return tiles.filter(waterBearing).map(tile=>{
    const hex=`${tile.q},${tile.r}`,neighbours=RIVER_DIRECTIONS.map(([q,r])=>board.get(`${tile.q+q},${tile.r+r}`));
    const edges=neighbours.flatMap((t,i)=>t&&waterBearing(t)?[i]:[]);
    for(const [kind,base]of [['bend',[3,1]],['straight',[3,0]]])for(let turns=0;turns<6;turns++){
      const mouths=base.map(e=>(e+turns)%6);
      if(edges.length>=1&&edges.length<=2&&edges.every(e=>mouths.includes(e))&&mouths.every(e=>edges.includes(e)||!neighbours[e]))return {hex,kind,rotation:turns*60,mouths,edges,outlets:mouths.filter(e=>!neighbours[e])};
    }
    return {hex,kind:null,edges,reason:edges.length>2?'branch':edges.length===0?'isolated':'unsupported mouth arrangement'};
  });
}
export function exposedFrontEdges(tile,tiles) {
  const occupied=new Set(tiles.map(t=>`${t.q},${t.r}`));
  return [1,2].filter(e=>{const [q,r]=RIVER_DIRECTIONS[e];return !occupied.has(`${tile.q+q},${tile.r+r}`);});
}
