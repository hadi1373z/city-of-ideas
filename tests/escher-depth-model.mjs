import assert from 'node:assert/strict';
import {ESCHER_DEPTH as D,ESCHER_DEPTH_OBSTACLES as obstacles,depthFloorAt,depthRoomAt,canWalkDepth,walkDepth,atGalleryHandoff,DEPTH_VIEW,DEPTH_FOCUS,DEPTH_TRIANGLE,perspectiveClosure,perspectiveAligned,tilePolygon,tileMismatch,loopResult} from '../src/escher-depth-model.js';
const eye=1.8,near=(a,b,e=1e-7)=>assert(Math.abs(a-b)<e,a+' ≠ '+b);
const key=(x,z,y)=>[x,z,Math.round(y*8)].join(','),start=[136,115,-40],queue=[start],parents=new Map([[key(...start),null]]);
// Search all three storeys and both real staircases with the same radius and
// height-aware controller as a visitor. The grid is half a metre, not a graph of
// declared room neighbours; recover and physically walk every destination route.
for(let head=0;head<queue.length;head++){
 const [x,z,y]=queue[head];for(const[dx,dz]of[[.5,0],[-.5,0],[0,.5],[0,-.5]]){
  const nx=x+dx,nz=z+dz;if(!canWalkDepth(nx,nz,{fromY:y}))continue;const ny=depthFloorAt(nx,nz,y),k=key(nx,nz,ny);if(parents.has(k))continue;parents.set(k,[x,z,y]);queue.push([nx,nz,ny]);
 }
}
const destinations=[...D.portals.map(p=>[p.id,p.landing.x,p.landing.z,p.landing.y]),...D.exhibits.map(p=>[p.id,p.x,p.z,p.y]),...D.galleries.filter(r=>r.inner).map(r=>[r.id,r.centre[0],r.centre[1]-r.radius+2,-34]),['court',202,115,-40],['lower east',214,166,-46]];
for(const[name,x,z,y]of destinations){
 const candidates=queue.filter(p=>Math.abs(p[2]-y)<.02&&Math.hypot(p[0]-x,p[1]-z)<.8).sort((a,b)=>Math.hypot(a[0]-x,a[1]-z)-Math.hypot(b[0]-x,b[1]-z));
 assert(candidates.length,name+' must be reachable through supported interior floors');
 const route=[];for(let p=candidates[0];p;p=parents.get(key(...p)))route.push(p);route.reverse();const player={x:start[0],z:start[1],y:start[2]+eye};
 for(const[nx,nz,ny]of route.slice(1)){assert(walkDepth(player,nx-player.x,nz-player.z,eye));near(player.x,nx);near(player.z,nz);near(player.y,ny+eye);}
 for(const[nx,nz,ny]of route.slice(0,-1).reverse()){walkDepth(player,nx-player.x,nz-player.z,eye);near(player.x,nx);near(player.z,nz);near(player.y,ny+eye);}
}
assert(queue.some(p=>p[2]===-34)&&queue.some(p=>p[2]===-46));assert(queue.length>20000,'Substantial real connected museum space');
for(const s of D.stairs){const x=(s.minX+s.maxX)/2;for(let i=0;i<s.steps;i++){const z=s.minZ+(i+.5)*(s.maxZ-s.minZ)/s.steps,y=s.top+(i+1)*(s.bottom-s.top)/s.steps;near(depthFloorAt(x,z,y),y);assert.equal(depthRoomAt(x,z,y),s.id);assert(canWalkDepth(x,z,{fromY:y}));}}
for(const b of obstacles)assert(!canWalkDepth((b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2,{fromY:b.y}),'Solid '+b.id);
for(const v of[NaN,Infinity,-Infinity]){assert.equal(depthFloorAt(v,115),null);assert(!canWalkDepth(174,v));}
assert(!canWalkDepth(174,114,{fromY:-46}));
assert.equal(depthFloorAt(197,166,-46),null,'Lower central well is an actual void');
assert(!canWalkDepth(197,166,{fromY:-46}));
for(let z=112.5;z<=117.5;z+=.5)assert(canWalkDepth(135,z,{fromY:-40}));
for(const z of[110,112,118,120])assert(!canWalkDepth(135,z));
assert(atGalleryHandoff({x:135,z:115}));assert(!atGalleryHandoff({x:136,z:115}));
for(const p of D.portals){assert(canWalkDepth(p.landing.x,p.landing.z,{fromY:p.landing.y}));near(depthFloorAt(p.landing.x,p.landing.z,p.landing.y),p.landing.y);}
assert.deepEqual(D.portals.map(p=>[p.id,p.x,p.z]),[['escher',228,104],['park',-84,-110],['study',256,-112]]);
assert.equal(D.portals[0].gated,true);
assert(D.rooms.filter(r=>r.radius).every(r=>r.polygon.length===6),'Central court and all wings remain actual hexagons');
const large={...DEPTH_VIEW};walkDepth(large,0,-20,eye);assert(large.z>116,'Substeps stop at the perspective case');
const invalid={...DEPTH_VIEW},before={...invalid};assert.equal(walkDepth(invalid,NaN,0),false);assert.deepEqual(invalid,before);
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

console.log(`PASS Escher depth: ${queue.length.toLocaleString('en')} connected floor samples, every room/door/exhibit and reverse route, 96 real treads, collision/void/large-move guards, true tunnel gap, original perspective, translated-edge tessellation and all 16 closed-loop cases`);
