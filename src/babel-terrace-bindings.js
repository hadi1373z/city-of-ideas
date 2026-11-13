import {BABEL} from './babel-library-model.js?v=two-faces2';

// Recessed beds join public decorative volumes to existing shelves. The four
// fitted incoming bays keep their separate, unchanged clearance contract.
export function seatBabelTerraceBindings(T, built, mouths) {
  const data=(o,k)=>o&&Object.getOwnPropertyDescriptor(o,k)?.value;
  const root=data(built,'group'),fit=data(mouths,'group'),bindings=data(mouths,'bindings');
  const empty=()=>({group:null,parts:[],frames:[],sync(){},dispose(){}});
  const name='Babel · recessed terrace binding beds';
  if(data(root,'isGroup')!==true||data(root,'name')!=='Beneath Zarathustra · circular Library of Babel'||
      data(fit,'isGroup')!==true||fit.parent!==root||fit.userData.babelMouthClearance!==true||
      !Array.isArray(bindings)||bindings.length!==12||
      data(mouths,'changes')?.length!==398||root.children.some(o=>o.name===name))return empty();
  const identity=new T.Matrix4(),local=o=>o.matrixAutoUpdate?
    new T.Matrix4().compose(o.position,o.quaternion,o.scale):o.matrix;
  if(!local(fit).equals(identity))return empty();
  const near=(a,b,e=2e-4)=>Math.abs(a-b)<e;
  const boxes=bindings.filter(b=>b.source?.isInstancedMesh&&b.source.geometry?.type==='BoxGeometry');
  if(boxes.length!==11)return empty();
  const unit=boxes[0].source.geometry;
  if(['width','height','depth'].some(k=>unit.parameters?.[k]!==1)||
      unit.attributes?.position?.count!==24||unit.index?.count!==36)return empty();
  for(const v of unit.attributes.position.array)if(Math.abs(Math.abs(v)-.5)>1e-7)return empty();
  for(let face=0;face<6;face++)if([0,2,1,2,3,1].some((v,i)=>
      unit.index.getX(face*6+i)!==v+face*4))return empty();
  for(const b of boxes)if(b.source.parent!==root||b.clone?.parent!==fit||
      b.source.geometry!==unit||b.clone.geometry!==unit||
      b.clone.material!==b.source.material||b.clone.count!==b.source.count||
      !local(b.source).equals(identity)||!local(b.clone).equals(identity)||
      b.source.instanceMatrix?.itemSize!==16||b.clone.instanceMatrix?.itemSize!==16)return empty();

  // Shape and relative placement select the public builder's decorative
  // records, without reading their colours, imported books or any private state.
  const rows=[];
  for(const binding of boxes)for(let id=0;id<binding.source.count;id++){
    const raw=new T.Matrix4(),m=new T.Matrix4(),p=new T.Vector3(),s=new T.Vector3();
    binding.source.getMatrixAt(id,raw);binding.clone.getMatrixAt(id,m);
    raw.decompose(p,new T.Quaternion(),s);
    rows.push({binding,id,raw,m,p,s,changed:!raw.equals(m)});
  }
  const parts=[],frames=[],counts=[5950,4800,3700,2550,1300],fitted=[0,50,50,100,0];
  let timber=null;
  const inside=(m,p)=>p.clone().applyMatrix4(m.clone().invert()).toArray().every(v=>Math.abs(v)<.500005);
  const core=(a,b,p)=>[-.003,.003].every(x=>[-.003,.003].every(y=>[-.003,.003].every(z=>{
    const q=p.clone().add(new T.Vector3(x,y,z));return inside(a,q)&&inside(b,q);
  })));
  for(const level of BABEL.levels){
    const n=Math.ceil(Math.PI*2*(level.r+4)/2.8),arc=(level.r+4)*Math.PI*2/n;
    const shelves=rows.filter(r=>near(r.s.y,.11)&&near(r.s.z,1)&&
      near(Math.hypot(r.p.x,r.p.z),level.r+4)&&
      near((r.p.y-level.y-.12)/.69,Math.round((r.p.y-level.y-.12)/.69)));
    const books=rows.filter(r=>near(r.s.x,(arc-.43)/10*.83)&&near(r.s.z,.64)&&
      [.39,.437,.484,.531,.578].some(h=>near(r.s.y,h))&&r.p.y>level.y&&r.p.y<level.y+3.7&&
      near((r.p.y-r.s.y/2-level.y-.23)/.69,Math.round((r.p.y-r.s.y/2-level.y-.23)/.69)));
    if(books.length!==counts[level.id]||books.filter(r=>r.changed).length!==fitted[level.id])return empty();
    const rowGroups=new Map();
    for(const book of books){
      const row=Math.round((book.p.y-book.s.y/2-level.y-.23)/.69);
      const matches=shelves.filter(s=>near(s.p.y,level.y+.12+row*.69)&&
        new T.Vector3().setFromMatrixColumn(s.raw,0).normalize().dot(
          new T.Vector3().setFromMatrixColumn(book.raw,0).normalize())>1-1e-10);
      if(row<0||row>4||matches.length!==1)return empty();
      const shelf=matches[0];if(timber&&timber!==shelf.binding)return empty();timber=shelf.binding;
      const key=shelf.id;if(!rowGroups.has(key))rowGroups.set(key,{shelf,books:[],row});
      rowGroups.get(key).books.push(book);
    }
    for(const frame of rowGroups.values()){
      const {shelf,books,row}=frame;
      if(books.length!==10)return empty();
      const changed=books.filter(b=>b.changed).length;
      if(shelf.changed||changed){if(!shelf.changed||changed!==10)return empty();continue;}
      const inverse=shelf.m.clone().invert(),localFeet=[];
      let minBottom=Infinity,maxBottom=-Infinity;
      for(const book of books)for(const x of[-.5,.5])for(const z of[-.5,.5]){
        const p=new T.Vector3(x,-.5,z).applyMatrix4(book.m),q=p.clone().applyMatrix4(inverse);
        if(Math.abs(q.x)>.499||Math.abs(q.z)>.499)return empty();
        minBottom=Math.min(minBottom,p.y);maxBottom=Math.max(maxBottom,p.y);localFeet.push(q);
      }
      const top=shelf.p.y+shelf.s.y/2,gap=minBottom-top;
      if(gap<.05499||gap>.05501||maxBottom-minBottom>2e-6)return empty();
      const lo=Math.min(...localFeet.map(p=>p.x))*shelf.s.x+.015;
      const hi=Math.max(...localFeet.map(p=>p.x))*shelf.s.x-.015;
      const h=gap+.02,centre=new T.Vector3((lo+hi)/2/shelf.s.x,
        ((top+minBottom)/2-shelf.p.y)/shelf.s.y,0).applyMatrix4(shelf.m);
      const matrix=new T.Matrix4().compose(centre,new T.Quaternion().setFromRotationMatrix(
        new T.Matrix4().extractRotation(shelf.m)),new T.Vector3(hi-lo,h,.60));
      matrix.fromArray(new Float32Array(matrix.elements));
      if(!core(shelf.m,matrix,new T.Vector3(0,.5-.005/shelf.s.y,0).applyMatrix4(shelf.m)))return empty();
      for(const book of books){
        const p=new T.Vector3(0,-.5,0).applyMatrix4(book.m);p.y+=.005;
        if(!core(book.m,matrix,p))return empty();
      }
      parts.push({matrix});frames.push({level:level.id,row,shelf,books,part:parts.length-1,gap});
    }
  }
  if(parts.length!==1810||!timber)return empty();
  const group=new T.Group();group.name=name;group.userData.babelBindingBeds=true;
  const mesh=new T.InstancedMesh(unit,timber.source.material,parts.length);
  mesh.name='Recessed beds below unchanged terrace bindings';
  mesh.layers.mask=timber.clone.layers.mask;
  mesh.castShadow=timber.clone.castShadow;mesh.receiveShadow=timber.clone.receiveShadow;
  parts.forEach((p,i)=>mesh.setMatrixAt(i,p.matrix));
  mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere?.();group.add(mesh);root.add(group);
  const ownBuffer=mesh.instanceMatrix,ownArray=ownBuffer.array,ownVersion=ownBuffer.version;
  const records=boxes.flatMap(b=>[b.source,b.clone]).map(o=>({o,parent:o.parent,
    geometry:o.geometry,material:o.material,buffer:o.instanceMatrix,array:o.instanceMatrix.array,
    version:o.instanceMatrix.version,count:o.count,pose:local(o).clone()}));
  const geometry={index:unit.index,indexArray:unit.index.array,indexVersion:unit.index.version,
    attributes:Object.entries(unit.attributes).map(([k,a])=>({k,a,array:a.array,version:a.version}))};
  const previous=built.dispose;let disposed=false;
  const wrapped=function(...args){dispose();return previous.apply(this,args);};built.dispose=wrapped;
  function dispose(){
    if(disposed)return;disposed=true;group.removeFromParent();
    mesh.instanceMatrix=ownBuffer;ownBuffer.array=ownArray;mesh.dispose?.();group.clear();
    if(built.dispose===wrapped)built.dispose=previous;
  }
  function sync(){
    if(disposed)return;
    if(data(built,'group')!==root||data(mouths,'group')!==fit||!root.parent||
        fit.parent!==root||group.parent!==root||mesh.parent!==group||
        !local(fit).equals(identity)||!local(group).equals(identity)||!local(mesh).equals(identity)||
        mesh.geometry!==unit||mesh.material!==timber.source.material||mesh.count!==1810||
        data(mesh,'instanceMatrix')!==ownBuffer||data(ownBuffer,'array')!==ownArray||
        ownBuffer.version!==ownVersion||
        records.some(r=>r.o.parent!==r.parent||r.o.geometry!==r.geometry||
          r.o.material!==r.material||data(r.o,'instanceMatrix')!==r.buffer||
          data(r.buffer,'array')!==r.array||r.buffer.version!==r.version||
          r.o.count!==r.count||!local(r.o).equals(r.pose))||
        unit.index!==geometry.index||geometry.index.array!==geometry.indexArray||
        geometry.index.version!==geometry.indexVersion||geometry.attributes.some(r=>
          unit.attributes[r.k]!==r.a||r.a.array!==r.array||r.a.version!==r.version)){
      dispose();return;
    }
    group.visible=root.visible&&fit.visible&&records.every(r=>r.parent===root||r.o.visible);
  }
  return {group,mesh,parts,frames,sync,dispose,get disposed(){return disposed;}};
}
