import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildBabelLibrary} from '../src/babel-library-scene.js';
import {BABEL,stairs} from '../src/babel-library-model.js';
import {buildTwoFaceGallery} from '../src/two-face-gallery-scene.js';
import {buildWorldCylinder} from '../src/world-cylinder-scene.js';
import {buildEscherDepth} from '../src/escher-depth-scene.js';
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),library=buildBabelLibrary(T,{canvas}),gallery=buildTwoFaceGallery(T),world=buildWorldCylinder(T),museum=buildEscherDepth(T,{canvas,loadTexture:null});
for(const b of[library,gallery,world,museum])b.group.updateMatrixWorld(true);
function floors(objects,x,z,y){return new T.Raycaster(new T.Vector3(x,y+.04,z),new T.Vector3(0,-1,0),0,.08).intersectObjects(objects,true).filter(h=>Math.abs(h.point.y-y)<1e-5);}
for(const x of[9.13,10.27,11.81,12.73,13.19,16.23])for(const z of[-1.31,.37,1.14])assert.equal(floors([library.group,gallery.walking],x,z,-24).length,1,'Babel bridge has one floor owner');
for(const s of stairs){const r=s.inner+.213,offset=.373,x=Math.cos(s.a)*r-Math.sin(s.a)*offset,z=Math.sin(s.a)*r+Math.cos(s.a)*offset;assert.equal(floors([library.group],x,z,s.bottom).length,1,'Final radial tread is supplied once by its landing');}
for(const [x,z]of[[21.83,.37],[22.17,.37],[69.23,.31],[70.73,114.69],[133.27,114.37],[134.21,115.31],[134.61,115.31],[135.73,115.31]])assert.equal(floors([world.tunnel,museum.interior||museum.group,gallery.walking],x,z,-40).length,1,'Tunnel corners and museum threshold have one floor owner');
for(const [x,z]of[[69.23,.31],[70.73,114.69]])assert.equal(floors([world.tunnel],x,z,-34.875).length,1,'Tunnel ceilings also meet without duplicate faces');
const f=BABEL.flight,z=4,hits=new T.Raycaster(new T.Vector3(f.x,0,z),new T.Vector3(0,1,0),0,5).intersectObject(library.group,true);assert(hits.length);assert.equal(hits[0].object.material.color.getHex(),0x3e3027,'The visible underside is finished oak');assert(Math.abs(hits[0].point.y-(f.top+8*z/f.z0-.52))<.2);
for(const b of[library,gallery,world,museum])b.dispose();console.log('PASS surface joins: one floor at Babel bridge, four radial landings, tunnel corners and Escher doorway; single ceiling faces and real oak stair soffit.');
