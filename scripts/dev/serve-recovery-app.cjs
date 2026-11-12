const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
http.createServer((req,res)=>{
  const relative=decodeURIComponent((req.url||'/').split('?')[0]),file=path.resolve(root,'.'+relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html':file.endsWith('.js')?'application/javascript':'application/octet-stream'});res.end(data);});
}).listen(8755,'127.0.0.1',()=>console.log('Isolated full-App QA at localhost:8755'));
