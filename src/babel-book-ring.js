import {BABEL} from './babel-library-model.js?v=two-faces2';

// Public static display supports. Original books, footing and well floor stay
// owned by Babel; the only new geometry is the footing's two vertical sides.
export function seatBabelBookRing(T,built,mouths){
 const data=(o,k)=>o&&Object.getOwnPropertyDescriptor(o,k)?.value;
 const root=data(built,'group'),fit=data(mouths,'group'),bindings=data(mouths,'bindings');
 const empty=()=>({group:null,parts:[],frames:[],sync(){},dispose(){}});
 const name='Babel · grounded central book ring',identity=new T.Matrix4();
 const local=o=>o.matrixAutoUpdate?new T.Matrix4().compose(o.position,o.quaternion,o.scale):o.matrix;
 const near=(a,b,e=2e-4)=>Math.abs(a-b)<e;
 if(data(root,'isGroup')!==true||data(root,'name')!=='Beneath Zarathustra · circular Library of Babel'||
   data(fit,'isGroup')!==true||fit.parent!==root||fit.userData.babelMouthClearance!==true||
   !Array.isArray(bindings)||bindings.length!==12||data(mouths,'changes')?.length!==398||
   !local(fit).equals(identity)||root.children.some(o=>data(o,'name')===name))return empty();
 const foot=root.children.find(o=>data(o,'name')==='Circular footing beneath the upright book ring'),
  base=root.children.find(o=>data(o,'name')==='Book-well base inside the through-gallery shaft');
 if(data(foot,'isMesh')!==true||data(base,'isMesh')!==true||!local(foot).equals(identity)||
   foot.geometry?.type!=='BufferGeometry'||base.geometry?.type!=='CircleGeometry'||
   foot.geometry.attributes.position?.count!==642||foot.geometry.index?.count!==1920||
   base.geometry.parameters?.radius!==13.9||base.geometry.parameters?.segments!==160)return empty();
 const fp=foot.geometry.attributes.position,basePose=local(base),basePoint=new T.Vector3().fromBufferAttribute(base.geometry.attributes.position,0).applyMatrix4(basePose),
  baseY=basePoint.y,footY=fp.getY(0);
 if(!near(baseY,BABEL.base,1e-6)||!near(footY-baseY,.055,1e-6))return empty();
 for(let i=0;i<fp.count;i++)if(!near(fp.getY(i),footY,1e-6)||
   !near(Math.hypot(fp.getX(i),fp.getZ(i)),i%2?4.20:3.12,1e-6))return empty();
 const boxes=bindings.filter(b=>data(b.source,'isInstancedMesh')===true&&b.source.geometry?.type==='BoxGeometry');
 if(boxes.length!==11)return empty();
 const unit=boxes[0].source.geometry,rows=[];
 if(['width','height','depth'].some(k=>unit.parameters?.[k]!==1))return empty();
 for(const source of root.children.filter(o=>data(o,'isInstancedMesh')===true&&o.geometry===unit)){
  const owner=bindings.find(v=>v.source===source)?.clone||source;
  if(!local(source).equals(identity)||!local(owner).equals(identity)||
    source.instanceMatrix?.itemSize!==16||owner.instanceMatrix?.itemSize!==16||
    owner.geometry!==unit||owner.count!==source.count||owner.material!==source.material)return empty();
  for(let id=0;id<source.count;id++){
   const raw=new T.Matrix4(),m=new T.Matrix4();source.getMatrixAt(id,raw);owner.getMatrixAt(id,m);
   const rr=Math.hypot(raw.elements[12],raw.elements[14]),dr=Math.hypot(m.elements[12],m.elements[14]);
   if((rr<2.9||rr>4.4)&&(dr<2.9||dr>4.4))continue;
   const p=new T.Vector3(),s=new T.Vector3();m.decompose(p,new T.Quaternion(),s);rows.push({source,owner,id,raw,m,p,s});
  }
 }
 const pages=rows.filter(v=>near(Math.hypot(v.p.x,v.p.z),3.65)&&v.s.x>.10&&v.s.x<.19&&
   v.s.y>1.16&&v.s.y<1.97&&v.s.z>.68&&v.s.z<.83);
 if(rows.length!==384||pages.length!==64||pages.some(p=>p.owner!==p.source||p.source.count!==107)||
   new Set(pages.map(p=>p.source)).size!==1)return empty();
 const inside=(m,p)=>p.clone().applyMatrix4(m.clone().invert()).toArray().every(v=>Math.abs(v)<.500005);
 const parts=[],frames=[],used=new Set([foot,base]);
 for(const page of pages){
  const w=page.s.x+.052,h=page.s.y+.085,d=page.s.z+.055,
   tangent=new T.Vector3().setFromMatrixColumn(page.m,0).normalize(),radial=new T.Vector3().setFromMatrixColumn(page.m,2).normalize(),
   at=(t,r)=>page.p.clone().addScaledVector(tangent,t).addScaledVector(radial,r),
   match=(size,p)=>rows.filter(v=>size.every((n,i)=>near(v.s.toArray()[i],n))&&v.p.distanceTo(p)<2e-4),
   covers=[-1,1].map(sign=>match([.024,h+.025,d+.045],at(sign*(w/2-.012),0))),
   spines=match([w,h+.025,.055],at(0,d/2));
  if(covers.some(a=>a.length!==1)||spines.length!==1)return empty();
  const feet=[...covers.map(a=>a[0]),spines[0]],bottoms=feet.map(f=>f.p.y-f.s.y/2);
  if([...feet,page].some(v=>!v.m.equals(v.raw))||bottoms.some(y=>!near(y-footY,.0325,2e-6)))return empty();
  const top=Math.max(...bottoms)+.002,bottom=footY-.002,
   m=new T.Matrix4().compose(page.p.clone().setY((top+bottom)/2),
    new T.Quaternion().setFromRotationMatrix(new T.Matrix4().extractRotation(page.m)),
    new T.Vector3(w-.008,top-bottom,d+.035));
  m.fromArray(new Float32Array(m.elements));
  for(const f of feet)for(const x of[-.0005,.0005])for(const y of[-.0005,.0005])for(const z of[-.0005,.0005]){
   const p=f.p.clone().setY(f.p.y-f.s.y/2+.001).add(new T.Vector3(x,y,z));
   if(!inside(f.m,p)||!inside(m,p))return empty();
  }
  // Complete pad corners stay over the original faceted footing, well outside
  // its inner boundary. The floor is unchanged below this ornamental ring.
  for(const x of[-.5,.5])for(const z of[-.5,.5]){const p=new T.Vector3(x,0,z).applyMatrix4(m),radius=Math.hypot(p.x,p.z);if(radius<3.13||radius>4.19)return empty();}
  for(const f of [...feet,page]){used.add(f.source);used.add(f.owner);}
  parts.push({matrix:m});frames.push({page,covers:feet.slice(0,2),spine:feet[2],bottoms,part:parts.length-1});
 }
 const vertices=[];
 for(let i=0;i<320;i++)for(const side of[0,1]){
  const a=new T.Vector3().fromBufferAttribute(fp,i*2+side),b=new T.Vector3().fromBufferAttribute(fp,(i+1)*2+side),
   c=b.clone().setY(baseY),d=a.clone().setY(baseY),points=side?[a,b,c,a,c,d]:[a,d,c,a,c,b];
  for(const p of points)vertices.push(p.x,p.y,p.z);
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();geometry.computeBoundingSphere?.();
 const material=foot.material,group=new T.Group();group.name=name;group.userData.babelBookRingSupports=true;
 const mesh=new T.InstancedMesh(unit,material,parts.length);mesh.name='Sixty-four recessed central book-ring pads';
 parts.forEach((p,i)=>mesh.setMatrixAt(i,p.matrix));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere?.();
 const footing=new T.Mesh(geometry,material);footing.name='Vertical sides below the unchanged circular footing';
 for(const o of[mesh,footing]){o.castShadow=foot.castShadow;o.receiveShadow=foot.receiveShadow;o.layers.mask=foot.layers.mask;group.add(o);}root.add(group);
 const ownBuffer=mesh.instanceMatrix,ownArray=ownBuffer.array,ownVersion=ownBuffer.version;
 const ownGeometryAttributes=Object.entries(geometry.attributes).map(([k,a])=>({k,a,array:a.array})),ownGeometryIndex=geometry.index,ownMorphAttributes=geometry.morphAttributes;
 const records=[...used].map(o=>({o,parent:o.parent,geometry:o.geometry,material:o.material,
  buffer:o.isInstancedMesh?o.instanceMatrix:null,array:o.isInstancedMesh?o.instanceMatrix.array:null,
  version:o.isInstancedMesh?o.instanceMatrix.version:null,count:o.count,pose:local(o).clone()}));
 const visibility=records.filter(r=>r.parent===fit||r.o===pages[0].source||r.o===foot||r.o===base).map(r=>r.o);
 const geometries=[...new Set([...records.map(r=>r.geometry),geometry])].map(g=>({g,attributeObject:g.attributes,index:g.index,
  indexArray:g.index?.array,indexVersion:g.index?.version,attributes:Object.entries(g.attributes).map(([k,a])=>({k,a,array:a.array,version:a.version}))}));
 const previous=built.dispose;let disposed=false;const wrapped=function(...args){dispose();return previous.apply(this,args);};built.dispose=wrapped;
 function dispose(){
  if(disposed)return;disposed=true;group.removeFromParent();
  mesh.instanceMatrix=ownBuffer;ownBuffer.array=ownArray;mesh.dispose?.();
  // Renderer disposal must see only our original attributes, even after a
  // foreign replacement. No borrowed geometry or replacement is edited.
  geometry.attributes=Object.fromEntries(ownGeometryAttributes.map(r=>{r.a.array=r.array;return[r.k,r.a];}));
  geometry.index=ownGeometryIndex;geometry.morphAttributes=ownMorphAttributes;geometry.dispose();group.clear();
  if(built.dispose===wrapped)built.dispose=previous;
 }
 function sync(){
  if(disposed)return;
  if(data(built,'group')!==root||data(mouths,'group')!==fit||!root.parent||fit.parent!==root||
    group.parent!==root||mesh.parent!==group||footing.parent!==group||
    !local(fit).equals(identity)||!local(group).equals(identity)||!local(mesh).equals(identity)||!local(footing).equals(identity)||
    mesh.geometry!==unit||mesh.material!==material||footing.geometry!==geometry||footing.material!==material||
    mesh.count!==64||data(mesh,'instanceMatrix')!==ownBuffer||data(ownBuffer,'array')!==ownArray||ownBuffer.version!==ownVersion||
    records.some(r=>r.o.parent!==r.parent||r.o.geometry!==r.geometry||r.o.material!==r.material||
     data(r.o,'instanceMatrix')!==(r.buffer||undefined)||(r.buffer&&(data(r.buffer,'array')!==r.array||r.buffer.version!==r.version||r.o.count!==r.count))||!local(r.o).equals(r.pose))||
    geometry.morphAttributes!==ownMorphAttributes||
    geometries.some(r=>r.g.index!==r.index||data(r.g,'attributes')!==r.attributeObject||r.index&&(r.index.array!==r.indexArray||r.index.version!==r.indexVersion)||
     r.attributes.some(a=>data(r.attributeObject,a.k)!==a.a||data(a.a,'array')!==a.array||a.a.version!==a.version))){dispose();return;}
  group.visible=root.visible&&fit.visible&&visibility.every(o=>o.visible);
 }
 sync();
 return{group,mesh,footing,geometry,parts,frames,foot,base,footY,baseY,sync,dispose,get disposed(){return disposed;}};
}
