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
import {seatBabelBookRing} from '../src/babel-book-ring.js';
import {babelGuardSnapshot} from './babel-entry-guards.mjs';
function build(T,Drawing=T){const drawing=new Drawing.Texture(),b=buildBabelLibrary(T,{drawing,canvas:()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})})}),scene=new T.Scene();scene.add(b.group);b.lamps.visible=true;const source=[];b.group.traverse(o=>source.push(o));const adapters=[fitBabelRadialMouths(T,b),mountBabelSpokes(T,b),fitBabelPerimeter(T,b),fitBabelEntryReveals(T,b),seatBabelEntryLamps(T,b)];adapters.push(mountBabelTerraceGlobes(T,b,adapters[0]),seatBabelShelfSupports(T,b,adapters[0]));return{b,scene,source,adapters,drawing};}
export function measureBookRing(T,built,mouths,BABEL){
 const root=built.group,near=(a,b,e=2e-4)=>Math.abs(a-b)<e,failures=[];root.updateMatrixWorld(true);
 const rows=[];for(const source of root.children.filter(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry')){const owner=mouths.bindings.find(v=>v.source===source)?.clone||source;for(let id=0;id<source.count;id++){const raw=new T.Matrix4(),m=new T.Matrix4(),p=new T.Vector3(),s=new T.Vector3();source.getMatrixAt(id,raw);owner.getMatrixAt(id,m);m.decompose(p,new T.Quaternion(),s);rows.push({source,owner,id,raw,m,p,s,changed:!m.equals(raw)});}}
 const foot=root.getObjectByName('Circular footing beneath the upright book ring'),base=root.getObjectByName('Book-well base inside the through-gallery shaft');
 if(!foot||!base)throw Error('Actual book-ring footing/base missing');
 const area=p=>p.reduce((n,a,i)=>{const b=p[(i+1)%p.length];return n+a.x*b.z-b.x*a.z;},0)/2;
 const clip=(subject,boundary)=>{let out=subject;const sign=Math.sign(area(boundary));for(let i=0;i<boundary.length&&out.length;i++){const a=boundary[i],b=boundary[(i+1)%boundary.length],distance=p=>sign*((b.x-a.x)*(p.z-a.z)-(b.z-a.z)*(p.x-a.x)),input=out;out=[];let previous=input[input.length-1],dp=distance(previous);for(const current of input){const dc=distance(current),pi=dp>=-1e-11,ci=dc>=-1e-11;if(pi!==ci){const t=dp/(dp-dc);out.push({x:previous.x+(current.x-previous.x)*t,z:previous.z+(current.z-previous.z)*t});}if(ci)out.push(current);previous=current;dp=dc;}}return out;};
 const triangles=o=>{const pos=o.geometry.attributes.position,ix=o.geometry.index,a=[];for(let i=0;i<(ix?.count||pos.count);i+=3){const p=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(pos,ix?ix.getX(i+j):i+j).applyMatrix4(o.matrixWorld));if(Math.abs(area(p))>1e-12)a.push(p);}return a;},feet=triangles(foot),floor=triangles(base),footY=feet[0][0].y,baseY=floor[0][0].y;
 const footprint=m=>[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([x,z])=>new T.Vector3(x,-.5,z).applyMatrix4(m));
 const coverage=(poly,tris)=>{const x0=Math.min(...poly.map(v=>v.x)),x1=Math.max(...poly.map(v=>v.x)),z0=Math.min(...poly.map(v=>v.z)),z1=Math.max(...poly.map(v=>v.z));let covered=0;for(const t of tris){if(Math.max(...t.map(v=>v.x))<x0||Math.min(...t.map(v=>v.x))>x1||Math.max(...t.map(v=>v.z))<z0||Math.min(...t.map(v=>v.z))>z1)continue;covered+=Math.abs(area(clip(poly,t)));}return covered/Math.abs(area(poly));};
 const inside=(m,p)=>p.clone().applyMatrix4(m.clone().invert()).toArray().every(v=>Math.abs(v)<.500005);
 const core=(a,b,p,h=.0005)=>[-h,h].every(x=>[-h,h].every(y=>[-h,h].every(z=>{const q=p.clone().add(new T.Vector3(x,y,z));return inside(a,q)&&inside(b,q);})));
 const pages=rows.filter(v=>near(Math.hypot(v.p.x,v.p.z),3.65)&&v.s.x>.10&&v.s.x<.19&&v.s.y>1.16&&v.s.y<1.97&&v.s.z>.68&&v.s.z<.83);
 const details=[];let footCorners=0,footRays=0,footRayHits=0,minCoverage=Infinity,maxCoverage=-Infinity,minCoverGap=Infinity,maxCoverGap=-Infinity,minPageGap=Infinity,maxPageGap=-Infinity,minSideGap=Infinity,maxSideGap=-Infinity,maxSpinePlaneError=0,minSpineArea=Infinity,maxSpineArea=-Infinity,coverSpineCores=0,stampCores=0,changed=0,copiedParts=0,originalParts=0,minFootBaseCoverage=Infinity;
 for(const t of feet)minFootBaseCoverage=Math.min(minFootBaseCoverage,coverage(t,floor));
 for(const page of pages){
  const w=page.s.x+.052,h=page.s.y+.085,d=page.s.z+.055,tangent=new T.Vector3().setFromMatrixColumn(page.m,0).normalize(),radial=new T.Vector3().setFromMatrixColumn(page.m,2).normalize(),centre=page.p.clone();
  const at=(t,r,y=centre.y)=>new T.Vector3(centre.x,0,centre.z).addScaledVector(tangent,t).addScaledVector(radial,r).setY(y);
  const match=(size,point)=>rows.filter(v=>size.every((n,i)=>near(v.s.toArray()[i],n))&&v.p.distanceTo(point)<2e-4);
  const covers=[-1,1].map(sign=>match([.024,h+.025,d+.045],at(sign*(w/2-.012),0))),spines=match([w,h+.025,.055],at(0,d/2)),stamps=[.22,.76].map(f=>match([w*.76,.025,.010],at(0,d/2+.030,BABEL.base+.10+h*f)));
  if(covers.some(a=>a.length!==1)||spines.length!==1||stamps.some(a=>a.length!==1)){failures.push({kind:'ring-parts',page:page.id,counts:[...covers.map(a=>a.length),spines.length,...stamps.map(a=>a.length)]});continue;}
  const sides=covers.map(a=>a[0]),spine=spines[0],marks=stamps.map(a=>a[0]),pieces=[page,...sides,spine,...marks];
  changed+=pieces.filter(v=>v.changed).length;copiedParts+=pieces.filter(v=>v.owner!==v.source).length;originalParts+=pieces.filter(v=>v.owner===v.source).length;
  const pg=centre.y-page.s.y/2-footY;minPageGap=Math.min(minPageGap,pg);maxPageGap=Math.max(maxPageGap,pg);
  const footGaps=[];for(const part of [...sides,spine]){const poly=footprint(part.m),ratio=coverage(poly,feet),gap=poly[0].y-footY;footGaps.push(gap);minCoverage=Math.min(minCoverage,ratio);maxCoverage=Math.max(maxCoverage,ratio);minCoverGap=Math.min(minCoverGap,gap);maxCoverGap=Math.max(maxCoverGap,gap);for(const p of poly){footCorners++;const ray=new T.Raycaster(new T.Vector3(p.x,p.y+.005,p.z),new T.Vector3(0,-1,0),0,.05);footRays++;if(ray.intersectObject(foot,false).length)footRayHits++;}}
  const pageBack=at(0,page.s.z/2),spineInner=new T.Vector3(0,0,-.5).applyMatrix4(spine.m),error=Math.abs(pageBack.clone().sub(spineInner).dot(radial));maxSpinePlaneError=Math.max(maxSpinePlaneError,error);const contactArea=page.s.x*page.s.y;minSpineArea=Math.min(minSpineArea,contactArea);maxSpineArea=Math.max(maxSpineArea,contactArea);
  // Every corner of the complete page back face lies in the retained spine face.
  for(const x of[-.5,.5])for(const y of[-.5,.5]){const p=new T.Vector3(x,y,.5).applyMatrix4(page.m);if(!inside(spine.m,p))failures.push({kind:'page-spine-face',page:page.id});}
  for(const side of sides){const delta=side.p.clone().sub(centre).dot(tangent),sg=Math.abs(delta)-side.s.x/2-page.s.x/2;minSideGap=Math.min(minSideGap,sg);maxSideGap=Math.max(maxSideGap,sg);if(core(side.m,spine.m,side.p.clone().addScaledVector(radial,d/2)))coverSpineCores++;else failures.push({kind:'cover-spine-core',page:page.id});}
  for(const mark of marks){const p=mark.p.clone().addScaledVector(radial,-.00375);if(core(mark.m,spine.m,p))stampCores++;else failures.push({kind:'stamp-spine-core',page:page.id});}
  details.push({page,covers:sides,spine,stamps:marks,w,h,d,footGaps,pageGap:pg,tangent,radial});
 }
 return{pages:pages.length,parts:pages.length*6,footY,baseY,footBaseGap:footY-baseY,footTriangles:feet.length,baseTriangles:floor.length,minFootBaseCoverage,footCorners,footRays,footRayHits,minCoverage,maxCoverage,minCoverGap,maxCoverGap,minPageGap,maxPageGap,minSideGap,maxSideGap,maxSpinePlaneError,minSpineArea,maxSpineArea,coverSpineCores,stampCores,changed,copiedParts,originalParts,failures,details,foot,base};
}
export function measureRingSupports(T,ring,BABEL,stairs){
 const inside=(m,p)=>p.clone().applyMatrix4(m.clone().invert()).toArray().every(v=>Math.abs(v)<.500005),
  core=(a,b,p)=>[-.0005,.0005].every(x=>[-.0005,.0005].every(y=>[-.0005,.0005].every(z=>{const q=p.clone().add(new T.Vector3(x,y,z));return inside(a,q)&&inside(b,q);}))),failures=[],shapes=[];
 let volumeCores=0,padFootRays=0,padBaseRays=0,padCorners=0,minEmbed=Infinity,maxEmbed=-Infinity,minFootEmbed=Infinity,maxFootEmbed=-Infinity,minInnerRadius=Infinity,maxOuterRadius=-Infinity,minBelowWalkingFeet=Infinity;
 const area=p=>p.reduce((n,a,i)=>{const b=p[(i+1)%p.length];return n+a.x*b.z-b.x*a.z;},0)/2,clip=(subject,boundary)=>{let out=subject;const sign=Math.sign(area(boundary));for(let i=0;i<boundary.length&&out.length;i++){const a=boundary[i],b=boundary[(i+1)%boundary.length],d=p=>sign*((b.x-a.x)*(p.z-a.z)-(b.z-a.z)*(p.x-a.x)),input=out;out=[];let p=input.at(-1),dp=d(p);for(const q of input){const dq=d(q);if((dp>=-1e-11)!==(dq>=-1e-11)){const t=dp/(dp-dq);out.push({x:p.x+(q.x-p.x)*t,z:p.z+(q.z-p.z)*t});}if(dq>=-1e-11)out.push(q);p=q;dp=dq;}}return out;};
 const pos=ring.foot.geometry.attributes.position,ix=ring.foot.geometry.index,footTriangles=[];for(let i=0;i<ix.count;i+=3)footTriangles.push([0,1,2].map(j=>new T.Vector3().fromBufferAttribute(pos,ix.getX(i+j))));
 let minPadCoverage=Infinity,maxPadCoverage=-Infinity;
 for(const f of ring.frames){
  const m=new T.Matrix4(),p=new T.Vector3(),s=new T.Vector3();ring.mesh.getMatrixAt(f.part,m);m.decompose(p,new T.Quaternion(),s);
  const bottom=p.y-s.y/2,top=p.y+s.y/2,poly=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([x,z])=>new T.Vector3(x,0,z).applyMatrix4(m));
  const embed=ring.footY-bottom;minFootEmbed=Math.min(minFootEmbed,embed);maxFootEmbed=Math.max(maxFootEmbed,embed);minBelowWalkingFeet=Math.min(minBelowWalkingFeet,BABEL.levels[4].y-top);
  for(const v of[...f.covers,f.spine]){const y=v.p.y-v.s.y/2,e=top-y;minEmbed=Math.min(minEmbed,e);maxEmbed=Math.max(maxEmbed,e);if(core(v.m,m,v.p.clone().setY(y+.001)))volumeCores++;else failures.push({kind:'pad-volume-core',part:f.part});}
  let covered=0;for(const t of footTriangles)covered+=Math.abs(area(clip(poly,t)));const ratio=covered/Math.abs(area(poly));minPadCoverage=Math.min(minPadCoverage,ratio);maxPadCoverage=Math.max(maxPadCoverage,ratio);
  for(const v of poly){padCorners++;maxOuterRadius=Math.max(maxOuterRadius,Math.hypot(v.x,v.z));if(new T.Raycaster(new T.Vector3(v.x,ring.footY+.005,v.z),new T.Vector3(0,-1,0),0,.01).intersectObject(ring.foot,false).length)padFootRays++;else failures.push({kind:'pad-foot-corner',part:f.part});if(new T.Raycaster(new T.Vector3(v.x,ring.baseY+.005,v.z),new T.Vector3(0,-1,0),0,.01).intersectObject(ring.base,false).length)padBaseRays++;else failures.push({kind:'pad-base-corner',part:f.part});}
  for(let i=0;i<4;i++){const a=poly[i],b=poly[(i+1)%4],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,-(a.x*dx+a.z*dz)/(dx*dx+dz*dz)));minInnerRadius=Math.min(minInnerRadius,Math.hypot(a.x+dx*t,a.z+dz*t));}
  shapes.push({part:f.part,poly,bottom,top,axes:[new T.Vector3().setFromMatrixColumn(m,0).normalize(),new T.Vector3().setFromMatrixColumn(m,2).normalize()]});
 }
 let wallVertices=0,wallTopVertices=0,wallBaseVertices=0,wallSourceEdges=0,wallBaseRays=0,maxWallPlaneError=0,minWallNormal=Infinity;
 const wp=ring.geometry.attributes.position,wn=ring.geometry.attributes.normal;
 for(let i=0;i<wp.count;i++){wallVertices++;const p=new T.Vector3().fromBufferAttribute(wp,i),r=Math.hypot(p.x,p.z),top=Math.abs(p.y-ring.footY)<1e-6,bottom=Math.abs(p.y-ring.baseY)<1e-6;if(top)wallTopVertices++;else if(bottom)wallBaseVertices++;else failures.push({kind:'wall-height',i});maxWallPlaneError=Math.max(maxWallPlaneError,Math.min(Math.abs(p.y-ring.footY),Math.abs(p.y-ring.baseY)));const n=new T.Vector3().fromBufferAttribute(wn,i),radial=new T.Vector3(p.x,0,p.z).normalize(),dot=n.dot(radial)*(r<3.5?-1:1);minWallNormal=Math.min(minWallNormal,dot);if(Math.abs(r-(r<3.5?3.12:4.2))>1e-6)failures.push({kind:'wall-radius',i});}
 for(let i=0;i<320;i++)for(const side of[0,1]){const a=new T.Vector3().fromBufferAttribute(pos,i*2+side),b=new T.Vector3().fromBufferAttribute(pos,(i+1)*2+side);const offset=(i*2+side)*6,tri=Array.from({length:6},(_,j)=>new T.Vector3().fromBufferAttribute(wp,offset+j));if(!tri.some(p=>p.distanceTo(a)<1e-7)||!tri.some(p=>p.distanceTo(b)<1e-7))failures.push({kind:'wall-original-edge',i,side});else wallSourceEdges++;for(const p of[a,b,a.clone().lerp(b,.5)]){if(new T.Raycaster(new T.Vector3(p.x,ring.baseY+.005,p.z),new T.Vector3(0,-1,0),0,.01).intersectObject(ring.base,false).length)wallBaseRays++;else failures.push({kind:'wall-base',i,side});}}
 let padPairChecks=0;for(let i=0;i<shapes.length;i++)for(let j=i+1;j<shapes.length;j++){padPairChecks++;const a=shapes[i],b=shapes[j],clear=[...a.axes,...b.axes].some(axis=>{const x=a.poly.map(p=>p.dot(axis)),y=b.poly.map(p=>p.dot(axis));return Math.min(...x)>=Math.max(...y)+1e-7||Math.min(...y)>=Math.max(...x)+1e-7;});if(!clear)failures.push({kind:'pad-overlap',i,j});}let prismPairs=0;for(const flight of stairs)for(let i=0;i<24;i++){const outer=flight.outer-i*10/24,inner=flight.outer-(i+1)*10/24,feet=flight.top-(i+1)/6,axes=[new T.Vector3(Math.cos(flight.a),0,Math.sin(flight.a)),new T.Vector3(-Math.sin(flight.a),0,Math.cos(flight.a))],poly=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z])=>axes[0].clone().multiplyScalar(x<0?inner:outer).addScaledVector(axes[1],z*flight.width/2));for(const b of shapes){prismPairs++;if(b.top<=feet+.08||b.bottom>=feet+2.10)continue;const separate=[...axes,...b.axes].some(axis=>{const a=poly.map(p=>p.dot(axis)),c=b.poly.map(p=>p.dot(axis));return Math.min(...a)>=Math.max(...c)-1e-6||Math.min(...c)>=Math.max(...a)-1e-6;});if(!separate)failures.push({kind:'standing-prism',part:b.part});}}
 return{padPairChecks,volumeCores,padFootRays,padBaseRays,padCorners,minEmbed,maxEmbed,minFootEmbed,maxFootEmbed,minPadCoverage,maxPadCoverage,minInnerRadius,maxOuterRadius,minBelowWalkingFeet,wallVertices,wallTopVertices,wallBaseVertices,wallSourceEdges,wallBaseRays,maxWallPlaneError,minWallNormal,prismPairs,walkingInnerBoundary:BABEL.levels[4].r-3.35,footingWalkingMargin:BABEL.levels[4].r-3.35-4.2,failures};
}
export function validateBabelBookRing(T){
 const G={...T},resources=new Map(),buffers=new Map();for(const k of Object.keys(T))if(/Geometry$|Material$|Texture$/.test(k)&&typeof T[k]==='function')G[k]=class extends T[k]{constructor(...a){super(...a);resources.set(this,0);this.addEventListener('dispose',()=>resources.set(this,resources.get(this)+1));}};G.InstancedMesh=class extends T.InstancedMesh{constructor(...a){super(...a);buffers.set(this,0);this.addEventListener('dispose',()=>buffers.set(this,buffers.get(this)+1));}};
 const f=build(G,T),root=f.b.group,snapshot=list=>babelGuardSnapshot(T,{updateMatrixWorld:()=>root.updateMatrixWorld(true),traverse:fn=>list.forEach(fn)}),raw=snapshot(f.source),targets=[...f.b.targets],before=[];root.traverse(o=>{if(o.isMesh&&!f.adapters[0].bindings.some(v=>v.source===o))before.push(o);});const prior=snapshot(before),counts=[resources.size,buffers.size];
 const original=measureBookRing(T,f.b,f.adapters[0],BABEL);assert.deepEqual(original.failures,[]);assert.equal(original.pages,64);assert.equal(original.parts,384);assert.equal(original.changed,0);assert.equal(original.copiedParts,320);assert.equal(original.originalParts,64);assert(original.footBaseGap>.05499&&original.footBaseGap<.05501);assert(original.minCoverGap>.03249&&original.maxCoverGap<.03251);assert(original.minPageGap>.08749&&original.maxPageGap<.08751);assert(original.minSideGap>.00199&&original.maxSideGap<.00201);assert(original.minCoverage>1-1e-10&&original.maxCoverage<1+1e-10&&original.minFootBaseCoverage>1-1e-10);assert.equal(original.footCorners,768);assert.equal(original.footRayHits,768);assert(original.maxSpinePlaneError<1e-6);assert.equal(original.coverSpineCores,128);assert.equal(original.stampCores,128);
 const saved=['document','localStorage','sessionStorage','fetch'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]),locked={...G};for(const k of Object.keys(T))if(/Material$|Texture$|Light$/.test(k)&&typeof T[k]==='function')locked[k]=class{constructor(){throw Error('New rendering resource '+k);}};
 const colors=[...new Set(f.source.filter(o=>o.isMesh).flatMap(o=>Array.isArray(o.material)?o.material:[o.material]))].map(m=>[m,Object.getOwnPropertyDescriptor(m,'color')]).filter(([,d])=>d);let ring;try{colors.forEach(([m])=>Object.defineProperty(m,'color',{configurable:true,get(){throw Error('Book colour inspected');}}));saved.forEach(([k])=>Object.defineProperty(globalThis,k,{configurable:true,get(){throw Error('Private/DOM access '+k);}}));ring=seatBabelBookRing(locked,f.b,f.adapters[0]);ring.sync();}finally{colors.forEach(([m,d])=>Object.defineProperty(m,'color',d));saved.forEach(([k,d])=>d?Object.defineProperty(globalThis,k,d):delete globalThis[k]);}
 assert(ring.group?.visible);assert.equal(ring.parts.length,64);assert.equal(ring.frames.length,64);assert.deepEqual([resources.size,buffers.size],[counts[0]+1,counts[1]+1]);const supports=measureRingSupports(T,ring,BABEL,stairs);assert.deepEqual(supports.failures,[]);assert.equal(supports.volumeCores,192);assert.equal(supports.padPairChecks,2016);assert.equal(supports.padCorners,256);assert.equal(supports.padFootRays,256);assert.equal(supports.padBaseRays,256);assert(supports.minEmbed>.00199&&supports.maxEmbed<.00201);assert(supports.minFootEmbed>.00199&&supports.maxFootEmbed<.00201);assert(supports.minPadCoverage>1-1e-10&&supports.maxPadCoverage<1+1e-10);assert.equal(supports.wallSourceEdges,640);assert.equal(supports.wallVertices,3840);assert.equal(supports.wallTopVertices,1920);assert.equal(supports.wallBaseVertices,1920);assert.equal(supports.wallBaseRays,1920);assert(supports.minWallNormal>.9999);assert.equal(supports.prismPairs,6144);assert(supports.minBelowWalkingFeet>2.4104);assert.equal(supports.footingWalkingMargin,1.4500000000000002);
 const current=[];root.traverse(o=>{if(o.isMesh&&!f.adapters[0].bindings.some(v=>v.source===o))current.push(o);});const installed=snapshot(current);assert.deepEqual(snapshot(before),prior);assert.deepEqual(snapshot(f.source),raw);assert.deepEqual(f.b.targets,targets);assert.equal(raw.hash,'7b21ef65631174a885fd0333480d32cab44193e1afc96a3c595d55e21e3bde66');assert.deepEqual(prior,{hash:'0a98c5232984da700fff39e5150a6b581522c94cfe57e2ea185d433474de98bd',meshes:70,instances:43802});assert.equal(installed.meshes,72);assert.equal(installed.instances,43866);assert.equal(installed.hash,'f22998420b6d27038339d3c9dfdef76d9f91df08f9b1c0682a290a8cfee5a93d');
 let borrowed=0;f.drawing.addEventListener('dispose',()=>borrowed++);f.b.dispose();for(const a of[...f.adapters,ring]){a.sync();a.dispose();a.dispose();}assert.equal(resources.size,87);assert.equal(buffers.size,39);assert([...resources.values()].every(n=>n===1));assert([...buffers.values()].every(n=>n===1));assert.equal(borrowed,0);f.drawing.dispose();const{details,foot,base,failures,...negative}=original;return{negative,supports,raw,prior,installed,resources:87,buffers:39,releasedOnce:true,borrowedDisposals:0};
}
export function validateBabelBookRingLifecycle(T,create=seatBabelBookRing){
 const set=(o,k,v)=>{const old=o[k];o[k]=v;return()=>o[k]=old;},foreign=()=>new Proxy({},{get(){throw Error('Foreign replacement inspected');}});
 const cases=[
  ['built owner replaced',f=>set(f.b,'group',foreign())],
  ['mouth owner replaced',f=>set(f.adapters[0],'group',foreign())],
  ['root detached',f=>{f.b.group.removeFromParent();return()=>f.scene.add(f.b.group);}],
  ['fit detached',f=>{const o=f.adapters[0].group;o.removeFromParent();return()=>f.b.group.add(o);}],
  ['support group detached',f=>{f.ring.group.removeFromParent();return()=>{};}],
  ['pad mesh detached',f=>{f.ring.mesh.removeFromParent();return()=>{};}],
  ['side mesh detached',f=>{f.ring.footing.removeFromParent();return()=>{};}],
  ['page owner detached',f=>{const o=f.ring.frames[0].page.source;o.removeFromParent();return()=>f.b.group.add(o);}],
  ['cover copy detached',f=>{const o=f.ring.frames[0].covers[0].owner;o.removeFromParent();return()=>f.adapters[0].group.add(o);}],
  ['foot geometry replaced',f=>set(f.ring.foot,'geometry',foreign())],
  ['floor geometry replaced',f=>set(f.ring.base,'geometry',foreign())],
  ['foot material replaced',f=>set(f.ring.foot,'material',foreign())],
  ['foot pose changed',f=>set(f.ring.foot.position,'y',.1)],
  ['floor pose changed',f=>set(f.ring.base.position,'y',-26.4)],
  ['page buffer replaced',f=>set(f.ring.frames[0].page.source,'instanceMatrix',foreign())],
  ['page array replaced',f=>set(f.ring.frames[0].page.source.instanceMatrix,'array',foreign())],
  ['page version changed',f=>{const o=f.ring.frames[0].page.source.instanceMatrix;return set(o,'version',o.version+1);}],
  ['page material replaced',f=>set(f.ring.frames[0].page.source,'material',foreign())],
  ['cover count changed',f=>{const o=f.ring.frames[0].covers[0].source;return set(o,'count',o.count-1);}],
  ['copy version changed',f=>{const o=f.ring.frames[0].covers[0].owner.instanceMatrix;return set(o,'version',o.version+1);}],
  ['unit index replaced',f=>set(f.ring.mesh.geometry,'index',foreign())],
  ['unit attribute replaced',f=>set(f.ring.mesh.geometry.attributes,'position',foreign())],
  ['unit array replaced',f=>set(f.ring.mesh.geometry.attributes.position,'array',foreign())],
  ['foot index array replaced',f=>set(f.ring.foot.geometry.index,'array',foreign())],
  ['floor attribute version changed',f=>{const o=f.ring.base.geometry.attributes.position;return set(o,'version',o.version+1);}],
  ['owned pad buffer replaced',f=>set(f.ring.mesh,'instanceMatrix',foreign())],
  ['owned pad array replaced',f=>set(f.ring.mesh.instanceMatrix,'array',foreign())],
  ['owned pad version changed',f=>{const o=f.ring.mesh.instanceMatrix;return set(o,'version',o.version+1);}],
  ['owned pad count changed',f=>set(f.ring.mesh,'count',63)],
  ['owned side geometry replaced',f=>set(f.ring.footing,'geometry',foreign())],
  ['owned side material replaced',f=>set(f.ring.footing,'material',foreign())],
  ['owned side attribute replaced',f=>set(f.ring.geometry.attributes,'position',foreign())],
  ['owned attribute bag replaced',f=>set(f.ring.geometry,'attributes',foreign())],
  ['owned attribute array replaced',f=>set(f.ring.geometry.attributes.position,'array',foreign())],
  ['owned morph bag replaced',f=>set(f.ring.geometry,'morphAttributes',foreign())],
  ['borrowed attribute bag replaced',f=>set(f.ring.mesh.geometry,'attributes',foreign())],
  ['owned pad pose changed',f=>set(f.ring.mesh.position,'x',.1)],
  ['owned group pose changed',f=>set(f.ring.group.position,'x',.1)]
 ];
 for(const[name,mutate]of cases){const f=build(T);f.ring=create(T,f.b,f.adapters[0]);assert(f.ring.group,name);let geometryRelease=0,bufferRelease=0,borrowed=0;const ownedAttributes=Object.entries(f.ring.geometry.attributes).map(([k,a])=>({k,a,array:a.array}));f.ring.geometry.addEventListener('dispose',()=>{geometryRelease++;for(const a of ownedAttributes){assert.equal(f.ring.geometry.attributes[a.k],a.a);assert.equal(a.a.array,a.array);}});f.ring.mesh.addEventListener('dispose',()=>bufferRelease++);for(const g of new Set(f.source.filter(o=>o.isMesh).flatMap(o=>[o.geometry,o.material])))g.addEventListener('dispose',()=>borrowed++);const restore=mutate(f);f.ring.sync();assert(f.ring.disposed,name);assert.deepEqual([geometryRelease,bufferRelease,borrowed],[1,1,0],name);restore();f.ring.sync();f.ring.dispose();f.ring.dispose();f.b.dispose();f.drawing.dispose();assert.deepEqual([geometryRelease,bufferRelease],[1,1],name);}
 const visibility=['foot','base','page','copy','fit','root'];
 for(const key of visibility){const f=build(T),ring=create(T,f.b,f.adapters[0]),o=key==='page'?ring.frames[0].page.source:key==='copy'?ring.frames[0].covers[0].owner:key==='fit'?f.adapters[0].group:key==='root'?f.b.group:ring[key],old=o.visible;o.visible=false;ring.sync();assert.equal(ring.group.visible,false,key);assert.equal(o.visible,false);o.visible=old;ring.sync();assert(ring.group.visible&&!ring.disposed,key);f.b.dispose();f.drawing.dispose();}
 const f=build(T),ring=create(T,f.b,f.adapters[0]);assert.equal(create(T,f.b,f.adapters[0]).group,null);ring.dispose();f.b.dispose();f.drawing.dispose();
 const hidden=build(T),p=hidden.b.group.getObjectByName('Circular footing beneath the upright book ring');p.position.y=.1;assert.equal(create(T,hidden.b,hidden.adapters[0]).group,null);p.position.y=0;hidden.b.dispose();hidden.drawing.dispose();
 const missing=new Proxy({},{get(){throw Error('Unknown private owner inspected');},getOwnPropertyDescriptor(){return undefined;}});assert.equal(create(T,missing,missing).group,null);
 const mapped=build(T),mounted=create(T,mapped.b,mapped.adapters[0]);mapped.scene.position.set(120,-8,31);mapped.scene.rotation.set(.31,.7,-.2);mapped.scene.updateMatrixWorld(true);mounted.sync();assert(mounted.group.matrixWorld.equals(mapped.b.group.matrixWorld));assert(mounted.group.visible&&!mounted.disposed);assert(Math.abs(mounted.group.matrixWorld.determinant()-1)<1e-10);mapped.b.dispose();mapped.drawing.dispose();return{programs:cases.length+visibility.length+4,invalidation:cases.length,visibility:visibility.length,duplicate:true,customPose:true,unknownPrivateOwner:true,inheritedRigidFrame:true,releasedOnce:true,borrowedOnInvalidation:0};
}
