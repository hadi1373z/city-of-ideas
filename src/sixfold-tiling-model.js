import {penroseTriangles,PHI} from './mathematical-pavilions-model.js?v=city-night-20261117';

export const SIXFOLD_TILINGS=Object.freeze([
 {id:'penrose',name:'Penrose rhombs',vertexFigure:null,types:['thin rhomb','thick rhomb'],description:'A finite Robinson substitution, paired across shared bases. Thin rhombs have 36° acute angles; thick rhombs have 72° acute angles. A finite crop does not itself prove aperiodicity.'},
 {id:'hexagonal',name:'Hexagonal honeycomb',vertexFigure:'6.6.6',types:['regular hexagon'],description:'Three regular hexagons meet at each interior vertex.'},
 {id:'triangular',name:'Triangular lattice',vertexFigure:'3.3.3.3.3.3',types:['up triangle','down triangle'],description:'Six equilateral triangles meet at each interior vertex.'},
 {id:'square',name:'Square lattice',vertexFigure:'4.4.4.4',types:['square'],description:'Four congruent squares meet at each interior vertex.'},
 {id:'octagon-square',name:'Octagons and squares',vertexFigure:'4.8.8',types:['regular octagon','square'],description:'A square and two regular octagons meet at each interior vertex. Every polygon has the same edge length.'},
 {id:'trihexagonal',name:'Trihexagonal lattice',vertexFigure:'3.6.3.6',types:['regular hexagon','equilateral triangle'],description:'Triangles and hexagons alternate at each interior vertex, with one common edge length.'}
].map(p=>Object.freeze({...p,types:Object.freeze(p.types)})));
const EPS=1e-10,mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
export const sixfoldPolygonArea=p=>p.reduce((sum,a,i)=>{const b=p[(i+1)%p.length];return sum+a[0]*b[1]-a[1]*b[0];},0)/2;
const tidy=polygon=>{const p=[];for(const a of polygon)if(!p.length||Math.hypot(a[0]-p.at(-1)[0],a[1]-p.at(-1)[1])>EPS)p.push(a);if(p.length>1&&Math.hypot(p[0][0]-p.at(-1)[0],p[0][1]-p.at(-1)[1])<=EPS)p.pop();if(p.length<3||Math.abs(sixfoldPolygonArea(p))<EPS)return[];return sixfoldPolygonArea(p)<0?p.reverse():p;};
const box=p=>[Math.min(...p.map(a=>a[0])),Math.min(...p.map(a=>a[1])),Math.max(...p.map(a=>a[0])),Math.max(...p.map(a=>a[1]))];
const overlaps=(a,b)=>a[0]<=b[2]+EPS&&a[2]>=b[0]-EPS&&a[1]<=b[3]+EPS&&a[3]>=b[1]-EPS;
const regular=(n,r,cx,cy,phase=0)=>Array.from({length:n},(_,i)=>[cx+r*Math.cos(phase+i*2*Math.PI/n),cy+r*Math.sin(phase+i*2*Math.PI/n)]);

/** Kept identical to the established house generator, including stable ids. */
export function createPenroseRhombPatch({depth=5,radius=30}={}){
 if(!Number.isInteger(depth)||depth<0||depth>8||!Number.isFinite(radius)||radius<=0)throw new RangeError('Finite radius and depth 0..8 required');
 let triangles=penroseTriangles(Math.min(depth,5),radius);for(let n=5;n<depth;n++){const next=[];for(const[k,a,b,c]of triangles)if(k===0){const p=mix(a,b,1/PHI);next.push([0,c,p,b],[1,p,c,a]);}else{const q=mix(b,a,1/PHI),r=mix(b,c,1/PHI);next.push([1,r,c,a],[1,q,r,b],[0,r,q,a]);}triangles=next;}
 const groups=new Map(),key=p=>p.map(v=>Math.round(v*1e8)).join(',');triangles.forEach((t,i)=>{const k=`${t[0]}:${[key(t[2]),key(t[3])].sort().join(';')}`,g=groups.get(k)||[];g.push(i);groups.set(k,g);});
 return[...groups.values()].map(ids=>{if(ids.length>2)throw Error('Unexpected Robinson base multiplicity');const[kind,a,b,c]=triangles[ids[0]],paired=ids.length===2,rhomb=tidy(paired?[a,b,triangles[ids[1]][1],c]:[a,b,c]);return{id:`rhomb-${ids[0]}`,kind,paired,triangleIds:ids,rhomb,edges:rhomb.map((p,i)=>[p,rhomb[(i+1)%rhomb.length]])};});
}

/** Full exact parent polygons, in one unshifted coordinate field. Cropping and
 * grout belong to the caller, so a clipped edge never becomes a fake tile seam.
 * `rhomb` is a legacy polygon alias for the existing house clipping pipeline.
 */
