import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildEscherHouse} from '../src/escher-house.js';

const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
export function validateEscherSurfaceSigns(T,b){
 b.group.updateMatrixWorld(true);assert(b.group.matrixWorld.equals(new T.Matrix4()));
 const stone=b.surface.children.find(o=>o.isInstancedMesh&&o.material.color.getHex()===0xa4afa3),matrices=o=>Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();});assert.equal(stone.count,15);
 const boxes=matrices(stone).map((a,id)=>{const m=new T.Matrix4().fromArray(a),p=new T.Vector3(),s=new T.Vector3();m.decompose(p,new T.Quaternion(),s);return{id,p,s,box:new T.Box3().setFromBufferAttribute(stone.geometry.attributes.position).applyMatrix4(m)};}),tabs=boxes.slice(11),records=[];let instances=0;
 const installed=b.interior.children.some(o=>o.userData.escherPrint);
 b.group.traverse(o=>{if(o.isMesh){let rows=o.isInstancedMesh?matrices(o):null;if(rows)instances+=rows.length;if(o===stone)rows=rows.slice(0,11);records.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),geometry:{type:o.geometry.type,index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))},color:o.material.color?.getHex(),instances:rows});}});
 // Independent da49a9d full snapshots retain both study foot bearings, all
 // earlier joints and every original plane/profile/pose/ID. Check the four
 // appended tabs separately before older comparisons exclude their IDs.
 assert.equal(createHash('sha256').update(JSON.stringify(records)).digest('hex'),installed?'f27ed36812943da2204c3701f473c786ea29a7e37c68adc5495f5bb84dc53043':'5126d28b8cfaddb5ad38933dc8f84ad34a469038f0224383fe70496dc2754634');assert.equal(records.length,installed?42:32);assert.equal(instances,installed?775:769);
 const signs=b.surface.children.filter(o=>o.isMesh&&!o.isInstancedMesh&&o.geometry.type==='PlaneGeometry'&&o.geometry.parameters.height===.5);assert.equal(signs.length,3);
 const ray=(owner,p,d,far)=>new T.Raycaster(p,d,0,far).intersectObject(owner,true);
 let originalGaps=0,headerContacts=0,headerVertices=0,sheetContacts=0,sheetCorners=0,gapRays=0,readingRays=0,bodySamples=0,wallSeats=0;
 for(let i=0;i<3;i++){
  const sign=signs[i],bounds=new T.Box3().setFromObject(sign),header=boxes[3*i+2],width=i?4.3:3.4;near(sign.geometry.parameters.width,width);assert.equal(sign.material.side,T.DoubleSide);assert(!b.targets.includes(sign),'Identity planes retain their original noninteractive role');
  near(bounds.min.y-header.box.max.y,.075);near(sign.position.z-header.box.max.z,.04);originalGaps++;
  for(const side of[-1,1])for(const dx of[-.6,0,.6]){const hit=ray(b.surface,new T.Vector3(sign.position.x+dx,sign.position.y,sign.position.z+side),new T.Vector3(0,0,-side),1.1)[0];assert.equal(hit?.object,sign,'Original middle text band stays visible from both sides');readingRays++;}
  if(!i)continue;
  for(let k=0;k<2;k++){
   const tab=tabs[2*(i-1)+k];assert.equal(tab.id,11+2*(i-1)+k);near(tab.p.x,sign.position.x+(k?.85:-.85));near(tab.p.z,sign.position.z-.015);near(tab.s.x,.04);near(tab.s.y,.095);near(tab.s.z,.08);
   near(tab.box.min.y,header.box.max.y-.01);near(tab.box.max.y,bounds.min.y+.01);assert(tab.box.min.y>header.box.min.y,'No tab extends below the original header');
   const joint=tab.box.clone().intersect(header.box),size=joint.getSize(new T.Vector3());near(size.x,.04);near(size.y,.01);near(size.z,.015);headerContacts++;
   for(const x of[joint.min.x,joint.max.x])for(const y of[joint.min.y,joint.max.y])for(const z of[joint.min.z,joint.max.z]){const p=new T.Vector3(x,y,z);assert(tab.box.clone().expandByScalar(2e-5).containsPoint(p));assert(header.box.clone().expandByScalar(2e-5).containsPoint(p));headerVertices++;}
   const seat=tab.box.clone().intersect(bounds),ss=seat.getSize(new T.Vector3());near(ss.x,.04);near(ss.y,.01);near(ss.z,0);sheetContacts++;
   for(const x of[seat.min.x,seat.max.x])for(const y of[seat.min.y,seat.max.y]){assert(tab.box.clone().expandByScalar(2e-5).containsPoint(new T.Vector3(x,y,sign.position.z)));sheetCorners++;}
   const hit=ray(stone,new T.Vector3(tab.p.x-.1,tab.p.y,tab.p.z),new T.Vector3(1,0,0),.2)[0];assert.equal(hit?.instanceId,tab.id);gapRays++;
  }
  for(const dx of[-1.2,-.6,0,.6,1.2])for(const dz of[-2,-1,0,1,2])for(const y of[.13,1,2.2,4.4]){assert(tabs.every(t=>!t.box.containsPoint(new T.Vector3(sign.position.x+dx,y,sign.position.z-.23+dz))));bodySamples++;}
 }
 // Build only original public geometry with synthetic textures. The installed
 // alcove sign already crosses both real side walls; no redundant support.
 const ctx=new Proxy({measureText:t=>({width:t.length*12})},{get:(o,k)=>o[k]??(()=>{})}),house=buildEscherHouse(T,{x:228,z:115,canvas:()=>({getContext:()=>ctx}),loadTexture:()=>new T.Texture()});house.group.updateMatrixWorld(true);
 try{const sign=new T.Box3().setFromObject(signs[0]);house.group.traverse(o=>{if(o.isMesh&&o.geometry.type==='BoxGeometry'){const j=sign.clone().intersect(new T.Box3().setFromObject(o)),s=j.getSize(new T.Vector3());if(!j.isEmpty()&&s.x>.001&&s.y>.001){near(s.x,.18);near(s.y,.5);near(s.z,0);wallSeats++;}}});assert.equal(wallSeats,2);}finally{house.dispose();}
 for(let i=0;i<tabs.length;i++)for(let j=i+1;j<tabs.length;j++)assert(tabs[i].box.clone().intersect(tabs[j].box).isEmpty());
 assert.equal(headerContacts,4);assert.equal(sheetContacts,4);assert.equal(readingRays,18);return{added:4,oldSurfaceStone:11,originalGaps,wallSeats,headerContacts,headerVertices,sheetContacts,sheetCorners,gapRays,readingRays,bodySamples};
}
