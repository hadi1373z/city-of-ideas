import assert from 'node:assert/strict';
import {fitBabelMouths} from '../src/babel-mouth-clearance.js';
import {mountBabelSpokes} from '../src/babel-spoke-mounts.js';
import {fitBabelPerimeter} from '../src/babel-vault-perimeter.js';
import {fitBabelEntryReveals} from '../src/babel-entry-reveals.js';
import {BABEL,entryHeight} from '../src/babel-library-model.js';
import {babelGuardSnapshot,babelSlabFixture} from './babel-entry-guards.mjs';
const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,a+' != '+b);
export async function validateBabelEntryCheeks(T,built){
 const root=built.group,priorParent=root.parent,scene=new T.Scene(),oldLamps=built.lamps.visible;scene.add(root);root.updateMatrixWorld(true);
 const raw=babelGuardSnapshot(T,root);assert.deepEqual(raw,{hash:'8f17b68a21bb9777ee6ae73ccd86e056d82b89123256dd3f587f533aeb734eae',meshes:65,instances:41048});
 const adapters=[fitBabelMouths(T,built),mountBabelSpokes(T,built),fitBabelPerimeter(T,built),fitBabelEntryReveals(T,built)],fixture=await babelSlabFixture(T);built.lamps.visible=true;root.updateMatrixWorld(true);
 const active=[];root.traverse(o=>{if(!o.isMesh)return;for(let p=o;p;p=p.parent)if(!p.visible)return;active.push(o);});const view={updateMatrixWorld:()=>root.updateMatrixWorld(true),traverse:fn=>active.forEach(fn)},before=babelGuardSnapshot(T,view);
 // Complete independently measured cbd92c3 fixture, without any exclusions.
 assert.deepEqual(before,{hash:'492dfb1475839deef5c396382998f6d66dd8325cb12de903a196326cde3f49e4',meshes:68,instances:41076});
 const batch=color=>root.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===color),matrix=(o,id)=>{const m=new T.Matrix4();o.getMatrixAt(id,m);return m;},record=(o,id)=>{const m=matrix(o,id);return{id,m,box:new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5)).applyMatrix4(m)};},walls=batch(0x3e3027),caps=batch(0x765238),f=BABEL.flight,ramp=root.getObjectByName('Babel · 40 stacked treads and risers'),overlook=root.getObjectByName('Library overlook · continuous first-terrace floor'),floor=root.children.filter(o=>o.isMesh&&!o.isInstancedMesh&&o.geometry.type==='BufferGeometry'&&o.material.color?.getHex()===0x9c8965),up=new T.Vector3(0,1,0),down=up.clone().negate(),ray=(objects,p,d,far)=>new T.Raycaster(p,d,0,far).intersectObjects(objects,true);
 const inside=(m,p)=>{const q=p.clone().applyMatrix4(m.clone().invert());assert(Math.max(...q.toArray().map(Math.abs))<.5001);},corners=(p,h,fn)=>{for(const dx of[-h,h])for(const dy of[-h,h])for(const dz of[-h,h])fn(p.clone().add(new T.Vector3(dx,dy,dz)));},graph=new Map(),edge=(a,b)=>{if(!graph.has(a))graph.set(a,new Set());if(!graph.has(b))graph.set(b,new Set());graph.get(a).add(b);graph.get(b).add(a);},roots=[];
 let capVertices=0,adjacentVertices=0,slabVertices=0,slabRays=0,floorRays=0,floorMisses=0,edgeSamples=0,bodySamples=0;const floorDeltas=[],wallSeams=[],capSeams=[],treadBounds=new T.Box3().setFromObject(ramp);
 try{
  for(let side=0;side<2;side++)for(let i=0;i<40;i++){
   const w=record(walls,1177+side*40+i),c=record(caps,2957+side*40+i),intersection=w.box.clone().intersect(c.box),size=intersection.getSize(new T.Vector3()),p=w.box.getCenter(new T.Vector3());near(size.x,.7);near(size.y,.01);near(size.z,.292);corners(intersection.getCenter(new T.Vector3()),.002,q=>{inside(w.m,q);inside(c.m,q);capVertices++;});edge('w'+w.id,'c'+c.id);
   if(i<39){const next=record(walls,w.id+1),joint=w.box.clone().intersect(next.box),extent=joint.getSize(new T.Vector3());near(extent.z,.012);assert(extent.y>.1799);corners(joint.getCenter(new T.Vector3()),.002,q=>{inside(w.m,q);inside(next.m,q);adjacentVertices++;});edge('w'+w.id,'w'+next.id);}
   if(i===0){assert(w.box.min.y<0&&w.box.max.y>.185);corners(new T.Vector3(p.x,.085,p.z),.005,q=>{inside(w.m,q);const a=ray([fixture.slab],q.clone().setY(.4),down,.5)[0],b=ray([fixture.slab],q.clone().setY(-.05),up,.5)[0];assert(a&&b);near(a.point.y,.35);near(b.point.y,0);assert(q.y>b.point.y&&q.y<a.point.y);slabVertices++;slabRays+=2;});roots.push('w'+w.id);}
   near(w.box.min.y,-8.18);for(const dx of[-.2,.2])for(const dz of[-.1,.1]){const h=ray(floor,new T.Vector3(p.x+dx,-7.95,p.z+dz),down,.1)[0];if(side){assert(h);near(h.point.y,-8);assert(h.point.y>=w.box.min.y&&h.point.y<=w.box.max.y+2e-5);floorDeltas.push(h.point.y-w.box.min.y);floorRays++;}else{assert(!h,'No invented floor below the left cheek');floorMisses++;}}
   const wallGap=side?w.box.min.x-treadBounds.max.x:treadBounds.min.x-w.box.max.x,capGap=side?c.box.min.x-treadBounds.max.x:treadBounds.min.x-c.box.max.x;near(wallGap,.07);near(capGap,.005);wallSeams.push(wallGap);capSeams.push(capGap);assert(side?c.box.min.x>f.x+f.width/2-.23:c.box.max.x<f.x-f.width/2+.23);edgeSamples++;
  }
  const visited=new Set(roots),queue=[...roots];while(queue.length){const a=queue.shift();for(const b of graph.get(a)||[])if(!visited.has(b)){visited.add(b);queue.push(b);}}assert.equal(graph.size,160);assert.equal(visited.size,160,'Both original wall/cap components reach an actual slab contact');assert.equal([...graph.values()].reduce((n,s)=>n+s.size,0)/2,158);
  // At the lower-left end the real overlook is .07m from the wall and .005m
  // from the cap. Retain this open seam; do not invent a direct floor seat.
  near(new T.Box3().setFromObject(overlook).min.x-treadBounds.min.x,0);
  for(let i=0;i<40;i++)for(const u of[.1,.5,.9])for(const off of[-f.width/2+.4,0,f.width/2-.4]){const z=f.z0-(i+u)*.28,y=entryHeight(f.x,z);assert.equal(new T.Raycaster(new T.Vector3(f.x+off,y+.015,z),up,0,2.185).intersectObjects([...active,fixture.slab,fixture.finish],false).length,0);bodySamples++;}
  assert.equal(capVertices,640);assert.equal(adjacentVertices,624);assert.equal(slabVertices,16);assert.equal(slabRays,32);assert.equal(floorRays,160);assert.equal(floorMisses,160);assert.equal(edgeSamples,80);assert.equal(bodySamples,360);assert.deepEqual(babelGuardSnapshot(T,view),before,'Complete installed fixture remains exact');
  return{walls:80,caps:80,capVertices,adjacentVertices,slabVertices,slabRays,floorRays,floorMisses,edgeSamples,bodySamples,rootedComponents:2,rootedNodes:visited.size,edges:158,wallGap:[Math.min(...wallSeams),Math.max(...wallSeams)],capGap:[Math.min(...capSeams),Math.max(...capSeams)],floorAboveWallBase:[Math.min(...floorDeltas),Math.max(...floorDeltas)],installed:before};
 }finally{fixture.dispose();for(const a of adapters.reverse())a.dispose();built.lamps.visible=oldLamps;root.removeFromParent();priorParent?.add(root);assert.deepEqual(babelGuardSnapshot(T,root),raw,'No original source profile/matrix/ID changes');}
}
