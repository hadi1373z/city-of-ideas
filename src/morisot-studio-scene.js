// Owned city additions preserve the supplied portrait and the original curtain cycle.
export function buildMorisotDetails(T,house){
 const group=new T.Group();group.name='Morisot · edge cards, curtain fittings and joinery';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshLambertMaterial({color:c}));
 const wood=mat('#7c6960'),pale=mat('#d7cdb9'),ink=mat('#586c70'),paper=mat('#f1e8dc'),linen=mat('#c4aaa2');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const roofs=house.group.children.filter(o=>o.geometry?.parameters?.width===15),roofFrames=[];
 for(const roof of roofs){const frame=new T.Group();frame.name='Split-roof edge frame';frame.position.copy(roof.position);frame.quaternion.copy(roof.quaternion);group.add(frame);const d=roof.geometry.parameters.depth;
  for(const z of[-1,1])box(frame,'Roof end fascia',15.04,.08,.04,0,0,z*(d/2+.02),pale);
  for(const x of[-1,1])box(frame,'Roof side fascia',.04,.08,d,x*7.52,0,0,pale);roofFrames.push({frame,roof});
 }
 const rail=box(group,'Curtain rail',.045,.06,6.9,6.68,3.56,0,wood),brackets=[];
 for(const z of[-3.38,3.38])brackets.push(box(group,'Rail wall bracket',.22,.08,.08,6.79,3.56,z,wood));
 const hangers=new T.Group();hangers.name='Curtain tabs following the original study';house.study.add(hangers);const tabs=[];
 for(const z of[-.74,0,.74]){const o=box(hangers,'Curtain tab',.045,.10,.07,0,1.265,z,linen);o.userData={quarterArtist:'morisot',quarterAction:'activity'};tabs.push(o);}
 const cushion=box(group,'Supported settee cushion',2.3,.06,.88,-4,.75,-1.37,linen);
 for(const z of[-1.8,-.94])box(group,'Settee piping',2.22,.006,.012,-4,.783,z,pale);
 const arms=[];for(const x of[-5.18,-2.82]){arms.push(box(group,'Settee arm support',.10,.18,.70,x,.81,-1.37,wood));arms.push(box(group,'Settee arm rail',.13,.04,.78,x,.92,-1.37,pale));}
 const joints=[];for(const x of[3.2,4.8]){joints.push(box(group,'Desk leg stretcher',.09,.07,.8,x,.30,-2.9,wood));joints.push(box(group,'Desk top joint',.14,.06,.95,x,.96,-2.9,pale));}
 joints.push(box(group,'Desk front apron',1.76,.12,.06,4,.92,-2.39,wood));
 const rack=new T.Group();rack.name='Original city continuous and broken edge rack';rack.position.set(-6.85,2.15,1.1);rack.rotation.y=Math.PI/2;rack.userData={quarterArtist:'morisot',quarterAction:'painting'};group.add(rack);
 const backing=box(rack,'Rack backing',1.72,1.02,.06,0,0,0,wood);for(const x of[-.63,.63])box(rack,'Wall spacer',.12,.12,.02,x,0,-.04,wood);
 for(const y of[-.49,.49])box(rack,'Rack horizontal rail',1.72,.04,.06,0,y,.06,pale);for(const x of[-.84,.84])box(rack,'Rack side rail',.04,.94,.06,x,0,.06,pale);
 const cards=[];for(const y of[.22,-.22]){cards.push(box(rack,'City edge card',1.5,.34,.012,0,y,.036,paper));box(rack,'Card retaining lip',1.52,.025,.03,0,y-.1825,.05,pale);}
 const strokes=[box(rack,'Continuous city line',1.2,.014,.002,0,.22,.044,ink)];for(const x of[-.52,-.26,0,.26,.52])strokes.push(box(rack,'Interrupted city line',.16,.014,.002,x,-.22,.044,ink));
 let disposed=false;return{group,roofFrames,rail,brackets,hangers,tabs,cushion,arms,joints,rack,backing,cards,strokes,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();hangers.removeFromParent();for(const r of owned)r.dispose();group.clear();hangers.clear();}};
}
