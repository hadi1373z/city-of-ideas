import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {BABEL,babelDesk,surfaceAt as babelSurface} from '../src/babel-library-model.js';
import {UPPER,LOWER,pointAt,surfaceAt as gallerySurface} from '../src/two-face-gallery-model.js';
import {canWalkDepth,depthFloorAt} from '../src/escher-depth-model.js';
import {physicalToLower,tunnelContains} from '../src/world-cylinder-model.js';
import {facultyCanStand} from '../src/math-faculty-model.js';
import {buildMathCity} from '../src/city-source-assets/home-tools/math-city-scene.js';
import {connectedContext,connectedRoute,museumRoute} from '../src/connected-journey-model.js';
import {installConnectedJourney} from '../src/connected-journey.js';
import {buildMathWingStairs} from '../src/math-wing-stairs-scene.js';
import {inStairOpening,stairBarrier,stairSurface,wingStep} from '../src/math-wing-stairs-model.js';
import {mathWayfindingCopy} from '../src/math-wing-wayfinding-copy.js';
const near=(a,b,e=.001)=>assert(Math.abs(a-b)<e,`${a} != ${b}`),distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const make=(player,extra={})=>connectedContext({mode:'city',eye:1.8,player,...extra});
let samples=0;
for(const l of BABEL.levels)for(const opened of[false,true]){
 const p={x:-l.r,z:0,y:l.y+1.8},c=make(p,{babelActive:true,catalogueOpened:opened}),path=connectedRoute(c);assert(path.length>5);
 for(const q of path){assert.notEqual(babelSurface(q.x,q.z,q.y),null,'Every library breadcrumb follows an actual existing walking surface');samples++;}
 const end=path.at(-1);if(!opened)assert(distance(end,babelDesk(l.id))<4,'The guided reading approach reaches the real desk interaction radius');
 else if(l.id===4){assert(end.x>11.3);near(end.z,0);near(end.y,-24);}else near(end.y,BABEL.levels[l.id+1].y);
}
assert.equal(make({x:0,z:0,y:1.93},{babelActive:true}),null,'A stale library flag cannot place a route on the surface');
assert.equal(make({x:0,z:0,y:1.8},{escherActive:true}),null,'A stale museum flag cannot claim a surface floor');
for(const p of[{x:136.4,z:115,y:-38.2},{x:174,z:114,y:-38.2},{x:213,z:124,y:-38.2},{x:240,z:115,y:-38.2},{x:260,z:121,y:-38.2},{x:213,z:73,y:-38.2},{x:184.5,z:143,y:depthFloorAt(184.5,143)+1.8},{x:197,z:163,y:-44.2}])for(const goal of['perspective','loop','passage']){
 const path=museumRoute(p,goal);assert(path.length>0,`A real museum route from ${p.x},${p.z} to ${goal}`);
 for(const q of path){assert(canWalkDepth(q.x,q.z),'Museum breadcrumbs must respect cases, walls, doorways and stair');near(q.y,depthFloorAt(q.x,q.z));samples++;}
 const end=path.at(-1),target=goal==='perspective'?{x:213,z:124}:goal==='loop'?{x:197,z:163}:{x:136.4,z:115};assert(distance(end,target)<.01);
}
for(const side of['upper','lower'])for(const done of[false,true]){
 const theta=4.2,q=pointAt(theta,side),p=side==='upper'?{...q,y:q.y+1.8}:{x:q.x-2160,z:q.z-65,y:q.y+1.8},c=make(p,{worldRoute:{side,theta,layer:'spiral'},progress:{perspective:done,loop:done}}),path=connectedRoute(c);assert(path.length>20);
 for(const q of path){const point=side==='lower'?physicalToLower(q):q,local=side==='lower'?{x:point.x+2160,z:point.z+65,y:point.y}:point;assert(gallerySurface(local.x,local.z,local.y,{side})||side==='upper'&&Math.abs(local.y+40)<.01&&tunnelContains(local.x,local.z)||local.y===-48&&local.x>=16&&local.x<=18.4,'Gallery breadcrumbs occupy real treads, a real landing or the real Escher tunnel');samples++;}
}
for(const faculty of[false,true]){
 const p={x:110,z:115,y:-38.2},c=make(p,{worldRoute:{side:'upper',theta:UPPER.spur.theta,layer:'spur'},progress:{perspective:faculty,loop:faculty}}),path=connectedRoute(c);near(path[0].x,p.x);near(path[0].z,p.z);
 assert(faculty?path.at(-1).x<23:path.at(-1).x===135,'The museum return route reverses at the current point, not at the far endpoint');
 for(const q of path){assert(tunnelContains(q.x,q.z));near(q.y,-40);samples++;}
}
for(const[x,z]of[[-52,0],[23,0],[-61,0],[30,30]]){
 const p={x:x-2160,z:z-65,y:1.93},c=make(p,{worldRoute:{side:'lower',theta:0,layer:'floor'}}),path=connectedRoute(c);assert(c.lower);assert(path.length>5);
 for(const q of path){const logical=physicalToLower(q),lx=logical.x+2160,lz=logical.z+65;assert(facultyCanStand(lx,lz,.13));assert(gallerySurface(lx,lz,.13,{side:'lower'})||lx<0&&lx>=-64&&Math.abs(lz)<2.5);samples++;}
 const end=physicalToLower(path.at(-1));assert(end.x+2160>50);assert(end.z+65<0,'The proof route ends at the actual Logic bay, north of east');
}
const shore={x:520,z:134};assert.equal(make({x:-1640,z:69,y:1.93},{shore})?.place,'shore');assert.equal(make({x:-1640,z:69,y:1.93}),null,'No invented shore location when the landscape anchor is unavailable');
// Use all eight real source floors: a side-room exit must cross its real
// partition opening; an upper-floor cue must end at that floor's real lift.
const mathModels=Array.from({length:8},(_,floor)=>buildMathCity(T,{floor})),mathTransform={x:-2240,z:-65,y:.13,scale:1};
for(const model of mathModels)for(const[x,z]of[[8,5],[-8,5],[8,-7.4],[-8,-7.4],[5,7.3],[0,5.3],...(model.floor===0?[[8,9.1],[0,32.8],[16,0]]:[])]){
 assert(model.canStand(x,z),'Source route start must itself be valid');const p={x:mathTransform.x+x,z:mathTransform.z+z,y:.13+model.height+1.8},region={id:'mathematics',floor:model.floor},mathematics={model,transform:mathTransform,floor:model.floor,canStandLocal:model.canStand},c=make(p,{region,mathematics}),path=connectedRoute(c);assert.equal(c.place,model.floor?'lift':'working');assert(path.length>0,`Real source floor ${model.floor} route from ${x},${z}`);
 for(const q of path){const logical=physicalToLower(q),sx=logical.x-mathTransform.x,sz=logical.z-mathTransform.z;assert(model.canStand(sx,sz),'Working-wing markers cannot cross source tables, partitions or windows');near(logical.y,.13+model.height);samples++;}
 const end=physicalToLower(path.at(-1));if(model.floor){near(end.x,mathTransform.x+9.6);near(end.z,mathTransform.z+5);}else{near(end.x,-2218);near(end.z,-65);if(Math.abs(x)>3.5&&Math.abs(x)<12&&z<8)assert(path.some(q=>{const p=physicalToLower(q);return Math.abs(p.x-mathTransform.x)<2.8&&Math.abs(p.z-mathTransform.z)<2;}),'A side room reaches the actual central partition opening before the front door');}
}
assert.equal(make({x:-2232,z:-60,y:1.93},{region:{id:'mathematics',floor:0}}),null,'Missing native source navigation fails closed rather than drawing a rotunda route through the wing');
assert.equal(make({x:-2232,z:-60,y:4.8},{region:{id:'mathematics',floor:1},mathematics:{model:mathModels[1],transform:mathTransform,floor:1}}),null,'A floor-transfer height between levels cannot acquire a working-floor route');

