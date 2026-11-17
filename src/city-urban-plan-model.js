import './artist-quarter-layout.js';
import {BUILT_HONEYCOMB_LAYOUT} from './honeycomb-city-layout.js';
import {HEX_DISTRICTS,INHABITED_BLOCKS} from './city-hex-layout.js';
import {FOUNDATION_HOUSES,FOUNDATION_ROUTES,houseEntry} from './foundation-houses-data.js?v=city-night-20261117';
import {SEMINAR_HOUSES,SEMINAR_PATHS,seminarEntry} from './seminar-houses-data.js?v=city-night-20261117';
import {STUDY_HOUSES,STUDY_PATHS} from './study-houses-data.js?v=city-night-20261117';
import {PAVILIONS,pavilionTurn} from './mathematical-pavilions-model.js?v=city-night-20261117';
import {PHILOSOPHERS,quarterPaths} from './philosopher-data.js?v=city-night-20261117';
import {COAST_ROUTES,HOUSE_ORIGAMI} from './origami-house-math.js?v=city-night-20261117';
import {COAST_MAIN_PATHS} from './coastal-map-data.js?v=city-night-20261117';

// A regular city fabric joins the original inhabited districts. Private homes
// retain source-local designs and now occupy the lower face.
export const PRIVATE_HOME_RESERVE=Object.freeze({face:'lower',minX:-202,maxX:-40,minZ:145,maxZ:515});
export const CIVIC_CORE=Object.freeze({radius:108,promenadeRadius:76,rotation:Math.PI/12,avenueWidth:6,courtRadius:4.8,courtDistance:92,courtOffset:9});
const polar=(r,a)=>[r*Math.cos(a),r*Math.sin(a)],axes=Array.from({length:6},(_,i)=>CIVIC_CORE.rotation+i*Math.PI/3),vertices=axes.map(a=>polar(CIVIC_CORE.radius,a));
export const CIVIC_CORE_STREETS=Object.freeze([
 {id:'sixfold-hexagon',width:6,points:[...vertices,vertices[0]]},
 {id:'gallery-promenade',width:4.5,points:Array.from({length:97},(_,i)=>polar(CIVIC_CORE.promenadeRadius,i*Math.PI/48))},
 ...axes.map((a,i)=>({id:'civic-view-'+(i+1),width:CIVIC_CORE.avenueWidth,points:[polar(CIVIC_CORE.promenadeRadius,a),vertices[i]]}))
]);
export const CIVIC_PAIRED_COURTS=Object.freeze(axes.flatMap((angle,axis)=>[-1,1].map(side=>({id:'paired-court-'+axis+'-'+(side<0?'left':'right'),axis,side,shape:'hex',radius:CIVIC_CORE.courtRadius,x:CIVIC_CORE.courtDistance*Math.cos(angle)-side*CIVIC_CORE.courtOffset*Math.sin(angle),z:CIVIC_CORE.courtDistance*Math.sin(angle)+side*CIVIC_CORE.courtOffset*Math.cos(angle),turn:angle+Math.PI/6,tone:'civic'}))));
export const ARCADE_STREETS=INHABITED_BLOCKS.map((c,i)=>({id:'arcade-'+i,width:3.2,kind:'lane',points:Array.from({length:7},(_,j)=>[c.x+82.5*Math.cos(Math.PI/6+j*Math.PI/3),c.z+82.5*Math.sin(Math.PI/6+j*Math.PI/3)])}));
const RETAINED_URBAN_STREETS=[...CIVIC_CORE_STREETS,...ARCADE_STREETS,{id:'gallery-west',width:5.2,points:[[-64,0],[-170,0]]},{id:'park-approach',width:5.2,points:[[-138,-150],[0,-185],[0,-195]]},{id:'east-garden-avenue',width:5.2,points:[[64,0],[62.5,-46],[64,-160]]},{id:'southern-learning-walk',width:5.2,points:[[0,110],[0,220]]},...COAST_MAIN_PATHS.map((points,i)=>({id:'campus-approach-'+i,width:5.2,points}))];
export const URBAN_COURTS=[
 ...CIVIC_PAIRED_COURTS,
 ...FOUNDATION_HOUSES.map(h=>({id:h.id+'-forecourt',x:houseEntry(h).x,z:h.z,width:15,depth:26,tone:'letters'})),
 {id:'study-court',x:229,z:-112,width:54,depth:13,tone:'making'},
 ...SEMINAR_HOUSES.map(h=>({id:h.id+'-hex-court',x:h.x,z:138,shape:'hex',radius:18,turn:Math.PI/6,tone:'garden'}))
];
const rect=(id,x,z,width,depth,turn=0,extra={})=>({id,x,z,shape:'polygon',width,depth,turn,points:[[-width/2,-depth/2],[width/2,-depth/2],[width/2,depth/2],[-width/2,depth/2]].map(([a,b])=>[x+a*Math.cos(turn)+b*Math.sin(turn),z+b*Math.cos(turn)-a*Math.sin(turn)]),front:[x+Math.sin(turn)*depth/2,z+Math.cos(turn)*depth/2],...extra});
export function urbanCourtOutline(c){if(c.shape==='hex')return Array.from({length:6},(_,i)=>[c.x+c.radius*Math.cos(c.turn+i*Math.PI/3),c.z+c.radius*Math.sin(c.turn+i*Math.PI/3)]);return[[c.x-c.width/2,c.z-c.depth/2],[c.x+c.width/2,c.z-c.depth/2],[c.x+c.width/2,c.z+c.depth/2],[c.x-c.width/2,c.z+c.depth/2]];}
// Footprints describe the source floors/walls, never invented icon sizes. The
// southwest home reserve is shown as a district, without reading saved designs.
export function urbanBuildingFootprints(plan=globalThis.ARTIST_QUARTER_PLAN){return[
 ...FOUNDATION_HOUSES.map(h=>rect(h.id,h.x,h.z,h.width,h.depth,h.turn,{category:'letters',label:h.names.en})),
 ...PHILOSOPHERS.map(h=>rect(h.id,h.x,h.z,20,22,0,{category:'philosopher',label:h.name[1]})),
 ...STUDY_HOUSES.map(h=>rect(h.id,h.x,h.z,16,12,h.turn,{category:'study',label:h.names.en})),
 rect('proof-atelier',215,-78,18,20,0,{category:'study',label:'Proof Atelier · six workshops'}),
 ...SEMINAR_HOUSES.map(h=>h.id==='noether'?{id:h.id,x:h.x,z:h.z,shape:'circle',radius:14.2,category:'seminar',label:h.names.en}:rect(h.id,h.x,h.z,27,23,Math.PI,{category:'seminar',label:h.names.en})),
 ...PAVILIONS.map(h=>({id:h.id,x:h.x,z:h.z,shape:'polygon',points:Array.from({length:6},(_,i)=>{const t=-pavilionTurn(h)+i*Math.PI/3;return[h.x+13.4*Math.cos(t),h.z+13.4*Math.sin(t)];}),category:'pattern',label:h.name})),
 {id:'transformations',x:125,z:0,shape:'polygon',points:Array.from({length:6},(_,i)=>[125+23*Math.cos(i*Math.PI/3),23*Math.sin(i*Math.PI/3)]),category:'pattern',label:'House of Transformations'},
 ...Object.entries(plan?.galleries||{}).map(([id,[x,z]])=>rect(id,x,z,9.45,8.1,0,{category:'artist',label:id.replaceAll('-',' '),front:[x,z+Math.sign((plan.fronts?.[id]?.[1]??z+1)-z)*4.05]})),
 ...Object.entries(plan?.studios||{}).map(([id,h])=>rect(id,h.x,h.z,14,12,h.turn,{category:'artist',label:id})),
 ...(plan?[rect('dali',plan.dali.x,plan.dali.z,16.2,13.5,0,{category:'artist',label:'Dalí’s dream residence'}),{id:'escher',x:plan.escher.x,z:plan.escher.z,shape:'polygon',points:[[-4,7],[4,7],[4,-7],[1.6,-7],[1.6,-13],[-1.6,-13],[-1.6,-7],[-4,-7]].map(([x,z])=>[x+plan.escher.x,z+plan.escher.z]),front:[plan.escher.x,plan.escher.z+7],category:'artist',label:'Escher · perspective house'}]:[]),
 rect('origami',HOUSE_ORIGAMI.x,HOUSE_ORIGAMI.z,HOUSE_ORIGAMI.width,HOUSE_ORIGAMI.depth,0,{category:'making',label:'House of Origami'})
 ];}
