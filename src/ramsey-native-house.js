import {buildCharacterStudyScene} from './ramsey-room-scene.js?v=neck11';
export function buildNativeRamseyHouse(T,origin){
 const study=buildCharacterStudyScene(T,{openToCity:true}),group=new T.Group();group.name='Ramsey House · continuous city interior';group.position.set(origin.x,origin.y+.003,origin.z);group.rotation.y=Math.PI;group.add(study.group);
 const owned=[],plaster=new T.MeshLambertMaterial({color:0xd1c5aa}),wood=new T.MeshLambertMaterial({color:0x69503b});owned.push(plaster,wood);
 const box=(w,h,d,x,y,z,m)=>{const g=new T.BoxGeometry(w,h,d);owned.push(g);const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);group.add(mesh);return mesh;};
 // Close the old film set with actual walls, a roof and a door-sized opening.
 for(const side of [-1,1]){
  box(3.75,3.8,.18,side*3.125,1.9,-3.08,plaster);
  box(.16,3.8,2.2,side*4.96,1.9,-2.15,plaster);
  box(.14,2.8,.26,side*1.22,1.4,-3.08,wood);
 }
 box(2.44,1.05,.18,0,3.275,-3.08,plaster);box(2.58,.14,.26,0,2.82,-3.08,wood);
 box(10.45,.20,7.05,0,3.9,.23,wood);
 // A flush threshold joins the city ground to the room floor.
 box(2.35,.012,.30,0,-.006,-3.03,wood);
 const light=new T.PointLight(0xffead2,.85,12);light.position.set(0,3.3,.35);group.add(light);
 const local=(x,z)=>({x:origin.x-x,z:origin.z-z});
 function inside(x,z){const p=local(x,z);return Math.abs(p.x)<4.85&&p.z> -3.08&&p.z<3.4;}
 function canStand(x,z){
  const p=local(x,z),X=p.x,Z=p.z;
  if(Math.abs(X)>5.45||Z< -3.65||Z>4)return true;
  if(Math.abs(X)>4.57&&Math.abs(X)<5.4&&Z> -3.4&&Z<3.8)return false;
  if(Z>3.06&&Z<3.95&&Math.abs(X)<5.4)return false;
  if(Math.abs(Z+3.08)<.38&&Math.abs(X)>.88&&Math.abs(X)<5.4)return false;
  if(Z< -3.4)return true;
  let table=true;for(let i=0;i<6;i++){const a=i*Math.PI/3;if(X*Math.sin(a)+(Z-.35)*Math.cos(a)>study.tableApothem+.24){table=false;break;}}
  if(table)return false;
  if(study.seats.some(s=>Math.hypot(X-s.x,Z-s.z)<.44))return false;
  if(Math.abs(X)>2.55&&Z>2.43)return false;
  if(Math.abs(X-3.45)<.67&&Math.abs(Z-1.3)<.58)return false;
  return true;
 }
 return {group,study,origin,local,inside,canStand,entry:{x:origin.x,z:origin.z+4.8,y:origin.y,yaw:0},dispose(){study.dispose();group.removeFromParent();owned.forEach(r=>r.dispose());group.clear();}};
}
