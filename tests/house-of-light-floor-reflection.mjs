import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildHouseOfLight} from '../src/house-of-light-scene.js';
import {LIGHT_HOUSE as H} from '../src/house-of-light-model.js';

let active=true;
const built=buildHouseOfLight(T,{canvasFactory:()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),mirrorActive:()=>active});
const f=built.floorReflection,scene=new T.Scene();scene.add(built.group);scene.updateMatrixWorld(true);
assert.equal(f.surface.material.transparent,true);
assert.equal(f.surface.material.depthWrite,false);
assert.equal(f.reflectedRods.count,61);
assert.equal(f.reflectedRods.geometry,built.rods.geometry);
assert.equal(f.reflectedRods.material,built.rods.material);
assert.equal(f.scene.children.length,1);
assert.equal(f.reflectedMobile.children.length,2,'Only the real rods and suspension enter the extra capture');
assert(!built.group.children.some(o=>o.name.includes('floor projection')),'The unrelated rainbow fan is removed');

const camera=new T.PerspectiveCamera(57,1.6,.06,1000),oldTarget={},oldClip=[];
let target=oldTarget,clearColour=new T.Color(.2,.3,.4),clearAlpha=1,scissorTest=true,captures=0,fail=false;
const viewport=new T.Vector4(7,9,900,600),scissor=new T.Vector4(2,3,800,500);
const renderer={autoClear:false,xr:{enabled:true},shadowMap:{autoUpdate:true},clippingPlanes:oldClip,localClippingEnabled:false,
 getRenderTarget:()=>target,setRenderTarget:v=>target=v,getViewport:v=>v.copy(viewport),setViewport:(...a)=>a[0]?.isVector4?viewport.copy(a[0]):viewport.set(...a),
 getScissor:v=>v.copy(scissor),setScissor:v=>scissor.copy(v),getScissorTest:()=>scissorTest,setScissorTest:v=>scissorTest=v,
 getClearColor:v=>v.copy(clearColour),getClearAlpha:()=>clearAlpha,setClearColor:(c,a)=>{clearColour.set(c);clearAlpha=a;},clear(){assert.equal(clearAlpha,0,'An isolated reflection clears to transparency, preserving the tiled floor');},
 render(capture,view){
  captures++;assert.equal(capture,f.scene);assert.equal(target,f.target);
  assert.equal(f.reflectedRods.instanceMatrix,built.rods.instanceMatrix);
  assert.equal(f.reflectedRods.instanceColor,built.rods.instanceColor);
  assert.deepEqual(f.reflectedMobile.matrix.elements,built.mobile.matrixWorld.elements,'Rotation and full world placement come directly from the real chandelier');
  const planeY=f.surface.getWorldPosition(new T.Vector3()).y;
  assert(Math.abs(view.position.y-(2*planeY-camera.position.y))<1e-9);
  const source=new T.Vector3(H.x+1,6,H.z-1),virtual=source.clone();virtual.y=2*planeY-source.y;
  const t=(planeY-camera.position.y)/(virtual.y-camera.position.y),floorHit=camera.position.clone().lerp(virtual,t);
  const a=source.clone().project(view),b=floorHit.project(view);
  assert(Math.abs(a.x-b.x)<1e-9&&Math.abs(a.y-b.y)<1e-9,'The floor sample meets the actual rod along an independently reflected viewing ray');
  assert(a.z>=-1&&a.z<=1,'The chandelier survives the horizontal oblique clip');
  const below=new T.Vector3(H.x,planeY-1,H.z).project(view);assert(below.z< -1,'Objects below the floor are clipped');
  assert.equal(renderer.clippingPlanes,oldClip);
  f.surface.onBeforeRender(renderer,scene,view);assert.equal(captures,expectedCapture,'Nested capture does not recurse');
  if(fail)throw Error('floor capture test');
 }
};
let expectedCapture=0;
function capture(){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);expectedCapture++;f.surface.onBeforeRender(renderer,scene,camera);assert.equal(captures,expectedCapture);assert.equal(target,oldTarget);assert.deepEqual(viewport.toArray(),[7,9,900,600]);assert.deepEqual(scissor.toArray(),[2,3,800,500]);assert.equal(clearAlpha,1);assert.deepEqual(clearColour.toArray(),[.2,.3,.4]);assert(renderer.xr.enabled&&renderer.shadowMap.autoUpdate&&scissorTest&&!renderer.autoClear&&f.surface.visible);}
for(const pose of[[7,10],[-6,9],[8,-8]]){
 camera.position.set(H.x+pose[0],1.93,H.z+pose[1]);camera.lookAt(H.x,0,H.z);
 for(const hue of[0,.31,.77])for(const rotation of[0,37,143]){built.update({hue,rotation});capture();}
}
const before=built.rods.instanceColor.array.slice();built.update({hue:.25});capture();assert(before.some((n,i)=>n!==f.reflectedRods.instanceColor.array[i]),'A hue change reaches the reflected rods');
built.update({playing:true,rotation:45});built.advance(.08);capture();assert(built.mobile.rotation.y>Math.PI/4,'Slow playback and manual scrubbing share the same reflected pose');
active=false;f.surface.onBeforeRender(renderer,scene,camera);assert.equal(captures,expectedCapture,'Away/hidden/underground capture gate is respected');active=true;
fail=true;expectedCapture++;assert.throws(()=>f.surface.onBeforeRender(renderer,scene,camera),/floor capture test/);assert.equal(target,oldTarget);assert.equal(clearAlpha,1);assert(f.surface.visible&&renderer.xr.enabled&&renderer.shadowMap.autoUpdate);
let borrowedGeometryDisposals=0,borrowedMaterialDisposals=0,targetDisposals=0;
built.rods.geometry.addEventListener('dispose',()=>borrowedGeometryDisposals++);built.rods.material.addEventListener('dispose',()=>borrowedMaterialDisposals++);f.target.addEventListener('dispose',()=>targetDisposals++);
f.dispose();f.dispose();assert.equal(targetDisposals,1);assert.equal(borrowedGeometryDisposals,0);assert.equal(borrowedMaterialDisposals,0);built.dispose();assert.equal(borrowedGeometryDisposals,1);assert.equal(borrowedMaterialDisposals,1);
console.log('PASS chandelier floor: real horizontal reflection,27 colour/rotation/view combinations, shared61-rod geometry/colours, live playback, selective two-object capture, transparent tile-preserving overlay, oblique clipping and success/error/cleanup restoration.');
