import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {createRun,replayRun,stateHash,previewCommand,reduceCommand} from '../../expeditions/v2/index.js';
import {previewOrchardV2Award,saveActiveRun} from '../../expeditions/v2/persistence.js';
import {createOrchardController} from '../../expeditions/v2/controller.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';

const root=new URL('../../',import.meta.url);
const read=path=>JSON.parse(fs.readFileSync(new URL(path,root),'utf8'));
const evidence='docs/expeditions/v2/evidence/player-recovery/';
registerOrchardPuzzleHooks();
const record=read(evidence+'winning-replay-trace.json');
const progress=read(evidence+'replay-progress.json');
const failed=read(evidence+'failed-attempt-progress.json');

test('browser winning trace replays all accepted commands through the production reducer',()=>{
  const verified=replayRun(record,{recordHashes:true});
  assert.equal(verified.ok,true,JSON.stringify({reason:verified.reason,index:verified.index}));
  assert.equal(verified.state.status,'won');
  assert.equal(verified.state.round,5);
  assert.equal(record.commands.length,31);
  assert.equal(verified.state.puzzleValid,true);
  assert.equal(verified.state.heroes.filter(h=>!h.defeated).length,3);
  const staffed=replayRun({...record,commands:record.commands.slice(0,-1),finalStateHash:null});
  assert.equal(staffed.ok,true);
  assert.equal(Object.keys(staffed.state.holds).length,3,'all stations staffed before the successful enemy phase');
  fs.writeFileSync(new URL(evidence+'production-replay-verification.json',root),JSON.stringify({ok:verified.ok,commandCount:record.commands.length,status:verified.state.status,round:verified.state.round,finalHash:verified.finalHash,hashes:verified.hashes},null,2)+'\n');
});

test('every browser action preview preserves state and matches actual costs, changes and effects',()=>{
  let state=createRun(record.initialRun);
  let free=0,paid=0,combat=0;
  for(const command of record.commands){
    const before=stateHash(state),preview=previewCommand(state,command);
    assert.equal(stateHash(state),before,'preview cannot mutate gameplay');
    const next=reduceCommand(state,command);
    assert.equal(preview.legal,true,command.type);
    assert.equal(next.result.legal,true,command.type);
    for(const field of ['cost','changedEntities','factors','outputsBefore','outputsAfter','events','status'])assert.deepEqual(preview[field],next.result[field],`${command.type}: ${field}`);
    if(command.type==='edit-draft'||command.type==='request-hint'){
      free++;
      assert.equal(next.result.cost.ap,0);
      assert.deepEqual(next.state.heroes.map(h=>h.ap),state.heroes.map(h=>h.ap));
    }
    if(command.type==='operate'){
      paid++;
      assert.equal(next.result.cost.ap,1);
      assert.equal(next.state.puzzleValid,true);
    }
    if(command.type==='strike')combat++;
    state=next.state;
  }
  assert.ok(free>0&&paid>0&&combat>0,'real UI record includes free solving, paid activation and combat');
  assert.equal(stateHash(state),record.finalStateHash);
});

test('map-click browser Dash record preserves actual travel cost, AP and replay hash',()=>{
  const dash=read(evidence+'dash-map-command-trace.json'),verified=replayRun(dash);
  assert.equal(verified.ok,true);
  assert.equal(dash.commands.length,1);
  assert.equal(dash.commands[0].type,'dash');
  const before=createRun(dash.initialRun),preview=previewCommand(before,dash.commands[0]);
  assert.equal(preview.cost.ap,1);
  assert.equal(preview.factors.find(factor=>factor.key==='cost').value,9);
  assert.equal(verified.state.heroes.find(hero=>hero.id==='furrow').ap,1);
  assert.equal(verified.state.heroes.find(hero=>hero.id==='furrow').position,'6,3');
  assert.equal(verified.state.heroes.find(hero=>hero.id==='furrow').handReady.dash,false);
  fs.writeFileSync(new URL(evidence+'dash-map-verification.json',root),JSON.stringify({ok:verified.ok,commandCount:dash.commands.length,finalHash:verified.finalHash,travelCost:9,apCost:preview.cost.ap},null,2)+'\n');
});

