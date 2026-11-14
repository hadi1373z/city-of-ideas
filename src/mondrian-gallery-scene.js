// Owned local details follow the original opposite-row gallery, including its pi turn.
export function buildMondrianDetails(T,house){
 const group=new T.Group();group.name='Mondrian · interval tray and gallery joinery';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=c=>own(new T.MeshStandardMaterial({color:c,roughness:.9}));
 const wood=mat('#776451'),pale=mat('#d6c5a7'),ink=mat('#3d4a50'),paper=mat('#f2eddf'),blue=mat('#536c7c');
 function box(parent,name,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const rakes=[];for(const z of[-3.36,3.36])for(const x of[-3.83,3.83]){const from=new T.Vector3(x,3,z),to=new T.Vector3(0,4.35,z),delta=to.clone().sub(from),mid=from.clone().add(to).multiplyScalar(.5),o=box(group,'Gable rake',delta.length(),.065,.065,mid.x,mid.y,mid.z,pale);o.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),delta.normalize());rakes.push(o);}
 box(group,'Gable ridge cap',.085,.065,6.72,0,4.375,0,pale);for(const x of[-3.84,3.84])box(group,'Eave fascia',.065,.085,6.75,x,3.005,0,pale);
 box(group,'Window sill',1.55,.075,.25,-2.2,1.005,3.12,ink);box(group,'Window header',1.55,.07,.14,-2.2,2.235,3.15,ink);
 const bench=house.group.children.find(o=>o.geometry?.parameters?.width===2.05),seat=new T.Group();seat.name='Mondrian fitted bench pads';seat.userData={...bench.userData};group.add(seat);
 const pads=[];for(const [i,x]of[-.5,.5].entries()){pads.push(box(seat,'Supported linen seat pad',.90,.04,.58,x,.545,.5,i?pale:blue));for(const z of[.22,.78])box(seat,'Seat pad seam',.86,.003,.009,x,.5665,z,paper);}
 box(group,'Worktable apron',1.12,.12,.055,2.03,.665,1.95,ink);for(const x of[1.51,2.55])box(group,'Worktable joint cap',.12,.06,.08,x,.735,1.96,pale);
 const facade=house.group.children.find(o=>o.userData.artAction==='profile'&&o.geometry?.parameters?.width===1.7),corners=[];
 for(const x of[1.35,3.05])for(const y of[.96,2.34]){const o=box(group,'Facade grid corner cap',.055,.055,.012,x,y,3.1585,pale);o.userData={...facade.userData};corners.push(o);}
 const tray=new T.Group();tray.name='Original city fixed interval tray';tray.userData={mondrianGuide:true};group.add(tray);
 const base=box(tray,'Supported tray base',.95,.025,.16,2.03,.8325,1.89,wood),sheet=box(tray,'Ruled tray sheet',.90,.004,.142,2.03,.847,1.89,paper);
 for(const x of[1.565,2.495])box(tray,'Tray end rail',.02,.02,.16,x,.855,1.89,pale);for(const z of[1.814,1.966])box(tray,'Tray long rail',.91,.02,.008,2.03,.855,z,pale);
 const strips=[];for(const [i,z]of[1.855,1.925].entries()){
  const baseline=box(tray,'Equal-width ruled strip',.78,.006,.006,2.03,.852,z,ink),ends=[];
  for(const x of[1.64,2.42])ends.push(box(tray,'Strip endpoint',.009,.006,.04,x,.852,z,ink));
  const marker=box(tray,'Fixed interval marker',.012,.006,.04,i?2.16:1.90,.852,z,blue);strips.push({baseline,ends,marker});
 }
 let disposed=false;return{group,tray,base,sheet,strips,seat,pads,corners,rakes,targets:[tray],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
