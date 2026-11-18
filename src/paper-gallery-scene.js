import {PAPER_GALLERY as C,PAPER_GALLERY_FLOORS as FLOORS,paperStairY} from './paper-gallery-model.js?v=paper-detours-20261118';

export function buildPaperGallery(T,{canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group(),walking=new T.Group(),lamps=new T.Group(),owned=new Set(),own=x=>(owned.add(x),x);group.name='Four connected collections · original mathematics and computing papers';walking.name='Three mezzanines and the upward continuation of the central stair';group.add(walking,lamps);
 const stone=own(new T.MeshLambertMaterial({color:0xc3b9a3})),edge=own(new T.MeshLambertMaterial({color:0x786f60})),brass=own(new T.MeshLambertMaterial({color:0xae9560})),floorGlass=own(new T.MeshPhongMaterial({color:0xb8d2d0,specular:0xc4dddd,shininess:75,transparent:true,opacity:.13,depthWrite:false,side:T.DoubleSide,forceSinglePass:true}));
 const mesh=(g,m,name,parent=group)=>{const o=new T.Mesh(own(g),m);o.name=name;parent.add(o);return o;},lines=[];
 function beam(a,b,r=.035){const p=new T.Vector3(...a),q=new T.Vector3(...b),d=q.clone().sub(p);lines.push({p:p.add(q).multiplyScalar(.5),q:new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize()),r,h:d.length()});}
 function ring(ri,ro,y,material,name){const shape=new T.Shape();shape.absarc(0,0,ro,0,2*Math.PI,false);const hole=new T.Path();hole.absarc(0,0,ri,0,2*Math.PI,true);shape.holes.push(hole);const o=mesh(new T.ShapeGeometry(shape,128),material,name);o.rotation.x=-Math.PI/2;o.position.y=y;return o;}
 const floors=[],bridges=[],floorLamps=[],frameRows=[];
 const stoneBands=[[19,21.6],[36.8,39.4],[57,58]],glassBands=[[21.6,36.8],[39.4,57]];
 function glazedFloor(f){
  const positions=[],indices=[],quad=(a,b,c,d)=>{const i=positions.length/3;positions.push(...a,...b,...c,...d);indices.push(i,i+1,i+2,i,i+2,i+3);},p=(r,t,y)=>[r*Math.cos(t),y,r*Math.sin(t)];
  for(const[ri,ro]of stoneBands)for(let i=0;i<192;i++){const a=i*Math.PI/96,b=(i+1)*Math.PI/96,y=f.y,lo=y-.20;quad(p(ri,a,y),p(ri,b,y),p(ro,b,y),p(ro,a,y));quad(p(ri,a,lo),p(ro,a,lo),p(ro,b,lo),p(ri,b,lo));quad(p(ri,a,lo),p(ri,b,lo),p(ri,b,y),p(ri,a,y));quad(p(ro,a,lo),p(ro,a,y),p(ro,b,y),p(ro,b,lo));}
  const stoneCount=indices.length;
  // These panes replace the original opaque slab. A single double-sided
  // walking surface represents the laminate, with no hidden stone beneath it.
  for(const[ri,ro]of glassBands)for(let i=0;i<192;i++){const a=i*Math.PI/96,b=(i+1)*Math.PI/96;quad(p(ri,a,f.y),p(ri,b,f.y),p(ro,b,f.y),p(ro,a,f.y));}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.addGroup(0,stoneCount,0);geometry.addGroup(stoneCount,indices.length-stoneCount,1);geometry.computeVertexNormals();geometry.computeBoundingSphere();
  const floor=mesh(geometry,[stone,floorGlass],f.name+' · genuinely glazed annular mezzanine',walking);floor.userData={paperFloor:f.index,glazedMezzanine:true,glassBands};
  const addFrame=(a,b,width=.12)=>{const dx=b[0]-a[0],dz=b[1]-a[1];frameRows.push({x:(a[0]+b[0])/2,y:f.y-.11,z:(a[1]+b[1])/2,length:Math.hypot(dx,dz)+.015,width,yaw:Math.atan2(-dz,dx)});};
  // Offset the spokes from the main collection axes: looking up from the
  // actual r52 reading aisle sees broad glazing rather than a bearing beam.
  for(let i=0;i<48;i++){const a=(i+.5)*Math.PI/24;addFrame([21.6*Math.cos(a),21.6*Math.sin(a)],[57*Math.cos(a),57*Math.sin(a)],.14);}
  for(const r of[21.6,26.5,31.5,36.8,39.4,44.5,50,55,57])for(let i=0;i<72;i++){const a=i*Math.PI/36,b=(i+1)*Math.PI/36;addFrame([r*Math.cos(a),r*Math.sin(a)],[r*Math.cos(b),r*Math.sin(b)]);}
  return floor;
 }
 for(const f of FLOORS){
  const color=own(new T.MeshLambertMaterial({color:f.color}));ring(19.3,19.6,f.y+.024,color,f.name+' · inner colour inlay');ring(54.5,54.65,f.y+.024,color,f.name+' · collection border');
  if(f.index){floors.push(glazedFloor(f));
   const join=new T.Shape(),a=Math.asin(1.8/17.6),x=Math.sqrt(17.6**2-1.8**2);join.moveTo(x,-1.8);join.lineTo(20.1,-1.8);join.lineTo(20.1,1.8);join.lineTo(x,1.8);join.absarc(0,0,17.6,a,-a,true);join.closePath();const bridge=mesh(new T.ExtrudeGeometry(join,{depth:.20,curveSegments:32,bevelEnabled:false}),stone,f.name+' · radial stair landing',walking);bridge.rotation.set(-Math.PI/2,0,0);const wrapper=new T.Group();walking.add(wrapper);wrapper.add(bridge);wrapper.rotation.y=-f.angle;bridge.position.y=f.y-.20;bridges.push(bridge);
  }
  for(let i=0;i<160;i++){const a=i*2*Math.PI/160,b=(i+1)*2*Math.PI/160,d=Math.atan2(Math.sin((a+b)/2-f.angle),Math.cos((a+b)/2-f.angle));if(f.index&&Math.abs(d)>.11){beam([19.05*Math.cos(a),f.y+1.05,19.05*Math.sin(a)],[19.05*Math.cos(b),f.y+1.05,19.05*Math.sin(b)]);if(i%4===0)beam([19.05*Math.cos(a),f.y,19.05*Math.sin(a)],[19.05*Math.cos(a),f.y+1.05,19.05*Math.sin(a)]);}if(f.index){beam([57.8*Math.cos(a),f.y+1.05,57.8*Math.sin(a)],[57.8*Math.cos(b),f.y+1.05,57.8*Math.sin(b)]);if(i%4===0)beam([57.8*Math.cos(a),f.y,57.8*Math.sin(a)],[57.8*Math.cos(a),f.y+1.05,57.8*Math.sin(a)]);}}
  if(f.index)for(const side of[-1,1]){const p=(u,v)=>[Math.cos(f.angle)*u-Math.sin(f.angle)*v,f.y+1.05,Math.sin(f.angle)*u+Math.cos(f.angle)*v];beam(p(17.9,side*1.8),p(19.05,side*1.8));}
  const label=canvas();label.width=1600;label.height=240;const ctx=label.getContext('2d');ctx.fillStyle='#283f40';ctx.fillRect(0,0,1600,240);ctx.fillStyle='#e7dec5';ctx.textAlign='center';ctx.font='32px sans-serif';ctx.fillText('FACULTY OF MATHEMATICS · FLOOR '+(f.index+1)+' / 4',800,70,1500);ctx.font='56px Georgia';ctx.fillText(f.name,800,155,1500);const texture=own(new T.CanvasTexture(label));texture.colorSpace=T.SRGBColorSpace;const sign=mesh(new T.PlaneGeometry(4.2,.72),own(new T.MeshBasicMaterial({map:texture,toneMapped:false,side:T.DoubleSide})),f.name+' · floor identity');const plaqueAngle=f.angle+.32;sign.position.set(18.85*Math.cos(plaqueAngle),f.y+1.4,18.85*Math.sin(plaqueAngle));sign.rotation.y=-plaqueAngle+Math.PI/2;
  const lights=new T.Group();lights.visible=false;lamps.add(lights);floorLamps.push(lights);for(let i=0;i<3;i++){const angle=f.angle+(i-1)*.5,light=new T.PointLight(0xffdfb2,28,47,1.5);light.position.set(39*Math.cos(angle),f.y+3.2,39*Math.sin(angle));lights.add(light);}
 }
 const verts=[],indices=[],quad=(a,b,c,d)=>{const i=verts.length/3;verts.push(...a,...b,...c,...d);indices.push(i,i+1,i+2,i,i+2,i+3);};
 for(let i=0;i<C.steps;i++){const a=i/C.steps*2*Math.PI,b=(i+1)/C.steps*2*Math.PI,y=paperStairY(a),p=(r,t,h)=>[r*Math.cos(t),h,-r*Math.sin(t)];quad(p(C.stairInner,b,y),p(C.stairInner,a,y),p(C.stairOuter,a,y),p(C.stairOuter,b,y));quad(p(C.stairInner,b,y),p(C.stairOuter,b,y),p(C.stairOuter,b,y+.125),p(C.stairInner,b,y+.125));for(const r of[C.stairInner,C.stairOuter])quad(p(r,a,y-.20),p(r,b,y-.20),p(r,b,y),p(r,a,y));}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();const stair=mesh(geo,stone,'96 real stone treads · four collections on one continuous stair',walking);
 for(let i=0;i<C.steps;i++){const a=i/C.steps*2*Math.PI,b=(i+1)/C.steps*2*Math.PI;for(const r of[14.35,17.65]){if(r>16&&FLOORS.some(f=>Math.abs((a+b)/2-f.theta)<.15))continue;beam([r*Math.cos(a),paperStairY(a)+1.05,-r*Math.sin(a)],[r*Math.cos(b),paperStairY(b)+1.05,-r*Math.sin(b)]);if(i%4===0)beam([r*Math.cos(a),paperStairY(a),-r*Math.sin(a)],[r*Math.cos(a),paperStairY(a)+1.05,-r*Math.sin(a)]);}}
 const unit=own(new T.CylinderGeometry(1,1,1,7)),batch=new T.InstancedMesh(unit,brass,lines.length),stamp=new T.Object3D();lines.forEach((l,i)=>{stamp.position.copy(l.p);stamp.quaternion.copy(l.q);stamp.scale.set(l.r,l.h,l.r);stamp.updateMatrix();batch.setMatrixAt(i,stamp.matrix);});batch.computeBoundingSphere();group.add(batch);
 const frameGeometry=own(new T.BoxGeometry(1,1,1)),frameBatch=new T.InstancedMesh(frameGeometry,edge,frameRows.length);frameBatch.name='Shared warm radial rafters and concentric glazing frames';frameRows.forEach((p,i)=>{stamp.position.set(p.x,p.y,p.z);stamp.rotation.set(0,p.yaw,0);stamp.scale.set(p.length,.20,p.width);stamp.updateMatrix();frameBatch.setMatrixAt(i,stamp.matrix);});frameBatch.instanceMatrix.needsUpdate=true;frameBatch.computeBoundingSphere();group.add(frameBatch);
 let disposed=false;return{group,walking,lamps,floors,bridges,stair,floorGlass,frameBatch,glassBands,stoneBands,setLightFloor(index){floorLamps.forEach((g,i)=>g.visible=i===index);},dispose(){if(disposed)return;disposed=true;group.removeFromParent();batch.dispose();frameBatch.dispose();for(const o of owned)o.dispose?.();group.clear();}};
}