test('failed UI attempt and recorded first-clear/replay rewards retain production rules',()=>{
  const failure=replayRun(failed.expeditions.v2.activeRun.record);
  assert.equal(failure.ok,true);
  assert.equal(failure.state.status,'lost');
  assert.equal(failure.state.lossReason.code,'deadline');
  assert.equal(failed.stars,0);
  const first=read(evidence+'first-clear-progress.json');
  assert.equal(first.stars,3);
  assert.equal(progress.stars,3,'replay has not added stars');
  const award=previewOrchardV2Award(progress,record);
  assert.equal(award.ok,true);
  assert.equal(award.stars,0);
  assert.equal(award.alreadyAwarded,true);
});

test('selected restored kit bytes and hashes match preserved files and combined budget',()=>{
  const kit=read('expeditions/v2/art/scene-kit.json');
  const sprites=read('expeditions/v2/art/manifest.json');
  assert.equal(Object.keys(kit.assets).length,13);
  let bytes=0;
  for(const asset of Object.values(kit.assets)){
    const bitmap=fs.readFileSync(new URL(asset.runtimePath,root));
    assert.equal(bitmap.length,asset.bytes);
    assert.equal(crypto.createHash('sha256').update(bitmap).digest('hex'),asset.sha256);
    assert.ok(fs.existsSync(new URL(asset.sourcePath,root)),'reuse source preserved');
    if(asset.alpha){assert.equal(asset.qaPaths.length,4);for(const qa of asset.qaPaths)assert.ok(fs.existsSync(new URL(qa,root)));}
    bytes+=bitmap.length;
  }
  assert.equal(bytes,kit.selectedBytes);
  assert.equal(bytes+sprites.selectedBytes,kit.combinedSelectedBytes);
  assert.ok(kit.combinedSelectedBytes<12*1024*1024);
});

