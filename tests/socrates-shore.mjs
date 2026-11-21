import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildInterior} from '../src/city-source-assets/home-tools/home-interior.js';
import {SOCRATES_SITE as S} from '../src/socrates-site-model.js';
import {SHORE} from '../src/island-layout.js';
import {COAST_LANDMARKS} from '../src/coastal-map-data.js';
import {urbanBuildingFootprints} from '../src/city-urban-plan-model.js';
T.TextureLoader.prototype.load=()=>new T.Texture();
const raw=fs.readFileSync(new URL('../src/city-sources.js',import.meta.url),'utf8'),house=JSON.parse(raw.match(/const SOCRATES_STARTER=(\{[^\n]+\});/)[1]),before=JSON.stringify(house);
const scene=new T.Scene(),mesh=(g,m,x=0,y=0,z=0,p=scene)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o;},box=(w,h,d,m,x,y,z,p)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,p),cylinder=(a,b,h,m,x,y,z,p)=>mesh(new T.CylinderGeometry(a,b,h,12),m,x,y,z,p);
const w={window:null,CITY_CONFIG:{mountainEnabled:false,sixfoldHouses:true},CITY_SOURCES:{SOCRATES_STARTER:house,buildInterior,ARTISTS:[],buildArtCity:()=>({insideAt:()=>null,group:new T.Group(),colliders:[],houses:[],bounds:{minX:0,maxX:0,minZ:0,maxZ:0},canStand:()=>true}),buildObjectMarket:()=>({group:new T.Group(),bounds:{minX:0,maxX:0,minZ:0,maxZ:0},colliders:[],canStand:()=>true,update(){},suspend(){}})},createCityLandscape:()=>({canStand:()=>true,groundHeight:()=>null}),matchMedia:()=>({matches:true}),createCityRoad:()=>null};w.window=w;w.globalThis=w;
for(const f of['socrates-site.js','mountain-path.js','mountain-art.js','city.js'])vm.runInNewContext(fs.readFileSync(new URL('../src/'+f,import.meta.url),'utf8'),w);
const city=w.createGalleryCity(T,{scene,mesh,box,cylinder,torus(){},textSign(){return new T.Group();},materials:{}}),root=city.districts.find(d=>d.id==='socrates').group;root.updateWorldMatrix(true,true);
assert.deepEqual({...city.SOC},{x:S.x,z:S.z,scale:S.scale});assert.deepEqual({...city.landmarks.socrates},{...S.entry});assert(Math.hypot(S.entry.x-SHORE.x,S.entry.z-SHORE.z)<100,'The real front door is near the existing paper-boat landing');assert.equal(JSON.stringify(house),before,'Public content and source-local IDs remain untouched');assert.equal(house.rooms.length,6);
assert.deepEqual(COAST_LANDMARKS.find(x=>x.id==='socrates').point,[S.x,S.z]);const footprint=urbanBuildingFootprints().find(h=>h.id==='socrates');assert(footprint);
const bounds=new T.Box3().setFromObject(root);assert(bounds.max.x<532&&bounds.max.z<64,'House remains inside its shore-side hex and away from the promenade');assert(bounds.min.x>=Math.min(...footprint.points.map(p=>p[0]))-.03&&bounds.max.x<=Math.max(...footprint.points.map(p=>p[0]))+.03);assert(bounds.min.z>=Math.min(...footprint.points.map(p=>p[1]))-.03&&bounds.max.z<=Math.max(...footprint.points.map(p=>p[1]))+.03);
for(const route of S.approaches)for(let k=1;k<route.length;k++){const a=route[k-1],b=route[k],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.1);for(let i=0;i<=steps;i++)assert(city.canStand(a[0]+(b[0]-a[0])*i/steps,a[1]+(b[1]-a[1])*i/steps),'Actual source house leaves the whole new approach clear');}
const dir=new T.Vector3(0,0,-1);for(const side of[-.55,0,.55])for(const y of[.8,1.93]){const ray=new T.Raycaster(new T.Vector3(S.entry.x+side,y,S.entry.z),dir,0,5.5);assert.equal(ray.intersectObject(root,true).length,0,'The original doorway has real body clearance');}
assert(city.canStand(-97.7,104),'No source wall remains at the former house site');assert.equal(city.region(-97.7,104).id,'city');assert.equal(city.region(S.x-7*S.scale,S.z-.5*S.scale).id,'socrates');
console.log('PASS Socrates shore relocation: unchanged six-room source house/IDs, actual clear entrance and approach, matching landmark/map/footprint, paper boat proximity and no old-site walls.');
