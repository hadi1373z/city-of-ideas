import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildArtCity} from '../src/city-source-assets/home-tools/art-city-scene.js';
import {ARTISTS} from '../src/city-source-assets/home-tools/artist-catalog.js';
import {addDaliHouse} from '../src/city-source-assets/home-tools/dali-house-scene.js';
import {buildEscherHouse} from '../src/escher-house.js';
import {buildPerspectiveStairs,measurePerspective} from '../src/escher-perspective.js';
import {buildArtistResidents} from '../src/city-source-assets/home-tools/artist-residents.js';
import {buildArtistStudios,buildQuarterGarden} from '../src/artist-quarter-scene.js';
import {QUARTER_ARTISTS,QUARTER_COPY} from '../src/artist-quarter-data.js';
import {createExtraDistricts} from '../src/extra-districts.js';
import {initialCityNetwork} from '../src/city-source-assets/home-tools/city-network.js';
const scope={window:{}};vm.runInNewContext(readFileSync(new URL('../src/artist-quarter-layout.js',import.meta.url),'utf8'),scope);
const before=JSON.stringify(ARTISTS);let art=buildArtCity(T,ARTISTS.slice(0,10));const original=art.houses.map(h=>({id:h.artistId,cx:h.cx,cz:h.cz,approaches:structuredClone(h.approaches)}));
const originalInstances=new Map();for(const o of art.group.children)if(o.isInstancedMesh){const matrices=[];for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);matrices.push(m.clone());}originalInstances.set(o,matrices);}
scope.window.layoutArtistQuarter(T,art);const after=art.houses.map(h=>[h.cx,h.cz]);scope.window.layoutArtistQuarter(T,art);assert.deepEqual(art.houses.map(h=>[h.cx,h.cz]),after,'Layout must be idempotent');assert.equal(JSON.stringify(ARTISTS),before);
for(const h of art.houses){
 const old=original.find(o=>o.id===h.artistId);assert.equal(h.group.position.x,h.cx);assert.equal(h.group.position.z,h.cz);
 assert(art.canStand(h.entry.x,h.entry.z));assert(art.canStand(h.spawnInside.x,h.spawnInside.z));assert.equal(art.insideAt(h.spawnInside.x,h.spawnInside.z),h.artistId);
 for(const [i,a]of h.approaches.entries()){assert(art.canStand(a.x,a.z),h.artistId+' approach');assert(Math.abs(a.x-old.approaches[i].x-h.cx+old.cx)<1e-9);assert(Math.abs(a.lookAt.z-old.approaches[i].lookAt.z-h.cz+old.cz)<1e-9);}
 const works=new Set();h.group.traverse(o=>{if(o.userData.workId)works.add(o.userData.workId);});assert.equal(works.size,6,'All original paintings remain');
}
for(const [o,matrices]of originalInstances)for(const [i,old]of matrices.entries()){
 const owner=original.find(h=>Math.abs(old.elements[12]-h.cx)<4.1&&Math.abs(old.elements[14]-h.cz)<3.8),h=art.houses.find(h=>h.artistId===owner?.id),m=new T.Matrix4();o.getMatrixAt(i,m);assert(h,'Every furniture instance belongs to a house');assert(Math.abs(m.elements[12]-old.elements[12]-h.cx+owner.cx)<1e-5);assert(Math.abs(m.elements[14]-old.elements[14]-h.cz+owner.cz)<1e-5);
}
const AssetT={...T,TextureLoader:class{load(){const t=new T.Texture();t.image={width:600,height:400};return t;}}};art=addDaliHouse(AssetT,art);scope.window.layoutArtistDali(T,art);const dali=art.houses.find(h=>h.artistId==='dali');assert(Math.abs(118+dali.cx*1.35-220)<1e-8);assert(Math.abs(108+dali.cz*1.35-177)<1e-8);assert.equal(art.insideAt(dali.spawnInside.x,dali.spawnInside.z),'dali');assert(art.canStand(dali.spawnInside.x,dali.spawnInside.z));
const residents=buildArtistResidents(T,ARTISTS,art);for(let i=0;i<80;i++)residents.update(i/10,{player:{x:-24,z:0}});
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),plan=scope.window.ARTIST_QUARTER_PLAN,studios=buildArtistStudios(T,{canvas,loadTexture:()=>new T.Texture()}),garden=buildQuarterGarden(T,art,{naturalTrees:null,plan}),escher=buildEscherHouse(T,{...plan.escher,canvas,loadTexture:()=>new T.Texture()});
assert.equal(studios.houses.length,3);assert.equal(studios.targets.length,12);
const originalCan=(x,z)=>{const lx=(x-118)/1.35,lz=(z-108)/1.35;return !art.colliders.some(c=>c.label!=='Return gate post'&&lx>c.minX-.22&&lx<c.maxX+.22&&lz>c.minZ-.22&&lz<c.maxZ+.22);};
const editions=[];for(let row=0;row<3;row++)for(let col=0;col<5;col++)editions.push({minX:118+(col-2)*13.5-4.725,maxX:118+(col-2)*13.5+4.725,minZ:139.05+row*18.9-4.05,maxZ:139.05+row*18.9+4.05});
const clear=(x,z)=>originalCan(x,z)&&studios.canStand(x,z)&&!editions.concat(garden.colliders,escher.colliders).some(c=>x>c.minX-.22&&x<c.maxX+.22&&z>c.minZ-.22&&z<c.maxZ+.22);
function walk(a,b){const n=Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/.06);for(let i=0;i<=n;i++){const t=i/n;assert(clear(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t),'Blocked continuous route at '+JSON.stringify({a,b,i,n}));}}
for(const h of studios.houses){assert(clear(h.entry.x,h.entry.z));walk(h.entry,h.insideEntry);assert(h.inside(h.insideEntry.x,h.insideEntry.z));for(const far of[false,true]){const p=h.viewpoint(far);assert(h.inside(p.x,p.z));assert(clear(p.x,p.z));assert(Number.isFinite(p.pitch));}h.group.updateMatrixWorld(true);const dots=h.study.children.find(o=>o.isInstancedMesh),original=dots?Array.from(dots.instanceMatrix.array):h.study.matrix.elements.slice();h.change();h.group.updateMatrixWorld(true);assert.notDeepEqual(dots?Array.from(dots.instanceMatrix.array):h.study.matrix.elements,original,'Every exercise changes actual scene geometry');
 if(h.artist.id==='cezanne'){const cloth=h.study.children.find(o=>o.name==='Linen study cloth'),top=new T.Box3().setFromObject(cloth).max.y;for(const apple of h.study.children.filter(o=>o.name==='Still-life apple'))assert(Math.abs(new T.Box3().setFromObject(apple).min.y-top)<.006,'Fruit must rest on the study surface');}
 const artwork=h.image;assert(Math.abs(artwork.geometry.parameters.width/artwork.geometry.parameters.height-h.artist.work.ratio)<1e-9,'Respect each artwork aspect ratio');
 h.group.updateMatrixWorld(true);const p=h.insideEntry,ray=new T.Raycaster(new T.Vector3(p.x,1.8,p.z),new T.Vector3(0,0,0));const aim=h.image.getWorldPosition(new T.Vector3());ray.ray.direction.copy(aim.sub(ray.ray.origin).normalize());assert(ray.intersectObjects(studios.targets,true).some(hit=>hit.object===h.image),'Painting physically selectable through doorway');
 const positions=[];h.group.traverse(o=>{if(o.geometry?.attributes.position)positions.push(...o.geometry.attributes.position.array);});assert(positions.every(Number.isFinite));
}
for(const path of garden.paths)for(let i=1;i<path.points.length;i++)walk({x:path.points[i-1][0],z:path.points[i-1][1]},{x:path.points[i][0],z:path.points[i][1]});
for(const court of plan.courts)assert(clear(court.arrival.x,court.arrival.z),court.id+' arrival');
assert.equal(new Set(plan.courts.flatMap(c=>c.artists)).size,15,'All fifteen houses belong to a court');
const stairs=buildPerspectiveStairs(T,escher.group,plan.escher),camera=new T.PerspectiveCamera(66,16/9,.08,650);camera.position.set(stairs.viewpoint.x,stairs.viewpoint.y,stairs.viewpoint.z);camera.lookAt(new T.Vector3(stairs.focus.x,stairs.focus.y,stairs.focus.z));assert(measurePerspective(T,stairs,camera).aligned,'Translated Escher puzzle still aligns');escher.setPassage(true,1);walk(escher.entry,{x:plan.escher.x,z:plan.escher.z-11});assert(escher.inside(plan.escher.x,plan.escher.z-10));
const {render}=createRequire(import.meta.url)('../tools/render-artist-quarter-plan.cjs');assert.equal(readFileSync(new URL('../src/assets/artist-quarter-plan.svg',import.meta.url),'utf8'),render(),'Wayfinding map must match the actual layout');
// Exercise the real additive controller too, including preserved source editions.
const RootT={};vm.runInNewContext(readFileSync(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:RootT,module:{exports:RootT},console});RootT.TextureLoader=AssetT.TextureLoader;const sourceCity=buildArtCity(RootT,ARTISTS.slice(0,10));scope.window.layoutArtistQuarter(RootT,sourceCity);sourceCity.group.position.set(118,.06,108);sourceCity.group.scale.setScalar(1.35);const scene=new RootT.Scene();scene.add(sourceCity.group);const city={art:sourceCity,ART:{x:118,z:108,scale:1.35}},extra=await createExtraDistricts(RootT,{scene,city,layoutArtists:scope.window.layoutArtistDali});
const net=initialCityNetwork(),date='2026-11-06T00:00:00.000Z',design={title:'Synthetic preserved edition',reason:'Verify rearrangement',exercise:'Compare a colour',feature:'composition-wall',atmosphere:'quiet'};net.artistHomes={version:1,proposals:[],editions:[]};for(const [i,a]of ARTISTS.slice(0,10).entries()){net.artistHomes.proposals.push({id:'p-'+i,artistId:a.id,date,decision:'approved',...design});net.artistHomes.editions.push({id:'e-'+i,artistId:a.id,number:2,proposalId:'p-'+i,createdAt:date,...design});}const saved=JSON.stringify(net);await extra.updateNetwork(net);assert.equal(JSON.stringify(net),saved,'Rearranging the public quarter cannot rewrite saved editions');
const dd=extra.entryFor('artist:dali',{inside:true});assert(dd);assert.equal(extra.region(dd.x,dd.z).artistId,'dali');assert(Math.abs(dd.x-plan.dali.x)<1e-8);const liveResidents=buildArtistResidents(RootT,ARTISTS,extra.art);liveResidents.update(.1,{player:{x:(dd.x-118)/1.35,z:(dd.z-108)/1.35}});assert(liveResidents.state('dali'));
for(const path of garden.paths)for(let i=1;i<path.points.length;i++){const a=path.points[i-1],b=path.points[i],n=Math.ceil(Math.hypot(a[0]-b[0],a[1]-b[1])/.1);for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,z=a[1]+(b[1]-a[1])*j/n;assert(extra.canStand(x,z,.13),'Relocated route must clear real source editions: '+x+','+z);}}
liveResidents.dispose();extra.dispose();sourceCity.dispose();
const keys=Object.keys(QUARTER_COPY.en).sort();for(const lang of['de','fa'])assert.deepEqual(Object.keys(QUARTER_COPY[lang]).sort(),keys);
const manifest=JSON.parse(readFileSync(new URL('../src/assets/artist-quarter/credits.json',import.meta.url),'utf8'));for(const a of QUARTER_ARTISTS){const entry=manifest.assets.find(r=>r.file===a.work.image);assert(entry?.isPublicDomain);assert.equal(entry.source,a.work.source);for(const [file,hash]of[[entry.file,entry.sha256],[entry.detailFile,entry.detailSha256]])assert.equal(hash,createHash('sha256').update(readFileSync(new URL('../src/assets/artist-quarter/'+file,import.meta.url))).digest('hex'));}
stairs.dispose();escher.dispose();studios.dispose();garden.dispose();residents.dispose();art.dispose();assert.equal(studios.group.children.length,0);
console.log('PASS artists’ quarter: ten original galleries and furniture relaid together; clear garden/doorway routes, source residents, three distinct working studios, selectable art, aspect ratios, locale parity and verified museum credits');
