import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {buildCityCoast} from '../src/coastal-city-scene.js';
import {buildEscherHouse} from '../src/escher-house.js';
import '../src/city-road-surface.js';

const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export function validateEscherSurfaceContacts(T,b){
 b.group.updateMatrixWorld(true);assert(b.group.matrixWorld.equals(new T.Matrix4()),'Original upper identity owner');
 const stone=b.surface.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===0xa4afa3);assert.equal(stone.count,11);
 const matrices=o=>Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();});
 const boxes=matrices(stone).map((a,id)=>{const m=new T.Matrix4().fromArray(a),p=new T.Vector3(),s=new T.Vector3();m.decompose(p,new T.Quaternion(),s);return{id,p,s,box:new T.Box3().setFromBufferAttribute(stone.geometry.attributes.position).applyMatrix4(m)};});
 const installed=b.interior.children.some(o=>o.userData.escherPrint),records=[];let instances=0;
 b.group.traverse(o=>{if(o.isMesh){let rows=o.isInstancedMesh?matrices(o):null;if(rows)instances+=rows.length;if(o===stone)rows=rows.slice(0,9);records.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),geometry:{type:o.geometry.type,index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))},color:o.material.color?.getHex(),instances:rows});}});
 // Independent 7a415ff snapshots retain ALL old parts, including both lamp
 // bearings. Only the two separately measured new surface stone IDs differ.
 assert.equal(hash(records),installed?'4f4769c8559ea8425f549bfc1fff1826e1ae2aaa1cf7dbfcede6663ec72a96d4':'57a417c82a4eeffac302440c07555f01e71fd1bb9b77bd7b9fee4f4c5dbe4b6a');assert.equal(records.length,installed?42:32);assert.equal(instances,installed?771:765);
 // Independent source owners of the measured supporting faces stay exact.
 for(const [file,expected]of[['coastal-city-scene.js','b16954d060d0e32b3da732d55b86ebf17a6eeec3db16250f0115b6a4c7b1e845'],['city-road-surface.js','ece9a47b7cc3bb579064f86b4afc42f31791970562b7e2c78428dc631efac5f8'],['escher-house.js','e59b86c7d92f5e5b9840273addf9d8b7e282140a5d88d28310f953bb0aeef7b0'],['city.js','42ef171da843e8655a84e50de307eda01f56f56af876d6bd0003104f63aa3b6c']])assert.equal(createHash('sha256').update(readFileSync(new URL('../src/'+file,import.meta.url),'utf8').replace(/\r\n/g,'\n')).digest('hex'),expected);
 const ctx=new Proxy({measureText:t=>({width:t.length*12})},{get:(o,k)=>o[k]??(()=>{})}),coast=buildCityCoast(T,{naturalTrees:null}),house=buildEscherHouse(T,{x:228,z:115,canvas:()=>({getContext:()=>ctx}),loadTexture:()=>new T.Texture()}),roadGroup=new T.Group(),roadMat=new T.MeshLambertMaterial(),road=globalThis.createCityRoad(T,[[-84,-32],[-84,-110],[0,-185],[0,-195]],7,roadMat,roadGroup);
 coast.group.updateMatrixWorld(true);house.group.updateMatrixWorld(true);roadGroup.updateMatrixWorld(true);
 const paths=coast.group.children.filter(o=>o.name==='Continuous unpatterned island path'),ray=(owner,p,d,far)=>new T.Raycaster(p,d,0,far).intersectObject(owner,true),down=new T.Vector3(0,-1,0),pads=boxes.slice(9);
 let headerContacts=0,existingFloorSeats=0,groundSamples=0,footContacts=0,footVertices=0,gapRays=0,bodySamples=0,thresholdRays=0;
 try{
  for(let i=0;i<3;i++){
   const jambs=boxes.slice(3*i,3*i+2),header=boxes[3*i+2];
   for(const j of jambs){const joint=j.box.clone().intersect(header.box).getSize(new T.Vector3());near(joint.x,.21);near(joint.y,.125);near(joint.z,.38);headerContacts++;
    const owner=i===0?house.group:i===1?road:coast.group;
    for(const x of[j.box.min.x,j.p.x,j.box.max.x])for(const z of[j.box.min.z,j.p.z,j.box.max.z]){
     const hit=ray(owner,new T.Vector3(x,.3,z),down,.5).find(h=>h.point.y<.2);assert(hit);near(hit.point.y,[.14,.13,.018][i]);if(i<2){assert(j.box.min.y<=hit.point.y+2e-5);existingFloorSeats++;}else near(j.box.min.y-hit.point.y,.112);groundSamples++;
    }
   }
  }
  for(let i=0;i<2;i++){
   const pad=pads[i],jamb=boxes[6+i];assert.equal(pad.id,9+i);near(pad.p.x,jamb.p.x);near(pad.p.z,-112);near(pad.s.x,.18);near(pad.s.y,.137);near(pad.s.z,.34);near(pad.box.min.y,.003);near(pad.box.max.y,.14);
   for(const axis of['x','z']){near(pad.box.min[axis]-jamb.box.min[axis],.02);near(jamb.box.max[axis]-pad.box.max[axis],.02);}
   const joint=pad.box.clone().intersect(jamb.box),size=joint.getSize(new T.Vector3());near(size.x,.18);near(size.y,.01);near(size.z,.34);footContacts++;
   for(const x of[joint.min.x,joint.max.x])for(const y of[joint.min.y,joint.max.y])for(const z of[joint.min.z,joint.max.z]){const p=new T.Vector3(x,y,z);assert(pad.box.clone().expandByScalar(2e-5).containsPoint(p));assert(jamb.box.clone().expandByScalar(2e-5).containsPoint(p));footVertices++;}
   for(const x of[pad.box.min.x,pad.p.x,pad.box.max.x])for(const z of[pad.box.min.z,pad.p.z,pad.box.max.z]){
    const lawn=ray(coast.land,new T.Vector3(x,.03,z),down,.05)[0],path=paths.flatMap(o=>ray(o,new T.Vector3(x,.03,z),down,.05)).sort((a,b)=>a.distance-b.distance)[0];assert(lawn&&path);near(lawn.point.y,.005);near(path.point.y,.018);near(lawn.point.y-pad.box.min.y,.002);assert(pad.box.containsPoint(lawn.point)&&pad.box.containsPoint(path.point));groundSamples+=2;
   }
   const hit=ray(stone,new T.Vector3(pad.p.x-.2,.075,pad.p.z),new T.Vector3(1,0,0),.4)[0];assert.equal(hit?.instanceId,pad.id);gapRays++;
  }
  for(const dx of[-1.2,-.6,0,.6,1.2])for(const dz of[-2,-1,0,1,2])for(const y of[.04,.13,1,2]){const p=new T.Vector3(256+dx,y,-112+dz);assert(pads.every(a=>!a.box.containsPoint(p)),'New bearings remain inside old jamb footprints, outside the entire approach');bodySamples++;}
  for(const door of b.targets.filter(o=>o.userData.escherDepthDoor)){for(const dx of[-.6,0,.6]){const hit=ray(b.surface,new T.Vector3(door.position.x+dx,door.position.y,door.position.z+1),new T.Vector3(0,0,-1),1.1)[0];assert(hit);assert.equal(hit.object,door,'The exact original threshold pick plane remains first');thresholdRays++;}}
  assert.equal(existingFloorSeats,36);assert.equal(headerContacts,6);assert.equal(footContacts,2);assert.equal(thresholdRays,9);
 }finally{coast.dispose();house.dispose();road.geometry.dispose();roadMat.dispose();}
 return{added:2,oldSurfaceStone:9,headerContacts,existingFloorSeats,groundSamples,footContacts,footVertices,gapRays,bodySamples,thresholdRays};
}
