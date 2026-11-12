import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import manifest from './manifest.json' with {type:'json'};
import {ORCHARD_V2_ART} from './runtime-art.js';
import {orchardArtFor,orchardHeroPose,orchardPortraitFor} from './renderer.js';
import {orchardRosterProfiles,replayRun} from '../index.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';

test('embedded slice artwork matches reviewed offline derivatives and preflight evidence',()=>{
  let total=0;
  assert.equal(Object.keys(manifest.assets).length,75);
  for(const id of ['equation-frame','hero-wicker-rear','hero-wicker-action','hero-wicker-exhausted'])assert.ok(manifest.assets[id]?.manualPreflightReview,id);
  for(const [id,asset]of Object.entries(manifest.assets)){
    const bytes=Buffer.from(ORCHARD_V2_ART[id].split(',')[1],'base64');total+=bytes.length;
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),asset.sha256);assert.equal(bytes.length,asset.bytes);
    for(const p of Object.values(asset.qaPaths))assert.ok(fs.existsSync(new URL(`../../../${p}`,import.meta.url)));
  }
  assert.equal(total,manifest.selectedBytes);assert.ok(total<=12*1024*1024);
  for(const id of Object.keys(orchardRosterProfiles()))assert.ok(manifest.assets[`hero-${id}-idle`],`Missing production hero ${id}`);
});
test('Turning Ravine Crosswind uses reviewed existing idle and defeated identities',()=>{
  const state={blueprint:{familyId:'turning-ravine',enemies:[{id:'rewinder-1',artId:'crosswind'}]},events:[]};
  for(const defeated of [false,true]){
    const sprite=orchardArtFor({id:'rewinder-1',kind:'enemy',defeated},state),id=`enemy-crosswind-${defeated?'defeated':'idle'}`;
    assert.equal(sprite.url,ORCHARD_V2_ART[id]);assert.equal(sprite.fallback,false);assert.ok(manifest.assets[id].manualPreflightReview);
    assert.equal(sprite.width,384);assert.equal(sprite.height,384);
  }
});
test('actual Unequal enemy identities resolve both states without a fallback',()=>{
  for(const artId of ['hookmole','scruffcrow','strawling']){
    const state={blueprint:{familyId:'unequal-crossing',enemies:[{id:'enemy-1',artId}]},events:[]};
    for(const defeated of [false,true]){
      const sprite=orchardArtFor({id:'enemy-1',kind:'enemy',defeated},state),id=`enemy-${artId}-${defeated?'defeated':'idle'}`;
      assert.ok(sprite,id);assert.equal(sprite.url,ORCHARD_V2_ART[id]);assert.equal(sprite.fallback,false);
      assert.ok(sprite.anchor[0]>0&&sprite.anchor[1]<=384);
      if(artId!=='hookmole')assert.ok(manifest.assets[id].manualPreflightReview);
    }
  }
  const repaired=manifest.assets['enemy-scruffcrow-idle'];
  assert.ok(repaired.visibleBounds.every((v,i)=>i<2?v>0:v<384));
});
test('hero poses follow real holding, action points and movement events with a recorded fallback',()=>{
  const state={blueprint:{enemies:[]},events:[{type:'hero-moved',heroId:'pip',from:'0,1',to:'0,0'}]};
  assert.equal(orchardHeroPose({id:'pip',ap:1,hp:5},state),'idle');
  assert.equal(orchardArtFor({id:'furrow',kind:'hero',ap:1,hp:11},{...state,events:[{type:'hero-moved',heroId:'furrow',from:'0,4',to:'6,3'}]}).url,ORCHARD_V2_ART['hero-furrow-idle']);
  assert.equal(orchardPortraitFor('furrow').url,ORCHARD_V2_ART['hero-furrow-idle']);
  assert.equal(orchardHeroPose({id:'pip',ap:0,hp:5},state),'exhausted');
  assert.equal(orchardHeroPose({id:'pip',ap:0,hp:5,holding:'number'},state),'action');
  assert.equal(orchardHeroPose({id:'pip',ap:0,hp:0,holding:'number'},state),'exhausted');
  const fallback=orchardArtFor({id:'warden',kind:'hero',ap:0,hp:5,holding:'number'},state);
  assert.equal(fallback.fallback,true);assert.equal(fallback.pose,'action');assert.equal(fallback.url,ORCHARD_V2_ART['hero-warden-idle']);
});
test('sprites bind foot anchors with uniform scaling and enemy states retain identity',()=>{
  const state={blueprint:{enemies:[{id:'jammer-1',artId:'hookmole'}]}};
  for(const entity of [{id:'pip',kind:'hero'},{id:'tuppence',kind:'hero'},{id:'jammer-1',kind:'enemy'},{id:'jammer-1',kind:'enemy',defeated:true}]){
    const sprite=orchardArtFor(entity,state);assert.ok(sprite);assert.equal(sprite.scale*(sprite.visibleBounds[3]-sprite.visibleBounds[1]),entity.kind==='hero'?66:88);assert.equal(sprite.width,sprite.height);assert.ok(sprite.anchor[0]>0&&sprite.anchor[1]<=sprite.height);
    if(entity.kind==='hero')assert.deepEqual(sprite.groundOffset,[0,8]);
  }
  assert.equal(orchardArtFor({id:'shape',kind:'station'},state),null);
  assert.equal(orchardArtFor({id:'orchard',kind:'orchard'},state).url,ORCHARD_V2_ART['hero-ninefoldtree-idle']);
});
test('certified Wicker teams use repaired state poses and preserve withheld action fallbacks',()=>{
  for(const [pose,hero,events]of [['rear',{id:'wicker',ap:1,hp:5},[{type:'hero-moved',heroId:'wicker',from:'0,1',to:'0,0'}]],['action',{id:'wicker',ap:0,hp:5,holding:'shape'},[]],['exhausted',{id:'wicker',ap:0,hp:5},[]]]){
    const sprite=orchardArtFor({...hero,kind:'hero'},{blueprint:{enemies:[]},events});
    const standingPose=pose==='rear'?'idle':pose;
    assert.equal(sprite.pose,standingPose);assert.equal(sprite.fallback,false);assert.equal(sprite.url,ORCHARD_V2_ART[`hero-wicker-${standingPose}`]);
    const asset=manifest.assets[`hero-wicker-${pose}`];assert.ok(asset.visibleBounds[0]>0&&asset.visibleBounds[2]<384);assert.ok(asset.bytes<=70*1024);
  }
  for(const id of ['hero-cobweb-exhausted','hero-warden-action','hero-cornix-action'])assert.equal(manifest.assets[id],undefined);
});

