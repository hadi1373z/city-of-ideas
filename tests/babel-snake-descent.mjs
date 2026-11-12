import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {BABEL,entryHeight,surfaceAt,walkLibrary} from '../src/babel-library-model.js';
import {buildBabelSnakeStairs} from '../src/babel-snake-stairs.js';
import {buildBabelLibrary} from '../src/babel-library-scene.js';
import {validateBabelEntryGuards} from './babel-entry-guards.mjs';
import {validateBabelRadialContacts} from './babel-radial-contacts.mjs';
import {validateBabelMouthClearance,validateMouthCleanup} from './babel-mouth-clearance.mjs';
import {validateBabelVaultContacts,validateSpokeCleanup} from './babel-vault-contacts.mjs';
import {validateBabelPerimeter,validatePerimeterCleanup} from './babel-vault-perimeter.mjs';
import {validateBabelEntryReveals,validateRevealCleanup} from './babel-entry-reveals.mjs';
import {validateBabelEntryCheeks} from './babel-entry-cheeks.mjs';
import {validateBabelEntryBookcases,validateEntryLampCleanup} from './babel-entry-bookcases.mjs';
import {validateBabelAdapterProfiles} from './babel-adapter-profiles.mjs';
import {validateBabelThirdMouths,validateThirdMouthCleanup} from './babel-third-mouths.mjs';
const w={};vm.runInNewContext(await readFile(new URL('../src/gallery-spiral.js',import.meta.url),'utf8'),{window:w});const up=w.createGallerySpiral(T),f=BABEL.flight,l=BABEL.landing;
assert.equal(f.x,up.centerX);assert.equal(f.width,up.headWidth);assert.equal(f.z1,up.pointAt(0).z);assert.equal(f.z0,up.run);assert.deepEqual(BABEL.opening,{...up.opening});assert.equal(f.top,up.pointAt(0).y);assert.equal((f.z0-f.z1)/f.steps,up.tread);assert(Math.abs((f.top-f.bottom)/f.steps-up.rise)<.011);assert.equal(f.bottom,BABEL.levels[0].y);
const entryOwned=new Set(),entryBuffers=new Set(),entryReleased=new Map();
const entryT={...T,...Object.fromEntries(['MeshLambertMaterial','ShaderMaterial','BufferGeometry','CylinderGeometry'].map(key=>[key,class extends T[key]{constructor(...args){super(...args);entryOwned.add(this);}}]))};
const drawing=new T.Texture();let borrowedDisposals=0;drawing.addEventListener('dispose',()=>borrowedDisposals++);const landingMaterial=new T.MeshLambertMaterial({color:0x9c8965});let borrowedFloorDisposals=0;landingMaterial.addEventListener('dispose',()=>borrowedFloorDisposals++);const built=buildBabelSnakeStairs(entryT,{drawing,landingMaterial});assert.equal(built.landing.material,landingMaterial);assert.equal(l.minZ,-6.4);built.group.updateMatrixWorld(true);assert.equal(built.ramp.material.uniforms.reference.value,drawing);assert(built.ramp.userData.snakeDrawing);assert.equal(built.ramp.userData.stepCount,40);let draws=0;built.group.traverse(o=>{if(o.isMesh){draws++;assert(o.geometry.attributes.position.array.every(Number.isFinite));}});assert(draws<=4);
built.group.traverse(o=>{if(o.geometry)entryOwned.add(o.geometry);if(o.material&&o.material!==landingMaterial)entryOwned.add(o.material);if(o.isInstancedMesh)entryBuffers.add(o);});assert.equal(entryOwned.size,7);assert.equal(entryBuffers.size,2);for(const r of[...entryOwned,...entryBuffers])r.addEventListener('dispose',()=>entryReleased.set(r,(entryReleased.get(r)||0)+1));
for(let i=0;i<f.steps;i++){const z=f.z0-(i+.5)*up.tread,feet=entryHeight(f.x,z),hits=new T.Raycaster(new T.Vector3(f.x,feet+1,z),new T.Vector3(0,-1,0),0,1.01).intersectObject(built.ramp);assert(hits.length);assert(Math.abs(hits[0].point.y-feet)<1e-6);}
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),library=buildBabelLibrary(T,{canvas,drawing});library.group.updateMatrixWorld(true);for(let z=f.z0-.1;z>f.z1;z-=.12){const feet=entryHeight(f.x,z),hits=new T.Raycaster(new T.Vector3(f.x,feet+.02,z),new T.Vector3(0,1,0),0,2.1).intersectObject(library.group,true);assert(!hits.some(h=>Math.abs(h.face?.normal.y||h.face?.normal.z||0)>.8),'Two metres of clear headroom below the shared shaft');}
console.log('PASS measured Babel entry-guard brackets: '+JSON.stringify(await validateBabelEntryGuards(T,built,library)));
const radial=validateBabelRadialContacts(T,library);console.log('PASS factual Babel radial-flight contacts: '+JSON.stringify(radial));
console.log('PASS installed Babel mouth fitting: '+JSON.stringify(validateBabelMouthClearance(T,library)));console.log('PASS mouth ownership cleanup programs: '+validateMouthCleanup(T));
console.log('PASS Babel vault contacts and ceiling mounts: '+JSON.stringify(validateBabelVaultContacts(T,library)));console.log('PASS spoke mount cleanup programs: '+validateSpokeCleanup(T));
console.log('PASS fitted Babel base-floor perimeter: '+JSON.stringify(validateBabelPerimeter(T,library)));console.log('PASS perimeter cleanup programs: '+validatePerimeterCleanup(T));
console.log('PASS Babel entry reveal joins: '+JSON.stringify(validateBabelEntryReveals(T,library)));console.log('PASS entry reveal cleanup programs: '+validateRevealCleanup(T));
console.log('PASS factual Babel entry cheek/cap contacts: '+JSON.stringify(await validateBabelEntryCheeks(T,library)));
console.log('PASS original Babel case/lamp seats: '+JSON.stringify(await validateBabelEntryBookcases(T,library)));console.log('PASS entry lamp cleanup programs: '+validateEntryLampCleanup(T));
console.log('PASS Babel source-profile compatibility: '+JSON.stringify(validateBabelAdapterProfiles(T)));
console.log('PASS complete Babel radial-mouth fitting: '+JSON.stringify(validateBabelThirdMouths(T)));console.log('PASS complete-mouth cleanup programs: '+validateThirdMouthCleanup(T));
for(const offset of[-f.width/2+.4,0,f.width/2-.4]){let p={x:f.x+offset,z:f.z0,y:f.top+1.8};for(let z=f.z0-.01;z>=f.z1;z-=.06)walkLibrary(p,0,z-p.z);walkLibrary(p,0,f.z1-p.z);assert(Math.abs(p.y-1.8-f.bottom)<1e-6);for(let z=f.z1;z>l.minZ+.6;z-=.06)walkLibrary(p,0,z-p.z);for(let x=p.x;x<49;x+=.06)walkLibrary(p,x-p.x,0);assert(p.x>48.8,'The full-width flight reaches the original ring through its landing');assert.equal(surfaceAt(p.x,p.z,-8),-8);}
// The last aisle has a physical doorway through the shelf joinery, with the
// original catalogue and five terraces retained around it.
assert.equal(library.targets.filter(o=>o.userData.babelBook!==undefined).length,10);
for(const z of[-1.99,-1,0,1,1.99])for(const y of[-23.75,-23,-22,-21]){
 const hits=new T.Raycaster(new T.Vector3(9,y,z),new T.Vector3(1,0,0),0,5.2).intersectObject(library.group,true);
 assert.equal(hits.length,0,'Final shelf bays leave a four-metre clear doorway');
}
const innerBase=library.group.getObjectByName('Book-well base inside the through-gallery shaft'),outerBase=library.group.getObjectByName('Library base outside the open annular shaft'),overlook=library.group.getObjectByName('Library overlook · continuous first-terrace floor');
assert(innerBase&&outerBase&&overlook);assert.equal(overlook.material,innerBase.material,'The arrival overlook shares the terrace floor material');
for(let i=0;i<96;i++)for(const r of[14.4,16,17.6]){
 const a=i*Math.PI*2/96,x=Math.cos(a)*r,z=Math.sin(a)*r;
 const floorHits=new T.Raycaster(new T.Vector3(x,BABEL.base+.05,z),new T.Vector3(0,-1,0),0,.1).intersectObjects([innerBase,outerBase]);
 assert.equal(floorHits.length,0,'The entire descending annulus cuts through the old pit floor');
 const headHits=new T.Raycaster(new T.Vector3(x,BABEL.base-.3,z),new T.Vector3(0,1,0),0,2.1).intersectObject(library.group,true);
 assert.equal(headHits.length,0,'The old library has no geometry hanging into the through-gallery headroom');
}
for(const r of[12.8,18.3])assert(new T.Raycaster(new T.Vector3(r,BABEL.base+.05,0),new T.Vector3(0,-1,0),0,.1).intersectObjects([innerBase,outerBase]).length,'The book well and outside pit retain their bases');
// The central well reads as individual upright books all around a quiet centre.
const plinth=library.group.getObjectByName('Quiet circular reading plinth');assert(plinth);assert.equal(plinth.geometry.type,'CylinderGeometry');
const bookHeights=new Set();
for(let i=0;i<64;i++){
 const a=i*Math.PI*2/64,direction=new T.Vector3(Math.cos(a),0,Math.sin(a)),height=BABEL.base+.70;
 const foreEdge=new T.Raycaster(direction.clone().multiplyScalar(2.9).setY(height),direction,0,1.6).intersectObject(library.group,true);
 assert(foreEdge.length,'Every position in the circular arrangement has a real upright book');assert.equal(foreEdge[0].object.material.color.getHex(),0xe2d4b0,'Cream page fore-edges face the quiet reading centre');
 const spine=new T.Raycaster(direction.clone().multiplyScalar(4.5).setY(height),direction.clone().negate(),0,1.6).intersectObject(library.group,true);
 assert(spine.length);assert.notEqual(spine[0].object.material.color.getHex(),0xe2d4b0,'Leather spines face the surrounding library');
 const top=new T.Raycaster(direction.clone().multiplyScalar(3.65).setY(BABEL.base+2.4),new T.Vector3(0,-1,0),0,2.4).intersectObject(library.group,true)[0];
 assert(top);const h=top.point.y-BABEL.base;assert(h>1.2&&h<2.4,'Individual books stay below the surrounding terrace sightlines');bookHeights.add(h.toFixed(2));
 const gap=(i+.5)*Math.PI*2/64,gapDirection=new T.Vector3(Math.cos(gap),0,Math.sin(gap));
 assert.equal(new T.Raycaster(gapDirection.clone().multiplyScalar(2.9).setY(height),gapDirection,0,1.6).intersectObject(library.group,true).length,0,'Visible gaps separate the individual upright volumes');
}
assert(bookHeights.size>=8,'The circular book silhouettes vary in height');
const matrix=new T.Matrix4(),position=new T.Vector3(),corner=new T.Vector3();let centralPageBlocks=0;
library.group.traverse(o=>{if(!o.isInstancedMesh||o.geometry.type!=='BoxGeometry')return;for(let i=0;i<o.count;i++){
 o.getMatrixAt(i,matrix);position.setFromMatrixPosition(matrix);if(Math.hypot(position.x,position.z)>4.6||position.y<BABEL.base+.08||position.y>BABEL.base+2.4)continue;
 if(o.material.color.getHex()===0xe2d4b0)centralPageBlocks++;
 for(const x of[-.5,.5])for(const y of[-.5,.5])for(const z of[-.5,.5]){corner.set(x,y,z).applyMatrix4(matrix);assert(Math.hypot(corner.x,corner.z)<=4.6,'Central book geometry stays inside the terrace and shaft clearances');assert(corner.y<=BABEL.base+2.4,'No giant book blocks remain above the ring');}
}});assert.equal(centralPageBlocks,64,'Each upright volume has its own page block');
const resources=new Set(),disposalCounts=new Map(),glows=new Set();library.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of[o.material].flat().filter(Boolean)){resources.add(m);if(m.map)resources.add(m.map);if(m.isMeshBasicMaterial&&m.color.getHex()===0xffdf9a)glows.add(m);}});assert.equal(glows.size,1,'Stair lamps and reading globes share a single glow material');for(const r of resources)r.addEventListener('dispose',()=>disposalCounts.set(r,(disposalCounts.get(r)||0)+1));
const source=await readFile(new URL('../src/gallery.js',import.meta.url),'utf8');assert(source.includes('get snakeDrawing(){return gallerySnakeDrawing}'));assert(source.includes('gallerySnakeDrawing=snakeDrawing'));const scene=await readFile(new URL('../src/babel-library-scene.js',import.meta.url),'utf8');assert(!scene.includes('h.moveTo(-10.5,42)'));assert(!scene.includes('x<-10'));built.dispose();library.dispose();assert.equal(borrowedDisposals,0);assert.equal(borrowedFloorDisposals,0);for(const r of resources)assert.equal(disposalCounts.get(r),1,'Every owned render resource is disposed exactly once');drawing.dispose();landingMaterial.dispose();
built.dispose();for(const r of[...entryOwned,...entryBuffers])assert.equal(entryReleased.get(r),1,'Repeated entry cleanup releases only its seven resources and two buffers once');
radial.assertReleased();
console.log('PASS Babel snake descent: exact upper-head alignment and width, matching treads/rise, 40 real steps, borrowed snake texture, open shafts/headroom, clear final doorway, upright central book circle and reading plinth, shared floor and lamp material, owned-resource disposal, all-width descent and original-terrace landing');
