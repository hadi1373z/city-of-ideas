import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {BABEL,entryHeight,walkLibrary} from '../src/babel-library-model.js';

const near=(a,b,e=2e-5)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
export function babelGuardSnapshot(T,root,stripBrackets=false){
 root.updateMatrixWorld(true);const rows=[];let instances=0;
 root.traverse(o=>{if(!o.isMesh)return;let count=o.count;if(stripBrackets&&o.isInstancedMesh&&o.parent.name==='Snake staircase · gallery to Babel'&&o.material.color.getHex()===0x786946)count=73;
  const ms=o.isInstancedMesh?Array.from({length:count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();}):null;if(ms)instances+=ms.length;
  rows.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),geometry:{type:o.geometry.type,index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)]))},color:o.material.color?.getHex(),materialType:o.material.type,side:o.material.side,instances:ms});
 });return{hash:createHash('sha256').update(JSON.stringify(rows)).digest('hex'),meshes:rows.length,instances};
}

export async function babelSlabFixture(T){
 const src=await readFile(new URL('../src/gallery.js',import.meta.url),'utf8'),factory=src.match(/^function galleryRing\([^\n]+/m)?.[0];assert(factory);
 // Use the app's bundled r160 slab triangulator, rather than the separate r186
 // source-tools test renderer. Execute the retained source builder and upper
 // entrance rotation, preserving its actual rectangular hole and native hash.
 const nativeContext={};vm.runInNewContext(await readFile(new URL('../src/assets/three.min.js',import.meta.url),'utf8'),nativeContext);const S=nativeContext.THREE;assert.equal(S.REVISION,'160');
 const floorGroup=new S.Group(),slabMaterial=new S.MeshLambertMaterial({color:0xb3b2a0}),finishMaterial=new S.MeshLambertMaterial({color:0xb8b7a7}),mesh=(geometry,material,x=0,y=0,z=0)=>{const o=new S.Mesh(geometry,material);o.position.set(x,y,z);floorGroup.add(o);return o;};
 const context={THREE:S,inner:28,outer:58,window:{CITY_BABEL_LAYOUT:BABEL},mainBuildingTargets:[],mesh};vm.runInNewContext(factory+';this.ring=galleryRing',context);
 const slab=context.ring(0,slabMaterial,0),finish=context.ring(.37,finishMaterial,0,.025),rotation=new S.Matrix4().makeRotationY(Math.PI/2);for(const o of[slab,finish])o.applyMatrix4(rotation);floorGroup.updateMatrixWorld(true);
 assert.equal(babelGuardSnapshot(T,floorGroup).hash,'7c1b103871a02f9562bf37e91f4b0dc9cfebdc6fe7961e0136be5e0d1abbd54f','Unchanged actual installed ground slab/finish profiles');
 return{floorGroup,slab,finish,dispose(){for(const o of[slab,finish])o.geometry.dispose();slabMaterial.dispose();finishMaterial.dispose();}};
}

export async function validateBabelEntryGuards(T,built,library){
 const f=BABEL.flight,l=BABEL.landing,g=built.group,bronze=g.children.find(o=>o.isInstancedMesh&&o.material.color.getHex()===0x786946),gold=g.children.find(o=>o.isInstancedMesh&&o.material.color.getHex()===0xe2c47e);
 g.updateMatrixWorld(true);library.group.updateMatrixWorld(true);assert(g.matrixWorld.equals(new T.Matrix4()));assert.equal(bronze.count,101);assert.equal(gold.count,40);
 // Independently captured complete 72d2ab2 fixtures. Only the 28 separately
 // measured appended brackets are omitted; every earlier profile/ID stays exact.
 assert.deepEqual(babelGuardSnapshot(T,g,true),{hash:'18f107cd92e34bd6f6f84c7916b0186597ba914f25bdb4e1456ef20263f1a142',meshes:4,instances:113});
 assert.deepEqual(babelGuardSnapshot(T,library.group,true),{hash:'e3b91773c61da8f5ba32f7e570e34be8246ccffca2c693a27766febb28c0b318',meshes:65,instances:41020});
 const{floorGroup,slab,finish,dispose}=await babelSlabFixture(T);
 const m=i=>{const a=new T.Matrix4();bronze.getMatrixAt(i,a);return a;},at=(i,y)=>new T.Vector3(0,y,0).applyMatrix4(m(i)),up=new T.Vector3(0,1,0),down=new T.Vector3(0,-1,0),ray=(objects,p,d,far)=>new T.Raycaster(p,d,0,far).intersectObjects(objects,true);
 function contained(i,p){const q=p.clone().applyMatrix4(m(i).invert());assert(Math.abs(q.y)<=.50003);for(let k=0;k<8;k++){const a=(k+.5)*Math.PI/4;assert(q.x*Math.sin(a)+q.z*Math.cos(a)<=Math.cos(Math.PI/8)+3e-4,'Actual eight-sided cylinder contains contact');}}
 let footVertices=0,rootRays=0,gapRays=0,slopingSeats=0,landingSeats=0,railContacts=0,bodySamples=0;
 try{
  for(let side=0;side<2;side++)for(let k=0;k<14;k++){
   const id=73+side*14+k,post=side*30+3+k*2,sign=side?1:-1,foot=at(post,-.5),a=at(id,-.5),b=at(id,.5),edge=sign<0?BABEL.opening.minX:BABEL.opening.maxX;
   near(a.x,foot.x-sign*.035);near(b.x,edge+sign*.06);near(a.y,.375);near(b.y,.375);near(a.z,foot.z);near(b.z,foot.z);near(a.distanceTo(b),.175);
   // The original whole foot cap is enclosed by its recessed bracket. Its
   // old .08m side gap is measured against the actual source slab cut.
   near(Math.abs(foot.x-edge),.08);for(let v=0;v<8;v++){const angle=v*Math.PI/4,p=new T.Vector3(Math.sin(angle),-.5,Math.cos(angle)).applyMatrix4(m(post));contained(id,p);footVertices++;}
   if(k===0)for(let v=0;v<8;v++){const angle=v*Math.PI/4,p=new T.Vector3(Math.sin(angle),-.5,Math.cos(angle)).applyMatrix4(m(side*30+2));contained(id,p);footVertices++;}
   // A positive .01 x .01 x .01m core lies inside the retained .025m finish.
   for(const dx of[.045,.055])for(const y of[.3775,.3875])for(const dz of[-.005,.005]){const p=new T.Vector3(edge+sign*dx,y,foot.z+dz);contained(id,p);const top=ray([finish],p.clone().setY(.42),down,.06)[0],bottom=ray([finish],p.clone().setY(.36),up,.05)[0];assert(top&&bottom);near(top.point.y,.395);near(bottom.point.y,.37);assert(p.y>bottom.point.y&&p.y<top.point.y);rootRays+=2;}
   const p=foot.clone().setX(foot.x+sign*.045).setY(.48),hit=ray([bronze],p,down,.16)[0];assert.equal(hit?.instanceId,id);near(hit.point.y,.415);gapRays++;
   // Nothing added reaches the existing .23m inset walking band.
   const bounds=new T.Box3().setFromBufferAttribute(bronze.geometry.attributes.position).applyMatrix4(m(id));assert(sign<0?bounds.max.x<f.x-f.width/2+.23:bounds.min.x>f.x+f.width/2-.23);
  }
  for(let side=0;side<2;side++)for(let k=0;k<14;k++){
   const slope=side*30+2+k*2,level=slope+1;contained(side*30,at(slope,.5));contained(side*30+1,at(level,.5));railContacts+=2;
   if(k){const p=at(slope,-.5),sign=side?1:-1,hit=ray([built.ramp],p.clone().add(new T.Vector3(-sign*.01,.02,.01)),down,.04)[0];assert(hit);near(hit.point.y,p.y);slopingSeats++;}
  }
  for(let id=62;id<=72;id++){const p=at(id,-.5),hit=ray([built.landing],p.clone().add(new T.Vector3(.01,.02,id===72?-.01:.01)),down,.04)[0];assert(hit,'Original landing seat '+id);near(hit.point.y,-8);contained(id===72?61:60,at(id,.5));landingSeats++;railContacts++;}
  contained(61,at(0,.5));railContacts++; // original sloping-rail/overlook corner
  for(const x of[f.x-f.width/2+.4,f.x,f.x+f.width/2-.4]){
   for(let i=0;i<40;i++)for(const t of[.1,.5,.9]){const z=f.z0-(i+t)*.28,y=entryHeight(x,z),hits=ray([library.group,floorGroup],new T.Vector3(x,y+.08,z),up,2.02);assert.equal(hits.length,0,'Strict standing body/head clearance');bodySamples++;}
   let p={x,z:f.z0+.1,y:f.top+1.8};for(let z=f.z0;z>=-.05;z-=.04)walkLibrary(p,0,z-p.z);near(p.y-1.8,-8);for(let z=p.z;z<=f.z0+.1;z+=.04)walkLibrary(p,0,z-p.z);near(p.y-1.8,f.top);
  }
  assert.equal(footVertices,240);assert.equal(rootRays,448);assert.equal(gapRays,28);assert.equal(slopingSeats,26);assert.equal(landingSeats,11);assert.equal(railContacts,68);assert.equal(bodySamples,360);
  return{addedBrackets:28,footVertices,rootRays,gapRays,slopingSeats,landingSeats,railContacts,bodySamples,stairs:babelGuardSnapshot(T,g),library:babelGuardSnapshot(T,library.group)};
 }finally{dispose();}
}
