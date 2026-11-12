import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {JSDOM} from 'jsdom';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createRun} from '../../expeditions/v2/run.js';
import {generateTurningRavineCandidate} from '../../expeditions/v2/generation/turning-ravine.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {activeFace,rotationHooks} from '../../expeditions/v2/puzzles/rotation.js';
import {wheelSlots} from '../../expeditions/v2/art/wheel-geometry.js';
import {entityName,eventText,reasonText} from '../../expeditions/v2/ui/feedback.js';

registerOrchardPuzzleHooks();
const require=createRequire(import.meta.url);
const compiled=await build({entryPoints:['expeditions/v2/ui/RotationBoard.jsx'],bundle:true,write:false,platform:'node',format:'cjs',external:['react','react-dom']});
const module={exports:{}};
new Function('require','module','exports',compiled.outputFiles[0].text)(require,module,module.exports);
const {default:Board,RotationControls,rotationTrackText}=module.exports;
const blueprint=generateTurningRavineCandidate({seed:1,layoutId:'hedges'}).blueprint;
const fresh=()=>createRun({blueprint,cardIds:['tuppence','furrow','sorrel'],runId:'ravine-ui-test'});
const documentFor=element=>new JSDOM(renderToStaticMarkup(element)).window.document;

test('each engine orientation puts its exact active face under the fixed upright notch',()=>{
  for(let orientation=0;orientation<6;orientation++){
    const state=fresh(),wheel=blueprint.puzzle.tokens.find(t=>t.id==='O');state.puzzleDraft.content.orientations.O=orientation;
    const doc=documentFor(React.createElement('svg',null,React.createElement(Board,{state}))),group=doc.querySelector('[data-equation-wheel="O"]');
    assert.ok(group.querySelector('[role="img"]').getAttribute('aria-label').endsWith(`active face ${activeFace(wheel.faces,orientation)??'blank'}`));
    const top=wheelSlots(-orientation).find(slot=>Math.abs(slot.x-256)<1e-8&&slot.y<256);
    assert.equal(wheel.faces[top.index],activeFace(wheel.faces,orientation));
    const glyph=group.querySelector(`[data-face-index="${top.index}"]`);
    assert.equal(glyph.textContent,String(wheel.faces[top.index]??''));assert.equal(glyph.hasAttribute('transform'),false);
    assert.equal(group.querySelector('[data-wheel-layer="fixed-pointer"]').hasAttribute('transform'),false);
  }
});

test('free wheel edit changes every linked draft equation and preserves committed state',()=>{
  const state=fresh(),puzzle=blueprint.puzzle,original=structuredClone(state),wheelId='B';
  const tracks=puzzle.tracks.filter(track=>track.tokenIds.includes(wheelId));assert.ok(tracks.length>=2);
  const before=tracks.map(track=>rotationTrackText(puzzle,state.puzzleDraft.content,track));
  state.puzzleDraft.content=rotationHooks.applyEdit(puzzle,state.puzzleDraft.content,{type:'rotate-wheel',wheelId,delta:1}).content;
  const after=tracks.map(track=>rotationTrackText(puzzle,state.puzzleDraft.content,track));
  before.forEach((text,i)=>assert.notEqual(after[i],text));
  assert.deepEqual(state.puzzleActive,original.puzzleActive);assert.deepEqual(state.heroes,original.heroes);assert.deepEqual(state.activeOutputs,original.activeOutputs);
  const controls=RotationControls({state,wheelId,onEdit:()=>{},onClose:()=>{}}),doc=documentFor(controls);
  assert.equal(doc.querySelectorAll('button').length,3);assert.match(doc.body.textContent,/Turning the draft is free; activation uses 1 action/);
  for(const track of tracks)assert.ok(doc.body.textContent.includes(rotationTrackText(puzzle,state.puzzleDraft.content,track)));
});

test('board distinguishes true draft readings from activated circuits',()=>{
  const state=fresh();state.puzzleDraft.content.orientations=blueprint.puzzle.solutionParameters.orientations;
  const doc=documentFor(React.createElement('svg',null,React.createElement(Board,{state,selectedId:'B'})));
  assert.equal(doc.querySelectorAll('[data-equation-wheel]').length,6);assert.equal(doc.querySelectorAll('[data-equation-track]').length,3);
  for(const track of doc.querySelectorAll('[data-equation-track]')){assert.match(track.getAttribute('aria-label'),/: true; circuit off$/);assert.equal(track.querySelectorAll('polyline')[1].hasAttribute('stroke-dasharray'),false);}
  assert.equal(doc.querySelector('[data-equation-wheel="B"] [data-wheel-state]').getAttribute('data-wheel-state'),'selected');
});

test('invalid division is explained rather than displayed as an approximate equality',()=>{
  const puzzle={tokens:[{id:'a',kind:'number',value:7},{id:'op',kind:'operator',value:'÷'},{id:'b',kind:'number',value:2},{id:'eq',kind:'operator',value:'='},{id:'c',kind:'number',value:3}],tracks:[{id:'eq1',tokenIds:['a','op','b','eq','c']}]};
  const text=rotationTrackText(puzzle,{orientations:{}},puzzle.tracks[0]);
  assert.match(text,/division must give a whole number/);
});

test('wind feedback names the cause and absent optional IDs never access an absent puzzle',()=>{
  const state=fresh();assert.equal(entityName(state,'network'),'Equation network');
  assert.equal(eventText({type:'orchard-damaged',amount:3,integrityBefore:20,integrityAfter:17,cause:{hazardId:'ravine-wind'}},state),'The ravine wind removes 3 orchard integrity: 20 → 17.');
  const partial={blueprint:{stations:[],enemies:[]},profiles:{}};
  assert.equal(entityName(partial,undefined),'');assert.doesNotThrow(()=>reasonText('not-enough-ap',{},partial));
});
