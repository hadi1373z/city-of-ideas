// Fixed original city diagrams. Source equations, models and floor data stay owned by the working wing.
export const DISCRETE_STUDIES=Object.freeze({vertices:Object.freeze([[-.24,.20],[.07,.20],[-.085,-.04],[.22,-.22]].map(Object.freeze)),edges:Object.freeze([[0,1],[1,2],[2,0],[2,3]].map(Object.freeze)),unordered:Object.freeze(['circle','square']),orders:Object.freeze([['circle','square'],['square','circle']].map(Object.freeze))});
export function buildMathDiscreteDetails(T,model){
 if(model?.floor!==4||model.height!==16||!model.group||!['graphs','counting','induction'].every(id=>model.approaches?.some(a=>a.conceptId===id)))return null;
 const group=new T.Group();group.name='Discrete · supported line cards and reading furniture';group.position.y=model.height;group.userData={animated:true,mathDiscreteDetail:true};const owned=new Set(),aprons=[],joints=[],pads=[],seams=[],plinths=[],posts=[],cards=[],strokes=[];
 const mat=(color,basic=false)=>{const m=basic?new T.MeshBasicMaterial({color}):new T.MeshStandardMaterial({color,roughness:.9});owned.add(m);return m;},wood=mat('#806d55'),linen=mat('#d6e0d6'),piping=mat('#5d7970'),paper=mat('#f2e8d1'),blue=mat('#244f61',true),ochre=mat('#8d4c28',true);
 function box(parent,name,w,h,d,x,y,z,material=wood){const geo=new T.BoxGeometry(w,h,d);owned.add(geo);const m=new T.Mesh(geo,material);m.name=name;m.position.set(x,y,z);parent.add(m);return m;}
 for(const[x,z,w,d]of[[-7.8,3.9,2.5,1.3],[8,-4.2,2.7,1.5]]){
  for(const dz of[-d/2+.13,d/2-.13])aprons.push(box(group,'Discrete table front/back apron',w-.17,.10,.055,x,.74,z+dz));
  for(const dx of[-w/2+.13,w/2-.13])aprons.push(box(group,'Discrete table side apron',.055,.10,d-.17,x+dx,.74,z));
  for(const dx of[-w/2+.13,w/2-.13])for(const dz of[-d/2+.13,d/2-.13])joints.push(box(group,'Discrete table leg joint',.13,.08,.13,x+dx,.75,z+dz));
 }
 for(const x of[-9.8,-5.8]){pads.push(box(group,'Fitted Discrete reading pad',.62,.07,.57,x,.57,4.04,linen));for(const z of[3.755,4.325])seams.push(box(group,'Supported pad seam',.60,.008,.012,x,.605,z,piping));for(const dx of[-.304,.304])seams.push(box(group,'Supported pad seam',.012,.008,.55,x+dx,.605,4.04,piping));}
 for(const x of[-10.1,-7.2])plinths.push(box(group,'Floor-supported original bookcase plinth',2.08,.10,.38,x,.05,-9.275));
 const rack=new T.Group();rack.name='Connections and order · original city cards';rack.position.set(-7.8,0,3.35);group.add(rack);
 const backing=box(rack,'Backed Discrete folio',1.6,.75,.055,0,1.55,0);for(const x of[-.64,.64])posts.push(box(rack,'Original-table-supported post',.055,.265,.045,x,1.0425,0));for(const cx of[-.4,.4])cards.push(box(rack,'Original Discrete card',.66,.60,.012,cx,1.55,.0335,paper));
 function line(a,b,material,name){const m=box(rack,name,Math.hypot(b[0]-a[0],b[1]-a[1]),.010,.0016,(a[0]+b[0])/2,(a[1]+b[1])/2,.0403,material);m.rotation.z=Math.atan2(b[1]-a[1],b[0]-a[0]);strokes.push(m);}
 const nodes=[],tokens=[],disc=new T.CircleGeometry(.025,24),square=new T.PlaneGeometry(.05,.05);owned.add(disc);owned.add(square);
 for(const[a,b]of DISCRETE_STUDIES.edges){const p=DISCRETE_STUDIES.vertices[a],q=DISCRETE_STUDIES.vertices[b];line([p[0]-.4,p[1]+1.55],[q[0]-.4,q[1]+1.55],blue,'Original graph edge');}
 for(const p of DISCRETE_STUDIES.vertices){const m=new T.Mesh(disc,ochre);m.name='Filled graph vertex';m.position.set(p[0]-.4,p[1]+1.55,.03955);rack.add(m);nodes.push(m);}
 function token(kind,x,y){const m=new T.Mesh(kind==='circle'?disc:square,kind==='circle'?ochre:blue);m.name='Original '+kind+' token';m.position.set(x,y,.03955);rack.add(m);tokens.push(m);}
 token(DISCRETE_STUDIES.unordered[0],.27,1.72);token(DISCRETE_STUDIES.unordered[1],.54,1.72);
 line([.21,1.78],[.21,1.66],blue,'Unordered group bracket');line([.21,1.66],[.60,1.66],blue,'Unordered group bracket');line([.60,1.66],[.60,1.78],blue,'Unordered group bracket');
 for(const[i,pair]of DISCRETE_STUDIES.orders.entries()){const y=1.50-i*.18;token(pair[0],.27,y);token(pair[1],.54,y);line([.33,y],[.475,y],blue,'Ordered first-to-second arrow');line([.475,y],[.45,y+.02],blue,'Ordered arrowhead');line([.475,y],[.45,y-.02],blue,'Ordered arrowhead');}

 rack.traverse(o=>{if(o.isMesh)o.userData={mathDiscreteReading:true,animated:true};});model.group.add(group);let disposed=false;
 return{group,rack,backing,posts,cards,strokes,nodes,tokens,aprons,joints,pads,seams,plinths,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();owned.forEach(r=>r.dispose());group.clear();}};
}
