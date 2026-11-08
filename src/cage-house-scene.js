// Owned additions; the house, seeded score and audio-clock cursor remain borrowed.
export function buildCageDetails(T,house){
 const owned=new Set(),own=r=>(owned.add(r),r),mat=colour=>own(new T.MeshLambertMaterial({color:colour}));
 const wood=mat(0x765039),pale=mat(0xb8a27d),cloth=mat(0x687b73),paper=mat(0xf4ead2),ink=mat(0x28494c),gold=mat(0xb79548);
 const group=new T.Group();group.name='Cage · furnished listening desk';
 const box=(p,w,h,d,x,y,z,m)=>{const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);p.add(o);return o;};
 // Read the actual batched roof transforms rather than guessing the two panel angles.
 const roofs=[];for(const o of house.group.children)if(o.isInstancedMesh)for(let i=0;i<o.count;i++){
  const matrix=new T.Matrix4(),position=new T.Vector3(),rotation=new T.Quaternion(),scale=new T.Vector3();o.getMatrixAt(i,matrix);matrix.decompose(position,rotation,scale);
  if(Math.abs(scale.x-14.5)<1e-4&&Math.abs(scale.y-.22)<1e-4&&Math.abs(scale.z-24)<1e-4)roofs.push({position,rotation,scale});
 }
 if(roofs.length!==2)throw Error('Expected the two original timber roof panels');
 const fascias=[];for(const roof of roofs)for(const z of[-1,1]){const edge=box(group,roof.scale.x,.14,.08,0,0,0,pale);edge.position.copy(new T.Vector3(0,-.035,z*roof.scale.z/2).applyQuaternion(roof.rotation).add(roof.position));edge.quaternion.copy(roof.rotation);edge.name='Timber roof fascia';fascias.push(edge);}
 // Sills remain on stone, below the existing clear glazing apertures.
 for(const x of[-13,13])box(group,.28,.05,21.7,x,1.075,0,pale);
 for(const x of[-7.85,7.85])box(group,10.25,.05,.3,x,1.075,11,pale);
 const cushions=[];for(const x of[-6.8,6.8]){
  const cushion=box(group,3.12,.08,.88,x,.68,4,cloth);cushion.name='Supported woven bench pad';cushions.push(cushion);
  for(const z of[3.65,4,4.35])box(group,3.02,.012,.018,x,.726,z,pale);
 }
 for(const z of[-4.85,-3.15])box(group,3,.2,.1,6.3,.82,z,wood);
 for(const x of[4.85,7.75])box(group,.1,.2,1.7,x,.82,-4,wood);
 for(const x of[4.8,7.8])for(const z of[-4.8,-3.2])box(group,.24,.22,.24,x,.81,z,wood);
 const folio=new T.Group();folio.name='Cage · score and surroundings folio';folio.position.set(6.3,1.08,-4.95);group.add(folio);
 box(folio,1.9,.06,.28,0,.03,0,wood);box(folio,1.85,.76,.08,0,.44,0,wood);
 for(const x of[-.8,.8])box(folio,.06,.68,.06,x,.4,-.07,gold);
 const cards=[];for(const x of[-.45,.45])cards.push(box(folio,.78,.66,.014,x,.45,.047,paper));
 // A fixed legend: rest, then one/two/three dots for the three existing pitch choices.
 const rest=new T.Mesh(own(new T.TorusGeometry(.025,.007,6,20)),ink);rest.position.set(-.45,.67,.07);folio.add(rest);
 const dots=[];for(let row=1;row<=3;row++)for(let j=0;j<row;j++){const dot=new T.Mesh(own(new T.CircleGeometry(.018,12)),ink);dot.position.set(-.45+(j-(row-1)/2)*.07,.67-row*.14,.07);folio.add(dot);dots.push(dot);}
 const strokes=[];for(let row=0;row<3;row++){
  const points=Array.from({length:13},(_,i)=>new T.Vector3(.2+i/12*.5,.59-row*.14+.035*Math.sin(i/12*Math.PI*2+row*.8),.07));
  const stroke=new T.Mesh(own(new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.008,6,false)),ink);folio.add(stroke);strokes.push(stroke);
 }
 group.traverse(o=>{o.userData={hourlyCageDetail:true};});folio.traverse(o=>{o.userData={hourlyCageDetail:true,seminarHouse:'cage',seminarAction:'reading'};});house.group.add(group);
 let disposed=false;return{group,folio,cards,rest,dots,strokes,roofs,fascias,cushions,targets:[folio],dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
