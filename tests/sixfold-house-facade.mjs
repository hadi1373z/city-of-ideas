import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildTransformationHouse} from '../src/transformation-house-scene.js';
import {buildSixfoldTransformationHouses} from '../src/sixfold-house-scene.js';
import {buildSixfoldHouseFacade,SIXFOLD_FACADE} from '../src/sixfold-house-facade.js';
import {createHouseWallTiling} from '../src/house-tiling-model.js';
import {houseToWorld,SIXFOLD_HOUSES} from '../src/sixfold-house-network-model.js';

const ctx=new Proxy({measureText:t=>({width:t.length*10})},{get:(o,k)=>o[k]??(()=>{})}),canvas=()=>({getContext:()=>ctx});
const close=(a,b,tol=5e-5)=>assert(Math.abs(a-b)<tol,`${a} != ${b}`);
// These independent fingerprints were recorded from the actual3092f82 source
// BEFORE the new optional façade existed. Do not replace with two current
// implementation branches that could accidentally share the same regression.
function fingerprint(group){const records=[];group.traverse(o=>{const r={type:o.type,name:o.name,position:o.position.toArray(),rotation:o.rotation.toArray(),scale:o.scale.toArray(),visible:o.visible};if(o.geometry){r.geometry={type:o.geometry.type,index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,{itemSize:a.itemSize,normalized:a.normalized,values:Array.from(a.array)}]))};r.material=(Array.isArray(o.material)?o.material:[o.material]).map(m=>({type:m.type,color:m.color?.getHex(),side:m.side,opacity:m.opacity,transparent:m.transparent,wireframe:m.wireframe,shininess:m.shininess}));}if(o.isInstancedMesh){r.count=o.count;r.instances=Array.from(o.instanceMatrix.array);}records.push(r);});return createHash('sha256').update(JSON.stringify(records)).digest('hex');}
const walkingHash='1d20ae46cff63b7134893b73232a90f85c886cabacbd9c1ec631cdd34101e02f',legacyHash='8a1876b9af7537f61eda74c01ca664cbb65eaa7cf9bc5b43d593efb0c156c560';
const legacy=buildTransformationHouse(T,{canvas,includeTiling:false}),garden=buildTransformationHouse(T,{canvas,includeTiling:false,includeRoof:false,gardenFacade:true});
assert.equal(legacy.facade,null);assert.equal(fingerprint(legacy.group),legacyHash,'The independently reused default source house is entirely unchanged');
assert.equal(fingerprint(legacy.walking),walkingHash);assert.equal(fingerprint(garden.walking),walkingHash,'All eight floor, landing and448 tread buffers/poses remain exact');
assert.deepEqual(garden.secret.position.toArray(),[125,-16,14]);assert.deepEqual(garden.pendulums.map(o=>o.position.toArray()),[[110,-17.3,-3],[107,-17.3,-3]]);
assert.equal(garden.facade.meshes.length,3);assert.equal(SIXFOLD_FACADE.corniceTop,23.98);
const grain=garden.facade.meshes[0].material.map;for(let i=0;i<grain.image.data.length;i+=4)assert(grain.image.data[i]>=238&&grain.image.data[i]<=253,'Pale mineral grain cannot wrap past255 into black speckles');assert.equal(grain.minFilter,T.LinearMipmapLinearFilter);assert(grain.generateMipmaps);
const façade=garden.facade.group,hex=Array.from({length:6},(_,i)=>[23*Math.cos(i*Math.PI/3),23*Math.sin(i*Math.PI/3)]);
let apertureRays=0,solidRays=0,doorRays=0,innerRays=0;
const materialAt=hit=>Array.isArray(hit.object.material)?hit.object.material[hit.face.materialIndex]:hit.object.material;
function crossing(root,facet,u,y,transform=null){const a=hex[facet],b=hex[(facet+1)%6],tx=(b[0]-a[0])/23,tz=(b[1]-a[1])/23,nx=tz,nz=-tx,point={x:125+a[0]+tx*u,y,z:a[1]+tz*u},ends=[-.48,.70].map(d=>{const p={x:point.x+nx*d,y,z:point.z+nz*d};return transform?transform(p):p;});const rays=[];for(const sign of[1,-1]){const p=new T.Vector3(...Object.values(sign>0?ends[0]:ends[1]).slice(0,3)),q=new T.Vector3(...Object.values(sign>0?ends[1]:ends[0]).slice(0,3));
 // Preserve explicit XYZ order even when houseToWorld adds instance metadata.
 const P=sign>0?ends[0]:ends[1],Q=sign>0?ends[1]:ends[0];p.set(P.x,P.y,P.z);q.set(Q.x,Q.y,Q.z);const d=q.sub(p),length=d.length();rays.push(new T.Raycaster(p,d.normalize(),0,length).intersectObject(root,true));}return rays;}
