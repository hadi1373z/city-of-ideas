import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {PAPER_SEMINAR_COURT as C,hexCentre,INHABITED_BLOCKS,HEX_DISTRICTS} from '../src/city-hex-layout.js';
import {HOUSE_ORIGAMI as O,COAST_PATHS,FOLD_HOUSE_KEY} from '../src/origami-house-math.js';
import {SEMINAR_HOUSES,SEMINAR_HOUSE_ARCHIVE,SEMINAR_PATHS,seminarEntry} from '../src/seminar-houses-data.js';
import {COAST_WALK,COAST_LANDMARKS,COAST_EXPLORER_COPY,coastMapPoint} from '../src/coastal-map-data.js';
import {coastalPlanSvg,COAST_MAP_COPY} from '../src/coastal-city-plan.js';
import {origamiHouseOutline} from '../src/origami-house-entry-model.js';
import {buildOrigamiHouse} from '../src/origami-house-scene.js';
import {buildSeminarHouses} from '../src/seminar-houses-scene.js';
import {onCityIsland,SHORE} from '../src/island-layout.js';
import {urbanRoutes,HONEYCOMB_CITY} from '../src/city-urban-plan-model.js';
const near=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<1e-6;
assert.deepEqual({x:C.x,z:C.z},hexCentre(-1,3));assert.equal(C.x,79.67433714816835);assert.equal(C.z,414);assert.equal(C.eastX,159.3486742963367);assert(INHABITED_BLOCKS.some(c=>c.q===-1&&c.r===3));
assert.deepEqual([O.x,O.z],[C.x,385]);assert.deepEqual([O.entry.x,O.entry.z],[C.x,401]);assert.equal(O.entry.yaw,0);assert.equal(O.threshold.z,396);assert.equal(O.insideEntry.z,390.5);assert.equal(FOLD_HOUSE_KEY,'city-of-ideas:house-of-origami:v1');assert.deepEqual(O.shore,SHORE);
assert.deepEqual(SEMINAR_HOUSES.map(h=>[h.id,h.x,h.z,h.mapNumber]),[['noether',C.x-34,437,6],['cage',C.x+34,437,8]]);assert(SEMINAR_HOUSE_ARCHIVE.some(h=>h.id==='mirzakhani'));assert(!SEMINAR_HOUSES.some(h=>h.id==='mirzakhani'));assert.equal(HEX_DISTRICTS.symmetry.x,C.x);assert.equal(HEX_DISTRICTS.listening.z,C.z);
const cell=HONEYCOMB_CITY.cells.find(c=>c.q===-1&&c.r===3);function inside(x,z){return cell.vertices.every((a,i)=>{const b=cell.vertices[(i+1)%6];return(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0])>=-1e-7;});}
for(const p of origamiHouseOutline(O.x,O.z))assert(inside(...p)&&onCityIsland(...p),'The complete Origami roof/portico stays in its new hex');
for(const h of SEMINAR_HOUSES)for(const x of[-14.2,14.2])for(const z of[-14.2,14.2])assert(inside(h.x+x,h.z+z),'Seminar footprint stays inside the recipient hex');
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),origami=buildOrigamiHouse(T,{canvas}),seminars=buildSeminarHouses(T,{canvas}),clear=(x,z)=>origami.canStand(x,z)&&seminars.canStand(x,z);
for(const route of [...COAST_PATHS.filter(r=>r.id.startsWith('origami-court-')).map(r=>r.points),...SEMINAR_PATHS])for(let i=1;i<route.length;i++)for(let j=0;j<=100;j++){const a=route[i-1],b=route[i],t=j/100;assert(clear(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t),'Every shared courtyard/door approach clears the real source buildings');}
for(let z=O.entry.z;z>=O.insideEntry.z;z-=.05)for(const side of[-1.1,0,1.1])assert(clear(O.x+side,z),'The existing actual Origami door remains traversable');
for(const h of seminars.houses){const entry=seminarEntry(h.data);assert.equal(entry.yaw,Math.PI);assert.equal(h.group.rotation.y,Math.PI);for(let z=entry.z;z<=h.insideEntry.z;z+=.05)for(const side of[-1.1,0,1.1])assert(clear(entry.x+side,z),'Both seminar doors face the shared northern court');}
seminars.group.updateMatrixWorld(true);for(const h of SEMINAR_HOUSES){const z=h.z-48,hits=new T.Raycaster(new T.Vector3(h.x,1,z),new T.Vector3(0,-1,0),0,1).intersectObject(seminars.group,true);assert(hits.length,'The retained seminar seats have real geometry in the new court');assert(!seminars.canStand(h.x,z),'Seat collision follows its relocated visible geometry');}
for(const x of[194.023011444505,284.023011444505]){assert.equal(new T.Raycaster(new T.Vector3(x,1,120),new T.Vector3(0,-1,0),0,2).intersectObject(seminars.group,true).length,0,'No orphaned seminar seat remains beside Escher');assert(seminars.canStand(x,120),'No obsolete seat collision remains');}
for(const h of SEMINAR_HOUSES)assert.deepEqual(COAST_LANDMARKS.find(p=>p.id===h.id).point,[h.x,h.z]);assert(!COAST_LANDMARKS.some(p=>p.id==='mirzakhani'));assert(COAST_WALK.some(p=>near(p,[O.entry.x,O.entry.z])));assert(COAST_WALK.some(p=>near(p,[C.eastX,C.z])));
// Every guide segment belongs to an actual street, court path or shore ring.
const distance=(p,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],q=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(p[0]-a[0]-q*dx,p[1]-a[1]-q*dz);},segments=urbanRoutes().flatMap(r=>r.points.slice(1).map((b,i)=>[r.points[i],b]));
for(let i=1;i<COAST_WALK.length;i++){const a=COAST_WALK[i-1],b=COAST_WALK[i];for(let j=0;j<=40;j++){const p=[a[0]+(b[0]-a[0])*j/40,a[1]+(b[1]-a[1])*j/40];assert(segments.some(([u,v])=>distance(p,u,v)<1e-5)||Math.abs(Math.hypot(...p)-536)<.02,'Coastal guide must follow existing paths, never the retired Origami-side route');}}
for(const lang of['en','de','fa']){const svg=coastalPlanSvg(undefined,lang),[mx,mz]=coastMapPoint(O.x,O.z-16);assert(svg.includes('x="'+mx+'" y="'+mz+'" text-anchor="middle" font-size="13" fill="#29483c" >'+COAST_MAP_COPY[lang].origami));assert(!svg.includes('Advanced seminars'));assert(!svg.includes('620.3,513.2 705.0,545.4'));assert(COAST_EXPLORER_COPY[lang].steps.every(s=>typeof s==='string'&&s.length>30));}
origami.dispose();seminars.dispose();console.log('PASS paper/seminar relocation: exact hex(-1,3), intact IDs/orientations/shore, complete bounded footprints, real shared doorway clearance and all coast-guide samples on actual paths');
