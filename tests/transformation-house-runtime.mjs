import assert from 'node:assert/strict';import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';import {installTransformationHouse} from '../src/transformation-house.js';
const context=new Proxy({measureText:t=>({width:t.length*10})},{get:(o,k)=>o[k]??(()=>{})});
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this.open=false;this.hidden=false;this.style={};this._text='';}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}
 replaceChildren(...nodes){this.children=[];this._text='';this.append(...nodes);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
 setAttribute(k,v){this.attributes[k]=String(v);}addEventListener(k,fn){this.events[k]=fn;}
 showModal(){this.open=true;}close(){const was=this.open;this.open=false;if(was)this.events.close?.();}
 focus(){document.activeElement=this;}getContext(){return context;}
 matches(s){
  if(s==='dialog[open]')return this.tagName==='dialog'&&this.open;
  const visible=s.match(/^#([^:]+):not\(\[hidden\]\)$/);if(visible)return this.id===visible[1]&&!this.hidden;
  if(s.startsWith('#'))return this.id===s.slice(1);if(s.startsWith('.'))return this.className===s.slice(1);
  return this.tagName===s;
 }
 querySelectorAll(selector){const list=[],selectors=selector.split(',').map(s=>s.trim());const visit=n=>{for(const c of n.children){if(selectors.some(s=>c.matches(s)))list.push(c);visit(c);}};visit(this);return list;}
 querySelector(s){return this.querySelectorAll(s)[0]??null;}
}
const body=new Element('body'),reader=new Element('aside');reader.id='reader-panel';reader.hidden=true;body.append(reader);
globalThis.document={body,hidden:false,activeElement:null,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s)};
globalThis.window={};
const events=new Map();globalThis.addEventListener=(name,fn)=>events.set(name,fn);globalThis.removeEventListener=()=>{};
let privateAccess=0;const privateStore=new Proxy({},{get(){privateAccess++;throw Error('The museum must not access saved private data');}});
globalThis.localStorage=privateStore;window.localStorage=privateStore;globalThis.sessionStorage=privateStore;window.sessionStorage=privateStore;
const M={scene:new T.Scene(),eye:1.8,mode:'city',player:{x:125,z:22,y:1.93,yaw:0,pitch:0},clearMovement(){},setCityMode(){this.mode='city';},cityGroundHeight(){return .13;},arrive(p){Object.assign(this.player,p,{y:p.y+this.eye});},pointToward(){},city:{targets:[],update(){},canStand:()=>true,region:()=>({id:'city'}),targetInfo:()=>null},startExtra:()=>false,showExtra:()=>false};const api=installTransformationHouse(M,T);assert(api.step(.1,{forward:1}));assert(api.active);assert(M.player.z<22);const before={...M.player};assert(api.openRoom());assert(api.step(.1,{forward:1}));assert.deepEqual(M.player,before,'Reading pauses movement');body.querySelector('#transformation-house-room').close();M.arrive({x:125,z:22,y:0,yaw:Math.PI});assert(!api.active);api.step(.1,{});for(let i=0;i<15&&api.active;i++)api.step(.1,{forward:1});assert(!api.active,'A held forward input can leave the front door');assert(M.player.z>23.25);let handed=null;M.worldCylinder={route:null,enterFromHouse(p){handed=p;}};api.enterFromPassage({x:71.4,z:0,y:-40,yaw:Math.PI/2});api.step(.1,{forward:1});assert(handed);assert(!api.active);assert(handed.x<71.1);api.enterFromPassage({x:125,z:12,y:-16,yaw:Math.PI});assert(api.openRoom());const d=body.querySelector('#transformation-house-room'),handle=d.querySelectorAll('button').find(n=>n.textContent==='Try the brass handle');assert(handle);handle.onclick();assert(api.shelfOpen);assert(!d.open);assert.equal(privateAccess,0);events.get('pagehide')();console.log('PASS house runtime: real doorway capture and exit, paused reading, west tunnel handoff, functional bookcase, no private access and owned cleanup.');
