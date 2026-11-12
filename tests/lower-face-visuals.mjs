import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildWorldCylinder} from '../src/world-cylinder-scene.js';
import {lowerPhysical} from '../src/world-cylinder-model.js';
import {facultyCanStand} from '../src/math-faculty-model.js';

const b=buildWorldCylinder(T);b.group.updateMatrixWorld(true);let draws=0,instances=0;
b.group.traverse(o=>{if(o.isMesh){draws++;assert(o.geometry.attributes.position.array.every(Number.isFinite));}if(o.isInstancedMesh){instances+=o.count;assert(o.instanceMatrix.array.every(Number.isFinite));}});
assert(draws<50,`Cylinder plus garden uses ${draws} mesh draws`);assert(b.lowerPatio.children.length<=11,'Courts, planting and shade must remain batched');assert(b.lowerPatio.children.every(o=>o.isInstancedMesh));assert(instances<8000,'Landscape complexity stays bounded');
const distance=(p,a,c)=>{const dx=c[0]-a[0],dz=c[1]-a[1],u=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(p.x-a[0]-dx*u,p.z-a[1]-dz*u);};
for(const o of b.lowerObstacles){
 assert(o.space==='logical-lower'&&o.x<-1000&&Number.isFinite(o.z)&&o.radius>0&&o.radius===o.r);
 const p={x:o.x+2160,z:o.z+65};assert(Math.hypot(p.x,p.z)>70,'The central gallery and its doorway remain free of new obstacles');
 for(const path of b.lowerPaths)for(let i=1;i<path.points.length;i++)assert(distance(p,path.points[i-1],path.points[i])>o.radius+path.width/2+.28,`${o.kind} blocks ${path.id}`);
}
// Existing entrance positions retain generous clearance. They are deliberately
// independent of the landscape so a shifted path cannot silently move a house.
for(const[x,z]of[[-2360,-65],[-2240,-32.2],[-2281,-58.2],[-2360,-115.15],[-2310,10.6],[-2310,-14.4],[-2310,-39.4],[-2300,-65]])for(const o of b.lowerObstacles)assert(Math.hypot(x-o.x,z-o.z)>o.radius+1.5,'An existing entry was obstructed');
// Ray through actual inverted scene geometry: every visible route receives a
// real, smooth, flush stone surface rather than a shader-only line.
for(const path of b.lowerPaths)for(let i=1;i<path.points.length;i++)for(let j=1;j<10;j++){
 const a=path.points[i-1],c=path.points[i],x=a[0]+(c[0]-a[0])*j/10,z=a[1]+(c[1]-a[1])*j/10,p=lowerPhysical({x:x-2160,z:z-65,y:.2});
 assert(facultyCanStand(x,z,.13),'The updated campus walk crosses the new faculty facade or a portico post');
 const hits=new T.Raycaster(new T.Vector3(p.x,p.y,p.z),new T.Vector3(0,1,0),0,.2).intersectObjects([b.lowerPatio,b.lowerLandscape.group],true);assert(hits.length,'A landscape route has no physical paving');assert(hits[0].point.y<=-96.025&&hits[0].point.y>=-96.14,'Paving and bridge stay below the established .13m walking reference');
}
const math=b.lowerPaths.find(p=>p.id==='garden-mathematics'),ramsey=b.lowerPaths.find(p=>p.id==='ramsey-reading-walk');assert.deepEqual(math.points.at(-1),[-80,32.8]);assert.deepEqual(ramsey.points.at(-1),[-121,6.8]);assert.deepEqual(b.lowerPaths.find(p=>p.id==='gallery-garden').points.slice(0,3),[[-58,0],[-64,0],[-64,18]],'The landscape must leave via the actual western portal before turning around the source wing');
const strata=b.group.getObjectByName('Cylinder edge · warm mineral strata');assert(strata&&strata.children.length===3);assert(strata.children.every(o=>o.isInstancedMesh));
assert(b.sectionCut?.userData.sectionOnly);assert.equal(b.sectionCut.visible,false,'The cutface must never appear in ordinary physical views');assert.equal(b.sectionCut.children.length,4);assert(b.sectionCut.children.every(o=>o.isInstancedMesh));
const cutRay=(x,y,z,dx,dy,dz,far=3)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(dx,dy,dz),0,far).intersectObject(b.sectionCut,true);
for(const x of[-569,-300,-59,59,300,569])for(const y of[-1,-20,-47,-70,-95])assert(cutRay(x,y,2,0,0,-1).length,'Every mineral panel must describe the actual cylinder thickness');
for(const x of[-57,0,57])for(const y of[-1,-20,-47,-70,-95])assert.equal(cutRay(x,y,2,0,0,-1).length,0,'The section must leave the central library/gallery shaft open');
b.sectionCut.rotation.y=Math.PI/3;b.group.updateMatrixWorld(true);const sample=b.sectionCut.localToWorld(new T.Vector3(300,-48,0)),normal=new T.Vector3(Math.sin(Math.PI/3),0,Math.cos(Math.PI/3));assert(new T.Raycaster(sample.clone().addScaledVector(normal,2),normal.clone().negate(),0,3).intersectObject(b.sectionCut,true).length,'The cutface must rotate with the overview camera');
const resources=[...b.owned];let releases=0;resources.forEach(r=>r.addEventListener('dispose',()=>releases++));b.dispose();assert.equal(releases,resources.length);assert.equal(b.group.children.length,0);
console.log(`PASS lower-face visual landscape: ${draws} total mesh draws / ${instances} instances, smooth courts and ${b.lowerPaths.length} connected walks, all new solids exposed, route/entry clearance, proper inverted paving rays, batched strata and complete owned cleanup`);
