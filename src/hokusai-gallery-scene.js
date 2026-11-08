// Modern city details around the original prints; no historical-room reconstruction.
export function buildHokusaiDetails(T,house){
 const group=new T.Group();group.name='Hokusai · print ledge and joinery';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshStandardMaterial({color:c,roughness:.9}));
 const wood=mat('#77634d'),pale=mat('#d6c39b'),blue=mat('#48647b'),paper=mat('#f1e9d5');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const rakes=[];for(const z of[-3.375,3.375])for(const end of[-4.05,4.05]){const o=box(group,'Wide eave rake',Math.hypot(end,1.35),.065,.065,end/2,3.675,z,pale);o.rotation.z=-Math.atan(1.35/end);rakes.push(o);}
 for(const x of[-4.06,4.06])box(group,'Wide eave fascia',.07,.09,6.75,x,3.005,0,pale);
 box(group,'Window sill',1.55,.075,.25,-2.2,1.005,3.12,blue);box(group,'Window header',1.55,.07,.14,-2.2,2.235,3.15,blue);
 const originalBench=house.group.children.find(o=>o.geometry?.parameters?.width===2.05),seat=new T.Group();seat.name='Hokusai seat details';seat.userData={...originalBench.userData};group.add(seat);
 const seatMat=box(seat,'Supported striped seat mat',1.92,.025,.60,0,.5375,.5,blue);for(let i=0;i<10;i++)box(seat,'Seat weave stripe',1.88,.003,.009,0,.551,.23+i*.06,pale);
 for(const x of[-.85,.85])for(const z of[.24,.76]){const peg=new T.Mesh(own(new T.CylinderGeometry(.014,.014,.004,10)),wood);peg.name='Seat tie';peg.position.set(x,.552,z);seat.add(peg);}
 const facade=house.group.children.find(o=>o.userData.artistId===house.artistId&&o.geometry?.parameters?.width===.12),pegs=[];
 for(const x of[1.36,3.04])for(const y of[.65,1.28,1.91,2.55]){const peg=box(group,'Lattice joint cap',.16,.13,.018,x,y,3.16,pale);peg.userData={...facade.userData};pegs.push(peg);}
 box(group,'Worktable apron',1.12,.12,.055,2.03,.665,1.95,blue);
 const reading=new T.Group();reading.name='Hokusai reading ledge';reading.userData={hokusaiGuide:true};group.add(reading);
 const shelf=box(reading,'Supported reading shelf',1.42,.05,.18,-2.2,.59,2.80,wood);for(const x of[-2.75,-1.65])box(reading,'Wall shelf bracket',.055,.18,.14,x,.48,2.84,wood);
 const folio=new T.Group();folio.name='Original city near and far folio';folio.position.set(-2.2,.795,2.865);folio.rotation.y=Math.PI;reading.add(folio);
 box(folio,'Folio backing',1.30,.36,.035,0,0,0,blue);for(const x of[-.49,.49])box(folio,'Wall spacer',.08,.08,.0275,x,0,-.03125,wood);
 box(folio,'Folio paper',1.17,.27,.008,0,0,.0215,paper);box(folio,'Folio fold',.009,.26,.003,0,0,.027,pale);
 for(const side of[-1,1])for(const row of[-1,1]){box(folio,'Viewing corner horizontal',.10,.009,.002,side*.49,row*.10,.027,blue);box(folio,'Viewing corner vertical',.009,.055,.002,side*.535,row*.077,.027,blue);}
 box(folio,'Near post',.065,.15,.003,-.34,-.015,.028,wood);box(folio,'Near post branch',.16,.018,.003,-.32,.018,.028,wood);box(folio,'Distant horizon',.34,.008,.003,.28,-.074,.028,blue);
 const mountain=new T.Mesh(own(new T.CircleGeometry(.065,3)),blue);mountain.name='Distant city mountain';mountain.position.set(.28,-.0375,.030);mountain.rotation.z=Math.PI/2;folio.add(mountain);
 let disposed=false;return{group,reading,folio,shelf,seat,seatMat,pegs,rakes,targets:[reading],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
