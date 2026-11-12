const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
async function main(){
  const root=path.resolve(__dirname,'../..'),folder=path.join(root,'docs/expeditions/v2/evidence/code-overnight-20261004');
  const entries=JSON.parse(fs.readFileSync(path.join(root,'docs/expeditions/v2/evidence/art-pose-integrate-20261005/states.json'),'utf8')).filter(entry=>['hero-cobweb-action','hero-amberly-exhausted'].includes(entry.id));
  fs.writeFileSync(path.join(folder,'selected-info-states.json'),JSON.stringify(entries));
  const bundle=await esbuild.build({entryPoints:[path.join(__dirname,'selected-info-ui-preview.jsx')],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',logLevel:'error'});
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Selected hero replay QA</title><div id="root"></div><script>'+bundle.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  fs.writeFileSync(path.join(folder,'selected-info-ui-preview.html'),html);console.log(JSON.stringify({bytes:Buffer.byteLength(html),provenance:'copied real saved-record prefixes; isolated CODE QA keys'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