// Compose the actual architectural adapter. Cues end at a real full-floor
// landing, and cannot use the former solid slab or cross the new guards.
const stairs=buildMathWingStairs(T,mathModels,{canvas:()=>null});assert(stairs);
const approaches=mathModels.map(m=>JSON.stringify(m.approaches));let wingSamples=0;
for(const model of mathModels)for(const exitVia of['stairs','lift'])for(const[x,z]of[[8,5],[-8,5],[8,-7.4],[-8,-7.4],[5,7.3],[0,5.3],...(model.floor?[[6.2,6.9]]:[])]){
 const mathematics={model,transform:mathTransform,floor:model.floor,stairs:true,exitVia,canStandLocal:model.canStand},c=make({x:mathTransform.x+x,z:mathTransform.z+z,y:.13+model.height+1.8},{region:{id:'mathematics',floor:model.floor},mathematics}),path=connectedRoute(c);
 assert(path.length>0,`Installed ${exitVia} route on ${model.floor} from ${x},${z}`);
 const walk={x,z,y:model.height+1.8};
 for(const point of path){const q=physicalToLower(point),sx=q.x-mathTransform.x,sz=q.z-mathTransform.z;assert(!inStairOpening(sx,sz));assert(!stairBarrier(sx,sz,model.height));assert(model.canStand(sx,sz));near(q.y,.13+model.height);
  wingStep(walk,sx-walk.x,sz-walk.z,{canStand:model.canStand});near(walk.x,sx);near(walk.z,sz);near(walk.y,model.height+1.8);wingSamples++;
 }
 const end=physicalToLower(path.at(-1));if(model.floor){near(end.x-mathTransform.x,exitVia==='stairs'?6.2:9.6);near(end.z-mathTransform.z,exitVia==='stairs'?6.9:5);if(exitVia==='stairs')assert.equal(stairSurface(walk.x,walk.z,model.height).kind,'floor-landing');}
 else{near(end.x,-2218);near(end.z,-65);}
}
const topMath={model:mathModels[7],transform:mathTransform,floor:7,stairs:true,exitVia:'stairs'};
assert.equal(connectedRoute(make({x:-2240+5.3,z:-65+5,y:29.93},{region:{id:'mathematics',floor:7},mathematics:topMath})).length,0,'No flat-floor cues over the actual open stairwell');
assert.equal(connectedRoute(make({x:-2240,z:-65+5.3,y:29.93},{region:{id:'mathematics',floor:7},mathematics:{...topMath,canStandLocal:(x,z)=>mathModels[7].canStand(x,z)&&Math.hypot(x-6.2,z-6.9)>.8}})).length,0,'A live source/cargo obstruction cannot be bypassed at the landing');
for(let i=0;i<8;i++)assert.equal(JSON.stringify(mathModels[i].approaches),approaches[i]);
for(const lang of['en','de','fa','cs'])for(const state of[{floor:0},{floor:7,stairs:true},{floor:7,stairs:true,exitVia:'lift'},{floor:7,stairs:false}]){const copy=mathWayfindingCopy(lang,state);assert.equal(copy.lang,lang);assert.equal(copy.dir,lang==='fa'?'rtl':'ltr');for(const key of['summary','title','question','route','show','hide','stairs','lift','takeLift'])assert(copy[key].trim().length>3);assert.equal(copy.destination,state.floor===0?'exit':state.stairs&&state.exitVia!=='lift'?'stairs':'lift');}
assert.equal(mathWayfindingCopy('unknown').lang,'en');

