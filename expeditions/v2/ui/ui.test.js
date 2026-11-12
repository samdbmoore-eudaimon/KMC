import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {SIDE,projectHex,hexVertices,worldBounds,overviewCamera,clampCamera,zoomCamera,viewportCamera,screenToWorld,hitHex} from './viewport.js';
import {reasonText,eventText,hazardText,intentText} from './feedback.js';

const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);
test('pointy hex spacing and shared edges match tactical axial coordinates',()=>{
  const origin=projectHex('0,0'),east=projectHex('1,0'),south=projectHex('0,1');
  close(east.x-origin.x,Math.sqrt(3)*SIDE);close(south.x-origin.x,Math.sqrt(3)*SIDE/2);close(south.y-origin.y,1.5*SIDE);
  const vertices=hexVertices('0,0');
  close(Math.max(...vertices.map(p=>p.x))-Math.min(...vertices.map(p=>p.x)),Math.sqrt(3)*SIDE);
  close(Math.max(...vertices.map(p=>p.y))-Math.min(...vertices.map(p=>p.y)),2*SIDE);
  assert.equal(vertices.filter(a=>hexVertices('1,0').some(b=>Math.hypot(a.x-b.x,a.y-b.y)<1e-8)).length,2);
});
test('zoom keeps the pointed world position fixed and hit polygons follow camera',()=>{
  const camera={x:109,y:82,scale:.8},point={x:301,y:208},before=screenToWorld(point,camera),next=zoomCamera(camera,1.25,point),after=screenToWorld(point,next);
  close(before.x,after.x);close(before.y,after.y);
  const tiles=[{q:0,r:0},{q:1,r:0},{q:0,r:1}];
  for(const tile of tiles){const centre=projectHex(tile);assert.equal(hitHex({x:centre.x*next.scale+next.x,y:centre.y*next.scale+next.y},next,tiles),tile);}
  assert.equal(hitHex({x:-1000,y:-1000},next,tiles),null);
});
test('camera clamps the world and centres boards smaller than the viewport',()=>{
  const bounds=worldBounds([{q:0,r:0},{q:10,r:8}]);
  const camera=clampCamera({x:90000,y:-90000,scale:9},bounds,390,700);
  assert.equal(camera.scale,2);close(camera.x,-bounds.left*2);close(camera.y,700-bounds.bottom*2);
  const small={left:-10,right:10,top:-20,bottom:20},centred=clampCamera({x:99,y:98,scale:.1},small,390,700);
  assert.deepEqual(centred,{x:195,y:350,scale:.45});
  for(const [width,height]of [[390,844],[844,390],[1280,720]]){const overview=overviewCamera(bounds,width,height);assert.ok(overview.scale>=.45&&overview.scale<=1);close((bounds.left+bounds.right)*overview.scale/2+overview.x,width/2);}
});

test('action and confirmation resizes retain zoom and the world point at the viewport centre',()=>{
  const bounds={left:-2000,right:2000,top:-2000,bottom:2000};
  for(const [width,oldHeight,newHeight]of [[390,306.96875,300],[768,475.078125,505.21875],[1280,382.21875,396.71875]]){
    const previous={width,height:oldHeight,runId:'mission-a'},next={width:width+20,height:newHeight,runId:'mission-a'},camera={x:-151,y:-446,scale:2},resized=viewportCamera(camera,previous,next,bounds);
    assert.equal(resized.scale,2);
    const before=screenToWorld({x:width/2,y:oldHeight/2},camera),after=screenToWorld({x:next.width/2,y:next.height/2},resized);
    close(before.x,after.x);close(before.y,after.y);
    assert.deepEqual(viewportCamera(resized,next,previous,bounds),camera);
    assert.deepEqual(viewportCamera(camera,previous,{...previous},bounds),camera);
  }
});
test('first usable viewport and a different mission initialise independently of the prior camera',()=>{
  const bounds=worldBounds([{q:0,r:0},{q:10,r:8}]),camera={x:-300,y:-400,scale:2};
  for(const width of [390,768,1280]){
    const next={width,height:500,runId:'mission-b'},first=viewportCamera(camera,null,next,bounds),replacement=viewportCamera(camera,{...next,runId:'mission-a'},next,bounds);
    assert.deepEqual(first,replacement);
    if(width<600)assert.deepEqual(first,overviewCamera(bounds,width,500));else assert.equal(first.scale,1);
  }
});
test('resize preserves zoom while clamping edges and centring a smaller world',()=>{
  const bounds={left:0,right:1000,top:0,bottom:1000},previous={width:390,height:300,runId:'a'},next={width:900,height:700,runId:'a'};
  const edge=viewportCamera({x:0,y:-1700,scale:2},previous,next,bounds);close(edge.x,0);close(edge.y,-1300);assert.equal(edge.scale,2);
  assert.deepEqual(viewportCamera({x:10,y:20,scale:.45},previous,next,{left:-10,right:10,top:-20,bottom:20}),{x:450,y:350,scale:.45});
});

