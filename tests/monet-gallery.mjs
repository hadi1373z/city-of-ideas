import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildArtCity} from '../src/city-source-assets/home-tools/art-city-scene.js';
import {ARTISTS} from '../src/city-source-assets/home-tools/art-city-data.js';
import {installMonetGallery} from '../src/monet-gallery.js';
import {MONET_COPY,MONET_SOURCES,MONET_WORKS} from '../src/monet-gallery-copy.js';
const art=buildArtCity(T,ARTISTS),scope={};vm.runInNewContext(readFileSync(new URL('../src/artist-quarter-layout.js',import.meta.url),'utf8'),scope);scope.layoutArtistQuarter(T,art);
const house=art.houses.find(h=>h.artistId==='monet'),catalog=JSON.stringify(ARTISTS),colliders=JSON.stringify(art.colliders),positions=JSON.stringify(art.houses.map(h=>[h.entry,h.spawnInside,h.approaches]));
art.group.updateMatrixWorld(true);
const source=[];art.group.traverse(o=>source.push([o,o.matrixWorld.elements.slice(),JSON.stringify(o.userData),o.material,o.geometry,o.visible]));
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
const api=installMonetGallery(M,T),dialog=body.querySelector('#monet-guide'),panel=body.querySelector('#monet-guide-context');assert(api);
const buttons=()=>{const r=[];const walk=n=>{if(n.tagName==='button')r.push(n);n.children.forEach(walk);};walk(dialog);return r;};
const get=(text,index=0)=>buttons().filter(b=>b.textContent===text)[index];
assert.equal(M.city.canStand,originalCan);assert.equal(JSON.stringify(ARTISTS),catalog);assert.equal(JSON.stringify(art.colliders),colliders);assert.equal(JSON.stringify(art.houses.map(h=>[h.entry,h.spawnInside,h.approaches])),positions);
assert(Math.abs(118+house.cx*1.35-85)<1e-8);assert(Math.abs(108+house.cz*1.35-82)<1e-8);
// Compare all borrowed meshes, payloads and resources in the same original frame.
art.group.position.set(0,0,0);art.group.scale.setScalar(1);art.group.updateMatrixWorld(true);
for(const [o,m,data,material,geometry,visible]of source){assert.deepEqual(o.matrixWorld.elements,m);assert.equal(JSON.stringify(o.userData),data);assert.equal(o.material,material);assert.equal(o.geometry,geometry);assert.equal(o.visible,visible);}
const localBounds=o=>{o.updateMatrix();return new T.Box3().setFromObject(o).translate(new T.Vector3(-house.cx,0,-house.cz));};
const folioBounds=localBounds(api.details.folio),desk=source.map(x=>x[0]).find(o=>o.parent===house.group&&o.geometry?.parameters?.width===1.3&&o.position.y===.77),deskBounds=localBounds(desk);
assert(Math.abs(folioBounds.min.y-deskBounds.max.y)<1e-8,'Folio rests on original tabletop');
for(const axis of['x','z']){assert(folioBounds.min[axis]>=deskBounds.min[axis]);assert(folioBounds.max[axis]<=deskBounds.max[axis]);}
const palette=source.map(x=>x[0]).find(o=>o.parent===house.group&&o.geometry?.type==='CylinderGeometry');assert(!folioBounds.intersectsBox(localBounds(palette)),'Folio clears original palette');
const brushes=art.group.children.find(o=>o.isInstancedMesh&&o.geometry.type==='CylinderGeometry');brushes.geometry.computeBoundingBox();
for(let i=0;i<brushes.count;i++){const matrix=new T.Matrix4();brushes.getMatrixAt(i,matrix);const bounds=brushes.geometry.boundingBox.clone().applyMatrix4(matrix).translate(new T.Vector3(-house.cx,0,-house.cz));assert(!folioBounds.intersectsBox(bounds),'Folio clears original brush instances');}
for(const a of[house.entry,house.spawnInside,...house.approaches])assert(art.canStand(a.x,a.z));
const frameIds=new Set();house.group.traverse(o=>{if(o.userData.workId)frameIds.add(o.userData.workId);});assert.deepEqual([...frameIds],MONET_WORKS);
const ray=new T.Raycaster(new T.Vector3(house.cx+1.95,1.5,house.cz+2.5),api.details.folio.getWorldPosition(new T.Vector3()).sub(new T.Vector3(house.cx+1.95,1.5,house.cz+2.5)).normalize());assert(ray.intersectObjects(api.details.targets,true).length,'Physical folio selectable');
art.group.position.set(118,.06,108);art.group.scale.setScalar(1.35);
M.city.update();assert(panel.hidden);M.showExtra({kind:'monet-guide'});assert(!dialog.open,'Remote physical picks rejected');M.showExtra({kind:'other'});assert.equal(delegated,1);assert.equal(M.city.targetInfo({}).kind,'old');assert.equal(M.city.targetInfo({monetGuide:true}).kind,'monet-guide');
for(const lang of['en','de','fa','cs']){
 const c=MONET_COPY[lang];assert.deepEqual(Object.keys(c).sort(),Object.keys(MONET_COPY.en).sort());assert.equal(c.prompts.length,6);assert.equal(c.titles.length,6);assert(c.prompts.every(s=>s.length>40));window.CITY_I18N.lang=lang;
 Object.assign(M.player,{x:0,z:0});dialog.children[1].scrollTop=123;api.open();assert.equal(dialog.children[1].scrollTop,0);assert(!get(c.look));assert(get(c.enter));get(c.enter).onclick();assert(!dialog.open);
 Object.assign(M.player,{x:118+house.spawnInside.x*1.35,z:108+house.spawnInside.z*1.35});
 M.showExtra({kind:'monet-guide'});assert(dialog.open);assert.equal(dialog.dir,lang==='fa'?'rtl':'ltr');assert.equal(dialog.lang,lang);assert(dialog.textContent.includes(c.boundary));assert(dialog.textContent.includes(c.folio));
 for(let i=0;i<6;i++){
  api.open();const p=house.approaches[i];get(c.look,i).onclick();assert(!dialog.open);assert(Math.abs(M.player.x-(118+p.x*1.35))<1e-8);assert(Math.abs(M.player.z-(108+p.z*1.35))<1e-8);assert.equal(M.player.yaw,p.yaw);assert(Number.isFinite(M.player.pitch));
  api.open();get(c.catalog,i).onclick();assert.deepEqual(picked,{artistId:'monet',workId:MONET_WORKS[i]});
 }
 api.open();for(const locale of['de','fa','cs','en']){window.CITY_I18N.lang=locale;listeners.get('city-language')();assert.equal(dialog.dir,locale==='fa'?'rtl':'ltr');assert(dialog.textContent.includes(MONET_COPY[locale].intro));}
 dialog.close();M.city.update();assert(!panel.hidden);assert.equal(notes,0);
}
assert(Object.values(MONET_SOURCES).every(s=>s.startsWith('https://')));
const resources=new Set();api.details.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)resources.add(o.material);});const counts=new Map();for(const r of resources)r.addEventListener('dispose',()=>counts.set(r,(counts.get(r)||0)+1));
api.dispose();api.dispose();assert.equal(M.city.targets.length,0);assert.equal(notes,0);assert(!body.querySelector('#monet-guide'));assert(!listeners.has('city-language'));for(const r of resources)assert.equal(counts.get(r),1);assert(source.every(([o])=>o.parent||o===art.group));art.dispose();
console.log('PASS Monet: borrowed geometry/catalog/works retained, supported folio clears palette/brushes, original routes/viewpoints, four-language controls and catalog handoffs, Persian RTL, no private storage, owned cleanup');
