// Walk the shared roads and entrances in the actual geometry; no private state.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {PHILOSOPHERS,quarterPaths} from '../src/philosopher-data.js';
import {createPhilosopherQuarter} from '../src/philosopher-quarter.js';
import {PLATO_POSES,platoAngle,platoCircle,platoDiagram} from '../src/plato-house-model.js';
import {PLATO_ROOM,PHILOSOPHER_UI,PLATO_SOURCE,philosopherField} from '../src/plato-house-copy.js';
import {installPhilosopherQuarter} from '../src/philosopher-ui.js';
const T={};vm.runInNewContext(await readFile(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),{exports:T,module:{exports:T},console:{...console,warn(){}}});
const context=new Proxy({},{get:()=>()=>{}}),canvas=()=>({getContext:()=>context});
let language='en';const q=createPhilosopherQuarter(T,{language:()=>language,canvas});
assert.equal(q.homes.length,6);assert.equal(new Set(q.homes.map(h=>h.id)).size,6);
const walk=(a,b)=>{const n=Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/.06);for(let i=0;i<=n;i++){const x=a.x+(b.x-a.x)*i/n,z=a.z+(b.z-a.z)*i/n;assert(q.canStand(x,z),`Blocked walking route at ${x},${z}`);assert(x>=-270&&x<=260&&z>=-500&&z<=215);}};
for(const path of quarterPaths)for(let i=1;i<path.length;i++)walk({x:path[i-1][0],z:path[i-1][1]},{x:path[i][0],z:path[i][1]});
for(const home of q.homes){
 for(const field of ['name','home','theme','intro','object','idea','reading','prompt'])assert(home[field].length===2&&home[field].every(x=>x.length>0));
 assert(new URL(home.source).protocol==='https:');
 const entry=q.entryFor('philosopher:'+home.id);assert(entry);walk({x:home.x,z:home.z+17},entry);walk(entry,home.study);
 assert(!q.canStand(home.x+10,home.z),'Side wall must block walking.');assert(!q.canStand(home.x,home.z-11),'Back wall must block walking.');assert(!q.canStand(home.x+4,home.z-6),'Desk must block walking.');
 assert.equal(q.region(home.study.x,home.study.z).philosopherId,home.id);
 assert(q.targets.some(t=>t.userData.philosopherId===home.id&&t.userData.philosopherSection==='reading'));
 for(const other of q.homes)if(home!==other)assert(home.bounds.maxX<other.bounds.minX||other.bounds.maxX<home.bounds.minX||home.bounds.maxZ<other.bounds.minZ||other.bounds.maxZ<home.bounds.minZ);
}
assert.equal(q.entryFor('unrecognised'),null);assert.equal(q.region(0,94),null);assert.equal(q.canStand(NaN,0),false);
const plato=q.homes.find(h=>h.id==='plato'),exhibit=plato.exhibit;
const originalCircle=plato.group.children.find(n=>n.geometry?.type==='TorusGeometry'&&n.position.x===-5&&n.position.y===1.9);
const originalPatch=plato.group.children.find(n=>n.position.x===-5&&n.position.y===.15&&n.position.z===-.8);
assert(originalCircle&&originalPatch);assert.equal(originalCircle.geometry.parameters.radius,1);const originalVertices=Array.from(originalCircle.geometry.attributes.position.array);
for(const pose of PLATO_POSES){
 const pts=platoCircle(pose);assert.equal(pts.length,64);assert(pts.every(p=>Math.abs(Math.hypot(p.x,p.y,p.z)-1)<1e-12),'All rotated centreline points keep unit radius');
 const width=Math.max(...pts.map(p=>p.x))-Math.min(...pts.map(p=>p.x)),height=Math.max(...pts.map(p=>p.y))-Math.min(...pts.map(p=>p.y));assert(Math.abs(width-(pose==='front'?2:1))<1e-12);assert.equal(height,2);
 assert(exhibit.setPose(pose));assert.equal(exhibit.model.rotation.y,pose==='front'?0:Math.PI/3);assert.equal(exhibit.model.scale.x,1);assert.equal(exhibit.model.scale.y,1);assert.equal(exhibit.model.scale.z,1);
 assert.deepEqual(Array.from(originalCircle.geometry.attributes.position.array),originalVertices);assert.deepEqual(Array.from(originalCircle.position.toArray()),[-5,1.9,-2]);assert.deepEqual(Array.from(originalPatch.position.toArray()),[-5,.15,-.8]);assert(platoDiagram(pose).startsWith('<svg'));
}
for(const bad of[null,undefined,'other','__proto__',60])assert.throws(()=>platoAngle(bad),RangeError);assert(!exhibit.setPose('__proto__'));assert.equal(exhibit.pose,'turned');
assert(!q.canStand(plato.x+4,plato.z-1.8));assert(!q.canStand(plato.x-5,plato.z+6));walk({x:plato.x,z:plato.z+8},{x:plato.x,z:plato.z-8});walk({x:plato.x-7,z:plato.z+4.5},{x:plato.x+7,z:plato.z+4.5});
for(const locale of['en','de','fa','cs']){language=locale;q.refreshLanguage();assert(q.region(-242,-102).title.includes(philosopherField(PHILOSOPHERS[0],'name',locale)));}
q.dispose();

