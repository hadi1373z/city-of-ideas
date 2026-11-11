import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {validateEscherSurfaceContacts} from './escher-surface-contacts.mjs';
import {buildEscherDepth} from '../src/escher-depth-scene.js';
import {depthFloorAt,canWalkDepth} from '../src/escher-depth-model.js';

const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export function validateEscherWallLampSupports(T,b){
 const thresholds=validateEscherSurfaceContacts(T,b);
 const batch=(owner,color)=>owner.interior.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===color);
 const matrices=o=>Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();});
 const boxes=o=>matrices(o).map((a,id)=>{const m=new T.Matrix4().fromArray(a),p=new T.Vector3(),s=new T.Vector3();m.decompose(p,new T.Quaternion(),s);return{id,p,s,box:new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(m)};});
 const snapshot=(owner,oldTimber)=>{owner.group.updateMatrixWorld(true);const wood=batch(owner,0x3c5149),surfaceStone=owner.surface.children.find(o=>o.isInstancedMesh&&o.material.color.getHex()===0xa4afa3),records=[];let instances=0;owner.group.traverse(o=>{if(o.isMesh){let rows=o.isInstancedMesh?matrices(o):null;if(rows)instances+=rows.length;if(o===wood)rows=rows.slice(0,oldTimber);if(o===surfaceStone)rows=rows.slice(0,thresholds.oldSurfaceStone);records.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),geometry:{type:o.geometry.type,index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))},color:o.material.color?.getHex(),instances:rows});}});return{hash:hash(records),meshes:records.length,instances};};
 const timber=batch(b,0x3c5149),wood=boxes(timber),walls=boxes(batch(b,0xa4afa3)).slice(0,28),glow=boxes(batch(b,0xffe2b9)),supports=wood.slice(81);
 assert.equal(timber.count,83);assert.equal(supports.length,2);
 // Independent 517b140 full snapshot: all 761 earlier instances remain,
 // including every panel stem, rail link, portal clip and original fixture.
 // The newer surface feet are independently checked before this comparison.
 const old=snapshot(b,81);assert.equal(old.hash,'4198c0a962692ac6c92d68e4361de83adfd9a5c866e451a2ab27551c12b7975c');assert.equal(old.meshes,32);assert.equal(old.instances,763+thresholds.added);
 assert(b.group.matrixWorld.equals(new T.Matrix4()),'Original upper identity owner');
 const lamps=wood.slice(0,81).filter(r=>Math.abs(r.s.x-.15)<1e-5&&Math.abs(r.s.y-.9)<1e-5&&Math.abs(r.s.z-.11)<1e-5);assert.equal(lamps.length,4);
 const ray=(owner,p,d,far)=>new T.Raycaster(p,d,0,far).intersectObject(owner,true);
 let measuredGaps=0,glowContacts=0,contacts=0,vertices=0,gapRays=0,endRays=0,clearance=0,printConflicts=0,clearPrintApproaches=0;
 for(const lamp of lamps){
  const north=lamp.p.z<115,wall=walls[north?2:3],gap=north?lamp.box.min.z-wall.box.max.z:wall.box.min.z-lamp.box.max.z;near(gap,.195);measuredGaps++;
  const face=glow.find(g=>Math.abs(g.p.x-lamp.p.x)<1e-5&&Math.abs(g.p.z-lamp.p.z-(north?.07:-.07))<1e-5);assert(face);const seat=face.box.clone().intersect(lamp.box).getSize(new T.Vector3());near(seat.x,.08);near(seat.y,.5);near(seat.z,.045);glowContacts++;
  const support=supports.find(s=>Math.abs(s.p.x-lamp.p.x)<1e-5);
  if(north){assert(support.box.min.z>124,'No spacer through the original north prints');continue;}
  assert.equal(support.id,lamp.p.x===141?81:82);near(support.p.y,lamp.p.y);near(support.p.z,124.7225);near(support.s.x,.10);near(support.s.y,.70);near(support.s.z,.215);
  near(lamp.box.max.x-support.box.max.x,.025);near(support.box.min.x-lamp.box.min.x,.025);near(support.box.min.y-lamp.box.min.y,.10);near(lamp.box.max.y-support.box.max.y,.10);
  for(const other of[lamp,wall]){const joint=support.box.clone().intersect(other.box),size=joint.getSize(new T.Vector3());near(size.x,.10);near(size.y,.70);near(size.z,.01);contacts++;
   for(const x of[joint.min.x,joint.max.x])for(const y of[joint.min.y,joint.max.y])for(const z of[joint.min.z,joint.max.z]){const p=new T.Vector3(x,y,z);assert(support.box.clone().expandByScalar(2e-5).containsPoint(p));assert(other.box.clone().expandByScalar(2e-5).containsPoint(p));vertices++;}
  }
  const gapHit=ray(timber,new T.Vector3(lamp.p.x-.1,lamp.p.y,124.72),new T.Vector3(1,0,0),.2)[0];assert.equal(gapHit?.instanceId,support.id);gapRays++;
  for(const sign of[-1,1]){const hit=ray(timber,new T.Vector3(support.p.x,sign<0?support.box.min.y-.02:support.box.max.y+.02,support.p.z),new T.Vector3(0,-sign,0),.06)[0];assert.equal(hit?.instanceId,support.id);endRays++;}
  assert(support.box.min.y-depthFloorAt(support.p.x,support.p.z)>4,'No new part below the original fixture or in body clearance');
 }
 assert(supports[0].box.clone().intersect(supports[1].box).isEmpty());
 for(const x of[135.6,138,141,144,147,150,153,156,159.4])for(const z of[105.6,108,111,114,117,120,123,124.4]){
  if(!canWalkDepth(x,z))continue;const floor=depthFloorAt(x,z);assert.equal(ray(b.interior,new T.Vector3(x,floor+.01,z),new T.Vector3(0,1,0),2.2).length,0);clearance++;
 }
 // A synthetic texture loader enables the ORIGINAL credited-print geometry;
 // this is a geometry fixture, not a claim that any remote scan was fetched.
 const ctx=new Proxy({measureText:t=>({width:t.length*12})},{get:(o,k)=>o[k]??(()=>{})}),credited=buildEscherDepth(T,{canvas:()=>({getContext:()=>ctx}),loadTexture:()=>new T.Texture()});
 try{
  validateEscherSurfaceContacts(T,credited);const captured=snapshot(credited,84);assert.equal(captured.hash,'afe8df7f72526642e75f7fd509376aab3beeb946376939a70e6700655a9f8046');assert.equal(captured.meshes,42);assert.equal(captured.instances,769+thresholds.added);
  const cw=batch(credited,0x3c5149),cb=boxes(cw),added=cb.slice(84),prints=credited.interior.children.filter(o=>o.userData.escherPrint);assert.equal(prints.length,3);assert.equal(added.length,2);assert.deepEqual(added.map(p=>p.id),[84,85]);
  for(const lamp of cb.slice(80,84)){
   const north=lamp.p.z<115,sign=north?-1:1,start=new T.Vector3(lamp.p.x,lamp.p.y,lamp.p.z+sign*.056),hit=ray(credited.interior,start,new T.Vector3(0,0,sign),.3)[0];assert(hit);
   if(north){assert.equal(hit.object.userData.escherPrint,lamp.p.x===141?'Relativity':'Drawing Hands');near(hit.point.z,105.275);printConflicts++;}
  }
  for(const support of added)for(const picture of prints){const bounds=new T.Box3().setFromObject(picture);assert(support.box.clone().expandByScalar(.001).intersect(bounds).isEmpty(),'No support touches a credited print');}
  for(const picture of prints){const sign=picture.rotation.y? -1:1;for(const dx of[-.8,0,.8]){const hit=ray(credited.interior,new T.Vector3(picture.position.x+dx,picture.position.y-1.2,picture.position.z+sign*1.5),new T.Vector3(0,0,-sign),2)[0];assert.equal(hit?.object,picture,'Original clear rays to each print stay clear');clearPrintApproaches++;}}
  const resources=new Map(),buffers=new Map(),watch=(r,map)=>{if(!r||map.has(r))return;map.set(r,0);r.addEventListener('dispose',()=>map.set(r,map.get(r)+1));};credited.group.traverse(o=>{watch(o.geometry,resources);if(o.isInstancedMesh)watch(o,buffers);for(const m of[o.material].flat().filter(Boolean)){watch(m,resources);for(const v of Object.values(m))if(v?.isTexture)watch(v,resources);}});
  assert.equal(resources.size,87);assert.equal(buffers.size,15);credited.dispose();for(const n of[...resources.values(),...buffers.values()])assert.equal(n,1,'Credited fixture releases owned resources and buffers once');
 }finally{if(credited.group.children.length)credited.dispose();}
 assert.equal(printConflicts,2);assert.equal(clearPrintApproaches,9);return{thresholds,added:2,oldTimber:81,measuredGaps,glowContacts,contacts,vertices,gapRays,endRays,clearance,printConflicts,clearPrintApproaches};
}
