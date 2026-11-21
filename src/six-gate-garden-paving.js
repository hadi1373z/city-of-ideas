import {honeycombCells} from './honeycomb-city-model.js?v=night-garden-20261121';
import {SIXFOLD_HOUSES} from './sixfold-house-network-model.js';
import {SIX_GATE_GARDEN as G,GARDEN_GATES,GARDEN_ROUTES,gardenPolar,gardenWorld} from './six-gate-garden-model.js?v=night-garden-20261121';

const EPS=1e-8,TAU=Math.PI*2;
export const GARDEN_STONE_BELT=Object.freeze({inner:58,outer:110.5});
export const GARDEN_PAVING_CELLS=Object.freeze(honeycombCells().filter(c=>Math.max(Math.abs(c.q),Math.abs(c.r),Math.abs(c.q+c.r))<=1));
const area=p=>p.reduce((n,a,i)=>{const b=p[(i+1)%p.length];return n+a[0]*b[1]-a[1]*b[0];},0)/2;
const ccw=p=>area(p)<0?[...p].reverse():p;
const bounds=p=>[Math.min(...p.map(v=>v[0])),Math.max(...p.map(v=>v[0])),Math.min(...p.map(v=>v[1])),Math.max(...p.map(v=>v[1]))];
const intersects=(a,b)=>a[0]<=b[1]+EPS&&a[1]>=b[0]-EPS&&a[2]<=b[3]+EPS&&a[3]>=b[2]-EPS;
const convexInside=(x,z,p)=>p.every((a,i)=>{const b=p[(i+1)%p.length];return(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0])>=-EPS;});
const unionInside=(x,z)=>GARDEN_PAVING_CELLS.some(c=>convexInside(x,z,c.vertices));
const circle=(radius,n=128)=>Array.from({length:n},(_,i)=>gardenPolar(radius,i*TAU/n));
// Protect the actual Gallery floor, not a twelve-metre lawn reserve around it.
// The source's r58 edge torus overlaps this <=4.4mm circumscribed reveal.
const protectedGallery=circle(GARDEN_STONE_BELT.inner/Math.cos(Math.PI/256),256),protectedHouses=SIXFOLD_HOUSES.flatMap(h=>[
 Array.from({length:6},(_,i)=>[h.x+23.15*Math.cos(h.angle+i*Math.PI/3),h.z+23.15*Math.sin(h.angle+i*Math.PI/3)]),
 [[-2.6,19],[2.6,19],[2.6,24.15],[-2.6,24.15]].map(([u,v])=>gardenWorld(h,h.x===SIXFOLD_HOUSES[0].x?SIXFOLD_HOUSES[0].x+u:Math.hypot(h.x,h.z)+u,v))
]);
const rectangle=(minX,maxX,minZ,maxZ)=>[[minX,minZ],[maxX,minZ],[maxX,maxZ],[minX,maxZ]];
// These are the actual exterior ground slabs in gallery.js after its +PI/2
// source rotation: both door porches, the side porch and its lift platform.
// Their source geometry/finish stays exposed; the new field meets its edges.
export const GALLERY_SOURCE_PORCHES=Object.freeze([
 rectangle(55.55,61.75,-2.15,2.15),rectangle(-61.75,-55.55,-2.15,2.15),
 rectangle(55.55,61.75,9.85,14.15),rectangle(58.85,62.45,9.9,14.1)
].map(p=>Object.freeze(p.map(q=>Object.freeze(q)))));
const protectedPolygons=[protectedGallery,...protectedHouses,...GALLERY_SOURCE_PORCHES].map(points=>({points:ccw(points),bounds:bounds(points)}));

