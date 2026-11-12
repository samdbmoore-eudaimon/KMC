const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),esbuild=require('esbuild');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
  const staged=JSON.parse(fs.readFileSync('assets/expeditions/production/9fo/v2/pose-staging-20261005/staged-manifest.json','utf8')),states=[],sources={};
  for(const a of staged.assets.filter(a=>a.gateStatus==='alpha-and-margins-pass')){
    const e=a.evidence.find(e=>e.sourceScope==='actual browser record');if(!e)throw Error(a.id+' lacks browser evidence');
    const bytes=fs.readFileSync(e.file);if(hash(bytes)!==e.sourceSha256)throw Error('Source changed '+e.file);
    const sourceName=path.basename(e.file);sources[sourceName]={file:e.file,sha256:hash(bytes)};
    fs.mkdirSync(path.join(__dirname,'saves'),{recursive:true});fs.writeFileSync(path.join(__dirname,'saves',sourceName),bytes);
    states.push({id:a.id,record:JSON.parse(bytes),prefix:e.firstCommand,source:e.file,sourceSha256:e.sourceSha256});
  }
  fs.writeFileSync(path.join(__dirname,'states.json'),JSON.stringify(states));
  const bundle=await esbuild.build({entryPoints:[path.join(__dirname,'preview.jsx')],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',logLevel:'error',metafile:true});
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Replayed Orchard pose QA</title><div id="root"></div><script>'+bundle.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  fs.writeFileSync(path.join(__dirname,'preview.html'),html);
  fs.writeFileSync(path.join(__dirname,'build-provenance.json'),JSON.stringify({createdAt:new Date().toISOString(),sha256:hash(html),bytes:Buffer.byteLength(html),sources,inputs:Object.fromEntries(Object.keys(bundle.metafile.inputs).filter(p=>!p.startsWith('node_modules/')).map(p=>[p,hash(fs.readFileSync(p))]))},null,2));
  console.log(JSON.stringify({states:states.length,bytes:Buffer.byteLength(html),sha256:hash(html)}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
