import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {RECOVERY_CSS} from './recovery.css.js';
const require=createRequire(import.meta.url),React=require('react'),{act}=React,{createRoot}=require('react-dom/client'),{JSDOM}=require('jsdom');
async function load(){const result=await build({stdin:{contents:"export {default as Button} from './PaintedButton.jsx';export {default as Preview} from './ActionPreview.jsx';",resolveDir:fileURLToPath(new URL('.',import.meta.url)),loader:'js'},bundle:true,write:false,platform:'node',format:'cjs',external:['react']});const module={exports:{}};new Function('require','module','exports',result.outputFiles[0].text)(require,module,module.exports);return module.exports;}

test('phase confirmation keeps its painted frame against the important legacy border reset',()=>{
  const dom=new JSDOM(`<style>.ov-confirm{background:#c1d19a!important;border:2px solid #67804c!important}${RECOVERY_CSS}</style><div class="ov-root"><button class="ov-painted-button ov-confirm">Confirm end round</button></div>`);
  try{const style=dom.window.getComputedStyle(dom.window.document.querySelector('button'));assert.match(style.borderImageSource,/^url\(/);assert.match(style.borderImageSlice,/65 80 60 80 fill/);assert.equal(style.borderTopWidth,'14.3px');assert.equal(style.borderRightWidth,'17.6px');}finally{dom.window.close();}
});
test('guide scroll containment retains the painted border and actionable button height',()=>{
  const dom=new JSDOM(`<style>${RECOVERY_CSS}</style><div class="ov-root"><aside class="ov-guide"><button class="ov-painted-button">Hide guide</button></aside></div>`);
  try{const guide=dom.window.getComputedStyle(dom.window.document.querySelector('aside')),button=dom.window.getComputedStyle(dom.window.document.querySelector('button'));assert.equal(guide.overflowY,'auto');assert.equal(guide.overscrollBehavior,'contain');assert.equal(guide.maxHeight,'calc(100% - var(--ov-guide-top) - 12px)');assert.match(guide.borderImageSource,/^url\(/);assert.equal(button.minHeight,'52px');}finally{dom.window.close();}
});
test('painted navigation forwards accessible control state, focus and disabled selection without changing callbacks',async()=>{
  const {Button}=await load(),dom=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const root=createRoot(document.getElementById('root'));let selected=0,focused=0;
  const render=disabled=>act(()=>root.render(React.createElement(Button,{'aria-label':'Open objectives','aria-expanded':true,'aria-controls':'objectives',disabled,onClick(){selected++;},onFocus(){focused++;}},'Objectives')));
  try{render(false);let button=document.querySelector('button');assert.equal(button.getAttribute('aria-controls'),'objectives');assert.equal(button.getAttribute('aria-expanded'),'true');act(()=>button.focus());assert.equal(focused,1);assert.equal(button.dataset.appearance,'focused');act(()=>button.click());assert.equal(selected,1);render(true);button=document.querySelector('button');act(()=>button.click());assert.equal(selected,1);assert.equal(button.dataset.appearance,'disabled');}finally{act(()=>root.unmount());dom.window.close();}
});
test('painted action preview exposes Confirm only for a legal outcome and Cancel never confirms',async()=>{
  const {Preview}=await load(),dom=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const root=createRoot(document.getElementById('root')),state={blueprint:{enemies:[],stations:[],outputs:[],orchard:{}},profiles:{pip:{name:'Pip'}}},command={heroId:'pip',type:'move',payload:{destination:'2,3'}};let confirms=0,cancels=0;
  const render=result=>act(()=>root.render(React.createElement(Preview,{state,command,result,onConfirm(){confirms++;},onCancel(){cancels++;}})));
  try{render({legal:true,cost:{ap:1},factors:[],changedEntities:[{id:'pip',field:'ap',before:2,after:1}]});assert.ok(document.querySelector('.ov-painted-panel'));assert.match(document.body.textContent,/Pip: 2 → 1 actions/);act(()=>document.querySelector('[aria-label="Cancel"]').click());assert.equal(cancels,1);assert.equal(confirms,0);act(()=>document.querySelector('[aria-label="Confirm"]').click());assert.equal(confirms,1);render({legal:false,reasonCode:'not-enough-ap',factors:[]});assert.equal(document.querySelector('[aria-label="Confirm"]'),null);assert.match(document.body.textContent,/needs more action points/);}finally{act(()=>root.unmount());dom.window.close();}
});