// Ordered affine patches match createCityLandscape.groundHeight exactly.
// Cutting at every breakpoint gives the tiles the real slope, rather than
// stretching a flat skin over an old graded road or interpolating a whole tile
// across a crease. East/west thresholds take priority over the side-return ramp.
const grade=(points,height)=>({points,bounds:bounds(points),height});
const galleryGrades=[
 grade(rectangle(56,64,-4,4),()=>.395),
 grade(rectangle(64,67,-4,4),x=>.13+.265*(67-x)/3),
 grade(rectangle(-64,-56,-4,4),()=>.395),
 grade(rectangle(-67,-64,-4,4),x=>.13+.265*(x+67)/3),
 grade(rectangle(58,67,-34,-20),(x,z)=>.13+.265*(z+34)/14),
 grade(rectangle(58,67,-20,7),()=>.395),
 grade(rectangle(58,67,7,25),(x,z)=>.395-.265*(z-7)/18)
];
export function gardenPavingHeight(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z)||Math.hypot(x,z)<GARDEN_STONE_BELT.inner-EPS)return null;
 const patch=galleryGrades.find(p=>x>=p.bounds[0]-EPS&&x<=p.bounds[1]+EPS&&z>=p.bounds[2]-EPS&&z<=p.bounds[3]+EPS);
 return patch?patch.height(x,z):G.floor;
}

// Retirement mask for OLD visual roads, not the new stone field. Outer union
// boundary centre-lines stay on maps because the outside half of their road
// surface remains. Shared INTERNAL hex edges have union on both sides and retire.
export function gardenPrecinctContains(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z)||Math.hypot(x,z)<=GARDEN_STONE_BELT.inner+EPS||!unionInside(x,z))return false;
 return[[.004,0],[-.004,0],[0,.004],[0,-.004]].every(([a,b])=>unionInside(x+a,z+b));
}
export function clipGardenLegacyPolyline(points){
 const pieces=[];let current=[];
 const same=(a,b)=>a&&Math.hypot(a[0]-b[0],a[1]-b[1])<1e-7;
 const finish=()=>{if(current.length>1)pieces.push(current);current=[];};
 for(let j=1;j<points.length;j++){
  const a=points[j-1],b=points[j],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.65));
  for(let i=0;i<n;i++){
   const p=[a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n],q=[a[0]+(b[0]-a[0])*(i+1)/n,a[1]+(b[1]-a[1])*(i+1)/n],inside=gardenPrecinctContains(...p),next=gardenPrecinctContains(...q);
   if(inside===next){if(!inside){if(!same(current.at(-1),p))current.push(p);current.push(q);}else finish();continue;}
   let lo=0,hi=1;for(let k=0;k<28;k++){const t=(lo+hi)/2,m=[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];if(gardenPrecinctContains(...m)===inside)lo=t;else hi=t;}
   const t=(lo+hi)/2,edge=[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
   if(!inside){if(!same(current.at(-1),p))current.push(p);current.push(edge);finish();}else current=[edge,q];
  }
 }finish();return pieces.map(piece=>{const out=[];for(const p of piece){while(out.length>1){const a=out[out.length-2],b=out.at(-1),cross=(b[0]-a[0])*(p[1]-b[1])-(b[1]-a[1])*(p[0]-b[0]);if(Math.abs(cross)>1e-6)break;out.pop();}out.push(p);}return out;});
}

function split(poly,a,b){
 const inside=[],outside=[],side=v=>(b[0]-a[0])*(v[2]-a[1])-(b[1]-a[1])*(v[0]-a[0]);
 for(let i=0;i<poly.length;i++){
  const p=poly[i],q=poly[(i+1)%poly.length],d=side(p),e=side(q),pin=d>=-EPS,qin=e>=-EPS;(pin?inside:outside).push(p);
  if(pin!==qin){const t=d/(d-e),v=p.map((n,k)=>n+(q[k]-n)*t);inside.push(v);outside.push(v);}
 }return{inside,outside};
}
function carve(poly,clip){let inside=poly;const outside=[];for(let i=0;i<clip.length&&inside.length>=3;i++){const cut=split(inside,clip[i],clip[(i+1)%clip.length]);if(cut.outside.length>=3)outside.push(cut.outside);inside=cut.inside;}return{inside:inside.length>=3?inside:[],outside};}
const polyBounds=p=>bounds(p.map(v=>[v[0],v[2]]));
function subtractPolygons(pieces,holes){
 for(const hole of holes){const next=[];for(const p of pieces){if(!intersects(polyBounds(p),hole.bounds))next.push(p);else next.push(...carve(p,hole.points).outside);}pieces=next;if(!pieces.length)break;}return pieces;
}

