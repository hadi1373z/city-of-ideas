import assert from 'node:assert/strict';
import {
 ESCHER_DEPTH as D,ESCHER_DEPTH_WALLS as walls,ESCHER_DEPTH_OBSTACLES as obstacles,
 depthFloorAt,depthRoomAt,canWalkDepth,walkDepth,atGalleryHandoff,
 DEPTH_VIEW,DEPTH_FOCUS,DEPTH_TRIANGLE,perspectiveClosure,perspectiveAligned,
 tilePolygon,tileMismatch,loopResult
} from '../src/escher-depth-model.js';

const eye=1.8,near=(a,b,eps=1e-8)=>assert(Math.abs(a-b)<eps,`${a} ≠ ${b}`);
const visitor=(x,z)=>({x,z,y:depthFloorAt(x,z)+eye,yaw:0,pitch:0});

// Search the actual floor/collider space, then walk the recovered routes. A list
// of declared room neighbours alone would not catch a blocked doorway or tread.
const key=(x,z)=>`${x},${z}`,start=[136,115],queue=[start],parents=new Map([[key(...start),null]]);
for(let head=0;head<queue.length;head++){
 const [x,z]=queue[head],y=depthFloorAt(x,z);
 for(const [dx,dz]of[[.5,0],[-.5,0],[0,.5],[0,-.5]]){
  const nx=x+dx,nz=z+dz,k=key(nx,nz);
  if(parents.has(k)||!canWalkDepth(nx,nz,{fromY:y}))continue;
  parents.set(k,[x,z]);queue.push([nx,nz]);
 }
}
const destinations=[
 ['hall',174,114],['perspective',213,124],['tessellation',213,73],
 ['reading',260,121],['stair',184.5,144],['loop',174,170],
 ...D.portals.map(p=>[p.id,p.landing.x,p.landing.z]),
 ...D.exhibits.map(p=>[p.id,p.x,p.z])
];
for(const [name,x,z]of destinations){
 assert(parents.has(key(x,z)),`${name} must be reachable through the shared interior`);
 const route=[];for(let p=[x,z];p;p=parents.get(key(...p)))route.push(p);route.reverse();
 const p=visitor(...start);
 for(const [nx,nz]of route.slice(1)){
  const oldY=p.y;
  assert(walkDepth(p,nx-p.x,nz-p.z,eye));near(p.x,nx);near(p.z,nz);
  near(p.y,depthFloorAt(nx,nz)+eye);assert(Math.abs(p.y-oldY)<=.126,'A route changes height by one physical tread at most');
 }
 near(p.x,x);near(p.z,z);
 // The same doors and stair remain traversable in the reverse direction.
 for(const [nx,nz]of route.slice(0,-1).reverse()){walkDepth(p,nx-p.x,nz-p.z,eye);near(p.x,nx);near(p.z,nz);}
 near(p.y,D.floor+eye);
}
assert(queue.length>20000,'The museum supplies substantial connected floor space');

const s=D.stair;
for(let i=0;i<s.steps;i++){
 const z=s.minZ+(i+.5)*(s.maxZ-s.minZ)/s.steps;
 near(depthFloorAt(184.5,z),s.top+(i+1)*(s.bottom-s.top)/s.steps);
 assert.equal(depthRoomAt(184.5,z),'stair');
}
near(depthFloorAt(184.5,s.minZ),s.top);near(depthFloorAt(184.5,s.maxZ),s.bottom);
const descending=visitor(184.5,131);
for(let i=0;i<260;i++)walkDepth(descending,0,.1,eye);
near(descending.z,157,1e-7);near(descending.y,D.lowerFloor+eye);
for(let i=0;i<260;i++)walkDepth(descending,0,-.1,eye);
near(descending.z,131,1e-7);near(descending.y,D.floor+eye);

