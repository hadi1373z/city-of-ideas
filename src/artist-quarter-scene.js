import {QUARTER_ARTISTS} from './artist-quarter-data.js?v=artists2';
const PLAN=globalThis.ARTIST_QUARTER_PLAN;

export function buildArtistStudios(T,{loadTexture=url=>new T.TextureLoader().load(url),canvas=()=>document.createElement('canvas')}={}){
 const group=new T.Group();group.name='Artists’ studio garden';const houses=[],targets=[],colliders=[],owned=new Set();
 const own=r=>(owned.add(r),r),mat=color=>own(new T.MeshLambertMaterial({color}));
 const wood=mat(0x795d47),paper=mat(0xeae3cf),metal=mat(0x435951),soil=mat(0x64745d);
 function box(parent,w,h,d,x,y,z,m){const o=new T.Mesh(own(new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);parent.add(o);return o;}
 function sphere(parent,r,x,y,z,m,scale){const o=new T.Mesh(own(new T.SphereGeometry(r,16,12)),m);o.position.set(x,y,z);if(scale)o.scale.set(...scale);parent.add(o);return o;}
 function label(parent,text,x,y,z,width=3.4){const c=canvas();c.width=1024;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#f0e8d8';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#2e463e';ctx.font='52px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,65,960);const texture=own(new T.CanvasTexture(c));texture.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(own(new T.PlaneGeometry(width,width/8)),own(new T.MeshBasicMaterial({map:texture,toneMapped:false})));mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 for(const artist of QUARTER_ARTISTS){
  const home=new T.Group();home.name=artist.name+' · open studio';home.position.set(artist.x,.13,artist.z);home.rotation.y=artist.turn;home.userData.cityDestination='artist:'+artist.id;group.add(home);
  const direction=artist.turn? -1:1,world=(x,z)=>({x:artist.x+direction*x,z:artist.z+direction*z}),wall=mat(artist.wall),trim=mat(artist.trim),roof=mat(artist.roof);
  const obstacle=(x,z,w,d,label)=>{const p=world(x,z);colliders.push({minX:p.x-w/2,maxX:p.x+w/2,minZ:p.z-d/2,maxZ:p.z+d/2,label,artistId:artist.id});};
  const surface=box(home,14,.08,12,0,-.04,0,mat(artist.id==='morisot'?0xc7bbaa:0xc3ad88));surface.name='Flush studio floor';
  box(home,14,4.3,.2,0,2.15,-6,wall);obstacle(0,-6,14,.2,'Back wall');
  box(home,.2,4.3,12,-7,2.15,0,wall);obstacle(-7,0,.2,12,'Side wall');
  // A real side window: wall below, above and at its ends; no full-height glass strip.
  box(home,.2,1.05,12,7,.525,0,wall);box(home,.2,.95,12,7,3.825,0,wall);
  for(const z of[-4.6,4.6])box(home,.2,2.3,2.8,7,2.2,z,wall);
  obstacle(7,0,.2,12,'Window wall');
  const glass=own(new T.MeshLambertMaterial({color:0xc5dfd7,transparent:true,opacity:.13,depthWrite:false,side:T.DoubleSide}));
  box(home,.025,2.3,6.4,7,2.2,0,glass);for(const z of[-3.2,0,3.2])box(home,.11,2.48,.09,6.88,2.2,z,trim);
  for(const y of[1.03,3.38])box(home,.11,.09,6.5,6.88,y,0,trim);
  for(const side of[-1,1]){
   const px=side*4.3;box(home,5.4,1.05,.2,px,.525,6,wall);box(home,5.4,.95,.2,px,3.825,6,wall);
   for(const x of[side*1.68,side*6.92])box(home,.18,2.3,.2,x,2.2,6,wall);
   box(home,4.9,2.3,.025,px,2.2,6,glass);for(const x of[px-2.5,px,px+2.5])box(home,.08,2.5,.14,x,2.2,6.12,trim);
   for(const y of[1.03,3.38])box(home,5.1,.08,.14,px,y,6.12,trim);
   obstacle(px,6,5.4,.2,'Front window wall');
  }
  box(home,3.2,.95,.24,0,3.825,6,trim);for(const x of[-1.6,1.6])box(home,.13,3.35,.28,x,1.675,6.08,wood);
  const plaque=label(home,artist.name,0,3.8,6.15,3);plaque.userData={quarterArtist:artist.id,quarterAction:'painting'};targets.push(plaque);
  if(artist.id==='cezanne'){
   const v=[-7.5,4.3,-6.5,7.5,4.3,-6.5,0,5.8,-6.5,-7.5,4.3,6.7,7.5,4.3,6.7,0,5.8,6.7],indices=[0,3,2,3,5,2,2,5,1,5,4,1,0,2,1,3,4,5];const geo=own(new T.BufferGeometry());geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex(indices);geo.computeVertexNormals();home.add(new T.Mesh(geo,roof));
  }else{
   const sloping=box(home,15,.2,7.1,0,4.85,-3.2,roof);sloping.rotation.x=-.11;
   const lower=box(home,15,.2,6.5,0,4.42,3.4,roof);lower.rotation.x=.035;
   box(home,14,.65,.07,0,4.68,.12,glass);for(const x of[-6,-3,0,3,6])box(home,.08,.65,.1,x,4.68,.13,trim);
  }
  box(home,14,.10,12,0,4.25,0,mat(0xd6ceba));
  // The artwork fills the rear view from the open doorway.
  const work=artist.work,h=3,w=Math.min(5.4,h*work.ratio),height=w/work.ratio;
  box(home,w+.25,height+.25,.10,0,2.35,-5.82,wood);
  const texture=own(loadTexture(new URL('./assets/artist-quarter/'+work.image,import.meta.url).href));texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
  const image=new T.Mesh(own(new T.PlaneGeometry(w,height)),own(new T.MeshBasicMaterial({map:texture,toneMapped:false})));image.position.set(0,2.35,-5.74);image.userData={quarterArtist:artist.id,quarterAction:'painting'};home.add(image);targets.push(image);
  let phase=0;const study=new T.Group();study.userData.dynamic=true;home.add(study);
  if(artist.id==='cezanne'){
   study.position.set(-4,1.08,-1.8);box(home,2.9,.12,1.8,-4,1.08,-1.8,wood);for(const x of[-1.2,1.2])for(const z of[-.65,.65])box(home,.11,1.06,.11,-4+x,.53,-1.8+z,wood);obstacle(-4,-1.8,2.9,1.8,'Still-life table');
   const cloth=box(study,1.8,.006,1.25,.2,.064,0,paper);cloth.name='Linen study cloth';cloth.rotation.y=.18;
   for(const [i,p]of[[-.9,.2],[-.35,.3],[.35,.3],[.95,.15]].entries()){const apple=sphere(study,.19,p[0],.235,p[1],mat(i%2?0xc39a44:0xa95c3f),[1,.9,1]);apple.name='Still-life apple';}
   const ceramic=mat(0x838e8b);ceramic.side=T.DoubleSide;const bowl=new T.Mesh(own(new T.SphereGeometry(.35,20,12,0,Math.PI*2,Math.PI/2,Math.PI/2)),ceramic);bowl.position.set(.1,.207,-.4);bowl.scale.y=.4;study.add(bowl);
  }else if(artist.id==='morisot'){
   study.position.set(6.68,2.25,-2.4);const curtain=box(study,.08,2.45,1.9,0,0,0,mat(0xc0a29c));curtain.name='Movable linen curtain';
   for(let i=0;i<12;i++)box(study,.055,2.48,.04,-.055,0,-.85+i*.155,mat(i%2?0xb1938e:0xcdb3aa));
   box(home,2.5,.3,1.05,-4,.57,-1.4,trim);box(home,2.5,1,.15,-4,1,-1.95,trim);for(const x of[-5,-3])box(home,.12,.45,.12,x,.225,-1.4,wood);obstacle(-4,-1.4,2.5,1.2,'Studio settee');
  }else{
   study.position.set(-6.82,2.05,-.6);study.rotation.y=Math.PI/2;box(study,3.4,2.2,.07,0,0,0,paper);
   const dots=new T.InstancedMesh(own(new T.CircleGeometry(.028,8)),own(new T.MeshBasicMaterial({vertexColors:false})),36*24),o=new T.Object3D();dots.name='Original optical-colour experiment';for(let y=0;y<24;y++)for(let x=0;x<36;x++){const i=y*36+x;o.position.set((x-17.5)*.088,(y-11.5)*.083,.045);o.updateMatrix();dots.setMatrixAt(i,o.matrix);dots.setColorAt(i,new T.Color((x+y)%2?0x4b7c9b:0xe1c453));}dots.instanceColor.needsUpdate=true;study.add(dots);
   for(const z of[-.6,3.8]){const mark=box(home,.7,.008,.07,0,.004,z,trim);mark.name=z<0?'Near colour mark':'Far colour mark';}
  }
  study.traverse(o=>{if(o.isMesh)o.userData={quarterArtist:artist.id,quarterAction:'activity'};});targets.push(study);
  // A small, usable drawing desk; the entrance-to-painting axis stays clear.
  box(home,2,.1,1.1,4,1.03,-2.9,wood);for(const x of[3.2,4.8])for(const z of[-3.3,-2.5])box(home,.09,1,.09,x,.5,z,wood);box(home,1.4,.018,.7,4,1.095,-2.9,paper);obstacle(4,-2.9,2,1.1,'Drawing desk');
  const deskTarget=box(home,.6,.04,.4,4,1.13,-2.9,trim);deskTarget.userData={quarterArtist:artist.id,quarterAction:'reflect'};targets.push(deskTarget);
  const house={artist,group:home,study,image,world,entry:{...world(0,16),y:.13,yaw:artist.turn},insideEntry:{...world(0,3.7),y:.13,yaw:artist.turn},inside:(x,z)=>Math.abs(x-artist.x)<6.85&&Math.abs(z-artist.z)<5.85,
   change(){phase=(phase+1)%3;if(artist.id==='cezanne')study.rotation.y=phase*Math.PI/5;else if(artist.id==='morisot')study.position.z=[-2.4,0,2.4][phase];else{const dots=study.children.find(o=>o.isInstancedMesh),spacing=[1,.75,.6][phase],o=new T.Object3D();for(let y=0;y<24;y++)for(let x=0;x<36;x++){o.position.set((x-17.5)*.088*spacing,(y-11.5)*.083*spacing,.045);o.updateMatrix();dots.setMatrixAt(y*36+x,o.matrix);}dots.instanceMatrix.needsUpdate=true;dots.computeBoundingSphere();}return phase;},
   viewpoint(far){let p,target,dy;if(artist.id==='seurat'){p=world(far?3:-4,far?3.5:1.2);target=world(-6.8,-.6);dy=.4;}else if(artist.id==='cezanne'){p=world(far?1:-1.8,far?2.5:.7);target=world(-4,-1.8);dy=-.45;}else{p=world(far?-2:1.5,far?3.7:-2);target=world(0,-5.75);dy=.57;}return{...p,y:.13,yaw:Math.atan2(p.x-target.x,p.z-target.z),pitch:Math.atan2(dy,Math.hypot(p.x-target.x,p.z-target.z))};}};
  houses.push(house);
 }
 const canStand=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&!colliders.some(b=>x>b.minX-.22&&x<b.maxX+.22&&z>b.minZ-.22&&z<b.maxZ+.22);
 return{group,houses,targets,colliders,canStand,dispose(){group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose?.();});for(const r of owned)r.dispose();group.clear();}};
}

