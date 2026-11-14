import assert from 'node:assert/strict';import vm from 'node:vm';import{readFile}from'node:fs/promises';import{createHash}from'node:crypto';import{BABEL,entryHeight}from'../src/babel-library-model.js';
export async function validateGalleryLandingApproaches(T,{stairs,roof,city}){
 const [source,babel]=await Promise.all(['gallery.js','babel-library.js'].map(p=>readFile(new URL('../src/'+p,import.meta.url),'utf8'))),pick=re=>{const v=source.match(re)?.[0];assert(v);return v;},
 constrain=pick(/^function constrain\(previous=[\s\S]*?^}/m),ascent=pick(/^function updateGalleryAscent\([^\n]+/m),move=pick(/^function moveOnSharedGround\(dx,dz\)\{[\s\S]*?^ \}\}/m),ring=pick(/^function galleryRing\([^\n]+/m);
 const player={},c={THREE:T,BABEL,entryHeight,player,eye:1.8,spacing:8,gallerySpiral:stairs,roofConnection:roof,sharedCity:city,outer:58,inner:28,walkInner:29.5,walkOuter:56.3,updateFloorUI(){c.calls.ui++;},setVisitMode(mode){c.visitMode=mode;c.gallerySpiralTheta=null;},cityGroundHeight(){return.13;}};
 c.M={player,eye:1.8};c.window={CITY_MAIN:{babelLibrary:{guardGallery:previous=>c.guardGallery(previous)}}};
 for(const key of['document','localStorage','sessionStorage','CITY_PROGRESS','resident','privateMemory'])Object.defineProperty(c,key,{get(){throw Error('Unexpected private/DOM access '+key);}});
 const guard=babel.match(/^ function guardGallery\([^\n]+/m)?.[0];assert(guard);
 vm.createContext(c);vm.runInContext(guard+'\n'+ascent+'\n'+constrain+'\n'+move+'\nthis.constrain=constrain;this.move=moveOnSharedGround;',c);
 const reset=(floor,z,x=stairs.centerX,theta=null)=>{Object.assign(player,{x,z,y:floor*8+stairs.base+c.eye,yaw:.31,pitch:-.24});c.currentFloor=floor;c.gallerySpiralTheta=theta;c.visitMode=floor===4?'roof':'gallery';c.touring=false;c.calls={ui:0};},
 step=dz=>{const before={x:player.x,z:player.z};if(c.visitMode==='roof')c.move(0,dz);else{player.z+=dz;c.constrain(before);}assert.equal(player.yaw,.31);assert.equal(player.pitch,-.24);assert.equal(c.touring,false);return Math.abs(player.z-before.z);};
 const material=new T.MeshBasicMaterial(),floorScene=new T.Scene(),fctx={THREE:T,inner:28,outer:58,gallerySpiral:stairs,scene:floorScene,mainBuildingTargets:[],window:{CITY_BABEL_LAYOUT:BABEL},mesh(g,m,x,y,z){const o=new T.Mesh(g,m);o.position.set(x,y,z);floorScene.add(o);return o;}};
 vm.createContext(fctx);vm.runInContext(ring+'\nthis.ring=galleryRing;',fctx);
 const caps=Array.from({length:4},(_,i)=>fctx.ring((i+1)*8+.37,material,i+1,.025,i===3?15.5:28));
 const turn=new T.Matrix4().makeRotationY(Math.PI/2);caps.forEach(o=>o.applyMatrix4(turn));floorScene.updateMatrixWorld(true);roof.group.updateWorldMatrix(true,true);
 const landing=roof.group.getObjectByName('Roof stair landing');assert(landing);const box=new T.Box3().setFromObject(landing);assert(Math.abs(box.min.z-(stairs.run-.1))<1e-6);assert(Math.abs(box.max.z-(stairs.run+1.4))<1e-6);assert(Math.abs(box.max.y-roof.height)<1e-6);
 const hit=(o,x,z,y)=>new T.Raycaster(new T.Vector3(x,y+.02,z),new T.Vector3(0,-1,0),0,.04).intersectObject(o,true).some(h=>Math.abs(h.point.y-y)<2e-6),
 lanes=[-stairs.width/2+.351,-stairs.width/2+.7,0,stairs.width/2-.7,stairs.width/2-.351],gaps=[];
 for(let floor=1;floor<=3;floor++)for(const side of['front','back']){const z=side==='front'?-.04:stairs.run+.04;assert(!hit(caps[floor-1],stairs.centerX,z,stairs.base+8*floor),'Actual book-floor cap has an open .08 m end strip');gaps.push({floor,side,z,physicalGap:.08});}
 let supportedPoints=0;for(const dx of lanes)for(let j=0;j<=40;j++){const z=stairs.run+j*.002,x=stairs.centerX+dx;assert(hit(landing,x,z,roof.height),'Every landing exception has an actual unchanged supporting face');assert(roof.canVisit(x,z),'The actual supported roof landing must stay accessible at small steps');supportedPoints++;}
 let rejectedVoidBands=0;for(const dx of[-stairs.width/2+.349,stairs.width/2-.349])for(const z of[stairs.run+.001,stairs.run+.04,stairs.run+.079]){assert(!roof.canWalk(stairs.centerX+dx,z),'Original .35 m roof-side inset remains');rejectedVoidBands++;}
 for(const dx of lanes)for(const z of[stairs.run-.001,stairs.run-.05,stairs.roofOpeningStart+.1]){assert(!roof.canWalk(stairs.centerX+dx,z),'Stairwell remains controlled by original stair gate');rejectedVoidBands++;}
 const distances=[.005,.0125,.025,.05,.1],roofEntries=[],roofExits=[],bookFloorObservations=[];
 for(const dx of lanes)for(const distance of distances)for(const phase of[0,.003,.007]){
  reset(4,stairs.run+.2+phase,stairs.centerX+dx);let n=0;while(c.gallerySpiralTheta===null&&n++<100)step(-distance);assert.notEqual(c.gallerySpiralTheta,null,'Slow roof entry must reach the original descending gate');assert.equal(c.currentFloor,3);assert.equal(player.x,stairs.centerX+dx);roofEntries.push({dx,distance,phase,steps:n});
  reset(3,stairs.run-.03-phase,stairs.centerX+dx,stairs.starts[3]+stairs.run-.03-phase);player.y=roof.height+c.eye;n=0;while(player.z<stairs.run+.16&&n++<100)step(distance);assert(player.z>=stairs.run+.16,'Fourth-flight arrival must continue across the original landing');assert.equal(c.visitMode,'roof');assert.equal(c.currentFloor,4);assert.equal(player.x,stairs.centerX+dx);roofExits.push({dx,distance,phase,steps:n});
 }
 // Factual negative controls, not a repaired-book-floor claim.
 for(let floor=1;floor<=3;floor++)for(const direction of[-1,1])for(const distance of[.025,.05,.1,.2])for(const phase of[0,.003,.007,.09,.11]){
  reset(floor,direction>0?-.2-phase:stairs.run+.2+phase);let stalled=0,n=0;while(c.gallerySpiralTheta===null&&stalled<3&&n++<100){if(step(direction*distance)<1e-10)stalled++;else stalled=0;}
  bookFloorObservations.push({floor,direction,distance,phase,entered:c.gallerySpiralTheta!==null,z:player.z,steps:n});
 }
 const rows=[];roof.group.traverse(o=>{if(o.isMesh)rows.push({name:o.name,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),index:o.geometry.index?Array.from(o.geometry.index.array):null,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,Array.from(a.array)])),instances:o.isInstancedMesh?Array.from({length:o.count},(_,i)=>{const m=new T.Matrix4();o.getMatrixAt(i,m);return m.toArray();}):null});});
 const roofGeometryHash=createHash('sha256').update(JSON.stringify(rows)).digest('hex');
 assert.equal(roofGeometryHash,'bf79c347b5b1b090afaf7708c62eca9de9a0dfa21ea1067c279b3c57d7d113c1','Complete pre-repair roof geometry/poses/instance order remain exact');
 caps.forEach(o=>o.geometry.dispose());material.dispose();
 return{supportedRoofPoints:supportedPoints,rejectedVoidBands,roofEntries:roofEntries.length,roofExits:roofExits.length,smallStepDistances:distances,bookFloorGaps:gaps,bookFloorCases:bookFloorObservations.length,bookFloorStalls:bookFloorObservations.filter(o=>!o.entered).length,bookFloorObservations,roofGeometryHash,newLiveGeometryResources:0,privateAndDOMDenied:true};
}
