import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {LOWER} from '../src/two-face-gallery-model.js';
import {lowerMatrix,WORLD_CYLINDER as W} from '../src/world-cylinder-model.js';
import {verifyHelicalRails} from './helical-gallery-rails.mjs';
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex'),round=x=>Math.round(x*1e6)/1e6;

// Independent 4b1af6a inventory, including its thirty-three display supports.
// Return only physically verified appended IDs; earlier golden checks still
// inspect every retained gallery/reading item without changing their hashes.
export function verifyHelicalSupports(T,b){
 const rails=verifyHelicalRails(T,b),lower=b.side==='lower',ignored=new Map([...rails.ignored].map(([o,ids])=>[o,new Set(ids)])),rows=[],non=[],items=[],added=[],m=new T.Matrix4(),p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();
 b.group.updateWorldMatrix(true,true);
 function visit(o){if(o.userData.paperMonitors)return;if(o.isMesh){
  if(o.isInstancedMesh){
   const stone=lower&&o.geometry.type==='BoxGeometry'&&o.material.color.getHex()===0x6b6e67;
   if(stone)assert.equal(o.count-(rails.ignored.get(o)?.size??0),273);const ids=ignored.get(o)??new Set();
   for(let i=0;i<o.count;i++){if(rails.ignored.get(o)?.has(i))continue;o.getMatrixAt(i,m);m.decompose(p,q,s);const item={mesh:o,index:i,matrix:m.clone(),p:p.clone(),q:q.clone(),s:s.clone()};
    if(stone&&i>=131){added.push(item);ids.add(i);}else{items.push(item);rows.push(JSON.stringify({name:o.name,color:o.material.color?.getHex(),matrix:[...m.elements].map(round)}));}
   }if(ids.size)ignored.set(o,ids);
  }else non.push({name:o.name,position:o.position.toArray(),rotation:o.rotation.toArray(),data:o.userData,color:o.material.color?.getHex(),geometry:hash({position:Array.from(o.geometry.attributes.position.array),index:o.geometry.index?Array.from(o.geometry.index.array):null})});
 }for(const child of o.children)visit(child);}
 visit(b.group);
 assert.equal(rows.length,lower?1769:1460);
 assert.equal(hash(rows),lower?'b9bd0a8c6a657ea647274b6ee2d187b66a3e8ca76040595933b86e738878f6b3':'9d096f9bad3988fc6d31f666d4bd9dc87cc6d36e6b2915e22295c1af7dc9e5b6','Every pre-repair matrix and per-batch ID/order remains exact');
 assert.equal(hash([...rows].sort()),lower?'c6a470d0d0a0c3360789b8a5dde58a51442c0fadd5026bad4ee3eddac2dca170':'5cc7764898f9f663d1bbae21faeaaa3b55e45e9197b66d21650be35052a90026');
 assert.equal(hash(non),lower?'8d404e8c1569aa4458c0473bd02d82a014d146eca5cc6c3e50fa0045065c6520':'320847feff889d378bdf008ae56847e2128d5e7b5f833d5bc032c7581aa0e2e5','Every tread, opening, bridge, deck and noninstance profile/pose remains exact');
 if(!lower){assert.equal(added.length,0);return{ignored};}
 const near=(a,c,tol=6e-5)=>assert(Math.abs(a-c)<tol,`${a} != ${c}`),is=(a,c)=>Math.abs(a-c)<1e-5,down=new T.Vector3(0,-1,0),
  shoes=added.filter(a=>is(a.s.x,.44)&&is(a.s.y,.18)&&is(a.s.z,.82)),clips=added.filter(a=>is(a.s.x,.16)&&[.06,.14].some(h=>is(a.s.y,h))&&is(a.s.z,.24)),
  feet=items.filter(a=>a.mesh.geometry.type==='BoxGeometry'&&is(a.s.x,.3)&&is(a.s.y,.28)&&is(a.s.z,.3)),
  vertical=items.filter(a=>a.mesh.geometry.type==='CylinderGeometry'&&is(a.s.x,.035)&&is(a.s.y,1.05)),
  posts=vertical.filter(a=>[14.34,17.66].some(r=>is(Math.hypot(a.p.x,a.p.z),r))),
  midPosts=vertical.filter(a=>is(a.p.y-.525,-48));
 assert.equal(added.length,142);assert.equal(shoes.length,26);assert.equal(clips.length,116);assert.equal(feet.length,26);assert.equal(posts.length,116);assert.equal(midPosts.length,20);
 assert.equal(clips.filter(a=>is(a.s.y,.06)).length,24);assert.equal(clips.filter(a=>is(a.s.y,.14)).length,92);
 const proxies=new Map();function proxy(a){if(!proxies.has(a)){const mesh=new T.Mesh(a.mesh.geometry,a.mesh.material);mesh.matrixAutoUpdate=false;mesh.matrix.copy(a.matrix);mesh.updateMatrixWorld(true);proxies.set(a,mesh);}return proxies.get(a);}
 const corners=a=>{const out=[];for(const x of[-.5,.5])for(const y of[-.5,.5])for(const z of[-.5,.5])out.push(new T.Vector3(x,y,z).applyMatrix4(a.matrix));return out;};
 function onSeat(point,part){const hit=new T.Raycaster(point.clone().add(new T.Vector3(0,.03,0)),down,0,.06).intersectObject(proxy(part))[0];assert(hit,'The actual bearing must support the original foot');near(hit.point.y,point.y);}
 let footContacts=0,postContacts=0,anchors=0,sharedSeats=0,clearance=0,physical=0;
 for(const foot of feet){
  const shoe=shoes.find(a=>Math.hypot(a.p.x-foot.p.x,a.p.z-foot.p.z)<.20&&Math.abs(a.p.y-(foot.p.y-.23))<1e-4);assert(shoe);
  for(const point of corners(foot).filter(v=>v.y<foot.p.y)){onSeat(point,shoe);footContacts++;}
 }
 for(const post of posts){
  const clip=clips.find(a=>Math.hypot(a.p.x-post.p.x,a.p.z-post.p.z)<.061&&Math.abs(a.p.y+a.s.y/2-(post.p.y-.525))<1e-4);assert(clip);
  for(let i=0;i<8;i++){const angle=i/8*Math.PI*2;onSeat(new T.Vector3(post.p.x+Math.cos(angle)*.035,post.p.y-.525,post.p.z+Math.sin(angle)*.035),clip);postContacts++;}
 }
 const treads=b.group.getObjectByName('240 real annular stone treads');assert(treads);
 const localMesh=source=>{const mesh=new T.Mesh(source.geometry,source.material);mesh.matrixAutoUpdate=false;mesh.matrix.copy(b.group.matrixWorld.clone().invert().multiply(source.matrixWorld));mesh.updateMatrixWorld(true);return mesh;},treadLocal=localMesh(treads);
 for(const part of added){
  const radius=Math.hypot(part.p.x,part.p.z),a=Math.atan2(part.p.z,part.p.x),inner=radius<16,inv=part.matrix.clone().invert();
  near(new T.Vector3(0,1,0).applyQuaternion(part.q).y,1);
  const radial=new T.Vector3(part.p.x,0,part.p.z).normalize();for(const corner of corners(part)){assert(corner.dot(radial)>=13.7&&Math.hypot(corner.x,corner.z)<=18.3&&corner.y>=-48&&corner.y<=.13,'Keep the central well, surrounding shaft and middle handoff clear');}
  // Clamp the anchor samples to this actual tread's angular interval. The
  // final offset arch lies just before a riser, unlike the boundary arches.
  const shoe=shoes.includes(part),footY=part.p.y+(shoe?.15:part.s.y/2),step=LOWER.endTheta/240,index=Math.round((LOWER.topY-footY)/((LOWER.topY-LOWER.bottomY)/240)),centre=(index+.5)*step,
   unwrapped=a+Math.PI*2*Math.round((centre-a)/(Math.PI*2)),limit=shoe?.012:.003,lo=Math.max(-limit,index*step-unwrapped+.0002),hi=Math.min(limit,(index+1)*step-unwrapped-.0002);assert(lo<hi);
  for(const d of[lo+(hi-lo)/3,lo+(hi-lo)*2/3]){
   const theta=a+d,r=radius+(inner?-1:1)*(part.s.z/2+.02),dir=new T.Vector3(Math.cos(theta),0,Math.sin(theta)).multiplyScalar(inner?1:-1),
    hit=new T.Raycaster(new T.Vector3(Math.cos(theta)*r,part.p.y,Math.sin(theta)*r),dir,0,1).intersectObject(treadLocal)[0];
   assert(hit,'Every shoe/clip must engage an original tread side: '+JSON.stringify({index:part.index,p:part.p.toArray(),s:part.s.toArray(),theta,r}));
   const local=hit.point.clone().applyMatrix4(inv);assert(Math.max(Math.abs(local.x),Math.abs(local.y),Math.abs(local.z))<=.5001);anchors++;
  }
  if(clips.includes(part)&&is(part.s.y,.06)){
   const under=shoes.find(a=>Math.abs(a.p.y+a.s.y/2-(part.p.y-part.s.y/2))<1e-4&&Math.hypot(a.p.x-part.p.x,a.p.z-part.p.z)<.35);assert(under);
   for(const v of corners(part).filter(v=>v.y<part.p.y)){onSeat(v,under);sharedSeats++;}
  }
 }
 // Exact 2D separating axes plus vertical intervals reject hidden duplicate
 // volumes between the new boxes, including the first offset arch/guard pair.
 function overlaps(a,c){
  if(Math.min(a.p.y+a.s.y/2,c.p.y+c.s.y/2)-Math.max(a.p.y-a.s.y/2,c.p.y-c.s.y/2)<6e-5)return false;
  const axes=v=>[new T.Vector3(1,0,0).applyQuaternion(v.q),new T.Vector3(0,0,1).applyQuaternion(v.q)];
  for(const axis of[...axes(a),...axes(c)]){const ac=axes(a),cc=axes(c);
   const ea=Math.abs(axis.dot(ac[0]))*a.s.x/2+Math.abs(axis.dot(ac[1]))*a.s.z/2,ec=Math.abs(axis.dot(cc[0]))*c.s.x/2+Math.abs(axis.dot(cc[1]))*c.s.z/2;
   if(ea+ec-Math.abs(axis.dot(a.p.clone().sub(c.p)))<6e-5)return false;
  }return true;
 }
 for(let i=0;i<added.length;i++)for(let j=i+1;j<added.length;j++)assert(!overlaps(added[i],added[j]),'New shoes/clips must butt without overlapping visible volumes');
 const all=added.map(proxy),ray=(from,dir,far,objects)=>new T.Raycaster(from,dir,.0001,far).intersectObjects(objects,false);
 for(let i=0;i<240;i++)for(const f of[.05,.5,.95])for(const r of[14.455,16,17.545]){
  const a=(i+f)/240*LOWER.endTheta,y=LOWER.topY+(LOWER.bottomY-LOWER.topY)*i/240;
  assert.equal(ray(new T.Vector3(Math.cos(a)*r,y+.002,Math.sin(a)*r),new T.Vector3(0,1,0),1.8,all).length,0,'The entire retained walking/headroom band stays clear');clearance++;
 }
 // Existing deck-edge post centres already bear on the symmetric middle deck.
 const deck=localMesh(b.walking.getObjectByName('mid'));
 for(const post of midPosts){const inward=new T.Vector3(16.8-post.p.x,0,-post.p.z).normalize().multiplyScalar(.00002),p=post.p.clone().add(inward);p.y=-47.96;
  const hit=new T.Raycaster(p,down,0,.08).intersectObject(deck)[0];assert(hit);near(hit.point.y,-48);
 }
 // Actual parent half-turn: these remain local supports, not baked coordinates.
 const old=b.group.position.clone(),detached=!b.group.parent;let frame;
 if(detached){frame=new T.Group();frame.matrixAutoUpdate=false;frame.matrix.copy(lowerMatrix(T));b.group.position.set(W.lowerOrigin.x,0,W.lowerOrigin.z);frame.add(b.group);frame.updateMatrixWorld(true);}
 b.group.updateWorldMatrix(true,true);
 for(const foot of feet){const local=foot.p.clone();local.y-=.14;const start=b.group.localToWorld(local.clone().add(new T.Vector3(0,.03,0))),direction=down.clone().transformDirection(b.group.matrixWorld),
  hit=new T.Raycaster(start,direction,0,.06).intersectObject(added[0].mesh)[0];assert(hit);near(b.group.worldToLocal(hit.point.clone()).y,local.y);physical++;}
 if(detached){b.group.removeFromParent();b.group.position.copy(old);b.group.updateMatrixWorld(true);}
 assert.deepEqual([footContacts,postContacts,anchors,sharedSeats,clearance,physical],[104,928,284,96,2160,26]);
 return{ignored,footContacts,postContacts,anchors,sharedSeats,clearance,physical,midContacts:20};
}
