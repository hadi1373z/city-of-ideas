/* Genuine source edition factories and saved-neighbor exteriors. Runtime-only home data.
 * House of Ideas commit 48ccb361e8e64857f4e9f94f4598d8dc97970e00.
 * No renderer, private static data, backend request, main scene mutation or auto translation.
 * Load existing Three160, CITY_SOURCES and CITY_HOME_SCENE first.
 */
(function(g){'use strict';
const THREE=g.THREE,S=g.CITY_SOURCES,H=g.CITY_HOME_SCENE;
if(!H||!S||THREE?.REVISION!=='160')throw Error('Load Three160, CITY_SOURCES and CITY_HOME_SCENE before home-neighbors.js.');
const {sharedEdge,BOOKS,ideaDisplays}=S;
const {houseBounds,entranceFor,roomAtPoint,reachableIds,walkingRoute,canExploreAt,canOccupy,stepAlongPath,findWalkingPath,yardBounds}=H;
const domestic=(function(){
// Domestic furnishings in metres. No DOM, textures, network, or saved-state edits.
const HOME_ROLES = {math:'study',art:'bedroom',work:'kitchen',questions:'living room',learning:'entrance hall',connections:'library'};
const HOME_BOOKS = Object.fromEntries(BOOKS.map(({id,title})=>[id,title]));
const bookIds=Object.keys(HOME_BOOKS);
const overlap=(a,b,pad=0)=>a.minX<b.maxX+pad&&a.maxX>b.minX-pad&&a.minZ<b.maxZ+pad&&a.maxZ>b.minZ-pad;

function kit(T){
 const books=[],lights=[];let bookSequence=0;
 const material=(color,roughness=.76,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const m={oak:material('#a27c53'),walnut:material('#6b4d36'),cream:material('#eee4d3'),linen:material('#d5c8b3'),sage:material('#889080'),rose:material('#b99283'),ink:material('#3d4545'),metal:material('#9fa7a4',.27,.65),white:material('#e9e7de'),glass:material('#273337',.17,.12),leaf:material('#52745b'),terra:material('#a46d51'),paper:material('#f2ead8'),blue:material('#677d8a'),gold:material('#b69a60',.38,.4)};
 const box=(g,w,h,d,x,y,z,mat)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
 const cyl=(g,r,h,x,y,z,mat,top=r)=>{const o=new T.Mesh(new T.CylinderGeometry(top,r,h,20),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
 const ball=(g,r,x,y,z,mat,sx=1,sy=1,sz=1)=>{const o=new T.Mesh(new T.SphereGeometry(r,20,12),mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;g.add(o);return o;};
 const ring=(g,r,t,x,y,z,mat,flat=false)=>{const o=new T.Mesh(new T.TorusGeometry(r,t,8,24),mat);o.position.set(x,y,z);if(flat)o.rotation.x=Math.PI/2;g.add(o);return o;};
 const trackBook=(root,node,x,y,z)=>{const bookId=bookIds[bookSequence%bookIds.length];books.push({root,node,bookId,instance:bookSequence++,target:new T.Vector3(x,y,z)});node.userData.bookId=bookId;return node;};
 const book=(g,x,y,z,w=.24,d=.32,color=m.sage)=>{const n=new T.Group();g.add(n);box(n,w,.045,d,x,y,z,color);box(n,w-.015,.025,d-.02,x,y+.004,z,m.paper);box(n,w,.008,d,x,y+.022,z,color);for(let i=0;i<3;i++)box(n,w-.02,.002,d-.03,x,y-.009+i*.007,z,m.linen);box(n,.015,.048,d,x-w/2+.009,y,z,m.walnut);for(let i=0;i<3;i++)box(n,.02,.004,.007,x-w/2+.017,y+.025,z-d*.3+i*d*.3,m.gold);return trackBook(g,n,x,y,z);};
 const cup=(g,x,y,z)=>{const n=new T.Group();g.add(n);cyl(n,.065,.012,x,y,z,m.white);cyl(n,.047,.085,x,y+.05,z,m.cream,.055);cyl(n,.046,.004,x,y+.094,z,m.walnut);ring(n,.052,.008,x,y+.094,z,m.white,true);ring(n,.029,.009,x+.069,y+.053,z,m.cream);return n;};
 const lamp=(g,x,y,z)=>{const n=new T.Group();g.add(n);cyl(n,.13,.025,x,y+.012,z,m.metal);cyl(n,.015,.45,x,y+.24,z,m.gold);cyl(n,.18,.22,x,y+.54,z,m.cream,.095);const bulb=ball(n,.042,x,y+.47,z,new T.MeshStandardMaterial({color:'#f6dbaa',emissive:'#d6a76e',emissiveIntensity:.35}));bulb.userData.homeBulb=true;const light=new T.PointLight('#ffdda9',1.6,3,2);light.position.set(x,y+.47,z);n.add(light);n.userData.homeLampOn=true;lights.push({root:g,node:n,target:new T.Vector3(x,y+.54,z)});return n;};
 const plant=(g,x,y,z,scale=1)=>{cyl(g,.15*scale,.24*scale,x,y+.12*scale,z,m.terra,.18*scale);cyl(g,.175*scale,.012,x,y+.243*scale,z,m.walnut);for(let i=0;i<5;i++){const a=i*2.4;ball(g,.15*scale,x+Math.cos(a)*.12*scale,y+.36*scale+(i%2)*.12*scale,z+Math.sin(a)*.1*scale,m.leaf,.62,1.5,.85);}};
 const chair=(g,x,z,fabric=m.sage)=>{const n=new T.Group();g.add(n);box(n,.48,.1,.48,x,.47,z,fabric);box(n,.47,.4,.09,x,.71,z-.2,fabric);for(const dx of [-.18,.18])for(const dz of [-.18,.18])cyl(n,.025,.43,x+dx,.215,z+dz,m.walnut);box(n,.48,.025,.025,x,.485,z+.247,m.linen);return n;};
 return {T,m,box,cyl,ball,ring,book,cup,lamp,plant,chair,books,lights,trackBook};
}

function prototype(k,kind,compact=false){
 const {T,m,box,cyl,ball,ring,book,cup,lamp,plant,chair}=k,g=new T.Group(),actions=[];
 const action=(node,type,label,x=0,y=.8,z=0)=>actions.push({node,type,label,target:new T.Vector3(x,y,z)});
 if(kind==='desk'){
  const w=compact?1.05:1.5;box(g,w,.055,.65,0,.76,0,m.oak);for(const dx of [-w/2+.08,w/2-.08])for(const dz of [-.24,.24])box(g,.055,.72,.055,dx,.36,dz,m.walnut);
  box(g,.39,.24,.56,w/2-.24,.59,0,m.oak);for(const y of [.52,.64]){box(g,.35,.095,.018,w/2-.24,y,.29,m.linen);box(g,.12,.014,.027,w/2-.24,y,.308,m.gold);}
  const journal=book(g,-.17,.81,.03,.27,.34,m.blue);action(journal,'journal','Write at the study desk',-.17,.84,.03);
  const reading=book(g,.17,.82,-.13,.19,.26,m.walnut);action(reading,'read','Read the book on the desk',.17,.85,-.13);lamp(g,-w/2+.2,.8,-.14);
  cyl(g,.034,.11,w/2-.16,.86,.08,m.ink);for(let i=0;i<3;i++){const pen=cyl(g,.006,.18,w/2-.17+i*.015,.93,.08,m.oak);pen.rotation.z=(i-1)*.13;}
 }else if(kind==='armchair'){
  box(g,.7,.18,.66,0,.43,0,m.sage);box(g,.68,.56,.16,0,.75,-.25,m.sage);for(const x of [-.32,.32]){box(g,.14,.28,.67,x,.64,0,m.sage);box(g,.105,.11,.66,x,.82,0,m.linen);}for(const x of [-.26,.26])for(const z of [-.23,.23])box(g,.055,.25,.055,x,.125,z,m.walnut);
  box(g,.48,.026,.47,0,.54,.035,m.linen);box(g,.36,.24,.1,0,.73,-.15,m.rose);action(g,'sit','Sit in the reading chair',0,.65,.12);
 }else if(kind==='bed'){
  const w=compact?.92:1.42,d=compact?1.8:2.06;box(g,w,.22,d,0,.24,0,m.oak);for(const x of [-w/2+.07,w/2-.07])for(const z of [-d/2+.09,d/2-.09])box(g,.08,.14,.08,x,.07,z,m.walnut);
  box(g,w-.07,.2,d-.07,0,.45,0,m.cream);box(g,w+.025,.85,.095,0,.57,-d/2,m.walnut);box(g,w-.11,.55,.035,0,.64,-d/2+.065,m.linen);
  box(g,w-.055,.07,d*.66,0,.585,d*.15,m.blue);for(const x of [-w*.21,w*.21])ball(g,.2,x,.64,-d*.31,m.paper,1.25,.35,.7);box(g,w-.06,.026,.16,0,.632,-d*.16,m.linen);
  for(let n=0;n<5;n++)box(g,.018,.004,d*.6,-w*.38+n*w*.19,.623,d*.14,m.sage);
  action(g,'rest','Rest beside the bedroom bed',0,.67,.1);const b=book(g,w*.29,.665,d*.3,.2,.27,m.rose);action(b,'read','Read the bedtime book',w*.29,.69,d*.3);
 }else if(kind==='nightstand'){
  box(g,.44,.56,.41,0,.28,0,m.oak);box(g,.39,.18,.025,0,.37,.221,m.linen);ball(g,.025,0,.37,.244,m.gold);box(g,.47,.035,.45,0,.575,0,m.walnut);lamp(g,-.07,.61,-.04);const c=cup(g,.115,.61,.1);action(c,'tea','Have a quiet evening tea',.115,.7,.1);
 }else if(kind==='wardrobe'){
  const w=compact?.64:1.05;box(g,w,1.97,.48,0,1.02,0,m.oak);for(const x of [-w*.25,w*.25]){box(g,w*.46,1.81,.025,x,1.04,.258,m.linen);cyl(g,.012,.14,x+(x<0?.08:-.08),1.02,.286,m.gold);}box(g,w+.04,.05,.53,0,2.02,0,m.walnut);box(g,w-.1,.1,.39,0,.05,0,m.walnut);
 }else if(kind==='counter'){
  const w=compact?1.32:1.9;box(g,w,.79,.61,0,.415,0,m.white);box(g,w+.035,.047,.67,0,.835,0,m.linen);box(g,w,.06,.51,0,.04,0,m.ink);
  for(let i=0;i<3;i++){const x=-w/2+w*(i+.5)/3;box(g,w/3-.035,.64,.021,x,.44,.32,m.cream);box(g,.11,.015,.028,x,.66,.343,m.metal);}box(g,w,.33,.055,0,1.01,-.31,m.cream);
  const sinkX=-w*.26;box(g,.38,.012,.37,sinkX,.864,0,m.metal);box(g,.31,.014,.28,sinkX,.873,0,m.ink);for(const dx of [-.17,.17])box(g,.025,.043,.31,sinkX+dx,.875,0,m.metal);
  const curve=new T.CatmullRomCurve3([new T.Vector3(sinkX,.88,-.18),new T.Vector3(sinkX,1.16,-.18),new T.Vector3(sinkX,1.18,-.02),new T.Vector3(sinkX,1.08,.03)]);g.add(new T.Mesh(new T.TubeGeometry(curve,20,.015,8,false),m.metal));
  const stoveX=w*.26;box(g,.46,.015,.42,stoveX,.868,0,m.glass);for(const x of [-.12,.12])for(const z of [-.1,.1])ring(g,.073,.009,stoveX+x,.882,z,m.metal,true);
  box(g,.42,.36,.025,stoveX,.48,.337,m.glass);box(g,.31,.025,.035,stoveX,.69,.363,m.metal);for(let i=0;i<3;i++)ball(g,.017,stoveX-.12+i*.12,.75,.347,m.metal);
  const c=cup(g,-.05,.868,.12);action(c,'tea','Make tea at the kitchen counter',-.05,.97,.12);const b=book(g,stoveX,.904,-.12,.17,.22,m.rose);action(b,'read','Read the kitchen recipe',stoveX,.93,-.12);
 }else if(kind==='fridge'){
  box(g,.59,1.77,.6,0,.92,0,m.white);box(g,.56,.42,.032,0,1.54,.321,m.cream);box(g,.56,1.17,.032,0,.715,.321,m.cream);box(g,.025,.2,.045,.225,1.5,.36,m.metal);box(g,.025,.43,.045,.225,.91,.36,m.metal);for(let i=0;i<2;i++)box(g,.09,.08,.006,-.13+i*.19,1.32,.342,i?m.rose:m.sage);
 }else if(kind==='dining'){
  const w=compact?.7:1.0;box(g,w,.06,.65,0,.74,0,m.oak);for(const x of [-w/2+.07,w/2-.07])for(const z of [-.23,.23])box(g,.045,.71,.045,x,.355,z,m.walnut);
  const ch=chair(g,0,.63,m.linen);action(ch,'sit','Sit at the kitchen table',0,.62,.64);const c=cup(g,.16,.783,.1);action(c,'tea','Drink tea at the kitchen table',.16,.87,.1);cyl(g,.12,.009,-.19,.781,-.02,m.paper);box(g,.026,.008,.24,-.36,.784,-.02,m.metal);
 }else if(kind==='sofa'){
  const w=compact?1.12:2.15;box(g,w,.29,.79,0,.39,0,m.sage);box(g,w,.52,.17,0,.69,-.31,m.sage);for(const x of [-w/2+.09,w/2-.09]){box(g,.2,.28,.82,x,.61,0,m.sage);box(g,.17,.04,.76,x,.77,.025,m.linen);}for(const x of [-w/2+.18,w/2-.18])for(const z of [-.25,.25])box(g,.055,.25,.055,x,.125,z,m.walnut);
  const seats=compact?2:3;for(let i=0;i<seats;i++){const x=-w*.39+w*.78*(i+.5)/seats;box(g,w*.76/seats-.018,.1,.55,x,.585,.065,m.linen);}for(const x of [-w*.29,w*.29])ball(g,.18,x,.76,-.125,m.rose,1,.85,.32);action(g,'sit','Sit on the living-room sofa',0,.67,.16);
 }else if(kind==='coffee'){
  const w=compact?.62:1.12;box(g,w,.07,.57,0,.39,0,m.walnut);for(const x of [-w/2+.07,w/2-.07])for(const z of [-.2,.2])box(g,.055,.36,.055,x,.18,z,m.oak);box(g,w-.16,.04,.4,0,.11,0,m.oak);
  const c=cup(g,w*.24,.437,.08);action(c,'tea','Have tea in the living room',w*.24,.52,.08);const b=book(g,-w*.18,.445,-.015,.22,.29,m.blue);action(b,'read','Read beside the sofa',-w*.18,.48,-.015);
 }else if(kind==='fireplace'){
  const w=compact?.76:1.25;box(g,w,1.09,.24,0,.55,0,m.cream);box(g,w*.7,.64,.045,0,.42,.143,m.ink);box(g,w+.09,.07,.36,0,1.12,.03,m.oak);box(g,w+.05,.045,.48,0,.03,.06,m.linen);
  for(let i=0;i<3;i++){const log=cyl(g,.047,w*.4,0,.12+i*.055,.18,m.walnut);log.rotation.z=Math.PI/2;}for(let i=0;i<3;i++)ball(g,.066,-.15+i*.15,.24+(i%2)*.1,.17,new T.MeshStandardMaterial({color:'#c08b53',emissive:'#a85826',emissiveIntensity:.32}),.5,1.6,.4);action(g,'rest','Rest by the living-room fireplace',0,.55,.17);
 }else if(kind==='bookshelf'){
  const w=compact?.68:1.18;box(g,w,1.85,.035,0,.95,-.13,m.walnut);for(const x of [-w/2,w/2])box(g,.047,1.9,.35,x,.97,0,m.oak);const colors=[m.blue,m.rose,m.sage,m.cream,m.oak];let readable;
  for(const y of [.32,.78,1.24,1.7]){box(g,w,.038,.37,0,y,.018,m.oak);for(let i=0;i<Math.floor(w/.115)-1;i++){const x=-w/2+.09+i*.115,h=.24+(i%3)*.035,n=new T.Group();g.add(n);const b=box(n,.077,h,.24,x,y+h/2+.02,.052,colors[i%colors.length]);box(n,.059,.009,.01,x,y+h*.62,.178,m.gold);for(const dy of [.06,h-.035])box(n,.071,.009,.012,x,y+dy,.176,m.walnut);box(n,.008,h-.018,.225,x+.033,y+h/2+.02,.052,m.paper);k.trackBook(g,n,x,y+h/2+.02,.052);if(!readable&&y===.78)readable=n;}}
  action(readable||g,'read','Read a book from the library',0,1.04,.1);
 }else if(kind==='console'){
  const w=compact?.67:1.13;box(g,w,.047,.39,0,.8,0,m.walnut);for(const x of [-w/2+.06,w/2-.06])box(g,.045,.78,.33,x,.39,0,m.oak);box(g,w-.1,.06,.32,0,.19,0,m.oak);
  const j=book(g,-w*.21,.842,.035,.22,.29,m.blue);action(j,'journal','Write in the hall journal',-w*.21,.86,.035);const b=book(g,w*.19,.87,-.02,.18,.25,m.sage);action(b,'read','Read the note by the entrance',w*.19,.9,-.02);cyl(g,.095,.014,w*.32,.84,.04,m.gold);ball(g,.023,w*.32,.863,.04,m.ink);
 }else if(kind==='bench'){
  const w=compact?.63:1.15;box(g,w,.105,.4,0,.47,0,m.oak);box(g,w-.055,.065,.365,0,.55,0,m.linen);for(const x of [-w/2+.05,w/2-.05])for(const z of [-.13,.13])box(g,.045,.43,.045,x,.215,z,m.walnut);
  for(const x of [-w*.18,w*.18])box(g,.17,.085,.27,x,.125,.01,m.ink);action(g,'sit','Sit on the entrance bench',0,.62,.06);
 }else if(kind==='coat'){
  cyl(g,.18,.045,0,.03,0,m.walnut);cyl(g,.035,1.63,0,.86,0,m.oak);for(let i=0;i<3;i++){const a=i*2.1;const arm=cyl(g,.015,.24,Math.cos(a)*.085,1.56,Math.sin(a)*.085,m.oak);arm.rotation.z=Math.sin(a)*.85;box(g,.18,.49,.07,Math.cos(a)*.12,1.25,Math.sin(a)*.12,i?m.sage:m.rose);}
 }else if(kind==='side'){
  cyl(g,.26,.045,0,.57,0,m.oak);cyl(g,.042,.53,0,.285,0,m.walnut);cyl(g,.2,.035,0,.025,0,m.walnut);const c=cup(g,.08,.611,.04);action(c,'tea','Have tea by the reading chair',.08,.7,.04);const b=book(g,-.065,.62,-.025,.17,.23,m.rose);action(b,'journal','Note what your reading changed',-.065,.66,-.025);
 }else if(kind==='globe'){
  cyl(g,.21,.025,0,.035,0,m.walnut);cyl(g,.035,.42,0,.25,0,m.gold);const earth=ball(g,.205,0,.66,0,m.blue);ring(g,.24,.012,0,.66,0,m.gold);for(let i=0;i<4;i++)ball(g,.078,Math.sin(i*1.8)*.15,.69+Math.cos(i*2)*.08,Math.cos(i*1.8)*.13,m.sage,.8,.62,.2);action(earth,'read','Explore the library globe',0,.7,0);
 }else if(kind==='plant')plant(g,0,0,0,compact?.68:1);
 else if(kind==='ledge'){
  box(g,.38,.035,.2,0,.8,0,m.oak);box(g,.025,.18,.14,-.14,.7,0,m.walnut);box(g,.025,.18,.14,.14,.7,0,m.walnut);const b=book(g,-.07,.836,0,.16,.2,m.blue);action(b,'read','Read in this quiet corner',-.07,.86,0);const c=cup(g,.105,.837,.012);action(c,'tea','Pause for tea in this room',.105,.92,.012);
 }
 g.name=`home-${kind}`;return {group:g,actions,kind};
}

function reservedAreas(house,r){
 const out=[],cx=r.w/2,cz=r.h/2,routeHalf=.43;
 const addDoor=(axis,c,fixed)=>{
  if(axis==='x'){out.push({minX:c-.93,maxX:c+.93,minZ:fixed-.57,maxZ:fixed+.57,kind:'door'});out.push({minX:Math.min(c,cx)-routeHalf,maxX:Math.max(c,cx)+routeHalf,minZ:Math.min(fixed,cz)-routeHalf,maxZ:Math.max(fixed,cz)+routeHalf,kind:'route'});}
  else{out.push({minX:fixed-.57,maxX:fixed+.57,minZ:c-.93,maxZ:c+.93,kind:'door'});out.push({minX:Math.min(fixed,cx)-routeHalf,maxX:Math.max(fixed,cx)+routeHalf,minZ:Math.min(c,cz)-routeHalf,maxZ:Math.max(c,cz)+routeHalf,kind:'route'});}
 };
 for(const d of house.doors||[]){if(d.a!==r.id&&d.b!==r.id)continue;const other=house.rooms.find(room=>room.id===(d.a===r.id?d.b:d.a)),edge=other&&sharedEdge(r,other);if(edge)addDoor(edge.axis,(edge.lo+edge.hi)/2-(edge.axis==='x'?r.x:r.y),edge.fixed-(edge.axis==='x'?r.y:r.x));}
 const entry=entranceFor(house);if(entry.roomId===r.id)addDoor('x',entry.x+10-r.x,entry.z+8-r.y);
 out.push({minX:cx-.46,maxX:cx+.46,minZ:cz-.46,maxZ:cz+.46,kind:'center'});
 const display=ideaDisplays(house,r),left=r.x-10,top=r.y-8;
 if(display.dense)for(const b of display.cabinets)out.push({minX:b.minX-left,maxX:b.maxX-left,minZ:b.minZ-top,maxZ:b.maxZ-top,kind:'idea'});
 else for(const slot of display.slots)out.push({minX:slot.x-left-.39,maxX:slot.x-left+.39,minZ:slot.z-top-.39,maxZ:slot.z-top+.39,kind:'idea'});
 return out;
}

function place(T,p,r,reserved,occupied){
 p.group.updateMatrixWorld(true);const box=new T.Box3().setFromObject(p.group),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
 const rotations=[0,Math.PI/2,Math.PI,-Math.PI/2];let best;
 for(const yaw of rotations){const turn=Math.abs(Math.sin(yaw))>.5,w=turn?size.z:size.x,d=turn?size.x:size.z,hw=w/2,hd=d/2;if(w>r.w-.2||d>r.h-.2)continue;
  const xs=[.12+hw,r.w-.12-hw],zs=[.12+hd,r.h-.12-hd];for(let x=.12+hw;x<=r.w-.12-hw+.001;x+=.22)xs.push(x);for(let z=.12+hd;z<=r.h-.12-hd+.001;z+=.22)zs.push(z);
  for(const x of xs)for(const z of zs){const b={minX:x-hw,maxX:x+hw,minZ:z-hd,maxZ:z+hd};if(reserved.some(q=>overlap(b,q))||occupied.some(q=>overlap(b,q,.075)))continue;
   const wallDistance=Math.min(b.minX,r.w-b.maxX,b.minZ,r.h-b.maxZ);if(wallDistance>.55)continue;
   const front={x:Math.sin(yaw),z:Math.cos(yaw)},toward={x:r.w/2-x,z:r.h/2-z},face=front.x*toward.x+front.z*toward.z;
   const score=wallDistance*8+(face<0?8:0)+x*.035+z*.017;if(!best||score<best.score)best={x,z,yaw,b,score};
  }
 }
 if(!best)return null;const rotated=center.clone().applyAxisAngle(new T.Vector3(0,1,0),best.yaw);p.group.rotation.y=best.yaw;p.group.position.set(r.x-10+best.x-rotated.x,0,r.y-8+best.z-rotated.z);p.group.updateMatrixWorld(true);return best;
}

function freeAnchor(r,target,obstacles,preferred){
 const left=r.x-10,top=r.y-8,inside=(x,z)=>x>=left+.2&&x<=left+r.w-.2&&z>=top+.2&&z<=top+r.h-.2;
 const free=(x,z)=>inside(x,z)&&!obstacles.some(b=>x>b.minX-.2&&x<b.maxX+.2&&z>b.minZ-.2&&z<b.maxZ+.2);
 const candidates=[];if(preferred)candidates.push(preferred);for(const radius of [.55,.75,1,1.3])for(let i=0;i<16;i++){const a=i*Math.PI/8;candidates.push({x:target.x+Math.sin(a)*radius,z:target.z+Math.cos(a)*radius});}
 candidates.push({x:left+r.w/2,z:top+r.h/2});for(let x=left+.25;x<left+r.w-.2;x+=.2)for(let z=top+.25;z<top+r.h-.2;z+=.2)candidates.push({x,z});
 const choices=candidates.filter(p=>free(p.x,p.z));choices.sort((a,b)=>Math.hypot(a.x-target.x,a.z-target.z)-Math.hypot(b.x-target.x,b.z-target.z));return choices[0]||null;
}

function buildInterior(house,room,THREE,{walk=true}={}){
 if(!room||![room.x,room.y,room.w,room.h].every(Number.isFinite)||room.w<3||room.h<3)throw Error('A domestic interior needs a room at least 3 × 3 metres.');
 const k=kit(THREE),group=new THREE.Group(),obstacles=[],interactions=[],occupied=[],reserved=reservedAreas(house,room),parts=[],compact=Math.min(room.w,room.h)<4,role=HOME_ROLES[room.id]||'study',primaryNodes=new Map();group.name=`home-interior-${room.id}`;
 const sets={study:['desk','armchair','bookshelf','plant'],bedroom:['bed','wardrobe','nightstand','plant'],kitchen:['counter','dining','fridge','plant'],'living room':['sofa','coffee','fireplace','plant'],'entrance hall':['console','bench','coat','plant'],library:['bookshelf','armchair','side','globe']};
 for(const kind of sets[role]){const p=prototype(k,kind,compact),placement=place(THREE,p,room,reserved,occupied);if(!placement)continue;group.add(p.group);occupied.push(placement.b);parts.push(p);const b=placement.b;obstacles.push({minX:b.minX+room.x-10,maxX:b.maxX+room.x-10,minZ:b.minZ+room.y-8,maxZ:b.maxZ+room.y-8,roomId:room.id,label:kind});}
 // Crowded/minimum rooms use a real narrow wall ledge rather than obstructing
 // their doors or shrinking major furniture to toy scale.
 if(parts.reduce((sum,p)=>sum+p.actions.length,0)<2){for(let attempt=0;attempt<2;attempt++){const p=prototype(k,'ledge',true),placement=place(THREE,p,room,reserved,occupied);if(!placement)break;group.add(p.group);occupied.push(placement.b);parts.push(p);const b=placement.b;obstacles.push({minX:b.minX+room.x-10,maxX:b.maxX+room.x-10,minZ:b.minZ+room.y-8,maxZ:b.maxZ+room.y-8,roomId:room.id,label:'wall ledge'});if(parts.reduce((sum,q)=>sum+q.actions.length,0)>=2)break;}}
 group.updateMatrixWorld(true);
 const anchorObstacles=obstacles.concat(reserved.filter(b=>b.kind==='idea').map(b=>({...b,minX:b.minX+room.x-10,maxX:b.maxX+room.x-10,minZ:b.minZ+room.y-8,maxZ:b.maxZ+room.y-8})));
 for(const part of parts)for(const a of part.actions){if(interactions.length>=4)break;const target=a.target.clone().applyMatrix4(part.group.matrixWorld),front=new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0),part.group.rotation.y),anchor=freeAnchor(room,target,anchorObstacles,{x:target.x+front.x*.7,z:target.z+front.z*.7});if(!anchor)continue;
  const metadata={homeAction:a.type,roomId:room.id,label:a.label,anchor,lookAt:{x:target.x,z:target.z},height:a.type==='sit'?.96:a.type==='rest'?1.05:1.65,homeRole:role,primary:true};a.node.traverse(node=>{if(node.isMesh)node.userData={...node.userData,...metadata};});interactions.push(metadata);primaryNodes.set(a.node,metadata);
 }
 const placed=new Set(parts.map(p=>p.group));
 for(const b of k.books){if(!placed.has(b.root))continue;const existing=primaryNodes.get(b.node);if(existing&&existing.homeAction==='journal')continue;const target=b.target.clone().applyMatrix4(b.root.matrixWorld),anchor=existing?.anchor||freeAnchor(room,target,anchorObstacles);if(!anchor)continue;
  const data=existing||{homeAction:'read',roomId:room.id,anchor,lookAt:{x:target.x,z:target.z},height:1.65,homeRole:role,primary:false};Object.assign(data,{bookId:b.bookId,bookInstanceId:`home-book-${room.id}-${b.instance}`,label:`Read “${HOME_BOOKS[b.bookId]}”`});b.node.traverse(node=>{if(node.isMesh)node.userData={...node.userData,...data};});if(!existing)interactions.push(data);
 }
 let lampIndex=0;
 for(const l of k.lights){if(!placed.has(l.root))continue;const target=l.target.clone().applyMatrix4(l.root.matrixWorld),anchor=freeAnchor(room,target,anchorObstacles);if(!anchor)continue;const homeLightId=`home-light-${room.id}-${lampIndex++}`,data={homeAction:'light',roomId:room.id,label:'Switch the lamp on or off',anchor,lookAt:{x:target.x,z:target.z},height:1.65,homeRole:role,homeLightId,primary:false};l.node.userData.homeLightId=homeLightId;l.node.traverse(node=>{if(node.isMesh)node.userData={...node.userData,...data};});interactions.push(data);}
 group.userData={homeRole:role,roomId:room.id,obstacles,interactions,reserved:reserved.map(b=>({...b,minX:b.minX+room.x-10,maxX:b.maxX+room.x-10,minZ:b.minZ+room.y-8,maxZ:b.maxZ+room.y-8}))};
 return {group,obstacles,interactions};
}

function furnishRoom(THREE,room,house,walk=true){return buildInterior(house,room,THREE,{walk}).group;}

function toggleHomeLight(group,homeLightId){let found=null;group.traverse(node=>{if(node.isGroup&&node.userData.homeLightId===homeLightId)found=node;});if(!found)return null;const on=!found.userData.homeLampOn;found.userData.homeLampOn=on;found.traverse(node=>{if(node.isPointLight)node.intensity=on?1.6:0;if(node.userData.homeBulb&&node.material)node.material.emissiveIntensity=on?.35:0;});return on;}

return {buildInterior,toggleHomeLight};})();
const {buildInterior,toggleHomeLight}=domestic;
const factories={};
factories.legacy=(function(){
const toWorld=(x,y)=>new THREE.Vector3(x-10,0,y-8);
function roomCenter(r){return toWorld(r.x+r.w/2,r.y+r.h/2);}
function canStandAt(house,walls,x,z){const gx=x+10,gz=z+8,inside=house.rooms.some(r=>gx>=r.x&&gx<=r.x+r.w&&gz>=r.y&&gz<=r.y+r.h);if(!inside)return false;return !walls.some(w=>{const dist=w.axis==='x'?Math.abs(gz-w.fixed):Math.abs(gx-w.fixed),along=w.axis==='x'?gx:gz;return dist<.2&&along>w.lo-.2&&along<w.hi+.2;});}
const mat=(color,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
function box(group,w,h,d,x,y,z,material,data){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;if(data)o.userData=data;group.add(o);return o;}
function sphere(group,r,x,y,z,material){const o=new THREE.Mesh(new THREE.SphereGeometry(r,20,12),material);o.position.set(x,y,z);o.castShadow=true;group.add(o);return o;}
function cylinder(group,r,h,x,y,z,material){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;}
function beam(group,a,b,r,material){const delta=b.clone().sub(a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),10),material);o.position.copy(a.clone().add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());o.castShadow=true;group.add(o);return o;}
function label(text,color,scale=3){
 if(typeof document==='undefined')return new THREE.Group();
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;const ctx=canvas.getContext('2d');ctx.font='600 44px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text.length>30?text.slice(0,28)+'…':text,384,64,740);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:true}));sprite.scale.set(scale,scale/6,1);sprite.renderOrder=5;return sprite;
}
const bounds=houseBounds;
const layoutSignature=house=>JSON.stringify({rooms:house.rooms.map(({id,x,y,w,h})=>({id,x,y,w,h})),doors:house.doors});
function outside(house,r,axis,fixed,mid){const epsilon=.02;return !house.rooms.some(other=>other!==r&&(axis==='x'?mid>other.x&&mid<other.x+other.w&&((fixed===r.y&&fixed-epsilon>other.y&&fixed-epsilon<other.y+other.h)||(fixed===r.y+r.h&&fixed+epsilon>other.y&&fixed+epsilon<other.y+other.h)):mid>other.y&&mid<other.y+other.h&&((fixed===r.x&&fixed-epsilon>other.x&&fixed-epsilon<other.x+other.w)||(fixed===r.x+r.w&&fixed+epsilon>other.x&&fixed+epsilon<other.x+other.w))));}
function windowFrame(group,axis,fixed,center,side){
 const frame=mat('#344e48'),glass=new THREE.MeshStandardMaterial({color:'#a4c5c7',roughness:.08,metalness:.08,transparent:true,opacity:.19,depthWrite:false,side:THREE.DoubleSide}),cream=mat('#fff4df'),x=axis==='x'?center-10:fixed-10+side*.025,z=axis==='z'?center-8:fixed-8+side*.025;
 const orient=(w,h,d,y,m,offset=0)=>box(group,axis==='x'?w:d,h,axis==='z'?w:d,x+(axis==='x'?offset:0),y,z+(axis==='z'?offset:0),m);
 for(const offset of [-.77,.77])orient(.09,1.2,.2,1.65,frame,offset);
 for(const y of [1.08,2.22])orient(1.64,.09,.2,y,cream);
 const pane=orient(1.44,1.04,.014,1.65,glass);pane.castShadow=false;pane.receiveShadow=false;
 orient(.055,1.12,.19,1.65,cream);orient(1.52,.055,.19,1.65,cream);orient(1.75,.08,.34,1.02,cream);
 for(const direction of [-1,1]){const sx=x+(axis==='x'?direction*.96:0),sz=z+(axis==='z'?direction*.96:0);box(group,axis==='x'?.28:.13,1.15,axis==='z'?.28:.13,sx,1.65,sz,frame);}
}
function plant(group,x,z,size=.5){const terracotta=mat('#a96548'),leaf=mat('#5e8462');cylinder(group,size*.48,size*.55,x,size*.275,z,terracotta);for(let n=0;n<3;n++){const a=n*2.1;sphere(group,size*.48,x+Math.cos(a)*size*.22,size*.7+Math.abs(Math.sin(a))*size*.25,z+Math.sin(a)*size*.22,leaf);}}
function chair(group,x,z,color){const wood=mat('#99704c'),fabric=mat(color);box(group,.55,.13,.55,x,.48,z,fabric);box(group,.55,.6,.1,x,.81,z+.25,fabric);for(const dx of [-.2,.2])for(const dz of [-.2,.2])box(group,.055,.45,.055,x+dx,.225,z+dz,wood);}
function bookshelf(group,x,z,width,color){const wood=mat('#9a7652');box(group,width,1.8,.3,x,.9,z,wood);for(const y of [.4,.9,1.4]){box(group,width+.04,.055,.4,x,y,z+.05,mat('#eddcc1'));for(let n=0;n<Math.floor(width*7);n++)box(group,.08,.28+(n%3)*.04,.21,x-width/2+.1+n*.14,y+.19,z+.18,mat([color,'#d6ad62','#526e69','#e4d4ac'][n%4]));}}
function furniture(group,r,walk){
 const x=r.x-10,z=r.y-8,c=roomCenter(r),wood=mat('#9a7652'),cream=mat('#eadfca'),accent=mat(r.color);
 const rug=box(group,Math.min(r.w-1,3.7),.018,Math.min(r.h-1,2.6),c.x,.015,c.z,mat(new THREE.Color(r.color).lerp(new THREE.Color('#ede2ca'),.55)));rug.userData={roomId:r.id};
 const deskX=x+.85,deskZ=z+r.h-.8;
 box(group,1.25,.11,.72,deskX,.76,deskZ,wood);for(const dx of [-.45,.45])for(const dz of [-.23,.23])box(group,.07,.72,.07,deskX+dx,.36,deskZ+dz,wood);
 chair(group,deskX,deskZ-.67,r.color);for(let n=0;n<3;n++)box(group,.34,.055,.24,deskX+.25,.84+n*.055,deskZ,mat(n===1?r.color:'#e5dcc8'));
 plant(group,x+r.w-.47,z+.48,.44);
 const theme=(r.id+' '+r.name).toLowerCase();
 if(/math|proof|pattern/.test(theme)){
  box(group,2.3,1.3,.11,c.x,1.5,z+.15,wood);box(group,2.15,1.15,.13,c.x,1.5,z+.17,mat('#304a43'));for(const dx of [-.93,.93])box(group,.075,.86,.075,c.x+dx,.43,z+.15,wood);
  const chalk=mat('#eee8d4');beam(group,new THREE.Vector3(c.x-.65,1.13,z+.25),new THREE.Vector3(c.x+.6,1.15,z+.25),.017,chalk);beam(group,new THREE.Vector3(c.x+.6,1.15,z+.25),new THREE.Vector3(c.x-.1,1.92,z+.25),.017,chalk);beam(group,new THREE.Vector3(c.x-.1,1.92,z+.25),new THREE.Vector3(c.x-.65,1.13,z+.25),.017,chalk);
 }else if(/art|image|design/.test(theme)){
  const ex=x+r.w-.9,ez=z+r.h-.85;beam(group,new THREE.Vector3(ex-.45,.04,ez),new THREE.Vector3(ex,1.95,ez+.05),.035,wood);beam(group,new THREE.Vector3(ex+.45,.04,ez),new THREE.Vector3(ex,1.95,ez+.05),.035,wood);box(group,.95,.95,.09,ex,1.3,ez-.04,cream);box(group,.68,.65,.02,ex,1.3,ez-.095,accent);sphere(group,.19,ex-.12,1.36,ez-.11,mat('#e7c26e'));
 }else if(/learning|read|knowledge/.test(theme)){
  bookshelf(group,x+.9,z+.28,Math.min(r.w*.3,1.5),r.color);chair(group,x+r.w-.9,z+r.h-1.1,'#75968b');cylinder(group,.37,.47,x+r.w-1.75,.235,z+r.h-1.1,wood);
 }else if(/question|philos|reflect/.test(theme)){
  const seatX=x+r.w-1.4;chair(group,seatX-.6,z+1.2,r.color);chair(group,seatX+.55,z+1.2,'#d7bd83');cylinder(group,.45,.6,seatX,.3,z+1.7,wood);cylinder(group,.5,.08,seatX,.64,z+1.7,cream);
 }else if(/connect|together/.test(theme)){
  const lounge=new THREE.Group();lounge.position.set(x+r.w-.5,0,z+r.h/2);lounge.rotation.y=-Math.PI/2;group.add(lounge);box(lounge,2.5,.65,.78,0,.46,0,accent);box(lounge,2.5,.62,.2,0,.85,-.34,accent);for(const dx of [-.7,.7])box(lounge,.48,.15,.48,dx,.84,.01,cream);cylinder(lounge,.6,.42,0,.21,.86,wood);
 }else{
  box(group,1.55,1,.13,c.x,1.55,z+.13,wood);box(group,1.42,.88,.15,c.x,1.55,z+.15,cream);for(const dx of [-.65,.65])box(group,.06,1.05,.06,c.x+dx,.525,z+.13,wood);for(let n=0;n<6;n++)box(group,.27,.23,.02,c.x-.5+(n%3)*.5,1.32+Math.floor(n/3)*.4,z+.24,mat(['#cc9f65',r.color,'#a7baa5'][n%3]));
 }
 if(walk){const plaque=label(r.name,'#253c35',Math.min(r.w*.68,3.2));plaque.position.set(c.x,2.4,z+.32);group.add(plaque);}
}
function architecture(group,house,enclosed){
 const b=bounds(house),wood=mat('#654e3b'),stucco=mat('#f0e4ce'),roof=mat('#a35d48'),roofEdge=mat('#713f34'),stone=mat('#d6d2c2');
 box(group,b.w+.35,.23,b.d+.35,b.cx,-.16,b.cz,stone);
 const entrance=entranceFor(house),doorX=entrance.x,doorZ=entrance.z+.075;
 box(group,2.2,.13,1.7,doorX,-.01,doorZ+.65,stone);box(group,2.5,.1,.45,doorX,-.08,doorZ+1.65,stone);
 for(let n=0;n<6;n++)box(group,1.5,.055,.62,doorX,-.07,doorZ+2.1+n*.7,mat(n%2?'#d8d0bd':'#e5ddca'));
 plant(group,doorX-1.43,doorZ+1,.72);plant(group,doorX+1.43,doorZ+1,.72);
 for(const side of [-1,1]){const px=b.cx+side*(b.w/2+1.3),pz=b.cz+1;box(group,1.4,.23,b.d*.7,px,-.07,pz,mat('#988f72'));for(let n=0;n<6;n++)plant(group,px,pz-b.d*.29+n*b.d*.1,.46);}
 if(!enclosed)return;
 // An actual open leaf sits beside the empty, traversable front doorway.
 const leaf=new THREE.Group();leaf.position.set(doorX-.74,0,doorZ);leaf.rotation.y=-Math.PI*.47;group.add(leaf);box(leaf,1.4,2.16,.1,.7,1.08,0,mat('#375e54'));for(const y of [.58,1.47])box(leaf,1.13,.65,.025,.7,y,.065,mat('#4b7163'));sphere(leaf,.065,1.2,1.13,.1,mat('#d6b56f',.3,.6));
 box(group,2.3,.18,1.55,doorX,2.62,doorZ+.5,roof);for(const dx of [-.98,.98])box(group,.11,2.52,.11,doorX+dx,1.26,doorZ+1.1,wood);
 for(const dx of [-.93,.93]){box(group,.15,.32,.18,doorX+dx,1.92,doorZ+.17,wood);box(group,.11,.22,.2,doorX+dx,1.92,doorZ+.21,mat('#eed89d'));}
 const sign=label('HOUSE OF IDEAS','#faf3de',3.3);sign.position.set(doorX,2.96,doorZ+.3);group.add(sign);
 const half=b.d/2+.55,rise=Math.min(3.2,Math.max(1.8,b.d*.24)),angle=Math.atan2(rise,half),length=Math.hypot(half,rise),roofY=2.98;
 for(const side of [-1,1]){
  const plane=box(group,b.w+1.1,.17,length,b.cx,roofY+rise/2,b.cz+side*half/2,roof);plane.rotation.x=side*angle;
  for(let n=1;n<Math.ceil(b.w*1.4);n++){const x=b.minX-.4+n*.72;beam(group,new THREE.Vector3(x,roofY+rise+.105,b.cz),new THREE.Vector3(x,roofY+.105,b.cz+side*half),.011,roofEdge);}
  for(let n=1;n<Math.ceil(length*2);n++){const t=n/Math.ceil(length*2);beam(group,new THREE.Vector3(b.minX-.54,roofY+rise*(1-t)+.105,b.cz+side*half*t),new THREE.Vector3(b.maxX+.54,roofY+rise*(1-t)+.105,b.cz+side*half*t),.014,roofEdge);}
  box(group,b.w+1.18,.2,.17,b.cx,roofY,b.cz+side*half,wood);
 }
 beam(group,new THREE.Vector3(b.minX-.65,roofY+rise,b.cz),new THREE.Vector3(b.maxX+.65,roofY+rise,b.cz),.14,roofEdge);
 const shape=new THREE.Shape();shape.moveTo(-b.d/2,2.79);shape.lineTo(b.d/2,2.79);shape.lineTo(0,roofY+rise-.1);shape.closePath();
 for(const x of [b.minX-.04,b.maxX+.04]){const gable=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:false}),stucco);gable.rotation.y=Math.PI/2;gable.position.set(x,0,b.cz);gable.castShadow=true;group.add(gable);beam(group,new THREE.Vector3(x,2.84,b.cz-b.d/2),new THREE.Vector3(x,roofY+rise,b.cz),.075,wood);beam(group,new THREE.Vector3(x,2.84,b.cz+b.d/2),new THREE.Vector3(x,roofY+rise,b.cz),.075,wood);}
 const chimneyX=b.minX+Math.min(2,b.w*.25),chimneyZ=b.cz-b.d*.22;box(group,.72,1.8,.85,chimneyX,roofY+rise+.06,chimneyZ,mat('#ac8064'));box(group,.92,.14,1.05,chimneyX,roofY+rise+.96,chimneyZ,stone);box(group,.56,.035,.64,chimneyX,roofY+rise+1.045,chimneyZ,mat('#514d44'));
}
function buildHouse(house,walk=false,exterior=false){
 const group=new THREE.Group(),interior=new THREE.Group(),walls=[],floors=[],objects=[],ceilings=[],entry=entranceFor(house);group.add(interior);interior.visible=!exterior||walk;
 const wallMaterial=mat('#f0e4ce'),trim=mat('#c8af8a'),height=walk||exterior?2.8:.78;
 const edges=house.doors.map(d=>({edge:sharedEdge(house.rooms.find(r=>r.id===d.a),house.rooms.find(r=>r.id===d.b)),...d})),wallKeys=new Set();
 function wall(axis,fixed,lo,hi,room){
  const relevant=edges.filter(d=>(d.a===room.id||d.b===room.id)&&d.edge?.axis===axis&&d.edge.fixed===fixed);
  const holes=relevant.map(d=>{const center=(d.edge.lo+d.edge.hi)/2;return [center-.75,center+.75];});if(axis==='x'&&fixed===entry.z+8&&room.id===entry.roomId)holes.push([entry.x+10-.75,entry.x+10+.75]);holes.sort((a,b)=>a[0]-b[0]);
  const segments=[];let cursor=lo;for(const [a,b] of holes){if(a>cursor)segments.push([cursor,a]);cursor=Math.max(cursor,b);}if(cursor<hi)segments.push([cursor,hi]);
  for(const [a,b] of segments){const key=[axis,fixed,a,b].join(':');if(wallKeys.has(key)||b-a<.02)continue;wallKeys.add(key);const center=(a+b)/2,x=axis==='x'?center-10:fixed-10,z=axis==='z'?center-8:fixed-8;
   const window=(walk||exterior)&&b-a>=2.8&&outside(house,room,axis,fixed,center);
   const wallBox=(from,to,bottom,top)=>{const m=(from+to)/2;return box(group,axis==='x'?to-from:.15,top-bottom,axis==='z'?to-from:.15,axis==='x'?m-10:x,(top+bottom)/2,axis==='z'?m-8:z,wallMaterial);};
   if(window){wallBox(a,center-.76,0,height);wallBox(center+.76,b,0,height);wallBox(center-.76,center+.76,0,1.08);wallBox(center-.76,center+.76,2.22,height);const side=axis==='x'?(fixed===room.y?-1:1):(fixed===room.x?-1:1);windowFrame(group,axis,fixed,center,side);}else wallBox(a,b,0,height);
   box(group,axis==='x'?b-a+.03:.2,.06,axis==='z'?b-a+.03:.2,x,height+.03,z,trim);box(group,axis==='x'?b-a:.17,.15,axis==='z'?b-a:.17,x,.08,z,mat('#cab79a'));walls.push({axis,fixed,lo:a,hi:b});
  }
  for(const [a,b] of holes){const key='door:'+axis+fixed+':'+a;if(wallKeys.has(key))continue;wallKeys.add(key);const c=(a+b)/2,x=axis==='x'?c-10:fixed-10,z=axis==='z'?c-8:fixed-8;
   if(walk||exterior)box(group,axis==='x'?1.5:.18,.65,axis==='z'?1.5:.18,x,2.475,z,wallMaterial);
   box(group,axis==='x'?1.5:.18,.025,axis==='z'?1.5:.18,x,.04,z,mat('#e0b46c'));
   for(const direction of [-1,1])box(group,axis==='x'?.09:.19,Math.min(height,2.15),axis==='z'?.09:.19,x+(axis==='x'?direction*.75:0),Math.min(height,2.15)/2,z+(axis==='z'?direction*.75:0),trim);
  }
 }
 for(const r of house.rooms){
  const c=roomCenter(r),tint=new THREE.Color(r.color).lerp(new THREE.Color('#dcd3c1'),.83),floor=box(group,r.w-.03,.12,r.h-.03,c.x,-.055,c.z,mat(tint),{roomId:r.id});floors.push(floor);
  const board=mat('#b9a17e');for(let n=0;n<r.h*4;n++)box(interior,r.w-.2,.003,.012,c.x,.008,r.y-8+n/4,board);
  wall('x',r.y,r.x,r.x+r.w,r);wall('x',r.y+r.h,r.x,r.x+r.w,r);wall('z',r.x,r.y,r.y+r.h,r);wall('z',r.x+r.w,r.y,r.y+r.h,r);
  if(!walk){const roomLabel=label(r.name.toUpperCase(),'#334d42',Math.min(r.w*.78,4.6));roomLabel.position.set(c.x,.15,r.y-8+.6);roomLabel.userData={roomId:r.id};interior.add(roomLabel);}furniture(interior,r,walk);
  if(walk||exterior){const ceiling=box(group,r.w+.025,.13,r.h+.025,c.x,2.865,c.z,mat('#efe5d2'));ceiling.userData={ceiling:true,roomId:r.id};ceilings.push(ceiling);box(group,.065,.15,.065,c.x,2.68,c.z,mat('#735f47'));const lampMaterial=new THREE.MeshStandardMaterial({color:'#f1d69e',emissive:'#f5c47b',emissiveIntensity:.7,roughness:.6});sphere(group,.19,c.x,2.55,c.z,lampMaterial);const lamp=new THREE.PointLight('#ffdcab',10,8,2);lamp.position.set(c.x,2.5,c.z);group.add(lamp);}
  const ideas=house.ideas.filter(i=>i.roomId===r.id),cols=Math.min(3,Math.max(1,Math.ceil(Math.sqrt(ideas.length*r.w/r.h)))),rows=Math.ceil(ideas.length/cols);
  ideas.forEach((idea,index)=>{
   const col=index%cols,row=Math.floor(index/cols),x=r.x-10+(.5+col)/cols*r.w,z=r.y-8+1.4+(.5+row)/Math.max(1,rows)*(r.h-2.15),data={ideaId:idea.id,roomId:r.id};
   const base=box(interior,.65,.46,.65,x,.23,z,mat('#eceae5'),data);objects.push(base);
   let geometry,rotation=null;if(idea.cue==='crystal')geometry=new THREE.OctahedronGeometry(.43);if(idea.cue==='sphere')geometry=new THREE.SphereGeometry(.34,24,16);if(idea.cue==='ring')geometry=new THREE.TorusGeometry(.32,.095,14,40);if(idea.cue==='book'){geometry=new THREE.BoxGeometry(.54,.13,.4);rotation=[.1,0,.13];}
   const object=new THREE.Mesh(geometry,mat(r.color,.3,.18));object.position.set(x,.93,z);if(rotation)object.rotation.set(...rotation);object.castShadow=true;object.userData=data;interior.add(object);objects.push(object);
   const title=label(idea.title,'#1d3744',Math.min(r.w/cols*.93,3.3));title.position.set(x,1.53,z);title.userData=data;interior.add(title);objects.push(title);
  });
 }
 // Approved additions get separate free floor slots. Existing furnishings are
 // soft obstacles; door openings and previously installed additions stay clear.
 const installedBounds=[],baseBounds=[];interior.updateMatrixWorld(true);interior.traverse(o=>{if(o.isMesh){const b=new THREE.Box3().setFromObject(o);if(b.max.y>.1)baseBounds.push(b);}});
 const overlaps=(a,b,padding=0)=>a.min.x<b.max.x+padding&&a.max.x>b.min.x-padding&&a.min.z<b.max.z+padding&&a.max.z>b.min.z-padding;
 for(const feature of house.resident?.roomFeatures||[]){const r=house.rooms.find(room=>room.id===feature.roomId);if(!r)continue;const x=0,z=0,wood=mat('#93714e'),linen=mat('#e4d7be'),accent=mat(r.color);const installed=new THREE.Group();installed.userData={featureId:feature.id,roomId:r.id};interior.add(installed);
  if(feature.type==='reflection_lamp'){cylinder(installed,.23,.05,x,.03,z,wood);cylinder(installed,.035,1.65,x,.87,z,wood);const shade=new THREE.Mesh(new THREE.CylinderGeometry(.18,.38,.32,20),linen);shade.position.set(x,1.7,z);installed.add(shade);sphere(installed,.1,x,1.6,z,new THREE.MeshStandardMaterial({color:'#f1d69e',emissive:'#eab466',emissiveIntensity:1}));const glow=new THREE.PointLight('#ffd49a',3,3,2);glow.position.set(x,1.45,z);installed.add(glow);}
  if(feature.type==='question_board'){box(installed,1.15,1.03,.11,x,1.38,z,wood);box(installed,1.02,.9,.13,x,1.38,z-.015,linen);for(const dx of [-.44,.44])box(installed,.07,.9,.07,x+dx,.45,z,wood);for(let n=0;n<3;n++)box(installed,.2,.16,.02,x-.3+n*.3,1.36,z-.09,accent);}
  if(feature.type==='experiment_table'){box(installed,1.25,.1,.75,x,.73,z,wood);for(const dx of [-.47,.47])for(const dz of [-.23,.23])box(installed,.06,.68,.06,x+dx,.34,z+dz,wood);sphere(installed,.15,x-.3,.94,z,accent);cylinder(installed,.12,.32,x+.25,.94,z,linen);}
  if(feature.type==='discussion_circle'){chair(installed,x-.4,z, r.color);chair(installed,x+.38,z-.65,'#b69b77');cylinder(installed,.36,.44,x-.25,.22,z-.5,wood);}
  const local=new THREE.Box3().setFromObject(installed),size=local.getSize(new THREE.Vector3()),center=local.getCenter(new THREE.Vector3()),left=r.x-10,top=r.y-8;
  const portals=house.doors.filter(d=>d.a===r.id||d.b===r.id).map(d=>sharedEdge(r,house.rooms.find(room=>room.id===(d.a===r.id?d.b:d.a)))).filter(Boolean);
  if(r.id===entry.roomId)portals.push({axis:'x',fixed:entry.z+8,lo:entry.x+10-.75,hi:entry.x+10+.75,entry:true});
  const doorBounds=portals.map(edge=>{const c=(edge.lo+edge.hi)/2;return edge.axis==='x'?{min:{x:c-10-.8,z:edge.fixed-8-.48},max:{x:c-10+.8,z:edge.fixed-8+.48}}:{min:{x:edge.fixed-10-.48,z:c-8-.8},max:{x:edge.fixed-10+.48,z:c-8+.8}};});
  const base=baseBounds.filter(b=>b.max.x>left&&b.min.x<left+r.w&&b.max.z>top&&b.min.z<top+r.h),preferred={question_board:[.18,.24],reflection_lamp:[.83,.8],experiment_table:[.73,.25],discussion_circle:[.3,.7]}[feature.type]||[.5,.5];
  let placement=null;
  for(let attempt=0;attempt<8&&!placement;attempt++){
   const scale=Math.min(1,Math.min(r.w,r.h)/5)*Math.pow(.87,attempt),hw=size.x*scale/2,hd=size.z*scale/2,minX=left+.16+hw,maxX=left+r.w-.16-hw,minZ=top+.16+hd,maxZ=top+r.h-.16-hd;
   const xs=[minX,maxX,THREE.MathUtils.clamp(left+r.w*preferred[0],minX,maxX)],zs=[minZ,maxZ,THREE.MathUtils.clamp(top+r.h*preferred[1],minZ,maxZ)];for(let px=minX;px<=maxX;px+=.28)xs.push(px);for(let pz=minZ;pz<=maxZ;pz+=.28)zs.push(pz);
   let best=null;for(const px of xs)for(const pz of zs){const b={min:{x:px-hw,z:pz-hd},max:{x:px+hw,z:pz+hd}};if(installedBounds.some(other=>overlaps(b,other,.04))||doorBounds.some(door=>overlaps(b,door)))continue;
    const overlapArea=base.reduce((sum,other)=>sum+(overlaps(b,other)?Math.max(0,Math.min(b.max.x,other.max.x)-Math.max(b.min.x,other.min.x))*Math.max(0,Math.min(b.max.z,other.max.z)-Math.max(b.min.z,other.min.z)):0),0),score=overlapArea*100+Math.hypot(px-(left+r.w*preferred[0]),pz-(top+r.h*preferred[1]));
    if(!best||score<best.score)best={px,pz,scale,score,b};
   }placement=best;
  }
  if(placement){installed.scale.set(placement.scale,Math.max(.8,placement.scale),placement.scale);installed.position.set(placement.px-center.x*placement.scale,0,placement.pz-center.z*placement.scale);installedBounds.push(placement.b);installed.userData.anchor={x:placement.px,z:placement.pz};}
  else{interior.remove(installed);}
 }
 architecture(group,house,exterior||walk);return {group,walls,floors,objects,ceilings,entrance:entry};
}


return {buildHouse};})();
factories.inhabited=(function(){
const toWorld=(x,y)=>new THREE.Vector3(x-10,0,y-8);
function roomCenter(r){return toWorld(r.x+r.w/2,r.y+r.h/2);}
function canStandAt(house,walls,x,z){const gx=x+10,gz=z+8,inside=house.rooms.some(r=>gx>=r.x&&gx<=r.x+r.w&&gz>=r.y&&gz<=r.y+r.h);if(!inside)return false;return !walls.some(w=>{const dist=w.axis==='x'?Math.abs(gz-w.fixed):Math.abs(gx-w.fixed),along=w.axis==='x'?gx:gz;return dist<.2&&along>w.lo-.2&&along<w.hi+.2;});}
const mat=(color,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const surfaceTextures=new Map();
function surface(type,color,repeatX=1,repeatY=1){
 const material=mat(color,type==='wood'?.62:.88);if(typeof document==='undefined')return material;
 const cacheKey=[type,color,repeatX,repeatY].join(':');if(surfaceTextures.has(cacheKey)){material.color.set('#ffffff');material.map=material.bumpMap=surfaceTextures.get(cacheKey);material.bumpScale=type==='clay'?.028:type==='wood'?.008:.007;return material;}
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const ctx=canvas.getContext('2d');let seed=913;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};ctx.fillStyle=color;ctx.fillRect(0,0,512,512);
 if(type==='wood')for(let row=0;row<8;row++){const y=row*64;ctx.fillStyle=`rgba(${120+random()*50},${83+random()*30},${48+random()*25},.24)`;ctx.fillRect(0,y,512,64);for(let n=0;n<28;n++){ctx.beginPath();ctx.strokeStyle=`rgba(73,47,24,${.025+random()*.075})`;ctx.lineWidth=.4+random();let gy=y+random()*62;ctx.moveTo(0,gy);for(let x=0;x<=512;x+=24)ctx.lineTo(x,gy+Math.sin(x*.028+n)*1.7);ctx.stroke();}ctx.strokeStyle='rgba(74,49,29,.38)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();const joint=(row%3)*170+45;ctx.fillStyle='rgba(75,45,22,.35)';ctx.fillRect(joint,y,1,64);}
 else if(type==='clay'||type==='stone'){const rows=type==='clay'?12:4,cols=type==='clay'?10:5,cw=512/cols,ch=512/rows;for(let row=0;row<rows;row++)for(let col=-1;col<=cols;col++){const shade=random()*35,offset=row%2?cw/2:0;ctx.fillStyle=type==='clay'?`rgb(${135+shade},${74+shade*.7},${52+shade*.5})`:`rgb(${156+shade},${151+shade},${139+shade})`;ctx.fillRect(col*cw+offset+1,row*ch+1,cw-2,ch-2);ctx.strokeStyle='rgba(255,243,215,.09)';ctx.strokeRect(col*cw+offset+2,row*ch+2,cw-4,ch-4);}}
 for(let n=0;n<12000;n++){const alpha=type==='plaster'?.025:.05;ctx.fillStyle=random()>.5?`rgba(255,255,255,${alpha})`:`rgba(45,32,21,${alpha})`;ctx.fillRect(random()*512,random()*512,1+random()*2,1+random()*2);}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(repeatX,repeatY);texture.anisotropy=8;texture.userData.retainedSurface=true;surfaceTextures.set(cacheKey,texture);material.color.set('#ffffff');material.map=texture;material.bumpMap=texture;material.bumpScale=type==='clay'?.028:type==='wood'?.008:.007;material.userData.procedural=true;return material;
}
function box(group,w,h,d,x,y,z,material,data){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;if(data)o.userData=data;group.add(o);return o;}
function sphere(group,r,x,y,z,material){const o=new THREE.Mesh(new THREE.SphereGeometry(r,20,12),material);o.position.set(x,y,z);o.castShadow=true;group.add(o);return o;}
function cylinder(group,r,h,x,y,z,material){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;}
function beam(group,a,b,r,material){const delta=b.clone().sub(a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),10),material);o.position.copy(a.clone().add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());o.castShadow=true;group.add(o);return o;}
function label(text,color,scale=3){
 if(typeof document==='undefined')return new THREE.Group();
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;const ctx=canvas.getContext('2d');ctx.font='600 44px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text.length>30?text.slice(0,28)+'…':text,384,64,740);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:true}));sprite.scale.set(scale,scale/6,1);sprite.renderOrder=5;return sprite;
}
const bounds=houseBounds;
const layoutSignature=house=>JSON.stringify({rooms:house.rooms.map(({id,x,y,w,h})=>({id,x,y,w,h})),doors:house.doors});
function outside(house,r,axis,fixed,mid){const epsilon=.02;return !house.rooms.some(other=>other!==r&&(axis==='x'?mid>other.x&&mid<other.x+other.w&&((fixed===r.y&&fixed-epsilon>other.y&&fixed-epsilon<other.y+other.h)||(fixed===r.y+r.h&&fixed+epsilon>other.y&&fixed+epsilon<other.y+other.h)):mid>other.y&&mid<other.y+other.h&&((fixed===r.x&&fixed-epsilon>other.x&&fixed-epsilon<other.x+other.w)||(fixed===r.x+r.w&&fixed+epsilon>other.x&&fixed+epsilon<other.x+other.w))));}
function windowFrame(group,axis,fixed,center,side,width=1.52){
 const frame=surface('wood','#c2ab87'),glass=new THREE.MeshStandardMaterial({color:'#c5d9d9',roughness:.07,metalness:.14,transparent:true,opacity:.1,depthWrite:false,side:THREE.DoubleSide}),cream=mat('#eee6d7'),shutter=surface('wood','#52664e'),x=axis==='x'?center-10:fixed-10+side*.025,z=axis==='z'?center-8:fixed-8+side*.025;
 const orient=(w,h,d,y,m,offset=0)=>box(group,axis==='x'?w:d,h,axis==='z'?w:d,x+(axis==='x'?offset:0),y,z+(axis==='z'?offset:0),m);
 for(const offset of [-width/2,width/2])orient(.075,1.2,.2,1.65,frame,offset);
 for(const y of [1.08,2.22])orient(width+.09,.09,.2,y,cream);
 const pane=orient(width-.07,1.04,.014,1.65,glass);pane.castShadow=false;pane.receiveShadow=false;pane.userData={window:true};
 orient(.045,1.12,.19,1.65,cream);orient(width,.04,.19,1.65,cream);orient(width+.3,.075,.35,1.015,cream);
 for(const direction of [-1,1]){const sx=x+(axis==='x'?direction*(width/2+.23):0),sz=z+(axis==='z'?direction*(width/2+.23):0);box(group,axis==='x'?.31:.11,1.15,axis==='z'?.31:.11,sx,1.65,sz,shutter);for(let n=0;n<7;n++)box(group,axis==='x'?.29:.13,.014,axis==='z'?.29:.13,sx,1.2+n*.14,sz,mat('#687a5d'));}
 const inside=-side*.17,linen=surface('plaster','#f3ebd9');linen.side=THREE.DoubleSide;
 for(const direction of [-1,1]){const cloth=new THREE.PlaneGeometry(.28,1.3,14,4),positions=cloth.attributes.position;for(let n=0;n<positions.count;n++)positions.setZ(n,Math.sin(positions.getX(n)*94)*.035);cloth.computeVertexNormals();const curtain=new THREE.Mesh(cloth,linen);curtain.position.set(x+(axis==='x'?direction*(width/2-.1):inside),1.65,z+(axis==='z'?direction*(width/2-.1):inside));if(axis==='z')curtain.rotation.y=Math.PI/2;curtain.castShadow=true;curtain.userData={curtain:true};group.add(curtain);}
 beam(group,new THREE.Vector3(x+(axis==='x'?-width/2-.18:inside),2.34,z+(axis==='z'?-width/2-.18:inside)),new THREE.Vector3(x+(axis==='x'?width/2+.18:inside),2.34,z+(axis==='z'?width/2+.18:inside)),.021,mat('#76614a'));
}
function plant(group,x,z,size=.5){const terracotta=mat('#a96548'),leaf=mat('#5e8462');cylinder(group,size*.48,size*.55,x,size*.275,z,terracotta);for(let n=0;n<3;n++){const a=n*2.1;sphere(group,size*.48,x+Math.cos(a)*size*.22,size*.7+Math.abs(Math.sin(a))*size*.25,z+Math.sin(a)*size*.22,leaf);}}
function physicalPlaque(group,text,w,x,y,z){
 box(group,w,.18,.045,x,y,z,mat('#81694e'));if(typeof document==='undefined')return;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#e8dfcb';ctx.fillRect(0,0,512,96);ctx.fillStyle='#554832';ctx.font='500 34px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,49,480);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.045,.145),new THREE.MeshBasicMaterial({map:texture}));face.position.set(x,y,z+.025);group.add(face);
}
function flowerBed(group,x,z,w,d){const soil=mat('#77654e'),leaf=mat('#617451');box(group,w,.08,d,x,-.09,z,soil);for(let n=0;n<Math.max(4,Math.floor(w*d*5));n++){const fx=x-w/2+.16+(n*.47)%(w-.24),fz=z-d/2+.12+(n*.31)%(d-.18);cylinder(group,.024,.24,fx,.12,fz,leaf);const petals=mat(['#e2cd8d','#d39981','#c0c5ad'][n%3]);for(let p=0;p<4;p++){const a=p*Math.PI/2;sphere(group,.06,fx+Math.cos(a)*.05,.26,fz+Math.sin(a)*.05,petals);}}}
function chair(group,x,z,color){const wood=mat('#99704c'),fabric=mat(color);box(group,.55,.13,.55,x,.48,z,fabric);box(group,.55,.6,.1,x,.81,z+.25,fabric);for(const dx of [-.2,.2])for(const dz of [-.2,.2])box(group,.055,.45,.055,x+dx,.225,z+dz,wood);}
function bookshelf(group,x,z,width,color){const wood=mat('#9a7652');box(group,width,1.8,.3,x,.9,z,wood);for(const y of [.4,.9,1.4]){box(group,width+.04,.055,.4,x,y,z+.05,mat('#eddcc1'));for(let n=0;n<Math.floor(width*7);n++)box(group,.08,.28+(n%3)*.04,.21,x-width/2+.1+n*.14,y+.19,z+.18,mat([color,'#d6ad62','#526e69','#e4d4ac'][n%4]));}}
function furniture(group,r,walk){
 const x=r.x-10,z=r.y-8,c=roomCenter(r),wood=mat('#9a7652'),cream=mat('#eadfca'),accent=mat(r.color);
 const rug=box(group,Math.min(r.w-1,3.7),.018,Math.min(r.h-1,2.6),c.x,.015,c.z,mat(new THREE.Color(r.color).lerp(new THREE.Color('#ede2ca'),.55)));rug.userData={roomId:r.id};
 const deskX=x+.85,deskZ=z+r.h-.8;
 box(group,1.25,.11,.72,deskX,.76,deskZ,wood);for(const dx of [-.45,.45])for(const dz of [-.23,.23])box(group,.07,.72,.07,deskX+dx,.36,deskZ+dz,wood);
 chair(group,deskX,deskZ-.67,r.color);for(let n=0;n<3;n++)box(group,.34,.055,.24,deskX+.25,.84+n*.055,deskZ,mat(n===1?r.color:'#e5dcc8'));
 plant(group,x+r.w-.47,z+.48,.44);
 const theme=(r.id+' '+r.name).toLowerCase();
 if(/math|proof|pattern/.test(theme)){
  box(group,2.3,1.3,.11,c.x,1.5,z+.15,wood);box(group,2.15,1.15,.13,c.x,1.5,z+.17,mat('#304a43'));for(const dx of [-.93,.93])box(group,.075,.86,.075,c.x+dx,.43,z+.15,wood);
  const chalk=mat('#eee8d4');beam(group,new THREE.Vector3(c.x-.65,1.13,z+.25),new THREE.Vector3(c.x+.6,1.15,z+.25),.017,chalk);beam(group,new THREE.Vector3(c.x+.6,1.15,z+.25),new THREE.Vector3(c.x-.1,1.92,z+.25),.017,chalk);beam(group,new THREE.Vector3(c.x-.1,1.92,z+.25),new THREE.Vector3(c.x-.65,1.13,z+.25),.017,chalk);
 }else if(/art|image|design/.test(theme)){
  const ex=x+r.w-.9,ez=z+r.h-.85;beam(group,new THREE.Vector3(ex-.45,.04,ez),new THREE.Vector3(ex,1.95,ez+.05),.035,wood);beam(group,new THREE.Vector3(ex+.45,.04,ez),new THREE.Vector3(ex,1.95,ez+.05),.035,wood);box(group,.95,.95,.09,ex,1.3,ez-.04,cream);box(group,.68,.65,.02,ex,1.3,ez-.095,accent);sphere(group,.19,ex-.12,1.36,ez-.11,mat('#e7c26e'));
 }else if(/learning|read|knowledge/.test(theme)){
  bookshelf(group,x+.9,z+.28,Math.min(r.w*.3,1.5),r.color);chair(group,x+r.w-.9,z+r.h-1.1,'#75968b');cylinder(group,.37,.47,x+r.w-1.75,.235,z+r.h-1.1,wood);
 }else if(/question|philos|reflect/.test(theme)){
  const seatX=x+r.w-1.4;chair(group,seatX-.6,z+1.2,r.color);chair(group,seatX+.55,z+1.2,'#d7bd83');cylinder(group,.45,.6,seatX,.3,z+1.7,wood);cylinder(group,.5,.08,seatX,.64,z+1.7,cream);
 }else if(/connect|together/.test(theme)){
  const lounge=new THREE.Group();lounge.position.set(x+r.w-.5,0,z+r.h/2);lounge.rotation.y=-Math.PI/2;group.add(lounge);box(lounge,2.5,.65,.78,0,.46,0,accent);box(lounge,2.5,.62,.2,0,.85,-.34,accent);for(const dx of [-.7,.7])box(lounge,.48,.15,.48,dx,.84,.01,cream);cylinder(lounge,.6,.42,0,.21,.86,wood);
 }else{
  box(group,1.55,1,.13,c.x,1.55,z+.13,wood);box(group,1.42,.88,.15,c.x,1.55,z+.15,cream);for(const dx of [-.65,.65])box(group,.06,1.05,.06,c.x+dx,.525,z+.13,wood);for(let n=0;n<6;n++)box(group,.27,.23,.02,c.x-.5+(n%3)*.5,1.32+Math.floor(n/3)*.4,z+.24,mat(['#cc9f65',r.color,'#a7baa5'][n%3]));
 }
 if(walk){const plaque=label(r.name,'#253c35',Math.min(r.w*.68,3.2));plaque.position.set(c.x,2.4,z+.32);group.add(plaque);}
}
function architecture(group,house,enclosed,obstacles=[]){
 const b=bounds(house),wood=surface('wood','#8a6e4e'),stucco=surface('plaster','#eee4d0'),roofEdge=mat('#795140'),stone=surface('stone','#b8af9a',2,2),entrance=entranceFor(house),doorX=entrance.x,doorZ=entrance.z+.075;
 box(group,b.w+.32,.23,b.d+.32,b.cx,-.16,b.cz,stone);
 box(group,3.6,.1,2.1,doorX,-.012,doorZ+.8,stone);box(group,3.8,.07,.48,doorX,-.07,doorZ+2.05,stone);
 for(let n=0;n<17;n++)box(group,1.64,.045,.58,doorX,-.06,doorZ+2.45+n*.58,stone);
 box(group,Math.min(12,b.w*.65),.035,1.64,doorX+Math.min(6,b.w*.33),-.07,doorZ+6.8,stone);
 plant(group,doorX-1.62,doorZ+1.32,.65);plant(group,doorX+1.62,doorZ+1.32,.65);
 flowerBed(group,b.minX+Math.min(2,b.w*.22),b.maxZ+1.15,Math.min(3.4,b.w*.32),.95);flowerBed(group,b.maxX-Math.min(2,b.w*.22),b.maxZ+1.15,Math.min(3.4,b.w*.32),.95);
 // A usable garden terrace with a bench, a table, and a planted boundary.
 const terraceX=b.minX+1.7,terraceZ=b.maxZ+4;box(group,3.5,.065,2.4,terraceX,-.08,terraceZ,stone);
 const gardenBench=new THREE.Group();group.add(gardenBench);for(const dz of [-.23,.23])box(gardenBench,2.05,.085,.16,terraceX,.48,terraceZ+dz,wood);for(const dx of [-.84,.84])box(gardenBench,.09,.48,.48,terraceX+dx,.24,terraceZ,wood);box(gardenBench,2.05,.55,.08,terraceX,.79,terraceZ-.28,wood);gardenBench.traverse(o=>{o.userData={homeAction:'sit',label:'Sit on the garden bench',anchor:{x:terraceX,z:terraceZ+.95},lookAt:{x:terraceX,z:terraceZ},height:1.13};});cylinder(group,.3,.055,terraceX+1.28,.56,terraceZ,wood);cylinder(group,.06,.54,terraceX+1.28,.27,terraceZ,wood);
 obstacles.push({minX:terraceX-1.05,maxX:terraceX+1.05,minZ:terraceZ-.35,maxZ:terraceZ+.35,label:'Garden bench'},{minX:terraceX+.97,maxX:terraceX+1.59,minZ:terraceZ-.31,maxZ:terraceZ+.31,label:'Garden table'});for(const direction of [-1,1])obstacles.push({minX:doorX+direction*1.62-.32,maxX:doorX+direction*1.62+.32,minZ:doorZ+1,maxZ:doorZ+1.64,label:'Porch planter'});
 const fence=mat('#a8a58c');for(const side of [-1,1]){const fx=side<0?b.minX-3.8:b.maxX+3.8;for(let n=0;n<Math.ceil((b.d+10)/.66);n++)box(group,.095,.87,.15,fx,.26,b.minZ-1.2+n*.66,fence);for(const y of [.14,.47])box(group,.1,.08,b.d+10,fx,y,b.cz+3.5,fence);}for(let n=0;n<Math.ceil((b.w+7)/.66);n++){const fx=b.minX-3.4+n*.66;if(Math.abs(fx-doorX)<1.12)continue;box(group,.14,.85,.09,fx,.26,b.maxZ+7.6,fence);}for(const y of [.14,.47]){box(group,Math.max(.1,doorX-b.minX+2.28),.08,.08,(b.minX-3.4+doorX-1.12)/2,y,b.maxZ+7.6,fence);box(group,Math.max(.1,b.maxX-doorX+2.28),.08,.08,(b.maxX+3.4+doorX+1.12)/2,y,b.maxZ+7.6,fence);}
 for(const fx of [b.minX-3.8,b.maxX+3.8])obstacles.push({minX:fx-.07,maxX:fx+.07,minZ:b.minZ-1.25,maxZ:b.maxZ+8.5,label:'Garden fence'});obstacles.push({minX:b.minX-3.5,maxX:doorX-1.12,minZ:b.maxZ+7.54,maxZ:b.maxZ+7.66,label:'Garden fence'},{minX:doorX+1.12,maxX:b.maxX+3.5,minZ:b.maxZ+7.54,maxZ:b.maxZ+7.66,label:'Garden fence'});
 if(!enclosed)return null;
 const leaf=new THREE.Group();leaf.position.set(doorX-.74,0,doorZ);leaf.rotation.y=0;group.add(leaf);const doorWood=surface('wood','#58614c');box(leaf,1.43,2.13,.095,.715,1.065,0,doorWood);for(const y of [.48,1.14])box(leaf,1.14,.47,.028,.715,y,.063,mat('#67715b'));box(leaf,1.03,.31,.035,.715,1.83,.062,mat('#29382f'));for(const direction of [-1,1])box(leaf,.035,.31,.042,.715+direction*.27,1.83,.085,mat('#d9d3b9'));sphere(leaf,.048,1.2,1.08,.11,mat('#bcaa76',.28,.65));leaf.traverse(o=>{o.userData={door:true,label:'Front door'};});
 for(const dx of [-1.02,1.02]){box(group,.13,.28,.17,doorX+dx,1.86,doorZ+.16,mat('#4a4437'));box(group,.085,.2,.18,doorX+dx,1.86,doorZ+.24,new THREE.MeshStandardMaterial({color:'#dcc191',emissive:'#e6b578',emissiveIntensity:.24}));}
 physicalPlaque(group,'House of Ideas',1.25,doorX-1.37,1.47,doorZ+.105);
 // The entrance has a true gabled porch instead of a flat canopy.
 const porchW=Math.min(3.7,b.w*.7),porchRise=1.02,porchHalf=porchW/2+.18,porchAngle=Math.atan2(porchRise,porchHalf),porchSlope=Math.hypot(porchHalf,porchRise),porchZ=doorZ+.8;
 for(const side of [-1,1]){const slab=box(group,porchSlope,.13,2.35,doorX+side*porchHalf/2,2.57+porchRise/2,porchZ,surface('clay','#a26a50',porchSlope,2));slab.rotation.z=-side*porchAngle;}
 const porchShape=new THREE.Shape();porchShape.moveTo(-porchHalf,2.52);porchShape.lineTo(porchHalf,2.52);porchShape.lineTo(0,2.57+porchRise);porchShape.closePath();const porchFront=new THREE.Mesh(new THREE.ExtrudeGeometry(porchShape,{depth:.08,bevelEnabled:false}),stucco);porchFront.position.set(doorX,0,doorZ+1.92);group.add(porchFront);for(const dx of [-porchW/2+.12,porchW/2-.12])box(group,.13,2.48,.13,doorX+dx,1.24,doorZ+1.68,wood);beam(group,new THREE.Vector3(doorX-porchHalf,2.57,doorZ+2),new THREE.Vector3(doorX,3.59,doorZ+2),.06,wood);beam(group,new THREE.Vector3(doorX+porchHalf,2.57,doorZ+2),new THREE.Vector3(doorX,3.59,doorZ+2),.06,wood);
 const half=b.d/2+.56,rise=Math.min(4,Math.max(2.1,b.d*.32)),angle=Math.atan2(rise,half),length=Math.hypot(half,rise),roofY=2.96;
 for(const side of [-1,1]){const plane=box(group,b.w+1.14,.17,length,b.cx,roofY+rise/2,b.cz+side*half/2,surface('clay','#a36b50',(b.w+1.14)/2,length/2));plane.rotation.x=side*angle;plane.userData={roof:true};box(group,b.w+1.18,.15,.16,b.cx,roofY,b.cz+side*half,wood);cylinder(group,.04,b.w+1.2,b.cx,2.84,b.cz+side*half,mat('#847662')).rotation.z=Math.PI/2;}
 beam(group,new THREE.Vector3(b.minX-.65,roofY+rise,b.cz),new THREE.Vector3(b.maxX+.65,roofY+rise,b.cz),.12,roofEdge);
 const shape=new THREE.Shape();shape.moveTo(-b.d/2,2.79);shape.lineTo(b.d/2,2.79);shape.lineTo(0,roofY+rise-.13);shape.closePath();
 for(const x of [b.minX-.04,b.maxX+.04]){const gable=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:false}),stucco);gable.rotation.y=Math.PI/2;gable.position.set(x,0,b.cz);gable.castShadow=true;group.add(gable);beam(group,new THREE.Vector3(x,2.87,b.cz-b.d/2),new THREE.Vector3(x,roofY+rise,b.cz),.075,wood);beam(group,new THREE.Vector3(x,2.87,b.cz+b.d/2),new THREE.Vector3(x,roofY+rise,b.cz),.075,wood);const vent=box(group,.13,.72,.8,x,4.05,b.cz,mat('#cbbda0'));for(let n=0;n<5;n++)box(group,.15,.035,.71,x,3.77+n*.13,b.cz,mat('#766b57'));}
 const chimneyX=b.minX+Math.min(2,b.w*.25),chimneyZ=b.cz-b.d*.22,chimneyBase=roofY+rise*(1-Math.abs(chimneyZ-b.cz)/half)-.07;box(group,.63,1.6,.77,chimneyX,chimneyBase+.8,chimneyZ,surface('stone','#a48469',1,2));box(group,.84,.13,.98,chimneyX,chimneyBase+1.64,chimneyZ,stone);box(group,.49,.035,.6,chimneyX,chimneyBase+1.725,chimneyZ,mat('#45443c'));
 return {leaf,x:doorX,z:doorZ,open:false};
}
function buildHouse(house,walk=false,exterior=false){
 const group=new THREE.Group(),interior=new THREE.Group(),walls=[],floors=[],objects=[],ceilings=[],obstacles=[],interactions=[],entry=entranceFor(house);group.add(interior);interior.visible=!exterior||walk;
 const wallMaterial=surface('plaster','#e9e0cf',3,2),trim=mat('#eee7d9'),skirting=surface('wood','#a8916e'),height=walk||exterior?2.8:.78;
 const edges=house.doors.map(d=>({edge:sharedEdge(house.rooms.find(r=>r.id===d.a),house.rooms.find(r=>r.id===d.b)),...d})),wallKeys=new Set();
 function wall(axis,fixed,lo,hi,room){
  const relevant=edges.filter(d=>(d.a===room.id||d.b===room.id)&&d.edge?.axis===axis&&d.edge.fixed===fixed);
  const holes=relevant.map(d=>{const center=(d.edge.lo+d.edge.hi)/2;return [center-.75,center+.75];});if(axis==='x'&&fixed===entry.z+8&&room.id===entry.roomId)holes.push([entry.x+10-.75,entry.x+10+.75]);holes.sort((a,b)=>a[0]-b[0]);
  const segments=[];let cursor=lo;for(const [a,b] of holes){if(a>cursor)segments.push([cursor,a]);cursor=Math.max(cursor,b);}if(cursor<hi)segments.push([cursor,hi]);
  for(const [a,b] of segments){const key=[axis,fixed,a,b].join(':');if(wallKeys.has(key)||b-a<.02)continue;wallKeys.add(key);const center=(a+b)/2,x=axis==='x'?center-10:fixed-10,z=axis==='z'?center-8:fixed-8;
   const window=(walk||exterior)&&b-a>=2.2&&outside(house,room,axis,fixed,center),windowWidth=Math.min(1.6,b-a-1.1);
   const wallBox=(from,to,bottom,top)=>{const m=(from+to)/2;return box(group,axis==='x'?to-from:.15,top-bottom,axis==='z'?to-from:.15,axis==='x'?m-10:x,(top+bottom)/2,axis==='z'?m-8:z,wallMaterial);};
   if(window){const half=windowWidth/2;wallBox(a,center-half,0,height);wallBox(center+half,b,0,height);wallBox(center-half,center+half,0,1.08);wallBox(center-half,center+half,2.22,height);const side=axis==='x'?(fixed===room.y?-1:1):(fixed===room.x?-1:1);windowFrame(group,axis,fixed,center,side,windowWidth);}else wallBox(a,b,0,height);
   box(group,axis==='x'?b-a+.03:.2,.06,axis==='z'?b-a+.03:.2,x,height+.03,z,trim);box(group,axis==='x'?b-a:.17,.11,axis==='z'?b-a:.17,x,.055,z,skirting);walls.push({axis,fixed,lo:a,hi:b});
  }
  for(const [a,b] of holes){const key='door:'+axis+fixed+':'+a;if(wallKeys.has(key))continue;wallKeys.add(key);const c=(a+b)/2,x=axis==='x'?c-10:fixed-10,z=axis==='z'?c-8:fixed-8;
   if(walk||exterior)box(group,axis==='x'?1.5:.18,.65,axis==='z'?1.5:.18,x,2.475,z,wallMaterial);
   box(group,axis==='x'?1.5:.18,.025,axis==='z'?1.5:.18,x,.04,z,mat('#e0b46c'));
   for(const direction of [-1,1])box(group,axis==='x'?.09:.19,Math.min(height,2.15),axis==='z'?.09:.19,x+(axis==='x'?direction*.75:0),Math.min(height,2.15)/2,z+(axis==='z'?direction*.75:0),trim);
  }
 }
 for(const r of house.rooms){
  const c=roomCenter(r),tile=r.id==='work'||r.id==='learning',floor=box(group,r.w-.03,.12,r.h-.03,c.x,-.055,c.z,surface(tile?'stone':'wood',tile?'#c4bcaa':'#b19a73',r.w/(tile?2.2:3),r.h/(tile?2.2:2)),{roomId:r.id});floors.push(floor);
  wall('x',r.y,r.x,r.x+r.w,r);wall('x',r.y+r.h,r.x,r.x+r.w,r);wall('z',r.x,r.y,r.y+r.h,r);wall('z',r.x+r.w,r.y,r.y+r.h,r);
  if(!walk){const roomLabel=label(r.name.toUpperCase(),'#334d42',Math.min(r.w*.78,4.6));roomLabel.position.set(c.x,.15,r.y-8+.6);roomLabel.userData={roomId:r.id};interior.add(roomLabel);}const domestic=buildInterior(house,r,THREE,{walk});interior.add(domestic.group);obstacles.push(...domestic.obstacles);interactions.push(...domestic.interactions);
  if(walk||exterior){const ceiling=box(group,r.w+.025,.13,r.h+.025,c.x,2.865,c.z,surface('plaster','#f2eadc',2,2));ceiling.userData={ceiling:true,roomId:r.id};ceilings.push(ceiling);cylinder(group,.22,.065,c.x,2.73,c.z,mat('#766a55'));cylinder(group,.17,.045,c.x,2.69,c.z,new THREE.MeshStandardMaterial({color:'#f3e6c5',emissive:'#ffdfac',emissiveIntensity:.8,roughness:.5}));const lamp=new THREE.PointLight('#ffe1b5',5.5,8,2);lamp.position.set(c.x,2.58,c.z);group.add(lamp);}
  const display=ideaDisplays(house,r);for(const cabinet of display.cabinets){const rack=new THREE.Group();rack.position.set(cabinet.x,0,cabinet.z);rack.rotation.y=cabinet.yaw;interior.add(rack);const wood=surface('wood','#9c7d57');box(rack,cabinet.width,2.2,.035,0,1.15,-cabinet.depth/2,wood);for(const dx of [-cabinet.width/2,cabinet.width/2])box(rack,.025,2.24,cabinet.depth,dx,1.14,0,wood);for(const y of [.1,.55,1.17,1.79,2.24])box(rack,cabinet.width,.035,cabinet.depth,0,y,0,wood);obstacles.push({...cabinet,roomId:r.id,label:'Idea display cabinet'});}
  display.slots.forEach(slot=>{
   const {idea,x,z,y,scale}=slot,data={ideaId:idea.id,roomId:r.id};
   const base=slot.pedestal?box(interior,.65,.46,.65,x,.23,z,surface('wood','#b1a080'),data):box(interior,.4,.025,.32,x,slot.shelf+.027,z,mat('#bda785'),data);objects.push(base);if(slot.pedestal)obstacles.push({minX:x-.33,maxX:x+.33,minZ:z-.33,maxZ:z+.33,roomId:r.id,label:idea.title});
   let geometry,rotation=null;if(idea.cue==='crystal')geometry=new THREE.OctahedronGeometry(.43);if(idea.cue==='sphere')geometry=new THREE.SphereGeometry(.34,24,16);if(idea.cue==='ring')geometry=new THREE.TorusGeometry(.32,.095,14,40);if(idea.cue==='book'){geometry=new THREE.BoxGeometry(.54,.13,.4);rotation=[.1,0,.13];}
   const object=new THREE.Mesh(geometry,idea.cue==='book'?mat('#e4dbc5'):mat(r.color,.28,.2));object.position.set(x,y,z);object.scale.setScalar(scale);if(rotation)object.rotation.set(...rotation);object.castShadow=true;object.userData=data;interior.add(object);objects.push(object);
   if(idea.cue==='book'){for(const direction of [-1,1])box(object,.575,.017,.43,0,direction*.078,0,mat(r.color));box(object,.028,.17,.43,-.276,0,0,mat(r.color));for(let n=0;n<4;n++)box(object,.49,.003,.007,.015,-.035+n*.023,.203,mat('#bdb397'));for(let n=0;n<3;n++)box(object,.27-n*.03,.003,.012,.04,.09,-.075+n*.055,mat('#cab886'));}
   if(idea.cue==='sphere'){for(const tilt of [0,Math.PI/2]){const band=new THREE.Mesh(new THREE.TorusGeometry(.343,.01,6,36),mat('#b6a47c',.35,.5));band.rotation.x=tilt;object.add(band);}}
   object.traverse(part=>{part.userData=data;});const title=label(idea.title,'#1d3744',display.dense?.85:Math.min(r.w/3*.93,3.3));title.position.set(x,y+.6*scale,z);title.userData=data;title.visible=!walk;interior.add(title);objects.push(title);
  });
 }
 // Approved additions get separate free floor slots. Existing furnishings are
 // soft obstacles; door openings and previously installed additions stay clear.
 const installedBounds=[],baseBounds=[];interior.updateMatrixWorld(true);interior.traverse(o=>{if(o.isMesh){const b=new THREE.Box3().setFromObject(o);if(b.max.y>.1)baseBounds.push(b);}});
 const overlaps=(a,b,padding=0)=>a.min.x<b.max.x+padding&&a.max.x>b.min.x-padding&&a.min.z<b.max.z+padding&&a.max.z>b.min.z-padding;
 for(const feature of house.resident?.roomFeatures||[]){const r=house.rooms.find(room=>room.id===feature.roomId);if(!r)continue;const x=0,z=0,wood=mat('#93714e'),linen=mat('#e4d7be'),accent=mat(r.color);const installed=new THREE.Group();installed.userData={featureId:feature.id,roomId:r.id};interior.add(installed);
  if(feature.type==='reflection_lamp'){cylinder(installed,.23,.05,x,.03,z,wood);cylinder(installed,.035,1.65,x,.87,z,wood);const shade=new THREE.Mesh(new THREE.CylinderGeometry(.18,.38,.32,20),linen);shade.position.set(x,1.7,z);installed.add(shade);sphere(installed,.1,x,1.6,z,new THREE.MeshStandardMaterial({color:'#f1d69e',emissive:'#eab466',emissiveIntensity:1}));const glow=new THREE.PointLight('#ffd49a',3,3,2);glow.position.set(x,1.45,z);installed.add(glow);}
  if(feature.type==='question_board'){box(installed,1.15,1.03,.11,x,1.38,z,wood);box(installed,1.02,.9,.13,x,1.38,z-.015,linen);for(const dx of [-.44,.44])box(installed,.07,.9,.07,x+dx,.45,z,wood);for(let n=0;n<3;n++)box(installed,.2,.16,.02,x-.3+n*.3,1.36,z-.09,accent);}
  if(feature.type==='experiment_table'){box(installed,1.25,.1,.75,x,.73,z,wood);for(const dx of [-.47,.47])for(const dz of [-.23,.23])box(installed,.06,.68,.06,x+dx,.34,z+dz,wood);sphere(installed,.15,x-.3,.94,z,accent);cylinder(installed,.12,.32,x+.25,.94,z,linen);}
  if(feature.type==='discussion_circle'){chair(installed,x-.4,z, r.color);chair(installed,x+.38,z-.65,'#b69b77');cylinder(installed,.36,.44,x-.25,.22,z-.5,wood);}
  const local=new THREE.Box3().setFromObject(installed),size=local.getSize(new THREE.Vector3()),center=local.getCenter(new THREE.Vector3()),left=r.x-10,top=r.y-8;
  const portals=house.doors.filter(d=>d.a===r.id||d.b===r.id).map(d=>sharedEdge(r,house.rooms.find(room=>room.id===(d.a===r.id?d.b:d.a)))).filter(Boolean);
  if(r.id===entry.roomId)portals.push({axis:'x',fixed:entry.z+8,lo:entry.x+10-.75,hi:entry.x+10+.75,entry:true});
  const doorBounds=portals.map(edge=>{const c=(edge.lo+edge.hi)/2;return edge.axis==='x'?{min:{x:c-10-.8,z:edge.fixed-8-.48},max:{x:c-10+.8,z:edge.fixed-8+.48}}:{min:{x:edge.fixed-10-.48,z:c-8-.8},max:{x:edge.fixed-10+.48,z:c-8+.8}};});
  for(const action of interactions){const data=action.userData||action;if(data.roomId===r.id&&data.anchor)doorBounds.push({min:{x:data.anchor.x-.34,z:data.anchor.z-.34},max:{x:data.anchor.x+.34,z:data.anchor.z+.34}});}
  const base=baseBounds.filter(b=>b.max.x>left&&b.min.x<left+r.w&&b.max.z>top&&b.min.z<top+r.h),preferred={question_board:[.18,.24],reflection_lamp:[.83,.8],experiment_table:[.73,.25],discussion_circle:[.3,.7]}[feature.type]||[.5,.5];
  let placement=null;
  for(let attempt=0;attempt<8&&!placement;attempt++){
   const scale=Math.min(1,Math.min(r.w,r.h)/5)*Math.pow(.87,attempt),hw=size.x*scale/2,hd=size.z*scale/2,minX=left+.16+hw,maxX=left+r.w-.16-hw,minZ=top+.16+hd,maxZ=top+r.h-.16-hd;
   const xs=[minX,maxX,THREE.MathUtils.clamp(left+r.w*preferred[0],minX,maxX)],zs=[minZ,maxZ,THREE.MathUtils.clamp(top+r.h*preferred[1],minZ,maxZ)];for(let px=minX;px<=maxX;px+=.28)xs.push(px);for(let pz=minZ;pz<=maxZ;pz+=.28)zs.push(pz);
   let best=null;for(const px of xs)for(const pz of zs){const b={min:{x:px-hw,z:pz-hd},max:{x:px+hw,z:pz+hd}};if(installedBounds.some(other=>overlaps(b,other,.04))||doorBounds.some(door=>overlaps(b,door)))continue;
    const overlapArea=base.reduce((sum,other)=>sum+(overlaps(b,other)?Math.max(0,Math.min(b.max.x,other.max.x)-Math.max(b.min.x,other.min.x))*Math.max(0,Math.min(b.max.z,other.max.z)-Math.max(b.min.z,other.min.z)):0),0),score=overlapArea*100+Math.hypot(px-(left+r.w*preferred[0]),pz-(top+r.h*preferred[1]));
    if(!best||score<best.score)best={px,pz,scale,score,b};
   }placement=best;
  }
  if(placement){installed.scale.set(placement.scale,Math.max(.8,placement.scale),placement.scale);installed.position.set(placement.px-center.x*placement.scale,0,placement.pz-center.z*placement.scale);installedBounds.push(placement.b);installed.userData.anchor={x:placement.px,z:placement.pz};obstacles.push({minX:placement.b.min.x,maxX:placement.b.max.x,minZ:placement.b.min.z,maxZ:placement.b.max.z,roomId:r.id,label:feature.type});}
  else{interior.remove(installed);}
 }
 const frontDoor=architecture(group,house,exterior||walk,obstacles);return {group,walls,floors,objects,ceilings,obstacles,interactions,frontDoor,entrance:entry};
}


