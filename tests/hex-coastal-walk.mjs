import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {HEX_COAST_WALK,COAST_PROMENADE_WALK,ISLAND_ROUTES,SHORE,CITY_ISLAND} from '../src/island-layout.js';
import {COAST_PATHS,HOUSE_ORIGAMI} from '../src/origami-house-math.js';
import {HONEYCOMB_CITY,urbanRoutes} from '../src/city-urban-plan-model.js';
import {buildCityCoast} from '../src/coastal-city-scene.js';
import {COAST_WALK} from '../src/coastal-map-data.js';
const near=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<1e-6;
for(let i=1;i<HEX_COAST_WALK.length;i++){const a=HEX_COAST_WALK[i-1],b=HEX_COAST_WALK[i];assert([...HONEYCOMB_CITY.edges,...HONEYCOMB_CITY.coastLinks].some(e=>near(e.points[0],a)&&near(e.points[1],b)||near(e.points[1],a)&&near(e.points[0],b)),'The ocean walk follows an actual generated hex edge or the existing east coast gate');}
assert.equal(ISLAND_ROUTES.length,1);const dock=ISLAND_ROUTES[0];assert.equal(dock.id,'paper-boat-dock');assert.equal(dock.width,6);assert(Math.hypot(dock.points[1][0]-dock.points[0][0],dock.points[1][1]-dock.points[0][1])<30,'Only a short beach approach remains, never a long cross-cell road');assert.deepEqual(dock.points.at(-1),[SHORE.x,SHORE.z]);assert.deepEqual(HOUSE_ORIGAMI.entry,{x:229,z:92,y:.13,yaw:0,pitch:.06});
assert(COAST_PATHS.some(r=>r.id==='paper-boat-dock'&&r.width===6));assert(urbanRoutes().some(r=>r.id==='paper-boat-dock'&&r.width===6),'The real composed renderer keeps the source dock width');
for(const r of urbanRoutes())for(let i=1;i<r.points.length;i++){const a=r.points[i-1],b=r.points[i];assert(!(Math.abs(a[1]-76)<1e-6&&Math.abs(b[1]-76)<1e-6&&Math.abs(a[0]-b[0])>90),'No source owner reintroduces the long old z76 road');}
const coast=buildCityCoast(T,{naturalTrees:null});coast.group.updateMatrixWorld(true);const paving=coast.group.children.filter(o=>o.isMesh&&o.name.endsWith('paving batch')),ray=(x,z,objects=paving)=>new T.Raycaster(new T.Vector3(x,1,z),new T.Vector3(0,-1,0),0,2).intersectObjects(objects,false);
for(const [x,z]of[[370,76],[430,76],[520,76]])assert.equal(ray(x,z).length,0,'Actual old cross-cell strip must disappear from all composed paving batches');
for(let i=1;i<HEX_COAST_WALK.length;i++){const a=HEX_COAST_WALK[i-1],b=HEX_COAST_WALK[i],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);for(let j=0;j<=40;j++)for(const side of[-1,0,1]){const t=Math.max(.00001,Math.min(.99999,j/40)),x=a[0]+dx*t-dz/length*side*2.6,z=a[1]+dz*t+dx/length*side*2.6;assert(ray(x,z).length,'Every hex edge and gate has actual full-width rendered paving');}}
for(const p of COAST_PROMENADE_WALK){assert(Math.abs(Math.hypot(...p)-CITY_ISLAND.promenadeRadius)<1e-6);assert(ray(...p,[coast.promenade]).length,'The guide uses the actual shoreline ring surface');}
for(let t=.001;t<1;t+=.03)for(const side of[-1,0,1])assert(ray(dock.points[0][0]+(dock.points[1][0]-dock.points[0][0])*t,76+side*2.95).length,'The dock approach retains its full six-metre width');
for(const p of HEX_COAST_WALK)assert(COAST_WALK.some(q=>near(p,q)),'The map guide and real hex journey use the same vertices');
assert(!COAST_WALK.some(p=>near(p,[350,76])));assert(COAST_PATHS.some(r=>r.points.some(p=>near(p,HEX_COAST_WALK[0]))),'Origami has a short real court-to-grid approach');
coast.dispose();console.log('PASS coastal hex walk: no old cross-cell strip in actual paving; existing hex edges/east gate/promenade connect unchanged Origami and boat lookout, with verified lane/dock widths');
