import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {placeSelectedInfo,selectedHeroInfo} from './selected-info.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';
import {replayRun,stateHash} from '../run.js';

test('selected information finds free screen space around controls and foreground figures',()=>{
  for(const [width,height]of [[390,300],[768,475],[1280,382]]){
    const controls=[{x:0,y:0,width:220,height:120},{x:width-160,y:0,width:160,height:70},{x:0,y:height-50,width:width,height:50}],figures=[{x:width/2-75,y:110,width:150,height:70}];
    const box=placeSelectedInfo({x:width/2,y:200},{width,height},controls,figures);
    assert.equal(box.controlOverlap,0);assert.equal(box.figureOverlap,0);
    assert.ok(box.x>=4&&box.y>=4&&box.x+box.width<=width-4&&box.y+box.height<=height-4);
  }
});
test('selected information follows the ground anchor and disappears when that hero is offscreen',()=>{
  const size={width:390,height:300},first=placeSelectedInfo({x:80,y:120},size),second=placeSelectedInfo({x:300,y:240},size);
  assert.notDeepEqual(first,second);
  assert.equal(placeSelectedInfo({x:-1,y:120},size),null);assert.equal(placeSelectedInfo({x:80,y:301},size),null);
  assert.equal(placeSelectedInfo({x:0,y:0},{width:0,height:0}),null);
  assert.equal(placeSelectedInfo({x:80,y:30},{width:200,height:60}).compact,true);
});
test('the open phone guide leaves a compact status slot between Goal and guide',()=>{
  const controls=[{x:6,y:8,width:210,height:140},{x:231,y:16,width:151,height:52},{x:8,y:115,width:366,height:291},{x:10,y:272,width:140,height:45}],figures=[{x:118,y:50,width:150,height:170},{x:210,y:145,width:170,height:180}];
  const box=placeSelectedInfo({x:195,y:170},{width:390,height:335},controls,figures);
  assert.equal(box.compact,true);assert.equal(box.controlOverlap,0);assert.equal(box.figureOverlap,0);
});
test('actual saved prefixes render selected holding and exhausted values without altering their replay',async()=>{
  registerOrchardPuzzleHooks();
  const record=JSON.parse(readFileSync(new URL('../../../docs/expeditions/v2/evidence/code-overnight-20261004/unequal-browser-win-record.json',import.meta.url),'utf8'));
  const bundle=await build({entryPoints:[fileURLToPath(new URL('./SelectedHeroInfo.jsx',import.meta.url))],bundle:true,write:false,platform:'node',format:'cjs',external:['react']});
  const require=createRequire(import.meta.url),module={exports:{}};new Function('require','module','exports',bundle.outputFiles[0].text)(require,module,module.exports);
  const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),Component=module.exports.default;
  for(const [prefix,id,condition]of [[23,'cobweb','Holding'],[13,'amberly','No AP']]){
    const replay=replayRun({initialRun:record.initialRun,commands:record.commands.slice(0,prefix)});assert.equal(replay.ok,true);
    const state=replay.state,before=stateHash(state),info=selectedHeroInfo(state,id),hero=state.heroes.find(h=>h.id===id);
    assert.equal(info.condition,condition);assert.equal(info.health,`${hero.hp} ♥ · ${hero.ap} AP`);
    const entities=state.heroes.map(h=>({...h,kind:'hero',hex:h.position})),html=renderToStaticMarkup(React.createElement('svg',null,React.createElement(Component,{state,selectedHero:id,camera:{x:0,y:0,scale:.45},size:{width:1280,height:800},entities})));
    assert.match(html,new RegExp(`data-selected-hero-info="${id}"`));assert.match(html,new RegExp(`${hero.hp} health, ${hero.ap} AP`));assert.ok(html.includes(condition));assert.ok(html.includes('pointer-events="none"'));
    assert.equal(stateHash(state),before);assert.equal(selectedHeroInfo(state,'missing'),null);
  }
});
