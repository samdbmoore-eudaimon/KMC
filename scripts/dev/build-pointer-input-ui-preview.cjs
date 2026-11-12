const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
async function main(){
  const root=path.resolve(__dirname,'../..'),source=fs.readFileSync(path.join(__dirname,'unequal-crossing-ui-preview.jsx'),'utf8');
  const entry=source.replace("import {createRoot}","import usePointerQA from './pointer-input-recorder.jsx';\nimport {createRoot}").replace('function Preview(){','function Preview(){\n  usePointerQA();').replaceAll('orchard-code-family-ui-20261005','orchard-code-pointer-ui-20261005').replaceAll('orchard-code-overnight-unequal-ui-20261004','orchard-code-pointer-default-20261005').replace('<div className="qa-banner">','<div className="qa-banner" style={params.has(\'compactBanner\')?{height:22,flex:\'0 0 22px\',overflow:\'hidden\',fontSize:11,padding:\'3px 6px\'}:undefined}>').replace('</details></>;','<pre className="qa-input-events"/></details></>;');
  if(!entry.includes('qa-input-events')||!entry.includes('usePointerQA();'))throw Error('QA recorder wiring missing');
  const input=path.join(__dirname,'pointer-input-ui-preview.jsx');fs.writeFileSync(input,entry);
  const bundle=await esbuild.build({entryPoints:[input],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',logLevel:'error'});
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pointer input private QA</title><div id="root"></div><script>'+bundle.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  fs.writeFileSync(path.join(root,'docs/expeditions/v2/evidence/code-overnight-20261004/pointer-input-ui-preview.html'),html);console.log(JSON.stringify({bytes:Buffer.byteLength(html),provenance:'genuine zero-command private QA, passive DOM input recording only'}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
