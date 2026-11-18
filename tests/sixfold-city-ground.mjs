import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {SIXFOLD_HOUSES,sixfoldWellHoles} from '../src/sixfold-house-network-model.js';
import {cutHouseWell,configuredHouseWells} from '../src/transformation-house-model.js';
import {buildCityCoast} from '../src/coastal-city-scene.js';

const configScope={window:{},document:{documentElement:{dataset:{}}}};
vm.runInNewContext(readFileSync(new URL('../src/city-config.js',import.meta.url),'utf8'),configScope);
const config=configScope.window.CITY_CONFIG,wells=configuredHouseWells(config);
assert(config.sixfoldHouses);assert.equal(config.houseWell,null);assert.equal(wells.length,6);
for(let i=0;i<6;i++){assert(Math.hypot(wells[i].x-SIXFOLD_HOUSES[i].x,wells[i].z-SIXFOLD_HOUSES[i].z)<1e-9);assert.equal(wells[i].radius,10.3);}

const source=readFileSync(new URL('../src/gallery.js',import.meta.url),'utf8'),annulus=source.slice(source.indexOf('function annulus('),source.indexOf('\nfunction galleryRing(')),creation=source.match(/const galleryPlinth=annulus[^\n]+/)[0],scene=new T.Scene(),material=new T.MeshLambertMaterial();
const mesh=(geometry,material,x=0,y=0,z=0,parent=scene)=>{const m=new T.Mesh(geometry,material);m.position.set(x,y,z);parent.add(m);return m;};
const scope={THREE:T,scene,inner:28,outer:58,mainBuildingTargets:[],materials:{dark:material},window:{CITY_CONFIG:config},mesh};
vm.runInNewContext(annulus+'\n'+creation+'\nresult=galleryPlinth;',scope);
const plinth=scope.result;plinth.applyMatrix4(new T.Matrix4().makeRotationY(Math.PI/2));
const citySource=readFileSync(new URL('../src/city.js',import.meta.url),'utf8'),foundationLine=citySource.match(/const islandShape=[^\n]+/)[0],foundationScope={T,window:{CITY_CONFIG:config},city:new T.Group(),mesh};
vm.runInNewContext(foundationLine+'\nresult=islandBase;',foundationScope);
const foundation=foundationScope.result;
const oldWindow=globalThis.window;globalThis.window={CITY_CONFIG:config};
const coast=buildCityCoast(T,{naturalTrees:null});
if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;
const surfaces=[coast.land,foundation,plinth];for(const s of surfaces)s.updateMatrixWorld(true);
const hits=(s,x,z)=>new T.Raycaster(new T.Vector3(x,1,z),new T.Vector3(0,-1,0),0,3).intersectObject(s);
for(const h of wells){for(const r of[0,4,8,9.8])for(let i=0;i<18;i++){const a=(i+.19)*Math.PI/9,x=h.x+r*Math.cos(a),z=h.z+r*Math.sin(a);for(const s of surfaces)assert.equal(hits(s,x,z).length,0,'Live shaft is capped by '+s.name+' at '+x+','+z);}
 // These points are inside the153m plinth and inside a159m-centred well.
 // They specifically prove a genuine outer notch, not an invalid outside hole.
 const angle=Math.atan2(h.z,h.x),x=h.x-9.5*Math.cos(angle),z=h.z-9.5*Math.sin(angle);assert(Math.hypot(x,z)<153);assert.equal(hits(plinth,x,z).length,0);
 for(let i=0;i<12;i++){const a=(i+.13)*Math.PI/6,x=h.x+12*Math.cos(a),z=h.z+12*Math.sin(a);assert(hits(coast.land,x,z).length);assert(hits(foundation,x,z).length);if(Math.hypot(x,z)<152.5)assert(hits(plinth,x,z).length,'Plinth beside a notch stays solid');}}
for(const s of surfaces)assert(hits(s,125,0).length,'The retired125m well must be solid in the live city');
assert.equal(hits(plinth,0,0).length,0,'Babel remains open');

const plane=new T.PlaneGeometry(450,450,12,12).rotateX(-Math.PI/2),original=Array.from(plane.attributes.position.array),cut=cutHouseWell(T,plane,sixfoldWellHoles()),pos=cut.attributes.position,uv=cut.attributes.uv;
for(let i=0;i<pos.count;i++){assert(Math.abs(uv.getX(i)-(pos.getX(i)+225)/450)<2e-6);assert(Math.abs(uv.getY(i)-(225-pos.getZ(i))/450)<2e-6);}
assert.deepEqual(Array.from(plane.attributes.position.array),original,'Borrowed original triangles are unchanged');
assert.equal(configuredHouseWells({houseWell:{x:125,z:0,radius:10.3}}).length,1);
assert.throws(()=>configuredHouseWells({houseWells:[{x:0,z:0,radius:-1}]}));
plane.dispose();cut.dispose();coast.dispose();foundation.geometry.dispose();plinth.geometry.dispose();material.dispose();
console.log('PASS six live ground shafts: exact ring configuration, real coast/foundation cuts, analytic153m plinth notches, retired125m hole closed, Babel retained, interpolated attributes and preserved source geometry');
