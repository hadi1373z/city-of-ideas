import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {installStudyHouses} from '../src/study-houses.js';
import {createVisitMemory} from '../src/visit-memory.js';
import {WORKBENCH_TEXT} from '../src/room-workbench.js';
import {STUDY_UI} from '../src/study-houses-data.js';
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.style={};this.attributes={};this.events={};this._text='';this.open=false;}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.remove();n.parent=this;this.children.push(n);}}prepend(n){n.remove();n.parent=this;this.children.unshift(n);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null;}
 replaceChildren(...nodes){for(const c of this.children)c.parent=null;this.children=[];this._text='';this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k]??null;}
 addEventListener(k,fn){this.events[k]=fn;}show(){this.open=true;}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}focus(){document.activeElement=this;}
 setSelectionRange(start,end,direction){this.selectionStart=start;this.selectionEnd=end;this.selectionDirection=direction;}
 getContext(){return new Proxy({},{get:()=>()=>{}});}
 querySelectorAll(selector){const result=[];const visit=n=>{for(const c of n.children){if(c.tagName===selector)result.push(c);visit(c);}};visit(this);return result;}
 querySelector(selector){const matches=n=>selector.startsWith('#')?n.id===selector.slice(1):selector==='dialog[open]'?n.tagName==='dialog'&&n.open:selector.startsWith('.')?n.className===selector.slice(1):n.tagName===selector;const visit=n=>{for(const c of n.children){if(matches(c))return c;const r=visit(c);if(r)return r;}};return visit(this);}
}
const body=new Element('body');globalThis.document={body,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s)};for(const cls of['welcome-secondary','map-directions']){const n=new Element('div');n.className=cls;body.append(n);}
const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,fn);globalThis.removeEventListener=()=>{};globalThis.window={CITY_I18N:{lang:'en'}};const values=new Map([['private-note','Keep exactly']]);globalThis.localStorage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
const store=createVisitMemory(localStorage),sentinel=new T.Group();let opened,delegated=0;const M={scene:new T.Scene(),player:{x:0,y:1.78,z:0},mode:'city',clearMovement(){},arrive(p){Object.assign(this.player,p);},visitorMemory:{store,open:id=>opened=id},city:{targets:[sentinel],buildingTargets:[sentinel],region:()=>({id:'city'}),targetInfo:()=>({kind:'old'}),canStand:(x,z)=>x!==0||z!==0,update(){}},startExtra:()=>++delegated,showExtra:()=>++delegated};
const api=installStudyHouses(M,T),dialog=body.querySelector('#study-houses'),copy=STUDY_UI.en;
const find=text=>dialog.querySelectorAll('button').find(n=>n.textContent===text),click=text=>{const b=find(text);assert(b,'Button missing: '+text);b.focus();b.onclick();},write=(label,value)=>{const input=dialog.querySelectorAll('textarea').find(n=>n.parent._text===label);assert(input);assert.equal(input.dataset.privateText,'');input.value=value;input.oninput();};
try{
 assert.equal(M.scene.children.length,1);assert(!M.city.canStand(0,0));assert.equal(M.city.targetInfo({}).kind,'old');M.startExtra('other');M.showExtra({kind:'other'});assert.equal(delegated,2);
 api.open('proof');assert(!find('Check my Hall obstruction'));click(copy.enter);api.open('proof');write(copy.prediction,'Equal colours might suffice.');click(copy.predict);assert.equal(store.state.questions[0].history[0].answer,'Equal colours might suffice.');
 for(const label of['Row 3, column 1, dark selectable','Row 4, column 2, dark selectable']){const b=dialog.querySelectorAll('button').find(n=>n.getAttribute('aria-label')===label);b.focus();b.onclick();assert.equal(document.activeElement.getAttribute('aria-label'),label);}
 click('Check my Hall obstruction');assert(dialog.textContent.includes('A valid certificate'));assert.equal(api.scene.houses[0].cells[8].material.color.getHex(),0xd7b857);click('A and B share one available room');assert(api.memory.get('proof').checks.includes('transfer'));write(copy.reflect,'The subset has two dark squares and one neighbour; parity alone was insufficient.');click(copy.reflect);assert.equal(store.state.questions[0].history.length,2);click(copy.notebook);assert.equal(opened,'advanced-proof');
 api.visit('uncertainty',true);api.open('uncertainty');const input=dialog.querySelector('input');input.value='15.38';input.oninput();click('Check my calculation');assert(dialog.textContent.includes('90 / (90 + 495)'));click('The same flag copied twice');click('1: it adds no new information');assert(api.memory.get('uncertainty').checks.includes('dependence'));
 api.visit('computation',true);api.open('computation');click('Load long');click('Run 16 steps');click('Check my trace evidence');assert(dialog.textContent.includes('inconclusive'));click('Load cycle');click('Run 16 steps');click('Check my trace evidence');assert(dialog.textContent.includes('future repeats forever'));click('Suppose H says halts');click('Suppose H says loops');click('No total correct decider works for every program and input');assert(api.memory.get('computation').checks.includes('diagonal'));
 // Valid certificates are accepted on every preset, and matching never destroys a conjecture.
 api.visit('proof',true);api.open('proof');click('Opposite corners removed');click('Choose light squares');
 for(const tile of dialog.querySelectorAll('button').filter(b=>b.getAttribute('aria-label')?.endsWith('light selectable')&&!b.disabled)){tile.onclick();}
 click('Check my Hall obstruction');assert(dialog.textContent.includes('|S| = 8 > |N(S)| = 6'));
 click('Show a maximum matching');assert(api.scene.houses[0].links.some(n=>n.visible));assert.equal(document.activeElement.dataset.studyFocus,'matching');
 click('Return to my selected subset');assert.equal(dialog.querySelectorAll('button').filter(b=>b.className?.includes('chosen')).length,8);assert(!api.scene.houses[0].links.some(n=>n.visible));
 click('A tileable control');click('Check my Hall obstruction');assert(dialog.textContent.includes('does not establish tileability'));
 const thought='A draft with a cursor in its middle.';write(copy.reflect,thought);let draft=dialog.querySelectorAll('textarea').find(n=>n.dataset.studyDraft==='reason-proof');draft.focus();draft.setSelectionRange(3,8,'forward');events.get('city-language')();draft=document.activeElement;assert.equal(draft.value,thought);assert.equal(draft.selectionStart,3);assert.equal(draft.selectionEnd,8);
 for(const id of['proof','uncertainty','computation']){api.visit(id,true);M.showExtra({kind:'room'});assert.equal(dialog.dataset.workbench,'true');assert(!dialog.querySelector('textarea'));const position=[M.player.x,M.player.y,M.player.z];click(WORKBENCH_TEXT.en.face);assert.deepEqual([M.player.x,M.player.y,M.player.z],position);assert(Number.isFinite(M.player.pitch));click(WORKBENCH_TEXT.en.read);assert.equal(dialog.dataset.workbench,'false');assert(dialog.querySelector('textarea'));}
 api.visit('proof',true);api.open('proof');assert.equal(dialog.querySelectorAll('textarea').find(n=>n.dataset.studyDraft==='reason-proof').value,thought);
 window.CITY_I18N.lang='fa';events.get('city-language')();assert.equal(dialog.dir,'rtl');assert(dialog.textContent.includes(STUDY_UI.fa.notice));assert.equal(dialog.querySelector('summary').tabIndex,0);assert.equal(dialog.children[0].children[1].dataset.close,'');assert.equal(values.get('private-note'),'Keep exactly');
}finally{events.get('pagehide')();}
assert.deepEqual(M.city.targets,[sentinel]);assert.deepEqual(M.city.buildingTargets,[sentinel]);assert.equal(M.scene.children.length,0);
console.log('PASS advanced house UI: actual entry gates, immutable conjectures, valid Hall certificate, Bayes/dependence feedback, bounded trace distinction, both diagonal branches, personal notebook, controller focus and RTL disclosure');
