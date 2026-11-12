import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {readFileSync} from 'node:fs';
import {balanceHooks,nextBalanceDeduction} from '../puzzles/balance.js';
import {generateUnequalCrossingCandidate} from '../generation/unequal-crossing.js';
import {generateMaybeFlockCandidate} from '../generation/maybe-flock.js';
import {generateHollowBoughCandidate} from '../generation/hollow-bough.js';
import {nonogramHooks} from '../puzzles/nonogram.js';
import {packingHooks,solvePuzzle as solvePacking} from '../puzzles/packing.js';
import {registerOrchardPuzzleHooks} from '../puzzles/index.js';
import {createRun,reduceCommand,exportRunRecord,replayRun} from '../index.js';
import {makeFixtureBlueprint} from '../fixture.js';
import {mechanismReady,puzzleGuide,outputDescription} from './action-guide.js';
import {nextStep} from './next-step.js';
import {reasonText,eventText,hazardText,rewardText,intentText} from './feedback.js';

const require=createRequire(import.meta.url),React=require('react'),{createRoot}=require('react-dom/client'),{JSDOM}=require('jsdom');
const {act}=React;
const cache=new Map();
async function component(name){
  if(cache.has(name))return cache.get(name);
  const result=await build({stdin:{contents:`import {registerOrchardPuzzleHooks} from '../puzzles/index.js'; registerOrchardPuzzleHooks(); export {default} from './${name}.jsx';`,resolveDir:fileURLToPath(new URL('.',import.meta.url)),loader:'js'},bundle:true,write:false,platform:'node',format:'cjs',external:['react']});
  const module={exports:{}};new Function('require','module','exports',result.outputFiles[0].text)(require,module,module.exports);
  cache.set(name,module.exports.default);return module.exports.default;
}
async function mount(name,props){
  const d=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});
  globalThis.window=d.window;globalThis.document=d.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const root=createRoot(document.getElementById('root')),Panel=await component(name);
  const render=next=>act(()=>root.render(React.createElement(Panel,next)));
  render(props);
  return {d,render,close(){act(()=>root.unmount());d.window.close();}};
}
const find=label=>document.querySelector(`[aria-label="${label}"]`);
const click=element=>act(()=>element.dispatchEvent(new window.MouseEvent('click',{bubbles:true})));
const change=(element,value)=>act(()=>{element.value=String(value);element.dispatchEvent(new window.Event('change',{bubbles:true}));});
const browserRecord=tag=>JSON.parse(readFileSync(new URL(`../../../docs/expeditions/v2/evidence/code-overnight-20261004/${tag}-browser-win-record.json`,import.meta.url),'utf8'));
const browserState=(tag,count)=>{registerOrchardPuzzleHooks();const record=browserRecord(tag),replay=replayRun({initialRun:record.initialRun,commands:record.commands.slice(0,count)});assert.equal(replay.ok,true);return replay.state;};
const button=text=>[...document.querySelectorAll('button')].find(node=>node.textContent===text);
const balance={kind:'balance',loads:[1,2,3,4,5,7].map((value,i)=>({id:`load-${i}`,value,visible:i!==5,candidates:i===5?[3,5,7]:[]})),target:11,usedCount:6,reserveCount:0,panCapacity:{left:11,right:11},maxPanCount:{left:4,right:4},incompatiblePairs:[],hiddenLoadId:'load-5',comparisonAllowance:2};
const nonogram={kind:'nonogram5',rowClues:[[1],[1],[5],[1],[1]],columnClues:[[1],[1],[5],[1],[1]],givens:[{cellId:'r0c2',value:'filled'}]};
const patch=[];for(let q=-2;q<=2;q++)for(let r=-2;r<=2;r++)if(Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))<=2)patch.push(`${q},${r}`);
const packing={kind:'polyhex',patchCells:patch,pieces:[{id:'a',cells:[[0,0],[1,0]]},{id:'b',cells:[[0,0],[1,0],[0,1]]},{id:'c',cells:[[0,0],[1,0],[2,0]]}],sockets:['0,0','1,0','0,1'],forbiddenCells:['-2,0'],approachCells:['2,-2','-1,2'],reflectionAllowed:false,forecastCellIds:['0,0']};