export function segmentDistance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],u=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x-a[0]-dx*u,z-a[1]-dz*u);}
export function artistDoorRoutes(plan=globalThis.ARTIST_QUARTER_PLAN){if(!plan)return[];return[...Object.entries(plan.galleries).map(([id,[x,z]])=>({id:'artist-door-'+id,width:2.5,points:[[x,z+Math.sign(plan.fronts[id][1]-z)*4.995],plan.fronts[id]]})),...Object.entries(plan.studios).map(([id,h])=>({id:'artist-door-'+id,width:3,points:[[h.x,h.z+(h.turn?-6:6)],plan.fronts[id]]})),{id:'artist-door-dali',width:3,points:[[plan.dali.x,plan.dali.z+7.83],plan.fronts.dali]},{id:'artist-door-escher',width:3,points:[[plan.escher.x,plan.escher.z+8.4],plan.fronts.escher]}];}
export function urbanRoutes(plan=globalThis.ARTIST_QUARTER_PLAN){return [...URBAN_STREETS,...FOUNDATION_ROUTES,...COAST_ROUTES.map(points=>({points,width:4})),...SEMINAR_PATHS.map(points=>({points,width:4.4})),...STUDY_PATHS.map(points=>({points,width:3.5})),...quarterPaths.map(points=>({points,width:4.6})),...PHILOSOPHERS.map(h=>({id:'philosopher-threshold-'+h.id,width:3,points:[[h.x,h.z+10.8],[h.x,h.z+13]]})),...(plan?.routes||[]).map(points=>({points,width:4})),...artistDoorRoutes(plan)];}
export function inPrivateHomeReserve(x,z,margin=0){const r=PRIVATE_HOME_RESERVE;if(r.face!=='upper')return false;return x>r.minX-margin&&x<r.maxX+margin&&z>r.minZ-margin&&z<r.maxZ+margin;}
export function urbanLots(plan=globalThis.ARTIST_QUARTER_PLAN){return[
 ...FOUNDATION_HOUSES.map(h=>({x:h.x,z:h.z,radius:16,id:h.id})),...STUDY_HOUSES.map(h=>({x:h.x,z:h.z,radius:15,id:h.id})),...SEMINAR_HOUSES.map(h=>({x:h.x,z:h.z,radius:18,id:h.id})),...PAVILIONS.map(h=>({...h,radius:22})),...PHILOSOPHERS.map(h=>({...h,radius:16})),
 {id:'gallery',x:0,z:0,radius:76},{id:'transformations',x:125,z:0,radius:34},{id:'park',x:0,z:-330,radius:179},{id:'makers',x:225,z:-50,radius:27},{id:'socrates',x:-96,z:100,radius:28},
 ...Object.entries(plan?.galleries||{}).map(([id,[x,z]])=>({id,x,z,radius:9})),...Object.entries(plan?.studios||{}).map(([id,h])=>({id,...h,radius:12})),...(plan?[{...plan.escher,radius:17,id:'escher'},{...plan.dali,radius:18,id:'dali'}]:[])
 ];}
