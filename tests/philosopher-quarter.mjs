// Walk the shared roads and entrances in the actual geometry; no private state.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {PHILOSOPHERS,quarterPaths} from '../src/philosopher-data.js';
import {createPhilosopherQuarter} from '../src/philosopher-quarter.js';
const T={};vm.runInNewContext(await readFile(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:T,module:{exports:T},console:{...console,warn(){}}});
const context=new Proxy({},{get:()=>()=>{}}),canvas=()=>({getContext:()=>context});
let language='en';const q=createPhilosopherQuarter(T,{language:()=>language,canvas});
assert.equal(q.homes.length,6);assert.equal(new Set(q.homes.map(h=>h.id)).size,6);
const walk=(a,b)=>{const n=Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/.06);for(let i=0;i<=n;i++){const x=a.x+(b.x-a.x)*i/n,z=a.z+(b.z-a.z)*i/n;assert(q.canStand(x,z),`Blocked walking route at ${x},${z}`);assert(x>=-270&&x<=260&&z>=-500&&z<=215);}};
for(const path of quarterPaths)for(let i=1;i<path.length;i++)walk({x:path[i-1][0],z:path[i-1][1]},{x:path[i][0],z:path[i][1]});
for(const home of q.homes){
 for(const field of ['name','home','theme','intro','object','idea','reading','prompt'])assert(home[field].length===2&&home[field].every(x=>x.length>0));
 assert(new URL(home.source).protocol==='https:');
 const entry=q.entryFor('philosopher:'+home.id);assert(entry);walk({x:home.x,z:home.z+17},entry);walk(entry,home.study);
 assert(!q.canStand(home.x+10,home.z),'Side wall must block walking.');assert(!q.canStand(home.x,home.z-11),'Back wall must block walking.');assert(!q.canStand(home.x+4,home.z-6),'Desk must block walking.');
 assert.equal(q.region(home.study.x,home.study.z).philosopherId,home.id);
 assert(q.targets.some(t=>t.userData.philosopherId===home.id&&t.userData.philosopherSection==='reading'));
 for(const other of q.homes)if(home!==other)assert(home.bounds.maxX<other.bounds.minX||other.bounds.maxX<home.bounds.minX||home.bounds.maxZ<other.bounds.minZ||other.bounds.maxZ<home.bounds.minZ);
}
assert.equal(q.entryFor('unrecognised'),null);assert.equal(q.region(0,94),null);assert.equal(q.canStand(NaN,0),false);
language='fa';q.refreshLanguage();assert(q.region(-242,-102).title.includes('افلاطون'));q.dispose();
console.log('PASS: six bilingual philosopher homes, source links, connected paths, six enter/exit routes and solid walls/furniture.');
