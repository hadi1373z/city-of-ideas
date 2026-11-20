// Shared physical footprint of the approved House of Perspectives.
export const ESCHER_PAVILION=Object.freeze({x:228,z:114,radius:27.5,court:8,eave:5.6,roofRing:7.5,skylight:9.1,wall:.34});
export const pavilionPolygon=(x=228,z=114,r=27.5)=>Array.from({length:6},(_,i)=>[x+r*Math.cos(i*Math.PI/3),z+r*Math.sin(i*Math.PI/3)]);
export const pavilionEntry=(x=228,z=114)=>({x,z:z+27.5*Math.sqrt(3)/2+2.6,y:.13,yaw:0});
export function inPavilion(x,z,cx=228,cz=114,padding=0){const p=pavilionPolygon(cx,cz,27.5+padding);return p.every((a,i)=>{const b=p[(i+1)%6];return(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0])>=0;});}
export function pavilionFootprint(x=228,z=114){return{id:'escher',x,z,shape:'polygon',points:pavilionPolygon(x,z,28),front:[x,z+27.5*Math.sqrt(3)/2],category:'artist',label:'Escher · House of Perspectives'};}