return {buildHouse,disposeSurfaceCache(){for(const t of surfaceTextures.values())t.dispose();surfaceTextures.clear();}};})();
factories.atelier=(function(){
const toWorld=(x,y)=>new THREE.Vector3(x-10,0,y-8);
function roomCenter(r){return toWorld(r.x+r.w/2,r.y+r.h/2);}
function canStandAt(house,walls,x,z){const gx=x+10,gz=z+8,inside=house.rooms.some(r=>gx>=r.x&&gx<=r.x+r.w&&gz>=r.y&&gz<=r.y+r.h);if(!inside)return false;return !walls.some(w=>{const dist=w.axis==='x'?Math.abs(gz-w.fixed):Math.abs(gx-w.fixed),along=w.axis==='x'?gx:gz;return dist<.2&&along>w.lo-.2&&along<w.hi+.2;});}
const mat=(color,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const surfaceTextures=new Map();
function surface(type,color,repeatX=1,repeatY=1){
 const material=mat(color,type==='wood'?.62:.88);if(typeof document==='undefined')return material;
 const cacheKey=[type,color,repeatX,repeatY].join(':');if(surfaceTextures.has(cacheKey)){material.color.set('#ffffff');material.map=material.bumpMap=surfaceTextures.get(cacheKey);material.bumpScale=type==='clay'?.028:type==='wood'?.008:.007;return material;}
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const ctx=canvas.getContext('2d');let seed=913;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};ctx.fillStyle=color;ctx.fillRect(0,0,512,512);
 if(type==='wood')for(let row=0;row<8;row++){const y=row*64;ctx.fillStyle=`rgba(${120+random()*50},${83+random()*30},${48+random()*25},.24)`;ctx.fillRect(0,y,512,64);for(let n=0;n<28;n++){ctx.beginPath();ctx.strokeStyle=`rgba(73,47,24,${.025+random()*.075})`;ctx.lineWidth=.4+random();let gy=y+random()*62;ctx.moveTo(0,gy);for(let x=0;x<=512;x+=24)ctx.lineTo(x,gy+Math.sin(x*.028+n)*1.7);ctx.stroke();}ctx.strokeStyle='rgba(74,49,29,.38)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();const joint=(row%3)*170+45;ctx.fillStyle='rgba(75,45,22,.35)';ctx.fillRect(joint,y,1,64);}
 else if(type==='clay'||type==='stone'){const rows=type==='clay'?12:4,cols=type==='clay'?10:5,cw=512/cols,ch=512/rows;for(let row=0;row<rows;row++)for(let col=-1;col<=cols;col++){const shade=random()*35,offset=row%2?cw/2:0;ctx.fillStyle=type==='clay'?`rgb(${135+shade},${74+shade*.7},${52+shade*.5})`:`rgb(${156+shade},${151+shade},${139+shade})`;ctx.fillRect(col*cw+offset+1,row*ch+1,cw-2,ch-2);ctx.strokeStyle='rgba(255,243,215,.09)';ctx.strokeRect(col*cw+offset+2,row*ch+2,cw-4,ch-4);}}
 for(let n=0;n<12000;n++){const alpha=type==='plaster'?.025:.05;ctx.fillStyle=random()>.5?`rgba(255,255,255,${alpha})`:`rgba(45,32,21,${alpha})`;ctx.fillRect(random()*512,random()*512,1+random()*2,1+random()*2);}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(repeatX,repeatY);texture.anisotropy=8;texture.userData.retainedSurface=true;surfaceTextures.set(cacheKey,texture);material.color.set('#ffffff');material.map=texture;material.bumpMap=texture;material.bumpScale=type==='clay'?.028:type==='wood'?.008:.007;material.userData.procedural=true;return material;
}
function box(group,w,h,d,x,y,z,material,data){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;if(data)o.userData=data;group.add(o);return o;}
function sphere(group,r,x,y,z,material){const o=new THREE.Mesh(new THREE.SphereGeometry(r,20,12),material);o.position.set(x,y,z);o.castShadow=true;group.add(o);return o;}
function cylinder(group,r,h,x,y,z,material){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;}
function beam(group,a,b,r,material){const delta=b.clone().sub(a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),10),material);o.position.copy(a.clone().add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());o.castShadow=true;group.add(o);return o;}
function label(text,color,scale=3){
 if(typeof document==='undefined')return new THREE.Group();
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;const ctx=canvas.getContext('2d');ctx.font='600 44px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text.length>30?text.slice(0,28)+'…':text,384,64,740);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:true}));sprite.scale.set(scale,scale/6,1);sprite.renderOrder=5;return sprite;
}
const bounds=houseBounds;
const layoutSignature=house=>JSON.stringify({rooms:house.rooms.map(({id,x,y,w,h,floor,brightness,paintings})=>({id,x,y,w,h,floor,brightness,paintings})),doors:house.doors,residence:house.residence,stairs:house.stairs});
function outside(house,r,axis,fixed,mid){const epsilon=.02;return !house.rooms.some(other=>other!==r&&(axis==='x'?mid>other.x&&mid<other.x+other.w&&((fixed===r.y&&fixed-epsilon>other.y&&fixed-epsilon<other.y+other.h)||(fixed===r.y+r.h&&fixed+epsilon>other.y&&fixed+epsilon<other.y+other.h)):mid>other.y&&mid<other.y+other.h&&((fixed===r.x&&fixed-epsilon>other.x&&fixed-epsilon<other.x+other.w)||(fixed===r.x+r.w&&fixed+epsilon>other.x&&fixed+epsilon<other.x+other.w))));}
function windowFrame(group,axis,fixed,center,side,width=1.52){
 const frame=surface('wood','#c2ab87'),glass=new THREE.MeshStandardMaterial({color:'#c5d9d9',roughness:.07,metalness:.14,transparent:true,opacity:.1,depthWrite:false,side:THREE.DoubleSide}),cream=mat('#eee6d7'),shutter=surface('wood','#52664e'),x=axis==='x'?center-10:fixed-10+side*.025,z=axis==='z'?center-8:fixed-8+side*.025;
 const orient=(w,h,d,y,m,offset=0)=>box(group,axis==='x'?w:d,h,axis==='z'?w:d,x+(axis==='x'?offset:0),y,z+(axis==='z'?offset:0),m);
 for(const offset of [-width/2,width/2])orient(.075,1.2,.2,1.65,frame,offset);
 for(const y of [1.08,2.22])orient(width+.09,.09,.2,y,cream);
 const pane=orient(width-.07,1.04,.014,1.65,glass);pane.castShadow=false;pane.receiveShadow=false;pane.userData={window:true};
 orient(.045,1.12,.19,1.65,cream);orient(width,.04,.19,1.65,cream);orient(width+.3,.075,.35,1.015,cream);
 for(const direction of [-1,1]){const sx=x+(axis==='x'?direction*(width/2+.23):0),sz=z+(axis==='z'?direction*(width/2+.23):0);box(group,axis==='x'?.31:.11,1.15,axis==='z'?.31:.11,sx,1.65,sz,shutter);for(let n=0;n<7;n++)box(group,axis==='x'?.29:.13,.014,axis==='z'?.29:.13,sx,1.2+n*.14,sz,mat('#687a5d'));}
 const inside=-side*.17,linen=surface('plaster','#f3ebd9');linen.side=THREE.DoubleSide;
 for(const direction of [-1,1]){const cloth=new THREE.PlaneGeometry(.28,1.3,14,4),positions=cloth.attributes.position;for(let n=0;n<positions.count;n++)positions.setZ(n,Math.sin(positions.getX(n)*94)*.035);cloth.computeVertexNormals();const curtain=new THREE.Mesh(cloth,linen);curtain.position.set(x+(axis==='x'?direction*(width/2-.1):inside),1.65,z+(axis==='z'?direction*(width/2-.1):inside));if(axis==='z')curtain.rotation.y=Math.PI/2;curtain.castShadow=true;curtain.userData={curtain:true};group.add(curtain);}
 beam(group,new THREE.Vector3(x+(axis==='x'?-width/2-.18:inside),2.34,z+(axis==='z'?-width/2-.18:inside)),new THREE.Vector3(x+(axis==='x'?width/2+.18:inside),2.34,z+(axis==='z'?width/2+.18:inside)),.021,mat('#76614a'));
}
function plant(group,x,z,size=.5){const terracotta=mat('#a96548'),leaf=mat('#5e8462');cylinder(group,size*.48,size*.55,x,size*.275,z,terracotta);for(let n=0;n<3;n++){const a=n*2.1;sphere(group,size*.48,x+Math.cos(a)*size*.22,size*.7+Math.abs(Math.sin(a))*size*.25,z+Math.sin(a)*size*.22,leaf);}}
function physicalPlaque(group,text,w,x,y,z){
 box(group,w,.18,.045,x,y,z,mat('#81694e'));if(typeof document==='undefined')return;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#e8dfcb';ctx.fillRect(0,0,512,96);ctx.fillStyle='#554832';ctx.font='500 34px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,49,480);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.045,.145),new THREE.MeshBasicMaterial({map:texture}));face.position.set(x,y,z+.025);group.add(face);
}
function flowerBed(group,x,z,w,d){const soil=mat('#77654e'),leaf=mat('#617451');box(group,w,.08,d,x,-.09,z,soil);for(let n=0;n<Math.max(4,Math.floor(w*d*5));n++){const fx=x-w/2+.16+(n*.47)%(w-.24),fz=z-d/2+.12+(n*.31)%(d-.18);cylinder(group,.024,.24,fx,.12,fz,leaf);const petals=mat(['#e2cd8d','#d39981','#c0c5ad'][n%3]);for(let p=0;p<4;p++){const a=p*Math.PI/2;sphere(group,.06,fx+Math.cos(a)*.05,.26,fz+Math.sin(a)*.05,petals);}}}
function chair(group,x,z,color){const wood=mat('#99704c'),fabric=mat(color);box(group,.55,.13,.55,x,.48,z,fabric);box(group,.55,.6,.1,x,.81,z+.25,fabric);for(const dx of [-.2,.2])for(const dz of [-.2,.2])box(group,.055,.45,.055,x+dx,.225,z+dz,wood);}
function bookshelf(group,x,z,width,color){const wood=mat('#9a7652');box(group,width,1.8,.3,x,.9,z,wood);for(const y of [.4,.9,1.4]){box(group,width+.04,.055,.4,x,y,z+.05,mat('#eddcc1'));for(let n=0;n<Math.floor(width*7);n++)box(group,.08,.28+(n%3)*.04,.21,x-width/2+.1+n*.14,y+.19,z+.18,mat([color,'#d6ad62','#526e69','#e4d4ac'][n%4]));}}
function furniture(group,r,walk){
 const x=r.x-10,z=r.y-8,c=roomCenter(r),wood=mat('#9a7652'),cream=mat('#eadfca'),accent=mat(r.color);
 const rug=box(group,Math.min(r.w-1,3.7),.018,Math.min(r.h-1,2.6),c.x,.015,c.z,mat(new THREE.Color(r.color).lerp(new THREE.Color('#ede2ca'),.55)));rug.userData={roomId:r.id};
 const deskX=x+.85,deskZ=z+r.h-.8;
 box(group,1.25,.11,.72,deskX,.76,deskZ,wood);for(const dx of [-.45,.45])for(const dz of [-.23,.23])box(group,.07,.72,.07,deskX+dx,.36,deskZ+dz,wood);
 chair(group,deskX,deskZ-.67,r.color);for(let n=0;n<3;n++)box(group,.34,.055,.24,deskX+.25,.84+n*.055,deskZ,mat(n===1?r.color:'#e5dcc8'));
 plant(group,x+r.w-.47,z+.48,.44);
 const theme=(r.id+' '+r.name).toLowerCase();
 if(/math|proof|pattern/.test(theme)){
  box(group,2.3,1.3,.11,c.x,1.5,z+.15,wood);box(group,2.15,1.15,.13,c.x,1.5,z+.17,mat('#304a43'));for(const dx of [-.93,.93])box(group,.075,.86,.075,c.x+dx,.43,z+.15,wood);
  const chalk=mat('#eee8d4');beam(group,new THREE.Vector3(c.x-.65,1.13,z+.25),new THREE.Vector3(c.x+.6,1.15,z+.25),.017,chalk);beam(group,new THREE.Vector3(c.x+.6,1.15,z+.25),new THREE.Vector3(c.x-.1,1.92,z+.25),.017,chalk);beam(group,new THREE.Vector3(c.x-.1,1.92,z+.25),new THREE.Vector3(c.x-.65,1.13,z+.25),.017,chalk);
 }else if(/art|image|design/.test(theme)){
  const ex=x+r.w-.9,ez=z+r.h-.85;beam(group,new THREE.Vector3(ex-.45,.04,ez),new THREE.Vector3(ex,1.95,ez+.05),.035,wood);beam(group,new THREE.Vector3(ex+.45,.04,ez),new THREE.Vector3(ex,1.95,ez+.05),.035,wood);box(group,.95,.95,.09,ex,1.3,ez-.04,cream);box(group,.68,.65,.02,ex,1.3,ez-.095,accent);sphere(group,.19,ex-.12,1.36,ez-.11,mat('#e7c26e'));
 }else if(/learning|read|knowledge/.test(theme)){
  bookshelf(group,x+.9,z+.28,Math.min(r.w*.3,1.5),r.color);chair(group,x+r.w-.9,z+r.h-1.1,'#75968b');cylinder(group,.37,.47,x+r.w-1.75,.235,z+r.h-1.1,wood);
 }else if(/question|philos|reflect/.test(theme)){
  const seatX=x+r.w-1.4;chair(group,seatX-.6,z+1.2,r.color);chair(group,seatX+.55,z+1.2,'#d7bd83');cylinder(group,.45,.6,seatX,.3,z+1.7,wood);cylinder(group,.5,.08,seatX,.64,z+1.7,cream);
 }else if(/connect|together/.test(theme)){
  const lounge=new THREE.Group();lounge.position.set(x+r.w-.5,0,z+r.h/2);lounge.rotation.y=-Math.PI/2;group.add(lounge);box(lounge,2.5,.65,.78,0,.46,0,accent);box(lounge,2.5,.62,.2,0,.85,-.34,accent);for(const dx of [-.7,.7])box(lounge,.48,.15,.48,dx,.84,.01,cream);cylinder(lounge,.6,.42,0,.21,.86,wood);
 }else{
  box(group,1.55,1,.13,c.x,1.55,z+.13,wood);box(group,1.42,.88,.15,c.x,1.55,z+.15,cream);for(const dx of [-.65,.65])box(group,.06,1.05,.06,c.x+dx,.525,z+.13,wood);for(let n=0;n<6;n++)box(group,.27,.23,.02,c.x-.5+(n%3)*.5,1.32+Math.floor(n/3)*.4,z+.24,mat(['#cc9f65',r.color,'#a7baa5'][n%3]));
 }
 if(walk){const plaque=label(r.name,'#253c35',Math.min(r.w*.68,3.2));plaque.position.set(c.x,2.4,z+.32);group.add(plaque);}
}
function architecture(group,house,enclosed,obstacles=[]){
 const b=bounds(house),wood=surface('wood','#8a6e4e'),stucco=surface('plaster','#eee4d0'),roofEdge=mat('#795140'),stone=surface('stone','#b8af9a',2,2),entrance=entranceFor(house),doorX=entrance.x,doorZ=entrance.z+.075;
 box(group,b.w+.32,.23,b.d+.32,b.cx,-.16,b.cz,stone);
 box(group,3.6,.1,2.1,doorX,-.012,doorZ+.8,stone);box(group,3.8,.07,.48,doorX,-.07,doorZ+2.05,stone);
 for(let n=0;n<17;n++)box(group,1.64,.045,.58,doorX,-.06,doorZ+2.45+n*.58,stone);
 box(group,Math.min(12,b.w*.65),.035,1.64,doorX+Math.min(6,b.w*.33),-.07,doorZ+6.8,stone);
 plant(group,doorX-1.62,doorZ+1.32,.65);plant(group,doorX+1.62,doorZ+1.32,.65);
 flowerBed(group,b.minX+Math.min(2,b.w*.22),b.maxZ+1.15,Math.min(3.4,b.w*.32),.95);flowerBed(group,b.maxX-Math.min(2,b.w*.22),b.maxZ+1.15,Math.min(3.4,b.w*.32),.95);
 // A usable garden terrace with a bench, a table, and a planted boundary.
 const terraceX=b.minX+1.7,terraceZ=b.maxZ+4;box(group,3.5,.065,2.4,terraceX,-.08,terraceZ,stone);
 const gardenBench=new THREE.Group();group.add(gardenBench);for(const dz of [-.23,.23])box(gardenBench,2.05,.085,.16,terraceX,.48,terraceZ+dz,wood);for(const dx of [-.84,.84])box(gardenBench,.09,.48,.48,terraceX+dx,.24,terraceZ,wood);box(gardenBench,2.05,.55,.08,terraceX,.79,terraceZ-.28,wood);gardenBench.traverse(o=>{o.userData={homeAction:'sit',label:'Sit on the garden bench',anchor:{x:terraceX,z:terraceZ+.95},lookAt:{x:terraceX,z:terraceZ},height:1.13};});cylinder(group,.3,.055,terraceX+1.28,.56,terraceZ,wood);cylinder(group,.06,.54,terraceX+1.28,.27,terraceZ,wood);
 obstacles.push({minX:terraceX-1.05,maxX:terraceX+1.05,minZ:terraceZ-.35,maxZ:terraceZ+.35,label:'Garden bench'},{minX:terraceX+.97,maxX:terraceX+1.59,minZ:terraceZ-.31,maxZ:terraceZ+.31,label:'Garden table'});for(const direction of [-1,1])obstacles.push({minX:doorX+direction*1.62-.32,maxX:doorX+direction*1.62+.32,minZ:doorZ+1,maxZ:doorZ+1.64,label:'Porch planter'});
 const fence=mat('#a8a58c');for(const side of [-1,1]){const fx=side<0?b.minX-3.8:b.maxX+3.8;for(let n=0;n<Math.ceil((b.d+10)/.66);n++)box(group,.095,.87,.15,fx,.26,b.minZ-1.2+n*.66,fence);for(const y of [.14,.47])box(group,.1,.08,b.d+10,fx,y,b.cz+3.5,fence);}for(let n=0;n<Math.ceil((b.w+7)/.66);n++){const fx=b.minX-3.4+n*.66;if(Math.abs(fx-doorX)<1.12)continue;box(group,.14,.85,.09,fx,.26,b.maxZ+7.6,fence);}for(const y of [.14,.47]){box(group,Math.max(.1,doorX-b.minX+2.28),.08,.08,(b.minX-3.4+doorX-1.12)/2,y,b.maxZ+7.6,fence);box(group,Math.max(.1,b.maxX-doorX+2.28),.08,.08,(b.maxX+3.4+doorX+1.12)/2,y,b.maxZ+7.6,fence);}
 for(const fx of [b.minX-3.8,b.maxX+3.8])obstacles.push({minX:fx-.07,maxX:fx+.07,minZ:b.minZ-1.25,maxZ:b.maxZ+8.5,label:'Garden fence'});obstacles.push({minX:b.minX-3.5,maxX:doorX-1.12,minZ:b.maxZ+7.54,maxZ:b.maxZ+7.66,label:'Garden fence'},{minX:doorX+1.12,maxX:b.maxX+3.5,minZ:b.maxZ+7.54,maxZ:b.maxZ+7.66,label:'Garden fence'});
 if(!enclosed)return null;
 const leaf=new THREE.Group();leaf.position.set(doorX-.74,0,doorZ);leaf.rotation.y=0;group.add(leaf);const doorWood=surface('wood','#58614c');box(leaf,1.43,2.13,.095,.715,1.065,0,doorWood);for(const y of [.48,1.14])box(leaf,1.14,.47,.028,.715,y,.063,mat('#67715b'));box(leaf,1.03,.31,.035,.715,1.83,.062,mat('#29382f'));for(const direction of [-1,1])box(leaf,.035,.31,.042,.715+direction*.27,1.83,.085,mat('#d9d3b9'));sphere(leaf,.048,1.2,1.08,.11,mat('#bcaa76',.28,.65));leaf.traverse(o=>{o.userData={door:true,label:'Front door'};});
 for(const dx of [-1.02,1.02]){box(group,.13,.28,.17,doorX+dx,1.86,doorZ+.16,mat('#4a4437'));box(group,.085,.2,.18,doorX+dx,1.86,doorZ+.24,new THREE.MeshStandardMaterial({color:'#dcc191',emissive:'#e6b578',emissiveIntensity:.24}));}
 physicalPlaque(group,'House of Ideas',1.25,doorX-1.37,1.47,doorZ+.105);
 // The entrance has a true gabled porch instead of a flat canopy.
 const porchW=Math.min(3.7,b.w*.7),porchRise=1.02,porchHalf=porchW/2+.18,porchAngle=Math.atan2(porchRise,porchHalf),porchSlope=Math.hypot(porchHalf,porchRise),porchZ=doorZ+.8;
 for(const side of [-1,1]){const slab=box(group,porchSlope,.13,2.35,doorX+side*porchHalf/2,2.57+porchRise/2,porchZ,surface('clay','#a26a50',porchSlope,2));slab.rotation.z=-side*porchAngle;}
 const porchShape=new THREE.Shape();porchShape.moveTo(-porchHalf,2.52);porchShape.lineTo(porchHalf,2.52);porchShape.lineTo(0,2.57+porchRise);porchShape.closePath();const porchFront=new THREE.Mesh(new THREE.ExtrudeGeometry(porchShape,{depth:.08,bevelEnabled:false}),stucco);porchFront.position.set(doorX,0,doorZ+1.92);group.add(porchFront);for(const dx of [-porchW/2+.12,porchW/2-.12])box(group,.13,2.48,.13,doorX+dx,1.24,doorZ+1.68,wood);beam(group,new THREE.Vector3(doorX-porchHalf,2.57,doorZ+2),new THREE.Vector3(doorX,3.59,doorZ+2),.06,wood);beam(group,new THREE.Vector3(doorX+porchHalf,2.57,doorZ+2),new THREE.Vector3(doorX,3.59,doorZ+2),.06,wood);
 const half=b.d/2+.56,rise=Math.min(4,Math.max(2.1,b.d*.32)),angle=Math.atan2(rise,half),length=Math.hypot(half,rise),roofY=2.96;
 for(const side of [-1,1]){const plane=box(group,b.w+1.14,.17,length,b.cx,roofY+rise/2,b.cz+side*half/2,surface('clay','#a36b50',(b.w+1.14)/2,length/2));plane.rotation.x=side*angle;plane.userData={roof:true};box(group,b.w+1.18,.15,.16,b.cx,roofY,b.cz+side*half,wood);cylinder(group,.04,b.w+1.2,b.cx,2.84,b.cz+side*half,mat('#847662')).rotation.z=Math.PI/2;}
 beam(group,new THREE.Vector3(b.minX-.65,roofY+rise,b.cz),new THREE.Vector3(b.maxX+.65,roofY+rise,b.cz),.12,roofEdge);
 const shape=new THREE.Shape();shape.moveTo(-b.d/2,2.79);shape.lineTo(b.d/2,2.79);shape.lineTo(0,roofY+rise-.13);shape.closePath();
 for(const x of [b.minX-.04,b.maxX+.04]){const gable=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:false}),stucco);gable.rotation.y=Math.PI/2;gable.position.set(x,0,b.cz);gable.castShadow=true;group.add(gable);beam(group,new THREE.Vector3(x,2.87,b.cz-b.d/2),new THREE.Vector3(x,roofY+rise,b.cz),.075,wood);beam(group,new THREE.Vector3(x,2.87,b.cz+b.d/2),new THREE.Vector3(x,roofY+rise,b.cz),.075,wood);const vent=box(group,.13,.72,.8,x,4.05,b.cz,mat('#cbbda0'));for(let n=0;n<5;n++)box(group,.15,.035,.71,x,3.77+n*.13,b.cz,mat('#766b57'));}
 const chimneyX=b.minX+Math.min(2,b.w*.25),chimneyZ=b.cz-b.d*.22,chimneyBase=roofY+rise*(1-Math.abs(chimneyZ-b.cz)/half)-.07;box(group,.63,1.6,.77,chimneyX,chimneyBase+.8,chimneyZ,surface('stone','#a48469',1,2));box(group,.84,.13,.98,chimneyX,chimneyBase+1.64,chimneyZ,stone);box(group,.49,.035,.6,chimneyX,chimneyBase+1.725,chimneyZ,mat('#45443c'));
 return {leaf,x:doorX,z:doorZ,open:false};
}
function buildHouse(house,walk=false,exterior=false){
 const group=new THREE.Group(),interior=new THREE.Group(),walls=[],floors=[],objects=[],ceilings=[],obstacles=[],interactions=[],entry=entranceFor(house);group.add(interior);interior.visible=!exterior||walk;
 const wallMaterial=surface('plaster','#e9e0cf',3,2),trim=mat('#eee7d9'),skirting=surface('wood','#a8916e'),height=walk||exterior?2.8:.78;
 const edges=house.doors.map(d=>({edge:sharedEdge(house.rooms.find(r=>r.id===d.a),house.rooms.find(r=>r.id===d.b)),...d})),wallKeys=new Set();
 function wall(axis,fixed,lo,hi,room){
  const relevant=edges.filter(d=>(d.a===room.id||d.b===room.id)&&d.edge?.axis===axis&&d.edge.fixed===fixed);
  const holes=relevant.map(d=>{const center=(d.edge.lo+d.edge.hi)/2;return [center-.75,center+.75];});if(axis==='x'&&fixed===entry.z+8&&room.id===entry.roomId)holes.push([entry.x+10-.75,entry.x+10+.75]);holes.sort((a,b)=>a[0]-b[0]);
  const segments=[];let cursor=lo;for(const [a,b] of holes){if(a>cursor)segments.push([cursor,a]);cursor=Math.max(cursor,b);}if(cursor<hi)segments.push([cursor,hi]);
  for(const [a,b] of segments){const key=[axis,fixed,a,b].join(':');if(wallKeys.has(key)||b-a<.02)continue;wallKeys.add(key);const center=(a+b)/2,x=axis==='x'?center-10:fixed-10,z=axis==='z'?center-8:fixed-8;
   const window=(walk||exterior)&&b-a>=2.2&&outside(house,room,axis,fixed,center),windowWidth=Math.min(1.6,b-a-1.1);
   const wallBox=(from,to,bottom,top)=>{const m=(from+to)/2;return box(group,axis==='x'?to-from:.15,top-bottom,axis==='z'?to-from:.15,axis==='x'?m-10:x,(top+bottom)/2,axis==='z'?m-8:z,wallMaterial);};
   if(window){const half=windowWidth/2;wallBox(a,center-half,0,height);wallBox(center+half,b,0,height);wallBox(center-half,center+half,0,1.08);wallBox(center-half,center+half,2.22,height);const side=axis==='x'?(fixed===room.y?-1:1):(fixed===room.x?-1:1);windowFrame(group,axis,fixed,center,side,windowWidth);}else wallBox(a,b,0,height);
   box(group,axis==='x'?b-a+.03:.2,.06,axis==='z'?b-a+.03:.2,x,height+.03,z,trim);box(group,axis==='x'?b-a:.17,.11,axis==='z'?b-a:.17,x,.055,z,skirting);walls.push({axis,fixed,lo:a,hi:b});
  }
  for(const [a,b] of holes){const key='door:'+axis+fixed+':'+a;if(wallKeys.has(key))continue;wallKeys.add(key);const c=(a+b)/2,x=axis==='x'?c-10:fixed-10,z=axis==='z'?c-8:fixed-8;
   if(walk||exterior)box(group,axis==='x'?1.5:.18,.65,axis==='z'?1.5:.18,x,2.475,z,wallMaterial);
   box(group,axis==='x'?1.5:.18,.025,axis==='z'?1.5:.18,x,.04,z,mat('#e0b46c'));
   for(const direction of [-1,1])box(group,axis==='x'?.09:.19,Math.min(height,2.15),axis==='z'?.09:.19,x+(axis==='x'?direction*.75:0),Math.min(height,2.15)/2,z+(axis==='z'?direction*.75:0),trim);
  }
 }
 for(const r of house.rooms){
  const c=roomCenter(r),tile=r.id==='work'||r.id==='learning',floor=box(group,r.w-.03,.12,r.h-.03,c.x,-.055,c.z,surface(tile?'stone':'wood',tile?'#c4bcaa':'#b19a73',r.w/(tile?2.2:3),r.h/(tile?2.2:2)),{roomId:r.id});floors.push(floor);
  wall('x',r.y,r.x,r.x+r.w,r);wall('x',r.y+r.h,r.x,r.x+r.w,r);wall('z',r.x,r.y,r.y+r.h,r);wall('z',r.x+r.w,r.y,r.y+r.h,r);
  if(!walk){const roomLabel=label(r.name.toUpperCase(),'#334d42',Math.min(r.w*.78,4.6));roomLabel.position.set(c.x,.15,r.y-8+.6);roomLabel.userData={roomId:r.id};interior.add(roomLabel);}const domestic=buildInterior(house,r,THREE,{walk});interior.add(domestic.group);obstacles.push(...domestic.obstacles);interactions.push(...domestic.interactions);
  if(walk||exterior){const ceiling=box(group,r.w+.025,.13,r.h+.025,c.x,2.865,c.z,surface('plaster','#f2eadc',2,2));ceiling.userData={ceiling:true,roomId:r.id};ceilings.push(ceiling);cylinder(group,.22,.065,c.x,2.73,c.z,mat('#766a55'));cylinder(group,.17,.045,c.x,2.69,c.z,new THREE.MeshStandardMaterial({color:'#f3e6c5',emissive:'#ffdfac',emissiveIntensity:.8,roughness:.5}));const lamp=new THREE.PointLight('#ffe1b5',5.5,8,2);lamp.position.set(c.x,2.58,c.z);group.add(lamp);}
  const display=ideaDisplays(house,r);for(const cabinet of display.cabinets){const rack=new THREE.Group();rack.position.set(cabinet.x,0,cabinet.z);rack.rotation.y=cabinet.yaw;interior.add(rack);const wood=surface('wood','#9c7d57');box(rack,cabinet.width,2.2,.035,0,1.15,-cabinet.depth/2,wood);for(const dx of [-cabinet.width/2,cabinet.width/2])box(rack,.025,2.24,cabinet.depth,dx,1.14,0,wood);for(const y of [.1,.55,1.17,1.79,2.24])box(rack,cabinet.width,.035,cabinet.depth,0,y,0,wood);obstacles.push({...cabinet,roomId:r.id,label:'Idea display cabinet'});}
  display.slots.forEach(slot=>{
   const {idea,x,z,y,scale}=slot,data={ideaId:idea.id,roomId:r.id};
   const base=slot.pedestal?box(interior,.65,.46,.65,x,.23,z,surface('wood','#b1a080'),data):box(interior,.4,.025,.32,x,slot.shelf+.027,z,mat('#bda785'),data);objects.push(base);if(slot.pedestal)obstacles.push({minX:x-.33,maxX:x+.33,minZ:z-.33,maxZ:z+.33,roomId:r.id,label:idea.title});
   let geometry,rotation=null;if(idea.cue==='crystal')geometry=new THREE.OctahedronGeometry(.43);if(idea.cue==='sphere')geometry=new THREE.SphereGeometry(.34,24,16);if(idea.cue==='ring')geometry=new THREE.TorusGeometry(.32,.095,14,40);if(idea.cue==='book'){geometry=new THREE.BoxGeometry(.54,.13,.4);rotation=[.1,0,.13];}
   const object=new THREE.Mesh(geometry,idea.cue==='book'?mat('#e4dbc5'):mat(r.color,.28,.2));object.position.set(x,y,z);object.scale.setScalar(scale);if(rotation)object.rotation.set(...rotation);object.castShadow=true;object.userData=data;interior.add(object);objects.push(object);
   if(idea.cue==='book'){for(const direction of [-1,1])box(object,.575,.017,.43,0,direction*.078,0,mat(r.color));box(object,.028,.17,.43,-.276,0,0,mat(r.color));for(let n=0;n<4;n++)box(object,.49,.003,.007,.015,-.035+n*.023,.203,mat('#bdb397'));for(let n=0;n<3;n++)box(object,.27-n*.03,.003,.012,.04,.09,-.075+n*.055,mat('#cab886'));}
   if(idea.cue==='sphere'){for(const tilt of [0,Math.PI/2]){const band=new THREE.Mesh(new THREE.TorusGeometry(.343,.01,6,36),mat('#b6a47c',.35,.5));band.rotation.x=tilt;object.add(band);}}
   object.traverse(part=>{part.userData=data;});const title=label(idea.title,'#1d3744',display.dense?.85:Math.min(r.w/3*.93,3.3));title.position.set(x,y+.6*scale,z);title.userData=data;title.visible=!walk;interior.add(title);objects.push(title);
  });
 }
 // Approved additions get separate free floor slots. Existing furnishings are
 // soft obstacles; door openings and previously installed additions stay clear.
 const installedBounds=[],baseBounds=[];interior.updateMatrixWorld(true);interior.traverse(o=>{if(o.isMesh){const b=new THREE.Box3().setFromObject(o);if(b.max.y>.1)baseBounds.push(b);}});
 const overlaps=(a,b,padding=0)=>a.min.x<b.max.x+padding&&a.max.x>b.min.x-padding&&a.min.z<b.max.z+padding&&a.max.z>b.min.z-padding;
 for(const feature of house.resident?.roomFeatures||[]){const r=house.rooms.find(room=>room.id===feature.roomId);if(!r)continue;const x=0,z=0,wood=mat('#93714e'),linen=mat('#e4d7be'),accent=mat(r.color);const installed=new THREE.Group();installed.userData={featureId:feature.id,roomId:r.id};interior.add(installed);
  if(feature.type==='reflection_lamp'){cylinder(installed,.23,.05,x,.03,z,wood);cylinder(installed,.035,1.65,x,.87,z,wood);const shade=new THREE.Mesh(new THREE.CylinderGeometry(.18,.38,.32,20),linen);shade.position.set(x,1.7,z);installed.add(shade);sphere(installed,.1,x,1.6,z,new THREE.MeshStandardMaterial({color:'#f1d69e',emissive:'#eab466',emissiveIntensity:1}));const glow=new THREE.PointLight('#ffd49a',3,3,2);glow.position.set(x,1.45,z);installed.add(glow);}
  if(feature.type==='question_board'){box(installed,1.15,1.03,.11,x,1.38,z,wood);box(installed,1.02,.9,.13,x,1.38,z-.015,linen);for(const dx of [-.44,.44])box(installed,.07,.9,.07,x+dx,.45,z,wood);for(let n=0;n<3;n++)box(installed,.2,.16,.02,x-.3+n*.3,1.36,z-.09,accent);}
  if(feature.type==='experiment_table'){box(installed,1.25,.1,.75,x,.73,z,wood);for(const dx of [-.47,.47])for(const dz of [-.23,.23])box(installed,.06,.68,.06,x+dx,.34,z+dz,wood);sphere(installed,.15,x-.3,.94,z,accent);cylinder(installed,.12,.32,x+.25,.94,z,linen);}
  if(feature.type==='discussion_circle'){chair(installed,x-.4,z, r.color);chair(installed,x+.38,z-.65,'#b69b77');cylinder(installed,.36,.44,x-.25,.22,z-.5,wood);}
  const local=new THREE.Box3().setFromObject(installed),size=local.getSize(new THREE.Vector3()),center=local.getCenter(new THREE.Vector3()),left=r.x-10,top=r.y-8;
  const portals=house.doors.filter(d=>d.a===r.id||d.b===r.id).map(d=>sharedEdge(r,house.rooms.find(room=>room.id===(d.a===r.id?d.b:d.a)))).filter(Boolean);
  if(r.id===entry.roomId)portals.push({axis:'x',fixed:entry.z+8,lo:entry.x+10-.75,hi:entry.x+10+.75,entry:true});
  const doorBounds=portals.map(edge=>{const c=(edge.lo+edge.hi)/2;return edge.axis==='x'?{min:{x:c-10-.8,z:edge.fixed-8-.48},max:{x:c-10+.8,z:edge.fixed-8+.48}}:{min:{x:edge.fixed-10-.48,z:c-8-.8},max:{x:edge.fixed-10+.48,z:c-8+.8}};});
  for(const action of interactions){const data=action.userData||action;if(data.roomId===r.id&&data.anchor)doorBounds.push({min:{x:data.anchor.x-.34,z:data.anchor.z-.34},max:{x:data.anchor.x+.34,z:data.anchor.z+.34}});}
  const base=baseBounds.filter(b=>b.max.x>left&&b.min.x<left+r.w&&b.max.z>top&&b.min.z<top+r.h),preferred={question_board:[.18,.24],reflection_lamp:[.83,.8],experiment_table:[.73,.25],discussion_circle:[.3,.7]}[feature.type]||[.5,.5];
  let placement=null;
  for(let attempt=0;attempt<8&&!placement;attempt++){
   const scale=Math.min(1,Math.min(r.w,r.h)/5)*Math.pow(.87,attempt),hw=size.x*scale/2,hd=size.z*scale/2,minX=left+.16+hw,maxX=left+r.w-.16-hw,minZ=top+.16+hd,maxZ=top+r.h-.16-hd;
   const xs=[minX,maxX,THREE.MathUtils.clamp(left+r.w*preferred[0],minX,maxX)],zs=[minZ,maxZ,THREE.MathUtils.clamp(top+r.h*preferred[1],minZ,maxZ)];for(let px=minX;px<=maxX;px+=.28)xs.push(px);for(let pz=minZ;pz<=maxZ;pz+=.28)zs.push(pz);
   let best=null;for(const px of xs)for(const pz of zs){const b={min:{x:px-hw,z:pz-hd},max:{x:px+hw,z:pz+hd}};if(installedBounds.some(other=>overlaps(b,other,.04))||doorBounds.some(door=>overlaps(b,door)))continue;
    const overlapArea=base.reduce((sum,other)=>sum+(overlaps(b,other)?Math.max(0,Math.min(b.max.x,other.max.x)-Math.max(b.min.x,other.min.x))*Math.max(0,Math.min(b.max.z,other.max.z)-Math.max(b.min.z,other.min.z)):0),0),score=overlapArea*100+Math.hypot(px-(left+r.w*preferred[0]),pz-(top+r.h*preferred[1]));
    if(!best||score<best.score)best={px,pz,scale,score,b};
   }placement=best;
  }
  if(placement){installed.scale.set(placement.scale,Math.max(.8,placement.scale),placement.scale);installed.position.set(placement.px-center.x*placement.scale,0,placement.pz-center.z*placement.scale);installedBounds.push(placement.b);installed.userData.anchor={x:placement.px,z:placement.pz};obstacles.push({minX:placement.b.min.x,maxX:placement.b.max.x,minZ:placement.b.min.z,maxZ:placement.b.max.z,roomId:r.id,label:feature.type});}
  else{interior.remove(installed);}
 }
 const frontDoor=architecture(group,house,exterior||walk,obstacles);return {group,walls,floors,objects,ceilings,obstacles,interactions,frontDoor,entrance:entry};
}

