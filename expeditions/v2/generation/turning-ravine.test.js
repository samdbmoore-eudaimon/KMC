import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {generateTurningRavineCandidate,placeRavineTracks,generateRavinePuzzle} from './turning-ravine.js';
import {neighbourKeys,validateBlueprint} from '../index.js';
import {evaluateEquation} from '../puzzles/rotation.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';
import {replayRun,hashValue} from '../run.js';

registerOrchardPuzzleHooks();
const evidence=new URL('../../../docs/expeditions/v2/evidence/turning-ravine-20261003/',import.meta.url);
const read=name=>JSON.parse(fs.readFileSync(new URL(name,evidence),'utf8'));

function independentTrue(values){
  const equals=values.flatMap((value,i)=>value==='='?[i]:[]);
  if(equals.length!==1||values.some((v,i)=>i%2===0?!Number.isInteger(v)||v<0||v>100:!['=','+','−','×','÷'].includes(v)))return false;
  function side(start,end){
    let n=BigInt(values[start]);
    for(let i=start+1;i<end;i+=2){
      const right=BigInt(values[i+1]);
      switch(values[i]){
        case '+':n+=right;break;
        case '−':n-=right;break;
        case '×':n*=right;break;
        case '÷':if(right===0n||n%right!==0n)return null;n/=right;break;
        default:return null;
      }
      if(n<0n||n>100n)return null;
    }
    return n;
  }
  const left=side(0,equals[0]),right=side(equals[0]+1,values.length);
  return left!==null&&right!==null&&left===right;
}

test('Ravine T1 construction has adjacent shared wheels and preserves barriers and pressure',()=>{
  for(const layoutId of ['river','hedges']){
    const generated=generateTurningRavineCandidate({seed:1,layoutId});
    assert.equal(generated.status,'success');assert.deepEqual(generateTurningRavineCandidate({seed:1,layoutId}),generated);
    const bp=generated.blueprint,p=bp.puzzle,variables=p.tokens.filter(t=>t.faces);
    assert.equal(validateBlueprint(bp).ok,true);assert.equal(bp.deadline,5);assert.equal(bp.orchardMaxIntegrity,20);
    assert.equal(variables.length,6);assert.equal(variables.filter(t=>t.kind==='number').length,4);
    assert.equal(new Set(p.tokens.map(t=>t.hex)).size,p.tokens.length);
    for(const token of variables.filter(t=>t.kind==='operator'))assert.deepEqual(token.faces,['=','+','−','×','÷',null]);
    for(const track of p.tracks){
      assert.equal(track.tokenIds.length,5);
      const hexes=track.tokenIds.map(id=>p.tokens.find(t=>t.id===id).hex);
      hexes.slice(1).forEach((hex,i)=>assert.ok(neighbourKeys(hexes[i]).includes(hex)));
    }
    for(const token of p.tokens){const tile=bp.tiles.find(t=>`${t.q},${t.r}`===token.hex);assert.ok(!['water','hedge','gate'].includes(tile.terrain));assert.ok(!tile.passageOutputId);}
    assert.ok(generated.mathematicalEvidence.sharedNumbers.length>=2);
    assert.ok(generated.mathematicalEvidence.initialChanged>=3);assert.ok(generated.mathematicalEvidence.initialTrueTracks<=1);
    assert.equal(bp.commission.poweredCount,2);assert.equal(p.minimumTrueTracksForCommission,3);
    assert.equal(bp.enemies[0].ruleId,'rewinder');assert.equal(bp.enemies[0].wakePhase,2);
    assert.equal(bp.certificateId,null);assert.equal(generated.certified,false);
    for(const site of bp.stations.filter(s=>['number','shape','sustain'].includes(s.id))){assert.equal(site.capacity,4);assert.equal(site.maxIntegrity,12);}
  }
});

test('independent BigInt enumeration finds precisely one full six-wheel solution',()=>{
  const {puzzle}=generateRavinePuzzle({seed:1,layoutId:'hedges'}),variables=puzzle.tokens.filter(t=>t.faces),map=new Map(puzzle.tokens.map(t=>[t.id,t]));
  let solutions=0,found;
  for(let encoding=0;encoding<6**6;encoding++){
    let remaining=encoding;const readings={},orientations={};
    for(const token of variables){const face=remaining%6;remaining=Math.floor(remaining/6);readings[token.id]=token.faces[face];orientations[token.id]=(6-face)%6;}
    if(puzzle.tracks.every(track=>independentTrue(track.tokenIds.map(id=>map.get(id).faces?readings[id]:map.get(id).value)))){solutions++;found=orientations;}
  }
  assert.equal(solutions,1);assert.deepEqual(found,puzzle.solutionParameters.orientations);
});

