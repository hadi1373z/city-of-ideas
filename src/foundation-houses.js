import {FOUNDATION_HOUSES,FOUNDATION_COPY} from './foundation-houses-data.js';
import {BORGES_ROOM,BORGES_SOURCE} from './borges-house-copy.js';
import {ADA_ROOM} from './ada-house-copy.js';
import {mountAdaReading} from './ada-house-reading.js';
import {buildFoundationHouses} from './foundation-houses-scene.js';
export function installHouseFoundations(M,T){
 const built=buildFoundationHouses(T);M.scene.add(built.group);M.city.targets.push(...built.targets);M.city.buildingTargets.push(...built.houses.map(h=>h.group));
 const lang=()=>window.CITY_I18N.lang,w=()=>FOUNDATION_COPY[lang()]||FOUNDATION_COPY.en,name=h=>h.names[lang()]||h.names.en,text=o=>o[lang()]||o.en;
 const el=(tag,content)=>{const n=document.createElement(tag);if(content)n.textContent=content;return n;},button=(label,fn)=>{const b=el('button',label);b.type='button';b.onclick=fn;return b;};
 const dialog=el('dialog');dialog.id='house-foundations';dialog.dataset.confirmFocused='true';dialog.setAttribute('aria-labelledby','house-foundations-title');const header=el('header'),title=el('h2'),close=button('×',()=>dialog.close()),body=el('div');title.id='house-foundations-title';close.dataset.close='';header.append(title,close);dialog.append(header,body);document.body.append(dialog);dialog.addEventListener('close',()=>M.clearMovement());let selected=null,readingContext=null;
 const borges=()=>BORGES_ROOM[lang()]||BORGES_ROOM.en,ada=()=>ADA_ROOM[lang()]||ADA_ROOM.en;
 const adaState={order:'double-add',completed:0};
 function renderBorges(){const copy=borges(),room=el('section');room.className='borges-reading';room.lang=lang();room.append(el('h3',copy.title),el('p',copy.intro));for(const [heading,...paragraphs]of copy.sections){const section=el('section');section.append(el('h4',heading),...paragraphs.map(p=>el('p',p)));room.append(section);}const experiment=el('section');experiment.className='borges-experiment';experiment.append(el('h4',copy.experiment),el('blockquote',copy.sentence),el('p',copy.prompt));const feedback=el('p');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.textContent=readingContext===null?'':copy.responses[readingContext];const choices=copy.contexts.map((label,i)=>{const b=button(label,()=>{readingContext=i;feedback.textContent=copy.responses[i];choices.forEach((n,j)=>n.setAttribute('aria-pressed',String(i===j)));});b.setAttribute('aria-pressed',String(readingContext===i));return b;});experiment.append(...choices,feedback);room.append(experiment);const source=el('a',copy.sources+' · '+BORGES_SOURCE.label);source.href=BORGES_SOURCE.url;source.target='_blank';source.rel='noopener noreferrer';room.append(source,el('small',BORGES_SOURCE.pages),el('small',copy.notice),button(copy.babel,()=>{dialog.close();M.clearMovement();M.startExtra('babel');}));if(lang()==='cs')room.append(el('small',copy.locale));body.append(room);}

 function visit(id,inside=false){const h=built.houses.find(h=>h.data.id===id);if(!h)return false;dialog.close();M.clearMovement();M.arrive(inside?h.insideEntry:h.entry);if(inside)M.player.pitch=h.insideEntry.pitch||0;return true;}
 function render(){
  const focus=document.activeElement?.dataset?.houseFocus;
  title.textContent=selected?name(selected):w().title;dialog.lang=lang();dialog.dir=lang()==='fa'?'rtl':'ltr';close.setAttribute('aria-label',w().close);body.replaceChildren();
  if(['borges','ada'].includes(selected?.id)){
   body.append(button(w().directory,()=>{selected=null;render();}),button(w().enter,()=>visit(selected.id,true)));
   if(selected.id==='borges')renderBorges();else mountAdaReading(body,lang(),adaState,focus);
   return;
  }
  body.append(el('p',w().intro));const list=selected?[selected]:FOUNDATION_HOUSES;
  if(selected)body.append(button(w().directory,()=>{selected=null;render();}));
  for(const h of list){const card=el('article');card.append(el('small',w().stage),el('h3',name(h)),el('p',w().feature+' · '+text(h.feature)),el('p',w().later+' · '+text(h.next)),button(w().approach,()=>visit(h.id)),button(w().enter,()=>visit(h.id,true)));body.append(card);}
  body.append(el('small',w().notice));
 }
 function open(id){selected=FOUNDATION_HOUSES.find(h=>h.id===id)||null;M.clearMovement();render();if(!dialog.open)dialog.showModal();body.scrollTop=0;close.focus();}
 const launch=button('',()=>open()),mapLaunch=button('',()=>open());launch.className=mapLaunch.className='glass';document.querySelector('.welcome-secondary')?.append(launch);document.querySelector('.map-directions')?.append(mapLaunch);
 const context=el('aside');context.id='house-foundations-context';context.hidden=true;const contextName=el('strong'),contextButton=button('',()=>open(context.dataset.house));context.append(contextName,contextButton);document.body.append(context);
 const old={canStand:M.city.canStand,region:M.city.region,target:M.city.targetInfo,show:M.showExtra,start:M.startExtra,update:M.city.update};
 M.city.canStand=(x,z)=>built.canStand(x,z)&&old.canStand(x,z);
 M.city.region=(x,z)=>{const h=built.houses.find(h=>h.inside(x,z));return h?{id:'house-foundation',houseId:h.data.id,title:name(h.data),inside:true}:old.region(x,z);};
 M.city.targetInfo=d=>d?.foundationHouse?{kind:'house-foundation',data:d,title:name(FOUNDATION_HOUSES.find(h=>h.id===d.foundationHouse)||FOUNDATION_HOUSES[0])}:old.target(d);
 M.showExtra=info=>info?.kind==='house-foundation'?(open(info.data.foundationHouse),true):old.show?.(info);
 M.startExtra=id=>id==='new-houses'?(open(),true):typeof id==='string'&&id.startsWith('house:')?visit(id.slice(6)):old.start?.(id);
 M.city.update=(...args)=>{old.update(...args);const h=built.houses.find(h=>h.inside(M.player.x,M.player.z)||Math.hypot(M.player.x-h.entry.x,M.player.z-h.entry.z)<20),paused=!!document.querySelector('dialog[open]');context.hidden=M.mode!=='city'||!h||paused||(!['borges','ada'].includes(h.data.id)&&h.inside(M.player.x,M.player.z));if(h){context.dataset.house=h.data.id;contextName.textContent=name(h.data);contextButton.textContent=h.data.id==='borges'?borges().read:h.data.id==='ada'?ada().read:w().stage;}};
 const locale=()=>{launch.textContent=mapLaunch.textContent=w().title;context.dir=lang()==='fa'?'rtl':'ltr';for(const h of built.houses)h.paint(lang());if(dialog.open)render();};locale();addEventListener('city-language',locale);
 function interact(){const h=built.houses.find(h=>['borges','ada'].includes(h.data.id)&&h.inside(M.player.x,M.player.z));if(M.mode!=='city'||document.querySelector('dialog[open]')||!h)return false;open(h.data.id);return true;}
 const api={built,open,visit,interact};M.houseFoundations=api;window.CITY_HOUSE_FOUNDATIONS=api;
 const query=new URLSearchParams(globalThis.location?.search||'');if(query.get('arrival')==='new-houses')open();else if(query.get('arrival')?.startsWith('house:'))visit(query.get('arrival').slice(6));
 addEventListener('pagehide',()=>{removeEventListener('city-language',locale);for(const target of built.targets){const i=M.city.targets.indexOf(target);if(i>=0)M.city.targets.splice(i,1);}for(const h of built.houses){const i=M.city.buildingTargets.indexOf(h.group);if(i>=0)M.city.buildingTargets.splice(i,1);}built.dispose();for(const n of[dialog,launch,mapLaunch,context])n.remove();},{once:true});return api;
}
