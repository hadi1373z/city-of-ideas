import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {SIX_GATE_GARDEN as G,GARDEN_GATES,GARDEN_ROUTES,GARDEN_ENTRIES,GARDEN_COLUMNS,GARDEN_FOOTPRINTS,GARDEN_TREE_CANDIDATES,GARDEN_ARCADE_BAYS,GARDEN_RETAINED_CROSSINGS,gardenTreeClear,gardenCanStand,gardenSurfaceAt,gardenWorld,gardenBayBoundary,gardenTreeBedPlan,gardenOnRoute} from '../src/six-gate-garden-model.js';
import {buildSixGateGarden,buildGardenTreeBeds} from '../src/six-gate-garden-scene.js';
import {honeycombCells} from '../src/honeycomb-city-model.js';
import {SIXFOLD_HOUSES,sixfoldHouseEntry,sixfoldWellHoles,NETWORK_PASSAGES} from '../src/sixfold-house-network-model.js';
import {buildTransformationHouse} from '../src/transformation-house-scene.js';

const sourcePose=JSON.stringify({houses:SIXFOLD_HOUSES,holes:sixfoldWellHoles(),passages:NETWORK_PASSAGES});
const garden=buildSixGateGarden(T),scene=new T.Group();scene.add(garden.group);
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),source=buildTransformationHouse(T,{canvas,includeTiling:false}),sourceRoot=new T.Group();
for(const h of SIXFOLD_HOUSES){const wrapper=new T.Group(),copy=source.group.clone(true);copy.position.x=-125;wrapper.position.set(h.x,0,h.z);wrapper.rotation.y=h.turn;wrapper.add(copy);sourceRoot.add(wrapper);}
scene.add(sourceRoot);scene.updateMatrixWorld(true);
assert.equal(GARDEN_GATES.length,6);assert.equal(GARDEN_ENTRIES.length,6);assert.equal(GARDEN_COLUMNS.length,132);assert.equal(garden.group.children.length,4,'Four bounded material batches, not a mesh per arch/tile');
assert.equal(scene.children.filter(c=>c.userData.transformationHouse).length,0,'The garden itself never installs a duplicate tower');
for(const g of GARDEN_GATES){const original=sixfoldHouseEntry(g.house);assert.deepEqual(g.entry,original);assert(Math.abs(Math.hypot(...g.point)-105)<1e-9);}

