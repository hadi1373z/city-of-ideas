import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {BABEL} from '../src/babel-library-model.js';
import {buildBabelLibrary} from '../src/babel-library-scene.js';

// Use the actual source ring builder and its actual entrance rotation. A
// synthetic plane would miss mismatches in the rectangular physical cuts.
const source=readFileSync(new URL('../src/gallery.js',import.meta.url),'utf8'),window={};vm.runInNewContext(readFileSync(new URL('../src/gallery-spiral.js',import.meta.url),'utf8'),{window});const layout={};vm.runInNewContext(readFileSync(new URL('../src/babel-layout.js',import.meta.url),'utf8'),{globalThis:layout});window.CITY_BABEL_LAYOUT=layout.CITY_BABEL_LAYOUT;
const route=window.createGallerySpiral(T),scene=new T.Scene(),floorMaterial=new T.MeshLambertMaterial(),native=[];
const mesh=(g,m,x,y,z)=>{const n=new T.Mesh(g,m);n.position.set(x,y,z);native.push(n);scene.add(n);return n;},start=source.indexOf('function galleryRing('),end=source.indexOf('function galleryCeilingArc(',start);
new Function('THREE','outer','inner','window','gallerySpiral','mesh','mainBuildingTargets','material',source.slice(start,end)+';for(let f=0;f<5;f++){galleryRing(f*8,material,f,.35,f===4?15.5:28);galleryRing(f*8+.37,material,f,.025,f===4?15.5:28);}') (T,58,28,window,route,mesh,[],floorMaterial);
for(const n of native)n.applyMatrix4(new T.Matrix4().makeRotationY(Math.PI/2));const texture=new T.Texture(),built=route.build(scene,{drawing:texture}),canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),babel=buildBabelLibrary(T,{canvas});scene.add(babel.group);scene.updateMatrixWorld(true);
const near=(a,b,e=1e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`),solids=[...native,built.ramp,babel.group];let joins=0,headroom=0,soffits=0;
function floor(x,z,y,label){const hits=new T.Raycaster(new T.Vector3(x,y+.03,z),new T.Vector3(0,-1,0),0,.08).intersectObjects(solids,true).filter(h=>Math.abs(h.point.y-y)<1e-5);assert.equal(hits.length,1,label+' at '+x+','+z+','+y+' must have exactly one real support surface');near(hits[0].point.y,y);joins++;}
const widths=[-route.width/2+.33,0,route.width/2-.33];
for(let f=0;f<=4;f++){
 const y=route.base+f*8;
 for(const x of widths.map(w=>route.centerX+w))for(const z of(f===0?[11.201,11.217,11.249,11.271,11.279,11.291]:[11.19,11.201,11.217,11.249,11.271,11.279,11.291]))floor(x,z,y,'Final tread/80mm landing joint on floor '+f);
 if(f===0)for(const x of widths.map(w=>route.centerX+w))floor(x,11.19,BABEL.flight.top-(BABEL.flight.top-BABEL.flight.bottom)/BABEL.flight.steps,'Unchanged first Babel tread below the ground join');
 if(f<4)for(const x of widths.map(w=>route.centerX+w))for(const z of[-.091,-.079,-.061,-.033,-.009])floor(x,z,y,'First riser/floor joint on floor '+f);
 for(const x of[route.opening.minX+.013,route.opening.maxX-.013])for(const z of[.317,2.131,4.731,4.813,7.191,10.731])floor(x,z,y,'Side of the unchanged stair cut on floor '+f);
}
for(let f=0;f<4;f++)for(let i=0;i<route.steps;i++)for(const w of widths){
 const p=route.pointAt(route.starts[f]+(i+.5)*route.tread);p.x+=w;const up=new T.Raycaster(new T.Vector3(p.x,p.y+.01,p.z),new T.Vector3(0,1,0),0,2.19).intersectObjects(solids,true);assert.equal(up.length,0,'Closing a joint must retain2.2m headroom on every existing tread');headroom++;
 // Each missing vertical underside return is below the next bottom panel.
 if(i<route.steps-1){const x=route.startX-(i+1)*route.tread,y=route.base+f*8+i*route.rise-.08,from=built.group.localToWorld(new T.Vector3(x-.05,y,w)),direction=new T.Vector3(1,0,0).transformDirection(built.group.matrixWorld),hit=new T.Raycaster(from,direction,0,.08).intersectObject(built.ramp,false);assert(hit.length,'The lower panels must have an actual closed vertical soffit connector');near(hit[0].distance,.05);soffits++;}
}
for(let f=0;f<4;f++)for(const w of widths){const p=built.group.localToWorld(new T.Vector3(route.startX+.05,route.base+f*8-.09,w)),d=new T.Vector3(-1,0,0).transformDirection(built.group.matrixWorld),hits=new T.Raycaster(p,d,0,.08).intersectObject(built.ramp,false);assert(hits.length,'The first underside must meet its floor-facing end cap');soffits++;}
for(let i=0;i<BABEL.flight.steps;i++)for(const w of widths){const f=BABEL.flight,z=f.z0-(i+.5)*(f.z0-f.z1)/f.steps,y=f.top-(i+1)*(f.top-f.bottom)/f.steps,hits=new T.Raycaster(new T.Vector3(f.x+w,y+.01,z),new T.Vector3(0,1,0),0,2.19).intersectObjects(solids,true);assert.equal(hits.length,0,'The repaired ground threshold must preserve the real Babel descent headroom');headroom++;}
// Each exposed underside boundary is sampled as both a horizontal panel and
// a vertical return, including the two end caps. All original160 top treads
// remain supplied by the unchanged route model and its existing ray suite.
for(let f=0;f<4;f++)for(let i=0;i<route.steps;i++)for(const w of widths){const y=route.base+f*8+i*route.rise-.18,from=built.group.localToWorld(new T.Vector3(route.startX-(i+.5)*route.tread,y-.04,w)),d=new T.Vector3(0,1,0).transformDirection(built.group.matrixWorld),hits=new T.Raycaster(from,d,0,.08).intersectObject(built.ramp,false);assert(hits.length,'The actual underside has no open bottom panel');near(hits[0].distance,.04);soffits++;}
for(let f=0;f<4;f++)for(let i=0;i<route.steps;i++)for(const side of[-1,1]){const from=built.group.localToWorld(new T.Vector3(route.startX-(i+.5)*route.tread,route.base+f*8+i*route.rise+.05,side*(route.width/2+.05))),d=new T.Vector3(0,0,-side).transformDirection(built.group.matrixWorld),hits=new T.Raycaster(from,d,0,.08).intersectObject(built.ramp,false);assert(hits.length,'The real one-sided stair cheek must face outward, rather than disappear from the gallery');near(hits[0].distance,.05);soffits++;}
assert.equal(built.ramp.userData.stepCount,160);assert.equal(built.ramp.userData.landingJoins,5);near(route.opening.maxZ,route.run+.08,1e-12);assert.equal(route.opening.minZ,-.08);assert.equal(route.width,route.headWidth);assert(built.ramp.geometry.attributes.position.array.every(Number.isFinite));assert(built.ramp.geometry.attributes.normal.array.every(Number.isFinite));
let textureDisposals=0,geometryDisposals=0;texture.addEventListener('dispose',()=>textureDisposals++);built.ramp.geometry.addEventListener('dispose',()=>geometryDisposals++);built.dispose();assert.equal(geometryDisposals,1);assert.equal(textureDisposals,0,'The shared floor drawing remains borrowed');babel.dispose();for(const n of native)n.geometry.dispose();floorMaterial.dispose();texture.dispose();
console.log(`PASS actual gallery stair joins: ${joins} single-owner support rays across all five source floor cuts and Babel, ${soffits} closed underside/end rays, ${headroom} clear-headroom probes,160 unchanged treads and owned cleanup`);
