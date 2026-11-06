import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildArtCity} from '../src/city-source-assets/home-tools/art-city-scene.js';
import {ARTISTS} from '../src/city-source-assets/home-tools/art-city-data.js';
import {buildArtistResidents} from '../src/city-source-assets/home-tools/artist-residents.js';
import {buildArtistStudios,buildQuarterGarden} from '../src/artist-quarter-scene.js';
import {QUARTER_ARTISTS,QUARTER_COPY} from '../src/artist-quarter-data.js';
const scope={window:{}};vm.runInNewContext(readFileSync(new URL('../src/artist-quarter-layout.js',import.meta.url),'utf8'),scope);
const before=JSON.stringify(ARTISTS),art=buildArtCity(T,ARTISTS),original=art.houses.map(h=>({id:h.artistId,cx:h.cx,cz:h.cz,approaches:structuredClone(h.approaches)}));
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
const residents=buildArtistResidents(T,ARTISTS,art);for(let i=0;i<80;i++)residents.update(i/10,{player:{x:-24,z:0}}); // Source resident entrances remain navigable.
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})}),studios=buildArtistStudios(T,{canvas,loadTexture:()=>new T.Texture()}),garden=buildQuarterGarden(T,art,{naturalTrees:null});
assert.equal(studios.houses.length,3);assert.equal(studios.targets.length,12);
const originalCan=(x,z)=>{const lx=(x-118)/1.35,lz=(z-108)/1.35;return !art.colliders.some(c=>c.label!=='Return gate post'&&lx>c.minX-.22&&lx<c.maxX+.22&&lz>c.minZ-.22&&lz<c.maxZ+.22);};
const clear=(x,z)=>originalCan(x,z)&&studios.canStand(x,z)&&!garden.colliders.some(c=>x>c.minX-.22&&x<c.maxX+.22&&z>c.minZ-.22&&z<c.maxZ+.22);
function walk(a,b){const n=Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/.06);for(let i=0;i<=n;i++){const t=i/n;assert(clear(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t),'Blocked continuous route at '+JSON.stringify({a,b,i,n}));}}
for(const h of studios.houses){assert(clear(h.entry.x,h.entry.z));walk(h.entry,h.insideEntry);assert(h.inside(h.insideEntry.x,h.insideEntry.z));for(const far of[false,true]){const p=h.viewpoint(far);assert(h.inside(p.x,p.z));assert(clear(p.x,p.z));assert(Number.isFinite(p.pitch));}h.group.updateMatrixWorld(true);const dots=h.study.children.find(o=>o.isInstancedMesh),original=dots?Array.from(dots.instanceMatrix.array):h.study.matrix.elements.slice();h.change();h.group.updateMatrixWorld(true);assert.notDeepEqual(dots?Array.from(dots.instanceMatrix.array):h.study.matrix.elements,original,'Every exercise changes actual scene geometry');
 if(h.artist.id==='cezanne'){const cloth=h.study.children.find(o=>o.name==='Linen study cloth'),top=new T.Box3().setFromObject(cloth).max.y;for(const apple of h.study.children.filter(o=>o.name==='Still-life apple'))assert(Math.abs(new T.Box3().setFromObject(apple).min.y-top)<.006,'Fruit must rest on the study surface');}
 const artwork=h.image;assert(Math.abs(artwork.geometry.parameters.width/artwork.geometry.parameters.height-h.artist.work.ratio)<1e-9,'Respect each artwork aspect ratio');
 h.group.updateMatrixWorld(true);const p=h.insideEntry,ray=new T.Raycaster(new T.Vector3(p.x,1.8,p.z),new T.Vector3(0,0,0));const aim=h.image.getWorldPosition(new T.Vector3());ray.ray.direction.copy(aim.sub(ray.ray.origin).normalize());assert(ray.intersectObjects(studios.targets,true).some(hit=>hit.object===h.image),'Painting physically selectable through doorway');
 const positions=[];h.group.traverse(o=>{if(o.geometry?.attributes.position)positions.push(...o.geometry.attributes.position.array);});assert(positions.every(Number.isFinite));
}
for(const path of garden.paths)for(let i=1;i<path.points.length;i++)walk({x:path.points[i-1][0],z:path.points[i-1][1]},{x:path.points[i][0],z:path.points[i][1]});
const keys=Object.keys(QUARTER_COPY.en).sort();for(const lang of['de','fa'])assert.deepEqual(Object.keys(QUARTER_COPY[lang]).sort(),keys);
const manifest=JSON.parse(readFileSync(new URL('../src/assets/artist-quarter/credits.json',import.meta.url),'utf8'));for(const a of QUARTER_ARTISTS){const entry=manifest.assets.find(r=>r.file===a.work.image);assert(entry?.isPublicDomain);assert.equal(entry.source,a.work.source);for(const [file,hash]of[[entry.file,entry.sha256],[entry.detailFile,entry.detailSha256]])assert.equal(hash,createHash('sha256').update(readFileSync(new URL('../src/assets/artist-quarter/'+file,import.meta.url))).digest('hex'));}
studios.dispose();garden.dispose();residents.dispose();art.dispose();assert.equal(studios.group.children.length,0);
console.log('PASS artists’ quarter: ten original galleries and furniture relaid together; clear garden/doorway routes, source residents, three distinct working studios, selectable art, aspect ratios, locale parity and verified museum credits');
