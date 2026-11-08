// Original museum geometry. Coordinates are in the ordinary +Y-up city world.
const rect=(id,minX,maxX,minZ,maxZ,y=-40)=>Object.freeze({id,minX,maxX,minZ,maxZ,y});
export const ESCHER_DEPTH=Object.freeze({
 floor:-40,ceiling:-29,lowerFloor:-46,lowerCeiling:-35,radius:.28,
 gallery:Object.freeze({x:135,z:115,y:-40,width:6}),
 rooms:Object.freeze([
  rect('vestibule',134.4,160,105,125),rect('hall',160,194,98,132),
  rect('perspective',194,232,98,132),rect('tessellation',194,232,66,98),
  rect('reading',232,270,98,132),rect('loop',160,232,156,184,-46)
 ]),
 stair:Object.freeze({minX:181,maxX:188,minZ:132,maxZ:156,top:-40,bottom:-46,steps:48}),
 portals:Object.freeze([
  Object.freeze({id:'escher',name:'Escher’s rear alcove',x:228,z:104,y:.13,gated:true,landing:{x:240,z:115,y:-40,yaw:-Math.PI/2}}),
  Object.freeze({id:'park',name:'Park approach',x:-84,z:-110,y:.13,landing:{x:174,z:114,y:-40,yaw:-Math.PI/2}}),
  Object.freeze({id:'study',name:'Study-house lane',x:256,z:-112,y:.13,landing:{x:260,z:121,y:-40,yaw:Math.PI/2}})
 ]),
 exhibits:Object.freeze([
  Object.freeze({id:'perspective',name:'One triangle, several depths',x:213,z:124,y:-40}),
  Object.freeze({id:'tessellation',name:'Edges that agree',x:213,z:73,y:-40}),
  Object.freeze({id:'loop',name:'Can every flight rise?',x:197,z:163,y:-46}),
  Object.freeze({id:'reading',name:'A note on the experiments',x:251,z:116,y:-40})
 ])
});

// Walls are independent of the city surface colliders. Doorways are actual gaps.
const wx=(x,z0,z1,y=-40,height=11)=>({...rect('wall',x-.18,x+.18,z0,z1,y),height});
const wz=(z,x0,x1,y=-40,height=11)=>({...rect('wall',x0,x1,z-.18,z+.18,y),height});
export const ESCHER_DEPTH_WALLS=Object.freeze([
 wx(135,105,112),wx(135,118,125),wz(105,135,160),wz(125,135,160),
 wx(160,98,112),wx(160,118,132),wz(98,160,194),wz(132,160,181),wz(132,188,232),
 wx(194,98,112),wx(194,118,132),wz(98,194,210),wz(98,216,232),
 wx(232,98,112),wx(232,118,132),wz(98,232,270),wz(132,232,270),wx(270,98,132),
 wx(194,66,98),wz(66,194,232),wx(232,66,98),
 wx(181,132,156,-46,17),wx(188,132,156,-46,17),
 wz(156,160,181,-46),wz(156,188,232,-46),wx(160,156,184,-46),wx(232,156,184,-46),wz(184,160,232,-46)
]);
export const ESCHER_DEPTH_OBSTACLES=Object.freeze([
 rect('triangle case',206,220,103,115),rect('tile console',208,218,77,81),
 rect('loop table',190,204,166,180,-46),rect('reading desk',248,255,106,110)
]);
const inRect=(r,x,z,pad=0)=>x>=r.minX-pad&&x<=r.maxX+pad&&z>=r.minZ-pad&&z<=r.maxZ+pad;
export function depthFloorAt(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return null;
 const s=ESCHER_DEPTH.stair;
 if(inRect(s,x,z)){const t=Math.max(0,Math.min(s.steps,Math.ceil((z-s.minZ)/(s.maxZ-s.minZ)*s.steps-1e-9)));return s.top+(s.bottom-s.top)*t/s.steps;}
 return ESCHER_DEPTH.rooms.find(r=>inRect(r,x,z))?.y??null;
}
export function depthRoomAt(x,z){
 return inRect(ESCHER_DEPTH.stair,x,z)?'stair':ESCHER_DEPTH.rooms.find(r=>inRect(r,x,z))?.id??null;
}
export function canWalkDepth(x,z,{radius=ESCHER_DEPTH.radius,fromY=null}={}){
 const y=depthFloorAt(x,z);if(y===null||Number.isFinite(fromY)&&Math.abs(y-fromY)>.3)return false;
 return ![...ESCHER_DEPTH_WALLS,...ESCHER_DEPTH_OBSTACLES].some(b=>inRect(b,x,z,radius)&&Math.abs(y-b.y)<18);
}
export function walkDepth(player,dx,dz,eye=1.8){
 if(![player.x,player.z,player.y,dx,dz,eye].every(Number.isFinite))return false;
 const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.1));
 for(let i=0;i<n;i++){
  let y=player.y-eye;
  if(canWalkDepth(player.x+dx/n,player.z,{fromY:y})){player.x+=dx/n;player.y=depthFloorAt(player.x,player.z)+eye;}
  y=player.y-eye;
  if(canWalkDepth(player.x,player.z+dz/n,{fromY:y})){player.z+=dz/n;player.y=depthFloorAt(player.x,player.z)+eye;}
 }
 return true;
}
export const atGalleryHandoff=p=>p.x<=135.15&&p.x>=134.4&&Math.abs(p.z-115)<2.5;

// Triangle sides occupy different distances along rays from a single eye point.
export const DEPTH_VIEW=Object.freeze({x:213,y:-38.2,z:124});
export const DEPTH_FOCUS=Object.freeze({x:213,y:-34.2,z:104});
const triangle=[{x:209,y:-37,z:104},{x:217,y:-37,z:104},{x:213,y:-30.5,z:104}];
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
