import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
const require=createRequire(import.meta.url),React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{JSDOM}=require('jsdom');
let components;
async function load(){
  if(components)return components;
  const bundle=await build({stdin:{contents:"export {default as Balance,displayedPanTotal} from './BalanceBoard.jsx';export {default as Roost} from './RoostBoard.jsx';",resolveDir:fileURLToPath(new URL('.',import.meta.url)),loader:'js'},bundle:true,write:false,format:'cjs',platform:'node',external:['react']});
  const module={exports:{}};new Function('require','module','exports',bundle.outputFiles[0].text)(require,module,module.exports);return components=module.exports;
}
test('live pans use explicit station IDs, keep draft separate and never expose the hidden answer',async()=>{
  const {Balance,displayedPanTotal}=await load(),puzzle={kind:'balance',target:17,panStationIds:{left:'different-left',right:'different-right'},loads:[{id:'shown',visible:true,value:7},{id:'secret',visible:false,value:999,candidates:[4,5,6]}]};
  const content={assignments:{shown:'left',secret:'left'},inferredValue:null};
  assert.equal(displayedPanTotal(puzzle,content,'left'),'7 + ?');
  const state={blueprint:{puzzle,stations:[{id:'shape',hex:'99,99'},{id:'different-left',hex:'1,2'},{id:'different-right',hex:'3,4'}]},puzzleActive:{content},puzzleDraft:{content:{...content,inferredValue:5}}};
  const markup=renderToStaticMarkup(React.createElement('svg',null,React.createElement(Balance,{state}))),dom=new JSDOM(markup);
  try{const left=dom.window.document.querySelector('[data-pan-station="different-left"]');assert.equal(left.dataset.panHex,'1,2');assert.match(left.getAttribute('aria-label'),/committed 7 \+ \?, draft 12/);assert.equal(dom.window.document.querySelector('[data-pan-station="shape"]'),null);assert.doesNotMatch(markup,/999/);}finally{dom.window.close();}
});
test('perch beams use committed outputs and occupancy, never a proposed draft pair',async()=>{
  const {Roost}=await load(),empty=Array.from({length:5},()=>Array(5).fill('empty')),draft=structuredClone(empty);draft[2][0]='filled';
  const state={blueprint:{puzzle:{kind:'nonogram5',perches:[{sector:'north',hex:'4,1'},{sector:'east',hex:'6,3'},{sector:'south',hex:'5,6'}]},outputs:['north','east','south'].map(sector=>({id:`beam-${sector}`,effect:{kind:'beam',sector}}))},puzzleActive:{content:{grid:empty}},puzzleDraft:{content:{grid:draft,outputIds:['beam-east','beam-south']}},activeOutputs:{'beam-north':true,'beam-east':false,'beam-south':false}};
  state.puzzleActive.content.grid[4][0]='filled';
  const dom=new JSDOM(renderToStaticMarkup(React.createElement('svg',null,React.createElement(Roost,{state}))));
  try{const doc=dom.window.document;assert.equal(doc.querySelector('[data-roost-perch="north"]').dataset.beamActive,'true');assert.equal(doc.querySelector('[data-roost-perch="east"]').dataset.perchHex,'6,3');assert.match(doc.querySelector('[data-roost-perch="east"]').getAttribute('aria-label'),/Nest empty/);assert.match(doc.querySelector('[data-roost-perch="south"]').getAttribute('aria-label'),/Nest exposed/);}finally{dom.window.close();}
});
test('pan detail labels avoid the camera and goal area while remaining tied to their world station',async()=>{
  const {Balance}=await load(),content={assignments:{shown:'left'},inferredValue:null};
  const state={blueprint:{puzzle:{kind:'balance',target:7,panStationIds:{left:'shape'},loads:[{id:'shown',visible:true,value:7}]},stations:[{id:'shape',hex:'0,0'}]},puzzleActive:{content},puzzleDraft:{content}};
  const dom=new JSDOM(renderToStaticMarkup(React.createElement('svg',null,React.createElement(Balance,{state,camera:{x:180,y:80},size:{width:390,height:300},overlays:[{x:0,y:0,width:390,height:100}]}))));
  try{const label=dom.window.document.querySelector('[data-pan-station="shape"]');assert.equal(label.dataset.panHex,'0,0');const [,x,y]=/translate\(([^ ]+) ([^)]+)\)/.exec(label.querySelector('g').getAttribute('transform'));assert.ok(Number(x)>=0&&Number(x)+160<=390);assert.ok(Number(y)>=100&&Number(y)+38<=300);assert.match(label.querySelector('path').getAttribute('d'),/^M180,80L/);}finally{dom.window.close();}
});
