import {NETWORK_PASSAGES,SIXFOLD_HOUSES,houseToWorld} from './sixfold-house-network-model.js?v=makers-passages-20261118';
import {GALLERY_TUNNEL} from './world-cylinder-model.js';

const EPS=1e-8,cross=(a,b,p)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
const area=p=>p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1];},0)/2;
function clip(p,a,b,inside){const out=[];for(let i=0;i<p.length;i++){const u=p[i],v=p[(i+1)%p.length],su=cross(a,b,u),sv=cross(a,b,v),iu=inside?su>=0:su<=0,iv=inside?sv>=0:sv<=0;if(iu)out.push(u);if(iu!==iv){const t=su/(su-sv);out.push([u[0]+t*(v[0]-u[0]),u[1]+t*(v[1]-u[1])]);}}return out.length>=3&&Math.abs(area(out))>EPS?out:[];}
function subtract(p,other){const out=[];let left=p;for(let i=0;i<other.length&&left.length;i++){const a=other[i],b=other[(i+1)%other.length],piece=clip(left,a,b,false);if(piece.length)out.push(piece);left=clip(left,a,b,true);}return out;}
const inside=(p,poly)=>poly.every((a,i)=>cross(a,poly[(i+1)%poly.length],p)>-EPS);
function interval(a,b,poly){let lo=0,hi=1;for(let i=0;i<poly.length;i++){const u=cross(poly[i],poly[(i+1)%poly.length],a),v=cross(poly[i],poly[(i+1)%poly.length],b),d=v-u;if(Math.abs(d)<1e-12){if(u<0)return null;}else if(d>0)lo=Math.max(lo,-u/d);else hi=Math.min(hi,-u/d);if(lo>hi)return null;}return[lo,hi];}

// Floors and ceilings partition the UNION once. Side walls are only its outer
// boundary, so neither a T join nor the crossing to Escher has an internal wall.
// House slabs own their interiors; the shared corridor stops at those slabs.
export function sixfoldPassagePlan(){
 const legacy=GALLERY_TUNNEL.points.slice(1).map((b,i)=>({id:'legacy-'+i,a:GALLERY_TUNNEL.points[i],b,width:4,kind:'legacy'}));
 const segments=[...legacy,...NETWORK_PASSAGES],rectangles=segments.map(s=>{
  const a=[...s.a],b=[...s.b],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),ux=dx/len,uz=dz/len,h=s.width/2;
  const startOpen=s.id==='legacy-0',endOpen=s.id==='legacy-2'||s.kind==='house-spur';
  const start=startOpen?0:h,end=endOpen?0:h;
  a[0]-=ux*start;a[1]-=uz*start;b[0]+=ux*end;b[1]+=uz*end;
  if(s.id==='legacy-2')b[0]=134.4;
  return{...s,polygon:[[a[0]+uz*h,a[1]-ux*h],[b[0]+uz*h,b[1]-ux*h],[b[0]-uz*h,b[1]+ux*h],[a[0]-uz*h,a[1]+ux*h]],startOpen,endOpen};
 });
 const houseBoundaries=SIXFOLD_HOUSES.map(h=>Array.from({length:6},(_,i)=>{const p=houseToWorld(h,{x:125+23*Math.cos(i*Math.PI/3),z:23*Math.sin(i*Math.PI/3)});return[p.x,p.z];}));
 const floor=[];for(let i=0;i<rectangles.length;i++){let parts=[rectangles[i].polygon];for(const p of[...rectangles.slice(0,i).map(r=>r.polygon),...houseBoundaries])parts=parts.flatMap(q=>subtract(q,p));floor.push(...parts);}
 const walls=[];for(let index=0;index<rectangles.length;index++){const r=rectangles[index];for(let edge=0;edge<4;edge++){
  if(edge===3&&r.startOpen||edge===1&&r.endOpen)continue;
  const a=r.polygon[edge],b=r.polygon[(edge+1)%4],cuts=[0,1];
  for(const other of[...rectangles.filter((_,i)=>i!==index).map(r=>r.polygon),...houseBoundaries]){const span=interval(a,b,other);if(span)cuts.push(...span.filter(t=>t>0&&t<1));}
  cuts.sort((a,b)=>a-b);for(let j=1;j<cuts.length;j++){const lo=cuts[j-1],hi=cuts[j];if(hi-lo<1e-7)continue;const mid=(lo+hi)/2,p=[a[0]+(b[0]-a[0])*mid,a[1]+(b[1]-a[1])*mid];
   const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),out=[p[0]+dz/len*.002,p[1]-dx/len*.002];
   if(rectangles.some((o,i)=>i!==index&&inside(out,o.polygon))||houseBoundaries.some(h=>inside(p,h)))continue;
   walls.push({a:[a[0]+(b[0]-a[0])*lo,a[1]+(b[1]-a[1])*lo],b:[a[0]+(b[0]-a[0])*hi,a[1]+(b[1]-a[1])*hi]});
  }
 }}return{segments,rectangles,floor,walls,houseBoundaries};
}

