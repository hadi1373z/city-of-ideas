import {buildLowerLandscape} from './lower-landscape-scene.js';
import {WORLD_CYLINDER as W,lowerMatrix,GALLERY_TUNNEL} from './world-cylinder-model.js';
export function buildWorldCylinder(T){
 const group=new T.Group();group.name='One cylindrical world · two inhabited faces';group.userData.worldCylinder=true;
 const lowerFrame=new T.Group();lowerFrame.name='Other face · unchanged source-coordinate frame';lowerFrame.matrixAutoUpdate=false;lowerFrame.matrix.copy(lowerMatrix(T));group.add(lowerFrame);
 const owned=new Set(),own=o=>(owned.add(o),o),mat=(c,o={})=>own(new T.MeshLambertMaterial({color:c,...o}));
 const stone=mat(0xb4a58c,{side:T.DoubleSide}),edge=mat(0x86795e),grass=mat(0x586f59),sand=mat(0xc2b18c),water=mat(0x345d70,{side:T.DoubleSide}),brass=mat(0xbba56d),warm=own(new T.MeshBasicMaterial({color:0xe1c28d}));
 const mesh=(g,m,parent=group)=>{const o=new T.Mesh(own(g),m);parent.add(o);return o;};
 const shell=mesh(new T.CylinderGeometry(570,570,96,192,1,true),stone);shell.position.y=-48;shell.name='96-metre inhabited cylinder wall';
 function band(ri,ro,y,m,parent=group){const o=mesh(new T.RingGeometry(ri,ro,192),m,parent);o.rotation.x=-Math.PI/2;o.position.y=y;return o;}
 for(const y of[-.3,-24,-48,-72,-95.9]){const b=mesh(new T.TorusGeometry(570,.16,5,192),edge);b.rotation.x=Math.PI/2;b.position.y=y;}
 // Broad, quiet mineral courses make the physical thickness readable from both
 // faces. They are original landscape geometry, not a historical geology claim.
 const strata=new T.Group();strata.name='Cylinder edge · warm mineral strata';group.add(strata);
 const strataGeo=own(new T.CylinderGeometry(570.18,570.18,1,192,1,true)),strataMats=[mat(0xa29075),mat(0x887c68),mat(0xb2a084)],strataRows=[[],[],[]];
 for(const [top,bottom,tone]of[[0,-8,0],[-8,-22,1],[-22,-31,2],[-31,-44,0],[-44,-52,1],[-52,-65,2],[-65,-79,0],[-79,-88,1],[-88,-96,2]])strataRows[tone].push({y:(top+bottom)/2,h:top-bottom});
 const strataStamp=new T.Object3D();strataRows.forEach((rows,i)=>{const batch=new T.InstancedMesh(strataGeo,strataMats[i],rows.length);rows.forEach((p,j)=>{strataStamp.position.set(0,p.y,0);strataStamp.scale.set(1,p.h,1);strataStamp.updateMatrix();batch.setMatrixAt(j,strataStamp.matrix);});batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();strata.add(batch);});
 // A camera-facing diameter section is a presentation aid, switched on only by
 // the section controller. Its central 116m gap keeps the real library/gallery
 // shaft visible; normal walking geometry and collision remain unchanged.
 const sectionCut=new T.Group();sectionCut.name='Section cut · visible 96-metre mineral thickness';sectionCut.userData.sectionOnly=true;sectionCut.visible=false;group.add(sectionCut);
 const cutGeo=own(new T.BoxGeometry(1,1,1)),cutMaterials=[mat(0xb2a185,{side:T.DoubleSide}),mat(0x9c8b73,{side:T.DoubleSide}),mat(0xbeaf90,{side:T.DoubleSide})],cutSeam=mat(0x766954,{side:T.DoubleSide}),cutRows=[[],[],[]],seams=[];
 for(const[top,bottom,tone]of[[0,-8,0],[-8,-22,1],[-22,-31,2],[-31,-44,0],[-44,-52,1],[-52,-65,2],[-65,-79,0],[-79,-88,1],[-88,-96,2]])for(const sign of[-1,1])cutRows[tone].push({x:sign*314,y:(top+bottom)/2,w:512,h:top-bottom,d:.34});
 for(const y of[-.08,-8,-22,-31,-44,-52,-65,-79,-88,-95.92])for(const sign of[-1,1])seams.push({x:sign*314,y,w:512,h:.12,d:.43});
 for(const x of[-569.92,-58.08,58.08,569.92])seams.push({x,y:-48,w:.16,h:96,d:.43});
 [...cutRows.map((rows,i)=>({rows,material:cutMaterials[i]})),{rows:seams,material:cutSeam}].forEach(({rows,material})=>{const batch=new T.InstancedMesh(cutGeo,material,rows.length);batch.name='Batched section mineral panels / seams';rows.forEach((p,i)=>{strataStamp.position.set(p.x,p.y,0);strataStamp.scale.set(p.w,p.h,p.d);strataStamp.updateMatrix();batch.setMatrixAt(i,strataStamp.matrix);});batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();sectionCut.add(batch);});
 const lowerGround=new T.Group();lowerGround.position.set(-2160,0,-65);lowerFrame.add(lowerGround);
 const land=band(58,552,.005,grass,lowerGround);land.name='Lower circular face · real central gallery aperture';band(552,570,.005,sand,lowerGround);band(570,3600,-.015,water,lowerGround);
 // A structural ocean volume wraps the circumference, between the water faces.
 const ocean=mesh(new T.CylinderGeometry(650,650,96,192,1,true),own(new T.MeshLambertMaterial({color:0x467d91,transparent:true,opacity:.20,depthWrite:false,side:T.DoubleSide})));ocean.position.y=-48;ocean.name='Ocean surrounding the outside of the cylinder';
 const lowerGuide=band(534,538,.018,mat(0xa6ae91),lowerGround);lowerGuide.name='Lower-face shore promenade';
 const tunnel=new T.Group();tunnel.name='Gallery to Escher · continuous tunnel';group.add(tunnel);const boxes=new Map(),add=(m,w,h,d,x,y,z)=>{if(!boxes.has(m))boxes.set(m,[]);boxes.get(m).push({w,h,d,x,y,z});};
 for(let i=1;i<GALLERY_TUNNEL.points.length;i++){
  const a=GALLERY_TUNNEL.points[i-1],b=GALLERY_TUNNEL.points[i],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),vertical=Math.abs(dz)>0,cx=(a[0]+b[0])/2,cz=(a[1]+b[1])/2;
  add(stone,vertical?4:length+4,.18,vertical?length+4:4,cx,-40.09,cz);
  add(stone,vertical?4:length+4,.25,vertical?length+4:4,cx,-35,cz);
  // Stop side walls short of each corner, leaving the actual turning space open.
  for(const sign of[-1,1])add(stone,vertical?.2:Math.max(0,length-4),5,vertical?Math.max(0,length-4):.2,cx+(vertical?sign*2:0),-37.5,cz+(vertical?0:sign*2));
  for(let t=6;t<length-3;t+=11){const x=a[0]+dx*t/length,z=a[1]+dz*t/length;for(const sign of[-1,1]){
   add(brass,vertical?.14:3.8,.1,vertical?3.8:.14,x,-35.22,z);
   add(warm,.18,.16,.18,x+(vertical?sign*1.84:0),-36.8,z+(vertical?0:sign*1.84));
  }}
 }
 const unit=own(new T.BoxGeometry(1,1,1)),o=new T.Object3D();
 // A restrained garden campus surrounds the preserved buildings. All new
 // coordinates below are local to the lower circular face: logical X+2160,Z+65.
 // Nothing here reparents, replaces or moves an existing house or marker.
 const lowerPatio=new T.Group();lowerPatio.name='Lower face · warm courts and planted walks';lowerGround.add(lowerPatio);
 const paving=mat(0xc7b99b),limestone=mat(0xa29378),timber=mat(0x65543f),clay=mat(0x8d775f),soil=mat(0x465440),leafSage=mat(0x5b7454);
 const disc=own(new T.CylinderGeometry(1,1,1,96,1)),pot=own(new T.CylinderGeometry(1,1,1,32,1)),crown=own(new T.IcosahedronGeometry(1,2)),decor=new Map(),lowerObstacles=[];
 const lowerPaths=[
  {id:'gallery-garden',width:8,points:[[-58,0],[-64,0],[-64,18],[-101,18],[-119,-10],[-174,-10],[-191,-4]]},
  {id:'garden-mathematics',width:7,points:[[-101,18],[-101,38],[-80,38],[-80,32.8]]},
  {id:'ramsey-reading-walk',width:5.5,points:[[-101,18],[-121,14],[-121,6.8]]},
  {id:'object-market-approach',width:8,points:[[-200,-28],[-200,-40],[-200,-48]]},
  {id:'travel-station-walk',width:6,points:[[-138,10],[-138,85],[-101,85],[-101,38]]},
  {id:'garden-travel-walk',width:6,points:[[-178,18],[-166,12],[-138,12]]}
 ];
 function stamp(g,m,x,y,z,sx,sy,sz,yaw=0){const key=g.uuid+':'+m.uuid;if(!decor.has(key))decor.set(key,{g,m,items:[]});decor.get(key).items.push({x,y,z,sx,sy,sz,yaw});}
 function obstacle(x,z,radius,kind){lowerObstacles.push({x:x-2160,z:z-65,radius,r:radius,kind,space:'logical-lower'});}
 const pavingDisc=(x,z,rx,rz)=>stamp(disc,paving,x,.022,z,rx,.035,rz);
 function walk(points,width){for(let i=1;i<points.length;i++){const[a,b]=[points[i-1],points[i]],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);stamp(unit,paving,(a[0]+b[0])/2,.021,(a[1]+b[1])/2,length+.12,.032,width,Math.atan2(-dz,dx));}for(const p of points)pavingDisc(p[0],p[1],width/2,width/2);}
 lowerPaths.forEach(p=>walk(p.points,p.width));
 // Large unpatterned surfaces are intentionally flush. Existing source slabs,
 // door thresholds and every saved navigation coordinate remain authoritative.
 pavingDisc(-202,-3,47,34);pavingDisc(-200,-38,22,11);pavingDisc(-80,34,15,9);pavingDisc(-121,12,11,7);pavingDisc(-140,0,9,6);
 for(const z of[26,51,76]){stamp(unit,paving,-149,.022,z,23,.035,11);walk([[-149,z],[-138,z]],5);}
 function bed(x,z,rx,rz){stamp(pot,clay,x,.21,z,rx,.4,rz);stamp(pot,soil,x,.419,z,rx-.18,.018,rz-.18);stamp(crown,leafSage,x,.62,z,rx*.82,.42,rz*.81);obstacle(x,z,Math.max(rx,rz)+.16,'planted bed');}
 for(const b of[[-242,-22,5.4,3.8],[-241,20,5.2,3.5],[-226,31,4.2,2.8],[-164,31,3.5,3],[-169,-34,4.2,2.9],[-127,99,5,3.4]])bed(...b);
 // Open-sided shade structures frame real walks and existing reading places.
 // Their posts stay outside the route; slender top slats cast no navigational
 // barrier and add no placeholder room, billboard or duplicate house.
 function pergola(cx,cz,w,d){for(const x of[cx-w/2,cx+w/2])for(const z of[cz-d/2,cz+d/2]){stamp(unit,timber,x,1.85,z,.22,3.7,.22);obstacle(x,z,.35,'pergola post');}for(const x of[cx-w/2,cx+w/2])stamp(unit,timber,x,3.56,cz,.23,.23,d+.6);for(let z=cz-d/2-.15;z<=cz+d/2+.16;z+=1.4)stamp(unit,timber,cx,3.76,z,w+.8,.16,.19);for(const x of[cx-w/2+.5,cx+w/2-.5])stamp(unit,warm,x,3.43,cz,.07,.045,d*.65);}
 pergola(-259,0,12,25);pergola(-138,64,10,16);
 // Modest stone seats at the western reading pergola and Ramsey approach.
 for(const[x,z,yaw]of[[-264,-7,Math.PI/2],[-264,7,Math.PI/2],[-130,13,Math.PI/2]]){stamp(unit,limestone,x,.39,z,3.3,.32,.72,yaw);obstacle(x,z,.72,'stone seat');for(const dx of[-1.15,1.15]){const px=x+Math.cos(yaw)*dx,pz=z-Math.sin(yaw)*dx;stamp(unit,limestone,px,.18,pz,.32,.36,.55,yaw);obstacle(px,pz,.72,'stone seat');}}
 // Embedded warm strips give the route a quiet evening edge without point
 // lights, flashing materials or another per-frame animation.
 for(const[x,z]of[[-60,12],[-85,22],[-103,33],[-127,-5.2],[-153,-5.2],[-182,2.3],[-91,42],[-128,18],[-143,39],[-143,89]])stamp(unit,warm,x,.075,z,1.15,.07,.15);
 for(const{g,m,items}of decor.values()){const batch=new T.InstancedMesh(g,m,items.length);batch.name='Batched lower-face court / planting / shade';items.forEach((p,i)=>{o.position.set(p.x,p.y,p.z);o.rotation.set(0,p.yaw,0);o.scale.set(p.sx,p.sy,p.sz);o.updateMatrix();batch.setMatrixAt(i,o.matrix);});batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();lowerPatio.add(batch);}
 o.rotation.set(0,0,0);
 for(const[m,list]of boxes){const inst=new T.InstancedMesh(unit,m,list.length);list.forEach((p,i)=>{o.position.set(p.x,p.y,p.z);o.scale.set(p.w,p.h,p.d);o.updateMatrix();inst.setMatrixAt(i,o.matrix);});inst.instanceMatrix.needsUpdate=true;inst.computeBoundingSphere();inst.name='Batched cylinder galleries and reading lights';tunnel.add(inst);}
 const lowerLandscape=buildLowerLandscape(T,{parent:lowerGround,own,existingPaths:lowerPaths,existingObstacles:lowerObstacles});lowerPaths.push(...lowerLandscape.paths);lowerObstacles.push(...lowerLandscape.obstacles);
 // Lower-world lights point toward the lower face; upper cast lighting is retained.
 const lamps=new T.Group();lamps.name='Lower-face daylight';group.add(lamps);const hemi=new T.HemisphereLight(0xdde6df,0x5c5142,1.05);hemi.position.set(0,-200,0);lamps.add(hemi);const sun=new T.DirectionalLight(0xffe2b6,1.1);sun.position.set(170,-600,-250);sun.target.position.set(0,-96,0);lamps.add(sun,sun.target);lamps.visible=false;
 return{group,lowerFrame,lowerGround,lowerPatio,lowerObstacles,lowerPaths,lowerLandscape,sectionCut,lamps,shell,land,tunnel,owned,dispose(){lowerLandscape.dispose();group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh&&owned.has(o.geometry))o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
// Move only wholly remote subtrees. Shared source geometry/materials and all local
// positions survive: source animation and private tool coordinates keep working.
export function mountLowerWorld(T,scene,frame,{skip=new Set(),records=[]}={}){
 scene.updateMatrixWorld(true);const selected=[],box=new T.Box3();
 function visit(node){if(node===frame||skip.has(node)||node.userData?.staticRenderBatch||node.isLight||node.isCamera)return;box.setFromObject(node);if(!box.isEmpty()&&box.max.x<-1000){selected.push(node);return;}for(const child of [...node.children])visit(child);}
 for(const child of [...scene.children])visit(child);
 for(const node of selected){const parent=node.parent;if(!parent)continue;const parentWorld=parent.matrixWorld.clone(),wrapper=new T.Group();wrapper.name='Preserved source transform · '+node.name;wrapper.matrixAutoUpdate=false;wrapper.matrix.copy(parentWorld);frame.add(wrapper);wrapper.add(node);records.push({node,parent,parentWorld,wrapper,originalVisible:node.visible});}
 frame.updateMatrixWorld(true);return selected;
}
