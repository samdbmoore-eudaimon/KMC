import {generateDisplacedTopology,validatePassageCuts,buildPassageBaseline} from './displaced-topology.js';
import {topologyStream,topologyMetrics,shortestTopologyPaths,ARCHETYPES} from './topology.js';
import {generateFourLocksPuzzle,fourLocksOutputs} from './four-locks.js';
import {crossingExitViolations} from './crossing-invariants.js';
import {canonicalTopology,canonicalSudokuPattern} from './bank.js';
import {validateBlueprint,CHARGE_CAPACITY,stationMaxIntegrity,orchardMaxIntegrity,hashValue,offsetKey,neighbourKeys,hexDistance,compareHex} from '../index.js';

export const DISPLACED_FOUR_LOCKS_PACKET='four-locks-displaced-v1';
export function assembleDisplacedFourLocks(topology){
  if(topology?.status!=='success'||topology.packetId!=='passage-displacement-v1'||topology.tier!==1||!Number.isInteger(topology.seed)||topology.seed<0||topology.seed>0xffffffff||!ARCHETYPES.includes(topology.layoutId))return {status:'failure',reasonCode:'displaced-packet-identity'};
  let metrics,cuts;
  try{
    metrics=topologyMetrics(topology);cuts=validatePassageCuts(topology);
    const declared=buildPassageBaseline(topology.layoutId,topology.deltas),map=new Map(topology.tiles.map(t=>[`${t.q},${t.r}`,t]));
    if(hashValue(declared.cuts)!==hashValue(topology.cuts)||declared.tiles.filter(t=>['water','hedge'].includes(t.terrain)).some(t=>map.get(`${t.q},${t.r}`)?.terrain!==t.terrain))return {status:'failure',reasonCode:'displaced-passage-parameters'};
    const structural=canonicalTopology({tiles:topology.tiles,anchors:topology.anchors,deployment:topology.deployment});
    if(!metrics.valid||!cuts.valid||structural.serialization!==topology.canonical?.serialization)return {status:'failure',reasonCode:'displaced-topology-invalid'};
    const tiles=new Map(topology.tiles.map(t=>[`${t.q},${t.r}`,t])),reserved=topology.reservedHexes||[];
    if(topology.tiles.length!==92||tiles.size!==92||reserved.some(id=>!tiles.has(id)||['water','hedge','gate'].includes(tiles.get(id).terrain)||tiles.get(id).passageOutputId))return {status:'failure',reasonCode:'displaced-footprint-invalid'};
  }catch{return {status:'failure',reasonCode:'displaced-topology-invalid'};}
  const {anchors,deployment,seed,layoutId}=topology,tiles=structuredClone(topology.tiles),tier=1;
  const maths=generateFourLocksPuzzle({tier,seed,controlHex:anchors.control});if(maths.status!=='success')return maths;
  const names={control:'Ledger control',number:'Ledger bus',shape:'Bridge brace',sustain:'Tree maintenance',alcove:'Brace alcove'},used=new Set([...deployment,...Object.values(anchors),...(topology.reservedHexes||[])]);
  const rng=topologyStream({familyId:'four-locks',tier,seed,generatorVersion:2},`${DISPLACED_FOUR_LOCKS_PACKET}|entities`),north=offsetKey(10,2);
  const position=rng.shuffle([north,...neighbourKeys(north)]).find(id=>!used.has(id)&&deployment.every(d=>hexDistance(id,d)>=5)&&hexDistance(id,anchors.control)>=3&&tiles.some(t=>`${t.q},${t.r}`===id&&!['water','hedge','gate'].includes(t.terrain)&&!t.passageOutputId)&&shortestTopologyPaths(tiles,id,{open:false}).costs.has(anchors.control));
  if(!position)return {status:'unknown',reasonCode:'displaced-enemy-placement'};
  const sites=tiles.filter(t=>t.passageOutputId).sort((a,b)=>compareHex(`${a.q},${a.r}`,`${b.q},${b.r}`)).map((t,i)=>({id:i?`controlled-passage-${i}`:'controlled-passage',anchor:`${t.q},${t.r}`}));
  const blueprint={schemaVersion:2,moduleKey:'primary',familyId:'four-locks',tier,seed,parameterSeed:seed,generatorVersion:2,rulesVersion:2,attempt:topology.attempts-1,layoutId,tiles,constructionPacket:{id:DISPLACED_FOUR_LOCKS_PACKET,version:1,topologyPacketId:topology.packetId,parameters:{tier,seed,layoutId,maxAttempts:256,reservedHexes:[...(topology.reservedHexes||[])],deltas:[...topology.deltas]},sourceTopologyHash:hashValue(topology)},
    stations:Object.entries(names).map(([id,name])=>({id,hex:anchors[id],name,artId:id==='sustain'?'terrain-apple-tree-v1':id==='shape'?'mechanism-plinth':'mechanism-hive-ledger-board-v1',...(id==='alcove'?{}:{maxIntegrity:stationMaxIntegrity(tier)}),...(['number','shape','sustain'].includes(id)?{capacity:CHARGE_CAPACITY[tier-1]}:{})})),
    puzzle:maths.puzzle,outputs:fourLocksOutputs(),enemies:[{id:'jammer-1',ruleId:'jammer',artId:'hookmole',position,wakePhase:2}],hazards:[{id:'root-drain',sites:[{id:'sustain-site',targetId:'sustain'}],mutation:{kind:'none'}}],sites,deployment:[...deployment],deadline:5,orchard:{hex:anchors.orchard,name:'Ninefold tree',artId:'terrain-apple-tree-v1'},orchardMaxIntegrity:orchardMaxIntegrity(tier),certificateId:null,commission:{poweredCount:2,selectableOutputIds:['bridge','shelter','roots','storm']}};
  const crossings=crossingExitViolations(blueprint);if(crossings.length)return {status:'failure',reasonCode:'crossing-exit-blocked',violations:crossings};
  const schema=validateBlueprint(blueprint);if(!schema.ok)return {status:'failure',reasonCode:'displaced-blueprint-schema',errors:schema.errors};
  const finalMetrics=topologyMetrics({tiles:blueprint.tiles,anchors,deployment:blueprint.deployment});if(!finalMetrics.valid)return {status:'failure',reasonCode:'displaced-final-paths'};
  const canonical={topology:canonicalTopology(blueprint),puzzle:canonicalSudokuPattern(blueprint.puzzle)};
  return {status:'success',packetId:DISPLACED_FOUR_LOCKS_PACKET,blueprint,topologyEvidence:{metrics:finalMetrics,cutEvidence:cuts,routeEvidence:topology.routeEvidence},mathematicalEvidence:maths.mathematicalEvidence,puzzleFingerprint:canonical.puzzle.hash,structuralFingerprint:canonical.topology.hash,canonical,certified:false};
}
export function generateDisplacedFourLocksCandidate({tier=1,seed,layoutId,maxAttempts=256,reservedHexes=[],deltas=null,sourceTopologyHash=null}={}){
  if(tier!==1)return {status:'failure',reasonCode:'displaced-packet-identity'};
  const topology=generateDisplacedTopology({tier,seed,layoutId,maxAttempts,reservedHexes});
  if(topology.status==='success'&&((deltas&&hashValue(deltas)!==hashValue(topology.deltas))||(sourceTopologyHash&&sourceTopologyHash!==hashValue(topology))))return {status:'failure',reasonCode:'displaced-reconstruction-mismatch'};
  return topology.status==='success'?assembleDisplacedFourLocks(topology):topology;
}
