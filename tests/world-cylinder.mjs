import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as T from '../src/city-source-assets/home-tools/vendor/three.module.js';
import {WORLD_CYLINDER as W,isLowerCoordinate,lowerLocal,lowerPhysical,physicalToLower,lowerMatrix,lowerRadius,lowerOnLand,canWalkLower,GALLERY_TUNNEL,tunnelContains} from '../src/world-cylinder-model.js';
import {buildWorldCylinder,mountLowerWorld} from '../src/world-cylinder-scene.js';
import {installWorldCylinder} from '../src/world-cylinder.js';
import {UPPER,LOWER,pointAt,heightAt} from '../src/two-face-gallery-model.js';

const near=(a,b,e=1e-5)=>assert(Math.abs(a-b)<e,`${a} differs from ${b}`),vec=(a,b,e=1e-5)=>{near(a.x,b.x,e);near(a.y,b.y,e);near(a.z,b.z,e);};
const failures=[];function check(name,fn){try{fn();console.log('PASS '+name);}catch(e){failures.push(name);console.error('FAIL '+name+': '+e.message);}}

check('World frame preserves handedness and exactly inverts logical lower coordinates',()=>{
 const f=lowerMatrix(T);near(f.determinant(),1);
 for(const x of[-2455,-2360,-2160,-1800])for(const y of[.13,1.93,-24,-48])for(const z of[-225,-65,90]){
  const p={x,y,z},q=lowerPhysical(p);vec(new T.Vector3(x,y,z).applyMatrix4(f),q);vec(physicalToLower(q),p);
 }
 const zero=lowerPhysical({x:-2160,y:0,z:-65});vec(zero,{x:0,y:-96,z:0});
 const origin=new T.Vector3().applyMatrix4(f),basis=[[1,0,0],[0,1,0],[0,0,1]].map(a=>new T.Vector3(...a).applyMatrix4(f).sub(origin));
 vec(basis[0],{x:1,y:0,z:0});vec(basis[1],{x:0,y:-1,z:0});vec(basis[2],{x:0,y:0,z:-1});vec(basis[0].clone().cross(basis[1]),basis[2]);
 assert(isLowerCoordinate({x:-2360}));assert(!isLowerCoordinate({x:228}));assert(!isLowerCoordinate({x:NaN}));near(lowerRadius(-2360,-65),200);
 assert(lowerOnLand(-2160+565,-65));assert(!lowerOnLand(-2160+565.01,-65));assert(!lowerOnLand(NaN,-65));
 const layout={bounds:{minX:-2455,maxX:-2288,minZ:-225,maxZ:90}},seen=[];
 assert(!canWalkLower(-2360,-65,layout,(...p)=>(seen.push(p),false)));assert.deepEqual(seen,[[-2360,-65]]);
 assert(canWalkLower(-2100,-65,layout,()=>{throw Error('Old remote navigation must not reject new lower land');}));assert(!canWalkLower(-1500,-65,layout,()=>true));
 for(let i=1;i<GALLERY_TUNNEL.points.length;i++){const a=GALLERY_TUNNEL.points[i-1],b=GALLERY_TUNNEL.points[i];for(let j=0;j<=20;j++)assert(tunnelContains(a[0]+(b[0]-a[0])*j/20,a[1]+(b[1]-a[1])*j/20));}
 assert(!tunnelContains(30,10));assert(!tunnelContains(100,110));
});

check('Cylinder has two matching faces, a real lower aperture, enclosed tunnel and finite batched geometry',()=>{
 const b=buildWorldCylinder(T);b.group.updateMatrixWorld(true);let draws=0,instances=0;
 b.group.traverse(o=>{if(o.isMesh){draws++;assert(o.geometry.attributes.position.array.every(Number.isFinite));}if(o.isInstancedMesh){instances+=o.count;assert(o.instanceMatrix.array.every(Number.isFinite));}});
 assert(draws<50,`Cylinder uses ${draws} meshes`);assert(instances>80);near(b.shell.geometry.parameters.height,W.thickness);near(b.shell.geometry.parameters.radiusTop,W.radius);near(b.shell.position.y,-48);
 const ray=(x,y,z,dx,dy,dz,far=20)=>new T.Raycaster(new T.Vector3(x,y,z),new T.Vector3(dx,dy,dz),0,far).intersectObject(b.group,true);
 assert.equal(ray(0,-110,0,0,1,0,18).length,0,'The lower central gallery aperture must remain open');
 const land=ray(100,-110,0,0,1,0,20);assert(land.length);near(land[0].point.y,-96.005);
 for(const [x,z]of[[30,0],[68,0],[70,3],[70,90],[72,115],[100,115],[134,115]]){
  const floor=ray(x,-38.2,z,0,-1,0,3),roof=ray(x,-38.2,z,0,1,0,5);assert(floor.length&&roof.length,`Physical tunnel missing at ${x},${z}`);near(floor[0].point.y,-40);assert(roof[0].point.y>-35.3&&roof[0].point.y<-34.8);
 }
 assert.equal(ray(133,-38.2,115,1,0,0,4).length,0,'The Escher handoff must be an open end');
 assert(ray(40,-38.2,0,0,0,1,3).length,'The straight tunnel has a real side wall');
 let disposed=0;b.shell.geometry.addEventListener('dispose',()=>disposed++);b.dispose();assert.equal(disposed,1);assert.equal(b.group.children.length,0);
});