test('actual zero-action browser state gives round advice and prepared-alcove-only state names its legal holding place',async()=>{
  const noActions=browserState('unequal-t1-seed3-alcove',19),step=nextStep(noActions);
  assert.ok(noActions.heroes.every(hero=>hero.ap===0));assert.equal(step.action,'end-round');assert.equal(step.focus,null);assert.match(step.text,/Puzzle thinking and edits are still free/);assert.match(step.text,/Preview End round/);assert.doesNotMatch(step.text,/Walk a hero/);
  const state=browserState('bough-t1-alcove',18),hold=nextStep(state);
  assert.equal(state.preparedAlcove,true);assert.equal(hold.focus,'alcove');assert.match(hold.title,/Brace alcove/);assert.match(hold.text,/prepared alcove holds the Shape job/);
  const mounted=await mount('Guide',{state,onPuzzle(){},onFocus(){},onSkip(){}});
  try{assert.match(document.querySelector('.ov-guide strong').textContent,/Hold Brace alcove/);}finally{mounted.close();}
});

test('phase text distinguishes applied, unapplied and unknown mutations without duplicate punctuation and names suppressed cells',()=>{
  const state=browserState('unequal-t1-seed3-alcove',19),intent={enemyId:'jammer-1',verb:'disrupt',targetId:'control',power:4,actualPath:['4,1'],puzzleChange:{memberId:'load-5',applied:false},blockedBy:{code:'out-of-range',distance:2,range:1}};
  const blocked=intentText(intent,state);assert.match(blocked,/attempts to disrupt/);assert.match(blocked,/change to load 5 is not applied/);assert.doesNotMatch(blocked,/; changes|\.\./);assert.match(blocked,/power 4/);
  assert.match(intentText({...intent,blockedBy:null,puzzleChange:{memberId:'load-5',applied:true}},state),/changes load 5/);
  assert.match(intentText({...intent,blockedBy:null,puzzleChange:{memberId:'load-5'}},state),/plans a change to load 5/);
  const text=eventText({type:'shelter-suppressed',cells:['0,3','1,2']},state);assert.match(text,/0,3, 1,2/);assert.match(text,/for this enemy turn/);assert.doesNotMatch(text,/undefined|\[object Object\]/);
});

