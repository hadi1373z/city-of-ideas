// Owned furnishings for the existing rotunda; the oscillator and shell stay borrowed.
export function buildNoetherDetails(T,house){
 const group=new T.Group();group.name='Noether · furnished reading desk';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=colour=>own(new T.MeshLambertMaterial({color:colour}));
 const wood=mat(0x765039),brass=mat(0xb79548),linen=mat(0xd8d3b7),piping=mat(0x54716b),paper=mat(0xf4ead2),ink=mat(0x28494c);
 const box=(p,w,h,d,x,y,z,m)=>{const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);p.add(o);return o;};
 // Both collars remain in the existing wall band; capitals are above head height.
 for(const [radius,height,y,name]of[[.17,.1,.05,'Column foot collars'],[.21,.12,5.24,'Column capital collars']]){
  const collars=new T.InstancedMesh(own(new T.CylinderGeometry(radius,radius,height,16)),brass,15);collars.name=name;
  for(let i=1;i<16;i++){const a=i/16*Math.PI*2;collars.setMatrixAt(i-1,new T.Matrix4().makeTranslation(Math.sin(a)*12.9,y,Math.cos(a)*12.9));}
  collars.instanceMatrix.needsUpdate=true;collars.computeBoundingSphere?.();group.add(collars);
 }
 for(const x of[-6.8,6.8]){
  const cushion=box(group,3.12,.12,.9,x,.7,4,linen);cushion.name='Supported linen bench cushion';
  for(const z of[3.57,4.43])box(group,3.08,.014,.025,x,.756,z,piping);
  for(const dx of[-1.535,1.535])box(group,.025,.014,.86,x+dx,.756,4,piping);
  for(const dx of[-1.67,1.67]){box(group,.12,.12,.88,x+dx,.85,4,wood);for(const z of[3.66,4.34])box(group,.1,.15,.1,x+dx,.715,z,wood);}
 }
 for(const x of[4.8,7.8])for(const z of[-4.8,-3.2])box(group,.24,.22,.24,x,.81,z,wood);
 for(const z of[-4.85,-3.15])box(group,3,.2,.1,6.3,.82,z,wood);
 for(const x of[4.85,7.75])box(group,.1,.2,1.7,x,.82,-4,wood);
 // Back-edge stand rests on the existing desktop and clears the original ruled sheet.
 const folio=new T.Group();folio.name='Noether · potential contour folio';folio.position.set(6.3,1.08,-4.95);group.add(folio);
 box(folio,1.9,.06,.28,0,.03,0,wood);box(folio,1.85,.72,.06,0,.42,0,wood);
 for(const x of[-.8,.8])box(folio,.06,.66,.06,x,.39,-.06,brass);
 const cards=[],contours=[];
 for(const [i,w]of[1,2].entries()){
  const x=i===0?-.45:.45,card=box(folio,.78,.62,.014,x,.43,.037,paper);card.name='Equal-potential card · omega '+w;cards.push(card);
  const points=Array.from({length:65},(_,j)=>{const a=j/64*Math.PI*2;return new T.Vector3(x+.21*Math.cos(a),.48+.21/w*Math.sin(a),.054);});
  const contour=new T.Mesh(own(new T.TubeGeometry(new T.CatmullRomCurve3(points),64,.009,6,false)),ink);contour.name='Potential contour · omega '+w;folio.add(contour);contours.push(contour);
  for(let j=0;j<w;j++)box(folio,.025,.055,.008,x+(j-(w-1)/2)*.07,.19,.048,ink);
 }
 group.traverse(o=>{o.userData={hourlyNoetherDetail:true};});folio.traverse(o=>{o.userData={hourlyNoetherDetail:true,seminarHouse:'noether',seminarAction:'reading'};});
 let disposed=false;return {group,folio,cards,contours,targets:[folio],dispose(){if(disposed)return;disposed=true;group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
