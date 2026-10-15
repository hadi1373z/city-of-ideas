import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {buildSocratesGuide} from '../src/socrates-character.js';
import {SOCRATES_EPISODES} from '../src/socrates-episodes.js';
import {clearHostSegment,findHostSpot} from '../src/socrates-tour.js';
const T={};vm.runInNewContext(await readFile(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:T,module:{exports:T},console:{...console,warn(){}}});
const actor=buildSocratesGuide(T),bounds=new T.Box3().setFromObject(actor.group),meshes=[];actor.group.traverse(o=>{if(o.isMesh)meshes.push(o);});
assert.equal(actor.style,'warm-illustrated-v1');assert(meshes.length>50);assert(bounds.min.y>=0);assert(bounds.max.y>1.8&&bounds.max.y<2);assert(bounds.max.x-bounds.min.x<1);
assert(meshes.every(o=>o.userData.resident&&o.userData.animated&&o.material.isMeshToonMaterial));
const pose=()=>[actor.body.position.y,actor.head.rotation.y,actor.head.rotation.z,...actor.limbs.flatMap(l=>[l.part.rotation.x,l.part.rotation.z])];
actor.animate(1,{walking:true,talking:true});assert(pose().every(Number.isFinite));assert(pose().some(v=>Math.abs(v)>.1));
actor.animate(1,{walking:true,talking:true,reducedMotion:true});const reduced=pose();actor.animate(3,{walking:true,talking:true,reducedMotion:true});assert.deepEqual(pose(),reduced);
actor.animate(3,{});assert(actor.limbs.every(l=>l.part.rotation.x===0&&l.part.rotation.z===0));
assert.equal(findHostSpot({x:0,z:0,yaw:0},()=>false),null);const clear=p=>true,spot=findHostSpot({x:0,z:0,yaw:0},clear);assert(spot&&spot.z<0);
assert.equal(clearHostSegment((x,z)=>Math.abs(z+1)>.1,{x:0,z:0},{x:0,z:-4}),false);
assert.equal(SOCRATES_EPISODES.length,7);assert.equal(new Set(SOCRATES_EPISODES.map(e=>e.id)).size,7);for(const ep of SOCRATES_EPISODES){assert(ep.destination&&ep.title.length===2);assert.equal(ep.beats.length,3);assert(ep.beats.every(b=>b.length===2&&b.every(t=>t.length>30)));}
actor.dispose();actor.dispose();assert.equal(actor.group.children.length,0);
console.log('PASS: illustrated host geometry, owned disposal, animated/reduced-motion poses, unobstructed staging and seven bilingual episode drafts.');
