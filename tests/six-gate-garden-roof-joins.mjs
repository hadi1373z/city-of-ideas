import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {SIX_GATE_GARDEN as G,GARDEN_GATES,GARDEN_ROOF_JOINS,GARDEN_FOOTPRINTS,GARDEN_COLUMNS,GARDEN_ROUTES,GARDEN_COLLIDERS,gardenCanStand,gardenWorld} from '../src/six-gate-garden-model.js';
import {buildSixGateGarden} from '../src/six-gate-garden-scene.js';
const authority=JSON.stringify({columns:GARDEN_COLUMNS,routes:GARDEN_ROUTES,colliders:GARDEN_COLLIDERS}),built=buildSixGateGarden(T,{paving:false,planting:false});built.group.updateMatrixWorld(true);
assert.equal(GARDEN_ROOF_JOINS.length,12);assert.equal(built.group.userData.roofJoinCount,12);assert.equal(built.group.children.length,3,'All roof saddles share the original stone/slate/bronze batches');
let roofRays=0,bodyRays=0,edgeRays=0;const up=new T.Vector3(0,1,0),mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
const testMaterial=new T.MeshBasicMaterial({side:T.DoubleSide}),joinSkin=name=>{const source=built.group.children.find(o=>o.userData.gardenMaterialBatch===name),r=built.group.userData.roofJoinRanges[name],p=source.geometry.attributes.position,geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(p.array.slice(r.start*3,(r.start+r.count)*3),3));const mesh=new T.Mesh(geometry,testMaterial);mesh.updateMatrixWorld();return mesh;},slate=joinSkin('roof'),soffit=joinSkin('stone');
for(const join of GARDEN_ROOF_JOINS){
 const gate=GARDEN_GATES.find(g=>g.id===join.gateId),foot=GARDEN_FOOTPRINTS.find(f=>f.id===join.id);assert(foot?.walkThrough);assert.deepEqual(foot.points,join.points);
 for(let i=0;i<3;i++){const a=join.arcade[i],r=[G.roofInner,G.ringRadius,G.roofOuter][i],angle=gate.angle+join.side*G.gateHalfAngle;assert(Math.hypot(a[0]-r*Math.cos(angle),a[1]-r*Math.sin(angle))<1e-10,'Original curved roof boundary is exact');assert.deepEqual(join.loggia[i],gardenWorld(gate,r,join.side*(G.gateWidth+.8)/2),'Original loggia edge is exact');}
 // Dense actual upward rays span each previously open slot and both slope
 // halves. No proxy roof polygon is substituted for the rendered triangles.
 for(let half=0;half<2;half++)for(let a=0;a<=12;a++)for(let b=0;b<=12;b++){
  const u=(a+.09)/12.18,t=(b+.07)/12.14,p=mix(mix(join.arcade[half],join.arcade[half+1],u),mix(join.loggia[half],join.loggia[half+1],u),t),hits=new T.Raycaster(new T.Vector3(p[0],1.93,p[1]),up,0,6).intersectObjects([slate,soffit],false);
  assert(hits.some(h=>h.point.y>=G.roofEave-.161&&h.point.y<=G.roofRidge+.001),'No open sky through fitted roof join '+join.id+' '+p);roofRays++;
  if(a>1&&a<11&&b>1&&b<11){const top=new T.Raycaster(new T.Vector3(p[0],10,p[1]),new T.Vector3(0,-1,0),0,6).intersectObject(slate)[0],bottom=new T.Raycaster(new T.Vector3(p[0],3,p[1]),up,0,5).intersectObject(soffit)[0];assert(top&&bottom);assert(Math.abs(top.point.y-bottom.point.y-.16)<.0001,'Actual slate and soffit retain16cm across the same triangulated saddle; neither skin pierces the other');}
 }
 // Check the exact roof-to-roof abutments from both sides of each boundary.
 for(const t of[.05,.25,.5,.75,.95])for(const row of[join.arcade,join.loggia])for(const half of[0,1]){const p=mix(row[half],row[half+1],t),hits=new T.Raycaster(new T.Vector3(p[0],1.93,p[1]),up,0,6).intersectObject(built.group,true);assert(hits.some(h=>h.point.y>5.25),'Matched original roof boundary is covered');edgeRays++;}
 // A head-width walking segment under each new saddle remains unobstructed.
 const a=join.arcade[1],b=join.loggia[1];for(const y of[.83,1.93,2.48])for(const offset of[-.35,0,.35]){
  const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),nx=-dz/len*offset,nz=dx/len*offset,start=new T.Vector3(a[0]+nx,y,a[1]+nz),end=new T.Vector3(b[0]+nx,y,b[1]+nz);
  assert(gardenCanStand((start.x+end.x)/2,(start.z+end.z)/2,.3));assert.equal(new T.Raycaster(start,end.clone().sub(start).normalize(),.001,start.distanceTo(end)-.001).intersectObject(built.group,true).length,0,'No new low beam/fascia crosses the existing walking route');bodyRays++;
 }
}
// Isolate the new batched ranges and ensure their entire physical volume stays
// within the already empty arcade crown reserve, above all heads. Edge seam
// rods protrude only their original35/45mm radius, never a broad ceiling plane.
let vertices=0;
for(const mesh of built.group.children){const range=built.group.userData.roofJoinRanges[mesh.userData.gardenMaterialBatch];if(!range)continue;const p=mesh.geometry.attributes.position;for(let i=range.start;i<range.start+range.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);assert(Number.isFinite(x+y+z));assert(y>=G.roofEave-.161&&y<=G.roofRidge+.05);const r=Math.hypot(x,z);assert(r>=G.roofInner-.1&&r<=G.roofOuter+.25,'No new roof covers the inner court or Gallery');vertices++;}}
assert(vertices>500&&vertices<10000);assert.equal(JSON.stringify({columns:GARDEN_COLUMNS,routes:GARDEN_ROUTES,colliders:GARDEN_COLLIDERS}),authority);
const owned=new Map();built.group.traverse(o=>{for(const r of[o.geometry,o.material])if(r&&!owned.has(r)){owned.set(r,0);r.addEventListener('dispose',()=>owned.set(r,owned.get(r)+1));}});built.dispose();built.dispose();assert([...owned.values()].every(n=>n===1));slate.geometry.dispose();soffit.geometry.dispose();testMaterial.dispose();
console.log(`PASS garden roof joins: ${roofRays} actual roof/soffit rays across12 slots, ${edgeRays} exact abutment rays, ${bodyRays} unchanged walking-clearance rays, ${vertices} bounded new vertices in3 shared batches, matching footprints and scoped cleanup.`);
