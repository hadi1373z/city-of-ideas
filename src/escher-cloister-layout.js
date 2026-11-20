// Shared architectural plan: metres in the ordinary +Y-up city frame.
export const hexagon=(x,z,r)=>Array.from({length:6},(_,i)=>[x+r*Math.cos(Math.PI/6+i*Math.PI/3),z+r*Math.sin(Math.PI/6+i*Math.PI/3)]);
export const rectangle=(minX,maxX,minZ,maxZ)=>[[minX,minZ],[maxX,minZ],[maxX,maxZ],[minX,maxZ]];
export function polygonRoom(id,polygon,y=-40,ceiling=-29,extra={}){return Object.freeze({id,polygon:Object.freeze(polygon.map(Object.freeze)),minX:Math.min(...polygon.map(p=>p[0])),maxX:Math.max(...polygon.map(p=>p[0])),minZ:Math.min(...polygon.map(p=>p[1])),maxZ:Math.max(...polygon.map(p=>p[1])),y,ceiling,...extra});}
export function insidePolygon(poly,x,z){for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];if((b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0])< -1e-7)return false;}return true;}
export function clipPolygon(poly,axis,value,keepGreater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=(a[axis]-value)*(keepGreater?1:-1),db=(b[axis]-value)*(keepGreater?1:-1);if(da>=-1e-8)out.push(a);if((da>0&&db<0)||(da<0&&db>0)){const t=da/(da-db);out.push(a.map((v,j)=>v+(b[j]-v)*t));}}return out;}
// Disjoint pieces outside a rectangular aperture; also works with [x,z,y].
export function outsidePolygonRectangle(poly,r){const left=clipPolygon(poly,0,r.minX,false),right=clipPolygon(poly,0,r.maxX,true),middle=clipPolygon(clipPolygon(poly,0,r.minX,true),0,r.maxX,false);return[left,right,clipPolygon(middle,1,r.minZ,false),clipPolygon(middle,1,r.maxZ,true)].filter(p=>p.length>=3);}
function connection(id,a,b,width=6){const dx=b[0]-a[0],dz=b[1]-a[1],d=Math.hypot(dx,dz),nx=-dz/d*width/2,nz=dx/d*width/2;return polygonRoom(id,[[a[0]-nx,a[1]-nz],[b[0]-nx,b[1]-nz],[b[0]+nx,b[1]+nz],[a[0]+nx,a[1]+nz]],-40,-29,{corridor:true});}
const c=[197,115],w=[157.63,115],ne=[216.69,80.9],se=[216.69,149.1];
const between=(id,p)=>{const dx=p[0]-c[0],dz=p[1]-c[1],d=Math.hypot(dx,dz),u=[dx/d,dz/d];return connection(id,[c[0]+u[0]*19.7,c[1]+u[1]*19.7],[p[0]-u[0]*14.5,p[1]-u[1]*14.5]);};
export const CLOISTER_ROOMS=Object.freeze([
 polygonRoom('vestibule',rectangle(134.4,143,112,118),-40,-33.5,{corridor:true}),
 polygonRoom('hall',hexagon(...c,24),-40,-23.6,{centre:c,radius:24,spring:-28.5,gallery:true}),
 polygonRoom('perspective',hexagon(...w,18),-40,-26.8,{centre:w,radius:18,spring:-30.5,gallery:true}),
 polygonRoom('tessellation',hexagon(...ne,18),-40,-26.8,{centre:ne,radius:18,spring:-30.5,gallery:true}),
 polygonRoom('reading',hexagon(...se,18),-40,-26.8,{centre:se,radius:18,spring:-30.5,gallery:true}),
 polygonRoom('loop',hexagon(197,166,22),-46,-39.5,{centre:[197,166],radius:22,inner:12,spring:-41.4}),
 between('perspective-link',w),between('tessellation-link',ne),between('topology-link',se),
 polygonRoom('shaft-link',rectangle(216.4,226.2,106.8,112.4),-40,-35.2,{corridor:true}),
 polygonRoom('shaft-landing',rectangle(224.1,225.9,104,107.2),-40,-35.2,{shaftLanding:true})
]);
export const CLOISTER_STAIRS=Object.freeze([
 Object.freeze({id:'stair',minX:192.5,maxX:197.5,minZ:132,maxZ:150,top:-40,bottom:-46,steps:48,ceiling:-29}),
 Object.freeze({id:'gallery-stair',minX:178.2,maxX:181.2,minZ:103,maxZ:125,top:-34,bottom:-40,steps:48,ceiling:-27})
]);
export const CLOISTER_GALLERIES=Object.freeze([...CLOISTER_ROOMS.filter(r=>r.gallery).map(r=>polygonRoom(r.id+'-gallery',r.polygon,-34,r.ceiling,{centre:r.centre,radius:r.radius,inner:r.id==='hall'?17:12,room:r.id})),...CLOISTER_ROOMS.filter(r=>['perspective-link','tessellation-link','topology-link'].includes(r.id)).map(r=>polygonRoom(r.id+'-gallery',r.polygon,-34,r.ceiling,{corridor:true}))]);
export function ringPolygons(r){const outer=r.polygon,inner=hexagon(...r.centre,r.inner);return outer.map((p,i)=>[p,outer[(i+1)%6],inner[(i+1)%6],inner[i]]);}