// Spatially bin the ACTUAL transformed source triangles for efficient native
// Raycaster queries. No collider/proxy triangles replace the rendered meshes.
// This is a test-only broad phase; each copied triangle keeps exact world XYZ.
const cellSize=8,cells=new Map(),key=(x,z)=>Math.floor(x/cellSize)+','+Math.floor(z/cellSize);
function addTriangle(a,b,c){
 const minX=Math.floor(Math.min(a.x,b.x,c.x)/cellSize),maxX=Math.floor(Math.max(a.x,b.x,c.x)/cellSize),minZ=Math.floor(Math.min(a.z,b.z,c.z)/cellSize),maxZ=Math.floor(Math.max(a.z,b.z,c.z)/cellSize);
 for(let i=minX;i<=maxX;i++)for(let j=minZ;j<=maxZ;j++){const k=i+','+j;if(!cells.has(k))cells.set(k,[]);cells.get(k).push(...a.toArray(),...b.toArray(),...c.toArray());}
}
let actualTriangles=0;
scene.traverse(o=>{
 if(!o.geometry?.attributes.position)return;const p=o.geometry.attributes.position,ix=o.geometry.index?.array||Array.from({length:p.count},(_,i)=>i),m=new T.Matrix4();
 for(let n=0;n<(o.isInstancedMesh?o.count:1);n++){
  m.copy(o.matrixWorld);if(o.isInstancedMesh){const local=new T.Matrix4();o.getMatrixAt(n,local);m.multiply(local);}
  for(let j=0;j<ix.length;j+=3){const a=new T.Vector3().fromBufferAttribute(p,ix[j]).applyMatrix4(m),b=new T.Vector3().fromBufferAttribute(p,ix[j+1]).applyMatrix4(m),c=new T.Vector3().fromBufferAttribute(p,ix[j+2]).applyMatrix4(m);if(Math.max(a.y,b.y,c.y)<-.1||Math.min(a.y,b.y,c.y)>3.1)continue;addTriangle(a,b,c);actualTriangles++;}
 }
});
const material=new T.MeshBasicMaterial({side:T.DoubleSide}),meshes=new Map();for(const[k,values]of cells){const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(values,3));geometry.computeBoundingSphere();const mesh=new T.Mesh(geometry,material);mesh.updateMatrixWorld();meshes.set(k,mesh);}
function rays(start,end){const list=new Set(),distance=start.distanceTo(end),steps=Math.max(1,Math.ceil(distance/3));for(let i=0;i<=steps;i++){const p=start.clone().lerp(end,i/steps),mesh=meshes.get(key(p.x,p.z));if(mesh)list.add(mesh);}return new T.Raycaster(start,end.clone().sub(start).normalize(),.001,distance-.001).intersectObjects([...list],false);}
function floor(x,z){const mesh=meshes.get(key(x,z));return mesh?new T.Raycaster(new T.Vector3(x,.6,z),new T.Vector3(0,-1,0),0,1).intersectObject(mesh,false):[];}
let bodyRays=0,supportRays=0;
for(const route of GARDEN_ROUTES){
 for(let j=1;j<route.points.length;j++){
  const a=route.points[j-1],b=route.points[j],length=Math.hypot(b[0]-a[0],b[1]-a[1]),steps=Math.ceil(length/.7),dx=(b[0]-a[0])/length,dz=(b[1]-a[1])/length;
  for(let i=0;i<steps;i++)for(const offset of[-route.width/2+.55,0,route.width/2-.55]){
   const x=a[0]+(b[0]-a[0])*i/steps-dz*offset,z=a[1]+(b[1]-a[1])*i/steps+dx*offset;
   assert(gardenCanStand(x,z,.3),'A real public route is blocked by garden furniture '+route.id+' '+[x,z]);
   assert(floor(x,z).some(h=>Math.abs(h.point.y-G.floor)<.012),'Every new walking sample has a supported slab '+route.id+' '+[x,z]);supportRays++;
   for(const height of[.7,1.8,2.35]){const start=new T.Vector3(x,G.floor+height,z),end=new T.Vector3(a[0]+(b[0]-a[0])*(i+1)/steps-dz*offset,G.floor+height,a[1]+(b[1]-a[1])*(i+1)/steps+dx*offset);assert.equal(rays(start,end).length,0,'Actual garden/source geometry blocks '+route.id+' '+[x,z]);bodyRays++;}
  }
 }
}
// Keep all thirty existing central-cell edges, including the six sector-
// bisector streets that the first evenly-spaced column layout obstructed.
const retainedEdges=new Map(),pointKey=p=>p.map(n=>(Math.round(n*1e5)/1e5).toFixed(5)).join(',');
for(const cell of honeycombCells().filter(c=>Math.max(Math.abs(c.q),Math.abs(c.r),Math.abs(c.q+c.r))<=1))for(let i=0;i<6;i++){
 const a=cell.vertices[i],b=cell.vertices[(i+1)%6],id=[pointKey(a),pointKey(b)].sort().join('|');if(!retainedEdges.has(id))retainedEdges.set(id,{a,b});
}
assert.equal(retainedEdges.size,30);
let retainedRays=0;
for(const{a,b}of retainedEdges.values()){
 const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),steps=Math.ceil(length/.7);
 for(let i=0;i<steps;i++)for(const side of[-1,0,1]){
  const offset=side*(G.retainedStreetWidth/2-.55),x=a[0]+dx*i/steps-dz/length*offset,z=a[1]+dz*i/steps+dx/length*offset;
  assert(gardenCanStand(x,z,.3),'A garden fixture blocks a retained central grid street '+[x,z]);
  for(const height of[.7,1.8,2.35]){
   const start=new T.Vector3(x,G.floor+height,z),end=new T.Vector3(a[0]+dx*(i+1)/steps-dz/length*offset,G.floor+height,a[1]+dz*(i+1)/steps+dx/length*offset);
   assert.equal(rays(start,end).length,0,'Actual new/source triangles obstruct a retained central grid street '+[x,z]);retainedRays++;
  }
 }
}
for(const g of GARDEN_GATES){
 const bays=GARDEN_ARCADE_BAYS.filter(b=>b.id.startsWith('garden-arcade-'+g.id+'-'));for(let i=1;i<bays.length;i++)assert.equal(bays[i-1].b,bays[i].a,'Shared arch/roof bay boundaries remain continuous');
 const midpoint=g.angle+Math.PI/6,shift=gardenBayBoundary(g,G.baysPerSector/2)-midpoint;assert(Math.abs(G.innerColumnRadius*Math.sin(shift)-4.5)<1e-9);
}
assert.equal(GARDEN_RETAINED_CROSSINGS.length,6);assert(gardenCanStand(0,-100),'The reported old street conflict stays open');
// Complete each unchanged source doorway at body width, not only the outside
// route endpoint. Its original floor is Y0 and its established porch is kept.
for(const g of GARDEN_GATES)for(const offset of[-1.7,0,1.7])for(const y of[.75,1.93,2.48]){
 const a=gardenWorld(g,SIXFOLD_HOUSES[0].x+offset,26),b=gardenWorld(g,SIXFOLD_HOUSES[0].x+offset,19.2);
 assert.equal(rays(new T.Vector3(a[0],y,a[1]),new T.Vector3(b[0],y,b[1])).length,0,'Original tangential doorway and porch remain physically open');bodyRays++;
}

