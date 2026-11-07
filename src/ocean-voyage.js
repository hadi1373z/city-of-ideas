import {createVoyage,VOYAGE,POEMS,VOYAGE_COPY,poemAt} from './ocean-voyage-model.js';
import {buildOceanBoat} from './ocean-voyage-scene.js';
export function installOceanVoyage(M,T){
 const voyage=createVoyage(),s=voyage.state,built=buildOceanBoat(T);M.scene.add(built.group);M.city.targets.push(built.vessel);
 const lang=()=>window.CITY_I18N.lang,w=()=>VOYAGE_COPY[lang()]||VOYAGE_COPY.en,el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;},button=(text,fn)=>{const n=el('button',text);n.type='button';n.onclick=fn;return n;};
 const boardButton=button('',board);boardButton.id='ocean-board';boardButton.className='glass';boardButton.hidden=true;document.body.append(boardButton);
 const panel=el('aside');panel.id='ocean-voyage-controls';panel.hidden=true;panel.setAttribute('aria-label',w().title);const title=el('strong'),distance=el('span'),hint=el('p'),edge=el('p'),actions=el('div'),pause=button('',()=>{s.paused=!s.paused;M.clearMovement();locale();}),poems=button('',()=>{poemsOn=!poemsOn;locale();}),back=button('',returnShore),photo=button('',()=>document.getElementById('take-photo')?.click());photo.textContent='◉';photo.setAttribute('aria-label','Take photo · L1');const left=button('←',()=>{}),right=button('→',()=>{});actions.append(left,pause,poems,photo,back,right);panel.append(title,distance,hint,edge,actions);document.body.append(panel);
 const veil=el('section');veil.id='ocean-poem-veil';veil.hidden=true;veil.setAttribute('aria-label',w().credit);const poemTitle=el('small'),stanza=el('p'),credit=el('small');veil.append(poemTitle,stanza,credit);document.body.append(veil);let poemsOn=true,touch=0,lastPoem='',lastText='',lastSecond=-1,disposed=false;
 const launch=button('',visitShore),mapLaunch=button('',visitShore);launch.className=mapLaunch.className='glass';document.querySelector('.welcome-secondary')?.append(launch);document.querySelector('.map-directions')?.append(mapLaunch);
 const near=()=>M.mode==='city'&&Math.hypot(M.player.x-VOYAGE.shore.x,M.player.z-VOYAGE.shore.z)<15;
 const old={update:M.city.update,region:M.city.region,target:M.city.targetInfo,show:M.showExtra,start:M.startExtra,arrive:M.arrive};
 function seat(){return{x:s.x+Math.sin(s.yaw)*6.2+Math.cos(s.yaw)*1.6,z:s.z+Math.cos(s.yaw)*6.2-Math.sin(s.yaw)*1.6};}
 function putPlayer(){const p=seat(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;M.player.x=p.x;M.player.z=p.z;M.player.y=3.0+(reduced?0:Math.sin(s.time*1.05)*.035);}
 function board(){if(s.active||!near())return false;M.cancelActivity?.();M.clearMovement();voyage.board();M.player.yaw=s.yaw;M.player.pitch=-.05;putPlayer();document.body.dataset.oceanVoyage='sailing';locale();return true;}
 function stop(){voyage.reset();touch=0;delete document.body.dataset.oceanVoyage;veil.hidden=panel.hidden=true;built.update(s);}
 function returnShore(){stop();M.clearMovement();old.arrive.call(M,VOYAGE.shore);M.player.pitch=-.04;}
 function visitShore(){M.arrive(VOYAGE.shore);M.player.pitch=-.04;}
 M.arrive=p=>{if(s.active)stop();return old.arrive.call(M,p);};
 function step(dt,input={}){
  if(!s.active)return false;const p=seat();if(M.mode!=='city'||Math.hypot(M.player.x-p.x,M.player.z-p.z)>12){stop();return false;}
  const yaw=s.yaw;voyage.step(dt,{forward:input.forward,steer:(input.strafe||0)-(input.turn||0)+touch,boost:input.boost});M.player.yaw+=s.yaw-yaw;putPlayer();return true;
 }
 function interact(){return s.active?true:near()?board():false;}
 const key=e=>{if(e.code!=='KeyE'||e.repeat||document.querySelector('dialog[open]')||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName))return;if(s.active||near()){e.preventDefault();e.stopImmediatePropagation();if(!s.active)board();}};addEventListener('keydown',key,true);
 for(const[n,sign]of[[left,-1],[right,1]]){n.addEventListener('pointerdown',e=>{e.preventDefault();touch=sign;n.setPointerCapture?.(e.pointerId);});for(const event of['pointerup','pointercancel','lostpointercapture'])n.addEventListener(event,()=>touch=0);}
 const blur=()=>{touch=0;};addEventListener('blur',blur);
 function locale(){const c=w();panel.setAttribute('aria-label',c.title);launch.textContent=mapLaunch.textContent=c.visit;boardButton.textContent=c.board;title.textContent=c.sailing;hint.textContent=c.controls;back.textContent=c.return;pause.textContent=s.paused?c.resume:c.pause;pause.setAttribute('aria-pressed',String(s.paused));poems.textContent=c.poems+' · '+(poemsOn?c.on:c.off);poems.setAttribute('aria-pressed',String(poemsOn));photo.setAttribute('aria-label',c.photo);left.setAttribute('aria-label',c.steerLeft);right.setAttribute('aria-label',c.steerRight);panel.dir=veil.dir=lang()==='fa'?'rtl':'ltr';credit.textContent=c.credit;veil.setAttribute('aria-label',c.credit);lastPoem='';lastSecond=-1;}
 addEventListener('city-language',locale);locale();
 M.city.region=(x,z)=>s.active&&Math.hypot(x-s.x,z-s.z)<16?{id:'paper-sea',title:w().title,inside:false}:old.region(x,z);
 M.city.targetInfo=d=>d?.oceanBoat?{kind:'ocean-boat',data:d,title:w().board}:old.target(d);
 M.showExtra=info=>info?.kind==='ocean-boat'?(board(),true):old.show?.(info);
 M.startExtra=id=>id==='ocean'?(visitShore(),true):old.start?.(id);
 M.city.update=(...args)=>{
  old.update(...args);if(disposed)return;const paused=document.hidden||!!document.querySelector('dialog[open]')||document.body.dataset.controllerMenu==='true',reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(s.active&&M.mode!=='city')stop();built.update(s,{reduced});boardButton.hidden=s.active||!near()||paused;panel.hidden=!s.active||paused;veil.hidden=!s.active||paused||!poemsOn;
  if(!boardButton.hidden){const other=document.getElementById('origami-house-context');if(other)other.hidden=true;}
  if(s.active){const second=Math.floor(s.time);if(second!==lastSecond){lastSecond=second;distance.textContent=Math.floor(s.distance)+' '+w().distance;}edge.textContent=s.boundary?w().edge:'';edge.hidden=!s.boundary;
   const index=poemAt(s.time),k=lang()+index;if(k!==lastPoem){lastPoem=k;const p=(POEMS[lang()]||POEMS.en)[index];poemTitle.textContent=p[0];stanza.replaceChildren();p.slice(1).forEach(line=>stanza.append(el('span',line)));}
   const phase=s.time%24/24;veil.style.setProperty('--poem-opacity',String(s.paused?.85:reduced?.72:Math.min(1,phase*6,(1-phase)*6)*.72));veil.style.setProperty('--poem-drift',reduced?'0px':((.5-phase)*72)+'px');
   const state=(s.paused?'paused':'sailing');if(lastText!==state){lastText=state;document.body.dataset.oceanVoyage=state;}
  }
 };
 const api={voyage,built,step,interact,board,returnShore,visitShore,copy:w,get active(){return s.active;}};M.oceanSailing=api;
 const query=new URLSearchParams(globalThis.location?.search||'');if(query.get('arrival')==='ocean')visitShore();
 addEventListener('pagehide',()=>{disposed=true;stop();removeEventListener('keydown',key,true);removeEventListener('blur',blur);removeEventListener('city-language',locale);M.arrive=old.arrive;const i=M.city.targets.indexOf(built.vessel);if(i>=0)M.city.targets.splice(i,1);for(const n of[boardButton,panel,veil,launch,mapLaunch])n.remove();built.dispose();},{once:true});return api;
}
