import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {SIXFOLD_HOUSES} from '../src/sixfold-house-network-model.js';
import {POND_WORLD_WINDOW as pond,pondDescriptor} from '../src/pond-world-window-model.js';

const config={window:{},document:{documentElement:{dataset:{}}}};vm.runInNewContext(readFileSync(new URL('../src/city-config.js',import.meta.url),'utf8'),config);
const site=config.window.CITY_CONFIG.parkSite;assert.equal(site.z,-375);assert.equal(pond.z,site.z);assert.equal(pondDescriptor(site).entry.z,pond.entry.z);
const context=new Proxy({measureText:t=>({width:t.length*12})},{get:(o,k)=>o[k]??(()=>{})}),scope={window:{CITY_CONFIG:config.window.CITY_CONFIG},innerWidth:1200,document:{createElement:()=>({getContext:()=>context})},console};vm.createContext(scope);
vm.runInContext(readFileSync(new URL('../src/park-data.js',import.meta.url),'utf8'),scope);scope.PARK_DATA=scope.window.PARK_DATA;vm.runInContext(readFileSync(new URL('../src/park.js',import.meta.url),'utf8'),scope);
const park=scope.window.buildIdeaPark(T);assert.equal(park.stats.people,scope.PARK_DATA.catalogue.people.length,'Every original person remains in the source park');
const localPeople=Array.from(park.personPositions,([id,p])=>[id,{...p}]);park.group.position.set(site.x,.015,site.z);park.group.scale.setScalar(site.scale);park.group.updateMatrixWorld(true);
const crownColours=new Set([0x6e8e65,0x8da174,0xb1af73]),matrix=new T.Matrix4(),world=new T.Matrix4(),box=new T.Box3();let crowns=0;
park.group.traverse(o=>{if(!o.isInstancedMesh||!crownColours.has(o.material.color?.getHex()))return;o.geometry.computeBoundingBox();for(let i=0;i<o.count;i++){
 o.getMatrixAt(i,matrix);world.multiplyMatrices(o.matrixWorld,matrix);box.copy(o.geometry.boundingBox).applyMatrix4(world);crowns++;
 for(const h of SIXFOLD_HOUSES){const dx=Math.max(box.min.x-h.x,0,h.x-box.max.x),dz=Math.max(box.min.z-h.z,0,h.z-box.max.z);assert(Math.hypot(dx,dz)>25,'A real park crown cannot enter '+h.id+' house');}
 for(const x of[box.min.x,box.max.x])for(const z of[box.min.z,box.max.z])assert(Math.hypot(x,z)<533,'The moved garden crowns leave the real coastal promenade clear');
}});assert(crowns>1000,'Check the actual instanced park tree crowns, not only tree centres');
assert.deepEqual(Array.from(park.personPositions,([id,p])=>[id,{...p}]),localPeople,'The presentation move never rewrites source person locations');
// A real top-level translation moves every local object, including seed and
// tool anchors, by exactly45m while preserving its source-local coordinates.
for(const map of[park.personPositions,park.districtPositions,park.seedPositions,park.landmarks])for(const p of map.values()){if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.z))continue;const a=new T.Vector3(p.x,0,p.z).multiplyScalar(.65).add(new T.Vector3(0,.015,-330)),b=new T.Vector3(p.x,0,p.z).applyMatrix4(park.group.matrixWorld);assert(Math.abs(b.x-a.x)<1e-8&&Math.abs(b.z-a.z+45)<1e-8);}
console.log(`PASS complete park presentation: ${park.stats.people} original people, ${crowns} actual tree crowns clear six roofs and the coast, unchanged source anchors, matching pond/crossing transform and one45m move`);
