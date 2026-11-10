import {WORLD_CYLINDER as W,isLowerCoordinate,lowerLocal,lowerPhysical,lowerRadius,lowerMatrix,canWalkLower,tunnelContains,GALLERY_TUNNEL} from './world-cylinder-model.js';
import {buildWorldCylinder,mountLowerWorld} from './world-cylinder-scene.js?v=ocean1';
import {UPPER,LOWER,pointAt,headingAt,heightAt,surfaceAt as gallerySurface,walkGallery} from './two-face-gallery-model.js';
import {buildTwoFaceGallery} from './two-face-gallery-scene.js?v=paper-support1';
import {LOWER_INLET} from './lower-landscape-model.js';
import {buildMathFaculty} from './math-faculty-scene.js';
export function installWorldCylinder(M,T){
 const built=buildWorldCylinder(T),upper=buildTwoFaceGallery(T,{side:'upper'}),lower=buildTwoFaceGallery(T,{side:'lower'}),faculty=buildMathFaculty(T);M.scene.add(built.group);built.group.add(upper.group);lower.group.position.set(-2160,0,-65);built.lowerFrame.add(lower.group);faculty.group.position.set(-2160,0,-65);built.lowerFrame.add(faculty.group);M.city.targets.push(...faculty.targets);
 const nativeShell=faculty.nativeShellNodes(window.CITY_EXTRAS?.mathModels),shellVisibility=new Map(nativeShell.map(n=>[n,n.visible]));for(const n of nativeShell)n.visible=false;
 const records=[],skip=new Set([built.group,M.lantern].filter(Boolean)),frame=lowerMatrix(T),flipQ=new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),Math.PI),layout=M.city.GRAVEYARD;
 const culled=new Map();function restoreCulling(){for(const[n,v]of culled)n.visible=v;culled.clear();}
 const clippingBefore=M.renderer?.clippingPlanes||[],localClippingBefore=M.renderer?.localClippingEnabled||false,sectionPlane=new T.Plane(),interiorPlane=new T.Plane(),cutMaterials=new Map();
 function setSectionMaterials(active){if(active&&cutMaterials.size===0){for(const group of[upper.group,lower.group,M.babelLibrary?.built?.group].filter(Boolean))group.traverse(o=>{for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){if(m.isShaderMaterial||cutMaterials.has(m))continue;cutMaterials.set(m,m.clippingPlanes);m.clippingPlanes=[interiorPlane];m.needsUpdate=true;}});}else if(!active&&cutMaterials.size){for(const[m,planes]of cutMaterials){m.clippingPlanes=planes;m.needsUpdate=true;}cutMaterials.clear();}}
 let sectionFog=null,journey=null,video=null,route=null,auto=0,turning=null,internal=false,section='upper',lastStructure='',disposed=false,lightRestore=null;
 const el=(tag,text)=>{const e=document.createElement(tag);if(text)e.textContent=text;return e;},button=(text,fn)=>{const b=el('button',text);b.type='button';b.className='glass';b.onclick=fn;return b;};
 const panel=el('details');panel.id='world-cylinder-context';panel.lang='en';panel.dir='ltr';panel.hidden=true;
 const title=el('summary');title.tabIndex=0;const detail=el('p'),controls=el('div'),tour=button('Follow the gallery route',()=>{if(!route)visitGallery();auto=route?.side==='lower'?1:-1;/* positive is toward the upper city */}),back=button('Return to upper city',()=>{stop();M.quickStart('city');}),see=button('See both faces',()=>overview('section'));
 controls.append(tour,see,back);panel.append(title,detail,controls);document.body.append(panel);
 const sectionButton=button('World · two faces',()=>overview('section'));sectionButton.id='world-cylinder-overview';document.querySelector('.welcome-secondary')?.append(sectionButton);const mapButton=button('World · two faces',()=>overview('section'));document.querySelector('.map-directions')?.append(mapButton);
 const views=el('nav');views.id='world-cylinder-views';views.setAttribute('aria-label','View the two faces');for(const[id,text]of[['upper','Upper face'],['section','Through the cylinder'],['lower','Lower face']])views.append(button(text,()=>overview(id)));const enter=button('Walk on the lower face',()=>visitLower());views.append(enter);views.hidden=true;document.body.append(views);
 const journeyPanel=el('aside');journeyPanel.id='pond-world-journey';journeyPanel.hidden=true;const journeyText=el('strong','Crossing to the other face'),skipJourney=button('Skip crossing',()=>finishJourney());journeyPanel.append(journeyText,skipJourney);document.body.append(journeyPanel);
 const prior={update:M.city.update,region:M.city.region,can:M.city.canStand,arrive:M.arrive,extra:M.extraGround,start:M.startExtra,target:M.city.targetInfo,show:M.showExtra};
 const originalMap=window.CITY_GRAVEYARD?.drawActiveMap;
 const lowerPlayer=()=>M.mode==='city'&&isLowerCoordinate(M.player);
 const logical=(p=M.player)=>lowerPlayer()?{...p,x:p.x+2160,z:p.z+65}:p;
 function restoreLight(){if(lightRestore){for(const[l,n]of lightRestore)l.intensity=n;lightRestore=null;}}
 function stop(){journey=null;journeyPanel.hidden=true;delete document.body.dataset.worldJourney;route=null;auto=0;turning=null;restoreLight();panel.hidden=true;delete document.body.dataset.galleryPassage;}
 M.arrive=p=>{if(!internal){stop();section='upper';}return prior.arrive.call(M,p);};
 function arrive(p){internal=true;try{M.arrive(p);}finally{internal=false;}}
 function assignGallery(q,side,layer='spiral'){
  const origin=side==='lower'?W.lowerOrigin:{x:0,z:0};Object.assign(M.player,{x:q.x+origin.x,z:q.z+origin.z,y:q.y+M.eye,galleryTheta:q.theta??0,galleryLayer:layer,gallerySide:side});
 }
 function begin(side,point,layer='spiral',{keepMovement=false}={}){
  M.cancelActivity?.();M.babelLibrary?.stop?.();M.escherDepth?.stop?.();if(!keepMovement)M.clearMovement();M.setCityMode();route={side,theta:point.theta??0,layer};assignGallery(point,side,layer);document.body.dataset.galleryPassage=side;panel.open=!['floor','walkout'].includes(layer);section='upper';return true;
 }
 function visitGallery(){arrive({x:11.7,z:0,y:-24,yaw:-Math.PI/2});begin('upper',{x:11.7,z:0,y:-24,theta:0},'top');M.player.pitch=-.1;}
 const lowerArrival={x:W.lowerOrigin.x-52,z:W.lowerOrigin.z,y:.13,yaw:-Math.PI/2};
 function visitLower(){stop();arrive(lowerArrival);section='upper';scan();return true;}
 function visitPapers(){const slot=M.paperMonitors?.slots[0];if(!slot)return false;stop();arrive({x:W.lowerOrigin.x+Math.cos(slot.angle)*52.5,z:W.lowerOrigin.z+Math.sin(slot.angle)*52.5,y:.13,yaw:-slot.angle-Math.PI/2});M.player.pitch=.14;section='upper';scan();return true;}
 function visitLandscape(which='overlook'){const a=built.lowerLandscape?.anchors[which];if(!a)return false;stop();arrive({x:W.lowerOrigin.x+a.x,z:W.lowerOrigin.z+a.z,y:.13,yaw:which==='overlook'?-Math.atan2(a.x,a.z):0});section='upper';scan();return true;}
 function overview(which='section'){stop();M.escherDepth?.stop?.();window.gallery.overview();document.body.dataset.coastalOverview='clear';section=which;M.clearMovement();}
 function scan(){const scanStart=performance.now();mountLowerWorld(T,M.scene,built.lowerFrame,{skip,records});const world=document.getElementById?.('world');if(world){world.dataset.lowerRootCount=String(records.length);world.dataset.lowerScanMs=(performance.now()-scanStart).toFixed(1);}for(const r of records)if(r.node.name==='Graveyard world · independent ground')r.node.visible=false;}
 function canLower(x,z){const q=lowerLocal({x,z}),feet=M.player.y-M.eye;if(Math.abs(feet-.13)<.5&&built.lowerLandscape&&!built.lowerLandscape.canStand(q.x,q.z))return false;if(!faculty.canStand(q.x,q.z,feet)||M.paperMonitors?.canStand(q.x,q.z,feet)===false)return false;if(Math.abs(feet-.13)<.5&&built.lowerObstacles?.some(o=>Math.hypot(x-o.x,z-o.z)<o.radius+.28))return false;return canWalkLower(x,z,layout,prior.can);}
 M.city.canStand=(x,z)=>lowerPlayer()?canLower(x,z):prior.can(x,z);
 M.city.region=(x,z)=>{
  if(route)return{id:'through-gallery',title:route.side==='lower'?['floor','walkout'].includes(route.layer)?'Faculty of Mathematics · reading hall':'Mathematics · the through-gallery':'Gallery · below Babel',inside:true};
  if(lowerPlayer()&&lowerRadius(x,z)<58)return{id:'lower-gallery',title:'Faculty of Mathematics · circular reading hall',inside:true};
  const base=prior.region(x,z);if(lowerPlayer()&&isLowerCoordinate({x})&&base.id==='city'){
   const q=lowerLocal({x,z}),shore=built.lowerLandscape?.anchors.overlook,bridge=built.lowerLandscape?.contract.bridge;
   if(shore&&Math.hypot(q.x-shore.x,q.z-shore.z)<25)return{id:'lower-shore',title:'Ocean overlook · the other face',inside:false};
   if(bridge&&q.x>bridge.minX-8&&q.x<bridge.maxX+8&&q.z>bridge.minZ-8&&q.z<bridge.maxZ+8)return{id:'lower-bridge',title:'Inlet bridge · meadow circuit',inside:false};
   return{id:'lower-meadow',title:Math.hypot(q.x,q.z)>510?'Coast promenade · the other face':'Meadow and inlet circuit',inside:false};
  }return base;
 };
 M.extraGround=(x,z)=>{if(lowerPlayer()&&lowerRadius(x,z)>58){const y=prior.extra?.(x,z);return Number.isFinite(y)?y:.13;}return prior.extra?.(x,z);};
 M.startExtra=id=>id==='paper-monitors'?visitPapers():id==='lower-shore'?visitLandscape():id==='lower-inlet'?visitLandscape('inlet'):id==='escher-depth'?(M.escherDepth?.enter('gallery'),true):id==='world-section'?(overview('section'),true):id==='lower-face'?visitLower():id==='through-gallery'?(visitGallery(),true):prior.start?.(id);
 function switchHalf(){
  const from=M.camera.position.clone(),qfrom=M.camera.quaternion.clone(),oldSide=route.side,newSide=oldSide==='upper'?'lower':'upper',oldAuto=auto;
  arrive({x:newSide==='lower'?-2144:16,z:newSide==='lower'?-65:0,y:-48,yaw:newSide==='lower'?0:Math.PI});
  begin(newSide,{x:16,z:0,y:-48,theta:UPPER.endTheta},'mid',{keepMovement:true});M.player.yaw=newSide==='lower'?0:Math.PI;M.player.pitch=-.08;auto=oldAuto;
  turning={start:performance.now(),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:850,from,qfrom};
 }
 function movement(dt,input,{openAir=false}={}){const p=M.player,n=Math.max(1,Math.hypot(input.forward||0,input.strafe||0)),speed=(openAir?(input.boost?13.5:8.5):(input.boost?7:3.5))*Math.min(.1,dt);p.yaw+=(input.turn||0)*Math.min(.1,dt)*1.65;return{dx:(-Math.sin(p.yaw)*(input.forward||0)+Math.cos(p.yaw)*(input.strafe||0))*speed/n,dz:(-Math.cos(p.yaw)*(input.forward||0)-Math.sin(p.yaw)*(input.strafe||0))*speed/n};}
 // The finite gallery deck hands over to ordinary, collision-aware lower land.
 // Use the same boundary when leaving and when deciding whether to recapture
 // the visitor; otherwise the next tick traps them at the deck's outer edge.
 function lowerOutdoorHandoff(surface,x,z){return !!surface&&(surface.layer==='walkout'&&x< -62||surface.layer==='floor'&&Math.hypot(x,z)>57.2);}
 function driveGallery(dt,input){
  const side=route.side,s=side==='upper'?UPPER:LOWER,p=logical(),hasInput=Math.abs(input.forward||0)+Math.abs(input.strafe||0)+Math.abs(input.turn||0)>.05;
  if(hasInput)auto=0;
  if(auto){
   // Down: upper theta increases, lower theta decreases. Up is the reverse.
   const direction=auto*(side==='upper'?-1:1),theta=Math.max(0,Math.min(s.endTheta,(route.theta??0)+direction*Math.min(dt,.1)*8/s.radius)),q=pointAt(theta,side),h=headingAt(theta,side);
   assignGallery(q,side);route.theta=theta;route.layer='spiral';M.player.yaw=h.yaw+(direction<0?Math.PI:0);M.player.pitch=-.11;
   if(theta>=s.endTheta-1e-6&&direction>0){switchHalf();return true;}
   if(theta<=1e-6&&direction<0){auto=0;if(side==='upper'){stop();M.babelLibrary?.begin?.({x:11.7,z:0,y:-24+M.eye,yaw:Math.PI/2,pitch:-.1});}else{route=null;Object.assign(M.player,{x:-2183,z:-65,y:.13+M.eye,yaw:Math.PI/2,pitch:0});delete document.body.dataset.galleryPassage;}}return true;
  }
  const d=movement(dt,input),local={...p,galleryTheta:route.theta,galleryLayer:route.layer};
  if(side==='upper'&&Math.abs(p.y-M.eye+40)<.3&&tunnelContains(p.x,p.z)&&p.x>20){
   const steps=Math.max(1,Math.ceil(Math.hypot(d.dx,d.dz)/.1));for(let i=0;i<steps;i++){const x=local.x+d.dx/steps,z=local.z+d.dz/steps;if(tunnelContains(x,z)||gallerySurface(x,z,-40,{side:'upper',lastTheta:UPPER.spur.theta,layer:'spur'})){local.x=x;local.z=z;}}
   local.y=-40+M.eye;local.galleryTheta=UPPER.spur.theta;local.galleryLayer='spur';
   if(local.x>134&&Math.abs(local.z-115)<1.7){route=null;delete document.body.dataset.galleryPassage;M.escherDepth?.enter('gallery');return true;}
  }else walkGallery(local,d.dx,d.dz,{side,eye:M.eye,lastTheta:route.theta,layer:route.layer,canStand:(x,z,y)=>{if(side!=='lower')return true;if(!faculty.canStand(x,z,y)||M.paperMonitors?.canStand(x,z,y)===false)return false;const next=gallerySurface(x,z,y,{side:'lower',lastTheta:route.theta,layer:route.layer});return !lowerOutdoorHandoff(next,x,z)||canLower(x+W.lowerOrigin.x,z+W.lowerOrigin.z);}});
  Object.assign(M.player,{x:local.x+(side==='lower'?-2160:0),z:local.z+(side==='lower'?-65:0),y:local.y});route.theta=local.galleryTheta;route.layer=local.galleryLayer;
  const inMiddle=Math.abs(local.y-M.eye+48)<.26&&Math.abs(local.z)<2.6&&local.x>17.7;
  if(inMiddle&&Math.hypot(d.dx,d.dz)>.01){switchHalf();return true;}
  if(side==='upper'&&route.layer==='top'&&local.x<10.9){stop();M.babelLibrary?.begin?.({...M.player},{keepMovement:true});}
  if(side==='lower'&&lowerOutdoorHandoff({layer:route.layer},local.x,local.z)){route=null;delete document.body.dataset.galleryPassage;}
  return true;
 }
 function step(dt,input={}){
  if(journey)return true;
  if(disposed||M.mode!=='city'){if(route)stop();return false;}
  if((route||lowerPlayer())&&(document.hidden||document.querySelector('dialog[open],#reader-panel:not([hidden]),#exhibit-panel:not([hidden]),#map-panel:not([hidden])')))return true;
  if(turning){if(performance.now()-turning.start<turning.duration)return true;turning=null;}
  if(route){const p=logical(),valid=gallerySurface(p.x,p.z,p.y-M.eye,{side:route.side,lastTheta:route.theta,layer:route.layer})||route.side==='upper'&&Math.abs(p.y-M.eye+40)<.3&&tunnelContains(p.x,p.z);if(!valid){stop();return false;}return driveGallery(dt,input);}
  const p=M.player,feet=p.y-M.eye;
  if(!isLowerCoordinate(p)&&Math.abs(feet+24)<.3&&p.x>11.3&&p.x<18.3&&Math.abs(p.z)<1.6&&M.babelLibrary?.active){begin('upper',{x:p.x,z:p.z,y:-24,theta:0},'top',{keepMovement:true});return driveGallery(dt,input);}
  if(!isLowerCoordinate(p)&&Math.abs(feet+40)<.3&&tunnelContains(p.x,p.z)){begin('upper',{x:p.x,z:p.z,y:-40,theta:UPPER.spur.theta},'spur',{keepMovement:true});return driveGallery(dt,input);}
  if(!lowerPlayer())return false;
  const q=lowerLocal(p),s=gallerySurface(q.x,q.z,feet,{side:'lower'});
  if(s&&!lowerOutdoorHandoff(s,q.x,q.z)){begin('lower',{x:q.x,z:q.z,y:s.y,theta:s.theta},s.layer,{keepMovement:true});return driveGallery(dt,input);}
  const d=movement(dt,input,{openAir:!prior.region(p.x,p.z)?.inside}),steps=Math.max(1,Math.ceil(Math.hypot(d.dx,d.dz)/.14));for(let i=0;i<steps;i++){
   const x=p.x+d.dx/steps,z=p.z+d.dz/steps,r=lowerRadius(x,z);
   if(r<58){const a=gallerySurface(x+2160,z+65,feet,{side:'lower'});if(!a)continue;if(!lowerOutdoorHandoff(a,x+2160,z+65)){if(!canLower(x,z))continue;begin('lower',{x:x+2160,z:z+65,y:a.y,theta:a.theta},a.layer,{keepMovement:true});return true;}}
   if(canLower(x,z)){p.x=x;p.z=z;p.y=(prior.extra?.(x,z)??.13)+M.eye;}
  }return true;
 }
 function finishJourney(){journey=null;journeyPanel.hidden=true;delete document.body.dataset.worldJourney;visitLower();}
 function startJourney(){
  stop();M.clearMovement();M.babelLibrary?.stop?.();M.escherDepth?.stop?.();
  const from=M.camera.position.clone(),destination=lowerPhysical({...lowerArrival,y:.13+M.eye}),points=[from,new T.Vector3(-180,120,-400),new T.Vector3(-720,20,-160),new T.Vector3(-720,-180,-160),new T.Vector3(destination.x,destination.y,destination.z)];
  journey={start:performance.now(),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:7600,path:new T.CatmullRomCurve3(points),from:M.camera.quaternion.clone()};journeyPanel.hidden=false;document.body.dataset.worldJourney='true';return true;
 }
 function travelFromPond(){
  const src=window.CITY_CONFIG?.pondTransitionVideo;if(!src)return startJourney();
  M.clearMovement();const dialog=el('dialog');dialog.className='pond-transition-video';const player=el('video');player.src=new URL(src,location.href).href;player.controls=true;player.autoplay=true;player.playsInline=true;const skip=button('Continue to the other face',()=>{player.pause();dialog.close();dialog.remove();finishJourney();});dialog.append(player,skip);document.body.append(dialog);player.addEventListener('ended',()=>skip.click(),{once:true});dialog.addEventListener('cancel',()=>{player.pause();dialog.remove();},{once:true});dialog.showModal();player.play()?.catch(()=>{});video=dialog;return true;
 }
 function prepareCamera(cam){
  if(journey){const q=journey.duration?Math.min(1,(performance.now()-journey.start)/journey.duration):1,e=q*q*(3-2*q),pos=journey.path.getPoint(e);cam.position.copy(pos);cam.up.set(0,q<.5?1:-1,0);cam.lookAt(q<.5?new T.Vector3(0,-10,0):new T.Vector3(-200,-98,0));if(q<.16)cam.quaternion.slerpQuaternions(journey.from,cam.quaternion,q/.16);cam.near=.08;cam.far=5000;cam.updateProjectionMatrix();cam.updateMatrixWorld(true);if(q===1){finishJourney();cam.position.set(lowerPhysical(M.player).x,lowerPhysical(M.player).y,lowerPhysical(M.player).z);cam.rotation.set(M.player.pitch,M.player.yaw,0,'YXZ');cam.quaternion.premultiply(flipQ);cam.updateMatrixWorld(true);}return;}
  if(M.mode==='city'&&isLowerCoordinate(M.player)){cam.position.applyMatrix4(frame);cam.quaternion.premultiply(flipQ);cam.up.set(0,-1,0);}
  else if(M.mode==='overview'&&section==='lower'){cam.position.set(cam.position.x,-96-Math.abs(cam.position.y),-cam.position.z);cam.up.set(0,-1,0);cam.lookAt(0,-96,0);}
  else if(M.mode==='overview'&&section==='section'){
   const angle=Math.atan2(cam.position.x,cam.position.z),oldFov=cam.fov*Math.PI/180,oldHF=2*Math.atan(Math.tan(oldFov/2)*cam.aspect),base=W.radius*1.12/Math.sin(Math.min(oldFov,oldHF)/2),zoom=Math.max(.65,Math.min(1.6,cam.position.length()/base)),distance=570/(Math.tan(18*Math.PI/180)*cam.aspect)*1.10*zoom;cam.fov=36;cam.position.set(Math.sin(angle)*distance,170,Math.cos(angle)*distance);cam.up.set(0,1,0);cam.lookAt(0,-45,0);cam.near=1;cam.far=5000;cam.updateProjectionMatrix();
  }
  if(turning){const t=turning.duration?Math.min(1,(performance.now()-turning.start)/turning.duration):1,e=t*t*(3-2*t);cam.position.lerpVectors(turning.from,cam.position,e);cam.quaternion.slerpQuaternions(turning.qfrom,cam.quaternion,e);if(t===1)turning=null;}
  cam.updateMatrixWorld(true);
 }
 function interact(){return false;}
 function update(...args){
  restoreCulling();prior.update(...args);if(disposed)return;const time=args[1]||0;built.updateOcean(time,{reduced:globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false,fog:M.scene.fog});const structure=M.scene.children.length+':'+M.city.targets.length;if(structure!==lastStructure){scan();lastStructure=structure;}for(const r of records){r.wrapper.matrix.copy(r.parent.matrixWorld);r.wrapper.matrixWorldNeedsUpdate=true;if(r.node.name==='Graveyard world · independent ground')r.node.visible=false;}
  if(route&&M.mode!=='city')stop();const lowerActive=lowerPlayer(),under=M.mode==='city'&&(route||M.escherDepth?.active),paused=!!document.querySelector('dialog[open],#reader-panel:not([hidden])');
  built.lamps.visible=!!journey||lowerActive||M.mode==='overview'&&section!=='upper';upper.lamps.visible=!!route&&route.side==='upper'||M.mode==='overview'&&section==='section';lower.lamps.visible=lowerActive||M.mode==='overview'&&section!=='upper';built.shell.material.transparent=M.mode==='overview'&&section==='section';built.shell.material.opacity=built.shell.material.transparent?.65:1;built.shell.material.depthWrite=!built.shell.material.transparent;
  if(under&&!lightRestore){lightRestore=[];M.scene.traverse(o=>{if((o.isHemisphereLight||o.isDirectionalLight)&&!built.lamps.children.includes(o)){lightRestore.push([o,o.intensity]);o.intensity*=.28;}});}else if(!under)restoreLight();
  if(M.escherDepth?.active)panel.hidden=true;else{panel.hidden=!!journey||!(route||lowerActive)||paused;const place=M.city.region(M.player.x,M.player.z);title.textContent=turning?'Turning between the two faces':route?'Zarathustra · the through-gallery':place.title||'The other face of the world';detail.textContent=route?route.side==='upper'?'Below Babel · follow the stone coils, or take the Escher passage at the open landing.':'The gallery opens onto the lower face. Enter the circular Mathematics reading hall; the working wing and garden are through the west doorway.':place.id==='lower-bridge'?'The timber bridge carries the meadow circuit across the inlet. Follow it toward the ocean overlook or return along the loop to the campus.':place.id==='lower-shore'?'The shore promenade continues around this face. Follow the circuit back to Mathematics, Ramsey and the garden.':place.id==='mathematics'?(M.mathWingStairs?.built?'To leave the working wing, use the walking stairs or the original lift to reach the ground floor, then follow the central hall to the open front doors.':'To leave the working wing, return through the central hall to the open front doors. From an upper floor, take the lift down to the ground floor.'):'The meadow circuit connects the Faculty, Ramsey and the garden to the inlet and the ocean. The return door near the campus leads to the upper city.';tour.hidden=!route;}
  views.hidden=M.mode!=='overview';enter.hidden=section!=='lower';document.body.dataset.worldFace=lowerActive?'lower':under?'interior':'upper';
  if(window.CITY_GRAVEYARD){window.CITY_GRAVEYARD.drawActiveMap=drawLowerMap;}
 }
 function drawLowerMap(ctx){
  if(!lowerPlayer())return originalMap?.(ctx)||false;const scale=.215,cx=130,cz=130,px=x=>cx+x*scale,pz=z=>cz+z*scale;
  ctx.clearRect(0,0,260,260);ctx.fillStyle='#354e51';ctx.fillRect(0,0,260,260);
  ctx.strokeStyle='#a9bfac';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cz,570*scale,0,Math.PI*2);ctx.stroke();
  for(let i=1;i<LOWER_INLET.points.length;i++){const a=LOWER_INLET.points[i-1],b=LOWER_INLET.points[i];ctx.strokeStyle='#78b0b4';ctx.lineWidth=Math.max(1,(a.width+b.width)/2*scale);ctx.beginPath();ctx.moveTo(px(a.x),pz(a.z));ctx.lineTo(px(b.x),pz(b.z));ctx.stroke();}
  for(const path of built.lowerPaths){ctx.strokeStyle=path.id==='meadow-circuit'?'#aebd91':'#c7b994';ctx.lineWidth=Math.max(1,path.width*scale);ctx.beginPath();path.points.forEach(([x,z],i)=>ctx[i?'lineTo':'moveTo'](px(x),pz(z)));ctx.stroke();}
  ctx.strokeStyle='#c7b479';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cz,58*scale,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#d9e4cf';ctx.font='10px Tahoma';ctx.textAlign='center';ctx.fillText('The other face',130,14);
  const pin=(x,z,label,lx,lz)=>{ctx.strokeStyle='#bfc7ad';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(px(x),pz(z));ctx.lineTo(lx,lz-4);ctx.stroke();ctx.fillStyle='#e2debc';ctx.fillRect(px(x)-2,pz(z)-2,4,4);ctx.fillText(label,lx,lz);};
  pin(0,0,'Faculty / gallery',140,108);let q=lowerLocal(layout.mathematics);pin(q.x,q.z,'Mathematics',91,157);q=lowerLocal({x:layout.mathematics.x-41,z:layout.mathematics.z+2});pin(q.x,q.z,'Ramsey',52,142);q=lowerLocal(layout.objects);pin(q.x,q.z,'Objects',47,95);q=lowerLocal({x:layout.x+60,z:layout.z});pin(q.x,q.z,'Return door',41,120);
  const shore=built.lowerLandscape?.anchors.overlook;if(shore)pin(shore.x,shore.z,'Shore',229,183);
  const point=lowerLocal(M.player);ctx.fillStyle='#f1c469';ctx.beginPath();ctx.arc(px(point.x),pz(point.z),3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f1c469';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px(point.x),pz(point.z));ctx.lineTo(px(point.x-Math.sin(M.player.yaw)*24),pz(point.z-Math.cos(M.player.yaw)*24));ctx.stroke();return true;
 }
 function prepareScene(){const lowerView=lowerPlayer(),interior=!!route||M.escherDepth?.active||M.mode==='city'&&M.babelLibrary?.active&&M.player.y-M.eye<=-11.5,sectionView=M.mode==='overview'&&section!=='upper',cutaway=M.mode==='overview'&&section==='section';if(M.renderer){if(cutaway){if(M.scene.fog&&sectionFog===null){sectionFog={fog:M.scene.fog,density:M.scene.fog.density};M.scene.fog.density=.00015;}const a=Math.atan2(M.camera.position.x,M.camera.position.z);sectionPlane.normal.set(-Math.sin(a),0,-Math.cos(a));sectionPlane.constant=0;built.sectionCut.visible=true;built.sectionCut.rotation.y=a;interiorPlane.normal.copy(sectionPlane.normal);interiorPlane.constant=0;M.renderer.clippingPlanes=[sectionPlane];M.renderer.localClippingEnabled=true;}else{built.sectionCut.visible=false;if(sectionFog){sectionFog.fog.density=sectionFog.density;sectionFog=null;}M.renderer.clippingPlanes=clippingBefore;M.renderer.localClippingEnabled=localClippingBefore;}setSectionMaterials(cutaway);}if(cutaway&&M.origamiHouse?.coast?.sea){const sea=M.origamiHouse.coast.sea;culled.set(sea,sea.visible);sea.visible=false;}if(lowerView||interior){for(const node of M.scene.children){if(node===built.group||node===M.lantern||node.isLight||interior&&(node===M.babelLibrary?.built?.group||node===M.escherDepth?.built?.group))continue;culled.set(node,node.visible);node.visible=false;}}built.lowerFrame.visible=!!journey||lowerView||sectionView;if(M.mode==='city'&&isLowerCoordinate(M.player)&&M.lantern){M.lantern.position.applyMatrix4(frame);M.lantern.quaternion.premultiply(flipQ);M.lantern.updateMatrixWorld(true);}}
 const api={built,upper,lower,faculty,step,interact,prepareCamera,prepareScene,travelFromPond,visitLower,visitGallery,visitLandscape,overview,scan,canLower,get route(){return route;},get face(){return route?'interior':lowerPlayer()?'lower':'upper';},get lowerRoots(){return records.map(r=>r.node);},enterTunnel(){begin('upper',{x:134,z:115,y:-40,theta:UPPER.spur.theta},'spur');M.player.yaw=Math.PI/2;}};
 M.worldCylinder=api;M.city.update=update;scan();lastStructure=M.scene.children.length+':'+M.city.targets.length;
 if(M.escherDepth)M.escherDepth.setGalleryExit(()=>api.enterTunnel());
 const installed={arrive:M.arrive,can:M.city.canStand,region:M.city.region,extra:M.extraGround,start:M.startExtra};
 addEventListener('pagehide',()=>{disposed=true;if(sectionFog){sectionFog.fog.density=sectionFog.density;sectionFog=null;}restoreCulling();if(M.renderer){M.renderer.clippingPlanes=clippingBefore;M.renderer.localClippingEnabled=localClippingBefore;}setSectionMaterials(false);stop();for(const{node,parent,wrapper,originalVisible}of records.reverse()){if(node.parent){parent.add(node);if(node.name==='Graveyard world · independent ground')node.visible=originalVisible;}wrapper.removeFromParent();}for(const[n,v]of shellVisibility)n.visible=v;for(const t of faculty.targets){const i=M.city.targets.indexOf(t);if(i>=0)M.city.targets.splice(i,1);}faculty.dispose();upper.dispose();lower.dispose();built.dispose();panel.remove();views.remove();sectionButton.remove();mapButton.remove();journeyPanel.remove();video?.querySelector('video')?.pause();video?.remove();if(M.city.update===update)M.city.update=prior.update;if(M.arrive===installed.arrive)M.arrive=prior.arrive;if(M.city.canStand===installed.can)M.city.canStand=prior.can;if(M.city.region===installed.region)M.city.region=prior.region;if(M.extraGround===installed.extra)M.extraGround=prior.extra;if(M.startExtra===installed.start)M.startExtra=prior.start;if(M.worldCylinder===api)delete M.worldCylinder;if(window.CITY_GRAVEYARD)window.CITY_GRAVEYARD.drawActiveMap=originalMap;},{once:true});
 const arrival=new URLSearchParams(globalThis.location?.search||'').get('arrival');if(arrival==='lower-shore')visitLandscape();else if(arrival==='lower-inlet')visitLandscape('inlet');else if(arrival==='lower-face')visitLower();else if(arrival==='through-gallery')visitGallery();else if(arrival==='world-section')overview('section');return api;
}
