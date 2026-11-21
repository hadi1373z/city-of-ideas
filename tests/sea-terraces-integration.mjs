import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {installSeaTerraces} from '../src/sea-terraces.js';
import {SEA_TERRACES as S,SEA_TERRACE_PATHS,seaTerraceWorld,seaTerraceFloorAt,seaTerraceLocal} from '../src/sea-terraces-model.js';
import {SEA_TERRACE_APPROACHES} from '../src/sea-terraces-access.js';
import {buildCityCoast} from '../src/coastal-city-scene.js';
import {buildCityPlaces} from '../src/city-places-scene.js';
import {pointSegmentDistance} from '../src/honeycomb-city-model.js';

const source=name=>readFileSync(new URL('../src/'+name,import.meta.url),'utf8'),scope={window:{CITY_CONFIG:{mountainEnabled:false,sixfoldHouses:true}},console,matchMedia:()=>({matches:true})};vm.createContext(scope);
for(const file of['gallery-forecourt-data.js','city-road-surface.js','city-landscape.js','mountain-path.js','mountain-art.js','city.js']){vm.runInContext(source(file),scope);Object.assign(scope,scope.window);}
const scene=new T.Scene(),sourceT={...T,TextureLoader:class{load(){return new T.Texture();}}},mesh=(g,m,x=0,y=0,z=0,parent=scene)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;};
const native=scope.window.createGalleryCity(sourceT,{scene,mesh,box:(w,h,d,m,x,y,z,p)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,p),cylinder(){},torus(){},textSign:(_a,_b,_c,_d,p)=>{const o=new T.Group();p.add(o);return o;},materials:{},siteTiles:new T.MeshLambertMaterial()});
const coast=buildCityCoast(T,{naturalTrees:null,heightAt:native.landscape.groundHeight}),canvasFactory=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),places=buildCityPlaces(T,{canvasFactory});scene.add(coast.group,places.group);
const M={scene,mode:'city',eye:1.8,player:{x:S.x,y:1.93,z:S.z+92,yaw:0,pitch:0},city:native,origamiHouse:{coast},extraGround:()=>undefined,startExtra:()=>false,clearMovement(){},setCityMode(){this.mode='city';},arrive(p){Object.assign(this.player,p,{y:p.y+this.eye});}};
const nativeCan=native.canStand;native.canStand=(x,z)=>nativeCan(x,z)&&coast.canStand(x,z,M.player.y-M.eye)&&places.canStand(x,z);const previous={can:native.canStand,ground:M.extraGround,start:M.startExtra};
const installed=installSeaTerraces(M,T,{events:{addEventListener(){},removeEventListener(){}}});scene.updateMatrixWorld(true);
// Execute the actual native source mover and ground-height resolver. A test
// which calls only the pure terrace model would miss the wrapper/feet handoff.
const gallery=source('gallery.js'),ground=gallery.slice(gallery.indexOf('function cityGroundHeight('),gallery.indexOf('function moveOnSharedGround(')),move=gallery.slice(gallery.indexOf('function moveOnSharedGround('),gallery.indexOf('function updateSharedVisit('));
const moveNative=new Function('window','sharedCity','player','eye','THREE','let visitMode="city",outer=58;'+ground+move+'return moveOnSharedGround;')({CITY_MAIN:M},native,M.player,M.eye,T);
const near=(a,b,e=.0002)=>assert(Math.abs(a-b)<e,a+' != '+b),supports=[installed.built.terrain,installed.access.group,...places.sites.map(s=>s.root),...coast.group.children.filter(o=>o.isMesh&&o.name.endsWith('paving batch'))];let moves=0,physical=0,body=0;
function drive(points){for(let j=1;j<points.length;j++){const a=points[j-1],b=points[j],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),n=Math.max(1,Math.ceil(length/.15));for(let i=0;i<n;i++){
  const before={...M.player};moveNative(dx/n,dz/n);near(M.player.x,before.x+dx/n);near(M.player.z,before.z+dz/n);const feet=M.player.y-M.eye,expected=seaTerraceFloorAt(M.player.x,M.player.z)??.13;near(feet,expected);assert(Math.abs(feet-(before.y-M.eye))<.035,'Native input rises continuously only on real ramps');moves++;
  const hits=[[0,0],[.0002,0],[-.0002,0],[0,.0002],[0,-.0002]].flatMap(([dx,dz])=>new T.Raycaster(new T.Vector3(M.player.x+dx,feet+.17,M.player.z+dz),new T.Vector3(0,-1,0),.001,.31).intersectObjects(supports,true)),owned=seaTerraceFloorAt(M.player.x,M.player.z)!==null||SEA_TERRACE_APPROACHES.some(r=>r.points.slice(1).some((b,i)=>pointSegmentDistance(M.player.x,M.player.z,r.points[i],b)<.01));assert(hits.some(h=>Math.abs(h.point.y-feet)<(owned ? .003 : .13)),'Every native-mover sample has actual supporting stone '+JSON.stringify({x:M.player.x,z:M.player.z,feet,owned,ys:hits.map(h=>h.point.y)}));physical++;
  const direction=new T.Vector3(dx,0,dz).normalize(),side=new T.Vector3(-direction.z,0,direction.x);for(const y of[.85,1.8])for(const offset of[-.26,0,.26]){const start=new T.Vector3(before.x,Math.max(before.y-M.eye,feet)+y,before.z).addScaledVector(side,offset),far=Math.hypot(dx/n,dz/n);const blocked=new T.Raycaster(start,direction,.001,Math.max(.001,far-.001)).intersectObjects([installed.built.group,places.group],true).filter(h=>h.object.isMesh);assert.equal(blocked.length,0,'Actual native route leaves human body/head clear '+JSON.stringify({start:start.toArray(),point:[M.player.x,M.player.z],hits:blocked.slice(0,3).map(h=>({object:h.object.name,point:h.point.toArray()}))}));body++;}
 }}}
