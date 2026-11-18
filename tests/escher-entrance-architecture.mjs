import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildEscherHouse} from '../src/escher-house.js';
import {buildPerspectiveStairs,measurePerspective} from '../src/escher-perspective.js';
const ctx=new Proxy({},{get:(o,k)=>o[k]||(()=>{})}),canvas=()=>({getContext:()=>ctx});
const house=buildEscherHouse(T,{x:228,z:115,canvas,loadTexture:()=>new T.Texture()});
assert.equal(house.targets.length,3,'The large entrance name sign is removed; the three visible original prints remain interactive');
house.group.updateWorldMatrix(true,true);
const ray=new T.Raycaster(),v=(x,y,z)=>new T.Vector3(x,y,z),a=house.architecture;
// Real rays check the complete walking floor and the formerly open sky slots.
for(let x=-3.7;x<=3.7;x+=.37)for(let z=-6.6;z<=6.6;z+=.55){
 ray.set(v(228+x,2,115+z),v(0,1,0));const roof=ray.intersectObject(a.vault);assert(roof.length,'Roof must close every former beam slot');assert(roof[0].point.y>4.94,'Vault clears the old headroom');
 ray.set(v(228+x,1,115+z),v(0,-1,0));assert(ray.intersectObject(a.floor).length,'Tiling covers the full walkable floor');
}
for(const side of[-1,1])for(const y of[4.8,4.98])for(const z of[-6,0,6]){
 ray.set(v(228,y+.13,115+z),v(side,0,0));assert(ray.intersectObject(a.group,true).length,'Spring line is sealed even from a grazing view');
}
// The replacement must leave both physical doorways and the projection intact.
ray.set(v(228,1.93,124),v(0,0,-1));assert.equal(ray.intersectObject(a.group,true).length,0,'Architecture does not seal the entrance or rear doorway');
const stairs=buildPerspectiveStairs(T,house.group,{x:228,z:115}),camera=new T.PerspectiveCamera(66,16/9,.08,650);
camera.position.set(stairs.viewpoint.x,stairs.viewpoint.y,stairs.viewpoint.z);camera.lookAt(v(stairs.focus.x,stairs.focus.y,stairs.focus.z));assert(measurePerspective(T,stairs,camera).aligned);
house.setPassage(true);assert(!house.gateBlocks(228,108));assert.deepEqual(house.paintings.map(p=>p.userData.escherWork),['relativity','drawing-hands','ascending-descending','waterfall']);
assert(house.routePanel.position.z>-7,'Museum route is visible before the puzzle gate');
assert.equal(a.floor.geometry.groups.length,3);assert.equal(a.vault.geometry.groups.length,3);
for(const mesh of[a.floor,a.vault])assert([...mesh.geometry.attributes.position.array].every(Number.isFinite));
stairs.dispose();house.dispose();console.log('PASS: continuous vaulted roof and rhomb floor, doorway clearance, unchanged perspective alignment, four original prints and visible museum wayfinding.');
