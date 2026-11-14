// Owned details for the fictional gallery; the source sculpture study and photographs stay intact.
export function buildRodinDetails(T,house){
 const group=new T.Group();group.name='Rodin · surface cabinet and hip-roof joinery';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshStandardMaterial({color:c,roughness:.9}));
 const wood=mat('#665a49'),pale=mat('#cfbea0'),bronze=mat('#596955'),paper=mat('#f2ebdc'),stone=mat('#b6b1a5');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const ribs=[];for(const side of[-1,1])for(const x of[-3.83,3.83]){
  const from=new T.Vector3(x,3,side*3.36),to=new T.Vector3(0,4.1,side*1.45),delta=to.clone().sub(from),mid=from.clone().add(to).multiplyScalar(.5);
  const rib=box(group,'Hip roof rib',delta.length(),.065,.065,mid.x,mid.y,mid.z,pale);rib.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),delta.normalize());ribs.push(rib);
 }
 box(group,'Hip ridge cap',.085,.065,2.9,0,4.125,0,pale);for(const x of[-3.84,3.84])box(group,'Side eave fascia',.065,.085,6.75,x,3.005,0,pale);for(const z of[-3.37,3.37])box(group,'End eave fascia',7.68,.085,.065,0,3.005,z,pale);
 box(group,'Window sill',1.55,.075,.25,-2.2,1.005,3.12,bronze);box(group,'Window header',1.55,.07,.14,-2.2,2.235,3.15,bronze);
 const bench=house.group.children.find(o=>o.geometry?.parameters?.width===2.05),seat=new T.Group();seat.name='Rodin bench details';seat.userData={...bench.userData};group.add(seat);
 const slats=[];for(const z of[.28,.5,.72]){slats.push(box(seat,'Supported seat board',1.95,.035,.18,0,.5425,z,wood));for(const x of[-.85,.85])box(seat,'Seat board joint',.035,.004,.035,x,.562,z,pale);}
 box(group,'Worktable apron',1.12,.12,.055,2.03,.665,1.95,bronze);
 const plinth=house.group.children.find(o=>o.geometry?.parameters?.width===.58),caps=[];for(const [y,h]of[[.585,.02],[.0425,.035]]){const cap=box(group,'Sculpture plinth collar',.62,h,.52,-2.2,y,3.47,stone);cap.userData={...plinth.userData};caps.push(cap);}
 const cabinet=new T.Group();cabinet.name='Original city surface-study cabinet';cabinet.position.set(3.365,1.65,1.65);cabinet.rotation.y=-Math.PI/2;cabinet.userData={rodinGuide:true};group.add(cabinet);
 const backing=box(cabinet,'Cabinet backing',1.28,.90,.06,0,0,0,wood);for(const x of[-.48,.48])box(cabinet,'Wall spacer',.10,.10,.015,x,0,-.0375,wood);
 for(const y of[-.4275,.4275])box(cabinet,'Cabinet horizontal frame',1.28,.045,.075,0,y,.0675,pale);for(const x of[-.6125,.6125])box(cabinet,'Cabinet vertical frame',.055,.81,.075,x,0,.0675,pale);
 const tiles=[],cards=[];for(const [i,x]of[-.29,.29].entries()){
  tiles.push(box(cabinet,i?'Pale smooth digital tile':'Dark ridged digital tile',.42,.37,.032,x,.12,.046,i?stone:bronze));
  cards.push(box(cabinet,'Two-line object index card',.47,.20,.008,x,-.255,.034,paper));for(const y of[-.22,-.285])box(cabinet,'Object record rule',.32,.009,.002,x,y,.039,bronze);
  box(cabinet,'Card retaining lip',.49,.025,.026,x,-.3625,.043,pale);
 }
 for(const x of[-.425,-.335,-.245,-.155])box(cabinet,'Digital surface ridge',.012,.28,.006,x,.12,.065,wood);
 let disposed=false;return{group,cabinet,backing,tiles,cards,seat,slats,caps,ribs,targets:[cabinet],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
