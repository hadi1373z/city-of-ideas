// Owned, supported additions in the original source house's local frame.
export function buildDaliDetails(T,house){
 const group=new T.Group();group.name='Dalí · observation and association rack';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=color=>own(new T.MeshStandardMaterial({color,roughness:.88}));
 const wood=mat('#795942'),gold=mat('#c5a36c'),paper=mat('#f0e5cf'),ink=mat('#4c6665'),linen=mat('#d2b791');
 function box(parent,name,w,h,d,x,y,z,material){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),material);o.name=name;o.position.set(x,y,z);parent.add(o);return o;}
 const roof=house.group.children.find(o=>o.geometry?.parameters?.width===12.7),roofTrim=new T.Group();roofTrim.name='Source-fit offset roof trim';roofTrim.position.copy(roof.position);roofTrim.quaternion.copy(roof.quaternion);group.add(roofTrim);
 for(const z of[-5.35,5.35])box(roofTrim,'Roof end fascia',12.7,.12,.055,0,-.08,z,gold);
 for(const x of[-6.35,6.35])box(roofTrim,'Roof side fascia',.055,.12,10.7,x,-.08,0,gold);
 for(const x of[-1.84,1.84])box(group,'Door joint',.08,2.8,.245,x,1.4,5,wood);
 const chair=house.group.children.find(o=>o.userData.daliObjectId==='dream-chair'&&o.geometry?.parameters?.width===1.2),seat=new T.Group();seat.name='Supported dream-chair cover';seat.userData={...chair.userData};group.add(seat);
 const pad=box(seat,'Linen seat pad',1.04,.04,.86,-3,.63,1,linen);for(const z of[.59,1.41])box(seat,'Seat seam',.98,.004,.012,-3,.652,z,gold);
 const cabinetCap=box(group,'Reading cabinet cornice',.72,.07,3.1,4.9,2.69,0,wood);cabinetCap.userData={artistId:'dali',daliObjectId:'drawer-library'};
 for(const x of[2.15,3.85])box(group,'Clock desk side apron',.055,.14,.95,x,.715,3,wood);
 for(const x of[2.25,3.75])box(group,'Clock desk leg joint',.16,.05,.14,x,.76,3,gold);
 const panel=new T.Group();panel.name='Original city observation and association rack';panel.position.set(-5.82,1.65,2.6);panel.rotation.y=Math.PI/2;panel.userData={daliGuide:true};group.add(panel);
 const backing=box(panel,'Rack backing',1.8,.82,.052,0,0,0,wood),spacers=[];
 for(const x of[-.65,.65])spacers.push(box(panel,'Wall spacer',.10,.12,.044,x,0,-.048,wood));
 box(panel,'Paper retaining ledge',1.8,.055,.11,0,-.36,.029,gold);
 const cards=[];for(const x of[-.42,.42])cards.push(box(panel,'Original city prompt card',.73,.57,.012,x,.015,.032,paper));
 function ring(x,r){const o=new T.Mesh(own(new T.RingGeometry(r-.012,r,32)),ink);o.name='Outlined observation mark';o.position.set(x,.10,.039);panel.add(o);return o;}
 const marks=[ring(-.42,.10),ring(.28,.10),ring(.59,.055)];
 box(panel,'Association connector',.15,.014,.003,.455,.10,.0405,ink);
 for(const x of[-.42,.42])for(const y of[-.09,-.17])box(panel,'Unwritten description rule',.46,.009,.003,x,y,.0405,gold);
 panel.traverse(o=>o.userData={...o.userData,daliGuide:true});
 let disposed=false;return{group,roof,roofTrim,seat,pad,cabinetCap,panel,backing,cards,spacers,marks,targets:[panel],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
