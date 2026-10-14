/* Actual original Dalí dream residence: five usable objects and four original museum-linked study diagrams.
 * No Dalí painting reproductions are bundled. Original rights/citations remain in DALI_ARTIST.
 * Existing Three160 and source Art City base only; no renderer or backend.
 * addDaliHouse(THREE,base,{assetUrl?}) -> original combined 11-house source city.
 * All source coordinates/colliders are LOCAL to base.group; caller owns world placement.
 */
(function(g){'use strict';
const data=(function(){
// Museum records describe real works; bundled cards are original study diagrams.
const DALI_OBJECTS = [
 {id:'dream-chair',title:'Long-legged dream chair',x:-3,z:1,action:'Sit and compare scale',text:'A useful seat rests below an impossibly tall back. Sketch an ordinary chair, then change one proportion. Which changes its character without losing its use?'},
 {id:'drawer-library',title:'Library of hidden associations',x:4.5,z:0,action:'Open a reading drawer',text:'Choose two ordinary things: a spoon and a cloud, or a book and a window. Write an association between them. Now distinguish a visible resemblance from a private memory.'},
 {id:'soft-clock',title:'Soft clock desk',x:3,z:3,action:'Try a time experiment',text:'Look at one object quietly for thirty seconds. Estimate how much time passed before checking a clock. Describe the difference between measured time and experienced time.'},
 {id:'viewpoint',title:'Impossible sphere viewpoint',x:0,z:-1,action:'Discover a viewpoint',text:'Walk around the floating spheres. From one viewpoint they suggest a face; from another they separate. Draw both views. Does the object change, or does your interpretation?'},
 {id:'egg-window',title:'Egg-shaped landscape window',x:-4.6,z:-1,action:'Frame a dream landscape',text:'Choose three things visible through this opening. Write a scene that keeps their shapes but changes their scale. Keep observation and invention in separate sentences.'}
];
const works=[
 ['memory','The Persistence of Memory','1931','https://www.moma.org/collection/works/79018?locale=en','Compare measured time with remembered time.'],
 ['galatea','Galatea of the Spheres (Gala Placidia)','1952','https://catalogues.salvador-dali.org/catalogues/en/heritageobject/54/','Compare a whole figure with its separate parts.'],
 ['leda','Leda Atomica','1947–49','https://catalogues.salvador-dali.org/catalogues/en/heritageobject/51/','Study the spaces between things that seem suspended.'],
 ['face','Face of the Great Masturbator','1929','https://catalogues.salvador-dali.org/catalogues/en/heritageobject/22-5103/','Separate what you see from what you associate with it.']
];
const DALI_ARTIST={id:'dali',name:'Salvador Dalí',color:'#d6ad55',background:'#e8dfce',description:'An interpretive resident in an original dream house inspired by Dalí’s interest in surprising associations, scale and viewpoints. This is an imagined residence, not a reconstruction or historical testimony.',websiteUrl:'https://www.salvador-dali.org/en/visit/salvador-dali-house-museum/',approach:'Observe precisely, then test an unexpected association. Keep observation distinct from invention.',works:works.map(([id,title,date,sourceUrl,description])=>({id,title,date,medium:'Painting · museum-linked study',imageUrl:'./dali-house/'+id+'.svg',alt:'Original study card for '+title+'; not a reproduction of the painting.',description:description+' The frame contains an original learning diagram. Open the museum record to see the actual painting.',sourceUrl,rights:'Study diagram made for House of Ideas. Dalí’s painting is not bundled; its reproduction rights remain with the rights holders.',rightsUrl:'https://www.salvador-dali.org/en/dali-foundation/services/rights-and-image/',citation:'Salvador Dalí, '+title+', '+date+'. See the linked museum record.',dimensions:'See museum record',collection:'See museum record'}))};

return {DALI_ARTIST,DALI_OBJECTS};})();
const diagrams=Object.fromEntries(data.DALI_ARTIST.works.map(w=>[w.id,'./city-source-assets/home-tools/dali-house/'+w.id+'.svg']));
function addDaliHouse(THREE,base,options={}){
 if(!THREE?.Group||!base?.group||!Array.isArray(base.houses)||!Array.isArray(base.colliders))throw Error('Supply the genuine Art City source result.');
 const DALI_ARTIST={...data.DALI_ARTIST,works:data.DALI_ARTIST.works.map(w=>({...w,imageUrl:options.assetUrl?options.assetUrl(diagrams[w.id]):g.CITY_SOURCES?.assetUrl(diagrams[w.id])||diagrams[w.id]}))},DALI_OBJECTS=data.DALI_OBJECTS;
// Add a new courtyard without moving any of the original ten lots.
function originalAddDaliHouse(THREE,base){
 const group=new THREE.Group();group.name='Dalí dream residence · v1';base.group.add(group);
 const home=new THREE.Group();home.position.set(0,0,-25);group.add(home);
 let closed=false;const owned=[],colliders=[],materials=new Map();
 const mat=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.78}));return materials.get(color);};
 function mesh(geometry,color,x,y,z,data={},scale){owned.push(geometry);const m=new THREE.Mesh(geometry,mat(color));m.position.set(x,y,z);if(scale)m.scale.set(...scale);m.userData={artistId:'dali',...data};home.add(m);return m;}
 const box=(w,h,d,x,y,z,color,data)=>mesh(new THREE.BoxGeometry(w,h,d),color,x,y,z,data);
 const sphere=(r,x,y,z,color,scale,data)=>mesh(new THREE.SphereGeometry(r,16,12),color,x,y,z,data,scale);
 const obstacle=(x,z,w,d,label)=>colliders.push({minX:x-w/2,maxX:x+w/2,minZ:z-25-d/2,maxZ:z-25+d/2,label,artistId:'dali'});
 const object=id=>({daliObjectId:id,label:DALI_OBJECTS.find(o=>o.id===id).action});
 box(56,.08,18,0,-.08,-1,'#adb993');box(3,.035,11,-25,-.01,9,'#d7c8aa');box(49,.035,2,0,-.01,8,'#d7c8aa');
 box(12,.12,10,0,0,0,'#e2cdaa');
 for(const x of [-6,6]){box(.22,3.4,10,x,1.7,0,'#f0e7d6');obstacle(x,0,.22,10,'Dream house side wall');}
 box(12,3.4,.22,0,1.7,-5,'#f0e7d6');obstacle(0,-5,12,.22,'Gallery wall');
 for(const x of [-3.9,3.9]){box(4.2,3.4,.22,x,1.7,5,'#efe3c9');obstacle(x,5,4.2,.22,'Open entrance wall');}
 box(3.6,.55,.22,0,3.12,5,'#ba8e52',{artAction:'enter',label:'Enter Dalí’s dream residence'});
 // A complete offset roof, with sculptural eggs above the habitable volume.
 const roof=box(12.7,.28,10.7,0,3.65,0,'#b5744a');roof.rotation.z=.025;
 for(const x of [-4,0,4])sphere(.68,x,4.55,0,'#f4eee0',[.85,1.5,.85]);
 sphere(.85,-5.86,1.8,-1,'#a6ced2',[.09,1.5,1],object('egg-window'));
 // Long legs and an extravagant back, while the seat still works at human scale.
 box(1.2,.18,1.05,-3,.52,1,'#b05647',object('dream-chair'));obstacle(-3,1,1.2,1.05,'Dream chair');
 for(const x of [-3.5,-2.5])for(const z of [.6,1.4])box(.07,.5,.07,x,.25,z,'#564935',object('dream-chair'));
 for(const x of [-3.5,-2.5])box(.075,2.5,.075,x,1.5,.6,'#bf984f',object('dream-chair'));
 sphere(.55,-3,2.75,.6,'#b05647',[1,.5,.16],object('dream-chair'));
 // A branching cabinet of selectable reading drawers, not decorative shelves.
 box(.6,2.65,3,4.9,1.33,0,'#6a513e',object('drawer-library'));obstacle(4.9,0,.6,3,'Reading cabinet');
 for(let i=0;i<9;i++){const z=-1+(i%3),y=.45+Math.floor(i/3)*.8;box(.48,.55,.74,4.5,y,z,['#bd9366','#927b68','#c5b892'][i%3],object('drawer-library'));sphere(.055,4.2,y,z,'#d5bb76',null,object('drawer-library'));}
 box(1.8,.13,1.1,3,.85,3,'#7a5845',object('soft-clock'));obstacle(3,3,1.8,1.1,'Clock desk');
 for(const x of [2.25,3.75])box(.1,.8,.1,x,.4,3,'#6c503e');
 sphere(.47,3,.98,3,'#dfc784',[1.4,.09,1],object('soft-clock'));sphere(.24,3,.8,3.55,'#dfc784',[1.4,1.2,.1],object('soft-clock'));
 for(let i=0;i<9;i++){const x=(i%3-1)*.4,y=1.4+Math.floor(i/3)*.42;sphere(.13,x,y,-1,'#bfa665',null,object('viewpoint'));}
 const textures=[];const loader=new THREE.TextureLoader();
 DALI_ARTIST.works.forEach((work,i)=>{const x=-4.2+i*2.8,data={artistId:'dali',workId:work.id,label:'Study '+work.title};box(2.35,1.7,.09,x,1.9,-4.83,'#967042',data);const p=mesh(new THREE.PlaneGeometry(2.15,1.5),'#ece4cf',x,1.9,-4.77,data);const texture=loader.load(work.imageUrl,()=>{if(closed)return;p.material=new THREE.MeshBasicMaterial({map:texture});materials.set('painting:'+i,p.material);},undefined,()=>{p.userData.imageStatus='unavailable';});texture.colorSpace=THREE.SRGBColorSpace;textures.push(texture);});
 const labelCanvas=typeof document!=='undefined'?document.createElement('canvas'):null;
 if(labelCanvas){labelCanvas.width=1024;labelCanvas.height=128;const ctx=labelCanvas.getContext('2d');if(ctx){ctx.fillStyle='#514a39';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#fff4d8';ctx.font='48px Georgia';ctx.textAlign='center';ctx.fillText('Salvador Dalí · Dream residence',512,80);const texture=new THREE.CanvasTexture(labelCanvas);textures.push(texture);const plaque=mesh(new THREE.PlaneGeometry(3.5,.45),'#514a39',0,2.85,5.15,{artAction:'enter',label:'Enter Dalí’s house'});plaque.material=new THREE.MeshBasicMaterial({map:texture});materials.set('name',plaque.material);}}
 const house={id:'dali-original-v1',artistId:'dali',name:'Salvador Dalí',group:home,row:0,cx:0,cz:-25,minX:-6,maxX:6,minZ:-30,maxZ:-20,approaches:DALI_ARTIST.works.map((w,i)=>({x:-4.2+i*2.8,z:-28.2,lookAt:{x:-4.2+i*2.8,z:-30}})),entry:{x:0,z:-19.2,yaw:0},spawnInside:{x:0,z:-21.4,yaw:0,artistId:'dali'}};
 const bounds={...base.bounds,minZ:-34},allColliders=[...base.colliders,...colliders];
 const canStand=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&x>bounds.minX+.22&&x<bounds.maxX-.22&&z>bounds.minZ+.22&&z<bounds.maxZ-.22&&!allColliders.some(c=>x>c.minX-.22&&x<c.maxX+.22&&z>c.minZ-.22&&z<c.maxZ+.22);
 return {...base,houses:[...base.houses,house],bounds,colliders:allColliders,canStand,insideAt(x,z){return x>house.minX&&x<house.maxX&&z>house.minZ&&z<house.maxZ?'dali':base.insideAt(x,z);},entryFor(id){return id==='dali'?{...house.spawnInside}:base.entryFor(id);},dispose(){if(closed)return;closed=true;for(const t of textures)t.dispose();for(const m of materials.values())m.dispose();for(const g of owned)g.dispose();base.dispose();}};
}

return originalAddDaliHouse(THREE,base);
}
function buildStandalone(THREE,options={}){const group=new THREE.Group();group.position.set(options.center?.x||0,options.center?.y||0,options.center?.z||0);const base={group,houses:[],colliders:[],bounds:{minX:-29,maxX:29,minZ:-34,maxZ:-15},insideAt:()=>null,entryFor:()=>null,dispose(){group.clear();}};return addDaliHouse(THREE,base,options);}
g.CITY_DALI_SCENE={ready:true,...data,addDaliHouse,buildStandalone,diagrams,provenance:{"commit":"48ccb361e8e64857f4e9f94f4598d8dc97970e00","sourceFiles":{"dali-house-scene.js":"6fcfc1ac4305b62169aa58a372304c5e861818b4f2ace0cefe191584705c02e6","dali-data.js":"2147e769b34bf3ed3b7bb57478aa8d0dbcea12618dae9177482910007c4b0a99"}}};
})(window);
