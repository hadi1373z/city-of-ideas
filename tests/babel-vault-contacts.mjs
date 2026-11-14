import assert from 'node:assert/strict';
import {buildBabelLibrary} from './fixtures/babel-library-before-finishes.mjs';
import {fitBabelMouths} from '../src/babel-mouth-clearance.js';
import {mountBabelSpokes} from '../src/babel-spoke-mounts.js';
import {BABEL,stairs,entryHeight} from '../src/babel-library-model.js';
import {UPPER,pointAt} from '../src/two-face-gallery-model.js';
import {babelGuardSnapshot} from './babel-entry-guards.mjs';

const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,a+' != '+b);
const matrix=(T,o,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m;};
const active=root=>{const out=[];root.traverse(o=>{if(!o.isMesh)return;for(let p=o;p;p=p.parent)if(!p.visible)return;out.push(o);});return out;};
const view=(root,objects)=>({updateMatrixWorld:()=>root.updateMatrixWorld(true),traverse:fn=>objects.forEach(fn)});
const canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})});
export function validateBabelVaultContacts(T,built){
 const root=built.group,scene=new T.Scene(),raw=[];scene.add(root);root.updateMatrixWorld(true);root.traverse(o=>raw.push(o));
 const source=babelGuardSnapshot(T,root);assert.deepEqual(source,{hash:'8f17b68a21bb9777ee6ae73ccd86e056d82b89123256dd3f587f533aeb734eae',meshes:65,instances:41048});
 const lamps=built.lamps.visible;built.lamps.visible=true;const mouth=fitBabelMouths(T,built);root.updateMatrixWorld(true);const originalActive=active(root),before=babelGuardSnapshot(T,view(root,originalActive));
 // Independent 8f9c02a mouth fitting with the original borrowed stair drawing.
 // The no-drawing fallback has a different original stair material.
 assert.deepEqual(before,{hash:'3875c49dcb569764fb9e4654cdf8bd47e394d823a317463efb58641146261796',meshes:65,instances:41048});
 const denied=()=>{throw Error('Ceiling fitting must not allocate resources or access private storage');},names=['localStorage','sessionStorage'],prior=names.map(k=>Object.getOwnPropertyDescriptor(globalThis,k)),events=new Map();
 for(const n of names)Object.defineProperty(globalThis,n,{configurable:true,get:denied});
 const guarded={...T,...Object.fromEntries(['MeshLambertMaterial','ShaderMaterial','BoxGeometry','CylinderGeometry','Texture'].map(k=>[k,denied])),InstancedMesh:class extends T.InstancedMesh{constructor(...a){super(...a);events.set(this,0);this.addEventListener('dispose',()=>events.set(this,events.get(this)+1));}}};
 let fitting;try{fitting=mountBabelSpokes(guarded,built);fitting.sync();}finally{for(let i=0;i<names.length;i++)if(prior[i])Object.defineProperty(globalThis,names[i],prior[i]);else delete globalThis[names[i]];}
 assert.equal(fitting.mounts.length,24);assert.equal(events.size,1);assert.equal(fitting.group.parent,root);root.updateMatrixWorld(true);
 const batch=(type,color)=>root.children.find(o=>o.isInstancedMesh&&o.geometry.type===type&&o.material.color.getHex()===color),columns=batch('BoxGeometry',0x765238),spokes=batch('CylinderGeometry',0x3e3027),roof=root.getObjectByName('Annular timber ceiling around the volcanic glass reservoir'),floor=root.getObjectByName('Library base outside the open annular shaft'),collar=built.thermal.collar;
 assert.equal(fitting.mesh.geometry,columns.geometry);assert.equal(fitting.mesh.material,spokes.material);assert.equal(fitting.mesh.count,24);assert.equal(active(root).length,66);assert.equal(active(root).reduce((n,o)=>n+(o.isInstancedMesh?o.count:0),0),41072);
 const up=new T.Vector3(0,1,0),down=up.clone().negate(),ray=(o,p,d,far)=>new T.Raycaster(p,d,0,far).intersectObject(o,true),inBox=(m,p)=>{const q=p.clone().applyMatrix4(m.clone().invert());assert(Math.max(Math.abs(q.x),Math.abs(q.y),Math.abs(q.z))<.5001);},inBeam=(m,p)=>{const q=p.clone().applyMatrix4(m.clone().invert());assert(Math.abs(q.y)<.5001);for(let k=0;k<7;k++){const a=(k+.5)*Math.PI*2/7;assert(q.x*Math.sin(a)+q.z*Math.cos(a)<Math.cos(Math.PI/7)+1e-4);}};
 const caps=(geometry,y)=>{const result=new Map(),a=geometry.attributes.position;for(let i=0;i<a.count;i++){const p=new T.Vector3().fromBufferAttribute(a,i);if(Math.abs(p.y-y)<1e-6)result.set(p.toArray().map(v=>Math.round(v*1e6)).join(','),p);}return[...result.values()];};
 let floorSamples=0,columnRoofSamples=0,outerCapVertices=0,mountFootVertices=0,mountRoofVertices=0,envelopeVertices=0,collarLineCentres=0,collarGapCentres=0;const gaps=[],collarGaps=[];
 for(let i=0;i<24;i++){
  const c=matrix(T,columns,i),b=matrix(T,spokes,i),m=matrix(T,fitting.mesh,i),bottom=new T.Vector3(0,-.5,0).applyMatrix4(c),top=new T.Vector3(0,.5,0).applyMatrix4(c),inner=new T.Vector3(0,-.5,0).applyMatrix4(b),radial=new T.Vector3(inner.x,0,inner.z).normalize();
  near(bottom.y,-26.8);near(top.y,-2.8);near(BABEL.base-bottom.y,.3);
  for(const x of[-.45,0,.45])for(const z of[-.45,0,.45]){const p=new T.Vector3(x,-.5,z).applyMatrix4(c),f=ray(floor,p.clone().setY(BABEL.base+.1),down,.2)[0];assert(f);near(f.point.y,BABEL.base);inBox(c,f.point);floorSamples++;const q=new T.Vector3(x,.5,z).applyMatrix4(c),r=ray(roof,q.clone().addScaledVector(down,.1),up,.2)[0];assert(r);near(r.point.y,q.y);columnRoofSamples++;}
  for(const p of caps(spokes.geometry,.5)){inBox(c,p.clone().applyMatrix4(b));outerCapVertices++;}
  const station=inner.clone().addScaledVector(radial,.3),bh=ray(spokes,station.clone().setY(-2.7),down,.8)[0],rh=ray(roof,station.clone().setY(-3.1),up,.6)[0];assert.equal(bh?.instanceId,i);assert(rh);const gap=rh.point.y-bh.point.y;assert(gap>.2399&&gap<.256);gaps.push(gap);
  const ch=ray(collar,inner.clone().addScaledVector(radial,.05),radial.clone().negate(),.2)[0];assert(ch);const cg=inner.clone().sub(ch.point).dot(radial);collarGaps.push(cg);if(cg<2e-5)collarLineCentres++;else{assert(cg>.0035&&cg<.0037);collarGapCentres++;}
  for(const p of caps(fitting.mesh.geometry,-.5)){inBeam(b,p.clone().applyMatrix4(m));mountFootVertices++;}
  for(const p of caps(fitting.mesh.geometry,.5)){const q=p.clone().applyMatrix4(m),hit=ray(roof,q.clone().setY(q.y-.06),up,.1)[0];assert(hit);near(q.y-hit.point.y,.01);inBox(m,hit.point);mountRoofVertices++;}
  for(const x of[-.5,.5])for(const y of[-.5,.5])for(const z of[-.5,.5]){const p=new T.Vector3(x,y,z).applyMatrix4(m);assert(Math.hypot(p.x,p.z)>21.25,'No mount crosses the glass aperture');assert(p.x<BABEL.opening.minX-1.15,'No mount crosses the entry aperture');assert(p.y>-3.101);envelopeVertices++;}
  const copied=mouth.bindings.find(v=>v.source===columns);assert(copied);assert.deepEqual(matrix(T,copied.clone,i).toArray(),c.toArray(),'Every original column matrix remains exact in the active copy');
 }
 assert.equal(floorSamples,216);assert.equal(columnRoofSamples,216);assert.equal(outerCapVertices,192);assert.equal(mountFootVertices,96);assert.equal(mountRoofVertices,96);assert.equal(envelopeVertices,192);assert.equal(collarLineCentres,8);assert.equal(collarGapCentres,16);
 let headroom=0;const clear=(x,z,y)=>{assert.equal(ray(fitting.group,new T.Vector3(x,y+.015,z),up,2.185).length,0,'New mounts preserve original walking headroom');headroom++;};
 for(const l of BABEL.levels)for(const r of[l.r-3.8,l.r-3.35,l.r,l.r+3.25,l.r+4.4])for(let i=0;i<96;i++){const a=(i+.13)*Math.PI*2/96;clear(Math.cos(a)*r,Math.sin(a)*r,l.y);}
 for(const s of stairs)for(let i=0;i<s.steps;i++)for(const side of[-s.width/2,0,s.width/2]){const r=s.outer-(i+.5)*(s.outer-s.inner)/s.steps;clear(Math.cos(s.a)*r-Math.sin(s.a)*side,Math.sin(s.a)*r+Math.cos(s.a)*side,s.top-(i+1)*(s.top-s.bottom)/s.steps);}
 const f=BABEL.flight;for(let i=0;i<f.steps;i++)for(const side of[-f.width/2,0,f.width/2]){const z=f.z0-(i+.5)*(f.z0-f.z1)/f.steps;clear(f.x+side,z,entryHeight(f.x,z));}
 for(let i=0;i<=16;i++)for(const z of[BABEL.landing.minZ,-3,0])clear(BABEL.landing.minX+(45.2-BABEL.landing.minX)*i/16,z,BABEL.landing.y);
 for(const l of BABEL.levels)for(let i=0;i<96;i++)for(const rad of[-.55,.55]){const a=(i+.31)*Math.PI*2/96,r=l.r+4+rad;clear(Math.cos(a)*r,Math.sin(a)*r,l.y+3.8);}
 for(let i=0;i<UPPER.steps;i++)for(const radius of[14.4,16,17.6]){const p=pointAt((i+.5)*UPPER.endTheta/UPPER.steps,'upper',{radius});clear(p.x,p.z,p.y);}
 assert.equal(headroom,4539);let body=0;for(const s of stairs.slice(0,2))for(let i=0;i<24;i++)for(const u of[.1,.5,.9])for(const lane of[-1.46,-1.3,-.65,0,.65,1.3,1.46]){const r=s.outer-(i+u)*10/24,y=s.top-(i+1)/6,p=new T.Vector3(Math.cos(s.a)*r-Math.sin(s.a)*lane,y+.08,Math.sin(s.a)*r+Math.cos(s.a)*lane);assert.equal(new T.Raycaster(p,up,0,2.02).intersectObjects(active(root),false).length,0);body++;}
 assert.equal(body,1008);assert.deepEqual(babelGuardSnapshot(T,view(root,raw)),source,'Every original source mesh/ID is retained, without source exclusions');assert.deepEqual(babelGuardSnapshot(T,view(root,originalActive)),before,'Every prior active fitted matrix/profile remains exact');
 const borrowed=[fitting.mesh.geometry,fitting.mesh.material],disposed=new Map();for(const r of borrowed)r.addEventListener('dispose',()=>disposed.set(r,(disposed.get(r)||0)+1));fitting.dispose();fitting.dispose();assert.equal(fitting.group.parent,null);assert.equal([...events.values()][0],1);for(const r of borrowed)assert.equal(disposed.get(r)||0,0);assert.deepEqual(babelGuardSnapshot(T,view(root,originalActive)),before);mouth.dispose();built.lamps.visible=lamps;scene.remove(root);
 return{floorSamples,columnRoofSamples,outerCapVertices,mountFootVertices,mountRoofVertices,envelopeVertices,collarLineCentres,collarGapCentres,oldCeilingGap:[Math.min(...gaps),Math.max(...gaps)],oldCollarGap:[Math.min(...collarGaps),Math.max(...collarGaps)],headroom,body,draws:66,instances:41072,newBuffers:1,newGeometryMaterialsTextures:0};
}

