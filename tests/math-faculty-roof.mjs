import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildTwoFaceGallery} from '../src/two-face-gallery-scene.js';
import {lowerMatrix} from '../src/world-cylinder-model.js';

// Invoked by math-faculty.mjs on its actual builder, not a copied roof model.
export function verifyFacultyRoof(T,b,rows){
 const near=(a,c,e=6e-5)=>assert(Math.abs(a-c)<e,`${a} != ${c}`),round=x=>Math.round(x*1e6)/1e6,hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
 const matrix=new T.Matrix4(),pos=new T.Vector3(),scale=new T.Vector3(),quat=new T.Quaternion();
 const rafters=rows.filter(r=>{matrix.fromArray(r.matrix).decompose(pos,quat,scale);return r.color===0x705b40&&scale.x>37&&scale.x<38&&Math.abs(scale.y-.17)<1e-5&&Math.abs(scale.z-.16)<1e-5;});
 assert.equal(rafters.length,40);
 const others=rows.filter(r=>!rafters.includes(r)).map(r=>JSON.stringify({color:r.color,matrix:r.matrix.map(round)})).sort();
 assert.equal(others.length,1678);assert.equal(hash(others),'65e1d4df45ac07cdb4c397b94755bcfe6f771e8894885dfa708befa3ae8976a5','Independent 264f988 fingerprint: no other facade, wing, furniture or connector instance changes');
 const roof=b.group.getObjectByName('Annular timber roof · open central oculus'),caps=b.group.getObjectByName('Fitted roof bearings · retained columns and west lintel');
 assert(roof&&caps);assert.equal(hash({position:Array.from(roof.geometry.attributes.position.array),index:Array.from(roof.geometry.index.array)}),'d6957aaaedfb49dc4e275b234357b0aef7c3f2ed351c976e2e30b7278e722aee','Original roof profile, facets and aperture remain exact');
 assert.equal(caps.geometry.attributes.position.count,320);assert.equal(caps.geometry.index.count,1440);assert(caps.geometry.attributes.position.array.every(Number.isFinite));assert.equal(caps.material.color.getHex(),0xc3b69a);assert(!b.targets.includes(caps));
 const gallery=buildTwoFaceGallery(T,{side:'lower'}),originalGallery=[];
 gallery.group.updateMatrixWorld(true);gallery.group.traverse(o=>{if(o.isInstancedMesh)for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);originalGallery.push(JSON.stringify({name:o.name,color:o.material.color?.getHex(),matrix:[...matrix.elements].map(round)}));}});
 assert.equal(originalGallery.length,1736);assert.equal(hash(originalGallery.sort()),'1d569525d51a3d005310dea83784d705dc7b7adec2c7a2298a5bdaa5f15b09ad','Reuse the exact original columns, west lintel, stairs, rails and pedestals');
 const timber=b.group.children.find(o=>o.isInstancedMesh&&o.material.color.getHex()===0x705b40),up=new T.Vector3(0,1,0),down=new T.Vector3(0,-1,0);
 const cast=(mesh,x,y,z,dir,far=20)=>new T.Raycaster(new T.Vector3(x,y,z),dir,0,far).intersectObject(mesh,true)[0];
 let roofSamples=0,bearingSamples=0,rimSamples=0;
 for(let i=0;i<40;i++){
  const a=i/40*Math.PI*2,c=Math.cos(a),s=Math.sin(a),part=new T.Mesh(timber.geometry,timber.material);part.matrixAutoUpdate=false;part.matrix.fromArray(rafters[i].matrix);part.updateMatrixWorld(true);
  // Check real surface intersections across the rafter width and length.
  for(let j=0;j<25;j++)for(const t of[-.065,0,.065]){const r=22.3+(59.2-22.3)*j/24,x=c*r-s*t,z=s*r+c*t,rh=cast(roof,x,14,z,down),bh=cast(part,x,14,z,down);assert(rh&&bh);const gap=rh.point.y-bh.point.y;assert(gap<=-.0007&&gap>=-.0033,`No floating rafter or deep roof penetration: ${i}/${j}/${t}: ${gap}`);roofSamples++;}
  // All bases sit on retained source geometry, including the doorway header.
  const base=i===20?6.505:7.33;
  for(const[r,t]of[[0,0],[-.349,-.359],[-.349,.359],[.349,-.359],[.349,.359]]){const x=c*(57.8+r)-s*t,z=s*(57.8+r)+c*t,gh=cast(gallery.group,x,base+.2,z,down,1),ch=cast(caps,x,base-.1,z,up,2);assert(gh&&ch,'Each bearing base is supported by actual retained geometry');near(gh.point.y,base);near(ch.point.y,base);bearingSamples++;}
  for(const r of[-.28,0,.28])for(const t of[-.06,0,.06]){const x=c*(57.8+r)-s*t,z=s*(57.8+r)+c*t,ch=cast(caps,x,10,z,down,4),bh=cast(part,x,base+.1,z,up,3);assert(ch&&bh);near(ch.point.y,bh.point.y);assert(ch.point.y>7.7&&ch.point.y<8);bearingSamples++;}
 }
 // The two existing bronze edges are now closed sections seated on the roof.
 // The eave retains its original .1m outer projection; its inboard part bears.
 for(const[name,ri,ro]of[['Thin bronze oculus rim',21.5,22],['Rotunda eaves',60.4,61]]){
  const rim=b.group.getObjectByName(name);assert.equal(rim.geometry.attributes.position.count,772);assert.equal(rim.geometry.index.count,4608);
  for(let i=0;i<192;i++)for(const f of[.15,.5,.85]){const a=(i+.5)/192*Math.PI*2,r=ri+(ro-ri)*f,x=Math.cos(a)*r,z=Math.sin(a)*r,rh=cast(roof,x,14,z,down),bottom=cast(rim,x,6,z,up),top=cast(rim,x,14,z,down);assert(rh&&bottom&&top);near(bottom.point.y,rh.point.y-.003);near(top.point.y-bottom.point.y,.035);assert(top.point.y>rh.point.y,'Closed rim engages the roof without coincident underside faces');rimSamples++;}
 }
 for(const r of[0,16,19,21.49])for(let i=0;i<40;i++)assert.equal(cast(b.group,Math.cos(i/40*Math.PI*2)*r,1.93,Math.sin(i/40*Math.PI*2)*r,up),undefined,'Retain the complete open helical well/oculus');
 // The real inverted composition keeps the bearing on the original column.
 const frame=new T.Group();frame.matrixAutoUpdate=false;frame.matrix.copy(lowerMatrix(T));b.group.position.set(-2160,0,-65);gallery.group.position.set(-2160,0,-65);frame.add(b.group,gallery.group);frame.updateMatrixWorld(true);
 for(const i of[0,1,19,20,21,39]){const a=i/40*Math.PI*2,p=b.group.localToWorld(new T.Vector3(Math.cos(a)*57.8,(i===20?6.505:7.33)-.1,Math.sin(a)*57.8)),hit=new T.Raycaster(p,new T.Vector3(0,-1,0),0,2).intersectObject(caps)[0];assert(hit);near(-96-hit.point.y,i===20?6.505:7.33);}
 b.group.removeFromParent();b.group.position.set(0,0,0);b.group.updateMatrixWorld(true);gallery.dispose();
 let released=0;caps.geometry.addEventListener('dispose',()=>released++);
 return{rafters,roofSamples,bearingSamples,rimSamples,assertRoofReleased:()=>assert.equal(released,1,'The one added bearing geometry is released once by its original Faculty owner')};
}
