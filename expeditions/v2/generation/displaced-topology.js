import {footprint,ARCHETYPES,topologyStream,topologyMetrics,shortestTopologyPaths} from './topology.js';
import {offsetKey,hexDistance,neighbourKeys,compareHex} from '../index.js';
import {canonicalTopology} from './bank.js';

const hex=t=>`${t.q},${t.r}`,open=t=>t&&!['water','hedge'].includes(t.terrain),closed=t=>open(t)&&!t.passageOutputId;
function specifications(layoutId){
  if(layoutId==='river')return [{axis:'column',at:6,start:0,end:8,barrier:'water',passages:[{base:2,controlled:false},{base:4,controlled:true},{base:6,controlled:false}]}];
  if(layoutId==='islands')return [4,7].map(at=>({axis:'column',at,start:0,end:8,barrier:'water',passages:[{base:2,controlled:false},{base:6,controlled:true}]}));
  if(layoutId==='hedges')return [4,8].map(at=>({axis:'column',at,start:2,end:6,barrier:'hedge',passages:[{base:3,controlled:at===4},{base:5,controlled:false}]}));
  if(layoutId==='terraces')return [3,5].map(at=>({axis:'row',at,start:2,end:9,barrier:'hedge',passages:[{base:3,controlled:false},{base:8,controlled:at===3}]}));
  throw Error('Invalid displacement archetype');
}
export function buildPassageBaseline(layoutId,deltas){
  const cuts=specifications(layoutId),count=cuts.reduce((n,c)=>n+c.passages.length,0);
  if(!Array.isArray(deltas)||deltas.length!==count||deltas.some(d=>!Number.isInteger(d)||d<-1||d>1))throw Error('Invalid passage displacement');
  const tiles=footprint();let cursor=0;
  for(const cut of cuts){
    for(const passage of cut.passages){passage.delta=deltas[cursor++];passage.position=passage.base+passage.delta;}
    if(new Set(cut.passages.map(p=>p.position)).size!==cut.passages.length)throw Error('Passage collision');
    for(const tile of tiles){
      if((cut.axis==='column'?tile.c:tile.r)!==cut.at)continue;
      const position=cut.axis==='column'?tile.r:tile.c;if(position<cut.start||position>cut.end)continue;
      const passage=cut.passages.find(p=>p.position===position);
      tile.terrain=passage?(cut.barrier==='water'?'bridge':passage.controlled?'gate':'floor'):cut.barrier;
      if(passage?.controlled)tile.passageOutputId='bridge';
    }
    for(const passage of cut.passages){
      const tile=tiles.find(t=>(cut.axis==='column'?t.c===cut.at&&t.r===passage.position:t.r===cut.at&&t.c===passage.position));
      if(!tile)throw Error('Passage outside footprint');passage.hex=hex(tile);
    }
  }
  return {tiles,cuts};
}
export function validatePassageCuts({tiles,cuts}){
  const checks=cuts.map(cut=>{
    const cells=tiles.filter(t=>(cut.axis==='column'?t.q+Math.floor(t.r/2):t.r)===cut.at&&(cut.axis==='column'?t.r:t.q+Math.floor(t.r/2))>=cut.start&&(cut.axis==='column'?t.r:t.q+Math.floor(t.r/2))<=cut.end);
    const actual=cells.filter(open),permanent=actual.filter(closed),controlled=actual.filter(t=>t.passageOutputId);
    const positions=new Set(cut.passages.map(p=>p.hex));
    const valid=cells.length===cut.end-cut.start+1&&actual.length===cut.passages.length&&permanent.length>=1&&controlled.length===cut.passages.filter(p=>p.controlled).length&&actual.length>=2&&cells.every(t=>positions.has(hex(t))?cut.passages.some(p=>p.hex===hex(t)&&!!t.passageOutputId===p.controlled):t.terrain===cut.barrier);
    return {axis:cut.axis,at:cut.at,permanent:permanent.length,controlled:controlled.length,total:actual.length,valid};
  });
  return {valid:checks.every(c=>c.valid),checks};
}
function routes(tiles,anchors,deployment){
  const paths=shortestTopologyPaths(tiles,deployment[1]),a=paths.paths.get(anchors.shape)||[],b=paths.paths.get(anchors.alcove)||[],map=new Map(tiles.map(t=>[hex(t),t]));
  const exposure=path=>path.reduce((sum,id)=>sum+neighbourKeys(id).filter(n=>map.get(n)?.terrain==='water'||map.get(n)?.passageOutputId).length,0);
  const directCost=paths.costs.get(anchors.shape)??Infinity,alcoveCost=paths.costs.get(anchors.alcove)??Infinity,directExposure=exposure(a),alcoveExposure=exposure(b);
  return {directCost,alcoveCost,directExposure,alcoveExposure,tradeoff:directCost!==alcoveCost||directExposure!==alcoveExposure};
}
export function generateDisplacedTopology({tier=1,seed,layoutId,maxAttempts=256,reservedHexes=[]}={}){
  if(!Number.isInteger(tier)||tier<1||tier>5||!Number.isInteger(seed)||seed<0||seed>0xffffffff||!ARCHETYPES.includes(layoutId)||!Number.isInteger(maxAttempts)||maxAttempts<0||maxAttempts>256||!Array.isArray(reservedHexes)||new Set(reservedHexes).size!==reservedHexes.length||reservedHexes.some(id=>typeof id!=='string'||!footprint().some(t=>hex(t)===id)))return {status:'failure',reasonCode:'displacement-options'};
  const packetId='passage-displacement-v1',rng=topologyStream({familyId:'four-locks',tier,seed},packetId),rejections={reserved:0,anchors:0,paths:0,walkable:0,roots:0,cuts:0,routeTradeoff:0};let lastRejection=null;
  for(let attempt=0;attempt<maxAttempts;attempt++){
    const deltas=[];
    for(const cut of specifications(layoutId)){const used=new Set();for(const p of cut.passages){const delta=rng.shuffle([-1,0,1]).find(d=>!used.has(p.base+d));used.add(p.base+delta);deltas.push(delta);}}
    const {tiles,cuts}=buildPassageBaseline(layoutId,deltas),tileMap=new Map(tiles.map(t=>[hex(t),t]));
    if(reservedHexes.some(id=>!closed(tileMap.get(id)))){rejections.reserved++;lastRejection={reason:'reserved-footprint-blocked',deltas};continue;}
    const reserved=new Set(reservedHexes),deployment=[];
    for(const proposed of [offsetKey(2,3),offsetKey(2,4),offsetKey(2,5)]){
      const choices=tiles.filter(t=>closed(t)&&hexDistance(hex(t),proposed)<=3&&!reserved.has(hex(t))).map(hex).sort((a,b)=>hexDistance(a,proposed)-hexDistance(b,proposed)||compareHex(a,b));
      const chosen=choices.find(id=>!deployment.includes(id));if(chosen){deployment.push(chosen);reserved.add(chosen);}
    }
    const defaults={control:offsetKey(4,4),number:offsetKey(8,4),shape:offsetKey(9,1),sustain:offsetKey(8,7),alcove:offsetKey(10,3),orchard:offsetKey(10,5)},anchors={};
    for(const [role,proposed]of Object.entries(defaults)){
      const choices=tiles.filter(t=>closed(t)&&hexDistance(hex(t),proposed)<=3).map(hex).sort((a,b)=>hexDistance(a,proposed)-hexDistance(b,proposed)||compareHex(a,b));
      const local=rng.shuffle([proposed,...neighbourKeys(proposed)]).filter(id=>choices.includes(id));
      const chosen=[...local,...choices.filter(id=>!local.includes(id))].find(id=>!reserved.has(id));
      if(chosen){anchors[role]=chosen;reserved.add(chosen);}
    }
    if(deployment.length!==3||Object.keys(anchors).length!==6){rejections.anchors++;lastRejection={reason:'anchor-placement',deltas};continue;}
    const initial=topologyMetrics({tiles,anchors,deployment});
    if(!initial.connected||!initial.spacing||initial.controlCost>6||initial.numberCost>5||initial.directCosts.some(c=>c>12)||initial.alcoveCost>15||initial.exclusiveEdges<2){rejections.paths++;lastRejection={reason:'initial-path-limits',metrics:initial,deltas};continue;}
    for(const cut of cuts)for(const passage of cut.passages)reserved.add(passage.hex);
    for(const id of [...reserved])for(const n of neighbourKeys(id))if(closed(tileMap.get(n)))reserved.add(n);
    let additions=0;const count=['hedges','terraces'].includes(layoutId)?rng.int(4,6):rng.int(6,10);
    for(const tile of rng.shuffle(tiles.filter(t=>t.terrain==='floor'&&!reserved.has(hex(t))))){
      if(additions>=count&&tiles.filter(open).length<=86)break;
      tile.terrain='hedge';const metrics=topologyMetrics({tiles,anchors,deployment});
      const reachable=shortestTopologyPaths(tiles,deployment[0],{open:false}).costs;
      if(!metrics.connected||metrics.open<70||metrics.closed<66||metrics.controlCost>6||metrics.numberCost>5||metrics.directCosts.some(c=>c>12)||metrics.alcoveCost>15||tiles.some(t=>closed(t)&&!reachable.has(hex(t))))tile.terrain='floor';else additions++;
    }
    let roots=0;const rootCount=rng.int(4,8);
    for(const tile of rng.shuffle(tiles.filter(t=>t.terrain==='floor'&&!reserved.has(hex(t))))){if(roots>=rootCount)break;tile.terrain='roots';if(topologyMetrics({tiles,anchors,deployment}).valid)roots++;else tile.terrain='floor';}
    const metrics=topologyMetrics({tiles,anchors,deployment}),cutEvidence=validatePassageCuts({tiles,cuts}),routeEvidence=routes(tiles,anchors,deployment),reachable=shortestTopologyPaths(tiles,deployment[0],{open:false}).costs;
    let reason=null;
    if(!cutEvidence.valid){rejections.cuts++;reason='cut-passage-invariant';}
    else if(!metrics.valid||tiles.some(t=>closed(t)&&!reachable.has(hex(t)))){rejections.walkable++;reason='final-walkable-path-limits';}
    else if(roots<4){rejections.roots++;reason='root-target';}
    else if(!routeEvidence.tradeoff){rejections.routeTradeoff++;reason='equal-route-cost-exposure';}
    if(reason){lastRejection={reason,metrics,cutEvidence,routeEvidence,deltas,roots};continue;}
    const cleanTiles=tiles.map(({c,...t})=>t),topology={tiles:cleanTiles,anchors,deployment};
    return {status:'success',packetId,tier,seed,layoutId,attempts:attempt+1,...topology,reservedHexes:[...reservedHexes],cuts,deltas,metrics,cutEvidence,routeEvidence,roots,additions,rejections,canonical:canonicalTopology(topology),certified:false};
  }
  return {status:'unknown',packetId,tier,seed,layoutId,reasonCode:'displacement-attempt-budget',attempts:maxAttempts,rejections,lastRejection};
}
