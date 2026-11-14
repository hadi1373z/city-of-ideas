import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {ESCHER_DEPTH as D,depthFloorAt,canWalkDepth} from '../src/escher-depth-model.js';

const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
export function validateEscherCeilingRibs(T,b){
 b.group.updateMatrixWorld(true);assert(b.group.matrixWorld.equals(new T.Matrix4()),'Original upper identity owner');
 const batch=c=>b.interior.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===c),wood=batch(0x3c5149),sage=batch(0x71867c),roof=batch(0x596b63),floor=batch(0x8e968b),masonry=batch(0xa4afa3);
 const matrices=o=>Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();}),boxes=o=>matrices(o).map((a,id)=>{const m=new T.Matrix4().fromArray(a),p=new T.Vector3(),s=new T.Vector3();m.decompose(p,new T.Quaternion(),s);return{id,p,s,box:new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(m)};});
 const records=[];let instances=0;b.group.traverse(o=>{if(o.isMesh){const rows=o.isInstancedMesh?matrices(o):null;if(rows)instances+=rows.length;records.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),geometry:{type:o.geometry.type,index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))},color:o.material.color?.getHex(),instances:rows});}});
 const installed=b.interior.children.some(o=>o.userData.escherPrint);
 // Complete independently captured 2a0d9bb snapshots: no excluded IDs, no
 // production geometry changes. This audit adds only tests/documentation.
 assert.equal(createHash('sha256').update(JSON.stringify(records)).digest('hex'),installed?'b9a215955f9ef3497e1e746e676d009b8c9acb69c5a6686f3a6d9ad30153da15':'81bf64a97364462963eac032876864458c7a5571c12532e9a65534ae1639cb65');assert.equal(records.length,installed?42:32);assert.equal(instances,installed?775:769);
 const ribs=boxes(wood).filter(a=>Math.abs(a.s.x-.14)<1e-5&&Math.abs(a.s.y-.16)<1e-5&&a.s.z>10),blocks=boxes(sage).filter(a=>Math.abs(a.s.x-.4)<1e-5&&Math.abs(a.s.y-.32)<1e-5&&Math.abs(a.s.z-.5)<1e-5),roofs=boxes(roof),walls=boxes(masonry).slice(0,28);
 assert.deepEqual(ribs.map(r=>r.id),Array.from({length:28},(_,i)=>28+i));assert.deepEqual(blocks.map(r=>r.id),Array.from({length:56},(_,i)=>28+i));
 const ray=(owner,p,d,far)=>new T.Raycaster(p,d,0,far).intersectObject(owner,true),up=new T.Vector3(0,1,0),down=new T.Vector3(0,-1,0);
 let roofContacts=0,capVertices=0,capRays=0,joints=0,jointVertices=0,wallFacing=0,doorwayEnds=0,bodySamples=0,minHeadroom=Infinity;
 const roomCounts=D.rooms.map(r=>({room:r.id,ribs:0,blocks:0}));
 for(const part of[...ribs,...blocks]){
  const isRib=part.s.x<.2,owner=isRib?wood:sage,room=D.rooms.find(r=>part.p.x>r.minX&&part.p.x<r.maxX&&part.p.z>r.minZ&&part.p.z<r.maxZ);assert(room);const ri=D.rooms.indexOf(room),r=roofs[ri];roomCounts[ri][isRib?'ribs':'blocks']++;
  near(r.box.min.y,room.id==='loop'?-35:-29);near(part.box.max.y,r.box.min.y);
  for(const x of[part.box.min.x,part.box.max.x])for(const z of[part.box.min.z,part.box.max.z]){const p=new T.Vector3(x,r.box.min.y,z);assert(part.box.clone().expandByScalar(2e-5).containsPoint(p));assert(r.box.clone().expandByScalar(2e-5).containsPoint(p));capVertices++;}roofContacts++;
  for(const u of[.1,.5,.9])for(const v of[.1,.5,.9]){
   const x=part.box.min.x+(part.box.max.x-part.box.min.x)*u,z=part.box.min.z+(part.box.max.z-part.box.min.z)*v,a=ray(owner,new T.Vector3(x,r.box.min.y+.02,z),down,.06)[0],c=ray(roof,new T.Vector3(x,part.box.max.y-.02,z),up,.06)[0];assert.equal(a?.instanceId,part.id);assert.equal(c?.instanceId,r.id);near(a.point.y,c.point.y);capRays+=2;
   if(!canWalkDepth(x,z))continue;const y=depthFloorAt(x,z),feet=ray(floor,new T.Vector3(x,y+.5,z),down,.6)[0],above=ray(b.interior,new T.Vector3(x,y+1.8,z),up,20)[0];assert(feet&&above);near(feet.point.y,y);assert(above.point.y-y>6);minHeadroom=Math.min(minHeadroom,above.point.y-y);
   // Original bronze/ink floor markers stand below .12m. Check the actual
   // standing body above them without treating those retained markings as walls.
   assert.equal(ray(b.interior,new T.Vector3(x,y+.12,z),up,2.08).length,0);bodySamples++;
  }
  if(!isRib){
   const rib=ribs.find(a=>Math.abs(a.p.x-part.p.x)<2e-5&&Math.abs(a.box.max.y-part.box.max.y)<2e-5&&a.box.intersectsBox(part.box));assert(rib);const joint=part.box.clone().intersect(rib.box),s=joint.getSize(new T.Vector3());near(s.x,.14);near(s.y,.16);near(s.z,.5);joints++;
   for(const x of[joint.min.x,joint.max.x])for(const y of[joint.min.y,joint.max.y])for(const z of[joint.min.z,joint.max.z]){const p=new T.Vector3(x,y,z);assert(part.box.clone().expandByScalar(2e-5).containsPoint(p));assert(rib.box.clone().expandByScalar(2e-5).containsPoint(p));jointVertices++;}
   const edge=part.p.z<(room.minZ+room.maxZ)/2?room.minZ:room.maxZ,adjacent=walls.filter(w=>w.box.min.x<=part.box.min.x+2e-5&&w.box.max.x>=part.box.max.x-2e-5&&Math.abs(w.p.z-edge)<2e-5&&w.box.min.y<=part.box.min.y&&w.box.max.y>=part.box.max.y-2e-5);
   if(adjacent.length){assert.equal(adjacent.length,1);const w=adjacent[0],lower=edge<part.p.z;near(lower?part.box.min.z-w.box.max.z:w.box.min.z-part.box.max.z,.12);near(lower?rib.box.min.z-w.box.max.z:w.box.min.z-rib.box.max.z,.07);wallFacing++;}
   else{near(part.p.x,214);near(edge,98);assert(['perspective','tessellation'].includes(room.id));assert(part.box.min.x>210&&part.box.max.x<216,'Retain the actual six-metre shared doorway');doorwayEnds++;}
  }
 }
 assert.deepEqual(roomCounts.map(r=>r.ribs),[4,4,4,4,4,8]);assert.deepEqual(roomCounts.map(r=>r.blocks),[8,8,8,8,8,16]);assert.equal(roofContacts,84);assert.equal(joints,56);assert.equal(wallFacing,54);assert.equal(doorwayEnds,2);assert(bodySamples>250);
 return{added:0,ribs:28,blocks:56,roofContacts,capVertices,capRays,joints,jointVertices,wallFacing,doorwayEnds,bodySamples,minHeadroom,roomCounts};
}