// Subtract the seven-cell retirement precinct from actual WORLD-XZ road
// triangles while preserving the Gallery floor, all vertex attributes and groups.
// The new tiled field now owns the former exterior road grades at the same height.
// Input geometry is borrowed and never changed or disposed.
export function subtractGardenPaving(T,geometry){
 const names=Object.keys(geometry.attributes),metadata=names.map(name=>{const a=geometry.attributes[name];return{name,attribute:a,size:a.itemSize,array:a.isInterleavedBufferAttribute?a.data.array:a.array};}),positionIndex=metadata.findIndex(a=>a.name==='position');
 if(positionIndex<0)throw Error('Road geometry requires positions');
 const ordered=[metadata[positionIndex],...metadata.filter((_,i)=>i!==positionIndex)],size=ordered.reduce((n,a)=>n+a.size,0),values=[],groups=[];
 const vertex=i=>ordered.flatMap(({attribute:a,size,array})=>Array.from({length:size},(_,k)=>array[a.isInterleavedBufferAttribute?i*a.data.stride+a.offset+k:i*size+k]));
 const ix=geometry.index?.array||Array.from({length:geometry.attributes.position.count},(_,i)=>i);
 function append(poly,materialIndex){for(let j=1;j<poly.length-1;j++){
  const v=[poly[0],poly[j],poly[j+1]],a=v[1].map((n,k)=>n-v[0][k]),b=v[2].map((n,k)=>n-v[0][k]);if(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])<1e-10)continue;
  const start=values.length/size;for(const p of v)values.push(...p);const prior=groups.at(-1);if(prior&&prior.materialIndex===materialIndex&&prior.start+prior.count===start)prior.count+=3;else groups.push({start,count:3,materialIndex});
 }}
 for(let i=0;i<ix.length;i+=3){let remaining=[[vertex(ix[i]),vertex(ix[i+1]),vertex(ix[i+2])]];const kept=[],materialIndex=geometry.groups.find(g=>i>=g.start&&i<g.start+g.count)?.materialIndex??0;
  for(const c of GARDEN_PAVING_CELLS){const next=[],cb=bounds(c.vertices);for(const p of remaining){if(!intersects(polyBounds(p),cb)){next.push(p);continue;}const cut=carve(p,c.vertices);next.push(...cut.outside);if(cut.inside.length){const inner=carve(cut.inside,protectedGallery).inside;if(inner.length)kept.push(inner);}}remaining=next;}
  for(const p of[...remaining,...kept])append(p,materialIndex);
 }
 const out=new T.BufferGeometry();let offset=0;
 for(const m of ordered){const data=[];for(let i=0;i<values.length;i+=size)for(let k=0;k<m.size;k++)data.push(values[i+offset+k]);out.setAttribute(m.name,new T.BufferAttribute(new m.array.constructor(data),m.size,m.attribute.normalized));offset+=m.size;}
 for(const g of groups)out.addGroup(g.start,g.count,g.materialIndex);out.name=geometry.name;out.userData={...geometry.userData,gardenLegacyRoadCut:true};out.computeBoundingSphere();return out;
}

