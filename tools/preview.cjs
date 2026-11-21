'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../_site'),port=Number(process.env.PORT||4189),base='/city-of-ideas/';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.glb':'model/gltf-binary','.wav':'audio/wav','.mp3':'audio/mpeg','.woff2':'font/woff2'};
http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost');if(u.pathname==='/'){res.writeHead(302,{Location:base});return res.end();}if(!u.pathname.startsWith(base)){res.writeHead(404);return res.end('Not found');}const rel=decodeURIComponent(u.pathname.slice(base.length))||'index.html',file=path.resolve(root,rel.endsWith('/')?rel+'index.html':rel);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(err,body)=>{
 if(err){res.writeHead(404);return res.end('Not found');}
 const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes'};
 // Match production media seeking so QA can play the actual end of a recording.
 let start=0,end=body.length-1,status=200;
 if(req.headers.range){const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!m||!m[1]&&!m[2]){res.writeHead(416,{'Content-Range':'bytes */'+body.length});return res.end();}if(!m[1])start=Math.max(0,body.length-Number(m[2]));else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]));}if(start>end||start>=body.length){res.writeHead(416,{'Content-Range':'bytes */'+body.length});return res.end();}status=206;headers['Content-Range']='bytes '+start+'-'+end+'/'+body.length;}
 headers['Content-Length']=Math.max(0,end-start+1);res.writeHead(status,headers);res.end(req.method==='HEAD'?undefined:body.subarray(start,end+1));
 });}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port+base));
