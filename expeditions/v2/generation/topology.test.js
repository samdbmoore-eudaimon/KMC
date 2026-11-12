import test from 'node:test';
import assert from 'node:assert/strict';
import {ARCHETYPES,footprint,generateTopology,structuralFingerprint} from './topology.js';
test('measured footprint has exactly 92 axial cells',()=>{const cells=footprint();assert.equal(cells.length,92);assert.equal(new Set(cells.map(t=>`${t.q},${t.r}`)).size,92);});
test('all four grammars reproduce valid varied layouts without changing water cuts',()=>{
  for(const layoutId of ARCHETYPES) {
    const fingerprints=new Set();
    for(let seed=1;seed<=3;seed++) {
      const args={familyId:'four-locks',tier:1,seed,layoutId},a=generateTopology(args),b=generateTopology(args);
      assert.equal(a.status,'success',`${layoutId} seed ${seed}: ${JSON.stringify(a)}`);assert.deepEqual(a,b);assert(a.metrics.valid);
      fingerprints.add(a.structuralFingerprint);
      if(layoutId==='river')assert(a.tiles.filter(t=>t.q+Math.floor(t.r/2)===6&&t.terrain==='water').length===6);
      if(layoutId==='islands')assert(a.tiles.filter(t=>[4,7].includes(t.q+Math.floor(t.r/2))&&t.terrain==='water').length===14);
    }
    assert(fingerprints.size>=2,layoutId);
  }
});
test('structural fingerprint canonicalises D6 and translation',()=>{
  const a=generateTopology({layoutId:'river',seed:1});assert.equal(a.status,'success');
  const transform=key=>{const [q,r]=key.split(',').map(Number);return `${-r+13},${q+r-9}`;};
  const tiles=a.tiles.map(t=>{const [q,r]=transform(`${t.q},${t.r}`).split(',').map(Number);return {...t,q,r};});
  const anchors=Object.fromEntries(Object.entries(a.anchors).map(([role,hex])=>[role,transform(hex)]));
  assert.equal(structuralFingerprint(tiles,anchors),a.structuralFingerprint);
});
test('packing reserves all 19 clearing cells on each family-specific grammar',()=>{
  for(const layoutId of ARCHETYPES){const a=generateTopology({familyId:'hollow-bough',layoutId,seed:2});assert.equal(a.status,'success',layoutId);assert.equal(a.patchCells.length,19);assert(a.patchCells.every(id=>a.tiles.some(t=>`${t.q},${t.r}`===id&&['floor','clearing','path'].includes(t.terrain))));}
});
test('invalid requests and bounded unknown are not certified success',()=>{
  assert.equal(generateTopology({layoutId:'wrong'}).status,'failure');assert.equal(generateTopology({tier:6}).status,'failure');
  assert.equal(generateTopology({maxAttempts:0}).status,'failure');
});
