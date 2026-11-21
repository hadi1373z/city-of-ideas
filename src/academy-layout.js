import {HEX_DISTRICTS} from './city-hex-layout.js?v=night-garden-20261121';
export const ACADEMY=Object.freeze({x:HEX_DISTRICTS.philosophers.x,z:0,radius:40.6,houseRadius:14,courtRadius:23,stoaOuter:30.6,entryAngle:2*Math.PI/3});
const angles={plato:-150,aristotle:-90,epicurus:-30,'ibn-sina':30,confucius:90,hypatia:150};
export const academySite=id=>{const a=angles[id]*Math.PI/180;return{x:ACADEMY.x+ACADEMY.radius*Math.cos(a),z:ACADEMY.radius*Math.sin(a),turn:Math.atan2(-Math.cos(a),-Math.sin(a)),angle:a};};
export const philosopherWorld=(h,x,z)=>({x:h.x+x*Math.cos(h.turn)+z*Math.sin(h.turn),z:h.z-x*Math.sin(h.turn)+z*Math.cos(h.turn)});
export const philosopherLocal=(h,x,z)=>({x:(x-h.x)*Math.cos(h.turn)-(z-h.z)*Math.sin(h.turn),z:(x-h.x)*Math.sin(h.turn)+(z-h.z)*Math.cos(h.turn)});
export const philosopherEntry=h=>({...philosopherWorld(h,0,14.7),y:.13,yaw:h.turn});
export const academyPolygon=(radius=23)=>Array.from({length:6},(_,i)=>[ACADEMY.x+radius*Math.cos(i*Math.PI/3),radius*Math.sin(i*Math.PI/3)]);
export const academyHousePolygon=h=>Array.from({length:6},(_,i)=>{const p=philosopherWorld(h,14.45*Math.cos(i*Math.PI/3),14.45*Math.sin(i*Math.PI/3));return[p.x,p.z];});
export const academyEntry=()=>({x:ACADEMY.x-33.5,z:67*Math.sqrt(3)/2,y:.13,yaw:-Math.PI/6});
const gate=[ACADEMY.x-32,64*Math.sqrt(3)/2],entryInner=[ACADEMY.x-9,18*Math.sqrt(3)/2];
export const ACADEMY_PATHS=Object.freeze([[[ACADEMY.x-79.67433714816835,46],[ACADEMY.x-62,46],[ACADEMY.x-36,72*Math.sqrt(3)/2],gate,entryInner,[ACADEMY.x,0]],...Object.keys(angles).map(id=>{const p=philosopherEntry(academySite(id));return[[p.x,p.z],[ACADEMY.x,0]];}),[...academyPolygon(12.5),academyPolygon(12.5)[0]]]);
export const ACADEMY_STOA_FOOTPRINTS=Object.freeze(academyPolygon(30.9).map((p,i)=>({id:'academy-stoa-'+i,shape:'polygon',category:'academy',label:'Academy · shaded walk',x:ACADEMY.x,z:0,points:[p,academyPolygon(30.9)[(i+1)%6],academyPolygon(22.7)[(i+1)%6],academyPolygon(22.7)[i]]})));

export const ACADEMY_GATE_FOOTPRINT=Object.freeze({id:'academy-gateway',shape:'polygon',category:'academy',label:'Academy · gateway',x:ACADEMY.x-32,z:64*Math.sqrt(3)/2,points:[[-4.1,-1.6],[4.1,-1.6],[4.1,1.6],[-4.1,1.6]].map(([u,v])=>[ACADEMY.x-32+u*Math.sqrt(3)/2-v/2,64*Math.sqrt(3)/2+u/2+v*Math.sqrt(3)/2])});
