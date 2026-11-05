import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as THREE from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {readGLB} from '../tools/lib/ramsey-glb.mjs';
const film=new URL('../src/ramsey-film/',import.meta.url);
const window={};
const context=vm.createContext({THREE,window,console,ArrayBuffer,Uint8Array,Uint16Array,Uint32Array,Float32Array,DataView,TextDecoder,TextEncoder,URL,Blob,fetch,Request,Response,AbortController,performance,setTimeout,clearTimeout});
vm.runInContext(fs.readFileSync(new URL('vendor/gltf-loader.js',film),'utf8'),context);
vm.runInContext(fs.readFileSync(new URL('assets/character-adapter.js',film),'utf8'),context);
const records={};
for(const id of ['turing','ramsey','nietzsche']){
 const {doc:d,bin}=readGLB(new URL('assets/'+id+'.glb',film));
 // Geometry/rig validation only. Texture decoding is verified by the separate
 // Blender render; remove image references so this check requires no DOM.
 d.materials=[{pbrMetallicRoughness:{baseColorFactor:[1,1,1,1]}}];
 for(const mesh of d.meshes)for(const p of mesh.primitives)p.material=0;
 d.images=[];d.textures=[];d.samplers=[];
 const json=Buffer.from(JSON.stringify(d)),j=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]),b=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]),out=Buffer.alloc(28+j.length+b.length);
 out.write('glTF');out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(j.length,12);out.write('JSON',16);j.copy(out,20);out.writeUInt32LE(b.length,20+j.length);out.write('BIN\0',24+j.length);b.copy(out,28+j.length);
 const gltf=await new Promise((resolve,reject)=>new window.GLTFLoader().parse(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'',resolve,reject));
 const actor=context.academicActorFromGLTF(gltf,id),standing={};
 for(const seated of [false,true,false,true,false]){
  actor.animate(100,{seated,talking:true,reducedMotion:true});
  actor.group.updateMatrixWorld(true);
  actor.group.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update();});
  const bounds=new THREE.Box3().setFromObject(actor.group,true),size=bounds.getSize(new THREE.Vector3());
  assert(Number.isFinite(size.y)&&size.y>1&&size.y<2.1,id+' sensible posed bounds');
  if(id==='nietzsche'){
   const fit=actor.group.getObjectByName('nietzsche-whole-character-fit');
   assert(fit,'The live loader must preserve the fit control name');
   assert(Math.abs(fit.position.y-(seated?-.056:-.00673))<1e-8);
   const headScale=actor.head.getWorldScale(new THREE.Vector3());
   assert(Math.abs(headScale.x-1.1)<1e-6&&Math.abs(headScale.y-1.1)<1e-6&&Math.abs(headScale.z-1.1)<1e-6);
  }
  const pose=seated?'seated':'standing';
  if(standing[pose])assert(Math.abs(standing[pose].height-size.y)<1e-9,'Repeated pose changes must not accumulate scaling');
  standing[pose]={height:size.y,minY:bounds.min.y,maxY:bounds.max.y};
 }
 records[id]=standing;
 actor.dispose();
}
const heights=Object.values(records).map(r=>r.standing.height);
assert(Math.max(...heights)-Math.min(...heights)<.04,'All three characters share a comparable standing scale');
console.log('PASS real Three.js GLTFLoader + live actor: standing/seated reset, uniform bone scale, comparable cast heights, finite skin bounds');
