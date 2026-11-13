import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import * as Three from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildArtCity} from '../src/city-source-assets/home-tools/art-city-scene.js';
import {ARTISTS} from '../src/city-source-assets/home-tools/art-city-data.js';
import {addDaliHouse} from '../src/city-source-assets/home-tools/dali-house-scene.js';
import {DALI_ARTIST,DALI_OBJECTS} from '../src/city-source-assets/home-tools/dali-data.js';
import {buildDaliDetails} from '../src/dali-house-details.js';
import {installDaliGuide} from '../src/dali-house-reading.js';
import {DALI_GUIDE_COPY,DALI_GUIDE_WORKS,DALI_GUIDE_OBJECTS} from '../src/dali-house-copy.js';
const T={...Three,TextureLoader:class{load(){return new Three.Texture();}}},scope={};
vm.runInNewContext(readFileSync(new URL('../src/artist-quarter-layout.js',import.meta.url),'utf8'),scope);
const base=buildArtCity(T,ARTISTS);scope.layoutArtistQuarter(T,base);const art=addDaliHouse(T,base);scope.layoutArtistDali(T,art);art.group.position.set(118,.13,108);art.group.scale.setScalar(1.35);art.group.updateMatrixWorld(true);
const house=art.houses.find(h=>h.artistId==='dali'),catalog=JSON.stringify(DALI_ARTIST),objects=JSON.stringify(DALI_OBJECTS),colliders=JSON.stringify(art.colliders),anchors=JSON.stringify(art.houses.map(h=>[h.entry,h.spawnInside,h.approaches]));
const source=[];art.group.traverse(o=>source.push({o,parent:o.parent,matrix:o.matrixWorld.clone(),geometry:o.geometry,material:o.material,data:o.userData,json:JSON.stringify(o.userData),visible:o.visible}));
assert(Math.abs(118+house.cx*1.35-220)<1e-8);assert(Math.abs(108+house.cz*1.35-177)<1e-8);
const details=buildDaliDetails(T,house);art.group.updateMatrixWorld(true);
for(const s of source){assert.equal(s.o.parent,s.parent);assert(s.o.matrixWorld.equals(s.matrix));assert.equal(s.o.geometry,s.geometry);assert.equal(s.o.material,s.material);assert.equal(s.o.userData,s.data);assert.equal(JSON.stringify(s.o.userData),s.json);assert.equal(s.o.visible,s.visible);}
assert.equal(JSON.stringify(DALI_ARTIST),catalog);assert.equal(JSON.stringify(DALI_OBJECTS),objects);assert.equal(JSON.stringify(art.colliders),colliders);assert.equal(JSON.stringify(art.houses.map(h=>[h.entry,h.spawnInside,h.approaches])),anchors);
const bounds=o=>new T.Box3().setFromObject(o).applyMatrix4(house.group.matrixWorld.clone().invert()),rack=bounds(details.panel),backing=bounds(details.backing);
assert(rack.min.x>=-5.890001&&rack.max.x<=-5.67,'Rack stays inside the original wall collision margin');assert(rack.min.z>1.65&&rack.max.z<3.55,'Rack clears the original chair, egg pane and doorway');
for(const spacer of details.spacers){const b=bounds(spacer);assert(Math.abs(b.min.x+5.89)<1e-8,'Spacer meets original wall face');assert(Math.abs(b.max.x-backing.min.x)<1e-8,'Spacer meets rack backing');}
for(const card of details.cards){const b=bounds(card);assert(Math.abs(b.min.x-backing.max.x)<1e-8,'Card meets backing');assert(b.min.y>rack.min.y&&b.max.y<rack.max.y);assert(b.min.z>rack.min.z&&b.max.z<rack.max.z);}
const originalChair=source.find(s=>s.o.userData.daliObjectId==='dream-chair'&&s.geometry?.parameters?.width===1.2).o,chair=bounds(originalChair),pad=bounds(details.pad);
assert(Math.abs(pad.min.y-chair.max.y)<1e-8,'Seat cover is supported');for(const axis of['x','z']){assert(pad.min[axis]>=chair.min[axis]);assert(pad.max[axis]<=chair.max[axis]);}assert.deepEqual(details.seat.userData,originalChair.userData);
const cabinet=house.group.children.find(o=>o.geometry?.parameters?.width===.6&&o.geometry?.parameters?.height===2.65);assert(Math.abs(bounds(details.cabinetCap).min.y-bounds(cabinet).max.y)<1e-6,'Cornice meets the Float32 cabinet top');
assert(details.roofTrim.quaternion.equals(details.roof.quaternion));assert(details.roofTrim.position.equals(details.roof.position));assert.equal(details.roofTrim.children.length,4);
for(const node of details.group.children.filter(o=>o.name==='Door joint')){const b=bounds(node);assert(b.max.x<=-1.8+1e-8||b.min.x>=1.8-1e-8,'Full original entrance remains open');}
for(const p of[house.entry,house.spawnInside,...house.approaches])assert(art.canStand(p.x,p.z),'Original approaches remain walkable');
const start=house.group.localToWorld(new T.Vector3(-4.9,1.65,2.6)),aim=details.panel.getWorldPosition(new T.Vector3());assert(new T.Raycaster(start,aim.sub(start).normalize()).intersectObjects(details.targets,true).length,'Rack is physically selectable from a clear standing point');
const records=JSON.parse(readFileSync(new URL('../src/city-source-assets/home-tools/dali-house/painting-sources.json',import.meta.url),'utf8'));assert.deepEqual(DALI_ARTIST.works.map(w=>w.id),DALI_GUIDE_WORKS);assert.deepEqual(DALI_OBJECTS.map(o=>o.id),DALI_GUIDE_OBJECTS);
for(const record of records){const bytes=readFileSync(new URL('../src/city-source-assets/home-tools/dali-house/'+record.id+'.jpg',import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);}
let borrowedDisposals=0;for(const s of source)if(s.geometry)s.geometry.addEventListener('dispose',()=>borrowedDisposals++);
const resources=new Set(),counts=new Map();details.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)resources.add(o.material);});for(const r of resources)r.addEventListener('dispose',()=>counts.set(r,(counts.get(r)||0)+1));details.dispose();details.dispose();for(const r of resources)assert.equal(counts.get(r),1);assert.equal(borrowedDisposals,0);

