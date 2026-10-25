import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
const source=readFileSync(new URL('../src/gallery.js',import.meta.url),'utf8'),start=source.indexOf('function buildArchitecture(){'),end=source.indexOf('function buildOuroborosFloors()',start),scene=new T.Scene(),material=new T.MeshBasicMaterial(),materials=Object.fromEntries(['dark','water','metal','stone','warm','rail','wall','glass','plinth'].map(k=>[k,material])),batches=[];
const box=(w,h,d,m,x,y,z,parent=scene)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);parent.add(o);return o;},cylinder=(a,b,h,m,x=0,y=0,z=0,parent=scene)=>{const o=new T.Mesh(new T.CylinderGeometry(a,b,h,12),m);o.position.set(x,y,z);parent.add(o);return o;},instances=(geo,m,list)=>{const o=new T.InstancedMesh(geo,m,list.length);o.userData.placements=list;batches.push(o);scene.add(o);return o;},sign=(text,color,w,h,parent=scene)=>{const o=new T.Mesh(new T.PlaneGeometry(w,h),material);parent.add(o);return o;},floors=Array.from({length:4},()=>({color:'#abcdef',title:'Synthetic floor',exhibits:Array.from({length:3},()=>({shape:'none',title:'Synthetic exhibit'}))}));
const window={};vm.runInNewContext(readFileSync(new URL('../src/gallery-entrance.js',import.meta.url),'utf8'),{window});
const names=['createGalleryEntrance','THREE','scene','materials','cylinder','box','torus','galleryRing','galleryCeilingArc','polar','gallerySpiral','instances','floors','textSign','sculpture','floorLights','exhibitMeshes','exhibitRoots','createSnakeSkinTiles','inner','outer','spacing','exhibitRadius','liftRadius'];const values=[window.createGalleryEntrance,T,scene,materials,cylinder,box,()=>{},()=>{},()=>{},(r,a,y)=>new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r),{contains:()=>false},instances,floors,sign,()=>new T.Group(),[],[],[],()=>material,28,58,8,52,60.65];new Function(...names,'let roofTiles;'+source.slice(start,end)+';buildArchitecture();')(...values);
const windows=batches.filter(o=>o.geometry.type==='BoxGeometry'&&o.geometry.parameters.height===6.5);assert.deepEqual(windows.map(o=>o.count),[70,72,72,72],'Only the first floor has gaps in the exterior glazing');const doors=scene.children.filter(o=>o.name.startsWith('Ground-floor gallery doorway'));assert.equal(doors.length,2);assert.equal(doors.flatMap(o=>o.children.filter(c=>c.name==='Retracted sliding glass door')).length,4);scene.updateMatrixWorld(true);for(const door of doors){assert.equal(door.position.y,.395);assert.equal(Math.abs(door.position.z),57.75,'Entrance shares the surrounding facade plane');const from=door.localToWorld(new T.Vector3(0,1.6,4)),to=door.localToWorld(new T.Vector3(0,1.6,-4)),d=to.clone().sub(from);const ray=new T.Raycaster(from,d.clone().normalize(),0,d.length());assert.equal(ray.intersectObject(door,true).length,0,'Both open doors leave the visitor centreline clear');}


const transom=batches.find(o=>o.name==='Facade glazing above ground doors');assert.equal(transom.count,2);assert.equal(transom.material,windows[0].material);assert.equal(transom.geometry.parameters.width,windows[0].geometry.parameters.width);assert.equal(transom.geometry.parameters.depth,windows[0].geometry.parameters.depth);assert(Math.abs(transom.geometry.parameters.height-3.275)<1e-9);

for(const p of transom.userData.placements){assert(Math.abs(p.position.x)<1e-8);assert(Math.abs(Math.abs(p.position.z)-57.75)<1e-8);}const columnBatch=batches.find(o=>o.geometry.type==='CylinderGeometry'&&o.geometry.parameters.radiusTop===.24);assert(!columnBatch.userData.placements.some(p=>p.position.y<8&&Math.abs(p.position.x)<1&&Math.abs(p.position.z)>55),'Ground-floor columns leave the actual entrance axes clear');

// Walk a body-width corridor through each opening, not merely a zero-width ray.
for(const door of doors){
 for(const x of[-.8,0,.8])for(const y of[.15,1,1.8,2.35]){
  const from=door.localToWorld(new T.Vector3(x,y,2)),to=door.localToWorld(new T.Vector3(x,y,-2)),d=to.clone().sub(from);
  assert.equal(new T.Raycaster(from,d.normalize(),0,4).intersectObject(door,true).length,0,'Retracted leaves keep the full visitor corridor open');
 }
 const labels=door.children.filter(o=>o.name.startsWith('Gallery name'));
 assert.equal(labels.length,2);assert(labels.every(o=>o.material.side===T.FrontSide));
 assert.equal(Math.abs(labels[0].rotation.y-labels[1].rotation.y),Math.PI,'Each side has correctly facing text');
 const header=door.getObjectByName('Sliding door header');
 assert(Math.abs(door.position.y+header.position.y+header.geometry.parameters.height/2-3.875)<1e-9,'Header meets transom without a floating gap');
 const leaves=door.children.filter(o=>o.name==='Retracted sliding glass door');
 assert(leaves.every(o=>o.rotation.y===0),'Leaves slide beside the opening instead of jutting into the route');
}
console.log('PASS: facade-connected glazed sliding entrances, body-width clearance on both sides, readable one-sided interior/exterior labels and continuous upper-floor glazing.');
