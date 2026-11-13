import assert from 'node:assert/strict';
import {buildBabelLibrary} from '../src/babel-library-scene.js';
import {BABEL} from '../src/babel-library-model.js';
import {fitBabelRadialMouths} from '../src/babel-mouth-clearance.js';
import {mountBabelSpokes} from '../src/babel-spoke-mounts.js';
import {fitBabelPerimeter} from '../src/babel-vault-perimeter.js';
import {fitBabelEntryReveals} from '../src/babel-entry-reveals.js';
import {seatBabelEntryLamps} from '../src/babel-entry-bookcases.js';
import {mountBabelTerraceGlobes} from '../src/babel-globe-mounts.js';
import {babelGuardSnapshot} from './babel-entry-guards.mjs';
export function measureCasework(T,built,mouths,BABEL){
 const near=(a,b,e=2e-4)=>Math.abs(a-b)<e,root=built.group,failures=[];
 root.updateMatrixWorld(true);
 const area=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i].x*q.z-q.x*p[i].z;}return a/2;};
 const clip=(subject,boundary)=>{let out=subject;const sign=Math.sign(area(boundary));if(!sign)return[];for(let i=0;i<boundary.length&&out.length;i++){const a=boundary[i],b=boundary[(i+1)%boundary.length],distance=p=>sign*((b.x-a.x)*(p.z-a.z)-(b.z-a.z)*(p.x-a.x)),input=out;out=[];let previous=input[input.length-1],dp=distance(previous);for(const current of input){const dc=distance(current),pi=dp>=-1e-11,ci=dc>=-1e-11;if(pi!==ci){const t=Math.max(0,Math.min(1,dp/(dp-dc)));out.push({x:previous.x+(current.x-previous.x)*t,z:previous.z+(current.z-previous.z)*t});}if(ci)out.push(current);previous=current;dp=dc;}}return out;};
 // Independent analytic controls include reverse winding and a remote rigid pose.
 const square=[{x:0,z:0},{x:2,z:0},{x:2,z:2},{x:0,z:2}],half=[{x:0,z:0},{x:2,z:0},{x:0,z:2}],partial=[{x:1,z:0},{x:3,z:0},{x:1,z:2}],remote=p=>p.map(v=>({x:53+v.x*Math.cos(.71)-v.z*Math.sin(.71),z:-21+v.x*Math.sin(.71)+v.z*Math.cos(.71)}));
 const controls=[[square,half,2],[square,partial,1.5],[square,[...partial].reverse(),1.5],[square,partial.map(v=>({x:v.x+3,z:v.z})),0],[remote(square),remote(partial),1.5],[square,square,4]];
 let clippingMaxError=0;for(const[a,b,expected]of controls){const actual=Math.abs(area(clip(a,b))),error=Math.abs(actual-expected);clippingMaxError=Math.max(clippingMaxError,error);if(error>1e-9)failures.push({kind:'analytic-clipping-control',expected,actual});}
 const footprint=m=>[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([x,z])=>{const p=new T.Vector3(x,-.5,z).applyMatrix4(m);return{x:p.x,z:p.z};});
 const inside=(m,p)=>p.clone().applyMatrix4(m.clone().invert()).toArray().every(v=>Math.abs(v)<.500005);
 const core=(a,b,p)=>[-.003,.003].every(x=>[-.003,.003].every(y=>[-.003,.003].every(z=>{const q=p.clone().add(new T.Vector3(x,y,z));return inside(a,q)&&inside(b,q);})));
 const source=root.children.find(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&o.material.color?.getHex()===0x765238),binding=mouths.bindings.find(v=>v.source===source),owner=binding.clone,records=[];
 for(let id=0;id<source.count;id++){const raw=new T.Matrix4(),m=new T.Matrix4(),p=new T.Vector3(),s=new T.Vector3();source.getMatrixAt(id,raw);owner.getMatrixAt(id,m);raw.decompose(p,new T.Quaternion(),s);records.push({id,raw,m,p,s,changed:!raw.equals(m)});}
 const levels=[],footDetails=[],jointAreas=[],jointByScope={unchanged:[],fitted:[]},ratios=[],overhangs=[];let feet=0,shelfJoints=0,jointCores=0,completeFeet=0,partialFeet=0,unsupportedFeet=0,changedFeet=0,changedJoints=0,floorRays=0,floorHits=0,maxFootPlaneError=0,clearanceCorners=0,minWalkingMargin=Infinity,minCornerMargin=Infinity;
 for(const l of BABEL.levels){
  const posts=records.filter(v=>near(v.p.y,l.y+1.9)&&near(v.s.y,3.8)&&near(v.s.z,.95)&&near(v.s.x,.15)),boards=records.filter(v=>near(v.s.y,.11)&&near(v.s.z,1)&&near(Math.hypot(v.p.x,v.p.z),l.r+4)&&Math.abs((v.p.y-l.y-.12)/.69-Math.round((v.p.y-l.y-.12)/.69))<.0002);
  const floor=root.getObjectByName('Terrace '+l.id+' outer walking floor');if(!floor)throw Error('Actual terrace floor missing');const pos=floor.geometry.attributes.position,index=floor.geometry.index,triangles=[],edges=new Map();
  for(let i=0;i<(index?.count||pos.count);i+=3){const tri=[0,1,2].map(j=>{const p=new T.Vector3().fromBufferAttribute(pos,index?index.getX(i+j):i+j).applyMatrix4(floor.matrixWorld);if(!near(p.y,l.y,1e-5))throw Error('Floor plane changed');return{x:p.x,z:p.z};});if(Math.abs(area(tri))<1e-12)continue;triangles.push({p:tri,minX:Math.min(...tri.map(v=>v.x)),maxX:Math.max(...tri.map(v=>v.x)),minZ:Math.min(...tri.map(v=>v.z)),maxZ:Math.max(...tri.map(v=>v.z))});for(let j=0;j<3;j++){const a=tri[j],b=tri[(j+1)%3],keys=[a.x+','+a.z,b.x+','+b.z].sort(),key=keys.join('|'),edge=edges.get(key);if(edge)edge.count++;else edges.set(key,{a,b,count:1});}}
  const boundary=[...edges.values()].filter(e=>e.count===1),pointDistance=(p,a,b)=>{const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t);};
  const groups=new Map();for(const b of boards){const key=b.p.x.toFixed(5)+','+b.p.z.toFixed(5);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(b);}
  let localFull=0,localPartial=0,localMissing=0,localChanged=0,localContacts=0;const localRatios=[],localOverhangs=[];
  for(const p of posts){feet++;if(p.changed){changedFeet++;localChanged++;}const poly=footprint(p.m),total=Math.abs(area(poly)),bounds={minX:Math.min(...poly.map(v=>v.x)),maxX:Math.max(...poly.map(v=>v.x)),minZ:Math.min(...poly.map(v=>v.z)),maxZ:Math.max(...poly.map(v=>v.z))};let covered=0;
   for(const t of triangles){if(t.maxX<bounds.minX||t.minX>bounds.maxX||t.maxZ<bounds.minZ||t.minZ>bounds.maxZ)continue;covered+=Math.abs(area(clip(poly,t.p)));}
   const ratio=covered/total;if(ratio>1+1e-7)failures.push({level:l.id,id:p.id,kind:'overlapping-floor-coverage',ratio});ratios.push(ratio);localRatios.push(ratio);
   if(covered<1e-8){unsupportedFeet++;localMissing++;}else if(Math.abs(covered-total)<1e-8){completeFeet++;localFull++;}else{partialFeet++;localPartial++;}
   let hits=0,overhang=0;for(const x of[-.499,0,.499])for(const z of[-.499,0,.499]){const v=new T.Vector3(x,-.5,z).applyMatrix4(p.m);maxFootPlaneError=Math.max(maxFootPlaneError,Math.abs(v.y-l.y));const ray=new T.Raycaster(new T.Vector3(v.x,l.y+.01,v.z),new T.Vector3(0,-1,0),0,.021);floorRays++;if(ray.intersectObject(floor,false).length){hits++;floorHits++;}}
   for(const v of poly){const hit=triangles.some(t=>{if(v.x<t.minX-1e-9||v.x>t.maxX+1e-9||v.z<t.minZ-1e-9||v.z>t.maxZ+1e-9)return false;const sign=Math.sign(area(t.p));return t.p.every((a,j)=>{const b=t.p[(j+1)%3];return sign*((b.x-a.x)*(v.z-a.z)-(b.z-a.z)*(v.x-a.x))>=-1e-10;});});if(!hit)overhang=Math.max(overhang,Math.min(...boundary.map(e=>pointDistance(v,e.a,e.b))));}
   overhangs.push(overhang);localOverhangs.push(overhang);footDetails.push({level:l.id,id:p.id,changed:p.changed,area:total,coveredArea:covered,ratio,cornerOverhang:overhang,rays:hits});
  }
  for(const shelves of groups.values()){if(shelves.length!==6){failures.push({level:l.id,kind:'shelf-row-count',n:shelves.length});continue;}const radial=new T.Vector3().setFromMatrixColumn(shelves[0].raw,2).normalize(),casePosts=posts.filter(p=>new T.Vector3().setFromMatrixColumn(p.raw,2).normalize().dot(radial)>1-1e-10);if(casePosts.length!==2){failures.push({level:l.id,kind:'case-post-count',n:casePosts.length});continue;}
   for(const board of shelves)for(const post of casePosts){shelfJoints++;localContacts++;if(board.changed||post.changed)changedJoints++;const pp=new T.Vector3().setFromMatrixPosition(post.m),bp=new T.Vector3().setFromMatrixPosition(board.m);pp.y=bp.y;if(core(post.m,board.m,pp))jointCores++;else failures.push({level:l.id,post:post.id,board:board.id,kind:'shelf-end-core'});const contactArea=Math.abs(area(clip(footprint(post.m),footprint(board.m))));jointAreas.push(contactArea);jointByScope[board.changed||post.changed?"fitted":"unchanged"].push(contactArea);if(contactArea<.05)failures.push({level:l.id,post:post.id,board:board.id,kind:'joint-cross-section',contactArea});}}
  for(const v of [...posts,...boards])for(const x of[-.5,.5])for(const y of[-.5,.5])for(const z of[-.5,.5]){const p=new T.Vector3(x,y,z).applyMatrix4(v.m);clearanceCorners++;minCornerMargin=Math.min(minCornerMargin,Math.hypot(p.x,p.z)-(l.r+3.25));}
  // The nearest radius can be inside an edge; corners alone are insufficient.
  for(const v of [...posts,...boards]){if(Math.abs(v.m.elements[4])+Math.abs(v.m.elements[6])>1e-8)failures.push({level:l.id,id:v.id,kind:"tilted-case-profile"});const poly=footprint(v.m);for(let i=0;i<poly.length;i++)minWalkingMargin=Math.min(minWalkingMargin,pointDistance({x:0,z:0},poly[i],poly[(i+1)%poly.length])-(l.r+3.25));}
  levels.push({level:l.id,bays:groups.size,posts:posts.length,shelves:boards.length,floorTriangles:triangles.length,completeFeet:localFull,partialFeet:localPartial,unsupportedFeet:localMissing,changedFeet:localChanged,shelfJoints:localContacts,minCoverage:Math.min(...localRatios),maxCoverage:Math.max(...localRatios),maxCornerOverhang:Math.max(...localOverhangs)});
 }
 const scopes=Object.fromEntries([["unchanged",false],["fitted",true]].map(([name,changed])=>{const rows=footDetails.filter(v=>v.changed===changed),areas=jointByScope[name];return[name,{feet:rows.length,minCoverage:Math.min(...rows.map(v=>v.ratio)),maxCoverage:Math.max(...rows.map(v=>v.ratio)),maxCornerOverhang:Math.max(...rows.map(v=>v.cornerOverhang)),shelfJoints:areas.length,minJointArea:Math.min(...areas),maxJointArea:Math.max(...areas)}];}));
 return{clippingControls:controls.length,clippingMaxError,scopes,levels,feet,completeFeet,partialFeet,unsupportedFeet,changedFeet,shelfJoints,jointCores,changedJoints,unchangedJoints:shelfJoints-changedJoints,floorRays,floorHits,maxFootPlaneError,clearanceCorners,minCornerMargin,minWalkingMargin,coverage:{min:Math.min(...ratios),max:Math.max(...ratios)},maxCornerOverhang:Math.max(...overhangs),jointArea:{min:Math.min(...jointAreas),max:Math.max(...jointAreas)},failures,footDetails};
}

