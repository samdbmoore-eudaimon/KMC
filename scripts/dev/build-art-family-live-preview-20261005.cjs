const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),esbuild=require('esbuild');
async function main(){
  const bundle=await esbuild.build({entryPoints:[path.join(__dirname,'art-family-live-preview-20261005.jsx')],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',logLevel:'error',metafile:true});
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Orchard live art QA</title><div id="root"></div><script>'+bundle.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  const evidence='docs/expeditions/v2/evidence/art-live-20261004',output=`${evidence}/family-art-preview-20261005.html`,hash=b=>crypto.createHash('sha256').update(b).digest('hex');
  fs.mkdirSync(`${evidence}/snapshots`,{recursive:true});
  if(fs.existsSync(output)){const old=fs.readFileSync(output),snapshot=`${evidence}/snapshots/${hash(old)}.html`;if(!fs.existsSync(snapshot))fs.writeFileSync(snapshot,old);}
  fs.writeFileSync(output,html);
  fs.writeFileSync(`${evidence}/build-provenance-current.json`,JSON.stringify({createdAt:new Date().toISOString(),output,sha256:hash(html),inputs:Object.fromEntries(Object.keys(bundle.metafile.inputs).filter(p=>!p.startsWith('node_modules/')).map(p=>[p,hash(fs.readFileSync(p))]))},null,2)+'\n');
  console.log(JSON.stringify({output,bytes:Buffer.byteLength(html),provenance:'actual-family-generators-private-route-separate-disposable-saves'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
