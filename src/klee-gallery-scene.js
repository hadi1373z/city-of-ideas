// Owned additions follow the original pi-turned gallery, not a historical room.
export function buildKleeDetails(T,house){
 const group=new T.Group();group.name='Klee · neighbours board and gallery details';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshStandardMaterial({color:c,roughness:.9}));
 const wood=mat('#796653'),ochre=mat('#b99560'),blue=mat('#4a6979'),paper=mat('#f0e6d1'),red=mat('#a8614c'),linen=mat('#bdb196');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const rakes=[];for(const z of[-3.36,3.36])for(const x of[-3.83,3.83]){
  const from=new T.Vector3(x,3,z),to=new T.Vector3(.4,4.35,z),delta=to.clone().sub(from),mid=from.clone().add(to).multiplyScalar(.5),o=box(group,'Offset roof rake',delta.length(),.065,.065,mid.x,mid.y,mid.z,ochre);o.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),delta.normalize());rakes.push(o);
 }
 box(group,'Offset ridge cap',.09,.07,6.75,.4,4.385,0,ochre);for(const x of[-3.84,3.84])box(group,'Offset eave fascia',.07,.09,6.75,x,3.005,0,ochre);
 box(group,'Window sill',1.55,.075,.25,-2.2,1.005,3.12,blue);box(group,'Window header',1.55,.07,.14,-2.2,2.235,3.15,blue);
 const bench=house.group.children.find(o=>o.geometry?.parameters?.width===2.05),seat=new T.Group();seat.name='Klee bench cover';seat.userData={...bench.userData};group.add(seat);
 const pad=box(seat,'Supported woven seat cover',1.86,.035,.56,0,.5425,.5,linen);for(const z of[.23,.77])box(seat,'Cover seam',1.82,.003,.009,0,.5615,z,paper);
 box(group,'Worktable apron',1.12,.12,.055,2.03,.665,1.95,blue);for(const x of[1.51,2.55])box(group,'Worktable joint cap',.12,.06,.08,x,.735,1.96,ochre);
 const tiles=house.group.children.filter(o=>o.userData.artAction==='profile'&&o.geometry?.parameters?.width===.54),clips=[];
 for(const tile of tiles)for(const dx of[-.24,.24]){const o=box(group,'Facade tile keeper',.035,.08,.012,tile.position.x+dx,tile.position.y,3.1585,wood);o.userData={...tile.userData};clips.push(o);}
 const panel=new T.Group();panel.name='Original city neighbours board';panel.position.set(3.365,1.65,1.65);panel.rotation.y=-Math.PI/2;panel.userData={kleeGuide:true};group.add(panel);
 const backing=box(panel,'Board backing',1.32,.76,.048,0,0,0,wood);for(const x of[-.48,.48])box(panel,'Wall spacer',.10,.10,.021,x,0,-.0345,wood);
 for(const y of[-.36,.36])box(panel,'Board horizontal rail',1.32,.04,.07,0,y,.059,ochre);for(const x of[-.64,.64])box(panel,'Board side rail',.04,.68,.07,x,0,.059,ochre);
 const cards=[],rows=[],orders=[['circle','square','triangle'],['triangle','circle','square']];
 for(const [row,y]of[.17,-.17].entries()){
  cards.push(box(panel,'Arrangement card',1.14,.27,.012,0,y,.030,paper));box(panel,'Card retaining lip',1.16,.02,.035,0,y-.145,.0415,ochre);
  const tokens=[];for(const [i,shape]of orders[row].entries()){
   const geometry=shape==='square'?new T.PlaneGeometry(.12,.12):new T.CircleGeometry(shape==='circle'?.06:.075,shape==='circle'?24:3),o=new T.Mesh(own(geometry),{circle:red,square:blue,triangle:ochre}[shape]);
   o.name='Unchanged '+shape;o.userData={shape};o.position.set((i-1)*.35,y,.037);if(shape==='triangle')o.rotation.z=Math.PI/2;panel.add(o);tokens.push(o);
  }rows.push(tokens);
 }
 let disposed=false;return{group,panel,backing,cards,rows,orders,seat,pad,clips,rakes,targets:[panel],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