return {buildHouse,disposeSurfaceCache(){for(const t of surfaceTextures.values())t.dispose();surfaceTextures.clear();}};})();

let assetResolver=null;
function release(group){const owned=new Set();group.traverse(o=>{if(o.geometry)owned.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){owned.add(m);for(const v of Object.values(m))if(v?.isTexture&&!v.userData.retainedSurface)owned.add(v);}});for(const resource of owned)resource.dispose();group.clear();}
function buildEdition(edition,house,walk=true,exterior=true,assetOptions={}){
 if(!house||!Array.isArray(house.rooms)||!Array.isArray(house.doors))throw Error('Supply the actual saved house document.');
 if(edition==='residence'){const built=H.buildHouse(house,walk,exterior,assetOptions);built.capabilities={floors:true,roomInventory:true,door:!!built.frontDoor,designs:true,lights:true};return built;}
 const tag=['legacy','inhabited','atelier'].includes(edition)?edition:'atelier',built=factories[tag].buildHouse(house,walk,exterior),baseObstacles=built.obstacles||[],resolve=assetOptions.resolveAsset||assetResolver||H.resolveBundledAsset;
 const errors=[],designs=H.createDesignLayer(built.group,{resolveAsset:resolve,onError:message=>{errors.push(message);assetOptions.onError?.(message);}});
 built.house=house;built.edition=tag;built.navigationHouse=house;built.designLayer=designs;built.designErrors=errors;built.floor=()=>0;built.levels=[{index:0,group:built.group}];
 Object.defineProperty(built,'obstacles',{configurable:true,get(){return [...baseObstacles,...designs.obstacles];}});
 built.ready=designs.load(house,built,tag).then(()=>{built.group.updateMatrixWorld(true);return built;});
 built.setFloor=level=>level===0;built.roomInventory=null;built.toggleLight=tag==='legacy'?null:id=>toggleHomeLight(built.group,id);
 built.setDoor=open=>{if(!built.frontDoor)return null;built.frontDoor.open=Boolean(open);return built.frontDoor.open;};built.toggleDoor=()=>built.frontDoor?built.setDoor(!built.frontDoor.open):null;
 built.canStand=(x,z,radius=.2)=>canExploreAt(house,built.walls,x,z,radius)&&canOccupy(built.obstacles,x,z,radius)&&!(built.frontDoor&&!built.frontDoor.open&&Math.abs(z-built.frontDoor.z)<radius&&Math.abs(x-built.frontDoor.x)<.8);
 built.update=(dt,point)=>{const d=built.frontDoor;if(!d)return;if(point&&Math.hypot(point.x-d.x,point.z-d.z)<1.5)built.setDoor(true);d.leaf.rotation.y+=((d.open?-Math.PI*.47:0)-d.leaf.rotation.y)*Math.min(1,Math.max(0,Number(dt)||0)*7);};
 built.suggestDesignPosition=(roomId,scale)=>designs.position(house,roomId,scale,built);built.tourDesign=id=>designs.tour(id);
 built.capabilities={floors:false,roomInventory:false,door:!!built.frontDoor,designs:tag==='atelier',lights:tag!=='legacy'};
 let disposed=false;built.dispose=()=>{if(disposed)return;disposed=true;designs.dispose();release(built.group);};return built;
}
function visibleHomes(entries,activeId,max=7){const all=entries.filter(h=>h&&h.house),activeIndex=Math.max(0,all.findIndex(h=>h.id===activeId)),start=Math.min(Math.max(0,activeIndex-3),Math.max(0,all.length-8));return all.slice(start,start+8).filter(h=>h.id!==activeId).slice(0,Math.max(0,Math.min(7,Number.isFinite(max)?Math.floor(max):7)));}

