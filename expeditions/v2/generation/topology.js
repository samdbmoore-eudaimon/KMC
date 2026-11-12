import {createExpeditionRandom} from '../../expedition-random.js';
import {hexDistance,offsetKey,neighbourKeys,compareHex,hashValue} from '../index.js';

export const ARCHETYPES=['river','islands','hedges','terraces'];
const parse=key=>key.split(',').map(Number);
const blocked=t=>!t||['water','hedge'].includes(t.terrain);
const walkable=(tile,open)=>!blocked(tile)&&(open||!tile.passageOutputId);
const GRAPH_CACHE=new WeakMap();
export function footprint() {
  const out=[];for(let r=0;r<9;r++)for(let c=0;c<12;c++)if(!((c<2||c>9)&&(r<2||r>6)))out.push({q:c-Math.floor(r/2),r,c,terrain:'floor'});return out;
}
export function topologyStream({familyId,tier,seed,generatorVersion=1},label='topology') {
  return createExpeditionRandom(`${familyId}|${tier}|2|${generatorVersion}|${seed>>>0}|${label}`);
}
function baseline(layoutId,packing=false) {
  const tiles=footprint();
  for(const t of tiles) {
    if(layoutId==='river'&&t.c===6) {
      t.terrain=[2,4,6].includes(t.r)?'bridge':'water';if(t.r===4)t.passageOutputId='bridge';
    }
    if(layoutId==='islands'&&(packing?[6,9]:[4,7]).includes(t.c)) {
      t.terrain=[2,6].includes(t.r)?'bridge':'water';if(t.r===6)t.passageOutputId='bridge';
    }
    if(layoutId==='hedges'&&(packing?[6,9]:[4,8]).includes(t.c)&&[2,4,6].includes(t.r))t.terrain='hedge';
    if(layoutId==='terraces'&&[3,5].includes(t.r)&&t.c>=(packing?6:2)&&t.c<=(packing?10:9)&&!(packing?[8]:[3,8]).includes(t.c))t.terrain='hedge';
  }
  if(['hedges','terraces'].includes(layoutId)) {
    const controlled=tiles.find(t=>t.c===(layoutId==='hedges'?(packing?6:4):8)&&t.r===3);
    if(controlled){controlled.terrain='gate';controlled.passageOutputId='bridge';}
  }
  return tiles;
}
export const topologyBaseTiles=layoutId=>baseline(layoutId).map(({c,...tile})=>tile);
export function shortestTopologyPaths(tiles,start,{open=true}={}) {
  let graph=GRAPH_CACHE.get(tiles);
  if(!graph){const map=new Map(tiles.map(t=>[`${t.q},${t.r}`,t])),rank=new Map([...map.keys()].sort(compareHex).map((id,i)=>[id,i])),adjacency=new Map([...map.keys()].map(id=>[id,neighbourKeys(id).filter(n=>map.has(n))]));graph={map,rank,adjacency};GRAPH_CACHE.set(tiles,graph);}
  const {map,rank,adjacency}=graph,costs=new Map([[start,0]]),paths=new Map([[start,[]]]),queue=[start];
  while(queue.length) {
    let best=0;for(let i=1;i<queue.length;i++)if(costs.get(queue[i])<costs.get(queue[best])||costs.get(queue[i])===costs.get(queue[best])&&rank.get(queue[i])<rank.get(queue[best]))best=i;
    const current=queue.splice(best,1)[0];
    for(const next of adjacency.get(current)||[]) {
      const t=map.get(next);if(!walkable(t,open))continue;
      const cost=costs.get(current)+(t.terrain==='roots'?2:1);
      if(!costs.has(next)||cost<costs.get(next)){costs.set(next,cost);paths.set(next,[...paths.get(current),next]);if(!queue.includes(next))queue.push(next);}
    }
  }
  return {costs,paths};
}
export function topologyMetrics({tiles,anchors,deployment}) {
  const open=tiles.filter(t=>walkable(t,true)).length,closed=tiles.filter(t=>walkable(t,false)).length;
  const closedPaths=shortestTopologyPaths(tiles,deployment[0],{open:false}),deploymentPaths=deployment.map(d=>shortestTopologyPaths(tiles,d)),direct=deploymentPaths.map((paths,i)=>paths.costs.get(anchors[['number','shape','sustain'][i]])??Infinity);
  const controlCost=Math.min(...deploymentPaths.map(paths=>paths.costs.get(anchors.control)??Infinity));
  const numberCost=shortestTopologyPaths(tiles,anchors.control).costs.get(anchors.number)??Infinity;
  const alcoveCost=Math.min(...deploymentPaths.map(paths=>paths.costs.get(anchors.alcove)??Infinity));
  const shapePaths=deploymentPaths[1];
  const edges=p=>new Set((p||[]).map((x,i,a)=>[i?a[i-1]:deployment[1],x].sort().join('|')));
  const directEdges=edges(shapePaths.paths.get(anchors.shape)),altEdges=edges(shapePaths.paths.get(anchors.alcove));
  const exclusiveEdges=[...directEdges].filter(e=>!altEdges.has(e)).length+[...altEdges].filter(e=>!directEdges.has(e)).length;
  const connected=[...deployment,...Object.values(anchors)].every(id=>closedPaths.costs.has(id));
  const spacing=['number','shape','sustain'].every((a,i,all)=>all.slice(i+1).every(b=>hexDistance(anchors[a],anchors[b])>=3));
  return {open,closed,connected,spacing,controlCost,numberCost,directCosts:direct,alcoveCost,exclusiveEdges,valid:open>=70&&open<=86&&closed>=66&&connected&&spacing&&controlCost<=6&&numberCost<=5&&direct.every(c=>c<=12)&&alcoveCost<=15&&exclusiveEdges>=2};
}
export function structuralFingerprint(tiles,anchors) {
  const labelled=new Map(Object.entries(anchors).map(([role,hex])=>[hex,role]));
  const forms=[];
  for(const reflected of [false,true])for(let rotation=0;rotation<6;rotation++) {
    const rows=tiles.map(t=>{
      let [q,r]=[t.q,t.r];if(reflected)[q,r]=[-q-r,r];for(let i=0;i<rotation;i++)[q,r]=[-r,q+r];
      return {q,r,terrain:t.terrain,cost:t.terrain==='roots'?2:1,role:labelled.get(`${t.q},${t.r}`)||'',passage:!!t.passageOutputId};
    });
    const minQ=Math.min(...rows.map(t=>t.q)),minR=Math.min(...rows.map(t=>t.r));
    forms.push(JSON.stringify(rows.map(t=>({...t,q:t.q-minQ,r:t.r-minR})).sort((a,b)=>a.r-b.r||a.q-b.q)));
  }
  return hashValue(forms.sort()[0]);
}
export function generateTopology({familyId='four-locks',tier=1,seed=1,generatorVersion=1,layoutId=null,reference=false,maxAttempts=256,reservedHexes=[]}={}) {
  if(!Number.isInteger(tier)||tier<1||tier>5||!Number.isInteger(seed)||!Number.isInteger(maxAttempts)||maxAttempts<1||maxAttempts>256||layoutId&&!ARCHETYPES.includes(layoutId))return {status:'failure',reasonCode:'topology-input'};
  const rng=topologyStream({familyId,tier,seed,generatorVersion});
  let lastRejection=null;
  for(let attempt=0;attempt<maxAttempts;attempt++) {
    const archetype=layoutId||rng.pick(ARCHETYPES),packing=familyId==='hollow-bough',tiles=baseline(archetype,packing);
    const tileMap=new Map(tiles.map(t=>[`${t.q},${t.r}`,t])),deployment=[];
    for(const proposed of [offsetKey(2,3),offsetKey(2,4),offsetKey(2,5)]) {
      const eligible=tiles.filter(t=>walkable(t,false)&&hexDistance(`${t.q},${t.r}`,proposed)<=3).map(t=>`${t.q},${t.r}`).sort((a,b)=>hexDistance(a,proposed)-hexDistance(b,proposed)||compareHex(a,b));
      deployment.push(eligible.find(id=>!deployment.includes(id)));
    }
    const defaults={control:offsetKey(4,4),number:offsetKey(8,4),shape:packing?offsetKey(3,4):offsetKey(9,1),sustain:offsetKey(8,7),alcove:offsetKey(10,3),orchard:offsetKey(10,5)};
    if(reservedHexes.some(id=>!walkable(tileMap.get(id),false)))return {status:'failure',reasonCode:'reserved-footprint-blocked'};
    const anchors={},reserved=new Set([...deployment,...reservedHexes]),patch=[];
    if(reservedHexes.length)for(const tile of tiles.filter(t=>t.terrain==='bridge'))for(const id of neighbourKeys(`${tile.q},${tile.r}`))if(walkable(tileMap.get(id),false))reserved.add(id);
    if(packing)for(let q=-2;q<=2;q++)for(let r=-2;r<=2;r++)if(Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))<=2){const centre=parse(defaults.shape),id=`${q+centre[0]},${r+centre[1]}`;patch.push(id);reserved.add(id);}
    for(const [role,proposed]of Object.entries(defaults)) {
      let choices=tiles.filter(t=>walkable(t,false)&&hexDistance(`${t.q},${t.r}`,proposed)<=3).map(t=>`${t.q},${t.r}`).sort((a,b)=>hexDistance(a,proposed)-hexDistance(b,proposed)||compareHex(a,b));
      if(!reference&&!(packing&&role==='shape')) {
        const local=rng.shuffle([proposed,...neighbourKeys(proposed)]).filter(id=>choices.includes(id));choices=[...local,...choices.filter(id=>!local.includes(id))];
      }
      const selected=choices.find(id=>!reserved.has(id)||packing&&role==='shape'&&id===proposed);
      if(!selected)break;anchors[role]=selected;reserved.add(selected);
    }
    if(Object.keys(anchors).length!==6||patch.some(id=>!walkable(tileMap.get(id),false)))continue;
    const initialMetrics=topologyMetrics({tiles,anchors,deployment});
    if(!initialMetrics.connected||!initialMetrics.spacing||initialMetrics.controlCost>6||initialMetrics.numberCost>5||initialMetrics.directCosts.some(c=>c>12)||initialMetrics.alcoveCost>15||initialMetrics.exclusiveEdges<2){lastRejection={metrics:initialMetrics,anchors};continue;}
    for(const id of [...reserved])for(const n of neighbourKeys(id))if(walkable(tileMap.get(n),false))reserved.add(n);
    const decorative=rng.shuffle(tiles.filter(t=>t.terrain==='floor'&&!reserved.has(`${t.q},${t.r}`)));
    const count=['hedges','terraces'].includes(archetype)?rng.int(4,6):rng.int(6,10);
    let additions=0;
    for(const tile of decorative) {
      if(additions>=count&&tiles.filter(t=>walkable(t,true)).length<=86)break;
      tile.terrain='hedge';
      const metrics=topologyMetrics({tiles,anchors,deployment});
      if(!metrics.connected||metrics.open<70||metrics.closed<66||metrics.controlCost>6||metrics.numberCost>5||metrics.directCosts.some(c=>c>12)||metrics.alcoveCost>15)tile.terrain='floor';else additions++;
    }
    const rootChoices=rng.shuffle(tiles.filter(t=>t.terrain==='floor'&&!reserved.has(`${t.q},${t.r}`)));
    let roots=0;const rootCount=rng.int(4,8);
    for(const tile of rootChoices){if(roots>=rootCount)break;tile.terrain='roots';if(topologyMetrics({tiles,anchors,deployment}).valid)roots++;else tile.terrain='floor';}
    const metrics=topologyMetrics({tiles,anchors,deployment});
    if(!metrics.valid||roots<4){lastRejection={metrics,roots,additions,anchors};continue;}
    const cleanTiles=tiles.map(({c,...t})=>t);
    return {status:'success',layoutId:archetype,attempt,tiles:cleanTiles,anchors,deployment,patchCells:patch,metrics,structuralFingerprint:structuralFingerprint(cleanTiles,anchors)};
  }
  return {status:'unknown',reasonCode:'topology-attempt-budget',attempts:maxAttempts,lastRejection};
}
