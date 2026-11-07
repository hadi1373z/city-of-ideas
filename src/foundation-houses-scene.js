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
  const feature=new T.Group();feature.name=data.feature.en;home.add(feature);const furniture=(x,z,w,d)=>obstacle(x,z,w,d);let exhibit=null;
  if(data.id==='freud'){
   const red=mat(0x8c3f3d);box(feature,3.8,.36,1.3,-4.6,.57,-3.2,red);box(feature,3.8,.72,.23,-4.6,.9,-3.8,red);for(const x of[-6.4,-2.8]){box(feature,.25,.62,1.4,x,.78,-3.2,red);for(const z of[-3.65,-2.75])box(feature,.10,.38,.10,x,.19,z,wood);}furniture(-4.6,-3.2,4.1,1.5);
  }else if(data.id==='chomsky'){
   const branch=new T.Group();branch.position.set(0,2.5,-7.75);feature.add(branch);for(const[a,b]of[[[0,.9,0],[-1,0,0]],[[0,.9,0],[1,0,0]],[[-1,0,0],[-1.7,-.8,0]],[[-1,0,0],[-.3,-.8,0]],[[1,0,0],[.3,-.8,0]],[[1,0,0],[1.7,-.8,0]]])beam(branch,a,b,.055,wood);for(const[x,y]of[[0,.9],[-1,0],[1,0],[-1.7,-.8],[-.3,-.8],[.3,-.8],[1.7,-.8]])box(branch,.26,.18,.08,x,y,.04,brass);
  }else if(data.id==='borges'){
   for(const x of[-5.2,5.2])box(feature,.18,3.6,.55,x,1.8,-7.45,wood);for(const y of[.15,1.25,2.35,3.45])box(feature,10.5,.13,.6,0,y,-7.45,wood);const colours=[mat(0x556e6b),mat(0x9d6550),mat(0xbaa370)];for(let row=0;row<3;row++)for(let i=0;i<28;i++)box(feature,.25,.6+(i%3)*.09,.38,-4.7+i*.35,.53+row*1.1,-7.4,colours[(i+row)%3]);furniture(0,-7.45,10.6,.6);
   const rug=mat(0x6a5144),seat=mat(0x475e59),lampShade=mat(0xe3c98f,{emissive:0x493820});
   box(feature,5.3,.018,5.4,-4.8,.01,-2.4,rug);for(const x of[-7.3,-2.3])box(feature,.035,.022,5,x,.025,-2.4,brass);for(const z of[-4.9,.1])box(feature,5,.022,.035,-4.8,.025,z,brass);
   for(const side of[-1,1]){const x=side*8.2;for(const z of[-6.8,-1])box(feature,.65,3.4,.14,x,1.7,z,wood);for(const y of[.15,1.2,2.25,3.35])box(feature,.7,.12,5.9,x,y,-3.9,wood);for(let row=0;row<3;row++)for(let i=0;i<16;i++)box(feature,.42,.56+(i%3)*.08,.22,x,.5+row*1.05,-6.4+i*.33,colours[(i+row)%3]);furniture(x,-3.9,.75,6);}
   box(feature,1.4,.17,1.2,-4.5,.48,-.4,wood);box(feature,1.25,.12,1.05,-4.5,.61,-.4,seat);box(feature,1.35,.85,.14,-4.5,1.05,.1,wood);for(const x of[-5,-4])for(const z of[-.85,.05])box(feature,.09,.45,.09,x,.225,z,wood);furniture(-4.5,-.4,1.45,1.3);
   beam(feature,[-5.5,1.08,-3],[-5.5,1.9,-3],.035,brass);const shade=new T.Mesh(own(new T.CylinderGeometry(.25,.48,.4,20)),lampShade);shade.position.set(-5.5,1.9,-3);feature.add(shade);box(feature,.65,.04,.6,-5.5,1.09,-3,brass);
   const folio=new T.Group();folio.name='Open reading folio';folio.position.set(4.8,1.15,-2);feature.add(folio);for(const side of[-1,1]){const page=box(folio,1.1,.06,1.45,side*.56,0,0,paper);page.rotation.z=side*.055;for(let i=0;i<6;i++)box(folio,.8,.012,.018,side*.56,.09,-.48+i*.17,wood);}box(feature,3.2,.12,2.2,4.8,1,-2,wood);for(const x of[3.5,6.1])for(const z of[-2.8,-1.2])box(feature,.12,.94,.12,x,.47,z,wood);furniture(4.8,-2,3.2,2.2);
   box(feature,3,.12,1.8,-4.5,1,-2.6,wood);for(const x of[-5.7,-3.3])for(const z of[-3.25,-1.95])box(feature,.12,.94,.12,x,.47,z,wood);const book=box(feature,.85,.08,.7,-4.5,1.1,-2.6,paper);book.rotation.y=.16;furniture(-4.5,-2.6,3,1.8);
  }else if(data.id==='calvino'){
   for(const x of[-4.5,-5.7,-6.9]){for(const z of[-3.7,-.3])box(feature,.12,3,.12,x,1.5,z,wood);for(const y of[.15,3])box(feature,.12,.12,3.55,x,y,-2,wood);}for(const z of[-3.7,-.3])box(feature,2.6,.08,.08,-5.7,3,z,wood);furniture(-5.7,-2,2.6,3.6);
   // A small invented city behind the original frames: three permanent buildings,
   // with different details emphasized by the reading controls. No city plot moves.
   const layers={},materials={},colours={memory:0xc18a40,routes:0x2b7b62,measure:0x365d91};
   for(const id of['memory','routes','measure']){layers[id]=new T.Group();layers[id].name='Calvino model · '+id;feature.add(layers[id]);materials[id]=mat(colours[id]);}
   box(feature,1.35,.12,3.2,-7.9,1,-2,wood);for(const x of[-8.4,-7.4])for(const z of[-3.3,-.7])box(feature,.1,.94,.1,x,.47,z,wood);furniture(-7.9,-2,1.35,3.2);
   const buildings=new T.Group();buildings.name='Calvino model · three fixed buildings';feature.add(buildings);
   for(const [z,height]of[[-2.95,.55],[-2,1.15],[-1.05,.8]]){
    box(buildings,.65,height,.6,-8,1.07+height/2,z,paper);
    box(layers.memory,.025,.24,.18,-7.66,1.19,z,materials.memory);
    box(layers.memory,.18,.025,.28,-7.58,1.085,z,materials.memory);
    box(layers.routes,.3,.018,.09,-7.5,1.075,z,materials.routes);
   }
   box(layers.routes,.1,.018,2.9,-7.35,1.075,-2,materials.routes);
   box(layers.measure,.06,1.4,.05,-8.4,1.77,-.55,materials.measure);
   for(let i=0;i<7;i++)box(layers.measure,.08,.018,i%2?.12:.2,-8.35,1.1+i*.2,-.55,materials.measure);
   for(const [i,x]of[-4.5,-5.7,-6.9].entries())box(layers[['memory','routes','measure'][i]],.14,.06,3.2,x,2.91,-2,materials[['memory','routes','measure'][i]]);
   box(feature,.8,.014,.8,-2,.015,-2,brass);
   // A small reading desk and bench leave the central and front cross-aisles clear.
   box(feature,2.6,.12,1.6,4.5,1,1,wood);for(const x of[3.5,5.5])for(const z of[.45,1.55])box(feature,.1,.94,.1,x,.47,z,wood);furniture(4.5,1,2.6,1.6);
   for(const side of[-1,1]){const page=box(feature,.65,.04,.8,4.5+side*.33,1.09,1,paper);page.rotation.z=side*.05;}
   box(feature,3,.22,1,4,.5,-4.5,wood);for(const x of[2.8,5.2])box(feature,.14,.4,.7,x,.2,-4.5,wood);furniture(4,-4.5,3,1.1);
   for(const z of[-5,0,5]){const curve=new T.CatmullRomCurve3(Array.from({length:25},(_,i)=>{const x=-8.8+i/24*17.6;return new T.Vector3(x,4.31+2.65*Math.sqrt(1-(x/9.5)**2),z);}));const rib=new T.Mesh(own(new T.TubeGeometry(curve,28,.065,6,false)),wood);rib.name='Calvino vault rib';feature.add(rib);}
   let lens='memory';exhibit={layers,buildings,get lens(){return lens;},setLens(id){if(!Object.hasOwn(materials,id))return false;lens=id;for(const key of Object.keys(materials))materials[key].color.setHex(key===id?colours[key]:0xaaa38e);return true;}};exhibit.setLens(lens);
  }else if(data.id==='ada'){
   // A separate card table and wall diagram clarify the wheel's role without
   // reconstructing the historical Engine or moving the original workbench.
   const writing=new T.Group();writing.name='Ada instruction-card worktable';feature.add(writing);
   box(writing,3.8,.15,2.2,4.6,1,-3.4,wood);
   for(const x of[3.1,6.1])for(const z of[-4.2,-2.6])box(writing,.14,.94,.14,x,.47,z,wood);
   furniture(4.6,-3.4,3.8,2.2);
   for(const [index,x]of[[0,3.8],[1,5.3]]){
    const shape=new T.Shape();shape.moveTo(-.48,-.7);shape.lineTo(.48,-.7);shape.lineTo(.48,.7);shape.lineTo(-.48,.7);shape.closePath();
    for(let row=0;row<4;row++)for(let col=0;col<3;col++)if((row+col+index)%3!==0){const hole=new T.Path();hole.absellipse(-.25+col*.25,-.45+row*.3,.065,.065,0,Math.PI*2,true);shape.holes.push(hole);}
    const card=new T.Mesh(own(new T.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:false})),paper);card.name='Perforated instruction card '+(index+1);card.userData.cardOperation=index?'add':'double';card.rotation.x=-Math.PI/2;card.rotation.z=index?.12:-.12;card.position.set(x,1.1,-3.4);writing.add(card);
   }
   for(const x of[-8.7,8.7])box(feature,.44,.12,8.7,x,.98,0,trim);
   for(const z of[-5,0,5])box(feature,17.8,.14,.18,0,4.35,z,wood);
   const boardCanvas=canvas();boardCanvas.width=1024;boardCanvas.height=512;
   const boardCtx=boardCanvas.getContext('2d');boardCtx.fillStyle='#f0e7d1';boardCtx.fillRect(0,0,1024,512);boardCtx.textAlign='center';boardCtx.textBaseline='middle';boardCtx.direction='ltr';boardCtx.font='bold 74px Tahoma';boardCtx.fillStyle='#285a49';boardCtx.fillText('2 → ×2 → +3 → 7',512,175);boardCtx.fillStyle='#963c26';boardCtx.fillText('2 → +3 → ×2 → 10',512,335);
   const boardTex=own(new T.CanvasTexture(boardCanvas));boardTex.colorSpace=T.SRGBColorSpace;
   box(feature,6.6,2.8,.14,0,2.6,-7.7,wood);
   const diagram=new T.Mesh(own(new T.PlaneGeometry(6.2,2.4)),own(new T.MeshBasicMaterial({map:boardTex,toneMapped:false})));diagram.name='Two operation orders · modern teaching diagram';diagram.position.set(0,2.6,-7.61);feature.add(diagram);
   box(feature,3.8,.15,2,-4.6,1,-3.4,wood);for(const x of[-6.1,-3.1])for(const z of[-4.1,-2.7])box(feature,.15,.94,.15,x,.47,z,wood);box(feature,.2,1.2,.3,-4.6,1.65,-3.7,wood);beam(feature,[-4.6,2,-3.85],[-4.6,2,-3.25],.09,brass);const gear=new T.Group();gear.position.set(-4.6,2,-3.4);feature.add(gear);const rim=new T.Mesh(own(new T.TorusGeometry(.92,.08,8,40)),brass);gear.add(rim);for(let i=0;i<12;i++){const a=i/12*Math.PI*2,o=box(gear,.18,.25,.18,Math.cos(a)*1.02,Math.sin(a)*1.02,0,brass);o.rotation.z=a-Math.PI/2;}for(let i=0;i<6;i++){const a=i/6*Math.PI*2;beam(gear,[0,0,0],[.85*Math.cos(a),.85*Math.sin(a),0],.035,brass);}furniture(-4.6,-3.4,3.8,2);
  }else{
   const stone=mat(0x8e8c7a);const hearth=new T.Mesh(own(new T.TorusGeometry(.9,.13,8,32)),stone);hearth.rotation.x=Math.PI/2;hearth.position.set(-4,.14,-2);feature.add(hearth);for(const z of[-5,1]){box(feature,2.7,.3,.9,-4,.5,z,wood);for(const x of[-5,-3])box(feature,.12,.35,.65,x,.175,z,wood);furniture(-4,z,2.8,1);}furniture(-4,-2,2.2,2.2);
  }
  feature.traverse(o=>{if(o.isMesh)o.userData={...o.userData,foundationHouse:data.id};});targets.push(feature);
  const local=(x,z)=>{const dx=x-data.x,dz=z-data.z;return{x:dx*Math.cos(data.turn)-dz*Math.sin(data.turn),z:dx*Math.sin(data.turn)+dz*Math.cos(data.turn)};};
  let painted='';const model={data,group:home,feature,colliders,exhibit,entry:houseEntry(data),insideEntry:houseInside(data),local,inside:(x,z)=>{const p=local(x,z);return Math.abs(p.x)<8.8&&Math.abs(p.z)<7.8;},canStand:(x,z)=>{const p=local(x,z);return!colliders.some(b=>Math.abs(p.x-b.x)<b.w/2+.22&&Math.abs(p.z-b.z)<b.d/2+.22);},paint(lang){if(painted===lang)return;painted=lang;const text=data.names[lang]||data.names.en,ctx=c.getContext('2d');ctx.fillStyle='#f0e7d1';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#30483d';ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction=lang==='fa'?'rtl':'ltr';ctx.font='92px Tahoma';ctx.fillText(text,c.width/2,c.height/2,c.width-80);texture.needsUpdate=true;}};model.paint('en');batchBoxes(home);houses.push(model);
 }
 return{group,houses,targets,canStand:(x,z)=>houses.every(h=>h.canStand(x,z)),dispose(){group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}
