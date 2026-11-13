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
export function measureGuards(T, built, mouths, BABEL) {
 const root=built.group,near=(a,b,e=2e-4)=>Math.abs(a-b)<e,tau=Math.PI*2;
 root.updateMatrixWorld(true);
 const inside=(m,p)=>p.clone().applyMatrix4(m.clone().invert()).toArray().every(v=>Math.abs(v)<.500005);
 const core=(a,b,p)=>[-.003,.003].every(x=>[-.003,.003].every(y=>[-.003,.003].every(z=>{const q=p.clone().add(new T.Vector3(x,y,z));return inside(a,q)&&inside(b,q);})));
 // Raw public profiles identify records; every contact uses its actual display copy.
 const binding=o=>mouths.bindings.find(v=>v.source===o),records=[];
 for(const source of root.children.filter(o=>o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&[0x3e3027,0x765238,0xa58b56].includes(o.material.color?.getHex()))){
  const owner=binding(source)?.clone||source;
  for(let id=0;id<source.count;id++){const raw=new T.Matrix4(),m=new T.Matrix4(),p=new T.Vector3(),size=new T.Vector3();source.getMatrixAt(id,raw);owner.getMatrixAt(id,m);raw.decompose(p,new T.Quaternion(),size);records.push({id,source,owner,raw,m,p,size,color:source.material.color.getHex(),changed:!raw.equals(m)});}
 }
 const floorMeshes=[];root.traverse(o=>{if(!o.isMesh||o.geometry.type==='BoxGeometry'||o.material.color?.getHex()!==0x9c8965)return;for(let p=o;p;p=p.parent)if(!p.visible)return;floorMeshes.push(o);});
 const interval=(m,p,d)=>{const inv=m.clone().invert(),a=p.clone().applyMatrix4(inv),b=p.clone().add(d).applyMatrix4(inv).sub(a);let lo=-Infinity,hi=Infinity;for(const k of['x','y','z']){if(Math.abs(b[k])<1e-10){if(Math.abs(a[k])>.5000001)return null;continue;}const x=(-.5-a[k])/b[k],y=(.5-a[k])/b[k];lo=Math.max(lo,Math.min(x,y));hi=Math.min(hi,Math.max(x,y));}return hi>=lo?[lo,hi]:null;};
 const levels=[],failures=[],footDetails=[],jointSpans={fascia:[],middle:[],handrail:[]};let floorRays=0,floorHits=0,fasciaRays=0,postFoot=0,footFascia=0,postMiddle=0,postTop=0,jointCores=0,clearanceCorners=0,minWalkingMargin=Infinity;
 for(const l of BABEL.levels){const radius=l.r-3.8;
  const rows=(color,y,h,d)=>records.filter(v=>v.color===color&&near(v.p.y,l.y+y)&&near(v.size.y,h)&&near(v.size.z,d)&&near(Math.hypot(v.p.x,v.p.z),radius));
  const fascias=rows(0x3e3027,-.17,.38,.16),feet=rows(0x3e3027,.0325,.065,.22),posts=rows(0xa58b56,.55,1.1,.10),middle=rows(0xa58b56,.60,.06,.075),handrails=rows(0x765238,1.08,.10,.14);
  const j=(v,half=0)=>((Math.round(Math.atan2(v.p.z,v.p.x)/tau*240-half)%240)+240)%240;
  for(const v of [...fascias,...feet,...posts,...middle,...handrails])for(const x of[-.5,.5])for(const y of[-.5,.5])for(const z of[-.5,.5]){const p=new T.Vector3(x,y,z).applyMatrix4(v.m);clearanceCorners++;minWalkingMargin=Math.min(minWalkingMargin,l.r-3.35-Math.hypot(p.x,p.z));}
  const maps={fascia:new Map(fascias.map(v=>[j(v,.5),v])),middle:new Map(middle.map(v=>[j(v,.5),v])),handrail:new Map(handrails.map(v=>[j(v,.5),v]))};
  const planes=floorMeshes.filter(o=>{const box=new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(o.matrixWorld);return near(box.min.y,l.y,1e-4)&&near(box.max.y,l.y,1e-4);});
  const at=(a,y)=>new T.Vector3(Math.cos(a)*radius,y,Math.sin(a)*radius),floorHit=p=>new T.Raycaster(new T.Vector3(p.x,l.y+.01,p.z),new T.Vector3(0,-1,0),0,.021).intersectObjects(planes,false).some(h=>near(h.point.y,l.y,1e-5));
  let completeFeet=0,partialFeet=0,unseatedFeet=0,changed=0,rootedFacias=0;
  for(const f of feet){const index=j(f),p=f.p.clone();p.y=l.y+.0325;const post=posts.find(v=>j(v)===index);if(!post||!core(f.m,post.m,p))failures.push({level:l.id,foot:f.id,kind:'post-foot'});else postFoot++;
   // Keep all inner-edge misses: these plates have partial floor footprints.
   let hits=0;for(const x of[-.499,0,.499])for(const z of[-.499,0,.499]){const q=new T.Vector3(x,-.5,z).applyMatrix4(f.m);floorRays++;if(floorHit(q)){floorHits++;hits++;}}
   if(hits===9)completeFeet++;else if(hits>0)partialFeet++;else unseatedFeet++;
   const a=fascias.find(v=>core(f.m,v.m,new T.Vector3(f.p.x,l.y+.01,f.p.z)));if(a)footFascia++;else failures.push({level:l.id,foot:f.id,kind:'foot-fascia',hits});
   const mid=middle.find(v=>core(post.m,v.m,new T.Vector3(post.p.x,l.y+.60,post.p.z))),top=handrails.find(v=>core(post.m,v.m,new T.Vector3(post.p.x,l.y+1.075,post.p.z)));
   if(mid)postMiddle++;else failures.push({level:l.id,post:post?.id,kind:'post-middle'});if(top)postTop++;else failures.push({level:l.id,post:post?.id,kind:'post-handrail'});
   footDetails.push({level:l.id,j:index,id:f.id,post:post?.id,floorHits:hits,fascia:a?.id});
  }
  for(const f of fascias){let hits=0;for(const x of[-.4,0,.4]){const p=new T.Vector3(x,0,.31).applyMatrix4(f.m);fasciaRays++;if(floorHit(p))hits++;}if(hits===3)rootedFacias++;else failures.push({level:l.id,id:f.id,kind:'fascia-floor',hits});if(f.changed)changed++;}
  // Only contiguous retained records are joints; open ends never form a new pair.
  let pairs=0,changedPairs=0;const openEnds=[];
  for(const [index,f]of maps.fascia){const next=(index+1)%240;if(!maps.fascia.has(next)){openEnds.push(index);continue;}pairs++;for(const [kind,y]of[['fascia',-.17],['middle',.60],['handrail',1.08]]){const a=maps[kind].get(index),b=maps[kind].get(next);if(!a||!b){failures.push({level:l.id,index,kind:'missing-'+kind});continue;}const p=at(next/240*tau,l.y+y);if(core(a.m,b.m,p))jointCores++;else failures.push({level:l.id,index,kind:'joint-'+kind});const d=new T.Vector3(-Math.sin(next/240*tau),0,Math.cos(next/240*tau)),ia=interval(a.m,p,d),ib=interval(b.m,p,d);jointSpans[kind].push(ia&&ib?Math.min(ia[1],ib[1])-Math.max(ia[0],ib[0]):null);if(a.changed||b.changed)changedPairs++;}}
  levels.push({level:l.id,radius,fascias:fascias.length,feet:feet.length,posts:posts.length,middle:middle.length,handrails:handrails.length,planeOwners:planes.length,completeFeet,partialFeet,unseatedFeet,rootedFacias,internalPairs:pairs,changedFascias:changed,changedPairParts:changedPairs,openEnds});
 }
 return{levels,floorRays,floorHits,fasciaRays,postFoot,footFascia,postMiddle,postTop,jointCores,clearanceCorners,minWalkingMargin,spans:Object.fromEntries(Object.entries(jointSpans).map(([k,v])=>[k,{n:v.length,min:Math.min(...v),max:Math.max(...v),nulls:v.filter(x=>x===null).length}])),failures,footDetails};
}