export function createSixfoldTilingPatch(pattern='penrose',{edge=2.5,bounds=[-30,-30,30,30],depth=7,radius}={}){
 const info=SIXFOLD_TILINGS.find(p=>p.id===pattern);if(!info)throw new RangeError('Unknown mathematical tiling');if(!Number.isFinite(edge)||edge<=0||!Array.isArray(bounds)||bounds.length!==4||!bounds.every(Number.isFinite)||bounds[0]>=bounds[2]||bounds[1]>=bounds[3])throw new RangeError('Positive edge and finite increasing bounds required');
 const cells=[],emit=(id,kind,polygon,extra={})=>{const p=tidy(polygon),bbox=box(p);if(!p.length||!overlaps(bbox,bounds))return;cells.push({id,kind,polygon:p,rhomb:p,edges:p.map((a,i)=>[a,p[(i+1)%p.length]]),paired:true,complete:true,box:bbox,...extra});};
 if(pattern==='penrose'){
  const far=Math.max(...[[bounds[0],bounds[1]],[bounds[0],bounds[3]],[bounds[2],bounds[1]],[bounds[2],bounds[3]]].map(p=>Math.hypot(...p))),R=radius??Math.max(edge*PHI**depth,(far+3*edge)/Math.cos(Math.PI/10)),patch=createPenroseRhombPatch({depth,radius:R});
  for(const p of patch)if(overlaps(box(p.rhomb),bounds)){if(!p.paired)throw new RangeError('A Penrose seed boundary half reached the requested crop');emit(p.id,p.kind,p.rhomb,{triangleIds:p.triangleIds});}
  return{pattern,info,cells,bounds:bounds.slice(),edge:R/PHI**depth,periodic:false};
 }
 const lattice=(u,v,build)=>{const determinant=u[0]*v[1]-u[1]*v[0],corners=[[bounds[0],bounds[1]],[bounds[0],bounds[3]],[bounds[2],bounds[1]],[bounds[2],bounds[3]]],q=corners.map(([x,y])=>(x*v[1]-y*v[0])/determinant),r=corners.map(([x,y])=>(u[0]*y-u[1]*x)/determinant),loQ=Math.floor(Math.min(...q))-3,hiQ=Math.ceil(Math.max(...q))+3,loR=Math.floor(Math.min(...r))-3,hiR=Math.ceil(Math.max(...r))+3;if((hiQ-loQ+1)*(hiR-loR+1)>100000)throw new RangeError('The requested tile field is too dense');for(let Q=loQ;Q<=hiQ;Q++)for(let R=loR;R<=hiR;R++)build([Q*u[0]+R*v[0],Q*u[1]+R*v[1]],Q,R);return{u,v};};
 let periods;
 if(pattern==='square')periods=lattice([edge,0],[0,edge],([x,y],q,r)=>emit(`square-${q}-${r}`,Math.abs(q+r)%2,[[x,y],[x+edge,y],[x+edge,y+edge],[x,y+edge]],{tileType:'square'}));
 else if(pattern==='triangular'){const h=Math.sqrt(3)*edge/2;periods=lattice([edge,0],[edge/2,h],([x,y],q,r)=>{emit(`triangle-up-${q}-${r}`,0,[[x,y],[x+edge,y],[x+edge/2,y+h]],{tileType:'equilateral triangle'});emit(`triangle-down-${q}-${r}`,1,[[x+edge,y],[x+1.5*edge,y+h],[x+edge/2,y+h]],{tileType:'equilateral triangle'});});}
 else if(pattern==='hexagonal')periods=lattice([1.5*edge,Math.sqrt(3)*edge/2],[0,Math.sqrt(3)*edge],([x,y],q,r)=>emit(`hexagon-${q}-${r}`,0,regular(6,edge,x,y),{tileType:'regular hexagon'}));
 else if(pattern==='octagon-square'){const spacing=(1+Math.SQRT2)*edge,R=edge/(2*Math.sin(Math.PI/8));periods=lattice([spacing,0],[0,spacing],([x,y],q,r)=>{emit(`octagon-${q}-${r}`,0,regular(8,R,x,y,Math.PI/8),{tileType:'regular octagon'});emit(`octagon-square-${q}-${r}`,1,regular(4,edge/Math.SQRT2,x+spacing/2,y+spacing/2),{tileType:'square'});});}
 else{const h=Math.sqrt(3)*edge;periods=lattice([2*edge,0],[edge,h],([x,y],q,r)=>{emit(`trihex-hexagon-${q}-${r}`,0,regular(6,edge,x,y),{tileType:'regular hexagon'});emit(`trihex-triangle-down-${q}-${r}`,1,[[x+edge,y],[x+1.5*edge,y+h/2],[x+edge/2,y+h/2]],{tileType:'equilateral triangle'});emit(`trihex-triangle-up-${q}-${r}`,1,[[x+1.5*edge,y+h/2],[x+2.5*edge,y+h/2],[x+2*edge,y+h]],{tileType:'equilateral triangle'});});}
 return{pattern,info,cells,bounds:bounds.slice(),edge,periodic:true,periods};
}
