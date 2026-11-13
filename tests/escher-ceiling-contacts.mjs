import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {depthFloorAt,canWalkDepth} from '../src/escher-depth-model.js';
import {validateEscherPanelSupports} from './escher-panel-supports.mjs';

const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
export function validateEscherCeilingContacts(T,b){
 b.group.updateMatrixWorld(true);assert(b.group.matrixWorld.equals(new T.Matrix4()),'Original upper +Y owner');
 const panels=validateEscherPanelSupports(T,b),brass=b.interior.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===0xaa9868);
 const matrices=o=>Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();});
 const timber=b.interior.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===0x3c5149);
 const surfaceStone=b.surface.children.find(o=>o.isInstancedMesh&&o.material.color.getHex()===0xa4afa3);
 const records=[];let instances=0;
 b.group.traverse(o=>{if(o.isMesh){let rows=o.isInstancedMesh?matrices(o):null;if(rows)instances+=rows.length;if(o===brass)rows=rows.slice(0,339);if(o===timber)rows=rows.slice(0,panels.sconces.oldTimber);if(o===surfaceStone)rows=rows.slice(0,panels.sconces.thresholds.oldSurfaceStone);records.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),geometry:{type:o.geometry.type,index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))},color:o.material.color?.getHex(),instances:rows});}});
 // Independent 2cdd64c snapshot, including every rail link and portal clip.
 // All old IDs remain; exclude only the newer supports independently checked
 // above. No original roof, wall, tread, rail link or portal clip is excluded.
 assert.equal(records.length,32);assert.equal(instances,749+panels.added+panels.sconces.added+panels.sconces.thresholds.added+panels.sconces.thresholds.signs.added);
 assert.equal(createHash('sha256').update(JSON.stringify(records)).digest('hex'),'7784bd064e2abc0d1dd98f9a54028987920857d36cb675b8d2e91bd09d994de0');
 const batch=color=>b.interior.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===color);
 const roofs=batch(0x596b63),masonry=batch(0xa4afa3);
 const boxes=o=>matrices(o).map((a,id)=>({id,box:new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(new T.Matrix4().fromArray(a))}));
 const r=boxes(roofs),w=boxes(masonry).slice(0,28);assert.equal(r.length,7);
 const overlap=(a,c)=>a.box.clone().intersect(c.box).getSize(new T.Vector3());
 const ray=(owner,p,d,far)=>new T.Raycaster(p,d,0,far).intersectObject(owner,true);
 const up=new T.Vector3(0,1,0),down=new T.Vector3(0,-1,0);
 let bearingFaces=0,bearingRays=0,cornerVertices=0,roofSeamRays=0,openStepRays=0,clearance=0,minHeadroom=Infinity;
 const bearings=[[6,21,.18,24],[6,22,.18,24],[5,23,21,.18],[5,24,44,.18],[5,25,.18,28],[5,26,.18,28],[5,27,72,.18]];
 for(const [ri,wi,sx,sz]of bearings){
  const roof=r[ri].box,wall=w[wi].box;near(roof.min.y,wall.max.y);
  const x0=Math.max(roof.min.x,wall.min.x),x1=Math.min(roof.max.x,wall.max.x),z0=Math.max(roof.min.z,wall.min.z),z1=Math.min(roof.max.z,wall.max.z);
  near(x1-x0,sx);near(z1-z0,sz);bearingFaces++;
  for(const tx of[.2,.5,.8])for(const tz of[.2,.5,.8]){
   const x=x0+(x1-x0)*tx,z=z0+(z1-z0)*tz;
   const top=ray(masonry,new T.Vector3(x,roof.min.y+.05,z),down,.1)[0],soffit=ray(roofs,new T.Vector3(x,wall.max.y-.05,z),up,.1)[0];
   assert.equal(top?.instanceId,wi);assert.equal(soffit?.instanceId,ri);near(top.point.y,soffit.point.y);bearingRays+=2;
  }
 }
 // Both stair walls already engage the hall and lower-room return walls.
 for(const [a,c]of[[21,7],[22,8],[21,23],[22,24]]){
  const s=overlap(w[a],w[c]);near(s.x,.18);near(s.y,11);near(s.z,.18);
  const joint=w[a].box.clone().intersect(w[c].box);
  for(const x of[joint.min.x,joint.max.x])for(const y of[joint.min.y,joint.max.y])for(const z of[joint.min.z,joint.max.z]){
   const p=new T.Vector3(x,y,z);assert(w[a].box.clone().expandByScalar(2e-5).containsPoint(p));assert(w[c].box.clone().expandByScalar(2e-5).containsPoint(p));cornerVertices++;
  }
 }
 near(r[1].box.max.z,r[6].box.min.z);near(r[1].box.min.y,r[6].box.min.y);
 const hallSeam=overlap(r[1],r[6]);near(hallSeam.x,7);near(hallSeam.y,.45);near(hallSeam.z,0);
 for(const x of[181.7,184.5,187.3])for(const y of[-28.9,-28.8,-28.6])for(const sign of[-1,1]){
  const h=ray(roofs,new T.Vector3(x,y,132+sign*.1),new T.Vector3(0,0,-sign),.2)[0];assert.equal(h?.instanceId,sign<0?6:1);near(h.point.z,132);roofSeamRays++;
 }
 // At the lower end the original roofs differ in height. There is no gap in
 // their horizontal cover, and no claim that this high step is a sealed roof.
 near(r[6].box.max.z,r[5].box.min.z);near(r[6].box.min.y-r[5].box.min.y,6);near(r[6].box.min.y-r[5].box.max.y,5.55);
 for(const x of[181.7,184.5,187.3])for(const y of[-34.4,-33.5,-32.5,-31.5,-30.5]){
  assert.equal(ray(b.interior,new T.Vector3(x,y,155.9),new T.Vector3(0,0,1),.2).length,0,'Keep the original high roof-step opening');openStepRays++;
 }
 for(const x of[181.7,184.5,187.3])for(const z of[132,156,...Array.from({length:281},(_,i)=>130.037+i*.1)]){
  assert(canWalkDepth(x,z));const floor=depthFloorAt(x,z),p=new T.Vector3(x,floor+1,z),hit=ray(b.interior,p,down,1.2)[0];assert(hit);near(hit.point.y,floor);
  const above=ray(b.interior,new T.Vector3(x,floor+1.8,z),up,24)[0];assert(above);minHeadroom=Math.min(minHeadroom,above.point.y-floor);assert(above.point.y-floor>6);
  assert.equal(ray(b.interior,new T.Vector3(x,floor+.001,z),up,2.2).length,0,'Original standing-centre aperture remains clear');clearance++;
 }
 return{added:0,bearingFaces,bearingRays,wallCorners:4,cornerVertices,roofSeamRays,openStepRays,clearance,minHeadroom};
}
