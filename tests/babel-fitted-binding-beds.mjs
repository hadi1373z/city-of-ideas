import assert from 'node:assert/strict';
import {buildBabelLibrary} from '../src/babel-library-scene.js';
import {BABEL,stairs} from '../src/babel-library-model.js';
import {fitBabelRadialMouths} from '../src/babel-mouth-clearance.js';
import {mountBabelSpokes} from '../src/babel-spoke-mounts.js';
import {fitBabelPerimeter} from '../src/babel-vault-perimeter.js';
import {fitBabelEntryReveals} from '../src/babel-entry-reveals.js';
import {seatBabelEntryLamps} from '../src/babel-entry-bookcases.js';
import {mountBabelTerraceGlobes} from '../src/babel-globe-mounts.js';
import {seatBabelCompleteTerraceBindings} from '../src/babel-terrace-bindings.js';
import {measureBindingBeds,validateBabelBindingLifecycle} from './babel-terrace-bindings.mjs';
import {babelGuardSnapshot} from './babel-entry-guards.mjs';

export function measureFittedBindingBeds(T,bed){
 const fresh={...bed,frames:bed.frames.filter(f=>f.fitted)},contacts=measureBindingBeds(T,fresh),cases=new Map();
 for(const f of fresh.frames){const raw=f.shelf.raw,p=new T.Vector3().setFromMatrixPosition(raw),key=f.level+':'+Math.atan2(p.z,p.x).toFixed(7);if(!cases.has(key))cases.set(key,{level:f.level,rows:0,bindings:0,minLaneMargin:Infinity,minWidth:Infinity,maxWidth:0,maxBottomSpread:0});const c=cases.get(key),m=new T.Matrix4();bed.mesh.getMatrixAt(f.part,m);const s=new T.Vector3();m.decompose(new T.Vector3(),new T.Quaternion(),s);c.rows++;c.bindings+=f.books.length;c.minWidth=Math.min(c.minWidth,s.x);c.maxWidth=Math.max(c.maxWidth,s.x);const normal=new T.Vector3(-Math.sin(stairs[f.level-1].a),0,Math.cos(stairs[f.level-1].a));for(const x of[-.5,.5])for(const z of[-.5,.5])c.minLaneMargin=Math.min(c.minLaneMargin,Math.abs(new T.Vector3(x,0,z).applyMatrix4(m).dot(normal)));const ys=f.books.map(b=>new T.Vector3(0,-.5,0).applyMatrix4(b.m).y);c.maxBottomSpread=Math.max(c.maxBottomSpread,Math.max(...ys)-Math.min(...ys));}
 return{...contacts,cases:[...cases.values()],parts:fresh.frames.map(f=>f.part)};
}
export function validateFittedBindingBeds(T){
 const G={...T},resources=new Map(),buffers=new Map();
 for(const k of Object.keys(T))if(/Geometry$|Material$|Texture$/.test(k)&&typeof T[k]==='function')G[k]=class extends T[k]{constructor(...a){super(...a);resources.set(this,0);this.addEventListener('dispose',()=>resources.set(this,resources.get(this)+1));}};
 G.InstancedMesh=class extends T.InstancedMesh{constructor(...a){super(...a);buffers.set(this,0);this.addEventListener('dispose',()=>buffers.set(this,buffers.get(this)+1));}};
 const drawing=new T.Texture();let borrowed=0;drawing.addEventListener('dispose',()=>borrowed++);
 const b=buildBabelLibrary(G,{drawing,canvas:()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})})}),scene=new T.Scene();scene.add(b.group);b.lamps.visible=true;const source=[];b.group.traverse(o=>source.push(o));const snapshot=list=>babelGuardSnapshot(T,{updateMatrixWorld:()=>b.group.updateMatrixWorld(true),traverse:f=>list.forEach(f)}),raw=snapshot(source),targets=[...b.targets];
 const adapters=[fitBabelRadialMouths(G,b),mountBabelSpokes(G,b),fitBabelPerimeter(G,b),fitBabelEntryReveals(G,b),seatBabelEntryLamps(G,b)];adapters.push(mountBabelTerraceGlobes(G,b,adapters[0]));
 const preceding=[];b.group.traverse(o=>{if(!adapters[0].bindings.some(v=>v.source===o))preceding.push(o);});const beforeSix=snapshot(preceding),sourceCounts=[resources.size,buffers.size],locked={...G};
 for(const k of Object.keys(T))if(/Geometry$|Material$|Texture$|Light$/.test(k)&&typeof T[k]==='function')locked[k]=class{constructor(){throw Error('Unexpected render resource '+k);}};
 const saved=['document','localStorage','sessionStorage','fetch'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]);let bed;
 try{for(const[k]of saved)Object.defineProperty(globalThis,k,{configurable:true,get(){throw Error('Private/DOM access '+k);}});bed=seatBabelCompleteTerraceBindings(locked,b,adapters[0]);bed.sync();}finally{for(const[k,d]of saved)d?Object.defineProperty(globalThis,k,d):delete globalThis[k];}
 assert(bed.group?.visible);assert.equal(bed.parts.length,1830);assert.deepEqual(BABEL.levels.map(l=>bed.frames.filter(f=>f.fitted&&f.level===l.id).length),[0,5,5,10,0]);assert.deepEqual([resources.size,buffers.size],[sourceCounts[0],sourceCounts[1]+1]);
 const fitted=measureFittedBindingBeds(T,bed),full=measureBindingBeds(T,bed);
 assert.deepEqual(fitted.failures,[]);assert.equal(fitted.shelfCores,20);assert.equal(fitted.bindingCores,200);assert.equal(fitted.bottomCorners,80);assert.equal(fitted.boxCorners,160);assert.equal(fitted.prismPairs,1920);assert.deepEqual(fitted.parts,Array.from({length:20},(_,i)=>1810+i));assert.equal(fitted.cases.length,4);assert(fitted.cases.every(c=>c.rows===5&&c.bindings===50&&c.minLaneMargin>=1.725&&c.maxBottomSpread<2e-6));assert.deepEqual(full.failures,[]);assert.equal(full.bindingCores,18300);assert.equal(full.shelfCores,1830);assert.equal(full.prismPairs,175680);
 const display=[...preceding,bed.group,bed.mesh],prior=snapshot(display.map(o=>{if(o!==bed.mesh)return o;const original=Object.create(o);original.count=1810;return original;})),installed=snapshot(display);
 assert.equal(raw.hash,'7b21ef65631174a885fd0333480d32cab44193e1afc96a3c595d55e21e3bde66');assert.equal(beforeSix.hash,'3a06700f3902dea7051535bf29ecf6fc787bd374259582c99ba28077649f1399');assert.deepEqual(prior,{hash:'5df9b9b387cf302d90aa45969f536113d81b05047eed336ab3d7a855460003ff',meshes:70,instances:43739});assert.equal(installed.meshes,70);assert.equal(installed.instances,43759);assert.equal(installed.hash,'5863d78522441471998ac02660defe0f41a2faf9dd1566c51a734cf87888c590');assert.deepEqual(snapshot(source),raw);assert.deepEqual(b.targets,targets);
 b.dispose();for(const a of [...adapters,bed]){a.sync();a.dispose();a.dispose();}assert.equal(resources.size,86);assert.equal(buffers.size,38);assert([...resources.values()].every(n=>n===1));assert([...buffers.values()].every(n=>n===1));assert.equal(borrowed,0);drawing.dispose();
 return{fitted,full,raw,prior,installed,resources:86,buffers:38,releasedOnce:true,borrowedDisposals:0};
}
export function validateFittedBindingLifecycle(T){return validateBabelBindingLifecycle(T,seatBabelCompleteTerraceBindings);}
