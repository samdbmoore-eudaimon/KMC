import {hashValue} from '../index.js';

export const BANK_REQUIREMENTS={entries:64,archetypes:['river','islands','hedges','terraces'],topologiesPerArchetype:8,puzzlePatterns:8};
export function transformAxial([q,r],rotation=0,reflected=false){
  if(reflected)[q,r]=[-q-r,r];
  for(let n=0;n<rotation;n++)[q,r]=[-r,q+r];
  return [q,r];
}
const sorted=values=>[...new Map(values.map(v=>[JSON.stringify(v),v])).values()].sort((a,b)=>JSON.stringify(a)<JSON.stringify(b)?-1:JSON.stringify(a)>JSON.stringify(b)?1:0);
const stationRole=station=>station.role||station.kind||(['control','number','shape','sustain','alcove'].includes(station.id)?station.id:'station');
export function canonicalTopology(blueprint){
  if(!blueprint.tiles?.length)throw Error('Topology needs tiles');
  const roles=new Map(blueprint.tiles.map(t=>[`${t.q},${t.r}`,[]])),hazards=new Map(blueprint.tiles.map(t=>[`${t.q},${t.r}`,[]]));
  const add=(map,hex,role)=>{if(!map.has(hex))throw Error('Role outside topology');map.get(hex).push(role);};
  const stations=new Map((blueprint.stations||[]).map(s=>[s.id,s]));
  for(const station of stations.values())add(roles,station.hex,stationRole(station));
  for(const [role,hex]of Object.entries(blueprint.anchors||{}))add(roles,hex,role);
  for(const hex of blueprint.deployment||[])add(roles,hex,'deployment');
  if(blueprint.orchard)add(roles,blueprint.orchard.hex,'orchard');
  const sites=new Map((blueprint.sites||[]).map(s=>[s.id,s]));
  for(const hazard of blueprint.hazards||[])for(const site of hazard.sites||[]){
    const station=stations.get(site.targetId),location=sites.get(site.targetId),hex=site.anchor||site.hex||station?.hex||location?.anchor||location?.hex;
    if(!hex)throw Error('Unresolved hazard site');
    add(hazards,hex,['environment',hazard.mutation?.kind||'none',station?stationRole(station):'passage']);
  }
  const forms=[];
  for(const reflected of [false,true])for(let rotation=0;rotation<6;rotation++){
    const records=blueprint.tiles.map(t=>{
      if(!Number.isInteger(t.q)||!Number.isInteger(t.r))throw Error('Invalid tile coordinate');
      const hex=`${t.q},${t.r}`,[q,r]=transformAxial([t.q,t.r],rotation,reflected);
      return {q,r,terrain:t.terrain,cost:t.cost??(t.terrain==='roots'?2:1),anchors:[...new Set(roles.get(hex))].sort(),passage:!!t.passageOutputId||!!t.controlledPassage,permanent:!!t.permanentPassage,hazards:sorted(hazards.get(hex).map(h=>[...h]))};
    });
    const minQ=Math.min(...records.map(t=>t.q)),minR=Math.min(...records.map(t=>t.r));
    forms.push(JSON.stringify(records.map(t=>({...t,q:t.q-minQ,r:t.r-minR})).sort((a,b)=>a.r-b.r||a.q-b.q)));
  }
  const serialization=forms.sort()[0];return {version:1,hash:hashValue(serialization),serialization};
}
function permutations(values){return values.length?values.flatMap((value,i)=>permutations(values.filter((_,j)=>i!==j)).map(rest=>[value,...rest])):[[]];}
const unitPermutations=permutations([0,1]).flatMap(bands=>permutations([0,1]).flatMap(a=>permutations([0,1]).map(b=>[...a.map(i=>bands[0]*2+i),...b.map(i=>bands[1]*2+i)])));
const cellIndex=id=>{if(!/^r[0-3]c[0-3]$/.test(id))throw Error('Invalid Sudoku member');return Number(id[1])*4+Number(id[3]);};
export function canonicalSudokuPattern(puzzle){
  if(puzzle.kind!=='sudoku4'||puzzle.size!==4)throw Error('Only Four Locks Sudoku patterns are supported');
  const givens=(puzzle.givens||[]).map(g=>({index:g.cellId?cellIndex(g.cellId):g.row*4+g.col,value:g.value}));
  if(givens.some(g=>!Number.isInteger(g.index)||g.index<0||g.index>15||![1,2,3,4].includes(g.value))||new Set(givens.map(g=>g.index)).size!==givens.length)throw Error('Invalid Sudoku givens');
  const forms=[];
  for(const transpose of [false,true])for(const rows of unitPermutations)for(const cols of unitPermutations){
    const map=i=>{const r=Math.floor(i/4),c=i%4;return transpose?cols.indexOf(c)*4+rows.indexOf(r):rows.indexOf(r)*4+cols.indexOf(c);};
    const symbols=new Map();
    // First occurrence is the lexicographic minimum over all 24 digit bijections.
    const clues=givens.map(g=>[map(g.index),g.value]).sort((a,b)=>a[0]-b[0]).map(([i,value])=>{if(!symbols.has(value))symbols.set(value,symbols.size+1);return [i,symbols.get(value)];});
    const cages=sorted((puzzle.cages||[]).map(c=>({type:'sum',members:c.cellIds.map(cellIndex).map(map).sort((a,b)=>a-b),linked:!!c.linked})));
    const protection=sorted((puzzle.lockGroups||[]).map(g=>({members:(g.memberIds||[]).map(cellIndex).map(map).sort((a,b)=>a-b),effects:[...(g.effectKinds||[])].sort()})));
    forms.push(JSON.stringify({kind:'sudoku4',clues,cages,protection}));
  }
  const serialization=forms.sort()[0];return {version:1,hash:hashValue(serialization),serialization};
}
export function auditFourLocksCoverage(entries){
  const tiers=[];
  for(let tier=1;tier<=5;tier++){
    const accepted=entries.filter(e=>e.tier===tier&&e.certified),identities=new Set(accepted.map(e=>e.topology.serialization+'|'+e.puzzle.serialization));
    const archetypes=BANK_REQUIREMENTS.archetypes.map(id=>{const found=accepted.filter(e=>e.layoutId===id),count=new Set(found.map(e=>e.topology.serialization)).size;return {id,records:found.length,topologies:count,missingTopologies:Math.max(0,8-count)};});
    const patterns=new Set(accepted.map(e=>e.puzzle.serialization)).size;
    tiers.push({tier,certifiedRecords:accepted.length,materialEntries:identities.size,missingEntries:Math.max(0,64-identities.size),archetypes,puzzlePatterns:patterns,missingPuzzlePatterns:Math.max(0,8-patterns),complete:identities.size>=64&&archetypes.every(a=>a.topologies>=8)&&patterns>=8});
  }
  return {requirements:BANK_REQUIREMENTS,tiers,complete:tiers.every(t=>t.complete)};
}
