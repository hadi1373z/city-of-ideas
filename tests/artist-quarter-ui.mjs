import assert from 'node:assert/strict';
import * as Three from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {installArtistQuarter} from '../src/artist-quarter.js';
import {createVisitMemory} from '../src/visit-memory.js';
import {QUARTER_COPY} from '../src/artist-quarter-data.js';
import {IDEA_EXHIBITIONS,IDEA_EXHIBITION_COPY} from '../src/idea-exhibitions.js';
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.style={};this.attributes={};this.events={};this._text='';this.open=false;}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.remove();n.parent=this;this.children.push(n);}}prepend(n){n.remove();n.parent=this;this.children.unshift(n);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null;}
 replaceChildren(...nodes){for(const c of this.children)c.parent=null;this.children=[];this._text='';this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k]??null;}
 addEventListener(k,fn){this.events[k]=fn;}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}focus(){document.activeElement=this;}
 getContext(){return new Proxy({},{get:()=>()=>{}});}
 querySelector(selector){const matches=n=>selector.startsWith('#')?n.id===selector.slice(1):selector==='dialog[open]'?n.tagName==='dialog'&&n.open:selector.startsWith('.')?n.className===selector.slice(1):n.tagName===selector;const visit=n=>{for(const c of n.children){if(matches(c))return c;const r=visit(c);if(r)return r;}};return visit(this);}
}
const body=new Element('body');globalThis.document={body,createElement:tag=>new Element(tag),querySelector:s=>body.querySelector(s)};
for(const cls of['welcome-secondary','map-directions']){const n=new Element('div');n.className=cls;body.append(n);}
globalThis.window={CITY_I18N:{lang:'en'},CITY_ESCHER:{entry:{x:151.75,z:116.4,y:.13,yaw:0}}};const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,fn);globalThis.removeEventListener=()=>{};
const T={...Three,TextureLoader:class{load(){return new Three.Texture();}}},values=new Map([['private-note','Keep exactly']]),store=createVisitMemory({getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)});
let opened,delegated=0;const M={scene:new T.Scene(),player:{x:0,z:0},eye:1.65,mode:'city',clearMovement(){},arrive(p){Object.assign(this.player,p);},visitorMemory:{store,open:id=>opened=id},city:{ART:{x:118,z:108,scale:1.35},art:{houses:[{artistId:'monet',name:'Claude Monet',entry:{x:-23,z:-8.3,yaw:0}}]},targets:[],buildingTargets:[],canStand:(x,z)=>x!==0||z!==0,region:()=>({id:'city'}),targetInfo:()=>({kind:'old'}),update(){}},showExtra:()=>++delegated,startExtra:()=>++delegated};
const api=installArtistQuarter(M,T),dialog=body.querySelector('#artist-quarter'),copy=QUARTER_COPY.en;
const findButton=text=>{const scan=n=>{if(n.tagName==='button'&&n.textContent===text)return n;for(const c of n.children){const b=scan(c);if(b)return b;}};return scan(dialog);};
try{
 assert.equal(M.city.canStand(0,0),false,'Prior collision restrictions remain');assert.equal(M.city.targetInfo({}).kind,'old');M.showExtra({kind:'other'});assert.equal(delegated,1);M.startExtra('other');assert.equal(delegated,2);
 assert.equal(api.reflect('cezanne'),false,'Cannot collect a question remotely');api.open('cezanne');assert(dialog.open);assert(!findButton(copy.reflect));findButton(copy.enter).onclick();assert(!dialog.open);assert.equal(M.city.region(M.player.x,M.player.z).artistId,'cezanne');
 api.open('cezanne');findButton(copy.reflect).onclick();assert.equal(store.state.questions.length,1);findButton(copy.reflect).onclick();assert.equal(store.state.questions.length,1,'Revisits reuse the same question');findButton(copy.note).onclick();assert.equal(opened,'studio-cezanne');assert.equal(values.get('private-note'),'Keep exactly');
 const h=api.studios.houses[0],before=h.study.rotation.y;M.showExtra({kind:'artist-quarter',data:{quarterArtist:'cezanne',quarterAction:'activity'}});assert.notEqual(h.study.rotation.y,before);Object.assign(M.player,{x:0,z:0});const changed=h.study.rotation.y;M.showExtra({kind:'artist-quarter',data:{quarterArtist:'cezanne',quarterAction:'activity'}});assert.equal(h.study.rotation.y,changed,'Physical exercises require entering the studio');
 const p=api.entry('monet');assert.equal(p.x,118-23*1.35);assert.equal(p.z,108-8.3*1.35);assert.equal(api.entry('escher').x,151.75);assert.equal(api.entry('missing'),null);
 const ideaDialog=body.querySelector('#idea-exhibitions');
 assert(ideaDialog,'Dedicated thematic exhibition UI should exist');
 assert.deepEqual(IDEA_EXHIBITIONS.map(item=>item.id),['philosophy','time','perception','representation']);
 M.startExtra('ideas-gallery');assert(ideaDialog.open);assert(ideaDialog.textContent.includes('Giorgio de Chirico'));
 assert(ideaDialog.textContent.includes('The Persistence of Memory'));
 assert.equal(M.city.targetInfo({deChirico:true}).kind,'idea-art');
 M.showExtra({kind:'idea-art',data:{deChirico:true}});assert(ideaDialog.open);
 const findIdeaButton=text=>{const scan=n=>{if(n.tagName==='button'&&n.textContent===text)return n;for(const x of n.children){const result=scan(x);if(result)return result;}};return scan(ideaDialog);};
 findIdeaButton(IDEA_EXHIBITION_COPY.en.save).onclick();
 assert.equal(store.state.questions.length,2,'Theme reflection should enter existing private notebook');
 assert.equal(values.get('private-note'),'Keep exactly');
 M.startExtra('idea:philosophy');assert(!ideaDialog.open);assert.equal(M.player.x,226);assert.equal(M.player.z,191);
 M.startExtra('idea:perception');assert.equal(M.player.x,182);
 window.CITY_I18N.lang='fa';events.get('city-language')();
 M.startExtra('ideas-gallery');assert.equal(ideaDialog.dir,'rtl');
 assert(ideaDialog.textContent.includes(IDEA_EXHIBITION_COPY.fa.visit));ideaDialog.close();
 api.open('morisot');assert.equal(dialog.dir,'rtl');assert(dialog.textContent.includes(QUARTER_COPY.fa.enter));
 const details=dialog.querySelector('summary');assert.equal(details.tabIndex,0,'Credits reachable through controller focus');assert.equal(dialog.children[0].children[1].getAttribute('data-close'),'','Escape and controller Back can find the close control');
}finally{events.get('pagehide')();}
assert.equal(M.city.targets.length,0);assert.equal(M.city.buildingTargets.length,0);assert.equal(M.scene.children.length,0);
console.log('PASS artists’ quarter controls: physical entry gates, live study changes, original destinations, independent notebook questions, private-note preservation, controller focus, Persian direction and owned cleanup');
