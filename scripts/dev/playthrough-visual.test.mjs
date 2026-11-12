import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {containsHex,hitHex,projectHex} from '../../expeditions/v2/ui/viewport.js';
import {orchardArtFor} from '../../expeditions/v2/art/renderer.js';
import {stateHash} from '../../expeditions/v2/index.js';
const require=createRequire(import.meta.url),React=require('react'),{createRoot}=require('react-dom/client'),{JSDOM}=require('jsdom'),{build}=require('esbuild');
const root=new URL('../../',import.meta.url),sam=JSON.parse(fs.readFileSync(new URL('docs/expeditions/v2/evidence/playthrough-recovery-20261003/sam-playthrough-state.json',root)));
const snapshots=JSON.parse(fs.readFileSync(new URL('docs/expeditions/v2/evidence/station-integration/reducer-snapshots.json',root)));
test('visible station bounds occupy only their hit hex and every available hero pose meets its contact shadow at all review zooms',()=>{
  const poses=new Set();
  for(const state of [sam,...snapshots.map(s=>s.state)]){
    for(const station of state.blueprint.stations){const sprite=orchardArtFor({...station,kind:'station'},state),p=projectHex(station.hex),[l,t,r,b]=sprite.visibleBounds;
      for(const scale of [0.45,1,2])for(const [x,y] of [[l,t],[r,t],[r,b],[l,b]]){
        const point={x:p.x+(x-sprite.anchor[0])*sprite.scale,y:p.y+(y-sprite.anchor[1])*sprite.scale};assert.ok(containsHex(point,station.hex),station.id);
        const camera={x:13,y:27,scale};assert.equal(`${hitHex({x:point.x*scale+13,y:point.y*scale+27},camera,state.blueprint.tiles).q},${hitHex({x:point.x*scale+13,y:point.y*scale+27},camera,state.blueprint.tiles).r}`,station.hex);
      }
    }
    for(const hero of state.heroes){const sprite=orchardArtFor({...hero,kind:'hero'},state);poses.add(sprite.pose);for(const zoom of [0.45,1,2])assert.ok(Math.abs(((sprite.visibleBounds[3]-sprite.anchor[1])*sprite.scale+sprite.groundOffset[1]-8)*zoom)<1e-8);}
  }
  assert.deepEqual([...poses].sort(),['action','exhausted','idle']);
});
test('inspection hover, pointer entry, keyboard transfer, dismiss and touch taps never execute map actions or mutate the retained run',async()=>{
  const out=await build({stdin:{contents:"export {default as Map} from './expeditions/v2/ui/MapViewport.jsx'; export {RiverBridge} from './expeditions/v2/ui/RiverTerrain.jsx'; export {orchardArtFor} from './expeditions/v2/art/renderer.js';",resolveDir:fileURLToPath(root)},bundle:true,write:false,platform:'node',format:'cjs',external:['react','react-dom']});
  const mod={exports:{}};new Function('require','module','exports',out.outputFiles[0].text)(require,mod,mod.exports);
  const dom=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;globalThis.ResizeObserver=class{observe(){}disconnect(){}};
  Object.defineProperty(dom.window.HTMLElement.prototype,'clientWidth',{get:()=>800});Object.defineProperty(dom.window.HTMLElement.prototype,'clientHeight',{get:()=>500});
  let moves=0,selections=0;const before=stateHash(sam),mounted=createRoot(document.getElementById('root'));await React.act(()=>mounted.render(React.createElement(mod.exports.Map,{state:sam,artFor:mod.exports.orchardArtFor,onMoveTarget:()=>moves++,onSelect:()=>selections++})));
  const host=document.querySelector('.ov-map'),hit=document.querySelector('[data-station-target="control"]');
  const send=async(node,type,options={})=>React.act(()=>(()=>{const event=new window.MouseEvent(type,{bubbles:true,...options});Object.defineProperty(event,'pointerType',{value:options.pointerType||'mouse'});node.dispatchEvent(event);})());
  assert.equal(document.querySelector('[data-station-popup]'),null);
  await React.act(()=>hit.focus());assert.ok(document.querySelector('[data-station-popup="control"]'));
  const popup=document.querySelector('[data-station-popup]');await send(popup,'pointermove',{clientX:1,clientY:1});assert.ok(document.querySelector('[data-station-popup="control"]'),'popup does not bubble movement onto another map tile');
  await React.act(()=>document.querySelector('[aria-label="Actions at Ledger control"]').focus());assert.ok(document.querySelector('[data-station-popup="control"]'),'keyboard can enter inspection controls');
  await send(document.querySelector('[aria-label="Close station tooltip"]'),'click');assert.equal(document.querySelector('[data-station-popup]'),null);
  const polygon=hit.getAttribute('points').split(' ').map(p=>p.split(',').map(Number)),centre={x:polygon.reduce((n,p)=>n+p[0],0)/6,y:polygon.reduce((n,p)=>n+p[1],0)/6};
  const transform=hit.parentElement.parentElement.getAttribute('transform').match(/translate\(([^ ]+) ([^)]+)\) scale\(([^)]+)\)/),coords={clientX:centre.x*Number(transform[3])+Number(transform[1]),clientY:centre.y*Number(transform[3])+Number(transform[2])};
  host.setPointerCapture=()=>{};
  await send(host,'pointermove',coords);assert.ok(document.querySelector('[data-station-popup="control"]'));await send(host,'pointermove',{clientX:1,clientY:1});await send(document.querySelector('[data-station-popup]'),'pointerover');await React.act(()=>new Promise(resolve=>setTimeout(resolve,250)));assert.ok(document.querySelector('[data-station-popup="control"]'),'hover survives crossing the gap into its popup');await send(document.querySelector('[aria-label="Close station tooltip"]'),'click');
  for(let i=0;i<2;i++){await send(host,'pointerdown',{...coords,pointerType:'touch'});await send(host,'pointerup',{...coords,pointerType:'touch'});assert.equal(!!document.querySelector('[data-station-popup]'),i===0);}
  await React.act(()=>hit.focus());await React.act(()=>host.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(document.querySelector('[data-station-popup]'),null);
  await send(host,'pointerdown',{...coords,pointerType:'touch'});await send(host,'pointermove',{clientX:coords.clientX+25,clientY:coords.clientY,pointerType:'touch'});await send(host,'pointerup',{clientX:coords.clientX+25,clientY:coords.clientY,pointerType:'touch'});assert.equal(document.querySelector('[data-station-popup]'),null,'drag cannot inspect or activate');
  assert.equal(moves,0);assert.equal(selections,0);assert.equal(stateHash(sam),before);
  await React.act(()=>mounted.render(React.createElement(mod.exports.Map,{state:sam,artFor:mod.exports.orchardArtFor,movementMode:true,reachable:[{destination:'1,5',cost:1}],onMoveTarget:hex=>{assert.equal(hex,'1,5');moves++;},onSelect:()=>selections++})));
  const target=document.querySelector('[data-hit-hex="1,5"]');await React.act(()=>target.focus());assert.equal(document.querySelector('[data-station-popup]'),null,'station hover/focus cannot block a highlighted movement target');await React.act(()=>target.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true})));assert.equal(moves,1);await React.act(()=>target.dispatchEvent(new window.KeyboardEvent('keydown',{key:' ',bubbles:true})));assert.equal(moves,2,'map sends one callback per keyboard destination activation');assert.equal(stateHash(sam),before);
  const {renderToStaticMarkup}=require('react-dom/server');const raised=renderToStaticMarkup(React.createElement(mod.exports.RiverBridge,{hex:'4,4',closed:true})),open=renderToStaticMarkup(React.createElement(mod.exports.RiverBridge,{hex:'4,4'}));
  assert.match(raised,/data-river-bridge="raised"/);assert.doesNotMatch(raised,/<image/,'raised bridge cannot paint a traversable timber deck');assert.match(open,/<image/);
  await React.act(()=>mounted.unmount());dom.window.close();
});