export function validateBabelTerraceCasework(T){
 const G={...T},resources=new Map(),buffers=new Map();
 for(const key of Object.keys(T))if(/Geometry$|Material$|Texture$/.test(key)&&typeof T[key]==='function')G[key]=class extends T[key]{constructor(...args){super(...args);resources.set(this,0);this.addEventListener('dispose',()=>resources.set(this,resources.get(this)+1));}};
 G.InstancedMesh=class extends T.InstancedMesh{constructor(...args){super(...args);buffers.set(this,0);this.addEventListener('dispose',()=>buffers.set(this,buffers.get(this)+1));}};
 const drawing=new T.Texture();let borrowed=0;drawing.addEventListener('dispose',()=>borrowed++);
 const b=buildBabelLibrary(G,{drawing,canvas:()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})})}),scene=new T.Scene();scene.add(b.group);b.lamps.visible=true;
 const source=[];b.group.traverse(o=>source.push(o));const snapshot=nodes=>babelGuardSnapshot(T,{updateMatrixWorld:()=>b.group.updateMatrixWorld(true),traverse:fn=>nodes.forEach(fn)}),raw=snapshot(source),targets=[...b.targets];
 const adapters=[fitBabelRadialMouths(G,b),mountBabelSpokes(G,b),fitBabelPerimeter(G,b),fitBabelEntryReveals(G,b),seatBabelEntryLamps(G,b)];adapters.push(mountBabelTerraceGlobes(G,b,adapters[0]));
 const display=[];b.group.traverse(o=>{if(o.isMesh&&!adapters[0].bindings.some(v=>v.source===o))display.push(o);});const installed=snapshot(display),counts=[resources.size,buffers.size],locked={...T};
 for(const key of Object.keys(T))if(/Geometry$|Material$|Texture$|Light$/.test(key)||['Mesh','InstancedMesh','Group'].includes(key))if(typeof T[key]==='function')locked[key]=class{constructor(){throw Error('Inspection allocated a rendering resource '+key);}};
 const globals=['document','localStorage','sessionStorage','fetch'],saved=globals.map(k=>Object.getOwnPropertyDescriptor(globalThis,k));let result;
 try{globals.forEach(k=>Object.defineProperty(globalThis,k,{configurable:true,get(){throw Error('Inspection touched '+k);}}));result=measureCasework(locked,b,adapters[0],BABEL);}finally{globals.forEach((k,i)=>saved[i]?Object.defineProperty(globalThis,k,saved[i]):delete globalThis[k]);}
 assert.deepEqual(result.failures,[]);assert.equal(result.clippingControls,6);assert(result.clippingMaxError<1e-9);
 assert.deepEqual(result.levels.map(l=>[l.bays,l.posts,l.shelves,l.changedFeet]),[[119,238,714,0],[96,192,576,2],[74,148,444,2],[51,102,306,4],[26,52,156,0]]);
 assert.equal(result.feet,732);assert.equal(result.partialFeet,732);assert.equal(result.completeFeet,0);assert.equal(result.unsupportedFeet,0);assert.equal(result.changedFeet,8);
 assert.equal(result.scopes.unchanged.feet,724);assert.equal(result.scopes.unchanged.shelfJoints,4344);assert.equal(result.scopes.fitted.feet,8);assert.equal(result.scopes.fitted.shelfJoints,48);
 assert(result.scopes.unchanged.minCoverage>.8537&&result.scopes.unchanged.maxCoverage<.9030);assert(result.scopes.fitted.minCoverage>.8801&&result.scopes.fitted.maxCoverage<.9152);
 assert(result.footDetails.every(v=>v.area>.104&&v.area<.14251&&v.coveredArea>0&&v.coveredArea<v.area&&v.rays===6));
 assert.equal(result.shelfJoints,4392);assert.equal(result.jointCores,4392);assert.equal(result.changedJoints,48);assert.equal(result.unchangedJoints,4344);assert(result.jointArea.min>.0943&&result.jointArea.max<.12826);
 assert.equal(result.floorRays,6588);assert.equal(result.floorHits,4392);assert(result.maxFootPlaneError<1e-6);assert.equal(result.clearanceCorners,23424);assert(result.minWalkingMargin>.2499&&result.minWalkingMargin<.2501);assert(result.maxCornerOverhang<.1458);
 assert.deepEqual(snapshot(display),installed);assert.deepEqual(snapshot(source),raw);assert.deepEqual(b.targets,targets);assert.deepEqual([resources.size,buffers.size],counts);
 assert.equal(raw.hash,'7b21ef65631174a885fd0333480d32cab44193e1afc96a3c595d55e21e3bde66');assert.equal(installed.hash,'3a06700f3902dea7051535bf29ecf6fc787bd374259582c99ba28077649f1399');assert.equal(installed.meshes,69);assert.equal(installed.instances,41929);
 b.dispose();for(const a of adapters){a.sync();a.dispose();a.dispose();}assert.equal(resources.size,86);assert.equal(buffers.size,37);assert([...resources.values()].every(n=>n===1));assert([...buffers.values()].every(n=>n===1));assert.equal(borrowed,0);drawing.dispose();
 const {footDetails,failures,...summary}=result;return{...summary,raw,installed,resources:86,buffers:37,releasedOnce:true,borrowedDisposals:0};
}
