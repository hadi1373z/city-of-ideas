import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {ESCHER_PAVILION as P,pavilionEntry,pavilionRearLink,pavilionFootprint,inPavilion} from '../src/escher-pavilion-model.js';
import {buildEscherPavilion} from '../src/escher-pavilion-scene.js';
import {ESCHER_WORKS,buildEscherHouse} from '../src/escher-house.js';
import {buildPerspectiveStairs,measurePerspective} from '../src/escher-perspective.js';
import {buildEscherDescent} from '../src/escher-descent.js';
import {DESCENT,descentParts} from '../src/escher-descent-model.js';
import {HOUSE_ORIGAMI,COAST_PATHS} from '../src/origami-house-math.js';
import {SEMINAR_HOUSES,SEMINAR_HOUSE_ARCHIVE,SEMINAR_PATHS,seminarEntry} from '../src/seminar-houses-data.js';
import {hexCentre} from '../src/city-hex-layout.js';
import '../src/artist-quarter-layout.js';
const near=(a,b,e=1e-6)=>assert(Math.abs(a-b)<e,`${a} differs from ${b}`),canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),centre=hexCentre(1,1),court=hexCentre(-1,3),plan=globalThis.ARTIST_QUARTER_PLAN;
near(P.x,centre.x);near(P.z,centre.z);near(plan.escher.x,P.x);near(plan.escher.z,P.z+1);near(plan.fronts.escher[0],pavilionEntry().x);near(plan.fronts.escher[1],pavilionEntry().z);
near(HOUSE_ORIGAMI.x,court.x);near(HOUSE_ORIGAMI.z,385);assert(HOUSE_ORIGAMI.entry.z>HOUSE_ORIGAMI.z);near(SEMINAR_HOUSES.find(h=>h.id==='noether').x,court.x-34);near(SEMINAR_HOUSES.find(h=>h.id==='cage').x,court.x+34);for(const h of SEMINAR_HOUSES){near(h.z,437);assert(seminarEntry(h).z<h.z);assert.equal(h.id==='mirzakhani',false);}assert(SEMINAR_HOUSE_ARCHIVE.some(h=>h.id==='mirzakhani'),'Retired lesson data remains archived');
for(const points of [...SEMINAR_PATHS,...COAST_PATHS.filter(r=>r.kind==='court-approach').map(r=>r.points)])assert(points.every(p=>p[1]>350),'Retired house approaches cannot remain in the Escher block');
const house=buildEscherPavilion(T,{works:ESCHER_WORKS,canvas,loadTexture:()=>new T.Texture()}),descent=buildEscherDescent(T),scene=new T.Group();scene.add(house.group,descent.group);house.setPassage(true,1);scene.updateMatrixWorld(true);
near(house.group.position.x,P.x);near(house.group.position.z,P.z+1);near(house.experimentOrigin.x,P.x);near(house.experimentOrigin.z,P.z+1);near(DESCENT.entry.x,228);near(DESCENT.entry.z,105.5);assert.deepEqual(DESCENT.shaft,{minX:223.8,maxX:229.2,minZ:90.6,maxZ:106.6});assert.equal(descentParts().filter(p=>p.kind==='flight').length,8);
const rear=pavilionRearLink();near(rear.maxZ,114.18430139592795);assert(pavilionFootprint().points.some(p=>p[1]===104),'Map/planting footprint includes the enclosed rear connection');assert(pavilionFootprint().points.some(p=>p[1]===96.1),'The unchanged shaft annex stays inside the roof/planting reserve');
const ray=(x,y,z,dx,dy,dz,far=50)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(dx,dy,dz),0,far).intersectObject(scene,true);
let bodyRays=0;for(const x of[227.45,228,228.55])for(let z=105.5;z<rear.gateZ+2;z+=.15){assert(house.canStand(x,z),`Rear link navigation blocked at ${x},${z}`);assert(ray(x,.8,z,0,-1,0,1).length,'The physical rear link is continuously supported');assert.equal(ray(x,.15,z,0,1,0,2.2).length,0,'Rear link retains full standing headroom');for(const y of[.35,1.15,1.93]){assert.equal(ray(x,y,z,0,0,1,.16).length,0,`A frame, course or shutter crosses the open rear route at ${x},${z}`);bodyRays++;}}
for(const z of[107,110,113])for(const sign of[-1,1])assert(ray(228,1.8,z,sign,0,0,2).length,'The real connector has closed side walls');
for(const z of[98,101,103])assert.equal(new T.Raycaster(new T.Vector3(228,1,z),new T.Vector3(0,-1,0),0,2).intersectObject(house.group,true).length,0,'Pavilion relocation does not cap the fixed first-flight shaft');
for(const [x,z]of[[P.x,P.z],[P.x-18,P.z-10],[P.x+18,P.z+10]]){assert(inPavilion(x,z));assert(ray(x,4,z,0,1,0,12).length,'Relocated court retains its real roof and glazing');}
for(const route of plan.routes.slice(-1))for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.3);for(let j=0;j<=n;j++)assert(house.canStand(a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n),'New surface approach crosses the pavilion wall');}
const stairs=buildPerspectiveStairs(T,house.group,house.experimentOrigin),camera=new T.PerspectiveCamera(66,16/9,.08,650);camera.position.set(stairs.viewpoint.x,stairs.viewpoint.y,stairs.viewpoint.z);camera.lookAt(new T.Vector3(stairs.focus.x,stairs.focus.y,stairs.focus.z));assert(measurePerspective(T,stairs,camera).aligned,'The experiment follows its actual new origin');camera.position.x+=1.7;camera.lookAt(new T.Vector3(stairs.focus.x,stairs.focus.y,stairs.focus.z));assert(!measurePerspective(T,stairs,camera).aligned,'A wrong viewpoint cannot solve the relocated activity');
const legacy=buildEscherHouse(T,{x:228,z:115,canvas,loadTexture:()=>new T.Texture()});assert.deepEqual(legacy.experimentOrigin,{x:228,z:115});assert.deepEqual(legacy.passageEntry,{x:228,z:108});legacy.dispose();stairs.dispose();house.dispose();descent.dispose();
console.log(`PASS Escher/house relocation: centred actual hexagon, fixed shaft and eight flights, ${bodyRays} supported body-route rays through enclosed off-axis link, moved live experiment, preserved legacy placement, three relocated houses/paths and retired Mirzakhani data`);
