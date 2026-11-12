import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
const require=createRequire(import.meta.url),React=require('react'),{act}=React,{createRoot}=require('react-dom/client'),{JSDOM}=require('jsdom');
async function load(name){const out=await build({entryPoints:[fileURLToPath(new URL(`./${name}.jsx`,import.meta.url))],bundle:true,write:false,platform:'node',format:'cjs',external:['react']});const module={exports:{}};new Function('require','module','exports',out.outputFiles[0].text)(require,module,module.exports);return module.exports.default;}
test('painted action state layers preserve preview click and native disabled semantics',async()=>{
  const Button=await load('PaintedActionButton'),d=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});globalThis.window=d.window;globalThis.document=d.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const root=createRoot(document.getElementById('root'));let clicks=0;
  const render=props=>act(()=>root.render(React.createElement(Button,{type:'operate',label:'Activate mechanism',detail:'1 action',onClick(){clicks++;},...props})));
  try{
    render({selected:true});let button=document.querySelector('button');assert.equal(button.dataset.appearance,'selected');assert.equal(button.getAttribute('aria-pressed'),'true');assert.equal(button.querySelectorAll('img').length,1);assert.ok(button.querySelector('svg'));
    act(()=>button.dispatchEvent(new window.MouseEvent('click',{bubbles:true})));assert.equal(clicks,1);
    render({unavailable:true});button=document.querySelector('button');assert.equal(button.getAttribute('aria-disabled'),'true');assert.equal(button.disabled,false);assert.equal(button.dataset.appearance,'disabled');
    render({spent:true,unavailable:true});assert.equal(document.querySelector('button').dataset.appearance,'spent');
    render({disabled:true});assert.equal(document.querySelector('button').disabled,true);
  }finally{act(()=>root.unmount());d.window.close();}
});
test('ability help is requested separately and unavailable abilities remain inspectable',async()=>{
  const Hand=await load('AbilityHand'),d=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});globalThis.window=d.window;globalThis.document=d.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const root=createRoot(document.getElementById('root')),selected=[],hero={id:'pip',handReady:{'exact-blow':false}},row={type:'exact-blow',available:false,reasonCode:'card-exhausted',apCost:1,targets:[]};
  const state={blueprint:{enemies:[],stations:[],puzzle:{},orchard:{}},profiles:{pip:{name:'Pip',primaryStat:0,strikeRange:1,hand:[{key:'exact-blow'}]}}};
  try{
    act(()=>root.render(React.createElement(Hand,{state,hero,commands:[row],onSelect:item=>selected.push(item)})));
    assert.equal(document.querySelector('.ov-ability-help'),null);assert.equal(document.querySelector('.ov-painted-action').dataset.appearance,'spent');
    act(()=>document.querySelector('.ov-info').dispatchEvent(new window.MouseEvent('click',{bubbles:true})));assert.equal(selected.length,0);assert.match(document.querySelector('.ov-ability-help').textContent,/spent/);assert.equal(document.querySelector('.ov-info').getAttribute('aria-expanded'),'true');
    act(()=>document.querySelector('.ov-painted-action').dispatchEvent(new window.MouseEvent('click',{bubbles:true})));assert.deepEqual(selected,[row]);
  }finally{act(()=>root.unmount());d.window.close();}
});
