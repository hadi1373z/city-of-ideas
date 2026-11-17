import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {createExtraDistricts} from '../src/extra-districts.js';
import {buildHome} from '../src/home-editions-scene.js';
import {starter,GRID} from '../src/city-source-assets/home-tools/model.js';
import {MAX_HOMES} from '../src/city-source-assets/home-tools/neighborhood.js';
import {buildArtCity} from '../src/city-source-assets/home-tools/art-city-scene.js';
import {installWorldCylinder} from '../src/world-cylinder.js';
import {WORLD_CYLINDER as W,lowerMatrix,lowerPhysical} from '../src/world-cylinder-model.js';
import {NIGHT_HOME_PARCELS,nightHomeTransform,nightHomeAccess,nightHomeParcelClear,nightHomeRoadSegments} from '../src/night-home-layout.js';
import {buildLowerLandscape} from '../src/lower-landscape-scene.js';
import {lowerLandscapeCanStand} from '../src/lower-landscape-model.js';

const context=new Proxy({measureText:t=>({width:String(t).length*12})},{get:(o,k)=>o[k]??(()=>{})});
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this.open=false;this.hidden=false;this.style={};this._text='';}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
 setAttribute(k,v){this.attributes[k]=String(v);}addEventListener(k,fn){this.events[k]=fn;}getContext(){return context;}focus(){}
 matches(s){if(s==='dialog[open]')return this.tagName==='dialog'&&this.open;const visible=s.match(/^#([^:]+):not\(\[hidden\]\)$/);if(visible)return this.id===visible[1]&&!this.hidden;if(s.startsWith('#'))return this.id===s.slice(1);if(s.startsWith('.'))return this.className===s.slice(1);return this.tagName===s;}
 querySelectorAll(s){const out=[],queries=s.split(',').map(s=>s.trim()),visit=n=>{for(const c of n.children){if(queries.some(q=>c.matches(q)))out.push(c);visit(c);}};visit(this);return out;}querySelector(s){return this.querySelectorAll(s)[0]??null;}
}
const body=new Element('body'),debug=new Element('div');debug.id='world';body.append(debug);for(const cls of['welcome-secondary','map-directions']){const n=new Element('div');n.className=cls;body.append(n);}
globalThis.document={body,hidden:false,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s),getElementById:id=>body.querySelector('#'+id)};
const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,[...(events.get(k)??[]),fn]);globalThis.removeEventListener=()=>{};globalThis.matchMedia=()=>({matches:true});
let privateReads=0;globalThis.localStorage=new Proxy({},{get(){privateReads++;throw Error('No private store may be read by a presentation migration');}});globalThis.sessionStorage=globalThis.localStorage;
const T={};vm.runInNewContext(await readFile(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:T,module:{exports:T},console});
T.TextureLoader=class{load(_url,ready){const t=new T.Texture();t.image={width:720,height:480};queueMicrotask(()=>ready?.(t));return t;}};

