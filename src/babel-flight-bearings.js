import {BABEL} from './babel-library-model.js?v=two-faces2';

// Static joins between the retained oak bearers and original first-flight treads.
export function mountBabelFlightBearings(T,built,mouths,scene){
 const data=(o,k)=>o&&Object.getOwnPropertyDescriptor(o,k)?.value,empty=()=>({group:null,parts:[],sync(){},dispose(){}}),
  root=data(built,'group'),fit=data(mouths,'group'),bindings=data(mouths,'bindings'),children=data(scene,'children'),identity=new T.Matrix4(),
  local=o=>new T.Matrix4().compose(o.position,o.quaternion,o.scale),near=(a,b,e=2e-5)=>Math.abs(a-b)<e,
  float=m=>new T.Matrix4().fromArray(new Float32Array(m.elements)),f=BABEL.flight,run=f.z0-f.z1;
 if(data(root,'isGroup')!==true||data(scene,'isScene')!==true||data(root,'parent')!==scene||
   data(fit,'isGroup')!==true||data(fit,'parent')!==root||!Array.isArray(bindings)||!Array.isArray(children)||
   !local(root).equals(identity)||!local(fit).equals(identity)||root.children.some(o=>data(o,'name')==='Fitted first-flight bearer joints'))return empty();
 const galleries=children.filter(o=>data(o,'name')==='Head-width staircase along snake direction');
 if(galleries.length!==1)return empty();const gallery=galleries[0],ramps=data(gallery,'children')?.filter(o=>data(o,'name')==='Gallery staircase · 160 real treads and vertical risers')||[];
 if(ramps.length!==1||data(ramps[0],'isMesh')!==true)return empty();const ramp=ramps[0],
  galleryPose=new T.Matrix4().compose(new T.Vector3(f.x,0,43),new T.Quaternion().setFromEuler(new T.Euler(0,Math.PI/2,0)),new T.Vector3(1,1,1));
 if(!local(gallery).equals(galleryPose)||!local(ramp).equals(identity))return empty();
 // Validate the complete original 160-tread profile, without reading its drawing.
 const rg=data(ramp,'geometry'),rp=data(rg,'attributes')?.position,ri=data(rg,'index'),expected=[],indices=[];
 if(data(rg,'type')!=='BufferGeometry'||rp?.count!==3200||rp.itemSize!==3||ri?.count!==4800)return empty();
 const quad=(...points)=>{const k=expected.length/3;points.forEach(p=>expected.push(...p));indices.push(k,k+1,k+2,k,k+2,k+3);},half=f.width/2;
 for(let floor=0;floor<4;floor++)for(let i=0;i<40;i++){
  const x0=43-i*.28,x1=x0-.28,y0=f.top+floor*8+i*.2,y=y0+.2;
  quad([x0,y,-half],[x1,y,-half],[x1,y,half],[x0,y,half]);
  quad([x0,y0,-half],[x0,y,-half],[x0,y,half],[x0,y0,half]);
  quad([x0,y0-.18,-half],[x0,y,-half],[x1,y,-half],[x1,y0-.18,-half]);
  quad([x1,y0-.18,half],[x1,y,half],[x0,y,half],[x0,y0-.18,half]);
  quad([x1,y0-.18,-half],[x1,y0-.18,half],[x0,y0-.18,half],[x0,y0-.18,-half]);
 }
 const floats=new Float32Array(expected);if(floats.some((v,i)=>v!==rp.array[i])||indices.some((v,i)=>v!==ri.array[i]))return empty();
 const beams=[],soffits=[];
 for(const source of root.children.filter(o=>data(o,'isInstancedMesh')===true)){
  const geometry=data(source,'geometry'),type=data(geometry,'type');if(type!=='BoxGeometry'&&type!=='CylinderGeometry')continue;
  if(!local(source).equals(identity))return empty();const binding=bindings.find(v=>data(v,'source')===source),owner=binding?data(binding,'clone'):source;
  if(data(owner,'isInstancedMesh')!==true||owner.geometry!==geometry||!local(owner).equals(identity))return empty();
  for(let id=0;id<source.count;id++){
   const raw=new T.Matrix4(),m=new T.Matrix4(),p=new T.Vector3(),s=new T.Vector3();source.getMatrixAt(id,raw);owner.getMatrixAt(id,m);raw.decompose(p,new T.Quaternion(),s);
   if(type==='CylinderGeometry'&&near(p.z,run/2)&&near(p.y,f.top+4-.52)&&near(s.x,.15)&&near(s.y,Math.hypot(run,8))&&near(s.z,.15)){
    const side=near(p.x,f.x-half+.12)?-1:near(p.x,f.x+half-.12)?1:0;if(!side)return empty();
    const matrix=float(new T.Matrix4().compose(new T.Vector3(f.x+side*(half-.12),f.top+4-.52,run/2),
     new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(0,8,run).normalize()),new T.Vector3(.15,Math.hypot(run,8),.15)));
    if(!raw.equals(matrix)||!m.equals(raw)||geometry.parameters.radiusTop!==1||geometry.parameters.radiusBottom!==1||geometry.parameters.height!==1||geometry.parameters.radialSegments!==7)return empty();
    beams.push({source,owner,id,m,p,side});
   }
   if(type==='BoxGeometry'&&near(s.x,f.width)&&near(s.y,.2)&&near(s.z,Math.hypot(run,8))){
    const matrix=float(new T.Matrix4().compose(new T.Vector3(f.x,f.top+4-.52,run/2),
     new T.Quaternion().setFromEuler(new T.Euler(-Math.atan2(8,run),0,0)),new T.Vector3(f.width,.2,Math.hypot(run,8))));
    if(!raw.equals(matrix)||!m.equals(raw)||geometry.parameters.width!==1||geometry.parameters.height!==1||geometry.parameters.depth!==1)return empty();
    soffits.push({source,owner,id,m});
   }
  }
 }
 if(beams.length!==2||new Set(beams.map(b=>b.side)).size!==2||soffits.length!==1||beams[0].owner.material!==beams[1].owner.material)return empty();
 const hit=(o,m,origin)=>{const p=o.geometry.attributes.position,ix=o.geometry.index,ray=new T.Ray(origin,new T.Vector3(0,1,0));let found=null;
  for(let i=0;i<(ix?.count||p.count);i+=3){const triangle=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,ix?ix.getX(i+j):i+j).applyMatrix4(m)),point=ray.intersectTriangle(...triangle,false,new T.Vector3());
   if(point&&(!found||point.y<found.point.y)){const normal=new T.Triangle(...triangle).getNormal(new T.Vector3());if(normal.y<0)normal.negate();found={point,normal,triangle,face:i/3};}}
  return found;};
 const parts=[],vertices=[],soffit=soffits[0],insideBox=(m,p)=>p.clone().applyMatrix4(m.clone().invert()).toArray().every(v=>Math.abs(v)<.5);
 // The bearers already cross the soffit. Keep those positive existing joints.
 for(const b of beams)for(const z of[.28,run/2,run-.28]){
  const y=f.top+8*z/run-.52+.11;
  for(const dx of[-.001,.001])for(const dy of[-.001,.001])for(const dz of[-.001,.001]){
   const p=new T.Vector3(b.p.x+dx,y+dy,z+dz),q=p.clone().applyMatrix4(b.m.clone().invert());
   if(!insideBox(soffit.m,p)||Math.abs(q.y)>=.5||Array.from({length:7},(_,i)=>(i+.5)*Math.PI*2/7).some(a=>q.x*Math.sin(a)+q.z*Math.cos(a)>=Math.cos(Math.PI/7)))return empty();
  }
 }
 const add=(points,order)=>{for(const [a,b,c]of[[0,1,2],[0,2,3]])for(const i of[a,b,c])vertices.push(...points[order[i]].toArray());};
 for(const b of beams)for(const z of[f.z1+.14,f.z0-.14]){
  const axis=f.top+8*z/run-.52,lower=hit(b.owner,b.m,new T.Vector3(b.p.x,axis,z));if(!lower||lower.normal.y<.7)return empty();
  const upper=hit(ramp,galleryPose,new T.Vector3(b.p.x,lower.point.y+.0001,z));if(!upper||!near(upper.normal.y,1,1e-6))return empty();
  const gap=upper.point.y-lower.point.y;if(gap<.0738||gap>.0741)return empty();
  const plane=p=>(lower.normal.dot(lower.point)-lower.normal.x*p.x-lower.normal.z*p.z)/lower.normal.y,
   corners=[[-.05,-.05],[.05,-.05],[.05,.05],[-.05,.05]].map(([x,dz])=>new T.Vector3(b.p.x+x,0,z+dz)),
   bottom=corners.map(p=>p.clone().setY(plane(p)-.005)),top=corners.map(p=>p.clone().setY(upper.point.y+.005));
  if(bottom.some((p,i)=>{const q=p.clone().applyMatrix4(b.m.clone().invert()),h=hit(ramp,galleryPose,p.clone().setY(upper.point.y-.01));return top[i].y-p.y<.04||Math.abs(q.y)>=.5||
    Array.from({length:7},(_,j)=>(j+.5)*Math.PI*2/7).some(a=>q.x*Math.sin(a)+q.z*Math.cos(a)>=Math.cos(Math.PI/7))||!h||!near(h.point.y,upper.point.y,1e-6);} ))return empty();
  const points=[...bottom,...top];for(const order of[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]])add(points,order);
  parts.push({beam:b,z,lower,upper,gap,bottom,top});
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();
 const group=new T.Group();group.name='Fitted first-flight bearer joints';const material=beams[0].owner.material,mesh=new T.Mesh(geometry,material);mesh.name='Four recessed end-bearing hangers';group.add(mesh);root.add(group);
 const visibleOwners=[...new Set([gallery,ramp,fit,...beams.map(b=>b.owner),soffit.owner])],
  objects=[...new Set([gallery,ramp,fit,...beams.flatMap(b=>[b.source,b.owner]),soffit.source,soffit.owner])],
  records=objects.map(o=>({o,parent:o.parent,position:o.position,quaternion:o.quaternion,scale:o.scale,pose:local(o),geometry:o.geometry,material:o.material,count:o.count,buffer:o.instanceMatrix,array:o.instanceMatrix?.array,version:o.instanceMatrix?.version})),
  geometries=[...new Set(records.map(r=>r.geometry).filter(Boolean).concat(geometry))].map(g=>({g,attributes:g.attributes,index:g.index,indexArray:g.index?.array,indexVersion:g.index?.version,
   morph:g.morphAttributes,drawRange:g.drawRange,drawStart:g.drawRange.start,drawCount:g.drawRange.count,attrs:Object.entries(g.attributes).map(([k,a])=>({k,a,array:a.array,version:a.version,count:a.count}))})),
  own=geometries.find(r=>r.g===geometry),previous=built.dispose;let disposed=false;
 const wrapped=function(...args){dispose();return previous.apply(this,args);};built.dispose=wrapped;
 function dispose(){if(disposed)return;disposed=true;group.removeFromParent();group.clear();geometry.attributes=own.attributes;geometry.index=own.index;geometry.morphAttributes=own.morph;geometry.drawRange=own.drawRange;for(const a of own.attrs){geometry.attributes[a.k]=a.a;a.a.array=a.array;}geometry.dispose();if(built.dispose===wrapped)built.dispose=previous;}
 function sync(){
  if(disposed)return;
  if(data(built,'group')!==root||root.parent!==scene||data(mouths,'group')!==fit||!local(root).equals(identity)||group.parent!==root||mesh.parent!==group||
   !local(group).equals(identity)||!local(mesh).equals(identity)||mesh.geometry!==geometry||mesh.material!==material||
   records.some(r=>r.o.parent!==r.parent||data(r.o,'position')!==r.position||data(r.o,'quaternion')!==r.quaternion||data(r.o,'scale')!==r.scale||!local(r.o).equals(r.pose)||r.o.geometry!==r.geometry||r.o.material!==r.material||r.o.count!==r.count||
    data(r.o,'instanceMatrix')!==r.buffer||(r.buffer&&(data(r.buffer,'array')!==r.array||r.buffer.version!==r.version)))||
   geometries.some(r=>r.g.attributes!==r.attributes||r.g.index!==r.index||r.g.morphAttributes!==r.morph||r.g.drawRange!==r.drawRange||r.g.drawRange.start!==r.drawStart||r.g.drawRange.count!==r.drawCount||
    (r.index&&(data(r.index,'array')!==r.indexArray||r.index.version!==r.indexVersion))||
    r.attrs.some(a=>r.g.attributes[a.k]!==a.a||data(a.a,'array')!==a.array||a.a.version!==a.version||a.a.count!==a.count))){dispose();return;}
  group.visible=root.visible&&visibleOwners.every(o=>o.visible);
 }
 sync();return{group,mesh,geometry,parts,beams,soffit,gallery,ramp,sync,dispose,get disposed(){return disposed;}};
}
