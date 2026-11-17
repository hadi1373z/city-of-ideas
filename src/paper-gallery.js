import {PAPER_GALLERY_FLOORS as FLOORS,paperGallerySlots,paperGallerySurface,paperGalleryGroundHandoff,walkPaperGallery} from './paper-gallery-model.js?v=city-night-20261117';
import {buildPaperGallery} from './paper-gallery-scene.js?v=city-night-20261117';
import {WORLD_CYLINDER as W,isLowerCoordinate,lowerLocal} from './world-cylinder-model.js?v=city-night-20261117';

export function installPaperGallery(M,T){
 const world=M.worldCylinder;if(!world?.lower?.group)throw Error('Install the lower Mathematics gallery before its mezzanines.');
 const built=buildPaperGallery(T);world.lower.group.add(built.group);const slots=paperGallerySlots(),oldSlots=world.lower.paperSlots;world.lower.paperSlots=slots;
 const old={update:M.city.update,region:M.city.region,arrive:M.arrive,start:M.startExtra};let active=false,disposed=false,lastPlace='';
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;},panel=el('details');panel.id='paper-gallery-guide';panel.lang='en';panel.hidden=true;const summary=el('summary'),title=el('span'),hint=el('p'),index=el('ol');summary.append(title);for(const f of FLOORS)index.append(el('li','Floor '+(f.index+1)+' · '+f.name+' — '+f.question));const look=el('button','Look toward this floor’s stair');look.type='button';look.onclick=()=>{const s=surface();if(s?.floor==null)return;const f=FLOORS[s.floor];M.clearMovement();M.pointToward?.({x:W.lowerOrigin.x+19*Math.cos(f.angle),z:W.lowerOrigin.z+19*Math.sin(f.angle)});M.player.pitch=-.12;};panel.append(summary,hint,index,look);document.body.append(panel);
 const paused=()=>document.hidden||!!document.querySelector('dialog[open],#reader-panel:not([hidden]),#exhibit-panel:not([hidden]),#map-panel:not([hidden])');
 function surface(){const q=lowerLocal(M.player);return paperGallerySurface(q.x,q.z,M.player.y-M.eye,{lastTheta:M.player.paperTheta??null,layer:M.player.paperLayer??null,floor:M.player.paperFloor??null});}
 function place(){const s=surface();if(!s)return null;if(s.floor!=null){const f=FLOORS[s.floor];return{key:f.id,title:'Floor '+(f.index+1)+' / 4 · '+f.name,hint:'Original first pages remain on display in this collection. Walk to a monitor to read its source and question. The shared central stair connects all four floors; the west exit is on Floor 1.',floor:s.floor};}const flight=Math.min(2,Math.floor(s.theta/(2*Math.PI/3)));return{key:'stair-'+flight,title:'Mathematics · the collection stair',hint:'Between Floor '+(flight+1)+' and Floor '+(flight+2)+'. Follow the stone treads to the next broad radial landing.',floor:null};}
 function stop(){active=false;panel.hidden=true;delete document.body.dataset.paperGallery;}
 function render(){const p=place();panel.hidden=!active||!p||paused();if(!p)return;if(lastPlace!==p.key){title.textContent=p.title;hint.textContent=p.hint;panel.open=false;lastPlace=p.key;}look.disabled=p.floor==null;}
 function step(dt,input={}){
  if(disposed||M.mode!=='city'||!isLowerCoordinate(M.player)){stop();return false;}const p=M.player,q=lowerLocal(p),feet=p.y-M.eye;
  const s=paperGallerySurface(q.x,q.z,feet,active?{lastTheta:p.paperTheta,layer:p.paperLayer,floor:p.paperFloor}:{});
  if(!s||paperGalleryGroundHandoff(q.x,q.z,feet)){stop();return false;}
  const tick=Math.max(0,Math.min(.1,dt)),yaw=p.yaw+(input.turn||0)*tick*1.65,n=Math.max(1,Math.hypot(input.forward||0,input.strafe||0)),speed=(input.boost?7:3.5)*tick,dx=(-Math.sin(yaw)*(input.forward||0)+Math.cos(yaw)*(input.strafe||0))/n*speed,dz=(-Math.cos(yaw)*(input.forward||0)-Math.sin(yaw)*(input.strafe||0))/n*speed;
  // Positive Z at the east ground landing continues DOWN the original shared
  // gallery. Never capture that old flight or snap its first tread back up.
  if(feet<=.28&&q.x>14&&q.x<18.1&&q.z>=-.25&&q.z+dz>0&&dz>0){stop();return false;}
  if(!active){world.releaseGalleryRoute?.();active=true;Object.assign(p,{paperTheta:s.theta,paperLayer:s.layer,paperFloor:s.floor});document.body.dataset.paperGallery='true';}
  if(paused()){render();return true;}
  const local={...q,y:p.y,paperTheta:p.paperTheta,paperLayer:p.paperLayer,paperFloor:p.paperFloor};p.yaw=yaw;walkPaperGallery(local,dx,dz,{eye:M.eye,canStand:(x,z,y)=>world.faculty?.canStand(x,z,y)!==false&&M.paperMonitors?.canStand(x,z,y)!==false&&M.mathematicalSculptures?.canStand(x,z,y)!==false});Object.assign(p,{x:local.x+W.lowerOrigin.x,z:local.z+W.lowerOrigin.z,y:local.y,paperTheta:local.paperTheta,paperLayer:local.paperLayer,paperFloor:local.paperFloor});
  const after=lowerLocal(p);if(paperGalleryGroundHandoff(after.x,after.z,p.y-M.eye))stop();render();return true;
 }
 const arrive=p=>{stop();delete M.player.paperTheta;delete M.player.paperLayer;delete M.player.paperFloor;return old.arrive.call(M,p);};
 const region=(x,z)=>{const p=active&&place();return p?{id:'paper-gallery',title:p.title,inside:true,floor:p.floor}:old.region(x,z);};
 const update=(...args)=>{old.update(...args);if(active&&(M.mode!=='city'||!isLowerCoordinate(M.player)))stop();const q=lowerLocal(M.player),lower=isLowerCoordinate(M.player),floor=Math.max(0,Math.min(3,Math.round((M.player.y-M.eye-.13)/4)));built.setLightFloor(lower?(Math.hypot(q.x,q.z)<64?floor:null):0);render();};
 function visit(id='foundations'){const f=FLOORS.find(f=>f.id===id);if(!f)return false;M.clearMovement();M.setCityMode();M.arrive({x:W.lowerOrigin.x+26*Math.cos(f.angle),z:W.lowerOrigin.z+26*Math.sin(f.angle),y:f.y,yaw:-f.angle-Math.PI/2,pitch:0});step(0,{});return true;}
 const start=id=>typeof id==='string'&&id.startsWith('paper-gallery:')?visit(id.slice('paper-gallery:'.length)):old.start?.(id);
 M.arrive=arrive;M.city.region=region;M.city.update=update;M.startExtra=start;
 const api={built,slots,floors:FLOORS,step,stop,visit,get active(){return active;},get place(){return place();},dispose(){if(disposed)return;disposed=true;stop();if(M.arrive===arrive)M.arrive=old.arrive;if(M.city.region===region)M.city.region=old.region;if(M.city.update===update)M.city.update=old.update;if(M.startExtra===start)M.startExtra=old.start;if(world.lower.paperSlots===slots)world.lower.paperSlots=oldSlots;built.dispose();panel.remove();if(M.paperGallery===api)delete M.paperGallery;}};M.paperGallery=api;addEventListener('pagehide',api.dispose,{once:true});return api;
}
