// Fixed original city comparisons, attached to the verified public top floor only.
export const LOGIC_STUDIES=Object.freeze({
 inner:Object.freeze(['circle-a','circle-b']),outer:Object.freeze(['circle-a','circle-b','square']),
 trace:Object.freeze([[18,12],[12,6],[6,0]].map(Object.freeze)),unit:6
});
export function buildMathLogicDetails(T,model){
 if(model?.floor!==7||model.height!==28||!model.group||!['logic','quantifiers','algorithms'].every(id=>model.approaches?.some(a=>a.conceptId===id)))return null;
 const group=new T.Group();group.name='Logic observatory · supported comparison folio and furniture';group.position.y=model.height;group.userData={animated:true,mathLogicDetail:true};
 const owned=new Set(),aprons=[],joints=[],rungs=[],pads=[],seams=[],posts=[],cards=[],strokes=[],frames=[],tokens=[],bars=[],ticks=[];
 const mat=(color,basic=false)=>{const m=basic?new T.MeshBasicMaterial({color}):new T.MeshStandardMaterial({color,roughness:.9});owned.add(m);return m;};
 const wood=mat('#806d55'),linen=mat('#dfe1d4'),piping=mat('#758574'),paper=mat('#f2e8d1'),blue=mat('#244f61',true),ochre=mat('#8d4c28',true);
 function box(parent,name,w,h,d,x,y,z,material=wood){const geo=new T.BoxGeometry(w,h,d);owned.add(geo);const m=new T.Mesh(geo,material);m.name=name;m.position.set(x,y,z);parent.add(m);return m;}
 for(const[x,z,w,d]of[[-7.8,3.9,2.5,1.3],[8,-4.2,2.7,1.5]]){
  for(const dz of[-d/2+.13,d/2-.13])aprons.push(box(group,'Logic table front/back apron',w-.17,.10,.055,x,.74,z+dz));
  for(const dx of[-w/2+.13,w/2-.13])aprons.push(box(group,'Logic table side apron',.055,.10,d-.17,x+dx,.74,z));
  for(const dx of[-w/2+.13,w/2-.13])for(const dz of[-d/2+.13,d/2-.13])joints.push(box(group,'Logic table leg joint',.13,.08,.13,x+dx,.75,z+dz));
 }
 for(const x of[-9.8,-5.8]){
  pads.push(box(group,'Fitted observatory reading pad',.62,.07,.57,x,.57,4.04,linen));
  for(const z of[3.755,4.325])seams.push(box(group,'Supported pad seam',.60,.008,.012,x,.605,z,piping));
  for(const dx of[-.304,.304])seams.push(box(group,'Supported pad seam',.012,.008,.55,x+dx,.605,4.04,piping));
  rungs.push(box(group,'Rear chair rung joining original legs',.54,.045,.045,x,.21,3.73));
 }
 const rack=new T.Group();rack.name='Inclusion and stopping · original city cards';rack.position.set(-7.8,0,3.35);group.add(rack);
 const backing=box(rack,'Backed logic folio',1.6,.75,.055,0,1.55,0);
 for(const x of[-.64,.64])posts.push(box(rack,'Original-table-supported post',.055,.265,.045,x,1.0425,0));
 for(const cx of[-.4,.4])cards.push(box(rack,'Original logic comparison card',.66,.60,.012,cx,1.55,.0335,paper));
 function line(a,b,material,name,width=.008){const m=box(rack,name,Math.hypot(b[0]-a[0],b[1]-a[1]),width,.0016,(a[0]+b[0])/2,(a[1]+b[1])/2,.0403,material);m.rotation.z=Math.atan2(b[1]-a[1],b[0]-a[0]);strokes.push(m);return m;}
 function frame(x0,x1,y0,y1,material,name){for(const[a,b]of[[[x0,y0],[x1,y0]],[[x1,y0],[x1,y1]],[[x1,y1],[x0,y1]],[[x0,y1],[x0,y0]]])frames.push(line(a,b,material,name,.006));}
 frame(-.68,-.12,1.30,1.80,blue,'Outer token domain');frame(-.63,-.35,1.43,1.71,ochre,'Inner token domain');
 const disc=new T.CircleGeometry(.025,24);owned.add(disc);
 for(const[x,id]of[[-.56,'circle-a'],[-.42,'circle-b']]){const m=new T.Mesh(disc,blue);m.name='Inner and outer token · '+id;m.position.set(x,1.57,.03955);rack.add(m);tokens.push(m);}
 tokens.push(box(rack,'Outer-only square token',.050,.050,.0016,-.21,1.40,.0403,ochre));
 for(let row=0;row<LOGIC_STUDIES.trace.length;row++)for(let role=0;role<2;role++){
  const value=LOGIC_STUDIES.trace[row][role],y=1.78-row*.21-role*.07,x=.15,w=value*.025;
  if(value){const m=line([x,y],[x+w,y],role?ochre:blue,'Euclid pair '+row+' component '+role,.011);bars.push(m);for(let unit=0;unit<=value/LOGIC_STUDIES.unit;unit++)ticks.push(line([x+unit*.15,y-.012],[x+unit*.15,y+.012],role?ochre:blue,'Six-unit bar tick',.004));}
 }
 const ring=new T.RingGeometry(.009,.015,24);owned.add(ring);const zero=new T.Mesh(ring,ochre);zero.name='Zero second component · empty ring';zero.position.set(.15,1.29,.03955);rack.add(zero);
 rack.traverse(o=>{if(o.isMesh)o.userData={mathLogicReading:true,animated:true};});model.group.add(group);let disposed=false;
 return{group,rack,backing,posts,cards,strokes,frames,tokens,bars,ticks,zero,aprons,joints,rungs,pads,seams,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();owned.forEach(r=>r.dispose());group.clear();}};
}
