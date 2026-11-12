import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import metadata from '../art/ui-kit.json' with {type:'json'};
const require=createRequire(import.meta.url),React=require('react'),{act}=React,{createRoot}=require('react-dom/client'),{JSDOM}=require('jsdom');
async function load(){
  const result=await build({entryPoints:[fileURLToPath(new URL('./PartyTray.jsx',import.meta.url))],bundle:true,write:false,platform:'node',format:'cjs',external:['react']});
  const module={exports:{}};new Function('require','module','exports',result.outputFiles[0].text)(require,module,module.exports);return module.exports;
}
test('team members use original portraits, separate safe areas and accessible selection/disabled states',async()=>{
  const {default:Tray,originalPortraitFor}=await load(),d=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});
  globalThis.window=d.window;globalThis.document=d.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const root=createRoot(document.getElementById('root')),selected=[],calls=[],team=metadata.assets.team;
  const cards=['harvestmoon','tuppence','furrow'].map(id=>({id})),avatarForCard=(module,card)=>{calls.push([module,card.id]);return `original-${card.id}.webp`;};
  const state={heroes:[{id:'harvestmoon',hp:20,ap:2},{id:'tuppence',hp:15,ap:0,holding:'number'},{id:'furrow',hp:0,ap:0,defeated:true}],profiles:Object.fromEntries(cards.map((card,i)=>[card.id,{name:i===0?'Harvestmoon of Ninefold Orchard':card.id,initiative:i,maxHealth:20,roleName:'Helper',discipline:'Science'}]))};
  try{
    act(()=>root.render(React.createElement(Tray,{state,cards,avatarForCard,selectedHero:'harvestmoon',frame:'painted-team.webp',geometry:team.geometry,visibleBounds:team.visibleBounds,onSelect:hero=>selected.push(hero.id)})));
    const buttons=[...document.querySelectorAll('button')];assert.equal(buttons[0].getAttribute('aria-pressed'),'true');assert.equal(buttons[1].classList.contains('ov-party-exhausted'),true);assert.equal(buttons[1].disabled,false);assert.equal(buttons[2].disabled,true);
    assert.equal(buttons[0].querySelector('.ov-party-portrait img').getAttribute('src'),'original-harvestmoon.webp');assert.equal(buttons[0].querySelector('.ov-party-copy strong').textContent,'✓ Harvestmoon of Ninefold Orchard');assert.match(buttons[2].querySelector('.ov-party-copy').textContent,/Defeated/);
    const portrait=buttons[0].querySelector('.ov-party-portrait'),copy=buttons[0].querySelector('.ov-party-copy');
    assert.ok(parseFloat(portrait.style.left)+parseFloat(portrait.style.width)<parseFloat(copy.style.left));
    assert.match(copy.textContent,/20\/20 ♥ · 2 AP/);assert.match(buttons[1].getAttribute('aria-label'),/no actions left/);
    act(()=>buttons[1].dispatchEvent(new window.MouseEvent('click',{bubbles:true})));assert.deepEqual(selected,['tuppence']);assert.ok(calls.every(([module])=>module==='primary'));
    assert.equal(originalPortraitFor('missing',cards,avatarForCard),null);assert.equal(originalPortraitFor('pip',[{id:'po_pip',img:'original-pip.png'}]),'original-pip.png');
  }finally{act(()=>root.unmount());d.window.close();}
});