test('balance input events use real reducer, preserve AP/active puzzle and replay comparisons',async()=>{
  registerOrchardPuzzleHooks();
  const bp=makeFixtureBlueprint();bp.familyId='unequal-crossing';bp.enemies=[];bp.hazards=[];
  bp.puzzle={...balance,id:'panel-balance',controlId:'control',controlHex:bp.puzzle.controlHex,draftSchemaVersion:1,solutionParameters:{},defaultOutputIds:['balance-crossing'],lockGroups:[{id:'network',anchor:bp.puzzle.controlHex,memberIds:balance.loads.map(load=>load.id),effectKinds:['jam']}]};
  bp.outputs=[{id:'balance-crossing',label:'Crossing',trigger:'on-commit',effect:{kind:'passage'}}];bp.commission={poweredIds:['balance-crossing']};
  for(const tile of bp.tiles)if(tile.passageOutputId)tile.passageOutputId='balance-crossing';
  let state=createRun({blueprint:bp,cardIds:['bushel','furrow','pip'],runId:'panel-balance'}),m;
  const originalActive=JSON.stringify(state.puzzleActive),ap=state.heroes.map(hero=>hero.ap),commands=[];
  const props=()=>({puzzle:bp.puzzle,content:state.puzzleDraft.content,comparisonLog:state.comparisonLog,comparisonsUsed:state.comparisonsUsed,onEdit:edit=>dispatch('edit-draft',{puzzleId:bp.puzzle.id,edit}),onCommand:dispatch});
  function dispatch(type,payload){const command={type,heroId:null,expectedRevision:state.revision,payload},outcome=reduceCommand(state,command);assert.equal(outcome.result.legal,true,JSON.stringify(outcome.result));commands.push(command);state=outcome.state;m.render(props());}
  m=await mount('BalancePanel',props());
  try{
    assert.match(document.body.textContent,/15 \+ unknown/);
    change(find('Place load load-5'),'left');
    assert.match(document.body.textContent,/0 \+ unknown/);
    change(find('Comparison side for load-5'),'left');change(find('Comparison side for load-4'),'right');
    click(button('Compare selected loads'));assert.equal(state.comparisonLog[0].result,'left-heavier');assert.equal(state.comparisonsUsed,1);
    change(find('Inferred value for load-5'),7);assert.equal(state.puzzleDraft.content.inferredValue,7);
    click(button('Repeat recorded comparison'));assert.equal(state.comparisonsUsed,1);
    assert.deepEqual(state.heroes.map(hero=>hero.ap),ap);assert.equal(JSON.stringify(state.puzzleActive),originalActive);assert.equal(state.activeOutputs['balance-crossing'],false);
    const replay=replayRun(exportRunRecord(state),{recordHashes:true});assert.equal(replay.ok,true);assert.equal(replay.state.comparisonsUsed,1);assert.equal(commands.length,4);
  }finally{m.close();}
});

test('hidden balance values stay private and exhausted allowance permits only recorded comparisons',async()=>{
  const content=balanceHooks.createActive(balance);content.assignments['load-5']='left';
  const edits=[],commands=[],props={puzzle:{...balance,loads:balance.loads.map(load=>load.id==='load-5'?{...load,value:3}:load)},content,comparisonLog:[{key:'known',left:['load-5'],right:['load-4'],result:'left-lighter'}],comparisonsUsed:2,onEdit:edit=>edits.push(edit),onCommand:(...args)=>commands.push(args)},m=await mount('BalancePanel',props);
  try{
    assert.match(document.body.textContent,/0 \+ unknown/);assert.equal(find('Inferred value for load-5').value,'');
    change(find('Comparison side for load-5'),'left');change(find('Comparison side for load-0'),'right');assert.equal(button('Compare selected loads').disabled,true);
    change(find('Comparison side for load-0'),'off');change(find('Comparison side for load-4'),'right');assert.equal(button('Repeat recorded comparison').disabled,false);
    click(button('Repeat recorded comparison'));assert.deepEqual(commands,[['compare-loads',{leftLoadIds:['load-5'],rightLoadIds:['load-4']}]]);
    change(find('Inferred value for load-5'),5);assert.deepEqual(edits,[{type:'inferred-value',loadId:'load-5',value:5}]);
  }finally{m.close();}
});

