import {buildEscherShaftDetails,ESCHER_SHAFT_NICHES,nicheVoid} from './escher-stone-details.js?v=shore-niches-20261121';
import {DESCENT as D,DESCENT_ANNEX as A,annexContains,STAIR_PORTAL as P,DESCENT_PARTS as PARTS,descentSurface,walkDescent,outsideRectangle} from './escher-descent-model.js?v=shore-niches-20261121';
export function buildEscherDescent(T){
 const group=new T.Group();group.name='Escher · continuous eight-flight descent';const owned=[],batches=new Map(),unit=new T.BoxGeometry(1,1,1);owned.push(unit);
 const mat=c=>{const m=new T.MeshLambertMaterial({color:c,side:T.DoubleSide});owned.push(m);return m;},stone=mat(0xd0c7ae),slate=mat(0x718980),light=mat(0xe2dac2),brass=mat(0x9c824e),facade=mat(0xd0c7ae);
 const fill=new T.AmbientLight(0xd6e2dc,.6);fill.visible=false;group.add(fill);
 const voids=ESCHER_SHAFT_NICHES.map(nicheVoid);group.userData.stairNiches=ESCHER_SHAFT_NICHES;
 function subtract(a,b){const x0=Math.max(a.minX,b.minX),x1=Math.min(a.maxX,b.maxX),y0=Math.max(a.minY,b.minY),y1=Math.min(a.maxY,b.maxY),z0=Math.max(a.minZ,b.minZ),z1=Math.min(a.maxZ,b.maxZ);if(x1<=x0||y1<=y0||z1<=z0)return[a];return[{...a,maxX:x0},{...a,minX:x1},{minX:x0,maxX:x1,minY:a.minY,maxY:y0,minZ:a.minZ,maxZ:a.maxZ},{minX:x0,maxX:x1,minY:y1,maxY:a.maxY,minZ:a.minZ,maxZ:a.maxZ},{minX:x0,maxX:x1,minY:y0,maxY:y1,minZ:a.minZ,maxZ:z0},{minX:x0,maxX:x1,minY:y0,maxY:y1,minZ:z1,maxZ:a.maxZ}].filter(p=>p.maxX-p.minX>1e-7&&p.maxY-p.minY>1e-7&&p.maxZ-p.minZ>1e-7);}
 function box(w,h,d,x,y,z,m=stone,yaw=0){if(!batches.has(m))batches.set(m,[]);if(m===slate&&h>10&&!yaw){let pieces=[{minX:x-w/2,maxX:x+w/2,minY:y-h/2,maxY:y+h/2,minZ:z-d/2,maxZ:z+d/2}];for(const n of voids)pieces=pieces.flatMap(p=>subtract(p,n));for(const p of pieces)batches.get(m).push({w:p.maxX-p.minX,h:p.maxY-p.minY,d:p.maxZ-p.minZ,x:(p.minX+p.maxX)/2,y:(p.minY+p.maxY)/2,z:(p.minZ+p.maxZ)/2,yaw:0});}else batches.get(m).push({w,h,d,x,y,z,yaw});}
 const railPieces=[],guardPaths=[],guardPosts=new Map();group.userData.stairGuardPaths=guardPaths;group.userData.stairGuardPosts=guardPosts;
 function rail(a,b){railPieces.push({a:a.clone(),b:b.clone()});}
 function guard(points){const path=points.map(p=>new T.Vector3(...p));guardPaths.push(path);for(let i=1;i<path.length;i++)rail(path[i-1],path[i]);}
 function guardPost(x,z,base,top){const key=[x,z,base].join(',');if(guardPosts.has(key))return;guardPosts.set(key,{x,z,base,top});box(.055,top-base,.055,x,(base+top)/2,z,brass);}
 for(const p of PARTS){if(p.kind==='flight'){
  for(let i=0;i<40;i++){const z=p.start+(p.end-p.start)*(i+.5)/40,y=p.top+(p.bottom-p.top)*(i+1)/40;box(1.8,.18,.304,p.x,y-.09,z,i%8===0?light:stone);box(1.8,.018,.035,p.x,y+.009,z+(p.end>p.start?-.11:.11),slate);
   if(i%4===0)for(const x of[p.x-.88,p.x+.88])guardPost(x,z,y,p.top+(p.bottom-p.top)*(i+.5)/40+1.08);
  }
  for(const x of[p.x-.88,p.x+.88]){guard([[x,p.top+1.08,p.start],[x,p.bottom+1.08,p.end]]);guardPost(x,p.start,p.top,p.top+1.08);guardPost(x,p.end,p.bottom,p.bottom+1.08);}
 }else{box(p.maxX-p.minX,.25,p.maxZ-p.minZ,(p.minX+p.maxX)/2,p.y-.125,(p.minZ+p.maxZ)/2,light);
  if(p.id.startsWith('landing-')){const north=p.minZ<92,near=north?92:104,far=north?p.minZ+.16:p.maxZ-.16,left=224.12,right=228.88,y=p.y+1.08;
   // Solid wall-backed landings need no fence across the alcove. Retain the
   // two side returns and the guard beside the real opening between flights.
   guard([[left,y,near],[left,y,far]]);guard([[right,y,far],[right,y,near]]);guard([[225.88,y,near],[227.12,y,near]]);
   for(const x of[left,right])guardPost(x,far,p.y,y);
  }else{const x=p.id==='entry'?228:225,near=104,far=p.id==='entry'?105.8:106.65,y=p.y+1.08;
   for(const side of[-1,1]){const xx=x+side*.88;guard([[xx,y,near],[xx,y,far],[xx,y-.18,far]]);guardPost(xx,far,p.y,y);}
  }
 }}
 const s=D.shaft;
 // Solid 28cm masonry survives the close camera, enclosing every flight.
 for(const x of[s.minX-.14,s.maxX+.14])box(.28,39.6,s.maxZ-s.minZ,x,-20.2,(s.minZ+s.maxZ)/2,slate);
 box(s.maxX-s.minX,.28,s.maxZ-s.minZ,(s.minX+s.maxX)/2,-40.3,(s.minZ+s.maxZ)/2,slate);
 box(s.maxX-s.minX,39.6,.28,(s.minX+s.maxX)/2,-20.2,s.minZ-.14,slate);
 // A real arched reveal replaces the plain rectangular museum-side mouth.
 const doorwayHeight=3.7,wallTop=-.4,lintel=P.floor+doorwayHeight;
 box(s.maxX-s.minX,wallTop-lintel,.28,(s.minX+s.maxX)/2,(wallTop+lintel)/2,s.maxZ+.14,slate);
 for(const r of outsideRectangle({minX:s.minX,maxX:s.maxX,minZ:s.maxZ,maxZ:s.maxZ+.28},{minX:P.x-P.opening,maxX:P.x+P.opening,minZ:s.maxZ-1,maxZ:s.maxZ+1}))box(r.maxX-r.minX,doorwayHeight,.28,(r.minX+r.maxX)/2,P.floor+doorwayHeight/2,s.maxZ+.14,slate);
 const archShape=new T.Shape();archShape.moveTo(-P.halfWidth,0);archShape.lineTo(-P.halfWidth,P.height);archShape.lineTo(P.halfWidth,P.height);archShape.lineTo(P.halfWidth,0);archShape.lineTo(P.radius,0);archShape.lineTo(P.radius,P.spring);
 for(let i=1;i<=48;i++){const a=i*Math.PI/48;archShape.lineTo(P.radius*Math.cos(a),P.spring+P.radius*Math.sin(a));}archShape.lineTo(-P.radius,0);archShape.closePath();
 const archGeometry=new T.ExtrudeGeometry(archShape,{depth:P.depth,bevelEnabled:true,bevelThickness:.035,bevelSize:.035,bevelSegments:1,curveSegments:48}),arch=new T.Mesh(archGeometry,light);arch.position.set(P.x,P.floor,P.z);arch.name='Escher house · sculpted arched stair entrance';group.add(arch);owned.push(archGeometry);
 box(3.2,.12,.68,P.x,P.floor+P.height+.06,P.z+.24,light);
 const innerRim=[];for(let i=0;i<=8;i++)innerRim.push(new T.Vector3(P.x-P.radius,P.floor+.06+(P.spring-.06)*i/8,P.z+P.depth+.045));for(let i=1;i<=48;i++){const a=Math.PI-i*Math.PI/48;innerRim.push(new T.Vector3(P.x+P.radius*Math.cos(a),P.floor+P.spring+P.radius*Math.sin(a),P.z+P.depth+.045));}for(let i=1;i<=8;i++)innerRim.push(new T.Vector3(P.x+P.radius,P.floor+P.spring-(P.spring-.06)*i/8,P.z+P.depth+.045));
 const rimGeometry=new T.TubeGeometry(new T.CatmullRomCurve3(innerRim),96,.024,5,false);owned.push(rimGeometry);const rim=new T.Mesh(rimGeometry,brass);rim.name='Continuous bronze arch reveal';group.add(rim);
 // A shallow fan-shaped approach meets the real floor without a raised step.
 const apronShape=new T.Shape();apronShape.moveTo(-1.05,0);apronShape.lineTo(1.05,0);apronShape.lineTo(1.8,2.6);apronShape.quadraticCurveTo(0,3.25,-1.8,2.6);apronShape.closePath();const apronGeometry=new T.ShapeGeometry(apronShape,24);apronGeometry.rotateX(-Math.PI/2);const apron=new T.Mesh(apronGeometry,stone);apron.position.set(P.x,P.floor+.012,P.z+P.depth+.05);apron.rotation.y=Math.PI;apron.name='Escher stair · fan-shaped museum approach';group.add(apron);owned.push(apronGeometry);
 for(const side of[-1,1]){box(.035,.018,2.5,P.x+side*.66,P.floor+.023,P.z+1.85,brass);const glowGeometry=new T.BoxGeometry(.055,1.35,.018),glowMaterial=new T.MeshBasicMaterial({color:0xffe6b0}),glow=new T.Mesh(glowGeometry,glowMaterial);glow.position.set(P.x+side*1.3,P.floor+1.55,P.z+P.depth+.045);group.add(glow);owned.push(glowGeometry,glowMaterial);}
 // Ground ceiling is genuinely notched above the shallow first flight.
 for(const r of outsideRectangle(s,D.cut))box(r.maxX-r.minX,.24,r.maxZ-r.minZ,(r.minX+r.maxX)/2,-.52,(r.minZ+r.maxZ)/2,slate);
 // This actual six-sided stair pavilion keeps the proven shaft footprint.
 // Its front edge is the real first-flight opening, not a decorative doorway.
 const capPositions=[],capFace=(a,b,c)=>{for(const p of[a,b,c])capPositions.push(...p);};
 for(let i=0;i<6;i++){const p=A.polygon[i],q=A.polygon[(i+1)%6],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz),x=(p[0]+q[0])/2,z=(p[1]+q[1])/2,yaw=-Math.atan2(dz,dx);
  if(i!==5)box(len,A.eave-A.bottom,.24,x,(A.eave+A.bottom)/2,z,facade,yaw);
  box(len+.05,.18,.32,x,A.eave+.04,z,light,yaw);
  capFace([p[0],A.eave+.13,p[1]],[q[0],A.eave+.13,q[1]],[A.centre[0],A.apex,A.centre[1]]);
  capFace([q[0],A.eave-.10,q[1]],[p[0],A.eave-.10,p[1]],[A.centre[0],A.apex-.23,A.centre[1]]);
  rail(new T.Vector3(p[0],A.eave+.16,p[1]),new T.Vector3(A.centre[0],A.apex+.02,A.centre[1]));
 }
 const capGeometry=new T.BufferGeometry();capGeometry.setAttribute('position',new T.Float32BufferAttribute(capPositions,3));capGeometry.computeVertexNormals();owned.push(capGeometry);const cap=new T.Mesh(capGeometry,light);cap.name='Escher · six-facet capped stair pavilion';group.add(cap);
 const details=buildEscherShaftDetails(T);group.add(details.group);
 const stamp=new T.Object3D(),railGeometry=new T.CylinderGeometry(.045,.045,1,8),railBatch=new T.InstancedMesh(railGeometry,brass,railPieces.length);owned.push(railGeometry);
 railPieces.forEach(({a,b},i)=>{const delta=b.clone().sub(a);stamp.position.copy(a.clone().add(b).multiplyScalar(.5));stamp.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize());stamp.scale.set(1,delta.length(),1);stamp.updateMatrix();railBatch.setMatrixAt(i,stamp.matrix);});railBatch.instanceMatrix.needsUpdate=true;railBatch.computeBoundingSphere();railBatch.name='Continuous supported eight-flight handrails';group.add(railBatch);
 const corners=new Map();for(const path of guardPaths)for(const p of path)corners.set(p.toArray().join(','),p);const jointGeometry=new T.SphereGeometry(.046,8,6),joints=new T.InstancedMesh(jointGeometry,brass,corners.size);owned.push(jointGeometry);let ji=0;stamp.quaternion.identity();stamp.scale.set(1,1,1);for(const p of corners.values()){stamp.position.copy(p);stamp.updateMatrix();joints.setMatrixAt(ji++,stamp.matrix);}joints.instanceMatrix.needsUpdate=true;joints.computeBoundingSphere();joints.name='Rounded connected stair-rail joints';group.add(joints);
 for(const[m,items]of batches){const mesh=new T.InstancedMesh(unit,m,items.length);items.forEach((p,i)=>{stamp.position.set(p.x,p.y,p.z);stamp.rotation.set(0,p.yaw??0,0);stamp.scale.set(p.w,p.h,p.d);stamp.updateMatrix();mesh.setMatrixAt(i,stamp.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);}
 return{group,fill,dispose(){details.dispose();group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose();});owned.forEach(o=>o.dispose());group.clear();}};
}
export function installEscherDescent(M,T,{gateOpen,onBegin,onMuseum,onStop}={}){
 const built=buildEscherDescent(T);M.scene.add(built.group);let active=false,disposed=false,lastLevel=-1;
 const previousStand=M.city?.canStand;
 const annexStand=function(x,z,...args){if(annexContains(x,z))return false;return previousStand?.call(this,x,z,...args)??true;};
 if(previousStand)M.city.canStand=annexStand;
 const blocked=()=>document.hidden||!!document.querySelector('dialog[open],#reader-panel:not([hidden]),#exhibit-panel:not([hidden]),#map-panel:not([hidden])');
 const top=()=>Math.abs(M.player.y-M.eye-D.top)<.25&&Math.abs(M.player.x-228)<.66&&M.player.z>103.75&&M.player.z<105.85;
 const bottom=()=>Math.abs(M.player.y-M.eye-D.bottom)<.25&&Math.abs(M.player.x-225)<.66&&M.player.z>106.1&&M.player.z<106.95;
 function stop(){if(!active)return;active=false;built.fill.visible=false;delete document.body.dataset.escherDescent;onStop?.();}
 function step(dt,{forward=0,strafe=0,turn=0,boost=false}={}){
  if(disposed)return false;if(active&&M.mode!=='city'){stop();return false;}
  if(!active){const intoStair=-Math.cos(M.player.yaw)*(forward||0)-Math.sin(M.player.yaw)*(strafe||0)<-.001;if(M.mode!=='city'||blocked()||(!top()&&!(bottom()&&intoStair))||top()&&!gateOpen?.())return false;onBegin?.(bottom());active=true;built.fill.visible=true;document.body.dataset.escherDescent='true';lastLevel=-1;}
  if(blocked())return true;const surface=descentSurface(M.player.x,M.player.z,M.player.y-M.eye,.35);if(!surface){stop();return false;}
  dt=Math.max(0,Math.min(.5,Number.isFinite(dt)?dt:0));const clamp=n=>Number.isFinite(n)?Math.max(-1,Math.min(1,n)):0;forward=clamp(forward);strafe=clamp(strafe);M.player.yaw+=clamp(turn)*dt*1.65;const n=Math.max(1,Math.hypot(forward,strafe)),speed=(boost?6:3.8)*dt;
  walkDescent(M.player,(-Math.sin(M.player.yaw)*forward+Math.cos(M.player.yaw)*strafe)/n*speed,(-Math.cos(M.player.yaw)*forward-Math.sin(M.player.yaw)*strafe)/n*speed,M.eye);
  const floor=M.player.y-M.eye,level=Math.min(8,Math.max(0,Math.round((.13-floor)/(40.13/8))));if(level!==lastLevel){lastLevel=level;M.status?.('Escher stair · '+level+' / 8 · Follow the landings; the museum is below.');}
  if(Math.abs(floor-D.bottom)<.02&&M.player.z>106.6){stop();onMuseum?.();return true;}
  if(Math.abs(floor-D.top)<.02&&M.player.z>105.85){stop();return true;}
  return true;
 }
 return{built,step,stop,captureSurfaceAt(x,z){if(active||disposed||blocked()||M.mode!=='city'||!gateOpen?.()||Math.abs(M.player.y-M.eye-D.top)>.25||Math.abs(x-228)>=.66||z<=103.75||z>=105.85||z>=M.player.z)return false;M.player.x=x;M.player.z=z;step(0);return active;},get active(){return active;},approach(){if(blocked())return false;M.arrive({...D.entry,yaw:0});return true;},dispose(){disposed=true;stop();if(M.city?.canStand===annexStand)M.city.canStand=previousStand;built.dispose();}};
}