// The new mesh has no triangle above Babel or any of the six live shaft holes.
garden.group.updateMatrixWorld(true);for(const hole of[{x:0,z:0,radius:58},...sixfoldWellHoles()])for(const r of[0,hole.radius*.9])for(let i=0;i<12;i++){
 const a=i*Math.PI/6,x=hole.x+r*Math.cos(a),z=hole.z+r*Math.sin(a);assert.equal(new T.Raycaster(new T.Vector3(x,30,z),new T.Vector3(0,-1,0),0,40).intersectObject(garden.group,true).length,0,'Garden cannot cap an existing opening');assert.equal(gardenSurfaceAt(x,z),null);
}
assert.equal(JSON.stringify({houses:SIXFOLD_HOUSES,holes:sixfoldWellHoles(),passages:NETWORK_PASSAGES}),sourcePose,'Existing six-house/basement authority is unchanged');
for(const c of GARDEN_COLUMNS){assert(!gardenCanStand(c.x,c.z));assert(!gardenTreeClear(c.x,c.z,3));}
for(const h of SIXFOLD_HOUSES)assert(!gardenTreeClear(h.x+27,h.z,4),'Crown clearance cannot be replaced by trunk clearance');
for(const p of GARDEN_TREE_CANDIDATES)assert(gardenTreeClear(p.x,p.z,p.crownRadius));assert(GARDEN_TREE_CANDIDATES.length>=6);
for(const route of GARDEN_ROUTES)for(const p of route.points.filter((_,i)=>i%8===0))assert(!gardenTreeClear(...p,3.2),'Planting cannot cover a public route');
assert(GARDEN_FOOTPRINTS.every(p=>p.points.length>=4));
let allocated=0;garden.group.traverse(o=>{if(o.isMesh)allocated+=o.geometry.attributes.position.count/3;});assert(allocated<65000,'Garden architecture has a bounded triangle budget');
const sourceResources=new Set();source.group.traverse(o=>{if(o.geometry)sourceResources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])sourceResources.add(m);});let borrowedDisposed=0;for(const r of sourceResources)r.addEventListener('dispose',()=>borrowedDisposed++);
// Existing-tree flower dressing is optional, separate and entirely inside a
// clearance circle supplied by the real-tree owner. It cannot reposition trees
// or turn a low flower patch into a new walking collision/exclusion authority.
const existingTrees=GARDEN_TREE_CANDIDATES.map((p,i)=>({id:'actual-test-tree-'+i,x:p.x,z:p.z,y:0,radius:2.7})),treesBefore=JSON.stringify(existingTrees),placementBefore=JSON.stringify({routes:GARDEN_ROUTES,colliders:garden.colliders,candidates:GARDEN_TREE_CANDIDATES}),bedPlans=gardenTreeBedPlan(existingTrees),treeBeds=buildGardenTreeBeds(T,existingTrees);
assert.equal(treeBeds.beds.length,existingTrees.length);assert.equal(treeBeds.group.children.length,2);assert.deepEqual(treeBeds.beds,bedPlans);assert.equal(JSON.stringify(existingTrees),treesBefore);assert.equal(JSON.stringify({routes:GARDEN_ROUTES,colliders:garden.colliders,candidates:GARDEN_TREE_CANDIDATES}),placementBefore);assert.equal(treeBeds.colliders,undefined);
let bedTriangles=0;const bedResources=new Map();treeBeds.group.traverse(o=>{
 assert(!o.isLight&&!o.userData.naturalTrees,'Flower dressing never introduces a tree/light owner');if(!o.geometry)return;
 bedTriangles+=o.geometry.attributes.position.count/3;for(const r of[o.geometry,o.material]){assert(!sourceResources.has(r));bedResources.set(r,0);r.addEventListener('dispose',()=>bedResources.set(r,bedResources.get(r)+1));}
 const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i),plan=bedPlans.find(b=>Math.hypot(x-b.x,z-b.z)<=b.radius+2e-5);assert(plan,'Every real flower/edge vertex remains inside a supplied clearance circle');assert(y>=plan.floorY-.001&&y<=plan.floorY+.46,'Edging/flowers remain low and surface-only');assert(Math.hypot(x-plan.x,z-plan.z)>=plan.trunkGap-.001,'The actual trunk gap remains open');assert(!gardenOnRoute(x,z,.3),'Dressing of cleared test trees cannot intrude into the walking routes');
 }
});
assert(bedTriangles<existingTrees.length*2200,'Two finite flower batches have a per-tree triangle budget');treeBeds.dispose();treeBeds.dispose();assert([...bedResources.values()].every(n=>n===1));assert.equal(borrowedDisposed,0);
const counts=new Map();garden.group.traverse(o=>{for(const r of[o.geometry,...(Array.isArray(o.material)?o.material:o.material?[o.material]:[])])if(r&&!counts.has(r)){counts.set(r,0);r.addEventListener('dispose',()=>counts.set(r,counts.get(r)+1));}});
garden.dispose();garden.dispose();assert.equal(borrowedDisposed,0,'Owned garden cleanup never disposes source-house resources');assert([...counts.values()].every(n=>n===1));source.dispose();for(const mesh of meshes.values())mesh.geometry.dispose();material.dispose();
console.log('PASS Six Gate Garden: '+bodyRays+' real body-width loop/gate/tangential-door rays, '+retainedRays+' rays on all30 retained central-grid edges, '+supportRays+' supported slab samples, six protected shafts/Babel, '+actualTriangles+' indexed actual source triangles, full-crown reserves, four finite batches; optional existing-tree dressing '+bedTriangles+' triangles/two batches, unchanged positions/routes/colliders and scoped disposal.');
