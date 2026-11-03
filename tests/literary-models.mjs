import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
const base=new URL('../src/ramsey-film/',import.meta.url),context=vm.createContext({THREE:T,console});
vm.runInContext(fs.readFileSync(new URL('assets/legacy-actors.js',base),'utf8'),context);
for(const id of ['nietzsche','zarathustra']){
 const actor=context.buildLiteraryCharacter(T,id);assert.equal(actor.style,'warm-illustrated-v1');
 for(const seated of [false,true]){actor.animate(0,{seated,reducedMotion:true});actor.group.updateMatrixWorld(true);let visible=0;
  actor.group.traverseVisible(o=>{if(!o.isMesh)return;visible++;assert(o.material.isMeshToonMaterial);for(const n of o.geometry.attributes.position.array)assert(Number.isFinite(n));});assert(visible>20);
  const bounds=new T.Box3();actor.group.traverseVisible(o=>{if(o.isMesh){o.geometry.computeBoundingBox();bounds.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));}});assert(bounds.min.y>-.05);assert(bounds.max.y<2.1);
 }
 actor.animate(0,{seated:true,reducedMotion:true});assert.equal(actor.head.rotation.x,0);
 const bytes=fs.readFileSync(new URL('assets/'+id+'.glb',base));assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(8),bytes.length);
 const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());assert.equal(json.animations.length,2);
 actor.dispose();assert.equal(actor.group.children.length,0);
}
for(const file of ['index.html','film.html','studio.html']){const source=fs.readFileSync(new URL(file,base),'utf8');assert(source.includes('assets/legacy-actors.js?v=7'));for(const [i,match]of [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].entries())new vm.Script(match[1],{filename:file+':'+i});}
console.log('PASS shared literary models, standing/seated geometry, exports, disposal and all inline script syntax');

const approved={"assets/legacy-actors.js": "d87f9fffc810a7a76660dfdfc186a160b9b55bcfbbf8bd1cf6d44386e27927a2", "assets/nietzsche.glb": "af51e76db55cb03500be97275f951f4881ae6ba9c2389c0ea99d43d2212c8dbf", "assets/zarathustra.glb": "94ca6e6ba01cebc206e3eb0683561692612c699b0b1c8549fd6febe91b00e86e"};
for(const [file,hash]of Object.entries(approved))assert.equal(createHash("sha256").update(fs.readFileSync(new URL(file,base))).digest("hex"),hash,"Preserve the refined shared character: "+file);

for(const id of ['socrates','nietzsche','zarathustra']){
 const actor=id==='socrates'?context.buildSocratesGuide(T):context.buildLiteraryCharacter(T,id);
 let hands=0;actor.group.traverse(o=>{if(o.name==='relaxed-open-hand')hands++;});assert.equal(hands,2,id+' must have two open hands');
 if(id==='nietzsche'){
  const scalp=actor.group.getObjectByName('nietzsche-fitted-scalp');assert(scalp);scalp.geometry.computeBoundingBox();assert(scalp.geometry.boundingBox.max.y<.26,'Avoid the old oversized hair mass');
  let eyes=0;actor.head.traverse(o=>{if(o.name==='nietzsche-recessed-eye'){eyes++;assert(o.position.z>-.15);}});assert.equal(eyes,2);
 }
 actor.dispose();
}
for(const id of ['anonymous','ramsey','turing']){
 const data=fs.readFileSync(new URL('assets/'+id+'.glb',base));const model=JSON.parse(data.subarray(20,20+data.readUInt32LE(12)).toString());assert(model.nodes.some(n=>n.name===id+'-relaxed-open-hands'));
 const bin=data.subarray(28+data.readUInt32LE(12));
 for(const mesh of model.meshes)for(const primitive of mesh.primitives){
  for(const key of ['POSITION','NORMAL','WEIGHTS_0']){
   const acc=model.accessors[primitive.attributes[key]];if(!acc)continue;const view=model.bufferViews[acc.bufferView],components=key==='WEIGHTS_0'?4:3;
   for(let i=0;i<acc.count;i++){let sum=0;for(let j=0;j<components;j++){const v=bin.readFloatLE((view.byteOffset||0)+(acc.byteOffset||0)+i*(view.byteStride||components*4)+j*4);assert(Number.isFinite(v));sum+=v;}if(key==='WEIGHTS_0')assert(Math.abs(sum-1)<.001);}
  }
 }
}
console.log('PASS fitted scalp, recessed eyes, six open procedural palms, three rigged open-hand sets, finite mesh data and normalized skin weights');
