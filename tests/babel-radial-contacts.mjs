import assert from 'node:assert/strict';
import {stairs,walkLibrary} from '../src/babel-library-model.js';
import {babelGuardSnapshot} from './babel-entry-guards.mjs';

const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
export function validateBabelRadialContacts(T,built){
 const root=built.group;root.updateMatrixWorld(true);assert(root.matrixWorld.equals(new T.Matrix4()));
 // Complete independent 39d594b fixture, with every mesh/instance retained.
 assert.deepEqual(babelGuardSnapshot(T,root),{hash:'8f17b68a21bb9777ee6ae73ccd86e056d82b89123256dd3f587f533aeb734eae',meshes:65,instances:41048});
 const batch=(type,color)=>root.children.find(o=>o.isInstancedMesh&&o.geometry.type===type&&o.material.color.getHex()===color),treads=batch('BoxGeometry',0xc5b28b),stringers=batch('CylinderGeometry',0x765238),rails=batch('CylinderGeometry',0xa58b56),posts=batch('BoxGeometry',0xa58b56);
 assert.equal(treads.count,96);assert.equal(stringers.count,8);assert.equal(rails.count,40);
 const matrix=(o,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m;},matrices=o=>Array.from({length:o.count},(_,i)=>matrix(o,i)),tm=matrices(treads),sm=matrices(stringers),rm=matrices(rails),pm=matrices(posts),postIDs=[];
 for(let i=0;i<pm.length;i++){const s=new T.Vector3();pm[i].decompose(new T.Vector3(),new T.Quaternion(),s);if(Math.abs(s.x-.05)<1e-5&&Math.abs(s.y-1.08)<1e-5&&Math.abs(s.z-.05)<1e-5)postIDs.push(i);}
 assert.deepEqual(postIDs,Array.from({length:56},(_,i)=>2736+i));
 const local=(m,p)=>p.clone().applyMatrix4(m.clone().invert()),inBox=(m,p)=>{const q=local(m,p);assert(Math.max(Math.abs(q.x),Math.abs(q.y),Math.abs(q.z))<.5001);},inBeam=(m,p)=>{const q=local(m,p);assert(Math.abs(q.y)<.5001);for(let k=0;k<7;k++){const a=(k+.5)*Math.PI*2/7;assert(q.x*Math.sin(a)+q.z*Math.cos(a)<Math.cos(Math.PI/7)+1e-4,'Original seven-sided beam contains joint');}};
 const cube=(p,h,check)=>{for(const x of[-h,h])for(const y of[-h,h])for(const z of[-h,h])check(p.clone().add(new T.Vector3(x,y,z)));};
 const ray=(objects,p,d,far)=>new T.Raycaster(p,d,0,far).intersectObjects(objects,true),up=new T.Vector3(0,1,0),down=new T.Vector3(0,-1,0),floors=root.children.filter(o=>o.isMesh&&!o.isInstancedMesh&&o.material.color?.getHex()===0x9c8965&&o.geometry.type==='BufferGeometry');
 let treadJoints=0,treadVertices=0,stringerJoints=0,stringerVertices=0,endCores=0,railJoints=0,railVertices=0,internalSeats=0,landingPostIntersections=0,lowerSeats=0,bodySamples=0,treadRays=0;
 const bodyObstructions=[];
 const recessedCaps=[];
 for(const s of stairs){
  const radial=new T.Vector3(Math.cos(s.a),0,Math.sin(s.a)),side=new T.Vector3(-Math.sin(s.a),0,Math.cos(s.a)),step=(s.outer-s.inner)/s.steps,rise=(s.top-s.bottom)/s.steps,point=(r,y,t=0)=>radial.clone().multiplyScalar(r).addScaledVector(side,t).setY(y);
  for(let i=0;i<24;i++){
   const id=s.i*24+i,r=s.outer-(i+.5)*step,y=s.top-(i+1)*rise;
   near(tm[id].elements[13],y-.09);for(const lane of[-1.3,0,1.3])for(const u of[.1,.5,.9]){const p=point(s.outer-(i+u)*step,y,lane),hit=ray([treads],p.clone().addScaledVector(up,.1),down,.2)[0];assert.equal(hit?.instanceId,id);near(hit.point.y,y);treadRays++;const body=ray([root],p.clone().addScaledVector(up,.08),up,2.02);if(body.length)bodyObstructions.push({flight:s.i,step:i,lane,u,feet:p.toArray(),hits:body.map(h=>({y:h.point.y,id:h.instanceId,color:h.object.material.color?.getHex(),type:h.object.geometry.type}))});bodySamples++;}
   for(let run=0;run<2;run++){const beam=s.i*2+run,p=point(r,y-.09,(run?-1:1)*1.6);cube(p,.005,v=>{inBox(tm[id],v);inBeam(sm[beam],v);stringerVertices++;});stringerJoints++;}
   if(i<23){const p=point(s.outer-(i+1)*step,y-.18+( .18-rise)/2);cube(p,.004,v=>{inBox(tm[id],v);inBox(tm[id+1],v);treadVertices++;});treadJoints++;}
  }
  for(let run=0;run<2;run++){
   const beam=s.i*2+run,sign=run?-1:1;
   for(const end of[0,1]){const p=new T.Vector3(0,end?.5:-.5,0).applyMatrix4(sm[beam]),other=new T.Vector3(0,end?-.5:.5,0).applyMatrix4(sm[beam]);p.addScaledVector(other.clone().sub(p).normalize(),.005);cube(p,.0005,v=>{inBeam(sm[beam],v);inBox(tm[s.i*24+(end?23:0)],v);});const cap=[];for(let v=0;v<stringers.geometry.attributes.position.count;v++){const q=new T.Vector3().fromBufferAttribute(stringers.geometry.attributes.position,v);if(Math.abs(q.y-(end?.5:-.5))<1e-6)cap.push(q.applyMatrix4(sm[beam]).y);}const gap=(end?s.bottom:s.top)-Math.max(...cap);assert(gap>.03&&gap<.06,'Stringer cap is recessed below its terrace, not a direct floor bearing');recessedCaps.push({beam,end,gap});endCores++;}
   for(let k=0;k<7;k++){
    const post=2736+s.i*14+run*7+k,m=pm[post],foot=new T.Vector3(0,-.5,0).applyMatrix4(m),r=s.outer-k*step*4,y=s.top-k*rise*4;
    near(foot.y,y-.04);const axis=point(r,y+1.03,sign*1.6),inside=point(r+(k===6?.01:k===0?-.01:0),y+1.03+(k===6?.004:k===0?-.004:0),sign*1.6);
    cube(inside,.001,v=>{inBox(m,v);inBeam(rm[beam],v);railVertices++;});railJoints++;
    if(k&&k<6){const p=point(r+.01,y-.02,sign*1.6);cube(p,.003,v=>{inBox(m,v);inBox(tm[s.i*24+k*4-1],v);});internalSeats++;}
    else{const hit=ray(floors,axis.clone().setY(y+.1),down,.2)[0];assert(hit);near(hit.point.y,y);cube(point(r,y,sign*1.6),.001,v=>inBox(m,v));landingPostIntersections++;}
   }
  }
  for(const lane of[-1.3,0,1.3]){const p=point(s.inner+.2,s.bottom,lane),hit=ray(floors,p.clone().addScaledVector(up,.1),down,.2)[0];assert(hit);near(hit.point.y,s.bottom);inBox(tm[s.i*24+23],p);lowerSeats++;}
  // Reversible navigation across the full retained width, including both mouths.
  for(const lane of[-1.3,0,1.3]){let p=point(s.outer+.1,s.top+1.8,lane);for(let r=s.outer+.05;r>=s.inner-.1;r-=.04){const q=point(r,0,lane);walkLibrary(p,q.x-p.x,q.z-p.z);}near(p.y-1.8,s.bottom);for(let r=s.inner-.1;r<=s.outer+.1;r+=.04){const q=point(r,0,lane);walkLibrary(p,q.x-p.x,q.z-p.z);}near(p.y-1.8,s.top);}
 }
 assert.equal(treadJoints,92);assert.equal(stringerJoints,192);assert.equal(endCores,16);assert.equal(railJoints,56);assert.equal(internalSeats,40);assert.equal(landingPostIntersections,16);assert.equal(lowerSeats,12);assert.equal(treadRays,864);assert.equal(bodySamples,864);
 // Factual baseline: these pre-existing side-lane intersections are unresolved.
 // Passing this audit is not a full-width clearance claim. Earlier strict
 // thermal/entry clearance programs remain unchanged and still run separately.
 assert.deepEqual(bodyObstructions.map(h=>[h.flight,h.step,h.lane,h.u]),[[0,9,-1.3,.1],...[0,1].flatMap(i=>[[i,13,1.3,.5],[i,13,1.3,.9],[i,14,1.3,.1],[i,14,1.3,.5],[i,14,1.3,.9],[i,15,1.3,.1],[i,15,1.3,.5]])]);
 assert.equal(bodyObstructions.filter(h=>h.lane===0).length,0,'All 288 sampled centre positions remain clear');
 const resources=new Set(),buffers=new Set(),released=new Map();root.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of[o.material].flat().filter(Boolean)){resources.add(m);if(m.map)resources.add(m.map);}if(o.isInstancedMesh)buffers.add(o);});for(const r of[...resources,...buffers])r.addEventListener('dispose',()=>released.set(r,(released.get(r)||0)+1));
 return{added:0,treads:96,treadJoints,treadVertices,stringerJoints,stringerVertices,endCores,recessedCaps,railJoints,railVertices,internalSeats,landingPostIntersections,lowerSeats,treadRays,bodySamples,bodyObstructions,observedResources:resources.size,buffers:buffers.size,assertReleased(){for(const r of[...resources,...buffers])assert.equal(released.get(r),1,'Original library render resource releases once');}};
}
