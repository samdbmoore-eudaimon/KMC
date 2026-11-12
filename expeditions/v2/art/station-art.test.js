import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import manifest from './station-manifest.json' with {type:'json'};
import {ORCHARD_STATION_ART} from './station-art.js';
import families from './family-manifest.json' with {type:'json'};
import {ORCHARD_FAMILY_ART} from './family-art.js';
import {orchardArtFor} from './renderer.js';
import {blueprintHash,createRun,replayRun} from '../index.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';
import {stationPresentation,stationCuePositions} from '../ui/station-state.js';
import {suggestOwnedSquad,jobShortfalls} from '../ui/squad-advice.js';
import {orchardRosterProfiles} from '../index.js';
const root=new URL('../../../',import.meta.url),read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
registerOrchardPuzzleHooks();
const record=read('docs/expeditions/v2/evidence/player-recovery/winning-replay-trace.json');

test('selected station import gate preserves exact batch hashes, bytes, metadata and budget',()=>{
  const batch=read('docs/expeditions/v2/station-art-batch-manifest.json');
  assert.equal(batch.assets.length,13);assert.equal(batch.totalRuntimeBytes,239666);
  assert.equal(Object.keys(manifest.assets).length,11);assert.equal(manifest.selectedBytes,211010);
  let selected=0;
  for(const a of batch.assets){const bytes=fs.readFileSync(new URL(a.runtimePath,root));assert.equal(bytes.length,a.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256);assert.ok(fs.existsSync(new URL(a.sourcePath,root)));
    if(manifest.assets[a.id]){assert.deepEqual(manifest.assets[a.id],a);assert.equal(ORCHARD_STATION_ART[a.id],`data:image/webp;base64,${bytes.toString('base64')}`);selected+=a.bytes;}
    else assert.equal(ORCHARD_STATION_ART[a.id],undefined,'other family candidates remain staged');}
  assert.equal(selected,manifest.selectedBytes);assert.ok(manifest.combinedSelectedBytes<12*1024*1024);
});
test('family/entity station lookup preserves certified blueprints and the separate objective tree',()=>{
  const state=createRun(record.initialRun),before=blueprintHash(state.blueprint);
  for(const s of state.blueprint.stations){const art=orchardArtFor({...s,kind:'station'},state);assert.ok(art);assert.deepEqual(art.groundOffset,[0,0]);const [left,top,right,bottom]=art.visibleBounds;for(const x of [left,right])for(const y of [top,bottom]){const dx=Math.abs((x-art.anchor[0])*art.scale),dy=Math.abs((y-art.anchor[1])*art.scale);assert.ok(dx<=Math.sqrt(3)*36/2);assert.ok(dy+dx/Math.sqrt(3)<=36+.000001);}}
  assert.equal(blueprintHash(state.blueprint),before);
  const orchard=orchardArtFor({id:'orchard',kind:'orchard'},state);assert.ok(orchard.url);assert.notEqual(orchard.url,ORCHARD_STATION_ART['four-locks-tree-maintenance-base-v1']);
  const ravine={...state,blueprint:{...state.blueprint,familyId:'turning-ravine'}};
  assert.equal(orchardArtFor({id:'sustain',kind:'station'},ravine).id,'turning-ravine-wind-stabiliser-base-v1');
  for(const s of ravine.blueprint.stations){const sprite=orchardArtFor({...s,kind:'station'},ravine);assert.ok(sprite?.url);assert.deepEqual(sprite.groundOffset,[0,0]);assert.equal(sprite.fallback,false);}
  const crossing={...state,blueprint:{...state.blueprint,familyId:'unequal-crossing'}};
  assert.equal(orchardArtFor({id:'shape',kind:'station'},crossing).id,'unequal-pan-v1');
  for(const s of crossing.blueprint.stations)assert.ok(orchardArtFor({...s,kind:'station'},crossing)?.url);
  assert.equal(orchardArtFor({id:'sustain',kind:'station'},crossing).id,'unequal-pan-v1');
  for(const [familyId,id]of [['maybe-flock','whistle-tower-v1'],['hollow-bough','living-branches-v1']]){
    const family={...state,blueprint:{...state.blueprint,familyId}};
    assert.equal(orchardArtFor({id:'shape',kind:'station'},family).id,id);
    for(const s of family.blueprint.stations)assert.ok(orchardArtFor({...s,kind:'station'},family)?.url);
  }
  assert.equal(orchardArtFor({id:'sustain',kind:'station'},{...state,blueprint:{...state.blueprint,familyId:'unknown-family'}}),null);
  assert.equal(replayRun(record).state.status,'won');
});
test('actual family props retain reviewed bytes and fit one logical hex',()=>{
  let total=0;
  for(const [id,a]of Object.entries(families.assets)){
    const bytes=fs.readFileSync(new URL(a.runtimePath,root));total+=bytes.length;
    assert.equal(bytes.length,a.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256);
    assert.equal(ORCHARD_FAMILY_ART[id],`data:image/webp;base64,${bytes.toString('base64')}`);
    for(const path of Object.values(a.qaPaths))assert.ok(fs.existsSync(new URL(path,root)));
    const art=orchardArtFor({id:'shape',kind:'station'},{blueprint:{familyId:a.familyId}}),[l,t,r,b]=art.visibleBounds;
    for(const x of [l,r])for(const y of [t,b]){
      const dx=Math.abs((x-art.anchor[0])*art.scale),dy=Math.abs((y-art.anchor[1])*art.scale);
      assert.ok(dx<=Math.sqrt(3)*36/2);assert.ok(dy+dx/Math.sqrt(3)<=36+.000001);
    }
  }
  assert.equal(total,families.selectedBytes);assert.equal(total,96660);
});
test('ready, held and damage stack without inventing control or alcove stores',()=>{
  const state=createRun(record.initialRun);
  for(const id of ['number','shape','sustain']){state.stationStates[id].charge=4;state.stationStates[id].integrity=10;state.holds[id]={heroId:'furrow'};assert.deepEqual(stationPresentation(state,id).cues,['ready','working','damage']);}
  assert.ok(!stationPresentation(state,'control').lines.some(l=>l.startsWith('Power')));
  assert.match(stationPresentation(state,'alcove').label,/Not prepared.*Bridge damaged/);assert.ok(!stationPresentation(state,'alcove').lines.some(l=>/Power|Integrity|Held/.test(l)));
  state.preparedAlcove=true;state.holds.alcove={heroId:'furrow'};assert.deepEqual(stationPresentation(state,'alcove').cues,['prepared','damage','working']);
  assert.equal(stationPresentation(state,'alcove').holder,'furrow');
  state.events=[{type:'edit-draft'}];assert.match(stationPresentation(state,'control').label,/Inactive/);
  state.events.push({type:'puzzle-disrupted'});assert.match(stationPresentation(state,'control').label,/Corrupted/);
  state.stationStates.control.integrity=10;const cues=stationPresentation(state,'control').cues;assert.deepEqual(cues,['corrupted','damage']);
  const sprite=orchardArtFor({id:'control',kind:'station'},state);
  for(const zoom of [.45,1,2]){const positions=stationCuePositions(sprite,cues,zoom);assert.equal(Math.round((positions.damage[0]-positions.corrupted[0])*zoom),24);assert.equal(positions.damage[1],positions.corrupted[1]);}
  state.puzzleValid=true;assert.deepEqual(stationPresentation(state,'control').cues,['ready','damage']);
});
test('owned squad suggestions assign three distinct eligible cards, respect tier and alcove speed, and decline impossible collections',()=>{
  const roster=orchardRosterProfiles(),all=Object.keys(roster);
  const suggestion=suggestOwnedSquad(roster,all,1);assert.equal(new Set(suggestion.ids).size,3);suggestion.ids.forEach((id,i)=>assert.equal(jobShortfalls(roster[id],1,['number','shape','sustain'][i],suggestion.alcove&&i===1).length,0));
  assert.equal(suggestOwnedSquad(roster,['pip','nine','bramble'],1),null);
  assert.match(jobShortfalls(roster.pip,1,'number').join(' '),/Arithmetic 1\/4/);
  const alt=suggestOwnedSquad(roster,['tuppence','dapple','sorrel'],1);assert.equal(alt?.alcove,true);assert.equal(alt.ids[1],'dapple');
  assert.equal(suggestOwnedSquad(roster,['tuppence','furrow','sorrel'],5),null);
});
