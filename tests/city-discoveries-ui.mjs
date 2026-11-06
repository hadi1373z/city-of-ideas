import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {installCityDiscoveries} from '../src/city-discoveries.js';
import {createVisitMemory} from '../src/visit-memory.js';
import {buildNativeRamseyHouse} from '../src/ramsey-native-house.js';
import {DISCOVERY_COPY} from '../src/city-discoveries-copy.js';
// Minimal DOM fixture for the controller's public buttons and modal lifecycle.
// Browser rendering and walking are checked separately in the actual city.
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.attributes={};this.dataset={};this.style={};this.events={};this.open=false;this._text='';this.className='';this.disabled=false;this.classList={add:v=>this.className+=' '+v,contains:v=>this.className.split(' ').includes(v)};}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
 append(...nodes){for(const n of nodes){n.remove();n.parent=this;this.children.push(n);}}prepend(n){n.remove();n.parent=this;this.children.unshift(n);}
 after(n){n.remove();n.parent=this.parent;this.parent.children.splice(this.parent.children.indexOf(this)+1,0,n);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null;}
 replaceChildren(...nodes){for(const n of this.children)n.parent=null;this.children=[];this._text='';this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k]??null;}removeAttribute(k){delete this.attributes[k];}
 cloneNode(){const n=new Element(this.tagName);n.attributes={...this.attributes};return n;}
 addEventListener(k,fn){this.events[k]=fn;}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}focus(){document.activeElement=this;}
 matches(selector){
  if(selector.includes(':not([disabled])')&&this.disabled)return false;selector=selector.replace(':not([disabled])','');
  const attr=selector.match(/\[([^=\]]+)(?:="([^"]*)")?\]/);if(attr){const k=attr[1],value=k==='open'?this.open:k.startsWith('data-')?this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]:this.attributes[k];if(attr[2]!==undefined?String(value)!==attr[2]:!value)return false;selector=selector.replace(attr[0],'');}
  if(selector.startsWith('#'))return this.id===selector.slice(1);const [tag,cls]=selector.split('.');return(!tag||this.tagName===tag)&&(!cls||this.className.split(' ').includes(cls));
 }
 querySelector(selector){const parts=selector.split(' '),all=[];const visit=n=>{for(const c of n.children){all.push(c);visit(c);}};visit(this);for(const n of all){if(!n.matches(parts.at(-1)))continue;if(parts.length===1)return n;for(let p=n.parent;p;p=p.parent)if(p.matches(parts.slice(0,-1).join(' ')))return n;}return null;}
}
const body=new Element('body');globalThis.document={body,activeElement:null,hidden:false,createElement:tag=>new Element(tag),createElementNS:(_,tag)=>new Element(tag),querySelector:s=>body.querySelector(s)};
const section=(tag,cls,id,parent=body)=>{const n=new Element(tag);n.className=cls||'';n.id=id;parent.append(n);return n;};
section('div','visit-actions');const welcome=section('section','','welcome');section('button','','enter',welcome);section('div','welcome-secondary','',welcome);section('div','map-directions');section('div','','map-panel');const conversation=section('section','','ramsey-conversation');section('div','','',conversation);section('dialog','','visit-notebook');
const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,fn);globalThis.removeEventListener=()=>{};globalThis.matchMedia=()=>({matches:true});
const values=new Map([['private-note','untouched']]);globalThis.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
const memory=createVisitMemory(localStorage),origin={x:-2401,y:.13,z:35},house=buildNativeRamseyHouse(T,origin),player={x:0,z:0,y:1.93};
let paused=0,destination=null,noteOpened=null;
const M={player,mode:'city',scene:new T.Scene(),city:{PARK:{x:0,z:-330,scale:.65},targets:[],targetInfo:()=>({kind:'previous'}),update(){}},clearMovement(){},arrive:p=>Object.assign(player,p),quickStart:d=>destination=d,status(){},showExtra:()=>99,questionWalk:{state:{active:false},open(){}},homeBridge:{focusRoom(){}},visitorMemory:{store:memory,discover:id=>memory.discover(id),open:id=>noteOpened=id},ramseyRoom:{house,pause(){paused++;},visit:()=>Object.assign(player,house.entry)}};
const escher={group:new T.Group(),entry:{x:150,z:116.4},passageOpen:false};globalThis.window={CITY_I18N:{lang:'en'},CITY_ESCHER:escher,CITY_GRAVEYARD:{returnEntry:{x:-2345,z:0,y:.13,yaw:-Math.PI/2}}};
const api=installCityDiscoveries(M,T),dialog=document.querySelector('#city-discoveries'),t=DISCOVERY_COPY.en;
const button=(text)=>{const scan=n=>{if(n.tagName==='button'&&n.textContent===text)return n;for(const c of n.children){const found=scan(c);if(found)return found;}};const n=scan(dialog);assert(n,'Missing button: '+text);return n;};
const click=text=>{const b=button(text);assert(!b.disabled);b.onclick();};
try{
 M.city.update(player,1,'city');assert(!M.city.targets.includes(api.boats.group),'Unreleased boats must not steal interactions invisibly');assert(!M.city.targets.includes(api.clue.group),'A sealed clue is not an interaction target');
 assert.equal(document.querySelector('#city-discoveries-welcome').parent,welcome,'Welcome entry must stay outside the collapsed places menu');
 api.open();assert(dialog.open);click(t.begin);assert(api.trial.state.active);
 dialog.close();M.showExtra({kind:'sixth-guest-clue'});assert(!dialog.open,'Cannot read a hidden clue from another place');
 Object.assign(player,{x:150,z:98});M.showExtra({kind:'sixth-guest-clue'});assert(!dialog.open,'Closed passage must keep its clue inaccessible');
 escher.passageOpen=true;M.showExtra({kind:'sixth-guest-clue'});click(t.readClue);assert(api.trial.state.clue);assert(memory.has('sixth-guest-sketch'));
 click(t.visitRamsey);assert.equal(destination,'graveyard-door');assert(player.x>-1000,'A guide must lead to the world door, not bypass it');
 Object.assign(player,{x:origin.x-2.5,z:origin.z+1});document.querySelector('#ramsey-trial-open').onclick();assert(paused>0);assert(api.paper.group.visible);assert(!house.study.acquaintanceMap.group.visible);
 click(t.useClue);click(t.predict[0]);assert.equal(api.trial.state.count,6);assert.equal(memory.state.questions[0].history[0].answer,t.predict[0]);
 dialog.querySelector('[data-point="1"]').onclick();for(const i of[3,5])dialog.querySelector('[data-trial="point-'+i+'"]').onclick();click(t.check);assert(api.trial.state.witness);assert(memory.has('sixth-guest-witness'));
 click(t.visitPark);assert.equal(player.x,window.CITY_GRAVEYARD.returnEntry.x,'Leave the separate world through its return door');
 Object.assign(player,{x:0,z:0});api.open('route');click(t.visitPark);assert(api.context().fountain);assert(player.pitch<0,'Look down toward boats, rather than up toward the crane flight');api.open('route');click(t.answers[1]);click(t.release);assert(api.trial.state.complete);
 const history=memory.state.questions.find(q=>q.id==='sixth-guest').history;assert.equal(history.length,2);assert.equal(history[0].answer,t.predict[0]);assert.equal(history[1].answer,t.answers[1]);assert(history[1].reason.length>10);
 M.city.update(player,3,'city');assert(api.boats.group.visible);assert(M.city.targets.includes(api.boats.group));dialog.close();assert(house.study.acquaintanceMap.group.visible);
 api.open('route');click(t.notebook);assert.equal(noteOpened,'sixth-guest');assert.equal(values.get('private-note'),'untouched');
 window.CITY_I18N.lang='fa';events.get('city-language')();api.open();assert.equal(dialog.dir,'rtl');assert(dialog.textContent.includes(DISCOVERY_COPY.fa.sixth));
 assert.equal(M.showExtra({kind:'unrelated'}),99);assert.equal(M.city.targetInfo({}).kind,'previous');
}finally{events.get('pagehide')?.();house.dispose();}
assert.equal(M.city.targets.length,0);assert.equal(api.boats.group.children.length,0);assert.equal(api.clue.group.children.length,0);
console.log('PASS live controller buttons: hidden-clue and world-door gates, table/audio separation, prediction/evidence/reflection, notebook history, private storage, FA direction and owned teardown');
