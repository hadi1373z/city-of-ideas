import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {HISTORIC_PAPERS} from '../src/historic-papers-data.js';
import {paperMonitorSlots,paperMonitorColliders,paperMonitorsCanStand,nearPaper} from '../src/paper-monitors-model.js';
import {lowerMatrix,WORLD_CYLINDER as W} from '../src/world-cylinder-model.js';
import {verifyHelicalSupports} from './helical-gallery-supports.mjs';

const hash=v=>createHash('sha256').update(typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v)).digest('hex'),round=x=>Math.round(x*1e6)/1e6;
const baseline={
 lower:{counts:[13,131,79,1045,468],instances:1736,ordered:'d018be0b1c2cff7d94894008db19b89d9163f9070e0b22cde01dd29678683d5b',sorted:'1d569525d51a3d005310dea83784d705dc7b7adec2c7a2298a5bdaa5f15b09ad',non:'8d404e8c1569aa4458c0473bd02d82a014d146eca5cc6c3e50fa0045065c6520',resources:[17,5,0,5],draws:19},
 upper:{counts:[13,26,92,865,464],instances:1460,ordered:'9d096f9bad3988fc6d31f666d4bd9dc87cc6d36e6b2915e22295c1af7dc9e5b6',sorted:'5cc7764898f9f663d1bbae21faeaaa3b55e45e9197b66d21650be35052a90026',non:'c5874bed8646a8f6b8883d99423058f3e8200c2a5d38f792ca8dbfac650e715d',resources:[11,5,0,5],draws:13}
};

// Independent 59b8fa6 inventory, including the particular supplied editions/pages.
export function verifyPaperInventory(){
 assert.equal(hash(HISTORIC_PAPERS),'13b0a9c6204f0a779574beac1891fe8b1f6c92a9b9a7055af9b96b29c05b9910');
 assert.equal(hash(paperMonitorSlots()),'f6e91397817d827c519934bab19af5dba7307d723d0ce790ae07b87e3f3ec5da');
 assert.equal(hash(paperMonitorColliders()),'8211a1c949d04c5e837e592aaa9cc3e930f6580e1cd1e4187d201c9e822e1efb');
 const expected=['a0ba1be9c378645820e41ba2c26e6ed8bb34be4494faf31bbf69499da2993559','251eb543d77cd9d5da147e1fd9026eea059f3db10d5bde82c62d4e24e07f6bd1','12f4645b91b4c1499561f1a25745041f1b7786b4f755d401bd1391b93960a8bd','fc5a0df79e60ed4411398666e6271d994d4028e866ec5d4858c3667f06e85356','26c20aa5a4ed79b25a0229ac9cd89695bda047b11faa5ce3dc3a9f7742a7a02e','dd0e165102787e117bac44c78798a69e5ca8d505f1100122b050527a24ea36df','c86d54f327ce62962e268ca1a35add05f847a4a2de99349fa8fce0a2271d8374','17dba2239d7c139b2dd0764c042de52faeff087398fea4dc266d93210f667958','4f726c1ff58ee5050a9df0fd14425025a024a1e80efe50dfbc4d8e7b267b8534','a9045f0a859c6c57e0f72f12e55bdd96ab986e500aefac74ccac828111ab762b','15a2c62032a120a758c9e61b3d6251b4cb3e4bf3189acb0d2268f476a4a16c84'];
 assert.deepEqual(HISTORIC_PAPERS.map(p=>hash(readFileSync(new URL(p.imageUrl,new URL('../src/paper-monitors.js',import.meta.url))))),expected,'Keep every genuine scan byte; a replacement facsimile is not a support repair');
}