class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this.hidden=false;this.open=false;this.textContent='';}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}setAttribute(k,v){this.attributes[k]=String(v);}addEventListener(k,fn){this.events[k]=fn;}
 querySelector(selector){for(const s of selector.split(',')){const match=n=>s.includes('[open]')?n.open&&(s[0]==='#'?n.id===s.slice(1).split('[')[0]:n.tagName===s.split('[')[0]):s[0]==='#'?n.id===s.slice(1).split(':')[0]&&(!s.includes(':not')||!n.hidden):false,visit=n=>{for(const c of n.children){if(match(c))return c;const r=visit(c);if(r)return r;}};const result=visit(this);if(result)return result;}return null;}
}
const body=new Element('body'),book=new Element('dialog');book.id='babel-library-book';body.append(book);globalThis.document={body,hidden:false,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s)};const events={};globalThis.addEventListener=(k,fn)=>events[k]=fn;
globalThis.localStorage=new Proxy({},{get(){throw Error('The guide must not access private storage');}});globalThis.sessionStorage=globalThis.localStorage;
globalThis.removeEventListener=(name,fn)=>{if(events[name]===fn)delete events[name];};
const scene=new T.Scene(),world=new T.Group();scene.add(world);let oldTicks=0,reads=0,clears=0;const M={scene,eye:1.8,mode:'city',player:{x:-11,z:0,y:-22.2,yaw:-Math.PI/2,pitch:.28},clearMovement(){clears++;},city:{update(){oldTicks++;},region:()=>({id:'babel-library'})},babelLibrary:{active:true,openBook(){reads++;book.open=true;return true;}},escherDepth:{active:false,progress:{perspective:false,loop:false}},worldCylinder:{built:{group:world,lowerLandscape:{anchors:{overlook:shore}}},faculty:{targets:[]},route:null}};
const original=M.city.update,api=installConnectedJourney(M,T),before={...M.player},buttons=()=>api.panel.children.flatMap(n=>n.tagName==='div'?n.children:[]).filter(n=>n.tagName==='button'),getButton=part=>buttons().find(n=>n.textContent.includes(part));assert(!api.panel.hidden);assert.equal(api.group.parent,world,'The trail survives the host underground culling owner');assert(!api.panel.open);assert.equal(api.panel.children[0].tabIndex,0,'Controller Menu can select the folded summary');assert.equal(api.group.visible,false);assert.equal(api.interact(),false,'A distant catalogue cannot be opened');assert.equal(reads,0);
api.panel.open=true;api.panel.events.toggle();getButton('Show walking route').onclick();assert(api.group.visible);assert(api.group.children[0].count>5);assert.deepEqual(M.player,before,'Showing directions does not move or turn the visitor');
const desk=babelDesk(4);Object.assign(M.player,{x:desk.x*.85,z:desk.z*.85});api.render(true);assert.equal(getButton('Open this').hidden,false);getButton('Open this').onclick();api.render(true);assert.equal(reads,1);assert(api.catalogueOpened);assert(api.panel.hidden);assert(!api.group.visible);book.open=false;api.render(true);assert(!api.panel.hidden);M.city.update(M.player,1);assert.equal(oldTicks,1);
M.babelLibrary.active=false;Object.assign(M.player,{x:-1640,z:69,y:1.93});api.render(true);assert.equal(api.context.place,'shore');assert(getButton('Show walking route')?.hidden||getButton('Hide walking route')?.hidden);getButton('A reflection').onclick();const answer=api.panel.children.at(-1).children.find(n=>n.tagName==='p');assert(!answer.hidden);assert(answer.textContent.includes('(+1)'));assert.equal(getButton('A reflection').attributes['aria-pressed'],'true');
let groundTransfers=0,delivered=null,region={id:'mathematics',floor:7};globalThis.window={CITY_EXTRAS:{mathModels,transforms:{mathematics:mathTransform},canStand(x,z,{floor,y}){near(y,.13+mathModels[floor].height);return mathModels[floor].canStand(x-mathTransform.x,z-mathTransform.z);}}};M.city.region=()=>region;M.city.targetInfo=data=>({kind:'home-source',data});M.showExtra=info=>{groundTransfers++;delivered=info.data;return true;};Object.assign(M.player,{x:-2240,z:-65+5.3,y:.13+28+1.8});api.render(true);assert.equal(api.context.place,'lift');assert(api.panel.children[0].textContent.includes('Way out'));assert.equal(api.interact(),false,'A distant lift cannot transfer a visitor');
Object.assign(M.player,{x:-2240+9.6,z:-65+5});api.render(true);assert.equal(getButton('Take the lift').hidden,false);assert(api.interact());assert.equal(groundTransfers,1);assert.equal(delivered,mathModels[7].approaches.find(d=>d.mathAction==='floor'&&d.targetFloor===0),'The action delegates exact existing source metadata');
region={id:'mathematics',floor:0};Object.assign(M.player,{x:-2240+8,z:-65+5,y:1.93});api.render(true);assert.equal(api.context.place,'working');assert(api.panel.children[0].textContent.includes('Way out'));assert.equal(api.interact(),false,'Ground-floor route never offers a floor transfer');assert.equal(groundTransfers,1);
Object.defineProperty(M,'visitorMemory',{get(){throw Error('Exit guidance read private memory');}});Object.defineProperty(M.city,'house',{get(){throw Error('Exit guidance inspected private book colours');}});
M.mathWingStairs={built:stairs};region={id:'mathematics',floor:7,inside:true};Object.assign(M.player,{x:-2240,z:-65+5.3,y:29.93});api.render(true);
const byId=id=>buttons().find(n=>n.id===id),route=byId('connected-journey-route'),stairChoice=byId('connected-journey-stairs'),liftChoice=byId('connected-journey-lift');
assert.equal(api.panel.dataset.routeDestination,'stairs');assert(!stairChoice.parent.hidden);if(api.routeVisible)route.onclick();assert(!api.routeVisible);
const still={...M.player},clearBefore=clears;liftChoice.onclick();assert.equal(api.panel.dataset.routeDestination,'lift');assert(!api.routeVisible,'Choosing a destination does not enable the optional trail');stairChoice.onclick();assert.equal(api.panel.dataset.routeDestination,'stairs');assert(!api.routeVisible);assert.deepEqual(M.player,still);assert.equal(clears,clearBefore);assert.equal(groundTransfers,1);
route.onclick();assert(api.routeVisible);assert(api.group.visible);for(const lang of['en','de','fa','cs']){globalThis.CITY_I18N={lang};events['city-language']();assert.equal(api.panel.lang,lang);assert.equal(api.panel.dir,lang==='fa'?'rtl':'ltr');assert.equal(stairChoice.attributes['aria-pressed'],'true');assert.deepEqual(M.player,still);assert.equal(groundTransfers,1);assert.equal(clears,clearBefore);}
region={id:'mathematics-stairs',floor:7,inside:true};M.player.y=27.93;api.render(true);assert(api.panel.hidden,'Between full floors the existing stair status owns guidance');assert(!api.group.visible);assert.equal(api.interact(),false);
region={id:'mathematics',floor:7};Object.assign(M.player,still);M.mathWingStairs.built=null;api.render(true);assert.equal(api.panel.dataset.routeDestination,'lift');assert(stairChoice.parent.hidden,'Missing architectural owner offers only the original source route');M.mathWingStairs.built=stairs;
region={id:'mathematics',floor:0};Object.assign(M.player,{x:-2240,z:-65+5.3,y:1.93});api.render(true);assert.equal(api.panel.dataset.routeDestination,'exit');assert(stairChoice.parent.hidden);assert.equal(api.interact(),false);
let disposedGeometry=0,disposedMaterial=0;api.group.children[0].geometry.addEventListener('dispose',()=>disposedGeometry++);api.group.children[0].material.addEventListener('dispose',()=>disposedMaterial++);api.dispose();api.dispose();assert.equal(M.city.update,original);assert.equal(world.children.length,0);assert.equal(disposedGeometry,1);assert.equal(disposedMaterial,1);assert.equal(M.connectedJourney,undefined);assert.equal(events['city-language'],undefined);stairs.dispose();
mathModels.forEach(m=>m.dispose());
console.log(`PASS connected questions: ${samples} original probes and ${wingSamples} installed exit/landing probes, all eight working floors, four-language stairs/lift choice without movement or private access, real exits/solid windows/guards, original proximity-only lift, tunnel/museum/shore routes, modal pause and owned cleanup`);
