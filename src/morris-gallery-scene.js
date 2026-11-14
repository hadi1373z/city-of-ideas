// The repeated motif is an original city diagram, not a Morris pattern/sample.
export function buildMorrisDetails(T,house){
 const group=new T.Group();group.name='Morris · motif panel and joinery';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshStandardMaterial({color:c,roughness:.9}));
 const wood=mat('#846b4d'),pale=mat('#dbc79e'),green=mat('#50695a'),paper=mat('#f1e5cb'),red=mat('#a65d45');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 for(const z of[-3.375,3.375])for(const side of[-1,1]){const o=box(group,'Wide eave rake',Math.hypot(4.05,1.35),.065,.065,side*2.025,3.675,z,pale);o.rotation.z=-side*Math.atan2(1.35,4.05);}
 for(const x of[-4.06,4.06])box(group,'Wide eave fascia',.07,.09,6.75,x,3.005,0,pale);
 box(group,'Window sill',1.55,.075,.25,-2.2,1.005,3.12,wood);box(group,'Window header',1.55,.07,.14,-2.2,2.235,3.15,wood);
 const slats=[];for(const z of[.28,.5,.72]){
  slats.push(box(group,'Supported bench slat',2.01,.014,.18,0,.532,z,pale));
  for(const x of[-.82,.82]){const peg=new T.Mesh(own(new T.CylinderGeometry(.018,.018,.006,12)),wood);peg.name='Bench peg';peg.position.set(x,.542,z);group.add(peg);}
 }
 box(group,'Worktable apron',1.12,.12,.055,2.03,.665,1.95,green);
 const panel=new T.Group();panel.name='Original city motif panel';panel.position.set(3.365,1.65,1.65);panel.rotation.y=-Math.PI/2;panel.userData={morrisGuide:true};group.add(panel);
 box(panel,'Panel backing',1.18,.70,.055,0,0,0,wood);for(const x of[-.45,.45])box(panel,'Wall spacer',.10,.10,.02,x,0,-.0365,wood);
 box(panel,'Diagram ground',.98,.50,.012,0,0,.0335,paper);for(const x of[-.16,.16])box(panel,'Column division',.007,.48,.002,x,0,.041,pale);box(panel,'Row division',.96,.007,.002,0,0,.041,pale);
 for(const x of[-.32,0,.32])for(const y of[-.12,.12]){
  box(panel,'Motif stem',.012,.145,.003,x,y,.043,green);
  for(const side of[-1,1]){const leaf=new T.Mesh(own(new T.CircleGeometry(.045,16)),green);leaf.name='City leaf';leaf.position.set(x+side*.032,y-side*.024,.045);leaf.scale.y=.48;leaf.rotation.z=side*.5;panel.add(leaf);}
  const dot=new T.Mesh(own(new T.CircleGeometry(.018,12)),red);dot.name='City dot';dot.position.set(x,y+.073,.045);panel.add(dot);
 }
 for(const y of[-.3,.3])box(panel,'Panel retaining rail',1.14,.035,.035,0,y,.035,pale);
 let disposed=false;return{group,panel,slats,targets:[panel],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
