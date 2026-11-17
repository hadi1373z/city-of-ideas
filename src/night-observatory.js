import {NIGHT_OBSERVATORY as C,observatorySurface,walkObservatory} from './night-observatory-model.js?v=city-night-20261117';
import {buildNightObservatory} from './night-observatory-scene.js?v=city-night-20261117';
import {WORLD_CYLINDER as W,isLowerCoordinate,lowerLocal} from './world-cylinder-model.js?v=city-night-20261117';

export function installNightObservatory(M,T){
 const world=M.worldCylinder;if(!world?.lower?.group)throw Error('Install the lower gallery before the central observatory.');
 const built=buildNightObservatory(T);world.lower.group.add(built.group);M.city.targets.push(...built.targets);
 const hidden=[];world.faculty.group.traverse(o=>{if(o.name==='Annular timber roof · open central oculus'){hidden.push([o,o.visible]);o.visible=false;}});
 const old={update:M.city.update,region:M.city.region,arrive:M.arrive,start:M.startExtra};let active=false,disposed=false;
 const doc=globalThis.document,panel=doc.createElement('details');panel.id='night-observatory-route';panel.lang='en';panel.hidden=true;
 const summary=doc.createElement('summary');summary.textContent='The central observatory';const detail=doc.createElement('p');detail.textContent='The stair continues above the four reading floors. Walk across the inner bridge to the telescope; return down the same stone steps.';
 const close=doc.createElement('button');close.type='button';close.className='observatory-route-close';close.textContent='×';close.setAttribute('aria-label','Close observatory guidance');let dismissed=false;close.onclick=e=>{e?.preventDefault?.();e?.stopPropagation?.();dismissed=true;panel.hidden=true;};summary.append(close);panel.append(summary,detail);doc.body.append(panel);
 const station={x:W.lowerOrigin.x+C.station.x,y:C.deckY,z:W.lowerOrigin.z+C.station.z};
 const nearTelescope=()=>M.mode==='city'&&isLowerCoordinate(M.player)&&Math.abs(M.player.y-M.eye-C.deckY)<.35&&Math.hypot(M.player.x-station.x,M.player.z-station.z)<=4;
 const paused=()=>doc.hidden||!!doc.querySelector('dialog[open],#reader-panel:not([hidden]),#exhibit-panel:not([hidden]),#map-panel:not([hidden])');
 function stop(){active=false;panel.hidden=true;delete doc.body.dataset.nightObservatory;}
 function render(){panel.hidden=!active||dismissed||paused();built.lamps.visible=M.mode==='city'&&isLowerCoordinate(M.player)&&M.player.y-M.eye>C.baseY+1&&Math.hypot(M.player.x-W.lowerOrigin.x,M.player.z-W.lowerOrigin.z)<24;}
 function step(dt,input={}){
  if(disposed||M.mode!=='city'||!isLowerCoordinate(M.player)){stop();return false;}
  const p=M.player,q=lowerLocal(p),feet=p.y-M.eye,s=observatorySurface(q.x,q.z,feet,active?{lastTheta:p.observatoryTheta,layer:p.observatoryLayer}:{});
  if(!s||!active&&s.layer==='approach'){stop();return false;}
  const tick=Math.max(0,Math.min(.1,dt)),yaw=p.yaw+(input.turn||0)*tick*1.65,n=Math.max(1,Math.hypot(input.forward||0,input.strafe||0)),speed=(input.boost?6:3.3)*tick,dx=(-Math.sin(yaw)*(input.forward||0)+Math.cos(yaw)*(input.strafe||0))/n*speed,dz=(-Math.cos(yaw)*(input.forward||0)-Math.sin(yaw)*(input.strafe||0))/n*speed;
  // Positive Z at the shared y12.13 endpoint descends the existing paper stair.
  if(feet<=C.baseY+.2&&q.x>14&&q.x<18.1&&q.z>=-.25&&q.z+dz>0&&dz>0){stop();delete p.observatoryTheta;delete p.observatoryLayer;Object.assign(p,{paperTheta:Math.PI*2,paperLayer:'stair',paperFloor:null});return false;}
  if(!active){world.releaseGalleryRoute?.();M.paperGallery?.stop?.();active=true;dismissed=false;Object.assign(p,{observatoryTheta:s.theta,observatoryLayer:s.layer});doc.body.dataset.nightObservatory='true';}
  if(paused()){render();return true;}
  p.yaw=yaw;const local={...q,y:p.y,observatoryTheta:p.observatoryTheta,observatoryLayer:p.observatoryLayer};walkObservatory(local,dx,dz,{eye:M.eye});Object.assign(p,{x:local.x+W.lowerOrigin.x,z:local.z+W.lowerOrigin.z,y:local.y,observatoryTheta:local.observatoryTheta,observatoryLayer:local.observatoryLayer});
  if(local.observatoryLayer==='approach'&&Math.hypot(local.x,local.z)>17.72){Object.assign(p,{paperTheta:Math.PI*2,paperLayer:'bridge',paperFloor:3});stop();}
  render();return true;
 }
 const arrive=p=>{stop();delete M.player.observatoryTheta;delete M.player.observatoryLayer;return old.arrive.call(M,p);};
 const region=(x,z)=>active?{id:'night-observatory',title:Math.abs(M.player.y-M.eye-C.deckY)<.4?'The central observatory · under the glass sky':'The observatory stair',inside:true}:old.region(x,z);
 const update=(...args)=>{old.update(...args);if(active&&(M.mode!=='city'||!isLowerCoordinate(M.player)))stop();render();};
 function visit(where='entrance'){M.clearMovement();M.setCityMode();if(where==='deck')M.arrive({x:W.lowerOrigin.x+3,z:W.lowerOrigin.z-.5,y:C.deckY,yaw:0,pitch:.32});else M.arrive({x:W.lowerOrigin.x+22,z:W.lowerOrigin.z,y:C.baseY,yaw:Math.PI/2,pitch:.12});step(0,{});return true;}
 const start=id=>id==='night-observatory'?visit():old.start?.(id);
 function lookAtDirection(direction){if(!nearTelescope())return false;const d=new T.Vector3(direction.x,direction.y,direction.z);if(!Number.isFinite(d.lengthSq())||d.lengthSq()<1e-9||d.y<0)return false;d.normalize();M.clearMovement();M.player.yaw=Math.atan2(-d.x,-d.z);M.player.pitch=Math.max(-1.2,Math.min(1.45,Math.asin(d.y)));built.pointTelescope(d);return true;}
 M.arrive=arrive;M.city.region=region;M.city.update=update;M.startExtra=start;
 const api={built,step,stop,visit,station,deckY:C.deckY,lookAtDirection,get active(){return active;},get nearTelescope(){return nearTelescope();},get canStudy(){return nearTelescope();},dispose(){if(disposed)return;disposed=true;stop();for(const[n,v]of hidden)n.visible=v;for(const target of built.targets){const i=M.city.targets.indexOf(target);if(i>=0)M.city.targets.splice(i,1);}if(M.arrive===arrive)M.arrive=old.arrive;if(M.city.region===region)M.city.region=old.region;if(M.city.update===update)M.city.update=old.update;if(M.startExtra===start)M.startExtra=old.start;built.dispose();panel.remove();if(M.nightObservatory===api)delete M.nightObservatory;}};
 M.nightObservatory=api;addEventListener('pagehide',api.dispose,{once:true});return api;
}