check('Reparenting preserves nested source animation coordinates, geometry and parent transforms',()=>{
 const scene=new T.Scene(),frame=new T.Group();frame.matrixAutoUpdate=false;frame.matrix.copy(lowerMatrix(T));scene.add(frame);
 const parent=new T.Group();parent.position.set(14,3,8);parent.rotation.y=.28;parent.scale.set(1.2,1.2,1.2);scene.add(parent);
 const remote=new T.Group();remote.position.set(-1900,1,-60);remote.rotation.y=.2;const mesh=new T.Mesh(new T.BoxGeometry(3,4,5),new T.MeshBasicMaterial());mesh.position.set(2,3,4);remote.add(mesh);parent.add(remote);
 const upper=new T.Mesh(new T.BoxGeometry(2,2,2),mesh.material);upper.position.set(100,0,0);parent.add(upper);scene.updateMatrixWorld(true);
 const before={p:remote.position.clone(),q:remote.quaternion.clone(),s:remote.scale.clone(),parentWorld:parent.matrixWorld.clone(),world:mesh.getWorldPosition(new T.Vector3()),geometry:mesh.geometry,material:mesh.material};
 const records=[],selected=mountLowerWorld(T,scene,frame,{skip:new Set([frame]),records});assert(selected.includes(remote));assert(!selected.includes(parent));assert(!selected.includes(upper));
 vec(remote.position,before.p);near(remote.quaternion.angleTo(before.q),0);vec(remote.scale,before.s);assert.equal(mesh.geometry,before.geometry);assert.equal(mesh.material,before.material);
 scene.updateMatrixWorld(true);vec(mesh.getWorldPosition(new T.Vector3()),before.world.clone().applyMatrix4(lowerMatrix(T)));
 remote.position.x+=.75;scene.updateMatrixWorld(true);const expected=new T.Vector3(2,3,4).applyMatrix4(remote.matrix).applyMatrix4(before.parentWorld).applyMatrix4(lowerMatrix(T));vec(mesh.getWorldPosition(new T.Vector3()),expected);
 assert.equal(mountLowerWorld(T,scene,frame,{skip:new Set([frame]),records}).length,0,'Rescanning must not wrap the same lower source twice');assert.equal(records.length,1);
 assert.equal(records[0].node,remote);assert.equal(records[0].parent,parent);
});

