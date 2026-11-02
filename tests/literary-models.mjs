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
for(const file of ['index.html','film.html','studio.html']){const source=fs.readFileSync(new URL(file,base),'utf8');assert(source.includes('assets/legacy-actors.js?v=6'));for(const [i,match]of [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].entries())new vm.Script(match[1],{filename:file+':'+i});}
console.log('PASS shared literary models, standing/seated geometry, exports, disposal and all inline script syntax');

const approved={"assets/legacy-actors.js": "522a39bf8d312c2c5a3fc3dd0022e0e1bbcf80e3337afa59e0a8b9d6f79cef77", "assets/nietzsche.glb": "bf3d64852b8740ee5d6db74a4cf4cdd3709a142cb9f4a8fa9a322ec1f84e8961", "assets/zarathustra.glb": "3c9c329802693128eb1ac293c172d06fa5d72cd72aa860411f4ee1da0cb63ae5"};
for(const [file,hash]of Object.entries(approved))assert.equal(createHash("sha256").update(fs.readFileSync(new URL(file,base))).digest("hex"),hash,"Preserve the restored approved character: "+file);
