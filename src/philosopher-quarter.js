import {PHILOSOPHERS,quarterPaths,pickLanguage} from './philosopher-data.js';

// A single, additive ground-level district. No renderer, account or private archive.
export function createPhilosopherQuarter(T,{language=()=> 'en',canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group();group.name='Philosophers’ quarter · six imagined homes';
 const colliders=[],targets=[],homes=[],labels=[],geometries=new Map(),materials=new Map(),textures=[];
 const material=color=>{if(!materials.has(color))materials.set(color,new T.MeshLambertMaterial({color}));return materials.get(color);};
 const geometry=(key,create)=>{if(!geometries.has(key))geometries.set(key,create());return geometries.get(key);};
 const box=(parent,w,h,d,x,y,z,color)=>{const mesh=new T.Mesh(geometry(`b:${w}:${h}:${d}`,()=>new T.BoxGeometry(w,h,d)),material(color));mesh.position.set(x,y,z);parent.add(mesh);return mesh;};
 const cylinder=(parent,r,h,x,y,z,color,top=r)=>{const mesh=new T.Mesh(geometry(`c:${r}:${h}:${top}`,()=>new T.CylinderGeometry(top,r,h,12)),material(color));mesh.position.set(x,y,z);parent.add(mesh);return mesh;};
 const ring=(parent,r,x,y,z,color,rotation=0)=>{const mesh=new T.Mesh(geometry(`r:${r}`,()=>new T.TorusGeometry(r,.055,6,40)),material(color));mesh.position.set(x,y,z);mesh.rotation.x=rotation;parent.add(mesh);return mesh;};
 const block=(home,x,z,w,d)=>colliders.push({minX:home.x+x-w/2,maxX:home.x+x+w/2,minZ:home.z+z-d/2,maxZ:home.z+z+d/2});
 const label=(parent,text,x,y,z,width=8)=>{const c=canvas();c.width=1024;c.height=192;const texture=new T.CanvasTexture(c);textures.push(texture);const mat=new T.MeshBasicMaterial({map:texture,side:T.DoubleSide,transparent:true});const mesh=new T.Mesh(geometry('label',()=>new T.PlaneGeometry(1,1)),mat);mesh.position.set(x,y,z);mesh.scale.set(width,width*192/1024,1);parent.add(mesh);labels.push({c,texture,text,mat});return mesh;};
 const action=(mesh,home,section)=>{mesh.userData={philosopherId:home.id,philosopherSection:section};targets.push(mesh);return mesh;};
 const pathMaterial=0xc5b797;
 for(const points of quarterPaths)for(let i=1;i<points.length;i++){const [a,b]=[points[i-1],points[i]],dx=b[0]-a[0],dz=b[1]-a[1];const mesh=box(group,4.6,.1,Math.hypot(dx,dz)+1,(a[0]+b[0])/2,.075,(a[1]+b[1])/2,pathMaterial);mesh.rotation.y=Math.atan2(dx,dz);mesh.visible=globalThis.CITY_CONFIG?.showGroundPaving!==false;}
 const sign=label(group,()=>language()==='fa'?'محلهٔ فیلسوفان · شش خانه':'PHILOSOPHERS’ QUARTER · SIX HOMES',-260,3.3,-130,15);sign.rotation.y=Math.PI/2;
 cylinder(group,.13,3.5,-260,1.75,-130,0x625b4b);
 for(const home of PHILOSOPHERS){
  const root=new T.Group();root.name=home.id+' · '+home.home[1];root.position.set(home.x,0,home.z);root.userData.cityDestination='philosopher:'+home.id;group.add(root);
  const wall=home.style==='library'?0xc3b18b:home.style==='courtyard'?0xd8c9ad:0xded8c5,wood=0x71573e,ink=0x344248;
  box(root,24,.14,26,0,-.01,0,0x64776a);box(root,20,.12,22,0,.07,0,0xb8ae94);
  // An open roof and a three-metre entrance keep interiors visible and walkable.
  for(const x of [-10,10]){box(root,.35,3.6,22,x,1.93,0,wall);block(home,x,0,.35,22);}
  box(root,20,3.6,.35,0,1.93,-11,wall);block(home,0,-11,20,.35);
  for(const x of [-5.75,5.75]){box(root,8.5,3.6,.35,x,1.93,11,wall);block(home,x,11,8.5,.35);}
  box(root,3,1,.35,0,3.23,11,home.color);
  for(const x of [-10,10])box(root,.55,.25,22.7,x,3.86,0,home.color);
  for(const z of [-11,11])box(root,20.6,.25,.65,0,3.86,z,home.color);
  action(label(root,()=>pickLanguage(home.name,language()),0,4.7,11.35,8),home,'intro');
  label(root,()=>pickLanguage(home.home,language()),0,3.15,11.23,7.4);
  box(root,3,.08,5,0,.09,14,pathMaterial).visible=globalThis.CITY_CONFIG?.showGroundPaving!==false;
  // Library desk with a real interactive book, plus an unobstructed centre aisle.
  box(root,4,.18,1.8,4,1.2,-6,wood);block(home,4,-6,4,1.8);
  for(const x of [2.4,5.6])box(root,.15,1.1,1.4,x,.63,-6,wood);
  const book=action(box(root,1.15,.14,.85,3.4,1.36,-5.9,home.color),home,'reading');
  box(root,1.05,.08,.76,3.4,1.4,-5.9,0xf2e6ca);book.userData.label=home.reading[1];
  label(root,()=>language()==='fa'?'خواندن و اندیشیدن':'READ & REFLECT',4,2.35,-6.8,4.2);
  for(let shelf=0;shelf<3;shelf++){
   box(root,4,.13,.6,-5,1+shelf*.65,-10.45,wood);
   for(let i=0;i<8;i++)box(root,.25,.4+(i%3)*.06,.38,-6.5+i*.43,1.27+shelf*.65,-10.4,[home.color,0x9d6c53,0x8d9d86][i%3]);
  }block(home,-5,-10.45,4,.8);
  for(const x of [4,7]){box(root,1.3,.15,1.2,x,.65,2,wood);box(root,1.3,.9,.15,x,1.14,2.5,home.color);block(home,x,2,1.3,1.35);for(const dx of [-.45,.45])box(root,.12,.55,.8,x+dx,.34,2,wood);}
  action(label(root,()=>pickLanguage(home.object,language()),-5,2.8,-3.8,6),home,'idea');
  const pedestal=action(cylinder(root,1.3,.7,-5,.48,-2,0x8c8776),home,'idea');block(home,-5,-2,2.6,2.6);
  const disc=()=>{const n=cylinder(root,1.25,.1,-5,1.6,-2,home.color);action(n,home,'idea');return n;};
  if(home.style==='academy'){
   for(const x of [-8,8])for(const z of [-7,7]){cylinder(root,.27,3.4,x,1.83,z,wall);cylinder(root,.44,.18,x,3.55,z,wall);block(home,x,z,.7,.7);}
   action(ring(root,1,-5,1.9,-2,0xd3ad60),home,'idea');box(root,2.5,.025,1.2,-5,.15,-.8,0x777c71);
  }else if(home.style==='lyceum'){
   for(const z of [-8,-4,0,4,8]){cylinder(root,.23,3.35,-8.3,1.8,z,wall);block(home,-8.3,z,.6,.6);}box(root,1.3,.15,19,-8.3,3.5,0,home.color);
   cylinder(root,.075,1.6,-5,1.6,-2,0xb99b60);box(root,2.1,.08,.12,-5,2.35,-2,0xb99b60);for(const x of [-5.85,-4.15]){cylinder(root,.025,.55,x,2.05,-2,0xb99b60);cylinder(root,.32,.07,x,1.75,-2,0xb99b60);}
  }else if(home.style==='garden'){
   for(const x of [-7.5,7.5])for(const z of [-6,6]){cylinder(root,.17,3.4,x,1.83,z,wood);block(home,x,z,.5,.5);}for(const z of [-6,-3,0,3,6])box(root,16,.14,.15,0,3.6,z,wood);
   for(const x of [-7,7]){box(root,2,.5,3,x,.38,7,0x947b57);block(home,x,7,2,3);for(const dz of [-.8,0,.8])cylinder(root,.65,1.1,x,1.1,7+dz,0x7b975e,.25);}
   disc();cylinder(root,.3,.12,-5.4,1.72,-2,0xcaa468);cylinder(root,.2,.5,-4.5,1.9,-2,0xbed4ce);
  }else if(home.style==='observatory'){
   const roof=ring(root,7,0,4.6,0,home.color,Math.PI/2);for(const yaw of [0,Math.PI/2]){const arc=ring(root,7,0,4.6,0,home.color);arc.rotation.y=yaw;arc.scale.y=.42;}
   for(const x of [-8,8]){cylinder(root,.18,4.4,x,2.3,-8,wall);block(home,x,-8,.6,.6);}
   for(const angle of [0,.8,-.8]){const r=action(ring(root,1,-5,1.95,-2,0xc6ac72),home,'idea');r.rotation.y=angle;r.rotation.x=angle*.8;}cylinder(root,.12,.8,-5,1.2,-2,ink);
  }else if(home.style==='courtyard'){
   for(const z of [-10,10])for(const y of [3.85,4.25]){box(root,22,.14,2.2,0,y,z,0x665b50);for(const x of [-10.7,10.7])box(root,.2,.4,2.3,x,y+.13,z,wood);}
   for(const x of [-7.5,7.5]){cylinder(root,.17,3.6,x,1.93,7.5,0x985d48);block(home,x,7.5,.5,.5);}
   for(const x of [-5.65,-4.35]){box(root,.75,.1,.8,x,1.15,-2,wood);box(root,.75,.8,.1,x,1.6,-2.35,home.color);}
  }else{
   for(const x of [-8,8]){cylinder(root,.22,3.5,x,1.88,7.5,wall);block(home,x,7.5,.6,.6);}const arch=ring(root,8,0,3.8,7.5,home.color);arch.scale.y=.27;
   const archIdea=action(ring(root,1,-5,1.7,-2,0xd6b66b),home,'idea');archIdea.scale.y=1.25;box(root,1.7,.08,1.2,-5,1,-2,home.color);
  }
  const bounds={minX:home.x-10,maxX:home.x+10,minZ:home.z-11,maxZ:home.z+11};
  homes.push({...home,group:root,bounds,entry:{x:home.x,y:.13,z:home.z+13,yaw:0},study:{x:home.x,y:.13,z:home.z-4,yaw:0}});
 }
 function refreshLanguage(){for(const item of labels){const ctx=item.c.getContext('2d');ctx.clearRect(0,0,1024,192);ctx.fillStyle='#233b39';ctx.fillRect(0,0,1024,192);ctx.strokeStyle='#bda779';ctx.lineWidth=4;ctx.strokeRect(6,6,1012,180);ctx.fillStyle='#f2e6cc';ctx.font='52px Tahoma, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction=language()==='fa'?'rtl':'ltr';ctx.fillText(item.text(),512,96,970);item.texture.needsUpdate=true;}}
 function canStand(x,z){return Number.isFinite(x)&&Number.isFinite(z)&&!colliders.some(b=>x>b.minX-.24&&x<b.maxX+.24&&z>b.minZ-.24&&z<b.maxZ+.24);}
 function region(x,z){const home=homes.find(h=>x>h.bounds.minX&&x<h.bounds.maxX&&z>h.bounds.minZ&&z<h.bounds.maxZ);if(home)return{id:'philosophers',philosopherId:home.id,title:pickLanguage(home.name,language())+' · '+pickLanguage(home.home,language()),inside:true};if(x>-269&&x<-191&&z>-151&&z<21)return{id:'philosophers',title:language()==='fa'?'محلهٔ فیلسوفان':'Philosophers’ quarter',inside:false};return null;}
 function entryFor(destination){if(destination==='philosophers')return{x:-260,y:.13,z:-132,yaw:Math.PI};return homes.find(h=>'philosopher:'+h.id===destination)?.entry||null;}
 function dispose(){group.removeFromParent();for(const g of geometries.values())g.dispose();for(const m of materials.values())m.dispose();for(const item of labels)item.mat.dispose();textures.forEach(t=>t.dispose());}
 function drawMap(ctx,{s,cx,cz}){ctx.strokeStyle='#b4cba5';ctx.lineWidth=1;for(const path of quarterPaths){ctx.beginPath();path.forEach((p,i)=>ctx[i?'lineTo':'moveTo'](cx+p[0]*s,cz+p[1]*s));ctx.stroke();}ctx.fillStyle='#b4cba5';for(const h of homes)ctx.fillRect(cx+(h.x-10)*s,cz+(h.z-11)*s,20*s,22*s);ctx.font='10px Tahoma';ctx.textAlign='center';ctx.fillText(language()==='fa'?'فیلسوفان':'Philosophers',cx-229*s,cz+29*s);}
 refreshLanguage();return{group,homes,targets,colliders,canStand,region,entryFor,refreshLanguage,drawMap,dispose};
}
