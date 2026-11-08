import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {LOWER_COAST,LOWER_INLET,LOWER_COAST_WALKS,inLowerInlet,lowerLandscapeCanStand,routeDistance} from '../src/lower-landscape-model.js';
import {buildWorldCylinder} from '../src/world-cylinder-scene.js';
import {lowerPhysical} from '../src/world-cylinder-model.js';

const b=buildWorldCylinder(T),l=b.lowerLandscape;b.group.updateMatrixWorld(true);let probes=0,triangles=0,draws=0;
for(const p of b.lowerPaths)for(let i=1;i<p.points.length;i++){
 const a=p.points[i-1],c=p.points[i],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len;
 for(let j=0;j<=4;j++)for(const side of[-1,0,1]){const x=a[0]+dx*j/4+nx*side*(p.width/2-.3),z=a[1]+dz*j/4+nz*side*(p.width/2-.3);assert(l.canStand(x,z),`Water interrupts the full walking width of ${p.id} at ${x},${z}`);assert(Math.hypot(x,z)<565);probes++;}
}
// Every original source lot remains outside the new water envelope. These
// points cover the faculty wing, Ramsey, quiet garden, Objects and stations.
for(const[x,z]of[[-80,32.8],[-80,9.6],[-121,6.8],[-200,0],[-200,-50.15],[-150,75.6],[-150,50.6],[-150,25.6],[-140,0]]){assert(l.canStand(x,z));assert(!inLowerInlet(x,z,2));}
for(const[x,z]of[[120,-90],[180,-50],[235,-40],[360,-55],[420,-80]]){assert(inLowerInlet(x,z));assert(!l.canStand(x,z),'Open water is a real navigation boundary');}
// Both real timber decks restore continuous routes across that water.
assert(inLowerInlet(290,-32));assert(l.canStand(290,-32));const s=LOWER_COAST.shoreBridge;
for(let i=0;i<=720;i++){const a=i/720*Math.PI*2;for(const r of[534.4,536,537.6]){const x=Math.cos(a)*r,z=Math.sin(a)*r;assert(l.canStand(x,z),'The original shore promenade must remain a complete circuit');probes++;}}
for(const r of[534.4,536,537.6])for(let i=1;i<15;i++){
 const a=s.minAngle+(s.maxAngle-s.minAngle)*i/15,p=lowerPhysical({x:Math.cos(a)*r-2160,z:Math.sin(a)*r-65,y:.25});
 const hit=new T.Raycaster(new T.Vector3(p.x,p.y,p.z),new T.Vector3(0,1,0),0,.3).intersectObject(l.group,true).find(h=>Math.abs(h.point.y+96.13)<.001);assert(hit,'The shore crossing needs a physical .13m deck');
}
const main=LOWER_COAST_WALKS[0],shore=LOWER_COAST_WALKS[1];assert.deepEqual(main.points[0],[-191,-4]);assert.deepEqual(main.points.at(-1),[-101,85]);assert(routeDistance(...shore.points[0],main)<.01);assert.deepEqual(shore.points.at(-1),[LOWER_COAST.overlook.x,LOWER_COAST.overlook.z]);assert(l.canStand(...shore.points.at(-1)));
for(const mesh of l.group.children){if(!mesh.isMesh)continue;draws++;triangles+=(mesh.geometry.index?mesh.geometry.index.count:mesh.geometry.attributes.position.count)/3*(mesh.isInstancedMesh?mesh.count:1);assert(mesh.geometry.attributes.position.array.every(Number.isFinite));}
assert(draws<=16);assert(triangles<350000,`Lower landscape has ${triangles} triangles`);assert(l.stats.trees>100&&l.stats.trees<200);assert(l.stats.routeLength>1800&&l.stats.routeLength<2200);assert(l.group.getObjectByName('Batched individual leaves · open lower groves'));assert(l.group.getObjectByName('Batched visible forked trunks'));assert(!l.group.children.some(n=>/crown ball/i.test(n.name)));
// Host-owned guides may be attached later. Cylinder cleanup must not dispose
// their geometry, material or InstancedMesh-specific instance resources.
const foreignGeometry=new T.BoxGeometry(),foreignMaterial=new T.MeshBasicMaterial(),foreign=new T.InstancedMesh(foreignGeometry,foreignMaterial,1);let foreignDisposals=0;foreign.addEventListener('dispose',()=>foreignDisposals++);foreignGeometry.addEventListener('dispose',()=>foreignDisposals++);foreignMaterial.addEventListener('dispose',()=>foreignDisposals++);b.group.add(foreign);b.dispose();assert.equal(foreignDisposals,0);assert.equal(l.group.parent,null);assert.equal(l.group.children.length,0);foreign.dispose();foreignGeometry.dispose();foreignMaterial.dispose();
console.log(`PASS lower coast: ${probes} full-width/source/shore probes, two real level timber crossings, connected ${Math.round(l.stats.routeLength)}m circuit and overlook, ${l.stats.trees} branching leaf trees, ${draws} draws/${Math.round(triangles)} triangles, private/source lots unchanged and strict resource ownership`);
