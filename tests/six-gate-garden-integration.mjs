import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {GARDEN_ROUTES,GARDEN_FOOTPRINTS,GARDEN_COLUMNS,gardenTreeClear} from '../src/six-gate-garden-model.js';
import {urbanRoutes,urbanBuildingFootprints,urbanPlanting,HONEYCOMB_CITY,streetTreeClear,honeycombInputs} from '../src/city-urban-plan-model.js';
import {buildCityUrbanPlan} from '../src/city-urban-plan-scene.js';
import {footprintBlocked} from '../src/honeycomb-city-model.js';
import {ESCHER_PAVILION,pavilionFootprint} from '../src/escher-pavilion-model.js';
const urban=buildCityUrbanPlan(T,{naturalTrees:null}),routes=urbanRoutes();
assert(urban.garden?.group.parent===urban.group,'Garden mounts once in the actual upper coast root and follows its culling');
for(const route of GARDEN_ROUTES)assert.deepEqual(routes.find(r=>r.id===route.id),route,'Maps/paving/wall openings share every path coordinate');
for(const p of GARDEN_FOOTPRINTS)assert.deepEqual(urbanBuildingFootprints().find(f=>f.id===p.id),p,'Map and planting carry actual garden outlines');
assert(honeycombInputs().wallFootprints.every(p=>p.walkThrough));
assert(honeycombInputs().footprints.every(p=>!p.walkThrough),'Arcade roofs cannot delete the real streets below them');
let samples=0;
for(const route of GARDEN_ROUTES)for(let j=1;j<route.points.length;j++){
 const a=route.points[j-1],b=route.points[j],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),steps=Math.ceil(length/.4);
 for(let i=0;i<=steps;i++)for(const side of[-1,0,1]){
  const offset=side*(route.width/2-.55),x=a[0]+dx*i/steps-dz/length*offset,z=a[1]+dz*i/steps+dx/length*offset;
  assert(urban.canStand(x,z),`Combined garden wall/furniture/tree blocks ${route.id} at ${x},${z}`);samples++;
 }
}
for(const c of GARDEN_COLUMNS){assert(!urban.canStand(c.x,c.z),'Every real column has a collider');assert(urban.canStand(c.x,c.z,-40),'Garden columns do not become invisible underground barriers');assert(!streetTreeClear(c.x,c.z,3.2));}
for(const tree of urbanPlanting())assert(gardenTreeClear(tree.x,tree.z,tree.crownRadius||3),'All real street crowns clear the new roofs and door routes');
assert(HONEYCOMB_CITY.connected);
const centralCells=HONEYCOMB_CITY.cells.filter(c=>Math.max(Math.abs(c.q),Math.abs(c.r),Math.abs(c.q+c.r))<=1);
for(const wall of HONEYCOMB_CITY.walls){const x=(wall.a[0]+wall.b[0])/2,z=(wall.a[1]+wall.b[1])/2;assert(!centralCells.some(c=>c.vertices.every((a,i)=>{const b=c.vertices[(i+1)%6];return(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0])>=-1e-7;})),'No leftover honeycomb wall divides the approved open garden precinct');}
assert(HONEYCOMB_CITY.walls.length>0,'Outer city courts retain their separate existing walls');
const escher=pavilionFootprint();
for(const p of[[ESCHER_PAVILION.x,ESCHER_PAVILION.z],[228,110],[228,99]])assert(footprintBlocked(...p,[escher]),'Concave pavilion, rear link and fixed stair annex all reserve their real interior');
assert(!footprintBlocked(224,110,[escher]),'The lawn beside the narrow link stays outside its true outline');
let draws=0;urban.group.traverse(o=>{if(o.isMesh)draws++;});assert(draws<=15,'Garden adds four architecture and two continuous paving draws to the existing nine');
urban.dispose();assert.equal(urban.group.children.length,0);
console.log(`PASS Six Gate Garden live integration: ${samples} supported-width route samples clear actual court walls, columns and planting; roof/map authority, height gates and cleanup`);