export function urbanEntries(){return[...FOUNDATION_HOUSES.map(h=>({id:h.id,...houseEntry(h)})),...SEMINAR_HOUSES.map(h=>({id:h.id,...seminarEntry(h)})),...STUDY_HOUSES.map(h=>({id:h.id,x:h.x,z:h.z+(h.turn?-10.7:10.7)})),...PHILOSOPHERS.map(h=>({id:h.id,x:h.x,z:h.z+13})),...Object.entries(globalThis.ARTIST_QUARTER_PLAN?.fronts||{}).map(([id,[x,z]])=>({id,x,z})),{id:'origami',...HOUSE_ORIGAMI.entry}];}
export function urbanPlanting(plan=globalThis.ARTIST_QUARTER_PLAN){const routes=urbanRoutes(plan),lots=urbanLots(plan),points=[];for(const route of [...URBAN_STREETS,...FOUNDATION_ROUTES.filter(r=>r.width>=5)])for(let i=1;i<route.points.length;i++){const a=route.points[i-1],b=route.points[i],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);for(let d=12;d<length-7;d+=23)for(const side of[-1,1]){const offset=route.width/2+4.5,x=a[0]+dx*d/length-dz/length*offset*side,z=a[1]+dz*d/length+dx/length*offset*side;if(inPrivateHomeReserve(x,z,3)||HONEYCOMB_CITY.walls.some(w=>segmentDistance(x,z,w.a,w.b)<1.5)||lots.some(h=>Math.hypot(x-h.x,z-h.z)<h.radius+3)||routes.some(r=>r.points.slice(1).some((q,j)=>segmentDistance(x,z,r.points[j],q)<r.width/2+3))||points.some(p=>Math.hypot(x-p.x,z-p.z)<9))continue;points.push({x,z});}}return points;}

