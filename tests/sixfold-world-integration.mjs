import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {installTransformationHouse} from '../src/transformation-house.js';
import {installWorldCylinder} from '../src/world-cylinder.js';
import {installEscherDepth} from '../src/escher-depth.js';
import {SIXFOLD_CROSSING as C,SIXFOLD_LOOP_VERTICES} from '../src/sixfold-house-network-model.js';

// The small browser surface is based on the existing world-cylinder fixture.
// All three movement owners and all corridor/house/museum geometry are real.
const context=new Proxy({measureText:t=>({width:t.length*10})},{get:(o,k)=>o[k]??(()=>{})});
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this.open=false;this.hidden=false;this.style={};this._text='';}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}replaceChildren(...nodes){this.children=[];this._text='';this.append(...nodes);}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
 setAttribute(k,v){this.attributes[k]=String(v);}addEventListener(k,fn){this.events[k]=fn;}showModal(){this.open=true;}close(){const was=this.open;this.open=false;if(was)this.events.close?.();}focus(){document.activeElement=this;}getContext(){return context;}
 matches(s){if(s==='dialog[open]')return this.tagName==='dialog'&&this.open;const visible=s.match(/^#([^:]+):not\(\[hidden\]\)$/);if(visible)return this.id===visible[1]&&!this.hidden;if(s.startsWith('#'))return this.id===s.slice(1);if(s.startsWith('.'))return this.className===s.slice(1);return this.tagName===s;}
 querySelectorAll(selector){const list=[],selectors=selector.split(',').map(s=>s.trim()),visit=n=>{for(const c of n.children){if(selectors.some(s=>c.matches(s)))list.push(c);visit(c);}};visit(this);return list;}querySelector(s){return this.querySelectorAll(s)[0]??null;}
}
const body=new Element('body'),reader=new Element('aside');reader.id='reader-panel';reader.hidden=true;body.append(reader);for(const cls of['welcome-secondary','map-directions']){const e=new Element('div');e.className=cls;body.append(e);}
globalThis.document={body,hidden:false,activeElement:null,querySelector:s=>body.querySelector(s),querySelectorAll:s=>body.querySelectorAll(s),createElement:t=>new Element(t)};
const eventMap=new Map();globalThis.addEventListener=(k,fn)=>{const list=eventMap.get(k)||[];list.push(fn);eventMap.set(k,list);};globalThis.removeEventListener=(k,fn)=>{const list=eventMap.get(k)||[],i=list.indexOf(fn);if(i>=0)list.splice(i,1);};globalThis.matchMedia=()=>({matches:true});
let privateAccess=0;globalThis.localStorage=new Proxy({},{get(){privateAccess++;throw Error('Private storage touched');}});globalThis.sessionStorage=globalThis.localStorage;
const scene=new T.Scene();scene.background=new T.Color(0xc2d6df);scene.fog=new T.FogExp2(0xc2d6df,.0012);const sun=new T.DirectionalLight(0xffffff,2.8),sky=new T.HemisphereLight(0xffffff,0x888888,1.7),lantern=new T.Group();scene.add(sun,sky,lantern);
const foreign=new T.Mesh(new T.BoxGeometry(2,3,2),new T.MeshBasicMaterial());foreign.position.set(100,0,100);scene.add(foreign);const layout={x:-2360,z:-65,bounds:{minX:-2455,maxX:-2288,minZ:-225,maxZ:90},mathematics:{x:-2360,z:35},objects:{x:-2360,z:-160}};
const M={scene,camera:new T.PerspectiveCamera(66,1.5,.08,650),lantern,eye:1.8,mode:'city',player:{x:100,y:1.93,z:100,yaw:0,pitch:0},clearMovement(){},setCityMode(){this.mode='city';},cancelActivity(){},cityGroundHeight:()=>.13,pointToward(){},status(){},arrive(q){this.mode='city';Object.assign(this.player,q,{y:q.y+this.eye,pitch:q.pitch??0});},quickStart(){this.mode='city';Object.assign(this.player,{x:100,z:100,y:1.93});},extraGround:()=>.13,startExtra:()=>false,showExtra:()=>false,city:{GRAVEYARD:layout,targets:[foreign],update(){},region:()=>({id:'old',title:'Existing place'}),canStand:()=>true,targetInfo:()=>({kind:'old'})}};
globalThis.window={CITY_GRAVEYARD:{drawActiveMap:()=>true},CITY_ESCHER:{passageOpen:true},gallery:{overview(){M.mode='overview';}}};M.babelLibrary={active:false,stop(){this.active=false;},begin(p){this.active=true;Object.assign(M.player,p);}};
// Match the actual city installer order and gallery.js dispatch order.
const museum=installEscherDepth(M,T),houses=installTransformationHouse(M,T),world=installWorldCylinder(M,T);let time=0,steps=0,handoffs=0,lastOwner=null;const owner=()=>houses.active?'network':museum.active?'museum':world.route?'gallery':null;
const close=(a,b,eps=1e-5)=>assert(Math.abs(a-b)<eps,`${a} differs from ${b}`);
const physicalRoots=[world.built.tunnel,houses.built.group,museum.built.interior];scene.updateMatrixWorld(true);
const visible=hit=>{for(let o=hit.object;o;o=o.parent)if(o.visible===false)return false;return true;};
function physicalSupport(){const p=M.player,feet=p.y-M.eye;close(feet,-40);const ray=(direction,far)=>new T.Raycaster(new T.Vector3(p.x,feet+.15,p.z),new T.Vector3(...direction),0,far).intersectObjects(physicalRoots,true).filter(visible);const floor=ray([0,-1,0],.35),roof=ray([0,1,0],13);assert(floor.length,`Actual supported floor at ${p.x},${p.z}`);close(floor[0].point.y,-40);assert(roof.some(h=>h.point.y>=-35.21),`Real overhead shell at ${p.x},${p.z}`);}
function tick(dt=.05,input={forward:1,boost:true}){const before={...M.player},beforeOwner=owner();let consumed=houses.step(dt,input);if(!consumed)consumed=museum.step(dt,input);if(!consumed)consumed=world.step(dt,input);assert(consumed,`No movement owner at ${M.player.x},${M.player.z}`);time+=dt;M.city.update(M.player,time);const afterOwner=owner();assert(!(houses.active&&world.route),'House and world cannot both retain movement ownership');assert(!(houses.active&&museum.active),'House and museum cannot both retain movement ownership');if(beforeOwner!==afterOwner){handoffs++;const max=beforeOwner==='museum'||afterOwner==='museum'?3:dt*8+.03;assert(Math.hypot(M.player.x-before.x,M.player.z-before.z)<=max,`Handoff moved the visitor farther than the actual supported step: ${beforeOwner}→${afterOwner}; (${before.x},${before.z}) to (${M.player.x},${M.player.z})`);}if(++steps%31===0){scene.updateMatrixWorld(true);physicalSupport();const delta=new T.Vector3(M.player.x-before.x,0,M.player.z-before.z),length=delta.length();if(length>.02){const hits=new T.Raycaster(new T.Vector3(before.x,before.y-.05,before.z),delta.normalize(),0,length-.01).intersectObjects(physicalRoots,true).filter(visible);assert.equal(hits.length,0,'A real wall cannot cross the supported movement segment');}}lastOwner=afterOwner;return afterOwner;}
function drive(x,z,{expected=null,max=2500}={}){const p=M.player,start={x:p.x,z:p.z},dx=x-p.x,dz=z-p.z,distance=Math.hypot(dx,dz);if(distance<1e-5)return;const yaw=Math.atan2(-dx,-dz);p.yaw=yaw;let previous=Infinity;for(let i=0;i<max;i++){const d=Math.hypot(x-p.x,z-p.z);if(d<.09){if(expected)assert.equal(owner(),expected);return;}assert(d<previous+.8,`Held movement diverged from (${x},${z})`);previous=d;const speed=houses.active?8:museum.active?7.2:7;tick(Math.min(.05,d/speed));assert(Math.abs(M.player.y-M.eye+40)<1e-6);}
 throw Error(`Held forward stopped at ${p.x.toFixed(4)},${p.z.toFixed(4)} from ${start.x},${start.z}, heading to ${x},${z}`);
}
function galleryStart(x,z,yaw=0){M.arrive({x,z,y:-40,yaw});assert(!houses.active&&!museum.active&&!world.route);tick(0,{forward:0});assert.equal(owner(),'gallery');}
function networkStart(x,z,yaw=0){M.arrive({x,z,y:-40,yaw});assert(houses.enterFromPassage({x,z,y:-40,yaw}));assert.equal(owner(),'network');}

// Ordinary legacy travel crosses the new junction without being captured.
for(const sign of[-1,1]){galleryStart(70,C.z-sign*10);drive(70,C.z+sign*10,{expected:'gallery'});for(let i=0;i<12;i++)tick(.05,{forward:1,boost:true});assert.equal(owner(),'gallery');assert(Math.abs(M.player.z-C.z)>13);}
// Both diagonal arms remain one network when walking straight through.
const ux=.5,uz=-Math.sqrt(3)/2;for(const sign of[-1,1]){networkStart(70-sign*ux*11,C.z-sign*uz*11);drive(70+sign*ux*11,C.z+sign*uz*11,{expected:'network'});}
// Turn from each legacy arm onto each loop arm, then reverse the full route.
// Every segment uses one fixed heading and a continuously held forward input.
for(const legacySign of[-1,1])for(const loopSign of[-1,1]){
 galleryStart(70,C.z+legacySign*9);drive(70,C.z,{expected:'gallery'});drive(70+loopSign*ux*10,C.z+loopSign*uz*10,{expected:'network'});const before={x:M.player.x,z:M.player.z};for(let i=0;i<8;i++)tick(.05,{forward:1,boost:true});assert.equal(owner(),'network');assert(Math.hypot(M.player.x-before.x,M.player.z-before.z)>3);
 drive(70,C.z,{expected:'network'});drive(70,C.z+legacySign*10,{expected:'gallery'});for(let i=0;i<12;i++)tick(.05,{forward:1,boost:true});assert.equal(owner(),'gallery','Released crossing sleeve cannot recapture');assert(Math.abs(M.player.z-C.z)>13);
}
// The east seam works in both directions and keeps walking beyond the overlap.
galleryStart(67,0);drive(80,0,{expected:'network'});drive(65,0,{expected:'gallery'});for(let i=0;i<12;i++)tick(.05,{forward:1,boost:true});assert.equal(owner(),'gallery');assert(M.player.x<61);
networkStart(SIXFOLD_LOOP_VERTICES[0][0],0);drive(68,0,{expected:'gallery'});drive(80,0,{expected:'network'});
// A full real museum round trip continues after the crossing and returns to
// the same gallery junction; no stub implements either movement handoff. The
// pre-existing museum entry snaps to its safe landing by up to3m, so that legacy
// join has a separate bound above; all new network handoffs use only one step.
galleryStart(70,C.z+9);drive(70,115,{expected:'gallery'});drive(145,115,{expected:'museum'});drive(145,120,{expected:'museum'});drive(170,120,{expected:'museum'});drive(170,115,{expected:'museum'});drive(177,115,{expected:'museum'});assert(museum.built.interior.children.length);drive(170,115,{expected:'museum'});drive(170,120,{expected:'museum'});drive(145,120,{expected:'museum'});drive(145,115,{expected:'museum'});drive(130,115,{expected:'gallery'});drive(70,115,{expected:'gallery'});drive(70,C.z,{expected:'gallery'});drive(76,C.z-6*Math.sqrt(3),{expected:'network'});
scene.updateMatrixWorld(true);physicalSupport();assert(handoffs>=20);assert(steps>1000);assert.equal(privateAccess,0);
for(const fn of[...(eventMap.get('pagehide')||[])])fn();assert(!M.transformationHouse&&!M.worldCylinder);assert(scene.children.includes(foreign));
console.log(`PASS actual world + sixfold network + Escher integration: ${steps} held-input frames, ${handoffs} real ownership handoffs, all four crossing arms and turn directions, east seam reverse travel, real museum continuation, physical support/headroom and no recapture or private access`);