// Exercise the real reader controller; rendering cannot consult private state.
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this.open=false;this._text='';this.className='';}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.remove();n.parent=this;this.children.push(n);}}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null;}
 replaceChildren(...nodes){for(const n of this.children)n.parent=null;this.children=[];this._text='';this.append(...nodes);}setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k]??null;}addEventListener(k,f){this.events[k]=f;}showModal(){this.open=true;}close(){const was=this.open;this.open=false;if(was)this.events.close?.();}focus(){document.activeElement=this;}get isConnected(){return!!this.parent;}
 querySelectorAll(s){return all(this).slice(1).filter(n=>s==='dialog[open]'?n.tagName==='dialog'&&n.open:s.startsWith('#')?n.id===s.slice(1):n.tagName===s);}querySelector(s){return this.querySelectorAll(s)[0];}
}
const all=n=>[n,...n.children.flatMap(all)],body=new Element('body');globalThis.document={body,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s),querySelectorAll:s=>body.querySelectorAll(s)};globalThis.window={CITY_I18N:{lang:'en'}};const events=new Map();globalThis.addEventListener=(k,f)=>events.set(k,f);globalThis.removeEventListener=(k,f)=>{if(events.get(k)===f)events.delete(k);};
let delegated=0,edition=null;const picks=[],M={mode:'city',player:{x:220,z:177},clearMovement(){},homePick:data=>picks.push(data),city:{art,targets:[art.group],region(x,z){return{id:'artists',artistId:art.insideAt((x-118)/1.35,(z-108)/1.35),inside:true,artistEditionId:edition};},targetInfo:data=>({kind:'original',data}),update(){}},showExtra(){delegated++;}};
Object.defineProperty(M,'visitorMemory',{get(){throw Error('Guide accessed private memory');}});Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw Error('Guide accessed private storage');}});
const api=installDaliGuide(M,T),dialog=body.querySelector('#dali-reading'),context=body.querySelector('#dali-reading-context');
// The installed source adapter must bring the requested original reader forward.
const app=readFileSync(new URL('../src/city-source-assets/home-tools/app.js',import.meta.url),'utf8'),pickLine=app.split('\n').find(s=>s.trim().startsWith('pick:data=>'));
assert(pickLine);const closed=[],sourceDraft='  synthetic · یادداشت\npoznámka  ',sourceReaders=new Map(['world-guide-dialog','art-city-dialog'].map(id=>[id,{value:sourceDraft,close(){closed.push(id);}}])),delegatedPicks=[];
const sourcePick=vm.runInNewContext('('+pickLine.trim().slice(5,-1)+')',{$:id=>sourceReaders.get(id),scene:{pick:data=>{delegatedPicks.push(data);return true;}}});
for(const data of[{artistId:'dali',workId:'memory'},{artistId:'dali',daliObjectId:'soft-clock'},{artistId:'monet',workId:'water-lilies'}])assert.equal(sourcePick(data),true);
assert.deepEqual(closed,['world-guide-dialog','art-city-dialog']);assert.deepEqual(delegatedPicks,[{artistId:'dali',workId:'memory'},{artistId:'dali',daliObjectId:'soft-clock'},{artistId:'monet',workId:'water-lilies'}]);for(const reader of sourceReaders.values())assert.equal(reader.value,sourceDraft);
M.city.update();assert(!context.hidden);assert.equal(M.city.targetInfo({daliGuide:true}).kind,'dali-guide');M.showExtra({kind:'dali-guide'});assert(dialog.open);dialog.close();edition='saved';M.showExtra({kind:'dali-guide'});assert(!dialog.open,'Saved editions retain their own experience');edition=null;
M.player.x=0;M.showExtra({kind:'dali-guide'});assert(!dialog.open,'Remote physical picks rejected');M.player.x=220;M.showExtra({kind:'original'});assert.equal(delegated,1);
for(const lang of['en','de','fa','cs']){
 const c=DALI_GUIDE_COPY[lang];assert.deepEqual(Object.keys(c).sort(),Object.keys(DALI_GUIDE_COPY.en).sort());window.CITY_I18N.lang=lang;events.get('city-language')();api.open();assert.equal(dialog.lang,lang);assert.equal(dialog.dir,lang==='fa'?'rtl':'ltr');assert(dialog.textContent.includes(c.boundary));assert.equal(dialog.querySelectorAll('li').length,3);assert.equal(dialog.querySelectorAll('article').length,9);
 const buttons=()=>dialog.querySelectorAll('button');for(const [i,id]of DALI_GUIDE_OBJECTS.entries()){const action=buttons().filter(b=>b.textContent===c.activity)[i];assert.equal(action.getAttribute('aria-label'),c.activity+' · '+c.objectTitles[i]);action.onclick();assert.deepEqual(picks.at(-1),{artistId:'dali',daliObjectId:id});api.open();}
 for(const [i,id]of DALI_GUIDE_WORKS.entries()){buttons().filter(b=>b.textContent===c.catalog)[i].onclick();assert.deepEqual(picks.at(-1),{artistId:'dali',workId:id});api.open();}
 for(const local of['cs','fa','en','de']){buttons().find(b=>b.dataset.daliLanguage===local).onclick();assert.equal(dialog.lang,local);assert.equal(window.CITY_I18N.lang,lang,'Companion language does not write city preference');}
 for(const link of dialog.querySelectorAll('a')){assert(link.href.startsWith('https://'));assert.equal(link.rel,'noopener noreferrer');}dialog.close();
}
api.dispose();api.dispose();assert.deepEqual(M.city.targets,[art.group]);assert(!body.querySelector('#dali-reading'));assert(!events.has('city-language'));assert.equal(JSON.stringify(DALI_ARTIST),catalog);assert.equal(JSON.stringify(DALI_OBJECTS),objects);assert.equal(JSON.stringify(art.colliders),colliders);delete globalThis.localStorage;art.dispose();
console.log('PASS Dalí: exact four painting records/bytes and five original activities retained; source-fit supported details, clear routes and rack pick; real EN/DE/FA/CS reader, nine original handoffs, RTL, private-access prohibition and owned cleanup');
