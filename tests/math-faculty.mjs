import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildMathCity} from '../src/city-source-assets/home-tools/math-city-scene.js';
import {MATH_CONCEPTS} from '../src/city-source-assets/home-tools/math-city-data.js';
import {MATH_FACULTY as F,facultyCanStand,nativeMathShellNodes} from '../src/math-faculty-model.js';
import {buildMathFaculty} from '../src/math-faculty-scene.js';
import {verifyFacultyRoof} from './math-faculty-roof.mjs';
import {verifyFacultyArcade} from './math-faculty-arcade.mjs';
import {lowerMatrix,lowerPhysical} from '../src/world-cylinder-model.js';
import {buildWorldCylinder} from '../src/world-cylinder-scene.js';
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
// Independent 20c7ad1 baseline: retain every original instance except the 27
// raised slats, and enumerate only the 23 fitted support/coverage additions.
const rows=[],matrix=new T.Matrix4();b.group.traverse(o=>{if(o.isInstancedMesh)for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);rows.push({color:o.material.color.getHex(),matrix:[...matrix.elements]});}});
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex'),round=x=>Math.round(x*1e6)/1e6;
const timber=0x705b40,stone=0xc3b69a,addedSpecs=[
 [3.24,.22,3.85,-66.12,4.24,-2.175,timber],[.48,.165,3.85,-67.5,4.0475,-2.175,stone],[3.6,.22,3.4,-61.7,4.24,27.95,timber],
 [8.6,.24,.85,-80,4.06,21.925,timber],[3.8,.24,7.3,-82.4,4.06,26,timber],
 [.24,.22,6.24,-83.8,4.04,23,timber],[.24,.22,2.74,-76.2,4.04,21.25,timber],
 [.34,.01,.34,-83.8,3.935,14,stone],[.34,.01,.34,-76.2,3.935,14,stone],
 [.5,.0075,.5,-83.8,.12625,26,stone],[.24,3.8,.24,-83.8,2.03,26,timber],
 [.5,.0075,.5,-76.2,.12625,22.5,stone],[.24,3.8,.24,-76.2,2.03,22.5,timber],
 [.5,.04,.5,-60.3,.11,29.2,stone],[.24,4.1,.24,-60.3,2.18,29.2,timber],
 ...[-83.8,-76.2].flatMap(x=>[14,20].map(z=>[.34,.0075,.34,x,.12625,z,stone])),
 ...[11,22].map(z=>[.24,.0075,.24,-67.7,.12625,z,stone]),...[11,22].map(z=>[.24,.04,.24,-60.3,.11,z,stone])
];
const shape=r=>[r.matrix[0],r.matrix[5],r.matrix[10],r.matrix[12],r.matrix[13],r.matrix[14],r.color],matches=(r,s)=>shape(r).every((v,i)=>Math.abs(v-s[i])<2e-5),added=addedSpecs.map(s=>{const found=rows.filter(r=>matches(r,s));assert.equal(found.length,1,'One actual instance for each fitted part');return found[0];}),slats=rows.filter(r=>r.color===timber&&Math.abs(r.matrix[13]-4.41)<1e-5&&Math.abs(r.matrix[5]-.13)<1e-5);
assert.equal(slats.length,27);assert.equal(draws,33);assert.equal(instances,1989);
const {baselineRows,baseProbes,glassProbes,springProbes,doorProbes,assertArcadeReleased}=verifyFacultyArcade(T,b,rows);
const {rafters,roofSamples,bearingSamples,rimSamples,assertRoofReleased}=verifyFacultyRoof(T,b,baselineRows);
// Retain the earlier independent fingerprint, restoring ONLY the forty former
// rafter matrices for this historical comparison. Actual fitted profiles and
// all 1,678 other current instances have a separate physical/baseline check.
const oldRafters=[],oldPose=new T.Object3D();for(let i=0;i<40;i++){const a=i/40*Math.PI*2;oldPose.position.set(Math.cos(a)*40.75,9.595,Math.sin(a)*40.75);oldPose.rotation.set(0,-a,Math.atan2(-4.15,37.3));oldPose.scale.set(Math.hypot(37.3,4.15),.17,.16);oldPose.updateMatrix();oldRafters.push({color:timber,matrix:Array.from(new Float32Array(oldPose.matrix.elements))});}
const unchanged=[...baselineRows.filter(r=>!added.includes(r)&&!slats.includes(r)&&!rafters.includes(r)),...oldRafters].map(r=>JSON.stringify({color:r.color,matrix:r.matrix.map(round)})).sort();assert.equal(unchanged.length,1668);assert.equal(hash(unchanged),'6a9a527c496c092837ee85f233923131bae071a6e1c6df7ac42dd7f03945ad74','No unrelated original matrix/material changes');
const oldSolids=b.colliders.filter(c=>c.kind!=='connector corner post');assert.equal(hash(oldSolids),'b75bd2e076a3ec4caf1d111dddfa77f65323fdab2889563de28b6e35a7b170a0');assert.equal(b.colliders.length,22);assert.equal(hash(b.targets.map(o=>({name:o.name,data:o.userData,position:o.position.toArray()}))),'29e4a73c7cb930858590e6762bc661bea2717c4f84b2b7748d831f581b48ae19','All sixteen exact public Atlas/floor handoffs remain');
const bounds=r=>{const m=r.matrix;return{minX:m[12]-m[0]/2,maxX:m[12]+m[0]/2,minY:m[13]-m[5]/2,maxY:m[13]+m[5]/2,minZ:m[14]-m[10]/2,maxZ:m[14]+m[10]/2};},inside=(p,x,z,e=2e-5)=>x>=p.minX-e&&x<=p.maxX+e&&z>=p.minZ-e&&z<=p.maxZ+e;
const roofs=rows.filter(r=>r.color===timber&&Math.abs(r.matrix[13]-4.24)<1e-5&&Math.abs(r.matrix[5]-.22)<1e-5&&r.matrix[0]>3&&r.matrix[10]>.8||r.color===timber&&Math.abs(r.matrix[13]-4.06)<1e-5&&Math.abs(r.matrix[5]-.24)<1e-5).map(bounds);assert.equal(roofs.length,8);
let coverageSamples=0;
function covered(x,z){assert(roofs.some(r=>inside(r,x,z)),`Actual overhead cover at ${x},${z}`);if(source[0].canStand(x+80,z)&&facultyCanStand(x,z,.13,{colliders:oldSolids}))assert(b.canStand(x,z,.13),'Existing valid walking band remains clear');coverageSamples++;}
for(let i=1;i<route.points.length;i++){const a=route.points[i-1],c=route.points[i],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),n=Math.ceil(len/.2);for(let j=0;j<=n;j++)for(let offset=-2.8;offset<=2.801;offset+=.4)covered(a[0]+dx*j/n-dz/len*offset,a[1]+dz*j/n+dx/len*offset);}
for(const[x,z]of route.points.slice(1,-1))for(let dx=-2.8;dx<=2.801;dx+=.4)for(let dz=-2.8;dz<=2.801;dz+=.4)covered(x+dx,z+dz);
for(const index of[0,2,3,4]){const a=bounds(added[index]);for(const roof of roofs){if(Math.abs(a.minX-roof.minX)<1e-5&&Math.abs(a.minZ-roof.minZ)<1e-5)continue;const overlap=[Math.min(a.maxX,roof.maxX)-Math.max(a.minX,roof.minX),Math.min(a.maxY,roof.maxY)-Math.max(a.minY,roof.minY),Math.min(a.maxZ,roof.maxZ)-Math.max(a.minZ,roof.minZ)];assert(overlap.some(d=>d<2e-5),'New roof panels butt together without overlapping visible faces');}}
for(const slat of slats){const a=bounds(slat);assert(roofs.some(r=>inside(r,slat.matrix[12],slat.matrix[14])&&a.minY<r.maxY&&a.maxY>r.maxY),'Every lowered slat actually bears on its roof');}
const bearing=bounds(added[1]);near(bearing.minY,3.965);near(bearing.maxY,bounds(added[0]).minY);assert(inside(bearing,-67.5,-2));
near(bounds(added[0]).minX,-67.74);let roomSamples=0;
for(const model of source)for(let x=-11.7;x<=11.701;x+=.3)for(let z=-7.5;z<=7.501;z+=.3){if(!model.canStand(x,z))continue;const wx=x-80,feet=.13+model.height;for(const r of added){const a=bounds(r);assert(!(wx+.28>a.minX+1e-5&&wx-.28<a.maxX-1e-5&&z+.28>a.minZ+1e-5&&z-.28<a.maxZ-1e-5&&feet+1.8>a.minY+1e-5&&feet<a.maxY-1e-5),'No new part enters a valid original room walking envelope');}roomSamples++;}
for(const i of[7,8]){const cap=bounds(added[i]);near(cap.minY,3.93);near(cap.maxY,3.94);assert(roofs.some(r=>inside(r,added[i].matrix[12],14)&&Math.abs(r.minY-cap.maxY)<1e-5));}
for(const[post,beam]of[[10,5],[12,6]]){const p=bounds(added[post]),a=bounds(added[beam]);near(p.minY,.13);near(p.maxY,a.minY);assert(inside(a,added[post].matrix[12],added[post].matrix[14]));assert(roofs.some(r=>inside(r,added[post].matrix[12],added[post].matrix[14])&&r.minY<a.maxY));}
const lastPost=bounds(added[14]);near(lastPost.minY,.13);assert(roofs.some(r=>inside(r,-60.3,29.2)&&lastPost.maxY>r.minY&&lastPost.maxY<r.maxY));
// The real composition includes the original source court ABOVE the landscape.
// Test every foot corner against both owners through the proper half-turn.
const world=buildWorldCylinder(T),sourceGround=source[0].group.clone(true);sourceGround.position.set(-2240,.13,-65);world.lowerFrame.add(sourceGround);world.group.updateMatrixWorld(true);for(const index of[9,11,13,15,16,17,18,19,20,21,22]){const foot=bounds(added[index]);near(foot.maxY,.13);for(const x of[foot.minX,foot.maxX])for(const z of[foot.minZ,foot.maxZ]){const p=lowerPhysical({x:x-2160,z:z-65,y:.8}),hits=new T.Raycaster(new T.Vector3(p.x,p.y,p.z),new T.Vector3(0,1,0),0,1).intersectObjects([world.lowerGround,sourceGround],true);assert(hits.length);near(-96-hits[0].point.y,foot.minY);}}
sourceGround.removeFromParent();world.dispose();
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
b.dispose();b.dispose();assertRoofReleased();assertArcadeReleased();assert.equal(b.group.children.length,0);source.forEach(m=>m.dispose());
console.log(`PASS mathematics faculty: ${draws} draws / ${instances} instances, ${coverageSamples} full-width cover/clearance and ${roomSamples} unchanged room-envelope samples, ${roofSamples} fitted-rafter/${bearingSamples} bearing/${rimSamples} seated-rim probes, ${baseProbes} jamb/${glassProbes} rail-glass/${springProbes} springing/${doorProbes} doorway probes, 271 supported frame/return instances with all original 1718 matrices and IDs intact, scoped historical 1668/1678 fingerprints/19 original colliders/16 handoffs retained, eleven real ground-foot contacts and three-metre doorway, all 24 concepts, proper lower frame/clear oculus and owned cleanup`);
