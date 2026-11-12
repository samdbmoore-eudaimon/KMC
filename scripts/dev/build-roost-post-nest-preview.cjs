const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),esbuild=require('esbuild');
async function main(){
  const root=path.resolve(__dirname,'../..'),folder=path.join(root,'docs/expeditions/v2/evidence/code-overnight-20261004');
  const source=fs.readFileSync(path.join(__dirname,'unequal-crossing-ui-preview.jsx'),'utf8').replaceAll('orchard-code-family-ui-20261005','orchard-code-roost-post-nest-20261005').replaceAll('orchard-code-overnight-unequal-ui-20261004','orchard-code-roost-post-nest-default-20261005');
  const entry=path.join(__dirname,'roost-post-nest-preview.jsx');fs.writeFileSync(entry,source);
  const bundle=await esbuild.build({entryPoints:[entry],bundle:true,write:false,metafile:true,format:'iife',platform:'browser',target:'es2022',logLevel:'error'});
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Post nest snapshot Roost private QA</title><div id="root"></div><script>'+bundle.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  const hashes=Object.fromEntries(Object.keys(bundle.metafile.inputs).filter(file=>!file.includes('node_modules')).map(file=>[file.replaceAll('\\','/'),crypto.createHash('sha256').update(fs.readFileSync(path.resolve(root,file))).digest('hex')]));
  hashes['roost-post-nest-preview.html']=crypto.createHash('sha256').update(html).digest('hex');
  fs.writeFileSync(path.join(folder,'roost-post-nest-preview.html'),html);fs.writeFileSync(path.join(folder,'roost-post-nest-source-checkpoint-20261005.json'),JSON.stringify({createdAt:new Date().toISOString(),bytes:Buffer.byteLength(html),hashes,provenance:'New post-fix private zero-command fixture, distinct local keys, no imported playing/winning state'},null,2));console.log(JSON.stringify({bytes:Buffer.byteLength(html),enemyHash:hashes['expeditions/v2/enemy.js'],inputs:Object.keys(hashes).length}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
