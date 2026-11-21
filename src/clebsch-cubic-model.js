// Original computed model of the Clebsch diagonal cubic, not a copied mesh.
// P4 equations: sum Xi=0, sum Xi^3=0. The affine chart is n.X=1.
export const CLEBSCH=Object.freeze({radius:2.65,resolution:44,lineCount:27,displayRadius:.88,lineRadius:.011,markerRadius:.034,
 plinth:Object.freeze({x:220,z:144,floorY:-40,topY:-39.58,width:4,depth:2}),
 colours:Object.freeze([0xff2727,0x1265ff,0x00d641,0xff8a00,0xa929ff,0x00d9ef,0xff2fb3,0xe8cf00,0x1650dc]),
 sources:Object.freeze([{title:'University of Tokyo · 27 lines on a cubic surface',url:'https://www.ms.u-tokyo.ac.jp/models_e/27cubic_e.html'},{title:'Thomas Bauer, Marburg · Clebsch’s cubic',url:'https://www.mathematik.uni-marburg.de/~tbauer/clebsch.htm'},{title:'Wolfram MathWorld · Clebsch Diagonal Cubic',url:'https://mathworld.wolfram.com/ClebschDiagonalCubic.html'}])});
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),norm=a=>Math.hypot(...a),unit=a=>a.map(x=>x/norm(a)),add=(a,b,t=1)=>a.map((x,i)=>x+t*b[i]);
export const CLEBSCH_NORMAL=Object.freeze(unit([3,3,3,-2,-7]));
export const CLEBSCH_BASIS=Object.freeze([unit([1,-1,0,0,0]),unit([1,1,1,-6,3]),unit([1,1,-2,0,0])].map(Object.freeze));
export const clebschHomogeneous=p=>CLEBSCH_NORMAL.map((n,i)=>n+CLEBSCH_BASIS.reduce((s,b,j)=>s+b[i]*p[j],0));
export const clebschValue=p=>clebschHomogeneous(p).reduce((s,x)=>s+x*x*x,0);
export const clebschGradient=p=>{const q=clebschHomogeneous(p);return CLEBSCH_BASIS.map(b=>b.reduce((s,v,i)=>s+3*v*q[i]*q[i],0));};
const affine=q=>CLEBSCH_BASIS.map(b=>dot(b,add(q,CLEBSCH_NORMAL,-1))),direction=q=>CLEBSCH_BASIS.map(b=>dot(b,q));
const permutations=a=>a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>i!==j)).map(p=>[v,...p])):[[]];
function projectiveLines(){
 const out=[];for(let s=0;s<5;s++){const[a,b,c,d]=[0,1,2,3,4].filter(i=>i!==s);for(const pairs of[[[a,b],[c,d]],[[a,c],[b,d]],[[a,d],[b,c]]])out.push({family:'paired coordinates',basis:pairs.map(([a,b])=>unit([0,1,2,3,4].map(i=>(i===a?1:0)-(i===b?1:0))))});}
 const seen=new Set();for(const p of permutations([0,1,2,3,4])){const u=unit(p.map(k=>Math.cos(2*Math.PI*k/5))),v=unit(p.map(k=>Math.sin(2*Math.PI*k/5))),key=u.flatMap((a,i)=>u.map((b,j)=>{const q=a*b+v[i]*v[j];return(Math.abs(q)<1e-9?0:q).toFixed(8);})).join(',');if(!seen.has(key)){seen.add(key);out.push({family:'pentagonal orbit',basis:[u,v]});}}
 return out;
}
export function clebschLines(radius=CLEBSCH.radius){return projectiveLines().map(({basis:[u,v],family},i)=>{
 const a=dot(CLEBSCH_NORMAL,u),b=dot(CLEBSCH_NORMAL,v),q=a*a+b*b;if(q<1e-12)throw Error('A Clebsch line lies at infinity in this chart');
 const p=affine(u.map((x,j)=>(a*x+b*v[j])/q)),d=unit(direction(u.map((x,j)=>b*x-a*v[j]))),reach=radius*radius-dot(p,p);if(reach<=0)throw Error('The display ball misses a Clebsch line');const half=Math.sqrt(reach);
 return{id:'clebsch-line-'+(i+1),family,point:p,direction:d,start:add(p,d,-half),end:add(p,d,half),colour:CLEBSCH.colours[i%CLEBSCH.colours.length]};
 });}
