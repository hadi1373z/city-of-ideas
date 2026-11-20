import {CENTRE as C,HOUSES,GARDENS,worldPoint,mobius} from './math-model.mjs';
export function buildCampus(T,scene){
 const mat=(c,extra={})=>new T.MeshStandardMaterial({color:c,roughness:.72,...extra}),stone=mat(0xe4e6df),dark=mat(0x183e4b),brass=mat(0xbc9250,{metalness:.65,roughness:.28}),glass=mat(0x82bdcd,{transparent:true,opacity:.2,metalness:.25,roughness:.12,side:T.DoubleSide,depthWrite:false}),grass=mat(0x527e69),path=mat(0xc4d4cc),white=new T.MeshBasicMaterial({color:0xf4f5dc});
 const cube=new T.BoxGeometry(1,1,1),rod=new T.CylinderGeometry(1,1,1,8);
 const box=(p,w,h,d,x,y,z,m)=>{const o=new T.Mesh(cube,m);o.scale.set(w,h,d);o.position.set(x,y,z);p.add(o);return o;};
 const beam=(p,a,b,r=.06,m=brass)=>{const u=new T.Vector3(...a),v=new T.Vector3(...b),o=new T.Mesh(rod,m),d=v.clone().sub(u);o.position.copy(u).add(v).multiplyScalar(.5);o.scale.set(r,d.length(),r);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());p.add(o);return o;};
 function label(p,text,x,y,z,width=11){const c=document.createElement('canvas');c.width=1024;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#173c48';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#f1d99e';ctx.font='40px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,64,980);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const o=new T.Mesh(new T.PlaneGeometry(width,width/8),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));o.position.set(x,y,z);p.add(o);return o;}
 const island=new T.Mesh(new T.CylinderGeometry(76,78,2,96),grass);island.position.set(C.x,-.9,C.z);scene.add(island);
 const ring=new T.Mesh(new T.RingGeometry(69.5,71,128),path);ring.rotation.x=-Math.PI/2;ring.position.set(C.x,.13,C.z);scene.add(ring);
 const plaza=new T.Mesh(new T.CylinderGeometry(24,24,.1,6),stone);plaza.position.set(C.x,.08,C.z);plaza.rotation.y=Math.PI/6;scene.add(plaza);
 const streets=[];
 function road(a,b,w=3.4){streets.push({a,b,w});const length=Math.hypot(b.x-a.x,b.z-a.z),o=box(scene,w,.05,length,(a.x+b.x)/2,.105,(a.z+b.z)/2,path);o.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);for(const side of[-1,1]){const offset=w/2+.12,dx=(b.z-a.z)/length*offset,dz=-(b.x-a.x)/length*offset;const edge=box(scene,.08,.035,length,(a.x+b.x)/2+side*dx,.1225,(a.z+b.z)/2+side*dz,brass);edge.rotation.y=o.rotation.y;}}
 const joints=HOUSES.map(h=>({x:C.x+31*Math.cos(h.angle),z:C.z+31*Math.sin(h.angle)}));
 for(let i=0;i<6;i++){road(joints[i],joints[(i+1)%6]);road({x:C.x+17*Math.cos(HOUSES[i].angle),z:C.z+17*Math.sin(HOUSES[i].angle)},joints[i],3);road(joints[i],worldPoint(HOUSES[i],0,6.8),4);}
 // A broad front approach is aligned with the real Atelier doorway, not its rear wall.
 road({x:C.x,z:C.z-31},{x:C.x,z:C.z-8.5},4);road({x:C.x,z:C.z+12},{x:C.x,z:C.z+31},4);
 const exhibits={},updates={};
 function floor(group,tint,index){const geom=index%2?new T.CylinderGeometry(.63,.63,.045,6):new T.BoxGeometry(1,.045,1),materials=[stone,mat(tint),dark],positions=[];for(let i=-9;i<=9;i++)for(let j=-9;j<=9;j++){const x=index%2?Math.sqrt(3)*.63*(i+(j%2)/2):j,z=index%2?j*.945:i;if(Math.abs(x)<7.45&&Math.abs(z)<7.45)positions.push({x,z,k:(Math.abs(i)+Math.abs(j))%3});}for(let k=0;k<3;k++){const points=positions.filter(p=>p.k===k),mesh=new T.InstancedMesh(geom,materials[k],points.length),d=new T.Object3D();points.forEach((p,i)=>{d.position.set(p.x,-.0225,p.z);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);});group.add(mesh);}}
 function vault(group,tint){const pts=[],indices=[];for(let i=0;i<=32;i++){const x=-8+i/2,y=5+3.7*Math.sin(i/32*Math.PI);pts.push(x,y,-8,x,y,8);if(i<32){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pts,3));g.setIndex(indices);g.computeVertexNormals();group.add(new T.Mesh(g,glass));for(const z of[-8,-4,0,4,8]){const curve=new T.CatmullRomCurve3(Array.from({length:33},(_,i)=>new T.Vector3(-8+i/2,5+3.7*Math.sin(i/32*Math.PI),z)));group.add(new T.Mesh(new T.TubeGeometry(curve,32,.075,6,false),tint));}}
 for(const [i,h]of HOUSES.entries()){
  const g=new T.Group();g.position.set(h.x,.13,h.z);g.rotation.y=-Math.PI/2-h.angle;scene.add(g);const tint=mat(h.color);floor(g,h.color,i);
  box(g,16,.25,16,0,-.17,0,stone);box(g,16,.5,.3,0,.25,-7.75,tint);box(g,16,4,.045,0,2.5,-7.85,glass);
  for(const x of[-7.75,7.75]){box(g,.25,.5,16,x,.25,0,tint);box(g,.035,4.1,15.5,x,2.55,0,glass);for(const z of[-7.75,-3.8,0,3.8,7.75])box(g,.2,5.1,.2,x,2.55,z,dark);}
  // The wide central doorway has no glass or collision plane across it.
  for(const x of[-5.1,5.1]){box(g,5.2,.5,.25,x,.25,7.75,tint);box(g,5.1,4.1,.035,x,2.55,7.75,glass);box(g,.22,5.2,.22,Math.sign(x)*2.55,2.6,7.75,dark);}
  box(g,16,.28,.28,0,5.1,7.75,dark);label(g,h.name,0,4.55,7.93,12.4);box(g,4.9,.06,3.3,0,-.03,9.3,tint);
  if([1,3].includes(i))vault(g,tint);
  else if(i===0){const roof=new T.Mesh(new T.ConeGeometry(11.8,4.6,6,1,true),tint);roof.position.y=7.5;roof.rotation.y=Math.PI/6;g.add(roof);for(let n=0;n<6;n++){const a=n*Math.PI/3;beam(g,[0,9.8,0],[11.7*Math.cos(a),5.2,11.7*Math.sin(a)],.08);}}
  else if(i===4){for(let j=0;j<5;j++)box(g,16-j*2,.4,16-j*2,0,5.3+j*.7,0,j%2?tint:dark);}
  else{for(const side of[-1,1]){const roof=box(g,8.5,.22,17,side*4,6.2,0,tint);roof.rotation.z=side*(i===5?.22:-.22);}for(const z of[-7,0,7])beam(g,[-8,5.3,z],[0,7.2,z],.06);}
  const plinth=new T.Mesh(new T.CylinderGeometry(1.8,2,.65,32),dark);plinth.position.y=.37;g.add(plinth);const e=new T.Group();e.position.y=2;g.add(e);exhibits[h.id]={group:e,house:g,tint};
  if(h.id==='symmetry'){const poly=new T.Group();poly.position.y=.8;e.add(poly);for(let k=0;k<6;k++){const a=k*Math.PI/3,b=(k+1)*Math.PI/3;beam(poly,[2.5*Math.cos(a),0,2.5*Math.sin(a)],[2.5*Math.cos(b),0,2.5*Math.sin(b)],.1);const ball=new T.Mesh(new T.SphereGeometry(.19,12,8),k===0?white:tint);ball.position.set(2.5*Math.cos(a),0,2.5*Math.sin(a));poly.add(ball);}updates.symmetry=(step,reflection)=>{poly.rotation.y=-step*Math.PI/3;poly.scale.z=reflection?-1:1;};}
  if(h.id==='chance'){const beads=[];for(let k=0;k<50;k++){const o=new T.Mesh(new T.SphereGeometry(.21,10,7),tint);o.position.set((k%10-4.5)*.48,Math.floor(k/10)*.5-1,0);e.add(o);beads.push(o);}updates.chance=(n,duplicate=[])=>beads.forEach((o,k)=>{o.visible=k<n;o.material=duplicate.includes(k)?brass:tint;});updates.chance(23);}
  if(h.id==='infinity'){const blocks=[];for(let a=0;a<6;a++)for(let b=0;b<6;b++){const o=box(e,.43,.43,.22,(b-2.5)*.55,(a-2.5)*.55,0,tint);blocks.push(o);}updates.infinity=rows=>blocks.forEach((o,k)=>o.material=rows[Math.floor(k/6)][k%6]?brass:dark);}
  if(h.id==='topology'){const pts=[],idx=[],N=144,W=12;for(let i=0;i<=N;i++)for(let j=0;j<=W;j++){const p=mobius(i/N*Math.PI*2,(j/W-.5)*1.7);pts.push(p.x,p.y,p.z);if(i<N&&j<W){const k=i*(W+1)+j;idx.push(k,k+1,k+W+1,k+1,k+W+2,k+W+1);}}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pts,3));geo.setIndex(idx);geo.computeVertexNormals();const ribbon=new T.Mesh(geo,mat(0xb89458,{metalness:.6,roughness:.3,side:T.DoubleSide}));e.add(ribbon);const ant=new T.Group(),body=new T.Mesh(new T.SphereGeometry(.12,10,8),dark);body.scale.z=1.7;ant.add(body);for(const x of[-1,1])for(const z of[-.12,0,.12])beam(ant,[0,0,z],[x*.23,-.06,z-.07],.012,dark);e.add(ant);updates.ant=turn=>{const p=mobius(turn,.6),q=mobius(turn+.001,.6),w=mobius(turn,.601),forward=new T.Vector3(q.x-p.x,q.y-p.y,q.z-p.z).normalize(),across=new T.Vector3(w.x-p.x,w.y-p.y,w.z-p.z).normalize(),normal=new T.Vector3().crossVectors(forward,across).normalize();ant.up.copy(normal);ant.position.set(p.x,p.y,p.z).addScaledVector(normal,.13);ant.lookAt(ant.position.clone().add(forward));};updates.ant(0);}
  if(h.id==='algorithms'){const bars=[box(e,.65,3,.6,-.55,.1,0,brass),box(e,.65,2,.6,.55,-.4,0,tint)];updates.algorithms=(a,b)=>{const m=Math.max(a,b,1);bars.forEach((o,k)=>{const v=[a,b][k]/m*3;o.scale.y=Math.max(.06,v);o.position.y=v/2-1.5;});};}
  if(h.id==='papers'){for(let j=0;j<3;j++){const p=box(e,1.3,2.1,.12,(j-1)*1.45,.2,0,stone);p.rotation.y=(j-1)*-.2;for(let k=0;k<7;k++)box(p,.7,.015,.02,0,.55-k*.13,.065,dark);}const book=box(e,3.8,.2,2,0,-1.1,1.4,tint);book.rotation.x=.15;}
  // Benches are off the centre aisle, with no indoor trees.
  for(const x of[-5.6,5.6]){box(g,2.4,.18,1.1,x,.4,4.5,stone);for(const dx of[-.9,.9])box(g,.15,.31,.7,x+dx,.155,4.5,dark);}
 }
 // The park is woven through the city: each shared garden continues a house's
 // investigation and joins both adjacent streets and the outer promenade.
 for(const [i,g]of GARDENS.entries()){
  road(joints[i],g,2.4);road(joints[(i+1)%6],g,2.4);road(g,{x:C.x+70*Math.cos(g.angle),z:C.z+70*Math.sin(g.angle)},2.4);
  const ring=new T.Mesh(new T.RingGeometry(3.4,4.1,64),stone);ring.rotation.x=-Math.PI/2;ring.position.set(g.x,.14,g.z);scene.add(ring);
  const garden=new T.Group();garden.position.set(g.x,.13,g.z);garden.rotation.y=-Math.PI/2-g.angle;scene.add(garden);label(garden,g.name,0,1.6,-4.4,7);
  box(garden,5,.18,1.1,0,.4,-5.4,stone);for(const x of[-2,2])box(garden,.15,.31,.8,x,.155,-5.4,dark);
  if(i===0){for(let n=0;n<12;n++){const a=n*Math.PI/6;beam(garden,[0,.2,0],[2.5*Math.cos(a),.2,2.5*Math.sin(a)],.025);const flower=new T.Mesh(new T.SphereGeometry(.18,8,6),n%2?brass:white);flower.position.set(2.5*Math.cos(a),.35,2.5*Math.sin(a));garden.add(flower);}}
  else if(i===1){for(let n=0;n<23;n++){const a=n*Math.PI*2/23;const pebble=new T.Mesh(new T.SphereGeometry(.18,8,6),n===2||n===17?brass:stone);pebble.position.set(2.2*Math.cos(a),.25,2.2*Math.sin(a));garden.add(pebble);}}
  else if(i===2){for(let n=0;n<36;n++){const a=n*2.3999632297,r=Math.sqrt(n)*.42,leaf=new T.Mesh(new T.ConeGeometry(.13,.5,5),grass);leaf.position.set(r*Math.cos(a),.3,r*Math.sin(a));garden.add(leaf);}}
  else if(i===3){const loop=new T.Mesh(new T.TorusKnotGeometry(1.4,.12,96,8,2,3),brass);loop.position.y=1.6;garden.add(loop);}
  else if(i===4){for(let n=1;n<7;n++)box(garden,.45,n*.27,.45,(n-3.5)*.68,n*.135,0,n%2?brass:stone);}
  else{const pond=new T.Mesh(new T.CylinderGeometry(2.4,2.4,.07,64),mat(0x477f8b,{metalness:.35,roughness:.18}));pond.position.y=-.05;garden.add(pond);const bridge=box(garden,1.2,.14,5.2,0,-.07,0,stone);for(const x of[-.65,.65]){beam(garden,[x,1,-2.7],[x,1,2.7],.04);for(const z of[-2.7,2.7])beam(garden,[x,.13,z],[x,1,z],.035);}}
 }
 // A continuous border of clipped planting belongs outside the seven building footprints.
 const trees=[],trunkGeo=new T.CylinderGeometry(.12,.18,2,6),canopyGeo=new T.IcosahedronGeometry(1,1),leaves=[mat(0x619781),mat(0x41725e)];
 function clearStreet(x,z,r){return streets.every(({a,b,w})=>{const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a.x-t*dx,z-a.z-t*dz)>w/2+r;});}
 function tree(x,z,r=1.3){if(!clearStreet(x,z,r+.3))return;trees.push({x,z,r});const trunk=new T.Mesh(trunkGeo,dark);trunk.position.set(x,1,z);scene.add(trunk);const canopy=new T.Mesh(canopyGeo,leaves[trees.length%2]);canopy.scale.setScalar(r);canopy.position.set(x,2.8,z);scene.add(canopy);}
 for(let k=0;k<48;k++){const a=k*Math.PI/24;tree(C.x+65*Math.cos(a),C.z+65*Math.sin(a));}
 for(const g of GARDENS)for(let k=0;k<12;k++){const a=k*Math.PI/6;tree(g.x+7.5*Math.cos(a),g.z+7.5*Math.sin(a),1.5);}
 const knot=new T.Mesh(new T.TorusKnotGeometry(1.4,.15,128,10,2,3),brass);knot.position.set(C.x-9,3.5,C.z-20);scene.add(knot);const base=new T.Mesh(new T.CylinderGeometry(2,2.3,.55,32),dark);base.position.set(C.x-9,.4,C.z-20);scene.add(base);
 const entrance=new T.Group();entrance.position.set(C.x,.13,C.z-12);entrance.rotation.y=Math.PI;scene.add(entrance);label(entrance,'The Proof Atelier',0,3.4,0,10);for(const x of[-5.2,5.2])box(entrance,.15,3.6,.15,x,1.8,0,brass);
 // Batch repeated fixed structures in world coordinates. Moving sculptures stay independent.
 const dynamic=new Set(Object.values(exhibits).map(e=>e.group)),buckets=new Map();scene.updateMatrixWorld(true);
 scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o===knot||o.material.transparent)return;for(let p=o;p;p=p.parent)if(dynamic.has(p))return;const key=o.geometry.uuid+'|'+o.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);});
 let batched=0;for(const objects of buckets.values()){if(objects.length<3)continue;const first=objects[0],batch=new T.InstancedMesh(first.geometry,first.material,objects.length);objects.forEach((o,i)=>{batch.setMatrixAt(i,o.matrixWorld);o.removeFromParent();});scene.add(batch);batched+=objects.length;}
 return {updates,exhibits,knot,trees,streets,batched};
}
