import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import * as THREE from '../src/city-source-assets/home-tools/vendor/three.module.js';
class Node{
 constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.style={};this.listeners={};this.hidden=false;}
 append(...nodes){for(const n of nodes){n.parentElement=this;this.children.push(n);}}
 addEventListener(name,callback){this.listeners[name]=callback;}
 get lastElementChild(){return this.children.at(-1);}
 setAttribute(name,value){this[name]=value;}
 getAttribute(name){return this[name]??null;}
}
const source=readFileSync(new URL('../src/city-idea-link.js',import.meta.url),'utf8');
function fixture(arrival=false){
 const body=new Node('body'),welcome=new Node('div'),handlers={},timers=[],location={href:'index.html',search:arrival?'?from=idea-room':''};let blocked=false;
 const document={body,activeElement:body,createElement:tag=>new Node(tag),querySelector:s=>s==='.welcome-secondary'?welcome:s==='#world canvas'?null:s.startsWith('dialog[')&&blocked?{}:null};
 const main={scene:new THREE.Scene(),mode:'city',player:{x:0,z:121},city:{canStand:()=>true},clearMovement(){this.cleared=true;},quickStart(){this.started=true;},arrive(p){this.player=p;}};
 const window={CITY_MAIN:main,THREE,CITY_I18N:{lang:'en'}};
 vm.runInNewContext(source,{window,document,location,URLSearchParams,localStorage:{getItem:()=>JSON.stringify({thought:'A private test thought',elapsedMs:5000})},setInterval:f=>(timers.push(f),timers.length),clearInterval(){},addEventListener:(name,f)=>handlers[name]=f});
 return{window,main,body,welcome,handlers,location,tick:()=>timers.forEach(f=>f()),block:value=>blocked=value,button:body.children.find(n=>n.id==='idea-room-portal'),document};
}
const f=fixture();assert.equal(f.button.parentElement,f.body,'The door action is outside the filtered city toolbar');assert.equal(f.button.style.minHeight,'44px');assert.equal(f.button.hidden,false);
f.main.player.x=80;f.tick();assert(f.button.hidden);f.main.player.x=0;f.main.mode='overview';f.tick();assert(f.button.hidden);f.main.mode='city';f.tick();assert.equal(f.button.hidden,false);
f.block(true);f.tick();assert(f.button.hidden,'An open panel suppresses the doorway');f.button.listeners.click();assert.equal(f.location.href,'index.html');
f.block(false);f.tick();f.document.activeElement={tagName:'TEXTAREA'};let stopped=false;const key={code:'KeyE',repeat:false,preventDefault(){stopped=true;},stopImmediatePropagation(){}};f.handlers.keydown(key);assert.equal(f.location.href,'index.html');
f.document.activeElement=f.body;f.handlers.keydown({...key,repeat:true});assert.equal(f.location.href,'index.html');f.handlers.keydown(key);assert.equal(f.location.href,'idea-room.html');assert(f.main.cleared&&stopped);
f.window.CITY_I18N.lang='de';f.tick();assert.equal(f.button.textContent,'Vorgestellten Raum betreten');f.window.CITY_I18N.lang='fa';f.tick();assert.equal(f.button.textContent,'ورود به اتاق خیالی');
const click=fixture();click.button.listeners.click();assert.equal(click.location.href,'idea-room.html','Click/touch returns to the room');
const arrival=fixture(true);assert(arrival.main.started);assert.deepEqual({...arrival.main.player},{x:0,z:121,yaw:0});arrival.tick();assert.equal(arrival.button.hidden,false);assert(arrival.body.children.find(n=>n.id==='idea-room-arrival').children[0].textContent.includes('A private test thought'));
console.log('PASS: visible nearby return action outside the filtered toolbar, touch size, arrival, modal/editing guards, keyboard and click navigation.');
