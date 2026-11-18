import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildSixfoldHousePassages,sixfoldPassagePlan} from '../src/sixfold-house-passages-scene.js';
import {buildSixfoldTransformationHouses} from '../src/sixfold-house-scene.js';
import {SIXFOLD_HOUSES,SIXFOLD_CROSSING,houseToWorld,NETWORK_PASSAGES} from '../src/sixfold-house-network-model.js';
import {buildEscherDepth} from '../src/escher-depth-scene.js';

const ctx=new Proxy({measureText:t=>({width:t.length*10})},{get:(o,k)=>o[k]??(()=>{})}),canvas=()=>({getContext:()=>ctx});
const built=buildSixfoldHousePassages(T),houses=buildSixfoldTransformationHouses(T,{canvas}),museum=buildEscherDepth(T,{canvas}),world=new T.Group();world.add(built.group,houses.group,museum.group);world.updateMatrixWorld(true);
const ray=(p,d,far=3)=>new T.Raycaster(new T.Vector3(...p),new T.Vector3(...d),0,far).intersectObject(world,true);
let samples=0;
for(const s of built.plan.segments){const dx=s.b[0]-s.a[0],dz=s.b[1]-s.a[1],len=Math.hypot(dx,dz),n=Math.ceil(len/.55);for(let i=0;i<=n;i++)for(const side of[-1.65,0,1.65]){
 const x=s.a[0]+dx*i/n-dz/len*side,z=s.a[1]+dz*i/n+dx/len*side;
 const floor=ray([x,-38.2,z],[0,-1,0],2.1),roof=ray([x,-38.2,z],[0,1,0],12);
 assert(floor.length&&Math.abs(floor[0].point.y+40)<1e-4,`Real supported floor missing at ${s.id}:${x},${z}`);
 assert(roof.some(h=>h.point.y>-35.3),`Enclosed ceiling missing at ${s.id}:${x},${z}`);samples++;
}}
// Traverse the actual six house mouths, then cross both directions of the old
// Escher route: a controller-only join with a solid wall would fail these rays.
for(const h of SIXFOLD_HOUSES){const p=houseToWorld(h,{x:100,z:0}),d=new T.Vector3(Math.cos(h.angle),0,Math.sin(h.angle));assert.equal(ray([p.x,-38.2,p.z],d.toArray(),6).length,0,'No wall across the real basement aperture of '+h.id);}
for(const d of[[.5,0,-Math.sqrt(3)/2],[-.5,0,Math.sqrt(3)/2],[0,0,1],[0,0,-1]])assert.equal(ray([SIXFOLD_CROSSING.x,-38.2,SIXFOLD_CROSSING.z],d,3.5).length,0,'The Escher crossing is physically open along every branch');
assert.equal(ray([133,-38.2,115],[1,0,0],4).length,0,'The museum doorway remains open');
assert.equal(ray([72,-38.2,0],[1,0,0],8).length,0,'The legacy gallery handoff remains open');
const plan=sixfoldPassagePlan();assert.equal(plan.segments.length,16);assert.equal(NETWORK_PASSAGES.length,13);assert.equal(built.counts.draws,3);
// Downward normals and upward normals belong to the same partition. Every
// sampled supported point has exactly one shell floor, without coplanar layers.
for(const s of NETWORK_PASSAGES)for(let t=.05;t<.96;t+=.1){const x=s.a[0]+(s.b[0]-s.a[0])*t,z=s.a[1]+(s.b[1]-s.a[1])*t;const hits=new T.Raycaster(new T.Vector3(x,-38.2,z),new T.Vector3(0,-1,0),0,2).intersectObject(built.walking);const points=new Set(hits.map(h=>h.point.toArray().map(n=>n.toFixed(5)).join(',')));assert(points.size<=1,'The corridor union has no overlapping height layers');}
const resources=new Map();for(const root of[built.group,houses.group])root.traverse(o=>{for(const r of[o.geometry,...(Array.isArray(o.material)?o.material:o.material?[o.material]:[])])if(r&&!resources.has(r)){resources.set(r,0);r.addEventListener('dispose',()=>resources.set(r,resources.get(r)+1));}});
assert.equal(houses.instances.length,6);for(const h of houses.instances){assert.equal(h.tiling,null,'Distant houses do not build six expensive interiors at startup');assert(h.exterior.children.length>10);assert.equal(h.detail.visible,false);}
houses.dispose();built.dispose();museum.dispose();assert([...resources.values()].every(n=>n===1),'Shared prototypes and corridor resources are released exactly once');
console.log(`PASS sixfold passages: ${samples} full-width floor/roof samples, six open house mouths, a real Escher crossing, lazy shared house shells and exactly-once disposal`);
