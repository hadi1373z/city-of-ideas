import {buildPaperBoat} from './origami-boat.js';
import {VOYAGE} from './ocean-voyage-model.js';
import {SHORE} from './island-layout.js';
export function buildOceanBoat(T){
 const group=new T.Group();group.name='The paper sea · embarkable origami boat';
 const vessel=new T.Group();vessel.name='Large floating origami boat';group.add(vessel);
 const paper=buildPaperBoat(T,{color:'#f1e6ca'});paper.group.rotation.y=Math.PI/2;paper.group.scale.set(8,4.2,8);paper.group.traverse(o=>{if(o.isMesh)o.material.flatShading=true;});vessel.add(paper.group);vessel.traverse(o=>o.userData={...o.userData,oceanBoat:true,dynamic:true});
 const owned=[],wood=new T.MeshLambertMaterial({color:0x837153}),rope=new T.LineBasicMaterial({color:0xb4ad95}),foam=new T.LineBasicMaterial({color:0xd1e7de,transparent:true,opacity:.45});owned.push(wood,rope,foam);
 const box=(w,h,d,x,y,z)=>{const g=new T.BoxGeometry(w,h,d),o=new T.Mesh(g,wood);owned.push(g);o.position.set(x,y,z);group.add(o);};
 const start=new T.Vector3(SHORE.x-1,.12,SHORE.z),end=new T.Vector3(VOYAGE.dock.x+Math.sin(VOYAGE.dock.yaw)*8.7,.12,VOYAGE.dock.z+Math.cos(VOYAGE.dock.yaw)*8.7),delta=end.clone().sub(start),length=delta.length(),heading=Math.atan2(-delta.z,delta.x),normal=new T.Vector3(-delta.z,0,delta.x).normalize();
 const pierGeo=new T.BoxGeometry(length,.14,2.5),pier=new T.Mesh(pierGeo,wood);owned.push(pierGeo);pier.position.copy(start).add(end).multiplyScalar(.5);pier.rotation.y=heading;group.add(pier);
 for(const u of[.05,.5,.95])for(const sign of[-1,1]){const p=start.clone().lerp(end,u).addScaledVector(normal,sign*1.35);box(.18,sign>0?2.3:.8,.18,p.x,sign>0?-.55:.45,p.z);}
 const railStart=start.clone().addScaledVector(normal,-1.35),railEnd=end.clone().addScaledVector(normal,-1.35);railStart.y=railEnd.y=.85;const lineGeo=new T.BufferGeometry().setFromPoints([railStart,railEnd]);owned.push(lineGeo);group.add(new T.Line(lineGeo,rope));
 const wakeGeo=new T.BufferGeometry(),positions=new Float32Array(48*3);wakeGeo.setAttribute('position',new T.BufferAttribute(positions,3));owned.push(wakeGeo);const wake=new T.LineSegments(wakeGeo,foam);wake.frustumCulled=false;group.add(wake);
 function update(s,{reduced=false}={}){const bob=reduced?0:Math.sin(s.time*1.05)*.035;vessel.position.set(s.x,bob-.03,s.z);vessel.rotation.set(0,s.yaw,reduced?0:Math.sin(s.time*.7)*.008);wake.visible=s.active&&s.speed>.5;for(let i=0;i<24;i++){const side=i%2?1:-1,u=Math.floor(i/2)/11,back=8+u*24,spread=2+u*8;for(let k=0;k<2;k++){const j=(i*2+k)*3,lx=side*(spread+k*.35),lz=back+k*1.6;positions[j]=s.x+lx*Math.cos(s.yaw)+lz*Math.sin(s.yaw);positions[j+1]=.005;positions[j+2]=s.z+lz*Math.cos(s.yaw)-lx*Math.sin(s.yaw);}}wakeGeo.attributes.position.needsUpdate=true;}
 update({...VOYAGE.dock,time:0,active:false});
 return{group,vessel,update,dispose(){group.removeFromParent();paper.dispose();for(const r of owned)r.dispose();group.clear();}};
}
