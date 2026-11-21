// One half-twisted lattice. This is original geometry, without a reference texture.
export const MOBIUS_LATTICE=Object.freeze({segments:192,rungs:36,halfWidth:.36,railWidth:.052,depth:.064,bevel:.008,rails:Object.freeze([-1,-1/3,1/3,1]),crossingSeparation:1.1});
const TAU=2*Math.PI,add=(a,b,t=1)=>a.map((v,i)=>v+t*b[i]),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),len=a=>Math.hypot(...a),unit=a=>a.map(v=>v/len(a)),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const rotate=(p,axis,a)=>{const c=Math.cos(a),s=Math.sin(a),k=cross(axis,p),d=dot(axis,p);return p.map((v,i)=>v*c+k[i]*s+axis[i]*d*(1-c));};
const centre=u=>[2.2*Math.sin(u),.55*Math.cos(u),.85*Math.sin(2*u)],tangent=u=>unit([2.2*Math.cos(u),-.55*Math.sin(u),1.7*Math.cos(2*u)]),display=p=>[p[0],p[2],-p[1]];
const transport=[];let correction=0;{
 const n=MOBIUS_LATTICE.segments,T0=tangent(0),N0=[0,1,0];transport.push({t:T0,n:N0});
 for(let i=1;i<=n;i++){const t=tangent(i*TAU/n),last=transport[i-1],axis=cross(last.t,t),s=len(axis),angle=Math.atan2(s,dot(last.t,t)),turned=s>1e-12?rotate(last.n,axis.map(v=>v/s),angle):last.n,N=unit(add(turned,t,-dot(turned,t)));transport.push({t,n:N});}
 const end=transport[n].n,target=N0.map(v=>-v);correction=Math.atan2(dot(T0,cross(end,target)),dot(end,target));
}
export function mobiusLatticeFrame(u){
 if(!Number.isFinite(u))throw Error('A finite lattice parameter is required');const laps=Math.floor(u/TAU),q=u-laps*TAU,t=tangent(q),f=q/TAU*MOBIUS_LATTICE.segments,i=Math.min(MOBIUS_LATTICE.segments-1,Math.floor(f)),mix=f-i,N=unit(add(transport[i].n,add(transport[i+1].n,transport[i].n,-1),mix)),perpendicular=unit(add(N,t,-dot(N,t))),across=rotate(perpendicular,t,correction*q/TAU).map(v=>v*(laps%2===0?1:-1)),normal=cross(t,across);
 return{u,centre:display(centre(q)),tangent:display(t),across:display(across),normal:display(normal)};
}
export function mobiusLatticePoint(u,v=0,normalOffset=0){if(!Number.isFinite(v)||!Number.isFinite(normalOffset))throw Error('Finite lattice offsets required');const f=mobiusLatticeFrame(u);return add(add(f.centre,f.across,v),f.normal,normalOffset);}
const section=(w,d,b)=>[[-w/2+b,-d/2],[w/2-b,-d/2],[w/2,-d/2+b],[w/2,d/2-b],[w/2-b,d/2],[-w/2+b,d/2],[-w/2,d/2-b],[-w/2,-d/2+b]];
export function mobiusLatticeGeometry(){
 const C=MOBIUS_LATTICE,positions=[],indices=[],railRanges=[],rungRanges=[],push=p=>(positions.push(...p),positions.length/3-1),quad=(a,b,c,d)=>indices.push(a,b,c,a,c,d),profile=section(C.railWidth,C.depth,C.bevel);
 for(const[railIndex,offset]of C.rails.entries()){const v=offset*C.halfWidth;
  const start=positions.length/3;for(let i=0;i<C.segments;i++){const f=mobiusLatticeFrame(i*TAU/C.segments),p=add(f.centre,f.across,v);for(const[a,b]of profile)push(add(add(p,f.across,a),f.normal,b));}
  for(let i=0;i<C.segments;i++)for(let j=0;j<8;j++){const seam=i===C.segments-1,next=seam?(C.rails.length-1-railIndex)*C.segments*8:start+(i+1)*8,shift=seam?4:0,a=start+i*8+j,b=start+i*8+(j+1)%8,c=next+(j+1+shift)%8,d=next+(j+shift)%8;quad(a,b,c,d);}railRanges.push({start,count:C.segments*8,v});
 }
 for(let i=0;i<C.rungs;i++){
  const u=i*TAU/C.rungs,f=mobiusLatticeFrame(u),start=positions.length/3,shape=section(C.railWidth,C.depth,C.bevel);
  // T × (−normal) = across, so these end sections have a consistent solid winding.
  for(const v of[-C.halfWidth-C.railWidth/2,C.halfWidth+C.railWidth/2])for(const[a,b]of shape)push(add(add(add(f.centre,f.across,v),f.tangent,a),f.normal,-b));
  for(let j=0;j<8;j++)quad(start+j,start+(j+1)%8,start+8+(j+1)%8,start+8+j);
  for(let j=1;j<7;j++){indices.push(start,start+j+1,start+j);indices.push(start+8,start+8+j,start+8+j+1);}rungRanges.push({start,count:16,u});
 }
 return{positions:new Float32Array(positions),indices,railRanges,rungRanges,segments:C.segments,rungs:C.rungs,correction};
}
// Ideal carrier connectivity follows the same reversed seam as the visible rails.
export function mobiusLatticeCarrier(){const C=MOBIUS_LATTICE,vertices=[],faces=[],index=(i,j)=>i===C.segments?C.rails.length-1-j:i*C.rails.length+j;for(let i=0;i<C.segments;i++)for(const v of C.rails)vertices.push(mobiusLatticePoint(i*TAU/C.segments,v*C.halfWidth));for(let i=0;i<C.segments;i++)for(let j=0;j<C.rails.length-1;j++)faces.push([index(i,j),index(i+1,j),index(i+1,j+1),index(i,j+1)]);return{vertices,faces};}
let cached=null;export const defaultMobiusLattice=()=>cached??=(mobiusLatticeGeometry());
