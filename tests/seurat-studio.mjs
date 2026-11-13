import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as Three from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildArtistStudios} from '../src/artist-quarter-scene.js';
import {buildSeuratDetails} from '../src/seurat-studio-scene.js';
import {installArtistQuarter} from '../src/artist-quarter.js';
import {QUARTER_ARTISTS,QUARTER_COPY} from '../src/artist-quarter-data.js';
import {SEURAT_COPY,SEURAT_SOURCE} from '../src/seurat-studio-copy.js';
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
const studios=buildArtistStudios(T),house=studios.houses.find(h=>h.artist.id==='seurat'),data=JSON.stringify(QUARTER_ARTISTS),colliders=JSON.stringify(studios.colliders),points=JSON.stringify(studios.houses.map(h=>[h.entry,h.insideEntry,h.viewpoint(false),h.viewpoint(true)]));
studios.group.updateMatrixWorld(true);const borrowed=[];studios.group.traverse(o=>borrowed.push([o,o.matrixWorld.elements.slice(),JSON.stringify(o.userData),o.material,o.geometry,o.visible,o.geometry?.attributes.position?Array.from(o.geometry.attributes.position.array):null,o.material?.color?.getHex()]));
const details=buildSeuratDetails(T,house);studios.group.updateMatrixWorld(true);
assert.equal(house.artist.x,182);assert.equal(house.artist.z,196);assert.equal(house.group.rotation.y,Math.PI);assert.equal(JSON.stringify(QUARTER_ARTISTS),data);assert.equal(JSON.stringify(studios.colliders),colliders);assert.equal(JSON.stringify(studios.houses.map(h=>[h.entry,h.insideEntry,h.viewpoint(false),h.viewpoint(true)])),points);
for(const[o,m,p,material,geometry,v,vertices,color]of borrowed){assert.deepEqual(o.matrixWorld.elements,m);assert.equal(JSON.stringify(o.userData),p);assert.equal(o.material,material);assert.equal(o.geometry,geometry);assert.equal(o.visible,v);if(vertices)assert.deepEqual(Array.from(o.geometry.attributes.position.array),vertices);assert.equal(o.material?.color?.getHex(),color);}
const dots=house.study.children.find(o=>o.isInstancedMesh),colours=Array.from(dots.instanceColor.array),dotGeometry=dots.geometry,originalMatrices=Array.from(dots.instanceMatrix.array);
assert.equal(dots.count,864);assert.equal(dotGeometry.parameters.radius,.028);
const bounds=o=>new T.Box3().setFromObject(o).applyMatrix4(house.group.matrixWorld.clone().invert()),rack=bounds(details.rack),back=bounds(details.backing),frame=bounds(details.panelFrame);
assert(rack.min.x>=-7.1&&rack.max.x<=-6.68);assert(Math.abs(rack.min.x+6.9)<1e-8);assert(rack.min.z>2.5&&rack.max.z<4.5,'Reading placard clears original dot panel and doorway');
details.rack.traverse(o=>{if(o.name==='Wall spacer'){const b=bounds(o);assert(Math.abs(b.min.x+6.9)<1e-8);assert(Math.abs(b.max.x-back.min.x)<1e-8);}});
assert.equal(details.cards.length,2);for(const card of details.cards)assert(Math.abs(bounds(card).min.x-back.max.x)<1e-8);
assert.equal(details.symbols.length,2);assert.equal(details.rules.length,4);for(const symbol of details.symbols)assert(Math.abs(symbol.position.z-(details.cards[0].position.z+details.cards[0].geometry.parameters.depth/2)-.001)<1e-8);
assert.equal(details.roofFrames.length,2);for(const{frame,roof}of details.roofFrames){assert(frame.position.equals(roof.position));assert(frame.quaternion.equals(roof.quaternion));for(const edge of frame.children){const p=edge.geometry.parameters;if(edge.name==='Roof end fascia')assert(Math.abs(Math.abs(edge.position.z)-p.depth/2-roof.geometry.parameters.depth/2)<1e-8);else assert(Math.abs(Math.abs(edge.position.x)-p.width/2-roof.geometry.parameters.width/2)<1e-8);}}
assert.equal(details.panelFrame.parent,house.study);assert(Math.abs(frame.min.x+6.9)<1e-8);assert(frame.max.x<=-6.68,'Dot frame stays within original wall clearance');assert.equal(details.rails.length,4);assert.equal(details.spacers.length,4);
for(const rail of details.rails)assert.deepEqual(rail.userData,{quarterArtist:'seurat',quarterAction:'activity'});
for(const joint of details.joints)assert(bounds(joint).max.y<=.99,'Desk fittings clear original paper/reflection token');
for(const[o]of borrowed)if(o===house.image||o===house.study||o.userData.quarterAction==='reflect')assert(!rack.intersectsBox(bounds(o)));
function checkDots(scale){
 assert.equal(dots.count,864);assert.equal(dots.geometry,dotGeometry);assert.deepEqual(Array.from(dots.instanceColor.array),colours);
 for(let y=0;y<24;y++)for(let x=0;x<36;x++){
  const m=new T.Matrix4();dots.getMatrixAt(y*36+x,m);const expected=new T.Matrix4().makeTranslation((x-17.5)*.088*scale,(y-11.5)*.083*scale,.045);for(let j=0;j<16;j++)assert(Math.abs(m.elements[j]-expected.elements[j])<1e-6,'Original independent grid formula');
  assert(Math.abs(m.elements[12])+.028<1.7&&Math.abs(m.elements[13])+.028<1.1,'All dots clear added frame in every phase');
 }
}
checkDots(1);for(let i=1;i<=3;i++){house.change();checkDots([1,.75,.6][i%3]);}assert.deepEqual(Array.from(dots.instanceMatrix.array),originalMatrices,'Third action restores exact original matrices');
const origin=house.group.localToWorld(new T.Vector3(-5.6,1.8,3.5)),aim=details.rack.getWorldPosition(new T.Vector3());assert(new T.Raycaster(origin,aim.sub(origin).normalize()).intersectObjects(details.targets,true).length);const p=house.world(-5.6,3.5);assert(studios.canStand(p.x,p.z));
const disposable=new Set();for(const parent of[details.group,details.panelFrame])parent.traverse(o=>{if(o.geometry)disposable.add(o.geometry);if(o.material)disposable.add(o.material);});const counts=new Map();for(const r of disposable)r.addEventListener('dispose',()=>counts.set(r,(counts.get(r)||0)+1));details.dispose();details.dispose();for(const r of disposable)assert.equal(counts.get(r),1);assert(borrowed.every(([o])=>o.parent||o===studios.group));studios.dispose();
// Real shared studio controller: reading/locale never mutates exercise or notes.
const values=new Map([['private-note','  Preserve česky / فارسی  ']]);let writes=0,opened;
const store=createVisitMemory({getItem:k=>values.get(k),setItem:(k,v)=>{writes++;values.set(k,v);}});store.question('studio-seurat','personal','Original private question');store.answer('studio-seurat','Synthetic private answer');store.discover('studio-seurat');
const M={scene:new T.Scene(),mode:'city',player:{x:0,z:0},eye:1.65,clearMovement(){},arrive(p){Object.assign(this.player,p);},visitorMemory:{store,open:id=>opened=id},city:{ART:{x:118,z:108,scale:1.35},art:{houses:[]},targets:[],buildingTargets:[],region:()=>({id:'city'}),canStand:()=>true,targetInfo:()=>({kind:'old'}),update(){}},showExtra(){},startExtra(){}};
const api=installArtistQuarter(M,T),dialog=body.querySelector('#artist-quarter'),h=api.studios.houses.find(h=>h.artist.id==='seurat'),initial=JSON.stringify([...values]),state=JSON.stringify(store.state),initialWrites=writes,btn=text=>find(dialog,n=>n.tagName==='button'&&n.textContent===text);
h.change();const liveDots=h.study.children.find(o=>o.isInstancedMesh),heldMatrices=Array.from(liveDots.instanceMatrix.array);
for(const lang of['en','de','fa','cs']){
 const c=QUARTER_COPY[lang],read=SEURAT_COPY[lang];assert.deepEqual(Object.keys(c).sort(),Object.keys(QUARTER_COPY.en).sort());assert.deepEqual(Object.keys(read).sort(),Object.keys(SEURAT_COPY.en).sort());assert.equal(read.steps.length,3);window.CITY_I18N.lang=lang;
 Object.assign(M.player,{x:0,z:0});const held=Array.from(liveDots.instanceMatrix.array);api.open('seurat');assert(!btn(c.near));assert(!btn(QUARTER_ARTISTS[2].activity[lang]));assert(btn(c.enter));assert(dialog.textContent.includes(read.intro));assert.equal(dialog.lang,lang);assert.equal(dialog.dir,lang==='fa'?'rtl':'ltr');
 const link=find(dialog,n=>n.tagName==='a'&&n.textContent===read.source);assert.equal(link.href,SEURAT_SOURCE);assert.equal(link.rel,'noopener noreferrer');btn(c.enter).onclick();assert.deepEqual({x:M.player.x,z:M.player.z},{x:h.insideEntry.x,z:h.insideEntry.z});
 api.open('seurat');btn(c.detail).onclick();assert(find(dialog,n=>n.tagName==='img'&&n.src.includes('seurat-detail.jpg')));btn(c.whole).onclick();assert(find(dialog,n=>n.tagName==='img'&&n.src.includes('seurat.jpg')));
 for(const far of[false,true]){api.open('seurat');btn(far?c.far:c.near).onclick();const p=h.viewpoint(far);for(const key of['x','z','yaw','pitch'])assert.equal(M.player[key],p[key]);}
 api.open('seurat');emit('city-language');assert.deepEqual(Array.from(liveDots.instanceMatrix.array),held);assert.equal(writes,initialWrites);assert.equal(JSON.stringify([...values]),initial);assert.equal(JSON.stringify(store.state),state);
 const board=h.group.getObjectByName('Original city mark and surface placard');M.showExtra(M.city.targetInfo(board.userData));assert(dialog.open);assert(dialog.textContent.includes(read.board));
 for(let i=1;i<=3;i++){btn(QUARTER_ARTISTS[2].activity[lang]).onclick();assert(Math.abs(liveDots.instanceMatrix.array[12]-(-17.5*.088*[1,.75,.6][(i+1)%3]))<1e-6);api.open('seurat');}
 assert.deepEqual(Array.from(liveDots.instanceMatrix.array),heldMatrices);assert.equal(writes,initialWrites);btn(c.reflect).onclick();assert.equal(JSON.stringify(store.state.questions),JSON.stringify(JSON.parse(state).questions),'Explicit revisit cannot rewrite an existing private question/answer');
 btn(c.note).onclick();assert.equal(opened,'studio-seurat');assert.equal(values.get('private-note'),'  Preserve česky / فارسی  ');
}
Object.assign(M.player,{x:0,z:0});dialog.close();const before=Array.from(liveDots.instanceMatrix.array);M.showExtra({kind:'artist-quarter',data:{quarterArtist:'seurat',quarterAction:'activity'}});assert.deepEqual(Array.from(liveDots.instanceMatrix.array),before,'Remote activity remains guarded');
for(const id of['morisot','cezanne']){const other=api.studios.houses.find(h=>h.artist.id===id);Object.assign(M.player,other.insideEntry);const old=other.change();assert.equal(old,1);assert.equal(other.change(),2);assert.equal(other.change(),0);}
const manifest=JSON.parse(readFileSync(new URL('../src/assets/artist-quarter/credits.json',import.meta.url),'utf8')),record=manifest.assets.find(a=>a.file==='seurat.jpg');for(const[file,hash]of[[record.file,record.sha256],[record.detailFile,record.detailSha256]])assert.equal(createHash('sha256').update(readFileSync(new URL('../src/assets/artist-quarter/'+file,import.meta.url))).digest('hex'),hash);
emit('pagehide');assert.equal(M.city.targets.length,0);assert.equal(M.scene.children.length,0);assert.equal(M.city.buildingTargets.length,0);
console.log('PASS Seurat: original pi studio/image/private flow, exact 864-dot colours and all phase matrices retained; clear supported frames/placard/joinery, near/far/detail, four languages/RTL, held nonzero phase, other studios and owned cleanup');
