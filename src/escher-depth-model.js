import {DESCENT,STAIR_PORTAL} from './escher-descent-model.js?v=shore-niches-20261121';
import {CLOISTER_ROOMS,CLOISTER_STAIRS,CLOISTER_GALLERIES,insidePolygon,hexagon,rectangle,ringPolygons,outsidePolygonRectangle} from './escher-cloister-layout.js?v=cloister-20261120';
export {insidePolygon,hexagon,ringPolygons,outsidePolygonRectangle};
export const ESCHER_DEPTH=Object.freeze({floor:-40,ceiling:-23.6,lowerFloor:-46,lowerCeiling:-39.5,radius:.28,
 gallery:Object.freeze({x:135,z:115,y:-40,width:4}),rooms:CLOISTER_ROOMS,galleries:CLOISTER_GALLERIES,stairs:CLOISTER_STAIRS,stair:CLOISTER_STAIRS[0],
 portals:Object.freeze([
 {id:'escher',name:'Escher House · walkable stair',x:228,z:104,y:.13,gated:true,landing:{x:225,z:107,y:-40,yaw:Math.PI}},
 {id:'park',name:'Park approach',x:-84,z:-110,y:.13,landing:{x:174,z:114,y:-40,yaw:-Math.PI/2}},
 {id:'study',name:'Study-house lane',x:256,z:-112,y:.13,landing:{x:221,z:155,y:-40,yaw:Math.PI/2}}]),
 exhibits:Object.freeze([
 {id:'perspective',name:'One triangle, several depths',x:157.63,z:125,y:-40},
 {id:'tessellation',name:'Edges that agree',x:216.69,z:87,y:-40},
 {id:'loop',name:'Can every flight rise?',x:182,z:172,y:-46},
 {id:'reading',name:'Which hand comes first?',x:220,z:151,y:-40}])});
const rect=(id,minX,maxX,minZ,maxZ,y=-40)=>({id,minX,maxX,minZ,maxZ,y});
const inRect=(r,x,z,pad=0)=>x>=r.minX-pad&&x<=r.maxX+pad&&z>=r.minZ-pad&&z<=r.maxZ+pad;
const inFloor=(r,x,z)=>insidePolygon(r.polygon,x,z)&&(!r.inner||!insidePolygon(hexagon(...r.centre,r.inner),x,z));
const shaftBlocked=(x,z)=>inRect(DESCENT.shaft,x,z)&&!(Math.abs(x-225)<=.9&&z>=104);
export const ESCHER_DEPTH_OBSTACLES=Object.freeze([
 rect('west tunnel jamb',134.1,134.65,112,113),rect('west tunnel jamb',134.1,134.65,117,118),
 ...[-1,1].map(side=>{const p=STAIR_PORTAL;return rect('Escher stair jamb',p.x+(side<0?-p.halfWidth:p.opening),p.x+(side<0?-p.opening:p.halfWidth),p.z,p.z+p.depth);}),
 rect('triangle case',150.63,164.63,104,116),rect('tile console',214.69,218.69,81,83),
 rect('loop table',180.7,185.3,163.7,168.3,-46),rect('reading desk',218,222,143,145),
 rect('tessellation screen',208.6,224.8,69.7,70.05),
 rect('court sculpture',195,199,113,117),rect('Möbius plinth',221.5,226.5,152.5,157.5),rect('trefoil plinth',209,213,150,154),
 ...CLOISTER_GALLERIES.filter(r=>r.inner).flatMap(r=>{const p=hexagon(...r.centre,r.inner);return p.flatMap((a,i)=>{const b=p[(i+1)%6];return[0,1/3,2/3].flatMap(t=>[-40,-34].map(y=>{const x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;return rect('arcade pier',x-.19,x+.19,z-.19,z+.19,y);}));});})]);
