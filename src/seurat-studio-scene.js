// Additive city fittings; the source image, dot instances and original phases stay intact.
export function buildSeuratDetails(T,house){
 const group=new T.Group();group.name='Seurat · viewing cards and studio joinery';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshLambertMaterial({color:c}));
 const wood=mat('#786c55'),pale=mat('#dbcea7'),blue=mat('#48677a'),paper=mat('#f1e9d6');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const roofFrames=[];for(const roof of house.group.children.filter(o=>o.geometry?.parameters?.width===15)){
  const frame=new T.Group();frame.name='Split-roof edge frame';frame.position.copy(roof.position);frame.quaternion.copy(roof.quaternion);group.add(frame);const d=roof.geometry.parameters.depth;
  for(const z of[-1,1])box(frame,'Roof end fascia',15.04,.08,.04,0,0,z*(d/2+.02),blue);
  for(const x of[-1,1])box(frame,'Roof side fascia',.04,.08,d,x*7.52,0,0,blue);roofFrames.push({frame,roof});
 }
 const panelFrame=new T.Group();panelFrame.name='Owned frame around original dot panel';house.study.add(panelFrame);const rails=[],spacers=[];
 for(const x of[-1.73,1.73])rails.push(box(panelFrame,'Dot panel side rail',.06,2.32,.10,x,0,.015,wood));
 for(const y of[-1.13,1.13])rails.push(box(panelFrame,'Dot panel horizontal rail',3.4,.06,.10,0,y,.015,wood));
 for(const x of[-1.50,1.50])for(const y of[-.90,.90])spacers.push(box(panelFrame,'Dot panel wall spacer',.12,.12,.045,x,y,-.0575,wood));
 for(const rail of rails)rail.userData={quarterArtist:'seurat',quarterAction:'activity'};
 const joints=[];for(const x of[3.2,4.8])joints.push(box(group,'Desk corner joint',.14,.08,.96,x,.94,-2.9,pale));for(const z of[-3.40,-2.40])joints.push(box(group,'Desk apron',1.76,.12,.06,4,.92,z,blue));
 const rack=new T.Group();rack.name='Original city mark and surface placard';rack.position.set(-6.85,2.15,3.5);rack.rotation.y=Math.PI/2;rack.userData={quarterArtist:'seurat',quarterAction:'painting'};group.add(rack);
 const backing=box(rack,'Placard backing',1.62,.92,.06,0,0,0,wood);for(const x of[-.58,.58])box(rack,'Wall spacer',.12,.12,.02,x,0,-.04,wood);
 for(const y of[-.44,.44])box(rack,'Placard horizontal rail',1.62,.04,.06,0,y,.06,pale);for(const x of[-.79,.79])box(rack,'Placard side rail',.04,.84,.06,x,0,.06,pale);
 const cards=[],symbols=[],rules=[];for(const [i,y]of[.19,-.19].entries()){
  cards.push(box(rack,'City observation card',1.4,.30,.012,0,y,.036,paper));box(rack,'Card retaining lip',1.42,.025,.03,0,y-.1625,.05,pale);
  const symbol=new T.Mesh(own(i?new T.PlaneGeometry(.10,.10):new T.CircleGeometry(.05,24)),blue);symbol.name=i?'Original city surface symbol':'Original city mark symbol';symbol.position.set(-.48,y,.043);rack.add(symbol);symbols.push(symbol);
  for(const dy of[-.035,.035])rules.push(box(rack,'Unwritten observation rule',.70,.009,.002,.13,y+dy,.044,blue));
 }
 let disposed=false;return{group,roofFrames,panelFrame,rails,spacers,joints,rack,backing,cards,symbols,rules,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();panelFrame.removeFromParent();for(const r of owned)r.dispose();group.clear();panelFrame.clear();}};
}
