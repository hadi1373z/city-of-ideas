// Fixed original city diagrams. Source equations, models and floor data stay owned by the working wing.
export const GEOMETRY_STUDIES=Object.freeze({route:[[-.23,-.15],[.23,-.15],[.23,.16]],copies:[[[-.23,-.19],[.04,-.19],[.04,.01]],[[-.06,.06],[.21,.06],[.21,.26]]]});
export function buildMathGeometryDetails(T,model){
 if(model?.floor!==2||model.height!==8||!model.group||!['pythagoras','vectors','symmetry'].every(id=>model.approaches?.some(a=>a.conceptId===id)))return null;
 const group=new T.Group();group.name='Geometry · supported line cards and reading furniture';group.position.y=model.height;group.userData={animated:true,mathGeometryDetail:true};const owned=new Set(),aprons=[],joints=[],pads=[],seams=[],footCollars=[],posts=[],cards=[],strokes=[];
 const mat=(color,basic=false)=>{const m=basic?new T.MeshBasicMaterial({color}):new T.MeshStandardMaterial({color,roughness:.9});owned.add(m);return m;},wood=mat('#806d55'),linen=mat('#d7d4c7'),piping=mat('#657e89'),paper=mat('#f2e8d1'),blue=mat('#244f61',true),ochre=mat('#8d4c28',true);
 function box(parent,name,w,h,d,x,y,z,material=wood){const geo=new T.BoxGeometry(w,h,d);owned.add(geo);const m=new T.Mesh(geo,material);m.name=name;m.position.set(x,y,z);parent.add(m);return m;}
 for(const[x,z,w,d]of[[-7.8,3.9,2.5,1.3],[8,-4.2,2.7,1.5]]){
  for(const dz of[-d/2+.13,d/2-.13])aprons.push(box(group,'Geometry table front/back apron',w-.17,.10,.055,x,.74,z+dz));
  for(const dx of[-w/2+.13,w/2-.13])aprons.push(box(group,'Geometry table side apron',.055,.10,d-.17,x+dx,.74,z));
  for(const dx of[-w/2+.13,w/2-.13])for(const dz of[-d/2+.13,d/2-.13])joints.push(box(group,'Geometry table leg joint',.13,.08,.13,x+dx,.75,z+dz));
 }
 for(const x of[-9.8,-5.8]){pads.push(box(group,'Fitted Geometry reading pad',.62,.07,.57,x,.57,4.04,linen));for(const z of[3.755,4.325])seams.push(box(group,'Supported pad seam',.60,.008,.012,x,.605,z,piping));for(const dx of[-.304,.304])seams.push(box(group,'Supported pad seam',.012,.008,.55,x+dx,.605,4.04,piping));}
 for(const x of[-9.8,-5.8])for(const dx of[-.27,.27])for(const dz of[-.27,.27])footCollars.push(box(group,'Supported chair foot collar',.11,.07,.11,x+dx,.035,4+dz,piping));
 const rack=new T.Group();rack.name='Route and moved copies · original city cards';rack.position.set(-7.8,0,3.35);group.add(rack);
 const backing=box(rack,'Backed route comparison rack',1.6,.75,.055,0,1.55,0);for(const x of[-.64,.64])posts.push(box(rack,'Original-table-supported post',.055,.265,.045,x,1.0425,0));
 for(const cx of[-.4,.4])cards.push(box(rack,'Original Geometry card',.66,.60,.012,cx,1.55,.0335,paper));
 function line(a,b,material,name){const m=box(rack,name,Math.hypot(b[0]-a[0],b[1]-a[1]),.010,.0016,(a[0]+b[0])/2,(a[1]+b[1])/2,.0403,material);m.rotation.z=Math.atan2(b[1]-a[1],b[0]-a[0]);strokes.push(m);}
 const nodes=[],disc=new T.CircleGeometry(.023,20),ring=new T.RingGeometry(.016,.024,20);owned.add(disc);owned.add(ring);
 function mark(x,y,open=false){const m=new T.Mesh(open?ring:disc,blue);m.name=open?'Open end mark':'Filled start/corresponding corner';m.position.set(x,y,.03955);rack.add(m);nodes.push(m);}
 const route=GEOMETRY_STUDIES.route.map(([x,y])=>[x-.4,y+1.55]),[a,b,c]=route;
 line(a,b,blue,'Two-leg route');line(b,c,blue,'Two-leg route');const angle=Math.atan2(c[1]-a[1],c[0]-a[0]),unit=[Math.cos(angle),Math.sin(angle)],tip=[c[0]-.032*unit[0],c[1]-.032*unit[1]];line([a[0]+.032*unit[0],a[1]+.032*unit[1]],tip,ochre,'Direct displacement arrow');for(const side of[-1,1])line(tip,[tip[0]-.045*Math.cos(angle+side*.5),tip[1]-.045*Math.sin(angle+side*.5)],ochre,'Displacement arrowhead');line([b[0]-.045,b[1]],[b[0]-.045,b[1]+.045],blue,'Right-angle marker');line([b[0]-.045,b[1]+.045],[b[0],b[1]+.045],blue,'Right-angle marker');mark(...a);mark(...c,true);
 for(const triangle of GEOMETRY_STUDIES.copies){const p=triangle.map(([x,y])=>[x+.4,y+1.55]);for(let i=0;i<3;i++)line(p[i],p[(i+1)%3],blue,'Translated triangle edge');mark(...p[0]);}
 rack.traverse(o=>{if(o.isMesh)o.userData={mathGeometryReading:true,animated:true};});model.group.add(group);let disposed=false;
 return{group,rack,backing,posts,cards,strokes,nodes,aprons,joints,pads,seams,footCollars,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();owned.forEach(r=>r.dispose());group.clear();}};
}
