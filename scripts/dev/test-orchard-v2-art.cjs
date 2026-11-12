const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const sharp=require('sharp');
const {alphaAnalysis}=require('./prepare-orchard-v2-art.cjs');
const root=path.resolve(__dirname,'../..');

test('alpha diagnostics detect disconnected pieces and opaque backgrounds',()=>{
  const pixels=Buffer.alloc(4*16);
  for(const i of [0,1,4,5,15]){pixels[i*4]=70;pixels[i*4+1]=90;pixels[i*4+2]=50;pixels[i*4+3]=255;}
  const result=alphaAnalysis(pixels,4,4);
  assert.equal(result.componentCount,2);assert.equal(result.detachedPixels,1);
  assert.deepEqual(result.visibleBounds,[0,0,4,4]);assert.equal(result.transparentPixels,11);
});
test('selected package has all heroes, prescribed enemies, valid hashes and budget',async()=>{
  const delivery=JSON.parse(fs.readFileSync(path.join(root,'docs/expeditions/v2/art-delivery.json'),'utf8'));
  assert.equal(Object.keys(delivery.characters).length,30);
  assert.deepEqual(Object.keys(delivery.enemies).sort(),['crosswind','hookmole','scruffcrow','strawling']);
  const ids=new Map(delivery.assets.map(a=>[a.id,a]));
  assert.equal(ids.size,delivery.assets.length);
  for(const poses of Object.values(delivery.characters))assert.deepEqual(Object.keys(poses).sort(),['action','exhausted','idle','rear']);
  for(const poses of [...Object.values(delivery.characters),...Object.values(delivery.enemies)])for(const id of Object.values(poses))assert(ids.has(id));
  let total=0;
  for(const asset of delivery.assets) {
    const b=fs.readFileSync(path.join(root,asset.runtimePath));total+=b.length;
    assert.equal(b.length,asset.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),asset.sha256);
    const meta=await sharp(b).metadata();assert.equal(meta.width,asset.width);assert.equal(meta.height,asset.height);
    const max=asset.category==='backgrounds'?[1600,900]:asset.category==='ui'&&!asset.id.endsWith('badge')?[512,192]:asset.id==='equation-frame'?[512,512]:[384,384];
    assert(meta.width<=max[0]&&meta.height<=max[1],asset.id);
    for(const p of Object.values(asset.qaPaths))assert(fs.existsSync(path.join(root,p)),p);
    for(const [x,y]of [asset.groundAnchor,asset.topCentre])assert(x>=0&&x<meta.width&&y>=0&&y<meta.height,asset.id);
    assert.equal(asset.reviewStatus,'candidate');
  }
  assert.equal(total,delivery.selectedBytes);assert(total<=12*1024*1024);
  const wheel=ids.get('equation-frame');assert.equal(wheel.overlayAnchors.sectorCentres.length,6);
  const [cx,cy]=wheel.overlayAnchors.rotationCentre;
  for(let i=0;i<6;i++){const [x,y]=wheel.overlayAnchors.sectorCentres[i],angle=(-90+i*60)*Math.PI/180;assert(Math.abs(x-cx-Math.cos(angle)*108)<1e-8);assert(Math.abs(y-cy-Math.sin(angle)*108)<1e-8);}
});
