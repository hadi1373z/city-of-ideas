import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {BABEL,stairs,entryHeight} from '../src/babel-library-model.js';
import {UPPER,pointAt} from '../src/two-face-gallery-model.js';
import {BABEL_THERMAL_VAULT as C,thermalVaultHeightAt,buildBabelThermalVault} from '../src/babel-thermal-vault.js';
import {BABEL_READING_BOOK as BOOK} from '../src/babel-reading-book-model.js';
import {buildBabelLibrary} from '../src/babel-library-scene.js';
const near=(a,b,e=1e-4)=>assert(Math.abs(a-b)<e,`${a} differs from ${b}`),b=buildBabelThermalVault(T);b.group.updateMatrixWorld(true);
assert.equal(C.mouthRadius,21);assert.equal(C.mouthY,-.55);near(C.tipY,BOOK.contact.y);assert(C.mouthRadius>C.innerRadius&&C.innerRadius>C.fluidRadius);assert(C.fluidTopY<C.mouthY);
// The tip touches the actual tilted page surfaces at their central gutter,
// not merely a hard-coded height or the decorative well's floor.
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),library=buildBabelLibrary(T,{canvas});library.group.updateMatrixWorld(true);
const leaves=[];library.group.traverse(o=>{if(o.name==='Open book on the central reading plinth')leaves.push(o);});assert.equal(leaves.length,2);
const bookHits=new T.Raycaster(new T.Vector3(BOOK.contact.x,BOOK.contact.y+1,BOOK.contact.z),new T.Vector3(0,-1,0),0,2).intersectObjects(leaves);
assert(bookHits.length,'The shared contact point must lie on the real open book');near(bookHits[0].point.y,C.tipY,1e-5);near(BOOK.contact.x,0);near(BOOK.contact.z,0);
b.glass.geometry.computeBoundingBox();near(b.glass.geometry.boundingBox.min.y,bookHits[0].point.y,1e-5);
for(const x of[-.50,-.255,-.001,0,.001,.255,.50])for(const z of[-.35,0,.35]){const hits=new T.Raycaster(new T.Vector3(x,BOOK.contact.y+1,z),new T.Vector3(0,-1,0),0,2).intersectObjects(leaves);assert(hits.length);assert(thermalVaultHeightAt(Math.hypot(x,z))>=hits[0].point.y-1e-5,'The conical glass may touch the gutter but must not penetrate either page');}
library.dispose();
assert.equal(thermalVaultHeightAt(22),null);assert.equal(thermalVaultHeightAt(NaN),null);near(thermalVaultHeightAt(0),C.tipY);near(thermalVaultHeightAt(21),C.mouthY);
const source=await readFile(new URL('../src/gallery.js',import.meta.url),'utf8');assert(source.includes("volcano.name='central-volcano'"));assert(source.includes('scene.add(volcano)'));assert(source.includes('volcanoRadius:21'),'The reservoir mouth follows the existing central volcano, not a remote mountain');
let draws=0,triangles=0,points=0;const resources=new Set();b.group.traverse(o=>{if(o.isPoints)points++;if(o.isMesh){draws++;assert(o.geometry.attributes.position.array.every(Number.isFinite));assert(o.geometry.attributes.normal.array.every(Number.isFinite));triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);resources.add(o.geometry);resources.add(o.material);}if(o.isInstancedMesh)assert(o.instanceMatrix.array.every(Number.isFinite));});assert.equal(points,0);assert(draws<=8);assert(triangles<9000);assert.equal(b.counts.drawMeshes,draws);assert.equal(b.counts.triangles,triangles);
assert(b.glassMaterial.transparent&&b.glassMaterial.opacity<.25&&!b.glassMaterial.depthWrite);assert(b.fluidMaterial.transparent&&!b.fluidMaterial.depthWrite);assert(!b.fluidMaterial.uniforms.map,'Flow needs no canvas, image or external texture');
near(b.fluidMaterial.uniforms.fluidBottom.value,C.fluidTipY);near(b.fluidMaterial.uniforms.fluidHeight.value,C.fluidTopY-C.fluidTipY);
const normalizedFluidHeight=y=>(y-b.fluidMaterial.uniforms.fluidBottom.value)/b.fluidMaterial.uniforms.fluidHeight.value;near(normalizedFluidHeight(C.fluidTipY),0);near(normalizedFluidHeight(C.fluidTopY),1);
assert(b.contactGlow,'The meeting point should be visibly lit rather than leaving a dark gap');near(b.contactGlow.position.x,BOOK.contact.x);near(b.contactGlow.position.z,BOOK.contact.z);assert(b.contactGlow.position.y>C.tipY&&b.contactGlow.position.y<C.tipY+.01,'The static glow sits on the book seam, not suspended above it');assert(b.contactGlow.geometry.parameters.radius<=.21,'The contact glow remains local to the middle of the book');
// Ray the real lower glass skin: the wide mouth narrows continuously to the
// centre above the library. A short collar physically meets the outer ceiling.
for(const r of[.2,3.65,9,15,20])for(let i=0;i<24;i++){
 const a=(i+.37)*Math.PI*2/24,x=Math.cos(a)*r,z=Math.sin(a)*r,hits=new T.Raycaster(new T.Vector3(x,-27,z),new T.Vector3(0,1,0),0,30).intersectObject(b.glass);
 assert(hits.length);near(hits[0].point.y,thermalVaultHeightAt(r),.005);
}
for(let i=0;i<16;i++){const a=(i+.23)*Math.PI*2/16,direction=new T.Vector3(Math.cos(a),0,Math.sin(a));const hits=new T.Raycaster(direction.clone().multiplyScalar(22).setY(-2.8),direction.clone().negate(),0,2).intersectObject(b.collar);assert(hits.length);near(Math.hypot(hits[0].point.x,hits[0].point.z),21,.005);}
for(let i=0;i<b.fluid.geometry.attributes.position.count;i++){
 const p=new T.Vector3().fromBufferAttribute(b.fluid.geometry.attributes.position,i),r=Math.hypot(p.x,p.z),innerY=C.innerTipY+(C.mouthY-C.innerTipY)*r/C.innerRadius;
 assert(p.y>=innerY+.07,'Fluid remains inside the inner glass wall');assert(p.y<C.mouthY-.15&&r<C.innerRadius-.30,'A visible glass lip and air gap contain the fluid');
 assert(normalizedFluidHeight(p.y)>-.0001&&normalizedFluidHeight(p.y)<1.0001,'The fluid pattern spans the extended physical vessel without its old hard-coded height');
}
// Probe every terrace's physical floor boundaries, all original radial and
// gallery-entry treads at both edges, the overlook, shelves and deep coils.
let samples=0,minHitClearance=Infinity;function clear(x,z,y,label){const origin=new T.Vector3(x,y+.015,z),hits=new T.Raycaster(origin,new T.Vector3(0,1,0),0,2.2-.015).intersectObject(b.group,true);assert.equal(hits.length,0,`${label} lacks 2.2 metres headroom at ${x},${z},${y}`);samples++;const above=new T.Raycaster(origin,new T.Vector3(0,1,0),0,60).intersectObject(b.group,true);if(above.length)minHitClearance=Math.min(minHitClearance,above[0].point.y-y);}
for(const l of BABEL.levels)for(const r of[l.r-3.8,l.r-3.35,l.r,l.r+3.25,l.r+4.4])for(let i=0;i<96;i++){const a=(i+.13)*Math.PI*2/96;clear(Math.cos(a)*r,Math.sin(a)*r,l.y,'Terrace '+l.id);}
for(const s of stairs)for(let i=0;i<s.steps;i++)for(const side of[-s.width/2,0,s.width/2]){const r=s.outer-(i+.5)*(s.outer-s.inner)/s.steps,x=Math.cos(s.a)*r-Math.sin(s.a)*side,z=Math.sin(s.a)*r+Math.cos(s.a)*side;clear(x,z,s.top-(i+1)*(s.top-s.bottom)/s.steps,'Original radial tread');}
const f=BABEL.flight;assert(f.x-f.width/2>C.mouthRadius,'The entry stair remains entirely outside the glass cone');for(let i=0;i<f.steps;i++)for(const side of[-f.width/2,0,f.width/2]){const z=f.z0-(i+.5)*(f.z0-f.z1)/f.steps;clear(f.x+side,z,entryHeight(f.x,z),'Gallery entry tread');}
for(let i=0;i<=16;i++)for(const z of[BABEL.landing.minZ,-3,0])clear(BABEL.landing.minX+(45.2-BABEL.landing.minX)*i/16,z,BABEL.landing.y,'Entry overlook');
for(const l of BABEL.levels)for(let i=0;i<96;i++)for(const rad of[-.55,.55]){const a=(i+.31)*Math.PI*2/96,r=l.r+4+rad;clear(Math.cos(a)*r,Math.sin(a)*r,l.y+3.8,'Shelf top');}
for(let i=0;i<UPPER.steps;i++)for(const radius of[14.4,16,17.6]){const q=pointAt((i+.5)*UPPER.endTheta/UPPER.steps,'upper',{radius});clear(q.x,q.z,q.y,'Deep gallery tread');}
// The inner ornamental plinth is deliberately occupied by the book/cone
// contact. Every real walking surface above still has ample clear headroom.
assert(minHitClearance>4.5);assert(samples>4000);
b.update(12.5);assert.equal(b.fluidMaterial.uniforms.time.value,12.5);b.update(18,true);assert.equal(b.fluidMaterial.uniforms.time.value,0);b.update(NaN);assert.equal(b.fluidMaterial.uniforms.time.value,0);assert.equal(b.group.children.filter(o=>o.isLight).length,0,'The reservoir adds no per-frame lights');
const disposals=new Map();for(const r of resources)r.addEventListener('dispose',()=>disposals.set(r,(disposals.get(r)||0)+1));b.dispose();b.dispose();for(const r of resources)assert.equal(disposals.get(r),1,'Owned render resources dispose exactly once');assert.equal(b.group.children.length,0);b.update(99);assert.equal(b.fluidMaterial.uniforms.time.value,0);
console.log(`PASS Babel thermal vault: closed r21 inverted glass cone touches actual central book seam, no page penetration, contained canvasless amber flow, ${samples} headroom probes, ${draws} draws/${triangles} triangles, reduced motion and owned cleanup`);