// Every one of the source validator's128 allowed editions has a connected,
// dry parcel within the circular face. The graph roads clear real tree trunks.
assert.equal(MAX_HOMES,128);assert.equal(GRID.width,20);assert.equal(GRID.height,16);assert(NIGHT_HOME_PARCELS.length>=MAX_HOMES);const owned=new Set(),landParent=new T.Group(),land=buildLowerLandscape(T,{parent:landParent,own:r=>(owned.add(r),r)});
let routeSamples=0;const allPaths=[];
for(let i=0;i<128;i++){
 const p=NIGHT_HOME_PARCELS[i],t=nightHomeTransform(i);assert.equal(t.scale,1.35);assert(nightHomeParcelClear(i));assert(Math.hypot(p.x,p.z)+20<565);
 for(const dx of[-13.5,0,13.5])for(const dz of[-10.8,0,10.8])assert(lowerLandscapeCanStand(p.x+dx,p.z+dz));
 const path=nightHomeAccess(i,{x:t.x,z:t.z+12});
 allPaths.push(path);
 for(let j=1;j<path.length;j++){const a=path[j-1],b=path[j],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])));for(let k=0;k<=n;k++){const x=a[0]+(b[0]-a[0])*k/n+2160,z=a[1]+(b[1]-a[1])*k/n+65;assert(lowerLandscapeCanStand(x,z),'Home route must use dry land or the actual bridge');assert(!land.obstacles.some(o=>Math.hypot(x-o.x-2160,z-o.z-65)<o.radius+.28),'Home path must clear actual landscape solids at '+x+','+z);routeSamples++;}}
}
const segments=nightHomeRoadSegments(allPaths),rawEdges=allPaths.reduce((n,p)=>n+p.length-1,0);assert(segments.length<rawEdges/4,'Shared trunks must not be drawn once per home');assert.equal(new Set(segments.map(s=>JSON.stringify(s))).size,segments.length);
for(let i=0;i<segments.length;i++)for(let j=0;j<i;j++){const[a,b]=segments[i],[c,d]=segments[j],horizontal=Math.abs(a[1]-b[1])<1e-6,vertical=Math.abs(a[0]-b[0])<1e-6;if(horizontal&&Math.abs(c[1]-d[1])<1e-6&&Math.abs(a[1]-c[1])<1e-6)assert(Math.min(b[0],d[0])-Math.max(a[0],c[0])<=1e-5,'Collinear road surfaces must not overlap');if(vertical&&Math.abs(c[0]-d[0])<1e-6&&Math.abs(a[0]-c[0])<1e-6)assert(Math.min(b[1],d[1])-Math.max(a[1],c[1])<=1e-5,'Collinear road surfaces must not overlap');}
land.dispose();for(const r of owned)r.dispose?.();

