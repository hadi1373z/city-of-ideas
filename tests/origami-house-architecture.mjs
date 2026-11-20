import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildOrigamiArchitecture} from '../src/origami-house-architecture.js';
const a=buildOrigamiArchitecture(T);a.group.updateWorldMatrix(true,true);
const ray=(x,z,objects)=>new T.Raycaster(new T.Vector3(x,9,z),new T.Vector3(0,-1,0)).intersectObjects(objects,true);
for(const z of[-4.05,2.3])for(const x of[-7.4,-2.5,2.5,7.4]){assert.equal(ray(x,z,a.opaque).length,0,'Daylight opening has no opaque roof behind it');assert(ray(x,z,a.panes).length,'Every daylight opening has an actual glass pane');}
for(const z of[-7,-1,5])for(const x of[-7.4,-2.5,2.5,7.4])assert(ray(x,z,a.opaque).length,'Roof plates remain solid between daylight bands');
// Arbitrary probes across the usable rectangle must hit the complete crease floor.
for(let x=-8.8;x<8.8;x+=.47)for(let z=-7.8;z<7.8;z+=.53){const hits=ray(x,z,[a.floor]);assert(hits.length,'No uncovered floor patch');assert(Math.abs(hits[0].point.y-.006)<1e-6);assert(hits[0].face.normal.y>.999);}
// Street-facing entrance has solid real folded panels and clear walking height.
for(const x of[-2,-1,0,1,2])for(const z of[9,9.5,10]){const hits=ray(x,z,[a.canopy]);assert(hits.length,'The portico covers the approach');assert(hits[0].point.y>3.45,'Full headroom beneath the real folded entrance');}
for(const p of a.posts){assert(Math.abs(p.x)>2.5,'Posts remain outside the four-metre approach');assert(p.z>8&&p.z<11.2);}
let draws=0;a.group.traverse(o=>{if(o.isMesh||o.isLine)draws++;});assert(draws<=28,'Keep daylight architecture within its small draw budget');a.dispose();assert.equal(a.group.children.length,0);
console.log('PASS Origami daylight architecture: actual glazed roof openings, supported closed plates, complete correctly oriented flat crease floor, bounded draws and scoped disposal.');