let Component;
async function loadComponent(){
  if(Component)return Component;
  const result=await build({entryPoints:[fileURLToPath(new URL('./OrchardExpedition.jsx',import.meta.url))],bundle:true,write:false,platform:'node',format:'cjs',external:['react','react-dom']});
  const require=createRequire(import.meta.url),module={exports:{}};
  new Function('require','module','exports',result.outputFiles[0].text)(require,module,module.exports);
  Component=module.exports.OrchardExpedition;return Component;
}
test('direct UI mount denies absent, wrong-name and wrong-avatar profiles before controller access',async()=>{
  const Ui=await loadComponent();let reads=0;
  const controller={resume(){reads++;throw new Error('Unauthorised controller read');}};
  for(const profile of [null,{}, {name:'sam',avatar:'card:intermediate:gf_rooke'},{name:'eudaimon',avatar:'card:primary:po_pip'}])assert.equal(Ui({profile,controller}),null);
  assert.equal(reads,0);
});
test('private gate forwards the frozen controller props only for the existing unlock profile',async()=>{
  const Ui=await loadComponent(),controller={},profile={name:'eudaimon',avatar:'card:intermediate:gf_rooke'},result=Ui({profile,controller});
  assert.equal(result.props.controller,controller);assert.equal(result.props.profile,profile);
});
test('feedback shows exact losses, protection and printed operating shortfalls',()=>{
  const state={blueprint:{orchard:{name:'Ninefold tree'},stations:[{id:'sustain',name:'Tree maintenance'}],enemies:[{id:'jammer-1',artId:'hookmole'}]},profiles:{pip:{name:'Pip'}}};
  assert.match(reasonText('hold-profile-short',{shortfalls:[{stat:4,name:'Speed',have:2,need:6}]},state),/Speed: 2; needs 6/);
  assert.equal(intentText({enemyId:'jammer-1',verb:'dormant',wakePhase:2},state),'Hookmole waits until enemy phase 2.');
  assert.match(hazardText({hazardId:'root-drain',power:4,sites:[{blocked:false,damage:3}]}),/protection 4 required.*removes 3 orchard integrity/);
  assert.match(eventText({type:'hero-damaged',heroId:'pip',power:7,armour:1,shieldAbsorbed:2,damage:4,hpBefore:16,hpAfter:12,cause:{enemyId:'jammer-1'}},state),/power 7 − armour 1 − shield 2 = 4.*16 → 12/);
  assert.match(eventText({type:'hold-cancelled',heroId:'pip',stationId:'sustain',cause:'moved',lostProtection:[{kind:'hazard',amount:6}]},state),/Pip stops holding Tree maintenance.*hazard 6/);
  assert.match(reasonText('not-enough-ap',null,state),/needs more action points/);
  assert.match(reasonText('card-exhausted',null,state),/spent/);
  assert.match(eventText({type:'puzzle-disrupted',enemyId:'jammer-1',memberId:'r0c0',outputsBefore:{bridge:true},outputsAfter:{bridge:false}},state),/Hookmole changed row 1, column 1.*bridge turned off.*activate it again/);
});
