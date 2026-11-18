import {DESCENT as D,DESCENT_PARTS as PARTS,descentSurface,walkDescent,outsideRectangle} from './escher-descent-model.js?v=escher-metal-20261118';
export function buildEscherDescent(T){
 const group=new T.Group();group.name='Escher · continuous eight-flight descent';const owned=[],batches=new Map(),unit=new T.BoxGeometry(1,1,1);owned.push(unit);
 const mat=c=>{const m=new T.MeshLambertMaterial({color:c,side:T.DoubleSide});owned.push(m);return m;},stone=mat(0xc6c5af),slate=mat(0x99aaa3),light=mat(0xe6ddbe),brass=mat(0xa9986c);
 const fill=new T.AmbientLight(0xd6e2dc,.6);fill.visible=false;group.add(fill);
 function box(w,h,d,x,y,z,m=stone){if(!batches.has(m))batches.set(m,[]);batches.get(m).push({w,h,d,x,y,z});}
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
 // The museum doorway occupies the bottom 2.8m of the south enclosure.
 box(s.maxX-s.minX,36.8,.28,(s.minX+s.maxX)/2,-18.8,s.maxZ+.14,slate);
 for(const r of outsideRectangle({minX:s.minX,maxX:s.maxX,minZ:s.maxZ,maxZ:s.maxZ+.28},{minX:223.95,maxX:226.05,minZ:s.maxZ-1,maxZ:s.maxZ+1}))box(r.maxX-r.minX,2.8,.28,(r.minX+r.maxX)/2,-38.6,s.maxZ+.14,slate);
 // Ground ceiling is genuinely notched above the shallow first flight.
 for(const r of outsideRectangle(s,D.cut))box(r.maxX-r.minX,.24,r.maxZ-r.minZ,(r.minX+r.maxX)/2,-.52,(r.minZ+r.maxZ)/2,slate);
 // A sloping covered mouth follows the first flight down through the lawn.
 const roof0=.13-(104-96.4)/12*(40.13/8)+3.15,roof1=3.28,roofRun=7.6,roofRise=roof1-roof0,roofGeometry=new T.BoxGeometry(2.4,.18,Math.hypot(roofRun,roofRise)),roof=new T.Mesh(roofGeometry,light);roof.position.set(228,(roof0+roof1)/2,100.2);roof.rotation.x=-Math.atan2(roofRise,roofRun);group.add(roof);owned.push(roofGeometry);
 const sideGeometry=new T.BufferGeometry(),sidePositions=[];for(const x of[-.09,.09])sidePositions.push(x,-.4,96.4,x,-.4,104,x,roof1,104,x,roof0,96.4);sideGeometry.setAttribute('position',new T.Float32BufferAttribute(sidePositions,3));sideGeometry.setIndex([0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7]);sideGeometry.computeVertexNormals();owned.push(sideGeometry);for(const x of[226.8,229.2]){const side=new T.Mesh(sideGeometry,slate);side.position.x=x;group.add(side);}
 // Repeated short arcades reveal the depth without copying an impossible print.
 for(const p of PARTS.filter(p=>p.kind==='landing'&&p.id.startsWith('landing-'))){const z=(p.minZ+p.maxZ)/2;
  for(const x of[224.05,228.95])box(.14,2.5,.14,x,p.y+1.25,z,light);
  const points=Array.from({length:25},(_,i)=>{const t=i/24*Math.PI;return new T.Vector3(226.5-2.45*Math.cos(t),p.y+2.5+.7*Math.sin(t),z);});const g=new T.TubeGeometry(new T.CatmullRomCurve3(points),32,.08,6,false);group.add(new T.Mesh(g,light));owned.push(g);
 }
 const stamp=new T.Object3D();for(const[m,items]of batches){const mesh=new T.InstancedMesh(unit,m,items.length);items.forEach((p,i)=>{stamp.position.set(p.x,p.y,p.z);stamp.scale.set(p.w,p.h,p.d);stamp.updateMatrix();mesh.setMatrixAt(i,stamp.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);}
 return{group,fill,dispose(){group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose();});owned.forEach(o=>o.dispose());group.clear();}};
}
export function installEscherDescent(M,T,{gateOpen,onBegin,onMuseum,onStop}={}){
 const built=buildEscherDescent(T);M.scene.add(built.group);let active=false,disposed=false,lastLevel=-1;
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
 return{built,step,stop,captureSurfaceAt(x,z){if(active||disposed||blocked()||M.mode!=='city'||!gateOpen?.()||Math.abs(M.player.y-M.eye-D.top)>.25||Math.abs(x-228)>=.66||z<=103.75||z>=105.85||z>=M.player.z)return false;M.player.x=x;M.player.z=z;step(0);return active;},get active(){return active;},approach(){if(blocked())return false;M.arrive({...D.entry,yaw:0});return true;},dispose(){disposed=true;stop();built.dispose();}};
}
