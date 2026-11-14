import assert from 'node:assert/strict';import vm from 'node:vm';import{readFile}from'node:fs/promises';import{createHash}from'node:crypto';import{BABEL}from'../src/babel-library-model.js';
export async function buildGalleryLiftAuditFixture(T){
 const [source,stairsCode,entranceCode,babel]=await Promise.all(['gallery.js','gallery-spiral.js','gallery-entrance.js','babel-library.js'].map(p=>readFile(new URL('../src/'+p,import.meta.url),'utf8'))),w={};
 vm.runInNewContext(stairsCode+'\n'+entranceCode,{window:w});const route=w.createGallerySpiral(T),scene=new T.Scene(),material=new T.MeshBasicMaterial({side:T.DoubleSide}),materials=Object.fromEntries(['dark','water','metal','stone','warm','rail','wall','glass','plinth'].map(k=>[k,material])),
 c={THREE:T,scene,materials,inner:28,outer:58,spacing:8,eye:1.8,exhibitRadius:52,liftRadius:60.65,walkInner:29.5,walkOuter:56.3,gallerySpiral:route,mainBuildingTargets:[],floorLights:[],exhibitMeshes:[],exhibitRoots:[],createGalleryEntrance:w.createGalleryEntrance,createSnakeSkinTiles:()=>material,sculpture:()=>new T.Group(),textSign(text,color,width,height,parent=scene){const o=new T.Mesh(new T.PlaneGeometry(width,height),material);parent.add(o);return o;},floors:Array.from({length:4},()=>({title:'Synthetic public floor',color:'#abcdef',exhibits:Array.from({length:3},()=>({title:'Synthetic public display',shape:'none'}))})),window:{CITY_BABEL_LAYOUT:BABEL,CITY_MAIN:{babelLibrary:{guardGallery:previous=>c.guardGallery(previous)}}}};
 const take=name=>{const v=source.match(new RegExp('^function '+name+'\\([^\\n]+','m'))?.[0];assert(v,'Missing actual '+name);return v;};
 const a=source.indexOf('function buildArchitecture(){'),b=source.indexOf('function buildOuroborosFloors()',a);assert(a>=0&&b>a);vm.createContext(c);
 vm.runInContext(['mesh','box','cylinder','torus','annulus','galleryRing','galleryCeilingArc','polar','instances'].map(take).join('\n')+'\n'+source.slice(a,b)+'\nbuildArchitecture();',c);
 const rotation=new T.Matrix4().makeRotationY(Math.PI/2);for(const o of scene.children)o.applyMatrix4(rotation);scene.updateMatrixWorld(true);
 return{source,babel,route,scene,material,c,take};
}
export async function auditGalleryLiftLandings(T){
 const{source,babel,route,scene,material,c,take}=await buildGalleryLiftAuditFixture(T);
 const boxes=[],windows=[],caps=[];scene.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.parameters;if(o.isInstancedMesh&&o.geometry.type==='BoxGeometry'&&p.height===6.5)windows.push(o);if(o.geometry.type==='BoxGeometry'&&p.width===4.3&&p.height===.18&&p.depth===6.2&&Math.abs(new T.Box3().setFromObject(o).getCenter(new T.Vector3()).z-12)<1e-5)boxes.push(o);if(o.geometry.type==='ExtrudeGeometry'&&o.userData.cityDestination==='gallery')caps.push(o);});
 assert.deepEqual(windows.map(o=>o.count),[70,72,72,72]);assert.equal(boxes.length,4);
 const platform=scene.getObjectByName('lift-platform');assert(platform);
 const hit=(o,x,z,y)=>new T.Raycaster(new T.Vector3(x,y+.01,z),new T.Vector3(0,-1,0),0,.02).intersectObject(o,true).some(h=>Math.abs(h.point.y-y)<2e-5);
 const player={},nodes=new Map(),calls={ui:0,close:0},node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,textContent:''});return nodes.get(id);};
 Object.assign(c,{player,currentFloor:0,inside:true,visitMode:'gallery',touring:false,transition:null,gallerySpiralTheta:null,pendingCityExit:false,keys:{KeyW:true},floorButtons:Array.from({length:4},()=>({disabled:false})),$:node,CITY_I18N:{t:()=> 'tour'},tx:(fa,en)=>en,closeExhibit(){calls.close++;},updateFloorUI(){calls.ui++;},setVisitMode(mode){c.visitMode=mode;},cityGroundHeight(){return.13;},enter(){throw Error('Unexpected nonexplicit arrival');},pointToward(){throw Error('Unexpected exit');},performance:{now:()=>c.now},M:{player,eye:1.8},BABEL});
 for(const key of['document','localStorage','sessionStorage','CITY_PROGRESS','resident','privateMemory'])Object.defineProperty(c,key,{get(){throw Error('Private/DOM access '+key);}});
 const constrain=source.match(/^function constrain\(previous=[\s\S]*?^}/m)?.[0],guard=babel.match(/^ function guardGallery\([^\n]+/m)?.[0],ta=source.indexOf('else if(transition){'),tb=source.indexOf('}else{',ta);
 assert(constrain&&guard&&ta>=0&&tb>ta);
 vm.runInContext(take('changeFloor')+'\n'+take('updateGalleryAscent')+'\n'+guard+'\n'+constrain+'\nthis.tick=function(){'+source.slice(ta+'else if(transition){'.length,tb)+'};',c);
 const rows=[],landings=[],transfers=[],glassHits=[];let supportProbes=0,movementSamples=0,transitionSamples=0;
 for(let floor=1;floor<=3;floor++){
  const feet=floor*8+.395,landing=boxes.find(o=>Math.abs(new T.Box3().setFromObject(o).getCenter(new T.Vector3()).y-(floor*8+.37))<1e-5),box=new T.Box3().setFromObject(landing),cap=caps.find(o=>Math.abs(new T.Box3().setFromObject(o).max.y-feet)<2e-5);
  assert(cap&&landing);assert(Math.abs(box.min.x-55.55)<2e-6&&Math.abs(box.max.x-61.75)<2e-6);assert(Math.abs(box.min.z-9.85)<2e-6&&Math.abs(box.max.z-14.15)<2e-6);assert(Math.abs(box.max.y-feet-.065)<2e-6);
  for(const dx of[-.28,0,.28])for(const dz of[-.28,0,.28]){assert(hit(cap,54.2+dx,12+dz,feet));supportProbes++;}
  for(const z of[11.2,12,12.8])for(const h of[.4,1,1.8,2.1]){const hits=new T.Raycaster(new T.Vector3(54.2,feet+h,z),new T.Vector3(1,0,0),0,8).intersectObject(windows[floor]);assert(hits.length,'Retained upper facade has glazing, not a lift doorway');glassHits.push({floor,z,height:h,instanceId:hits[0].instanceId,x:hits[0].point.x});}
  Object.assign(player,{x:39.450980392156865,z:12,y:c.eye+.395,yaw:.27,pitch:-.2});c.currentFloor=0;c.transition=null;c.now=0;c.pendingCityExit=false;c.gallerySpiralTheta=null;
  const keys=c.keys;c.changeFloor(floor);assert.equal(player.x,60.65);assert.equal(player.z,12);assert(c.floorButtons.every(b=>b.disabled));
  for(let time=0;time<=1450;time+=25){c.now=time;c.tick();platform.updateWorldMatrix(true,false);assert(Math.abs(new T.Box3().setFromObject(platform).max.y-(player.y-c.eye))<2e-6);transitionSamples++;}
  assert.equal(c.transition,null);assert.equal(c.currentFloor,floor);assert.equal(player.x,54.2);assert.equal(player.z,12);assert(Math.abs(player.y-c.eye-feet)<1e-8);assert(c.floorButtons.every(b=>!b.disabled));assert.equal(c.keys,keys);assert(c.keys.KeyW);assert(hit(cap,player.x,player.z,feet));
  transfers.push({floor,stage:{x:60.65,z:12},arrival:{x:player.x,z:player.z,feet},originalEndHandoff:6.45});
  for(const z of[11.2,12,12.8])for(const distance of[.005,.025,.1,.2]){
   Object.assign(player,{x:54.2,z,y:feet+c.eye,yaw:Math.PI/2,pitch:-.1});c.gallerySpiralTheta=null;let n=0;
   while(player.x>52){const previous={x:player.x,z:player.z};player.x-=Math.min(distance,player.x-52);c.constrain(previous);assert.equal(player.z,z);assert(hit(cap,player.x,player.z,feet));assert(Math.abs(player.y-c.eye-feet)<1e-7);assert.equal(c.currentFloor,floor);assert.equal(player.yaw,Math.PI/2);assert.equal(player.pitch,-.1);movementSamples++;if(++n>500)throw Error('Interior route stalled');}
   Object.assign(player,{x:54.2,z:12,y:feet+c.eye});for(let i=0;i<1000;i++){const previous={x:player.x,z:player.z};player.x+=distance;c.constrain(previous);assert(Math.hypot(player.x,player.z)<=56.3+1e-8);if(Math.abs(Math.hypot(player.x,player.z)-56.3)<1e-8)break;if(i===999)throw Error('Radial boundary not reached');}
   assert(player.x<box.min.x,'Existing ring limit stops before the exterior landing');assert(hit(cap,player.x,player.z,feet));
  }
  landings.push({floor,min:box.min.toArray(),max:box.max.toArray(),topAboveFeet:box.max.y-feet,walkingLimitAtZ12:Math.sqrt(56.3**2-12**2),platformMinX:box.min.x});
 }
 // Structural audit scope: actual caps/side landings/shaft/platform/glazing; no production mutation.
 const scope=[...caps,...boxes,platform,...windows,...scene.children.filter(o=>o.isMesh&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.height>=32)];
 scope.forEach(o=>rows.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)])),instances:o.isInstancedMesh?Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();}):null}));
 const fingerprint=createHash('sha256').update(JSON.stringify(rows)).digest('hex');assert.equal(fingerprint,'512f8d8df0aeb48d3243b0b97af983d77be1566aa7a1afdf8a140ec4b31baacb','All selected structural geometry/matrices/IDs stay exact after the original target3 transfer');const geometries=new Set(),mats=new Set();scene.traverse(o=>{if(o.isMesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));}});geometries.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());
 return{sourceRuntimeAndGeometry:true,transfers,transitionSamples,supportProbes,bodyGlazingRays:glassHits.length,glassHits,landings,movementSamples,structuralScope:{snapshotAfterExplicitTarget:3,meshes:scope.length,instances:scope.reduce((n,o)=>n+(o.isInstancedMesh?o.count:0),0),fingerprint},upperWindowCounts:windows.slice(1).map(o=>o.count),privateDOMDenied:true,newProductionResourcesOrState:0,physicalUpperLiftDoorwayClaim:false,bookFloorStairGapsStillUnrepaired:6};
}
