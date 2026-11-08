import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {UPPER,LOWER,GALLERY_THICKNESS,GRAVITY_TURN_Y,TWO_FACE_GALLERY_CONTRACT,pointAt,headingAt,heightAt,nearestTheta,surfaceAt,walkGallery} from '../src/two-face-gallery-model.js';
import {buildTwoFaceGallery} from '../src/two-face-gallery-scene.js';

assert.equal(GALLERY_THICKNESS,96);assert.equal(GRAVITY_TURN_Y,-48);assert.equal(TWO_FACE_GALLERY_CONTRACT.stepsPerSide,240);
const close=(a,b,tol=1e-7)=>assert(Math.abs(a-b)<tol,`${a} != ${b}`);
for(const s of[UPPER,LOWER]){
 const built=buildTwoFaceGallery(T,{side:s.id});built.group.updateMatrixWorld(true);assert.equal(built.counts.treads,240);assert.equal(built.counts.arches,13);assert(built.counts.drawMeshes<25);assert.equal(built.descriptor,s);assert.equal(built.contract,TWO_FACE_GALLERY_CONTRACT);
 let geometries=0,triangles=0;built.group.traverse(o=>{if(o.geometry){geometries++;assert(o.geometry.attributes.position.array.every(Number.isFinite));triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3*(o.count??1);}});assert(geometries<25);assert(triangles<250000);
 const rayY=(x,z,y,distance=.10)=>new T.Raycaster(new T.Vector3(x,y+.04,z),new T.Vector3(0,-1,0),0,distance).intersectObject(built.walking,true).map(h=>h.point.y);
 const clearLine=(a,b)=>{const start=new T.Vector3(...a),delta=new T.Vector3(...b).sub(start);assert.equal(new T.Raycaster(start,delta.clone().normalize(),.001,delta.length()-.001).intersectObject(built.group,true).length,0,`${s.id} deck mouth must not contain a rail or arch post`);};
 for(const z of[-.6,0,.6]){if(s.id==='upper'){clearLine([9.2,-23.35,z],[16,-23.35,z]);clearLine([16,-39.35,z],[22,-39.35,z]);}else{clearLine([16,.78,z],[26,.78,z]);clearLine([-56,.78,z],[-63.9,.78,z]);}}
 for(const x of[15.3,16,16.7])clearLine([x,-47.35,-2.8],[x,-47.35,2.8]);
 close(pointAt(0,s).y,s.topY);close(pointAt(s.endTheta,s).y,-48);close(pointAt(s.endTheta,s).x,16);close(pointAt(s.endTheta,s).z,0);
 for(const r of[s.innerRadius+.12,s.radius,s.outerRadius-.12]){
  // Every step, including both edges of its full walkable width, is real geometry.
  for(let i=0;i<s.steps;i++){const theta=(i+.5)/s.steps*s.endTheta,p=pointAt(theta,s,{radius:r}),hit=surfaceAt(p.x,p.z,p.y,{side:s,lastTheta:theta,layer:'spiral'});assert(hit);close(hit.y,p.y);assert(rayY(p.x,p.z,p.y).some(y=>Math.abs(y-p.y)<2e-5),`${s.id} tread ${i} r=${r} agrees with its real mesh`);const heading=headingAt(theta,s);close(Math.hypot(heading.x,heading.y,heading.z),1);close(-Math.sin(heading.yaw),-Math.sin(theta));close(-Math.cos(heading.yaw),Math.cos(theta));}
  const start=pointAt(0,s,{radius:r}),p={x:start.x,z:start.z,y:start.y+1.8,galleryTheta:0,galleryLayer:'spiral'};
  const n=2400;
  for(let i=1;i<=n;i++){const target=pointAt(i/n*s.endTheta,s,{radius:r}),result=walkGallery(p,target.x-p.x,target.z-p.z,{side:s});assert(!result.blocked,`${s.id} descends at sample ${i} r=${r}`);close(p.x,target.x);close(p.z,target.z);close(p.y-1.8,target.y);}
  close(p.galleryTheta,s.endTheta);
  for(let i=n-1;i>=0;i--){const target=pointAt(i/n*s.endTheta,s,{radius:r}),result=walkGallery(p,target.x-p.x,target.z-p.z,{side:s});assert(!result.blocked,`${s.id} reverses at sample ${i} r=${r}`);close(p.x,target.x);close(p.z,target.z);close(p.y-1.8,target.y);}
  close(p.galleryTheta,0);
 }
 // A physically overlapping coil is never picked merely because X/Z matches.
 for(let turn=0;turn<3;turn++){const theta=turn*Math.PI*2+.7,p=pointAt(theta,s);close(nearestTheta(p.x,p.z,s,{feetY:p.y,lastTheta:theta}),theta);assert.equal(nearestTheta(p.x,p.z,s,{feetY:p.y+2,lastTheta:theta}),null);assert.equal(surfaceAt(p.x,p.z,p.y,{side:s,lastTheta:theta+Math.PI*2,layer:'spiral'}),null);}
 assert.equal(surfaceAt(16,0,undefined,{side:s}),null);assert.equal(nearestTheta(16,0,s),null);assert.equal(surfaceAt(0,0,-48,{side:s}),null);assert.equal(surfaceAt(16,0,100,{side:s}),null);
 // Last-theta and layer gates forbid floor/bridge/midpoint shortcuts.
 assert.equal(surfaceAt(16,0,-48,{side:s,lastTheta:0,layer:'top'}),null);assert.equal(surfaceAt(16,0,s.topY,{side:s,lastTheta:s.endTheta,layer:'mid'}),null);
 const middle={x:16,z:0,y:-48+1.8,galleryTheta:s.endTheta,galleryLayer:'spiral'};assert(!walkGallery(middle,2,1,{side:s}).blocked);assert.equal(middle.galleryLayer,'mid');close(middle.y-1.8,-48);assert(rayY(middle.x,middle.z,-48).some(y=>Math.abs(y+48)<2e-5));assert(!walkGallery(middle,-2,-1,{side:s}).blocked);close(middle.galleryTheta,s.endTheta);
 const edge=pointAt(1,s),barrier={...edge,y:edge.y+1.8,galleryTheta:1,galleryLayer:'spiral'};assert(walkGallery(barrier,Math.cos(1)*10,Math.sin(1)*10,{side:s}).blocked);assert(Math.hypot(barrier.x,barrier.z)<s.outerRadius);
 // Owned meshes, geometries and materials are disposed once; no caller resources.
 let disposed=0;built.group.traverse(o=>{if(o.geometry)o.geometry.addEventListener('dispose',()=>disposed++);});const parent=new T.Group();parent.add(built.group);built.dispose();assert.equal(parent.children.length,0);assert(disposed>0);const first=disposed;built.dispose();assert.equal(disposed,first);
}

