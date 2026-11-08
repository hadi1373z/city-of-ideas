import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildMathCity} from '../src/city-source-assets/home-tools/math-city-scene.js';
import {MATH_CONCEPTS} from '../src/city-source-assets/home-tools/math-city-data.js';
import {MATH_FACULTY as F,facultyCanStand,nativeMathShellNodes} from '../src/math-faculty-model.js';
import {buildMathFaculty} from '../src/math-faculty-scene.js';
import {lowerMatrix,lowerPhysical} from '../src/world-cylinder-model.js';
const ctx=new Proxy({},{get:()=>()=>{}}),canvas=()=>({getContext:()=>ctx}),near=(a,b,e=1e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
const source=Array.from({length:8},(_,floor)=>buildMathCity(T,{floor})),before=source.map(m=>({position:m.group.position.clone(),children:[...m.group.children],colliders:JSON.stringify(m.colliders),approaches:JSON.stringify(m.approaches)}));
const b=buildMathFaculty(T,{canvas});b.group.updateMatrixWorld(true);let draws=0,instances=0;
b.group.traverse(o=>{if(o.isMesh){draws++;assert(o.geometry.attributes.position.array.every(Number.isFinite));}if(o.isInstancedMesh){instances+=o.count;assert(o.instanceMatrix.array.every(Number.isFinite));}});assert(draws<40,`Faculty uses ${draws} mesh draws`);assert(instances<2000);
assert.equal(F.wellRadius,21.5);assert.equal(F.wing.x,-80);assert.equal(F.wing.logicalX,-2240);assert.equal(F.wing.entry.z,9.6);assert.equal(F.wing.spawn.z,32.8);assert.equal(F.wing.lift.x,-70.4);
const ray=(x,y,z,dx,dy,dz,far=50)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(dx,dy,dz),0,far).intersectObject(b.group,true);
for(const r of[0,14.4,16,17.6,19,21.2])for(let i=0;i<12;i++){const a=i*Math.PI/6;assert.equal(ray(Math.cos(a)*r,.2,Math.sin(a)*r,0,1,0,40).length,0,'The faculty must leave the complete central well/oculus physically clear');}
const roof=ray(35,1.93,0,0,1,0,20);assert(roof.length&&roof[0].point.y>7.5&&roof[0].point.y<12,'Existing gallery columns receive a real annular roof');
assert.equal(ray(-56,1.93,0,-1,0,0,10).length,0,'The lower west doorway remains genuinely open');assert(ray(58,1.93,8,1,0,0,8).length,'The rotunda has a real exterior facade');
const route=F.connector;for(let i=1;i<route.points.length;i++)for(let j=0;j<=30;j++){
 const a=route.points[i-1],c=route.points[i],x=a[0]+(c[0]-a[0])*j/30,z=a[1]+(c[1]-a[1])*j/30;
 assert(facultyCanStand(x,z,.13),'New architecture blocks its own connector');assert(source[0].canStand(x+80,z),'Connector must respect the real source ground-floor collision model');const floor=ray(x,.8,z,0,-1,0,1);assert(floor.length);near(floor[0].point.y,.13);
}
assert(!facultyCanStand(60.2,0,.13));assert(facultyCanStand(-60.2,0,.13));assert(!facultyCanStand(-83.8,14,.13));assert(facultyCanStand(-83.8,14,8.13),'Low exterior posts must not block upper source floors');
// A photograph of the lab glazing was mistaken for a door. Test the complete
// actual source passage, not merely the connector's exterior arrival point.
const composition=new T.Group(),nativeGround=source[0].group.clone(true);nativeGround.position.set(-80,.13,0);composition.add(nativeGround,b.group);composition.updateMatrixWorld(true);
for(let offset=-1.5;offset<=1.501;offset+=.25){
 for(let z=20;z>=-7.4;z-=.08){assert(source[0].canStand(offset,z),'The native ground hall must be reachable through the centre doorway');assert(b.canStand(-80+offset,z,.13),'Open leaves must preserve a full three-metre central route');}
 for(const y of[.4,1,1.8,2])assert.equal(new T.Raycaster(new T.Vector3(-80+offset,y,20),new T.Vector3(0,0,-1),0,27.2).intersectObject(composition,true).length,0,'The doorway must have no glass, sill, panel or frame across its three-metre clear passage');
 for(const y of[.4,1,1.8,2])assert.equal(new T.Raycaster(new T.Vector3(-80+offset,y,-7.2),new T.Vector3(0,0,1),0,27.2).intersectObject(composition,true).length,0,'The same doorway must be physically open from the library to the forecourt');
}
for(const sign of[-1,1]){const guide=new T.Raycaster(new T.Vector3(-80+sign*1.54,.8,5.3),new T.Vector3(0,-1,0),0,1).intersectObject(composition,true);assert(guide.length&&guide[0].point.y>.160,'Exit guides must remain visible above the real source hall finish');assert(!b.canStand(-80+sign*1.99,9.48,.13),'The parked open leaf must still be a real side obstacle');assert(b.canStand(-80+sign*1.99,9.48,4.13),'Ground-floor doors must not block upper floors');}
assert(new T.Raycaster(new T.Vector3(-72,1.8,12),new T.Vector3(0,0,-1),0,6).intersectObject(composition,true).length,'The lab bay remains a window, rather than a false second doorway');
for(const model of source.slice(1))assert(!model.canStand(0,8),'Upper floors keep their genuinely closed facade and existing lift route');
b.group.removeFromParent();composition.clear();
const atlas=b.targets.filter(t=>t.userData.mathAction==='atlas'),floor=b.targets.filter(t=>t.userData.mathAction==='floor');assert.equal(atlas.length,8);assert.equal(floor.length,8);assert.deepEqual(atlas.map(t=>t.userData.floorIndex).sort(),[0,1,2,3,4,5,6,7]);assert.deepEqual(floor.map(t=>t.userData.targetFloor).sort(),[0,1,2,3,4,5,6,7]);
const originalConcepts=new Set(source.flatMap(m=>m.approaches.map(a=>a.conceptId).filter(Boolean)));assert.equal(originalConcepts.size,24);assert.deepEqual([...originalConcepts].sort(),MATH_CONCEPTS.map(c=>c.id).sort());
const shell=nativeMathShellNodes(source);assert(shell.length>200);assert(shell.every(o=>(o.userData.window===true||o.userData.roof===true)&&!o.userData.floorSurface&&!o.userData.mathAction));assert(shell.every(o=>!o.isInstancedMesh),'Mixed source instance batches must never be hidden');
source.forEach((m,i)=>{assert.deepEqual(m.group.position,before[i].position);assert.deepEqual(m.group.children,before[i].children);assert.equal(JSON.stringify(m.colliders),before[i].colliders);assert.equal(JSON.stringify(m.approaches),before[i].approaches);});
const frame=new T.Group();frame.matrixAutoUpdate=false;frame.matrix.copy(lowerMatrix(T));b.group.position.set(-2160,0,-65);frame.add(b.group);frame.updateMatrixWorld(true);const centre=b.group.localToWorld(new T.Vector3(0,0,0));near(centre.x,0);near(centre.y,-96);near(centre.z,0);const entry=b.group.localToWorld(new T.Vector3(-80,.13,9.6)),expected=lowerPhysical({x:-2240,y:.13,z:-55.4});near(entry.x,expected.x);near(entry.y,expected.y);near(entry.z,expected.z);
b.dispose();b.dispose();assert.equal(b.group.children.length,0);source.forEach(m=>m.dispose());
console.log(`PASS mathematics faculty: ${draws} draw meshes / ${instances} instances, clear oculus and western portal, real covered connector and three-metre open-leaf source entrance, all 24 original concepts and eight floor actions, exact safe shell filtering, proper lower frame and owned cleanup`);
