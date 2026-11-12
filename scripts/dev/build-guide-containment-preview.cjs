const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
async function main(){
  const root=path.resolve(__dirname,'../..'),source=fs.readFileSync(path.join(__dirname,'unequal-crossing-ui-preview.jsx'),'utf8');
  const entry=source.replace("import {createRoot}","import usePointerQA from './pointer-input-recorder.jsx';\nimport {createRoot}").replace('function Preview(){','function Preview(){\n  usePointerQA();').replaceAll('orchard-code-family-ui-20261005','orchard-code-guide-ui-20261005').replaceAll('orchard-code-overnight-unequal-ui-20261004','orchard-code-guide-default-20261005').replace('.ov-root{flex:1;min-height:0!important}', '.qa-banner,.qa-record{position:fixed;left:-10000px;top:0;width:1px;height:1px;overflow:hidden}.ov-root{flex:1}').replace('</details></>;','<pre className="qa-input-events"/></details></>;');
  const input=path.join(__dirname,'guide-containment-preview.jsx');fs.writeFileSync(input,entry);
  const bundle=await esbuild.build({entryPoints:[input],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',logLevel:'error'});
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Guide containment private QA: generated disposable zero-command mission</title><div id="root"></div><script>'+bundle.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  fs.writeFileSync(path.join(root,'docs/expeditions/v2/evidence/code-overnight-20261004/guide-containment-preview.html'),html);console.log(JSON.stringify({bytes:Buffer.byteLength(html),provenance:'full viewport production route, accessible non-layout QA metadata, zero-command private mission'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