export function validateSpokeCleanup(T){
 let programs=0;for(const mode of['parent','missing','spoke','buffer','roof','hidden']){
  const b=buildBabelLibrary(T,{canvas}),scene=new T.Scene();scene.add(b.group);const mouth=fitBabelMouths(T,b);if(mode==='hidden')b.group.visible=false;const original=b.dispose,f=mountBabelSpokes(T,b);assert(f.group);const borrowed=[f.mesh.geometry,f.mesh.material],released=new Map(),mouthReleased=new Map();let own=0;f.mesh.addEventListener('dispose',()=>own++);for(const v of borrowed)v.addEventListener('dispose',()=>released.set(v,(released.get(v)||0)+1));for(const v of mouth.bindings){mouthReleased.set(v.clone,0);v.clone.addEventListener('dispose',()=>mouthReleased.set(v.clone,mouthReleased.get(v.clone)+1));}
  const sourceSpokes=b.group.children.find(o=>o.isInstancedMesh&&o.geometry.type==='CylinderGeometry'&&o.material.color.getHex()===0x3e3027);let detached;
  if(mode==='parent')b.dispose();else if(mode==='missing'){b.group.removeFromParent();f.sync();}else if(mode==='spoke'){detached=sourceSpokes;sourceSpokes.removeFromParent();f.sync();}else if(mode==='buffer'){sourceSpokes.instanceMatrix.needsUpdate=true;f.sync();}else if(mode==='roof'){b.group.getObjectByName('Annular timber ceiling around the volcanic glass reservoir').position.y+=.1;f.sync();}else f.dispose();
  f.dispose();assert.equal(own,1);assert.equal(f.group.parent,null);if(mode!=='parent'){for(const v of borrowed)assert.equal(released.get(v)||0,0);assert.equal(b.dispose,original);b.dispose();}for(const v of borrowed)assert.equal(released.get(v),1);for(const n of mouthReleased.values())assert.equal(n,1);detached?.dispose();programs++;
 }
 for(const kind of['roof','spoke']){const b=buildBabelLibrary(T,{canvas});if(kind==='roof')b.group.getObjectByName('Annular timber ceiling around the volcanic glass reservoir').position.y+=.2;else{const source=b.group.children.find(o=>o.isInstancedMesh&&o.geometry.type==='CylinderGeometry'&&o.material.color.getHex()===0x3e3027),m=matrix(T,source,0);m.scale(new T.Vector3(.5,1,.5));source.setMatrixAt(0,m);}assert.equal(mountBabelSpokes({...T,InstancedMesh:()=>{throw Error('Custom layout cannot allocate a mount');}},b).group,null);b.dispose();programs++;}return programs;
}
