import {DESCENT,DESCENT_ANNEX} from './escher-descent-model.js';
// The hexagon is centred in block(1,1); the original stair shaft stays fixed.
export const ESCHER_PAVILION=Object.freeze({x:239.023011444505,z:138,radius:27.5,court:8,eave:5.6,roofRing:7.5,skylight:9.1,wall:.34});
const P=ESCHER_PAVILION;
export const pavilionPolygon=(x=P.x,z=P.z,r=P.radius)=>Array.from({length:6},(_,i)=>[x+r*Math.cos(i*Math.PI/3),z+r*Math.sin(i*Math.PI/3)]);
export const pavilionEntry=(x=P.x,z=P.z)=>({x,z:z+P.radius*Math.sqrt(3)/2+2.6,y:.13,yaw:0});
export function inPavilion(x,z,cx=P.x,cz=P.z,padding=0){const p=pavilionPolygon(cx,cz,P.radius+padding);return p.every((a,i)=>{const b=p[(i+1)%6];return(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0])>=0;});}
// Explicit historical builder placements keep their original relative alcove.
export function pavilionRearLink(x=P.x,z=P.z){if(Math.abs(x-P.x)>1e-6||Math.abs(z-P.z)>1e-6)return null;const north=z-P.radius*Math.sqrt(3)/2;return{minX:DESCENT.entry.x-1.7,maxX:DESCENT.entry.x+1.7,minZ:DESCENT.south,maxZ:north,axisX:DESCENT.entry.x,doorZ:north,gateZ:north+5.8,entry:{...DESCENT.entry}};}
export function pavilionFootprint(x=P.x,z=P.z){const points=pavilionPolygon(x,z,28),rear=pavilionRearLink(x,z);if(rear){const north=points[4][1];points.splice(5,0,[rear.minX,north],[rear.minX,rear.minZ],...DESCENT_ANNEX.polygon.map(p=>[...p]),[rear.maxX,rear.minZ],[rear.maxX,north]);}return{id:'escher',x,z,shape:'polygon',points,front:[x,z+P.radius*Math.sqrt(3)/2],category:'artist',label:'Escher · House of Perspectives',rearLink:rear};}
