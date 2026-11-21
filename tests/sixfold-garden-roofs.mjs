import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {createSixfoldHouseRoof,SIXFOLD_GARDEN_ROOF as R} from '../src/sixfold-house-roof-model.js';
import {buildSixfoldHouseRoof} from '../src/sixfold-house-roof-scene.js';
import {buildSixfoldTransformationHouses} from '../src/sixfold-house-scene.js';
import {buildTransformationHouse} from '../src/transformation-house-scene.js';
import {SIXFOLD_HOUSES,houseToWorld} from '../src/sixfold-house-network-model.js';
import {tilingArea} from '../src/house-tiling-model.js';

const ctx=new Proxy({measureText:t=>({width:t.length*10})},{get:(o,k)=>o[k]??(()=>{})}),canvas=()=>({getContext:()=>ctx});
const near=(a,b,e=1e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`),up=new T.Vector3(0,1,0),down=new T.Vector3(0,-1,0),report=[];
const counts=new Map(),watch=o=>{if(!counts.has(o)){counts.set(o,0);o.addEventListener('dispose',()=>counts.set(o,counts.get(o)+1));}};
for(const h of SIXFOLD_HOUSES){
 const b=buildSixfoldHouseRoof(T,{pattern:h.pattern}),m=b.model;assert.deepEqual(m,createSixfoldHouseRoof(h.pattern));assert.equal(b.meshes.length,3);assert(m.tiles.length>15);near(m.fullArea,3*Math.sqrt(3)/2*R.fieldRadius**2-tilingArea(m.fieldOpening),1e-7);assert(m.tileArea<m.fullArea&&m.tileArea>m.fullArea*.9);
 b.group.updateMatrixWorld(true);let triangles=0;
 for(const o of b.meshes){watch(o.geometry);watch(o.material);const p=o.geometry.attributes.position,n=o.geometry.attributes.normal;triangles+=p.count/3;for(let i=0;i<p.count;i++){assert(Number.isFinite(p.getX(i))&&Number.isFinite(p.getY(i))&&Number.isFinite(p.getZ(i)));assert(p.getY(i)>=R.undersideY-1e-5&&p.getY(i)<=R.lanternPeakY+.05);assert(Math.hypot(p.getX(i)-125,p.getZ(i))<=R.outerRadius+.001);assert(Number.isFinite(n.getX(i))&&Number.isFinite(n.getY(i))&&Number.isFinite(n.getZ(i)));}}
 const opaque=b.meshes.filter(o=>!o.material.transparent),glass=b.meshes.find(o=>o.material.transparent);assert.equal(glass.material.opacity,.27);
 // Actual front-side rays: the old solid cone cannot cap the lantern cut.
 for(const radius of[0,.5,2,3.7])for(let i=0;i<12;i++){const a=(i+.13)*Math.PI/6,x=125+radius*Math.cos(a),z=radius*Math.sin(a),ray=new T.Raycaster(new T.Vector3(x,27,z),down,0,3.1);assert.equal(ray.intersectObject(b.meshes[0]).length,0);assert(ray.intersectObject(glass).length);}
 let tileRays=0;
 for(const tile of m.tiles)for(const polygon of tile.polygons){if(tilingArea(polygon)<.01)continue;const x=125+polygon.reduce((n,p)=>n+p[0],0)/polygon.length,z=polygon.reduce((n,p)=>n+p[1],0)/polygon.length,hits=new T.Raycaster(new T.Vector3(x,27,z),down,0,4).intersectObjects(opaque);assert(hits.length,'A real raised tile supports each visible patterned fragment');near(hits[0].point.y,R.tileTopY);tileRays++;}
 // The bearing slab overlaps the top of the source walls, while clearing the
 // established maximum crown height23.95 and ordinary top-room headroom.
 assert(R.undersideY<24&&R.undersideY>23.95);for(const[x,z]of[[14,0],[-15,0],[0,15]]){const hits=new T.Raycaster(new T.Vector3(125+x,18,z),up,0,8).intersectObjects(opaque);assert(hits.length);near(hits[0].point.y,R.undersideY);}
 b.dispose();b.dispose();report.push({pattern:h.pattern,tiles:m.tiles.length,tileRays,triangles});
}
for(const count of counts.values())assert.equal(count,1,'Owned roof resources dispose exactly once');

// Omitting a roof must leave every source walking buffer, secret room and
// pendulum pose byte-for-byte unchanged.
const original=buildTransformationHouse(T,{canvas,includeTiling:false}),bare=buildTransformationHouse(T,{canvas,includeTiling:false,includeRoof:false});
const walkBuffers=b=>b.walking.children.map(o=>({name:o.name,position:Array.from(o.geometry.attributes.position.array),indices:o.geometry.index?Array.from(o.geometry.index.array):null,pose:o.position.toArray()}));assert.deepEqual(walkBuffers(original),walkBuffers(bare));assert.deepEqual(original.secret.position.toArray(),bare.secret.position.toArray());assert.deepEqual(original.pendulums.map(p=>p.position.toArray()),bare.pendulums.map(p=>p.position.toArray()));original.dispose();bare.dispose();

const network=buildSixfoldTransformationHouses(T,{canvas});network.group.updateMatrixWorld(true);let cones=0;network.group.traverse(o=>{if(o.geometry?.type==='ConeGeometry'&&o.geometry.parameters.radius===25)cones++;});assert.equal(cones,0,'No old plain pyramidal roof remains in live near or far geometry');
for(const h of network.instances){assert.equal(h.roof.model.pattern,h.pattern);const roofObject=h.roof.group,geometry=h.roof.meshes[0].geometry;h.setDetail(false);assert(h.exterior.visible&&!h.detail.visible&&roofObject.visible);h.setDetail(true);assert(h.detail.visible&&!h.exterior.visible&&roofObject.visible);assert.equal(h.roof.group,roofObject);assert.equal(h.roof.meshes[0].geometry,geometry);assert.equal(h.tiling.pattern,h.pattern);const p=houseToWorld(h,{x:125,y:R.slabTopY,z:0}),world=roofObject.localToWorld(new T.Vector3(125,R.slabTopY,0));near(world.x,p.x);near(world.z,p.z);near(world.y,p.y);}
network.update(0,{}, {x:0,y:-30,z:0},'city');assert(network.instances.every(h=>!h.roof.group.visible),'Inactive roofs follow original underground exterior culling');network.update(0,{}, {x:0,y:2,z:0},'city');assert(network.instances.every(h=>h.roof.group.visible),'Daytime far roofs restore');network.dispose();network.dispose();
console.log('PASS six approved patterned garden roofs: exact parent crops, actual raised tile/slab/rim geometry, open glazed lantern cuts, unchanged source walking/poses, no old cones, identical near/far roofs, underground visibility and scoped disposal.');console.log(JSON.stringify(report));
