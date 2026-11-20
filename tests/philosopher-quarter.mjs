// Walk the shared roads and entrances in the actual geometry; no private state.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {PHILOSOPHERS,quarterPaths} from '../src/philosopher-data.js';
import {createPhilosopherQuarter} from '../src/philosopher-quarter.js';
import {ACADEMY,philosopherWorld,philosopherEntry} from '../src/academy-layout.js';
const T={};vm.runInNewContext(await readFile(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:T,module:{exports:T},console:{...console,warn(){}}});
const context=new Proxy({},{get:()=>()=>{}}),canvas=()=>({getContext:()=>context});
let language='en';const q=createPhilosopherQuarter(T,{language:()=>language,canvas});
assert.equal(q.homes.length,6);assert.equal(new Set(q.homes.map(h=>h.id)).size,6);
const walk=(a,b)=>{const n=Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/.06);for(let i=0;i<=n;i++){const x=a.x+(b.x-a.x)*i/n,z=a.z+(b.z-a.z)*i/n;assert(q.canStand(x,z),`Blocked walking route at ${x},${z}`);assert(Math.hypot(x,z)<565,'The relocated public court remains on the circular island');}};
for(const path of quarterPaths)for(let i=1;i<path.length;i++)walk({x:path[i-1][0],z:path[i-1][1]},{x:path[i][0],z:path[i][1]});
for(const home of q.homes){
 for(const field of ['name','home','theme','intro','object','idea','reading','prompt'])assert(home[field].length===2&&home[field].every(x=>x.length>0));
 assert(new URL(home.source).protocol==='https:');
 const entry=q.entryFor('philosopher:'+home.id);assert.deepEqual(entry,philosopherEntry(home));walk(philosopherWorld(home,0,17),entry);walk(entry,home.study);
 for(const [x,z,label] of [[14,0,'side wall'],[0,-14*Math.sqrt(3)/2,'back wall'],[4.5,-8.5,'desk']]){const p=philosopherWorld(home,x,z);assert(!q.canStand(p.x,p.z),label+' must block walking');}
 assert(Math.abs(Math.hypot(home.x-ACADEMY.x,home.z)-ACADEMY.radius)<1e-8);
 assert(Math.hypot(entry.x-ACADEMY.x,entry.z)<Math.hypot(home.x-ACADEMY.x,home.z),'Every door faces the shared court');
 assert.equal(q.region(home.study.x,home.study.z).philosopherId,home.id);
 assert(q.targets.some(t=>t.userData.philosopherId===home.id&&t.userData.philosopherSection==='reading'));
 for(const other of q.homes)if(home!==other)assert(home.bounds.maxX<other.bounds.minX||other.bounds.maxX<home.bounds.minX||home.bounds.maxZ<other.bounds.minZ||other.bounds.maxZ<home.bounds.minZ);
}
assert.equal(q.entryFor('unrecognised'),null);assert.equal(q.region(0,94),null);assert.equal(q.canStand(NaN,0),false);
language='fa';q.refreshLanguage();assert(q.region(q.homes[0].study.x,q.homes[0].study.z).title.includes('افلاطون'));q.dispose();
console.log('PASS: six bilingual philosopher homes, source links, connected paths, six enter/exit routes and solid walls/furniture.');
