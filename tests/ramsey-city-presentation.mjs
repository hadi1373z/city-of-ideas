// Exercise the real city installer and conversation controls with an audio/DOM
// fixture. Geometry is the actual native study; no browser or private storage.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {installRamseyRoom} from '../src/ramsey-room.js';
const elements=[],events=new Map(),tracks=[];
class Element{
 constructor(tag){this.tagName=tag;this.attributes={};this.children=[];elements.push(this);}
 append(...children){this.children.push(...children);if(this===document.head)for(const child of children)queueMicrotask(()=>child.onload());}
 setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k]??null;}
 remove(){}pause(){}focus(){}
}
const nodes=new Map(['#ramsey-join','#welcome','#map-panel','#ramsey-film-link','.map-directions','#music-toggle'].map(s=>[s,new Element('div')]));
globalThis.document={hidden:false,activeElement:null,createElement:tag=>new Element(tag),querySelector:s=>nodes.get(s)||null};document.head=new Element('head');document.body=new Element('body');
const actor=()=>({group:new T.Group(),animate(){},dispose(){this.group.removeFromParent();}});
globalThis.window={CITY_I18N:{lang:'en'},buildSocratesGuide:actor,buildLiteraryCharacter:actor,academicActorFromGLTF:actor,GLTFLoader:class{async loadAsync(){return {};}}};
globalThis.location={href:'https://example.invalid/city-of-ideas/',search:''};
globalThis.matchMedia=()=>({matches:true});
globalThis.addEventListener=(name,fn)=>events.set(name,fn);globalThis.removeEventListener=()=>{};
const script=JSON.parse(fs.readFileSync(new URL('../src/ramsey-film/assets/conversation.json',import.meta.url)));
globalThis.fetch=async()=>({ok:true,json:async()=>script});
globalThis.Audio=class{constructor(){this.currentTime=0;this.paused=true;tracks.push(this);}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}removeAttribute(){}load(){}};
const origin={x:-2401,y:.13,z:35},previous={origin,group:new T.Group(),targets:[],colliders:[],dispose(){}},player={x:origin.x,y:1.8,z:origin.z+8};
const M={scene:new T.Scene(),player,mode:'city',city:{targets:[],buildingTargets:[previous.group],canStand:()=>true,region:()=>({id:'graveyard'}),update(){},ramseyHouse:previous},ramseyHouse:previous,clearMovement(){},arrive:p=>Object.assign(player,p),pointToward(){}};
const room=installRamseyRoom(M,T);
try{
 room.visit();for(let i=0;i<10&&!room.ready;i++)await new Promise(setImmediate);
 assert(room.ready,'The actual city loader must finish');assert.equal(tracks.length,2);
 Object.assign(player,{x:origin.x-2.5,z:origin.z+1});
 let tick=0;const update=()=>M.city.update(player,++tick,'city'),proof=()=>room.house.study.acquaintanceMap.state;
 update();assert(room.inside);assert.equal(proof().vertices,6);
 room.toggle();await new Promise(setImmediate);assert(room.state.playing);
 tracks[0].currentTime=165;update();
 assert.equal(proof().vertices,5,'The city paper must follow the five-person passage at 2:45');
 assert.equal(proof().edges.length,10);assert(proof().nodes.every(n=>n.id!=='anonymous'));
 assert.equal(proof().edges.filter(e=>e.relation==='knows').length,5);assert.equal(proof().edges.filter(e=>e.relation==='does-not-know').length,5);
 room.pause();update();assert.equal(proof().vertices,5,'Pausing must retain the diagram being discussed');
 const seek=elements.find(e=>e.tagName==='input');seek.value='100';seek.oninput();update();assert.equal(proof().vertices,6,'Seeking backward updates the paper while paused');
 seek.value='165';seek.oninput();update();assert.equal(proof().vertices,5,'Paused seeking into the proof updates the paper');
 seek.value='305';seek.oninput();update();assert.equal(proof().vertices,6);assert.equal(proof().edges.filter(e=>e.relation==='unknown').length,5,'Never invent Anonymous relationships');
 const restart=elements.find(e=>e.tagName==='button'&&e.textContent==='Restart');restart.onclick();update();assert.equal(room.state.time,0);assert.equal(proof().vertices,6);
 seek.value='165';seek.oninput();update();room.toggle();await new Promise(setImmediate);
 Object.assign(player,{x:origin.x,z:origin.z+5});update();assert(!room.inside);assert(!room.state.playing);assert.equal(proof().vertices,5,'Leaving pauses the same proof without resetting it');
 Object.assign(player,{x:origin.x-2.5,z:origin.z+1});update();assert.equal(proof().vertices,5,'Returning preserves the paused proof');
}finally{events.get('pagehide')?.();}
console.log('PASS actual city installer: audio-driven table proof, pause, forward/backward seeking, restart, unknown edges and leave/return continuity');