// Checks the actual gallery instance matrices. Optional installed frames/pages
// belong to the independent paper runtime; never register their resources here.
export function verifyPaperDisplaySupports(T,b,{frames=null,pages=null}={}){
 const helix=verifyHelicalSupports(T,b);
 const expected=baseline[b.side],originalRows=[],non=[],batches=[],added=[],geometries=new Set(),materials=new Set(),textures=new Set(),buffers=new Set();
 const near=(a,c,tol=6e-5)=>assert(Math.abs(a-c)<tol,`${a} != ${c}`),m=new T.Matrix4();
 let draws=0;
 function inspect(o){
  if(o.userData.paperMonitors)return;
  if(o.isMesh){
   draws++;geometries.add(o.geometry);
   for(const mat of Array.isArray(o.material)?o.material:[o.material]){materials.add(mat);if(mat.map)textures.add(mat.map);}
   if(o.isInstancedMesh){
    buffers.add(o);const count=expected.counts[batches.length];assert(Number.isInteger(count),'No new instance batch');
    assert.equal(o.count-(helix.ignored.get(o)?.size??0),count+(b.side==='lower'&&o.material.color.getHex()===0xd0c6aa&&o.geometry.type==='BoxGeometry'?33:0));
    const batch=[];for(let i=0;i<o.count;i++){if(helix.ignored.get(o)?.has(i))continue;o.getMatrixAt(i,m);const row={name:o.name,color:o.material.color?.getHex(),matrix:[...m.elements].map(round)};
     const item={mesh:o,index:i,matrix:m.clone(),row};batch.push(item);if(i<count)originalRows.push(JSON.stringify(row));else added.push(item);
    }batches.push(batch);
   }else non.push({name:o.name,position:o.position.toArray(),rotation:o.rotation.toArray(),data:o.userData,color:o.material.color?.getHex(),geometry:hash({position:Array.from(o.geometry.attributes.position.array),index:o.geometry.index?Array.from(o.geometry.index.array):null})});
  }
  for(const child of o.children)inspect(child);
 }
 inspect(b.group);
 assert.equal(draws,expected.draws);assert.equal(originalRows.length,expected.instances);
 assert.equal(hash(originalRows),expected.ordered,'Every old per-batch instance ID and matrix remains exact');
 assert.equal(hash([...originalRows].sort()),expected.sorted,'Independent original gallery fingerprint');
 assert.equal(hash(non),expected.non,'All original noninstance geometry, profiles, poses and walking surfaces remain exact');
 assert.deepEqual([geometries.size,materials.size,textures.size,buffers.size],expected.resources);
 const releases=new Map();for(const r of [...geometries,...materials,...textures,...buffers]){releases.set(r,0);r.addEventListener('dispose',()=>releases.set(r,releases.get(r)+1));}
 const assertReleased=()=>{for(const n of releases.values())assert.equal(n,1,'Each original gallery resource/buffer releases exactly once');};
 if(b.side==='upper'){assert.equal(added.length,0);return{originalRows,assertReleased};}

 assert.equal(added.length,33);const slots=paperMonitorSlots(),colliders=paperMonitorColliders(),floor=b.group.getObjectByName('Lower face annular gallery floor');
 assert(floor);b.group.updateWorldMatrix(true,true);
 const pos=new T.Vector3(),scale=new T.Vector3(),quat=new T.Quaternion(),down=new T.Vector3(0,-1,0);
 const corners=item=>{const a=[];for(const x of[-.5,.5])for(const y of[-.5,.5])for(const z of[-.5,.5])a.push(new T.Vector3(x,y,z).applyMatrix4(item.matrix));return a;};
 function proxy(item){const o=new T.Mesh(item.mesh.geometry,item.mesh.material);o.matrixAutoUpdate=false;o.matrix.copy(item.matrix);o.updateMatrixWorld(true);return o;}
 function contact(point,objects,y){
  // Float32 instance matrices round shared edges independently. Probe within
  // 20 micrometres of a corner rather than treating a triangle edge as a gap.
  let hit;for(const dx of[0,-.00002,.00002])for(const dz of[0,-.00002,.00002])hit??=new T.Raycaster(new T.Vector3(point.x+dx,y+.04,point.z+dz),down,0,.08).intersectObjects(objects,false)[0];assert(hit,'A bearing corner must meet the actual supporting mesh');near(hit.point.y,y);
 }
 let ground=0,cap=0,seats=0,backings=0,envelope=0,approaches=0;
 for(let i=0;i<slots.length;i++){
  const slot=slots[i],c=colliders[i],parts=added.filter(a=>{a.matrix.decompose(pos,quat,scale);return Math.hypot(pos.x-slot.x,pos.z-slot.z)<.6;});assert.equal(parts.length,3);
  const core=parts.find(a=>{a.matrix.decompose(pos,quat,scale);return scale.y>.5;}),
   rear=parts.find(a=>{a.matrix.decompose(pos,quat,scale);return Math.abs(scale.y-.22)<1e-5;}),
   seat=parts.find(a=>a!==core&&a!==rear);assert(core&&rear&&seat);
  const slab=batches.flat().find(a=>{if(added.includes(a)||a.mesh.geometry.type!=='BoxGeometry')return false;a.matrix.decompose(pos,quat,scale);return Math.abs(scale.y-.22)<1e-5&&Math.abs(scale.x-3.4)<1e-5&&Math.hypot(pos.x-slot.x,pos.z-slot.z)<.6;});assert(slab,'Keep the installed original slab');
  const ps=parts.map(proxy),coreMesh=proxy(core),capMeshes=[proxy(slab),proxy(rear)],seatMesh=proxy(seat);
  for(const a of parts)for(const p of corners(a)){
   const dx=p.x-c.x,dz=p.z-c.z,t=-Math.sin(c.angle)*dx+Math.cos(c.angle)*dz,r=Math.cos(c.angle)*dx+Math.sin(c.angle)*dz;
   assert(Math.abs(t)<=c.halfTangent+6e-5&&Math.abs(r)<=c.halfRadial+6e-5&&p.y>=c.minY-6e-5&&p.y<=c.maxY+6e-5,'All support corners stay inside the unchanged solid band');envelope++;
  }
  for(const p of corners(core).filter(p=>p.y<.41)){
   const start=b.group.localToWorld(new T.Vector3(p.x,p.y+.04,p.z)),dir=down.clone().transformDirection(b.group.matrixWorld),hit=new T.Raycaster(start,dir,0,.08).intersectObject(floor)[0];assert(hit,'The real installed annular floor supports every foot corner');near(b.group.worldToLocal(hit.point.clone()).y,.13);ground++;
  }
  for(const a of[slab,rear])for(const p of corners(a).filter(p=>p.y<.8)){contact(p,[coreMesh],.67);cap++;}
  for(const p of corners(seat).filter(p=>p.y<.97)){contact(p,capMeshes,.89);seats++;}
  const frameMatrix=new T.Matrix4();
  if(frames){frames.getMatrixAt(i,frameMatrix);frameMatrix.premultiply(frames.matrixWorld).premultiply(b.group.matrixWorld.clone().invert());}
  else frameMatrix.compose(new T.Vector3(slot.x,slot.y,slot.z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),slot.yaw),new T.Vector3(slot.width,slot.height,.14));
  for(const p of corners({matrix:frameMatrix}).filter(p=>p.y<2)){contact(p,[seatMesh],1.03);backings++;}
  // Rectangular parts share faces, never visible overlapping volumes.
  const localBounds=item=>{const points=corners(item).map(p=>new T.Vector3(-Math.sin(slot.angle)*p.x+Math.cos(slot.angle)*p.z,p.y,Math.cos(slot.angle)*p.x+Math.sin(slot.angle)*p.z));return new T.Box3().setFromPoints(points);},
   bounds=[core,slab,rear,seat].map(localBounds);
  for(let a=0;a<bounds.length;a++)for(let z=a+1;z<bounds.length;z++){const overlap=bounds[a].clone().intersect(bounds[z]).getSize(new T.Vector3());assert(Math.min(overlap.x,overlap.y,overlap.z)<6e-5,'Fitted parts butt without overlapping visible faces');}
  if(pages){
   const record=pages[i];assert.equal(record.slot.id,slot.id);
   for(const child of record.holder.children)if(child.isMesh){
    const toLocal=b.group.matrixWorld.clone().invert().multiply(child.matrixWorld);
    for(const p of child.geometry.attributes.position.array.length?[-.5,.5]:[]){const low=new T.Vector3(0,p,0).applyMatrix4(toLocal);assert(low.y>=1.06-6e-5,'The support clears the original caption and fitted page');}
   }
   assert.deepEqual(record.page.position.toArray(),[0,.14,.082]);assert.equal(record.page.userData.paperMonitor,record.paper.id);
  }
  // Walk the real inward approach with an eye-height ray against new supports.
  for(let j=0;j<=20;j++){
   const r=52+j*.1,x=Math.cos(slot.angle)*r,z=Math.sin(slot.angle)*r;assert(paperMonitorsCanStand(x,z,.13));
   assert.equal(new T.Raycaster(new T.Vector3(x,.13,z),new T.Vector3(0,1,0),.01,1.8).intersectObjects(ps,false).length,0);
   assert(nearPaper({x:W.lowerOrigin.x+x,z:W.lowerOrigin.z+z,y:1.93},slot));approaches++;
  }
 }
 // Circumferential paper aisle and unchanged open western exit.
 const supports=added.map(proxy);
 for(let i=0;i<720;i++){const a=i/720*Math.PI*2,x=Math.cos(a)*52,z=Math.sin(a)*52;assert(paperMonitorsCanStand(x,z,.13));assert.equal(new T.Raycaster(new T.Vector3(x,.14,z),new T.Vector3(0,1,0),0,1.8).intersectObjects(supports,false).length,0);approaches++;}
 for(let x=-56;x>=-64;x-=.25)for(const z of[-1,0,1]){assert(paperMonitorsCanStand(x,z,.13));assert.equal(new T.Raycaster(new T.Vector3(x,.14,z),new T.Vector3(0,1,0),0,1.8).intersectObjects(supports,false).length,0);approaches++;}
 // Independently exercise the physical half-turn, without moving source parts.
 if(!b.group.parent){
  const frame=new T.Group();frame.matrixAutoUpdate=false;frame.matrix.copy(lowerMatrix(T));const old=b.group.position.clone();b.group.position.set(W.lowerOrigin.x,0,W.lowerOrigin.z);frame.add(b.group);frame.updateMatrixWorld(true);
  for(const a of added.filter((_,i)=>i%3===0))for(const p of corners(a).filter(p=>p.y<.41)){
   const start=b.group.localToWorld(new T.Vector3(p.x,.17,p.z)),hit=new T.Raycaster(start,new T.Vector3(0,1,0),0,.08).intersectObject(floor)[0];assert(hit);near(hit.point.y,-96.13);
  }b.group.removeFromParent();b.group.position.copy(old);b.group.updateMatrixWorld(true);
 }
 assert.deepEqual([ground,cap,seats,backings,envelope],[44,88,44,44,264]);
 return{originalRows,assertReleased,ground,cap,seats,backings,envelope,approaches};
}
