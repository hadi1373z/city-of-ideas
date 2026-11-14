// Fixed original city diagrams. Source equations, models and floor data stay owned by the working wing.
export const ALGEBRA_LINES=Object.freeze([
 Object.freeze([[[-.23,-.14],[.23,.14]],[[-.23,.14],[.23,-.14]]]),
 Object.freeze([[[-.23,-.02],[.23,.18]],[[-.23,-.18],[.23,.02]]])
]);
export function buildMathAlgebraDetails(T,model){
 if(model?.floor!==1||model.height!==4||!model.group||!['equations','polynomials','linear-systems'].every(id=>model.approaches?.some(a=>a.conceptId===id)))return null;
 const group=new T.Group();group.name='Algebra · supported line cards and reading furniture';group.position.y=model.height;group.userData={animated:true,mathAlgebraDetail:true};const owned=new Set(),aprons=[],joints=[],pads=[],seams=[],cornices=[],posts=[],cards=[],strokes=[];
 const mat=(color,basic=false)=>{const m=basic?new T.MeshBasicMaterial({color}):new T.MeshStandardMaterial({color,roughness:.9});owned.add(m);return m;},wood=mat('#806d55'),linen=mat('#d7d4c7'),piping=mat('#657e89'),paper=mat('#f2e8d1'),blue=mat('#244f61',true),ochre=mat('#8d4c28',true);
 function box(parent,name,w,h,d,x,y,z,material=wood){const geo=new T.BoxGeometry(w,h,d);owned.add(geo);const m=new T.Mesh(geo,material);m.name=name;m.position.set(x,y,z);parent.add(m);return m;}
 for(const[x,z,w,d]of[[-7.8,3.9,2.5,1.3],[8,-4.2,2.7,1.5]]){
  for(const dz of[-d/2+.13,d/2-.13])aprons.push(box(group,'Algebra table front/back apron',w-.17,.10,.055,x,.74,z+dz));
  for(const dx of[-w/2+.13,w/2-.13])aprons.push(box(group,'Algebra table side apron',.055,.10,d-.17,x+dx,.74,z));
  for(const dx of[-w/2+.13,w/2-.13])for(const dz of[-d/2+.13,d/2-.13])joints.push(box(group,'Algebra table leg joint',.13,.08,.13,x+dx,.75,z+dz));
 }
 for(const x of[-9.8,-5.8]){pads.push(box(group,'Fitted Algebra reading pad',.62,.07,.57,x,.57,4.04,linen));for(const z of[3.755,4.325])seams.push(box(group,'Supported pad seam',.60,.008,.012,x,.605,z,piping));for(const dx of[-.304,.304])seams.push(box(group,'Supported pad seam',.012,.008,.55,x+dx,.605,4.04,piping));}
 for(const x of[-10.1,-7.2])cornices.push(box(group,'Supported library cornice',2.25,.09,.47,x,2.595,-9.32));
 const rack=new T.Group();rack.name='Crossing and parallel · original city line cards';rack.position.set(-7.8,0,3.35);group.add(rack);
 const backing=box(rack,'Backed line comparison rack',1.6,.75,.055,0,1.55,0);for(const x of[-.64,.64])posts.push(box(rack,'Original-table-supported post',.055,.265,.045,x,1.0425,0));
 function line(x1,y1,x2,y2,material,name){const m=box(rack,name,Math.hypot(x2-x1,y2-y1),.010,.0016,(x1+x2)/2,(y1+y2)/2,.0403,material);m.rotation.z=Math.atan2(y2-y1,x2-x1);strokes.push(m);}
 for(const[i,lines]of ALGEBRA_LINES.entries()){
  const cx=i?.4:-.4;cards.push(box(rack,'Original line-pair card',.66,.60,.012,cx,1.55,.0335,paper));
  for(const[j,[a,b]]of lines.entries()){
   const material=j?ochre:blue,dx=b[0]-a[0],dy=b[1]-a[1],angle=Math.atan2(dy,dx);
   for(let k=0;k<(j?5:1);k++){const start=j?k/5:0,end=j?(k+.72)/5:1;line(cx+a[0]+dx*start,1.55+a[1]+dy*start,cx+a[0]+dx*end,1.55+a[1]+dy*end,material,j?'Segmented second line':'Continuous first line');}
   for(const[end,direction]of[[a,1],[b,-1]])for(const side of[-1,1])line(cx+end[0],1.55+end[1],cx+end[0]+direction*.040*Math.cos(angle+side*.55),1.55+end[1]+direction*.040*Math.sin(angle+side*.55),material,'Line continuation arrow');
  }
 }
 rack.traverse(o=>{if(o.isMesh)o.userData={mathAlgebraReading:true,animated:true};});model.group.add(group);let disposed=false;
 return{group,rack,backing,posts,cards,strokes,aprons,joints,pads,seams,cornices,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();owned.forEach(r=>r.dispose());group.clear();}};
}
