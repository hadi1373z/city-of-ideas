import {STUDY_HOUSES} from './study-houses-data.js';
import {colour,neighbours,bayes} from './study-house-models.js?v=workbench1';
export function buildStudyHouses(T,{canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group(),houses=[],targets=[],colliders=[],owned=new Set(),own=r=>(owned.add(r),r),material=c=>own(new T.MeshLambertMaterial({color:c}));group.name='Advanced study courtyard';
 const stone=material(0xc4bda6),wood=material(0x775c43),paper=material(0xe7dfc8),floor=material(0xb4a889),glass=own(new T.MeshLambertMaterial({color:0xb1c9c2,transparent:true,opacity:.13,depthWrite:false}));
 function box(p,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);p.add(o);return o;}
 function label(p,width,height,x,y,z){const c=canvas();c.width=1200;c.height=Math.round(1200*height/width);const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;const o=new T.Mesh(own(new T.PlaneGeometry(width,height)),own(new T.MeshBasicMaterial({map:texture,toneMapped:false})));o.position.set(x,y,z);p.add(o);return{c,texture,o,paint(text){const ctx=c.getContext('2d');ctx.fillStyle='#eee6cc';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#2c483e';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=Math.round(c.height*.35)+'px Tahoma';ctx.direction=/[\u0600-\u06ff]/.test(text)?'rtl':'ltr';ctx.fillText(text,c.width/2,c.height/2,c.width-55);texture.needsUpdate=true;}};}
 for(const data of STUDY_HOUSES){
  const home=new T.Group();home.name=data.names.en;home.position.set(data.x,.13,data.z);home.rotation.y=data.turn;home.userData.cityDestination='study:'+data.id;group.add(home);const direction=data.turn?-1:1,trim=material(data.colour),dark=material(0x344d44);
  const world=(x,z)=>({x:data.x+direction*x,z:data.z+direction*z}),obstacle=(x,z,w,d)=>{const p=world(x,z);colliders.push({minX:p.x-w/2,maxX:p.x+w/2,minZ:p.z-d/2,maxZ:p.z+d/2,id:data.id});};
  box(home,16,.10,12,0,-.05,0,floor);if(data.id==='proof'){for(const x of[-4.9,4.9]){box(home,6.2,4.2,.22,x,2.1,-6,stone);obstacle(x,-6,6.2,.22);}box(home,3.6,.9,.22,0,3.75,-6,wood);const passage=label(home,3.3,.38,0,3.75,-5.84);passage.paint('Proof Atelier · six workshops');}else{box(home,16,4.2,.22,0,2.1,-6,stone);obstacle(0,-6,16,.22);}
  for(const x of[-8,8]){box(home,.22,1,12,x,.5,0,stone);box(home,.22,.9,12,x,3.75,0,stone);for(const z of[-4.5,4.5])box(home,.22,2.3,3,x,2.15,z,stone);box(home,.025,2.3,6,x,2.15,0,glass);for(const z of[-3,0,3])box(home,.12,2.4,.10,x-direction*.03,2.15,z,trim);obstacle(x,0,.22,12);}
  for(const x of[-4.8,4.8]){box(home,6.4,1,.22,x,.5,6,stone);box(home,6.4,.9,.22,x,3.75,6,stone);for(const side of[-1,1])box(home,.18,2.3,.22,x+side*3.1,2.15,6,stone);box(home,6,2.3,.025,x,2.15,6,glass);for(const dx of[-3,0,3])box(home,.08,2.4,.12,x+dx,2.15,6.1,trim);obstacle(x,6,6.4,.22);}
  // An open, wall-connected threshold; no floating door leaves or steps.
  for(const x of[-1.6,1.6])box(home,.14,3.3,.3,x,1.65,6.03,wood);box(home,3.3,.9,.3,0,3.75,6.03,trim);
  const name=label(home,3.0,.4,0,3.75,6.2);targets.push(name.o);name.o.userData={studyHouse:data.id};
  box(home,16,.12,12,0,4.15,0,paper);
  if(data.id==='proof'){for(const side of[-1,1]){const roof=box(home,8.7,.22,13,side*4,4.92,0,dark);roof.rotation.z=-side*.18;}}
  else{box(home,17,.22,13,0,4.35,0,trim);if(data.id==='uncertainty'){box(home,8,.65,3,0,4.8,-1,glass);box(home,8.4,.15,3.4,0,5.2,-1,wood);}else{for(let i=0;i<3;i++)box(home,5,.35,13,-5+i*5,4.55+i*.22,0,dark);}}
  for(const x of[-5.8,5.8]){if(data.id==='proof'&&x<0)continue;box(home,2.2,1.05,.45,x,.525,-5.5,wood);for(const row of[.35,.7,1.02])box(home,2.25,.06,.5,x,row,-5.5,trim);for(let j=0;j<6;j++)box(home,.18,.27,.27,x-.9+j*.34,.86,-5.4,j%2?paper:trim);obstacle(x,-5.5,2.25,.5);}
  box(home,2.6,.1,1.25,5,1,-1,wood);for(const x of[3.9,6.1])for(const z of[-1.45,-.55])box(home,.1,.95,.1,x,.475,z,wood);box(home,1.4,.02,.7,5,1.06,-1,paper);obstacle(5,-1,2.6,1.25);
  for(const x of[-4.5,4.5]){box(home,2.4,.12,.65,x,.5,2,trim);box(home,2.4,.5,.1,x,.8,2.3,trim);for(const dx of[-1,1])box(home,.1,.44,.5,x+dx,.22,2,wood);obstacle(x,2,2.4,.8);}
  const exhibit=new T.Group();exhibit.position.set(data.id==='proof'?-4.6:0,2.1,-5.78);exhibit.userData={studyHouse:data.id,dynamic:true};home.add(exhibit);box(exhibit,4.8,3.2,.08,0,0,0,wood);obstacle(data.id==='proof'?-4.6:0,-5.55,4.8,.6);
  const caption=label(exhibit,4.5,.35,0,1.3,.06),cells=[],bars=[],links=[];let readout;
  if(data.id==='proof')for(let i=0;i<16;i++){const tile=box(exhibit,.47,.47,.07,(i%4-1.5)*.53,.02-(Math.floor(i/4)-1.5)*.53,.09,material(colour(i)?0xe5d7b7:0x4c6257));tile.userData={studyHouse:data.id,studyCell:i,dynamic:true};targets.push(tile);cells.push(tile);}
  else if(data.id==='uncertainty'){for(let i=0;i<2;i++){const bar=box(exhibit,1,.32,.09,-1.95,.45-i*.75,.1,material(i?0x9a7560:0x829e67));bars.push(bar);}readout=label(exhibit,4.4,.42,0,-1.03,.07);}
  else{for(let i=0;i<5;i++){box(exhibit,.72,.9,.08,(i-2)*.82,0,.09,paper);cells.push(label(exhibit,.67,.78,(i-2)*.82,0,.14));}readout=label(exhibit,4.4,.43,0,-.95,.08);}
  if(data.id==='proof')for(let i=0;i<8;i++){const domino=box(exhibit,.95,.41,.035,0,0,.15,material([0x8ebba8,0xb1a0c2,0xc7ae77,0x86a8bd][i%4]));domino.visible=false;domino.userData={studyHouse:data.id,dynamic:true};links.push(domino);}
  exhibit.traverse(o=>o.userData={studyHouse:data.id,dynamic:true,...o.userData});
  targets.push(exhibit);const inside=(x,z)=>Math.abs(x-data.x)<7.8&&Math.abs(z-data.z)<5.8;
  houses.push({data,group:home,name,exhibit,caption,cells,bars,links,readout,inside,entry:{...world(0,8),y:.13,yaw:data.turn},insideEntry:{...world(0,3.9),y:.13,yaw:data.turn},view:{...world(0,.5),y:.13,yaw:data.turn,pitch:-.1},world});
 }
 const paths=[[[203.5,-50],[203.5,-112],[243,-112]],[[215,-112],[215,-100]],[[243,-112],[243,-100]],[[229,-112],[229,-123]]];
 for(const points of paths)for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]),m=new T.Mesh(own(new T.PlaneGeometry(3.5,length+.01)),material(0x6e8268));m.rotation.x=-Math.PI/2;m.rotation.z=-Math.atan2(b[0]-a[0],b[1]-a[1]);m.position.set((a[0]+b[0])/2,.012,(a[1]+b[1])/2);m.name='Smooth study garden route';group.add(m);}
 let lastKey='';function update({lang='en',board,selection=[],prior=.01,repeats=1,independent=true,machine,showMatching=false,pairs=[]}){
  const key=JSON.stringify([lang,board,selection,prior,repeats,independent,machine?.steps,showMatching]);if(key===lastKey)return;lastKey=key;
  for(const h of houses)h.name.paint(h.data.names[lang]||h.data.names.en);
  const proof=houses[0],near=neighbours(board,selection);proof.caption.paint(showMatching?'Maximum matching · '+pairs.length+' dominoes':'S and N(S) · '+selection.length+' / '+near.length);for(const[i,c]of proof.cells.entries()){c.visible=board.includes(i);const p=pairs.findIndex(p=>p.includes(i));c.material.color.setHex(selection.includes(i)?0xd7b857:near.includes(i)?0x79a6b5:showMatching&&p>=0?[0x8ebba8,0xb1a0c2,0xc7ae77,0x86a8bd][p%4]:colour(i)?0xe5d7b7:0x4c6257);}
  for(const[i,link]of proof.links.entries()){const pair=pairs[i];link.visible=showMatching&&!!pair;if(pair){const[a,b]=pair;link.position.x=((a%4+b%4)/2-1.5)*.53;link.position.y=.02-((Math.floor(a/4)+Math.floor(b/4))/2-1.5)*.53;link.rotation.z=Math.floor(a/4)===Math.floor(b/4)?0:Math.PI/2;}}
  const uncertainty=houses[1],b=bayes(prior,.9,.05,repeats,independent);uncertainty.caption.paint('Share of flagged components / 100%');for(const[i,bar]of uncertainty.bars.entries()){const width=4.1*[b.hit,b.falseAlarm][i]/(b.hit+b.falseAlarm);bar.scale.x=Math.max(.002,width);bar.position.x=-2.05+width/2;}uncertainty.readout.paint(b.hit.toFixed(2)+' faulty · '+b.falseAlarm.toFixed(2)+' sound');
  const computation=houses[2];computation.caption.paint('Complete toy state · counter');if(machine){const digits=String(machine.counter).padStart(5,'0');computation.cells.forEach((c,i)=>c.paint(digits[i]));computation.readout.paint(machine.steps+' steps · '+(machine.halted?'HALTED':machine.repeated?'REPEATED STATE':'NOT YET HALTED'));}
 }
 return{group,houses,targets,colliders,paths,update,canStand:(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&!colliders.some(b=>x>b.minX-.22&&x<b.maxX+.22&&z>b.minZ-.22&&z<b.maxZ+.22),dispose(){group.removeFromParent();for(const r of owned)r.dispose();group.clear();}};
}