test('generated Unequal tiers can be solved through live panel inputs using public deductions and replay',async()=>{
  registerOrchardPuzzleHooks();
  for(const tier of [1,2,3,4,5]){
    let candidate;
    for(let seed=1;seed<=6;seed++){const result=generateUnequalCrossingCandidate({tier,seed});if(result.status==='success'){candidate=result;break;}}
    assert.ok(candidate,`tier ${tier} has a generated packet`);assert.equal(candidate.certified,false);
    const bp=candidate.blueprint,puzzle=bp.puzzle;
    let state=createRun({blueprint:bp,cardIds:['barrow','cobweb','amberly'],runId:`panel-generated-${tier}`}),mounted;
    const ap=state.heroes.map(hero=>hero.ap),active=JSON.stringify(state.puzzleActive);
    const props=()=>({puzzle,content:state.puzzleDraft.content,comparisonLog:state.comparisonLog,comparisonsUsed:state.comparisonsUsed,onEdit:edit=>dispatch('edit-draft',{puzzleId:puzzle.id,edit}),onCommand:dispatch});
    function dispatch(type,payload){const result=reduceCommand(state,{type,heroId:null,expectedRevision:state.revision,payload});assert.equal(result.result.legal,true,JSON.stringify(result.result));state=result.state;mounted.render(props());}
    mounted=await mount('BalancePanel',props());
    try{
      let done=false;
      for(let step=0;step<20;step++){
        const advice=nextBalanceDeduction(puzzle,state.puzzleDraft.content,state);
        if(advice.type==='ready'){done=true;break;}
        if(advice.type==='comparison'){
          for(const load of puzzle.loads)change(find(`Comparison side for ${load.id}`),advice.leftLoadIds.includes(load.id)?'left':advice.rightLoadIds.includes(load.id)?'right':'off');
          click(button('Compare selected loads'));
        }else if(advice.type==='inference')change(find(`Inferred value for ${advice.loadId}`),advice.value);
        else if(advice.type==='constructive-allocation')change(find(`Place load ${advice.loadId}`),advice.pan);
        else assert.fail(`tier ${tier}: ${JSON.stringify(advice)}`);
      }
      assert.equal(done,true,`tier ${tier} reached a valid draft`);assert.equal(balanceHooks.evaluate(puzzle,state.puzzleDraft.content).valid,true);
      assert.ok(state.comparisonsUsed<=puzzle.comparisonAllowance);assert.deepEqual(state.heroes.map(hero=>hero.ap),ap);assert.equal(JSON.stringify(state.puzzleActive),active);assert.equal(state.activeOutputs['balance-crossing'],false);
      const replay=replayRun(exportRunRecord(state),{recordHashes:true});assert.equal(replay.ok,true);assert.deepEqual(replay.state.puzzleDraft,state.puzzleDraft);
    }finally{mounted.close();}
  }
});

test('nonogram has adjacent clues, fixed givens and three-state edits accepted by production hooks',async()=>{
  let content=nonogramHooks.createActive(nonogram),m;const edits=[];
  const props=()=>({puzzle:nonogram,content,onEdit:edit=>{const outcome=nonogramHooks.applyEdit(nonogram,content,edit);assert.equal(outcome.ok,true);content=outcome.content;edits.push(edit);m.render(props());}});
  m=await mount('NonogramPanel',props());
  try{
    assert.equal(find('Column 3 clues: 5').tagName,'TH');assert.equal(find('Row 3 clues: 5').tagName,'TH');assert.equal(find('Row 1, column 3: filled, printed clue').disabled,true);
    for(const state of ['unknown','filled','empty'])click(find(`Row 1, column 1: ${state}`));
    assert.deepEqual(edits.map(edit=>edit.value),['filled','empty','unknown']);assert.equal(content.grid[0][2],'filled');
  }finally{m.close();}
});

test('packing controls emit complete legal placements and removal; six turns return to origin',async()=>{
  let content=packingHooks.createActive(packing),m;const edits=[];
  const props=()=>({puzzle:packing,content,onEdit:edit=>{const outcome=packingHooks.applyEdit(packing,content,edit);assert.equal(outcome.ok,true,JSON.stringify(outcome));content=outcome.content;edits.push(edit);m.render(props());}});
  m=await mount('PackingPanel',props());
  try{
    assert.equal(button('Reflect branch'),undefined);
    click([...document.querySelectorAll('g[role="button"]')].find(node=>node.getAttribute('aria-label').startsWith('Anchor 0,0,')));
    for(let i=0;i<6;i++)click(find('Rotate branch clockwise'));
    click(button('Place branch a'));assert.deepEqual(content.placements,[{pieceId:'a',originHex:'0,0',orientation:0,reflected:false}]);
    assert.match(document.body.textContent,/Covered sockets: 2 \/ 3/);
    click(button('Remove branch a'));assert.equal(content.placements.length,0);
    const forbidden=[...document.querySelectorAll('g[role="button"]')].find(node=>node.getAttribute('aria-label').includes('Anchor -2,0, forbidden'));
    click(forbidden);assert.equal(button('Place branch a').disabled,true);assert.match(document.body.textContent,/forbidden cell/);
    assert.equal(edits.length,2);
  }finally{m.close();}
});

