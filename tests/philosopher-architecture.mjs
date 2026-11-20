import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {createPhilosopherQuarter} from '../src/philosopher-quarter.js';
import {ACADEMY,ACADEMY_PATHS,philosopherWorld} from '../src/academy-layout.js';
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),q=createPhilosopherQuarter(T,{canvas});q.group.updateMatrixWorld(true);
const roofs=[];let triangles=0,bodyChecks=0;
function clearPath(a,b,root=q.group){const len=Math.hypot(b.x-a.x,b.z-a.z),dir=new T.Vector3(b.x-a.x,0,b.z-a.z).normalize();for(let t=0;t<len;t+=.2)for(const offset of[-.65,0,.65]){const x=a.x+dir.x*t+dir.z*offset,z=a.z+dir.z*t-dir.x*offset;assert(q.canStand(x,z),'Route collider at '+[x,z]);for(const y of[.45,1.15,1.93]){const hits=new T.Raycaster(new T.Vector3(x,y,z),dir,0,Math.min(.21,len-t)).intersectObject(root,true);assert.equal(hits.length,0,'Real body obstruction at '+[x,y,z]);bodyChecks++;}}}
for(const path of ACADEMY_PATHS)for(let i=1;i<path.length;i++)clearPath({x:path[i-1][0],z:path[i-1][1]},{x:path[i][0],z:path[i][1]});
for(const home of q.homes){
 const meshes=home.group.children.filter(o=>o.userData.philosopherArchitecture);assert.equal(meshes.length,1,'One structural draw per house');const mesh=meshes[0];roofs.push(mesh);
 const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal,c=mesh.geometry.attributes.color;assert(p.array.every(Number.isFinite)&&n.array.every(Number.isFinite));assert.equal(c.count,p.count);for(let i=0;i<n.count;i++)assert(new T.Vector3().fromBufferAttribute(n,i).length()>.99,'No collapsed face');triangles+=p.count/3;
 mesh.geometry.computeBoundingBox();const box=mesh.geometry.boundingBox;assert(Math.abs(box.max.y-5.35)<.1);assert(box.min.x>=-14.6&&box.max.x<=14.6&&box.min.z>=-12.7&&box.max.z<=15.3);
 const belowRoof=(x,z)=>{const p=philosopherWorld(home,x,z);return new T.Raycaster(new T.Vector3(p.x,2.8,p.z),new T.Vector3(0,1,0),0,5).intersectObject(mesh);};
 for(const [x,z] of [[0,-10],[10,0],[-10,0],[0,10]])assert(belowRoof(x,z).length,'Four sides retain real shelter');assert.equal(belowRoof(0,0).length,0,'Real open-sky peristyle court');
 clearPath(philosopherWorld(home,0,17),home.study,home.group);
 for(let z=11.5;z>=-4;z-=.5){const p=philosopherWorld(home,0,z),hit=new T.Raycaster(new T.Vector3(p.x,.7,p.z),new T.Vector3(0,-1,0),0,1).intersectObject(mesh);assert(hit.length&&Math.abs(hit[0].point.y-.13)<.02,'Continuous level house floor');}
 const book=q.targets.find(t=>t.userData.philosopherId===home.id&&t.userData.philosopherSection==='reading');assert(book);assert.deepEqual(book.position.toArray(),[3.9,1.36,-8.4]);assert.deepEqual(home.study,{...philosopherWorld(home,0,-4),y:.13,yaw:home.turn});
 assert(Math.abs(Math.hypot(home.x-ACADEMY.x,home.z)-40.6)<1e-8);assert.equal(home.group.userData.architecture.style,'hexagonal-courtyard');
}
assert.equal(q.homes.filter(h=>h.id==='plato').length,1);assert.equal(new Set(roofs.map(o=>o.material)).size,1);assert(triangles<44000,'Bounded static house geometry: '+triangles);let lights=0;q.group.traverse(o=>{if(o.isLight)lights++;});assert.equal(lights,0);
const owned=new Set();q.group.traverse(o=>{if(o.geometry)owned.add(o.geometry);if(o.material)owned.add(o.material);});const disposals=new Map();for(const resource of owned){disposals.set(resource,0);resource.addEventListener('dispose',()=>disposals.set(resource,disposals.get(resource)+1));}q.dispose();q.dispose();for(const count of disposals.values())assert.equal(count,1);
console.log('PASS Academy: six inward courtyard houses, supported roofs/open courts, level floors, '+bodyChecks+' full-body route rays, original learning IDs and safe shared-resource disposal; '+triangles+' triangles.');
