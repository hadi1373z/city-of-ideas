// Original finite city diagrams. The source Mathematics renderer stays untouched.
export const FOUNDATION_MAPS=Object.freeze([
 Object.freeze({inputs:[[-.21,.16],[-.21,-.16]],outputs:[[.21,0]],edges:[[0,0],[1,0]]}),
 Object.freeze({inputs:[[-.21,0]],outputs:[[.21,.16],[.21,-.16]],edges:[[0,0],[0,1]]})
]);
export function buildMathFoundationsDetails(T,model){
 if(model?.floor!==0||!model.group||!['sets','numbers','functions'].every(id=>model.approaches?.some(a=>a.conceptId===id)))return null;
 const group=new T.Group();group.name='Foundations · supported mapping cards and furniture';group.userData={animated:true,mathFoundationsDetail:true};const owned=new Set(),aprons=[],joints=[],pads=[],seams=[],posts=[],cards=[],nodes=[],arrows=[];
 const mat=color=>{const m=new T.MeshStandardMaterial({color,roughness:.9});owned.add(m);return m;},wood=mat('#866e50'),linen=mat('#e6dcc6'),piping=mat('#607a79'),paper=mat('#f0e5cb'),ink=new T.MeshBasicMaterial({color:'#244d5c'});owned.add(ink);
 function box(parent,name,w,h,d,x,y,z,material=wood){const geo=new T.BoxGeometry(w,h,d);owned.add(geo);const mesh=new T.Mesh(geo,material);mesh.name=name;mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 for(const[x,z,w,d]of[[-7.8,3.9,2.5,1.3],[8,-4.2,2.7,1.5]]){
  for(const dz of[-d/2+.13,d/2-.13])aprons.push(box(group,'Table front/back apron',w-.17,.10,.055,x,.74,z+dz));
  for(const dx of[-w/2+.13,w/2-.13])aprons.push(box(group,'Table side apron',.055,.10,d-.17,x+dx,.74,z));
  for(const dx of[-w/2+.13,w/2-.13])for(const dz of[-d/2+.13,d/2-.13])joints.push(box(group,'Table leg joint',.13,.08,.13,x+dx,.75,z+dz));
 }
 for(const x of[-9.8,-5.8]){
  pads.push(box(group,'Fitted linen seat pad',.62,.07,.57,x,.57,4.04,linen));
  for(const z of[3.755,4.325])seams.push(box(group,'Supported pad piping',.60,.008,.012,x,.605,z,piping));
  for(const dx of[-.304,.304])seams.push(box(group,'Supported pad piping',.012,.008,.55,x+dx,.605,4.04,piping));
 }
 const rack=new T.Group();rack.name='Two finite correspondences · original city cards';rack.position.set(-7.8,0,3.35);group.add(rack);
 const backing=box(rack,'Backed correspondence rack',1.6,.75,.055,0,1.55,0);
 for(const x of[-.64,.64])posts.push(box(rack,'Table-supported rack post',.055,.265,.045,x,1.0425,0));
 const ring=new T.RingGeometry(.026,.038,20),disc=new T.CircleGeometry(.038,20);owned.add(ring);owned.add(disc);
 function mark(geometry,x,y,name){const mesh=new T.Mesh(geometry,ink);mesh.name=name;mesh.position.set(x,y,.0404);rack.add(mesh);nodes.push(mesh);return mesh;}
 function line(x1,y1,x2,y2,name='Mapping arrow'){const mesh=box(rack,name,Math.hypot(x2-x1,y2-y1),.012,.0016,(x1+x2)/2,(y1+y2)/2,.0403,ink);mesh.rotation.z=Math.atan2(y2-y1,x2-x1);arrows.push(mesh);}
 for(const[i,map]of FOUNDATION_MAPS.entries()){
  const cx=i?.4:-.4;cards.push(box(rack,'Original finite-map card',.66,.60,.012,cx,1.55,.0335,paper));
  map.inputs.forEach(([x,y])=>mark(ring,cx+x,1.55+y,'Input · open circle'));map.outputs.forEach(([x,y])=>mark(disc,cx+x,1.55+y,'Output · filled circle'));
  for(const[a,b]of map.edges){const from=map.inputs[a],to=map.outputs[b],angle=Math.atan2(to[1]-from[1],to[0]-from[0]),dx=Math.cos(angle),dy=Math.sin(angle),tip={x:cx+to[0]-.048*dx,y:1.55+to[1]-.048*dy};line(cx+from[0]+.046*dx,1.55+from[1]+.046*dy,tip.x,tip.y);for(const side of[-1,1])line(tip.x,tip.y,tip.x-.055*Math.cos(angle+side*.48),tip.y-.055*Math.sin(angle+side*.48),'Arrowhead');}
 }
 rack.traverse(o=>{if(o.isMesh)o.userData={mathFoundationsReading:true,animated:true};});model.group.add(group);let disposed=false;
 return{group,rack,backing,posts,cards,nodes,arrows,aprons,joints,pads,seams,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();owned.forEach(r=>r.dispose());group.clear();}};
}