function compactExterior(group){group.updateMatrixWorld(true);const inverse=group.matrixWorld.clone().invert(),clusters=new Map(),removedMaterials=new Set();
 const key=m=>JSON.stringify([m.type,m.color?.getHex(),m.emissive?.getHex(),m.emissiveIntensity,m.roughness,m.metalness,m.side,m.opacity,m.depthWrite,m.map?.uuid,m.bumpMap?.uuid,m.bumpScale]);
 group.traverse(o=>{if(!o.isMesh||o.material?.transparent||Array.isArray(o.material)||Object.keys(o.userData).some(k=>!['roof','window','curtain'].includes(k)))return;for(let p=o;p;p=p.parent)if(!p.visible)return;const hash=key(o.material),cluster=clusters.get(hash)||{material:o.material,meshes:[]};cluster.meshes.push(o);clusters.set(hash,cluster);});
 for(const cluster of clusters.values()){if(cluster.meshes.length<2)continue;const positions=[],normals=[],uv=[];for(const o of cluster.meshes){const raw=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();raw.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,o.matrixWorld));const p=raw.attributes.position,n=raw.attributes.normal,t=raw.attributes.uv;for(let i=0;i<p.count;i++){positions.push(p.getX(i),p.getY(i),p.getZ(i));normals.push(n?.getX(i)||0,n?.getY(i)||0,n?.getZ(i)||0);uv.push(t?.getX(i)||0,t?.getY(i)||0);}raw.dispose();if(o.material!==cluster.material)removedMaterials.add(o.material);o.geometry.dispose();o.parent.remove(o);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.computeBoundingSphere();const merged=new THREE.Mesh(geometry,cluster.material);merged.name='Genuine source exterior geometry combined';merged.castShadow=false;merged.receiveShadow=false;group.add(merged);
 }
 const retained=new Set();group.traverse(o=>{if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])retained.add(m);});for(const m of removedMaterials)if(!retained.has(m))m.dispose();
}

