import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildPerspectiveStairs,measurePerspective} from '../src/escher-perspective.js';
import {buildEscherHouse} from '../src/escher-house.js';
const ctx=new Proxy({measureText:t=>({width:t.length*12})},{get:(o,k)=>o[k]||(()=>{})}),canvas=()=>({getContext:()=>ctx});
const model=buildEscherHouse(T,{canvas,loadTexture:()=>new T.Texture()}),stairs=buildPerspectiveStairs(T,model.group,{x:151.75,z:108});
assert.equal(stairs.paths.length,3);assert(stairs.joins.every(([a,b])=>a.distanceTo(b)>1),'The physical stair fragments remain disconnected');
const camera=new T.PerspectiveCamera(66,16/9,.08,650),look=()=>{camera.lookAt(new T.Vector3(stairs.focus.x,stairs.focus.y,stairs.focus.z));camera.updateProjectionMatrix();};
camera.position.set(stairs.viewpoint.x,stairs.viewpoint.y,stairs.viewpoint.z);look();const aligned=measurePerspective(T,stairs,camera);assert(aligned.aligned);assert(aligned.gap<1e-10,'Fragment endpoints meet in screen space from the intended eye position');
for(const offset of[-1.7,1.7]){camera.position.x=stairs.viewpoint.x+offset;look();const r=measurePerspective(T,stairs,camera);assert(!r.aligned);assert(r.gap>.015,'Side viewpoints expose the separate depths');}
camera.position.set(stairs.viewpoint.x,stairs.viewpoint.y,stairs.viewpoint.z);camera.lookAt(camera.position.clone().add(new T.Vector3(0,0,1)));assert(!measurePerspective(T,stairs,camera).aligned,'Looking away cannot solve the activity');
assert(model.gateBlocks(151.75,101));assert(!model.targets.includes(model.revealedPainting));model.setPassage(true,.5);assert(model.gateBlocks(151.75,101),'Collision remains until the shutters finish opening');model.setPassage(true,1);assert(!model.gateBlocks(151.75,101));assert(model.targets.includes(model.revealedPainting));assert(model.inside(151.75,98));assert(!model.colliders.some(c=>151.75>c.minX&&151.75<c.maxX&&101>c.minZ&&101<c.maxZ),'The opened centre passage is walkable');model.setPassage(false,0);assert(model.gateBlocks(151.75,101));assert(!model.targets.includes(model.revealedPainting));
stairs.dispose();model.dispose();console.log('PASS: physically separated stair fragments, exact perspective alignment, wrong-position/looking-away rejection, opening clearance, hidden Waterfall interaction and replay closure.');