// The new physical honeycomb uses the same source footprints as the map.
const retainedRoutes=[...RETAINED_URBAN_STREETS,...FOUNDATION_ROUTES,...COAST_ROUTES.map(points=>({points,width:4})),...SEMINAR_PATHS.map(points=>({points,width:4.4})),...STUDY_PATHS.map(points=>({points,width:3.5})),...quarterPaths.map(points=>({points,width:4.6})),...(globalThis.ARTIST_QUARTER_PLAN?.routes||[]).map(points=>({points,width:4})),...artistDoorRoutes()];
const retainedFurniture=[...(globalThis.ARTIST_QUARTER_PLAN?.seats||[]).map(([x,z],i)=>rect('artist-seat-'+i,x,z,2.7,.8)),...(globalThis.ARTIST_QUARTER_PLAN?.trees||[]).map(([x,z],i)=>({id:'artist-tree-'+i,x,z,shape:'circle',radius:.7})),...[194.023011444505,284.023011444505].map(x=>rect('seminar-seat-'+x,x,120,6.4,2.1))];
export const honeycombInputs=()=>({footprints:[...urbanBuildingFootprints(),...retainedFurniture],retainedRoutes});
export const HONEYCOMB_CITY=BUILT_HONEYCOMB_LAYOUT;
export const URBAN_STREETS=[...RETAINED_URBAN_STREETS,...HONEYCOMB_CITY.roads];
export const CITY_UNDERGROUND_LINKS=Object.freeze([{id:'babel-transformations',name:'Babel — House of Transformations',floorY:-40,points:[[22,0],[70,0],[125,0]],kind:'physical',description:'The existing real underground corridor and both stair routes.'},{id:'escher-museum-spur',name:'Escher museum passage',floorY:-40,points:[[70,0],[70,115],[135,115]],kind:'physical',description:'The real museum corridor beneath the artist courts.'}]);

export function urbanLawnCells(){const h=HONEYCOMB_CITY;return h.cells.filter(c=>[[0,0,h.rules.protectedCore],[0,-330,h.rules.parkRadius]].every(([x,z,r])=>Math.hypot(c.x-x,c.z-z)>r&&c.vertices.every((a,i)=>segmentDistance(x,z,a,c.vertices[(i+1)%6])>r)));}
