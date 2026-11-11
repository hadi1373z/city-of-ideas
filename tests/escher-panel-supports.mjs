import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {DEPTH_TRIANGLE,depthFloorAt,canWalkDepth} from '../src/escher-depth-model.js';
import {validateEscherWallLampSupports} from './escher-wall-lamp-supports.mjs';

const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export function validateEscherPanelSupports(T,b){
 const sconces=validateEscherWallLampSupports(T,b);
 b.group.updateMatrixWorld(true);assert(b.group.matrixWorld.equals(new T.Matrix4()),'Original upper +Y owner');
 const batch=color=>b.interior.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===color);
 const brass=batch(0xaa9868),roof=batch(0x596b63),glow=batch(0xffe2b9),timber=batch(0x3c5149);assert.equal(brass.count,351);
 const matrices=o=>Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();});
 const surfaceStone=b.surface.children.find(o=>o.isInstancedMesh&&o.material.color.getHex()===0xa4afa3);
 const records=[];let instances=0;
 b.group.traverse(o=>{if(o.isMesh){let rows=o.isInstancedMesh?matrices(o):null;if(rows)instances+=rows.length;if(o===brass)rows=rows.slice(0,339);if(o===timber)rows=rows.slice(0,sconces.oldTimber);if(o===surfaceStone)rows=rows.slice(0,sconces.thresholds.oldSurfaceStone);records.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),geometry:{type:o.geometry.type,index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))},color:o.material.color?.getHex(),instances:rows});}});
 // Independent 7c1f0f2 pre-edit snapshot: retain all 749 old instances and
 // every mesh/profile/pose. Timber bearings and surface feet are validated above;
 // this older snapshot also excludes the twelve measured panel stems.
 assert.equal(records.length,32);assert.equal(instances,761+sconces.added+sconces.thresholds.added);
 assert.equal(hash(records),'7784bd064e2abc0d1dd98f9a54028987920857d36cb675b8d2e91bd09d994de0');
 const lights=[];b.lamps.traverse(o=>{if(o.isLight)lights.push({type:o.type,matrix:o.matrix.toArray(),color:o.color.getHex(),intensity:o.intensity,distance:o.distance??null,decay:o.decay??null});});
 assert.equal(lights.length,9);assert.equal(hash(lights),'f238339aa65cfe4e935e616087f4c78f01f391a34f50118424f70693d4232d7d');
 const boxes=o=>matrices(o).map((a,id)=>{const m=new T.Matrix4().fromArray(a),p=new T.Vector3(),s=new T.Vector3();m.decompose(p,new T.Quaternion(),s);return{id,p,s,box:new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(m)};});
 const panels=boxes(glow).slice(4),roofs=boxes(roof),stems=boxes(brass).slice(339);assert.equal(panels.length,6);assert.equal(stems.length,12);
 const expected=[[176,-32,115,1],[213,-32,115,2],[213,-32,82,3],[250,-32,115,4],[184,-34,144,6],[196,-38,171,5]];
 const ray=(owner,p,d,far)=>new T.Raycaster(p,d,0,far).intersectObject(owner,true),up=new T.Vector3(0,1,0),down=new T.Vector3(0,-1,0);
 let contacts=0,contactVertices=0,gapRays=0,endRays=0,roofRays=0,panelRays=0,viewRays=0,clearance=0,minHeadroom=Infinity;
 for(let i=0;i<6;i++){
  const [x,y,z,ri]=expected[i],p=panels[i],r=roofs[ri];near(p.p.x,x);near(p.p.y,y);near(p.p.z,z);near(p.s.x,2.4);near(p.s.y,.12);near(p.s.z,.8);
  near(r.box.min.y-p.box.max.y,i===4?4.94:2.94);
  for(let side=0;side<2;side++){
   const a=stems[2*i+side];assert.equal(a.id,339+2*i+side);near(a.p.x,x+(side?.85:-.85));near(a.p.z,z);near(a.s.x,.04);near(a.s.z,.04);near(a.s.y,i===4?4.96:2.96);
   assert(a.box.min.y>p.box.min.y,'Stems stop inside original panels, never below them');
   for(const other of[p,r]){
    const joint=a.box.clone().intersect(other.box),size=joint.getSize(new T.Vector3());near(size.x,.04);near(size.y,.01);near(size.z,.04);contacts++;
    for(const px of[joint.min.x,joint.max.x])for(const py of[joint.min.y,joint.max.y])for(const pz of[joint.min.z,joint.max.z]){const v=new T.Vector3(px,py,pz);assert(a.box.clone().expandByScalar(2e-5).containsPoint(v));assert(other.box.clone().expandByScalar(2e-5).containsPoint(v));contactVertices++;}
   }
   const mid=ray(brass,new T.Vector3(a.p.x,a.p.y,z+.1),new T.Vector3(0,0,-1),.2)[0];assert.equal(mid?.instanceId,a.id);gapRays++;
   for(const sign of[-1,1]){const h=ray(brass,new T.Vector3(a.p.x,sign<0?a.box.min.y-.02:a.box.max.y+.02,z),sign<0?up:down,.06)[0];assert.equal(h?.instanceId,a.id);endRays++;}
   const top=ray(roof,new T.Vector3(a.p.x,p.box.max.y+.02,z),up,6)[0];assert.equal(top?.instanceId,ri);roofRays++;
   const base=ray(glow,new T.Vector3(a.p.x,p.box.max.y+.02,z),down,.05)[0];assert.equal(base?.instanceId,p.id);panelRays++;
  }
  for(const dx of[-8,-4,0,4,8])for(const dz of[-8,-4,0,4,8]){
   const px=x+dx,pz=z+dz;if(!canWalkDepth(px,pz))continue;const floor=depthFloorAt(px,pz),hit=ray(b.interior,new T.Vector3(px,floor+1,pz),down,1.2)[0];assert(hit);near(hit.point.y,floor);
   const above=ray(b.interior,new T.Vector3(px,floor+1.8,pz),up,24)[0];assert(above);minHeadroom=Math.min(minHeadroom,above.point.y-floor);assert(above.point.y-floor>6);
   assert.equal(ray(b.interior,new T.Vector3(px,floor+.001,pz),up,2.2).length,0,'Original valid standing centres remain clear');clearance++;
  }
 }
 for(let i=0;i<stems.length;i++)for(let j=i+1;j<stems.length;j++)assert(stems[i].box.clone().intersect(stems[j].box).isEmpty(),'Separate stems never overlap');
 // Preserve the actual separated-rod sightlines from all three source marks.
 for(const x of[209.5,213,216.5])for(const endpoint of DEPTH_TRIANGLE.flat()){
  const start=new T.Vector3(x,-38.2,124),delta=new T.Vector3(endpoint.x,endpoint.y,endpoint.z).sub(start);
  assert.equal(ray(brass,start,delta.clone().normalize(),delta.length()).filter(h=>h.instanceId>=339).length,0);viewRays++;
 }
 assert(clearance>50);return{sconces,added:12,panels:6,contacts,contactVertices,gapRays,endRays,roofRays,panelRays,viewRays,clearance,minHeadroom};
}
