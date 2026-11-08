/* Small classic-script feedback: it appears before the city module graph loads.
   Stages are real coordinator milestones, never a simulated percentage. */
(()=>{'use strict';
 if(window.CITY_STARTUP)return;
 const COPY={
  gallery:['Opening City of Ideas','Preparing the gallery and island.'],
  'source-modules':['Connecting the city','Loading the shared rooms and collections.'],
  mathematics:['Preparing Mathematics','Building the eight working floors and their original exhibits.'],
  studios:['Opening the houses','Connecting studios, reading rooms and their entrances.'],
  connected:['Preparing your entrance','The shared city is connected. Opening your chosen view.'],
  entrance:['Preparing your entrance','Opening Babel beneath the volcano.']
 };
 const el=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 const panel=el('aside');panel.id='city-startup-progress';panel.lang='en';panel.dir='ltr';panel.setAttribute('aria-label','City loading status');
 const symbol=el('span');symbol.className='city-startup-symbol';symbol.setAttribute('aria-hidden','true');
 const status=el('div');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
 const title=el('strong'),detail=el('p'),waiting=el('p');waiting.className='city-startup-wait';waiting.hidden=true;status.append(title,detail);
 const reload=el('button','Reload the city');reload.type='button';reload.hidden=true;reload.onclick=()=>window.location.reload();
 panel.append(symbol,status,waiting,reload);document.body.append(panel);
 const world=document.getElementById('world'),oldBusy=world?.getAttribute('aria-busy');world?.setAttribute('aria-busy','true');
 const now=()=>window.performance?.now?.()??Date.now(),started=now();let terminal=false,disposed=false;
 const timer=setTimeout(()=>{if(terminal||disposed)return;waiting.textContent='Still connecting. Large 3D collections can take longer on a first visit.';waiting.hidden=false;reload.hidden=false;},12000);
 function stage(id){if(terminal||disposed||!Object.hasOwn(COPY,id))return;panel.dataset.stage=id;if(world)world.dataset.startupPhase=id;[title.textContent,detail.textContent]=COPY[id];}
 function clear(){clearTimeout(timer);window.removeEventListener('error',failedScript,true);}
 function ready(){if(terminal||disposed)return;terminal=true;clear();if(world){world.dataset.startupPhase='ready';world.dataset.startupMs=String(Math.round(now()-started));}world?.setAttribute('aria-busy','false');panel.remove();}
 function fail(){if(terminal||disposed)return;terminal=true;clear();panel.dataset.stage='failed';title.textContent='The city could not finish opening';detail.textContent='Reload to try the connection again. Your existing destinations remain available after loading.';waiting.hidden=true;reload.hidden=false;world?.setAttribute('aria-busy','false');}
 function failedScript(event){const target=event.target;if(target?.tagName==='SCRIPT'&&/(?:city-integration|gallery|three\.min)\.js(?:[?#]|$)/.test(target.src||''))fail();}
 function dispose(){if(disposed)return;disposed=true;clear();panel.remove();if(world){if(oldBusy===null||oldBusy===undefined)world.removeAttribute('aria-busy');else world.setAttribute('aria-busy',oldBusy);}if(window.CITY_STARTUP===api)delete window.CITY_STARTUP;}
 const api={stage,ready,fail,dispose,get phase(){return panel.dataset.stage;}};window.CITY_STARTUP=api;
 window.addEventListener('error',failedScript,true);window.addEventListener('pagehide',dispose,{once:true});stage('gallery');
})();
