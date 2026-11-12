import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import manifest from '../art/river-manifest.json' with {type:'json'};
import {ORCHARD_RIVER_ART} from '../art/river-art.js';
import {riverLayout,RIVER_DIRECTIONS,exposedFrontEdges} from './river-layout.js';
test('all rotations register real straight and gentle neighbours without changing tiles',()=>{
  for(const base of [[3,0],[3,1]])for(let turn=0;turn<6;turn++){
    const edges=base.map(e=>(e+turn)%6),tiles=[{q:0,r:0,terrain:'bridge'},...edges.map(e=>({q:RIVER_DIRECTIONS[e][0],r:RIVER_DIRECTIONS[e][1],terrain:'water'}))],before=JSON.stringify(tiles),row=riverLayout(tiles)[0];
    assert.ok(row.kind);assert.deepEqual(row.mouths.toSorted(),edges.toSorted());assert.equal(JSON.stringify(tiles),before);
  }
});
test('outlets must point outside the board and unsupported junctions stay explicit',()=>{
  const tiles=[{q:0,r:0,terrain:'water'},{q:1,r:0,terrain:'water'},...RIVER_DIRECTIONS.slice(1).map(([q,r])=>({q,r,terrain:'floor'}))];
  assert.equal(riverLayout(tiles)[0].kind,null);
  const boundary=riverLayout(tiles.slice(0,2))[0];assert.ok(boundary.kind);assert.equal(boundary.outlets.length,1);
  assert.equal(riverLayout([{q:0,r:0,terrain:'water'},...RIVER_DIRECTIONS.map(([q,r])=>({q,r,terrain:'water'}))])[0].reason,'branch');
});
test('painted front walls omit shared faces',()=>{
  assert.deepEqual(exposedFrontEdges({q:0,r:0},[{q:0,r:0},{q:0,r:1}]),[2]);
});
test('saved slice packets all have supported two-mouth river geometry',()=>{
  const audit=JSON.parse(fs.readFileSync('assets/expeditions/production/9fo/v2/river-art-batch/qa/topology-audit.json'));
  let observations=0;
  for(const {file}of audit.files){const packet=JSON.parse(fs.readFileSync(file));for(const row of riverLayout(packet.blueprint.tiles)){observations++;assert.ok(row.kind,`${file}: ${row.hex} ${row.reason}`);}}
  assert.equal(audit.files.length,77);assert.equal(observations,531);
});
test('selected river imports match source/runtime hashes and registered candidate geometry',()=>{
  let total=0;assert.equal(manifest.status,'candidate-live-review');assert.equal(Object.keys(manifest.assets).length,4);
  for(const asset of Object.values(manifest.assets)){
    const bytes=Buffer.from(ORCHARD_RIVER_ART[asset.id].split(',')[1],'base64');total+=bytes.length;
    assert.equal(bytes.length,asset.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),asset.sha256);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(asset.runtimePath)).digest('hex'),asset.sha256);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(asset.sourcePath)).digest('hex'),asset.sourceSha256);
    assert.equal(asset.alphaAnalysis.detachedPixels,0);assert.ok(bytes.length<=70*1024);
    if(asset.connectionEdges){assert.deepEqual(asset.centre,[192,192]);assert.equal(asset.side,162);assert.ok(asset.connectionEdges.length===2);}
  }
  assert.equal(total,manifest.selectedBytes);assert.ok(total+2457420<=12*1024*1024);
});