test('packing keyboard anchors, reflections and every solver placement use the same axial geometry',async()=>{
  const puzzle={...packing,reflectionAllowed:true},solution=solvePacking(puzzle,{limit:1});assert.equal(solution.status,'success');
  let content=packingHooks.createActive(puzzle),m;
  const props=()=>({puzzle,content,onEdit:edit=>{const outcome=packingHooks.applyEdit(puzzle,content,edit);assert.equal(outcome.ok,true);content=outcome.content;m.render(props());}});
  m=await mount('PackingPanel',props());
  try{
    for(const placement of solution.solutions[0].placements){
      click([...document.querySelectorAll('button')].find(node=>node.textContent.includes(`Branch ${placement.pieceId} ·`)));
      const anchor=[...document.querySelectorAll('g[role="button"]')].find(node=>node.getAttribute('aria-label').split(', ').shift()===`Anchor ${placement.originHex}`);
      act(()=>anchor.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true})));
      for(let i=0;i<placement.orientation;i++)click(find('Rotate branch clockwise'));
      if(placement.reflected)click(button('Reflect branch'));
      assert.equal(button(`Place branch ${placement.pieceId}`).disabled,false);click(button(`Place branch ${placement.pieceId}`));
    }
    assert.equal(packingHooks.evaluate(puzzle,content).valid,true);
  }finally{m.close();}
});

test('parent drawer keeps fixed family outputs and sends activation only through preview callback',async()=>{
  registerOrchardPuzzleHooks();
  for(const [puzzle,hooks,label]of [[balance,balanceHooks,'Crossing'],[packing,packingHooks,'Shelter']]){
    const id=puzzle.kind==='balance'?'balance-crossing':'shelter-packing';let activated=0;
    const state={blueprint:{puzzle,enemies:[],commission:{poweredIds:[id]},outputs:[{id,label,effect:{kind:'passage'}}]},puzzleDraft:{content:hooks.createActive(puzzle),selectedOutputIds:[id]},activeOutputs:{[id]:false},comparisonLog:[],comparisonsUsed:0};
    const m=await mount('PuzzlePanel',{state,onEdit(){throw Error('Activation must not edit or spend an action');},onActivate(){activated++;},onCommand(){},onClose(){},onFocus(){}});
    try{
      assert.equal(document.querySelectorAll('input[type="checkbox"]').length,0);assert.equal(button('Save circuit choices'),undefined);assert.match(document.body.textContent,/output is fixed/);assert.doesNotMatch(document.body.textContent,/undefined/);
      click(button('Preview activation · 1 action'));assert.equal(activated,1);
    }finally{m.close();}
  }
});

test('nonogram parent retains two beam choices and stage-specific on-demand help',async()=>{
  const edits=[],commands=[],state={blueprint:{puzzle:nonogram,enemies:[],commission:{poweredCount:2},outputs:['north','east','south'].map(sector=>({id:`beam-${sector}`,label:`${sector} beam`,effect:{kind:'beam',sector}}))},puzzleDraft:{content:nonogramHooks.createActive(nonogram),selectedOutputIds:['beam-north','beam-east']},activeOutputs:{}};
  const m=await mount('PuzzlePanel',{state,onEdit:edit=>edits.push(edit),onCommand:(...args)=>commands.push(args),onClose(){},onActivate(){},onFocus(){}});
  try{
    const boxes=[...document.querySelectorAll('input[type="checkbox"]')];assert.equal(boxes.length,3);click(boxes[1]);click(boxes[2]);click(button('Save circuit choices'));assert.deepEqual(edits,[{type:'select-outputs',outputIds:['beam-north','beam-south']}]);
    assert.equal(commands.length,0);click(button('Observation'));assert.deepEqual(commands,[['request-hint',{puzzleId:'nonogram5',stage:1}]]);
  }finally{m.close();}
});