// Minimal DOM fixture exercises the real installer and its private-note boundary.
class Element {
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this._text='';this.open=false;this.selectionStart=this.selectionEnd=0;}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}replaceChildren(...nodes){this.children=[];this._text='';this.append(...nodes);}
 set textContent(v){this._text=v;this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 set value(v){this._value=v;this.selectionStart=this.selectionEnd=v.length;}get value(){return this._value||'';}
 setAttribute(k,v){this.attributes[k]=v;if(k==='class')this.className=v;if(k==='id')this.id=v;}getAttribute(k){return this.attributes[k];}
 set innerHTML(markup){this.replaceChildren();const stack=[this];for(const token of markup.match(/<[^>]+>|[^<]+/g)||[]){if(token.startsWith('</'))stack.pop();else if(token.startsWith('<')){const n=new Element(token.match(/^<([\w-]+)/)[1]);for(const a of token.matchAll(/([\w-]+)="([^"]*)"/g))n.setAttribute(a[1],a[2]);stack.at(-1).append(n);stack.push(n);}else stack.at(-1)._text+=token;}}
 matches(s){if(s==='dialog[open]')return this.tagName==='dialog'&&this.open;if(s[0]==='.')return (this.className||'').split(' ').includes(s.slice(1));if(s[0]==='#')return this.id===s.slice(1);const a=s.match(/^\[data-([\w-]+)="([^"]+)"\]$/);if(a)return this.dataset[a[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]===a[2];return this.tagName===s;}
 querySelector(s){for(const n of this.children){if(n.matches(s))return n;const found=n.querySelector(s);if(found)return found;}return null;}
 addEventListener(k,fn){this.events[k]=fn;}focus(){document.activeElement=this;}setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b;}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}scrollIntoView(){}getContext(){return context;}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
}
const body=new Element('body');for(const c of['welcome-secondary','visit-actions','map-directions']){const n=new Element('div');n.className=c;body.append(n);}const mapPanel=new Element('div');mapPanel.id='map-panel';body.append(mapPanel);
globalThis.document={body,activeElement:body,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s)};globalThis.window={CITY_I18N:{lang:'en'}};const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,fn);globalThis.removeEventListener=()=>{};
const noteKey='city-of-ideas:philosopher-reflection:v1:plato',sentinel='PRIVATE TEST · یادداشت <keep> český\n  same spacing  ',storage=new Map([[noteKey,sentinel]]);let writes=0;globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>{storage.set(k,v);writes++;}};
const M={scene:new T.Scene(),mode:'city',player:{x:-242,z:-94},city:{targets:[],buildingTargets:[],landmarks:{},region:()=>null,canStand:()=>true,targetInfo:()=>null,update(){}},clearMovement(){},arrive(p){Object.assign(this.player,p);},startExtra:()=>false,showExtra:()=>false,toolsExtra:()=>false,pointToward(){},quickStart(id){return this.startExtra(id);}};
const installed=installPhilosopherQuarter(M,T),dialog=body.querySelector('#philosopher-dialog'),note=dialog.querySelector('textarea');installed.open('plato','reading');assert.equal(note.value,sentinel);
const descendants=n=>[n,...n.children.flatMap(descendants)];
for(const locale of['en','de','fa','cs']){
 window.CITY_I18N.lang=locale;note.focus();note.setSelectionRange(4,12);events.get('city-language')();assert.equal(dialog.lang,locale);assert.equal(dialog.dir,locale==='fa'?'rtl':'ltr');assert.equal(note.value,sentinel);assert.equal(note.selectionStart,4);assert.equal(note.selectionEnd,12);assert.equal(document.activeElement,note);
 const c=PLATO_ROOM[locale],controls=()=>descendants(dialog).filter(n=>n.dataset.platoFocus);assert(dialog.textContent.includes(c.title));assert(dialog.textContent.includes(PHILOSOPHER_UI[locale].source));
 for(const [i,pose]of PLATO_POSES.entries()){const b=controls()[i];b.focus();b.onclick();assert.equal(b.getAttribute('aria-pressed'),'true');assert.equal(b.getAttribute('aria-controls'),'plato-comparison-reading');assert(dialog.querySelector('#plato-comparison-reading').textContent.includes(c.readings[pose][1]));const img=descendants(dialog).find(n=>n.tagName==='img');assert(img.alt.includes(c.diagram)&&img.alt.includes(c.labels[i]));assert(img.src.startsWith('data:image/svg+xml;'));assert.equal(installed.homes[0].exhibit.pose,pose);assert.equal(note.value,sentinel);}
 events.get('city-language')();assert.equal(document.activeElement.dataset.platoFocus,'turned');assert.equal(dialog.querySelector('#plato-comparison-reading').getAttribute('aria-live'),'polite');
 const links=descendants(dialog).filter(n=>n.tagName==='a');assert(links.some(n=>n.href===PLATO_SOURCE.url&&n.rel==='noopener noreferrer'));assert.equal(dialog.querySelector('.philosopher-source').href,PHILOSOPHERS[0].source);
 M.city.update();assert(body.querySelector('#plato-house-context').hidden);dialog.close();M.city.update();assert(!body.querySelector('#plato-house-context').hidden);body.querySelector('#plato-house-context').children[0].onclick();assert(dialog.open);assert.equal(installed.homes[0].exhibit.pose,'turned');assert.equal(note.value,sentinel);
}
dialog.close();M.player.x=0;M.player.z=94;M.city.update();assert(body.querySelector('#plato-house-context').hidden,'The reading action stays within Plato’s house');M.player.x=-242;M.player.z=-94;M.mode='aerial';M.city.update();assert(body.querySelector('#plato-house-context').hidden);M.mode='city';
assert.equal(writes,0,'Language, pose and reopen do not write private notes');assert.equal(storage.get(noteKey),sentinel);installed.open('aristotle');assert(dialog.querySelector('.plato-details').hidden);installed.open('plato');assert.equal(note.value,sentinel);
note.value=sentinel+'edited';note.events.input();assert.equal(storage.get(noteKey),sentinel+'edited');assert.equal(writes,1);installed.open('aristotle');installed.open('plato');assert.equal(note.value,sentinel+'edited','The existing per-house note interaction still works');events.get('pagehide')();
console.log('PASS: six original philosopher homes and Plato’s four-language turning circle, exact original circle/patch, routes, projections, note/caret preservation and owned cleanup.');
