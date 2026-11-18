import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildMakersCity} from '../src/city-source-assets/home-tools/makers-city-scene.js';
import {MAKERS_SITE as S,MAKERS_ROOFS,MAKERS_ACCESS,MAKERS_DOOR_PATHS} from '../src/makers-site.js';
import {HONEYCOMB_CITY,streetTreeClear,urbanBuildingFootprints} from '../src/city-urban-plan-model.js';
import {pointSegmentDistance} from '../src/honeycomb-city-model.js';
const cell=HONEYCOMB_CITY.cells.find(c=>c.q===2&&c.r===-1),ctx=new Proxy({measureText:t=>({width:t.length*10})},{get:(o,k)=>o[k]??(()=>{})});
globalThis.document={createElement:()=>({getContext:()=>ctx})};
const built=buildMakersCity(T);built.group.position.set(S.x,S.y,S.z);built.group.updateMatrixWorld(true);
for(const h of built.houses){const roof=h.group.children.find(o=>o.name===h.name+' roof');assert(roof);const bounds=new T.Box3().setFromObject(roof);for(const x of[bounds.min.x,bounds.max.x])for(const z of[bounds.min.z,bounds.max.z]){for(let i=0;i<6;i++){const a=cell.vertices[i],b=cell.vertices[(i+1)%6];assert((b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0])>0,'Every real roof corner is inside one hexagon');assert(pointSegmentDistance(x,z,a,b)>8,'Roofs clear the surrounding streets and walls');}assert(!streetTreeClear(x,z),'Tree planting respects the moved roofs');}
 const p={x:S.x+h.entry.x,z:S.z+h.entry.z};assert(HONEYCOMB_CITY.walls.every(w=>pointSegmentDistance(p.x,p.z,w.a,w.b)>3),'Actual source doors remain clear of enclosing walls');assert(MAKERS_DOOR_PATHS.some(r=>r.points.some(q=>Math.hypot(q[0]-p.x,q[1]-p.z)<.01)));}
assert.equal(MAKERS_ROOFS.length,3);assert.equal(urbanBuildingFootprints().filter(h=>h.id.startsWith('makers-')).length,3);assert(MAKERS_ACCESS.points.some(p=>cell.vertices.some(v=>Math.hypot(v[0]-p[0],v[1]-p[1])<1e-6)),'Courtyard access meets an exact grid vertex');
assert.equal(built.houses.length,3);built.dispose();console.log('PASS Makers relocation: complete source courtyard, three actual roofs inside hex(2,-1), unobstructed entries, real grid access and crown protection');
