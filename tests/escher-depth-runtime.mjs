import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {ESCHER_DEPTH as D,depthFloorAt,DEPTH_VIEW} from '../src/escher-depth-model.js';
import {buildEscherDepth} from '../src/escher-depth-scene.js';
import {installEscherDepth} from '../src/escher-depth.js';

const near=(a,b,eps=1e-5)=>assert(Math.abs(a-b)<eps,`${a} ≠ ${b}`);
const context=new Proxy({measureText:t=>({width:t.length*12})},{get:(o,k)=>o[k]??(()=>{})});
const canvas=()=>({getContext:()=>context});
const built=buildEscherDepth(T,{canvas});built.group.updateMatrixWorld(true);
let draws=0,instances=0;
built.group.traverse(o=>{
 if(o.geometry){assert(o.geometry.attributes.position.array.every(Number.isFinite),'Every generated vertex is finite');if(o.isMesh)draws++;}
 if(o.isInstancedMesh){instances+=o.count;assert(o.instanceMatrix.array.every(Number.isFinite),'Every instance transform is finite');}
});
assert(draws<60,`Museum geometry uses ${draws} draws, including its surface doors and labels`);assert(instances>300,'Masonry, stairs and exhibits use real batched geometry');
const ray=(x,y,z,dx,dy,dz,far=80)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(dx,dy,dz),0,far).intersectObject(built.interior,true);
// Vertical rays check actual floors and sealed vaults, including the upper
// balconies, real stair openings, and the closed lower well basin.
for(const[x,z,y]of[[138,115,-40],[202,120,-40],[157.63,125,-40],[216.69,87,-40],[220,151,-40],[182,172,-46],[197,94,-34],[157.63,99,-34]]){
 const floor=depthFloorAt(x,z,y),down=ray(x,floor+1.8,z,0,-1,0),up=ray(x,floor+1.8,z,0,1,0);
 assert(down.length&&up.length,'Every sampled storey has a physical floor and opaque roof');near(down[0].point.y,floor,.065);assert(up[0].point.y-floor>2.2,'Headroom above occupied floor');
}
for(const s of D.stairs)for(let i=0;i<s.steps;i++){
 const x=(s.minX+s.maxX)/2,z=s.minZ+(i+.5)*(s.maxZ-s.minZ)/s.steps,y=s.top+(i+1)*(s.bottom-s.top)/s.steps,hits=ray(x,y+1,z,0,-1,0,2);
 assert(hits.length,'Physical stair tread '+s.id+' '+i+' missing');near(hits[0].point.y,y);const up=ray(x,y+1.8,z,0,1,0,30);assert(up.length&&up[0].point.y-y>2.1,'Stair headroom '+s.id+' '+i);
}
near(ray(197,-47,166,0,-1,0,10)[0].point.y,-50);
for(const z of[113.5,114,115,116,116.5])assert.equal(ray(134,-38.2,z,1,0,0,2.5).length,0,'Gallery passage is an actual gap');
for(const z of[111.9,118.1])assert(ray(138,-38.2,z,0,0,z<115?1:-1,1).length,'Enclosed connector walls flank the aperture');
assert.equal(built.targets.filter(o=>o.userData.escherDepthDoor).length,3);
assert(built.group.getObjectByName('Two-storey hexagonal vaulted arcades'));
assert(built.group.getObjectByName('Original Möbius band · topology wing'));
const oldTile=built.group.getObjectByName('Live edge-pairing mosaic').children[0].geometry;let tileDisposed=0;oldTile.addEventListener('dispose',()=>tileDisposed++);built.setTessellation({motif:1,pairX:true,pairZ:true});assert.equal(tileDisposed,1);
const oldLoop=built.group.getObjectByName('Live closed-loop stair model').children[0].geometry;let loopDisposed=0;oldLoop.addEventListener('dispose',()=>loopDisposed++);built.setLoop([-1,-1,1,1]);assert.equal(loopDisposed,1);built.dispose();assert.equal(built.group.children.length,0);

