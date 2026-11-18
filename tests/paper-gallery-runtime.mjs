import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {installWorldCylinder} from '../src/world-cylinder.js';
import {installPaperGallery} from '../src/paper-gallery.js';
import {installNightObservatory} from '../src/night-observatory.js';
import {NIGHT_OBSERVATORY as OBS,observatoryPoint,observatoryStairY} from '../src/night-observatory-model.js';
import {installPaperMonitors} from '../src/paper-monitors.js';
import {installMathematicalSculptures} from '../src/mathematical-sculptures.js';
import {HISTORIC_PAPERS} from '../src/historic-papers-data.js';
import {PAPER_GALLERY_FLOORS as FLOORS,paperStairPoint,paperStairY} from '../src/paper-gallery-model.js';
import {WORLD_CYLINDER as W} from '../src/world-cylinder-model.js';
const near=(a,b,e=.025)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
const ctx=new Proxy({measureText:t=>({width:String(t).length*12})},{get:(o,k)=>o[k]??(()=>{})});
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this.open=false;this.hidden=false;this.style={};this._text='';}
 set textContent(v){this._text=String(v);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
 replaceChildren(...nodes){this.children=[];this._text='';this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);}addEventListener(k,fn){this.events[k]=fn;}getContext(){return ctx;}focus(){}
 showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}
 matches(s){if(s==='dialog[open]')return this.tagName==='dialog'&&this.open;const visible=s.match(/^#([^:]+):not\(\[hidden\]\)$/);if(visible)return this.id===visible[1]&&!this.hidden;if(s.startsWith('#'))return this.id===s.slice(1);if(s.startsWith('.'))return this.className===s.slice(1);return this.tagName===s;}
 querySelectorAll(s){const out=[],queries=s.split(',').map(s=>s.trim()),visit=n=>{for(const c of n.children){if(queries.some(q=>c.matches(q)))out.push(c);visit(c);}};visit(this);return out;}querySelector(s){return this.querySelectorAll(s)[0]??null;}
}
const body=new Element('body'),reader=new Element('aside');reader.id='reader-panel';reader.hidden=true;body.append(reader);for(const cls of['welcome-secondary','map-directions']){const n=new Element('div');n.className=cls;body.append(n);}
globalThis.document={body,hidden:false,createElement:t=>new Element(t),querySelector:s=>body.querySelector(s),getElementById:id=>body.querySelector('#'+id)};const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,[...(events.get(k)??[]),fn]);globalThis.removeEventListener=()=>{};globalThis.matchMedia=()=>({matches:true});globalThis.window={CITY_GRAVEYARD:{drawActiveMap:()=>true},gallery:{overview(){M.mode='overview';}}};
let privateAccess=0;globalThis.localStorage=new Proxy({},{get(){privateAccess++;throw Error('Private storage must remain untouched');}});globalThis.sessionStorage=globalThis.localStorage;
const scene=new T.Scene();scene.add(new T.DirectionalLight(0xffffff,2),new T.HemisphereLight(0xffffff,0x777777,1));
const M={scene,camera:new T.PerspectiveCamera(),eye:1.8,mode:'city',player:{x:0,y:1.93,z:0,yaw:0,pitch:0},clearMovement(){},setCityMode(){this.mode='city';},cancelActivity(){},pointToward(){},arrive(p){this.mode='city';Object.assign(this.player,p,{y:p.y+this.eye});},extraGround:()=>.13,startExtra:()=>false,showExtra:()=>false,city:{GRAVEYARD:{x:-2360,z:-65,bounds:{minX:-2455,maxX:-2288,minZ:-225,maxZ:90},mathematics:{x:-2240,z:-65},objects:{x:-2360,z:-160}},targets:[],update(){},canStand:()=>true,region:()=>({id:'city',inside:false,title:'City'}),targetInfo:()=>null}};
const world=installWorldCylinder(M,T),gallery=installPaperGallery(M,T),observatory=installNightObservatory(M,T),loader={load(url,ready){const t=new T.Texture();t.image={width:612,height:792};ready(t);return t;}},papers=installPaperMonitors(M,T,{papers:HISTORIC_PAPERS,canvas:()=>({getContext:()=>ctx}),loader}),sculptures=installMathematicalSculptures(M,T);await papers.ready;
assert.equal(papers.pages.length,35);assert.equal(new Set(papers.pages.map(r=>r.paper.id)).size,35);assert.deepEqual(FLOORS.map(f=>papers.pages.filter(r=>r.slot.floor===f.index).length),[8,10,8,9]);for(const r of papers.pages)assert.equal(r.paper.id,r.slot.paperId,'A category binds the genuine paper by identity, independently of catalogue order');
const tick=(dt,input)=>observatory.step(dt,input)||gallery.step(dt,input)||world.step(dt,input);
function drive(x,z,max=3000){for(let i=0;i<max;i++){const d=Math.hypot(x-M.player.x,z-M.player.z);if(d<.015)return;M.player.yaw=Math.atan2(-(x-M.player.x),-(z-M.player.z));assert(tick(Math.min(.04,d/14),{forward:1,boost:true}));}throw Error(`Stuck at ${M.player.x},${M.player.y},${M.player.z} aiming for ${x},${z}`);}
function local(x,z){drive(W.lowerOrigin.x+x,W.lowerOrigin.z+z);}
world.visitLower();local(-40,0);assert(gallery.active);assert.equal(world.route,null,'The connected controller releases the original ground-floor route');
const guide=body.querySelector('#paper-gallery-guide'),summary=guide.querySelector('summary'),close=new Element('button');close.textContent='Close notification';summary.append(close);for(let i=0;i<5;i++)M.city.update(M.player,i,'city');assert(summary.children.includes(close),'Updating guidance preserves the dismissal control');assert(!guide.open);assert(guide.textContent.includes('What makes a definition support a proof?'));
// Go around the open well to the east landing, then follow every real tread.
for(let a=Math.PI;a>0;a-=.025)local(26*Math.cos(a),26*Math.sin(a));local(26,0);
// The two solid sculpture courts leave the floor's radial landing clear.
// Reach the r44.9 front reading circuit on that radial line; a diagonal from
// r26 to an off-axis paper would instead cross a sculpture court at r38.
const visitedPapers=new Set();
function polarWalk(radius,angle){local(radius*Math.cos(angle),radius*Math.sin(angle));}
function arc(radius,from,to){const steps=Math.max(1,Math.ceil(Math.abs(to-from)/.02));for(let i=1;i<=steps;i++)polarWalk(radius,from+(to-from)*i/steps);}
function visitEveryPaper(f){
 const rows=papers.pages.filter(r=>r.slot.floor===f.index).sort((a,b)=>a.slot.angle-b.slot.angle);polarWalk(44.9,f.angle);let angle=f.angle;
 for(const row of rows){arc(44.9,angle,row.slot.angle);angle=row.slot.angle;near(M.player.y,f.y+M.eye);assert.equal(gallery.place.floor,f.index);assert(papers.open(row.paper.id),'Reach the original first page through the physical reading aisle: '+row.paper.id);visitedPapers.add(row.paper.id);const dialog=body.querySelector('#paper-monitor-reader');assert(dialog.open);assert.equal(papers.current,row.paper.id);const before={...M.player};assert(tick(.1,{forward:1}));assert.deepEqual(M.player,before,'Reading a paper pauses physical movement');dialog.close();
  if(f.index>0){const feet=M.player.y-M.eye;M.player.y=feet-4+M.eye;assert.equal(papers.open(row.paper.id),false,'A lower-floor visitor cannot activate this first page through the slab');M.player.y=feet+M.eye;}
 }
 for(const row of [...rows].reverse().slice(1)){arc(44.9,angle,row.slot.angle);angle=row.slot.angle;}arc(44.9,angle,f.angle);polarWalk(26,f.angle);near(M.player.y,f.y+M.eye);
}
let theta=0;function follow(end){const direction=Math.sign(end-theta);for(let t=theta+direction*.012;direction>0?t<end:t>end;t+=direction*.012){const p=paperStairPoint(t);local(p.x,p.z);let actual=Math.atan2(-(M.player.z-W.lowerOrigin.z),M.player.x-W.lowerOrigin.x);if(actual<0)actual+=2*Math.PI;near(M.player.y,paperStairY(actual)+M.eye,1e-7);}const p=paperStairPoint(end);local(p.x,p.z);assert(Math.abs(M.player.y-p.y-M.eye)<=.125001,'The final supported tread is at most one rise from the landing');theta=end;}
visitEveryPaper(FLOORS[0]);local(16,0);
for(const f of FLOORS.slice(1)){
 follow(f.theta);local(26*Math.cos(f.angle),26*Math.sin(f.angle));near(M.player.y,f.y+M.eye);M.city.update(M.player,f.index,'city');assert.equal(gallery.place.floor,f.index);assert(gallery.place.title.includes(f.name));
 visitEveryPaper(f);local(16*Math.cos(f.angle),16*Math.sin(f.angle));
}
assert.deepEqual([...visitedPapers].sort(),HISTORIC_PAPERS.map(p=>p.id).sort(),'All35 original monitors are physically reachable, not just the first item on each floor');
// Keep the production controller order while crossing the new shared endpoint.
// These are ordinary held movement inputs; no visit action jumps to the dome.
let observatoryTheta=0;
function followObservatory(end){const direction=Math.sign(end-observatoryTheta);for(let t=observatoryTheta+direction*.012;direction>0?t<end:t>end;t+=direction*.012){const q=observatoryPoint(t);local(q.x,q.z);assert(observatory.active,'The observatory owns its actual rising treads');assert(!gallery.active,'The paper controller must not recapture the continued stair');let actual=Math.atan2(-(M.player.z-W.lowerOrigin.z),M.player.x-W.lowerOrigin.x);if(actual<0)actual+=2*Math.PI;const landing=M.player.observatoryLayer==='landing';near(M.player.y,(landing?OBS.deckY:observatoryStairY(actual))+M.eye,1e-7);}const q=observatoryPoint(end);local(q.x,q.z);assert(Math.abs(M.player.y-q.y-M.eye)<=.125001,'The final supported observatory tread reaches the next real landing');observatoryTheta=end;}
followObservatory(2*Math.PI+.08);const crossing={x:6.8*Math.cos(.08),z:-6.8*Math.sin(.08)};local(crossing.x,crossing.z);local(3,-.5);near(M.player.y,OBS.deckY+M.eye);assert(observatory.nearTelescope&&observatory.canStudy,'Walking across the inner bridge reaches the actual study station');assert(observatory.lookAtDirection({x:.2,y:.8,z:-.5}));assert(M.player.pitch>.5);assert(!gallery.active);assert.equal(world.route,null);
// Return along the same inner bridge, post-turn landing and all eighty treads.
local(crossing.x,crossing.z);const postTurn=observatoryPoint(2*Math.PI+.08);local(postTurn.x,postTurn.z);followObservatory(0);local(26,0);assert(!observatory.active,'Leaving the base approach releases the observatory exactly once');assert(gallery.active,'The highest reading floor resumes ordinary paper-gallery movement');assert.equal(gallery.place.floor,3);near(M.player.y,12.13+M.eye);local(16,0);
for(const f of [...FLOORS].reverse().slice(1)){follow(f.theta);local(26*Math.cos(f.angle),26*Math.sin(f.angle));near(M.player.y,f.y+M.eye);local(16*Math.cos(f.angle),16*Math.sin(f.angle));}
near(M.player.y,1.93);local(26,0);for(let a=.025;a<Math.PI;a+=.025)local(26*Math.cos(a),26*Math.sin(a));local(-66,0);assert(!gallery.active);assert.equal(world.route,null);local(-64,26);local(-80,26);local(-80,12);assert(M.player.z>W.lowerOrigin.z+11.9,'The held walk continues beyond both finite deck edges to the genuine working-wing entrance');near(M.player.y,1.93);
local(-80,26);local(-64,26);local(-64,0);local(-52,0);assert(gallery.active,'The real ground-floor return is captured without an edge trap');
// Ground east landing can still descend the original route instead of bouncing.
for(let a=Math.PI;a>0;a-=.025)local(26*Math.cos(a),26*Math.sin(a));local(16,0);const lowerStep={x:16*Math.cos(.18),z:16*Math.sin(.18)};local(lowerStep.x,lowerStep.z);assert.equal(world.route?.side,'lower');assert(!gallery.active);assert(M.player.y<1.93,'The original through-gallery first steps remain descending');
assert(M.startExtra('paper-gallery:computation'));near(M.player.y,8.13+M.eye);assert.equal(gallery.place.floor,2);assert.equal(M.startExtra('paper-gallery:missing'),false);M.city.update(M.player,20,'city');assert.equal(gallery.built.lamps.children.filter(g=>g.visible).length,1,'Only the current collection lights are active');
M.arrive({x:0,z:0,y:.13});assert(!gallery.active);assert(!observatory.active);assert.equal(privateAccess,0);sculptures.dispose();papers.dispose();observatory.dispose();gallery.dispose();for(const fn of events.get('pagehide')??[])fn();console.log('PASS paper gallery runtime: real four-level ascent with solid sculpture courts, reversible r44.9 front reading circuit to all35 original pages, all eighty observatory treads and inner bridge to telescope, reversible shared landing without recapture, stable dismissal, id-bound readers/modal pause, complete paper descent and west-connector exit/return, original downward route, focused lighting and private-data-safe cleanup.');