export function validateBabelBalconyGuards(T) {
 const G={...T},resources=new Map(),buffers=new Map();
 for(const key of Object.keys(T))if(/Geometry$|Material$|Texture$/.test(key)&&typeof T[key]==='function')G[key]=class extends T[key]{constructor(...args){super(...args);resources.set(this,0);this.addEventListener('dispose',()=>resources.set(this,resources.get(this)+1));}};
 G.InstancedMesh=class extends T.InstancedMesh{constructor(...args){super(...args);buffers.set(this,0);this.addEventListener('dispose',()=>buffers.set(this,buffers.get(this)+1));}};
 const drawing=new T.Texture();let borrowed=0;drawing.addEventListener('dispose',()=>borrowed++);
 const b=buildBabelLibrary(G,{drawing,canvas:()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})})}),scene=new T.Scene();scene.add(b.group);b.lamps.visible=true;
 const source=[];b.group.traverse(o=>source.push(o));
 const snapshot=(nodes)=>babelGuardSnapshot(T,{updateMatrixWorld:()=>b.group.updateMatrixWorld(true),traverse:fn=>nodes.forEach(fn)});
 const raw=snapshot(source),targets=[...b.targets];
 const adapters=[fitBabelRadialMouths(G,b),mountBabelSpokes(G,b),fitBabelPerimeter(G,b),fitBabelEntryReveals(G,b),seatBabelEntryLamps(G,b)];
 adapters.push(mountBabelTerraceGlobes(G,b,adapters[0]));
 const display=[];b.group.traverse(o=>{if(o.isMesh&&!adapters[0].bindings.some(v=>v.source===o))display.push(o);});
 const installed=snapshot(display),counts=[resources.size,buffers.size],locked={...T};
 for(const key of Object.keys(T))if(/Geometry$|Material$|Texture$|Light$/.test(key)||['InstancedMesh','Mesh','Group'].includes(key))if(typeof T[key]==='function')locked[key]=class{constructor(){throw Error('Audit allocated a render resource '+key);}};
 const globals=['document','localStorage','sessionStorage','fetch'],saved=globals.map(k=>Object.getOwnPropertyDescriptor(globalThis,k));
 let result;try{globals.forEach(k=>Object.defineProperty(globalThis,k,{configurable:true,get(){throw Error('Audit touched '+k);}}));result=measureGuards(locked,b,adapters[0],BABEL);}finally{globals.forEach((k,i)=>saved[i]?Object.defineProperty(globalThis,k,saved[i]):delete globalThis[k]);}
 assert.deepEqual(result.failures,[]);
 assert.deepEqual(result.levels.map(l=>[l.fascias,l.feet,l.internalPairs,l.openEnds.length]),[[231,116,229,2],[235,117,234,1],[235,117,234,1],[231,115,230,1],[240,120,240,0]]);
 assert(result.levels.every(l=>l.posts===l.feet&&l.middle===l.fascias&&l.handrails===l.fascias&&l.partialFeet===l.feet&&l.completeFeet===0&&l.unseatedFeet===0&&l.rootedFacias===l.fascias));
 assert.equal(result.floorRays,5265);assert.equal(result.floorHits,2960);assert.equal(result.fasciaRays,3516);
 for(const k of['postFoot','footFascia','postMiddle','postTop'])assert.equal(result[k],585,k);
 assert.equal(result.jointCores,3501);assert.equal(result.clearanceCorners,37488);assert(result.minWalkingMargin>.294);
 for(const span of Object.values(result.spans)){assert.equal(span.n,1167);assert.equal(span.nulls,0);assert(span.min>.020&&span.max<.02005);}
 assert.equal(result.levels.reduce((n,l)=>n+l.changedPairParts,0),6,'Six already-retained far contacts remain distinct from 3495 unchanged internal contacts');
 assert.deepEqual(snapshot(display),installed);assert.deepEqual(snapshot(source),raw);assert.deepEqual(b.targets,targets);assert.deepEqual([resources.size,buffers.size],counts);
 assert.equal(raw.hash,'7b21ef65631174a885fd0333480d32cab44193e1afc96a3c595d55e21e3bde66');
 assert.equal(installed.hash,'3a06700f3902dea7051535bf29ecf6fc787bd374259582c99ba28077649f1399');assert.equal(installed.meshes,69);assert.equal(installed.instances,41929);
 b.dispose();for(const a of adapters){a.sync();a.dispose();a.dispose();}assert([...resources.values()].every(n=>n===1));assert([...buffers.values()].every(n=>n===1));assert.equal(resources.size,86);assert.equal(buffers.size,37);assert.equal(borrowed,0);drawing.dispose();
 const {footDetails,failures,...summary}=result;
 return{...summary,raw,installed,resources:86,buffers:37,releasedOnce:true,borrowedDisposals:0};
}
