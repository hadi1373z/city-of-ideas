import {ARCHETYPES_QUARTER,ARCHETYPE_HOUSES,archetypeCanStand,archetypeInside,archetypeEntry,archetypeLocal} from './archetypes-quarter-model.js?v=city-learning-20261118';
import {ARCHETYPE_CONTENT,archetypeArtURL} from './archetypes-quarter-content.js?v=city-learning-20261118';

export function buildArchetypesQuarter(T,{canvas=()=>document.createElement('canvas'),loader=new T.TextureLoader()}={}){
 const group=new T.Group();group.name='Archetypes quarter · four original houses and cultural artifacts';
 const owned=new Set(),released=new WeakSet(),pending=new Set(),own=r=>(owned.add(r),r),release=r=>{if(r&&!released.has(r)){released.add(r);owned.delete(r);r.dispose?.();}},targets=[],houses=[],jobs=[];let disposed=false;
 const mat=(color,extra={})=>own(new T.MeshLambertMaterial({color,...extra}));
 const stone=mat(0xbab29e),wood=mat(0x68503c),brass=mat(0xbc9756),paper=mat(0xece4cf),ink=mat(0x364a4b),glass=mat(0xabc8ca,{transparent:true,opacity:.22,depthWrite:false});
 const boxGeometry=own(new T.BoxGeometry(1,1,1));
 function box(parent,w,h,d,x,y,z,m){const o=new T.Mesh(boxGeometry,m);o.position.set(x,y,z);o.scale.set(w,h,d);parent.add(o);return o;}
 function beam(parent,a,b,r,m){const from=new T.Vector3(...a),to=new T.Vector3(...b),delta=to.clone().sub(from),mesh=new T.Mesh(own(new T.CylinderGeometry(r,r,delta.length(),8)),m);mesh.position.copy(from).add(to).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());parent.add(mesh);return mesh;}
 function surface(parent,points,indices,m){const g=own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setIndex(indices);g.computeVertexNormals();const o=new T.Mesh(g,m);parent.add(o);return o;}
 function label(parent,text,w,h,x,y,z,{size=58,background='#e9e0c8',color='#263e40'}={}){const c=canvas();c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';const pixels=size*2/3;ctx.font=pixels+'px Tahoma';const lines=Array.isArray(text)?text:[text];lines.forEach((line,i)=>ctx.fillText(line,c.width/2,c.height/2+(i-(lines.length-1)/2)*pixels*1.35,c.width-48));const tex=own(new T.CanvasTexture(c));tex.colorSpace=T.SRGBColorSpace;const o=new T.Mesh(own(new T.PlaneGeometry(w,h)),own(new T.MeshBasicMaterial({map:tex,toneMapped:false})));o.position.set(x,y,z);parent.add(o);return o;}
 function batch(parent){const byMaterial=new Map();for(const mesh of parent.children){if(mesh.geometry!==boxGeometry)continue;const list=byMaterial.get(mesh.material)||[];list.push(mesh);byMaterial.set(mesh.material,list);}for(const[m,list]of byMaterial){if(list.length<2)continue;const inst=new T.InstancedMesh(boxGeometry,m,list.length);inst.name='Batched architectural stone, joinery and inlay';list.forEach((o,i)=>{o.updateMatrix();inst.setMatrixAt(i,o.matrix);o.removeFromParent();});inst.instanceMatrix.needsUpdate=true;inst.computeBoundingSphere?.();parent.add(inst);}}
 const court=new T.Mesh(own(new T.RingGeometry(5.2,5.32,64)),brass);court.rotation.x=-Math.PI/2;court.position.set(ARCHETYPES_QUARTER.x,.148,ARCHETYPES_QUARTER.z);group.add(court);
 // The centre and the southeast exit remain open. Three benches sit off the spokes.
 for(const angle of[3*Math.PI/4,5*Math.PI/4,7*Math.PI/4]){const b=new T.Group();b.position.set(ARCHETYPES_QUARTER.x+Math.cos(angle)*10,.13,ARCHETYPES_QUARTER.z+Math.sin(angle)*10);b.rotation.y=-angle;box(b,3,.22,.8,0,.52,0,wood);for(const x of[-1.1,1.1])box(b,.18,.41,.6,x,.205,0,stone);batch(b);group.add(b);}
 for(const data of ARCHETYPE_HOUSES){
  const content=ARCHETYPE_CONTENT[data.id],home=new T.Group();home.position.set(data.x,.13,data.z);home.rotation.y=data.turn;home.name=data.name;home.userData.cityDestination='archetype:'+data.id;group.add(home);
  const wall=mat(data.wall),roof=mat(data.roof,{side:T.DoubleSide}),accent=mat(data.accent),architecture=new T.Group();home.add(architecture);
  box(architecture,18.25,.1,18.25,0,-.05,0,stone);box(architecture,18.25,.1,3.4,0,-.05,10.7,stone);
  // Closed rear and glazed side apertures; all visible panes remain solid to walking.
  box(architecture,18,4.8,.28,0,2.4,-9,wall);
  for(const x of[-9,9]){
   for(const[y,h]of[[.6,1.2],[4.05,1.5]])box(architecture,.28,h,18,x,y,0,wall);
   for(const z of[-6,6])box(architecture,.28,2.1,6,x,2.25,z,wall);
   box(architecture,.035,2.1,6,x,2.25,0,glass);
   for(const z of[-3,0,3])box(architecture,.18,2.18,.12,x,2.25,z,wood);
   for(const y of[1.2,3.3])box(architecture,.18,.12,6.2,x,y,0,wood);
  }
  for(const x of[-5.3,5.3])box(architecture,7.4,4.8,.28,x,2.4,9,wall);
  box(architecture,3.2,1.3,.28,0,4.15,9,wall);
  for(const x of[-1.6,1.6])box(architecture,.12,3.5,.38,x,1.75,9,wood);
  for(const x of[-6.9,6.9]){box(architecture,.34,4.8,.34,x,2.4,11.1,stone);box(architecture,.62,.16,.62,x,.08,11.1,accent);box(architecture,.62,.16,.62,x,4.66,11.1,accent);}
  box(architecture,18.9,.24,3.6,0,4.92,10.7,roof);
  // All four silhouettes have a complete cover and closed end caps above 4.8 m.
  if(data.style==='gable'||data.style==='lyre'){
   const top=data.style==='gable'?7.1:6.25;
   surface(architecture,[-9.6,4.8,-9.6,0,top,-9.6,9.6,4.8,-9.6,-9.6,4.8,9.6,0,top,9.6,9.6,4.8,9.6],[0,3,1,1,3,4,1,4,2,2,4,5],roof);
   for(const z of[-9,9])surface(architecture,[-9,4.8,z,0,top,z,9,4.8,z],z>0?[0,2,1]:[0,1,2],wall);
  }else if(data.style==='paired'){
   box(architecture,19.2,.25,19.2,0,4.92,0,roof);
   for(const x of[-4.6,4.6])box(architecture,8.7,.35,18.5,x,5.4,0,roof);
   box(architecture,.55,.18,19.2,0,5.08,0,brass);
  }else{
   box(architecture,19.2,.28,19.2,0,4.94,0,roof);
   for(let i=0;i<3;i++)box(architecture,15-i*4,.24,15-i*4,0,5.18+i*.24,0,roof);
  }
  // Cornice, grounded bench and a study table leave the centre aisle unobstructed.
  for(const z of[-8.8,8.8])box(architecture,17.8,.12,.2,0,4.63,z,accent);
  box(architecture,1.1,.2,4.2,-5.4,.6,-2,wood);for(const z of[-3.5,-.5])box(architecture,.8,.5,.2,-5.4,.25,z,stone);
  box(architecture,3.4,.22,3.4,3.9,1,-2.5,wood);for(const x of[2.55,5.25])for(const z of[-3.85,-1.15])box(architecture,.18,.89,.18,x,.445,z,wood);
  const plaque=label(home,[data.name,content.subtitle.split(' · ')[0]],7.8,1.2,0,4.15,9.18,{size:74});plaque.userData={archetypeHouse:data.id,archetypeAction:'read'};targets.push(plaque);
  label(home,['Original reading · '+data.conceptName,'Enter the open doorway to explore'],6.5,1.25,-5.3,2.45,9.17,{size:62});
  const art=content.art,artWidth=Math.min(6.8,3.25*art.width/art.height),artHeight=artWidth*art.height/art.width;
  box(architecture,artWidth+.24,artHeight+.24,.13,0,2.75,-8.77,wood);
  const artMaterial=own(new T.MeshBasicMaterial({color:0xd4cbb5,toneMapped:false})),picture=new T.Mesh(own(new T.PlaneGeometry(artWidth,artHeight)),artMaterial);picture.position.set(0,2.75,-8.68);picture.name='Met Museum artifact '+art.id;picture.userData={archetypeHouse:data.id,archetypeAction:'sources',artifactId:art.id};home.add(picture);targets.push(picture);
  const short=art.id===324421?['Sumerian contest seal · identification uncertain','Met Museum · CC0 · sources in the reader']:art.id===327044?['Inanna/Ishtar rosette symbols · Babylonian','Met Museum · CC0 · not a descent scene']:art.id===251800?['Hermes · Attic lekythos · ca. 480–470 BCE','Met Museum · CC0 · not the cattle-theft episode']:['Dionysos mask · Cypriot · 2nd century BCE(?)','Met Museum · CC0 · a later cultural artifact'];
  label(home,short,7.3,.88,0,.64,-8.65,{size:56});
  jobs.push(new Promise(resolve=>{let texture,settled=false;const finish=value=>{if(settled)return;settled=true;pending.delete(finish);resolve(value);};pending.add(finish);try{texture=loader.load(archetypeArtURL(art),tex=>{if(disposed){release(tex);finish(false);return;}own(tex);tex.colorSpace=T.SRGBColorSpace;artMaterial.map=tex;artMaterial.color.set(0xffffff);artMaterial.needsUpdate=true;picture.userData.loaded=true;finish(true);},undefined,()=>{if(!disposed)picture.userData.failed=true;finish(false);});if(texture)own(texture);}catch{picture.userData.failed=true;finish(false);}}));
  const symbol=new T.Group();symbol.position.set(3.9,1.13,-2.5);symbol.name='Original geometric story mechanism · '+data.id;symbol.userData={archetypeHouse:data.id,archetypeAction:'read'};home.add(symbol);targets.push(symbol);const parts={};
  if(data.id==='persona'){
   const shape=new T.Shape();shape.absellipse(0,0,.72,1.05,0,Math.PI*2,false);for(const x of[-.27,.27]){const eye=new T.Path();eye.absellipse(x,.2,.13,.105,0,Math.PI*2,true);shape.holes.push(eye);}const mouth=new T.Path();mouth.absellipse(0,-.43,.21,.065,0,Math.PI*2,true);shape.holes.push(mouth);
   const mask=new T.Mesh(own(new T.ExtrudeGeometry(shape,{depth:.13,bevelEnabled:false,curveSegments:16})),accent);mask.position.set(0,1.25,0);symbol.add(mask);parts.mask=mask;
   parts.profiles=[];for(const x of[-1.05,1.05]){const profile=new T.Mesh(own(new T.TorusGeometry(.48,.055,8,24,Math.PI*1.5)),brass);profile.position.set(x,1.2,.05);symbol.add(profile);parts.profiles.push(profile);}beam(symbol,[0,0,0],[0,.28,0],.08,wood);
  }else if(data.id==='shadow'){
   parts.forms=[];for(const m of[accent,ink]){const form=new T.Group();box(form,.55,1.05,.55,0,.525,0,m);const head=new T.Mesh(own(new T.SphereGeometry(.27,12,8)),m);head.position.y=1.36;form.add(head);symbol.add(form);parts.forms.push(form);}const empty=new T.Mesh(own(new T.TorusGeometry(.35,.045,8,24)),brass);empty.rotation.x=-Math.PI/2;empty.position.set(0,.04,.92);symbol.add(empty);parts.empty=empty;
  }else if(data.id==='trickster'){
   const lyre=new T.Group();lyre.position.set(0,.3,-.25);symbol.add(lyre);parts.lyre=lyre;const path=new T.CatmullRomCurve3([new T.Vector3(-.7,1.5,0),new T.Vector3(-.5,.1,0),new T.Vector3(0,-.05,0),new T.Vector3(.5,.1,0),new T.Vector3(.7,1.5,0)]);lyre.add(new T.Mesh(own(new T.TubeGeometry(path,24,.065,8,false)),accent));beam(lyre,[-.7,1.45,0],[.7,1.45,0],.05,wood);for(let i=0;i<7;i++)beam(lyre,[-.45+i*.15,.1,0],[-.45+i*.15,1.45,0],.012,brass);
   parts.arrows=[];const arrowShape=new T.Shape();arrowShape.moveTo(-.12,-.2);arrowShape.lineTo(.12,-.2);arrowShape.lineTo(.12,.05);arrowShape.lineTo(.25,.05);arrowShape.lineTo(0,.35);arrowShape.lineTo(-.25,.05);arrowShape.lineTo(-.12,.05);arrowShape.closePath();const arrowGeo=own(new T.ShapeGeometry(arrowShape));for(let i=0;i<4;i++){const arrow=new T.Mesh(arrowGeo,ink);arrow.rotation.x=-Math.PI/2;arrow.position.set(-1+i*.65,.02,.95);symbol.add(arrow);parts.arrows.push(arrow);}parts.exchange=box(symbol,.28,.55,.28,1.15,.275,-.6,brass);
  }else{
   const gates=new T.Group();symbol.add(gates);parts.tokens=[];for(let i=0;i<7;i++){const x=-1.3+i*.43,y=.25+i*.11;for(const dx of[-.14,.14])box(gates,.055,y+.5,.14,x+dx,(y+.5)/2,-.25,accent);box(gates,.34,.06,.14,x,y+.5,-.25,accent);const token=new T.Mesh(own(new T.SphereGeometry(.085,8,6)),brass);token.position.set(x,y+.68,-.25);symbol.add(token);parts.tokens.push(token);}batch(gates);parts.returnPath=box(symbol,2.8,.025,.13,0,.03,.65,brass);parts.obligation=box(symbol,.22,.5,.22,1.2,.25,.65,ink);
  }
  const stageLabel=label(home,['Three story stages · change them in the reader','An original geometric teaching object'],3.9,.75,3.9,2.9,-4.3,{size:62});stageLabel.userData={archetypeHouse:data.id,archetypeAction:'read'};targets.push(stageLabel);
  batch(architecture);
  const record={data,group:home,picture,symbol,parts,artSize:{width:artWidth,height:artHeight},entry:archetypeEntry(data),insideEntry:archetypeEntry(data,true),inside:(x,z)=>archetypeInside(data,x,z),local:(x,z)=>archetypeLocal(data,x,z),canStand:(x,z,options)=>archetypeCanStand(data,x,z,options),stage:0,setStage(n){if(!Number.isInteger(n)||n<0||n>2)return false;this.stage=n;symbol.userData.stage=n;
   if(parts.mask){parts.mask.rotation.y=[0,Math.PI*.48,Math.PI*.82][n];parts.profiles.forEach(o=>o.visible=n===2);}
   if(parts.forms){parts.forms.forEach((o,i)=>{o.position.set((i?1:-1)*[1,.37,.55][n],0,n===2?-.35:0);o.rotation.y=n===0?(i?-Math.PI/4:Math.PI/4):n===1?(i?-Math.PI/2:Math.PI/2):0;});parts.empty.visible=n===2;}
   if(parts.lyre){parts.lyre.rotation.y=n===2?Math.atan2(1.15,-.35):0;parts.arrows.forEach(o=>o.rotation.z=n===1?Math.PI:0);parts.exchange.visible=n===2;}
   if(parts.tokens){parts.tokens.forEach((o,i)=>{o.position.y=n===0?.93+i*.11:.1;o.position.z=n===2?.65:-.25;});parts.returnPath.visible=n===2;parts.obligation.visible=n===2;}
   return true;}};record.setStage(0);houses.push(record);
 }
 const courtColliders=[3*Math.PI/4,5*Math.PI/4,7*Math.PI/4].map(a=>({x:ARCHETYPES_QUARTER.x+Math.cos(a)*10,z:ARCHETYPES_QUARTER.z+Math.sin(a)*10,angle:a}));
 return{group,houses,targets,ready:Promise.all(jobs),get disposed(){return disposed;},canStand(x,z,options){if(disposed)return true;return houses.every(h=>h.canStand(x,z,options))&&!courtColliders.some(b=>{const dx=x-b.x,dz=z-b.z;return Math.abs(dx*Math.cos(b.angle)+dz*Math.sin(b.angle))<1.73&&Math.abs(-dx*Math.sin(b.angle)+dz*Math.cos(b.angle))<.63;});},dispose(){if(disposed)return;disposed=true;for(const finish of[...pending])finish(false);group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const r of[...owned])release(r);group.clear();}};
}
