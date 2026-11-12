import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {installOrigamiHouse} from '../src/origami-house.js';
import {createVisitMemory} from '../src/visit-memory.js';
import {FOLD_COPY} from '../src/origami-house-copy.js';
import {COAST_EXPLORER_COPY,COAST_LANDMARKS} from '../src/coastal-map-data.js';
import {SHORE} from '../src/island-layout.js';
import {FOUNDATION_HOUSES} from '../src/foundation-houses-data.js';
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.style={};this.attributes={};this.events={};this._text='';this.open=false;}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.remove();n.parent=this;this.children.push(n);}}prepend(n){n.remove();n.parent=this;this.children.unshift(n);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null;}
 replaceChildren(...nodes){for(const c of this.children)c.parent=null;this.children=[];this._text='';this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k]??null;}
 addEventListener(k,fn){this.events[k]=fn;}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}focus(){document.activeElement=this;}
 getContext(){return new Proxy({},{get:()=>()=>{}});}
 querySelectorAll(selector){const result=[];const visit=n=>{for(const c of n.children){if(c.tagName===selector)result.push(c);visit(c);}};visit(this);return result;}
 querySelector(selector){const matches=n=>selector.startsWith('#')?n.id===selector.slice(1):selector==='dialog[open]'?n.tagName==='dialog'&&n.open:selector.startsWith('.')?n.className===selector.slice(1):n.tagName===selector;const visit=n=>{for(const c of n.children){if(matches(c))return c;const r=visit(c);if(r)return r;}};return visit(this);}
}
const body=new Element('body');globalThis.document={body,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s),getElementById:id=>body.querySelector('#'+id)};for(const cls of['welcome-secondary','map-directions']){const n=new Element('div');n.className=cls;body.append(n);}const overview=new Element('button');overview.id='overview';let nativeOverview=0;overview.onclick=()=>++nativeOverview;body.append(overview);const prior=new Element('aside');prior.id='artist-quarter-context';body.append(prior);
const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,fn);globalThis.removeEventListener=()=>{};globalThis.matchMedia=()=>({matches:true});let craneOpened;globalThis.window={CITY_I18N:{lang:'en'},CITY_ORIGAMI:{open:id=>craneOpened=id}};const values=new Map([['private-note','Preserve this thought']]);globalThis.localStorage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};const store=createVisitMemory(localStorage),sentinel=new T.Group();let delegated=0,opened;const travels=[],extraTravels=[];const M={scene:new T.Scene(),eye:1.65,mode:'city',player:{x:0,y:1.78,z:0},clearMovement(){},arrive(p){Object.assign(this.player,p);},quickStart:id=>{travels.push(id);return ++delegated;},visitorMemory:{store,open:id=>opened=id},city:{targets:[sentinel],buildingTargets:[sentinel],region:()=>({id:'city'}),targetInfo:()=>({kind:'old'}),canStand:(x,z)=>x!==0||z!==0,update(){}},showExtra:()=>++delegated,startExtra:id=>{extraTravels.push(id);return ++delegated;}};const api=installOrigamiHouse(M,T),dialog=body.querySelector('#origami-house'),map=body.querySelector('#coastal-city-map'),w=FOLD_COPY.en;
const find=(text,parent=dialog)=>parent.querySelectorAll('button').find(b=>b.textContent===text),click=(text,parent=dialog)=>{const b=find(text,parent);assert(b,'Button missing '+text);b.focus();b.onclick();};
try{
 assert(!M.city.canStand(0,0));assert(!M.city.canStand(571,0));assert(M.city.canStand(300,76));assert.equal(M.city.targetInfo({}).kind,'old');M.showExtra({kind:'other'});M.startExtra('other');assert.equal(delegated,2);api.open('miura');assert(dialog.textContent.includes(w.inside));assert(!find(w.flat));api.visit('inside');api.open('miura');click(w.flat);assert.equal(api.memory.state.fold,0);assert.equal(document.activeElement.textContent,w.flat);click(w.deep);M.city.update(M.player,1,'city');assert.equal(api.memory.state.miuraSeen,3);assert(prior.hidden);
 click(w.crease);click(w.cases[1]);assert(dialog.textContent.includes(w.fail));click(w.cases[0]);click(w.answers[0]);assert(dialog.textContent.includes(w.incorrect));click(w.answers[1]);assert(api.memory.state.creaseUnderstood);const first=api.memory.state.mountains[0];M.showExtra({kind:'origami-house',data:{origamiHouse:'crease',creaseIndex:0}});assert.notEqual(api.memory.state.mountains[0],first);
 click(w.boat);for(let i=0;i<8;i++)click(w.next);click(w.finish);assert(api.memory.state.boatDone);assert.equal(dialog.querySelectorAll('img').length,2);assert(dialog.querySelector('img').src.startsWith('data:image/svg+xml'));click(w.shore);assert(!find(w.launch));api.visit('shore');api.open('shore');click(w.launch);assert(api.memory.state.launched);M.city.update(M.player,2,'city');assert(api.house.released.group.visible);assert.equal(M.city.region(M.player.x,M.player.z).id,'coast');
 const input=dialog.querySelector('textarea');input.value='A fold turns a geometric constraint into a motion.';input.oninput();assert.equal(input.dataset.privateText,'');click(w.save);assert.equal(store.state.questions[0].history[0].answer,input.value);click(w.notebook);assert.equal(opened,'house-origami');assert.equal(values.get('private-note'),'Preserve this thought');
 overview.onclick();assert.equal(nativeOverview,1);assert(map.open);assert.equal(map.querySelector('img').src.endsWith('city-coast-en.svg'),true);assert(find(w.open,map));
 const mapControl=key=>map.querySelectorAll('button').find(n=>n.dataset.coastFocus===key);
 const selectMap=key=>{const n=mapControl(key);assert(n,key);n.focus();n.onclick();};
 const beforeMap=new Map(values),beforeTravel=travels.length;
 for(const language of['en','de','fa']){
  window.CITY_I18N.lang=language;events.get('city-language')();const c=COAST_EXPLORER_COPY[language];
  assert.equal(map.dir,language==='fa'?'rtl':'ltr');assert.equal(map.lang,language);
  assert(map.querySelector('img').src.endsWith('city-coast-'+language+'.svg'));
  for(const p of COAST_LANDMARKS){
   selectMap('marker-'+p.id);assert.equal(map.querySelector('#coastal-location-name').textContent,c.landmarks[p.id].name);
   assert.equal(mapControl('place-'+p.id).getAttribute('aria-pressed'),'true');
   assert.equal(map.querySelectorAll('button').filter(n=>n.dataset.landmark&&n.getAttribute('aria-pressed')==='true').length,2);
   selectMap('place-'+p.id);assert.equal(mapControl('marker-'+p.id).getAttribute('aria-pressed'),'true');
  }
  assert.equal(map.querySelector('#coastal-location-info').getAttribute('aria-live'),'polite');
  assert.equal(travels.length,beforeTravel,'Selection does not travel');
  selectMap('route');const routeState=mapControl('route').getAttribute('aria-pressed');
  assert.equal(map.querySelector('#coastal-route-guide').hidden,routeState==='false');
  assert.equal(map.querySelectorAll('img')[1].hidden,routeState==='false');
  events.get('city-language')();assert.equal(mapControl('route').getAttribute('aria-pressed'),routeState);
  assert.equal(document.activeElement.dataset.coastFocus,'route','Locale refresh preserves focus');
 }

 const previousPosition={...M.player};Object.assign(M.player,{x:100,z:50,yaw:Math.PI/2});api.openMap();
 let visitorMark=map.querySelector('#coastal-visitor-position');assert(visitorMark);assert.equal(visitorMark.style.left,(460+100*.7)/920*100+'%');assert.equal(visitorMark.style.top,(460+50*.7)/920*100+'%');assert(visitorMark.style.transform.includes('rotate(-90deg)'));
 selectMap('place-gallery');const originalLeft=visitorMark.style.left;selectMap('place-park');assert.equal(visitorMark.style.left,originalLeft,'Selecting a destination must not move the visitor marker');assert(map.querySelector('#coastal-position-distance').textContent);assert.equal(M.player.x,100,'Opening the map must not travel');
 M.player.x=-24000;api.openMap();assert.equal(map.querySelector('#coastal-visitor-position'),undefined);assert.equal(map.querySelector('#coastal-position-distance').hidden,true);
 Object.assign(M.player,previousPosition);
assert.deepEqual(values,beforeMap,'Map selection and route visibility do not write storage');
 for(const id of['noether','mirzakhani','cage']){api.openMap();selectMap('place-'+id);selectMap('visit');assert.equal(extraTravels.at(-1),'seminar:'+id);assert(!map.open);}
 for(const id of['gallery','park','socrates','artists','shore']){
  api.openMap();selectMap('place-'+id);selectMap('visit');assert(!map.open,'Visit closes the map');
  if(id==='shore'){assert.equal(M.player.x,SHORE.x);assert.equal(M.player.z,76);}
  else assert.equal(travels.at(-1),id==='artists'?'artists-quarter':id);
 }
 M.babelLibrary={copy:()=>({visit:'Babel library route'})};M.oceanSailing={copy:()=>({visit:'Origami ocean route'})};for(const[label,id]of[['Babel library route','babel'],['Origami ocean route','ocean']]){api.openMap();click(label,map);assert(!map.open);assert.equal(extraTravels.at(-1),id,'Merged map preserves new destinations');}for(const h of FOUNDATION_HOUSES){api.openMap();click(h.names.fa,map);assert.equal(extraTravels.at(-1),'house:'+h.id);}assert.deepEqual(values,beforeMap,'Merged destination routes preserve private storage');
 api.openMap();click(FOLD_COPY.fa.city3d,map);assert(!map.open);assert.equal(body.dataset.coastalOverview,'clear');body.querySelector('#coastal-map-return').onclick();assert(map.open);assert.equal(body.dataset.coastalOverview,undefined);
 api.open('crease');assert.equal(dialog.dir,'rtl');assert.equal(dialog.querySelector('summary').tabIndex,0);assert.equal(dialog.children[0].children[1].dataset.close,'');
 api.visit('inside');api.open();click(FOLD_COPY.fa.crane);assert.equal(craneOpened,'crane');
}finally{events.get('pagehide')();}
assert.deepEqual(M.city.targets,[sentinel]);assert.deepEqual(M.city.buildingTargets,[sentinel]);assert.equal(M.scene.children.length,0);overview.onclick();assert.equal(nativeOverview,2);
console.log('PASS origami house UI: real entry guards, rigid-fold controls, theorem feedback, physical crease picks, complete boat route, shore-only launch, private notebook, centred-map destinations, prior overview preservation, RTL and owned teardown');
