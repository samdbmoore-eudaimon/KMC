import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {transform} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {WHEEL_GEOMETRY,WHEEL_STATES,wheelSlots,wheelSector} from '../../expeditions/v2/art/wheel-geometry.js';
const componentPath=fileURLToPath(new URL('../../expeditions/v2/art/EquationWheel.jsx',import.meta.url)),built=await transform(fs.readFileSync(componentPath,'utf8'),{loader:'jsx',format:'cjs'}),module={exports:{}};
new Function('require','module','exports',built.code)(createRequire(componentPath),module,module.exports);
const Component=module.exports.default;
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8);
test('six exact slot centres preserve blank label-safe discs and active-face rotation',()=>{
  for(let orientation=-6;orientation<=6;orientation++){
    const slots=wheelSlots(orientation),active=((orientation%6)+6)%6;assert.equal(slots.length,6);
    close(slots[active].x,256);close(slots[active].y,148);
    for(const s of slots){close(Math.hypot(s.x-256,s.y-256),108);assert.ok(108-24>52);assert.ok(108+24<150);}
  }
  assert.deepEqual(WHEEL_GEOMETRY.fixedPointer,[256,118]);assert.throws(()=>wheelSlots(.5),/integer/);
  assert.equal(new Set(Array.from({length:6},(_,i)=>wheelSector(i))).size,6);
});
test('actual React component separates rotating frame, upright live glyphs and fixed pointer in every state',()=>{
  for(const appearance of WHEEL_STATES)for(let rotation=0;rotation<6;rotation++){
    const faces=['=','+','−','×','÷',''];
    const markup=renderToStaticMarkup(React.createElement(Component,{appearance,rotation,faces}));
    const document=new JSDOM(`<svg>${markup}</svg>`).window.document,inner=document.querySelector('[data-wheel-layer="inner"]'),glyphs=document.querySelector('[data-wheel-layer="glyphs"]'),pointer=document.querySelector('[data-wheel-layer="fixed-pointer"]');
    assert.equal(inner.getAttribute('transform'),`rotate(${-rotation*60} 256 256)`);assert.equal(inner.contains(glyphs),false);assert.equal(inner.contains(pointer),false);
    assert.equal(glyphs.getAttribute('transform'),null);assert.equal(pointer.getAttribute('transform'),null);
    assert.deepEqual([...glyphs.querySelectorAll('text')].map(t=>t.textContent),faces);
    assert.equal(glyphs.querySelectorAll('text[transform]').length,0);assert.equal(pointer.querySelector('path').getAttribute('d'),'M244,94H268L256,118Z');
    assert.match(document.querySelector('[data-wheel-state]').getAttribute('aria-label'),new RegExp(`active face ${faces[rotation]||''}`));
  }
});
test('wheel metadata is shared with prepared and selected art and two-digit glyphs stay within safe width',()=>{
  const prepared=JSON.parse(fs.readFileSync(new URL('../../docs/expeditions/v2/art-delivery.json',import.meta.url),'utf8')).assets.find(a=>a.id==='equation-frame');
  const manifest=JSON.parse(fs.readFileSync(new URL('../../expeditions/v2/art/manifest.json',import.meta.url),'utf8')),selected=manifest.assets['equation-frame'];
  assert.equal(prepared.sha256,selected.sha256);assert.deepEqual(prepared.overlayAnchors.sectorCentres,wheelSlots().map(s=>[s.x,s.y]));
  assert.deepEqual(selected.overlayAnchors,prepared.overlayAnchors);assert.deepEqual(selected.allowedStates,WHEEL_STATES);
  const document=new JSDOM(`<svg>${renderToStaticMarkup(React.createElement(Component,{faces:[2,4,6,8,10,12]}))}</svg>`).window.document;
  const glyphs=document.querySelectorAll('[data-wheel-layer="glyphs"] text');assert.equal(glyphs[4].getAttribute('font-size'),'28');assert.equal(glyphs[0].getAttribute('font-size'),'44');
  assert.throws(()=>renderToStaticMarkup(React.createElement(Component,{faces:[1]})),/Invalid wheel/);
});
