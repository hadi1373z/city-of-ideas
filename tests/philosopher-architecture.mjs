import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {createPhilosopherQuarter} from '../src/philosopher-quarter.js';

const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),q=createPhilosopherQuarter(T,{canvas});q.group.updateMatrixWorld(true);
const roofs=[],heights=[];let roofTriangles=0;
for(const home of q.homes){
 const meshes=home.group.children.filter(o=>o.userData.philosopherArchitecture);assert.equal(meshes.length,1,'One additional architecture draw per house');const mesh=meshes[0];roofs.push(mesh);
 const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal,c=mesh.geometry.attributes.color;assert(p.array.every(Number.isFinite)&&n.array.every(Number.isFinite));assert.equal(c.count,p.count);for(let i=0;i<n.count;i++)assert(new T.Vector3().fromBufferAttribute(n,i).length()>.99,'No collapsed roof face');roofTriangles+=p.count/3;
 mesh.geometry.computeBoundingBox();const box=mesh.geometry.boundingBox;heights.push(box.max.y.toFixed(2));assert(box.max.y>4.7&&box.max.y<9.5);assert(box.min.x>=-11.5&&box.max.x<=11.5&&box.min.z>=-12.3&&box.max.z<=14.2);
 let covered=0,open=0;for(let x=-9;x<=9;x+=3)for(let z=-9;z<=9;z+=3){const ray=new T.Raycaster(new T.Vector3(home.x+x,20,home.z+z),new T.Vector3(0,-1,0),0,16);if(ray.intersectObject(mesh).length)covered++;else open++;}assert(covered>15,'A real roof must cover the house wings');assert(open>0,'Every house retains daylight or an open observing well');
 // The original central arrival/study route and full-width entrance remain usable.
 for(let z=17;z>=-4;z-=.25)for(const x of[-.9,0,.9])assert(q.canStand(home.x+x,home.z+z),'Porch support blocks the original entrance');
 for(const x of[-.9,0,.9]){const ray=new T.Raycaster(new T.Vector3(home.x+x,1.93,home.z+17),new T.Vector3(0,0,-1),0,21);assert.equal(ray.intersectObject(home.group,true).length,0,'No new façade crosses eye-level doorway space');}
 const book=q.targets.find(t=>t.userData.philosopherId===home.id&&t.userData.philosopherSection==='reading');assert(book);assert.deepEqual(book.position.toArray(),[3.4,1.36,-5.9],'Keep the real reading book at its source transform');assert.deepEqual(home.study,{x:home.x,y:.13,z:home.z-4,yaw:0});
}
assert.equal(new Set(heights).size,6,'The six roof silhouettes have different heights');assert.equal(new Set(roofs.map(o=>o.material)).size,1,'All six architectural batches share one vertex-colour material');assert(roofTriangles<22000,'The new roofs remain a bounded static mesh');let lights=0;q.group.traverse(o=>{if(o.isLight)lights++;});assert.equal(lights,0);
const owned=new Set();q.group.traverse(o=>{if(o.geometry)owned.add(o.geometry);if(o.material)owned.add(o.material);});const disposals=new Map();for(const resource of owned){disposals.set(resource,0);resource.addEventListener('dispose',()=>disposals.set(resource,disposals.get(resource)+1));}q.dispose();q.dispose();for(const count of disposals.values())assert.equal(count,1,'Dispose shared geometry/material exactly once');
console.log('PASS philosopher architecture: six distinct supported house roofs and open wells, clear original doors, unchanged reading books, six added draws, shared material and safe disposal; '+roofTriangles+' triangles.');
