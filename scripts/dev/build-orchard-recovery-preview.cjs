const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
const root=path.resolve(__dirname,'../..'),dir=path.join(root,'docs/expeditions/v2/evidence/player-recovery');
async function main(){
  fs.mkdirSync(dir,{recursive:true});
  const out=await esbuild.build({entryPoints:[path.join(__dirname,'orchard-recovery-preview.jsx')],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',minify:false,logLevel:'error'});
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Four Locks: player experience recovery QA</title><style>html,body{margin:0;background:#1d362a;font-family:system-ui;color:#f7ecd0}.qa-banner{padding:7px 12px;background:#452e24;font-size:12px}.qa-banner button{margin-left:10px}#root{height:100dvh;display:flex;flex-direction:column}.qa-banner{flex:none}.ov-root{height:auto!important;flex:1;min-height:0!important}.qa-record{flex:none;margin:0;padding:5px 12px}.qa-record[open]{max-height:40vh;overflow:auto}.qa-record pre{white-space:pre-wrap;overflow-wrap:anywhere}</style><div id="root"></div><script>'+out.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></html>';
  fs.writeFileSync(path.join(dir,'controller-route-preview.html'),html);
  console.log(JSON.stringify({path:'docs/expeditions/v2/evidence/player-recovery/controller-route-preview.html',bytes:Buffer.byteLength(html),sharedBuild:false}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
