import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as Three from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildArtistStudios} from '../src/artist-quarter-scene.js';
import {buildMorisotDetails} from '../src/morisot-studio-scene.js';
import {installArtistQuarter} from '../src/artist-quarter.js';
import {QUARTER_ARTISTS,QUARTER_COPY} from '../src/artist-quarter-data.js';
import {MORISOT_COPY,MORISOT_SOURCE} from '../src/morisot-studio-copy.js';
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
const studios=buildArtistStudios(T),house=studios.houses.find(h=>h.artist.id==='morisot'),data=JSON.stringify(QUARTER_ARTISTS),colliders=JSON.stringify(studios.colliders),points=JSON.stringify(studios.houses.map(h=>[h.entry,h.insideEntry,h.viewpoint(false),h.viewpoint(true)]));
studios.group.updateMatrixWorld(true);const borrowed=[];studios.group.traverse(o=>borrowed.push([o,o.matrixWorld.elements.slice(),JSON.stringify(o.userData),o.material,o.geometry,o.visible,o.geometry?.attributes.position?Array.from(o.geometry.attributes.position.array):null,o.material?.color?.getHex()]));
const details=buildMorisotDetails(T,house);studios.group.updateMatrixWorld(true);
assert.equal(house.artist.x,196);assert.equal(house.artist.z,159);assert.equal(house.group.rotation.y,0);assert.equal(JSON.stringify(QUARTER_ARTISTS),data);assert.equal(JSON.stringify(studios.colliders),colliders);assert.equal(JSON.stringify(studios.houses.map(h=>[h.entry,h.insideEntry,h.viewpoint(false),h.viewpoint(true)])),points);
for(const[o,m,p,material,geometry,v,vertices,color]of borrowed){assert.deepEqual(o.matrixWorld.elements,m);assert.equal(JSON.stringify(o.userData),p);assert.equal(o.material,material);assert.equal(o.geometry,geometry);assert.equal(o.visible,v);if(vertices)assert.deepEqual(Array.from(o.geometry.attributes.position.array),vertices);assert.equal(o.material?.color?.getHex(),color);}
const bounds=o=>new T.Box3().setFromObject(o).applyMatrix4(house.group.matrixWorld.clone().invert()),rack=bounds(details.rack),back=bounds(details.backing);
assert(rack.min.x>=-7.1&&rack.max.x<=-6.68,'Rack stays inside original wall walking clearance');assert(Math.abs(rack.min.x+6.9)<1e-8,'Spacers meet original wall');assert(rack.min.z>-.1&&rack.max.z<3);
details.rack.traverse(o=>{if(o.name==='Wall spacer'){const b=bounds(o);assert(Math.abs(b.min.x+6.9)<1e-8);assert(Math.abs(b.max.x-back.min.x)<1e-8);}});
assert.equal(details.cards.length,2);for(const card of details.cards)assert(Math.abs(bounds(card).min.x-back.max.x)<1e-8,'Cards meet backing');
assert.equal(details.strokes.length,6);for(const stroke of details.strokes)assert(Math.abs(stroke.position.z-stroke.geometry.parameters.depth/2-(details.cards[0].position.z+details.cards[0].geometry.parameters.depth/2)-.001)<1e-8,'Line marks clear their paper faces');
const solid=details.strokes[0],broken=details.strokes.slice(1);assert(Math.abs(solid.geometry.parameters.width-1.2)<1e-8);assert.equal(Math.min(...broken.map(o=>o.position.x-o.geometry.parameters.width/2)),-.6);assert.equal(Math.max(...broken.map(o=>o.position.x+o.geometry.parameters.width/2)),.6);assert(broken.every(o=>o.material===solid.material&&o.geometry.parameters.height===solid.geometry.parameters.height));
assert.equal(details.roofFrames.length,2);for(const{frame,roof}of details.roofFrames){assert(frame.position.equals(roof.position));assert(frame.quaternion.equals(roof.quaternion));assert.equal(frame.children.length,4);for(const edge of frame.children){const p=edge.geometry.parameters;if(edge.name==='Roof end fascia')assert(Math.abs(Math.abs(edge.position.z)-p.depth/2-roof.geometry.parameters.depth/2)<1e-8);else assert(Math.abs(Math.abs(edge.position.x)-p.width/2-roof.geometry.parameters.width/2)<1e-8);assert(p.height<=roof.geometry.parameters.height);}}
const sourceSeat=borrowed.map(x=>x[0]).find(o=>o.parent===house.group&&o.geometry?.parameters?.width===2.5&&o.geometry.parameters.height===.3),seat=bounds(sourceSeat),cushion=bounds(details.cushion);assert(Math.abs(cushion.min.y-seat.max.y)<1e-8);for(const axis of['x','z']){assert(cushion.min[axis]>=seat.min[axis]);assert(cushion.max[axis]<=seat.max[axis]);}
const settee=studios.colliders.find(o=>o.artistId==='morisot'&&o.label==='Studio settee');for(const o of details.arms){const b=new T.Box3().setFromObject(o);assert(b.min.x>=settee.minX&&b.max.x<=settee.maxX);assert(b.min.z>=settee.minZ&&b.max.z<=settee.maxZ);}
assert.equal(details.tabs.length,3);assert.equal(details.hangers.parent,house.study);for(const tab of details.tabs){assert.deepEqual(tab.userData,{quarterArtist:'morisot',quarterAction:'activity'});assert(tab.position.y-tab.geometry.parameters.height/2<=1.225,'Tabs meet original curtain top');assert(2.25+tab.position.y+tab.geometry.parameters.height/2>=details.rail.position.y-details.rail.geometry.parameters.height/2,'Tabs meet overhead rail');}
for(const bracket of details.brackets){const b=bounds(bracket);assert(Math.abs(b.max.x-6.9)<1e-8,'Brackets meet original upper wall');assert(b.min.y>3.35,'Fittings leave original window aperture clear');}
for(const[o]of borrowed)if(o===house.image||o===house.study||o.userData.quarterAction==='reflect')assert(!rack.intersectsBox(bounds(o)),'Rack clears original portrait/curtain/reflection target');
for(const joint of details.joints)assert(bounds(joint).max.y<=.99,'Desk details clear paper and reflection token');
for(let i=1;i<=3;i++){house.change();studios.group.updateMatrixWorld(true);const z=[-2.4,0,2.4][i%3];assert.equal(house.study.position.z,z);for(const tab of details.tabs){const p=tab.getWorldPosition(new T.Vector3());assert(Math.abs(p.z-(house.artist.z+z+tab.position.z))<1e-8,'Tabs inherit the original curtain phase');assert(Math.abs(p.x-(house.artist.x+6.68))<1e-8);assert(Math.abs(p.z-house.artist.z)<=3.45,'Tabs stay under the original rail span');}}
const origin=house.group.localToWorld(new T.Vector3(-5.6,1.8,1.1)),aim=details.rack.getWorldPosition(new T.Vector3());assert(new T.Raycaster(origin,aim.sub(origin).normalize()).intersectObjects(details.targets,true).length);assert(studios.canStand(196-5.6,159+1.1));
const disposable=new Set();for(const parent of[details.group,details.hangers])parent.traverse(o=>{if(o.geometry)disposable.add(o.geometry);if(o.material)disposable.add(o.material);});const counts=new Map();for(const r of disposable)r.addEventListener('dispose',()=>counts.set(r,(counts.get(r)||0)+1));details.dispose();details.dispose();for(const r of disposable)assert.equal(counts.get(r),1);assert(borrowed.every(([o])=>o.parent||o===studios.group));studios.dispose();
// Real shared studio controller: reading/locale never mutates exercise or notes.
const values=new Map([['private-note','  Preserve česky / فارسی  ']]);let writes=0,opened;
const store=createVisitMemory({getItem:k=>values.get(k),setItem:(k,v)=>{writes++;values.set(k,v);}});store.question('studio-morisot','personal','Original private question');store.answer('studio-morisot','Synthetic private answer');store.discover('studio-morisot');
const M={scene:new T.Scene(),mode:'city',player:{x:0,z:0},eye:1.65,clearMovement(){},arrive(p){Object.assign(this.player,p);},visitorMemory:{store,open:id=>opened=id},city:{ART:{x:118,z:108,scale:1.35},art:{houses:[]},targets:[],buildingTargets:[],region:()=>({id:'city'}),canStand:()=>true,targetInfo:()=>({kind:'old'}),update(){}},showExtra(){},startExtra(){}};
const api=installArtistQuarter(M,T),dialog=body.querySelector('#artist-quarter'),h=api.studios.houses.find(h=>h.artist.id==='morisot'),initial=JSON.stringify([...values]),state=JSON.stringify(store.state),initialWrites=writes,btn=text=>find(dialog,n=>n.tagName==='button'&&n.textContent===text);
for(const lang of['en','de','fa','cs']){
 const c=QUARTER_COPY[lang],read=MORISOT_COPY[lang];assert.deepEqual(Object.keys(c).sort(),Object.keys(QUARTER_COPY.en).sort());assert.deepEqual(Object.keys(read).sort(),Object.keys(MORISOT_COPY.en).sort());assert.equal(read.steps.length,3);window.CITY_I18N.lang=lang;
 Object.assign(M.player,{x:0,z:0});const position=h.study.position.z;api.open('morisot');assert(!btn(c.near));assert(!btn(QUARTER_ARTISTS[1].activity[lang]));assert(btn(c.enter));assert(dialog.textContent.includes(read.intro));assert.equal(dialog.lang,lang);assert.equal(dialog.dir,lang==='fa'?'rtl':'ltr');
 const link=find(dialog,n=>n.tagName==='a'&&n.textContent===read.source);assert.equal(link.href,MORISOT_SOURCE);assert.equal(link.rel,'noopener noreferrer');btn(c.enter).onclick();assert.deepEqual({x:M.player.x,z:M.player.z},{x:h.insideEntry.x,z:h.insideEntry.z});
 api.open('morisot');btn(c.detail).onclick();assert(find(dialog,n=>n.tagName==='img'&&n.src.includes('morisot-detail.jpg')));btn(c.whole).onclick();assert(find(dialog,n=>n.tagName==='img'&&n.src.includes('morisot.jpg')));
 for(const far of[false,true]){api.open('morisot');btn(far?c.far:c.near).onclick();const p=h.viewpoint(far);for(const key of['x','z','yaw','pitch'])assert.equal(M.player[key],p[key]);}
 api.open('morisot');emit('city-language');assert.equal(h.study.position.z,position);assert.equal(writes,initialWrites);assert.equal(JSON.stringify([...values]),initial);assert.equal(JSON.stringify(store.state),state);
 const board=h.group.getObjectByName('Original city continuous and broken edge rack');M.showExtra(M.city.targetInfo(board.userData));assert(dialog.open);assert(dialog.textContent.includes(read.board));
 for(let i=1;i<=3;i++){btn(QUARTER_ARTISTS[1].activity[lang]).onclick();assert.equal(h.study.position.z,[-2.4,0,2.4][i%3]);api.open('morisot');}
 assert.equal(writes,initialWrites);btn(c.reflect).onclick();assert.equal(JSON.stringify(store.state.questions),JSON.stringify(JSON.parse(state).questions),'Explicit revisit cannot rewrite an existing private question/answer');
 btn(c.note).onclick();assert.equal(opened,'studio-morisot');assert.equal(values.get('private-note'),'  Preserve česky / فارسی  ');
}
Object.assign(M.player,{x:0,z:0});dialog.close();const before=h.study.position.z;M.showExtra({kind:'artist-quarter',data:{quarterArtist:'morisot',quarterAction:'activity'}});assert.equal(h.study.position.z,before,'Remote activity remains guarded');
for(const id of['cezanne','seurat']){const other=api.studios.houses.find(h=>h.artist.id===id);Object.assign(M.player,other.insideEntry);const old=other.change();assert.equal(old,1);assert.equal(other.change(),2);assert.equal(other.change(),0);}
const manifest=JSON.parse(readFileSync(new URL('../src/assets/artist-quarter/credits.json',import.meta.url),'utf8')),record=manifest.assets.find(a=>a.file==='morisot.jpg');for(const[file,hash]of[[record.file,record.sha256],[record.detailFile,record.detailSha256]])assert.equal(createHash('sha256').update(readFileSync(new URL('../src/assets/artist-quarter/'+file,import.meta.url))).digest('hex'),hash);
emit('pagehide');assert.equal(M.city.targets.length,0);assert.equal(M.scene.children.length,0);assert.equal(M.city.buildingTargets.length,0);
console.log('PASS Morisot: original studio/portrait/notes retained, source-fit split-roof trim, supported rack/settee, rail/tabs follow all original curtain phases, near/far/detail, EN/DE/FA/CS, RTL, other studios and owned cleanup');