class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.events={};this.open=false;this.hidden=false;this.style={};this._text='';}
 set textContent(v){this._text=String(v);this.children=[];}getContext(){return new Proxy({},{get:()=>()=>{}});}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
 setAttribute(k,v){this.attributes[k]=String(v);}addEventListener(k,fn){this.events[k]=fn;}focus(){}
 matches(s){if(s==='dialog[open]')return this.tagName==='dialog'&&this.open;const visible=s.match(/^#([^:]+):not\(\[hidden\]\)$/);if(visible)return this.id===visible[1]&&!this.hidden;if(s.startsWith('#'))return this.id===s.slice(1);if(s.startsWith('.'))return this.className===s.slice(1);return this.tagName===s;}
 querySelectorAll(selector){const list=[],selectors=selector.split(',').map(s=>s.trim()),visit=n=>{for(const c of n.children){if(selectors.some(s=>c.matches(s)))list.push(c);visit(c);}};visit(this);return list;}
 querySelector(s){return this.querySelectorAll(s)[0]??null;}
}
function fixture(){
 const body=new Element('body'),reader=new Element('aside');reader.id='reader-panel';reader.hidden=true;body.append(reader);for(const cls of['welcome-secondary','map-directions']){const e=new Element('div');e.className=cls;body.append(e);}
 globalThis.document={body,hidden:false,querySelector:s=>body.querySelector(s),createElement:t=>new Element(t)};const events=new Map();globalThis.addEventListener=(k,fn)=>events.set(k,fn);globalThis.removeEventListener=()=>{};globalThis.matchMedia=()=>({matches:true});
 let privateAccess=0;globalThis.localStorage=new Proxy({},{get(){privateAccess++;throw Error('Private storage touched');}});globalThis.sessionStorage=globalThis.localStorage;
 const originalMap=()=>true;globalThis.window={CITY_GRAVEYARD:{drawActiveMap:originalMap},gallery:{overview(){M.mode='overview';}}};
 const scene=new T.Scene(),sun=new T.DirectionalLight(0xffffff,2.8),sky=new T.HemisphereLight(0xffffff,0x888888,1.7),lantern=new T.Group();scene.add(sun,sky,lantern);
 const foreign=new T.Mesh(new T.BoxGeometry(2,3,2),new T.MeshBasicMaterial());foreign.position.set(100,0,100);scene.add(foreign);
 const garden=new T.Group();garden.position.set(-2360,0,-65);garden.name='Existing garden and residents';const dancer=new T.Mesh(foreign.geometry,foreign.material);dancer.position.set(3,1,4);garden.add(dancer);scene.add(garden);
 const ground=new T.Mesh(new T.PlaneGeometry(160,300),new T.MeshBasicMaterial());ground.name='Graveyard world · independent ground';ground.position.set(-2360,.005,-65);ground.rotation.x=-Math.PI/2;scene.add(ground);
 const layout={x:-2360,z:-65,bounds:{minX:-2455,maxX:-2288,minZ:-225,maxZ:90},mathematics:{x:-2360,z:35},objects:{x:-2360,z:-160}};
 let clears=0,escherEntries=0,babelEntries=0;
 const M={scene,camera:new T.PerspectiveCamera(66,1.5,.08,650),lantern,eye:1.8,mode:'city',player:{x:100,y:1.93,z:100,yaw:0,pitch:0},clearMovement(){clears++;},setCityMode(){this.mode='city';},cancelActivity(){},arrive(q){this.mode='city';Object.assign(this.player,q,{y:q.y+this.eye,pitch:q.pitch??0});},quickStart(){this.mode='city';Object.assign(this.player,{x:100,z:100,y:1.93});},extraGround:()=>.13,startExtra:()=>false,showExtra:()=>false,city:{GRAVEYARD:layout,targets:[foreign],update(){},region:()=>({id:'old',title:'Existing place'}),canStand:(x,z)=>!(x>-2362&&x<-2358&&z>-69&&z<-61),targetInfo:()=>({kind:'old'})}};
 M.escherDepth={active:false,stop(){this.active=false;},setGalleryExit(fn){this.galleryExit=fn;},enter(id){assert.equal(id,'gallery');escherEntries++;this.active=true;M.arrive({x:136.4,z:115,y:-40,yaw:-Math.PI/2});return true;}};
 M.babelLibrary={active:false,stop(){this.active=false;},begin(p){babelEntries++;this.active=true;Object.assign(M.player,p);}};
 const originals={arrive:M.arrive,update:M.city.update,region:M.city.region,can:M.city.canStand,extra:M.extraGround,start:M.startExtra,target:M.city.targetInfo,show:M.showExtra};
 const api=installWorldCylinder(M,T);
 return{M,api,body,reader,events,scene,sun,sky,lantern,foreign,garden,dancer,ground,originals,originalMap,get privateAccess(){return privateAccess;},get escherEntries(){return escherEntries;},get babelEntries(){return babelEntries;}};
}
function drive(f,x,z,max=1500){const p=f.M.player;for(let i=0;i<max;i++){const d=Math.hypot(x-p.x,z-p.z);if(d<.12)return;const n=Math.min(.1,d/7);p.yaw=Math.atan2(-(x-p.x),-(z-p.z));assert(f.api.step(n,{forward:1,boost:true}));}throw Error(`Controller stuck at (${p.x.toFixed(2)},${p.z.toFixed(2)}) aiming for (${x},${z})`);}

check('Controller walks the actual gallery–Escher tunnel in both directions and rejoins the spiral',()=>{
 const f=fixture(),{M,api}=f;M.arrive({x:23,z:0,y:-40,yaw:-Math.PI/2});assert(api.step(.01,{}));
 for(const p of[[68,0],[70,0],[70,112],[70,115],[133.8,115]])drive(f,...p);
 for(let i=0;i<10&&!f.escherEntries;i++)api.step(.1,{forward:1,boost:true});assert.equal(f.escherEntries,1);assert(M.escherDepth.active);assert.equal(api.route,null);
 M.escherDepth.galleryExit({x:134.9,z:115,y:-40,yaw:Math.PI/2});assert(api.route);assert(!M.escherDepth.active);
 for(const p of[[72,115],[70,115],[70,3],[70,0],[22,0],[19,0],[16,0]])drive(f,...p);
 near(M.player.y-M.eye,-40);assert.equal(api.route.side,'upper');assert(api.route.layer==='spiral'||api.route.layer==='spur');assert.equal(f.privateAccess,0);f.events.get('pagehide')();
});

check('Route rejects native surface relocation and unrelated modes without hijacking movement',()=>{
 const f=fixture(),{M,api}=f;api.visitGallery();assert(api.route);M.quickStart('city');const native={...M.player};assert.equal(api.step(.1,{forward:1}),false);assert.equal(api.route,null);assert.deepEqual(M.player,native);
 api.visitGallery();M.mode='gallery';assert.equal(api.step(.1,{forward:1}),false);assert.equal(api.route,null);f.events.get('pagehide')();
});

check('Lower movement preserves logical positions, old collision contracts and coast bounds',()=>{
 const f=fixture(),{M,api}=f;api.visitLower();near(M.player.x,-2212);near(M.player.z,-65);near(M.player.y,1.93);assert(api.lowerRoots.includes(f.garden));assert.equal(f.garden.position.x,-2360);assert.equal(f.dancer.position.x,3);assert.equal(f.ground.visible,false);
 assert.equal(M.city.canStand(-2360,-65),false);assert.equal(M.city.canStand(-2099.8,-65),false,'New rotunda wall must collide');assert(M.city.canStand(-2220.2,-65),'Western doorway stays open');const held={...M.player};f.reader.hidden=false;api.step(.1,{forward:1,boost:true});assert.deepEqual(M.player,held,'Reading pauses lower-face movement');f.reader.hidden=true;assert(M.city.canStand(-2250,-65));M.player.x=-2160+564.9;M.player.z=-65;M.player.yaw=-Math.PI/2;for(let i=0;i<20;i++)api.step(.1,{forward:1,boost:true});assert(lowerRadius(M.player.x,M.player.z)<=565);assert(lowerRadius(M.player.x,M.player.z)>564.8);
 M.player.x=-2300;M.player.z=-65;const before={...M.player};M.player.yaw=Math.PI/2;api.step(.1,{forward:1});assert(M.player.x<before.x);near(M.player.y,1.93);assert.equal(f.privateAccess,0);f.events.get('pagehide')();
});

check('Physical first-person, photo camera and lantern use the same proper lower frame',()=>{
 const f=fixture(),{M,api}=f;api.visitLower();const logical={x:-2318,y:1.93,z:-65},q=new T.Quaternion().setFromEuler(new T.Euler(.12,.3,0,'YXZ')),flip=new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),Math.PI);
 M.player={...logical,yaw:.3,pitch:.12};const photo=new T.PerspectiveCamera(66,1.5,.08,650);
 for(const cam of[M.camera,photo]){cam.position.set(logical.x,logical.y,logical.z);cam.quaternion.copy(q);api.prepareCamera(cam);vec(cam.position,lowerPhysical(logical));near(cam.quaternion.angleTo(flip.clone().multiply(q)),0);vec(cam.up,{x:0,y:-1,z:0});}
 vec(M.camera.position,photo.position);near(M.camera.quaternion.angleTo(photo.quaternion),0);
 M.lantern.position.set(-2317,2.2,-64);M.lantern.quaternion.copy(q);api.prepareScene();vec(M.lantern.position,lowerPhysical({x:-2317,y:2.2,z:-64}));near(M.lantern.quaternion.angleTo(flip.clone().multiply(q)),0);
 assert(!api.lowerRoots.includes(M.lantern),'The live lantern must not also be reparented into the lower frame');f.events.get('pagehide')();
});

