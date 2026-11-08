// Additions to the original gallery; no borrowed resource is edited or disposed.
export function buildKandinskyDetails(T,house){
 const group=new T.Group();group.name='Kandinsky · interval cards and joinery';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshStandardMaterial({color:c,roughness:.9}));
 const wood=mat('#796951'),ochre=mat('#c3a15e'),blue=mat('#426784'),paper=mat('#f2e9d2'),ink=mat('#3e474e');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const rakes=[];for(const z of[-3.375,3.375])for(const end of[-3.83,3.83]){const run=.4-end;const o=box(group,'Offset roof rake',Math.hypot(run,1.35),.065,.065,(end+.4)/2,3.675,z,ochre);o.rotation.z=Math.atan(1.35/run);rakes.push(o);}
 box(group,'Offset ridge cap',.09,.07,6.75,.4,4.385,0,ochre);for(const x of[-3.84,3.84])box(group,'Offset eave fascia',.07,.09,6.75,x,3.005,0,ochre);
 box(group,'Window sill',1.55,.075,.25,-2.2,1.005,3.12,blue);box(group,'Window header',1.55,.07,.14,-2.2,2.235,3.15,blue);
 const pads=[];for(const [i,x]of[-.5,.5].entries()){
  pads.push(box(group,'Supported seat pad',.94,.045,.60,x,.5475,.5,i?ochre:blue));
  for(const z of[.215,.785])box(group,'Seat binding',.91,.006,.012,x,.571,z,paper);
 }
 for(const x of[-.97,.97])box(group,'Bench end joint',.07,.08,.62,x,.47,.5,ochre);
 box(group,'Worktable apron',1.12,.12,.055,2.03,.665,1.95,ink);for(const x of[1.51,2.55])box(group,'Table corner cap',.13,.06,.08,x,.735,1.96,ochre);
 const panel=new T.Group();panel.name='Original city interval cards';panel.position.set(3.365,1.65,1.65);panel.rotation.y=-Math.PI/2;panel.userData={kandinskyGuide:true};group.add(panel);
 box(panel,'Panel backing',1.18,.78,.055,0,0,0,wood);for(const x of[-.45,.45])box(panel,'Wall spacer',.10,.10,.02,x,0,-.0365,wood);
 const cards=[],pairs=[];for(const [i,x]of[-.285,.285].entries()){
  cards.push(box(panel,'Interval card',.50,.58,.012,x,0,.0335,paper));box(panel,'Card retaining lip',.50,.024,.025,x,-.29,.045,ochre);
  box(panel,'Card header rule',.34,.008,.002,x,.20,.041,ink);
  const gap=i?.16:.08,circle=new T.Mesh(own(new T.CircleGeometry(.06,24)),blue),triangle=new T.Mesh(own(new T.CircleGeometry(.075,3)),ochre);
  circle.name='Unchanged blue circle';circle.position.set(x-gap,-.015,.042);triangle.name='Unchanged ochre triangle';triangle.position.set(x+gap,-.015,.042);triangle.rotation.z=Math.PI/2;panel.add(circle,triangle);pairs.push({circle,triangle});
 }
 let disposed=false;return{group,panel,pads,rakes,cards,pairs,targets:[panel],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
