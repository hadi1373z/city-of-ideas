import assert from 'node:assert/strict';
import {buildBabelLibrary} from '../src/babel-library-scene.js';
import {BABEL,stairs} from '../src/babel-library-model.js';
import {fitBabelRadialMouths} from '../src/babel-mouth-clearance.js';
import {mountBabelSpokes} from '../src/babel-spoke-mounts.js';
import {fitBabelPerimeter} from '../src/babel-vault-perimeter.js';
import {fitBabelEntryReveals} from '../src/babel-entry-reveals.js';
import {seatBabelEntryLamps} from '../src/babel-entry-bookcases.js';
import {mountBabelTerraceGlobes} from '../src/babel-globe-mounts.js';
import {seatBabelTerraceBindings} from '../src/babel-terrace-bindings.js';
import {babelGuardSnapshot} from './babel-entry-guards.mjs';
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})});
function build(T,Drawing=T){const drawing=new Drawing.Texture(),b=buildBabelLibrary(T,{canvas,drawing}),scene=new T.Scene();scene.add(b.group);b.lamps.visible=true;const source=[];b.group.traverse(o=>source.push(o));const adapters=[fitBabelRadialMouths(T,b),mountBabelSpokes(T,b),fitBabelPerimeter(T,b),fitBabelEntryReveals(T,b),seatBabelEntryLamps(T,b)];adapters.push(mountBabelTerraceGlobes(T,b,adapters[0]));return{b,scene,adapters,source,drawing};}
export function measureTerraceBindings(T,built,mouths,BABEL){
 const root=built.group,near=(a,b,e=2e-4)=>Math.abs(a-b)<e;root.updateMatrixWorld(true);
 // Public source shapes identify decorative volumes; no colour or private data is read.
 const sources=root.children.filter(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'),rows=[];
 for(const source of sources){const copy=mouths.bindings.find(b=>b.source===source)?.clone||source;for(let id=0;id<source.count;id++){const raw=new T.Matrix4(),m=new T.Matrix4(),p=new T.Vector3(),s=new T.Vector3();source.getMatrixAt(id,raw);copy.getMatrixAt(id,m);raw.decompose(p,new T.Quaternion(),s);rows.push({source,owner:copy,id,raw,m,p,s,changed:!raw.equals(m)});}}
 const position=(m,x,y,z)=>new T.Vector3(x,y,z).applyMatrix4(m),world=(r)=>r.owner.matrixWorld.clone().multiply(r.m),details=[],levels=[],failures=[];
 let minGap=Infinity,maxGap=-Infinity,footCorners=0,surfaceSamples=0,minEdgeRecess=Infinity,unchanged=0,fitted=0,minWalkingMargin=Infinity;
 for(const l of BABEL.levels){
  const nominalCount=Math.ceil(Math.PI*2*(l.r+4)/2.8),arc=(l.r+4)*Math.PI*2/nominalCount,width=(arc-.43)/10*.83;
  const shelves=rows.filter(r=>near(r.s.y,.11)&&near(r.s.z,1)&&near(Math.hypot(r.p.x,r.p.z),l.r+4)&&near((r.p.y-l.y-.12)/.69,Math.round((r.p.y-l.y-.12)/.69))),books=rows.filter(r=>near(r.s.x,width)&&near(r.s.z,.64)&&[.39,.437,.484,.531,.578].some(h=>near(r.s.y,h))&&near((r.p.y-r.s.y/2-l.y-.23)/.69,Math.round((r.p.y-r.s.y/2-l.y-.23)/.69))&&r.p.y>l.y&&r.p.y<l.y+3.7);
  let localMin=Infinity,localMax=-Infinity,localFitted=0;const rowCounts=[0,0,0,0,0],shelfGroups=new Set();
  for(const book of books){
   const row=Math.round((book.p.y-book.s.y/2-l.y-.23)/.69);if(row<0||row>4){failures.push({kind:'binding-row',level:l.id,id:book.id,row});continue;}rowCounts[row]++;
   const matches=shelves.filter(s=>near(s.p.y,l.y+.12+row*.69)&&new T.Vector3().setFromMatrixColumn(s.raw,0).normalize().dot(new T.Vector3().setFromMatrixColumn(book.raw,0).normalize())>1-1e-10);
   if(matches.length!==1){failures.push({kind:'shelf-owner',level:l.id,id:book.id,matches:matches.length});continue;}const shelf=matches[0],bm=world(book),sm=world(shelf),inverse=sm.clone().invert(),g=book.source.geometry,sg=shelf.source.geometry;let bottom=Infinity,top=-Infinity;
   for(const r of [book,shelf]){if(Math.abs(r.m.elements[1])+Math.abs(r.m.elements[4])+Math.abs(r.m.elements[6])+Math.abs(r.m.elements[9])>1e-7)failures.push({kind:'tilted-profile',level:l.id,id:r.id});}
   for(let i=0;i<g.attributes.position.count;i++)bottom=Math.min(bottom,new T.Vector3().fromBufferAttribute(g.attributes.position,i).applyMatrix4(bm).y);
   for(let i=0;i<sg.attributes.position.count;i++)top=Math.max(top,new T.Vector3().fromBufferAttribute(sg.attributes.position,i).applyMatrix4(sm).y);
   const gap=bottom-top;minGap=Math.min(minGap,gap);maxGap=Math.max(maxGap,gap);localMin=Math.min(localMin,gap);localMax=Math.max(localMax,gap);
   let sampleCount=0,localRecess=Infinity;
   for(const x of[-.5,0,.5])for(const z of[-.5,0,.5]){const p=position(bm,x,-.5,z),q=p.clone().applyMatrix4(inverse);q.y=.5;const onShelf=q.clone().applyMatrix4(sm);if(Math.abs(q.x)>.500005||Math.abs(q.z)>.500005||Math.abs(onShelf.y-top)>1e-5||Math.abs(p.y-onShelf.y-gap)>1e-6)failures.push({kind:'foot-projection',level:l.id,id:book.id,x,z});const recess=Math.min((.5-Math.abs(q.x))*new T.Vector3().setFromMatrixColumn(sm,0).length(),(.5-Math.abs(q.z))*new T.Vector3().setFromMatrixColumn(sm,2).length());localRecess=Math.min(localRecess,recess);surfaceSamples++;sampleCount++;if(x&&z)footCorners++;}
   minEdgeRecess=Math.min(minEdgeRecess,localRecess);const isFitted=book.changed||shelf.changed;if(isFitted){fitted++;localFitted++;}else unchanged++;
   const poly=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([x,z])=>position(book.m,x,-.5,z));for(let i=0;i<4;i++){const a=poly[i],b=poly[(i+1)%4],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,-(a.x*dx+a.z*dz)/(dx*dx+dz*dz)));minWalkingMargin=Math.min(minWalkingMargin,Math.hypot(a.x+dx*t,a.z+dz*t)-(l.r+3.25));}
   shelfGroups.add(shelf.id);details.push({level:l.id,row,sourceChild:root.children.indexOf(book.source),id:book.id,shelfId:shelf.id,fitted:isFitted,gap,bottom,top,edgeRecess:localRecess,samples:sampleCount,point:position(bm,0,-.5,0).toArray()});
  }
  levels.push({level:l.id,bindings:books.length,rows:rowCounts,shelfRows:shelfGroups.size,unchanged:books.length-localFitted,fitted:localFitted,minGap:localMin,maxGap:localMax});
 }
 return {levels,bindings:details.length,unchanged,fitted,minGap,maxGap,missingSeats:details.filter(d=>d.gap>1e-5).length,footCorners,surfaceSamples,minEdgeRecess,minWalkingMargin,failures,details};
}

