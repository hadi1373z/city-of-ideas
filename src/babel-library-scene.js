import {buildBabelThermalVault} from './babel-thermal-vault.js?v=book-contact1';
import {BABEL_READING_BOOK} from './babel-reading-book-model.js';
import {buildBabelSnakeStairs} from './babel-snake-stairs.js?v=two-faces2';
import {BABEL,stairs,babelDesk,BABEL_COPY} from './babel-library-model.js?v=two-faces2';
export function buildBabelLibrary(T,{canvas=()=>document.createElement('canvas'),drawing=null}={}){
 const group=new T.Group();group.name='Beneath Zarathustra · circular Library of Babel';const owned=new Set(),own=v=>(owned.add(v),v),batches=new Map(),beamBatches=new Map(),labels=[],targets=[];
 const material=(color,opts={})=>own(new T.MeshLambertMaterial({color,...opts}));
 const oak=material(0x765238),edgeWood=material(0x3e3027),plaster=material(0x8f8065,{side:T.BackSide}),stone=material(0xc5b28b),floor=material(0x9c8965),brass=material(0xa58b56),pages=material(0xe2d4b0),leather=[0x7e5144,0x405e5a,0x8a784b,0x4e5266,0x6a775c,0xb39360,0x574439,0x9a6b59].map(c=>material(c));
 const unit=own(new T.BoxGeometry(1,1,1)),stamp=material(0xa58b56,{side:T.DoubleSide}),unitStamp=own(new T.PlaneGeometry(1,1)),unitBeam=own(new T.CylinderGeometry(1,1,1,7));
 function box(w,h,d,x,y,z,m,yaw=0,pitch=0){if(!batches.has(m))batches.set(m,[]);batches.get(m).push({w,h,d,x,y,z,yaw,pitch});}
 function mesh(g,m,x=0,y=0,z=0){own(g);const o=new T.Mesh(g,m);o.position.set(x,y,z);group.add(o);return o;}
 function beam(a,b,w,m){const start=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(start);if(!beamBatches.has(m))beamBatches.set(m,[]);beamBatches.get(m).push({p:start.clone().add(end).multiplyScalar(.5),q:new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize()),length:delta.length(),w});}
 function outsideBridge(poly){
  const outside=[];for(const [axis,value,sign]of[[0,9,1],[0,18,-1],[2,-1.8,1],[2,1.8,-1]]){
   if(!poly.length)break;const inside=[],out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=(a[axis]-value)*sign,db=(b[axis]-value)*sign; (da>=0?inside:out).push(a);if((da>=0)!==(db>=0)){const t=da/(da-db),p=a.map((v,j)=>v+(b[j]-v)*t);inside.push(p);out.push(p);}}if(out.length>=3)outside.push(out);poly=inside;
  }return outside;
 }
 function band(ri,ro,y,m,{gap=null,bridgeCut=false}={}){const v=[],ix=[],n=320;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2;for(const r of[ri,ro])v.push(Math.cos(a)*r,y,Math.sin(a)*r);}for(let i=0;i<n;i++){const a=(i+.5)/n*Math.PI*2,delta=gap?Math.atan2(Math.sin(a-gap.a),Math.cos(a-gap.a)):10;if(gap&&Math.abs(delta)<gap.half)continue;const k=i*2;ix.push(k,k+2,k+1,k+1,k+2,k+3);}const g=new T.BufferGeometry();if(bridgeCut){const cut=[];for(let i=0;i<ix.length;i+=3){const triangle=ix.slice(i,i+3).map(k=>v.slice(k*3,k*3+3));for(const p of outsideBridge(triangle))for(let j=1;j<p.length-1;j++)cut.push(...p[0],...p[j],...p[j+1]);}g.setAttribute('position',new T.Float32BufferAttribute(cut,3));}else{g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(ix);}g.computeVertexNormals();return mesh(g,m);}
 function label(text,x,y,z,yaw,w=3.2,h=.6){const c=canvas();c.width=1024;c.height=192;const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;const o=mesh(new T.PlaneGeometry(w,h),own(new T.MeshBasicMaterial({map:texture,side:T.DoubleSide})),x,y,z);o.rotation.y=yaw;labels.push({c,texture,text});return o;}
 // A real enclosed vault, physically underneath the gallery; the top stairwell is open.
 const wall=mesh(new T.CylinderGeometry(57.5,57.5,25,160,1,true),plaster,0,-15,0);wall.name='Earthen library vault';const shape=new T.Shape();shape.absarc(0,0,58,0,Math.PI*2,false);const h=new T.Path();const opening={...BABEL.opening,minX:BABEL.opening.minX-1.15,maxX:BABEL.opening.maxX+1.15,minZ:BABEL.landing.minZ-.3};h.moveTo(opening.minX,-opening.minZ);h.lineTo(opening.minX,-opening.maxZ);h.lineTo(opening.maxX,-opening.maxZ);h.lineTo(opening.maxX,-opening.minZ);h.closePath();shape.holes.push(h);const centralRoofOpening=new T.Path();centralRoofOpening.absarc(0,0,21,0,Math.PI*2,true);shape.holes.push(centralRoofOpening);const ceiling=mesh(new T.ExtrudeGeometry(shape,{depth:.5,bevelEnabled:false,curveSegments:120}),material(0x665743,{side:T.DoubleSide}),0,-2.8,0);ceiling.rotation.x=-Math.PI/2;ceiling.name='Annular timber ceiling around the volcanic glass reservoir';const thermal=buildBabelThermalVault(T);group.add(thermal.group);
 // The deeper through-gallery uses the annulus as a real shaft. The original
 // book well keeps its complete base; no invisible floor remains across the walk.
 const shaft={inner:13.9,outer:18.1},pit=mesh(new T.CircleGeometry(shaft.inner,160),floor,0,BABEL.base,0);pit.rotation.x=-Math.PI/2;pit.name='Book-well base inside the through-gallery shaft';
 const outerPit=band(shaft.outer,57.4,BABEL.base,floor);outerPit.name='Library base outside the open annular shaft';
 group.userData.throughGalleryShaft={...shaft,y:BABEL.base};
 for(let i=0;i<24;i++){const a=i*Math.PI*2/24;box(.5,24,.6,Math.cos(a)*56.5,-14.8,Math.sin(a)*56.5,oak,-a);beam([Math.cos(a)*21,-3.2,Math.sin(a)*21],[Math.cos(a)*56.5,-3.2,Math.sin(a)*56.5],.16,edgeWood);}
 let bookCount=0;
 for(const l of BABEL.levels){
  const gap=l.id<4?{a:l.angle,half:1.9/l.r}:null;band(l.r-3.8,l.r,l.y,floor,{gap});const aisle=band(l.r,l.r+4.4,l.y,floor,{bridgeCut:l.id===4});aisle.name='Terrace '+l.id+' outer walking floor';
  const count=Math.ceil(Math.PI*2*(l.r+4)/2.8),da=Math.PI*2/count,arc=(l.r+4)*da;
  for(let j=0;j<count;j++){
   const a=(j+.5)*da,R=l.r+4,x=Math.cos(a)*R,z=Math.sin(a)*R,incoming=l.id>0?stairs[l.id-1]:null,delta=incoming?Math.atan2(Math.sin(a-incoming.a),Math.cos(a-incoming.a)):10;if(incoming&&Math.abs(delta)<2.35/R)continue;
   // Remove complete shelf bays at the final east aisle. Their joinery and books
   // share the cut, leaving a clear doorway at least four metres wide to the bridge.
   if(l.id===4&&Math.cos(a)>0&&Math.abs(z)<2+arc/2)continue;
   const yaw=Math.PI/2-a,point=(t,rad)=>({x:Math.cos(a)*(R+rad)-Math.sin(a)*t,z:Math.sin(a)*(R+rad)+Math.cos(a)*t});
   for(const t of[-arc/2+.06,arc/2-.06]){const p=point(t,0);box(.15,3.8,.95,p.x,l.y+1.9,p.z,oak,yaw);}
   for(let row=0;row<=5;row++)box(arc,.11,1.0,x,l.y+.12+row*.69,z,oak,yaw);
   for(let row=0;row<5;row++)for(let k=0;k<10;k++){const t=(k-4.5)*(arc-.35)/10,p=point(t,0),index=(j*29+row*13+k*7+l.id*5),height=.39+(index%5)*.047,width=(arc-.43)/10*.83;box(width,height,.64,p.x,l.y+.23+row*.69+height/2,p.z,leather[index%leather.length],yaw);bookCount++;if(k%3===0)for(const rad of[-.327,.327]){const q=point(t,rad);box(width*.55,.028,.012,q.x,l.y+.34+row*.69,q.z,stamp,yaw);}}
   if(j%9===0){const p=point(0,0);box(.9,.11,.75,p.x,l.y+3.68,p.z,leather[j%8],yaw+.12);box(.78,.045,.69,p.x,l.y+3.765,p.z,pages,yaw+.12);}
  }
  // Inner balcony fascias and slender rails, with actual gaps for the stairs.
  const railR=l.r-3.8,posts=240;
  for(let j=0;j<posts;j++){const a=j/posts*Math.PI*2,next=(j+.5)/posts*Math.PI*2,d=Math.atan2(Math.sin(a-l.angle),Math.cos(a-l.angle)),entry=l.id===0&&Math.cos(a)*railR>BABEL.landing.minX&&Math.sin(a)*railR>BABEL.landing.minZ-.4&&Math.sin(a)*railR<BABEL.landing.maxZ+.4;
   if(l.id<4&&Math.abs(d)<2.1/l.r||entry)continue;const x=Math.cos(next)*railR,z=Math.sin(next)*railR,yaw=Math.PI/2-next,w=railR*Math.PI*2/posts+.02;box(w,.38,.16,x,l.y-.17,z,edgeWood,yaw);box(w,.06,.075,x,l.y+.60,z,brass,yaw);box(w,.10,.14,x,l.y+1.08,z,oak,yaw);if(j%2===0){const px=Math.cos(a)*railR,pz=Math.sin(a)*railR;box(.10,1.10,.10,px,l.y+.55,pz,brass);box(.22,.065,.22,px,l.y+.0325,pz,edgeWood);}}
  const d=babelDesk(l.id),a=d.a,yaw=Math.PI/2-a;box(1.7,.14,1.05,d.x,l.y+.95,d.z,oak,yaw);box(.32,.9,.32,d.x,l.y+.45,d.z,edgeWood);const book=mesh(new T.BoxGeometry(.85,.065,.62),pages,d.x,l.y+1.06,d.z);book.rotation.y=yaw;book.name='Open catalogue book · terrace '+(l.id+1);book.userData={babelBook:l.id};targets.push(book);const cover=mesh(new T.BoxGeometry(.96,.045,.70),leather[(l.id+1)%8],d.x,l.y+1.013,d.z);cover.rotation.y=yaw;cover.userData={babelBook:l.id};targets.push(cover);
  label(String(l.id+1).padStart(2,'0'),Math.cos(a)*(l.r+3.43),l.y+2.7,Math.sin(a)*(l.r+3.43),-a-Math.PI/2,1.2,.5);
 }
 function flight({start,end,width,top,bottom,steps:count}){const a=new T.Vector3(...start),b=new T.Vector3(...end),dir=b.clone().sub(a),length=dir.length(),yaw=Math.atan2(-dir.z,dir.x),side=new T.Vector3(-dir.z,0,dir.x).normalize();for(let i=0;i<count;i++){const p=a.clone().lerp(b,(i+.5)/count),y=top-(i+1)*(top-bottom)/count;if(i<count-1)box(length/count+.014,.18,width,p.x,y-.09,p.z,stone,yaw); /* The lower terrace owns the final tread surface. */}
  for(const sign of[-1,1]){const va=a.clone().addScaledVector(side,sign*(width/2-.1)),vb=b.clone().addScaledVector(side,sign*(width/2-.1));beam([va.x,top-.18,va.z],[vb.x,bottom-.18,vb.z],.15,oak);beam([va.x,top+1.03,va.z],[vb.x,bottom+1.03,vb.z],.055,brass);beam([va.x,top+.55,va.z],[vb.x,bottom+.55,vb.z],.026,brass);for(let i=0;i<=count;i+=4){const p=va.clone().lerp(vb,i/count),y=top-(top-bottom)*i/count;box(.10,1.1,.10,p.x,y+.55,p.z,brass);box(.22,.065,.22,p.x,y+.0325,p.z,edgeWood);}}
 }
 for(const s of stairs)flight({start:[Math.cos(s.a)*s.outer,0,Math.sin(s.a)*s.outer],end:[Math.cos(s.a)*s.inner,0,Math.sin(s.a)*s.inner],width:s.width,top:s.top,bottom:s.bottom,steps:s.steps});
 const descent=buildBabelSnakeStairs(T,{drawing,landingMaterial:floor});group.add(descent.group);targets.push(descent.ramp);
 // The descent belongs to the library: oak cheek walls support stepped bookcases,
 // while the same floor and balustrade continue through the arrival overlook.
 const glow=own(new T.MeshBasicMaterial({color:0xffdf9a}));
 const f=BABEL.flight,rise=(f.top-f.bottom)/f.steps,tread=(f.z0-f.z1)/f.steps;
 for(const sign of[-1,1])for(let i=0;i<f.steps;i++){
  const y=f.top-(i+1)*rise,x=f.x+sign*(f.width/2+.42),z=f.z0-(i+.5)*tread;
  box(.7,y-f.bottom+.18,tread+.012,x,(y+f.bottom)/2-.09,z,edgeWood);
  box(.83,.10,tread+.016,x,y+.04,z,oak);
 }
 for(const sign of[-1,1])for(const i of[10,19,28,37]){
  const y=f.top-(i+1)*rise,x=f.x+sign*(f.width/2+.42),z=f.z0-(i+.5)*tread;
  for(const dz of[-.53,.53])box(.69,.84,.08,x,y+.49,z+dz,oak);
  for(const dy of[.1,.53,.94])box(.72,.08,1.14,x,y+dy,z,oak);
  for(let row=0;row<2;row++)for(let k=0;k<7;k++){
   box(.42,.29+(k%3)*.035,.10,x-sign*.12,y+.29+row*.42,z+(k-3)*.14,leather[(i+k+row)%8]);
   bookCount++;
  }
  box(.075,.12,.15,x-sign*.24,y+1.10,z,brass);
  box(.14,.11,.21,x-sign*.24,y+1.19,z,glow);
 }
 // Oak reveals follow the shaft, rather than an unrelated dark rectangular lid.
 const shaftLength=opening.maxZ-opening.minZ,shaftWidth=opening.maxX-opening.minX,shaftZ=(opening.minZ+opening.maxZ)/2,shaftX=(opening.minX+opening.maxX)/2;
 for(const x of[opening.minX-.13,opening.maxX+.13]){box(.26,.50,shaftLength+.52,x,-2.55,shaftZ,edgeWood);box(.44,.18,shaftLength+.72,x,-2.89,shaftZ,oak);}
 for(const z of[opening.minZ-.13,opening.maxZ+.13]){box(shaftWidth,.50,.26,shaftX,-2.55,z,edgeWood);box(shaftWidth+.44,.18,.44,shaftX,-2.89,z,oak);}
 // Finished soffit below the original upper flight; its steps and snake drawing are retained.
 const run=f.z0-f.z1,upperRise=8;box(f.width,.20,Math.hypot(run,upperRise),f.x,f.top+upperRise/2-.52,(f.z0+f.z1)/2,edgeWood,0,-Math.atan2(upperRise,run));
 for(const x of[f.x-f.width/2+.12,f.x+f.width/2-.12])beam([x,f.top-.52,f.z1],[x,f.top+upperRise-.52,f.z0],.15,oak);
 // A curving brass seam draws the arrival route into the circular balcony.
 let last=[f.x,-8+.012,-.65];
 for(let j=1;j<=32;j++){
  const q=j/32,a=-.11*q,r=f.x+(48-f.x)*Math.sin(q*Math.PI/2),next=[Math.cos(a)*r,-8+.012,Math.sin(a)*r];
  beam(last,next,.014,brass);last=next;
 }
 // Individual upright volumes form a legible circle around a quiet reading
 // plinth. Their slim covers, cream fore-edges and outward spines stay well
 // inside the last terrace's foot aisle and the deeper stair's annular shaft.
 const ringCount=64,ringRadius=3.65,bookBase=BABEL.base+.10;
 const ringFoot=band(3.12,4.20,BABEL.base+.055,oak);ringFoot.name='Circular footing beneath the upright book ring';
 for(let i=0;i<ringCount;i++){
  const a=i*Math.PI*2/ringCount,yaw=Math.PI/2-a,w=.16+(i%4)*.025,h=1.25+(i*7%9)*.10,d=.74+(i%5)*.035,x=Math.cos(a)*ringRadius,z=Math.sin(a)*ringRadius,m=leather[i%leather.length];
  const point=(t,r)=>({x:x+Math.sin(a)*t+Math.cos(a)*r,z:z-Math.cos(a)*t+Math.sin(a)*r});
  box(w-.052,h-.085,d-.055,x,bookBase+h/2,z,pages,yaw);
  for(const side of[-1,1]){const p=point(side*(w/2-.012),0);box(.024,h+.025,d+.045,p.x,bookBase+h/2,p.z,m,yaw);}
  const spine=point(0,d/2);box(w,h+.025,.055,spine.x,bookBase+h/2,spine.z,m,yaw);
  for(const fraction of[.22,.76]){const p=point(0,d/2+.030);box(w*.76,.025,.010,p.x,bookBase+h*fraction,p.z,brass,yaw);}
  bookCount++;
 }
 const plinth=mesh(new T.CylinderGeometry(1.12,1.27,.66,64),stone,0,BABEL.base+.33,0);plinth.name='Quiet circular reading plinth';
 const plinthTop=mesh(new T.CylinderGeometry(1.38,1.38,.075,64),oak,0,BABEL.base+.6975,0);plinthTop.name='Round oak reading surface';
 box(1.14,.045,.86,0,BABEL.base+.758,0,leather[1]);
 const readingBook=BABEL_READING_BOOK;for(const side of[-1,1]){const leaf=mesh(new T.BoxGeometry(readingBook.leafWidth,readingBook.leafThickness,readingBook.leafDepth),pages,side*readingBook.offset,readingBook.leafY,0);leaf.rotation.z=-side*readingBook.leafTilt;leaf.name='Open book on the central reading plinth';}
 const lamps=new T.Group();lamps.name='Warm underground reading lights';group.add(lamps);const lampPositions=[];for(const l of BABEL.levels)for(let j=0;j<6;j++){const a=j*Math.PI/3+.3,x=Math.cos(a)*(l.r+4),z=Math.sin(a)*(l.r+4);box(.06,.8,.06,x,l.y+3.8,z,brass);lampPositions.push([x,l.y+4.32,z]);}
 const ambient=new T.AmbientLight(0xe4cfac,.8);ambient.userData.babelOwned=true;lamps.add(ambient);for(const p of[[0,-9,0],[30,-5,-20],[-25,-17,20]]){const light=new T.PointLight(0xffcf88,55,100,1.7);light.position.set(...p);light.userData.babelOwned=true;lamps.add(light);}lamps.visible=false;
 const object=new T.Object3D();const globes=new T.InstancedMesh(own(new T.SphereGeometry(.18,8,6)),glow,lampPositions.length);lampPositions.forEach((p,i)=>{object.position.set(...p);object.updateMatrix();globes.setMatrixAt(i,object.matrix);});globes.instanceMatrix.needsUpdate=true;lamps.add(globes);for(const[m,items]of beamBatches){const inst=new T.InstancedMesh(unitBeam,m,items.length);items.forEach((b,i)=>{object.position.copy(b.p);object.quaternion.copy(b.q);object.scale.set(b.w,b.length,b.w);object.updateMatrix();inst.setMatrixAt(i,object.matrix);});inst.instanceMatrix.needsUpdate=true;inst.computeBoundingSphere?.();group.add(inst);}object.rotation.set(0,0,0);object.scale.set(1,1,1);let meshes=0;for(const[m,items]of batches){const inst=new T.InstancedMesh(m===stamp?unitStamp:unit,m,items.length);inst.name=m===pages?'Bound pages':'Batched library books and joinery';for(const[p,t]of items.entries()){object.position.set(t.x,t.y,t.z);object.rotation.set(t.pitch||0,t.yaw,0);object.scale.set(t.w,t.h,m===stamp?1:t.d);object.updateMatrix();inst.setMatrixAt(p,object.matrix);}inst.instanceMatrix.needsUpdate=true;inst.computeBoundingSphere?.();group.add(inst);meshes++;}
 function paint(lang){const c=BABEL_COPY[lang]||BABEL_COPY.en;for(const l of labels){const ctx=l.c.getContext('2d');ctx.fillStyle='#dbcaa4';ctx.fillRect(0,0,1024,192);ctx.fillStyle='#332d24';ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction=lang==='fa'?'rtl':'ltr';ctx.font='58px Tahoma';ctx.fillText(l.text==='entry'?c.title+' ↓':l.text,512,96,970);l.texture.needsUpdate=true;}}
 paint('en');group.visible=true;
 return{group,lamps,targets,bookCount,meshes,paint,thermal,dispose(){thermal.dispose();descent.dispose();group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
