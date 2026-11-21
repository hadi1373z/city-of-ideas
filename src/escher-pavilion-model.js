import {DESCENT,DESCENT_ANNEX} from './escher-descent-model.js';
// The hexagon is centred in block(1,1); the original stair shaft stays fixed.
export const ESCHER_PAVILION=Object.freeze({x:239.023011444505,z:138,radius:27.5,court:8,eave:5.6,roofRing:7.5,skylight:9.1,wall:.34});
const P=ESCHER_PAVILION;
export const pavilionPolygon=(x=P.x,z=P.z,r=P.radius)=>Array.from({length:6},(_,i)=>[x+r*Math.cos(i*Math.PI/3),z+r*Math.sin(i*Math.PI/3)]);
export const pavilionEntry=(x=P.x,z=P.z)=>({x,z:z+P.radius*Math.sqrt(3)/2+2.6,y:.13,yaw:0});
export function inPavilion(x,z,cx=P.x,cz=P.z,padding=0){const p=pavilionPolygon(cx,cz,P.radius+padding);return p.every((a,i)=>{const b=p[(i+1)%6];return(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0])>=0;});}
// Explicit historical builder placements keep their original relative alcove.
export function pavilionRearLink(x=P.x,z=P.z){
 if(Math.abs(x-P.x)>1e-6||Math.abs(z-P.z)>1e-6)return null;
 const north=z-P.radius*Math.sqrt(3)/2,minX=DESCENT.entry.x-1.7,maxX=DESCENT.entry.x+1.7,crossNorth=108.1,crossSouth=111.5,left=x-1.7,right=x+1.7,gateZ=north;
 // A real centred wall opening, with a level dogleg to the unchanged X228 stair.
 const polygon=[[minX,DESCENT.south],[maxX,DESCENT.south],[maxX,crossNorth],[right,crossNorth],[right,gateZ],[left,gateZ],[left,crossSouth],[minX,crossSouth]];
 const regions=[{minX,maxX,minZ:DESCENT.south,maxZ:crossSouth},{minX:maxX,maxX:right,minZ:crossNorth,maxZ:crossSouth},{minX:left,maxX:right,minZ:crossSouth,maxZ:gateZ}];
 return{minX,maxX,minZ:DESCENT.south,maxZ:north,axisX:DESCENT.entry.x,doorAxisX:x,doorZ:north,gateZ,polygon,regions,crossNorth,crossSouth,route:[[x,gateZ+1.8],[x,(crossNorth+crossSouth)/2],[DESCENT.entry.x,(crossNorth+crossSouth)/2],[DESCENT.entry.x,DESCENT.entry.z]],entry:{...DESCENT.entry}};
}
export function inPavilionRearLink(x,z,rear=pavilionRearLink(),padding=0){if(!rear||!rear.regions.some(r=>x>=r.minX&&x<=r.maxX&&z>=r.minZ&&z<=r.maxZ))return false;if(padding<=0)return true;return rear.polygon.every((a,i)=>{const b=rear.polygon[(i+1)%rear.polygon.length];if(a[1]===b[1]&&(a[1]===rear.minZ||a[1]===rear.gateZ))return true;const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz)>=padding;});}
export function pavilionFootprint(x=P.x,z=P.z){const points=pavilionPolygon(x,z,28),rear=pavilionRearLink(x,z);if(rear){const north=points[4][1],left=rear.doorAxisX-1.7,right=rear.doorAxisX+1.7;points.splice(5,0,[left,north],[left,rear.crossSouth],[rear.minX,rear.crossSouth],[rear.minX,rear.minZ],...DESCENT_ANNEX.polygon.map(p=>[...p]),[rear.maxX,rear.minZ],[rear.maxX,rear.crossNorth],[right,rear.crossNorth],[right,north]);}return{id:'escher',x,z,shape:'polygon',points,front:[x,z+P.radius*Math.sqrt(3)/2],category:'artist',label:'Escher · House of Perspectives',rearLink:rear};}
