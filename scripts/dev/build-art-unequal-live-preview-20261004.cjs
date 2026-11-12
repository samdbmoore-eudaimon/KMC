const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
async function main(){
  const bundle=await esbuild.build({entryPoints:[path.join(__dirname,'art-unequal-live-preview-20261004.jsx')],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',logLevel:'error'});
  const output=path.resolve(__dirname,'../../docs/expeditions/v2/evidence/art-live-20261004/unequal-crossing-art-preview.html');
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unequal Crossing private UI QA</title><div id="root"></div><script>'+bundle.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  fs.writeFileSync(output,html);console.log(JSON.stringify({bytes:Buffer.byteLength(html),provenance:'generated-zero-command-qa-mission'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});

