import assert from 'node:assert/strict';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {buildBabelLibrary} from '../src/babel-library-scene.js';
import {stairs} from '../src/babel-library-model.js';
import {babelGuardSnapshot} from './babel-entry-guards.mjs';
import {validateBabelCatalogueDesks} from './babel-catalogue-desks.mjs';
import {validateBabelTerraceGlobes} from './babel-terrace-globes.mjs';
import {validateBabelGlobeMounts,validateBabelGlobeMountLifecycle} from './babel-globe-mounts.mjs';
import {mountBabelTerraceGlobes} from '../src/babel-globe-mounts.js';
import {validateBabelBalconyGuards} from './babel-balcony-guards.mjs';
import {validateBabelTerraceCasework} from './babel-terrace-casework.mjs';
import {seatBabelTerraceBindings} from '../src/babel-terrace-bindings.js';
import {validateBabelTerraceBindings,validateBabelBindingLifecycle} from './babel-terrace-bindings.mjs';
const names=[['babel-mouth-clearance','fitBabelRadialMouths'],['babel-spoke-mounts','mountBabelSpokes'],['babel-vault-perimeter','fitBabelPerimeter'],['babel-entry-reveals','fitBabelEntryReveals'],['babel-entry-bookcases','seatBabelEntryLamps']];
const mods=await Promise.all(names.map(async([file,name])=>({name,fn:(await import('../src/'+file+'.js'))[name]}))),canvas=()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})});
function inspect(build,label,pipeline=mods){const resources=new Map(),buffers=new Map(),G={...T};for(const key of Object.keys(T))if(/Geometry$|Material$|Texture$/.test(key)&&typeof T[key]==='function')G[key]=class extends T[key]{constructor(...a){super(...a);resources.set(this,0);this.addEventListener('dispose',()=>resources.set(this,resources.get(this)+1));}};G.InstancedMesh=class extends T.InstancedMesh{constructor(...a){super(...a);buffers.set(this,0);this.addEventListener('dispose',()=>buffers.set(this,buffers.get(this)+1));}};
 const drawing=new T.Texture();let borrowed=0;drawing.addEventListener('dispose',()=>borrowed++);const b=build(G,{canvas,drawing}),root=b.group,scene=new T.Scene();scene.add(root);root.updateMatrixWorld(true);const nodes=[];root.traverse(o=>nodes.push(o));const raw=babelGuardSnapshot(T,root),vis=nodes.filter(o=>o.isMesh).map(o=>[o,o.visible]),targets=[...b.targets],resourceCount=resources.size,bufferCount=buffers.size,adapters=pipeline.map(m=>({name:m.name,value:m.fn(G,b)}));adapters.push({name:"mountBabelTerraceGlobes",value:mountBabelTerraceGlobes(G,b,adapters[0].value)});adapters.push({name:"seatBabelTerraceBindings",value:seatBabelTerraceBindings(G,b,adapters[0].value)});root.updateMatrixWorld(true);
 b.lamps.visible=true;const sourceAfter=babelGuardSnapshot(T,{updateMatrixWorld:()=>root.updateMatrixWorld(true),traverse:f=>nodes.forEach(f)}),sourceVisibilityChanged=vis.filter(([o,v])=>o.visible!==v).length,targetChanged=b.targets.length!==targets.length||b.targets.some((t,i)=>t!==targets[i]),extraResources=resources.size-resourceCount,extraBuffers=buffers.size-bufferCount,active=[];root.traverse(o=>{if(!o.isMesh)return;for(let p=o;p;p=p.parent)if(!p.visible)return;active.push(o);});const body=[],treadMisses=[];let samples=0;
 for(const s of stairs)for(let i=0;i<24;i++)for(const u of[.1,.5,.9])for(const lane of[-1.46,-1.3,-.65,0,.65,1.3,1.46]){const r=s.outer-(i+u)*10/24,y=s.top-(i+1)/6,p=new T.Vector3(Math.cos(s.a)*r-Math.sin(s.a)*lane,y+.08,Math.sin(s.a)*r+Math.cos(s.a)*lane),hits=new T.Raycaster(p,new T.Vector3(0,1,0),0,2.02).intersectObjects(active,false);if(hits.length)body.push({flight:s.i,step:i,u,lane,feet:[p.x,y,p.z],hits:hits.map(h=>({id:h.instanceId,name:h.object.name,type:h.object.geometry.type,y:h.point.y}))});const tread=new T.Raycaster(p,new T.Vector3(0,-1,0),0,.12).intersectObjects(active,false);if(!tread.some(h=>Math.abs(h.point.y-y)<1e-4))treadMisses.push({flight:s.i,step:i,u,lane});samples++;}
 const floor=root.getObjectByName('Library base outside the open annular shaft'),floorHash=babelGuardSnapshot(T,floor),status=adapters.map(a=>({name:a.name,installed:!!a.value.group,parts:a.value.parts?.length,mounts:a.value.mounts?.length,changes:a.value.changes?.length})),installed=babelGuardSnapshot(T,{updateMatrixWorld:()=>root.updateMatrixWorld(true),traverse:f=>active.forEach(f)});b.dispose();for(const a of adapters){a.value.sync();a.value.dispose();a.value.dispose();}const resourceReleases=[...resources.values()],bufferReleases=[...buffers.values()];if(sourceAfter.hash!==raw.hash||targetChanged||borrowed!==0||resourceReleases.some(n=>n!==1)||bufferReleases.some(n=>n!==1))throw Error('Ownership/source invariant failed for '+label);
 return{label,raw,sourceAfter,status,sourceVisibilityChanged,targetChanged,floor:{hash:floorHash,positions:floor.geometry.attributes.position.count,indices:floor.geometry.index.count},installed,extraResources,extraBuffers,samples,body,treadMisses,ownedResources:resources.size,ownedBuffers:buffers.size,ownedResourcesReleasedOnce:resourceReleases.every(n=>n===1),ownedBuffersReleasedOnce:bufferReleases.every(n=>n===1),borrowedDisposals:borrowed};}

