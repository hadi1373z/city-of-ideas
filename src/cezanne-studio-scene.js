// Additive city details; the original studio, painting and live study stay intact.
export function buildCezanneDetails(T,house){
 const group=new T.Group();group.name='Cézanne · tabletop reading board and joinery';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshLambertMaterial({color:c}));
 const wood=mat('#84694e'),pale=mat('#d8c5a0'),ink=mat('#485e59'),paper=mat('#f0e7d4');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 function line(parent,name,a,b,width,depth,m){const delta=b.clone().sub(a),mid=a.clone().add(b).multiplyScalar(.5),o=box(parent,name,delta.length(),width,depth,mid.x,mid.y,mid.z,m);o.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),delta.normalize());return o;}
 const rakes=[];for(const z of[-6.5,6.7])for(const x of[-7.5,7.5])rakes.push(line(group,'Gable rake',new T.Vector3(x,4.3,z),new T.Vector3(0,5.8,z),.08,.08,pale));
 box(group,'Gable ridge cap',.10,.08,13.28,0,5.84,.1,pale);for(const x of[-7.51,7.51])box(group,'Side eave fascia',.08,.10,13.28,x,4.3,.1,pale);
 const caps=[];for(const x of[-6.8,-1.8,1.8,6.8])for(const y of[1.03,3.38])caps.push(box(group,'Front window joint cap',.08,.075,.03,x,y,6.205,wood));
 const aprons=[];for(const z of[-2.63,-.97])aprons.push(box(group,'Still-life table apron',2.62,.14,.07,-4,.95,z,wood));
 for(const x of[-5.2,-2.8])box(group,'Still-life table joint',.17,.08,.17,x,1,-1.15,pale);
 for(const z of[-3.405,-2.395])aprons.push(box(group,'Drawing desk apron',1.76,.14,.07,4,.9,z,wood));
 const drawer=box(group,'Drawing desk drawer face',1.4,.12,.025,4,.91,-2.3475,pale);
 const board=new T.Group();board.name='Original city table-outline board';board.position.set(-6.85,2.15,1.1);board.rotation.y=Math.PI/2;board.userData={quarterArtist:'cezanne',quarterAction:'painting'};group.add(board);
 const backing=box(board,'Board backing',2.08,.96,.06,0,0,0,wood);for(const x of[-.78,.78])box(board,'Wall spacer',.12,.12,.02,x,0,-.04,wood);
 for(const y of[-.46,.46])box(board,'Board horizontal rail',2.08,.04,.06,0,y,.06,pale);for(const x of[-1.02,1.02])box(board,'Board side rail',.04,.88,.06,x,0,.06,pale);
 const cards=[],outlines=[];for(const [i,x]of[-.49,.49].entries()){
  cards.push(box(board,'City observation card',.88,.72,.012,x,0,.036,paper));box(board,'Card retaining lip',.9,.025,.03,x,-.3725,.05,pale);
  const points=i?[[-.29,-.12],[.30,-.20],[.22,.16],[-.23,.24]]:[[-.29,-.20],[.29,-.20],[.29,.20],[-.29,.20]];
  for(let j=0;j<4;j++){const a=points[j],b=points[(j+1)%4];outlines.push(line(board,'Original tabletop outline',new T.Vector3(x+a[0],a[1],.044),new T.Vector3(x+b[0],b[1],.044),.012,.002,ink));}
 }
 let disposed=false;return{group,board,backing,cards,outlines,rakes,caps,aprons,drawer,targets:[board],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
