const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM,VirtualConsole}=require('jsdom');
const filename=process.argv[2];
assert(filename,'Provide the generated fragment path');
const html=fs.readFileSync(filename,'utf8');
assert(html.length<1000000&&!html.includes('__LOCKS_DATA__'));
const errors=[],virtualConsole=new VirtualConsole();virtualConsole.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(html,{runScripts:'dangerously',virtualConsole}),d=dom.window.document;
assert.equal(d.querySelectorAll('polygon').length,82);
for(const [plan,integrity] of [['assault','10/10'],['control','4/10']]){
 const pick=d.querySelector('[data-plan]');pick.value=plan;pick.dispatchEvent(new dom.window.Event('change'));
 let n=0;while(!d.querySelector('[data-next]').disabled&&n++<30)d.querySelector('[data-next]').click();
 assert(d.querySelector('[data-step]').textContent.startsWith('Victory'));
 assert(d.querySelector('[data-integrity]').textContent.includes(integrity));
 d.querySelector('[data-prev]').click();assert(!d.querySelector('[data-next]').disabled);
}
const solution=[1,3,4,2,4,2,1,3,2,4,3,1,3,1,2,4];
const inputs=[...d.querySelectorAll('[data-grid] select')];assert.equal(inputs.length,16);
inputs.forEach((input,i)=>{if(!input.disabled){input.value=String(solution[i]);input.dispatchEvent(new dom.window.Event('change'));}});
d.querySelector('[data-check]').click();assert(d.querySelector('[data-feedback]').textContent.startsWith('Solved.'));
inputs[1].value='1';inputs[1].dispatchEvent(new dom.window.Event('change'));d.querySelector('[data-check]').click();assert(d.querySelector('[data-feedback]').textContent.includes('repeats'));
d.querySelector('[data-hint]').click();assert(d.querySelector('[data-feedback]').textContent.includes('C1 + D1'));
assert.deepEqual(errors,[]);dom.window.close();
console.log('Passed: 82 hexes; both replays forward and backward; complete puzzle acceptance; duplicate rejection; hint interaction; no DOM script errors.');