export function validateBabelTerraceBindings(T){
 const G={...T},resources=new Map(),buffers=new Map();
 for(const k of Object.keys(T))if(/Geometry$|Material$|Texture$/.test(k)&&typeof T[k]==='function')G[k]=class extends T[k]{constructor(...a){super(...a);resources.set(this,0);this.addEventListener('dispose',()=>resources.set(this,resources.get(this)+1));}};
 G.InstancedMesh=class extends T.InstancedMesh{constructor(...a){super(...a);buffers.set(this,0);this.addEventListener('dispose',()=>buffers.set(this,buffers.get(this)+1));}};
 const {b,adapters,source,drawing}=build(G,T),root=b.group;let borrowed=0;drawing.addEventListener('dispose',()=>borrowed++);
 const raw=babelGuardSnapshot(T,{updateMatrixWorld:()=>root.updateMatrixWorld(true),traverse:f=>source.forEach(f)});
 const before=babelGuardSnapshot(T,display(T,b,adapters[0])),targets=[...b.targets],oldCounts=[resources.size,buffers.size];
 const historical=measureTerraceBindings(T,b,adapters[0],BABEL);
 assert.deepEqual(historical.failures,[]);assert.deepEqual(historical.levels.map(v=>v.bindings),[5950,4800,3700,2550,1300]);
 assert.equal(historical.bindings,18300);assert.equal(historical.unchanged,18100);assert.equal(historical.fitted,200);assert.equal(historical.missingSeats,18300);
 assert(historical.minGap>.054998&&historical.maxGap<.055002);assert.equal(historical.surfaceSamples,164700);assert.equal(historical.footCorners,73200);assert(historical.minEdgeRecess>.1462);
 const saved=['document','localStorage','sessionStorage','fetch'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]),locked={...G};
 for(const k of Object.keys(T))if(/Geometry$|Material$|Texture$|Light$/.test(k)&&typeof T[k]==='function')locked[k]=class{constructor(){throw Error('New render resource '+k);}};
 let bed;try{for(const[k]of saved)Object.defineProperty(globalThis,k,{configurable:true,get(){throw Error('Private/DOM access '+k);}});bed=seatBabelTerraceBindings(locked,b,adapters[0]);bed.sync();}finally{for(const[k,d]of saved)d?Object.defineProperty(globalThis,k,d):delete globalThis[k];}
 assert(bed.group?.visible);assert.equal(bed.parts.length,1810);assert.deepEqual(BABEL.levels.map(l=>bed.frames.filter(f=>f.level===l.id).length),[595,475,365,245,130]);
 assert.deepEqual([resources.size,buffers.size],[oldCounts[0],oldCounts[1]+1]);
 assert.equal(seatBabelTerraceBindings(locked,b,adapters[0]).group,null);
 const contacts=measureBindingBeds(T,bed);
 assert.equal(contacts.failures.length,0);assert.equal(contacts.shelfCores,1810);assert.equal(contacts.bindingCores,18100);assert.equal(contacts.bottomCorners,7240);assert.equal(contacts.boxCorners,14480);assert.equal(contacts.prismPairs,173760);
 assert(contacts.minWalkingMargin>.4499);assert(contacts.minShelfEngagement>.00999&&contacts.maxShelfEngagement<.01001);assert(contacts.minBindingEngagement>.00999&&contacts.maxBindingEngagement<.01001);
 assert.deepEqual(babelGuardSnapshot(T,{updateMatrixWorld:()=>root.updateMatrixWorld(true),traverse:f=>source.forEach(f)}),raw);assert.deepEqual(babelGuardSnapshot(T,display(T,b,adapters[0],bed.group)),before);assert.deepEqual(b.targets,targets);
 const installed=babelGuardSnapshot(T,display(T,b,adapters[0]));
 assert.equal(raw.hash,'7b21ef65631174a885fd0333480d32cab44193e1afc96a3c595d55e21e3bde66');
 assert.equal(before.hash,'3a06700f3902dea7051535bf29ecf6fc787bd374259582c99ba28077649f1399');
 assert.equal(installed.meshes,70);assert.equal(installed.instances,43739);
 assert.equal(installed.hash,'5df9b9b387cf302d90aa45969f536113d81b05047eed336ab3d7a855460003ff');
 b.dispose();for(const a of [...adapters,bed]){a.sync();a.dispose();a.dispose();}assert.equal(resources.size,86);assert.equal(buffers.size,38);assert([...resources.values()].every(n=>n===1));assert([...buffers.values()].every(n=>n===1));
 assert.equal(borrowed,0);drawing.dispose();const{details,failures,...negative}=historical;return{negative,contacts,raw,before,installed,resources:86,buffers:38,releasedOnce:true,borrowedDisposals:0};
}
function display(T,b,mouths,omit=null){return{updateMatrixWorld:()=>b.group.updateMatrixWorld(true),traverse:fn=>b.group.traverse(o=>{if(mouths.bindings.some(v=>v.source===o)||o===omit||o.parent===omit)return;fn(o);})};}
export function measureBindingBeds(T,bed){
 const inside=(m,p)=>p.clone().applyMatrix4(m.clone().invert()).toArray().every(v=>Math.abs(v)<.500005),failures=[];
 const core=(a,b,p)=>[-.003,.003].every(x=>[-.003,.003].every(y=>[-.003,.003].every(z=>{const q=p.clone().add(new T.Vector3(x,y,z));return inside(a,q)&&inside(b,q);})));
 let shelfCores=0,bindingCores=0,bottomCorners=0,boxCorners=0,prismPairs=0,minWalkingMargin=Infinity,minShelfEngagement=Infinity,maxShelfEngagement=-Infinity,minBindingEngagement=Infinity,maxBindingEngagement=-Infinity;
 const shapes=[];
 for(const f of bed.frames){
  const m=new T.Matrix4();bed.mesh.getMatrixAt(f.part,m);
  const l=BABEL.levels[f.level],pos=new T.Vector3(),size=new T.Vector3();m.decompose(pos,new T.Quaternion(),size);
  const bottom=pos.y-size.y/2,top=pos.y+size.y/2,shelfTop=f.shelf.p.y+f.shelf.s.y/2,embed=shelfTop-bottom;
  minShelfEngagement=Math.min(minShelfEngagement,embed);maxShelfEngagement=Math.max(maxShelfEngagement,embed);
  const p=f.shelf.p.clone();p.y=shelfTop-.005;if(core(f.shelf.m,m,p))shelfCores++;else failures.push({kind:'shelf-core',part:f.part});
  for(const b of f.books){const p=new T.Vector3(0,-.5,0).applyMatrix4(b.m),overlap=top-p.y;minBindingEngagement=Math.min(minBindingEngagement,overlap);maxBindingEngagement=Math.max(maxBindingEngagement,overlap);p.y+=.005;if(core(b.m,m,p))bindingCores++;else failures.push({kind:'binding-core',part:f.part,id:b.id});}
  const poly=[];for(const x of[-.5,.5])for(const z of[-.5,.5]){
   const q=new T.Vector3(x,-.5,z).applyMatrix4(m);if(!inside(f.shelf.m,q))failures.push({kind:'bed-foot',part:f.part});bottomCorners++;
  }
  for(const x of[-.5,.5])for(const y of[-.5,.5])for(const z of[-.5,.5]){
   const q=new T.Vector3(x,y,z).applyMatrix4(m),s=q.clone().applyMatrix4(f.shelf.m.clone().invert());boxCorners++;
   if(Math.abs(s.x)>.500001||Math.abs(s.z)>.500001)failures.push({kind:'shelf-plan-envelope',part:f.part});if(y===-.5)poly.push(q);
  }
  // The closest point can lie within an edge, not at a corner.
  const ordered=[poly[0],poly[1],poly[3],poly[2]];for(let i=0;i<4;i++){const a=ordered[i],b=ordered[(i+1)%4],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,-(a.x*dx+a.z*dz)/(dx*dx+dz*dz)));minWalkingMargin=Math.min(minWalkingMargin,Math.hypot(a.x+dx*t,a.z+dz*t)-(l.r+3.25));}
  shapes.push({part:f.part,poly:ordered,bottom,top,axes:[new T.Vector3().setFromMatrixColumn(m,0).normalize(),new T.Vector3().setFromMatrixColumn(m,2).normalize()]});
 }
 // Exact vertical-box SAT uses the four horizontal axes plus vertical overlap.
 // Every original full-width tread standing prism participates, including landings.
 for(const s of stairs)for(let i=0;i<24;i++){const outer=s.outer-i*10/24,inner=s.outer-(i+1)*10/24,feet=s.top-(i+1)/6,axes=[new T.Vector3(Math.cos(s.a),0,Math.sin(s.a)),new T.Vector3(-Math.sin(s.a),0,Math.cos(s.a))],poly=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z])=>axes[0].clone().multiplyScalar(x<0?inner:outer).addScaledVector(axes[1],z*s.width/2));
  for(const b of shapes){prismPairs++;if(b.top<=feet+.08||b.bottom>=feet+2.10)continue;let separated=false;for(const axis of [...axes,...b.axes]){const aa=poly.map(p=>p.dot(axis)),bb=b.poly.map(p=>p.dot(axis));if(Math.min(...aa)>=Math.max(...bb)-1e-6||Math.min(...bb)>=Math.max(...aa)-1e-6){separated=true;break;}}if(!separated)failures.push({kind:'standing-prism',part:b.part,flight:s.i,step:i});}
 }
 return{shelfCores,bindingCores,bottomCorners,boxCorners,prismPairs,minWalkingMargin,minShelfEngagement,maxShelfEngagement,minBindingEngagement,maxBindingEngagement,failures};
}
export function validateBabelBindingLifecycle(T){
 const mutations=[
  ['detached root',f=>{f.b.group.removeFromParent();return()=>f.scene.add(f.b.group);}],
  ['foreign built API',f=>{const old=f.b.group;f.b.group=new Proxy({},{get(){throw Error('Foreign group inspected');}});return()=>f.b.group=old;}],
  ['foreign mouth API',f=>{const old=f.adapters[0].group;f.adapters[0].group=new Proxy({},{get(){throw Error('Foreign fitting inspected');}});return()=>f.adapters[0].group=old;}],
  ['detached fitting',f=>{const g=f.adapters[0].group;g.removeFromParent();return()=>f.b.group.add(g);}],
  ['detached owned group',f=>{f.bed.group.removeFromParent();return()=>{};}],
  ['detached owned mesh',f=>{f.bed.mesh.removeFromParent();return()=>{};}],
  ['source geometry identity',f=>{const o=f.bed.frames[0].shelf.binding.source,v=o.geometry;o.geometry={};return()=>o.geometry=v;}],
  ['copy material identity',f=>{const o=f.bed.frames[0].shelf.binding.clone,v=o.material;o.material={};return()=>o.material=v;}],
  ['copy foreign buffer',f=>{const o=f.bed.frames[0].shelf.binding.clone,v=o.instanceMatrix;o.instanceMatrix=new Proxy({},{get(){throw Error('Foreign buffer inspected');}});return()=>o.instanceMatrix=v;}],
  ['source buffer version',f=>{f.bed.frames[0].shelf.binding.source.instanceMatrix.needsUpdate=true;return()=>{};}],
  ['copy buffer version',f=>{f.bed.frames[0].shelf.binding.clone.instanceMatrix.needsUpdate=true;return()=>{};}],
  ['copy count',f=>{const o=f.bed.frames[0].shelf.binding.clone;o.count--;return()=>o.count++;}],
  ['source local pose',f=>{const o=f.bed.frames[0].shelf.binding.source;o.position.x=1;return()=>o.position.x=0;}],
  ['owned pose',f=>{f.bed.group.position.x=1;return()=>{};}],
  ['owned count',f=>{f.bed.mesh.count--;return()=>{};}],
  ['owned foreign buffer',f=>{f.bed.mesh.instanceMatrix=new Proxy({},{get(){throw Error('Foreign owned buffer inspected');}});return()=>{};}],
  ['position version',f=>{f.bed.mesh.geometry.attributes.position.needsUpdate=true;return()=>{};}],
  ['index version',f=>{f.bed.mesh.geometry.index.needsUpdate=true;return()=>{};}],
  ['copy foreign array',f=>{const a=f.bed.frames[0].shelf.binding.clone.instanceMatrix,v=a.array;a.array=new Proxy({},{get(){throw Error('Foreign array inspected');}});return()=>a.array=v;}]
 ];
 const results=[];
 for(const[name,mutate]of mutations){const f=build(T);f.bed=seatBabelTerraceBindings(T,f.b,f.adapters[0]);assert(f.bed.group);let released=0;f.bed.mesh.addEventListener('dispose',()=>released++);const restore=mutate(f);f.bed.sync();assert(f.bed.disposed,name);assert.equal(released,1,name);restore();f.bed.dispose();f.b.dispose();for(const a of f.adapters)a.dispose();f.drawing.dispose();assert.equal(released,1,name);results.push(name);}
 const f=build(T),source=f.adapters[0].bindings[0].source;const original=source.count;source.count--;const rejected=seatBabelTerraceBindings(T,f.b,f.adapters[0]);source.count=original;assert.equal(rejected.group,null);f.b.dispose();f.drawing.dispose();
 const guarded={get group(){throw Error('Private replacement getter');}};assert.equal(seatBabelTerraceBindings(T,guarded,guarded).group,null);
 const privateGroup=new Proxy({},{get(){throw Error('Private root inspected');}});assert.equal(seatBabelTerraceBindings(T,{group:privateGroup},{group:privateGroup}).group,null);
 return{programs:results.length+3,cases:results,invalidProfileRejected:true,foreignGetterDenied:true};
}
