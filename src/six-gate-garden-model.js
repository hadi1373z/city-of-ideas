import {SIXFOLD_HOUSES,sixfoldHouseEntry} from './sixfold-house-network-model.js';

// The approved garden is a surface layer around the existing seven buildings.
// No tower pose, source doorway, stair, shaft or basement coordinate changes.
export const SIX_GATE_GARDEN=Object.freeze({
 id:'six-gate-garden',x:0,z:0,floor:.13,innerWalkRadius:74,
 ringRadius:105,ringWidth:8,innerColumnRadius:100.1,outerColumnRadius:109.9,
 roofInner:99.5,roofOuter:110.5,roofEave:4.95,roofRidge:5.65,
 gateHalfAngle:.07,baysPerSector:8,gateWidth:9.8,gateInner:111.1,gateOuter:121.1,
 columnRadius:.23,columnBaseRadius:.43,walkWidth:5.2,
 retainedStreetWidth:5.5,retainedCrossingShift:4.5
});
const G=SIX_GATE_GARDEN,TAU=Math.PI*2;
export const gardenPolar=(r,a)=>[r*Math.cos(a),r*Math.sin(a)];
export function gardenWorld(h,u,v){return[u*Math.cos(h.angle)-v*Math.sin(h.angle),u*Math.sin(h.angle)+v*Math.cos(h.angle)];}
const frozen=points=>Object.freeze(points.map(p=>Object.freeze(p)));
const polygon=(u,v,w,d,h)=>frozen([[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([a,b])=>gardenWorld(h,u+a,v+b)));
const route=(id,points,width,kind='garden-walk')=>Object.freeze({id,points:frozen(points),width,kind});
const circle=(radius,n=144)=>Array.from({length:n+1},(_,i)=>gardenPolar(radius,i*TAU/n));

export const GARDEN_GATES=Object.freeze(SIXFOLD_HOUSES.map(h=>Object.freeze({
 id:h.id,name:h.name,angle:h.angle,pattern:h.pattern,house:h,
 point:Object.freeze(gardenPolar(G.ringRadius,h.angle)),
 entry:Object.freeze(sixfoldHouseEntry(h)),
 court:Object.freeze(gardenWorld(h,116,16.5)),
 roof:polygon((G.gateInner+G.gateOuter)/2,0,G.gateOuter-G.gateInner,G.gateWidth+.8,h)
})));

// Existing block streets cross the ring at each sector bisector. Shift only
// that shared column pair tangentially; the neighbouring arches/roof bays use
// the exact same boundary, leaving the original street fully open underneath.
export function gardenBayBoundary(h,index){
 const start=h.angle+G.gateHalfAngle,end=h.angle+Math.PI/3-G.gateHalfAngle;
 return start+(end-start)*index/G.baysPerSector+(index===G.baysPerSector/2?Math.asin(G.retainedCrossingShift/G.innerColumnRadius):0);
}
export const GARDEN_RETAINED_CROSSINGS=Object.freeze(SIXFOLD_HOUSES.map(h=>Object.freeze({
 id:'garden-retained-crossing-'+h.id,angle:h.angle+Math.PI/6,width:G.retainedStreetWidth,
 points:frozen([gardenPolar(92,h.angle+Math.PI/6),gardenPolar(123,h.angle+Math.PI/6)])
})));
export const GARDEN_ARCADE_BAYS=Object.freeze(SIXFOLD_HOUSES.flatMap(h=>{
 return Array.from({length:G.baysPerSector},(_,i)=>{
  const a=gardenBayBoundary(h,i),b=gardenBayBoundary(h,i+1);
  return Object.freeze({id:'garden-arcade-'+h.id+'-'+i,a,b,points:frozen([
   gardenPolar(G.roofInner,a),gardenPolar(G.roofOuter,a),gardenPolar(G.roofOuter,b),gardenPolar(G.roofInner,b)
  ])});
 });
}));

// The six rays begin at an open outer Gallery promenade, not at invented doors.
// Two existing east/west thresholds reach it. House approaches turn around each
// real hexagonal wall to reach its original tangential front doorway.
export const GARDEN_ROUTES=Object.freeze([
 route('garden-inner-promenade',circle(G.innerWalkRadius),5.2),
 route('garden-shaded-loop',circle(G.ringRadius),G.ringWidth),
 route('garden-gallery-east',[[67,0],[74,0]],7),
 route('garden-gallery-west',[[-67,0],[-74,0]],7),
 ...GARDEN_GATES.flatMap(g=>[
  route('garden-ray-'+g.id,[gardenPolar(G.innerWalkRadius,g.angle),gardenPolar(125,g.angle)],6),
  route('garden-door-'+g.id,[[125,0],[125,34],[SIXFOLD_HOUSES[0].x,34],[SIXFOLD_HOUSES[0].x,26]].map(([u,v])=>gardenWorld(g,u,v)),G.walkWidth),
  route('garden-court-'+g.id,[gardenWorld(g,125,16.5),g.court],3.2),
  // This meets the already-existing tangential street at its actual outer end.
  route('garden-street-'+g.id,[gardenWorld(g,SIXFOLD_HOUSES[0].x,34),gardenWorld(g,SIXFOLD_HOUSES[0].x,92)],3.6)
 ])
]);

export const GARDEN_ENTRIES=Object.freeze(GARDEN_GATES.map(g=>Object.freeze({
 id:'garden-'+g.id,x:g.point[0],z:g.point[1],y:G.floor,yaw:-g.angle-Math.PI/2,
 name:g.name+' · garden gate',houseId:g.id
})));

export const GARDEN_SEATS=Object.freeze(GARDEN_GATES.flatMap(g=>[12,21].map(v=>Object.freeze({
 id:'garden-seat-'+g.id+'-'+v,angle:g.angle,point:Object.freeze(gardenWorld(g,116,v)),width:3.6,depth:.9,height:1.14
}))));
export const GARDEN_BEDS=Object.freeze(GARDEN_GATES.map(g=>Object.freeze({
 id:'garden-bed-'+g.id,angle:g.angle,point:Object.freeze(gardenWorld(g,127,-17)),width:9,depth:4,height:.85
})));

const columnRows=[];
for(const g of GARDEN_GATES){
 for(let i=0;i<=G.baysPerSector;i++)for(const radius of[G.innerColumnRadius,G.outerColumnRadius]){
  const angle=gardenBayBoundary(g,i),p=gardenPolar(radius,angle);
  columnRows.push(Object.freeze({id:'garden-column-'+g.id+'-'+i+'-'+radius,x:p[0],z:p[1],radius:G.columnBaseRadius,height:G.roofEave,angle}));
 }
 for(const u of[G.gateInner,G.gateOuter])for(const v of[-G.gateWidth/2,G.gateWidth/2]){
  const p=gardenWorld(g,u,v);columnRows.push(Object.freeze({id:'garden-gate-column-'+g.id+'-'+u+'-'+v,x:p[0],z:p[1],radius:G.columnBaseRadius,height:G.roofEave,angle:g.angle}));
 }
}
export const GARDEN_COLUMNS=Object.freeze(columnRows);
const rectCollider=(o)=>Object.freeze({id:o.id,shape:'rectangle',x:o.point[0],z:o.point[1],angle:o.angle,w:o.depth,d:o.width,height:o.height});
export const GARDEN_COLLIDERS=Object.freeze([
 ...GARDEN_COLUMNS.map(c=>Object.freeze({...c,shape:'circle'})),
 ...GARDEN_SEATS.map(rectCollider),...GARDEN_BEDS.map(rectCollider)
]);
function furnitureFootprint(o){
 const u=o.point[0]*Math.cos(o.angle)+o.point[1]*Math.sin(o.angle),v=-o.point[0]*Math.sin(o.angle)+o.point[1]*Math.cos(o.angle);
 return Object.freeze({id:o.id,x:o.point[0],z:o.point[1],shape:'polygon',points:polygon(u,v,o.depth,o.width,o),category:'garden-furniture',label:o.id.includes('seat')?'Garden seat':'Low planted garden bed'});
}

export const GARDEN_FOOTPRINTS=Object.freeze([
 ...GARDEN_ARCADE_BAYS.map(b=>Object.freeze({id:b.id,x:gardenPolar(G.ringRadius,(b.a+b.b)/2)[0],z:gardenPolar(G.ringRadius,(b.a+b.b)/2)[1],shape:'polygon',points:b.points,category:'garden-arcade',walkThrough:true,label:'Shaded garden promenade'})),
 ...GARDEN_GATES.map(g=>Object.freeze({id:'garden-loggia-'+g.id,x:gardenWorld(g,116.1,0)[0],z:gardenWorld(g,116.1,0)[1],shape:'polygon',points:g.roof,category:'garden-arcade',walkThrough:true,label:g.name+' · open loggia'})),
 ...[...GARDEN_SEATS,...GARDEN_BEDS].map(furnitureFootprint)
]);

function segmentDistance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);}
function insidePolygon(x,z,points){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export function gardenOnRoute(x,z,margin=0){return GARDEN_ROUTES.some(r=>r.points.slice(1).some((b,i)=>segmentDistance(x,z,r.points[i],b)<=r.width/2+margin));}
export function gardenCanStand(x,z,padding=.3){
 if(!Number.isFinite(x)||!Number.isFinite(z))return false;
 return !GARDEN_COLLIDERS.some(o=>{
  const dx=x-o.x,dz=z-o.z;if(o.shape==='circle')return Math.hypot(dx,dz)<o.radius+padding;
  const u=dx*Math.cos(o.angle)+dz*Math.sin(o.angle),v=-dx*Math.sin(o.angle)+dz*Math.cos(o.angle);
  return Math.abs(u)<o.w/2+padding&&Math.abs(v)<o.d/2+padding;
 });
}
// Crown radius is part of the query. Checking trunks alone can put foliage
// inside a roof or above a doorway. Root combines this with all other owners.
export function gardenTreeClear(x,z,crownRadius=3){
 if(![x,z,crownRadius].every(Number.isFinite)||crownRadius<0)return false;
 if(Math.hypot(x,z)<61+crownRadius)return false;
 if(SIXFOLD_HOUSES.some(h=>Math.hypot(x-h.x,z-h.z)<26+crownRadius))return false;
 if(gardenOnRoute(x,z,crownRadius+.5))return false;
 if(GARDEN_RETAINED_CROSSINGS.some(r=>segmentDistance(x,z,r.points[0],r.points[1])<r.width/2+crownRadius+.5))return false;
 if(!gardenCanStand(x,z,crownRadius+.3))return false;
 return GARDEN_FOOTPRINTS.every(p=>!insidePolygon(x,z,p.points)&&p.points.every((b,i)=>segmentDistance(x,z,p.points[(i+p.points.length-1)%p.points.length],b)>crownRadius+.3));
}

export const GARDEN_TREE_CANDIDATES=Object.freeze(GARDEN_GATES.flatMap(g=>[
 [143,-42],[143,49],[180,-37]
].map(([u,v])=>{const p=gardenWorld(g,u,v);return Object.freeze({x:p[0],z:p[1],crownRadius:3.2,gateId:g.id});})).filter(p=>gardenTreeClear(p.x,p.z,p.crownRadius)));

export function gardenSurfaceAt(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return null;
 if(Math.hypot(x,z)<69)return null;
 if(SIXFOLD_HOUSES.some(h=>Math.hypot(x-h.x,z-h.z)<24.4))return null;
 return gardenOnRoute(x,z)||GARDEN_GATES.some(g=>Math.hypot(x-g.court[0],z-g.court[1])<6)?G.floor:null;
}

// An optional landscape dressing for trees which ALREADY exist in the city.
// The caller supplies real world positions and the clearance radius checked
// against every street/building owner. This never proposes/moves a tree and
// must not be fed back into the global tree-exclusion/placement algorithm.
export function gardenTreeBedPlan(positions){
 const beds=[];
 for(const p of positions||[]){
  if(!Number.isFinite(p?.x)||!Number.isFinite(p?.z))continue;
  const radius=Number.isFinite(p.radius)?Math.min(4,p.radius):3.5;
  const trunkRadius=Number.isFinite(p.trunkRadius)?Math.max(.2,Math.min(1.1,p.trunkRadius)):.35,trunkGap=Math.max(.68,trunkRadius+.3);
  if(radius<trunkGap+.55||beds.some(b=>Math.hypot(b.x-p.x,b.z-p.z)<.05))continue;
  const floorY=Number.isFinite(p.floorY)?p.floorY:Number.isFinite(p.y)?Math.max(G.floor,p.y):G.floor;
  const phase=((Math.round(p.x*13)+Math.round(p.z*17))%97)/97*Math.PI*2;
  const outline=frozen(Array.from({length:40},(_,i)=>{
   const a=i*Math.PI/20,r=radius*(.90+.045*Math.sin(a*3+phase)+.035*Math.cos(a*5-phase));return[p.x+r*Math.cos(a),p.z+r*Math.sin(a)];
  }));
  beds.push(Object.freeze({id:'existing-tree-bed-'+beds.length,sourceTreeId:p.id??null,x:p.x,z:p.z,radius,trunkRadius,trunkGap,floorY,edgeHeight:.14,phase,outline}));
 }
 return Object.freeze(beds);
}