M.arrive({x:S.x,z:S.z+92,y:.13});const approach=SEA_TERRACE_APPROACHES[0].points;drive([[S.x,S.z+92],approach[0]]);drive(approach);
const central=SEA_TERRACE_PATHS.find(p=>p.id==='sea-terrace-central-ramp').points;drive(central);near(M.player.y-M.eye,.61);drive([...central].reverse());drive([...approach].reverse());
for(const sign of[-1,1]){const ramp=SEA_TERRACE_PATHS.find(p=>p.id==='sea-terrace-level-return-'+sign).points;M.arrive({...seaTerraceWorld(sign*34,22.5,.13)});drive(ramp);near(M.player.y-M.eye,.61);drive([...ramp].reverse());const shore=SEA_TERRACE_APPROACHES.find(p=>p.id==='sea-terraces-shore-'+sign);const a=seaTerraceWorld(sign*34,44.5,.13);M.arrive(a);drive(shore.points);drive([...shore.points].reverse());}
// Raised level lips are not alternative stairs, including a grass exit.
for(const sign of[-1,1]){const lower=seaTerraceWorld(sign*10,28.9,.13),upper=seaTerraceWorld(sign*10,29.1);M.arrive(lower);assert(!M.city.canStand(upper.x,upper.z));}
M.arrive(seaTerraceWorld(30,46.95,seaTerraceFloorAt(...Object.values(seaTerraceWorld(30,46.95)))));const outside=seaTerraceWorld(30,47.1);assert(!M.city.canStand(outside.x,outside.z),'Native collision wrapper rejects stepping off a raised side lip');
assert(M.startExtra('sea-terraces'));near(seaTerraceLocal(M.player.x,M.player.z).u,0);near(M.player.y-M.eye,.13);assert.equal(native.region(M.player.x,M.player.z).id,S.id);assert.equal(M.extraGround(0,0),undefined);
installed.dispose();assert.equal(native.canStand,previous.can);assert.equal(M.extraGround,previous.ground);assert.equal(M.startExtra,previous.start);places.dispose();coast.dispose();
console.log('PASS Sea Terraces native integration: '+moves+' actual gallery-mover input steps, '+physical+' real supported-floor probes, '+body+' body/head rays; two-way central and end ramps, source Listening Court approach, both shore exits, level lips/raised grass exit rejected, actual wrapper/feet handoff and cleanup.');
