import {buildPaperBoat} from './origami-boat.js';
import {TRIAL_EDGES,fiveCycle} from './sixth-guest-state.js';
export function buildTrialDiagram(T){
 const group=new T.Group();group.name='Your hypothetical trial diagram';
 const owned=[],mat=color=>{const m=new T.MeshLambertMaterial({color});owned.push(m);return m;},paper=mat('#f1e3bd'),ink=mat('#303d38'),red=mat('#ac493d'),blue=mat('#326a96');
 const geometry=new T.BoxGeometry(1.1,.008,1.1);owned.push(geometry);const sheet=new T.Mesh(geometry,paper);group.add(sheet);
 const dotGeometry=new T.SphereGeometry(.019,12,8);owned.push(dotGeometry);
 const nodes=Array.from({length:6},()=>{const m=new T.Mesh(dotGeometry,ink);group.add(m);return m;});
 const edgeGeometry=new T.CylinderGeometry(.003,.003,1,6);owned.push(edgeGeometry);
 const edges=TRIAL_EDGES.map(()=>{const m=new T.Mesh(edgeGeometry,red);group.add(m);return m;});
 function update(colors,count=6){
  nodes.forEach((m,i)=>{m.visible=i<count;m.position.set(Math.sin(i/count*Math.PI*2)*.36,.012,Math.cos(i/count*Math.PI*2)*.36);});
  edges.forEach((m,i)=>{const[a,b]=TRIAL_EDGES[i];m.visible=b<count;if(!m.visible)return;const delta=nodes[b].position.clone().sub(nodes[a].position);m.position.copy(nodes[a].position).add(nodes[b].position).multiplyScalar(.5);m.scale.y=delta.length();m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());m.material=colors[i]?blue:red;});
 }
 update(fiveCycle(),5);group.traverse(o=>o.userData.animated=true);
 return{group,sheet,update,dispose(){group.removeFromParent();owned.forEach(o=>o.dispose());group.clear();}};
}
export function buildTriangleBoats(T,park){
 const group=new T.Group();group.name='The pattern you brought back';group.visible=false;
 const boats=Array.from({length:3},()=>buildPaperBoat(T,{scale:.42*park.scale}));boats.forEach(b=>group.add(b.group));let lastColor=null;
 // The ring is water at local y=1.35. The whole small formation stays outside
 // the 2.6-unit central pedestal and inside the 11.1-unit basin.
 function update(time,{visible=false,color=0,reducedMotion=false}={}){
  group.visible=visible;if(!visible)return;const phase=reducedMotion?0:time*.09;
  if(color!==lastColor){boats.forEach(b=>b.group.traverse(o=>{if(o.userData.paperPanel)o.material.color.set(color?'#9dc6dd':'#df9b87');}));lastColor=color;}
  group.position.set(park.x,1.36*park.scale+.13,park.z);
  boats.forEach((b,i)=>{const angle=phase+i*Math.PI*2/3,x=Math.sin(angle)*2.3,z=6+Math.cos(angle)*2.3;b.group.position.set(x*park.scale,reducedMotion?0:Math.sin(time*.8+i)*.012*park.scale,z*park.scale);b.group.rotation.set(0,-angle,0);});
 }
 group.traverse(o=>o.userData={...o.userData,sixthGuestBoats:true,animated:true});
 return{group,update,dispose(){boats.forEach(b=>b.dispose());group.removeFromParent();group.clear();}};
}
