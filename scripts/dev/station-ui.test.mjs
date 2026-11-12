import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {replayRun,stateHash,orchardRosterProfiles} from '../../expeditions/v2/index.js';
import {saveActiveRun} from '../../expeditions/v2/persistence.js';
import {createOrchardController} from '../../expeditions/v2/controller.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {placeStationLabels} from '../../expeditions/v2/ui/station-labels.js';
const require=createRequire(import.meta.url),{build}=require('esbuild'),{JSDOM}=require('jsdom'),React=require('react'),{createRoot}=require('react-dom/client');
const root=new URL('../../',import.meta.url),record=JSON.parse(fs.readFileSync(new URL('docs/expeditions/v2/evidence/player-recovery/winning-replay-trace.json',root),'utf8'));
registerOrchardPuzzleHooks();
let components;
async function mount(name,props){
  if(!components){const out=await build({stdin:{contents:"import {registerOrchardPuzzleHooks} from './expeditions/v2/puzzles/index.js';registerOrchardPuzzleHooks();export {default as Orchard} from './expeditions/v2/ui/OrchardExpedition.jsx';export {default as Setup} from './expeditions/v2/ui/MissionSetup.jsx';",resolveDir:fileURLToPath(root)},bundle:true,write:false,platform:'node',format:'cjs',external:['react','react-dom']});const module={exports:{}};new Function('require','module','exports',out.outputFiles[0].text)(require,module,module.exports);components=module.exports;}
  const dom=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});globalThis.window=dom.window;globalThis.document=dom.window.document;Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});globalThis.IS_REACT_ACT_ENVIRONMENT=true;globalThis.ResizeObserver=class{observe(){}disconnect(){}};
  const element=document.getElementById('root'),mounted=createRoot(element);await React.act(()=>mounted.render(React.createElement(components[name],props)));
  const button=(text,scope=element)=>{const found=[...scope.querySelectorAll('button')].find(b=>b.textContent.trim()===text||b.getAttribute('aria-label')===text);assert.ok(found,`button ${text}`);return found;};
  const click=async el=>React.act(()=>el.dispatchEvent(new window.MouseEvent('click',{bubbles:true})));
  return {element,button,click,close:async()=>{await React.act(()=>mounted.unmount());dom.window.close();}};
}
test('paid-action confirmation and preview cancellation return to the board so another hero can be selected',async()=>{
  const replay=replayRun({...record,commands:record.commands.slice(0,8),finalStateHash:null});assert.equal(replay.ok,true);
  let progress=saveActiveRun({cards:Object.fromEntries(record.initialRun.cardIds.map(id=>[id,1])),stars:0,packs:0},replay.state);
  const controller=createOrchardController({getProgress:()=>progress,setProgress:update=>{progress=typeof update==='function'?update(progress):update;},ensureHooks:registerOrchardPuzzleHooks});
  const ui=await mount('Orchard',{profile:{name:'eudaimon',avatar:'card:intermediate:gf_rooke'},controller});
  const selectAction=async prefix=>{const b=[...ui.element.querySelectorAll('.ov-base-extra button')].find(b=>b.textContent.startsWith(prefix));assert.ok(b);await ui.click(b);};
  await ui.click(ui.button('Select Tuppence'));const before=stateHash(controller.resume().state);await selectAction('Add power');await ui.click(ui.button('Ledger bus',ui.element.querySelector('.ov-targets')));assert.equal(stateHash(controller.resume().state),before);
  await ui.click(ui.button('Confirm',ui.element.querySelector('.ov-preview')));assert.equal(ui.element.querySelector('[aria-label="Action choices"]'),null);assert.equal(ui.element.querySelector('.ov-preview'),null);assert.equal(controller.resume().state.stationStates.number.charge,4);
  await ui.click(ui.button('Select Furrow'));assert.match(ui.element.querySelector('.ov-hud').textContent,/Furrow: 2 AP/);
  await selectAction('Strike');await ui.click(ui.button('Hookmole',ui.element.querySelector('.ov-targets')));const pure=stateHash(controller.resume().state);await ui.click(ui.button('Cancel',ui.element.querySelector('.ov-preview')));assert.equal(stateHash(controller.resume().state),pure);assert.equal(ui.element.querySelector('[aria-label="Action choices"]'),null);assert.equal(ui.element.querySelector('.ov-preview'),null);
  await ui.close();
});
test('setup explains initial shortfalls, keeps practice enabled and changes to suggested owned cards only on the explicit button',async()=>{
  const owned=Object.fromEntries(Object.keys(orchardRosterProfiles()).map(id=>[id,1])),starts=[];
  const ui=await mount('Setup',{controller:{status:()=>({tiers:[{tier:1,unlocked:true,awarded:false}]})},families:[],ownedCards:owned,cards:[],onStart:o=>starts.push(o)});
  assert.match(ui.element.querySelector('.ov-squad-warning').textContent,/Pip.*Arithmetic 1\/4/);assert.match(ui.element.querySelector('.ov-job-slots').textContent,/Pip/);assert.equal(ui.button('Embark').disabled,false);
  await ui.click(ui.button('Embark'));assert.deepEqual(starts[0].cardIds,['pip','nine','bramble']);assert.equal(starts.length,1);
  await ui.click(ui.button('Use this owned team'));assert.equal(ui.element.querySelector('.ov-squad-warning'),null);assert.equal(starts.length,1,'suggestion changes selection, never embarks silently');
  await ui.click(ui.button('Embark'));assert.equal(new Set(starts[1].cardIds).size,3);assert.ok(starts[1].cardIds.every(id=>owned[id]));await ui.close();
});
test('station overview labels separate neighbouring props and remain inside the viewport',()=>{
  const items=[{id:'a',x:170,y:200,width:128,height:50},{id:'b',x:220,y:210,width:128,height:65},{id:'c',x:330,y:320,width:160,height:50}];
  const placed=placeStationLabels(items,390,600,[{x:0,y:0,width:220,height:60}]);assert.equal(placed.length,3);
  for(const r of placed){assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=390&&r.y+r.height<=600);}
  for(let i=0;i<placed.length;i++)for(let j=i+1;j<placed.length;j++){const a=placed[i],b=placed[j];assert.ok(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y);}
});
test('current interactive winning record replays unchanged production rules and saved replay reward',()=>{
  const r=JSON.parse(fs.readFileSync(new URL('docs/expeditions/v2/evidence/station-integration/interactive-winning-trace.json',root),'utf8')),progress=JSON.parse(fs.readFileSync(new URL('docs/expeditions/v2/evidence/station-integration/interactive-winning-progress.json',root),'utf8'));const v=replayRun(r);assert.equal(v.ok,true);assert.equal(v.state.status,'won');assert.equal(r.commands.length,31);assert.equal(progress.stars,3);
});