const r=inspect(buildBabelLibrary,'merged production builder');
assert.equal(r.raw.hash,'7b21ef65631174a885fd0333480d32cab44193e1afc96a3c595d55e21e3bde66');
assert.equal(r.samples,2016);assert.equal(r.body.filter(h=>h.flight<2).length,0);assert.equal(r.body.length,0,'The current four-mouth fitter clears all 2016 retained sample positions');assert.equal(r.treadMisses.length,0);
assert.deepEqual(r.status.map(s=>s.installed),[true,true,true,false,true,true,true]);assert.equal(r.targetChanged,false);assert.equal(r.borrowedDisposals,0);assert(r.ownedResourcesReleasedOnce&&r.ownedBuffersReleasedOnce);
console.log('PASS merged Babel adapters: all 2016 retained tread/body samples clear, unchanged source/targets, real main profiles and exactly-once owned cleanup. The new mounted scene clears the former low-stem sites; the prior audit stays an independent negative control.');
console.log('PASS original Babel catalogue desk contacts: '+JSON.stringify(validateBabelCatalogueDesks(T)));
console.log('PASS historical five-adapter Babel globe negative control (28 shelf contacts; two unsupported/low stems before this repair): '+JSON.stringify(validateBabelTerraceGlobes(T)));

console.log('PASS two supported Babel globe mounts: '+JSON.stringify(validateBabelGlobeMounts(T)));

console.log('PASS Babel globe mount ownership/custom-layout programs: '+JSON.stringify(validateBabelGlobeMountLifecycle(T)));
console.log('PASS original Babel annular balcony guard contacts (partial floor seats retained; no new part): '+JSON.stringify(validateBabelBalconyGuards(T)));
console.log('PASS original Babel terrace casework (whole foot polygons/actual floor triangles, partial footprints retained): '+JSON.stringify(validateBabelTerraceCasework(T)));
console.log('PASS recessed Babel binding beds (18100 original volumes; 200 fitted-bay controls remain unchanged): '+JSON.stringify(validateBabelTerraceBindings(T)));
console.log('PASS Babel binding-bed ownership programs: '+JSON.stringify(validateBabelBindingLifecycle(T)));