const domain=[];
const addDomain=p=>{p=ccw(p);domain.push({points:p,bounds:bounds(p)});};
for(let i=0;i<128;i++){const a=i*TAU/128,b=(i+1)*TAU/128;addDomain([gardenPolar(GARDEN_STONE_BELT.inner,a),gardenPolar(GARDEN_STONE_BELT.outer,a),gardenPolar(GARDEN_STONE_BELT.outer,b),gardenPolar(GARDEN_STONE_BELT.inner,b)]);}
for(const r of GARDEN_ROUTES){if(r.id==='garden-inner-promenade'||r.id==='garden-shaded-loop')continue;for(let i=1;i<r.points.length;i++){
 const a=r.points[i-1],b=r.points[i],dx=b[0]-a[0],dz=b[1]-a[1],n=Math.hypot(dx,dz);if(n<1e-8)continue;const x=-dz/n*r.width/2,z=dx/n*r.width/2,ex=dx/n*.035,ez=dz/n*.035;
 addDomain([[a[0]-ex+x,a[1]-ez+z],[a[0]-ex-x,a[1]-ez-z],[b[0]+ex-x,b[1]+ez-z],[b[0]+ex+x,b[1]+ez+z]]);
 if(i<r.points.length-1)addDomain(circle(r.width/2,12).map(p=>[p[0]+b[0],p[1]+b[1]]));
}}
for(const g of GARDEN_GATES){addDomain(circle(6,6).map(p=>[p[0]+g.court[0],p[1]+g.court[1]]));
 // Join the external stone path to the original Y0 porch, never over its slab.
 addDomain([[Math.hypot(g.house.x,g.house.z)-2.4,24.1],[Math.hypot(g.house.x,g.house.z)+2.4,24.1],[Math.hypot(g.house.x,g.house.z)+2.4,26.2],[Math.hypot(g.house.x,g.house.z)-2.4,26.2]].map(([u,v])=>gardenWorld(g,u,v)));
}

