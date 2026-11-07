import {FOUNDATION_HOUSES,houseWorld,houseEntry,houseInside} from './foundation-houses-data.js';
export function buildFoundationHouses(T,{canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group();group.name='Six first house studies on the island lanes';const owned=new Set(),own=r=>(owned.add(r),r),houses=[],targets=[];
 const mat=(color,options={})=>own(new T.MeshLambertMaterial({color,...options})),wood=mat(0x785d45),paper=mat(0xece1c9),brass=mat(0xb49357),glass=mat(0xb6d0d2,{transparent:true,opacity:.12,depthWrite:false,side:T.DoubleSide});
 function box(parent,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);parent.add(o);return o;}
 function beam(parent,a,b,r,m){const va=new T.Vector3(...a),vb=new T.Vector3(...b),d=vb.clone().sub(va),o=new T.Mesh(own(new T.CylinderGeometry(r,r,d.length(),8)),m);o.position.copy(va).add(vb).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());parent.add(o);return o;}
 function surface(parent,vertices,indices,m){const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();const o=new T.Mesh(g,m);parent.add(o);return o;}
 const unitBox=own(new T.BoxGeometry(1,1,1));
 function batchBoxes(root){const parents=[];root.traverse(o=>parents.push(o));for(const parent of parents){const batches=new Map();for(const o of parent.children){if(o.geometry?.type!=='BoxGeometry')continue;const key=o.material.uuid+'|'+(o.userData.foundationHouse||'');if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const list of batches.values()){if(list.length<3)continue;const batch=new T.InstancedMesh(unitBox,list[0].material,list.length);batch.name='Batched architectural details';batch.userData={...list[0].userData};list.forEach((o,i)=>{o.updateMatrix();const p=o.geometry.parameters,m=o.matrix.clone().multiply(new T.Matrix4().makeScale(p.width,p.height,p.depth));batch.setMatrixAt(i,m);o.removeFromParent();owned.delete(o.geometry);o.geometry.dispose();});batch.instanceMatrix.needsUpdate=true;batch.computeBoundingBox?.();batch.computeBoundingSphere?.();parent.add(batch);}}}
 for(const data of FOUNDATION_HOUSES){
  const home=new T.Group();home.name=data.names.en+' · first architectural study';home.position.set(data.x,.13,data.z);home.rotation.y=data.turn;home.userData.cityDestination='house:'+data.id;group.add(home);const wall=mat(data.wall),roof=mat(data.roof,{side:T.DoubleSide}),capMaterial=mat(data.wall,{side:T.DoubleSide}),trim=mat(data.id==='chomsky'?0x627a77:0x806a51),colliders=[];
  const obstacle=(x,z,w,d)=>colliders.push({x,z,w,d});
  box(home,18,.10,16,0,-.05,0,mat(0xc6b490));box(home,18,.10,5,0,-.05,10.5,mat(0xd4c8ad));
  box(home,18,4.4,.22,0,2.2,-8,wall);obstacle(0,-8,18,.22);
  for(const x of[-9,9]){box(home,.22,1.05,16,x,.525,0,wall);box(home,.22,1,16,x,3.9,0,wall);for(const z of[-6.2,6.2])box(home,.22,2.35,3.6,x,2.225,z,wall);box(home,.025,2.35,8.8,x,2.225,0,glass);for(const z of[-4.4,0,4.4])box(home,.14,2.48,.10,x,2.225,z,trim);for(const y of[1.05,3.4])box(home,.14,.10,8.9,x,y,0,trim);obstacle(x,0,.22,16);}
  for(const x of[-5.3,5.3]){box(home,7.4,1.05,.22,x,.525,8,wall);box(home,7.4,1,.22,x,3.9,8,wall);for(const dx of[-3.55,3.55])box(home,.25,2.35,.22,x+dx,2.225,8,wall);box(home,6.9,2.35,.025,x,2.225,8,glass);for(const dx of[-3.5,0,3.5])box(home,.1,2.5,.14,x+dx,2.225,8.08,trim);for(const y of[1.05,3.4])box(home,7.1,.10,.14,x,y,8.08,trim);obstacle(x,8,7.4,.22);}
  box(home,3.2,1,.3,0,3.9,8,wood);for(const x of[-1.6,1.6])box(home,.14,3.4,.3,x,1.7,8,wood);
  const c=canvas();c.width=1536;c.height=256;const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;const plaque=new T.Mesh(own(new T.PlaneGeometry(6.8,1.05)),own(new T.MeshBasicMaterial({map:texture,toneMapped:false})));plaque.position.set(0,3.91,8.17);plaque.userData={foundationHouse:data.id};home.add(plaque);targets.push(plaque);
  // Each silhouette is different, while every entrance remains on the same clear axis.
  if(data.style==='hip')surface(home,[-9.5,4.45,8.5,9.5,4.45,8.5,9.5,4.45,-8.5,-9.5,4.45,-8.5,-5,7,0,5,7,0],[0,1,4,1,5,4,1,2,5,2,3,5,3,4,5,3,0,4],roof);
  else if(data.style==='library'){
   surface(home,[-9.6,4.45,-8.6,0,7.2,-8.6,9.6,4.45,-8.6,-9.6,4.45,8.6,0,7.2,8.6,9.6,4.45,8.6],[0,3,1,1,3,4,1,4,2,2,4,5],roof);for(const z of[-8,8])surface(home,[-9.6,4.45,z,0,7.2,z,9.6,4.45,z],z>0?[0,2,1]:[0,1,2],capMaterial);
   box(home,18,.16,3,0,4.38,9.3,roof);for(const x of[-6.8,6.8]){box(home,.18,4.3,.18,x,2.15,10.4,wood);obstacle(x,10.4,.18,.18);}
  }else if(data.style==='vault'){
   const v=[],ix=[];for(let i=0;i<=24;i++){const x=-9.5+i/24*19,y=4.45+2.65*Math.sqrt(Math.max(0,1-(x/9.5)**2));for(const z of[-8.6,8.6])v.push(x,y,z);if(i<24){const k=i*2;ix.push(k,k+1,k+2,k+1,k+3,k+2);}}surface(home,v,ix,roof);for(const z of[-8,8]){const cap=[0,4.4,z],ci=[];for(let i=0;i<=24;i++){const x=-9.5+i/24*19;cap.push(x,4.45+2.65*Math.sqrt(Math.max(0,1-(x/9.5)**2)),z);if(i<24)ci.push(...(z>0?[0,i+2,i+1]:[0,i+1,i+2]));}surface(home,cap,ci,capMaterial);}for(const x of[-8.8,8.8])box(home,.22,.16,17,x,4.32,0,wood);
  }else if(data.style==='courtyard'){
   for(const x of[-6.25,6.25])box(home,6.5,.18,17,x,4.5,0,roof);for(const z of[-6,6])box(home,6,.18,5,0,4.5,z,roof);for(const x of[-3,3])for(const z of[-3.5,3.5]){box(home,.13,4.4,.13,x,2.2,z,wood);obstacle(x,z,.13,.13);}
  }else if(data.style==='workshop'){
   for(const side of[-1,1]){surface(home,[side*9.6,4.45,-8.6,side*1.5,5.8,-8.6,side*9.6,4.45,8.6,side*1.5,5.8,8.6],[0,2,1,1,2,3],roof);for(const z of[-8,8])surface(home,[side*9.6,4.4,z,side*1.5,4.4,z,side*1.5,5.8,z,side*9.6,4.45,z],side*(z>0?1:-1)>0?[0,2,1,0,3,2]:[0,1,2,0,2,3],capMaterial);}box(home,3,.04,17.2,0,5.78,0,glass);for(const z of[-8,8])box(home,3,1.35,.025,0,5.08,z,glass);for(const x of[-1.5,1.5])for(const z of[-8.3,0,8.3])box(home,.10,1.38,.10,x,5.09,z,wood);
  }else{
   box(home,19.2,.2,17.2,0,4.5,0,roof);box(home,11,.14,9,0,5.8,0,roof);for(const x of[-5.2,5.2])for(const z of[-4.2,4.2])box(home,.14,1.18,.14,x,5.12,z,trim);
  }
  const feature=new T.Group();feature.name=data.feature.en;home.add(feature);const furniture=(x,z,w,d)=>obstacle(x,z,w,d);
  if(data.id==='freud'){
   const red=mat(0x8c3f3d);box(feature,3.8,.36,1.3,-4.6,.57,-3.2,red);box(feature,3.8,.72,.23,-4.6,.9,-3.8,red);for(const x of[-6.4,-2.8]){box(feature,.25,.62,1.4,x,.78,-3.2,red);for(const z of[-3.65,-2.75])box(feature,.10,.38,.10,x,.19,z,wood);}furniture(-4.6,-3.2,4.1,1.5);
  }else if(data.id==='chomsky'){
   const branch=new T.Group();branch.position.set(0,2.5,-7.75);feature.add(branch);for(const[a,b]of[[[0,.9,0],[-1,0,0]],[[0,.9,0],[1,0,0]],[[-1,0,0],[-1.7,-.8,0]],[[-1,0,0],[-.3,-.8,0]],[[1,0,0],[.3,-.8,0]],[[1,0,0],[1.7,-.8,0]]])beam(branch,a,b,.055,wood);for(const[x,y]of[[0,.9],[-1,0],[1,0],[-1.7,-.8],[-.3,-.8],[.3,-.8],[1.7,-.8]])box(branch,.26,.18,.08,x,y,.04,brass);
  }else if(data.id==='borges'){
   for(const x of[-5.2,5.2])box(feature,.18,3.6,.55,x,1.8,-7.45,wood);for(const y of[.15,1.25,2.35,3.45])box(feature,10.5,.13,.6,0,y,-7.45,wood);const colours=[mat(0x556e6b),mat(0x9d6550),mat(0xbaa370)];for(let row=0;row<3;row++)for(let i=0;i<28;i++)box(feature,.25,.6+(i%3)*.09,.38,-4.7+i*.35,.53+row*1.1,-7.4,colours[(i+row)%3]);furniture(0,-7.45,10.6,.6);
   box(feature,3,.12,1.8,-4.5,1,-2.6,wood);for(const x of[-5.7,-3.3])for(const z of[-3.25,-1.95])box(feature,.12,.94,.12,x,.47,z,wood);const book=box(feature,.85,.08,.7,-4.5,1.1,-2.6,paper);book.rotation.y=.16;furniture(-4.5,-2.6,3,1.8);
  }else if(data.id==='calvino'){
   for(const x of[-4.5,-5.7,-6.9]){for(const z of[-3.7,-.3])box(feature,.12,3,.12,x,1.5,z,wood);for(const y of[.15,3])box(feature,.12,.12,3.55,x,y,-2,wood);}for(const z of[-3.7,-.3])box(feature,2.6,.08,.08,-5.7,3,z,wood);furniture(-5.7,-2,2.6,3.6);
  }else if(data.id==='ada'){
   box(feature,3.8,.15,2,-4.6,1,-3.4,wood);for(const x of[-6.1,-3.1])for(const z of[-4.1,-2.7])box(feature,.15,.94,.15,x,.47,z,wood);box(feature,.2,1.2,.3,-4.6,1.65,-3.7,wood);beam(feature,[-4.6,2,-3.85],[-4.6,2,-3.25],.09,brass);const gear=new T.Group();gear.position.set(-4.6,2,-3.4);feature.add(gear);const rim=new T.Mesh(own(new T.TorusGeometry(.92,.08,8,40)),brass);gear.add(rim);for(let i=0;i<12;i++){const a=i/12*Math.PI*2,o=box(gear,.18,.25,.18,Math.cos(a)*1.02,Math.sin(a)*1.02,0,brass);o.rotation.z=a-Math.PI/2;}for(let i=0;i<6;i++){const a=i/6*Math.PI*2;beam(gear,[0,0,0],[.85*Math.cos(a),.85*Math.sin(a),0],.035,brass);}furniture(-4.6,-3.4,3.8,2);
  }else{
   const stone=mat(0x8e8c7a);const hearth=new T.Mesh(own(new T.TorusGeometry(.9,.13,8,32)),stone);hearth.rotation.x=Math.PI/2;hearth.position.set(-4,.14,-2);feature.add(hearth);for(const z of[-5,1]){box(feature,2.7,.3,.9,-4,.5,z,wood);for(const x of[-5,-3])box(feature,.12,.35,.65,x,.175,z,wood);furniture(-4,z,2.8,1);}furniture(-4,-2,2.2,2.2);
  }
  feature.traverse(o=>{if(o.isMesh)o.userData={foundationHouse:data.id};});targets.push(feature);
  const local=(x,z)=>{const dx=x-data.x,dz=z-data.z;return{x:dx*Math.cos(data.turn)-dz*Math.sin(data.turn),z:dx*Math.sin(data.turn)+dz*Math.cos(data.turn)};};
  let painted='';const model={data,group:home,feature,colliders,entry:houseEntry(data),insideEntry:houseInside(data),local,inside:(x,z)=>{const p=local(x,z);return Math.abs(p.x)<8.8&&Math.abs(p.z)<7.8;},canStand:(x,z)=>{const p=local(x,z);return!colliders.some(b=>Math.abs(p.x-b.x)<b.w/2+.22&&Math.abs(p.z-b.z)<b.d/2+.22);},paint(lang){if(painted===lang)return;painted=lang;const text=data.names[lang]||data.names.en,ctx=c.getContext('2d');ctx.fillStyle='#f0e7d1';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#30483d';ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction=lang==='fa'?'rtl':'ltr';ctx.font='92px Tahoma';ctx.fillText(text,c.width/2,c.height/2,c.width-80);texture.needsUpdate=true;}};model.paint('en');batchBoxes(home);houses.push(model);
 }
 return{group,houses,targets,canStand:(x,z)=>houses.every(h=>h.canStand(x,z)),dispose(){group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