test('fifteen imported poses resolve actual recorded holds and AP0 states without fallback',()=>{
  registerOrchardPuzzleHooks();
  const staged=JSON.parse(fs.readFileSync(new URL('../../../assets/expeditions/production/9fo/v2/pose-staging-20261005/staged-manifest.json',import.meta.url),'utf8'));
  const accepted=staged.assets.filter(a=>a.gateStatus==='alpha-and-margins-pass');assert.equal(accepted.length,15);
  for(const a of accepted){
    const evidence=a.evidence.find(e=>e.sourceScope==='actual browser record');assert.ok(evidence,a.id);
    const raw=fs.readFileSync(new URL(`../../../${evidence.file}`,import.meta.url));assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),evidence.sourceSha256);
    const record=JSON.parse(raw),replay=replayRun({initialRun:record.initialRun,commands:record.commands.slice(0,evidence.firstCommand)});assert.equal(replay.ok,true,a.id);
    const heroId=a.id.replace(/^hero-/,'').replace(/-(action|exhausted)$/,''),hero=replay.state.heroes.find(h=>h.id===heroId),sprite=orchardArtFor({...hero,kind:'hero'},replay.state);
    assert.equal(sprite.fallback,false,a.id);assert.equal(sprite.url,ORCHARD_V2_ART[a.id]);assert.equal(manifest.assets[a.id].sha256,a.sha256);assert.deepEqual(sprite.anchor,a.groundAnchor);assert.equal(sprite.scale*(a.visibleBounds[3]-a.visibleBounds[1]),66);
  }
});

test('three unresolved poses retain explicit labelled idle fallbacks',()=>{
  const state={blueprint:{enemies:[]},events:[]};
  for(const hero of [{id:'cobweb',ap:0,hp:14},{id:'warden',ap:0,hp:16,holding:'number'},{id:'cornix',ap:0,hp:12,holding:'number'}]){
    const sprite=orchardArtFor({...hero,kind:'hero'},state);assert.equal(sprite.fallback,true);assert.equal(sprite.url,ORCHARD_V2_ART[`hero-${hero.id}-idle`]);
  }
});
test('actual Amberly hold uses complete repaired working pose without idle fallback',()=>{
  const sprite=orchardArtFor({id:'amberly',kind:'hero',ap:0,hp:16,holding:'sustain'},{blueprint:{enemies:[]},events:[]});
  assert.equal(sprite.pose,'action');assert.equal(sprite.fallback,false);assert.equal(sprite.url,ORCHARD_V2_ART['hero-amberly-action']);
  const a=manifest.assets['hero-amberly-action'];assert.ok(a.manualPreflightReview);
  assert.ok(a.visibleBounds[0]>0&&a.visibleBounds[1]>0&&a.visibleBounds[2]<384&&a.visibleBounds[3]<384);
  assert.equal(sprite.anchor[0],206);assert.equal(sprite.anchor[1],a.visibleBounds[3]);assert.deepEqual(sprite.groundOffset,[0,8]);
});