function stairHeight(s,z){const t=Math.max(0,Math.min(s.steps,Math.ceil((z-s.minZ)/(s.maxZ-s.minZ)*s.steps-1e-9)));return s.top+(s.bottom-s.top)*t/s.steps;}
function floorCandidates(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z)||shaftBlocked(x,z))return[];
 const stairs=CLOISTER_STAIRS.filter(s=>inRect(s,x,z));
 const out=stairs.map(s=>({y:stairHeight(s,z),id:s.id}));
 for(const r of [...CLOISTER_ROOMS,...CLOISTER_GALLERIES]){
  if(!inFloor(r,x,z))continue;
  // Floor openings exactly match the physical stair cuts. Do not snap between storeys.
  if(stairs.some(s=>r.y===s.top))continue;
  if(stairs.some(s=>r.y===s.bottom&&stairHeight(s,z)-r.y<2.25))continue;
  out.push({y:r.y,id:r.id});
 }return out;
}
export function depthFloorAt(x,z,fromY=null){const candidates=floorCandidates(x,z);if(!candidates.length)return null;if(Number.isFinite(fromY))candidates.sort((a,b)=>Math.abs(a.y-fromY)-Math.abs(b.y-fromY));return candidates[0].y;}
export function depthRoomAt(x,z,fromY=null){const candidates=floorCandidates(x,z);if(Number.isFinite(fromY))candidates.sort((a,b)=>Math.abs(a.y-fromY)-Math.abs(b.y-fromY));return candidates[0]?.id??null;}
function supportAt(x,z,y){return floorCandidates(x,z).some(q=>Math.abs(q.y-y)<.32);}
export function canWalkDepth(x,z,{radius=ESCHER_DEPTH.radius,fromY=null}={}){
 const y=depthFloorAt(x,z,fromY);if(y===null||Number.isFinite(fromY)&&Math.abs(y-fromY)>.3)return false;
 // Balustrades forbid stepping off the sides of a flight before its landing,
 // even where the last tread is within a normal step of the adjoining floor.
 for(const s of CLOISTER_STAIRS)if(z>s.minZ+.4&&z<s.maxZ-.4&&Math.abs(y-stairHeight(s,z))<.31&&x>s.minX-radius&&x<s.maxX+radius&&(x<s.minX+radius+.10||x>s.maxX-radius-.10))return false;
 // Erode the union of real polygon floors, rather than each room separately:
 // overlapping corridors retain their full door width and concave corners stay safe.
 for(let i=0;i<12;i++){const a=i*Math.PI/6;if(!supportAt(x+Math.cos(a)*(radius+.10),z+Math.sin(a)*(radius+.10),y))return false;}
 return !ESCHER_DEPTH_OBSTACLES.some(b=>Math.abs(y-b.y)<.4&&inRect(b,x,z,radius));
}
export function walkDepth(player,dx,dz,eye=1.8){
 if(![player.x,player.z,player.y,dx,dz,eye].every(Number.isFinite))return false;
 const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.1));for(let i=0;i<n;i++)for(const axis of['x','z']){const delta=(axis==='x'?dx:dz)/n,y=player.y-eye,x=player.x+(axis==='x'?delta:0),z=player.z+(axis==='z'?delta:0);if(canWalkDepth(x,z,{fromY:y})){player[axis]+=delta;player.y=depthFloorAt(player.x,player.z,y)+eye;}}return true;
}
export const atGalleryHandoff=p=>p.x<=135.15&&p.x>=134.4&&Math.abs(p.z-115)<1.7;
// Subtract openings as vertical intervals. A short corridor does not remove
// the wall above its roof, and ground-floor mouths never become balcony exits.
export function roomCeilingAt(r,x,z){
 if(!r.radius)return r.ceiling;
 const [cx,cz]=r.centre,apothem=r.radius*Math.cos(Math.PI/6);let f=0;
 for(let i=0;i<6;i++){const a=r.polygon[i],b=r.polygon[(i+1)%6],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);f=Math.max(f,((x-cx)*dz-(z-cz)*dx)/len/apothem);}
 f=Math.max(0,Math.min(1,f));const step=f*12,j=Math.min(11,Math.floor(step)),t=step-j,height=k=>r.spring+(r.ceiling-r.spring)*(1-(k/12)**2);return height(j)*(1-t)+height(j+1)*t;
}
const walls=[];
for(const r of CLOISTER_ROOMS){if(r.shaftLanding)continue;for(let i=0;i<r.polygon.length;i++){
 const a=r.polygon[i],b=r.polygon[(i+1)%r.polygon.length],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),n=Math.ceil(len/.24),top=r.spring??r.ceiling,rows=[];
 for(let j=0;j<n;j++){
  const t=(j+.5)/n,x=a[0]+dx*t,z=a[1]+dz*t,ox=x+dz/len*.24,oz=z-dx/len*.24,holes=[];
  for(const q of CLOISTER_ROOMS)if(q!==r&&Math.abs(q.y-r.y)<.1&&insidePolygon(q.polygon,ox,oz))holes.push([q.y-.02,roomCeilingAt(q,ox,oz)-.02]);
  if(r.id==='vestibule'&&Math.abs(x-134.4)<.01&&Math.abs(z-115)<2)holes.push([-40.3,-35.2]);
  if((r.id==='hall'||r.id==='loop')&&inRect(CLOISTER_STAIRS[0],x,z,.25))holes.push([CLOISTER_STAIRS[0].bottom-.2,CLOISTER_STAIRS[0].ceiling]);
  let bands=[[r.y,top]];for(const[lo,hi]of holes)bands=bands.flatMap(([y0,y1])=>hi<=y0||lo>=y1?[[y0,y1]]:[[y0,Math.min(y1,lo)],[Math.max(y0,hi),y1]].filter(([a,b])=>b-a>.015));
  for(const[y0,y1]of bands){const previous=rows.find(v=>v.end===j&&Math.abs(v.y0-y0)<.025&&Math.abs(v.y1-y1)<.025);if(previous)previous.end=j+1;else rows.push({start:j,end:j+1,y0,y1});}
 }
 for(const v of rows){const x0=a[0]+dx*v.start/n,z0=a[1]+dz*v.start/n,x1=a[0]+dx*v.end/n,z1=a[1]+dz*v.end/n;walls.push(Object.freeze({id:'wall',a:[x0,z0],b:[x1,z1],minX:Math.min(x0,x1)-.18,maxX:Math.max(x0,x1)+.18,minZ:Math.min(z0,z1)-.18,maxZ:Math.max(z0,z1)+.18,y:v.y0,height:v.y1-v.y0,room:r.id,decorative:Math.abs(v.y0-r.y)<.01&&v.y1-v.y0>4.5}));}
}}
export const ESCHER_DEPTH_WALLS=Object.freeze(walls);
// Triangle sides occupy different distances along rays from a single eye point.
export const DEPTH_VIEW=Object.freeze({x:157.63,y:-38.2,z:125});
export const DEPTH_FOCUS=Object.freeze({x:157.63,y:-34.2,z:105});
const triangle=[{x:153.63,y:-37,z:105},{x:161.63,y:-37,z:105},{x:157.63,y:-30.5,z:105}];
const ray=(p,k)=>({x:DEPTH_VIEW.x+(p.x-DEPTH_VIEW.x)*k,y:DEPTH_VIEW.y+(p.y-DEPTH_VIEW.y)*k,z:DEPTH_VIEW.z+(p.z-DEPTH_VIEW.z)*k});
export const DEPTH_TRIANGLE=Object.freeze([.60,1,.78].map((k,i)=>Object.freeze([ray(triangle[i],k),ray(triangle[(i+1)%3],k)])));
export function perspectiveClosure(eye){
 if(!eye||![eye.x,eye.y,eye.z].every(Number.isFinite))return Infinity;
 const project=p=>{const dz=p.z-eye.z;if(Math.abs(dz)<1e-8)return null;return{x:(p.x-eye.x)/dz,y:(p.y-eye.y)/dz};};
 let max=0;for(let i=0;i<3;i++){const a=project(DEPTH_TRIANGLE[i][1]),b=project(DEPTH_TRIANGLE[(i+1)%3][0]);if(!a||!b)return Infinity;max=Math.max(max,Math.hypot(a.x-b.x,a.y-b.y));}return max;
}
export function perspectiveAligned(player,eye=1.8){
 const expected=ESCHER_DEPTH.floor+eye,d=Math.hypot(player.x-DEPTH_VIEW.x,player.z-DEPTH_VIEW.z,player.y-expected);
 const yaw=Math.atan2(-(DEPTH_FOCUS.x-player.x),-(DEPTH_FOCUS.z-player.z));
 const pitch=Math.atan2(DEPTH_FOCUS.y-player.y,Math.hypot(DEPTH_FOCUS.x-player.x,DEPTH_FOCUS.z-player.z));
 const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
 return d<.34&&perspectiveClosure(player)<.004&&Math.abs(wrap((player.yaw??0)-yaw))<.17&&Math.abs((player.pitch??0)-pitch)<.16;
}

