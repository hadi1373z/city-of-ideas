// Installed architectural fitting only. The original source builder, matrices,
// resources, catalogue targets and navigation remain owned by the library.
// Retain the original two-mouth API as the independent historical fixture.
export function fitBabelMouths(T,built){return fitMouths(T,built,false);}
export function fitBabelRadialMouths(T,built){return fitMouths(T,built,true);}
function fitMouths(T,built,includeThird){
 const root=built?.group,empty=()=>({group:null,fits:[],changes:[],bindings:[],sync(){},dispose(){}});if(!root?.isGroup||root.name!=='Beneath Zarathustra · circular Library of Babel')return empty();
 const batches=root.children.filter(o=>o.isInstancedMesh&&['BoxGeometry','PlaneGeometry'].includes(o.geometry.type)&&!o.instanceColor),rows=[];
 for(const owner of batches){if(!owner.matrix.equals(new T.Matrix4()))return empty();for(let id=0;id<owner.count;id++){const m=new T.Matrix4(),p=new T.Vector3(),s=new T.Vector3();owner.getMatrixAt(id,m);m.decompose(p,new T.Quaternion(),s);rows.push({owner,id,m,p,s,color:owner.material.color?.getHex(),type:owner.geometry.type});}}
 const row=(color,id,type='BoxGeometry')=>rows.find(r=>r.color===color&&r.id===id&&r.type===type),near=(a,b,e=2e-4)=>Math.abs(a-b)<e,corners=r=>{const out=[],a=r.owner.geometry.attributes.position;for(let i=0;i<a.count;i++)out.push(new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(r.m));return out;},plans=[];
 const cases=[{anchor:1463,radius:43,bottom:-12,a:-Math.PI*.75,angle:-2.2995163067},{anchor:2272,radius:33,bottom:-16,a:-Math.PI*.25,angle:-.7120943257}];if(includeThird)cases.push({anchor:2385,radius:23,bottom:-20,a:Math.PI/4,angle:.6645676569,side:-1},{anchor:2393,radius:23,bottom:-20,a:Math.PI/4,angle:.9062286699,side:1});
 for(const spec of cases){
  const matches=r=>r?.color===0x765238&&r.type==='BoxGeometry'&&near(Math.hypot(r.p.x,r.p.z),spec.radius)&&near(r.p.y,spec.bottom+2.88)&&near(r.s.y,.11)&&near(Math.atan2(r.p.z,r.p.x),spec.angle),candidates=rows.filter(matches),original=row(0x765238,spec.anchor);if(candidates.length!==1)return empty();const anchor=matches(original)?original:candidates[0];
  const a=Math.atan2(anchor.p.z,anchor.p.x),sign=spec.side||1,axis=new T.Vector3(-Math.sin(a),0,Math.cos(a)).multiplyScalar(sign),radial=new T.Vector3(Math.cos(a),0,Math.sin(a)),normal=new T.Vector3(-Math.sin(spec.a),0,Math.cos(spec.a)).multiplyScalar(sign),direction=new T.Vector3().setFromMatrixColumn(anchor.m,0).normalize();
  const members=rows.filter(r=>{const tangent=r.p.dot(axis),depth=r.p.dot(radial)-spec.radius;return Math.abs(depth)<.56&&Math.abs(tangent)<1.6&&r.p.y>spec.bottom&&r.p.y<spec.bottom+3.9&&new T.Vector3().setFromMatrixColumn(r.m,0).normalize().dot(direction)>.999999;});
  if(members.length!==98||members.filter(r=>r.color===0x765238).length!==8||members.filter(r=>r.type==='PlaneGeometry').length!==40)return empty();plans.push({kind:'case',members,axis,normal});
 }
 const fasciaSpecs=[{anchor:147,radius:45.2,angle:-2.3954643808,y:-8.17,width:1.2033333,a:-Math.PI*.75,minScale:.4}];if(includeThird)fasciaSpecs.push({anchor:495,radius:25.2,angle:.7199483150,y:-16.17,width:.6797344583,a:Math.PI/4,minScale:.3});
 for(const spec of fasciaSpecs){
 const fasciaMatches=r=>r?.color===0x3e3027&&r.type==='BoxGeometry'&&near(Math.hypot(r.p.x,r.p.z),spec.radius)&&near(Math.atan2(r.p.z,r.p.x),spec.angle)&&near(r.p.y,spec.y)&&near(r.s.x,spec.width)&&near(r.s.y,.38)&&near(r.s.z,.16),fascias=rows.filter(fasciaMatches);if(fascias.length!==1)return empty();const oldFascia=row(0x3e3027,spec.anchor),fascia=fasciaMatches(oldFascia)?oldFascia:fascias[0],aligned=r=>r.type==='BoxGeometry'&&near(r.p.x,fascia.p.x)&&near(r.p.z,fascia.p.z)&&near(r.s.x,fascia.s.x),baseY=fascia.p.y+.17;
 const originalStrips=rows.filter(r=>aligned(r)&&r.color===0xa58b56&&near(r.s.y,.045)&&near(r.s.z,.055)),lower=rows.filter(r=>aligned(r)&&r.color===0xa58b56&&near(r.s.y,.06)&&near(r.s.z,.075)&&near(r.p.y,baseY+.60)),upper=rows.filter(r=>aligned(r)&&r.color===0x765238&&near(r.s.y,.10)&&near(r.s.z,.14)&&near(r.p.y,baseY+1.08));let strips;if(originalStrips.length===2&&!lower.length&&!upper.length)strips=originalStrips;else if(!originalStrips.length&&lower.length===1&&upper.length===1)strips=[lower[0],upper[0]];else return empty();
 plans.push({kind:'fascia',members:[fascia,...strips],axis:new T.Vector3().setFromMatrixColumn(fascia.m,0).normalize(),normal:new T.Vector3(Math.sin(spec.a),0,-Math.cos(spec.a)),minScale:spec.minScale});
 }
 const changes=[],fits=[];for(const plan of plans){const vertices=plan.members.flatMap(corners),pin=Math.max(...vertices.map(p=>p.dot(plan.axis))),dot=plan.axis.dot(plan.normal);if(dot<.9)return empty();let scale=1;
  for(const p of vertices){const v=(p.dot(plan.axis)-pin)*dot,u=p.dot(plan.normal)-v;if(v< -1e-7)scale=Math.min(scale,(1.725-u)/v);else if(p.dot(plan.normal)<1.725-1e-5)return empty();}
  if(!(scale>(plan.minScale??.4)&&scale<.95))return empty();const d=scale-1,x=plan.axis.x,z=plan.axis.z,m=new T.Matrix4().set(1+d*x*x,0,d*x*z,-d*pin*x,0,1,0,0,d*x*z,0,1+d*z*z,-d*pin*z,0,0,0,1);
  for(const r of plan.members)changes.push({owner:r.owner,id:r.id,before:r.m,after:m.clone().multiply(r.m),kind:plan.kind});fits.push({kind:plan.kind,scale,pin,axis:plan.axis.toArray(),normal:plan.normal.toArray(),members:plan.members.map(r=>({color:r.color,type:r.type,id:r.id}))});
 }
 const group=new T.Group();group.name='Babel · fitted stair mouths';group.userData.babelMouthClearance=true;const bindings=[];
 for(const source of new Set(changes.map(c=>c.owner))){const clone=new T.InstancedMesh(source.geometry,source.material,source.count);clone.name='Fitted copy of '+source.name;clone.matrix.copy(source.matrix);clone.matrixAutoUpdate=false;clone.layers.mask=source.layers.mask;clone.castShadow=source.castShadow;clone.receiveShadow=source.receiveShadow;clone.frustumCulled=source.frustumCulled;clone.renderOrder=source.renderOrder;clone.visible=source.visible;clone.instanceMatrix.array.set(source.instanceMatrix.array);
  for(const c of changes.filter(c=>c.owner===source))clone.setMatrixAt(c.id,c.after);clone.instanceMatrix.needsUpdate=true;clone.computeBoundingSphere?.();group.add(clone);bindings.push({source,clone,visible:source.visible,geometry:source.geometry,material:source.material,matrix:source.instanceMatrix,matrixVersion:source.instanceMatrix.version,count:source.count});
 }
 for(const b of bindings)b.source.visible=false;root.add(group);let disposed=false;const originalDispose=built.dispose,wrappedDispose=function(...args){dispose();return originalDispose.apply(this,args);};built.dispose=wrappedDispose;
 function dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const b of bindings){b.source.visible=b.visible;b.clone.dispose?.();}group.clear();if(built.dispose===wrappedDispose)built.dispose=originalDispose;}
 function sync(){if(disposed)return;if(!root.parent||group.parent!==root||bindings.some(b=>b.source.parent!==root||b.source.geometry!==b.geometry||b.source.material!==b.material||b.source.instanceMatrix!==b.matrix||b.source.instanceMatrix.version!==b.matrixVersion||b.source.count!==b.count)){dispose();return;}}
 return{group,fits,changes,bindings,sync,dispose};
}