test('real UI teaches free editing, inspects unavailable abilities and confirms a move once',async()=>{
  const require=createRequire(import.meta.url),{build}=require('esbuild'),{JSDOM}=require('jsdom'),React=require('react'),{createRoot}=require('react-dom/client');
  const compiled=await build({stdin:{contents:"import {registerOrchardPuzzleHooks} from './expeditions/v2/puzzles/index.js';registerOrchardPuzzleHooks();export {default} from './expeditions/v2/ui/OrchardExpedition.jsx';",resolveDir:fileURLToPath(root)},bundle:true,write:false,platform:'node',format:'cjs',external:['react','react-dom']});
  const module={exports:{}};
  new Function('require','module','exports',compiled.outputFiles[0].text)(require,module,module.exports);
  const d=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});
  globalThis.window=d.window;globalThis.document=d.window.document;
  Object.defineProperty(globalThis,'navigator',{value:d.window.navigator,configurable:true});
  globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  globalThis.ResizeObserver=class{observe(){}disconnect(){}};
  const initial=createRun(record.initialRun);
  let saved=saveActiveRun({cards:Object.fromEntries(record.initialRun.cardIds.map(id=>[id,1])),stars:0,packs:0},initial);
  const controller=createOrchardController({getProgress:()=>saved,setProgress:update=>{saved=typeof update==='function'?update(saved):update;},ensureHooks:registerOrchardPuzzleHooks});
  const element=document.getElementById('root'),mounted=createRoot(element);
  await React.act(()=>mounted.render(React.createElement(module.exports.default,{profile:{name:'eudaimon',avatar:'card:intermediate:gf_rooke'},controller})));
  const find=(text,scope=element)=>{const button=[...scope.querySelectorAll('button')].find(b=>b.textContent.trim()===text);assert.ok(button,`button ${text}`);return button;};
  const click=async button=>React.act(()=>button.dispatchEvent(new window.MouseEvent('click',{bubbles:true})));
  const current=()=>controller.resume().state;
  assert.equal(element.querySelector('[aria-label="Expedition briefing"]'),null,'resume does not force onboarding');
  await click(find('First actions'));
  assert.match(element.querySelector('.ov-guide').textContent,/Choose a hero/);
  await click(element.querySelector('[aria-label="Select Tuppence"]'));
  assert.match(element.querySelector('.ov-guide').textContent,/Choose a glowing hex/);
  const unavailable=element.querySelector('.ov-hand button[data-unavailable=true]');
  assert.ok(unavailable);
  await click(unavailable);
  assert.ok(element.querySelector('[aria-label="Action choices"]'),'unavailable ability still opens explanation');
  await click(find('Return to board',element.querySelector('[aria-label="Action choices"]')));
  await click(find('Puzzle'));
  const empty=element.querySelector('.ov-grid button[aria-label$="empty"]');
  assert.ok(empty);
  await click(empty);
  const ap=current().heroes.map(h=>h.ap),count=current().actionCount;
  const number=[...element.querySelectorAll('.ov-puzzle button')].find(b=>b.textContent==='1'&&!b.closest('.ov-grid'));
  assert.ok(number);
  await click(number);
  assert.equal(current().actionCount,count+1);
  assert.deepEqual(current().heroes.map(h=>h.ap),ap,'free number edit keeps every hero AP');
  await click(find('Return to board',element.querySelector('.ov-puzzle')));
  const target=[...element.querySelectorAll('.ov-board-list button')].find(b=>b.textContent.startsWith('Preview move to '));
  assert.ok(target);
  const before=stateHash(current()),beforeCount=current().actionCount;
  await click(target);
  assert.equal(stateHash(current()),before,'opening preview spends nothing');
  assert.match(element.querySelector('.ov-guide').textContent,/Review this move/);
  const confirm=find('Confirm',element.querySelector('.ov-preview'));
  await React.act(()=>{confirm.dispatchEvent(new window.MouseEvent('click',{bubbles:true}));confirm.dispatchEvent(new window.MouseEvent('click',{bubbles:true}));});
  assert.equal(current().actionCount,beforeCount+1,'two confirmation events execute once');
  assert.equal(current().heroes.find(h=>h.id==='tuppence').ap,1);
  assert.match(element.querySelector('.ov-guide').textContent,/Try the number lock/);
  await click(element.querySelector('[aria-label="Select Furrow"]'));
  const furrowBefore=current(),normal=controller.listCommands(furrowBefore,'furrow').find(command=>command.type==='move');
  const dash=controller.listCommands(furrowBefore,'furrow').find(command=>command.type==='dash');
  const dashButton=[...element.querySelectorAll('.ov-hand button')].find(button=>button.textContent.startsWith('Dash'));
  await click(dashButton);
  assert.equal(element.querySelector('[aria-label="Action choices"]'),null,'Dash does not open a coordinate target drawer');
  assert.match(element.querySelector('.ov-movement-choice').textContent,/tap a highlighted hex/);
  assert.equal(element.querySelector('.ov-movement-key'),null);
  assert.match(element.querySelector('.ov-movement-choice').textContent,/1 AP/);
  assert.doesNotMatch(element.querySelector('.ov-movement-choice').textContent,/budget|travel cost/i);
  assert.ok(dash.targets.length>normal.targets.length,'Dash exposes its actual longer reach');
  const marked=[...element.querySelectorAll('polygon[data-movement-cost]')];
  assert.equal(marked.length,dash.targets.length);
  for(const target of dash.targets){const hex=marked.find(hex=>hex.getAttribute('aria-label')===`Reachable hex ${target.destination}`);assert.ok(hex);assert.equal(Number(hex.dataset.movementCost),target.cost);}
  const destination=dash.targets.find(target=>target.cost>normal.targets.reduce((max,target)=>Math.max(max,target.cost),0))||dash.targets.at(-1);
  const hex=marked.find(hex=>hex.getAttribute('aria-label')===`Reachable hex ${destination.destination}`);
  const beforeDash=stateHash(current());
  await React.act(()=>hex.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true})));
  assert.equal(stateHash(current()),beforeDash,'a map destination preview is pure');
  assert.ok(element.querySelector('[aria-label="Chosen destination"]'));
  assert.match(element.querySelector('.ov-preview').textContent,/Travel to the marked hex/);
  assert.doesNotMatch(element.querySelector('.ov-preview').textContent,/Destination: -?\d|budget|movement points|travel cost/i);
  await click(find('Confirm',element.querySelector('.ov-preview')));
  assert.equal(current().heroes.find(hero=>hero.id==='furrow').position,destination.destination);
  assert.equal(current().heroes.find(hero=>hero.id==='furrow').ap,1,'any legal Dash distance costs one AP');
  assert.equal(current().heroes.find(hero=>hero.id==='furrow').handReady.dash,false);
  assert.equal(element.querySelector('.ov-movement-choice'),null,'accepted movement exits destination picking');
  const spent=[...element.querySelectorAll('.ov-hand button')].find(button=>button.textContent.startsWith('Dash'));
  await click(spent);
  assert.match(element.querySelector('.ov-movement-choice').textContent,/spent/);
  assert.equal(element.querySelectorAll('polygon[data-movement-cost]').length,0,'spent Dash advertises no legal destination');
  await click(find('Cancel movement'));
  await React.act(()=>mounted.unmount());d.window.close();
});
