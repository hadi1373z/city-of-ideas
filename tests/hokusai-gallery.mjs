import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildArtCity} from '../src/city-source-assets/home-tools/art-city-scene.js';
import {ARTISTS} from '../src/city-source-assets/home-tools/art-city-data.js';
import {installHokusaiGallery} from '../src/hokusai-gallery.js';
import {HOKUSAI_COPY,HOKUSAI_SOURCES,HOKUSAI_WORKS} from '../src/hokusai-gallery-copy.js';
const art=buildArtCity(T,ARTISTS),scope={};vm.runInNewContext(readFileSync(new URL('../src/artist-quarter-layout.js',import.meta.url),'utf8'),scope);scope.layoutArtistQuarter(T,art);
const house=art.houses.find(h=>h.artistId==='hokusai'),catalog=JSON.stringify(ARTISTS),colliders=JSON.stringify(art.colliders),positions=JSON.stringify(art.houses.map(h=>[h.entry,h.spawnInside,h.approaches]));
art.group.updateMatrixWorld(true);
const source=[],surface=[];art.group.traverse(o=>{source.push([o,o.matrixWorld.elements.slice(),JSON.stringify(o.userData),o.material,o.geometry,o.visible]);if(o.isMesh)surface.push([o,JSON.stringify([o.material?.color?.getHex(),o.material?.roughness,o.material?.opacity,o.material?.side]),Array.from(o.geometry.attributes.position.array)]);});
const instances=source.filter(([o])=>o.isInstancedMesh).map(([o])=>[o,Array.from(o.instanceMatrix.array)]);
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this.open=false;this._text='';}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.remove();n.parent=this;this.children.push(n);}}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null;}
 replaceChildren(...nodes){this.children.forEach(n=>n.parent=null);this.children=[];this._text='';this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k]??null;}
 addEventListener(k,fn){this.events[k]=fn;}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}focus(){document.activeElement=this;}
 querySelector(s){return scan(this,n=>s==='dialog[open]'?n.tagName==='dialog'&&n.open:s==='#artist-quarter[open]'?n.id==='artist-quarter'&&n.open:s.startsWith('#')?n.id===s.slice(1):n.tagName===s);}
 get isConnected(){return !!this.parent;}
}
function scan(n,match){for(const c of n.children){if(match(c))return c;const hit=scan(c,match);if(hit)return hit;}return null;}
const body=new Element('body');globalThis.document={body,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s)};
const listeners=new Map();globalThis.addEventListener=(k,fn)=>listeners.set(k,fn);globalThis.removeEventListener=(k,fn)=>{if(listeners.get(k)===fn)listeners.delete(k);};globalThis.window={CITY_I18N:{lang:'en'}};
// Any guide attempt to access private/lesson storage is a failure.
globalThis.localStorage=new Proxy({},{get(){throw Error('Guide must not access private storage');}});
let delegated=0,picked,notes=0;const originalCan=()=>true;
art.group.position.set(118,.06,108);art.group.scale.setScalar(1.35);
const M={mode:'city',eye:1.65,player:{x:0,z:0},clearMovement(){},arrive(p){Object.assign(this.player,p);},homePick:d=>picked=d,visitorMemory:{open(){notes++;}},city:{art,ART:{x:118,z:108,scale:1.35},targets:[],canStand:originalCan,region(x,z){const id=art.insideAt((x-118)/1.35,(z-108)/1.35);return{id:'artists',artistId:id};},targetInfo:()=>({kind:'old'}),update(){}},showExtra:()=>++delegated};
const api=installHokusaiGallery(M,T),dialog=body.querySelector('#hokusai-guide'),panel=body.querySelector('#hokusai-guide-context');assert(api);
const buttons=()=>{const r=[];const walk=n=>{if(n.tagName==='button')r.push(n);n.children.forEach(walk);};walk(dialog);return r;};
const get=(text,index=0)=>buttons().filter(b=>b.textContent===text)[index];
assert.equal(M.city.canStand,originalCan);assert.equal(JSON.stringify(ARTISTS),catalog);assert.equal(JSON.stringify(art.colliders),colliders);assert.equal(JSON.stringify(art.houses.map(h=>[h.entry,h.spawnInside,h.approaches])),positions);
assert(Math.abs(118+house.cx*1.35-181)<1e-8);assert(Math.abs(108+house.cz*1.35-95)<1e-8);
// Compare all borrowed meshes, payloads and resources in the same original frame.
art.group.position.set(0,0,0);art.group.scale.setScalar(1);art.group.updateMatrixWorld(true);
for(const [o,m,data,material,geometry,visible]of source){assert.deepEqual(o.matrixWorld.elements,m);assert.equal(JSON.stringify(o.userData),data);assert.equal(o.material,material);assert.equal(o.geometry,geometry);assert.equal(o.visible,visible);}
for(const [o,material,vertices]of surface){assert.equal(JSON.stringify([o.material?.color?.getHex(),o.material?.roughness,o.material?.opacity,o.material?.side]),material);assert.deepEqual(Array.from(o.geometry.attributes.position.array),vertices);}
for(const [o,matrices]of instances)assert.deepEqual(Array.from(o.instanceMatrix.array),matrices,'Original furniture/brush instances remain');
const localBounds=o=>new T.Box3().setFromObject(o).applyMatrix4(house.group.matrixWorld.clone().invert());
const readingBounds=localBounds(api.details.reading),front=source.map(x=>x[0]).find(o=>o.parent===house.group&&o.geometry?.type==='ExtrudeGeometry'),wallBounds=localBounds(front);
assert(readingBounds.min.z>=wallBounds.min.z-.22,'The ledge stays within the original front-wall walking clearance');
assert(Math.abs(readingBounds.max.z-wallBounds.min.z)<1e-6,'Wall spacers meet the original float32 wall');
assert(readingBounds.max.y<1.1,'The whole reading ledge stays below the window aperture');
assert(readingBounds.min.x>-3.28&&readingBounds.max.x< -1.12,'The reading ledge clears side-wall and door walking space');
const backing=api.details.folio.getObjectByName('Folio backing'),shelfBounds=localBounds(api.details.shelf),backingBounds=localBounds(backing);
assert(Math.abs(backingBounds.min.y-shelfBounds.max.y)<1e-8,'The folio rests on the supported shelf');
api.details.folio.traverse(o=>{if(o.name==='Wall spacer'){const b=localBounds(o);assert(Math.abs(b.min.z-backingBounds.max.z)<1e-8);assert(Math.abs(b.max.z-wallBounds.min.z)<1e-6);}});
const bench=source.map(x=>x[0]).find(o=>o.parent===house.group&&o.geometry?.parameters?.width===2.05),benchBounds=localBounds(bench),matBounds=localBounds(api.details.seatMat);
assert.equal(house.group.rotation.y,0);assert(Math.abs(matBounds.min.y-benchBounds.max.y)<1e-8);
for(const axis of['x','z']){assert(matBounds.min[axis]>=benchBounds.min[axis]-1e-8);assert(matBounds.max[axis]<=benchBounds.max[axis]+1e-8);}
assert.deepEqual(api.details.seat.userData,bench.userData,'Seat details retain the original bench profile interaction');
const facade=source.map(x=>x[0]).find(o=>o.parent===house.group&&o.userData.artistId==='hokusai'&&o.geometry?.parameters?.width===.12);
assert.equal(api.details.pegs.length,8);for(const peg of api.details.pegs){assert.deepEqual(peg.userData,facade.userData);assert(peg.position.z+peg.geometry.parameters.depth/2<=3.31,'Joint caps stay within the original facade clearance');}
for(const [o]of source)if(o.name.startsWith('Artwork '))assert(!readingBounds.intersectsBox(localBounds(o)),'The ledge clears every original print');
const palette=source.map(x=>x[0]).find(o=>o.parent===house.group&&o.geometry?.type==='CylinderGeometry');assert(!readingBounds.intersectsBox(localBounds(palette)));
const brushes=art.group.children.find(o=>o.isInstancedMesh&&o.geometry.type==='CylinderGeometry');brushes.geometry.computeBoundingBox();
for(let i=0;i<brushes.count;i++){const matrix=new T.Matrix4();brushes.getMatrixAt(i,matrix);const bounds=brushes.geometry.boundingBox.clone().applyMatrix4(matrix).translate(new T.Vector3(-house.cx,0,-house.cz));assert(!readingBounds.intersectsBox(bounds),'The ledge clears original brushes');}
for(const a of[house.entry,house.spawnInside,...house.approaches])assert(art.canStand(a.x,a.z));
const roof=source.map(x=>x[0]).find(o=>o.parent===house.group&&o.geometry?.type==='BufferGeometry'),vertices=roof.geometry.attributes.position;
for(const rake of api.details.rakes)for(const side of[-1,1]){const end=new T.Vector3(side*rake.geometry.parameters.width/2,0,0).applyMatrix4(rake.matrixWorld).applyMatrix4(house.group.matrixWorld.clone().invert());let distance=Infinity;for(let i=0;i<vertices.count;i++)distance=Math.min(distance,Math.hypot(end.x-vertices.getX(i),end.y-vertices.getY(i)));assert(distance<1e-6,'Rake ends follow the actual original wide-eave roof vertices');}
assert.equal(api.details.rakes[0].geometry.parameters.width,api.details.rakes[1].geometry.parameters.width);
const aperture=new T.Box3(new T.Vector3(-2.83,1.1,2.91),new T.Vector3(-1.57,2.12,3.09));
for(const name of['Window sill','Window header'])assert(!localBounds(api.details.group.getObjectByName(name)).intersectsBox(aperture),'Trim clears the real window opening');
const frameIds=new Set();house.group.traverse(o=>{if(o.userData.workId)frameIds.add(o.userData.workId);});assert.deepEqual([...frameIds],HOKUSAI_WORKS);
const origin=house.group.localToWorld(new T.Vector3(-1.7,1.5,1.8)),aim=api.details.folio.getWorldPosition(new T.Vector3());const ray=new T.Raycaster(origin,aim.sub(origin).normalize());assert(ray.intersectObjects(api.details.targets,true).length,'Below-window reading folio selectable');
art.group.position.set(118,.06,108);art.group.scale.setScalar(1.35);
M.city.update();assert(panel.hidden);M.showExtra({kind:'hokusai-guide'});assert(!dialog.open,'Remote physical picks rejected');M.showExtra({kind:'other'});assert.equal(delegated,1);assert.equal(M.city.targetInfo({}).kind,'old');assert.equal(M.city.targetInfo({hokusaiGuide:true}).kind,'hokusai-guide');
for(const lang of['en','de','fa','cs']){
 const c=HOKUSAI_COPY[lang];assert.deepEqual(Object.keys(c).sort(),Object.keys(HOKUSAI_COPY.en).sort());assert.equal(c.prompts.length,6);assert.equal(c.titles.length,6);assert(c.prompts.every(s=>s.length>40));window.CITY_I18N.lang=lang;
 Object.assign(M.player,{x:0,z:0});dialog.children[1].scrollTop=123;api.open();assert.equal(dialog.children[1].scrollTop,0);assert(!get(c.look));assert(get(c.enter));get(c.enter).onclick();assert(!dialog.open);
 Object.assign(M.player,{x:118+house.spawnInside.x*1.35,z:108+house.spawnInside.z*1.35});
 M.showExtra({kind:'hokusai-guide'});assert(dialog.open);assert.equal(dialog.dir,lang==='fa'?'rtl':'ltr');assert.equal(dialog.lang,lang);assert(dialog.textContent.includes(c.boundary));assert(dialog.textContent.includes(c.panel));
 for(let i=0;i<6;i++){
  api.open();const p=house.approaches[i];get(c.look,i).onclick();assert(!dialog.open);assert(Math.abs(M.player.x-(118+p.x*1.35))<1e-8);assert(Math.abs(M.player.z-(108+p.z*1.35))<1e-8);assert.equal(M.player.yaw,p.yaw);assert(Number.isFinite(M.player.pitch));
  api.open();assert.equal(get(c.catalog,i).getAttribute('aria-label'),c.catalog+' · '+c.titles[i]);assert.equal(get(c.look,i).getAttribute('aria-label'),c.look+' · '+c.titles[i]);get(c.catalog,i).onclick();assert.deepEqual(picked,{artistId:'hokusai',workId:HOKUSAI_WORKS[i]});
 }
 api.open();for(const locale of['de','fa','cs','en']){window.CITY_I18N.lang=locale;listeners.get('city-language')();assert.equal(dialog.dir,locale==='fa'?'rtl':'ltr');assert(dialog.textContent.includes(HOKUSAI_COPY[locale].intro));}
 dialog.close();M.city.update();assert(!panel.hidden);assert.equal(notes,0);
}
assert(Object.values(HOKUSAI_SOURCES).every(s=>s.startsWith('https://')));
const resources=new Set();api.details.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)resources.add(o.material);});const counts=new Map();for(const r of resources)r.addEventListener('dispose',()=>counts.set(r,(counts.get(r)||0)+1));
api.dispose();api.dispose();assert.equal(M.city.targets.length,0);assert.equal(notes,0);assert(!body.querySelector('#hokusai-guide'));assert(!listeners.has('city-language'));for(const r of resources)assert.equal(counts.get(r),1);assert(source.every(([o])=>o.parent||o===art.group));art.dispose();
console.log('PASS Hokusai: original geometry, instance matrices, six print/impression records and routes retained; wide-eave fit, supported mat and wall ledge below the aperture, original profile picks, EN/DE/FA/CS views/readers, RTL, no private storage and owned cleanup');