// Cases, masonry, voids and corners remain barriers even under a large frame.
for(const b of [...walls,...obstacles])assert(!canWalkDepth((b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2),`Solid ${b.id} cannot be walked through`);
assert.equal(depthFloorAt(150,140),null);assert(!canWalkDepth(150,140));
for(const v of[NaN,Infinity,-Infinity]){assert.equal(depthFloorAt(v,115),null);assert(!canWalkDepth(174,v));}
assert(!canWalkDepth(174,114,{fromY:-46}),'Different levels do not silently snap together');
const large=visitor(213,120);walkDepth(large,0,-20,eye);
assert(large.z>=115+D.radius&&large.z<116,'A large move stops at the triangle case');
const partition=visitor(190,105);walkDepth(partition,12,0,eye);
assert(partition.x<194-D.radius,'Substeps prevent tunnelling through an internal wall');
const diagonal=visitor(230,130);walkDepth(diagonal,30,30,eye);
assert(canWalkDepth(diagonal.x,diagonal.z));assert(diagonal.z<132-D.radius,'Diagonal sliding cannot clip an outer corner');
const invalid=visitor(174,114),before={...invalid};
assert.equal(walkDepth(invalid,NaN,0,eye),false);assert.deepEqual(invalid,before);

// The six-metre gallery threshold is an intentional aperture, including room
// for a visitor's radius. Adjacent wall faces and other perimeter walls stay shut.
assert.equal(D.gallery.width,6);
for(let z=112.5;z<=117.5;z+=.5)assert(canWalkDepth(135,z),`Gallery gap closed at z=${z}`);
for(const z of[106,110,112,118,121,124])assert(!canWalkDepth(135,z));
for(const [x,z]of[[270,115],[160,101],[213,66],[194,81],[232,81],[170,184]])assert(!canWalkDepth(x,z));
assert(atGalleryHandoff({x:135,z:115}));assert(!atGalleryHandoff({x:136,z:115}));assert(!atGalleryHandoff({x:135,z:110}));
for(const p of D.portals){assert(canWalkDepth(p.landing.x,p.landing.z));near(depthFloorAt(p.landing.x,p.landing.z),p.landing.y);}
assert.deepEqual(D.portals.map(p=>[p.id,p.x,p.z]),[['escher',228,104],['park',-84,-110],['study',256,-112]]);
assert.equal(D.portals.find(p=>p.id==='escher').gated,true);

// A closed screen-space triangle has genuinely disconnected endpoints in space.
for(let i=0;i<3;i++){
 const a=DEPTH_TRIANGLE[i][1],b=DEPTH_TRIANGLE[(i+1)%3][0];
 assert(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)>2);
}
assert(perspectiveClosure(DEPTH_VIEW)<1e-12);
const aligned={...DEPTH_VIEW,yaw:0,pitch:Math.atan2(DEPTH_FOCUS.y-DEPTH_VIEW.y,DEPTH_VIEW.z-DEPTH_FOCUS.z)};
assert(perspectiveAligned(aligned));
for(const dx of[-3.5,3.5]){const p={...aligned,x:aligned.x+dx};assert(perspectiveClosure(p)>.02);assert(!perspectiveAligned(p));}
assert(!perspectiveAligned({...aligned,yaw:Math.PI}),'Looking away cannot solve perspective');
assert(!perspectiveAligned({...aligned,pitch:-.6}));assert(!perspectiveAligned({...aligned,y:aligned.y+2}));
assert.equal(perspectiveClosure({x:NaN,y:0,z:0}),Infinity);

// Compare opposite *geometric* polygon edges after translating one tile. This
// verifies what the mosaic draws, independently of its solved-state flag.
for(let motif=0;motif<3;motif++)for(const pairX of[false,true])for(const pairZ of[false,true]){
 const state={motif,pairX,pairZ},poly=tilePolygon(state),r=tileMismatch(state);
 assert.equal(poly.length,128);assert(poly.flat().every(Number.isFinite));
 let seamX=0,seamZ=0;
 for(let i=1;i<32;i++){
  const top=poly[i],right=poly[32+i],bottom=poly[96-i],left=poly[128-i];
  near(top[0],bottom[0]);near(right[1],left[1]);
  seamX=Math.max(seamX,Math.abs(right[0]-(left[0]+2)));
  seamZ=Math.max(seamZ,Math.abs(bottom[1]-(top[1]+2)));
 }
 assert.equal(seamX<1e-8,pairX);assert.equal(seamZ<1e-8,pairZ);
 near(r.x,seamX,.03);near(r.z,seamZ,.03);assert.equal(r.solved,pairX&&pairZ);
 if(pairX&&pairZ){let twiceArea=0;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];twiceArea+=a[0]*b[1]-a[1]*b[0];}near(Math.abs(twiceArea)/2,4);}
}

let closedCount=0;
for(let mask=0;mask<16;mask++){
 const dirs=Array.from({length:4},(_,i)=>mask&(1<<i)?1:-1),r=loopResult(dirs),sum=dirs.reduce((a,b)=>a+b,0)*2;
 assert.equal(r.rise,sum);assert.equal(r.closed,sum===0);assert.equal(r.allUp,mask===15);
 assert.equal(r.heights.length,5);for(let i=0;i<4;i++)assert.equal(r.heights[i+1]-r.heights[i],dirs[i]*2);
 if(r.closed)closedCount++;
}
assert.equal(closedCount,6);assert.equal(loopResult().rise,8);assert(!loopResult().closed,'Four rising flights cannot close at the original height');
for(const bad of[[],[1,1,1],[1,1,1,0],[1,1,1,'1'],null])assert.throws(()=>loopResult(bad),TypeError);

console.log(`PASS Escher depth: ${queue.length.toLocaleString('en')} connected floor samples, every room/door/exhibit and reverse route, 48 real treads, collision/void/large-move guards, true tunnel gap, original perspective, translated-edge tessellation and all 16 closed-loop cases`);
