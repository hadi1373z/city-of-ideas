import assert from 'node:assert/strict';import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {DESCENT as D,DESCENT_PARTS as PARTS,descentSurface,walkDescent,cutDescentGround} from '../src/escher-descent-model.js';import {buildEscherDescent} from '../src/escher-descent.js';
import {buildCityCoast} from '../src/coastal-city-scene.js';
const built=buildEscherDescent(T);built.group.updateWorldMatrix(true,true);const ray=(x,y,z,d)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(...d),0,50).intersectObject(built.group,true);
for(const p of PARTS.filter(p=>p.kind==='flight'))for(let i=0;i<40;i++)for(const offset of[-.55,0,.55]){
 const z=p.start+(p.end-p.start)*(i+.5)/40,y=p.top+(p.bottom-p.top)*(i+1)/40,x=p.x+offset,down=ray(x,y+1.8,z,[0,-1,0]),up=ray(x,y+1.8,z,[0,1,0]);assert(down.length);assert(Math.abs(down[0].point.y-y)<1e-4,'Every full-width tread is physical');assert(up.length&&up[0].point.y>=y+2.1,'Each tread has real headroom');assert(descentSurface(x,z,y));
}
const points=[[228,105.5]];for(let i=0;i<8;i++){const north=i%2===0;points.push([D.lanes[i%2],north?91.3:104.7]);if(i<7)points.push([D.lanes[(i+1)%2],north?91.3:104.7]);}points.push([225,106.85]);
const player={x:228,z:105.5,y:1.93};function to([x,z]){let count=0;while(Math.hypot(player.x-x,player.z-z)>.008){if(count++>1000)throw Error('Stuck at '+JSON.stringify(player)+' target '+[x,z]);const d=Math.hypot(x-player.x,z-player.z),s=Math.min(.045,d);walkDescent(player,(x-player.x)/d*s,(z-player.z)/d*s);}}
for(const p of points.slice(1))to(p);assert(Math.abs(player.y-1.8-D.bottom)<1e-6);for(const p of points.toReversed().slice(1))to(p);assert(Math.abs(player.y-1.93)<1e-6,'All eight flights reverse continuously without a door jump');
const held={x:228,z:91.3,y:PARTS.find(p=>p.id==='landing-0').y+1.8};for(let i=0;i<200;i++)walkDescent(held,0,-.2);assert(held.z-D.shaft.minZ>=.3-1e-5,'Held forward movement retains body clearance at the north wall');
const nearWall=ray(held.x,held.y,held.z,[0,0,-1]);assert(nearWall.length&&nearWall[0].distance>.08,'The wall remains beyond the actual camera near plane');
const plane=new T.PlaneGeometry(30,30).rotateX(-Math.PI/2).translate(228,0,100),cut=cutDescentGround(T,plane),mesh=new T.Mesh(cut,new T.MeshBasicMaterial({side:T.DoubleSide}));mesh.updateMatrixWorld(true);
for(const z of[97,99,102,104.5])assert.equal(new T.Raycaster(new T.Vector3(228,3,z),new T.Vector3(0,-1,0)).intersectObject(mesh).length,0,'The actual ground triangles are absent over the flight');
assert(new T.Raycaster(new T.Vector3(231,3,100),new T.Vector3(0,-1,0)).intersectObject(mesh).length,'Adjacent earth stays opaque');plane.dispose();cut.dispose();mesh.material.dispose();built.dispose();console.log('PASS: all 320 actual treads at three widths, enclosed headroom, continuous reversible 40.13m descent and actual surface opening.');
const priorWindow=globalThis.window;globalThis.window={CITY_CONFIG:{escherEntryCut:D.cut}};const coast=buildCityCoast(T,{naturalTrees:null});if(priorWindow===undefined)delete globalThis.window;else globalThis.window=priorWindow;coast.group.updateWorldMatrix(true,true);
for(const z of[97,99,102,104.5])for(const x of[227.4,228,228.6])assert.equal(new T.Raycaster(new T.Vector3(x,.8,z),new T.Vector3(0,-1,0),0,1).intersectObject(coast.group,true).length,0,'All real coast, civic grass and paving layers must open over the first flight');
assert.equal(coast.urban.lawn.geometry.groups.length,2,'Clipping retains the two original grass material groups');coast.dispose();