export function clebschEckardtPoints(){const points=[];for(let i=0;i<5;i++)for(let j=i+1;j<5;j++){const p=[0,0,0,0,0];p[i]=1;p[j]=-1;const h=dot(CLEBSCH_NORMAL,p);if(Math.abs(h)<1e-10)continue;points.push(affine(p.map(v=>v/h)));}return points.sort((a,b)=>norm(a)-norm(b));}
const TETRA=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]],corners=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
// Project a sphere-cut edge back to BOTH the exact cubic and display sphere.
function onBoundary(p,radius){for(let i=0;i<9;i++){const f=clebschValue(p),s=dot(p,p)-radius*radius;if(Math.max(Math.abs(f),Math.abs(s))<1e-11)break;const g=clebschGradient(p),h=p.map(v=>2*v),a=dot(g,g),b=dot(g,h),c=dot(h,h),det=a*c-b*b;if(Math.abs(det)<1e-13)break;const u=(-f*c+s*b)/det,v=(-s*a+f*b)/det;p=p.map((q,j)=>q+u*g[j]+v*h[j]);}return p;}
function sphereClip(poly,radius){const out=[],rr=radius*radius;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ai=dot(a,a)<=rr,bi=dot(b,b)<=rr;if(ai)out.push(a);if(ai!==bi){const d=add(b,a,-1),A=dot(d,d),B=2*dot(a,d),C=dot(a,a)-rr,root=Math.sqrt(Math.max(0,B*B-4*A*C)),ts=[(-B-root)/(2*A),(-B+root)/(2*A)],t=ts.find(t=>t>=-1e-9&&t<=1+1e-9);out.push(onBoundary(add(a,d,t),radius));}}return out;}
export function buildClebschMesh({resolution=CLEBSCH.resolution,radius=CLEBSCH.radius}={}){
 if(!Number.isInteger(resolution)||resolution<16||resolution>96||!Number.isFinite(radius)||radius<=0)throw Error('Use a finite Clebsch ball and bounded integer grid');
 const n=resolution+1,count=n*n*n,values=new Float64Array(count),positions=new Array(count),step=2*radius/resolution,id=(x,y,z)=>x+n*(y+n*z);
 for(let z=0;z<n;z++)for(let y=0;y<n;y++)for(let x=0;x<n;x++){const i=id(x,y,z),p=[-radius+x*step,-radius+y*step,-radius+z*step];positions[i]=p;values[i]=clebschValue(p);}
 const roots=new Map(),vertices=[],normals=[];function root(a,b){const lo=Math.min(a,b),hi=Math.max(a,b),key=lo*count+hi;if(roots.has(key))return roots.get(key);let u=positions[a],v=positions[b],fu=values[a];for(let i=0;i<30;i++){const q=u.map((x,j)=>(x+v[j])/2),f=clebschValue(q);if((f>=0)===(fu>=0)){u=q;fu=f;}else v=q;}const p=u.map((x,j)=>(x+v[j])/2);roots.set(key,p);return p;}
 function triangle(a,b,c){const ab=add(b,a,-1),ac=add(c,a,-1),cross=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];if(norm(cross)<1e-12)return;const centre=a.map((v,i)=>(v+b[i]+c[i])/3);if(dot(cross,clebschGradient(centre))<0)[b,c]=[c,b];for(const p of[a,b,c]){vertices.push(...p);normals.push(...unit(clebschGradient(p)));}}
 for(let z=0;z<resolution;z++)for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++){
  const closest=[x,y,z].map(i=>Math.max(0,Math.abs(-radius+(i+.5)*step)-step/2));if(dot(closest,closest)>radius*radius)continue;
  const cell=corners.map(([a,b,c])=>id(x+a,y+b,z+c)),signs=cell.map(i=>values[i]>=0);if(signs.every(Boolean)||signs.every(v=>!v))continue;
  for(const t of TETRA){const yes=t.map(i=>cell[i]).filter(i=>values[i]>=0),no=t.map(i=>cell[i]).filter(i=>values[i]<0);if(!yes.length||!no.length)continue;let poly;
   if(yes.length===1)poly=no.map(i=>root(yes[0],i));else if(no.length===1)poly=yes.map(i=>root(no[0],i));else poly=[root(yes[0],no[0]),root(yes[0],no[1]),root(yes[1],no[1]),root(yes[1],no[0])];
   poly=sphereClip(poly,radius);for(let i=1;i<poly.length-1;i++)triangle(poly[0],poly[i],poly[i+1]);
  }
 }
 return{positions:new Float32Array(vertices),normals:new Float32Array(normals),radius,resolution,triangles:vertices.length/9};
}
let cached=null;export function defaultClebschModel(){return cached??=(Object.freeze({mesh:buildClebschMesh(),lines:clebschLines(),markers:clebschEckardtPoints().slice(0,3)}));}
