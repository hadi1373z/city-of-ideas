import {PHILOSOPHERS} from './philosopher-data.js';
import {createPhilosopherQuarter} from './philosopher-quarter.js';
import {PLATO_ROOM,PHILOSOPHER_UI,philosopherField} from './plato-house-copy.js';
import {mountPlatoReading} from './plato-house-reading.js';
import {ARISTOTLE_ROOM} from './aristotle-house-copy.js';
import {mountAristotleReading} from './aristotle-house-reading.js';
import {EPICURUS_ROOM} from './epicurus-house-copy.js';
import {mountEpicurusReading} from './epicurus-house-reading.js';
import {HYPATIA_ROOM} from './hypatia-house-copy.js';
import {mountHypatiaReading} from './hypatia-house-reading.js';

export function installPhilosopherQuarter(M,T){
 const lang=()=>window.CITY_I18N.lang,ui=()=>PHILOSOPHER_UI[lang()]||PHILOSOPHER_UI.en,field=(home,key)=>philosopherField(home,key,lang());
 const quarter=createPhilosopherQuarter(T,{language:lang});M.scene.add(quarter.group);window.CITY_PHILOSOPHERS=quarter;
 M.city.targets.push(...quarter.targets);M.city.buildingTargets.push(...quarter.homes.map(h=>h.group));
 M.city.landmarks.philosophers=quarter.entryFor('philosophers');
 const oldRegion=M.city.region,oldCanStand=M.city.canStand,oldTarget=M.city.targetInfo;
 M.city.region=(x,z)=>quarter.region(x,z)||oldRegion(x,z);
 M.city.canStand=(x,z)=>quarter.canStand(x,z)&&oldCanStand(x,z);
 M.city.targetInfo=data=>data.philosopherId?{kind:'philosopher',data,title:field(PHILOSOPHERS.find(h=>h.id===data.philosopherId),'name')}:oldTarget(data);
 const oldStart=M.startExtra;M.startExtra=destination=>{const p=quarter.entryFor(destination);if(!p)return oldStart(destination);if(!M.city.canStand(p.x,p.z))return false;M.arrive(p);return true;};
 const dialog=document.createElement('dialog');dialog.id='philosopher-dialog';dialog.className='philosopher-dialog';dialog.setAttribute('aria-labelledby','philosopher-heading');
 dialog.dataset.confirmFocused='true';
 dialog.innerHTML='<header><div><p class="philosopher-kicker"></p><h2 id="philosopher-heading"></h2></div><button class="glass philosopher-close" type="button"></button></header><div class="philosopher-layout"><nav class="philosopher-homes"></nav><article class="philosopher-study"><p class="philosopher-theme"></p><h3 class="philosopher-name"></h3><p class="philosopher-intro"></p><button class="primary philosopher-visit" type="button"></button><h4 class="philosopher-object-title"></h4><p class="philosopher-idea"></p><h4 class="philosopher-reading-title"></h4><p class="philosopher-reading"></p><section class="plato-details"></section><section class="aristotle-details"></section><section class="epicurus-details"></section><section class="hypatia-details"></section><a class="philosopher-source" target="_blank" rel="noopener noreferrer"></a><h4 class="philosopher-exercise-title"></h4><label for="philosopher-note" class="philosopher-prompt"></label><textarea id="philosopher-note" rows="4" maxlength="20000" dir="auto"></textarea><p class="philosopher-save" role="status"></p><p class="philosopher-interpretation"></p></article></div>';
 document.body.append(dialog);
 const node=selector=>dialog.querySelector(selector),note=node('textarea'),memory=new Map(),platoState={pose:'front'},aristotleState={caseId:'discussion'},epicurusState={setting:'pause'},hypatiaState={stage:'two'};let selected=PHILOSOPHERS[0],storageError=false,opener=null;
 const key=id=>'city-of-ideas:philosopher-reflection:v1:'+id;
 function readNote(id){if(memory.has(id))return memory.get(id);try{const value=localStorage.getItem(key(id))||'';memory.set(id,value);return value;}catch{storageError=true;return '';}}
 note.addEventListener('input',()=>{memory.set(selected.id,note.value);try{localStorage.setItem(key(selected.id),note.value);storageError=false;}catch{storageError=true;}saveStatus();});
 function saveStatus(){node('.philosopher-save').textContent=storageError?ui().failed:ui().saved;}
 function render(){
  const wasFocused=document.activeElement===note,start=note.selectionStart,end=note.selectionEnd,focusKey=document.activeElement?.dataset?.platoFocus,aristotleKey=document.activeElement?.dataset?.aristotleFocus,epicurusKey=document.activeElement?.dataset?.epicurusFocus,hypatiaKey=document.activeElement?.dataset?.hypatiaFocus,c=ui();dialog.lang=lang();dialog.dir=lang()==='fa'?'rtl':'ltr';
  node('.philosopher-kicker').textContent=c.kicker;node('#philosopher-heading').textContent=c.title;
  const close=node('.philosopher-close');close.textContent=c.close;close.setAttribute('aria-label',c.closeAria);
  const nav=node('nav');nav.setAttribute('aria-label',c.choose);nav.replaceChildren();
  for(const home of PHILOSOPHERS){const button=document.createElement('button');button.type='button';button.dataset.philosopher=home.id;button.setAttribute('aria-pressed',String(home.id===selected.id));const name=document.createElement('strong'),small=document.createElement('small');name.textContent=field(home,'name');small.textContent=field(home,'home');button.append(name,small);button.onclick=()=>{selected=home;render();node(".philosopher-study").scrollTop=0;node(`[data-philosopher="${home.id}"]`).focus();};nav.append(button);}
  for(const [selector,key]of [['.philosopher-theme','theme'],['.philosopher-name','name'],['.philosopher-intro','intro'],['.philosopher-object-title','object'],['.philosopher-idea','idea'],['.philosopher-reading','reading'],['.philosopher-prompt','prompt']])node(selector).textContent=field(selected,key);
  node('.philosopher-visit').textContent=c.visit+field(selected,'name');node('.philosopher-reading-title').textContent=c.reading;node('.philosopher-exercise-title').textContent=c.exercise;
  const source=node('.philosopher-source');source.href=selected.source;source.textContent=c.source;source.title=selected.sourceName;
  const details=node('.plato-details');details.hidden=selected.id!=='plato';if(!details.hidden)mountPlatoReading(details,lang(),platoState,{focusKey,onPose:id=>quarter.homes.find(h=>h.id==='plato').exhibit.setPose(id)});else details.replaceChildren();
  const aristotleDetails=node('.aristotle-details');aristotleDetails.hidden=selected.id!=='aristotle';if(!aristotleDetails.hidden)mountAristotleReading(aristotleDetails,lang(),aristotleState,{focusKey:aristotleKey,onCase:id=>quarter.homes.find(h=>h.id==='aristotle').exhibit.selectCase(id)});else aristotleDetails.replaceChildren();
  const epicurusDetails=node('.epicurus-details');epicurusDetails.hidden=selected.id!=='epicurus';if(!epicurusDetails.hidden)mountEpicurusReading(epicurusDetails,lang(),epicurusState,{focusKey:epicurusKey,onSetting:id=>quarter.homes.find(h=>h.id==='epicurus').exhibit.setSetting(id)});else epicurusDetails.replaceChildren();
  const hypatiaDetails=node('.hypatia-details');hypatiaDetails.hidden=selected.id!=='hypatia';if(!hypatiaDetails.hidden)mountHypatiaReading(hypatiaDetails,lang(),hypatiaState,{focusKey:hypatiaKey,onStage:id=>quarter.homes.find(h=>h.id==='hypatia').exhibit.setStage(id)});else hypatiaDetails.replaceChildren();
  note.value=readNote(selected.id);note.setAttribute('placeholder',c.placeholder);saveStatus();
  node('.philosopher-interpretation').textContent=c.interpretation;
  if(wasFocused){note.focus();note.setSelectionRange(start,end);}
 }
 function open(id,section='intro'){selected=PHILOSOPHERS.find(h=>h.id===id)||selected;opener=document.activeElement;M.clearMovement();render();if(!dialog.open)dialog.showModal();node('.philosopher-study').scrollTop=0;if(section==='reading')node('.philosopher-reading-title').scrollIntoView({block:'nearest'});if(section==='idea')node('.philosopher-object-title').scrollIntoView({block:'nearest'});}
 node('.philosopher-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{M.clearMovement();opener?.focus?.();});
 node('.philosopher-visit').onclick=()=>{dialog.close();M.quickStart('philosopher:'+selected.id);};
 const context=document.createElement('aside');context.id='plato-house-context';context.hidden=true;
 const contextButton=document.createElement('button');contextButton.type='button';contextButton.onclick=()=>open('plato','reading');context.append(contextButton);document.body.append(context);
 const aristotleContext=document.createElement('aside');aristotleContext.id='aristotle-house-context';aristotleContext.hidden=true;
 const aristotleButton=document.createElement('button');aristotleButton.type='button';aristotleButton.onclick=()=>open('aristotle','reading');aristotleContext.append(aristotleButton);document.body.append(aristotleContext);
 const epicurusContext=document.createElement('aside');epicurusContext.id='epicurus-house-context';epicurusContext.hidden=true;
 const epicurusButton=document.createElement('button');epicurusButton.type='button';epicurusButton.onclick=()=>open('epicurus','reading');epicurusContext.append(epicurusButton);document.body.append(epicurusContext);
 const hypatiaContext=document.createElement('aside');hypatiaContext.id='hypatia-house-context';hypatiaContext.hidden=true;
 const hypatiaButton=document.createElement('button');hypatiaButton.type='button';hypatiaButton.onclick=()=>open('hypatia','reading');hypatiaContext.append(hypatiaButton);document.body.append(hypatiaContext);
 const oldUpdate=M.city.update;M.city.update=(...args)=>{oldUpdate?.(...args);const id=quarter.region(M.player.x,M.player.z)?.philosopherId,blocked=M.mode!=='city'||!!document.querySelector('dialog[open]');context.hidden=blocked||id!=='plato';aristotleContext.hidden=blocked||id!=='aristotle';epicurusContext.hidden=blocked||id!=='epicurus';hypatiaContext.hidden=blocked||id!=='hypatia';};
 const oldShow=M.showExtra;M.showExtra=info=>{if(info.kind!=='philosopher')return oldShow(info);open(info.data.philosopherId,info.data.philosopherSection);return true;};
 const oldTools=M.toolsExtra;M.toolsExtra=()=>{const r=quarter.region(M.player.x,M.player.z);if(!r)return oldTools();open(r.philosopherId);return true;};
 const welcome=document.createElement('button');welcome.type='button';welcome.className='glass';welcome.id='explore-philosophers';welcome.onclick=()=>open();document.querySelector('.welcome-secondary').append(welcome);
 const toolbar=document.createElement('button');toolbar.type='button';toolbar.className='glass';toolbar.id='philosophers-open';toolbar.onclick=()=>open(quarter.region(M.player.x,M.player.z)?.philosopherId);document.querySelector('.visit-actions').append(toolbar);
 const direction=document.createElement('button');direction.type='button';direction.dataset.direction='philosophers';direction.onclick=()=>{M.pointToward(M.city.landmarks.philosophers);document.querySelector('#map-panel').hidden=true;};document.querySelector('.map-directions').append(direction);
 function languageChanged(){quarter.refreshLanguage();welcome.textContent=ui().welcome;toolbar.textContent=ui().toolbar;direction.textContent=ui().direction;context.lang=aristotleContext.lang=epicurusContext.lang=hypatiaContext.lang=lang();context.dir=aristotleContext.dir=epicurusContext.dir=hypatiaContext.dir=lang()==='fa'?'rtl':'ltr';contextButton.textContent=(PLATO_ROOM[lang()]||PLATO_ROOM.en).open;aristotleButton.textContent=(ARISTOTLE_ROOM[lang()]||ARISTOTLE_ROOM.en).open;epicurusButton.textContent=(EPICURUS_ROOM[lang()]||EPICURUS_ROOM.en).open;hypatiaButton.textContent=(HYPATIA_ROOM[lang()]||HYPATIA_ROOM.en).open;if(dialog.open)render();}
 addEventListener('city-language',languageChanged);languageChanged();render();
 quarter.open=open;
 addEventListener('pagehide',()=>{removeEventListener('city-language',languageChanged);quarter.dispose();dialog.remove();context.remove();aristotleContext.remove();epicurusContext.remove();hypatiaContext.remove();},{once:true});
 return quarter;
}