function insideWinding(x,z,points){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export function gardenPavingContains(x,z,{treeBeds=[]}={}){
 if(!Number.isFinite(x)||!Number.isFinite(z)||!unionInside(x,z)||!domain.some(p=>convexInside(x,z,p.points)))return false;
 if(protectedPolygons.some(p=>convexInside(x,z,p.points)))return false;
 return !treeBeds.some(b=>b.outline?insideWinding(x,z,b.outline):Math.hypot(x-b.x,z-b.z)<b.trunkGap);
}

export function buildGardenPaving(T,{treeBeds=[]}={}){
 const group=new T.Group();group.name='Six Gate Garden · broad geometric stone belt and curved house walks';group.userData.surfaceOnly=true;
 const owned=new Set(),own=x=>(owned.add(x),x),holes=[...protectedPolygons],buffers=[[],[]],activeBeds=[];
 for(const bed of treeBeds){
  const contour=bed.outline?.length?bed.outline:circle(bed.trunkGap||.68,24).map(p=>[p[0]+bed.x,p[1]+bed.z]),bb=bounds(contour);
  // The many untouched tree beds in the GREEN outer leaves cannot affect this
  // belt/path geometry. Reject them before triangulation or tile-hole scans.
  if(!domain.some(d=>intersects(bb,d.bounds)))continue;activeBeds.push(bed);
  const points=ccw(contour),v=points.map(p=>new T.Vector2(...p));for(const triangle of T.ShapeUtils.triangulateShape(v,[])){const p=triangle.map(i=>points[i]);holes.push({points:ccw(p),bounds:bounds(p)});}
 }
 const put=(poly,colour,buffer,height=()=>G.floor)=>{const c=new T.Color(colour),snap=p=>{const x=Math.fround(Math.round(p[0]*1e4)/1e4),z=Math.fround(Math.round(p[2]*1e4)/1e4);return[x,height(x,z),z];},points=poly.map(snap);for(let i=1;i<points.length-1;i++){const a=points[0],b=points[i],d=points[i+1],s=(b[0]-a[0])*(d[2]-a[2])-(b[2]-a[2])*(d[0]-a[0]);if(Math.abs(s)<1e-9)continue;for(const p of(s>0?[a,d,b]:[a,b,d]))buffer.push(p[0],p[1],p[2],c.r,c.g,c.b);}};
 function graded(poly,colour,buffer){
  let remaining=[poly];
  for(const patch of galleryGrades){const next=[];for(const p of remaining){if(!intersects(polyBounds(p),patch.bounds)){next.push(p);continue;}const cut=carve(p,patch.points);next.push(...cut.outside);if(cut.inside.length)put(cut.inside,colour,buffer,patch.height);}remaining=next;if(!remaining.length)break;}
  for(const p of remaining)put(p,colour,buffer);
 }
 function fill(tile,colour,buffer){const tileBounds=polyBounds(tile),local=domain.filter(p=>intersects(tileBounds,p.bounds));if(!local.length)return;let remaining=[tile],inside=[];
  for(const d of local){const next=[];for(const p of remaining){const cut=carve(p,d.points);next.push(...cut.outside);if(cut.inside.length)inside.push(cut.inside);}remaining=next;if(!remaining.length)break;}
  inside=subtractPolygons(inside,holes.filter(h=>intersects(tileBounds,h.bounds)));
  for(const p of inside)for(const cell of GARDEN_PAVING_CELLS){if(!intersects(polyBounds(p),bounds(cell.vertices)))continue;const cut=carve(p,cell.vertices).inside;if(cut.length)graded(cut,colour,buffer);}
 }
 const size=2.6,c=Math.SQRT1_2,at=(x,z)=>[(x-z)*c,G.floor,(x+z)*c],stone=[0xe7dcc3,0xf0e6cf,0xdac9a6,0xe5d5b4,0xddd4bd];
 for(let i=-104;i<104;i++)for(let j=-104;j<104;j++){
  const x=i*size,z=j*size,center=at(x+size/2,z+size/2);if(Math.hypot(center[0],center[2])>226)continue;
  const full=[at(x,z),at(x+size,z),at(x+size,z+size),at(x,z+size)],inset=.026,inner=[at(x+inset,z+inset),at(x+size-inset,z+inset),at(x+size-inset,z+size-inset),at(x+inset,z+size-inset)],a=Math.atan2(center[2],center[0]),sector=Math.floor((a+TAU+Math.PI/6)/(Math.PI/3))%6,r=Math.hypot(center[0],center[2]),accent=(r>96&&r<99||r>108.1)&&((i+j+sector)%4===0),colour=accent?(sector%2?0xa5a17a:0x6c8a82):stone[((i*13+j*7)%stone.length+stone.length)%stone.length];
  fill(full,0xb6ad94,buffers[0]);fill(inner,colour,buffers[1]);
 }
 for(const[i,buffer]of buffers.entries()){
  const pos=[],col=[];for(let j=0;j<buffer.length;j+=6){pos.push(buffer[j],buffer[j+1],buffer[j+2]);col.push(buffer[j+3],buffer[j+4],buffer[j+5]);}
  const geometry=own(new T.BufferGeometry());geometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));geometry.setAttribute('color',new T.Float32BufferAttribute(col,3));geometry.computeVertexNormals();const material=own(new T.MeshLambertMaterial({vertexColors:true,side:T.FrontSide,polygonOffset:true,polygonOffsetFactor:i?-1:1,polygonOffsetUnits:i?-1:1})),mesh=new T.Mesh(geometry,material);mesh.name=i?'Warm geometric stone tiles · cream, honey, teal and brass inlay':'Continuous flat stone joint bed · no painted road strips';group.add(mesh);
 }
 let disposed=false;return{group,treeBeds,activeBeds,contains:(x,z)=>gardenPavingContains(x,z,{treeBeds:activeBeds}),heightAt:(x,z)=>gardenPavingContains(x,z,{treeBeds:activeBeds})?gardenPavingHeight(x,z):null,triangles:group.children.reduce((n,o)=>n+o.geometry.attributes.position.count/3,0),dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();owned.clear();group.clear();}};
}
