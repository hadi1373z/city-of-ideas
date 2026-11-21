import {buildEscherNicheOrnaments} from './escher-niche-ornaments.js?v=escher-blue-alcoves-final-20261121';
import {DESCENT_PARTS,DESCENT_ANNEX} from './escher-descent-model.js?v=wall-rails-20261121';
import {ESCHER_SHAFT_NICHES} from './escher-niche-model.js?v=escher-blue-alcoves-final-20261121';
export {ESCHER_NICHE_SILL,ESCHER_SHAFT_NICHES,nicheVoid} from './escher-niche-model.js?v=escher-blue-alcoves-final-20261121';

// Original masonry details; the stair arches are genuine closed recessed alcoves.
function workshop(T,name){
 const group=new T.Group();group.name=name;const owned=[],positions=new Map();
 const material=(color,basic=false)=>{const m=basic?new T.MeshBasicMaterial({color}):new T.MeshLambertMaterial({color,side:T.DoubleSide});owned.push(m);return m;};
 const stone=material(0xd3cbb5),shadow=material(0x526d66),rim=material(0xa29c85),masonry=material(0x718980),bronze=material(0x9a855b),glow=material(0xffdca1,true);
 function face(points,m){if(!positions.has(m))positions.set(m,[]);const p=positions.get(m);for(let i=1;i<points.length-1;i++)for(const v of[points[0],points[i],points[i+1]])p.push(...v);}
 function plate(poly,origin,along,out,depth,m){const map=(p,d)=>[origin[0]+along[0]*p[0]+out[0]*d,origin[1]+p[1],origin[2]+along[1]*p[0]+out[1]*d];face(poly.map(p=>map(p,depth)),m);face([...poly].reverse().map(p=>map(p,0)),m);for(let i=0;i<poly.length;i++)face([map(poly[i],0),map(poly[(i+1)%poly.length],0),map(poly[(i+1)%poly.length],depth),map(poly[i],depth)],m);}
 const rect=(w,h,y=0)=>[[-w/2,y],[w/2,y],[w/2,y+h],[-w/2,y+h]];
 function arch(origin,along,out,w,spring,depth=0,profile='round'){const r=w/2,outer=r+.12,crown=(rad,a)=>spring+rad*(profile==='pointed'?Math.pow(Math.max(0,1-Math.abs(Math.cos(a))),.65):Math.sin(a)),poly=[[-r,0],[r,0],[r,spring]];for(let i=1;i<=32;i++){const a=i*Math.PI/32;poly.push([r*Math.cos(a),crown(r,a)]);}
  if(depth){const at=(p,d)=>[origin[0]+along[0]*p[0]+out[0]*d,origin[1]+p[1],origin[2]+along[1]*p[0]+out[1]*d];face(poly.map(p=>at(p,-depth)),shadow);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];face([at(a,0),at(b,0),at(b,-depth),at(a,-depth)],rim);}for(let i=0;i<32;i++){const a=i*Math.PI/32,b=(i+1)*Math.PI/32,p=[r*Math.cos(a),crown(r,a)],q=[r*Math.cos(b),crown(r,b)];face([at(p,0),at(q,0),at([q[0],spring+r],0),at([p[0],spring+r],0)],masonry);}}
  else plate(poly,origin,along,out,.035,shadow);
  for(const sign of[-1,1])plate(rect(.12,spring),[origin[0]+along[0]*sign*(r+.06),origin[1],origin[2]+along[1]*sign*(r+.06)],along,out,.085,stone);
  for(let i=0;i<32;i++){const a=i*Math.PI/32,b=(i+1)*Math.PI/32;plate([[r*Math.cos(a),crown(r,a)],[outer*Math.cos(a),crown(outer,a)],[outer*Math.cos(b),crown(outer,b)],[r*Math.cos(b),crown(r,b)]],origin,along,out,.085,stone);}
  plate(rect(w+.38,.10,-.1),origin,along,out,.10,stone);
 }
 function band(origin,along,out,w,h,depth,m=stone){plate(rect(w,h),origin,along,out,depth,m);}
 function finish(){for(const[m,p]of positions){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();owned.push(g);const mesh=new T.Mesh(g,m);mesh.name=name+' · batched relief';group.add(mesh);}return{group,dispose(){group.removeFromParent();owned.forEach(r=>r.dispose());group.clear();}};}
 return{group,stone,shadow,rim,bronze,glow,arch,band,finish};
}

