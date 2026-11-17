import {LOWER_COAST_WALKS,LOWER_COAST,lowerLandscapeCanStand,inLowerInlet,routeDistance} from './lower-landscape-model.js';

// Presentation parcels only. Home IDs, room coordinates and saved documents
// remain owned by the source neighbourhood; no content is read by this model.
export const NIGHT_HOME_DISTRICT=Object.freeze({origin:{x:-2160,z:-65},scale:1.35,spacing:54,roadWidth:4,anchor:[-30,175]});
const groves=[[-365,80,35,45],[-350,210,65,35],[-210,235,55,45],[-60,265,70,40],[75,305,55,45],[220,250,55,55],[340,180,35,40],[410,75,30,20],[220,-135,50,35],[95,-180,35,35],[-80,-210,50,25],[-230,-230,35,25]];
const outcrops=[[90,-148],[120,-133],[395,-108],[-380,-170],[440,215]];
const key=(x,z)=>x+','+z,half=NIGHT_HOME_DISTRICT.spacing/2;
function clearPoint(x,z,margin=2.3){
 if(Math.hypot(x,z)>535-margin||Math.hypot(x,z)<80+margin||x>-310-margin&&x<-42+margin&&z>-185-margin&&z<170+margin)return false;
 const b=LOWER_COAST.bridge,bridge=x>b.minX+margin&&x<b.maxX-margin&&z>b.minZ&&z<b.maxZ;
 if(!bridge&&inLowerInlet(x,z,margin+1))return false;
 if(groves.some(([cx,cz,rx,rz])=>((x-cx)/(rx+margin+3))**2+((z-cz)/(rz+margin+3))**2<1))return false;
 return !outcrops.some(([cx,cz])=>Math.hypot(x-cx,z-cz)<22+margin);
}
function clearLine(a,b){const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2));for(let i=0;i<=n;i++)if(!clearPoint(a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n))return false;return true;}
const graph=new Map();
for(let ix=-10;ix<10;ix++)for(let iz=-10;iz<10;iz++){const x=(ix+.5)*54,z=(iz+.5)*54;if(clearPoint(x,z))graph.set(key(x,z),{x,z,edges:[]});}
for(const n of graph.values())for(const[dx,dz]of[[54,0],[0,54]]){const other=graph.get(key(n.x+dx,n.z+dz));if(other&&clearLine([n.x,n.z],[other.x,other.z])){n.edges.push(other);other.edges.push(n);}}
const start=graph.get(key(-27,189)),parents=new Map(),queue=start?[start]:[];if(start)parents.set(key(start.x,start.z),null);
for(let i=0;i<queue.length;i++)for(const next of queue[i].edges){const id=key(next.x,next.z);if(!parents.has(id)){parents.set(id,queue[i]);queue.push(next);}}
const sites=[];
for(let ix=-10;ix<=10;ix++)for(let iz=-10;iz<=10;iz++){
 const x=ix*54,z=iz*54;if(Math.hypot(x,z)>510||Math.hypot(x,z)<110||x>-325&&x<-15&&z>-200&&z<185)continue;
 if(inLowerInlet(x,z,24)||LOWER_COAST_WALKS.some(r=>routeDistance(x,z,r)<r.width/2+22)||groves.some(([cx,cz,rx,rz])=>((x-cx)/(rx+22))**2+((z-cz)/(rz+22))**2<1)||outcrops.some(([cx,cz])=>Math.hypot(x-cx,z-cz)<43))continue;
 const a=graph.get(key(x-half,z+half)),b=graph.get(key(x+half,z+half));if(!a||!b||!parents.has(key(a.x,a.z))||!a.edges.includes(b))continue;
 sites.push({x,z,front:[x,z+half],node:a});
}
// First homes form the southern night neighbourhood. Later editions occupy
// further connected clear parcels, all within the same physical circular face.
sites.sort((a,b)=>{const rank=p=>Math.hypot(p.x+108,p.z-378);return rank(a)-rank(b)||a.z-b.z||a.x-b.x;});
export const NIGHT_HOME_PARCELS=Object.freeze(sites.map((s,index)=>Object.freeze({index,x:s.x,z:s.z,front:Object.freeze(s.front)})));
export function nightHomeTransform(index){const s=sites[index];if(!s)throw Error('No supported night-face home parcel for edition '+index);return{x:s.x-2160,y:.13,z:s.z-65,scale:1.35};}
export function nightHomeAccess(index,entry){const s=sites[index];if(!s||![entry?.x,entry?.z].every(Number.isFinite))return[];const route=[];let node=s.node;while(node){route.push([node.x,node.z]);node=parents.get(key(node.x,node.z));}route.reverse();return[NIGHT_HOME_DISTRICT.anchor,...route,s.front,[entry.x+2160,entry.z+65]].map(([x,z])=>[x-2160,z-65]);}
export function nightHomeParcelClear(index){const p=sites[index];return !!p&&!!start&&lowerLandscapeCanStand(p.x,p.z)&&clearLine(NIGHT_HOME_DISTRICT.anchor,[start.x,start.z]);}

/** Shared trunk edges have one physical owner, even when many homes use them. */
export function nightHomeRoadSegments(paths){
 const rows=new Map(),other=new Map(),round=n=>Math.round(n*1e5)/1e5;
 for(const path of paths)for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i];if(Math.hypot(b[0]-a[0],b[1]-a[1])<.001)continue;
  const axis=Math.abs(a[0]-b[0])<1e-5?'z':Math.abs(a[1]-b[1])<1e-5?'x':null;
  if(axis){const fixed=round(axis==='x'?a[1]:a[0]),id=axis+':'+fixed;if(!rows.has(id))rows.set(id,{axis,fixed,ranges:[]});const j=axis==='x'?0:1;rows.get(id).ranges.push([Math.min(a[j],b[j]),Math.max(a[j],b[j])]);}
  else{const ends=[a.map(round),b.map(round)].sort((p,q)=>p[0]-q[0]||p[1]-q[1]);other.set(JSON.stringify(ends),ends);}
 }
 const segments=[...other.values()];for(const{axis,fixed,ranges}of rows.values()){
  ranges.sort((a,b)=>a[0]-b[0]);const merged=[];for(const range of ranges){const prior=merged.at(-1);if(prior&&range[0]<=prior[1]+1e-5)prior[1]=Math.max(prior[1],range[1]);else merged.push([...range]);}
  for(const[a,b]of merged)segments.push(axis==='x'?[[a,fixed],[b,fixed]]:[[fixed,a],[fixed,b]]);
 }return segments;
}