test('reference wins independently replay every reducer hash and use distinct direct circuits',()=>{
  const candidate=read('t1-reference-candidate.json'),proof=read('t1-reference-proof.json');
  assert.deepEqual(generateTurningRavineCandidate({seed:1,layoutId:'hedges'}),candidate);
  assert.equal(hashValue(candidate.blueprint),proof.contentHash);assert.equal(proof.runtimeAvailable,false);
  const traces=['common-direct','common-alternate','higher-band-alcove'].map(name=>read(`${name}-winning-trace.json`));
  for(const trace of traces){const replay=replayRun(trace,{recordHashes:true});assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');assert.ok(replay.state.round<=5);assert.deepEqual(replay.hashes,trace.perCommandHashes);}
  assert.notDeepEqual(traces[0].outputChoice,traces[1].outputChoice);
  assert.ok(traces[2].commands.some(c=>JSON.stringify(c).includes('alcove')));
});

test('actual controller UI run independently replays a round-five win and one first-clear award',()=>{
  const trace=read('ui-winning-trace.json'),progress=read('ui-win-progress.json'),edited=read('ui-shared-wheel-trace.json');
  assert.equal(edited.commands.length,1);assert.equal(edited.commands[0].type,'edit-draft');
  const initial=replayRun(edited);assert.equal(initial.ok,true);assert.ok(initial.state.heroes.every(hero=>hero.ap===2));
  assert.ok(Object.values(initial.state.activeOutputs).every(value=>!value));
  const replay=replayRun(trace,{recordHashes:true});assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');
  assert.equal(replay.state.round,5);assert.equal(trace.commands.length,32);assert.equal(progress.stars,3);
  assert.match(fs.readFileSync(new URL('ui-win-dom.txt',evidence),'utf8'),/The orchard is safe[\s\S]*3 stars awarded/);
});

test('bounded placement and unsupported tiers never claim certification',()=>{
  assert.equal(placeRavineTracks({nodeBudget:0}).reasonCode,'ravine-footprint-budget');
  assert.equal(generateRavinePuzzle({maxAttempts:0}).reasonCode,'ravine-puzzle-attempt-budget');
  assert.equal(generateTurningRavineCandidate({tier:5,layoutId:'river'}).status,'unknown','river does not fit the T5 footprint');
});

test('exact equation arithmetic rejects fractional, zero and out-of-range intermediate values',()=>{
  for(const values of [[7,'÷',2,'=',3],[0,'÷',0,'=',0],[99,'+',2,'=',100],[2,'−',3,'=',0],[5,'÷',2,'×',2,'=',5]])assert.equal(evaluateEquation(values).valid,false);
  for(const values of [[12,'÷',3,'=',4],[0,'×',100,'=',0],[2,'+',3,'×',4,'=',20]])assert.equal(evaluateEquation(values).powered,true);
});

test('Ravine T2: seven variable wheels, three operator wheels, two shared numbers, one proven full solution',()=>{
  let built=0;
  for(const layoutId of ['river','hedges'])for(const seed of [1,2,3]){
    const generated=generateTurningRavineCandidate({tier:2,seed,layoutId});
    if(generated.status!=='success'){assert.equal(generated.status,'unknown');continue;}
    built++;assert.deepEqual(generateTurningRavineCandidate({tier:2,seed,layoutId}),generated,'deterministic');
    const bp=generated.blueprint,p=bp.puzzle,variables=p.tokens.filter(t=>t.faces);
    assert.equal(validateBlueprint(bp).ok,true);assert.equal(bp.tier,2);
    assert.equal(variables.length,7);assert.equal(variables.filter(t=>t.kind==='operator').length,3);assert.equal(variables.filter(t=>t.kind==='number').length,4);
    assert.equal(p.tracks.length,3);assert.ok(generated.mathematicalEvidence.sharedNumbers.length>=2);
    assert.equal(generated.mathematicalEvidence.fullSolutions,1);assert.equal(generated.mathematicalEvidence.exhaustive,true);
    assert.ok(generated.mathematicalEvidence.distinctOperators.length>=2);
    assert.ok(generated.mathematicalEvidence.initialChanged>=4);assert.ok(generated.mathematicalEvidence.initialTrueTracks<=1);
    for(const t of variables.filter(t=>t.kind==='operator'))assert.deepEqual([...t.faces].sort(),['=','+','−','×','÷',null].sort((a,b)=>String(a)<String(b)?-1:1).sort());
    const values=Object.fromEntries(p.tokens.map(t=>[t.id,t.faces?t.faces[((0-p.solutionParameters.orientations[t.id])%6+6)%6]:t.value]));
    for(const track of p.tracks)assert.equal(independentTrue(track.tokenIds.map(id=>values[id])),true,track.id);
  }
  assert.ok(built>=4,`only ${built} T2 candidates built`);
});

test('Ravine T2 wins through the real reducer for a direct and an alcove plan',async()=>{
  const {planOrchardBlueprint}=await import('../../../scripts/dev/orchard-v2-tactical-planner.mjs');
  const bp=generateTurningRavineCandidate({tier:2,seed:1,layoutId:'river'}).blueprint;
  for(const [cards,planFamily] of [[['cornix','kernel','beeswax'],'direct-guard'],[['cornix','warden','beeswax'],'alcove-intercept']]){
    const result=planOrchardBlueprint({blueprint:bp,teamChoices:[{cardIds:cards}],planFamily,maxStates:30000});
    assert.equal(result.status,'success',JSON.stringify(result.metrics));
    const [trace]=result.traces,replay=replayRun({initialRun:JSON.parse(JSON.stringify(trace.initialRun)),commands:trace.commands,finalStateHash:trace.finalStateHash},{recordHashes:true});
    assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');assert.deepEqual(replay.hashes,trace.perCommandHashes);assert.ok(trace.rounds<=bp.deadline);
  }
});

test('Ravine T3: eight wheels, four tracks, exact division, three-of-four mission subsets, one proven full solution',()=>{
  let built=0;
  for(const layoutId of ['river','hedges'])for(const seed of [2,3]){
    const generated=generateTurningRavineCandidate({tier:3,seed,layoutId});
    if(generated.status!=='success'){assert.equal(generated.status,'unknown');continue;}
    built++;assert.deepEqual(generateTurningRavineCandidate({tier:3,seed,layoutId}),generated,'deterministic');
    const bp=generated.blueprint,p=bp.puzzle,variables=p.tokens.filter(t=>t.faces),ev=generated.mathematicalEvidence;
    assert.equal(validateBlueprint(bp).ok,true);assert.equal(bp.tier,3);
    assert.equal(variables.length,8);assert.equal(variables.filter(t=>t.kind==='operator').length,3);assert.equal(p.tracks.length,4);
    assert.equal(p.maxActiveOutputs,3);assert.equal(bp.commission.poweredCount,3);assert.deepEqual(bp.commission.selectableOutputIds,['eq1','eq2','eq3','eq4']);
    assert.equal(ev.fullSolutions,1);assert.equal(ev.exhaustive,true);assert.equal(ev.exactDivision,true);assert.ok(ev.distinctOperators.length>=2);
    assert.ok(ev.usefulConfigurations>=2&&ev.usefulDifferingFromFull>=1);
    const values=Object.fromEntries(p.tokens.map(t=>[t.id,t.faces?t.faces[((0-p.solutionParameters.orientations[t.id])%6+6)%6]:t.value]));
    for(const track of p.tracks)assert.equal(independentTrue(track.tokenIds.map(id=>values[id])),true,track.id);
    assert.ok(p.tracks.some(t=>t.tokenIds.some(id=>values[id]==='÷')),'a division track is part of the solution');
  }
  assert.ok(built>=3,`only ${built} T3 candidates built`);
});

test('Ravine T3 wins through the real reducer on a direct plan',async()=>{
  const {planOrchardBlueprint}=await import('../../../scripts/dev/orchard-v2-tactical-planner.mjs');
  const bp=generateTurningRavineCandidate({tier:3,seed:2,layoutId:'river'}).blueprint;
  const result=planOrchardBlueprint({blueprint:bp,teamChoices:[{cardIds:['barrow','cobweb','amberly']}],planFamily:'direct-guard',maxStates:30000});
  assert.equal(result.status,'success',JSON.stringify(result.metrics));
  const [trace]=result.traces,replay=replayRun({initialRun:JSON.parse(JSON.stringify(trace.initialRun)),commands:trace.commands,finalStateHash:trace.finalStateHash},{recordHashes:true});
  assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');assert.deepEqual(replay.hashes,trace.perCommandHashes);assert.ok(trace.rounds<=bp.deadline);
});

test('Ravine T4: nine wheels, one seven-token parenthesised track, exact division, direct and alcove wins with the spec teams',async()=>{
  const {planOrchardBlueprint}=await import('../../../scripts/dev/orchard-v2-tactical-planner.mjs');
  let built=0;
  for(const seed of [2,3]){
    const generated=generateTurningRavineCandidate({tier:4,seed,layoutId:'hedges'});
    if(generated.status!=='success'){assert.equal(generated.status,'unknown');continue;}
    built++;const bp=generated.blueprint,p=bp.puzzle,ev=generated.mathematicalEvidence;
    assert.equal(validateBlueprint(bp).ok,true);assert.equal(p.tokens.filter(t=>t.faces).length,9);assert.equal(p.tracks.length,4);
    assert.ok(p.tracks.some(t=>t.tokenIds.length===7));assert.equal(ev.fullSolutions,1);assert.equal(ev.exactDivision,true);assert.ok(ev.usefulDifferingFromFull>=1);
    const values=Object.fromEntries(p.tokens.map(t=>[t.id,t.faces?t.faces[((0-p.solutionParameters.orientations[t.id])%6+6)%6]:t.value]));
    for(const track of p.tracks)assert.equal(independentTrue(track.tokenIds.map(id=>values[id])),true,track.id);
    for(const [cards,planFamily] of [[['barrow','cobweb','harvestmoon'],'direct-guard'],[['warden','longshadow','cascade'],'alcove-intercept']]){
      const result=planOrchardBlueprint({blueprint:bp,teamChoices:[{cardIds:cards}],planFamily,maxStates:40000});
      assert.equal(result.status,'success',JSON.stringify(result.metrics));
      const [trace]=result.traces,replay=replayRun({initialRun:JSON.parse(JSON.stringify(trace.initialRun)),commands:trace.commands,finalStateHash:trace.finalStateHash},{recordHashes:true});
      assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');assert.deepEqual(replay.hashes,trace.perCommandHashes);
    }
  }
  assert.ok(built>=1);
});

test('Ravine T5 (decision: four tracks, one 7-token, strike window, two hazard sites) wins with a direct and an alcove team',async()=>{
  const {planOrchardBlueprint}=await import('../../../scripts/dev/orchard-v2-tactical-planner.mjs');
  const generated=generateTurningRavineCandidate({tier:5,seed:1,layoutId:'hedges'});assert.equal(generated.status,'success');
  const bp=generated.blueprint,p=bp.puzzle;
  assert.equal(validateBlueprint(bp).ok,true);assert.equal(p.tokens.filter(t=>t.faces).length,9);assert.ok(p.tracks.some(t=>t.tokenIds.length===7));
  assert.equal(generated.mathematicalEvidence.fullSolutions,1);assert.equal(p.outputs.find(o=>o.id==='eq4').effect.kind,'strike-window');
  assert.ok(bp.hazards[0].sites.length>=1);
  for(const [cards,planFamily] of [[['warden','gossamer','harvestmoon'],'direct-guard'],[['ninebark','warden','longshadow'],'alcove-intercept']]){
    const result=planOrchardBlueprint({blueprint:bp,teamChoices:[{cardIds:cards}],planFamily,maxStates:40000});
    assert.equal(result.status,'success',JSON.stringify(result.metrics));
    const [trace]=result.traces,replay=replayRun({initialRun:JSON.parse(JSON.stringify(trace.initialRun)),commands:trace.commands,finalStateHash:trace.finalStateHash},{recordHashes:true});
    assert.equal(replay.ok,true);assert.equal(replay.state.status,'won');assert.deepEqual(replay.hashes,trace.perCommandHashes);
  }
});