// A small DOM supplies only browser interfaces used by the installer. Selector
// matching includes paused readers and open dialogs, so pause tests are real.
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
globalThis.window={CITY_ESCHER:{passageOpen:false}};
const events=new Map();globalThis.addEventListener=(name,fn)=>events.set(name,fn);globalThis.removeEventListener=()=>{};
let privateAccess=0;const privateStore=new Proxy({},{get(){privateAccess++;throw Error('The museum must not access saved private data');}});
globalThis.localStorage=privateStore;window.localStorage=privateStore;globalThis.sessionStorage=privateStore;window.sessionStorage=privateStore;
const scene=new T.Scene();scene.background=new T.Color(0xc2d6df);scene.fog=new T.FogExp2(0xc2d6df,.0012);
const sun=new T.DirectionalLight(0xffffff,2.8),sky=new T.HemisphereLight(0xffffff,0x888888,1.7),foreign=new T.Group();scene.add(sun,sky,foreign);
const originalColor=scene.background.getHex(),originalFog=scene.fog.color.getHex(),originalDensity=scene.fog.density;
let clears=0,delegated=0,cancelled=0,updates=0;
const M={scene,eye:1.8,mode:'city',player:{x:0,z:0,y:1.93,yaw:0,pitch:0},clearMovement(){clears++;},cancelActivity(){cancelled++;},setCityMode(){this.mode='city';},cityGroundHeight(){return .13;},pointToward(){},status(){},arrive(q){this.mode='city';Object.assign(this.player,q,{y:q.y+this.eye,pitch:q.pitch??0});},city:{targets:[foreign],region:()=>({id:'foreign-region'}),targetInfo:()=>({kind:'foreign'}),update(){updates++;}},showExtra(){delegated++;}};
const originals={arrive:M.arrive,update:M.city.update,region:M.city.region,target:M.city.targetInfo,show:M.showExtra};
let galleryCalls=0,galleryPoint=null;
const api=installEscherDepth(M,T,{onGalleryExit:p=>{galleryCalls++;galleryPoint={...p};M.arrive(p);}}),interior=api.built.interior;
const surface=id=>{const p=D.portals.find(p=>p.id===id);M.mode='city';Object.assign(M.player,{x:p.x,z:p.z,y:p.y+M.eye,yaw:0,pitch:0});return p;};
const underground=(id,x,z)=>{if(!api.active)assert(api.enter(id));Object.assign(M.player,{x,z,y:depthFloorAt(x,z)+M.eye,yaw:0,pitch:0});};
const restoreChecked=()=>{near(sun.intensity,2.8);near(sky.intensity,1.7);assert.equal(scene.background.getHex(),originalColor);assert.equal(scene.fog.color.getHex(),originalFog);near(scene.fog.density,originalDensity);assert(!api.built.lamps.visible);};
assert.equal(api.step(.1,{forward:1}),false);assert.equal(api.interact(),false);
surface('park');M.mode='gallery';assert.equal(api.checkPortals(1),false);assert(!api.active);
surface('park');M.player.y=-38.2;assert.equal(api.checkPortals(2),false);assert(!api.active,'A matching x/z at an underground height cannot trigger a surface door');
surface('park');const foreignDialog=new Element('dialog');body.append(foreignDialog);foreignDialog.showModal();assert.equal(api.checkPortals(3),false);assert(!api.active);foreignDialog.close();foreignDialog.remove();
reader.hidden=false;assert.equal(api.checkPortals(4),false);reader.hidden=true;
assert(api.checkPortals(5));assert(api.active);assert.equal(api.built.interior,interior);near(M.player.x,174);near(M.player.z,114);near(M.player.y,-38.2);assert.equal(body.dataset.escherDepth,'true');near(sun.intensity,2.8);near(sky.intensity,1.7);assert(api.built.lamps.visible);
const beforeMove={...M.player};assert(api.step(.1,{forward:1}));assert(M.player.x>beforeMove.x);near(M.player.z,beforeMove.z);const beforeYaw=M.player.yaw;api.step(.1,{turn:1});near(M.player.yaw-beforeYaw,.165);
const paused={...M.player};reader.hidden=false;api.step(.1,{forward:1,turn:1});assert.deepEqual(M.player,paused);reader.hidden=true;
foreignDialog.showModal();body.append(foreignDialog);api.step(.1,{forward:1,turn:1});assert.deepEqual(M.player,paused);foreignDialog.close();foreignDialog.remove();
M.city.update(M.player,6);assert(updates);assert.equal(M.city.region(M.player.x,M.player.z).id,'escher-depth');
assert(api.leave());assert(!api.active);restoreChecked();near(M.player.z,D.portals[1].z+2.35);
surface('escher');assert.equal(api.checkPortals(10),false);assert(api.interact());assert(!api.active);assert.equal(api.enter('escher'),false,'The existing Escher passage gates its rear alcove');
window.CITY_ESCHER.passageOpen=true;assert.equal(api.descent.built.group.parent,api.built.group,'The stair must survive ordinary underground scene culling');const stairStart={...M.player};assert.equal(api.checkPortals(11),false,'The Escher alcove no longer teleports to the museum');assert(api.step(.01));assert(api.descent.active);near(M.player.x,stairStart.x);near(M.player.z,stairStart.z);near(M.player.y,stairStart.y);api.stop();assert(!api.active);restoreChecked();
// A slow city frame must not leap over the narrow capture interval.
surface('escher');M.player.z=106.1;const rootText=await readFile(new URL('../src/gallery.js',import.meta.url),'utf8'),rootMove=rootText.slice(rootText.indexOf('function moveOnSharedGround('),rootText.indexOf('function updateSharedVisit('));const rootWalk=Function('player','window','visitMode',rootMove+';return moveOnSharedGround;')(M.player,{CITY_MAIN:M},'city');rootWalk(0,-8.5);assert(api.descent.active,'Actual root substeps capture the first flight even after a one-second frame');assert(M.player.z>105.5&&M.player.z<105.85,'Capture consumes only the genuine surface substep');api.stop();restoreChecked();
// Drive the actual controller through every flight, then return without recapture.
surface('escher');M.player.z=105.5;const stairWaypoints=[];for(let i=0;i<8;i++){const north=i%2===0;stairWaypoints.push([i%2===0?228:225,north?91.3:104.7]);if(i<7)stairWaypoints.push([i%2===0?225:228,north?91.3:104.7]);}stairWaypoints.push([225,107.2]);
function walkToStairPoint([x,z]){let frames=0;while(Math.hypot(M.player.x-x,M.player.z-z)>.025){assert(frames++<1800,'Stair controller stuck '+JSON.stringify({player:M.player,target:[x,z],active:api.active,stair:api.descent.active}));const d=Math.hypot(M.player.x-x,M.player.z-z),before={...M.player};M.player.yaw=Math.atan2(-(x-M.player.x),-(z-M.player.z));api.step(Math.min(.025,d/3.8),{forward:1});assert(Math.hypot(M.player.x-before.x,M.player.z-before.z)<.2,'No entrance or landing teleports');}}
for(const p of stairWaypoints)walkToStairPoint(p);near(M.player.y,-38.2);assert(api.active&&!api.descent.active,'Museum walking takes over after the bottom landing');M.player.yaw=Math.PI;api.step(.05,{forward:1});assert(!api.descent.active,'Walking away cannot recapture the short stair deck');
for(const p of stairWaypoints.slice(0,-1).toReversed())walkToStairPoint(p);walkToStairPoint([228,105.88]);near(M.player.y,1.93);assert(!api.active,'The ordinary surface takes over again');restoreChecked();
surface('study');assert(api.checkPortals(20));assert.equal(api.built.interior,interior);near(M.player.x,223);near(M.player.z,155);assert(api.leave());restoreChecked();
surface('park');assert(api.checkPortals(30));assert.equal(api.built.interior,interior);assert(api.leave());
assert.equal(scene.children.filter(o=>o.userData.escherDepth).length,1,'All three doors share exactly one built interior');

