import {DESCENT as D,DESCENT_ANNEX as A,annexContains,STAIR_PORTAL as P,DESCENT_PARTS as PARTS,descentSurface,walkDescent,outsideRectangle} from './escher-descent-model.js?v=cloister-20261120';
export function buildEscherDescent(T){
 const group=new T.Group();group.name='Escher · continuous eight-flight descent';const owned=[],batches=new Map(),unit=new T.BoxGeometry(1,1,1);owned.push(unit);
 const mat=c=>{const m=new T.MeshLambertMaterial({color:c,side:T.DoubleSide});owned.push(m);return m;},stone=mat(0xc6c5af),slate=mat(0x99aaa3),light=mat(0xe6ddbe),brass=mat(0xa9986c);
 const fill=new T.AmbientLight(0xd6e2dc,.6);fill.visible=false;group.add(fill);
 function box(w,h,d,x,y,z,m=stone,yaw=0){if(!batches.has(m))batches.set(m,[]);batches.get(m).push({w,h,d,x,y,z,yaw});}
 function rail(a,b){const delta=new T.Vector3().subVectors(b,a),g=new T.CylinderGeometry(.045,.045,delta.length(),6),mesh=new T.Mesh(g,brass);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());group.add(mesh);owned.push(g);}
 for(const p of PARTS){if(p.kind==='flight'){
  for(let i=0;i<40;i++){const z=p.start+(p.end-p.start)*(i+.5)/40,y=p.top+(p.bottom-p.top)*(i+1)/40;box(1.8,.18,.304,p.x,y-.09,z,i%8===0?light:stone);box(1.8,.018,.035,p.x,y+.009,z+(p.end>p.start?-.11:.11),slate);
   if(i%4===0)for(const x of[p.x-.88,p.x+.88])box(.055,1.05,.055,x,y+.525,z,brass);
  }
  for(const x of[p.x-.88,p.x+.88])rail(new T.Vector3(x,p.top+1.08,p.start),new T.Vector3(x,p.bottom+1.08,p.end));
 }else{box(p.maxX-p.minX,.25,p.maxZ-p.minZ,(p.minX+p.maxX)/2,p.y-.125,(p.minZ+p.maxZ)/2,light);
  const north=p.id.startsWith('landing-')&&p.minZ<92,z=north?p.minZ:p.maxZ;
  if(p.id.startsWith('landing-')){rail(new T.Vector3(p.minX,p.y+1.08,z),new T.Vector3(p.maxX,p.y+1.08,z));for(const x of[p.minX,p.maxX])box(.06,1.08,.06,x,p.y+.54,z,brass);}
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
  if(i!==5)box(len,A.eave-A.bottom,.24,x,(A.eave+A.bottom)/2,z,slate,yaw);
  box(len+.05,.18,.32,x,A.eave+.04,z,light,yaw);
  capFace([p[0],A.eave+.13,p[1]],[q[0],A.eave+.13,q[1]],[A.centre[0],A.apex,A.centre[1]]);
  capFace([q[0],A.eave-.10,q[1]],[p[0],A.eave-.10,p[1]],[A.centre[0],A.apex-.23,A.centre[1]]);
  rail(new T.Vector3(p[0],A.eave+.16,p[1]),new T.Vector3(A.centre[0],A.apex+.02,A.centre[1]));
 }
 const capGeometry=new T.BufferGeometry();capGeometry.setAttribute('position',new T.Float32BufferAttribute(capPositions,3));capGeometry.computeVertexNormals();owned.push(capGeometry);const cap=new T.Mesh(capGeometry,light);cap.name='Escher · six-facet capped stair pavilion';group.add(cap);
 // Repeated short arcades reveal the depth without copying an impossible print.
 for(const p of PARTS.filter(p=>p.kind==='landing'&&p.id.startsWith('landing-'))){const z=(p.minZ+p.maxZ)/2;
  for(const x of[224.05,228.95])box(.14,2.5,.14,x,p.y+1.25,z,light);
  const points=Array.from({length:25},(_,i)=>{const t=i/24*Math.PI;return new T.Vector3(226.5-2.45*Math.cos(t),p.y+2.5+.7*Math.sin(t),z);});const g=new T.TubeGeometry(new T.CatmullRomCurve3(points),32,.08,6,false);group.add(new T.Mesh(g,light));owned.push(g);
 }
 const stamp=new T.Object3D();for(const[m,items]of batches){const mesh=new T.InstancedMesh(unit,m,items.length);items.forEach((p,i)=>{stamp.position.set(p.x,p.y,p.z);stamp.rotation.set(0,p.yaw??0,0);stamp.scale.set(p.w,p.h,p.d);stamp.updateMatrix();mesh.setMatrixAt(i,stamp.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);}
 return{group,fill,dispose(){group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose();});owned.forEach(o=>o.dispose());group.clear();}};
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