const names=['math-city-scene.js','makers-city-scene.js','dali-house-scene.js','artist-city-editions.js','math-city-data.js','artist-catalog.js','dali-data.js','city-network.js','neighborhood.js','city-facilities.js','books.js'];
const base=new URL('../src/city-source-assets/home-tools/',import.meta.url),F=Object.assign({},...await Promise.all(names.map(n=>import(new URL(n,base)))));
const scene=new T.Scene(),art=buildArtCity(T,F.ARTISTS.slice(0,10),{artworkUrl:(_,w)=>w.imageUrl});art.group.position.set(118,.13,108);art.group.scale.setScalar(1.35);scene.add(art.group);
const city={art,ART:{x:118,z:108,scale:1.35},GRAVEYARD:{x:-2360,z:-65,bounds:{minX:-2455,maxX:-2288,minZ:-225,maxZ:90},mathematics:{x:-2240,z:-65},objects:{x:-2360,z:-160},stations:{artists:{x:-2300,z:20}}},targets:[],update(){},region:()=>({id:'city'}),canStand:()=>true,targetInfo:()=>null};
const layer=await createExtraDistricts(T,{scene,city,factories:F,sourceBaseUrl:base.href,buildHome:(api,h,options)=>buildHome(api,h,{...options,owner:null,source:{ARTISTS:F.ARTISTS}})});
const M={scene,city,camera:new T.PerspectiveCamera(),eye:1.8,mode:'city',player:{x:0,y:1.93,z:0,yaw:0,pitch:0},clearMovement(){},setCityMode(){this.mode='city';},cancelActivity(){},arrive(p){Object.assign(this.player,p,{y:p.y+this.eye});},quickStart(){},extraGround:()=>.13,startExtra:()=>false,showExtra:()=>false};
city.canStand=(x,z)=>layer.canStand(x,z,{y:M.player.y-M.eye,floor:0});city.region=(x,z)=>layer.region(x,z,{y:M.player.y-M.eye,floor:0})||{id:'city'};
globalThis.window={CITY_EXTRAS:layer,CITY_GRAVEYARD:{drawActiveMap:()=>true},gallery:{overview(){M.mode='overview';}}};
const world=installWorldCylinder(M,T),date='2026-11-17T00:00:00Z',records=['legacy','inhabited','atelier','inhabited'].map((edition,i)=>({id:'night-home-'+i,title:'Synthetic preserved home '+i,edition,createdAt:date,house:{...starter(),ideas:[{id:'kept-note',roomId:'learning',title:'Original private title',text:'Synthetic untouched text',cue:'book',action:'reflect'}]}}));
const neighborhood={version:1,activeId:records.at(-1).id,homes:records},before=JSON.stringify(neighborhood);let notices=0;const unsubscribe=layer.onGeometryChanged(()=>notices++);
await layer.updateNeighborhood(neighborhood);assert.equal(JSON.stringify(neighborhood),before);assert.equal(notices,1);assert.equal(layer.homeLayout.face,'lower');assert.equal(layer.homeLayout.lots.length,4);
const firstHomes=records.map(r=>layer.targets.find(g=>g.userData.cityDestination==='home:'+r.id));assert(firstHomes.every(g=>world.lowerRoots.includes(g)),'Homes added after installation must be mounted immediately');
const homeRoads=world.lowerRoots.find(g=>g.name==='Paths to preserved personal homes');assert(homeRoads);assert.equal(homeRoads.children.filter(o=>o.isMesh).length,2,'All active parcels and all deduplicated roads use two draw meshes');
for(const [i,r]of records.entries()){
 const group=firstHomes[i],entry=layer.entryFor('home:'+r.id);assert(entry&&entry.x<-1000);assert(world.canLower(entry.x,entry.z));assert.equal(layer.region(entry.x,entry.z,{y:.13}).homeId,r.id);
 const path=nightHomeAccess(i,entry);for(let j=1;j<path.length;j++){const a=path[j-1],b=path[j],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*4));for(let k=0;k<=n;k++){const x=a[0]+(b[0]-a[0])*k/n,z=a[1]+(b[1]-a[1])*k/n;assert(world.canLower(x,z),'A real saved-home door and access route must stay clear in both directions');}}
 scene.updateMatrixWorld(true);const expected=lowerPhysical({x:group.position.x,y:group.position.y,z:group.position.z}),physical=group.getWorldPosition(new T.Vector3());assert(physical.distanceTo(new T.Vector3(expected.x,expected.y,expected.z))<1e-7,'A preserved home gets exactly one proper lower transform');
 let blocked=false;group.traverse(o=>{if(!o.userData?.ideaId)return;const info=layer.targetInfo(o);assert.equal(info.homeId,r.id);assert.equal(info.data.extraHomeId,r.id);});
 for(let x=-12;x<=12&&!blocked;x+=.4)for(let z=-10;z<=10&&!blocked;z+=.4){const wx=group.position.x+x*1.35,wz=group.position.z+z*1.35;if(!layer.canStand(wx,wz,{y:.13,floor:0})){assert.equal(world.canLower(wx,wz),false,'Night home walls cannot be bypassed outside the old Graveyard bounds');blocked=true;}}
 assert(blocked,'A real source house must contribute solid walls');
}
assert(!layer.region(-170,170)?.homeId,'No ghost home parcel remains on the upper city');
const old=firstHomes[0],oldWrapper=old.parent,oldResources=new Set();old.traverse(o=>{if(o.geometry)oldResources.add(o.geometry);});let disposals=0;for(const g of oldResources)g.addEventListener('dispose',()=>disposals++);
const changed=structuredClone(neighborhood);changed.homes[0].house.ideas[0].text='Synthetic later edit';await layer.updateNeighborhood(changed);assert.equal(notices,2);assert.equal(old.parent,null);assert.equal(oldWrapper.parent,null,'A same-count rebuild releases its stale presentation wrapper');assert(!world.lowerRoots.includes(old));const next=layer.targets.find(g=>g.userData.cityDestination==='home:'+records[0].id);assert(next!==old&&world.lowerRoots.includes(next));assert(disposals>0);const afterDispose=disposals;
assert.equal(records.length,changed.homes.length);assert.equal(layer.homeLayout.lots.length,4);assert.equal(JSON.stringify(neighborhood),before);assert.equal(privateReads,0);unsubscribe();for(const fn of events.get('pagehide')||[])fn();assert.equal(disposals,afterDispose,'World cleanup does not dispose an already-replaced source home twice');layer.dispose();assert.equal(privateReads,0);
console.log('PASS night homes:128 bounded dry connected parcels,'+routeSamples+' actual landscape route probes, unchanged source documents/IDs, real original walls outside old campus bounds, exactly one rigid half-turn, live same-count rebuild/remount and stale-wrapper cleanup, no private storage access.');
