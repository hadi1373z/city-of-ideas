import {PHILOSOPHERS,pickLanguage,quarterPaths} from './philosopher-data.js?v=night-garden-20261121';
import {ACADEMY,academyPolygon,academyHousePolygon,academyEntry,philosopherWorld,philosopherLocal,philosopherEntry} from './academy-layout.js?v=night-garden-20261121';

// One original academy: six real courtyard houses and one common, shaded court.
export function createPhilosopherQuarter(T,{language=()=> 'en',canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group();group.name='Academy of Questions · six inward-facing courtyard houses';const homes=[],targets=[],colliders=[],labels=[],owned=new Set();let disposed=false;
 const own=o=>(owned.add(o),o),white=0xd8cbb0,light=0xe8dfc9,terracotta=0xae7452,tile=0xbc8764,wood=0x70563d,ink=0x38534b;
 const material=own(new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide})),unit=own(new T.BoxGeometry(1,1,1)),cylinder=own(new T.CylinderGeometry(1,1,1,12)),stamp=new T.Object3D();
 function builder(parent,name){const points=[],colours=[];const add=(a,b,c,color)=>{if(new T.Vector3().subVectors(new T.Vector3(...b),new T.Vector3(...a)).cross(new T.Vector3().subVectors(new T.Vector3(...c),new T.Vector3(...a))).lengthSq()<1e-12)return;const col=new T.Color(color);for(const p of[a,b,c]){points.push(...p);colours.push(col.r,col.g,col.b);}},face=(p,c)=>{for(let i=1;i<p.length-1;i++)add(p[0],p[i],p[i+1],c);};
  function append(g,color){const p=g.attributes.position,index=g.index,col=new T.Color(color);for(let i=0;i<(index?.count??p.count);i++){const q=new T.Vector3().fromBufferAttribute(p,index?index.getX(i):i).applyMatrix4(stamp.matrix);points.push(q.x,q.y,q.z);colours.push(col.r,col.g,col.b);}}
  function box(w,h,d,x,y,z,c=white,yaw=0){stamp.position.set(x,y,z);stamp.rotation.set(0,yaw,0);stamp.scale.set(w,h,d);stamp.updateMatrix();append(unit,c);}
  function post(x,z,r=.24,h=3.65,y=.13,c=white){stamp.position.set(x,y+h/2,z);stamp.rotation.set(0,0,0);stamp.scale.set(r,h,r);stamp.updateMatrix();append(cylinder,c);box(r*3,.18,r*3,x,y+.09,z,light);box(r*2.8,.22,r*2.8,x,y+h-.05,z,light);}
  function rod(a,b,r=.045,c=wood){const aa=new T.Vector3(...a),bb=new T.Vector3(...b),d=bb.clone().sub(aa);stamp.position.copy(aa).add(bb).multiplyScalar(.5);stamp.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize());stamp.scale.set(r,d.length(),r);stamp.updateMatrix();append(cylinder,c);}
  function roof(poly0,poly1,y0,y1,c=terracotta){for(let i=0;i<6;i++){const j=(i+1)%6,p=[[poly0[i][0],y0,poly0[i][1]],[poly0[j][0],y0,poly0[j][1]],[poly1[j][0],y1,poly1[j][1]],[poly1[i][0],y1,poly1[i][1]]];face(p,c);face([...p].reverse().map(v=>[v[0],v[1]-.14,v[2]]),light);for(let k=0;k<4;k++)face([p[k],p[(k+1)%4],[p[(k+1)%4][0],p[(k+1)%4][1]-.14,p[(k+1)%4][2]],[p[k][0],p[k][1]-.14,p[k][2]]],c);}}
  function finish(){const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('color',new T.Float32BufferAttribute(colours,3));g.computeVertexNormals();const mesh=new T.Mesh(g,material);mesh.name=name;mesh.userData.philosopherArchitecture=true;parent.add(mesh);return mesh;}
  return{face,box,post,rod,roof,finish};
 }
 function label(parent,text,x,y,z,width=5,yaw=0,home=null,section='intro',height=.8){const c=canvas();c.width=1024;c.height=192;const tx=own(new T.CanvasTexture(c));tx.colorSpace=T.SRGBColorSpace;const mat=own(new T.MeshBasicMaterial({map:tx,side:T.DoubleSide})),g=own(new T.PlaneGeometry(width,height)),mesh=new T.Mesh(g,mat);mesh.position.set(x,y,z);mesh.rotation.y=yaw;parent.add(mesh);labels.push({c,tx,text});if(home){mesh.userData={philosopherId:home.id,philosopherSection:section};targets.push(mesh);}return mesh;}
 const hex=r=>Array.from({length:6},(_,i)=>[r*Math.cos(i*Math.PI/3),r*Math.sin(i*Math.PI/3)]);
 function localBlock(h,x,z,w,d){colliders.push({homeId:h.id,x,z,w,d});}
 for(const h of PHILOSOPHERS){const root=new T.Group();root.name=h.id+' · courtyard house';root.position.set(h.x,0,h.z);root.rotation.y=h.turn;root.userData.cityDestination='philosopher:'+h.id;group.add(root);const b=builder(root,h.id+' · Greek courtyard structure'),poly=hex(14),wallTop=3.75;
  b.face([...hex(14.2)].reverse().map(([x,z])=>[x,.13,z]),light);b.face(hex(14.2).map(([x,z])=>[x,-.05,z]),white);
  function wall(a,c){const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.box(len,3.6,.28,(a[0]+c[0])/2,1.93,(a[1]+c[1])/2,white,-Math.atan2(dz,dx));colliders.push({homeId:h.id,a,b:c});}
  for(let i=0;i<6;i++){const a=poly[i],c=poly[(i+1)%6],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),yaw=-Math.atan2(dz,dx);if(i===1){wall(a,[1.65,a[1]]);wall([-1.65,a[1]],c);b.box(3.3,.48,.32,0,3.51,a[1],white);}else wall(a,c);
   for(const[y,hh,depth,color]of[[.28,.28,.45,0xb7ab90],[3.64,.16,.45,h.color],[3.84,.16,.57,light]]){if(i===1){for(const side of[-1,1])b.box((len-3.5)/2,hh,depth,side*(len+3.5)/4,y,a[1],color);}else b.box(len+.1,hh,depth,(a[0]+c[0])/2,y,(a[1]+c[1])/2,color,yaw);}
   // The meander is original, shallow masonry relief, with no copied artwork.
   for(let k=1;k<len-1;k+=1.25){const px=a[0]+dx*k/len,pz=a[1]+dz*k/len,nx=dz/len,nz=-dx/len;if(i===1&&Math.abs(px)<2.4)continue;b.box(.6,.07,.045,px+nx*.17,3.23,pz+nz*.17,h.color,yaw);}
  }
  b.roof(hex(14.5),hex(10.2),4.04,5.35);b.roof(hex(10.2),hex(6.45),5.35,3.95);
  for(let radius=6.8;radius<14.45;radius+=.55){const yy=radius<10.2?3.95+(radius-6.45)/3.75*1.4:5.35-(radius-10.2)/4.3*1.31,p=hex(radius);for(let i=0;i<6;i++)b.rod([p[i][0],yy+.025,p[i][1]],[p[(i+1)%6][0],yy+.025,p[(i+1)%6][1]],.027,tile);}
  for(let i=0;i<6;i++){const a=i*Math.PI/3,x=7.25*Math.cos(a),z=7.25*Math.sin(a);b.post(x,z,.24,3.72);localBlock(h,x,z,.85,.85);const n=(i+1)*Math.PI/3;b.rod([x,3.8,z],[7.25*Math.cos(n),3.8,7.25*Math.sin(n)],.13,wood);}
  // A front porch links the real three-metre doorway to the common stoa.
  b.box(4.4,.14,3.3,0,.06,13.6,0xc8bda3);for(const x of[-2.05,2.05]){b.post(x,14.3,.22,3.58);localBlock(h,x,14.3,.8,.8);}b.box(4.65,.25,.5,0,3.84,14.3,light);
  b.face([[-2.5,4.02,12],[0,4.9,12],[0,4.9,15.0],[-2.5,4.02,15.0]],terracotta);b.face([[0,4.9,12],[2.5,4.02,12],[2.5,4.02,15],[0,4.9,15]],terracotta);b.face([[-2.5,4.02,15],[2.5,4.02,15],[0,4.9,15]],light);
  label(root,()=>pickLanguage(h.name,language()),0,3.42,14.57,4.1,0,h,'intro',.5);
  label(root,()=>pickLanguage(h.home,language()),0,2.95,12.34,4.1,0,null,'intro',.42);
  // Keep source learning and note IDs; the reading desk clears the peristyle.
  b.box(4,.18,1.8,4.5,1.2,-8.5,wood);for(const x of[2.9,6.1])b.box(.15,1.1,1.4,x,.63,-8.5,wood);localBlock(h,4.5,-8.5,4,1.8);
  const book=new T.Mesh(own(new T.BoxGeometry(1.15,.14,.85)),own(new T.MeshLambertMaterial({color:h.color})));book.position.set(3.9,1.36,-8.4);book.userData={philosopherId:h.id,philosopherSection:'reading',label:h.reading[1]};root.add(book);targets.push(book);b.box(1.05,.06,.76,3.9,1.45,-8.4,light);label(root,()=>pickLanguage(h.name,language())+' · '+(language()==='fa'?'خواندن و اندیشیدن':language()==='de'?'LESEN & NACHDENKEN':'READ & REFLECT'),4.5,2.2,-9.6,5,0,h,'reading',.6);
  for(let shelf=0;shelf<3;shelf++){b.box(4,.13,.6,-5,1+shelf*.65,-10.45,wood);for(let j=0;j<8;j++)b.box(.25,.4+(j%3)*.06,.38,-6.5+j*.43,1.27+shelf*.65,-10.4,[h.color,terracotta,ink][j%3]);}localBlock(h,-5,-10.45,4,.8);
  b.box(2.7,.55,2.4,-5,.405,-2,0xc1b69b);localBlock(h,-5,-2,2.7,2.4);
  const idea=new T.Group();idea.position.set(-5,1.1,-2);idea.userData={philosopherId:h.id,philosopherSection:'idea'};root.add(idea);targets.push(idea);const ideaMat=own(new T.MeshLambertMaterial({color:0xb89e62}));
  if(h.id==='aristotle'){const q=builder(idea,'Aristotle · balance of choice');q.post(0,0,.06,1,0,0xb89e62);q.box(2,.07,.1,0,1,0,0xb89e62);for(const x of[-.8,.8]){q.rod([x,1,0],[x,.5,0],.02,0xb89e62);q.box(.5,.06,.5,x,.5,0,0xb89e62);}q.finish();}
  else{const ring=own(new T.TorusGeometry(h.id==='epicurus'?.65:.9,.055,6,48)),a=new T.Mesh(ring,ideaMat);a.position.y=.8;idea.add(a);if(h.id==='hypatia'){for(const turn of[.8,-.8]){const c=a.clone();c.rotation.set(turn*.6,turn,0);idea.add(c);}}if(h.id==='confucius'){const q=builder(idea,'Confucius · two seats');q.box(.6,.1,.6,-.6,.3,0,wood);q.box(.6,.1,.6,.6,.3,0,wood);q.box(.6,.65,.1,-.6,.65,-.3,h.color);q.box(.6,.65,.1,.6,.65,-.3,h.color);q.finish();}}
  label(root,()=>pickLanguage(h.object,language()),-5,2.5,-3,4.3,0,h,'idea',.6);
  // Two quiet seats occupy a roofed side, outside the central approach.
  for(const zz of[2.3,6.3]){b.box(2.6,.48,1,9,.37,zz,white);b.box(2.6,.08,1,9,.65,zz,h.color);localBlock(h,9,zz,2.6,1);}
  b.finish();root.userData.architecture={style:'hexagonal-courtyard',roof:true,openSky:true,drawMeshes:1};const study={...philosopherWorld(h,0,-4),y:.13,yaw:h.turn};homes.push({...h,group:root,entry:philosopherEntry(h),study,polygon:academyHousePolygon(h),bounds:{minX:h.x-15,maxX:h.x+15,minZ:h.z-15,maxZ:h.z+15}});
 }
 const common=builder(group,'Academy · common court and six shaded stoas'),outer=academyPolygon(30.6),inner=academyPolygon(23),peak=academyPolygon(26.8);
 common.face([...academyPolygon(30.8)].reverse().map(([x,z])=>[x,.125,z]),0xcac2aa);
 // Quiet geometric paving and six real paths, rather than the retired row roads.
 for(let ring=1;ring<=5;ring++){const p=academyPolygon(ring*4.4);for(let i=0;i<6;i++)common.rod([p[i][0],.136,p[i][1]],[p[(i+1)%6][0],.136,p[(i+1)%6][1]],.015,0xb49d6a);}
 common.roof(outer,peak,4.3,5.2);common.roof(peak,inner,5.2,4.3);
 const seen=new Set();for(const p of[outer,inner])for(let edge=0;edge<6;edge++){const a=p[edge],b=p[(edge+1)%6];for(const t of[0,.2,.4,.6,.8]){const x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,key=x.toFixed(3)+','+z.toFixed(3);if(seen.has(key))continue;seen.add(key);const ux=-.5,uz=Math.sqrt(3)/2,along=(x-ACADEMY.x)*ux+z*uz,across=(x-ACADEMY.x)*uz-z*ux;if(along>16&&Math.abs(across)<2.6)continue;common.post(x,z,.22,3.95);colliders.push({x,z,r:.48});}common.rod([a[0],4.12,a[1]],[b[0],4.12,b[1]],.16,wood);}
 for(let i=0;i<6;i++){const a=Math.PI/12+i*Math.PI/3,x=ACADEMY.x+17.4*Math.cos(a),z=17.4*Math.sin(a),yaw=Math.PI/2-a;common.box(4,.46,1,x,.36,z,white,yaw);common.box(4,.1,1,x,.64,z,0x7a8d77,yaw);colliders.push({x,z,w:4.5,d:1.5,turn:yaw});}
 // The main gateway lies between houses, with a clear path under its entablature.
 const entry=academyEntry(),gateX=ACADEMY.x-32,gateZ=64*Math.sqrt(3)/2,yaw=-Math.PI/6;
 for(const x of[-3.2,3.2]){const px=gateX+x*Math.cos(yaw),pz=gateZ-x*Math.sin(yaw);common.post(px,pz,.32,4.25);colliders.push({x:px,z:pz,r:.62});}common.box(7.6,.42,.8,gateX,4.43,gateZ,light,yaw);
 const gatePoint=(u,v,y)=>[gateX+u*Math.cos(yaw)+v*Math.sin(yaw),y,gateZ-u*Math.sin(yaw)+v*Math.cos(yaw)];common.face([gatePoint(-4,-1.5,4.65),gatePoint(0,-1.5,5.85),gatePoint(0,1.5,5.85),gatePoint(-4,1.5,4.65)],terracotta);common.face([gatePoint(0,-1.5,5.85),gatePoint(4,-1.5,4.65),gatePoint(4,1.5,4.65),gatePoint(0,1.5,5.85)],terracotta);for(const v of[-1.5,1.5])common.face([gatePoint(-4,v,4.65),gatePoint(4,v,4.65),gatePoint(0,v,5.85)],light);
 const gateLabel=gatePoint(0,.47,4.43);label(group,()=>language()==='fa'?'آکادمیِ پرسش‌ها':language()==='de'?'AKADEMIE DER FRAGEN':'ACADEMY OF QUESTIONS',gateLabel[0],gateLabel[1],gateLabel[2],6.5,yaw,null,'intro',.45);common.finish();
 function canStand(x,z){if(!Number.isFinite(x)||!Number.isFinite(z))return false;return!colliders.some(c=>{let p;if(c.homeId){const h=PHILOSOPHERS.find(h=>h.id===c.homeId);p=philosopherLocal(h,x,z);}else{const dx=x-c.x,dz=z-c.z;p={x:dx*Math.cos(c.turn||0)-dz*Math.sin(c.turn||0),z:dx*Math.sin(c.turn||0)+dz*Math.cos(c.turn||0)};}if(c.a){const dx=c.b[0]-c.a[0],dz=c.b[1]-c.a[1],t=Math.max(0,Math.min(1,((p.x-c.a[0])*dx+(p.z-c.a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(p.x-c.a[0]-dx*t,p.z-c.a[1]-dz*t)<.38;}if(c.r)return Math.hypot(p.x,p.z)<c.r;return Math.abs(p.x-(c.homeId?c.x:0))<c.w/2+.24&&Math.abs(p.z-(c.homeId?c.z:0))<c.d/2+.24;});}
 function inside(h,x,z){const p=philosopherLocal(h,x,z);return hex(14).every((a,i)=>{const b=hex(14)[(i+1)%6];return(b[0]-a[0])*(p.z-a[1])-(b[1]-a[1])*(p.x-a[0])>=0;});}
 function region(x,z){const h=homes.find(h=>inside(h,x,z));if(h)return{id:'philosophers',philosopherId:h.id,title:pickLanguage(h.name,language())+' · '+pickLanguage(h.home,language()),inside:true};if(Math.hypot(x-ACADEMY.x,z)<70)return{id:'philosophers',title:language()==='fa'?'آکادمی پرسش‌ها':'Academy of Questions',inside:false};return null;}
 function entryFor(id){return id==='philosophers'?academyEntry():homes.find(h=>'philosopher:'+h.id===id)?.entry||null;}
 function refreshLanguage(){for(const l of labels){const c=l.c.getContext('2d');c.fillStyle='#f1e7d0';c.fillRect(0,0,1024,192);c.fillStyle='#29483f';c.textAlign='center';c.textBaseline='middle';c.font='46px Tahoma';c.direction=language()==='fa'?'rtl':'ltr';c.fillText(l.text(),512,98,980);l.tx.needsUpdate=true;}}
 function drawMap(ctx,{s,cx,cz}){ctx.fillStyle='#dbcda8';for(const h of homes){ctx.beginPath();h.polygon.forEach(([x,z],i)=>ctx[i?'lineTo':'moveTo'](cx+x*s,cz+z*s));ctx.closePath();ctx.fill();}}
 function dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}
 refreshLanguage();return{group,homes,targets,colliders,canStand,region,entryFor,refreshLanguage,drawMap,dispose};
}
