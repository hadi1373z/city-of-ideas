import {SEA_TERRACES as S,seaTerraceWorld} from './sea-terraces-model.js';
const frozen=points=>Object.freeze(points.map(Object.freeze));
const arc=Array.from({length:41},(_,i)=>{const a=Math.PI/2-(Math.PI/2+Math.PI/3)*i/40;return[S.x+20.5*Math.cos(a),S.z+20.5*Math.sin(a)];});
const world=(u,v)=>{const p=seaTerraceWorld(u,v);return[p.x,p.z];};
const route=(id,points,width)=>Object.freeze({id,kind:'civic-spur',width,points:frozen(points)});
export const SEA_TERRACE_APPROACHES=Object.freeze([
 route('sea-terraces-listening-approach',[[S.x,S.z+18],...arc,world(0,22)],3.4),
 ...[-1,1].map(sign=>{const a=world(sign*34,44.5),r=Math.hypot(...a),b=a.map(n=>n*536/r);return route('sea-terraces-shore-'+sign,[a,b],2.4);})
]);
// Real flush supporting stone. The original experiment, source doorstep and
// shore loop remain independent; these short links meet their actual edges.
export function buildSeaTerraceAccess(T){
 const group=new T.Group();group.name='Sea Terraces · open court and shore approaches';const positions=[];
 function face(points){for(let i=1;i<points.length-1;i++)for(const p of[points[0],points[i],points[i+1]])positions.push(...p);}
 function slab(points){const area=points.reduce((s,p,i)=>{const q=points[(i+1)%points.length];return s+p[0]*q[1]-p[1]*q[0];},0);if(area>0)points=[...points].reverse();face(points.map(([x,z])=>[x,.13,z]));face([...points].reverse().map(([x,z])=>[x,0,z]));for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];face([[a[0],0,a[1]],[b[0],0,b[1]],[b[0],.13,b[1]],[a[0],.13,a[1]]]);}}
 for(const r of SEA_TERRACE_APPROACHES)for(let i=1;i<r.points.length;i++){
  const a=r.points[i-1],b=r.points[i],dx=b[0]-a[0],dz=b[1]-a[1],n=Math.hypot(dx,dz);if(n<1e-7)continue;const ux=dx/n,uz=dz/n,nx=-uz*r.width/2,nz=ux*r.width/2,e=.035;
  slab([[a[0]-ux*e+nx,a[1]-uz*e+nz],[a[0]-ux*e-nx,a[1]-uz*e-nz],[b[0]+ux*e-nx,b[1]+uz*e-nz],[b[0]+ux*e+nx,b[1]+uz*e+nz]]);
  if(i<r.points.length-1)slab(Array.from({length:12},(_,j)=>[b[0]+r.width/2*Math.cos(j*Math.PI/6),b[1]+r.width/2*Math.sin(j*Math.PI/6)]));
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.computeVertexNormals();geometry.computeBoundingSphere();const material=new T.MeshStandardMaterial({color:0xd8cbb1,roughness:.92,side:T.DoubleSide}),mesh=new T.Mesh(geometry,material);mesh.name='Sea Terraces · supported clockwise court walk and two coast exits';mesh.receiveShadow=true;group.add(mesh);let disposed=false;
 return{group,dispose(){if(disposed)return;disposed=true;group.removeFromParent();geometry.dispose();material.dispose();group.clear();}};
}
