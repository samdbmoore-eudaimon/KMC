import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {makeFixtureBlueprint,registerFixtureHooks} from '../fixture.js';
import {createRun} from '../index.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';
const require=createRequire(import.meta.url),React=require('react'),{act}=React,{createRoot}=require('react-dom/client'),{renderToStaticMarkup}=require('react-dom/server'),{JSDOM}=require('jsdom');
let components;
async function load(){
  if(components)return components;
  const result=await build({stdin:{contents:"export {default as Board,packingBranchCells} from './PackingBoard.jsx'; export {default as Map} from './MapViewport.jsx'; export {default as Panel} from './PackingPanel.jsx';",resolveDir:fileURLToPath(new URL('.',import.meta.url)),loader:'js'},bundle:true,write:false,platform:'node',format:'cjs',external:['react']});
  const module={exports:{}};new Function('require','module','exports',result.outputFiles[0].text)(require,module,module.exports);return components=module.exports;
}
const puzzle={kind:'polyhex',patchCells:['0,0','1,0','2,0','0,1','1,1','2,1'],pieces:[{id:'twig',cells:[[0,0],[1,0]]}],sockets:['0,0'],forbiddenCells:[],approachCells:['2,1'],forecastCellIds:['0,0'],reflectionAllowed:true};
test('world shelter uses committed coverage and suppression; free draft and invalid branches never supply shelter',async()=>{
  const {Board,packingBranchCells}=await load(),committed={placements:[{pieceId:'twig',originHex:'0,0',orientation:0,reflected:false}]},draft={placements:[{pieceId:'twig',originHex:'0,1',orientation:0,reflected:false}]};
  assert.deepEqual(packingBranchCells(puzzle,committed),[{id:'twig',cells:['0,0','1,0']}]);
  assert.deepEqual(packingBranchCells(puzzle,{placements:[{...committed.placements[0],originHex:'10,10'}]}),[]);
  const state={blueprint:{puzzle,outputs:[{id:'shelter',effect:{kind:'shelter',coverage:'puzzle'}}]},puzzleActive:{content:committed},puzzleDraft:{content:draft},activeOutputs:{shelter:true},phaseEffects:{suppressedShelterCells:['0,0']}};
  const dom=new JSDOM(renderToStaticMarkup(React.createElement('svg',null,React.createElement(Board,{state}))));
  try{assert.equal(dom.window.document.querySelector('[data-packing-cell="1,0"]').getAttribute('data-sheltered'),'true');assert.equal(dom.window.document.querySelector('[data-packing-cell="0,0"]').getAttribute('data-sheltered'),'false');assert.equal(dom.window.document.querySelector('[data-packing-cell="0,1"]').getAttribute('data-sheltered'),'false');assert.match(dom.window.document.querySelector('[data-draft-branch]').getAttribute('aria-label'),/0,1; 1,1/);assert.match(dom.window.document.querySelector('[data-packing-cell="0,0"]').getAttribute('aria-label'),/shelter suppressed/);}finally{dom.window.close();}
});
test('battlefield keyboard selection chooses exact packing world anchor; movement takes priority',async()=>{
  registerOrchardPuzzleHooks();registerFixtureHooks();const {Map,Panel}=await load(),bp=makeFixtureBlueprint(),state=createRun({blueprint:bp,cardIds:['bushel','furrow','pip'],runId:'packing-map-ui'});
  const occupied=new Set([...state.heroes.map(h=>h.position),...bp.stations.map(s=>s.hex),...state.enemyStates.map(e=>e.position),bp.orchard.hex]);
  const hex=bp.tiles.map(tile=>`${tile.q},${tile.r}`).find(id=>!occupied.has(id));
  state.blueprint.puzzle={...puzzle,patchCells:[hex],sockets:[],approachCells:[hex]};state.puzzleDraft.content={placements:[]};state.puzzleActive.content={placements:[]};
  const dom=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;globalThis.ResizeObserver=class{observe(){}disconnect(){}};
  const root=createRoot(document.getElementById('root')),selected=[],moves=[];
  const props={state,selectedHero:'bushel',onSelect:item=>selected.push(item),onMoveTarget:id=>moves.push(id)};
  try{
    act(()=>root.render(React.createElement(Map,props)));act(()=>document.querySelector(`[data-hit-hex="${hex}"]`).dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true})));assert.deepEqual(selected,[{id:hex,hex,kind:'packing-cell',name:`Branch anchor ${hex}`}]);
    act(()=>root.render(React.createElement(Map,{...props,movementMode:true,reachable:[{destination:hex,cost:1}]})));act(()=>document.querySelector(`[data-hit-hex="${hex}"]`).dispatchEvent(new window.KeyboardEvent('keydown',{key:' ',bubbles:true})));assert.deepEqual(moves,[hex]);assert.equal(selected.length,1);
    const menu=document.querySelector('.ov-board-list');menu.open=true;act(()=>menu.querySelector('button').click());assert.equal(menu.open,false);
    act(()=>root.render(React.createElement(Panel,{puzzle,content:{placements:[]},initialAnchorHex:'0,1',onEdit(){}})));assert.equal(document.querySelector('[aria-label="Anchor 0,1"]').getAttribute('aria-pressed'),'true');
  }finally{act(()=>root.unmount());dom.window.close();delete globalThis.ResizeObserver;}
});
