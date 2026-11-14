// Additions belong to this fictional gallery, not Van Gogh's historical room.
export function buildVanGoghDetails(T,house){
 const group=new T.Group();group.name='Van Gogh · comparison rack and gallery details';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshStandardMaterial({color:c,roughness:.9}));
 const blue=mat('#526b83'),ochre=mat('#c7a45e'),wood=mat('#806548'),paper=mat('#f3ead4'),ink=mat('#58615c');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 for(const z of[-3.375,3.375])for(const side of[-1,1]){const o=box(group,'High gable trim',Math.hypot(3.83,1.7),.07,.07,side*1.915,3.85,z,ochre);o.rotation.z=-side*Math.atan2(1.7,3.83);}
 for(const x of[-3.84,3.84])box(group,'Eave edge',.075,.10,6.75,x,3.005,0,ochre);
 box(group,'Window sill',1.55,.075,.25,-2.2,1.005,3.12,blue);box(group,'Window header',1.55,.07,.14,-2.2,2.235,3.15,blue);
 const pads=[];for(const [i,x]of[-.52,.52].entries()){
  const pad=box(group,'Supported seat pad',.8,.035,.52,x,.5425,.5,i?ochre:blue);pads.push(pad);
  for(const z of[.25,.75])box(group,'Pad seam',.77,.003,.009,x,.5615,z,paper);
 }
 for(const x of[-.96,.96])box(group,'Bench end joint',.07,.12,.5,x,.36,.5,wood);
 box(group,'Worktable front apron',1.12,.13,.055,2.03,.665,1.95,blue);
 const rack=new T.Group();rack.name='Looking and letters rack';rack.position.set(3.365,1.65,1.65);rack.rotation.y=-Math.PI/2;rack.userData={vanGoghGuide:true};group.add(rack);
 box(rack,'Rack backing',1.08,.70,.055,0,0,0,wood);
 for(const x of[-.4,.4])box(rack,'Wall spacer',.10,.10,.020,x,0,-.0365,wood);
 for(const x of[-.25,.25])box(rack,'Original city reading card',.43,.52,.012,x,0,.0335,paper);
 for(let i=0;i<4;i++)box(rack,'Reading line',.28-i*.025,.009,.003,.25,.15-i*.085,.041,ink);
 for(const [i,m]of[blue,ochre,ink].entries())box(rack,'Colour strip',.28,.065,.003,-.25,.14-i*.135,.041,m);
 for(const y of[-.30,.30])box(rack,'Rack retaining rail',1.04,.035,.035,0,y,.035,ochre);
 // Backing rests against the original wall; no new floor obstacle or collider.
 let disposed=false;return{group,rack,pads,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
