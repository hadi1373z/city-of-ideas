// Owned details follow the original opposite-row house; no historical room is reconstructed.
export function buildLangeDetails(T,house){
 const group=new T.Group();group.name='Lange · caption rack and gallery details';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshStandardMaterial({color:c,roughness:.9}));
 const wood=mat('#746452'),pale=mat('#cfc2a9'),ink=mat('#4e5c61'),paper=mat('#f0eadb'),linen=mat('#a49d8f');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const ribs=[];for(const side of[-1,1])for(const x of[-3.83,3.83]){const from=new T.Vector3(x,3,side*3.36),to=new T.Vector3(0,4.1,side*1.45),delta=to.clone().sub(from),mid=from.clone().add(to).multiplyScalar(.5),o=box(group,'Hip roof rib',delta.length(),.065,.065,mid.x,mid.y,mid.z,pale);o.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),delta.normalize());ribs.push(o);}
 box(group,'Hip ridge cap',.085,.065,2.9,0,4.125,0,pale);for(const x of[-3.84,3.84])box(group,'Side eave fascia',.065,.085,6.75,x,3.005,0,pale);for(const z of[-3.37,3.37])box(group,'End eave fascia',7.68,.085,.065,0,3.005,z,pale);
 box(group,'Window sill',1.55,.075,.25,-2.2,1.005,3.12,ink);box(group,'Window header',1.55,.07,.14,-2.2,2.235,3.15,ink);
 const bench=house.group.children.find(o=>o.geometry?.parameters?.width===2.05),seat=new T.Group();seat.name='Lange bench cover';seat.userData={...bench.userData};group.add(seat);
 const pad=box(seat,'Supported linen seat cover',1.86,.035,.56,0,.5425,.5,linen);for(const z of[.23,.77])box(seat,'Seat cover seam',1.82,.003,.009,0,.5615,z,paper);
 box(group,'Worktable apron',1.12,.12,.055,2.03,.665,1.95,ink);for(const x of[1.51,2.55])box(group,'Worktable joint cap',.12,.06,.08,x,.735,1.96,pale);
 const facade=house.group.children.find(o=>o.userData.artAction==='profile'&&o.geometry?.parameters?.width===.53),clips=[];
 for(const cx of[1.55,2.2,2.85])for(const dx of[-.24,.24])for(const y of[1.14,2.16]){const o=box(group,'Facade frame clip',.04,.04,.012,cx+dx,y,3.1585,pale);o.userData={...facade.userData};clips.push(o);}
 const rack=new T.Group();rack.name='Original city look record question rack';rack.position.set(3.365,1.6,1.65);rack.rotation.y=-Math.PI/2;rack.userData={langeGuide:true};group.add(rack);
 const backing=box(rack,'Rack backing',1.36,.62,.048,0,0,0,wood);for(const x of[-.50,.50])box(rack,'Wall spacer',.10,.10,.021,x,0,-.0345,wood);
 for(const y of[-.29,.29])box(rack,'Rack horizontal rail',1.36,.04,.07,0,y,.059,pale);for(const x of[-.66,.66])box(rack,'Rack side rail',.04,.54,.07,x,0,.059,pale);
 const cards=[];for(const x of[-.43,0,.43]){cards.push(box(rack,'Original city reading card',.36,.40,.012,x,0,.030,paper));box(rack,'Card retaining lip',.37,.02,.04,x,-.205,.044,pale);}
 for(const x of[-.54,-.32])box(rack,'Empty viewing frame side',.008,.16,.002,x,.035,.037,ink);for(const y of[-.045,.115])box(rack,'Empty viewing frame edge',.22,.008,.002,-.43,y,.037,ink);
 for(const y of[.07,.015,-.04])box(rack,'Unwritten record rule',.24,.008,.002,0,y,.037,ink);
 const question=[];for(const [w,h,x,y]of[[.085,.009,.43,.075],[.009,.055,.468,.045],[.045,.009,.448,.018],[.009,.04,.43,-.005],[.014,.014,.43,-.08]])question.push(box(rack,'Open question mark',w,h,.002,x,y,.037,ink));
 let disposed=false;return{group,rack,backing,cards,question,seat,pad,clips,ribs,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
