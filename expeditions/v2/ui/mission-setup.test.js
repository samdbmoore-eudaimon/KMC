import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {ORCHARD_V2_FAMILIES} from '../catalogue.js';
const require=createRequire(import.meta.url),React=require('react'),{act}=React,{createRoot}=require('react-dom/client'),{JSDOM}=require('jsdom');
async function load(simulated=false){
  const result=await build({entryPoints:[fileURLToPath(new URL('./MissionSetup.jsx',import.meta.url))],bundle:true,write:false,platform:'node',format:'cjs',external:['react'],plugins:simulated?[{name:'certified-availability-fixture',setup(b){b.onLoad({filter:/generation[\\/]index\.js$/},()=>({contents:"export const orchardGenerationAvailability=(id,tier)=>['four-locks','turning-ravine'].includes(id)&&tier===1;",loader:'js'}));}}]:[]});
  const module={exports:{}};new Function('require','module','exports',result.outputFiles[0].text)(require,module,module.exports);return module.exports;
}
test('setup consumes catalogue and certification availability; published family controls determine embark payload',async()=>{
  for(const simulated of [false,true]){
    const {default:Setup,setupPuzzleTask}=await load(simulated),dom=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});
    globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
    const root=createRoot(document.getElementById('root')),starts=[],controller={status:()=>({tiers:[1,2,3,4,5].map(tier=>({tier,unlocked:true,awarded:false}))})};
    try{
      act(()=>root.render(React.createElement(Setup,{controller,families:ORCHARD_V2_FAMILIES,ownedCards:{bushel:1,furrow:1,pip:1},cards:[],onStart:value=>starts.push(value),onExit(){}})));
      const familyButtons=[...document.querySelector('nav').querySelectorAll('button')];assert.equal(familyButtons.length,5);
      // Real index: all five families have private-development entries (5 Oct main-App access). Simulated fixture: only Four Locks and Ravine T1.
      assert.equal(familyButtons[1].disabled,false);assert.equal(familyButtons[2].disabled,simulated);
      if(simulated){act(()=>familyButtons[1].click());assert.equal(document.querySelector('h1').textContent,'Turning Ravine');assert.match(document.body.textContent,/Calibration wheel|Turning joint|Wind stabiliser/);assert.match(document.querySelector('.ov-mission-copy').textContent,/linked equation wheels/);}
      act(()=>document.querySelector('.ov-embark').click());assert.deepEqual(starts,[{familyId:simulated?'turning-ravine':'four-locks',tier:1,cardIds:['bushel','furrow','pip'],mode:'new'}]);
      for(const family of ORCHARD_V2_FAMILIES)assert.ok(setupPuzzleTask(family.familyId));
      assert.doesNotMatch(setupPuzzleTask('unequal-crossing'),/choose.*mechanisms/);assert.doesNotMatch(setupPuzzleTask('hollow-bough'),/choose.*mechanisms/);
    }finally{act(()=>root.unmount());dom.window.close();}
  }
});