export function buildEscherPavilionDetails(T){
 const w=workshop(T,'Escher · cloister entrance masonry');
 // Consistent base, cornice and five arched bays along each long elevation.
 for(const side of[-1,1]){const o=[side*4.115,0,0],along=[0,1],out=[side,0];
  for(const[y,h,d,m]of[[.08,.36,.10,w.rim],[.44,.10,.14,w.stone],[4.45,.14,.14,w.stone],[4.62,.10,.18,w.bronze]])w.band([o[0],y,0],along,out,14,h,d,m);
  for(const z of[-5.4,-2.7,0,2.7,5.4]){w.arch([o[0],.85,z],along,out,1.8,1.55);w.band([o[0]+side*.04,1.45,z],along,out,.045,1.45,.05,w.bronze);}
 }
 // The barrel-vault entrance keeps the real 2.6m doorway open.
 for(const side of[-1,1]){w.arch([side*2.7,.85,7.12],[1,0],[0,1],1.25,1.55);w.band([side*2.7,.08,7.12],[1,0],[0,1],2.55,.36,.10,w.rim);}
 for(const x of[-1.48,1.48]){w.band([x,0,7.12],[1,0],[0,1],.20,4.15,.16);w.band([x,1.1,7.3],[1,0],[0,1],.035,1.1,.03,w.glow);}
 w.band([0,3.82,7.12],[1,0],[0,1],3.2,.22,.4);w.band([0,4.08,7.12],[1,0],[0,1],3.5,.12,.6,w.bronze);
 // Rear alcove shares the same courses, rather than a freestanding blank box.
 for(const side of[-1,1]){for(const[y,h,m]of[[.08,.36,w.rim],[4.47,.14,w.stone]])w.band([side*1.70,y,-10],[0,1],[side,0],6,h,.08,m);for(const z of[-11.5,-8.5])w.arch([side*1.70,.85,z],[0,1],[side,0],1.35,1.55);}
 return w.finish();
}

export function buildEscherShaftDetails(T){
 const w=workshop(T,'Escher · stone stair galleries');
 // Exterior detailing follows every actual face of the narrow hexagonal annex.
 const A=DESCENT_ANNEX;
 for(let i=0;i<5;i++){const a=A.polygon[i],b=A.polygon[i+1],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),along=[dx/len,dz/len],out=[dz/len,-dx/len],cx=(a[0]+b[0])/2+out[0]*.13,cz=(a[1]+b[1])/2+out[1]*.13;
  for(const[y,h,d,m]of[[.08,.36,.15,w.rim],[.44,.1,.18,w.stone],[A.eave-.18,.12,.18,w.stone]])w.band([cx,y,cz],along,out,len+.05,h,d,m);
  const count=Math.max(1,Math.floor(len/2.4));for(let j=0;j<count;j++){const t=(j+.5)/count-.5;w.arch([cx+dx*t,.85,cz+dz*t],along,out,Math.min(1.3,len/count-.4),1.05);}
 }
 // Each turn is a framed recess ON the end wall, never an arch across a flight.
 for(const p of DESCENT_PARTS.filter(p=>p.id.startsWith('landing-'))){const north=p.minZ<92,z=north?90.62:106.58,out=[0,north?1:-1],along=[1,0];
  for(const x of[224.15,228.85]){w.band([x,p.y+.55,z],along,out,.11,1.6,.025,w.rim);w.band([x,p.y+.65,z+(north?.03:-.03)],along,out,.035,1.35,.015,w.glow);}
 }
 // Curved reveals and a closed back sit inside the carved masonry, not over it.
 for(const n of ESCHER_SHAFT_NICHES){w.arch(n.origin,n.along,n.out,n.w,n.spring,n.depth,n.profile);w.band([n.origin[0]-n.out[0]*.055,n.origin[1]+.027,n.origin[2]-n.out[1]*.055],n.along,n.out,n.w*.83,.014,.008,w.glow);}
 const built=w.finish(),ornaments=buildEscherNicheOrnaments(T,ESCHER_SHAFT_NICHES),dispose=built.dispose;built.group.add(ornaments.group);built.dispose=()=>{ornaments.dispose();dispose();};return built;
}