export function edgeProfile(t,motif=0){
 const u=Math.max(0,Math.min(1,t));
 return motif%3===0?.24*Math.sin(2*Math.PI*u):motif%3===1?.31*Math.sin(Math.PI*u)*(u<.5?1:.35):.25*Math.sin(2*Math.PI*u)**3;
}
export function tilePolygon({motif=0,pairX=false,pairZ=false}={}){
 const out=[],n=32;
 for(let i=0;i<n;i++){const t=i/n;out.push([2*t,edgeProfile(t,motif)]);}
 for(let i=0;i<n;i++){const t=i/n;out.push([2+(pairX?1:-1)*edgeProfile(t,motif+1),2*t]);}
 for(let i=0;i<n;i++){const t=1-i/n;out.push([2*t,2+(pairZ?1:-1)*edgeProfile(t,motif)]);}
 for(let i=0;i<n;i++){const t=1-i/n;out.push([edgeProfile(t,motif+1),2*t]);}
 return out;
}
export function tileMismatch({motif=0,pairX=false,pairZ=false}={}){
 let x=0,z=0;for(let i=0;i<=64;i++){const t=i/64;x=Math.max(x,Math.abs((pairX?0:2)*edgeProfile(t,motif+1)));z=Math.max(z,Math.abs((pairZ?0:2)*edgeProfile(t,motif)));}return{x,z,solved:x<1e-8&&z<1e-8};
}
export function loopResult(directions=[1,1,1,1]){
 if(!Array.isArray(directions)||directions.length!==4||directions.some(d=>d!==1&&d!==-1))throw new TypeError('Four flights must each be up (+1) or down (-1).');
 const heights=[0];for(const d of directions)heights.push(heights.at(-1)+d*2);
 return{heights,rise:heights.at(-1),closed:heights.at(-1)===0,allUp:directions.every(d=>d===1)};
}
