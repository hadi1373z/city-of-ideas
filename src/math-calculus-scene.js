// Fixed original city diagrams. Source equations, models and floor data stay owned by the working wing.
export const CALCULUS_STUDIES=Object.freeze({curve:Array.from({length:17},(_,i)=>{const x=-.23+i*.46/16;return[x,1.6*(x+.25)**2-.16];}),chords:[[2,8],[2,15]],regions:[[[0,0],[.23,0],[.23,.17]],[[-.23,0],[-.23,-.17],[0,0]]]});
export function buildMathCalculusDetails(T,model){
 if(model?.floor!==3||model.height!==12||!model.group||!['limits','derivatives','integrals'].every(id=>model.approaches?.some(a=>a.conceptId===id)))return null;
 const group=new T.Group();group.name='Calculus · supported line cards and reading furniture';group.position.y=model.height;group.userData={animated:true,mathCalculusDetail:true};const owned=new Set(),aprons=[],joints=[],pads=[],seams=[],stretchers=[],fills=[],posts=[],cards=[],strokes=[];
 const mat=(color,basic=false)=>{const m=basic?new T.MeshBasicMaterial({color}):new T.MeshStandardMaterial({color,roughness:.9});owned.add(m);return m;},wood=mat('#806d55'),linen=mat('#ddd5df'),piping=mat('#786b81'),paper=mat('#f2e8d1'),blue=mat('#244f61',true),ochre=mat('#8d4c28',true);
 function box(parent,name,w,h,d,x,y,z,material=wood){const geo=new T.BoxGeometry(w,h,d);owned.add(geo);const m=new T.Mesh(geo,material);m.name=name;m.position.set(x,y,z);parent.add(m);return m;}
 for(const[x,z,w,d]of[[-7.8,3.9,2.5,1.3],[8,-4.2,2.7,1.5]]){
  for(const dz of[-d/2+.13,d/2-.13])aprons.push(box(group,'Calculus table front/back apron',w-.17,.10,.055,x,.74,z+dz));
  for(const dx of[-w/2+.13,w/2-.13])aprons.push(box(group,'Calculus table side apron',.055,.10,d-.17,x+dx,.74,z));
  for(const dx of[-w/2+.13,w/2-.13])for(const dz of[-d/2+.13,d/2-.13])joints.push(box(group,'Calculus table leg joint',.13,.08,.13,x+dx,.75,z+dz));
 }
 for(const x of[-9.8,-5.8]){pads.push(box(group,'Fitted Calculus reading pad',.62,.07,.57,x,.57,4.04,linen));for(const z of[3.755,4.325])seams.push(box(group,'Supported pad seam',.60,.008,.012,x,.605,z,piping));for(const dx of[-.304,.304])seams.push(box(group,'Supported pad seam',.012,.008,.55,x+dx,.605,4.04,piping));}
 for(const z of[-4.82,-3.58])stretchers.push(box(group,'Leg-supported lower table stretcher',2.35,.09,.05,8,.24,z));stretchers.push(box(group,'Cross stretcher between lower rails',.06,.07,1.19,8,.24,-4.2));
 const rack=new T.Group();rack.name='Finite chords and signed accumulation · original city cards';rack.position.set(-7.8,0,3.35);group.add(rack);
 const backing=box(rack,'Backed Calculus folio',1.6,.75,.055,0,1.55,0);for(const x of[-.64,.64])posts.push(box(rack,'Original-table-supported post',.055,.265,.045,x,1.0425,0));for(const cx of[-.4,.4])cards.push(box(rack,'Original Calculus card',.66,.60,.012,cx,1.55,.0335,paper));
 function line(a,b,material,name){const m=box(rack,name,Math.hypot(b[0]-a[0],b[1]-a[1]),.010,.0016,(a[0]+b[0])/2,(a[1]+b[1])/2,.0403,material);m.rotation.z=Math.atan2(b[1]-a[1],b[0]-a[0]);strokes.push(m);}
 const nodes=[],baseMark=new T.CircleGeometry(.028,20),endMark=new T.CircleGeometry(.019,20);owned.add(baseMark);owned.add(endMark);const offset=p=>[p[0]-.4,p[1]+1.55],curve=CALCULUS_STUDIES.curve.map(offset);for(let i=0;i<curve.length-1;i++)line(curve[i],curve[i+1],blue,'Schematic curve');
 for(const[i,[a,b]]of CALCULUS_STUDIES.chords.entries()){const p=curve[a],q=curve[b];for(let k=0;k<(i?4:1);k++){const t=i?k/4:0,u=i?(k+.75)/4:1;line(p.map((v,j)=>v+(q[j]-v)*t),p.map((v,j)=>v+(q[j]-v)*u),ochre,i?'Broken finite chord':'Continuous finite chord');}}
 for(const[i,index]of[2,8,15].entries()){const p=curve[index],m=new T.Mesh(i?endMark:baseMark,blue);m.name=i?'Filled comparison point':'Filled common curve point';m.position.set(...p,.03955);rack.add(m);nodes.push(m);}
 const positive=mat('#d8c3a3',true),negative=mat('#c4d1db',true);for(const[i,vertices]of CALCULUS_STUDIES.regions.entries()){const shape=new T.Shape();vertices.forEach(([x,y],j)=>j?shape.lineTo(x+.4,y+1.55):shape.moveTo(x+.4,y+1.55));shape.closePath();const geo=new T.ShapeGeometry(shape);owned.add(geo);const m=new T.Mesh(geo,i?negative:positive);m.name=i?'Original negative region':'Original positive region';m.position.z=.03955;rack.add(m);fills.push(m);}
 line([.14,1.55],[.66,1.55],blue,'Horizontal zero baseline');line([.17,1.38],[.63,1.72],blue,'Original signed graph');line([.17,1.55],[.17,1.38],blue,'Region end boundary');line([.63,1.55],[.63,1.72],blue,'Region end boundary');line([.53,1.605],[.57,1.605],blue,'Positive sign');line([.55,1.585],[.55,1.625],blue,'Positive sign');line([.23,1.495],[.27,1.495],blue,'Negative sign');
 rack.traverse(o=>{if(o.isMesh)o.userData={mathCalculusReading:true,animated:true};});model.group.add(group);let disposed=false;
 return{group,rack,backing,posts,cards,strokes,nodes,fills,aprons,joints,pads,seams,stretchers,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();owned.forEach(r=>r.dispose());group.clear();}};
}
