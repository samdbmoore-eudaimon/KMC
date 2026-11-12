const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
async function main(){
  const out=await esbuild.build({entryPoints:[path.join(__dirname,'party-frame-preview.jsx')],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',logLevel:'error'});
  const dir=path.resolve(__dirname,'../../docs/expeditions/v2/evidence/code-overnight-20261004');
  fs.mkdirSync(dir,{recursive:true});
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Team frame browser QA</title><div id="root"></div><script>'+out.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  fs.writeFileSync(path.join(dir,'party-frame-preview.html'),html);console.log(JSON.stringify({bytes:Buffer.byteLength(html),provenance:'isolated-component-preview'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
