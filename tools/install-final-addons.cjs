'use strict';const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),root=path.resolve(__dirname,'..'),src=path.join(root,'src');
const stage=path.join(root,'integrations/rendering/static-mesh-batches.js'),bytes=fs.readFileSync(stage);if(crypto.createHash('sha256').update(bytes).digest('hex')!=='941135ecaa45d53b0ff654db3f974bd50cd6dc09ee6a29c7ee809737c1f68050')throw Error('Reviewed renderer changed');fs.writeFileSync(path.join(src,'static-mesh-batches.js'),bytes);
let render=fs.readFileSync(path.join(root,'integrations/rendering/root-rendering-init.candidate.js'),'utf8');render=render.replace('watchReady();\nconst originalUpdate=',`watchReady();
const suspend=()=>batches.setRoots([]);
const oldSetHome=M.city.setHome;M.city.setHome=(...args)=>{suspend();return oldSetHome(...args);};
for(const name of ['updateNetwork','updateNeighborhood']){const previous=E[name];E[name]=async(...args)=>{suspend();try{return await previous(...args);}finally{rescan();}};}
const originalUpdate=`);fs.writeFileSync(path.join(src,'rendering-init.js'),render);
fs.copyFileSync(path.join(root,'integrations/root-contract-fixes/artist-line-of-sight.js'),path.join(src,'artist-line-of-sight.js'));
let file=path.join(src,'city-integration.js'),text=fs.readFileSync(file,'utf8'),candidate=fs.readFileSync(path.join(root,'integrations/root-contract-fixes/city-integration.js'),'utf8');
if(!text.includes("import {artistLineOfSight}"))text="import {artistLineOfSight} from './artist-line-of-sight.js';\n"+text;
const state=candidate.split(/\r?\n/).find(s=>s.includes('const artistState=id=>'));if(!state)throw Error('Missing reviewed artiststate');text=text.replace(/^.*const artistState=id=>.*$/m,state);
text=text.replace("const ok=current()?.artistId===a&&residents.greet(a)","const ok=M.city.region(M.player.x,M.player.z)?.artistId===a&&residents.greet(a)");fs.writeFileSync(file,text);
file=path.join(src,'shared-residents.js');text=fs.readFileSync(file,'utf8');text=text.replace('return !ray.intersectObjects(groups,true)', 'ray.layers.enable(31);return !ray.intersectObjects(groups,true)');fs.writeFileSync(file,text);
console.log('Reviewed renderer and original artist proximity parity installed; core ray/script wiring remains.');
