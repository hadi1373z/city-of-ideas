import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildMakersCity} from '../src/city-source-assets/home-tools/makers-city-scene.js';
import {installLearningLab} from '../src/learning-lab.js';
import {createVisitMemory} from '../src/visit-memory.js';
import {LAB_COPY} from '../src/learning-lab-copy.js';
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
const body=new Element('body');globalThis.document={body,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s)};
for(const cls of['welcome-secondary','map-directions']){const n=new Element('div');n.className=cls;body.append(n);}
const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,fn);globalThis.removeEventListener=()=>{};globalThis.matchMedia=()=>({matches:true});globalThis.window={CITY_I18N:{lang:'en'}};
const values=new Map([['private-note','Preserve me']]);globalThis.localStorage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};const store=createVisitMemory(localStorage),makers=buildMakersCity(T),t={x:225,y:.13,z:-50,scale:1};
const E={makers,transforms:{makers:t},entryFor(id,{inside=false}={}){const h=makers.houses.find(h=>'makers:'+h.id===id),p=inside?h.spawnInside:h.entry;return{x:t.x+p.x,z:t.z+p.z,y:t.y+1.65,yaw:p.yaw};},region(x,z){const h=makers.houses.find(h=>x-t.x>h.minX+.16&&x-t.x<h.maxX-.16&&z-t.z>h.minZ+.16&&z-t.z<h.maxZ-.16);return{inside:!!h,hallId:h?.id};}};
let opened,delegated=0;const M={player:{x:0,y:1.78,z:0},eye:1.65,mode:'city',clearMovement(){},arrive(p){Object.assign(this.player,p);},visitorMemory:{store,open:id=>opened=id},city:{targets:[],canStand:(x,z)=>x!==0||z!==0,targetInfo:()=>({kind:'old'}),update(){}},showExtra:()=>++delegated,startExtra:()=>++delegated};
const api=installLearningLab(M,T,E),dialog=body.querySelector('#learning-lab'),copy=LAB_COPY.en;
const button=text=>dialog.querySelectorAll('button').find(n=>n.textContent===text),click=text=>{const b=button(text);assert(b,'Button missing: '+text);b.focus();b.onclick();};
try{
 assert.equal(M.city.targets.length,1);assert(!M.city.canStand(0,0));assert.equal(M.city.targetInfo({}).kind,'old');M.showExtra({kind:'old'});M.startExtra('other');assert.equal(delegated,2);
 api.open();click(copy.start);assert(dialog.textContent.includes(copy.atLibrary));assert(!button(copy.record));api.visit(0,true);api.open();click(copy.record);assert(dialog.textContent.includes(copy.select));click('A');assert.equal(document.activeElement.textContent,'A');click('4');click(copy.record);assert.equal(api.lesson.state.first,5);assert.equal(store.state.questions[0].history[0].answer,copy.firstNote+'A, 4');assert.equal(M.city.targets.length,2);
 api.visit(1,true);api.open();click(copy.revealPlan);assert.equal(api.lesson.state.revealed,5);click(copy.conclusions[1]);assert(dialog.textContent.includes(copy.needObserve));click(copy.flip+' 7');click(copy.conclusions[0]);assert(dialog.textContent.includes(copy.wrong));click(copy.conclusions[1]);assert.equal(api.lesson.state.step,3);assert.equal(M.city.targets.length,3);
 api.visit(2,true);api.open();click(copy.parcelCards[0]);click(copy.check);assert(dialog.textContent.includes(copy.missing));click(copy.parcelCards[1]);click(copy.parcelCards[2]);click(copy.check);assert(dialog.textContent.includes(copy.extra));click(copy.parcelCards[0]);click(copy.check);assert.equal(api.lesson.state.step,4);click(copy.finish);assert(dialog.textContent.includes(copy.required));
 const input=dialog.querySelector('textarea');assert.equal(input.dataset.privateText,'');input.value='The 7 card breaks the rule; checking 4 alone reverses the implication.';input.oninput();click(copy.finish);assert(api.lesson.state.complete);assert.equal(store.state.questions[0].history.length,2);assert(store.state.questions[0].history[1].reason.includes('7 card'));click(copy.notebook);assert.equal(opened,'learning-counterexample');assert.equal(values.get('private-note'),'Preserve me');
 api.open();click(copy.again);click(copy.practiceCards[2]);click(copy.practiceCards[3]);click(copy.check);assert(dialog.textContent.includes(copy.practiceGood));
 window.CITY_I18N.lang='fa';events.get('city-language')();assert.equal(dialog.dir,'rtl');assert.equal(dialog.querySelector('summary').tabIndex,0);assert.equal(dialog.children[0].children[1].dataset.close,'');
 const b=api.model.colliders[0];assert(!M.city.canStand(t.x+(b.minX+b.maxX)/2,t.z+(b.minZ+b.maxZ)/2));
}finally{events.get('pagehide')();}
assert.equal(M.city.targets.length,0);assert.equal(makers.houses[0].group.children.some(n=>n.userData.learningLab),false);makers.dispose();
console.log('PASS learning journey UI: physical room visits, evidence feedback, shuffled transfer, first/later notebook reasoning, private text, focus retention, RTL and source-preserving cleanup');