check('Full through-gallery tour crosses the gravity turn and walks out onto the same lower land',()=>{
 const f=fixture(),{M,api}=f;api.visitGallery();const tour=f.body.querySelector('#world-cylinder-context').querySelectorAll('button').find(n=>n.textContent==='Follow the gallery route');assert(tour);tour.onclick();let crossed=false;
 for(let i=0;i<2000&&api.route;i++){api.step(.1,{});if(api.route?.side==='lower')crossed=true;}
 assert(crossed,'The tour must pass the shared middle landing');assert.equal(api.route,null,'The route exits at the lower west doorway');assert(isLowerCoordinate(M.player));near(M.player.y,1.93);near(M.player.x,-2183);assert.equal(f.privateAccess,0);f.events.get('pagehide')();
});

check('Lower gallery floor returns through the real bridge, inverse gravity turn and Babel landing',()=>{
 const f=fixture(),{M,api}=f;M.arrive({x:-2184,z:-65,y:.13,yaw:0});assert(api.step(.01,{}));assert.equal(api.route?.side,'lower');
 // Walk around the annular floor, rather than teleporting across its open centre.
 for(let i=1;i<=48;i++){const a=Math.PI*(1-i/48);drive(f,-2160+24*Math.cos(a),-65+24*Math.sin(a));}
 drive(f,-2144,-65);assert.equal(api.route.side,'lower');near(M.player.y,1.93);
 const tour=f.body.querySelector('#world-cylinder-context').querySelectorAll('button').find(n=>n.textContent==='Follow the gallery route');tour.onclick();let upper=false;
 for(let i=0;i<2000&&api.route;i++){api.step(.1,{});if(api.route?.side==='upper')upper=true;}
 assert(upper,'The lower stair must reach the same shared middle in reverse');assert.equal(api.route,null);assert.equal(f.babelEntries,1);assert(M.babelLibrary.active);near(M.player.x,11.7);near(M.player.y,-24+M.eye);assert.equal(f.privateAccess,0);f.events.get('pagehide')();
});

