import {WING_STAIRS as S,inStairArea,stairSurface,stairBarrier,floorAtFeet,wingStep} from './math-wing-stairs-model.js';
import {buildMathWingStairs} from './math-wing-stairs-scene.js';
const COPY={
 en:['Walking stairs','Follow the flights and turn on each broad landing. The lift remains available.'],
 de:['Begehbare Treppe','Die Treppenläufe verbinden alle Geschosse. Auf dem breiten Podest wenden; der Aufzug bleibt verfügbar.'],
 fa:['پلکان پیوسته','از بازوی پلکان بالا بروید و روی پاگرد پهن بچرخید. آسانسور همچنان در دسترس است.'],
 cs:['Průchozí schodiště','Ramena schodiště propojují všechna patra. Na široké podestě se otočte; výtah zůstává dostupný.']
};
export function installMathWingStairs(M,T,E,{document:doc=globalThis.document}={}){
 let built=null,owners=[],disposed=false,lastFloor=E.activeMathFloor??0,lastGuideBottom=null;const rootStyle=doc?.documentElement?.style,priorGuideBottom=rootStyle?.getPropertyValue('--math-connected-bottom');
 const panel=doc?.createElement('aside'),label=doc?.createElement('strong'),levelLabel=doc?.createElement('bdi'),hint=doc?.createElement('span');if(panel){panel.id='math-wing-stairs-context';panel.hidden=true;panel.setAttribute('role','status');panel.setAttribute('aria-live','polite');levelLabel.dir='ltr';panel.append(label,levelLabel,hint);doc.body.append(panel);}
 const language=()=>COPY[globalThis.CITY_I18N?.lang]?globalThis.CITY_I18N.lang:'en';
 const transform=()=>E.transforms?.mathematics;
 const local=()=>{const t=transform();return{x:(M.player.x-t.x)/t.scale,z:(M.player.z-t.z)/t.scale,y:(M.player.y-t.y)/t.scale};};
 function clear(){built?.dispose();built=null;}
 function sync(){const models=E.mathModels;if(disposed||models?.length===8&&models.every((m,i)=>m===owners[i]))return;clear();owners=models?.slice()||[];const t=transform();if(!t||![t.x,t.y,t.z,t.scale].every(Number.isFinite)||t.scale<=0)return;built=buildMathWingStairs(T,models);if(built){built.group.position.set(t.x,t.y,t.z);built.group.scale.setScalar(t.scale);E.group.add(built.group);}}
 function here(p=local()){return !!built&&M.mode==='city'&&p.y-M.eye/transform().scale>=-.21&&p.y-M.eye/transform().scale<=28.21&&inStairArea(p.x,p.z,.55);}
 const paused=()=>!!doc?.querySelector('dialog[open],#reader-panel:not([hidden]),#exhibit-panel:not([hidden]),#map-panel:not([hidden])');
 function render(){const lang=language();built?.setLanguage(lang);if(rootStyle&&globalThis.matchMedia?.('(max-width:600px)').matches){const guide=doc.getElementById('connected-journey'),bottom=Math.max(140,guide&&!guide.hidden?guide.getBoundingClientRect().bottom+12:140)+'px';if(bottom!==lastGuideBottom){rootStyle.setProperty('--math-connected-bottom',bottom);lastGuideBottom=bottom;}}if(!panel)return;const t=transform(),p=t?local():null,show=p&&here(p)&&!paused();panel.hidden=!show;if(!show)return;const c=COPY[lang],feet=p.y-M.eye/t.scale,floor=floorAtFeet(feet),low=Math.max(0,Math.min(6,Math.floor(feet/4))),text=floor===null?(low+1)+' ↔ '+(low+2):(floor+1)+' / 8';panel.lang=lang;panel.dir=lang==='fa'?'rtl':'ltr';if(label.textContent!==c[0]+' · ')label.textContent=c[0]+' · ';if(levelLabel.textContent!==text)levelLabel.textContent=text;if(hint.textContent!==' — '+c[1])hint.textContent=' — '+c[1];}
 function step(dt,input={}){
  sync();if(!built)return false;const t=transform(),p=local();if(!here(p))return false;if(paused()||doc?.hidden)return true;
  const delta=Math.min(.1,Math.max(0,dt)),n=Math.max(1,Math.hypot(input.forward||0,input.strafe||0)),speed=(input.boost?3.2:2.5)*delta;
  M.player.yaw+=(input.turn||0)*delta*1.65;const dx=(-Math.sin(M.player.yaw)*(input.forward||0)+Math.cos(M.player.yaw)*(input.strafe||0))*speed/n/t.scale,dz=(-Math.cos(M.player.yaw)*(input.forward||0)-Math.sin(M.player.yaw)*(input.strafe||0))*speed/n/t.scale;
  const result=wingStep(p,dx,dz,{eye:M.eye/t.scale,canStand:(x,z,floor)=>E.canStand(t.x+x*t.scale,t.z+z*t.scale,{y:t.y+floor*4*t.scale,floor})});
  M.player.x=t.x+p.x*t.scale;M.player.z=t.z+p.z*t.scale;M.player.y=t.y+p.y*t.scale;
  if(result.floor!==null&&result.floor!==E.activeMathFloor){E.selectMathFloor(result.floor);lastFloor=result.floor;}else if(result.floor!==null)lastFloor=result.floor;
  render();return true;
 }
 const old={region:M.city.region,can:M.city.canStand,extra:M.extraGround,update:M.city.update,arrive:M.arrive};
 const region=(x,z)=>{if(built&&M.mode==='city'){const t=transform(),p=local(),feet=p.y-M.eye/t.scale;if(inStairArea((x-t.x)/t.scale,(z-t.z)/t.scale)&&floorAtFeet(feet)===null&&stairSurface(p.x,p.z,feet))return{id:'mathematics-stairs',cityId:'mathematics',title:COPY[language()][0],floor:lastFloor,inside:true};}return old.region(x,z);};
 const extra=(x,z)=>{if(built&&M.mode==='city'){const t=transform(),p=local(),s=stairSurface((x-t.x)/t.scale,(z-t.z)/t.scale,p.y-M.eye/t.scale);if(s&&here(p))return t.y+s.y*t.scale;}return old.extra?.(x,z);};
 const can=(x,z)=>{if(built&&M.mode==='city'){const t=transform(),q={x:(x-t.x)/t.scale,z:(z-t.z)/t.scale},p=local(),feet=p.y-M.eye/t.scale,s=stairSurface(q.x,q.z,feet);if(stairBarrier(q.x,q.z,feet))return false;if(inStairArea(q.x,q.z)&&s)return E.canStand(x,z,{floor:lastFloor,y:t.y+lastFloor*4*t.scale});if(q.x>S.opening.minX&&q.x<S.opening.maxX&&q.z>S.opening.minZ&&q.z<S.opening.maxZ)return false;}return old.can(x,z);};
 const arrive=p=>{if(built&&p&&Number.isFinite(p.y)){const t=transform(),x=(p.x-t.x)/t.scale,z=(p.z-t.z)/t.scale,y=(p.y-t.y)/t.scale,k=floorAtFeet(y);if(k!==null&&x>S.opening.minX&&x<S.opening.maxX&&z>S.opening.minZ&&z<S.opening.maxZ&&!stairSurface(x,z,y,{tolerance:.025})){p={...p,x:t.x+5.3*t.scale,z:t.z+6.9*t.scale};if(E.activeMathFloor!==k)E.selectMathFloor(k);lastFloor=k;}}return old.arrive.call(M,p);};
 const update=(...args)=>{old.update(...args);sync();render();};M.city.region=region;M.city.canStand=can;M.extraGround=extra;M.city.update=update;M.arrive=arrive;
 function dispose(){if(disposed)return;disposed=true;clear();panel?.remove();if(rootStyle&&rootStyle.getPropertyValue('--math-connected-bottom')===lastGuideBottom){if(priorGuideBottom)rootStyle.setProperty('--math-connected-bottom',priorGuideBottom);else rootStyle.removeProperty('--math-connected-bottom');}globalThis.removeEventListener?.('city-language',render);if(M.city.region===region)M.city.region=old.region;if(M.city.canStand===can)M.city.canStand=old.can;if(M.extraGround===extra)M.extraGround=old.extra;if(M.city.update===update)M.city.update=old.update;if(M.arrive===arrive)M.arrive=old.arrive;if(M.mathWingStairs===api)delete M.mathWingStairs;}
 const api={step,sync,dispose,get built(){return built;},get floor(){return lastFloor;}};sync();globalThis.addEventListener?.('city-language',render);globalThis.addEventListener?.('pagehide',dispose,{once:true});return api;
}
