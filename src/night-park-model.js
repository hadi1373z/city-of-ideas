// One presentation transform for the complete original Atlas park. Source
// people, trees, seeds, lesson coordinates and document IDs stay source-local.
const freezePoints=points=>Object.freeze(points.map(p=>Object.freeze(p)));
export const PARK_SOURCE_SITE=Object.freeze({x:0,z:-375,scale:.65,baseY:.015});
export const NIGHT_PARK=Object.freeze({id:'park',face:'lower',x:-2200,z:-430,scale:.65,baseY:.015,groundY:.13,localX:-40,localZ:-365,radius:158});
export const VACATED_PARK_CELLS=freezePoints([[0,-2],[1,-2],[2,-2],[1,-3],[2,-3]]);
export const PARK_SOURCE_LAWNS=freezePoints(VACATED_PARK_CELLS.map(([q,r])=>[Math.sqrt(3)*92*(q+r/2),138*r-PARK_SOURCE_SITE.z]));
export const NIGHT_PARK_LAWNS=Object.freeze(PARK_SOURCE_LAWNS.map(([x,z])=>freezePoints(Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return[NIGHT_PARK.localX+x+Math.sin(a)*92,NIGHT_PARK.localZ+z+Math.cos(a)*92];}))));
export const NIGHT_PARK_ENTRY=Object.freeze({x:-2320,z:-365,y:.13,yaw:Math.atan2(-120,65)});
export const NIGHT_PARK_APPROACH=Object.freeze({id:'night-park-approach',name:'Lantern walk to Ideas Park',width:5,points:freezePoints([[-160,-300],[-130,-316],[-87,-340],[-40,-354]])});
// New fixtures stand alongside the existing source paths, outside the pond.
export const NIGHT_PARK_LANTERNS=freezePoints([[-140,-307],[-111,-333],[-73,-354],[-17,-354],[16,-387],[-42,-420],[-94,-400],[-116,-365],[-45,-321],[-9,-304],[42,-337],[56,-402]]);
export function segmentDistance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);}
function inPolygon(x,z,p){let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export function inNightPark(x,z,margin=0){return Math.hypot(x-NIGHT_PARK.localX,z-NIGHT_PARK.localZ)<=NIGHT_PARK.radius+margin;}
export function nightParkReserve(x,z,margin=0){return inNightPark(x,z,margin)||NIGHT_PARK_LAWNS.some(p=>inPolygon(x,z,p)||p.some((a,i)=>segmentDistance(x,z,a,p[(i+1)%p.length])<=margin));}
export function nightParkPathDistance(x,z){const p=NIGHT_PARK_APPROACH.points;return Math.min(...p.slice(1).map((b,i)=>segmentDistance(x,z,p[i],b)));}
export function nightParkGround(x,z){return inNightPark(x+2160,z+65,8)?NIGHT_PARK.groundY:undefined;}
export function nightParkCanStand(x,z,feet=.13){return Math.abs(feet-NIGHT_PARK.groundY)>.55||!NIGHT_PARK_LANTERNS.some(([lx,lz])=>Math.hypot(x+2160-lx,z+65-lz)<.48);}
export const NIGHT_PARK_DAY_DESTINATION=Object.freeze({x:0,y:.13,z:-222,yaw:0});