function create(T=THREE,options={}){
 if(T!==THREE)throw Error('Use the already loaded global THREE namespace.');
 const group=new T.Group();group.name='Genuine saved neighboring home exteriors';
 const anchors=new Map(),defaultCenters=options.centers||[{x:-295,z:150},{x:-235,z:150},{x:-175,z:150},{x:-115,z:150},{x:-295,z:210},{x:-235,z:210},{x:-175,z:210}],activeAnchor=options.activeAnchor||{x:-96,z:100};
 let entries=[],doors=[],targets=[],colliders=[],worldWalls=[],lots=[],bounds=null,activeId=options.activeId||null,disposed=false,initialActive=activeId;
 const gap=Number.isFinite(options.gap)?Math.max(0,options.gap):8;
 const unit=()=>new T.MeshStandardMaterial({color:'#526049',roughness:.7});
 function anchorFor(home,index){let raw=typeof options.anchorFor==='function'?options.anchorFor(home.id,home):null;if(!raw&&anchors.has(home.id))return anchors.get(home.id);
  if(!raw){if(home.id===initialActive)raw=activeAnchor;else{const sequence=Array.from(anchors.keys()).filter(id=>id!==initialActive).length;raw=defaultCenters[sequence]||{x:-295+(sequence%4)*60,z:150+Math.floor(sequence/4)*60};}}
  if(!Number.isFinite(raw.x)||!Number.isFinite(raw.z))throw Error('A home anchor needs finite world coordinates.');const result={x:raw.x,z:raw.z,y:Number.isFinite(raw.y)?raw.y:(options.baseHeight||0)};anchors.set(home.id,result);return result;
 }
 function boxVisit(parent,entry,home){const m=new T.Mesh(new T.BoxGeometry(1.44,2.1,.095),unit());m.position.set(entry.x,1.05,entry.z+.23);m.userData={homeId:home.id,homeAction:'visit-edition',label:'Visit '+(home.title||'earlier home'),privateTitle:true};parent.add(m);return m;}
 function plaque(parent,entry,title){const wood=new T.Mesh(new T.BoxGeometry(1.5,.18,.045),new T.MeshStandardMaterial({color:'#81694e',roughness:.7}));wood.position.set(entry.x+1.3,1.55,entry.z+.15);parent.add(wood);
  if(typeof document==='undefined')return;const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');if(!ctx)return;ctx.fillStyle='#e8dfcb';ctx.fillRect(0,0,512,96);ctx.fillStyle='#554832';ctx.font='500 34px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(title||'Earlier home').slice(0,28),256,49,480);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const face=new T.Mesh(new T.PlaneGeometry(1.455,.145),new T.MeshBasicMaterial({map:texture}));face.position.set(entry.x+1.3,1.55,entry.z+.175);face.userData={privateTitle:true};parent.add(face);
 }
 function exterior(home){const tag=home.edition;const built=tag==='residence'?H.buildHouseOriginal(home.house,false,true):factories[['legacy','inhabited','atelier'].includes(tag)?tag:'atelier'].buildHouse(home.house,false,true);return built;}
 function clear(){for(const lot of lots){release(lot.built.group);}group.clear();doors=[];targets=[];colliders=[];worldWalls=[];lots=[];bounds=null;}
 function rebuild(homes=options.homes||[],id=activeId){if(disposed)throw Error('The neighborhood adapter has been disposed.');const all=Array.isArray(homes)?homes:(homes?.homes||[]);activeId=id||homes?.activeId||activeId;if(!initialActive)initialActive=activeId;
  const ids=new Set();for(const h of all){if(!h||typeof h.id!=='string'||!h.id||ids.has(h.id))throw Error('Saved home IDs must be distinct and stable.');ids.add(h.id);}entries=all;clear();all.forEach((home,i)=>anchorFor(home,i));
  for(const home of visibleHomes(all,activeId,options.max||7)){const built=exterior(home),a=anchors.get(home.id),entry=entranceFor(home.house);built.group.position.set(a.x,a.y,a.z);built.group.name='Saved home exterior '+home.id;
   built.group.traverse(o=>{if(o.isLight)o.visible=false;if(o.isMesh){o.castShadow=false;o.receiveShadow=false;}});const door=boxVisit(built.group,entry,home);plaque(built.group,entry,home.title);
   if(built.frontDoor?.leaf)built.frontDoor.leaf.traverse(o=>{const data={...o.userData,homeId:home.id,homeAction:'visit-edition',label:door.userData.label};delete data.door;o.userData=data;});
   group.add(built.group);if(options.compact!==false)compactExterior(built.group);built.group.updateMatrixWorld(true);const b=new T.Box3().setFromObject(built.group);
   if(typeof options.anchorFor!=='function'){for(let attempt=0;attempt<16;attempt++){const previous=lots.find(l=>b.min.x<l.bounds.maxX+gap&&b.max.x>l.bounds.minX-gap&&b.min.z<l.bounds.maxZ+gap&&b.max.z>l.bounds.minZ-gap);if(!previous)break;const dx=previous.bounds.maxX+gap-b.min.x;a.x+=dx;built.group.position.x=a.x;b.translate(new T.Vector3(dx,0,0));}built.group.updateMatrixWorld(true);}
   const lot={id:home.id,title:home.title,edition:home.edition,built,anchor:{...a},bounds:{minX:b.min.x,maxX:b.max.x,minY:b.min.y,maxY:b.max.y,minZ:b.min.z,maxZ:b.max.z}};
   const worldDoor={homeId:home.id,x:entry.x+a.x,y:1.05+a.y,z:entry.z+.23+a.z,width:1.44,height:2.1,depth:.095,label:door.userData.label,anchor:{x:entry.x+a.x,y:a.y,z:entry.z+1.7+a.z,yaw:0},target:door};doors.push(worldDoor);targets.push(door);
   for(const w of built.walls||[]){const world=w.axis==='x'?{...w,fixed:w.fixed-8+a.z,lo:w.lo-10+a.x,hi:w.hi-10+a.x}:{...w,fixed:w.fixed-10+a.x,lo:w.lo-8+a.z,hi:w.hi-8+a.z};world.homeId=home.id;worldWalls.push(world);colliders.push(world.axis==='x'?{homeId:home.id,minX:world.lo,maxX:world.hi,minZ:world.fixed-.075,maxZ:world.fixed+.075,label:'Saved home wall'}:{homeId:home.id,minX:world.fixed-.075,maxX:world.fixed+.075,minZ:world.lo,maxZ:world.hi,label:'Saved home wall'});}
   for(const o of built.obstacles||[])colliders.push({...o,homeId:home.id,minX:o.minX+a.x,maxX:o.maxX+a.x,minZ:o.minZ+a.z,maxZ:o.maxZ+a.z});
   colliders.push({homeId:home.id,minX:worldDoor.x-.72,maxX:worldDoor.x+.72,minZ:worldDoor.z-.048,maxZ:worldDoor.z+.048,label:'Saved home visit door'});lots.push(lot);
  }
  if(lots.length){bounds={minX:Math.min(...lots.map(l=>l.bounds.minX)),maxX:Math.max(...lots.map(l=>l.bounds.maxX)),minY:Math.min(...lots.map(l=>l.bounds.minY)),maxY:Math.max(...lots.map(l=>l.bounds.maxY)),minZ:Math.min(...lots.map(l=>l.bounds.minZ)),maxZ:Math.max(...lots.map(l=>l.bounds.maxZ))};}
  group.updateMatrixWorld(true);return api;
 }
 const api={group,rebuild,ready:Promise.resolve(),lookup:id=>lots.find(l=>l.id===id)||null,anchorFor:id=>anchors.has(id)?{...anchors.get(id)}:null,get activeId(){return activeId;},get homes(){return lots;},get doors(){return doors;},get targets(){return targets;},get colliders(){return colliders;},get walls(){return worldWalls;},get bounds(){return bounds;},get defaultLayout(){return {centers:defaultCenters,activeAnchor,gap,maxInactive:7,anchorConvention:'Exact source-group translation; stable by home ID.'};},visit(id){if(!entries.some(h=>h.id===id))return false;if(typeof options.onVisitHome!=='function')return false;return options.onVisitHome(id,true);},use(data){const id=typeof data==='string'?data:data?.homeId;return id?api.visit(id):false;},canStand(x,z,radius=.2){return !colliders.some(c=>x>c.minX-radius&&x<c.maxX+radius&&z>c.minZ-radius&&z<c.maxZ+radius);},dispose(){if(disposed)return;disposed=true;clear();group.removeFromParent();anchors.clear();}};
 rebuild(options.homes||[],activeId);return api;
}
function setAssetResolver(fn){assetResolver=typeof fn==='function'?fn:null;H.setAssetResolver(assetResolver);}
function disposeSurfaceCaches(){for(const f of Object.values(factories))f.disposeSurfaceCache?.();}
g.CITY_HOME_NEIGHBORS={ready:true,create,buildEdition,visibleHomes,setAssetResolver,disposeSurfaceCaches,provenance:{"commit":"48ccb361e8e64857f4e9f94f4598d8dc97970e00","files":{"scene.js":"f2cc5d4ff484d26d3863a19aca29ce406cefefebf891382f28f19ab11fe849c9","legacy-scene.js":"b9dc0deed9e20bef1ba52e5bd3b6b877318c13789a92249d723261052380544b","inhabited-scene-v1.js":"91897c739a4a427a869a00bcbe159105345056cb827b0441b17ef233518e716e","home-interior.js":"614ab4bd840fb7d4ebc40428b2fa117450d32ebc694563bcda6a37334fbf716e","neighborhood.js":"cf5344254ecab9fdeaeb61a73341582732de1b52f9f79b9010f30cfed79c1bc3"},"adaptation":"Actual source geometry factories only, stripped module imports and renderer/controllers. Original adjacent eight-edition window yields up to seven inactive homes. Caller supplies private homes at runtime; stable translations/door targets and source navigation are returned."}};
})(window);
