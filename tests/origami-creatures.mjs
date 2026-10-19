import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildPaperCrane,buildPaperButterfly,origamiFlightPose} from '../src/origami-creatures.js';
import {CREATURE_FLOCK} from '../src/origami-park.js';
assert.equal(CREATURE_FLOCK.filter(f=>f.type==='crane').length,2);assert.equal(CREATURE_FLOCK.filter(f=>f.type==='butterfly').length,3);
for(const [type,build]of [['crane',buildPaperCrane],['butterfly',buildPaperButterfly]]){
 const model=build(T);assert(model.group.userData.paperOnly);assert.equal(model.group.userData.addedParts,0);
 model.animate(0,{reducedMotion:true});model.group.updateMatrixWorld(true);const triangles=[],resources=new Set();
 model.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)resources.add(o.material);if(!o.isMesh)return;assert(o.userData.paperPanel,'Only folded paper surfaces make up the creature');const a=o.geometry.attributes.position,index=o.geometry.index;assert(index.count>0);for(let i=0;i<index.count;i+=3)triangles.push([0,1,2].map(j=>new T.Vector3().fromBufferAttribute(a,index.getX(i+j)).applyMatrix4(o.matrixWorld)));});
 // Shared complete edges, including both wing hinges, keep all paper panels connected.
 const key=p=>p.toArray().map(v=>Math.round(v*1e5)).join(','),edge=(a,b)=>[key(a),key(b)].sort().join('|'),owners=new Map(),adj=triangles.map(()=>new Set());
 triangles.forEach((tri,i)=>{for(let j=0;j<3;j++){const id=edge(tri[j],tri[(j+1)%3]);for(const other of owners.get(id)||[]){adj[i].add(other);adj[other].add(i);}owners.set(id,[...(owners.get(id)||[]),i]);}});
 const seen=new Set(),queue=[0];while(queue.length){const i=queue.shift();if(seen.has(i))continue;seen.add(i);queue.push(...adj[i]);}assert.equal(seen.size,triangles.length,'The complete folded surface is connected along paper edges');
 const hinge=type==='crane'?{x:.12,y:.1,z:[-.28,.28]}:{x:.035,y:0,z:[-.35,.3]};
 for(const time of[.1,1,4,8]){model.animate(time);model.group.updateMatrixWorld(true);for(const wing of model.wings)for(const z of hinge.z){const rootPoint=model.group.localToWorld(new T.Vector3(wing.sign*hinge.x,hinge.y,z)),flapPoint=wing.group.localToWorld(new T.Vector3(0,0,z));assert(rootPoint.distanceTo(flapPoint)<1e-7,'Wing folds never detach from their paper hinge');}}
 model.animate(1,{reducedMotion:true});const still=model.wings.map(w=>w.group.rotation.z);model.animate(4,{reducedMotion:true});assert.deepEqual(model.wings.map(w=>w.group.rotation.z),still);
 let disposed=0;resources.forEach(r=>r.addEventListener('dispose',()=>disposed++));model.dispose();assert.equal(disposed,resources.size);assert.equal(model.group.children.length,0);
 const start={x:0,y:2,z:0};for(let t=0;t<30;t+=.1){const p=origamiFlightPose(type,t,start);assert(Object.values(p).every(Number.isFinite));assert(Math.abs(p.x)<=4&&Math.abs(p.z)<=2.5&&Math.abs(p.y-2)<=.21);}
}
const crane=buildPaperCrane(T),butterfly=buildPaperButterfly(T);crane.animate(4);const glide=crane.wings[0].group.rotation.z;crane.animate(6);assert.equal(crane.wings[0].group.rotation.z,glide,'Crane holds extended wings between occasional folds');butterfly.animate(.1);const flutter=butterfly.wings[0].group.rotation.z;butterfly.animate(.3);assert.notEqual(butterfly.wings[0].group.rotation.z,flutter,'Butterfly flutters at its own rhythm');crane.dispose();butterfly.dispose();
console.log('PASS: distinct connected crane/butterfly paper surfaces, attached fold hinges, slow crane glides, butterfly flutter, bounded loops, reduced motion and owned disposal.');
