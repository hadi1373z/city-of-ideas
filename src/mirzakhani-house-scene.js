// Owned additions to the existing hall. The roof, metric model and colliders stay borrowed.
export function buildMirzakhaniDetails(T,house){
 const group=new T.Group();group.name='Mirzakhani · ruler reading corner';house.group.add(group);
 const owned=new Set(),own=r=>(owned.add(r),r),mat=colour=>own(new T.MeshLambertMaterial({color:colour}));
 const wood=mat(0x765039),pale=mat(0xd8d3b7),teal=mat(0x48848c),paper=mat(0xf4ead2),ink=mat(0x28494c),gold=mat(0xb79548);
 const box=(p,w,h,d,x,y,z,m)=>{const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);p.add(o);return o;};
 // Follow the actual sampled source ribbons, including each strip's distinct height.
 const roofs=house.group.children.filter(o=>o.isMesh&&o.geometry.type==='BufferGeometry'&&o.geometry.attributes.position.count===66&&o.geometry.index?.count===192),edges=[];
 if(roofs.length!==5)throw Error('Expected the five original vaulted ribbons');
 for(const [strip,roof]of roofs.entries())for(const side of[0,1]){
  const vertices=[],indices=[],source=roof.geometry.attributes.position;
  for(let i=0;i<33;i++){const j=i*2+side,x=source.getX(j),y=source.getY(j),z=source.getZ(j);for(const [dy,dz]of[[-.06,-.035],[-.06,.035],[.012,.035],[.012,-.035]])vertices.push(x,y+dy,z+dz);if(i<32)for(let k=0;k<4;k++){const a=i*4+k,b=i*4+(k+1)%4;indices.push(a,b,a+4,b,b+4,a+4);}}
  indices.push(0,2,1,0,3,2,128,129,130,128,130,131);
  const geometry=own(new T.BufferGeometry());geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const edge=new T.Mesh(geometry,pale);edge.name='Vault ribbon edging · '+strip+' / '+side;group.add(edge);edges.push(edge);
 }
 // Post joints stay on the stone bands, leaving the original glazing apertures clear.
 const joints=new T.InstancedMesh(own(new T.BoxGeometry(.28,.09,.26)),teal,20);joints.name='Glazing post joints';let joint=0;
 for(const x of[-13,13])for(const z of[-10,-5,0,5,10])for(const y of[1.055,4.145])joints.setMatrixAt(joint++,new T.Matrix4().makeTranslation(x,y,z));
 joints.instanceMatrix.needsUpdate=true;joints.computeBoundingSphere?.();group.add(joints);
 const slats=[];for(const x of[-6.8,6.8])for(const z of[3.67,4,4.33]){const slat=box(group,3.32,.04,.28,x,.66,z,pale);slat.name='Supported pale bench slat';slats.push(slat);}
 for(const z of[-4.85,-3.15])box(group,3,.2,.1,6.3,.82,z,wood);
 for(const x of[4.85,7.75])box(group,.1,.2,1.7,x,.82,-4,wood);
 for(const x of[4.8,7.8])for(const z of[-4.8,-3.2])box(group,.24,.22,.24,x,.81,z,wood);
 // A shallow rack is supported by the solid rear wall, outside every walking lane.
 const rack=new T.Group();rack.name='Mirzakhani · equal-drawing ruler rack';rack.position.set(6.3,2.35,-10.72);group.add(rack);
 box(rack,2.9,1.52,.08,0,0,0,wood);box(rack,3,.09,.18,0,-.8,.015,wood);
 for(const x of[-1.18,1.18])box(rack,.1,1.28,.115,x,0,-.0975,teal);
 const cards=[],segments=[];
 for(const [i,cx]of[-.7,.7].entries()){
  const card=box(rack,1.22,1.32,.014,cx,0,.047,paper);card.name='Equal drawing card · '+(i+1);cards.push(card);
  const rim=new T.Mesh(own(new T.TorusGeometry(.44,.012,6,64)),teal);rim.position.set(cx,.14,.07);rack.add(rim);
  const a=i===0?-.1:.7,b=i===0?.1:.9,segment=box(rack,(b-a)*.44,.025,.012,cx+(a+b)/2*.44,.14,.078,gold);segment.name='Equal drawn segment · '+(i+1);rack.add(segment);segments.push(segment);
  for(const r of[a,b]){const dot=new T.Mesh(own(new T.CircleGeometry(.018,12)),ink);dot.position.set(cx+r*.44,.14,.087);rack.add(dot);}
  for(let j=0;j<=i;j++)box(rack,.035,.07,.008,cx+(j-i/2)*.09,-.45,.062,ink);
 }
 group.traverse(o=>{o.userData={hourlyMirzakhaniDetail:true};});rack.traverse(o=>{o.userData={hourlyMirzakhaniDetail:true,seminarHouse:'mirzakhani',seminarAction:'reading'};});
 let disposed=false;return{group,rack,cards,segments,edges,roofs,slats,targets:[rack],dispose(){if(disposed)return;disposed=true;group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
