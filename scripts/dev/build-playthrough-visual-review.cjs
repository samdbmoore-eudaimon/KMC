const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
async function main(){
  const root=path.resolve(__dirname,'../..'),dir=path.join(root,'docs/expeditions/v2/evidence/playthrough-recovery-20261003');
  const result=await esbuild.build({entryPoints:[path.join(__dirname,'playthrough-visual-review.jsx')],bundle:true,write:false,platform:'browser',format:'iife',target:'es2022',logLevel:'error'});
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Playthrough visual recovery QA</title><div id="root"></div><script>'+result.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  fs.writeFileSync(path.join(dir,'visual-review.html'),html);console.log(JSON.stringify({bytes:Buffer.byteLength(html),sharedBuild:false}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