test('fixed-output readiness uses named outputs and packing suppression from real commission hooks',()=>{
  registerOrchardPuzzleHooks();
  const content=solvePacking(packing,{limit:1}).solutions[0],id='shelter-packing';
  const state={blueprint:{puzzle:packing,tier:4,commission:{poweredIds:[id]},outputs:[{id}]},puzzleValid:true,puzzleActive:{content,selectedOutputIds:[id]},activeOutputs:{[id]:true},phaseEffects:{suppressedShelterCells:[]}};
  assert.equal(mechanismReady(state),true);state.activeOutputs[id]=false;assert.equal(mechanismReady(state),false);
  state.activeOutputs[id]=true;state.phaseEffects.suppressedShelterCells=['0,0'];assert.equal(mechanismReady(state),false);
});

test('family guidance names the actual puzzle and avoids selectable output steps for fixed families',()=>{
  for(const [puzzle,name]of [[balance,'balanced crossing'],[nonogram,'nest chart'],[packing,'branch shelter']]){
    const state={blueprint:{puzzle,commission:{poweredIds:['fixed']},stations:[{id:'control',hex:'0,0',name:'Family control'}]},heroes:[{id:'pip',position:'0,0',ap:2}],profiles:{pip:{name:'Pip'}},puzzleValid:false};
    const guide=puzzleGuide(state),step=nextStep(state);assert.equal(guide.name,name);assert.match(step.title,new RegExp(name));assert.match(step.text,/preview Activate.*confirm/);
    assert.doesNotMatch(guide.brief,/Ledger control|undefined|2×2/);
    if(puzzle.kind!=='nonogram5')assert.doesNotMatch(step.text,/choose .* effects|Save/);
  }
  assert.match(outputDescription({effect:{kind:'beam',sector:'south'}}),/south.*Enemies in that sector pause/);
  assert.match(outputDescription({effect:{kind:'shelter',coverage:'puzzle',amount:2}}),/heroes and stations under the fitted branches 2 shield/);
});

test('family failures and hazard consequences give actionable corrections',()=>{
  const roostState={blueprint:{puzzle:{kind:'nonogram5'},enemies:[],stations:[],orchard:{}},profiles:{}};
  assert.equal(eventText({type:'orchard-damaged',cause:{nestSector:'south'},amount:2,integrityBefore:8,integrityAfter:6},roostState),'The exposed south nest removes 2 orchard integrity: 8 → 6.');
  assert.match(eventText({type:'beam-active',sector:'north'},roostState),/north beam scatters birds/);
  assert.match(eventText({type:'nest-blocked',sectorId:'south'},roostState),/south nest/);
  assert.equal(eventText({type:'shelter-applied',targetIds:[],amount:2},roostState),'Shelter covers no hero or station this enemy turn.');
  assert.match(eventText({type:'shelter-applied',targetIds:['orchard'],amount:2},roostState),/2 shield to Ninefold tree/);
  assert.match(eventText({type:'puzzle-disrupted',memberId:'r0c0',outputsBefore:{},outputsAfter:{}},roostState),/Restore the nest chart/);
  assert.equal(rewardText({ok:true,locked:true,stars:3}),'This tier was not unlocked. No stars were awarded.');
  assert.match(rewardText({ok:false,reason:'invalid-record'}),/could not be verified.*No stars/);
  assert.equal(rewardText({ok:true,locked:false,stars:3}),'3 stars awarded through your collection.');
  assert.match(reasonText('balance-inference-contradicts-comparison'),/recorded comparison/);
  assert.match(reasonText('packing-socket-suppressed'),/lost shelter/);
  for(const [kind,pattern]of [['balance',/returns load/],['nonogram5',/clears row 1, column 1/],['polyhex',/placements stay intact/]]){
    const state={blueprint:{puzzle:{kind},enemies:[],stations:[],orchard:{}},profiles:{}};
    assert.match(eventText({type:'hazard-mutation',memberId:'r0c0'},state),pattern);
    assert.match(hazardText({hazardId:'family-hazard',power:3,mutation:{memberId:'r0c0'},sites:[]},state),kind==='balance'?/return load/:kind==='nonogram5'?/clear row 1, column 1/:/placements stay intact/);
    assert.doesNotMatch(hazardText({hazardId:'family-hazard',power:3,mutation:{memberId:'r0c0'},sites:[]},state),/wind|wheel/);
  }
});


