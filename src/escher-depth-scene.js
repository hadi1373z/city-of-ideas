import {ESCHER_DEPTH as D,ESCHER_DEPTH_WALLS as WALLS,DEPTH_TRIANGLE,tilePolygon,loopResult} from './escher-depth-model.js';

export function buildEscherDepth(T,{canvas=()=>document.createElement('canvas'),loadTexture=typeof globalThis.document?.createElementNS==='function'?url=>new T.TextureLoader().load(url):null}={}){
 const group=new T.Group();group.name='Escher · connected underground museum';group.userData.escherDepth=true;
 const interior=new T.Group(),surface=new T.Group(),lamps=new T.Group();interior.name='Escher underground rooms';surface.name='Three doors to one interior';group.add(interior,surface);interior.add(lamps);lamps.visible=false;
 const owned=new Set(),targets=[],own=o=>(owned.add(o),o),mat=(color,extra={})=>own(new T.MeshLambertMaterial({color,...extra}));
 const floor=mat(0x8e968b),stone=mat(0xa4afa3),roof=mat(0x596b63),ink=mat(0x263b3d),timber=mat(0x3c5149),sage=mat(0x71867c),brass=mat(0xaa9868),paper=mat(0xe3dfc7),tileInk=mat(0x304d50),red=mat(0xb45f4d),glow=own(new T.MeshBasicMaterial({color:0xffe2b9}));
 const unit=own(new T.BoxGeometry(1,1,1)),batches=new Map();
 function box(w,h,d,x,y,z,m=stone,parent=interior,yaw=0){let byParent=batches.get(parent);if(!byParent)batches.set(parent,byParent=new Map());if(!byParent.has(m))byParent.set(m,[]);byParent.get(m).push({w,h,d,x,y,z,yaw});}
 function label(text,x,y,z,width=7,height=.9,parent=interior,yaw=0){
  const c=canvas();c.width=1536;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#e6e0c8';ctx.fillRect(0,0,c.width,c.height);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#273f41';ctx.font='bold 72px Georgia';ctx.fillText(text,768,134,1460);
  const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(own(new T.PlaneGeometry(width,height)),own(new T.MeshBasicMaterial({map:texture,side:T.DoubleSide,toneMapped:false})));mesh.position.set(x,y,z);mesh.rotation.y=yaw;parent.add(mesh);return mesh;
 }
 for(const r of D.rooms){box(r.maxX-r.minX,.4,r.maxZ-r.minZ,(r.minX+r.maxX)/2,r.y-.2,(r.minZ+r.maxZ)/2,floor);const top=r.id==='loop'?D.lowerCeiling:D.ceiling;box(r.maxX-r.minX,.45,r.maxZ-r.minZ,(r.minX+r.maxX)/2,top+.225,(r.minZ+r.maxZ)/2,roof);}
 for(const b of WALLS){box(b.maxX-b.minX,b.height,b.maxZ-b.minZ,(b.minX+b.maxX)/2,b.y+b.height/2,(b.minZ+b.maxZ)/2);box(b.maxX-b.minX+.02,.16,b.maxZ-b.minZ+.02,(b.minX+b.maxX)/2,b.y+.12,(b.minZ+b.maxZ)/2,ink);}
 // The quiet masonry is articulated by thin cornices and ribs, rather than
 // free-standing props in the visitor's route. All relief stays in wall space.
 for(const b of WALLS){const x=(b.minX+b.maxX)/2,z=(b.minZ+b.maxZ)/2,top=b.y+b.height;box(b.maxX-b.minX+.12,.16,b.maxZ-b.minZ+.12,x,top-.22,z,timber);box(b.maxX-b.minX+.09,.055,b.maxZ-b.minZ+.09,x,b.y+1.05,z,sage);}
 for(const r of D.rooms){const top=r.id==='loop'?D.lowerCeiling:D.ceiling,spacing=r.id==='vestibule'?6.4:8.5;for(let x=r.minX+3;x<r.maxX-1;x+=spacing){box(.14,.16,r.maxZ-r.minZ-.5,x,top-.08,(r.minZ+r.maxZ)/2,timber);for(const z of[r.minZ+.55,r.maxZ-.55])box(.4,.32,.5,x,top-.16,z,sage);}for(const z of[r.minZ+1.0,r.maxZ-1.0])box(r.maxX-r.minX-.7,.08,.085,(r.minX+r.maxX)/2,top-.04,z,brass);}
 // Laminated jambs engage the original wall-backed frames. The upper stair
 // frame is wall-supported beyond the hall slab; no extra floor columns.
 const portalFrames=[];
 function portalFrame(x,z,y,alongX=true,width=6){for(let layer=0;layer<2;layer++){const material=layer?timber:sage,depth=layer?.16:.28,spread=width/2+.37+layer*.18,height=6.35+layer*.35,offset=layer?.16:0;for(const sign of[-1,1])box(alongX?depth:.28,height,alongX?.28:depth,x+(alongX?offset:sign*spread),y+height/2,z+(alongX?sign*spread:offset),material);box(alongX?depth:width+1.25,.22,alongX?width+1.25:depth,x+(alongX?offset:0),y+height,z+(alongX?0:offset),material);}box(alongX?.08:width+.75,.055,alongX?width+.75:.08,x+(alongX?.27:0),y+6.08,z+(alongX?0:.27),brass);portalFrames.push({x,z,y,alongX,width});}
 for(const x of[135.24,160.24,194.24,232.24])portalFrame(x,115,-40,true);portalFrame(213,98.24,-40,false);portalFrame(184.5,132.24,-40,false,7);portalFrame(184.5,156.24,-46,false,7);
 const s=D.stair,railCentre=1.08;for(let i=0;i<s.steps;i++){const z=s.minZ+(i+.5)*(s.maxZ-s.minZ)/s.steps,y=s.top+(i+1)*(s.bottom-s.top)/s.steps;box(s.maxX-s.minX,.18,(s.maxZ-s.minZ)/s.steps+.012,(s.minX+s.maxX)/2,y-.09,z,stone);for(const x of[s.minX+.22,s.maxX-.22]){box(.06,1.1,.06,x,y+.55,z,brass);box(.12,.08,.50,x,y+railCentre,z,brass);}}
 box(7,.45,24,184.5,-28.775,144,roof);
 // A broad, genuinely open six-metre doorway receives the central gallery tunnel.
 label('CENTRAL GALLERY',135.51,-32.75,115,5,.5,interior,Math.PI/2);
 label('ESCHER · DEPTH & PATTERN',177,-31.25,98.25,11,.75);
 const triangleSign=label('ONE TRIANGLE, SEVERAL DEPTHS',213,-32.3,98.25,24,1.15);triangleSign.userData.escherDepthExhibit='perspective';targets.push(triangleSign);
 const tileSign=label('EDGES THAT AGREE',213,-30.1,66.25,18,1.1);tileSign.userData.escherDepthExhibit='tessellation';targets.push(tileSign);
 label('ONE MUSEUM · THREE SURFACE DOORS',251,-34.5,98.25,24,1.1);
 const loopSign=label('CAN EVERY FLIGHT RISE?',196,-37.5,156.25,22,1.1);loopSign.userData.escherDepthExhibit='loop';targets.push(loopSign);
 label('Original geometric experiments · English',177,-38.65,98.25,7.5,.32);
 // Reuse the credited prints already supplied with the surface Escher house.
 // No empty frames are generated in environments without an image loader.
 if(loadTexture){const prints=[{file:'relativity.jpg',title:'Relativity',year:1953,ratio:500/479,x:143,z:105.27,yaw:0},{file:'drawing-hands.jpg',title:'Drawing Hands',year:1948,ratio:500/448,x:153,z:105.27,yaw:0},{file:'ascending-descending.jpg',title:'Ascending and Descending',year:1960,ratio:500/595,x:147.7,z:124.73,yaw:Math.PI}];for(const print of prints){const h=4.4,w=h*print.ratio,y=-35.85,sign=print.yaw? -1:1;box(w+.36,h+.36,.10,print.x,y,print.z-sign*.09,timber);box(w+.12,h+.12,.035,print.x,y,print.z-sign*.025,paper);const texture=own(loadTexture(new URL('./assets/escher/'+print.file,import.meta.url).href));texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=2;const picture=new T.Mesh(own(new T.PlaneGeometry(w,h)),own(new T.MeshBasicMaterial({map:texture,toneMapped:false})));picture.position.set(print.x,y,print.z+sign*.005);picture.rotation.y=print.yaw;picture.name='M. C. Escher · '+print.title;picture.userData={escherPrint:print.title,source:'https://mcescher.com/gallery/most-popular/',credit:'© The M. C. Escher Company B.V. All rights reserved.'};interior.add(picture);label('M. C. Escher · '+print.title+' · '+print.year,print.x,y-h/2-.30,print.z+sign*.01,w+.3,.21,interior,print.yaw);label('© The M. C. Escher Company B.V. · mcescher.com',print.x,y-h/2-.55,print.z+sign*.01,w+.3,.15,interior,print.yaw);}}
 // Cases and consoles are included in the pure collision plan.
 for(const [x0,x1,z0,z1,y]of[[206,220,103,115,-40],[208,218,77,81,-40],[190,204,166,180,-46],[248,255,106,110,-40]]){
  box(x1-x0,.42,z1-z0,(x0+x1)/2,y+.21,(z0+z1)/2,ink);
  for(const x of[x0+.12,x1-.12])for(const z of[z0+.12,z1-.12])box(.08,1,.08,x,y+.9,z,brass);
 }
 // The separated rods are real 3D segments, not an impossible solid staircase.
 const rodGeo=own(new T.CylinderGeometry(.105,.105,1,8)),rods=new T.InstancedMesh(rodGeo,brass,3),obj=new T.Object3D();
 DEPTH_TRIANGLE.forEach(([a,b],i)=>{const av=new T.Vector3(a.x,a.y,a.z),bv=new T.Vector3(b.x,b.y,b.z),delta=bv.clone().sub(av);obj.position.copy(av.clone().add(bv).multiplyScalar(.5));obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize());obj.scale.set(1,delta.length(),1);obj.updateMatrix();rods.setMatrixAt(i,obj.matrix);});rods.instanceMatrix.needsUpdate=true;interior.add(rods);
 for(const x of[209.5,213,216.5]){box(.9,.025,.9,x,-39.98,124,brass);box(.55,.03,.55,x,-39.96,124,ink);}
 label('Compare the three brass floor marks',213,-39.05,130.7,18,.6,interior,Math.PI);
 const landingMarkers={park:[170,114],study:[260,121],escher:[240,115]},surfaceFrames=[];
 for(const p of D.portals){
  const w=p.id==='escher'?2.4:3.3,h=p.id==='escher'?3.5:4.4;
  surfaceFrames.push({p,w});
  for(const sign of[-1,1])box(.22,h,.38,p.x+sign*w/2,p.y+h/2,p.z,stone,surface);
  box(w+.2,.25,.38,p.x,p.y+h,p.z,stone,surface);box(w-.28,h-.1,.08,p.x,p.y+h/2,p.z,ink,surface);
  const door=new T.Mesh(own(new T.PlaneGeometry(w-.28,h-.1)),ink);door.position.set(p.x,p.y+h/2,p.z+.055);door.userData.escherDepthDoor=p.id;surface.add(door);targets.push(door);
  label('ESCHER · BELOW',p.x,p.y+h+.45,p.z+.23,w+1,.5,surface);
  const [x,z]=landingMarkers[p.id];box(3,.025,2,x,-39.98,z,brass);box(2.7,.03,1.7,x,-39.96,z,ink);
  label(p.name+' ↑',x,-37.2,z-.9,7,.65);
 }
 // Illumination is switched on only while visiting; it never owns surface lights.
 const ambient=new T.AmbientLight(0xdce7df,.65);ambient.userData.escherDepthOwned=true;lamps.add(ambient);
 const wallLamps=[];
 for(const x of[141,153]){for(const z of[105.43,124.57]){box(.15,.9,.11,x,-35.6,z,timber);box(.08,.5,.12,x,-35.55,z+(z<115?.07:-.07),glow);wallLamps.push({x,y:-35.6,z});}const light=new T.PointLight(0xffd0a2,30,23,1.7);light.position.set(x,-34.7,115);light.userData.escherDepthOwned=true;lamps.add(light);}
 const ceilingPanels=[];
 for(const [x,y,z]of[[176,-32,115],[213,-32,115],[213,-32,82],[250,-32,115],[184,-34,144],[196,-38,171]]){
  box(2.4,.12,.8,x,y,z,glow);const light=new T.PointLight(0xffdfb7,40,35,1.7);light.position.set(x,y-.2,z);light.userData.escherDepthOwned=true;lamps.add(light);
  ceilingPanels.push({x,y,z,top:y+.06});
 }
 // Append only internal rail-end links, keeping every original batch ID. Their
 // .10m section is recessed inside the .12m rails; ends engage the existing caps
 // without coplanar outer faces. The actual .125m stair rise stays authoritative.
 const rise=(s.top-s.bottom)/s.steps;
 for(let i=1;i<s.steps;i++){const upper=s.top-i*rise+railCentre,lower=upper-rise,z=s.minZ+i*(s.maxZ-s.minZ)/s.steps;for(const x of[s.minX+.22,s.maxX-.22])box(.10,rise+.06,.10,x,(upper+lower)/2,z,brass);}
 // Fit only cross-strips without an existing wall contact. The upper stair
 // strip already passes through both stair walls and needs no redundant clip.
 // Recessed clips bridge the actual .035m end gaps, engaging each end by .01m.
 for(const f of portalFrames){
  const half=f.width/2+.375,y=f.y+6.08,minX=f.alongX?f.x+.23:f.x-half,maxX=f.alongX?f.x+.31:f.x+half,minZ=f.alongX?f.z-half:f.z+.23,maxZ=f.alongX?f.z+half:f.z+.31;
  if(WALLS.some(w=>Math.min(maxX,w.maxX)-Math.max(minX,w.minX)>.001&&Math.min(maxZ,w.maxZ)-Math.max(minZ,w.minZ)>.001&&Math.min(y+.0275,w.y+w.height)-Math.max(y-.0275,w.y)>.001))continue;
  const jambInner=f.width/2+.37+.18-.14,span=(half+jambInner)/2,length=jambInner-half+.02;
  for(const sign of[-1,1])box(f.alongX?.04:length,.035,f.alongX?length:.04,f.x+(f.alongX?.24:sign*span),y,f.z+(f.alongX?sign*span:.24),brass);
 }
 // Suspend the retained panels from their actual room or stair roof. Both
 // ends engage by .01m; append after earlier joins to retain every old ID.
 for(const p of ceilingPanels){
  const room=D.rooms.find(r=>p.x>r.minX&&p.x<r.maxX&&p.z>r.minZ&&p.z<r.maxZ),top=(room?.id==='loop'?D.lowerCeiling:D.ceiling)+.01,bottom=p.top-.01;
  for(const offset of[-.85,.85])box(.04,top-bottom,.04,p.x+offset,(top+bottom)/2,p.z,brass);
 }
 // Only the two lamps flanking the south print have a clear wall bearing.
 // The north lamps face original credited prints: straight spacers there
 // would pierce those pictures. Leave those fixtures and pictures exact.
 // Append recessed bearings after earlier work, engaging each end by .01m.
 for(const p of wallLamps){
  if(p.z<115)continue;
  const wall=WALLS.find(w=>p.x>w.minX&&p.x<w.maxX&&w.minZ>p.z&&w.maxZ<p.z+1);
  if(!wall)continue;
  const start=p.z+.055-.01,end=wall.minZ+.01;
  box(.10,.70,end-start,p.x,p.y,(start+end)/2,timber);
 }
 // Only the study-lane feet miss their installed path (.018) and lawn (.005).
 // Recess each bearing inside its old jamb footprint; root .002 into the lawn
 // and engage the original foot by .01. Park/Escher already have full seats.
 // Append to the existing surface stone batch, retaining every original ID.
 for(const {p,w}of surfaceFrames){
  if(p.id!=='study')continue;
  const bottom=.003,top=p.y+.01;
  for(const sign of[-1,1])box(.18,top-bottom,.34,p.x+sign*w/2,(top+bottom)/2,p.z,stone,surface);
 }
 obj.quaternion.identity();obj.scale.set(1,1,1);for(const [parent,materials]of batches)for(const[m,items]of materials){const mesh=new T.InstancedMesh(unit,m,items.length);mesh.name='Batched Escher masonry / joinery';items.forEach((b,i)=>{obj.position.set(b.x,b.y,b.z);obj.rotation.set(0,b.yaw,0);obj.scale.set(b.w,b.h,b.d);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere?.();parent.add(mesh);}
 const tess=new T.Group(),loop=new T.Group();tess.name='Live edge-pairing mosaic';loop.name='Live closed-loop stair model';interior.add(tess,loop);let tileGeo=null,loopGeo=null;
 function discard(g){for(const m of [...g.children]){m.dispose?.();g.remove(m);}}
 function setTessellation(state){discard(tess);if(tileGeo){tileGeo.dispose();owned.delete(tileGeo);}const points=tilePolygon(state),shape=new T.Shape();shape.moveTo(...points[0]);for(const p of points.slice(1))shape.lineTo(...p);shape.closePath();tileGeo=own(new T.ShapeGeometry(shape));
  for(let parity=0;parity<2;parity++){const cells=[];for(let row=0;row<4;row++)for(let col=0;col<8;col++)if((row+col)%2===parity)cells.push([col,row]);const mesh=new T.InstancedMesh(tileGeo,parity?tileInk:paper,cells.length);obj.rotation.set(0,0,0);obj.scale.set(1,1,1);cells.forEach(([col,row],i)=>{obj.position.set(205+col*2,-39+row*2,66.28+parity*.003);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);});mesh.instanceMatrix.needsUpdate=true;tess.add(mesh);}
 }
 function setLoop(directions){discard(loop);if(loopGeo){loopGeo.dispose();owned.delete(loopGeo);}loopGeo=own(new T.BoxGeometry(1,1,1));const result=loopResult(directions),min=Math.min(...result.heights),items=[];const corners=[[192,168],[202,168],[202,178],[192,178],[192,168]];
  for(let j=0;j<4;j++)for(let k=0;k<10;k++){const t=(k+.5)/10,[ax,az]=corners[j],[bx,bz]=corners[j+1],y=-44.8+(result.heights[j]-min+directions[j]*2*(k+1)/10)*.4;items.push({x:ax+(bx-ax)*t,z:az+(bz-az)*t,y,yaw:j*Math.PI/2});}
  const mesh=new T.InstancedMesh(loopGeo,brass,items.length);items.forEach((p,i)=>{obj.position.set(p.x,p.y-.07,p.z);obj.rotation.set(0,p.yaw,0);obj.scale.set(1.03,.14,1.1);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);});mesh.instanceMatrix.needsUpdate=true;loop.add(mesh);
  if(result.rise){const seam=new T.Mesh(loopGeo,red);seam.position.set(192,-44.8+((result.heights[0]+result.heights[4])/2-min)*.4,168);seam.scale.set(.16,Math.abs(result.rise)*.4,.16);loop.add(seam);}
 }
 setTessellation({});setLoop([1,1,1,1]);
 return{group,interior,surface,lamps,targets,setTessellation,setLoop,dispose(){group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
