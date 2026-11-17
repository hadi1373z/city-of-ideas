import assert from 'node:assert/strict';import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';import {installTransformationHouse} from '../src/transformation-house.js';
import {HOUSE as H,HOUSE_LEVELS,houseRoomAt,houseInteractionAt,houseBlocked,stairPoint,walkHouse} from '../src/transformation-house-model.js';
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
const M={scene:new T.Scene(),eye:1.8,mode:'city',player:{x:125,z:22,y:1.93,yaw:0,pitch:0},clearMovement(){},setCityMode(){this.mode='city';},cityGroundHeight(){return .13;},arrive(p){Object.assign(this.player,p,{y:p.y+this.eye});},pointToward(){},city:{targets:[],update(){},canStand:()=>true,region:()=>({id:'city'}),targetInfo:()=>null},startExtra:()=>false,showExtra:()=>false};
const api=installTransformationHouse(M,T),d=body.querySelector('#transformation-house-room'),guide=body.querySelector('#transformation-house-guide');
const action=text=>d.querySelectorAll('button').find(n=>n.textContent===text);
const arrive=p=>{api.enterFromPassage(p);M.city.update(.1,1);};
assert(api.step(.1,{forward:1}));assert(api.active);assert(M.player.z<22);
const summary=guide.querySelector('summary'),dismiss=new Element('button');dismiss.textContent='×';summary.append(dismiss);for(let i=0;i<5;i++)M.city.update(.1,i);assert(summary.children.includes(dismiss),'Frame updates must retain the notification close button instead of recreating it');
const before={...M.player};assert(api.openRoom());assert(api.step(.1,{forward:1}));assert.deepEqual(M.player,before,'Reading pauses movement');d.close();
M.arrive({x:125,z:22,y:0,yaw:Math.PI});assert(!api.active);api.step(.1,{});for(let i=0;i<15&&api.active;i++)api.step(.1,{forward:1});assert(!api.active,'A held forward input can leave the front door');assert(M.player.z>23.25);
const edge=3*H.stepAngle-.003,stairStart=stairPoint(edge);api.enterFromPassage({...stairStart,yaw:Math.PI-edge});const previousEye=M.player.y;api.step(.016,{forward:1});assert(M.player.y<previousEye-.1,'Physics follows the real next tread immediately');assert(api.cameraY>M.player.y&&api.cameraY<previousEye,'Only the camera eases the small step instead of jolting');for(let i=0;i<12;i++)api.step(.1,{});assert(Math.abs(api.cameraY-M.player.y)<1e-6,'The camera settles exactly on the supported pose');
let handed=null;M.worldCylinder={route:null,enterFromHouse(p){handed=p;}};arrive({x:71.4,z:0,y:-40,yaw:Math.PI/2});api.step(.1,{forward:1});assert(handed);assert(!api.active);assert(handed.x<71.1);

// Every flight remains a stair even just before it reaches another floor's Y.
for(let turn=0;turn<7;turn++)for(const offset of[.05,Math.PI,2*Math.PI-.05]){
 const p=stairPoint(turn*2*Math.PI+offset);assert.equal(houseRoomAt(p.x,p.z,p.y,p.theta),null);
 assert.equal(houseInteractionAt(p.x,p.z,p.y,{lastTheta:p.theta}),null);
 arrive(p);assert.equal(M.city.region(p.x,p.z).title,'The winding stair');
 assert(guide.textContent.includes('Follow the handrail'));
 assert(guide.querySelectorAll('button').find(n=>n.textContent.includes('Reach a room')).disabled);
 assert.equal(api.openRoom(),false,'Room reading requires a real landing');
 assert.equal(api.interact(),true,'The house consumes E/A without activating unrelated exhibits');assert(!d.open);
}
for(const l of HOUSE_LEVELS){assert.equal(houseRoomAt(134.72,0,l.y)?.y,l.y,'The shared radial landing belongs to its real room');assert.equal(houseRoomAt(139,0,l.y)?.y,l.y);}

arrive({x:137,z:0,y:-16,yaw:0});assert(api.openRoom());assert(!action('Try the brass handle'),'A room-wide clue cannot remotely operate the shelf');assert(d.textContent.includes('Walk up to'));d.close();
const target=api.built.targets.find(n=>n.userData.houseSecret);assert(target);assert.equal(M.city.targetInfo(target.userData),null);assert.equal(M.showExtra({kind:'house-secret'}),false);
arrive({x:125.9,z:12.3,y:-16,yaw:Math.PI});assert.equal(houseInteractionAt(125.9,12.3,-16),'shelf');assert(M.city.targetInfo(target.userData));assert(api.openRoom());
const handle=action('Try the brass handle');assert(handle);
// An old dialog action also rechecks the physical distance before acting.
M.player.x=137;M.player.z=0;handle.onclick();assert(!api.shelfOpen);assert(d.open);d.close();
arrive({x:125.9,z:12.3,y:-16,yaw:Math.PI});assert(api.openRoom());action('Try the brass handle').onclick();assert(api.shelfOpen);assert(!d.open);
assert.equal(houseInteractionAt(125.9,12.3,-16,{shelfOpen:true}),null,'The handle follows the moving shelf');
assert.equal(houseInteractionAt(127.6,13.2,-16,{shelfOpen:true}),'shelf');
const visitor={x:125,z:12.3,y:-16+M.eye,houseTheta:null};walkHouse(visitor,0,4.5,{eye:M.eye,shelfOpen:true});assert(visitor.z>16.7,'The discovered room is physically reachable through the opened shelf');
arrive({x:127.6,z:13.2,y:-16,yaw:Math.PI});assert(api.openRoom());action('Slide the shelf closed').onclick();assert(!api.shelfOpen);assert(!d.open);

arrive({x:137,z:0,y:-24,yaw:0});assert(api.openRoom());assert(!d.querySelectorAll('button').some(n=>n.textContent.startsWith('Frequency ratio')),'Frequency controls belong at the lights');assert(d.textContent.includes('west side'));d.close();
arrive({x:110,z:-3,y:-24,yaw:Math.PI});assert(api.openRoom());const ratio=action('Frequency ratio 1 : 2');assert(ratio);ratio.onclick();assert(!d.open);M.city.update(.1,1);
const secondPendulum=api.built.group.children.find(n=>n.position.x===107&&n.position.y===-17.3&&n.position.z===-3);assert(secondPendulum);assert(Math.abs(secondPendulum.rotation.z-.3*Math.sin(2))<1e-10,'Changing the nearby exhibit alters its visible rhythm');

for(const l of HOUSE_LEVELS){
 assert(houseBlocked(110,-10,l.y),'The visible bookcase blocks walking on floor '+l.y);
 const p={x:110,z:-8,y:l.y+M.eye,houseTheta:null};walkHouse(p,0,-4,{eye:M.eye});assert(p.z> -9.5&&p.z< -9.3,'Walking stops at the real shelf front');
 const ring={x:137,z:0,y:l.y+M.eye,houseTheta:null};for(let a=.01;a<=2*Math.PI;a+=.01){const x=125+12*Math.cos(a),z=12*Math.sin(a);walkHouse(ring,x-ring.x,z-ring.z,{eye:M.eye});assert(Math.hypot(ring.x-x,ring.z-z)<1e-7,'Furniture leaves the inner circulation ring clear');}
}
assert.equal(privateAccess,0);events.get('pagehide')();
console.log('PASS house runtime: real door/tunnel exit, paused reading, honest stair guidance, landing-gated E/A, physically nearby moving handle and pendulums, shelf collisions, clear circulation and no private access.');
