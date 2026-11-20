import {DESCENT} from './escher-descent-model.js?v=cloister-20261120';
import {roomCeilingAt,ESCHER_DEPTH as D,ESCHER_DEPTH_WALLS as WALLS,ESCHER_DEPTH_OBSTACLES as CASES,DEPTH_TRIANGLE,DEPTH_VIEW,tilePolygon,loopResult,hexagon,ringPolygons,outsidePolygonRectangle} from './escher-depth-model.js?v=cloister-details-20261120';

export function buildEscherDepth(T,{canvas=()=>document.createElement('canvas'),loadTexture=typeof globalThis.document?.createElementNS==='function'?url=>new T.TextureLoader().load(url):null}={}){
 const group=new T.Group();group.name='Escher · hexagonal cloister';group.userData.escherDepth=true;
 const interior=new T.Group(),surface=new T.Group(),lamps=new T.Group();interior.name='Escher underground rooms';surface.name='Three doors to one interior';group.add(interior,surface);interior.add(lamps);lamps.visible=false;
 const owned=new Set(),targets=[],own=o=>(owned.add(o),o),mat=(color,extra={})=>own(new T.MeshLambertMaterial({color,side:T.DoubleSide,...extra}));
 const floor=mat(0xd2cbb3),stone=mat(0xd0c4aa),roof=mat(0xafa187),ink=mat(0x263b3d),timber=mat(0x3c5149),sage=mat(0x71867c),brass=mat(0xb39a58),paper=mat(0xe3dfc7),tileInk=mat(0x304d50),ochre=mat(0xb7a378),red=mat(0xb45f4d),glow=own(new T.MeshBasicMaterial({color:0xffe2b9}));
 const unit=own(new T.BoxGeometry(1,1,1)),batches=new Map(),surfaces=new Map(),obj=new T.Object3D();
 function box(w,h,d,x,y,z,m=stone,parent=interior,yaw=0){let byParent=batches.get(parent);if(!byParent)batches.set(parent,byParent=new Map());if(!byParent.has(m))byParent.set(m,[]);byParent.get(m).push({w,h,d,x,y,z,yaw});}
 function face(poly,m){if(poly.length<3)return;let points=surfaces.get(m);if(!points)surfaces.set(m,points=[]);for(let i=1;i<poly.length-1;i++)for(const p of[poly[0],poly[i],poly[i+1]])points.push(p[0],p[2],p[1]);}
 function slab(poly,y,thickness=.35,m=floor){face(poly.map(p=>[...p,y]),m);face([...poly].reverse().map(p=>[...p,y-thickness]),m);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];face([[...a,y],[...b,y],[...b,y-thickness],[...a,y-thickness]],m);}}
 function cutPieces(poly,cuts){let ps=[poly];for(const cut of cuts)ps=ps.flatMap(p=>outsidePolygonRectangle(p,cut));return ps;}
 function label(text,x,y,z,width=7,height=.9,parent=interior,yaw=0){
  const c=canvas();c.width=1536;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#e6e0c8';ctx.fillRect(0,0,c.width,c.height);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#273f41';ctx.font='bold 72px Georgia';ctx.fillText(text,768,134,1460);
  const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(own(new T.PlaneGeometry(width,height)),own(new T.MeshBasicMaterial({map:texture,side:T.FrontSide,toneMapped:false})));mesh.position.set(x,y,z);mesh.rotation.y=yaw;parent.add(mesh);return mesh;
 }
 // Every floor, balcony and stair opening is cut from the shared navigation plan.
 for(const r of [...D.rooms,...D.galleries]){
  const ps=r.inner?ringPolygons(r):[r.polygon],cuts=[...(!r.shaftLanding?[DESCENT.shaft]:[]),...D.stairs.filter(s=>s.top===r.y)];
  for(const p of ps)for(const q of cutPieces(p,cuts))slab(q,r.y);
  if(r.corridor&&r.y===D.floor){for(const q of cutPieces(r.polygon,[DESCENT.shaft]))slab(q,r.ceiling,.28,roof);}
 }
 // Deep opaque basin closes the lower cloister well; no sky is visible below it.
 const lower=D.rooms.find(r=>r.id==='loop'),well=hexagon(...lower.centre,lower.inner);slab(well,-50,.4,ink);
 for(let i=0;i<6;i++){const a=well[i],b=well[(i+1)%6];face([[...a,-46],[...b,-46],[...b,-50],[...a,-50]],stone);}
 for(const b of WALLS){const [a,c]=[b.a,b.b],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),yaw=-Math.atan2(dz,dx),x=(a[0]+c[0])/2,z=(a[1]+c[1])/2;
  box(len,b.height,.38,x,b.y+b.height/2,z,stone,interior,yaw);box(len,.18,.48,x,b.y+.12,z,timber,interior,yaw);box(len,.22,.56,x,b.y+b.height-.12,z,sage,interior,yaw);
  if(b.decorative&&len>3){const bays=Math.max(1,Math.round(len/5));for(let i=0;i<bays;i++){const t=(i+.5)/bays-.5,bx=x+dx*t-dz/len*.23,bz=z+dz*t+dx/len*.23,w=len/bays-.7;for(const h of b.height>9?[3,8]:[3]){box(w,2.7,.09,bx,b.y+h,bz,ink,interior,yaw);box(w+.12,.09,.12,bx,b.y+h-1.4,bz,brass,interior,yaw);for(const sign of[-1,1])box(.09,2.95,.12,bx+dx/len*sign*(w/2+.08),b.y+h,bz+dz/len*sign*(w/2+.08),sage,interior,yaw);}}}
 }
 // Six curved roof sectors form an opaque vault, with bronze radial ribs.
 const rodsByMat=new Map();function rod(a,b,r=.04,m=brass){let list=rodsByMat.get(m);if(!list)rodsByMat.set(m,list=[]);list.push({a,b,r});}
 for(const r of D.rooms.filter(r=>r.radius)){
  const [cx,cz]=r.centre,rise=r.ceiling-r.spring,levels=12,segments=8;
  const point=(edge,t,f)=>{const a=r.polygon[edge],b=r.polygon[(edge+1)%6];return[cx+((a[0]+(b[0]-a[0])*t)-cx)*f,cz+((a[1]+(b[1]-a[1])*t)-cz)*f,r.spring+rise*(1-f*f)];};
  for(let edge=0;edge<6;edge++)for(let j=0;j<levels;j++)for(let k=0;k<segments;k++){
   const a=point(edge,k/segments,j/levels),b=point(edge,(k+1)/segments,j/levels),c=point(edge,(k+1)/segments,(j+1)/levels),d=point(edge,k/segments,(j+1)/levels);
   for(const tri of[[a,b,c],[a,c,d]])for(const q of cutPieces(tri,[DESCENT.shaft]))face(q,roof);
  }
  for(let edge=0;edge<6;edge++)for(const t of[0,.5]){let previous=point(edge,t,0);for(let j=1;j<=levels;j++){const next=point(edge,t,j/levels);if(!([previous,next].some(p=>p[0]>DESCENT.shaft.minX-.1&&p[0]<DESCENT.shaft.maxX+.1&&p[1]>DESCENT.shaft.minZ-.1&&p[1]<DESCENT.shaft.maxZ+.1)))rod([previous[0],previous[2]-.05,previous[1]],[next[0],next[2]-.05,next[1]],.055);previous=next;}}
 }
 // Repeated arched bays, real upper galleries and slender balustrades make the
 // two storeys legible. All piers are repeated instances of one owned arch mesh.
 const archShape=new T.Shape();archShape.moveTo(-.5,0);archShape.lineTo(-.5,5.6);archShape.lineTo(.5,5.6);archShape.lineTo(.5,0);archShape.lineTo(.44,0);archShape.lineTo(.44,2.65);for(let i=0;i<=32;i++){const a=i*Math.PI/32;archShape.lineTo(.44*Math.cos(a),2.65+2.4*Math.sin(a));}archShape.lineTo(-.44,0);archShape.closePath();
 const archGeo=own(new T.ExtrudeGeometry(archShape,{depth:.32,bevelEnabled:false,curveSegments:24})),arches=[];
 function railRing(r,y,cut=null){const poly=hexagon(...r.centre,r.inner??r.radius-1);for(let edge=0;edge<6;edge++){const a=poly[edge],b=poly[(edge+1)%6],len=Math.hypot(b[0]-a[0],b[1]-a[1]),steps=Math.ceil(len/1.6);for(let j=0;j<steps;j++){const t=j/steps,u=(j+1)/steps,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,xx=a[0]+(b[0]-a[0])*u,zz=a[1]+(b[1]-a[1])*u;if(cut&&(x>cut.minX-.25&&x<cut.maxX+.25&&z>cut.minZ-.25&&z<cut.maxZ+.25||xx>cut.minX-.25&&xx<cut.maxX+.25&&zz>cut.minZ-.25&&zz<cut.maxZ+.25))continue;rod([x,y+1.1,z],[xx,y+1.1,zz],.055);rod([x,y+.5,z],[xx,y+.5,zz],.025);rod([x,y,z],[x,y+1.1,z],.035);}}}
 for(const r of D.galleries.filter(r=>r.inner)){const poly=hexagon(...r.centre,r.inner);for(let edge=0;edge<6;edge++){const a=poly[edge],b=poly[(edge+1)%6],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);for(let j=0;j<3;j++){const t=(j+.5)/3,x=a[0]+dx*t,z=a[1]+dz*t;for(const y of[-40,-34])arches.push({x,y,z,w:len/3,yaw:-Math.atan2(dz,dx),sy:y===-34?Math.min(.95,(roomCeilingAt(D.rooms.find(q=>q.id===r.room),x,z)-y-.08)/5.6):1});}}
  railRing(r,-34,r.room==='hall'?D.stairs[1]:null);
 }
 railRing({...lower,inner:12},-46);
 // Main floor inlays follow sixfold geometry without covering the stair voids.
 // A finite sixfold rosette is laid in stone, rather than a reflective floor or
 // an unbounded texture. Clip every facet around the central plinth and stairs.
 for(let band=0;band<4;band++){const inner=hexagon(197,115,band*4),outer=hexagon(197,115,(band+1)*4);for(let side=0;side<6;side++){const next=(side+1)%6,a=inner[side],b=outer[side],c=outer[next],d=inner[next];for(const[poly,m]of[[[a,b,c],(band+side)%2?sage:paper],[[a,c,d],(band+side)%2?paper:ochre]])for(const q of cutPieces(poly,[{minX:194.9,maxX:199.1,minZ:112.9,maxZ:117.1},...D.stairs]))face(q.map(p=>[...p,-39.992]),m);}}
 for(const r of D.rooms.filter(r=>r.radius)){for(const rad of[r.radius-.8,r.radius-2]){const poly=hexagon(...r.centre,rad);for(let i=0;i<6;i++){const a=poly[i],b=poly[(i+1)%6],steps=16;for(let j=0;j<steps;j++){const t=j/steps,u=(j+1)/steps,p=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],q=[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u];if(D.stairs.some(s=>p[0]>s.minX-.2&&p[0]<s.maxX+.2&&p[1]>s.minZ-.2&&p[1]<s.maxZ+.2))continue;rod([p[0],r.y+.014,p[1]],[q[0],r.y+.014,q[1]],.025);}}}}
 group.userData.museumStairGuards=[];
 for(const s of D.stairs){const run=(s.maxZ-s.minZ)/s.steps,cx=(s.minX+s.maxX)/2,guard={id:s.id,paths:[],posts:[]};group.userData.museumStairGuards.push(guard);
  const guardRail=points=>{guard.paths.push(points);for(let i=1;i<points.length;i++)rod(points[i-1],points[i],.055);},post=(x,z,base,top)=>{guard.posts.push({x,z,base,top});rod([x,base,z],[x,top,z],.035);};
  for(let i=0;i<s.steps;i++){const z=s.minZ+(i+.5)*run,y=s.top+(i+1)*(s.bottom-s.top)/s.steps;box(s.maxX-s.minX,.18,run+.012,cx,y-.09,z,floor);if(i%3===0)for(const x of[s.minX+.1,s.maxX-.1])post(x,z,y,s.top+(s.bottom-s.top)*(i+.5)/s.steps+1.1);}
  for(const x of[s.minX+.1,s.maxX-.1]){
   // Flat landing returns meet the sloping guard at exact shared endpoints.
   // Posts touch its actual interpolated height, rather than stopping below it.
   guardRail([[x,s.top+.92,s.minZ-.7],[x,s.top+1.1,s.minZ-.7],[x,s.top+1.1,s.minZ],[x,s.bottom+1.1,s.maxZ],[x,s.bottom+1.1,s.maxZ+.7],[x,s.bottom+.92,s.maxZ+.7]]);
   rod([x,s.top+.5,s.minZ-.7],[x,s.top+.5,s.minZ],.025);rod([x,s.top+.5,s.minZ],[x,s.bottom+.5,s.maxZ],.025);rod([x,s.bottom+.5,s.maxZ],[x,s.bottom+.5,s.maxZ+.7],.025);
   for(const[z,y]of[[s.minZ-.7,s.top],[s.minZ,s.top],[s.maxZ,s.bottom],[s.maxZ+.7,s.bottom]])post(x,z,y,y+1.1);
  }
  // Enclosed tall stairwell roof stays above both landings.
  box(s.maxX-s.minX+.5,.3,s.maxZ-s.minZ,cx,s.ceiling+.15,(s.minZ+s.maxZ)/2,roof);
  if(s.id==='stair'){
   for(const x of[s.minX-.14,s.maxX+.14])box(.28,17,s.maxZ-s.minZ,x,-37.5,(s.minZ+s.maxZ)/2,stone);
   // The tall connecting enclosure must close ABOVE both real doorways as
   // well as along its sides. Otherwise an upper-balcony view sees out over
   // the lower cloister vault through the open end of the stair box.
   for(const[z,bottom]of[[s.minZ,s.top+2.65],[s.maxZ,s.bottom+4.65]]){const top=s.ceiling+.30;box(s.maxX-s.minX+.56,top-bottom,.28,cx,(top+bottom)/2,z,stone);}
  }
 }
 // Gold vertical focal sculpture: nested open octahedra around a slender spine.
 box(4,.35,4,197,-39.825,115,ink);rod([197,-39.65,115],[197,-29.2,115],.055);
 for(let i=0;i<12;i++){const a=i*Math.PI/6,x=197+1.35*Math.cos(a),z=115+1.35*Math.sin(a);rod([x,-39.6,z],[x,-28.8,z],.035);}
 for(let j=0;j<=6;j++)for(let i=0;i<12;i++){const a=i*Math.PI/6,b=(i+1)*Math.PI/6,y=-39.4+j*1.65;rod([197+1.4*Math.cos(a),y,115+1.4*Math.sin(a)],[197+1.4*Math.cos(b),y,115+1.4*Math.sin(b)],.04);}
 for(let j=0;j<4;j++){const y=-38.4+j*2.25,r=1.8-j*.25,vs=[[197+r,y,115],[197,y,115+r],[197-r,y,115],[197,y,115-r]],top=[197,y+1.6,115],bottom=[197,y-1.1,115];for(let i=0;i<4;i++){rod(vs[i],vs[(i+1)%4],.04);rod(vs[i],top,.04);rod(vs[i],bottom,.04);}}
 // Credited original prints are retained, framed on actual vertical wing walls.
 if(loadTexture){const prints=[{file:'relativity.jpg',title:'Relativity',year:1953,ratio:500/479,x:142.25,z:120,yaw:Math.PI/2},{file:'drawing-hands.jpg',title:'Drawing Hands',year:1948,ratio:500/448,x:231.97,z:149.1,yaw:-Math.PI/2},{file:'ascending-descending.jpg',title:'Ascending and Descending',year:1960,ratio:500/595,x:179.03,z:166,yaw:Math.PI/2}];for(const p of prints){const h=3.4,w=h*p.ratio,y=p.title==='Ascending and Descending'?-43.35:-37.1,dx=Math.sin(p.yaw),dz=Math.cos(p.yaw);box(w+.3,h+.3,.12,p.x-dx*.09,y,p.z-dz*.09,timber,interior,p.yaw);const texture=own(loadTexture(new URL('./assets/escher/'+p.file,import.meta.url).href));texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=2;const picture=new T.Mesh(own(new T.PlaneGeometry(w,h)),own(new T.MeshBasicMaterial({map:texture,toneMapped:false})));picture.position.set(p.x,y,p.z);picture.rotation.y=p.yaw;picture.name='M. C. Escher · '+p.title;picture.userData={escherPrint:p.title,source:'https://mcescher.com/gallery/most-popular/',credit:'© The M. C. Escher Company B.V. All rights reserved.'};interior.add(picture);label('M. C. Escher · '+p.title+' · '+p.year,p.x+dx*.01,y-h/2-.25,p.z+dz*.01,w+.3,.20,interior,p.yaw);label('© The M. C. Escher Company B.V. · mcescher.com',p.x+dx*.01,y-h/2-.47,p.z+dz*.01,w+.3,.13,interior,p.yaw);}}
 for(const b of CASES.filter(b=>['triangle case','tile console','loop table','reading desk'].includes(b.id))){box(b.maxX-b.minX,.42,b.maxZ-b.minZ,(b.minX+b.maxX)/2,b.y+.21,(b.minZ+b.maxZ)/2,ink);}
 box(16.2,8.4,.3,216.69,-35.8,69.87,ink);
 for(const[a,b]of DEPTH_TRIANGLE)rod([a.x,a.y,a.z],[b.x,b.y,b.z],.105);
 for(const dx of[-3.5,0,3.5]){box(.9,.025,.9,DEPTH_VIEW.x+dx,-39.98,DEPTH_VIEW.z,brass);box(.55,.03,.55,DEPTH_VIEW.x+dx,-39.96,DEPTH_VIEW.z,ink);}
 // Original topology sculptures are parametric meshes, not claimed Escher works.
 const mobiusPositions=[],mobiusIndices=[],cx=224,cz=155;for(let i=0;i<=96;i++){const u=i/96*Math.PI*2;for(const v of[-.65,.65])mobiusPositions.push(cx+(2.2+v*Math.cos(u/2))*Math.cos(u),-37.8+v*Math.sin(u/2),cz+(2.2+v*Math.cos(u/2))*Math.sin(u));if(i<96){const n=i*2;mobiusIndices.push(n,n+1,n+2,n+1,n+3,n+2);}}
 const mg=own(new T.BufferGeometry());mg.setAttribute('position',new T.Float32BufferAttribute(mobiusPositions,3));mg.setIndex(mobiusIndices);mg.computeVertexNormals();const mm=new T.Mesh(mg,brass);mm.name='Original Möbius band · topology wing';interior.add(mm);box(5,.35,5,cx,-39.825,cz,ink);
 const knot=new T.Mesh(own(new T.TorusKnotGeometry(1.4,.14,128,8,2,3)),sage);knot.position.set(211,-37.7,152);knot.name='Original trefoil · topology wing';interior.add(knot);box(4,.35,4,211,-39.825,152,ink);
 label('CENTRAL GALLERY',138,-35.3,112.22,5,.6);
 label('PERSPECTIVE',157.63,-33.1,99.8,10,.7);
 label('TESSELLATION',216.69,-33.1,65.8,11,.7);
 label('TOPOLOGY · RELATIONS',216.69,-33.1,136.6,12,.7);
 label('LOWER CLOISTER · CAN EVERY FLIGHT RISE?',197,-41.4,184.2,16,.8,interior,Math.PI);
 for(const p of D.exhibits){const sign=label(p.name.toUpperCase(),p.x,p.y+2.8,p.z-2.2,p.id==='perspective'?11:9,.55);sign.userData.escherDepthExhibit=p.id;targets.push(sign);}
 for(const p of D.portals){const w=p.id==='escher'?2.4:3.3,h=p.id==='escher'?3.5:4.4;for(const sign of[-1,1])box(.22,h,.38,p.x+sign*w/2,p.y+h/2,p.z,stone,surface);box(w+.2,.25,.38,p.x,p.y+h,p.z,stone,surface);if(p.id!=='escher')box(w-.28,h-.1,.08,p.x,p.y+h/2,p.z,ink,surface);const door=new T.Mesh(own(new T.PlaneGeometry(w-.28,h-.1)),ink);door.position.set(p.x,p.y+h/2,p.z+.055);if(p.id==='escher')door.visible=false;door.userData.escherDepthDoor=p.id;surface.add(door);targets.push(door);label('ESCHER · BELOW',p.x,p.y+h+.45,p.z+.23,w+1,.5,surface);if(p.id!=='escher'){const q=p.landing;box(2.4,.025,1.7,q.x,-39.98,q.z,brass);label(p.name+' ↑',q.x,-37.2,q.z-.9,6,.55);}}
 const ambient=new T.AmbientLight(0xdce7df,.85);ambient.userData.escherDepthOwned=true;lamps.add(ambient);
 for(const r of D.rooms.filter(r=>r.radius)){const[x,z]=r.centre,y=r.y+7;const light=new T.PointLight(0xffe2b5,r.id==='hall'?100:65,r.radius*2.6,1.4);light.position.set(x,y,z);light.userData.escherDepthOwned=true;lamps.add(light);for(const a of[0,2,4]){const p=r.polygon[a],lx=x+(p[0]-x)*.7,lz=z+(p[1]-z)*.7;box(.5,.5,.5,lx,r.y+4.5,lz,glow);}}
 // Flush polygon faces are merged by material; masonry and rails are instanced.
 for(const[m,points]of surfaces){const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.computeVertexNormals();const mesh=new T.Mesh(g,m);mesh.name='Cloister · continuous polygon floors / vault';interior.add(mesh);}
 const ag=new T.InstancedMesh(archGeo,stone,arches.length);arches.forEach((p,i)=>{obj.position.set(p.x,p.y,p.z);obj.rotation.set(0,p.yaw,0);obj.scale.set(p.w,p.sy,1);obj.updateMatrix();ag.setMatrixAt(i,obj.matrix);});ag.instanceMatrix.needsUpdate=true;ag.computeBoundingSphere();ag.name='Two-storey hexagonal vaulted arcades';interior.add(ag);
 const cylinder=own(new T.CylinderGeometry(1,1,1,6));for(const[m,rs]of rodsByMat){const mesh=new T.InstancedMesh(cylinder,m,rs.length);rs.forEach((p,i)=>{const a=new T.Vector3(...p.a),b=new T.Vector3(...p.b),d=b.clone().sub(a);obj.position.copy(a.add(b).multiplyScalar(.5));obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize());obj.scale.set(p.r,d.length(),p.r);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.name='Cloister · bronze ribs and balustrades';interior.add(mesh);}
 obj.quaternion.identity();obj.scale.set(1,1,1);for(const[parent,materials]of batches)for(const[m,items]of materials){const mesh=new T.InstancedMesh(unit,m,items.length);items.forEach((b,i)=>{obj.position.set(b.x,b.y,b.z);obj.rotation.set(0,b.yaw,0);obj.scale.set(b.w,b.h,b.d);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.name='Batched Escher masonry / joinery';parent.add(mesh);}
 const tess=new T.Group(),loop=new T.Group();tess.name='Live edge-pairing mosaic';loop.name='Live closed-loop stair model';interior.add(tess,loop);let tileGeo=null,loopGeo=null;
 function discard(g){for(const m of [...g.children]){m.dispose?.();g.remove(m);}}
 function setTessellation(state){discard(tess);if(tileGeo){tileGeo.dispose();owned.delete(tileGeo);}const points=tilePolygon(state),shape=new T.Shape();shape.moveTo(...points[0]);for(const p of points.slice(1))shape.lineTo(...p);shape.closePath();tileGeo=own(new T.ShapeGeometry(shape));
  for(let parity=0;parity<2;parity++){const cells=[];for(let row=0;row<4;row++)for(let col=0;col<8;col++)if((row+col)%2===parity)cells.push([col,row]);const mesh=new T.InstancedMesh(tileGeo,parity?tileInk:paper,cells.length);obj.rotation.set(0,0,0);obj.scale.set(1,1,1);cells.forEach(([col,row],i)=>{obj.position.set(208.69+col*2,-39+row*2,70.1+parity*.003);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);});mesh.instanceMatrix.needsUpdate=true;tess.add(mesh);}
 }
 function setLoop(directions){discard(loop);if(loopGeo){loopGeo.dispose();owned.delete(loopGeo);}loopGeo=own(new T.BoxGeometry(1,1,1));const result=loopResult(directions),min=Math.min(...result.heights),items=[];const corners=[[181.4,164.4],[184.6,164.4],[184.6,167.6],[181.4,167.6],[181.4,164.4]];
  for(let j=0;j<4;j++)for(let k=0;k<10;k++){const t=(k+.5)/10,[ax,az]=corners[j],[bx,bz]=corners[j+1],y=-44.9+(result.heights[j]-min+directions[j]*2*(k+1)/10)*.25;items.push({x:ax+(bx-ax)*t,z:az+(bz-az)*t,y,yaw:j*Math.PI/2});}
  const mesh=new T.InstancedMesh(loopGeo,brass,items.length);items.forEach((p,i)=>{obj.position.set(p.x,p.y-.07,p.z);obj.rotation.set(0,p.yaw,0);obj.scale.set(.34,.10,.65);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);});mesh.instanceMatrix.needsUpdate=true;loop.add(mesh);
  if(result.rise){const seam=new T.Mesh(loopGeo,red);seam.position.set(181.4,-44.9+((result.heights[0]+result.heights[4])/2-min)*.25,164.4);seam.scale.set(.16,Math.abs(result.rise)*.25,.16);loop.add(seam);}
 }
 setTessellation({});setLoop([1,1,1,1]);
 return{group,interior,surface,lamps,targets,setTessellation,setLoop,dispose(){group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
