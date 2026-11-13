// The existing west wing, in source-local +Y-up coordinates. No saved coordinates change.
export const WING_STAIRS=Object.freeze({floors:8,floorHeight:4,risers:11,rise:2/11,run:.28,
  left:Object.freeze({minX:3.7,maxX:5.1}),right:Object.freeze({minX:5.5,maxX:6.9}),
  back:2,turn:3.4,front:6.2,end:7.6,
  opening:Object.freeze({minX:3.6,maxX:7,minZ:2,maxZ:6.2}),radius:.22,maxStep:.205
});
const within=(n,a,b)=>n>=a-1e-8&&n<=b+1e-8;
let treadCache,landingCache;
export function stairTreads(){if(treadCache)return treadCache;const s=WING_STAIRS,out=[];for(let floor=0;floor<7;floor++)for(let i=1;i<11;i++){
  out.push({floor,flight:0,index:i,minX:s.left.minX,maxX:s.left.maxX,minZ:s.front-i*s.run,maxZ:s.front-(i-1)*s.run,y:floor*4+i*s.rise});
  out.push({floor,flight:1,index:i,minX:s.right.minX,maxX:s.right.maxX,minZ:s.turn+(i-1)*s.run,maxZ:s.turn+i*s.run,y:floor*4+2+i*s.rise});
}return treadCache=Object.freeze(out.map(Object.freeze));}
export function stairLandings(){const s=WING_STAIRS;return landingCache??=Object.freeze(Array.from({length:7},(_,floor)=>Object.freeze({floor,minX:3.7,maxX:6.9,minZ:s.back,maxZ:s.turn,y:floor*4+2})));}
export function floorAtFeet(y,tolerance=.025){const floor=Math.round(y/4);return floor>=0&&floor<8&&Math.abs(y-floor*4)<=tolerance?floor:null;}
export function inStairArea(x,z,margin=0){const b=WING_STAIRS.opening;return within(x,b.minX-margin,b.maxX+margin)&&within(z,b.minZ-margin,WING_STAIRS.end+margin);}
export function inStairOpening(x,z){const b=WING_STAIRS.opening;return x>b.minX&&x<b.maxX&&z>b.minZ&&z<b.maxZ;}
export function stairBarrier(x,z,feet,radius=WING_STAIRS.radius){const s=WING_STAIRS,b=s.opening,clear=radius+.03,k=floorAtFeet(feet,.5);if(k===null)return false;
  if(within(z,b.minZ-clear,b.maxZ+clear)&&[b.minX,b.maxX].some(a=>Math.abs(x-a)<clear))return true;
  if(within(x,b.minX-clear,b.maxX+clear)&&Math.abs(z-b.minZ)<clear)return true;
  if(Math.abs(z-s.front)<clear){if(within(x,5.1-clear,5.5+clear))return true;const lane=k===0?s.right:k===7?s.left:null;if(lane&&within(x,lane.minX-clear,lane.maxX+clear))return true;}return false;
}
// Return one genuine supporting surface at a reachable step height, never a remote floor.
export function stairSurface(x,z,feet,{radius=WING_STAIRS.radius,tolerance=WING_STAIRS.maxStep}={}){
  if(![x,z,feet].every(Number.isFinite)||stairBarrier(x,z,feet,radius))return null;const s=WING_STAIRS,candidates=[],clear=radius+.03;
  if(within(z,s.front,s.end))for(let k=0;k<8;k++)if(within(x,s.left.minX+clear,s.right.maxX-clear))candidates.push({y:k*4,floor:k,kind:'floor-landing'});
  for(const b of stairLandings())if(within(x,b.minX+clear,b.maxX-clear)&&within(z,b.minZ+clear,b.maxZ))candidates.push({...b,kind:'turn-landing'});
  for(const b of stairTreads())if(within(x,b.minX+clear,b.maxX-clear)&&within(z,b.minZ,b.maxZ))candidates.push({...b,kind:'tread'});
  const possible=candidates.filter(q=>Math.abs(q.y-feet)<=tolerance+1e-7);possible.sort((a,b)=>b.y-a.y);return possible[0]||null;
}
export function wingStep(p,dx,dz,{canStand,eye=1.8}={}){
  const s=WING_STAIRS,parts=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.06));let moved=0;
  for(let i=0;i<parts;i++){
    const tryPoint=(x,z)=>{const feet=p.y-eye;if(stairBarrier(x,z,feet))return false;const surface=stairSurface(x,z,feet),level=floorAtFeet(feet,s.maxStep);
      if(surface){p.x=x;p.z=z;p.y=surface.y+eye;return true;}
      // Railings close the sides of the void. Only the front landings lead into it.
      if(inStairOpening(x,z))return false;
      if(level!==null&&canStand?.(x,z,level)!==false){p.x=x;p.z=z;p.y=level*4+eye;return true;}return false;
    };
    const x=p.x+dx/parts,z=p.z+dz/parts;if(tryPoint(x,z)){moved++;continue;}
    if(dx&&tryPoint(x,p.z))moved++;if(dz&&tryPoint(p.x,z))moved++;
  }return{moved,floor:floorAtFeet(p.y-eye)};
}
