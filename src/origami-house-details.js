// Owned room details; the source roof, furniture and live paper models stay intact.
export function buildOrigamiHouseDetails(T,house){
 const group=new T.Group();group.name='Origami · face and footprint reading';house.group.add(group);
 const resources=new Set(),own=r=>(resources.add(r),r),mat=c=>own(new T.MeshLambertMaterial({color:c}));
 const timber=mat('#806347'),binding=mat('#b99f70'),paper=mat('#f0e7ce'),ink=mat('#4d6971');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const roofPoints=[[-9.7,4.15],[-5,6],[0,4.5],[5,6],[9.7,4.15]],roofEdges=[];
 for(const z of[-8.6175,8.6175])for(let i=0;i<4;i++){const a=roofPoints[i],b=roofPoints[i+1],edge=box(group,'Folded roof edge binding',Math.hypot(b[0]-a[0],b[1]-a[1]),.06,.035,(a[0]+b[0])/2,(a[1]+b[1])/2-.065,z,binding);edge.rotation.z=Math.atan2(b[1]-a[1],b[0]-a[0]);roofEdges.push(edge);}
 for(const[x,y]of roofPoints)for(const z of[-8.05,7.75])if(x!==0||z<0)box(group,'Supported beam joint',.20,.06,.20,x,y-.23,z,timber);
 for(const x of[-1.6,1.6])for(const y of[.18,3.35])box(group,'Door post strap',.10,.13,.022,x,y,8.201,binding);
 const slats=[];for(const x of[-6,6]){for(const dx of[-.97,0,.97])slats.push(box(group,'Supported pale seat slat',.88,.035,.55,x+dx,.5775,5.8,paper));for(const dx of[-1.2,1.2])box(group,'Bench leg cap',.16,.03,.55,x+dx,.425,5.8,timber);box(group,'Drawer cornice',3.7,.08,.50,x,1.74,-7.5,timber);}
 const aprons=[],joints=[];for(const[x,z,w,d,h]of[[0,-2.7,5.6,4.7,.8],[-5.7,-2.5,2.8,3,1],[5.7,-2.5,2.8,3,1]]){
  for(const dz of[-d/2+.19,d/2-.19])aprons.push(box(group,'Worktable apron',w-.32,.12,.06,x,h-.12,z+dz,timber));
  for(const dx of[-w/2+.19,w/2-.19])aprons.push(box(group,'Worktable side apron',.06,.12,d-.32,x+dx,h-.12,z,timber));
  for(const dx of[-w/2+.22,w/2-.22])for(const dz of[-d/2+.22,d/2-.22])joints.push(box(group,'Worktable leg joint',.15,.07,.15,x+dx,h-.095,z+dz,timber));
 }
 const rack=new T.Group();rack.name='Original city face and footprint rack';rack.position.set(8.82,2.15,6.4);rack.rotation.y=-Math.PI/2;group.add(rack);
 const backing=box(rack,'Rack backing',1.80,.86,.052,0,0,0,timber),spacers=[];for(const x of[-.67,.67])spacers.push(box(rack,'Wall spacer',.12,.14,.044,x,0,-.048,timber));
 box(rack,'Supporting ledge',1.80,.045,.11,0,-.37,.029,binding);
 const cards=[];for(const x of[-.43,.43])cards.push(box(rack,'Original city reading card',.77,.65,.012,x,0,.032,paper));
 const facePoints=[[-.28,-.18],[.12,-.18],[.28,.18],[-.12,.18]],faceGeo=own(new T.BufferGeometry());faceGeo.setAttribute('position',new T.Float32BufferAttribute(facePoints.flatMap(([x,y])=>[x-.43,y,.040]),3));faceGeo.setIndex([0,1,2,0,2,3]);faceGeo.computeVertexNormals();const face=new T.Mesh(faceGeo,ink);face.name='Fixed filled face symbol';rack.add(face);
 const frame=[];for(const y of[-.20,.20])for(const x of[-.25,-.15,-.05,.05,.15,.25])frame.push(box(rack,'Broken footprint rule',.06,.012,.002,.43+x,y,.040,ink));for(const x of[-.28,.28])for(const y of[-.15,-.05,.05,.15])frame.push(box(rack,'Broken footprint rule',.012,.06,.002,.43+x,y,.040,ink));
 rack.traverse(o=>o.userData={...o.userData,origamiHouseReading:true});let disposed=false;
 return{group,rack,backing,spacers,cards,face,frame,roofEdges,slats,aprons,joints,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of resources)r.dispose();group.clear();}};
}