function checkOpenings(root,transform=null,{finished=false}={}){
 root.updateMatrixWorld(true);
 for(const level of[0,8,16])for(let facet=0;facet<6;facet++)for(let bay=0;bay<3;bay++){
  const door=level===0&&facet===1&&bay===1,u=23*(bay+.5)/3;
  for(const [dx,dy]of[[-.8,2.1],[.8,2.1],[-.8,4.95],[.8,4.95],[-.4,6.05],[.4,6.05]]){
   if(door&&dy>4.6)continue;
   for(const hits of crossing(root,facet,u+dx,level+dy,transform)){
    const opaque=hits.filter(h=>h.object.isMesh&&!materialAt(h).transparent);assert.equal(opaque.length,0,`Real ${finished?'finished near':'structural/far'} opening filled at facet${facet},bay${bay},level${level},sample${dx}/${dy}: ${opaque[0]?.object.name}`);
    if(!door)assert(hits.some(h=>materialAt(h)?.transparent),'Genuine glass is visible across the open arched window');apertureRays++;if(finished)innerRays++;
   }
  }
 }
 // Masonry must remain between the bays and in the arch's upper spandrel.
 for(const level of[0,8,16])for(let facet=0;facet<6;facet++)for(const[u,y]of[[7.6,3],[15.3,3],[23/6,7.05]])for(const hits of crossing(root,facet,u,level+y,transform)){assert(hits.some(h=>h.object.isMesh&&!materialAt(h).transparent),'Opaque limestone encloses each real opening from both sides');solidRays++;}
}
checkOpenings(garden.group);
// The original ground door retains its5.6m aperture and full body-height route.
function clearDoor(root,transform=null){root.updateMatrixWorld(true);for(const x of[122.8,123.9,125,126.1,127.2])for(const y of[.85,1.8,3.9])for(const direction of[-1,1]){let A={x,y,z:18.5},B={x,y,z:24};if(transform){A=transform(A);B=transform(B);}const a=new T.Vector3(A.x,A.y,A.z),b=new T.Vector3(B.x,B.y,B.z);if(direction<0){const q=a.clone();a.copy(b);b.copy(q);}const d=b.sub(a),len=d.length(),hits=new T.Raycaster(a,d.normalize(),.001,len-.001).intersectObject(root,true).filter(h=>h.object.isMesh);assert.equal(hits.length,0,'No pilaster, new arch, nameplate, glass or plinth crosses the unchanged ground door');doorRays++;}}
clearDoor(garden.group);
for(const o of garden.facade.meshes){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){assert(Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i)));assert(p.getY(i)>=-.0001&&p.getY(i)<=24.001);assert(Math.hypot(p.getX(i)-125,p.getZ(i))<25,'No new façade crosses the existing roof/planting reserve');}}
legacy.dispose();garden.dispose();

// All five underground wall levels retain their exact legacy pattern crops.
for(const pattern of['penrose','hexagonal','triangular','square','octagon-square','trihexagonal']){const a=createHouseWallTiling({pattern}),b=createHouseWallTiling({pattern,gardenFacade:true});assert.deepEqual(b.panels.filter(p=>p.level<0),a.panels.filter(p=>p.level<0));}

const network=buildSixfoldTransformationHouses(T,{canvas});network.group.updateMatrixWorld(true);assert.equal(network.instances.length,6);assert(network.prototype.facade);
for(const h of network.instances){
 for(const source of network.prototype.facade.meshes){const near=h.detail.getObjectByName(source.name),far=h.exterior.getObjectByName(source.name);assert(near&&far);assert.equal(near.geometry,source.geometry);assert.equal(far.geometry,source.geometry,'Near/far use the same actual facade geometry');for(const i of[0,Math.floor(source.geometry.attributes.position.count/2),source.geometry.attributes.position.count-1]){const p=new T.Vector3().fromBufferAttribute(source.geometry.attributes.position,i),q=houseToWorld(h,{x:p.x,y:p.y,z:p.z}),a=near.localToWorld(p.clone()),b=far.localToWorld(p.clone());close(a.x,q.x);close(a.y,q.y);close(a.z,q.z);close(b.x,q.x);close(b.y,q.y);close(b.z,q.z);}}
 h.setDetail(false);assert(h.exterior.visible&&!h.detail.visible);checkOpenings(h.exterior,p=>houseToWorld(h,p));clearDoor(h.exterior,p=>houseToWorld(h,p));
}
// Activate real compact interior stonework; looking only at an unfilled facade
// would miss the former rectangular tile field behind its new arched windows.
for(const index of[0,3]){const h=network.instances[index];h.setDetail(true);network.group.updateMatrixWorld(true);assert(h.tiling&&h.tiling.compact);checkOpenings(h.detail,p=>houseToWorld(h,p),{finished:true});clearDoor(h.detail,p=>houseToWorld(h,p));}
const watched=new Map(),watch=r=>{if(r&&!watched.has(r)){watched.set(r,0);r.addEventListener('dispose',()=>watched.set(r,watched.get(r)+1));}};
for(const m of network.prototype.facade.meshes){watch(m.geometry);watch(m.material);watch(m.material.map);}network.dispose();network.dispose();assert([...watched.values()].every(n=>n===1),'Shared source facade materials, buffers and grain dispose once after all six clones');
const standalone=buildSixfoldHouseFacade(T),resources=new Map();for(const m of standalone.meshes)for(const r of[m.geometry,m.material,m.material.map])if(r&&!resources.has(r)){resources.set(r,0);r.addEventListener('dispose',()=>resources.set(r,resources.get(r)+1));}standalone.dispose();standalone.dispose();assert([...resources.values()].every(n=>n===1));assert.equal(standalone.group.children.length,0);
console.log(`PASS sixfold garden facade: ${apertureRays} genuine window/door aperture rays (${innerRays} through activated compact finishes), ${solidRays} enclosing stone rays and ${doorRays} unchanged doorway-body rays; independent3092 legacy/walking hashes, all negative-level crops, shared near/far geometry/poses and bounded cleanup.`);
