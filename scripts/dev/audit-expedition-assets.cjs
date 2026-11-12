const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'docs/expeditions/asset-audit-2026-10-01');
const relative = p => path.relative(root, p).replaceAll('\\', '/');
const walk = p => fs.readdirSync(p, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(p,e.name)) : [path.join(p,e.name)]);
const imageRx = /\.(png|webp|jpe?g|svg)$/i;
async function main() {
  fs.mkdirSync(out, {recursive:true});
  const refs = new Map(), imports = new Map(), errors = [];
  const add = (map, p, value) => map.set(p, [...(map.get(p) || []), value]);
  for (const world of ['9fo','lr']) {
    const manifest = JSON.parse(fs.readFileSync(path.join(root,`assets/expeditions/production/${world}/manifest.json`),'utf8'));
    function visit(v, key) {
      if (typeof v === 'string' && imageRx.test(v)) add(refs,path.resolve(root,manifest.root,v),`${world}:${key}`);
      else if (v && typeof v === 'object') for (const [k,x] of Object.entries(v)) visit(x, `${key}.${k}`);
    }
    visit(manifest,'manifest');
  }
  for (const p of walk(path.join(root,'expeditions')).filter(p => /\.[cm]?jsx?$/.test(p))) {
    const source = fs.readFileSync(p,'utf8');
    for (const m of source.matchAll(/(?:from\s*|import\s*)["']([^"']+\.(?:png|webp|jpe?g|svg))["']/g)) add(imports,path.resolve(path.dirname(p),m[1]),relative(p));
  }
  const rows = [];
  for (const p of walk(path.join(root,'assets/expeditions')).sort()) {
    const data = fs.readFileSync(p), rel = relative(p), parts = rel.split('/');
    const row = {path:rel, world:parts[3] || '', stage:parts[4] || '', category:parts[5] || '', bytes:data.length, extension:path.extname(p).slice(1), sha256:crypto.createHash('sha256').update(data).digest('hex'), manifestRefs:refs.get(p)||[], importRefs:imports.get(p)||[]};
    if (imageRx.test(p)) try {
      const meta = await sharp(data).metadata();
      Object.assign(row,{width:meta.width,height:meta.height,hasAlpha:meta.hasAlpha});
      if (meta.hasAlpha) {
        const sample = await sharp(data).resize(32,32,{fit:'fill'}).ensureAlpha().raw().toBuffer();
        row.cornerAlpha = [3,31*4+3,31*32*4+3,(32*32-1)*4+3].map(i=>sample[i]);
      }
    } catch(e) { row.decodeError = e.message; errors.push({path:rel,error:e.message}); }
    rows.push(row);
  }
  const runtime = rows.filter(r=>r.stage==='runtime' && imageRx.test(r.path));
  const groups = {};
  for (const r of rows) {
    const key = `${r.world}/${r.stage}/${r.category}`;
    const g = groups[key] ||= {files:0,bytes:0}; g.files++;g.bytes+=r.bytes;
  }
  const missing = [...refs,...imports].filter(([p])=>!fs.existsSync(p)).map(([p,r])=>({path:relative(p),refs:r}));
  const hashes = {};
  for (const r of runtime) (hashes[r.sha256] ||= []).push(r.path);
  const summary = {date:'2026-10-01', totalFiles:rows.length,totalBytes:rows.reduce((s,r)=>s+r.bytes,0),runtimeFiles:runtime.length,runtimeBytes:runtime.reduce((s,r)=>s+r.bytes,0),groups,missing,decodeErrors:errors,duplicates:Object.values(hashes).filter(r=>r.length>1),runtimeNotInManifest:runtime.filter(r=>!r.manifestRefs.length).map(r=>r.path),runtimeNotImported:runtime.filter(r=>!r.importRefs.length).map(r=>r.path),largestRuntime:runtime.toSorted((a,b)=>b.bytes-a.bytes).slice(0,15)};
  fs.writeFileSync(path.join(out,'inventory.json'),JSON.stringify(rows,null,2));
  fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
  const fields=['path','world','stage','category','extension','bytes','width','height','hasAlpha','manifestRefs','importRefs'];
  const csv = v => '"'+String(Array.isArray(v)?v.join(' | '):v??'').replaceAll('"','""')+'"';
  fs.writeFileSync(path.join(out,'inventory.csv'),fields.join(',')+'\n'+rows.map(r=>fields.map(k=>csv(r[k])).join(',')).join('\n')+'\n');
  for (const world of ['9fo','lr']) for (const categories of [['enemies'],['terrain','mechanisms','objectives','props'],['backgrounds']]) {
    const selected = runtime.filter(r=>r.world===world && categories.includes(r.category));
    for (let offset=0;offset<selected.length;offset+=36) {
      const chunk=selected.slice(offset,offset+36), w=1200,h=Math.ceil(chunk.length/6)*160, composites=[];
      for (let i=0;i<chunk.length;i++) {
        const thumb=await sharp(path.join(root,chunk[i].path)).resize(180,118,{fit:'contain',background:'#dce6d5'}).png().toBuffer();
        const label=path.basename(chunk[i].path).replace(/\.(png|webp|svg)$/,'');
        const text='<svg width="200" height="40"><text x="5" y="15" font-size="10">'+label.slice(0,30)+'</text><text x="5" y="29" font-size="10">'+label.slice(30)+'</text></svg>';
        composites.push({input:thumb,left:(i%6)*200+10,top:Math.floor(i/6)*160},{input:Buffer.from(text),left:(i%6)*200,top:Math.floor(i/6)*160+120});
      }
      await sharp({create:{width:w,height:h,channels:3,background:'#dce6d5'}}).composite(composites).png().toFile(path.join(out,`${world}-${categories.join('-')}-${offset/36+1}.png`));
    }
  }
  console.log(JSON.stringify({totalFiles:summary.totalFiles,totalMiB:summary.totalBytes/1048576,runtimeFiles:runtime.length,runtimeMiB:summary.runtimeBytes/1048576,groups,missing:missing.length,decodeErrors:errors.length,duplicateGroups:summary.duplicates.length,notManifested:summary.runtimeNotInManifest.length,notImported:summary.runtimeNotImported.length},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
