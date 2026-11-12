const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
async function main(){
  const bundle=await esbuild.build({entryPoints:[path.join(__dirname,'unequal-crossing-ui-preview.jsx')],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',logLevel:'error'});
  const output=path.resolve(__dirname,'../../docs/expeditions/v2/evidence/code-overnight-20261004/unequal-crossing-ui-preview.html');
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unequal Crossing private UI QA</title><div id="root"></div><script>'+bundle.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  fs.writeFileSync(output,html);console.log(JSON.stringify({bytes:Buffer.byteLength(html),provenance:'generated-zero-command-qa-mission'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