export function buildQuarterGarden(T,art,{naturalTrees=globalThis.window?.buildNaturalCityTrees,plan=PLAN}={}){
 const group=new T.Group();group.name='Artists’ connected garden lanes';const owned=new Set(),paths=[],colliders=[];
 const mat=c=>{const m=new T.MeshLambertMaterial({color:c});owned.add(m);return m;},lawn=mat(0x6b8069),wood=mat(0x8b765d),leaf=mat(0x7b8b6b);
 function box(w,h,d,x,y,z,m){const g=new T.BoxGeometry(w,h,d);owned.add(g);const o=new T.Mesh(g,m);o.position.set(x,y,z);group.add(o);return o;}
 function path(points,width=3){paths.push({points,width});for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]),geo=new T.PlaneGeometry(width,length+.015);owned.add(geo);const mesh=new T.Mesh(geo,lawn);mesh.rotation.x=-Math.PI/2;mesh.rotation.z=-Math.atan2(b[0]-a[0],b[1]-a[1]);mesh.position.set((a[0]+b[0])/2,.012,(a[1]+b[1])/2);mesh.name='Mown lawn route · no raised paving';group.add(mesh);}}
 for(const points of plan.routes)path(points,4);
 for(const h of art.houses.filter(h=>h.artistId!=='dali'&&!h.editionId)){
  const p={x:118+h.entry.x*1.35,z:108+h.entry.z*1.35};
  const court=plan.courts.find(c=>c.artists.includes(h.artistId)),end=court?.id==='garden'?98:['rodin','klee'].includes(h.artistId)?118:116;
  path([[p.x,p.z],[p.x,end]],2.5);
 }
 const dali=art.houses.find(h=>h.artistId==='dali');if(dali){const p={x:118+dali.entry.x*1.35,z:108+dali.entry.z*1.35};path([[p.x,p.z],[p.x,187]],3);}
 path([[plan.escher.x,plan.escher.z+8.4],[plan.escher.x,126]],3);
 for(const h of QUARTER_ARTISTS){const front=h.z+(h.turn?-6:6);path([[h.x,front],[h.x,179]],3);}
 for(const [x,z]of plan.plants){const bed=box(1.65,.16,1.15,x,.04,z,leaf);bed.name='Low garden planting';}
 for(const [x,z]of plan.seats){
  box(2.6,.12,.65,x,.52,z,wood);box(2.6,.5,.1,x,.84,z+.3,wood);for(const dx of[-1.05,1.05])box(.1,.46,.46,x+dx,.23,z,wood);colliders.push({minX:x-1.35,maxX:x+1.35,minZ:z-.4,maxZ:z+.4,label:'Garden seat'});
 }
 if(naturalTrees)naturalTrees(T,group,plan.trees.map(([x,z])=>({x,z})));
 return{group,paths,colliders,dispose(){group.removeFromParent();const all=new Set(owned);group.traverse(o=>{if(o.geometry)all.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])all.add(m);if(o.isInstancedMesh)o.dispose?.();});for(const r of all)r.dispose();group.clear();}};
}