test('generated Roost and Bough tiers accept actual panel events through the reducer without changing committed mechanisms',async()=>{
  registerOrchardPuzzleHooks();
  for(const [family,generate,panel,hooks] of [['roost',generateMaybeFlockCandidate,'NonogramPanel',nonogramHooks],['bough',generateHollowBoughCandidate,'PackingPanel',packingHooks]])for(let tier=1;tier<=5;tier++){
    let candidate;
    for(let seed=1;seed<=4;seed++){candidate=generate({tier,seed,layoutId:'hedges'});if(candidate.status==='success')break;}
    assert.equal(candidate.status,'success',`${family} tier ${tier}`);
    const bp=candidate.blueprint,puzzle=bp.puzzle;
    let state=createRun({blueprint:bp,cardIds:['barrow','cobweb','amberly'],runId:`panel-${family}-${tier}`}),mounted;
    const active=JSON.stringify(state.puzzleActive),ap=state.heroes.map(h=>h.ap),outputs=JSON.stringify(state.activeOutputs);
    const props=()=>({puzzle,content:state.puzzleDraft.content,onEdit:edit=>{
      const outcome=reduceCommand(state,{type:'edit-draft',heroId:null,expectedRevision:state.revision,payload:{puzzleId:puzzle.id,edit}});
      assert.equal(outcome.result.legal,true,JSON.stringify(outcome.result));state=outcome.state;mounted.render(props());
    }});
    mounted=await mount(panel,props());
    try{
      if(family==='roost'){
        for(let r=0;r<5;r++)for(let c=0;c<5;c++){
          const target=puzzle.solutionParameters.grid[r][c];
          for(let n=0;state.puzzleDraft.content.grid[r][c]!==target&&n<3;n++)click(find(`Row ${r+1}, column ${c+1}: ${state.puzzleDraft.content.grid[r][c]}`));
          assert.equal(state.puzzleDraft.content.grid[r][c],target);
        }
        assert.equal(document.querySelectorAll('button:disabled').length,tier===1?1:0);
      }else{
        assert.equal(Boolean(button('Reflect branch')),puzzle.reflectionAllowed);
        for(const placement of puzzle.solutionParameters.placements){
          click([...document.querySelectorAll('button')].find(node=>node.textContent.includes(`Branch ${placement.pieceId} ·`)));
          click([...document.querySelectorAll('g[role="button"]')].find(node=>node.getAttribute('aria-label').split(', ').shift()===`Anchor ${placement.originHex}`));
          for(let n=0;n<placement.orientation;n++)click(find('Rotate branch clockwise'));
          if(placement.reflected)click(button('Reflect branch'));
          assert.equal(button(`Place branch ${placement.pieceId}`).disabled,false);click(button(`Place branch ${placement.pieceId}`));
        }
      }
      assert.equal(hooks.evaluate(puzzle,state.puzzleDraft.content).valid,true);
      assert.equal(JSON.stringify(state.puzzleActive),active);assert.deepEqual(state.heroes.map(h=>h.ap),ap);assert.equal(JSON.stringify(state.activeOutputs),outputs);
      const replay=replayRun(exportRunRecord(state),{recordHashes:true});assert.equal(replay.ok,true);assert.deepEqual(replay.state.puzzleDraft,state.puzzleDraft);
    }finally{mounted.close();}
  }
});
