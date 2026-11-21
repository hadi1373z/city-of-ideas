// Offline deterministic path generation. Runtime imports only frozen waypoints.
import {writeFileSync} from 'node:fs';
import * as T from '../../src/city-source-assets/home-tools/vendor/three.module.js';
import {NIGHT_HOME_PARCELS as sites,RELOCATED_NIGHT_HOME_INDICES as ids} from '../../src/night-home-layout.js';
import {inNightPark,NIGHT_PARK_LANTERNS as lamps} from '../../src/night-park-model.js';
import {buildLowerLandscape} from '../../src/lower-landscape-scene.js';
import {buildWorldCylinder} from '../../src/world-cylinder-scene.js';
import {inLowerInlet,LOWER_COAST} from '../../src/lower-landscape-model.js';
const owned=new Set(),land=buildLowerLandscape(T,{parent:new T.Group(),own:r=>(owned.add(r),r)}),world=buildWorldCylinder(T),obs=[...land.obstacles,...world.lowerObstacles].map(o=>({x:o.x+2160,z:o.z+65,r:o.radius})),key=(x,z)=>x+','+z;
function bins(rows,size){const m=new Map();for(const p of rows){const k=key(Math.floor(p.x/size),Math.floor(p.z/size));if(!m.has(k))m.set(k,[]);m.get(k).push(p);}return(x,z)=>{const a=[],cx=Math.floor(x/size),cz=Math.floor(z/size);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)a.push(...(m.get(key(cx+i,cz+j))??[]));return a;};}
const nearHomes=bins(sites,54),nearObs=bins(obs,24);
function point(x,z){const b=LOWER_COAST.bridge,bridge=x>b.minX+2.3&&x<b.maxX-2.3&&z>b.minZ&&z<b.maxZ;return Math.hypot(x,z)<532&&Math.hypot(x,z)>83&&!(x>-312.3&&x<-39.7&&z>-187.3&&z<172.3)&&(bridge||!inLowerInlet(x,z,3.3))&&!inNightPark(x,z,6)&&!lamps.some(p=>Math.hypot(x-p[0],z-p[1])<2.5)&&!nearHomes(x,z).some(p=>Math.abs(x-p.x)<25&&z>p.z-19&&z<p.z+31)&&!nearObs(x,z).some(o=>Math.hypot(x-o.x,z-o.z)<o.r+2.28);}
function line(a,b){const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.5);for(let i=0;i<=n;i++)if(!point(a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n))return false;return true;}
const graph=new Map();for(let x=-531;x<=531;x+=3)for(let z=-531;z<=531;z+=3)if(point(x,z))graph.set(key(x,z),{x,z,edges:[]});
for(const p of graph.values())for(const[dx,dz]of[[3,0],[0,3]]){const q=graph.get(key(p.x+dx,p.z+dz));if(q&&line([p.x,p.z],[q.x,q.z])){p.edges.push(q);q.edges.push(p);}}
const start=graph.get(key(-27,189)),parents=new Map([[key(start.x,start.z),null]]),queue=[start];
for(let i=0;i<queue.length;i++)for(const n of queue[i].edges)if(!parents.has(key(n.x,n.z))){parents.set(key(n.x,n.z),queue[i]);queue.push(n);}
const paths=sites.map((s,i)=>{const f=s.front,node=queue.filter(n=>Math.hypot(n.x-f[0],n.z-f[1])<45&&line([n.x,n.z],f)).sort((a,b)=>Math.hypot(a.x-f[0],a.z-f[1])-Math.hypot(b.x-f[0],b.z-f[1]))[0];if(!node)throw Error('Disconnected '+i+' '+s.x+','+s.z);const p=[];let n=node;while(n){p.push([n.x,n.z]);n=parents.get(key(n.x,n.z));}p.reverse();p.unshift([-30,175]);p.push(f);const out=[];for(const b of p){if(out.length&&b[0]===out.at(-1)[0]&&b[1]===out.at(-1)[1])continue;while(out.length>1){const a=out.at(-2),c=out.at(-1);if(Math.abs((c[0]-a[0])*(b[1]-c[1])-(c[1]-a[1])*(b[0]-c[0]))>1e-8)break;out.pop();}out.push(b);}return out;});
writeFileSync(new URL('../../src/night-home-park-layout.js',import.meta.url),'// Deterministic presentation parcels and public access around the full night\n// park. Source IDs, rooms and private documents are never inputs. Paths clear\n// complete yards and actual lower-world solids on a three-metre dry graph.\nexport const NIGHT_PARK_HOME_RELOCATIONS=Object.freeze('+JSON.stringify(ids.map(i=>[i,sites[i].x,sites[i].z]))+'.map(Object.freeze));\nexport const NIGHT_PARK_HOME_ACCESS=Object.freeze('+JSON.stringify(paths)+'.map(p=>Object.freeze(p.map(Object.freeze))));\n');
console.log('park relocations',ids.length,'first128',ids.filter(i=>i<128).length,'world trees',world.lowerLandscape.stats.trees,'standalone',land.stats.trees,'graph',graph.size,'connected',queue.length);
world.dispose();land.dispose();for(const r of owned)r.dispose?.();