check('Cleanup restores original source parents, current animation pose, visibility, handlers and UI',()=>{
 const f=fixture(),{M,api,originals}=f;api.visitLower();f.dancer.position.x=7;api.visitGallery();M.city.update(M.player,1);assert(f.sun.intensity<2.8);assert(f.sky.intensity<1.7);assert.equal(f.privateAccess,0);
 f.events.get('pagehide')();assert.equal(f.garden.parent,f.scene);assert.equal(f.ground.parent,f.scene);assert.equal(f.ground.visible,true);near(f.garden.position.x,-2360);near(f.dancer.position.x,7);near(f.sun.intensity,2.8);near(f.sky.intensity,1.7);
 assert.equal(M.arrive,originals.arrive);assert.equal(M.city.update,originals.update);assert.equal(M.city.region,originals.region);assert.equal(M.city.canStand,originals.can);assert.equal(M.extraGround,originals.extra);assert.equal(M.startExtra,originals.start);assert.equal(M.city.targetInfo,originals.target);assert.equal(M.showExtra,originals.show);assert.equal(M.worldCylinder,undefined);
 assert.equal(window.CITY_GRAVEYARD.drawActiveMap,f.originalMap);assert.equal(f.body.querySelector('.map-directions').children.length,0);assert.equal(f.body.querySelector('#world-cylinder-context'),null);assert.deepEqual(M.city.targets,[f.foreign]);assert(f.scene.children.includes(f.foreign));
});

const root=await readFile(new URL('../src/gallery.js',import.meta.url),'utf8');
check('Root renders physical lower poses for normal and photographic frames after lantern update',()=>{
 const lantern=root.lastIndexOf('updateLantern(t)'),scene=root.indexOf('worldCylinder?.prepareScene()',lantern),camera=root.indexOf('worldCylinder?.prepareCamera(camera)',scene),photo=root.indexOf('worldCylinder?.prepareCamera(photoCamera)',camera),render=root.indexOf('renderer.render(scene,photoCamera)',photo);
 assert(lantern>=0&&scene>lantern&&camera>scene&&photo>camera&&render>photo,'Both render cameras and the live lantern must be transformed before capture');
 const step=root.indexOf('worldCylinder?.step('),escher=root.indexOf('escherDepth?.step('),babel=root.indexOf('babelLibrary?.step(');assert(escher>=0&&escher<step&&step<babel,'Connected navigation handlers must run before ordinary movement in the intended order');
});
if(failures.length){console.error(`World cylinder: ${failures.length} failed group(s): ${failures.join('; ')}`);process.exitCode=1;}else console.log('PASS world cylinder: proper +Y/−Y frame, real land/tunnel geometry, source animation preservation, reversible controller tunnel, tour/turn/walkout, physical camera/photo/lantern and lifecycle restoration');