export function buildSixfoldHousePassages(T){
 const plan=sixfoldPassagePlan(),group=new T.Group();group.name='Sixfold basement circuit and Escher junction · real joined corridors';const owned=new Set(),own=r=>(owned.add(r),r),stone=own(new T.MeshLambertMaterial({color:0xb4a58c,side:T.DoubleSide})),brass=own(new T.MeshLambertMaterial({color:0xbba56d})),warm=own(new T.MeshBasicMaterial({color:0xffd7a2}));
 const pos=[],norm=[],append=(a,b,c,n)=>{pos.push(...a,...b,...c);for(let k=0;k<3;k++)norm.push(...n);},poly=(points,y,up)=>{for(let i=1;i<points.length-1;i++){const a=points[0],b=points[i],c=points[i+1];append([a[0],y,a[1]],[(up?c:b)[0],y,(up?c:b)[1]],[(up?b:c)[0],y,(up?b:c)[1]],[0,up?1:-1,0]);}};
 for(const p of plan.floor){poly(p,-40,true);poly(p,-40.24,false);poly(p,-35.2,false);poly(p,-34.875,true);}
 for(const{a,b}of plan.walls){const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),n=[-dz/len,0,dx/len],u=[a[0],-40,a[1]],v=[b[0],-40,b[1]],w=[b[0],-35.2,b[1]],q=[a[0],-35.2,a[1]];append(u,v,w,n);append(u,w,q,n);
  // Give the outside of each boundary real masonry thickness. A thin plane can
  // vanish behind the walking camera's near plane when looking along a jamb.
  const nx=dz/len*.28,nz=-dx/len*.28,uo=[a[0]+nx,-40.24,a[1]+nz],vo=[b[0]+nx,-40.24,b[1]+nz],wo=[b[0]+nx,-34.875,b[1]+nz],qo=[a[0]+nx,-34.875,a[1]+nz];
  append(uo,wo,vo,n.map(x=>-x));append(uo,qo,wo,n.map(x=>-x));
  for(const[A,B,C,D]of[[u,uo,vo,v],[q,w,wo,qo],[u,q,qo,uo],[v,vo,wo,w]]){append(A,B,C,n);append(A,C,D,n);}}
 const geo=own(new T.BufferGeometry());geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new T.Float32BufferAttribute(norm,3));geo.computeBoundingSphere();const shell=new T.Mesh(geo,stone);shell.name='One corridor union · floors, roofs and genuinely open junctions';group.add(shell);
 // Repeated ceiling beacons use two tiny batches, not extra point lights.
 const lamps=[];for(const s of plan.segments){const dx=s.b[0]-s.a[0],dz=s.b[1]-s.a[1],len=Math.hypot(dx,dz);for(let d=7;d<len-3;d+=14)lamps.push({x:s.a[0]+dx*d/len,z:s.a[1]+dz*d/len});}
 const unit=own(new T.BoxGeometry(1,1,1)),stamp=new T.Object3D();for(const[m,size,y,name]of[[brass,[.5,.12,.5],-35.42,'Brass corridor beacon housings'],[warm,[.3,.08,.3],-35.52,'Warm direction beacons']]){const batch=new T.InstancedMesh(unit,m,lamps.length);batch.name=name;lamps.forEach((p,i)=>{stamp.position.set(p.x,y,p.z);stamp.scale.set(...size);stamp.updateMatrix();batch.setMatrixAt(i,stamp.matrix);});batch.computeBoundingSphere();group.add(batch);}
 let disposed=false;return{group,walking:shell,plan,counts:{segments:plan.segments.length,wallSpans:plan.walls.length,draws:3},dispose(){if(disposed)return;disposed=true;group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