// The upper route meets the Babel bay, and its second-turn spur meets the tunnel.
const p={x:9.1,z:0,y:-24+1.8,galleryTheta:0,galleryLayer:'top'};
for(let x=9.2;x<=16;x+=.05)assert(!walkGallery(p,x-p.x,0,{side:'upper'}).blocked);
const spur=pointAt(4*Math.PI,'upper'),visitor={...spur,y:spur.y+1.8,galleryTheta:4*Math.PI,galleryLayer:'spiral'};
for(let x=16.05;x<=21.95;x+=.05)assert(!walkGallery(visitor,x-visitor.x,-visitor.z,{side:'upper'}).blocked);assert.equal(visitor.galleryLayer,'spur');close(visitor.y-1.8,-40);
for(let x=21.9;x>=16;x-=.05)assert(!walkGallery(visitor,x-visitor.x,0,{side:'upper'}).blocked);

// Lower top bridge, annular floor and genuine western walkout are connected.
const lower={x:16,z:0,y:.13+1.8,galleryTheta:0,galleryLayer:'spiral'};
for(let x=16.1;x<=30;x+=.1)assert(!walkGallery(lower,x-lower.x,0,{side:'lower'}).blocked);
for(let i=1;i<=400;i++){const a=i/400*Math.PI;assert(!walkGallery(lower,30*Math.cos(a)-lower.x,30*Math.sin(a)-lower.z,{side:'lower'}).blocked);}
for(let x=-30.1;x>=-63.9;x-=.1)assert(!walkGallery(lower,x-lower.x,-lower.z,{side:'lower'}).blocked);assert.equal(lower.galleryLayer,'walkout');close(lower.y-1.8,.13);
assert.equal(surfaceAt(60,0,.13,{side:'lower',layer:'floor',lastTheta:0}),null);assert.equal(surfaceAt(-63,3,.13,{side:'lower',layer:'walkout',lastTheta:0}),null);
console.log('PASS two-face central gallery: 480 real treads, every tread across full width, both spirals reversible, strict feet/layer/coil gates, Babel bridge, tunnel spur, safe middle, lower annulus and west door, owned cleanup');
