import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as Three from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildArtistStudios} from '../src/artist-quarter-scene.js';
import {buildCezanneDetails} from '../src/cezanne-studio-scene.js';
import {installArtistQuarter} from '../src/artist-quarter.js';
import {QUARTER_ARTISTS,QUARTER_COPY} from '../src/artist-quarter-data.js';
import {CEZANNE_COPY,CEZANNE_SOURCE} from '../src/cezanne-studio-copy.js';
import {createVisitMemory} from '../src/visit-memory.js';
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.style={};this.attributes={};this.events={};this._text='';this.open=false;}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.remove();n.parent=this;this.children.push(n);}}prepend(n){n.remove();n.parent=this;this.children.unshift(n);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null;}
 replaceChildren(...nodes){this.children.forEach(n=>n.parent=null);this.children=[];this._text='';this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k]??null;}
 addEventListener(k,fn){this.events[k]=fn;}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}focus(){document.activeElement=this;}
 getContext(){return new Proxy({},{get:()=>()=>{}});}
 querySelector(s){return find(this,n=>s==='dialog[open]'?n.tagName==='dialog'&&n.open:s==='#artist-quarter[open]'?n.id==='artist-quarter'&&n.open:s.startsWith('#')?n.id===s.slice(1):s.startsWith('.')?n.className===s.slice(1):n.tagName===s);}
 get isConnected(){return !!this.parent;}
}
function find(n,p){for(const c of n.children){if(p(c))return c;const r=find(c,p);if(r)return r;}return null;}
const body=new Element('body');globalThis.document={body,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s)};
globalThis.window={CITY_I18N:{lang:'en'}};const events=new Map();globalThis.addEventListener=(k,fn)=>{if(!events.has(k))events.set(k,new Set());events.get(k).add(fn);};globalThis.removeEventListener=(k,fn)=>events.get(k)?.delete(fn);
const emit=k=>{for(const fn of[...events.get(k)||[]])fn();},T={...Three,TextureLoader:class{load(){return new Three.Texture();}}};
const studios=buildArtistStudios(T),house=studios.houses.find(h=>h.artist.id==='cezanne'),data=JSON.stringify(QUARTER_ARTISTS),colliders=JSON.stringify(studios.colliders),points=JSON.stringify(studios.houses.map(h=>[h.entry,h.insideEntry,h.viewpoint(false),h.viewpoint(true)]));
studios.group.updateMatrixWorld(true);const borrowed=[];studios.group.traverse(o=>borrowed.push([o,o.matrixWorld.elements.slice(),JSON.stringify(o.userData),o.material,o.geometry,o.visible,o.geometry?.attributes.position?Array.from(o.geometry.attributes.position.array):null,o.material?.color?.getHex()]));
const details=buildCezanneDetails(T,house);studios.group.updateMatrixWorld(true);
assert.equal(house.artist.x,171);assert.equal(house.artist.z,161);assert.equal(house.group.rotation.y,0);assert.equal(JSON.stringify(QUARTER_ARTISTS),data);assert.equal(JSON.stringify(studios.colliders),colliders);assert.equal(JSON.stringify(studios.houses.map(h=>[h.entry,h.insideEntry,h.viewpoint(false),h.viewpoint(true)])),points);
for(const[o,m,p,material,geometry,v,vertices,color]of borrowed){assert.deepEqual(o.matrixWorld.elements,m);assert.equal(JSON.stringify(o.userData),p);assert.equal(o.material,material);assert.equal(o.geometry,geometry);assert.equal(o.visible,v);if(vertices)assert.deepEqual(Array.from(o.geometry.attributes.position.array),vertices);assert.equal(o.material?.color?.getHex(),color);}
const bounds=o=>new T.Box3().setFromObject(o).applyMatrix4(house.group.matrixWorld.clone().invert()),board=bounds(details.board),back=bounds(details.backing);
assert(board.min.x>=-7.1&&board.max.x<=-6.68,'Board stays inside the original wall walking clearance');assert(Math.abs(board.min.x+6.9)<1e-8,'Spacers meet the left wall');assert(board.max.z<3&&board.min.z>-.1,'Board clears front openings and fruit study');
details.board.traverse(o=>{if(o.name==='Wall spacer'){const b=bounds(o);assert(Math.abs(b.min.x+6.9)<1e-8);assert(Math.abs(b.max.x-back.min.x)<1e-8);}});
assert.equal(details.cards.length,2);for(const card of details.cards){const b=bounds(card);assert(Math.abs(b.min.x-back.max.x)<1e-8,'Cards meet backing');}
assert.equal(details.outlines.length,8);for(const edge of details.outlines)assert(Math.abs(edge.position.z-edge.geometry.parameters.depth/2-(details.cards[0].position.z+details.cards[0].geometry.parameters.depth/2)-.001)<1e-8,'Outlines clear paper faces');
assert.equal(details.rakes.length,4);const roof=borrowed.map(x=>x[0]).find(o=>o.parent===house.group&&o.geometry?.type==='BufferGeometry'),v=roof.geometry.attributes.position;
for(const rake of details.rakes)for(const side of[-1,1]){const p=new T.Vector3(side*rake.geometry.parameters.width/2,0,0).applyMatrix4(rake.matrixWorld).applyMatrix4(house.group.matrixWorld.clone().invert());let d=Infinity;for(let i=0;i<v.count;i++)d=Math.min(d,Math.hypot(p.x-v.getX(i),p.y-v.getY(i),p.z-v.getZ(i)));assert(d<1e-6,'Rakes meet real roof vertices');}
assert.equal(details.caps.length,8);for(const cap of details.caps){const b=bounds(cap);assert(Math.abs(b.min.z-6.19)<1e-8);assert(b.max.z<6.32);assert(b.max.y<=1.07||b.min.y>=3.34,'Caps remain within existing window rails');}
for(const[o]of borrowed)if(o===house.image||o===house.study||o.userData.quarterAction==='reflect')assert(!board.intersectsBox(bounds(o)),'Board clears original work/study/reflection target');
for(const o of[...details.aprons,details.drawer]){const b=bounds(o);assert(b.max.y<1.08,'Joinery clears the original paper, reflection token and live study');}
const origin=house.group.localToWorld(new T.Vector3(-5.6,1.8,1.1)),aim=details.board.getWorldPosition(new T.Vector3());assert(new T.Raycaster(origin,aim.sub(origin).normalize()).intersectObjects(details.targets,true).length);assert(studios.canStand(171-5.6,161+1.1));
const disposable=new Set();details.group.traverse(o=>{if(o.geometry)disposable.add(o.geometry);if(o.material)disposable.add(o.material);});const counts=new Map();for(const r of disposable)r.addEventListener('dispose',()=>counts.set(r,(counts.get(r)||0)+1));details.dispose();details.dispose();for(const r of disposable)assert.equal(counts.get(r),1);assert(borrowed.every(([o])=>o.parent||o===studios.group));studios.dispose();
// Real shared studio controller: reading/locale never mutates exercise or notes.
const values=new Map([['private-note','  Preserve česky / فارسی  ']]);let writes=0,opened;
const store=createVisitMemory({getItem:k=>values.get(k),setItem:(k,v)=>{writes++;values.set(k,v);}});store.question('studio-cezanne','personal','Original private question');store.answer('studio-cezanne','Synthetic private answer');store.discover('studio-cezanne');
const M={scene:new T.Scene(),mode:'city',player:{x:0,z:0},eye:1.65,clearMovement(){},arrive(p){Object.assign(this.player,p);},visitorMemory:{store,open:id=>opened=id},city:{ART:{x:118,z:108,scale:1.35},art:{houses:[]},targets:[],buildingTargets:[],region:()=>({id:'city'}),canStand:()=>true,targetInfo:()=>({kind:'old'}),update(){}},showExtra(){},startExtra(){}};
const api=installArtistQuarter(M,T),dialog=body.querySelector('#artist-quarter'),h=api.studios.houses.find(h=>h.artist.id==='cezanne'),initial=JSON.stringify([...values]),state=JSON.stringify(store.state),initialWrites=writes,btn=text=>find(dialog,n=>n.tagName==='button'&&n.textContent===text);
for(const lang of['en','de','fa','cs']){
 const c=QUARTER_COPY[lang],read=CEZANNE_COPY[lang];assert.deepEqual(Object.keys(c).sort(),Object.keys(QUARTER_COPY.en).sort());assert.deepEqual(Object.keys(read).sort(),Object.keys(CEZANNE_COPY.en).sort());assert.equal(read.steps.length,3);window.CITY_I18N.lang=lang;
 Object.assign(M.player,{x:0,z:0});const rotation=h.study.rotation.y;api.open('cezanne');assert(!btn(c.near));assert(!btn(QUARTER_ARTISTS[0].activity[lang]));assert(btn(c.enter));assert(dialog.textContent.includes(read.intro));assert.equal(dialog.lang,lang);assert.equal(dialog.dir,lang==='fa'?'rtl':'ltr');
 const link=find(dialog,n=>n.tagName==='a'&&n.textContent===read.source);assert.equal(link.href,CEZANNE_SOURCE);assert.equal(link.rel,'noopener noreferrer');btn(c.enter).onclick();assert.deepEqual({x:M.player.x,z:M.player.z},{x:h.insideEntry.x,z:h.insideEntry.z});
 api.open('cezanne');btn(c.detail).onclick();assert(find(dialog,n=>n.tagName==='img'&&n.src.includes('cezanne-detail.jpg')));btn(c.whole).onclick();assert(find(dialog,n=>n.tagName==='img'&&n.src.includes('cezanne.jpg')));
 for(const far of[false,true]){api.open('cezanne');btn(far?c.far:c.near).onclick();const p=h.viewpoint(far);for(const key of['x','z','yaw','pitch'])assert.equal(M.player[key],p[key]);}
 api.open('cezanne');emit('city-language');assert.equal(h.study.rotation.y,rotation);assert.equal(writes,initialWrites);assert.equal(JSON.stringify([...values]),initial);assert.equal(JSON.stringify(store.state),state);
 const board=h.group.getObjectByName('Original city table-outline board');M.showExtra(M.city.targetInfo(board.userData));assert(dialog.open);assert(dialog.textContent.includes(read.board));
 for(let i=1;i<=3;i++){btn(QUARTER_ARTISTS[0].activity[lang]).onclick();assert(Math.abs(h.study.rotation.y-(i%3)*Math.PI/5)<1e-12);api.open('cezanne');}
 assert.equal(writes,initialWrites);btn(c.reflect).onclick();assert.equal(JSON.stringify(store.state.questions),JSON.stringify(JSON.parse(state).questions),'Explicit revisit cannot rewrite an existing private question/answer');
 btn(c.note).onclick();assert.equal(opened,'studio-cezanne');assert.equal(values.get('private-note'),'  Preserve česky / فارسی  ');
}
Object.assign(M.player,{x:0,z:0});dialog.close();const before=h.study.rotation.y;M.showExtra({kind:'artist-quarter',data:{quarterArtist:'cezanne',quarterAction:'activity'}});assert.equal(h.study.rotation.y,before,'Remote activity remains guarded');
for(const id of['morisot','seurat']){const other=api.studios.houses.find(h=>h.artist.id===id);Object.assign(M.player,other.insideEntry);const old=other.change();assert.equal(old,1);assert.equal(other.change(),2);assert.equal(other.change(),0);}
const manifest=JSON.parse(readFileSync(new URL('../src/assets/artist-quarter/credits.json',import.meta.url),'utf8')),record=manifest.assets.find(a=>a.file==='cezanne.jpg');for(const[file,hash]of[[record.file,record.sha256],[record.detailFile,record.detailSha256]])assert.equal(createHash('sha256').update(readFileSync(new URL('../src/assets/artist-quarter/'+file,import.meta.url))).digest('hex'),hash);
emit('pagehide');assert.equal(M.city.targets.length,0);assert.equal(M.scene.children.length,0);assert.equal(M.city.buildingTargets.length,0);
console.log('PASS Cézanne: exact original studio/work/notes, source-fit joinery/board/roof, live three-phase study and viewpoints, other studios, EN/DE/FA/CS reading/controls, RTL, explicit private actions and owned cleanup');
