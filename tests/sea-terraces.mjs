import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {SEA_TERRACES as S,SEA_TERRACE_ENTRY,SEA_TERRACE_SURFACES,SEA_TERRACE_OBSTACLES,SEA_TERRACE_PERGOLAS,SEA_TERRACE_FOOTPRINTS,seaTerraceWorld,seaTerraceLocal,seaTerraceFloorAt,seaTerraceCanStand} from '../src/sea-terraces-model.js';
import {buildSeaTerraces} from '../src/sea-terraces-scene.js';
import {buildCityCoast} from '../src/coastal-city-scene.js';
import '../src/city-landscape.js';
const modelBefore=JSON.stringify({S,patches:SEA_TERRACE_SURFACES,obstacles:SEA_TERRACE_OBSTACLES}),built=buildSeaTerraces(T);built.group.updateMatrixWorld(true);
assert.equal(S.cell.q,3);assert.equal(S.cell.r,-3);assert(Math.abs(S.x-239.023011444505)<1e-9);assert.equal(S.z,-414);
assert.equal(built.group.children.filter(o=>o.isLight).length,0,'The sea terraces add no light or night-world override');
const resources=new Map();built.group.traverse(o=>{for(const r of[o.geometry,...(Array.isArray(o.material)?o.material:[o.material])])if(r&&!resources.has(r)){resources.set(r,0);r.addEventListener('dispose',()=>resources.set(r,resources.get(r)+1));}});
let support=0,closed=0;const ray=new T.Raycaster(),down=new T.Vector3(0,-1,0);
for(let u=-33.7;u<34;u+=1.13)for(let v=22.15;v<47;v+=.83){const p=seaTerraceWorld(u,v),q=seaTerraceLocal(p.x,p.z);assert(Math.abs(q.u-u)<1e-10&&Math.abs(q.v-v)<1e-10);const y=seaTerraceFloorAt(p.x,p.z);assert(y>=.13-1e-6&&y<=.61+1e-6);ray.set(new T.Vector3(p.x,2,p.z),down);ray.far=3;const h=ray.intersectObject(built.terrain);assert(h.length);assert(Math.abs(h[0].point.y-y)<4e-5,'Visible floor and model share the actual triangle diagonal, including side ramps');support++;}
// The empty outer band is real land well inside the existing r533 promenade.
for(const [u,v]of[[-34,22],[34,22],[-34,47],[34,47]]){const p=seaTerraceWorld(u,v);assert(Math.hypot(p.x,p.z)<528,'No terrace reaches the unchanged promenade or ocean');assert(Math.hypot(p.x-S.x,p.z-S.z)>17,'The source Listening Court is not covered');}
for(const [u,v]of[[0,0],[0,21.99],[0,47.01],[34.01,35],[-34.01,35]]){const p=seaTerraceWorld(u,v);assert.equal(seaTerraceFloorAt(p.x,p.z),null,'No proxy floor beyond actual terrace bounds');}
assert.equal(seaTerraceFloorAt(NaN,0),null);assert.equal(seaTerraceCanStand(NaN,0),false);
// Drive the centre from its original ground height over BOTH supported ramps,
// then return by a ten-metre-wide lateral ramp to unchanged ground.
const route=[[0,22],[0,44.5],[33.9,44.5],[34,44.5]],reverse=[...route].reverse();let steps=0;
for(const points of[route,reverse]){const begin=seaTerraceWorld(...points[0]);let feet=seaTerraceFloorAt(begin.x,begin.z);for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.04);for(let j=1;j<=n;j++){const u=a[0]+(b[0]-a[0])*j/n,v=a[1]+(b[1]-a[1])*j/n,p=seaTerraceWorld(u,v),y=seaTerraceFloorAt(p.x,p.z);assert(seaTerraceCanStand(p.x,p.z,feet),'The centre ramps and side ground return must work in both directions '+[u,v,feet,y]);feet=y;steps++;}}}
for(const v of[29,38]){const p=seaTerraceWorld(12,v+.02);assert(!seaTerraceCanStand(p.x,p.z,v===29?.13:.37),'An abrupt240mm tier edge cannot be climbed as a level floor');}
// Actual shoulder/head rays test the supported routes, including a shaded
// side-ramp aisle under each pergola. A logical floor result alone is not proof.
let bodyRays=0;
for(const points of[[[0,22],[0,44.5],[33.9,44.5],[34,44.5]],[[0,22],[0,44.5],[-33.9,44.5],[-34,44.5]],[[24,29],[24,38]],[[-24,29],[-24,38]]])for(let i=1;i<points.length;i++){
 const a=points[i-1],b=points[i],distance=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(distance/.35),du=(b[0]-a[0])/distance,dv=(b[1]-a[1])/distance;
 for(let j=0;j<n;j++)for(const direction of[-1,1])for(const offset of[-.26,0,.26])for(const h of[.85,1.8]){
  const t=(j+.1)/n,U=(j+.9)/n,u=a[0]+(b[0]-a[0])*t-dv*offset,v=a[1]+(b[1]-a[1])*t+du*offset,u1=a[0]+(b[0]-a[0])*U-dv*offset,v1=a[1]+(b[1]-a[1])*U+du*offset,p=seaTerraceWorld(u,v),q=seaTerraceWorld(u1,v1),y=seaTerraceFloorAt(p.x,p.z)+h,Y=seaTerraceFloorAt(q.x,q.z)+h,start=new T.Vector3(p.x,y,p.z),end=new T.Vector3(q.x,Y,q.z);
  if(direction<0){const swap=start.clone();start.copy(end);end.copy(swap);}const delta=end.clone().sub(start),length=delta.length();ray.set(start,delta.normalize());ray.near=.002;ray.far=length-.002;const bodyHits=ray.intersectObject(built.group,true).filter(hit=>hit.object.isMesh);assert.equal(bodyHits.length,0,'No post, canopy, planter, guard or buried wall crosses actual body/head space '+JSON.stringify({u,v,u1,v1,h,offset,hit:bodyHits[0]?.object.name,point:bodyHits[0]?.point}));bodyRays++;
 }
}ray.near=0;
for(const o of SEA_TERRACE_OBSTACLES){const p=seaTerraceWorld(o.u,o.v);assert(!seaTerraceCanStand(p.x,p.z,seaTerraceFloorAt(p.x,p.z)),'Every built solid has a corresponding physical blocker '+o.id);}
for(const sign of[-1,1]){const p=seaTerraceWorld(sign*34,44.5);assert(Math.abs(seaTerraceFloorAt(p.x,p.z)-.13)<1e-6,'Side return meets existing ground without a step');}
// A low-side horizontal view must meet the actual stone riser, not lawn/sky.
for(const [u,v,y]of[[12,29,.25],[12,38,.49]]){const a=seaTerraceWorld(u,v-.15),b=seaTerraceWorld(u,v+.15),dir=new T.Vector3(b.x-a.x,0,b.z-a.z).normalize();ray.set(new T.Vector3(a.x,y,a.z),dir);ray.far=.3;assert(ray.intersectObject(built.terrain).length,'Every raised tier riser has an opaque physical face');closed++;}
// Canopies and the three sea-view frames remain in the promised rectangle.
const bounds=new T.Box3(),matrix=new T.Matrix4();let meshes=0,triangles=0;
built.group.traverse(o=>{if(!o.isMesh)return;meshes++;const g=o.geometry;triangles+=(g.index?.count??g.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);if(o.isInstancedMesh){g.computeBoundingBox();for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);bounds.copy(g.boundingBox).applyMatrix4(matrix);assert(bounds.min.x>=-34.001&&bounds.max.x<=34.001&&bounds.min.z>=-47.001&&bounds.max.z<=-21.999,'All canopies, furniture and framing stay in the reserved local land');}}});
assert(meshes<=18&&triangles<25000,'The new district has a bounded geometry/draw budget');
assert.equal(SEA_TERRACE_PERGOLAS.length,2);assert.equal(JSON.stringify({S,patches:SEA_TERRACE_SURFACES,obstacles:SEA_TERRACE_OBSTACLES}),modelBefore);
// Rebuild the unchanged source campus and complete coast forest in their real
// order. Read mounted tree identities, not a few hand-selected test points.
const scene=new T.Scene(),previousClear=globalThis.CITY_PUBLIC_TREE_CLEAR;let campus;
try{delete globalThis.CITY_PUBLIC_TREE_CLEAR;campus=globalThis.createCityLandscape(T,{parent:scene,outerRadius:58});}finally{globalThis.CITY_PUBLIC_TREE_CLEAR=previousClear;}
const coast=buildCityCoast(T,{naturalTrees:globalThis.buildNaturalCityTrees});scene.add(coast.group);scene.updateMatrixWorld(true);const treeSites=[];
scene.traverse(o=>{for(const p of o.userData.naturalTrees?.positions??[]){const q=new T.Vector3(p.x,0,p.z).applyMatrix4(o.matrixWorld);treeSites.push({x:q.x,z:q.z});}});
assert(treeSites.length>500,'Clearance includes source campus, accepted street forest and loose coast woodland');
const segmentDistance=(p,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(p.x-a[0]-dx*t,p.z-a[1]-dz*t);};
for(const p of treeSites){const q=seaTerraceLocal(p.x,p.z),distance=Math.hypot(Math.max(0,-34-q.u,q.u-34),Math.max(0,22-q.v,q.v-47));assert(distance>.65,'No existing trunk or tree bed is paved over');for(const roof of SEA_TERRACE_FOOTPRINTS.filter(f=>f.kind==='roof'))assert(Math.min(...roof.points.map((a,i)=>segmentDistance(p,a,roof.points[(i+1)%roof.points.length])))>7,'The full original tree crown clears each new pergola');}
coast.dispose();const campusResources=new Set();campus.group.traverse(o=>{if(o.geometry)campusResources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m)campusResources.add(m);o.isInstancedMesh&&o.dispose();});for(const r of campusResources)r.dispose();campus.group.clear();
assert(Math.abs(SEA_TERRACE_ENTRY.y-.13)<1e-8);assert(Math.abs(-Math.sin(SEA_TERRACE_ENTRY.yaw)-S.out[0])<1e-8,'Arrival looks through the terraces toward the sea');
built.dispose();built.dispose();assert.equal(built.group.children.length,0);assert([...resources.values()].every(n=>n===1),'Every owned GPU resource is released exactly once');
console.log(`PASS Sea Terraces: ${support} actual triangle support rays, ${steps} two-way ramp/return steps, ${bodyRays} actual shoulder/head rays, ${closed} opaque tier risers, ${treeSites.length} original mounted trees/crowns clear, exact land/court/promenade bounds; ${meshes} meshes and ${Math.round(triangles)} triangles; unchanged source routes and owned cleanup.`);