underground('gallery',DEPTH_VIEW.x-3.5,DEPTH_VIEW.z);api.faceTriangle();for(let i=0;i<15;i++)api.step(.1);assert(!api.progress.perspective,'The side mark cannot solve the perspective experiment');
assert(api.openExhibit('perspective'));const dialog=body.querySelector('#escher-depth-experiment');assert(dialog.open);assert(dialog.textContent.includes('rods do not touch'));
const position={...M.player};api.step(.1,{forward:1,turn:1});assert.deepEqual(M.player,position);assert(!api.progress.perspective,'An open explanation pauses alignment progress');
assert(api.moveMark());assert(!dialog.open);assert(!api.progress.perspective,'Choosing a viewing mark is not itself a solve');
assert(api.moveMark());near(M.player.x,DEPTH_VIEW.x);assert(!api.progress.perspective);
M.player.yaw=Math.PI;for(let i=0;i<15;i++)api.step(.1);assert(!api.progress.perspective,'The correct mark while facing away cannot solve');api.faceTriangle();for(let i=0;i<13;i++)api.step(.1);assert(api.progress.perspective);
underground('gallery',216.69,87);assert(api.openExhibit('tessellation'));assert(dialog.textContent.includes('not a reconstruction'));
const click=k=>{const n=dialog.querySelectorAll('button').find(n=>n.dataset.escherFocus===k);assert(n,`Missing experiment control ${k}`);n.onclick();};
click('pairX');assert(!api.progress.tessellation);click('pairZ');assert(api.progress.tessellation);click('motif');assert(api.progress.tessellation,'Matched translated edges remain matched when their contour changes');dialog.close();
assert(api.followPrint('ascending-descending'));assert.equal(api.selectedPrint,'ascending-descending');assert.equal(api.followPrint('unknown'),false);
underground('gallery',182,172);assert(api.openExhibit('loop'));assert(dialog.textContent.includes('From Ascending and Descending'));assert(dialog.textContent.includes('+8'));click('flight0');assert(!api.progress.loop);click('flight1');assert(api.progress.loop);assert(dialog.textContent.includes('The route closes'));click('all-up');assert(!api.progress.loop);assert(dialog.textContent.includes('+8'));dialog.close();assert(api.followPrint('drawing-hands'));underground('gallery',220,151);assert(api.openExhibit('reading'));assert(dialog.textContent.includes('No legal first task'));click('dependency-a');assert(dialog.textContent.includes('A → B'));click('dependency-b');assert(dialog.textContent.includes('independently'));dialog.close();
assert(api.travel('upper'));near(M.player.x,207);near(M.player.z,100);near(M.player.y,-32.2);api.step(.01,{forward:0});assert(api.active,'Upper-storey validity is selected by previous feet height');assert.equal(api.openExhibit('reading'),false,'Upper galleries cannot activate ground-floor studies');assert(api.travel('court'));near(M.player.x,207);near(M.player.z,124);near(M.player.y,-38.2);
assert.equal(privateAccess,0,'Experiments never access private notes or browser persistence');
for(const file of['escher-depth.js','escher-depth-scene.js','escher-depth-model.js']){
 const text=await readFile(new URL('../src/'+file,import.meta.url),'utf8');assert(!/localStorage|sessionStorage|visitorMemory|indexedDB|speechSynthesis|fetch\(/.test(text),`${file} must not mutate private progress, voices or external services`);
}

assert(api.enter('gallery'));Object.assign(M.player,{x:135.3,z:115,y:-38.2,yaw:Math.PI/2,pitch:.1});api.step(.1,{forward:1});
assert.equal(galleryCalls,1);assert(!api.active);assert(galleryPoint.x<135&&galleryPoint.x>134.4);near(galleryPoint.y,-40);restoreChecked();
assert(api.enter('park'));M.arrive({x:50,z:50,y:.13,yaw:0});assert(!api.active);near(M.player.x,50);restoreChecked();
assert(api.enter('park'));M.player.y=1.93;const wrongHeight={...M.player};assert.equal(api.step(.1,{forward:1}),false);assert.deepEqual(M.player,wrongHeight,'An unrelated surface arrival is not pulled underground');restoreChecked();
assert(api.enter('park'));M.mode='gallery';assert.equal(api.checkPortals(40),false);assert(!api.active);restoreChecked();
M.showExtra({kind:'foreign'});assert.equal(delegated,1);assert.equal(M.city.targetInfo({}).kind,'foreign');
assert(clears>0&&cancelled>=7);
events.get('pagehide')();assert.deepEqual(M.city.targets,[foreign]);assert.deepEqual(scene.children,[sun,sky,foreign]);assert.equal(M.arrive,originals.arrive);assert.equal(M.city.update,originals.update);assert.equal(M.city.region,originals.region);assert.equal(M.city.targetInfo,originals.target);assert.equal(M.showExtra,originals.show);assert(!body.querySelector('#escher-depth-context'));assert(!body.querySelector('#escher-depth-experiment'));assert(!body.querySelector('#escher-depth-enter'));restoreChecked();
M.mode='city';const fresh=installEscherDepth(M,T);assert.deepEqual(fresh.progress,{perspective:false,tessellation:false,loop:false},'A new visit starts without secretly persisted settings');events.get('pagehide')();assert.deepEqual(M.city.targets,[foreign]);assert.deepEqual(scene.children,[sun,sky,foreign]);

console.log(`PASS Escher depth runtime: ${draws} mesh draws / ${instances} batched instances, real floors/roofs and all 96 treads, open gallery gap, three shared portals, gate/height/mode/modal guards, physical-view solve, live edge/loop controls, no persistence, gallery handoff, lighting restoration and owned cleanup`);
