import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {UPPER,LOWER,pointAt} from '../src/two-face-gallery-model.js';
import {buildTwoFaceGallery} from '../src/two-face-gallery-scene.js';
import {GRAVITY_STAIR as G,gravityStairFrame,gravityStairCenter,gravityStairTread,gravityStairPoint,gravityStairPose,walkGravityStair} from '../src/gravity-stair-model.js';
import {buildGravityStair} from '../src/gravity-stair-scene.js';

const close=(a,b,e=1e-6)=>assert(Math.abs(a-b)<e,`${a} differs from ${b}`),v=p=>new T.Vector3(p.x,p.y,p.z),vec=(a,b,e=1e-6)=>close(v(a).distanceTo(v(b)),0,e);
const upper=buildTwoFaceGallery(T,{side:'upper',endTheta:G.joinTheta}),lower=buildTwoFaceGallery(T,{side:'lower',endTheta:G.joinTheta}),stair=buildGravityStair(T),scene=new T.Group();lower.group.rotation.x=Math.PI;lower.group.position.y=-96;scene.add(upper.group,lower.group,stair.group);scene.updateMatrixWorld(true);
assert.equal(upper.counts.treads,200);assert.equal(lower.counts.treads,200);assert(!upper.walking.getObjectByName('mid'));assert(!lower.walking.getObjectByName('mid'));assert.equal(stair.counts.treads,240);assert.equal(stair.counts.drawMeshes,2);
const a=pointAt(G.joinTheta,UPPER),b=pointAt(G.joinTheta,LOWER);vec(gravityStairCenter(0),a);vec(gravityStairCenter(1),{x:b.x,y:-96-b.y,z:-b.z});vec(gravityStairFrame(0).up,{x:0,y:1,z:0});vec(gravityStairFrame(1).up,{x:0,y:-1,z:0});
for(const u of[0,.01,.1,.4,.5,.9,.99,1]){
 const f=gravityStairFrame(u);close(v(f.up).length(),1);close(v(f.right).length(),1);close(v(f.forward).length(),1);close(v(f.up).dot(v(f.right)),0);vec(v(f.right).cross(v(f.up)),v(f.forward).negate());
}
let worstGap=0;
for(let i=0;i<G.steps;i++){
 const q=gravityStairTread(i),n=v(q.up),d=v(q.run);close(n.dot(d),0);assert(Math.abs(q.rise)<.08,'All real tilted risers remain shallow');worstGap=Math.max(worstGap,v(q.end).distanceTo(v(q.next)));
 for(const t of[.15,.5,.85])for(const offset of[-1.5,0,1.5]){
  const u=(i+t)/G.steps,foot=gravityStairPoint(u,offset),pose=gravityStairPose(u,offset),up=v(pose.up),hits=new T.Raycaster(v(foot).addScaledVector(up,.03),up.clone().negate(),0,.06).intersectObject(stair.walking,true);
  assert(hits.length,`Exact supported tread ${i}, offset ${offset}`);vec(hits[0].point,foot,1.5e-5);
  assert(Math.hypot(pose.eye.x,pose.eye.z)<21.2-.5,'Eye remains inside the real opaque retaining cylinder');
  const headHits=new T.Raycaster(v(foot).addScaledVector(up,.12),up,0,2.05).intersectObject(scene,true);assert.equal(headHits.length,0,`Body clearance at ${u}, offset ${offset}`);
 }
}
assert(worstGap<.08);
// The retired coincident middle rectangle is actually absent from both active builds.
for(const group of[upper.group,lower.group])assert.equal(new T.Raycaster(new T.Vector3(19,-47,0),new T.Vector3(0,-1,0),0,2).intersectObject(group,true).length,0);
// Advance and reverse the same supported path and keep strafe inside its rails.
let state={progress:0,offset:0};for(let i=0;i<1000;i++)state=walkGravityStair(state,Math.PI*32/1000,.03);close(state.progress,1);assert(state.offset<=G.navHalfWidth);for(let i=0;i<1000;i++)state=walkGravityStair(state,-Math.PI*32/1000,-.03);close(state.progress,0);assert(state.offset>=-G.navHalfWidth);
let disposed=0;stair.treads.geometry.addEventListener('dispose',()=>disposed++);stair.dispose();stair.dispose();assert.equal(disposed,1);upper.dispose();lower.dispose();
console.log('PASS gradual gravity stair: exact supported 240-tread mesh, clear body/eye path, continuous half-turn frames, real trimmed joins and reversible bounded movement');
