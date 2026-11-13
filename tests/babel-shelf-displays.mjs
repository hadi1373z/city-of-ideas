import assert from 'node:assert/strict';
import {buildBabelLibrary} from '../src/babel-library-scene.js';
import {BABEL,stairs} from '../src/babel-library-model.js';
import {fitBabelRadialMouths} from '../src/babel-mouth-clearance.js';
import {mountBabelSpokes} from '../src/babel-spoke-mounts.js';
import {fitBabelPerimeter} from '../src/babel-vault-perimeter.js';
import {fitBabelEntryReveals} from '../src/babel-entry-reveals.js';
import {seatBabelEntryLamps} from '../src/babel-entry-bookcases.js';
import {mountBabelTerraceGlobes} from '../src/babel-globe-mounts.js';
import {seatBabelShelfSupports} from '../src/babel-terrace-bindings.js';
import {validateBabelBindingLifecycle} from './babel-terrace-bindings.mjs';
import {babelGuardSnapshot} from './babel-entry-guards.mjs';
function build(T,Drawing=T){const drawing=new Drawing.Texture(),b=buildBabelLibrary(T,{drawing,canvas:()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})})}),scene=new T.Scene();scene.add(b.group);b.lamps.visible=true;const source=[];b.group.traverse(o=>source.push(o));const adapters=[fitBabelRadialMouths(T,b),mountBabelSpokes(T,b),fitBabelPerimeter(T,b),fitBabelEntryReveals(T,b),seatBabelEntryLamps(T,b)];adapters.push(mountBabelTerraceGlobes(T,b,adapters[0]));return{b,scene,source,adapters,drawing};}
export function measureShelfDisplays(T,built,mouths,BABEL){
 const root=built.group,near=(a,b,e=2e-4)=>Math.abs(a-b)<e;root.updateMatrixWorld(true);const rows=[];
 for(const source of root.children.filter(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry')){const owner=mouths.bindings.find(b=>b.source===source)?.clone||source;for(let id=0;id<source.count;id++){const raw=new T.Matrix4(),m=new T.Matrix4(),p=new T.Vector3(),s=new T.Vector3();source.getMatrixAt(id,raw);owner.getMatrixAt(id,m);raw.decompose(p,new T.Quaternion(),s);rows.push({source,owner,id,raw,m,p,s,changed:!raw.equals(m)});}}
 const details=[],levels=[],failures=[];let minGap=Infinity,maxGap=-Infinity,maxSeatError=0,minCoverShelfRecess=Infinity,minPageCoverRecess=Infinity,coverSamples=0,pageSamples=0;
 const foot=(m,x,z)=>new T.Vector3(x,-.5,z).applyMatrix4(m);
 for(const l of BABEL.levels){
  const match=(r,size,y)=>size.every((v,i)=>near(r.s.toArray()[i],v))&&near(r.p.y,l.y+y)&&near(Math.hypot(r.p.x,r.p.z),l.r+4);
  const covers=rows.filter(r=>match(r,[.9,.11,.75],3.68)),pages=rows.filter(r=>match(r,[.78,.045,.69],3.765)),shelves=rows.filter(r=>near(r.s.y,.11)&&near(r.s.z,1)&&near(r.p.y,l.y+3.57)&&near(Math.hypot(r.p.x,r.p.z),l.r+4));
  if(covers.length!==pages.length)failures.push({kind:'cover-page-count',level:l.id});
  for(const cover of covers){const centred=r=>near(r.p.x,cover.p.x)&&near(r.p.z,cover.p.z),pageSet=pages.filter(centred),shelfSet=shelves.filter(centred);if(pageSet.length!==1||shelfSet.length!==1){failures.push({kind:'display-owner',level:l.id,id:cover.id});continue;}const page=pageSet[0],shelf=shelfSet[0],coverSize=new T.Vector3(),pageSize=new T.Vector3(),shelfSize=new T.Vector3(),cp=new T.Vector3(),pp=new T.Vector3(),sp=new T.Vector3();cover.m.decompose(cp,new T.Quaternion(),coverSize);page.m.decompose(pp,new T.Quaternion(),pageSize);shelf.m.decompose(sp,new T.Quaternion(),shelfSize);const bottom=pp.y-pageSize.y/2,top=cp.y+coverSize.y/2,gap=bottom-top,seat=cp.y-coverSize.y/2-(sp.y+shelfSize.y/2);
   minGap=Math.min(minGap,gap);maxGap=Math.max(maxGap,gap);maxSeatError=Math.max(maxSeatError,Math.abs(seat));
   for(const [upper,lower,size,kind]of [[cover,shelf,shelfSize,'cover'],[page,cover,coverSize,'page']])for(const x of[-.5,0,.5])for(const z of[-.5,0,.5]){const p=foot(upper.m,x,z).applyMatrix4(lower.m.clone().invert());if(Math.abs(p.x)>.500005||Math.abs(p.z)>.500005)failures.push({kind:'full-foot-projection',level:l.id,id:upper.id,x,z});const inset=Math.min((.5-Math.abs(p.x))*size.x,(.5-Math.abs(p.z))*size.z);if(kind==='cover'){coverSamples++;minCoverShelfRecess=Math.min(minCoverShelfRecess,inset);}else{pageSamples++;minPageCoverRecess=Math.min(minPageCoverRecess,inset);}}
   details.push({level:l.id,coverSource:root.children.indexOf(cover.source),pageSource:root.children.indexOf(page.source),coverId:cover.id,pageId:page.id,shelfId:shelf.id,coverChanged:cover.changed,pageChanged:page.changed,shelfChanged:shelf.changed,coverCopied:cover.owner!==cover.source,pageCopied:page.owner!==page.source,gap,seat,point:cp.toArray()});
  }levels.push({level:l.id,covers:covers.length,pages:pages.length});
 }
 return{levels,displays:details.length,minGap,maxGap,maxSeatError,minCoverShelfRecess,minPageCoverRecess,coverSamples,pageSamples,changedCovers:details.filter(d=>d.coverChanged).length,changedPages:details.filter(d=>d.pageChanged).length,changedShelves:details.filter(d=>d.shelfChanged).length,copiedCovers:details.filter(d=>d.coverCopied).length,copiedPages:details.filter(d=>d.pageCopied).length,failures,details};
}

export function measureDisplaySeats(T,bed){
 const inside=(m,p)=>p.clone().applyMatrix4(m.clone().invert()).toArray().every(v=>Math.abs(v)<.500005),core=(a,b,p)=>[-.0005,.0005].every(x=>[-.0005,.0005].every(y=>[-.0005,.0005].every(z=>{const q=p.clone().add(new T.Vector3(x,y,z));return inside(a,q)&&inside(b,q);}))),failures=[],shapes=[];
 let coverCores=0,pageCores=0,bottomCorners=0,upperCorners=0,minCoverEngagement=Infinity,maxCoverEngagement=-Infinity,minPageEngagement=Infinity,maxPageEngagement=-Infinity,minWalkingMargin=Infinity,prismPairs=0;
 for(const f of bed.displayFrames){
  const m=new T.Matrix4();bed.mesh.getMatrixAt(f.part,m);const p=new T.Vector3(),s=new T.Vector3();m.decompose(p,new T.Quaternion(),s);const bottom=p.y-s.y/2,top=p.y+s.y/2,ce=f.top-bottom,pe=top-f.bottom;
  minCoverEngagement=Math.min(minCoverEngagement,ce);maxCoverEngagement=Math.max(maxCoverEngagement,ce);minPageEngagement=Math.min(minPageEngagement,pe);maxPageEngagement=Math.max(maxPageEngagement,pe);
  if(core(f.cover.m,m,new T.Vector3(f.page.p.x,f.top-.001,f.page.p.z)))coverCores++;else failures.push({kind:'cover-core',part:f.part});
  if(core(f.page.m,m,new T.Vector3(f.page.p.x,f.bottom+.001,f.page.p.z)))pageCores++;else failures.push({kind:'page-core',part:f.part});
  const poly=[];for(const x of[-.5,.5])for(const z of[-.5,.5]){const a=new T.Vector3(x,-.5,z).applyMatrix4(m),b=new T.Vector3(x,.5,z).applyMatrix4(m);bottomCorners++;upperCorners++;if(!inside(f.cover.m,a)||!inside(f.page.m,b))failures.push({kind:'seat-corners',part:f.part});poly.push(a);}
  const ordered=[poly[0],poly[1],poly[3],poly[2]],l=BABEL.levels[f.level];for(let i=0;i<4;i++){const a=ordered[i],b=ordered[(i+1)%4],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,-(a.x*dx+a.z*dz)/(dx*dx+dz*dz)));minWalkingMargin=Math.min(minWalkingMargin,Math.hypot(a.x+dx*t,a.z+dz*t)-(l.r+3.25));}
  shapes.push({part:f.part,poly:ordered,bottom,top,axes:[new T.Vector3().setFromMatrixColumn(m,0).normalize(),new T.Vector3().setFromMatrixColumn(m,2).normalize()]});
 }
 for(const flight of stairs)for(let i=0;i<24;i++){const outer=flight.outer-i*10/24,inner=flight.outer-(i+1)*10/24,feet=flight.top-(i+1)/6,axes=[new T.Vector3(Math.cos(flight.a),0,Math.sin(flight.a)),new T.Vector3(-Math.sin(flight.a),0,Math.cos(flight.a))],poly=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z])=>axes[0].clone().multiplyScalar(x<0?inner:outer).addScaledVector(axes[1],z*flight.width/2));for(const b of shapes){prismPairs++;if(b.top<=feet+.08||b.bottom>=feet+2.10)continue;let separated=false;for(const axis of [...axes,...b.axes]){const a=poly.map(p=>p.dot(axis)),c=b.poly.map(p=>p.dot(axis));if(Math.min(...a)>=Math.max(...c)-1e-6||Math.min(...c)>=Math.max(...a)-1e-6){separated=true;break;}}if(!separated)failures.push({kind:'standing-prism',part:b.part,flight:flight.i,step:i});}}
 return{coverCores,pageCores,bottomCorners,upperCorners,minCoverEngagement,maxCoverEngagement,minPageEngagement,maxPageEngagement,minWalkingMargin,prismPairs,parts:bed.displayFrames.map(f=>f.part),failures};
}
export function validateShelfDisplays(T){
 const G={...T},resources=new Map(),buffers=new Map();for(const k of Object.keys(T))if(/Geometry$|Material$|Texture$/.test(k)&&typeof T[k]==='function')G[k]=class extends T[k]{constructor(...a){super(...a);resources.set(this,0);this.addEventListener('dispose',()=>resources.set(this,resources.get(this)+1));}};G.InstancedMesh=class extends T.InstancedMesh{constructor(...a){super(...a);buffers.set(this,0);this.addEventListener('dispose',()=>buffers.set(this,buffers.get(this)+1));}};
 const {b,adapters,source,drawing}=build(G,T),root=b.group,snapshot=list=>babelGuardSnapshot(T,{updateMatrixWorld:()=>root.updateMatrixWorld(true),traverse:f=>list.forEach(f)}),raw=snapshot(source),targets=[...b.targets],oldCounts=[resources.size,buffers.size];let borrowed=0;drawing.addEventListener('dispose',()=>borrowed++);
 const original=measureShelfDisplays(T,b,adapters[0],BABEL);assert.deepEqual(original.failures,[]);assert.deepEqual(original.levels.map(l=>l.covers),[14,11,9,6,3]);assert.equal(original.displays,43);assert(original.minGap>.00749&&original.maxGap<.00751);assert(original.maxSeatError<1e-6);assert.equal(original.coverSamples,387);assert.equal(original.pageSamples,387);assert.equal(original.changedCovers+original.changedPages+original.changedShelves,0);assert.equal(original.copiedCovers,43);assert.equal(original.copiedPages,0);
 const globals=['document','localStorage','sessionStorage','fetch'],saved=globals.map(k=>Object.getOwnPropertyDescriptor(globalThis,k)),locked={...G};for(const k of Object.keys(T))if(/Geometry$|Material$|Texture$|Light$/.test(k)&&typeof T[k]==='function')locked[k]=class{constructor(){throw Error('New render resource '+k);}};let bed;try{globals.forEach(k=>Object.defineProperty(globalThis,k,{configurable:true,get(){throw Error('Private/DOM access '+k);}}));bed=seatBabelShelfSupports(locked,b,adapters[0]);bed.sync();}finally{globals.forEach((k,i)=>saved[i]?Object.defineProperty(globalThis,k,saved[i]):delete globalThis[k]);}
 assert(bed.group?.visible);assert.equal(bed.parts.length,1873);assert.equal(bed.frames.length,1830);assert.equal(bed.displayFrames.length,43);assert.deepEqual([resources.size,buffers.size],[oldCounts[0],oldCounts[1]+1]);const contacts=measureDisplaySeats(T,bed);assert.deepEqual(contacts.failures,[]);assert.equal(contacts.coverCores,43);assert.equal(contacts.pageCores,43);assert.equal(contacts.bottomCorners,172);assert.equal(contacts.upperCorners,172);assert.equal(contacts.prismPairs,4128);assert(contacts.minCoverEngagement>.00199&&contacts.maxCoverEngagement<.00201&&contacts.minPageEngagement>.00199&&contacts.maxPageEngagement<.00201);assert(contacts.minWalkingMargin>.38);assert.deepEqual(contacts.parts,Array.from({length:43},(_,i)=>1830+i));
 const display=[];root.traverse(o=>{if(!adapters[0].bindings.some(v=>v.source===o))display.push(o);});const prior=snapshot(display.map(o=>{if(o!==bed.mesh)return o;const p=Object.create(o);p.count=1830;return p;})),installed=snapshot(display);
 assert.equal(raw.hash,'7b21ef65631174a885fd0333480d32cab44193e1afc96a3c595d55e21e3bde66');assert.deepEqual(prior,{hash:'5863d78522441471998ac02660defe0f41a2faf9dd1566c51a734cf87888c590',meshes:70,instances:43759});assert.equal(installed.meshes,70);assert.equal(installed.instances,43802);assert.equal(installed.hash,'0a98c5232984da700fff39e5150a6b581522c94cfe57e2ea185d433474de98bd');assert.deepEqual(snapshot(source),raw);assert.deepEqual(b.targets,targets);
 b.dispose();for(const a of [...adapters,bed]){a.sync();a.dispose();a.dispose();}assert.equal(resources.size,86);assert.equal(buffers.size,38);assert([...resources.values()].every(n=>n===1));assert([...buffers.values()].every(n=>n===1));assert.equal(borrowed,0);drawing.dispose();const{details,failures,...negative}=original;return{negative,contacts,raw,prior,installed,resources:86,buffers:38,releasedOnce:true,borrowedDisposals:0};
}
export function validateDisplayLifecycle(T){
 const inherited=validateBabelBindingLifecycle(T,seatBabelShelfSupports),cases=[
 ['page owner detached',f=>{const o=f.bed.displayFrames[0].page.source;o.removeFromParent();return()=>f.b.group.add(o);}],
 ['page buffer replaced',f=>{const o=f.bed.displayFrames[0].page.source,v=o.instanceMatrix;o.instanceMatrix=new Proxy({},{get(){throw Error('Foreign page buffer inspected');}});return()=>o.instanceMatrix=v;}],
 ['page material replaced',f=>{const o=f.bed.displayFrames[0].page.source,v=o.material;o.material={};return()=>o.material=v;}],
 ['page count changed',f=>{const o=f.bed.displayFrames[0].page.source;o.count--;return()=>o.count++;}],
 ['page pose changed',f=>{const o=f.bed.displayFrames[0].page.source;o.position.x=1;return()=>o.position.x=0;}]
 ];for(const[name,mutate]of cases){const f=build(T);f.bed=seatBabelShelfSupports(T,f.b,f.adapters[0]);assert(f.bed.group);let release=0;f.bed.mesh.addEventListener('dispose',()=>release++);const restore=mutate(f);f.bed.sync();assert(f.bed.disposed,name);assert.equal(release,1);restore();f.bed.dispose();f.b.dispose();f.drawing.dispose();assert.equal(release,1);}
 const f=build(T),bed=seatBabelShelfSupports(T,f.b,f.adapters[0]),page=bed.displayFrames[0].page.source;page.visible=false;bed.sync();assert.equal(bed.group.visible,false);page.visible=true;bed.sync();assert.equal(bed.group.visible,true);assert(!bed.disposed);f.b.dispose();f.drawing.dispose();
 return{programs:inherited.programs+cases.length+1,inherited:inherited.programs,pageCases:cases.map(c=>c[0]),visibilityPreserved:true};
}
