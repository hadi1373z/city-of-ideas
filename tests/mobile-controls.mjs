import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {showRoomDialog} from '../src/room-workbench.js';
let document;
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.parentNode=null;this.dataset={};this.attributes={};this.hidden=false;this.open=false;this.disabled=false;this.tabIndex=tag==='button'?0:-1;this.listeners=new Map();this.style={values:{},setProperty(k,v){this.values[k]=v;}};const names=new Set();this.classList={toggle:(n,on)=>on?names.add(n):names.delete(n),contains:n=>names.has(n)};this.captures=new Set();}
 addEventListener(t,f,o){if(!this.listeners.has(t))this.listeners.set(t,[]);this.listeners.get(t).push({f,o});}
 removeEventListener(t,f){this.listeners.set(t,(this.listeners.get(t)||[]).filter(x=>x.f!==f));}
 fire(t,e={}){e.target??=this;e.preventDefault??=()=>{e.prevented=true;};e.stopPropagation??=()=>{e.stopped=true;};for(const{f}of[...(this.listeners.get(t)||[])])f(e);return e;}
 append(...nodes){for(const n of nodes){n.remove();this.children.push(n);n.parentNode=this;}}
 remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(n=>n!==this);this.parentNode=null;}
 before(n){const p=this.parentNode;n.remove();const i=p.children.indexOf(this);p.children.splice(i,0,n);n.parentNode=p;}
 after(n){const p=this.parentNode;n.remove();const i=p.children.indexOf(this);p.children.splice(i+1,0,n);n.parentNode=p;}
 setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k]??null;}
 matches(s){if(s==='[data-joystick]')return this.dataset.joystick!==undefined;if(s==='button,a[href]')return this.tagName==='button'||this.tagName==='a';if(s.startsWith('#'))return this.id===s.slice(1);if(s.startsWith('.'))return String(this.className||'').split(' ').includes(s.slice(1));return this.tagName===s;}
 closest(s){for(let n=this;n;n=n.parentNode)if(n.matches(s))return n;return null;}
 querySelectorAll(s){const found=[];const visit=n=>{for(const c of n.children){if(s.includes('button,')?['button','a','input','select'].includes(c.tagName):c.matches(s))found.push(c);visit(c);}};visit(this);return found;}
 querySelector(s){return this.querySelectorAll(s)[0]??null;}
 getClientRects(){for(let n=this;n;n=n.parentNode)if(n.hidden||n.tagName==='dialog'&&!n.open)return[];return[{}];}
 focus(){document.activeElement=this;}
 getBoundingClientRect(){return{left:100,top:200,width:132,height:132};}
 setPointerCapture(id){this.captures.add(id);}releasePointerCapture(id){this.captures.delete(id);this.fire('lostpointercapture',{pointerId:id});}
 show(){this.open=true;}showModal(){this.open=true;}close(value=''){this.open=false;this.returnValue=value;this.fire('close');}
}
const body=new Element('body'),headerHome=new Element('header'),hud=new Element(),header=new Element(),actions=new Element(),toggle=new Element('button'),stick=new Element('button'),thumb=new Element('span'),help=new Element('span');header.id='city-header-buttons';actions.className='visit-actions';toggle.id='city-mobile-menu';stick.dataset.joystick='';thumb.className='joystick-thumb';thumb.offsetWidth=54;help.id='city-joystick-help';stick.append(thumb);headerHome.append(toggle,header);hud.append(actions,stick,help);body.append(headerHome,hud);
const overview=new Element('button'),language=new Element('button'),tool=new Element('button');header.append(overview,language);actions.append(tool);
const compact=new Element('dialog'),reader=new Element('dialog');compact.dataset.workbench='true';compact.open=reader.open=true;
document=new Element('document');document.body=body;document.documentElement={lang:'en'};document.hidden=false;document.activeElement=null;document.createElement=t=>new Element(t);document.createComment=()=>new Element('#comment');document.getElementById=id=>[body,...body.querySelectorAll('*')].find(n=>n.id===id)??find(body,n=>n.id===id);document.querySelector=s=>find(body,n=>n.matches(s));document.querySelectorAll=s=>{assert.equal(s,'dialog[open][data-workbench="true"]');return compact.open?[compact]:[];};
function find(n,test){if(test(n))return n;for(const c of n.children){const r=find(c,test);if(r)return r;}return null;}
const window=new Element('window');let cleared=0;window.CITY_MAIN={clearMovement(){cleared++;}};
const media=new Element();media.matches=true;const scope={window,document,matchMedia:()=>media,addEventListener:window.addEventListener.bind(window)};
vm.runInNewContext(fs.readFileSync(new URL('../src/mobile-controls.js',import.meta.url),'utf8'),scope);
const api=window.CITY_TOUCH,near=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`),neutral=()=>{near(api.poll().forward,0);near(api.poll().strafe,0);assert(!stick.classList.contains('is-active'));};
const down=(id=1,x=166,y=266)=>stick.fire('pointerdown',{pointerId:id,clientX:x,clientY:y,button:0,pointerType:'touch'}),move=(id,x,y)=>stick.fire('pointermove',{pointerId:id,clientX:x,clientY:y,buttons:1,pointerType:'touch'});
neutral();down();assert(!compact.open);assert(reader.open,'Ordinary readers are never dismissed by the movement control');assert(stick.captures.has(1));move(1,166,251);near(api.poll().forward,(.5-.12)/.88);near(api.poll().strafe,0);
move(1,136,267);near(api.poll().forward,0);near(api.poll().strafe,-1);move(1,167,236);near(api.poll().forward,1);near(api.poll().strafe,0);
move(1,196,236);near(Math.hypot(api.poll().forward,api.poll().strafe),1);assert(Math.hypot(parseFloat(stick.style.values['--joystick-x']),parseFloat(stick.style.values['--joystick-y']))<=30.000001,'The thumb stays inside its circle');
down(2,166,296);move(2,136,266);assert(api.poll().forward>0&&api.poll().strafe>0,'A second finger cannot steal the movement stick');stick.fire('pointerup',{pointerId:2});assert(api.poll().forward>0);window.fire('pointerup',{pointerId:1});neutral();assert(!stick.captures.size);
for(const type of['pointercancel','lostpointercapture']){down();move(1,196,266);stick.fire(type,{pointerId:1});neutral();}
down();move(1,166,296);window.fire('blur');neutral();down();move(1,136,266);document.hidden=true;document.fire('visibilitychange');neutral();document.hidden=false;
down();move(1,196,266);api.poll(true);neutral();down();move(1,196,266);window.fire('resize');neutral();
const key=stick.fire('keydown',{code:'ArrowUp'});assert(key.prevented&&key.stopped);stick.fire('keydown',{code:'ArrowRight'});near(Math.hypot(api.poll().forward,api.poll().strafe),1);stick.fire('keyup',{code:'ArrowUp'});near(api.poll().strafe,1);stick.fire('keyup',{code:'ArrowRight'});neutral();
// Real root integration consumes the analog axes, while preserving physical
// gamepad flags and stopping the stick for readers and native clearMovement.
const source=fs.readFileSync(new URL('../src/gallery.js',import.meta.url),'utf8'),start=source.indexOf('function updateGamepad(dt){'),end=source.indexOf('\nfunction ',start+1),rootBody=source.slice(start,end);
let modal=false,manual=0;const world={dataset:{}},padInput={},rootState={document,window:{CITY_TOUCH:api,CITY_MAIN:{},dispatchEvent(){manual++;}},cityPad:{poll(blocked){return{connected:true,forward:blocked?0:.25,strafe:0,sprint:true,lookX:0,lookY:0};},cancelPhotoBinding(){}},padInput,modalActive:()=>modal,activeControlPanel:()=>null,$:id=>id==='world'?world:{hidden:true},panelOpen:false,controllerMenu:false,transition:null,returnLift:null,inside:true,visitMode:'city',cityPhoto:null,summitStory:{follow(){}},stopTour(){},player:{yaw:0,pitch:0},lookPitch:x=>x,Event:class{}};
const update=Function('s','with(s){'+rootBody+';return updateGamepad;}')(rootState);
const sharedStart=source.indexOf('function updateSharedVisit(dt,time){'),sharedEnd=source.indexOf('\nfunction ',sharedStart+1),shared=Function('s','with(s){'+source.slice(sharedStart,sharedEnd)+';return updateSharedVisit;}')(Object.assign(rootState,{keys:{},returnApproach:null,rampTarget:null,touring:false,movingFast:()=>false}));
// Chosen two-hand layout: the left stick moves without changing the view.
const walked=[];rootState.moveOnSharedGround=(dx,dz)=>walked.push({dx,dz});
down();move(1,136,266);update(.1);near(padInput.strafe,-1);padInput.forward=0;const yaw=rootState.player.yaw;shared(.1,0);near(rootState.player.yaw,yaw);near(walked.at(-1).dx,-.85);near(walked.at(-1).dz,0);stick.fire('pointerup',{pointerId:1});
down();move(1,196,266);update(.1);near(padInput.strafe,1);padInput.forward=0;shared(.1,0);near(rootState.player.yaw,yaw);near(walked.at(-1).dx,.85);stick.fire('pointerup',{pointerId:1});
let delivered;rootState.window.CITY_MAIN={escherDepth:{step(dt,input){delivered=input;return true;}}};down();move(1,136,266);update(.016);shared(.016,0);near(delivered.turn,0);near(delivered.strafe,-1);stick.fire('pointerup',{pointerId:1});rootState.window.CITY_MAIN={};
down();move(1,166,251);update(.016);near(padInput.forward,.25+(.5-.12)/.88);assert.equal(padInput.sprint,true);assert.equal(world.dataset.controller,'connected');assert(manual>0);modal=true;update(.016);neutral();near(padInput.forward,0);modal=false;
// The same original control nodes move into the compact menu, and return on
// desktop; generated actions retain identity, focus and their own callbacks.
const menu=window.CITY_MOBILE_MENU;assert(menu);assert.equal(header.parentNode.className,'mobile-menu-header-controls');assert.equal(actions.parentNode.className,'mobile-menu-visit-controls');assert.equal(toggle.getAttribute('aria-expanded'),'false');
down();move(1,196,266);toggle.fire('click');neutral();assert(menu.open&&menu.menu.open&&!menu.backdrop.hidden);assert.equal(document.activeElement,menu.close);assert.equal(toggle.getAttribute('aria-expanded'),'true');menu.backdrop.fire('click');assert(!menu.open);assert.equal(document.activeElement,toggle);
menu.show();let actionSawClosed=false;menu.menu.fire('click',{target:tool});actionSawClosed=!menu.open;assert(actionSawClosed,'The sheet closes before the original action opens its own dialog');assert.equal(actions.children[0],tool);
menu.show();document.fire('keydown',{code:'Escape'});assert(!menu.open);const added=new Element('button');actions.append(added);media.matches=false;media.fire('change');assert.equal(header.parentNode,headerHome);assert.equal(actions.parentNode,hud);assert(actions.children.includes(added));assert.equal(header.children[0],overview);media.matches=true;media.fire('change');assert.equal(actions.parentNode.className,'mobile-menu-visit-controls');
for(const[lang,pattern]of[['fa',/جوی/],['de',/Joystick/],['en',/joystick/]]){document.documentElement.lang=lang;window.fire('city-language');assert(pattern.test(stick.getAttribute('aria-label')));}
// Exercise the actual canvas handlers, including simultaneous move/look fingers.
const lookStart=source.indexOf('function bindViewControls(c){'),lookEnd=source.indexOf('\nfunction ',lookStart+1),viewPointer={down:false,id:null,lastX:0,lastY:0,moved:0},viewPlayer={yaw:0,pitch:0},lookCanvas=new Element('canvas');lookCanvas.getBoundingClientRect=()=>({left:0,top:0,width:800,height:600});let picks=0;
const lookScope={document,pointer:viewPointer,player:viewPlayer,inside:true,summitStory:{follow(){}},stopTour(){},modalActive:()=>modal,panelOpen:false,$:()=>({hidden:true}),controllerMenu:false,transition:null,returnLift:null,lookPitch:v=>Math.max(-1,Math.min(1,v)),pickSceneAt(){picks++;},addEventListener:window.addEventListener.bind(window)};
Function('s','with(s){'+source.slice(lookStart,lookEnd)+';return bindViewControls;}')(lookScope)(lookCanvas);
const lookEvent=(pointerId,clientX,clientY)=>({pointerId,clientX,clientY,pointerType:'touch',button:0});
down();move(1,166,236);lookCanvas.fire('pointerdown',lookEvent(2,600,200));stick.fire('blur');near(api.poll().forward,1);lookCanvas.fire('pointermove',lookEvent(2,640,220));near(viewPlayer.yaw,-.16);near(viewPlayer.pitch,-.06);near(api.poll().forward,1);lookCanvas.fire('pointerup',lookEvent(99,640,220));assert(viewPointer.down,'A different finger cannot release the look gesture');lookCanvas.fire('pointerup',lookEvent(2,640,220));near(api.poll().forward,1);assert.equal(picks,0);stick.fire('pointerup',{pointerId:1});neutral();
lookCanvas.fire('pointerdown',lookEvent(3,100,200));lookCanvas.fire('pointermove',lookEvent(3,200,230));near(viewPlayer.yaw,-.16);lookCanvas.fire('pointerup',lookEvent(3,200,230));assert.equal(picks,0,'Dragging the left scene area cannot turn the view or click an artwork');
lookCanvas.fire('pointerdown',lookEvent(4,100,200));lookCanvas.fire('pointerup',lookEvent(4,100,200));assert.equal(picks,1,'A genuine artwork tap is retained on the left');
lookCanvas.fire('pointerdown',lookEvent(5,600,200));lookCanvas.fire('lostpointercapture',lookEvent(5,600,200));assert(!viewPointer.down);modal=true;lookCanvas.fire('pointerdown',lookEvent(6,600,200));assert(!viewPointer.down);modal=false;
// Existing compact-room/modal transitions are retained.
showRoomDialog(compact,true);assert(compact.open);showRoomDialog(compact,false);assert.equal(compact.dataset.roomPresentation,'reading');showRoomDialog(compact,true);assert.equal(compact.dataset.roomPresentation,'workbench');
api.dispose();down();neutral();assert(cleared>0);
const html=fs.readFileSync(new URL('../src/index.html',import.meta.url),'utf8');assert(!html.includes('data-move='));assert(html.includes('aria-controls="city-controls-menu"'));assert(html.includes('data-joystick'));
console.log('PASS mobile joystick/menu: continuous radial axes/deadzone/diagonal cap, capture/secondfinger/release/cancel/blur/visibility/modal resets, independent left movement/right look, two-finger ownership and focus retention, native stair-axis delivery, real root analog merge, keyboard access, compact workbench dismissal, live node transport/desktop restore, focus/Escape/outside/action closing, FA/EN/DE and cleanup.');
